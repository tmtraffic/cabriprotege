import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const vehicleSchema = z.object({
  plate: z.string().min(7, "Placa deve ter pelo menos 7 caracteres").max(8, "Placa não pode ter mais que 8 caracteres"),
  renavam: z.string().min(9, "Renavam deve ter pelo menos 9 caracteres").optional().or(z.literal("")),
  brand: z.string().min(2, "Marca deve ter pelo menos 2 caracteres"),
  model: z.string().min(2, "Modelo deve ter pelo menos 2 caracteres"),
  year: z.coerce.number().min(1900, "Ano deve ser maior que 1900").max(new Date().getFullYear() + 1, "Ano não pode ser no futuro"),
  color: z.string().min(2, "Cor deve ter pelo menos 2 caracteres").optional().or(z.literal("")),
  professional_use: z.boolean().default(false),
  category: z.string().min(1, "Categoria é obrigatória"),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

const NewVehicle = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plate: "",
      renavam: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      professional_use: false,
      category: "B",
    },
  });

  const onSubmit = async (values: VehicleFormValues) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para cadastrar um veículo.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .insert({
          brand: values.brand || "",  // Make sure these required fields have fallback values
          model: values.model || "",
          plate: values.plate || "",
          owner_id: user.id,
          year: values.year ? Number(values.year) : undefined,
          color: values.color,
          category: values.category,
          renavam: values.renavam,
          professional_use: values.professional_use
        })
        .select();

      if (error) throw error;

      toast({
        title: "Veículo cadastrado com sucesso!",
        description: `${values.brand} ${values.model} - Placa: ${values.plate}`,
      });
      
      navigate("/veiculos");
    } catch (error: any) {
      console.error("Erro ao cadastrar veículo:", error);
      toast({
        title: "Erro ao cadastrar veículo",
        description: error.message || "Ocorreu um erro ao cadastrar o veículo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Novo Veículo</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informações do Veículo</CardTitle>
          <CardDescription>
            Preencha os dados do veículo para cadastro no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="plate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa*</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC-1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="renavam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Renavam</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678901" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca*</FormLabel>
                      <FormControl>
                        <Input placeholder="Honda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo*</FormLabel>
                      <FormControl>
                        <Input placeholder="Civic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano*</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <FormControl>
                        <Input placeholder="Preto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A - Motocicletas</SelectItem>
                          <SelectItem value="B">B - Automóveis</SelectItem>
                          <SelectItem value="C">C - Caminhões</SelectItem>
                          <SelectItem value="D">D - Ônibus</SelectItem>
                          <SelectItem value="E">E - Veículos pesados</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="professional_use"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Uso profissional</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Este veículo é utilizado para atividade profissional (táxi, aplicativo, etc)
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/veiculos")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Cadastrando..." : "Cadastrar Veículo"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewVehicle;
