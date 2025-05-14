
import { supabase } from "@/integrations/supabase/client";

export interface Deadline {
  id: string;
  process_id: string;
  title: string;
  due_date: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean | null;
  created_at: string;
  updated_at: string;
  process?: {
    description: string | null;
    type: string;
  };
}

export const fetchDeadlines = async (userId?: string): Promise<Deadline[]> => {
  try {
    // For deadlines, we need to join through processes to check user access
    let query = supabase
      .from('deadlines')
      .select(`
        *,
        process:process_id (
          description,
          type,
          client_id
        )
      `);
    
    // If userId is provided, filter to only show deadlines for processes owned by this user
    // We'll filter client-side since it's more complex with the nested joins
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching deadlines:", error);
      return [];
    }
    
    // If userId is provided, filter to only show deadlines for processes owned by this user
    if (userId) {
      return (data as any[]).filter(deadline => deadline.process.client_id === userId);
    }
    
    return data as Deadline[];
  } catch (error) {
    console.error("Error in fetchDeadlines:", error);
    return [];
  }
};

export const fetchUpcomingDeadlines = async (days: number = 7, userId?: string): Promise<Deadline[]> => {
  try {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + days);
    
    // For deadlines, we need to join through processes to check user access
    let query = supabase
      .from('deadlines')
      .select(`
        *,
        process:process_id (
          description,
          type,
          client_id
        )
      `)
      .gte('due_date', now.toISOString())
      .lte('due_date', future.toISOString())
      .eq('completed', false);
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching upcoming deadlines:`, error);
      return [];
    }
    
    // If userId is provided, filter to only show deadlines for processes owned by this user
    if (userId) {
      return (data as any[]).filter(deadline => deadline.process.client_id === userId);
    }
    
    return data as Deadline[];
  } catch (error) {
    console.error(`Error in fetchUpcomingDeadlines:`, error);
    return [];
  }
};
