
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Mail, MessageSquare, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject_template?: string;
  body_template: string;
  created_at: string;
  updated_at: string;
}

const NotificationTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "email",
    subject_template: "",
    body_template: ""
  });
  const [filterType, setFilterType] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch templates when component mounts or filter changes
  useEffect(() => {
    fetchTemplates();
  }, [filterType]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('list-notification-templates', {
        body: { type: filterType || undefined }
      });
      
      if (error) throw new Error(error.message);
      
      setTemplates(data || []);
    } catch (error: any) {
      console.error("Error fetching notification templates:", error);
      toast({
        title: "Erro ao carregar modelos",
        description: error.message || "Não foi possível carregar os modelos de notificação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      // Simple validation
      if (!formData.name.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O nome do modelo é obrigatório.",
          variant: "destructive"
        });
        return;
      }
      
      if (!formData.body_template.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O conteúdo do modelo é obrigatório.",
          variant: "destructive"
        });
        return;
      }
      
      if (formData.type === 'email' && !formData.subject_template.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O assunto é obrigatório para modelos de e-mail.",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('create-notification-template', {
        body: formData
      });
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Modelo criado",
        description: "O modelo de notificação foi criado com sucesso."
      });
      
      // Reset form and close dialog
      setFormData({
        name: "",
        type: "email",
        subject_template: "",
        body_template: ""
      });
      setDialogOpen(false);
      
      // Refresh list
      fetchTemplates();
      
    } catch (error: any) {
      console.error("Error creating template:", error);
      toast({
        title: "Erro ao criar modelo",
        description: error.message || "Não foi possível criar o modelo de notificação.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      subject_template: template.subject_template || "",
      body_template: template.body_template
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedTemplate) return;
    
    try {
      // Simple validation
      if (!formData.name.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O nome do modelo é obrigatório.",
          variant: "destructive"
        });
        return;
      }
      
      if (!formData.body_template.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O conteúdo do modelo é obrigatório.",
          variant: "destructive"
        });
        return;
      }
      
      if (formData.type === 'email' && !formData.subject_template.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O assunto é obrigatório para modelos de e-mail.",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('update-notification-template', {
        body: {
          id: selectedTemplate.id,
          ...formData
        }
      });
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Modelo atualizado",
        description: "O modelo de notificação foi atualizado com sucesso."
      });
      
      // Reset form and close dialog
      setFormData({
        name: "",
        type: "email",
        subject_template: "",
        body_template: ""
      });
      setSelectedTemplate(null);
      setIsEditing(false);
      setDialogOpen(false);
      
      // Refresh list
      fetchTemplates();
      
    } catch (error: any) {
      console.error("Error updating template:", error);
      toast({
        title: "Erro ao atualizar modelo",
        description: error.message || "Não foi possível atualizar o modelo de notificação.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (templateId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('delete-notification-template', {
        body: { template_id: templateId }
      });
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Modelo excluído",
        description: "O modelo de notificação foi excluído com sucesso."
      });
      
      // Refresh list
      fetchTemplates();
      
    } catch (error: any) {
      console.error("Error deleting template:", error);
      toast({
        title: "Erro ao excluir modelo",
        description: error.message || "Não foi possível excluir o modelo de notificação.",
        variant: "destructive"
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'system_alert':
        return <Bell className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'email':
        return 'E-mail';
      case 'whatsapp':
        return 'WhatsApp';
      case 'system_alert':
        return 'Alerta do Sistema';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Modelos de Notificação</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditing(false);
              setFormData({
                name: "",
                type: "email",
                subject_template: "",
                body_template: ""
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Modelo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Modelo" : "Novo Modelo de Notificação"}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Atualize os detalhes do modelo de notificação existente." 
                  : "Crie um novo modelo para envio de notificações automáticas."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Modelo</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="ex: confirmacao_cadastro"
                  />
                  <p className="text-xs text-muted-foreground">
                    Identificador único usado no sistema para referenciar este modelo.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Notificação</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={value => setFormData({...formData, type: value})}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="system_alert">Alerta do Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Determina como esta notificação será enviada.
                  </p>
                </div>
              </div>
              
              {formData.type === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto do E-mail</Label>
                  <Input 
                    id="subject" 
                    value={formData.subject_template}
                    onChange={e => setFormData({...formData, subject_template: e.target.value})}
                    placeholder="Assunto do e-mail"
                  />
                  <p className="text-xs text-muted-foreground">
                    Você pode usar variáveis como {"{clientName}"} no assunto.
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="body">Conteúdo da Notificação</Label>
                <Textarea 
                  id="body"
                  value={formData.body_template}
                  onChange={e => setFormData({...formData, body_template: e.target.value})}
                  placeholder={formData.type === 'email' 
                    ? "Digite o conteúdo do e-mail aqui..." 
                    : "Digite o conteúdo da mensagem aqui..."}
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  Você pode usar variáveis no formato {"{variableName}"} que serão substituídas ao enviar a notificação.
                </p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Variáveis Disponíveis</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><code>{"{clientName}"}</code> - Nome do cliente</div>
                  <div><code>{"{processId}"}</code> - ID do processo</div>
                  <div><code>{"{processType}"}</code> - Tipo do processo</div>
                  <div><code>{"{processStatus}"}</code> - Status do processo</div>
                  <div><code>{"{vehiclePlate}"}</code> - Placa do veículo</div>
                  <div><code>{"{deadlineDate}"}</code> - Data do prazo</div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={isEditing ? handleUpdate : handleCreate}>
                {isEditing ? "Atualizar" : "Criar"} Modelo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Modelos de Notificação</CardTitle>
          <CardDescription>
            Configure modelos para e-mails, mensagens de WhatsApp e alertas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setFilterType("")}>Todos</TabsTrigger>
                <TabsTrigger value="email" onClick={() => setFilterType("email")}>E-mail</TabsTrigger>
                <TabsTrigger value="whatsapp" onClick={() => setFilterType("whatsapp")}>WhatsApp</TabsTrigger>
                <TabsTrigger value="system" onClick={() => setFilterType("system_alert")}>Alertas</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              {renderTemplateList()}
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              {renderTemplateList()}
            </TabsContent>
            
            <TabsContent value="whatsapp" className="space-y-4">
              {renderTemplateList()}
            </TabsContent>
            
            <TabsContent value="system" className="space-y-4">
              {renderTemplateList()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function renderTemplateList() {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-12">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (templates.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-4 p-4 rounded-full bg-primary/10">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum modelo encontrado</h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            {filterType 
              ? `Não há modelos do tipo ${getTypeLabel(filterType)} cadastrados.` 
              : "Você ainda não cadastrou nenhum modelo de notificação."}
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Modelo
          </Button>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de modelos de notificação cadastrados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Conteúdo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="flex items-center">
                  <span className="mr-2">{getTypeIcon(template.type)}</span>
                  {getTypeLabel(template.type)}
                </TableCell>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>
                  {template.subject_template ? 
                    template.subject_template.length > 30 ? 
                      `${template.subject_template.substring(0, 30)}...` : 
                      template.subject_template : 
                    "-"}
                </TableCell>
                <TableCell>
                  {template.body_template.length > 50 ? 
                    `${template.body_template.substring(0, 50)}...` : 
                    template.body_template}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(template)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir modelo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o modelo "{template.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive text-destructive-foreground"
                            onClick={() => handleDelete(template.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default NotificationTemplates;
