import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, FileText, Loader2 } from "lucide-react";

const DOCUMENT_CATEGORIES = [
  { value: 'clinical', label: 'Clinical', icon: 'FileText', description: 'Clinical trial data, PI, study reports' },
  { value: 'marketing', label: 'Marketing', icon: 'Megaphone', description: 'Marketing materials, campaigns' },
  { value: 'regulatory', label: 'Regulatory', icon: 'Shield', description: 'FDA submissions, compliance' },
  { value: 'competitive-intelligence', label: 'Competitive Intelligence', icon: 'TrendingUp', description: 'Competitor analysis' },
  { value: 'brand-guidelines', label: 'Brand Guidelines', icon: 'Palette', description: 'Brand voice, visual identity' },
  { value: 'safety-information', label: 'Safety Information', icon: 'AlertTriangle', description: 'ISI, safety data' },
  { value: 'other', label: 'Other', icon: 'File', description: 'Miscellaneous documents' },
];

export const DocumentUploadModal = ({ brandId, onUploadComplete }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState([]);
  const [documentTitle, setDocumentTitle] = useState("");
  const [category, setCategory] = useState("clinical");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are supported",
        variant: "destructive",
      });
    }

    // Limit to 5 files
    if (files.length + pdfFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "You can upload up to 5 documents at once",
        variant: "destructive",
      });
      return;
    }

    setFiles([...files, ...pdfFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one PDF file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Get brand name for drug_name field (backward compatibility)
      const { data: brand } = await supabase
        .from('brand_profiles')
        .select('brand_name')
        .eq('id', brandId)
        .single();

      const uploadedDocs = [];

      for (const file of files) {
        const fileName = `${brandId}/${Date.now()}-${file.name}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('brand-documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Generate document URL from storage path
        const { data: { publicUrl } } = supabase.storage
          .from('brand-documents')
          .getPublicUrl(fileName);

        // Create document record
        const { data: doc, error: docError } = await supabase
          .from('brand_documents')
          .insert({
            brand_id: brandId,
            drug_name: brand?.brand_name || null,
            document_url: publicUrl,
            document_title: documentTitle || file.name.replace('.pdf', ''),
            document_category: category,
            document_tags: tags,
            file_path: fileName,
            file_size_bytes: file.size,
            document_type: category === 'clinical' ? 'pi' : category === 'safety-information' ? 'isi' : 'other',
            parsing_status: 'pending',
          })
          .select()
          .single();

        if (docError) throw docError;

        uploadedDocs.push(doc);
      }

      toast({
        title: "Documents uploaded successfully",
        description: `${files.length} document(s) uploaded. Starting parsing...`,
      });

      // Parse and extract insights from each document
      setExtracting(true);
      
      let successCount = 0;
      let failCount = 0;
      
      for (const doc of uploadedDocs) {
        try {
          console.log(`[DocumentUpload] Starting parse for document ${doc.id}: ${doc.document_title}`);
          
          // Parse document
          const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-brand-document', {
            body: { documentId: doc.id }
          });

          if (parseError) {
            console.error(`[DocumentUpload] Parse error for ${doc.id}:`, parseError);
            
            // Update document status to failed
            await supabase
              .from('brand_documents')
              .update({ 
                parsing_status: 'failed',
                error_message: parseError.message || 'Failed to invoke parse function'
              })
              .eq('id', doc.id);
            
            toast({
              title: "Parsing Failed",
              description: `Failed to parse "${doc.document_title}": ${parseError.message}`,
              variant: "destructive"
            });
            
            failCount++;
            continue;
          }

          // Wait for parsing to complete before triggering extraction
          await new Promise(resolve => setTimeout(resolve, 3000));

          console.log(`[DocumentUpload] Parse successful for ${doc.id}, starting insights extraction`);

          // Extract insights
          const { data: extractData, error: extractError } = await supabase.functions.invoke('extract-document-insights', {
            body: { documentId: doc.id }
          });

          if (extractError) {
            console.error(`[DocumentUpload] Extract error for ${doc.id}:`, extractError);
            toast({
              title: "Extraction Warning",
              description: `Document parsed but insight extraction may have failed for "${doc.document_title}". You can re-extract from the document view.`,
              variant: "default"
            });
          } else {
            console.log(`[DocumentUpload] Complete success for ${doc.id}`);
            successCount++;
          }
        } catch (error) {
          console.error(`[DocumentUpload] Unexpected error for ${doc.id}:`, error);
          
          // Update document status to failed
          await supabase
            .from('brand_documents')
            .update({ 
              parsing_status: 'failed',
              error_message: error.message || 'Unexpected error during processing'
            })
            .eq('id', doc.id);
          
          failCount++;
        }
      }

      // Show summary toast
      if (successCount > 0 && failCount === 0) {
        toast({
          title: "Processing Started",
          description: `${successCount} document${successCount > 1 ? 's are' : ' is'} being parsed successfully`,
        });
      } else if (failCount > 0) {
        toast({
          title: "Processing Completed with Issues",
          description: `${successCount} succeeded, ${failCount} failed. Check document library for details.`,
          variant: failCount === uploadedDocs.length ? "destructive" : "default"
        });
      }

      // Reset and close
      setFiles([]);
      setDocumentTitle("");
      setTags([]);
      onUploadComplete();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
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
          <DialogTitle>Upload Brand Documents</DialogTitle>
          <DialogDescription>
            Upload up to 5 PDF documents. They will be automatically parsed and analyzed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Document Title (Optional)</Label>
            <Input
              id="title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Leave blank to use filename"
            />
          </div>

          <div>
            <Label htmlFor="category">Document Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{cat.label}</span>
                      <span className="text-xs text-muted-foreground">{cat.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags..."
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="files">Select Files (PDF only, max 5)</Label>
            <div className="mt-2">
              <Input
                id="files"
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onUploadComplete()}
              disabled={uploading || extracting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading || extracting}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : extracting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {files.length} Document{files.length > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </>
  );
};