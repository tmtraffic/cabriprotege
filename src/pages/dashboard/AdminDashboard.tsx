
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics"
import { MetricsCards } from "@/components/dashboard/MetricsCards"
import { ChartsSection } from "@/components/dashboard/ChartsSection"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

const AdminDashboard = () => {
  const { metrics, loading, refreshMetrics } = useDashboardMetrics()
  const isMobile = useIsMobile()

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Dashboard Administrativo
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Visão geral das atividades e métricas do sistema
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshMetrics}
          disabled={loading}
          className="flex items-center gap-2 w-full sm:w-auto min-h-[44px]"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Metrics Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCards
          totalClients={metrics.totalClients}
          todaySearches={metrics.todaySearches}
          activeProcesses={metrics.activeProcesses}
          totalVehicles={metrics.totalVehicles}
          loading={loading}
        />
      </div>

      {/* Charts Section - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <ChartsSection
            searchTypes={metrics.searchTypes}
            dailySearches={metrics.dailySearches}
            monthlyGrowth={metrics.monthlyGrowth}
            loading={loading}
          />
        </div>
        
        {/* Recent Activity - Sidebar on desktop, below on mobile */}
        <div className="lg:col-span-1">
          <RecentActivity
            recentSearches={metrics.recentSearches}
            recentClients={metrics.recentClients}
            pendingProcesses={metrics.pendingProcesses}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
