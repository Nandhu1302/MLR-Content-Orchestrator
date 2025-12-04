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
import { 
  BookOpen, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Eye,
  Copy
} from "lucide-react";

) => void;
}

const ReferenceValidationPanel = ({ 
  content, 
  onValidationUpdate 
}) => {
  const [references, setReferences] = useState([]);
  const [suggestedReferences, setSuggestedReferences] = useState([]);
  const [appliedReferenceIds, setAppliedReferenceIds] = useState>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newCitation, setNewCitation] = useState('');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedReferenceForDetails, setSelectedReferenceForDetails] = useState(null);
  const { selectedBrand } = useBrand();

  useEffect(() => {
    analyzeReferences();
  }, [content, selectedBrand?.id]);

  const analyzeReferences = async () => {
    if (!content.trim()) {
      setReferences([]);
      setSuggestedReferences([]);
      onValidationUpdate({ valid, missing });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Fetch real references from database
      const { data, error } = await supabase
        .from('clinical_references')
        .select('*')
        .eq('brand_id', selectedBrand?.id || '')
        .limit(50);

      if (refError) {
        console.error('Error fetching references:', refError);
      }

      // Transform database references to panel format
      const brandReferences = (dbReferences || []).map((ref) => ({
        id.id,
        citation.formatted_citation || ref.reference_text,
        pmid.pubmed_id,
        doi.doi,
        title.study_name,
        authors.authors,
        journal.journal,
        year.publication_year?.toString(),
        isComplete: !!(ref.pubmed_id || ref.doi),
        isVerified: !!ref.pubmed_id
      }));

      // Call edge function for AI-powered analysis
      const { data, error } = await supabase.functions.invoke('analyze-references', {
        body: {
          content,
          brandId?.id,
          therapeuticArea?.therapeutic_area || 'General Medicine',
          detectedClaims,
          brandReferences.map(r => ({
            id.id,
            citation.citation,
            pmid.pmid,
            title.title
          }))
        }
      });

      if (error) throw error;

      // Process detected citations from content
      const existingRefs = (data.existingCitations || []).map((cit, idx) => {
        // Try to match with database references
        const matchedRef = brandReferences.find(br => 
          br.citation?.includes(cit.citationMarker) || 
          cit.citationMarker?.includes(br.pmid || '')
        );
        
        return {
          id?.id || `ref_${idx}`,
          citation.citationMarker,
          pmid?.pmid,
          doi?.doi,
          title?.title,
          authors?.authors,
          journal?.journal,
          year?.year,
          isComplete.isComplete ?? !!matchedRef,
          isVerified.isVerified ?? !!matchedRef?.pmid
        };
      });

      // Find suggested references for uncited claims
      const suggested = (data.statements || [])
        .filter((stmt) => stmt.citationStatus === 'missing')
        .slice(0, 5)
        .map((stmt) => {
          const suggestedId = stmt.suggestedReferences?.[0];
          return brandReferences.find((ref) => ref.id === suggestedId);
        })
        .filter(Boolean) as Reference[];

      setReferences(existingRefs);
      setSuggestedReferences(suggested);

      onValidationUpdate({ 
        valid.filter(r => r.isVerified).length, 
        missing.summary?.missingCitations || 0 
      });
    } catch (error) {
      console.error('Error analyzing references:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddReference = (reference) => {
    const newRef = {
      ...reference,
      id: `ref_added_${Date.now()}`,
      isComplete,
      isVerified
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
    
    const manualRef = {
      id: `ref_manual_${Date.now()}`,
      citation,
      isComplete,
      isVerified
    };
    
    setReferences(prev => [...prev, manualRef]);
    setNewCitation('');
    setTimeout(analyzeReferences, 100);
  };

  const handleVerifyReference = async (refId) => {
    const ref = references.find(r => r.id === refId);
    if (!ref?.pmid) return;

    // In a real implementation, this would call PubMed API
    // For now, mark as verified
    setReferences(prev => prev.map(r => 
      r.id === refId ? { ...r, isVerified } 
    ));
    setTimeout(analyzeReferences, 100);
  };

  const getCitationCoverage = () => {
    if (references.length === 0) return 0;
    const verifiedCount = references.filter(r => r.isVerified).length;
    return Math.round((verifiedCount / references.length) * 100);
  };

  const handleApplyReference = async (refId, action: 'apply' | 'decline', reason?) => {
    if (action === 'apply') {
      const ref = references.find(r => r.id === refId) || suggestedReferences.find(r => r.id === refId);
      if (ref) {
        handleAddReference(ref);
      }
    }
    setDetailsModalOpen(false);
    setSelectedReferenceForDetails(null);
  };

  const handleShowDetails = (reference) => {
    setSelectedReferenceForDetails(reference);
    setDetailsModalOpen(true);
  };

  const verifiedCount = references.filter(r => r.isVerified).length;
  const incompleteCount = references.filter(r => !r.isComplete).length;
  const citationCoverage = getCitationCoverage();

  return (
    
      
        
          
            
            References & Citations
          
          {isAnalyzing && Analyzing...}
        
        Verify and manage content citations
        
        {references.length > 0 && (
          
            
              {verifiedCount} Verified
              {incompleteCount > 0 && {incompleteCount} Incomplete}
              {suggestedReferences.length > 0 && (
                {suggestedReferences.length} Suggested
              )}
            
            
              
                Citation Coverage
                {citationCoverage}%
              
              
            
          
        )}
      
      
      
        
          {references.length === 0 && suggestedReferences.length === 0 ? (
            
              
              No content to analyze yet
            
          ) : (
            <>
              {/* Existing References */}
              {references.length > 0 && (
                
                  
                    Detected Citations
                  
                  {references.map((ref) => (
                    
                      
                        
                          {ref.citation}
                          {ref.title && (
                            {ref.title}
                          )}
                        
                        
                          {ref.isVerified ? (
                            
                          ) : (
                            
                          )}
                           handleCopyToClipboard(ref.citation, 'Citation')}
                          >
                            
                          
                        
                      
                      
                      
                        {!ref.isComplete && (
                          Incomplete
                        )}
                        {ref.pmid && (
                          PMID: {ref.pmid}
                        )}
                        {!ref.isVerified && (
                           handleVerifyReference(ref.id)}
                          >
                            Verify
                          
                        )}
                         handleShowDetails(ref)}
                        >
                          
                          Details
                        
                      
                    
                  ))}
                
              )}

              {/* Suggested References */}
              {suggestedReferences.length > 0 && (
                
                  
                    
                    Suggested References
                  
                  {suggestedReferences.map((ref) => (
                    
                      
                        
                          {ref.title || ref.citation}
                          {ref.citation && ref.title && (
                            {ref.citation}
                          )}
                        
                      
                      
                       handleAddReference(ref)}
                        disabled={appliedReferenceIds.has(ref.id)}
                      >
                        {appliedReferenceIds.has(ref.id) ? (
                          <>
                            
                            Applied
                          
                        ) : (
                          <>
                            
                            Apply Reference
                          
                        )}
                      
                    
                  ))}
                
              )}

              {/* Manual Add Section */}
              
                
                  Add Manual Reference
                
                
                   setNewCitation(e.target.value)}
                    className="text-xs h-8"
                  />
                  
                    
                  
                
              
            
          )}
        
      
      
      {selectedReferenceForDetails && (
         {
            setDetailsModalOpen(false);
            setSelectedReferenceForDetails(null);
          }}
          onApply={handleApplyReference}
        />
      )}
    
  );
};


export default ReferenceValidationPanel;
