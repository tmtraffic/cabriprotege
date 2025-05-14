
import React from 'react';
import { Search } from 'lucide-react';

const EmptySearchHistory: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium">Nenhuma consulta encontrada</p>
      <p className="text-sm text-muted-foreground">
        Realize uma consulta para visualizar o histórico.
      </p>
    </div>
  );
};

export default EmptySearchHistory;
