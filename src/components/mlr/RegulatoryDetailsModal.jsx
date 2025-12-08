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

export const RegulatoryDetailsModal = ({ 
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
      console.error('Error applying compliance text:', error);
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
      console.error('Error declining compliance check:', error);
    } finally {
      setIsProcessing(false);
      setDeclineReason('');
    }
  };

  const getInsertionPreview = () => {
    if (!check.suggestion) return null;
    
    const insertionType = check.category === 'indication' ? 'indication' :
                         check.category === 'safety' ? 'safety' :
                         check.category === 'fair_balance' ? 'fair_balance' :
                         check.category === 'prescribing_info' || check.category === 'disclaimer' ? 'disclaimer' :
                         'disclaimer';
                         
    return SmartContentInsertion.getInsertionPreview(
      currentContent, 
      insertionType, 
      check.suggestion
    );
  };

  const preview = getInsertionPreview();

  const getSeverityIcon = (status) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'failed': return <X className="h-5 w-5 text-red-500" />;
      default: return <Shield className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'default';
      case 'warning': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getSeverityIcon(check.status)}
            Regulatory Compliance Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Compliance Check Overview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{check.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getStatusColor(check.status)}
                    className="text-sm"
                  >
                    {check.status}
                  </Badge>
                  {check.required && (
                    <Badge variant="outline" className="text-sm">
                      Required
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground">{check.description}</p>
              
              {check.regulatoryBasis && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Regulatory Basis:</strong> {check.regulatoryBasis}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Suggested Compliance Text */}
            {check.suggestion && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium">Suggested Compliance Text</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyText}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Text
                  </Button>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-mono whitespace-pre-wrap">{check.suggestion}</p>
                </div>
              </div>
            )}

            {/* Insertion Preview */}
            {preview && (
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
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded my-1">
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
                {check.status !== 'passed' && (
                  <Button 
                    onClick={handleApply}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Applying...' : 'Apply Smart Insertion'}
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={() => check.required ? setShowPreview(true) : handleDecline()}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  {check.required ? 'Decline with Reason' : 'Decline'}
                </Button>
              </div>

              {/* Decline Reason for Required Items */}
              {check.required && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Rationale for declining required compliance item:
                  </label>
                  <Textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Provide justification for declining this required regulatory compliance item..."
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
export { RegulatoryDetailsModal };
