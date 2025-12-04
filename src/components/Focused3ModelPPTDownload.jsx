import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { generateFocused3ModelPresentation } from "@/utils/focused3ModelPresentation";
import { useToast } from "@/hooks/use-toast";

export const Focused3ModelPPTDownload = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      generateFocused3ModelPresentation();
      toast({
        title: "Success",
        description: "Top 3 business models presentation downloaded successfully",
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
      Top 3 Models
    </Button>
  );
};