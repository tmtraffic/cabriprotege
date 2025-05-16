
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, AlertTriangle, Search } from "lucide-react";

interface SearchHistoryItem {
  id: string;
  search_type: string;
  search_query: string;
  api_source: string;
  created_at: string;
  raw_result_data?: any;
  related_client?: {
    name: string;
    cpf_cnpj: string;
  };
  related_vehicle?: {
    plate: string;
    brand: string;
    model: string;
  };
}

interface SearchHistoryDisplayProps {
  clientId?: string;
  vehicleId?: string;
  className?: string;
}

const SearchHistoryDisplay = ({ clientId, vehicleId, className }: SearchHistoryDisplayProps) => {
  const { toast } = useToast();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filterType, setFilterType] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<SearchHistoryItem | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [page, filterType, clientId, vehicleId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('get-user-search-history', {
        body: { 
          page, 
          limit,
          related_client_id: clientId,
          related_vehicle_id: vehicleId,
          search_type: filterType || undefined
        }
      });
      
      if (error) throw new Error(error.message);
      
      setHistory(response.data || []);
      setTotal(response.pagination.total || 0);
    } catch (error: any) {
      console.error("Error fetching search history:", error);
      toast({
        title: "Erro ao carregar histórico",
        description: error.message || "Não foi possível carregar o histórico de consultas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getSearchTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'cnh': 'CNH',
      'cpf': 'CPF',
      'cnpj': 'CNPJ',
      'vehicle_plate': 'Placa',
      'renavam': 'RENAVAM',
      'fine': 'Multa',
      'auto_number': 'Auto de Infração'
    };
    return types[type] || type;
  };

  const getApiSourceLabel = (source?: string) => {
    if (!source) return "Desconhecida";
    
    const sources: Record<string, string> = {
      'helena': 'Helena API',
      'infosimples': 'InfoSimples API'
    };
    return sources[source.toLowerCase()] || source;
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 md:items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Histórico de Consultas</h3>
        
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              <SelectItem value="cpf">CPF</SelectItem>
              <SelectItem value="cnpj">CNPJ</SelectItem>
              <SelectItem value="cnh">CNH</SelectItem>
              <SelectItem value="vehicle_plate">Placa</SelectItem>
              <SelectItem value="renavam">RENAVAM</SelectItem>
              <SelectItem value="fine">Multa</SelectItem>
              <SelectItem value="auto_number">Auto de Infração</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {
              setPage(1);
              fetchHistory();
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center border rounded-md p-8">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium mb-2">Nenhuma consulta encontrada</h4>
          <p className="text-sm text-muted-foreground text-center">
            {clientId || vehicleId || filterType
              ? "Nenhuma consulta encontrada com os filtros selecionados."
              : "Você ainda não realizou nenhuma consulta no sistema."}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableCaption>
                Mostrando {history.length} de {total} consultas
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Consulta</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Vinculado a</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell>{getSearchTypeLabel(item.search_type)}</TableCell>
                    <TableCell className="font-medium">{item.search_query}</TableCell>
                    <TableCell>{getApiSourceLabel(item.api_source)}</TableCell>
                    <TableCell>
                      {item.related_client ? (
                        <span title={`${item.related_client.name} (${item.related_client.cpf_cnpj})`}>
                          Cliente
                        </span>
                      ) : item.related_vehicle ? (
                        <span title={`${item.related_vehicle.plate} - ${item.related_vehicle.brand} ${item.related_vehicle.model}`}>
                          Veículo
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>Detalhes da Consulta</DialogTitle>
                            <DialogDescription>
                              Consulta de {getSearchTypeLabel(selectedItem?.search_type || '')} realizada em {selectedItem ? formatDate(selectedItem.created_at) : ''}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="overflow-auto h-full">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Tipo</p>
                                <p className="text-sm">{selectedItem ? getSearchTypeLabel(selectedItem.search_type) : ''}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Termo Pesquisado</p>
                                <p className="text-sm">{selectedItem?.search_query}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Data da Consulta</p>
                                <p className="text-sm">{selectedItem ? formatDate(selectedItem.created_at) : ''}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">API Utilizada</p>
                                <p className="text-sm">{selectedItem ? getApiSourceLabel(selectedItem.api_source) : ''}</p>
                              </div>
                            </div>
                            {selectedItem?.related_client && (
                              <div className="mb-4 p-3 border rounded-md">
                                <p className="text-sm font-medium">Cliente Vinculado</p>
                                <p className="text-sm">{selectedItem.related_client.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedItem.related_client.cpf_cnpj}</p>
                              </div>
                            )}
                            {selectedItem?.related_vehicle && (
                              <div className="mb-4 p-3 border rounded-md">
                                <p className="text-sm font-medium">Veículo Vinculado</p>
                                <p className="text-sm">{selectedItem.related_vehicle.plate}</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedItem.related_vehicle.brand} {selectedItem.related_vehicle.model}
                                </p>
                              </div>
                            )}
                            <div className="mt-4">
                              <p className="font-medium mb-2">Resposta da API</p>
                              <pre className="bg-slate-50 p-4 rounded-md overflow-auto max-h-96 text-xs">
                                {selectedItem?.raw_result_data 
                                  ? JSON.stringify(selectedItem.raw_result_data, null, 2)
                                  : "Sem dados disponíveis"
                                }
                              </pre>
                            </div>
                          </div>
                          <div className="mt-4 text-right">
                            <DialogClose asChild>
                              <Button variant="outline">Fechar</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </div>
              <div className="flex gap-2">
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
        </>
      )}
    </div>
  );
};

export default SearchHistoryDisplay;
