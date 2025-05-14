
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UfOption } from '@/models/SearchHistory';

export interface FiltersState {
  searchType: string;
  uf: string;
  startDate: string;
  endDate: string;
}

interface SearchFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  UF_OPTIONS: { value: UfOption; label: string }[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  setFilters,
  onApplyFilters,
  onClearFilters,
  UF_OPTIONS,
}) => {
  return (
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
        <Button variant="outline" onClick={onClearFilters}>Limpar</Button>
        <Button onClick={onApplyFilters}>Aplicar Filtros</Button>
      </div>
    </div>
  );
};

export default SearchFilters;
