import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield,
  Target,
  Eye,
  ChevronRight
} from 'lucide-react';
import { useEnhancedGuardrails } from '@/hooks/useEnhancedGuardrails';

export const CompetitiveIntelligenceWidget = ({
  className,
  onOpenDrawer
}) => {
  const { 
    competitiveIntelligence, 
    isLoading
  } = useEnhancedGuardrails({});

  // Compute guidance synchronously from available data with useMemo
  const competitiveGuidance = useMemo(() => {
    if (!competitiveIntelligence?.length) return null;
    
    return {
      topThreats: competitiveIntelligence
        .filter(c => c.threat_level === 'high' || c.threat_level === 'medium')
        .slice(0, 3)
    };
  }, [competitiveIntelligence]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Competitive Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!competitiveIntelligence?.length) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Competitive Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Eye className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No competitive intelligence data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const threatLevelColor = (level) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const threatLevelIcon = (level) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <TrendingUp className="h-3 w-3" />;
      case 'low': return <TrendingDown className="h-3 w-3" />;
      default: return <Shield className="h-3 w-3" />;
    }
  };

  // Calculate summary metrics
  const totalCompetitors = competitiveIntelligence?.length || 0;
  const highThreats = competitiveIntelligence?.filter(c => c.threat_level === 'high').length || 0;
  const mediumThreats = competitiveIntelligence?.filter(c => c.threat_level === 'medium').length || 0;

  return (
    <Card className={`${className} cursor-pointer hover:shadow-sm transition-shadow`} onClick={onOpenDrawer}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4" />
          Competitive Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Summary Metrics */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Competitors Tracked</span>
          <Badge variant="secondary" className="text-sm font-semibold">
            {totalCompetitors}
          </Badge>
        </div>

        {/* Threat Summary */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Threat Level</span>
          <div className="flex items-center gap-1.5 text-xs">
            {highThreats > 0 && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0">
                {highThreats} High
              </Badge>
            )}
            {mediumThreats > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {mediumThreats} Med
              </Badge>
            )}
            {highThreats === 0 && mediumThreats === 0 && (
              <span className="text-muted-foreground">Low risk</span>
            )}
          </div>
        </div>

        {/* Top Threat (1 only) */}
        {competitiveGuidance?.topThreats?.[0] && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded">
              <Badge 
                variant={threatLevelColor(competitiveGuidance.topThreats[0].threat_level)}
                className="flex items-center gap-1 text-xs shrink-0"
              >
                {threatLevelIcon(competitiveGuidance.topThreats[0].threat_level)}
              </Badge>
              <span className="text-xs font-medium truncate">
                {competitiveGuidance.topThreats[0].competitor_name}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};