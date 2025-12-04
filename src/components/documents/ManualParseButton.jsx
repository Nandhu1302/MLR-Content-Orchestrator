import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useManualDocumentParser } from "@/hooks/useManualDocumentParser";
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

// Sample parsed data structure for demo - this will be replaced with actual parsing
const generateSampleParsedData = () => ({
  indications: [
    "Treatment of HIV-1 infection in adults and pediatric patients",
    "For use in combination with other antiretroviral agents"
  ],
  dosage: {
    adults: "One tablet taken orally once daily with or without food",
    pediatric: "Weight-based dosing for patients ≥25 kg"
  },
  clinicalTrials: [
    {
      name: "Study 1489",
      description: "Treatment-naive patients",
      results: "Superior efficacy compared to comparator"
    },
    {
      name: "Study 1490", 
      description: "Treatment-experienced patients",
      results: "Non-inferior efficacy with improved safety profile"
    }
  ],
  adverseReactions: [
    "Diarrhea (3%)",
    "Nausea (5%)",
    "Headache (4%)",
    "Fatigue (2%)"
  ],
  contraindications: [
    "Hypersensitivity to any component",
    "Concomitant use with certain medications"
  ],
  warnings: [
    "Immune reconstitution syndrome",
    "New onset or worsening renal impairment",
    "Lactic acidosis and severe hepatomegaly"
  ],
  drugInteractions: [
    "May interact with rifampin and other inducers",
    "Dose adjustments required with certain anticonvulsants"
  ],
  extractionMetadata: {
    parsedAt: new Date().toISOString(),
    method: "manual_demo",
    sections: 7
  }
});

export const ManualParseButton = ({ documentId, onParseComplete }) => {
  const { parseDocument, parsing } = useManualDocumentParser();

  const handleParse = async () => {
    const sampleData = generateSampleParsedData();
    const success = await parseDocument(documentId, sampleData);
    if (success) {
      onParseComplete();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={parsing}
        >
          {parsing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Parsing...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Parse Now
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Parse Document Manually</AlertDialogTitle>
          <AlertDialogDescription>
            This will parse the document using sample clinical data for demo purposes. 
            The parsed data will include indications, dosage, clinical trials, adverse reactions, 
            and other key sections needed for content generation.
            <br /><br />
            <strong>Note:</strong> This is a temporary solution for up to 5 documents for demo purposes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleParse} disabled={parsing}>
            {parsing ? "Parsing..." : "Parse Document"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};