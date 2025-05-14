import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Download, Filter, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import InfoSimplesService from '@/services/InfoSimplesService';
import { SearchHistory, UfOption } from '@/models/SearchHistory';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const UF_OPTIONS: { value: UfOption; label: string }[] = [
  { value: 'SP', label: 'São Paulo' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PR', label: 'Paraná' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'BA', label: 'Bahia' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'DF', label: 'Distrito Federal' },
];

const SearchHistoryComponent = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<SearchHistory | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [filters, setFilters] = useState({
    searchType: '',
    uf: '',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    setLoading(true);
    try {
      const filterParams: any = {};
      
      if (filters.searchType) {
        filterParams.searchType = filters.searchType;
      }
      
      if (filters.uf) {
        filterParams.uf = filters.uf;
      }
      
      const history = await InfoSimplesService.getSearchHistory(filterParams);
      
      // Filtrar por data se necessário
      let filteredHistory = [...history];
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        filteredHistory = filteredHistory.filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate >= startDate;
        });
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        // Ajustar para o final do dia
        endDate.setHours(23, 59, 59, 999);
        filteredHistory = filteredHistory.filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate <= endDate;
        });
      }
      
      setSearchHistory(filteredHistory);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar o histórico de buscas.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const csv = await InfoSimplesService.exportSearchHistory({
        searchType: filters.searchType as any,
        uf: filters.uf as any
      });
      
      // Criar blob e download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `historico_consultas_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Exportação concluída',
        description: 'O histórico de consultas foi exportado com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível exportar o histórico de buscas.'
      });
    }
  };

  const handleViewDetails = (entry: SearchHistory) => {
    setSelectedEntry(entry);
    setShowDetailDialog(true);
  };

  const applyFilters = () => {
    fetchSearchHistory();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      searchType: '',
      uf: '',
      startDate: '',
      endDate: ''
    });
    // Fetch sem filtros
    fetchSearchHistory();
    setShowFilters(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Histórico de Consultas</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {showFilters && (
          <div className="bg-muted p-4 rounded mb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="filter-type">Tipo de Consulta</Label>
                <Select
                  value={filters.searchType}
                  onValueChange={(value) => setFilters({...filters, searchType: value})}
                >
                  <SelectTrigger id="filter-type">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="cnh">CNH</SelectItem>
                    <SelectItem value="vehicle">Veículo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="filter-uf">UF</Label>
                <Select
                  value={filters.uf}
                  onValueChange={(value) => setFilters({...filters, uf: value})}
                >
                  <SelectTrigger id="filter-uf">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {UF_OPTIONS.map((uf) => (
                      <SelectItem key={uf.value} value={uf.value}>
                        {uf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="filter-start-date">Data de Início</Label>
                <Input
                  id="filter-start-date"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="filter-end-date">Data de Fim</Label>
                <Input
                  id="filter-end-date"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={clearFilters}>Limpar</Button>
              <Button onClick={applyFilters}>Aplicar Filtros</Button>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cabricop-blue"></div>
          </div>
        ) : searchHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>UF</TableHead>
                  <TableHead>Consulta</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.created_at)}</TableCell>
                    <TableCell>
                      <Badge variant={entry.search_type === 'cnh' ? 'default' : 'secondary'}>
                        {entry.search_type === 'cnh' ? 'CNH' : 'Veículo'}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.uf || 'SP'}</TableCell>
                    <TableCell>{entry.search_query}</TableCell>
                    <TableCell>
                      {entry.result_data && entry.result_data.success ? (
                        <Badge variant="default">Sucesso</Badge>
                      ) : (
                        <Badge variant="destructive">Falha</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(entry)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhuma consulta encontrada</p>
            <p className="text-sm text-muted-foreground">
              Realize uma consulta para visualizar o histórico.
            </p>
          </div>
        )}
        
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Consulta</DialogTitle>
            </DialogHeader>
            
            {selectedEntry && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data da Consulta</p>
                    <p className="font-semibold">{formatDate(selectedEntry.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                    <Badge variant={selectedEntry.search_type === 'cnh' ? 'default' : 'secondary'}>
                      {selectedEntry.search_type === 'cnh' ? 'CNH' : 'Veículo'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">UF</p>
                    <p className="font-semibold">{selectedEntry.uf || 'SP'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Termo Pesquisado</p>
                    <p className="font-semibold">{selectedEntry.search_query}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Dados da Consulta</p>
                  {selectedEntry.result_data && selectedEntry.result_data.success ? (
                    selectedEntry.search_type === 'cnh' ? (
                      // Exibir dados de CNH
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Nome</p>
                          <p className="font-semibold">{selectedEntry.result_data.data.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Categoria</p>
                          <p className="font-semibold">{selectedEntry.result_data.data.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge variant={selectedEntry.result_data.data.status === 'Regular' ? 'default' : 'destructive'}>
                            {selectedEntry.result_data.data.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Pontos</p>
                          <p className="font-semibold">{selectedEntry.result_data.data.points}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Validade</p>
                          <p className="font-semibold">{selectedEntry.result_data.data.expirationDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Multas</p>
                          <p className="font-semibold">{selectedEntry.result_data.data.fines?.length || 0}</p>
                        </div>
                      </div>
                    ) : (
                      // Exibir dados de veículo
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Placa</p>
                          <p className="font-semibold">{selectedEntry.result_data.data.plate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Renavam</p>
                          <p className="font-semibold">{selectedEntry.result_data.data.renavam}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Modelo</p>
                          <p className="font-semibold">{selectedEntry.result_data.data.model}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ano</p>
                          <p className="font-semibold">{selectedEntry.result_data.data.year}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Proprietário</p>
                          <p className="font-semibold">{selectedEntry.result_data.data.owner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Multas</p>
                          <p className="font-semibold">{selectedEntry.result_data.data.fines?.length || 0}</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="bg-red-50 p-4 rounded">
                      <p className="text-red-600">
                        {selectedEntry.result_data?.error || "Erro ao processar consulta"}
                      </p>
                    </div>
                  )}
                </div>
                
                {selectedEntry.result_data?.data?.fines && selectedEntry.result_data.data.fines.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Multas ({selectedEntry.result_data.data.fines.length})</p>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Auto</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Infração</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedEntry.result_data.data.fines.map((fine: any) => (
                            <TableRow key={fine.id}>
                              <TableCell>{fine.autoNumber}</TableCell>
                              <TableCell>{fine.date}</TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {fine.infraction}
                              </TableCell>
                              <TableCell className="text-right">
                                R$ {fine.value.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between pt-4 border-t">
                  {selectedEntry.related_client_id || selectedEntry.related_vehicle_id ? (
                    <div className="flex space-x-2">
                      {selectedEntry.related_client_id && (
                        <Badge variant="outline">Cliente Associado</Badge>
                      )}
                      {selectedEntry.related_vehicle_id && (
                        <Badge variant="outline">Veículo Associado</Badge>
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SearchHistoryComponent;
