import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { GlobalAssetContextCapture } from '@/components/localization/phases/GlobalAssetContextCapture';
import { SimplifiedTranslationHub } from '@/components/localization/phases/SimplifiedTranslationHub';
import { CulturalIntelligenceHub } from '@/components/localization/phases/CulturalIntelligenceHub';
import { RegulatoryComplianceHub } from '@/components/localization/phases/RegulatoryComplianceHub';
import { QualityIntelligenceHub } from '@/components/localization/phases/QualityIntelligenceHub';
import { DAMHandoffGenerator } from '@/components/localization/phases/DAMHandoffGenerator';
import { IntegrationLineageHub } from '@/components/localization/phases/IntegrationLineageHub';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Database, Globe, Brain, Shield, BarChart, Package, Link, CheckCircle, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LocalizationHub = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedBrand } = useBrand();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'phase1');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [workflowState, setWorkflowState] = useState({});
  const [phaseCompletions, setPhaseCompletions] = useState({
    phase1: false,
    phase2: false,
    phase3: false,
    phase4: false,
    phase5: false,
    phase6: false,
    phase7: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const { toast } = useToast();

  // Create project immediately for new workflow route
  useEffect(() => {
    const createNewProject = async () => {
      // Check if we're on the "new" route
      if (projectId !== 'new') return;
      
      if (isCreatingProject) return; // Prevent duplicate creation
      
      setIsCreatingProject(true);
      setIsLoading(true);
      
      try {
        console.log('🆕 Creating new localization project...');
        
        // Create empty project immediately
        const { data: newProject, error } = await supabase
          .from('localization_projects')
          .insert({
            brand_id: selectedBrand?.id,
            project_name: 'New Localization Project',
            description: 'Localization project in progress',
            project_type: 'localization',
            source_content_type: 'content_asset',
            target_markets: ['global'], // Default market
            target_languages: [], // Will be populated in Phase 2
            status: 'draft',
            workflow_state: {},
            created_by: user?.id
          })
          .select()
          .single();
        
        if (error) throw error;
        
        console.log('✅ Project created:', newProject.id);
        
        // Redirect to the new project URL
        // Workflow record will be created automatically when user starts Phase 2
        navigate(`/localization/workflow/${newProject.id}`, { replace: true });
        
        toast({
          title: "Project Initialized",
          description: "Starting your localization workflow...",
        });
      } catch (error) {
        console.error('❌ Error creating project:', error);
        toast({
          title: "Error",
          description: "Failed to initialize project. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
        setIsCreatingProject(false);
      }
    };
    
    createNewProject();
  }, [projectId, selectedBrand, user, navigate, toast, isCreatingProject]);

  // Load project data when resuming
  useEffect(() => {
    const loadProject = async () => {
      // Skip if no projectId or if it's the 'new' route (handled by creation effect)
      if (!projectId || projectId === 'new') {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const { data: project, error } = await supabase
          .from('localization_projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) throw error;

        if (project) {
          // Restore workflow state from database
          const savedState = project.workflow_state || {};
          
          // Set phase completions based on saved progress
          const completions = {
            phase1: savedState.phase1Complete || false,
            phase2: savedState.phase2Complete || false,
            phase3: savedState.phase3Complete || false,
            phase4: savedState.phase4Complete || false,
            phase5: savedState.phase5Complete || false,
            phase6: savedState.phase6Complete || false,
            phase7: savedState.phase7Complete || false,
          };
          
          setPhaseCompletions(completions);
          
          // Restore workflow state
          setWorkflowState(savedState);
          
          // Try to load the actual source content asset with rich structure
          let assetToUse = null;
          
          if (project.source_content_id) {
            const { data: sourceAsset, error: assetError } = await supabase
              .from('content_assets')
              .select('*')
              .eq('id', project.source_content_id)
              .maybeSingle();

            if (!assetError && sourceAsset) {
              // Use the actual content asset with its rich HCP Clinical Insights Email structure
              assetToUse = {
                ...sourceAsset,
                target_markets: project.target_markets || [],
                target_languages: project.target_languages || [],
                projectData: project
              };
              console.log('✅ Loaded master content asset:', sourceAsset.asset_name);
              console.log('📧 Rich content structure:', Object.keys(sourceAsset.primary_content || {}));
            }
          }

          // Fallback: Create synthetic asset from project data if no source asset found
          if (!assetToUse) {
            console.log('⚠️ Source asset not found, creating synthetic asset from project data');
            const projectMeta = project.metadata || {};
            assetToUse = {
              id: project.source_content_id || project.id,
              asset_name: project.project_name,
              asset_type: projectMeta.asset_type || 'email',
              brand_id: project.brand_id,
              status: project.status || 'draft',
              primary_content: projectMeta.primary_content || {},
              source_language: projectMeta.source_language || 'en-US',
              target_languages: project.target_languages || [],
              target_markets: project.target_markets || [],
              project_metadata: project.metadata,
              metadata: project.metadata,
              created_at: project.created_at,
              updated_at: project.updated_at,
              type: 'localization_project',
              projectData: project
            };
          }
          
          setSelectedAsset(assetToUse);
          
          // Determine which phase to show
          const lastCompletedPhase = Object.entries(completions)
            .reverse()
            .find(([_, completed]) => completed)?.[0];
          
          if (lastCompletedPhase) {
            const phaseNum = parseInt(lastCompletedPhase.replace('phase', ''));
            const nextPhase = `phase${Math.min(phaseNum + 1, 7)}`;
            setActiveTab(nextPhase);
            
            toast({
              title: "Project Loaded",
              description: `Resuming "${project.project_name}" from Phase ${phaseNum + 1}`,
            });
          } else {
            toast({
              title: "Project Loaded",
              description: `Starting "${project.project_name}" from the beginning`,
            });
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2560px]">
        <div className="space-y-8">
          {/* Streamlined Hero */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Localization Intelligence Hub
            </h1>
            <p className="text-muted-foreground">
              7-Phase AI-Powered Workflow • Phase {Object.values(phaseCompletions).filter(Boolean).length + 1} of 7
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} defaultValue="phase1">
            {/* Compact Horizontal Phase Navigation */}
            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {[
                    { key: 'phase1', label: 'Global Context', icon: Database },
                    { key: 'phase2', label: 'Smart TM', icon: Globe },
                    { key: 'phase3', label: 'Cultural Intel', icon: Brain },
                    { key: 'phase4', label: 'Regulatory', icon: Shield },
                    { key: 'phase5', label: 'Quality Intel', icon: BarChart },
                    { key: 'phase6', label: 'DAM Handoff', icon: Package },
                    { key: 'phase7', label: 'Integration', icon: Link }
                  ].map((phase, index) => {
                    const Icon = phase.icon;
                    const isCompleted = phaseCompletions[phase.key];
                    const isCurrent = activeTab === phase.key;
                    const isAccessible = index === 0 || phaseCompletions[`phase${index}`];
                    
                    return (
                      <div key={phase.key} className="relative flex items-center">
                        <button
                          onClick={() => isAccessible && setActiveTab(phase.key)}
                          disabled={!isAccessible}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                            isCurrent 
                              ? 'bg-primary text-primary-foreground shadow-sm' 
                              : isCompleted
                              ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20'
                              : isAccessible
                              ? 'bg-muted/50 hover:bg-muted text-foreground hover:text-primary'
                              : 'bg-muted/20 text-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="whitespace-nowrap">
                            {index + 1}. {phase.label}
                          </span>
                          {isCompleted && (
                            <CheckCircle className="h-3 w-3 ml-1" />
                          )}
                        </button>
                        
                        {index < 6 && (
                          <ChevronLeft className="h-4 w-4 text-muted-foreground mx-1 rotate-180" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hidden TabsList for functionality */}
              <TabsList className="hidden">
                <TabsTrigger value="phase1">Phase 1</TabsTrigger>
                <TabsTrigger value="phase2">Phase 2</TabsTrigger>
                <TabsTrigger value="phase3">Phase 3</TabsTrigger>
                <TabsTrigger value="phase4">Phase 4</TabsTrigger>
                <TabsTrigger value="phase5">Phase 5</TabsTrigger>
                <TabsTrigger value="phase6">Phase 6</TabsTrigger>
                <TabsTrigger value="phase7">Phase 7</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="phase1" className="space-y-6">
              <GlobalAssetContextCapture 
                selectedAsset={selectedAsset}
                onAssetSelect={(asset) => {
                  setSelectedAsset(asset);
                }}
                onContextComplete={async (metadata) => {
                  setWorkflowState(prev => ({ ...prev, phase1Complete: true, globalMetadata: metadata }));
                  setPhaseCompletions(prev => ({ ...prev, phase1: true }));
                  
                  // Create or update project in database
                  if (projectId) {
                    // Update existing project
                    await supabase
                      .from('localization_projects')
                      .update({
                        workflow_state: { ...workflowState, phase1Complete: true, globalMetadata: metadata }
                      })
                      .eq('id', projectId);
                  } else {
                    // Create new project
                    const { data: newProject, error } = await supabase
                      .from('localization_projects')
                      .insert({
                        brand_id: selectedBrand?.id || selectedAsset?.brand_id,
                        project_name: metadata.projectName || selectedAsset?.asset_name || 'New Localization Project',
                        description: metadata.description || `Localization project for ${selectedAsset?.asset_name}`,
                        project_type: 'localization',
                        source_content_type: 'content_asset',
                        source_content_id: selectedAsset?.id,
                        target_markets: metadata.targetMarkets || [],
                        target_languages: metadata.targetLanguages || [],
                        priority_level: metadata.priority || 'medium',
                        status: 'draft',
                        workflow_state: { phase1Complete: true, globalMetadata: metadata },
                        created_by: user?.id
                      })
                      .select()
                      .single();
                    
                    if (error) {
                      console.error('Failed to create project:', error);
                      toast({
                        title: "Error",
                        description: "Failed to save project. Please try again.",
                        variant: "destructive"
                      });
                      return;
                    }
                    
                    // Update URL to include new project ID
                    navigate(`/localization/workflow/${newProject.id}`, { replace: true });
                    
                    toast({
                      title: "Project Created",
                      description: "Your localization project has been saved.",
                    });
                  }
                  
                  setActiveTab('phase2');
                }}
              />
            </TabsContent>

            <TabsContent value="phase2" className="space-y-6">
              {selectedAsset && (
                <SimplifiedTranslationHub 
                  selectedAsset={selectedAsset}
                  globalMetadata={workflowState.globalMetadata}
                  onPhaseComplete={(data) => {
                    setWorkflowState(prev => ({ ...prev, phase2Complete: true, enhancedTmData: data }));
                    setPhaseCompletions(prev => ({ ...prev, phase2: true }));
                    setActiveTab('phase3');
                    
                    // Save to database
                    if (projectId) {
                      supabase
                        .from('localization_projects')
                        .update({
                          workflow_state: { ...workflowState, phase2Complete: true, enhancedTmData: data }
                        })
                        .eq('id', projectId);
                    }
                  }}
                  onBack={() => setActiveTab('phase1')}
                  projectId={projectId !== 'new' ? projectId : undefined}
                />
              )}
            </TabsContent>

            <TabsContent value="phase3" className="space-y-6">
              {selectedAsset && phaseCompletions.phase2 && (
                <CulturalIntelligenceHub 
                  selectedAsset={selectedAsset}
                  draftTranslations={workflowState.enhancedTmData?.segments || []}
                  targetMarket={(workflowState.intelligenceData?.selectedMarkets || workflowState.globalMetadata?.targetMarkets || ['China'])[0]}
                  onPhaseComplete={(data) => {
                    setWorkflowState(prev => ({ ...prev, phase3Complete: true, culturalData: data }));
                    setPhaseCompletions(prev => ({ ...prev, phase3: true }));
                    setActiveTab('phase4');
                    
                    // Save to database
                    if (projectId) {
                      supabase
                        .from('localization_projects')
                        .update({
                          workflow_state: { ...workflowState, phase3Complete: true, culturalData: data }
                        })
                        .eq('id', projectId);
                    }
                  }}
                  onBack={() => setActiveTab('phase2')}
                />
              )}
            </TabsContent>

            <TabsContent value="phase4" className="space-y-6">
              {selectedAsset && phaseCompletions.phase3 && (
                <RegulatoryComplianceHub 
                  selectedAsset={selectedAsset}
                  culturalTranslations={workflowState.culturalData}
                  onPhaseComplete={(data) => {
                    setWorkflowState(prev => ({ ...prev, phase4Complete: true, regulatoryData: data }));
                    setPhaseCompletions(prev => ({ ...prev, phase4: true }));
                    setActiveTab('phase5');
                    
                    // Save to database
                    if (projectId) {
                      supabase
                        .from('localization_projects')
                        .update({
                          workflow_state: { ...workflowState, phase4Complete: true, regulatoryData: data }
                        })
                        .eq('id', projectId);
                    }
                  }}
                  onBack={() => setActiveTab('phase3')}
                />
              )}
            </TabsContent>

            <TabsContent value="phase5" className="space-y-6">
              {selectedAsset && phaseCompletions.phase4 && (
                <QualityIntelligenceHub 
                  selectedAsset={selectedAsset}
                  complianceTranslations={workflowState.regulatoryData}
                  onPhaseComplete={(data) => {
                    setWorkflowState(prev => ({ ...prev, phase5Complete: true, qualityData: data }));
                    setPhaseCompletions(prev => ({ ...prev, phase5: true }));
                    setActiveTab('phase6');
                    
                    // Save to database
                    if (projectId) {
                      supabase
                        .from('localization_projects')
                        .update({
                          workflow_state: { ...workflowState, phase5Complete: true, qualityData: data }
                        })
                        .eq('id', projectId);
                    }
                  }}
                  onBack={() => setActiveTab('phase4')}
                />
              )}
            </TabsContent>

            <TabsContent value="phase6" className="space-y-6">
              {selectedAsset && phaseCompletions.phase5 && (
                <DAMHandoffGenerator 
                  selectedAsset={selectedAsset}
                  onPhaseComplete={(data) => {
                    setWorkflowState(prev => ({ ...prev, phase6Complete: true, damData: data }));
                    setPhaseCompletions(prev => ({ ...prev, phase6: true }));
                    setActiveTab('phase7');
                    
                    // Save to database
                    if (projectId) {
                      supabase
                        .from('localization_projects')
                        .update({
                          workflow_state: { ...workflowState, phase6Complete: true, damData: data }
                        })
                        .eq('id', projectId);
                    }
                  }}
                  onBack={() => setActiveTab('phase5')}
                />
              )}
            </TabsContent>

            <TabsContent value="phase7" className="space-y-6">
              {selectedAsset && phaseCompletions.phase6 && (
                <IntegrationLineageHub 
                  selectedAsset={selectedAsset}
                  onPhaseComplete={(data) => {
                    const finalState = { ...workflowState, phase7Complete: true, integrationData: data };
                    setWorkflowState(prev => ({ ...prev, ...finalState }));
                    setPhaseCompletions(prev => ({ ...prev, phase7: true }));
                    
                    // Save to database and mark as complete
                    if (projectId) {
                      supabase
                        .from('localization_projects')
                        .update({
                          workflow_state: finalState,
                          project_status: 'completed',
                          completed_at: new Date().toISOString()
                        })
                        .eq('id', projectId);
                    }
                    
                    toast({
                      title: "7-Phase Workflow Complete!",
                      description: "All localization intelligence phases completed successfully",
                      variant: "default"
                    });
                    
                    // Navigate back to dashboard after a short delay
                    setTimeout(() => navigate('/localization'), 2000);
                  }}
                  onBack={() => setActiveTab('phase6')}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LocalizationHub;