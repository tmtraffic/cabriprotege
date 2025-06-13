
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import * as InfosimplesService from "@/services/api/infosimples-service";
import { Search } from "lucide-react";

export default function CnhSearchForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [cnh, setCnh] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const formatCnh = (value: string) => value.replace(/\D/g, "").slice(0, 11);

  const startSearch = async () => {
    if (!user) {
      toast({ 
        title: "Erro", 
        description: "Usuário não autenticado", 
        variant: "destructive" 
      });
      return;
    }
    
    if (cnh.length !== 11 || !birthDate) {
      toast({ 
        title: "Dados inválidos", 
        description: "Digite uma CNH válida (11 dígitos) e data de nascimento",
        variant: "destructive" 
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const { requestId, protocol } = await InfosimplesService.runCNHSearch(cnh, birthDate, user.id);
      
      // Polling para resultado
      const poll = setInterval(async () => {
        try {
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
          clearInterval(poll);
          setLoading(false);
          toast({ 
            title: "Erro", 
            description: err.message, 
            variant: "destructive" 
          });
        }
      }, 5000);
    } catch (err: any) {
      setLoading(false);
      toast({ 
        title: "Erro", 
        description: err.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta por CNH</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 max-w-sm">
          <div className="space-y-2">
            <Label htmlFor="cnh">Número da CNH</Label>
            <Input
              id="cnh"
              value={cnh}
              onChange={(e) => setCnh(formatCnh(e.target.value))}
              placeholder="Digite o número da CNH"
              maxLength={11}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input 
              id="birthDate"
              type="date" 
              value={birthDate} 
              onChange={(e) => setBirthDate(e.target.value)} 
            />
          </div>
        </div>
        
        <Button 
          onClick={startSearch} 
          disabled={loading || cnh.length !== 11 || !birthDate}
          className="mt-4"
        >
          {loading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4 mr-2" />}
          {loading ? "Consultando..." : "Buscar CNH"}
        </Button>
        
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
