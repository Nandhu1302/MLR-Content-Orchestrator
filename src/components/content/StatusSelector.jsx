import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CheckCircle, Clock, FileEdit, Send, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'secondary',
    icon: FileEdit,
    description: 'Content is being created and edited'
  },
  in_review: {
    label: 'In Review',
    color: 'default',
    icon: Clock,
    description: 'Content is under review for approval'
  },
  approved: {
    label: 'Approved',
    color: 'default',
    icon: CheckCircle,
    description: 'Content has been approved and is ready'
  },
  design_ready: {
    label: 'Design Ready',
    color: 'default',
    icon: Send,
    description: 'Content has been sent to Design Studio'
  },
  completed: {
    label: 'Completed',
    color: 'default',
    icon: CheckCircle,
    description: 'Content is finalized and ready for use'
  }
};

const VALID_TRANSITIONS = {
  draft: ['in_review'],
  in_review: ['draft', 'approved'],
  approved: ['in_review', 'completed'],
  design_ready: ['approved', 'completed'],
  completed: ['approved']
};

const CRITICAL_TRANSITIONS = ['completed'];

export const StatusSelector = ({
  currentStatus,
  onStatusChange,
  disabled = false
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [pendingStatus, setPendingStatus] = React.useState(null);

  // Fallback to 'draft' if currentStatus is not in STATUS_CONFIG
  const safeStatus = STATUS_CONFIG[currentStatus] ? currentStatus : 'draft';
  const currentConfig = STATUS_CONFIG[safeStatus];
  const CurrentIcon = currentConfig.icon;

  const handleStatusSelect = (newStatus) => {
    const status = newStatus;
    
    if (status === currentStatus) return;
    
    // Check if transition is valid
    if (!VALID_TRANSITIONS[currentStatus].includes(status)) {
      return;
    }

    // Show confirmation for critical transitions
    if (CRITICAL_TRANSITIONS.includes(status)) {
      setPendingStatus(status);
      setShowConfirmDialog(true);
      return;
    }

    // Direct transition for non-critical changes
    onStatusChange(status);
  };

  const handleConfirmTransition = () => {
    if (pendingStatus) {
      onStatusChange(pendingStatus);
      setPendingStatus(null);
    }
    setShowConfirmDialog(false);
  };

  const handleCancelTransition = () => {
    setPendingStatus(null);
    setShowConfirmDialog(false);
  };

  const availableTransitions = VALID_TRANSITIONS[safeStatus];

  return (
    <>
      <div className="flex items-center gap-2">
        <Badge variant={currentConfig.color} className="flex items-center gap-1">
          <CurrentIcon className="h-3 w-3" />
          {currentConfig.label}
        </Badge>
        
        {!disabled && availableTransitions.length > 0 && (
          <>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <Select
              value={safeStatus}
              onValueChange={handleStatusSelect}
              disabled={disabled}
            >
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={safeStatus} disabled>
                  {currentConfig.label} (current)
                </SelectItem>
                {availableTransitions.map((status) => {
                  const config = STATUS_CONFIG[status];
                  const StatusIcon = config.icon;
                  return (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatus && `Are you sure you want to mark this content as "${STATUS_CONFIG[pendingStatus].label}"? This will make the content available for localization and other downstream processes.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelTransition}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTransition}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};