
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, User, Menu, Settings, LogOut, Activity } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import MobileNavigation from "./MobileNavigation";

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
  userRole: "client" | "employee" | "admin";
}

const Header = ({ toggleSidebar, isMobile, userRole }: HeaderProps) => {
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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          {/* Desktop: Sidebar Toggle */}
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-bold text-lg hidden sm:inline-block text-gray-900">
              CabriProtege
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          {/* Desktop Navigation Links */}
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
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {notifications}
                  </span>
                )}
                <span className="sr-only">Notificações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">Nova multa detectada</span>
                    <span className="text-sm text-muted-foreground">
                      Veículo ABC-1234 recebeu uma nova multa por excesso de velocidade
                    </span>
                    <span className="text-xs text-gray-400">Há 2 horas</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">Prazo de recurso</span>
                    <span className="text-sm text-muted-foreground">
                      O recurso #12345 vence em 3 dias
                    </span>
                    <span className="text-xs text-gray-400">Há 1 dia</span>
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
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative flex items-center gap-2 focus:ring-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                  {getUserInitials()}
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {user?.email ? user.email.split('@')[0] : 'Usuário'}
                </span>
                <span className="sr-only">Menu do usuário</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
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

          {/* Mobile Navigation - no final */}
          {isMobile && <MobileNavigation userRole={userRole} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
