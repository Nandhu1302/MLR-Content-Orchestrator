// ============================================
// Intelligence Services Main Orchestrator
// Coordinates all intelligence service modules
// ============================================

import { ClaimsService } from "./claimsService";
import { VisualsService } from "./visualsService";
import { ModulesService } from "./modulesService";
import { PatternsService } from "./patternsService";
import { AudienceService } from "./audienceService";
import { ChannelService } from "./channelService";
import { MarketService } from "./marketService";

export class StoryIntelligenceMatchingService {
  static async matchIntelligenceToStory(context, brandId) {
    const { detectedIntent, selectedAssets } = context;

    if (!detectedIntent) {
      return this.getEmptyIntelligence();
    }

    try {
      const [
        claims,
        visuals,
        modules,
        successPatterns,
        audienceInsights,
        channelIntel,
        competitiveIntel,
        crossChannelJourneys,
        performancePrediction,
        marketIntel,
      ] = await Promise.all([
        ClaimsService.fetchMatchingClaims(brandId, detectedIntent),
        VisualsService.fetchMatchingVisuals(
          brandId,
          detectedIntent,
          selectedAssets || []
        ),
        ModulesService.fetchMatchingModules(brandId, detectedIntent),
        PatternsService.fetchSuccessPatterns(detectedIntent),
        AudienceService.fetchAudienceInsights(brandId, detectedIntent),
        ChannelService.fetchChannelIntelligence(brandId, selectedAssets || []),
        MarketService.fetchCompetitiveIntelligence(brandId, detectedIntent),
        ChannelService.fetchCrossChannelJourneys(brandId, detectedIntent),
        MarketService.fetchPerformancePrediction(brandId, detectedIntent),
        MarketService.fetchMarketIntelligence(brandId, detectedIntent),
      ]);

      const dataSourcesUsed = this.calculateDataSources(
        claims,
        visuals,
        modules,
        successPatterns,
        audienceInsights,
        channelIntel,
        competitiveIntel,
        crossChannelJourneys,
        performancePrediction,
        marketIntel
      );
      const overallConfidence = this.calculateConfidence(
        claims,
        visuals,
        modules,
        successPatterns
      );

      return {
        claims,
        visuals,
        modules,
        successPatterns,
        audienceInsights,
        channelIntelligence: channelIntel,
        competitiveIntelligence: competitiveIntel,
        crossChannelJourneys,
        performancePrediction,
        marketIntelligence: marketIntel,
        overallConfidence,
        dataSourcesUsed,
      };
    } catch (error) {
      console.error("Error matching intelligence:", error);
      return this.getEmptyIntelligence();
    }
  }

  static fetchAudienceSegmentDetails =
    AudienceService.fetchAudienceSegmentDetails;
  static fetchMarketingMixRecommendations =
    ChannelService.fetchMarketingMixRecommendations;

  static calculateDataSources(
    claims,
    visuals,
    modules,
    patterns,
    insights,
    channels,
    competitive,
    journeys,
    prediction,
    market
  ) {
    const sources = new Set();

    if (claims.length > 0) sources.add("Clinical Claims");
    if (visuals.length > 0) sources.add("Visual Assets");
    if (modules.length > 0) sources.add("Content Modules");
    if (patterns.length > 0) sources.add("Success Patterns");
    if (competitive.length > 0) sources.add("Competitive Intelligence");
    if (journeys.length > 0) sources.add("Cross-Channel Journeys");
    if (prediction) sources.add("Performance Predictions");
    if (market) sources.add("Market Intelligence");

    insights.forEach((insight) => sources.add(insight.source));

    return Array.from(sources);
  }

  static calculateConfidence(claims, visuals, modules, patterns) {
    let confidence = 0;

    if (claims.length > 0) confidence += 30;
    if (visuals.length > 0) confidence += 20;
    if (modules.length > 0) confidence += 20;
    if (patterns.length > 0) confidence += 30;

    const avgClaimScore =
      claims.length > 0
        ? claims.reduce((sum, c) => sum + c.relevance_score, 0) / claims.length
        : 0;
    confidence *= 0.7 + avgClaimScore * 0.3;

    return Math.min(95, Math.round(confidence));
  }

  static getEmptyIntelligence() {
    return {
      claims: [],
      visuals: [],
      modules: [],
      successPatterns: [],
      audienceInsights: [],
      channelIntelligence: [],
      competitiveIntelligence: [],
      crossChannelJourneys: [],
      performancePrediction: null,
      marketIntelligence: null,
      overallConfidence: 0,
      dataSourcesUsed: [],
    };
  }
}

export { ClaimsService } from "./claimsService";
export { VisualsService } from "./visualsService";
export { ModulesService } from "./modulesService";
export { PatternsService } from "./patternsService";
export { AudienceService } from "./audienceService";
export { ChannelService } from "./channelService";
export { MarketService } from "./marketService";
