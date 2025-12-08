import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertCircle, Clock, Zap, Target } from 'lucide-react';

// Interface and type annotations removed
export const BlankStartConfirmDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm 
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <AlertDialogTitle>Start from scratch?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4">
            <p>Templates can significantly speed up your workflow:</p>
            
            <div className="space-y-3 my-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">60% Faster Setup</p>
                  <p className="text-xs text-muted-foreground">Complete projects in 5-10 minutes vs 20-30 minutes</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Zap className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Pre-filled Intelligence</p>
                  <p className="text-xs text-muted-foreground">Leverage audience insights and proven messaging</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Higher Success Rate</p>
                  <p className="text-xs text-muted-foreground">Templates have 85%+ completion rates</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm">Are you sure you want to start with a blank project?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Back to Templates</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-muted hover:bg-muted/80">
            Continue Blank
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};