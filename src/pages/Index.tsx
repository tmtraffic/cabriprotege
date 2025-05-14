import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, User, Car, Search, Shield, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user, session, loading } = useSupabaseAuth();

  useEffect(() => {
    // Use autenticação real com Supabase
    const checkAuth = async () => {
      // Aguarda o carregamento do estado de autenticação
      if (loading) return;
      
      if (user && session) {
        // Se o usuário está autenticado, verifica o papel dele
        // Obtém o perfil do usuário para verificar o papel
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (error) {
            throw error;
          }
          
          const userRole = data?.role || 'client';
          
          if (userRole === 'admin') {
            navigate("/admin");
          } else if (userRole === 'employee') {
            navigate("/employee");
          } else {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Erro ao obter perfil do usuário:", error);
          toast({
            title: "Erro de autenticação",
            description: "Não foi possível verificar suas permissões. Tente novamente.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      } else {
        // Usuário não está autenticado, continua na página inicial
        setIsLoading(false);
      }
    };

    // Pequeno delay para simular verificação
    const timer = setTimeout(() => {
      checkAuth();
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate, user, session, loading]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold text-cabricop-blue">Cabricop</div>
          <div className="w-16 h-16 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  // Página principal para usuários não autenticados
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cabricop Traffic Resources</h1>
          <p className="text-muted-foreground">
            Sistema de Gestão de Recursos de Trânsito
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to="/auth/login">Entrar no Sistema</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <FileText className="h-6 w-6 text-cabricop-blue" />
            <div>
              <CardTitle>Gestão de Recursos</CardTitle>
              <CardDescription>
                Recursos de multas e defesas administrativas
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Gerencie recursos de multas de trânsito, processos de suspensão e cassação de CNH com eficiência e resultados comprovados.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <User className="h-6 w-6 text-cabricop-blue" />
            <div>
              <CardTitle>Para Motoristas Profissionais</CardTitle>
              <CardDescription>
                Soluções especializadas para profissionais
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Atendimento prioritário para motoristas de aplicativo, táxi, caminhão e ônibus, com foco na manutenção da sua atividade profissional.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Car className="h-6 w-6 text-cabricop-blue" />
            <div>
              <CardTitle>Gestão de Frotas</CardTitle>
              <CardDescription>
                Soluções para gestão de múltiplos veículos
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Controle completo da situação de multas e processos para empresas com frotas, reduzindo custos e otimizando a gestão.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
