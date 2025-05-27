
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Car, FileText, CreditCard, Search, Clock } from "lucide-react"
import VehicleFinesSearchForm from "@/components/searches/VehicleFinesSearchForm"
import DriverCnhSearchForm from "@/components/searches/DriverCnhSearchForm"
import VehicleFinesResults from "@/components/searches/VehicleFinesResults"
import CnhResults from "@/components/searches/CnhResults"
import PlaceholderTab from "@/components/searches/PlaceholderTab"
import { useInfosimplesSearch } from "@/hooks/useInfosimplesSearch"

export default function InfosimplesSearch() {
  const [activeTab, setActiveTab] = useState("vehicle_fines")
  const { loading, results, handleVehicleFinesSearch, handleDriverCnhSearch } = useInfosimplesSearch()

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
          <VehicleFinesSearchForm onSearch={handleVehicleFinesSearch} loading={loading} />
          {results && <VehicleFinesResults results={results} />}
        </TabsContent>

        <TabsContent value="driver_cnh">
          <DriverCnhSearchForm onSearch={handleDriverCnhSearch} loading={loading} />
          {results && <CnhResults results={results} />}
        </TabsContent>

        <TabsContent value="vehicle_crlv">
          <PlaceholderTab 
            title="Consulta de CRLV"
            description="Verifique o documento de registro e licenciamento"
          />
        </TabsContent>

        <TabsContent value="renavam">
          <PlaceholderTab 
            title="Consulta por RENAVAM"
            description="Busque informações completas do veículo"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
