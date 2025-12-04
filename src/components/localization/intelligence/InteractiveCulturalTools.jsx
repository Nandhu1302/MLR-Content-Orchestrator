
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Palette, Eye, Wand2, FileText, Globe, Download } from 'lucide-react';

export const InteractiveCulturalTools = ({
  selectedMarket,
  visualGuidelines,
  culturalData,
  onColorSelect,
  onTransformationApply,
  onPlaybookGenerate,
}) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [culturalScore, setCulturalScore] = useState(0);
  const [activeTool, setActiveTool] = useState('palette'); // 'palette' | 'heatmap' | 'analyzer'

  // Recompute cultural score when data or market changes (keep original fallback behavior)
  useEffect(() => {
    if (culturalData) {
      const score =
        culturalData?.overallScore ??
        (Math.floor(Math.random() * 30) + 70); // original file used a random fallback
      setCulturalScore(score);
    }
  }, [culturalData, selectedMarket]); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/In%207.txt)

  /** ---------------------------
   * Color Palette Tool
   * -------------------------- */
  const ColorPaletteTool = () => {
    const colorCategories =
      visualGuidelines?.colorPalette ?? {
        preferred: [
          { color: '#2563eb', meaning: 'Trust, Professional', usage: 'Primary branding' },
          { color: '#16a34a', meaning: 'Health, Growth', usage: 'Success states' },
          { color: '#dc2626', meaning: 'Important, Urgent', usage: 'Warnings only' },
        ],
        avoid: [
          { color: '#ffffff', reason: 'Associated with mourning', context: 'Healthcare' },
          { color: '#000000', reason: 'Too formal', context: 'Marketing' },
        ],
        neutral: ['#6b7280', '#e5e7eb', '#f3f4f6'],
      }; // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/In%207.txt)

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Interactive Color Palette for {selectedMarket}
          </h4>
          <Badge variant="outline">{selectedColors.length} selected</Badge>
        </div>

        {/* Preferred */}
        <Card className="p-4">
          <h5 className="font-medium mb-3">✓ Culturally Preferred</h5>
          <div className="grid grid-cols-3 gap-3">
            {colorCategories.preferred.map((colorData, idx) => (
              <Card key={idx} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: colorData.color }}
                  />
                  <div>
                    <div className="text-sm font-medium">{colorData.meaning}</div>
                    <div className="text-xs text-muted-foreground">{colorData.usage}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onColorSelect?.(colorData.color);
                    setSelectedColors((prev) =>
                      prev.includes(colorData.color) ? prev : [...prev, colorData.color]
                    );
                  }}
                >
                  Use
                </Button>
              </Card>
            ))}
          </div>
        </Card>

        {/* Avoid */}
        <Card className="p-4">
          <h5 className="font-medium mb-3">⚠ Avoid These Colors</h5>
          <div className="grid grid-cols-2 gap-3">
            {colorCategories.avoid.map((colorData, idx) => (
              <Card key={idx} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded border relative"
                    style={{ backgroundColor: colorData.color }}
                  >
                    <span
                      className="absolute inset-0 block"
                      style={{
                        background:
                          'repeating-linear-gradient(45deg, rgba(255,0,0,0.4) 0, rgba(255,0,0,0.4) 2px, transparent 2px, transparent 6px)',
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{colorData.reason}</div>
                    <div className="text-xs text-muted-foreground">{colorData.context}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Neutral */}
        <Card className="p-4">
          <h5 className="font-medium mb-3">Cultural‑Safe Neutrals</h5>
          <div className="flex gap-2 flex-wrap">
            {colorCategories.neutral.map((color, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="px-2"
                onClick={() => {
                  onColorSelect?.(color);
                  setSelectedColors((prev) => (prev.includes(color) ? prev : [...prev, color]));
                }}
              >
                <span
                  className="inline-block w-5 h-5 rounded border mr-2 align-middle"
                  style={{ backgroundColor: color }}
                />
                {color}
              </Button>
            ))}
          </div>
        </Card>

        {/* Selected Palette */}
        {selectedColors.length > 0 && (
          <Card className="p-4">
            <h5 className="font-medium mb-3">Selected Palette</h5>
            <div className="flex gap-2 flex-wrap">
              {selectedColors.map((color, idx) => (
                <Badge key={idx} variant="secondary" className="flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded border"
                    style={{ backgroundColor: color }}
                  />
                  {color}
                  <button
                    className="ml-1 text-destructive"
                    onClick={() =>
                      setSelectedColors((prev) => prev.filter((_, i) => i !== idx))
                    }
                    aria-label="Remove color"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>

            <div className="mt-4">
              <Button
                onClick={() =>
                  onTransformationApply?.({ type: 'color_palette', colors: selectedColors })
                }
              >
                Apply Color Palette
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  };

  /** ---------------------------
   * Cultural Heatmap Tool
   * -------------------------- */
  const CulturalHeatmapTool = () => {
    const heatmapData = [
      { element: 'Headlines', score: 85, issues: ['Use softer language'], status: 'good' },
      {
        element: 'Call-to-Action',
        score: 60,
        issues: ['Too direct', 'Consider collective language'],
        status: 'warning',
      },
      { element: 'Imagery', score: 90, issues: [], status: 'excellent' },
      {
        element: 'Color Scheme',
        score: 40,
        issues: ['White prominent', 'Use warmer tones'],
        status: 'critical',
      },
      { element: 'Layout', score: 75, issues: ['Consider reading patterns'], status: 'good' },
    ]; // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/In%207.txt)

    const getScoreColor = (score) => {
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-yellow-500';
      if (score >= 40) return 'bg-orange-500';
      return 'bg-red-500';
    };

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Cultural Sensitivity Heatmap</h4>

        <div className="space-y-3">
          {heatmapData.map((item, idx) => (
            <Card key={idx} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getScoreColor(item.score)}`} />
                  <div>
                    <div className="text-sm font-medium">{item.element}</div>
                    <div className="text-xs text-muted-foreground">{item.score}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.issues.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium">Issues:</span>{' '}
                      <span className="text-muted-foreground">{item.issues.join(', ')}</span>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onTransformationApply?.({
                        type: 'fix_element',
                        element: item.element,
                        issues: item.issues,
                      })
                    }
                  >
                    Auto‑Fix
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  /** ---------------------------
   * Smart Analyzer Tool
   * -------------------------- */
  const SmartAnalyzerTool = () => {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">AI‑Powered Cultural Analysis</h4>

        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Overall Cultural Appropriateness</div>
              <div className="text-2xl font-bold">{culturalScore}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">AI Confidence</div>
              <div className="text-2xl font-bold">94%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Market</div>
              <div className="text-2xl font-bold">{selectedMarket}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h5 className="font-medium mb-2">Cultural Strengths</h5>
          <ul className="text-sm space-y-1">
            <li>• Respectful tone and language</li>
            <li>• Appropriate visual hierarchy</li>
            <li>• Cultural symbols handled well</li>
          </ul>
        </Card>

        <Card className="p-4">
          <h5 className="font-medium mb-2">Areas for Improvement</h5>
          <ul className="text-sm space-y-1">
            <li>• Consider family‑oriented messaging</li>
            <li>• Adjust color prominences</li>
            <li>• Review number usage (avoid 4)</li>
          </ul>
        </Card>

        <div className="flex gap-2">
          <Button
            onClick={() =>
              onTransformationApply?.({
                type: 'auto_cultural_optimization',
                market: selectedMarket,
              })
            }
          >
            Auto‑Optimize for {selectedMarket}
          </Button>
          <Button
            variant="outline"
            onClick={() => onPlaybookGenerate?.(selectedMarket)}
          >
            Generate Detailed Playbook
          </Button>
        </div>
      </div>
    );
  };

  /** ---------------------------
   * Layout / Container
   * -------------------------- */
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Interactive Cultural Adaptation Tools</h3>
          <Badge variant="outline" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {selectedMarket}
          </Badge>
        </div>

        <Tabs value={activeTool} onValueChange={setActiveTool}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="palette">Color Palette Tool</TabsTrigger>
            <TabsTrigger value="heatmap">Sensitivity Heatmap</TabsTrigger>
            <TabsTrigger value="analyzer">Smart Analyzer</TabsTrigger>
          </TabsList>

          <TabsContent value="palette">
            <ColorPaletteTool />
          </TabsContent>

          <TabsContent value="heatmap">
            <CulturalHeatmapTool />
          </TabsContent>

          <TabsContent value="analyzer">
            <SmartAnalyzerTool />
          </TabsContent>
        </Tabs>

        {/* Progress */}
        <Card className="p-4">
          <h5 className="font-medium mb-3">Cultural Transformation Progress</h5>
          <div className="flex items-center justify-between">
            <Progress value={Math.min(100, (Math.floor(culturalScore / 20) / 5) * 100)} className="w-1/2" />
            <div className="text-sm">
              {Math.floor(culturalScore / 20)} of 5 optimization areas completed
            </div>
          </div>
        </Card>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onPlaybookGenerate?.(selectedMarket)}>
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
          <Button onClick={() => onTransformationApply?.({ type: 'complete_cultural_review' })}>
            Complete Cultural Review
          </Button>
        </div>
      </div>
    </Card>
  );
};

InteractiveCulturalTools.propTypes = {
  selectedMarket: PropTypes.string.isRequired,
  visualGuidelines: PropTypes.object,
  culturalData: PropTypes.object,
  onColorSelect: PropTypes.func,
  onTransformationApply: PropTypes.func,
  onPlaybookGenerate: PropTypes.func,
};
