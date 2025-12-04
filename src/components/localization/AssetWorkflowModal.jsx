import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Image, 
  Video, 
  Mail, 
  Smartphone, 
  Monitor,
  Brain,
  Shield,
  TrendingUp,
  X,
  ChevronRight
} from 'lucide-react';
import { useLocalizationWorkflow } from '@/hooks/useLocalizationWorkflow';
import { LocalizationIntelligenceStep } from './workflow/LocalizationIntelligenceStep';
import { MarketReadinessStep } from './workflow/MarketReadinessStep';
import { ProjectOptimizationStep } from './workflow/ProjectOptimizationStep';

export const AssetWorkflowModal = ({
  asset,
  isOpen,
  onClose,
  onCreateProject
}) => {
  const {
    workflowState,
    updateStepData,
    completeStep,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    isStepCompleted,
    canAccessStep,
  } = useLocalizationWorkflow(asset);

  if (!asset) return null;

  const getAssetIcon = (type) => {
    if (!type) return FileText;
    
    switch (type.toLowerCase()) {
      case 'mass-email':
      case 'email': return Mail;
      case 'social_media': return Smartphone;
      case 'landing-page':
      case 'landing_page': return Monitor;
      case 'digital-sales-aid':
      case 'sales_aid': return FileText;
      case 'patient-brochure': return FileText;
      case 'digital-tool': return Monitor;
      case 'presentation': return FileText;
      case 'video-script':
      case 'banner': case 'display_ad': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const AssetIcon = getAssetIcon(asset.asset_type || asset.type);

  const getSourceBadgeColor = (source) => {
    switch (source) {
      case 'content_studio': return 'bg-blue-100 text-blue-800';
      case 'pre_mlr': return 'bg-green-100 text-green-800';
      case 'design_studio': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stepConfig = [
    {
      key: 'intelligence',
      title: 'Asset Intelligence Analysis',
      description: 'Brand compliance, cultural requirements, and localization complexity analysis',
      icon: Brain,
      color: 'text-blue-600'
    },
    {
      key: 'market-readiness',
      title: 'Market Readiness Assessment',
      description: 'Regulatory requirements, compliance analysis, and market-specific preparation',
      icon: Shield,
      color: 'text-green-600'
    },
    {
      key: 'optimization',
      title: 'Project Optimization',
      description: 'ROI analysis, market prioritization, and optimized project recommendations',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  const currentStepConfig = stepConfig.find(step => step.key === workflowState.currentStep);

  const handleStepComplete = (step, data) => {
    updateStepData(step, data);
    completeStep(step);
  };

  const handleCreateProject = async (summary) => {
    onCreateProject(summary);
    onClose();
  };

  const renderCurrentStep = () => {
    const commonProps = {
      asset,
      onNext: goToNextStep,
      onPrevious: goToPreviousStep
    };

    switch (workflowState.currentStep) {
      case 'intelligence':
        return (
          <LocalizationIntelligenceStep
            {...commonProps}
            onStepComplete={(data) => handleStepComplete('intelligence', data)}
            stepData={workflowState.stepData.intelligence}
          />
        );
      case 'marketReadiness':
        return (
          <MarketReadinessStep
            {...commonProps}
            intelligenceData={workflowState.stepData.intelligence}
            onStepComplete={(data) => handleStepComplete('market-readiness', data)}
            stepData={workflowState.stepData.marketReadiness}
          />
        );
      case 'optimization':
        return (
          <ProjectOptimizationStep
            {...commonProps}
            intelligenceData={workflowState.stepData.intelligence}
            marketData={workflowState.stepData.marketReadiness}
            onStepComplete={(data) => handleStepComplete('optimization', data)}
            onCreateProject={handleCreateProject}
            stepData={workflowState.stepData.optimization}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* Asset Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <AssetIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl line-clamp-2">{asset.name}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {asset.project_name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    className={getSourceBadgeColor(asset.source_module)}
                    variant="outline"
                  >
                    {asset.source_module.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {asset.status}
                  </Badge>
                  <Badge variant="outline">
                    {asset.asset_type || asset.type}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Workflow Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Localization Workflow</h3>
              <div className="flex items-center gap-2">
                <Progress value={workflowState.overallProgress} className="w-32" />
                <span className="text-sm font-medium">{workflowState.overallProgress.toFixed(0)}%</span>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex items-center gap-2">
              {stepConfig.map((step, index) => {
                const isCompleted = isStepCompleted(step.key);
                const isCurrent = step.key === workflowState.currentStep;
                const canAccess = canAccessStep(step.key);
                const StepIcon = step.icon;

                return (
                  <React.Fragment key={step.key}>
                    <Button
                      variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => canAccess && goToStep(step.key)}
                      disabled={!canAccess}
                      className="flex items-center gap-2 min-w-0"
                    >
                      <StepIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">{step.title}</span>
                      <span className="sm:hidden">{index + 1}</span>
                      {isCompleted && <span className="text-green-600">✓</span>}
                    </Button>
                    {index < stepConfig.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Current Step Info */}
            {currentStepConfig && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <currentStepConfig.icon className={`h-5 w-5 ${currentStepConfig.color}`} />
                  <h4 className="font-semibold">{currentStepConfig.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{currentStepConfig.description}</p>
              </div>
            )}
          </div>

          <Separator />
        </DialogHeader>

        {/* Step Content */}
        <div className="mt-6">
          {renderCurrentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};