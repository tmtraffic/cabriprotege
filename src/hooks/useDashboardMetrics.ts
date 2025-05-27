
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface DashboardMetrics {
  totalClients: number
  todaySearches: number
  activeProcesses: number
  totalVehicles: number
  searchTypes: Array<{ type: string; count: number }>
  dailySearches: Array<{ date: string; count: number }>
  recentSearches: Array<{
    id: string
    search_type: string
    search_query: string
    created_at: string
    user_name?: string
  }>
  recentClients: Array<{
    id: string
    name: string
    email: string
    created_at: string
  }>
}

export function useDashboardMetrics() {
  const { toast } = useToast()
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    todaySearches: 0,
    activeProcesses: 0,
    totalVehicles: 0,
    searchTypes: [],
    dailySearches: [],
    recentSearches: [],
    recentClients: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      setLoading(true)

      // Buscar total de clientes
      const { count: totalClients } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client')

      // Buscar consultas de hoje
      const today = new Date().toISOString().split('T')[0]
      const { count: todaySearches } = await supabase
        .from('search_history')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`)

      // Buscar processos ativos
      const { count: activeProcesses } = await supabase
        .from('processes')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'in_progress'])

      // Buscar total de veículos
      const { count: totalVehicles } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })

      // Buscar distribuição por tipo de consulta
      const { data: searchTypesData } = await supabase
        .from('search_history')
        .select('search_type')

      const searchTypesMap = new Map()
      searchTypesData?.forEach(item => {
        const type = item.search_type === 'vehicle_fines' ? 'Multas' :
                    item.search_type === 'driver_cnh' ? 'CNH' :
                    item.search_type === 'vehicle_crlv' ? 'CRLV' : 'Outros'
        searchTypesMap.set(type, (searchTypesMap.get(type) || 0) + 1)
      })

      const searchTypes = Array.from(searchTypesMap.entries()).map(([type, count]) => ({
        type,
        count
      }))

      // Buscar consultas dos últimos 7 dias
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { data: dailyData } = await supabase
        .from('search_history')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true })

      const dailyMap = new Map()
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        dailyMap.set(dateStr, 0)
      }

      dailyData?.forEach(item => {
        const date = new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        if (dailyMap.has(date)) {
          dailyMap.set(date, dailyMap.get(date) + 1)
        }
      })

      const dailySearches = Array.from(dailyMap.entries()).map(([date, count]) => ({
        date,
        count
      }))

      // Buscar 5 últimas consultas
      const { data: recentSearchesData } = await supabase
        .from('search_history')
        .select(`
          id,
          search_type,
          search_query,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      // Buscar nomes dos usuários para as consultas recentes
      const userIds = recentSearchesData?.map(s => s.user_id).filter(Boolean) || []
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds)

      const usersMap = new Map(usersData?.map(u => [u.id, u.name]) || [])

      const recentSearches = recentSearchesData?.map(search => ({
        ...search,
        user_name: usersMap.get(search.user_id) || 'Usuário desconhecido'
      })) || []

      // Buscar 5 últimos clientes
      const { data: recentClientsData } = await supabase
        .from('profiles')
        .select('id, name, email, created_at')
        .eq('role', 'client')
        .order('created_at', { ascending: false })
        .limit(5)

      setMetrics({
        totalClients: totalClients || 0,
        todaySearches: todaySearches || 0,
        activeProcesses: activeProcesses || 0,
        totalVehicles: totalVehicles || 0,
        searchTypes,
        dailySearches,
        recentSearches,
        recentClients: recentClientsData || []
      })

    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
      toast({
        title: "Erro ao carregar métricas",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return { metrics, loading, refreshMetrics: fetchMetrics }
}
