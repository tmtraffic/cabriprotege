
import * as z from "zod";

export const vehicleSchema = z.object({
  client_id: z.string().uuid("ID de cliente inválido"),
  vehicle_type: z.string().default("car"),
  plate: z.string().min(1, "Placa é obrigatória").max(7),
  renavam: z.string().min(1, "RENAVAM é obrigatório"),
  chassis: z.string().min(1, "Chassi é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  year: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  engine_number: z.string().optional().nullable(),
  is_owner_client: z.boolean().default(true),
  owner_name: z.string().optional().nullable(),
  owner_cpf: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
