
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        } else if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        }
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: Record<string, any>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/update-password',
      });
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
    supabase
  };
};
