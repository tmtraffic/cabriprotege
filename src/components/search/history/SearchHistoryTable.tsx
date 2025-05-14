
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SearchHistory } from '@/models/SearchHistory';

interface SearchHistoryTableProps {
  searchHistory: SearchHistory[];
  loading: boolean;
  onViewDetails: (entry: SearchHistory) => void;
  formatDate: (dateString: string) => string;
}

const SearchHistoryTable: React.FC<SearchHistoryTableProps> = ({
  searchHistory,
  loading,
  onViewDetails,
  formatDate,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cabricop-blue"></div>
      </div>
    );
  }

  return (
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
                <Button variant="ghost" size="icon" onClick={() => onViewDetails(entry)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SearchHistoryTable;
