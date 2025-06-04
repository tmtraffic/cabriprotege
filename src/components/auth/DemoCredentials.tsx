
import { Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DemoCredentialsProps {
  useDemoCredentials: () => void;
}

const DemoCredentials = ({ useDemoCredentials }: DemoCredentialsProps) => {
  return (
    <div className="mt-4 space-y-3">
      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <Info className="h-4 w-4" />
        <AlertTitle className="text-sm font-medium">Conta de demonstração</AlertTitle>
        <AlertDescription className="text-xs space-y-2">
          <p>Para testar o sistema, você precisa criar uma conta primeiro:</p>
          <div className="text-xs bg-white p-2 rounded border">
            <p><strong>Email:</strong> admin@exemplo.com</p>
            <p><strong>Senha:</strong> senha123</p>
          </div>
          <p className="text-xs">Caso ainda não tenha uma conta, clique em "Cadastre-se aqui" abaixo e crie uma conta com essas credenciais.</p>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={useDemoCredentials}
            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Usar credenciais de demonstração
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DemoCredentials;
