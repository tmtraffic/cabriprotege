import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ChartsSectionProps {
  searchTypes: Array<{ type: string; count: number }>
  dailySearches: Array<{ date: string; count: number }>
  monthlyGrowth: Array<{ month: string; clients: number }>
  loading: boolean
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function ChartsSection({ searchTypes, dailySearches, monthlyGrowth, loading }: ChartsSectionProps) {
  if (loading) {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Consulta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Consultas dos Últimos 7 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Crescimento de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Consulta</CardTitle>
            <CardDescription>
              Distribuição por tipo de consulta realizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {searchTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={searchTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {searchTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Nenhuma consulta encontrada
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultas dos Últimos 7 Dias</CardTitle>
            <CardDescription>
              Volume de consultas por dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySearches}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Novo Gráfico de Linha - Crescimento Mensal */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Crescimento de Clientes</CardTitle>
          <CardDescription>
            Evolução mensal do número de clientes cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {monthlyGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="clients" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Dados insuficientes para exibir o gráfico
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}