
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Filter, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Process {
  id: string;
  client?: {
    id: string;
    name: string;
    cpf_cnpj: string;
  };
  vehicle?: {
    id: string;
    plate: string;
    brand: string;
    model: string;
  };
  process_type: string;
  status: string;
  description: string;
  created_at: string;
}

const ProcessManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    process_type: "",
    search: ""
  });

  const fetchProcesses = async () => {
    setLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('list-all-processes', {
        body: { 
          page, 
          limit,
          ...(filters.status && { status: filters.status }),
          ...(filters.process_type && { process_type: filters.process_type })
        }
      });

      if (error) throw new Error(error.message);
      
      setProcesses(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error("Error fetching processes:", error);
      toast({
        title: "Erro ao carregar processos",
        description: "Não foi possível carregar a lista de processos. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, [page, limit, filters.status, filters.process_type]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, search is implemented client-side
    // In a more comprehensive implementation, we would pass the search term to the edge function
    fetchProcesses();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

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

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Processos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os processos
          </p>
        </div>
        <Button asChild>
          <Link to="/processos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Refine sua busca de processos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os Status</SelectItem>
                  <SelectItem value="new">Novo</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="canceled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/4">
              <Select 
                value={filters.process_type} 
                onValueChange={(value) => handleFilterChange('process_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Processo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os Tipos</SelectItem>
                  <SelectItem value="fine_appeal">Recurso de Multa</SelectItem>
                  <SelectItem value="license_renewal">Renovação CNH</SelectItem>
                  <SelectItem value="vehicle_registration">Registro de Veículo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente, placa ou processo..."
                    className="pl-8"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                <Button type="submit">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Lista de Processos</CardTitle>
          <CardDescription>
            {total} {total === 1 ? 'processo encontrado' : 'processos encontrados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : processes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum processo encontrado</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Não encontramos processos com os filtros atuais. Tente ajustar seus critérios de busca ou crie um novo processo.
              </p>
              <Button className="mt-4" asChild>
                <Link to="/processos/novo">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Processo
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processes.map((process) => (
                    <TableRow key={process.id}>
                      <TableCell className="font-mono text-xs">
                        {process.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        {process.client ? (
                          <div>
                            <div className="font-medium">{process.client.name}</div>
                            <div className="text-xs text-muted-foreground">{process.client.cpf_cnpj}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {process.vehicle ? (
                          <div>
                            <div className="font-medium">{process.vehicle.plate}</div>
                            <div className="text-xs text-muted-foreground">{process.vehicle.brand} {process.vehicle.model}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{getProcessTypeDisplay(process.process_type)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(process.status)}`}>
                          {process.status}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(process.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/processos/${process.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Mostrando <span className="font-medium">{((page - 1) * limit) + 1}</span> a{" "}
                <span className="font-medium">{Math.min(page * limit, total)}</span> de{" "}
                <span className="font-medium">{total}</span> resultados
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessManagement;
