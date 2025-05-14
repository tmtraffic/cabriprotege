
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { SearchHistory } from '@/models/SearchHistory';
import { Badge } from '@/components/ui/badge';

interface SearchHistoryTableProps {
  searchHistory: SearchHistory[];
  loading: boolean;
  onViewDetails: (entry: SearchHistory) => void;
  formatDate: (dateString: string) => string;
}

const SearchHistoryTable = ({
  searchHistory,
  loading,
  onViewDetails,
  formatDate
}: SearchHistoryTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Consulta</TableHead>
            <TableHead>UF</TableHead>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Resultado</TableHead>
            <TableHead className="w-[80px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Carregando histórico...
              </TableCell>
            </TableRow>
          ) : (
            searchHistory.map((entry) => {
              // Check if result_data is valid and has success property
              const resultData = entry.result_data;
              const success = typeof resultData === 'object' && resultData !== null && 'success' in resultData
                ? resultData.success
                : undefined;
                
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    {entry.search_type === 'cnh' ? 'CNH' : 'Veículo'}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{entry.search_query}</span>
                  </TableCell>
                  <TableCell>{entry.uf || 'SP'}</TableCell>
                  <TableCell>{formatDate(entry.created_at)}</TableCell>
                  <TableCell>
                    {success === undefined ? (
                      <Badge variant="outline">Desconhecido</Badge>
                    ) : success ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">Sucesso</Badge>
                    ) : (
                      <Badge variant="destructive">Erro</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(entry)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SearchHistoryTable;
