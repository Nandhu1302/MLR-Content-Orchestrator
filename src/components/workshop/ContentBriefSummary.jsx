import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Target, Users, Calendar, CheckCircle, Loader2, Lightbulb, TrendingUp } from 'lucide-react';

// NOTE: The original type imports and interface definitions have been removed for JSX compatibility.
// These utilities must be defined or correctly imported elsewhere for the component to function:
// import { GenerateContentButton } from './GenerateContentButton';
// import { ContentBriefEnhancer } from '@/services/contentBriefEnhancer';


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
  const [aiEnhanced, setAiEnhanced] = useState(null); // Removed AIEnhancedBrief type
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [editedKeyMessage, setEditedKeyMessage] = useState('');

  useEffect(() => {
    const enhanceBrief = async () => {
      // NOTE: selectedAssets must be checked for existence before calling length
      if (detectedIntent && selectedAssets && selectedAssets.length > 0) {
        setIsEnhancing(true);
        try {
          // ContentBriefEnhancer must be imported from the original source for this to work
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
  }, [context, brandId, detectedIntent, selectedAssets]); // Added dependencies to useEffect

  // NOTE: This logic ensures selectedAssets is a valid array before proceeding
  if (!detectedIntent || !selectedAssets || selectedAssets.length === 0) {
    return null;
  }

  const totalEvidence = selectedClaims.length + selectedVisuals.length + selectedModules.length;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/20 border-primary/20">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Content Brief Ready</h3>
        </div>
        {intelligence && (
          <Badge variant="default" className="text-base px-3 py-1">
            {intelligence.overallConfidence}% Confidence
          </Badge>
        )}
      </div>

      {/* Scenario Summary */}
      <div className="space-y-4 mb-6">
        {detectedIntent.occasion && (
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Scenario</p>
              <p className="font-medium">{detectedIntent.occasion}</p>
            </div>
          </div>
        )}

        {detectedIntent.audience && (
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Audience</p>
              <p className="font-medium">{detectedIntent.audience}</p>
            </div>
          </div>
        )}

        {detectedIntent.goals && detectedIntent.goals.length > 0 && (
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Goals</p>
              <div className="flex flex-wrap gap-1">
                {detectedIntent.goals.map((goal, index) => (
                  <Badge key={index} variant="secondary">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Asset Types */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-muted-foreground mb-2">Recommended Assets</p>
        <div className="flex flex-wrap gap-2">
          {selectedAssets.map(asset => (
            <Badge key={asset} variant="outline" className="text-sm">
              <Calendar className="h-3 w-3 mr-1" />
              {asset}
            </Badge>
          ))}
        </div>
      </div>

      {/* Evidence Summary */}
      {totalEvidence > 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-background/50">
          <p className="text-sm font-semibold mb-2">Pre-Selected Evidence</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{selectedClaims.length}</div>
              <div className="text-xs text-muted-foreground">Claims</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{selectedVisuals.length}</div>
              <div className="text-xs text-muted-foreground">Visuals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{selectedModules.length}</div>
              <div className="text-xs text-muted-foreground">Modules</div>
            </div>
          </div>
        </div>
      )}

      {/* Data Attribution */}
      {intelligence && intelligence.dataSourcesUsed.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Intelligence Sources</p>
          <div className="flex flex-wrap gap-1">
            {intelligence.dataSourcesUsed.map(source => (
              <Badge key={source} variant="secondary" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* AI-Enhanced Messaging */}
      {isEnhancing && (
        <div className="mb-6 p-4 border rounded-lg bg-primary/5 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium">AI is enhancing your brief...</span>
        </div>
      )}

      {aiEnhanced && !isEnhancing && (
        <div className="mb-6 space-y-4">
          {/* AI-Suggested Key Message */}
          <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold">✨ AI-Suggested Key Message</span>
            </div>
            <Input
              value={editedKeyMessage}
              onChange={(e) => setEditedKeyMessage(e.target.value)}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              Edit this message to better fit your needs
            </p>
          </div>

          {/* Recommended CTAs */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">🎯 Recommended CTAs</span>
            </div>
            <div className="space-y-2">
              {aiEnhanced.ctaSuggestions.map((cta, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded bg-background">
                  <span className="text-sm">{cta}</span>
                  <Button size="sm" variant="outline">
                    Use
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Prediction */}
          <div className="p-4 border rounded-lg bg-gradient-to-r from-green-500/5 to-emerald-500/5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold">📊 Performance Prediction</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {(aiEnhanced.engagementPrediction * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Predicted Engagement</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {(aiEnhanced.conversionPrediction * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Predicted Conversion</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {aiEnhanced.confidenceScore}%
                </div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Lightbulb className="h-3 w-3" />
              Based on {aiEnhanced.basedOnCampaigns} similar campaigns
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <GenerateContentButton
        context={context}
        selectedClaims={selectedClaims}
        selectedVisuals={selectedVisuals}
        selectedModules={selectedModules}
        brandId={brandId}
        onReset={onReset}
      />
    </Card>
  );
};