import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useDocumentReExtraction } from "@/hooks/useDocumentReExtraction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const BatchReExtractButton = ({ 
  brandId,
  documentCount = 0
}) => {
  const { reExtractAllDocuments, isExtracting } = useDocumentReExtraction();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isExtracting || documentCount === 0}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isExtracting ? 'animate-spin' : ''}`} />
          {isExtracting ? 'Re-extracting All...' : 'Re-extract All Documents'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Re-extract All Documents?</AlertDialogTitle>
          <AlertDialogDescription>
            This will re-extract insights from all {documentCount} completed documents. 
            This process may take several minutes and will update all clinical claims, 
            references, content segments, and safety statements with the latest extraction logic.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => reExtractAllDocuments(brandId)}>
            Re-extract All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};