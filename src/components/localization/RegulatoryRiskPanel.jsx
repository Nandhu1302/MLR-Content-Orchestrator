import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock, 
  FileText,
  Globe, 
  Gavel,
  RefreshCw,
  Info,
  ExternalLink
} from 'lucide-react';
import { useRegulatoryRiskAssessment } from '@/hooks/useRegulatoryRiskAssessment';

export const RegulatoryRiskPanel = ({
  projectId,
  contentData,
  targetMarkets,
  contentType
}) => {
  const { 
    assessment, 
    isLoading, 
    triggerAssessment, 
    lastAssessed 
  } = useRegulatoryRiskAssessment(projectId, contentData, targetMarkets, contentType);

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskVariant = (level) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getComplianceIcon = (status) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'non-compliant': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'requires-review': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Regulatory Risk Assessment</h2>
            <p className="text-sm text-muted-foreground">
              Compliance analysis for {targetMarkets.length} markets
            </p>
          </div>
        </div>
        <Button 
          onClick={triggerAssessment}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {assessment ? 'Reassess' : 'Assess'}
        </Button>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-y-4 flex-col">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Analyzing regulatory compliance across markets...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {assessment && (
        <>
          {/* Overall Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Overall Risk Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Risk Level</span>
                  <Badge variant={getRiskVariant(assessment.overallRiskLevel)} className="capitalize">
                    {assessment.overallRiskLevel} Risk
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Risk Score</span>
                  <span className={`font-bold ${getRiskColor(assessment.overallRiskLevel)}`}>
                    {assessment.overallRiskScore}%
                  </span>
                </div>
                <Progress value={assessment.overallRiskScore} className="h-3" />
                
                {assessment.overallRiskLevel === 'critical' || assessment.overallRiskLevel === 'high' && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      High risk content detected. Review required before localization.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Last assessed: {lastAssessed ? new Date(lastAssessed).toLocaleString() : 'Never'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market-Specific Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Market Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessment.marketSpecificRisks?.map((marketRisk, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{marketRisk.market}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getComplianceIcon(marketRisk.complianceStatus)}
                        <Badge variant={getRiskVariant(marketRisk.riskLevel)} className="text-xs capitalize">
                          {marketRisk.riskLevel}
                        </Badge>
                      </div>
                    </div>

                    {marketRisk.regulatoryRequirements && marketRisk.regulatoryRequirements.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Regulatory Requirements:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {marketRisk.regulatoryRequirements.map((req, reqIndex) => (
                            <Badge key={reqIndex} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {marketRisk.riskFactors && marketRisk.riskFactors.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Risk Factors:</p>
                        <div className="space-y-1">
                          {marketRisk.riskFactors.map((factor, factorIndex) => (
                            <div key={factorIndex} className="flex items-start gap-2 text-sm">
                              <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {marketRisk.recommendations && marketRisk.recommendations.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Recommendations:</p>
                        <div className="space-y-1">
                          {marketRisk.recommendations.map((rec, recIndex) => (
                            <div key={recIndex} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Categories Analysis */}
          {assessment.contentCategoryRisks && assessment.contentCategoryRisks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Content Category Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assessment.contentCategoryRisks.map((categoryRisk, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{categoryRisk.category}</span>
                        <Badge variant={getRiskVariant(categoryRisk.riskLevel)} className="text-xs">
                          {categoryRisk.riskLevel}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Risk Score</span>
                          <span className="font-medium">{categoryRisk.riskScore}%</span>
                        </div>
                        <Progress value={categoryRisk.riskScore} className="h-2" />
                      </div>

                      {categoryRisk.specificIssues && categoryRisk.specificIssues.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium mb-1">Issues:</p>
                          {categoryRisk.specificIssues.slice(0, 3).map((issue, issueIndex) => (
                            <div key={issueIndex} className="text-xs text-muted-foreground">
                              • {issue}
                            </div>
                          ))}
                          {categoryRisk.specificIssues.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{categoryRisk.specificIssues.length - 3} more issues
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline Impact */}
          {assessment.timelineImpact && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline & Process Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      +{assessment.timelineImpact.additionalReviewDays || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Additional Review Days</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">
                      {assessment.timelineImpact.approvalComplexity || 'Standard'}
                    </div>
                    <div className="text-sm text-muted-foreground">Approval Complexity</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      {assessment.timelineImpact.requiredStakeholders?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Required Stakeholders</div>
                  </div>
                </div>

                {assessment.timelineImpact.requiredStakeholders && assessment.timelineImpact.requiredStakeholders.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Required Stakeholders:</p>
                    <div className="flex flex-wrap gap-2">
                      {assessment.timelineImpact.requiredStakeholders.map((stakeholder, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {stakeholder}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Mitigation Strategies */}
          {assessment.mitigationStrategies && assessment.mitigationStrategies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-4 w-4" />
                  Recommended Mitigation Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessment.mitigationStrategies.map((strategy, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900">{strategy.strategy}</p>
                        {strategy.implementation && (
                          <p className="text-sm text-green-700 mt-1">{strategy.implementation}</p>
                        )}
                        {strategy.priority && (
                          <Badge variant="outline" className="text-xs mt-2">
                            {strategy.priority} Priority
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compliance Checklist */}
          {assessment.complianceChecklist && assessment.complianceChecklist.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Compliance Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {assessment.complianceChecklist.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 border rounded">
                      {getComplianceIcon(item.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.requirement}</p>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                        )}
                      </div>
                      {item.status === 'requires-review' && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!assessment && !isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-medium">No Risk Assessment</h3>
                <p className="text-sm text-muted-foreground">
                  Analyze content for regulatory compliance risks across target markets
                </p>
              </div>
              <Button onClick={triggerAssessment}>
                <Shield className="h-4 w-4 mr-2" />
                Assess Regulatory Risk
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};