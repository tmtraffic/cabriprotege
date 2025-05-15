
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "@/schemas/client-schema";
import { FormInputField } from "@/components/form/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader, Search } from "lucide-react";

interface PersonalInfoFormProps {
  form: UseFormReturn<ClientFormValues>;
  isSearchingFines: boolean;
  handleSearchInfractions: () => Promise<void>;
}

export const PersonalInfoForm = ({ 
  form, 
  isSearchingFines, 
  handleSearchInfractions 
}: PersonalInfoFormProps) => {
  return (
    <div className="space-y-4">
      <FormInputField name="client_type" label="Tipo de Cliente">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Particular</SelectItem>
            <SelectItem value="uber">Motorista de Aplicativo</SelectItem>
            <SelectItem value="taxi">Taxista</SelectItem>
            <SelectItem value="truck">Caminhoneiro</SelectItem>
            <SelectItem value="company">Empresa</SelectItem>
          </SelectContent>
        </Select>
      </FormInputField>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInputField name="name" label="Nome Completo">
          <Input placeholder="Nome completo do cliente" />
        </FormInputField>
        <FormInputField name="cpf_cnpj" label="CPF">
          <div className="flex gap-2">
            <Input placeholder="000.000.000-00" />
            <button 
              type="button" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={handleSearchInfractions}
              disabled={isSearchingFines}
            >
              {isSearchingFines ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Verificar</span>
            </button>
          </div>
        </FormInputField>
        <FormInputField name="birth_date" label="Data de Nascimento">
          <Input type="date" />
        </FormInputField>
        <FormInputField name="gender" label="Gênero">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Feminino</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
              <SelectItem value="not-informed">Prefiro não informar</SelectItem>
            </SelectContent>
          </Select>
        </FormInputField>
      </div>
      
      {form.watch("client_type") === "company" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <FormInputField name="company_name" label="Razão Social">
            <Input placeholder="Razão social da empresa" />
          </FormInputField>
        </div>
      )}
      
      {(form.watch("client_type") === "uber" || form.watch("client_type") === "taxi" || form.watch("client_type") === "truck") && (
        <div className="pt-4 border-t">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {form.watch("client_type") === "uber" && "Motoristas de aplicativo precisam apresentar comprovante de cadastro no aplicativo."}
              {form.watch("client_type") === "taxi" && "Taxistas precisam apresentar permissão ou alvará de táxi."}
              {form.watch("client_type") === "truck" && "Caminhoneiros precisam apresentar documentação do veículo de carga."}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};
