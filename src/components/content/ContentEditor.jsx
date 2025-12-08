import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
// Removed type import: import type { ContentAsset } from '@/types/content';
import { ThemeContentInitializer } from '@/services/themeContentInitializer';
import { ThemeService } from '@/services/themeService';
import { getAudienceCategory, isCaregiverAudience } from '@/utils/audienceTypeHelpers';
import { 
  ArrowLeft, 
  Save, 
  Check,
  CheckCircle,
  FileText,
  Sparkles,
  Mail,
  BarChart3,
  Loader2,
  Image,
  Layers,
  Globe,
  Share2,
  Presentation,
  Layout,
  Target,
  Users,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { moduleBridge } from '@/services/moduleBridge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetTypeContentEditor } from './AssetTypeContentEditor'; // Removed type import SimpleContentStructure
import { ContentStructureAdapter } from '@/utils/contentStructureAdapter';
import { useRealTimeContentAnalysis } from '@/hooks/useRealTimeContentAnalysis';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { ThemeIntelligenceContextPanel } from './ThemeIntelligenceContextPanel';
import { ThemeAwareContentService } from '@/services/themeAwareContentService';
import { ReadOnlyContentView } from './ReadOnlyContentView';
import { PersonalizationTabContent } from './PersonalizationTabContent';
import { MultiModalEmailComposer } from './MultiModalEmailComposer';
import { EvidenceModulesPanel } from './EvidenceModulesPanel.jsx';
import { VisualAssetsPanel } from './VisualAssetsPanel';
import { ContentIntelligenceSidebar } from './ContentIntelligenceSidebar';
import { PIEvidenceBadge } from './PIEvidenceBadge';
import { ContentQualityCard } from './ContentQualityCard';

// Removed type PersonalizationFactors
// Removed interface IntakeContext
// Removed interface ContentEditorProps

const ContentEditor = ({ assetId, initialData, onBack, onPublishToDesign }) => { // Removed : ContentEditorProps
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { state: globalState, actions: globalActions } = useGlobalContext();
  
  // Check if asset was just created
  const justCreated = location.state?.justCreated;
  const assetDataFromNav = location.state?.assetData;
  const {
    currentAsset,
    loading,
    error,
    saving,
    updateAssetContent,
    updateAssetStatus,
    generateVariations,
    pushToDesignStudio,
    loadAsset
  } = useContentManagement({ assetId, autoSave: true });

  // Removed <SimpleContentStructure> type annotation
  const [content, setContent] = useState({
    subject: '',
    headline: '',
    body: '',
    keyMessage: '',
    cta: '',
    disclaimer: '',
    preheader: '',
    unsubscribe: '',
    heroHeadline: '',
    heroSubheadline: '',
    heroCta: '',
    diseaseOverview: '',
    treatmentApproach: '',
    clinicalEvidence: '',
    safetyInformation: '',
    pageTitle: '',
    metaDescription: '',
    bodyText: '',
    hashtags: '',
    platform: '',
    characterCount: 0,
    imageRecommendation: ''
  });
  // Removed <IntakeContext> type annotation
  const [intakeContext, setIntakeContext] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  // Removed <any> type annotation
  const [themeData, setThemeData] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  // Removed type annotation
  const [activeTab, setActiveTab] = useState('content');
  const [isFinalized, setIsFinalized] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  // Removed <any> type annotation
  const [composedEmail, setComposedEmail] = useState(null);
  // Removed type annotation
  const [citationData, setCitationData] = useState(undefined);
  const [visualsInserted, setVisualsInserted] = useState(0);
  const [modulesUsed, setModulesUsed] = useState(0);
  
  // ✅ Phase 2: State for theme performance data
  // Removed <any> type annotation
  const [themePerformanceData, setThemePerformanceData] = useState(null);
  
  // Campaign Context State
  // Removed type annotation
  const [campaignContext, setCampaignContext] = useState(null);
  
  // Track if theme data has been loaded for current asset to prevent infinite loops
  // Removed <string | null> type annotation
  const themeDataLoadedRef = useRef(null);

  // Initialize real-time analysis
  const { analysis: realTimeAnalysis, triggerAnalysis } = useRealTimeContentAnalysis(
    content, 
    { 
      debounceMs: 3000, 
      enableRealtime: true, 
      minContentLength: 30 
    }
  );

  // If just created, load with retry logic
  useEffect(() => {
    if (justCreated && !currentAsset) {
      // Load asset with retry logic for newly created assets
      loadAsset(assetId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justCreated, assetId, currentAsset]);

  // Load asset data and theme context when assetId changes
  useEffect(() => {
    if (assetId && !currentAsset && !justCreated) {
      loadAsset(assetId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, currentAsset, justCreated]);

  // ✅ CRITICAL: Initialize content from workshop initialData
  useEffect(() => {
    // Only process if coming from workshop with assetPackage and no assetId
    if (!assetId && initialData?.assetPackage && !isContentReady) {
      console.log('🎨 Workshop → Editor: Processing initialData', {
        hasAssetPackage: !!initialData.assetPackage,
        hasTheme: !!initialData.selectedTheme,
        hasIntelligence: !!initialData.intelligence
      });

      const assetPackage = initialData.assetPackage;
      
      // Map assetPackage.structure to content state
      if (assetPackage.structure) {
        // Removed : SimpleContentStructure type annotation
        const workshopContent = {
          subject: assetPackage.structure.subject || '',
          headline: assetPackage.structure.headline || '',
          body: assetPackage.structure.body || assetPackage.structure.bodyText || '',
          keyMessage: assetPackage.structure.keyMessage || '',
          cta: assetPackage.structure.cta || '',
          disclaimer: assetPackage.structure.disclaimer || '',
          preheader: assetPackage.structure.preheader || '',
          unsubscribe: assetPackage.structure.unsubscribe || '',
          heroHeadline: assetPackage.structure.heroHeadline || '',
          heroSubheadline: assetPackage.structure.heroSubheadline || '',
          heroCta: assetPackage.structure.heroCta || '',
          diseaseOverview: assetPackage.structure.diseaseOverview || '',
          treatmentApproach: assetPackage.structure.treatmentApproach || '',
          clinicalEvidence: assetPackage.structure.clinicalEvidence || '',
          safetyInformation: assetPackage.structure.safetyInformation || '',
          pageTitle: assetPackage.structure.pageTitle || '',
          metaDescription: assetPackage.structure.metaDescription || '',
          bodyText: assetPackage.structure.bodyText || '',
          hashtags: assetPackage.structure.hashtags || '',
          platform: assetPackage.structure.platform || '',
          characterCount: assetPackage.structure.characterCount || 0,
          imageRecommendation: assetPackage.structure.imageRecommendation || ''
        };

        setContent(workshopContent);
        console.log('✅ Content initialized from workshop');
      }

      // Set theme data from selectedTheme
      if (initialData.selectedTheme) {
        setThemeData(initialData.selectedTheme);
        console.log('✅ Theme data set from workshop');
      }

      // Set citation data from attached evidence
      if (assetPackage.attachedClaims || assetPackage.attachedVisuals || assetPackage.attachedModules) {
        const workshopCitationData = {
          claimsUsed: assetPackage.attachedClaims || [],
          referencesUsed: [], // References linked through claims
          modulesUsed: assetPackage.attachedModules || [],
          visualsUsed: assetPackage.attachedVisuals || []
        };
        
        setCitationData(workshopCitationData);
        setModulesUsed(workshopCitationData.modulesUsed.length);
        setVisualsInserted(workshopCitationData.visualsUsed.length);
        console.log('✅ Citation data set from workshop', {
          claims: workshopCitationData.claimsUsed.length,
          modules: workshopCitationData.modulesUsed.length,
          visuals: workshopCitationData.visualsUsed.length
        });
      }

      // Store intake context for AI suggestions
      if (initialData.storyAnalysis) {
        setIntakeContext({
          intake_objective: initialData.storyAnalysis.goals?.primary,
          intake_audience: initialData.storyAnalysis.audience?.primaryType,
          indication: initialData.storyAnalysis.occasion?.type
        });
      }

      // Mark as ready (new asset from workshop, not loading from DB)
      setIsContentReady(true);
      setIsDirty(true); // Mark dirty so user can save
      
      console.log('✅ Workshop content fully initialized and ready for editing');
    }
    
    // Extract campaign context if available
    if (initialData?.campaignContext) {
      setCampaignContext(initialData.campaignContext);
      console.log('📦 Campaign context loaded:', initialData.campaignContext);
    }
  }, [assetId, initialData, isContentReady]);

  // Initialize content from theme data
  // Removed : any type annotation
  const initializeContentFromTheme = async (themeData) => {
    if (!currentAsset) return;

    try {
      const initializedResult = await ThemeContentInitializer.initializeFromTheme(
        currentAsset.asset_type || 'mass-email',
        {
          theme_name: themeData.name || '',
          asset_name: currentAsset.asset_name || '',
          core_message: themeData.keyMessage || '',
          therapeutic_focus: themeData.description || '',
          target_audience: themeData.target_audience || intakeContext.intake_audience || 'HCP',
          key_benefits: themeData.contentSuggestions?.keyPoints || [],
          clinical_positioning: themeData.rationale?.primaryInsight || '',
          emotional_tone: 'professional',
          content_pillars: [],
          proof_points: themeData.rationale?.supportingData || [],
          differentiation_claims: [],
          cta_frameworks: [themeData.callToAction || 'Learn More'],
          visual_concepts: themeData.contentSuggestions?.visualElements || [],
          messaging_hierarchy: {
            primary: themeData.keyMessage || '',
            secondary: themeData.contentSuggestions?.headlines || [],
            supporting: themeData.contentSuggestions?.keyPoints || []
          }
        },
        intakeContext,
        currentAsset.brand_id,
        {
          useThemeContent: true,
          useIntakeContext: true,
          generateMissingContent: true,
          assetTypeOptimization: true
        }
      );

      const newContent = {
        ...content,
        ...initializedResult.content
      };
      
      setContent(newContent);
      
      // Store intelligenceUsed data if available
      if (initializedResult.intelligenceUsed && Array.isArray(initializedResult.intelligenceUsed)) {
        // Removed : any type annotation
        console.log('📊 Intelligence used from theme generation:', {
          total: initializedResult.intelligenceUsed.length,
          // Removed : any type annotation
          byType: initializedResult.intelligenceUsed.reduce((acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
          }, {})
        });
        // Store in asset metadata for later retrieval
        const { error: metadataError } = await supabase
          .from('content_assets')
          .update({
            metadata: {
              ...currentAsset.metadata,
              intelligenceUsed: initializedResult.intelligenceUsed
            }
          })
          .eq('id', currentAsset.id);
        
        if (metadataError) {
          console.error('❌ Failed to store intelligence tracking:', metadataError);
        }
      }
      
      // ✅ Immediately persist to database (don't update state to prevent reload race)
      const databaseContent = ContentStructureAdapter.toDatabaseStructure(newContent, currentAsset);
      await updateAssetContent(databaseContent, false, false);
      
      // ✅ Store citationData in asset metadata, claims_used, references_used columns AND state
      if (initializedResult.citationData) {
        const claimsUsed = initializedResult.citationData.claimsUsed || [];
        const referencesUsed = initializedResult.citationData.referencesUsed || [];
        const modulesUsed = initializedResult.citationData.modulesUsed || [];
        const visualsUsed = initializedResult.citationData.visualsUsed || [];
        
        console.log('📚 Storing citation data with modules and visuals:', {
          claimsUsedCount: claimsUsed.length,
          referencesUsedCount: referencesUsed.length,
          modulesUsedCount: modulesUsed.length,
          visualsUsedCount: visualsUsed.length
        });
        
        // Update asset with citation data in multiple columns
        const { error: updateError } = await supabase
          .from('content_assets')
          .update({
            metadata: {
              ...currentAsset.metadata,
              citation_data: {
                claimsUsed,
                referencesUsed,
                modulesUsed,
                visualsUsed
              }
            },
            // Removed : any type assertion
            claims_used: claimsUsed.map((c) => ({
              claimId: c.claimId,
              claimDisplayId: c.claimDisplayId,
              claimText: c.claimText,
              citationNumber: c.citationNumber,
              linkedReferences: c.linkedReferences || []
            })),
            // Removed : any type assertion
            references_used: referencesUsed.map((r) => ({
              referenceId: r.referenceId,
              referenceDisplayId: r.referenceDisplayId,
              formattedCitation: r.formattedCitation,
              citationNumber: r.citationNumber
            }))
          })
          .eq('id', currentAsset.id);
        
        if (updateError) {
          console.error('❌ Failed to store citation data:', updateError);
        } else {
          console.log('✅ Citation data stored successfully');
        }
        
        // Set in component state with all evidence types
        setCitationData({
          claimsUsed,
          referencesUsed,
          modulesUsed,
          visualsUsed
        });
      }
      
      // ✅ Mark content as ready and saved
      setIsContentReady(true);
      setIsDirty(false);
      
      toast({
        title: "Content Initialized",
        description: `Theme content generated${initializedResult.citationData?.claimsUsed?.length ? ` with ${initializedResult.citationData.claimsUsed.length} evidence citations` : ''}.`,
      });
    } catch (error) {
      console.error('Error initializing content from theme:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to generate theme content. Please try again.",
        variant: "destructive"
      });
    }
  };

  // ✅ Phase 3: AI Suggestions Using Theme Context
  // Removed : string[] type annotation
  const getAISuggestions = async (field, currentValue) => { // Removed : string, currentValue: string type annotation
    try {
      const { data: patterns } = await supabase
        .from('content_success_patterns')
        .select('*')
        .eq('brand_id', currentAsset?.brand_id)
        .order('avg_performance_lift', { ascending: false })
        .limit(5);

      const contextPrompt = `
Theme: ${themeData?.name || 'General'}
Theme Strategy: ${themeData?.description || ''}
Proven Patterns: ${patterns?.map(p => `${p.pattern_name} (${p.avg_performance_lift}% lift)`).join(', ') || 'No patterns available'}

Current ${field}: ${currentValue || 'Empty'}

Provide 3 specific improvements based on proven campaign patterns from the data. Be concise.
      `;

      // This would call AI service - placeholder for now
      console.log('AI suggestions prompt:', contextPrompt);
      
      return [
        `Incorporate proven pattern: ${patterns?.[0]?.pattern_name || 'data-driven approach'}`,
        `Emphasize key message: ${themeData?.keyMessage || 'core value proposition'}`,
        `Strengthen CTA based on successful campaigns`
      ];
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      return [];
    }
  };

  // ✅ Phase 4: Enable Content Performance Tracking
  const trackContentPerformance = async () => {
    if (!currentAsset) return;
    
    try {
      await supabase.from('content_performance_attribution').insert({
        brand_id: currentAsset.brand_id,
        content_registry_id: currentAsset.id,
        theme_id: themeData?.id,
        attribution_source: 'content_editor',
        source_system: 'internal',
        measurement_date: new Date().toISOString().split('T')[0],
        performance_score: 100
      });
      
      console.log('✅ Content performance tracking initialized');
    } catch (error) {
      console.error('Error tracking content performance:', error);
    }
  };

  // Check if we're in workshop mode (coming from workshop without assetId)
  const isWorkshopMode = !assetId && initialData?.assetPackage;
  
  // Check if we're in campaign mode
  const isCampaignMode = !!campaignContext;

  // Validate theme compatibility with brand therapeutic area
  // Removed : Promise<boolean> type annotation
  const validateThemeBrandCompatibility = async (
    theme, // Removed : any type annotation
    brandId // Removed : string type annotation
  ) => {
    try {
      // Get brand therapeutic area
      const { data: brandData } = await supabase
        .from('brand_profiles')
        .select('therapeutic_area')
        .eq('id', brandId)
        .single();
        
      if (!brandData?.therapeutic_area) return true; // Allow if no therapeutic area defined
      
      const brandArea = brandData.therapeutic_area.toLowerCase();
      const themeArea = (
        theme.therapeuticFocus || 
        theme.description || 
        theme.audience?.[0] || 
        ''
      ).toLowerCase();
      
      // Direct therapeutic area match
      if (themeArea.includes(brandArea)) return true;
      
      // Cross-therapeutic compatibility checks
      if (brandArea === 'oncology') {
        return themeArea.includes('cancer') || 
               themeArea.includes('tumor') || 
               themeArea.includes('oncology') ||
               themeArea.includes('nsclc') ||
               themeArea.includes('colorectal');
      }
      
      if (brandArea === 'cardiovascular') {
        return themeArea.includes('cardio') || 
               themeArea.includes('heart') || 
               themeArea.includes('afib') || 
               themeArea.includes('stroke');
      }
      
      if (brandArea === 'respiratory') {
        return themeArea.includes('respiratory') || 
               themeArea.includes('lung') || 
               themeArea.includes('copd') ||
               themeArea.includes('ipf');
      }
      
      return false;
    } catch (error) {
      console.error('Error validating theme compatibility:', error);
      return false; // Default to incompatible on error
    }
  };

  // Generate brand-appropriate theme
  // Removed type annotation
  const generateBrandAppropriateTheme = async (brandId, indication) => { // Removed : string, indication?: string type annotation
    try {
      // Get brand profile
      const { data: brandData } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', brandId)
        .single();
        
      if (!brandData) return null;
      
      const therapeuticArea = brandData.therapeutic_area?.toLowerCase() || 'general';
      const brandName = brandData.brand_name;
      
      let themeContent = {
        id: `generated-${Date.now()}`,
        name: `${brandName} ${indication || 'Content'} Theme`,
        description: `Therapeutic theme for ${brandName}`,
        keyMessage: '',
        therapeuticFocus: brandData.therapeutic_area,
        audience: ['Healthcare Professionals'],
        contentSuggestions: {
          keyPoints: [],
          headlines: [],
          visualElements: []
        },
        rationale: {
          primaryInsight: '',
          supportingData: []
        },
        callToAction: 'Learn More'
      };
      
      // Customize based on therapeutic area and brand
      switch (therapeuticArea) {
        case 'oncology':
          themeContent.keyMessage = `Advanced cancer treatment with ${brandName}`;
          themeContent.contentSuggestions.keyPoints = [
            'Proven efficacy in clinical trials',
            'Targeted therapy approach',
            'Enhanced patient outcomes'
          ];
          themeContent.contentSuggestions.headlines = [
            `${brandName}: Advancing Cancer Care`,
            'Proven Results in Oncology'
          ];
          themeContent.rationale.primaryInsight = `${brandName} delivers meaningful clinical outcomes`;
          themeContent.callToAction = 'Discuss with your patients';
          break;
          
        case 'cardiovascular':
          themeContent.keyMessage = `Comprehensive cardiovascular protection with ${brandName}`;
          themeContent.contentSuggestions.keyPoints = [
            'Reduced cardiovascular risk',
            'Proven stroke prevention',
            'Clinical evidence support'
          ];
          themeContent.contentSuggestions.headlines = [
            `${brandName}: Cardiovascular Protection`,
            'Evidence-Based Care'
          ];
          themeContent.rationale.primaryInsight = `${brandName} provides comprehensive protection`;
          themeContent.callToAction = 'Evaluate your patients';
          break;
          
        case 'respiratory':
          themeContent.keyMessage = `Effective respiratory care with ${brandName}`;
          themeContent.contentSuggestions.keyPoints = [
            'Improved lung function',
            'Better quality of life',
            'Disease progression management'
          ];
          themeContent.contentSuggestions.headlines = [
            `${brandName}: Respiratory Excellence`,
            'Breathing Made Better'
          ];
          themeContent.rationale.primaryInsight = `${brandName} supports respiratory health`;
          themeContent.callToAction = 'Learn about treatment';
          break;
          
        default:
          themeContent.keyMessage = `Effective treatment with ${brandName}`;
          themeContent.contentSuggestions.keyPoints = [
            'Proven efficacy',
            'Established safety profile',
            'Patient-focused care'
          ];
      }
      
      return themeContent;
    } catch (error) {
      console.error('Error generating brand-appropriate theme:', error);
      return null;
    }
  };

  // Load theme data with brand validation from cross-module context
  useEffect(() => {
    const loadThemeData = async () => {
      if (currentAsset && themeDataLoadedRef.current !== currentAsset.id) {
        themeDataLoadedRef.current = currentAsset.id;
        try {
          setIsInitializing(true);
          
          // Removed : any type assertion
          const { data: contextResponse, error } = await supabase
            .from('cross_module_context')
            .select('context_data, therapeutic_area')
            .eq('brand_id', currentAsset.brand_id)
            .eq('context_type', 'initiative')
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

          if (error) throw error;

          // Removed : any type assertion
          const contextData = contextResponse;
          const selectedTheme = contextData?.context_data?.theme?.selectedTheme;
          const intakeData = contextData?.context_data?.intake?.data;
          // Removed : any type annotation
          let validatedTheme = null;
          
          // Validate theme compatibility with brand if theme exists
          if (selectedTheme) {
            const isCompatible = await validateThemeBrandCompatibility(
              selectedTheme, 
              currentAsset.brand_id
            );
            
            if (isCompatible) {
              // If theme has an ID, fetch latest data from theme_library to get current enrichment status
              if (selectedTheme.id) {
                try {
                  const latestTheme = await ThemeService.getThemeById(selectedTheme.id);
                  if (latestTheme) {
                    validatedTheme = {
                      ...selectedTheme,
                      enrichment_status: latestTheme.enrichment_status,
                      intelligence_progress: latestTheme.intelligence_progress,
                      intelligence_layers: latestTheme.intelligence_layers
                    };
                    console.log('Using validated theme with latest enrichment status:', validatedTheme);
                  } else {
                    validatedTheme = selectedTheme;
                  }
                } catch (error) {
                  console.error('Error fetching latest theme data:', error);
                  validatedTheme = selectedTheme;
                }
              } else {
                validatedTheme = selectedTheme;
              }
              console.log('Using validated theme from cross-module context:', validatedTheme);
            } else {
              console.log('Cross-module theme incompatible with brand, generating appropriate theme');
              
              // Clear incompatible theme from context
              await supabase
                .from('cross_module_context')
                .update({
                  context_data: {
                    ...contextData.context_data,
                    theme: null
                  }
                })
                .eq('brand_id', currentAsset.brand_id)
                .eq('context_type', 'initiative');
              
              // Generate brand-appropriate theme
              validatedTheme = await generateBrandAppropriateTheme(
                currentAsset.brand_id,
                intakeData?.indication
              );
            }
          } else {
            // No theme in context, generate brand-appropriate theme
            validatedTheme = await generateBrandAppropriateTheme(
              currentAsset.brand_id,
              intakeData?.indication
            );
          }
          
          if (validatedTheme) {
            setThemeData(validatedTheme);
            
            // ✅ Phase 1: Check if content exists in DB before initializing from theme
            // Removed : any type assertion
            const hasContentInDatabase = currentAsset?.primary_content && 
              Object.keys(currentAsset.primary_content).length > 0 &&
              (currentAsset.primary_content.subject || 
               currentAsset.primary_content.headline || 
               currentAsset.primary_content.body);

            if (!isContentReady && !hasContentInDatabase) {
              console.log('✅ New asset detected, initializing from validated theme');
              await initializeContentFromTheme(validatedTheme);
            } else if (hasContentInDatabase) {
              console.log('✅ Existing content in DB detected, skipping theme initialization');
            }
          }
          
          // Extract and set intake context from cross-module data if available
          if (intakeData && !intakeContext) {
            // Check if audience is caregiver type
            // Removed as any type assertion
            const isCaregiverContext = isCaregiverAudience(intakeData.targetAudience);
            // Removed as any type assertion
            console.log('🎯 Audience context:', {
              audience: intakeData.targetAudience,
              category: getAudienceCategory(intakeData.targetAudience),
              isCaregiver: isCaregiverContext
            });
            
            const enhancedIntakeContext = {
              original_key_message: intakeData.keyMessage || intakeData.originalKeyMessage,
              original_cta: intakeData.callToAction || intakeData.originalCta,
              intake_objective: intakeData.objective || intakeData.campaignObjective,
              intake_audience: intakeData.targetAudience || intakeData.audience,
              indication: intakeData.indication,
              theme_id: validatedTheme?.id,
              brand_guidelines: intakeData.brandGuidelines
            };
            
            // Only update if we have meaningful intake data
            if (enhancedIntakeContext.original_key_message || enhancedIntakeContext.original_cta) {
              setIntakeContext(prev => ({ ...prev, ...enhancedIntakeContext }));
            }
          }
        } catch (error) {
          console.error('Error loading theme data from context:', error);
          // Fallback: try loading from asset theme_id or metadata.theme_id
          const themeIdToLoad = currentAsset?.theme_id || currentAsset?.metadata?.theme_id;
          if (themeIdToLoad) {
            try {
              console.log('Loading theme:', themeIdToLoad, 'from:', currentAsset?.theme_id ? 'theme_id column' : 'metadata');
              const persistedTheme = await ThemeService.getThemeById(themeIdToLoad);
              console.log('Loaded theme with intelligence layers:', Object.keys(persistedTheme?.intelligence_layers || {}));
              if (persistedTheme) {
                // Transform persisted theme to GeneratedTheme format for compatibility
                const transformedTheme = {
                  id: persistedTheme.id,
                  name: persistedTheme.name,
                  description: persistedTheme.description,
                  category: persistedTheme.category,
                  keyMessage: persistedTheme.key_message,
                  callToAction: persistedTheme.call_to_action || '',
                  rationale: persistedTheme.rationale,
                  contentSuggestions: persistedTheme.content_suggestions,
                  performancePrediction: persistedTheme.performance_prediction,
                  dataSources: persistedTheme.data_sources,
                  confidence: persistedTheme.confidence_score,
                  enrichment_status: persistedTheme.enrichment_status,
                  intelligence_layers: persistedTheme.intelligence_layers || {},
                  intelligence_progress: persistedTheme.intelligence_progress || 0,
                  workshop_notes: persistedTheme.workshop_notes || []
                };
                console.log('Loaded theme for intelligence panel:', transformedTheme);
                setThemeData(transformedTheme);
                
                // ✅ Phase 1: Check if content exists in DB before initializing from theme
                // Removed : any type assertion
                const hasContentInDatabase = currentAsset?.primary_content && 
                  Object.keys(currentAsset.primary_content).length > 0 &&
                  (currentAsset.primary_content.subject || 
                   currentAsset.primary_content.headline || 
                   currentAsset.primary_content.body);

                if (!isContentReady && !hasContentInDatabase) {
                  console.log('✅ Initializing from fallback persisted theme');
                  await initializeContentFromTheme(transformedTheme);
                } else if (hasContentInDatabase) {
                  console.log('✅ Existing content in DB, skipping fallback theme initialization');
                }
              }
            } catch (fallbackError) {
              console.error('Error loading fallback theme:', fallbackError);
            }
          } else {
            // Final fallback: generate brand-appropriate theme
            try {
              const fallbackTheme = await generateBrandAppropriateTheme(currentAsset.brand_id);
              if (fallbackTheme) {
                setThemeData(fallbackTheme);
                console.log('Using fallback brand-appropriate theme:', fallbackTheme);
                // ✅ Always initialize from theme if content is not ready
                if (!isContentReady) {
                  console.log('Initializing content from fallback brand-appropriate theme');
                  await initializeContentFromTheme(fallbackTheme);
                }
              }
            } catch (fallbackError) {
              console.error('Error generating fallback theme:', fallbackError);
            }
          }
        } finally {
          setIsInitializing(false);
        }
      }
    };

    loadThemeData();
  }, [currentAsset?.brand_id, currentAsset?.id, isContentReady]);

  // ✅ Load citation data from asset metadata, claims_used/references_used columns, or re-process content
  useEffect(() => {
    const loadCitationData = async () => {
      if (!currentAsset) return;
      
      console.log('📚 Loading citation data for asset:', currentAsset.id);
      
      // Priority 1: Try loading from claims_used/references_used columns (most reliable)
      // Removed : any[] type assertion
      const claimsUsedArray = currentAsset.claims_used;
      // Removed : any[] type assertion
      const referencesUsedArray = currentAsset.references_used;
      // Removed : any type assertion
      const metadataCitationData = currentAsset.metadata?.citation_data;
      
      // Check for visual assets from primary_content.visualsReferenced
      // Removed : any type assertion
      const visualsReferenced = currentAsset.primary_content?.visualsReferenced;
      // Removed : any type assertion
      let visualsUsed = metadataCitationData?.visualsUsed || 
                        currentAsset.metadata?.visualsUsed || // Direct path fallback
                        [];
      
      // If visualsUsed contains just IDs (strings), fetch full data
      if (visualsUsed.length > 0 && typeof visualsUsed[0] === 'string') {
        console.log('📚 Fetching full visual asset data for IDs:', visualsUsed);
        try {
          const { data: fullVisuals } = await supabase
            .from('visual_assets')
            .select('*')
            .in('id', visualsUsed);
          
          if (fullVisuals && fullVisuals.length > 0) {
            // Removed : any type annotation
            visualsUsed = fullVisuals.map(v => ({
              visualId: v.id,
              visualType: v.visual_type,
              title: v.title || 'Untitled Visual',
              caption: v.caption,
              mlrApproved: v.mlr_approved,
              storagePath: v.storage_path,
              visualData: v.visual_data
            }));
            console.log('📚 Transformed visual IDs to full objects:', visualsUsed.length);
          }
        } catch (error) {
          console.error('❌ Error fetching full visual data:', error);
        }
      }
      
      // Priority 1a: Fetch visual assets if we have references but no full data
      if (visualsReferenced && visualsReferenced.length > 0 && visualsUsed.length === 0) {
        console.log('📚 Fetching visual assets from visualsReferenced:', visualsReferenced);
        
        try {
          // Build query for partial UUID matching
          let query = supabase.from('visual_assets').select('*');
          
          // For each reference, add an OR condition
          // Removed : string type annotation
          visualsReferenced.forEach((ref, idx) => {
            if (ref.length === 36) {
              // Full UUID
              if (idx === 0) {
                query = query.or(`id.eq.${ref}`);
              } else {
                query = query.or(`id.eq.${ref}`);
              }
            } else {
              // Partial UUID - use LIKE
              if (idx === 0) {
                query = query.or(`id.like.${ref}%`);
              } else {
                query = query.or(`id.like.${ref}%`);
              }
            }
          });
          
          const { data: visuals, error } = await query;
          
          if (!error && visuals && visuals.length > 0) {
            // Removed : any type annotation
            visualsUsed = visuals.map(v => ({
              visualId: v.id,
              visualType: v.visual_type,
              title: v.title || 'Untitled Visual',
              caption: v.caption || undefined,
              mlrApproved: v.mlr_approved || false,
              storagePath: v.storage_path || undefined,
              sourceSection: v.source_section || undefined,
              sourcePage: v.source_page || undefined,
              visualData: v.visual_data
            }));
            
            console.log('📚 Fetched visual assets successfully:', visualsUsed.length);
          } else if (error) {
            console.error('📚 Error fetching visual assets:', error);
          }
        } catch (error) {
          console.error('📚 Exception fetching visual assets:', error);
        }
      }
      
      if (claimsUsedArray?.length > 0 || metadataCitationData?.claimsUsed?.length > 0) {
        // Merge data from columns and metadata
        let claimsUsed = claimsUsedArray?.length > 0 ? claimsUsedArray : metadataCitationData?.claimsUsed || [];
        let referencesUsed = referencesUsedArray?.length > 0 ? referencesUsedArray : metadataCitationData?.referencesUsed || [];
        const modulesUsed = metadataCitationData?.modulesUsed || [];
        
        // If claimsUsed contains just IDs (strings), fetch full claim data
        if (claimsUsed.length > 0 && typeof claimsUsed[0] === 'string') {
          console.log('📚 Fetching full claim data for IDs:', claimsUsed);
          try {
            const { data: fullClaims } = await supabase
              .from('clinical_claims')
              .select('*, clinical_references!clinical_references_claim_id_fkey(id, reference_id_display, formatted_citation)')
              .in('id', claimsUsed);
            
            if (fullClaims && fullClaims.length > 0) {
              // Removed : any type annotation
              claimsUsed = fullClaims.map((claim, index) => ({
                claimId: claim.id,
                claimDisplayId: claim.claim_id_display || claim.id.substring(0, 8),
                claimText: claim.claim_text,
                citationNumber: index + 1,
                // Removed : any type annotation
                linkedReferences: claim.clinical_references?.map((ref) => ref.id) || []
              }));
              console.log('📚 Transformed claim IDs to full objects:', claimsUsed.length);
              
              // Also fetch references if needed
              // Removed : any type assertion
              if (referencesUsed.length === 0 && fullClaims.some((c) => c.clinical_references?.length > 0)) {
                // Removed : any type assertion
                const allRefs = fullClaims.flatMap((c) => c.clinical_references || []);
                // Removed : any type annotation
                referencesUsed = allRefs.map((ref, index) => ({
                  referenceId: ref.id,
                  referenceDisplayId: ref.reference_id_display || ref.id.substring(0, 8),
                  formattedCitation: ref.formatted_citation || ref.reference_text || '',
                  citationNumber: index + 1
                }));
                console.log('📚 Extracted references from claims:', referencesUsed.length);
              }
            }
          } catch (error) {
            console.error('❌ Error fetching full claim data:', error);
          }
        }
        
        console.log('📚 PRIORITY 1: Using claims_used/references_used columns + metadata:', {
          claimsUsed: claimsUsed.length,
          referencesUsed: referencesUsed.length,
          modulesUsed: modulesUsed.length,
          visualsUsed: visualsUsed.length
        });
        setCitationData({
          claimsUsed,
          referencesUsed,
          modulesUsed,
          visualsUsed
        });
        return;
      }
      
      // Priority 2: Try loading from stored metadata.citation_data (with all fields)
      if (metadataCitationData?.claimsUsed?.length > 0) {
        console.log('📚 PRIORITY 2: Using metadata.citation_data:', metadataCitationData);
        setCitationData({
          claimsUsed: metadataCitationData.claimsUsed || [],
          referencesUsed: metadataCitationData.referencesUsed || [],
          modulesUsed: metadataCitationData.modulesUsed || [],
          visualsUsed: visualsUsed
        });
        return;
      }
      
      // Priority 3: Re-process content for [CLAIM:XXX] markers and SAVE to database
      // Removed : any type assertion
      const bodyContent = typeof currentAsset.primary_content === 'object' 
        ? currentAsset.primary_content?.body || ''
        : '';
      
      const hasMarkers = /\[CLAIM:CML-[A-Za-z0-9]+\]/.test(bodyContent);
      console.log('📚 PRIORITY 3: Checking for markers in content:', { hasMarkers, bodyLength: bodyContent.length });
        
      if (hasMarkers && currentAsset.brand_id) {
        try {
          console.log('📚 Re-processing citations from content markers...');
          const { CitationProcessor } = await import('@/services/citationProcessor');
          const processed = await CitationProcessor.processContent(bodyContent, currentAsset.brand_id);
          
          console.log('📚 CitationProcessor result:', {
            claimsUsed: processed.claimsUsed.length,
            referencesUsed: processed.referencesUsed.length,
            firstClaim: processed.claimsUsed[0]
          });
          
          if (processed.claimsUsed.length > 0) {
            // Save to database for future loads
            console.log('📚 Saving re-processed citations to database...');
            const { error: saveError } = await supabase
              .from('content_assets')
              .update({
                // Removed : any type assertion
                claims_used: processed.claimsUsed,
                // Removed : any type assertion
                references_used: processed.referencesUsed,
                // Removed : any type assertion
                metadata: {
                  ...currentAsset.metadata,
                  citation_data: {
                    claimsUsed: processed.claimsUsed,
                    referencesUsed: processed.referencesUsed
                  }
                }
              })
              .eq('id', currentAsset.id);
            
            if (saveError) {
              console.error('❌ Failed to save re-processed citations:', saveError);
            } else {
              console.log('✅ Re-processed citations saved to database');
            }
            
            setCitationData({
              claimsUsed: processed.claimsUsed,
              referencesUsed: processed.referencesUsed
            });
          } else {
            console.warn('⚠️ CitationProcessor returned 0 claims - may be RLS issue or claims not found');
          }
        } catch (error) {
          console.error('❌ Error re-processing citations:', error);
        }
      } else {
        console.log('📚 No citation markers found in content or no brand_id');
      }
    };
    
    loadCitationData();
  }, [currentAsset?.id]);

  // ✅ Phase 2: Fetch theme performance data when theme changes
  // ✅ Phase 2 & 4: Fetch performance data for theme context
  const [isRefreshingPatterns, setIsRefreshingPatterns] = useState(false);
  
  const fetchPerformanceData = useCallback(async () => {
    if (!themeData?.id || !currentAsset?.brand_id) return;
    
    try {
      const { data: patterns } = await supabase
        .from('content_success_patterns')
        .select('*')
        .eq('brand_id', currentAsset.brand_id)
        .order('avg_performance_lift', { ascending: false })
        .limit(10);

      if (patterns && patterns.length > 0) {
        const avgLift = patterns.reduce((sum, p) => sum + (p.avg_performance_lift || 0), 0) / patterns.length;
        const topPattern = patterns[0];
        
        setThemePerformanceData({
          similarCampaigns: patterns.length,
          expectedEngagement: 24.5,
          baselineEngagement: 18.2,
          audienceSize: topPattern.sample_size || 12500,
          provenPattern: topPattern.pattern_name || 'Efficacy + Safety messaging',
          confidenceScore: topPattern.confidence_score || 87,
          performanceLift: avgLift
        });
      } else {
        // Fallback: Show preliminary evidence from raw attribution data
        const { data: rawPerf } = await supabase
          .from('content_performance_attribution')
          .select('engagement_rate, audience_segment, conversions, impressions')
          .eq('brand_id', currentAsset.brand_id)
          .not('engagement_rate', 'is', null)
          .order('engagement_rate', { ascending: false })
          .limit(50);

        if (rawPerf && rawPerf.length > 0) {
          const avgEngagement = rawPerf.reduce((sum, p) => sum + (p.engagement_rate || 0), 0) / rawPerf.length;
          const bestSegment = rawPerf[0];
          const totalConversions = rawPerf.reduce((sum, p) => sum + (p.conversions || 0), 0);
          const totalImpressions = rawPerf.reduce((sum, p) => sum + (p.impressions || 0), 0);
          
          setThemePerformanceData({
            similarCampaigns: rawPerf.length,
            expectedEngagement: avgEngagement,
            baselineEngagement: avgEngagement * 0.85,
            audienceSize: Math.floor(totalImpressions / rawPerf.length),
            provenPattern: `Best performance: ${bestSegment.audience_segment || 'Top segment'} (${bestSegment.engagement_rate?.toFixed(1)}% engagement)`,
            confidenceScore: 50,
            performanceLift: ((avgEngagement - (avgEngagement * 0.85)) / (avgEngagement * 0.85)) * 100
          });
        } else {
          setThemePerformanceData(null);
        }
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  }, [themeData?.id, currentAsset?.brand_id]);

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  // ✅ NEW: Pattern detection handler
  const handleRefreshPatterns = async () => {
    if (!currentAsset?.brand_id) return;
    
    setIsRefreshingPatterns(true);
    toast({
      title: 'Analyzing campaign data...',
      description: 'Detecting success patterns from existing campaigns',
    });
    
    try {
      // Import pattern detector
      const { SuccessPatternDetector } = await import('@/services/successPatternDetector');
      
      // Run pattern detection on existing data
      await SuccessPatternDetector.runPatternDetection(currentAsset.brand_id);
      
      // Refresh performance data
      await fetchPerformanceData();
      
      toast({
        title: 'Success!',
        description: 'Performance patterns detected and updated',
      });
    } catch (error) {
      console.error('Error running pattern detection:', error);
      toast({
        title: 'Error',
        description: 'Failed to detect patterns. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshingPatterns(false);
    }
  };


  // Reset theme data loaded ref when asset changes
  useEffect(() => {
    if (currentAsset?.id) {
      themeDataLoadedRef.current = null;
    }
  }, [currentAsset?.id]);

  // Track current asset ID to prevent unnecessary reloads
  // Removed <string | null> type annotation
  const currentAssetIdRef = useRef(null);

  // Initialize content when asset loads with structure adapter (only if already has content)
  useEffect(() => {
    if (currentAsset && currentAsset.id !== currentAssetIdRef.current) {
      // Asset ID changed - this is a real navigation, load new content
      console.log('ContentEditor: Asset ID changed, loading new content', currentAsset.id);
      currentAssetIdRef.current = currentAsset.id;
      
      // Check if content exists in database
      // Removed as any type assertion
      const primaryContent = currentAsset.primary_content;
      const hasContent = primaryContent && 
                        typeof primaryContent === 'object' && 
                        Object.keys(primaryContent).length > 0 &&
                        (primaryContent.subject || primaryContent.headline || primaryContent.body || 
                         primaryContent._original_structure);
      
      if (hasContent) {
        // Asset already has content, mark as ready and load it
        console.log('ContentEditor: Asset has existing content, loading it');
        try {
          const adaptedContent = ContentStructureAdapter.toSimpleStructure(currentAsset);
          const extractedIntakeContext = ContentStructureAdapter.getIntakeContext(currentAsset);
          
          console.log('ContentEditor: Converted to simple structure', adaptedContent);
          console.log('ContentEditor: Extracted intake context', extractedIntakeContext);
          
          // Ensure body field is a string, not an object
          const cleanedContent = {
            ...adaptedContent,
            // Removed : SimpleContentStructure type assertion
            body: typeof adaptedContent.body === 'object' 
              ? JSON.stringify(adaptedContent.body) 
              : adaptedContent.body || ''
          };
          
          setContent(cleanedContent);
          setIntakeContext(extractedIntakeContext);
          setIsContentReady(true); // ✅ Content exists and is ready
          setIsDirty(false);
          
          console.log('Content loaded, progress will be recalculated on next render');
        } catch (error) {
          console.error('ContentEditor: Error converting content structure', error, currentAsset);
          // Don't mark as ready, theme initialization will handle it
          toast({
            title: "Error Loading Content",
            description: "Failed to load content. Theme initialization will be attempted.",
            variant: "destructive"
          });
        }
      } else {
        console.log('ContentEditor: No content in database, waiting for theme initialization');
        // Content doesn't exist yet, theme initialization will handle it
      }
    }
    // DON'T reload if same asset ID (just a content update from save)
  }, [currentAsset?.id]); // Only watch the ID

  // Removed : string, value: string type annotation
  const handleContentChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  // Removed : boolean type annotation
  const handleSave = async (createVersion = false) => {
    if (!currentAsset) return;

    try {
      // Convert simple content structure back to database format
      const databaseContent = ContentStructureAdapter.toDatabaseStructure(content, currentAsset);
      
      // VALIDATION: Verify no data loss during transformation (round-trip test)
      const roundTrip = ContentStructureAdapter.toSimpleStructure({
        ...currentAsset,
        primary_content: databaseContent
      });
      
      // Removed : string[] type annotation
      const lostFields = [];
      // Removed : keyof SimpleContentStructure type assertion
      ['subject', 'headline', 'body', 'keyMessage', 'cta'].forEach(field => {
        const value = content[field];
        if (value && typeof value === 'string' && value.trim() && !roundTrip[field]) {
          lostFields.push(field);
        }
      });
      
      if (lostFields.length > 0) {
        console.error('⚠️ Content transformation would lose fields:', lostFields, {
          original: content,
          roundTrip: roundTrip
        });
        toast({
          title: "Save Warning",
          description: `Some fields may not save correctly: ${lostFields.join(', ')}. Please try again.`,
          variant: "destructive"
        });
        return;
      }
      
      await updateAssetContent(databaseContent, createVersion, true); // Update state on manual save
      setIsDirty(false);
      
      // Track performance when content is saved
      await trackContentPerformance();
      
      toast({
        title: createVersion ? 'Version saved' : 'Content saved',
        description: 'Your changes have been saved successfully.'
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to save content. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleGenerateVariations = async () => {
    if (!currentAsset) return;

    const factors = {
      audience_type: 'physician-specialist', // Removed as const type assertion
      hcp_specialty: 'cardiology',
      experience_level: 'expert', // Removed as const type assertion
      regional_context: 'us',
      channel_context: 'email'
    };

    try {
      await generateVariations([factors]);
      toast({
        title: 'Variations generated',
        description: 'AI has created personalized content variations.'
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: 'Failed to generate variations. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Transform Strategy & Insights theme data to ThemeContentInitializer format
  // Removed : any type annotation
  const transformThemeData = (strategyTheme) => { // Removed : any type annotation
    if (!strategyTheme) return null;
    
    return {
      theme_name: strategyTheme.name || 'Unnamed Theme',
      asset_name: currentAsset?.asset_name || '',
      core_message: strategyTheme.keyMessage || '',
      therapeutic_focus: strategyTheme.description || '',
      target_audience: strategyTheme.targetAudience || 'Healthcare Professionals',
      key_benefits: strategyTheme.contentSuggestions?.keyPoints || [],
      clinical_positioning: strategyTheme.description || '',
      emotional_tone: 'Professional and Engaging',
      content_pillars: strategyTheme.contentSuggestions?.headlines || [],
      proof_points: [],
      differentiation_claims: [],
      cta_frameworks: strategyTheme.callToAction ? [strategyTheme.callToAction] : [],
      visual_concepts: [],
      messaging_hierarchy: {
        primary: strategyTheme.keyMessage || '',
        secondary: strategyTheme.contentSuggestions?.headlines || [],
        supporting: strategyTheme.contentSuggestions?.keyPoints || []
      }
    };
  };

  // Removed type annotation
  const handleResetToTheme = async () => {
    if (!themeData || !currentAsset) return;

    try {
      setIsInitializing(true);
      
      // Transform the theme data from Strategy & Insights format to expected format
      const transformedTheme = transformThemeData(themeData);
      
      if (!transformedTheme) {
        toast({
          title: "Invalid Theme Data",
          description: "Theme data is incomplete or missing.",
          variant: "destructive"
        });
        return;
      }
      
      // Use ThemeContentInitializer to reset content to theme defaults
      const initializedContent = await ThemeContentInitializer.initializeFromTheme(
        currentAsset.asset_type,
        transformedTheme,
        intakeContext,
        currentAsset.brand_id
      );

      // Update the content with theme-based content - direct mapping from ThemeContentInitializer
      console.log('Theme reset - initializedContent:', initializedContent);
      
      // Removed : SimpleContentStructure type annotation
      const resetContent = {
        subject: initializedContent.content.subject || initializedContent.content.headline || '',
        headline: initializedContent.content.headline || initializedContent.content.subject || '',
        body: initializedContent.content.body || initializedContent.content.mainMessage || initializedContent.content.description || '',
        keyMessage: initializedContent.content.keyMessage || initializedContent.content.coreMessage || '',
        cta: initializedContent.content.cta || initializedContent.content.callToAction || '',
        disclaimer: initializedContent.content.disclaimer || initializedContent.content.legalText || '',
        preheader: initializedContent.content.preheader || '',
        unsubscribe: initializedContent.content.unsubscribe || '',
        heroHeadline: initializedContent.content.heroHeadline || '',
        heroSubheadline: initializedContent.content.heroSubheadline || '',
        heroCta: initializedContent.content.heroCta || '',
        diseaseOverview: initializedContent.content.diseaseOverview || '',
        treatmentApproach: initializedContent.content.treatmentApproach || '',
        clinicalEvidence: initializedContent.content.clinicalEvidence || '',
        safetyInformation: initializedContent.content.safetyInformation || '',
        pageTitle: initializedContent.content.pageTitle || '',
        metaDescription: initializedContent.content.metaDescription || '',
        bodyText: initializedContent.content.bodyText || '',
        hashtags: initializedContent.content.hashtags || '',
        platform: initializedContent.content.platform || '',
        characterCount: initializedContent.content.characterCount || 0,
        imageRecommendation: initializedContent.content.imageRecommendation || ''
      };
      
      console.log('Theme reset - mapped content:', resetContent);
      setContent(resetContent);
      setIsDirty(true);

      toast({
        title: "Reset to Theme",
        description: "Content has been reset to match the selected theme."
      });
    } catch (error) {
      console.error('Error resetting to theme:', error);
      toast({
        title: "Reset Failed",
        description: "Failed to reset content to theme. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Removed : string type annotation
  const onGenerateContent = async (field) => {
    try {
      // Placeholder for AI content generation for specific fields
      toast({
        title: "AI Generation",
        description: `Generating content for ${field}...`
      });
      // TODO: Implement field-specific AI generation
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: `Failed to generate content for ${field}.`,
        variant: "destructive"
      });
    }
  };

  // Removed : 'keyMessage' | 'cta' type annotation
  const onUseOriginalIntake = (field) => {
    if (!intakeContext) return;
    
    const originalValue = field === 'keyMessage' 
      ? intakeContext.original_key_message 
      : intakeContext.original_cta;
    
    if (originalValue) {
      setContent(prev => ({
        ...prev,
        [field]: originalValue
      }));
      setIsDirty(true);
      toast({
        title: "Original Content Used",
        description: `Applied original ${field} from intake.`
      });
    }
  };

  // Removed : any type annotation
  const handleStrategyApply = (strategy) => {
    try {
      console.log('Applying strategy:', strategy);
      // Apply the strategic recommendation to content
      if (strategy?.field && strategy?.content) {
        handleContentChange(strategy.field, strategy.content);
        toast({
          title: "Strategy Applied",
          description: `Applied strategic recommendation to ${strategy.field}.`
        });
      }
    } catch (error) {
      console.error('Error applying strategy:', error);
      toast({
        title: "Error",
        description: "Failed to apply strategic recommendation.",
        variant: "destructive"
      });
    }
  };

  const handlePublishToDesign = async () => {
    if (!currentAsset) return;

    try {
      await pushToDesignStudio();
      toast({
        title: 'Published to Design Studio',
        description: 'Content has been sent to the design team.'
      });
      
      if (onPublishToDesign) {
        onPublishToDesign(currentAsset);
      }
    } catch (error) {
      toast({
        title: 'Publish failed',
        description: 'Failed to publish to Design Studio. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Removed : ContentAsset['status'] type annotation
  const handleStatusChange = async (newStatus) => {
    if (!currentAsset) return;
    
    try {
      const success = await updateAssetStatus(currentAsset.id, newStatus);
      
      if (success) {
        toast({
          title: "Status Updated",
          description: `Content status changed to ${newStatus.replace('_', ' ')}.`,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Status Update Failed",
        description: "There was an error updating the content status.",
        variant: "destructive",
      });
    }
  };

  const handleFinalizeContent = async () => {
    if (!currentAsset) return;
    
    try {
      // 1. Auto-save current content (don't update state to prevent reload)
      const databaseContent = ContentStructureAdapter.toDatabaseStructure(content, currentAsset);
      await updateAssetContent(databaseContent, false, false);
      
      // 2. Update asset status to 'approved' in background
      await updateAssetStatus(currentAsset.id, 'approved');
      
      // 3. Lock editor and switch to read-only
      setIsFinalized(true);
      setIsReadOnly(true);
      setIsDirty(false);
      
      // 4. Automatically create primary variation
      await createPrimaryVariation();
      
      // 5. Switch to Personalization tab
      setActiveTab('personalization');
      
      toast({
        title: "Content Finalized",
        description: "Content is now ready for personalization and design handoff."
      });
    } catch (error) {
      toast({
        title: "Finalization Failed",
        description: "Failed to finalize content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const createPrimaryVariation = async () => {
    if (!currentAsset) return;
    
    try {
      const { data, error } = await supabase
        .from('content_variations')
        .insert({
          asset_id: currentAsset.id,
          variation_name: 'Primary Variation',
          variation_type: 'channel',
          content_data: content,
          is_primary: true,
          is_active: true,
          target_context: {
            audience: currentAsset.target_audience || 'HCP',
            description: 'Original finalized content'
          },
          personalization_factors: {},
          performance_metrics: {}
        })
        .select()
        .single();
        
      if (error) throw error;
      
      console.log('Primary variation created:', data);
    } catch (error) {
      console.error('Error creating primary variation:', error);
    }
  };

  const handleUnlockContent = () => {
    setIsReadOnly(false);
    toast({
      title: "Content Unlocked",
      description: "You can now edit the content again."
    });
  };

  // Manual refresh handler for theme data
  const handleRefreshThemeData = () => {
    if (currentAsset) {
      themeDataLoadedRef.current = null; // Reset the ref to trigger re-fetch
      setThemeData(null); // Clear current theme data
      toast({
        title: "Refreshing Intelligence",
        description: "Loading latest theme intelligence data..."
      });
    }
  };

  const getClinicalDataCount = () => {
    const clinicalData = currentAsset?.intake_context;
    let count = 0;
    if (clinicalData?.clinical_trial_results?.length) count += clinicalData.clinical_trial_results.length;
    if (clinicalData?.efficacy_data?.length) count += clinicalData.efficacy_data.length;
    if (clinicalData?.safety_data?.length) count += clinicalData.safety_data.length;
    if (clinicalData?.competitor_comparison?.length) count += clinicalData.competitor_comparison.length;
    return count;
  };

  const getProgressPercentage = () => {
    const requiredFields = ['subject', 'body', 'keyMessage'];
    const optionalFields = ['headline', 'cta', 'disclaimer'];
    
    console.log('ContentEditor: Calculating progress for content', content);
    
    // Removed : keyof SimpleContentStructure type assertion
    const filledRequired = requiredFields.filter(field => {
      const value = content[field];
      const filled = value && value.toString().trim().length > 0;
      console.log(`ContentEditor: Field ${field} = "${value}" (${typeof value}) -> ${filled}`);
      return filled;
    }).length;

    // Removed : keyof SimpleContentStructure type assertion
    const filledOptional = optionalFields.filter(field => {
      const value = content[field];
      const filled = value && value.toString().trim().length > 0;
      console.log(`ContentEditor: Optional field ${field} = "${value}" (${typeof value}) -> ${filled}`);
      return filled;
    }).length;

    const requiredWeight = 0.7;
    const optionalWeight = 0.3;

    const requiredProgress = requiredFields.length > 0 ? (filledRequired / requiredFields.length) * requiredWeight * 100 : 70;
    const optionalProgress = optionalFields.length > 0 ? (filledOptional / optionalFields.length) * optionalWeight * 100 : 30;

    const totalProgress = Math.round(requiredProgress + optionalProgress);
    
    console.log('ContentEditor: Progress calculation', {
      filledRequired,
      filledOptional,
      requiredProgress: Math.round(requiredProgress),
      optionalProgress: Math.round(optionalProgress),
      totalProgress
    });

    return totalProgress;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Loading content editor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <h3 className="text-lg font-semibold mb-2">Error Loading Content</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!currentAsset && !isWorkshopMode) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Content Not Found</h3>
        <p className="text-muted-foreground mb-4">The requested content asset could not be found.</p>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // ✅ Show loading UI while initializing content from theme
  if (!isContentReady || isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-semibold mb-2">Initializing Content</h3>
        <p className="text-muted-foreground mb-4">
          Generating content from theme data...
        </p>
        <Progress value={33} className="w-64" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Navigation */}
            <div className="flex items-center gap-4">
              {!isCampaignMode && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-xl font-semibold">{currentAsset.asset_name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{currentAsset.asset_type}</Badge>
                  
                  {/* Generation Context Badges */}
                  {currentAsset?.metadata?.generation_context && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {currentAsset.metadata.generation_context.specialist_display_name || 
                         currentAsset.metadata.generation_context.audience}
                      </Badge>
                      {currentAsset.metadata.generation_context.objective && (
                        <Badge variant="secondary" className="text-xs">
                          {currentAsset.metadata.generation_context.objective.replace('-', ' ')}
                        </Badge>
                      )}
                    </>
                  )}
                  
                  {/* PI Evidence Quality Indicator */}
              <PIEvidenceBadge 
                intakeContext={currentAsset.intake_context} // Removed as any type assertion
                metadata={{
                  ...currentAsset.metadata, // Removed as any type assertion
                  intelligence_layers_used: currentAsset.metadata?.intelligence_layers_used,
                  intelligence_layer_count: currentAsset.metadata?.intelligence_layer_count
                }}
                themeEnrichmentStatus={themeData?.enrichment_status || themeData?.enrichmentStatus}
              />
                  
                  {isDirty && (
                    <>
                      <span>•</span>
                      <span className="text-orange-600">Unsaved changes</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {!isFinalized && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSave(false)}
                  disabled={saving || !isDirty}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Draft'}
                </Button>
              )}
              
              {/* Campaign Mode: Complete & Next Asset */}
              {isCampaignMode && !isFinalized && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={async () => {
                    // Save first, then trigger campaign completion flow
                    if (isDirty) await handleSave(false);
                    if (onPublishToDesign && currentAsset) {
                      onPublishToDesign(currentAsset);
                    }
                  }}
                  disabled={saving || getProgressPercentage() < 70}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {campaignContext?.currentAssetOrder === campaignContext?.totalAssets 
                    ? 'Complete Campaign' 
                    : 'Complete & Next Asset'}
                </Button>
              )}
              
              {/* Standalone Mode: Original Finalize */}
              {!isCampaignMode && !isFinalized && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleFinalizeContent}
                  disabled={saving || getProgressPercentage() < 70}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Finalize Content
                </Button>
              )}
              
              {/* Send to MLR Review - Available after finalization or 50%+ progress */}
              {(isFinalized || getProgressPercentage() >= 50) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    if (!currentAsset) return;
                    
                    // Auto-save if dirty
                    if (isDirty) {
                      await handleSave(false);
                    }
                    
                    // Extract content string from different content structures
                    // Removed : SimpleContentStructure type annotation
                    const extractContentString = (c) => {
                      const parts = [];
                      if (c.subject) parts.push(`Subject: ${c.subject}`);
                      if (c.preheader) parts.push(`Preheader: ${c.preheader}`);
                      if (c.headline) parts.push(`Headline: ${c.headline}`);
                      if (c.heroHeadline) parts.push(`Hero Headline: ${c.heroHeadline}`);
                      if (c.heroSubheadline) parts.push(`Hero Subheadline: ${c.heroSubheadline}`);
                      if (c.keyMessage) parts.push(`Key Message: ${c.keyMessage}`);
                      if (c.body) parts.push(c.body);
                      if (c.bodyText) parts.push(c.bodyText);
                      if (c.clinicalEvidence) parts.push(`Clinical Evidence: ${c.clinicalEvidence}`);
                      if (c.safetyInformation) parts.push(`Safety Information: ${c.safetyInformation}`);
                      if (c.cta) parts.push(`CTA: ${c.cta}`);
                      if (c.heroCta) parts.push(`Hero CTA: ${c.heroCta}`);
                      if (c.disclaimer) parts.push(`Disclaimer: ${c.disclaimer}`);
                      return parts.join('\n\n');
                    };
                    
                    // Sync asset to moduleBridge for Pre-MLR to pick up
                    await moduleBridge.syncModuleData('content-studio', {
                      selectedAsset: {
                        id: currentAsset.id,
                        title: currentAsset.asset_name,
                        type: currentAsset.asset_type,
                        content: extractContentString(content),
                        status: currentAsset.status,
                        metadata: currentAsset.metadata,
                        claims_used: currentAsset.claims_used || citationData?.claimsUsed || [],
                        references_used: currentAsset.references_used || citationData?.referencesUsed || [],
                        target_audience: currentAsset.target_audience || intakeContext.intake_audience,
                        primary_content: currentAsset.primary_content,
                        brand_id: currentAsset.brand_id
                      }
                    });
                    
                    // Navigate to Pre-MLR with assetId
                    navigate(`/pre-mlr?assetId=${currentAsset.id}`);
                    
                    toast({
                      title: "Sent to MLR Review",
                      description: "Content is ready for pre-regulatory validation"
                    });
                  }}
                  disabled={saving}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Send to MLR Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Context Banner - aligned with 9-column grid */}
      {campaignContext && (
        <div className="border-b bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-9 flex items-center gap-4">
                <Badge variant="outline" className="bg-primary/10 border-primary/30">
                  <Layers className="h-3 w-3 mr-1" />
                  Campaign Mode
                </Badge>
                <div className="text-sm">
                  <span className="font-medium">{campaignContext.campaignName}</span>
                  <span className="text-muted-foreground mx-2">•</span>
                  <span className="text-muted-foreground">
                    Asset {campaignContext.currentAssetOrder} of {campaignContext.totalAssets}
                  </span>
                </div>
              </div>
              <div className="col-span-3" /> {/* Spacer for sidebar alignment */}
            </div>
          </div>
        </div>
      )}

      {/* Tabs - aligned with 9-column grid */}
      <Tabs value={activeTab} onValueChange={async (v) => {
        // Removed type assertion
        const newTab = v;
        // Auto-save if dirty before switching tabs
        if (isDirty && activeTab !== newTab) {
          try {
            await handleSave(false);
          } catch (error) {
            console.error('Auto-save failed during tab switch:', error);
          }
        }
        setActiveTab(newTab);
      }} className="flex-1 flex flex-col overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-9">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Content
                  <Badge variant="outline" className="ml-auto text-xs">{getProgressPercentage()}%</Badge>
                </TabsTrigger>
                <TabsTrigger value="evidence-modules" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Evidence & Modules
                  {(citationData?.claimsUsed?.length || 0) > 0 && (
                    <Badge variant="outline" className="ml-auto text-xs">{citationData?.claimsUsed?.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="visual-assets" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Visual Assets
                  {(citationData?.visualsUsed?.length || 0) > 0 && (
                    <Badge variant="outline" className="ml-auto text-xs">{citationData?.visualsUsed?.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="output-composer"
                  className="flex items-center gap-2"
                >
                  {['email', 'mass-email', 'rep-triggered-email', 'patient-email', 'caregiver-email', 'hcp-email'].includes(currentAsset.asset_type) ? (
                    <><Mail className="h-4 w-4" />Email Composer</>
                  ) : ['website-landing-page', 'web-content', 'web'].includes(currentAsset.asset_type) ? (
                    <><Globe className="h-4 w-4" />Page Builder</>
                  ) : ['blog'].includes(currentAsset.asset_type) ? (
                    <><FileText className="h-4 w-4" />Article Editor</>
                  ) : ['social-media-post', 'paid-social-ad', 'social'].includes(currentAsset.asset_type) ? (
                    <><Share2 className="h-4 w-4" />Post Builder</>
                  ) : ['digital-sales-aid', 'dsa'].includes(currentAsset.asset_type) ? (
                    <><Presentation className="h-4 w-4" />Presentation Builder</>
                  ) : (
                    <><Layout className="h-4 w-4" />Output Builder</>
                  )}
                  {!isFinalized && <AlertTriangle className="h-3 w-3 ml-1 text-amber-500" />}
                </TabsTrigger>
                {/* Hide personalization for social asset types */}
                {!['social-media-post', 'paid-social-ad', 'social'].includes(currentAsset.asset_type) && (
                  <TabsTrigger 
                    value="personalization" 
                    className="flex items-center gap-2"
                  >
                    {['email', 'mass-email', 'rep-triggered-email', 'patient-email', 'caregiver-email', 'hcp-email'].includes(currentAsset.asset_type) ? (
                      <><Users className="h-4 w-4" />Personalization</>
                    ) : ['digital-sales-aid', 'dsa'].includes(currentAsset.asset_type) ? (
                      <><Layers className="h-4 w-4" />Module Variants</>
                    ) : (
                      <><Target className="h-4 w-4" />Audience Variants</>
                    )}
                    {!isFinalized && <AlertTriangle className="h-3 w-3 ml-1 text-amber-500" />}
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            <div className="col-span-3" /> {/* Spacer for sidebar alignment */}
          </div>
        </div>

        {/* Tab 1: Content Editor */}
        <TabsContent value="content" className="mt-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 pb-6 space-y-4">
            {/* Content Quality Indicator - spans the 9-column grid */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-9">
                <ContentQualityCard 
                  intakeContext={currentAsset.intake_context} // Removed as any type assertion
                  completeness={getProgressPercentage()}
                />
              </div>
              <div className="col-span-3" />
            </div>
            
            {isReadOnly ? (
              <ReadOnlyContentView 
                content={content}
                assetType={currentAsset.asset_type}
                realTimeAnalysis={realTimeAnalysis}
                onUnlock={handleUnlockContent}
              />
            ) : (
              <AssetTypeContentEditor
                assetType={currentAsset.asset_type}
                content={content}
                onContentChange={handleContentChange}
                onGenerateContent={onGenerateContent}
                onUseOriginalIntake={onUseOriginalIntake}
                isGenerating={false}
                themeData={themeData}
                intakeContext={intakeContext}
                targetAudience="HCP"
                onResetToTheme={handleResetToTheme}
                isResetting={isInitializing}
                realTimeAnalysis={realTimeAnalysis}
                isDirty={isDirty}
                onSaveVersion={() => handleSave(true)}
                onRefreshAnalysis={triggerAnalysis}
                saving={saving}
                onRefreshThemeData={handleRefreshPatterns}
                assetMetadata={currentAsset.metadata}
                themePerformanceData={themePerformanceData}
                isRefreshingPatterns={isRefreshingPatterns}
                onGetSuggestions={getAISuggestions}
              />
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Evidence & Modules */}
        <TabsContent value="evidence-modules" className="mt-6">
          <div className="max-w-7xl mx-auto px-6 pb-6">
            <EvidenceModulesPanel
              brandId={currentAsset.brand_id || ''}
              assetId={currentAsset.id}
              assetType={currentAsset.asset_type}
              targetAudience={intakeContext.intake_audience}
              citationData={citationData}
              // Removed type annotation
              onInsertClaim={(claim) => {
                const marker = `[CLAIM:${claim.claim_id_display || 'CML-' + claim.id.substring(0, 4)}]`;
                setContent(prev => ({
                  ...prev,
                  body: prev.body ? `${prev.body} ${marker}` : marker
                }));
                setIsDirty(true);
              }}
              // Removed type annotation
              onInsertModule={(module) => {
                setContent(prev => ({
                  ...prev,
                  body: prev.body ? `${prev.body}\n\n${module.module_text}` : module.module_text
                }));
                setModulesUsed(prev => prev + 1);
                setIsDirty(true);
              }}
              // Removed type annotation
              onCitationDataRefresh={(data) => {
                setCitationData(data);
                toast({
                  title: "Citations Updated",
                  description: `Loaded ${data.claimsUsed.length} claims and ${data.referencesUsed.length} references.`
                });
              }}
            />
          </div>
        </TabsContent>

        {/* Tab 3: Visual Assets */}
        <TabsContent value="visual-assets" className="mt-6">
          <div className="max-w-7xl mx-auto px-6 pb-6">
            <VisualAssetsPanel
              brandId={currentAsset.brand_id || ''}
              assetType={currentAsset.asset_type}
              targetAudience={intakeContext.intake_audience}
              linkedClaimIds={citationData?.claimsUsed?.map(c => c.claimId)}
              visualsUsed={citationData?.visualsUsed}
              // Removed type annotation
              onInsertVisual={(visual) => {
                setVisualsInserted(prev => prev + 1);
                toast({
                  title: "Visual Asset Added",
                  description: `${visual.title || 'Visual'} will be included in email composition.`
                });
              }}
            />
          </div>
        </TabsContent>

        {/* Tab 4: Output Builder (contextual based on asset type) */}
        <TabsContent value="output-composer" className="mt-6">
          <div className="max-w-7xl mx-auto px-6 pb-6 space-y-4">
            {/* Warning when content not finalized */}
            {!isFinalized && (
              <Alert className="border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-600">Content Not Finalized</AlertTitle>
                <AlertDescription className="text-amber-600/80">
                  Your content is still in draft. The composed output may change as you continue editing.
                </AlertDescription>
              </Alert>
            )}
            
            {['email', 'mass-email', 'rep-triggered-email', 'patient-email', 'caregiver-email', 'hcp-email'].includes(currentAsset.asset_type) ? (
              <MultiModalEmailComposer 
                asset={currentAsset}
                currentContent={content}
                citationData={citationData}
                // Removed type annotation
                onComposed={(result) => {
                  setComposedEmail(result);
                  toast({
                    title: "Email Composed Successfully",
                    description: "Your multi-modal email has been generated and saved.",
                  });
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Layout className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {['website-landing-page', 'web-content', 'web'].includes(currentAsset.asset_type) ? 'Page Builder' :
                   ['blog'].includes(currentAsset.asset_type) ? 'Article Editor' :
                   ['social-media-post', 'paid-social-ad', 'social'].includes(currentAsset.asset_type) ? 'Post Builder' :
                   ['digital-sales-aid', 'dsa'].includes(currentAsset.asset_type) ? 'Presentation Builder' :
                   'Output Builder'} Coming Soon
                </h3>
                <p className="text-muted-foreground max-w-md">
                  The specialized builder for this asset type is under development. Your content is ready in the Content Editor tab.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 5: Personalization */}
        <TabsContent value="personalization" className="mt-6">
          <div className="max-w-7xl mx-auto px-6 pb-6 space-y-4">
            {/* Warning when content not finalized */}
            {!isFinalized && (
              <Alert className="border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-600">Content Not Finalized</AlertTitle>
                <AlertDescription className="text-amber-600/80">
                  Generating variants from draft content. Final versions may differ after content is finalized.
                </AlertDescription>
              </Alert>
            )}
            
            <PersonalizationTabContent 
              currentAsset={currentAsset}
              baseContent={content}
              onVariationsSaved={() => loadAsset(currentAsset.id)}
            />
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default ContentEditor;