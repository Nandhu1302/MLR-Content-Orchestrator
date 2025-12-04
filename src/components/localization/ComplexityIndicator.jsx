import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Globe, 
  FileText, 
  Palette, 
  Settings,
  AlertTriangle,
  RefreshCw,
  Info
} from 'lucide-react';
import { useComplexityScoring } from '@/hooks/useComplexityScoring';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ComplexityIndicator = ({
  projectId,
  contentData,
  targetLanguages,
  targetMarkets,
  compact = false
}) => {
  const { 
    complexity, 
    isLoading, 
    triggerScoring, 
    lastScored 
  } = useComplexityScoring(projectId, contentData, targetLanguages, targetMarkets);

  const getComplexityColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getComplexityVariant = (score) => {
    if (score >= 80) return 'destructive';
    if (score >= 60) return 'secondary';
    return 'default';
  };

  const getComplexityLabel = (score) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  if (compact && complexity) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <Badge variant={getComplexityVariant(complexity.overallComplexityScore)} className="text-xs">
                {getComplexityLabel(complexity.overallComplexityScore)} Complexity
              </Badge>
              <span className="text-xs text-muted-foreground">
                {complexity.overallComplexityScore}%
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-sm">
            <div className="space-y-2">
              <p className="font-medium">Complexity Breakdown</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Text:</span>
                  <span>{complexity.textComplexityScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cultural:</span>
                  <span>{complexity.culturalComplexityScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Technical:</span>
                  <span>{complexity.technicalComplexityScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Visual:</span>
                  <span>{complexity.visualComplexityScore}%</span>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Complexity Analysis</h3>
        </div>
        {complexity && (
          <Button 
            onClick={triggerScoring}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-y-4 flex-col">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Calculating complexity scores...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {complexity && (
        <>
          {/* Overall Complexity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Overall Complexity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Complexity Level</span>
                  <Badge variant={getComplexityVariant(complexity.overallComplexityScore)} className="capitalize">
                    {getComplexityLabel(complexity.overallComplexityScore)} Complexity
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Score</span>
                  <span className={`font-bold ${getComplexityColor(complexity.overallComplexityScore)}`}>
                    {complexity.overallComplexityScore}%
                  </span>
                </div>
                <Progress value={complexity.overallComplexityScore} className="h-3" />
                
                {complexity.effortMultiplier > 1 && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Expected {complexity.effortMultiplier}x effort multiplier
                    </span>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Last scored: {lastScored ? new Date(lastScored).toLocaleString() : 'Never'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complexity Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  Text Complexity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Score</span>
                    <span className="font-medium">{complexity.textComplexityScore}%</span>
                  </div>
                  <Progress value={complexity.textComplexityScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Readability, terminology complexity, and linguistic challenges
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4" />
                  Cultural Complexity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Score</span>
                    <span className="font-medium">{complexity.culturalComplexityScore}%</span>
                  </div>
                  <Progress value={complexity.culturalComplexityScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Cultural adaptation requirements and sensitivities
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4" />
                  Technical Complexity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Score</span>
                    <span className="font-medium">{complexity.technicalComplexityScore}%</span>
                  </div>
                  <Progress value={complexity.technicalComplexityScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    File formats, integrations, and technical requirements
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Palette className="h-4 w-4" />
                  Visual Complexity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Score</span>
                    <span className="font-medium">{complexity.visualComplexityScore}%</span>
                  </div>
                  <Progress value={complexity.visualComplexityScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Layout adaptation, image localization, and design changes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Estimates */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Estimates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{complexity.effortMultiplier}x</div>
                  <div className="text-sm text-muted-foreground">Effort Multiplier</div>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">+{complexity.timelineImpactDays}</div>
                  <div className="text-sm text-muted-foreground">Additional Days</div>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-accent">+{complexity.costImpactPercentage}%</div>
                  <div className="text-sm text-muted-foreground">Cost Impact</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complexity Factors */}
          {complexity.complexityFactors && Object.keys(complexity.complexityFactors).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Contributing Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(complexity.complexityFactors).map(([factor, impact]) => (
                    <div key={factor} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <Badge variant="outline" className="text-xs">
                        {typeof impact === 'number' ? `${impact}%` : String(impact)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!complexity && !isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-medium">No Complexity Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Analyze" to calculate complexity scores
                </p>
              </div>
              <Button onClick={triggerScoring}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Analyze Complexity
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};