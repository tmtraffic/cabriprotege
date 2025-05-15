
import { useNavigate } from "react-router-dom";
import { useClientForm } from "@/hooks/use-client-form";
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
  User, 
  Car, 
  Save, 
  Search, 
  AlertTriangle,
  Loader
} from "lucide-react";

const ClientRegistration = () => {
  const navigate = useNavigate();
  const {
    form,
    isLoading,
    isSearchingFines,
    showResults,
    associateVehicle,
    setAssociateVehicle,
    handleSearchInfractions,
    onSubmit
  } = useClientForm();

  const handleFormSubmit = async (data: any) => {
    const client = await onSubmit(data);
    
    if (client) {
      // If associate vehicle is checked, redirect to vehicle registration with client id
      if (associateVehicle) {
        navigate(`/vehicles/new?client_id=${client.id}`);
      } else {
        navigate("/clients");
      }
    }
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
          <LoadingButton isLoading={isLoading} onClick={form.handleSubmit(handleFormSubmit)}>
            Salvar Cliente
          </LoadingButton>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                  <FormInputField name="client_type" label="Tipo de Cliente">
                    <Select>
                      <SelectTrigger>
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
                  </FormInputField>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInputField name="name" label="Nome Completo">
                      <Input placeholder="Nome completo do cliente" />
                    </FormInputField>
                    <FormInputField name="cpf_cnpj" label="CPF">
                      <div className="flex gap-2">
                        <Input placeholder="000.000.000-00" />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleSearchInfractions}
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
                    <FormInputField name="birth_date" label="Data de Nascimento">
                      <Input type="date" />
                    </FormInputField>
                    <FormInputField name="gender" label="Gênero">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o gênero" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Feminino</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                          <SelectItem value="not-informed">Prefiro não informar</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormInputField>
                  </div>
                  
                  {form.watch("client_type") === "company" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <FormInputField name="company_name" label="Razão Social">
                        <Input placeholder="Razão social da empresa" />
                      </FormInputField>
                    </div>
                  )}
                  
                  {(form.watch("client_type") === "uber" || form.watch("client_type") === "taxi" || form.watch("client_type") === "truck") && (
                    <div className="pt-4 border-t">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {form.watch("client_type") === "uber" && "Motoristas de aplicativo precisam apresentar comprovante de cadastro no aplicativo."}
                          {form.watch("client_type") === "taxi" && "Taxistas precisam apresentar permissão ou alvará de táxi."}
                          {form.watch("client_type") === "truck" && "Caminhoneiros precisam apresentar documentação do veículo de carga."}
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
                    <FormInputField name="email" label="Email">
                      <Input type="email" placeholder="email@exemplo.com" />
                    </FormInputField>
                    <FormInputField name="phone" label="Telefone Celular">
                      <Input placeholder="(00) 00000-0000" />
                    </FormInputField>
                    <FormInputField name="whatsapp" label="WhatsApp (se diferente do celular)">
                      <Input placeholder="(00) 00000-0000" />
                    </FormInputField>
                    <FormInputField name="secondary_phone" label="Telefone Secundário">
                      <Input placeholder="(00) 00000-0000" />
                    </FormInputField>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-4 space-y-2">
                        <FormInputField name="address_street" label="Rua">
                          <Input placeholder="Nome da rua" />
                        </FormInputField>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <FormInputField name="address_number" label="Número">
                          <Input placeholder="123" />
                        </FormInputField>
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <FormInputField name="address_complement" label="Complemento">
                          <Input placeholder="Apto, Bloco, etc." />
                        </FormInputField>
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <FormInputField name="address_neighborhood" label="Bairro">
                          <Input placeholder="Nome do bairro" />
                        </FormInputField>
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <FormInputField name="address_city" label="Cidade">
                          <Input placeholder="Nome da cidade" defaultValue="Rio de Janeiro" />
                        </FormInputField>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <FormInputField name="address_state" label="Estado">
                          <Input defaultValue="RJ" disabled />
                        </FormInputField>
                      </div>
                      <div className="md:col-span-1 space-y-2">
                        <FormInputField name="address_zip" label="CEP">
                          <Input placeholder="00000-000" />
                        </FormInputField>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <Label htmlFor="communication-preferences">Preferências de Comunicação</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pref-email" 
                          checked={form.watch("communication_preferences.email")}
                          onCheckedChange={(checked) => {
                            form.setValue("communication_preferences.email", !!checked);
                          }}
                        />
                        <Label htmlFor="pref-email" className="font-normal cursor-pointer">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pref-sms" 
                          checked={form.watch("communication_preferences.sms")}
                          onCheckedChange={(checked) => {
                            form.setValue("communication_preferences.sms", !!checked);
                          }}
                        />
                        <Label htmlFor="pref-sms" className="font-normal cursor-pointer">SMS</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pref-whatsapp" 
                          checked={form.watch("communication_preferences.whatsapp")}
                          onCheckedChange={(checked) => {
                            form.setValue("communication_preferences.whatsapp", !!checked);
                          }}
                        />
                        <Label htmlFor="pref-whatsapp" className="font-normal cursor-pointer">WhatsApp</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pref-phone" 
                          checked={form.watch("communication_preferences.phone")}
                          onCheckedChange={(checked) => {
                            form.setValue("communication_preferences.phone", !!checked);
                          }}
                        />
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
                    <FormInputField name="cnh_number" label="Número da CNH">
                      <div className="flex gap-2">
                        <Input placeholder="00000000000" />
                        <Button 
                          type="button" 
                          variant="outline"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Verificar
                        </Button>
                      </div>
                    </FormInputField>
                    <FormInputField name="cnh_category" label="Categoria">
                      <Select>
                        <SelectTrigger>
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
                    </FormInputField>
                    <FormInputField name="cnh_expiration_date" label="Data de Validade">
                      <Input type="date" />
                    </FormInputField>
                    <FormInputField name="cnh_issue_date" label="Data de Emissão">
                      <Input type="date" />
                    </FormInputField>
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
                        defaultValue={form.watch("cpf_cnpj")}
                        onChange={(e) => form.setValue("cpf_cnpj", e.target.value)}
                      />
                    </div>
                    <Button 
                      type="button"
                      onClick={handleSearchInfractions}
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
                        <p className="text-sm">Foram encontradas multas associadas a este CPF/CNH.</p>
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
              <FormInputField name="notes" label="Observações">
                <Textarea
                  placeholder="Informações adicionais sobre o cliente"
                  rows={3}
                />
              </FormInputField>
              
              <div className="pt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="associate-vehicle" 
                    checked={associateVehicle}
                    onCheckedChange={(checked) => setAssociateVehicle(!!checked)}
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
              <Button variant="outline" type="button" onClick={() => navigate("/clients")}>
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
                  Salvar Cliente
                </LoadingButton>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ClientRegistration;
