import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  FileCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle,
  Globe,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock local MLR requirements analysis
const getLocalMLRAnalysis = (asset) => {
  const requirements = {
    US: { status: 'standard_review', risk: 'low', lastReview: '2024-01-15' },
    EU: { status: 'enhanced_review', risk: 'medium', lastReview: '2023-12-01' },
    UK: { status: 'standard_review', risk: 'low', lastReview: '2024-01-10' },
    CA: { status: 'standard_review', risk: 'low', lastReview: null },
    JP: { status: 'complex_review', risk: 'high', lastReview: '2023-11-15' },
    DE: { status: 'enhanced_review', risk: 'low', lastReview: '2024-01-12' },
    FR: { status: 'enhanced_review', risk: 'medium', lastReview: '2023-12-15' }
  };

  // Calculate overall readiness score
  const markets = Object.keys(requirements);
  const standardCount = markets.filter(m => requirements[m].status === 'standard_review').length;
  const enhancedCount = markets.filter(m => requirements[m].status === 'enhanced_review').length;
  const readinessScore = Math.round(((standardCount * 100 + enhancedCount * 70) / markets.length));

  // Get regulatory complexity based on asset type
  let complexityLevel = 'medium';
  if (asset.type === 'sales_aid' || asset.type === 'medical_content') {
    complexityLevel = 'high';
  } else if (asset.type === 'social_media' || asset.type === 'banner') {
    complexityLevel = 'low';
  }

  // Identify complex markets
  const complexMarkets = markets.filter(m => requirements[m].status === 'complex_review');
  const enhancedMarkets = markets.filter(m => requirements[m].status === 'enhanced_review');

  return {
    readinessScore,
    complexityLevel,
    requirements,
    complexMarkets,
    enhancedMarkets,
    globalMLRStatus: asset.source_module === 'pre_mlr' ? 'approved' : 'pending'
  };
};

export const LocalMLRStatusIndicator = ({
  asset,
  className
}) => {
  const analysis = getLocalMLRAnalysis(asset);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'standard_review': return CheckCircle;
      case 'enhanced_review': return Clock;
      case 'complex_review': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'standard_review': return 'text-green-600 bg-green-100';
      case 'enhanced_review': return 'text-yellow-600 bg-yellow-100';
      case 'complex_review': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplexityColor = (level) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-3", className)}>
        {/* MLR Compliance Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Regulatory Readiness</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={analysis.readinessScore} className="w-16 h-2" />
            <span className={cn("text-sm font-medium", getScoreColor(analysis.readinessScore))}>
              {analysis.readinessScore}%
            </span>
          </div>
        </div>

        {/* Global MLR Status */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Global MLR</span>
          <Badge 
            variant={analysis.globalMLRStatus === 'approved' ? "default" : "secondary"}
            className="text-xs"
          >
            {analysis.globalMLRStatus === 'approved' ? 'Pre-Approved' : 'Pending Review'}
          </Badge>
        </div>

        {/* Regulatory Complexity */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Regulatory Complexity</span>
          <Badge 
            className={cn("text-xs", getComplexityColor(analysis.complexityLevel))}
            variant="outline"
          >
            {analysis.complexityLevel}
          </Badge>
        </div>

        {/* Market Status Grid */}
        <div className="grid grid-cols-4 gap-1">
          {Object.entries(analysis.requirements).slice(0, 8).map(([market, req]) => {
            const StatusIcon = getStatusIcon(req.status);
            return (
              <Tooltip key={market}>
                <TooltipTrigger>
                  <div className={cn(
                    "flex items-center justify-center p-1 rounded text-xs font-medium",
                    getStatusColor(req.status)
                  )}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {market}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p className="font-medium">{market} MLR Status</p>
                    <p className="capitalize">{req.status.replace('_', ' ')}</p>
                    <p>Risk Level: {req.risk}</p>
                    {req.lastReview && (
                      <p>Last Review: {new Date(req.lastReview).toLocaleDateString()}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Alerts and Recommendations */}
        {(analysis.complexMarkets.length > 0 || analysis.enhancedMarkets.length > 0) && (
          <div className="space-y-1">
            {analysis.complexMarkets.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="h-3 w-3" />
                Complex review: {analysis.complexMarkets.join(', ')}
              </div>
            )}
            {analysis.enhancedMarkets.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-yellow-700">
                <Clock className="h-3 w-3" />
                Enhanced review: {analysis.enhancedMarkets.join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Info Tooltip */}
        <div className="flex items-center gap-2">
          <Badge 
            variant={analysis.readinessScore >= 80 ? "default" : 
                   analysis.readinessScore >= 60 ? "secondary" : "destructive"}
            className="text-xs"
          >
            {analysis.readinessScore >= 80 ? "Ready to Adapt" : 
             analysis.readinessScore >= 60 ? "Enhanced Review" : 
             "Complex Review"}
          </Badge>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="font-medium mb-1">Regulatory Readiness Intelligence</p>
                <p className="text-xs">
                  Predictive analysis of regulatory complexity and adaptation requirements 
                  across target localization markets.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};