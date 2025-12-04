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
  Filter,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useVisualAssets, useVisualAssetUrl } from '@/hooks/useVisualAssets';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const VISUAL_TYPE_ICONS = {
  image: <Image className="h-4 w-4" />,
  chart: <BarChart3 className="h-4 w-4" />,
  graph: <BarChart3 className="h-4 w-4" />,
  table: <Table className="h-4 w-4" />,
  infographic: <Image className="h-4 w-4" />,
  diagram: <Image className="h-4 w-4" />
};

function VisualAssetCard({ 
  asset, 
  onInsert, 
  onPreview,
  isRecommended 
}) {
  const { data: signedUrl } = useVisualAssetUrl(asset.storage_path);

  return (
    <div className="group relative border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
      {/* Image/Preview */}
      <div className="aspect-video bg-muted relative">
        {signedUrl ? (
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
          <Badge variant="outline" className="text-xs">
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

export function VisualAssetGallery({
  brandId,
  assetType,
  targetAudience,
  linkedClaimIds,
  onInsertVisual
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [previewAsset, setPreviewAsset] = useState(null);
  
  const { data: visualAssets, isLoading } = useVisualAssets(brandId);

  // Filter and sort visual assets
  const filteredAssets = useMemo(() => {
    if (!visualAssets) return [];
    
    return visualAssets
      .filter(asset => {
        // MLR approved only
        if (!asset.mlr_approved) return false;
        
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
        // Prioritize assets that share linked claims
        const aHasLinkedClaim = linkedClaimIds?.some(id => a.linked_claims?.includes(id));
        const bHasLinkedClaim = linkedClaimIds?.some(id => b.linked_claims?.includes(id));
        
        if (aHasLinkedClaim && !bHasLinkedClaim) return -1;
        if (!aHasLinkedClaim && bHasLinkedClaim) return 1;
        
        // Then by usage count
        return (b.usage_count || 0) - (a.usage_count || 0);
      });
  }, [visualAssets, typeFilter, searchQuery, linkedClaimIds]);

  // Recommended assets (share linked claims with content)
  const recommendedAssets = useMemo(() => {
    if (!linkedClaimIds || linkedClaimIds.length === 0) return [];
    return filteredAssets.filter(asset => 
      linkedClaimIds.some(id => asset.linked_claims?.includes(id))
    );
  }, [filteredAssets, linkedClaimIds]);

  const handleInsert = (asset) => {
    onInsertVisual?.(asset);
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
            <Badge variant="outline" className="text-xs">
              {filteredAssets.length} available
            </Badge>
          </div>
          
          {/* Search and Filters */}
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
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Tabs value={typeFilter} onValueChange={setTypeFilter}>
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="image" className="text-xs">
                <Image className="h-3 w-3 mr-1" />
                Images
              </TabsTrigger>
              <TabsTrigger value="chart" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="table" className="text-xs">
                <Table className="h-3 w-3 mr-1" />
                Tables
              </TabsTrigger>
              <TabsTrigger value="infographic" className="text-xs">
                Infographics
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[450px] mt-3">
              {/* Recommended Section */}
              {recommendedAssets.length > 0 && typeFilter === 'all' && (
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
                {filteredAssets.length > 0 ? (
                  filteredAssets
                    .filter(a => !recommendedAssets.includes(a) || typeFilter !== 'all')
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
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewAsset} onOpenChange={() => setPreviewAsset(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewAsset?.title || 'Visual Asset'}</DialogTitle>
          </DialogHeader>
          {previewAsset && (
            <PreviewContent asset={previewAsset} onInsert={() => {
              handleInsert(previewAsset);
              setPreviewAsset(null);
            }} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function PreviewContent({ asset, onInsert }) {
  const { data: signedUrl } = useVisualAssetUrl(asset.storage_path);
  
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
        {signedUrl ? (
          <img 
            src={signedUrl} 
            alt={asset.title || 'Visual asset'}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Image className="h-16 w-16" />
          </div>
        )}
      </div>
      
      {asset.caption && (
        <p className="text-sm text-muted-foreground">{asset.caption}</p>
      )}
      
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline">{asset.visual_type}</Badge>
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
        <Button variant="outline" onClick={() => {}}>
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