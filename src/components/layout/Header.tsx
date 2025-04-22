
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, User, Menu, Settings, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({
  toggleSidebar
}: HeaderProps) => {
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Aqui seria implementada a lógica real de logout
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    // Redirecionar para a página de login após logout
    setTimeout(() => navigate('/auth/login'), 1000);
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

  return <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
        
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              {/* Placeholder for Cabricop logo - replace with actual logo */}
              <div className="w-8 h-8 rounded-full bg-cabricop-blue flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="font-bold text-lg hidden md:inline-block text-cabricop-blue">CabriProtege</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
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
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Nova multa detectada para veículo ABC-1234
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Prazo de recurso em 3 dias para processo #12345
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Documento aprovado para análise
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Menu do usuário</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
      </div>
    </header>;
};

export default Header;
