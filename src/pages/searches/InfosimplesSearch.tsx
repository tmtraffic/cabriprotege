
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Car, FileText, CreditCard, Search, AlertCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function InfosimplesSearch() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("vehicle_fines")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  
  // Estados para cada tipo de busca
  const [vehiclePlate, setVehiclePlate] = useState("")
  const [vehicleRenavam, setVehicleRenavam] = useState("")
  const [driverCpf, setDriverCpf] = useState("")

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatPlate = (value: string) => {
    return value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 7)
  }

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

  const handleVehicleFinesSearch = async () => {
    if (!vehiclePlate && !vehicleRenavam) {
      toast({
        title: "Dados necessários",
        description: "Informe a placa ou RENAVAM do veículo",
        variant: "destructive"
      })
      return
    }

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

  const handleDriverCnhSearch = async () => {
    if (!driverCpf) {
      toast({
        title: "CPF necessário",
        description: "Informe o CPF do condutor",
        variant: "destructive"
      })
      return
    }

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

  const renderVehicleFinesResults = () => {
    // Verificações de segurança mais robustas
    if (!results) {
      console.log('No results')
      return null
    }
    if (!results.data) {
      console.log('No results.data')
      return null
    }
    if (!results.data.fines) {
      console.log('No results.data.fines')
      return null
    }
    if (!Array.isArray(results.data.fines)) {
      console.log('results.data.fines is not an array:', typeof results.data.fines)
      return null
    }

    const { fines } = results.data
    
    // Cálculos seguros com verificação adicional
    const total_value = results.data.total_value || (Array.isArray(fines) ? fines.reduce((sum: number, fine: any) => sum + (fine.value || 0), 0) : 0)
    const total_points = results.data.total_points || (Array.isArray(fines) ? fines.reduce((sum: number, fine: any) => sum + (fine.points || 0), 0) : 0)

    return (
      <div className="space-y-4 mt-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Modo demonstração: Estes são dados de exemplo. Na versão final, serão dados reais da API Infosimples.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Multas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{fines.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ {total_value.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pontos na CNH</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{total_points}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Detalhes das Infrações</h3>
          {fines.map((fine: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <p className="font-medium">{fine.auto_number || `AUTO-${index + 1}`}</p>
                    <p className="text-sm text-muted-foreground">{fine.description || "Descrição não disponível"}</p>
                    <p className="text-xs text-muted-foreground">{fine.location || "Local não especificado"}</p>
                  </div>
                  <Badge variant={fine.status === 'pending' ? 'destructive' : 'secondary'}>
                    {fine.status === 'pending' ? 'Pendente' : 'Pago'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <span>Data: {fine.date ? format(new Date(fine.date), "dd/MM/yyyy", { locale: ptBR }) : "Não informada"}</span>
                    <span>{fine.points || 0} pontos</span>
                  </div>
                  <p className="font-semibold">R$ {(fine.value || 0).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderCnhResults = () => {
    // Verificações de segurança
    if (!results) return null
    if (!results.data) return null
    if (!results.data.cnh) return null

    const { cnh } = results.data

    return (
      <div className="space-y-4 mt-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Modo demonstração: Estes são dados de exemplo. Na versão final, serão dados reais da API Infosimples.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Dados da CNH</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Número</Label>
                <p className="font-medium">{cnh.number || "Não informado"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Categoria</Label>
                <p className="font-medium">{cnh.category || "Não informada"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data de Emissão</Label>
                <p className="font-medium">
                  {cnh.issue_date ? format(new Date(cnh.issue_date), "dd/MM/yyyy", { locale: ptBR }) : "Não informada"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Validade</Label>
                <p className="font-medium">
                  {cnh.expiration_date ? format(new Date(cnh.expiration_date), "dd/MM/yyyy", { locale: ptBR }) : "Não informada"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Primeira Habilitação</Label>
                <p className="font-medium">
                  {cnh.first_license_date ? format(new Date(cnh.first_license_date), "dd/MM/yyyy", { locale: ptBR }) : "Não informada"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Pontos Disponíveis</Label>
                <p className="font-medium">{cnh.points || 0} pontos</p>
              </div>
            </div>

            {cnh.infractions && Array.isArray(cnh.infractions) && cnh.infractions.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-3">Infrações Registradas</h4>
                <div className="space-y-2">
                  {cnh.infractions.map((infraction: any, index: number) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <span className="font-medium">
                          {infraction.date ? format(new Date(infraction.date), "dd/MM/yyyy", { locale: ptBR }) : "Data não informada"}
                        </span>
                        {" - "}
                        {infraction.description || "Descrição não disponível"}
                        {" - "}
                        <span className="font-medium">{infraction.points || 0} pontos</span>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Consultas Infosimples</h1>
            <p className="text-muted-foreground mt-2">
              Realize consultas de multas, CNH, CRLV e outras informações de trânsito
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/consultas/historico'}
          >
            <Clock className="h-4 w-4 mr-2" />
            Ver Histórico
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vehicle_fines">
            <Car className="h-4 w-4 mr-2" />
            Multas
          </TabsTrigger>
          <TabsTrigger value="driver_cnh">
            <CreditCard className="h-4 w-4 mr-2" />
            CNH
          </TabsTrigger>
          <TabsTrigger value="vehicle_crlv">
            <FileText className="h-4 w-4 mr-2" />
            CRLV
          </TabsTrigger>
          <TabsTrigger value="renavam">
            <Search className="h-4 w-4 mr-2" />
            RENAVAM
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehicle_fines">
          <Card>
            <CardHeader>
              <CardTitle>Consulta de Multas</CardTitle>
              <CardDescription>
                Busque multas de veículos por placa ou RENAVAM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plate">Placa do Veículo</Label>
                  <Input
                    id="plate"
                    placeholder="ABC1234"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(formatPlate(e.target.value))}
                    className="uppercase"
                    maxLength={7}
                  />
                </div>
                <div>
                  <Label htmlFor="renavam">RENAVAM</Label>
                  <Input
                    id="renavam"
                    placeholder="00000000000"
                    value={vehicleRenavam}
                    onChange={(e) => setVehicleRenavam(e.target.value.replace(/\D/g, ''))}
                    maxLength={11}
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  onClick={handleVehicleFinesSearch} 
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Consultando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Consultar Multas
                    </>
                  )}
                </Button>
              </div>

              {results && renderVehicleFinesResults()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="driver_cnh">
          <Card>
            <CardHeader>
              <CardTitle>Consulta de CNH</CardTitle>
              <CardDescription>
                Verifique dados e situação da CNH por CPF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="cpf">CPF do Condutor</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={driverCpf}
                  onChange={(e) => setDriverCpf(formatCPF(e.target.value))}
                  maxLength={14}
                />
              </div>
              <div className="mt-6">
                <Button 
                  onClick={handleDriverCnhSearch} 
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Consultando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Consultar CNH
                    </>
                  )}
                </Button>
              </div>

              {results && renderCnhResults()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle_crlv">
          <Card>
            <CardHeader>
              <CardTitle>Consulta de CRLV</CardTitle>
              <CardDescription>
                Verifique o documento de registro e licenciamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Esta funcionalidade será implementada em breve
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renavam">
          <Card>
            <CardHeader>
              <CardTitle>Consulta por RENAVAM</CardTitle>
              <CardDescription>
                Busque informações completas do veículo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Esta funcionalidade será implementada em breve
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
