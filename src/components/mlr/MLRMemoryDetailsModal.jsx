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
// TypeScript type import removed
// import type { MLRFeedback } from "./types/mlrTypes";

// Interface removed, props accessed directly below

const MLRMemoryDetailsModal = ({ 
  feedback, 
  isOpen, 
  onClose, 
  onApply,
  currentContent 
}) => { // TypeScript type annotation removed
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
        const insertionType = feedback.category === 'indication' ? 'indication' :
                             feedback.category === 'safety' ? 'safety' :
                             feedback.category === 'reference' ? 'reference' :
                             'fair_balance';
        
        document.dispatchEvent(new CustomEvent('smartInsertTemplate', {
          detail: {
            insertionType,
            insertionText: feedback.suggestedText
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
    
    const insertionType = feedback.category === 'indication' ? 'indication' :
                         feedback.category === 'safety' ? 'safety' :
                         feedback.category === 'reference' ? 'reference' :
                         'fair_balance';
                         
    return SmartContentInsertion.getInsertionPreview(
      currentContent, 
      insertionType, 
      feedback.suggestedText
    );
  };

  const preview = getInsertionPreview();

  // Use local severity icon that handles critical mapped to high
  const getLocalSeverityIcon = (severity) => { // Type annotation removed
    switch (severity) {
      case 'critical':
      case 'high': return <X className="h-5 w-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getReviewerIcon = (type) => { // Type annotation removed
    return <User className="h-5 w-5" />;
  };

  const getSeverityColor = (severity) => { // Type annotation removed
    switch (severity) {
      case 'high': 
      case 'critical': return 'destructive'; // Added 'critical' mapping
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  // Extract suggested text from feedback (simple heuristic)
  const extractSuggestedText = (feedbackText) => { // Type annotation removed
    const suggestMatch = feedbackText.match(/[Ss]uggest[:]?\s*["']([^"']+)["']/);
    if (suggestMatch) return suggestMatch[1];
    
    const includeMatch = feedbackText.match(/[Ii]nclude[:]?\s*["']([^"']+)["']/);
    if (includeMatch) return includeMatch[1];
    
    const addMatch = feedbackText.match(/[Aa]dd[:]?\s*["']([^"']+)["']/);
    if (addMatch) return addMatch[1];
    
    return null;
  };

  const suggestedText = feedback.suggestedText || extractSuggestedText(feedback.feedback);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            MLR Feedback Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Feedback Overview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getLocalSeverityIcon(feedback.severity)}
                  <div>
                    <div className="flex items-center gap-2">
                      {getReviewerIcon(feedback.reviewerType)}
                      <h3 className="text-lg font-semibold">{feedback.reviewerName}</h3>
                      <Badge variant="outline" className="text-sm">
                        {feedback.reviewerType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {feedback.date}
                      </div>
                      {feedback.similarityScore && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {feedback.similarityScore}% match
                        </div>
                      )}
                      {feedback.assetType && (
                        <Badge variant="secondary" className="text-xs">
                          {feedback.assetType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getSeverityColor(feedback.severity)} // Removed 'as any'
                    className="text-sm"
                  >
                    {feedback.severity} priority
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    {feedback.category}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Feedback Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium">Reviewer Feedback</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyFeedback}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Feedback
                </Button>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{feedback.feedback}</p>
              </div>
            </div>

            {/* Historical Context */}
            {feedback.historicalContext && (
              <div className="space-y-3">
                <h4 className="text-md font-medium">Historical Context</h4>
                <Alert>
                  <History className="h-4 w-4" />
                  <AlertDescription>
                    {feedback.historicalContext}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Extracted Suggested Text */}
            {suggestedText && (
              <div className="space-y-3">
                <h4 className="text-md font-medium">Suggested Text</h4>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm font-mono text-green-800">{suggestedText}</p>
                </div>
              </div>
            )}

            {/* Smart Insertion Preview */}
            {suggestedText && preview && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium">Smart Insertion Preview</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>
                
                {showPreview && (
                  <div className="space-y-2">
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Insertion Logic:</strong> {preview.insertionPoint.reason}
                        <br />
                        <strong>Confidence:</strong> {Math.round(preview.insertionPoint.confidence * 100)}%
                      </AlertDescription>
                    </Alert>
                    
                    <div className="bg-muted p-4 rounded-lg text-sm font-mono">
                      <div className="text-muted-foreground">
                        ...{preview.beforeText.slice(-50)}
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded my-1">
                        [INSERTED TEXT] {preview.insertionText}
                      </div>
                      <div className="text-muted-foreground">
                        {preview.afterText.slice(0, 50)}...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Section */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-md font-medium">Actions</h4>
              
              <div className="flex gap-3">
                {feedback.status === 'pending' && (
                  <Button 
                    onClick={handleApply}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Applying...' : suggestedText ? 'Apply Smart Insertion' : 'Apply Feedback'}
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  // Removed unnecessary check, if decline reason is mandatory, the button inside the section will handle the submission
                  onClick={feedback.severity === 'high' ? () => setShowPreview(true) : handleDecline} 
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  {feedback.severity === 'high' ? 'Decline with Reason' : 'Decline'}
                </Button>
              </div>

              {/* Decline Reason for High Priority Items */}
              {(feedback.severity === 'high' && showPreview) && ( // Added showPreview check to avoid showing immediately on open
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Rationale for declining high-priority MLR feedback:
                  </label>
                  <Textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Provide justification for declining this high-priority reviewer feedback..."
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={handleDecline}
                      disabled={!declineReason.trim() || isProcessing}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Submit Decline Reason
                    </Button>
                  </div>
                </div>
              )}
              {/* If high priority, show decline form right away without requiring showPreview state for decline flow */}
              {feedback.severity === 'high' && !showPreview && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Rationale for declining high-priority MLR feedback:
                  </label>
                  <Textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Provide justification for declining this high-priority reviewer feedback..."
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={handleDecline}
                      disabled={!declineReason.trim() || isProcessing}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Submit Decline Reason
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// 🎯 FIX: Changed 'export default' to 'export' for named export
export { MLRMemoryDetailsModal };