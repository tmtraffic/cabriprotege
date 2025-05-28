
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics"
import { MetricsCards } from "@/components/dashboard/MetricsCards"
import { ChartsSection } from "@/components/dashboard/ChartsSection"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { Button } from "@/components/ui/button"
import { RefreshCw, ChevronLeft } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

const AdminDashboard = () => {
  const { metrics, loading, refreshMetrics } = useDashboardMetrics()
  const isMobile = useIsMobile()

  return (
    <div className="space-y-4 sm:space-y-6">
      {isMobile && (
        <Button variant="ghost" className="mb-4 p-0 h-auto text-blue-600">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Voltar
        </Button>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Visão geral das atividades e métricas do sistema
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshMetrics}
          disabled={loading}
          className="flex items-center gap-2 w-full sm:w-auto"
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

      {/* Seção de Gráficos */}
      <ChartsSection
        searchTypes={metrics.searchTypes}
        dailySearches={metrics.dailySearches}
        monthlyGrowth={metrics.monthlyGrowth}
        loading={loading}
      />

      {/* Atividade Recente */}
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
