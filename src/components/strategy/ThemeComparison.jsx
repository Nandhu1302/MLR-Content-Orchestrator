// Theme Comparison - Side-by-side analysis of 2 themes max
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Brain,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { ThemeService } from '@/services/themeService';
import { useBrand } from '@/contexts/BrandContext';

const ThemeComparison = ({ themes, onBack, onThemeSelect, projectContext }) => {
  const { selectedBrand } = useBrand();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectionRationale, setSelectionRationale] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState([7]);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const [themeA, themeB] = themes;

  useEffect(() => {
    if (selectedBrand && themeA && themeB) {
      initializeComparison();
    }
  }, [selectedBrand, themeA, themeB]);

  const initializeComparison = async () => {
    if (!selectedBrand) return;

    try {
      setLoading(true);
      
      // Create comparison record
      const comparisonRecord = await ThemeService.createComparison(
        selectedBrand.id,
        [themeA.id, themeB.id],
        ['performance', 'alignment', 'feasibility'],
        `${themeA.name} vs ${themeB.name}`
      );

      // Run AI analysis (simulated)
      await runComparisonAnalysis(comparisonRecord);
      
      setComparison(comparisonRecord);
      setAnalysisComplete(true);
    } catch (error) {
      console.error('Failed to initialize comparison:', error);
      toast.error('Failed to run theme comparison');
    } finally {
      setLoading(false);
    }
  };

  const runComparisonAnalysis = async (comparisonRecord) => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate comparison analysis
    const analysisUpdates = {
      side_by_side_analysis: generateSideBySideAnalysis(themeA, themeB),
      performance_delta: calculatePerformanceDelta(themeA, themeB),
      pros_cons_analysis: generateProsConsAnalysis(themeA, themeB),
      risk_assessment: generateRiskAssessment(themeA, themeB)
    };

    // Update comparison with analysis
    await ThemeService.updateComparison(comparisonRecord.id, analysisUpdates);
    setComparison(prev => prev ? { ...prev, ...analysisUpdates } : null);
  };

  const handleThemeSelection = async (theme) => {
    if (!comparison || !selectionRationale.trim()) {
      toast.error('Please provide a rationale for your selection');
      return;
    }

    try {
      await ThemeService.selectThemeFromComparison(
        comparison.id,
        theme.id,
        selectionRationale
      );
      
      toast.success(`Selected "${theme.name}" as the preferred theme`);
      onThemeSelect(theme, selectionRationale, confidenceLevel[0]);
    } catch (error) {
      toast.error('Failed to save theme selection');
    }
  };

  const getPerformanceIndicator = (valueA, valueB, higherIsBetter = true) => {
    const diff = valueA - valueB;
    const threshold = 5; // 5% threshold for meaningful difference
    
    if (Math.abs(diff) < threshold) {
      return { icon: Minus, color: 'text-gray-500', text: 'Similar' };
    }
    
    const aIsBetter = higherIsBetter ? diff > 0 : diff < 0;
    return aIsBetter 
      ? { icon: TrendingUp, color: 'text-green-600', text: `+${Math.abs(diff).toFixed(1)}%` }
      : { icon: TrendingDown, color: 'text-red-600', text: `-${Math.abs(diff).toFixed(1)}%` };
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50';
    if (confidence >= 80) return 'text-blue-600 bg-blue-50';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <Brain className="h-12 w-12 mx-auto text-primary animate-pulse" />
              <div>
                <h3 className="text-lg font-semibold">Analyzing Themes</h3>
                <p className="text-muted-foreground">AI is comparing performance predictions and strategic fit...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!comparison || !analysisComplete) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Theme Library
          </Button>
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Comparison Failed</h3>
            <p className="text-muted-foreground">Unable to complete theme comparison analysis.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Theme Library
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              Theme Comparison Analysis
            </h1>
            <p className="text-muted-foreground">
              AI-powered side-by-side analysis to help you choose the optimal theme
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Theme A */}
          <Card className={`${selectedTheme?.id === themeA.id ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{themeA.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {themeA.category.replace('-', ' ')}
                  </Badge>
                </div>
                <div className={`text-right p-3 rounded-lg ${getConfidenceColor(themeA.confidence_score)}`}>
                  <div className="text-2xl font-bold">{themeA.confidence_score}%</div>
                  <div className="text-xs">confidence</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{themeA.description}</p>
              
              {/* Key Message */}
              <div className="bg-muted/30 p-3 rounded">
                <h5 className="font-medium text-sm mb-2">Key Message</h5>
                <p className="text-sm italic">"{themeA.key_message}"</p>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-medium text-green-800">Success Rate</div>
                  <div className="text-lg font-bold text-green-600">
                    {themeA.success_rate}%
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs font-medium text-blue-800">Usage Count</div>
                  <div className="text-lg font-bold text-blue-600">
                    {themeA.usage_count}
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setSelectedTheme(themeA)}
                variant={selectedTheme?.id === themeA.id ? "default" : "outline"}
                className="w-full"
                disabled={!selectionRationale.trim()}
              >
                {selectedTheme?.id === themeA.id ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Selected
                  </>
                ) : (
                  'Select This Theme'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Theme B */}
          <Card className={`${selectedTheme?.id === themeB.id ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{themeB.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {themeB.category.replace('-', ' ')}
                  </Badge>
                </div>
                <div className={`text-right p-3 rounded-lg ${getConfidenceColor(themeB.confidence_score)}`}>
                  <div className="text-2xl font-bold">{themeB.confidence_score}%</div>
                  <div className="text-xs">confidence</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{themeB.description}</p>
              
              {/* Key Message */}
              <div className="bg-muted/30 p-3 rounded">
                <h5 className="font-medium text-sm mb-2">Key Message</h5>
                <p className="text-sm italic">"{themeB.key_message}"</p>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-medium text-green-800">Success Rate</div>
                  <div className="text-lg font-bold text-green-600">
                    {themeB.success_rate}%
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs font-medium text-blue-800">Usage Count</div>
                  <div className="text-lg font-bold text-blue-600">
                    {themeB.usage_count}
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setSelectedTheme(themeB)}
                variant={selectedTheme?.id === themeB.id ? "default" : "outline"}
                className="w-full"
                disabled={!selectionRationale.trim()}
              >
                {selectedTheme?.id === themeB.id ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Selected
                  </>
                ) : (
                  'Select This Theme'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Success Probability</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{themeA.success_rate}%</span>
                    <span className="text-xs text-muted-foreground">vs</span>
                    <span className="text-sm font-medium">{themeB.success_rate}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Confidence Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{themeA.confidence_score}%</span>
                    <span className="text-xs text-muted-foreground">vs</span>
                    <span className="text-sm font-medium">{themeB.confidence_score}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Usage History</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{themeA.usage_count}</span>
                    <span className="text-xs text-muted-foreground">vs</span>
                    <span className="text-sm font-medium">{themeB.usage_count}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">{themeA.name} Risks</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Regulatory compliance complexity</li>
                    <li>• Market competition intensity</li>
                    <li>• Content production timeline</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h5 className="font-medium text-sm mb-2">{themeB.name} Risks</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Audience engagement uncertainty</li>
                    <li>• Message differentiation challenge</li>
                    <li>• Performance track record limited</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decision Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Make Your Decision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Selection Rationale <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Explain why you're choosing this theme over the other. Consider performance metrics, strategic fit, risk factors, and project requirements..."
                value={selectionRationale}
                onChange={(e) => setSelectionRationale(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Confidence Level: {confidenceLevel[0]}/10
              </label>
              <Slider
                value={confidenceLevel}
                onValueChange={setConfidenceLevel}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low Confidence</span>
                <span>High Confidence</span>
              </div>
            </div>

            {selectedTheme && (
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div>
                  <h4 className="font-medium">Ready to proceed with "{selectedTheme.name}"?</h4>
                  <p className="text-sm text-muted-foreground">
                    This theme will be used for content generation in your project.
                  </p>
                </div>
                <Button onClick={() => handleThemeSelection(selectedTheme)}>
                  Confirm Selection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions for generating analysis
const generateSideBySideAnalysis = (themeA, themeB) => {
  return {
    performance_comparison: {
      success_rate: { 
        theme_a: themeA.success_rate, 
        theme_b: themeB.success_rate, 
        advantage: (themeA.success_rate > themeB.success_rate ? 'theme_a' : 'theme_b')
      }
    },
    content_analysis: {
      messaging_clarity: { 
        theme_a: "Clear and direct", 
        theme_b: "Detailed and comprehensive", 
        preference: 'neutral'
      }
    },
    strategic_fit: {
      audience_alignment: { 
        theme_a: 85, 
        theme_b: 78, 
        winner: 'theme_a'
      }
    }
  };
};

const calculatePerformanceDelta = (themeA, themeB) => {
  return {
    success_probability_diff: themeA.success_rate - themeB.success_rate,
    engagement_diff: themeA.avg_engagement_rate - themeB.avg_engagement_rate,
    roi_diff: 0, // Would need ROI data
    risk_diff: 0, // Would need risk scores
    confidence_diff: themeA.confidence_score - themeB.confidence_score,
    overall_score_diff: themeA.success_rate - themeB.success_rate
  };
};

const generateProsConsAnalysis = (themeA, themeB) => {
  return {
    theme_a: {
      pros: ["High confidence score", "Proven success rate", "Clear messaging"],
      cons: ["Limited recent usage", "Narrow audience focus"],
      unique_advantages: ["Strong historical performance"],
      potential_issues: ["May need message refreshing"]
    },
    theme_b: {
      pros: ["Recent market insights", "Broader audience appeal", "Innovative approach"],
      cons: ["Lower confidence score", "Limited track record"],
      unique_advantages: ["Fresh perspective on market"],
      potential_issues: ["Unproven performance"]
    }
  };
};

const generateRiskAssessment = (themeA, themeB) => {
  return {
    theme_a_risks: [
      {
        type: 'market',
        description: 'Message may feel outdated to newer audiences',
        severity: 'medium',
        likelihood: 30,
        impact: 40,
        mitigation: 'Refresh messaging with current market insights'
      }
    ],
    theme_b_risks: [
      {
        type: 'performance',
        description: 'Unproven approach may not resonate',
        severity: 'medium',
        likelihood: 40,
        impact: 60,
        mitigation: 'Implement rigorous testing and monitoring'
      }
    ],
    comparative_risk_analysis: "Theme A offers lower risk with proven performance, while Theme B provides higher potential reward with increased uncertainty.",
    mitigation_strategies: {
      theme_a: ["Update messaging", "Test with current audiences"],
      theme_b: ["Pilot testing", "Performance monitoring", "Backup messaging ready"]
    }
  };
};

export default ThemeComparison;