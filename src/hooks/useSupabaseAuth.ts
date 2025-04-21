
import { createClient } from '@supabase/supabase-js'

// Usando valores temporários para desenvolvimento se as variáveis de ambiente não estiverem disponíveis
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sua-url-do-supabase.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anon-do-supabase';

// Verificando se as variáveis de ambiente estão definidas
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Variáveis de ambiente do Supabase não encontradas. Usando valores temporários para desenvolvimento.' +
    'Por favor, configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu projeto Lovable.');
}

// Para desenvolvimento, use valores reais ao invés dos placeholders acima
// Isso é apenas para evitar erros de inicialização, mas não funcionará para autenticação real
// sem as variáveis de ambiente corretas
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useSupabaseAuth = () => {
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  return {
    signIn,
    signOut,
    supabase
  }
}
