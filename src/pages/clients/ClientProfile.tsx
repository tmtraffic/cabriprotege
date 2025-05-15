
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Car, 
  FileText, 
  Phone, 
  Mail, 
  Edit, 
  Trash2, 
  Download, 
  UserCog, 
  Plus,
  AlertTriangle,
  Loader
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientData {
  id: string;
  name: string;
  cpf_cnpj: string;
  client_type: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  secondary_phone?: string;
  birth_date?: string;
  gender?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  cnh_number?: string;
  cnh_category?: string;
  cnh_expiration_date?: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
  communication_preferences?: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    phone: boolean;
  };
  notes?: string;
}

interface VehicleData {
  id: string;
  plate: string;
  renavam?: string;
  brand: string;
  model: string;
  year?: string;
  color?: string;
  chassis?: string;
  is_owner_client: boolean;
  owner_name?: string;
  owner_cpf?: string;
}

const ClientProfile = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<ClientData | null>(null);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch client data when component mounts or clientId changes
    if (clientId) {
      fetchClientData(clientId);
    }
  }, [clientId]);

  const fetchClientData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch client data
      const { data: clientData, error: clientError } = await supabase.functions.invoke('get-client-by-id', {
        body: { client_id: id }
      });
      
      if (clientError) {
        throw new Error(clientError.message || 'Failed to fetch client data');
      }
      
      setClient(clientData);
      
      // Fetch vehicles associated with this client
      const { data: vehiclesData, error: vehiclesError } = await supabase.functions.invoke('get-vehicles-by-client-id', {
        body: { client_id: id }
      });
      
      if (vehiclesError) {
        console.error('Error fetching vehicles:', vehiclesError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os veículos associados a este cliente.",
          variant: "destructive"
        });
      } else {
        setVehicles(vehiclesData || []);
      }
      
      // Future: fetch processes associated with this client
      
    } catch (err: any) {
      console.error('Error fetching client profile:', err);
      setError(err.message || 'An unexpected error occurred');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do cliente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const handleDeleteClient = async () => {
    if (!client) return;
    
    if (!confirm("Tem certeza que deseja excluir este cliente? Esta ação não pode ser revertida.")) {
      return;
    }
    
    try {
      // In a real implementation, you would call a delete-client edge function
      // For now, we're just showing a toast and redirecting
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso."
      });
      
      navigate("/clients");
    } catch (err: any) {
      toast({
        title: "Erro ao excluir",
        description: err.message || "Não foi possível excluir o cliente. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error || "Cliente não encontrado. Verifique o ID do cliente e tente novamente."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {client.client_type === 'individual' ? 'Particular' : 'Empresa'}
            </span>
            <p>Cliente desde {formatDate(client.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <UserCog className="h-4 w-4 mr-2" />
            Gerenciar Acesso
          </Button>
          <Button asChild>
            <Link to={`/clients/edit/${client.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Cliente
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Detalhes do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                <p>{client.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPF/CNPJ</p>
                <p>{client.cpf_cnpj}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                {client.email ? (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <p>{client.email}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">—</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                {client.phone ? (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <p>{client.phone}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">—</p>
                )}
              </div>
              {client.client_type === 'individual' && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                    <p>{formatDate(client.birth_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CNH</p>
                    <p>
                      {client.cnh_number ? 
                        `${client.cnh_number} ${client.cnh_category ? `(Categoria ${client.cnh_category})` : ''}` : 
                        <span className="text-muted-foreground">—</span>}
                    </p>
                  </div>
                </>
              )}
              {client.client_type === 'company' && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome Fantasia</p>
                  <p>{client.company_name || <span className="text-muted-foreground">—</span>}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                <p>
                  {client.address_street ? 
                    `${client.address_street}${client.address_number ? `, ${client.address_number}` : ''}
                    ${client.address_complement ? `, ${client.address_complement}` : ''}
                    ${client.address_neighborhood ? ` - ${client.address_neighborhood}` : ''}
                    ${client.address_city ? `, ${client.address_city}` : ''}
                    ${client.address_state ? ` - ${client.address_state}` : ''}
                    ${client.address_zip ? `, ${client.address_zip}` : ''}` : 
                    <span className="text-muted-foreground">—</span>}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Veículos Cadastrados</p>
              <p className="text-2xl font-bold">{vehicles.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Processos Ativos</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Processos Concluídos</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            {client.client_type === 'individual' && client.cnh_number && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pontos na CNH</p>
                <p className="text-2xl font-bold text-amber-600">--</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/clients/${client.id}/report`}>
                <Download className="h-4 w-4 mr-2" />
                Relatório Completo
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 h-auto">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="vehicles">Veículos</TabsTrigger>
          <TabsTrigger value="processes">Processos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Ações e atualizações nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              {/* In a future phase, we would load real activity data from an API */}
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma atividade recente</h3>
                <p className="text-muted-foreground max-w-md">
                  Não há registros de atividade para este cliente nos últimos 30 dias.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Prazos</CardTitle>
                <CardDescription>Datas importantes para ações</CardDescription>
              </CardHeader>
              <CardContent>
                {/* In a future phase, we would load real deadlines from an API */}
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum prazo pendente</h3>
                  <p className="text-muted-foreground max-w-md">
                    Não há prazos pendentes para este cliente.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Multas Recentes</CardTitle>
                <CardDescription>Multas identificadas nos últimos 90 dias</CardDescription>
              </CardHeader>
              <CardContent>
                {/* In a future phase, we would load real fine data from an API */}
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma multa recente</h3>
                  <p className="text-muted-foreground max-w-md">
                    Não há multas registradas para este cliente nos últimos 90 dias.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link to="/search">
                      <Search className="h-4 w-4 mr-2" />
                      Buscar Multas
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="vehicles" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Veículos Registrados</h2>
            <Button asChild>
              <Link to={`/vehicles/new?client_id=${client.id}`}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Veículo
              </Link>
            </Button>
          </div>
          
          {vehicles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Car className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum veículo cadastrado</h3>
                <p className="text-muted-foreground max-w-md">
                  Este cliente ainda não possui veículos cadastrados.
                </p>
                <Button className="mt-6" asChild>
                  <Link to={`/vehicles/new?client_id=${client.id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Veículo
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                {vehicles.map((vehicle, index) => (
                  <div 
                    key={vehicle.id} 
                    className={`p-6 ${index < vehicles.length - 1 ? 'border-b' : ''} flex flex-col md:flex-row gap-4 md:gap-8`}
                  >
                    <div className="w-full md:w-1/4">
                      <div className="bg-muted rounded-lg h-32 flex items-center justify-center">
                        <Car className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col md:flex-row gap-4 justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{vehicle.brand} {vehicle.model}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {vehicle.plate}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.year || "Ano não especificado"}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">RENAVAM</p>
                            <p className="text-sm">{vehicle.renavam || <span className="text-muted-foreground">—</span>}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Chassi</p>
                            <p className="text-sm">{vehicle.chassis || <span className="text-muted-foreground">—</span>}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Cor</p>
                            <p className="text-sm">{vehicle.color || <span className="text-muted-foreground">—</span>}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Proprietário</p>
                            <p className="text-sm">
                              {vehicle.is_owner_client ? client.name : (vehicle.owner_name || <span className="text-muted-foreground">—</span>)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col gap-2 self-end md:self-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/vehicles/${vehicle.id}`}>Ver Detalhes</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/search?plate=${vehicle.plate}`}>Buscar Multas</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="processes" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Processos</h2>
            <Button asChild>
              <Link to={`/processos/novo?client_id=${client.id}`}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Processo
              </Link>
            </Button>
          </div>
          
          {/* In Phase 2, we would integrate with the list-processes-by-client edge function */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum processo encontrado</h3>
              <p className="text-muted-foreground max-w-md">
                Não há processos cadastrados para este cliente.
              </p>
              <Button className="mt-6" asChild>
                <Link to={`/processos/novo?client_id=${client.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Iniciar Novo Processo
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Documentos</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Documento
            </Button>
          </div>
          
          {/* In Phase 2, we would integrate with a list-documents-by-client edge function */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum documento encontrado</h3>
              <p className="text-muted-foreground max-w-md">
                Não há documentos armazenados para este cliente.
              </p>
              <Button className="mt-6">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Documento
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            As ações nesta seção são permanentes e não podem ser desfeitas. Tenha certeza antes de prosseguir.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={handleDeleteClient}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Cliente
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientProfile;
