
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SearchHistory } from '@/models/SearchHistory';

interface SearchDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEntry: SearchHistory | null;
  formatDate: (dateString: string) => string;
}

const SearchDetailsDialog: React.FC<SearchDetailsDialogProps> = ({
  open,
  onOpenChange,
  selectedEntry,
  formatDate,
}) => {
  if (!selectedEntry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Consulta</DialogTitle>
        </DialogHeader>
        
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
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Multas ({selectedEntry.result_data.data.fines.length})
              </p>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDetailsDialog;
