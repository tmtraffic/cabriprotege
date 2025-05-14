
import { supabase } from '@/integrations/supabase/client';
import { SearchResultCNH, UfOption, AdditionalSearchParams } from '@/models/SearchHistory';
import { toast } from '@/hooks/use-toast';
import { SearchHistoryService } from './SearchHistoryService';

export const CNHService = {
  async search(cnhNumber: string, uf: UfOption = 'SP', additionalParams: AdditionalSearchParams = {}): Promise<SearchResultCNH | null> {
    try {
      // Validar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Chamada para a Edge Function
      const { data, error } = await supabase.functions.invoke('infosimples-api', {
        body: {
          searchType: 'cnh',
          searchQuery: cnhNumber,
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
      
      // Criar o resultado
      const result: SearchResultCNH = {
        name: data.data.name,
        cnh: data.data.cnh,
        category: data.data.category,
        status: data.data.status,
        expirationDate: data.data.expirationDate,
        points: data.data.points,
        fines: data.data.fines || [],
        uf: uf
      };
      
      // Salvar no histórico de busca com resultados simplificados para evitar problemas de serialização
      await SearchHistoryService.saveSearchHistory('cnh', cnhNumber, { 
        success: true, 
        data: {
          name: result.name,
          cnh: result.cnh,
          category: result.category,
          status: result.status,
          expirationDate: result.expirationDate,
          points: result.points,
          finesCount: (result.fines || []).length
        }
      }, uf);
      
      return result;
    } catch (error) {
      console.error("Erro ao pesquisar CNH:", error);
      toast({
        variant: "destructive",
        title: "Erro na consulta",
        description: error.message || "Ocorreu um erro ao consultar a API. Tente novamente mais tarde."
      });
      throw error;
    }
  }
};
