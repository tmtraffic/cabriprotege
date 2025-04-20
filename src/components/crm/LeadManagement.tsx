
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Tipos para os dados do CRM
interface Lead {
  id: string;
  name: string;
  contactInfo: string;
  source: "internal" | "google" | "meta" | "referral" | "organic" | "other";
  status: "new" | "contacted" | "quoted" | "sold" | "lost";
  notes: string;
  createdAt: string;
  lastContactDate: string;
  assignedTo: string;
  valueQuoted?: number;
  valueSold?: number;
  followUpDate?: string;
}

const LeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "João Silva",
      contactInfo: "joao.silva@exemplo.com | (21) 98765-4321",
      source: "google",
      status: "new",
      notes: "Cliente busca recurso para 3 multas por excesso de velocidade",
      createdAt: "20/04/2025",
      lastContactDate: "20/04/2025",
      assignedTo: "Ana Costa"
    },
    {
      id: "2",
      name: "Maria Oliveira",
      contactInfo: "maria.oliveira@exemplo.com | (21) 91234-5678",
      source: "referral",
      status: "contacted",
      notes: "Indicada por João Silva. Interessada em recurso para suspensão de CNH.",
      createdAt: "18/04/2025",
      lastContactDate: "19/04/2025",
      assignedTo: "Carlos Santos",
      followUpDate: "22/04/2025"
    },
    {
      id: "3",
      name: "Pedro Pereira",
      contactInfo: "pedro.pereira@exemplo.com | (21) 99876-5432",
      source: "internal",
      status: "quoted",
      notes: "Motorista de Uber com 19 pontos na CNH. Orçamento enviado por email.",
      createdAt: "15/04/2025",
      lastContactDate: "19/04/2025",
      assignedTo: "Ana Costa",
      valueQuoted: 850.00,
      followUpDate: "21/04/2025"
    },
    {
      id: "4",
      name: "Carla Sousa",
      contactInfo: "carla.sousa@exemplo.com | (21) 98888-7777",
      source: "meta",
      status: "sold",
      notes: "Contrato assinado para recurso de 2 multas. Pagamento realizado.",
      createdAt: "10/04/2025",
      lastContactDate: "15/04/2025",
      assignedTo: "Carlos Santos",
      valueQuoted: 550.00,
      valueSold: 550.00
    },
    {
      id: "5",
      name: "Roberto Lima",
      contactInfo: "roberto.lima@exemplo.com | (21) 97777-8888",
      source: "organic",
      status: "lost",
      notes: "Cliente decidiu contratar outro serviço devido ao prazo.",
      createdAt: "05/04/2025",
      lastContactDate: "12/04/2025",
      assignedTo: "Ana Costa",
      valueQuoted: 420.00
    }
  ]);
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    source: "internal",
    status: "new"
  });
  
  const { toast } = useToast();

  const handleAddLead = () => {
    if (!newLead.name || !newLead.contactInfo) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    
    const lead: Lead = {
      id: `${leads.length + 1}`,
      name: newLead.name || "",
      contactInfo: newLead.contactInfo || "",
      source: newLead.source as Lead["source"] || "internal",
      status: newLead.status as Lead["status"] || "new",
      notes: newLead.notes || "",
      createdAt: dateStr,
      lastContactDate: dateStr,
      assignedTo: newLead.assignedTo || "Não atribuído",
      valueQuoted: newLead.valueQuoted,
      followUpDate: newLead.followUpDate
    };
    
    setLeads([lead, ...leads]);
    setNewLead({
      source: "internal",
      status: "new"
    });
    setIsAddingLead(false);
    
    toast({
      title: "Lead adicionado",
      description: `${lead.name} foi adicionado com sucesso.`
    });
  };

  const handleUpdateLead = () => {
    if (!selectedLead || !selectedLead.name || !selectedLead.contactInfo) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    
    const updatedLeads = leads.map(lead => {
      if (lead.id === selectedLead.id) {
        return {
          ...selectedLead,
          lastContactDate: dateStr
        };
      }
      return lead;
    });
    
    setLeads(updatedLeads);
    setSelectedLead(null);
    setIsEditingLead(false);
    
    toast({
      title: "Lead atualizado",
      description: `${selectedLead.name} foi atualizado com sucesso.`
    });
  };

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter(lead => lead.id !== id));
    
    toast({
      title: "Lead removido",
      description: "O lead foi removido com sucesso."
    });
  };

  const getStatusBadge = (status: Lead["status"]) => {
    const statusConfig = {
      new: { label: "Novo", color: "blue" },
      contacted: { label: "Contatado", color: "yellow" },
      quoted: { label: "Orçado", color: "purple" },
      sold: { label: "Vendido", color: "green" },
      lost: { label: "Perdido", color: "red" }
    };
    
    const config = statusConfig[status];
    
    return (
      <Badge variant="outline" className={`bg-${config.color}-50 text-${config.color}-700 border-${config.color}-200`}>
        {config.label}
      </Badge>
    );
  };

  const getSourceLabel = (source: Lead["source"]) => {
    const sourceLabels = {
      internal: "Interno - Busca automática",
      google: "Externo - Google Ads",
      meta: "Externo - Meta Ads",
      referral: "Externo - Indicação",
      organic: "Externo - Orgânico",
      other: "Outro"
    };
    
    return sourceLabels[source];
  };

  const getStatusIcon = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "contacted":
        return <Phone className="h-4 w-4 text-yellow-500" />;
      case "quoted":
        return <FileText className="h-4 w-4 text-purple-500" />;
      case "sold":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "lost":
        return <Trash2 className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Gestão de Leads</CardTitle>
            <CardDescription>
              Acompanhe leads, contatos e vendas para recursos de trânsito
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingLead(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Nome</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Atribuído</TableHead>
                <TableHead>Último Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map(lead => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{lead.name}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {lead.contactInfo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getSourceLabel(lead.source)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(lead.status)}
                      {getStatusBadge(lead.status)}
                    </div>
                  </TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{lead.lastContactDate}</span>
                      {lead.followUpDate && (
                        <span className="text-xs flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          Seguimento: {lead.followUpDate}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsEditingLead(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteLead(lead.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Exibindo {leads.length} leads
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Exportar
          </Button>
          <Button variant="outline">
            Relatório
          </Button>
        </div>
      </CardFooter>

      {/* Modal para adicionar lead */}
      <Dialog open={isAddingLead} onOpenChange={setIsAddingLead}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo lead para acompanhamento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newLead.name || ""}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactInfo">Contato (Email/Telefone)</Label>
              <Input
                id="contactInfo"
                value={newLead.contactInfo || ""}
                onChange={(e) => setNewLead({ ...newLead, contactInfo: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source">Origem</Label>
              <Select 
                value={newLead.source} 
                onValueChange={(value) => setNewLead({ ...newLead, source: value as Lead["source"] })}
              >
                <SelectTrigger id="source">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Interno - Busca automática</SelectItem>
                  <SelectItem value="google">Externo - Google Ads</SelectItem>
                  <SelectItem value="meta">Externo - Meta Ads</SelectItem>
                  <SelectItem value="referral">Externo - Indicação</SelectItem>
                  <SelectItem value="organic">Externo - Orgânico</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignedTo">Atribuir para</Label>
              <Input
                id="assignedTo"
                value={newLead.assignedTo || ""}
                onChange={(e) => setNewLead({ ...newLead, assignedTo: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                rows={3}
                value={newLead.notes || ""}
                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingLead(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddLead}>
              Adicionar Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar lead */}
      <Dialog open={isEditingLead} onOpenChange={setIsEditingLead}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
            <DialogDescription>
              Atualize as informações de contato e status do lead.
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={selectedLead.name}
                  onChange={(e) => setSelectedLead({ ...selectedLead, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contactInfo">Contato (Email/Telefone)</Label>
                <Input
                  id="edit-contactInfo"
                  value={selectedLead.contactInfo}
                  onChange={(e) => setSelectedLead({ ...selectedLead, contactInfo: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={selectedLead.status} 
                  onValueChange={(value) => setSelectedLead({ ...selectedLead, status: value as Lead["status"] })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Novo</SelectItem>
                    <SelectItem value="contacted">Contatado</SelectItem>
                    <SelectItem value="quoted">Orçado</SelectItem>
                    <SelectItem value="sold">Vendido</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-assignedTo">Atribuído para</Label>
                <Input
                  id="edit-assignedTo"
                  value={selectedLead.assignedTo}
                  onChange={(e) => setSelectedLead({ ...selectedLead, assignedTo: e.target.value })}
                />
              </div>
              
              {(selectedLead.status === "quoted" || selectedLead.status === "sold") && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-valueQuoted">Valor Orçado (R$)</Label>
                  <Input
                    id="edit-valueQuoted"
                    type="number"
                    value={selectedLead.valueQuoted || ""}
                    onChange={(e) => setSelectedLead({ ...selectedLead, valueQuoted: parseFloat(e.target.value) })}
                  />
                </div>
              )}
              
              {selectedLead.status === "sold" && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-valueSold">Valor Vendido (R$)</Label>
                  <Input
                    id="edit-valueSold"
                    type="number"
                    value={selectedLead.valueSold || ""}
                    onChange={(e) => setSelectedLead({ ...selectedLead, valueSold: parseFloat(e.target.value) })}
                  />
                </div>
              )}
              
              {(selectedLead.status === "contacted" || selectedLead.status === "quoted") && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-followUpDate">Data de Seguimento</Label>
                  <Input
                    id="edit-followUpDate"
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={selectedLead.followUpDate || ""}
                    onChange={(e) => setSelectedLead({ ...selectedLead, followUpDate: e.target.value })}
                  />
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Observações</Label>
                <Textarea
                  id="edit-notes"
                  rows={3}
                  value={selectedLead.notes}
                  onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedLead(null);
              setIsEditingLead(false);
            }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateLead}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LeadManagement;
