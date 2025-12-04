
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useEvidenceLibrary } from '@/hooks/useEvidenceLibrary';
import { PIEvidenceSelector } from '@/services/PIEvidenceSelector';
import { CheckCircle2, AlertTriangle, Info, Sparkles, FileText, Activity, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PIEvidencePreviewModal } from './PIEvidencePreviewModal';

export const ClinicalStrengthIndicator = ({ brandId, context, piData }) => {
  const { claims, references, segments, safetyStatements, isLoading } = useEvidenceLibrary(brandId);
  const [alignment, setAlignment] = useState(null);
  const [strengthScore, setStrengthScore] = useState(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    if (!context.objective || !context.audience || !context.indication) {
      setAlignment(null);
      setStrengthScore(0);
      return;
    }

    const strategicContext = {
      campaignObjective: context.objective,
      keyMessage: context.keyMessage || '',
      targetAudience: context.audience,
      indication: context.indication,
      assetType: context.assetType || 'Email'
    };

    const filteredResult = PIEvidenceSelector.filterPIForContext(piData, strategicContext);
    if (filteredResult) {
      setAlignment(filteredResult);
      let score = filteredResult.relevanceScore;

      const evidenceBoost = Math.min(
        (claims.length * 2) + (references.length * 1.5) + (segments.length * 1) + (safetyStatements.length * 2),
        20
      );
      score = Math.min(score + evidenceBoost, 100);
      setStrengthScore(Math.round(score));
    } else {
      setAlignment(null);
      setStrengthScore(0);
    }
  }, [context, piData, claims, references, segments, safetyStatements]);

  const getStrengthLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2 };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600 dark:text-blue-400', icon: Activity };
    if (score >= 40) return { level: 'Moderate', color: 'text-amber-600 dark:text-amber-400', icon: AlertTriangle };
    return { level: 'Limited', color: 'text-orange-600 dark:text-orange-400', icon: Info };
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-orange-500';
  };

  if (!context.objective || !context.audience || !context.indication) {
    return null;
  }

  const strength = getStrengthLevel(strengthScore);
  const StrengthIcon = strength.icon;

  return (
    <Card className="border-2 border-muted">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Clinical Strength Indicator
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={strengthScore >= 60 ? "default" : "secondary"}
                  className={cn("font-semibold", strength.color)}
                >
                  <StrengthIcon className="h-3 w-3 mr-1" />
                  {strength.level}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Clinical alignment strength based on PI evidence availability and strategic context
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Strength Score Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Alignment Score</span>
            <span className="font-semibold">{strengthScore}/100</span>
          </div>
          <div className="relative">
            <Progress value={strengthScore} className="h-2" />
            <div
              className={cn("absolute top-0 left-0 h-full rounded-full transition-all", getProgressColor(strengthScore))}
              style={{ width: `${strengthScore}%` }}
            />
          </div>
        </div>

        {/* Evidence Availability Summary */}
        {!isLoading && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Claims', count: claims.length, color: 'text-blue-600', tooltip: 'Clinical claims extracted from PI' },
              { label: 'References', count: references.length, color: 'text-purple-600', tooltip: 'Clinical references and citations' },
              { label: 'Segments', count: segments.length, color: 'text-green-600', tooltip: 'Pre-approved content segments' },
              { label: 'Safety', count: safetyStatements.length, color: 'text-orange-600', tooltip: 'Safety statements from ISI' }
            ].map((item, idx) => (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 p-2 rounded-md bg-muted/50">
                      <FileText className={`h-3 w-3 ${item.color}`} />
                      <span className="font-medium">{item.count}</span>
                      <span className="text-muted-foreground">{item.label}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{item.tooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}

        {/* Alignment Insights */}
        {alignment && alignment.reasoning.length > 0 && (
          <Alert className="bg-muted/30 border-muted">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs space-y-1">
              <p className="font-medium mb-1">Selected PI Sections:</p>
              <ul className="space-y-0.5 pl-4">
                {alignment.reasoning.slice(0, 3).map((reason, idx) => (
                  <li key={idx} className="text-muted-foreground list-disc">
                    {reason.split(':')[0]}
                  </li>
                ))}
                {alignment.reasoning.length > 3 && (
                  <li className="text-muted-foreground italic">
                    +{alignment.reasoning.length - 3} more sections
                  </li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Usage Guidance Preview */}
        {alignment && alignment.usageGuidance && (
          <div className="text-xs p-3 bg-primary/5 border border-primary/20 rounded-md space-y-2">
            <p className="font-medium text-primary mb-1">Content Generation Guidance:</p>
            <p className="text-muted-foreground line-clamp-2">{alignment.usageGuidance}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setIsPreviewModalOpen(true)}
            >
              <Eye className="h-3 w-3 mr-2" />
              View Detailed PI Evidence
            </Button>
          </div>
        )}

        {/* No PI Data Warning */}
        {!alignment && piData === null && (
          <Alert variant="destructive" className="text-xs">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No PI document available. Content will be generated without clinical backing.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      {/* PI Evidence Preview Modal */}
      <PIEvidencePreviewModal
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
        alignment={alignment}
        piData={piData}
        strengthScore={strengthScore}
      />
    </Card>
  );
};
