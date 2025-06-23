
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import { Loader2, Search, User, FileText, AlertCircle } from "lucide-react";
import { InfosimplesService } from "@/services/api/infosimples-service";

interface CNHResult {
  nome?: string;
  cpf?: string;
  rg?: string;
  data_nascimento?: string;
  nome_pai?: string;
  nome_mae?: string;
  numero_registro?: string;
  validade?: string;
  primeira_habilitacao?: string;
  categoria?: string;
  observacoes?: string;
}

interface CnhSearchFormProps {
  clientId?: string;
}

export default function CnhSearchForm({ clientId }: CnhSearchFormProps) {
  const { user } = useSupabaseAuth();
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CNHResult | null>(null);

  const handleConsultar = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para fazer consultas");
      return;
    }

    // Validar CPF
    if (!InfosimplesService.isValidCPF(cpf)) {
      toast.error("CPF inválido");
      return;
    }

    if (!dataNascimento) {
      toast.error("Data de nascimento é obrigatória");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const cleanCpf = cpf.replace(/\D/g, "");
      console.log("Starting CNH search for:", cleanCpf);

      const response = await InfosimplesService.consultarCNH({
        cpf: cleanCpf,
        data_nascimento: dataNascimento,
        user_id: user.id,
        client_id: clientId
      });

      console.log("CNH search completed:", response);

      if (response.success && response.data) {
        setResult(response.data);
        toast.success("Consulta de CNH realizada com sucesso");
      } else {
        throw new Error(response.error || "Falha na consulta de CNH");
      }
    } catch (err: any) {
      console.error("CNH search error:", err);
      setResult(null);
      toast.error(`Erro na consulta: ${err.message || "Falha na consulta de CNH"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Consultar CNH - Rio de Janeiro
          </CardTitle>
          <CardDescription>
            Busque informações de CNH usando CPF e data de nascimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <Button 
              onClick={handleConsultar} 
              disabled={loading || !cpf || !dataNascimento} 
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
                  Consultar CNH
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
            Consultando dados da CNH... Aguarde alguns segundos.
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados da CNH
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{result.nome || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">CPF</p>
                <p className="font-medium">{result.cpf || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">RG</p>
                <p className="font-medium">{result.rg || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                <p className="font-medium">{result.data_nascimento || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Número de Registro</p>
                <p className="font-medium">{result.numero_registro || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Validade</p>
                <p className="font-medium">{result.validade || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Primeira Habilitação</p>
                <p className="font-medium">{result.primeira_habilitacao || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Categoria</p>
                <p className="font-medium">{result.categoria || "N/A"}</p>
              </div>

              {result.nome_pai && (
                <div>
                  <p className="text-sm text-muted-foreground">Nome do Pai</p>
                  <p className="font-medium">{result.nome_pai}</p>
                </div>
              )}

              {result.nome_mae && (
                <div>
                  <p className="text-sm text-muted-foreground">Nome da Mãe</p>
                  <p className="font-medium">{result.nome_mae}</p>
                </div>
              )}

              {result.observacoes && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="font-medium">{result.observacoes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
