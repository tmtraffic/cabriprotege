
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, FileText, AlertTriangle, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { fetchVehicles, Vehicle } from "@/services/VehicleService";
import { fetchProcesses, Process } from "@/services/ProcessService";
import { fetchDeadlines, fetchUpcomingDeadlines, Deadline } from "@/services/DeadlineService";
import { fetchInfractions, Infraction } from "@/services/InfractionService";
import InfractionStats from "@/components/infractions/InfractionStats";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ClientDashboard = () => {
  const { user } = useSupabaseAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [infractions, setInfractions] = useState<Infraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [cnhPoints, setCnhPoints] = useState(0);
  const [nextConsultation, setNextConsultation] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [vehiclesData, processesData, deadlinesData, upcomingDeadlinesData] = await Promise.all([
          fetchVehicles(user.id),
          fetchProcesses(user.id),
          fetchDeadlines(user.id),
          fetchUpcomingDeadlines(30, user.id),
        ]);
        
        setVehicles(vehiclesData);
        setProcesses(processesData);
        setDeadlines(upcomingDeadlinesData);
        
        // Calculate CNH points based on infractions
        // For this example, we'll make a simplified calculation
        let totalPoints = 0;
        for (const vehicle of vehiclesData) {
          const { data, error } = await supabase
            .from('infractions')
            .select('points')
            .eq('vehicle_id', vehicle.id);
            
          if (!error && data) {
            totalPoints += data.reduce((sum, inf) => sum + (inf.points || 0), 0);
          }
        }
        
        setCnhPoints(totalPoints);
        
        // Set next consultation date (for example purposes)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 4); // 4 days from now
        setNextConsultation(futureDate.toISOString());
        
        // Get any new infractions
        const latestInfraction = await getLatestInfraction(user.id);
        if (latestInfraction) {
          setInfractions([latestInfraction]);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as informações do dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);
  
  // Function to get the latest infraction for notification purposes
  const getLatestInfraction = async (userId: string): Promise<Infraction | null> => {
    try {
      // Find all user vehicles
      const { data: userVehicles } = await supabase
        .from('vehicles')
        .select('id')
        .eq('owner_id', userId);
        
      if (!userVehicles || userVehicles.length === 0) return null;
      
      const vehicleIds = userVehicles.map(v => v.id);
      
      // Find the most recent infraction for any of the user's vehicles
      const { data, error } = await supabase
        .from('infractions')
        .select(`
          *,
          vehicle:vehicle_id (
            plate,
            brand,
            model
          )
        `)
        .in('vehicle_id', vehicleIds)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error || !data || data.length === 0) return null;
      
      return data[0] as Infraction;
    } catch (error) {
      console.error("Error getting latest infraction:", error);
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link to="/processos/novo">Novo Recurso</Link>
          </Button>
          <Button asChild>
            <Link to="/veiculos/novo">Adicionar Veículo</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : vehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              Veículos registrados no sistema
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : processes.filter(p => p.status !== 'completed' && p.status !== 'canceled').length}</div>
            <p className="text-xs text-muted-foreground">
              Processos em andamento
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos na CNH</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : `${cnhPoints}/40`}</div>
            <Progress value={loading ? 0 : cnhPoints * 2.5} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {loading ? '...' : `${(cnhPoints * 2.5).toFixed(1)}% da pontuação máxima`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading 
                ? '...' 
                : nextConsultation 
                  ? new Date(nextConsultation).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) 
                  : 'Não agendada'}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading 
                ? '...' 
                : nextConsultation 
                  ? `Em ${Math.ceil((new Date(nextConsultation).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias às 14:30`
                  : 'Contate seu consultor para agendar'}
            </p>
          </CardContent>
        </Card>
      </div>

      {infractions.length > 0 && (
        <Alert className="bg-orange-50 border-cabricop-orange">
          <AlertTriangle className="h-5 w-5 text-cabricop-orange" />
          <AlertTitle className="text-cabricop-orange">Atenção</AlertTitle>
          <AlertDescription>
            Nova multa detectada para o veículo {infractions[0].vehicle?.plate || '-'}. 
            <Link to="/processos/novo" className="text-cabricop-blue font-bold ml-1 hover:underline">
              Clique aqui
            </Link> para visualizar detalhes e iniciar um recurso.
          </AlertDescription>
        </Alert>
      )}

      <InfractionStats />

      <Tabs defaultValue="processes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="processes">Processos Recentes</TabsTrigger>
          <TabsTrigger value="deadlines">Prazos Importantes</TabsTrigger>
          <TabsTrigger value="vehicles">Meus Veículos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="processes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processos em Andamento</CardTitle>
              <CardDescription>
                Acompanhe o status dos seus processos ativos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
                </div>
              ) : processes.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-md border">
                  <FileText className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="mt-2 text-slate-500">Você não tem nenhum processo ativo no momento</p>
                  <Button className="mt-4" size="sm" asChild>
                    <Link to="/processos/novo">Iniciar novo processo</Link>
                  </Button>
                </div>
              ) : (
                processes.slice(0, 3).map(process => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'in_progress': return 'text-orange-500';
                      case 'documentation_needed': return 'text-blue-500';
                      case 'completed': return 'text-green-500';
                      case 'canceled': return 'text-red-500';
                      default: return 'text-gray-500';
                    }
                  };
                  
                  const getStatusText = (status: string) => {
                    switch (status) {
                      case 'pending': return 'Pendente';
                      case 'in_progress': return 'Em análise';
                      case 'documentation_needed': return 'Documentação pendente';
                      case 'review': return 'Em revisão';
                      case 'completed': return 'Concluído';
                      case 'canceled': return 'Cancelado';
                      default: return status;
                    }
                  };
                  
                  const getProgressValue = (status: string) => {
                    switch (status) {
                      case 'pending': return 10;
                      case 'in_progress': return 50;
                      case 'documentation_needed': return 30;
                      case 'review': return 80;
                      case 'completed': return 100;
                      case 'canceled': return 0;
                      default: return 0;
                    }
                  };

                  return (
                    <div className="rounded-lg border p-3" key={process.id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Processo #{process.id.substring(0, 6)}</p>
                          <p className="text-sm text-muted-foreground">
                            {process.type === 'fine_appeal' ? 'Recurso de multa' : 
                             process.type === 'license_suspension' ? 'Suspensão de CNH' :
                             process.type === 'license_revocation' ? 'Cassação de CNH' : 'Outro'} 
                            {process.description ? ` - ${process.description}` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Status: <span className={getStatusColor(process.status)}>{getStatusText(process.status)}</span></p>
                          <p className="text-xs text-muted-foreground">Última atualização: {new Date(process.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Progress value={getProgressValue(process.status)} className="h-2 mt-2" />
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prazos Importantes</CardTitle>
              <CardDescription>
                Fique atento aos prazos dos seus processos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
                </div>
              ) : deadlines.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-md border">
                  <Clock className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="mt-2 text-slate-500">Não há prazos pendentes no momento</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deadlines.map(deadline => {
                    const daysLeft = Math.ceil((new Date(deadline.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    let priorityClass = 'bg-green-100';
                    let priorityColor = 'text-green-600';
                    
                    if (daysLeft <= 2) {
                      priorityClass = 'bg-red-100';
                      priorityColor = 'text-red-600';
                    } else if (daysLeft <= 7) {
                      priorityClass = 'bg-orange-100';
                      priorityColor = 'text-orange-600';
                    }

                    return (
                      <div className="flex items-center gap-4 rounded-lg border p-3" key={deadline.id}>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${priorityClass}`}>
                          <Clock className={`h-5 w-5 ${priorityColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{deadline.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {deadline.process?.description || 'Processo em andamento'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${priorityColor}`}>{daysLeft} dias restantes</p>
                          <p className="text-xs text-muted-foreground">Vence em: {new Date(deadline.due_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meus Veículos</CardTitle>
              <CardDescription>
                Informações sobre os veículos registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-md border">
                  <Car className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="mt-2 text-slate-500">Você não tem nenhum veículo registrado</p>
                  <Button className="mt-4" size="sm" asChild>
                    <Link to="/veiculos/novo">Adicionar Veículo</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {vehicles.map(vehicle => {
                    return (
                      <div className="flex items-center gap-4 rounded-lg border p-3" key={vehicle.id}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                          <Car className="h-6 w-6 text-cabricop-blue" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{vehicle.plate}</p>
                            <span className={`rounded-full ${vehicle.professional_use ? 'bg-cabricop-orange' : 'bg-cabricop-blue'} px-2 py-0.5 text-xs text-white`}>
                              {vehicle.professional_use ? 'Profissional' : 'Particular'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.brand} {vehicle.model} {vehicle.year} - {vehicle.category ? `Categoria ${vehicle.category}` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <Link to={`/veiculos/${vehicle.id}`} className="text-xs text-cabricop-blue hover:underline">
                            Ver detalhes
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/veiculos/novo">
                  Adicionar Novo Veículo
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;
