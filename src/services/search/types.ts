
// Type definitions relevant to the search functionality
import { SearchResultFine, UfOption, AdditionalSearchParams } from '@/models/SearchHistory';

// Internal type for managing the search results
export interface SearchResultData {
  success: boolean;
  data?: any;
  error?: string;
}

// CNH search result
export interface CNHSearchResult {
  name: string;
  cnh: string;
  category: string;
  status: string;
  expirationDate: string;
  points: number;
  fines: SearchResultFine[];
  uf?: string;
}

// Vehicle search result
export interface VehicleSearchResult {
  plate: string;
  renavam: string;
  model: string;
  year: string;
  owner: string;
  fines: SearchResultFine[];
  uf?: string;
}
