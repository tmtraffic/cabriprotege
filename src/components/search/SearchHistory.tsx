
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import InfoSimplesService from '@/services/InfoSimplesService';
import { SearchHistory } from '@/models/SearchHistory';
import SearchHistoryTable from './history/SearchHistoryTable';
import EmptySearchHistory from './history/EmptySearchHistory';
import SearchFilters from './history/SearchFilters';
import SearchDetailsDialog from './history/SearchDetailsDialog';
import { UF_OPTIONS, INITIAL_FILTERS } from './history/constants';

const SearchHistoryComponent = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<SearchHistory | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
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
    setFilters(INITIAL_FILTERS);
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
          <SearchFilters 
            filters={filters} 
            setFilters={setFilters} 
            onApplyFilters={applyFilters} 
            onClearFilters={clearFilters}
            UF_OPTIONS={UF_OPTIONS}
          />
        )}
        
        {searchHistory.length > 0 ? (
          <SearchHistoryTable
            searchHistory={searchHistory}
            loading={loading}
            onViewDetails={handleViewDetails}
            formatDate={formatDate}
          />
        ) : (
          !loading && <EmptySearchHistory />
        )}
        
        <SearchDetailsDialog
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          selectedEntry={selectedEntry}
          formatDate={formatDate}
        />
      </CardContent>
    </Card>
  );
};

export default SearchHistoryComponent;
