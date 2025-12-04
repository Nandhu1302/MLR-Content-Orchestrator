
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  TrendingUp,
  Users,
  Database,
  Zap,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Target,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  mockDataSources,
  generateMockThemes,
  analysisSteps,
  generateAudienceAwareAnalysisSteps,
  generateAudienceAwareDataSources
} from '@/data/externalSystems';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { useBrand } from '@/contexts/BrandContext';
import { BrowserAIService } from '@/services/browserAIService';
import { taxonomyService } from '@/services/taxonomyService';
import { ThemeService } from '@/services/themeService';
import { toast } from 'sonner';

const ThemeGenerationHub = ({ intakeData, onThemeSelect, onBack }) => {
  const navigate = useNavigate();
  const { state: globalState } = useGlobalContext();
  const { selectedBrand: contextBrand } = useBrand();

  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [generatedThemes, setGeneratedThemes] = useState([]);
  const [savingThemeId, setSavingThemeId] = useState(null);
  const [currentAnalysisSteps, setCurrentAnalysisSteps] = useState(
    generateAudienceAwareAnalysisSteps(intakeData.primaryAudience || 'Patient', intakeData.selectedAssetTypes || [])
  );

  const audienceAwareDataSources = generateAudienceAwareDataSources(intakeData.primaryAudience || 'Patient');
  const [dataSources] = useState(Object.values(audienceAwareDataSources));

  const selectedBrand = contextBrand || globalState.userSelections?.selectedBrand || { id: 'demo-brand-id' };

  // Generate AI-powered themes
  const generateRealThemes = async (intakeContext, userSelections) => {
    try {
      const analysisContext = {
        projectName: intakeContext.projectName || userSelections.projectName || 'Healthcare Project',
        indication: intakeContext.indication || userSelections.indication || 'General Medicine',
        audience: intakeContext.primaryAudience || userSelections.audience || 'Patient',
        markets: intakeContext.targetMarkets || userSelections.markets || ['United States'],
        objectives: intakeContext.primaryObjective || userSelections.objectives || 'Increase Awareness',
        keyMessage: intakeContext.keyMessage || userSelections.keyMessage || 'Improving patient outcomes',
        callToAction: intakeContext.callToAction || userSelections.callToAction || 'Learn More',
        brand: intakeContext.brand || userSelections.brand || 'Healthcare Brand',
        assetTypes: intakeContext.selectedAssetTypes || userSelections.assetTypes || ['Email']
      };

      const contextContent = `
        Project: ${analysisContext.projectName}
        Therapeutic Area: ${analysisContext.indication}
        Target Audience: ${analysisContext.audience}
        Markets: ${analysisContext.markets.join(', ')}
        Primary Objective: ${analysisContext.objectives}
        Key Message: ${analysisContext.keyMessage}
        Call to Action: ${analysisContext.callToAction}
        Asset Types: ${analysisContext.assetTypes.join(', ')}
        Brand Context: ${analysisContext.brand}
      `;

      const aiAnalysis = await BrowserAIService.analyzeContent(contextContent, {
        brand_voice: [analysisContext.brand]
      });

      const taxonomySuggestions = await taxonomyService.generateTaxonomySuggestions(
        contextContent,
        'content_asset',
        selectedBrand?.id || 'demo-brand-id'
      );

      const generateThemeCategories = () => {
        const categories = [];
        if (analysisContext.objectives.toLowerCase().includes('education') || analysisContext.objectives.toLowerCase().includes('awareness')) {
          categories.push('educational-awareness');
        }
        if (analysisContext.objectives.toLowerCase().includes('clinical') || analysisContext.objectives.toLowerCase().includes('evidence')) {
          categories.push('clinical-evidence');
        }
        if (analysisContext.objectives.toLowerCase().includes('patient') || analysisContext.audience === 'Patient') {
          categories.push('patient-centric');
        }
        if (analysisContext.objectives.toLowerCase().includes('competitive') || analysisContext.objectives.toLowerCase().includes('differentiation')) {
          categories.push('competitive-positioning');
        }
        if (analysisContext.assetTypes.includes('Social Media Post')) {
          categories.push('engagement-focused');
        }
        if (analysisContext.assetTypes.includes('Sales Aid') || analysisContext.assetTypes.includes('Presentation')) {
          categories.push('professional-clinical');
        }
        if (categories.length === 0) {
          categories.push('clinical-evidence', 'patient-centric', 'educational-awareness');
        }
        return categories.slice(0, 3);
      };

      const themeCategories = generateThemeCategories();

      const themes = themeCategories.map((category, index) => ({
        id: `theme_${category}_${Date.now() + index}`,
        name: `${analysisContext.indication} ${category.replace('-', ' ')}`,
        category,
        description: `Theme focused on ${category} for ${analysisContext.indication}.`,
        keyMessage: analysisContext.keyMessage,
        confidence: Math.min(95, Math.round(aiAnalysis.overall_ai_score * 100 + index * 5)),
        rationale: { primaryInsight: `Optimized for ${analysisContext.audience}` },
        performancePrediction: {
          successProbability: Math.min(95, Math.round(aiAnalysis.overall_ai_score * 100 + index * 3)),
          engagementRate: Math.round(70 + (aiAnalysis.sentiment?.confidence || 0.5) * 25 + index * 2)
        },
        callToAction: analysisContext.callToAction,
        createdAt: new Date()
      }));

      return themes;
    } catch (error) {
      console.error('AI theme generation failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const intakeContext = globalState.crossModuleData.intake?.data || intakeData;
        const userSelections = globalState.userSelections;
        const audienceAwareSteps = generateAudienceAwareAnalysisSteps(intakeContext.primaryAudience || 'Patient', intakeContext.selectedAssetTypes || []);
        setCurrentAnalysisSteps(audienceAwareSteps);

        for (let i = 0; i < audienceAwareSteps.length; i++) {
          setCurrentStep(i);
          await new Promise((resolve) => setTimeout(resolve, audienceAwareSteps[i].duration));
        }

        const themes = await generateRealThemes(intakeContext, userSelections);
        setGeneratedThemes(themes);
        setIsAnalyzing(false);
      } catch (error) {
        console.error('Theme generation failed:', error);
        const fallbackThemes = generateMockThemes(intakeData.projectName, intakeData.indication, intakeData.primaryAudience, intakeData.brand);
        setGeneratedThemes(fallbackThemes);
        setIsAnalyzing(false);
      }
    };
    runAnalysis();
  }, [intakeData, globalState]);

  const getThemeIcon = (category) => {
    switch (category) {
      case 'clinical-evidence': return BarChart3;
      case 'patient-journey': return Users;
      case 'competitive-positioning': return Target;
      default: return Lightbulb;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    return 'text-yellow-600';
  };

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur z-50 flex items-center justify-center">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <Brain className="h-12 w-12 text-primary animate-pulse mb-4" />
            <CardTitle className="text-2xl">AI Theme Generation in Progress</CardTitle>
            <CardDescription>
              Our intelligent agents are analyzing your intake data to generate personalized content themes for "{intakeData.projectName}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={((currentStep + 1) / analysisSteps.length) * 100} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack}>← Back to Intake</Button>
          <h1 className="text-2xl font-bold mt-4">AI-Generated Content Themes</h1>
          <p className="text-muted-foreground">Based on analysis of your intake data and AI insights</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {generatedThemes.map((theme) => {
            const IconComponent = getThemeIcon(theme.category);
            return (
              <Card key={theme.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{theme.name}</CardTitle>
                        <Badge variant="secondary">{theme.category.replace('-', ' ')}</Badge>
                      </div>
                    </div>
                    <div className={`text-right ${getConfidenceColor(theme.confidence)}`}>
                      <div className="text-lg font-bold">{theme.confidence}%</div>
                      <div className="text-xs">confidence</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                  <Button
                    onClick={() => onThemeSelect(theme)}
                    className="mt-4 w-full"
                  >
                    Generate Content Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemeGenerationHub;
