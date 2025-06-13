
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import * as InfosimplesService from "@/services/api/infosimples-service";
import { Search, Car, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

function formatPlate(value: string) {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  let formatted = cleaned;
  if (formatted.length > 3) {
    formatted = `${formatted.slice(0, 3)}-${formatted.slice(3)}`;
  }
  return formatted.slice(0, 8);
}

interface SearchResult {
  vehicle?: any;
  multas?: any;
}

export default function PlateSearchForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(formatPlate(e.target.value));
  };

  const startSearch = async () => {
    console.log('Starting search...');
    console.log('User:', user);
    
    if (!user) {
      console.error('No user found in context');
      toast({ 
        title: "Erro de Autenticação", 
        description: "Você precisa estar logado para fazer consultas", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!plate || plate.length < 7) {
      toast({ 
        title: "Placa inválida", 
        description: "Digite uma placa válida",
        variant: "destructive" 
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      
      const cleaned = plate.replace(/[^A-Z0-9]/g, "");
      
      console.log('Calling runPlateSearch with:', {
        plate: cleaned,
        userId: user.id,
        userEmail: user.email
      });
      
      // First get vehicle data
      const vehicleResult = await InfosimplesService.runPlateSearch(cleaned, user.id);
      
      console.log('Vehicle result:', vehicleResult);
      
      let finalResult: SearchResult = {
        vehicle: vehicleResult.vehicleData
      };

      // If we have RENAVAM and can extract CPF, search for fines
      if (vehicleResult.vehicleData?.renavam) {
        try {
          // Try to extract CPF from email or use a placeholder
          const cpfMatch = user.email?.match(/\d{11}/);
          const cpf = cpfMatch?.[0] || '00000000000'; // Fallback CPF
          
          console.log('Searching for multas with RENAVAM:', vehicleResult.vehicleData.renavam);
          
          const multasResult = await InfosimplesService.runMultasSearch(
            vehicleResult.vehicleData.renavam,
            cpf,
            user.id
          );
          
          console.log('Multas result:', multasResult);
          finalResult.multas = multasResult;
        } catch (multasError) {
          console.error('Error fetching multas:', multasError);
          // Continue without multas data
        }
      }
      
      setResult(finalResult);
      toast({
        title: "Consulta concluída",
        description: "Dados do veículo carregados com sucesso"
      });
      
    } catch (err: any) {
      console.error('Search error:', err);
      setResult(null);
      toast({ 
        title: "Erro na Consulta", 
        description: `Erro: ${err.message || 'Falha na consulta'}`, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Consulta por Placa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 max-w-xs">
          <Input 
            value={plate} 
            onChange={handleChange} 
            placeholder="AAA-0A00"
            maxLength={8}
            disabled={loading}
          />
          <Button 
            onClick={startSearch} 
            disabled={!plate || loading || plate.length < 7}
          >
            {loading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        
        {loading && (
          <Alert>
            <LoadingSpinner size="sm" />
            <AlertDescription>
              Consultando dados do veículo e multas... Aguarde alguns segundos.
            </AlertDescription>
          </Alert>
        )}
        
        {result && (
          <div className="mt-4 space-y-4">
            {result.vehicle && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dados do Veículo</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap break-all rounded bg-muted p-4 text-sm max-h-96 overflow-auto">
                    {JSON.stringify(result.vehicle, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
            
            {result.multas && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Multas e Infrações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap break-all rounded bg-muted p-4 text-sm max-h-96 overflow-auto">
                    {JSON.stringify(result.multas, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
            
            {!result.multas && result.vehicle && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Dados de multas não disponíveis. Isso pode ocorrer se o RENAVAM não estiver disponível ou se não foi possível identificar o CPF do proprietário.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
