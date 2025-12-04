import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Sparkles, Save, RefreshCw, Eye, TrendingUp, 
  Settings, CheckCircle2, Star 
} from 'lucide-react';
import { VariationSelector } from './VariationSelector';
import { SavedVariationsPanel } from './SavedVariationsPanel';
import { VariationGenerationService } from '@/services/variationGenerationService';
import { ContentService } from '@/services/contentService';

export const PersonalizationHub = ({
  currentAsset,
  onVariationsSaved
}) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [generatedVariations, setGeneratedVariations] = useState([]);
  const [selectedVariationIds, setSelectedVariationIds] = useState(new Set());
  const [primaryVariationId, setPrimaryVariationId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedVariations, setSavedVariations] = useState([]);

  // Load existing saved variations
  useEffect(() => {
    loadSavedVariations();
  }, [currentAsset.id]);

  const loadSavedVariations = async () => {
    const variations = await ContentService.getVariations(currentAsset.id);
    setSavedVariations(variations);
  };

  const handleGenerateVariations = async () => {
    if (selectedFactors.length === 0) {
      toast({
        title: 'No factors selected',
        description: 'Please select at least one personalization factor combination',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    try {
      const variations = await VariationGenerationService.generateVariations(
        currentAsset,
        selectedFactors
      );

      setGeneratedVariations(variations);
      
      toast({
        title: 'Variations generated',
        description: `Successfully generated ${variations.length} content variations`
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: 'Failed to generate variations. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSelectedVariations = async () => {
    if (selectedVariationIds.size === 0) {
      toast({
        title: 'No variations selected',
        description: 'Please select at least one variation to save',
        variant: 'destructive'
      });
      return;
    }

    if (!primaryVariationId) {
      toast({
        title: 'No primary variation',
        description: 'Please designate one variation as primary',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    try {
      const variationsToSave = generatedVariations
        .filter((_, index) => selectedVariationIds.has(`gen_${index}`))
        .map(variation => ({
          asset_id: currentAsset.id,
          variation_name: variation.variation_name,
          variation_type: determineVariationType(variation.personalization_factors),
          target_context: variation.personalization_factors,
          content_data: variation.content_data,
          personalization_factors: variation.personalization_factors,
          performance_metrics: variation.predicted_performance,
          is_primary: `gen_${generatedVariations.indexOf(variation)}` === primaryVariationId,
          is_active: true
        }));

      // Save all selected variations
      for (const variationData of variationsToSave) {
        await ContentService.createVariation(variationData);
      }

      toast({
        title: 'Variations saved',
        description: `Saved ${variationsToSave.length} variations successfully`
      });

      // Clear generated variations and reload saved
      setGeneratedVariations([]);
      setSelectedVariationIds(new Set());
      setPrimaryVariationId(null);
      setSelectedFactors([]);
      await loadSavedVariations();
      onVariationsSaved();
      setActiveTab('saved');
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save variations. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const determineVariationType = (factors) => {
    if (factors.variation_purpose === 'ab_test') return 'ab_test';
    if (factors.variation_purpose === 'sub_segmentation') return 'audience';
    return 'audience';
  };

  const toggleVariationSelection = (variationId) => {
    const newSelection = new Set(selectedVariationIds);
    if (newSelection.has(variationId)) {
      newSelection.delete(variationId);
      if (primaryVariationId === variationId) {
        // If removing the primary, set the first remaining item as primary
        const remainingIds = Array.from(newSelection).filter(id => id !== variationId);
        setPrimaryVariationId(remainingIds.length > 0 ? remainingIds[0] : null);
      }
    } else {
      newSelection.add(variationId);
      // Auto-set as primary if it's the first selection
      if (newSelection.size === 1 && !primaryVariationId) {
        setPrimaryVariationId(variationId);
      }
    }
    setSelectedVariationIds(newSelection);
  };

  const handleSetPrimary = (variationId) => {
    if (!selectedVariationIds.has(variationId)) {
      toggleVariationSelection(variationId);
    }
    setPrimaryVariationId(variationId);
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Content Personalization & Variations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">
                <Settings className="h-4 w-4 mr-2" />
                Generate Variations
              </TabsTrigger>
              <TabsTrigger value="saved">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Saved Variations ({savedVariations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6 mt-6">
              {/* Step 1: Select Personalization Factors */}
              <VariationSelector
                assetType={currentAsset.asset_type}
                primaryAudience={currentAsset.target_audience || 'hcp'}
                selectedFactors={selectedFactors}
                onFactorsChange={setSelectedFactors}
              />

              {/* Generate Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerateVariations}
                  disabled={isGenerating || selectedFactors.length === 0}
                  className="flex-1"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate {selectedFactors.length} Variation{selectedFactors.length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>

              {/* Step 2: Review & Select Variations */}
              {generatedVariations.length > 0 && (
                <>
                  <div className="border-t pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Review Generated Variations
                      </h3>
                      <Badge variant="secondary">
                        {selectedVariationIds.size} of {generatedVariations.length} selected
                      </Badge>
                    </div>

                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-3">
                        {generatedVariations.map((variation, index) => {
                          const variationId = `gen_${index}`;
                          const isSelected = selectedVariationIds.has(variationId);
                          const isPrimary = primaryVariationId === variationId;

                          return (
                            <Card key={variationId} className={`p-4 ${isSelected ? 'border-primary' : ''}`}>
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleVariationSelection(variationId)}
                                  className="mt-1"
                                />
                                
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">
                                        {variation.variation_name}
                                      </Badge>
                                      {isPrimary && (
                                        <Badge variant="default" className="flex items-center gap-1">
                                          <Star className="h-3 w-3" />
                                          Primary
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    {isSelected && !isPrimary && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleSetPrimary(variationId)}
                                      >
                                        <Star className="h-3 w-3 mr-1" />
                                        Set as Primary
                                      </Button>
                                    )}
                                  </div>

                                  <div className="text-sm space-y-1">
                                    <div>
                                      <span className="font-medium">Headline:</span> {variation.content_data.headline}
                                    </div>
                                    <div>
                                      <span className="font-medium">Body:</span> {variation.content_data.body?.substring(0, 100)}...
                                    </div>
                                    <div>
                                      <span className="font-medium">CTA:</span> {variation.content_data.cta}
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Badge variant="secondary" className="text-xs">
                                      <TrendingUp className="h-3 w-3 mr-1" />
                                      Engagement: {Math.round(variation.predicted_performance.engagement_score)}%
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      Compliance: {Math.round(variation.predicted_performance.compliance_score)}%
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </ScrollArea>

                    {/* Save Button */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveSelectedVariations}
                        disabled={isSaving || selectedVariationIds.size === 0 || !primaryVariationId}
                        className="flex-1"
                        size="lg"
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save {selectedVariationIds.size} Selected Variation{selectedVariationIds.size !== 1 ? 's' : ''}
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          setGeneratedVariations([]);
                          setSelectedVariationIds(new Set());
                          setPrimaryVariationId(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <SavedVariationsPanel
                assetId={currentAsset.id}
                variations={savedVariations}
                onVariationsUpdate={loadSavedVariations}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};