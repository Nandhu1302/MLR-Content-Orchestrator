
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Globe,
  ArrowRight,
  ArrowLeft,
  FileText,
  Target,
  Brain,
  Save,
  RefreshCw,
  Sparkles,
  Bot,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  Unlock,
} from 'lucide-react';
import { EnhancedSmartTMEngine } from '@/services/EnhancedSmartTMEngine';
import { AITranslationEngine } from '@/services/AITranslationEngine';
import { useBrand } from '@/contexts/BrandContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslationAutoSave } from '@/hooks/useTranslationAutoSave';
import { getLanguageFromMarket } from '@/config/localizationConfig';
import { TranslationPersistenceService } from '@/services/translationPersistenceService';
import { supabase } from '@/integrations/supabase/client';
import { ResumeProjectModal } from '../ResumeProjectModal';
import { SaveStatusIndicator } from '../SaveStatusIndicator';
import { DataRecoveryPanel } from '../DataRecoveryPanel';

// Optional components imported in original file (keeping them)
import { SegmentedTranslationWorkspace } from './SegmentedTranslationWorkspace';
import { TranslationMemoryAnalytics } from './TranslationMemoryAnalytics';
import { ProfessionalAgencyPDF } from './ProfessionalAgencyPDF';
import { TranslationComparisonDrawer } from '../TranslationComparisonDrawer';

