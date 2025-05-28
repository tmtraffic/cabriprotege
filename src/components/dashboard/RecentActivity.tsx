import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Search, User, Clock, FileText } from "lucide-react"

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
  pendingProcesses: Array<{
    id: string
    type: string
    status: string
    created_at: string
    client_name?: string
  }>
  loading: boolean
}

export function RecentActivity({ recentSearches, recentClients, pendingProcesses, loading }: RecentActivityProps) {
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

  const getProcessTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'fine_appeal': 'Recurso de Multa',
      'license_renewal': 'Renovação CNH',
      'vehicle_registration': 'Registro de Veículo'
    }
    return types[type] || type
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'pending': 'destructive',
      'in_progress': 'secondary',
      'completed': 'default',
      'canceled': 'outline'
    }
    return variants[status] || 'default'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Pendente',
      'in_progress': 'Em Andamento',
      'completed': 'Concluído',
      'canceled': 'Cancelado'
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div className="space-y-4">
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
        <Card>
          <CardHeader>
            <CardTitle>Processos Pendentes</CardTitle>
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
    <div className="space-y-4">
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

      {/* Nova seção: Processos Pendentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Processos Pendentes
          </CardTitle>
          <CardDescription>
            Processos que necessitam de ação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingProcesses.length > 0 ? (
              pendingProcesses.map((process) => (
                <div key={process.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                      <FileText className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-none">
                          {getProcessTypeLabel(process.type)}
                        </p>
                        <Badge variant={getStatusBadge(process.status)} className="text-xs">
                          {getStatusLabel(process.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        Cliente: {process.client_name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Criado em {format(new Date(process.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum processo pendente</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}