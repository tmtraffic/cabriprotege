
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ApiKeySetup from "@/components/config/ApiKeySetup";
import NotificationTemplates from "./NotificationTemplates";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema e preferências do usuário
        </p>
      </div>
      
      <Tabs defaultValue="api-keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="invoicing">Faturamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys" className="space-y-4">
          <ApiKeySetup />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationTemplates />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Perfil</CardTitle>
              <CardDescription>
                Gerencie suas informações de perfil e preferências
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Configurações do perfil do usuário estarão disponíveis em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoicing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Faturamento</CardTitle>
              <CardDescription>
                Gerencie opções de pagamento e faturamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Configurações de faturamento estarão disponíveis em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
