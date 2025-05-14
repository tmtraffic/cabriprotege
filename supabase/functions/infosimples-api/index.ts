
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

// API da InfoSimples
const INFOSIMPLES_API_TOKEN = Deno.env.get("INFOSIMPLES_API_TOKEN");
const INFOSIMPLES_USER_ID = Deno.env.get("INFOSIMPLES_USER_ID");

// Constantes
const API_BASE_URL = "https://api.infosimples.com/api/v2";
const MAX_RETRIES = 3;
const TIMEOUT_MS = 600000; // 600 segundos (10 minutos)

// Headers CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Tratamento de requisições OPTIONS para CORS
function handleOptionsRequest() {
  return new Response(null, { headers: corsHeaders });
}

// Função para realizar chamadas à API com retry
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = MAX_RETRIES) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Verificar rate limit
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("retry-after") || "0", 10);
        const delayMs = retryAfter > 0 ? retryAfter * 1000 : Math.min(1000 * 2 ** attempt, 30000);
        
        console.log(`Rate limit atingido. Aguardando ${delayMs}ms antes de tentar novamente.`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }
      
      return response;
    } catch (error) {
      console.error(`Tentativa ${attempt + 1} falhou:`, error);
      lastError = error;
      
      // Aguardar antes de tentar novamente (com backoff exponencial)
      if (attempt < maxRetries) {
        const delayMs = Math.min(1000 * 2 ** attempt, 30000);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError || new Error("Erro desconhecido ao fazer requisição à API");
}

// Manipulador de erros da API InfoSimples
function handleInfosimplesError(code: number, message: string) {
  switch (code) {
    case 200:
    case 201:
      return null; // Sem erro
    case 601:
      return new Error('Autenticação falhou. Verifique seu token de API.');
    case 605:
      return new Error('Tempo limite excedido. A consulta demorou muito para ser processada.');
    case 612:
      return new Error('Registro não encontrado com os parâmetros fornecidos.');
    case 618:
      return new Error('Limite de requisições excedido. Tente novamente mais tarde.');
    default:
      return new Error(`Erro ${code}: ${message}`);
  }
}

// Validação de parâmetros
function validateRequestParams(searchType: string, searchQuery: string) {
  if (!searchType || !searchQuery) {
    throw new Error("Parâmetros de busca incompletos");
  }
  
  if (!INFOSIMPLES_API_TOKEN || !INFOSIMPLES_USER_ID) {
    throw new Error("Credenciais da API InfoSimples não configuradas");
  }
}

// Configurar parâmetros para consulta de CNH
function configureCNHParams(searchQuery: string, uf: string, additionalParams: Record<string, any>) {
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
function configureVehicleParams(searchQuery: string, uf: string, additionalParams: Record<string, any>) {
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
function configureRequestParams(
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

// Normaliza os dados da resposta da API
function normalizeResponseData(searchType: string, searchQuery: string, responseData: any) {
  if (searchType === 'cnh') {
    return {
      success: true,
      data: {
        name: responseData.data?.nome || responseData.data?.name || "Nome não disponível",
        cnh: searchQuery,
        category: responseData.data?.categoria || responseData.data?.category || "Não informada",
        status: responseData.data?.situacao || responseData.data?.status || "Regular",
        expirationDate: responseData.data?.validade || responseData.data?.expiration_date || "Não informada",
        points: responseData.data?.pontuacao || responseData.data?.points || 0,
        fines: responseData.data?.multas || responseData.data?.fines || []
      }
    };
  } else if (searchType === 'vehicle') {
    return {
      success: true,
      data: {
        plate: searchQuery,
        renavam: responseData.data?.renavam || "Não disponível",
        model: responseData.data?.modelo || responseData.data?.model || "Não disponível",
        year: responseData.data?.ano || responseData.data?.year || "Não disponível",
        owner: responseData.data?.proprietario || responseData.data?.owner || "Não disponível",
        fines: responseData.data?.multas || responseData.data?.fines || []
      }
    };
  } else {
    return {
      success: true,
      data: responseData.data
    };
  }
}

// Função principal de processamento de requisições
serve(async (req: Request) => {
  // Lidar com requisições CORS preflight
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  try {
    const { searchType, searchQuery, uf, additionalParams = {} } = await req.json();
    
    // Validar parâmetros obrigatórios
    validateRequestParams(searchType, searchQuery);
    
    // Configurar parâmetros para chamada à API
    const { endpoint, params } = configureRequestParams(searchType, searchQuery, uf, additionalParams);
    
    console.log(`Iniciando consulta à API InfoSimples: ${endpoint}`, params);
    
    // Montar URL completo
    const apiUrl = `${API_BASE_URL}${endpoint}`;
    
    // Realizar chamada à API
    const response = await fetchWithRetry(
      apiUrl, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    );
    
    const responseData = await response.json();
    console.log(`Resposta da API InfoSimples: Código ${responseData.code}`);
    
    // Verificar se houve erro na API
    const apiError = handleInfosimplesError(responseData.code, responseData.code_message);
    if (apiError) {
      throw apiError;
    }
    
    // Processar e normalizar a resposta
    const normalizedData = normalizeResponseData(searchType, searchQuery, responseData);

    return new Response(JSON.stringify(normalizedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Erro na função Edge InfoSimples:", error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
