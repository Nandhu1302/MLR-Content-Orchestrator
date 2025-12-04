
export class DraftStorageManager {
  static DRAFT_PREFIX = 'draft_';
  static MAX_DRAFTS = 50;

  static saveDraft(key, draftData) {
    try {
      localStorage.setItem(`${this.DRAFT_PREFIX}${key}`, JSON.stringify(draftData));
      this.cleanupOldDrafts();
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }

  static loadDraft(key) {
    try {
      const stored = localStorage.getItem(`${this.DRAFT_PREFIX}${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }

  static getAllDrafts() {
    this.clearStaleDrafts();
    const drafts = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.DRAFT_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const draftData = JSON.parse(stored);
            const summary = this.createDraftSummary(key.replace(this.DRAFT_PREFIX, ''), draftData);
            if (summary) {
              drafts.push(summary);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
    return drafts.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }

  static deleteDraft(key) {
    localStorage.removeItem(`${this.DRAFT_PREFIX}${key}`);
  }

  static duplicateDraft(key) {
    const draft = this.loadDraft(key);
    if (draft) {
      const newKey = `${key}_copy_${Date.now()}`;
      const newDraft = {
        ...draft,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };
      this.saveDraft(newKey, newDraft);
      return newKey;
    }
    throw new Error('Draft not found');
  }

  static createDraftSummary(key, draftData) {
    try {
      if (!draftData || !draftData.timestamp) {
        console.warn(`Invalid draft data for key ${key}`);
        return null;
      }
      const { data, timestamp, currentStep, flowState, contentProgress, assetData, campaignData } = draftData;
      const draftDate = new Date(timestamp);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (draftDate < thirtyDaysAgo) {
        return null;
      }
      const progress = this.calculateProgress(data, currentStep, flowState, contentProgress);
      let projectName = data?.projectName || 'Untitled Project';
      if (assetData?.projectName) projectName = assetData.projectName;
      if (campaignData?.projectName) projectName = campaignData.projectName;
      if (projectName.toLowerCase().includes('test') || projectName === 'ABC TEST 02') {
        return null;
      }
      let assetType = data?.selectedAssetTypes?.[0];
      if (assetData?.assetType) assetType = assetData.assetType;
      if (campaignData?.assets?.[0]?.assetType) assetType = campaignData.assets[0].assetType;
      return {
        id: key,
        projectName,
        progress,
        lastModified: new Date(timestamp),
        templateName: undefined,
        assetType,
        currentStep,
        flowState
      };
    } catch (error) {
      console.error('Failed to create draft summary:', error);
      return null;
    }
  }

  static clearStaleDrafts() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.DRAFT_PREFIX)) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const draftData = JSON.parse(stored);
            const summary = this.createDraftSummary(key.replace(this.DRAFT_PREFIX, ''), draftData);
            if (!summary) {
              keysToRemove.push(key);
            }
          }
        } catch (error) {
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    if (keysToRemove.length > 0) {
      console.log(`Cleaned up ${keysToRemove.length} stale drafts`);
    }
  }

  static calculateProgress(data, currentStep, flowState, contentProgress) {
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
      const value = data[field];
      return value !== undefined && value !== null && value !== '';
    }).length;
    const baseProgress = Math.min((filledFields / fields.length) * 100, 25);
    let flowProgress = 0;
    switch (flowState) {
      case 'intake':
        flowProgress = currentStep ? Math.min((currentStep / 4) * 25, 25) : 0;
        break;
      case 'theme-generation':
        flowProgress = 35;
        break;
      case 'single-asset':
        flowProgress = 50 + (contentProgress ? Math.min(contentProgress, 50) : 20);
        break;
      case 'campaign':
        flowProgress = 45 + (contentProgress ? Math.min(contentProgress, 55) : 25);
        break;
      default:
        flowProgress = currentStep ? Math.min((currentStep / 4) * 25, 25) : 0;
    }
    return Math.min(Math.round(baseProgress + flowProgress), 100);
  }

  static cleanupOldDrafts() {
    const drafts = this.getAllDrafts();
    if (drafts.length > this.MAX_DRAFTS) {
      const toDelete = drafts.slice(this.MAX_DRAFTS);
      toDelete.forEach(draft => this.deleteDraft(draft.id));
    }
  }

  static hasRecentDrafts() {
    const drafts = this.getAllDrafts();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return drafts.some(draft => draft.lastModified > oneDayAgo);
  }

  static getMostRecentDraft() {
    const drafts = this.getAllDrafts();
    return drafts.length > 0 ? drafts[0] : null;
  }
}