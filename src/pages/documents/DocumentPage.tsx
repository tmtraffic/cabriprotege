
import React, { useEffect, useState } from 'react';
import { Document, DocumentService } from '@/services/DocumentService';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUploader } from '@/components/documents/DocumentUploader';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilesIcon, UploadCloud, RefreshCw } from 'lucide-react';

const DocumentPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [entityType, setEntityType] = useState<'client' | 'vehicle' | 'process'>('client');
  const [entityId, setEntityId] = useState<string>('placeholder-id'); // This would normally be selected by the user

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, we're showing all documents
      const data = await DocumentService.getAllDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDeleteDocument = (deletedId: string) => {
    setDocuments(documents.filter(doc => doc.id !== deletedId));
  };

  const handleUploadSuccess = async () => {
    await fetchDocuments();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Documentos</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie documentos relacionados aos clientes, veículos e processos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UploadCloud className="h-5 w-5 mr-2" />
                Enviar Novo Documento
              </CardTitle>
              <CardDescription>
                Adicione um novo documento ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tipo de Entidade</label>
                <Select value={entityType} onValueChange={(value: any) => setEntityType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de entidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Cliente</SelectItem>
                    <SelectItem value="vehicle">Veículo</SelectItem>
                    <SelectItem value="process">Processo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DocumentUploader 
                entityType={entityType}
                entityId={entityId}
                onSuccess={handleUploadSuccess}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FilesIcon className="h-5 w-5 mr-2" />
                  Todos os Documentos
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchDocuments} 
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
              <CardDescription>
                {isLoading ? 'Carregando documentos...' : `${documents.length} documentos encontrados`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentList 
                documents={documents} 
                onDelete={handleDeleteDocument} 
                onRefresh={fetchDocuments}
                showEntityType={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
