
import React from 'react';
import { SimplifiedTranslationHub } from '../phases/SimplifiedTranslationHub';

export const SmartTMIntelligenceStep = ({
  asset,
  targetMarkets = [],
  therapeuticArea = 'general',
  onStepComplete,
  onPrevious
}) => {
  // Create enriched global metadata with content from the asset
  const globalMetadata = {
    targetMarkets,
    targetLanguages: ['es'], // Default to Spanish, this would come from context
    therapeuticArea: therapeuticArea,
    indication: 'general',
    channel: 'digital',
    targetAudience: 'healthcare-professionals',
    regulatoryRequirements: [],
    // Include rich content from asset metadata and intake context
    assetMetadata: asset?.metadata ?? {},
    intakeContext: asset?.intake_context ?? {},
    brandGuidelines: asset?.metadata?.brandGuidelines ?? {},
    enhancedContext: asset?.metadata?.enhancedContext ?? {},
    businessContext: asset?.metadata?.businessContext ?? {}
  };

  // Ensure asset has proper primary_content structure for translation
  const enrichedAsset = {
    ...asset,
    primary_content: asset?.primary_content ?? {
      sections: [],
      content: asset?.metadata?.content ?? {},
      text: asset?.metadata?.text ?? ''
    }
  };

  const handlePhaseComplete = (data) => {
    onStepComplete(data);
  };

  return (
    <SimplifiedTranslationHub
      selectedAsset={enrichedAsset}
      globalMetadata={globalMetadata}
      onPhaseComplete={handlePhaseComplete}
      onBack={onPrevious}
    />
  );
};
