import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles,
  Target,
  TrendingUp,
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
import { ThemeContentInitializer } from "@/services/themeContentInitializer";

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

  // Transform ThemeLibraryEntry to ThemeData format for ThemeContentInitializer
  const transformThemeToThemeData = (theme) => {
    return {
      id: theme.id,
      theme_name: theme.name,
      core_message: theme.key_message || theme.description,
      therapeutic_focus: theme.description?.split('.')[0] || selectedBrand?.therapeutic_area || 'General',
      target_audience: theme.audience_segments?.[0] || 'HCP',
      key_benefits: theme.content_suggestions?.key_points || [theme.key_message || 'Key clinical benefits'],
      clinical_positioning: theme.rationale?.primary_insight || theme.description || 'Clinical positioning',
      emotional_tone: theme.messaging_framework?.tone_guidance || 'Professional',
      content_pillars: theme.content_suggestions?.key_points || [],
      proof_points: theme.content_suggestions?.proof_points || theme.rationale?.supporting_data || [],
      differentiation_claims: theme.messaging_framework?.competitive_differentiators || [],
      cta_frameworks: theme.call_to_action ? [theme.call_to_action] : ['Learn more'],
      visual_concepts: theme.content_suggestions?.visual_elements || [],
      messaging_hierarchy: {
        primary: theme.key_message || theme.description,
        secondary: theme.content_suggestions?.key_points?.slice(0, 2) || [],
        supporting: theme.content_suggestions?.key_points?.slice(2) || []
      }
    };
  };

  // AI-powered theme usage that generates content using ThemeContentInitializer
  const handleUseThemeWithAI = async (theme) => {
    if (!selectedBrand?.id || !user?.id) {
      toast({
        title: "Error",
        description: "Please ensure you're logged in and have a brand selected",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Generating Content",
        description: "Creating AI-powered content from theme using Evidence Library...",
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

      // Populate campaign_themes table for lineage tracking (non-blocking)
      try {
        const { error: campaignThemeError } = await supabase.from('campaign_themes').insert({
          campaign_id: newProject.id,
          theme_id: theme.id,
          brand_id: selectedBrand.id,
          selection_reason: 'Selected from Strategy & Insights Hub',
          status: 'active',
          created_by: user.id
        }).select().single();
        
        if (campaignThemeError) {
          console.warn('Non-critical: Failed to create campaign_theme record:', campaignThemeError);
        }
      } catch (ctError) {
        console.warn('Non-critical: campaign_themes insert failed:', ctError);
      }

      // Transform theme to ThemeData format
      const themeData = transformThemeToThemeData(theme);
      
      // ✅ FIX: Use first asset type from theme's asset_types array, fallback to 'mass-email'
      const assetType = theme.asset_types?.[0] || 'mass-email';
      console.log('🎯 Creating asset with type:', assetType, 'from theme asset_types:', theme.asset_types);

      // Generate AI content using ThemeContentInitializer
      console.log('🚀 Generating AI content from theme:', theme.name);
      const initializedContent = await ThemeContentInitializer.initializeFromTheme(
        assetType,
        themeData,
        {
          indication: selectedBrand.therapeutic_area,
          intake_audience: theme.audience_segments?.[0] || 'Physician-Specialist',
          intake_objective: 'clinical-education',
          theme_id: theme.id,
          strategicContext: {
            campaignObjective: 'clinical-education',
            keyMessage: theme.key_message || theme.description,
            targetAudience: theme.audience_segments?.[0] || 'Physician-Specialist',
            indication: selectedBrand.therapeutic_area,
            assetType: assetType
          }
        },
        selectedBrand.id,
        {
          useThemeContent: true,
          useIntakeContext: true,
          generateMissingContent: true, // This triggers AI generation
          assetTypeOptimization: true
        }
      );

      console.log('✅ AI content generated:', {
        completeness: initializedContent.completeness,
        sources: Object.keys(initializedContent.generationSources),
        contentKeys: Object.keys(initializedContent.content)
      });

      // Create asset with AI-generated content and citation data
      const newAsset = await createAsset({
        asset_name: `${theme.name} - Email`,
        asset_type: assetType,
        status: 'draft',
        primary_content: initializedContent.content, // AI-generated content!
        metadata: {
          created_from_theme: true,
          theme_id: theme.id,
          generation_sources: initializedContent.generationSources,
          completeness: initializedContent.completeness,
          suggestions: initializedContent.suggestions,
          // ✅ Store citation data for Evidence & Modules tab
          citation_data: initializedContent.citationData || {
            claimsUsed: [],
            referencesUsed: [],
            modulesUsed: [],
            visualsUsed: []
          }
        },
        channel_specifications: {},
        performance_prediction: {},
        ai_analysis: {},
        created_by: user.id
      }, undefined, newProject.id);

      if (!newAsset) {
        throw new Error("Failed to create asset");
      }

      // ✅ CRITICAL: Save evidence data to BOTH dedicated columns AND metadata
      // This ensures evidence displays properly in Evidence & Modules panel
      if (initializedContent.citationData) {
        const claimsUsed = initializedContent.citationData.claimsUsed || [];
        const referencesUsed = initializedContent.citationData.referencesUsed || [];
        const modulesUsed = initializedContent.citationData.modulesUsed || [];
        const visualsUsed = initializedContent.citationData.visualsUsed || [];
        
        console.log('📚 Saving evidence to dedicated columns:', {
          claimsUsed: claimsUsed.length,
          referencesUsed: referencesUsed.length,
          modulesUsed: modulesUsed.length,
          visualsUsed: visualsUsed.length,
          assetId: newAsset.id
        });
        
        // IMPORTANT: Empty arrays mean no evidence was generated - log warning
        if (claimsUsed.length === 0 && referencesUsed.length === 0) {
          console.warn('⚠️ No evidence data generated! Check edge function logs for generate-initial-content');
        }
        
        const { error: evidenceError } = await supabase
          .from('content_assets')
          .update({
            claims_used: claimsUsed.map((c) => ({
              claimId: c.claimId || c.id,
              claimDisplayId: c.claimDisplayId || c.display_id,
              claimText: c.claimText || c.text,
              citationNumber: c.citationNumber,
              linkedReferences: c.linkedReferences || []
            })),
            references_used: referencesUsed.map((r) => ({
              referenceId: r.referenceId || r.id,
              referenceDisplayId: r.referenceDisplayId || r.display_id,
              formattedCitation: r.formattedCitation || r.formatted_citation || r.text,
              citationNumber: r.citationNumber
            })),
            metadata: {
              ...newAsset.metadata,
              citation_data: {
                claimsUsed,
                referencesUsed,
                modulesUsed,
                visualsUsed
              }
            }
          })
          .eq('id', newAsset.id);
        
        if (evidenceError) {
          console.error('❌ Failed to save evidence columns:', evidenceError);
        } else {
          console.log('✅ Evidence columns saved successfully');
        }
      }

      // Record theme usage
      await ThemeService.recordThemeUsage(
        theme.id,
        'campaign',
        newProject.id,
        { brand_id: selectedBrand.id }
      );

      toast({
        title: "Content Generated",
        description: `AI-generated content is ready with ${initializedContent.completeness}% completeness`
      });
      
      // Explicit navigation with logging
      const editorPath = `/content-editor/${newAsset.id}`;
      console.log('🔄 Navigating to content editor:', editorPath);
      navigate(editorPath);
      
    } catch (error) {
      console.error('Error creating AI content from theme:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content from theme",
        variant: "destructive"
      });
    }
  };

  // Legacy handler for ThemeCard (uses same AI flow)
  const handleUseTheme = async (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      await handleUseThemeWithAI(theme);
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
              onThemeSelect={handleUseThemeWithAI}
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