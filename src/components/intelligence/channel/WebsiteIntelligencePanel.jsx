import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  FileDown, 
  Video, 
  Search, 
  MousePointerClick,
  FileText,
  TrendingUp,
  Clock,
  Users,
  Sparkles
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
// Removed: import { ChannelFilters } from '@/services/channelIntelligenceService';
import { ChannelIntelligenceService } from '@/services/channelIntelligenceService';
import { Skeleton } from '@/components/ui/skeleton';
import { transformChannelIntelligenceToOpportunity } from '@/utils/channelIntelligenceToOpportunity';
import { ChannelContentEnhancerService } from '@/services/channelContentEnhancerService';
import { EvidenceRecommendationService } from '@/services/evidenceRecommendationService';
import { useBrand } from '@/contexts/BrandContext';
import { useState } from 'react';

// Removed interface WebsiteIntelligencePanelProps

export const WebsiteIntelligencePanel = ({ // Removed : React.FC<WebsiteIntelligencePanelProps>
  brandId,
  filters,
  onGenerateContent
}) => {
  const { selectedBrand } = useBrand();
  const [isEnhancing, setIsEnhancing] = useState(false);

  const { data: intelligence, isLoading } = useQuery({
    queryKey: ['website-intelligence', brandId, filters],
    queryFn: () => ChannelIntelligenceService.getWebsiteIntelligence(brandId, filters),
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
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleGenerateForTopPages = async () => {
    setIsEnhancing(true);
    try {
      const enhanced = await ChannelContentEnhancerService.enhance({
        channel: 'website',
        // Removed : any type assertion
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

      // Fetch recommended evidence based on channel + audience
      // Removed : any type assertion
      const evidence = await EvidenceRecommendationService.getRecommendedEvidence(
        brandId,
        ['website-landing-page'],
        filters.audienceType || 'Physician-Specialist',
        { claimLimit: 5, visualLimit: 5, moduleLimit: 3, includeNonMLRApproved: true }
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
      
      // Add evidence to transformed context
      onGenerateContent?.({
        ...transformed,
        recommendedEvidence: evidence
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateForSearchTerms = async () => {
    setIsEnhancing(true);
    try {
      const enhanced = await ChannelContentEnhancerService.enhance({
        channel: 'website',
        // Removed : any type assertion
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

      // Fetch recommended evidence
      // Removed : any type assertion
      const evidence = await EvidenceRecommendationService.getRecommendedEvidence(
        brandId,
        ['website-landing-page'],
        filters.audienceType || 'Physician-Specialist',
        { claimLimit: 5, visualLimit: 5, moduleLimit: 3, includeNonMLRApproved: true }
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
      
      onGenerateContent?.({
        ...transformed,
        recommendedEvidence: evidence
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            <CardTitle>Website Intelligence</CardTitle>
          </div>
          {filters.audienceType && (
            <Badge variant="secondary">{filters.audienceType} View</Badge>
          )}
        </div>
        <CardDescription>
          Performance insights for {filters.audienceSegment || filters.audienceType || 'all visitors'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Engagement Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-800">
            <Clock className="h-5 w-5 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{intelligence?.engagementMetrics.avgSessionDuration || 0}s</div>
            <div className="text-sm text-blue-600/80">Avg Session</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
            <FileText className="h-5 w-5 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">{intelligence?.engagementMetrics.avgPagesPerSession || 0}</div>
            <div className="text-sm text-green-600/80">Pages/Session</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 text-center border border-purple-200 dark:border-purple-800">
            <Users className="h-5 w-5 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{intelligence?.engagementMetrics.returnVisitorRate || 0}%</div>
            <div className="text-sm text-purple-600/80">Return Rate</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 text-center border border-orange-200 dark:border-orange-800">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{intelligence?.topPages?.length || 0}</div>
            <div className="text-sm text-orange-600/80">Active Pages</div>
          </div>
        </div>

        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="search">Search Terms</TabsTrigger>
            <TabsTrigger value="ctas">CTAs</TabsTrigger>
            <TabsTrigger value="journey">Journey</TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="mt-4 space-y-3">
            {intelligence?.topPages.slice(0, 5).map((page, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm">{page.page}</div>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{page.visits} visits</span>
                    <span>{page.avgTimeOnPage}s avg</span>
                    <span>{page.avgScrollDepth}% scroll</span>
                  </div>
                </div>
                <Progress value={page.avgScrollDepth} className="w-20" />
              </div>
            ))}
            {intelligence?.topPages && intelligence.topPages.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={handleGenerateForTopPages}
                disabled={isEnhancing}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isEnhancing ? 'Enhancing with AI...' : 'Generate Website Content'}
              </Button>
            )}
          </TabsContent>

          <TabsContent value="downloads" className="mt-4 space-y-3">
            {intelligence?.topDownloads.map((dl, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileDown className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">{dl.resource}</span>
                </div>
                <Badge variant="secondary">{dl.downloads} downloads</Badge>
              </div>
            ))}
            {intelligence?.topVideos && intelligence.topVideos.length > 0 && (
              <>
                <div className="text-sm font-medium text-muted-foreground mt-4 mb-2">Top Videos</div>
                {intelligence.topVideos.map((video, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Video className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-sm">{video.video}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {video.views} views • {video.avgCompletion}% completion
                    </div>
                  </div>
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="search" className="mt-4">
            <div className="space-y-2">
              {intelligence?.topSearchTerms.map((term, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">"{term.term}"</span>
                  </div>
                  <Badge variant="outline">{term.count} searches</Badge>
                </div>
              ))}
            </div>
            {intelligence?.topSearchTerms && intelligence.topSearchTerms.length > 0 && (
              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Content Gap Opportunity</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  These search terms reveal what {filters.audienceType || 'visitors'} are looking for. Create content to address these needs.
                </p>
                <Button 
                  size="sm"
                  onClick={handleGenerateForSearchTerms}
                  disabled={isEnhancing}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isEnhancing ? 'Enhancing with AI...' : 'Generate for Content Gaps'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ctas" className="mt-4 space-y-3">
            {intelligence?.topCTAs.map((cta, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <MousePointerClick className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">{cta.cta}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{cta.clicks}</span>
                  <span className="text-muted-foreground"> clicks</span>
                </div>
              </div>
            ))}
            {intelligence?.formSubmissions && intelligence.formSubmissions.length > 0 && (
              <>
                <div className="text-sm font-medium text-muted-foreground mt-4 mb-2">Form Submissions</div>
                {intelligence.formSubmissions.map((form, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium text-sm capitalize">{form.formType.replace(/_/g, ' ')}</span>
                    <Badge variant="secondary">{form.submissions}</Badge>
                  </div>
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="journey" className="mt-4">
            <div className="space-y-3">
              {intelligence?.visitorJourneyStages.map((stage, idx) => (
                <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm capitalize">{stage.stage.replace(/_/g, ' ')}</span>
                    <span className="text-sm text-muted-foreground">{stage.percentage}%</span>
                  </div>
                  <Progress value={stage.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; // FIX: Added closing curly brace