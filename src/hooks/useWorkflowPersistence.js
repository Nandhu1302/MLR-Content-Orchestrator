import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWorkflowPersistence = ({
  assetId,
  assetName,
  workflowState,
  projectId,
  onSave,
  interval = 5000
}) => {
  const lastSavedRef = useRef('');
  const lastSaveTimeRef = useRef(null);

  const saveWorkflow = useCallback(async () => {
    if (!projectId) return;
    const dataString = JSON.stringify(workflowState);
    try {
      console.log('💾 Saving workflow state immediately:', {
        projectId,
        timestamp: new Date().toISOString(),
        workflowStateKeys: Object.keys(workflowState)
      });
      await supabase
        .from('localization_projects')
        .update({
          workflow_state: JSON.parse(JSON.stringify(workflowState)),
          workflow_status: workflowState.isComplete ? 'completed' :
            workflowState.completedSteps && workflowState.completedSteps.length > 0 ? 'in_progress' : 'draft',
          last_auto_save: new Date().toISOString()
        })
        .eq('id', projectId);
      await supabase
        .from('localization_workflows')
        .update({
          workflow_progress: {
            marketReadiness: {
              completed: workflowState.completedSteps && workflowState.completedSteps.includes('marketReadiness'),
              lastUpdated: new Date().toISOString()
            },
            intelligence: {
              completed: workflowState.completedSteps && workflowState.completedSteps.includes('intelligence'),
              lastUpdated: new Date().toISOString()
            },
            optimization: {
              completed: workflowState.completedSteps && workflowState.completedSteps.includes('optimization'),
              lastUpdated: new Date().toISOString()
            }
          },
          intelligence_data: workflowState.stepData,
          last_auto_save: new Date().toISOString()
        })
        .eq('localization_project_id', projectId);
      lastSavedRef.current = dataString;
      lastSaveTimeRef.current = new Date();
      const savePayload = {
        workflowState,
        assetId,
        assetName,
        timestamp: new Date().toISOString(),
        sessionId: generateSessionId(),
        version: '1.0'
      };
      if (onSave) onSave(savePayload);
    } catch (error) {
      console.error('Failed to save workflow to database:', error);
    }
  }, [workflowState, assetId, assetName, projectId, onSave]);

  useEffect(() => {
    saveWorkflow();
    const intervalId = setInterval(saveWorkflow, 5000);
    return () => clearInterval(intervalId);
  }, [saveWorkflow, workflowState]);

  useEffect(() => {
    return () => {
      saveWorkflow();
    };
  }, [saveWorkflow]);

  const forceSave = useCallback(() => {
    saveWorkflow();
  }, [saveWorkflow]);

  const getLastSaveTime = useCallback(() => {
    return lastSaveTimeRef.current;
  }, []);

  return {
    forceSave,
    getLastSaveTime,
    lastSaveTime: lastSaveTimeRef.current
  };
};

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
