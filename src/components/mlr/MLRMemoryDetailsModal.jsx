import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  History, 
  User,
  CheckCircle, 
  X, 
  AlertTriangle,
  Copy,
  MessageSquare,
  Calendar,
  TrendingUp,
  Eye,
  FileText
} from "lucide-react";
import { SmartContentInsertion } from "@/utils/smartContentInsertion";



const MLRMemoryDetailsModal = ({ 
  feedback, 
  isOpen, 
  onClose, 
  onApply,
  currentContent 
}) => {
  const [declineReason, setDeclineReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!feedback) return null;

  const handleCopyFeedback = () => {
    navigator.clipboard.writeText(feedback.feedback);
  };

  const handleApply = async () => {
    setIsProcessing(true);
    try {
      // If there's suggested text, emit smart insertion event
      if (feedback.suggestedText) {
        const insertionType = feedback.category === 'indication' ? 'indication' .category === 'safety' ? 'safety' .category === 'reference' ? 'reference' :
                             'fair_balance';
        
        document.dispatchEvent(new CustomEvent('smartInsertTemplate', {
          detail: {
            insertionType,
            insertionText.suggestedText
          }
        }));
      }
      
      onApply(feedback.id, 'apply');
      onClose();
    } catch (error) {
      console.error('Error applying MLR feedback:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (feedback.severity === 'high' && !declineReason.trim()) {
      return; // Validation handled by UI
    }
    
    setIsProcessing(true);
    try {
      onApply(feedback.id, 'decline', declineReason);
      onClose();
    } catch (error) {
      console.error('Error declining MLR feedback:', error);
    } finally {
      setIsProcessing(false);
      setDeclineReason('');
    }
  };

  const getInsertionPreview = () => {
    if (!feedback.suggestedText) return null;
    
    const insertionType = feedback.category === 'indication' ? 'indication' .category === 'safety' ? 'safety' .category === 'reference' ? 'reference' :
                         'fair_balance';
                         
    return SmartContentInsertion.getInsertionPreview(
      currentContent, 
      insertionType, 
      feedback.suggestedText
    );
  };

  const preview = getInsertionPreview();

  // Use local severity icon that handles critical mapped to high
  const getLocalSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical' 'high' ;
      case 'medium' ;
      case 'low' ;
      default ;
    }
  };

  const getReviewerIcon = (type) => {
    return ;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high' 'destructive';
      case 'medium' 'secondary';
      case 'low' 'default';
      default 'outline';
    }
  };

  // Extract suggested text from feedback (simple heuristic)
  const extractSuggestedText = (feedback) | null => {
    const suggestMatch = feedback.match(/[Ss]uggest[?\s*["']([^"']+)["']/);
    if (suggestMatch) return suggestMatch[1];
    
    const includeMatch = feedback.match(/[Ii]nclude[?\s*["']([^"']+)["']/);
    if (includeMatch) return includeMatch[1];
    
    const addMatch = feedback.match(/[Aa]dd[?\s*["']([^"']+)["']/);
    if (addMatch) return addMatch[1];
    
    return null;
  };

  const suggestedText = feedback.suggestedText || extractSuggestedText(feedback.feedback);

  return (
    
      
        
          
            
            MLR Feedback Details
          
        

        
          
            {/* Feedback Overview */}
            
              
                
                  {getLocalSeverityIcon(feedback.severity)}
                  
                    
                      {getReviewerIcon(feedback.reviewerType)}
                      {feedback.reviewerName}
                      
                        {feedback.reviewerType}
                      
                    
                    
                      
                        
                        {feedback.date}
                      
                      {feedback.similarityScore && (
                        
                          
                          {feedback.similarityScore}% match
                        
                      )}
                      {feedback.assetType && (
                        
                          {feedback.assetType}
                        
                      )}
                    
                  
                
                
                  
                    {feedback.severity} priority
                  
                  
                    {feedback.category}
                  
                
              
            

            {/* Feedback Content */}
            
              
                Reviewer Feedback
                
                  
                  Copy Feedback
                
              
              
              
                {feedback.feedback}
              
            

            {/* Historical Context */}
            {feedback.historicalContext && (
              
                Historical Context
                
                  
                  
                    {feedback.historicalContext}
                  
                
              
            )}

            {/* Extracted Suggested Text */}
            {suggestedText && (
              
                Suggested Text
                
                  {suggestedText}
                
              
            )}

            {/* Smart Insertion Preview */}
            {suggestedText && preview && (
              
                
                  Smart Insertion Preview
                   setShowPreview(!showPreview)}
                  >
                    
                    {showPreview ? 'Hide' : 'Show'} Preview
                  
                
                
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
              
              
                {feedback.status === 'pending' && (
                  
                    
                    {isProcessing ? 'Applying...'  ? 'Apply Smart Insertion' : 'Apply Feedback'}
                  
                )}
                
                 feedback.severity === 'high' ? setShowPreview(true) ()}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  
                  {feedback.severity === 'high' ? 'Decline with Reason' : 'Decline'}
                
              

              {/* Decline Reason for High Priority Items */}
              {feedback.severity === 'high' && (
                
                  
                    Rationale for declining high-priority MLR feedback/label>
                   setDeclineReason(e.target.value)}
                    placeholder="Provide justification for declining this high-priority reviewer feedback..."
                    className="min-h-[80px]"
                  />
                  
                    
                      
                      Submit Decline Reason
                    
                  
                
              )}
            
          
        
      
    
  );
};

export default MLRMemoryDetailsModal;
