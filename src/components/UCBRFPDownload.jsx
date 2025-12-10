import { Button } from "@/components/ui/button";
import { FileText, Presentation } from "lucide-react";
import { generateUCBRFPResponsePresentation } from "@/utils/ucbRFPResponsePresentation";
import { generateUCBRFPResponseDocument } from "@/utils/ucbRFPResponseWordDocument";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const UCBRFPDownload = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(null);

  const handleDownloadPPT = () => {
    setIsGenerating('ppt');
    try {
      generateUCBRFPResponsePresentation();
      toast({
        title: "Success",
        description: "UCB RFP Response PowerPoint downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating presentation:", error);
      toast({
        title: "Error",
        description: "Failed to generate presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleDownloadWord = async () => {
    setIsGenerating('word');
    try {
      await generateUCBRFPResponseDocument();
      toast({
        title: "Success",
        description: "UCB RFP Response Word document downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleDownloadWord}
        className="gap-1.5"
        size="sm"
        variant="outline"
        disabled={isGenerating !== null}
      >
        <FileText className="h-4 w-4" />
        {isGenerating === 'word' ? "Generating..." : "Word"}
      </Button>
      <Button
        onClick={handleDownloadPPT}
        className="gap-1.5"
        size="sm"
        disabled={isGenerating !== null}
      >
        <Presentation className="h-4 w-4" />
        {isGenerating === 'ppt' ? "Generating..." : "PowerPoint"}
      </Button>
    </div>
  );
};
