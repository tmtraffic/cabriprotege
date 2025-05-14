
// API da InfoSimples
export const INFOSIMPLES_API_TOKEN = Deno.env.get("INFOSIMPLES_API_TOKEN");
export const INFOSIMPLES_USER_ID = Deno.env.get("INFOSIMPLES_USER_ID");

// Constantes
export const API_BASE_URL = "https://api.infosimples.com/api/v2";
export const MAX_RETRIES = 3;
export const TIMEOUT_MS = 600000; // 600 segundos (10 minutos)
