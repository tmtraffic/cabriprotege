
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "@/schemas/client-schema";
import { FormInputField } from "@/components/form/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ContactInfoFormProps {
  form: UseFormReturn<ClientFormValues>;
}

export const ContactInfoForm = ({ form }: ContactInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInputField name="email" label="Email">
          <Input type="email" placeholder="email@exemplo.com" />
        </FormInputField>
        <FormInputField name="phone" label="Telefone Celular">
          <Input placeholder="(00) 00000-0000" />
        </FormInputField>
        <FormInputField name="whatsapp" label="WhatsApp (se diferente do celular)">
          <Input placeholder="(00) 00000-0000" />
        </FormInputField>
        <FormInputField name="secondary_phone" label="Telefone Secundário">
          <Input placeholder="(00) 00000-0000" />
        </FormInputField>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-2">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-4 space-y-2">
            <FormInputField name="address_street" label="Rua">
              <Input placeholder="Nome da rua" />
            </FormInputField>
          </div>
          <div className="md:col-span-2 space-y-2">
            <FormInputField name="address_number" label="Número">
              <Input placeholder="123" />
            </FormInputField>
          </div>
          <div className="md:col-span-3 space-y-2">
            <FormInputField name="address_complement" label="Complemento">
              <Input placeholder="Apto, Bloco, etc." />
            </FormInputField>
          </div>
          <div className="md:col-span-3 space-y-2">
            <FormInputField name="address_neighborhood" label="Bairro">
              <Input placeholder="Nome do bairro" />
            </FormInputField>
          </div>
          <div className="md:col-span-3 space-y-2">
            <FormInputField name="address_city" label="Cidade">
              <Input placeholder="Nome da cidade" defaultValue="Rio de Janeiro" />
            </FormInputField>
          </div>
          <div className="md:col-span-2 space-y-2">
            <FormInputField name="address_state" label="Estado">
              <Input defaultValue="RJ" disabled />
            </FormInputField>
          </div>
          <div className="md:col-span-1 space-y-2">
            <FormInputField name="address_zip" label="CEP">
              <Input placeholder="00000-000" />
            </FormInputField>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t space-y-2">
        <Label htmlFor="communication-preferences">Preferências de Comunicação</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="pref-email" 
              checked={form.watch("communication_preferences.email")}
              onCheckedChange={(checked) => {
                form.setValue("communication_preferences.email", !!checked);
              }}
            />
            <Label htmlFor="pref-email" className="font-normal cursor-pointer">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="pref-sms" 
              checked={form.watch("communication_preferences.sms")}
              onCheckedChange={(checked) => {
                form.setValue("communication_preferences.sms", !!checked);
              }}
            />
            <Label htmlFor="pref-sms" className="font-normal cursor-pointer">SMS</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="pref-whatsapp" 
              checked={form.watch("communication_preferences.whatsapp")}
              onCheckedChange={(checked) => {
                form.setValue("communication_preferences.whatsapp", !!checked);
              }}
            />
            <Label htmlFor="pref-whatsapp" className="font-normal cursor-pointer">WhatsApp</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="pref-phone" 
              checked={form.watch("communication_preferences.phone")}
              onCheckedChange={(checked) => {
                form.setValue("communication_preferences.phone", !!checked);
              }}
            />
            <Label htmlFor="pref-phone" className="font-normal cursor-pointer">Ligação Telefônica</Label>
          </div>
        </div>
      </div>
    </div>
  );
};
