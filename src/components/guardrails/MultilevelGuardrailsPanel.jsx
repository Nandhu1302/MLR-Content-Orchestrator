import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Target, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  ChevronDown,
  ChevronRight,
  Edit,
  Plus,
  History
} from 'lucide-react';
import { useMultiLevelGuardrails } from '@/hooks/useMultiLevelGuardrails';
// Type imports removed
// import { GuardrailLevel, EnhancedContentComplianceCheck } from '@/types/multiLevelGuardrails';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Interface and type annotations removed
export const MultiLevelGuardrailsPanel = ({
  campaignId,
  assetId,
  assetType,
  content,
  showComplianceCheck = true,
  showCustomization = true,
  className
}) => {
  const {
    mergedGuardrails,
    campaignGuardrails,
    assetGuardrails,
    complianceHistory,
    isLoading,
    error,
    checkContentCompliance,
    getEffectiveGuardrails,
    getCustomizationSummary,
    latestComplianceCheck
  } = useMultiLevelGuardrails({ campaignId, assetId, assetType });

  const [complianceResult, setComplianceResult] = useState(null);
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set(['brand']));

  const effectiveGuardrails = getEffectiveGuardrails();
  const customizationSummary = getCustomizationSummary();

  const handleComplianceCheck = async () => {
    if (!content) return;
    
    setIsCheckingCompliance(true);
    try {
      const result = await checkContentCompliance(content);
      setComplianceResult(result);
    } catch (err) {
      console.error('Compliance check failed:', err);
    } finally {
      setIsCheckingCompliance(false);
    }
  };

  // Type annotation removed
  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Type annotation removed
  const getLevelIcon = (level) => {
    switch (level) {
      case 'brand': return <Shield className="h-4 w-4" />;
      case 'campaign': return <Target className="h-4 w-4" />;
      case 'asset': return <Settings className="h-4 w-4" />;
    }
  };

  // Type annotation removed
  const getComplianceColor = (score) => {
    if (!score) return 'muted';
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Multi-Level Guardrails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Guardrails Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!mergedGuardrails) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Guardrails Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No guardrails configuration found. Please ensure brand guidelines are set up.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Asset Guardrails
            </CardTitle>
            <CardDescription>
              {customizationSummary?.hasCustomizations
                ? `${customizationSummary.customizationCount} level(s) of customization active`
                : 'Using brand-level guidelines'
              }
            </CardDescription>
          </div>
          {showCustomization && (
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Guardrails
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="guidelines" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="guidelines" className="space-y-4">
            {/* Inheritance Chain */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Active Guardrails Chain</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {mergedGuardrails.inheritance_chain.map((level, index) => (
                  <React.Fragment key={level.id}>
                    <div className="flex items-center gap-1">
                      {getLevelIcon(level.level)}
                      <span>{level.name}</span>
                      {level.has_customizations && (
                        <Badge variant="secondary" className="text-xs">
                          Custom
                        </Badge>
                      )}
                    </div>
                    {index < mergedGuardrails.inheritance_chain.length - 1 && (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <Separator />

            {/* Effective Guidelines */}
            <div className="space-y-4">
              {/* Key Messages */}
              <Collapsible
                open={expandedSections.has('messages')}
                onOpenChange={() => toggleSection('messages')}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Key Messages</h4>
                      <Badge variant="outline">
                        {effectiveGuardrails?.keyMessages.length || 0}
                      </Badge>
                    </div>
                    {expandedSections.has('messages') ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-2">
                  {effectiveGuardrails?.keyMessages.map((message, index) => (
                    <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                      {message}
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Tone Guidelines */}
              <Collapsible
                open={expandedSections.has('tone')}
                onOpenChange={() => toggleSection('tone')}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h4 className="font-medium">Tone Guidelines</h4>
                    {expandedSections.has('tone') ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Primary:</span>
                      <div className="text-muted-foreground">
                        {effectiveGuardrails?.toneGuidelines.primary}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Secondary:</span>
                      <div className="text-muted-foreground">
                        {effectiveGuardrails?.toneGuidelines.secondary}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Descriptors:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {effectiveGuardrails?.toneGuidelines.descriptors.map((descriptor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {descriptor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Format Constraints (if asset-level) */}
              {effectiveGuardrails?.formatConstraints && (
                <Collapsible
                  open={expandedSections.has('format')}
                  onOpenChange={() => toggleSection('format')}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                      <h4 className="font-medium">Format Constraints</h4>
                      {expandedSections.has('format') ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    {effectiveGuardrails.formatConstraints.character_limits && (
                      <div>
                        <span className="font-medium text-sm">Character Limits:</span>
                        <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                          {Object.entries(effectiveGuardrails.formatConstraints.character_limits).map(([field, limit]) => (
                            <div key={field} className="flex justify-between">
                              <span className="capitalize">{field}:</span>
                              <span>{limit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            {showComplianceCheck && content && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Content Compliance Check</h4>
                  <Button 
                    onClick={handleComplianceCheck} 
                    disabled={isCheckingCompliance}
                    size="sm"
                  >
                    {isCheckingCompliance ? 'Checking...' : 'Check Compliance'}
                  </Button>
                </div>

                {complianceResult && (
                  <div className="space-y-4">
                    {/* Overall Score */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium">Overall Compliance Score</h5>
                          {/* Type assertion removed */}
                          <Badge variant={getComplianceColor(complianceResult.overall_score)}>
                            {complianceResult.overall_score}%
                          </Badge>
                        </div>
                        <Progress value={complianceResult.overall_score} className="h-2" />
                      </div>
                    </div>

                    {/* Level-specific scores */}
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span className="font-medium">Brand Compliance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={complianceResult.brand_compliance.score} 
                            className="w-20 h-2" 
                          />
                          {/* Type assertion removed */}
                          <Badge variant={getComplianceColor(complianceResult.brand_compliance.score)}>
                            {complianceResult.brand_compliance.score}%
                          </Badge>
                        </div>
                      </div>

                      {complianceResult.campaign_compliance && (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span className="font-medium">Campaign Compliance</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={complianceResult.campaign_compliance.score} 
                              className="w-20 h-2" 
                            />
                            {/* Type assertion removed */}
                            <Badge variant={getComplianceColor(complianceResult.campaign_compliance.score)}>
                              {complianceResult.campaign_compliance.score}%
                            </Badge>
                          </div>
                        </div>
                      )}

                      {complianceResult.asset_compliance && (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            <span className="font-medium">Asset Compliance</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={complianceResult.asset_compliance.score} 
                              className="w-20 h-2" 
                            />
                            {/* Type assertion removed */}
                            <Badge variant={getComplianceColor(complianceResult.asset_compliance.score)}>
                              {complianceResult.asset_compliance.score}%
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recommended Actions */}
                    {complianceResult.recommended_actions.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Recommended Actions</h5>
                        <div className="space-y-2">
                          {complianceResult.recommended_actions.slice(0, 3).map((action, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded text-sm">
                              <Badge variant="outline" className="text-xs shrink-0">
                                {action.priority}
                              </Badge>
                              <span>{action.action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Performance Prediction */}
                    {complianceResult.performance_prediction && (
                      <div className="p-3 bg-muted/50 rounded">
                        <h5 className="font-medium mb-2">MLR Approval Prediction</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Approval Likelihood:</span>
                            <div className="font-medium">
                              {complianceResult.performance_prediction.mlr_approval_likelihood}%
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected Review Cycles:</span>
                            <div className="font-medium">
                              {complianceResult.performance_prediction.estimated_review_cycles}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <h4 className="font-medium">Compliance History</h4>
            </div>
            
            {complianceHistory.length > 0 ? (
              <div className="space-y-2">
                {complianceHistory.slice(0, 5).map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        {new Date(entry.checked_at).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Version {entry.guardrails_version || 'N/A'}
                      </div>
                    </div>
                    {/* Type assertion removed */}
                    <Badge variant={getComplianceColor(entry.overall_compliance_score || 0)}>
                      {entry.overall_compliance_score || 0}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No compliance checks performed yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};