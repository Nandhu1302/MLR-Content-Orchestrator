import { useState } from 'react';

export const useDashboardState = () => {
  const [showIntakeFlow, setShowIntakeFlow] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);

  const openIntakeFlow = () => setShowIntakeFlow(true);
  const closeIntakeFlow = () => setShowIntakeFlow(false);
  
  const openTemplateGallery = () => setShowTemplateGallery(true);
  const closeTemplateGallery = () => setShowTemplateGallery(false);

  return {
    showIntakeFlow,
    showTemplateGallery,
    openIntakeFlow,
    closeIntakeFlow,
    openTemplateGallery,
    closeTemplateGallery
  };
};