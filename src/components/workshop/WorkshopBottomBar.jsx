
import { ArrowLeft, ArrowRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/*
interface WorkshopBottomBarProps {
  currentStep: number;
  totalSteps?: number;
  onBack: () => void;
  onNext: () => void;
  onOpenIntelligence: () => void;
  intelligenceCount?: number;
  isLoading?: boolean;
  canProceed?: boolean;
  nextLabel?: string;
}
*/

export const WorkshopBottomBar = ({
  currentStep,
  totalSteps = 5,
  onBack,
  onNext,
  onOpenIntelligence,
  intelligenceCount = 0,
  isLoading = false,
  canProceed = true,
  nextLabel,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const getNextLabel = () => {
    if (nextLabel) return nextLabel;
    if (isLastStep) return 'Generate Content';
    return 'Continue';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto gap-4">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isFirstStep || isLoading}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          {/* Step Indicator */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">
              Step <span className="font-semibold text-foreground">{currentStep}</span> of {totalSteps}
            </div>
          </div>

          {/* Next/Continue Button */}
          <Button
            onClick={onNext}
            disabled={!canProceed || isLoading}
            className="gap-2"
          >
            <span>{getNextLabel()}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
