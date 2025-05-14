
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

export interface VehicleFilters {
  ownerId?: string;
  plate?: string;
  brand?: string;
  model?: string;
  category?: string;
  professionalUse?: boolean;
}

export const fetchVehicles = async (filters?: VehicleFilters): Promise<Vehicle[]> => {
  try {
    let query = supabase
      .from('vehicles')
      .select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.ownerId) {
        query = query.eq('owner_id', filters.ownerId);
      }
      if (filters.plate) {
        query = query.ilike('plate', `%${filters.plate}%`);
      }
      if (filters.brand) {
        query = query.ilike('brand', `%${filters.brand}%`);
      }
      if (filters.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.professionalUse !== undefined) {
        query = query.eq('professional_use', filters.professionalUse);
      }
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
