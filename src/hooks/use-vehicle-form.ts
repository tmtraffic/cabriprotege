
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
  const [searchResults, setSearchResults] = useState<any>(null);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      client_id: clientId || "",
      vehicle_type: "car",
      is_owner_client: true
    }
  });

  // Update client_id when it changes (e.g., from URL parameter)
  if (clientId && form.getValues("client_id") !== clientId) {
    form.setValue("client_id", clientId);
  }

  const handleSearchFines = async () => {
    const plate = form.getValues("plate");
    const renavam = form.getValues("renavam");
    const clientId = form.getValues("client_id");
    
    if (!plate && !renavam) {
      toast({
        title: "Dados necessários",
        description: "Por favor, informe a placa ou RENAVAM para buscar multas."
      });
      return;
    }
    
    setIsSearchingFines(true);
    setSearchResults(null);
    
    try {
      // First check if vehicle already exists
      if (plate) {
        const { data: existingVehicles, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('plate', plate)
          .maybeSingle();

        if (vehicleError) {
          console.error("Error checking existing vehicle:", vehicleError);
        } else if (existingVehicles) {
          toast({
            title: "Veículo encontrado",
            description: "Esta placa já está cadastrada no sistema.",
          });
          
          // Convert year to string if it exists and is a number
          const vehicleData = {
            ...existingVehicles,
            year: existingVehicles.year ? String(existingVehicles.year) : undefined,
            client_id: clientId || existingVehicles.client_id || existingVehicles.owner_id
          };
          
          // Pre-fill form with existing vehicle data
          form.reset(vehicleData);
          
          // Update isOwner state
          setIsOwner(existingVehicles.is_owner_client === true);
        }
      }
      
      // Search using both APIs for comprehensive results
      const promises = [];
      
      // InfoSimples API - search by plate or renavam
      if (plate || renavam) {
        promises.push(
          supabase.functions.invoke('consult-infosimples-vehicle-fines', {
            body: { 
              plate, 
              renavam,
              client_id: clientId,
              vehicle_id: null // Will be set once vehicle is created
            }
          })
        );
      }
      
      // Helena API - search by plate
      if (plate) {
        promises.push(
          supabase.functions.invoke('consult-helena-fines', {
            body: { 
              plate,
              client_id: clientId,
              vehicle_id: null // Will be set once vehicle is created
            }
          })
        );
      }
      
      const results = await Promise.all(promises);
      
      // Check if there are any errors
      const errors = results.filter(result => !result.data?.success);
      if (errors.length) {
        console.warn("Some API calls had errors:", errors);
        if (errors.length === results.length) {
          // All APIs failed
          throw new Error("Todas as consultas de multas falharam. Tente novamente mais tarde.");
        }
      }
      
      // Combine results
      const combinedResults = results.map(r => r.data);
      setSearchResults(combinedResults);
      setShowResults(true);
      
      toast({
        title: "Busca concluída",
        description: "Verificação de multas concluída com sucesso."
      });
    } catch (error: any) {
      console.error("Error searching for fines:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Não foi possível buscar as multas. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSearchingFines(false);
    }
  };

  const onSubmit = async (data: VehicleFormValues) => {
    // Validate that client_id is provided
    if (!data.client_id) {
      toast({
        title: "Cliente necessário",
        description: "Por favor, selecione um cliente para associar a este veículo.",
        variant: "destructive"
      });
      return null;
    }
    
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
      
      // If we have search results in history and a new vehicle ID, update the search history
      if (searchResults && newVehicle?.id) {
        try {
          // This could be enhanced with a dedicated edge function to update search history
          const { data: searchHistory } = await supabase
            .from('search_history')
            .select('id')
            .is('related_vehicle_id', null)
            .eq('related_client_id', data.client_id)
            .eq('search_type', 'vehicle_plate')
            .eq('search_query', data.plate)
            .limit(1);
            
          if (searchHistory && searchHistory.length > 0) {
            await supabase
              .from('search_history')
              .update({ related_vehicle_id: newVehicle.id })
              .eq('id', searchHistory[0].id);
          }
        } catch (updateError) {
          console.error("Error linking search history to vehicle:", updateError);
        }
      }
      
      if (!associateProcess) {
        form.reset(); // Clear form for new entry if not associating with process
      }
      
      // Return the new vehicle for further processing
      return newVehicle;
    } catch (error: any) {
      console.error("Error creating vehicle:", error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível cadastrar o veículo. Tente novamente.",
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
    searchResults,
    associateProcess,
    setAssociateProcess,
    isOwner,
    setIsOwner,
    handleSearchFines,
    onSubmit
  };
}
