import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useDocumentReExtraction } from "@/hooks/useDocumentReExtraction";

export const ReExtractButton = ({ 
  documentId, 
  documentTitle,
  variant = "outline",
  size = "sm"
}) => {
  const { reExtractDocument, isExtracting } = useDocumentReExtraction();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => reExtractDocument(documentId, documentTitle)}
      disabled={isExtracting}
    >
      <RefreshCw className={`h-4 w-4 ${isExtracting ? 'animate-spin' : ''} ${size !== 'icon' ? 'mr-2' : ''}`} />
      {size !== 'icon' && (isExtracting ? 'Re-extracting...' : 'Re-extract')}
    </Button>
  );
};