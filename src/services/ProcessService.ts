import { supabase } from "@/integrations/supabase/client";

export interface Process {
  id: string;
  infraction_id: string | null;
  client_id: string;
  assigned_to: string | null;
  status: 'pending' | 'in_progress' | 'documentation_needed' | 'review' | 'completed' | 'canceled';
  type: 'fine_appeal' | 'license_suspension' | 'license_revocation' | 'other';
  description: string | null;
  created_at: string;
  updated_at: string;
  infraction?: {
    auto_number: string | null;
    description: string | null;
    value: number;
    vehicle: {
      plate: string;
    };
  };
  client?: {
    name: string;
    email: string;
  };
  assignee?: {
    name: string;
  };
}

export interface ProcessFilters {
  client_id?: string;
  status?: string;
  type?: string;
  assigned_to?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export const fetchProcesses = async (filters?: ProcessFilters | string): Promise<Process[]> => {
  try {
    let query = supabase
      .from("processes")
      .select(`
        *,
        infraction:infractions(
          *,
          vehicle:vehicles(plate)
        ),
        client:profiles!client_id(name, email),
        assignee:profiles!assigned_to(name)
      `);

    // Handle the case where filters is a string (backward compatibility)
    if (typeof filters === 'string') {
      // If filters is a string, treat it as client_id
      query = query.eq("client_id", filters);
    } else if (filters) {
      // Apply each filter if it exists
      if (filters.client_id) {
        query = query.eq("client_id", filters.client_id);
      }
      
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      
      if (filters.type) {
        query = query.eq("type", filters.type);
      }
      
      if (filters.assigned_to) {
        query = query.eq("assigned_to", filters.assigned_to);
      }
      
      if (filters.search) {
        // Search in description or through relations
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        query = query.or(`description.ilike.${searchTerm}`);
      }
      
      if (filters.date_from) {
        query = query.gte("created_at", filters.date_from);
      }
      
      if (filters.date_to) {
        query = query.lte("created_at", filters.date_to);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform the data to match our Process interface
    const processData = data.map(process => {
      return {
        id: process.id,
        infraction_id: process.infraction_id,
        client_id: process.client_id,
        assigned_to: process.assigned_to,
        type: process.type,
        status: process.status,
        description: process.description,
        created_at: process.created_at,
        updated_at: process.updated_at,
        infraction: process.infraction ? {
          auto_number: process.infraction.auto_number,
          description: process.infraction.description,
          value: process.infraction.value,
          vehicle: {
            plate: process.infraction.vehicle?.plate || "Unknown"
          }
        } : undefined,
        client: {
          name: process.client?.name || "Unknown",
          email: process.client?.email || ""
        },
        assignee: process.assignee ? {
          name: process.assignee.name || "Unassigned"
        } : undefined
      };
    });

    return processData as Process[];
  } catch (error) {
    console.error("Error fetching processes:", error);
    return [];
  }
};

export const fetchProcessById = async (processId: string): Promise<Process | null> => {
  try {
    const { data, error } = await supabase
      .from("processes")
      .select(`
        *,
        infraction:infractions(
          *,
          vehicle:vehicles(plate)
        ),
        client:profiles!client_id(name, email),
        assignee:profiles!assigned_to(name)
      `)
      .eq("id", processId)
      .single();

    if (error) throw error;

    // Transform to required type
    const process = {
      id: data.id,
      infraction_id: data.infraction_id,
      client_id: data.client_id,
      assigned_to: data.assigned_to,
      type: data.type,
      status: data.status,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
      infraction: data.infraction ? {
        auto_number: data.infraction.auto_number,
        description: data.infraction.description,
        value: data.infraction.value,
        vehicle: {
          plate: data.infraction.vehicle?.plate || "Unknown"
        }
      } : undefined,
      client: {
        name: data.client?.name || "Unknown",
        email: data.client?.email || ""
      },
      assignee: data.assignee ? {
        name: data.assignee.name || "Unassigned"
      } : undefined
    };

    return process as Process;
  } catch (error) {
    console.error("Error fetching process:", error);
    return null;
  }
};

export const fetchProcessesByStatus = async (status: string, userId?: string): Promise<Process[]> => {
  // Convert to using the new filters interface
  const filters: ProcessFilters = {
    status: status,
  };
  
  if (userId) {
    filters.client_id = userId;
  }
  
  return fetchProcesses(filters);
};
