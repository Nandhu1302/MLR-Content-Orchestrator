
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { generateProjectPlanDocument } from "@/utils/projectPlanExport";
import { toast } from "sonner";
import { useState } from "react";

export const ProjectPlanDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateProjectPlanDocument();
      toast.success("Project Plan downloaded successfully!", {
        description: "Check your downloads folder for the Word document."
      });
    } catch (error) {
      toast.error("Failed to download Project Plan", {
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
      {isGenerating ? "Generating..." : "Project Plan"}
    </Button>
  );
};
