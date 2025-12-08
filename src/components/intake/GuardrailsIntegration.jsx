import React from 'react';
import { Shield, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGuardrails } from '@/hooks/useGuardrails';
// Type import removed
// import { ContentComplianceCheck } from '@/types/guardrails';

// Interface and type annotations removed
const GuardrailsIntegration = ({
  content,
  showCompetitiveGuidance = true,
  contentType = 'general'
}) => {
  const { 
    guardrails, 
    isStale, 
    needsAttention,
    daysSinceReview,
    checkContentCompliance,
    getCompetitiveGuidance 
  } = useGuardrails();

  const complianceCheck = content ? checkContentCompliance(content) : null;
  const competitiveGuidance = showCompetitiveGuidance ? getCompetitiveGuidance(contentType) : null;

  if (!guardrails) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Brand guardrails not available. Content generation may not follow brand guidelines.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Staleness Warning */}
      {needsAttention && (
        <Alert variant={isStale ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Brand guardrails were last reviewed {daysSinceReview} days ago. 
            {isStale ? ' Guidelines may be outdated.' : ' Consider reviewing soon.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Content Compliance Check */}
      {complianceCheck && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {complianceCheck.guideline_adherence >= 80 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-600" />
              )}
              Content Compliance: {complianceCheck.guideline_adherence}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span>Tone Match:</span>
                  <Badge variant={complianceCheck.tone_match ? "default" : "secondary"}>
                    {complianceCheck.tone_match ? "✓" : "✗"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span>Key Messages:</span>
                  <Badge variant={complianceCheck.key_message_alignment ? "default" : "secondary"}>
                    {complianceCheck.key_message_alignment ? "✓" : "✗"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span>Competitive:</span>
                  <Badge variant={complianceCheck.competitive_positioning ? "default" : "secondary"}>
                    {complianceCheck.competitive_positioning ? "✓" : "✗"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span>Regulatory:</span>
                  <Badge variant={complianceCheck.regulatory_compliance ? "default" : "secondary"}>
                    {complianceCheck.regulatory_compliance ? "✓" : "✗"}
                  </Badge>
                </div>
              </div>
            </div>

            {complianceCheck.suggestions.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Suggestions:</p>
                <ul className="text-xs space-y-0.5">
                  {complianceCheck.suggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} className="text-muted-foreground">• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceCheck.warnings.length > 0 && (
              <div className="space-y-1 mt-2">
                <p className="text-xs font-medium text-orange-600">Warnings:</p>
                <ul className="text-xs space-y-0.5">
                  {complianceCheck.warnings.map((warning, index) => (
                    <li key={index} className="text-orange-600">⚠ {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Competitive Guidance */}
      {competitiveGuidance && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Competitive Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {competitiveGuidance.advantages.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Highlight These Advantages:</p>
                <div className="flex flex-wrap gap-1">
                  {competitiveGuidance.advantages.map((advantage, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {advantage}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {competitiveGuidance.messagingOpportunities.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Messaging Opportunities:</p>
                <ul className="text-xs space-y-0.5">
                  {competitiveGuidance.messagingOpportunities.map((opportunity, index) => (
                    <li key={index} className="text-muted-foreground">• {opportunity}</li>
                  ))}
                </ul>
              </div>
            )}

            {competitiveGuidance.topCompetitors.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Vs Top Competitors:</p>
                {competitiveGuidance.topCompetitors.map((competitor, index) => (
                  <div key={index} className="text-xs mb-2">
                    <span className="font-medium">{competitor.name}:</span>
                    <ul className="ml-2 space-y-0.5">
                      {competitor.advantages.map((advantage, i) => (
                        <li key={i} className="text-muted-foreground">• {advantage}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Access to Key Messages */}
      {guardrails.key_messages.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Key Brand Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {guardrails.key_messages.slice(0, 3).map((message, index) => (
                <div key={index} className="text-xs bg-primary/5 border border-primary/20 rounded p-2">
                  {message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GuardrailsIntegration;