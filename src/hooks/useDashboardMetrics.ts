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
  monthlyGrowth: Array<{ month: string; clients: number }>
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
  pendingProcesses: Array<{
    id: string
    type: string
    status: string
    created_at: string
    client_name?: string
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
    monthlyGrowth: [],
    recentSearches: [],
    recentClients: [],
    pendingProcesses: []
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

      // NOVO: Buscar crescimento mensal de clientes
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      
      const { data: monthlyData } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('role', 'client')
        .gte('created_at', sixMonthsAgo.toISOString())
        .order('created_at', { ascending: true })

      const monthlyMap = new Map()
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthStr = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
        monthlyMap.set(monthStr, 0)
      }

      let cumulativeCount = 0
      monthlyData?.forEach(item => {
        const date = new Date(item.created_at)
        const monthStr = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
        if (monthlyMap.has(monthStr)) {
          monthlyMap.set(monthStr, monthlyMap.get(monthStr) + 1)
        }
      })

      // Converter para crescimento acumulado
      const monthlyGrowth = Array.from(monthlyMap.entries()).map(([month, count]) => {
        cumulativeCount += count
        return {
          month,
          clients: cumulativeCount
        }
      })

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

      // NOVO: Buscar processos pendentes
      const { data: pendingProcessesData } = await supabase
        .from('processes')
        .select(`
          id,
          type,
          status,
          created_at,
          client_id
        `)
        .in('status', ['pending', 'in_progress'])
        .order('created_at', { ascending: true })
        .limit(5)

      // Buscar nomes dos clientes para os processos
      const clientIds = pendingProcessesData?.map(p => p.client_id).filter(Boolean) || []
      const { data: clientsData } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', clientIds)

      const clientsMap = new Map(clientsData?.map(c => [c.id, c.name]) || [])

      const pendingProcesses = pendingProcessesData?.map(process => ({
        ...process,
        client_name: clientsMap.get(process.client_id) || 'Cliente desconhecido'
      })) || []

      setMetrics({
        totalClients: totalClients || 0,
        todaySearches: todaySearches || 0,
        activeProcesses: activeProcesses || 0,
        totalVehicles: totalVehicles || 0,
        searchTypes,
        dailySearches,
        monthlyGrowth,
        recentSearches,
        recentClients: recentClientsData || [],
        pendingProcesses
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