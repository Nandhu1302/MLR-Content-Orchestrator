import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Layers, 
  TrendingUp, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
// Type import removed
import { ChannelIntelligenceService } from '@/services/channelIntelligenceService';
import { Skeleton } from '@/components/ui/skeleton';

// Interface removed
// interface CrossChannelIntelligencePanelProps {
//   brandId: string;
//   filters: ChannelFilters;
// }

// Interface and type annotations removed
export const CrossChannelIntelligencePanel = ({
  brandId,
  filters
}) => {
  const { data: intelligence, isLoading } = useQuery({
    queryKey: ['cross-channel-intelligence', brandId, filters],
    queryFn: () => ChannelIntelligenceService.getCrossChannelIntelligence(brandId, filters),
    enabled: !!brandId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-500" />
            <CardTitle>Cross-Channel Intelligence</CardTitle>
          </div>
          <Badge variant="secondary">Multi-Touch Analysis</Badge>
        </div>
        <CardDescription>
          Understand how channels work together to drive conversions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="journeys" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="journeys">Customer Journeys</TabsTrigger>
            <TabsTrigger value="attribution">Attribution</TabsTrigger>
            <TabsTrigger value="multitouch">Multi-Touch Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="journeys" className="mt-4 space-y-3">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-sm">Top Converting Journeys</span>
              </div>
              <p className="text-sm text-muted-foreground">
                These channel combinations drive the highest conversion rates.
              </p>
            </div>
            {intelligence?.journeyConversions.map((journey, idx) => (
              <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {journey.journey.split(' → ').map((step, stepIdx, arr) => (
                      <React.Fragment key={stepIdx}>
                        <Badge variant="outline">{step}</Badge>
                        {stepIdx < arr.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {journey.conversions} conversions
                  </span>
                  <Badge className="bg-green-100 text-green-700">
                    {journey.conversionRate}% conversion rate
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="attribution" className="mt-4 space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Channel Attribution</span>
              </div>
              <p className="text-sm text-muted-foreground">
                How each channel contributes to customer journeys.
              </p>
            </div>
            {intelligence?.channelAttribution.map((channel, idx) => (
              <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{channel.channel}</span>
                  <span className="text-sm text-muted-foreground">
                    {channel.influenced}% influenced
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">First Touch</div>
                    <Progress value={channel.firstTouch} className="h-2" />
                    <div className="mt-1 font-medium">{channel.firstTouch}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Last Touch</div>
                    <Progress value={channel.lastTouch} className="h-2" />
                    <div className="mt-1 font-medium">{channel.lastTouch}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Influenced</div>
                    <Progress value={channel.influenced} className="h-2" />
                    <div className="mt-1 font-medium">{channel.influenced}%</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="multitouch" className="mt-4 space-y-3">
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-sm">Multi-Touch Synergy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Channel combinations that amplify engagement and conversions.
              </p>
            </div>
            {intelligence?.multiTouchInsights.map((insight, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{insight.touchpointCombo}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Combined touchpoint effect
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {insight.engagementLift}x engagement
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {insight.conversionLift}x conversion
                  </Badge>
                </div>
              </div>
            ))}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-sm">Key Insight</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Combining Website + Rep + Email touchpoints delivers <strong className="text-foreground">4.1x higher conversion rates</strong> than single-channel approaches.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};