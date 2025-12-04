import React, { useState, useMemo, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Wand2, 
  RefreshCw, 
  Zap,
  Eye,
  ArrowRightLeft,
  CheckCircle,
  Maximize2,
  Minimize2,
  Edit3,
  Lightbulb,
  Brain
} from 'lucide-react';
import { ThemeAwareContentService } from '@/services/themeAwareContentService';
import { SmartContentGenerator } from '@/services/smartContentGenerator';
import { AssetTypeLayoutManager } from '@/services/assetTypeLayoutManager';
import { generateActionableRecommendations } from './DynamicStrategyPanel';
import { toast } from '@/hooks/use-toast';

export const UnifiedAIAssistant = ({
  content,
  assetType = 'mass-email',
  targetAudience = 'HCP',
  themeData,
  intakeContext,
  brandId = 'current-brand',
  realTimeAnalysis,
  onApplyContent
}) => {
  const [selectedField, setSelectedField] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [enhancePrompt, setEnhancePrompt] = useState('');
  const [activeTab, setActiveTab] = useState('enhance');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [manualContent, setManualContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [themeIntelligence, setThemeIntelligence] = useState(null);

  // Dynamic field detection from AssetTypeLayoutManager
  const assetLayout = useMemo(() => {
    return AssetTypeLayoutManager.getLayout(assetType);
  }, [assetType]);

  // Extract all fields from asset layout
  const contentFields = useMemo(() => {
    if (!assetLayout) return [];
    
    const fields = [];
    
    assetLayout.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.aiEnabled) {
          fields.push({
            id: field.id,
            label: field.name,
            section: section.name,
            required: field.required,
            aiEnabled: field.aiEnabled
          });
        }
      });
    });
    
    return fields;
  }, [assetLayout]);

  // Auto-select first field if none selected and update manual content
  React.useEffect(() => {
    if (contentFields.length > 0 && !selectedField) {
      setSelectedField(contentFields[0].id);
    }
  }, [contentFields, selectedField]);

  // Update manual content and original content when field changes
  React.useEffect(() => {
    if (selectedField) {
      const fieldValue = content[selectedField] || '';
      setManualContent(fieldValue);
      setOriginalContent(fieldValue);
    }
  }, [selectedField, content]);

  // Fetch theme intelligence when theme is available
  React.useEffect(() => {
    const fetchIntelligence = async () => {
      if (themeData?.id && brandId) {
        try {
          console.log('🧠 Fetching intelligence for theme:', themeData.id);
          const { ThemeIntelligenceService } = await import('@/services/themeIntelligenceService');
          const intelligenceLayers = await ThemeIntelligenceService.getThemeIntelligence(themeData.id, brandId);
          
          console.log('🧠 Raw intelligence layers fetched:', intelligenceLayers.length);
          
          // Convert array to structured object
          const structuredIntelligence = {};
          intelligenceLayers.forEach((layer) => {
            if (layer.incorporated) {
              console.log('✅ Incorporated layer:', layer.intelligence_type);
            }
            structuredIntelligence[layer.intelligence_type] = {
              ...layer.intelligence_data,
              incorporated: layer.incorporated
            };
          });
          
          console.log('🧠 Setting intelligence state with', Object.keys(structuredIntelligence).length, 'layers');
          setThemeIntelligence(structuredIntelligence);
        } catch (error) {
          console.error('❌ Error fetching theme intelligence:', error);
        }
      }
    };
    fetchIntelligence();
  }, [themeData?.id, brandId]);

  const generateEnhancedContent = async () => {
    if (!currentFieldValue && !enhancePrompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide content to enhance or specify what you'd like to improve.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
    const enhanceContext = {
      brandId,
      assetType,
      targetAudience,
      indication: intakeContext?.indication || 'treatment',
      objective: enhancePrompt.trim() || 'enhance_existing',
      keyMessage: content.keyMessage || themeData?.keyMessage || '',
      originalCTA: content.cta || themeData?.callToAction || '',
      currentContent: content,
      themeData,
      intelligence: themeIntelligence
    };
      
      const enhanceResult = await SmartContentGenerator.generateContent(selectedField, enhanceContext, 'enhance');
      
      if (enhanceResult.content) {
        setSuggestions([enhanceResult.content]);
      } else {
        toast({
          title: "Enhancement Failed",
          description: "Please try again with different instructions.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error enhancing content:', error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCustomContent = async () => {
    if (!customPrompt.trim()) return;
    
    setLoading(true);
    try {
      const context = {
        brandId,
        assetType,
        targetAudience,
        indication: intakeContext?.indication || 'treatment',
        objective: customPrompt,
        keyMessage: content.keyMessage || themeData?.keyMessage || '',
        originalCTA: content.cta || themeData?.callToAction || '',
        currentContent: content,
        themeData,
        intelligence: themeIntelligence
      };

      const result = await SmartContentGenerator.generateContent(selectedField, context, 'enhance');
      
      if (result.content) {
        setSuggestions([result.content]);
      } else {
        toast({
          title: "Custom Generation Failed",
          description: "Please try rephrasing your request.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating custom content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate custom content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate recommendations when content changes
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const recs = await generateActionableRecommendations(content, { crossModuleData: { strategy: { selectedTheme: themeData } } }, { id: brandId });
        setRecommendations(recs);
      } catch (error) {
        console.error('Failed to generate recommendations:', error);
      }
    };
    
    if (content && Object.keys(content).length > 0) {
      loadRecommendations();
    }
  }, [content, themeData, brandId]);

  // Apply recommendation
  const handleApplyRecommendation = async (recommendation) => {
    if (!onApplyContent) return;
    
    setLoading(true);
    try {
      const targetField = recommendation.targetField === 'current' ? selectedField : recommendation.targetField;
      
      const context = {
        brandId,
        assetType,
        targetAudience,
        indication: intakeContext?.indication || 'treatment',
        objective: recommendation.prompt,
        keyMessage: content.keyMessage || themeData?.keyMessage || '',
        originalCTA: content.cta || themeData?.callToAction || '',
        currentContent: content
      };

      const result = await SmartContentGenerator.generateContent(targetField, context, 'enhance');
      
      if (result.content) {
        onApplyContent(targetField, result.content);
        toast({
          title: "Recommendation Applied",
          description: `${recommendation.title} has been applied to ${targetField}`,
        });
      }
    } catch (error) {
      console.error('Error applying recommendation:', error);
      toast({
        title: "Application Failed",
        description: "Failed to apply recommendation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyContent = (suggestion) => {
    if (onApplyContent) {
      onApplyContent(selectedField, suggestion);
      
      const isIntelligenceUsed = themeIntelligence && Object.values(themeIntelligence).some(
        (layer) => layer?.incorporated === true
      );
      
      toast({
        title: isIntelligenceUsed ? "✨ Intelligence-Enhanced Content Applied" : "Content Applied",
        description: `Applied AI suggestion to ${selectedField}.`
      });
    }
  };

  const handleManualApply = () => {
    if (!manualContent.trim()) {
      toast({
        title: "Empty Content",
        description: "Please enter some content before applying.",
        variant: "destructive"
      });
      return;
    }

    if (onApplyContent) {
      onApplyContent(selectedField, manualContent);
      setOriginalContent(manualContent);
      toast({
        title: "Content Applied",
        description: `Manual changes applied to ${selectedField}.`
      });
    }
  };

  const handleManualClear = () => {
    setManualContent('');
    toast({
      title: "Cleared",
      description: "Content field cleared."
    });
  };

  const handleManualReset = () => {
    setManualContent(originalContent);
    toast({
      title: "Reset",
      description: "Content reset to original."
    });
  };

  const currentFieldValue = content[selectedField] || '';

  const getFieldIcon = (fieldId) => {
    const iconMap = {
      'subject': '📧',
      'preheader': '👀',
      'headline': '📰',
      'body': '📝',
      'keyMessage': '🎯',
      'cta': '👆',
      'disclaimer': '⚖️',
      'title': '🏷️',
      'description': '📄',
      'tags': '🔖'
    };
    return iconMap[fieldId] || '📄';
  };

  const getAssetTypeDisplay = (type) => {
    const displayMap = {
      'mass-email': 'Mass Email',
      'rep-triggered-email': 'Rep-Triggered Email',
      'social': 'Social Media Post',
      'web': 'Website/Landing Page',
      'dsa': 'Digital Sales Aid',
      'print': 'Print Material'
    };
    return displayMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2 w-full">
          <Bot className="h-4 w-4" />
          AI Assistant
        </Button>
      </DialogTrigger>
      
      <DialogContent className={`${isExpanded ? 'max-w-[98vw] max-h-[98vh]' : 'max-w-[90vw] max-h-[92vh]'} flex flex-col`}>
        <DialogHeader className="flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Content Assistant
            <Badge variant="outline" className="ml-2">
              {getAssetTypeDisplay(assetType)}
            </Badge>
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {isExpanded ? 'Compact' : 'Expand'}
          </Button>
        </DialogHeader>

        {themeIntelligence && Object.values(themeIntelligence).some((layer) => layer?.incorporated === true) && (
          <Alert className="m-6 mb-0 border-primary/20 bg-primary/5">
            <Brain className="h-4 w-4" />
            <AlertDescription>
              <span className="font-semibold">Intelligence-Enhanced Generation</span>
              <p className="text-xs mt-1">
                Using {Object.values(themeIntelligence).filter((l) => l?.incorporated).length} enriched intelligence layers from "{themeData?.name}" theme
              </p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {themeIntelligence.brand?.incorporated && <Badge variant="outline" className="text-xs">Brand</Badge>}
                {themeIntelligence.competitive?.incorporated && <Badge variant="outline" className="text-xs">Competitive</Badge>}
                {themeIntelligence.market?.incorporated && <Badge variant="outline" className="text-xs">Market</Badge>}
                {themeIntelligence.regulatory?.incorporated && <Badge variant="outline" className="text-xs">Regulatory</Badge>}
                {themeIntelligence.public?.incorporated && <Badge variant="outline" className="text-xs">Public</Badge>}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-12 gap-6 p-6 min-h-[650px]">
            {/* Left Panel - Field Selection (30% width) */}
            <div className="col-span-3 border-r pr-4">
              <div className="sticky top-0 bg-background pb-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium">Content Fields</Label>
                  <Badge variant="secondary" className="text-xs">
                    {contentFields.filter(f => content[f.id]).length}/{contentFields.length}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-6">
                {assetLayout?.sections.map((section) => (
                  <div key={section.id} className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
                      {section.name}
                    </div>
                    <div className="space-y-2">
                      {section.fields
                        .filter(f => f.aiEnabled)
                        .map((field) => {
                          const hasContent = content[field.id]?.trim();
                          const isSelected = selectedField === field.id;
                          
                          return (
                            <Button
                              key={field.id}
                              variant={isSelected ? 'default' : 'ghost'}
                              size="sm"
                              className="w-full justify-start gap-3 h-12 px-3"
                              onClick={() => setSelectedField(field.id)}
                            >
                              <span className="text-lg flex-shrink-0">{getFieldIcon(field.id)}</span>
                              <div className="flex-1 text-left min-w-0">
                                <div className="font-medium text-sm truncate">{field.name}</div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {field.required && (
                                  <Badge variant="destructive" className="text-xs h-4 px-1">
                                    *
                                  </Badge>
                                )}
                                {hasContent && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                            </Button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Panel - AI Workspace (70% width) */}
            <div className="col-span-9 px-4">
              {selectedField ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        <span>{getFieldIcon(selectedField)}</span>
                        {contentFields.find(f => f.id === selectedField)?.label}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {contentFields.find(f => f.id === selectedField)?.section}
                      </p>
                    </div>
                    <Badge variant={content[selectedField]?.trim() ? 'default' : 'secondary'}>
                      {content[selectedField]?.trim() ? 'Has Content' : 'Empty'}
                    </Badge>
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="enhance" className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4" />
                        Enhance Content
                      </TabsTrigger>
                      <TabsTrigger value="manual" className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4" />
                        Manual Edit
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="enhance" className="flex-1 flex flex-col mt-4">
                      <Card className="flex-1 flex flex-col">
                        <CardContent className="pt-4 flex-1 flex flex-col">
                          <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                              Enhance existing content or create new content with AI. Provide custom instructions or leave blank for general improvements.
                            </div>
                            
                            {currentFieldValue && (
                              <div className="p-4 bg-muted/50 rounded-md">
                                <div className="text-xs text-muted-foreground mb-2">Current Content:</div>
                                <div className="text-sm max-h-[80px] overflow-y-auto">
                                  {currentFieldValue}
                                </div>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <Label htmlFor="enhance-prompt" className="font-medium">
                                Custom Instructions (Optional)
                              </Label>
                              <Textarea
                                id="enhance-prompt"
                                placeholder="e.g., 'Make it more compelling and add urgency' or 'Create a subject line that emphasizes scientific credibility' or leave blank for AI-powered improvements"
                                value={enhancePrompt}
                                onChange={(e) => setEnhancePrompt(e.target.value)}
                                rows={4}
                                className="resize-none"
                              />
                            </div>
                            
                            <Button 
                              onClick={generateEnhancedContent} 
                              disabled={loading}
                              className="gap-2 w-full"
                            >
                              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                              {currentFieldValue ? 'Enhance Content' : 'Generate Content'}
                            </Button>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="flex-1 min-h-[250px]">
                            {suggestions.length > 0 ? (
                              <div className="space-y-3">
                                <Label className="text-sm font-medium">Enhanced Versions</Label>
                                {suggestions.map((suggestion, index) => (
                                  <Card key={index} className="cursor-pointer" onClick={() => setSelectedSuggestion(suggestion)}>
                                    <CardContent className="p-4">
                                      <div className="space-y-2">
                                        <div className="text-sm">{suggestion}</div>
                                        <div className="flex items-center justify-between">
                                          <Badge variant="secondary" className="text-xs">Enhanced</Badge>
                                          <Button 
                                            size="sm" 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleApplyContent(suggestion);
                                            }}
                                            className="gap-2"
                                          >
                                            <CheckCircle className="h-3 w-3" />
                                            Apply
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                                <div>
                                  <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                  <p>Describe what you'd like to improve and click "Enhance Content"</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>


                    <TabsContent value="manual" className="flex-1 flex flex-col mt-4">
                      <Card className="flex-1 flex flex-col">
                        <CardContent className="pt-4 flex-1 flex flex-col">
                          <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                              Edit content directly with full control. No AI processing.
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="manual-content" className="font-medium">
                                  Content
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                  {manualContent.length} characters
                                </span>
                              </div>
                              <Textarea
                                id="manual-content"
                                placeholder="Type or paste your content here..."
                                value={manualContent}
                                onChange={(e) => setManualContent(e.target.value)}
                                rows={12}
                                className="resize-none font-mono"
                              />
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3">
                              <Button 
                                onClick={handleManualApply}
                                disabled={!manualContent.trim()}
                                className="gap-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Apply Changes
                              </Button>
                              
                              <Button 
                                onClick={handleManualClear}
                                variant="outline"
                                className="gap-2"
                              >
                                Clear Field
                              </Button>
                              
                              <Button 
                                onClick={handleManualReset}
                                variant="outline"
                                disabled={manualContent === originalContent}
                                className="gap-2"
                              >
                                <RefreshCw className="h-4 w-4" />
                                Reset
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                  <div>
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a content field to get started</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedAIAssistant;