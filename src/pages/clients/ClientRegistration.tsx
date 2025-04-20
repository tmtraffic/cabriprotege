
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Car, 
  Save, 
  Search, 
  AlertTriangle 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const ClientRegistration = () => {
  const [clientType, setClientType] = useState("individual");
  const [isLoading, setIsLoading] = useState(false);
  const [associateVehicle, setAssociateVehicle] = useState(false);
  const [isSearchingVehicles, setIsSearchingVehicles] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular envio para API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    
    toast({
      title: "Cliente cadastrado",
      description: "O cliente foi cadastrado com sucesso."
    });
    
    // Se estiver marcado para associar veículo, redirecionar para página de veículos
    if (associateVehicle) {
      navigate("/vehicles/new");
    } else {
      navigate("/clients");
    }
  };

  const handleSearchInfractions = async () => {
    setIsSearchingVehicles(true);
    
    // Simular busca na API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSearchingVehicles(false);
    setShowResults(true);
    
    toast({
      title: "Busca concluída",
      description: "Foram encontradas 3 multas associadas a este CPF."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Cliente</h1>
          <p className="text-muted-foreground">
            Preencha os dados para cadastrar um novo cliente
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/clients")}>
            Cancelar
          </Button>
          <Button disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Salvando..." : "Salvar Cliente"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="fines">Multas Existentes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Dados básicos do novo cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-type">Tipo de Cliente</Label>
                <Select 
                  value={clientType} 
                  onValueChange={setClientType}
                >
                  <SelectTrigger id="client-type">
                    <SelectValue placeholder="Selecione o tipo de cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Particular</SelectItem>
                    <SelectItem value="uber">Motorista de Aplicativo</SelectItem>
                    <SelectItem value="taxi">Taxista</SelectItem>
                    <SelectItem value="truck">Caminhoneiro</SelectItem>
                    <SelectItem value="company">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" placeholder="Nome completo do cliente" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <div className="flex gap-2">
                    <Input id="cpf" placeholder="000.000.000-00" />
                    <Button variant="outline" onClick={handleSearchInfractions}>
                      <Search className="h-4 w-4 mr-2" />
                      Verificar
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth-date">Data de Nascimento</Label>
                  <Input id="birth-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero</Label>
                  <Select defaultValue="not-informed">
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                      <SelectItem value="not-informed">Prefiro não informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {clientType === "company" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Razão Social</Label>
                    <Input id="company-name" placeholder="Razão social da empresa" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" placeholder="00.000.000/0000-00" />
                  </div>
                </div>
              )}
              
              {(clientType === "uber" || clientType === "taxi" || clientType === "truck") && (
                <div className="pt-4 border-t">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {clientType === "uber" && "Motoristas de aplicativo precisam apresentar comprovante de cadastro no aplicativo."}
                      {clientType === "taxi" && "Taxistas precisam apresentar permissão ou alvará de táxi."}
                      {clientType === "truck" && "Caminhoneiros precisam apresentar documentação do veículo de carga."}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>
                Dados para comunicação com o cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone Celular</Label>
                  <Input id="phone" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp (se diferente do celular)</Label>
                  <Input id="whatsapp" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-phone">Telefone Secundário</Label>
                  <Input id="secondary-phone" placeholder="(00) 00000-0000" />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input id="street" placeholder="Nome da rua" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" placeholder="123" />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" placeholder="Apto, Bloco, etc." />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" placeholder="Nome do bairro" />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" placeholder="Nome da cidade" defaultValue="Rio de Janeiro" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" defaultValue="RJ" disabled />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label htmlFor="zip">CEP</Label>
                    <Input id="zip" placeholder="00000-000" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Label htmlFor="communication-preferences">Preferências de Comunicação</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pref-email" defaultChecked />
                    <Label htmlFor="pref-email" className="font-normal cursor-pointer">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pref-sms" />
                    <Label htmlFor="pref-sms" className="font-normal cursor-pointer">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pref-whatsapp" defaultChecked />
                    <Label htmlFor="pref-whatsapp" className="font-normal cursor-pointer">WhatsApp</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pref-phone" />
                    <Label htmlFor="pref-phone" className="font-normal cursor-pointer">Ligação Telefônica</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>
                Informações de documentos e CNH do cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnh">Número da CNH</Label>
                  <div className="flex gap-2">
                    <Input id="cnh" placeholder="00000000000" />
                    <Button variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Verificar
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnh-category">Categoria</Label>
                  <Select defaultValue="b">
                    <SelectTrigger id="cnh-category">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">A</SelectItem>
                      <SelectItem value="b">B</SelectItem>
                      <SelectItem value="ab">AB</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="d">D</SelectItem>
                      <SelectItem value="e">E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnh-expiration">Data de Validade</Label>
                  <Input id="cnh-expiration" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnh-issue-date">Data de Emissão</Label>
                  <Input id="cnh-issue-date" type="date" />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Upload de Documentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upload-cnh">CNH (frente e verso)</Label>
                    <Input id="upload-cnh" type="file" />
                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upload-cpf">CPF</Label>
                    <Input id="upload-cpf" type="file" />
                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upload-address">Comprovante de Residência</Label>
                    <Input id="upload-address" type="file" />
                    <p className="text-xs text-muted-foreground">
                      Conta de luz, água ou telefone (últimos 3 meses)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upload-other">Outros Documentos</Label>
                    <Input id="upload-other" type="file" multiple />
                    <p className="text-xs text-muted-foreground">
                      Documentos adicionais relevantes para o caso
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multas Existentes</CardTitle>
              <CardDescription>
                Pesquise e visualize multas associadas a este cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="search-fines">CPF/CNH para pesquisa</Label>
                  <Input 
                    id="search-fines" 
                    placeholder="Digite o CPF ou CNH para buscar multas" 
                  />
                </div>
                <Button 
                  onClick={handleSearchInfractions}
                  disabled={isSearchingVehicles}
                >
                  {isSearchingVehicles ? (
                    <>Pesquisando...</>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar Multas
                    </>
                  )}
                </Button>
              </div>
              
              {isSearchingVehicles && (
                <div className="flex justify-center items-center p-8">
                  <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin mr-3"></div>
                  <p>Consultando bancos de dados oficiais...</p>
                </div>
              )}
              
              {showResults && !isSearchingVehicles && (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Resultados da Busca</h3>
                    <p className="text-sm">Foram encontradas 3 multas associadas a este CPF/CNH.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h4 className="font-medium">Auto Nº: I41664643</h4>
                          <p className="text-sm text-muted-foreground">Data: 05/10/2020 10:15</p>
                          <p className="text-sm">Placa: ABC1234</p>
                          <p className="text-sm font-medium mt-2">74550 - TRANSITAR EM VELOCIDADE SUPERIOR À MÁXIMA PERMITIDA EM ATÉ 20%</p>
                          <p className="text-sm text-muted-foreground">Valor: R$ 130,16</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                          <Button size="sm">
                            Incluir no Cadastro
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h4 className="font-medium">Auto Nº: E43789654</h4>
                          <p className="text-sm text-muted-foreground">Data: 15/01/2021 08:30</p>
                          <p className="text-sm">Placa: ABC1234</p>
                          <p className="text-sm font-medium mt-2">60503 - ESTACIONAR EM LOCAL PROIBIDO</p>
                          <p className="text-sm text-muted-foreground">Valor: R$ 88,38</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                          <Button size="sm">
                            Incluir no Cadastro
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h4 className="font-medium">Auto Nº: B12398745</h4>
                          <p className="text-sm text-muted-foreground">Data: 10/03/2021 17:45</p>
                          <p className="text-sm">Placa: ABC1234</p>
                          <p className="text-sm font-medium mt-2">73662 - AVANÇAR O SINAL VERMELHO DO SEMÁFORO</p>
                          <p className="text-sm text-muted-foreground">Valor: R$ 293,47</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                          <Button size="sm">
                            Incluir no Cadastro
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <p className="text-sm">Total de multas encontradas: 3</p>
                      <Button>
                        Incluir Todas no Cadastro
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {!isSearchingVehicles && !showResults && (
                <div className="border rounded-lg flex flex-col items-center justify-center p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma busca realizada</h3>
                  <p className="text-muted-foreground max-w-md">
                    Digite o CPF ou CNH do cliente e clique em buscar para verificar multas existentes nos sistemas oficiais.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Observações e Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais sobre o cliente"
              rows={3}
            />
          </div>
          
          <div className="pt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="associate-vehicle" 
                checked={associateVehicle}
                onCheckedChange={(checked) => setAssociateVehicle(checked as boolean)}
              />
              <Label 
                htmlFor="associate-vehicle" 
                className="font-normal cursor-pointer flex items-center"
              >
                <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                Associar veículo ao criar cliente
              </Label>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              Se marcado, você será redirecionado para cadastro de veículo após salvar o cliente
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/clients")}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              Salvar e Criar Outro
            </Button>
            <Button disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Cliente
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientRegistration;
