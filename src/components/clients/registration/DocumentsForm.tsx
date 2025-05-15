
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "@/schemas/client-schema";
import { FormInputField } from "@/components/form/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DocumentsFormProps {
  form: UseFormReturn<ClientFormValues>;
}

export const DocumentsForm = ({ form }: DocumentsFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInputField name="cnh_number" label="Número da CNH">
          <div className="flex gap-2">
            <Input placeholder="00000000000" />
            <Button 
              type="button" 
              variant="outline"
            >
              <Search className="h-4 w-4 mr-2" />
              Verificar
            </Button>
          </div>
        </FormInputField>
        <FormInputField name="cnh_category" label="Categoria">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
              <SelectItem value="b">B</SelectItem>
              <SelectItem value="ab">AB</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="d">D</SelectItem>
              <SelectItem value="e">E</SelectItem>
            </SelectContent>
          </Select>
        </FormInputField>
        <FormInputField name="cnh_expiration_date" label="Data de Validade">
          <Input type="date" />
        </FormInputField>
        <FormInputField name="cnh_issue_date" label="Data de Emissão">
          <Input type="date" />
        </FormInputField>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-2">Upload de Documentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="upload-cnh">CNH (frente e verso)</Label>
            <Input id="upload-cnh" type="file" />
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload-cpf">CPF</Label>
            <Input id="upload-cpf" type="file" />
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload-address">Comprovante de Residência</Label>
            <Input id="upload-address" type="file" />
            <p className="text-xs text-muted-foreground">
              Conta de luz, água ou telefone (últimos 3 meses)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload-other">Outros Documentos</Label>
            <Input id="upload-other" type="file" multiple />
            <p className="text-xs text-muted-foreground">
              Documentos adicionais relevantes para o caso
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
