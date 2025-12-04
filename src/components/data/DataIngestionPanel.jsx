import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  TrendingUp, 
  Users, 
  Globe, 
  Zap,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useBrand } from '@/contexts/BrandContext';

export const DataIngestionPanel = () => {
  const { selectedBrand } = useBrand();
  const { toast } = useToast();
  const [isIngesting, setIsIngesting] = useState(false);
  const [dataSources, setDataSources] = useState([
    {
      id: 'sfmc',
      name: 'SFMC Campaigns',
      icon: <Database className="h-5 w-5" />,
      description: 'Email campaign performance data',
      status: 'empty'
    },
    {
      id: 'veeva',
      name: 'Veeva Field Insights',
      icon: <Users className="h-5 w-5" />,
      description: 'HCP feedback and objections',
      status: 'empty'
    },
    {
      id: 'iqvia',
      name: 'IQVIA Market Data',
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Market share and prescription trends',
      status: 'empty'
    },
    {
      id: 'social',
      name: 'Social Listening',
      icon: <Globe className="h-5 w-5" />,
      description: 'Patient sentiment and trending topics',
      status: 'empty'
    },
    {
      id: 'competitive',
      name: 'Competitive Intelligence',
      icon: <Zap className="h-5 w-5" />,
      description: 'Competitor positioning and threats',
      status: 'empty'
    }
  ]);

  const handleIngestSampleData = async (dataType) => {
    if (!selectedBrand) {
      toast({
        title: 'No brand selected',
        description: 'Please select a brand first',
        variant: 'destructive'
      });
      return;
    }

    setIsIngesting(true);

    // Update status to loading
    if (dataType) {
      setDataSources(prev => 
        prev.map(ds => ds.id === dataType ? { ...ds, status: 'loading' } : ds)
      );
    } else {
      setDataSources(prev => prev.map(ds => ({ ...ds, status: 'loading' })));
    }

    try {
      console.log('🔄 Ingesting sample data:', { brandId: selectedBrand.id, dataType });

      const { data, error } = await supabase.functions.invoke('ingest-sample-data', {
        body: {
          brandId: selectedBrand.id,
          dataType
        }
      });

      if (error) throw error;

      console.log('✅ Sample data ingested:', data);

      // Update status to loaded
      const updatedSources = dataSources.map(ds => {
        if (!dataType || ds.id === dataType) {
          return {
            ...ds,
            status: 'loaded',
            count: data?.data?.[ds.id]?.count || 0,
            lastUpdated: new Date().toISOString()
          };
        }
        return ds;
      });

      setDataSources(updatedSources);

      toast({
        title: 'Data ingested successfully',
        description: dataType 
          ? `${dataType.toUpperCase()} sample data loaded`
          : 'All sample data sources loaded',
      });

      // Refresh data counts
      await checkDataStatus();

    } catch (error) {
      console.error('Error ingesting sample data:', error);
      
      // Reset status
      if (dataType) {
        setDataSources(prev => 
          prev.map(ds => ds.id === dataType ? { ...ds, status: 'empty' } : ds)
        );
      } else {
        setDataSources(prev => prev.map(ds => ({ ...ds, status: 'empty' })));
      }

      toast({
        title: 'Failed to ingest data',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsIngesting(false);
    }
  };

  const checkDataStatus = async () => {
    if (!selectedBrand) return;

    try {
      // Check SFMC data
      const { count: sfmcCount } = await supabase
        .from('sfmc_campaign_data')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', selectedBrand.id);

      // Check Veeva data
      const { count: veevaCount } = await supabase
        .from('veeva_field_insights')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', selectedBrand.id);

      // Check IQVIA data
      const { count: iqviaCount } = await supabase
        .from('iqvia_market_data')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', selectedBrand.id);

      // Check Social data
      const { count: socialCount } = await supabase
        .from('social_listening_data')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', selectedBrand.id);

      // Check Competitive data
      const { count: competitiveCount } = await supabase
        .from('competitive_intelligence_data')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', selectedBrand.id);

      setDataSources(prev => prev.map(ds => {
        let count = 0;
        switch (ds.id) {
          case 'sfmc': count = sfmcCount || 0; break;
          case 'veeva': count = veevaCount || 0; break;
          case 'iqvia': count = iqviaCount || 0; break;
          case 'social': count = socialCount || 0; break;
          case 'competitive': count = competitiveCount || 0; break;
        }

        return {
          ...ds,
          status: count > 0 ? 'loaded' : 'empty',
          count
        };
      }));

    } catch (error) {
      console.error('Error checking data status:', error);
    }
  };

  React.useEffect(() => {
    checkDataStatus();
  }, [selectedBrand]);

  const totalDataPoints = dataSources.reduce((sum, ds) => sum + (ds.count || 0), 0);
  const loadedSources = dataSources.filter(ds => ds.status === 'loaded').length;
  const progressPercentage = (loadedSources / dataSources.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Data Intelligence Foundation
              </CardTitle>
              <CardDescription>
                Ingest real data to power data-driven intelligence layers
              </CardDescription>
            </div>
            <Button
              onClick={() => handleIngestSampleData()}
              disabled={isIngesting || !selectedBrand}
              size="sm"
            >
              {isIngesting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Ingesting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Load All Sample Data
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Data Sources Populated: {loadedSources} / {dataSources.length}
              </span>
              <span className="font-medium">{totalDataPoints.toLocaleString()} data points</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Data Sources Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {dataSources.map(source => (
              <Card key={source.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {source.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{source.name}</h4>
                        <p className="text-xs text-muted-foreground">{source.description}</p>
                      </div>
                    </div>
                    {source.status === 'loaded' && (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    )}
                    {source.status === 'empty' && (
                      <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {source.status === 'loaded' && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {source.count || 0} records
                        </Badge>
                      )}
                      {source.status === 'empty' && (
                        <Badge variant="outline" className="bg-muted">
                          No data
                        </Badge>
                      )}
                      {source.status === 'loading' && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Loading...
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleIngestSampleData(source.id)}
                      disabled={isIngesting || !selectedBrand}
                    >
                      {source.status === 'loaded' ? 'Refresh' : 'Load Sample'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Message */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Sample Data for Development
                </p>
                <p className="text-sm text-blue-700">
                  This demo uses sample data to showcase intelligence capabilities. In production, 
                  connect to real SFMC, Veeva, IQVIA, and social listening APIs for live data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};