
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

export const fetchProcesses = async (userId: string): Promise<Process[]> => {
  try {
    const { data, error } = await supabase
      .from("processes")
      .select(`
        *,
        infraction:infractions(*),
        client:profiles!client_id(*),
        assignee:profiles!assigned_to(*)
      `)
      .eq("client_id", userId);

    if (error) throw error;

    // Transform the data to match our Process interface
    const processData = data.map(process => ({
      id: process.id,
      infraction_id: process.infraction_id,
      client_id: process.client_id,
      assigned_to: process.assigned_to,
      type: process.type,
      status: process.status,
      description: process.description,
      created_at: process.created_at,
      updated_at: process.updated_at,
      infraction: process.infraction,
      client: {
        name: process.client?.name || "Unknown",
        email: process.client?.email || ""
      },
      assignee: process.assignee ? {
        name: process.assignee?.name || "Unassigned"
      } : undefined
    }));

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
        infraction:infractions(*),
        client:profiles!client_id(*),
        assignee:profiles!assigned_to(*)
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
      infraction: data.infraction,
      client: {
        name: data.client?.name || "Unknown",
        email: data.client?.email || ""
      },
      assignee: data.assignee ? {
        name: data.assignee?.name || "Unassigned"
      } : undefined
    };

    return process as Process;
  } catch (error) {
    console.error("Error fetching process:", error);
    return null;
  }
};

export const fetchProcessesByStatus = async (status: string, userId?: string): Promise<Process[]> => {
  try {
    let query = supabase
      .from('processes')
      .select(`
        *,
        infraction:infraction_id (
          auto_number,
          description,
          value,
          vehicle:vehicle_id (
            plate
          )
        ),
        client:client_id (
          name,
          email
        ),
        assignee:assigned_to (
          name
        )
      `)
      .eq('status', status);
    
    // If userId is provided, filter to only show processes for this user
    if (userId) {
      query = query.eq('client_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${status} processes:`, error);
      return [];
    }
    
    // Map the data to match our Process interface
    const processes = data.map(process => ({
      id: process.id,
      infraction_id: process.infraction_id,
      client_id: process.client_id,
      assigned_to: process.assigned_to,
      status: process.status as Process['status'],
      type: process.type as Process['type'],
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
    }));
    
    return processes as Process[];
  } catch (error) {
    console.error(`Error in fetchProcessesByStatus for ${status}:`, error);
    return [];
  }
};
