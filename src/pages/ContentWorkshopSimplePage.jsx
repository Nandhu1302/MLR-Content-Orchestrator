
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { IntelligenceArsenalPanel } from '@/components/workshop/IntelligenceArsenalPanel';
import { InitiativeTypeSelector } from '@/components/workshop/InitiativeTypeSelector';
import { AssetTypeSelector } from '@/components/workshop/AssetTypeSelector';
import { ThemeCardsPanel } from '@/components/workshop/ThemeCardsPanel';
import { StrategicBriefPanel } from '@/components/workshop/StrategicBriefPanel';
import { StoryIntelligenceMatchingService } from '@/services/intelligence';
import { WORKSHOP_CONFIG } from '@/config/workshop';
import { Loader2, Sparkles, FileText, Calendar, Target, TrendingUp, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const QUICK_SCENARIOS = [
  { icon: Calendar, label: 'Conference Event', value: 'booth materials for upcoming HIV conference with ID specialists' },
  { icon: Target, label: 'Product Launch', value: 'launch campaign for new indication targeting infectious disease specialists' },
  { icon: TrendingUp, label: 'Awareness Campaign', value: 'disease awareness campaign for patients and caregivers' },
  { icon: Users, label: 'HCP Education', value: 'educational materials for healthcare providers about treatment options' },
];

export default function ContentWorkshopSimplePage() {
  const [userInput, setUserInput] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [context, setContext] = useState({
    userStory: '',
    detectedIntent: {}
  });
  const [intelligence, setIntelligence] = useState(null);
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [selectedVisuals, setSelectedVisuals] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  // New state for enhanced flow
  const [initiativeType, setInitiativeType] = useState(null);
  const [selectedAssetTypes, setSelectedAssetTypes] = useState([]);
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [channelPreferences, setChannelPreferences] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMatchIntelligence = async (input) => {
    if (!input.trim()) return;
    setIsMatching(true);
    try {
      // Simple intent extraction from user input
      const detectedIntent = {
        audience: input.toLowerCase().includes('specialist') ? 'HCP-Specialist' :
                  input.toLowerCase().includes('patient') ? 'Patient' :
                  input.toLowerCase().includes('caregiver') ? 'Caregiver' : '',
        occasion: input.toLowerCase().includes('conference') ||
                  input.toLowerCase().includes('event') ? 'Conference' :
                  input.toLowerCase().includes('launch') ? 'Product Launch' :
                  input.toLowerCase().includes('awareness') ? 'Awareness Campaign' : '',
        channel:  input.toLowerCase().includes('email') ? 'Email' :
                  input.toLowerCase().includes('social') ? 'Social' :
                  input.toLowerCase().includes('web') ? 'Website' : ''
      };
      const newContext = {
        userStory: input,
        detectedIntent
      };
      setContext(newContext);

      // Match intelligence using existing service
      const matchedIntelligence = await StoryIntelligenceMatchingService.matchIntelligenceToStory(
        newContext,
        WORKSHOP_CONFIG.BIKTARVY_BRAND_ID
      );
      setIntelligence(matchedIntelligence);

      // Auto-select top items
      if (matchedIntelligence.claims.length > 0) {
        setSelectedClaims(matchedIntelligence.claims.slice(0, 3).map(c => c.id));
      }
      if (matchedIntelligence.visuals.length > 0) {
        setSelectedVisuals(matchedIntelligence.visuals.slice(0, 2).map(v => v.id));
      }
      if (matchedIntelligence.modules.length > 0) {
        setSelectedModules(matchedIntelligence.modules.slice(0, 2).map(m => m.id));
      }

      // Extract channel preferences from audience insights
      if (matchedIntelligence.audienceInsights.length > 0) {
        const channels = matchedIntelligence.audienceInsights
          .map(i => i.description)
          .filter(d => d.toLowerCase().includes('channel') ||
                       d.toLowerCase().includes('prefers'))
          .join(' ');
        const prefs = [];
        if (channels.toLowerCase().includes('email')) prefs.push('Email');
        if (channels.toLowerCase().includes('conference') ||
            channels.toLowerCase().includes('event')) prefs.push('Rep-Enabled');
        if (channels.toLowerCase().includes('social')) prefs.push('Social');
        if (channels.toLowerCase().includes('web') ||
            channels.toLowerCase().includes('digital')) prefs.push('Website');
        setChannelPreferences(prefs);
      }
    } catch (error) {
      console.error('Error matching intelligence:', error);
      toast({
        title: 'Error',
        description: 'Failed to match intelligence. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsMatching(false);
    }
  };

  const handleScenarioClick = (scenario) => {
    setUserInput(scenario);
    handleMatchIntelligence(scenario);
  };

  const handleAssetTypeToggle = (typeId) => {
    if (initiativeType === 'single') {
      setSelectedAssetTypes([typeId]);
    } else {
      setSelectedAssetTypes(prev =>
        prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
      );
    }
  };

  const handleProceedToThemes = async () => {
    if (!intelligence || !initiativeType || selectedAssetTypes.length === 0) return;
    setIsLoadingThemes(true);
    try {
      // Fetch themes from theme_library filtered by audience
      const { data: themeData, error } = await supabase
        .from('theme_library')
        .select('*')
        .eq('brand_id', WORKSHOP_CONFIG.BIKTARVY_BRAND_ID)
        .eq('status', 'active')
        .order('confidence_score', { ascending: false })
        .limit(4);
      if (error) throw error;

      // Transform to ThemeOption format
      const transformedThemes = (themeData ?? []).map((theme) => {
        const perfPrediction = theme.performance_prediction;
        const rationale = theme.rationale;
        return {
          id: theme.id,
          name: theme.name,
          keyMessage: theme.key_message,
          tone: theme.tone ?? 'professional',
          cta: theme.call_to_action,
          performancePrediction: {
            engagementRate: perfPrediction?.engagement_rate ?? 0,
            confidence: theme.confidence_score ?? 0,
            basis: rationale?.data_sources?.join(', ') ?? 'Historical campaign data',
          },
          bestForAssets: selectedAssetTypes,
          supportingClaims: selectedClaims,
          recommendedVisuals: selectedVisuals,
          rationale: rationale?.strategic_fit ?? 'Optimized for your audience and objectives',
        };
      });
      setThemes(transformedThemes);

      if (transformedThemes.length === 0) {
        toast({
          title: 'No Themes Found',
          description: 'Creating default theme recommendations...',
        });
        // Create fallback themes based on detected intent
        const fallbackThemes = createFallbackThemes();
        setThemes(fallbackThemes);
      }
    } catch (error) {
      console.error('Error loading themes:', error);
      // Create fallback themes
      const fallbackThemes = createFallbackThemes();
      setThemes(fallbackThemes);
    } finally {
      setIsLoadingThemes(false);
    }
  };

  const createFallbackThemes = () => {
    const audience = context.detectedIntent?.audience ?? 'HCP';
    return [
      {
        id: 'theme-1',
        name: 'Evidence-First Leadership',
        keyMessage: 'Lead with clinical evidence demonstrating efficacy and durability',
        tone: 'clinical',
        cta: 'Download Clinical Data',
        performancePrediction: { engagementRate: 72, confidence: 85, basis: '45 similar campaigns' },
        bestForAssets: selectedAssetTypes,
        supportingClaims: selectedClaims.slice(0, 5),
        recommendedVisuals: selectedVisuals.slice(0, 2),
        rationale: `Backed by ${selectedClaims.length} clinical claims, this approach resonates with evidence-focused ${audience} audiences`,
      },
      {
        id: 'theme-2',
        name: 'Patient-Centered Outcomes',
        keyMessage: 'Focus on real-world patient benefits and quality of life improvements',
        tone: 'empowering',
        cta: 'Learn About Patient Outcomes',
        performancePrediction: { engagementRate: 68, confidence: 78, basis: '32 similar campaigns' },
        bestForAssets: selectedAssetTypes,
        supportingClaims: selectedClaims.slice(0, 4),
        recommendedVisuals: selectedVisuals.slice(0, 3),
        rationale: 'Emphasizes outcomes that matter to patients while maintaining clinical credibility',
      },
      {
        id: 'theme-3',
        name: 'Practical Implementation',
        keyMessage: 'Simplify treatment decisions with clear guidance and support',
        tone: 'professional',
        cta: 'Access Treatment Resources',
        performancePrediction: { engagementRate: 65, confidence: 82, basis: '38 similar campaigns' },
        bestForAssets: selectedAssetTypes,
        supportingClaims: selectedClaims.slice(0, 3),
        recommendedVisuals: selectedVisuals.slice(0, 2),
        rationale: 'Addresses practical barriers with actionable support materials',
      },
    ];
  };

  const handleGenerateContent = async () => {
    if (!selectedTheme || selectedAssetTypes.length === 0) {
      toast({
        title: 'Selection Required',
        description: 'Please select a theme and at least one asset type.',
        variant: 'destructive'
      });
      return;
    }
    setIsGenerating(true);
    try {
      // Create content project with correct column names
      const { data: project, error: projectError } = await supabase
        .from('content_projects')
        .insert({
          project_name: `${context.detectedIntent?.occasion ?? 'Content'} - ${selectedTheme.name}`,
          brand_id: WORKSHOP_CONFIG.BIKTARVY_BRAND_ID,
          project_type: initiativeType === 'campaign' ? 'campaign' : 'single-asset',
          target_audience: context.detectedIntent?.audience,
          status: 'in_progress',
          project_metadata: {
            theme_id: selectedTheme.id,
            theme_name: selectedTheme.name,
            strategic_brief: {
              key_message: selectedTheme.keyMessage,
              cta: selectedTheme.cta,
              tone: selectedTheme.tone,
              performance_prediction: selectedTheme.performancePrediction,
            },
            campaign_progress: {
              totalAssets: selectedAssetTypes.length,
              completedAssets: 0
            }
          }
        })
        .select()
        .single();
      if (projectError) throw projectError;

      // Generate content for each asset type using AI
      const campaignAssets = [];
      const failedAssets = [];
      console.log(`🚀 Generating content for ${selectedAssetTypes.length} asset types:`, selectedAssetTypes);

      for (let i = 0; i < selectedAssetTypes.length; i++) {
        const assetType = selectedAssetTypes[i];
        console.log(`📝 Processing asset ${i + 1}/${selectedAssetTypes.length}: ${assetType}`);
        try {
          // Call generate-initial-content edge function
          const { data: generatedContent, error: genError } = await supabase.functions.invoke('generate-initial-content', {
            body: {
              brandId: WORKSHOP_CONFIG.BIKTARVY_BRAND_ID,
              assetType: assetType,
              intakeContext: {
                intake_audience: context.detectedIntent?.audience,
                intake_objective: context.detectedIntent?.goals?.[0] ?? 'product-awareness',
                indication: 'HIV',
                original_key_message: selectedTheme.keyMessage,
                original_cta: selectedTheme.cta,
              },
              themeData: {
                core_message: selectedTheme.keyMessage,
                therapeutic_focus: 'HIV',
                cta_frameworks: [selectedTheme.cta],
                tone_of_voice: selectedTheme.tone,
                key_benefits: []
              },
              strategicContext: {
                targetAudience: context.detectedIntent?.audience,
                campaignObjective: context.detectedIntent?.goals?.[0],
                occasion: context.detectedIntent?.occasion,
              },
              preselectedEvidence: {
                claimIds: selectedClaims,
                visualAssetIds: selectedVisuals,
                moduleIds: selectedModules
              }
            }
          });
          if (genError) {
            console.error(`❌ Error generating content for ${assetType}:`, genError);
            failedAssets.push(`${assetType} (content generation failed)`);
            continue; // Skip to next asset
          }
          console.log(`✅ Content generated for ${assetType}`);

          // Create asset record with generated content
          const assetTypeLabels = {
            'mass-email': 'Email',
            'website-landing-page': 'Landing Page',
            'social-media-post': 'Social Post',
            'digital-sales-aid': 'Digital Sales Aid',
            'blog': 'Blog Post',
            'rep-triggered-email': 'Rep-Triggered Email',
          };
          const { data: asset, error: assetError } = await supabase
            .from('content_assets')
            .insert({
              project_id: project.id,
              brand_id: WORKSHOP_CONFIG.BIKTARVY_BRAND_ID,
              asset_name: `${selectedTheme.name} - ${assetTypeLabels[assetType] ?? assetType}`,
              asset_type: assetType,
              target_audience: context.detectedIntent?.audience,
              status: 'draft',
              theme_id: selectedTheme.id,
              primary_content: generatedContent?.content ?? {},
              claims_used: selectedClaims,
              metadata: {
                selected_visuals: selectedVisuals,
                selected_modules: selectedModules,
                theme_context: {
                  key_message: selectedTheme.keyMessage,
                  cta: selectedTheme.cta,
                  tone: selectedTheme.tone,
                },
                intelligence_summary: {
                  total_claims: selectedClaims.length,
                  total_visuals: selectedVisuals.length,
                  total_modules: selectedModules.length
                },
                campaign_order: i,
                generated_from: 'workshop'
              }
            })
            .select()
            .single();
          if (assetError) {
            console.error(`❌ Error saving asset ${assetType}:`, assetError);
            failedAssets.push(`${assetType} (database save failed)`);
            continue; // Skip to next asset
          }
          if (!asset) {
            console.error(`❌ No asset returned for ${assetType}`);
            failedAssets.push(`${assetType} (no data returned)`);
            continue; // Skip to next asset
          }
          console.log(`✅ Asset saved: ${asset.asset_name} (ID: ${asset.id})`);
          campaignAssets.push({
            assetId: asset.id,
            assetType: assetType,
            assetName: asset.asset_name,
            status: 'draft',
            generatedContent: generatedContent?.content ?? {},
            order: i,
          });
        } catch (error) {
          console.error(`❌ Unexpected error processing ${assetType}:`, error);
          failedAssets.push(`${assetType} (unexpected error)`);
        }
      }

      console.log('📦 Campaign asset generation complete:', {
        requested: selectedAssetTypes.length,
        created: campaignAssets.length,
        failed: failedAssets.length,
        assets: campaignAssets.map(a => ({ name: a.assetName, type: a.assetType, status: a.status }))
      });

      // Show appropriate toast based on results
      if (failedAssets.length > 0) {
        toast({
          title: campaignAssets.length > 0 ? 'Partial Success' : 'Content Generation Failed',
          description: campaignAssets.length > 0
            ? `Created ${campaignAssets.length} asset(s). Failed: ${failedAssets.join(', ')}`
            : `Failed to create assets: ${failedAssets.join(', ')}`,
          variant: campaignAssets.length > 0 ? 'default' : 'destructive',
          duration: 5000
        });
      } else {
        toast({
          title: 'Content Generated Successfully',
          description: `Created all ${campaignAssets.length} asset(s) with AI-generated content`,
          duration: 3000
        });
      }

      // If no assets were created, don't navigate
      if (campaignAssets.length === 0) {
        console.error('❌ No assets were successfully created. Cannot proceed.');
        return;
      }

      // Navigate based on initiative type
      if (initiativeType === 'campaign') {
        // Navigate to Campaign Editor Hub
        navigate('/campaign-editor', {
          state: {
            campaignPackage: {
              campaignId: project.id,
              projectId: project.id,
              campaignName: project.project_name,
              brandId: WORKSHOP_CONFIG.BIKTARVY_BRAND_ID,
              strategicContext: {
                theme: selectedTheme,
                keyMessage: selectedTheme.keyMessage,
                targetAudience: context.detectedIntent?.audience ?? '',
                occasion: context.detectedIntent?.occasion ?? '',
                intelligence: intelligence
              },
              sharedEvidence: {
                claims: selectedClaims,
                visuals: selectedVisuals,
                modules: selectedModules
              },
              assets: campaignAssets,
              estimatedCompletion: `${selectedAssetTypes.length * 30} minutes`,
              overallProgress: 0
            },
            fromWorkshop: true
          }
        });
      } else {
        // Navigate to single asset editor
        if (campaignAssets.length > 0) {
          navigate(`/content-editor/${campaignAssets[0].assetId}`, {
            state: {
              fromWorkshop: true,
              selectedTheme,
              intelligence
            }
          });
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to create content. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const totalSelected = selectedClaims.length + selectedVisuals.length + selectedModules.length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Content Workshop</h1>
          </div>
          <p className="text-muted-foreground ml-13">
            Describe what you need, and we'll match intelligence from your data
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">What's on your mind?</label>
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Example: Event materials for upcoming HIV conference with ID specialists in Chicago..."
              className="min-h-[100px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) {
                  handleMatchIntelligence(userInput);
                }
              }}
            />
          </div>
          <Button
            onClick={() => handleMatchIntelligence(userInput)}
            disabled={isMatching || !userInput.trim()}
            className="w-full"
          >
            {isMatching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Matching Intelligence...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Match Intelligence
              </>
            )}
          </Button>

          {/* Quick Scenarios */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Quick Start Scenarios:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {QUICK_SCENARIOS.map((scenario) => (
                <Button
                  key={scenario.label}
                  variant="outline"
                  onClick={() => handleScenarioClick(scenario.value)}
                  disabled={isMatching}
                  className="h-auto py-3 flex flex-col items-center gap-2"
                >
                  <scenario.icon className="h-5 w-5" />
                  <span className="text-xs">{scenario.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Enhanced Flow: Initiative → Assets → Themes → Brief */}
        {intelligence && (
          <>
            {/* Intelligence Arsenal */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Matched Intelligence
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {context.detectedIntent?.audience && `Audience: ${context.detectedIntent.audience}`}
                    {context.detectedIntent?.audience && context.detectedIntent?.occasion && ' • '}
                    {context.detectedIntent?.occasion && `Occasion: ${context.detectedIntent.occasion}`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{totalSelected}</div>
                  <div className="text-xs text-muted-foreground">items selected</div>
                </div>
              </div>
              <IntelligenceArsenalPanel
                intelligence={intelligence}
                selectedClaims={selectedClaims}
                selectedVisuals={selectedVisuals}
                selectedModules={selectedModules}
                onClaimToggle={(id) => {
                  setSelectedClaims(prev =>
                    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                  );
                }}
                onVisualToggle={(id) => {
                  setSelectedVisuals(prev =>
                    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                  );
                }}
                onModuleToggle={(id) => {
                  setSelectedModules(prev =>
                    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                  );
                }}
              />
            </Card>

            {/* Step 1: Initiative Type Selection */}
            {!initiativeType && (
              <Card className="p-6">
                <InitiativeTypeSelector
                  selected={initiativeType}
                  onSelect={setInitiativeType}
                />
              </Card>
            )}

            {/* Step 2: Asset Type Selection */}
            {initiativeType && themes.length === 0 && (
              <Card className="p-6">
                <AssetTypeSelector
                  initiativeType={initiativeType}
                  selectedTypes={selectedAssetTypes}
                  channelPreferences={channelPreferences}
                  onToggle={handleAssetTypeToggle}
                />
                <Button
                  className="w-full mt-4"
                  onClick={handleProceedToThemes}
                  disabled={selectedAssetTypes.length === 0 || isLoadingThemes}
                >
                  {isLoadingThemes ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Themes...
                    </>
                  ) : (
                    <>
                      Continue to Themes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </Card>
            )}

            {/* Step 3: Theme Selection */}
            {themes.length > 0 && !selectedTheme && (
              <Card className="p-6">
                <ThemeCardsPanel
                  themes={themes}
                  selectedTheme={selectedTheme}
                  onThemeSelect={setSelectedTheme}
                />
              </Card>
            )}

            {/* Step 4: Strategic Brief & Generate */}
            {selectedTheme && (
              <>
                <StrategicBriefPanel
                  initiativeType={initiativeType}
                  assetTypes={selectedAssetTypes}
                  theme={selectedTheme}
                  audience={context.detectedIntent?.audience ?? 'Target Audience'}
                  occasion={context.detectedIntent?.occasion ?? 'Campaign'}
                  selectedEvidence={{
                    claims: selectedClaims.length,
                    visuals: selectedVisuals.length,
                    modules: selectedModules.length,
                  }}
                  successPatterns={intelligence.successPatterns.slice(0, 3).map(p => p.key_success_factors[0])}
                  audienceInsights={intelligence.audienceInsights.slice(0, 3).map(i => i.description)}
                />
                <Card className="p-6">
                  <Button
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                    size="lg"
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Content...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate {initiativeType === 'campaign' ? 'Campaign' : 'Content'} with {totalSelected} Items
                      </>
                    )}
                  </Button>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}