
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, ClientFormValues } from "@/schemas/client-schema";
import { supabase } from "@/integrations/supabase/client";

export function useClientForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingFines, setIsSearchingFines] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [associateVehicle, setAssociateVehicle] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      client_type: "individual",
      name: "",
      cpf_cnpj: "",
      address_city: "Rio de Janeiro",
      address_state: "RJ",
      communication_preferences: {
        email: true,
        sms: false,
        whatsapp: true,
        phone: false
      }
    }
  });

  const handleSearchInfractions = async () => {
    const cpf = form.getValues("cpf_cnpj");
    
    if (!cpf) {
      toast({
        title: "CPF/CNPJ necessário",
        description: "Por favor, informe o CPF/CNPJ para buscar multas."
      });
      return;
    }
    
    setIsSearchingFines(true);
    setSearchResults(null);
    
    try {
      // First, check if the client already exists
      const { data: existingClient, error: clientError } = await supabase.functions.invoke('get-client-by-cpf-cnpj', {
        body: { cpf_cnpj: cpf }
      });

      if (clientError) {
        if (clientError.message !== "Client not found") {
          console.error("Error checking existing client:", clientError);
          toast({
            title: "Erro na verificação de cliente",
            description: "Ocorreu um erro ao verificar se o cliente já existe no sistema.",
            variant: "destructive"
          });
        }
      }

      if (existingClient) {
        toast({
          title: "Cliente encontrado",
          description: "Este CPF/CNPJ já está cadastrado no sistema.",
        });
        
        // Optionally, pre-fill the form with existing client data
        form.reset({
          ...existingClient,
          communication_preferences: existingClient.communication_preferences || {
            email: true,
            sms: false,
            whatsapp: true,
            phone: false
          }
        });
      }
      
      // Call the Helena API through our edge function
      const { data: apiResponse, error } = await supabase.functions.invoke('consult-helena-fines', {
        body: { 
          driver_cpf: cpf,
          client_id: existingClient?.id // Link search history to client if found
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Store results and show results section
      setSearchResults(apiResponse);
      setShowResults(true);
      
      if (apiResponse.success) {
        toast({
          title: "Busca concluída",
          description: "A consulta de multas foi realizada com sucesso."
        });
      } else {
        toast({
          title: "Aviso na consulta",
          description: apiResponse.details || "A consulta foi concluída, mas podem haver limitações nos resultados.",
          variant: "warning"
        });
      }
    } catch (error: any) {
      console.error("Error searching for infractions:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Não foi possível buscar as infrações. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSearchingFines(false);
    }
  };

  const onSubmit = async (data: ClientFormValues) => {
    setIsLoading(true);
    
    try {
      // Call our create-client edge function
      const { data: newClient, error } = await supabase.functions.invoke('create-client', {
        body: data
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Cliente cadastrado",
        description: "O cliente foi cadastrado com sucesso."
      });
      
      form.reset(); // Clear form
      
      // Return the new client data for further processing (e.g., redirecting to vehicle registration)
      return newClient;
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível cadastrar o cliente. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    isSearchingFines,
    showResults,
    searchResults,
    associateVehicle,
    setAssociateVehicle,
    handleSearchInfractions,
    onSubmit
  };
}
