
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
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Car, Save } from "lucide-react";

// Import refactored components
import { PersonalInfoForm } from "@/components/clients/registration/PersonalInfoForm";
import { ContactInfoForm } from "@/components/clients/registration/ContactInfoForm";
import { DocumentsForm } from "@/components/clients/registration/DocumentsForm";
import { FinesSearchForm } from "@/components/clients/registration/FinesSearchForm";
import { ClientFormFooter } from "@/components/clients/registration/ClientFormFooter";

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
                <CardContent>
                  <PersonalInfoForm 
                    form={form} 
                    isSearchingFines={isSearchingFines}
                    handleSearchInfractions={handleSearchInfractions}
                  />
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
                <CardContent>
                  <ContactInfoForm form={form} />
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
                <CardContent>
                  <DocumentsForm form={form} />
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
                <CardContent>
                  <FinesSearchForm 
                    form={form}
                    isSearchingFines={isSearchingFines}
                    showResults={showResults}
                    handleSearchInfractions={handleSearchInfractions}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Observações e Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientFormFooter
                form={form}
                associateVehicle={associateVehicle}
                setAssociateVehicle={setAssociateVehicle}
                isLoading={isLoading}
                onSubmit={onSubmit}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ClientRegistration;
