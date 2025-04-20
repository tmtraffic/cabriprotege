
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  User, 
  Car, 
  Search,
  Filter,
  Mail,
  Printer
} from "lucide-react";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: "2025-04-01",
    end: "2025-04-30"
  });
  
  const { toast } = useToast();
  
  const handleGenerateReport = () => {
    toast({
      title: "Gerando relatório",
      description: "Seu relatório está sendo gerado e estará disponível em instantes."
    });
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    setDateRange({
      ...dateRange,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Geração de relatórios e análise de dados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border rounded-md p-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2 items-center">
              <Input 
                type="date" 
                className="w-auto border-0 p-0 h-auto" 
                value={dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
              />
              <span className="text-sm text-muted-foreground">até</span>
              <Input 
                type="date" 
                className="w-auto border-0 p-0 h-auto" 
                value={dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 h-auto">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="processes">Processos</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Total de Processos</CardTitle>
                <CardDescription>Abril 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">187</div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <TrendingUp className="text-green-500 h-4 w-4 mr-1" />
                  <span className="text-green-500 font-medium">+12.5%</span>
                  <span className="ml-1">vs. mês anterior</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Taxa de Sucesso</CardTitle>
                <CardDescription>Abril 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <TrendingUp className="text-green-500 h-4 w-4 mr-1" />
                  <span className="text-green-500 font-medium">+3%</span>
                  <span className="ml-1">vs. mês anterior</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Novos Clientes</CardTitle>
                <CardDescription>Abril 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <TrendingUp className="text-green-500 h-4 w-4 mr-1" />
                  <span className="text-green-500 font-medium">+8.2%</span>
                  <span className="ml-1">vs. mês anterior</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição de Processos</CardTitle>
                <CardDescription>Por tipo de infração</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="mx-auto h-40 w-40 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">Gráfico de distribuição de processos</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Tendência de Processos</CardTitle>
                <CardDescription>Últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <BarChart2 className="mx-auto h-40 w-40 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">Gráfico de tendência de processos</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Desempenho</CardTitle>
              <CardDescription>Visão geral dos principais indicadores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Taxa de Conversão de Leads</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">36.5%</p>
                      <span className="text-green-500 text-sm font-medium">+2.1%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{width: '36.5%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tempo Médio de Resolução</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">18 dias</p>
                      <span className="text-green-500 text-sm font-medium">-2 dias</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
                      <div className="bg-cabricop-blue h-full rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Satisfação do Cliente</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">4.8/5.0</p>
                      <span className="text-green-500 text-sm font-medium">+0.2</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
                      <div className="bg-cabricop-orange h-full rounded-full" style={{width: '96%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Ticket Médio</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">R$ 235,00</p>
                      <span className="text-green-500 text-sm font-medium">+R$ 15,00</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">Dados de 01/04/2025 até 30/04/2025</p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="processes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Relatório de Processos</CardTitle>
                  <CardDescription>Análise detalhada de processos</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Buscar processo..." 
                    className="w-full md:w-[250px]"
                    startIcon={<Search className="h-4 w-4" />}
                  />
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Novos</div>
                      <div className="text-xl font-bold">32</div>
                      <div className="text-xs text-muted-foreground">17% do total</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Em Andamento</div>
                      <div className="text-xl font-bold">87</div>
                      <div className="text-xs text-muted-foreground">47% do total</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Deferidos</div>
                      <div className="text-xl font-bold">56</div>
                      <div className="text-xs text-muted-foreground">30% do total</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Indeferidos</div>
                      <div className="text-xl font-bold">12</div>
                      <div className="text-xs text-muted-foreground">6% do total</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Tipo de Processo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Taxa de Sucesso
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Tempo Médio
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Detalhes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">Excesso de Velocidade</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">78</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-600 font-medium">82%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">15 dias</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm">Ver</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">Estacionamento Irregular</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">45</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-600 font-medium">75%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">12 dias</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm">Ver</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">Avanço de Sinal</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">34</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-amber-600 font-medium">68%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">18 dias</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm">Ver</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">Suspensão de CNH</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">18</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-amber-600 font-medium">61%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">28 dias</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm">Ver</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">Outros</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">12</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-red-600 font-medium">58%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">21 dias</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm">Ver</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Total de 187 processos no período selecionado
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar por Email
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Relatório de Clientes</CardTitle>
                  <CardDescription>Dados e estatísticas de clientes</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Buscar cliente..." 
                    className="w-full md:w-[250px]"
                    startIcon={<Search className="h-4 w-4" />}
                  />
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Total de Clientes</div>
                          <div className="text-xl font-bold">243</div>
                        </div>
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Clientes Ativos</div>
                          <div className="text-xl font-bold">187</div>
                        </div>
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Novos Clientes</div>
                          <div className="text-xl font-bold">24</div>
                        </div>
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Distribuição de Clientes por Tipo</h3>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-cabricop-blue rounded"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Particulares</span>
                          <span className="text-sm font-medium">158 (65%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                          <div className="bg-cabricop-blue h-full rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-cabricop-orange rounded"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Motoristas de Aplicativo</span>
                          <span className="text-sm font-medium">48 (20%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                          <div className="bg-cabricop-orange h-full rounded-full" style={{width: '20%'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Taxistas</span>
                          <span className="text-sm font-medium">24 (10%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{width: '10%'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Empresas</span>
                          <span className="text-sm font-medium">13 (5%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{width: '5%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Veículos por Cliente</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Categoria de Cliente
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Total de Clientes
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Total de Veículos
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Média de Veículos
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-border">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">Particulares</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">158</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">184</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">1.2</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">Motoristas de Aplicativo</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">48</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">52</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">1.1</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">Taxistas</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">24</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">26</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">1.1</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">Empresas</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">13</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">87</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">6.7</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Dados atualizados em 20/04/2025
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Relatório Financeiro</CardTitle>
                  <CardDescription>Análise financeira do período</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Receita Total</div>
                      <div className="text-xl font-bold">R$ 48.750,00</div>
                      <div className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12% vs. mês anterior
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Ticket Médio</div>
                      <div className="text-xl font-bold">R$ 235,00</div>
                      <div className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5% vs. mês anterior
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Processos Pagos</div>
                      <div className="text-xl font-bold">207</div>
                      <div className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +15% vs. mês anterior
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Receita por Tipo de Processo</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Tipo de Processo
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Quantidade
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Valor Médio
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Receita Total
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            % da Receita
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-border">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">Excesso de Velocidade</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">82</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">R$ 180,00</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">R$ 14.760,00</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">30.3%</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">Estacionamento Irregular</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">48</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">R$ 120,00</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">R$ 5.760,00</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">11.8%</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">Avanço de Sinal</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">36</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">R$ 220,00</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">R$ 7.920,00</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">16.2%</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">Suspensão de CNH</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">21</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">R$ 850,00</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">R$ 17.850,00</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">36.6%</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">Outros</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">20</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">R$ 123,00</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">R$ 2.460,00</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">5.1%</div>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-muted/20">
                        <tr>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="text-sm font-bold">Total</div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="text-sm font-bold">207</div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="text-sm font-bold">R$ 235,00</div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="text-sm font-bold">R$ 48.750,00</div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="text-sm font-bold">100%</div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Período: 01/04/2025 a 20/04/2025
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Gerar Relatório Personalizado</CardTitle>
          <CardDescription>
            Crie um relatório com os dados e parâmetros específicos que você precisa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Tipo de Relatório</Label>
              <select
                id="report-type"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="processes">Relatório de Processos</option>
                <option value="clients">Relatório de Clientes</option>
                <option value="financial">Relatório Financeiro</option>
                <option value="performance">Relatório de Desempenho</option>
                <option value="custom">Relatório Personalizado</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="report-format">Formato de Saída</Label>
              <select
                id="report-format"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start-date">Data Inicial</Label>
              <Input id="start-date" type="date" value={dateRange.start} onChange={(e) => handleDateChange('start', e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">Data Final</Label>
              <Input id="end-date" type="date" value={dateRange.end} onChange={(e) => handleDateChange('end', e.target.value)} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additional-filters">Filtros Adicionais</Label>
            <Input id="additional-filters" placeholder="Ex: Tipo=Excesso de Velocidade, Status=Concluído" />
            <p className="text-xs text-muted-foreground">
              Separe múltiplos filtros por vírgula. Use o formato Chave=Valor.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="include-charts"
              className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
              defaultChecked
            />
            <Label htmlFor="include-charts" className="font-normal">Incluir gráficos e visualizações</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline">
            Salvar Modelo
          </Button>
          <Button onClick={handleGenerateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Reports;
