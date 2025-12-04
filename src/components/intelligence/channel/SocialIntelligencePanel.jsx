
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Share2, TrendingUp, MessageCircle, Sparkles, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ChannelIntelligenceService } from '@/services/channelIntelligenceService';
import { Skeleton } from '@/components/ui/skeleton';
import { transformChannelIntelligenceToOpportunity } from '@/utils/channelIntelligenceToOpportunity';
import { ChannelContentEnhancerService } from '@/services/channelContentEnhancerService';
import { EvidenceRecommendationService } from '@/services/evidenceRecommendationService';
import { useBrand } from '@/contexts/BrandContext';

export const SocialIntelligencePanel = ({ brandId, filters, onGenerateContent }) => {
  const { selectedBrand } = useBrand();
  const [isEnhancing, setIsEnhancing] = useState(false);

  const { data: intelligence, isLoading } = useQuery({
    queryKey: ['social-intelligence', brandId, filters],
    queryFn: () => ChannelIntelligenceService.getSocialIntelligence(brandId, filters),
    enabled: !!brandId
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  const totalMentions =
    intelligence?.platformSentiment.reduce((sum, p) => sum + p.totalMentions, 0) || 0;

  const avgPositive =
    intelligence?.platformSentiment.reduce((sum, p) => sum + p.positivePct, 0) /
    (intelligence?.platformSentiment.length || 1);

  const handleGenerateForTrendingTopics = async () => {
    setIsEnhancing(true);
    try {
      const enhanced = await ChannelContentEnhancerService.enhance({
        channel: 'social',
        audienceType: filters.audienceType || 'HCP',
        audienceSegment: filters.audienceSegment,
        brandContext: {
          name: selectedBrand?.brand_name || 'Brand',
          therapeuticArea: selectedBrand?.therapeutic_area || 'Therapeutic Area'
        },
        channelData: {
          trendingTopics: intelligence?.trendingTopics.slice(0, 3),
          platformSentiment: intelligence?.platformSentiment,
          topMentions: intelligence?.topMentions.slice(0, 3)
        }
      });

      const evidence = await EvidenceRecommendationService.getRecommendedEvidence(
        brandId,
        ['social-media-post'],
        filters.audienceType || 'Physician-Specialist',
        {
          claimLimit: 5,
          visualLimit: 5,
          moduleLimit: 3,
          includeNonMLRApproved: true
        }
      );

      const transformed = transformChannelIntelligenceToOpportunity(
        {
          channel: 'Social',
          insight: 'trending-topics',
          topics: intelligence?.trendingTopics.slice(0, 3),
          audienceType: filters.audienceType,
          audienceSegment: filters.audienceSegment
        },
        filters,
        enhanced
      );

      onGenerateContent?.({ ...transformed, recommendedEvidence: evidence });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          Social Intelligence
        </CardTitle>
        <CardDescription>
          {filters.audienceType && `${filters.audienceType} Conversations`} - Social listening
          insights for {filters.audienceType || 'all audiences'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-xl font-bold">{totalMentions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Mentions</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{avgPositive?.toFixed(0) || 0}%</p>
            <p className="text-xs text-muted-foreground">Positive Sentiment</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{intelligence?.trendingTopics.length || 0}</p>
            <p className="text-xs text-muted-foreground">Trending Topics</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{intelligence?.platformSentiment.length || 0}</p>
            <p className="text-xs text-muted-foreground">Platforms</p>
          </div>
        </div>

        <Tabs defaultValue="platforms" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="mentions">Top Mentions</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {intelligence?.platformSentiment.map((platform, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="font-medium">{platform.platform}</div>
                  <div className="text-xs text-muted-foreground">
                    {platform.totalMentions} mentions
                  </div>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-3 w-3 text-green-600" />
                      <span>Positive</span>
                      <span className="ml-auto">{platform.positivePct}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Minus className="h-3 w-3 text-muted-foreground" />
                      <span>Neutral</span>
                      <span className="ml-auto">{platform.neutralPct}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="h-3 w-3 text-red-600" />
                      <span>Negative</span>
                      <span className="ml-auto">{platform.negativePct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            <div className="space-y-3">
              {intelligence?.trendingTopics.map((topic, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="font-medium">{topic.topic}</div>
                  <div className="text-xs text-muted-foreground">
                    {topic.volume} mentions • {topic.growth > 0 ? '+' : ''}{topic.growth}% growth
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      topic.sentiment > 0.3
                        ? 'bg-green-100 text-green-700'
                        : topic.sentiment < -0.3
                        ? 'bg-red-100 text-red-700'
                        : ''
                    }
                  >
                    {topic.sentiment > 0.3
                      ? '😊 Positive'
                      : topic.sentiment < -0.3
                      ? '😟 Negative'
                      : '😐 Neutral'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button onClick={handleGenerateForTrendingTopics} disabled={isEnhancing} className="mt-2">
              {isEnhancing ? 'Enhancing with AI...' : 'Generate Social Content'}
            </Button>
          </TabsContent>

          <TabsContent value="mentions" className="space-y-4">
            <div className="space-y-3">
              {intelligence?.topMentions.map((mention, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">{mention.platform}</Badge>
                    <Badge variant="secondary">{mention.sentiment}</Badge>
                  </div>
                  <div className="text-sm mt-1">"{mention.text}"</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Reach: {mention.reach.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};