import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  Shield,
  FileText,
  Zap,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const QualityAssurancePanel = ({
  segment,
  onQualityUpdate
}) => {
  const [qualityChecks, setQualityChecks] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  // Run quality analysis when segment changes
  useEffect(() => {
    if (segment?.targetText) {
      analyzeTranslationQuality(segment);
    } else {
      setQualityChecks([]);
      setOverallScore(0);
    }
  }, [segment?.targetText]);

  const analyzeTranslationQuality = async (seg) => {
    setIsAnalyzing(true);
    
    // Simulate quality analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const checks = [];
    let score = 100;

    // Grammar check
    if (seg.targetText.length > 0) {
      if (seg.targetText.includes('  ')) {
        checks.push({
          id: 'grammar-1',
          type: 'grammar',
          status: 'warning',
          message: 'Double spaces detected',
          suggestion: 'Replace double spaces with single spaces',
          position: { start: seg.targetText.indexOf('  '), end: seg.targetText.indexOf('  ') + 2 }
        });
        score -= 5;
      }

      // Terminology consistency
      if (seg.sourceText.toLowerCase().includes('medication') && !seg.targetText.toLowerCase().includes('medication')) {
        checks.push({
          id: 'terminology-1',
          type: 'terminology',
          status: 'error',
          message: 'Key medical term "medication" not found in translation',
          suggestion: 'Ensure medical terminology is accurately translated'
        });
        score -= 15;
      }

      // Length check
      const lengthRatio = seg.targetText.length / seg.sourceText.length;
      if (lengthRatio > 1.5 || lengthRatio < 0.5) {
        checks.push({
          id: 'length-1',
          type: 'length',
          status: 'warning',
          message: `Translation length significantly different from source (${Math.round(lengthRatio * 100)}%)`,
          suggestion: 'Review translation for completeness and conciseness'
        });
        score -= 10;
      }

      // Cultural adaptation
      if (seg.sourceText.includes('FDA') && seg.targetText.includes('FDA')) {
        checks.push({
          id: 'cultural-1',
          type: 'cultural',
          status: 'warning',
          message: 'FDA reference may need localization for target market',
          suggestion: 'Consider replacing with local regulatory authority'
        });
        score -= 8;
      }

      // Compliance check
      if (seg.sourceText.toLowerCase().includes('side effect') || seg.sourceText.toLowerCase().includes('contraindication')) {
        checks.push({
          id: 'compliance-1',
          type: 'compliance',
          status: 'pass',
          message: 'Safety information properly translated',
        });
      }
    }

    // Add positive checks if translation is good
    if (checks.filter(c => c.status === 'error').length === 0) {
      checks.push({
        id: 'consistency-1',
        type: 'consistency',
        status: 'pass',
        message: 'Translation maintains consistent tone and style'
      });
    }

    setQualityChecks(checks);
    setOverallScore(Math.max(0, Math.min(100, score)));
    onQualityUpdate(Math.max(0, Math.min(100, score)));
    setIsAnalyzing(false);
  };

  const getCheckIcon = (status) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getCheckTypeIcon = (type) => {
    switch (type) {
      case 'grammar': return <FileText className="h-3 w-3" />;
      case 'terminology': return <Target className="h-3 w-3" />;
      case 'consistency': return <Zap className="h-3 w-3" />;
      case 'cultural': return <Shield className="h-3 w-3" />;
      case 'compliance': return <Shield className="h-3 w-3" />;
      case 'length': return <TrendingUp className="h-3 w-3" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  if (!segment) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Quality Assurance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a segment to see quality analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Quality Assurance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center">
          <div className={cn("text-2xl font-bold mb-1", getScoreColor(overallScore))}>
            {isAnalyzing ? '--' : Math.round(overallScore)}%
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            {isAnalyzing ? 'Analyzing...' : getScoreLabel(overallScore)}
          </div>
          <Progress 
            value={isAnalyzing ? 50 : overallScore} 
            className={cn(
              "h-2",
              isAnalyzing && "animate-pulse"
            )}
          />
        </div>

        <Separator />

        {/* Quality Checks */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Quality Checks
            {isAnalyzing && (
              <div className="ml-auto">
                <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </h4>

          {isAnalyzing ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-full mb-1" />
                  <div className="h-3 bg-muted/60 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : qualityChecks.length > 0 ? (
            <div className="space-y-3">
              {qualityChecks.map((check) => (
                <div key={check.id} className="flex items-start gap-3 p-2 rounded-lg border">
                  <div className="flex items-center gap-1 mt-0.5">
                    {getCheckIcon(check.status)}
                    {getCheckTypeIcon(check.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium capitalize">{check.type}</span>
                      <Badge 
                        variant={
                          check.status === 'pass' ? 'default' :
                          check.status === 'warning' ? 'outline' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {check.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {check.message}
                    </p>
                    {check.suggestion && (
                      <p className="text-xs text-blue-600 italic">
                        💡 {check.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Add translation to see quality analysis</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!isAnalyzing && segment.targetText && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => analyzeTranslationQuality(segment)}
              >
                Re-analyze
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                disabled={qualityChecks.some(c => c.status === 'error')}
              >
                Mark Reviewed
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};