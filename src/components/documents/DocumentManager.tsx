
import React, { useEffect, useState } from 'react';
import { DocumentUploader } from './DocumentUploader';
import { DocumentList } from './DocumentList';
import { Document, DocumentService } from '@/services/DocumentService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentManagerProps {
  entityType: 'client' | 'vehicle' | 'process';
  entityId: string;
  title?: string;
}

export const DocumentManager = ({ entityType, entityId, title }: DocumentManagerProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('view');

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await DocumentService.getDocumentsByEntity(entityType, entityId);
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [entityType, entityId]);

  const handleDeleteDocument = (deletedId: string) => {
    setDocuments(documents.filter(doc => doc.id !== deletedId));
  };

  const handleUploadSuccess = () => {
    fetchDocuments();
    setActiveTab('view');
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {title || "Documentos"}
            {isLoading ? ' (Carregando...)' : ` (${documents.length})`}
          </h3>
          
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Visualizar
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Enviar
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="view" className="p-4">
            <DocumentList 
              documents={documents} 
              onDelete={handleDeleteDocument} 
              onRefresh={fetchDocuments} 
            />
          </TabsContent>
          
          <TabsContent value="upload" className="p-4">
            <DocumentUploader 
              entityType={entityType} 
              entityId={entityId} 
              onSuccess={handleUploadSuccess} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
