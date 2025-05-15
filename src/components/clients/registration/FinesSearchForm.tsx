
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "@/schemas/client-schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FinesSearchFormProps {
  form: UseFormReturn<ClientFormValues>;
  isSearchingFines: boolean;
  showResults: boolean;
  handleSearchInfractions: () => Promise<void>;
}

export const FinesSearchForm = ({ 
  form, 
  isSearchingFines, 
  showResults, 
  handleSearchInfractions 
}: FinesSearchFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search-fines">CPF/CNH para pesquisa</Label>
          <Input 
            id="search-fines" 
            placeholder="Digite o CPF ou CNH para buscar multas" 
            defaultValue={form.watch("cpf_cnpj")}
            onChange={(e) => form.setValue("cpf_cnpj", e.target.value)}
          />
        </div>
        <Button 
          type="button"
          onClick={handleSearchInfractions}
          disabled={isSearchingFines}
        >
          {isSearchingFines ? (
            <>Pesquisando...</>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Buscar Multas
            </>
          )}
        </Button>
      </div>
      
      {isSearchingFines && (
        <div className="flex justify-center items-center p-8">
          <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin mr-3"></div>
          <p>Consultando bancos de dados oficiais...</p>
        </div>
      )}
      
      {showResults && !isSearchingFines && (
        <div className="space-y-4">
          {/* Fine results will be displayed here */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">Resultados da Busca</h3>
            <p className="text-sm">Foram encontradas multas associadas a este CPF/CNH.</p>
          </div>
          
          {/* This would be mapped from actual API results */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="text-sm">Total de multas encontradas: 0</p>
            <Button>
              Incluir Todas no Cadastro
            </Button>
          </div>
        </div>
      )}
      
      {!isSearchingFines && !showResults && (
        <div className="border rounded-lg flex flex-col items-center justify-center p-8 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma busca realizada</h3>
          <p className="text-muted-foreground max-w-md">
            Digite o CPF ou CNH do cliente e clique em buscar para verificar multas existentes nos sistemas oficiais.
          </p>
        </div>
      )}
    </div>
  );
};
