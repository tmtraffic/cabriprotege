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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Search, ArrowLeft, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [availableInfractions, setAvailableInfractions] = useState<any[]>([]);
  const [isLoadingInfractions, setIsLoadingInfractions] = useState(false);
  const [selectedInfractions, setSelectedInfractions] = useState<string[]>([]);
  
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
        // Using the edge function instead of rpc
        const { data, error } = await supabase.functions.invoke("search-clients", {
          body: { search_term: clientSearch }
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
          .in("role", ["admin", "employee"]) 
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
  
  // Watch vehicle_id to fetch infractions when it changes
  const selectedVehicleId = form.watch("vehicle_id");
  
  // Fetch infractions when vehicle is selected
  useEffect(() => {
    if (!selectedVehicleId) {
      setAvailableInfractions([]);
      return;
    }
    
    const fetchInfractions = async () => {
      setIsLoadingInfractions(true);
      try {
        const { data, error } = await supabase.functions.invoke("list-infractions-by-vehicle", {
          body: { vehicle_id: selectedVehicleId, status: "pending" }
        });
        
        if (error) throw new Error(error.message);
        setAvailableInfractions(data || []);
      } catch (error) {
        console.error("Error fetching infractions:", error);
        toast({
          title: "Erro ao buscar infrações",
          description: "Não foi possível carregar as infrações do veículo.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingInfractions(false);
      }
    };
    
    fetchInfractions();
  }, [selectedVehicleId, toast]);
  
  // Handle infraction selection
  const handleInfractionSelection = (infractionId: string) => {
    setSelectedInfractions(prev => 
      prev.includes(infractionId) 
        ? prev.filter(id => id !== infractionId)
        : [...prev, infractionId]
    );
  };
  
  // Handle form submission
  const onSubmit = async (data: ProcessFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Add selected infractions to the process data
      const processData = {
        ...data,
        linked_infractions: selectedInfractions.length > 0 ? selectedInfractions : undefined
      };
      
      const { data: newProcess, error } = await supabase.functions.invoke("create-process", {
        body: processData
      });
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Processo criado com sucesso",
        description: "O novo processo foi registrado no sistema.",
      });
      
      // Redirect to the new process page
      navigate(`/processos/${newProcess.id}`);
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
                            Associar um veículo é opcional, mas recomendado para processos relacionados a multas e documentações veiculares.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {selectedClientId && (
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/clientes/${selectedClientId}/veiculos/novo`)}
                        >
                          Cadastrar novo veículo
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Infractions Section (if vehicle is selected) */}
                {selectedVehicleId && (
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Infrações Disponíveis</h3>
                    
                    {isLoadingInfractions ? (
                      <div className="flex justify-center py-4">
                        <LoadingSpinner size="md" />
                      </div>
                    ) : availableInfractions.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        Nenhuma infração pendente encontrada para este veículo.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {availableInfractions.map((infraction) => (
                          <div 
                            key={infraction.id} 
                            className={`border rounded-md p-3 cursor-pointer transition-colors ${
                              selectedInfractions.includes(infraction.id) 
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
                                checked={selectedInfractions.includes(infraction.id)}
                                onCheckedChange={() => handleInfractionSelection(infraction.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4 text-sm">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/infracoes/nova?vehicleId=${selectedVehicleId}`)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Nova Infração
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Process Type Section */}
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Detalhes do Processo</h3>
                  
                  <div className="space-y-4">
                    {/* Process Type */}
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
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva os detalhes do processo..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Status - normally defaulted to "new" */}
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
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">Novo</SelectItem>
                                <SelectItem value="in_progress">Em Andamento</SelectItem>
                                <SelectItem value="completed">Concluído</SelectItem>
                                <SelectItem value="canceled">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Assigned User */}
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
                                <SelectValue placeholder="Atribuir a um usuário (opcional)" />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoadingUsers ? (
                                  <div className="flex justify-center py-2">
                                    <LoadingSpinner size="sm" />
                                  </div>
                                ) : (
                                  users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.name} ({user.role === "admin" ? "Administrador" : "Funcionário"})
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Atribua este processo a um usuário responsável (opcional).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Criando Processo...
                      </>
                    ) : (
                      "Criar Processo"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessCreation;
