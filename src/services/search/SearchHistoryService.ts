
import { supabase } from '@/integrations/supabase/client';
import { SearchHistory, SearchResultDataJson, UfOption } from '@/models/SearchHistory';

// Helper function to safely convert data to JSON-compatible format
const toJsonSafe = (data: any): any => {
  if (data === null || data === undefined) {
    return null;
  }
  
  if (typeof data === 'object') {
    // Convert Date objects to strings
    if (data instanceof Date) {
      return data.toISOString();
    }
    
    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(toJsonSafe);
    }
    
    // Handle plain objects
    const result: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = toJsonSafe(data[key]);
      }
    }
    return result;
  }
  
  return data;
};

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
      
      // Create a simplified result data object
      const resultDataJson: SearchResultDataJson = {
        success: resultData.success,
        error: resultData.error
      };
      
      // Safely convert complex data to JSON-safe format
      if (resultData.data) {
        resultDataJson.data = toJsonSafe(resultData.data);
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
      return data as SearchHistory[] || [];
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
