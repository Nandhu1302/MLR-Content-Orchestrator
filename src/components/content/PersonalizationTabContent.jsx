import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Send, Users, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { VariationSelector } from './VariationSelector';
import { VariationGenerationService } from '@/services/variationGenerationService';
import { ContentService } from '@/services/contentService';
import { PreviewModal } from './PreviewModal';
import { DesignHandoffModal } from './DesignHandoffModal';
import { toast } from '@/hooks/use-toast';

// Helper to get contextual labels based on asset type
const getAssetTypeLabels = (assetType) => {
  const isEmailAsset = ['email', 'mass-email', 'rep-triggered-email', 'patient-email', 'caregiver-email', 'hcp-email'].includes(assetType);
  const isDSAAsset = ['digital-sales-aid', 'dsa'].includes(assetType);
  
  if (isDSAAsset) {
    return {
      generateTitle: 'Generate Module Variants',
      savedTitle: 'Saved Module Variants',
      buttonLabel: 'Variant'
    };
  }
  if (!isEmailAsset) {
    return {
      generateTitle: 'Generate Audience Variants',
      savedTitle: 'Saved Audience Variants',
      buttonLabel: 'Variant'
    };
  }
  return {
    generateTitle: 'Generate Personalized Variations',
    savedTitle: 'Saved Variations',
    buttonLabel: 'Variation'
  };
};

export const PersonalizationTabContent = ({
  currentAsset,
  baseContent,
  onVariationsSaved
}) => {
  const labels = getAssetTypeLabels(currentAsset.asset_type);
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [generatedVariations, setGeneratedVariations] = useState([]);
  const [savedVariations, setSavedVariations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewVariation, setPreviewVariation] = useState(null);
  const [designHandoffVariation, setDesignHandoffVariation] = useState(null);

  // Load saved variations
  useEffect(() => {
    loadSavedVariations();
  }, [currentAsset.id]);

  const loadSavedVariations = async () => {
    try {
      const variations = await ContentService.getContentVariations(currentAsset.id);
      setSavedVariations(variations);
    } catch (error) {
      console.error('Error loading variations:', error);
    }
  };

  const handleGenerateVariations = async () => {
    if (selectedFactors.length === 0) {
      toast({
        title: "No Factors Selected",
        description: "Please select personalization factors to generate variations.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await VariationGenerationService.generateVariations(
        currentAsset,
        selectedFactors
      );
      
      setGeneratedVariations(generated);
      
      toast({
        title: "Variations Generated",
        description: `Generated ${generated.length} personalized variations.`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate variations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveVariation = async (variation) => {
    try {
      await ContentService.saveContentVariation(currentAsset.id, {
        variation_name: variation.variation_name,
        variation_type: 'audience',
        content_data: variation.content_data,
        target_context: { description: variation.variation_name },
        personalization_factors: variation.personalization_factors,
        is_primary: false,
        is_active: true,
        performance_metrics: variation.predicted_performance || {}
      });

      toast({
        title: "Variation Saved",
        description: `"${variation.variation_name}" has been saved successfully.`
      });

      loadSavedVariations();
      // Remove from generated list
      setGeneratedVariations(prev => prev.filter(v => v.variation_name !== variation.variation_name));
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save variation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePreviewVariation = (variation) => {
    setPreviewVariation(variation);
  };

  const handleSendToDesign = (variation) => {
    setDesignHandoffVariation(variation);
  };

  const primaryVariation = savedVariations.find(v => v.is_primary);

  return (
    <div className="space-y-6">
      {/* Section 1: Primary Variation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Primary Variation (Base Content)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="default" className="mb-2">Primary</Badge>
              <p className="text-sm text-muted-foreground">
                Original finalized content serves as the base for all variations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (primaryVariation) {
                    handlePreviewVariation(primaryVariation);
                  }
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (primaryVariation) {
                    handleSendToDesign(primaryVariation);
                  }
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Design
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Section 2: Generate New Variations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {labels.generateTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <VariationSelector
            assetType={currentAsset.asset_type}
            primaryAudience={currentAsset.target_audience || 'HCP'}
            selectedFactors={selectedFactors}
            onFactorsChange={setSelectedFactors}
          />

          <Button
            onClick={handleGenerateVariations}
            disabled={isGenerating || selectedFactors.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate {selectedFactors.length} {labels.buttonLabel}{selectedFactors.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>

          {/* Generated Variations (not yet saved) */}
          {generatedVariations.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Generated Variations ({generatedVariations.length})</h3>
              {generatedVariations.map((variation, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{variation.variation_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Performance: {variation.predicted_performance?.engagement_score || 'N/A'}% engagement
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreviewVariation(variation)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSaveVariation(variation)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Section 3: Saved Variations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {labels.savedTitle} ({savedVariations.filter(v => !v.is_primary).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {savedVariations.filter(v => !v.is_primary).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No {labels.buttonLabel.toLowerCase()}s saved yet. Generate and save {labels.buttonLabel.toLowerCase()}s above.
            </p>
          ) : (
            <div className="space-y-4">
              {savedVariations.filter(v => !v.is_primary).map((variation) => (
                <Card key={variation.id} className="bg-background">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{variation.variation_name}</p>
                          <Badge variant={variation.is_active ? 'default' : 'secondary'}>
                            {variation.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {variation.target_context?.description || 'No description'}
                        </p>
                        {variation.performance_metrics && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Engagement: {variation.performance_metrics.engagement || 'N/A'}%</span>
                            <span>Compliance: {variation.performance_metrics.compliance || 'N/A'}%</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreviewVariation(variation)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendToDesign(variation)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send to Design
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewVariation && (
        <PreviewModal
          isOpen={!!previewVariation}
          onClose={() => setPreviewVariation(null)}
          content={previewVariation.content_data}
          assetType={currentAsset.asset_type}
          themeData={null}
        />
      )}

      {/* Design Handoff Modal */}
      {designHandoffVariation && (
        <DesignHandoffModal
          isOpen={!!designHandoffVariation}
          onClose={() => setDesignHandoffVariation(null)}
          variation={designHandoffVariation}
          asset={currentAsset}
          onHandoffCreated={() => {
            setDesignHandoffVariation(null);
            toast({
              title: "Sent to Design",
              description: `"${designHandoffVariation.variation_name}" has been sent to the design team.`
            });
          }}
        />
      )}
    </div>
  );
};