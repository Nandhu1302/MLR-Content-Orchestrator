
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, TrendingUp, Clock, Users, MousePointerClick, Sparkles, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ChannelIntelligenceService } from '@/services/channelIntelligenceService';
import { Skeleton } from '@/components/ui/skeleton';
import { transformChannelIntelligenceToOpportunity } from '@/utils/channelIntelligenceToOpportunity';
import { ChannelContentEnhancerService } from '@/services/channelContentEnhancerService';
import { EvidenceRecommendationService } from '@/services/evidenceRecommendationService';
import { useBrand } from '@/contexts/BrandContext';

export const EmailIntelligencePanel = ({ brandId, filters, onGenerateContent }) => {
  const { selectedBrand } = useBrand();
  const [isEnhancing, setIsEnhancing] = useState(false);

  const { data: intelligence, isLoading } = useQuery({
    queryKey: ['email-intelligence', brandId, filters],
    queryFn: () => ChannelIntelligenceService.getEmailIntelligence(brandId, filters),
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

  const topCampaign = intelligence?.campaignPerformance[0];
  const avgOpenRate =
    intelligence?.campaignPerformance.reduce((sum, c) => sum + c.openRate, 0) /
    (intelligence?.campaignPerformance.length || 1);
  const avgClickRate =
    intelligence?.campaignPerformance.reduce((sum, c) => sum + c.clickRate, 0) /
    (intelligence?.campaignPerformance.length || 1);

  const handleGenerateFromSubjectLines = async () => {
    setIsEnhancing(true);
    try {
      const enhanced = await ChannelContentEnhancerService.enhance({
        channel: 'email',
        audienceType: filters.audienceType || 'HCP',
        audienceSegment: filters.audienceSegment,
        brandContext: {
          name: selectedBrand?.brand_name || 'Brand',
          therapeuticArea: selectedBrand?.therapeutic_area || 'Therapeutic Area'
        },
        channelData: {
          topSubjects: intelligence?.topPerformingSubjects,
          campaigns: intelligence?.campaignPerformance.slice(0, 3),
          sendTimes: intelligence?.optimalSendTimes.slice(0, 3)
        }
      });

      const evidence = await EvidenceRecommendationService.getRecommendedEvidence(
        brandId,
        ['mass-email'],
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
          channel: 'Email',
          insight: 'subject-lines',
          topSubjects: intelligence?.topPerformingSubjects,
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
          <Mail className="h-5 w-5 text-primary" />
          Email Intelligence
        </CardTitle>
        <CardDescription>
          {filters.audienceType && `${filters.audienceType} Campaigns`} - Campaign performance for{' '}
          {filters.audienceSegment || filters.audienceType || 'all audiences'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Performance Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-xl font-bold">{avgOpenRate?.toFixed(1) || 0}%</p>
            <p className="text-xs text-muted-foreground">Avg Open Rate</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{avgClickRate?.toFixed(1) || 0}%</p>
            <p className="text-xs text-muted-foreground">Avg Click Rate</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{intelligence?.campaignPerformance.length || 0}</p>
            <p className="text-xs text-muted-foreground">Campaigns</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{topCampaign?.conversionRate?.toFixed(1) || 0}%</p>
            <p className="text-xs text-muted-foreground">Top Conv. Rate</p>
          </div>
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="subjects">Subject Lines</TabsTrigger>
            <TabsTrigger value="timing">Send Timing</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            {intelligence?.campaignPerformance.slice(0, 5).map((campaign, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="font-medium">{campaign.campaignName}</div>
                <div className="text-xs text-muted-foreground">{campaign.audienceSegment}</div>
                <Badge variant={campaign.openRate > avgOpenRate ? 'default' : 'secondary'}>
                  {campaign.openRate > avgOpenRate ? 'Above avg' : 'Below avg'}
                </Badge>
                <div className="text-xs mt-2">
                  Opens: {campaign.openRate}% • Clicks: {campaign.clickRate}% • Conv: {campaign.conversionRate}% • Sends:{' '}
                  {campaign.sends.toLocaleString()}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <h4 className="font-semibold">Top Performing Subject Lines</h4>
            <p className="text-sm text-muted-foreground">Use these patterns to improve your email open rates.</p>
            <div className="space-y-2">
              {intelligence?.topPerformingSubjects.map((subject, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>"{subject.subject}"</span>
                  <span>{subject.openRate}% open rate</span>
                </div>
              ))}
            </div>
            <Button onClick={handleGenerateFromSubjectLines} disabled={isEnhancing} className="mt-4">
              {isEnhancing ? 'Enhancing with AI...' : 'Generate Email Content'}
            </Button>
          </TabsContent>

          <TabsContent value="timing" className="space-y-4">
            <h4 className="font-semibold">Optimal Send Times</h4>
            <p className="text-sm text-muted-foreground">
              Best times to reach {filters.audienceType || 'your audience'} based on historical data.
            </p>
            <div className="space-y-2">
              {intelligence?.optimalSendTimes.map((time, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>
                    {time.dayOfWeek} at {time.hour}:00
                  </span>
                  <span>{time.avgOpenRate}% avg open rate</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="segments" className="space-y-4">
            <h4 className="font-semibold">Audience Segment Performance</h4>
            <div className="space-y-2">
              {intelligence?.audienceEngagement.map((segment, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{segment.segment}</span>
                  <span>
                    Trend: {segment.trend === 'up' ? '📈 Improving' : '➡️ Stable'} • {segment.avgEngagement}% engagement
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};