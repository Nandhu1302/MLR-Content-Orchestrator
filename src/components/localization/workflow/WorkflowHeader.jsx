
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  FileText,
  Image,
  Video,
  Mail,
  Smartphone,
  Monitor,
  Globe,
  Save,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

// NOTE: Removed TypeScript `interface WorkflowHeaderProps` and type-only imports.
// Kept the same props and behavior.
export const WorkflowHeader = ({
  asset,
  workflowState,
  onBackToHub,
  onSaveAndExit,
  lastSaveTime
}) => {
  const getAssetIcon = (type) => {
    if (!type) return FileText;
    switch (String(type).toLowerCase()) {
      case 'mass-email':
      case 'email':
        return Mail;
      case 'social_media':
        return Smartphone;
      case 'landing-page':
      case 'landing_page':
        return Monitor;
      case 'digital-sales-aid':
      case 'sales_aid':
        return FileText;
      case 'patient-brochure':
        return FileText;
      case 'digital-tool':
        return Monitor;
      case 'presentation':
        return FileText;
      case 'video-script':
      case 'banner':
      case 'display_ad':
        return Image;
      case 'video':
        return Video;
      default:
        return FileText;
    }
  };

  const getSourceBadgeColor = (source) => {
    switch (source) {
      case 'content_studio':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'pre_mlr':
        return 'bg-success/10 text-success border-success/20';
      case 'design_studio':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      default:
        return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const getCurrentStepTitle = () => {
    switch (workflowState?.currentStep) {
      case 'intelligence':
        return 'Localization Intelligence Analysis';
      case 'marketReadiness':
        return 'Market Readiness Assessment';
      case 'optimization':
        return 'Project Optimization';
      default:
        return 'Localization Workflow';
    }
  };

  const AssetIcon = getAssetIcon(asset?.asset_type ?? asset?.type);

  return (
    <header className="bg-card border-b border-border">
      <div className="px-6 py-4">
        {/* Breadcrumb Navigation */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={onBackToHub}
                  className="cursor-pointer hover:text-primary"
                >
                  Localization Hub
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={onBackToHub}
                  className="cursor-pointer hover:text-primary"
                >
                  Asset Discovery
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Localization Workflow</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Content */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Back Button */}
            <Button variant="outline" size="sm" onClick={onBackToHub} className="mt-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Discovery
            </Button>

            {/* Asset Information */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <AssetIcon className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div>
                    <h1 className="text-xl font-semibold line-clamp-2">{asset?.name}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      {asset?.project_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    className={cn('text-xs', getSourceBadgeColor(asset?.source_module))}
                    variant="outline"
                  >
                    {(asset?.source_module ?? '').replace('_', ' ')}
                  </Badge>

                  <Badge variant="outline" className="text-xs">
                    {asset?.status}
                  </Badge>

                  <Badge variant="outline" className="text-xs">
                    {asset?.asset_type ?? asset?.type}
                  </Badge>

                  {asset?.reusabilityScore && (
                    <Badge variant="outline" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      {asset.reusabilityScore}% Reusable
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Step Info & Actions */}
          <div className="flex items-center gap-4">
            {/* Save Status */}
            {lastSaveTime && (
              <div className="text-right text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Saved {formatDistanceToNow(lastSaveTime, { addSuffix: true })}</span>
              </div>
            )}

            {/* Save & Exit Button */}
            {onSaveAndExit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSaveAndExit}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save & Exit
              </Button>
            )}

            {/* Current Step Info */}
            <div className="text-right">
              <h2 className="text-lg font-medium text-primary">{getCurrentStepTitle()}</h2>
              <p className="text-sm text-muted-foreground">
                Step {(workflowState?.completedSteps?.length ?? 0) + 1} of 3
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
