import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  CheckCircle, 
  RefreshCw, 
  Edit, 
  Save,
  Brain,
  Target,
  BarChart3,
  Shield,
  TrendingUp,
  Eye,
  Sparkles
} from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ThemeService } from '@/services/themeService';
import { ThemeIntelligenceService } from '@/services/themeIntelligenceService';
import { IntelligenceLayerSelector } from '@/components/intelligence/IntelligenceLayerSelector';
import { useBrand } from '@/contexts/BrandContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function ThemeIntelligenceWorkshop() {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const queryClient = useQueryClient();
  const [editingMessaging, setEditingMessaging] = useState(false);
  const [localKeyMessage, setLocalKeyMessage] = useState('');
  const [localCTA, setLocalCTA] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [enrichedThemeDrawerOpen, setEnrichedThemeDrawerOpen] = useState(false);
  
  // Check localStorage for auto-refresh state
  const getAutoRefreshKey = () => `theme-auto-refresh-${themeId}`;
  const hasAutoRefreshedFromStorage = () => {
    if (!themeId) return false;
    return localStorage.getItem(getAutoRefreshKey()) === 'true';
  };
  const setAutoRefreshedInStorage = () => {
    if (!themeId) return;
    localStorage.setItem(getAutoRefreshKey(), 'true');
  };

  // Fetch theme data
  const { data: theme, isLoading: themeLoading } = useQuery({
    queryKey: ['theme', themeId],
    queryFn: async () => {
      if (!themeId) throw new Error('Theme ID required');
      const theme = await ThemeService.getThemeById(themeId);
      if (!theme) throw new Error('Theme not found');
      return theme;
    },
    enabled: !!themeId
  });

  // Fetch intelligence data
  const { data: intelligence = [], isLoading: intelligenceLoading } = useQuery({
    queryKey: ['theme-intelligence', themeId, selectedBrand?.id],
    queryFn: async () => {
      if (!themeId || !selectedBrand?.id) return [];
      return ThemeIntelligenceService.getThemeIntelligence(themeId, selectedBrand.id);
    },
    enabled: !!themeId && !!selectedBrand?.id
  });

  // Fetch enrichment progress
  const { data: progress } = useQuery({
    queryKey: ['enrichment-progress', themeId],
    queryFn: async () => {
      if (!themeId) return { overall: 0, byType: {} };
      return ThemeIntelligenceService.calculateEnrichmentProgress(themeId);
    },
    enabled: !!themeId
  });

  // Initialize intelligence layers if they don't exist
  useEffect(() => {
    const initializeIfNeeded = async () => {
      if (themeId && selectedBrand?.id && !intelligenceLoading && intelligence.length === 0) {
        console.log('No intelligence layers found. Initializing...');
        try {
          await ThemeIntelligenceService.initializeIntelligence(themeId, selectedBrand.id);
          // Refetch intelligence data after initialization
          queryClient.invalidateQueries({ queryKey: ['theme-intelligence', themeId, selectedBrand.id] });
        } catch (error) {
          console.error('Failed to initialize intelligence:', error);
        }
      }
    };
    initializeIfNeeded();
  }, [themeId, selectedBrand?.id, intelligence.length, intelligenceLoading, queryClient]);

  // Auto-refresh intelligence layers that have no data (only once per theme)
  useEffect(() => {
    if (intelligence.length > 0 && themeId && selectedBrand?.id && !hasAutoRefreshedFromStorage()) {
      const emptyIntelligence = intelligence.filter(intel => 
        !intel.intelligence_data || Object.keys(intel.intelligence_data).length === 0
      );
      
      // Auto-refresh only if there are empty intelligence layers
      if (emptyIntelligence.length > 0) {
        console.log(`Auto-refreshing ${emptyIntelligence.length} intelligence layers...`);
        setAutoRefreshedInStorage(); // Persist to localStorage
        
        // Refresh all empty intelligence layers sequentially
        emptyIntelligence.forEach((intel, index) => {
          setTimeout(() => {
            refreshIntelligenceMutation.mutate({ 
              intelligenceId: intel.id, 
              type: intel.intelligence_type 
            });
          }, index * 1500); // Stagger requests by 1.5 seconds to avoid overwhelming
        });
      }
    }
  }, [intelligence, themeId, selectedBrand?.id]); // Only run when intelligence data first loads

  // Fetch current user ID
  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    getUserId();
  }, []);

  // Initialize local state from theme
  useEffect(() => {
    if (theme) {
      setLocalKeyMessage(theme.key_message || '');
      setLocalCTA(theme.call_to_action || '');
    }
  }, [theme]);

  // Mutations
  const refreshIntelligenceMutation = useMutation({
    mutationFn: async ({ intelligenceId, type }) => {
      if (!themeId || !selectedBrand?.id) throw new Error('Missing required data');
      return ThemeIntelligenceService.refreshIntelligence(intelligenceId, themeId, selectedBrand.id, type);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme-intelligence', themeId] });
      toast.success('Intelligence refreshed successfully');
    },
    onError: (error) => {
      console.error('Failed to refresh intelligence:', error);
      toast.error('Failed to refresh intelligence');
    }
  });

  const markIncorporatedMutation = useMutation({
    mutationFn: async ({ intelligenceId, userId }) => {
      return ThemeIntelligenceService.markAsIncorporated(intelligenceId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme-intelligence', themeId] });
      queryClient.invalidateQueries({ queryKey: ['enrichment-progress', themeId] });
      toast.success('Intelligence marked as incorporated');
    }
  });

  const updateMessagingMutation = useMutation({
    mutationFn: async () => {
      if (!themeId) throw new Error('Theme ID required');
      return ThemeIntelligenceService.updateThemeMessaging(themeId, {
        key_message: localKeyMessage,
        call_to_action: localCTA
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme', themeId] });
      setEditingMessaging(false);
      toast.success('Theme messaging updated');
    },
    onError: (error) => {
      console.error('Failed to update messaging:', error);
      toast.error('Failed to update messaging');
    }
  });

  const approveThemeMutation = useMutation({
    mutationFn: async () => {
      if (!themeId || !currentUserId) throw new Error('Missing required data');
      return ThemeIntelligenceService.approveTheme(themeId, currentUserId);
    },
    onSuccess: async () => {
      // Refetch theme data to show updated status
      await queryClient.invalidateQueries({ queryKey: ['theme', themeId] });
      await queryClient.invalidateQueries({ queryKey: ['theme-intelligence', themeId] });
      await queryClient.invalidateQueries({ queryKey: ['enrichment-progress', themeId] });
      
      toast.success('Theme approved and ready for use!');
      
      // Record theme usage and save to cross-module context
      if (selectedBrand?.id && theme) {
        await ThemeService.recordThemeUsage(
          themeId,
          'campaign',
          selectedBrand.id,
          { source: 'intelligence-workshop' }
        );
        
        // Save to cross-module context for intake flow
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const contextData = {
            theme: theme,
            themeId: themeId,
            source: 'workshop-approval'
          };
          const selections = {
            theme_id: themeId,
            enrichment_complete: true
          };
          
          await supabase.from('cross_module_context').upsert(
            {
              user_id: user.id,
              brand_id: selectedBrand.id,
              session_id: `workshop-${Date.now()}`,
              context_type: 'theme',
              context_data: contextData,
              selections: selections
            },
            {
              onConflict: 'user_id,brand_id,session_id,context_type',
              ignoreDuplicates: false
            }
          );
        }
      }
      
      // Navigate to Strategy & Insights
      setTimeout(() => {
        navigate('/strategy-insights', { 
          state: { 
            themeApproved: true,
            savedThemeId: themeId
          } 
        });
      }, 500);
    },
    onError: (error) => {
      console.error('Failed to approve theme:', error);
      toast.error('Failed to approve theme');
    }
  });

  const handleSaveMessaging = () => {
    updateMessagingMutation.mutate();
  };

  const handleViewEnrichedTheme = () => {
    setEnrichedThemeDrawerOpen(true);
  };

  const [selectedIntelligenceLayers, setSelectedIntelligenceLayers] = useState([]);
  const [showLayerSelector, setShowLayerSelector] = useState(false);
  const [customAssetName, setCustomAssetName] = useState('');

  const handleUseThemeNow = async () => {
    // Try to get project name from intake data
    let assetName = `${theme?.name || 'Content'} - Draft 1`;
    
    try {
      // Fetch intake data from cross_module_context
      const { data: contextData } = await supabase
        .from('cross_module_context')
        .select('context_data, selections')
        .eq('brand_id', selectedBrand?.id)
        .eq('context_type', 'initiative')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Use project name from intake if available
      const contextDataObj = contextData?.context_data;
      const selectionsObj = contextData?.selections;
      
      if (contextDataObj?.intake?.data?.projectName) {
        assetName = `${contextDataObj.intake.data.projectName} - email`;
      } else if (selectionsObj?.project_name) {
        assetName = `${selectionsObj.project_name} - email`;
      }
    } catch (error) {
      console.warn('Could not fetch intake data, using theme name:', error);
    }
    
    setCustomAssetName(assetName);
    setShowLayerSelector(true);
  };

  const handleGenerateWithSelectedLayers = async () => {
    if (!selectedBrand?.id || !currentUserId || !theme) {
      toast.error('Missing required data');
      return;
    }

    try {
      setShowLayerSelector(false);
      
      // Show initial loading toast
      const loadingToast = toast.loading('Preparing to generate content with intelligence layers...');
      
      // Create project
      const { data: newProject, error: projectError } = await supabase
        .from('content_projects')
        .insert({
          project_name: `${theme.name} Campaign`,
          theme_id: theme.id,
          brand_id: selectedBrand.id,
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
          created_by: currentUserId
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Link theme to campaign
      await supabase.from('campaign_themes').insert({
        campaign_id: newProject.id,
        theme_id: theme.id,
        brand_id: selectedBrand.id,
        selection_reason: 'Used from Intelligence Workshop',
        status: 'active',
        created_by: currentUserId
      });

      // Create first asset with initial empty content
      const { data: newAsset, error: assetError } = await supabase
        .from('content_assets')
        .insert({
          project_id: newProject.id,
          brand_id: selectedBrand.id,
          asset_name: customAssetName || `${theme.name} - Draft 1`,
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
          created_by: currentUserId
        })
        .select()
        .single();

      if (assetError) throw assetError;

      // Update loading message
      toast.loading('Fetching intelligence layers...', { id: loadingToast });

      // Fetch intelligence layers for this theme
      const { data: allIntelligenceLayers, error: intelligenceError } = await supabase
        .from('theme_intelligence')
        .select('*')
        .eq('theme_id', theme.id)
        .eq('incorporated', true);

      if (intelligenceError) {
        console.error('Failed to fetch intelligence layers:', intelligenceError);
      }

      // Filter based on user selection
      const intelligenceLayers = selectedIntelligenceLayers.length > 0
        ? (allIntelligenceLayers || []).filter(layer => 
            selectedIntelligenceLayers.includes(layer.intelligence_type)
          )
        : allIntelligenceLayers || [];

      const layerCount = intelligenceLayers.length;
      const layerText = layerCount === 0 
        ? 'theme data only' 
        : `${layerCount} intelligence layer${layerCount !== 1 ? 's' : ''}`;
      toast.loading(`Generating content with ${layerText}...`, { id: loadingToast });

      // Prepare theme data for content generation
      const themeDataForGeneration = {
        theme_name: theme.name,
        core_message: theme.key_message || '',
        therapeutic_focus: theme.indication || theme.description || '',
        target_audience: Array.isArray(theme.audience_segments) ? theme.audience_segments.join(', ') : theme.audience_segments || 'Healthcare Professionals',
        key_benefits: theme.messaging_framework?.supporting_messages || [],
        clinical_positioning: theme.messaging_framework?.primary_message || '',
        emotional_tone: theme.messaging_framework?.tone_guidance || 'professional',
        proof_points: theme.content_suggestions?.proof_points || [],
        differentiation_claims: theme.messaging_framework?.competitive_differentiators || [],
        cta_frameworks: theme.call_to_action ? [theme.call_to_action] : []
      };

      // Prepare intake context
      const intakeContextForGeneration = {
        intake_objective: 'clinical-education',
        intake_audience: Array.isArray(theme.audience_segments) ? theme.audience_segments[0] : theme.audience_segments || 'HCP',
        indication: theme.indication || '',
        targetMarkets: theme.target_markets || ['US']
      };

      // Call generate-initial-content edge function
      const { data: generatedResult, error: generationError } = await supabase.functions.invoke(
        'generate-initial-content',
        {
          body: {
            brandId: selectedBrand.id,
            themeData: themeDataForGeneration,
            intakeContext: intakeContextForGeneration,
            assetType: 'email',
            intelligenceLayers: intelligenceLayers || []
          }
        }
      );

      if (generationError) {
        console.error('Content generation error:', generationError);
        toast.error('Failed to generate content. Opening editor with theme data...', { id: loadingToast });
        // Still navigate to editor even if generation fails
        navigate(`/content-editor/${newAsset.id}`);
        return;
      }

      toast.loading('Finalizing content...', { id: loadingToast });

      // Update asset with generated content
      const { error: updateError } = await supabase
        .from('content_assets')
        .update({
          primary_content: generatedResult.content,
          metadata: {
            created_from_theme: true,
            theme_id: theme.id,
            enrichment_status: theme.enrichment_status,
            generation_sources: generatedResult.metadata || {},
            intelligence_layers_used: intelligenceLayers?.map(i => i.intelligence_type) || [],
            intelligence_layer_count: layerCount,
            generated_with_ai: true,
            generation_timestamp: new Date().toISOString()
          }
        })
        .eq('id', newAsset.id);

      if (updateError) {
        console.error('Failed to update asset with generated content:', updateError);
        toast.error('Failed to save generated content', { id: loadingToast });
        navigate(`/content-editor/${newAsset.id}`);
        return;
      }

      toast.success(`Content generated with ${layerCount} intelligence layers!`, { id: loadingToast });
      navigate(`/content-editor/${newAsset.id}`);
    } catch (error) {
      console.error('Failed to create content from theme:', error);
      toast.error('Failed to create content from theme');
    }
  };

  const handleSaveForFuture = async () => {
    if (!themeId || !currentUserId) {
      toast.error('Missing required data');
      return;
    }

    try {
      await ThemeIntelligenceService.approveTheme(themeId, currentUserId);
      toast.success('Theme saved for future use!');
      navigate('/strategy-insights', { 
        state: { 
          themeApproved: true,
          savedThemeId: themeId
        } 
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
      toast.error('Failed to save theme');
    }
  };

  const getIntelligenceIcon = (type) => {
    switch (type) {
      case 'brand':
        return <Target className="h-5 w-5" />;
      case 'competitive':
        return <BarChart3 className="h-5 w-5" />;
      case 'market':
        return <TrendingUp className="h-5 w-5" />;
      case 'regulatory':
        return <Shield className="h-5 w-5" />;
      case 'public':
        return <Brain className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getIntelligenceTitle = (type) => {
    const titles = {
      brand: 'Brand Intelligence',
      competitive: 'Competitive Intelligence',
      market: 'Market Intelligence',
      regulatory: 'Regulatory Intelligence',
      public: 'Public Domain Intelligence'
    };
    return titles[type] || type;
  };

  const renderIntelligenceData = (type, data) => {
    if (!data || Object.keys(data).length === 0) {
      return <p className="text-muted-foreground italic">No intelligence data available. Click refresh to generate AI analysis.</p>;
    }

    switch (type) {
      case 'brand':
        return (
          <div className="space-y-4">
            {data.voiceAlignment && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Brand Voice Alignment</p>
                  <Badge variant={data.voiceAlignment.score >= 80 ? 'default' : 'secondary'}>
                    {data.voiceAlignment.score}/100
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{data.voiceAlignment.analysis}</p>
                {data.voiceAlignment.recommendations && data.voiceAlignment.recommendations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Recommendations:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                      {data.voiceAlignment.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {data.messagingOptimization && (
              <div className="space-y-2">
                {data.messagingOptimization.strengths && data.messagingOptimization.strengths.length > 0 && (
                  <div>
                    <p className="font-medium text-sm text-green-600 mb-1">✓ Strengths</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {data.messagingOptimization.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.messagingOptimization.improvements && data.messagingOptimization.improvements.length > 0 && (
                  <div>
                    <p className="font-medium text-sm text-orange-600 mb-1">→ Improvements</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {data.messagingOptimization.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {data.brandConsistency && (
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Consistency Score</p>
                  <Badge variant="outline">{data.brandConsistency.consistencyScore}/100</Badge>
                </div>
                {data.brandConsistency.enhancements && data.brandConsistency.enhancements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-1">Enhancements:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {data.brandConsistency.enhancements.map((enh, i) => (
                        <li key={i}>{enh}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'competitive':
        return (
          <div className="space-y-4">
            {data.differentiationOpportunities && data.differentiationOpportunities.length > 0 && (
              <div>
                <p className="font-semibold text-sm mb-2">🎯 Differentiation Opportunities</p>
                <div className="space-y-2">
                  {data.differentiationOpportunities.map((opp, i) => (
                    <div key={i} className="p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{opp.opportunity}</p>
                        <Badge variant={opp.impact === 'high' ? 'default' : 'secondary'} className="text-xs">
                          {opp.impact}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{opp.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.competitiveAdvantages && data.competitiveAdvantages.length > 0 && (
              <div>
                <p className="font-semibold text-sm mb-2">💪 Advantages to Emphasize</p>
                <div className="space-y-2">
                  {data.competitiveAdvantages.map((adv, i) => (
                    <div key={i} className="p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm font-medium mb-1">{adv.advantage}</p>
                      <p className="text-xs text-muted-foreground">{adv.howToEmphasize}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.marketGaps && data.marketGaps.length > 0 && (
              <div>
                <p className="font-semibold text-sm mb-2">🔓 Market Gaps to Capture</p>
                <div className="space-y-2">
                  {data.marketGaps.map((gap, i) => (
                    <div key={i} className="p-2 bg-purple-50 border border-purple-200 rounded">
                      <p className="text-sm font-medium mb-1">{gap.gap}</p>
                      <p className="text-xs text-muted-foreground">{gap.howToCapture}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'market':
        return (
          <div className="space-y-4">
            {data.audienceResonance && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Audience Resonance</p>
                  <Badge variant={data.audienceResonance.score >= 80 ? 'default' : 'secondary'}>
                    {data.audienceResonance.score}/100
                  </Badge>
                </div>
                {data.audienceResonance.primaryDrivers && data.audienceResonance.primaryDrivers.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium mb-1 text-green-600">Primary Drivers:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {data.audienceResonance.primaryDrivers.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.audienceResonance.potentialBarriers && data.audienceResonance.potentialBarriers.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-1 text-orange-600">Potential Barriers:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {data.audienceResonance.potentialBarriers.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {data.marketOpportunities && data.marketOpportunities.length > 0 && (
              <div>
                <p className="font-semibold text-sm mb-2">📊 Market Opportunities</p>
                <div className="space-y-2">
                  {data.marketOpportunities.map((opp, i) => (
                    <div key={i} className="p-2 border rounded">
                      <p className="text-sm font-medium">{opp.opportunity}</p>
                      <p className="text-xs text-muted-foreground mt-1">Timing: {opp.timing}</p>
                      {opp.actionSteps && opp.actionSteps.length > 0 && (
                        <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                          {opp.actionSteps.map((step, j) => (
                            <li key={j}>{step}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.positioningRecommendations && data.positioningRecommendations.length > 0 && (
              <div>
                <p className="font-semibold text-sm mb-2">🎯 Positioning Recommendations</p>
                <div className="space-y-1">
                  {data.positioningRecommendations.map((rec, i) => (
                    <div key={i} className="text-sm">
                      <p className="font-medium">{rec.recommendation}</p>
                      <p className="text-xs text-muted-foreground">Impact: {rec.expectedImpact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'regulatory':
        return (
          <div className="space-y-4">
            {data.complianceAssessment && (
              <div className={`p-3 rounded-lg border-2 ${
                data.complianceAssessment.riskLevel === 'high' ? 'bg-red-50 border-red-300' :
                data.complianceAssessment.riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-300' :
                'bg-green-50 border-green-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Compliance Assessment</p>
                  <Badge variant={
                    data.complianceAssessment.riskLevel === 'high' ? 'destructive' :
                    data.complianceAssessment.riskLevel === 'medium' ? 'secondary' : 'default'
                  }>
                    {data.complianceAssessment.riskLevel} risk
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{data.complianceAssessment.analysis}</p>
                {data.complianceAssessment.flaggedElements && data.complianceAssessment.flaggedElements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-1 text-red-600">⚠️ Flagged Elements:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {data.complianceAssessment.flaggedElements.map((el, i) => (
                        <li key={i}>{el}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {data.requiredDisclaimers && data.requiredDisclaimers.length > 0 && (
              <div>
                <p className="font-semibold text-sm mb-2">📋 Required Disclaimers</p>
                <div className="space-y-2">
                  {data.requiredDisclaimers.map((disc, i) => (
                    <div key={i} className="p-2 bg-muted border rounded text-xs">
                      <p className="font-medium mb-1">{disc.disclaimer}</p>
                      <p className="text-muted-foreground">Placement: {disc.placement}</p>
                      <p className="text-muted-foreground">Rationale: {disc.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.fairBalanceConsiderations && (
              <div className="p-2 border rounded">
                <p className="font-semibold text-sm mb-1">⚖️ Fair Balance</p>
                <p className="text-xs text-muted-foreground mb-2">{data.fairBalanceConsiderations.analysis}</p>
                {data.fairBalanceConsiderations.recommendations && data.fairBalanceConsiderations.recommendations.length > 0 && (
                  <ul className="text-xs text-muted-foreground list-disc list-inside">
                    {data.fairBalanceConsiderations.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      
      case 'public':
        return (
          <div className="space-y-4">
            {data.relevantTrends && data.relevantTrends.length > 0 && (
              <div>
                <p className="font-semibold text-sm mb-2">📈 Relevant Trends</p>
                <div className="space-y-2">
                  {data.relevantTrends.map((trend, i) => (
                    <div key={i} className="p-2 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm font-medium mb-1">{trend.trend}</p>
                      <p className="text-xs text-muted-foreground mb-1">Relevance: {trend.relevance}</p>
                      <p className="text-xs text-blue-700">💡 {trend.howToLeverage}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.recentDevelopments && data.recentDevelopments.length > 0 && (
              <div>
                <p className="font-semibold text-sm mb-2">🆕 Recent Developments</p>
                <div className="space-y-2">
                  {data.recentDevelopments.map((dev, i) => (
                    <div key={i} className="p-2 border rounded">
                      <p className="text-sm font-medium">{dev.development}</p>
                      <p className="text-xs text-muted-foreground">Impact: {dev.impact}</p>
                      <p className="text-xs text-muted-foreground">Implication: {dev.implication}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.patientSentiment && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                <p className="font-semibold text-sm mb-2">👥 Patient Sentiment</p>
                <p className="text-sm text-muted-foreground mb-2">Overall: {data.patientSentiment.overallTone}</p>
                {data.patientSentiment.keyThemes && data.patientSentiment.keyThemes.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium mb-1">Key Themes:</p>
                    <div className="flex flex-wrap gap-1">
                      {data.patientSentiment.keyThemes.map((themeItem, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{themeItem}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {data.patientSentiment.messagingOpportunities && data.patientSentiment.messagingOpportunities.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-1">Messaging Opportunities:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {data.patientSentiment.messagingOpportunities.map((opp, i) => (
                        <li key={i}>{opp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      default:
        return <p className="text-sm text-muted-foreground">Intelligence data available</p>;
    }
  };

  if (themeLoading || intelligenceLoading || !theme) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      
      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2560px]">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/strategy-insights')} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Strategy & Insights
            </Button>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Theme Intelligence Workshop
                </h1>
                <p className="text-muted-foreground mt-2">
                  Enrich "{theme.name}" with intelligence to create more effective content
                </p>
              </div>
              
              <Badge variant={theme.enrichment_status === 'ready-for-use' ? 'default' : 'secondary'}>
                {theme.enrichment_status === 'ready-for-use' ? 'Ready' : 'Generated'}
              </Badge>
            </div>

            {/* Progress Bar */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Intelligence Enrichment Progress</span>
                  <span className="text-sm text-muted-foreground">{progress?.overall || 0}%</span>
                </div>
                <Progress value={progress?.overall || 0} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {Object.values(progress?.byType || {}).filter(Boolean).length} of 5 intelligence layers incorporated
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Theme Messaging Panel */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Theme Messaging</CardTitle>
                {!editingMessaging ? (
                  <Button variant="outline" size="sm" onClick={() => setEditingMessaging(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleSaveMessaging} disabled={updateMessagingMutation.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Key Message</Label>
                {editingMessaging ? (
                  <Textarea
                    value={localKeyMessage}
                    onChange={(e) => setLocalKeyMessage(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">{theme.key_message}</p>
                )}
              </div>
              <div>
                <Label>Call to Action</Label>
                {editingMessaging ? (
                  <Input
                    value={localCTA}
                    onChange={(e) => setLocalCTA(e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">{theme.call_to_action || 'Not set'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Intelligence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {intelligence.map((intel) => (
              <Card key={intel.id} className={intel.incorporated ? 'border-primary/50' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getIntelligenceIcon(intel.intelligence_type)}
                      <CardTitle className="text-lg">{getIntelligenceTitle(intel.intelligence_type)}</CardTitle>
                    </div>
                    {intel.incorporated && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Incorporated
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Intelligence Data Display */}
                  <div className="text-sm space-y-2">
                    {renderIntelligenceData(intel.intelligence_type, intel.intelligence_data)}
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refreshIntelligenceMutation.mutate({ intelligenceId: intel.id, type: intel.intelligence_type })}
                      disabled={refreshIntelligenceMutation.isPending}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh
                    </Button>
                    {!intel.incorporated && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          if (currentUserId) {
                            markIncorporatedMutation.mutate({ intelligenceId: intel.id, userId: currentUserId });
                          }
                        }}
                        disabled={markIncorporatedMutation.isPending || !currentUserId}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Incorporate Insights
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Last refreshed: {new Date(intel.last_refreshed).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Theme Actions - Only show when at least some enrichment is done */}
          {(progress?.overall || 0) > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Theme Actions</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Intelligence Progress: {progress?.overall || 0}% • 
                      {(progress?.overall || 0) >= 80 
                        ? ' Theme is well-enriched and ready'
                        : ' Recommended: Incorporate 4+ layers before use'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Sheet open={enrichedThemeDrawerOpen} onOpenChange={setEnrichedThemeDrawerOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" onClick={handleViewEnrichedTheme}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Enriched Theme
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>{theme.name}</SheetTitle>
                          <SheetDescription>Complete enriched theme preview</SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                          {/* Theme Overview */}
                          <div>
                            <h3 className="font-semibold mb-2">Overview</h3>
                            <p className="text-sm text-muted-foreground mb-2">{theme.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge>{theme.category}</Badge>
                              <Badge variant="outline">{theme.enrichment_status}</Badge>
                              <Badge variant="secondary">{progress?.overall || 0}% Enriched</Badge>
                            </div>
                          </div>

                          {/* Enriched Messaging */}
                          <div>
                            <h3 className="font-semibold mb-2">Enriched Messaging</h3>
                            <div className="space-y-3">
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs font-medium mb-1">Key Message</p>
                                <p className="text-sm">{theme.key_message}</p>
                              </div>
                              {theme.call_to_action && (
                                <div className="p-3 bg-muted rounded-lg">
                                  <p className="text-xs font-medium mb-1">Call to Action</p>
                                  <p className="text-sm">{theme.call_to_action}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Intelligence Summary */}
                          <div>
                            <h3 className="font-semibold mb-2">Intelligence Summary</h3>
                            <div className="space-y-2">
                              {intelligence.map((intel) => (
                                <div key={intel.id} className="p-3 border rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      {getIntelligenceIcon(intel.intelligence_type)}
                                      <p className="text-sm font-medium">{getIntelligenceTitle(intel.intelligence_type)}</p>
                                    </div>
                                    {intel.incorporated && (
                                      <Badge variant="default" className="text-xs">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Incorporated
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {intel.intelligence_data && Object.keys(intel.intelligence_data).length > 0 
                                      ? 'Intelligence data available'
                                      : 'No data yet'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Audience & Markets */}
                          {(theme.audience_segments?.length > 0 || theme.target_markets?.length > 0) && (
                            <div>
                              <h3 className="font-semibold mb-2">Target Audience & Markets</h3>
                              {theme.audience_segments && theme.audience_segments.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs font-medium mb-1">Audience Segments</p>
                                  <div className="flex flex-wrap gap-1">
                                    {theme.audience_segments.map((seg, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">{seg}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {theme.target_markets && theme.target_markets.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium mb-1">Target Markets</p>
                                  <div className="flex flex-wrap gap-1">
                                    {theme.target_markets.map((market, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">{market}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                    
                    <Button variant="default" onClick={handleUseThemeNow}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use Theme to Generate Content
                    </Button>
                    
                    <Button variant="secondary" onClick={handleSaveForFuture}>
                      <Save className="h-4 w-4 mr-2" />
                      Save for Future Use
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Helpful prompt when no enrichment yet */}
          {(progress?.overall || 0) === 0 && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Start Enriching Your Theme</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Review and incorporate intelligence from the layers above to enhance your theme with competitive insights, 
                    market data, regulatory compliance, and more. Click "Refresh" on any layer to generate intelligence, 
                    then "Incorporate Insights" to apply it to your theme.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </ScrollArea>

      {/* Intelligence Layer Selection Dialog */}
      <Dialog open={showLayerSelector} onOpenChange={setShowLayerSelector}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Customize Content Generation
            </DialogTitle>
            <DialogDescription>
              Choose which intelligence layers to use and customize your asset name
            </DialogDescription>
          </DialogHeader>

          {/* Asset Name Input */}
          <div className="space-y-2">
            <Label htmlFor="asset-name">Asset Name</Label>
            <Input
              id="asset-name"
              value={customAssetName}
              onChange={(e) => setCustomAssetName(e.target.value)}
              placeholder="Enter asset name..."
              className="w-full"
            />
          </div>

          <div className="py-4">
            <IntelligenceLayerSelector
              availableLayers={intelligence.map(i => ({
                intelligence_type: i.intelligence_type,
                incorporated: i.incorporated
              }))}
              selectedLayers={selectedIntelligenceLayers}
              onSelectionChange={setSelectedIntelligenceLayers}
            />
          </div>

          <DialogFooter className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedIntelligenceLayers.length === 0 
                ? 'Basic content will be generated using theme data only' 
                : `${selectedIntelligenceLayers.length} layer${selectedIntelligenceLayers.length !== 1 ? 's' : ''} selected`
              }
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowLayerSelector(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateWithSelectedLayers}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}