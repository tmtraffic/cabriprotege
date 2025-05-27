
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Search, User, Clock } from "lucide-react"

interface RecentActivityProps {
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
  loading: boolean
}

export function RecentActivity({ recentSearches, recentClients, loading }: RecentActivityProps) {
  const getSearchTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'vehicle_fines': 'Multas de Veículo',
      'driver_cnh': 'Consulta CNH',
      'vehicle_crlv': 'Consulta CRLV',
      'renavam': 'Consulta RENAVAM'
    }
    return types[type] || type
  }

  const getSearchTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'vehicle_fines': 'destructive',
      'driver_cnh': 'default',
      'vehicle_crlv': 'secondary',
      'renavam': 'outline'
    }
    return variants[type] || 'default'
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Novos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Últimas Consultas
          </CardTitle>
          <CardDescription>
            Consultas realizadas recentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSearches.length > 0 ? (
              recentSearches.map((search) => (
                <div key={search.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Search className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getSearchTypeBadge(search.search_type)} className="text-xs">
                          {getSearchTypeLabel(search.search_type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {search.search_query} • {search.user_name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(search.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma consulta encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Novos Clientes
          </CardTitle>
          <CardDescription>
            Clientes cadastrados recentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentClients.length > 0 ? (
              recentClients.map((client) => (
                <div key={client.id} className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none truncate">
                      {client.name || 'Nome não informado'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {client.email}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(client.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum cliente encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
