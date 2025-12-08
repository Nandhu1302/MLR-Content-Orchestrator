import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ReferenceDetailsModal } from "./ReferenceDetailsModal";
import { useBrand } from "@/contexts/BrandContext";
import { supabase } from "@/integrations/supabase/client";
import { handleCopyToClipboard, emitSmartInsert } from "./utils/mlrHelpers";
// Removed type import: import type { Reference } from "./types/mlrTypes";
import { 
  BookOpen, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Eye,
  Copy
} from "lucide-react";

// Removed interface ReferenceValidationPanelProps

export const ReferenceValidationPanel = ({ 
  content, 
  onValidationUpdate 
}) => { // Removed : ReferenceValidationPanelProps
  // Removed <Reference[]> type annotation
  const [references, setReferences] = useState([]);
  // Removed <Reference[]> type annotation
  const [suggestedReferences, setSuggestedReferences] = useState([]);
  // Removed <Set<string>> type annotation
  const [appliedReferenceIds, setAppliedReferenceIds] = useState(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newCitation, setNewCitation] = useState('');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  // Removed <Reference | null> type annotation
  const [selectedReferenceForDetails, setSelectedReferenceForDetails] = useState(null);
  const { selectedBrand } = useBrand();

  useEffect(() => {
    analyzeReferences();
  }, [content, selectedBrand?.id]);

  const analyzeReferences = async () => {
    if (!content.trim()) {
      setReferences([]);
      setSuggestedReferences([]);
      onValidationUpdate({ valid: 0, missing: 0 });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Fetch real references from database
      const { data: dbReferences, error: refError } = await supabase
        .from('clinical_references')
        .select('*')
        .eq('brand_id', selectedBrand?.id || '')
        .limit(50);

      if (refError) {
        console.error('Error fetching references:', refError);
      }

      // Transform database references to panel format
      // Removed : Reference[] and : any type annotations
      const brandReferences = (dbReferences || []).map((ref) => ({
        id: ref.id,
        citation: ref.formatted_citation || ref.reference_text,
        pmid: ref.pubmed_id,
        doi: ref.doi,
        title: ref.study_name,
        authors: ref.authors,
        journal: ref.journal,
        year: ref.publication_year?.toString(),
        isComplete: !!(ref.pubmed_id || ref.doi),
        isVerified: !!ref.pubmed_id
      }));

      // Call edge function for AI-powered analysis
      const { data, error } = await supabase.functions.invoke('analyze-references', {
        body: {
          content,
          brandId: selectedBrand?.id,
          therapeuticArea: selectedBrand?.therapeutic_area || 'General Medicine',
          detectedClaims: [],
          // Removed : any type annotation
          brandReferences: brandReferences.map(r => ({
            id: r.id,
            citation: r.citation,
            pmid: r.pmid,
            title: r.title
          }))
        }
      });

      if (error) throw error;

      // Process detected citations from content
      // Removed : Reference[] and : any type annotations
      const existingRefs = (data.existingCitations || []).map((cit, idx) => {
        // Try to match with database references
        const matchedRef = brandReferences.find(br => 
          br.citation?.includes(cit.citationMarker) || 
          cit.citationMarker?.includes(br.pmid || '')
        );
        
        return {
          id: matchedRef?.id || `ref_${idx}`,
          citation: cit.citationMarker,
          pmid: matchedRef?.pmid,
          doi: matchedRef?.doi,
          title: matchedRef?.title,
          authors: matchedRef?.authors,
          journal: matchedRef?.journal,
          year: matchedRef?.year,
          isComplete: cit.isComplete ?? !!matchedRef,
          isVerified: cit.isVerified ?? !!matchedRef?.pmid
        };
      });

      // Find suggested references for uncited claims
      // Removed : any type annotation
      const suggested = (data.statements || [])
        .filter((stmt) => stmt.citationStatus === 'missing')
        .slice(0, 5)
        // Removed : any type annotation
        .map((stmt) => {
          const suggestedId = stmt.suggestedReferences?.[0];
          return brandReferences.find((ref) => ref.id === suggestedId);
        })
        .filter(Boolean); // Removed as Reference[] type assertion

      setReferences(existingRefs);
      setSuggestedReferences(suggested);

      onValidationUpdate({ 
        valid: existingRefs.filter(r => r.isVerified).length, 
        missing: data.summary?.missingCitations || 0 
      });
    } catch (error) {
      console.error('Error analyzing references:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Removed : Reference type annotation
  const handleAddReference = (reference) => {
    // Removed : Reference type annotation
    const newRef = {
      ...reference,
      id: `ref_added_${Date.now()}`,
      isComplete: true,
      isVerified: true
    };
    
    setReferences(prev => [...prev, newRef]);
    setAppliedReferenceIds(prev => new Set([...prev, reference.id]));
    
    // Insert citation into content
    const citationText = reference.pmid 
      ? `[${reference.pmid}]` 
      : `[${reference.citation?.slice(0, 30)}...]`;
    emitSmartInsert('reference', citationText);
    
    setTimeout(analyzeReferences, 100);
  };

  const handleManualAdd = () => {
    if (!newCitation.trim()) return;
    
    // Removed : Reference type annotation
    const manualRef = {
      id: `ref_manual_${Date.now()}`,
      citation: newCitation,
      isComplete: true,
      isVerified: false
    };
    
    setReferences(prev => [...prev, manualRef]);
    setNewCitation('');
    setTimeout(analyzeReferences, 100);
  };

  // Removed : string type annotation
  const handleVerifyReference = async (refId) => {
    const ref = references.find(r => r.id === refId);
    if (!ref?.pmid) return;

    // In a real implementation, this would call PubMed API
    // For now, mark as verified
    setReferences(prev => prev.map(r => 
      r.id === refId ? { ...r, isVerified: true } : r
    ));
    setTimeout(analyzeReferences, 100);
  };

  const getCitationCoverage = () => {
    if (references.length === 0) return 0;
    const verifiedCount = references.filter(r => r.isVerified).length;
    return Math.round((verifiedCount / references.length) * 100);
  };

  // Removed type annotations
  const handleApplyReference = async (refId, action, reason) => {
    if (action === 'apply') {
      const ref = references.find(r => r.id === refId) || suggestedReferences.find(r => r.id === refId);
      if (ref) {
        handleAddReference(ref);
      }
    }
    setDetailsModalOpen(false);
    setSelectedReferenceForDetails(null);
  };

  // Removed : Reference type annotation
  const handleShowDetails = (reference) => {
    setSelectedReferenceForDetails(reference);
    setDetailsModalOpen(true);
  };

  const verifiedCount = references.filter(r => r.isVerified).length;
  const incompleteCount = references.filter(r => !r.isComplete).length;
  const citationCoverage = getCitationCoverage();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            References & Citations
          </h3>
          {isAnalyzing && <Badge variant="outline" className="text-xs">Analyzing...</Badge>}
        </div>
        <p className="text-xs text-muted-foreground mb-2">Verify and manage content citations</p>
        
        {references.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="default" className="text-xs">{verifiedCount} Verified</Badge>
              {incompleteCount > 0 && <Badge variant="destructive" className="text-xs">{incompleteCount} Incomplete</Badge>}
              {suggestedReferences.length > 0 && (
                <Badge variant="secondary" className="text-xs">{suggestedReferences.length} Suggested</Badge>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Citation Coverage</span>
                <span className="font-medium">{citationCoverage}%</span>
              </div>
              <Progress value={citationCoverage} className="h-1.5" />
            </div>
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {references.length === 0 && suggestedReferences.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No content to analyze yet</p>
            </div>
          ) : (
            <>
              {/* Existing References */}
              {references.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Detected Citations
                  </h4>
                  {references.map((ref) => (
                    <Card key={ref.id} className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-mono">{ref.citation}</p>
                          {ref.title && (
                            <p className="text-xs text-muted-foreground mt-1">{ref.title}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {ref.isVerified ? (
                            <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleCopyToClipboard(ref.citation, 'Citation')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!ref.isComplete && (
                          <Badge variant="destructive" className="text-xs">Incomplete</Badge>
                        )}
                        {ref.pmid && (
                          <Badge variant="outline" className="text-xs">PMID: {ref.pmid}</Badge>
                        )}
                        {!ref.isVerified && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 text-xs"
                            onClick={() => handleVerifyReference(ref.id)}
                          >
                            Verify
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 text-xs"
                          onClick={() => handleShowDetails(ref)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Suggested References */}
              {suggestedReferences.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Search className="h-3 w-3" />
                    Suggested References
                  </h4>
                  {suggestedReferences.map((ref) => (
                    <Card key={ref.id} className="border-dashed p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{ref.title || ref.citation}</p>
                          {ref.citation && ref.title && (
                            <p className="text-xs text-muted-foreground mt-1 font-mono">{ref.citation}</p>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs w-full"
                        onClick={() => handleAddReference(ref)}
                        disabled={appliedReferenceIds.has(ref.id)}
                      >
                        {appliedReferenceIds.has(ref.id) ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Apply Reference
                          </>
                        )}
                      </Button>
                    </Card>
                  ))}
                </div>
              )}

              {/* Manual Add Section */}
              <div className="space-y-2 pt-2 border-t">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Add Manual Reference
                </h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter citation..."
                    value={newCitation}
                    onChange={(e) => setNewCitation(e.target.value)}
                    className="text-xs h-8"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleManualAdd}
                    disabled={!newCitation.trim()}
                    className="h-8 shrink-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
      
      {selectedReferenceForDetails && (
        <ReferenceDetailsModal
          reference={selectedReferenceForDetails}
          isOpen={detailsModalOpen}
          currentContent={content}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedReferenceForDetails(null);
          }}
          onApply={handleApplyReference}
        />
      )}
    </div>
  );
};