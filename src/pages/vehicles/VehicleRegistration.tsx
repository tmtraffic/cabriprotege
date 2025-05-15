
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useVehicleForm } from "@/hooks/use-vehicle-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormInputField } from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
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
  AlertTriangle,
  Loader
} from "lucide-react";

const VehicleRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract client_id from URL query parameters if available
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get('client_id');
  
  const {
    form,
    isLoading,
    isSearchingFines,
    showResults,
    associateProcess,
    setAssociateProcess,
    isOwner,
    setIsOwner,
    handleSearchFines,
    onSubmit
  } = useVehicleForm(clientId || undefined);

  // Effect to set clientId in form when it's available from URL
  useEffect(() => {
    if (clientId) {
      form.setValue("client_id", clientId);
    }
  }, [clientId, form]);

  const handleFormSubmit = async (data: any) => {
    const vehicle = await onSubmit(data);
    
    if (vehicle) {
      // If associate process is checked, redirect to process creation with vehicle id
      if (associateProcess) {
        navigate(`/processos/novo?vehicle_id=${vehicle.id}`);
      } else {
        navigate("/vehicles");
      }
    }
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
          <LoadingButton isLoading={isLoading} onClick={form.handleSubmit(handleFormSubmit)}>
            Salvar Veículo
          </LoadingButton>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                  <FormInputField name="vehicle_type" label="Tipo de Veículo">
                    <Select>
                      <SelectTrigger>
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
                  </FormInputField>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInputField name="plate" label="Placa">
                      <div className="flex gap-2">
                        <Input placeholder="AAA0A00" />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleSearchFines}
                          disabled={isSearchingFines}
                        >
                          {isSearchingFines ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                          <span className="ml-2">Verificar</span>
                        </Button>
                      </div>
                    </FormInputField>
                    <FormInputField name="renavam" label="RENAVAM">
                      <div className="flex gap-2">
                        <Input placeholder="00000000000" />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleSearchFines}
                          disabled={isSearchingFines}
                        >
                          {isSearchingFines ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                          <span className="ml-2">Verificar</span>
                        </Button>
                      </div>
                    </FormInputField>
                    <FormInputField name="brand" label="Marca">
                      <Input placeholder="Marca do veículo" />
                    </FormInputField>
                    <FormInputField name="model" label="Modelo">
                      <Input placeholder="Modelo do veículo" />
                    </FormInputField>
                    <FormInputField name="year" label="Ano">
                      <Input placeholder="Ano de fabricação" />
                    </FormInputField>
                    <FormInputField name="color" label="Cor">
                      <Input placeholder="Cor do veículo" />
                    </FormInputField>
                    <FormInputField name="chassis" label="Chassi">
                      <Input placeholder="Número do chassi" />
                    </FormInputField>
                    <FormInputField name="engine_number" label="Motor">
                      <Input placeholder="Número do motor" />
                    </FormInputField>
                  </div>
                  
                  {(form.watch("vehicle_type") === "truck" || form.watch("vehicle_type") === "bus") && (
                    <div className="pt-4 border-t">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {form.watch("vehicle_type") === "truck" && "Veículos de carga possuem restrições específicas de circulação e requisitos adicionais."}
                          {form.watch("vehicle_type") === "bus" && "Veículos de transporte coletivo necessitam de documentação especial para operação."}
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
                  {!clientId && (
                    <div className="mb-4">
                      <FormInputField name="client_id" label="ID do Cliente">
                        <Input placeholder="ID do cliente" />
                      </FormInputField>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox 
                      id="is_owner_client"
                      checked={isOwner}
                      onCheckedChange={(checked) => {
                        setIsOwner(!!checked);
                        form.setValue("is_owner_client", !!checked);
                      }}
                    />
                    <Label htmlFor="is_owner_client" className="font-normal cursor-pointer">
                      Cliente é o proprietário do veículo
                    </Label>
                  </div>
                  
                  {!isOwner && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInputField name="owner_name" label="Nome do Proprietário">
                        <Input placeholder="Nome completo do proprietário" />
                      </FormInputField>
                      <FormInputField name="owner_cpf" label="CPF do Proprietário">
                        <Input placeholder="000.000.000-00" />
                      </FormInputField>
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
                    
                    <Button variant="outline" type="button">
                      <User className="h-4 w-4 mr-2" />
                      Adicionar Condutor
                    </Button>
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
                        value={form.watch("plate") || form.watch("renavam") || ""}
                        onChange={(e) => {
                          // Determine if input looks like a plate or renavam
                          const value = e.target.value;
                          if (value.length <= 7) {
                            form.setValue("plate", value);
                          } else {
                            form.setValue("renavam", value);
                          }
                        }}
                      />
                    </div>
                    <Button 
                      type="button"
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
                      {/* Fine results will be displayed here */}
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium text-lg mb-2">Resultados da Busca</h3>
                        <p className="text-sm">Foram encontradas multas associadas a este veículo.</p>
                      </div>
                      
                      {/* This would be mapped from actual API results */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <p className="text-sm">Total de multas encontradas: 0</p>
                        <Button>
                          Incluir Todas no Cadastro
                        </Button>
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
              <FormInputField name="notes" label="Observações">
                <Textarea
                  placeholder="Informações adicionais sobre o veículo"
                  rows={3}
                />
              </FormInputField>
              
              <div className="pt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="associate-process" 
                    checked={associateProcess}
                    onCheckedChange={(checked) => setAssociateProcess(!!checked)}
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
              <Button variant="outline" type="button" onClick={() => navigate("/vehicles")}>
                Cancelar
              </Button>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    onSubmit(form.getValues());
                    form.reset();
                  }}
                >
                  Salvar e Criar Outro
                </Button>
                <LoadingButton isLoading={isLoading} type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Veículo
                </LoadingButton>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default VehicleRegistration;
