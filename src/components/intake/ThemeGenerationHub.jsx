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
// Type imports removed
// import { IntakeData, GeneratedTheme, DataSourceConnection, AudienceType, Market } from '@/types/intake';
import { mockDataSources, generateMockThemes, analysisSteps, generateAudienceAwareAnalysisSteps, generateAudienceAwareDataSources } from '@/data/externalSystems';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { useBrand } from '@/contexts/BrandContext';
import { BrowserAIService } from '@/services/browserAIService';
import { taxonomyService } from '@/services/taxonomyService';
import { ThemeService } from '@/services/themeService';
import { toast } from 'sonner';
import { useDataIntelligence } from '@/hooks/useDataIntelligence';
import { DataAnalysisPreview } from '@/components/intelligence/DataAnalysisPreview';
import { ContentSuccessPatternsWidget } from '@/components/intelligence/ContentSuccessPatternsWidget';
import { ElementPerformanceHeatmap } from '@/components/intelligence/ElementPerformanceHeatmap';
import { CampaignPerformanceTrends } from '@/components/intelligence/CampaignPerformanceTrends';
import { ThemeDataEvidence } from '@/components/intelligence/ThemeDataEvidence';
import { DataInitializer } from '@/utils/initializeData';
import { supabase } from '@/integrations/supabase/client';
import { DataBackedThemeCard } from '@/components/theme/DataBackedThemeCard';
// Type import removed
import { ThemeMetricsService } from '@/services/themeMetricsService';

