
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBaseAutoSave } from './useBaseAutoSave';
import { generateSessionId } from '@/utils/sessionUtils';

// JS version of useWorkflowPersistence (types removed, same context/logic)
export const useWorkflowPersistence = ({
  assetId,
  assetName,
  workflowState,
  projectId,
  onSave,
  interval = 5000,
}) => {
  const handleSave = useCallback(async (currentState) => {
    if (!projectId) return;

    try {
      console.log('💾 Saving workflow state immediately:', {
        projectId,
        timestamp: new Date().toISOString(),
        workflowStateKeys: Object.keys(currentState || {}),
      });

      // Save to both project and workflow tables
      await supabase
        .from('localization_projects')
        .update({
          workflow_state: JSON.parse(JSON.stringify(currentState || {})),
          workflow_status: (currentState?.isComplete
            ? 'completed'
            : (Array.isArray(currentState?.completedSteps) && currentState.completedSteps.length > 0)
            ? 'in_progress'
            : 'draft'),
          last_auto_save: new Date().toISOString(),
        })
        .eq('id', projectId);

      await supabase
        .from('localization_workflows')
        .update({
          workflow_progress: {
            marketReadiness: {
              completed: Array.isArray(currentState?.completedSteps)
                ? currentState.completedSteps.includes('marketReadiness')
                : false,
              lastUpdated: new Date().toISOString(),
            },
            intelligence: {
              completed: Array.isArray(currentState?.completedSteps)
                ? currentState.completedSteps.includes('intelligence')
                : false,
              lastUpdated: new Date().toISOString(),
            },
            optimization: {
              completed: Array.isArray(currentState?.completedSteps)
                ? currentState.completedSteps.includes('optimization')
                : false,
              lastUpdated: new Date().toISOString(),
            },
          },
          intelligence_data: currentState?.stepData || {},
          last_auto_save: new Date().toISOString(),
        })
        .eq('localization_project_id', projectId);

      const savePayload = {
        workflowState: currentState,
        assetId,
        assetName,
        timestamp: new Date().toISOString(),
        sessionId: generateSessionId(),
        version: '1.0',
      };

      if (typeof onSave === 'function') onSave(savePayload);
    } catch (error) {
      console.error('Failed to save workflow to database:', error);
    }
  }, [projectId, assetId, assetName, onSave]);

  return useBaseAutoSave({
    data: workflowState,
    onSave: handleSave,
    interval,
    enabled: !!projectId,
  });
};
