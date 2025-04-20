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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Link2, 
  AlertTriangle, 
  CheckCircle, 
  Save,
  Play,
  RefreshCw,
  Settings,
  TestTube
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  description: string;
  enabled: boolean;
  eventType: "client.created" | "client.updated" | "fine.created" | "fine.updated" | "process.created" | "process.updated" | "process.status_changed" | "customer.invoice.created";
  headers: {[key: string]: string};
  lastTriggered?: string;
  lastStatus?: "success" | "error";
}

const WebhookConfig = () => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: "1",
      name: "Notificação de Novo Cliente",
      url: "https://n8n.cabricop.com.br/webhook/cliente-novo",
      description: "Envia dados de novos clientes para N8N para criar ficha no CRM",
      enabled: true,
      eventType: "client.created",
      headers: {
        "X-Api-Key": "cabricop-n8n-key-123"
      },
      lastTriggered: "20/04/2025 15:30:22",
      lastStatus: "success"
    },
    {
      id: "2",
      name: "Alerta de Nova Multa",
      url: "https://n8n.cabricop.com.br/webhook/multa-nova",
      description: "Envia alerta para N8N quando uma nova multa é detectada",
      enabled: true,
      eventType: "fine.created",
      headers: {
        "X-Api-Key": "cabricop-n8n-key-123"
      },
      lastTriggered: "20/04/2025 12:15:07",
      lastStatus: "success"
    },
    {
      id: "3",
      name: "Atualização de Status de Processo",
      url: "https://n8n.cabricop.com.br/webhook/processo-status",
      description: "Envia atualizações de status de processos para automação",
      enabled: false,
      eventType: "process.status_changed",
      headers: {
        "X-Api-Key": "cabricop-n8n-key-123"
      }
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<string>("webhooks");
  const [isEditing, setIsEditing] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [newWebhook, setNewWebhook] = useState<Partial<WebhookConfig>>({
    enabled: true,
    headers: {
      "Content-Type": "application/json"
    }
  });
  const [isTesting, setIsTesting] = useState(false);
  const [selectedTestEvent, setSelectedTestEvent] = useState<string>("client.created");
  
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de integração foram salvas com sucesso."
    });
  };

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || !newWebhook.eventType) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }
    
    const webhook: WebhookConfig = {
      id: `${webhooks.length + 1}`,
      name: newWebhook.name || "",
      url: newWebhook.url || "",
      description: newWebhook.description || "",
      enabled: newWebhook.enabled || false,
      eventType: newWebhook.eventType as WebhookConfig["eventType"],
      headers: newWebhook.headers || {}
    };
    
    setWebhooks([...webhooks, webhook]);
    setNewWebhook({
      enabled: true,
      headers: {
        "Content-Type": "application/json"
      }
    });
    setIsAddingWebhook(false);
    
    toast({
      title: "Webhook adicionado",
      description: `${webhook.name} foi adicionado com sucesso.`
    });
  };

  const handleUpdateWebhook = () => {
    if (!editingWebhook || !editingWebhook.name || !editingWebhook.url) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }
    
    const updatedWebhooks = webhooks.map(webhook => {
      if (webhook.id === editingWebhook.id) {
        return editingWebhook;
      }
      return webhook;
    });
    
    setWebhooks(updatedWebhooks);
    setEditingWebhook(null);
    setIsEditing(false);
    
    toast({
      title: "Webhook atualizado",
      description: `${editingWebhook.name} foi atualizado com sucesso.`
    });
  };

  const toggleWebhookStatus = (id: string) => {
    const updatedWebhooks = webhooks.map(webhook => {
      if (webhook.id === id) {
        const updatedWebhook = {
          ...webhook,
          enabled: !webhook.enabled
        };
        
        // Mostrar notificação apropriada
        toast({
          title: updatedWebhook.enabled ? "Webhook ativado" : "Webhook desativado",
          description: `${webhook.name} foi ${updatedWebhook.enabled ? "ativado" : "desativado"} com sucesso.`
        });
        
        return updatedWebhook;
      }
      return webhook;
    });
    
    setWebhooks(updatedWebhooks);
  };

  const testWebhook = async (webhook: WebhookConfig) => {
    // Simular envio de teste
    setIsTesting(true);
    
    // Gerar dados de exemplo baseado no tipo de evento
    const exampleData = getExampleDataForEvent(webhook.eventType);
    
    // Simular um delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular resposta (em um ambiente real, isso seria uma chamada fetch real)
    const success = Math.random() > 0.2; // 80% chance de sucesso
    
    // Atualizar status do último teste
    const updatedWebhooks = webhooks.map(w => {
      if (w.id === webhook.id) {
        const now = new Date();
        return {
          ...w,
          lastTriggered: now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR'),
          lastStatus: success ? "success" as const : "error" as const
        };
      }
      return w;
    });
    
    setWebhooks(updatedWebhooks);
    setIsTesting(false);
    
    // Notificar resultado
    if (success) {
      toast({
        title: "Teste bem-sucedido",
        description: `O webhook ${webhook.name} foi testado com sucesso.`
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro no teste",
        description: "Ocorreu um erro ao testar o webhook. Verifique a URL e tente novamente."
      });
    }
  };

  const testSelectedEvent = async () => {
    if (!selectedTestEvent) {
      toast({
        variant: "destructive",
        title: "Selecione um evento",
        description: "Por favor, selecione um tipo de evento para testar."
      });
      return;
    }
    
    setIsTesting(true);
    
    // Filtrar webhooks que estão habilitados e inscritos para este tipo de evento
    const matchingWebhooks = webhooks.filter(webhook => 
      webhook.enabled && webhook.eventType === selectedTestEvent
    );
    
    if (matchingWebhooks.length === 0) {
      setIsTesting(false);
      toast({
        variant: "destructive",
        title: "Nenhum webhook encontrado",
        description: `Não há webhooks ativos inscritos para o evento ${selectedTestEvent}.`
      });
      return;
    }
    
    // Gerar dados de exemplo
    const exampleData = getExampleDataForEvent(selectedTestEvent as WebhookConfig["eventType"]);
    
    // Simular um delay de rede
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Atualizar status dos webhooks testados
    const now = new Date();
    const timestamp = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
    
    const updatedWebhooks = webhooks.map(webhook => {
      if (matchingWebhooks.some(w => w.id === webhook.id)) {
        return {
          ...webhook,
          lastTriggered: timestamp,
          lastStatus: "success" as const // Simular sucesso para todos neste exemplo
        };
      }
      return webhook;
    });
    
    setWebhooks(updatedWebhooks);
    setIsTesting(false);
    
    toast({
      title: "Evento disparado",
      description: `O evento ${selectedTestEvent} foi disparado para ${matchingWebhooks.length} webhook(s).`
    });
  };

  const getExampleDataForEvent = (eventType: WebhookConfig["eventType"]) => {
    // Dados de exemplo para cada tipo de evento
    const exampleData = {
      "client.created": {
        id: "client_123",
        name: "João da Silva",
        email: "joao@exemplo.com",
        phone: "(21) 98765-4321",
        created_at: new Date().toISOString()
      },
      "client.updated": {
        id: "client_123",
        name: "João da Silva",
        email: "joao.atualizado@exemplo.com",
        phone: "(21) 98765-4321",
        updated_at: new Date().toISOString()
      },
      "fine.created": {
        id: "fine_456",
        client_id: "client_123",
        vehicle_plate: "ABC1234",
        infraction_code: "74550",
        value: 130.16,
        date: new Date().toISOString(),
        location: "Av. Brasil, 1500"
      },
      "fine.updated": {
        id: "fine_456",
        status: "appealed",
        updated_at: new Date().toISOString()
      },
      "process.created": {
        id: "process_789",
        client_id: "client_123",
        fine_ids: ["fine_456"],
        status: "new",
        created_at: new Date().toISOString()
      },
      "process.updated": {
        id: "process_789",
        status: "in_progress",
        updated_at: new Date().toISOString()
      },
      "process.status_changed": {
        id: "process_789",
        old_status: "in_progress",
        new_status: "completed",
        updated_at: new Date().toISOString()
      },
      "customer.invoice.created": {
        id: "invoice_101",
        client_id: "client_123",
        amount: 150.00,
        description: "Recurso de multa - Excesso de velocidade",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      }
    };
    
    return exampleData[eventType];
  };

  const getEventTypeLabel = (eventType: WebhookConfig["eventType"]) => {
    const labels = {
      "client.created": "Cliente Criado",
      "client.updated": "Cliente Atualizado",
      "fine.created": "Multa Criada",
      "fine.updated": "Multa Atualizada",
      "process.created": "Processo Criado",
      "process.updated": "Processo Atualizado",
      "process.status_changed": "Status de Processo Alterado",
      "customer.invoice.created": "Fatura Criada"
    };
    
    return labels[eventType];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuração de Integrações</CardTitle>
        <CardDescription>
          Gerencie webhooks e integrações com N8N para automação de processos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhooks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Webhooks Configurados</h3>
              <Button onClick={() => setIsAddingWebhook(true)}>
                Adicionar Webhook
              </Button>
            </div>
            
            {webhooks.length === 0 ? (
              <div className="border rounded-lg p-8 text-center">
                <Link2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum webhook configurado</h3>
                <p className="text-muted-foreground mb-4">
                  Adicione webhooks para integrar com o N8N e automatizar fluxos de trabalho.
                </p>
                <Button onClick={() => setIsAddingWebhook(true)}>
                  Adicionar Primeiro Webhook
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map(webhook => (
                  <Card key={webhook.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-4 md:p-6 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{webhook.name}</h4>
                            <p className="text-sm text-muted-foreground">{webhook.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`webhook-status-${webhook.id}`} className="sr-only">
                              Ativar/Desativar
                            </Label>
                            <Switch
                              id={`webhook-status-${webhook.id}`}
                              checked={webhook.enabled}
                              onCheckedChange={() => toggleWebhookStatus(webhook.id)}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">URL do Webhook</p>
                            <p className="text-sm break-all">{webhook.url}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Tipo de Evento</p>
                            <p className="text-sm">{getEventTypeLabel(webhook.eventType)}</p>
                          </div>
                        </div>
                        
                        {(webhook.lastTriggered || webhook.lastStatus) && (
                          <div className="pt-2 border-t mt-2">
                            <p className="text-sm font-medium text-muted-foreground">Último Disparo</p>
                            <div className="flex items-center space-x-2">
                              {webhook.lastStatus === "success" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : webhook.lastStatus === "error" ? (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              ) : null}
                              <p className="text-sm">
                                {webhook.lastTriggered || "Nunca disparado"}
                                {webhook.lastStatus && webhook.lastStatus === "success" && " (Sucesso)"}
                                {webhook.lastStatus && webhook.lastStatus === "error" && " (Falha)"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex md:flex-col gap-2 p-4 bg-muted/50 border-t md:border-t-0 md:border-l">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingWebhook(webhook);
                            setIsEditing(true);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => testWebhook(webhook)}
                          disabled={!webhook.enabled || isTesting}
                        >
                          <TestTube className="h-4 w-4 mr-2" />
                          Testar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="bg-muted/50 border rounded-lg p-4 mt-8">
              <h3 className="text-lg font-semibold mb-4">Testar Eventos</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="test-event">Selecione um evento para testar</Label>
                  <Select 
                    value={selectedTestEvent} 
                    onValueChange={setSelectedTestEvent}
                  >
                    <SelectTrigger id="test-event">
                      <SelectValue placeholder="Selecione um evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client.created">Cliente Criado</SelectItem>
                      <SelectItem value="client.updated">Cliente Atualizado</SelectItem>
                      <SelectItem value="fine.created">Multa Criada</SelectItem>
                      <SelectItem value="fine.updated">Multa Atualizada</SelectItem>
                      <SelectItem value="process.created">Processo Criado</SelectItem>
                      <SelectItem value="process.updated">Processo Atualizado</SelectItem>
                      <SelectItem value="process.status_changed">Status de Processo Alterado</SelectItem>
                      <SelectItem value="customer.invoice.created">Fatura Criada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    className="w-full md:w-auto" 
                    onClick={testSelectedEvent}
                    disabled={isTesting}
                  >
                    {isTesting ? "Enviando..." : "Disparar Evento de Teste"}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Isto vai disparar o evento selecionado para todos os webhooks ativos inscritos neste tipo de evento.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configurações de Integração N8N</h3>
              
              <div className="space-y-2">
                <Label htmlFor="n8n-url">URL Base do N8N</Label>
                <Input
                  id="n8n-url"
                  defaultValue="https://n8n.cabricop.com.br"
                  placeholder="https://seu-n8n.exemplo.com"
                />
                <p className="text-sm text-muted-foreground">
                  URL base da sua instância N8N para automação de processos
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave de API</Label>
                <Input
                  id="api-key"
                  type="password"
                  defaultValue="cabricop-n8n-key-123"
                  placeholder="Sua chave de API secreta"
                />
                <p className="text-sm text-muted-foreground">
                  Chave de API usada para autenticar requisições ao N8N
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="retry-enabled">Tentativas após falha</Label>
                    <p className="text-sm text-muted-foreground">
                      Tentar novamente após falhas de envio
                    </p>
                  </div>
                  <Switch id="retry-enabled" defaultChecked />
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <Label htmlFor="max-retries">Número máximo de tentativas</Label>
                <Input
                  id="max-retries"
                  type="number"
                  defaultValue="3"
                  min="1"
                  max="10"
                />
              </div>
              
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  Mantenha sua chave de API segura. Ela permite acesso a funções de automação críticas.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Sincronização de Workflows</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Workflows N8N</p>
                    <p className="text-sm text-muted-foreground">7 workflows sincronizados</p>
                  </div>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sincronizar
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-muted/50 border-b font-medium">
                    Workflows Ativos
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">Notificação de Nova Multa</p>
                        <p className="text-xs text-muted-foreground">Última execução: 20/04/2025 15:45</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Testar
                      </Button>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">Envio de WhatsApp para Cliente</p>
                        <p className="text-xs text-muted-foreground">Última execução: 20/04/2025 12:30</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Testar
                      </Button>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">Geração de Relatório Diário</p>
                        <p className="text-xs text-muted-foreground">Última execução: 20/04/2025 06:00</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Testar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        {activeTab === "settings" && (
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        )}
      </CardFooter>

      <Dialog open={isAddingWebhook} onOpenChange={setIsAddingWebhook}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Webhook</DialogTitle>
            <DialogDescription>
              Configure um novo endpoint de webhook para integração com N8N.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="webhook-name">Nome</Label>
              <Input
                id="webhook-name"
                value={newWebhook.name || ""}
                onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="webhook-url">URL do Webhook</Label>
              <Input
                id="webhook-url"
                value={newWebhook.url || ""}
                placeholder="https://n8n.cabricop.com.br/webhook/..."
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="webhook-event">Tipo de Evento</Label>
              <Select 
                value={newWebhook.eventType} 
                onValueChange={(value) => setNewWebhook({ ...newWebhook, eventType: value as WebhookConfig["eventType"] })}
              >
                <SelectTrigger id="webhook-event">
                  <SelectValue placeholder="Selecione o tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client.created">Cliente Criado</SelectItem>
                  <SelectItem value="client.updated">Cliente Atualizado</SelectItem>
                  <SelectItem value="fine.created">Multa Criada</SelectItem>
                  <SelectItem value="fine.updated">Multa Atualizada</SelectItem>
                  <SelectItem value="process.created">Processo Criado</SelectItem>
                  <SelectItem value="process.updated">Processo Atualizado</SelectItem>
                  <SelectItem value="process.status_changed">Status de Processo Alterado</SelectItem>
                  <SelectItem value="customer.invoice.created">Fatura Criada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="webhook-description">Descrição</Label>
              <Textarea
                id="webhook-description"
                rows={2}
                value={newWebhook.description || ""}
                onChange={(e) => setNewWebhook({ ...newWebhook, description: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="webhook-enabled"
                checked={newWebhook.enabled}
                onCheckedChange={(checked) => setNewWebhook({ ...newWebhook, enabled: checked })}
              />
              <Label htmlFor="webhook-enabled">Ativar webhook imediatamente</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingWebhook(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddWebhook}>
              Adicionar Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Webhook</DialogTitle>
            <DialogDescription>
              Atualize as configurações deste webhook.
            </DialogDescription>
          </DialogHeader>
          {editingWebhook && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-webhook-name">Nome</Label>
                <Input
                  id="edit-webhook-name"
                  value={editingWebhook.name}
                  onChange={(e) => setEditingWebhook({ ...editingWebhook, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-webhook-url">URL do Webhook</Label>
                <Input
                  id="edit-webhook-url"
                  value={editingWebhook.url}
                  onChange={(e) => setEditingWebhook({ ...editingWebhook, url: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-webhook-event">Tipo de Evento</Label>
                <Select 
                  value={editingWebhook.eventType} 
                  onValueChange={(value) => setEditingWebhook({ ...editingWebhook, eventType: value as WebhookConfig["eventType"] })}
                >
                  <SelectTrigger id="edit-webhook-event">
                    <SelectValue placeholder="Selecione o tipo de evento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client.created">Cliente Criado</SelectItem>
                    <SelectItem value="client.updated">Cliente Atualizado</SelectItem>
                    <SelectItem value="fine.created">Multa Criada</SelectItem>
                    <SelectItem value="fine.updated">Multa Atualizada</SelectItem>
                    <SelectItem value="process.created">Processo Criado</SelectItem>
                    <SelectItem value="process.updated">Processo Atualizado</SelectItem>
                    <SelectItem value="process.status_changed">Status de Processo Alterado</SelectItem>
                    <SelectItem value="customer.invoice.created">Fatura Criada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-webhook-description">Descrição</Label>
                <Textarea
                  id="edit-webhook-description"
                  rows={2}
                  value={editingWebhook.description}
                  onChange={(e) => setEditingWebhook({ ...editingWebhook, description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-webhook-enabled"
                  checked={editingWebhook.enabled}
                  onCheckedChange={(checked) => setEditingWebhook({ ...editingWebhook, enabled: checked })}
                />
                <Label htmlFor="edit-webhook-enabled">Webhook ativo</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingWebhook(null);
              setIsEditing(false);
            }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateWebhook}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WebhookConfig;
