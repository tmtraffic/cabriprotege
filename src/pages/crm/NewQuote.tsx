
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

const quoteSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  client_id: z.string().min(1, "Cliente é obrigatório"),
  amount: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  expiration_date: z.date({
    required_error: "Data de validade é obrigatória",
  }),
  status: z.string().min(1, "Status é obrigatório"),
  service_type: z.string().min(1, "Tipo de serviço é obrigatório"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const NewQuote = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<{id: string, name: string}[]>([]);
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  
  useEffect(() => {
    // Fetch clients for the dropdown
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name")
          .eq("role", "client");
        
        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    };
    
    fetchClients();
  }, []);
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      title: "",
      client_id: "",
      amount: 0,
      expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "draft",
      service_type: "fine_appeal",
      description: "",
    },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para cadastrar um orçamento.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Since we don't have a quotes table yet, we would ideally create this table first
      // For now, let's simulate saving the quote by showing a toast message
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "O módulo de orçamentos está sendo implementado. A tabela 'quotes' precisa ser criada no banco de dados.",
      });
      
      // We would normally do this:
      // const { data, error } = await supabase
      //   .from("quotes")
      //   .insert({
      //     title: values.title,
      //     client_id: values.client_id,
      //     creator_id: user.id,
      //     amount: values.amount,
      //     expiration_date: values.expiration_date.toISOString(),
      //     status: values.status,
      //     service_type: values.service_type,
      //     description: values.description,
      //   })
      //   .select();

      navigate("/crm");
    } catch (error: any) {
      console.error("Erro ao cadastrar orçamento:", error);
      toast({
        title: "Erro ao cadastrar orçamento",
        description: error.message || "Ocorreu um erro ao cadastrar o orçamento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Novo Orçamento</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/crm")}
        >
          Voltar para CRM
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Criar Orçamento</CardTitle>
          <CardDescription>
            Registre um novo orçamento para um cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título*</FormLabel>
                      <FormControl>
                        <Input placeholder="Título do orçamento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          step="0.01" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiration_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Validade*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date()
                            }
                            initialFocus
                            className="pointer-events-auto" 
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="sent">Enviado</SelectItem>
                          <SelectItem value="accepted">Aceito</SelectItem>
                          <SelectItem value="rejected">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="service_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Serviço*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fine_appeal">Recurso de Multa</SelectItem>
                          <SelectItem value="license_suspension">Suspensão de CNH</SelectItem>
                          <SelectItem value="license_revocation">Cassação de CNH</SelectItem>
                          <SelectItem value="document_registration">Registro de Documentos</SelectItem>
                          <SelectItem value="vehicle_acquisition">Aquisição de Veículo</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalhes do orçamento e serviços incluídos" 
                        rows={5} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/crm")}
          >
            Cancelar
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Salvando..."
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Gerar Orçamento
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewQuote;
