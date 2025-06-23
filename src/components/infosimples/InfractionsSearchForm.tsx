
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import { Loader2, Search, AlertTriangle, FileText } from "lucide-react";
import { InfosimplesService } from "@/services/api/infosimples-service";

interface InfractionResult {
  auto_number?: string;
  date?: string;
  description?: string;
  value?: number;
  points?: number;
  status?: string;
  location?: string;
  due_date?: string;
}

interface InfractionsSearchFormProps {
  clientId?: string;
  vehicleId?: string;
}

export default function InfractionsSearchForm({ clientId, vehicleId }: InfractionsSearchFormProps) {
  const { user } = useSupabaseAuth();
  const [placa, setPlaca] = useState("");
  const [renavam, setRenavam] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InfractionResult[] | null>(null);

  const handleConsultar = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para fazer consultas");
      return;
    }

    if (!placa && !renavam) {
      toast.error("Informe pelo menos a placa ou RENAVAM");
      return;
    }

    if (cpf && !InfosimplesService.isValidCPF(cpf)) {
      toast.error("CPF inválido");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const cleanPlaca = placa.replace(/[^A-Z0-9]/g, "");
      const cleanCpf = cpf.replace(/\D/g, "");
      
      console.log("Starting infractions search:", { placa: cleanPlaca, renavam, cpf: cleanCpf });

      const response = await InfosimplesService.consultarInfracoes({
        placa: cleanPlaca || undefined,
        renavam: renavam || undefined,
        cpf: cleanCpf || undefined,
        user_id: user.id,
        vehicle_id: vehicleId,
        client_id: clientId
      });

      console.log("Infractions search completed:", response);

      if (response.success && response.data) {
        setResult(Array.isArray(response.data) ? response.data : [response.data]);
        toast.success("Consulta de infrações realizada com sucesso");
      } else {
        throw new Error(response.error || "Falha na consulta de infrações");
      }
    } catch (err: any) {
      console.error("Infractions search error:", err);
      setResult(null);
      toast.error(`Erro na consulta: ${err.message || "Falha na consulta de infrações"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Consultar Infrações - Rio de Janeiro
          </CardTitle>
          <CardDescription>
            Busque infrações de trânsito usando placa, RENAVAM e/ou CPF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placa">Placa (opcional)</Label>
                <Input
                  id="placa"
                  type="text"
                  placeholder="AAA-0A00"
                  value={placa}
                  onChange={(e) => setPlaca(InfosimplesService.formatPlaca(e.target.value))}
                  maxLength={8}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="renavam">RENAVAM (opcional)</Label>
                <Input
                  id="renavam"
                  type="text"
                  placeholder="00000000000"
                  value={renavam}
                  onChange={(e) => setRenavam(e.target.value.replace(/\D/g, ""))}
                  maxLength={11}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF (opcional)</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(InfosimplesService.formatCPF(e.target.value))}
                  maxLength={14}
                  disabled={loading}
                />
              </div>
            </div>

            <Button 
              onClick={handleConsultar} 
              disabled={loading || (!placa && !renavam)} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Consultar Infrações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Consultando infrações... Aguarde alguns segundos.
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-4">
          {result.length === 0 ? (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Nenhuma infração encontrada para os dados informados.
              </AlertDescription>
            </Alert>
          ) : (
            result.map((infraction, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-4 w-4" />
                    Infração #{infraction.auto_number || index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Auto de Infração</p>
                      <p className="font-medium">{infraction.auto_number || "N/A"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p className="font-medium">{infraction.date || "N/A"}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Valor</p>
                      <p className="font-medium">
                        {infraction.value 
                          ? `R$ ${infraction.value.toFixed(2)}` 
                          : "N/A"
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Pontos</p>
                      <p className="font-medium">{infraction.points || "0"}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{infraction.status || "N/A"}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Vencimento</p>
                      <p className="font-medium">{infraction.due_date || "N/A"}</p>
                    </div>

                    {infraction.description && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Descrição</p>
                        <p className="font-medium">{infraction.description}</p>
                      </div>
                    )}

                    {infraction.location && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Local</p>
                        <p className="font-medium">{infraction.location}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
