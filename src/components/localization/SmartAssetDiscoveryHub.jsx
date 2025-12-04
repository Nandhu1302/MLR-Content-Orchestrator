
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Filter,
  Globe,
  Star,
  CheckCircle,
  AlertTriangle,
  Copy,
  Eye,
  FileText,
  Image,
  Video,
  Mail,
  Smartphone,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSourceAssetSelection } from '@/hooks/useSourceAssetSelection';
import { useBrand } from '@/contexts/BrandContext';
import { SimplifiedAssetIndicators } from './SimplifiedAssetIndicators';
import { AssetDetailModal } from './AssetDetailModal';
import { AssetDiscoveryService } from '@/services/assetDiscoveryService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function SmartAssetDiscoveryHub({ onAssetSelect, className }) {
  const { selectedBrand } = useBrand();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTherapeuticArea, setSelectedTherapeuticArea] = useState('all');
  const [selectedAssetType, setSelectedAssetType] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [reusabilityFilter, setReusabilityFilter] = useState('all');
  const [activeView, setActiveView] = useState('grid');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isAdapting, setIsAdapting] = useState(false);
  const [discoveredAssets, setDiscoveredAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAsset, setModalAsset] = useState(null);
  const [assetLocalizationStatus, setAssetLocalizationStatus] = useState(new Map());
  const [localizationFilter, setLocalizationFilter] = useState('all');

  // Build filters for asset discovery
  const filters = React.useMemo(
    () => ({
      therapeuticArea: selectedTherapeuticArea !== 'all' ? selectedTherapeuticArea : undefined,
      assetType: selectedAssetType !== 'all' ? selectedAssetType : undefined,
      market: selectedMarket !== 'all' ? selectedMarket : undefined,
      searchQuery: searchQuery || undefined
    }),
    [selectedTherapeuticArea, selectedAssetType, selectedMarket, searchQuery]
  );

  // Load localization status for assets
  const loadLocalizationStatus = React.useCallback(async (assetIds) => {
    if (assetIds.length === 0) return;
    try {
      const { data, error } = await supabase
        .from('localization_projects')
        .select('source_content_id, target_markets, localization_status')
        .in('source_content_id', assetIds);

      if (error) throw error;

      const statusMap = new Map();
      data?.forEach((project) => {
        const existing = statusMap.get(project.source_content_id) || {
          completed: [],
          inProgress: []
        };
        project.target_markets.forEach((market) => {
          if (project.localization_status === 'completed') {
            existing.completed.push(market);
          } else if (project.localization_status === 'in_progress') {
            existing.inProgress.push(market);
          }
        });
        statusMap.set(project.source_content_id, existing);
      });
      setAssetLocalizationStatus(statusMap);
    } catch (error) {
      console.error('Failed to load localization status:', error);
    }
  }, []);

  // Load assets using AssetDiscoveryService
  const loadAssets = React.useCallback(async () => {
    if (!selectedBrand?.id) return;
    setIsLoading(true);
    try {
      // Try to discover existing assets
      const initialAssets = await AssetDiscoveryService.discoverAssets(selectedBrand.id, filters);

      if (initialAssets.length === 0) {
        toast({
          title: 'Initializing Asset Discovery',
          description: 'Creating comprehensive simulation data for all brands...',
          variant: 'default'
        });

        // Import and populate ALL brands to ensure comprehensive data
        const { AssetDiscoverySimulation } = await import('@/utils/assetDiscoverySimulation');
        await AssetDiscoverySimulation.populateDiscoveryAssets('all-brands', 'demo-user-id');

        // Reload assets after populating simulation data
        const assets = await AssetDiscoveryService.discoverAssets(selectedBrand.id, filters);
        setDiscoveredAssets(assets);

        toast({
          title: 'Asset Discovery Ready',
          description: `Found ${assets.length} assets ready for localization across all major pharma brands`,
          variant: 'default'
        });
      } else {
        setDiscoveredAssets(initialAssets);
      }

      // Load localization status for all assets
      const assetIds = (initialAssets.length > 0 ? initialAssets : await AssetDiscoveryService.discoverAssets(selectedBrand.id, filters))
        .map((a) => a.id);
      await loadLocalizationStatus(assetIds);
    } catch (error) {
      toast({
        title: 'Error loading assets',
        description: 'Failed to load discoverable assets',
        variant: 'destructive'
      });
      console.error('Asset loading error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBrand?.id, filters, toast, loadLocalizationStatus]);

  // Load assets when brand or filters change
  React.useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  // Use discovered assets (already filtered by AssetDiscoveryService)
  const filteredAssets = React.useMemo(() => {
    return discoveredAssets.filter((asset) => {
      const matchesReusability =
        reusabilityFilter === 'all' ||
        (reusabilityFilter === 'high' && asset.reusabilityScore >= 80) ||
        (reusabilityFilter === 'medium' && asset.reusabilityScore >= 60 && asset.reusabilityScore < 80) ||
        (reusabilityFilter === 'low' && asset.reusabilityScore < 60);

      // Localization status filter
      const status = assetLocalizationStatus.get(asset.id);
      const hasCompleted = status?.completed?.length > 0;
      const hasInProgress = status?.inProgress?.length > 0;
      const notLocalized = !hasCompleted && !hasInProgress;

      const matchesLocalization =
        localizationFilter === 'all' ||
        (localizationFilter === 'localized' && hasCompleted) ||
        (localizationFilter === 'in_progress' && hasInProgress) ||
        (localizationFilter === 'not_localized' && notLocalized);

      return matchesReusability && matchesLocalization;
    });
  }, [discoveredAssets, reusabilityFilter, localizationFilter, assetLocalizationStatus]);

  const getAssetIcon = (type) => {
    if (!type) return FileText;
    switch (type.toLowerCase()) {
      case 'mass-email':
      case 'email': return Mail;
      case 'social_media': return Smartphone;
      case 'landing-page':
      case 'landing_page': return Monitor;
      case 'digital-sales-aid':
      case 'sales_aid': return FileText;
      case 'patient-brochure': return FileText;
      case 'digital-tool': return Monitor;
      case 'presentation': return FileText;
      case 'video-script':
      case 'banner':
      case 'display_ad': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const getSourceBadgeColor = (source) => {
    switch (source) {
      case 'content_studio': return 'bg-blue-100 text-blue-800';
      case 'pre_mlr': return 'bg-green-100 text-green-800';
      case 'design_studio': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    onAssetSelect?.(asset);
  };

  const handleStartWorkflow = (asset) => {
    // Use onAssetSelect to stay within the hub and switch to intelligence tab
    handleAssetSelect(asset);
  };

  const handleShowDetails = (asset) => {
    setModalAsset(asset);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalAsset(null);
  };

  const handleAdaptForMarket = (asset) => {
    handleCloseModal();
    handleStartWorkflow(asset);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Smart Asset Discovery</h2>
            <p className="text-muted-foreground">
              Find, reuse, and adapt approved global assets for localization
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Globe className="h-3 w-3" />
              {discoveredAssets.length} Available Assets
            </Badge>
          </div>
        </div>

        {/* Search and Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets, projects, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedTherapeuticArea} onValueChange={setSelectedTherapeuticArea}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Therapeutic Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="oncology">Oncology</SelectItem>
              <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
              <SelectItem value="respiratory">Respiratory</SelectItem>
              <SelectItem value="immunology">Immunology</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="landing_page">Landing Page</SelectItem>
              <SelectItem value="sales_aid">Sales Aid</SelectItem>
              <SelectItem value="banner">Banner</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reusabilityFilter} onValueChange={setReusabilityFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Reusability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="high">High Reusability</SelectItem>
              <SelectItem value="medium">Medium Reusability</SelectItem>
              <SelectItem value="needs_adaptation">Needs Adaptation</SelectItem>
            </SelectContent>
          </Select>

          <Select value={localizationFilter} onValueChange={setLocalizationFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Localization Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="localized">Localized</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="not_localized">Not Localized</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          const AssetIcon = getAssetIcon(asset.asset_type || asset.type);
          const localizationStatus = assetLocalizationStatus.get(asset.id);

          return (
            <Card
              key={asset.id}
              className={cn(
                "hover:shadow-lg transition-shadow cursor-pointer border-2",
                selectedAsset?.id === asset.id ? "border-primary" : "border-transparent"
              )}
              onClick={() => handleAssetSelect(asset)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <AssetIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base line-clamp-2">{asset.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {asset.project_name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge
                    className={cn("text-xs", getSourceBadgeColor(asset.source_module))}
                    variant="outline"
                  >
                    {asset.source_module.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {asset.status}
                  </Badge>

                  {/* Localization Status Badges */}
                  {localizationStatus?.completed && localizationStatus.completed.length > 0 && (
                    <Badge variant="default" className="text-xs bg-green-500 gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {localizationStatus.completed.join(', ')}
                    </Badge>
                  )}
                  {localizationStatus?.inProgress && localizationStatus.inProgress.length > 0 && (
                    <Badge variant="default" className="text-xs bg-yellow-500 gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {localizationStatus.inProgress.join(', ')}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Simplified Indicators */}
                <SimplifiedAssetIndicators asset={asset} />

                {/* Action Buttons */}
                <div className="pt-2 space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowDetails(asset);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Show More Details
                  </Button>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartWorkflow(asset);
                    }}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Start Localization Workflow
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAssets.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No assets found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}

      {/* Asset Detail Modal */}
      <AssetDetailModal
        asset={modalAsset}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdaptForMarket={handleAdaptForMarket}
      />
    </div>
  );
}
