import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useBrand } from '@/contexts/BrandContext';
import { ContentService } from '@/services/contentService';
import { TemplateSeedService } from '@/services/templateSeedService';
import Header from '@/components/Header';
import { TemplateGallery } from '@/components/designStudio/TemplateGallery';
import { DesignCanvas } from '@/components/designStudio/DesignCanvas';
import { 
  ArrowLeft, 
  Palette, 
  FileImage, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Layout,
  Layers
} from 'lucide-react';

const DesignStudio = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedBrand } = useBrand();

  const [handoffs, setHandoffs] = useState([]);
  const [selectedHandoff, setSelectedHandoff] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  // Get handoff ID from URL params
  const handoffId = searchParams.get('handoff');

  useEffect(() => {
    loadHandoffs();
  }, [selectedBrand]);

  useEffect(() => {
    if (handoffId && handoffs.length > 0) {
      const handoff = handoffs.find(h => h.id === handoffId);
      if (handoff) {
        setSelectedHandoff(handoff);
      }
    }
  }, [handoffId, handoffs]);

  const loadHandoffs = async () => {
    if (!selectedBrand?.id) return;

    setLoading(true);
    try {
      // Get all projects for the brand first
      const projects = await ContentService.getProjects(selectedBrand.id);
      
      // Get handoffs for all projects
      const allHandoffs = [];
      for (const project of projects) {
        const projectHandoffs = await ContentService.getHandoffs(project.id);
        allHandoffs.push(...projectHandoffs);
      }

      setHandoffs(allHandoffs.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load design handoffs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateHandoffStatus = async (handoffId, status) => {
    setProcessing(true);
    try {
      const updatedHandoff = await ContentService.updateHandoff(handoffId, {
        handoff_status: status,
        updated_at: new Date().toISOString()
      });

      setHandoffs(prev => prev.map(h => h.id === handoffId ? updatedHandoff : h));
      if (selectedHandoff?.id === handoffId) {
        setSelectedHandoff(updatedHandoff);
      }

      toast({
        title: "Status Updated",
        description: `Design handoff status updated to ${status.replace('_', ' ')}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update handoff status",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500';
      case 'in_design': return 'bg-blue-500';
      case 'design_complete': return 'bg-green-500';
      case 'approved': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_design': return <Palette className="w-4 h-4" />;
      case 'design_complete': return <CheckCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const renderHandoffsList = () => (
    <div className="space-y-4">
      {handoffs.map((handoff) => (
        <Card 
          key={handoff.id} 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedHandoff?.id === handoff.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedHandoff(handoff)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(handoff.handoff_status)}
                <div>
                  <CardTitle className="text-base">
                    {handoff.content_context?.asset?.asset_name || 'Unnamed Asset'}
                  </CardTitle>
                  <CardDescription>
                    {handoff.content_context?.asset?.asset_type?.toUpperCase()} • 
                    {new Date(handoff.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
              <Badge className={`${getStatusColor(handoff.handoff_status)} text-white`}>
                {handoff.handoff_status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Project: {handoff.content_context?.project?.project_name || 'Unknown'}</span>
              <span>{handoff.content_context?.variations?.length || 0} variations</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const handleInitializeTemplates = async () => {
    if (!selectedBrand?.id) return;
    
    setProcessing(true);
    try {
      await TemplateSeedService.seedEmailTemplates(selectedBrand.id);
      toast({ title: "Success", description: "Templates initialized successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to initialize templates", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const renderHandoffDetails = () => {
    if (!selectedHandoff) {
      return (
        <Card className="h-full flex items-center justify-center">
          <CardContent className="text-center">
            <FileImage className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Select a Design Handoff</h3>
            <p className="text-muted-foreground mb-4">
              Choose a handoff from the list to view details and start the design process
            </p>
            <Button onClick={handleInitializeTemplates} disabled={processing}>
              Initialize Templates
            </Button>
          </CardContent>
        </Card>
      );
    }

    const asset = selectedHandoff.content_context?.asset;
    const project = selectedHandoff.content_context?.project;
    const variations = selectedHandoff.content_context?.variations || [];

    return (
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <Palette className="w-5 h-5" />
                  {asset?.asset_name || 'Design Handoff'}
                </CardTitle>
                <CardDescription>
                  {asset?.asset_type?.toUpperCase()} design for {project?.project_name}
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(selectedHandoff.handoff_status)} text-white`}>
                {selectedHandoff.handoff_status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              {selectedHandoff.handoff_status === 'pending' && (
                <Button 
                  onClick={() => updateHandoffStatus(selectedHandoff.id, 'in_design')}
                  disabled={processing}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Start Design Process
                </Button>
              )}
              {selectedHandoff.handoff_status === 'in_design' && (
                <Button 
                  onClick={() => updateHandoffStatus(selectedHandoff.id, 'design_complete')}
                  disabled={processing}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </Button>
              )}
              {selectedHandoff.handoff_status === 'design_complete' && (
                <Button 
                  onClick={() => updateHandoffStatus(selectedHandoff.id, 'approved')}
                  disabled={processing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Design
                </Button>
              )}
            </div>
            
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {selectedHandoff.handoff_status === 'pending' && '0%'}
                  {selectedHandoff.handoff_status === 'in_design' && '50%'}
                  {selectedHandoff.handoff_status === 'design_complete' && '75%'}
                  {selectedHandoff.handoff_status === 'approved' && '100%'}
                </span>
              </div>
              <Progress 
                value={
                  selectedHandoff.handoff_status === 'pending' ? 0 :
                  selectedHandoff.handoff_status === 'in_design' ? 50 :
                  selectedHandoff.handoff_status === 'design_complete' ? 75 : 100
                } 
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Details */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="canvas">Canvas</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="variations">Variations</TabsTrigger>
            <TabsTrigger value="brand">Brand Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <TemplateGallery
              brandId={asset?.brand_id || selectedBrand?.id || ''}
              asset={asset}
              onSelectTemplate={(template) => {
                setSelectedTemplate(template);
                setActiveTab('canvas');
              }}
              selectedTemplateId={selectedTemplate?.id}
            />
          </TabsContent>

          <TabsContent value="canvas" className="space-y-4">
            {selectedTemplate && selectedBrand ? (
              <DesignCanvas
                template={selectedTemplate}
                asset={asset}
                brand={selectedBrand}
                onSave={(canvasData, compliance) => {
                  toast({ title: "Design Saved", description: "Your design has been saved successfully" });
                }}
              />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Select a template to start designing</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Primary Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {asset?.primary_content && (
                  <div className="space-y-4">
                    {Object.entries(asset.primary_content).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="font-medium capitalize mb-2">{key.replace(/([A-Z])/g, ' $1')}</h4>
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-sm">{String(value)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Content Variations ({variations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {variations.length > 0 ? (
                  <div className="space-y-4">
                    {variations.map((variation, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{variation.variation_name}</h4>
                          <Badge variant="outline">{variation.variation_type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Target: {JSON.stringify(variation.target_context)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No variations available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brand" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Brand Guidelines</CardTitle>
                <CardDescription>
                  Brand-specific design requirements and guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedBrand && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Primary Color</h4>
                        <div 
                          className="w-full h-8 rounded border"
                          style={{ backgroundColor: selectedBrand.primary_color }}
                        />
                        <p className="text-xs text-muted-foreground">{selectedBrand.primary_color}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Secondary Color</h4>
                        <div 
                          className="w-full h-8 rounded border"
                          style={{ backgroundColor: selectedBrand.secondary_color }}
                        />
                        <p className="text-xs text-muted-foreground">{selectedBrand.secondary_color}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Accent Color</h4>
                        <div 
                          className="w-full h-8 rounded border"
                          style={{ backgroundColor: selectedBrand.accent_color }}
                        />
                        <p className="text-xs text-muted-foreground">{selectedBrand.accent_color}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Typography</h4>
                      <p className="text-sm text-muted-foreground">
                        Font Family: {selectedBrand.font_family || 'System Default'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Therapeutic Area</h4>
                      <Badge variant="outline">{selectedBrand.therapeutic_area}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Design Requirements</CardTitle>
                <CardDescription>
                  Specific design requirements and constraints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Asset Type</h4>
                    <Badge>{asset?.asset_type?.toUpperCase()}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Channel Specifications</h4>
                    <div className="text-sm text-muted-foreground">
                      {asset?.channel_specifications && Object.keys(asset.channel_specifications).length > 0 ? (
                        <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                          {JSON.stringify(asset.channel_specifications, null, 2)}
                        </pre>
                      ) : (
                        <p>No specific channel requirements</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Compliance Notes</h4>
                    <div className="text-sm text-muted-foreground">
                      {asset?.compliance_notes || 'No specific compliance requirements'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Design Studio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/content-studio')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Content Studio
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Palette className="w-8 h-8" />
              Design Studio
            </h1>
            <p className="text-muted-foreground">
              Pharma-compliant creative platform powered by AI and brand guidelines
            </p>
          </div>
        </div>
        
        {selectedBrand && (
          <Button onClick={handleInitializeTemplates} disabled={processing} variant="outline">
            Initialize Templates
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6 min-h-[600px]">
        {/* Handoffs List */}
        <div className="col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Design Handoffs</CardTitle>
              <CardDescription>
                Content ready for design development
              </CardDescription>
            </CardHeader>
          </Card>
          
          {handoffs.length === 0 ? (
            <Card className="h-64 flex items-center justify-center">
              <CardContent className="text-center">
                <FileImage className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No Design Handoffs</h3>
                <p className="text-sm text-muted-foreground">
                  Content assets will appear here when ready for design
                </p>
              </CardContent>
            </Card>
          ) : (
            renderHandoffsList()
          )}
        </div>

        {/* Details Panel */}
        <div className="col-span-8">
          {renderHandoffDetails()}
        </div>
      </div>
    </div>
  );
};

export default DesignStudio;