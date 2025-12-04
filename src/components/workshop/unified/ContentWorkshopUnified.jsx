import { ConversationPane } from './ConversationPane';
import { ThemeCardsPanel } from './ThemeCardsPanel';
import { AssetBundlePanel } from './AssetBundlePanel';

export const ContentWorkshopUnified = ({
  context,
  themes,
  selectedTheme,
  intelligence,
  isGeneratingThemes,
  onContextUpdate,
  onThemeSelect,
  onThemeTitleEdit,
  onAssetTypesSelect,
  onGenerateAssets,
}) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Left: Conversation Pane (40%) */}
      <div className="w-[40%] border-r flex flex-col">
        <ConversationPane 
          context={context}
          onContextUpdate={onContextUpdate}
          showThemeCards={themes.length > 0}
        />
      </div>

      {/* Center: Theme Cards (35%) */}
      <div className="w-[35%] border-r flex flex-col">
        <ThemeCardsPanel
          themes={themes}
          selectedTheme={selectedTheme}
          isGenerating={isGeneratingThemes}
          onThemeSelect={onThemeSelect}
          onThemeTitleEdit={onThemeTitleEdit}
        />
      </div>

      {/* Right: Asset Bundle Selector (25%) */}
      <div className="w-[25%] flex flex-col">
        <AssetBundlePanel
          selectedTheme={selectedTheme}
          intelligence={intelligence}
          context={context}
          onAssetTypesSelect={onAssetTypesSelect}
          onGenerateAssets={onGenerateAssets}
        />
      </div>
    </div>
  );
};