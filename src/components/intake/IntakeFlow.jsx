import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { useAuth } from '@/contexts/AuthContext';
import { IntelligenceProvider } from '@/contexts/IntelligenceContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import UniversalIntakeCard from './UniversalIntakeCard';
import CampaignDashboard from '../workspace/CampaignDashboard';
import ThemeGenerationHub from './ThemeGenerationHub';
import GuardrailsIntegration from './GuardrailsIntegration';
// Type imports removed
// import { IntakeData, AssetData, CampaignData, GeneratedTheme, IntakeTemplate } from '@/types/intake';
import { mockAssets, mockCampaigns } from '@/data/intakeSimulation';
import { userProfiles } from '@/data/simulation';
import { useAutoSave } from '@/hooks/useAutoSave';
// Type import removed
// import { DraftStorageManager, DraftData } from '@/utils/draftStorage';
import { DraftStorageManager } from '@/utils/draftStorage';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { ContentService } from '@/services/contentService';
import { ThemeService } from '@/services/themeService';
import { toast } from '@/hooks/use-toast';
import { ThemeContentInitializer } from '@/services/themeContentInitializer';
import { AssetTypeContentFormatter } from '@/services/assetTypeContentFormatter';

// Type definitions removed

// Interface and type annotations removed
const IntakeFlow = ({ 
  onClose, 
  initialState, 
  templateUsed = false,
  templateData,
  preFilledData,
  startAtStep
}) => {
  const [searchParams] = useSearchParams();
  const resumeDraftId = searchParams.get('resume');
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedBrand } = useBrand();
  const { user } = useAuth();
  const { state: globalState, actions: globalActions } = useGlobalContext();
  
  // Check for pre-selected theme from workshop
  const preselectedTheme = location.state?.preselectedTheme;
  const preselectedThemeId = location.state?.themeId;
  const fromWorkshop = location.state?.fromWorkshop;
  
  const [flowState, setFlowState] = useState(
    initialState || { type: 'intake', data: preFilledData }
  );
  const [sessionId, setSessionId] = useState('');
  // Initialize step from startAtStep prop (for opportunity flow) or default to 0
  const [currentStep, setCurrentStep] = useState(startAtStep ?? 0);
  const currentUser = userProfiles.user1;

  // Generate session ID for auto-save
  useEffect(() => {
    if (!sessionId) {
      setSessionId(crypto.randomUUID());
    }
  }, [sessionId]);

  // Resume draft functionality - Enhanced to handle all flow states
  useEffect(() => {
    if (resumeDraftId && sessionId) {
      const draft = DraftStorageManager.loadDraft(resumeDraftId);
      if (draft) {
        const flowState = draft.flowState || 'intake';
        
        switch (flowState) {
          case 'intake':
            setFlowState({ 
              type: 'intake', 
              data: draft.data 
            });
            setCurrentStep(draft.currentStep || 0);
            break;
            
          case 'theme-generation':
            if (draft.data.projectName) { // Ensure we have complete intake data
              // Type assertion removed
              setFlowState({ 
                type: 'theme-generation', 
                intakeData: draft.data 
              });
            } else {
              setFlowState({ type: 'intake', data: draft.data });
            }
            break;
            
          case 'single-asset':
            if (draft.assetData) {
              setFlowState({ 
                type: 'single-asset', 
                assetData: draft.assetData,
                selectedTheme: draft.selectedTheme 
              });
            } else {
              setFlowState({ type: 'intake', data: draft.data });
            }
            break;
            
          case 'campaign':
            if (draft.campaignData) {
              setFlowState({ 
                type: 'campaign', 
                campaignData: draft.campaignData,
                selectedTheme: draft.selectedTheme 
              });
            } else {
              setFlowState({ type: 'intake', data: draft.data });
            }
            break;
            
          default:
            setFlowState({ type: 'intake', data: draft.data });
        }
        
        toast({
          title: "Draft restored",
          description: `Resumed working on "${draft.data.projectName || 'Untitled Project'}" from ${flowState} stage`,
        });
      }
    }
  }, [resumeDraftId, sessionId]);
  
  // Handle pre-selected theme from workshop
  useEffect(() => {
    if (preselectedTheme && preselectedThemeId && fromWorkshop && flowState.type === 'intake' && selectedBrand && user) {
      console.log('Pre-selected theme detected from workshop, skipping to asset creation...');
      
      // Populate intake data from theme
      const intakeData = {
        projectName: preselectedTheme.original_project_name || `Content from ${preselectedTheme.name}`,
        indication: preselectedTheme.indication || '',
        primaryAudience: preselectedTheme.audience_segments?.[0] || '',
        audienceSegment: preselectedTheme.audience_segments || [],
        brand: selectedBrand.brand_name,
        targetMarkets: preselectedTheme.target_markets || [],
        selectedAssetTypes: preselectedTheme.recommended_assets || ['Email'],
        initiativeType: 'campaign',
        keyMessage: preselectedTheme.key_message || '',
        callToAction: preselectedTheme.call_to_action || '',
        primaryObjective: 'awareness',
      };

      // Skip directly to theme selection and asset creation
      handleThemeSelect(preselectedTheme);
    }
  }, [preselectedTheme, preselectedThemeId, fromWorkshop, flowState.type, selectedBrand, user]);

  // Auto-save integration
  // Type annotation removed
  const getCurrentFormData = () => {
    if (flowState.type === 'intake') {
      return flowState.data || {};
    }
    return {};
  };

  const { forceSave } = useAutoSave({
    key: sessionId,
    data: getCurrentFormData(),
    // Type annotation removed
    onSave: (data) => {
      if (Object.keys(data).length > 0) {
        handleSaveDraft(data, currentStep);
      }
    },
    interval: 30000 // Auto-save every 30 seconds
  });

  // Type annotation removed
  const handleSaveDraft = (data, step) => {
    if (!sessionId) return;
    
    const progress = calculateIntakeProgress(data, step);
    
    // Type assertion removed
    const draftData = {
      data,
      timestamp: new Date().toISOString(),
      sessionId,
      version: '1.0',
      currentStep: step,
      flowState: 'intake',
      contentProgress: progress
    };
    
    DraftStorageManager.saveDraft(sessionId, draftData);
  };

  // Type annotation removed
  const calculateIntakeProgress = (data, step) => {
    const fields = [
      'projectName',
      'indication', 
      'primaryAudience',
      'targetMarkets',
      'selectedAssetTypes',
      'primaryObjective',
      'keyMessage'
    ];

    const filledFields = fields.filter(field => {
      // Type assertion removed
      const value = data[field];
      return value !== undefined && value !== null && value !== '';
    }).length;

    const formProgress = (filledFields / fields.length) * 80; // 80% for form completion
    const stepProgress = (step / 4) * 20; // 20% for step progression
    
    return Math.min(Math.round(formProgress + stepProgress), 100);
  };

  // Type annotation removed
  const handleStepChange = (step) => {
    setCurrentStep(step);
    if (flowState.type === 'intake' && flowState.data) {
      handleSaveDraft(flowState.data, step);
    }
  };

  // Type annotation removed
  const handleIntakeComplete = (intakeData) => {
    // Save completed intake data to both local storage and global context
    handleSaveDraft(intakeData, 4);
    
    // Persist intake data to global context for cross-module access
    globalActions.updateModuleData('intake', {
      data: intakeData,
      timestamp: new Date().toISOString(),
      completedAt: new Date().toISOString()
    });
    
    globalActions.updateUserSelections({
      projectName: intakeData.projectName,
      indication: intakeData.indication,
      audience: intakeData.primaryAudience,
      markets: intakeData.targetMarkets,
      assetTypes: intakeData.selectedAssetTypes,
      objectives: intakeData.primaryObjective,
      keyMessage: intakeData.keyMessage
    });
    
    setFlowState({ type: 'theme-generation', intakeData });
  };

  // Type annotation removed
  const handleThemeSelect = async (theme) => {
    // Type assertion removed
    const intakeData = flowState.intakeData;
    
    // Validate intakeData exists and has required fields
    if (!intakeData || !intakeData.projectName) {
      console.error('❌ handleThemeSelect: Invalid intakeData', { intakeData });
      toast({
        title: "Missing Project Information",
        description: "Please complete the intake form before selecting a theme",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedBrand || !user) {
      console.error('❌ handleThemeSelect: Missing brand or user', { selectedBrand, user });
      toast({
        title: "Authentication Error",
        description: "Please ensure you're logged in and have selected a brand",
        variant: "destructive"
      });
      return;
    }
    
    console.log('✅ handleThemeSelect: Starting with valid data', {
      projectName: intakeData.projectName,
      brandId: selectedBrand.id,
      userId: user.id,
      themeId: theme.id
    });

    // Verify authentication session before proceeding
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser.user) {
        toast({
          title: "Session Expired",
          description: "Please refresh the page and log in again",
          variant: "destructive"
        });
        return;
      }
    } catch (error) {
      console.error('Session verification failed:', error);
      toast({
        title: "Connection Error", 
        description: "Unable to verify authentication. Please try again.",
        variant: "destructive"
      });
      return;
    }

    try {
      // First, persist the theme to database with explicit error handling
      console.log('✅ Persisting theme to database...');
      console.log('Theme data:', { id: theme.id, name: theme.name, keyMessage: theme.keyMessage?.substring(0, 50) });
      console.log('IntakeData:', { projectName: intakeData.projectName, initiativeType: intakeData.initiativeType });
      
      let persistedTheme;
      try {
        persistedTheme = await ThemeService.createThemeFromGenerated(
          theme, 
          selectedBrand.id,
          null, // Don't pass sessionId as source_intake_id since it's not a real intake record
          intakeData // Pass intake data for field mapping
        );
      } catch (themeError) {
        // Type assertion removed
        console.error('❌ Theme persistence failed:', themeError);
        toast({
          title: "Failed to Save Theme",
          description: themeError?.message || "Unable to save theme to database. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      if (!persistedTheme?.id) {
        console.error('❌ Theme persisted but no ID returned');
        toast({
          title: "Theme Save Error",
          description: "Theme was not saved correctly. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ Theme persisted successfully:', persistedTheme.id);
      
      // Initialize intelligence layers for the theme
      console.log('Initializing intelligence layers...');
      const { ThemeIntelligenceService } = await import('@/services/themeIntelligenceService');
      await ThemeIntelligenceService.initializeIntelligence(persistedTheme.id, selectedBrand.id);
      console.log('Intelligence layers initialized');
      
      // Check enrichment status and prompt user if needed
      if (!persistedTheme.enrichment_status || persistedTheme.enrichment_status === 'generated') {
        const { EnrichmentPromptDialog } = await import('@/components/strategy/EnrichmentPromptDialog');
        // Show enrichment dialog
        const shouldEnrich = await new Promise((resolve) => {
          const dialogRoot = document.createElement('div');
          document.body.appendChild(dialogRoot);
          
          const cleanup = () => {
            document.body.removeChild(dialogRoot);
          };
          
          // For now, skip dialog and just set flag - will be handled by UI integration
          // This is a placeholder for future dialog integration
          resolve(false); // Default to proceeding without enrichment
        });
        
        if (shouldEnrich) {
          navigate(`/strategy/theme/${persistedTheme.id}/enrich`);
          return;
        }
      }
      
      // Save theme selection to local storage and global context
      // Type assertion removed
      const draftData = {
        data: intakeData,
        timestamp: new Date().toISOString(),
        sessionId,
        version: '1.0',
        flowState: intakeData.initiativeType === 'single-asset' ? 'single-asset' : 'campaign',
        selectedTheme: theme,
        selectedThemeId: persistedTheme.id // Use persisted theme ID
      };
      DraftStorageManager.saveDraft(sessionId, draftData);
      
      // Persist selected theme to global context with persisted ID
      globalActions.updateModuleData('theme', {
        selectedTheme: theme,
        themeId: persistedTheme.id, // Use persisted theme ID
        persistedTheme: persistedTheme,
        timestamp: new Date().toISOString(),
        selectionReason: theme.rationale.primaryInsight
      });

      // Save to cross_module_context database table for reliable access
      try {
        await supabase
          .from('cross_module_context')
          .upsert({
            user_id: user.id,
            brand_id: selectedBrand.id,
            session_id: sessionId,
            context_type: 'initiative',
            // Type assertion removed
            context_data: {
              theme: {
                selectedTheme: JSON.parse(JSON.stringify(theme)),
                themeId: persistedTheme.id,
                persistedTheme: JSON.parse(JSON.stringify(persistedTheme))
              },
              intake: {
                data: JSON.parse(JSON.stringify(intakeData))
              }
            },
            // Type assertion removed
            selections: {
              theme_id: persistedTheme.id,
              project_name: intakeData.projectName,
              initiative_type: intakeData.initiativeType
            }
          }, {
            onConflict: 'user_id,brand_id,session_id,context_type',
            ignoreDuplicates: false
          });
        
        console.log('Cross-module context saved successfully');
      } catch (contextError) {
        console.warn('Failed to save cross-module context:', contextError);
      }

      if (intakeData.initiativeType === 'single-asset') {
        console.log('Creating single asset project...');
        
        // Create project first with enhanced error handling
        console.log('Creating single asset project with theme ID:', persistedTheme.id);
        
        const project = await ContentService.createProject({
          brand_id: selectedBrand.id,
          project_name: intakeData.projectName,
          project_type: 'single-asset',
          description: `Single asset project for ${intakeData.indication}`,
          status: 'in_progress',
          target_audience: {
            primary: intakeData.primaryAudience,
            audience_segments: intakeData.audienceSegment
          },
          therapeutic_area: intakeData.indication,
          indication: intakeData.indication,
          market: intakeData.targetMarkets,
          channels: intakeData.selectedAssetTypes,
          compliance_level: 'standard',
          theme_id: persistedTheme.id,
          project_metadata: {
            theme: theme,
            theme_id: persistedTheme.id,
            intake_data: intakeData,
            created_via_intake: true
          },
          created_by: user.id
        });

        // Validate asset type mapping before creation
        const intakeAssetType = intakeData.selectedAssetTypes[0];
        const mappedAssetType = ContentService.mapIntakeAssetTypeToDbType(intakeAssetType);
        
        console.log(`🎯 Asset type mapping: "${intakeAssetType}" → "${mappedAssetType}"`);
        
        if (mappedAssetType === 'web' && intakeAssetType.toLowerCase().includes('email')) {
          console.error(`⚠️ ASSET TYPE MISMATCH: Email type "${intakeAssetType}" incorrectly mapped to "web"`);
          toast({
            title: "Asset Type Error",
            description: `Email asset type "${intakeAssetType}" was not properly recognized. This may affect content generation.`,
            variant: "destructive"
          });
        }
        
        // Generate rich initial content using ThemeContentInitializer with context-aware PI filtering
        console.log('🎯 Initializing content from theme with intelligent PI filtering');
        
        // Build strategic context for PI evidence selection
        const strategicContext = {
          campaignObjective: intakeData.primaryObjective || 'clinical-education',
          keyMessage: theme.keyMessage || '',
          targetAudience: intakeData.primaryAudience || 'HCP',
          indication: intakeData.indication || '',
          assetType: mappedAssetType
        };

        // Fetch PI data from database (not from intake)
        const { data: piRecords, error: piError } = await supabase
          .from('brand_documents')
          .select('*')
          .eq('brand_id', selectedBrand.id)
          .eq('parsing_status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1);

        // Type assertion removed
        const fullPIData = piRecords?.[0]?.parsed_data || null;
        
        console.log('=== CONTENT INITIALIZATION DEBUG ===');
        console.log('📊 Full PI Data fetched from DB:', fullPIData ? 'Available' : 'Not available');
        console.log('🎯 Strategic Context:', strategicContext);
        console.log('🎨 Theme structure:', Object.keys(theme));
        console.log('📝 Intake data keys:', Object.keys(intakeData));

        // Use PI Evidence Selector to filter data based on context
        const { PIEvidenceSelector } = await import('@/services/PIEvidenceSelector');
        const filteredPIResult = PIEvidenceSelector.filterPIForContext(fullPIData, strategicContext);
        
        if (filteredPIResult) {
          console.log('✅ PI Evidence Selection:', {
            relevanceScore: filteredPIResult.relevanceScore,
            reasoning: filteredPIResult.reasoning,
            selectedSections: Object.keys(filteredPIResult.selectedSections),
            guidance: filteredPIResult.usageGuidance
          });
        } else {
          console.log('⚠️ No PI data filtered - will generate content without clinical evidence');
        }

        // Build enriched intake context with strategic data and PI filtering result
        const enrichedIntakeContext = {
          ...intakeData,
          original_key_message: theme.keyMessage,
          original_cta: theme.callToAction,
          indication: intakeData.indication,
          intake_objective: intakeData.primaryObjective,
          intake_audience: intakeData.primaryAudience,
          specialistType: intakeData.specialistType,
          specialistDisplayName: intakeData.specialistDisplayName,
          therapeuticArea: intakeData.therapeuticArea,
          strategicContext,
          piFilteringResult: filteredPIResult
        };

        console.log('💾 Creating asset with intake context:', {
          hasSpecialistType: !!enrichedIntakeContext.specialistType,
          specialistType: enrichedIntakeContext.specialistType,
          specialistDisplayName: enrichedIntakeContext.specialistDisplayName,
          therapeuticArea: enrichedIntakeContext.therapeuticArea,
          indication: enrichedIntakeContext.indication,
          primaryAudience: enrichedIntakeContext.intake_audience
        });
        
        console.log('💾 Enriched intake context prepared:', {
          hasStrategicContext: !!enrichedIntakeContext.strategicContext,
          hasPiFilteringResult: !!enrichedIntakeContext.piFilteringResult,
          piRelevanceScore: filteredPIResult?.relevanceScore
        });
        
        const initializedContent = await ThemeContentInitializer.initializeFromTheme(
          ContentService.mapIntakeAssetTypeToDbType(intakeData.selectedAssetTypes[0]),
          {
            theme_name: theme.name,
            core_message: theme.keyMessage,
            therapeutic_focus: theme.description,
            target_audience: intakeData.primaryAudience || 'HCP',
            key_benefits: theme.contentSuggestions?.keyPoints || [],
            clinical_positioning: theme.keyMessage,
            emotional_tone: 'professional',
            content_pillars: [],
            proof_points: theme.rationale?.supportingData || [],
            differentiation_claims: theme.rationale?.recommendations || [],
            cta_frameworks: [theme.callToAction],
            visual_concepts: theme.contentSuggestions?.visualElements || [],
            messaging_hierarchy: {
              primary: theme.keyMessage,
              secondary: theme.contentSuggestions?.keyPoints || [],
              supporting: []
            }
          },
          enrichedIntakeContext,
          selectedBrand.id,
          {
            useThemeContent: true,
            useIntakeContext: true,
            generateMissingContent: true,
            assetTypeOptimization: true
          },
          filteredPIResult?.selectedSections || null
        );

        console.log('=== INITIALIZATION RESULT ===');
        console.log('Content keys:', Object.keys(initializedContent.content));
        console.log('Content completeness:', initializedContent.completeness);
        console.log('Generation sources:', initializedContent.generationSources);
        console.log('Suggestions:', initializedContent.suggestions);
        console.log('First 200 chars of content:', JSON.stringify(initializedContent.content).substring(0, 200));
        console.log('=====================================');

        // Create the asset in database with rich content and enriched context
        console.log('💾 Creating asset with enriched intake context');
        const asset = await ContentService.createAsset({
          project_id: project.id,
          brand_id: selectedBrand.id,
          asset_name: intakeData.projectName, // Use exact name user entered
          asset_type: ContentService.mapIntakeAssetTypeToDbType(intakeData.selectedAssetTypes[0]),
          status: 'draft',
          primary_content: {
            ...initializedContent.content,
            subject: intakeData.projectName, // Set subject to project name
          },
          metadata: {
            theme: theme,
            theme_id: persistedTheme.id,
            intake_context: enrichedIntakeContext,
            content_completeness: initializedContent.completeness,
            generation_sources: initializedContent.generationSources,
            initialization_suggestions: initializedContent.suggestions,
            generation_context: {
              audience: intakeData.primaryAudience,
              specialist_type: intakeData.specialistType,
              specialist_display_name: enrichedIntakeContext.specialistDisplayName,
              objective: intakeData.primaryObjective,
              indication: intakeData.indication,
              therapeutic_area: intakeData.therapeuticArea,
              generated_at: new Date().toISOString()
            }
          },
          intake_context: enrichedIntakeContext,
          theme_id: persistedTheme.id,
          target_audience: intakeData.primaryAudience,
          channel_specifications: {},
          compliance_notes: '',
          performance_prediction: {},
          ai_analysis: {},
          created_by: user.id
        });
        
        console.log('✅ Asset created with context-aware PI evidence:', {
          assetId: asset.id,
          hasStrategicContext: !!asset.intake_context?.strategicContext,
          hasPiFilteringResult: !!asset.intake_context?.piFilteringResult
        });

        // ✅ Save evidence data to dedicated columns (matching StrategyAndInsights.tsx)
        if (initializedContent.citationData) {
          const claimsUsed = initializedContent.citationData.claimsUsed || [];
          const referencesUsed = initializedContent.citationData.referencesUsed || [];
          const modulesUsed = initializedContent.citationData.modulesUsed || [];
          const visualsUsed = initializedContent.citationData.visualsUsed || [];
          
          console.log('📚 IntakeFlow: Saving evidence to dedicated columns:', {
            claimsUsed: claimsUsed.length,
            referencesUsed: referencesUsed.length,
            modulesUsed: modulesUsed.length,
            visualsUsed: visualsUsed.length
          });
          
          await supabase.from('content_assets').update({
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
              ...asset.metadata,
              citation_data: { claimsUsed, referencesUsed, modulesUsed, visualsUsed }
            }
          }).eq('id', asset.id);
        }

        // Record theme usage for analytics
        await ThemeService.recordThemeUsage(
          persistedTheme.id,
          'single_asset',
          asset.id,
          { 
            brand_id: selectedBrand.id,
            project_id: project.id,
            asset_type: asset.asset_type,
            created_via_intake: true
          }
        );

        // Verify asset exists in database before navigation
        // Type annotation removed
        const verifyAssetExists = async (assetId, maxAttempts = 5) => {
          for (let i = 0; i < maxAttempts; i++) {
            const { data } = await supabase
              .from('content_assets')
              .select('id')
              .eq('id', assetId)
              .maybeSingle();
            
            if (data) return true;
            await new Promise(resolve => setTimeout(resolve, 200 * (i + 1))); // Exponential backoff
          }
          return false;
        };

        const exists = await verifyAssetExists(asset.id);
        if (!exists) {
          toast({
            title: "Asset creation timeout",
            description: "Please try again",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Asset Created Successfully!",
          description: "Opening content editor...",
        });

        // Small delay for user to see toast
        await new Promise(resolve => setTimeout(resolve, 500));

        // Navigate directly to content editor (don't call onClose - it would navigate back)
        console.log('🔄 Navigating to content editor:', `/content-editor/${asset.id}`);
        navigate(`/content-editor/${asset.id}`, {
          replace: true, // Prevent back-button issues
          state: {
            assetData: asset,
            justCreated: true,
            fromIntake: true
          }
        });

      } else {
        console.log('Creating campaign project...');
        
        // For campaigns, create project and navigate to campaign workspace
        console.log('Creating campaign project with theme ID:', persistedTheme.id);
        
        const project = await ContentService.createProject({
          brand_id: selectedBrand.id,
          project_name: intakeData.projectName,
          project_type: 'campaign',
          description: `Campaign project for ${intakeData.indication}`,
          status: 'in_progress',
          target_audience: {
            primary: intakeData.primaryAudience,
            audience_segments: intakeData.audienceSegment
          },
          therapeutic_area: intakeData.indication,
          indication: intakeData.indication,
          market: intakeData.targetMarkets,
          channels: intakeData.selectedAssetTypes,
          compliance_level: 'standard',
          theme_id: persistedTheme.id,
          project_metadata: {
            theme: theme,
            theme_id: persistedTheme.id,
            intake_data: intakeData,
            created_via_intake: true
          },
          created_by: user.id
        });

        // Build enriched context for campaign assets (same as single asset)
        console.log('🎯 Building enriched context for campaign assets');
        
        // Build strategic context for PI evidence selection
        const campaignStrategicContext = {
          campaignObjective: intakeData.primaryObjective || 'clinical-education',
          keyMessage: theme.keyMessage || '',
          targetAudience: intakeData.primaryAudience || 'HCP',
          indication: intakeData.indication || '',
          assetType: 'campaign'
        };

        // Fetch PI data for campaign
        const { data: campaignPiRecords } = await supabase
          .from('brand_documents')
          .select('*')
          .eq('brand_id', selectedBrand.id)
          .eq('parsing_status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1);

        // Type assertion removed
        const campaignFullPIData = campaignPiRecords?.[0]?.parsed_data || null;
        
        // Filter PI data for campaign context
        const { PIEvidenceSelector: CampaignPISelector } = await import('@/services/PIEvidenceSelector');
        const campaignFilteredPIResult = CampaignPISelector.filterPIForContext(
          campaignFullPIData, 
          campaignStrategicContext
        );

        // Build enriched intake context for all campaign assets
        const campaignEnrichedContext = {
          ...intakeData,
          original_key_message: theme.keyMessage,
          original_cta: theme.callToAction,
          indication: intakeData.indication,
          intake_objective: intakeData.primaryObjective,
          intake_audience: intakeData.primaryAudience,
          specialistType: intakeData.specialistType,
          specialistDisplayName: intakeData.specialistDisplayName,
          therapeuticArea: intakeData.therapeuticArea,
          strategicContext: campaignStrategicContext,
          piFilteringResult: campaignFilteredPIResult
        };

        console.log('💾 Creating campaign assets with intake context:', {
          hasSpecialistType: !!campaignEnrichedContext.specialistType,
          specialistType: campaignEnrichedContext.specialistType,
          specialistDisplayName: campaignEnrichedContext.specialistDisplayName,
          therapeuticArea: campaignEnrichedContext.therapeuticArea,
          indication: campaignEnrichedContext.indication,
          primaryAudience: campaignEnrichedContext.intake_audience
        });
        
        console.log('💾 Campaign enriched context prepared:', {
          hasStrategicContext: !!campaignEnrichedContext.strategicContext,
          hasPiFilteringResult: !!campaignEnrichedContext.piFilteringResult
        });

        // Create assets for the campaign in the database with proper formatting
        const createdAssets = [];
        for (let index = 0; index < intakeData.selectedAssetTypes.length; index++) {
          const assetType = intakeData.selectedAssetTypes[index];
          const dbAssetType = ContentService.mapIntakeAssetTypeToDbType(assetType);
          
          // Use formatter to generate properly structured content for each asset type
          const formattedContent = AssetTypeContentFormatter.format(dbAssetType, {
            themeName: theme.name,
            coreMessage: theme.keyMessage,
            therapeuticFocus: intakeData.indication || intakeData.therapeuticArea,
            targetAudience: intakeData.primaryAudience,
            keyBenefits: theme.contentSuggestions?.keyPoints || [],
            clinicalPositioning: theme.rationale?.primaryInsight,
            proofPoints: theme.rationale?.supportingData || [],
            callToAction: theme.callToAction,
            indication: intakeData.indication,
            objective: intakeData.primaryObjective,
          });
          
          const asset = await ContentService.createAsset({
            project_id: project.id,
            brand_id: selectedBrand.id,
            asset_name: intakeData.selectedAssetTypes.length > 1 
              ? `${intakeData.projectName} ${index + 1}` 
              : intakeData.projectName,
            asset_type: dbAssetType,
            status: 'draft',
            primary_content: {
              subject: formattedContent.subject || theme.contentSuggestions?.headlines?.[index % (theme.contentSuggestions?.headlines?.length || 1)] || theme.keyMessage,
              preheader: formattedContent.preheader || '',
              headline: formattedContent.headline || theme.keyMessage,
              body: formattedContent.body || '',
              keyMessage: formattedContent.keyMessage || theme.keyMessage,
              cta: formattedContent.cta || theme.callToAction,
              disclaimer: formattedContent.disclaimer || '',
              ...formattedContent
            },
            metadata: {
              theme: theme,
              theme_id: persistedTheme.id,
              intake_context: campaignEnrichedContext,
              formatted_with: 'AssetTypeContentFormatter'
            },
            intake_context: campaignEnrichedContext,
            theme_id: persistedTheme.id,
            target_audience: intakeData.primaryAudience,
            channel_specifications: {},
            compliance_notes: '',
            performance_prediction: {},
            ai_analysis: {},
            created_by: user.id
          });
          createdAssets.push(asset);
        }
        
        console.log('✅ Campaign assets created with enriched context:', createdAssets.length);

        // Convert database assets to AssetData format for campaign
        // Type assertion removed
        const assets = createdAssets.map((asset) => ({
          ...intakeData,
          assetId: asset.id, // Use proper UUID from database
          assetType: asset.asset_type, // Asset types are compatible between db and intake
          parentCampaignId: project.id,
          status: 'draft',
          content: {
            subject: asset.primary_content.subject,
            body: asset.primary_content.body
          },
          keyMessage: theme.keyMessage,
          callToAction: theme.callToAction
        }));

        // Record theme usage for campaign
        await ThemeService.recordThemeUsage(
          persistedTheme.id,
          'campaign',
          project.id,
          { 
            brand_id: selectedBrand.id,
            project_id: project.id,
            asset_count: assets.length,
            asset_types: intakeData.selectedAssetTypes,
            created_via_intake: true
          }
        );

        // Type assertion removed
        const campaignData = {
          ...intakeData,
          campaignId: project.id,
          assets,
          status: 'draft',
          teamMembers: [currentUser.id],
          keyMessage: theme.keyMessage,
          callToAction: theme.callToAction,
          performanceMetrics: {
            totalReach: 0,
            engagementRate: 0,
            conversionRate: 0,
            mlrSuccessRate: 0
          }
        };

        toast({
          title: "Campaign Created",
          description: `${assets.length} assets created successfully for ${intakeData.projectName}`,
        });

        // Navigate directly to content editor (don't call onClose - it would navigate back)
        console.log('🔄 Navigating to campaign asset:', `/content-editor/${createdAssets[0].id}`);
        navigate(`/content-editor/${createdAssets[0].id}`, { replace: true });
      }
      
    } catch (error) {
      // Type assertion removed
      console.error('Error creating project/asset:', error);
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Failed to create project';
      if (error.message?.includes('uuid') || error.message?.includes('invalid input syntax')) {
        errorMessage = 'Invalid data format detected. The system encountered a data validation error. Please refresh the page and try again.';
      } else if (error.message?.includes('auth') || error.message?.includes('policy') || error.message?.includes('RLS')) {
        errorMessage = 'Authentication error. Please refresh the page and log in again.';
      } else if (error.message?.includes('theme')) {
        errorMessage = 'Failed to save theme. Please try selecting a different theme or refresh the page.';
      } else if (error.message) {
        errorMessage = `Failed to create project: ${error.message}`;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Simplified handlers for other functionality
  const handleBackFromThemeGeneration = () => {
    // Type assertion removed
    const intakeData = flowState.intakeData;
    setFlowState({ type: 'intake', data: intakeData });
  };

  // Type annotation removed
  const handleAssetSave = (assetData) => {
    if (flowState.type === 'single-asset') {
      // Save asset progress to draft storage
      // Type assertion removed
      const draftData = {
        data: assetData,
        timestamp: new Date().toISOString(),
        sessionId,
        version: '1.0',
        flowState: 'single-asset',
        assetData,
        selectedTheme: flowState.selectedTheme,
        contentProgress: 70 // Content creation in progress
      };
      DraftStorageManager.saveDraft(sessionId, draftData);
      setFlowState({ type: 'single-asset', assetData, selectedTheme: flowState.selectedTheme });
    }
  };

  // Type annotation removed
  const handleCampaignAssetEdit = (assetId) => {
    if (flowState.type === 'campaign') {
      const asset = flowState.campaignData.assets.find(a => a.assetId === assetId);
      if (asset) {
        // Save campaign state before switching to asset editing
        // Type assertion removed
        const draftData = {
          data: flowState.campaignData,
          timestamp: new Date().toISOString(),
          sessionId,
          version: '1.0',
          flowState: 'campaign',
          campaignData: flowState.campaignData,
          selectedTheme: flowState.selectedTheme,
          contentProgress: 60
        };
        DraftStorageManager.saveDraft(sessionId, draftData);
        
        // Transition to single asset editing
        setFlowState({ 
          type: 'single-asset', 
          assetData: asset, 
          selectedTheme: flowState.selectedTheme 
        });
      }
    }
  };

  const handleBackToCampaign = () => {
    if (flowState.type === 'single-asset') {
      // Try to restore campaign context from draft
      const draft = DraftStorageManager.loadDraft(sessionId);
      if (draft && draft.campaignData) {
        setFlowState({ 
          type: 'campaign', 
          campaignData: draft.campaignData,
          selectedTheme: draft.selectedTheme 
        });
      } else {
        onClose(); // Fallback to main dashboard
      }
    }
  };

  // Render appropriate component
  // Count pre-filled fields
  const preFilledCount = preFilledData ? Object.keys(preFilledData).length : 0;

  switch (flowState.type) {
    case 'intake':
      return (
        <IntelligenceProvider brandId={selectedBrand?.id || ''} autoLoad={true}>
          <div>
            {templateUsed && templateData && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Using template: <strong>{templateData.name}</strong></span>
                  <Badge variant="secondary" className="ml-2">
                    {preFilledCount} fields pre-filled
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {templateData.description}
                </p>
              </div>
            )}
            <UniversalIntakeCard
              initialData={preFilledData || flowState.data}
              onComplete={handleIntakeComplete}
              onCancel={onClose}
              onSaveDraft={handleSaveDraft}
              onStepChange={handleStepChange}
              sessionId={sessionId}
              startAtStep={startAtStep}
            />
          </div>
        </IntelligenceProvider>
      );

    case 'theme-generation':
      return (
        <ThemeGenerationHub
          intakeData={flowState.intakeData}
          onThemeSelect={handleThemeSelect}
          onBack={handleBackFromThemeGeneration}
        />
      );

    case 'single-asset':
      // This case should not be reached anymore as single assets navigate directly to Content Studio
      // Fallback to campaign workspace for any edge cases
      return (
        <CampaignDashboard
          campaignData={{
            ...flowState.assetData,
            campaignId: flowState.assetData.assetId,
            selectedAssetTypes: [flowState.assetData.assetType],
            assets: [flowState.assetData],
            status: 'draft',
            teamMembers: [currentUser.id],
            performanceMetrics: {
              totalReach: 0,
              engagementRate: 0,
              conversionRate: 0,
              mlrSuccessRate: 0
            }
          }}
          onBack={onClose}
          onEditAsset={handleCampaignAssetEdit}
          onAddAsset={() => {
            console.log('Add asset clicked');
          }}
          onEditCampaign={onClose}
        />
      );

    case 'campaign':
      return (
        <CampaignDashboard
          campaignData={flowState.campaignData}
          onBack={onClose}
          onEditAsset={handleCampaignAssetEdit}
          onAddAsset={() => {
            // TODO: Implement add asset functionality
            console.log('Add asset clicked');
          }}
          onEditCampaign={onClose}
        />
      );

    default:
      return null;
  }
};

export default IntakeFlow;