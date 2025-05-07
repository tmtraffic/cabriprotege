
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Shield, Clock, ArrowRight } from "lucide-react";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

// Tipos para as rotas e serviços
export interface ServiceRoute {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  status: 'online' | 'offline' | 'degraded';
  latency: number;
  lastChecked: Date;
}

// Mock dos microserviços para o protótipo
const MOCK_SERVICES: ServiceRoute[] = [
  {
    id: 'user-service',
    name: 'Serviço de Gestão de Usuários',
    description: 'Autenticação, autorização e perfis de usuários',
    endpoint: '/api/users',
    status: 'online',
    latency: 45,
    lastChecked: new Date(),
  },
  {
    id: 'infraction-service',
    name: 'Serviço de Registro de Infrações',
    description: 'Cadastro e gestão de infrações de trânsito',
    endpoint: '/api/infractions',
    status: 'online',
    latency: 62,
    lastChecked: new Date(),
  },
  {
    id: 'multa-service',
    name: 'Serviço de Classificação de Multas',
    description: 'Classificação e cálculo de valores de multas',
    endpoint: '/api/multas',
    status: 'degraded',
    latency: 187,
    lastChecked: new Date(),
  },
  {
    id: 'notification-service',
    name: 'Serviço de Notificação',
    description: 'Envio de notificações aos infratores',
    endpoint: '/api/notifications',
    status: 'online',
    latency: 38,
    lastChecked: new Date(),
  },
  {
    id: 'payment-service',
    name: 'Serviço de Pagamentos',
    description: 'Processamento de pagamentos de multas',
    endpoint: '/api/payments',
    status: 'offline',
    latency: 0,
    lastChecked: new Date(),
  },
];

const ApiGateway: React.FC = () => {
  const [services, setServices] = useState<ServiceRoute[]>(MOCK_SERVICES);
  const { user } = useSupabaseAuth();
  
  // Simulação de polling para status dos serviços
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prevServices => 
        prevServices.map(service => ({
          ...service,
          latency: Math.floor(Math.random() * 200) + 20,
          status: Math.random() > 0.9 
            ? 'degraded' 
            : Math.random() > 0.95 
              ? 'offline' 
              : 'online',
          lastChecked: new Date()
        }))
      );
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-6">
            <Shield className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium">Acesso Restrito</h3>
            <p className="text-muted-foreground text-center mt-2">
              É necessário autenticar-se para acessar o API Gateway
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Estatísticas gerais para o dashboard
  const onlineCount = services.filter(s => s.status === 'online').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;
  const offlineCount = services.filter(s => s.status === 'offline').length;
  const averageLatency = services.reduce((acc, s) => acc + s.latency, 0) / services.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">API Gateway</h2>
        <p className="text-muted-foreground">
          Ponto central de acesso para os microserviços do CabriProtege
        </p>
      </div>

      {/* Dashboard estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Serviços Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{onlineCount}/{services.length}</div>
              <Badge className="ml-2 bg-green-500">{Math.round(onlineCount / services.length * 100)}%</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Serviços Degradados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{degradedCount}</div>
              {degradedCount > 0 && (
                <Badge className="ml-2 bg-yellow-500">Atenção</Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Serviços Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{offlineCount}</div>
              {offlineCount > 0 && (
                <Badge className="ml-2 bg-red-500">Crítico</Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latência Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{Math.round(averageLatency)}ms</div>
              {averageLatency > 150 ? (
                <Badge className="ml-2 bg-red-500">Alto</Badge>
              ) : averageLatency > 80 ? (
                <Badge className="ml-2 bg-yellow-500">Médio</Badge>
              ) : (
                <Badge className="ml-2 bg-green-500">Bom</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de serviços */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Registrados</CardTitle>
          <CardDescription>
            Status e informações dos microserviços disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg"
              >
                <div className="space-y-1 mb-2 md:mb-0">
                  <div className="flex items-center">
                    <h4 className="font-medium">{service.name}</h4>
                    {service.status === 'online' && (
                      <Badge className="ml-2 bg-green-500">Online</Badge>
                    )}
                    {service.status === 'degraded' && (
                      <Badge className="ml-2 bg-yellow-500">Degradado</Badge>
                    )}
                    {service.status === 'offline' && (
                      <Badge className="ml-2 bg-red-500">Offline</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Server className="h-3 w-3" /> {service.endpoint}
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" /> {service.latency}ms
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {service.lastChecked.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  Detalhes <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="text-xs text-muted-foreground">
            Última atualização: {new Date().toLocaleString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiGateway;
