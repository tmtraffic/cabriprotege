
import React, { useState } from 'react';
import { Document, DocumentService } from '@/services/DocumentService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileText,
  Trash2,
  Download,
  Eye,
  Search,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface DocumentListProps {
  documents: Document[];
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
  showEntityType?: boolean;
}

export const DocumentList = ({ 
  documents, 
  onDelete, 
  onRefresh,
  showEntityType = false 
}: DocumentListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getFileTypeIcon = (fileType: string | null) => {
    // Simple file type detection
    if (!fileType) return <FileText className="h-10 w-10 text-blue-500" />;
    
    if (fileType.includes('image')) {
      return (
        <div className="bg-gray-100 rounded-md flex items-center justify-center p-2">
          <img 
            src="/placeholder.svg" 
            alt="Thumbnail" 
            className="h-10 w-10 object-cover"
          />
        </div>
      );
    }
    
    if (fileType.includes('pdf')) {
      return <FileText className="h-10 w-10 text-red-500" />;
    }
    
    if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-10 w-10 text-blue-700" />;
    }
    
    if (fileType.includes('excel') || fileType.includes('sheet')) {
      return <FileText className="h-10 w-10 text-green-700" />;
    }
    
    return <FileText className="h-10 w-10 text-gray-500" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (bytes === null) return 'Tamanho desconhecido';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getEntityTypeLabel = (type: string) => {
    switch (type) {
      case 'client': return 'Cliente';
      case 'vehicle': return 'Veículo';
      case 'process': return 'Processo';
      default: return type;
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      try {
        await DocumentService.deleteDocument(id);
        toast({
          title: "Documento excluído",
          description: "O documento foi excluído com sucesso."
        });
        if (onRefresh) onRefresh();
        if (onDelete) onDelete(id);
      } catch (error) {
        console.error('Error deleting document:', error);
        toast({
          title: "Erro ao excluir documento",
          description: "Ocorreu um erro ao excluir o documento.",
          variant: "destructive"
        });
      }
    }
  };

  // Simulate Google Drive preview link (in a real app, this would be a real URL)
  const getPreviewLink = (fileId: string) => {
    return `#preview-${fileId}`;
  };

  // Simulate Google Drive download link (in a real app, this would be a real URL)
  const getDownloadLink = (fileId: string) => {
    return `#download-${fileId}`;
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar documentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <p className="mt-2 text-lg font-medium">Nenhum documento encontrado</p>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? 'Tente uma pesquisa diferente.' : 'Envie documentos para começar.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-2">
                    <CardTitle className="text-base truncate" title={doc.name}>
                      {doc.name}
                    </CardTitle>
                    <CardDescription className="text-xs flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(doc.created_at), 'dd/MM/yyyy HH:mm')}
                    </CardDescription>
                  </div>
                  {getFileTypeIcon(doc.file_type)}
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                {doc.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {doc.description}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {formatFileSize(doc.size)}
                  </Badge>
                  
                  {showEntityType && (
                    <Badge variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {getEntityTypeLabel(doc.entity_type)}
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={getPreviewLink(doc.drive_file_id)} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={getDownloadLink(doc.drive_file_id)} download>
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </a>
                  </Button>
                </div>
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
