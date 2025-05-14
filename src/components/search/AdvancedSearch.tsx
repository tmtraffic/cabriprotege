
import { useState, useEffect } from "react";
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
import {
  Badge
} from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, FileText, Car, User, Printer, Download, Eye, AlertTriangle, UserPlus, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import InfoSimplesService from "@/services/InfoSimplesService";
import { SearchResultCNH, SearchResultVehicle, SearchResultFine, AdditionalSearchParams, UfOption } from "@/models/SearchHistory";
import { Tabs as TabsSecondary } from "@/components/ui/tabs";
import SearchHistoryComponent from "./SearchHistory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UF_OPTIONS: { value: UfOption; label: string }[] = [
  { value: 'SP', label: 'São Paulo' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PR', label: 'Paraná' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'BA', label: 'Bahia' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'DF', label: 'Distrito Federal' },
];

const AdvancedSearch = () => {
  const [searchTab, setSearchTab] = useState("cnh");
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultCNH | SearchResultVehicle | null>(null);
  const [selectedFines, setSelectedFines] = useState<SearchResultFine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedFineDetail, setSelectedFineDetail] = useState<SearchResultFine | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedUf, setSelectedUf] = useState<UfOption>('SP');
  
  // Campos adicionais para consultas específicas por UF
  const [additionalParams, setAdditionalParams] = useState<AdditionalSearchParams>({
    cpf: '',
    dataNascimento: '',
    dataPrimeiraHabilitacao: '',
    renavam: '',
    chassi: ''
  });
  
  const { toast } = useToast();
  const { user } = useSupabaseAuth();

  // Resetar formulários ao mudar de UF
  useEffect(() => {
    setAdditionalParams({
      cpf: '',
      dataNascimento: '',
      dataPrimeiraHabilitacao: '',
      renavam: '',
      chassi: ''
    });
  }, [selectedUf, searchTab]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Erro na busca",
        description: "Por favor, insira um termo de busca válido."
      });
      return;
    }
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Usuário não autenticado",
        description: "Você precisa estar logado para realizar consultas."
      });
      return;
    }
    
    // Validar parâmetros adicionais necessários
    if (!validateAdditionalParams()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Usar nosso InfoSimples service para a busca
      if (searchTab === "cnh") {
        const result = await InfoSimplesService.searchCNH(searchQuery, selectedUf, additionalParams);
        setSearchResults(result);
      } else if (searchTab === "vehicle") {
        const result = await InfoSimplesService.searchVehicle(searchQuery, selectedUf, additionalParams);
        setSearchResults(result);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na consulta",
        description: error.message || "Ocorreu um erro ao consultar a API. Tente novamente mais tarde."
      });
      console.error("Erro na busca:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para validar parâmetros adicionais conforme UF selecionada
  const validateAdditionalParams = (): boolean => {
    if (searchTab === "cnh") {
      // Validação de CNH por UF
      switch (selectedUf) {
        case 'SP':
          if (!additionalParams.dataNascimento) {
            toast({
              variant: "destructive",
              title: "Parâmetros incompletos",
              description: "Para consultas de CNH em SP, informe a data de nascimento."
            });
            return false;
          }
          break;
        case 'PR':
          if (!additionalParams.cpf) {
            toast({
              variant: "destructive",
              title: "Parâmetros incompletos",
              description: "Para consultas de CNH no PR, informe o CPF."
            });
            return false;
          }
          break;
        case 'MG':
          if (!additionalParams.cpf || !additionalParams.dataNascimento || !additionalParams.dataPrimeiraHabilitacao) {
            toast({
              variant: "destructive",
              title: "Parâmetros incompletos",
              description: "Para consultas de CNH em MG, informe o CPF, data de nascimento e data da primeira habilitação."
            });
            return false;
          }
          break;
      }
    } else if (searchTab === "vehicle") {
      // Validação de veículos por UF
      switch (selectedUf) {
        case 'SP':
          if (!additionalParams.renavam) {
            toast({
              variant: "destructive",
              title: "Parâmetros incompletos",
              description: "Para consultas de veículos em SP, informe o RENAVAM."
            });
            return false;
          }
          break;
        case 'RJ':
          if (!additionalParams.renavam || !additionalParams.chassi) {
            toast({
              variant: "destructive",
              title: "Parâmetros incompletos",
              description: "Para consultas de veículos no RJ, informe o RENAVAM e o chassi."
            });
            return false;
          }
          break;
      }
    }
    
    return true;
  };
  
  const handleViewDetails = (fine: SearchResultFine) => {
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
    
    // Implementação da exportação
    try {
      if (!searchResults || !('fines' in searchResults)) {
        throw new Error("Nenhum dado para exportar");
      }
      
      let csv = "Auto,Data,Agência,Infração,Pontos,Valor,Situação\n";
      
      searchResults.fines.forEach(fine => {
        const row = [
          `"${fine.autoNumber}"`,
          `"${fine.date}"`,
          `"${fine.agency}"`,
          `"${fine.infraction}"`,
          fine.points,
          fine.value.toFixed(2),
          `"${fine.situation}"`
        ];
        
        csv += row.join(',') + '\n';
      });
      
      // Criar blob e download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `multas_${searchQuery}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados."
      });
    }
  };

  const toggleFineSelection = (fine: SearchResultFine) => {
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

  const handleCreateFromSearch = () => {
    setOpenCreateDialog(true);
  };
  
  const handleCreateClient = () => {
    // In a real implementation, this would create a new client from the CNH data
    toast({
      title: "Cliente criado",
      description: "O cliente foi criado com sucesso com base nos dados da CNH."
    });
    setOpenCreateDialog(false);
  };
  
  const handleCreateVehicle = () => {
    // In a real implementation, this would create a new vehicle from the search data
    toast({
      title: "Veículo registrado",
      description: "O veículo foi registrado com sucesso com base nos dados da consulta."
    });
    setOpenCreateDialog(false);
  };

  const getSituationColor = (situation: string) => {
    if (situation.includes("Paga")) return "green";
    if (situation.includes("Notificada")) return "orange";
    if (situation.includes("processamento")) return "blue";
    return "gray";
  };
  
  const getPlaceholder = () => {
    switch(searchTab) {
      case "cnh":
        return "Digite o número da CNH";
      case "vehicle":
        return "Digite a placa do veículo";
      default:
        return "Digite sua busca";
    }
  };

  // Renderizar campos adicionais com base na UF e tipo de busca
  const renderAdditionalFields = () => {
    if (searchTab === 'cnh') {
      switch (selectedUf) {
        case 'SP':
          return (
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={additionalParams.dataNascimento}
                onChange={(e) => setAdditionalParams({...additionalParams, dataNascimento: e.target.value})}
              />
            </div>
          );
        case 'PR':
          return (
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="Digite o CPF"
                value={additionalParams.cpf}
                onChange={(e) => setAdditionalParams({...additionalParams, cpf: e.target.value})}
              />
            </div>
          );
        case 'MG':
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="Digite o CPF"
                  value={additionalParams.cpf}
                  onChange={(e) => setAdditionalParams({...additionalParams, cpf: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={additionalParams.dataNascimento}
                  onChange={(e) => setAdditionalParams({...additionalParams, dataNascimento: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataPrimeiraHabilitacao">Data da 1ª Habilitação</Label>
                <Input
                  id="dataPrimeiraHabilitacao"
                  type="date"
                  value={additionalParams.dataPrimeiraHabilitacao}
                  onChange={(e) => setAdditionalParams({...additionalParams, dataPrimeiraHabilitacao: e.target.value})}
                />
              </div>
            </>
          );
        default:
          return null;
      }
    } else if (searchTab === 'vehicle') {
      switch (selectedUf) {
        case 'SP':
        case 'PR':
        case 'RS':
          return (
            <div className="space-y-2">
              <Label htmlFor="renavam">RENAVAM</Label>
              <Input
                id="renavam"
                placeholder="Digite o RENAVAM"
                value={additionalParams.renavam}
                onChange={(e) => setAdditionalParams({...additionalParams, renavam: e.target.value})}
              />
            </div>
          );
        case 'RJ':
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="renavam">RENAVAM</Label>
                <Input
                  id="renavam"
                  placeholder="Digite o RENAVAM"
                  value={additionalParams.renavam}
                  onChange={(e) => setAdditionalParams({...additionalParams, renavam: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chassi">Chassi</Label>
                <Input
                  id="chassi"
                  placeholder="Digite o Chassi"
                  value={additionalParams.chassi}
                  onChange={(e) => setAdditionalParams({...additionalParams, chassi: e.target.value})}
                />
              </div>
            </>
          );
        default:
          return (
            <div className="space-y-2">
              <Label htmlFor="renavam">RENAVAM</Label>
              <Input
                id="renavam"
                placeholder="Digite o RENAVAM (opcional)"
                value={additionalParams.renavam}
                onChange={(e) => setAdditionalParams({...additionalParams, renavam: e.target.value})}
              />
            </div>
          );
      }
    }
    
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Consulta Avançada</CardTitle>
        <CardDescription>
          Pesquise por CNH, placa ou RENAVAM usando a API InfoSimples.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TabsSecondary value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Nova Consulta</TabsTrigger>
            <TabsTrigger value="history">Histórico de Consultas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4">
            <Tabs value={searchTab} onValueChange={setSearchTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cnh">CNH</TabsTrigger>
                <TabsTrigger value="vehicle">Veículo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cnh" className="space-y-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="cnh-search">Número da CNH</Label>
                      <Input
                        id="cnh-search"
                        placeholder="Digite os 11 dígitos da CNH"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uf-select">Estado (UF)</Label>
                      <Select 
                        value={selectedUf} 
                        onValueChange={(value) => setSelectedUf(value as UfOption)}
                      >
                        <SelectTrigger id="uf-select">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {UF_OPTIONS.map((uf) => (
                            <SelectItem key={uf.value} value={uf.value}>
                              {uf.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {renderAdditionalFields()}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? "Buscando..." : "Buscar"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="vehicle" className="space-y-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-search">Placa do Veículo</Label>
                      <Input
                        id="vehicle-search"
                        placeholder="Digite a placa"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uf-select-vehicle">Estado (UF)</Label>
                      <Select 
                        value={selectedUf} 
                        onValueChange={(value) => setSelectedUf(value as UfOption)}
                      >
                        <SelectTrigger id="uf-select-vehicle">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {UF_OPTIONS.map((uf) => (
                            <SelectItem key={uf.value} value={uf.value}>
                              {uf.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {renderAdditionalFields()}
                  </div>
                  
                  <div className="flex justify-end">
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
                <span className="ml-2">Pesquisando via InfoSimples...</span>
              </div>
            )}

            {searchResults && !isLoading && (
              <div className="space-y-6">
                <div className="bg-muted rounded-lg p-4">
                  {'cnh' in searchResults ? (
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
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">UF</p>
                        <p className="text-lg font-semibold">{searchResults.uf || 'SP'}</p>
                      </div>
                      <div className="md:col-span-3 flex justify-end">
                        <Button onClick={handleCreateFromSearch} variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Criar/Atualizar Cliente
                        </Button>
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
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">UF</p>
                        <p className="text-lg font-semibold">{searchResults.uf || 'SP'}</p>
                      </div>
                      <div className="md:col-span-1">
                        <p className="text-sm font-medium text-muted-foreground">Proprietário</p>
                        <p className="text-lg font-semibold">{searchResults.owner}</p>
                      </div>
                      <div className="md:col-span-3 flex justify-end">
                        <Button onClick={handleCreateFromSearch} variant="outline" size="sm">
                          <Car className="h-4 w-4 mr-2" />
                          Criar/Atualizar Veículo
                        </Button>
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
                        {'fines' in searchResults && searchResults.fines && searchResults.fines.length > 0 ? (
                          searchResults.fines.map((fine) => (
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
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-4">
                              Nenhuma multa encontrada para este registro.
                            </TableCell>
                          </TableRow>
                        )}
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

            <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar/Atualizar Registro</DialogTitle>
                  <DialogDescription>
                    Use os dados da pesquisa para criar ou atualizar um registro no sistema
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {searchTab === 'cnh' && (
                    <Button 
                      onClick={handleCreateClient} 
                      className="w-full flex items-center justify-center"
                    >
                      <UserPlus className="h-5 w-5 mr-2" />
                      Criar/Atualizar Cliente
                    </Button>
                  )}
                  
                  {searchTab === 'vehicle' && (
                    <Button 
                      onClick={handleCreateVehicle} 
                      className="w-full flex items-center justify-center"
                    >
                      <Car className="h-5 w-5 mr-2" />
                      Criar/Atualizar Veículo
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setOpenCreateDialog(false)}
                    className="w-full"
                  >
                    Cancelar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="history">
            <SearchHistoryComponent />
          </TabsContent>
        </TabsSecondary>
      </CardContent>
      
      {selectedFines.length > 0 && activeTab === "search" && (
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
