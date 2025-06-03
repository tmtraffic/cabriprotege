
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
          <p>Use <strong>admin@exemplo.com</strong> / <strong>senha123</strong> para testar o sistema</p>
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
