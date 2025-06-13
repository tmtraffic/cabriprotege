
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Mail, Key, Loader2, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';

// Admin credentials for development/demo
const ADMIN_CREDENTIALS = {
  email: "agtmtraffic@gmail.com",
  password: "fozny7-vustab-qidhEs"
};

const Login = () => {
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

  const redirectUserBasedOnEmail = (email: string) => {
    if (email.includes('admin')) {
      navigate('/admin', { replace: true });
    } else if (email.includes('employee')) {
      navigate('/employee', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleDemoLogin = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
  };

  const bypassLogin = () => {
    // Simulate successful login for development
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", "admin");
    toast({
      title: "Bypass login realizado",
      description: "Redirecionando para o dashboard...",
    });
    navigate("/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos');
      }

      // Special handling for admin credentials
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        console.log("Attempting admin login...");
        
        // Try to sign in with Supabase first
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.log("Supabase login failed, creating new user...", error.message);
          
          // If Supabase login fails, create the user
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
              data: {
                name: "Admin AGTMTraffic",
                role: "admin"
              }
            }
          });
          
          if (signUpError) {
            console.error("Sign up error:", signUpError);
            toast({
              variant: "destructive",
              title: "Erro ao criar usuário",
              description: signUpError.message,
            });
            return;
          }
          
          console.log("User created successfully, attempting sign in...");
          
          // Sign in after creating
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
          });
          
          if (loginError) {
            console.error("Login after signup error:", loginError);
            throw loginError;
          }
          
          if (loginData?.user) {
            toast({
              title: "Usuário criado e login realizado",
              description: `Bem-vindo, ${loginData.user.email}!`,
            });
            redirectUserBasedOnEmail(email);
          }
        } else if (data?.user) {
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo, ${data.user.email}!`,
          });
          redirectUserBasedOnEmail(email);
        }
      } else {
        // Regular login flow
        const { data, error } = await signIn(email, password);
        
        if (error) throw error;
        
        if (data?.user) {
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo, ${data.user.email}!`,
          });

          // Salvar email no localStorage se "lembrar-me" estiver marcado
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }

          // Redirecionamento baseado no email
          redirectUserBasedOnEmail(email);
        } else {
          throw new Error('Não foi possível completar o login');
        }
      }
    } catch (err: any) {
      console.error('Erro de login:', err.message);
      
      // Mensagens mais amigáveis para erros comuns
      let userFriendlyMessage = err.message;
      
      if (err.message.includes('Invalid login credentials')) {
        userFriendlyMessage = 'Email ou senha incorretos';
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

  // Carregar email lembrado ao iniciar
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Se ainda estiver carregando o estado inicial de autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cabricop-blue" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-t-4 border-t-cabricop-blue">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-cabricop-blue flex items-center justify-center text-white text-2xl font-bold">
                CP
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Sistema CabriProtege
            </CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Mail size={18} />
                  </div>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Digite seu e-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </Label>
                  <Link 
                    to="/auth/reset-password" 
                    className="text-xs text-cabricop-blue hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Key size={18} />
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Digite sua senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                />
                <Label htmlFor="remember" className="text-sm text-gray-500">
                  Lembrar meu e-mail
                </Label>
              </div>
              
              <Button type="submit" className="w-full bg-cabricop-blue hover:bg-cabricop-blue/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : 'Entrar'}
              </Button>

              {/* Development bypass button */}
              {import.meta.env.DEV && (
                <Button 
                  type="button" 
                  onClick={bypassLogin} 
                  variant="outline" 
                  className="w-full"
                  disabled={isLoading}
                >
                  Bypass Login (Dev Only)
                </Button>
              )}
            </form>
            
            <div className="mt-4">
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <Info className="h-4 w-4" />
                <AlertTitle className="text-sm font-medium">Credenciais de acesso</AlertTitle>
                <AlertDescription className="text-xs">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-blue-600 p-0 h-auto"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    Clique aqui para usar as credenciais de demonstração
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-600 mt-2">
              Novo cliente? 
              <Button 
                variant="link" 
                className="text-cabricop-blue"
                onClick={() => navigate('/clients/new')}
                disabled={isLoading}
              >
                Cadastre-se aqui
              </Button>
            </div>
            
            <div className="text-center text-xs text-gray-500">
              &copy; {new Date().getFullYear()} CabriProtege. Todos os direitos reservados.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
