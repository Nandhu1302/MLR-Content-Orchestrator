import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Calendar, Filter, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { AssetPreviewModal } from './AssetPreviewModal';

const AssetDiscoveryDashboard = ({
  contentStudioAssets,
  preMLRAssets,
  designStudioAssets,
  loading,
  onAssetSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [previewAsset, setPreviewAsset] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const filterAssets = (assets) => {
    return assets.filter(asset => {
      const contentStr = typeof asset.content === 'string' ? asset.content : (asset.content?.content || '');
      const matchesSearch = searchQuery === '' || 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contentStr.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedAssetType === 'all' || asset.type === selectedAssetType;
      const matchesStatus = selectedStatus === 'all' || asset.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  };
  
  const filteredContentAssets = useMemo(() => filterAssets(contentStudioAssets), [contentStudioAssets, searchQuery, selectedAssetType, selectedStatus]);
  const filteredPreMLRAssets = useMemo(() => filterAssets(preMLRAssets), [preMLRAssets, searchQuery, selectedAssetType, selectedStatus]);
  const filteredDesignAssets = useMemo(() => filterAssets(designStudioAssets), [designStudioAssets, searchQuery, selectedAssetType, selectedStatus]);
  
  const handleAssetClick = (asset) => {
    setPreviewAsset(asset);
    setPreviewOpen(true);
  };
  
  const handleAssetSelect = () => {
    if (previewAsset) {
      onAssetSelect(previewAsset);
      setPreviewOpen(false);
    }
  };
  
  const AssetCard = ({ asset }) => {
    const indication = asset.metadata?.intake_context?.indication;
    
    return (
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleAssetClick(asset)}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{asset.name}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {asset.project_name || 'No project'}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {asset.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {indication && (
            <div>
              <p className="text-xs text-muted-foreground">Indication</p>
              <p className="text-sm font-medium line-clamp-1">{indication}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {asset.source_module}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {asset.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const EmptyState = ({ message }) => (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Discover Assets</CardTitle>
            <CardDescription>
              Find and select approved assets from Content Studio, Pre-MLR, or Design Studio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets by name, type, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mass-email">Mass Email</SelectItem>
                  <SelectItem value="rep-triggered-email">Rep Triggered Email</SelectItem>
                  <SelectItem value="patient-email">Patient Email</SelectItem>
                  <SelectItem value="caregiver-email">Caregiver Email</SelectItem>
                  <SelectItem value="social-media-post">Social Media Post</SelectItem>
                  <SelectItem value="website-landing-page">Website Landing Page</SelectItem>
                  <SelectItem value="digital-sales-aid">Digital Sales Aid</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="content-studio" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content-studio">
              Content Studio ({filteredContentAssets.length})
            </TabsTrigger>
            <TabsTrigger value="pre-mlr">
              Pre-MLR ({filteredPreMLRAssets.length})
            </TabsTrigger>
            <TabsTrigger value="design-studio">
              Design Studio ({filteredDesignAssets.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content-studio" className="space-y-4">
            {filteredContentAssets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContentAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <EmptyState message="No Content Studio assets found matching your filters" />
            )}
          </TabsContent>
          
          <TabsContent value="pre-mlr" className="space-y-4">
            {filteredPreMLRAssets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPreMLRAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <EmptyState message="No Pre-MLR assets found matching your filters" />
            )}
          </TabsContent>
          
          <TabsContent value="design-studio" className="space-y-4">
            {filteredDesignAssets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDesignAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <EmptyState message="No Design Studio assets found matching your filters" />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <AssetPreviewModal
        asset={previewAsset}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onSelect={handleAssetSelect}
      />
    </>
  );
};

export {AssetDiscoveryDashboard};