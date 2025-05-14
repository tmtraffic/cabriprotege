
// Tipos para parâmetros de consulta
export interface SearchParams {
  searchType: 'cnh' | 'vehicle';
  searchQuery: string;
  uf?: string;
  additionalParams?: Record<string, any>;
}

// Tipos para resposta da API InfoSimples
export interface InfoSimplesResponse {
  code: number;
  code_message: string;
  data?: Record<string, any>;
}

// Tipos para resposta normalizada
export interface NormalizedResponse {
  success: boolean;
  data?: Record<string, any>;
  error?: string;
}

// Tipos para parâmetros de consulta específicos
export interface CNHSearchParams {
  numero_registro: string;
  data_nascimento?: string;
  cpf?: string;
  data_primeira_habilitacao?: string;
}

export interface VehicleSearchParams {
  placa: string;
  renavam?: string;
  chassi?: string;
}
