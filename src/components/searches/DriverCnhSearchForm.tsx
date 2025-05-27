
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DriverCnhSearchFormProps {
  onSearch: (cpf: string) => Promise<void>
  loading: boolean
}

export default function DriverCnhSearchForm({ onSearch, loading }: DriverCnhSearchFormProps) {
  const { toast } = useToast()
  const [driverCpf, setDriverCpf] = useState("")

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const handleSearch = async () => {
    if (!driverCpf) {
      toast({
        title: "CPF necessário",
        description: "Informe o CPF do condutor",
        variant: "destructive"
      })
      return
    }

    await onSearch(driverCpf)
  }

  return (
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
                Consultar CNH
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
