
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { fetchVehicles, Vehicle } from "@/services/VehicleService";
import { fetchInfractions, Infraction } from "@/services/InfractionService";

const processSchema = z.object({
  type: z.enum(["fine_appeal", "license_suspension", "license_revocation", "other"], {
    required_error: "Tipo de processo é obrigatório",
  }),
  infraction_id: z.string().optional(),
  vehicle_id: z.string().min(1, "Veículo é obrigatório"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

type ProcessFormValues = z.infer<typeof processSchema>;

const NewProcess = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [infractions, setInfractions] = useState<Infraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  
  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      type: "fine_appeal",
      description: "",
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const vehiclesData = await fetchVehicles(user.id);
        setVehicles(vehiclesData);
        
        // No vehicle selected yet, so don't load infractions
        if (!selectedVehicle && vehiclesData.length > 0) {
          setSelectedVehicle(vehiclesData[0].id);
          form.setValue('vehicle_id', vehiclesData[0].id);
          
          // Now load infractions for this vehicle
          const infractionData = await supabase
            .from('infractions')
            .select('*')
            .eq('vehicle_id', vehiclesData[0].id)
            .eq('status', 'pending');
          
          if (infractionData.data) {
            setInfractions(infractionData.data as Infraction[]);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seus veículos e infrações.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Handle vehicle change
  const handleVehicleChange = async (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    form.setValue('vehicle_id', vehicleId);
    form.setValue('infraction_id', undefined);
    
    try {
      const { data, error } = await supabase
        .from('infractions')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      setInfractions(data as Infraction[]);
    } catch (error) {
      console.error("Error loading infractions for vehicle:", error);
      toast({
        title: "Erro ao carregar infrações",
        description: "Não foi possível carregar as infrações para o veículo selecionado.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: ProcessFormValues) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para cadastrar um processo.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // If an infraction is selected, use it; otherwise create a new process without an infraction
      const processData = {
        client_id: user.id,
        type: values.type,
        description: values.description,
        status: 'pending',
        ...(values.infraction_id ? { infraction_id: values.infraction_id } : {})
      };

      const { data, error } = await supabase
        .from("processes")
        .insert(processData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Processo cadastrado com sucesso!",
        description: "Seu recurso foi cadastrado e será analisado em breve.",
      });
      
      navigate("/processos");
    } catch (error: any) {
      console.error("Erro ao cadastrar processo:", error);
      toast({
        title: "Erro ao cadastrar processo",
        description: error.message || "Ocorreu um erro ao cadastrar o processo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Novo Recurso</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informações do Recurso</CardTitle>
          <CardDescription>
            Preencha os dados para solicitar um novo recurso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="vehicle_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veículo*</FormLabel>
                    <Select 
                      onValueChange={(value) => handleVehicleChange(value)} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um veículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.brand} {vehicle.model} - {vehicle.plate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="infraction_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Infração (opcional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma infração ou deixe em branco" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma infração (recurso preventivo)</SelectItem>
                        {infractions.map((infraction) => (
                          <SelectItem key={infraction.id} value={infraction.id}>
                            {infraction.auto_number || "Sem número"} - {infraction.description} - R$ {infraction.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Recurso*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de recurso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fine_appeal">Recurso de Multa</SelectItem>
                        <SelectItem value="license_suspension">Suspensão de CNH</SelectItem>
                        <SelectItem value="license_revocation">Cassação de CNH</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Recurso*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva os detalhes do recurso e situação" 
                        rows={5} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/processos")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Recurso"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProcess;
