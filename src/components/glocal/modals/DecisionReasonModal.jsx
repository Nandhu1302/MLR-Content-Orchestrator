import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

export const DecisionReasonModal = ({
  isOpen,
  onClose,
  onSubmit,
  actionType,
  ruleName
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason('');
      onClose();
    }
  };

  const getTitle = () => {
    switch (actionType) {
      case 'mlr_exception':
        return 'Request MLR Exception';
      case 'accept_risk':
        return 'Accept Risk & Skip';
      case 'defer_to_mlr':
        return 'Defer to MLR Review';
      default:
        return 'Provide Reasoning';
    }
  };

  const getDescription = () => {
    switch (actionType) {
      case 'mlr_exception':
        return 'Explain why this critical compliance issue requires an exception. This will be escalated to the Medical Legal Regulatory team for approval.';
      case 'accept_risk':
        return 'Document your decision to skip this recommendation. Include your rationale and any risk assessment considerations.';
      case 'defer_to_mlr':
        return 'Provide context for the MLR team to review during the approval process. Explain why manual review is needed.';
      default:
        return 'Please provide your reasoning for this decision.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Rule</Label>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">{ruleName}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reasoning *</Label>
            <Textarea
              id="reason"
              placeholder="Enter detailed reasoning for this decision..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This reasoning will be logged for audit purposes.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!reason.trim()}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};