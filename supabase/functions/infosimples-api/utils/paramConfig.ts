
import { INFOSIMPLES_API_TOKEN, INFOSIMPLES_USER_ID } from "./constants.ts";

// Validação de parâmetros
export function validateRequestParams(searchType: string, searchQuery: string) {
  if (!searchType || !searchQuery) {
    throw new Error("Parâmetros de busca incompletos");
  }
  
  if (!INFOSIMPLES_API_TOKEN || !INFOSIMPLES_USER_ID) {
    throw new Error("Credenciais da API InfoSimples não configuradas");
  }
}

// Configurar parâmetros para consulta de CNH
export function configureCNHParams(searchQuery: string, uf: string, additionalParams: Record<string, any>) {
  let params: Record<string, any> = {};
  
  switch (uf) {
    case "SP":
      params = {
        numero_registro: searchQuery,
        data_nascimento: additionalParams.dataNascimento || "",
      };
      break;
    case "PR":
      params = {
        cpf: additionalParams.cpf || "",
        numero_registro: searchQuery,
      };
      break;
    case "MG":
      params = {
        cpf: additionalParams.cpf || "",
        data_nascimento: additionalParams.dataNascimento || "",
        data_primeira_habilitacao: additionalParams.dataPrimeiraHabilitacao || "",
      };
      break;
    default:
      // Para outros estados, usamos os parâmetros padrão
      params = {
        numero_registro: searchQuery,
        ...additionalParams
      };
  }
  
  return params;
}

// Configurar parâmetros para consulta de veículo
export function configureVehicleParams(searchQuery: string, uf: string, additionalParams: Record<string, any>) {
  let params: Record<string, any> = {};
  
  switch (uf) {
    case "SP":
      params = {
        placa: searchQuery,
        renavam: additionalParams.renavam || "",
      };
      break;
    case "RJ":
      params = {
        placa: searchQuery,
        renavam: additionalParams.renavam || "",
        chassi: additionalParams.chassi || "",
      };
      break;
    default:
      // Para outros estados, usamos os parâmetros padrão
      params = {
        placa: searchQuery,
        renavam: additionalParams.renavam || "",
        ...additionalParams
      };
  }
  
  return params;
}

// Configurar parâmetros para chamada à API
export function configureRequestParams(
  searchType: string,
  searchQuery: string,
  uf: string,
  additionalParams: Record<string, any> = {}
) {
  // Determinar o endpoint com base no tipo de busca e UF (padrão SP se não informado)
  const stateUf = uf || "SP";
  let endpoint = "";
  let params: Record<string, any> = {};
  
  if (searchType === 'cnh') {
    endpoint = `/detran/${stateUf}/cnh`;
    params = configureCNHParams(searchQuery, stateUf, additionalParams);
  } else if (searchType === 'vehicle') {
    endpoint = `/detran/${stateUf}/veiculo`;
    params = configureVehicleParams(searchQuery, stateUf, additionalParams);
  } else {
    throw new Error("Tipo de busca inválido");
  }
  
  // Adicionar parâmetros de autenticação
  params.api_key = INFOSIMPLES_API_TOKEN;
  params.user_id = INFOSIMPLES_USER_ID;
  
  return { endpoint, params };
}
