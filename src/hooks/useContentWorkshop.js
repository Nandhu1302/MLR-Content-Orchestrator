// ============================================
// Content Workshop State Management Hook
// Centralized state and handlers for Content Workshop
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Type imports are removed in the JavaScript version
import { WORKSHOP_CONFIG } from '@/config/workshop';
import { StoryIntelligenceMatchingService } from '@/services/intelligence';
import { supabase } from '@/integrations/supabase/client';
import { getAssetTypesForActivities } from '@/config/activityAssetMappings';
import { useGlobalContext } from '@/contexts/GlobalContext';

// Helper: Map StoryAnalysis to DetectedIntent (PRIMARY SOURCE)
// Type annotations removed
const mapStoryAnalysisToIntent = (analysis) => {
  if (!analysis) return { confidence: 0.5 };
  
  return {
    // Occasion
    occasion: analysis.occasion?.type,
    eventName: analysis.occasion?.name,
    confidence: analysis.occasion?.confidence || 0.8,
    
    // Audience - Extract primary type AND detect KOL seniority
    audience: analysis.audience?.primaryType,
    audienceSpecialties: analysis.audience?.segments,
    audienceSeniority: analysis.audience?.seniority || 
      (analysis.audience?.segments?.some(s => 
        s.toLowerCase().includes('specialist') || 
        s.toLowerCase().includes('kol') ||
        s.toLowerCase().includes('key opinion')
      ) ? 'kol' : undefined),
    
    // Activities
    activities: analysis.activities?.identified,
    assetTypes: deriveAssetTypesFromActivities(analysis.activities?.identified),
    
    // Region
    region: analysis.region?.identified,
    
    // Goals
    goals: analysis.goals?.primary 
      ? [analysis.goals.primary, ...(analysis.goals.secondary || [])]
      : undefined,
    
    // Timeline
    urgency: analysis.timeline?.urgency, // Removed 'as any'
    timeline: analysis.timeline?.dateContext
  };
};

// Helper: Flatten nested edge function response to client-side DetectedIntent format
// Type annotations removed
const flattenExtractedIntent = (extracted) => {
  if (!extracted) return { confidence: 0.5 };
  
  return {
    // Direct fields
    occasion: extracted.occasion,
    confidence: extracted.confidence || 0.8,
    
    // Flatten eventDetails
    eventName: extracted.eventDetails?.eventName,
    eventType: extracted.eventDetails?.eventType,
    region: extracted.eventDetails?.region,
    duration: extracted.eventDetails?.duration,
    activities: extracted.eventDetails?.activities,
    
    // Flatten audience
    audience: extracted.audience?.primaryType,
    audienceSpecialties: extracted.audience?.specialties,
    audienceSeniority: extracted.audience?.seniority,
    
    // Direct fields
    therapeuticArea: extracted.therapeuticArea,
    brandMention: extracted.brandMention,
    goals: extracted.goals,
    timeline: extracted.timeline,
    urgency: extracted.urgency,
    
    // Map suggestedAssets to assetTypes or derive from activities
    assetTypes: extracted.suggestedAssets || 
      deriveAssetTypesFromActivities(extracted.eventDetails?.activities),
    channels: extracted.channels
  };
};

// Helper: Derive asset types from activities
// Type annotations removed
const deriveAssetTypesFromActivities = (activities) => {
  if (!activities?.length) return undefined;
  
  const assetMap = {
    booth: ['sales-aid', 'leave-behind'],
    podium: ['presentation-slides', 'speaker-deck'],
    workshop: ['training-materials', 'handouts'],
    networking: ['email', 'follow-up']
  };
  
  return activities.flatMap(a => assetMap[a.toLowerCase()] || []);
};

