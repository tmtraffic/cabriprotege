
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, FileText, Clock, Eye } from "lucide-react";
import { SearchHistory } from "@/models/SearchHistory";
import InfoSimplesService from "@/services/InfoSimplesService";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SearchHistoryComponent = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSearch, setSelectedSearch] = useState<SearchHistory | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      setLoading(true);
      const history = await InfoSimplesService.getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de consultas."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (search: SearchHistory) => {
    setSelectedSearch(search);
    setOpenDetailDialog(true);
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

  const getSearchTypeLabel = (type: string) => {
    switch(type) {
      case 'cnh':
        return 'CNH';
      case 'vehicle':
        return 'Veículo';
      default:
        return type;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Histórico de Consultas</CardTitle>
        <CardDescription>
          Histórico completo de todas as consultas realizadas no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
            <span className="ml-2">Carregando histórico...</span>
          </div>
        ) : searchHistory.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Nenhuma consulta encontrada</h3>
            <p className="text-muted-foreground">
              Não há histórico de consultas realizadas no sistema.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Consulta</TableHead>
                  <TableHead>Associado</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchHistory.map((search) => (
                  <TableRow key={search.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatDate(search.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={search.search_type === 'cnh' ? 'default' : 'secondary'}>
                        {getSearchTypeLabel(search.search_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {search.search_query}
                    </TableCell>
                    <TableCell>
                      {search.related_client_id && search.related_vehicle_id ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Cliente e Veículo
                        </Badge>
                      ) : search.related_client_id ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Cliente
                        </Badge>
                      ) : search.related_vehicle_id ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Veículo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                          Não associado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(search)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Consulta</DialogTitle>
              <DialogDescription>
                Informações completas sobre a consulta realizada
              </DialogDescription>
            </DialogHeader>
            
            {selectedSearch && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo de Consulta</p>
                    <p className="font-semibold">{getSearchTypeLabel(selectedSearch.search_type)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Termo Consultado</p>
                    <p className="font-semibold">{selectedSearch.search_query}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data da Consulta</p>
                    <p className="font-semibold">{formatDate(selectedSearch.created_at)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Dados Retornados</p>
                  <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                    <pre className="text-xs">{JSON.stringify(selectedSearch.result_data, null, 2)}</pre>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setOpenDetailDialog(false)}>
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
