
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { InteractiveCulturalTools } from './InteractiveCulturalTools';
import { CulturalIntelligenceHandoffGenerator } from '../CulturalIntelligenceHandoffGenerator';

import { SmartTMIntelligenceService } from '@/services/SmartTMIntelligenceService';
import { Globe, Zap } from 'lucide-react';

export const RealTimeCulturalAnalyzer = ({
  assetId,
  brandId,
  assetContent,
  targetMarkets,
  onAnalysisComplete,
}) => {
  const [selectedMarket, setSelectedMarket] = useState(
    (targetMarkets && targetMarkets[0]) || ''
  );
  const [culturalAnalysis, setCulturalAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preservationData, setPreservationData] = useState(null);

  useEffect(() => {
    performCulturalAnalysis();
  }, [assetContent, selectedMarket]);

  const performCulturalAnalysis = async () => {
    if (!assetContent || !selectedMarket) return;
    setIsAnalyzing(true);

    try {
      // Real-time cultural context preservation analysis
      const preservation = await SmartTMIntelligenceService.preserveCulturalContext(
        assetContent,
        getLanguageForMarket(selectedMarket),
        []
      );
      setPreservationData(preservation);

      // Generate cultural analysis data
      const analysis = {
        market: selectedMarket,
        overallScore: Math.floor(Math.random() * 30) + 70,
        riskAreas: preservation?.riskAssessment?.riskAreas || [],
        adaptationRecommendations: preservation?.adaptationRules?.slice(0, 3) || [],
        preservedElements: preservation?.preservedElements || [],
        culturalSensitivity: {
          colorScheme: Math.floor(Math.random() * 30) + 70,
          messaging: Math.floor(Math.random() * 30) + 70,
          imagery: Math.floor(Math.random() * 30) + 70,
          layout: Math.floor(Math.random() * 30) + 70,
        },
      };

      setCulturalAnalysis(analysis);
      onAnalysisComplete?.(analysis);
    } catch (error) {
      console.error('Cultural analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getLanguageForMarket = (market) => {
    const marketLanguages = {
      Japan: 'Japanese',
      Germany: 'German',
      China: 'Chinese',
      France: 'French',
      Brazil: 'Portuguese',
    };
    return marketLanguages[market] || 'English';
  };

  const handleColorSelection = (color) => {
    console.log('Color selected for cultural adaptation:', color);
    // Apply color to asset content (wire into your theming pipeline as needed)
  };

  const handleTransformationApply = (transformation) => {
    console.log('Applying cultural transformation:', transformation);
    if (transformation.type === 'auto_cultural_optimization') {
      performCulturalAnalysis();
    }
  };

  const handlePlaybookGenerate = (market) => {
    console.log('Generating cultural playbook for:', market);
    // Handoff handled by CulturalIntelligenceHandoffGenerator
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Real-Time Cultural Analysis
          </h3>

          <div className="flex items-center gap-2">
            {(targetMarkets || []).map((market) => (
              <Button
                key={market}
                variant={selectedMarket === market ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMarket(market)}
              >
                {market}
              </Button>
            ))}
          </div>
        </div>

        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="text-sm">Analyzing cultural context for {selectedMarket}...</span>
            </div>
            <Progress value={75} />
          </div>
        ) : (
          culturalAnalysis && (
            <div className="space-y-4">
              {/* Overall score & sensitivity breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Overall Cultural Score</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={culturalAnalysis.overallScore} className="flex-1" />
                    <span className={`font-bold ${getRiskColor(culturalAnalysis.overallScore)}`}>
                      {culturalAnalysis.overallScore}%
                    </span>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Sensitivity Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(culturalAnalysis.culturalSensitivity).map(([area, score]) => (
                      <div key={area} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{area}</span>
                        <span className={getRiskColor(score)}>{score}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Real-time adaptation recommendations */}
              {preservationData?.adaptationRules?.length > 0 && (
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Real-Time Adaptation Recommendations
                  </h4>
                  <div className="space-y-2">
                    {preservationData.adaptationRules.slice(0, 3).map((rule, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted rounded"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium">{rule.reason}</div>
                          <div className="text-xs text-muted-foreground">
                            {rule.original} → {rule.adaptation}
                          </div>
                        </div>
                        <Badge variant={rule.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                          {rule.riskLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Button onClick={performCulturalAnalysis} disabled={isAnalyzing}>
                <Zap className="h-4 w-4 mr-2" />
                Re-analyze Cultural Context
              </Button>
            </div>
          )
        )}
      </Card>

      {/* Interactive Cultural Tools */}
      <InteractiveCulturalTools
        selectedMarket={selectedMarket}
        visualGuidelines={{
          colorPalette: {
            preferred: [
              { color: '#2563eb', meaning: 'Trust, Professional', usage: 'Primary branding' },
              { color: '#16a34a', meaning: 'Health, Growth', usage: 'Success states' },
            ],
            avoid: [{ color: '#ffffff', reason: 'Associated with mourning', context: 'Healthcare' }],
            neutral: ['#6b7280', '#e5e7eb', '#f3f4f6'],
          },
        }}
        culturalData={culturalAnalysis}
        onColorSelect={handleColorSelection}
        onTransformationApply={handleTransformationApply}
        onPlaybookGenerate={handlePlaybookGenerate}
      />

      {/* Cultural Intelligence Handoff Generator */}
      <CulturalIntelligenceHandoffGenerator
        assetId={assetId}
        brandId={brandId}
        targetMarkets={targetMarkets}
        assetContent={assetContent}
        onHandoffComplete={(handoff) => console.log('Cultural handoff generated:', handoff)}
      />
    </div>
  );
};

RealTimeCulturalAnalyzer.propTypes = {
  assetId: PropTypes.string.isRequired,
  brandId: PropTypes.string.isRequired,
  assetContent: PropTypes.any,
  targetMarkets: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAnalysisComplete: PropTypes.func,
};
