
import * as z from "zod";

export const clientSchema = z.object({
  client_type: z.string().default("individual"),
  name: z.string().min(1, "Nome é obrigatório"),
  cpf_cnpj: z.string().min(11, "CPF/CNPJ deve ter no mínimo 11 caracteres").max(18),
  birth_date: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  email: z.string().email("Email inválido").optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  secondary_phone: z.string().optional().nullable(),
  address_street: z.string().optional().nullable(),
  address_number: z.string().optional().nullable(),
  address_complement: z.string().optional().nullable(),
  address_neighborhood: z.string().optional().nullable(),
  address_city: z.string().default("Rio de Janeiro").optional().nullable(),
  address_state: z.string().default("RJ").optional().nullable(),
  address_zip: z.string().optional().nullable(),
  cnh_number: z.string().optional().nullable(),
  cnh_category: z.string().optional().nullable(),
  cnh_expiration_date: z.string().optional().nullable(),
  cnh_issue_date: z.string().optional().nullable(),
  communication_preferences: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    whatsapp: z.boolean().default(true),
    phone: z.boolean().default(false),
  }).optional().nullable(),
  notes: z.string().optional().nullable()
});

export type ClientFormValues = z.infer<typeof clientSchema>;
