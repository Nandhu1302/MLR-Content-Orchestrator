import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { useContentManagement } from '@/hooks/useContentManagement';
import { DraftStorageManager } from '@/utils/draftStorage';
// Assuming useProjectStageDetection, ProjectWithStage, and ProjectStage are defined elsewhere
// Note: Type imports are removed
import { useProjectStageDetection } from './useProjectStageDetection';

export const useContentPipeline = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  // autoSave: false parameter preserved
  const { projects, assets, loadProjects, deleteProject, deleteAsset } = useContentManagement({ autoSave: false });
  // Functions imported from the stage detection hook
  const { detectStage, getStageLabel, getNextAction, getStageProgress } = useProjectStageDetection();
  
  // State initialization without explicit type annotations
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load projects and local drafts on brand change
  useEffect(() => {
    if (selectedBrand?.id) {
      loadProjects();
      const allDrafts = DraftStorageManager.getAllDrafts();
      setDrafts(allDrafts);
      setLoading(false);
    }
  }, [selectedBrand, loadProjects]);

  // Combine projects and drafts into unified pipeline items (memoized)
  const pipelineItems = useMemo(() => {
    const items = [];

    // Add database projects
    projects.forEach(project => {
      const projectAssets = assets.filter(a => a.project_id === project.id);
      const stage = detectStage(project, undefined, projectAssets);
      
      items.push({
        id: project.id,
        name: project.project_name,
        stage,
        progress: getStageProgress(stage),
        assets: projectAssets,
        lastModified: new Date(project.updated_at),
        type: 'project'
      });
    });

    // Add local drafts
    drafts.forEach(draft => {
      const stage = detectStage(undefined, draft);
      
      items.push({
        id: draft.id,
        name: draft.projectName,
        stage,
        progress: draft.progress,
        lastModified: draft.lastModified,
        type: 'draft'
      });
    });

    // Sort by last modified date (descending)
    return items.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }, [projects, assets, drafts, detectStage, getStageProgress]);

  // Group items by stage (memoized)
  const itemsByStage = useMemo(() => {
    // Initial structure defined without explicit Record<...> type
    const grouped = {
      discover: [],
      brief: [],
      theme: [],
      assets: [],
      design: [],
      review: [],
      localize: [],
      complete: []
    };

    pipelineItems.forEach(item => {
      // Accessing group property dynamically
      if (grouped[item.stage]) {
        grouped[item.stage].push(item);
      }
    });

    return grouped;
  }, [pipelineItems]);

  // Pipeline statistics (memoized)
  const stats = useMemo(() => {
    const active = pipelineItems.filter(p => p.stage !== 'complete');
    const inReview = itemsByStage.review.length;
    const completed = itemsByStage.complete.length;

    return {
      active: active.length,
      inReview,
      completed,
      total: pipelineItems.length
    };
  }, [pipelineItems, itemsByStage]);

  // Smart navigation based on stage
  const navigateToStage = (item) => {
    switch (item.stage) {
      case 'discover':
        navigate('/intelligence');
        break;
      case 'brief':
        if (item.type === 'draft') {
          navigate(`/?resume=${item.id}`);
        } else {
          navigate('/create-content');
        }
        break;
      case 'theme':
        navigate('/intelligence');
        break;
      case 'assets':
        if (item.assets && item.assets.length > 0) {
          navigate(`/content-editor/${item.assets[0].id}`);
        } else {
          navigate('/content-workshop');
        }
        break;
      case 'design':
        navigate('/design-studio');
        break;
      case 'review':
        navigate('/pre-mlr');
        break;
      case 'localize':
        navigate('/glocalization');
        break;
      case 'complete':
        navigate('/');
        break;
      default:
        // Optional: handle unknown stages
        console.warn(`Attempted navigation for unknown stage: ${item.stage}`);
    }
  };

  // Handler for deleting projects or drafts
  const handleDeleteItem = async (itemId, type) => {
    if (type === 'draft') {
      DraftStorageManager.deleteDraft(itemId);
      // Update local state to reflect the deletion
      setDrafts(DraftStorageManager.getAllDrafts());
      return true;
    } else if (type === 'project') {
      // deleteProject is an async function that handles API call and state update
      return await deleteProject(itemId);
    }
    return false;
  };

  // Return public API of the hook
  return {
    pipelineItems,
    itemsByStage,
    stats,
    loading,
    navigateToStage,
    handleDeleteItem,
    getStageLabel,
    getNextAction
  };
};