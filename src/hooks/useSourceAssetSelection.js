import { useState, useEffect, useCallback } from 'react';
import { localizationSourceService } from '@/services/localizationSourceService';
import { useBrand } from '@/contexts/BrandContext';

export const useSourceAssetSelection = () => {
  const { selectedBrand } = useBrand();
  const [contentStudioAssets, setContentStudioAssets] = useState([]);
  const [preMLRAssets, setPreMLRAssets] = useState([]);
  const [designStudioAssets, setDesignStudioAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetBasedProjectData, setAssetBasedProjectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSourceAssets = useCallback(async () => {
    if (!selectedBrand?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [contentAssets, mlrAssets, designAssets] = await Promise.all([
        localizationSourceService.getContentStudioAssets(selectedBrand.id),
        localizationSourceService.getPreMLRAssets(selectedBrand.id),
        localizationSourceService.getDesignStudioAssets(selectedBrand.id)
      ]);
      setContentStudioAssets(contentAssets);
      setPreMLRAssets(mlrAssets);
      setDesignStudioAssets(designAssets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load source assets');
      console.error('Error loading source assets:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedBrand?.id]);

  const selectAsset = useCallback(async (
    asset,
    targetLanguages = [],
    targetMarkets = []
  ) => {
    try {
      setLoading(true);
      const projectData = await localizationSourceService.generateAssetBasedProjectData(
        asset,
        targetLanguages,
        targetMarkets
      );
      setSelectedAsset(asset);
      setAssetBasedProjectData(projectData);
      return projectData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate project data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectData = useCallback(async (
    targetLanguages,
    targetMarkets
  ) => {
    if (!selectedAsset) return null;
    return await selectAsset(selectedAsset, targetLanguages, targetMarkets);
  }, [selectedAsset, selectAsset]);

  const clearSelection = useCallback(() => {
    setSelectedAsset(null);
    setAssetBasedProjectData(null);
  }, []);

  const getAssetsBySource = useCallback((sourceType) => {
    switch (sourceType) {
      case 'content_studio':
        return contentStudioAssets;
      case 'pre_mlr':
        return preMLRAssets;
      case 'design_studio':
        return designStudioAssets;
      default:
        return [];
    }
  }, [contentStudioAssets, preMLRAssets, designStudioAssets]);

  const getAllAssets = useCallback(() => {
    return [...contentStudioAssets, ...preMLRAssets, ...designStudioAssets];
  }, [contentStudioAssets, preMLRAssets, designStudioAssets]);

  useEffect(() => {
    if (selectedBrand?.id) {
      loadSourceAssets();
    }
  }, [selectedBrand?.id, loadSourceAssets]);

  return {
    contentStudioAssets,
    preMLRAssets,
    designStudioAssets,
    selectedAsset,
    assetBasedProjectData,
    loading,
    error,
    loadSourceAssets,
    selectAsset,
    updateProjectData,
    clearSelection,
    getAssetsBySource,
    getAllAssets,
    hasAssets: contentStudioAssets.length > 0 || preMLRAssets.length > 0 || designStudioAssets.length > 0,
    assetCounts: {
      content_studio: contentStudioAssets.length,
      pre_mlr: preMLRAssets.length,
      design_studio: designStudioAssets.length,
      total: contentStudioAssets.length + preMLRAssets.length + designStudioAssets.length
    }
  };
};
