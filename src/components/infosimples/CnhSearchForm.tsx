import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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
      toast({ title: "Erro", description: "Usuário não autenticado", variant: "destructive" });
      return;
    }
    if (cnh.length !== 11 || !birthDate) {
      toast({ title: "Dados inválidos", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const { requestId, protocol } = await InfosimplesService.runCNHSearch(cnh, birthDate, user.id);
      const poll = setInterval(async () => {
        try {
          const data = await InfosimplesService.pollResult(requestId, protocol);
          if (data && !(data as any).status) {
            clearInterval(poll);
            setResult(data);
            setLoading(false);
          }
        } catch (err: any) {
          clearInterval(poll);
          setLoading(false);
          toast({ title: "Erro", description: err.message, variant: "destructive" });
        }
      }, 5000);
    } catch (err: any) {
      setLoading(false);
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta por CNH</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 max-w-sm md:grid-cols-2">
          <Input
            value={cnh}
            onChange={(e) => setCnh(formatCnh(e.target.value))}
            placeholder="Número da CNH"
          />
          <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <Button onClick={startSearch} disabled={loading || cnh.length !== 11 || !birthDate} className="mt-2">
          {loading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4" />}
        </Button>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoadingSpinner size="sm" />
            <span>Consultando...</span>
          </div>
        )}
        {result && (
          <pre className="whitespace-pre-wrap break-all rounded bg-muted p-4 text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
