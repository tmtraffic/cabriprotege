import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  FileText, 
  User, 
  Car, 
  CalendarClock, 
  AlertTriangle, 
  ArrowLeft,
  PenLine,
  Clock,
  CheckCircle
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Process {
  id: string;
  client_id: string;
  vehicle_id?: string;
  process_type: string;
  status: string;
  description?: string;
  assigned_to_user_id?: string;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: string;
  name: string;
  cpf_cnpj: string;
  email?: string;
  phone?: string;
}

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
}

interface Infraction {
  id: string;
  auto_number: string;
  description: string;
  date: string;
  value: number;
  points?: number;
  status: string;
}

interface AssignedUser {
  id: string;
  name: string;
  email: string;
}

const ProcessDetail = () => {
  const { processId } = useParams<{ processId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [process, setProcess] = useState<Process | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [assignedUser, setAssignedUser] = useState<AssignedUser | null>(null);
  const [infractions, setInfractions] = useState<Infraction[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [availableInfractions, setAvailableInfractions] = useState<Infraction[]>([]);
  const [isLoadingAvailableInfractions, setIsLoadingAvailableInfractions] = useState(false);
  const [showAddInfractionDialog, setShowAddInfractionDialog] = useState(false);
  const [selectedInfractionIds, setSelectedInfractionIds] = useState<string[]>([]);
  const [isLinkingInfractions, setIsLinkingInfractions] = useState(false);
  
  useEffect(() => {
    const fetchProcessDetails = async () => {
      if (!processId) return;
      
      setLoading(true);
      try {
        // Fetch process details
        const { data: processData, error: processError } = await supabase.functions.invoke("get-process-by-id", {
          body: { process_id: processId }
        });
        
        if (processError) throw new Error(processError.message);
        if (!processData) throw new Error("Process not found");
        
        setProcess(processData);
        
        // Fetch client details
        if (processData.client_id) {
          const { data: clientData, error: clientError } = await supabase.functions.invoke("get-client-by-id", {
            body: { client_id: processData.client_id }
          });
          
          if (!clientError && clientData) {
            setClient(clientData);
          }
        }
        
        // Fetch vehicle details if available
        if (processData.vehicle_id) {
          const { data: vehicleData, error: vehicleError } = await supabase
            .from("vehicles")
            .select("id, plate, brand, model")
            .eq("id", processData.vehicle_id)
            .single();
          
          if (!vehicleError && vehicleData) {
            setVehicle(vehicleData);
          }
        }
        
        // Fetch assigned user details if available
        if (processData.assigned_to_user_id) {
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("id, name, email")
            .eq("id", processData.assigned_to_user_id)
            .single();
          
          if (!userError && userData) {
            setAssignedUser(userData);
          }
        }
        
        // Fetch linked infractions
        const { data: infractionData, error: infractionError } = await supabase.functions.invoke("list-infractions-by-process-id", {
          body: { process_id: processId }
        });
        
        if (!infractionError && infractionData) {
          setInfractions(infractionData);
        }
        
      } catch (error: any) {
        console.error("Error fetching process details:", error);
        toast({
          title: "Erro ao carregar detalhes do processo",
          description: error.message || "Não foi possível carregar os detalhes do processo.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProcessDetails();
  }, [processId, toast]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'new':
      case 'novo':
        return "bg-blue-100 text-blue-800";
      case 'in_progress':
      case 'em_andamento':
        return "bg-yellow-100 text-yellow-800";
      case 'completed':
      case 'concluido':
        return "bg-green-100 text-green-800";
      case 'canceled':
      case 'cancelado':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProcessTypeDisplay = (type: string) => {
    const types: {[key: string]: string} = {
      'Fine Appeal': 'Recurso de Multa',
      'fine_appeal': 'Recurso de Multa',
      'License Renewal': 'Renovação CNH',
      'license_renewal': 'Renovação CNH',
      'Vehicle Registration': 'Registro de Veículo',
      'vehicle_registration': 'Registro de Veículo'
    };
    
    return types[type] || type;
  };

  const handleUpdateProcess = async (updatedData: Partial<Process>) => {
    if (!process) return;
    
    try {
      const { data, error } = await supabase.functions.invoke("update-process", {
        body: { 
          process_id: process.id,
          ...updatedData
        }
      });
      
      if (error) throw new Error(error.message);
      
      // Update the local state with the updated process
      setProcess({ ...process, ...updatedData });
      setIsEditing(false);
      
      toast({
        title: "Processo atualizado",
        description: "As informações do processo foram atualizadas com sucesso."
      });
    } catch (error: any) {
      console.error("Error updating process:", error);
      toast({
        title: "Erro ao atualizar processo",
        description: error.message || "Não foi possível atualizar o processo.",
        variant: "destructive"
      });
    }
  };

  const fetchAvailableInfractions = async () => {
    if (!vehicle?.id) return;
    
    setIsLoadingAvailableInfractions(true);
    try {
      const { data, error } = await supabase.functions.invoke("list-infractions-by-vehicle", {
        body: { vehicle_id: vehicle.id }
      });
      
      if (error) throw new Error(error.message);
      
      // Filter out infractions that are already linked to this process
      const linkedIds = infractions.map(inf => inf.id);
      const availableOnes = (data || []).filter(inf => !linkedIds.includes(inf.id));
      
      setAvailableInfractions(availableOnes);
    } catch (error) {
      console.error("Error fetching available infractions:", error);
      toast({
        title: "Erro ao buscar infrações",
        description: "Não foi possível carregar as infrações disponíveis.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAvailableInfractions(false);
    }
  };

  const handleInfractionSelection = (infractionId: string) => {
    setSelectedInfractionIds(prev => 
      prev.includes(infractionId) 
        ? prev.filter(id => id !== infractionId)
        : [...prev, infractionId]
    );
  };

  const linkInfractions = async () => {
    if (!process?.id || selectedInfractionIds.length === 0) return;
    
    setIsLinkingInfractions(true);
    try {
      // For each selected infraction, update it to link to this process
      const updatePromises = selectedInfractionIds.map(infractionId => 
        supabase
          .from('infractions')
          .update({ process_id: process.id })
          .eq('id', infractionId)
      );
      
      await Promise.all(updatePromises);
      
      toast({
        title: "Infrações vinculadas",
        description: `${selectedInfractionIds.length} infrações foram vinculadas a este processo.`
      });
      
      // Refresh infractions list
      const { data, error } = await supabase.functions.invoke("list-infractions-by-process-id", {
        body: { process_id: processId }
      });
      
      if (!error && data) {
        setInfractions(data);
      }
      
      // Clear selection and close dialog
      setSelectedInfractionIds([]);
      setShowAddInfractionDialog(false);
    } catch (error) {
      console.error("Error linking infractions:", error);
      toast({
        title: "Erro ao vincular infrações",
        description: "Não foi possível vincular as infrações selecionadas.",
        variant: "destructive"
      });
    } finally {
      setIsLinkingInfractions(false);
    }
  };

  const createAndLinkInfraction = async (infractionData: any) => {
    if (!process?.id || !vehicle?.id) return;
    
    try {
      // When calling create-infraction, we send vehicle_id and other infraction data
      // but not process_id directly in the object - we're passing it separately
      const { data, error } = await supabase.functions.invoke("create-infraction", {
        body: {
          ...infractionData,
          vehicle_id: vehicle.id,
          process_id: process.id  // This is handled properly in the Edge Function
        }
      });
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Infração criada",
        description: "A infração foi criada e vinculada a este processo."
      });
      
      // Refresh infractions list
      const { data: updatedInfractions, error: fetchError } = await supabase.functions.invoke("list-infractions-by-process-id", {
        body: { process_id: processId }
      });
      
      if (!fetchError && updatedInfractions) {
        setInfractions(updatedInfractions);
      }
    } catch (error: any) {
      console.error("Error creating infraction:", error);
      toast({
        title: "Erro ao criar infração",
        description: error.message || "Não foi possível criar a infração.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Carregando detalhes do processo...</p>
      </div>
    );
  }

  if (!process) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Processo não encontrado</h2>
        <p className="text-muted-foreground mb-6">O processo solicitado não foi encontrado ou você não tem permissão para acessá-lo.</p>
        <Button onClick={() => navigate("/processos")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para lista de processos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/processos")}
              className="p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-sm text-muted-foreground">Processos</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {getProcessTypeDisplay(process.process_type)}
            </h1>
            <Badge 
              className={`text-xs ${getStatusBadgeClass(process.status)}`}
            >
              {process.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {process.description || "Sem descrição adicional"}
          </p>
        </div>
        <div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            <PenLine className="h-4 w-4 mr-2" />
            {isEditing ? "Cancelar Edição" : "Editar Processo"}
          </Button>
        </div>
      </div>

      {/* Process Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-muted-foreground" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {client ? (
              <div>
                <h3 className="font-medium text-lg">{client.name}</h3>
                <p className="text-sm text-muted-foreground">{client.cpf_cnpj}</p>
                {client.email && <p className="text-sm">{client.email}</p>}
                {client.phone && <p className="text-sm">{client.phone}</p>}
                <Button className="mt-4" variant="outline" size="sm" onClick={() => navigate(`/clientes/${client.id}`)}>
                  Ver perfil completo
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Informações do cliente não disponíveis</p>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Car className="h-5 w-5 mr-2 text-muted-foreground" />
              Veículo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehicle ? (
              <div>
                <h3 className="font-medium text-lg">{vehicle.plate}</h3>
                <p className="text-sm text-muted-foreground">{vehicle.brand} {vehicle.model}</p>
                <Button className="mt-4" variant="outline" size="sm" onClick={() => navigate(`/veiculos/${vehicle.id}`)}>
                  Ver dados completos
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-muted-foreground mb-4">Nenhum veículo vinculado a este processo</p>
                <Button variant="outline" size="sm">
                  Vincular veículo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Process Details and Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Process Details */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Detalhes do Processo</CardTitle>
            <CardDescription>
              Informações básicas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">ID do Processo</p>
              <p className="text-sm font-mono text-muted-foreground">{process.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Data de Criação</p>
              <p className="text-sm text-muted-foreground">{formatDate(process.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Última Atualização</p>
              <p className="text-sm text-muted-foreground">{formatDate(process.updated_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Responsável</p>
              {assignedUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 rounded-full bg-primary text-primary-foreground items-center justify-center text-xs font-medium">
                    {assignedUser.name.charAt(0)}
                  </div>
                  <span className="text-sm">{assignedUser.name}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Não atribuído</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-0">
            <Tabs defaultValue="infractions">
              <TabsList>
                <TabsTrigger value="infractions">Infrações</TabsTrigger>
                <TabsTrigger value="deadlines">Prazos</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>

              <TabsContent value="infractions" className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Infrações Vinculadas</h3>
                    <Dialog open={showAddInfractionDialog} onOpenChange={setShowAddInfractionDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={fetchAvailableInfractions}>
                          Vincular Infrações
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Vincular Infrações</DialogTitle>
                          <DialogDescription>
                            Selecione as infrações que deseja vincular a este processo.
                          </DialogDescription>
                        </DialogHeader>
                        
                        {isLoadingAvailableInfractions ? (
                          <div className="flex justify-center py-8">
                            <LoadingSpinner size="lg" />
                          </div>
                        ) : availableInfractions.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">
                              Não há infrações disponíveis para vincular.
                            </p>
                          </div>
                        ) : (
                          <div className="max-h-[400px] overflow-y-auto space-y-2">
                            {availableInfractions.map((infraction) => (
                              <div 
                                key={infraction.id} 
                                className={`border rounded-md p-3 cursor-pointer transition-colors ${
                                  selectedInfractionIds.includes(infraction.id) 
                                    ? "border-primary bg-primary/5" 
                                    : "hover:bg-accent"
                                }`}
                                onClick={() => handleInfractionSelection(infraction.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">
                                      {infraction.auto_number || "Sem número de auto"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {infraction.description || "Sem descrição"}
                                    </p>
                                    <div className="flex items-center mt-1 text-sm">
                                      <span className="mr-3">Data: {formatDate(infraction.date)}</span>
                                      <span>Valor: R$ {infraction.value.toFixed(2)}</span>
                                    </div>
                                  </div>
                                  <Checkbox 
                                    checked={selectedInfractionIds.includes(infraction.id)}
                                    onCheckedChange={() => handleInfractionSelection(infraction.id)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowAddInfractionDialog(false)}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={linkInfractions} 
                            disabled={isLinkingInfractions || selectedInfractionIds.length === 0}
                          >
                            {isLinkingInfractions ? (
                              <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Vinculando...
                              </>
                            ) : (
                              "Vincular Selecionadas"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {infractions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-3" />
                      <h4 className="font-medium mb-1">Nenhuma infração vinculada</h4>
                      <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                        Este processo ainda não possui infrações vinculadas. Você pode adicionar uma infração manualmente ou vincular uma infração existente.
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={fetchAvailableInfractions}
                        >
                          Buscar Infrações
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            // Navigate to infraction creation with process_id and vehicle_id
                            if (process?.id && vehicle?.id) {
                              navigate(`/infracoes/nova?processId=${process.id}&vehicleId=${vehicle.id}`);
                            } else {
                              toast({
                                title: "Dados incompletos",
                                description: "É necessário ter um veículo vinculado para adicionar uma infração.",
                                variant: "destructive"
                              });
                            }
                          }}
                        >
                          Adicionar Manualmente
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {infractions.map((infraction) => (
                        <div key={infraction.id} className="border rounded-md p-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{infraction.auto_number || "Sem número de auto"}</p>
                              <p className="text-sm text-muted-foreground">{infraction.description || "Sem descrição"}</p>
                            </div>
                            <Badge className={getStatusBadgeClass(infraction.status)}>
                              {infraction.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-sm">
                            <div className="flex items-center">
                              <CalendarClock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{formatDate(infraction.date)}</span>
                            </div>
                            <div>R$ {infraction.value.toFixed(2)}</div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/infracoes/${infraction.id}`)}
                            >
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="deadlines" className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Prazos Críticos</h3>
                    <Button size="sm">
                      Adicionar Prazo
                    </Button>
                  </div>

                  <div className="flex flex-col items-center justify-center py-8">
                    <Clock className="h-12 w-12 text-blue-500 mb-3" />
                    <h4 className="font-medium mb-1">Nenhum prazo registrado</h4>
                    <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                      Não há prazos cadastrados para este processo. Adicione prazos importantes para acompanhamento.
                    </p>
                    <Button size="sm">
                      Adicionar Prazo
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Documentos</h3>
                    <Button size="sm">
                      Anexar Documento
                    </Button>
                  </div>

                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-blue-500 mb-3" />
                    <h4 className="font-medium mb-1">Nenhum documento anexado</h4>
                    <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                      Este processo ainda não possui documentos anexados. Você pode adicionar documentos importantes para consulta.
                    </p>
                    <Button size="sm">
                      Anexar Documento
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Histórico de Atividades</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 rounded-full bg-blue-100 items-center justify-center text-blue-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Processo criado</p>
                        <p className="text-xs text-muted-foreground">{formatDate(process.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 rounded-full bg-green-100 items-center justify-center text-green-600">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status atualizado para: {process.status}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(process.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default ProcessDetail;
