
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema, VehicleFormValues } from "@/schemas/vehicle-schema";
import { supabase } from "@/integrations/supabase/client";

export function useVehicleForm(clientId?: string) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingFines, setIsSearchingFines] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [associateProcess, setAssociateProcess] = useState(false);
  const [isOwner, setIsOwner] = useState(true);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      client_id: clientId || "",
      vehicle_type: "car",
      is_owner_client: true
    }
  });

  const handleSearchFines = async () => {
    const plate = form.getValues("plate");
    const renavam = form.getValues("renavam");
    
    if (!plate && !renavam) {
      toast({
        title: "Dados necessários",
        description: "Por favor, informe a placa ou RENAVAM para buscar multas."
      });
      return;
    }
    
    setIsSearchingFines(true);
    
    try {
      // We'll search using both APIs to be comprehensive
      const promises = [];
      
      // InfoSimples API
      promises.push(
        supabase.functions.invoke('consult-infosimples-vehicle-fines', {
          body: { plate, renavam }
        })
      );
      
      // Helena API
      promises.push(
        supabase.functions.invoke('consult-helena-fines', {
          body: { plate, renavam }
        })
      );
      
      const results = await Promise.all(promises);
      
      // Check if there are any errors
      const errors = results.filter(result => result.error);
      if (errors.length) {
        console.error("API errors:", errors);
      }
      
      // Show results
      setShowResults(true);
      
      toast({
        title: "Busca concluída",
        description: "Verificação de multas concluída com sucesso."
      });
    } catch (error) {
      console.error("Error searching for fines:", error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar as multas. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSearchingFines(false);
    }
  };

  const onSubmit = async (data: VehicleFormValues) => {
    setIsLoading(true);
    
    try {
      // Call our create-vehicle edge function
      const { data: newVehicle, error } = await supabase.functions.invoke('create-vehicle', {
        body: data
      });
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Veículo cadastrado",
        description: "O veículo foi cadastrado com sucesso."
      });
      
      // Return the new vehicle for further processing
      return newVehicle;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível cadastrar o veículo. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Watch for changes to isOwner and update form accordingly
  form.watch((data) => {
    if (data.is_owner_client !== isOwner) {
      setIsOwner(!!data.is_owner_client);
    }
  });

  return {
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
  };
}
