
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

export const EnhancedGuardrailsPanel = ({
  brandId,
  market = 'US',
  audienceType,
  content,
  showComplianceCheck = true,
  showCustomization = true,
  className,
  context = {},
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
    audienceType: context.audience_type
  });

  const [compliance, setCompliance] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

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
              {isAnalyzing && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
              )}
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
              {/* Competitive Positioning */}
              {/* Regulatory Compliance */}
              {/* Audience Targeting */}
              {/* Market Positioning */}
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
      {/* Keep all Tabs and JSX blocks as in original code, just without TS types */}
    </div>
  );
};