export const useContentWorkshop = () => {
  const navigate = useNavigate();
  const { state: globalState } = useGlobalContext();
  
  // State (Types inferred or set by initial values)
  const [context, setContext] = useState({ userStory: '' });
  const [intelligence, setIntelligence] = useState(null);
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [selectedVisuals, setSelectedVisuals] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [showConsultant, setShowConsultant] = useState(false);
  const [showBrief, setShowBrief] = useState(false);
  const [isLoadingIntelligence, setIsLoadingIntelligence] = useState(false);
  const [aiEnhancedBrief, setAiEnhancedBrief] = useState(null);
  
  // Multi-Mode State
  const [currentMode, setCurrentMode] = useState('discovery');
  const [isSpecifiedTheme, setIsSpecifiedTheme] = useState(false);
  const [explorationOpportunities, setExplorationOpportunities] = useState([]);
  
  // Multi-Agent State
  const [storyAnalysis, setStoryAnalysis] = useState(null);
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [assetPackages, setAssetPackages] = useState([]);
  const [isGeneratingThemes, setIsGeneratingThemes] = useState(false);
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
  
  // Extended Intelligence State
  const [hcpTargeting, setHcpTargeting] = useState(null);
  const [marketContext, setMarketContext] = useState(null);
  const [audienceInsights, setAudienceInsights] = useState(null);
  const [campaignCoordination, setCampaignCoordination] = useState(null);
  const [crossChannelInsights, setCrossChannelInsights] = useState(null);
  const [performancePrediction, setPerformancePrediction] = useState(null);
  
  // Step Management
  const [currentStep, setCurrentStep] = useState(1);
  const brandId = WORKSHOP_CONFIG.BIKTARVY_BRAND_ID;

  // Handlers - Theme Specification Mode
  const handleThemeSpecification = async (themeName, contextInfo) => {
    setIsLoadingIntelligence(true);
    setIsSpecifiedTheme(true);
    setCurrentMode('specification');
    
    try {
      console.log('🎨 Calling theme-specifier for:', themeName);
      const { data, error } = await supabase.functions.invoke('theme-specifier', {
        body: {
          themeName,
          targetAudience: contextInfo?.audience,
          channels: contextInfo?.channels,
          brandId: WORKSHOP_CONFIG.BIKTARVY_BRAND_ID
        }
      });
      
      if (error) throw error;
      
      console.log('✅ Theme enriched:', data.theme);
      setThemes([data.theme]);
      setSelectedTheme(data.theme);
      
      // Auto-select evidence from enriched theme
      setSelectedClaims(data.theme.claims.map((c) => c.id));
      setSelectedVisuals(data.theme.visuals.map((v) => v.id));
      
    } catch (error) {
      console.error('❌ Theme specification error:', error);
      // Use custom modal or state update instead of alert
      console.error('Failed to enrich theme. Please try again.'); 
    } finally {
      setIsLoadingIntelligence(false);
    }
  };

  // Handler - Mode Switch
  const handleModeSwitch = (newMode) => {
    setCurrentMode(newMode);
    console.log('🔄 Mode switched to:', newMode);
  };
  
  // Type annotations removed from parameters
  const handleStorySubmit = async (story, mode) => {
    setIsLoadingIntelligence(true);
    setShowConsultant(true);
    setContext({ userStory: story });
    
    // Handle exploration mode - fetch opportunities first
    if (mode === 'exploration') {
      setCurrentMode('exploration');
      
      try {
        const { ProactiveIntelligenceService } = await import('@/services/proactiveIntelligenceService');
        const opportunities = await ProactiveIntelligenceService.getCurrentOpportunities(
          WORKSHOP_CONFIG.BIKTARVY_BRAND_ID
        );
        
        setExplorationOpportunities(opportunities);
        console.log('🔍 Exploration opportunities loaded:', opportunities.length);
        setIsLoadingIntelligence(false);
        return;
      } catch (error) {
        console.error('Failed to load opportunities:', error);
        setIsLoadingIntelligence(false);
        return;
      }
    }
    
    // Set current mode
    if (mode) {
      setCurrentMode(mode);
    }
    
    try {
      // PHASE 1: ONLY run Story Analyst for initial analysis
      console.log('🔍 Calling Story Analyst...');
      const { data: analysisResult, error: analysisError } = await supabase.functions.invoke('story-analyst', {
        body: { 
          story, 
          brandId: WORKSHOP_CONFIG.BIKTARVY_BRAND_ID 
        }
      });
      
      if (analysisError) throw analysisError;
      
      setStoryAnalysis(analysisResult.analysis);
      console.log('📊 Story Analysis Complete:', analysisResult.analysis);
      
      // IMMEDIATELY map story-analyst result to detectedIntent (PRIMARY SOURCE)
      const intentFromAnalysis = mapStoryAnalysisToIntent(analysisResult.analysis);
      console.log('🎯 Mapped to detectedIntent:', intentFromAnalysis);
      
      setContext(prev => ({
        ...prev,
        detectedIntent: intentFromAnalysis
      }));
      
      // Check if story-analyst flagged this as invalid request
      if (analysisResult.analysis?.isValidRequest === false) {
        console.log('⚠️ Invalid request detected by story-analyst - showing clarification');
        
        // Set clarification state directly without calling story-consultant
        setContext(prev => ({
          ...prev,
          detectedIntent: {
            confidence: 0,
            needsClarification: true
          },
          initialGreeting: `I'm not quite sure what you're looking for. To help you create effective Biktarvy content, could you tell me more about:

**What's the occasion?** (e.g., upcoming conference, competitive response, patient education campaign)

**Who's your audience?** (e.g., HIV specialists, patients, caregivers)

**What do you want to achieve?** (e.g., drive awareness, support prescribing, educate)

Feel free to describe your situation in your own words!`,
          initialQuickReplies: [
            { label: '🎪 Plan for an Event', value: 'I have an upcoming event' },
            { label: '📧 Create Campaign', value: 'I want to create a marketing campaign' },
            { label: '📚 Patient Education', value: 'I need patient education materials' },
            { label: '⚔️ Competitive Response', value: 'I need to respond to competitor activity' }
          ]
        }));
        
        // Skip story-consultant call entirely
        setIsLoadingIntelligence(false);
        return;
      }
      
      // Only proceed with story-consultant if request is valid
      // Pass the already-extracted intent from story-analyst
      const { data: consultantResult } = await supabase.functions.invoke('story-consultant', {
        body: {
          userMessage: story,
          conversationHistory: [],
          context: { 
            userStory: story, 
            brandId: WORKSHOP_CONFIG.BIKTARVY_BRAND_ID,
            detectedIntent: intentFromAnalysis  // Pass story-analyst data!
          },
          isInitialAnalysis: true
        }
      });
      
      console.log('📨 Story Consultant received detectedIntent:', intentFromAnalysis);
      
      // Consultant enriches (doesn't replace) - merge while preserving story-analyst data
      if (consultantResult?.extractedIntent) {
        const flattenedIntent = flattenExtractedIntent(consultantResult.extractedIntent);
        setContext(prev => ({
          ...prev,
          // MERGE - story-analyst values take precedence, consultant fills gaps
          detectedIntent: {
            ...flattenedIntent,
            ...prev.detectedIntent  // Keep story-analyst data (KOL, Midwest, booth, etc.)
          },
          initialGreeting: consultantResult.message,
          initialQuickReplies: consultantResult.quickReplies
        }));
      }
      
    } catch (error) {
      console.error('❌ Story analysis error:', error);
      setStoryAnalysis(null);
      // Use custom modal or state update instead of alert
      console.error('Failed to analyze story. Please try again.');
    } finally {
      setIsLoadingIntelligence(false);
    }
  };

  // NEW: Handle confirmed context from AI consultation
  const handleContextConfirmed = async () => {
    if (!storyAnalysis) return;
    
    setIsLoadingIntelligence(true);
    setIsGeneratingThemes(true);
    
    try {
      // NOW run Intelligence Curator and Theme Architect
      console.log('🎯 Calling Intelligence Curator...');
      const { data: intelligenceResult, error: intelligenceError } = await supabase.functions.invoke('intelligence-curator', {
        body: { 
          analysis: storyAnalysis,
          brandId: WORKSHOP_CONFIG.BIKTARVY_BRAND_ID 
        }
      });
      
      if (intelligenceError) throw intelligenceError;
      
      console.log('✅ Intelligence Curated:', intelligenceResult);
      
      // Map curated intelligence to existing format (Removed type casting)
      const mappedIntelligence = {
        claims: intelligenceResult.intelligence.claims.map((c) => ({
          id: c.id,
          claim_text: c.claim_text,
          claim_type: c.claim_type || 'efficacy',
          relevance_score: c.relevance_score,
          mlr_approved: true,
          target_audiences: []
        })),
        visuals: intelligenceResult.intelligence.visuals.map((v) => ({
          id: v.id,
          asset_name: v.asset_name,
          asset_type: v.asset_type || 'chart',
          relevance_score: v.relevance_score,
          mlr_approved: true,
          storage_path: null
        })),
        modules: intelligenceResult.intelligence.modules.map((m) => ({
          id: m.id,
          module_text: m.module_name || m.module_text,
          module_type: m.module_type || 'clinical',
          relevance_score: m.relevance_score,
          mlr_approved: true
        })),
        successPatterns: intelligenceResult.intelligence.patterns?.map((p) => ({
          id: p.id,
          campaign_type: p.pattern_name,
          success_rate: p.avg_performance_lift,
          avg_engagement_rate: p.relevance_score * 100,
          sample_size: 50,
          key_success_factors: [p.pattern_description]
        })) || [],
        audienceInsights: intelligenceResult.intelligence.audienceInsights ? [{
          type: intelligenceResult.intelligence.audienceInsights.segmentName,
          metric: 'decision_factors',
          value: 85,
          source: 'audience_segments',
          description: intelligenceResult.intelligence.audienceInsights.decisionFactors?.join(', ') || ''
        }] : [],
        channelIntelligence: [],
        competitiveIntelligence: intelligenceResult.intelligence.competitiveContext?.map((c) => ({
          competitor_name: c.competitor_name,
          intelligence_type: 'positioning',
          threat_level: c.threat_level,
          content: c.insight,
          counter_messaging: [],
          discovered_at: new Date().toISOString()
        })) || [],
        crossChannelJourneys: [],
        performancePrediction: null,
        marketIntelligence: intelligenceResult.intelligence.marketContext ? {
          rx_growth_rate: intelligenceResult.intelligence.marketContext.rxGrowthRate,
          market_share_trend: 'growing',
          primary_competitor: intelligenceResult.intelligence.marketContext.primaryCompetitor,
          top_decile_hcp_count: intelligenceResult.intelligence.hcpTargeting?.targetHcpCount || 0,
          regional_insights: [intelligenceResult.intelligence.marketContext.topPerformingRegion]
        } : null,
        overallConfidence: 0.85,
        dataSourcesUsed: ['clinical_claims', 'visual_assets', 'content_modules', 'success_patterns', 'hcp_targeting', 'market_analytics']
      };
      
      // Store extended intelligence
      setHcpTargeting(intelligenceResult.intelligence.hcpTargeting || null);
      setMarketContext(intelligenceResult.intelligence.marketContext || null);
      setAudienceInsights(intelligenceResult.intelligence.audienceInsights || null);
      setCampaignCoordination(intelligenceResult.intelligence.campaignCoordination || null);
      setCrossChannelInsights(intelligenceResult.intelligence.crossChannelInsights || null);
      setPerformancePrediction(intelligenceResult.intelligence.performancePrediction || null);
      
      setIntelligence(mappedIntelligence);
      
      // Auto-select top items
      setSelectedClaims(intelligenceResult.intelligence.claims.slice(0, 3).map((c) => c.id));
      setSelectedVisuals(intelligenceResult.intelligence.visuals.slice(0, 2).map((v) => v.id));
      setSelectedModules(intelligenceResult.intelligence.modules.slice(0, 2).map((m) => m.id));
      
      // Generate themes
      console.log('🎨 Calling Theme Architect...');
      const { data: themeResult, error: themeError } = await supabase.functions.invoke('theme-architect', {
        body: { 
          analysis: storyAnalysis,
          intelligence: intelligenceResult.intelligence 
        }
      });
      
      if (themeError) throw themeError;
      
      setThemes(themeResult.themes);
      console.log('✅ Themes Generated:', themeResult.themes);
      
    } catch (error) {
      console.error('❌ Theme generation error:', error);
      setThemes([]);
      // Use custom modal or state update instead of alert
      console.error('Failed to generate themes. Please try again.');
    } finally {
      setIsLoadingIntelligence(false);
      setIsGeneratingThemes(false);
    }
  };

  const handleThemeSelect = async (theme) => { // Type annotation removed
    setSelectedTheme(theme);
    setIsGeneratingAssets(true);
    
    try {
      // AGENT 4: Asset Orchestrator - Package theme into asset structures
      console.log('📦 Calling Asset Orchestrator...');
      
      const assetTypes = storyAnalysis?.activities.identified 
        ? getAssetTypesForActivities(storyAnalysis.activities.identified)
        : ['email', 'presentation', 'leave-behind'];
      
      const { data: assetResult, error: assetError } = await supabase.functions.invoke('asset-orchestrator', {
        body: { 
          selectedTheme: theme,
          assetTypes,
          analysis: storyAnalysis,
          intelligence // intelligence is available in scope
        }
      });
      
      if (assetError) throw assetError;
      
      setAssetPackages(assetResult.packages);
      console.log('✅ Asset Packages Created:', assetResult.packages);
      
    } catch (error) {
      console.error('❌ Asset orchestration error:', error);
      setAssetPackages([]);
      // Use custom modal or state update instead of alert
      console.error('Failed to create asset packages. Please try again.');
    } finally {
      setIsGeneratingAssets(false);
    }
  };

  const handleGenerateAssets = (selectedPackages) => { // Type annotation removed
    const packagesToGenerate = selectedPackages || assetPackages;
    
    if (packagesToGenerate.length === 0) {
      console.warn('No asset packages to generate');
      return;
    }
    
    // Navigate to content editor with first asset package and full context
    const firstPackage = packagesToGenerate[0];
    console.log('🚀 Navigating to content editor with package:', firstPackage);
    
    navigate('/content-editor', {
      state: {
        assetPackage: firstPackage,
        allPackages: packagesToGenerate,
        selectedTheme,
        storyAnalysis,
        intelligence,
        hcpTargeting,
        marketContext,
        audienceInsights,
        campaignCoordination,
        prePopulated: true
      }
    });
  };

  const handleScenarioSelect = (scenario) => { // Type annotation removed
    setContext({
      userStory: scenario.description,
      detectedIntent: {
        occasion: scenario.occasion,
        eventName: scenario.eventName,
        audience: scenario.audience,
        goals: scenario.goals,
        channels: scenario.channels,
      }
    });
    setShowConsultant(true);
  };

  const handleContextUpdate = async (updatedContext) => { // Type annotation removed
    setContext(updatedContext);
    
    // Show consultant when context is updated with story
    if (updatedContext.userStory) {
      setShowConsultant(true);
    }

    // Real-time intelligence matching
    if (updatedContext.detectedIntent) {
      setIsLoadingIntelligence(true);
      try {
        const matchedIntelligence = await StoryIntelligenceMatchingService.matchIntelligenceToStory(
          updatedContext,
          WORKSHOP_CONFIG.BIKTARVY_BRAND_ID
        );
        setIntelligence(matchedIntelligence);

        // Auto-select top intelligence items
        if (matchedIntelligence.claims.length > 0) {
          const topClaims = matchedIntelligence.claims
            .slice(0, WORKSHOP_CONFIG.AUTO_SELECT_TOP_CLAIMS)
            .map(c => c.id);
          setSelectedClaims(topClaims);
        }

        if (matchedIntelligence.visuals.length > 0) {
          const topVisuals = matchedIntelligence.visuals
            .slice(0, WORKSHOP_CONFIG.AUTO_SELECT_TOP_VISUALS)
            .map(v => v.id);
          setSelectedVisuals(topVisuals);
        }

        if (matchedIntelligence.modules.length > 0) {
          const topModules = matchedIntelligence.modules
            .slice(0, WORKSHOP_CONFIG.AUTO_SELECT_TOP_MODULES)
            .map(m => m.id);
          setSelectedModules(topModules);
        }
      } catch (error) {
        console.error('Error matching intelligence:', error);
      } finally {
        setIsLoadingIntelligence(false);
      }
    }
  };

  const handleBriefConfirmation = (brief) => { // Type annotation removed
    setAiEnhancedBrief(brief);
    setShowBrief(true);
  };

  const handleClaimToggle = (claimId) => { // Type annotation removed
    setSelectedClaims(prev =>
      prev.includes(claimId)
        ? prev.filter(id => id !== claimId)
        : [...prev, claimId]
    );
  };

  const handleVisualToggle = (visualId) => { // Type annotation removed
    setSelectedVisuals(prev =>
      prev.includes(visualId)
        ? prev.filter(id => id !== visualId)
        : [...prev, visualId]
    );
  };

  const handleModuleToggle = (moduleId) => { // Type annotation removed
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleReset = () => {
    setContext({ userStory: '' });
    setIntelligence(null);
    setSelectedClaims([]);
    setSelectedVisuals([]);
    setSelectedModules([]);
    setShowConsultant(false);
    setShowBrief(false);
    setAiEnhancedBrief(null);
    setStoryAnalysis(null);
    setThemes([]);
    setSelectedTheme(null);
    setAssetPackages([]);
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  // Step Navigation
  const handleStepChange = (step) => { // Type annotation removed
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Determine if can proceed based on current step requirements
  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: // Story Input
        return (context?.userStory?.length || 0) > 10;
      case 2: // Analysis Review
        return !!storyAnalysis;
      case 3: // Theme Selection
        return !!selectedTheme;
      case 4: // Asset Preview
        return (assetPackages?.length || 0) > 0;
      case 5: // Generate
        return true;
      default:
        return false;
    }
  };

  return {
    // State
    context,
    intelligence,
    selectedClaims,
    selectedVisuals,
    selectedModules,
    showConsultant,
    showBrief,
    isLoadingIntelligence,
    aiEnhancedBrief,
    
    // Multi-Mode State
    currentMode,
    isSpecifiedTheme,
    
    // Multi-Agent State
    storyAnalysis,
    themes,
    selectedTheme,
    assetPackages,
    isGeneratingThemes,
    isGeneratingAssets,
    
    // Extended Intelligence State
    hcpTargeting,
    marketContext,
    audienceInsights,
    campaignCoordination,
    crossChannelInsights,
    performancePrediction,
    
    // Step Management
    currentStep,
    canProceedToNext: canProceedToNext(),
    
    // Actions
    handleStorySubmit,
    handleContextConfirmed, // NEW
    handleThemeSpecification,
    handleModeSwitch,
    explorationOpportunities,
    handleScenarioSelect,
    handleContextUpdate,
    handleBriefConfirmation,
    handleClaimToggle,
    handleVisualToggle,
    handleModuleToggle,
    handleReset,
    handleBackToDashboard,
    handleThemeSelect,
    handleGenerateAssets,
    handleStepChange,
    handleNextStep,
    handlePreviousStep,
    
    // Config
    brandId
  };
};