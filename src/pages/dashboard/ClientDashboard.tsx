import { useEffect, useState } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchVehicles, Vehicle } from "@/services/VehicleService";
import { fetchProcesses, Process } from "@/services/ProcessService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InfractionStats from "@/components/infractions/InfractionStats"; // Fixed import statement

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Update to pass a filters object instead of just user.id
        const vehiclesData = await fetchVehicles({ owner_id: user.id });
        setVehicles(vehiclesData);
        
        const processesData = await fetchProcesses(user.id);
        setProcesses(processesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);

  const totalVehicles = vehicles.length;
  const totalProcesses = processes.length;

  // Mock data for process status distribution
  const processStatusData = [
    { name: 'Pendente', value: processes.filter(p => p.status === 'pending').length },
    { name: 'Em Andamento', value: processes.filter(p => p.status === 'in_progress').length },
    { name: 'Concluído', value: processes.filter(p => p.status === 'completed').length },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Vehicles Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Veículos</CardTitle>
            <CardDescription>Visão geral dos seus veículos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-muted-foreground">Total de veículos</p>
            <Button asChild className="mt-4">
              <Link to="/veiculos">Gerenciar Veículos</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Processes Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Processos</CardTitle>
            <CardDescription>Visão geral dos seus processos em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProcesses}</div>
            <p className="text-muted-foreground">Total de processos</p>
            <Button asChild className="mt-4">
              <Link to="/processos">Gerenciar Processos</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Process Status Distribution */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Distribuição de Status dos Processos</CardTitle>
            <CardDescription>Visão geral do status dos seus processos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Latest Processes Table */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Processos Recentes</CardTitle>
            <CardDescription>Seus processos mais recentes</CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Criação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.map((process) => (
                  <TableRow key={process.id}>
                    <TableCell>{process.type}</TableCell>
                    <TableCell>{process.status}</TableCell>
                    <TableCell>{new Date(process.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Infraction Statistics */}
      <div className="mt-6">
        <InfractionStats vehicles={vehicles} />
      </div>
    </div>
  );
};

export default ClientDashboard;
