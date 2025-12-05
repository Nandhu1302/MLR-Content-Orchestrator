// Type imports removed: ContentAsset, ContentProject, DraftSummary

/**
 * Defines the possible stages a project or draft can be in.
 * @typedef {'discover' | 'brief' | 'theme' | 'assets' | 'design' | 'review' | 'localize' | 'complete'} ProjectStage
 */

/**
 * Custom hook providing utilities to detect the current stage of a project or draft
 * based on its internal status, flow state, and associated assets.
 */
export const useProjectStageDetection = () => {
  /**
   * Determines the current stage of a project or draft.
   *
   * @param {object} [project] - The ContentProject object.
   * @param {object} [draft] - The DraftSummary object.
   * @param {Array<object>} [assets] - The list of ContentAsset objects associated with the project.
   * @returns {ProjectStage} The detected stage.
   */
  const detectStage = (
    project,
    draft,
    assets
  ) => {
    // Handle drafts (which rely on flowState and progress)
    if (draft) {
      const { flowState, progress } = draft;
      
      if (flowState === 'intake' || progress < 25) return 'discover';
      if (flowState === 'theme-generation' || progress < 45) return 'brief';
      if (progress < 50) return 'theme';
      // If flow is for content generation, determine if it's in assets creation or ready for review
      if (flowState === 'single-asset' || flowState === 'campaign') {
        return progress >= 90 ? 'review' : 'assets';
      }
      return 'discover';
    }

    // Handle completed projects with assets (which rely on asset status)
    if (project && assets) {
      const hasDesignReady = assets.some(a => ['approved', 'design_ready'].includes(a.status));
      const hasCompleted = assets.some(a => a.status === 'completed');
      const allCompleted = assets.length > 0 && assets.every(a => a.status === 'completed');
      
      if (allCompleted) return 'complete';
      if (hasCompleted) return 'localize'; // Partially completed assets suggest localization
      if (hasDesignReady) return 'design';
      if (assets.some(a => a.status === 'in_review')) return 'review';
      if (assets.length > 0) return 'assets'; // Assets exist but are not yet in review/design
      if (project.theme_id) return 'theme'; // Theme is generated, but no assets yet
    }

    // Default stage if no specific status is detected
    return 'discover';
  };

  /**
   * Gets a user-friendly label for a given project stage.
   * @param {ProjectStage} stage - The current project stage.
   * @returns {string} The display label.
   */
  const getStageLabel = (stage) => {
    const labels = {
      discover: 'Discover Intelligence',
      brief: 'Create Brief',
      theme: 'Generate Themes',
      assets: 'Create Assets',
      design: 'Design',
      review: 'Review (Pre-MLR)',
      localize: 'Localize',
      complete: 'Complete'
    };
    return labels[stage] || 'Unknown Stage';
  };

  /**
   * Gets the recommended next action text for a given project stage.
   * @param {ProjectStage} stage - The current project stage.
   * @returns {string} The next action text.
   */
  const getNextAction = (stage) => {
    const actions = {
      discover: 'View Intelligence',
      brief: 'Complete Brief',
      theme: 'Select Theme',
      assets: 'Continue Creating',
      design: 'Send to Design',
      review: 'Submit for Review',
      localize: 'Start Translation',
      complete: 'View Details'
    };
    return actions[stage] || 'Continue';
  };

  /**
   * Gets a typical progress percentage for a given project stage.
   * @param {ProjectStage} stage - The current project stage.
   * @returns {number} The progress percentage (0-100).
   */
  const getStageProgress = (stage) => {
    const progress = {
      discover: 10,
      brief: 20,
      theme: 35,
      assets: 50,
      design: 70,
      review: 85,
      localize: 95,
      complete: 100
    };
    return progress[stage] || 0;
  };

  return {
    detectStage,
    getStageLabel,
    getNextAction,
    getStageProgress
  };
};