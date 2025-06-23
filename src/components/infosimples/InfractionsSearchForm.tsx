
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import { Loader2, Search, AlertTriangle, Calendar, MapPin, DollarSign } from "lucide-react";
import { InfosimplesService } from "@/services/api/infosimples-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Infraction {
  auto_infracao?: string;
  descricao?: string;
  data_infracao?: string;
  hora_infracao?: string;
  local?: string;
  valor?: string;
  pontos?: string;
  situacao?: string;
  codigo_infracao?: string;
}

interface InfractionsResult {
  infractions?: any[];
  summary?: {
    total_infractions: number;
    total_value: number;
    total_points: number;
  };
}

interface InfractionsSearchFormProps {
  clientId?: string;
  vehicleId?: string;
}

export default function InfractionsSearchForm({ clientId, vehicleId }: InfractionsSearchFormProps) {
  const { user } = useSupabaseAuth();
  const [searchType, setSearchType] = useState<'placa' | 'renavam' | 'cpf'>('placa');
  const [placa, setPlaca] = useState("");
  const [renavam, setRenavam] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InfractionsResult | null>(null);

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

    if (searchType === 'cpf') {
      if (!cpf) {
        toast.error("CPF é obrigatório");
        return;
      }
      if (!InfosimplesService.isValidCPF(cpf)) {
        toast.error("CPF inválido");
        return;
      }
    }

    setLoading(true);
    setResult(null);

    try {
      const cleanPlaca = searchType === 'placa' ? placa.replace(/[^A-Z0-9]/g, "") : undefined;
      const cleanCpf = searchType === 'cpf' ? cpf.replace(/\D/g, "") : undefined;
      
      console.log("Starting infractions search:", { searchType, placa: cleanPlaca, renavam, cpf: cleanCpf });

      const response = await InfosimplesService.consultarInfracoes({
        placa: cleanPlaca,
        renavam: searchType === 'renavam' ? renavam : undefined,
        cpf: cleanCpf,
        user_id: user.id,
        vehicle_id: vehicleId,
        client_id: clientId
      });

      console.log("Infractions search completed:", response);

      if (response.success && response.data) {
        // Normalizar dados se necessário
        const normalizedData = Array.isArray(response.data) 
          ? { infractions: response.data, summary: { total_infractions: response.data.length, total_value: 0, total_points: 0 } }
          : response.data;

        setResult(normalizedData);
        toast.success(`Consulta realizada com sucesso! ${normalizedData.summary?.total_infractions || normalizedData.infractions?.length || 0} infração(ões) encontrada(s)`);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('pago') || statusLower.includes('quitado')) return 'bg-green-500';
    if (statusLower.includes('vencido')) return 'bg-red-500';
    if (statusLower.includes('pendente')) return 'bg-yellow-500';
    return 'bg-gray-500';
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
            Busque infrações por placa, RENAVAM ou CPF do condutor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="placa">Por Placa</TabsTrigger>
                <TabsTrigger value="renavam">Por RENAVAM</TabsTrigger>
                <TabsTrigger value="cpf">Por CPF</TabsTrigger>
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

              <TabsContent value="cpf" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF do Condutor</Label>
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
              </TabsContent>
            </Tabs>

            <Button 
              onClick={handleConsultar} 
              disabled={loading || 
                (searchType === 'placa' && !placa) || 
                (searchType === 'renavam' && !renavam) || 
                (searchType === 'cpf' && !cpf)} 
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

      {result?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Infrações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{result.summary.total_infractions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(result.summary.total_value)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pontos Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{result.summary.total_points}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {result?.infractions && result.infractions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Infrações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.infractions.map((infraction: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{infraction.description || infraction.api_data?.descricao}</p>
                        <p className="text-sm text-muted-foreground">
                          Auto: {infraction.auto_number || infraction.api_data?.auto_infracao}
                        </p>
                      </div>
                      <Badge className={getStatusColor(infraction.status || infraction.api_data?.situacao)}>
                        {infraction.status || infraction.api_data?.situacao || 'Pendente'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{infraction.date || infraction.api_data?.data_infracao} às {infraction.time || infraction.api_data?.hora_infracao}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatCurrency(infraction.value || 0)}</span>
                      </div>
                    </div>

                    {(infraction.location || infraction.api_data?.local) && (
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{infraction.location || infraction.api_data?.local}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span>Código: {infraction.infraction_code || infraction.api_data?.codigo_infracao}</span>
                      <span className="font-medium">{infraction.points || infraction.api_data?.pontos || 0} pontos</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {result && (!result.infractions || result.infractions.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma infração encontrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
