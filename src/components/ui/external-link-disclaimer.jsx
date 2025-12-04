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
import { ExternalLink } from "lucide-react";

export const ExternalLinkDisclaimer = ({ isOpen, onClose, onConfirm, url, linkText }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            External Link Notice
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are about to leave the <strong>Cognizant Content Orchestrator Hub</strong>
              and navigate to an external website.
            </p>
            {url && (
              <p className="text-sm bg-muted p-2 rounded break-all">
                <strong>Destination:</strong> {url}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Cognizant is not responsible for the content, privacy policies, or security
              of external websites. Please ensure you trust the destination before proceeding.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Stay Here
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Continue to {linkText || "External Site"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
