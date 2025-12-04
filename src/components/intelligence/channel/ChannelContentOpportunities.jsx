
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Lightbulb,
  Globe,
  Mail,
  Share2,
  Users,
  Video,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ChannelIntelligenceService } from '@/services/channelIntelligenceService';
import { ChannelOpportunityDetailModal } from './ChannelOpportunityDetailModal';

const channelIcons = {
  'Website': <Globe className="h-4 w-4" />,
  'Email': <Mail className="h-4 w-4" />,
  'Social': <Share2 className="h-4 w-4" />,
  'Rep-Enabled': <Users className="h-4 w-4" />,
  'Video': <Video className="h-4 w-4" />,
};

const typeIcons = {
  'gap': <AlertTriangle className="h-4 w-4 text-orange-500" />,
  'trending': <TrendingUp className="h-4 w-4 text-green-500" />,
  'optimization': <Target className="h-4 w-4 text-blue-500" />,
  'response': <Lightbulb className="h-4 w-4 text-purple-500" />,
};

export const ChannelContentOpportunities = ({
  brandId,
  filters
}) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Fetch channel-specific data to generate opportunities
  const { data: websiteData } = useQuery({
    queryKey: ['website-intelligence-opportunities', brandId, filters],
    queryFn: () => ChannelIntelligenceService.getWebsiteIntelligence(brandId, filters),
    enabled: !!brandId && (!filters.channel || filters.channel === 'Website')
  });

  const { data: emailData } = useQuery({
    queryKey: ['email-intelligence-opportunities', brandId, filters],
    queryFn: () => ChannelIntelligenceService.getEmailIntelligence(brandId, filters),
    enabled: !!brandId && (!filters.channel || filters.channel === 'Email')
  });

  const { data: socialData } = useQuery({
    queryKey: ['social-intelligence-opportunities', brandId, filters],
    queryFn: () => ChannelIntelligenceService.getSocialIntelligence(brandId, filters),
    enabled: !!brandId && (!filters.channel || filters.channel === 'Social')
  });

  // Generate opportunities based on channel intelligence
  const opportunities = React.useMemo(() => {
    const opps = [];

    // Website opportunities from search terms
    if (websiteData?.topSearchTerms && websiteData.topSearchTerms.length > 0) {
      const topTerm = websiteData.topSearchTerms[0];
      opps.push({
        id: 'website-search-gap',
        title: `Address "${topTerm.term}" Content Gap`,
        description: `${topTerm.count} visitors searched for "${topTerm.term}" - create dedicated content to address this need.`,
        channel: 'Website',
        audienceType: filters.audienceType || 'All',
        priority: topTerm.count > 50 ? 'high' : 'medium',
        type: 'gap',
        dataSource: 'web_analytics_raw',
        metrics: { searches: topTerm.count },
        recommendedAssetTypes: ['website-landing-page', 'web-content', 'blog']
      });
    }

    // Website opportunities from low scroll depth
    if (websiteData?.topPages) {
      const lowEngagementPages = websiteData.topPages.filter(p => p.avgScrollDepth < 50);
      if (lowEngagementPages.length > 0) {
        opps.push({
          id: 'website-engagement-optimization',
          title: `Improve Content on ${lowEngagementPages[0].page}`,
          description: `Only ${lowEngagementPages[0].avgScrollDepth}% scroll depth - optimize content structure and CTAs for better engagement.`,
          channel: 'Website',
          audienceType: filters.audienceType || 'All',
          priority: 'medium',
          type: 'optimization',
          dataSource: 'web_analytics_raw',
          metrics: { scrollDepth: lowEngagementPages[0].avgScrollDepth, visits: lowEngagementPages[0].visits },
          recommendedAssetTypes: ['web-content']
        });
      }
    }

    // Email opportunities from segment performance
    if (emailData?.audienceEngagement) {
      const lowEngagementSegments = emailData.audienceEngagement.filter(s => s.avgEngagement < 15);
      if (lowEngagementSegments.length > 0) {
        const segment = lowEngagementSegments[0];
        // Parse audience type from segment name (e.g., "Patient-Newly Diagnosed" -> "Patient")
        const segmentParts = segment.segment.split('-');
        const audienceType = segmentParts[0] || 'All';
        const audienceSegment = segmentParts.slice(1).join('-') || undefined;

        // Determine recommended asset types based on audience
        let recommendedAssetTypes = [];
        if (audienceType.toLowerCase().includes('patient')) {
          recommendedAssetTypes = ['patient-email', 'mass-email'];
        } else if (
          audienceType.toLowerCase().includes('hcp') ||
          audienceType.toLowerCase().includes('physician') ||
          audienceType.toLowerCase().includes('nurse') ||
          audienceType.toLowerCase().includes('pharmacist')
        ) {
          recommendedAssetTypes = ['hcp-email', 'rep-triggered-email'];
        } else if (audienceType.toLowerCase().includes('caregiver')) {
          recommendedAssetTypes = ['patient-email', 'mass-email'];
        } else {
          recommendedAssetTypes = ['mass-email'];
        }

        opps.push({
          id: 'email-segment-reengagement',
          title: `Re-engage ${segment.segment} Segment`,
          description: `${segment.avgEngagement}% engagement - create targeted campaign to re-activate this audience.`,
          channel: 'Email',
          audienceType: audienceType,
          priority: 'high',
          type: 'response',
          dataSource: 'sfmc_campaign_raw',
          metrics: { engagement: segment.avgEngagement, segment: audienceSegment },
          recommendedAssetTypes
        });
      }
    }

    // Social opportunities from trending topics - using lowered thresholds for realistic data
    if (socialData?.trendingTopics && socialData.trendingTopics.length > 0) {
      // Positive trending topics (lowered threshold from 0.3 to 0.05)
      const positiveTrending = socialData.trendingTopics.filter(t => t.sentiment > 0.05 && t.growth > 10);
      if (positiveTrending.length > 0) {
        const topic = positiveTrending[0];
        opps.push({
          id: 'social-trending-amplification',
          title: `Amplify "${topic.topic}" Momentum`,
          description: `${topic.growth}% growth with positive sentiment (${(topic.sentiment * 100).toFixed(0)}%) - create content to ride this wave.`,
          channel: 'Social',
          audienceType: filters.audienceType || 'All',
          priority: 'high',
          type: 'trending',
          dataSource: 'social_listening_raw',
          metrics: { volume: topic.volume, growth: topic.growth, sentiment: topic.sentiment },
          recommendedAssetTypes: ['social-media-post', 'paid-social-ad']
        });
      }

      // Negative trending topics (lowered threshold from -0.3 to -0.05)
      const negativeTrending = socialData.trendingTopics.filter(t => t.sentiment < -0.05);
      if (negativeTrending.length > 0) {
        const topic = negativeTrending[0];
        opps.push({
          id: 'social-sentiment-response',
          title: `Address "${topic.topic}" Concerns`,
          description: `Negative sentiment (${(topic.sentiment * 100).toFixed(0)}%) detected around "${topic.topic}" with ${topic.volume} mentions - create educational response content.`,
          channel: 'Social',
          audienceType: filters.audienceType || 'All',
          priority: 'high',
          type: 'response',
          dataSource: 'social_listening_raw',
          metrics: { volume: topic.volume, sentiment: topic.sentiment },
          recommendedAssetTypes: ['social-media-post', 'blog', 'patient-email']
        });
      }

      // High-volume topics (volume-based opportunity regardless of sentiment)
      const highVolumeTopic = socialData.trendingTopics.find(t =>
        t.volume > 100 &&
        !positiveTrending.includes(t) &&
        !negativeTrending.includes(t)
      );
      if (highVolumeTopic) {
        opps.push({
          id: 'social-volume-opportunity',
          title: `Create Content for "${highVolumeTopic.topic}"`,
          description: `${highVolumeTopic.volume} mentions indicate high audience interest - opportunity to establish thought leadership.`,
          channel: 'Social',
          audienceType: filters.audienceType || 'All',
          priority: 'medium',
          type: 'trending',
          dataSource: 'social_listening_raw',
          metrics: { volume: highVolumeTopic.volume, sentiment: highVolumeTopic.sentiment },
          recommendedAssetTypes: ['social-media-post', 'blog']
        });
      }

      // Neutral sentiment topics with decent volume (engagement opportunity)
      const neutralTopic = socialData.trendingTopics.find(t =>
        t.sentiment >= -0.05 && t.sentiment <= 0.05 &&
        t.volume > 50 &&
        !positiveTrending.includes(t) &&
        !negativeTrending.includes(t) &&
        t !== highVolumeTopic
      );
      if (neutralTopic) {
        opps.push({
          id: 'social-engagement-opportunity',
          title: `Shape Conversation on "${neutralTopic.topic}"`,
          description: `Neutral sentiment with ${neutralTopic.volume} mentions - opportunity to positively influence the narrative.`,
          channel: 'Social',
          audienceType: filters.audienceType || 'All',
          priority: 'medium',
          type: 'optimization',
          dataSource: 'social_listening_raw',
          metrics: { volume: neutralTopic.volume, sentiment: neutralTopic.sentiment },
          recommendedAssetTypes: ['social-media-post', 'paid-social-ad']
        });
      }
    }

    // Comprehensive filtering by all active filters
    let filtered = opps;

    // Filter by channel
    if (filters.channel) {
      filtered = filtered.filter(o => o.channel === filters.channel);
    }

    // Filter by audience type
    if (filters.audienceType) {
      filtered = filtered.filter(o => {
        // Match exact audience type or "All"
        return o.audienceType === filters.audienceType || o.audienceType === 'All';
      });
    }

    // Filter by audience segment
    if (filters.audienceSegment) {
      filtered = filtered.filter(o => {
        // Check if opportunity has segment-specific data in metrics
        const oppSegment = o.metrics?.segment;
        if (!oppSegment) {
          // No specific segment - opportunity applies to all segments
          return true;
        }
        // Match the specific segment
        return oppSegment === filters.audienceSegment;
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [websiteData, emailData, socialData, filters]);

  const handleGenerateContent = (opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <CardTitle>Content Opportunities</CardTitle>
          </div>
          <Badge variant="secondary">
            {opportunities.length} opportunities
          </Badge>
        </div>
        <CardDescription>
          Data-driven content recommendations for {filters.channel || 'all channels'}
          {filters.audienceType && ` targeting ${filters.audienceType}`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {opportunities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p>No specific opportunities detected for the current filters.</p>
            <p className="text-sm mt-1">Try selecting a different channel or audience.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className={`p-4 rounded-lg border-l-4 ${
                  opp.priority === 'high' ? 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20' :
                  opp.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20' :
                  'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {typeIcons[opp.type]}
                      <span className="font-medium">{opp.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {opp.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="gap-1">
                        {channelIcons[opp.channel]}
                        {opp.channel}
                      </Badge>
                      <Badge variant="outline">{opp.audienceType}</Badge>
                      <Badge variant="outline" className="text-xs">
                        Source: {opp.dataSource}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleGenerateContent(opp)}
                    className="shrink-0"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate from Opportunity
                  </Button>
                </div>

                {opp.recommendedAssetTypes.length > 0 && (
                  <div className="mt-3 pt-3 border-t flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Recommended:</span>
                    {opp.recommendedAssetTypes.slice(0, 3).map((type, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs capitalize">
                        {type.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <ChannelOpportunityDetailModal
        opportunity={selectedOpportunity}
        open={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        filters={filters}
      />
    </Card>
  );
};
