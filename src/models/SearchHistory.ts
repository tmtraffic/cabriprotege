
export interface SearchHistory {
  id: string;
  search_type: 'cnh' | 'vehicle';
  search_query: string;
  user_id: string;
  result_data: any;
  created_at: string;
  updated_at: string;
  related_client_id?: string;
  related_vehicle_id?: string;
  uf?: string; // Adicionado UF para controle de estados nas consultas
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

// Define a type for search result data that can be safely serialized to JSON
// Making it compatible with Supabase's Json type by using Record<string, any>
export interface SearchResultDataJson {
  success: boolean;
  data?: Record<string, any>; // Using Record<string, any> to make it compatible with Json type
  error?: string;
  [key: string]: any; // Add index signature to make it compatible with Json type
}
