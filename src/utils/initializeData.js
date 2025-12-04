
import { DataGenerationService } from '@/services/dataGenerationService';
import { SuccessPatternDetector } from '@/services/successPatternDetector';
import { AnalyticsAggregationService } from '@/services/analyticsAggregationService';
import { IntelligenceSeedService } from '@/services/intelligenceSeedService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Initializes the database with realistic sample data
 * Only runs once per brand to avoid duplicate data
 */
export class DataInitializer {
  static INIT_KEY = 'data_initialized_brands';

  static async initializeForBrand(brandId, monthsBack = 12) {
    // Check if already initialized
    const initialized = await this.isInitialized(brandId);
    if (initialized) {
      console.log(`✓ Data already initialized for brand ${brandId}`);
      return;
    }

    console.log(`🚀 Initializing data for brand ${brandId}...`);

    try {
      // Generate comprehensive sample data
      await DataGenerationService.generateSampleData(brandId, monthsBack);
      
      // Run pattern detection
      console.log('🔍 Running pattern detection...');
      await SuccessPatternDetector.runPatternDetection(brandId);

      // Mark as initialized
      await this.markInitialized(brandId);
      
      console.log(`✅ Data initialization complete for brand ${brandId}`);
    } catch (error) {
      console.error('❌ Data initialization failed:', error);
      throw error;
    }
  }

  static async initializeAllBrands(monthsBack = 12) {
    try {
      // Get all brands
      const { data: brands, error } = await supabase
        .from('brand_profiles')
        .select('id, brand_name, company');

      if (error) throw error;
      if (!brands || brands.length === 0) {
        console.log('No brands found to initialize');
        return;
      }

      console.log(`Found ${brands.length} brands to initialize`);

      // Initialize each brand
      for (const brand of brands) {
        console.log(`\n📦 Processing ${brand.company} - ${brand.brand_name}...`);
        await this.initializeForBrand(brand.id, monthsBack);
      }

      console.log('\n🎉 All brands initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize brands:', error);
      throw error;
    }
  }

  static async isInitialized(brandId) {
    // Check if we have any data in content_registry for this brand
    const { data, error } = await supabase
      .from('content_registry')
      .select('id')
      .eq('brand_id', brandId)
      .limit(1);

    if (error) {
      console.error('Error checking initialization:', error);
      return false;
    }

    return (data && data.length > 0) || false;
  }

  static async markInitialized(brandId) {
    const stored = localStorage.getItem(this.INIT_KEY);
    const initialized = stored ? JSON.parse(stored) : [];
    
    if (!initialized.includes(brandId)) {
      initialized.push(brandId);
      localStorage.setItem(this.INIT_KEY, JSON.stringify(initialized));
    }
  }

  static async refreshIntelligence(brandId) {
    console.log(`🔄 Refreshing intelligence for brand ${brandId}...`);
    
    try {
      await SuccessPatternDetector.runPatternDetection(brandId);
      console.log('✅ Intelligence refreshed successfully');
    } catch (error) {
      console.error('❌ Intelligence refresh failed:', error);
      throw error;
    }
  }

  static async initializeComprehensive(brandId, monthsBack = 12) {
    console.log(`🚀 Starting COMPREHENSIVE data initialization for brand ${brandId}...`);
    
    try {
      // Phase 1: Core data generation (with enriched content)
      console.log('📦 Phase 1: Generating core data with enriched content...');
      await DataGenerationService.generateSampleData(brandId, monthsBack);
      
      // Phase 2: Analytics aggregation
      console.log('📊 Phase 2: Aggregating analytics...');
      await AnalyticsAggregationService.aggregateSocialIntelligence(brandId);
      await AnalyticsAggregationService.aggregateMarketIntelligence(brandId);
      await AnalyticsAggregationService.aggregateHCPEngagement(brandId);
      
      // Phase 3: Intelligence seeding
      console.log('🔍 Phase 3: Seeding intelligence data...');
      await IntelligenceSeedService.seedPublicDomainInsights(brandId);
      await IntelligenceSeedService.seedMarketPositioning(brandId);
      await IntelligenceSeedService.seedCompetitiveIntelligenceEnriched(brandId);
      await IntelligenceSeedService.seedCampaignGuardrails(brandId);
      
      // Phase 4: Content element tracking
      console.log('📊 Phase 4: Tracking content element performance...');
      const { ContentElementPerformanceService } = await import('@/services/contentElementPerformanceService');
      await ContentElementPerformanceService.trackContentElements(brandId);
      
      // Phase 5: Web content cataloging
      console.log('🌐 Phase 5: Cataloging web content...');
      const { WebContentCatalogService } = await import('@/services/webContentCatalogService');
      await WebContentCatalogService.catalogWebPages(brandId);
      await WebContentCatalogService.linkSessionsToContent(brandId);
      await WebContentCatalogService.createWebAttribution(brandId);
      
      // Phase 6: Content attribution
      console.log('🔗 Phase 6: Creating content attribution records...');
      const { ContentAttributionService } = await import('@/services/contentAttributionService');
      await ContentAttributionService.createAttributionRecords(brandId);
      
      // Phase 7: Content intelligence patterns
      console.log('🧠 Phase 7: Building content intelligence patterns...');
      const { ContentIntelligenceService } = await import('@/services/contentIntelligenceService');
      await ContentIntelligenceService.buildSuccessPatterns(brandId);
      await ContentIntelligenceService.buildContentRelationships(brandId);
      
      // Phase 8: Content performance metrics
      console.log('📊 Phase 8: Generating content performance metrics...');
      const { ContentPerformanceMetricsService } = await import('@/services/contentPerformanceMetricsService');
      await ContentPerformanceMetricsService.generateMetrics(brandId);
      
      // Phase 9: Performance predictions
      console.log('🔮 Phase 9: Generating performance predictions...');
      const { PerformancePredictionService } = await import('@/services/performancePredictionService');
      await PerformancePredictionService.generatePredictions(brandId);
      
      // Phase 10: Success pattern detection
      console.log('🎯 Phase 10: Running success pattern detection...');
      await SuccessPatternDetector.runPatternDetection(brandId);
      
      console.log('✅ Comprehensive initialization complete!');
      
      await this.markInitialized(brandId);
    } catch (error) {
      console.error('❌ Comprehensive initialization failed:', error);
      throw error;
    }
  }
}