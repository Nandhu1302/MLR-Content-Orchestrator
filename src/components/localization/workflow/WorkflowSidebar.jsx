
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Shield,
  TrendingUp,
  CheckCircle,
  Circle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const WorkflowSidebar = ({
  workflowState,
  onStepSelect,
  isStepCompleted,
  canAccessStep,
  getStepProgress
}) => {
  const stepConfig = [
    {
      key: 'marketReadiness',
      title: 'Market Selection',
      shortTitle: 'Markets',
      description: 'Select target markets and assess regulatory requirements',
      icon: Shield,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      key: 'intelligence',
      title: 'SmartTM Intelligence',
      shortTitle: 'SmartTM',
      description: 'AI-powered translation memory with brand consistency validation',
      icon: Brain,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      key: 'optimization',
      title: 'Project Optimization',
      shortTitle: 'Optimization',
      description: 'ROI analysis and market prioritization recommendations',
      icon: TrendingUp,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    }
  ];

  const getStepStatus = (step) => {
    if (isStepCompleted(step)) return 'completed';
    if (step === workflowState.currentStep) return 'current';
    if (canAccessStep(step)) return 'accessible';
    return 'locked';
  };

  const getStatusIcon = (step) => {
    const status = getStepStatus(step);
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'current':
        return <Clock className="h-5 w-5 text-primary" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col shrink-0 h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <h2 className="text-lg font-semibold mb-2 text-card-foreground">Localization Workflow</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/70 font-medium">Overall Progress</span>
            <span className="font-semibold text-card-foreground">
              {workflowState.overallProgress.toFixed(0)}%
            </span>
          </div>
          <Progress value={workflowState.overallProgress} className="h-2" />
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 p-3 space-y-1 bg-card">
        {stepConfig.map((step, index) => {
          const status = getStepStatus(step.key);
          const progress = getStepProgress(step.key);
          const isCurrent = step.key === workflowState.currentStep;
          const isCompleted = isStepCompleted(step.key);
          const canAccess = canAccessStep(step.key);
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="space-y-2">
              {/* Step Button */}
              <Button
                variant={isCurrent ? 'default' : isCompleted ? 'secondary' : 'ghost'}
                size="lg"
                onClick={() => canAccess && onStepSelect(step.key)}
                disabled={!canAccess}
                className={cn(
                  'w-full justify-start text-left h-auto p-3 transition-all duration-200',
                  isCurrent && 'ring-2 ring-primary/30 bg-primary/5 hover:bg-primary/10',
                  isCompleted && !isCurrent && 'bg-secondary/70 hover:bg-secondary/90',
                  !canAccess && 'opacity-50 cursor-not-allowed',
                  canAccess && !isCurrent && !isCompleted && 'hover:bg-muted/50'
                )}
              >
                <div className="flex items-start gap-3 w-full">
                  <div
                    className={cn(
                      'p-2 rounded-lg flex-shrink-0 transition-colors',
                      isCurrent
                        ? 'bg-primary/20 ring-1 ring-primary/30'
                        : isCompleted
                        ? cn(step.bgColor, 'ring-1', step.borderColor)
                        : 'bg-muted'
                    )}
                  >
                    <StepIcon
                      className={cn(
                        'h-4 w-4',
                        isCurrent
                          ? 'text-primary'
                          : isCompleted
                          ? step.color
                          : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left overflow-hidden">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <h3
                        className={cn(
                          'font-semibold text-sm leading-snug truncate',
                          isCurrent
                            ? 'text-primary'
                            : isCompleted
                            ? 'text-foreground'
                            : 'text-foreground/90'
                        )}
                      >
                        {step.title}
                      </h3>
                      <div className="flex-shrink-0 mt-0.5">{getStatusIcon(step.key)}</div>
                    </div>
                    <p
                      className={cn(
                        'text-xs leading-tight break-words max-w-[180px]',
                        isCurrent
                          ? 'text-foreground/80'
                          : isCompleted
                          ? 'text-foreground/70'
                          : 'text-foreground/60'
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </Button>

              {/* Step Indicator Line */}
              {index < stepConfig.length - 1 && (
                <div className="flex justify-center">
                  <div
                    className={cn(
                      'w-px h-2',
                      isCompleted ? 'bg-success/40' : 'bg-border'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-foreground/70">
            <span className="font-medium">Steps Completed</span>
            <span className="font-semibold">
              {workflowState.completedSteps.length} / {stepConfig.length}
            </span>
          </div>
          {workflowState.isComplete && (
            <Badge variant="outline" className="w-full justify-center py-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Workflow Complete
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
