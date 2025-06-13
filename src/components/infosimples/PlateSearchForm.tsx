
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

export default function PlateSearchForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

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

    setLoading(true);
    setResult(null);
    
    try {
      const cleanPlate = plate.replace(/[^A-Z0-9]/g, "");
      console.log('Starting search for:', cleanPlate);
      
      const response = await InfosimplesService.runPlateSearch(cleanPlate, user.id);
      
      console.log('Search completed:', response);
      
      if (response.completed && response.data) {
        setResult(response.data);
        toast({
          title: "Consulta concluída",
          description: "Dados do veículo carregados com sucesso"
        });
        
        // Log site receipts if available
        if (response.site_receipts?.length > 0) {
          console.log('Comprovantes disponíveis:', response.site_receipts);
        }
      }
      
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
              Consultando dados do veículo... Aguarde alguns segundos.
            </AlertDescription>
          </Alert>
        )}
        
        {result && (
          <div className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do Veículo</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap break-all rounded bg-muted p-4 text-sm max-h-96 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
