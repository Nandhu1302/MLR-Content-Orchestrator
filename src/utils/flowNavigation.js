
import { DraftStorageManager } from './draftStorage';

export class FlowNavigationManager {
  /**
   * Navigate to the appropriate module based on draft flow state
   */
  static navigateToModule(draftId, navigate) {
    const draft = DraftStorageManager.loadDraft(draftId);
    if (!draft) {
      // If no draft found, go to main dashboard
      navigate('/');
      return;
    }
    switch (draft.flowState) {
      case 'intake':
      case 'theme-generation':
        // Stay in main flow
        navigate(`/?resume=${draftId}`);
        break;
      case 'single-asset':
        // Could go to content studio or stay in flow
        navigate(`/?resume=${draftId}`);
        break;
      case 'campaign':
        // Campaign dashboard
        navigate(`/?resume=${draftId}`);
        break;
      default:
        navigate('/');
    }
  }

  /**
   * Get the appropriate module for a given flow state
   */
  static getModuleForFlowState(flowState) {
    switch (flowState) {
      case 'single-asset':
        return 'content-studio';
      case 'campaign':
        return 'campaign-dashboard';
      case 'theme-generation':
        return 'strategy-insights';
      case 'intake':
      default:
        return 'initiative-hub';
    }
  }

  /**
   * Get display name for flow state
   */
  static getFlowStateDisplayName(flowState) {
    switch (flowState) {
      case 'intake':
        return 'Project Setup';
      case 'theme-generation':
        return 'Theme Generation';
      case 'single-asset':
        return 'Asset Creation';
      case 'campaign':
        return 'Campaign Management';
      default:
        return 'Unknown';
    }
  }

  /**
   * Determine if a draft is ready for content creation
   */
  static isReadyForContentCreation(progress, flowState) {
    return progress >= 45 || flowState === 'single-asset' || flowState === 'campaign';
  }

  /**
   * Determine if a draft is a campaign asset
   */
  static isCampaignAsset(flowState) {
    return flowState === 'campaign';
  }
}