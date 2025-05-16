import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Search, ArrowLeft, AlertTriangle } from "lucide-react";

// Define the form schema
const processSchema = z.object({
  client_id: z.string().min(1, { message: "Cliente é obrigatório" }),
  vehicle_id: z.string().optional(),
  process_type: z.string().min(1, { message: "Tipo de processo é obrigatório" }),
  description: z.string().optional(),
  status: z.string().default("new"),
  assigned_to_user_id: z.string().optional(),
});

type ProcessFormValues = z.infer<typeof processSchema>;

// Define client type
interface Client {
  id: string;
  name: string;
  cpf_cnpj: string;
}

// Define vehicle type
interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
}

// Define user type
interface User {
  id: string;
  name: string;
  role: string;
}

const ProcessCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  
  // Initialize form
  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      process_type: "fine_appeal",
      status: "new",
    },
  });
  
  // Watch client_id to fetch vehicles when it changes
  const selectedClientId = form.watch("client_id");
  
  // Fetch clients based on search
  useEffect(() => {
    const fetchClients = async () => {
      if (!clientSearch) return;
      
      setIsLoadingClients(true);
      try {
        // Fix: Using REST API directly since 'clients' table isn't in the types
        const { data, error } = await supabase
          .rpc('search_clients', {
            search_term: clientSearch
          });
        
        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Erro ao buscar clientes",
          description: "Não foi possível carregar a lista de clientes.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingClients(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      if (clientSearch) {
        fetchClients();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [clientSearch, toast]);
  
  // Fetch vehicles when client is selected
  useEffect(() => {
    if (!selectedClientId) {
      setVehicles([]);
      return;
    }
    
    const fetchVehicles = async () => {
      setIsLoadingVehicles(true);
      try {
        const { data, error } = await supabase.functions.invoke("get-vehicles-by-client-id", {
          body: { client_id: selectedClientId }
        });
        
        if (error) throw new Error(error.message);
        setVehicles(data || []);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast({
          title: "Erro ao buscar veículos",
          description: "Não foi possível carregar os veículos do cliente.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingVehicles(false);
      }
    };
    
    fetchVehicles();
  }, [selectedClientId, toast]);
  
  // Fetch users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, role")
          .in("role", ["admin", "employee"]) // Changed 'staff' to 'employee' to match app_role enum
          .order("name");
        
        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Handle form submission
  const onSubmit = async (values: ProcessFormValues) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-process", {
        body: values
      });
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Processo criado com sucesso",
        description: "O novo processo foi registrado no sistema.",
      });
      
      // Redirect to the new process page
      navigate(`/processos/${data.id}`);
    } catch (error: any) {
      console.error("Error creating process:", error);
      toast({
        title: "Erro ao criar processo",
        description: error.message || "Não foi possível criar o processo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
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
          <h1 className="text-3xl font-bold tracking-tight">Novo Processo</h1>
          <p className="text-muted-foreground">
            Crie um novo processo no sistema
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações do Processo</CardTitle>
          <CardDescription>
            Preencha os dados básicos para registrar um novo processo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Client Selection Section */}
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Cliente</h3>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar cliente por nome ou CPF/CNPJ"
                        className="pl-8"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                      />
                    </div>
                    
                    {isLoadingClients && (
                      <div className="flex justify-center py-2">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}
                    
                    {!isLoadingClients && clientSearch && clients.length === 0 && (
                      <div className="text-center py-2 text-muted-foreground">
                        Nenhum cliente encontrado com este termo de busca.
                      </div>
                    )}
                    
                    {clients.length > 0 && (
                      <FormField
                        control={form.control}
                        name="client_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Selecione o Cliente</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                  {clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                      {client.name} - {client.cpf_cnpj}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {selectedClientId && (
                      <div className="mt-2 text-sm">
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => navigate(`/clientes/${selectedClientId}`)}
                        >
                          Ver perfil completo do cliente
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Vehicle Selection Section (if client is selected) */}
                {selectedClientId && (
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Veículo (Opcional)</h3>
                    
                    <FormField
                      control={form.control}
                      name="vehicle_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selecione o Veículo</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um veículo (opcional)" />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoadingVehicles ? (
                                  <div className="flex justify-center py-2">
                                    <LoadingSpinner size="sm" />
                                  </div>
                                ) : vehicles.length === 0 ? (
                                  <div className="text-center py-2 text-muted-foreground">
                                    Nenhum veículo cadastrado para este cliente.
                                  </div>
                                ) : (
                                  vehicles.map((vehicle) => (
                                    <SelectItem key={vehicle.id} value={vehicle.id}>
                                      {vehicle.plate} - {vehicle.brand} {vehicle.model}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Associar um veículo é opcional, mas recomendado para processos relacionados a multas e documentação veicular.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {!isLoadingVehicles && vehicles.length === 0 && selectedClientId && (
                      <div className="mt-4 flex items-center p-4 bg-yellow-50 rounded-md">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Este cliente não possui veículos cadastrados</p>
                          <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto mt-1"
                            onClick={() => navigate(`/veiculos/novo?client_id=${selectedClientId}`)}
                          >
                            Cadastrar um veículo agora
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Process Details */}
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Detalhes do Processo</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="process_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Processo</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de processo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fine_appeal">Recurso de Multa</SelectItem>
                                <SelectItem value="license_renewal">Renovação CNH</SelectItem>
                                <SelectItem value="vehicle_registration">Registro de Veículo</SelectItem>
                                <SelectItem value="driver_license_suspension">Suspensão CNH</SelectItem>
                                <SelectItem value="vehicle_documentation">Documentação Veicular</SelectItem>
                                <SelectItem value="other">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status Inicial</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status inicial" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">Novo</SelectItem>
                                <SelectItem value="in_progress">Em Andamento</SelectItem>
                                <SelectItem value="waiting_documents">Aguardando Documentos</SelectItem>
                                <SelectItem value="waiting_client">Aguardando Cliente</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o processo, incluindo detalhes importantes..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Assign To User (if there are users available) */}
                {users.length > 0 && (
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Atribuição</h3>
                    
                    <FormField
                      control={form.control}
                      name="assigned_to_user_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsável</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value || ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um responsável (opcional)" />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoadingUsers ? (
                                  <div className="flex justify-center py-2">
                                    <LoadingSpinner size="sm" />
                                  </div>
                                ) : (
                                  users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.name} ({user.role === 'admin' ? 'Administrador' : 'Atendente'})
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Atribuir um responsável é opcional. Se não selecionado, o processo ficará sem atribuição.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {/* Additional Information (Accordion) */}
                <Accordion type="single" collapsible className="border rounded-md">
                  <AccordionItem value="infractions">
                    <AccordionTrigger className="px-4">Vincular Infrações</AccordionTrigger>
                    <AccordionContent className="px-4">
                      <p className="text-muted-foreground mb-4">
                        Após criar o processo, você poderá vincular infrações existentes ou cadastrar novas infrações diretamente na página do processo.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="deadlines">
                    <AccordionTrigger className="px-4">Adicionar Prazos</AccordionTrigger>
                    <AccordionContent className="px-4">
                      <p className="text-muted-foreground mb-4">
                        Após criar o processo, você poderá adicionar prazos importantes e configurar lembretes para acompanhamento.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="documents">
                    <AccordionTrigger className="px-4">Anexar Documentos</AccordionTrigger>
                    <AccordionContent className="px-4">
                      <p className="text-muted-foreground mb-4">
                        Após criar o processo, você poderá fazer upload de documentos relacionados, como comprovantes, formulários e fotos.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/processos")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner className="mr-2" size="sm" />
                      Criando...
                    </>
                  ) : (
                    "Criar Processo"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessCreation;
