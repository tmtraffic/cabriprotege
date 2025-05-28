import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, User, Menu, Settings, LogOut, Activity } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({
  toggleSidebar
}: HeaderProps) => {
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user } = useSupabaseAuth();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      
      // Redirecionar para a página de login após logout
      navigate('/auth/login');
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível concluir o logout. Tente novamente.",
      });
    }
  };

  const handleNavigateToProfile = () => {
    toast({
      title: "Perfil",
      description: "Navegando para página de perfil do usuário",
    });
    // Aqui seria implementada a navegação para o perfil
  };

  const handleNavigateToSettings = () => {
    navigate('/configuracoes');
  };

  const getUserInitials = () => {
    if (!user || !user.email) return 'U';
    
    const parts = user.email.split('@')[0].split('.');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="mr-2 hidden md:flex" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
          
          <MobileNavigation userRole="admin" />
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cabricop-blue flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-bold text-lg hidden sm:inline-block text-cabricop-blue">CabriProtege</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to="/gateway">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                API Gateway
              </Button>
            </Link>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && <span className="absolute -top-1 -right-1 bg-cabricop-orange text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {notifications}
                  </span>}
                <span className="sr-only">Notificações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">Nova multa detectada</span>
                    <span className="text-sm text-muted-foreground">Veículo ABC-1234 recebeu uma nova multa por excesso de velocidade</span>
                    <span className="text-xs text-gray-400">Há 2 horas</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">Prazo de recurso</span>
                    <span className="text-sm text-muted-foreground">O recurso #12345 vence em 3 dias</span>
                    <span className="text-xs text-gray-400">Há 1 dia</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">Documento aprovado</span>
                    <span className="text-sm text-muted-foreground">O documento do processo #45678 foi aprovado para análise</span>
                    <span className="text-xs text-gray-400">Há 3 dias</span>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-center cursor-pointer">
                <Link to="/notificacoes" className="w-full text-center text-sm text-blue-600">
                  Ver todas as notificações
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative flex items-center gap-2 focus:ring-0">
                <div className="h-8 w-8 rounded-full bg-cabricop-blue/90 flex items-center justify-center text-white font-medium text-sm">
                  {getUserInitials()}
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {user?.email ? user.email.split('@')[0] : 'Usuário'}
                </span>
                <span className="sr-only">Menu do usuário</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleNavigateToProfile} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigateToSettings} className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
};

export default Header;
