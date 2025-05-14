
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, FileText, Car, User, Printer, Download, Eye, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Tipos para os dados retornados
interface Fine {
  id: string;
  autoNumber: string;
  date: string;
  agency: string;
  plate: string;
  owner: string;
  respPoints: string;
  situation: string;
  infraction: string;
  location: string;
  frame: string;
  points: number;
  dueDate: string;
  value: number;
  discountValue: number;
  process: string;
  selected?: boolean;
}

interface Driver {
  name: string;
  cnh: string;
  category: string;
  status: string;
  expirationDate: string;
  points: number;
  fines: Fine[];
}

interface Vehicle {
  plate: string;
  renavam: string;
  model: string;
  year: string;
  owner: string;
  fines: Fine[];
}

const AdvancedSearch = () => {
  const [searchTab, setSearchTab] = useState("cnh");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Driver | Vehicle | null>(null);
  const [selectedFines, setSelectedFines] = useState<Fine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedFineDetail, setSelectedFineDetail] = useState<Fine | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Erro na busca",
        description: "Por favor, insira um termo de busca válido."
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simular delay de busca na API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Dados simulados baseados no tipo de busca
    if (searchTab === "cnh") {
      // Simulação de dados de CNH
      const mockData: Driver = {
        name: "Tiago Medeiros",
        cnh: "12345678901",
        category: "AB",
        status: "Regular",
        expirationDate: "10/05/2025",
        points: 12,
        fines: [
          {
            id: "1",
            autoNumber: "I41664643",
            date: "05/10/2020 10:15",
            agency: "RENAINF",
            plate: "KXC2317",
            owner: "ALEXANDER FLORENTINO DE SOUZA",
            respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
            situation: "Penalidade - Paga em: 06/08/2020 NOTIFICADA DA PENALIDADE",
            infraction: "74550 - TRANSITAR EM VELOCIDADE SUPERIOR À MÁXIMA PERMITIDA EM ATÉ 20%",
            location: "BR101 KM 426.2 - MANGARATIBA",
            frame: "218 INC I - MÉDIA",
            points: 4,
            dueDate: "08/10/2021",
            value: 130.16,
            discountValue: 104.12,
            process: "-"
          },
          {
            id: "2",
            autoNumber: "E43789654",
            date: "15/01/2021 08:30",
            agency: "DETRAN RJ",
            plate: "KXC2317",
            owner: "ALEXANDER FLORENTINO DE SOUZA",
            respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
            situation: "Penalidade - Notificada",
            infraction: "60503 - ESTACIONAR EM LOCAL PROIBIDO",
            location: "AV BRASIL 1250 - RIO DE JANEIRO",
            frame: "181 INC XVII - LEVE",
            points: 3,
            dueDate: "20/03/2021",
            value: 88.38,
            discountValue: 70.70,
            process: "-"
          },
          {
            id: "3",
            autoNumber: "B12398745",
            date: "10/03/2021 17:45",
            agency: "GUARDA MUNICIPAL",
            plate: "KXC2317",
            owner: "ALEXANDER FLORENTINO DE SOUZA",
            respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
            situation: "Autuação - Em processamento",
            infraction: "73662 - AVANÇAR O SINAL VERMELHO DO SEMÁFORO",
            location: "RUA VOLUNTÁRIOS DA PÁTRIA - BOTAFOGO",
            frame: "208 - GRAVÍSSIMA",
            points: 7,
            dueDate: "15/05/2021",
            value: 293.47,
            discountValue: 234.78,
            process: "P202103456"
          }
        ]
      };
      
      setSearchResults(mockData);
    } else if (searchTab === "vehicle") {
      // Simulação de dados de veículo
      const mockData: Vehicle = {
        plate: "KXC2317",
        renavam: "01234567890",
        model: "HONDA/CIVIC EXL CVT",
        year: "2019/2020",
        owner: "ALEXANDER FLORENTINO DE SOUZA",
        fines: [
          {
            id: "1",
            autoNumber: "I41664643",
            date: "05/10/2020 10:15",
            agency: "RENAINF",
            plate: "KXC2317",
            owner: "ALEXANDER FLORENTINO DE SOUZA",
            respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
            situation: "Penalidade - Paga em: 06/08/2020 NOTIFICADA DA PENALIDADE",
            infraction: "74550 - TRANSITAR EM VELOCIDADE SUPERIOR À MÁXIMA PERMITIDA EM ATÉ 20%",
            location: "BR101 KM 426.2 - MANGARATIBA",
            frame: "218 INC I - MÉDIA",
            points: 4,
            dueDate: "08/10/2021",
            value: 130.16,
            discountValue: 104.12,
            process: "-"
          },
          {
            id: "2",
            autoNumber: "E43789654",
            date: "15/01/2021 08:30",
            agency: "DETRAN RJ",
            plate: "KXC2317",
            owner: "ALEXANDER FLORENTINO DE SOUZA",
            respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
            situation: "Penalidade - Notificada",
            infraction: "60503 - ESTACIONAR EM LOCAL PROIBIDO",
            location: "AV BRASIL 1250 - RIO DE JANEIRO",
            frame: "181 INC XVII - LEVE",
            points: 3,
            dueDate: "20/03/2021",
            value: 88.38,
            discountValue: 70.70,
            process: "-"
          },
          {
            id: "3",
            autoNumber: "B12398745",
            date: "10/03/2021 17:45",
            agency: "GUARDA MUNICIPAL",
            plate: "KXC2317",
            owner: "ALEXANDER FLORENTINO DE SOUZA",
            respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
            situation: "Autuação - Em processamento",
            infraction: "73662 - AVANÇAR O SINAL VERMELHO DO SEMÁFORO",
            location: "RUA VOLUNTÁRIOS DA PÁTRIA - BOTAFOGO",
            frame: "208 - GRAVÍSSIMA",
            points: 7,
            dueDate: "15/05/2021",
            value: 293.47,
            discountValue: 234.78,
            process: "P202103456"
          }
        ]
      };
      
      setSearchResults(mockData);
    }
    
    setIsLoading(false);
  };
  
  const handleViewDetails = (fine: Fine) => {
    setSelectedFineDetail(fine);
    setOpenDetailDialog(true);
  };

  const handlePrint = () => {
    toast({
      title: "Impressão iniciada",
      description: "Preparando documento para impressão..."
    });
    
    // Em uma implementação real, isso abriria uma janela de impressão
    window.print();
  };

  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "O relatório será baixado em instantes."
    });
    
    // Em uma implementação real, isso geraria um arquivo para download
    console.log("Exporting results to file");
  };

  const toggleFineSelection = (fine: Fine) => {
    const isSelected = selectedFines.some(f => f.id === fine.id);
    
    if (isSelected) {
      setSelectedFines(selectedFines.filter(f => f.id !== fine.id));
    } else {
      setSelectedFines([...selectedFines, fine]);
    }
  };

  const generateQuote = () => {
    if (selectedFines.length === 0) {
      toast({
        variant: "destructive",
        title: "Seleção vazia",
        description: "Selecione pelo menos uma multa para gerar um orçamento."
      });
      return;
    }
    
    // Cálculo do valor total (em uma implementação real, usaria valores da tabela de códigos)
    const total = selectedFines.reduce((sum, fine) => sum + (fine.value * 0.7), 0);
    
    toast({
      title: "Orçamento gerado",
      description: `Orçamento para ${selectedFines.length} multa(s) no valor de R$ ${total.toFixed(2)}`
    });
    
    // Aqui seria redirecionado para a página de orçamento com os dados
    console.log("Quote generated for fines:", selectedFines);
  };

  const getPlaceholder = () => {
    switch(searchTab) {
      case "cnh":
        return "Digite o número da CNH";
      case "vehicle":
        return "Digite a placa ou RENAVAM do veículo";
      default:
        return "Digite sua busca";
    }
  };

  const getSituationColor = (situation: string) => {
    if (situation.includes("Paga")) return "green";
    if (situation.includes("Notificada")) return "orange";
    if (situation.includes("processamento")) return "blue";
    return "gray";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Consulta Avançada</CardTitle>
        <CardDescription>
          Pesquise por CNH, placa ou RENAVAM para encontrar informações detalhadas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={searchTab} onValueChange={setSearchTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cnh">CNH</TabsTrigger>
            <TabsTrigger value="vehicle">Veículo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cnh" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cnh-search">Número da CNH</Label>
              <div className="flex space-x-2">
                <Input
                  id="cnh-search"
                  placeholder="Digite os 11 dígitos da CNH"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="vehicle" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-search">Placa ou RENAVAM</Label>
              <div className="flex space-x-2">
                <Input
                  id="vehicle-search"
                  placeholder="Digite a placa ou RENAVAM"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
            <span className="ml-2">Pesquisando...</span>
          </div>
        )}

        {searchResults && !isLoading && (
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-4">
              {'name' in searchResults ? (
                // Resultados de busca por CNH
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-lg font-semibold">{searchResults.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CNH</p>
                    <p className="text-lg font-semibold">{searchResults.cnh}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                    <p className="text-lg font-semibold">{searchResults.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={searchResults.status === "Regular" ? "default" : "destructive"}>
                      {searchResults.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Validade</p>
                    <p className="text-lg font-semibold">{searchResults.expirationDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pontos</p>
                    <div className="flex items-center">
                      <p className="text-lg font-semibold">{searchResults.points}</p>
                      {searchResults.points > 18 && (
                        <AlertTriangle className="ml-2 h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Resultados de busca por veículo
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Placa</p>
                    <p className="text-lg font-semibold">{searchResults.plate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">RENAVAM</p>
                    <p className="text-lg font-semibold">{searchResults.renavam}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Modelo</p>
                    <p className="text-lg font-semibold">{searchResults.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ano</p>
                    <p className="text-lg font-semibold">{searchResults.year}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Proprietário</p>
                    <p className="text-lg font-semibold">{searchResults.owner}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Multas e Infrações</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">Sel.</TableHead>
                      <TableHead>Auto Nº</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Infração</TableHead>
                      <TableHead>Pontos</TableHead>
                      <TableHead>Situação</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {'fines' in searchResults && searchResults.fines.map((fine) => (
                      <TableRow key={fine.id}>
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={selectedFines.some(f => f.id === fine.id)}
                            onChange={() => toggleFineSelection(fine)}
                            className="h-4 w-4 rounded border-gray-300 text-cabricop-blue focus:ring-cabricop-blue"
                          />
                        </TableCell>
                        <TableCell>{fine.autoNumber}</TableCell>
                        <TableCell>{fine.date}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={fine.infraction}>
                          {fine.infraction}
                        </TableCell>
                        <TableCell>{fine.points}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`bg-${getSituationColor(fine.situation)}-50 text-${getSituationColor(fine.situation)}-700 border-${getSituationColor(fine.situation)}-200`}>
                            {fine.situation.split(' - ')[0]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {fine.value.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(fine)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
        
        <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Infração</DialogTitle>
              <DialogDescription>
                Informações detalhadas sobre a multa e processamento
              </DialogDescription>
            </DialogHeader>
            
            {selectedFineDetail && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Auto Nº</p>
                    <p className="font-semibold">{selectedFineDetail.autoNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data</p>
                    <p className="font-semibold">{selectedFineDetail.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Órgão</p>
                    <p className="font-semibold">{selectedFineDetail.agency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Placa</p>
                    <p className="font-semibold">{selectedFineDetail.plate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Proprietário</p>
                    <p className="font-semibold">{selectedFineDetail.owner}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-muted-foreground">Responsável pelos Pontos</p>
                    <p className="font-semibold">{selectedFineDetail.respPoints}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-muted-foreground">Situação</p>
                    <p className="font-semibold">{selectedFineDetail.situation}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-muted-foreground">Infração</p>
                    <p className="font-semibold">{selectedFineDetail.infraction}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-muted-foreground">Local</p>
                    <p className="font-semibold">{selectedFineDetail.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enquadramento</p>
                    <p className="font-semibold">{selectedFineDetail.frame}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pontos</p>
                    <p className="font-semibold">{selectedFineDetail.points}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vencimento</p>
                    <p className="font-semibold">{selectedFineDetail.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor</p>
                    <p className="font-semibold">R$ {selectedFineDetail.value.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor com desconto</p>
                    <p className="font-semibold">R$ {selectedFineDetail.discountValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Processo</p>
                    <p className="font-semibold">{selectedFineDetail.process}</p>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setOpenDetailDialog(false)}>
                    Fechar
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={handlePrint}>
                      <Printer className="h-4 w-4 mr-2" /> Imprimir
                    </Button>
                    <Button onClick={() => {
                      toggleFineSelection(selectedFineDetail);
                      setOpenDetailDialog(false);
                    }}>
                      {selectedFines.some(f => f.id === selectedFineDetail.id) 
                        ? "Remover do Orçamento" 
                        : "Adicionar ao Orçamento"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
      
      {selectedFines.length > 0 && (
        <CardFooter className="border-t flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{selectedFines.length} multa(s) selecionada(s)</p>
            <p className="text-xs text-muted-foreground">
              Valor estimado: R$ {(selectedFines.reduce((sum, fine) => sum + (fine.value * 0.7), 0)).toFixed(2)}
            </p>
          </div>
          <Button onClick={generateQuote}>
            Gerar Orçamento
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AdvancedSearch;
