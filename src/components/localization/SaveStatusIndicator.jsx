import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Save, CheckCircle2, AlertCircle, Loader2, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from 'date-fns';

export const SaveStatusIndicator = ({
  isSaving,
  lastSaved,
  error,
  onManualSave,
  className = ''
}) => {
  const getStatusDisplay = () => {
    if (error) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Save Failed',
        variant: 'destructive',
        tooltip: error
      };
    }
    
    if (isSaving) {
      return {
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        text: 'Saving...',
        variant: 'secondary',
        tooltip: 'Saving your work to the cloud'
      };
    }
    
    if (lastSaved) {
      const timeAgo = formatDistanceToNow(lastSaved, { addSuffix: true });
      return {
        icon: <CheckCircle2 className="h-4 w-4" />,
        text: 'Saved',
        variant: 'default',
        tooltip: `Last saved ${timeAgo}`
      };
    }
    
    return {
      icon: <Clock className="h-4 w-4" />,
      text: 'Not Saved',
      variant: 'outline',
      tooltip: 'No changes saved yet'
    };
  };

  const status = getStatusDisplay();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={status.variant} className="flex items-center gap-1.5">
              {status.icon}
              <span className="text-xs">{status.text}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{status.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {onManualSave && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onManualSave}
                disabled={isSaving}
                className="h-8 px-2"
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save Progress Manually</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};