
import React from 'react';
import { EnhancedTranslationHub } from './EnhancedTranslationHub';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const SimplifiedTranslationHub = ({
  selectedAsset,
  globalMetadata,
  preloadedSegments,   // Pre-loaded segments from database
  onPhaseComplete,
  onBack,
  projectId,           // Project ID from URL - used for direct data restoration
}) => {
  return (
    <ErrorBoundary>
      <EnhancedTranslationHub
        selectedAsset={selectedAsset}
        globalMetadata={globalMetadata}
        preloadedSegments={preloadedSegments}
        onPhaseComplete={onPhaseComplete}
        onBack={onBack}
        projectId={projectId}
      />
    </ErrorBoundary>
  );
};
