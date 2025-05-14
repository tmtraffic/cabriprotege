
import { supabase } from "@/integrations/supabase/client";

export interface Document {
  id: string;
  name: string;
  drive_file_id: string;
  file_type: string | null;
  size: number | null;
  created_at: string;
  updated_at: string;
  owner_id: string;
  entity_type: 'client' | 'vehicle' | 'process';
  entity_id: string;
  description: string | null;
}

export interface DocumentInsert {
  name: string;
  drive_file_id: string;
  file_type?: string;
  size?: number;
  owner_id: string;
  entity_type: 'client' | 'vehicle' | 'process';
  entity_id: string;
  description?: string;
}

export const DocumentService = {
  // Get documents by entity (client, vehicle, process)
  async getDocumentsByEntity(entityType: string, entityId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
    
    return data || [];
  },

  // Get all documents (for admin interface)
  async getAllDocuments(): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all documents:', error);
      throw error;
    }
    
    return data || [];
  },

  // Create a document record
  async createDocument(document: DocumentInsert): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating document:', error);
      throw error;
    }
    
    return data;
  },

  // Update a document
  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating document:', error);
      throw error;
    }
    
    return data;
  },

  // Delete a document
  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
};
