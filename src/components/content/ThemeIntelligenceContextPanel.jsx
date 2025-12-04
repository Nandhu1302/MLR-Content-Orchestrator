import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, 
  CheckCircle2, 
  Lightbulb, 
  ExternalLink,
  Target,
  TrendingUp,
  Shield,
  Users,
  Zap,
  RefreshCw,
  Database,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { themeContextInsightsService } from '@/services/themeContextInsightsService';

const getIntelligenceIcon = (type) => {
  switch (type) {
    case 'brand': return Users;
    case 'competitive': return Target;
    case 'market': return TrendingUp;
    case 'regulatory': return Shield;
    case 'public': return Lightbulb;
    default: return Brain;
  }
};

const getIntelligenceTitle = (type) => {
  switch (type) {
    case 'brand': return 'Brand Voice';
    case 'competitive': return 'Competitive Advantages';
    case 'market': return 'Market Positioning';
    case 'regulatory': return 'Regulatory Compliance';
    case 'public': return 'Market Insights';
    default: return type;
  }
};

export const ThemeIntelligenceContextPanel = ({
  themeId,
  themeName,
  brandId,
  enrichmentStatus,
  intelligenceLayers,
  workshopNotes,
  intelligenceProgress = 0,
  intelligenceLayersUsedInGeneration = [],
  intelligenceLayerCount = 0,
  onRefresh,
  isRefreshing = false
}) => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Fetch real data-driven insights when brandId is available
  useEffect(() => {
    if (brandId) {
      setIsLoadingInsights(true);
      themeContextInsightsService.getInsightsForBrand(brandId)
        .then(setInsights)
        .catch(console.error)
        .finally(() => setIsLoadingInsights(false));
    }
  }, [brandId]);

  const handleOpenWorkshop = () => {
    navigate(`/theme-intelligence/${themeId}`);
  };

  const wasUsedInGeneration = intelligenceLayersUsedInGeneration.length > 0;
  const isEnriched = enrichmentStatus === 'ready-for-use' || intelligenceProgress > 0 || wasUsedInGeneration;

  const incorporatedLayers = Object.entries(intelligenceLayers || {}).filter(
    ([_, data]) => data?.incorporated === true
  );

  const getStatusBadge = () => {
    if (isEnriched && incorporatedLayers.length > 0) {
      return <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Enriched & Active</Badge>;
    } else if (isEnriched) {
      return <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Enriched</Badge>;
    } else {
      return <Badge variant="outline" className="gap-1">Not Enriched</Badge>;
    }
  };

  const renderPerformanceComparison = (value, benchmark, label) => {
    if (value === null) return null;
    const diff = value - benchmark;
    const isPositive = diff > 0;
    return (
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1">
          <span className="font-semibold">{value.toFixed(1)}%</span>
          <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-orange-500'}`}>
            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(diff).toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Theme Intelligence
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="h-7 w-7 p-0"
                title="Refresh intelligence data"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
            {getStatusBadge()}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{themeName}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleOpenWorkshop}
              className="h-8 text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Workshop
            </Button>
          </div>

          {isEnriched && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Intelligence Progress</span>
                <span>{intelligenceProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all" 
                  style={{ width: `${intelligenceProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {!isEnriched && (
          <div className="p-3 rounded-lg bg-muted/50 border border-dashed space-y-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="text-xs font-medium">Theme Not Enriched</p>
                <p className="text-xs text-muted-foreground">
                  This theme hasn't been enriched with strategic intelligence yet.
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenWorkshop}
              className="w-full"
            >
              <Zap className="h-3 w-3 mr-2" />
              Enrich Now
            </Button>
          </div>
        )}

        {wasUsedInGeneration && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium">Used in Content Generation</p>
                <Badge variant="secondary" className="text-xs">
                  {intelligenceLayerCount} {intelligenceLayerCount === 1 ? 'Layer' : 'Layers'}
                </Badge>
              </div>
              <div className="space-y-2">
                {intelligenceLayersUsedInGeneration.map((type) => {
                  const Icon = getIntelligenceIcon(type);
                  return (
                    <div key={type} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{getIntelligenceTitle(type)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ========== DATA-DRIVEN SECTIONS ========== */}
        
        {/* Section 1: Evidence Backing */}
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Shield className="h-4 w-4 text-primary" />
            Evidence Backing
          </div>
          
          {isLoadingInsights ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : insights?.evidenceBacking.claims.length ? (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{insights.evidenceBacking.totalApproved}</span> of {insights.evidenceBacking.totalClaims} claims approved
              </div>
              {insights.evidenceBacking.claims.map((claim) => (
                <div key={claim.id} className="p-2 bg-muted/50 rounded border text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-muted-foreground line-clamp-2">{claim.claimText}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] py-0">{claim.claimType}</Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {claim.confidenceScore}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No approved claims available</p>
          )}
        </div>

        {/* Section 2: Performance Benchmark */}
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4 text-primary" />
            Performance Benchmark
          </div>
          
          {isLoadingInsights ? (
            <Skeleton className="h-20 w-full" />
          ) : insights?.performanceBenchmark.campaignCount ? (
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg border">
              <div className="text-xs text-muted-foreground mb-2">
                Based on <span className="font-medium text-foreground">{insights.performanceBenchmark.campaignCount}</span> campaigns
              </div>
              {renderPerformanceComparison(
                insights.performanceBenchmark.avgOpenRate,
                insights.performanceBenchmark.industryBenchmarkOpen,
                'Avg Open Rate'
              )}
              {renderPerformanceComparison(
                insights.performanceBenchmark.avgClickRate,
                insights.performanceBenchmark.industryBenchmarkClick,
                'Avg Click Rate'
              )}
              {insights.performanceBenchmark.topCampaignName && (
                <div className="pt-2 mt-2 border-t text-xs">
                  <span className="text-muted-foreground">Top performer: </span>
                  <span className="font-medium">{insights.performanceBenchmark.topCampaignName}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No performance history yet</p>
          )}
        </div>

        {/* Section 3: Competitive Edge */}
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Target className="h-4 w-4 text-primary" />
            Competitive Edge
          </div>
          
          {isLoadingInsights ? (
            <Skeleton className="h-16 w-full" />
          ) : insights?.competitiveEdge.length ? (
            <div className="space-y-2">
              {insights.competitiveEdge.slice(0, 2).map((competitor) => (
                <div key={competitor.competitorName} className="p-2 bg-muted/50 rounded border">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">vs {competitor.competitorName}</span>
                    {competitor.threatLevel && (
                      <Badge 
                        variant={competitor.threatLevel === 'high' ? 'destructive' : 'outline'} 
                        className="text-[10px] py-0"
                      >
                        {competitor.threatLevel} threat
                      </Badge>
                    )}
                  </div>
                  {competitor.keyDifferentiators.length > 0 && (
                    <ul className="space-y-1">
                      {competitor.keyDifferentiators.slice(0, 2).map((diff, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                          <Zap className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{diff}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No competitive intelligence configured</p>
          )}
        </div>

        {/* Data Attribution Footer */}
        {insights?.hasData && (
          <>
            <Separator />
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Database className="h-3 w-3" />
              <span>Data from clinical_claims, campaign_performance, competitive_intelligence</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};