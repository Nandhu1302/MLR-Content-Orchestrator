
import { useState, useCallback, useEffect } from 'react';
import { RegulatoryRiskAnalyzer } from '@/services/regulatoryRiskAnalyzer';

// JS version of useRegulatoryRiskAssessment (types removed, same context/logic)
export const useRegulatoryRiskAssessment = (
  projectId,
  contentData,
  targetMarkets,
  contentType,
  options = {}
) => {
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastAssessed, setLastAssessed] = useState(null);

  const triggerAssessment = useCallback(async () => {
    if (!projectId || !contentData || !(Array.isArray(targetMarkets) && targetMarkets.length)) {
      setError('Missing required parameters for regulatory assessment');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Triggering regulatory risk assessment...');

      // Create mock regulatory assessment for now (kept same context)
      const transformedAssessment = {
        overallRiskLevel: targetMarkets.some((m) => ['EU', 'Japan'].includes(m)) ? 'high' : 'medium',
        overallRiskScore: Math.min(90, targetMarkets.length * 20),
        marketSpecificRisks: targetMarkets.map((market) => ({
          market,
          riskLevel: ['EU', 'Japan'].includes(market) ? 'high' : 'medium',
          complianceStatus: 'requires-review',
          regulatoryRequirements: ['FDA approval', 'CE marking', 'Local language requirements'],
          riskFactors: ['Complex regulatory framework', 'Language-specific requirements'],
          recommendations: ['Engage local regulatory expert', 'Review compliance documentation'],
        })),
        contentCategoryRisks: [
          {
            category: contentType,
            riskLevel: 'medium',
            riskScore: 60,
            specificIssues: ['Medical terminology compliance', 'Cultural sensitivity requirements'],
          },
        ],
        timelineImpact: {
          additionalReviewDays: targetMarkets.length * 5,
          approvalComplexity: 'standard',
          requiredStakeholders: ['Regulatory Affairs', 'Legal Team', 'Medical Affairs'],
        },
        mitigationStrategies: [
          {
            strategy: 'Early regulatory consultation',
            implementation: 'Engage regulatory experts in target markets',
            priority: 'high',
          },
        ],
        complianceChecklist: [
          {
            requirement: 'Medical accuracy review',
            status: 'requires-review',
            notes: 'Needs medical expert validation',
          },
        ],
      };

      setAssessment(transformedAssessment);
      setLastAssessed(new Date());
      console.log('Regulatory risk assessment completed successfully');
    } catch (err) {
      console.error('Regulatory risk assessment failed:', err);
      setError(err instanceof Error ? err.message : 'Assessment failed');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, contentData, targetMarkets, contentType]);

  // Auto-assess on mount/update if enabled
  useEffect(() => {
    if (options.autoAssess && projectId && contentData && Array.isArray(targetMarkets) && targetMarkets.length) {
      triggerAssessment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.autoAssess, projectId, contentData, targetMarkets]);

  return {
    assessment,
    isLoading,
    error,
    lastAssessed,
    triggerAssessment,
  };
};
