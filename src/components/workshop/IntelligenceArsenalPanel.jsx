
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Brain, TrendingUp, Users, BarChart3, Image, Loader2, GitCompare, Target, TrendingDown, PieChart } from 'lucide-react';
import { StoryIntelligenceMatchingService } from '@/services/intelligence';
import { EvidenceLibrarySection } from './EvidenceLibrarySection';
import { SuccessPatternsSection } from './SuccessPatternsSection';
import { AudienceInsightsSection } from './AudienceInsightsSection';
import { VisualAssetGallery } from './VisualAssetGallery';
import { CrossChannelSection } from './CrossChannelSection';
import { CompetitiveIntelSection } from './CompetitiveIntelSection';
import { MarketIntelSection } from './MarketIntelSection';
import { MarketingMixSection } from './MarketingMixSection';

export const IntelligenceArsenalPanel = ({
  intelligence,
  selectedClaims,
  selectedVisuals,
  selectedModules,
  isLoading = false,
  brandId = 'test-brand-id',
  audienceType,
  hcpTargeting,
  marketContext,
  audienceInsights,
  campaignCoordination,
  crossChannelInsights,
  performancePrediction,
  onClaimToggle,
  onVisualToggle,
  onModuleToggle
}) => {
  const [openSections, setOpenSections] = useState(['evidence', 'patterns']);
  const [marketingMix, setMarketingMix] = useState([]);
  const [loadingMix, setLoadingMix] = useState(false);

  // Fetch marketing mix when audience changes
  useEffect(() => {
    if (audienceType) {
      fetchMarketingMix();
    }
  }, [audienceType, brandId]);

  const fetchMarketingMix = async () => {
    setLoadingMix(true);
    try {
      const mix = await StoryIntelligenceMatchingService.fetchMarketingMixRecommendations(
        brandId,
        audienceType
      );
      setMarketingMix(mix);
    } catch (error) {
      console.error('Error fetching marketing mix:', error);
    } finally {
      setLoadingMix(false);
    }
  };

  if (!intelligence) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-2 min-h-[600px]">
        <Brain className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Intelligence Arsenal</h3>
        <p className="text-muted-foreground max-w-md">
          Tell your story and I'll gather relevant evidence, success patterns, and insights to power your content.
        </p>
      </Card>
    );
  }

  const totalSelected = selectedClaims.length + selectedVisuals.length + selectedModules.length;
  const totalAvailable =
    intelligence.claims.length +
    intelligence.visuals.length +
    intelligence.modules.length;

  return (
    <Card className="p-6 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Updating intelligence...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Intelligence Arsenal
          </h3>
          <Badge variant="secondary" className="text-sm">
            {totalSelected} of {totalAvailable} selected
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            Confidence: {intelligence.overallConfidence}%
          </div>
          <div className="flex flex-wrap gap-1">
            {intelligence.dataSourcesUsed.map(source => (
              <Badge key={source} variant="outline" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="space-y-2"
      >
        {/* Evidence Library */}
        <AccordionItem value="evidence" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Brain className="h-4 w-4 text-primary" />
              <span className="font-semibold">Evidence Library</span>
              <Badge variant="secondary" className="ml-2">
                {intelligence.claims.length} claims
              </Badge>
              <Badge variant="secondary">
                {intelligence.modules.length} modules
              </Badge>
              {selectedClaims.length > 0 && (
                <Badge variant="default" className="ml-auto">
                  {selectedClaims.length} selected
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <EvidenceLibrarySection
              claims={intelligence.claims}
              modules={intelligence.modules}
              selectedClaims={selectedClaims}
              selectedModules={selectedModules}
              onClaimToggle={onClaimToggle}
              onModuleToggle={onModuleToggle}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Success Patterns */}
        {intelligence.successPatterns.length > 0 && (
          <AccordionItem value="patterns" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold">Success Patterns</span>
                <Badge variant="secondary" className="ml-2">
                  {intelligence.successPatterns.length} patterns
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <SuccessPatternsSection patterns={intelligence.successPatterns} />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Audience Insights */}
        {intelligence.audienceInsights.length > 0 && (
          <AccordionItem value="audience" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">Audience Insights</span>
                <Badge variant="secondary" className="ml-2">
                  {intelligence.audienceInsights.length} insights
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <AudienceInsightsSection insights={intelligence.audienceInsights} />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Channel Performance */}
        {intelligence.channelIntelligence.length > 0 && (
          <AccordionItem value="channels" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="font-semibold">Channel Performance</span>
                <Badge variant="secondary" className="ml-2">
                  {intelligence.channelIntelligence.length} channels
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {intelligence.channelIntelligence.map(channel => (
                  <div key={channel.channel} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{channel.channel}</span>
                      <Badge variant={channel.recommended_for_audience ? 'default' : 'secondary'}>
                        {channel.performance_score}% performance
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                      {channel.engagement_metrics.impressions && (
                        <div>
                          <div className="text-xs">Impressions</div>
                          <div className="font-medium text-foreground">
                            {channel.engagement_metrics.impressions.toLocaleString()}
                          </div>
                        </div>
                      )}
                      {channel.engagement_metrics.clicks && (
                        <div>
                          <div className="text-xs">Clicks</div>
                          <div className="font-medium text-foreground">
                            {channel.engagement_metrics.clicks.toLocaleString()}
                          </div>
                        </div>
                      )}
                      {channel.engagement_metrics.conversions && (
                        <div>
                          <div className="text-xs">Conversions</div>
                          <div className="font-medium text-foreground">
                            {channel.engagement_metrics.conversions.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Visual Assets */}
        {intelligence.visuals.length > 0 && (
          <AccordionItem value="visuals" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Image className="h-4 w-4 text-orange-600" />
                <span className="font-semibold">Visual Assets</span>
                <Badge variant="secondary" className="ml-2">
                  {intelligence.visuals.length} assets
                </Badge>
                {selectedVisuals.length > 0 && (
                  <Badge variant="default" className="ml-auto">
                    {selectedVisuals.length} selected
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <VisualAssetGallery
                visuals={intelligence.visuals}
                selectedVisuals={selectedVisuals}
                onVisualToggle={onVisualToggle}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Cross-Channel Journeys */}
        {intelligence.crossChannelJourneys.length > 0 && (
          <AccordionItem value="cross-channel" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <GitCompare className="h-4 w-4 text-indigo-600" />
                <span className="font-semibold">Cross-Channel Journeys</span>
                <Badge variant="secondary" className="ml-2">
                  {intelligence.crossChannelJourneys.length} journeys
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CrossChannelSection journeys={intelligence.crossChannelJourneys} />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Competitive Intelligence */}
        {intelligence.competitiveIntelligence.length > 0 && (
          <AccordionItem value="competitive" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-red-600" />
                <span className="font-semibold">Competitive Intelligence</span>
                <Badge variant="secondary" className="ml-2">
                  {intelligence.competitiveIntelligence.length} threats
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CompetitiveIntelSection intelligence={intelligence.competitiveIntelligence} />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Market Intelligence */}
        {intelligence.marketIntelligence && (
          <AccordionItem value="market" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-4 w-4 text-teal-600" />
                <span className="font-semibold">Market Intelligence</span>
                <Badge variant="secondary" className="ml-2">
                  Rx Trends & Share
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <MarketIntelSection intelligence={intelligence.marketIntelligence} />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* HCP Targeting */}
        {hcpTargeting && (
          <AccordionItem value="hcp-targeting" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-cyan-600" />
                <span className="font-semibold">HCP Targeting</span>
                <Badge variant="secondary" className="ml-2">
                  {hcpTargeting.targetHcpCount} HCPs
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Target Count</div>
                    <div className="text-lg font-semibold">{hcpTargeting.targetHcpCount} HCPs</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Decile Range</div>
                    <div className="text-lg font-semibold">
                      {hcpTargeting.decileRange[0]}-{hcpTargeting.decileRange[1]}
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Region Focus</div>
                    <div className="text-lg font-semibold">{hcpTargeting.regionFocus}</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">High Growth Opportunity</div>
                    <div className="text-lg font-semibold text-green-600">
                      {hcpTargeting.highGrowthOpportunityCount} HCPs
                    </div>
                  </div>
                </div>

                {hcpTargeting.preferredChannels && hcpTargeting.preferredChannels.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Preferred Channels</div>
                    <div className="space-y-2">
                      {hcpTargeting.preferredChannels.map(ch => (
                        <div key={ch.channel} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{ch.channel}</span>
                          <Badge variant="secondary">{ch.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Market Context */}
        {marketContext && (
          <AccordionItem value="market-context" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold">Market Context</span>
                <Badge variant="secondary" className="ml-2">
                  +{marketContext.rxGrowthRate}% Growth
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 mb-1">Rx Growth Rate</div>
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    +{marketContext.rxGrowthRate}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Market Share</div>
                    <div className="text-lg font-semibold">{marketContext.marketSharePercent}%</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Top Performing Region</div>
                    <div className="text-sm font-semibold">{marketContext.topPerformingRegion}</div>
                  </div>
                </div>

                {marketContext.regionalGrowthRates && (
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-2">Regional Growth Rates</div>
                    <div className="space-y-1">
                      {Object.entries(marketContext.regionalGrowthRates).map(([region, rate]) => (
                        <div key={region} className="flex items-center justify-between p-2 border rounded text-sm">
                          <span>{region}</span>
                          <Badge variant={rate > 0 ? 'default' : 'secondary'}>
                            {rate > 0 ? '+' : ''}{rate}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {marketContext.timingRecommendation && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="text-xs text-blue-700 dark:text-blue-300 mb-1">Timing Recommendation</div>
                    <div className="text-sm text-blue-900 dark:text-blue-100">{marketContext.timingRecommendation}</div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Audience Insights */}
        {audienceInsights && (
          <AccordionItem value="audience-insights" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-violet-600" />
                <span className="font-semibold">Audience Insights</span>
                <Badge variant="secondary" className="ml-2">
                  {audienceInsights.segmentName}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {Array.isArray(audienceInsights.decisionFactors) && audienceInsights.decisionFactors.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Key Decision Factors</div>
                    <div className="space-y-1">
                      {audienceInsights.decisionFactors.map((factor, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 border rounded">
                          <Badge variant="outline" className="mt-0.5">{idx + 1}</Badge>
                          <span className="text-sm flex-1">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(audienceInsights.barriers) && audienceInsights.barriers.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Barriers to Engagement</div>
                    <div className="space-y-1">
                      {audienceInsights.barriers.map((barrier, idx) => (
                        <div key={idx} className="p-2 border border-orange-200 dark:border-orange-800 rounded bg-orange-50 dark:bg-orange-950 text-sm">
                          {barrier}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(audienceInsights.claimsEmphasis) && audienceInsights.claimsEmphasis.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Claims Emphasis</div>
                    <div className="flex flex-wrap gap-2">
                      {audienceInsights.claimsEmphasis.map(claim => (
                        <Badge key={claim} variant="secondary">{claim}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(audienceInsights.channelPreferences) && audienceInsights.channelPreferences.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Channel Preferences</div>
                    <div className="flex flex-wrap gap-2">
                      {audienceInsights.channelPreferences.map(channel => (
                        <Badge key={channel} variant="outline">{channel}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Campaign Coordination */}
        {campaignCoordination && (
          <AccordionItem value="campaign-coordination" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <GitCompare className="h-4 w-4 text-pink-600" />
                <span className="font-semibold">Campaign Coordination</span>
                <Badge variant="secondary" className="ml-2">
                  {campaignCoordination.initiativeType === 'campaign' ? 'Multi-Channel' : 'Single Asset'}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {Array.isArray(campaignCoordination.channelSequence) && campaignCoordination.channelSequence.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Channel Sequence</div>
                    <div className="flex items-center gap-2">
                      {campaignCoordination.channelSequence.map((channel, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Badge variant="outline">{channel}</Badge>
                          {idx < campaignCoordination.channelSequence.length - 1 && (
                            <span className="text-muted-foreground">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {campaignCoordination.messagingArc && (
                  <div className="p-3 border rounded-lg bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-1">Messaging Arc</div>
                    <div className="text-sm">{campaignCoordination.messagingArc}</div>
                  </div>
                )}

                {campaignCoordination.sharedEvidenceChain && campaignCoordination.sharedEvidenceChain.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Shared Evidence Chain</div>
                    <div className="space-y-1">
                      {campaignCoordination.sharedEvidenceChain.map((evidence, idx) => (
                        <div key={idx} className="p-2 border rounded text-sm">
                          {evidence}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Cross-Channel Insights */}
        {crossChannelInsights && (
          <AccordionItem value="cross-channel-insights" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">Cross-Channel Insights</span>
                <Badge variant="secondary" className="ml-2">
                  Multi-Channel Intelligence
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Web Analytics */}
                {crossChannelInsights.webAnalytics && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      <div className="text-sm font-semibold">Website Analytics</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Top Page</div>
                        <div className="font-medium">{crossChannelInsights.webAnalytics.topPage}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Avg. Engagement</div>
                        <div className="font-medium">{crossChannelInsights.webAnalytics.avgEngagement}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Total Visits</div>
                        <div className="font-medium">{crossChannelInsights.webAnalytics.totalVisits}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Top CTA</div>
                        <div className="font-medium text-xs">{crossChannelInsights.webAnalytics.topCta}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Performance */}
                {crossChannelInsights.emailPerformance && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                      <div className="text-sm font-semibold">Email Performance</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Avg. Open Rate</div>
                        <div className="font-medium">{crossChannelInsights.emailPerformance.avgOpenRate}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Avg. Click Rate</div>
                        <div className="font-medium">{crossChannelInsights.emailPerformance.avgClickRate}%</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-muted-foreground">Best Subject Line</div>
                        <div className="font-medium text-xs">{crossChannelInsights.emailPerformance.bestSubjectLine}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Listening */}
                {crossChannelInsights.socialListening && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <div className="text-sm font-semibold">Social Listening</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Sentiment</span>
                        <Badge variant={
                          crossChannelInsights.socialListening.avgSentiment > 0.5 ? 'default' :
                          crossChannelInsights.socialListening.avgSentiment > 0 ? 'secondary' :
                          'destructive'
                        }>
                          {(crossChannelInsights.socialListening.avgSentiment * 100).toFixed(0)}% positive
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <div className="text-xs text-muted-foreground mb-1">Top Topics</div>
                        <div className="flex flex-wrap gap-1">
                          {crossChannelInsights.socialListening.topTopics.map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rep Activity */}
                {crossChannelInsights.repActivity && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-orange-600"></div>
                      <div className="text-sm font-semibold">Rep Activity</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Recent Calls</div>
                        <div className="font-medium">{crossChannelInsights.repActivity.recentCallCount}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Avg. Engagement</div>
                        <div className="font-medium">{crossChannelInsights.repActivity.avgEngagementScore}%</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-muted-foreground">Top Region</div>
                        <div className="font-medium">{crossChannelInsights.repActivity.topRegion}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Performance Prediction */}
        {performancePrediction && (
          <AccordionItem value="performance-prediction" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold">Performance Prediction</span>
                <Badge variant="default" className="ml-2">
                  {performancePrediction.overallPredictedLift > 0 ? '+' : ''}{performancePrediction.overallPredictedLift}% lift
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Overall Prediction */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 mb-1">Predicted Performance Lift</div>
                  <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                    {performancePrediction.overallPredictedLift > 0 ? '+' : ''}{performancePrediction.overallPredictedLift}%
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    Based on {performancePrediction.totalPatternsAnalyzed} similar campaigns
                  </div>
                </div>

                {/* Channel-Specific Predictions */}
                {performancePrediction.channelPredictions && performancePrediction.channelPredictions.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Channel-Specific Predictions</div>
                    <div className="space-y-2">
                      {performancePrediction.channelPredictions.map(pred => (
                        <div key={pred.channel} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{pred.channel}</span>
                            <Badge variant="secondary">
                              {pred.predictedLift > 0 ? '+' : ''}{pred.predictedLift}%
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Confidence: {pred.confidence}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Channel Mix */}
                {performancePrediction.recommendedChannelMix && performancePrediction.recommendedChannelMix.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Recommended Channel Mix</div>
                    <div className="space-y-2">
                      {performancePrediction.recommendedChannelMix.map((mix, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{mix.channel}</span>
                              <span className="text-xs text-muted-foreground">{mix.allocation}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${mix.allocation}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Factors */}
                {performancePrediction.keySuccessFactors && performancePrediction.keySuccessFactors.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Key Success Factors</div>
                    <div className="space-y-1">
                      {performancePrediction.keySuccessFactors.map((factor, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 border rounded text-sm">
                          <Badge variant="outline" className="mt-0.5">{idx + 1}</Badge>
                          <span className="flex-1">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Anti-Patterns */}
                {performancePrediction.antiPatterns && performancePrediction.antiPatterns.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Patterns to Avoid</div>
                    <div className="space-y-1">
                      {performancePrediction.antiPatterns.map((pattern, idx) => (
                        <div key={idx} className="p-2 border border-orange-200 dark:border-orange-800 rounded bg-orange-50 dark:bg-orange-950 text-sm">
                          ⚠️ {pattern}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Marketing Mix Recommendations */}
        {marketingMix.length > 0 && (
          <AccordionItem value="marketing-mix" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <PieChart className="h-4 w-4 text-violet-600" />
                <span className="font-semibold">Marketing Mix</span>
                <Badge variant="secondary" className="ml-2">
                  Channel Allocation
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {loadingMix ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <MarketingMixSection recommendations={marketingMix} />
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </Card>
  );
}
