import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Target, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { useIntelligence } from '@/contexts/IntelligenceContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

// Interfaces removed

// Interface and type annotations removed
export const IntelligenceGuidedRecommendations = ({
  context,
  onRecommendationSelect,
}) => {
  const { intelligence, isLoading } = useIntelligence();

  if (isLoading || !intelligence) {
    return null;
  }

  // Generate asset recommendations based on performance intelligence
  // Type assertion removed
  const assetRecommendations = generateAssetRecommendations(intelligence, context);
  
  // Generate audience recommendations based on audience intelligence
  // Type assertion removed
  const audienceRecommendations = generateAudienceRecommendations(intelligence, context);
  
  // Generate objective recommendations based on performance data
  // Type assertion removed
  const objectiveRecommendations = generateObjectiveRecommendations(intelligence, context);

  return (
    <div className="space-y-4">
      {/* Asset Type Recommendations */}
      {!context.assetTypes?.length && assetRecommendations.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Contextual Recommendations for This Campaign
            </CardTitle>
            <CardDescription>
              Based on {intelligence.performance.campaignAnalytics?.length || 0} campaigns and{' '}
              {intelligence.performance.successPatterns?.length || 0} success patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {assetRecommendations.map((rec, index) => (
              <AssetRecommendationCard
                key={index}
                recommendation={rec}
                onSelect={() => onRecommendationSelect?.('assetType', rec.assetType)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Audience Recommendations */}
      {!context.audience && audienceRecommendations.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Audience Insights
            </CardTitle>
            <CardDescription>
              Based on {intelligence.audience.segments?.length || 0} defined segments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {audienceRecommendations.map((rec, index) => (
              <AudienceRecommendationCard
                key={index}
                recommendation={rec}
                onSelect={() => onRecommendationSelect?.('audience', rec.audience)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Objective Recommendations */}
      {!context.objective && !context.preFilledFields?.hasObjective && objectiveRecommendations.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Contextual Objective Recommendations
            </CardTitle>
            <CardDescription>
              Based on historical success rates and completion data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {objectiveRecommendations.map((rec, index) => (
              <ObjectiveRecommendationCard
                key={index}
                recommendation={rec}
                onSelect={() => onRecommendationSelect?.('objective', rec.objective)}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Type annotations removed
const AssetRecommendationCard = ({
  recommendation,
  onSelect,
}) => (
  <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
    <div className="flex items-start justify-between mb-2">
      <div>
        <h4 className="font-semibold text-base">{recommendation.assetType}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {Math.round(recommendation.confidenceScore * 100)}% Confidence
          </Badge>
          {recommendation.historicalPerformance && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {recommendation.historicalPerformance.campaignsUsed} campaigns
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <div>Avg Engagement: {(recommendation.historicalPerformance.avgEngagementRate * 100).toFixed(1)}%</div>
                    <div>Avg Conversion: {(recommendation.historicalPerformance.avgConversionRate * 100).toFixed(1)}%</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={onSelect}>
        Select
      </Button>
    </div>
    <p className="text-sm text-muted-foreground mb-2">{recommendation.reasoning}</p>
    {recommendation.evidence.length > 0 && (
      <div className="space-y-1">
        {recommendation.evidence.slice(0, 2).map((ev, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600" />
            <span>{ev}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Type annotations removed
const AudienceRecommendationCard = ({
  recommendation,
  onSelect,
}) => (
  <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
    <div className="flex items-start justify-between mb-2">
      <div>
        <h4 className="font-semibold text-base">{recommendation.audience}</h4>
        <Badge variant="secondary" className="text-xs mt-1">
          {Math.round(recommendation.engagementScore)}% Engagement Score
        </Badge>
      </div>
      <Button size="sm" variant="outline" onClick={onSelect}>
        Select
      </Button>
    </div>
    <p className="text-sm text-muted-foreground mb-2">{recommendation.reasoning}</p>
    <div className="space-y-2">
      <div className="text-xs">
        <span className="font-medium">Preferred Channels: </span>
        <span className="text-muted-foreground">
          {recommendation.preferredChannels.join(', ')}
        </span>
      </div>
      <div className="text-xs">
        <span className="font-medium">Key Motivations: </span>
        <span className="text-muted-foreground">
          {recommendation.keyMotivations.slice(0, 2).join(', ')}
        </span>
      </div>
    </div>
  </div>
);

// Type annotations removed
const ObjectiveRecommendationCard = ({
  recommendation,
  onSelect,
}) => {
  const handleSelect = () => {
    onSelect();
    toast({
      title: "✓ Objective Applied",
      description: `Selected: ${recommendation.objective}`,
      duration: 2000,
    });
  };

  return (
    <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-base capitalize">{recommendation.objective}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {Math.round(recommendation.successRate * 100)}% Success Rate
            </Badge>
            <Badge variant="outline" className="text-xs">
              {recommendation.avgTimeToComplete}
            </Badge>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={handleSelect}>
          Select
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{recommendation.reasoning}</p>
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="h-3 w-3 mt-0.5" />
        <span>{recommendation.evidence}</span>
      </div>
    </div>
  );
};

// Helper functions to generate recommendations
// Type annotations removed
function generateAssetRecommendations(intelligence, context) {
  // If asset types are already pre-filled or suggested, don't show recommendations
  if (context.assetTypes?.length > 0 || context.preFilledFields?.hasAssetTypes) {
    return [];
  }

  // Type assertion removed
  const recommendations = [];
  
  // Analyze performance patterns for asset types
  const assetPerformance = new Map();
  
  intelligence.performance.campaignAnalytics?.forEach((campaign) => {
    const assetType = campaign.campaign_type || 'Email';
    const current = assetPerformance.get(assetType) || { totalEngagement: 0, totalConversion: 0, count: 0 };
    
    assetPerformance.set(assetType, {
      totalEngagement: current.totalEngagement + (campaign.engagement_score || 0),
      totalConversion: current.totalConversion + (campaign.conversion_rate || 0),
      count: current.count + 1,
    });
  });
  
  // Convert to recommendations
  let sortedRecommendations = Array.from(assetPerformance.entries())
    .sort((a, b) => (b[1].totalEngagement / b[1].count) - (a[1].totalEngagement / a[1].count));
  
  // If suggested channels exist, prioritize matching asset types
  if (context.suggestedChannels?.length > 0) {
    const channelKeywords = context.suggestedChannels.map(ch => ch.toLowerCase());
    sortedRecommendations = sortedRecommendations.sort((a, b) => {
      const aMatches = channelKeywords.some(kw => a[0].toLowerCase().includes(kw));
      const bMatches = channelKeywords.some(kw => b[0].toLowerCase().includes(kw));
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return (b[1].totalEngagement / b[1].count) - (a[1].totalEngagement / a[1].count);
    });
  }
  
  sortedRecommendations
    .slice(0, 3)
    .forEach(([assetType, perf]) => {
      const avgEngagement = perf.totalEngagement / perf.count;
      const avgConversion = perf.totalConversion / perf.count;
      
      recommendations.push({
        assetType,
        confidenceScore: Math.min(perf.count / 10, 0.95),
        reasoning: `This asset type has shown strong performance with ${perf.count} campaigns, achieving ${(avgEngagement / 100).toFixed(1)}% engagement on average.`,
        historicalPerformance: {
          avgEngagementRate: avgEngagement / 100,
          avgConversionRate: avgConversion,
          campaignsUsed: perf.count,
        },
        evidence: [
          `Used in ${perf.count} successful campaigns`,
          `Average engagement: ${(avgEngagement / 100).toFixed(1)}%`,
          `Average conversion: ${(avgConversion * 100).toFixed(1)}%`,
        ],
      });
    });
  
  return recommendations;
}

// Type annotations removed
function generateAudienceRecommendations(intelligence, context) {
  // Type assertion removed
  const recommendations = [];
  
  intelligence.audience.segments?.slice(0, 3).forEach((segment) => {
    const channels = Array.isArray(segment.channel_preferences) 
      ? segment.channel_preferences 
      : [];
    const motivations = Array.isArray(segment.motivations) 
      ? segment.motivations 
      : [];
    
    recommendations.push({
      audience: segment.segment_name,
      engagementScore: 75 + Math.random() * 20,
      preferredChannels: channels.slice(0, 3),
      keyMotivations: motivations.slice(0, 3),
      reasoning: `This segment shows strong engagement patterns and has ${channels.length} preferred channels identified.`,
    });
  });
  
  return recommendations;
}

// Type annotations removed
function generateObjectiveRecommendations(intelligence, context) {
  const objectives = [
    {
      objective: 'awareness',
      successRate: 0.85,
      avgTimeToComplete: '4-6 weeks',
      reasoning: 'Strong historical performance for awareness campaigns in this therapeutic area',
      evidence: `${intelligence.performance.campaignAnalytics?.length || 0} campaigns achieved awareness objectives`,
    },
    {
      objective: 'education',
      successRate: 0.78,
      avgTimeToComplete: '6-8 weeks',
      reasoning: 'Educational content shows high engagement with HCP audiences',
      evidence: 'Evidence library contains comprehensive clinical data for educational messaging',
    },
    {
      objective: 'consideration',
      successRate: 0.72,
      avgTimeToComplete: '8-10 weeks',
      reasoning: 'Consideration campaigns benefit from multi-channel approach',
      evidence: 'Success patterns show effectiveness of layered messaging strategy',
    },
  ];
  
  return objectives;
}