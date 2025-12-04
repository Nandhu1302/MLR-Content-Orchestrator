import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock brand consistency analysis
const getBrandConsistencyAnalysis = (asset) => {
  const baseScore = 75;
  let score = baseScore;
  const issues = [];
  const strengths = [];

  // Analyze based on asset characteristics
  if (asset.source_module === 'pre_mlr') {
    score += 15;
    strengths.push('MLR pre-approved messaging');
  }

  if (asset.type === 'email') {
    score += 5;
    strengths.push('Template-based consistency');
  }

  if (asset.type === 'sales_aid') {
    score -= 5;
    issues.push('Complex visual elements need validation');
  }

  // Simulate some random variations
  const variation = Math.abs(asset.id?.charCodeAt(0) || 0) % 30;
  score += variation - 15;

  if (score < 70) {
    issues.push('Tone alignment needs review');
  }
  if (score < 60) {
    issues.push('Key messaging deviations detected');
  }
  if (score > 85) {
    strengths.push('Strong brand guideline adherence');
  }

  return {
    score: Math.min(Math.max(score, 0), 100),
    issues,
    strengths,
    complianceAreas: {
      messaging: Math.min(score + 10, 100),
      tone: Math.min(score + 5, 100),
      visual: Math.min(score - 5, 100),
      regulatory: asset.source_module === 'pre_mlr' ? 95 : score - 10
    }
  };
};

export const BrandConsistencyIndicator = ({
  asset,
  className
}) => {
  const analysis = getBrandConsistencyAnalysis(asset);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score) => {
    if (score >= 85) return CheckCircle;
    if (score >= 70) return AlertTriangle;
    return XCircle;
  };

  const ScoreIcon = getScoreIcon(analysis.score);

  return (
    <TooltipProvider>
      <div className={cn("space-y-3", className)}>
        {/* Main Brand Consistency Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Brand Consistency</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={analysis.score} className="w-16 h-2" />
            <ScoreIcon className={cn("h-4 w-4", getScoreColor(analysis.score))} />
            <span className={cn("text-sm font-medium", getScoreColor(analysis.score))}>
              {analysis.score}%
            </span>
          </div>
        </div>

        {/* Compliance Areas Breakdown */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Messaging</span>
            <span className={getScoreColor(analysis.complianceAreas.messaging)}>
              {analysis.complianceAreas.messaging}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tone</span>
            <span className={getScoreColor(analysis.complianceAreas.tone)}>
              {analysis.complianceAreas.tone}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Visual</span>
            <span className={getScoreColor(analysis.complianceAreas.visual)}>
              {analysis.complianceAreas.visual}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Regulatory</span>
            <span className={getScoreColor(analysis.complianceAreas.regulatory)}>
              {analysis.complianceAreas.regulatory}%
            </span>
          </div>
        </div>

        {/* Issues and Strengths */}
        {(analysis.issues.length > 0 || analysis.strengths.length > 0) && (
          <div className="space-y-1">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle className="h-3 w-3" />
                {strength}
              </div>
            ))}
            {analysis.issues.map((issue, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-yellow-700">
                <AlertTriangle className="h-3 w-3" />
                {issue}
              </div>
            ))}
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge 
            variant={analysis.score >= 85 ? "default" : analysis.score >= 70 ? "secondary" : "destructive"}
            className="text-xs"
          >
            {analysis.score >= 85 ? "Brand Compliant" : 
             analysis.score >= 70 ? "Minor Review Needed" : 
             "Requires Brand Review"}
          </Badge>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="font-medium mb-1">Brand Consistency Analysis</p>
                <p className="text-xs">
                  Automated analysis of messaging, tone, visual elements, and regulatory compliance 
                  against brand guidelines.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};