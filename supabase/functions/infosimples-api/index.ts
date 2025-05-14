
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, handleOptionsRequest } from "./utils/cors.ts";
import { fetchWithRetry } from "./utils/apiClient.ts";
import { API_BASE_URL } from "./utils/constants.ts";
import { handleInfosimplesError } from "./utils/errorHandler.ts";
import { validateRequestParams, configureRequestParams } from "./utils/paramConfig.ts";
import { normalizeResponseData } from "./utils/responseNormalizer.ts";

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
