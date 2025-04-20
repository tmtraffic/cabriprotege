
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
  Car, 
  User, 
  FileText, 
  Search, 
  Save, 
  AlertTriangle 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const VehicleRegistration = () => {
  const [vehicleType, setVehicleType] = useState("car");
  const [isLoading, setIsLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(true);
  const [associateProcess, setAssociateProcess] = useState(false);
  const [isSearchingFines, setIsSearchingFines] = useState(false);
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
      title: "Veículo cadastrado",
      description: "O veículo foi cadastrado com sucesso."
    });
    
    // Se estiver marcado para associar processo, redirecionar para página de processos
    if (associateProcess) {
      navigate("/processos/novo");
    } else {
      navigate("/vehicles");
    }
  };

  const handleSearchFines = async () => {
    setIsSearchingFines(true);
    
    // Simular busca na API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSearchingFines(false);
    setShowResults(true);
    
    toast({
      title: "Busca concluída",
      description: "Foram encontradas 3 multas associadas a este veículo."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Veículo</h1>
          <p className="text-muted-foreground">
            Preencha os dados para cadastrar um novo veículo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/vehicles")}>
            Cancelar
          </Button>
          <Button disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Salvando..." : "Salvar Veículo"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="vehicle" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicle">Dados do Veículo</TabsTrigger>
          <TabsTrigger value="ownership">Propriedade</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="fines">Multas Existentes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Veículo</CardTitle>
              <CardDescription>
                Dados básicos do veículo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-type">Tipo de Veículo</Label>
                <Select 
                  value={vehicleType} 
                  onValueChange={setVehicleType}
                >
                  <SelectTrigger id="vehicle-type">
                    <SelectValue placeholder="Selecione o tipo de veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Carro</SelectItem>
                    <SelectItem value="motorcycle">Motocicleta</SelectItem>
                    <SelectItem value="truck">Caminhão</SelectItem>
                    <SelectItem value="bus">Ônibus</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa</Label>
                  <div className="flex gap-2">
                    <Input id="plate" placeholder="AAA0A00" />
                    <Button variant="outline" onClick={handleSearchFines}>
                      <Search className="h-4 w-4 mr-2" />
                      Verificar
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renavam">RENAVAM</Label>
                  <div className="flex gap-2">
                    <Input id="renavam" placeholder="00000000000" />
                    <Button variant="outline" onClick={handleSearchFines}>
                      <Search className="h-4 w-4 mr-2" />
                      Verificar
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" placeholder="Marca do veículo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input id="model" placeholder="Modelo do veículo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input id="year" placeholder="Ano de fabricação" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <Input id="color" placeholder="Cor do veículo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chassis">Chassi</Label>
                  <Input id="chassis" placeholder="Número do chassi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engine">Motor</Label>
                  <Input id="engine" placeholder="Número do motor" />
                </div>
              </div>
              
              {(vehicleType === "truck" || vehicleType === "bus") && (
                <div className="pt-4 border-t">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {vehicleType === "truck" && "Veículos de carga possuem restrições específicas de circulação e requisitos adicionais."}
                      {vehicleType === "bus" && "Veículos de transporte coletivo necessitam de documentação especial para operação."}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ownership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Propriedade</CardTitle>
              <CardDescription>
                Dados sobre o proprietário e condutores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="is-owner" 
                  checked={isOwner}
                  onCheckedChange={(checked) => setIsOwner(checked as boolean)}
                />
                <Label htmlFor="is-owner" className="font-normal cursor-pointer">
                  Cliente é o proprietário do veículo
                </Label>
              </div>
              
              {!isOwner && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner-name">Nome do Proprietário</Label>
                    <Input id="owner-name" placeholder="Nome completo do proprietário" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-cpf">CPF do Proprietário</Label>
                    <Input id="owner-cpf" placeholder="000.000.000-00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-phone">Telefone do Proprietário</Label>
                    <Input id="owner-phone" placeholder="(00) 00000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relação com o Proprietário</Label>
                    <Select defaultValue="family">
                      <SelectTrigger id="relationship">
                        <SelectValue placeholder="Selecione o tipo de relação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Familiar</SelectItem>
                        <SelectItem value="friend">Amigo</SelectItem>
                        <SelectItem value="company">Empresa</SelectItem>
                        <SelectItem value="leasing">Leasing/Financiamento</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Principal Condutor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver-name">Nome do Principal Condutor</Label>
                    <Input id="driver-name" placeholder="Nome do condutor principal" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driver-cnh">CNH do Condutor</Label>
                    <Input id="driver-cnh" placeholder="Número da CNH" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driver-cnh-category">Categoria da CNH</Label>
                    <Select defaultValue="b">
                      <SelectTrigger id="driver-cnh-category">
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
                    <Label htmlFor="driver-cnh-expiration">Validade da CNH</Label>
                    <Input id="driver-cnh-expiration" type="date" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Condutores Adicionais</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Adicione outros condutores que utilizam regularmente este veículo
                </p>
                
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Adicionar Condutor
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox id="professional-use" />
                  <Label htmlFor="professional-use" className="font-normal cursor-pointer">
                    Veículo de uso profissional
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">
                  Marque esta opção se o veículo é utilizado para táxi, aplicativo de transporte, entregas, etc.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos do Veículo</CardTitle>
              <CardDescription>
                Documentação e dados adicionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crlv-number">Nº do CRLV</Label>
                  <Input id="crlv-number" placeholder="Número do CRLV" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crlv-expiration">Validade do CRLV</Label>
                  <Input id="crlv-expiration" type="date" />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Upload de Documentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upload-crlv">CRLV</Label>
                    <Input id="upload-crlv" type="file" />
                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upload-invoice">Nota Fiscal (se aplicável)</Label>
                    <Input id="upload-invoice" type="file" />
                    <p className="text-xs text-muted-foreground">
                      Para veículos novos ou recém-adquiridos
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upload-insurance">Seguro do Veículo</Label>
                    <Input id="upload-insurance" type="file" />
                    <p className="text-xs text-muted-foreground">
                      Apólice de seguro atual (se houver)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upload-other">Outros Documentos</Label>
                    <Input id="upload-other" type="file" multiple />
                    <p className="text-xs text-muted-foreground">
                      Documentos adicionais relevantes
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Informações do Seguro</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insurance-company">Seguradora</Label>
                    <Input id="insurance-company" placeholder="Nome da seguradora" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance-policy">Nº da Apólice</Label>
                    <Input id="insurance-policy" placeholder="Número da apólice" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance-expiration">Validade do Seguro</Label>
                    <Input id="insurance-expiration" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance-type">Tipo de Cobertura</Label>
                    <Select defaultValue="comprehensive">
                      <SelectTrigger id="insurance-type">
                        <SelectValue placeholder="Selecione o tipo de cobertura" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="liability">Contra Terceiros</SelectItem>
                        <SelectItem value="comprehensive">Compreensiva</SelectItem>
                        <SelectItem value="total">Total</SelectItem>
                        <SelectItem value="other">Outra</SelectItem>
                      </SelectContent>
                    </Select>
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
                Pesquise e visualize multas associadas a este veículo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="search-fines">Placa/RENAVAM para pesquisa</Label>
                  <Input 
                    id="search-fines" 
                    placeholder="Digite a placa ou RENAVAM para buscar multas" 
                  />
                </div>
                <Button 
                  onClick={handleSearchFines}
                  disabled={isSearchingFines}
                >
                  {isSearchingFines ? (
                    <>Pesquisando...</>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar Multas
                    </>
                  )}
                </Button>
              </div>
              
              {isSearchingFines && (
                <div className="flex justify-center items-center p-8">
                  <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin mr-3"></div>
                  <p>Consultando bancos de dados oficiais...</p>
                </div>
              )}
              
              {showResults && !isSearchingFines && (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Resultados da Busca</h3>
                    <p className="text-sm">Foram encontradas 3 multas associadas a este veículo.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h4 className="font-medium">Auto Nº: I41664643</h4>
                          <p className="text-sm text-muted-foreground">Data: 05/10/2020 10:15</p>
                          <p className="text-sm">Proprietário: João da Silva</p>
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
                          <p className="text-sm">Proprietário: João da Silva</p>
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
                          <p className="text-sm">Proprietário: João da Silva</p>
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
              
              {!isSearchingFines && !showResults && (
                <div className="border rounded-lg flex flex-col items-center justify-center p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma busca realizada</h3>
                  <p className="text-muted-foreground max-w-md">
                    Digite a placa ou RENAVAM do veículo e clique em buscar para verificar multas existentes nos sistemas oficiais.
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
              placeholder="Informações adicionais sobre o veículo"
              rows={3}
            />
          </div>
          
          <div className="pt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="associate-process" 
                checked={associateProcess}
                onCheckedChange={(checked) => setAssociateProcess(checked as boolean)}
              />
              <Label 
                htmlFor="associate-process" 
                className="font-normal cursor-pointer flex items-center"
              >
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                Iniciar processo de recurso após cadastro
              </Label>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              Se marcado, você será redirecionado para iniciar um processo de recurso após salvar o veículo
            </p>
          </div>
          
          <div className="pt-4 border-t">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Importante: Verifique se todos os dados estão corretos e correspondem exatamente aos documentos originais.
                Inconsistências podem causar problemas em recursos administrativos.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/vehicles")}>
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
                  Salvar Veículo
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VehicleRegistration;
