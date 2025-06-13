import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import * as InfosimplesService from "@/services/api/infosimples-service";
import { Search } from "lucide-react";

export default function RenavamSearchForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [renavam, setRenavam] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const formatRenavam = (val: string) => val.replace(/\D/g, "").slice(0, 11);

  const startSearch = async () => {
    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado", variant: "destructive" });
      return;
    }
    if (renavam.length < 9) {
      toast({ title: "RENAVAM inválido", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const { requestId, protocol } = await InfosimplesService.runRenavamSearch(renavam, user.id);
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
        <CardTitle>Consulta por RENAVAM</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 max-w-xs">
          <Input
            value={renavam}
            onChange={(e) => setRenavam(formatRenavam(e.target.value))}
            placeholder="Digite o RENAVAM"
          />
          <Button onClick={startSearch} disabled={!renavam || loading}>
            {loading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
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
