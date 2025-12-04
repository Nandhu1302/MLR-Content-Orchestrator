import { useState, useEffect } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, FileText } from "lucide-react";
import { useBrand } from "@/contexts/BrandContext";

export const PIUploadModal = ({ brandId, documentType = 'pi', onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [drugName, setDrugName] = useState("");
  const [version, setVersion] = useState("");
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const { toast } = useToast();
  const { selectedBrand } = useBrand();

  const activeBrandId = brandId || selectedBrand?.id;

  // Auto-populate drug name from selected brand
  useEffect(() => {
    if (selectedBrand?.brand_name) {
      setDrugName(selectedBrand.brand_name);
    }
  }, [selectedBrand?.brand_name]);
  const documentTypeLabel = documentType === 'pi' ? 'Prescribing Information' : 'Important Safety Information';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      if (selectedFile.size > 20 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 20MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !drugName || !activeBrandId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload PDF to storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("prescribing-information")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("prescribing-information")
        .getPublicUrl(fileName);

      // Create database record
      const { data: piRecord, error: dbError } = await supabase
        .from("brand_documents")
        .insert({
          brand_id: activeBrandId,
          drug_name: drugName,
          document_url: publicUrl,
          file_path: fileName,
          document_type: documentType,
          version: version || null,
          parsing_status: "pending",
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: `${documentTypeLabel} uploaded`,
        description: "Document parsing will begin shortly",
      });

      // Trigger parsing edge function
      const { error: parseError } = await supabase.functions.invoke(
        "parse-prescribing-information",
        {
          body: { piId: piRecord.id },
        }
      );

      if (parseError) {
        console.error("Error triggering parse:", parseError);
      }

      // Start evidence extraction in background
      setExtracting(true);
      toast({
        title: "Starting evidence extraction",
        description: "Extracting clinical claims and references...",
      });

      const { error: extractError } = await supabase.functions.invoke('extract-clinical-evidence', {
        body: { piDocumentId: piRecord.id }
      });

      if (extractError) {
        console.error('Evidence extraction error:', extractError);
        toast({
          title: "Evidence extraction queued",
          description: "Claims and references will be extracted automatically",
          variant: "default"
        });
      } else {
        toast({
          title: "Evidence extracted",
          description: "Clinical claims, references, and content segments are ready",
        });
      }

      // Reset form
      setFile(null);
      setDrugName("");
      setVersion("");
      onUploadComplete?.();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload PI document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setExtracting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload {documentTypeLabel}
        </DialogTitle>
        <DialogDescription>
          Upload {documentTypeLabel.toLowerCase()} for {selectedBrand?.brand_name}. The document will be parsed and evidence will be extracted automatically.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="drugName">Drug Name (auto-populated)</Label>
          <Input
            id="drugName"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            placeholder={selectedBrand?.brand_name || "Drug name"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="version">Version / Revision Date</Label>
          <Input
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g., v2.1 Updated January 2025"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">PDF Document *</Label>
          <div className="flex items-center gap-2">
            <Input
              id="file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="flex-1"
            />
            {file && (
              <span className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum file size: 20MB. Only PDF files are supported.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={handleUpload} disabled={uploading || extracting || !file || !drugName} className="w-full">
          {uploading || extracting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploading ? 'Uploading...' : 'Extracting...'}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Extract
            </>
          )}
        </Button>
      </div>
    </>
  );
};