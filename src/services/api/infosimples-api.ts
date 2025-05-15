
import { toast } from "@/components/ui/sonner";

const INFOSIMPLES_API_BASE_URL = "https://api.infosimples.com/api/v2";

// Store API credentials securely - in production, these should come from environment variables or user input
let token = "";
let email = "";

export const setInfosimplesCredentials = (userEmail: string, apiToken: string) => {
  email = userEmail;
  token = apiToken;
};

export const getInfosimplesCredentials = () => ({
  email,
  token,
});

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
  if (!token || !email) {
    throw new Error("API credentials not set. Please configure your Infosimples credentials.");
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

  try {
    const response = await fetch(url.toString(), requestOptions);

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
    return await response.json();
  } catch (error) {
    console.error("Infosimples API request failed:", error);
    toast({
      title: "API Request Failed",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    throw error;
  }
}

// API endpoints for Infosimples

/**
 * Search for vehicle information by plate
 */
export async function searchVehicleByPlate(plate: string) {
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
