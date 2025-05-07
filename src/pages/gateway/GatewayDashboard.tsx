
import React from 'react';
import ApiGateway, { ServiceRoute } from '@/gateway/ApiGateway';
import RouteManager from '@/gateway/RouteManager';
import GatewayLogs from '@/gateway/GatewayLogs';

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

const GatewayDashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-1">API Gateway</h1>
        <p className="text-muted-foreground">
          Ponto central para gerenciamento e comunicação entre microserviços.
        </p>
      </div>
      
      {/* Status dos serviços */}
      <div>
        <ApiGateway />
      </div>
      
      {/* Gerenciamento de rotas */}
      <div>
        <RouteManager initialRoutes={MOCK_SERVICES} />
      </div>
      
      {/* Logs do gateway */}
      <div>
        <GatewayLogs />
      </div>
    </div>
  );
};

export default GatewayDashboard;
