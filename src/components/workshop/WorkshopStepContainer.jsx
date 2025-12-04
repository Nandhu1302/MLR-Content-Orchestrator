
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
interface Step {
  id: number;
  label: string;
  shortLabel: string;
}

const steps: Step[] = [
  { id: 1, label: 'Tell Your Story', shortLabel: 'Story' },
  { id: 2, label: 'AI Consultation', shortLabel: 'Consult' },
  { id: 3, label: 'Review & Confirm', shortLabel: 'Review' },
  { id: 4, label: 'Select Theme', shortLabel: 'Theme' },
  { id: 5, label: 'Generate Assets', shortLabel: 'Assets' },
];

interface WorkshopProgressStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}
*/

const steps = [
  { id: 1, label: 'Tell Your Story', shortLabel: 'Story' },
  { id: 2, label: 'AI Consultation', shortLabel: 'Consult' },
  { id: 3, label: 'Review & Confirm', shortLabel: 'Review' },
  { id: 4, label: 'Select Theme', shortLabel: 'Theme' },
  { id: 5, label: 'Generate Assets', shortLabel: 'Assets' },
];

export const WorkshopProgressStepper = ({ 
  currentStep, 
  onStepClick 
}) => {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted && onStepClick;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  isCurrent && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  !isCurrent && !isCompleted && "border-muted bg-background text-muted-foreground",
                  isClickable && "cursor-pointer hover:scale-105"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </button>

              {/* Step Label */}
              <div className="ml-3 hidden sm:block">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  isCurrent && "text-foreground",
                  isCompleted && "text-muted-foreground",
                  !isCurrent && !isCompleted && "text-muted-foreground"
                )}>
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-2 sm:mx-4 transition-colors",
                  (isCompleted || isCurrent) ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: Show current step label below */}
      <div className="sm:hidden text-center mt-3">
        <p className="text-sm font-medium text-foreground">
          {steps.find(s => s.id === currentStep)?.label}
        </p>
      </div>
    </div>
  );
};
