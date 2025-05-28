import { useDashboardMetrics } from "@/hooks/useDashboardMetrics"
import { MetricsCards } from "@/components/dashboard/MetricsCards"
import { ChartsSection } from "@/components/dashboard/ChartsSection"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

const AdminDashboard = () => {
  const { metrics, loading, refreshMetrics } = useDashboardMetrics()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral das atividades e métricas do sistema
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshMetrics}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Cards de Métricas */}
      <MetricsCards
        totalClients={metrics.totalClients}
        todaySearches={metrics.todaySearches}
        activeProcesses={metrics.activeProcesses}
        totalVehicles={metrics.totalVehicles}
        loading={loading}
      />

      {/* Seção de Gráficos - ATUALIZADO com monthlyGrowth */}
      <ChartsSection
        searchTypes={metrics.searchTypes}
        dailySearches={metrics.dailySearches}
        monthlyGrowth={metrics.monthlyGrowth}
        loading={loading}
      />

      {/* Atividade Recente - ATUALIZADO com pendingProcesses */}
      <RecentActivity
        recentSearches={metrics.recentSearches}
        recentClients={metrics.recentClients}
        pendingProcesses={metrics.pendingProcesses}
        loading={loading}
      />
    </div>
  )
}

export default AdminDashboard