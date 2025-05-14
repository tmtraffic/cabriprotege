
import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  cpf?: string | null;
  client_type?: string | null;
  notes?: string | null;
}

export async function getClients(): Promise<{ data: Client[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client');
  
  return { data, error };
}

export async function getClientById(id: string): Promise<{ data: Client | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('role', 'client')
    .single();
  
  return { data, error };
}

export async function getClientVehicles(clientId: string) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('owner_id', clientId);
  
  return { data, error };
}

export async function getClientProcesses(clientId: string) {
  const { data, error } = await supabase
    .from('processes')
    .select(`
      *,
      infraction:infraction_id (
        *
      )
    `)
    .eq('client_id', clientId);
  
  return { data, error };
}

export async function createClient(values: {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  client_type?: string;
  notes?: string;
}) {
  // First, create a new user in auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: values.email,
    password: Math.random().toString(36).slice(-8), // Generate a random password
    options: {
      data: {
        name: values.name,
        role: 'client',
      },
    },
  });

  if (authError) {
    return { data: null, error: authError };
  }

  // User created, update additional data
  // The profile should have been created via trigger
  if (authData?.user?.id) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        phone: values.phone || null,
        // Add additional fields as needed
      })
      .eq('id', authData.user.id);

    return { data, error };
  }

  return { 
    data: null, 
    error: new Error('Falha ao criar usuário no sistema de autenticação') 
  };
}
