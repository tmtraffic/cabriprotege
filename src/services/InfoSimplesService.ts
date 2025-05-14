
import { supabase } from '@/integrations/supabase/client';
import { SearchResultCNH, SearchResultVehicle, SearchResultFine, SearchHistory } from '@/models/SearchHistory';

// This would normally be stored in environment variables
const API_BASE_URL = "https://api.infosimples.com/api/v2";

const InfoSimplesService = {
  // Function to search CNH data
  async searchCNH(cnhNumber: string): Promise<SearchResultCNH | null> {
    try {
      // In a real implementation, this would call the InfoSimples API
      // For now, we'll use mock data for demonstration
      
      // Log the search in our history
      const user = supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Mock API call (simulating a delay)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockResult: SearchResultCNH = {
        name: "Tiago Medeiros",
        cnh: cnhNumber,
        category: "AB",
        status: "Regular",
        expirationDate: "10/05/2025",
        points: 12,
        fines: this.getMockFines()
      };
      
      // Save search history
      await this.saveSearchHistory('cnh', cnhNumber, mockResult);
      
      return mockResult;
    } catch (error) {
      console.error("Error searching CNH:", error);
      throw error;
    }
  },
  
  // Function to search vehicle data
  async searchVehicle(plate: string): Promise<SearchResultVehicle | null> {
    try {
      // In a real implementation, this would call the InfoSimples API
      // For now, we'll use mock data for demonstration
      
      // Mock API call (simulating a delay)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockResult: SearchResultVehicle = {
        plate: plate,
        renavam: "01234567890",
        model: "HONDA/CIVIC EXL CVT",
        year: "2019/2020",
        owner: "ALEXANDER FLORENTINO DE SOUZA",
        fines: this.getMockFines()
      };
      
      // Save search history
      await this.saveSearchHistory('vehicle', plate, mockResult);
      
      return mockResult;
    } catch (error) {
      console.error("Error searching vehicle:", error);
      throw error;
    }
  },
  
  // Helper function to save search history
  async saveSearchHistory(
    searchType: 'cnh' | 'vehicle', 
    searchQuery: string, 
    resultData: any
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      await supabase.from('search_history').insert({
        search_type: searchType,
        search_query: searchQuery,
        user_id: user.id,
        result_data: resultData
      });
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  },
  
  // Function to get search history
  async getSearchHistory(): Promise<SearchHistory[]> {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SearchHistory[] || [];
    } catch (error) {
      console.error("Error getting search history:", error);
      return [];
    }
  },
  
  // Function to update search history with related client or vehicle
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
      console.error("Error updating search history:", error);
    }
  },
  
  // Mock function to generate sample fines
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
