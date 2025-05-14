
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

export const fetchProcesses = async (userId?: string): Promise<Process[]> => {
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
      `);
    
    // If userId is provided, filter to only show processes for this user
    if (userId) {
      query = query.eq('client_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching processes:", error);
      return [];
    }
    
    return data as Process[];
  } catch (error) {
    console.error("Error in fetchProcesses:", error);
    return [];
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
    
    return data as Process[];
  } catch (error) {
    console.error(`Error in fetchProcessesByStatus for ${status}:`, error);
    return [];
  }
};
