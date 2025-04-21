
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Database, 
  Search, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle, 
  Shield, 
  FileText,
  HardDrive,
  Server,
  Filter
} from "lucide-react";

// Mock data for demonstration
const mockTables = [
  { name: "users", rows: 243, size: "1.2 MB", lastUpdated: "2025-04-19 14:30", backupStatus: "success" },
  { name: "clients", rows: 243, size: "2.4 MB", lastUpdated: "2025-04-19 12:15", backupStatus: "success" },
  { name: "vehicles", rows: 389, size: "3.1 MB", lastUpdated: "2025-04-19 10:45", backupStatus: "success" },
  { name: "processes", rows: 187, size: "5.7 MB", lastUpdated: "2025-04-19 15:20", backupStatus: "success" },
  { name: "documents", rows: 412, size: "15.3 MB", lastUpdated: "2025-04-19 11:10", backupStatus: "success" },
  { name: "infractions", rows: 756, size: "4.2 MB", lastUpdated: "2025-04-19 09:30", backupStatus: "success" },
  { name: "notifications", rows: 1245, size: "3.8 MB", lastUpdated: "2025-04-19 16:45", backupStatus: "pending" },
  { name: "schedules", rows: 156, size: "1.5 MB", lastUpdated: "2025-04-19 13:20", backupStatus: "success" },
];

const mockLogs = [
  { timestamp: "2025-04-20 16:45:23", level: "info", message: "Backup diário concluído com sucesso", source: "backup-system" },
  { timestamp: "2025-04-20 15:30:12", level: "warning", message: "Espaço em disco abaixo de 20%", source: "system-monitor" },
  { timestamp: "2025-04-20 14:12:37", level: "info", message: "Verificação de integridade completada", source: "db-checker" },
  { timestamp: "2025-04-20 13:05:19", level: "error", message: "Falha na sincronização com API externa", source: "api-sync" },
  { timestamp: "2025-04-20 12:45:02", level: "info", message: "Nova tabela criada: 'payment_history'", source: "db-migration" },
  { timestamp: "2025-04-20 11:30:45", level: "info", message: "Índices otimizados com sucesso", source: "db-maintenance" },
  { timestamp: "2025-04-20 10:15:33", level: "warning", message: "Consulta lenta detectada (> 5s): SELECT * FROM documents", source: "query-monitor" },
  { timestamp: "2025-04-20 09:20:11", level: "info", message: "Backup manual iniciado pelo usuário admin@cabricop.com.br", source: "backup-system" },
];

const DatabaseManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [logFilter, setLogFilter] = useState("all");
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState<null | { columns: string[], rows: any[] }>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredTables = searchQuery 
    ? mockTables.filter(table => table.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockTables;

  const filteredLogs = logFilter === "all" 
    ? mockLogs 
    : mockLogs.filter(log => log.level === logFilter);

  const handleExecuteQuery = () => {
    if (!sqlQuery.trim()) {
      return;
    }

    setIsLoading(true);
    
    // Mock query execution - in a real app, this would call a backend API
    setTimeout(() => {
      // Mock response - this would be the actual result from your database
      if (sqlQuery.toLowerCase().includes("select") || sqlQuery.toLowerCase().includes("show")) {
        setQueryResult({
          columns: ["id", "name", "created_at"],
          rows: [
            { id: 1, name: "Example Row 1", created_at: "2025-04-15 10:30:00" },
            { id: 2, name: "Example Row 2", created_at: "2025-04-16 14:45:00" },
            { id: 3, name: "Example Row 3", created_at: "2025-04-17 09:15:00" },
          ]
        });
      } else {
        setQueryResult({
          columns: ["result"],
          rows: [{ result: "Query executed successfully. Affected rows: 3" }]
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Dados</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Dados
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importar Dados
          </Button>
          <Button className="gap-2">
            <Database className="h-4 w-4" />
            Backup Completo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tabelas</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTables.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 na última semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamanho do Banco</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">37.2 MB</div>
            <p className="text-xs text-muted-foreground">
              +3.5 MB no último mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Backup</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4h atrás</div>
            <p className="text-xs text-muted-foreground">
              Status: Completo
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Espaço Disponível</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18%</div>
            <Progress value={18} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Recomendado: min. 15%
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isQueryModalOpen} onOpenChange={setIsQueryModalOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 w-full">
            <FileText className="h-4 w-4" />
            Executar Consulta SQL
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[80%] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Consulta SQL</DialogTitle>
            <DialogDescription>
              Execute consultas SQL diretamente no banco de dados. Cuidado com operações que modificam dados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sql-query">Sua consulta SQL:</Label>
              <Textarea
                id="sql-query"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="font-mono min-h-[100px]"
                placeholder="SELECT * FROM users LIMIT 10;"
              />
            </div>
            
            {queryResult && (
              <div className="space-y-2 border rounded-md p-4">
                <h3 className="font-medium">Resultado:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        {queryResult.columns.map((column, index) => (
                          <th key={index} className="border px-4 py-2 text-left">{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                          {queryResult.columns.map((column, colIndex) => (
                            <td key={colIndex} className="border px-4 py-2">
                              {row[column]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Mostrando {queryResult.rows.length} resultados.
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex sm:justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Use com cuidado! As operações são executadas em tempo real.
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsQueryModalOpen(false)}>
                Fechar
              </Button>
              <Button onClick={handleExecuteQuery} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Executando...
                  </>
                ) : (
                  "Executar Query"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Tabelas</TabsTrigger>
          <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle>Estrutura do Banco de Dados</CardTitle>
              <CardDescription>
                Visão geral das tabelas e seus estados
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar tabela..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTables.length === 0 ? (
                  <div className="text-center py-10">
                    <Database className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Nenhuma tabela encontrada</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Não há tabelas correspondentes à sua busca.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Nome da Tabela</th>
                          <th className="text-left py-3 px-4">Registros</th>
                          <th className="text-left py-3 px-4">Tamanho</th>
                          <th className="text-left py-3 px-4">Última Atualização</th>
                          <th className="text-left py-3 px-4">Status Backup</th>
                          <th className="text-left py-3 px-4">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTables.map((table) => (
                          <tr key={table.name} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <span className="font-medium">{table.name}</span>
                            </td>
                            <td className="py-3 px-4">{table.rows.toLocaleString()}</td>
                            <td className="py-3 px-4">{table.size}</td>
                            <td className="py-3 px-4">{table.lastUpdated}</td>
                            <td className="py-3 px-4">
                              <Badge variant={table.backupStatus === "success" ? "default" : "secondary"}>
                                {table.backupStatus === "success" ? "OK" : "Pendente"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Ver</Button>
                                <Button variant="outline" size="sm">Backup</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs do Sistema</CardTitle>
              <CardDescription>
                Registro de atividades e eventos do banco de dados
              </CardDescription>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <Button 
                    variant={logFilter === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setLogFilter("all")}
                  >
                    Todos
                  </Button>
                  <Button 
                    variant={logFilter === "info" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setLogFilter("info")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Info
                  </Button>
                  <Button 
                    variant={logFilter === "warning" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setLogFilter("warning")}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Avisos
                  </Button>
                  <Button 
                    variant={logFilter === "error" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setLogFilter("error")}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Erros
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Baixar Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-10">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Nenhum log encontrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Não há logs correspondentes ao filtro selecionado.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredLogs.map((log, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        log.level === "error" 
                          ? "bg-red-50 border-red-200" 
                          : log.level === "warning"
                            ? "bg-orange-50 border-orange-200"
                            : "bg-white border"
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {log.level === "error" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            {log.level === "warning" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                            {log.level === "info" && <FileText className="h-4 w-4 text-blue-600" />}
                            <span className="font-medium">{log.timestamp}</span>
                          </div>
                          <Badge variant="outline">{log.source}</Badge>
                        </div>
                        <p className={`mt-1 ${
                          log.level === "error" 
                            ? "text-red-800" 
                            : log.level === "warning"
                              ? "text-orange-800"
                              : "text-gray-800"
                        }`}>
                          {log.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backups">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Backups</CardTitle>
              <CardDescription>
                Visão geral e controle dos backups do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Status do Backup</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Último backup completo</span>
                        <span className="text-sm">4 horas atrás (06:00 AM)</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Próximo backup programado</span>
                        <span className="text-sm">em 20 horas (06:00 AM amanhã)</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-green-800">Todos os backups estão atualizados</p>
                        <p className="text-sm text-green-700">Total de 5 backups no histórico</p>
                      </div>
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Histórico de Backups</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Data</th>
                          <th className="text-left py-3 px-4">Tamanho</th>
                          <th className="text-left py-3 px-4">Tipo</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">2025-04-20 06:00</td>
                          <td className="py-3 px-4">37.2 MB</td>
                          <td className="py-3 px-4">Completo</td>
                          <td className="py-3 px-4">
                            <Badge>Concluído</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Restaurar</Button>
                              <Button variant="outline" size="sm">Download</Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">2025-04-19 06:00</td>
                          <td className="py-3 px-4">37.0 MB</td>
                          <td className="py-3 px-4">Completo</td>
                          <td className="py-3 px-4">
                            <Badge>Concluído</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Restaurar</Button>
                              <Button variant="outline" size="sm">Download</Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">2025-04-18 06:00</td>
                          <td className="py-3 px-4">36.8 MB</td>
                          <td className="py-3 px-4">Completo</td>
                          <td className="py-3 px-4">
                            <Badge>Concluído</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Restaurar</Button>
                              <Button variant="outline" size="sm">Download</Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">2025-04-17 06:00</td>
                          <td className="py-3 px-4">36.5 MB</td>
                          <td className="py-3 px-4">Completo</td>
                          <td className="py-3 px-4">
                            <Badge>Concluído</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Restaurar</Button>
                              <Button variant="outline" size="sm">Download</Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">2025-04-16 06:00</td>
                          <td className="py-3 px-4">36.2 MB</td>
                          <td className="py-3 px-4">Completo</td>
                          <td className="py-3 px-4">
                            <Badge>Concluído</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Restaurar</Button>
                              <Button variant="outline" size="sm">Download</Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Backup Manual</CardTitle>
                      <CardDescription>
                        Crie um backup completo a qualquer momento
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full gap-2">
                        <Database className="h-4 w-4" />
                        Iniciar Backup Manual
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações de Backup</CardTitle>
                      <CardDescription>
                        Ajuste as preferências para backups automáticos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Editar Configurações
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseManagement;

