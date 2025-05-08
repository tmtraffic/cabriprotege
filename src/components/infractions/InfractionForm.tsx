
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Infraction } from '@/pages/infractions/InfractionService';

// Schema de validação
const infractionSchema = z.object({
  vehiclePlate: z.string().min(1, "A placa do veículo é obrigatória").regex(/^[A-Z0-9]{7}$/, "Formato inválido (ex: ABC1234)"),
  driverDocument: z.string().optional(),
  infractionCode: z.string().min(1, "O código da infração é obrigatório"),
  infractionDescription: z.string().min(1, "A descrição da infração é obrigatória"),
  location: z.string().min(1, "O local da infração é obrigatório"),
  date: z.string().min(1, "A data da infração é obrigatória"),
  time: z.string().min(1, "A hora da infração é obrigatória"),
  agent: z.string().min(1, "O agente de trânsito é obrigatório"),
  severity: z.enum(['light', 'medium', 'serious', 'very-serious']),
  points: z.number().min(0, "Os pontos devem ser um valor positivo").max(10, "Os pontos não podem exceder 10"),
  value: z.number().min(0, "O valor deve ser positivo"),
});

type InfractionFormValues = z.infer<typeof infractionSchema>;

interface InfractionFormProps {
  onSubmit: (data: Omit<Infraction, 'id' | 'status'>) => void;
}

const InfractionForm: React.FC<InfractionFormProps> = ({ onSubmit }) => {
  const form = useForm<InfractionFormValues>({
    resolver: zodResolver(infractionSchema),
    defaultValues: {
      vehiclePlate: '',
      driverDocument: '',
      infractionCode: '',
      infractionDescription: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      agent: '',
      severity: 'medium',
      points: 3,
      value: 0,
    },
  });

  const handleSubmit = (values: InfractionFormValues) => {
    // Combina a data e hora em um objeto Date
    const [year, month, day] = values.date.split('-').map(Number);
    const [hours, minutes] = values.time.split(':').map(Number);
    const dateTime = new Date(year, month - 1, day, hours, minutes);

    // Formata os dados para o formato esperado pelo serviço
    const infractionData: Omit<Infraction, 'id' | 'status'> = {
      vehiclePlate: values.vehiclePlate.toUpperCase(),
      driverDocument: values.driverDocument || undefined,
      infractionCode: values.infractionCode,
      infractionDescription: values.infractionDescription,
      location: values.location,
      date: dateTime,
      agent: values.agent,
      severity: values.severity,
      points: values.points,
      value: values.value,
    };

    onSubmit(infractionData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dados do veículo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dados do veículo</h3>
            
            <FormField
              control={form.control}
              name="vehiclePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa do veículo *</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="driverDocument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento do condutor (se identificado)</FormLabel>
                  <FormControl>
                    <Input placeholder="CPF do condutor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dados da Infração */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dados da infração</h3>
            
            <FormField
              control={form.control}
              name="infractionCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código da infração *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 5010-0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gravidade *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a gravidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Leve</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="serious">Grave</SelectItem>
                      <SelectItem value="very-serious">Gravíssima</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="infractionDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da infração *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Avançar o sinal vermelho" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local da infração *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Av. Paulista, 1000, São Paulo - SP" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="agent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agente *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do agente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pontos na CNH *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="10" 
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Registrar Infração</Button>
        </div>
      </form>
    </Form>
  );
};

export default InfractionForm;