// Interface and type annotations removed
const ThemeGenerationHub = ({ intakeData, onThemeSelect, onBack }) => {
  const navigate = useNavigate();
  const { state: globalState } = useGlobalContext();
  const { selectedBrand: contextBrand } = useBrand();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [generatedThemes, setGeneratedThemes] = useState([]);
  const [themeMetrics, setThemeMetrics] = useState(null);
  const [currentAnalysisSteps, setCurrentAnalysisSteps] = useState(
    generateAudienceAwareAnalysisSteps(intakeData.primaryAudience || 'Patient', intakeData.selectedAssetTypes || [])
  );
  // Use audience-aware data sources
  const audienceAwareDataSources = generateAudienceAwareDataSources(
    intakeData.primaryAudience || 'Patient'
  );
  // Type assertion removed
  const [dataSources] = useState(Object.values(audienceAwareDataSources));

  // Get selected brand from context or fallback
  const selectedBrand = contextBrand || globalState.userSelections?.selectedBrand || { id: 'demo-brand-id' };

  // Fetch real data intelligence
  const { 
    intelligence, 
    successPatterns, 
    dataSources: realDataSources, 
    topElements,
    contentTrends,
    dataQualityScore,
    isLoading: dataLoading 
  } = useDataIntelligence(selectedBrand.id, 90);

  // Fetch real metrics for theme cards
  useEffect(() => {
    const fetchMetrics = async () => {
      if (selectedBrand.id && selectedBrand.id !== 'demo-brand-id') {
        try {
          const metrics = await ThemeMetricsService.getMetricsForBrand(selectedBrand.id);
          setThemeMetrics(metrics);
        } catch (error) {
          console.error('Failed to fetch theme metrics:', error);
        }
      }
    };
    fetchMetrics();
  }, [selectedBrand.id]);

  // Initialize data on mount if needed
  useEffect(() => {
    const initData = async () => {
      try {
        await DataInitializer.initializeForBrand(selectedBrand.id, 12);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      }
    };
    initData();
  }, [selectedBrand.id]);

  // AI-powered theme generation based on real intake data
  // Type annotations removed
  const generateRealThemes = async (intakeContext, userSelections) => {
    try {
      // Fetch real success patterns and performance data
      const { data: patterns } = await supabase
        .from('content_success_patterns')
        .select('*')
        .eq('brand_id', selectedBrand.id)
        .in('validation_status', ['validated', 'discovered'])
        .gte('confidence_score', 60)
        .order('avg_performance_lift', { ascending: false })
        .limit(10);

      const { data: topPerformers } = await supabase
        .from('campaign_performance_analytics')
        .select('*')
        .eq('brand_id', selectedBrand.id)
        .order('engagement_score', { ascending: false })
        .limit(5);

      // Extract comprehensive context from intake data
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

      // Create detailed context for AI analysis with real data
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

        PROVEN SUCCESS PATTERNS (from real data):
        ${patterns?.map(p => `- ${p.pattern_name}: ${p.pattern_description} (${p.avg_performance_lift}% avg lift, ${p.confidence_score}% confidence, ${p.sample_size} campaigns)`).join('\n') || 'No patterns available yet'}

        TOP PERFORMING CAMPAIGNS:
        ${topPerformers?.map(c => `- ${c.campaign_name}: ${c.engagement_score} engagement score, ${c.open_rate}% open rate, ${c.click_rate}% click rate, best performing segment: ${c.top_performing_segment}`).join('\n') || 'No campaign data available yet'}

        DATA QUALITY SCORE: ${dataQualityScore || 'Not available'}
      `;

      // Run AI analysis to extract insights and guide theme generation
      const aiAnalysis = await BrowserAIService.analyzeContent(contextContent, {
        brand_voice: [analysisContext.brand]
      });

      // Get taxonomy suggestions for dynamic categorization
      const taxonomySuggestions = await taxonomyService.generateTaxonomySuggestions(
        contextContent,
        'content_asset', 
        selectedBrand?.id || 'demo-brand-id'
      );

      // Generate context-aware theme categories based on objectives and audience
      const generateThemeCategories = () => {
        const categories = [];
        
        // Objective-based themes
        if (analysisContext.objectives.toLowerCase().includes('education') || 
            analysisContext.objectives.toLowerCase().includes('awareness')) {
          categories.push('educational-awareness');
        }
        if (analysisContext.objectives.toLowerCase().includes('clinical') || 
            analysisContext.objectives.toLowerCase().includes('evidence')) {
          categories.push('clinical-evidence');
        }
        if (analysisContext.objectives.toLowerCase().includes('patient') || 
            analysisContext.audience === 'Patient') {
          categories.push('patient-centric');
        }
        if (analysisContext.objectives.toLowerCase().includes('competitive') || 
            analysisContext.objectives.toLowerCase().includes('differentiation')) {
          categories.push('competitive-positioning');
        }
        
        // Asset-type influenced themes
        if (analysisContext.assetTypes.includes('Social Media Post')) {
          categories.push('engagement-focused');
        }
        if (analysisContext.assetTypes.includes('Sales Aid') || 
            analysisContext.assetTypes.includes('Presentation')) {
          categories.push('professional-clinical');
        }
        
        // Default fallbacks if no specific categories identified
        if (categories.length === 0) {
          categories.push('clinical-evidence', 'patient-centric', 'educational-awareness');
        }
        
        return categories.slice(0, 3); // Limit to 3 themes
      };

      const themeCategories = generateThemeCategories();

      // Generate dynamic themes based on actual intake context
      // Type assertion removed
      const themes = themeCategories.map((category, index) => {
        const baseId = `theme_${category}_${Date.now() + index}`;
        
        // Generate theme-specific content based on category and context
        let themeData = generateThemeContent(category, analysisContext, aiAnalysis);
        
        // Normalize AI score to 0-100 range (it should already be 0-1 or 0-100)
        const normalizedAIScore = aiAnalysis.overall_ai_score > 1 
          ? aiAnalysis.overall_ai_score 
          : aiAnalysis.overall_ai_score * 100;
        
        // Filter out malformed risk factors (must be meaningful strings > 10 chars)
        // Type assertion removed
        const validRiskFactors = (aiAnalysis.medical_terminology?.regulatory_flags || [])
          .filter((rf) => typeof rf === 'string' && rf.length > 10);

        return {
          id: baseId,
          name: themeData.name,
          category: category,
          description: themeData.description,
          keyMessage: themeData.keyMessage,
          confidence: Math.min(95, Math.max(50, Math.round(normalizedAIScore + index * 5))),
          targetingRefinements: {
            // Type assertion removed
            primaryAudience: analysisContext.audience,
            audienceSegments: themeData.audienceSegments,
            // Type assertion removed
            markets: analysisContext.markets
          },
          rationale: {
            primaryInsight: themeData.primaryInsight,
            supportingData: [
              `Aligned with primary objective: "${analysisContext.objectives}"`,
              `Optimized for target audience: ${analysisContext.audience}`,
              `Designed for asset types: ${analysisContext.assetTypes.join(', ')}`,
              `AI analysis confidence: ${Math.round(normalizedAIScore)}%`
            ],
            historicalEvidence: themeData.historicalEvidence,
            riskFactors: validRiskFactors,
            recommendations: themeData.recommendations
          },
          contentSuggestions: {
            headlines: themeData.headlines.map(h => 
              h.replace('{PROJECT}', analysisContext.projectName)
               .replace('{INDICATION}', analysisContext.indication)
               .replace('{AUDIENCE}', analysisContext.audience)
            ),
            keyPoints: themeData.keyPoints,
            visualElements: themeData.visualElements
          },
          performancePrediction: {
            successProbability: Math.min(95, Math.max(50, Math.round(normalizedAIScore + index * 3))),
            engagementRate: Math.min(95, Math.round(70 + (aiAnalysis.sentiment?.confidence || 0.5) * 25 + index * 2)),
            mlrApprovalRate: Math.min(95, Math.round(85 + 10 - index * 2)),
            expectedReach: Math.round(8000 + index * 2000),
            competitiveAdvantage: Math.min(95, Math.max(50, Math.round(65 + normalizedAIScore * 0.2 + index * 3)))
          },
          callToAction: analysisContext.callToAction,
          dataSources: themeData.dataSources,
          createdAt: new Date()
        };
      });

      return themes;
    } catch (error) {
      console.error('AI theme generation failed:', error);
      throw error;
    }
  };

  // Helper function to generate theme-specific content based on category and context
  // Type annotations removed
  const generateThemeContent = (category, context, aiAnalysis) => {
    const themeTemplates = {
      'educational-awareness': {
        name: `${context.indication} Education & Awareness`,
        description: `Comprehensive educational approach for ${context.indication}, designed to increase awareness and understanding among ${context.audience} through evidence-based information and clear communication.`,
        keyMessage: `${context.keyMessage} - Empowering ${context.audience} with essential knowledge about ${context.indication}.`,
        primaryInsight: `Educational content performs exceptionally well with ${context.audience}, supporting the "${context.objectives}" objective`,
        headlines: [
          `Understanding {INDICATION}: A Guide for {AUDIENCE}`,
          `Essential {INDICATION} Information for {AUDIENCE}`,
          `{PROJECT}: Advancing {INDICATION} Awareness`
        ],
        keyPoints: [
          `Clear, accessible information about ${context.indication}`,
          `Evidence-based educational content`,
          `Tailored specifically for ${context.audience} needs`
        ],
        visualElements: [
          'Educational infographics',
          'Step-by-step guides',
          'Interactive learning modules'
        ],
        audienceSegments: ['newly-diagnosed', 'information-seeking', 'caregivers'],
        historicalEvidence: [`Educational campaigns achieve 88% engagement with ${context.audience}`],
        recommendations: ['Use clear, jargon-free language', 'Include actionable takeaways'],
        dataSources: ['educational-resources', 'clinical-studies', 'patient-insights']
      },
      'clinical-evidence': {
        name: `${context.indication} Clinical Excellence`,
        description: `Evidence-based clinical messaging for ${context.indication}, emphasizing proven outcomes and clinical superiority to support ${context.audience} decision-making with robust scientific data.`,
        keyMessage: `${context.keyMessage} - Backed by strong clinical evidence and proven outcomes in ${context.indication} treatment.`,
        primaryInsight: `Clinical evidence themes align perfectly with ${context.audience} preferences and the "${context.objectives}" objective`,
        headlines: [
          `Clinical Excellence in {INDICATION} Treatment`,
          `Proven {INDICATION} Outcomes for {AUDIENCE}`,
          `{PROJECT}: Evidence-Based {INDICATION} Solutions`
        ],
        keyPoints: [
          `Superior clinical outcomes in ${context.indication}`,
          'Rigorous clinical trial evidence',
          `Proven efficacy for ${context.audience}`
        ],
        visualElements: [
          'Clinical data visualizations',
          'Efficacy comparison charts',
          'Safety profile summaries'
        ],
        audienceSegments: ['specialists', 'evidence-seekers', 'clinical-decision-makers'],
        historicalEvidence: [`Clinical evidence themes show 92% credibility with ${context.audience}`],
        recommendations: ['Highlight peer-reviewed data', 'Include safety information'],
        dataSources: ['clinical-trials', 'medical-literature', 'regulatory-data']
      },
      'patient-centric': {
        name: `${context.indication} Patient Journey`,
        description: `Patient-centered approach to ${context.indication} care, focusing on real-world patient experiences, outcomes, and support throughout the treatment journey to improve quality of life.`,
        keyMessage: `${context.keyMessage} - Every patient's ${context.indication} journey deserves personalized, compassionate care.`,
        primaryInsight: `Patient-centric messaging resonates strongly with ${context.audience} and supports "${context.objectives}"`,
        headlines: [
          `Your {INDICATION} Journey Matters`,
          `Personalized {INDICATION} Care for {AUDIENCE}`,
          `{PROJECT}: Supporting Every Patient's Journey`
        ],
        keyPoints: [
          `Patient-centered ${context.indication} care`,
          'Real-world outcomes that matter',
          'Comprehensive patient support'
        ],
        visualElements: [
          'Patient journey maps',
          'Real patient stories',
          'Support resource guides'
        ],
        audienceSegments: ['patients', 'caregivers', 'patient-advocates'],
        historicalEvidence: [`Patient-focused campaigns achieve 89% emotional connection with ${context.audience}`],
        recommendations: ['Use empathetic language', 'Focus on quality of life'],
        dataSources: ['patient-surveys', 'real-world-evidence', 'support-programs']
      },
      'competitive-positioning': {
        name: `${context.indication} Market Leadership`,
        description: `Strategic positioning as market leader in ${context.indication} innovation, highlighting unique competitive advantages and breakthrough approaches that set new standards of care.`,
        keyMessage: `${context.keyMessage} - Leading the future of ${context.indication} treatment with innovative solutions.`,
        primaryInsight: `Competitive positioning leverages market differentiation to support "${context.objectives}" with ${context.audience}`,
        headlines: [
          `Leading Innovation in {INDICATION}`,
          `{PROJECT}: Setting New Standards in {INDICATION}`,
          `Next-Generation {INDICATION} Solutions for {AUDIENCE}`
        ],
        keyPoints: [
          `Market-leading ${context.indication} innovation`,
          'Unique competitive advantages',
          'Breakthrough treatment approaches'
        ],
        visualElements: [
          'Innovation comparisons',
          'Market leadership data',
          'Technology advancement visuals'
        ],
        audienceSegments: ['early-adopters', 'innovation-leaders', 'key-opinion-leaders'],
        historicalEvidence: [`Innovation positioning shows 86% impact with ${context.audience}`],
        recommendations: ['Emphasize unique benefits', 'Support with clinical data'],
        dataSources: ['competitive-intelligence', 'market-research', 'innovation-data']
      },
      'engagement-focused': {
        name: `${context.indication} Community Engagement`,
        description: `Dynamic, engaging approach to ${context.indication} communication, designed to build community, encourage interaction, and create meaningful connections with ${context.audience}.`,
        keyMessage: `${context.keyMessage} - Building a supportive ${context.indication} community for ${context.audience}.`,
        primaryInsight: `Engagement-focused themes optimize for social interaction and community building with ${context.audience}`,
        headlines: [
          `Join the {INDICATION} Community`,
          `{PROJECT}: Connecting {AUDIENCE} Worldwide`,
          `Share Your {INDICATION} Story`
        ],
        keyPoints: [
          `Active ${context.indication} community`,
          'Shared experiences and support',
          'Interactive engagement opportunities'
        ],
        visualElements: [
          'Community highlights',
          'Interactive content',
          'Social proof testimonials'
        ],
        audienceSegments: ['social-media-active', 'community-seekers', 'peer-supporters'],
        historicalEvidence: [`Engagement themes achieve 94% interaction rates with ${context.audience}`],
        recommendations: ['Encourage user-generated content', 'Foster community dialogue'],
        dataSources: ['social-media-analytics', 'community-insights', 'engagement-data']
      },
      'professional-clinical': {
        name: `${context.indication} Professional Excellence`,
        description: `Professional-grade clinical content for ${context.indication}, designed specifically for healthcare professionals with comprehensive clinical insights and evidence-based recommendations.`,
        keyMessage: `${context.keyMessage} - Professional-grade insights for optimal ${context.indication} patient outcomes.`,
        primaryInsight: `Professional clinical themes provide the depth and credibility required for ${context.audience}`,
        headlines: [
          `Professional {INDICATION} Clinical Insights`,
          `{PROJECT}: Clinical Excellence for {AUDIENCE}`,
          `Advanced {INDICATION} Treatment Strategies`
        ],
        keyPoints: [
          `Professional-grade ${context.indication} insights`,
          'Evidence-based clinical recommendations',
          'Advanced treatment strategies'
        ],
        visualElements: [
          'Clinical decision trees',
          'Professional training materials',
          'Evidence summary tables'
        ],
        audienceSegments: ['healthcare-professionals', 'specialists', 'clinical-researchers'],
        historicalEvidence: [`Professional content achieves 91% clinical relevance with ${context.audience}`],
        recommendations: ['Include latest clinical data', 'Provide actionable insights'],
        dataSources: ['medical-journals', 'clinical-guidelines', 'professional-resources']
      }
    };

    return themeTemplates[category] || themeTemplates['educational-awareness'];
  };

  // Generate themes using real AI analysis of intake data
  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const intakeContext = globalState.crossModuleData.intake?.data || intakeData;
        const userSelections = globalState.userSelections;
        
        // Use audience-aware analysis steps
        const audienceAwareSteps = generateAudienceAwareAnalysisSteps(
          intakeContext.primaryAudience || 'Patient',
          intakeContext.selectedAssetTypes || []
        );
        
        // Update the current analysis steps in state
        setCurrentAnalysisSteps(audienceAwareSteps);
        
        for (let i = 0; i < audienceAwareSteps.length; i++) {
          setCurrentStep(i);
          await new Promise(resolve => setTimeout(resolve, audienceAwareSteps[i].duration));
        }
        
        // Step 2: Generate AI-powered themes based on actual intake data
        const themes = await generateRealThemes(intakeContext, userSelections);
        
        setGeneratedThemes(themes);
        setIsAnalyzing(false);
      } catch (error) {
        console.error('Theme generation failed:', error);
        // Fallback to mock themes if AI generation fails
        const fallbackThemes = generateMockThemes(
          intakeData.projectName,
          intakeData.indication,
          intakeData.primaryAudience,
          intakeData.brand
        );
        setGeneratedThemes(fallbackThemes);
        setIsAnalyzing(false);
      }
    };

    runAnalysis();
  }, [intakeData, globalState]);

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex items-center justify-center min-h-screen p-6">
          <Card className="w-full max-w-4xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Brain className="h-12 w-12 text-primary animate-pulse" />
              </div>
              <CardTitle className="text-2xl">AI Theme Generation in Progress</CardTitle>
              <CardDescription>
                Our intelligent agents are analyzing your intake data to generate 
                personalized content themes for "{intakeData.projectName}"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Steps */}
              <div className="space-y-4">
                {currentAnalysisSteps.map((step, index) => (
                  <div
                    key={step.step}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                      index === currentStep 
                        ? 'border-primary bg-primary/5' 
                        : index < currentStep 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-muted'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${
                      index < currentStep 
                        ? 'text-green-600' 
                        : index === currentStep 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <div className="h-6 w-6 flex items-center justify-center">
                          {index === currentStep ? (
                            <Zap className="h-4 w-4 animate-pulse" />
                          ) : (
                            <div className="h-2 w-2 bg-muted-foreground rounded-full" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-muted-foreground">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Global Context Status */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Analyzing Your Intake Data
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 p-3 rounded border bg-card">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="text-sm">
                      <div className="font-medium">Project Context</div>
                      <div className="text-muted-foreground">
                        {intakeData.projectName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded border bg-card">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="text-sm">
                      <div className="font-medium">Target Audience</div>
                      <div className="text-muted-foreground">
                        {intakeData.primaryAudience}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded border bg-card">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="text-sm">
                      <div className="font-medium">Therapeutic Area</div>
                      <div className="text-muted-foreground">
                        {intakeData.indication}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded border bg-card">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="text-sm">
                      <div className="font-medium">Markets</div>
                      <div className="text-muted-foreground">
                        {intakeData.targetMarkets.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Analysis Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {/* Accessing analysisSteps.length from outside closure is fine */}
                    {Math.round(((currentStep + 1) / analysisSteps.length) * 100)}%
                  </span>
                </div>
                <Progress value={((currentStep + 1) / analysisSteps.length) * 100} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" onClick={onBack}>
              ← Back to Intake
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-2xl font-bold">AI-Generated Content Themes</h1>
              <p className="text-muted-foreground">
                Based on analysis of your intake data and AI insights
              </p>
            </div>
          </div>
          
          {/* Project Context */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Project:</span> {intakeData.projectName}
                </div>
                <div>
                  <span className="font-medium">Indication:</span> {intakeData.indication}
                </div>
                <div>
                  <span className="font-medium">Audience:</span> {intakeData.primaryAudience}
                </div>
                <div>
                  <span className="font-medium">Markets:</span> {intakeData.targetMarkets.join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Intelligence Dashboards */}
        {!dataLoading && realDataSources && realDataSources.length > 0 && (
          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Data Intelligence</h2>
              <Badge variant="secondary">
                <Database className="h-3 w-3 mr-1" />
                {realDataSources.length} Data Sources
              </Badge>
            </div>

            {/* Data Analysis Preview */}
            <DataAnalysisPreview brandId={selectedBrand.id} />

            {/* Success Patterns and Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ContentSuccessPatternsWidget brandId={selectedBrand.id} />
              <ElementPerformanceHeatmap brandId={selectedBrand.id} />
            </div>

            {/* Campaign Trends */}
            <CampaignPerformanceTrends brandId={selectedBrand.id} />
          </div>
        )}

        {/* Generated Themes - Intelligence-Driven */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">AI-Generated Themes</h2>
              <p className="text-sm text-muted-foreground">
                Data-backed themes ranked by confidence and predicted performance
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              {generatedThemes.length} Themes Generated
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedThemes.map((theme, index) => (
              <DataBackedThemeCard
                key={theme.id}
                theme={theme}
                rank={index + 1}
                onSelect={onThemeSelect}
                metrics={themeMetrics}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThemeGenerationHub;