import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ReprocessButton = ({ 
  documentId, 
  documentTitle,
  onReprocessComplete 
}) => {
  const [isReprocessing, setIsReprocessing] = useState(false);
  const { toast } = useToast();

  const handleReprocess = async () => {
    try {
      setIsReprocessing(true);
      
      toast({
        title: "Re-extracting visual assets",
        description: `Processing ${documentTitle || 'document'} with vision AI...`,
      });

      const { data, error } = await supabase.functions.invoke('reprocess-document', {
        body: { documentId }
      });

      if (error) throw error;

      toast({
        title: "Visual extraction complete!",
        description: `Extracted ${data?.visualAssets || 0} visual assets from ${documentTitle || 'document'}`,
      });

      onReprocessComplete?.();
    } catch (error) {
      console.error('Reprocess error:', error);
      toast({
        title: "Reprocessing failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsReprocessing(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleReprocess}
      disabled={isReprocessing}
      title="Re-extract visual assets with AI vision"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${isReprocessing ? 'animate-spin' : ''}`} />
    </Button>
  );
};