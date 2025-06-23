
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import { Loader2, Search, Car, Info } from "lucide-react";
import { InfosimplesService } from "@/services/api/infosimples-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VehicleResult {
  placa?: string;
  renavam?: string;
  marca?: string;
  modelo?: string;
  ano_fabricacao?: string;
  ano_modelo?: string;
  cor?: string;
  combustivel?: string;
  numero_motor?: string;
  chassi?: string;
  categoria?: string;
  tipo?: string;
  especie?: string;
  potencia?: string;
  cilindradas?: string;
  procedencia?: string;
  situacao?: string;
  restricoes?: any[];
}

interface PlateSearchFormProps {
  clientId?: string;
}

export default function PlateSearchForm({ clientId }: PlateSearchFormProps) {
  const { user } = useSupabaseAuth();
  const [searchType, setSearchType] = useState<'placa' | 'renavam'>('placa');
  const [placa, setPlaca] = useState("");
  const [renavam, setRenavam] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VehicleResult | null>(null);

  const handleConsultar = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para fazer consultas");
      return;
    }

    // Validar entrada
    if (searchType === 'placa' && !placa) {
      toast.error("Placa é obrigatória");
      return;
    }

    if (searchType === 'renavam' && !renavam) {
      toast.error("RENAVAM é obrigatório");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log("Starting vehicle search:", { searchType, placa, renavam });

      const response = await InfosimplesService.consultarVeiculo({
        placa: searchType === 'placa' ? placa.replace(/[^A-Z0-9]/g, "") : undefined,
        renavam: searchType === 'renavam' ? renavam : undefined,
        user_id: user.id,
        client_id: clientId
      });

      console.log("Vehicle search completed:", response);

      if (response.success && response.data) {
        setResult(response.data);
        toast.success("Consulta de veículo realizada com sucesso");
      } else {
        throw new Error(response.error || "Falha na consulta de veículo");
      }
    } catch (err: any) {
      console.error("Vehicle search error:", err);
      setResult(null);
      toast.error(`Erro na consulta: ${err.message || "Falha na consulta de veículo"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Consultar Veículo - Rio de Janeiro
          </CardTitle>
          <CardDescription>
            Busque informações de veículos por placa ou RENAVAM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Tabs value={searchType} onValueChange={(v) => setSearchType(v as 'placa' | 'renavam')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="placa">Por Placa</TabsTrigger>
                <TabsTrigger value="renavam">Por RENAVAM</TabsTrigger>
              </TabsList>
              
              <TabsContent value="placa" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="placa">Placa do Veículo</Label>
                  <Input
                    id="placa"
                    type="text"
                    placeholder="ABC-1234"
                    value={placa}
                    onChange={(e) => setPlaca(InfosimplesService.formatPlaca(e.target.value))}
                    maxLength={8}
                    disabled={loading}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="renavam" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="renavam">RENAVAM</Label>
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
              </TabsContent>
            </Tabs>

            <Button 
              onClick={handleConsultar} 
              disabled={loading || (searchType === 'placa' && !placa) || (searchType === 'renavam' && !renavam)} 
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
                  Consultar Veículo
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
            Consultando dados do veículo... Aguarde alguns segundos.
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Informações do Veículo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Placa</p>
                  <p className="font-medium">{result.placa || "N/A"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">RENAVAM</p>
                  <p className="font-medium">{result.renavam || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Marca/Modelo</p>
                  <p className="font-medium">{result.marca} {result.modelo}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Ano Fab/Modelo</p>
                  <p className="font-medium">{result.ano_fabricacao}/{result.ano_modelo}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Cor</p>
                  <p className="font-medium">{result.cor || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Combustível</p>
                  <p className="font-medium">{result.combustivel || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Chassi</p>
                  <p className="font-medium">{result.chassi || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Motor</p>
                  <p className="font-medium">{result.numero_motor || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-medium">{result.categoria || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium">{result.tipo || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Espécie</p>
                  <p className="font-medium">{result.especie || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Situação</p>
                  <p className="font-medium">{result.situacao || "N/A"}</p>
                </div>

                {result.potencia && (
                  <div>
                    <p className="text-sm text-muted-foreground">Potência</p>
                    <p className="font-medium">{result.potencia}</p>
                  </div>
                )}

                {result.cilindradas && (
                  <div>
                    <p className="text-sm text-muted-foreground">Cilindradas</p>
                    <p className="font-medium">{result.cilindradas}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {result.restricoes && result.restricoes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Restrições</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.restricoes.map((restricao: any, index: number) => (
                    <Alert key={index} variant="destructive">
                      <AlertDescription>
                        {restricao.descricao || restricao}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
