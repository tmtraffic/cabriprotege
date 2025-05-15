
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
    
    try {
      // Call the Helena or InfoSimples API through our edge function
      const { data: apiResponse, error } = await supabase.functions.invoke('consult-helena-fines', {
        body: { driver_cpf: cpf }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Show results
      setShowResults(true);
      
      toast({
        title: "Busca concluída",
        description: "Foram encontradas infrações associadas a este CPF/CNPJ."
      });
    } catch (error) {
      console.error("Error searching for infractions:", error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar as infrações. Tente novamente mais tarde.",
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
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Cliente cadastrado",
        description: "O cliente foi cadastrado com sucesso."
      });
      
      // Clear form or redirect based on associateVehicle value
      return newClient;
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível cadastrar o cliente. Tente novamente.",
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
    associateVehicle,
    setAssociateVehicle,
    handleSearchInfractions,
    onSubmit
  };
}
