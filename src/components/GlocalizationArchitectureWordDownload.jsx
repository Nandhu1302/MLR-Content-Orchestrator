import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { generateGlocalizationArchitectureDocument } from "@/utils/glocalizationArchitectureDocExport";
import { toast } from "sonner";
import { useState } from "react";

export const GlocalizationArchitectureWordDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateGlocalizationArchitectureDocument();
      toast.success("Glocalization Architecture downloaded successfully!", {
        description: "Check your downloads folder for the comprehensive Word document."
      });
    } catch (error) {
      toast.error("Failed to download architecture document", {
        description: "Please try again or contact support."
      });
      console.error("Download error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      className="gap-1.5"
      size="sm"
      disabled={isGenerating}
    >
      <FileText className="h-4 w-4" />
      {isGenerating ? "Generating..." : "Architecture Doc"}
    </Button>
  );
};