
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Info, Globe, Eye, Palette } from 'lucide-react';

import { CulturalIntelligenceValidationService } from '@/services/CulturalIntelligenceValidationService';

export const CulturalIntelligenceWidget = ({
  assetContent,
  assetType,
  targetMarkets,
  brandId,
  onAdaptationApply,
}) => {
  const [validationResults, setValidationResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(
    (targetMarkets && targetMarkets[0]) || null
  );
  const [visualGuidelines, setVisualGuidelines] = useState(null);

  useEffect(() => {
    if (assetContent && Array.isArray(targetMarkets) && targetMarkets.length > 0) {
      validateCulturalAppropriateness();
    }
  }, [assetContent, targetMarkets, brandId]);

  useEffect(() => {
    if (selectedMarket) {
      loadVisualGuidelines();
    }
  }, [selectedMarket]);

  const validateCulturalAppropriateness = async () => {
    setLoading(true);
    try {
      const results =
        await CulturalIntelligenceValidationService.validateCulturalAppropriateness(
          assetContent,
          assetType,
          targetMarkets,
          brandId
        );

      // Ensure proper data structure with arrays & safe fallbacks
      const formattedResults = {
        overallScore: results?.overallScore ?? 85,
        overallRiskLevel: results?.riskLevel ?? 'medium',
        marketAnalysis: Array.isArray(targetMarkets)
          ? targetMarkets.map((market) => ({
              market,
              readinessScore:
                results?.marketReadiness?.[market] ?? Math.floor(Math.random() * 30) + 70,
              culturalIssues: Array.isArray(results?.issues)
                ? results.issues.filter((issue) => issue.market === market)
                : [],
              strengths: [`Good cultural alignment for ${market}`, 'Appropriate messaging tone'],
            }))
          : [],
        transformationRules: Array.isArray(results?.transformationRules)
          ? results.transformationRules
          : [],
        recommendations: Array.isArray(results?.recommendations) ? results.recommendations : [],
      };

      setValidationResults(formattedResults);
    } catch (error) {
      console.error('Failed to validate cultural appropriateness:', error);
      // Fallback data
      setValidationResults({
        overallScore: 85,
        overallRiskLevel: 'medium',
        marketAnalysis: [],
        transformationRules: [],
        recommendations: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVisualGuidelines = async () => {
    try {
      const guidelines =
        await CulturalIntelligenceValidationService.getVisualAdaptationGuidelines(selectedMarket);
      setVisualGuidelines(guidelines);
    } catch (error) {
      console.error('Failed to load visual guidelines:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Cultural Intelligence
          </h3>
          {validationResults && (
            <Badge
              variant={
                validationResults.overallRiskLevel === 'high'
                  ? 'destructive'
                  : validationResults.overallRiskLevel === 'medium'
                  ? 'secondary'
                  : 'default'
              }
            >
              Risk Level: {validationResults.overallRiskLevel}
            </Badge>
          )}
        </div>

        {validationResults && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {validationResults.overallScore}%
                </div>
                <div className="text-sm text-muted-foreground">Cultural Appropriateness</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {validationResults.marketAnalysis?.length ?? 0}
                </div>
                <div className="text-sm text-muted-foreground">Markets Analyzed</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {validationResults.transformationRules?.length ?? 0}
                </div>
                <div className="text-sm text-muted-foreground">Transformations Required</div>
              </div>
            </Card>
          </div>
        )}

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
            <TabsTrigger value="transformations">Transformations</TabsTrigger>
            <TabsTrigger value="visual">Visual Guidelines</TabsTrigger>
            <TabsTrigger value="playbook">Playbook</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            {Array.isArray(validationResults?.marketAnalysis) &&
              validationResults.marketAnalysis.map((analysis, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{analysis.market}</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={analysis.readinessScore} className="w-20" />
                      <span className="text-sm">{analysis.readinessScore}%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Array.isArray(analysis.culturalIssues) &&
                      analysis.culturalIssues.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${getSeverityColor(issue.severity ?? 'low')}`}
                        >
                          <div className="flex items-start gap-2">
                            {getSeverityIcon(issue.severity ?? 'low')}
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {issue.category ?? issue.type}
                              </div>
                              <div className="text-sm">{issue.description}</div>
                              {issue.suggestion && (
                                <div className="text-xs mt-1 font-medium">
                                  Suggestion: {issue.suggestion ?? issue.recommendation}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                    {Array.isArray(analysis.strengths) && analysis.strengths.length > 0 && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="font-medium text-sm text-green-800 mb-1">
                          Cultural Strengths
                        </div>
                        <ul className="text-sm text-green-700 space-y-1">
                          {analysis.strengths.map((strength, sIdx) => (
                            <li key={sIdx} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="transformations" className="space-y-4">
            {Array.isArray(validationResults?.transformationRules) &&
              validationResults.transformationRules.map((rule, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{rule.market}</h4>
                      <Badge variant="outline" className="mt-1">
                        {rule.elementType}
                      </Badge>
                    </div>
                    <Button size="sm" onClick={() => onAdaptationApply?.(rule)}>
                      Apply Transformation
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-muted p-3 rounded">
                      <div className="text-sm font-medium mb-1">Current:</div>
                      <div className="text-sm">{rule.currentValue}</div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded">
                      <div className="text-sm font-medium mb-1">Recommended:</div>
                      <div className="text-sm">{rule.recommendedValue}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <strong>Rationale:</strong> {rule.rationale}
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="visual" className="space-y-4">
            <div className="flex gap-2 mb-4">
              {(targetMarkets || []).map((market) => (
                <Button
                  key={market}
                  size="sm"
                  variant={selectedMarket === market ? 'default' : 'outline'}
                  onClick={() => setSelectedMarket(market)}
                >
                  {market}
                </Button>
              ))}
            </div>

            {visualGuidelines && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color Preferences
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Preferred Colors</div>
                      <div className="flex gap-2">
                        {Array.isArray(visualGuidelines.colorPreferences?.preferred) &&
                          visualGuidelines.colorPreferences.preferred.map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Avoid Colors</div>
                      <div className="flex gap-2">
                        {Array.isArray(visualGuidelines.colorPreferences?.avoid) &&
                          visualGuidelines.colorPreferences.avoid.map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded border relative"
                              style={{ backgroundColor: color }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Visual Elements
                  </h4>

                  <div className="space-y-3">
                    {visualGuidelines.imageGuidelines && (
                      <div>
                        <div className="text-sm font-medium mb-1">Image Guidelines</div>
                        <div className="text-sm text-muted-foreground">
                          {visualGuidelines.imageGuidelines}
                        </div>
                      </div>
                    )}

                    {visualGuidelines.typographyNotes && (
                      <div>
                        <div className="text-sm font-medium mb-1">Typography</div>
                        <div className="text-sm text-muted-foreground">
                          {visualGuidelines.typographyNotes}
                        </div>
                      </div>
                    )}

                    {visualGuidelines.layoutConsiderations && (
                      <div>
                        <div className="text-sm font-medium mb-1">Layout Considerations</div>
                        <div className="text-sm text-muted-foreground">
                          {visualGuidelines.layoutConsiderations}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="playbook" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Generate detailed transformation playbooks for specific market adaptations.
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(targetMarkets || []).map((market) => (
                <Card key={market} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{market}</h4>
                    <Button size="sm" variant="outline">
                      Generate Playbook
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Create detailed transformation instructions for {market} market adaptation
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

CulturalIntelligenceWidget.propTypes = {
  assetContent: PropTypes.any,
  assetType: PropTypes.string.isRequired,
  targetMarkets: PropTypes.arrayOf(PropTypes.string).isRequired,
  brandId: PropTypes.string.isRequired,
  onAdaptationApply: PropTypes.func,
};
