import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, FileText, AlertTriangle, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
const ClientDashboard = () => {
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link to="/processos/novo">Novo Recurso</Link>
          </Button>
          <Button asChild>
            <Link to="/veiculos/novo">Adicionar Veículo</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Veículos registrados no sistema
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Processos em andamento
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos na CNH</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7/40</div>
            <Progress value={7 * 2.5} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              17.5% da pontuação máxima
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24/04</div>
            <p className="text-xs text-muted-foreground">
              Em 4 dias às 14:30
            </p>
          </CardContent>
        </Card>
      </div>

      <Alert className="bg-orange-50 border-cabricop-orange">
        <AlertTriangle className="h-5 w-5 text-cabricop-orange" />
        <AlertTitle className="text-cabricop-orange">Atenção</AlertTitle>
        <AlertDescription>
          Nova multa detectada para o veículo ABC-1234. Clique aqui para visualizar detalhes e iniciar um recurso.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="processes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="processes">Processos Recentes</TabsTrigger>
          <TabsTrigger value="deadlines">Prazos Importantes</TabsTrigger>
          <TabsTrigger value="vehicles">Meus Veículos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="processes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processos em Andamento</CardTitle>
              <CardDescription>
                Acompanhe o status dos seus processos ativos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Processo #12345</p>
                    <p className="text-sm text-muted-foreground">
                      Recurso de multa - Excesso de velocidade
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Status: <span className="text-orange-500">Em análise</span></p>
                    <p className="text-xs text-muted-foreground">Última atualização: 18/04/2025</p>
                  </div>
                </div>
                <Progress value={50} className="h-2 mt-2" />
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Processo #12346</p>
                    <p className="text-sm text-muted-foreground">
                      Recurso de multa - Estacionamento irregular
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Status: <span className="text-green-500">Deferido</span></p>
                    <p className="text-xs text-muted-foreground">Última atualização: 15/04/2025</p>
                  </div>
                </div>
                <Progress value={100} className="h-2 mt-2" />
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Processo #12347</p>
                    <p className="text-sm text-muted-foreground">
                      Recurso de multa - Avançar sinal vermelho
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Status: <span className="text-blue-500">Documentação pendente</span></p>
                    <p className="text-xs text-muted-foreground">Última atualização: 17/04/2025</p>
                  </div>
                </div>
                <Progress value={30} className="h-2 mt-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prazos Importantes</CardTitle>
              <CardDescription>
                Fique atento aos prazos dos seus processos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Enviar documentos adicionais</p>
                    <p className="text-sm text-muted-foreground">
                      Processo #12347 - Avançar sinal vermelho
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">2 dias restantes</p>
                    <p className="text-xs text-muted-foreground">Vence em: 22/04/2025</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Prazo para recurso de multa</p>
                    <p className="text-sm text-muted-foreground">
                      Veículo XYZ-5678 - Estacionamento proibido
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-orange-600">7 dias restantes</p>
                    <p className="text-xs text-muted-foreground">Vence em: 27/04/2025</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Renovação de CNH</p>
                    <p className="text-sm text-muted-foreground">
                      Agendamento no Detran
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">30 dias restantes</p>
                    <p className="text-xs text-muted-foreground">Vence em: 20/05/2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meus Veículos</CardTitle>
              <CardDescription>
                Informações sobre os veículos registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Car className="h-6 w-6 text-cabricop-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">ABC-1234</p>
                      <span className="rounded-full bg-cabricop-blue px-2 py-0.5 text-xs text-white">
                        Particular
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Honda Civic 2022 - Categoria B
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">2 multas ativas</p>
                    <Link to="/veiculos/1" className="text-xs text-cabricop-blue hover:underline">
                      Ver detalhes
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Car className="h-6 w-6 text-cabricop-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">XYZ-5678</p>
                      <span className="rounded-full bg-cabricop-orange px-2 py-0.5 text-xs text-white">
                        Profissional
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Toyota Corolla 2023 - Categoria B (Uber)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">1 multa ativa</p>
                    <Link to="/veiculos/2" className="text-xs text-cabricop-blue hover:underline">
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/veiculos/novo">
                  Adicionar Novo Veículo
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default ClientDashboard;