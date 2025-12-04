
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Layers, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ChannelIntelligenceService } from '@/services/channelIntelligenceService';
import { Skeleton } from '@/components/ui/skeleton';

export const CrossChannelIntelligencePanel = ({ brandId, filters }) => {
  const { data: intelligence, isLoading } = useQuery({
    queryKey: ['cross-channel-intelligence', brandId, filters],
    queryFn: () => ChannelIntelligenceService.getCrossChannelIntelligence(brandId, filters),
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Cross-Channel Intelligence
        </CardTitle>
        <CardDescription>
          Multi-Touch Analysis - Understand how channels work together to drive conversions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="journeys" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="journeys">Customer Journeys</TabsTrigger>
            <TabsTrigger value="attribution">Attribution</TabsTrigger>
            <TabsTrigger value="insights">Multi-Touch Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="journeys" className="space-y-4">
            <h4 className="font-semibold text-base">Top Converting Journeys</h4>
            <p className="text-sm text-muted-foreground">
              These channel combinations drive the highest conversion rates.
            </p>
            <div className="space-y-3">
              {intelligence?.journeyConversions.map((journey, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {journey.journey.split(' → ').map((step, stepIdx, arr) => (
                      <React.Fragment key={stepIdx}>
                        <Badge variant="outline">{step}</Badge>
                        {stepIdx < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {journey.conversions} conversions • {journey.conversionRate}% conversion rate
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="attribution" className="space-y-4">
            <h4 className="font-semibold text-base">Channel Attribution</h4>
            <p className="text-sm text-muted-foreground">
              How each channel contributes to customer journeys.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {intelligence?.channelAttribution.map((channel, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="font-medium mb-2">{channel.channel}</div>
                  <div className="space-y-1 text-xs">
                    <div>First Touch: {channel.firstTouch}%</div>
                    <div>Last Touch: {channel.lastTouch}%</div>
                    <div>Influenced: {channel.influenced}%</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <h4 className="font-semibold text-base">Multi-Touch Synergy</h4>
            <p className="text-sm text-muted-foreground">
              Channel combinations that amplify engagement and conversions.
            </p>
            <div className="space-y-3">
              {intelligence?.multiTouchInsights.map((insight, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="font-medium">{insight.touchpointCombo}</div>
                  <div className="text-xs text-muted-foreground">
                    Combined touchpoint effect
                  </div>
                  <div className="text-sm">
                    {insight.engagementLift}x engagement • {insight.conversionLift}x conversion
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-accent rounded-lg text-sm">
              <Zap className="h-4 w-4 inline-block text-primary mr-1" />
              Key Insight: Combining Website + Rep + Email touchpoints delivers 4.1x higher conversion rates than single-channel approaches.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
