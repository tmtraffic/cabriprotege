
export interface SearchHistory {
  id: string;
  search_type: 'cnh' | 'vehicle';
  search_query: string;
  user_id: string;
  result_data: Json;
  created_at: string;
  updated_at: string;
  related_client_id?: string;
  related_vehicle_id?: string;
  uf?: string;
}

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

export interface SearchResultVehicle {
  plate: string;
  renavam: string;
  model: string;
  year: string;
  owner: string;
  fines: SearchResultFine[];
  uf?: string;
}

export interface SearchResultFine {
  id: string;
  autoNumber: string;
  date: string;
  agency: string;
  plate: string;
  owner: string;
  respPoints: string;
  situation: string;
  infraction: string;
  location: string;
  frame: string;
  points: number;
  dueDate: string;
  value: number;
  discountValue: number;
  process: string;
}

// Parâmetros adicionais específicos por UF e tipo de consulta
export interface AdditionalSearchParams {
  cpf?: string;
  dataNascimento?: string;
  dataPrimeiraHabilitacao?: string;
  renavam?: string;
  chassi?: string;
}

export type UfOption = 'SP' | 'RJ' | 'MG' | 'PR' | 'RS' | 'SC' | 'BA' | 'ES' | 'GO' | 'PE' | 'DF';

// Define a safe type for search result data that can be serialized to JSON
export type Json = 
  | string 
  | number 
  | boolean 
  | null 
  | { [key: string]: Json } 
  | Json[];

// Search result data compatible with Supabase's Json type
export interface SearchResultDataJson {
  success: boolean;
  error?: string;
  data?: Record<string, any>;
  [key: string]: any;
}
