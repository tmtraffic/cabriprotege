
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Car, Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchVehicles, Vehicle } from "@/services/VehicleService";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Vehicle | null;
    direction: "ascending" | "descending";
  }>({
    key: null,
    direction: "ascending",
  });
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        const data = await fetchVehicles();
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error("Error loading vehicles:", error);
        toast({
          title: "Erro ao carregar veículos",
          description: "Não foi possível carregar a lista de veículos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = vehicles.filter(
        (vehicle) =>
          vehicle.plate.toLowerCase().includes(lowercaseQuery) ||
          vehicle.brand.toLowerCase().includes(lowercaseQuery) ||
          vehicle.model.toLowerCase().includes(lowercaseQuery) ||
          (vehicle.renavam && vehicle.renavam.toLowerCase().includes(lowercaseQuery))
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchQuery, vehicles]);

  const sortData = (key: keyof Vehicle) => {
    let direction: "ascending" | "descending" = "ascending";
    
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    
    setSortConfig({ key, direction });
    
    const sorted = [...filteredVehicles].sort((a, b) => {
      if (a[key] === null) return 1;
      if (b[key] === null) return -1;
      
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredVehicles(sorted);
  };

  const handleViewVehicle = (id: string) => {
    navigate(`/veiculos/${id}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Veículos</h1>
          <p className="text-muted-foreground">
            Gerenciamento de veículos cadastrados no sistema
          </p>
        </div>
        <Button asChild>
          <Link to="/veiculos/novo">
            <Plus className="mr-2 h-4 w-4" /> Novo Veículo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Veículos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os veículos cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar veículo..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filtrar</span>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
              <span className="ml-2">Carregando...</span>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-10">
              <Car className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium">Nenhum veículo encontrado</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Tente ajustar seu termo de busca."
                  : "Adicione seu primeiro veículo para começar."}
              </p>
              <Button className="mt-4" asChild>
                <Link to="/veiculos/novo">Adicionar Veículo</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-auto max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]" onClick={() => sortData("plate")}>
                      <div className="flex items-center">
                        Placa
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => sortData("brand")}>
                      <div className="flex items-center">
                        Marca
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => sortData("model")}>
                      <div className="flex items-center">
                        Modelo
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell" onClick={() => sortData("year")}>
                      <div className="flex items-center">
                        Ano
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Categoria</TableHead>
                    <TableHead className="hidden md:table-cell">Uso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow
                      key={vehicle.id}
                      className="cursor-pointer"
                      onClick={() => handleViewVehicle(vehicle.id)}
                    >
                      <TableCell className="font-medium">{vehicle.plate}</TableCell>
                      <TableCell>{vehicle.brand}</TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {vehicle.year || "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {vehicle.category || "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={vehicle.professional_use ? "default" : "outline"}>
                          {vehicle.professional_use ? "Profissional" : "Particular"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewVehicle(vehicle.id);
                          }}
                        >
                          Ver detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleList;
