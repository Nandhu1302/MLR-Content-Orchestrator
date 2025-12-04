
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { TrendingUp, AlertTriangle, Target, Users, BarChart3, Lightbulb } from 'lucide-react';

import { AssetQualityPredictionService } from '@/services/AssetQualityPredictionService';

export const PredictiveQualityDashboard = ({
  assetId,
  localizationContext,
  targetMarkets,
  onReviewerAssign,
  onQualityAction,
}) => {
  const [qualityPrediction, setQualityPrediction] = useState(null);
  const [brandConsistency, setBrandConsistency] = useState(null);
  const [qualityIssues, setQualityIssues] = useState(null);
  const [reviewerAssignments, setReviewerAssignments] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assetId && localizationContext) {
      loadQualityIntelligence();
    }
  }, [assetId, localizationContext, targetMarkets]);

  const loadQualityIntelligence = async () => {
    setLoading(true);
    try {
      const [prediction, consistency, issues, reviewers] = await Promise.all([
        AssetQualityPredictionService.generateQualityPrediction(
          assetId,
          targetMarkets,
          'default-brand',
          localizationContext
        ),
        AssetQualityPredictionService.analyzeBrandConsistency(assetId, 'default-brand'),
        AssetQualityPredictionService.predictQualityIssues(
          localizationContext?.content || '',
          localizationContext?.assetType || 'general',
          targetMarkets,
          localizationContext?.therapeuticArea || 'general'
        ),
        Promise.resolve([]), // placeholder for reviewers list
      ]);

      setQualityPrediction(prediction);
      setBrandConsistency(consistency);
      setQualityIssues(issues);
      setReviewerAssignments(reviewers);

      // Generate reviewer assignments based on quality prediction
      const assignments = await AssetQualityPredictionService.generateReviewerAssignments(
        prediction,
        [] // Mock reviewers – in real implementation, provide actual reviewers
      );
      setReviewerAssignments(assignments);
    } catch (error) {
      console.error('Failed to load quality intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQualityColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Predictive Quality Intelligence
          </h3>
          {qualityPrediction && (
            <Badge
              variant={
                qualityPrediction.overallQualityScore >= 80
                  ? 'default'
                  : qualityPrediction.overallQualityScore >= 60
                  ? 'secondary'
                  : 'destructive'
              }
            >
              Predicted Quality: {qualityPrediction.overallQualityScore}%
            </Badge>
          )}
        </div>

        {/* Summary cards */}
        {qualityPrediction && (
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getQualityColor(qualityPrediction.overallQualityScore).split(' ')[0]}`}
                >
                  {qualityPrediction.overallQualityScore}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Quality</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {qualityPrediction.confidenceLevel}%
                </div>
                <div className="text-sm text-muted-foreground">Confidence Level</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {qualityIssues?.overallRiskScore || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {brandConsistency?.overallScore || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Brand Consistency</div>
              </div>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="prediction" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="prediction">Quality Prediction</TabsTrigger>
            <TabsTrigger value="issues">Risk Assessment</TabsTrigger>
            <TabsTrigger value="brand">Brand Consistency</TabsTrigger>
            <TabsTrigger value="reviewers">Reviewer Assignment</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          {/* Prediction tab */}
          <TabsContent value="prediction" className="space-y-4">
            {qualityPrediction?.marketPredictions?.map((market, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">{market.market}</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={market.qualityScore} className="w-24" />
                    <span className="text-sm">{market.qualityScore}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Prediction Factors</div>
                    <div className="space-y-2">
                      {Object.entries(market.factors || {}).map(([factor, score]) => (
                        <div key={factor} className="flex items-center justify-between text-sm">
                          <span className="capitalize">
                            {factor.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className="flex items-center gap-2">
                            <Progress value={score} className="w-16 h-2" />
                            <span className="text-xs w-8">{score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Key Insights</div>
                    <div className="space-y-2">
                      {market.insights?.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Lightbulb className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {market.recommendations && (
                  <Alert className="mt-4">
                    <Target className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-2">Quality Optimization Recommendations:</div>
                      <ul className="space-y-1">
                        {market.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm">• {rec}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </Card>
            ))}
          </TabsContent>

          {/* Risk Assessment tab */}
          <TabsContent value="issues" className="space-y-4">
            {qualityIssues?.predictedIssues?.map((category, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium capitalize">{category.category}</h4>
                  <Badge
                    variant={
                      category.riskLevel === 'high'
                        ? 'destructive'
                        : category.riskLevel === 'medium'
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {category.riskLevel} Risk
                  </Badge>
                </div>

                <div className="space-y-3">
                  {category.issues?.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${getRiskColor(issue.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{issue.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Likelihood: {issue.likelihood}% &nbsp;|&nbsp; Impact: {issue.impact}
                          </div>
                          {issue.mitigation && (
                            <div className="text-xs mt-2 bg-muted p-2 rounded">
                              <strong>Mitigation:</strong> {issue.mitigation}
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onQualityAction?.({
                              type: 'preventIssue',
                              issue,
                              category: category.category,
                            })
                          }
                        >
                          Prevent
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            {qualityIssues?.recommendedActions && (
              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Recommended Actions
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {qualityIssues.recommendedActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer"
                      onClick={() => onQualityAction?.({ type: 'performAction', action })}
                    >
                      <span className="text-sm">{action}</span>
                      <Button size="sm" variant="ghost">Execute</Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Brand Consistency tab */}
          <TabsContent value="brand" className="space-y-4">
            {brandConsistency && (
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Brand Alignment Analysis</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={brandConsistency.overallScore} className="w-24" />
                      <span className="text-sm">{brandConsistency.overallScore}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(brandConsistency.categoryScores || {}).map(([category, score]) => (
                      <div key={category} className="text-center">
                        <div className={`text-lg font-semibold ${getQualityColor(score).split(' ')[0]}`}>
                          {score}%
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {brandConsistency.deviations && brandConsistency.deviations.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Brand Consistency Issues</h4>
                    <div className="space-y-3">
                      {brandConsistency.deviations.map((deviation, index) => (
                        <div
                          key={index}
                          className="p-3 bg-yellow-50 border border-yellow-200 rounded"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium text-sm">{deviation.element}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {deviation.issue}
                              </div>
                              <div className="text-xs mt-2">
                                <strong>Expected:</strong> {deviation.expected}
                              </div>
                              <div className="text-xs">
                                <strong>Found:</strong> {deviation.actual}
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onQualityAction?.({
                                  type: 'fixBrandConsistency',
                                  deviation,
                                })
                              }
                            >
                              Fix
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Reviewer Assignment tab */}
          <TabsContent value="reviewers" className="space-y-4">
            {reviewerAssignments?.assignments?.map((assignment, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{assignment.reviewerName}</h4>
                      <div className="text-sm text-muted-foreground">
                        {assignment.expertise.join(', ')}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{assignment.priority} Priority</Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Assigned Markets:</strong> {assignment.assignedMarkets.join(', ')}
                  </div>
                  <div className="text-sm">
                    <strong>Focus Areas:</strong> {assignment.focusAreas.join(', ')}
                  </div>
                  <div className="text-sm">
                    <strong>Confidence Match:</strong> {assignment.confidenceScore}%
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <Button size="sm" onClick={() => onReviewerAssign?.(assignment)}>
                    Assign Reviewer
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Optimization tab */}
          <TabsContent value="optimization" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3">Quality Optimization Recommendations</h4>
              <div className="space-y-3">
                {qualityPrediction?.optimizationRecommendations?.map((rec, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => onQualityAction?.({ type: 'optimize', recommendation: rec })}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{rec.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{rec.description}</div>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span>Impact: <strong>{rec.impact}</strong></span>
                          <span>Effort: <strong>{rec.effort}</strong></span>
                          <span>Timeline: <strong>{rec.timeline}</strong></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">+{rec.qualityImprovement}%</div>
                        <div className="text-xs text-muted-foreground">Quality Boost</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

PredictiveQualityDashboard.propTypes = {
  assetId: PropTypes.string.isRequired,
  localizationContext: PropTypes.object.isRequired,
  targetMarkets: PropTypes.arrayOf(PropTypes.string).isRequired,
  onReviewerAssign: PropTypes.func,
  onQualityAction: PropTypes.func,
};
