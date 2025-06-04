
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/components/ui/use-toast';

export const useLoginAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, session, loading } = useSupabaseAuth();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    if (user && session) {
      redirectUserBasedOnEmail(user.email || '');
    }
  }, [user, session]);

  // Load remembered email on start
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const redirectUserBasedOnEmail = (email: string) => {
    if (email.includes('admin')) {
      navigate('/admin', { replace: true });
    } else if (email.includes('employee')) {
      navigate('/employee', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos');
      }

      const { data, error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${data.user.email}!`,
        });

        // Save email in localStorage if "remember me" is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Redirect based on email
        redirectUserBasedOnEmail(email);
      } else {
        throw new Error('Não foi possível completar o login');
      }
    } catch (err: any) {
      console.error('Erro de login:', err.message);
      
      // More friendly messages for common errors
      let userFriendlyMessage = err.message;
      
      if (err.message.includes('Invalid login credentials')) {
        userFriendlyMessage = 'Email ou senha incorretos. Para testar o sistema, use as credenciais de demonstração através do botão abaixo.';
      } else if (err.message.includes('Email not confirmed')) {
        userFriendlyMessage = 'Por favor, confirme seu email antes de fazer login';
      } else if (err.message.includes('Failed to fetch')) {
        userFriendlyMessage = 'Erro de conexão com o servidor. Verifique sua internet.';
      } else if (err.message.includes('Too many requests')) {
        userFriendlyMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      }
      
      setError(userFriendlyMessage);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: userFriendlyMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoCredentials = async () => {
    setEmail('admin@exemplo.com');
    setPassword('senha123');
    setError(null);
    
    toast({
      title: "Credenciais de demonstração carregadas",
      description: "Clique em 'Entrar' para acessar o sistema como administrador",
    });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    rememberMe,
    setRememberMe,
    loading,
    handleLogin,
    useDemoCredentials,
    navigate
  };
};
