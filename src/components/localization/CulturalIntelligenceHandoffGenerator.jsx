import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Palette,
  Users,
  MessageSquare,
  MapPin,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

export const CulturalIntelligenceHandoffGenerator = ({
  assetId,
  brandId,
  targetMarkets,
  assetContent,
  onHandoffComplete
}) => {
  const [playbooks, setPlaybooks] = useState(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(targetMarkets[0] || '');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('transformations');

  useEffect(() => {
    generateCulturalPlaybooks();
  }, [assetId, targetMarkets]);

  const generateCulturalPlaybooks = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const newPlaybooks = new Map();
      
      for (let i = 0; i < targetMarkets.length; i++) {
        const market = targetMarkets[i];
        setGenerationProgress(((i + 1) / targetMarkets.length) * 100);
        
        const playbook = await generateMarketSpecificPlaybook(market, assetContent, brandId);
        newPlaybooks.set(market, playbook);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setPlaybooks(newPlaybooks);
      onHandoffComplete({
        playbooks: Array.from(newPlaybooks.values()),
        generatedAt: new Date().toISOString(),
        assetId
      });
    } catch (error) {
      console.error('Failed to generate cultural playbooks:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(100);
    }
  };

  const generateMarketSpecificPlaybook = async (
    market, 
    content, 
    brandId
  ) => {
    // Market-specific transformation rules with exact instructions
    const marketRules = getMarketSpecificRules(market);
    const visualAdaptations = getVisualAdaptationGuidelines(market);
    const sensitivityMap = generateSensitivityHeatMap(market, content);
    const insights = generateActionableInsights(market, content);

    return {
      market,
      language: getLanguageForMarket(market),
      transformationRules: marketRules,
      visualAdaptations,
      sensitivityHeatMap: sensitivityMap,
      actionableInsights: insights
    };
  };

  const getMarketSpecificRules = (market) => {
    const rules = {
      'Japan': [
        {
          category: 'messaging',
          rule: 'Replace direct CTAs with softer consultation suggestions',
          example: '"Schedule now" → "Please consider scheduling a consultation"',
          rationale: 'Japanese culture values indirect communication and patient deliberation',
          priority: 'high'
        },
        {
          category: 'tone',
          rule: 'Use formal honorific language (keigo) for all healthcare communications',
          example: '"You can take this" → "Please consider taking this medication"',
          rationale: 'Respect and formality are essential in Japanese healthcare',
          priority: 'high'
        },
        {
          category: 'structure',
          rule: 'Include family decision-making context',
          example: 'Add "Discuss with your family" sections',
          rationale: 'Healthcare decisions often involve family consultation in Japan',
          priority: 'medium'
        }
      ],
      'Germany': [
        {
          category: 'messaging',
          rule: 'Emphasize technical precision and include detailed efficacy data',
          example: 'Include specific percentages and clinical trial references',
          rationale: 'German patients expect detailed, scientific information',
          priority: 'high'
        },
        {
          category: 'tone',
          rule: 'Use formal, authoritative tone with medical terminology',
          example: '"Feel better" → "Achieve measurable symptom improvement"',
          rationale: 'Germans prefer precise, clinical language over emotional appeals',
          priority: 'high'
        }
      ],
      'China': [
        {
          category: 'messaging',
          rule: 'Include family decision-making context in patient materials',
          example: 'Add sections for "Discussing with family members"',
          rationale: 'Chinese culture emphasizes collective family health decisions',
          priority: 'high'
        },
        {
          category: 'visual',
          rule: 'Use gold and red accents, avoid white in primary design',
          example: 'Replace white backgrounds with warm gold tones',
          rationale: 'White is associated with mourning in Chinese culture',
          priority: 'medium'
        }
      ]
    };

    return rules[market] || [];
  };

  const getVisualAdaptationGuidelines = (market) => {
    const adaptations = {
      'Japan': [
        {
          element: 'Color Palette',
          beforeGuidance: 'Bold, high-contrast colors',
          afterGuidance: 'Soft, harmonious color combinations with emphasis on blues and greens',
          culturalReason: 'Japanese aesthetics favor subtlety and natural harmony',
          examples: ['Use sakura pink for wellness themes', 'Incorporate traditional blue (ai-iro)']
        },
        {
          element: 'Typography',
          beforeGuidance: 'Large, bold Western fonts',
          afterGuidance: 'Clean, readable fonts with proper spacing for kanji/hiragana',
          culturalReason: 'Japanese text requires careful consideration of character spacing',
          examples: ['Use Hiragino Sans for digital', 'Ensure 1.5x line spacing minimum']
        }
      ],
      'Germany': [
        {
          element: 'Layout Structure',
          beforeGuidance: 'Emotional imagery and testimonials prominent',
          afterGuidance: 'Data tables, charts, and scientific diagrams prominent',
          culturalReason: 'Germans prefer evidence-based information presentation',
          examples: ['Lead with efficacy charts', 'Include detailed side effect tables']
        }
      ],
      'China': [
        {
          element: 'Symbolic Elements',
          beforeGuidance: 'Western medical symbols and imagery',
          afterGuidance: 'Incorporate traditional Chinese wellness concepts',
          culturalReason: 'Integration with traditional medicine concepts increases acceptance',
          examples: ['Use balance and harmony imagery', 'Include family wellness themes']
        }
      ]
    };

    return adaptations[market] || [];
  };

  const generateSensitivityHeatMap = (market, content) => {
    // Generate market-specific sensitivity analysis
    return [
      {
        contentArea: 'Direct medical claims',
        riskLevel: 'high',
        specificConcerns: ['Regulatory compliance', 'Cultural appropriateness'],
        mitigationStrategies: ['Add disclaimers', 'Use softer language', 'Include physician consultation guidance']
      },
      {
        contentArea: 'Visual imagery',
        riskLevel: 'medium',
        specificConcerns: ['Cultural symbols', 'Color associations'],
        mitigationStrategies: ['Review color choices', 'Validate imagery with local team']
      },
      {
        contentArea: 'Call-to-action language',
        riskLevel: 'low',
        specificConcerns: ['Communication style'],
        mitigationStrategies: ['Adapt to local communication norms']
      }
    ];
  };

  const generateActionableInsights = (market, content) => {
    return [
      {
        insight: 'Implement graduated messaging approach for cultural sensitivity',
        impact: 'high',
        implementation: 'Create 3 versions: direct, moderate, and culturally adapted',
        timeEstimate: '2-3 days'
      },
      {
        insight: 'Develop market-specific visual asset variations',
        impact: 'medium',
        implementation: 'Adapt color schemes and imagery to local preferences',
        timeEstimate: '1-2 days'
      }
    ];
  };

  const getLanguageForMarket = (market) => {
    const marketLanguages = {
      'Japan': 'Japanese',
      'Germany': 'German',
      'China': 'Chinese (Simplified)',
      'France': 'French',
      'Brazil': 'Portuguese'
    };
    return marketLanguages[market] || 'English';
  };

  const exportPlaybook = async (format) => {
    const selectedPlaybook = playbooks.get(selectedMarket);
    if (!selectedPlaybook) return;

    // Create export data
    const exportData = {
      market: selectedMarket,
      playbook: selectedPlaybook,
      exportFormat: format,
      exportedAt: new Date().toISOString()
    };

    console.log(`Exporting ${selectedMarket} playbook as ${format}:`, exportData);
    
    // In a real implementation, this would generate and download the file
    alert(`${selectedMarket} cultural playbook exported as ${format.toUpperCase()}`);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const currentPlaybook = playbooks.get(selectedMarket);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cultural Intelligence Handoff Generator
          </CardTitle>
          {!isGenerating && currentPlaybook && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportPlaybook('pdf')}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportPlaybook('docx')}>
                <Download className="h-4 w-4 mr-1" />
                Word
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportPlaybook('json')}>
                <Download className="h-4 w-4 mr-1" />
                JSON
              </Button>
            </div>
          )}
        </div>
        
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Generating cultural playbooks...</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!isGenerating && playbooks.size > 0 && (
          <>
            {/* Market Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Select Market:</label>
              <div className="flex gap-2 flex-wrap">
                {targetMarkets.map((market) => (
                  <Button
                    key={market}
                    variant={selectedMarket === market ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMarket(market)}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    {market}
                  </Button>
                ))}
              </div>
            </div>

            {currentPlaybook && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="transformations">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Transformations
                  </TabsTrigger>
                  <TabsTrigger value="visual">
                    <Palette className="h-4 w-4 mr-1" />
                    Visual Guide
                  </TabsTrigger>
                  <TabsTrigger value="sensitivity">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Heat Map
                  </TabsTrigger>
                  <TabsTrigger value="insights">
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="transformations" className="space-y-4">
                  <h3 className="text-lg font-semibold">Market-Specific Transformation Rules</h3>
                  {currentPlaybook.transformationRules.map((rule, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getPriorityColor(rule.priority)}>
                            {rule.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary">{rule.category}</Badge>
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">{rule.rule}</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Example: </span>
                          <span className="text-muted-foreground">{rule.example}</span>
                        </div>
                        <div>
                          <span className="font-medium">Rationale: </span>
                          <span className="text-muted-foreground">{rule.rationale}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="visual" className="space-y-4">
                  <h3 className="text-lg font-semibold">Visual Adaptation Guidelines</h3>
                  {currentPlaybook.visualAdaptations.map((adaptation, index) => (
                    <Card key={index} className="p-4">
                      <h4 className="font-medium mb-3">{adaptation.element}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-destructive">Before:</span>
                          <p className="text-sm text-muted-foreground mt-1">{adaptation.beforeGuidance}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-success">After:</span>
                          <p className="text-sm text-muted-foreground mt-1">{adaptation.afterGuidance}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-sm font-medium">Cultural Reason: </span>
                        <span className="text-sm text-muted-foreground">{adaptation.culturalReason}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium">Examples: </span>
                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                          {adaptation.examples.map((example, idx) => (
                            <li key={idx}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="sensitivity" className="space-y-4">
                  <h3 className="text-lg font-semibold">Cultural Sensitivity Heat Map</h3>
                  {currentPlaybook.sensitivityHeatMap.map((area, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{area.contentArea}</h4>
                        <Badge className={getRiskColor(area.riskLevel)}>
                          {area.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium">Specific Concerns:</span>
                          <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                            {area.specificConcerns.map((concern, idx) => (
                              <li key={idx}>{concern}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Mitigation Strategies:</span>
                          <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                            {area.mitigationStrategies.map((strategy, idx) => (
                              <li key={idx}>{strategy}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="insights" className="space-y-4">
                  <h3 className="text-lg font-semibold">Actionable Intelligence Insights</h3>
                  {currentPlaybook.actionableInsights.map((insight, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <Badge variant={insight.impact === 'high' ? 'destructive' : 'secondary'}>
                            {insight.impact.toUpperCase()} IMPACT
                          </Badge>
                        </div>
                        <Badge variant="outline">{insight.timeEstimate}</Badge>
                      </div>
                      <h4 className="font-medium mb-2">{insight.insight}</h4>
                      <p className="text-sm text-muted-foreground">{insight.implementation}</p>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </>
        )}

        {isGenerating && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Analyzing cultural requirements and generating playbooks...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};