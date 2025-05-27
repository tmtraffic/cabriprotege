
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface CnhResultsProps {
  results: any
}

export default function CnhResults({ results }: CnhResultsProps) {
  // Verificações de segurança
  if (!results) return null
  if (!results.data) return null
  if (!results.data.cnh) return null

  const { cnh } = results.data

  return (
    <div className="space-y-4 mt-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Modo demonstração: Estes são dados de exemplo. Na versão final, serão dados reais da API Infosimples.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Dados da CNH</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Número</Label>
              <p className="font-medium">{cnh.number || "Não informado"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Categoria</Label>
              <p className="font-medium">{cnh.category || "Não informada"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data de Emissão</Label>
              <p className="font-medium">
                {cnh.issue_date ? format(new Date(cnh.issue_date), "dd/MM/yyyy", { locale: ptBR }) : "Não informada"}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Validade</Label>
              <p className="font-medium">
                {cnh.expiration_date ? format(new Date(cnh.expiration_date), "dd/MM/yyyy", { locale: ptBR }) : "Não informada"}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Primeira Habilitação</Label>
              <p className="font-medium">
                {cnh.first_license_date ? format(new Date(cnh.first_license_date), "dd/MM/yyyy", { locale: ptBR }) : "Não informada"}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Pontos Disponíveis</Label>
              <p className="font-medium">{cnh.points || 0} pontos</p>
            </div>
          </div>

          {cnh.infractions && Array.isArray(cnh.infractions) && cnh.infractions.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-3">Infrações Registradas</h4>
              <div className="space-y-2">
                {cnh.infractions.map((infraction: any, index: number) => (
                  <Alert key={index}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <span className="font-medium">
                        {infraction.date ? format(new Date(infraction.date), "dd/MM/yyyy", { locale: ptBR }) : "Data não informada"}
                      </span>
                      {" - "}
                      {infraction.description || "Descrição não disponível"}
                      {" - "}
                      <span className="font-medium">{infraction.points || 0} pontos</span>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
