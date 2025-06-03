
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useLoginAuth } from '@/hooks/useLoginAuth';
import LoginLoadingState from '@/components/auth/LoginLoadingState';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';
import DemoCredentials from '@/components/auth/DemoCredentials';
import LoginFooter from '@/components/auth/LoginFooter';

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    rememberMe,
    setRememberMe,
    loading,
    handleLogin,
    useDemoCredentials,
    navigate
  } = useLoginAuth();

  // If still loading initial authentication state
  if (loading) {
    return <LoginLoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-t-4 border-t-blue-600">
          <LoginHeader />
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              isLoading={isLoading}
              handleLogin={handleLogin}
            />
            
            <DemoCredentials useDemoCredentials={useDemoCredentials} />
          </CardContent>
          
          <LoginFooter navigate={navigate} isLoading={isLoading} />
        </Card>
      </div>
    </div>
  );
};

export default Login;
