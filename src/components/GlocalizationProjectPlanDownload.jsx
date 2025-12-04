
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { generateGlocalizationProjectPlan } from "@/utils/glocalizationProjectPlan";
import { useToast } from "@/hooks/use-toast";

export const GlocalizationProjectPlanDownload = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      generateGlocalizationProjectPlan();
      toast({
        title: "Success",
        description: "Glocalization project plan downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating project plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate project plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleDownload} className="gap-1.5" size="sm">
      <FileText className="h-4 w-4" />
      Glocalization Plan
    </Button>
  );
};
