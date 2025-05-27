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
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Não autenticado",
          description: "Você precisa estar logado para ver o histórico",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      console.log('Search history data:', data)
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

  const getStatusBadge = (resultData: any) => {
    if (resultData && resultData.success) {
      return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
    } else if (resultData && resultData.error) {
      return <Badge variant="destructive">Erro</Badge>
    } else {
      return <Badge variant="secondary">Demo</Badge>
    }
  }

  const getResultSummary = (search: any) => {
    // Usar result_data ao invés de raw_result_data
    const data = search.result_data || search.response_data
    if (!data) return "Sem dados"
    
    if (search.search_type === 'vehicle_fines' && data.data && data.data.fines) {
      return `${data.data.fines.length} multa(s) encontrada(s)`
    } else if (search.search_type === 'driver_cnh' && data.data && data.data.cnh) {
      return `CNH categoria ${data.data.cnh.category} - ${data.data.cnh.points} pontos`
    }
    
    return "Consulta realizada"
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
                  {getStatusBadge(search.result_data || search.response_data)}
                </div>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(search.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Consulta: </span>
                    {search.search_query}
                  </div>
                  <div>
                    <span className="font-medium">Resultado: </span>
                    <span className="text-muted-foreground">{getResultSummary(search)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}