import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Settings as SettingsIcon, 
  Save, 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Palette, 
  Mail,
  ShieldCheck,
  AlertTriangle,
  Database,
  Webhook,
  Server
} from "lucide-react";
import { Plus } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema
          </p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/4 md:h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <button
                className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm transition-colors ${
                  activeTab === "account" 
                    ? "bg-muted font-medium text-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("account")}
              >
                <User className="h-4 w-4" />
                Conta
              </button>
              <button
                className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm transition-colors ${
                  activeTab === "appearance" 
                    ? "bg-muted font-medium text-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("appearance")}
              >
                <Palette className="h-4 w-4" />
                Aparência
              </button>
              <button
                className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm transition-colors ${
                  activeTab === "notifications" 
                    ? "bg-muted font-medium text-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="h-4 w-4" />
                Notificações
              </button>
              <button
                className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm transition-colors ${
                  activeTab === "security" 
                    ? "bg-muted font-medium text-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("security")}
              >
                <Lock className="h-4 w-4" />
                Segurança
              </button>
              <button
                className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm transition-colors ${
                  activeTab === "integrations" 
                    ? "bg-muted font-medium text-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("integrations")}
              >
                <Webhook className="h-4 w-4" />
                Integrações
              </button>
              <button
                className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm transition-colors ${
                  activeTab === "system" 
                    ? "bg-muted font-medium text-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveTab("system")}
              >
                <SettingsIcon className="h-4 w-4" />
                Sistema
              </button>
            </nav>
          </CardContent>
        </Card>
        
        <div className="flex-1">
          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais e preferências
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue="Administrador do Sistema" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@cabricop.com.br" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input id="role" defaultValue="Administrador" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <select
                    id="timezone"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="America/Sao_Paulo"
                  >
                    <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                    <option value="America/Manaus">America/Manaus (GMT-4)</option>
                    <option value="America/Recife">America/Recife (GMT-3)</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="autosave" defaultChecked />
                  <Label htmlFor="autosave">Salvar alterações automaticamente</Label>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência e o comportamento da interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <select
                    id="theme"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="light"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="density">Densidade da Interface</Label>
                  <select
                    id="density"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="normal"
                  >
                    <option value="compact">Compacta</option>
                    <option value="normal">Normal</option>
                    <option value="comfortable">Confortável</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-size">Tamanho da Fonte</Label>
                  <select
                    id="font-size"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="normal"
                  >
                    <option value="small">Pequena</option>
                    <option value="normal">Normal</option>
                    <option value="large">Grande</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="animations" defaultChecked />
                  <Label htmlFor="animations">Ativar animações</Label>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Configure como e quando você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificações no Sistema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="new-client" defaultChecked />
                      <Label htmlFor="new-client">Novos clientes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="new-process" defaultChecked />
                      <Label htmlFor="new-process">Novos processos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="new-fine" defaultChecked />
                      <Label htmlFor="new-fine">Novas multas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="status-change" defaultChecked />
                      <Label htmlFor="status-change">Mudanças de status</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="deadline-approaching" defaultChecked />
                      <Label htmlFor="deadline-approaching">Prazos se aproximando</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="deadline-expired" defaultChecked />
                      <Label htmlFor="deadline-expired">Prazos expirados</Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-medium">Notificações por Email</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="email-summary" defaultChecked />
                      <Label htmlFor="email-summary">Resumo diário</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="email-new-client" />
                      <Label htmlFor="email-new-client">Novos clientes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="email-new-process" />
                      <Label htmlFor="email-new-process">Novos processos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="email-deadline" defaultChecked />
                      <Label htmlFor="email-deadline">Alertas de prazo</Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-medium">Notificações Push</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="push-enabled" defaultChecked />
                      <Label htmlFor="push-enabled">Ativar notificações push</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="push-critical" defaultChecked />
                      <Label htmlFor="push-critical">Somente para eventos críticos</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Gerencie a segurança da sua conta e do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="change-password">Alterar Senha</Label>
                  <div className="space-y-2">
                    <Input id="current-password" type="password" placeholder="Senha atual" />
                    <Input id="new-password" type="password" placeholder="Nova senha" />
                    <Input id="confirm-password" type="password" placeholder="Confirmar nova senha" />
                  </div>
                  <Button className="mt-2" variant="outline">
                    Alterar Senha
                  </Button>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-medium">Autenticação de Dois Fatores</h3>
                  <div className="flex items-center space-x-2">
                    <Switch id="2fa-enabled" />
                    <Label htmlFor="2fa-enabled">Ativar autenticação de dois fatores</Label>
                  </div>
                  <Button className="mt-2" variant="outline" disabled>
                    Configurar Autenticação de Dois Fatores
                  </Button>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-medium">Segurança do Sistema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-logout" defaultChecked />
                      <Label htmlFor="auto-logout">Logout automático após inatividade</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="log-activity" defaultChecked />
                      <Label htmlFor="log-activity">Registrar atividades do usuário</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="secure-session" defaultChecked />
                      <Label htmlFor="secure-session">Sessões seguras</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="ip-restriction" />
                      <Label htmlFor="ip-restriction">Restrição de IP</Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-2">
                  <Label htmlFor="session-timeout">Tempo de Inatividade para Logout (minutos)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" min="5" max="120" />
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>
                  Configure integrações com serviços externos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">API Detran</h3>
                      <p className="text-sm text-muted-foreground">Consulta de multas e status de CNH</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span>Ativo</span>
                    </div>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Server className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">N8N Workflow</h3>
                      <p className="text-sm text-muted-foreground">Automação de processos e notificações</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span>Ativo</span>
                    </div>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Evolution API (WhatsApp)</h3>
                      <p className="text-sm text-muted-foreground">Envio de notificações por WhatsApp</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                      <span>Configuração Pendente</span>
                    </div>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Gateway de Pagamento</h3>
                      <p className="text-sm text-muted-foreground">Pagamento de serviços e multas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      <span>Inativo</span>
                    </div>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Nova Integração
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "system" && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configurações gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="system-name">Nome do Sistema</Label>
                  <Input id="system-name" defaultValue="Cabricop Traffic Resources" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="system-url">URL do Sistema</Label>
                  <Input id="system-url" defaultValue="https://sistema.cabricop.com.br" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="support-email">Email de Suporte</Label>
                  <Input id="support-email" type="email" defaultValue="suporte@cabricop.com.br" />
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-medium">Configurações de Backup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-backup" defaultChecked />
                      <Label htmlFor="auto-backup">Backup automático</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Frequência de Backup</Label>
                      <select
                        id="backup-frequency"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="daily"
                      >
                        <option value="hourly">A cada hora</option>
                        <option value="daily">Diariamente</option>
                        <option value="weekly">Semanalmente</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-medium">Configurações de Retenção de Dados</h3>
                  <div className="space-y-2">
                    <Label htmlFor="log-retention">Retenção de Logs (dias)</Label>
                    <Input id="log-retention" type="number" defaultValue="90" min="7" max="365" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="archive-policy">Política de Arquivamento</Label>
                    <select
                      id="archive-policy"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="after1year"
                    >
                      <option value="after6months">Arquivar após 6 meses</option>
                      <option value="after1year">Arquivar após 1 ano</option>
                      <option value="after2years">Arquivar após 2 anos</option>
                      <option value="never">Nunca arquivar</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-medium">Manutenção do Sistema</h3>
                  <div className="flex flex-col md:flex-row md:justify-between gap-2">
                    <Button variant="outline">
                      Limpar Cache do Sistema
                    </Button>
                    <Button variant="outline">
                      Verificar Atualizações
                    </Button>
                    <Button variant="outline">
                      Executar Diagnóstico
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
