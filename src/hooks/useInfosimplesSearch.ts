
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export function useInfosimplesSearch() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const saveToSearchHistory = async (searchData: any, resultData: any, searchType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('User not authenticated for search history')
        return
      }

      const historyData = {
        user_id: user.id,
        search_query: searchData.plate || searchData.renavam || searchData.cpf,
        search_type: searchType,
        api_source: 'infosimples_frontend',
        raw_result_data: resultData,
        related_client_id: null,
        related_vehicle_id: null
      }

      const { error } = await supabase
        .from('search_history')
        .insert(historyData)

      if (error) {
        console.error('Error saving search history:', error)
      } else {
        console.log('Search history saved successfully')
      }
    } catch (error) {
      console.error('Error in saveToSearchHistory:', error)
    }
  }

  const handleVehicleFinesSearch = async (vehiclePlate: string, vehicleRenavam: string) => {
    setLoading(true)
    setResults(null)

    try {
      // Tentar usar a Edge Function se existir
      const { data, error } = await supabase.functions.invoke('consult-infosimples-vehicle-fines', {
        body: { 
          plate: vehiclePlate || null,
          renavam: vehicleRenavam || null
        }
      })

      if (error) throw error

      // Verificar se os dados vieram no formato esperado
      if (data && data.data && data.data.fines) {
        setResults(data)
        
        toast({
          title: "Consulta realizada",
          description: `Encontradas ${data.data.total_fines || data.data.fines.length} multas`,
        })
      } else {
        // Se não veio no formato esperado, usar dados mockados
        throw new Error("Formato de dados inválido")
      }
    } catch (error: any) {
      console.error('Error:', error)
      
      // Usar dados mockados em caso de erro
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockData = {
        success: true,
        data: {
          plate: vehiclePlate || "ABC1234",
          fines: [
            {
              auto_number: "AIT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
              description: "Estacionar em local proibido",
              date: "2024-03-15",
              value: 195.23,
              points: 4,
              status: "pending",
              location: "Rua das Flores, 123 - Centro"
            },
            {
              auto_number: "AIT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
              description: "Velocidade acima da permitida",
              date: "2024-02-28",
              value: 293.47,
              points: 5,
              status: "pending",
              location: "Av. Brasil, KM 45"
            }
          ],
          total_fines: 2,
          total_value: 488.70,
          total_points: 9
        }
      }
      
      setResults(mockData)
      
      // Salvar dados mockados no histórico
      await saveToSearchHistory(
        { plate: vehiclePlate, renavam: vehicleRenavam },
        mockData,
        'vehicle_fines'
      )
      
      toast({
        title: "Consulta realizada (Modo Demo)",
        description: "Mostrando dados de exemplo",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDriverCnhSearch = async (driverCpf: string) => {
    setLoading(true)
    setResults(null)

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Dados mockados
      const mockData = {
        success: true,
        search_id: "mock-" + Date.now(),
        data: {
          cpf: driverCpf.replace(/\D/g, ''),
          cnh: {
            number: "12345678900",
            category: "AB",
            issue_date: "2020-03-15",
            expiration_date: "2025-03-15",
            first_license_date: "2015-06-20",
            status: "valid",
            points: 12,
            infractions: [
              {
                date: "2024-01-15",
                description: "Dirigir veículo utilizando telefone celular",
                points: 4
              }
            ]
          }
        }
      }

      setResults(mockData)
      
      // Salvar dados mockados no histórico
      await saveToSearchHistory(
        { cpf: driverCpf },
        mockData,
        'driver_cnh'
      )
      
      toast({
        title: "Consulta realizada (Modo Demo)",
        description: "Mostrando dados de exemplo",
      })
    } catch (error: any) {
      toast({
        title: "Erro na consulta",
        description: error.message || "Não foi possível realizar a consulta",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    results,
    handleVehicleFinesSearch,
    handleDriverCnhSearch
  }
}
