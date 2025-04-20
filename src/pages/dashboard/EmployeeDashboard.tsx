
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Car, FileText, AlertTriangle, Calendar, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";

const EmployeeDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Funcionário</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link to="/processos/novo">Novo Processo</Link>
          </Button>
          <Button asChild>
            <Link to="/clientes/novo">Novo Cliente</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              +4 novos esta semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">37</div>
            <p className="text-xs text-muted-foreground">
              12 aguardando ação
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novas Multas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prazos Críticos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Vencem em 3 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Localizar Cliente</CardTitle>
            <CardDescription>
              Busque clientes por nome, CPF ou placa do veículo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Nome, CPF ou placa do veículo"
                className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm">Pesquisas recentes:</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">João Silva</Button>
                <Button variant="outline" size="sm">ABC-1234</Button>
                <Button variant="outline" size="sm">123.456.789-00</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Agenda do Dia</CardTitle>
            <CardDescription>
              Compromissos e tarefas para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Calendar className="h-5 w-5 text-cabricop-blue" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Reunião com Cliente</p>
                  <p className="text-sm text-muted-foreground">
                    Maria Oliveira - 14:30
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <Clock className="h-5 w-5 text-cabricop-orange" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Prazo: Envio de Documentos</p>
                  <p className="text-sm text-muted-foreground">
                    Processo #34567 - 17:00
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Elaboração de Recurso</p>
                  <p className="text-sm text-muted-foreground">
                    Carlos Mendes - Avançar sinal vermelho
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Ações Pendentes</TabsTrigger>
          <TabsTrigger value="recent">Processsos Recentes</TabsTrigger>
          <TabsTrigger value="newClients">Novos Clientes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ações Pendentes</CardTitle>
              <CardDescription>
                Tarefas que exigem sua atenção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3 bg-orange-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Revisar Documentação</p>
                    <p className="text-sm text-muted-foreground">
                      Processo #12345 - João Silva
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Prioridade: <span className="text-red-500 font-bold">Alta</span></p>
                    <p className="text-xs text-muted-foreground">Vence em: 1 dia</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm">Ver Detalhes</Button>
                  <Button size="sm" variant="outline">Concluir</Button>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Preparar Recurso</p>
                    <p className="text-sm text-muted-foreground">
                      Processo #12346 - Maria Oliveira
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Prioridade: <span className="text-orange-500 font-semibold">Média</span></p>
                    <p className="text-xs text-muted-foreground">Vence em: 3 dias</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm">Ver Detalhes</Button>
                  <Button size="sm" variant="outline">Concluir</Button>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Contatar Cliente</p>
                    <p className="text-sm text-muted-foreground">
                      Carlos Mendes - Documentação adicional
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Prioridade: <span className="text-green-500">Baixa</span></p>
                    <p className="text-xs text-muted-foreground">Vence em: 5 dias</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm">Ver Detalhes</Button>
                  <Button size="sm" variant="outline">Concluir</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processos Recentes</CardTitle>
              <CardDescription>
                Processos atualizados nos últimos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Processo #23456</p>
                    <p className="text-sm text-muted-foreground">
                      Paulo Souza - Excesso de velocidade
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Status: <span className="text-green-500">Deferido</span></p>
                    <p className="text-xs text-muted-foreground">Atualizado em: 19/04/2025</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Processo #23457</p>
                    <p className="text-sm text-muted-foreground">
                      Ana Santos - Estacionamento irregular
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Status: <span className="text-orange-500">Em análise</span></p>
                    <p className="text-xs text-muted-foreground">Atualizado em: 18/04/2025</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Processo #23458</p>
                    <p className="text-sm text-muted-foreground">
                      Roberto Lima - Avançar sinal vermelho
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Status: <span className="text-red-500">Indeferido</span></p>
                    <p className="text-xs text-muted-foreground">Atualizado em: 17/04/2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="newClients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Novos Clientes</CardTitle>
              <CardDescription>
                Clientes adicionados nos últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <User className="h-6 w-6 text-cabricop-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Lucas Ferreira</p>
                      <span className="rounded-full bg-cabricop-blue px-2 py-0.5 text-xs text-white">
                        Motorista Uber
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cadastrado em: 19/04/2025 - 2 veículos
                    </p>
                  </div>
                  <div className="text-right">
                    <Button size="sm" variant="outline">Ver Perfil</Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <User className="h-6 w-6 text-cabricop-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Mariana Costa</p>
                      <span className="rounded-full bg-cabricop-orange px-2 py-0.5 text-xs text-white">
                        Particular
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cadastrado em: 17/04/2025 - 1 veículo
                    </p>
                  </div>
                  <div className="text-right">
                    <Button size="sm" variant="outline">Ver Perfil</Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <User className="h-6 w-6 text-cabricop-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Felipe Rodrigues</p>
                      <span className="rounded-full bg-purple-500 px-2 py-0.5 text-xs text-white">
                        Motorista Táxi
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cadastrado em: 15/04/2025 - 1 veículo
                    </p>
                  </div>
                  <div className="text-right">
                    <Button size="sm" variant="outline">Ver Perfil</Button>
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

export default EmployeeDashboard;
