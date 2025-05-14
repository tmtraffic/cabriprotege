
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, SortAsc, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { fetchProcesses, fetchProcessesByStatus, Process, ProcessFilters } from "@/services/ProcessService";
import { fetchUpcomingDeadlines } from "@/services/DeadlineService";

const ProcessManagement = () => {
  const { toast } = useToast();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [criticalDeadlines, setCriticalDeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProcessFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadProcesses = async () => {
      try {
        setLoading(true);
        const data = await fetchProcesses(filters);
        setProcesses(data);
        
        // Load critical deadlines (due in the next 7 days)
        const deadlineData = await fetchUpcomingDeadlines(7);
        setCriticalDeadlines(deadlineData);
      } catch (error) {
        console.error("Error loading processes:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar dados dos processos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProcesses();
  }, [filters, toast]);
  
  const handleFilterChange = (filterName: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setFilters(prev => ({ ...prev, search: e.target.value }));
    } else {
      const { search, ...restFilters } = filters;
      setFilters(restFilters);
    }
  };

  const renderStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      'pending': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Novo' },
      'in_progress': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Em Andamento' },
      'documentation_needed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Aguardando Documentação' },
      'review': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Em Revisão' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Concluído' },
      'canceled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' }
    };
    
    const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Desconhecido' };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Processos</h1>
          <p className="text-muted-foreground">
            Gerencie processos e recursos de multas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to="/processos/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Processo
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Card className="w-full md:w-1/4">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm font-medium">Status</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-all" 
                  className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  defaultChecked
                  onChange={() => setFilters({})}
                />
                <label htmlFor="status-all" className="ml-2 text-sm">Todos</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-new" 
                  className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  onChange={(e) => handleFilterChange("status", e.target.checked ? "pending" : undefined)}
                />
                <label htmlFor="status-new" className="ml-2 text-sm">Novos</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-in-progress" 
                  className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  onChange={(e) => handleFilterChange("status", e.target.checked ? "in_progress" : undefined)}
                />
                <label htmlFor="status-in-progress" className="ml-2 text-sm">Em Andamento</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-documentation" 
                  className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  onChange={(e) => handleFilterChange("status", e.target.checked ? "documentation_needed" : undefined)}
                />
                <label htmlFor="status-documentation" className="ml-2 text-sm">Aguardando Doc.</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-completed" 
                  className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  onChange={(e) => handleFilterChange("status", e.target.checked ? "completed" : undefined)}
                />
                <label htmlFor="status-completed" className="ml-2 text-sm">Concluídos</label>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium">Tipo de Processo</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="type-all" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                    defaultChecked
                    onChange={() => {
                      const { type, ...rest } = filters;
                      setFilters(rest);
                    }}
                  />
                  <label htmlFor="type-all" className="ml-2 text-sm">Todos</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="type-fine-appeal" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                    onChange={(e) => handleFilterChange("type", e.target.checked ? "fine_appeal" : undefined)}
                  />
                  <label htmlFor="type-fine-appeal" className="ml-2 text-sm">Recurso de Multa</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="type-license-suspension" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                    onChange={(e) => handleFilterChange("type", e.target.checked ? "license_suspension" : undefined)}
                  />
                  <label htmlFor="type-license-suspension" className="ml-2 text-sm">Suspensão de CNH</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="type-license-revocation" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                    onChange={(e) => handleFilterChange("type", e.target.checked ? "license_revocation" : undefined)}
                  />
                  <label htmlFor="type-license-revocation" className="ml-2 text-sm">Cassação de CNH</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="type-other" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                    onChange={(e) => handleFilterChange("type", e.target.checked ? "other" : undefined)}
                  />
                  <label htmlFor="type-other" className="ml-2 text-sm">Outros</label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium">Período</p>
              <div className="space-y-2 mt-2">
                <div className="space-y-1">
                  <label htmlFor="date-from" className="text-xs">De</label>
                  <input 
                    type="date" 
                    id="date-from" 
                    className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    onChange={(e) => handleFilterChange("date_from", e.target.value || undefined)}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="date-to" className="text-xs">Até</label>
                  <input 
                    type="date" 
                    id="date-to" 
                    className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    onChange={(e) => handleFilterChange("date_to", e.target.value || undefined)}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium">Atribuído a</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="assigned-all" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                    defaultChecked
                    onChange={() => {
                      const { assigned_to, ...rest } = filters;
                      setFilters(rest);
                    }}
                  />
                  <label htmlFor="assigned-all" className="ml-2 text-sm">Todos</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="assigned-me" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                    onChange={(e) => handleFilterChange("assigned_to", e.target.checked ? "current_user" : undefined)}
                  />
                  <label htmlFor="assigned-me" className="ml-2 text-sm">Meus Processos</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="assigned-unassigned" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                    onChange={(e) => handleFilterChange("assigned_to", e.target.checked ? null : undefined)}
                  />
                  <label htmlFor="assigned-unassigned" className="ml-2 text-sm">Não Atribuídos</label>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-4" onClick={() => setFilters({...filters})}>
              <Filter className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex-1">
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Processos</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Buscar processo..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-8 h-9 w-full md:w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <SortAsc className="h-4 w-4 mr-2" />
                    Ordenar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
                  <span className="ml-2">Carregando processos...</span>
                </div>
              ) : processes.length > 0 ? (
                <div className="space-y-4">
                  {processes.map((process) => (
                    <div key={process.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-cabricop-blue" />
                            <h3 className="font-medium">Processo #{process.id.substring(0, 8)}</h3>
                            {renderStatusBadge(process.status)}
                          </div>
                          <p className="text-sm mt-1">Cliente: {process.client?.name || "N/A"}</p>
                          <p className="text-sm text-muted-foreground">
                            {process.infraction ? 
                              `${process.type === 'fine_appeal' ? 'Recurso de multa' : 
                                process.type === 'license_suspension' ? 'Suspensão de CNH' : 
                                process.type === 'license_revocation' ? 'Cassação de CNH' : 'Outro'} - 
                                Auto nº ${process.infraction.auto_number || 'N/A'}` : 
                              process.description || "Sem descrição"
                            }
                          </p>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                          <div className="text-sm text-right">
                            <p>Criado em: <span className="font-medium">{new Date(process.created_at).toLocaleDateString('pt-BR')}</span></p>
                            <p className="text-xs text-muted-foreground">
                              Atribuído a: {process.assignee?.name || "Não atribuído"}
                            </p>
                          </div>
                          <Button size="sm" asChild>
                            <Link to={`/processos/${process.id}`}>Ver Detalhes</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded">
                  <p className="text-muted-foreground">Nenhum processo encontrado com os filtros atuais</p>
                  <Button className="mt-4" onClick={() => setFilters({})}>Limpar Filtros</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Exibindo {processes.length} processo(s)
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-muted">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  Próximo
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card className="w-full mt-4">
            <CardHeader>
              <CardTitle>Prazos Críticos</CardTitle>
              <CardDescription>
                Processos que necessitam de atenção imediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              {criticalDeadlines.length > 0 ? (
                <div className="space-y-2">
                  {criticalDeadlines.map((deadline) => {
                    const dueDate = new Date(deadline.due_date);
                    const today = new Date();
                    const diffTime = dueDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const isUrgent = diffDays <= 2;
                    
                    return (
                      <div 
                        key={deadline.id} 
                        className={`flex items-center justify-between p-2 border rounded-lg ${
                          isUrgent ? 'bg-red-50' : 'bg-orange-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className={`h-4 w-4 ${isUrgent ? 'text-red-600' : 'text-orange-600'}`} />
                          <div>
                            <p className="font-medium">{deadline.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {deadline.process?.description || "Processo sem descrição"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                            Vence em {diffDays} dia{diffDays !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {dueDate.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">Nenhum prazo crítico para os próximos 7 dias</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProcessManagement;
