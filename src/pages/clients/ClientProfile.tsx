
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Car, 
  FileText, 
  Phone, 
  Mail, 
  Edit, 
  Trash2, 
  Download, 
  UserCog, 
  Plus 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";

const ClientProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleDeleteClient = () => {
    toast({
      variant: "destructive",
      title: "Tem certeza?",
      description: "Esta ação não pode ser desfeita."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">João da Silva</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              Particular
            </span>
            <p>Cliente desde 15/01/2025</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <UserCog className="h-4 w-4 mr-2" />
            Gerenciar Acesso
          </Button>
          <Button asChild>
            <Link to={`/clients/edit/123`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Cliente
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Detalhes do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                <p>João da Silva</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPF</p>
                <p>123.456.789-00</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <p>joao.silva@exemplo.com</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <p>(21) 98765-4321</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                <p>15/05/1985</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CNH</p>
                <p>12345678901 (Categoria B)</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                <p>Rua das Flores, 123, Apto 101 - Copacabana, Rio de Janeiro - RJ, 22000-000</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Veículos Cadastrados</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Processos Ativos</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Processos Concluídos</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pontos na CNH</p>
              <p className="text-2xl font-bold text-amber-600">12</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/clients/123/report">
                <Download className="h-4 w-4 mr-2" />
                Relatório Completo
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 h-auto">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="vehicles">Veículos</TabsTrigger>
          <TabsTrigger value="processes">Processos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Ações e atualizações nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="min-w-4 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-cabricop-blue"></div>
                  </div>
                  <div>
                    <p className="font-medium">Novo processo criado</p>
                    <p className="text-sm text-muted-foreground">Processo #12345 - Excesso de velocidade</p>
                    <p className="text-xs text-muted-foreground mt-1">20/04/2025 às 14:30</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="min-w-4 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-cabricop-blue"></div>
                  </div>
                  <div>
                    <p className="font-medium">Documentos adicionados</p>
                    <p className="text-sm text-muted-foreground">Anexados 2 documentos ao processo #12346</p>
                    <p className="text-xs text-muted-foreground mt-1">18/04/2025 às 10:15</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="min-w-4 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-cabricop-blue"></div>
                  </div>
                  <div>
                    <p className="font-medium">Atualização de status</p>
                    <p className="text-sm text-muted-foreground">Processo #12347 alterado para "Em Andamento"</p>
                    <p className="text-xs text-muted-foreground mt-1">15/04/2025 às 16:45</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="min-w-4 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-cabricop-blue"></div>
                  </div>
                  <div>
                    <p className="font-medium">Veículo registrado</p>
                    <p className="text-sm text-muted-foreground">Novo veículo ABC-1234 associado à conta</p>
                    <p className="text-xs text-muted-foreground mt-1">10/04/2025 às 09:20</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Prazos</CardTitle>
                <CardDescription>Datas importantes para ações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded-lg bg-red-50">
                    <div>
                      <p className="font-medium">Vencimento de Recurso</p>
                      <p className="text-xs text-muted-foreground">Processo #12345</p>
                    </div>
                    <p className="font-medium text-red-600">22/04/2025</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <div>
                      <p className="font-medium">Data de Audiência</p>
                      <p className="text-xs text-muted-foreground">Processo #12346</p>
                    </div>
                    <p className="font-medium">05/05/2025</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <div>
                      <p className="font-medium">Renovação de CNH</p>
                      <p className="text-xs text-muted-foreground">Documento</p>
                    </div>
                    <p className="font-medium">15/10/2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Multas Recentes</CardTitle>
                <CardDescription>Multas identificadas nos últimos 90 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded-lg">
                    <div>
                      <p className="font-medium">Auto nº I41664643</p>
                      <p className="text-xs text-muted-foreground">Excesso de velocidade</p>
                      <p className="text-xs">ABC-1234 - 05/04/2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 130,16</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 border rounded-lg">
                    <div>
                      <p className="font-medium">Auto nº E43789654</p>
                      <p className="text-xs text-muted-foreground">Estacionamento irregular</p>
                      <p className="text-xs">DEF-5678 - 15/03/2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 88,38</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="vehicles" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Veículos Registrados</h2>
            <Button asChild>
              <Link to="/vehicles/new">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Veículo
              </Link>
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="w-full md:w-1/4">
                  <div className="bg-muted rounded-lg h-32 flex items-center justify-center">
                    <Car className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row gap-4 justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Honda Civic EXL</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        ABC-1234
                      </span>
                      <p className="text-sm text-muted-foreground">
                        2020/2021
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">RENAVAM</p>
                        <p className="text-sm">12345678901</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Chassi</p>
                        <p className="text-sm">9BGRD68X0XG100001</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Cor</p>
                        <p className="text-sm">Prata</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Proprietário</p>
                        <p className="text-sm">João da Silva</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-2 self-end md:self-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/vehicles/123">Ver Detalhes</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/search?plate=ABC1234">Buscar Multas</Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="w-full md:w-1/4">
                  <div className="bg-muted rounded-lg h-32 flex items-center justify-center">
                    <Car className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row gap-4 justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Volkswagen Gol</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        DEF-5678
                      </span>
                      <p className="text-sm text-muted-foreground">
                        2018/2019
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">RENAVAM</p>
                        <p className="text-sm">98765432109</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Chassi</p>
                        <p className="text-sm">9BWZZZ377VT100002</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Cor</p>
                        <p className="text-sm">Branco</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Proprietário</p>
                        <p className="text-sm">João da Silva</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-2 self-end md:self-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/vehicles/456">Ver Detalhes</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/search?plate=DEF5678">Buscar Multas</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processes" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Processos</h2>
            <Button asChild>
              <Link to="/processos/novo">
                <Plus className="h-4 w-4 mr-2" />
                Novo Processo
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Processo #12345</CardTitle>
                    <CardDescription>Excesso de velocidade</CardDescription>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                    Em Andamento
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Auto de Infração</p>
                  <p className="text-sm">I41664643</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Veículo</p>
                  <p className="text-sm">Honda Civic (ABC-1234)</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data da Infração</p>
                  <p className="text-sm">05/04/2025</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prazo</p>
                  <p className="text-sm font-medium text-red-600">22/04/2025 (2 dias)</p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/processos/12345">Ver Detalhes</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Processo #12346</CardTitle>
                    <CardDescription>Estacionamento irregular</CardDescription>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Aguardando Análise
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Auto de Infração</p>
                  <p className="text-sm">E43789654</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Veículo</p>
                  <p className="text-sm">Volkswagen Gol (DEF-5678)</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data da Infração</p>
                  <p className="text-sm">15/03/2025</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prazo</p>
                  <p className="text-sm">05/05/2025 (15 dias)</p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/processos/12346">Ver Detalhes</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Processo #12347</CardTitle>
                    <CardDescription>Avanço de sinal vermelho</CardDescription>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Deferido
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Auto de Infração</p>
                  <p className="text-sm">B12398745</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Veículo</p>
                  <p className="text-sm">Honda Civic (ABC-1234)</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data da Infração</p>
                  <p className="text-sm">10/03/2025</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Conclusão</p>
                  <p className="text-sm">15/04/2025</p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/processos/12347">Ver Detalhes</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Documentos</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Documento
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Documentos Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded">
                      <FileText className="h-5 w-5 text-cabricop-blue" />
                    </div>
                    <div>
                      <p className="font-medium">CNH.pdf</p>
                      <p className="text-xs text-muted-foreground">Enviado em 15/01/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded">
                      <FileText className="h-5 w-5 text-cabricop-blue" />
                    </div>
                    <div>
                      <p className="font-medium">CPF.pdf</p>
                      <p className="text-xs text-muted-foreground">Enviado em 15/01/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded">
                      <FileText className="h-5 w-5 text-cabricop-blue" />
                    </div>
                    <div>
                      <p className="font-medium">Comprovante_Residencia.pdf</p>
                      <p className="text-xs text-muted-foreground">Enviado em 15/01/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documentos de Veículos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded">
                      <FileText className="h-5 w-5 text-cabricop-blue" />
                    </div>
                    <div>
                      <p className="font-medium">CRLV_Honda_Civic.pdf</p>
                      <p className="text-xs text-muted-foreground">Enviado em 15/01/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded">
                      <FileText className="h-5 w-5 text-cabricop-blue" />
                    </div>
                    <div>
                      <p className="font-medium">CRLV_Gol.pdf</p>
                      <p className="text-xs text-muted-foreground">Enviado em 15/01/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documentos de Processos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded">
                      <FileText className="h-5 w-5 text-cabricop-blue" />
                    </div>
                    <div>
                      <p className="font-medium">Auto_Infracao_I41664643.pdf</p>
                      <p className="text-xs text-muted-foreground">Enviado em 05/04/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded">
                      <FileText className="h-5 w-5 text-cabricop-blue" />
                    </div>
                    <div>
                      <p className="font-medium">Recurso_I41664643.pdf</p>
                      <p className="text-xs text-muted-foreground">Enviado em 10/04/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded">
                      <FileText className="h-5 w-5 text-cabricop-blue" />
                    </div>
                    <div>
                      <p className="font-medium">Auto_Infracao_E43789654.pdf</p>
                      <p className="text-xs text-muted-foreground">Enviado em 15/03/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            As ações nesta seção são permanentes e não podem ser desfeitas. Tenha certeza antes de prosseguir.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={handleDeleteClient}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Cliente
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientProfile;
