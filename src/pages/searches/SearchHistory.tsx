
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Search, FileText, CreditCard, Car, Clock } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

export default function SearchHistory() {
  const { toast } = useToast()
  const [searches, setSearches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSearchHistory()
  }, [])

  const fetchSearchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('infosimples_searches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setSearches(data || [])
    } catch (error) {
      console.error('Error fetching search history:', error)
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de consultas",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getSearchTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'vehicle_fines': 'Multas de Veículo',
      'driver_cnh': 'Consulta CNH',
      'vehicle_crlv': 'Consulta CRLV',
      'renavam': 'Consulta RENAVAM'
    }
    return types[type] || type
  }

  const getSearchTypeIcon = (type: string) => {
    switch(type) {
      case 'vehicle_fines':
        return <Car className="h-4 w-4" />
      case 'driver_cnh':
        return <CreditCard className="h-4 w-4" />
      case 'vehicle_crlv':
        return <FileText className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
      case 'error':
        return <Badge variant="destructive">Erro</Badge>
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <p>Carregando histórico...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Histórico de Consultas</h1>
        <p className="text-muted-foreground mt-2">
          Veja todas as consultas realizadas no sistema
        </p>
      </div>

      <div className="grid gap-4">
        {searches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Nenhuma consulta realizada</p>
              <p className="text-muted-foreground">As consultas aparecerão aqui</p>
            </CardContent>
          </Card>
        ) : (
          searches.map((search) => (
            <Card key={search.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSearchTypeIcon(search.search_type)}
                    <CardTitle className="text-lg">
                      {getSearchTypeLabel(search.search_type)}
                    </CardTitle>
                  </div>
                  {getStatusBadge(search.status)}
                </div>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(search.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Parâmetros: {JSON.stringify(search.search_params)}</p>
                  {search.error_message && (
                    <p className="text-red-600 mt-2">Erro: {search.error_message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
