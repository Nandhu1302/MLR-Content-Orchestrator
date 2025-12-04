
/**
 * @deprecated This file is deprecated. Workflow persistence is now handled entirely through the database.
 * All workflow state is stored in localization_projects.workflow_state column.
 * This file is kept for backwards compatibility only and will be removed in a future release.
 */

export class WorkflowStorageManager {
  static WORKFLOW_PREFIX = 'workflow_';
  static MAX_AGE_DAYS = 30;

  static saveWorkflow(assetId, data) {
    try {
      localStorage.setItem(`${this.WORKFLOW_PREFIX}${assetId}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save workflow:', error);
    }
  }

  static loadWorkflow(assetId) {
    try {
      const data = localStorage.getItem(`${this.WORKFLOW_PREFIX}${assetId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to load workflow:', error);
      return null;
    }
  }

  static getAllWorkflows() {
    const workflows = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.WORKFLOW_PREFIX)) {
          const data = localStorage.getItem(key);
          if (data) {
            const workflowData = JSON.parse(data);
            const lastModified = new Date(workflowData.timestamp);
            
            // Skip if older than max age
            const daysSince = (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSince > this.MAX_AGE_DAYS) {
              continue;
            }

            workflows.push({
              assetId: workflowData.assetId,
              assetName: workflowData.assetName,
              assetProject: workflowData.assetProject,
              currentStep: this.getStepDisplayName(workflowData.workflowState.currentStep),
              progress: workflowData.workflowState.overallProgress,
              lastModified,
              completedSteps: workflowData.workflowState.completedSteps.length,
              totalSteps: 3 // intelligence, marketReadiness, optimization
            });
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get workflows:', error);
    }

    return workflows.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }

  static deleteWorkflow(assetId) {
    try {
      localStorage.removeItem(`${this.WORKFLOW_PREFIX}${assetId}`);
    } catch (error) {
      console.warn('Failed to delete workflow:', error);
    }
  }

  static hasInProgressWorkflow(assetId) {
    const workflow = this.loadWorkflow(assetId);
    return workflow !== null && !workflow.workflowState.isComplete;
  }

  static clearStaleWorkflows() {
    const workflows = this.getAllWorkflows();
    const now = new Date();
    
    workflows.forEach(workflow => {
      const daysSince = (now.getTime() - workflow.lastModified.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > this.MAX_AGE_DAYS) {
        this.deleteWorkflow(workflow.assetId);
      }
    });
  }

  static getStepDisplayName(step) {
    switch (step) {
      case 'intelligence':
        return 'Intelligence Analysis';
      case 'marketReadiness':
        return 'Market Readiness';
      case 'optimization':
        return 'Project Optimization';
      default:
        return 'Unknown Step';
    }
  }

  static getWorkflowProgress(assetId) {
    const workflow = this.loadWorkflow(assetId);
    return workflow?.workflowState.overallProgress || 0;
  }
}