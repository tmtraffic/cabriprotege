
import { createClient } from '@supabase/supabase-js'

// Usando valores de fallback para desenvolvimento se as variáveis de ambiente não estiverem disponíveis
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sua-url-do-supabase.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anon-do-supabase';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Variáveis de ambiente do Supabase não encontradas. Usando valores de fallback para desenvolvimento.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useSupabaseAuth = () => {
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    signIn,
    signOut,
    supabase
  }
}
