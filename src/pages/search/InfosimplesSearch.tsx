
import { useState } from "react";
import PlateSearchForm from "@/components/infosimples/PlateSearchForm";
import RenavamSearchForm from "@/components/infosimples/RenavamSearchForm";
import CnhSearchForm from "@/components/infosimples/CnhSearchForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function InfosimplesSearch() {
  const [tab, setTab] = useState("plate");
  
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
