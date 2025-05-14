
import { supabase } from '@/integrations/supabase/client';
import { SearchHistory, SearchResultDataJson, UfOption } from '@/models/SearchHistory';
import { toJsonSafe } from '@/lib/jsonUtils';

export const SearchHistoryService = {
  /**
   * Saves search history record to the database
   */
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
      
      // Convert result data to JSON-safe format
      const safeData = toJsonSafe(resultData.data);
      
      // Create a JSON serializable object for the database
      const dbRecord = {
        search_type: searchType,
        search_query: searchQuery,
        user_id: user.id,
        result_data: {
          success: resultData.success,
          error: resultData.error,
          data: safeData
        },
        uf: uf
      };
      
      await supabase.from('search_history').insert(dbRecord);
    } catch (error) {
      console.error("Erro ao salvar histórico de busca:", error);
    }
  },
  
  /**
   * Retrieves search history with optional filtering
   */
  async getSearchHistory(filters: { searchType?: 'cnh' | 'vehicle', uf?: string } = {}): Promise<SearchHistory[]> {
    try {
      let query = supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters if provided
      if (filters.searchType) {
        query = query.eq('search_type', filters.searchType);
      }
      
      if (filters.uf) {
        query = query.eq('uf', filters.uf);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Convert the raw database records to the expected SearchHistory type
      const searchHistory: SearchHistory[] = data?.map((record): SearchHistory => {
        // Ensure result_data has the required structure
        const resultData: SearchResultDataJson = {
          success: false, // Default value
          ...record.result_data
        };
        
        return {
          id: record.id,
          search_type: record.search_type,
          search_query: record.search_query,
          user_id: record.user_id,
          result_data: resultData,
          uf: record.uf,
          related_client_id: record.related_client_id,
          related_vehicle_id: record.related_vehicle_id,
          created_at: record.created_at,
          updated_at: record.updated_at
        };
      }) || [];
      
      return searchHistory;
    } catch (error) {
      console.error("Erro ao obter histórico de busca:", error);
      return [];
    }
  },
  
  /**
   * Updates search history with related client or vehicle ID
   */
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
  
  /**
   * Exports search history to CSV format
   */
  async exportSearchHistory(filters: { searchType?: 'cnh' | 'vehicle', uf?: string } = {}): Promise<string> {
    try {
      const history = await this.getSearchHistory(filters);
      
      if (!history || history.length === 0) {
        throw new Error("Nenhum registro encontrado para exportar");
      }
      
      // Define CSV header
      let csv = "ID,Tipo,Consulta,UF,Data,Cliente,Veículo\n";
      
      // Create CSV rows
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
