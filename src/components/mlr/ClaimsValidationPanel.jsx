import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  ThumbsUp,
  MessageSquare,
  Brain
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDupixentContentByMarket } from "@/data/regulatory/DupixentPreApprovedContent";
import { ClaimDetailsModal } from "./ClaimDetailsModal";
import { DetectedClaim as ServiceDetectedClaim } from "@/services/claimsValidationService";
import { getSeverityIcon, getSeverityColor } from "./utils/mlrHelpers";



) => void;
}

const ClaimsValidationPanel = ({ 
  content, 
  brandGuidelines,
  context,
  selectedBrand,
  onValidationUpdate 
}) => {
  const [claims, setClaims] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClaimForModal, setSelectedClaimForModal] = useState(null);
  const [validationContext, setValidationContext] = useState({
    brandId?.brand_name?.toLowerCase() || 'jardiance',
    therapeuticArea?.therapeuticArea || 'General Medicine',
    assetType: 'Email',
    targetAudience: 'HCP',
    region: 'US',
    brandGuidelines
  });

  useEffect(() => {
    analyzeContent();
  }, [content]);

  useEffect(() => {
    // Listen for content changes
    const handleContentChange = (event) => {
      analyzeContent();
    };

    document.addEventListener('contentChanged', handleContentChange as EventListener);
    return () => {
      document.removeEventListener('contentChanged', handleContentChange as EventListener);
    };
  }, []);

  const analyzeContent = async () => {
    if (!content.trim()) {
      setClaims([]);
      onValidationUpdate({ valid, warnings, failures });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Get pre-approved content for AI context
      const preApprovedContent = getDupixentContentByMarket('US');

      // Call AI-powered claims analysis edge function
      const { data, error } = await supabase.functions.invoke('analyze-claims', {
        body: {
          content,
          brandId.brandId,
          therapeuticArea.therapeuticArea,
          assetType.assetType,
          region.region,
          preApprovedContent
        }
      });

      if (error) {
        console.error('Claims analysis error:', error);
        throw error;
      }

      console.log('AI Claims Analysis Result:', data);

      // Transform AI results to DetectedClaim format
      const transformedClaims = (data.claims || []).map((claim, index) => ({
        id: `claim_${index}`,
        text.text,
        type.type,
        severity.severity as 'critical' | 'high' | 'medium' | 'low',
        confidence.confidence / 100,
        reason.reason,
        requiredEvidence.requiredEvidence],
        suggestion.suggestion,
        matchesPreApproved.matchesPreApproved,
        preApprovedMatch.preApprovedMatch,
        brandCompliance.matchesPreApproved ? 'compliant' : 'warning',
        context: '',
        start,
        end,
        isOverridden
      }));

      setClaims(transformedClaims);

      // Update validation summary
      const criticalCount = transformedClaims.filter(c => c.severity === 'critical').length;
      const highCount = transformedClaims.filter(c => c.severity === 'high').length;
      const mediumCount = transformedClaims.filter(c => c.severity === 'medium').length;

      onValidationUpdate({ 
        valid.filter(c => c.matchesPreApproved).length, 
        warnings,
        failures + highCount
      });

      // Emit highlights for the content editor
      const highlights = transformedClaims.map(claim => ({
        id.id,
        start.indexOf(claim.text),
        end.indexOf(claim.text) + claim.text.length,
        type.severity,
        message.reason
      })).filter(h => h.start >= 0);

      document.dispatchEvent(new CustomEvent('addHighlight', {
        detail: { highlights }
      }));

    } catch (error) {
      console.error('Error analyzing claims:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };


  const handleClaimClick = (claim) => {
    setSelectedClaim(claim.id);
    
    // Emit event to highlight claim in content editor
    document.dispatchEvent(new CustomEvent('selectHighlight', {
      detail: { id.id, start.start, end.end }
    }));
  };

  const handleOverrideClaim = (claimId, reason) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { ...claim, isOverridden, overrideReason }
        
    ));
    
    // Recalculate summary
    setTimeout(analyzeContent, 100);
  };

  // Map AI severity levels to modal's expected severity format
  const mapSeverityForModal = (severity: 'critical' | 'high' | 'medium' | 'low'): 'error' | 'warning' | 'info' => {
    switch (severity) {
      case 'critical' 'high' 'error';
      case 'medium' 'warning';
      case 'low' 'info';
      default 'warning';
    }
  };

  const handleOpenClaimDetails = (claim) => {
    // Convert AI claim to modal's expected format
    const modalClaim = {
      id.id,
      text.text,
      type.type,
      severity(claim.severity),
      reason.reason,
      suggestion.suggestion,
      start.start,
      end.end,
      context.context || '',
      requiredEvidence.requiredEvidence,
      isOverridden.isOverridden,
      overrideReason.overrideReason,
      confidence.confidence,
      brandCompliance.brandCompliance || 'compliant'
    };
    
    setSelectedClaimForModal(modalClaim);
    setIsModalOpen(true);
  };

  // Using shared utilities from mlrHelpers

  return (
    
      
        
          
            
            Claims Validation
          
          {isAnalyzing && (
            
              Analyzing...
            
          )}
        
        
        {claims.length > 0 && (
          
            
              {claims.length} Claims Found
            
            
              {claims.filter(c => !c.isOverridden && (c.severity === 'critical' || c.severity === 'high')).length} Critical
            
            
              {claims.filter(c => !c.isOverridden && (c.severity === 'medium' || c.severity === 'low')).length} Warnings
            
            
              
              Avg Confidence: {Math.round(claims.reduce((sum, c) => sum + c.confidence, 0) / claims.length * 100)}%
            
          
        )}
      

      
        
          {claims.length === 0 ? (
            
              
              No claims detected
              Your content appears compliant
            
          ) : (
            claims.map((claim) => (
               handleClaimClick(claim)}
              >
                
                  
                    
                      {getSeverityIcon(claim.severity)}
                      
                        {claim.type}
                      
                      
                        {Math.round(claim.confidence * 100)}% confidence
                      
                      {claim.brandCompliance !== 'compliant' && (
                        
                          Brand {claim.brandCompliance}
                        
                      )}
                    
                    {claim.isOverridden && (
                      
                        
                        Approved
                      
                    )}
                  
                
                
                
                  
                    
                      "{claim.text}"
                    
                    
                    
                      
                      
                        {claim.reason}
                      
                    
                    
                    
                      Suggested Improvement/p>
                      
                        {claim.suggestion}
                      
                      
                      {claim.requiredEvidence && claim.requiredEvidence.length > 0 && (
                        
                          Required Evidence/p>
                          
                            {claim.requiredEvidence.map((evidence, idx) => (
                              
                                {evidence}
                              
                            ))}
                          
                        
                      )}
                      
                      {claim.context && (
                        
                          Context/p>
                          
                            "...{claim.context}..."
                          
                        
                      )}
                    
                    
                    
                       {
                          e.stopPropagation();
                          handleOpenClaimDetails(claim);
                        }}
                      >
                        
                        View Details
                      
                      
                      {!claim.isOverridden && (
                         {
                            e.stopPropagation();
                            handleOpenClaimDetails(claim);
                          }}
                        >
                          
                          Review & Override
                        
                      )}
                    
                    
                    {claim.isOverridden && claim.overrideReason && (
                      
                        
                          Override Reason: {claim.overrideReason}
                        
                      
                    )}
                  
                
              
            ))
          )}
        
      

       {
          setIsModalOpen(false);
          setSelectedClaimForModal(null);
        }}
        onOverride={handleOverrideClaim}
      />
    
  );
};

export default ClaimsValidationPanel;
