
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, AlertCircle, AlertTriangle, RefreshCw, Download } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  service: string;
  message: string;
  details?: string;
}

// Mock de logs para demonstração
const MOCK_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(),
    level: 'info',
    service: 'API Gateway',
    message: 'Gateway inicializado com sucesso',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 60000),
    level: 'info',
    service: 'Serviço de Usuários',
    message: 'Sincronização de dados de usuário concluída',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 120000),
    level: 'warning',
    service: 'Serviço de Multas',
    message: 'Latência elevada detectada',
    details: 'A latência média está acima de 150ms. Verificando recursos do servidor.'
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 300000),
    level: 'error',
    service: 'Serviço de Pagamentos',
    message: 'Falha na conexão com gateway de pagamento',
    details: 'Timeout na conexão com API externa. Tentativas: 3/3.'
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 400000),
    level: 'info',
    service: 'Serviço de Notificação',
    message: 'Lote de notificações processado',
  },
];

const GatewayLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS);
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all');
  
  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);

  const refreshLogs = () => {
    // Em um sistema real, aqui buscaríamos logs atualizados
    // Para demonstração, apenas reordenamos os existentes
    setLogs([...logs].sort(() => Math.random() - 0.5));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Logs do Gateway</CardTitle>
          <CardDescription>Monitoramento de eventos e logs do sistema</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all" onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              <SelectItem value="info">Informação</SelectItem>
              <SelectItem value="warning">Alerta</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={refreshLogs}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Nenhum log encontrado com os filtros selecionados
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {log.level === 'info' && <Info className="text-blue-500 h-5 w-5" />}
                    {log.level === 'warning' && <AlertTriangle className="text-yellow-500 h-5 w-5" />}
                    {log.level === 'error' && <AlertCircle className="text-red-500 h-5 w-5" />}
                    <span className="font-medium">{log.service}</span>
                    <Badge className={
                      log.level === 'info'
                        ? 'bg-blue-500'
                        : log.level === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }>
                      {log.level.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {log.timestamp.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm mb-1">{log.message}</p>
                {log.details && (
                  <div className="mt-2 text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {log.details}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GatewayLogs;
