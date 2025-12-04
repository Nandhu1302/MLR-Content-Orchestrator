
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContentProjectService } from '@/services/contentProjectService';
import { supabase } from '@/integrations/supabase/client';
// import type { ConversationContext } from '@/types/workshop'; // (Type-only import removed)

/*
interface GenerateContentButtonProps {
  context: ConversationContext;
  selectedClaims: string[];
  selectedVisuals: string[];
  selectedModules: string[];
  brandId: string;
  onReset: () => void;
}
*/

export const GenerateContentButton = ({
  context,
  selectedClaims,
  selectedVisuals,
  selectedModules,
  brandId,
  onReset
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      // STEP 1: Generate ACTUAL content with evidence using AI
      const { data: generatedContent, error: genError } = await supabase.functions.invoke(
        'generate-initial-content',
        {
          body: {
            brandId,
            assetType: context.selectedAssets?.[0] || 'mass-email',
            audienceType: context.detectedIntent?.audience || 'Physician-Specialist',
            objective: context.detectedIntent?.goals?.[0] || 'product-awareness',
            context: {
              story: context.userStory,
              occasion: context.detectedIntent?.occasion,
              eventName: context.detectedIntent?.eventName
            },
            preselectedEvidence: {
              claimIds: selectedClaims,
              visualAssetIds: selectedVisuals,
              moduleIds: selectedModules
            }
          }
        }
      );

      if (genError) {
        console.error('Content generation error:', genError);
        throw new Error('Failed to generate content with AI');
      }

      // STEP 2: Create project with GENERATED content
      const { projectId, assetId } = await ContentProjectService.createProjectWithAsset({
        brandId,
        projectName: `${context.detectedIntent?.occasion || 'Story-Driven'} Campaign`,
        objective: context.detectedIntent?.goals?.[0] || 'Content Creation',
        audience: context.detectedIntent?.audience || 'General',
        assetType: context.selectedAssets?.[0] || 'mass-email',
        generatedContent: generatedContent?.content || {},
        evidenceUsed: {
          claimIds: generatedContent?.usedEvidence?.claims?.map((c) => c.id) || selectedClaims,
          visualAssetIds: generatedContent?.usedEvidence?.visuals?.map((v) => v.id) || selectedVisuals,
          moduleIds: generatedContent?.usedEvidence?.modules?.map((m) => m.id) || selectedModules
        },
        intelligenceAttribution: {
          channel: 'story-workshop',
          source: 'ai-consultant-generated',
          dataPoints: selectedClaims.length + selectedVisuals.length + selectedModules.length
        }
      });

      toast({
        title: "Content Generated Successfully",
        description: `AI-generated content with ${selectedClaims.length} claims, ${selectedVisuals.length} visuals, and ${selectedModules.length} modules. Opening editor...`
      });

      // STEP 3: Navigate to editor with fully populated content
      navigate(`/content-editor/${assetId}`, { 
        state: { 
          contentReady: true,
          generatedByAI: true 
        } 
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content with AI. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="flex-1"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Generating Content...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Content
          </>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={onReset}
        disabled={isGenerating}
        size="lg"
      >
        Start Over
      </Button>
    </div>
  );
};
