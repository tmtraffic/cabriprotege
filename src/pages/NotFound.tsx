import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cabricop-blue flex items-center justify-center">
          <span className="text-5xl font-bold text-white">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-cabricop-blue">Página não encontrada</h1>
        <p className="text-muted-foreground mb-6">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild>
          <Link to="/auth/login">
            Voltar para a página inicial
          </Link>
        </Button>
        <p className="mt-8 text-xs text-muted-foreground">
          Desenvolvido por TM Traffic © {new Date().getFullYear()} Cabricop Traffic Resources
        </p>
      </div>
    </div>
  );
};

export default NotFound;
