import { supabase } from '@/integrations/supabase/client';
import { SearchResultCNH, SearchResultVehicle, SearchResultFine, SearchHistory, AdditionalSearchParams, UfOption } from '@/models/SearchHistory';
import { toast } from '@/components/ui/use-toast';

const InfoSimplesService = {
  // Função para pesquisar CNH
  async searchCNH(cnhNumber: string, uf: UfOption = 'SP', additionalParams: AdditionalSearchParams = {}): Promise<SearchResultCNH | null> {
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
      
      // Corrigido para evitar a recursão de tipos
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
      
      // Salvar no histórico de busca
      await this.saveSearchHistory('cnh', cnhNumber, { 
        success: true, 
        data: result 
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
  },
  
  // Função para pesquisar veículo
  async searchVehicle(plate: string, uf: UfOption = 'SP', additionalParams: AdditionalSearchParams = {}): Promise<SearchResultVehicle | null> {
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
      await this.saveSearchHistory('vehicle', plate, {
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
  },
  
  // Função auxiliar para salvar histórico de busca
  async saveSearchHistory(
    searchType: 'cnh' | 'vehicle',
    searchQuery: string,
    resultData: any,
    uf?: string
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      await supabase.from('search_history').insert({
        search_type: searchType,
        search_query: searchQuery,
        user_id: user.id,
        result_data: resultData,
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
      const updates: any = {};
      
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
  },
  
  // Mock function para gerar amostras de multas (mantida para compatibilidade)
  getMockFines(): SearchResultFine[] {
    return [
      {
        id: "1",
        autoNumber: "I41664643",
        date: "05/10/2020 10:15",
        agency: "RENAINF",
        plate: "KXC2317",
        owner: "ALEXANDER FLORENTINO DE SOUZA",
        respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
        situation: "Penalidade - Paga em: 06/08/2020 NOTIFICADA DA PENALIDADE",
        infraction: "74550 - TRANSITAR EM VELOCIDADE SUPERIOR À MÁXIMA PERMITIDA EM ATÉ 20%",
        location: "BR101 KM 426.2 - MANGARATIBA",
        frame: "218 INC I - MÉDIA",
        points: 4,
        dueDate: "08/10/2021",
        value: 130.16,
        discountValue: 104.12,
        process: "-"
      },
      {
        id: "2",
        autoNumber: "E43789654",
        date: "15/01/2021 08:30",
        agency: "DETRAN RJ",
        plate: "KXC2317",
        owner: "ALEXANDER FLORENTINO DE SOUZA",
        respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
        situation: "Penalidade - Notificada",
        infraction: "60503 - ESTACIONAR EM LOCAL PROIBIDO",
        location: "AV BRASIL 1250 - RIO DE JANEIRO",
        frame: "181 INC XVII - LEVE",
        points: 3,
        dueDate: "20/03/2021",
        value: 88.38,
        discountValue: 70.70,
        process: "-"
      },
      {
        id: "3",
        autoNumber: "B12398745",
        date: "10/03/2021 17:45",
        agency: "GUARDA MUNICIPAL",
        plate: "KXC2317",
        owner: "ALEXANDER FLORENTINO DE SOUZA",
        respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
        situation: "Autuação - Em processamento",
        infraction: "73662 - AVANÇAR O SINAL VERMELHO DO SEMÁFORO",
        location: "RUA VOLUNTÁRIOS DA PÁTRIA - BOTAFOGO",
        frame: "208 - GRAVÍSSIMA",
        points: 7,
        dueDate: "15/05/2021",
        value: 293.47,
        discountValue: 234.78,
        process: "P202103456"
      }
    ];
  }
};

export default InfoSimplesService;
