
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useSupabaseAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos');
      }

      const { user } = await signIn(email, password);

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${user?.email}!`,
      });

      // Redirecionamento baseado no email
      if (email.includes('admin')) {
        navigate('/admin');
      } else if (email.includes('employee')) {
        navigate('/employee');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: err instanceof Error ? err.message : 'Erro ao fazer login',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login do Sistema Cabricop</h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Digite seu e-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Digite sua senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>

          <div className="text-center mt-4">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Esqueceu sua senha?
            </a>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Novo cliente? 
          <Button 
            variant="link" 
            className="ml-2 text-cabricop-blue"
            onClick={() => navigate('/clients/new')}
            disabled={isLoading}
          >
            Cadastre-se aqui
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
