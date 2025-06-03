
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const LoginHeader = () => {
  return (
    <CardHeader className="space-y-1">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
          CP
        </div>
      </div>
      <CardTitle className="text-2xl font-bold text-center">
        Sistema CabriProtege
      </CardTitle>
      <CardDescription className="text-center">
        Entre com suas credenciais para acessar o sistema
      </CardDescription>
    </CardHeader>
  );
};

export default LoginHeader;
