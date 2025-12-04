import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles,
  Target,
  TrendingUp,
  BookOpen,
  Plus,
  Library
} from "lucide-react";
import { ThemeCard } from "@/components/strategy/ThemeCard";
import { ThemePipelineView } from "@/components/strategy/ThemePipelineView";
import ThemeLibrary from "@/components/strategy/ThemeLibrary";
import ThemeEnrichmentQueue from "@/components/strategy/ThemeEnrichmentQueue";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ThemeService } from "@/services/themeService";
import { useBrand } from "@/contexts/BrandContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useContentManagement } from "@/hooks/useContentManagement";
import Header from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";

const StrategyAndInsights = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedBrand } = useBrand();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState('dashboard');
  
  const { createProject, createAsset } = useContentManagement({ autoSave: false });

  // Handle navigation from workshop
  useEffect(() => {
    if (location.state?.themeApproved) {
      setCurrentView('dashboard');
      toast({
        title: "Theme Saved!",
        description: "Your enriched theme is now ready to use. Click 'Use Theme' to start creating content.",
      });
    }
  }, [location.state, toast]);

  // Fetch themes
  const { data: themes = [], isLoading: themesLoading } = useQuery({
    queryKey: ['themes', selectedBrand?.id],
    queryFn: async () => {
      if (!selectedBrand?.id) return [];
      const result = await ThemeService.getThemeLibrary(selectedBrand.id);
      return result.themes;
    },
    enabled: !!selectedBrand?.id
  });

  // Fetch theme usage data (assets created from each theme)
  const { data: themeUsage = {} } = useQuery({
    queryKey: ['theme-usage', selectedBrand?.id],
    queryFn: async () => {
      if (!selectedBrand?.id) return {};
      const { data } = await supabase
        .from('asset_themes')
        .select('theme_id, asset_id')
        .eq('brand_id', selectedBrand.id);
      
      const usageMap = {};
      data?.forEach(item => {
        usageMap[item.theme_id] = (usageMap[item.theme_id] || 0) + 1;
      });
      return usageMap;
    },
    enabled: !!selectedBrand?.id
  });

  const handleEnrichTheme = (themeId) => {
    navigate(`/theme-intelligence/${themeId}`);
  };

  const handleUseTheme = async (themeId) => {
    if (!selectedBrand?.id || !user?.id) {
      toast({
        title: "Error",
        description: "Please ensure you're logged in and have a brand selected",
        variant: "destructive"
      });
      return;
    }

    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    try {
      toast({
        title: "Creating Content",
        description: "Setting up your content with the selected theme...",
      });

      // Create project
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
          inherited_from_strategy: true,
          theme_category: theme.category
        },
        created_by: user.id
      });

      if (!newProject) {
        throw new Error("Failed to create project");
      }

      // Populate campaign_themes table for lineage tracking
      await supabase.from('campaign_themes').insert({
        campaign_id: newProject.id,
        theme_id: theme.id,
        brand_id: selectedBrand.id,
        selection_reason: 'Selected from Strategy & Insights Hub',
        status: 'active',
        created_by: user.id
      });

      // Create first asset and navigate to editor
      const newAsset = await createAsset({
        asset_name: `${theme.name} - Draft 1`,
        asset_type: 'email',
        status: 'draft',
        primary_content: {},
        metadata: {
          created_from_theme: true,
          theme_id: theme.id
        },
        channel_specifications: {},
        performance_prediction: {},
        ai_analysis: {},
        created_by: user.id
      }, undefined, newProject.id);

      if (!newAsset) {
        throw new Error("Failed to create asset");
      }

      // Record theme usage (will auto-promote to ready-for-use on first use)
      await ThemeService.recordThemeUsage(
        theme.id,
        'campaign',
        newProject.id,
        { brand_id: selectedBrand.id }
      );

      toast({
        title: "Content Ready",
        description: "Opening editor with your theme..."
      });
      
      navigate(`/content-editor/${newAsset.id}`);
    } catch (error) {
      console.error('Error creating content from theme:', error);
      toast({
        title: "Error",
        description: "Failed to create content from theme",
        variant: "destructive"
      });
    }
  };

  const handleViewThemeDetails = (themeId) => {
    navigate(`/theme-versions/${themeId}`);
  };

  const generatedThemes = themes.filter(t => 
    !t.enrichment_status || t.enrichment_status === 'generated'
  );
  const readyThemes = themes.filter(t => t.enrichment_status === 'ready-for-use');
  const usedThemes = themes.filter(t => (themeUsage[t.id] || 0) > 0);

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2560px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Strategy & Insights</h1>
              <p className="text-muted-foreground">
                Theme Intelligence Hub - Manage your theme lifecycle from generation to content creation
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setCurrentView('dashboard')}
              >
                <Target className="h-4 w-4 mr-2" />
                Pipeline
              </Button>
              <Button
                variant={currentView === 'library' ? 'default' : 'outline'}
                onClick={() => setCurrentView('library')}
              >
                <Library className="h-4 w-4 mr-2" />
                Full Library
              </Button>
              <Button
                variant={currentView === 'enrichment' ? 'default' : 'outline'}
                onClick={() => setCurrentView('enrichment')}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Enrichment Queue
              </Button>
              <Button onClick={() => navigate('/intake-flow')}>
                <Plus className="h-4 w-4 mr-2" />
                New Theme
              </Button>
            </div>
          </div>

          {/* Main Content */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
          {/* Theme Pipeline */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Theme Pipeline</h2>
                <ThemePipelineView themes={themes} themeUsage={themeUsage} />
              </div>

              {/* Theme Cards by Status */}
              <Tabs defaultValue="needs-enrichment" className="w-full">
                <TabsList>
                  <TabsTrigger value="needs-enrichment">
                    Needs Enrichment ({generatedThemes.length})
                  </TabsTrigger>
                  <TabsTrigger value="ready">
                    Ready to Use ({readyThemes.length})
                  </TabsTrigger>
                  <TabsTrigger value="in-use">
                    In Use ({usedThemes.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="needs-enrichment" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedThemes.length === 0 ? (
                      <Card className="col-span-2">
                        <CardContent className="flex flex-col items-center justify-center py-8">
                          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">All Themes Enriched!</h3>
                          <p className="text-muted-foreground text-center mb-4">
                            You don't have any themes waiting for enrichment
                          </p>
                          <Button onClick={() => navigate('/intake-flow')}>
                            Generate New Theme
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      generatedThemes.map((theme) => (
                        <ThemeCard
                          key={theme.id}
                          theme={theme}
                          usageCount={themeUsage[theme.id] || 0}
                          onEnrich={handleEnrichTheme}
                          onUseTheme={handleUseTheme}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="ready" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {readyThemes.length === 0 ? (
                      <Card className="col-span-2">
                        <CardContent className="flex flex-col items-center justify-center py-8">
                          <Target className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Ready Themes</h3>
                          <p className="text-muted-foreground text-center mb-4">
                            Enrich your generated themes to make them ready for content creation
                          </p>
                          <Button onClick={() => setCurrentView('enrichment')}>
                            View Enrichment Queue
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      readyThemes.map((theme) => (
                        <ThemeCard
                          key={theme.id}
                          theme={theme}
                          usageCount={themeUsage[theme.id] || 0}
                          onUseTheme={handleUseTheme}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="in-use" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {usedThemes.length === 0 ? (
                      <Card className="col-span-2">
                        <CardContent className="flex flex-col items-center justify-center py-8">
                          <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Themes in Use Yet</h3>
                          <p className="text-muted-foreground text-center mb-4">
                            Start using your enriched themes to create content
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      usedThemes.map((theme) => (
                        <ThemeCard
                          key={theme.id}
                          theme={theme}
                          usageCount={themeUsage[theme.id] || 0}
                          onUseTheme={handleUseTheme}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentView === 'library' && (
            <ThemeLibrary
              onThemeDetails={(theme) => navigate(`/theme-versions/${theme.id}`)}
            />
          )}

          {currentView === 'enrichment' && (
            <ThemeEnrichmentQueue 
              themes={generatedThemes}
              onStartEnrichment={(theme) => handleEnrichTheme(theme.id)}
            />
          )}
        </main>
      </ScrollArea>
    </div>
  );
};

export default StrategyAndInsights;