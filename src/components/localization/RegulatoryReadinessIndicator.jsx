import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileCheck, 
  Globe, 
  Shield, 
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { getSupportedMarkets } from '@/config/localizationConfig';

export const RegulatoryReadinessIndicator = ({
  asset,
  className = ""
}) => {
  const supportedMarkets = getSupportedMarkets();

  // Calculate regulatory complexity based on asset type and therapeutic area
  const getRegulatoryComplexity = (assetType, therapeuticArea) => {
    const complexityMap = {
      'sales_aid': 85,
      'digital-sales-aid': 85,
      'patient-brochure': 90,
      'presentation': 75,
      'mass-email': 60,
      'email': 60,
      'social_media': 45,
      'landing_page': 70,
      'digital-tool': 80,
      'banner': 40,
      'display_ad': 40
    };

    let baseScore = complexityMap[assetType] || 65;
    
    // Adjust for therapeutic area
    if (therapeuticArea && ['oncology', 'cardiology', 'neurology'].includes(therapeuticArea.toLowerCase())) {
      baseScore += 10;
    }

    return Math.min(100, baseScore);
  };

  // Get market-specific regulatory requirements
  const getMarketRequirements = (marketCode) => {
    const requirements = {
      'JP': {
        framework: 'PMDA (Japanese Regulatory Authority)',
        complexity: 'High',
        keyRequirements: [
          'Japanese language compliance',
          'PMDA approval documentation',
          'Cultural adaptation requirements',
          'Medical terminology validation'
        ],
        estimatedDays: 15
      },
      'CN': {
        framework: 'NMPA (Chinese Regulatory Authority)',
        complexity: 'High',
        keyRequirements: [
          'Simplified Chinese compliance',
          'NMPA regulatory alignment',
          'Local cultural considerations',
          'Medical accuracy validation'
        ],
        estimatedDays: 12
      }
    };

    return requirements[marketCode];
  };

  // Calculate preparation recommendations
  const getPreparationRecommendations = (assetType, complexity) => {
    const recommendations = [];

    if (complexity >= 80) {
      recommendations.push({
        priority: 'High',
        action: 'Engage regulatory experts early',
        description: 'Complex assets require specialized regulatory review'
      });
    }

    if (assetType.includes('patient') || assetType.includes('brochure')) {
      recommendations.push({
        priority: 'High',
        action: 'Medical accuracy validation',
        description: 'Patient-facing materials need thorough medical review'
      });
    }

    recommendations.push({
      priority: 'Medium',
      action: 'Cultural adaptation assessment',
      description: 'Review content for cultural sensitivity in target markets'
    });

    if (complexity >= 60) {
      recommendations.push({
        priority: 'Medium',
        action: 'Regulatory documentation preparation',
        description: 'Prepare supporting documentation for regulatory review'
      });
    }

    return recommendations;
  };

  const complexity = getRegulatoryComplexity(asset.asset_type || asset.type, asset.therapeutic_area);
  const recommendations = getPreparationRecommendations(asset.asset_type || asset.type, complexity);

  const getComplexityColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getComplexityLabel = (score) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return AlertTriangle;
      case 'Medium': return AlertCircle;
      default: return CheckCircle;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Regulatory Readiness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Regulatory Readiness Assessment
          </CardTitle>
          <CardDescription>
            Pre-localization regulatory complexity analysis for supported markets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Regulatory Complexity</p>
              <p className="text-xs text-muted-foreground">Based on asset type and therapeutic area</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${getComplexityColor(complexity)}`}>
                {getComplexityLabel(complexity)}
              </p>
              <p className="text-sm text-muted-foreground">{complexity}%</p>
            </div>
          </div>
          <Progress value={complexity} className="h-2" />
        </CardContent>
      </Card>

      {/* Market-Specific Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Market Regulatory Framework
          </CardTitle>
          <CardDescription>
            Regulatory requirements for supported localization markets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {supportedMarkets.map((market) => {
            const requirements = getMarketRequirements(market.code);
            if (!requirements) return null;

            return (
              <div key={market.code} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{market.name} ({market.code})</h4>
                    <p className="text-sm text-muted-foreground">{requirements.framework}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getComplexityColor(complexity)}>
                      {requirements.complexity} Complexity
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      ~{requirements.estimatedDays} review days
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Requirements:</p>
                  <div className="grid grid-cols-1 gap-1">
                    {requirements.keyRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FileCheck className="h-3 w-3 text-muted-foreground" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Timeline Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Timeline Impact Analysis
          </CardTitle>
          <CardDescription>
            Estimated regulatory review timeline for localization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Estimated Review Time</p>
              <p className="text-2xl font-bold text-primary">
                {supportedMarkets.reduce((total, market) => {
                  const req = getMarketRequirements(market.code);
                  return total + (req?.estimatedDays || 0);
                }, 0)} days
              </p>
              <p className="text-xs text-muted-foreground">Across all supported markets</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Regulatory Preparation Phase</p>
              <p className="text-2xl font-bold text-secondary">
                {Math.ceil(complexity / 10)} days
              </p>
              <p className="text-xs text-muted-foreground">Pre-localization preparation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preparation Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Preparation Recommendations
          </CardTitle>
          <CardDescription>
            Actions to optimize regulatory readiness before localization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec, index) => {
            const PriorityIcon = getPriorityIcon(rec.priority);
            return (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <PriorityIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{rec.action}</p>
                    <Badge variant={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Risk Factors Assessment
          </CardTitle>
          <CardDescription>
            Potential regulatory challenges to consider
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {complexity >= 80 && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>High complexity asset type requires extensive regulatory review</span>
              </div>
            )}
            
            {asset.therapeutic_area && ['oncology', 'cardiology', 'neurology'].includes(asset.therapeutic_area.toLowerCase()) && (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertCircle className="h-4 w-4" />
                <span>Specialized therapeutic area requires expert medical review</span>
              </div>
            )}
            
            {(asset.asset_type || asset.type).includes('patient') && (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertCircle className="h-4 w-4" />
                <span>Patient-facing content requires enhanced regulatory scrutiny</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <CheckCircle className="h-4 w-4" />
              <span>Cultural adaptation will be required for all target markets</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};