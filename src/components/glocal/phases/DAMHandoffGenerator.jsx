import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Package, Download, FileText, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DAMHandoffGenerator = ({ 
  onPhaseComplete, 
  onNext,
  projectData,
  phaseData 
}) => {
  const { toast } = useToast();
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [generating, setGenerating] = useState(false);

  const assetPackages = [
    { id: 'translated-content', name: 'Translated Content', type: 'text', size: '124 KB', icon: FileText },
    { id: 'metadata', name: 'Asset Metadata', type: 'json', size: '18 KB', icon: FileText },
    { id: 'quality-report', name: 'Quality Report', type: 'pdf', size: '2.4 MB', icon: FileText },
    { id: 'compliance-docs', name: 'Compliance Documentation', type: 'pdf', size: '1.8 MB', icon: FileText },
    { id: 'source-files', name: 'Source Files', type: 'html', size: '86 KB', icon: FileText },
  ];

  const toggleAsset = (assetId) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleGenerate = async () => {
    if (selectedAssets.length === 0) {
      toast({
        title: 'No Assets Selected',
        description: 'Please select at least one asset package',
        variant: 'destructive'
      });
      return;
    }

    setGenerating(true);
    
    // Simulate package generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGenerating(false);
    
    toast({
      title: 'Package Generated',
      description: `${selectedAssets.length} asset packages ready for DAM integration`
    });
  };

  const handleComplete = () => {
    const phaseData = {
      selectedAssets,
      generatedAt: new Date().toISOString(),
      packageMetadata: {
        totalAssets: selectedAssets.length,
        projectName: projectData?.project_name || 'Untitled Project'
      }
    };

    onPhaseComplete(phaseData);
    toast({
      title: 'Phase 6 Complete',
      description: 'DAM handoff package prepared'
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            DAM Integration Package
          </CardTitle>
          <CardDescription>
            Prepare finalized assets and metadata for Digital Asset Management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {assetPackages.map((asset) => {
              const Icon = asset.icon;
              const isSelected = selectedAssets.includes(asset.id);
              
              return (
                <Card 
                  key={asset.id}
                  className={`cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => toggleAsset(asset.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => toggleAsset(asset.id)}
                    />
                    <Icon className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.type.toUpperCase()} • {asset.size}
                      </p>
                    </div>
                    <Badge variant={isSelected ? 'default' : 'secondary'}>
                      {isSelected ? 'Selected' : 'Select'}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerate}
              disabled={selectedAssets.length === 0 || generating}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {generating ? 'Generating...' : 'Generate Package'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Package Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Project</p>
              <p className="font-medium">{projectData?.project_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Target Markets</p>
              <p className="font-medium">{projectData?.target_markets?.join(', ') || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Languages</p>
              <p className="font-medium">{projectData?.target_languages?.join(', ') || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Quality Score</p>
              <p className="font-medium">{phaseData?.phase5?.qualityMetrics?.qualityScore || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleComplete} 
        size="lg" 
        className="w-full"
        disabled={selectedAssets.length === 0}
      >
        Complete Phase 6 <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};