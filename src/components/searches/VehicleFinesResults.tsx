
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface VehicleFinesResultsProps {
  results: any
}

export default function VehicleFinesResults({ results }: VehicleFinesResultsProps) {
  // Verificações de segurança mais robustas
  if (!results) {
    console.log('No results')
    return null
  }
  if (!results.data) {
    console.log('No results.data')
    return null
  }
  if (!results.data.fines) {
    console.log('No results.data.fines')
    return null
  }
  if (!Array.isArray(results.data.fines)) {
    console.log('results.data.fines is not an array:', typeof results.data.fines)
    return null
  }

  const { fines } = results.data
  
  // Cálculos seguros com verificação adicional
  const total_value = results.data.total_value || (Array.isArray(fines) ? fines.reduce((sum: number, fine: any) => sum + (fine.value || 0), 0) : 0)
  const total_points = results.data.total_points || (Array.isArray(fines) ? fines.reduce((sum: number, fine: any) => sum + (fine.points || 0), 0) : 0)

  return (
    <div className="space-y-4 mt-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Modo demonstração: Estes são dados de exemplo. Na versão final, serão dados reais da API Infosimples.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Multas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fines.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ {total_value.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pontos na CNH</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total_points}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Detalhes das Infrações</h3>
        {fines.map((fine: any, index: number) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-1">
                  <p className="font-medium">{fine.auto_number || `AUTO-${index + 1}`}</p>
                  <p className="text-sm text-muted-foreground">{fine.description || "Descrição não disponível"}</p>
                  <p className="text-xs text-muted-foreground">{fine.location || "Local não especificado"}</p>
                </div>
                <Badge variant={fine.status === 'pending' ? 'destructive' : 'secondary'}>
                  {fine.status === 'pending' ? 'Pendente' : 'Pago'}
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <span>Data: {fine.date ? format(new Date(fine.date), "dd/MM/yyyy", { locale: ptBR }) : "Não informada"}</span>
                  <span>{fine.points || 0} pontos</span>
                </div>
                <p className="font-semibold">R$ {(fine.value || 0).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
