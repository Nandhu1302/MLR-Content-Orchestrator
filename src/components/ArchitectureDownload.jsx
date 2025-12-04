import { Button } from "@/components/ui/button";
import { Download, FileText, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSolutionArchitecture, generateGlocalizationArchitecture } from "@/utils/architectureExport";

export const ArchitectureDownload = () => {
  const { toast } = useToast();

  const handleSolutionArchitectureDownload = () => {
    try {
      generateSolutionArchitecture();
      toast({
        title: "Architecture Downloaded",
        description: "Solution architecture presentation has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate architecture presentation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGlocalizationArchitectureDownload = () => {
    try {
      generateGlocalizationArchitecture();
      toast({
        title: "Architecture Downloaded",
        description: "Glocalization deep dive presentation has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate Glocalization presentation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Technical Architecture</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Download comprehensive architecture documentation in editable PowerPoint format
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          onClick={handleSolutionArchitectureDownload}
          variant="outline"
          className="w-full justify-start gap-2 h-auto py-4 px-4"
        >
          <FileText className="h-5 w-5" />
          <div className="text-left">
            <div className="font-semibold">Solution Architecture</div>
            <div className="text-xs text-muted-foreground">
              Complete technical & business architecture
            </div>
          </div>
          <Download className="h-4 w-4 ml-auto" />
        </Button>

        <Button
          onClick={handleGlocalizationArchitectureDownload}
          variant="outline"
          className="w-full justify-start gap-2 h-auto py-4 px-4"
        >
          <Layers className="h-5 w-5" />
          <div className="text-left">
            <div className="font-semibold">Glocalization Deep Dive</div>
            <div className="text-xs text-muted-foreground">
              Detailed module architecture & design
            </div>
          </div>
          <Download className="h-4 w-4 ml-auto" />
        </Button>
      </div>
    </div>
  );
};