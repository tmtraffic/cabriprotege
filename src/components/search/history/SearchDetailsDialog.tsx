
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { SearchHistory } from '@/models/SearchHistory';
import { Separator } from '@/components/ui/separator';

interface SearchDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEntry: SearchHistory | null;
  formatDate: (dateString: string) => string;
}

const SearchDetailsDialog = ({
  open,
  onOpenChange,
  selectedEntry,
  formatDate,
}: SearchDetailsDialogProps) => {
  if (!selectedEntry) return null;
  
  // Extract result data
  const resultData = selectedEntry.result_data;
  
  const renderResultData = () => {
    if (!resultData) {
      return <p className="text-gray-500">Dados não disponíveis</p>;
    }

    // Check if result_data is an object with success property
    const isResultObject = typeof resultData === 'object' && resultData !== null;
    
    // Process success result
    if (isResultObject && 'success' in resultData && resultData.success === true) {
      if (selectedEntry.search_type === 'cnh') {
        // Cast resultData to appropriate type after checking it's an object
        const typedResultData = resultData as { success: boolean, data?: any };
        
        return (
          <div className="space-y-2">
            <h3 className="font-semibold">Resultado da Consulta CNH</h3>
            
            {typedResultData.data && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="text-sm">{typedResultData.data.name || 'Não disponível'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">CNH</p>
                  <p className="text-sm">{typedResultData.data.cnh || 'Não disponível'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Categoria</p>
                  <p className="text-sm">{typedResultData.data.category || 'Não disponível'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-sm">{typedResultData.data.status || 'Não disponível'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Validade</p>
                  <p className="text-sm">{typedResultData.data.expirationDate || 'Não disponível'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Pontos</p>
                  <p className="text-sm">{typedResultData.data.points || '0'}</p>
                </div>
              </div>
            )}
          </div>
        );
      }
      
      if (selectedEntry.search_type === 'vehicle') {
        // Cast resultData to appropriate type after checking it's an object
        const typedResultData = resultData as { success: boolean, data?: any };
        
        return (
          <div className="space-y-2">
            <h3 className="font-semibold">Resultado da Consulta Veículo</h3>
            
            {typedResultData.data && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Placa</p>
                  <p className="text-sm">{typedResultData.data.plate || 'Não disponível'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Renavam</p>
                  <p className="text-sm">{typedResultData.data.renavam || 'Não disponível'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Modelo</p>
                  <p className="text-sm">{typedResultData.data.model || 'Não disponível'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Ano</p>
                  <p className="text-sm">{typedResultData.data.year || 'Não disponível'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Proprietário</p>
                  <p className="text-sm">{typedResultData.data.owner || 'Não disponível'}</p>
                </div>
              </div>
            )}
          </div>
        );
      }
    }
      
    // Process error result
    if (isResultObject && 'error' in resultData && typeof resultData.error === 'string') {
      return (
        <div className="space-y-2">
          <Badge variant="destructive">Erro</Badge>
          <p className="text-red-500">{resultData.error}</p>
        </div>
      );
    }
      
    // Fallback for simple data or unknown format
    if (isResultObject && 'data' in resultData && resultData.data) {
      return <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(resultData.data, null, 2)}</pre>;
    }
      
    // Final fallback for any other format
    return (
      <div className="space-y-2">
        <p className="text-sm">Formato de dados não reconhecido.</p>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(resultData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes da Consulta</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Informações Gerais</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="text-sm">{selectedEntry.search_type === 'cnh' ? 'CNH' : 'Veículo'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Data/Hora</p>
                  <p className="text-sm">{formatDate(selectedEntry.created_at)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Consulta</p>
                  <p className="text-sm">{selectedEntry.search_query}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">UF</p>
                  <p className="text-sm">{selectedEntry.uf || 'SP'}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              {renderResultData()}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDetailsDialog;
