import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  CheckCircle,
  X,
  Copy,
  ThumbsUp,
  Brain,
  FileText,
  Shield,
  BookOpen,
  Target,
} from "lucide-react";
import { DetectedClaim } from "@/services/claimsValidationService";
import { useToast } from "@/hooks/use-toast";



const ClaimDetailsModal = ({
  claim,
  isOpen,
  onClose,
  onOverride,
}) => {
  const [overrideReason, setOverrideReason] = useState("");
  const [isOverriding, setIsOverriding] = useState(false);
  const { toast } = useToast();

  if (!claim) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(claim.text);
    toast({
      title: "Copied to clipboard",
      description: "Claim text has been copied to your clipboard.",
    });
  };

  const handleOverride = () => {
    if (!overrideReason.trim()) {
      toast({
        title: "Override reason required",
        description: "Please provide a reason for overriding this claim.",
        variant: "destructive",
      });
      return;
    }

    onOverride(claim.id, overrideReason);
    setOverrideReason("");
    setIsOverriding(false);
    onClose();
    
    toast({
      title: "Claim overridden",
      description: "The claim has been marked as approved.",
    });
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error' ;
      case 'warning' ;
      default ;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error' 'destructive';
      case 'warning' 'secondary';
      default 'default';
    }
  };

  const getBrandComplianceColor = (compliance) => {
    switch (compliance) {
      case 'violation' 'destructive';
      case 'warning' 'secondary';
      default 'default';
    }
  };

  return (
    
      
        
          
            
            Claim Analysis Details
          
          
            Comprehensive analysis and recommendations for the detected claim
          
        

        
          
            {/* Claim Overview */}
            
              
                Detected Claim
                
                  {getSeverityIcon(claim.severity)}
                  
                    {claim.type}
                  
                  
                    
                    {Math.round(claim.confidence * 100)}% confidence
                  
                
              
              
              
                "{claim.text}"
                
                  
                  Copy Text
                
              
            

            

            {/* Analysis Details */}
            
              
                
                Analysis
              
              
              
                
                
                  Issue Identified/strong> {claim.reason}
                
              

              {claim.context && (
                
                  
                    
                    Context
                  
                  
                    "...{claim.context}..."
                  
                
              )}
            

            

            {/* Brand Compliance */}
            {claim.brandCompliance && claim.brandCompliance !== 'compliant' && (
              <>
                
                  
                    
                    Brand Compliance
                  
                  
                  
                    
                    
                      
                        
                          {claim.brandCompliance.toUpperCase()}
                        
                        
                          This claim may not align with brand guidelines and requires review.
                        
                      
                    
                  
                
                
              
            )}

            {/* Recommendations */}
            
              
                
                Recommendations
              
              
              
                
                  Suggested Improvement/Label>
                
                  {claim.suggestion}
                
              

              {claim.requiredEvidence && claim.requiredEvidence.length > 0 && (
                
                  Required Evidence/Label>
                  
                    {claim.requiredEvidence.map((evidence, idx) => (
                      
                        {evidence}
                      
                    ))}
                  
                
              )}
            

            

            {/* Actions */}
            
              Actions
              
              {claim.isOverridden ? (
                
                  
                  
                    This claim has been overridden.
                    {claim.overrideReason && (
                      
                        Reason: {claim.overrideReason}
                      
                    )}
                  
                
              ) : (
                
                  {!isOverriding ? (
                     setIsOverriding(true)}
                      variant="outline"
                      className="w-full"
                    >
                      
                      Override This Claim
                    
                  ) : (
                    
                      
                        Override Reason (Required)
                      
                       setOverrideReason(e.target.value)}
                        rows={3}
                      />
                      
                        
                          
                          Confirm Override
                        
                         {
                            setIsOverriding(false);
                            setOverrideReason("");
                          }}
                          className="flex-1"
                        >
                          Cancel
                        
                      
                    
                  )}
                
              )}
            
          
        
      
    
  );
};

export default ClaimDetailsModal;
