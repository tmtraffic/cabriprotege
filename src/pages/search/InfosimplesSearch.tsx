
import { useState } from "react";
import PlateSearchForm from "@/components/infosimples/PlateSearchForm";
import RenavamSearchForm from "@/components/infosimples/RenavamSearchForm";
import CnhSearchForm from "@/components/infosimples/CnhSearchForm";
import InfractionsSearchForm from "@/components/infosimples/InfractionsSearchForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function InfosimplesSearch() {
  const [tab, setTab] = useState("plate");
  
  const testEdgeFunction = async () => {
    console.log('Testing Edge Function...');
    
    try {
      // Test 1: Basic test
      const { data: test1, error: error1 } = await supabase.functions.invoke('consultar-veiculo-rj', {
        body: { test: true, timestamp: new Date().toISOString() }
      });
      
      if (error1) {
        console.error('Test 1 failed:', error1);
      } else {
        console.log('Test 1 success:', test1);
      }
      
      toast.success("Teste concluído! Verifique o console para ver os resultados");
      
    } catch (error) {
      console.error('Test error:', error);
      toast.error("Erro no teste. Verifique o console para mais detalhes");
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consultas Infosimples</h1>
        <p className="text-muted-foreground">
          Realize consultas de veículos, condutores e infrações utilizando a API Infosimples.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          As consultas podem levar alguns segundos para serem processadas. 
          Aguarde o resultado sem recarregar a página.
        </AlertDescription>
      </Alert>

      <div className="mb-4">
        <Button onClick={testEdgeFunction} variant="outline">
          Testar Conexão Edge Function
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Consulta</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="plate">Por Placa</TabsTrigger>
              <TabsTrigger value="renavam">Por RENAVAM</TabsTrigger>
              <TabsTrigger value="cnh">Por CNH</TabsTrigger>
              <TabsTrigger value="infractions">Infrações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="plate" className="space-y-4">
              <PlateSearchForm />
            </TabsContent>
            
            <TabsContent value="renavam" className="space-y-4">
              <RenavamSearchForm />
            </TabsContent>
            
            <TabsContent value="cnh" className="space-y-4">
              <CnhSearchForm />
            </TabsContent>

            <TabsContent value="infractions" className="space-y-4">
              <InfractionsSearchForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
