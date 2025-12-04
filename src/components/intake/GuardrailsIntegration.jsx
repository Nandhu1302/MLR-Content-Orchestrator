
import React from 'react';
import { Shield, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGuardrails } from '@/hooks/useGuardrails';

const GuardrailsIntegration = ({ content, showCompetitiveGuidance = true, contentType = 'general' }) => {
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Brand guardrails not available. Content generation may not follow brand guidelines.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Staleness Warning */}
      {needsAttention && (
        <Alert variant="warning">
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Content Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <p>Compliance Score: {complianceCheck.guideline_adherence}%</p>
              <p>Tone Match: {complianceCheck.tone_match ? '✓' : '✗'}</p>
              <p>Key Messages: {complianceCheck.key_message_alignment ? '✓' : '✗'}</p>
              <p>Competitive: {complianceCheck.competitive_positioning ? '✓' : '✗'}</p>
              <p>Regulatory: {complianceCheck.regulatory_compliance ? '✓' : '✗'}</p>
            </div>

            {complianceCheck.suggestions.length > 0 && (
              <div>
                <strong>Suggestions:</strong>
                <ul className="list-disc pl-4">
                  {complianceCheck.suggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceCheck.warnings.length > 0 && (
              <div>
                <strong>Warnings:</strong>
                <ul className="list-disc pl-4 text-red-600">
                  {complianceCheck.warnings.map((warning, index) => (
                    <li key={index}>⚠ {warning}</li>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Competitive Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {competitiveGuidance.advantages.length > 0 && (
              <div>
                <strong>Highlight These Advantages:</strong>
                <ul className="list-disc pl-4">
                  {competitiveGuidance.advantages.map((advantage, index) => (
                    <li key={index}>{advantage}</li>
                  ))}
                </ul>
              </div>
            )}

            {competitiveGuidance.messagingOpportunities.length > 0 && (
              <div>
                <strong>Messaging Opportunities:</strong>
                <ul className="list-disc pl-4">
                  {competitiveGuidance.messagingOpportunities.map((opportunity, index) => (
                    <li key={index}>• {opportunity}</li>
                  ))}
                </ul>
              </div>
            )}

            {competitiveGuidance.topCompetitors.length > 0 && (
              <div>
                <strong>Vs Top Competitors:</strong>
                {competitiveGuidance.topCompetitors.map((competitor, index) => (
                  <div key={index} className="mt-2">
                    <p className="font-medium">{competitor.name}:</p>
                    <ul className="list-disc pl-4">
                      {competitor.advantages.map((advantage, i) => (
                        <li key={i}>• {advantage}</li>
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
          <CardHeader>
            <CardTitle>Key Brand Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {guardrails.key_messages.slice(0, 3).map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GuardrailsIntegration;
