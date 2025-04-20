
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
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, SortAsc, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const ProcessManagement = () => {
  const { toast } = useToast();
  
  const handleCreateProcess = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de processos será implementada em breve."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Processos</h1>
          <p className="text-muted-foreground">
            Gerencie processos e recursos de multas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateProcess}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Card className="w-full md:w-1/4">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm font-medium">Status</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-all" 
                  className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  defaultChecked
                />
                <label htmlFor="status-all" className="ml-2 text-sm">Todos</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-new" 
                  className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                />
                <label htmlFor="status-new" className="ml-2 text-sm">Novos</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-in-progress" 
                  className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                />
                <label htmlFor="status-in-progress" className="ml-2 text-sm">Em Andamento</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-waiting" 
                  className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                />
                <label htmlFor="status-waiting" className="ml-2 text-sm">Aguardando</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-completed" 
                  className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                />
                <label htmlFor="status-completed" className="ml-2 text-sm">Concluídos</label>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium">Tipo de Infração</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="type-all" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                    defaultChecked
                  />
                  <label htmlFor="type-all" className="ml-2 text-sm">Todos</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="type-speed" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  />
                  <label htmlFor="type-speed" className="ml-2 text-sm">Excesso de Velocidade</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="type-parking" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  />
                  <label htmlFor="type-parking" className="ml-2 text-sm">Estacionamento</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="type-red-light" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  />
                  <label htmlFor="type-red-light" className="ml-2 text-sm">Semáforo/Sinal</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="type-license" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  />
                  <label htmlFor="type-license" className="ml-2 text-sm">Suspensão de CNH</label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium">Período</p>
              <div className="space-y-2 mt-2">
                <div className="space-y-1">
                  <label htmlFor="date-from" className="text-xs">De</label>
                  <input 
                    type="date" 
                    id="date-from" 
                    className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="date-to" className="text-xs">Até</label>
                  <input 
                    type="date" 
                    id="date-to" 
                    className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium">Atribuído a</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="assigned-all" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                    defaultChecked
                  />
                  <label htmlFor="assigned-all" className="ml-2 text-sm">Todos</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="assigned-me" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  />
                  <label htmlFor="assigned-me" className="ml-2 text-sm">Meus Processos</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="assigned-unassigned" 
                    className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                  />
                  <label htmlFor="assigned-unassigned" className="ml-2 text-sm">Não Atribuídos</label>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-4">
              <Filter className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex-1">
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Processos</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Buscar processo..."
                      className="pl-8 h-9 w-full md:w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <SortAsc className="h-4 w-4 mr-2" />
                    Ordenar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-cabricop-blue" />
                        <h3 className="font-medium">Processo #12345</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                          Em Andamento
                        </span>
                      </div>
                      <p className="text-sm mt-1">Cliente: João da Silva</p>
                      <p className="text-sm text-muted-foreground">Excesso de velocidade - Auto nº I41664643</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                      <div className="text-sm text-right">
                        <p>Prazo: <span className="font-semibold text-red-600">2 dias</span></p>
                        <p className="text-xs text-muted-foreground">Criado em: 15/04/2025</p>
                      </div>
                      <Button size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-cabricop-blue" />
                        <h3 className="font-medium">Processo #12346</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Aguardando Análise
                        </span>
                      </div>
                      <p className="text-sm mt-1">Cliente: Maria Oliveira</p>
                      <p className="text-sm text-muted-foreground">Estacionamento irregular - Auto nº E43789654</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                      <div className="text-sm text-right">
                        <p>Prazo: <span className="font-semibold">15 dias</span></p>
                        <p className="text-xs text-muted-foreground">Criado em: 12/04/2025</p>
                      </div>
                      <Button size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-cabricop-blue" />
                        <h3 className="font-medium">Processo #12347</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Deferido
                        </span>
                      </div>
                      <p className="text-sm mt-1">Cliente: Carlos Santos</p>
                      <p className="text-sm text-muted-foreground">Avanço de sinal vermelho - Auto nº B12398745</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                      <div className="text-sm text-right">
                        <p>Concluído: <CheckCircle className="inline h-3 w-3 text-green-600" /></p>
                        <p className="text-xs text-muted-foreground">Criado em: 05/04/2025</p>
                      </div>
                      <Button size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-cabricop-blue" />
                        <h3 className="font-medium">Processo #12348</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Indeferido
                        </span>
                      </div>
                      <p className="text-sm mt-1">Cliente: Ana Barbosa</p>
                      <p className="text-sm text-muted-foreground">Excesso de velocidade - Auto nº H35789256</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                      <div className="text-sm text-right">
                        <p>Concluído: <XCircle className="inline h-3 w-3 text-red-600" /></p>
                        <p className="text-xs text-muted-foreground">Criado em: 01/04/2025</p>
                      </div>
                      <Button size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-cabricop-blue" />
                        <h3 className="font-medium">Processo #12349</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Novo
                        </span>
                      </div>
                      <p className="text-sm mt-1">Cliente: Roberto Almeida</p>
                      <p className="text-sm text-muted-foreground">Suspensão de CNH - 20 pontos</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                      <div className="text-sm text-right">
                        <p>Prazo: <span className="font-semibold text-orange-600">5 dias</span></p>
                        <p className="text-xs text-muted-foreground">Criado em: 20/04/2025</p>
                      </div>
                      <Button size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Exibindo 5 de 24 processos
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                  1
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-muted">
                  2
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Próximo
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card className="w-full mt-4">
            <CardHeader>
              <CardTitle>Prazos Críticos</CardTitle>
              <CardDescription>
                Processos que necessitam de atenção imediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-lg bg-red-50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium">Processo #12345</p>
                      <p className="text-xs text-muted-foreground">João da Silva - Excesso de velocidade</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">Vence em 2 dias</p>
                    <p className="text-xs text-muted-foreground">22/04/2025</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-lg bg-orange-50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="font-medium">Processo #12349</p>
                      <p className="text-xs text-muted-foreground">Roberto Almeida - Suspensão de CNH</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-orange-600">Vence em 5 dias</p>
                    <p className="text-xs text-muted-foreground">25/04/2025</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Processo #12346</p>
                      <p className="text-xs text-muted-foreground">Maria Oliveira - Estacionamento irregular</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Vence em 15 dias</p>
                    <p className="text-xs text-muted-foreground">05/05/2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProcessManagement;
