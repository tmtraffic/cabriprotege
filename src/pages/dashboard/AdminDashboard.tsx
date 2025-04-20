
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Users, 
  Car, 
  FileText, 
  AlertTriangle, 
  Settings, 
  BarChart2, 
  Database,
  ShieldCheck,
  ActivitySquare
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/relatorios">Relatórios</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/usuarios/novo">Novo Usuário</Link>
          </Button>
          <Button asChild>
            <Link to="/configuracoes">Configurações</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">243</div>
            <p className="text-xs text-muted-foreground">
              +18 no último mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">
              +32 no último mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <Progress value={78} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              +3% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              2 em férias
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Desempenho do Sistema</CardTitle>
            <CardDescription>
              Visão geral da atividade do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Tempo de Resposta</p>
                  <p className="text-xs text-muted-foreground">Média últimas 24h</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">1.2s</p>
                </div>
              </div>
              <Progress value={80} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Uso de CPU</p>
                  <p className="text-xs text-muted-foreground">Média últimas 24h</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">42%</p>
                </div>
              </div>
              <Progress value={42} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Uso de Memória</p>
                  <p className="text-xs text-muted-foreground">Atual</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">3.4GB/8GB</p>
                </div>
              </div>
              <Progress value={43} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Espaço em Disco</p>
                  <p className="text-xs text-muted-foreground">Armazenamento</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">348GB/1TB</p>
                </div>
              </div>
              <Progress value={35} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Atividade do Sistema</CardTitle>
            <CardDescription>
              Eventos recentes do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3 bg-green-50">
                <div className="flex items-center gap-2">
                  <ActivitySquare className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Backup Concluído</p>
                    <p className="text-xs text-muted-foreground">
                      Backup diário completo com sucesso
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">05:00</p>
                </div>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <ActivitySquare className="h-5 w-5 text-cabricop-blue" />
                  <div className="flex-1">
                    <p className="font-medium">Verificação Detran</p>
                    <p className="text-xs text-muted-foreground">
                      Verificação de multas concluída para 243 veículos
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">03:15</p>
                </div>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <ActivitySquare className="h-5 w-5 text-cabricop-blue" />
                  <div className="flex-1">
                    <p className="font-medium">Atualização de Status</p>
                    <p className="text-xs text-muted-foreground">
                      37 processos tiveram status atualizado
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">02:30</p>
                </div>
              </div>
              
              <div className="rounded-lg border p-3 bg-orange-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="font-medium">Alerta de Segurança</p>
                    <p className="text-xs text-muted-foreground">
                      Tentativas de login suspeitas detectadas
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">01:45</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Processos</CardTitle>
              <CardDescription>
                Distribuição de processos por tipo e status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Recursos de Multas</p>
                  <p className="text-sm font-bold">145 (78%)</p>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Suspensão de CNH</p>
                  <p className="text-sm font-bold">24 (13%)</p>
                </div>
                <Progress value={13} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Cassação de CNH</p>
                  <p className="text-sm font-bold">8 (4%)</p>
                </div>
                <Progress value={4} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Outros</p>
                  <p className="text-sm font-bold">10 (5%)</p>
                </div>
                <Progress value={5} className="h-2" />
              </div>
              
              <div className="pt-4 border-t mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Deferidos</p>
                  <p className="text-sm font-bold text-green-600">142 (76%)</p>
                </div>
                <Progress value={76} className="h-2 bg-muted-foreground/20">
                  <div className="h-full bg-green-600 rounded-full" />
                </Progress>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Em Análise</p>
                  <p className="text-sm font-bold text-orange-500">28 (15%)</p>
                </div>
                <Progress value={15} className="h-2 bg-muted-foreground/20">
                  <div className="h-full bg-orange-500 rounded-full" />
                </Progress>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Indeferidos</p>
                  <p className="text-sm font-bold text-red-600">17 (9%)</p>
                </div>
                <Progress value={9} className="h-2 bg-muted-foreground/20">
                  <div className="h-full bg-red-600 rounded-full" />
                </Progress>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários do Sistema</CardTitle>
              <CardDescription>
                Visão geral dos usuários por perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cabricop-blue">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Administradores</p>
                        <p className="text-xs text-muted-foreground">
                          Acesso completo ao sistema
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">3</p>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/usuarios?role=admin">Gerenciar</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cabricop-orange">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Funcionários</p>
                        <p className="text-xs text-muted-foreground">
                          Acesso à gestão de clientes e processos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">12</p>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/usuarios?role=employee">Gerenciar</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Clientes</p>
                        <p className="text-xs text-muted-foreground">
                          Acesso limitado aos próprios dados
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">243</p>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/usuarios?role=client">Gerenciar</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" asChild>
                  <Link to="/usuarios/novo">
                    Adicionar Novo Usuário
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status das Integrações</CardTitle>
              <CardDescription>
                Estado atual das conexões com serviços externos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Database className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">API Detran RJ</p>
                      <p className="text-xs text-muted-foreground">
                        Verificação de multas e status de CNH
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm font-medium">Operacional</p>
                    </div>
                    <Button size="sm" variant="outline">Configurar</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Settings className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">N8N Workflow</p>
                      <p className="text-xs text-muted-foreground">
                        Automação de processos e notificações
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm font-medium">Operacional</p>
                    </div>
                    <Button size="sm" variant="outline">Configurar</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                      <Settings className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Evolution API (WhatsApp)</p>
                      <p className="text-xs text-muted-foreground">
                        Envio de notificações por WhatsApp
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-orange-500 mr-2"></div>
                      <p className="text-sm font-medium">Degradado</p>
                    </div>
                    <Button size="sm" variant="outline">Configurar</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                      <Settings className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Gateway de Pagamento</p>
                      <p className="text-xs text-muted-foreground">
                        Processamento de pagamentos de multas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                      <p className="text-sm font-medium">Offline</p>
                    </div>
                    <Button size="sm" variant="outline">Configurar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
