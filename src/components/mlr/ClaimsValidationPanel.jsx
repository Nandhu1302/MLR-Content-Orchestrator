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
// Removed type import: import { DetectedClaim as ServiceDetectedClaim } from "@/services/claimsValidationService";
import { getSeverityIcon, getSeverityColor } from "./utils/mlrHelpers";
// Removed type import: import type { DetectedClaim, MLRSeverity } from "./types/mlrTypes";

// Removed interface ValidationContext
// Removed interface ClaimsValidationPanelProps

export const ClaimsValidationPanel = ({ 
  content, 
  brandGuidelines,
  context,
  selectedBrand,
  onValidationUpdate 
}) => { // Removed : ClaimsValidationPanelProps
  // Removed <DetectedClaim[]> type annotation
  const [claims, setClaims] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // Removed <string | null> type annotation
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Removed <ServiceDetectedClaim | null> type annotation
  const [selectedClaimForModal, setSelectedClaimForModal] = useState(null);
  // Removed type annotation
  const [validationContext, setValidationContext] = useState({
    brandId: selectedBrand?.brand_name?.toLowerCase() || 'jardiance',
    therapeuticArea: context?.therapeuticArea || 'General Medicine',
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
    // Removed (event: CustomEvent) type annotation
    const handleContentChange = (event) => {
      analyzeContent();
    };

    // Removed as EventListener type assertion
    document.addEventListener('contentChanged', handleContentChange);
    return () => {
      document.removeEventListener('contentChanged', handleContentChange);
    };
  }, []);

  const analyzeContent = async () => {
    if (!content.trim()) {
      setClaims([]);
      onValidationUpdate({ valid: 0, warnings: 0, failures: 0 });
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
          brandId: validationContext.brandId,
          therapeuticArea: validationContext.therapeuticArea,
          assetType: validationContext.assetType,
          region: validationContext.region,
          preApprovedContent
        }
      });

      if (error) {
        console.error('Claims analysis error:', error);
        throw error;
      }

      console.log('AI Claims Analysis Result:', data);

      // Transform AI results to DetectedClaim format
      // Removed : DetectedClaim[] and : any type annotations
      const transformedClaims = (data.claims || []).map((claim, index) => ({
        id: `claim_${index}`,
        text: claim.text,
        type: claim.type,
        // Removed as 'critical' | 'high' | 'medium' | 'low' type assertion
        severity: claim.severity,
        confidence: claim.confidence / 100,
        reason: claim.reason,
        requiredEvidence: [claim.requiredEvidence],
        suggestion: claim.suggestion,
        matchesPreApproved: claim.matchesPreApproved,
        preApprovedMatch: claim.preApprovedMatch,
        brandCompliance: claim.matchesPreApproved ? 'compliant' : 'warning',
        context: '',
        start: 0,
        end: 0,
        isOverridden: false
      }));

      setClaims(transformedClaims);

      // Update validation summary
      const criticalCount = transformedClaims.filter(c => c.severity === 'critical').length;
      const highCount = transformedClaims.filter(c => c.severity === 'high').length;
      const mediumCount = transformedClaims.filter(c => c.severity === 'medium').length;

      onValidationUpdate({ 
        valid: transformedClaims.filter(c => c.matchesPreApproved).length, 
        warnings: mediumCount,
        failures: criticalCount + highCount
      });

      // Emit highlights for the content editor
      const highlights = transformedClaims.map(claim => ({
        id: claim.id,
        start: content.indexOf(claim.text),
        end: content.indexOf(claim.text) + claim.text.length,
        type: claim.severity,
        message: claim.reason
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


  // Removed : DetectedClaim type annotation
  const handleClaimClick = (claim) => {
    setSelectedClaim(claim.id);
    
    // Emit event to highlight claim in content editor
    document.dispatchEvent(new CustomEvent('selectHighlight', {
      detail: { id: claim.id, start: claim.start, end: claim.end }
    }));
  };

  // Removed : string type annotation
  const handleOverrideClaim = (claimId, reason) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { ...claim, isOverridden: true, overrideReason: reason }
        : claim
    ));
    
    // Recalculate summary
    setTimeout(analyzeContent, 100);
  };

  // Map AI severity levels to modal's expected severity format
  // Removed type annotations
  const mapSeverityForModal = (severity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'warning';
    }
  };

  // Removed : DetectedClaim type annotation
  const handleOpenClaimDetails = (claim) => {
    // Convert AI claim to modal's expected format
    // Removed : ServiceDetectedClaim type annotation
    const modalClaim = {
      id: claim.id,
      text: claim.text,
      type: claim.type,
      // Removed type assertion
      severity: mapSeverityForModal(claim.severity),
      reason: claim.reason,
      suggestion: claim.suggestion,
      start: claim.start,
      end: claim.end,
      context: claim.context || '',
      requiredEvidence: claim.requiredEvidence,
      isOverridden: claim.isOverridden,
      overrideReason: claim.overrideReason,
      confidence: claim.confidence,
      brandCompliance: claim.brandCompliance || 'compliant'
    };
    
    setSelectedClaimForModal(modalClaim);
    setIsModalOpen(true);
  };

  // Using shared utilities from mlrHelpers

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Claims Validation
          </h3>
          {isAnalyzing && (
            <Badge variant="outline" className="text-xs">
              Analyzing...
            </Badge>
          )}
        </div>
        
        {claims.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {claims.length} Claims Found
            </Badge>
            <Badge variant="destructive" className="text-xs">
              {claims.filter(c => !c.isOverridden && (c.severity === 'critical' || c.severity === 'high')).length} Critical
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {claims.filter(c => !c.isOverridden && (c.severity === 'medium' || c.severity === 'low')).length} Warnings
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              Avg Confidence: {Math.round(claims.reduce((sum, c) => sum + c.confidence, 0) / claims.length * 100)}%
            </Badge>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {claims.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No claims detected</p>
              <p className="text-xs text-muted-foreground">Your content appears compliant</p>
            </div>
          ) : (
            claims.map((claim) => (
              <Card 
                key={claim.id}
                className={`cursor-pointer transition-all ${
                  selectedClaim === claim.id ? 'ring-2 ring-primary' : ''
                } ${claim.isOverridden ? 'opacity-60' : ''}`}
                onClick={() => handleClaimClick(claim)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(claim.severity)}
                      <Badge variant={getSeverityColor(claim.severity)} className="text-xs">
                        {claim.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(claim.confidence * 100)}% confidence
                      </Badge>
                      {claim.brandCompliance !== 'compliant' && (
                        <Badge variant={claim.brandCompliance === 'violation' ? 'destructive' : 'secondary'} className="text-xs">
                          Brand {claim.brandCompliance}
                        </Badge>
                      )}
                    </div>
                    {claim.isOverridden && (
                      <Badge variant="outline" className="text-xs">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-sm font-medium bg-muted p-2 rounded text-center">
                      "{claim.text}"
                    </p>
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {claim.reason}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Suggested Improvement:</p>
                      <p className="text-xs bg-green-50 dark:bg-green-950 p-2 rounded border border-green-200 dark:border-green-800">
                        {claim.suggestion}
                      </p>
                      
                      {claim.requiredEvidence && claim.requiredEvidence.length > 0 && (
                        <div className="text-xs">
                          <p className="font-medium text-muted-foreground mb-1">Required Evidence:</p>
                          <div className="flex flex-wrap gap-1">
                            {claim.requiredEvidence.map((evidence, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {evidence}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {claim.context && (
                        <div className="text-xs">
                          <p className="font-medium text-muted-foreground mb-1">Context:</p>
                          <p className="text-xs bg-muted p-2 rounded italic">
                            "...{claim.context}..."
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenClaimDetails(claim);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      
                      {!claim.isOverridden && (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenClaimDetails(claim);
                          }}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Review & Override
                        </Button>
                      )}
                    </div>
                    
                    {claim.isOverridden && claim.overrideReason && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Override Reason: {claim.overrideReason}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <ClaimDetailsModal
        claim={selectedClaimForModal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClaimForModal(null);
        }}
        onOverride={handleOverrideClaim}
      />
    </div>
  );
};