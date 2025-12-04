import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExecutiveSummary from '@/pages/ExecutiveSummary';

const ExecutiveSummaryModal = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 bg-background/80 hover:bg-background"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="overflow-auto max-h-[95vh]">
          <ExecutiveSummary />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExecutiveSummaryModal;