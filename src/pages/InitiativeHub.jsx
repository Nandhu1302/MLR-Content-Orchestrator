import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  FileText, 
  Calendar, 
  Play, 
  Copy, 
  Trash2, 
  Download, 
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Send
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DraftStorageManager } from "@/utils/draftStorage";
import { useContentManagement } from "@/hooks/useContentManagement";
import { useBrand } from "@/contexts/BrandContext";
import CampaignCard from "@/components/content/CampaignCard";
import { formatDistance } from "date-fns";

const InitiativeHub = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add database integration for real campaigns and assets
  const { 
    projects, 
    assets, 
    loadProjects, 
    loadAllAssets,
    deleteProject,
    deleteAsset,
    pushToDesignStudio
  } = useContentManagement({
    autoSave: false
  });

  useEffect(() => {
    loadDrafts();
    if (selectedBrand) {
      loadProjects();
      loadAllAssets();
    }
  }, [selectedBrand]);

  const loadDrafts = () => {
    setLoading(true);
    try {
      const allDrafts = DraftStorageManager.getAllDrafts();
      // Filter for early stage drafts only (intake phase)
      const initiativeDrafts = allDrafts.filter(draft => 
        draft.flowState === 'intake' || 
        draft.progress < 25
      );
      setDrafts(initiativeDrafts);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeDraft = (draftId) => {
    navigate(`/intake?resume=${draftId}`);
  };

  const handleDuplicateDraft = (draftId) => {
    try {
      const newDraftId = DraftStorageManager.duplicateDraft(draftId);
      loadDrafts(); // Refresh the list
      navigate(`/intake?resume=${newDraftId}`);
    } catch (error) {
      console.error('Failed to duplicate draft:', error);
    }
  };

  const handleDeleteDraft = (draftId) => {
    DraftStorageManager.deleteDraft(draftId);
    loadDrafts(); // Refresh the list
  };

  const getStatusIcon = (progress, flowState) => {
    if (progress >= 90) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (progress >= 70) return <Send className="h-4 w-4 text-blue-500" />;
    if (progress >= 45) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (progress, flowState) => {
    if (progress >= 90) return "Nearly Complete";
    if (progress >= 70) return "In Review";
    if (progress >= 45) return "Content Creation";
    if (flowState === 'theme-generation') return "Generating Themes";
    if (flowState === 'campaign') return "Campaign Planning";
    if (flowState === 'single-asset') return "Asset Development";
    return "Just Started";
  };

  const activeDrafts = drafts.filter(draft => draft.progress < 90);
  const completedDrafts = drafts.filter(draft => draft.progress >= 90);

  // Database campaign handling
  const handleEditAsset = (assetId) => {
    navigate(`/content-editor/${assetId}`);
  };

  const handlePublishToDesign = async (asset) => {
    try {
      await pushToDesignStudio(asset);
    } catch (error) {
      console.error('Failed to publish to design:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      loadProjects(); // Refresh projects
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    try {
      await deleteAsset(assetId);
      loadAllAssets(); // Refresh assets
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const handleViewInContentStudio = () => {
    navigate('/content-studio');
  };

  // Group assets by project for campaign view
  const groupedAssets = projects.reduce((acc, project) => {
    acc[project.id] = assets.filter(asset => asset.project_id === project.id);
    return acc;
  }, {});

  const activeCampaigns = projects.filter(p => p.status !== 'completed');
  const completedCampaigns = projects.filter(p => p.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
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
            <h2 className="text-2xl font-bold">Initiative Hub</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {activeCampaigns.length} active campaigns · {activeDrafts.length} drafts in progress
            </p>
          </div>
          <Button onClick={() => navigate('/intake-flow')}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Enhanced Summary Stats with Database Integration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{activeCampaigns.length}</span>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="mt-2 text-xs">
                {assets.filter(a => activeCampaigns.find(p => p.id === a.project_id)).length} assets
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{completedCampaigns.length + completedDrafts.length}</span>
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="mt-2 text-xs text-green-700 bg-green-100">
                Ready for review
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{activeDrafts.length}</span>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="mt-2 text-xs">
                In progress
              </Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleViewInContentStudio}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">View Content Studio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{projects.length + drafts.length}</span>
                <Send className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="mt-2 text-xs">
                Total initiatives
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs with Database Campaigns */}
        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Active Campaigns ({activeCampaigns.length})</TabsTrigger>
            <TabsTrigger value="drafts">Draft Initiatives ({activeDrafts.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCampaigns.length + completedDrafts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="mt-6">
            {activeCampaigns.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Campaigns</h3>
                <p className="text-muted-foreground mb-4">
                  Start a new campaign to begin creating multi-asset content.
                </p>
                <Button onClick={() => navigate('/intake')}>
                  Create New Campaign
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {activeCampaigns.map((project) => (
                  <CampaignCard
                    key={project.id}
                    projectId={project.id}
                    assets={groupedAssets[project.id] || []}
                    projects={projects}
                    onEditAsset={handleEditAsset}
                    onPublishToDesign={handlePublishToDesign}
                    onDeleteProject={handleDeleteProject}
                    onDeleteAsset={handleDeleteAsset}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="mt-6">
            {activeDrafts.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Drafts</h3>
                <p className="text-muted-foreground mb-4">
                  Start a new initiative to begin creating content.
                </p>
                <Button onClick={() => navigate('/intake')}>
                  Create New Initiative
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {activeDrafts.map((draft) => (
                  <DraftCard 
                    key={draft.id} 
                    draft={draft} 
                    onResume={handleResumeDraft}
                    onDuplicate={handleDuplicateDraft}
                    onDelete={handleDeleteDraft}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {(completedCampaigns.length + completedDrafts.length) === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Completed Items</h3>
                <p className="text-muted-foreground mb-4">
                  Completed initiatives and campaigns will appear here when ready for review.
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Show completed campaigns */}
                {completedCampaigns.map((project) => (
                  <CampaignCard
                    key={project.id}
                    projectId={project.id}
                    assets={groupedAssets[project.id] || []}
                    projects={projects}
                    onEditAsset={handleEditAsset}
                    onPublishToDesign={handlePublishToDesign}
                    onDeleteProject={handleDeleteProject}
                    onDeleteAsset={handleDeleteAsset}
                  />
                ))}
                
                {/* Show completed drafts */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mt-6">
                  {completedDrafts.map((draft) => (
                    <DraftCard 
                      key={draft.id} 
                      draft={draft} 
                      onResume={handleResumeDraft}
                      onDuplicate={handleDuplicateDraft}
                      onDelete={handleDeleteDraft}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        </main>
      </ScrollArea>
    </div>
  );
};

const DraftCard = ({ draft, onResume, onDuplicate, onDelete }) => {
  const getStatusIcon = (progress, flowState) => {
    if (progress >= 90) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (progress >= 70) return <Send className="h-4 w-4 text-blue-500" />;
    if (progress >= 45) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (progress, flowState) => {
    if (progress >= 90) return "Nearly Complete";
    if (progress >= 70) return "In Review";
    if (progress >= 45) return "Content Creation";
    if (flowState === 'theme-generation') return "Generating Themes";
    if (flowState === 'campaign') return "Campaign Planning";
    if (flowState === 'single-asset') return "Asset Development";
    return "Just Started";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{draft.projectName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(draft.progress, draft.flowState)}
                <span className="text-sm text-muted-foreground">{getStatusText(draft.progress, draft.flowState)}</span>
              </div>
              {draft.flowState && draft.flowState !== 'intake' && (
                <Badge variant="outline" className="text-xs mt-1">
                  {draft.flowState === 'theme-generation' && 'Theme Selection'}
                  {draft.flowState === 'single-asset' && 'Single Asset'}
                  {draft.flowState === 'campaign' && 'Campaign'}
                </Badge>
              )}
            </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{draft.progress}%</span>
          </div>
          <Progress value={draft.progress} className="h-2" />
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm">
          {draft.templateName && (
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Template:</span>
              <span className="font-medium">{draft.templateName}</span>
            </div>
          )}
          {draft.assetType && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{draft.assetType}</Badge>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDistance(draft.lastModified, new Date(), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" onClick={() => onResume(draft.id)}>
            <Play className="h-3 w-3 mr-1" />
            Resume
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDuplicate(draft.id)}>
            <Copy className="h-3 w-3" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{draft.projectName}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(draft.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default InitiativeHub;