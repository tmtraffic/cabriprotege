
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Download, Upload, CheckCircle, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type ImportType = "clients" | "vehicles" | "processes" | "fines";

const templateLinks = {
  clients: "/templates/clientes-template.xlsx",
  vehicles: "/templates/veiculos-template.xlsx",
  processes: "/templates/processos-template.xlsx",
  fines: "/templates/multas-template.xlsx"
};

const BulkImportForm = () => {
  const [importType, setImportType] = useState<ImportType>("clients");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Verificar se é um arquivo Excel
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls') && !selectedFile.name.endsWith('.csv')) {
        toast({
          variant: "destructive",
          title: "Formato inválido",
          description: "Por favor, envie apenas arquivos Excel (.xlsx, .xls) ou CSV."
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadStatus("idle");
    }
  };

  const handleDownloadTemplate = () => {
    // Em um ambiente real, isso apontaria para arquivos reais no servidor
    const templateUrl = templateLinks[importType];
    
    toast({
      title: "Download iniciado",
      description: `O template para importação de ${getImportTypeName(importType)} será baixado em instantes.`
    });
    
    // Simular download (Em produção, isso seria um link real para o arquivo)
    console.log(`Downloading template from: ${templateUrl}`);
    
    // Simular abertura de nova janela para download
    window.open(templateUrl, "_blank");
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para importar."
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus("uploading");
    
    // Simulação de upload com progresso
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Simulação de processamento no servidor
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsUploading(false);
    setUploadStatus("success");
    
    toast({
      title: "Importação concluída",
      description: `${file.name} foi importado com sucesso!`,
    });
  };

  const getImportTypeName = (type: ImportType): string => {
    const names = {
      clients: "Clientes",
      vehicles: "Veículos",
      processes: "Processos",
      fines: "Multas"
    };
    return names[type];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Importação em Lote</CardTitle>
        <CardDescription>
          Importe múltiplos registros de uma vez utilizando planilhas Excel ou CSV.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="import-type">Tipo de Importação</Label>
          <Select 
            value={importType} 
            onValueChange={(value) => setImportType(value as ImportType)}
          >
            <SelectTrigger id="import-type">
              <SelectValue placeholder="Selecione o tipo de importação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clients">Clientes</SelectItem>
              <SelectItem value="vehicles">Veículos</SelectItem>
              <SelectItem value="processes">Processos</SelectItem>
              <SelectItem value="fines">Multas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Button 
            variant="outline" 
            className="w-full mb-4"
            onClick={handleDownloadTemplate}
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar Template para {getImportTypeName(importType)}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file-upload">Arquivo para Importação</Label>
          <div className="grid gap-2">
            <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-8 border-muted-foreground/25">
              <div className="flex flex-col items-center gap-2 text-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {file ? file.name : "Arraste seu arquivo ou clique para selecionar"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formatos suportados: XLS, XLSX, CSV
                  </p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
                <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {uploadStatus === "uploading" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Enviando</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-muted rounded overflow-hidden">
              <div 
                className="h-full bg-cabricop-blue transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {uploadStatus === "success" && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Importação Concluída</AlertTitle>
            <AlertDescription>
              Seu arquivo foi importado com sucesso.
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro na Importação</AlertTitle>
            <AlertDescription>
              Ocorreu um erro durante a importação. Por favor, verifique seu arquivo e tente novamente.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleImport} 
          disabled={!file || isUploading || uploadStatus === "success"}
          className="w-full"
        >
          {isUploading ? "Processando..." : "Iniciar Importação"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BulkImportForm;
