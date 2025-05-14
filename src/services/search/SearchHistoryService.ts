
import { supabase } from '@/integrations/supabase/client';
import { SearchHistory, SearchResultDataJson, UfOption } from '@/models/SearchHistory';

export const SearchHistoryService = {
  // Função auxiliar para salvar histórico de busca
  async saveSearchHistory(
    searchType: 'cnh' | 'vehicle',
    searchQuery: string,
    resultData: { success: boolean; data?: any; error?: string },
    uf?: string
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Convert to a JSON-safe format before saving to Supabase
      const resultDataJson: SearchResultDataJson = {
        success: resultData.success,
        error: resultData.error
      };
      
      // Convert complex objects to plain objects if they exist
      if (resultData.data) {
        resultDataJson.data = JSON.parse(JSON.stringify(resultData.data));
      }
      
      await supabase.from('search_history').insert({
        search_type: searchType,
        search_query: searchQuery,
        user_id: user.id,
        result_data: resultDataJson,
        uf: uf
      });
    } catch (error) {
      console.error("Erro ao salvar histórico de busca:", error);
    }
  },
  
  // Função para obter histórico de busca
  async getSearchHistory(filters: { searchType?: 'cnh' | 'vehicle', uf?: string } = {}): Promise<SearchHistory[]> {
    try {
      let query = supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Aplicar filtros se fornecidos
      if (filters.searchType) {
        query = query.eq('search_type', filters.searchType);
      }
      
      if (filters.uf) {
        query = query.eq('uf', filters.uf);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as SearchHistory[] || [];
    } catch (error) {
      console.error("Erro ao obter histórico de busca:", error);
      return [];
    }
  },
  
  // Função para atualizar histórico de busca com cliente ou veículo relacionado
  async updateSearchHistory(
    searchId: string,
    relatedClientId?: string,
    relatedVehicleId?: string
  ): Promise<void> {
    try {
      const updates: Record<string, any> = {};
      
      if (relatedClientId) {
        updates.related_client_id = relatedClientId;
      }
      
      if (relatedVehicleId) {
        updates.related_vehicle_id = relatedVehicleId;
      }
      
      await supabase
        .from('search_history')
        .update(updates)
        .eq('id', searchId);
    } catch (error) {
      console.error("Erro ao atualizar histórico de busca:", error);
    }
  },
  
  // Função para exportar histórico de busca em CSV
  async exportSearchHistory(filters: { searchType?: 'cnh' | 'vehicle', uf?: string } = {}): Promise<string> {
    try {
      const history = await this.getSearchHistory(filters);
      
      if (!history || history.length === 0) {
        throw new Error("Nenhum registro encontrado para exportar");
      }
      
      let csv = "ID,Tipo,Consulta,UF,Data,Cliente,Veículo\n";
      
      history.forEach(item => {
        const row = [
          item.id,
          item.search_type === 'cnh' ? 'CNH' : 'Veículo',
          item.search_query,
          item.uf || 'SP',
          new Date(item.created_at).toLocaleString(),
          item.related_client_id || '',
          item.related_vehicle_id || ''
        ];
        
        csv += row.join(',') + '\n';
      });
      
      return csv;
    } catch (error) {
      console.error("Erro ao exportar histórico:", error);
      throw error;
    }
  }
};
