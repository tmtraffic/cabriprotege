
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CnhSearchForm from '@/components/infosimples/CnhSearchForm';
import PlateSearchForm from '@/components/infosimples/PlateSearchForm';
import InfractionsSearchForm from '@/components/infosimples/InfractionsSearchForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Car, AlertTriangle, FileText } from 'lucide-react';

export default function TestInfosimples() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Central de Consultas - Infosimples RJ (Teste)
          </CardTitle>
          <CardDescription>
            Sistema integrado de consultas ao DETRAN-RJ através da API Infosimples - Ambiente de Teste
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="cnh" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cnh" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            CNH
          </TabsTrigger>
          <TabsTrigger value="veiculo" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Veículo
          </TabsTrigger>
          <TabsTrigger value="infracoes" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Infrações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cnh">
          <CnhSearchForm />
        </TabsContent>

        <TabsContent value="veiculo">
          <PlateSearchForm />
        </TabsContent>

        <TabsContent value="infracoes">
          <InfractionsSearchForm />
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Todas as consultas são realizadas em tempo real no sistema do DETRAN-RJ</li>
            <li>• Os dados são armazenados em nosso banco para histórico e relatórios</li>
            <li>• Cada consulta consome créditos da API Infosimples</li>
            <li>• Verifique sempre a data/hora da consulta para garantir informações atualizadas</li>
            <li>• Esta é uma página de teste para validação dos edge functions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
