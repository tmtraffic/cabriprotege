
import { supabase } from '@/integrations/supabase/client';
import { SearchResultVehicle, UfOption, AdditionalSearchParams } from '@/models/SearchHistory';
import { toast } from '@/hooks/use-toast';
import { SearchHistoryService } from './SearchHistoryService';

export const VehicleService = {
  async search(plate: string, uf: UfOption = 'SP', additionalParams: AdditionalSearchParams = {}): Promise<SearchResultVehicle | null> {
    try {
      // Validar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Chamada para a Edge Function
      const { data, error } = await supabase.functions.invoke('infosimples-api', {
        body: {
          searchType: 'vehicle',
          searchQuery: plate,
          uf: uf,
          additionalParams
        }
      });
      
      if (error) {
        console.error("Erro na chamada à Edge Function:", error);
        throw new Error(`Erro na consulta: ${error.message}`);
      }
      
      if (!data.success) {
        throw new Error(data.error || "Erro desconhecido na consulta");
      }
      
      // Corrigido para evitar a recursão de tipos
      const result: SearchResultVehicle = {
        plate: data.data.plate,
        renavam: data.data.renavam,
        model: data.data.model,
        year: data.data.year,
        owner: data.data.owner,
        fines: data.data.fines || [],
        uf: uf
      };
      
      // Salvar no histórico de busca
      await SearchHistoryService.saveSearchHistory('vehicle', plate, {
        success: true,
        data: result
      }, uf);
      
      return result;
    } catch (error) {
      console.error("Erro ao pesquisar veículo:", error);
      toast({
        variant: "destructive",
        title: "Erro na consulta",
        description: error.message || "Ocorreu um erro ao consultar a API. Tente novamente mais tarde."
      });
      throw error;
    }
  }
};
