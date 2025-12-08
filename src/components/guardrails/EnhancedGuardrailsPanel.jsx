import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  Target, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  FileText,
  Eye,
  Brain,
  Zap,
  Award,
  Globe,
  Heart
} from 'lucide-react';
import { useEnhancedGuardrails } from '@/hooks/useEnhancedGuardrails';
// Type import removed
// import type { EnhancedContentCompliance } from '@/services/enhancedGuardrailsService';

// Interface and type annotations removed
export const EnhancedGuardrailsPanel = ({
  brandId,
  market = 'US',
  audienceType,
  content,
  showComplianceCheck = true, 
  showCustomization = true,
  className,
  context = {}, // Type annotation removed
  onComplianceUpdate
}) => {
  const {
    brandVision,
    competitiveIntelligence,
    regulatoryFramework,
    audienceSegments,
    marketPositioning,
    isLoading,
    error,
    hasComprehensiveData,
    checkEnhancedCompliance,
    getBrandVoiceGuidelines,
    getCompetitiveDifferentiation,
    getRegulatoryRequirements,
    getAudienceGuidance,
    criticalThreats,
    regulatoryComplexity,
    audienceSegmentCount
  } = useEnhancedGuardrails({ 
    market: context.market,
    audienceType: context.audience_type // Type assertion removed
  });

  const [compliance, setCompliance] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-analyze content when it changes
  useEffect(() => {
    if (content && content.trim().length > 20) {
      analyzeContent();
    } else {
      setCompliance(null);
    }
  }, [content, context]);

  const analyzeContent = async () => {
    if (!content || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const result = await checkEnhancedCompliance(content, context);
      if (result) {
        setCompliance(result);
        onComplianceUpdate?.(result);
      }
    } catch (err) {
      console.error('Error analyzing content:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Type annotation removed
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  // Type annotation removed
  const getScoreIcon = (score) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 75) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enhanced Guardrails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Compliance Dashboard */}
      {compliance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Enhanced Compliance Analysis
              {isAnalyzing && <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>}
            </CardTitle>
            <CardDescription>
              Comprehensive content analysis across all guardrail dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Overall Score */}
              <div className="text-center p-4 bg-background rounded-lg border">
                <div className={`text-3xl font-bold ${getScoreColor(compliance.guideline_adherence)}`}>
                  {compliance.guideline_adherence}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Compliance</div>
                <Progress value={compliance.guideline_adherence} className="mt-2" />
              </div>

              {/* Brand Vision Alignment */}
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                <Heart className="h-8 w-8 text-pink-500" />
                <div>
                  <div className={`font-semibold ${getScoreColor(compliance.brand_vision_alignment)}`}>
                    {compliance.brand_vision_alignment}%
                  </div>
                  <div className="text-sm text-muted-foreground">Brand Vision</div>
                </div>
              </div>

              {/* Competitive Positioning */}
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                <Target className="h-8 w-8 text-blue-500" />
                <div>
                  <div className={`font-semibold ${getScoreColor(compliance.competitive_positioning_score)}`}>
                    {compliance.competitive_positioning_score}%
                  </div>
                  <div className="text-sm text-muted-foreground">Competitive Edge</div>
                </div>
              </div>

              {/* Regulatory Compliance */}
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <div className={`font-semibold ${getScoreColor(compliance.regulatory_compliance_score)}`}>
                    {compliance.regulatory_compliance_score}%
                  </div>
                  <div className="text-sm text-muted-foreground">Regulatory</div>
                </div>
              </div>

              {/* Audience Targeting */}
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                <Users className="h-8 w-8 text-purple-500" />
                <div>
                  <div className={`font-semibold ${getScoreColor(compliance.audience_targeting_score)}`}>
                    {compliance.audience_targeting_score}%
                  </div>
                  <div className="text-sm text-muted-foreground">Audience Fit</div>
                </div>
              </div>

              {/* Market Positioning */}
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                <Globe className="h-8 w-8 text-indigo-500" />
                <div>
                  <div className={`font-semibold ${getScoreColor(compliance.market_positioning_alignment)}`}>
                    {compliance.market_positioning_alignment}%
                  </div>
                  <div className="text-sm text-muted-foreground">Market Position</div>
                </div>
              </div>
            </div>

            {/* Warnings and Suggestions */}
            {(compliance.warnings.length > 0 || compliance.suggestions.length > 0) && (
              <div className="space-y-4">
                {compliance.warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-2">Critical Issues:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {compliance.warnings.map((warning, index) => (
                          <li key={index} className="text-sm">{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {compliance.suggestions.length > 0 && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-2">Optimization Suggestions:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {compliance.suggestions.slice(0, 5).map((suggestion, index) => (
                          <li key={index} className="text-sm">{suggestion}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Comprehensive Guardrails Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Comprehensive Brand Guardrails
          </CardTitle>
          <CardDescription>
            Real-world pharmaceutical intelligence and compliance framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="brand">Brand Vision</TabsTrigger>
              <TabsTrigger value="competitive">Competitive</TabsTrigger>
              <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="positioning">Positioning</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{criticalThreats}</p>
                        <p className="text-sm text-muted-foreground">Critical Threats</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{regulatoryComplexity}</p>
                        <p className="text-sm text-muted-foreground">Required Disclaimers</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{audienceSegmentCount}</p>
                        <p className="text-sm text-muted-foreground">Audience Segments</p>
                      </div>
                      <Users className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {!hasComprehensiveData && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Enhanced guardrails data is being loaded. Basic compliance checking is available.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Brand Vision Tab */}
            <TabsContent value="brand" className="space-y-4">
              {brandVision ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Brand Purpose</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{brandVision.brand_purpose}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Brand Promise</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{brandVision.brand_promise}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {brandVision.core_values && brandVision.core_values.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Core Values</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {brandVision.core_values.map((value, index) => (
                            <Badge key={index} variant="secondary">{value}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {brandVision.positioning_statement && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Positioning Statement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium text-primary">{brandVision.positioning_statement}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Brand vision data not available. Using basic brand guidelines.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Competitive Tab */}
            <TabsContent value="competitive" className="space-y-4">
              {competitiveIntelligence.length > 0 ? (
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {competitiveIntelligence.slice(0, 5).map((competitor) => (
                      <Card key={competitor.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{competitor.competitor_name}</CardTitle>
                            <Badge 
                              variant={competitor.threat_level === 'critical' ? 'destructive' : 
                                     competitor.threat_level === 'high' ? 'default' : 'secondary'}
                            >
                              {competitor.threat_level} threat
                            </Badge>
                          </div>
                          <CardDescription>{competitor.competitor_brand}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Key Differentiators:</h4>
                              <div className="flex flex-wrap gap-2">
                                {competitor.key_differentiators.slice(0, 4).map((diff, index) => (
                                  <Badge key={index} variant="outline">{diff}</Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-sm mb-2">Our Advantages:</h4>
                              <div className="flex flex-wrap gap-2">
                                {competitor.competitive_advantages.slice(0, 3).map((advantage, index) => (
                                  <Badge key={index} variant="secondary" className="text-green-700">
                                    {advantage}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {competitor.market_share_percent && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Market Share:</span>
                                <Badge variant="outline">{competitor.market_share_percent}%</Badge>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Competitive intelligence data not available. Using basic competitor information.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Regulatory Tab */}
            <TabsContent value="regulatory" className="space-y-4">
              {regulatoryFramework ? (
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Regulatory Overview</CardTitle>
                        <CardDescription>
                          {regulatoryFramework.regulatory_body} - {regulatoryFramework.market} Market
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Therapeutic Area:</h4>
                            <Badge variant="outline">{regulatoryFramework.therapeutic_area}</Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Approval Status:</h4>
                            <Badge variant="secondary">{regulatoryFramework.approval_status}</Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Indication:</h4>
                            <p className="text-sm">{regulatoryFramework.indication}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Required Disclaimers
                          <Badge variant="outline" className="text-xs">
                            {regulatoryFramework.required_disclaimers.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {regulatoryFramework.required_disclaimers.map((disclaimer, index) => (
                            <li key={index} className="text-sm p-3 bg-muted rounded-lg border-l-4 border-amber-500">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" />
                                <div className="flex-1">
                                  {typeof disclaimer === 'string' ? (
                                    <span>{disclaimer}</span>
                                  ) : (
                                    <>
                                      {disclaimer.title && <div className="font-semibold mb-1">{disclaimer.title}</div>}
                                      <span>{disclaimer.content || disclaimer.type}</span>
                                      {disclaimer.placement && (
                                        <div className="text-xs text-muted-foreground mt-1">Placement: {disclaimer.placement}</div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Promotional Restrictions
                          <Badge variant="outline" className="text-xs">
                            {regulatoryFramework.promotional_restrictions.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {regulatoryFramework.promotional_restrictions.map((restriction, index) => (
                            <li key={index} className="text-sm p-3 bg-muted rounded-lg border-l-4 border-red-500">
                              <div className="flex items-start gap-2">
                                <Shield className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                                <div className="flex-1">
                                  {typeof restriction === 'string' ? (
                                    <span>{restriction}</span>
                                  ) : (
                                    <>
                                      {restriction.title && <div className="font-semibold mb-1">{restriction.title}</div>}
                                      <span>{restriction.content || restriction.type}</span>
                                      {restriction.required_in && (
                                        <div className="text-xs text-muted-foreground mt-1">Required in: {Array.isArray(restriction.required_in) ? restriction.required_in.join(', ') : restriction.required_in}</div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Regulatory framework data not available for {context.market || 'US'} market.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Audience Tab */}
            <TabsContent value="audience" className="space-y-4">
              {audienceSegments.length > 0 ? (
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {audienceSegments.map((segment) => (
                      <Card key={segment.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{segment.segment_name}</CardTitle>
                            <Badge variant="outline">{segment.segment_type?.toUpperCase() || 'GENERAL'}</Badge>
                          </div>
                        </CardHeader>
                         <CardContent>
                          <div className="space-y-3">
                            {segment.trust_factors?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Trust Factors:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {segment.trust_factors.slice(0, 4).map((factor, index) => (
                                    <Badge key={index} variant="secondary">{factor}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {segment.motivations?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Key Motivations:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {segment.motivations.slice(0, 4).map((motivation, index) => (
                                    <Badge key={index} variant="outline">{motivation}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {segment.barriers_to_engagement?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Engagement Barriers:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {segment.barriers_to_engagement.slice(0, 3).map((barrier, index) => (
                                    <Badge key={index} variant="destructive">{barrier}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Audience segment data not available. Using general targeting guidelines.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Market Positioning Tab */}
            <TabsContent value="positioning" className="space-y-4">
              {marketPositioning ? (
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Market Position</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium text-primary mb-4">
                          {marketPositioning.positioning_statement}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Leadership Claims:</h4>
                            <ul className="space-y-1">
                              {marketPositioning.leadership_claims.map((claim, index) => (
                                <li key={index} className="text-sm flex items-center gap-2">
                                  <Award className="h-3 w-3 text-yellow-500" />
                                  {claim}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-2">Proof Points:</h4>
                            <ul className="space-y-1">
                              {marketPositioning.proof_points.slice(0, 4).map((point, index) => (
                                <li key={index} className="text-sm flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Messaging Hierarchy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {marketPositioning.messaging_hierarchy.map((message, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded">
                              <Badge variant="outline">{index + 1}</Badge>
                              <span className="text-sm font-medium">{message}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Clinical Evidence</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {marketPositioning.clinical_evidence.map((evidence, index) => (
                            <Badge key={index} variant="secondary">{evidence}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Market positioning data not available for {context.market || 'US'} market.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};