import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileText, 
  Package, 
  CheckCircle, 
} from 'lucide-react';
import { AssetMetadataPreservationService } from '@/services/AssetMetadataPreservationService';

export const AutomatedHandoffGenerator = ({
  assetId,
  projectId,
  targetMarkets,
  onHandoffComplete
}) => {
  const [handoffPackage, setHandoffPackage] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState(['pdf', 'json']);
  
  // Track generation state to prevent loops
  const lastGeneratedRef = useRef('');
  const generationInProgressRef = useRef(false);

  // Stabilize the generation key to prevent infinite loops
  const generationKey = useMemo(() => {
    const marketsKey = Array.isArray(targetMarkets) ? targetMarkets.sort().join(',') : '';
    return `${assetId}-${projectId}-${marketsKey}`;
  }, [assetId, projectId, targetMarkets]);

  const generateHandoffPackage = useCallback(async () => {
    // Prevent multiple simultaneous generations and re-generation of same data
    if (generationInProgressRef.current || lastGeneratedRef.current === generationKey || !assetId) {
      return;
    }

    generationInProgressRef.current = true;
    lastGeneratedRef.current = generationKey;
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Step 1: Generate comprehensive metadata package
      setGenerationProgress(20);
      const metadataPackage = await AssetMetadataPreservationService.generateComprehensiveMetadata(
        assetId,
        projectId,
        {
          includeLineage: true,
          includeAnalytics: true,
          includeIntelligence: true,
          targetMarkets
        }
      );

      // Step 2: Compile asset context
      setGenerationProgress(40);
      const assetContext = await compileAssetContext(assetId);

      // Step 3: Generate briefing documents
      setGenerationProgress(60);
      const briefingDocs = await generateBriefingDocuments(assetContext, targetMarkets);

      // Step 4: Package deliverables
      setGenerationProgress(80);
      const deliverables = await packageDeliverables(metadataPackage, briefingDocs);

      // Step 5: Generate export formats
      setGenerationProgress(95);
      const exportPackages = await generateExportFormats(deliverables, selectedFormats);

      setGenerationProgress(100);
      
      const completePackage = {
        id: `handoff-${assetId}-${Date.now()}`,
        assetId,
        projectId,
        targetMarkets,
        createdAt: new Date().toISOString(),
        metadataPackage,
        assetContext,
        briefingDocs,
        deliverables,
        exportPackages,
        statistics: {
          totalFiles: deliverables.length,
          packageSize: '2.4 MB',
          completeness: 98
        }
      };

      setHandoffPackage(completePackage);
      onHandoffComplete(completePackage);
    } catch (error) {
      console.error('Error generating handoff package:', error);
    } finally {
      setIsGenerating(false);
      generationInProgressRef.current = false;
    }
  }, [generationKey, assetId, projectId, targetMarkets, selectedFormats, onHandoffComplete]);

  useEffect(() => {
    generateHandoffPackage();
  }, [generateHandoffPackage]);

  const compileAssetContext = async (assetId) => {
    return {
      primaryContent: {
        headline: 'Breakthrough Treatment Now Available',
        body: 'Clinical studies show significant improvement in patient outcomes...',
        cta: 'Learn More About Treatment Options'
      },
      brandContext: {
        therapeuticArea: 'Oncology',
        indication: 'Advanced melanoma',
        brandPersonality: 'Hopeful, authoritative, compassionate'
      },
      strategicContext: {
        campaignObjective: 'Increase awareness of new treatment option',
        targetAudience: 'Oncologists and patients',
        keyMessages: ['Proven efficacy', 'Manageable safety profile', 'Quality of life improvement']
      },
      complianceContext: {
        regulatoryStatus: 'FDA approved',
        requiredDisclaimers: ['See prescribing information', 'Important safety information'],
        reviewHistory: 'MLR approved - 2024-01-15'
      }
    };
  };

  const generateBriefingDocuments = async (assetContext, markets) => {
    return [
      {
        type: 'creative_brief',
        title: 'Creative Brief - Market Localization',
        content: {
          overview: 'Comprehensive brief for localizing oncology treatment awareness campaign',
          objectives: assetContext.strategicContext.campaignObjective,
          audience: assetContext.strategicContext.targetAudience,
          messaging: assetContext.strategicContext.keyMessages,
          brandGuidelines: assetContext.brandContext,
          compliance: assetContext.complianceContext
        },
        marketAdaptations: markets.map(market => ({
          market,
          culturalConsiderations: `Specific cultural adaptations required for ${market}`,
          regulatoryRequirements: `${market}-specific regulatory guidelines`,
          linguisticNotes: `Translation considerations for ${market}`
        }))
      },
      {
        type: 'technical_specification',
        title: 'Technical Specification Document',
        content: {
          assetDimensions: '1920x1080px',
          colorProfile: 'sRGB',
          fileFormats: ['JPG', 'PNG', 'PDF'],
          textRequirements: 'Typography must maintain brand consistency',
          layoutConstraints: 'Responsive design required for web deployment'
        }
      }
    ];
  };

  const packageDeliverables = async (metadata, briefings) => {
    return [
      {
        category: 'source_assets',
        items: [
          { name: 'High-res imagery', type: 'image', status: 'ready', size: '45MB' },
          { name: 'Vector graphics', type: 'vector', status: 'ready', size: '12MB' }
        ]
      },
      {
        category: 'content_files',
        items: [
          { name: 'Approved copy deck', type: 'document', status: 'ready', size: '1MB' },
          { name: 'Translation memory', type: 'tmx', status: 'ready', size: '5MB' }
        ]
      }
    ];
  };

  const generateExportFormats = async (deliverables, formats) => {
    const exports = {};
    
    if (formats.includes('pdf')) {
      exports.pdf = {
        filename: `handoff-package-${Date.now()}.pdf`,
        size: '15MB',
        description: 'Complete handoff package in PDF format'
      };
    }
    
    if (formats.includes('json')) {
      exports.json = {
        filename: `asset-metadata-${Date.now()}.json`,
        size: '2MB',
        description: 'Machine-readable asset metadata'
      };
    }

    return exports;
  };

  const handleDownload = (format) => {
    console.log(`Downloading handoff package in ${format} format`);
  };

  if (isGenerating) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generating Handoff Package</h3>
            <Badge variant="outline">
              <Package className="h-3 w-3 mr-1" />
              Processing
            </Badge>
          </div>
          
          <Progress value={generationProgress} className="w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Agency Handoff Package</h3>
          <Badge variant="outline" className="bg-green-50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        </div>

        {handoffPackage?.statistics && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded">
              <div className="text-2xl font-bold">{handoffPackage.statistics.totalFiles}</div>
              <div className="text-sm text-muted-foreground">Total Files</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded">
              <div className="text-2xl font-bold">{handoffPackage.statistics.packageSize}</div>
              <div className="text-sm text-muted-foreground">Package Size</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded">
              <div className="text-2xl font-bold">{handoffPackage.statistics.completeness}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        )}

        <Tabs defaultValue="deliverables" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="briefings">Briefings</TabsTrigger>
            <TabsTrigger value="exports">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="deliverables" className="space-y-4">
            {handoffPackage?.deliverables.map((category, index) => (
              <Card key={index} className="p-4">
                <h4 className="font-medium mb-3 capitalize">{category.category.replace('_', ' ')}</h4>
                <div className="space-y-2">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{item.name}</span>
                        <Badge variant="secondary">{item.type}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.size}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="briefings" className="space-y-4">
            {handoffPackage?.briefingDocs.map((brief, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{brief.title}</h4>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">{brief.content.overview}</p>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="exports" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Export Formats</h4>
              <div className="space-y-3">
                {handoffPackage?.exportPackages && Object.entries(handoffPackage.exportPackages).map(([format, details]) => (
                  <div key={format} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">{details.filename}</div>
                        <div className="text-xs text-muted-foreground">{details.description}</div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleDownload(format)}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};