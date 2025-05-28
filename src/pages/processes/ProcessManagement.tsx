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
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { Badge } from "@/components/ui/badge";

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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'new': 'default',
      'novo': 'default',
      'in_progress': 'secondary',
      'em_andamento': 'secondary',
      'completed': 'default',
      'concluido': 'default',
      'canceled': 'destructive',
      'cancelado': 'destructive'
    };
    return variants[status.toLowerCase()] || 'outline';
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

  const columns = [
    {
      key: 'id',
      label: 'ID',
      className: 'w-[100px]',
      render: (value: string) => (
        <span className="font-mono text-xs">{value.substring(0, 8)}</span>
      )
    },
    {
      key: 'client',
      label: 'Cliente',
      render: (_: any, row: Process) => (
        row.client ? (
          <div>
            <div className="font-medium">{row.client.name}</div>
            <div className="text-xs text-muted-foreground">{row.client.cpf_cnpj}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      )
    },
    {
      key: 'vehicle',
      label: 'Veículo',
      render: (_: any, row: Process) => (
        row.vehicle ? (
          <div>
            <div className="font-medium">{row.vehicle.plate}</div>
            <div className="text-xs text-muted-foreground">{row.vehicle.brand} {row.vehicle.model}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      )
    },
    {
      key: 'process_type',
      label: 'Tipo',
      render: (value: string) => getProcessTypeDisplay(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={getStatusBadge(value)} className="text-xs">
          {value}
        </Badge>
      )
    },
    {
      key: 'created_at',
      label: 'Data',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'actions',
      label: 'Ações',
      className: 'text-right',
      render: (_: any, row: Process) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/processos/${row.id}`);
          }}
        >
          Ver Detalhes
        </Button>
      )
    }
  ];

  const mobileCardRenderer = (process: Process, index: number) => (
    <Card key={process.id} className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4" onClick={() => navigate(`/processos/${process.id}`)}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-medium text-sm">
              {process.client?.name || 'Cliente não informado'}
            </p>
            <p className="text-xs text-muted-foreground">
              ID: {process.id.substring(0, 8)}
            </p>
          </div>
          <Badge variant={getStatusBadge(process.status)} className="text-xs">
            {process.status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tipo:</span>
            <span>{getProcessTypeDisplay(process.process_type)}</span>
          </div>
          
          {process.vehicle && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Veículo:</span>
              <span>{process.vehicle.plate}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Data:</span>
            <span>{formatDate(process.created_at)}</span>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-3">
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gerenciamento de Processos</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Visualize e gerencie todos os processos
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/processos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl">Filtros</CardTitle>
          <CardDescription>Refine sua busca de processos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            
            <div className="sm:col-span-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente, placa..."
                    className="pl-8"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                <Button type="submit" className="px-3">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filtrar</span>
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl">Lista de Processos</CardTitle>
          <CardDescription>
            {total} {total === 1 ? 'processo encontrado' : 'processos encontrados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            data={processes}
            columns={columns}
            keyField="id"
            loading={loading}
            emptyMessage="Nenhum processo encontrado com os filtros atuais"
            mobileCardRenderer={mobileCardRenderer}
            onRowClick={(process) => navigate(`/processos/${process.id}`)}
          />

          {!loading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
              <div className="text-sm text-muted-foreground order-2 sm:order-1">
                Mostrando <span className="font-medium">{((page - 1) * limit) + 1}</span> a{" "}
                <span className="font-medium">{Math.min(page * limit, total)}</span> de{" "}
                <span className="font-medium">{total}</span> resultados
              </div>
              <div className="flex items-center space-x-2 order-1 sm:order-2">
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
