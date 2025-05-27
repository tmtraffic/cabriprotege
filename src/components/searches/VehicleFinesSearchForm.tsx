
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VehicleFinesSearchFormProps {
  onSearch: (plate: string, renavam: string) => Promise<void>
  loading: boolean
}

export default function VehicleFinesSearchForm({ onSearch, loading }: VehicleFinesSearchFormProps) {
  const { toast } = useToast()
  const [vehiclePlate, setVehiclePlate] = useState("")
  const [vehicleRenavam, setVehicleRenavam] = useState("")

  const formatPlate = (value: string) => {
    return value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 7)
  }

  const handleSearch = async () => {
    if (!vehiclePlate && !vehicleRenavam) {
      toast({
        title: "Dados necessários",
        description: "Informe a placa ou RENAVAM do veículo",
        variant: "destructive"
      })
      return
    }

    await onSearch(vehiclePlate, vehicleRenavam)
  }

  return (
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
            onClick={handleSearch} 
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
      </CardContent>
    </Card>
  )
}
