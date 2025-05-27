
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, FileText, Car } from "lucide-react"

interface MetricsCardsProps {
  totalClients: number
  todaySearches: number
  activeProcesses: number
  totalVehicles: number
  loading: boolean
}

export function MetricsCards({ 
  totalClients, 
  todaySearches, 
  activeProcesses, 
  totalVehicles, 
  loading 
}: MetricsCardsProps) {
  const cards = [
    {
      title: "Total de Clientes",
      value: totalClients,
      icon: Users,
      description: "clientes cadastrados"
    },
    {
      title: "Consultas Hoje",
      value: todaySearches,
      icon: Search,
      description: "consultas realizadas hoje"
    },
    {
      title: "Processos Ativos",
      value: activeProcesses,
      icon: FileText,
      description: "processos em andamento"
    },
    {
      title: "Veículos Cadastrados",
      value: totalVehicles,
      icon: Car,
      description: "veículos no sistema"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                card.value
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
