
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import { Loader2, Hash, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RenavamSearchForm() {
  const { user } = useSupabaseAuth();
  const [renavam, setRenavam] = useState("");
  const [loading, setLoading] = useState(false);

  const startSearch = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para fazer consultas");
      return;
    }

    // Temporarily disabled
    toast.error("Consulta por RENAVAM temporariamente indisponível. Use a consulta por placa.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Consulta por RENAVAM
        </CardTitle>
        <CardDescription>
          Digite o número do RENAVAM do veículo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Esta funcionalidade está temporariamente indisponível. 
            Por favor, use a consulta por placa.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4 opacity-50">
          <Input
            value={renavam}
            onChange={(e) => setRenavam(e.target.value)}
            placeholder="Número do RENAVAM"
            maxLength={11}
            disabled={true}
          />
          <Button 
            disabled={true} 
            onClick={startSearch}
            className="w-full"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin hidden" />
            Temporariamente Indisponível
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
