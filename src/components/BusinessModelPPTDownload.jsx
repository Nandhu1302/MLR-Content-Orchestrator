import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { generateBusinessModelPresentation } from "@/utils/businessModelPresentationExport";
import { useToast } from "@/hooks/use-toast";

export const BusinessModelPPTDownload = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      generateBusinessModelPresentation();
      toast({
        title: "Success",
        description: "Business models presentation downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating presentation:", error);
      toast({
        title: "Error",
        description: "Failed to generate presentation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      className="gap-1.5"
      size="sm"
    >
      <FileText className="h-4 w-4" />
      Business Models
    </Button>
  );
};