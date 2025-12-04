
import React, { useState, useEffect } from 'react';
import { localizationSourceService } from '@/services/localizationSourceService';
import { ExternalAssetUpload } from '@/components/localization/ExternalAssetUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Building2,
  FileText,
  Globe,
  ArrowRight,
  Search,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Target,
  Filter,
  MapPin,
  Stethoscope,
  Antenna,
  Plus,
} from 'lucide-react';
import { AssetMetadataPreservationService } from '@/services/AssetMetadataPreservationService';
import { RichPhase1Interface } from '../RichPhase1Interface';
import { useToast } from '@/hooks/use-toast';
import { useBrand } from '@/contexts/BrandContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * NOTE:
 * - Removed TS interfaces (EnhancedGlobalAssetContextCaptureProps, SourceAsset, etc.)
 * - Removed all type annotations and generic parameters.
 * - Kept logic, state, effects, and UI intact.
 */

export const EnhancedGlobalAssetContextCapture = ({
  selectedAsset,
  onAssetSelect,
  onContextComplete,
}) => {
  // Selection Hierarchy State
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedIndication, setSelectedIndication] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');

  // Data State
  const [availableMarkets, setAvailableMarkets] = useState([]);
  const [availableIndications, setAvailableIndications] = useState([]);
  const [availableChannels, setAvailableChannels] = useState([]);
  const [sourceAssets, setSourceAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [assetMetadata, setAssetMetadata] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [contextProgress, setContextProgress] = useState(0);
  const [enhancedMetadata, setEnhancedMetadata] = useState({});
  const [showRichInterface, setShowRichInterface] = useState(false);

  const { toast } = useToast();
  const { selectedBrand } = useBrand();

  // Load available markets for the selected brand
  useEffect(() => {
    if (selectedBrand?.id) {
      loadAvailableMarkets();
    }
  }, [selectedBrand]);

  // Load available indications when market is selected
  useEffect(() => {
    if (selectedMarket && selectedBrand?.id) {
      loadBrandSpecificIndications();
    }
  }, [selectedMarket, selectedBrand]);

  // Load available channels when indication is selected
  useEffect(() => {
    if (selectedIndication && selectedMarket) {
      loadAvailableChannels();
    }
  }, [selectedIndication, selectedMarket]);

  // Load and filter assets when all selections are made
  useEffect(() => {
    if (selectedMarket && selectedIndication && selectedChannel && selectedBrand?.id) {
      loadFilteredAssets();
    }
  }, [selectedMarket, selectedIndication, selectedChannel, selectedBrand]);

  // Apply search filter
  useEffect(() => {
    if (sourceAssets.length > 0) {
      applySearchFilter();
    }
  }, [sourceAssets, searchTerm]);

  const loadAvailableMarkets = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading markets for brand:', selectedBrand?.brand_name, 'ID:', selectedBrand?.id);

      const { data: marketConfigs, error } = await supabase
        .from('brand_market_configurations')
        .select('*')
        .eq('brand_id', selectedBrand?.id)
        .eq('is_active', true)
        .order('therapeutic_area_relevance', { ascending: false });

      if (error) {
        console.error('❌ Error loading markets:', error);
        setError('Failed to load available markets');
        setAvailableMarkets([]);
        return;
      }

      if (marketConfigs && marketConfigs.length > 0) {
        console.log(`✅ Loaded ${marketConfigs.length} markets:`, marketConfigs.map(m => m.market_code));
        const markets = marketConfigs.map(config => ({
          code: config.market_code,
          name: config.market_name,
          language: config.language_name,
          regulatory_complexity: config.regulatory_complexity,
          isPrimary: config.is_primary_market,
        }));
        setAvailableMarkets(markets);
      } else {
        console.warn('⚠️ No markets found for brand:', selectedBrand?.brand_name);
        setAvailableMarkets([]);
      }
    } catch (err) {
      console.error('❌ Failed to load markets:', err);
      setError('Failed to load available markets');
      setAvailableMarkets([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBrandSpecificIndications = async () => {
    if (!selectedBrand?.id || !selectedMarket) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('regulatory_framework')
        .select('indication, therapeutic_area')
        .eq('brand_id', selectedBrand.id)
        .eq('market', selectedMarket)
        .eq('approval_status', 'Approved');

      if (error) throw error;

      // Get unique indications for this brand and market
      const uniqueIndications = [...new Set((data || []).map(item => item.indication))];
      const formattedIndications = uniqueIndications.map(indication => ({
        code: indication,
        name: formatIndicationName(indication),
        therapeutic_area: (data || []).find(d => d.indication === indication)?.therapeutic_area ?? 'Respiratory',
        approval_status: 'Approved',
      }));

      setAvailableIndications(formattedIndications);
      console.log(`Loaded ${uniqueIndications.length} indications for ${selectedMarket}:`, uniqueIndications);
    } catch (err) {
      console.error('Error loading indications:', err);
      setError('Failed to load indications for selected market');
      // Fallback: if no regulatory data, show common indications for demo
      const fallbackIndications = ['IPF', 'SSc-ILD'].map(indication => ({
        code: indication,
        name: formatIndicationName(indication),
        therapeutic_area: 'Respiratory',
        approval_status: 'Approved',
      }));
      setAvailableIndications(fallbackIndications);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableChannels = async () => {
    try {
      // Load channels based on existing assets for this market + indication combination
      const channels = ['digital', 'email', 'print', 'social', 'video', 'events'];
      setAvailableChannels(channels);
    } catch (err) {
      console.error('Failed to load channels:', err);
      setError('Failed to load available channels');
    }
  };

  const loadFilteredAssets = async () => {
    if (!selectedBrand?.id) {
      setSourceAssets([]);
      setFilteredAssets([]);
      return;
    }

    setLoading(true);
    try {
      // Get all source assets for the brand
      const { data: rawAssets, error } = await supabase
        .from('content_assets')
        .select('*')
        .eq('brand_id', selectedBrand.id)
        .in('status', ['approved', 'published', 'active', 'draft']);

      if (error) throw error;

      // Map database assets to a normalized shape
      const assets = (rawAssets || []).map(asset => ({
        id: asset.id,
        name: asset.asset_name,
        type: asset.asset_type,
        source_module: 'content_studio',
        description: asset.compliance_notes ?? '',
        status: asset.status,
        brand_id: asset.brand_id,
        metadata: asset.metadata,
        primary_content: asset.primary_content, // Preserve primary_content property
        content: asset.primary_content,         // Keep content for backward compatibility
      }));

      setSourceAssets(assets);

      // Progressive filtering when all selections are chosen
      if (selectedMarket && selectedIndication && selectedChannel) {
        const progressiveFiltered = assets.filter(asset => {
          const metadata = asset.metadata ?? {};
          const primaryContent = asset.content ?? {};

          // Market filtering - flexible
          const assetMarkets = metadata.targetMarkets ?? primaryContent.targetMarkets ?? [];
          const marketMatch =
            assetMarkets.includes(selectedMarket) ||
            assetMarkets.length === 0 ||             // Include assets without market metadata
            assetMarkets.includes('US');             // Fallback to US assets for demo

          // Indication filtering - check multiple fields and be flexible
          const assetIndication = metadata.indication ?? primaryContent.indication;
          const indicationMatch =
            assetIndication === selectedIndication ||
            !assetIndication || // Include assets without indication metadata
            asset.name.toLowerCase().includes(selectedIndication.toLowerCase());

          // Channel filtering - improved detection with fallbacks
          const assetChannel = getAssetChannel(asset);
          const channelMatch =
            assetChannel === selectedChannel ||
            assetChannel === 'Unknown' ||  // Include assets we can't categorize
            assetChannel === 'digital';    // Default fallback

          return marketMatch && indicationMatch && channelMatch;
        });

        // Broader fallback if progressive filter finds nothing
        if (progressiveFiltered.length === 0) {
          console.log('No assets found with progressive filtering, using broader fallback');
          const broadFiltered = assets.filter(asset => {
            const assetText = `${asset.name} ${JSON.stringify(asset.content)}`.toLowerCase();
            return (
              assetText.includes((selectedBrand.brand_name || '').toLowerCase()) ||
              assetText.includes(selectedIndication.toLowerCase())
            );
          });
          setFilteredAssets(broadFiltered);
          console.log(`Using broad fallback: ${broadFiltered.length} assets found`);
        } else {
          setFilteredAssets(progressiveFiltered);
          console.log(`Progressive filter: ${progressiveFiltered.length} assets found`);
        }
      } else {
        // Show all brand assets if not all filters are selected
        setFilteredAssets(assets);
      }

      console.log(`Loaded ${assets.length} total assets for brand`);
    } catch (err) {
      console.error('Error loading assets:', err);
      setError('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const applySearchFilter = () => {
    if (!searchTerm.trim()) {
      setFilteredAssets(sourceAssets);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = sourceAssets.filter(
      asset =>
        asset.name.toLowerCase().includes(lower) ||
        (asset.description && asset.description.toLowerCase().includes(lower))
    );
    setFilteredAssets(filtered);
  };

  const handleAssetSelection = (asset) => {
    // Enhance asset with selection context
    const enhancedAsset = {
      ...asset,
      localization_context: {
        target_market: selectedMarket,
        indication: selectedIndication,
        channel: selectedChannel,
        market_display_name: getMarketDisplayName(selectedMarket),
        indication_display_name: formatIndicationName(selectedIndication),
      },
    };
    onAssetSelect(enhancedAsset);
  };

  const captureGlobalContext = async (projectData) => {
    if (!selectedAsset?.id && !projectData) return;

    setIsCapturing(true);
    setContextProgress(10);

    try {
      setContextProgress(30);
      await new Promise(resolve => setTimeout(resolve, 800));
      setContextProgress(60);

      const metadata = await AssetMetadataPreservationService.captureGlobalAssetContext(
        selectedAsset?.id ?? projectData?.source_content_id ?? projectData?.id,
        selectedAsset?.brand_id ?? projectData?.brand_id ?? selectedBrand?.id ?? 'demo-brand-id',
        {
          selectedAsset,
          localization_context: selectedAsset?.localization_context,
          localizationProject: projectData,
        }
      );

      setContextProgress(90);
      setAssetMetadata({
        ...metadata,
        localization_context: selectedAsset.localization_context,
      });

      setEnhancedMetadata({
        businessContext: '',
        targetAudience: '',
        performanceGoals: '',
        culturalConsiderations: '',
        regulatoryNotes: '',
        assetRelationships: [],
      });

      setContextProgress(100);
      setShowRichInterface(true);

      toast({
        title: 'Enhanced Context Captured',
        description: 'Asset context captured with market-specific intelligence',
        variant: 'default',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Context Capture Failed',
        description: `Failed to capture context: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCompleteContextCapture = () => {
    const completeMetadata = {
      ...assetMetadata,
      enhancedContext: enhancedMetadata,
      captureTimestamp: new Date().toISOString(),
      localization_scope: 'full-content',
      complexityLevel: 'medium',
      selection_context: {
        market: selectedMarket,
        indication: selectedIndication,
        channel: selectedChannel,
      },
      // CRITICAL: Include primary_content so Phase 2 can restore segments
      primary_content: selectedAsset?.primary_content ?? selectedAsset?.content,
      source_asset_id: selectedAsset?.id,
      source_asset_name: selectedAsset?.name,
    };

    console.log('📦 Phase 1 Complete - Passing content to Phase 2:', {
      hasContent: !!completeMetadata.primary_content,
      contentKeys: Object.keys(completeMetadata.primary_content ?? {}),
      assetId: completeMetadata.source_asset_id,
    });

    onContextComplete(completeMetadata);
  };

  const handleExternalAssetCreated = (asset) => {
    // Enhance external asset with context
    const enhancedAsset = {
      ...asset,
      localization_context: {
        target_market: selectedMarket,
        indication: selectedIndication,
        channel: selectedChannel,
        market_display_name: getMarketDisplayName(selectedMarket),
        indication_display_name: formatIndicationName(selectedIndication),
      },
    };
    onAssetSelect(enhancedAsset);
    setShowUpload(false);
  };

  const resetSelections = () => {
    setSelectedMarket('');
    setSelectedIndication('');
    setSelectedChannel('');
    setAvailableIndications([]);
    setAvailableChannels([]);
    setSourceAssets([]);
    setFilteredAssets([]);
  };

  // Helper functions
  const getMarketDisplayName = (market) => {
    const marketNames = {
      JP: 'Japan',
      CN: 'China',
      US: 'United States',
      EU: 'European Union',
      UK: 'United Kingdom',
      CA: 'Canada',
      AU: 'Australia',
      LATAM: 'Latin America',
      APAC: 'Asia Pacific',
    };
    return marketNames[market] ?? market;
  };

  const formatIndicationName = (indication) => {
    return indication.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getAssetChannel = (asset) => {
    const channelKeywords = {
      digital: ['website', 'web', 'online', 'digital'],
      email: ['email', 'newsletter', 'e-mail', 'patient-email'],
      print: ['print', 'brochure', 'flyer', 'poster'],
      social: ['social', 'facebook', 'twitter', 'instagram'],
      video: ['video', 'animation', 'motion'],
      events: ['event', 'conference', 'webinar'],
    };

    for (const [channel, keywords] of Object.entries(channelKeywords)) {
      if (
        keywords.some(
          keyword =>
            asset.name?.toLowerCase().includes(keyword) ||
            asset.type?.toLowerCase().includes(keyword) ||
            (asset.content && JSON.stringify(asset.content).toLowerCase().includes(keyword))
        )
      ) {
        return channel;
      }
    }
    return 'digital'; // Default fallback
  };

  // Capture context when asset is selected
  useEffect(() => {
    if (selectedAsset?.id) {
      const projectData = selectedAsset.projectData ?? selectedAsset;
      captureGlobalContext(projectData);
    }
  }, [selectedAsset]);

  // Show upload interface
  if (showUpload) {
    return (
      <ExternalAssetUpload
        onAssetCreated={handleExternalAssetCreated}
        onCancel={() => setShowUpload(false)}
      />
    );
  }

  // Show rich interface when asset is selected
  if (selectedAsset && showRichInterface && assetMetadata) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Enhanced Phase 1: Market-Specific Asset Intelligence
            </h2>
            <p className="text-muted-foreground">
              Complete asset intelligence for {selectedAsset.name} • {getMarketDisplayName(selectedMarket)} •{' '}
              {formatIndicationName(selectedIndication)}
            </p>
          </div>
          <Button variant="outline" onClick={() => onAssetSelect(null)}>
            Select Different Asset
          </Button>
        </div>

        <RichPhase1Interface
          selectedAsset={selectedAsset}
          assetMetadata={assetMetadata}
          onEnhancementUpdate={(field, value) => {
            setEnhancedMetadata(prev => ({
              ...prev,
              [field]: value,
            }));
          }}
          onComplete={handleCompleteContextCapture}
        />
      </div>
    );
  }

  // Show selection interface
  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Enhanced Phase 1: Market-Specific Asset Selection
        </h2>
        <p className="text-muted-foreground">
          Select market, indication, and channel to discover contextually relevant assets
        </p>
      </div>

      {/* Selection Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Market-Specific Content Discovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Market Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Step 1: Select Target Market</label>
            </div>
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger>
                <SelectValue placeholder="Choose target market..." />
              </SelectTrigger>
              <SelectContent>
                {availableMarkets.map((market) => (
                  <SelectItem key={market.code} value={market.code}>
                    {market.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Indication Selection */}
          {selectedMarket && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium">Step 2: Select Brand Indication</label>
                <Badge variant="outline" className="text-xs">
                  {availableIndications.length} approved for {getMarketDisplayName(selectedMarket)}
                </Badge>
              </div>
              <Select value={selectedIndication} onValueChange={setSelectedIndication}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose brand indication..." />
                </SelectTrigger>
                <SelectContent>
                  {availableIndications.map((indication) => (
                    <SelectItem key={indication.code} value={indication.code}>
                      <div className="flex items-center justify-between w-full">
                        <span>{indication.name}</span>
                        <Badge variant="secondary" className="text-xs ml-2">
                          {indication.therapeutic_area}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 3: Channel Selection */}
          {selectedIndication && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Antenna className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium">Step 3: Select Channel</label>
              </div>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose content channel..." />
                </SelectTrigger>
                <SelectContent>
                  {availableChannels.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selection Summary */}
          {selectedMarket && selectedIndication && selectedChannel && (
            <div className="p-4 bg-primary/5 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Context Selected</h4>
                  <p className="text-xs text-muted-foreground">
                    {getMarketDisplayName(selectedMarket)} • {formatIndicationName(selectedIndication)} •{' '}
                    {selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={resetSelections}>
                  Reset
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Discovery */}
      {selectedMarket && selectedIndication && selectedChannel && (
        <Card>
          <CardHeader>
            <CardTitle>Contextual Asset Discovery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowUpload(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Upload New Asset
              </Button>
              <Button onClick={loadFilteredAssets} disabled={loading} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Loading contextual assets...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {/* Assets Grid */}
            {!loading && !error && filteredAssets.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{filteredAssets.length} assets found</Badge>
                    {sourceAssets.length > filteredAssets.length && (
                      <Badge variant="outline" className="text-xs">
                        {sourceAssets.length} total available
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAssets.map((asset) => (
                    <Card
                      key={asset.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleAssetSelection(asset)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-sm line-clamp-1">{asset.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {asset.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {asset.description ?? 'No description available'}
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{getAssetChannel(asset)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-primary" />
                              <span className="text-xs text-primary">Match</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {!loading && !error && filteredAssets.length === 0 && sourceAssets.length === 0 && (
              <div className="text-center py-12">
                <Globe className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Assets Found</h3>
                <p className="text-muted-foreground mb-4">
                  No assets match your selected context. Consider uploading new content.
                </p>
                <Button onClick={() => setShowUpload(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Asset for This Context
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
