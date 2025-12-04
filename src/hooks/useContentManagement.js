import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { ContentService } from '@/services/contentService';
import { AssetTypeMapper } from '@/utils/assetTypeMapper';
import { BrowserAIService } from '@/services/browserAIService';
import { supabase } from '@/integrations/supabase/client';

export const useContentManagement = ({
  projectId,
  assetId,
  autoSave = true,
  autoSaveInterval = 30000,
  themeId,
  intakeContext
} = {}) => {
  const { user } = useAuth();
  const { selectedBrand } = useBrand();

  // State management
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [assets, setAssets] = useState([]);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [variations, setVariations] = useState([]);
  const [versions, setVersions] = useState([]);
  const [handoffs, setHandoffs] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzingContent, setAnalyzingContent] = useState(false);

  // Load projects and all assets
  const loadProjects = useCallback(async () => {
    if (!selectedBrand?.id) return;

    setLoading(true);
    try {
      const projectsData = await ContentService.getProjects(selectedBrand.id);
      setProjects(projectsData);
      
      // Load all assets for the brand directly
      const allAssetsData = await ContentService.getAllAssetsForBrand(selectedBrand.id);
      setAssets(allAssetsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [selectedBrand?.id]);

  // Load all assets for the selected brand
  const loadAllAssets = useCallback(async () => {
    if (!selectedBrand?.id) return;

    setLoading(true);
    try {
      const allAssetsData = await ContentService.getAllAssetsForBrand(selectedBrand.id);
      setAssets(allAssetsData);
      return allAssetsData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assets');
      return [];
    } finally {
      setLoading(false);
    }
  }, [selectedBrand?.id]);

  // Load specific project
  const loadProject = useCallback(async (id) => {
    setLoading(true);
    try {
      const project = await ContentService.getProject(id);
      setCurrentProject(project);
      
      if (project) {
        const assetsData = await ContentService.getAssets(project.id);
        setAssets(assetsData);
        
        const handoffsData = await ContentService.getHandoffs(project.id);
        setHandoffs(handoffsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load specific asset with retry logic for new assets
  const loadAsset = useCallback(async (id, isNewAsset = false, maxRetries = 3) => {
    setLoading(true);
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const asset = await ContentService.getAsset(id);
        
        if (asset) {
          setCurrentAsset(asset);
          
          const variationsData = await ContentService.getVariations(asset.id);
          setVariations(variationsData);
          
          const versionsData = await ContentService.getVersions(asset.id);
          setVersions(versionsData);
          
          setLoading(false);
          return;
        }
        
        // If it's a new asset and not found, retry
        if (isNewAsset && attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
          continue;
        }
        
        break;
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
        }
      }
    }
    
    setError(lastError instanceof Error ? lastError.message : 'Failed to load asset');
    setLoading(false);
  }, []);

  // Create new project
  const createProject = useCallback(async (projectData) => {
    if (!selectedBrand?.id || !user?.id) return null;

    setSaving(true);
    try {
      const newProject = await ContentService.createProject({
        ...projectData,
        brand_id: selectedBrand.id,
        created_by: user.id
      });
      
      setProjects(prev => [newProject, ...prev]);
      setCurrentProject(newProject);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      return null;
    } finally {
      setSaving(false);
    }
  }, [selectedBrand?.id, user?.id]);

  // Create new asset
  const createAsset = useCallback(async (
    assetData,
    intakeAssetType,
    projectId
  ) => {
    const effectiveProjectId = projectId || currentProject?.id;
    if (!selectedBrand?.id || !user?.id || !effectiveProjectId) return null;

    setSaving(true);
    try {
      // Get project to inherit theme_id (Phase 1)
      const project = await ContentService.getProject(effectiveProjectId);
      
      const assetWithCorrectType = {
        ...assetData,
        project_id: effectiveProjectId,
        brand_id: selectedBrand.id,
        theme_id: project?.theme_id || null, // Inherit theme_id from project
        created_by: user.id,
        intake_asset_type: intakeAssetType
      };
      
      const newAsset = await ContentService.createAssetWithCorrectType(assetWithCorrectType);
      
      // Phase 1: Populate asset_themes table if project has theme
      if (project?.theme_id) {
        await supabase.from('asset_themes').insert({
          asset_id: newAsset.id,
          theme_id: project.theme_id,
          brand_id: selectedBrand.id,
          asset_type: newAsset.asset_type,
          status: 'planned',
          created_by: user.id
        });
      }
      
      setAssets(prev => [newAsset, ...prev]);
      setCurrentAsset(newAsset);
      return newAsset;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create asset');
      return null;
    } finally {
      setSaving(false);
    }
  }, [selectedBrand?.id, user?.id, currentProject?.id]);

  // Update asset content
  const updateAssetContent = useCallback(async (content, createVersion = true) => {
    if (!currentAsset || !user?.id) return;

    setSaving(true);
    try {
      const updatedAsset = await ContentService.updateAsset(currentAsset.id, {
        primary_content: content,
        updated_by: user.id
      });
      
      setCurrentAsset(updatedAsset);
      setLastSaved(new Date());

      // Create version if requested
      if (createVersion) {
        const newVersion = await ContentService.createVersion({
          asset_id: currentAsset.id,
          version_number: versions.length + 1,
          content_snapshot: content,
          change_type: 'content',
          is_current: true,
          created_by: user.id
        });
        
        setVersions(prev => [newVersion, ...prev]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
    } finally {
      setSaving(false);
    }
  }, [currentAsset, user?.id, versions.length]);

  // Auto-save functionality
  const autoSaveContent = useCallback(async (content) => {
    if (!currentAsset || !user?.id) return;

    try {
      await ContentService.autoSave(currentAsset.id, content, user.id);
      setLastSaved(new Date());
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, [currentAsset, user?.id]);

  // Generate personalized variations (legacy - now handled by PersonalizationHub)
  const generateVariations = useCallback(async (personalizationFactors) => {
    if (!currentAsset) return;

    setLoading(true);
    try {
      // This is now handled by the PersonalizationHub component
      console.log('Legacy generateVariations called - use PersonalizationHub instead');
      
      // Save variations to database
      const savedVariations = [];
      for (const variation of []) {
        const saved = await ContentService.createVariation(variation);
        savedVariations.push(saved);
      }

      setVariations(prev => [...savedVariations, ...prev]);
      return savedVariations;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate variations');
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentAsset]);

  // AI content analysis
  const analyzeContent = useCallback(async (content) => {
    const contentToAnalyze = content || currentAsset?.primary_content;
    if (!contentToAnalyze) return;

    setAnalyzingContent(true);
    try {
      // Extract text content for analysis
      const textContent = Object.values(contentToAnalyze)
        .filter(value => typeof value === 'string')
        .join(' ');

      const analysis = await BrowserAIService.analyzeContent(textContent);
      
      const result = {
        sentiment_score: analysis.sentiment?.confidence || 0,
        tone_analysis: {
          professional: analysis.tone?.brand_alignment || 0.8,
          empathetic: analysis.tone?.confidence || 0.7,
          authoritative: analysis.tone?.confidence || 0.6,
          accessible: analysis.tone?.confidence || 0.9
        },
        compliance_score: analysis.brand_voice?.voice_consistency || 85,
        readability_score: analysis.semantics?.readability_score || 75,
        engagement_prediction: analysis.overall_ai_score || 80,
        key_issues: analysis.brand_voice?.missing_attributes || [],
        improvement_suggestions: analysis.tone?.characteristics || ['Consider more engaging language'],
        medical_terminology_check: {
          appropriate_level: analysis.medical_terminology?.clinical_language_score > 70 || true,
          complex_terms: analysis.medical_terminology?.medical_terms || [],
          suggestions: Object.values(analysis.medical_terminology?.suggested_alternatives || {})
        }
      };

      setAiAnalysis(result);

      // Update asset with AI analysis
      if (currentAsset) {
        await ContentService.updateAsset(currentAsset.id, {
          ai_analysis: result
        });
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze content');
      return null;
    } finally {
      setAnalyzingContent(false);
    }
  }, [currentAsset, selectedBrand]);

  // Push to Design Studio
  const pushToDesignStudio = useCallback(async (designRequirements = {}) => {
    if (!currentAsset || !currentProject) return null;

    setSaving(true);
    try {
      // Update asset status
      await ContentService.updateAsset(currentAsset.id, {
        status: 'design_ready'
      });

      // Create design handoff
      const handoff = await ContentService.createHandoff({
        asset_id: currentAsset.id,
        project_id: currentProject.id,
        brand_id: currentProject.brand_id,
        handoff_status: 'pending',
        content_context: {
          asset: currentAsset,
          variations: variations,
          latest_version: versions[0]
        },
        design_requirements: designRequirements,
        brand_context: selectedBrand,
        compliance_requirements: {},
        design_assets: {},
        feedback: {},
        timeline: {},
        handed_off_by: user?.id
      });

      setHandoffs(prev => [handoff, ...prev]);
      
      // Update current asset status
      setCurrentAsset(prev => prev ? { ...prev, status: 'design_ready' } : null);
      
      return handoff;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to push to Design Studio');
      return null;
    } finally {
      setSaving(false);
    }
  }, [currentAsset, currentProject, variations, versions, selectedBrand, user?.id]);

  // Delete project
  const deleteProject = useCallback(async (projectId) => {
    if (!user?.id) return false;

    setDeleting(true);
    try {
      await ContentService.deleteProject(projectId);
      
      // Update local state
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setAssets(prev => prev.filter(a => a.project_id !== projectId));
      
      // Clear current project if it was the deleted one
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      return false;
    } finally {
      setDeleting(false);
    }
  }, [user?.id, currentProject?.id]);

  // Update asset status
  const updateAssetStatus = useCallback(async (assetId, newStatus) => {
    if (!user?.id) return false;

    setSaving(true);
    try {
      const updatedAsset = await ContentService.updateAssetStatus(assetId, newStatus, user.id);
      
      // Phase 3: If asset has theme_id, update theme performance
      if (updatedAsset.theme_id) {
        const { ThemeService } = await import('@/services/themeService');
        await ThemeService.recordThemePerformance(updatedAsset.theme_id, {
          asset_id: assetId,
          status_change: newStatus,
          approval_status: newStatus === 'approved' ? 'approved' : newStatus === 'in_review' ? 'needs_revision' : undefined,
          timestamp: new Date(),
          implementation_type: 'asset'
        });
      }
      
      // Update local state
      setCurrentAsset(updatedAsset);
      setAssets(prev => prev.map(a => a.id === assetId ? updatedAsset : a));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update asset status');
      return false;
    } finally {
      setSaving(false);
    }
  }, [user?.id]);

  // Delete asset
  const deleteAsset = useCallback(async (assetId) => {
    if (!user?.id) return false;

    setDeleting(true);
    try {
      await ContentService.deleteAsset(assetId);
      
      // Update local state
      setAssets(prev => prev.filter(a => a.id !== assetId));
      
      // Clear current asset if it was the deleted one
      if (currentAsset?.id === assetId) {
        setCurrentAsset(null);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete asset');
      return false;
    } finally {
      setDeleting(false);
    }
  }, [user?.id, currentAsset?.id]);

  // Resume from saved session
  const resumeSession = useCallback(async () => {
    if (!user?.id) return;

    try {
      const session = await ContentService.getActiveSession(
        user.id,
        projectId,
        assetId
      );

      if (session) {
        // Restore session state
        if (session.project_id && !currentProject) {
          await loadProject(session.project_id);
        }
        
        if (session.asset_id && !currentAsset) {
          await loadAsset(session.asset_id);
        }

        return session;
      }
    } catch (err) {
      console.error('Failed to resume session:', err);
    }
    
    return null;
  }, [user?.id, projectId, assetId, currentProject, currentAsset, loadProject, loadAsset]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || !currentAsset) return;

    const interval = setInterval(() => {
      if (currentAsset.primary_content) {
        autoSaveContent(currentAsset.primary_content);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, currentAsset, autoSaveContent]);

  // Initial load effects
  useEffect(() => {
    if (selectedBrand?.id) {
      loadProjects();
    }
  }, [selectedBrand?.id, loadProjects]);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  useEffect(() => {
    if (assetId) {
      loadAsset(assetId);
    }
  }, [assetId, loadAsset]);

  // Migration from localStorage on first load
  useEffect(() => {
    const performMigrationAndCleanup = async () => {
      if (user?.id && selectedBrand?.id && projects.length === 0) {
        try {
          // First run migration for new drafts
          await ContentService.migrateFromLocalStorage(user.id, selectedBrand.id);
          
          // Then cleanup any existing migrated projects with generic descriptions
          await ContentService.cleanupMigratedProjects(selectedBrand.id);
          
          // Reload projects to show updated data
          await loadProjects();
        } catch (error) {
          console.error('Migration/cleanup failed:', error);
        }
      }
    };

    performMigrationAndCleanup();
  }, [user?.id, selectedBrand?.id, projects.length, loadProjects]);

  return {
    // Data
    projects,
    currentProject,
    assets,
    currentAsset,
    variations,
    versions,
    handoffs,
    aiAnalysis,

    // Status
    loading,
    error,
    saving,
    lastSaved,
    analyzingContent,
    deleting,

    // Actions
    loadProjects,
    loadProject,
    loadAsset,
    loadAllAssets,
    createProject,
    createAsset,
    updateAssetContent,
    updateAssetStatus,
    generateVariations,
    analyzeContent,
    pushToDesignStudio,
    resumeSession,
    deleteProject,
    deleteAsset,

    // Utilities
    setError: (error) => setError(error)
  };
};

export default useContentManagement;
