
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  
  // Estados para os formulários
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Cabricoop Assessoria",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    theme: "light",
    autoLogout: true,
    autoLogoutTime: "30"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newProcessAlert: true,
    deadlineAlert: true,
    documentAlert: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: true,
    passwordExpiryDays: "90",
    sessionTimeout: true,
    sessionTimeoutMinutes: "60"
  });

  // Funções para lidar com mudanças nos formulários
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Funções para resetar formulários
  const resetGeneralForm = () => {
    setGeneralSettings({
      companyName: "Cabricoop Assessoria",
      timezone: "America/Sao_Paulo",
      language: "pt-BR",
      theme: "light",
      autoLogout: true,
      autoLogoutTime: "30"
    });
    toast({
      title: "Formulário resetado",
      description: "Configurações gerais restauradas ao padrão.",
    });
  };

  const resetNotificationForm = () => {
    setNotificationSettings({
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      newProcessAlert: true,
      deadlineAlert: true,
      documentAlert: true
    });
    toast({
      title: "Formulário resetado",
      description: "Configurações de notificações restauradas ao padrão.",
    });
  };

  const resetSecurityForm = () => {
    setSecuritySettings({
      twoFactorAuth: false,
      passwordExpiry: true,
      passwordExpiryDays: "90",
      sessionTimeout: true,
      sessionTimeoutMinutes: "60"
    });
    toast({
      title: "Formulário resetado",
      description: "Configurações de segurança restauradas ao padrão.",
    });
  };

  // Funções para salvar formulários
  const saveGeneralSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações gerais foram atualizadas com sucesso.",
    });
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações de notificações foram atualizadas com sucesso.",
    });
  };

  const saveSecuritySettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações de segurança foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
          <p className="text-muted-foreground">Gerencie as configurações e preferências do sistema.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>v1.2.0</Badge>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Redefinir Tudo</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá redefinir todas as configurações do sistema para os valores padrão. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  resetGeneralForm();
                  resetNotificationForm();
                  resetSecurityForm();
                  toast({
                    title: "Sistema restaurado",
                    description: "Todas as configurações foram restauradas aos valores padrão.",
                  });
                }}>
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure as preferências gerais do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={generalSettings.companyName}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select 
                    value={generalSettings.timezone}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">América/São Paulo</SelectItem>
                      <SelectItem value="America/Recife">América/Recife</SelectItem>
                      <SelectItem value="America/Manaus">América/Manaus</SelectItem>
                      <SelectItem value="America/Rio_Branco">América/Rio Branco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select 
                    value={generalSettings.language}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select 
                    value={generalSettings.theme}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, theme: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="autoLogout" 
                  name="autoLogout"
                  checked={generalSettings.autoLogout}
                  onCheckedChange={(checked) => setGeneralSettings({...generalSettings, autoLogout: checked})}
                />
                <Label htmlFor="autoLogout">Logout automático por inatividade</Label>
              </div>
              {generalSettings.autoLogout && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="autoLogoutTime">Tempo de inatividade (minutos)</Label>
                  <Input 
                    id="autoLogoutTime" 
                    name="autoLogoutTime" 
                    type="number" 
                    min="1" 
                    max="120"
                    value={generalSettings.autoLogoutTime}
                    onChange={handleGeneralChange}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetGeneralForm}>Cancelar</Button>
              <Button onClick={saveGeneralSettings}>Salvar alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Gerencie como e quando você recebe notificações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canais de Notificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="emailNotifications" 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                    <Label htmlFor="emailNotifications">Notificações por e-mail</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                    />
                    <Label htmlFor="smsNotifications">Notificações por SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                    />
                    <Label htmlFor="pushNotifications">Notificações push</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Tipos de Alertas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="newProcessAlert"
                      checked={notificationSettings.newProcessAlert}
                      onCheckedChange={(checked) => handleNotificationChange("newProcessAlert", checked)}
                    />
                    <Label htmlFor="newProcessAlert">Novos processos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="deadlineAlert"
                      checked={notificationSettings.deadlineAlert}
                      onCheckedChange={(checked) => handleNotificationChange("deadlineAlert", checked)}
                    />
                    <Label htmlFor="deadlineAlert">Prazos próximos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="documentAlert"
                      checked={notificationSettings.documentAlert}
                      onCheckedChange={(checked) => handleNotificationChange("documentAlert", checked)}
                    />
                    <Label htmlFor="documentAlert">Novos documentos</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetNotificationForm}>Cancelar</Button>
              <Button onClick={saveNotificationSettings}>Salvar alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Configure as opções de segurança e proteção de conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="twoFactorAuth"
                  name="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                />
                <Label htmlFor="twoFactorAuth">Ativar autenticação de dois fatores</Label>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="passwordExpiry"
                  name="passwordExpiry"
                  checked={securitySettings.passwordExpiry}
                  onCheckedChange={(checked) => setSecuritySettings({...securitySettings, passwordExpiry: checked})}
                />
                <Label htmlFor="passwordExpiry">Expiração de senha</Label>
              </div>
              
              {securitySettings.passwordExpiry && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="passwordExpiryDays">Dias até expiração da senha</Label>
                  <Input 
                    id="passwordExpiryDays" 
                    name="passwordExpiryDays"
                    type="number" 
                    min="30" 
                    max="365"
                    value={securitySettings.passwordExpiryDays}
                    onChange={handleSecurityChange}
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="sessionTimeout"
                  name="sessionTimeout"
                  checked={securitySettings.sessionTimeout}
                  onCheckedChange={(checked) => setSecuritySettings({...securitySettings, sessionTimeout: checked})}
                />
                <Label htmlFor="sessionTimeout">Timeout de sessão</Label>
              </div>
              
              {securitySettings.sessionTimeout && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="sessionTimeoutMinutes">Minutos até timeout da sessão</Label>
                  <Input 
                    id="sessionTimeoutMinutes" 
                    name="sessionTimeoutMinutes"
                    type="number" 
                    min="5" 
                    max="240"
                    value={securitySettings.sessionTimeoutMinutes}
                    onChange={handleSecurityChange}
                  />
                </div>
              )}
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Alterar senha
                </Button>
              </div>
              
              <div className="pt-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Revogar todas as sessões ativas
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação encerrará todas as sessões ativas em todos os dispositivos, incluindo a sessão atual. Você precisará fazer login novamente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        toast({
                          title: "Sessões encerradas",
                          description: "Todas as sessões foram revogadas com sucesso.",
                        });
                      }}>
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetSecurityForm}>Cancelar</Button>
              <Button onClick={saveSecuritySettings}>Salvar alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
