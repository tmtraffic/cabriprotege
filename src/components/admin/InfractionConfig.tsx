import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2,
  FileText,
  AlertTriangle,
  Search
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Tipos para os dados de infrações
interface InfractionCode {
  id: string;
  code: string;
  description: string;
  severity: "light" | "medium" | "severe" | "very-severe";
  points: number;
  baseValue: number;
  appealCost: number;
  saleValue: number;
}

const severityMap = {
  "light": { label: "Leve", points: 3 },
  "medium": { label: "Média", points: 4 },
  "severe": { label: "Grave", points: 5 },
  "very-severe": { label: "Gravíssima", points: 7 }
};

const InfractionConfig = () => {
  const [infractionCodes, setInfractionCodes] = useState<InfractionCode[]>([
    {
      id: "1",
      code: "74550",
      description: "TRANSITAR EM VELOCIDADE SUPERIOR À MÁXIMA PERMITIDA EM ATÉ 20%",
      severity: "medium",
      points: 4,
      baseValue: 130.16,
      appealCost: 65.00,
      saleValue: 150.00
    },
    {
      id: "2",
      code: "74630",
      description: "TRANSITAR EM VELOCIDADE SUPERIOR À MÁXIMA PERMITIDA EM MAIS DE 20% ATÉ 50%",
      severity: "severe",
      points: 5,
      baseValue: 195.23,
      appealCost: 80.00,
      saleValue: 180.00
    },
    {
      id: "3",
      code: "74710",
      description: "TRANSITAR EM VELOCIDADE SUPERIOR À MÁXIMA PERMITIDA EM MAIS DE 50%",
      severity: "very-severe",
      points: 7,
      baseValue: 880.41,
      appealCost: 120.00,
      saleValue: 250.00
    },
    {
      id: "4",
      code: "60503",
      description: "ESTACIONAR EM LOCAL PROIBIDO",
      severity: "light",
      points: 3,
      baseValue: 88.38,
      appealCost: 50.00,
      saleValue: 120.00
    },
    {
      id: "5",
      code: "73662",
      description: "AVANÇAR O SINAL VERMELHO DO SEMÁFORO",
      severity: "very-severe",
      points: 7,
      baseValue: 293.47,
      appealCost: 100.00,
      saleValue: 220.00
    }
  ]);
  
  const [isAddingCode, setIsAddingCode] = useState(false);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [selectedCode, setSelectedCode] = useState<InfractionCode | null>(null);
  const [newCode, setNewCode] = useState<Partial<InfractionCode>>({
    severity: "medium"
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();

  const handleAddCode = () => {
    if (!newCode.code || !newCode.description) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o código e a descrição da infração."
      });
      return;
    }
    
    // Atribuir pontos baseado na gravidade
    const points = severityMap[newCode.severity as keyof typeof severityMap].points;
    
    const code: InfractionCode = {
      id: `${infractionCodes.length + 1}`,
      code: newCode.code,
      description: newCode.description,
      severity: newCode.severity as InfractionCode["severity"],
      points: points,
      baseValue: newCode.baseValue || 0,
      appealCost: newCode.appealCost || 0,
      saleValue: newCode.saleValue || 0
    };
    
    setInfractionCodes([...infractionCodes, code]);
    setNewCode({
      severity: "medium"
    });
    setIsAddingCode(false);
    
    toast({
      title: "Código adicionado",
      description: `Código ${code.code} foi adicionado com sucesso.`
    });
  };

  const handleUpdateCode = () => {
    if (!selectedCode || !selectedCode.code || !selectedCode.description) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }
    
    // Atualizar pontos baseado na gravidade, se a gravidade foi alterada
    const points = severityMap[selectedCode.severity].points;
    
    const updatedCodes = infractionCodes.map(code => {
      if (code.id === selectedCode.id) {
        return {
          ...selectedCode,
          points: points
        };
      }
      return code;
    });
    
    setInfractionCodes(updatedCodes);
    setSelectedCode(null);
    setIsEditingCode(false);
    
    toast({
      title: "Código atualizado",
      description: `Código ${selectedCode.code} foi atualizado com sucesso.`
    });
  };

  const handleDeleteCode = (id: string) => {
    setInfractionCodes(infractionCodes.filter(code => code.id !== id));
    
    toast({
      title: "Código removido",
      description: "O código de infração foi removido com sucesso."
    });
  };

  const getSeverityBadge = (severity: InfractionCode["severity"]) => {
    const severityClasses = {
      "light": "bg-blue-50 text-blue-700 border-blue-200",
      "medium": "bg-yellow-50 text-yellow-700 border-yellow-200",
      "severe": "bg-orange-50 text-orange-700 border-orange-200",
      "very-severe": "bg-red-50 text-red-700 border-red-200"
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${severityClasses[severity]}`}>
        {severityMap[severity].label}
      </span>
    );
  };

  // Filtrar os códigos baseado na busca
  const filteredCodes = searchQuery
    ? infractionCodes.filter(code => 
        code.code.includes(searchQuery) || 
        code.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : infractionCodes;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Configuração de Infrações</CardTitle>
            <CardDescription>
              Gerencie códigos de infrações, custos de recursos e valores de venda
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingCode(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Código
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou descrição..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            Importar
          </Button>
          <Button variant="outline">
            Exportar
          </Button>
        </div>
        
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Código</TableHead>
                <TableHead className="w-[300px]">Descrição</TableHead>
                <TableHead>Gravidade</TableHead>
                <TableHead>Pontos</TableHead>
                <TableHead>Valor Base (R$)</TableHead>
                <TableHead>Custo Recurso (R$)</TableHead>
                <TableHead>Valor Venda (R$)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCodes.map(code => (
                <TableRow key={code.id}>
                  <TableCell className="font-medium">{code.code}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={code.description}>
                    {code.description}
                  </TableCell>
                  <TableCell>{getSeverityBadge(code.severity)}</TableCell>
                  <TableCell>{code.points}</TableCell>
                  <TableCell>{code.baseValue.toFixed(2)}</TableCell>
                  <TableCell>{code.appealCost.toFixed(2)}</TableCell>
                  <TableCell>{code.saleValue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedCode(code);
                          setIsEditingCode(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteCode(code.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredCodes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-8 w-8 mb-2" />
                      {searchQuery ? (
                        <>
                          <p>Nenhum código encontrado para "{searchQuery}"</p>
                          <p className="text-sm">Tente outro termo ou adicione um novo código</p>
                        </>
                      ) : (
                        <>
                          <p>Nenhum código de infração cadastrado</p>
                          <p className="text-sm">Adicione códigos de infração para gerenciar valores</p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Exibindo {filteredCodes.length} de {infractionCodes.length} códigos
        </div>
        <Button variant="outline">
          Atualizar Tabela DENATRAN
        </Button>
      </CardFooter>

      {/* Modal para adicionar código */}
      <Dialog open={isAddingCode} onOpenChange={setIsAddingCode}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Código de Infração</DialogTitle>
            <DialogDescription>
              Cadastre um novo código de infração e seus valores.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  value={newCode.code || ""}
                  onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="severity">Gravidade</Label>
                <Select 
                  value={newCode.severity} 
                  onValueChange={(value) => setNewCode({ ...newCode, severity: value as InfractionCode["severity"] })}
                >
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Leve (3 pontos)</SelectItem>
                    <SelectItem value="medium">Média (4 pontos)</SelectItem>
                    <SelectItem value="severe">Grave (5 pontos)</SelectItem>
                    <SelectItem value="very-severe">Gravíssima (7 pontos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                rows={2}
                value={newCode.description || ""}
                onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="baseValue">Valor Base (R$)</Label>
                <Input
                  id="baseValue"
                  type="number"
                  step="0.01"
                  value={newCode.baseValue || ""}
                  onChange={(e) => setNewCode({ ...newCode, baseValue: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="appealCost">Custo Recurso (R$)</Label>
                <Input
                  id="appealCost"
                  type="number"
                  step="0.01"
                  value={newCode.appealCost || ""}
                  onChange={(e) => setNewCode({ ...newCode, appealCost: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="saleValue">Valor Venda (R$)</Label>
                <Input
                  id="saleValue"
                  type="number"
                  step="0.01"
                  value={newCode.saleValue || ""}
                  onChange={(e) => setNewCode({ ...newCode, saleValue: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCode(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCode}>
              Adicionar Código
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar código */}
      <Dialog open={isEditingCode} onOpenChange={setIsEditingCode}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Código de Infração</DialogTitle>
            <DialogDescription>
              Atualize as informações e valores deste código.
            </DialogDescription>
          </DialogHeader>
          {selectedCode && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-code">Código</Label>
                  <Input
                    id="edit-code"
                    value={selectedCode.code}
                    onChange={(e) => setSelectedCode({ ...selectedCode, code: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-severity">Gravidade</Label>
                  <Select 
                    value={selectedCode.severity} 
                    onValueChange={(value) => setSelectedCode({ ...selectedCode, severity: value as InfractionCode["severity"] })}
                  >
                    <SelectTrigger id="edit-severity">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Leve (3 pontos)</SelectItem>
                      <SelectItem value="medium">Média (4 pontos)</SelectItem>
                      <SelectItem value="severe">Grave (5 pontos)</SelectItem>
                      <SelectItem value="very-severe">Gravíssima (7 pontos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  rows={2}
                  value={selectedCode.description}
                  onChange={(e) => setSelectedCode({ ...selectedCode, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-baseValue">Valor Base (R$)</Label>
                  <Input
                    id="edit-baseValue"
                    type="number"
                    step="0.01"
                    value={selectedCode.baseValue}
                    onChange={(e) => setSelectedCode({ ...selectedCode, baseValue: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-appealCost">Custo Recurso (R$)</Label>
                  <Input
                    id="edit-appealCost"
                    type="number"
                    step="0.01"
                    value={selectedCode.appealCost}
                    onChange={(e) => setSelectedCode({ ...selectedCode, appealCost: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-saleValue">Valor Venda (R$)</Label>
                  <Input
                    id="edit-saleValue"
                    type="number"
                    step="0.01"
                    value={selectedCode.saleValue}
                    onChange={(e) => setSelectedCode({ ...selectedCode, saleValue: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedCode(null);
              setIsEditingCode(false);
            }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateCode}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InfractionConfig;
