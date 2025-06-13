
import { useState } from "react";
import PlateSearchForm from "@/components/infosimples/PlateSearchForm";
import RenavamSearchForm from "@/components/infosimples/RenavamSearchForm";
import CnhSearchForm from "@/components/infosimples/CnhSearchForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function InfosimplesSearch() {
  const [tab, setTab] = useState("plate");
  const { toast } = useToast();
  
  const testEdgeFunction = async () => {
    console.log('Testing Edge Function...');
    
    try {
      // Test 1: Basic test
      const { data: test1, error: error1 } = await supabase.functions.invoke('infosimples-api', {
        body: { test: true, timestamp: new Date().toISOString() }
      });
      
      if (error1) {
        console.error('Test 1 failed:', error1);
      } else {
        console.log('Test 1 success:', test1);
      }
      
      // Test 2: Vehicle search test
      const { data: test2, error: error2 } = await supabase.functions.invoke('infosimples-api', {
        body: { 
          searchType: 'vehicle',
          searchQuery: 'ABC1234',
          placa: 'ABC1234'
        }
      });
      
      if (error2) {
        console.error('Test 2 failed:', error2);
      } else {
        console.log('Test 2 success:', test2);
      }
      
      toast({
        title: "Testes concluídos",
        description: "Verifique o console para ver os resultados"
      });
      
    } catch (error) {
      console.error('Test error:', error);
      toast({ 
        title: "Erro nos testes", 
        description: "Verifique o console para mais detalhes",
        variant: "destructive" 
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consultas Infosimples</h1>
        <p className="text-muted-foreground">
          Realize consultas de veículos e condutores utilizando a API Infosimples.
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plate">Consulta por Placa</TabsTrigger>
              <TabsTrigger value="renavam">Consulta por RENAVAM</TabsTrigger>
              <TabsTrigger value="cnh">Consulta por CNH</TabsTrigger>
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
