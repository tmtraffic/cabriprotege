
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import * as InfosimplesService from "@/services/api/infosimples-service";
import { Search } from "lucide-react";

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
  const [result, setResult] = useState<any | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(formatPlate(e.target.value));
  };

  const startSearch = async () => {
    console.log('Starting search...');
    console.log('User:', user);
    console.log('User ID:', user?.id);
    console.log('User session:', user?.aud);
    
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
      
      // Before calling the API, check credentials
      console.log('Checking Infosimples credentials...');
      
      const cleaned = plate.replace(/[^A-Z0-9]/g, "");
      
      // Log the request details
      console.log('Calling runPlateSearch with:', {
        plate: cleaned,
        userId: user.id,
        userEmail: user.email
      });
      
      const { requestId, protocol } = await InfosimplesService.runPlateSearch(cleaned, user.id);
      
      console.log('Search initiated successfully:', { requestId, protocol });
      
      // Polling para resultado
      const poll = setInterval(async () => {
        try {
          console.log('Polling for result...');
          const data = await InfosimplesService.pollResult(requestId, protocol);
          if (data && !(data as any).status) {
            clearInterval(poll);
            setResult(data);
            setLoading(false);
            toast({
              title: "Consulta concluída",
              description: "Resultado da busca carregado com sucesso"
            });
          }
        } catch (err: any) {
          console.error('Polling error:', err);
          clearInterval(poll);
          setLoading(false);
          toast({ 
            title: "Erro no polling", 
            description: err.message, 
            variant: "destructive" 
          });
        }
      }, 5000);
    } catch (err: any) {
      console.error('Search error:', err);
      setLoading(false);
      toast({ 
        title: "Erro na Consulta", 
        description: `Erro: ${err.message || 'Falha na consulta'}`, 
        variant: "destructive" 
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta por Placa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 max-w-xs">
          <Input 
            value={plate} 
            onChange={handleChange} 
            placeholder="AAA-0A00"
            maxLength={8}
          />
          <Button 
            onClick={startSearch} 
            disabled={!plate || loading || plate.length < 7}
          >
            {loading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoadingSpinner size="sm" />
            <span>Consultando... Aguarde alguns segundos.</span>
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Resultado da Consulta:</h4>
            <pre className="whitespace-pre-wrap break-all rounded bg-muted p-4 text-sm max-h-96 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
