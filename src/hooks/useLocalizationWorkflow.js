
import { useState, useCallback, useEffect } from 'react';

// JS version of useLocalizationWorkflow (types removed, same context/logic)
export const useLocalizationWorkflow = (asset) => {
  const [workflowState, setWorkflowState] = useState({
    currentStep: 'marketReadiness',
    completedSteps: [],
    stepData: {},
    overallProgress: 0,
    isComplete: false,
  });

  const setFullWorkflowState = useCallback((newState) => {
    setWorkflowState(newState);
  }, []);

  const stepOrder = ['marketReadiness', 'intelligence', 'optimization'];

  const updateStepData = useCallback((step, data) => {
    setWorkflowState((prev) => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        [step]: { ...(prev.stepData?.[step] || {}), ...(data || {}) },
      },
    }));
  }, []);

  const completeStep = useCallback(() => {
    setWorkflowState((prev) => {
      const newCompletedSteps = Array.from(new Set([...(prev.completedSteps || []), prev.currentStep]));
      const progress = (newCompletedSteps.length / stepOrder.length) * 100;
      const isComplete = newCompletedSteps.length === stepOrder.length;
      return {
        ...prev,
        completedSteps: newCompletedSteps,
        overallProgress: progress,
        isComplete,
      };
    });
  }, [stepOrder.length]);

  const goToStep = useCallback((step) => {
    setWorkflowState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  }, []);

  const goToNextStep = useCallback(() => {
    const currentIndex = stepOrder.indexOf(workflowState.currentStep);
    if (currentIndex < stepOrder.length - 1) {
      goToStep(stepOrder[currentIndex + 1]);
    }
  }, [workflowState.currentStep, stepOrder, goToStep]);

  const goToPreviousStep = useCallback(() => {
    const currentIndex = stepOrder.indexOf(workflowState.currentStep);
    if (currentIndex > 0) {
      goToStep(stepOrder[currentIndex - 1]);
    }
  }, [workflowState.currentStep, stepOrder, goToStep]);

  const isStepCompleted = useCallback((step) => {
    return (workflowState.completedSteps || []).includes(step);
  }, [workflowState.completedSteps]);

  const canAccessStep = useCallback((step) => {
    const stepIndex = stepOrder.indexOf(step);
    const currentIndex = stepOrder.indexOf(workflowState.currentStep);
    return (
      stepIndex <= currentIndex ||
      (stepIndex === currentIndex + 1 && isStepCompleted(workflowState.currentStep))
    );
  }, [stepOrder, workflowState.currentStep, isStepCompleted]);

  const getStepProgress = useCallback((step) => {
    if (isStepCompleted(step)) return 100;
    if (step === workflowState.currentStep) return 50; // In progress
    return 0;
  }, [workflowState.currentStep, isStepCompleted]);

  // Generate workflow summary for project creation
  const generateWorkflowSummary = useCallback(() => {
    const { marketReadiness, intelligence, optimization } = workflowState.stepData || {};
    return {
      asset,
      localizationBrief: intelligence?.localizationBrief,
      selectedMarkets: marketReadiness?.selectedMarkets || [],
      estimatedTimeline: marketReadiness?.timelineEstimate || 0,
      prioritizedMarkets: optimization?.prioritizedMarkets || [],
      roiEstimation: optimization?.roiEstimation,
      readinessScore: workflowState.overallProgress,
      generatedAssets: {
        brief: intelligence?.localizationBrief,
        checklist: marketReadiness?.complianceChecklist,
        proposal: optimization?.projectProposal,
      },
    };
  }, [asset, workflowState]);

  return {
    workflowState,
    setWorkflowState: setFullWorkflowState,
    updateStepData,
    completeStep,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    isStepCompleted,
    canAccessStep,
    getStepProgress,
    generateWorkflowSummary,
    stepOrder,
  };
};
