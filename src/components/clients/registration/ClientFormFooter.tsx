
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "@/schemas/client-schema";
import { FormInputField } from "@/components/form/form-field";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Car, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClientFormFooterProps {
  form: UseFormReturn<ClientFormValues>;
  associateVehicle: boolean;
  setAssociateVehicle: (value: boolean) => void;
  isLoading: boolean;
  onSubmit: (data: ClientFormValues) => Promise<any>;
}

export const ClientFormFooter = ({ 
  form, 
  associateVehicle, 
  setAssociateVehicle,
  isLoading, 
  onSubmit 
}: ClientFormFooterProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <FormInputField name="notes" label="Observações">
        <Textarea
          placeholder="Informações adicionais sobre o cliente"
          rows={3}
        />
      </FormInputField>
      
      <div className="pt-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="associate-vehicle" 
            checked={associateVehicle}
            onCheckedChange={(checked) => setAssociateVehicle(!!checked)}
          />
          <Label 
            htmlFor="associate-vehicle" 
            className="font-normal cursor-pointer flex items-center"
          >
            <Car className="h-4 w-4 mr-2 text-muted-foreground" />
            Associar veículo ao criar cliente
          </Label>
        </div>
        <p className="text-sm text-muted-foreground pl-6">
          Se marcado, você será redirecionado para cadastro de veículo após salvar o cliente
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" type="button" onClick={() => navigate("/clients")}>
          Cancelar
        </Button>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              onSubmit(form.getValues());
              form.reset();
            }}
          >
            Salvar e Criar Outro
          </Button>
          <LoadingButton isLoading={isLoading} type="submit">
            <Save className="h-4 w-4 mr-2" />
            Salvar Cliente
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};
