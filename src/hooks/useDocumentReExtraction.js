import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDocumentReExtraction = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  /**
   * Triggers re-extraction for a single document using a Supabase Edge Function.
   * @param {string} documentId - The ID of the document to re-extract.
   * @param {string} [documentTitle] - The title of the document for user notification.
   */
  const reExtractDocument = async (documentId, documentTitle) => {
    setIsExtracting(true);
    
    try {
      // Invoke the Edge Function to start the extraction process
      const { data, error } = await supabase.functions.invoke('extract-document-insights', {
        body: { documentId }
      });

      if (error) {
        console.error('Re-extraction error:', error);
        throw error;
      }

      console.log('Re-extraction response:', data);
      
      if (data?.success === false) {
        console.error('Re-extraction failed:', data.error, data.details);
        throw new Error(data.error || 'Re-extraction failed');
      }
      
      const stats = data?.stats || {};
      const statsMsg = `${stats.claims || 0} claims, ${stats.references || 0} refs, ${stats.segments || 0} segments`;
      
      toast({
        title: "Re-extraction Complete",
        description: `Updated ${documentTitle || 'document'}: ${statsMsg}. Refreshing...`,
      });

      // Reload the page to show updated data (a hard reload is often needed to update complex caches)
      setTimeout(() => window.location.reload(), 1500);

      return data;
    } catch (error) {
      console.error('Re-extraction error in catch block:', error);
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "Failed to re-extract document",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  /**
   * Triggers re-extraction for all completed documents associated with a brand.
   * @param {string} brandId - The ID of the brand.
   */
  const reExtractAllDocuments = async (brandId) => {
    setIsExtracting(true);
    
    try {
      // Step 1: Get all completed documents for the brand
      const { data: documents, error: fetchError } = await supabase
        .from('brand_documents')
        .select('id, document_title')
        .eq('brand_id', brandId)
        .eq('parsing_status', 'completed');

      if (fetchError) throw fetchError;

      if (!documents || documents.length === 0) {
        toast({
          title: "No Documents",
          description: "No completed documents found to re-extract",
        });
        return;
      }

      toast({
        title: "Batch Re-extraction Started",
        description: `Processing ${documents.length} documents...`,
      });

      // Step 2: Re-extract each document concurrently
      const results = await Promise.allSettled(
        documents.map(doc => 
          supabase.functions.invoke('extract-document-insights', {
            body: { documentId: doc.id }
          })
        )
      );

      // Step 3: Process results and notify user
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.data?.success === false)).length;

      toast({
        title: "Batch Re-extraction Complete",
        description: `Updated ${successful} documents${failed > 0 ? `, ${failed} failed` : ''}. Refreshing page...`,
        variant: failed > 0 ? "destructive" : "default",
      });

      // Reload to show updated data
      setTimeout(() => window.location.reload(), 2000);

    } catch (error) {
      console.error('Batch re-extraction error in catch block:', error);
      toast({
        title: "Batch Extraction Failed",
        description: error instanceof Error ? error.message : "Failed to re-extract documents",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return {
    reExtractDocument,
    reExtractAllDocuments,
    isExtracting,
  };
};