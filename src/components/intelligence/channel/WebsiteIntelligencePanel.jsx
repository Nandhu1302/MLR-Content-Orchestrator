
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Globe, FileDown, Video, Search, MousePointerClick, FileText, TrendingUp, Clock, Users, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ChannelIntelligenceService } from '@/services/channelIntelligenceService';
import { Skeleton } from '@/components/ui/skeleton';
import { transformChannelIntelligenceToOpportunity } from '@/utils/channelIntelligenceToOpportunity';
import { ChannelContentEnhancerService } from '@/services/channelContentEnhancerService';
import { EvidenceRecommendationService } from '@/services/evidenceRecommendationService';
import { useBrand } from '@/contexts/BrandContext';

export const WebsiteIntelligencePanel = ({ brandId, filters, onGenerateContent }) => {
  const { selectedBrand } = useBrand();
  const [isEnhancing, setIsEnhancing] = useState(false);

  const { data: intelligence, isLoading } = useQuery({
    queryKey: ['website-intelligence', brandId, filters],
    queryFn: () => ChannelIntelligenceService.getWebsiteIntelligence(brandId, filters),
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

  const handleGenerateForTopPages = async () => {
    setIsEnhancing(true);
    try {
      const enhanced = await ChannelContentEnhancerService.enhance({
        channel: 'website',
        audienceType: filters.audienceType || 'HCP',
        audienceSegment: filters.audienceSegment,
        brandContext: {
          name: selectedBrand?.brand_name || 'Brand',
          therapeuticArea: selectedBrand?.therapeutic_area || 'Therapeutic Area'
        },
        channelData: {
          topPages: intelligence?.topPages.slice(0, 3),
          searchTerms: intelligence?.topSearchTerms.slice(0, 5),
          downloads: intelligence?.topDownloads.slice(0, 3)
        }
      });

      const evidence = await EvidenceRecommendationService.getRecommendedEvidence(
        brandId,
        ['website-landing-page'],
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
          channel: 'Website',
          insight: 'top-pages',
          pages: intelligence?.topPages.slice(0, 3),
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

  const handleGenerateForSearchTerms = async () => {
    setIsEnhancing(true);
    try {
      const enhanced = await ChannelContentEnhancerService.enhance({
        channel: 'website',
        audienceType: filters.audienceType || 'HCP',
        audienceSegment: filters.audienceSegment,
        brandContext: {
          name: selectedBrand?.brand_name || 'Brand',
          therapeuticArea: selectedBrand?.therapeutic_area || 'Therapeutic Area'
        },
        channelData: {
          topPages: intelligence?.topPages.slice(0, 3),
          searchTerms: intelligence?.topSearchTerms.slice(0, 5),
          downloads: intelligence?.topDownloads.slice(0, 3)
        }
      });

      const evidence = await EvidenceRecommendationService.getRecommendedEvidence(
        brandId,
        ['website-landing-page'],
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
          channel: 'Website',
          insight: 'search-terms',
          terms: intelligence?.topSearchTerms.slice(0, 5),
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
          <Globe className="h-5 w-5 text-primary" />
          Website Intelligence
        </CardTitle>
        <CardDescription>
          {filters.audienceType && `${filters.audienceType} View`} - Performance insights for{' '}
          {filters.audienceSegment || filters.audienceType || 'all visitors'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Engagement Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-xl font-bold">{intelligence?.engagementMetrics.avgSessionDuration || 0}s</p>
            <p className="text-xs text-muted-foreground">Avg Session</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{intelligence?.engagementMetrics.avgPagesPerSession || 0}</p>
            <p className="text-xs text-muted-foreground">Pages/Session</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{intelligence?.engagementMetrics.returnVisitorRate || 0}%</p>
            <p className="text-xs text-muted-foreground">Return Rate</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{intelligence?.topPages?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Active Pages</p>
          </div>
        </div>

        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="search">Search Terms</TabsTrigger>
            <TabsTrigger value="ctas">CTAs</TabsTrigger>
            <TabsTrigger value="journey">Journey</TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-4">
            {intelligence?.topPages.slice(0, 5).map((page, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="font-medium">{page.page}</div>
                <div className="text-xs text-muted-foreground">
                  {page.visits} visits • {page.avgTimeOnPage}s avg • {page.avgScrollDepth}% scroll
                </div>
              </div>
            ))}
            {intelligence?.topPages && intelligence.topPages.length > 0 && (
              <Button onClick={handleGenerateForTopPages} disabled={isEnhancing} className="mt-4">
                {isEnhancing ? 'Enhancing with AI...' : 'Generate Website Content'}
              </Button>
            )}
          </TabsContent>

          <TabsContent value="downloads" className="space-y-4">
            {intelligence?.topDownloads.map((dl, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="font-medium">{dl.resource}</div>
                <div className="text-xs text-muted-foreground">{dl.downloads} downloads</div>
              </div>
            ))}
            {intelligence?.topVideos && intelligence.topVideos.length > 0 && (
              <>
                <h4 className="font-semibold mt-4">Top Videos</h4>
                {intelligence.topVideos.map((video, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="font-medium">{video.video}</div>
                    <div className="text-xs text-muted-foreground">
                      {video.views} views • {video.avgCompletion}% completion
                    </div>
                  </div>
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            {intelligence?.topSearchTerms.map((term, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>"{term.term}"</span>
                <span>{term.count} searches</span>
              </div>
            ))}
            {intelligence?.topSearchTerms && intelligence.topSearchTerms.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Content Gap Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  These search terms reveal what {filters.audienceType || 'visitors'} are looking for. Create content to
                  address these needs.
                </p>
                <Button onClick={handleGenerateForSearchTerms} disabled={isEnhancing} className="mt-2">
                  {isEnhancing ? 'Enhancing with AI...' : 'Generate for Content Gaps'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ctas" className="space-y-4">
            {intelligence?.topCTAs.map((cta, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="font-medium">{cta.cta}</div>
                <div className="text-xs text-muted-foreground">{cta.clicks} clicks</div>
              </div>
            ))}
            {intelligence?.formSubmissions && intelligence.formSubmissions.length > 0 && (
              <>
                <h4 className="font-semibold mt-4">Form Submissions</h4>
                {intelligence.formSubmissions.map((form, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="font-medium">{form.formType.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-muted-foreground">{form.submissions}</div>
                  </div>
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="journey" className="space-y-4">
            {intelligence?.visitorJourneyStages.map((stage, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{stage.stage.replace(/_/g, ' ')}</span>
                <span>{stage.percentage}%</span>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
