
import { useState } from 'react';
import { ContentWorkshopUnified } from '@/components/workshop/unified/ContentWorkshopUnified';
import { useContentWorkshop } from '@/hooks/useContentWorkshop';

const ContentWorkshopPage = () => {
  const workshop = useContentWorkshop();
  const [selectedAssetTypes, setSelectedAssetTypes] = useState([]);

  const handleThemeTitleEdit = (themeId, newTitle) => {
    // Update theme title in the themes array
    const updatedThemes = workshop.themes.map(theme =>
      theme.id === themeId ? { ...theme, name: newTitle } : theme
    );
    // This would need a setter in the hook, for now just log
    console.log('Theme title edited:', themeId, newTitle);
  };

  const handleAssetTypesSelect = (assetTypes) => {
    setSelectedAssetTypes(assetTypes);
  };

  const handleGenerateAssets = () => {
    // Generate assets with selected theme and asset types
    workshop.handleGenerateAssets();
  };

  return (
    <ContentWorkshopUnified
      context={workshop.context}
      themes={workshop.themes}
      selectedTheme={workshop.selectedTheme}
      intelligence={workshop.intelligence}
      isGeneratingThemes={workshop.isGeneratingThemes}
      onContextUpdate={workshop.handleContextUpdate}
      onThemeSelect={workshop.handleThemeSelect}
      onThemeTitleEdit={handleThemeTitleEdit}
      onAssetTypesSelect={handleAssetTypesSelect}
      onGenerateAssets={handleGenerateAssets}
    />
  );
};

export default ContentWorkshopPage;
