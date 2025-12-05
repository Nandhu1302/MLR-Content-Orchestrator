import { useState } from 'react';
import { useMarketingDeck } from '@/contexts/MarketingDeckContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RotateCcw } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const SlideEditor = ({ currentSlide }) => {
  const { slideData, updateSlideData, resetToDefaults, isDirty } = useMarketingDeck();

  const renderTitleSlideEditor = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="heading">Main Heading</Label>
        <Input
          id="heading"
          value={slideData.title.heading}
          onChange={(e) => updateSlideData('title.heading', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="subheading">Subheading</Label>
        <Input
          id="subheading"
          value={slideData.title.subheading}
          onChange={(e) => updateSlideData('title.subheading', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="valueAmount">Value Proposition</Label>
        <Input
          id="valueAmount"
          value={slideData.title.valueAmount}
          onChange={(e) => updateSlideData('title.valueAmount', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          value={slideData.title.tagline}
          onChange={(e) => updateSlideData('title.tagline', e.target.value)}
        />
      </div>
    </div>
  );

  const renderIndustryProblemsEditor = () => (
    <div className="space-y-6">
      {slideData.industryProblems.map((problem, index) => (
        <div key={index} className="space-y-2 p-3 border rounded-lg">
          <Label className="font-semibold">Problem {index + 1}</Label>
          <div>
            <Label htmlFor={`problem-${index}-percentage`}>Percentage/Stat</Label>
            <Input
              id={`problem-${index}-percentage`}
              value={problem.percentage}
              onChange={(e) => {
                const newProblems = [...slideData.industryProblems];
                newProblems[index] = { ...newProblems[index], percentage: e.target.value };
                updateSlideData('industryProblems', newProblems);
              }}
            />
          </div>
          <div>
            <Label htmlFor={`problem-${index}-label`}>Label</Label>
            <Input
              id={`problem-${index}-label`}
              value={problem.label}
              onChange={(e) => {
                const newProblems = [...slideData.industryProblems];
                newProblems[index] = { ...newProblems[index], label: e.target.value };
                updateSlideData('industryProblems', newProblems);
              }}
            />
          </div>
          <div>
            <Label htmlFor={`problem-${index}-description`}>Description</Label>
            <Textarea
              id={`problem-${index}-description`}
              value={problem.description}
              onChange={(e) => {
                const newProblems = [...slideData.industryProblems];
                newProblems[index] = { ...newProblems[index], description: e.target.value };
                updateSlideData('industryProblems', newProblems);
              }}
            />
          </div>
          <div>
            <Label htmlFor={`problem-${index}-impact`}>Impact</Label>
            <Input
              id={`problem-${index}-impact`}
              value={problem.impact}
              onChange={(e) => {
                const newProblems = [...slideData.industryProblems];
                newProblems[index] = { ...newProblems[index], impact: e.target.value };
                updateSlideData('industryProblems', newProblems);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderCaseStudyEditor = () => {
    const { toast } = useToast();
    
    const validateNumber = (value, field) => {
      if (value && isNaN(Number(value.replace(/[^0-9.-]/g, '')))) {
        toast({
          title: "Invalid Input",
          description: `${field} must contain valid numbers`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    };

    return (
      <div className="space-y-6">
        {slideData.earlyAdopterResults.map((result, index) => (
          <div key={index} className="space-y-2 p-3 border rounded-lg">
            <Label className="font-semibold">Result {index + 1}</Label>
            <div>
              <Label htmlFor={`result-${index}-metric`}>Metric Name</Label>
              <Input
                id={`result-${index}-metric`}
                value={result.metric}
                onChange={(e) => {
                  const newResults = [...slideData.earlyAdopterResults];
                  newResults[index] = { ...newResults[index], metric: e.target.value };
                  updateSlideData('earlyAdopterResults', newResults);
                }}
              />
            </div>
            <div>
              <Label htmlFor={`result-${index}-before`}>Before Value</Label>
              <Input
                id={`result-${index}-before`}
                value={result.before}
                onChange={(e) => {
                  if (validateNumber(e.target.value, 'Before Value')) {
                    const newResults = [...slideData.earlyAdopterResults];
                    newResults[index] = { ...newResults[index], before: e.target.value };
                    updateSlideData('earlyAdopterResults', newResults);
                  }
                }}
                placeholder="e.g., 10 weeks or $3.2M"
              />
            </div>
            <div>
              <Label htmlFor={`result-${index}-after`}>After Value</Label>
              <Input
                id={`result-${index}-after`}
                value={result.after}
                onChange={(e) => {
                  if (validateNumber(e.target.value, 'After Value')) {
                    const newResults = [...slideData.earlyAdopterResults];
                    newResults[index] = { ...newResults[index], after: e.target.value };
                    updateSlideData('earlyAdopterResults', newResults);
                  }
                }}
                placeholder="e.g., 3 weeks or $1.8M"
              />
            </div>
            <div>
              <Label htmlFor={`result-${index}-improvement`}>Improvement</Label>
              <Input
                id={`result-${index}-improvement`}
                value={result.improvement}
                onChange={(e) => {
                  const newResults = [...slideData.earlyAdopterResults];
                  newResults[index] = { ...newResults[index], improvement: e.target.value };
                  updateSlideData('earlyAdopterResults', newResults);
                }}
                placeholder="e.g., 70% reduction"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderImplementationPhasesEditor = () => (
    <div className="space-y-6">
      {slideData.implementationPhases.map((phase, index) => (
        <div key={index} className="space-y-2 p-3 border rounded-lg">
          <Label className="font-semibold">Phase {index + 1}</Label>
          <div>
            <Label htmlFor={`phase-${index}-name`}>Phase Name</Label>
            <Input
              id={`phase-${index}-name`}
              value={phase.phase}
              onChange={(e) => {
                const newPhases = [...slideData.implementationPhases];
                newPhases[index] = { ...newPhases[index], phase: e.target.value };
                updateSlideData('implementationPhases', newPhases);
              }}
            />
          </div>
          <div>
            <Label htmlFor={`phase-${index}-weeks`}>Duration</Label>
            <Input
              id={`phase-${index}-weeks`}
              value={phase.weeks}
              onChange={(e) => {
                const newPhases = [...slideData.implementationPhases];
                newPhases[index] = { ...newPhases[index], weeks: e.target.value };
                updateSlideData('implementationPhases', newPhases);
              }}
              placeholder="e.g., Weeks 1-4"
            />
          </div>
          <div>
            <Label htmlFor={`phase-${index}-deliverables`}>Deliverables (comma-separated)</Label>
            <Textarea
              id={`phase-${index}-deliverables`}
              value={phase.deliverables.join(', ')}
              onChange={(e) => {
                const newPhases = [...slideData.implementationPhases];
                newPhases[index] = { 
                  ...newPhases[index], 
                  deliverables: e.target.value.split(',').map(d => d.trim()).filter(Boolean)
                };
                updateSlideData('implementationPhases', newPhases);
              }}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor={`phase-${index}-milestones`}>Milestones (comma-separated)</Label>
            <Textarea
              id={`phase-${index}-milestones`}
              value={phase.milestones.join(', ')}
              onChange={(e) => {
                const newPhases = [...slideData.implementationPhases];
                newPhases[index] = { 
                  ...newPhases[index], 
                  milestones: e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                };
                updateSlideData('implementationPhases', newPhases);
              }}
              rows={2}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderClientPainPointsEditor = () => (
    <div className="space-y-6">
      {slideData.clientPainPoints.map((painPoint, index) => (
        <div key={index} className="space-y-2 p-3 border rounded-lg">
          <Label className="font-semibold">Pain Point {index + 1}</Label>
          <div>
            <Label htmlFor={`painpoint-${index}-area`}>Area</Label>
            <Input
              id={`painpoint-${index}-area`}
              value={painPoint.area}
              onChange={(e) => {
                const newPainPoints = [...slideData.clientPainPoints];
                newPainPoints[index] = { ...newPainPoints[index], area: e.target.value };
                updateSlideData('clientPainPoints', newPainPoints);
              }}
            />
          </div>
          <div>
            <Label htmlFor={`painpoint-${index}-symptoms`}>Symptoms (comma-separated)</Label>
            <Textarea
              id={`painpoint-${index}-symptoms`}
              value={painPoint.symptoms.join(', ')}
              onChange={(e) => {
                const newPainPoints = [...slideData.clientPainPoints];
                newPainPoints[index] = { 
                  ...newPainPoints[index], 
                  symptoms: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                };
                updateSlideData('clientPainPoints', newPainPoints);
              }}
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor={`painpoint-${index}-cost`}>Cost</Label>
            <Input
              id={`painpoint-${index}-cost`}
              value={painPoint.cost}
              onChange={(e) => {
                const newPainPoints = [...slideData.clientPainPoints];
                newPainPoints[index] = { ...newPainPoints[index], cost: e.target.value };
                updateSlideData('clientPainPoints', newPainPoints);
              }}
              placeholder="e.g., $1.2M/year"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderHiddenCostsEditor = () => (
    <div className="space-y-6">
      {slideData.hiddenCosts.map((cost, index) => (
        <div key={index} className="space-y-2 p-3 border rounded-lg">
          <Label className="font-semibold">Cost Category {index + 1}</Label>
          <div>
            <Label htmlFor={`hiddencost-${index}-category`}>Category</Label>
            <Input
              id={`hiddencost-${index}-category`}
              value={cost.category}
              onChange={(e) => {
                const newCosts = [...slideData.hiddenCosts];
                newCosts[index] = { ...newCosts[index], category: e.target.value };
                updateSlideData('hiddenCosts', newCosts);
              }}
            />
          </div>
          <div>
            <Label htmlFor={`hiddencost-${index}-items`}>Items (comma-separated)</Label>
            <Textarea
              id={`hiddencost-${index}-items`}
              value={cost.items.join(', ')}
              onChange={(e) => {
                const newCosts = [...slideData.hiddenCosts];
                newCosts[index] = { 
                  ...newCosts[index], 
                  items: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                };
                updateSlideData('hiddenCosts', newCosts);
              }}
              rows={4}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderCompetitiveFeaturesEditor = () => (
    <div className="space-y-6">
      {slideData.competitiveFeatures.map((feature, index) => (
        <div key={index} className="space-y-2 p-3 border rounded-lg">
          <Label className="font-semibold">Feature {index + 1}</Label>
          <div>
            <Label htmlFor={`feature-${index}-name`}>Feature Name</Label>
            <Input
              id={`feature-${index}-name`}
              value={feature.feature}
              onChange={(e) => {
                const newFeatures = [...slideData.competitiveFeatures];
                newFeatures[index] = { ...newFeatures[index], feature: e.target.value };
                updateSlideData('competitiveFeatures', newFeatures);
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`feature-${index}-us`}>Us</Label>
              <Input
                id={`feature-${index}-us`}
                value={feature.us}
                onChange={(e) => {
                  const newFeatures = [...slideData.competitiveFeatures];
                  newFeatures[index] = { ...newFeatures[index], us: e.target.value };
                  updateSlideData('competitiveFeatures', newFeatures);
                }}
              />
            </div>
            <div>
              <Label htmlFor={`feature-${index}-veeva`}>Veeva</Label>
              <Input
                id={`feature-${index}-veeva`}
                value={feature.veeva}
                onChange={(e) => {
                  const newFeatures = [...slideData.competitiveFeatures];
                  newFeatures[index] = { ...newFeatures[index], veeva: e.target.value };
                  updateSlideData('competitiveFeatures', newFeatures);
                }}
              />
            </div>
            <div>
              <Label htmlFor={`feature-${index}-translation`}>Translation Tools</Label>
              <Input
                id={`feature-${index}-translation`}
                value={feature.translation}
                onChange={(e) => {
                  const newFeatures = [...slideData.competitiveFeatures];
                  newFeatures[index] = { ...newFeatures[index], translation: e.target.value };
                  updateSlideData('competitiveFeatures', newFeatures);
                }}
              />
            </div>
            <div>
              <Label htmlFor={`feature-${index}-dam`}>DAM</Label>
              <Input
                id={`feature-${index}-dam`}
                value={feature.dam}
                onChange={(e) => {
                  const newFeatures = [...slideData.competitiveFeatures];
                  newFeatures[index] = { ...newFeatures[index], dam: e.target.value };
                  updateSlideData('competitiveFeatures', newFeatures);
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRiskMatrixEditor = () => (
    <div className="space-y-6">
      {slideData.riskMatrix.map((risk, index) => (
        <div key={index} className="space-y-2 p-3 border rounded-lg">
          <Label className="font-semibold">Risk {index + 1}</Label>
          <div>
            <Label htmlFor={`risk-${index}-name`}>Risk Name</Label>
            <Input
              id={`risk-${index}-name`}
              value={risk.risk}
              onChange={(e) => {
                const newRisks = [...slideData.riskMatrix];
                newRisks[index] = { ...newRisks[index], risk: e.target.value };
                updateSlideData('riskMatrix', newRisks);
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`risk-${index}-probability`}>Probability</Label>
              <select
                id={`risk-${index}-probability`}
                value={risk.probability}
                onChange={(e) => {
                  const newRisks = [...slideData.riskMatrix];
                  newRisks[index] = { ...newRisks[index], probability: e.target.value };
                  updateSlideData('riskMatrix', newRisks);
                }}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <Label htmlFor={`risk-${index}-impact`}>Impact</Label>
              <select
                id={`risk-${index}-impact`}
                value={risk.impact}
                onChange={(e) => {
                  const newRisks = [...slideData.riskMatrix];
                  newRisks[index] = { ...newRisks[index], impact: e.target.value };
                  updateSlideData('riskMatrix', newRisks);
                }}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor={`risk-${index}-mitigation`}>Mitigation Strategy</Label>
            <Textarea
              id={`risk-${index}-mitigation`}
              value={risk.mitigation}
              onChange={(e) => {
                const newRisks = [...slideData.riskMatrix];
                newRisks[index] = { ...newRisks[index], mitigation: e.target.value };
                updateSlideData('riskMatrix', newRisks);
              }}
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderROIMetricsEditor = () => {
    const { toast } = useToast();
    
    const validateMetricValue = (value, field) => {
      if (value && !value.match(/^[\d\s\$\%\+\-\.,\/a-zA-Z]+$/)) {
        toast({
          title: "Invalid Input",
          description: `${field} contains invalid characters`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4 p-3 border rounded-lg">
          <Label className="font-semibold text-lg">Speed Metrics</Label>
          {slideData.successMetrics.speed.map((metric, index) => (
            <div key={index} className="space-y-2 p-2 bg-muted/50 rounded">
              <div>
                <Label htmlFor={`speed-${index}-metric`}>Metric</Label>
                <Input
                  id={`speed-${index}-metric`}
                  value={metric.metric}
                  onChange={(e) => {
                    const newMetrics = { ...slideData.successMetrics };
                    newMetrics.speed[index] = { ...newMetrics.speed[index], metric: e.target.value };
                    updateSlideData('successMetrics', newMetrics);
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor={`speed-${index}-baseline`}>Baseline</Label>
                  <Input
                    id={`speed-${index}-baseline`}
                    value={metric.baseline}
                    onChange={(e) => {
                      if (validateMetricValue(e.target.value, 'Baseline')) {
                        const newMetrics = { ...slideData.successMetrics };
                        newMetrics.speed[index] = { ...newMetrics.speed[index], baseline: e.target.value };
                        updateSlideData('successMetrics', newMetrics);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor={`speed-${index}-current`}>Current</Label>
                  <Input
                    id={`speed-${index}-current`}
                    value={metric.current}
                    onChange={(e) => {
                      if (validateMetricValue(e.target.value, 'Current')) {
                        const newMetrics = { ...slideData.successMetrics };
                        newMetrics.speed[index] = { ...newMetrics.speed[index], current: e.target.value };
                        updateSlideData('successMetrics', newMetrics);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor={`speed-${index}-improvement`}>Improvement</Label>
                  <Input
                    id={`speed-${index}-improvement`}
                    value={metric.improvement}
                    onChange={(e) => {
                      const newMetrics = { ...slideData.successMetrics };
                      newMetrics.speed[index] = { ...newMetrics.speed[index], improvement: e.target.value };
                      updateSlideData('successMetrics', newMetrics);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 p-3 border rounded-lg">
          <Label className="font-semibold text-lg">Quality Metrics</Label>
          {slideData.successMetrics.quality.map((metric, index) => (
            <div key={index} className="space-y-2 p-2 bg-muted/50 rounded">
              <div>
                <Label htmlFor={`quality-${index}-metric`}>Metric</Label>
                <Input
                  id={`quality-${index}-metric`}
                  value={metric.metric}
                  onChange={(e) => {
                    const newMetrics = { ...slideData.successMetrics };
                    newMetrics.quality[index] = { ...newMetrics.quality[index], metric: e.target.value };
                    updateSlideData('successMetrics', newMetrics);
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor={`quality-${index}-baseline`}>Baseline</Label>
                  <Input
                    id={`quality-${index}-baseline`}
                    value={metric.baseline}
                    onChange={(e) => {
                      if (validateMetricValue(e.target.value, 'Baseline')) {
                        const newMetrics = { ...slideData.successMetrics };
                        newMetrics.quality[index] = { ...newMetrics.quality[index], baseline: e.target.value };
                        updateSlideData('successMetrics', newMetrics);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor={`quality-${index}-current`}>Current</Label>
                  <Input
                    id={`quality-${index}-current`}
                    value={metric.current}
                    onChange={(e) => {
                      if (validateMetricValue(e.target.value, 'Current')) {
                        const newMetrics = { ...slideData.successMetrics };
                        newMetrics.quality[index] = { ...newMetrics.quality[index], current: e.target.value };
                        updateSlideData('successMetrics', newMetrics);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor={`quality-${index}-improvement`}>Improvement</Label>
                  <Input
                    id={`quality-${index}-improvement`}
                    value={metric.improvement}
                    onChange={(e) => {
                      const newMetrics = { ...slideData.successMetrics };
                      newMetrics.quality[index] = { ...newMetrics.quality[index], improvement: e.target.value };
                      updateSlideData('successMetrics', newMetrics);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 p-3 border rounded-lg">
          <Label className="font-semibold text-lg">Cost Metrics</Label>
          {slideData.successMetrics.cost.map((metric, index) => (
            <div key={index} className="space-y-2 p-2 bg-muted/50 rounded">
              <div>
                <Label htmlFor={`cost-${index}-metric`}>Metric</Label>
                <Input
                  id={`cost-${index}-metric`}
                  value={metric.metric}
                  onChange={(e) => {
                    const newMetrics = { ...slideData.successMetrics };
                    newMetrics.cost[index] = { ...newMetrics.cost[index], metric: e.target.value };
                    updateSlideData('successMetrics', newMetrics);
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor={`cost-${index}-baseline`}>Baseline</Label>
                  <Input
                    id={`cost-${index}-baseline`}
                    value={metric.baseline}
                    onChange={(e) => {
                      if (validateMetricValue(e.target.value, 'Baseline')) {
                        const newMetrics = { ...slideData.successMetrics };
                        newMetrics.cost[index] = { ...newMetrics.cost[index], baseline: e.target.value };
                        updateSlideData('successMetrics', newMetrics);
                      }
                    }}
                    placeholder="e.g., $12,000"
                  />
                </div>
                <div>
                  <Label htmlFor={`cost-${index}-current`}>Current</Label>
                  <Input
                    id={`cost-${index}-current`}
                    value={metric.current}
                    onChange={(e) => {
                      if (validateMetricValue(e.target.value, 'Current')) {
                        const newMetrics = { ...slideData.successMetrics };
                        newMetrics.cost[index] = { ...newMetrics.cost[index], current: e.target.value };
                        updateSlideData('successMetrics', newMetrics);
                      }
                    }}
                    placeholder="e.g., $5,200"
                  />
                </div>
                <div>
                  <Label htmlFor={`cost-${index}-improvement`}>Improvement</Label>
                  <Input
                    id={`cost-${index}-improvement`}
                    value={metric.improvement}
                    onChange={(e) => {
                      const newMetrics = { ...slideData.successMetrics };
                      newMetrics.cost[index] = { ...newMetrics.cost[index], improvement: e.target.value };
                      updateSlideData('successMetrics', newMetrics);
                    }}
                    placeholder="e.g., 57%"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getEditorForSlide = () => {
    switch (currentSlide) {
      case 0: return renderTitleSlideEditor();
      case 1: return renderIndustryProblemsEditor();
      case 2: // Client Pain Points slide
        return renderClientPainPointsEditor();
      case 3: // Hidden Costs slide
        return renderHiddenCostsEditor();
      case 4: // Case Study Results slide
        return renderCaseStudyEditor();
      case 6: // Competitive Features slide
        return renderCompetitiveFeaturesEditor();
      case 7: // Implementation Phases slide
        return renderImplementationPhasesEditor();
      case 8: // ROI Metrics slide
        return renderROIMetricsEditor();
      case 9: // Risk Matrix slide
        return renderRiskMatrixEditor();
      default:
        return (
          <div className="text-center text-muted-foreground py-8">
            <p>Editor for this slide coming soon</p>
            <p className="text-sm mt-2">All major slides now have editors available!</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Slide Editor</h3>
          {isDirty && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Unsaved changes
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Edit content for Slide {currentSlide + 1}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">{getEditorForSlide()}</div>
      </ScrollArea>

      <Separator />

      <div className="p-4 space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All to Defaults
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Changes are auto-saved to browser storage
        </p>
      </div>
    </div>
  );
};

export default SlideEditor;