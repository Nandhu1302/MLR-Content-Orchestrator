import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  CheckCircle, 
  X, 
  AlertTriangle,
  Copy,
  MessageSquare,
  FileText,
  Eye
} from "lucide-react";
import { SmartContentInsertion } from "@/utils/smartContentInsertion";





const RegulatoryDetailsModal = ({ 
  check, 
  isOpen, 
  onClose, 
  onApply,
  currentContent 
}) => {
  const [declineReason, setDeclineReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!check) return null;

  const handleCopyText = () => {
    if (check.suggestion) {
      navigator.clipboard.writeText(check.suggestion);
    }
  };

  const handleApply = async () => {
    setIsProcessing(true);
    try {
      onApply(check.id, 'apply');
      onClose();
    } catch (error) {
      console.error('Error applying compliance text, error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (check.required && !declineReason.trim()) {
      return; // Validation handled by UI
    }
    
    setIsProcessing(true);
    try {
      onApply(check.id, 'decline', declineReason);
      onClose();
    } catch (error) {
      console.error('Error declining compliance check, error);
    } finally {
      setIsProcessing(false);
      setDeclineReason('');
    }
  };

  const getInsertionPreview = () => {
    if (!check.suggestion) return null;
    
    const insertionType = check.category === 'indication' ? 'indication' .category === 'safety' ? 'safety' .category === 'fair_balance' ? 'fair_balance' .category === 'prescribing_info' || check.category === 'disclaimer' ? 'disclaimer' ;
                         
    return SmartContentInsertion.getInsertionPreview(
      currentContent, 
      insertionType, 
      check.suggestion
    );
  };

  const preview = getInsertionPreview();

  const getSeverityIcon = (status) => {
    switch (status) {
      case 'passed' ;
      case 'warning' ;
      case 'failed' ;
      default ;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed' 'default';
      case 'warning' 'secondary';
      case 'failed' 'destructive';
      default 'outline';
    }
  };

  return (
    
      
        
          
            {getSeverityIcon(check.status)}
            Regulatory Compliance Details
          
        

        
          
            {/* Compliance Check Overview */}
            
              
                {check.title}
                
                  
                    {check.status}
                  
                  {check.required && (
                    
                      Required
                    
                  )}
                
              
              
              {check.description}
              
              {check.regulatoryBasis && (
                
                  
                  
                    Regulatory Basis/strong> {check.regulatoryBasis}
                  
                
              )}
            

            {/* Suggested Compliance Text */}
            {check.suggestion && (
              
                
                  Suggested Compliance Text
                  
                    
                    Copy Text
                  
                
                
                
                  {check.suggestion}
                
              
            )}

            {/* Insertion Preview */}
            {preview && (
              
                
                  Smart Insertion Preview
                   setShowPreview(!showPreview)}
                  >
                    
                    {showPreview ? 'Hide' } Preview
                  
                
                
                {showPreview && (
                  
                    
                      
                      
                        Insertion Logic/strong> {preview.insertionPoint.reason}
                        
                        Confidence/strong> {Math.round(preview.insertionPoint.confidence * 100)}%
                      
                    
                    
                    
                      
                        ...{preview.beforeText.slice(-50)}
                      
                      
                        [INSERTED TEXT] {preview.insertionText}
                      
                      
                        {preview.afterText.slice(0, 50)}...
                      
                    
                  
                )}
              
            )}

            {/* Action Section */}
            
              Actions
              
              
                {check.status !== 'passed' && (
                  
                    
                    {isProcessing ? 'Applying...'  Smart Insertion'}
                  
                )}
                
                 check.required ? setShowPreview(true) ()}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  
                  {check.required ? 'Decline with Reason' }
                
              

              {/* Decline Reason for Required Items */}
              {check.required && (
                
                  
                    Rationale for declining required compliance item/label>
                   setDeclineReason(e.target.value)}
                    placeholder="Provide justification for declining this required regulatory compliance item..."
                    className="min-h-[80px]"
                  />
                  
                    
                      
                      Submit Decline Reason
                    
                  
                
              )}
            
          
        
      
    
  );
};

export default RegulatoryDetailsModal;
