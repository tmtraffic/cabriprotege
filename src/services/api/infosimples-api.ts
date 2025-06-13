
import { useToast } from "@/hooks/use-toast";

const INFOSIMPLES_API_BASE_URL = "https://api.infosimples.com/api/v2";

// Force credentials for testing
let token = "VztDoZpEHnuoUZdXH9A1pQEpzJmAZvJ6v_bMsFiF";
let email = "agtmtraffic@gmail.com";

// Log the configured credentials
console.log('Infosimples API initialized with:', {
  email: email || 'NOT SET',
  token: token ? 'SET' : 'NOT SET',
  tokenLength: token ? token.length : 0
});

export const setInfosimplesCredentials = (userEmail: string, apiToken: string) => {
  email = userEmail;
  token = apiToken;
  console.log('Credentials updated:', { email, token: token ? 'SET' : 'NOT SET' });
};

export const getInfosimplesCredentials = () => ({
  email,
  token,
});

// Export a function to check credentials
export function checkCredentials() {
  return { 
    email, 
    token: token ? 'SET' : 'NOT SET',
    tokenLength: token ? token.length : 0
  };
}

interface ApiRequestOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, string>;
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Make an authenticated request to Infosimples API
 */
async function makeRequest<T>({
  endpoint,
  method = "GET",
  params = {},
  body = {},
  headers = {},
}: ApiRequestOptions): Promise<T> {
  console.log('makeRequest called with:', { endpoint, method, hasToken: !!token, hasEmail: !!email });
  
  if (!token || !email) {
    console.error('Missing credentials:', { email: !!email, token: !!token });
    throw new Error("Credenciais Infosimples não configuradas. Token ou email não encontrado.");
  }

  // Add authentication parameters
  const authParams = {
    email,
    token,
    ...params,
  };

  // Build URL with query parameters for GET requests
  const url = new URL(`${INFOSIMPLES_API_BASE_URL}${endpoint}`);
  
  if (method === "GET") {
    Object.entries(authParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  } else {
    // For non-GET requests, include auth in the body
    body = {
      ...body,
      ...authParams,
    };
  }

  // Build request options
  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  // Add body for non-GET requests
  if (method !== "GET") {
    requestOptions.body = JSON.stringify(body);
  }

  console.log('Making request to:', url.toString());
  console.log('Request options:', { method, hasBody: !!requestOptions.body });

  try {
    const response = await fetch(url.toString(), requestOptions);

    console.log('Response received:', { 
      status: response.status, 
      statusText: response.statusText,
      ok: response.ok
    });

    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = 
        errorData.message || 
        errorData.error || 
        `API error: ${response.status} ${response.statusText}`;
      
      console.error("Infosimples API error:", errorMessage, errorData);
      throw new Error(errorMessage);
    }

    // Parse response
    const result = await response.json();
    console.log('Response parsed successfully:', result);
    return result;
  } catch (error) {
    console.error("Infosimples API request failed:", error);
    throw error;
  }
}

// API endpoints for Infosimples

/**
 * Search for vehicle information by plate
 */
export async function searchVehicleByPlate(plate: string) {
  console.log('searchVehicleByPlate called with:', plate);
  console.log('Using credentials:', { 
    email, 
    token: token ? 'SET' : 'NOT SET',
    tokenLength: token ? token.length : 0
  });
  
  if (!email || !token) {
    throw new Error('Credenciais Infosimples não configuradas');
  }
  
  return makeRequest({
    endpoint: "/consultas/placa",
    method: "POST",
    body: { placa: plate },
  });
}

/**
 * Search for vehicle information by RENAVAM
 */
export async function searchVehicleByRenavam(renavam: string) {
  return makeRequest({
    endpoint: "/consultas/renavam",
    method: "POST",
    body: { renavam },
  });
}

/**
 * Search for driver information by CNH
 */
export async function searchDriverByCNH(cnh: string, birthDate: string) {
  return makeRequest({
    endpoint: "/consultas/cnh",
    method: "POST",
    body: { cnh, data_nascimento: birthDate },
  });
}

/**
 * Get the status of a consultation
 */
export async function getConsultationStatus(protocol: string) {
  return makeRequest({
    endpoint: "/consultas/status",
    method: "GET",
    params: { protocolo: protocol },
  });
}

/**
 * Get the result of a completed consultation
 */
export async function getConsultationResult(protocol: string) {
  return makeRequest({
    endpoint: "/consultas/resultado",
    method: "GET",
    params: { protocolo: protocol },
  });
}
