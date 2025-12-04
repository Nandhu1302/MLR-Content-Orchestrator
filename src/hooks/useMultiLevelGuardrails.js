import { useState, useEffect, useCallback } from 'react';
import { useBrand } from '@/contexts/BrandContext';
import { MultiLevelGuardrailsService } from '@/services/multiLevelGuardrailsService';

export const useMultiLevelGuardrails = ({
  campaignId,
  assetId,
  assetType
} = {}) => {
  const { selectedBrand } = useBrand();
  const [mergedGuardrails, setMergedGuardrails] = useState(null);
  const [campaignGuardrails, setCampaignGuardrails] = useState(null);
  const [assetGuardrails, setAssetGuardrails] = useState(null);
  const [complianceHistory, setComplianceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMergedGuardrails = useCallback(async () => {
    if (!selectedBrand) return;
    setIsLoading(true);
    setError(null);
    try {
      const merged = await MultiLevelGuardrailsService.getMergedGuardrails(
        selectedBrand.id,
        campaignId,
        assetId,
        assetType
      );
      setMergedGuardrails(merged);
      setCampaignGuardrails(merged.campaign || null);
      setAssetGuardrails(merged.asset || null);
    } catch (err) {
      setError('Failed to load guardrails');
    } finally {
      setIsLoading(false);
    }
  }, [selectedBrand, campaignId, assetId, assetType]);

  const loadComplianceHistory = useCallback(async () => {
    if (!assetId && !campaignId) return;
    try {
      const contentId = assetId || campaignId;
      const contentType = assetId ? 'asset' : 'campaign';
      const history = await MultiLevelGuardrailsService.getComplianceHistory(contentId, contentType);
      setComplianceHistory(history);
    } catch (err) {}
  }, [assetId, campaignId]);

  const checkContentCompliance = useCallback(async (content) => {
    if (!selectedBrand) return null;
    try {
      setIsLoading(true);
      const result = await MultiLevelGuardrailsService.checkEnhancedContentCompliance(
        content,
        selectedBrand.id,
        campaignId,
        assetId,
        assetType
      );
      if (assetId || campaignId) {
        const contentId = assetId || campaignId;
        const contentType = assetId ? 'asset' : 'campaign';
        await MultiLevelGuardrailsService.saveComplianceCheck(
          contentId,
          contentType,
          result
        );
        loadComplianceHistory();
      }
      return result;
    } catch (err) {
      setError('Failed to check content compliance');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [selectedBrand, campaignId, assetId, assetType, loadComplianceHistory]);

  const createCampaignGuardrails = useCallback(async (
    campaignId,
    guardrails
  ) => {
    if (!selectedBrand) return null;
    try {
      setIsLoading(true);
      const result = await MultiLevelGuardrailsService.createCampaignGuardrails(
        campaignId,
        selectedBrand.id,
        guardrails
      );
      await loadMergedGuardrails();
      return result;
    } catch (err) {
      setError('Failed to create campaign guardrails');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [selectedBrand, loadMergedGuardrails]);

  const updateCampaignGuardrails = useCallback(async (
    id,
    updates
  ) => {
    try {
      setIsLoading(true);
      const result = await MultiLevelGuardrailsService.updateCampaignGuardrails(id, updates);
      await loadMergedGuardrails();
      return result;
    } catch (err) {
      setError('Failed to update campaign guardrails');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadMergedGuardrails]);

  const createAssetGuardrails = useCallback(async (
    assetId,
    assetType,
    campaignId,
    guardrails
  ) => {
    if (!selectedBrand) return null;
    try {
      setIsLoading(true);
      const result = await MultiLevelGuardrailsService.createAssetGuardrails(
        assetId,
        selectedBrand.id,
        assetType,
        campaignId,
        guardrails
      );
      await loadMergedGuardrails();
      return result;
    } catch (err) {
      setError('Failed to create asset guardrails');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [selectedBrand, loadMergedGuardrails]);

  const updateAssetGuardrails = useCallback(async (
    id,
    updates
  ) => {
    try {
      setIsLoading(true);
      const result = await MultiLevelGuardrailsService.updateAssetGuardrails(id, updates);
      await loadMergedGuardrails();
      return result;
    } catch (err) {
      setError('Failed to update asset guardrails');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadMergedGuardrails]);

  const getEffectiveGuardrails = useCallback(() => {
    if (!mergedGuardrails) return null;
    return {
      keyMessages: mergedGuardrails.effective_rules.key_messages,
      toneGuidelines: mergedGuardrails.effective_rules.tone_guidelines,
      contentDos: mergedGuardrails.effective_rules.content_dos,
      contentDonts: mergedGuardrails.effective_rules.content_donts,
      regulatoryMusts: mergedGuardrails.effective_rules.regulatory_musts,
      competitiveAdvantages: mergedGuardrails.effective_rules.competitive_advantages,
      formatConstraints: mergedGuardrails.effective_rules.format_constraints,
      channelRequirements: mergedGuardrails.effective_rules.channel_requirements
    };
  }, [mergedGuardrails]);

  const getCustomizationSummary = useCallback(() => {
    if (!mergedGuardrails) return null;
    const hasCustomizations = {
      campaign: !!mergedGuardrails.campaign,
      asset: !!mergedGuardrails.asset
    };
    const customizationCount =
      (hasCustomizations.campaign ? 1 : 0) +
      (hasCustomizations.asset ? 1 : 0);
    return {
      hasCustomizations: customizationCount > 0,
      customizationCount,
      levels: hasCustomizations,
      inheritanceChain: mergedGuardrails.inheritance_chain
    };
  }, [mergedGuardrails]);

  useEffect(() => {
    loadMergedGuardrails();
    loadComplianceHistory();
  }, [loadMergedGuardrails, loadComplianceHistory]);

  return {
    mergedGuardrails,
    campaignGuardrails,
    assetGuardrails,
    complianceHistory,
    isLoading,
    error,
    loadMergedGuardrails,
    checkContentCompliance,
    createCampaignGuardrails,
    updateCampaignGuardrails,
    createAssetGuardrails,
    updateAssetGuardrails,
    getEffectiveGuardrails,
    getCustomizationSummary,
    hasGuardrails: !!mergedGuardrails,
    hasCampaignCustomizations: !!campaignGuardrails,
    hasAssetCustomizations: !!assetGuardrails,
    latestComplianceCheck: complianceHistory[0] || null,
    complianceScore: complianceHistory[0]?.overall_compliance_score || null
  };
};
