
import React, { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { DocumentService } from '@/services/DocumentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText } from 'lucide-react';

interface DocumentUploaderProps {
  entityType: 'client' | 'vehicle' | 'process';
  entityId: string;
  onSuccess?: () => void;
}

export const DocumentUploader = ({ entityType, entityId, onSuccess }: DocumentUploaderProps) => {
  const { user } = useSupabaseAuth();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // For now, we'll simulate uploading to Google Drive
  // In a real implementation, this would be done via a Supabase Edge Function
  const simulateUpload = async (file: File): Promise<{ fileId: string, fileName: string }> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          // Simulate a Google Drive file ID
          const fileId = `drive-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          resolve({ fileId, fileName: file.name });
        }
      }, 300);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    try {
      setIsUploading(true);
      
      // Simulate uploading to Google Drive
      const { fileId, fileName } = await simulateUpload(file);
      
      // Create document record in Supabase
      await DocumentService.createDocument({
        name: fileName,
        drive_file_id: fileId,
        file_type: file.type,
        size: file.size,
        owner_id: user.id,
        entity_type: entityType,
        entity_id: entityId,
        description: description || undefined
      });
      
      toast({
        title: "Documento enviado com sucesso",
        description: `${file.name} foi enviado e vinculado à entidade.`
      });
      
      // Reset form
      setFile(null);
      setDescription('');
      setUploadProgress(0);
      
      // Trigger refresh if callback provided
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Erro ao enviar documento",
        description: "Ocorreu um erro ao enviar o documento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-medium mb-4">Enviar Novo Documento</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file">Selecione o arquivo</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              placeholder="Descrição do documento..."
              className="mt-1"
            />
          </div>
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${uploadProgress}%` }}
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Enviando... {uploadProgress}%
              </p>
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={!file || isUploading}
            className="mt-2 w-full"
          >
            {isUploading ? (
              <span className="flex items-center">Enviando...</span>
            ) : (
              <span className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Enviar Documento
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
