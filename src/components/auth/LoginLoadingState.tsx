
import { Loader2 } from 'lucide-react';

const LoginLoadingState = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Verificando autenticação...</p>
      </div>
    </div>
  );
};

export default LoginLoadingState;
