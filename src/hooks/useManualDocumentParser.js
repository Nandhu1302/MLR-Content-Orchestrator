import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook to handle the manual parsing and storage of document data
 * via a Supabase Edge Function.
 */
export const useManualDocumentParser = () => {
  const { toast } = useToast();
  const [parsing, setParsing] = useState(false);

  /**
   * Invokes the backend function to store manually parsed data for a document.
   *
   * @param {string} documentId - The ID of the document being parsed.
   * @param {object} parsedData - The structured data to be stored (e.g., claims, references).
   * @returns {Promise<boolean>} - True if parsing/storage was successful, false otherwise.
   */
  const parseDocument = async (documentId, parsedData) => {
    setParsing(true);
    
    try {
      // Call the Supabase Edge Function to process and store the structured data
      const { data, error } = await supabase.functions.invoke('store-parsed-document', {
        body: { documentId, parsedData }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to store parsed data');
      }

      toast({
        title: "Document parsed successfully",
        description: "The document is now ready for content generation",
      });

      return true;
    } catch (error) {
      console.error('Error parsing document:', error);
      toast({
        title: "Parsing failed",
        description: error instanceof Error ? error.message : "Failed to parse document",
        variant: "destructive",
      });
      return false;
    } finally {
      setParsing(false);
    }
  };

  return { parseDocument, parsing };
};