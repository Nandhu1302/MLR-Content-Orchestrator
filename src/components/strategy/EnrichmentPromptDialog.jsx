import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Forward } from "lucide-react";

export function EnrichmentPromptDialog({
  open,
  themeName,
  onEnrich,
  onUseNow,
  onCancel
}) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Theme Needs Enrichment
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              <strong>"{themeName}"</strong> hasn't been enriched with intelligence yet.
            </p>
            <p className="text-sm">
              <strong>Enriching themes improves content quality by:</strong>
            </p>
            <ul className="text-sm list-disc list-inside space-y-1 ml-2">
              <li>Adding brand voice and messaging guidelines</li>
              <li>Including competitive insights</li>
              <li>Incorporating market positioning data</li>
              <li>Ensuring regulatory compliance</li>
              <li>Leveraging public domain intelligence</li>
            </ul>
            <p className="text-sm font-medium pt-2">
              Would you like to enrich this theme first, or use it as-is?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <Button 
            onClick={onUseNow}
            variant="outline"
            className="gap-2"
          >
            <Forward className="h-4 w-4" />
            Use Now
          </Button>
          <Button 
            onClick={onEnrich}
            className="gap-2 bg-primary"
          >
            <Sparkles className="h-4 w-4" />
            Enrich First (Recommended)
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}