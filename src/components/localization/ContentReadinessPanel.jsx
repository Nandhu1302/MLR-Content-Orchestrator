import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Shield, 
  BarChart3,
  RefreshCw,
  FileText,
  Lightbulb
} from 'lucide-react';
import { useContentReadinessAssessment } from '@/hooks/useContentReadinessAssessment';

export const ContentReadinessPanel = ({
  projectId,
  brandId,
  sourceContent,
  targetMarkets,
  targetLanguages
}) => {
  const { 
    analysis, 
    isLoading, 
    triggerAnalysis, 
    lastAnalyzed 
  } = useContentReadinessAssessment(projectId, brandId, sourceContent, targetMarkets, targetLanguages);

  const getReadinessColor = (level) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getReadinessVariant = (level) => {
    switch (level) {
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Content Readiness Analysis</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered assessment of localization readiness
            </p>
          </div>
        </div>
        <Button 
          onClick={triggerAnalysis}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {analysis ? 'Reanalyze' : 'Analyze'}
        </Button>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-y-4 flex-col">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Analyzing content readiness across {targetMarkets.length} markets and {targetLanguages.length} languages...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <>
          {/* Overall Readiness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Overall Readiness Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Readiness Level</span>
                    <Badge variant={getReadinessVariant(analysis.readinessLevel)} className="capitalize">
                      {analysis.readinessLevel} Readiness
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Score</span>
                    <span className={`font-bold ${getReadinessColor(analysis.readinessLevel)}`}>
                      {analysis.overallScore}%
                    </span>
                  </div>
                  <Progress value={analysis.overallScore} className="h-3" />
                  
                  <div className="text-xs text-muted-foreground">
                    Last analyzed: {lastAnalyzed ? new Date(lastAnalyzed).toLocaleString() : 'Never'}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Readiness Breakdown</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Content Complexity</span>
                      <span className="font-medium">{analysis.contentComplexityScore}%</span>
                    </div>
                    <Progress value={analysis.contentComplexityScore} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cultural Sensitivity</span>
                      <span className="font-medium">{analysis.culturalSensitivityScore}%</span>
                    </div>
                    <Progress value={analysis.culturalSensitivityScore} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Regulatory Complexity</span>
                      <span className="font-medium">{analysis.regulatoryComplexityScore}%</span>
                    </div>
                    <Progress value={analysis.regulatoryComplexityScore} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Technical Readiness</span>
                      <span className="font-medium">{analysis.technicalReadinessScore}%</span>
                    </div>
                    <Progress value={analysis.technicalReadinessScore} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Effort & Cost Estimates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Effort Estimate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Effort</span>
                    <span className="font-semibold">{analysis.effortEstimate?.totalHours || 0} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Per Language</span>
                    <span className="font-medium">{Math.round((analysis.effortEstimate?.totalHours || 0) / targetLanguages.length)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Timeline Impact</span>
                    <span className="font-medium">+{analysis.effortEstimate?.timelineImpactDays || 0} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Cost Estimate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Cost</span>
                    <span className="font-semibold">${analysis.costEstimate?.totalCost?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Per Language</span>
                    <span className="font-medium">${Math.round((analysis.costEstimate?.totalCost || 0) / targetLanguages.length).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Impact</span>
                    <span className="font-medium">+{analysis.costEstimate?.impactPercentage || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risk Factors */}
          {analysis.riskFactors && analysis.riskFactors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{risk}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysis.detailedFactors || {}).map(([factor, details]) => (
                  <div key={factor} className="p-4 border rounded-lg">
                    <h4 className="font-medium capitalize mb-2">{factor.replace(/([A-Z])/g, ' $1').trim()}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {Array.isArray(details) ? (
                        details.map((detail, index) => (
                          <p key={index}>{detail}</p>
                        ))
                      ) : (
                        <p>{String(details)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!analysis && !isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-medium">No Analysis Available</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Analyze" to assess content readiness for localization
                </p>
              </div>
              <Button onClick={triggerAnalysis}>
                <Brain className="h-4 w-4 mr-2" />
                Start Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};