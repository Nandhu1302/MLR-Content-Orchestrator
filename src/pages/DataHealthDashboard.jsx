
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBrand } from '@/contexts/BrandContext';
import { DataInitializer } from '@/utils/initializeData';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Database } from 'lucide-react';

export const DataHealthDashboard = () => {
  const { selectedBrand } = useBrand();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [populating, setPopulating] = useState(false);
  const [tableCounts, setTableCounts] = useState({});

  const checkTableHealth = async () => {
    if (!selectedBrand?.id) return;
    setChecking(true);
    const tables = [
      'sfmc_campaign_raw',
      'iqvia_rx_raw',
      'iqvia_market_data',
      'iqvia_hcp_decile_raw',
      'social_listening_data',
      'social_listening_raw',
      'social_intelligence_analytics',
      'market_intelligence_analytics',
      'hcp_engagement_analytics',
      'public_domain_insights',
      'performance_predictions',
      'market_positioning',
      'competitive_intelligence_enriched',
      'content_success_patterns',
      'campaign_guardrails',
      'sfmc_journey_raw',
      'veeva_vault_content_raw',
      'content_performance_metrics',
      'content_relationships',
    ];
    const counts = {};
    for (const table of tables) {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', selectedBrand.id);
      counts[table] = count ?? 0;
    }
    setTableCounts(counts);
    setChecking(false);
  };

  const runComprehensiveInit = async () => {
    if (!selectedBrand?.id) return;
    setLoading(true);
    try {
      await DataInitializer.initializeComprehensive(selectedBrand.id, 12);
      await checkTableHealth();
      alert('✅ Comprehensive initialization complete!');
    } catch (error) {
      console.error(error);
      alert('❌ Initialization failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const populateAllDemoData = async () => {
    if (!selectedBrand?.id) return;
    setPopulating(true);
    try {
      const { data, error } = await supabase.functions.invoke('populate-comprehensive-data', {
        body: { brandId: selectedBrand.id },
      });
      if (error) throw error;
      if (data.success) {
        console.log('✅ Edge function completed successfully');
        console.log('📊 Population results:', data);
        // Call intelligence seed services for better data quality
        console.log('🧠 Seeding additional intelligence data...');
        const { IntelligenceSeedService } = await import('@/services/intelligenceSeedService');
        await IntelligenceSeedService.seedPublicDomainInsights(selectedBrand.id);
        await IntelligenceSeedService.seedMarketPositioning(selectedBrand.id);
        await IntelligenceSeedService.seedCompetitiveIntelligenceEnriched(selectedBrand.id);
        await IntelligenceSeedService.seedCampaignGuardrails(selectedBrand.id);
        console.log('✅ All intelligence data seeded');
        await checkTableHealth();
        alert('✅ All demo data populated successfully! Raw data + analytics + intelligence layers complete.');
      } else {
        const errorDetails = data.message ?? 'Unknown error during population';
        const failedPhases = data.updates?.filter((u) => u.status === 'error').map((u) => u.phase) ?? [];
        console.error('❌ Population failed:', { errorDetails, failedPhases, fullData: data });
        throw new Error(`${errorDetails}\nFailed phases: ${failedPhases.join(', ')}`);
      }
    } catch (error) {
      console.error('❌ Error populating demo data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Failed to populate demo data.\n\n${errorMessage}\n\nCheck console for detailed error logs.`);
    } finally {
      setPopulating(false);
    }
  };

  const totalTables = Object.keys(tableCounts).length;
  const emptyTables = Object.values(tableCounts).filter((c) => c === 0).length;
  const populatedTables = totalTables - emptyTables;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/data-intelligence")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Intelligence Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Data Health Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and initialize backend data sources for {selectedBrand?.brand_name ?? 'your brand'}
          </p>
        </div>

        {totalTables > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold">{totalTables}</div>
                  <div className="text-sm text-muted-foreground">Total Tables</div>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <div className="text-3xl font-bold text-green-500">{populatedTables}</div>
                  <div className="text-sm text-muted-foreground">Populated</div>
                </div>
                <div className="text-center p-4 bg-red-500/10 rounded-lg">
                  <div className="text-3xl font-bold text-red-500">{emptyTables}</div>
                  <div className="text-sm text-muted-foreground">Empty</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4">
              <Button
                onClick={checkTableHealth}
                disabled={checking || !selectedBrand}
                variant="outline"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Checking...' : 'Check Table Health'}
              </Button>
              <Button
                onClick={populateAllDemoData}
                disabled={populating || !selectedBrand}
                variant="default"
              >
                <Database className="mr-2 h-4 w-4" />
                {populating ? '🔄 Populating...' : '🚀 Populate ALL Demo Data'}
              </Button>
              <Button
                onClick={runComprehensiveInit}
                disabled={loading || !selectedBrand}
                variant="secondary"
              >
                <Database className="mr-2 h-4 w-4" />
                {loading ? 'Initializing...' : 'Run Comprehensive Init'}
              </Button>
            </div>
            {!selectedBrand && (
              <p className="text-sm text-muted-foreground">
                Please select a brand to manage data health
              </p>
            )}
          </CardContent>
        </Card>

        {Object.keys(tableCounts).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Table Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(tableCounts)
                  .sort((a, b) => a[1] - b[1])
                  .map(([table, count]) => (
                    <div key={table} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="font-mono text-sm">{table}</span>
                      <span className={`font-semibold ${count === 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {count.toLocaleString()} records
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DataHealthDashboard;
