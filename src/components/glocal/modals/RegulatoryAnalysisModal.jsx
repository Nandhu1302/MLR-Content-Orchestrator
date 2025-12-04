import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle, Info, Shield, FileCheck, BookOpen, AlertTriangle, XCircle, FileWarning, Flag, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DecisionReasonModal } from './DecisionReasonModal';

export const RegulatoryAnalysisModal = ({
  isOpen,
  onClose,
  segmentName,
  analysisData,
  onRegulatoryAction,
  onMarkAsCompliant,
  onReAnalyze,
  isAnalyzing = false,
  isApproved = false,
  targetMarkets = [],
  ruleActions = []
}) => {
  const { toast } = useToast();
  const [selectedMarket, setSelectedMarket] = useState(targetMarkets[0] || '');
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getRuleStatus = (rule) => {
    return ruleActions.find(a => a.ruleId === rule.ruleName);
  };

  const getStatusBadge = (action) => {
    if (!action) return null;
    
    switch (action.action) {
      case 'accepted':
        return <Badge className="bg-green-600 ml-2">Applied</Badge>;
      case 'mlr_exception':
        return <Badge className="bg-amber-600 ml-2">Pending MLR</Badge>;
      case 'blocking':
        return <Badge variant="destructive" className="ml-2">Blocking</Badge>;
      case 'deferred':
        return <Badge className="bg-blue-600 ml-2">Deferred to MLR</Badge>;
      case 'risk_accepted':
        return <Badge className="bg-orange-600 ml-2">Risk Accepted</Badge>;
      case 'acknowledged':
        return <Badge variant="outline" className="ml-2">Acknowledged</Badge>;
      default:
        return null;
    }
  };

  const handleAcceptChange = (rule) => {
    onRegulatoryAction({
      type: 'accept',
      rule
    });
    toast({
      title: 'Changes Applied',
      description: 'Regulatory changes have been applied to the segment',
    });
  };

  const handleRequestException = (rule) => {
    setPendingAction({ type: 'mlr_exception', rule });
    setReasonModalOpen(true);
  };

  const handleMarkBlocking = (rule) => {
    onRegulatoryAction({
      type: 'blocking',
      rule,
      reasoning: 'Marked as blocking - must be resolved before approval'
    });
    toast({
      title: 'Marked as Blocking',
      description: 'This issue must be resolved before content approval',
      variant: 'destructive'
    });
  };

  const handleDeferToMLR = (rule) => {
    setPendingAction({ type: 'defer_to_mlr', rule });
    setReasonModalOpen(true);
  };

  const handleAcceptRisk = (rule) => {
    setPendingAction({ type: 'accept_risk', rule });
    setReasonModalOpen(true);
  };

  const handleAcknowledge = (rule) => {
    onRegulatoryAction({
      type: 'acknowledge',
      rule
    });
    toast({
      title: 'Acknowledged',
      description: 'Restriction has been acknowledged',
    });
  };

  const handleReasonSubmit = (reason) => {
    if (pendingAction) {
      onRegulatoryAction({
        type: pendingAction.type,
        rule: pendingAction.rule,
        reasoning: reason
      });
      
      const messages = {
        mlr_exception: 'MLR Exception Requested',
        accept_risk: 'Risk Accepted',
        defer_to_mlr: 'Deferred to MLR Review'
      };
      
      toast({
        title: messages[pendingAction.type],
        description: 'Your decision has been logged with reasoning',
      });
      
      setPendingAction(null);
    }
  };

  const handleInsertPreApproved = (content) => {
    onRegulatoryAction({
      type: 'accept',
      rule: {
        market: content.market,
        therapeuticArea: content.therapeuticArea || '',
        ruleCategory: 'PRE_APPROVED',
        ruleId: `pre-approved-${Date.now()}`,
        ruleName: `Pre-Approved: ${content.contentType}`,
        changeRequirement: 'MUST_CHANGE',
        description: content.approvedContent,
        rationale: `MLR#: ${content.mlrNumber || 'N/A'}`,
        riskLevel: 'low',
        validationMethod: 'expert_review',
        preApprovedContent: [content.approvedContent]
      }
    });
    toast({
      title: 'Pre-Approved Content Inserted',
      description: `${content.contentType} content added to segment`,
    });
  };

  const handleApplyTemplate = (template) => {
    onRegulatoryAction({
      type: 'accept',
      rule: {
        market: '',
        therapeuticArea: '',
        ruleCategory: 'TEMPLATE',
        ruleId: `template-${Date.now()}`,
        ruleName: template.templateName,
        changeRequirement: 'MUST_CHANGE',
        description: template.description,
        rationale: template.usageGuidelines,
        riskLevel: 'low',
        validationMethod: 'automated',
        templateContent: template.templateContent
      }
    });
    toast({
      title: 'Template Applied',
      description: template.templateName,
    });
  };

  if (!analysisData && !isAnalyzing) {
    return null;
  }

  // Client-side deduplication as final safeguard
  const deduplicateRules = (rules) => {
    const seen = new Map();
    
    rules.forEach(rule => {
      const key = rule.description?.toLowerCase().trim() || rule.ruleName?.toLowerCase().trim() || '';
      if (!seen.has(key)) {
        seen.set(key, rule);
      } else {
        // Merge rationales if duplicate
        const existing = seen.get(key);
        if (rule.rationale && existing.rationale !== rule.rationale) {
          existing.rationale = `${existing.rationale}; ${rule.rationale}`;
        }
      }
    });
    
    return Array.from(seen.values());
  };

  // Apply deduplication to all rule sets
  const deduplicatedAnalysisData = analysisData ? {
    ...analysisData,
    mustChangeRules: deduplicateRules(analysisData.mustChangeRules || []),
    cannotChangeRules: deduplicateRules(analysisData.cannotChangeRules || []),
    shouldChangeRules: deduplicateRules(analysisData.shouldChangeRules || [])
  } : null;

  const criticalIssuesCount = deduplicatedAnalysisData?.mustChangeRules?.length || 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-full sm:max-w-2xl lg:max-w-3xl flex flex-col p-0"
      >
        <SheetHeader className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5" />
              Regulatory Compliance Analysis - {segmentName}
            </SheetTitle>
            <div className="flex items-center gap-2">
              {analysisData && getRiskBadge(analysisData.riskLevel)}
              {analysisData && (
                <Badge variant="outline">
                  Score: {analysisData.overallScore}%
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-6">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Analyzing regulatory compliance...</p>
            </div>
          ) : analysisData ? (
            <Tabs defaultValue="issues" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="issues">
                  Compliance Issues
                  {criticalIssuesCount > 0 && (
                    <Badge variant="destructive" className="ml-2">{criticalIssuesCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="library">Pre-Approved Content</TabsTrigger>
                <TabsTrigger value="templates">Regulatory Templates</TabsTrigger>
              </TabsList>

              {/* Tab 1: Compliance Issues */}
              <TabsContent value="issues" className="space-y-4">
                {/* Overall Score Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Overall Compliance Score</p>
                        <p className={`text-4xl font-bold ${getScoreColor(analysisData.overallScore)}`}>
                          {analysisData.overallScore}/100
                        </p>
                      </div>
                      <div className="text-right">
                        {getRiskIcon(analysisData.riskLevel)}
                        <p className="text-sm text-muted-foreground mt-1">
                          Risk Level: {analysisData.riskLevel.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* MUST_CHANGE Rules (Critical) */}
                {deduplicatedAnalysisData && deduplicatedAnalysisData.mustChangeRules.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h3 className="text-lg font-semibold">Critical Issues - Must Change</h3>
                      <Badge variant="destructive">{deduplicatedAnalysisData.mustChangeRules.length}</Badge>
                    </div>
                    {deduplicatedAnalysisData.mustChangeRules.map((rule, idx) => {
                      const status = getRuleStatus(rule);
                      return (
                      <Alert key={idx} variant="destructive" className="border-red-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="font-semibold flex items-center">
                          {rule.ruleName}
                          {getStatusBadge(status)}
                        </AlertTitle>
                        <AlertDescription className="space-y-2">
                          {rule.description !== rule.ruleName && <p>{rule.description}</p>}
                          {rule.rationale && <p className="text-xs text-muted-foreground italic">{rule.rationale}</p>}
                          
                          {status && status.reasoning && (
                            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                              <p className="text-xs font-semibold text-amber-900 mb-1">Decision Reasoning:</p>
                              <p className="text-xs text-amber-800">{status.reasoning}</p>
                            </div>
                          )}
                          
                          {rule.preApprovedContent && rule.preApprovedContent.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-semibold">Pre-Approved Alternatives:</p>
                              {rule.preApprovedContent.map((content, cIdx) => (
                                <div key={cIdx} className="bg-green-50 p-2 rounded border border-green-200">
                                  <p className="text-sm">{content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {rule.exampleTransformation && (
                            <div className="mt-3 space-y-1">
                              <p className="text-xs font-semibold">Example Transformation:</p>
                              <div className="bg-red-50 p-2 rounded border border-red-200">
                                <p className="text-xs line-through text-red-600">{rule.exampleTransformation.before}</p>
                              </div>
                              <div className="bg-green-50 p-2 rounded border border-green-200">
                                <p className="text-xs text-green-600">{rule.exampleTransformation.after}</p>
                              </div>
                            </div>
                          )}

                          {!status && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Button 
                                size="sm" 
                                onClick={() => handleAcceptChange(rule)}
                                disabled={!rule.preApprovedContent && !rule.templateContent}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accept & Apply Changes
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRequestException(rule)}
                                className="border-amber-600 text-amber-600 hover:bg-amber-50"
                              >
                                <FileWarning className="h-3 w-3 mr-1" />
                                Request MLR Exception
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleMarkBlocking(rule)}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Mark as Blocking
                              </Button>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                      );
                    })}
                  </div>
                )}

                {/* CANNOT_CHANGE Rules (Locked Elements) */}
                {deduplicatedAnalysisData && deduplicatedAnalysisData.cannotChangeRules.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Protected Elements - Cannot Change</h3>
                      <Badge variant="secondary">{deduplicatedAnalysisData.cannotChangeRules.length}</Badge>
                    </div>
                    {deduplicatedAnalysisData.cannotChangeRules.map((rule, idx) => {
                      const status = getRuleStatus(rule);
                      return (
                      <Alert key={idx} className="border-blue-300 bg-blue-50">
                        <Info className="h-4 w-4" />
                        <AlertTitle className="flex items-center">
                          {rule.ruleName}
                          {getStatusBadge(status)}
                        </AlertTitle>
                        <AlertDescription>
                          {rule.description !== rule.ruleName && <p>{rule.description}</p>}
                          {rule.rationale && <p className="text-xs text-muted-foreground mt-1 italic">{rule.rationale}</p>}
                          {rule.restrictedTerms && rule.restrictedTerms.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold">Protected Terms:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {rule.restrictedTerms.map((term, tIdx) => (
                                  <Badge key={tIdx} variant="outline" className="text-xs">
                                    {term}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {!status && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-3"
                              onClick={() => handleAcknowledge(rule)}
                            >
                              <CheckSquare className="h-3 w-3 mr-1" />
                              Acknowledge
                            </Button>
                          )}
                        </AlertDescription>
                      </Alert>
                      );
                    })}
                  </div>
                )}

                {/* SHOULD_CHANGE Rules (Recommendations) */}
                {deduplicatedAnalysisData && deduplicatedAnalysisData.shouldChangeRules.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-yellow-600" />
                      <h3 className="text-lg font-semibold">Recommended Changes</h3>
                      <Badge variant="outline">{deduplicatedAnalysisData.shouldChangeRules.length}</Badge>
                    </div>
                    {deduplicatedAnalysisData.shouldChangeRules.map((rule, idx) => {
                      const status = getRuleStatus(rule);
                      return (
                      <Alert key={idx} className="border-yellow-300 bg-yellow-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="flex items-center">
                          {rule.ruleName}
                          {getStatusBadge(status)}
                        </AlertTitle>
                        <AlertDescription className="space-y-2">
                          {rule.description !== rule.ruleName && <p>{rule.description}</p>}
                          {rule.rationale && <p className="text-xs text-muted-foreground italic">{rule.rationale}</p>}
                          
                          {status && status.reasoning && (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                              <p className="text-xs font-semibold text-blue-900 mb-1">Decision Reasoning:</p>
                              <p className="text-xs text-blue-800">{status.reasoning}</p>
                            </div>
                          )}
                          
                          {!status && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAcceptChange(rule)}
                                disabled={!rule.preApprovedContent && !rule.templateContent}
                                className="border-green-600 text-green-600 hover:bg-green-50"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accept Recommendation
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeferToMLR(rule)}
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                              >
                                <Flag className="h-3 w-3 mr-1" />
                                Defer to MLR Review
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAcceptRisk(rule)}
                              >
                                Accept Risk & Skip
                              </Button>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                      );
                    })}
                  </div>
                )}

                {/* Automated Validations */}
                {deduplicatedAnalysisData && deduplicatedAnalysisData.automatedValidations.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      Automated Validation Results
                    </h3>
                    {deduplicatedAnalysisData.automatedValidations.map((validation, idx) => (
                      <Alert 
                        key={idx}
                        variant={validation.status === 'pass' ? 'default' : 'destructive'}
                      >
                        {validation.status === 'pass' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : validation.status === 'fail' ? (
                          <XCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <AlertTitle>{validation.rule}</AlertTitle>
                        <AlertDescription>{validation.details}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Pre-Approved Content Library */}
              <TabsContent value="library" className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Pre-Approved Content Library
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Click any item to insert pre-approved content into your segment
                  </p>

                  {targetMarkets.length > 1 && (
                    <Tabs value={selectedMarket} onValueChange={setSelectedMarket}>
                      <TabsList>
                        {targetMarkets.map(market => (
                          <TabsTrigger key={market} value={market}>
                            {market}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  )}

                  {deduplicatedAnalysisData && deduplicatedAnalysisData.preApprovedContent && deduplicatedAnalysisData.preApprovedContent.length > 0 ? (
                    <div className="space-y-2">
                      {deduplicatedAnalysisData.preApprovedContent
                        .filter(item => !selectedMarket || item.market === selectedMarket)
                        .map((item, idx) => (
                          <Card 
                            key={idx}
                            className="cursor-pointer bg-green-50 border-green-200 hover:bg-green-100 transition-colors"
                            onClick={() => handleInsertPreApproved(item)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className="bg-green-600">{item.contentType}</Badge>
                                    <Badge variant="outline">{item.category}</Badge>
                                  </div>
                                  <p className="text-sm font-medium mb-1">{item.approvedContent}</p>
                                  <p className="text-xs text-muted-foreground">{item.usageGuidelines}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-muted-foreground">
                                      MLR#: {item.mlrNumber || 'N/A'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      Approved: {new Date(item.approvalDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>No Pre-Approved Content</AlertTitle>
                      <AlertDescription>
                        No pre-approved content available for this market and therapeutic area.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              {/* Tab 3: Regulatory Templates */}
              <TabsContent value="templates" className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Regulatory Templates
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select a template to quickly insert compliant content structures
                  </p>

                  {deduplicatedAnalysisData && deduplicatedAnalysisData.regulatoryTemplates && deduplicatedAnalysisData.regulatoryTemplates.length > 0 ? (
                    <div className="space-y-3">
                      {deduplicatedAnalysisData.regulatoryTemplates.map((template, idx) => (
                        <Card key={idx}>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">{template.templateName}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                            <div className="bg-muted p-3 rounded text-xs mb-3">
                              <pre className="whitespace-pre-wrap">{template.templateContent}</pre>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{template.usageGuidelines}</p>
                            <Button 
                              size="sm" 
                              onClick={() => handleApplyTemplate(template)}
                              className="w-full"
                            >
                              Use This Template
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>No Templates Available</AlertTitle>
                      <AlertDescription>
                        No regulatory templates configured for this content type.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : null}
        </ScrollArea>

        <SheetFooter className="sticky bottom-0 bg-background border-t px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button 
              onClick={onReAnalyze} 
              disabled={isAnalyzing}
              variant="outline"
            >
              Re-Analyze with AI
            </Button>
            <div className="flex gap-2">
              <Button 
                onClick={onMarkAsCompliant} 
                disabled={criticalIssuesCount > 0 || isApproved}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Compliant
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
      
      {pendingAction && (
        <DecisionReasonModal
          isOpen={reasonModalOpen}
          onClose={() => {
            setReasonModalOpen(false);
            setPendingAction(null);
          }}
          onSubmit={handleReasonSubmit}
          actionType={pendingAction.type}
          ruleName={pendingAction.rule.ruleName}
        />
      )}
    </Sheet>
  );
};