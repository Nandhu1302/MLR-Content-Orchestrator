
import { supabase } from '@/integrations/supabase/client';
import { DataGenerationService } from '@/services/dataGenerationService';
import { AnalyticsAggregationService } from '@/services/analyticsAggregationService';

export class IntelligenceDataPopulator {
  /**
   * Populate expanded IQVIA Rx data and aggregate intelligence tables
   */
  static async populateIntelligenceData(
    brandId,
    onProgress
  ) {
    const stages = [
      { stage: 'iqvia_rx', status: 'pending', message: 'Generating expanded IQVIA Rx data...' },
      { stage: 'market_intelligence', status: 'pending', message: 'Aggregating market intelligence...' },
      { stage: 'hcp_engagement', status: 'pending', message: 'Aggregating HCP engagement...' },
      { stage: 'social_intelligence', status: 'pending', message: 'Aggregating social intelligence...' },
    ];
    
    let totalRecords = 0;
    
    try {
      // Verify authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('User must be authenticated to populate data. Please log in and try again.');
      }
      
      console.log('✓ Authentication verified for user:', session.user.id);
      // Stage 1: Clear existing IQVIA Rx data and regenerate with expanded regional data
      stages[0].status = 'running';
      onProgress?.(stages[0]);
      
      // Delete existing IQVIA Rx data for this brand
      const { error: deleteError } = await supabase
        .from('iqvia_rx_raw')
        .delete()
        .eq('brand_id', brandId);
      
      if (deleteError) {
        console.error('Error deleting existing IQVIA Rx data:', deleteError);
      }
      
      // Generate new expanded data (60 records: 12 months × 5 regions)
      await DataGenerationService.generateIQVIARxRaw(brandId, 12);
      
      // Count generated records
      const { count: rxCount } = await supabase
        .from('iqvia_rx_raw')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId);
      
      stages[0].status = 'complete';
      stages[0].message = `Generated ${rxCount || 0} IQVIA Rx records`;
      stages[0].recordsCreated = rxCount || 0;
      totalRecords += rxCount || 0;
      onProgress?.(stages[0]);
      
      // Stage 2: Clear and aggregate Market Intelligence
      stages[1].status = 'running';
      onProgress?.(stages[1]);
      
      const { error: deleteMarketError } = await supabase
        .from('market_intelligence_analytics')
        .delete()
        .eq('brand_id', brandId);
      
      if (deleteMarketError) {
        console.error('Error deleting market intelligence:', deleteMarketError);
      }
      
      const marketRecords = await AnalyticsAggregationService.aggregateMarketIntelligence(brandId);
      
      stages[1].status = 'complete';
      stages[1].message = `Aggregated ${marketRecords} market intelligence records`;
      stages[1].recordsCreated = marketRecords;
      totalRecords += marketRecords;
      onProgress?.(stages[1]);
      
      // Stage 3: Clear and aggregate HCP Engagement
      stages[2].status = 'running';
      onProgress?.(stages[2]);
      
      const { error: deleteHcpError } = await supabase
        .from('hcp_engagement_analytics')
        .delete()
        .eq('brand_id', brandId);
      
      if (deleteHcpError) {
        console.error('Error deleting HCP engagement:', deleteHcpError);
      }
      
      const hcpRecords = await AnalyticsAggregationService.aggregateHCPEngagement(brandId);
      
      stages[2].status = 'complete';
      stages[2].message = `Aggregated ${hcpRecords} HCP engagement records`;
      stages[2].recordsCreated = hcpRecords;
      totalRecords += hcpRecords;
      onProgress?.(stages[2]);
      
      // Stage 4: Aggregate Social Intelligence
      stages[3].status = 'running';
      onProgress?.(stages[3]);
      
      const { error: deleteSocialError } = await supabase
        .from('social_intelligence_analytics')
        .delete()
        .eq('brand_id', brandId);
      
      if (deleteSocialError) {
        console.error('Error deleting social intelligence:', deleteSocialError);
      }
      
      await AnalyticsAggregationService.aggregateSocialIntelligence(brandId);
      
      const { count: socialCount } = await supabase
        .from('social_intelligence_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId);
      
      stages[3].status = 'complete';
      stages[3].message = `Aggregated ${socialCount || 0} social intelligence records`;
      stages[3].recordsCreated = socialCount || 0;
      totalRecords += socialCount || 0;
      onProgress?.(stages[3]);
      
      return {
        success: true,
        stages,
        totalRecords,
      };
    } catch (error) {
      console.error('Error populating intelligence data:', error);
      
      // Mark current stage as error
      const runningStage = stages.find(s => s.status === 'running');
      if (runningStage) {
        runningStage.status = 'error';
        runningStage.message = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        onProgress?.(runningStage);
      }
      
      return {
        success: false,
        stages,
        totalRecords,
      };
    }
  }
}