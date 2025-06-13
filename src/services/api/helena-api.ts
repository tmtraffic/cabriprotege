import { useToast } from "@/hooks/use-toast";

const HELENA_API_BASE_URL = "https://api.helena.app/v1";

// Store API key securely - in production, this should come from environment variables or user input
let apiKey = "";

export const setHelenaApiKey = (key: string) => {
  apiKey = key;
};

export const getHelenaApiKey = () => apiKey;

interface ApiRequestOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, string>;
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Make an authenticated request to Helena API
 */
async function makeRequest<T>({
  endpoint,
  method = "GET",
  params = {},
  body,
  headers = {},
}: ApiRequestOptions): Promise<T> {
  if (!apiKey) {
    throw new Error("API key not set. Please configure your Helena API key.");
  }

  // Build URL with query parameters
  const url = new URL(`${HELENA_API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  // Build request options
  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      ...headers,
    },
  };

  // Add body for non-GET requests
  if (body && method !== "GET") {
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
      
      console.error("Helena API error:", errorMessage, errorData);
      throw new Error(errorMessage);
    }

    // Parse response
    return await response.json();
  } catch (error) {
    console.error("Helena API request failed:", error);
    // Don't use toast here directly - let the hook handle it
    throw error;
  }
}

// API function interfaces
interface SearchConsultParams {
  plate?: string;
  renavam?: string;
  chassi?: string;
  driver_license?: string;
  driver_license_type?: string;
  state?: string;
}

interface ConsultResponseData {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Add other response fields as needed
}

interface FineDetails {
  auto_number: string;
  date: string;
  agency: string;
  infraction_code: string;
  infraction_description: string;
  location: string;
  status: string;
  value: number;
  // Add other fine details as needed
}

/**
 * Create a new consultation
 */
export async function createConsult(params: SearchConsultParams) {
  return makeRequest<ConsultResponseData>({
    endpoint: "/consults",
    method: "POST",
    body: params,
  });
}

/**
 * Get consultation status
 */
export async function getConsultStatus(consultId: string) {
  return makeRequest<ConsultResponseData>({
    endpoint: `/consults/${consultId}`,
  });
}

/**
 * Get consultation results
 */
export async function getConsultResults(consultId: string) {
  return makeRequest<{ fines: FineDetails[], driver: any, vehicle: any }>({
    endpoint: `/consults/${consultId}/results`,
  });
}

/**
 * List user's consultations
 */
export async function listConsults(page = 1, perPage = 10) {
  return makeRequest<{ data: ConsultResponseData[], meta: { total: number, page: number, per_page: number } }>({
    endpoint: "/consults",
    params: { page: page.toString(), per_page: perPage.toString() },
  });
}
