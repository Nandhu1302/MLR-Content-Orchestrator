import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBrand } from "@/contexts/BrandContext";
import { PIUploadModal } from "./PIUploadModal";
import { ManualParseButton } from "@/components/documents/ManualParseButton";
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";

export const PILibrary = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [refreshingIds, setRefreshingIds] = useState(new Set());
  const { selectedBrand } = useBrand();
  const { toast } = useToast();

  const loadDocuments = async () => {
    if (!selectedBrand) return;

    try {
      const { data, error } = await supabase
        .from("brand_documents")
        .select("*")
        .eq("brand_id", selectedBrand.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error loading PI documents:", error);
      toast({
        title: "Error",
        description: "Failed to load PI documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [selectedBrand]);

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from("brand_documents")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "PI document deleted successfully",
      });

      loadDocuments();
    } catch (error) {
      console.error("Error deleting PI:", error);
      toast({
        title: "Error",
        description: "Failed to delete PI document",
        variant: "destructive",
      });
    }
  };

  const handleRetryParse = async (id) => {
    setRefreshingIds(prev => new Set(prev).add(id));

    try {
      const { error } = await supabase.functions.invoke(
        "parse-prescribing-information",
        { body: { piId: id } }
      );

      if (error) throw error;

      toast({
        title: "Parsing Started",
        description: "Re-parsing PI document. This may take a moment.",
      });

      // Refresh after a delay
      setTimeout(() => {
        loadDocuments();
        setRefreshingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 3000);
    } catch (error) {
      console.error("Error retrying parse:", error);
      toast({
        title: "Error",
        description: "Failed to retry parsing",
        variant: "destructive",
      });
      setRefreshingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prescribing Information Library</h2>
          <p className="text-muted-foreground">
            Upload and manage PI documents for automated data extraction
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload PI
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No PI Documents</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first Prescribing Information document to get started
          </p>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload PI Document
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{doc.drug_name}</h3>
                      {getStatusBadge(doc.parsing_status)}
                    </div>
                    {doc.version && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Version: {doc.version}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {format(new Date(doc.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    {doc.error_message && (
                      <p className="text-sm text-destructive mt-2">
                        Error: {doc.error_message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.document_url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  {(doc.parsing_status === 'failed' || doc.parsing_status === 'pending') && (
                    <>
                      <ManualParseButton 
                        documentId={doc.id}
                        onParseComplete={loadDocuments}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetryParse(doc.id)}
                        disabled={refreshingIds.has(doc.id)}
                      >
                        {refreshingIds.has(doc.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <PIUploadModal
            onUploadComplete={async () => {
              setUploadModalOpen(false);
              await loadDocuments();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};