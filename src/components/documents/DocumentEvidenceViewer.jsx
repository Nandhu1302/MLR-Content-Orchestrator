import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, RefreshCw, Library, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export const DocumentEvidenceViewer = ({ document }) => {
  const [evidenceCounts, setEvidenceCounts] = useState({
    claims: 0,
    references: 0,
    segments: 0,
    safetyStatements: 0,
    modules: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvidenceCounts = async () => {
      setIsLoading(true);
      
      try {
        // Fetch counts of evidence related to this document
        const [claimsRes, referencesRes, segmentsRes, safetyRes, modulesRes] = await Promise.all([
          supabase.from('clinical_claims').select('id', { count: 'exact', head: true }).eq('source_document_id', document.id),
          supabase.from('clinical_references').select('id', { count: 'exact', head: true }).eq('source_document_id', document.id),
          supabase.from('content_segments').select('id', { count: 'exact', head: true }).eq('source_document_id', document.id),
          supabase.from('safety_statements').select('id', { count: 'exact', head: true }).eq('source_document_id', document.id),
          supabase.from('content_modules').select('id', { count: 'exact', head: true }).eq('pi_document_id', document.id)
        ]);

        setEvidenceCounts({
          claims: claimsRes.count || 0,
          references: referencesRes.count || 0,
          segments: segmentsRes.count || 0,
          safetyStatements: safetyRes.count || 0,
          modules: modulesRes.count || 0
        });
      } catch (error) {
        console.error('Error fetching evidence counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvidenceCounts();
  }, [document.id]);

  const handleReExtractEvidence = async () => {
    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-document-insights', {
        body: { documentId: document.id }
      });

      if (error) throw error;

      toast({
        title: "Evidence Extraction Started",
        description: "Evidence is being extracted from this document. This may take a few moments.",
      });

      // Refresh counts after a delay
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Error re-extracting evidence:', error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract evidence. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const totalEvidence = Object.values(evidenceCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">{document.document_title}</h2>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{document.file_size_bytes && `${(document.file_size_bytes / 1024 / 1024).toFixed(2)} MB`}</span>
          {document.page_count && <span>{document.page_count} pages</span>}
          <span>Uploaded {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}</span>
        </div>
        {document.document_tags && document.document_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {document.document_tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        )}
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">
            <FileText className="h-4 w-4 mr-2" />
            Info
          </TabsTrigger>
          <TabsTrigger value="evidence">
            <Library className="h-4 w-4 mr-2" />
            Evidence Summary
            {totalEvidence > 0 && <Badge variant="secondary" className="ml-2">{totalEvidence}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="raw">
            Parsed Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Document Type</p>
                  <p className="text-sm">{document.document_type || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="text-sm">{document.document_category || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Drug Name</p>
                  <p className="text-sm">{document.drug_name || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Version</p>
                  <p className="text-sm">{document.version || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parsing Status</p>
                  <p className="text-sm capitalize">{document.parsing_status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Page Count</p>
                  <p className="text-sm">{document.page_count || 'N/A'}</p>
                </div>
              </div>
              
              {document.error_message && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{document.error_message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Library className="h-5 w-5" />
                  Extracted Evidence Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Evidence Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{evidenceCounts.claims}</div>
                    <div className="text-sm text-muted-foreground">Claims</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{evidenceCounts.references}</div>
                    <div className="text-sm text-muted-foreground">References</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{evidenceCounts.segments}</div>
                    <div className="text-sm text-muted-foreground">Segments</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{evidenceCounts.safetyStatements}</div>
                    <div className="text-sm text-muted-foreground">Safety</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{evidenceCounts.modules}</div>
                    <div className="text-sm text-muted-foreground">Modules</div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col gap-4">
                  {totalEvidence === 0 && document.parsing_status === 'completed' && (
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                        This document has been parsed but evidence has not been extracted yet.
                      </p>
                      <Button 
                        onClick={handleReExtractEvidence}
                        disabled={isExtracting}
                        size="sm"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isExtracting ? 'animate-spin' : ''}`} />
                        {isExtracting ? 'Extracting...' : 'Extract Evidence Now'}
                      </Button>
                    </div>
                  )}

                  {totalEvidence > 0 && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <div>
                        <p className="font-medium">View All Evidence</p>
                        <p className="text-sm text-muted-foreground">
                          Browse all extracted evidence in the Evidence Library
                        </p>
                      </div>
                      <Button 
                        onClick={() => navigate('/evidence-library')}
                        variant="default"
                      >
                        Open Evidence Library
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  {document.parsing_status !== 'completed' && (
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Document is still being parsed. Evidence extraction will start automatically once parsing is complete.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="raw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parsed Document Data</CardTitle>
              <p className="text-sm text-muted-foreground">
                Raw structured data extracted from the document during parsing
              </p>
            </CardHeader>
            <CardContent>
              {document.parsed_data ? (
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-[600px]">
                  {JSON.stringify(document.parsed_data, null, 2)}
                </pre>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No parsed data available yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};