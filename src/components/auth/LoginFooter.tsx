
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface LoginFooterProps {
  navigate: (path: string) => void;
  isLoading: boolean;
}

const LoginFooter = ({ navigate, isLoading }: LoginFooterProps) => {
  return (
    <CardFooter className="flex flex-col space-y-4">
      <div className="text-center text-sm text-gray-600 mt-2">
        Novo cliente? 
        <Button 
          variant="link" 
          className="text-blue-600"
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
  );
};

export default LoginFooter;
