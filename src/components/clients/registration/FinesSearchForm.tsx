
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "@/schemas/client-schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface FinesSearchFormProps {
  form: UseFormReturn<ClientFormValues>;
  isSearchingFines: boolean;
  showResults: boolean;
  searchResults?: any;
  handleSearchInfractions: () => Promise<void>;
}

export const FinesSearchForm = ({ 
  form, 
  isSearchingFines, 
  showResults, 
  searchResults,
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
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Pesquisando...
            </>
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
          <LoadingSpinner size="lg" className="mr-3" />
          <p>Consultando bancos de dados oficiais...</p>
        </div>
      )}
      
      {showResults && !isSearchingFines && searchResults && (
        <div className="space-y-4">
          {searchResults.error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro na consulta</AlertTitle>
              <AlertDescription>
                {searchResults.details || searchResults.error}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Resultados da Busca</h3>
              <p className="text-sm">
                {searchResults.data && searchResults.data.fines && searchResults.data.fines.length > 0
                  ? `Foram encontradas ${searchResults.data.fines.length} multas associadas a este CPF/CNH.`
                  : "Não foram encontradas multas associadas a este CPF/CNH."}
              </p>
              
              {/* If we have fines, display them */}
              {searchResults.data && searchResults.data.fines && searchResults.data.fines.length > 0 && (
                <div className="mt-4 space-y-2">
                  {searchResults.data.fines.map((fine: any, index: number) => (
                    <div key={index} className="border p-3 rounded-lg bg-background">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{fine.auto_number || `Multa #${index + 1}`}</p>
                          <p className="text-xs text-muted-foreground">{fine.infraction_description || fine.description || "Descrição não disponível"}</p>
                          <p className="text-xs mt-1">
                            {fine.vehicle_plate && `Placa: ${fine.vehicle_plate}`}
                            {fine.date && ` | Data: ${new Date(fine.date).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {fine.value 
                              ? `R$ ${typeof fine.value === 'number' 
                                  ? fine.value.toFixed(2).replace('.', ',') 
                                  : fine.value}`
                              : "Valor não disponível"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {!searchResults.error && searchResults.data && searchResults.data.fines && searchResults.data.fines.length > 0 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <p className="text-sm">
                Total de multas encontradas: {searchResults.data.fines.length}
              </p>
              <Button>
                Incluir Todas no Cadastro
              </Button>
            </div>
          )}
        </div>
      )}
      
      {!isSearchingFines && (!showResults || !searchResults) && (
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
