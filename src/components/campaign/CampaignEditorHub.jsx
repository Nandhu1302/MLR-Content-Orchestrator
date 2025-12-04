import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ContentEditor from '@/components/content/ContentEditor';
import { AssetNavItem } from './AssetNavItem';
import { CampaignIntelligenceCard } from './CampaignIntelligenceCard';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export const CampaignEditorHub = ({ campaignPackage: initialPackage }) => {
  const navigate = useNavigate();
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [campaignAssets, setCampaignAssets] = useState(initialPackage.assets);
  const [campaignName, setCampaignName] = useState(initialPackage.campaignName);
  const [overallProgress, setOverallProgress] = useState(initialPackage.overallProgress);

  console.log('🎯 Campaign Editor Hub loaded:', {
    campaignName,
    totalAssets: initialPackage.assets.length,
    assets: initialPackage.assets.map(a => ({ name: a.assetName, type: a.assetType, status: a.status })),
    activeIndex: activeAssetIndex
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keyboard shortcuts when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setActiveAssetIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setActiveAssetIndex(prev => Math.min(campaignAssets.length - 1, prev + 1));
          break;
        case 'Enter':
          e.preventDefault();
          // Asset already displayed when active
          break;
        default:
          // Number keys 1-9 for quick navigation
          const num = parseInt(e.key);
          if (!isNaN(num) && num >= 1 && num <= Math.min(9, campaignAssets.length)) {
            e.preventDefault();
            setActiveAssetIndex(num - 1);
          }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [campaignAssets.length]);

  const activeAsset = campaignAssets[activeAssetIndex];
  const completedCount = campaignAssets.filter(a => a.status === 'complete').length;
  const totalCount = campaignAssets.length;

  const handleAssetComplete = async (assetId) => {
    try {
      // Update asset status in database
      const { error } = await supabase
        .from('content_assets')
        .update({ 
          status: 'content-review',
          completed_at: new Date().toISOString()
        })
        .eq('id', assetId);

      if (error) throw error;

      // Update local state
      setCampaignAssets(prev => prev.map(a => 
        a.assetId === assetId 
          ? { ...a, status: 'complete' } 
          : a
      ));

      // Calculate new progress
      const newCompletedCount = campaignAssets.filter(a => 
        a.assetId === assetId || a.status === 'complete'
      ).length + 1;
      const newProgress = Math.round((newCompletedCount / totalCount) * 100);
      setOverallProgress(newProgress);

      // Update campaign progress in database
      await supabase
        .from('content_projects')
        .update({
          project_metadata: {
            campaign_progress: {
              totalAssets: totalCount,
              completedAssets: newCompletedCount
            }
          }
        })
        .eq('id', initialPackage.projectId);

      // Find next asset to work on
      const nextAssetIndex = campaignAssets.findIndex(
        (a, i) => i > activeAssetIndex && a.status !== 'complete'
      );

      if (nextAssetIndex >= 0) {
        setActiveAssetIndex(nextAssetIndex);
        toast({ 
          title: "Asset Complete!", 
          description: `Moving to ${campaignAssets[nextAssetIndex].assetName}`,
          duration: 3000
        });
      } else {
        toast({ 
          title: "Campaign Complete! 🎉", 
          description: "All assets have been completed",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error completing asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark asset as complete',
        variant: 'destructive'
      });
    }
  };

  // Quick complete handler
  const handleQuickComplete = useCallback(async (assetId) => {
    await handleAssetComplete(assetId);
  }, [campaignAssets, activeAssetIndex, initialPackage.projectId]);

  const handleFinalizeCampaign = async () => {
    if (completedCount < totalCount) {
      toast({
        title: 'Incomplete Campaign',
        description: `Please complete all ${totalCount} assets before finalizing`,
        variant: 'destructive'
      });
      return;
    }

    try {
      await supabase
        .from('content_projects')
        .update({ status: 'content-review' })
        .eq('id', initialPackage.projectId);

      toast({
        title: 'Campaign Finalized',
        description: 'Campaign moved to review stage'
      });

      navigate('/');
    } catch (error) {
      console.error('Error finalizing campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to finalize campaign',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar - Asset Navigator */}
      <div className="border-r bg-card w-80 flex flex-col">
        {/* Compact Campaign Header */}
        <div className="border-b px-3 py-3 space-y-2">
          {/* Title with inline badge */}
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold truncate flex-1">{campaignName}</h2>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Campaign</span>
          </div>

          {/* Compact Progress */}
          <div className="flex items-center gap-2">
            <Progress value={overallProgress} className="h-1.5 flex-1" />
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              {completedCount}/{totalCount}
            </span>
          </div>

          {/* Intelligence Summary Card */}
          <CampaignIntelligenceCard
            keyMessage={initialPackage.strategicContext.keyMessage}
            evidence={initialPackage.sharedEvidence}
          />
        </div>

        {/* Asset List - Compact spacing */}
        <div className="flex-1 overflow-y-auto space-y-1.5 p-3">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">Assets</h3>
          {campaignAssets.map((asset, index) => (
            <AssetNavItem
              key={asset.assetId}
              asset={asset}
              isActive={index === activeAssetIndex}
              onClick={() => setActiveAssetIndex(index)}
              order={index + 1}
            />
          ))}
        </div>

        {/* Streamlined Bottom Actions */}
        <div className="p-3 border-t space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate('/content-workshop')}
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          Back to Workshop
        </Button>
          {/* Primary CTA */}
          <Button
            size="sm"
            className="w-full"
            onClick={handleFinalizeCampaign}
            disabled={completedCount < totalCount}
          >
            <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
            Finalize Campaign
          </Button>
        </div>
      </div>

      {/* Main Content - Embedded Editor */}
      <div className="flex-1 overflow-y-auto">
        {activeAsset && (
          <ContentEditor
            assetId={activeAsset.assetId}
            initialData={{
              assetPackage: activeAsset.generatedContent,
              selectedTheme: initialPackage.strategicContext.theme,
              intelligence: initialPackage.strategicContext.intelligence,
              campaignContext: {
                campaignId: initialPackage.campaignId,
                campaignName: initialPackage.campaignName,
                sharedEvidence: initialPackage.sharedEvidence,
                totalAssets: totalCount,
                currentAssetOrder: activeAssetIndex + 1,
                overallProgress
              }
            }}
            onBack={() => {
              if (activeAssetIndex === 0) {
                navigate('/content-workshop');
              } else {
                setActiveAssetIndex(activeAssetIndex - 1);
              }
            }}
            onPublishToDesign={() => handleAssetComplete(activeAsset.assetId)}
          />
        )}
      </div>
    </div>
  );
};