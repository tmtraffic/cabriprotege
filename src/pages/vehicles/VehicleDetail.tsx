
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, FileText, AlertTriangle, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { fetchVehicleById, Vehicle } from "@/services/VehicleService";
import { fetchInfractions, Infraction } from "@/services/InfractionService";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [infractions, setInfractions] = useState<Infraction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const loadVehicleData = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        const vehicleData = await fetchVehicleById(id);
        
        if (!vehicleData) {
          toast({
            title: "Veículo não encontrado",
            description: "O veículo solicitado não foi encontrado ou você não tem permissão para acessá-lo.",
            variant: "destructive",
          });
          return;
        }
        
        setVehicle(vehicleData);
        
        // Load infractions for this vehicle
        const { data, error } = await supabase
          .from('infractions')
          .select('*')
          .eq('vehicle_id', id);
        
        if (error) {
          throw error;
        }
        
        setInfractions(data as Infraction[]);
      } catch (error) {
        console.error("Error loading vehicle data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as informações do veículo.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVehicleData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-red-800">Veículo não encontrado</h2>
          <p className="text-red-600 mt-1">
            O veículo solicitado não foi encontrado ou você não tem permissão para acessá-lo.
          </p>
          <Button asChild className="mt-4">
            <Link to="/veiculos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para lista de veículos
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const activeInfractions = infractions.filter(i => ['pending', 'processed', 'notified'].includes(i.status));
  const totalPoints = infractions.reduce((sum, inf) => sum + (inf.points || 0), 0);
  const totalValue = infractions.reduce((sum, inf) => sum + inf.value, 0).toFixed(2);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="icon" asChild className="mr-4">
            <Link to="/veiculos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{vehicle.brand} {vehicle.model}</h1>
          <Badge className={`ml-3 ${vehicle.professional_use ? 'bg-cabricop-orange' : 'bg-cabricop-blue'}`}>
            {vehicle.professional_use ? 'Profissional' : 'Particular'}
          </Badge>
        </div>
        <Button asChild>
          <Link to="/processos/novo">Novo Recurso</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações do Veículo</CardTitle>
            <CardDescription>Detalhes cadastrais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cabricop-blue bg-opacity-10">
                <Car className="h-12 w-12 text-cabricop-blue" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Placa</p>
                <p className="font-medium">{vehicle.plate}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Categoria</p>
                <p className="font-medium">{vehicle.category || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Marca</p>
                <p className="font-medium">{vehicle.brand}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Modelo</p>
                <p className="font-medium">{vehicle.model}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Ano</p>
                <p className="font-medium">{vehicle.year || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Cor</p>
                <p className="font-medium">{vehicle.color || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Renavam</p>
                <p className="font-medium">{vehicle.renavam || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Uso</p>
                <p className="font-medium">{vehicle.professional_use ? 'Profissional' : 'Particular'}</p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to={`/veiculos/${id}/editar`}>Editar Veículo</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Infrações e Recursos</CardTitle>
            <CardDescription>Histórico do veículo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Infrações Ativas</p>
                    <h3 className="text-2xl font-bold">{activeInfractions.length}</h3>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pontos na CNH</p>
                    <h3 className="text-2xl font-bold">{totalPoints}</h3>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                    <h3 className="text-2xl font-bold">R$ {totalValue}</h3>
                  </div>
                  <div className="p-2 bg-red-100 rounded-full">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </Card>
            </div>

            <Tabs defaultValue="infractions">
              <TabsList>
                <TabsTrigger value="infractions">Infrações</TabsTrigger>
                <TabsTrigger value="processes">Recursos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="infractions" className="mt-4">
                {infractions.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-md border">
                    <AlertTriangle className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="mt-2 text-slate-500">Não há infrações registradas para este veículo</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {infractions.map((infraction) => (
                      <div key={infraction.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{infraction.description || "Infração sem descrição"}</h3>
                            <p className="text-sm text-muted-foreground">
                              Auto: {infraction.auto_number || "Sem número"} | Data: {new Date(infraction.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">R$ {infraction.value.toFixed(2)}</p>
                            <Badge className={
                              infraction.status === 'pending' ? 'bg-yellow-500' : 
                              infraction.status === 'contested' ? 'bg-orange-500' : 
                              infraction.status === 'closed' ? 'bg-green-500' : 'bg-blue-500'
                            }>
                              {infraction.status === 'pending' ? 'Pendente' : 
                               infraction.status === 'contested' ? 'Contestada' : 
                               infraction.status === 'closed' ? 'Encerrada' : 'Em processamento'}
                            </Badge>
                          </div>
                        </div>
                        {infraction.status === 'pending' && (
                          <Button size="sm" className="mt-2" asChild>
                            <Link to="/processos/novo">Contestar</Link>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="processes" className="mt-4">
                <div className="text-center py-8 bg-slate-50 rounded-md border">
                  <FileText className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="mt-2 text-slate-500">Em breve você poderá visualizar os recursos deste veículo aqui</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleDetail;
