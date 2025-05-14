
import { MAX_RETRIES, TIMEOUT_MS } from "./constants.ts";

// Função para realizar chamadas à API com retry
export async function fetchWithRetry(url: string, options: RequestInit, maxRetries = MAX_RETRIES) {
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
