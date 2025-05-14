
import { supabase } from "@/integrations/supabase/client";

export interface Vehicle {
  id: string;
  owner_id: string;
  plate: string;
  renavam: string | null;
  brand: string;
  model: string;
  year: number | null;
  color: string | null;
  professional_use: boolean | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchVehicles = async (userId?: string): Promise<Vehicle[]> => {
  try {
    let query = supabase
      .from('vehicles')
      .select('*');
    
    // If userId is provided, filter to only show vehicles owned by this user
    if (userId) {
      query = query.eq('owner_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching vehicles:", error);
      return [];
    }
    
    return data as Vehicle[];
  } catch (error) {
    console.error("Error in fetchVehicles:", error);
    return [];
  }
};

export const fetchVehicleById = async (id: string): Promise<Vehicle | null> => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching vehicle with id ${id}:`, error);
      return null;
    }
    
    return data as Vehicle;
  } catch (error) {
    console.error(`Error in fetchVehicleById for ${id}:`, error);
    return null;
  }
};
