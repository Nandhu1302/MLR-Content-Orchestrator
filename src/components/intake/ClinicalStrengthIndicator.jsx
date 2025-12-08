import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useEvidenceLibrary } from '@/hooks/useEvidenceLibrary';
// Type imports removed
import { PIEvidenceSelector } from '@/services/PIEvidenceSelector';
import { CheckCircle2, AlertTriangle, Info, Sparkles, FileText, Activity, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PIEvidencePreviewModal } from './PIEvidencePreviewModal';

// Interface and type annotations removed
export const ClinicalStrengthIndicator = ({ 
  brandId, 
  context,
  piData 
}) => {
  const { claims, references, segments, safetyStatements, isLoading } = useEvidenceLibrary(brandId);
  const [alignment, setAlignment] = useState(null);
  const [strengthScore, setStrengthScore] = useState(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    // Only calculate if we have minimum required context
    if (!context.objective || !context.audience || !context.indication) {
      setAlignment(null);
      setStrengthScore(0);
      return;
    }

    // Build strategic context for PI filtering
    // Type assertion removed
    const strategicContext = {
      campaignObjective: context.objective,
      keyMessage: context.keyMessage || '',
      targetAudience: context.audience,
      indication: context.indication,
      assetType: context.assetType || 'Email'
    };

    // Debug logging for PI data
    console.log('🔍 Clinical Strength Debug:', {
      piDataExists: !!piData,
      piDataType: piData === null ? 'null' : piData === undefined ? 'undefined' : typeof piData,
      piDataKeys: piData ? Object.keys(piData) : [],
      context: strategicContext,
      evidenceCounts: {
        claims: claims.length,
        references: references.length,
        segments: segments.length,
        safety: safetyStatements.length
      }
    });

    // Use PI Evidence Selector to analyze alignment
    const filteredResult = PIEvidenceSelector.filterPIForContext(piData, strategicContext);
    
    console.log('🎯 PI Filtering Result:', {
      hasResult: !!filteredResult,
      relevanceScore: filteredResult?.relevanceScore,
      sectionsCount: filteredResult ? Object.keys(filteredResult.selectedSections).length : 0,
      reasoning: filteredResult?.reasoning?.length
    });
    
    // Calculate base score from evidence library even if PI is not available
    const evidenceBoost = Math.min(
      (claims.length * 2) + (references.length * 1.5) + (segments.length * 1) + (safetyStatements.length * 2),
      60 // Increased cap since evidence library is valuable on its own
    );
    
    if (filteredResult) {
      setAlignment(filteredResult);
      
      // Calculate enhanced strength score based on PI + evidence availability
      let score = filteredResult.relevanceScore;
      score = Math.min(score + evidenceBoost, 100);
      setStrengthScore(Math.round(score));
      
      console.log('✅ Final Score Calculation:', {
        piRelevanceScore: filteredResult.relevanceScore,
        evidenceBoost,
        finalScore: Math.round(score),
        breakdown: {
          fromPI: filteredResult.relevanceScore,
          fromClaims: Math.min(claims.length * 2, 60),
          fromReferences: Math.min(references.length * 1.5, 60),
          fromSegments: Math.min(segments.length * 1, 60),
          fromSafety: Math.min(safetyStatements.length * 2, 60)
        }
      });
    } else if (evidenceBoost > 0) {
      // Even without PI, if we have evidence library items, show a score
      setAlignment(null);
      setStrengthScore(Math.round(evidenceBoost));
      
      console.log('⚠️ Score Without PI:', {
        evidenceBoost,
        reason: piData ? 'PI filtering returned no results' : 'No PI data provided'
      });
    } else {
      setAlignment(null);
      setStrengthScore(0);
    }
  }, [context, piData, claims, references, segments, safetyStatements]);

  // Type annotations removed
  const getStrengthLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2 };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600 dark:text-blue-400', icon: Activity };
    if (score >= 40) return { level: 'Moderate', color: 'text-amber-600 dark:text-amber-400', icon: AlertTriangle };
    return { level: 'Limited', color: 'text-orange-600 dark:text-orange-400', icon: Info };
  };

  // Type annotation removed
  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-orange-500';
  };

  // Don't show if missing critical context
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
            <Progress 
              value={strengthScore} 
              className="h-2"
            />
            <div 
              className={cn("absolute top-0 left-0 h-full rounded-full transition-all", getProgressColor(strengthScore))}
              style={{ width: `${strengthScore}%` }}
            />
          </div>
        </div>

        {/* Score Breakdown Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-xs"
          onClick={() => setShowBreakdown(!showBreakdown)}
        >
          <span className="font-medium">View Score Breakdown</span>
          {showBreakdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>

        {/* Detailed Score Breakdown */}
        {showBreakdown && (
          <div className="space-y-3 p-3 bg-muted/30 rounded-md border border-muted text-xs">
            <div className="font-medium text-sm mb-2">Score Calculation Breakdown</div>
            
            {/* PI Contribution */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">PI Document Alignment</span>
                <span className={cn("font-semibold", alignment ? "text-emerald-600" : "text-orange-600")}>
                  {alignment ? `+${alignment.relevanceScore} pts` : '0 pts'}
                </span>
              </div>
              {!alignment && (
                <div className="text-xs text-orange-600 flex items-start gap-1">
                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{piData === null || piData === undefined ? 'No PI document provided' : 'PI filtering found no relevant sections for this context'}</span>
                </div>
              )}
              {alignment && (
                <div className="text-xs text-muted-foreground">
                  ✓ {Object.keys(alignment.selectedSections).length} relevant PI sections identified
                </div>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Evidence Library Contributions */}
            <div className="space-y-2">
              <div className="font-medium text-muted-foreground">Evidence Library Contributions</div>
              
              <div className="space-y-1.5 pl-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3 w-3 text-blue-600" />
                    Clinical Claims ({claims.length})
                  </span>
                  <span className="font-semibold">+{Math.min(claims.length * 2, 60)} pts</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3 w-3 text-purple-600" />
                    References ({references.length})
                  </span>
                  <span className="font-semibold">+{Math.min(references.length * 1.5, 60).toFixed(1)} pts</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3 w-3 text-green-600" />
                    Content Segments ({segments.length})
                  </span>
                  <span className="font-semibold">+{Math.min(segments.length * 1, 60)} pts</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3 w-3 text-orange-600" />
                    Safety Statements ({safetyStatements.length})
                  </span>
                  <span className="font-semibold">+{Math.min(safetyStatements.length * 2, 60)} pts</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground italic pt-1">
                Evidence capped at 60 pts (currently: {Math.min(
                  (claims.length * 2) + (references.length * 1.5) + (segments.length * 1) + (safetyStatements.length * 2),
                  60
                ).toFixed(1)} pts)
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Total Calculation */}
            <div className="flex items-center justify-between font-semibold pt-1">
              <span>Total Clinical Strength</span>
              <span className={cn(
                "text-base",
                strengthScore >= 80 ? "text-emerald-600" : 
                strengthScore >= 60 ? "text-blue-600" : 
                strengthScore >= 40 ? "text-amber-600" : "text-orange-600"
              )}>
                {strengthScore}/100
              </span>
            </div>

            {/* Improvement Suggestions */}
            {strengthScore < 80 && (
              <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs">
                  <div className="font-medium mb-1">To improve this score:</div>
                  <ul className="space-y-0.5 pl-4 list-disc">
                    {!alignment && <li>Upload and process a PI document for this brand</li>}
                    {claims.length < 10 && <li>Extract more clinical claims from PI documents</li>}
                    {references.length < 15 && <li>Add more clinical references and citations</li>}
                    {segments.length < 20 && <li>Create more pre-approved content segments</li>}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Evidence Availability Summary */}
        {!isLoading && !showBreakdown && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 p-2 rounded-md bg-muted/50">
                    <FileText className="h-3 w-3 text-blue-600" />
                    <span className="font-medium">{claims.length}</span>
                    <span className="text-muted-foreground">Claims</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Clinical claims extracted from PI</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 p-2 rounded-md bg-muted/50">
                    <FileText className="h-3 w-3 text-purple-600" />
                    <span className="font-medium">{references.length}</span>
                    <span className="text-muted-foreground">References</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Clinical references and citations</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 p-2 rounded-md bg-muted/50">
                    <FileText className="h-3 w-3 text-green-600" />
                    <span className="font-medium">{segments.length}</span>
                    <span className="text-muted-foreground">Segments</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Pre-approved content segments</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 p-2 rounded-md bg-muted/50">
                    <FileText className="h-3 w-3 text-orange-600" />
                    <span className="font-medium">{safetyStatements.length}</span>
                    <span className="text-muted-foreground">Safety</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Safety statements from ISI</TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
            <p className="text-muted-foreground line-clamp-2">
              {alignment.usageGuidance}
            </p>
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
        {!alignment && piData === null && strengthScore === 0 && (
          <Alert variant="destructive" className="text-xs">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              PI document processing in progress. Using extracted evidence library for now.
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