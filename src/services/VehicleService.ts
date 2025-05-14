import { supabase } from "@/integrations/supabase/client";

export interface Vehicle {
  id: string;
  owner_id: string;
  brand: string;
  model: string;
  plate: string;
  year: number | null;
  color: string | null;
  renavam: string | null;
  professional_use: boolean | null;
  category: string | null;
  created_at: string;
  owner?: {
    name: string;
    email: string;
  };
}

export interface VehicleFilters {
  search?: string;
  brand?: string;
  year?: number;
  plate?: string;
  owner_id?: string;
}

export const fetchVehicles = async (filters?: VehicleFilters | string): Promise<Vehicle[]> => {
  try {
    let query = supabase
      .from("vehicles")
      .select(`
        *,
        owner:profiles!vehicles_owner_id_fkey(name, email)
      `);
    
    // Handle the case where filters is a string (backward compatibility)
    if (typeof filters === 'string') {
      // If filters is a string, treat it as owner_id
      query = query.eq('owner_id', filters);
    } else if (filters) {
      // Apply filters if they exist
      if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        query = query.or(`plate.ilike.${searchTerm},brand.ilike.${searchTerm},model.ilike.${searchTerm}`);
      }
      
      if (filters.brand) {
        query = query.ilike('brand', `%${filters.brand}%`);
      }
      
      if (filters.year) {
        query = query.eq('year', filters.year);
      }
      
      if (filters.plate) {
        query = query.ilike('plate', `%${filters.plate}%`);
      }
      
      if (filters.owner_id) {
        query = query.eq('owner_id', filters.owner_id);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Map the data to match our Vehicle interface with owner information
    return data.map(vehicle => ({
      ...vehicle,
      owner: vehicle.owner ? {
        name: vehicle.owner.name || "Unknown",
        email: vehicle.owner.email || ""
      } : undefined
    })) as Vehicle[];
  } catch (error) {
    console.error("Error fetching vehicles:", error);
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

export const createVehicle = async (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<Vehicle | null> => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicle])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating vehicle:", error);
      return null;
    }
    
    return data as Vehicle;
  } catch (error) {
    console.error("Error in createVehicle:", error);
    return null;
  }
};

export const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating vehicle with id ${id}:`, error);
      return null;
    }
    
    return data as Vehicle;
  } catch (error) {
    console.error(`Error in updateVehicle for ${id}:`, error);
    return null;
  }
};

export const deleteVehicle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting vehicle with id ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in deleteVehicle for ${id}:`, error);
    return false;
  }
};
