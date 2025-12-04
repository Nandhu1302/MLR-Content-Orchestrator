import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Image, 
  BarChart3, 
  Table, 
  Search, 
  Plus, 
  Check,
  RefreshCw,
  Eye,
  LineChart,
  FileImage,
  ShieldCheck
} from 'lucide-react';
import { useVisualAssets, useVisualAssetUrl } from '@/hooks/useVisualAssets';
import { VisualTableRenderer } from './VisualTableRenderer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const VISUAL_TYPE_ICONS = {
  image: <Image className="h-4 w-4" />,
  chart: <BarChart3 className="h-4 w-4" />,
  graph: <LineChart className="h-4 w-4" />,
  table: <Table className="h-4 w-4" />,
  infographic: <FileImage className="h-4 w-4" />,
  diagram: <FileImage className="h-4 w-4" />
};

// Component for displaying a used visual with preview
function UsedVisualCard({ visual, fullAssetData }) {
  const { data: signedUrl } = useVisualAssetUrl(visual.storagePath || null);
  
  // Get visual data from full asset or from the visual usage
  const visualData = fullAssetData?.visual_data || visual.visualData;
  const isTable = visual.visualType === 'table';
  const hasTableData = isTable && visualData && (visualData.headers || visualData.rows || visualData.table_data);

  return (
    <div className="flex gap-3 p-3 border rounded-lg bg-muted/30">
      {/* Visual Preview */}
      <div className={`${hasTableData ? 'w-40' : 'w-20'} h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0`}>
        {hasTableData ? (
          <div className="w-full h-full overflow-hidden p-1">
            <VisualTableRenderer visualData={visualData} compact />
          </div>
        ) : signedUrl ? (
          <img 
            src={signedUrl} 
            alt={visual.title || 'Visual asset'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {VISUAL_TYPE_ICONS[visual.visualType] || <Image className="h-6 w-6" />}
          </div>
        )}
      </div>
      
      {/* Visual Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant="outline" className="text-xs capitalize">
            {visual.visualType}
          </Badge>
          {visual.mlrApproved && (
            <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <Check className="h-3 w-3 mr-1" />
              MLR
            </Badge>
          )}
        </div>
        <p className="text-sm font-medium line-clamp-1">{visual.title || 'Untitled Visual'}</p>
        {visual.caption && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{visual.caption}</p>
        )}
        {visual.sourceSection && (
          <p className="text-xs text-muted-foreground mt-1">
            Source: {visual.sourceSection}{visual.sourcePage ? `, p.${visual.sourcePage}` : ''}
          </p>
        )}
      </div>
    </div>
  );
}

// Component for browsing visual assets
function VisualAssetCard({ 
  asset, 
  onInsert, 
  onPreview,
  isRecommended 
}) {
  const { data: signedUrl } = useVisualAssetUrl(asset.storage_path);
  
  const isTable = asset.visual_type === 'table';
  const hasTableData = isTable && asset.visual_data && 
    (asset.visual_data.headers || asset.visual_data.rows || asset.visual_data.table_data);

  return (
    <div className="group relative border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
      {/* Image/Preview */}
      <div className="aspect-video bg-muted relative">
        {hasTableData ? (
          <div className="w-full h-full overflow-hidden p-2">
            <VisualTableRenderer visualData={asset.visual_data} compact />
          </div>
        ) : signedUrl ? (
          <img 
            src={signedUrl} 
            alt={asset.title || 'Visual asset'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {VISUAL_TYPE_ICONS[asset.visual_type] || <Image className="h-8 w-8" />}
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" onClick={onInsert}>
            <Plus className="h-4 w-4 mr-1" />
            Insert
          </Button>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isRecommended && (
            <Badge className="text-xs bg-primary">
              Recommended
            </Badge>
          )}
          {asset.mlr_approved && (
            <Badge className="text-xs bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              MLR
            </Badge>
          )}
        </div>
      </div>
      
      {/* Info */}
      <div className="p-2">
        <p className="text-sm font-medium truncate">{asset.title || 'Untitled'}</p>
        <div className="flex items-center gap-1 mt-1">
          <Badge variant="outline" className="text-xs capitalize">
            {asset.visual_type}
          </Badge>
          {asset.usage_count > 0 && (
            <span className="text-xs text-muted-foreground">
              Used {asset.usage_count}x
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewContent({ asset, onInsert, onClose }) {
  const { data: signedUrl } = useVisualAssetUrl(asset.storage_path);
  
  const isTable = asset.visual_type === 'table';
  const hasTableData = isTable && asset.visual_data && 
    (asset.visual_data.headers || asset.visual_data.rows || asset.visual_data.table_data);
  
  return (
    <div className="space-y-4">
      <div className="min-h-[200px] bg-muted rounded-lg overflow-hidden">
        {hasTableData ? (
          <div className="p-4">
            <VisualTableRenderer 
              visualData={asset.visual_data} 
              title={asset.title || undefined}
            />
          </div>
        ) : signedUrl ? (
          <img 
            src={signedUrl} 
            alt={asset.title || 'Visual asset'}
            className="w-full h-full object-contain max-h-[400px]"
          />
        ) : (
          <div className="w-full h-[200px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              {VISUAL_TYPE_ICONS[asset.visual_type] || <Image className="h-16 w-16 mx-auto" />}
              <p className="mt-2 text-sm">No preview available</p>
            </div>
          </div>
        )}
      </div>
      
      {asset.caption && (
        <p className="text-sm text-muted-foreground">{asset.caption}</p>
      )}
      
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="capitalize">{asset.visual_type}</Badge>
        {asset.mlr_approved && (
          <Badge className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            MLR Approved
          </Badge>
        )}
        {asset.source_section && (
          <Badge variant="secondary">Source: {asset.source_section}</Badge>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onInsert}>
          <Plus className="h-4 w-4 mr-1" />
          Insert into Content
        </Button>
      </div>
    </div>
  );
}

export function VisualAssetsPanel({
  brandId,
  assetType,
  targetAudience,
  linkedClaimIds,
  visualsUsed,
  onInsertVisual
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('used');
  const [previewAsset, setPreviewAsset] = useState(null);
  const [showMlrOnly, setShowMlrOnly] = useState(false);
  
  const { data: visualAssets, isLoading } = useVisualAssets(brandId);

  // Debug logging
  console.log('📊 VisualAssetsPanel data:', {
    brandId,
    hasVisualsUsed: !!visualsUsed,
    visualsUsedCount: visualsUsed?.length || 0,
    totalAssetsFromDB: visualAssets?.length || 0,
    assetsWithTableData: visualAssets?.filter(a => a.visual_data)?.length || 0,
    mlrApprovedCount: visualAssets?.filter(a => a.mlr_approved)?.length || 0
  });

  // Create a map of full asset data for used visuals
  const usedVisualsFullData = useMemo(() => {
    if (!visualsUsed || !visualAssets) return new Map();
    const map = new Map();
    visualsUsed.forEach(v => {
      const fullAsset = visualAssets.find(a => a.id === v.visualId);
      if (fullAsset) map.set(v.visualId, fullAsset);
    });
    return map;
  }, [visualsUsed, visualAssets]);

  // Filter assets by type and search - RELAXED MLR filter
  const filterAssets = (typeFilter) => {
    if (!visualAssets) return [];
    
    return visualAssets
      .filter(asset => {
        // Optional MLR filter (user toggle)
        if (showMlrOnly && !asset.mlr_approved) return false;
        
        // Type filter
        if (typeFilter !== 'all' && asset.visual_type !== typeFilter) return false;
        
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            asset.title?.toLowerCase().includes(query) ||
            asset.caption?.toLowerCase().includes(query) ||
            asset.visual_type.includes(query)
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        // Prioritize MLR approved
        if (a.mlr_approved && !b.mlr_approved) return -1;
        if (!a.mlr_approved && b.mlr_approved) return 1;
        
        // Then prioritize assets that share linked claims
        const aHasLinkedClaim = linkedClaimIds?.some(id => a.linked_claims?.includes(id));
        const bHasLinkedClaim = linkedClaimIds?.some(id => b.linked_claims?.includes(id));
        
        if (aHasLinkedClaim && !bHasLinkedClaim) return -1;
        if (!aHasLinkedClaim && bHasLinkedClaim) return 1;
        
        // Then by usage count
        return (b.usage_count || 0) - (a.usage_count || 0);
      });
  };

  const allAssets = useMemo(() => filterAssets('all'), [visualAssets, searchQuery, linkedClaimIds, showMlrOnly]);
  const imageAssets = useMemo(() => filterAssets('image'), [visualAssets, searchQuery, linkedClaimIds, showMlrOnly]);
  const chartAssets = useMemo(() => filterAssets('chart'), [visualAssets, searchQuery, linkedClaimIds, showMlrOnly]);
  const tableAssets = useMemo(() => filterAssets('table'), [visualAssets, searchQuery, linkedClaimIds, showMlrOnly]);
  const graphAssets = useMemo(() => filterAssets('graph'), [visualAssets, searchQuery, linkedClaimIds, showMlrOnly]);

  // Recommended assets (share linked claims with content)
  const recommendedAssets = useMemo(() => {
    if (!linkedClaimIds || linkedClaimIds.length === 0) return [];
    return allAssets.filter(asset => 
      linkedClaimIds.some(id => asset.linked_claims?.includes(id))
    );
  }, [allAssets, linkedClaimIds]);

  const handleInsert = (asset) => {
    onInsertVisual?.(asset);
    setPreviewAsset(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Image className="h-5 w-5" />
              Visual Assets
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {(visualsUsed?.length || 0) > 0 && (
                <Badge variant="outline" className="text-xs">
                  {visualsUsed?.length} Used
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {allAssets.length} Available
              </Badge>
            </div>
          </div>
          
          {/* Search and MLR Filter */}
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search visuals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Button
              variant={showMlrOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMlrOnly(!showMlrOnly)}
              className="h-9 gap-1"
            >
              <ShieldCheck className="h-4 w-4" />
              MLR Only
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-6">
              <TabsTrigger value="used" className="text-xs">
                <Check className="h-3 w-3 mr-1" />
                Used
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                All ({allAssets.length})
              </TabsTrigger>
              <TabsTrigger value="images" className="text-xs">
                <Image className="h-3 w-3 mr-1" />
                ({imageAssets.length})
              </TabsTrigger>
              <TabsTrigger value="charts" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                ({chartAssets.length})
              </TabsTrigger>
              <TabsTrigger value="tables" className="text-xs">
                <Table className="h-3 w-3 mr-1" />
                ({tableAssets.length})
              </TabsTrigger>
              <TabsTrigger value="graphs" className="text-xs">
                <LineChart className="h-3 w-3 mr-1" />
                ({graphAssets.length})
              </TabsTrigger>
            </TabsList>

            {/* Used Tab */}
            <TabsContent value="used" className="mt-3">
              <ScrollArea className="h-[400px]">
                {visualsUsed && visualsUsed.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Visual Assets Referenced ({visualsUsed.length})
                    </h4>
                    {visualsUsed.map((visual, index) => (
                      <UsedVisualCard 
                        key={visual.visualId || index} 
                        visual={visual}
                        fullAssetData={usedVisualsFullData.get(visual.visualId)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No visual assets used yet</p>
                    <p className="text-xs mt-1">Visual assets referenced during content generation will appear here</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* All Assets Tab */}
            <TabsContent value="all" className="mt-3">
              <ScrollArea className="h-[400px]">
                {/* Recommended Section */}
                {recommendedAssets.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Check className="h-4 w-4 text-primary" />
                      Recommended (matches your content claims)
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {recommendedAssets.slice(0, 4).map(asset => (
                        <VisualAssetCard
                          key={asset.id}
                          asset={asset}
                          isRecommended
                          onInsert={() => handleInsert(asset)}
                          onPreview={() => setPreviewAsset(asset)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Assets Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {allAssets.length > 0 ? (
                    allAssets
                      .filter(a => !recommendedAssets.includes(a))
                      .map(asset => (
                        <VisualAssetCard
                          key={asset.id}
                          asset={asset}
                          onInsert={() => handleInsert(asset)}
                          onPreview={() => setPreviewAsset(asset)}
                        />
                      ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No visual assets found</p>
                      <p className="text-xs mt-1">Try adjusting your search or MLR filter</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="mt-3">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 gap-3">
                  {imageAssets.length > 0 ? (
                    imageAssets.map(asset => (
                      <VisualAssetCard
                        key={asset.id}
                        asset={asset}
                        onInsert={() => handleInsert(asset)}
                        onPreview={() => setPreviewAsset(asset)}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No images found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Charts Tab */}
            <TabsContent value="charts" className="mt-3">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 gap-3">
                  {chartAssets.length > 0 ? (
                    chartAssets.map(asset => (
                      <VisualAssetCard
                        key={asset.id}
                        asset={asset}
                        onInsert={() => handleInsert(asset)}
                        onPreview={() => setPreviewAsset(asset)}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No charts found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Tables Tab */}
            <TabsContent value="tables" className="mt-3">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 gap-3">
                  {tableAssets.length > 0 ? (
                    tableAssets.map(asset => (
                      <VisualAssetCard
                        key={asset.id}
                        asset={asset}
                        onInsert={() => handleInsert(asset)}
                        onPreview={() => setPreviewAsset(asset)}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      <Table className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tables found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Graphs Tab */}
            <TabsContent value="graphs" className="mt-3">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 gap-3">
                  {graphAssets.length > 0 ? (
                    graphAssets.map(asset => (
                      <VisualAssetCard
                        key={asset.id}
                        asset={asset}
                        onInsert={() => handleInsert(asset)}
                        onPreview={() => setPreviewAsset(asset)}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      <LineChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No graphs found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewAsset} onOpenChange={() => setPreviewAsset(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewAsset?.title || 'Visual Asset Preview'}</DialogTitle>
          </DialogHeader>
          {previewAsset && (
            <PreviewContent 
              asset={previewAsset} 
              onInsert={() => handleInsert(previewAsset)}
              onClose={() => setPreviewAsset(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}