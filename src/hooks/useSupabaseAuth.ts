
import { createClient } from '@supabase/supabase-js'

// Busca das variáveis de ambiente fornecidas pela integração do Lovable com o Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fcfc6e33-40a6-4f1d-899f-f33071f9a22c4.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Chave anônima do Supabase não encontrada. Verifique se você configurou corretamente a integração com o Lovable.');
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
