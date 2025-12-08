import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Image, 
  Table as TableIcon, 
  BarChart3, 
  LineChart, 
  PieChart,
  Eye,
  CheckCircle2,
  FileText,
  Wand2
} from "lucide-react";
import { VisualAssetDetailsModal } from "./VisualAssetDetailsModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const getVisualIcon = (type) => {
  switch (type) {
    case 'table':
      return <TableIcon className="h-4 w-4" />;
    case 'chart':
    case 'graph':
      return <BarChart3 className="h-4 w-4" />;
    case 'image':
      return <Image className="h-4 w-4" />;
    case 'infographic':
      return <PieChart className="h-4 w-4" />;
    case 'diagram':
      return <LineChart className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getVisualTypeColor = (type) => {
  switch (type) {
    case 'table':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'chart':
    case 'graph':
      return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'image':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
    case 'infographic':
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    case 'diagram':
      return 'bg-pink-500/10 text-pink-700 dark:text-pink-300';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

export const VisualAssetsTab = ({ visualAssets }) => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const filteredAssets = filterType === 'all' 
    ? visualAssets 
    : visualAssets.filter(asset => asset.visual_type === filterType);

  const visualTypes = ['all', 'table', 'chart', 'graph', 'image', 'infographic', 'diagram'];
  const assetsWithoutImages = visualAssets.filter(a => !a.storage_path).length;

  const handleGenerateImages = async () => {
    const assetsNeedingImages = visualAssets.filter(a => !a.storage_path);
    if (assetsNeedingImages.length === 0) {
      toast({ title: "All assets already have images" });
      return;
    }

    const documentId = assetsNeedingImages[0]?.source_document_id;
    if (!documentId) {
      toast({ title: "No document ID found", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-visual-images-once', {
        body: { documentId }
      });

      if (error) throw error;

      toast({ 
        title: "Image generation started", 
        description: `Generating ${data?.stats?.totalAssets || assetsNeedingImages.length} images. This may take a few minutes.`
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({ 
        title: "Generation failed", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col gap-3">
        {assetsWithoutImages > 0 && (
          <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
            <div>
              <p className="text-sm font-medium">{assetsWithoutImages} assets need images</p>
              <p className="text-xs text-muted-foreground">Generate professional visualizations using AI</p>
            </div>
            <Button onClick={handleGenerateImages} disabled={isGenerating}>
              <Wand2 className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Images"}
            </Button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {visualTypes.map(type => (
          <Button
            key={type}
            variant={filterType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType(type)}
            className="capitalize"
          >
            {type === 'all' ? 'All Types' : type}
          </Button>
        ))}
      </div>

      {/* Visual Assets Grid */}
      {filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No visual assets found.</p>
            <p className="text-sm mt-2">Visual assets will be extracted from your brand documents.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <Card 
              key={asset.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow group"
              onClick={() => setSelectedAsset(asset)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getVisualIcon(asset.visual_type)}
                    <CardTitle className="text-sm truncate">
                      {asset.title || `${asset.visual_type} from ${asset.source_section || 'Document'}`}
                    </CardTitle>
                  </div>
                  {asset.mlr_approved && (
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Preview or Description */}
                {asset.caption && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {asset.caption}
                  </p>
                )}

                {/* Type Badge */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className={getVisualTypeColor(asset.visual_type)}>
                    {asset.visual_type}
                  </Badge>
                  {asset.source_section && (
                    <Badge variant="outline" className="text-xs">
                      {asset.source_section}
                    </Badge>
                  )}
                  {asset.source_page && (
                    <Badge variant="outline" className="text-xs">
                      Page {asset.source_page}
                    </Badge>
                  )}
                </div>

                {/* Usage Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Used {asset.usage_count || 0}x</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedAsset && (
        <VisualAssetDetailsModal
          visualAsset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </div>
  );
};