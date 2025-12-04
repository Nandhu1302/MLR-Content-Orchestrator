import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BrandConsistencyService } from '@/services/brandConsistencyService';
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export const BrandConsistencyEngine = ({
  assetId,
  brandId,
  className = ""
}) => {
  const [consistencyResult, setConsistencyResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    validateConsistency();
  }, [assetId, brandId]);

  const validateConsistency = async () => {
    setIsLoading(true);
    try {
      const result = await BrandConsistencyService.validateBrandConsistency(assetId, brandId);
      setConsistencyResult(result);
    } catch (error) {
      console.error('Error validating brand consistency:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !consistencyResult) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'needs_review': return 'text-yellow-600';
      case 'non_compliant': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'needs_review': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'non_compliant': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(consistencyResult.status)}
            <div>
              <h3 className="font-semibold">Brand Consistency Score</h3>
              <p className={`text-sm ${getStatusColor(consistencyResult.status)}`}>
                {consistencyResult.status.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{consistencyResult.overallScore}%</div>
            <Button size="sm" variant="outline" onClick={validateConsistency}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-validate
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Messaging</span>
            <div className="flex items-center gap-2">
              <Progress value={consistencyResult.messagingScore} className="w-20" />
              <span className="text-sm font-medium">{consistencyResult.messagingScore}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Tone</span>
            <div className="flex items-center gap-2">
              <Progress value={consistencyResult.toneScore} className="w-20" />
              <span className="text-sm font-medium">{consistencyResult.toneScore}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Visual</span>
            <div className="flex items-center gap-2">
              <Progress value={consistencyResult.visualScore} className="w-20" />
              <span className="text-sm font-medium">{consistencyResult.visualScore}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Regulatory</span>
            <div className="flex items-center gap-2">
              <Progress value={consistencyResult.regulatoryScore} className="w-20" />
              <span className="text-sm font-medium">{consistencyResult.regulatoryScore}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Issues & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {consistencyResult.issues.length > 0 && (
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Issues ({consistencyResult.issues.length})
            </h4>
            <div className="space-y-3">
              {consistencyResult.issues.slice(0, 5).map((issue, index) => (
                <Alert key={index}>
                  <AlertDescription>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{issue.description}</span>
                      <Badge variant="destructive">{issue.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.suggestion}</p>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </Card>
        )}

        {consistencyResult.strengths.length > 0 && (
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Strengths ({consistencyResult.strengths.length})
            </h4>
            <div className="space-y-2">
              {consistencyResult.strengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};