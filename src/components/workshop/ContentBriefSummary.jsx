
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Target, Users, Calendar, CheckCircle, Loader2, Lightbulb, TrendingUp } from 'lucide-react';
// import type { ConversationContext } from '@/types/workshop'; // Removed type-only import
// import type { MatchedIntelligence } from '@/services/intelligence'; // Removed type-only import
import { GenerateContentButton } from './GenerateContentButton';
import { ContentBriefEnhancer } from '@/services/contentBriefEnhancer';
// import type { AIEnhancedBrief } from '@/services/contentBriefEnhancer'; // Removed type-only import

/*
interface ContentBriefSummaryProps {
  context: ConversationContext;
  intelligence: MatchedIntelligence | null;
  selectedClaims: string[];
  selectedVisuals: string[];
  selectedModules: string[];
  brandId: string;
  onReset: () => void;
}
*/

export const ContentBriefSummary = ({
  context,
  intelligence,
  selectedClaims,
  selectedVisuals,
  selectedModules,
  brandId,
  onReset
}) => {
  const { detectedIntent, selectedAssets } = context;
  const [aiEnhanced, setAiEnhanced] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [editedKeyMessage, setEditedKeyMessage] = useState('');

  useEffect(() => {
    const enhanceBrief = async () => {
      if (detectedIntent && selectedAssets && selectedAssets.length > 0) {
        setIsEnhancing(true);
        try {
          const enhanced = await ContentBriefEnhancer.enhanceBriefWithAI(context, brandId);
          setAiEnhanced(enhanced);
          if (enhanced) {
            setEditedKeyMessage(enhanced.keyMessage);
          }
        } finally {
          setIsEnhancing(false);
        }
      }
    };
    enhanceBrief();
  }, [context, brandId]);

  if (!detectedIntent || !selectedAssets || selectedAssets.length === 0) {
    return null;
  }

  const totalEvidence = selectedClaims.length + selectedVisuals.length + selectedModules.length;

  return (
    <Card className="space-y-4 p-6">
      <h4 className="text-lg font-semibold">Content Brief Ready</h4>

      {intelligence && (
        <p className="text-sm text-muted-foreground">{intelligence.overallConfidence}% Confidence</p>
      )}

      {/* Scenario Summary */}
      {detectedIntent.occasion && (
        <div>
          <Badge variant="outline" className="mr-2">Scenario</Badge>
          {detectedIntent.occasion}
        </div>
      )}
      {detectedIntent.audience && (
        <div>
          <Badge variant="outline" className="mr-2">Audience</Badge>
          {detectedIntent.audience}
        </div>
      )}
      {detectedIntent.goals && detectedIntent.goals.length > 0 && (
        <div>
          <Badge variant="outline" className="mr-2">Goals</Badge>
          {detectedIntent.goals.map((goal, index) => (
            <span key={index} className="mr-1">{goal}</span>
          ))}
        </div>
      )}

      {/* Asset Types */}
      <div>
        <Badge variant="outline" className="mr-2">Recommended Assets</Badge>
        {selectedAssets.map((asset, index) => (
          <span key={index} className="mr-1">{asset}</span>
        ))}
      </div>

      {/* Evidence Summary */}
      {totalEvidence > 0 && (
        <div>
          <Badge variant="outline" className="mr-2">Pre-Selected Evidence</Badge>
          <div>{selectedClaims.length} Claims</div>
          <div>{selectedVisuals.length} Visuals</div>
          <div>{selectedModules.length} Modules</div>
        </div>
      )}

      {/* Data Attribution */}
      {intelligence && intelligence.dataSourcesUsed.length > 0 && (
        <div>
          <Badge variant="outline" className="mr-2">Intelligence Sources</Badge>
          {intelligence.dataSourcesUsed.map((source, index) => (
            <span key={index} className="mr-1">{source}</span>
          ))}
        </div>
      )}

      {/* AI-Enhanced Messaging */}
      {isEnhancing && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          AI is enhancing your brief...
        </div>
      )}

      {aiEnhanced && !isEnhancing && (
        <div className="space-y-4">
          {/* AI-Suggested Key Message */}
          <div>
            <h5 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI-Suggested Key Message
            </h5>
            <Input
              value={editedKeyMessage}
              onChange={(e) => setEditedKeyMessage(e.target.value)}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">Edit this message to better fit your needs</p>
          </div>

          {/* Recommended CTAs */}
          <div>
            <h5 className="font-semibold flex items-center gap-2">
              🎯 Recommended CTAs
            </h5>
            {aiEnhanced.ctaSuggestions.map((cta, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{cta}</span>
                <Button size="sm" variant="outline">Use</Button>
              </div>
            ))}
          </div>

          {/* Performance Prediction */}
          <div>
            <h5 className="font-semibold flex items-center gap-2">
              📊 Performance Prediction
            </h5>
            <p>{(aiEnhanced.engagementPrediction * 100).toFixed(1)}% Predicted Engagement</p>
            <p>{(aiEnhanced.conversionPrediction * 100).toFixed(1)}% Predicted Conversion</p>
            <p>{aiEnhanced.confidenceScore}% Confidence</p>
            <p className="text-xs text-muted-foreground">
              Based on {aiEnhanced.basedOnCampaigns} similar campaigns
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <GenerateContentButton />
    </Card>
  );
};
