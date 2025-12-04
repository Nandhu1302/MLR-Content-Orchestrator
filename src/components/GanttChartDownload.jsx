import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateGanttChartExcel } from "@/utils/ganttChartExport";
import { toast } from "sonner";

export const GanttChartDownload = () => {
  const handleDownload = () => {
    try {
      generateGanttChartExcel();
      toast.success("Gantt Chart downloaded successfully!", {
        description: "Check your downloads folder for the Excel file."
      });
    } catch (error) {
      toast.error("Failed to download Gantt Chart", {
        description: "Please try again or contact support."
      });
      console.error("Download error:", error);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      className="gap-1.5"
      size="sm"
    >
      <Download className="h-4 w-4" />
      Gantt Chart
    </Button>
  );
};