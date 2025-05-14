
import { supabase } from "@/integrations/supabase/client";

export interface Infraction {
  id: string;
  vehicle_id: string;
  auto_number: string | null;
  description: string | null;
  date: string;
  value: number;
  status: 'pending' | 'processed' | 'notified' | 'contested' | 'closed';
  points: number | null;
  vehicle?: {
    plate: string;
    brand: string;
    model: string;
  };
}

export const fetchInfractions = async (userId?: string): Promise<Infraction[]> => {
  try {
    let query = supabase
      .from('infractions')
      .select(`
        *,
        vehicle:vehicle_id (
          plate,
          brand,
          model
        )
      `);
    
    // If userId is provided, filter to only show infractions for vehicles owned by this user
    if (userId) {
      query = query.eq('vehicle.owner_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching infractions:", error);
      return [];
    }
    
    return data as Infraction[];
  } catch (error) {
    console.error("Error in fetchInfractions:", error);
    return [];
  }
};

export const fetchInfractionsByStatus = async (status: string, userId?: string): Promise<Infraction[]> => {
  try {
    let query = supabase
      .from('infractions')
      .select(`
        *,
        vehicle:vehicle_id (
          plate,
          brand,
          model
        )
      `)
      .eq('status', status);
    
    // If userId is provided, filter to only show infractions for vehicles owned by this user
    if (userId) {
      query = query.eq('vehicle.owner_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${status} infractions:`, error);
      return [];
    }
    
    return data as Infraction[];
  } catch (error) {
    console.error(`Error in fetchInfractionsByStatus for ${status}:`, error);
    return [];
  }
};
