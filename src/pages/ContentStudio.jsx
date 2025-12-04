import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { 
  FileText, 
  Calendar, 
  Play, 
  Copy, 
  Trash2, 
  Edit3,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  Send,
  Plus,
  Shield,
  Brain,
  Target
} from "lucide-react";
import { moduleBridge } from "@/services/moduleBridge";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EnhancedGuardrailsPanel } from "@/components/guardrails/EnhancedGuardrailsPanel";
import { useBrand } from "@/contexts/BrandContext";
import { useAuth } from "@/contexts/AuthContext";
import { useContentManagement } from "@/hooks/useContentManagement";
import { ContentProgressCalculator } from "@/components/content/ContentProgressCalculator";
import ContentEditor from "@/components/content/ContentEditor";
import { CampaignCard } from "@/components/content/CampaignCard";
import { formatDistance } from "date-fns";

const ContentStudio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedBrand } = useBrand();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showGuardrails, setShowGuardrails] = useState(false);
  const [strategicContext, setStrategicContext] = useState(null);
  
  // Use database-based content management instead of localStorage
  const { 
    projects, 
    assets,
    currentAsset, 
    loading: contentLoading,
    error,
    deleting,
    loadProjects,
    loadAllAssets,
    createProject,
    createAsset,
    pushToDesignStudio,
    deleteProject,
    deleteAsset
  } = useContentManagement({ autoSave: false });

  useEffect(() => {
    if (selectedBrand?.id) {
      loadProjects();
    }
  }, [selectedBrand, loadProjects]);

  // Phase 1: Handle theme selection from Strategy Hub (legacy support)
  useEffect(() => {
    const locationState = location.state || {};
    
    if (locationState.selectedTheme && selectedBrand?.id && user?.id) {
      handleCreateProjectFromTheme(
        locationState.selectedTheme, 
        locationState.rationale, 
        locationState.confidence
      );
      // Clear location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location, selectedBrand, user]);

  // Phase 2: Listen for ModuleBridge events
  useEffect(() => {
    const cleanup = moduleBridge.on('module_transition', (event) => {
      if (event.data.targetModule === 'content' && event.data.context?.inheritedData) {
        const context = event.data.context.inheritedData;
        
        setStrategicContext({
          theme: context.selectedTheme,
          framework: context.strategicFramework,
          targets: context.performanceTargets,
          rationale: context.selectionRationale,
          confidence: context.confidence
        });
        
        console.log('Strategic context received from Strategy Hub:', context);
      }
    });
    
    return cleanup;
  }, []);

  const handleCreateProjectFromTheme = async (
    theme, 
    rationale, 
    confidence
  ) => {
    try {
      const newProject = await createProject({
        project_name: `${theme.name} Campaign`,
        theme_id: theme.id,
        project_type: 'campaign',
        description: theme.description,
        status: 'draft',
        target_audience: theme.audience_segments || [],
        market: theme.target_markets || [],
        channels: [],
        compliance_level: 'standard',
        project_metadata: {
          theme_selection_rationale: rationale,
          theme_confidence: confidence,
          inherited_from_strategy: true,
          theme_category: theme.category
        },
        created_by: user?.id
      });

      if (!newProject) return;

      // Populate campaign_themes table for lineage tracking
      await supabase.from('campaign_themes').insert({
        campaign_id: newProject.id,
        theme_id: theme.id,
        brand_id: selectedBrand?.id,
        selection_reason: rationale || `Selected from Strategy & Insights Hub`,
        status: 'active',
        created_by: user?.id
      });

      toast({
        title: "Project Created from Theme",
        description: `Campaign "${newProject.project_name}" created with theme "${theme.name}"`
      });

      loadProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project from theme",
        variant: "destructive"
      });
      console.error(error);
    }
  };

  // Use assets from the hook directly
  const allAssets = assets || [];

  const handleEditAsset = (assetId) => {
    navigate(`/content-editor/${assetId}`);
  };


  const handleCreateNewContent = () => {
    navigate('/intake');
  };

  const handlePublishToDesign = async (asset) => {
    try {
      await pushToDesignStudio({
        asset_requirements: "Standard design requirements",
        timeline: "Standard timeline"
      });
      
      toast({
        title: "Published to Design Studio",
        description: `${asset.asset_name} has been sent to the design team.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish to Design Studio",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = async (projectId) => {
    const success = await deleteProject(projectId);
    if (success) {
      toast({
        title: "Campaign Deleted",
        description: "The campaign and all its assets have been deleted."
      });
    }
  };

  const handleDeleteAsset = async (assetId) => {
    const success = await deleteAsset(assetId);
    if (success) {
      toast({
        title: "Asset Deleted", 
        description: "The asset has been deleted."
      });
    }
  };

  // Updated progress calculation using real content data
  const getContentStatusIcon = (asset) => {
    const progress = ContentProgressCalculator.calculateProgress(asset);
    if (progress.overall >= 90) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (progress.overall >= 70) return <Send className="h-4 w-4 text-blue-500" />;
    if (progress.overall >= 25) return <Edit3 className="h-4 w-4 text-yellow-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  const getContentStatusText = (asset) => {
    const progress = ContentProgressCalculator.calculateProgress(asset);
    const status = ContentProgressCalculator.getProgressStatus(progress.overall);
    return status.status;
  };

  // Categorize assets by their status for simplified 2-tab interface
  const inProgressAssets = allAssets.filter(asset => {
    return ['draft', 'in_review'].includes(asset.status);
  });
  
  const designReadyAssets = allAssets.filter(asset => {
    return ['approved', 'design_ready', 'completed'].includes(asset.status);
  });

  // Group assets by campaign/project
  const groupAssetsByProject = (assetsList) => {
    const grouped = assetsList.reduce((acc, asset) => {
      const projectId = asset.project_id || 'unknown';
      if (!acc[projectId]) {
        acc[projectId] = [];
      }
      acc[projectId].push(asset);
      return acc;
    }, {});
    return grouped;
  };

  const inProgressByProject = groupAssetsByProject(inProgressAssets);
  const designReadyByProject = groupAssetsByProject(designReadyAssets);


  if (contentLoading) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <Header />
        <ScrollArea className="flex-1">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2560px]">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="ml-4 text-muted-foreground">Loading your content...</p>
            </div>
          </main>
        </ScrollArea>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <Header />
        <ScrollArea className="flex-1">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2560px]">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error Loading Content</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </main>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      
      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2560px]">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Content Studio</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {allAssets.length} assets across {projects.length} campaigns
            </p>
          </div>
          <Button onClick={handleCreateNewContent}>
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </div>

        {/* Strategic Context Panel from Strategy Hub */}
        {strategicContext && (
          <Card className="mb-6 border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Strategic Context: {strategicContext.theme?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1 flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    Key Message
                  </div>
                  <p className="text-muted-foreground">{strategicContext.framework?.keyMessage}</p>
                </div>
                <div>
                  <div className="font-medium mb-1">Target Audience</div>
                  <p className="text-muted-foreground">
                    {strategicContext.framework?.audienceSegments?.join(', ') || 'Not specified'}
                  </p>
                </div>
                {strategicContext.rationale && (
                  <div className="md:col-span-2">
                    <div className="font-medium mb-1">Selection Rationale</div>
                    <p className="text-muted-foreground">{strategicContext.rationale}</p>
                  </div>
                )}
                {strategicContext.confidence && (
                  <div>
                    <div className="font-medium mb-1">Confidence Score</div>
                    <Badge variant="secondary">{strategicContext.confidence}%</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{inProgressAssets.length}</span>
                <Edit3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="mt-2 text-xs">
                Content being created
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Design Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{designReadyAssets.length}</span>
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="mt-2 text-xs text-green-700 bg-green-100">
                Ready for creative studio
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{allAssets.length}</span>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="mt-2 text-xs">
                All content pieces
              </Badge>
            </CardContent>
          </Card>
        </section>


        {/* Tabs for different views */}
        <Tabs defaultValue="inprogress" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inprogress">In Progress ({inProgressAssets.length})</TabsTrigger>
            <TabsTrigger value="designready">Design Ready ({designReadyAssets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="inprogress" className="mt-6">
            {Object.keys(inProgressByProject).length === 0 ? (
              <Card className="p-12 text-center">
                <Edit3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Content in Progress</h3>
                <p className="text-muted-foreground mb-4">
                  {allAssets.length === 0 
                    ? `No content found for ${selectedBrand?.brand_name}. Try switching brands using the header or create new content.`
                    : "Start creating content by selecting a theme first."
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleCreateNewContent}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Content
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(inProgressByProject).map(([projectId, projectAssets]) => (
                  <CampaignCard
                    key={projectId}
                    projectId={projectId}
                    assets={projectAssets}
                    projects={projects}
                    onEditAsset={handleEditAsset}
                    onPublishToDesign={handlePublishToDesign}
                    onDeleteProject={handleDeleteProject}
                    onDeleteAsset={handleDeleteAsset}
                    deleting={deleting}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="designready" className="mt-6">
            {Object.keys(designReadyByProject).length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Content Ready for Design</h3>
                <p className="text-muted-foreground mb-4">
                  {allAssets.length === 0 
                    ? `No content found for ${selectedBrand?.brand_name}. Try switching brands using the header.`
                    : "Content ready for design handoff will appear here."
                  }
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(designReadyByProject).map(([projectId, projectAssets]) => (
                  <CampaignCard
                    key={projectId}
                    projectId={projectId}
                    assets={projectAssets}
                    projects={projects}
                    onEditAsset={handleEditAsset}
                    onPublishToDesign={handlePublishToDesign}
                    onDeleteProject={handleDeleteProject}
                    onDeleteAsset={handleDeleteAsset}
                    deleting={deleting}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        </main>
      </ScrollArea>
    </div>
  );
};

const ContentAssetCard = ({ asset, onEdit, onPublish }) => {
  const navigate = useNavigate();
  const [showGuardrails, setShowGuardrails] = useState(false);
  
  // Calculate real progress using database content
  const progress = ContentProgressCalculator.calculateProgress(asset);
  const status = ContentProgressCalculator.getProgressStatus(progress.overall);
  const nextSteps = ContentProgressCalculator.getNextSteps(progress);
  
  const getContentStatusIcon = () => {
    if (progress.overall >= 90) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (progress.overall >= 70) return <Send className="h-4 w-4 text-blue-500" />;
    if (progress.overall >= 25) return <Edit3 className="h-4 w-4 text-yellow-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  const getActionText = () => {
    if (progress.overall >= 90) return "Publish to Design";
    if (progress.overall >= 70) return "Review Content";
    return "Edit Content";
  };

  const handlePrimaryAction = () => {
    if (progress.overall >= 90) {
      onPublish(asset);
    } else {
      onEdit(asset.id);
    }
  };

  const handleEditContent = () => {
    onEdit(asset.id);
  };

  // Get guardrails context from asset data
  const getGuardrailsContext = () => {
    return {
      assetId: asset.id,
      assetType: asset.asset_type,
      content: asset.primary_content
    };
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{asset.asset_name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {getContentStatusIcon()}
              <span className="text-sm text-muted-foreground">{status.status}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Content Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Content Progress</span>
            <span className="font-medium">{progress.overall}%</span>
          </div>
          <Progress value={progress.overall} className="h-2" />
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{asset.asset_type}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDistance(new Date(asset.updated_at), new Date(), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Next steps:</div>
            <ul className="list-disc list-inside space-y-1">
              {nextSteps.slice(0, 2).map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" onClick={handlePrimaryAction}>
            <Play className="h-3 w-3 mr-1" />
            {getActionText()}
          </Button>
          <Dialog open={showGuardrails} onOpenChange={setShowGuardrails}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" title="View Guardrails">
                <Shield className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Content Guardrails</DialogTitle>
                <DialogDescription>
                  Review brand and regulatory compliance guidelines for this content
                </DialogDescription>
              </DialogHeader>
              <EnhancedGuardrailsPanel
                content={JSON.stringify(getGuardrailsContext().content)}
                context={{
                  content_type: getGuardrailsContext().assetType,
                  market: 'US'
                }}
              />
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="outline" onClick={handleEditContent} title="Edit Content">
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentStudio;