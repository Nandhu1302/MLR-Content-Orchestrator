
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, FileText, Target, Sparkles, MapPin, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ChannelIntelligenceService } from '@/services/channelIntelligenceService';
import { Skeleton } from '@/components/ui/skeleton';
import { transformChannelIntelligenceToOpportunity } from '@/utils/channelIntelligenceToOpportunity';
import { ChannelContentEnhancerService } from '@/services/channelContentEnhancerService';
import { EvidenceRecommendationService } from '@/services/evidenceRecommendationService';
import { useBrand } from '@/contexts/BrandContext';

export const RepEnabledIntelligencePanel = ({ brandId, filters, onGenerateContent }) => {
  const { selectedBrand } = useBrand();
  const [isEnhancing, setIsEnhancing] = useState(false);

  const { data: intelligence, isLoading } = useQuery({
    queryKey: ['rep-enabled-intelligence', brandId, filters],
    queryFn: () => ChannelIntelligenceService.getRepEnabledIntelligence(brandId, filters),
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

  const totalCalls = intelligence?.activityHeatmap.reduce((sum, a) => sum + a.calls, 0) || 0;
  const avgEngagement =
    intelligence?.activityHeatmap.reduce((sum, a) => sum + a.avgEngagementScore * a.calls, 0) /
    (totalCalls || 1);

  const handleGenerateFromTopPerformers = async () => {
    setIsEnhancing(true);
    try {
      const enhanced = await ChannelContentEnhancerService.enhance({
        channel: 'rep-enabled',
        audienceType: filters.audienceType || 'HCP',
        audienceSegment: filters.audienceSegment,
        brandContext: {
          name: selectedBrand?.brand_name || 'Brand',
          therapeuticArea: selectedBrand?.therapeutic_area || 'Therapeutic Area'
        },
        channelData: {
          topContent: intelligence?.contentEffectiveness.slice(0, 3),
          topNBAs: intelligence?.topNBAs.slice(0, 3),
          activityHeatmap: intelligence?.activityHeatmap.slice(0, 5)
        }
      });

      const evidence = await EvidenceRecommendationService.getRecommendedEvidence(
        brandId,
        ['digital-sales-aid', 'rep-triggered-email'],
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
          channel: 'Rep-Enabled',
          insight: 'content-effectiveness',
          topContent: intelligence?.contentEffectiveness.slice(0, 3),
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
          <Users className="h-5 w-5 text-primary" />
          Rep-Enabled Intelligence
        </CardTitle>
        <CardDescription>
          {filters.audienceSegment && `${filters.audienceSegment}`} - Field activity and content effectiveness insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-xl font-bold">{totalCalls.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Calls</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{avgEngagement?.toFixed(1) || 0}</p>
            <p className="text-xs text-muted-foreground">Avg Engagement</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{intelligence?.contentEffectiveness.length || 0}</p>
            <p className="text-xs text-muted-foreground">Content Pieces</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{intelligence?.topNBAs.length || 0}</p>
            <p className="text-xs text-muted-foreground">Active NBAs</p>
          </div>
        </div>

        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="activity">Activity Heatmap</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="nba">Next Best Actions</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <h4 className="font-semibold">Activity by Specialty & Region</h4>
            <div className="grid grid-cols-2 gap-3">
              {intelligence?.activityHeatmap.slice(0, 8).map((item, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="font-medium">{item.specialty}</div>
                  <div className="text-xs text-muted-foreground">{item.region}</div>
                  <div className="text-sm">{item.calls} calls</div>
                  <Badge variant={item.avgEngagementScore >= 7.5 ? 'default' : 'secondary'}>
                    {item.avgEngagementScore} engagement
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <h4 className="font-semibold">Content Effectiveness</h4>
            <p className="text-sm text-muted-foreground">See which content pieces drive the highest HCP engagement.</p>
            <div className="space-y-2">
              {intelligence?.contentEffectiveness.map((content, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="font-medium">{content.content}</div>
                  <div className="text-xs text-muted-foreground">Used {content.usageCount} times</div>
                  <Badge
                    variant={content.avgEngagement >= 7.5 ? 'default' : 'secondary'}
                    className={content.avgEngagement >= 7.5 ? 'bg-green-100 text-green-700' : ''}
                  >
                    {content.avgEngagement} avg engagement
                  </Badge>
                </div>
              ))}
            </div>
            <Button onClick={handleGenerateFromTopPerformers} disabled={isEnhancing} className="mt-4">
              {isEnhancing ? 'Enhancing with AI...' : 'Generate Sales Aid'}
            </Button>
          </TabsContent>

          <TabsContent value="nba" className="space-y-4">
            <h4 className="font-semibold">Next Best Actions</h4>
            <p className="text-sm text-muted-foreground">Most effective follow-up actions from field visits.</p>
            <div className="space-y-2">
              {intelligence?.topNBAs.map((nba, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="font-medium">{nba.action}</div>
                  <div className="text-xs text-muted-foreground">Recommended {nba.count} times</div>
                  <div className="text-xs">{nba.conversionRate}% conversion</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <h4 className="font-semibold">Engagement Trends</h4>
            <div className="space-y-2">
              {intelligence?.hcpEngagementTrends.map((trend, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{trend.month}</span>
                  <span>{trend.callVolume} calls • {trend.avgEngagement} engagement</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};