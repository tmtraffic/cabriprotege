
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
  const { signIn, signUp, user, session, loading } = useSupabaseAuth();
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

  const createDemoUserIfNotExists = async (email: string, password: string, name: string, role: string) => {
    try {
      console.log(`Tentando criar usuário demo: ${email}`);
      const { data, error } = await signUp(email, password, {
        name,
        role
      });
      
      if (error && !error.message.includes('User already registered')) {
        console.error('Erro ao criar usuário demo:', error);
        return false;
      }
      
      console.log(`Usuário demo criado/já existe: ${email}`);
      return true;
    } catch (err) {
      console.error('Erro ao criar usuário demo:', err);
      return false;
    }
  };

  const ensureDemoUsersExist = async () => {
    try {
      console.log('Verificando/criando usuários de demonstração...');
      
      // Criar usuários demo se não existirem
      await createDemoUserIfNotExists('admin@exemplo.com', 'senha123', 'Administrador Demo', 'admin');
      await createDemoUserIfNotExists('employee@exemplo.com', 'senha123', 'Funcionário Demo', 'employee');
      await createDemoUserIfNotExists('cliente@exemplo.com', 'senha123', 'Cliente Demo', 'client');
      
      console.log('Usuários de demonstração verificados/criados');
    } catch (err) {
      console.error('Erro ao verificar usuários demo:', err);
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

      // Se for uma tentativa com credenciais demo, garantir que os usuários existam
      const isDemoCredential = ['admin@exemplo.com', 'employee@exemplo.com', 'cliente@exemplo.com'].includes(email) && password === 'senha123';
      
      if (isDemoCredential) {
        await ensureDemoUsersExist();
      }

      const { data, error } = await signIn(email, password);
      
      if (error) {
        // Se for erro de credenciais inválidas e for um email demo, tentar criar o usuário
        if (error.message.includes('Invalid login credentials') && isDemoCredential) {
          console.log('Tentando criar usuário demo antes de fazer login...');
          await ensureDemoUsersExist();
          
          // Tentar login novamente após criar o usuário
          const { data: retryData, error: retryError } = await signIn(email, password);
          if (retryError) throw retryError;
          
          if (retryData?.user) {
            toast({
              title: "Login realizado com sucesso",
              description: `Bem-vindo, ${retryData.user.email}!`,
            });

            if (rememberMe) {
              localStorage.setItem('rememberedEmail', email);
            } else {
              localStorage.removeItem('rememberedEmail');
            }

            redirectUserBasedOnEmail(email);
            return;
          }
        }
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
        userFriendlyMessage = 'Email ou senha incorretos. Verifique suas credenciais ou use as credenciais de demonstração.';
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
    
    // Garantir que os usuários demo existam quando o botão for clicado
    await ensureDemoUsersExist();
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
