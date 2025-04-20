
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, User, Lock } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"client" | "employee" | "admin">("client");

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for actual login logic
    // In a real implementation, this would authenticate with a backend
    
    // Redirect based on user type
    window.location.href = userType === "client" 
      ? "/" 
      : userType === "employee" 
        ? "/employee" 
        : "/admin";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-cabricop-blue flex items-center justify-center mb-4">
            <span className="text-3xl text-white font-bold">C</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-cabricop-blue">Cabricop Traffic Resources</h1>
          <p className="text-muted-foreground mt-2">Sistema de Gestão de Recursos de Trânsito</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Acesse o sistema com suas credenciais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="client" className="w-full" onValueChange={(value) => setUserType(value as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="client">Cliente</TabsTrigger>
                <TabsTrigger value="employee">Funcionário</TabsTrigger>
                <TabsTrigger value="admin">Administrador</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-9"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm">
                <Link to="/auth/recovery" className="text-cabricop-blue hover:underline">
                  Esqueceu sua senha?
                </Link>
              </div>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/auth/register" className="text-cabricop-blue hover:underline">
                  Entre em contato
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground">
          Desenvolvido por TM Traffic © {new Date().getFullYear()} Cabricop Traffic Resources
        </p>
      </div>
    </div>
  );
};

export default Login;
