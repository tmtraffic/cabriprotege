import { useState } from "react";
import PlateSearchForm from "@/components/infosimples/PlateSearchForm";
import RenavamSearchForm from "@/components/infosimples/RenavamSearchForm";
import CnhSearchForm from "@/components/infosimples/CnhSearchForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InfosimplesSearch() {
  const [tab, setTab] = useState("plate");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consultas Infosimples</h1>
        <p className="text-muted-foreground">Realize consultas de veículos e condutores utilizando a API Infosimples.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Nova Consulta</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plate">Placa</TabsTrigger>
              <TabsTrigger value="renavam">RENAVAM</TabsTrigger>
              <TabsTrigger value="cnh">CNH</TabsTrigger>
            </TabsList>
            <TabsContent value="plate">
              <PlateSearchForm />
            </TabsContent>
            <TabsContent value="renavam">
              <RenavamSearchForm />
            </TabsContent>
            <TabsContent value="cnh">
              <CnhSearchForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
