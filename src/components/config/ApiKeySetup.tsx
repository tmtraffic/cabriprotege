
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ApiKeyStatus {
  helenaApi: "Configured" | "Not Configured";
  infosimplesApi: "Configured" | "Not Configured";
}

export function ApiKeySetup() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("helena");
  const [loading, setLoading] = useState(true);
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch API key status on component mount
  useEffect(() => {
    fetchApiKeyStatus();
  }, []);
  
  const fetchApiKeyStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-api-key-status');
      
      if (error) {
        throw new Error(error.message);
      }
      
      setApiKeyStatus(data as ApiKeyStatus);
    } catch (err: any) {
      console.error('Error fetching API key status:', err);
      setError(err.message || 'Failed to fetch API key status');
      toast({
        title: "Erro",
        description: "Não foi possível verificar o status das chaves de API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status: "Configured" | "Not Configured") => {
    if (status === "Configured") {
      return (
        <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-md">
          <CheckCircle className="h-5 w-5" />
          <span>Configurada</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-md">
          <XCircle className="h-5 w-5" />
          <span>Não Configurada</span>
        </div>
      );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Configuração de APIs</CardTitle>
        <CardDescription>
          Status das integrações com serviços externos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="w-8 h-8 border-4 border-t-cabricop-blue border-cabricop-orange rounded-full animate-spin mr-3"></div>
            <p>Verificando configuração das APIs...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="helena">Helena API</TabsTrigger>
              <TabsTrigger value="infosimples">Infosimples API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="helena" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Status da API Helena</h3>
                {renderStatusBadge(apiKeyStatus?.helenaApi || "Not Configured")}
                
                <div className="bg-muted p-4 rounded-lg mt-4">
                  <h4 className="font-medium">Como configurar</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    A chave da API Helena é configurada como uma variável de ambiente no backend. Para configurar:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Acesse o painel administrativo do Supabase</li>
                    <li>Navegue até "Settings" → "API"</li>
                    <li>Na seção de "Edge Functions", adicione uma nova variável de ambiente</li>
                    <li>Nome da variável: <code className="bg-slate-100 px-1 py-0.5 rounded">HELENA_APP_API_KEY</code></li>
                    <li>Valor: Sua chave de API da plataforma Helena</li>
                  </ol>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="infosimples" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Status da API Infosimples</h3>
                {renderStatusBadge(apiKeyStatus?.infosimplesApi || "Not Configured")}
                
                <div className="bg-muted p-4 rounded-lg mt-4">
                  <h4 className="font-medium">Como configurar</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    As credenciais da API Infosimples são configuradas como variáveis de ambiente no backend. Para configurar:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Acesse o painel administrativo do Supabase</li>
                    <li>Navegue até "Settings" → "API"</li>
                    <li>Na seção de "Edge Functions", adicione duas novas variáveis de ambiente:</li>
                    <li>Nome da primeira variável: <code className="bg-slate-100 px-1 py-0.5 rounded">INFOSIMPLES_EMAIL</code></li>
                    <li>Valor: O email associado à sua conta Infosimples</li>
                    <li>Nome da segunda variável: <code className="bg-slate-100 px-1 py-0.5 rounded">INFOSIMPLES_API_TOKEN</code></li>
                    <li>Valor: Seu token de API da plataforma Infosimples</li>
                  </ol>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        <Alert className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            As chaves de API são sensíveis e devem ser mantidas em segurança. Nunca compartilhe suas chaves de API ou armazene-as em código-fonte público.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button onClick={fetchApiKeyStatus} disabled={loading}>
          {loading ? "Atualizando..." : "Verificar Status"}
        </Button>
      </CardFooter>
    </Card>
  );
}
