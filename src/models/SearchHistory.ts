
// Base JSON type
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Type definition for search history entry
export interface SearchHistory {
  id: string;
  search_type: 'cnh' | 'vehicle';
  search_query: string;
  user_id: string;
  result_data: SearchResultDataJson;
  uf?: string;
  related_client_id?: string;
  related_vehicle_id?: string;
  created_at: string;
  updated_at: string;
}

// JSON safe result data type
export interface SearchResultDataJson {
  success: boolean;
  data?: Record<string, Json>;
  error?: string;
}

// Type for the search result fine
export interface SearchResultFine {
  id?: string;
  auto?: string;
  description?: string;
  value?: number;
  points?: number;
  date?: string;
  status?: string;
  // Additional properties required by the application
  autoNumber?: string;
  agency?: string;
  plate?: string;
  owner?: string;
  respPoints?: string;
  situation?: string;
  infraction?: string;
  location?: string;
  frame?: string;
  dueDate?: string;
  discountValue?: number;
  process?: string;
}

// CNH search result
export interface SearchResultCNH {
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
export interface SearchResultVehicle {
  plate: string;
  renavam: string;
  model: string;
  year: string;
  owner: string;
  fines: SearchResultFine[];
  uf?: string;
}

// UF options
export type UfOption = 'SP' | 'RJ' | 'MG' | 'PR' | 'SC' | 'RS' | 'ES' | 'MS' | 'MT' | 'GO' | 'DF' | 'BA' | 'SE' | 'AL' | 'PE' | 'PB' | 'RN' | 'CE' | 'PI' | 'MA' | 'TO' | 'PA' | 'AP' | 'RR' | 'AM' | 'AC' | 'RO';

// Additional search parameters
export interface AdditionalSearchParams {
  renavam?: string;
  chassi?: string;
  cpf?: string;
  dataNascimento?: string;
  dataPrimeiraHabilitacao?: string;
  [key: string]: string | undefined;
}