export const EnhancedTranslationHub = ({
  selectedAsset,
  globalMetadata,
  preloadedSegments,
  onPhaseComplete,
  onBack,
  projectId: parentProjectId, // Receive projectId from parent
}) => {
  const [segments, setSegments] = useState([]);
  const [memoryMatches, setMemoryMatches] = useState([]);
  const [finalTranslation, setFinalTranslation] = useState('');
  const [activeTab, setActiveTab] = useState('segments');
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

  // Comparison drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tmResult, setTmResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [currentSegmentId, setCurrentSegmentId] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState({
    tmComplete: false,
    aiComplete: false,
    selectionMade: false,
  });

  // Resume project modal state
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [existingProject, setExistingProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(parentProjectId ?? null);

  // Data restoration state - prevents race conditions
  const [isRestoring, setIsRestoring] = useState(false);
  const [restorationAttempted, setRestorationAttempted] = useState(false);
  const [manualSaveInProgress, setManualSaveInProgress] = useState(false);

  // Update currentProjectId when parentProjectId changes
  useEffect(() => {
    if (parentProjectId && !currentProjectId) {
      console.log('📌 Setting project ID from parent:', parentProjectId);
      setCurrentProjectId(parentProjectId);
    }
  }, [parentProjectId, currentProjectId]);

  const { selectedBrand } = useBrand();
  const { toast } = useToast();

  // Extract content from selectedAsset WITH FALLBACK TO PHASE 1 METADATA
  const sourceContent = useMemo(() => {
    console.log('🔍 Extracting source content...', {
      hasAsset: !!selectedAsset,
      hasPrimaryContent: !!selectedAsset?.primary_content,
      hasContent: !!selectedAsset?.content,
      hasGlobalMetadata: !!globalMetadata,
      hasMetadataPrimaryContent: !!globalMetadata?.primary_content,
    });

    // Priority 1: Try primary_content from selectedAsset
    // Priority 2: Try from globalMetadata (passed from Phase 1)
    // Priority 3: Fall back to selectedAsset.content for backward compatibility
    const contentSource =
      selectedAsset?.primary_content ??
      globalMetadata?.primary_content ??
      selectedAsset?.content;

    if (!contentSource) {
      console.warn('⚠️ No content found in any source');
      return [];
    }

    try {
      const content = contentSource; // Already parsed object from DB
      const sections = [];

      // Common email sections mapping
      const emailSectionMappings = {
        subject_line: 'Subject Line',
        greeting: 'Greeting',
        executive_summary: 'Executive Summary',
        clinical_evidence: 'Clinical Evidence',
        mechanism_of_action: 'Mechanism of Action',
        patient_case: 'Patient Case',
        prescribing_considerations: 'Prescribing Considerations',
        safety_profile: 'Safety Profile',
        call_to_action: 'Call to Action',
        regulatory_footer: 'Regulatory Footer',
      };

      Object.entries(emailSectionMappings).forEach(([sectionKey, displayTitle]) => {
        if (content[sectionKey]) {
          const sectionData = content[sectionKey];
          let extractedText = '';

          if (typeof sectionData === 'string') {
            extractedText = sectionData;
          } else if (typeof sectionData === 'object' && sectionData !== null) {
            const parts = [];
            // Extract different content parts based on structure
            if (sectionData.headline) parts.push(`${sectionData.headline}`);
            if (sectionData.content) parts.push(sectionData.content);
            if (sectionData.primary) parts.push(sectionData.primary);
            if (sectionData.secondary) parts.push(sectionData.secondary);
            if (sectionData.engagement) parts.push(sectionData.engagement);

            // Arrays of data points / key points
            if (Array.isArray(sectionData.data_points)) {
              parts.push(sectionData.data_points.join('\n• '));
            }
            if (Array.isArray(sectionData.key_points)) {
              parts.push(sectionData.key_points.join('\n• '));
            }
            if (Array.isArray(sectionData.management_strategies)) {
              parts.push(sectionData.management_strategies.join('\n• '));
            }

            // Nested objects
            if (sectionData.copyright) parts.push(sectionData.copyright);
            if (sectionData.indication) parts.push(sectionData.indication);
            if (sectionData.important_safety) parts.push(sectionData.important_safety);
            if (sectionData.fair_balance) parts.push(sectionData.fair_balance);
            if (sectionData.prescribing_info) parts.push(sectionData.prescribing_info);

            extractedText = parts.filter(part => part && part.trim()).join('\n\n');
          }

          if (extractedText.trim()) {
            sections.push({ title: displayTitle, content: extractedText.trim() });
          }
        }
      });

      return sections;
    } catch (error) {
      console.error('Error parsing content:', error);
      return [{ title: 'Content', content: 'Error parsing content' }];
    }
  }, [selectedAsset, globalMetadata]); // FIXED: Added globalMetadata to dependency array [1](https://cognizantonline-my.sharepoint.com/personal/2397867_cognizant_com1/Documents/Microsoft%20Copilot%20Chat%20Files/EnhancedTranslationHub.txt)

  // Build localization context
  const localizationContext = useMemo(
    () => ({
      targetMarket:
        globalMetadata?.localization_context?.target_market ??
        // Current format from Phase 1
        globalMetadata?.selection_context?.market ??
        'global',
      brandId: selectedBrand?.id ?? '',
      assetType: selectedAsset?.asset_type ?? 'email',
      therapeuticArea:
        globalMetadata?.brandContext?.brandGuidelines?.therapeuticArea ?? 'general',
      indication: globalMetadata?.localization_context?.indication ?? 'general',
      channel: globalMetadata?.localization_context?.channel ?? 'email',
      targetAudience: 'healthcare-professionals',
      regulatoryRequirements: [],
    }),
    [globalMetadata, selectedBrand, selectedAsset]
  );

  // Get target language - check both data paths
  const targetLanguage = useMemo(() => {
    const market =
      globalMetadata?.localization_context?.target_market ??
      globalMetadata?.selection_context?.market;
    console.log('Phase 2 - Market Resolution:', {
      fromLocalizationContext: globalMetadata?.localization_context?.target_market,
      fromSelectionContext: globalMetadata?.selection_context?.market,
      resolvedMarket: market,
      resolvedLanguage: market ? getLanguageFromMarket(market) : 'zh',
    });
    return market ? getLanguageFromMarket(market) : 'zh'; // Default to Chinese instead of Japanese
  }, [globalMetadata]);

  // Create workflow record immediately when project ID is available
  useEffect(() => {
    const initializeWorkflow = async () => {
      if (!currentProjectId || !selectedBrand?.id || !localizationContext.targetMarket) {
        return;
      }
      console.log('🔄 Initializing workflow record for project:', currentProjectId);
      try {
        // Attempt to create workflow record (no-op if already exists)
        await TranslationPersistenceService.saveWorkflowState({
          projectId: currentProjectId,
          assetId: selectedAsset?.id ?? '',
          brandId: selectedBrand.id,
          market: localizationContext.targetMarket,
          language: targetLanguage,
          workflowStatus: 'in_progress',
          segmentTranslations: [],
          workflowProgress: {
            translation: {
              completed: false,
              lastUpdated: new Date().toISOString(),
            },
          },
        });
        console.log('✅ Workflow record initialized');

        // Also update project with language data if not already set
        const { data: project } = await supabase
          .from('localization_projects')
          .select('target_languages')
          .eq('id', currentProjectId)
          .single();

        const targetLanguages = project?.target_languages ?? null;

        if (project && (!targetLanguages || targetLanguages.length === 0)) {
          console.log('📝 Updating project with language data:', targetLanguage);
          await supabase
            .from('localization_projects')
            .update({
              target_markets: [localizationContext.targetMarket],
              target_languages: [targetLanguage],
            })
            .eq('id', currentProjectId);
        }
      } catch (error) {
        console.error('❌ Failed to initialize workflow:', error);
      }
    };
    initializeWorkflow();
  }, [
    currentProjectId,
    selectedBrand?.id,
    localizationContext.targetMarket,
    targetLanguage,
    selectedAsset?.id,
  ]);

  // Real-time database auto-save for translations
  const autoSaveStatus = useTranslationAutoSave({
    segments,
    projectId: currentProjectId,
    assetId: selectedAsset?.id ?? '',
    brandId: selectedBrand?.id ?? '',
    market: localizationContext.targetMarket,
    language: targetLanguage,
    enabled: !!currentProjectId, // Enable when project exists (removed segments.length check)
  });

  // Debug logging for auto-save status
  useEffect(() => {
    console.log('💾 Auto-save status changed:', {
      projectId: currentProjectId,
      enabled: !!currentProjectId,
      segmentCount: segments.length,
      translatedCount: segments.filter(s => s.translatedText).length,
      isSaving: autoSaveStatus.isSaving,
      lastSaved: autoSaveStatus.lastSaved,
      error: autoSaveStatus.error,
    });
  }, [autoSaveStatus, currentProjectId, segments.length]);

  // Check for existing project and auto-restore translations
  useEffect(() => {
    const checkExistingProject = async () => {
      // Priority 1: Load by project ID if available (from URL)
      if (parentProjectId) {
        console.log('🎯 Loading project by ID from URL:', parentProjectId);
        setLoadingProject(true);
        setIsRestoring(true);
        try {
          const existing = await TranslationPersistenceService.loadProjectById(parentProjectId);
          if (existing && existing.segments.length > 0) {
            console.log('📂 Found existing project with saved translations:', {
              projectId: existing.project.id,
              savedSegments: existing.segments.length,
              translatedSegments: existing.segments.filter(s => s.translatedText).length,
              targetMarkets: existing.project.target_markets,
              workflowMarket: existing.workflow?.market,
              contextMarket: localizationContext.targetMarket,
            });

            setExistingProject({
              assetName:
                selectedAsset?.asset_name ??
                selectedAsset?.name ??
                existing.project.project_name ??
                'Asset',
              market: (() => {
                const projectMarkets = existing.project.target_markets;
                const workflowMarket = existing.workflow?.market;
                if (Array.isArray(projectMarkets) && projectMarkets.length > 0) {
                  const firstMarket = projectMarkets[0];
                  if (typeof firstMarket === 'object' && firstMarket !== null) {
                    return firstMarket.market ?? firstMarket.name ?? workflowMarket ?? localizationContext.targetMarket;
                  }
                  if (typeof firstMarket === 'string') {
                    return firstMarket;
                  }
                }
                return workflowMarket ?? localizationContext.targetMarket;
              })(),
              status: existing.status,
              lastUpdated:
                existing.workflow?.updated_at ??
                existing.project?.updated_at ??
                new Date().toISOString(),
              completedSegments: existing.segments.filter(s => s.translatedText).length,
              totalSegments: existing.segments.length,
              completionDate: existing.workflow?.completed_at ?? existing.project?.completed_at,
            });

            setCurrentProjectId(existing.project.id);

            // CRITICAL: Set restoration flag BEFORE restoring segments
            setIsRestoring(true);
            setSegments(existing.segments);
            setRestorationAttempted(true);

            // Show modal as informational
            setShowResumeModal(true);
            toast({
              title: 'Project Restored',
              description: `Loaded ${existing.segments.filter(s => s.translatedText).length} saved translations`,
            });
          } else if (existing && existing.project.id) {
            // Project exists but no translations yet
            console.log('📝 Found project but no saved translations');
            setCurrentProjectId(existing.project.id);
            setRestorationAttempted(true);
          }
        } catch (error) {
          console.error('❌ Error loading project by ID:', error);
          toast({
            title: 'Error Loading Project',
            description: 'Failed to restore saved translations',
            variant: 'destructive',
          });
          setRestorationAttempted(true);
        } finally {
          setLoadingProject(false);
          setIsRestoring(false);
        }
        return;
      }

      // Priority 2: Fall back to market-based search (legacy method)
      if (!selectedAsset?.id || !selectedBrand?.id || !localizationContext.targetMarket) {
        setRestorationAttempted(true);
        return;
      }

      setLoadingProject(true);
      setIsRestoring(true);

      try {
        const existing = await TranslationPersistenceService.loadExistingProject(
          selectedAsset.id,
          selectedBrand.id,
          localizationContext.targetMarket
        );

        if (existing && existing.segments.length > 0) {
          console.log('📂 Found existing project with saved translations:', {
            projectId: existing.project.id,
            savedSegments: existing.segments.length,
            translatedSegments: existing.segments.filter(s => s.translatedText).length,
          });

          setExistingProject({
            assetName: selectedAsset.asset_name ?? selectedAsset.name ?? 'Asset',
            market: (() => {
              const projectMarkets = existing.project.target_markets;
              const workflowMarket = existing.workflow?.market;
              if (Array.isArray(projectMarkets) && projectMarkets.length > 0) {
                const firstMarket = projectMarkets[0];
                if (typeof firstMarket === 'object' && firstMarket !== null) {
                  return firstMarket.market ?? firstMarket.name ?? workflowMarket ?? localizationContext.targetMarket;
                }
                if (typeof firstMarket === 'string') {
                  return firstMarket;
                }
              }
              return workflowMarket ?? localizationContext.targetMarket;
            })(),
            status: existing.status,
            lastUpdated:
              existing.workflow?.updated_at ??
              existing.project?.updated_at ??
              new Date().toISOString(),
            completedSegments: existing.segments.filter(s => s.translatedText).length,
            totalSegments: existing.segments.length,
            completionDate: existing.workflow?.completed_at ?? existing.project?.completed_at,
          });

          setCurrentProjectId(existing.project.id);

          // CRITICAL: Set restoration flag BEFORE restoring segments
          setIsRestoring(true);
          setSegments(existing.segments);
          setRestorationAttempted(true);

          // Show modal as informational
          setShowResumeModal(true);
          toast({
            title: 'Project Restored',
            description: `Loaded ${existing.segments.filter(s => s.translatedText).length} saved translations`,
          });
        } else if (existing && existing.project.id) {
          // Project exists but no translations yet - set the project ID
          console.log('📝 Found project but no saved translations, setting project ID:', existing.project.id);
          setCurrentProjectId(existing.project.id);
          setRestorationAttempted(true);
        } else {
          // No project exists at all - create it now
          console.log('🆕 No existing project found, creating new project...');
          await createNewProject();
          setRestorationAttempted(true);
        }
      } catch (error) {
        console.error('❌ Error checking existing project:', error);
        toast({
          title: 'Error Loading Project',
          description: 'Failed to check for existing translations',
          variant: 'destructive',
        });
        setRestorationAttempted(true);
      } finally {
        setLoadingProject(false);
        setIsRestoring(false);
      }
    };

    checkExistingProject();
  }, [parentProjectId, selectedAsset?.id, selectedBrand?.id, localizationContext.targetMarket, toast]);

  // Create new localization project if needed
  const createNewProject = async () => {
    if (!selectedAsset?.id || !selectedBrand?.id || !localizationContext.targetMarket) {
      console.error('❌ Missing required data for project creation:', {
        hasAsset: !!selectedAsset?.id,
        hasBrand: !!selectedBrand?.id,
        hasMarket: !!localizationContext.targetMarket,
      });
      return;
    }

    try {
      const assetName = selectedAsset.asset_name ?? selectedAsset.name ?? 'Unnamed Asset';

      // Validate we have language data
      if (!targetLanguage) {
        console.error('❌ Missing target language for project creation');
        toast({
          title: 'Error',
          description: 'Please select a target language first',
          variant: 'destructive',
        });
        return;
      }

      const projectData = {
        brand_id: selectedBrand.id,
        source_content_id: selectedAsset.id,
        source_content_type: selectedAsset.asset_type ?? 'email',
        project_name: `${assetName} - ${localizationContext.targetMarket}`,
        description: `Localization project for ${assetName} targeting ${localizationContext.targetMarket}`,
        project_type: 'localization',
        target_markets: [localizationContext.targetMarket],
        target_languages: [targetLanguage],
        status: 'in_progress',
        metadata: {
          therapeuticArea: localizationContext.therapeuticArea,
          indication: localizationContext.indication,
          channel: localizationContext.channel,
          assetType: selectedAsset.asset_type,
          assetName: assetName,
          // Store source content metadata for restoration
          selectedAsset: selectedAsset,
          globalMetadata: globalMetadata,
        },
      };

      console.log('🆕 Creating new project with validated data:', {
        ...projectData,
        targetLanguageCount: projectData.target_languages.length,
        targetMarketCount: projectData.target_markets.length,
      });

      const { data: newProject, error } = await supabase
        .from('localization_projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating project:', error);
        toast({
          title: 'Error',
          description: 'Failed to create localization project',
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ Created new project:', newProject.id, newProject.project_name);
      setCurrentProjectId(newProject.id);
      toast({
        title: 'Project Created',
        description: `${newProject.project_name} initialized`,
      });
    } catch (error) {
      console.error('Exception creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize project',
        variant: 'destructive',
      });
    }
  };

  // Initialize segments - ONLY if restoration has been attempted and no segments exist
  useEffect(() => {
    // Priority 1: Use preloaded segments from database (when resuming via URL)
    if (preloadedSegments && preloadedSegments.length > 0 && segments.length === 0) {
      console.log('✅ Using preloaded segments from database:', preloadedSegments.length);
      const formattedSegments = preloadedSegments.map(seg => ({
        id: seg.segmentId ?? seg.id ?? `segment-${Math.random()}`,
        title: seg.title ?? 'Section',
        content: seg.sourceText ?? seg.content ?? '',
        wordCount:
          seg.wordCount ??
          (seg.sourceText ?? seg.content ?? '').split(/\s+/).length,
        translationStatus: seg.status ?? seg.translationStatus ?? 'pending',
        translatedText: seg.targetText ?? seg.translatedText ?? '',
        confidence: seg.confidence ?? 0,
        tmMatchPercentage: seg.tmMatchPercentage ?? 0,
        translationMethod: seg.method ?? seg.translationMethod ?? 'pending',
        isLocked: seg.isLocked ?? false,
      }));
      setSegments(formattedSegments);
      setRestorationAttempted(true);
      return;
    }

    // Priority 2: Skip if no source content or asset
    if (sourceContent.length === 0 || !selectedAsset?.id) {
      console.log('⏸️ Skipping segment initialization:', {
        hasSourceContent: sourceContent.length > 0,
        hasAsset: !!selectedAsset?.id,
      });
      return;
    }

    // Priority 3: Wait for restoration check to complete
    if (loadingProject || isRestoring) {
      console.log('⏸️ Waiting for project check/restoration to complete');
      return; // Wait for project check and restoration to complete
    }

    if (!restorationAttempted) {
      console.log('⏸️ Waiting for restoration attempt');
      return; // Wait for restoration attempt
    }

    if (segments.length > 0) {
      console.log('⏸️ Segments already exist, skipping initialization');
      return; // Don't overwrite existing segments
    }

    // Priority 4: Create fresh segments from source content
    console.log('🆕 Initializing fresh segments from source content (no restoration data found)');

    const initialSegments = sourceContent.map((section, index) => ({
      id: `segment-${index}`,
      title: section.title,
      content: section.content,
      wordCount: section.content.split(/\s+/).filter(w => w.length > 0).length,
      translationStatus: 'pending',
      tmMatches: [],
      translatedText: '',
      confidence: 0,
    }));

    setSegments(initialSegments);

    // CRITICAL: Immediately save these fresh segments to database
    if (currentProjectId && initialSegments.length > 0) {
      console.log('💾 Immediately saving fresh segments to prevent data loss');
      TranslationPersistenceService.saveWorkflowState({
        projectId: currentProjectId,
        assetId: selectedAsset.id,
        brandId: selectedBrand?.id ?? selectedAsset.brand_id ?? 'demo-brand-id',
        market: localizationContext.targetMarket,
        language: targetLanguage,
        workflowStatus: 'in_progress',
        segmentTranslations: initialSegments,
        workflowProgress: {
          translation: {
            completed: false,
            lastUpdated: new Date().toISOString(),
          },
        },
      }).then(success => {
        if (success) {
          console.log('✅ Fresh segments saved successfully');
          toast({
            title: 'Segments Created',
            description: `${initialSegments.length} segments ready for translation`,
          });
        } else {
          console.error('❌ Failed to save fresh segments');
          toast({
            title: 'Warning',
            description: 'Segments created but save failed. Please use manual save.',
            variant: 'destructive',
          });
        }
      });
    }
  }, [
    preloadedSegments,
    sourceContent,
    selectedAsset?.id,
    loadingProject,
    isRestoring,
    restorationAttempted,
    segments.length,
    currentProjectId,
    localizationContext,
    targetLanguage,
    selectedBrand,
    toast,
  ]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalWords = segments.reduce((sum, seg) => sum + seg.wordCount, 0);
    const matchedWords = memoryMatches.reduce((sum, match) => {
      return sum + (match.sourceText?.split(/\s+/).length ?? 0);
    }, 0);
    const newWords = Math.max(0, totalWords - matchedWords);
    const leveragePercentage = totalWords > 0 ? (matchedWords / totalWords) * 100 : 0;
    return {
      totalWords,
      matchedWords,
      newWords,
      leveragePercentage,
      estimatedSavings: {
        time: Math.round((leveragePercentage / 100) * 8),
        cost: Math.round((leveragePercentage / 100) * 500),
      },
    };
  }, [segments, memoryMatches]);

  // Translation Memory search
  const handleTMSearch = async (text) => {
    try {
      const result = await EnhancedSmartTMEngine.enhancedTMSearch(
        text,
        'en',
        targetLanguage,
        localizationContext
      );
      return result?.matches ?? [];
    } catch (error) {
      console.error('TM search failed:', error);
      return [];
    }
  };

  // TM Search with drawer
  const handleTMSearchWithDrawer = async (text, segmentId) => {
    try {
      // Set loading for this specific segment
      setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, isLoadingTM: true } : seg)));

      const matches = await handleTMSearch(text);

      if (matches && matches.length > 0) {
        const bestMatch = matches[0];
        const result = {
          translation: bestMatch.targetText ?? '',
          matchPercentage: bestMatch.matchPercentage ?? 0,
          source: 'Translation Memory',
        };
        setTmResult(result);

        // Store in segment state for persistence
        setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, tmResult: result, isLoadingTM: false } : seg)));

        setCurrentSegmentId(segmentId);
        setWorkflowStatus({ tmComplete: true, aiComplete: false, selectionMade: false });
        setDrawerOpen(true);

        toast({
          title: 'Translation Memory Match Found',
          description: `Found ${bestMatch.matchPercentage}% match - view in comparison drawer`,
        });
      } else {
        setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, isLoadingTM: false } : seg)));
        toast({
          title: 'No Exact Match',
          description: 'Consider using AI translation for this segment',
          variant: 'default',
        });
      }
    } catch (error) {
      setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, isLoadingTM: false } : seg)));
      toast({
        title: 'TM Search Failed',
        description: 'Could not retrieve translation memory matches',
        variant: 'destructive',
      });
    }
  };

  // AI Translation
  const handleAITranslation = async (text) => {
    try {
      // Ensure we have a valid project ID
      if (!currentProjectId) {
        console.error('❌ No project ID available for AI translation');
        throw new Error('Project not initialized - please wait for project creation');
      }
      console.log('🤖 AI Translation with project ID:', currentProjectId);

      const result = await AITranslationEngine.translateSegment({
        sourceText: text,
        sourceLanguage: 'en',
        targetLanguage,
        contentType: 'general',
        brandId: localizationContext.brandId ?? 'default',
        therapeuticArea: localizationContext.therapeuticArea ?? 'general',
        projectId: currentProjectId,
        assetId: selectedAsset?.id ?? 'temp-asset',
      });

      return result?.translatedText ?? 'Translation failed';
    } catch (error) {
      console.error('AI translation failed:', error);
      throw error;
    }
  };

  // AI Translation with drawer
  const handleAITranslationWithDrawer = async (text, segmentId) => {
    try {
      setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, isLoadingAI: true } : seg)));
      const translation = await handleAITranslation(text);
      const result = { translation };
      setAiResult(result);

      setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, aiResult: result, isLoadingAI: false } : seg)));
      setCurrentSegmentId(segmentId);
      setWorkflowStatus(prev => ({ ...prev, aiComplete: true }));
      setDrawerOpen(true);

      toast({
        title: 'AI Translation Generated',
        description: 'View translation in comparison drawer',
      });
    } catch (error) {
      setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, isLoadingAI: false } : seg)));
      toast({
        title: 'AI Translation Failed',
        description: 'Could not generate translation',
        variant: 'destructive',
      });
    }
  };

  // Apply TM translation from drawer - auto closes drawer
  const handleUseTM = () => {
    if (!currentSegmentId || !tmResult) return;
    handleSegmentTranslated(currentSegmentId, tmResult.translation, 'memory', tmResult.matchPercentage, 'tm');
    setWorkflowStatus(prev => ({ ...prev, selectionMade: true }));
    setDrawerOpen(false);
    toast({
      title: 'TM Translation Applied',
      description: `Applied translation with ${tmResult.matchPercentage}% match`,
    });
  };

  // Apply AI translation from drawer - auto closes drawer
  const handleUseAI = () => {
    if (!currentSegmentId || !aiResult) return;
    handleSegmentTranslated(currentSegmentId, aiResult.translation, 'ai', undefined, 'ai');
    setWorkflowStatus(prev => ({ ...prev, selectionMade: true }));
    setDrawerOpen(false);
    toast({
      title: 'AI Translation Applied',
      description: 'AI-generated translation has been applied',
    });
  };

  // Run AI translation from within the drawer
  const handleRunAIFromDrawer = async () => {
    if (!currentSegmentId) return;
    const currentSegment = segments.find(seg => seg.id === currentSegmentId);
    if (!currentSegment) return;

    try {
      const translation = await handleAITranslation(currentSegment.content);
      setAiResult({ translation });
      setWorkflowStatus(prev => ({ ...prev, aiComplete: true }));
      toast({
        title: 'AI Translation Generated',
        description: 'AI translation added to comparison',
      });
    } catch (error) {
      toast({
        title: 'AI Translation Failed',
        description: 'Could not generate AI translation',
        variant: 'destructive',
      });
    }
  };

  // Run both TM and AI simultaneously - smart loading from cache
  const handleCompareBoth = async (segmentId, text) => {
    setCurrentSegmentId(segmentId);

    const existingSegment = segments.find(seg => seg.id === segmentId);
    const hasTM = !!existingSegment?.tmResult;
    const hasAI = !!existingSegment?.aiResult;

    // If both results exist, open drawer with existing results
    if (hasTM && hasAI) {
      setTmResult(existingSegment.tmResult);
      setAiResult(existingSegment.aiResult);
      setWorkflowStatus({ tmComplete: true, aiComplete: true, selectionMade: false });
      setDrawerOpen(true);
      toast({
        title: 'Comparison Ready',
        description: 'Using existing TM and AI translations',
      });
      return;
    }

    setWorkflowStatus({ tmComplete: hasTM, aiComplete: hasAI, selectionMade: false });

    // Set loading for this specific segment
    setSegments(prev =>
      prev.map(seg =>
        seg.id === segmentId ? { ...seg, isLoadingTM: !hasTM, isLoadingAI: !hasAI } : seg
      )
    );

    try {
      // TM search if not cached
      if (!hasTM) {
        const matches = await handleTMSearch(text);
        if (matches && matches.length > 0) {
          const bestMatch = matches[0];
          const tmRes = {
            translation: bestMatch.targetText ?? '',
            matchPercentage: bestMatch.matchPercentage ?? 0,
            source: 'Translation Memory',
          };
          setTmResult(tmRes);
          setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, tmResult: tmRes, isLoadingTM: false } : seg)));
          setWorkflowStatus(prev => ({ ...prev, tmComplete: true }));
        } else {
          setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, isLoadingTM: false } : seg)));
        }
      } else {
        setTmResult(existingSegment.tmResult);
      }

      // AI translation if not cached
      if (!hasAI) {
        const aiTranslation = await handleAITranslation(text);
        const aiRes = { translation: aiTranslation };
        setAiResult(aiRes);
        setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, aiResult: aiRes, isLoadingAI: false } : seg)));
        setWorkflowStatus(prev => ({ ...prev, aiComplete: true }));
      } else {
        setAiResult(existingSegment.aiResult);
      }

      setDrawerOpen(true);
      toast({
        title: 'Comparison Ready',
        description: 'Both TM and AI translations generated',
      });
    } catch (error) {
      setSegments(prev =>
        prev.map(seg =>
          seg.id === segmentId ? { ...seg, isLoadingTM: false, isLoadingAI: false } : seg
        )
      );
      toast({
        title: 'Translation Error',
        description: 'Failed to generate comparison translations',
        variant: 'destructive',
      });
    }
  };

  // Handle segment translation completion
  const handleSegmentTranslated = (
    segmentId,
    translation,
    method,
    tmMatchPercentage,
    translationMethod
  ) => {
    const segment = segments.find(s => s.id === segmentId);

    setSegments(prev =>
      prev.map(seg =>
        seg.id === segmentId
          ? {
              ...seg,
              translatedText: translation,
              translationStatus: method,
              tmMatchPercentage,
              translationMethod,
              isLocked: false,
            }
          : seg
      )
    );

    // Auto-save happens via useTranslationAutoSave hook
    // Save to database asynchronously (non-blocking)
    if (segment && selectedBrand?.id) {
      const saveToDatabase = async () => {
        try {
          if (method === 'memory' && tmMatchPercentage) {
            // Save as TM segment
            await TranslationPersistenceService.saveTMSegment({
              sourceText: segment.content,
              targetText: translation,
              sourceLanguage: globalMetadata?.sourceLanguage ?? 'en',
              targetLanguage: targetLanguage,
              brandId: selectedBrand.id,
              assetId: selectedAsset?.id,
              projectId: currentProjectId ?? undefined,
              market: localizationContext.targetMarket,
              matchType: 'exact',
              qualityScore: tmMatchPercentage,
              confidenceScore: tmMatchPercentage,
            });
            console.log('✅ Saved TM match to Smart TM:', segmentId);
          } else if (method === 'ai') {
            // Save as AI translation
            await TranslationPersistenceService.saveAITranslation(
              segment.content,
              translation,
              {
                sourceLanguage: globalMetadata?.sourceLanguage ?? 'en',
                targetLanguage: targetLanguage,
                engine: 'gemini',
                confidence: segment.confidence ?? 0,
              },
              selectedBrand.id,
              selectedAsset?.id,
              currentProjectId ?? undefined
            );
            console.log('✅ Saved AI translation to database:', segmentId);
          } else if (method === 'manual' && translation.trim().length > 0) {
            // Save manual translations to Smart TM for future reuse
            await TranslationPersistenceService.saveTMSegment({
              sourceText: segment.content,
              targetText: translation,
              sourceLanguage: globalMetadata?.sourceLanguage ?? 'en',
              targetLanguage: targetLanguage,
              brandId: selectedBrand.id,
              assetId: selectedAsset?.id,
              projectId: currentProjectId ?? undefined,
              market: localizationContext.targetMarket,
              matchType: 'exact',
              qualityScore: 95, // High quality for manually reviewed translations
              confidenceScore: 100, // Full confidence for manual translations
              contextMetadata: {
                translationMethod: 'manual',
                segmentType: segment.title,
              },
            });
            console.log('✅ Saved manual translation to Smart TM:', segmentId);
          }
        } catch (error) {
          console.error('Error saving translation to database:', error);
        }
      };
      saveToDatabase();
    }

    toast({
      title: 'Segment Translated',
      description: `Translation completed using ${method}`,
    });
  };

  const handleResetTranslation = (segmentId) => {
    setSegments(prev =>
      prev.map(seg =>
        seg.id === segmentId
          ? {
              ...seg,
              translatedText: '',
              translationStatus: 'pending',
              translationMethod: undefined,
              tmMatchPercentage: undefined,
              isLocked: false,
              tmResult: undefined,
              aiResult: undefined,
            }
          : seg
      )
    );
    toast({
      title: 'Translation Reset',
      description: 'You can now re-run TM Search or AI Translate',
    });
  };

  const handleLockTranslation = (segmentId) => {
    setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, isLocked: true } : seg)));
    toast({
      title: 'Section Locked',
      description: 'Translation finalized for this section',
    });
  };

  const handleUnlockTranslation = (segmentId) => {
    setSegments(prev => prev.map(seg => (seg.id === segmentId ? { ...seg, isLocked: false } : seg)));
    toast({
      title: 'Section Unlocked',
      description: 'You can now edit this translation',
    });
  };

  // Generate final combined translation
  const generateFinalTranslation = () => {
    const combined = segments
      .filter(seg => seg.translatedText)
      .map(seg => `${seg.title.toUpperCase()}:\n${seg.translatedText}`)
      .join('\n\n');

    setFinalTranslation(combined);
    setActiveTab('final');

    toast({
      title: 'Final Translation Generated',
      description: 'Combined all segment translations',
    });
  };

  // Load memory matches for all segments
  const [isLoadingAllTM, setIsLoadingAllTM] = useState(false);
  const loadAllMemoryMatches = async () => {
    setIsLoadingAllTM(true);
    try {
      const allMatches = [];
      for (const segment of segments) {
        const matches = await handleTMSearch(segment.content);
        allMatches.push(...matches);
      }
      setMemoryMatches(allMatches);
      toast({
        title: 'TM Analysis Complete',
        description: `Found ${allMatches.length} memory matches`,
      });
    } catch (error) {
      // Error loading memory matches
    } finally {
      setIsLoadingAllTM(false);
    }
  };

  // Continue to next phase
  const handleContinue = async () => {
    // Save project and workflow to database before continuing
    if (selectedBrand?.id && selectedAsset?.id) {
      try {
        const projectId = await TranslationPersistenceService.upsertLocalizationProject({
          projectName: selectedAsset.asset_name ?? selectedAsset.name ?? 'Asset',
          assetId: selectedAsset.id,
          assetName: selectedAsset.asset_name ?? selectedAsset.name ?? 'Asset',
          brandId: selectedBrand.id,
          targetMarkets: [localizationContext.targetMarket],
          sourceLanguage: globalMetadata?.sourceLanguage ?? 'en',
          status: 'in_progress',
          workflowState: {
            currentPhase: 'translation',
            segments: segments,
            analytics: analytics,
          },
        });

        if (projectId) {
          setCurrentProjectId(projectId);

          // Save workflow state
          await TranslationPersistenceService.saveWorkflowState({
            projectId,
            assetId: selectedAsset.id,
            brandId: selectedBrand.id,
            market: localizationContext.targetMarket,
            language: targetLanguage,
            segmentTranslations: segments,
            workflowStatus: 'completed',
            completedSteps: ['translation_hub'],
            workflowProgress: {
              translation: {
                completed: true,
                lastUpdated: new Date().toISOString(),
              },
            },
          });

          // Batch save all translated segments to TM
          const tmSegments = segments
            .filter(s => s.translatedText)
            .map(s => ({
              sourceText: s.content,
              targetText: s.translatedText ?? '',
              sourceLanguage: globalMetadata?.sourceLanguage ?? 'en',
              targetLanguage: targetLanguage,
              brandId: selectedBrand.id,
              assetId: selectedAsset.id,
              projectId: projectId,
              market: localizationContext.targetMarket,
              matchType: s.translationMethod ?? 'manual',
              qualityScore: s.tmMatchPercentage ?? 0,
              confidenceScore: s.confidence ?? 0,
            }));

          if (tmSegments.length > 0) {
            const saved = await TranslationPersistenceService.batchSaveSegments(tmSegments);
            console.log(`Saved ${saved} segments to translation memory`);
          }
        }
      } catch (error) {
        console.error('Error saving project to database:', error);
      }
    }

    const completionData = {
      translatedContent: finalTranslation,
      segments: segments,
      analytics: analytics,
      memoryMatches: memoryMatches,
      targetLanguage: targetLanguage,
      targetMarket: globalMetadata?.localization_context?.target_market,
      projectData: {
        projectName: selectedAsset?.asset_name ?? 'Translation Project',
        brandName: globalMetadata?.brandContext?.brandGuidelines?.company ?? 'Brand',
        sourceLanguage: 'en',
        targetLanguage,
        targetMarket: globalMetadata?.localization_context?.market_display_name ?? 'Global',
        ...analytics,
        segments: segments,
      },
    };

    onPhaseComplete(completionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Draft Translation Hub</h2>
          <p className="text-muted-foreground">
            {selectedAsset?.asset_name} → {targetLanguage.toUpperCase()}
          </p>
        </div>
        <SaveStatusIndicator
          isSaving={autoSaveStatus.isSaving}
          lastSaved={autoSaveStatus.lastSaved}
          error={autoSaveStatus.error}
          onManualSave={autoSaveStatus.forceSave}
        />
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="segments">Content Segments</TabsTrigger>
          <TabsTrigger value="analytics">TM Analytics</TabsTrigger>
          <TabsTrigger value="final">Draft Overview</TabsTrigger>
          <TabsTrigger value="handoff">Agency Handoff</TabsTrigger>
          <TabsTrigger value="recovery">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={generateFinalTranslation}>
              <Target className="h-4 w-4 mr-2" />
              Generate Draft Translation
            </Button>
          </div>

          {/* Content Segments Display with Sidebar Navigation */}
          {sourceContent.length > 0 ? (
            <div className="flex gap-6 h-[600px]">
              {/* Left Sidebar - Section Navigation */}
              <div className="w-80 border-r bg-muted/20 rounded-lg p-4 overflow-auto">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-4">
                    Content Sections
                  </h3>

                  {sourceContent.map((section, index) => {
                    const segment = segments.find(seg => seg.id === `segment-${index}`);
                    const isSelected = selectedSectionIndex === index;
                    const wordCount = section.content.split(/\s+/).length;

                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-background hover:bg-muted border'
                        }`}
                        onClick={() => setSelectedSectionIndex(index)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{section.title}</h4>
                          <div className="flex items-center gap-1">
                            {segment?.isLocked ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : segment?.translatedText ? (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Method Badge */}
                        {segment?.translationMethod && (
                          <div className="mt-1">
                            {segment.translationMethod === 'tm' && (
                              <Badge variant="default" className="text-xs bg-green-500 text-white">
                                🧠 TM: {segment.tmMatchPercentage}%
                              </Badge>
                            )}
                            {segment.translationMethod === 'ai' && (
                              <Badge variant="default" className="text-xs bg-blue-500 text-white">
                                🤖 AI Generated
                              </Badge>
                            )}
                            {segment.translationMethod === 'manual' && (
                              <Badge variant="secondary" className="text-xs">
                                ✍️ Manual
                              </Badge>
                            )}
                            {segment.translationMethod === 'blend' && (
                              <Badge variant="default" className="text-xs bg-orange-500 text-white">
                                🎨 Blend
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs opacity-80 mt-1">
                          <span>{wordCount} words</span>
                          {segment?.translationStatus && segment.translationStatus !== 'pending' && (
                            <Badge variant="secondary" className="text-xs">
                              {segment.translationStatus}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main Content Area - Single Section Focus */}
              <div className="flex-1 space-y-4">
                {sourceContent[selectedSectionIndex] && (
                  <Card className="h-full flex flex-col relative">
                    {/* Per-Segment Loading Overlay */}
                    {(() => {
                      const currentSegment = segments.find(seg => seg.id === `segment-${selectedSectionIndex}`);
                      return (currentSegment?.isLoadingTM || currentSegment?.isLoadingAI) && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse z-10 rounded-t-lg" />
                      );
                    })()}

                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {sourceContent[selectedSectionIndex].title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {sourceContent[selectedSectionIndex].content.split(/\s+/).length} words
                          </Badge>
                          {segments.find(seg => seg.id === `segment-${selectedSectionIndex}`)?.translatedText && (
                            <Badge variant="default" className="text-xs">Translated</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col space-y-4">
                      {/* Source Content Panel */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Source Content (English):
                        </label>
                        <div className="p-4 bg-muted rounded-lg text-sm max-h-32 overflow-auto border">
                          {sourceContent[selectedSectionIndex].content}
                        </div>
                      </div>

                      {/* Translation Panel */}
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Translation ({targetLanguage.toUpperCase()}):
                        </label>
                        <Textarea
                          placeholder="Enter translation here or use TM/AI tools below..."
                          className="flex-1 min-h-40 resize-none"
                          value={
                            segments.find(seg => seg.id === `segment-${selectedSectionIndex}`)?.translatedText ?? ''
                          }
                          onChange={(e) =>
                            handleSegmentTranslated(
                              `segment-${selectedSectionIndex}`,
                              e.target.value,
                              'manual',
                              undefined,
                              'manual'
                            )
                          }
                        />
                      </div>

                      {/* Action Button Bar */}
                      <TooltipProvider>
                        <div className="flex gap-2 pt-2 border-t">
                          {(() => {
                            const currentSegment = segments.find(seg => seg.id === `segment-${selectedSectionIndex}`);
                            const isLocked = currentSegment?.isLocked;
                            const usedTM = currentSegment?.translationMethod === 'tm';
                            const usedAI = currentSegment?.translationMethod === 'ai';
                            const usedBoth = currentSegment?.translationMethod === 'blend';

                            return (
                              <>
                                {/* TM Search Button */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex-1">
                                      <Button
                                        variant={usedTM ? 'default' : 'outline'}
                                        onClick={() =>
                                          handleTMSearchWithDrawer(
                                            sourceContent[selectedSectionIndex].content,
                                            `segment-${selectedSectionIndex}`
                                          )
                                        }
                                        disabled={
                                          currentSegment?.isLoadingTM ||
                                          currentSegment?.isLoadingAI ||
                                          isLocked ||
                                          usedTM ||
                                          usedBoth
                                        }
                                        className="w-full"
                                      >
                                        {currentSegment?.isLoadingTM ? (
                                          <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Searching...
                                          </>
                                        ) : usedTM ? (
                                          <>
                                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                            TM: {currentSegment?.tmMatchPercentage}%
                                          </>
                                        ) : (
                                          <>
                                            <Brain className="h-4 w-4 mr-2" />
                                            TM Search
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {isLocked
                                      ? 'Section locked - click Unlock to make changes'
                                      : usedTM
                                      ? `Already used TM translation (${currentSegment?.tmMatchPercentage}% match) - click Reset to change`
                                      : 'Search Translation Memory for matches'}
                                  </TooltipContent>
                                </Tooltip>

                                {/* AI Translate Button */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex-1">
                                      <Button
                                        variant={usedAI ? 'default' : 'outline'}
                                        onClick={() =>
                                          handleAITranslationWithDrawer(
                                            sourceContent[selectedSectionIndex].content,
                                            `segment-${selectedSectionIndex}`
                                          )
                                        }
                                        disabled={
                                          currentSegment?.isLoadingTM ||
                                          currentSegment?.isLoadingAI ||
                                          isLocked ||
                                          usedAI ||
                                          usedBoth
                                        }
                                        className="w-full"
                                      >
                                        {currentSegment?.isLoadingAI ? (
                                          <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Translating...
                                          </>
                                        ) : usedAI ? (
                                          <>
                                            <CheckCircle2 className="h-4 w-4 mr-2 text-blue-500" />
                                            AI Done
                                          </>
                                        ) : (
                                          <>
                                            <Bot className="h-4 w-4 mr-2" />
                                            AI Translate
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {isLocked
                                      ? 'Section locked - click Unlock to make changes'
                                      : usedAI
                                      ? 'Already used AI translation - click Reset to change'
                                      : 'Generate AI translation'}
                                  </TooltipContent>
                                </Tooltip>

                                {/* Compare Both Button */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex-1">
                                      <Button
                                        variant={usedBoth ? 'default' : 'outline'}
                                        onClick={() =>
                                          handleCompareBoth(
                                            `segment-${selectedSectionIndex}`,
                                            sourceContent[selectedSectionIndex].content
                                          )
                                        }
                                        disabled={
                                          currentSegment?.isLoadingTM ||
                                          currentSegment?.isLoadingAI ||
                                          isLocked ||
                                          usedBoth
                                        }
                                        className="w-full"
                                      >
                                        {(currentSegment?.isLoadingTM || currentSegment?.isLoadingAI) ? (
                                          <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Processing...
                                          </>
                                        ) : usedBoth ? (
                                          <>
                                            <CheckCircle2 className="h-4 w-4 mr-2 text-orange-500" />
                                            Blend Done
                                          </>
                                        ) : (
                                          <>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Compare Both
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {isLocked
                                      ? 'Section locked - click Unlock to make changes'
                                      : usedBoth
                                      ? 'Translation complete - click Reset to change'
                                      : 'Run both TM Search and AI Translation'}
                                  </TooltipContent>
                                </Tooltip>
                              </>
                            );
                          })()}
                        </div>

                        {/* Reset/Lock buttons */}
                        {(() => {
                          const currentSegment = segments.find(seg => seg.id === `segment-${selectedSectionIndex}`);
                          const hasTranslation = !!currentSegment?.translatedText;
                          const isLocked = currentSegment?.isLocked;

                          return (
                            hasTranslation && (
                              <div className="flex gap-2 pt-2">
                                {!isLocked ? (
                                  <>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleResetTranslation(`segment-${selectedSectionIndex}`)}
                                        >
                                          <RefreshCw className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Reset translation</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="default"
                                          size="sm"
                                          onClick={() => handleLockTranslation(`segment-${selectedSectionIndex}`)}
                                        >
                                          <Lock className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Lock translation (mark as final)</TooltipContent>
                                    </Tooltip>
                                  </>
                                ) : (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUnlockTranslation(`segment-${selectedSectionIndex}`)}
                                      >
                                        <Unlock className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Unlock translation</TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            )
                          );
                        })()}
                      </TooltipProvider>

                      {/* Navigation */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSectionIndex(Math.max(0, selectedSectionIndex - 1))}
                          disabled={selectedSectionIndex === 0}
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {selectedSectionIndex + 1} of {sourceContent.length}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedSectionIndex(Math.min(sourceContent.length - 1, selectedSectionIndex + 1))
                          }
                          disabled={selectedSectionIndex === sourceContent.length - 1}
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No Content Segments Found</h3>
                <p className="text-sm text-muted-foreground">
                  Waiting for content to be parsed from the selected asset...
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="flex items-center gap-2">
            <Button onClick={loadAllMemoryMatches} disabled={isLoadingAllTM}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingAllTM ? 'animate-spin' : ''}`} />
              Analyze TM
            </Button>
            <p className="text-sm text-muted-foreground">Run comprehensive TM analysis for all segments</p>
          </div>

          <TranslationMemoryAnalytics
            sourceWordCount={analytics.totalWords}
            segmentUsage={segments.map(segment => ({
              sourceText: segment.content,
              targetText: segment.translatedText ?? '',
              matchPercentage: segment.tmMatchPercentage ?? 0,
              matchType: segment.translationMethod ?? 'manual',
              wordCount: segment.content.split(/\s+/).filter(w => w.length > 0).length,
              usedTM: (segment.tmMatchPercentage ?? 0) >= 70,
            }))}
            targetLanguage={targetLanguage}
          />
        </TabsContent>

        <TabsContent value="final" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Draft Translation ({targetLanguage.toUpperCase()})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={finalTranslation}
                onChange={(e) => setFinalTranslation(e.target.value)}
                className="min-h-80"
                placeholder="Draft combined translation will appear here..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handoff">
          <ProfessionalAgencyPDF
            projectData={{
              projectName: selectedAsset?.asset_name ?? 'Translation Project',
              brandName: globalMetadata?.brandContext?.brandGuidelines?.company ?? 'Brand',
              sourceLanguage: 'en',
              targetLanguage,
              targetMarket: globalMetadata?.localization_context?.market_display_name ?? 'Global',
              ...analytics,
              segments: segments,
              tmAnalytics: analytics,
            }}
            onDownload={() => {
              toast({
                title: 'PDF Downloaded',
                description: 'Agency handoff document ready',
              });
            }}
          />
        </TabsContent>

        <TabsContent value="recovery" className="space-y-4">
          <DataRecoveryPanel
            projectId={currentProjectId}
            brandId={selectedBrand?.id ?? ''}
            assetId={selectedAsset?.id ?? ''}
            market={localizationContext.targetMarket}
            currentSegments={segments}
            onDataRestored={(restoredSegments) => {
              setSegments(restoredSegments);
              toast({
                title: 'Data Restored',
                description: `Successfully restored ${restoredSegments.length} segments`,
              });
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!finalTranslation}>
          Continue to Cultural Intelligence
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Translation Comparison Drawer */}
      <TranslationComparisonDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        tmResult={tmResult}
        aiResult={aiResult}
        onUseTM={handleUseTM}
        onUseAI={handleUseAI}
        onRunAI={handleRunAIFromDrawer}
        sourceText={segments.find(s => s.id === currentSegmentId)?.content}
        isLoadingAI={segments.find(s => s.id === currentSegmentId)?.isLoadingAI ?? false}
        sectionTitle={currentSegmentId ? segments.find(s => s.id === currentSegmentId)?.title : undefined}
        workflowStatus={workflowStatus}
      />

      {/* Resume Project Modal */}
      {existingProject && (
        <ResumeProjectModal
          open={showResumeModal}
          onOpenChange={setShowResumeModal}
          projectData={{
            assetId: selectedAsset?.id,
            assetName: existingProject.source_asset_name ?? selectedAsset?.name ?? '',
            market: localizationContext.targetMarket ?? '',
            status: existingProject.localization_status ?? 'draft',
            lastUpdated: existingProject.updated_at ?? new Date().toISOString(),
            completedSegments: segments.filter(s => s.translatedText).length,
            totalSegments: segments.length,
            completionDate: existingProject.completed_at,
          }}
          onResume={async () => {
            setShowResumeModal(false);
            toast({ title: 'Continuing Project', description: 'Your translations are preserved' });
          }}
          onStartFresh={async () => {
            // Reset segments to fresh state
            if (sourceContent.length > 0) {
              const freshSegments = sourceContent.map((section, index) => ({
                id: `segment-${index}`,
                title: section.title,
                content: section.content,
                wordCount: section.content.split(/\s+/).filter(w => w.length > 0).length,
                translationStatus: 'pending',
                tmMatches: [],
                translatedText: '',
                confidence: 0,
              }));
              setSegments(freshSegments);
            }
            setShowResumeModal(false);
            toast({ title: 'Starting Fresh', description: 'Creating new translation' });
          }}
          onViewOnly={() => {
            setShowResumeModal(false);
            setActiveTab('final');
          }}
        />
      )}
    </div>
  );
};
