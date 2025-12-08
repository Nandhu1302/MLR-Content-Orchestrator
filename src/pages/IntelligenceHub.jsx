import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import  "@/components/ui/card";
import { useBrand } from "@/contexts/BrandContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import "@/components/data/ChannelFirstFilters";
import "@/utils/populateIntelligenceData";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// Channel-specific Intelligence Panels
import { WebsiteIntelligencePanel } from "@/components/intelligence/channel/WebsiteIntelligencePanel";
import { EmailIntelligencePanel } from "@/components/intelligence/channel/EmailIntelligencePanel";
import { SocialIntelligencePanel } from "@/components/intelligence/channel/SocialIntelligencePanel";
import { RepEnabledIntelligencePanel } from "@/components/intelligence/channel/RepEnabledIntelligencePanel";
import { CrossChannelIntelligencePanel } from "@/components/intelligence/channel/CrossChannelIntelligencePanel";
import { ChannelContentOpportunities } from "@/components/intelligence/channel/ChannelContentOpportunities";

// Legacy Intelligence Components
import { AudienceContextPanel } from "@/components/intelligence/AudienceContextPanel";
import { CompetitiveIntelligencePanel } from "@/components/intelligence/CompetitiveIntelligencePanel";
import { ContentSuccessPatternsWidget } from "@/components/intelligence/ContentSuccessPatternsWidget";

// TEST COMPONENT - Commented out after evidence integration validation
// import { EvidenceRecommendationTest } from "@/components/intelligence/EvidenceRecommendationTest";

export const IntelligenceHub = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const { toast } = useToast();
  const [filters, setFilters] = useState({});
  const [isPopulating, setIsPopulating] = useState(false);
  const [populationProgress, setPopulationProgress] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  
  const brandId = selectedBrand?.id || '';
  
  const handleRefreshIntelligence = async () => {
    if (!brandId) return;
    setIsPopulating(true);
    setPopulationProgress([]);
    setProgressPercent(0);
    
    try {
      const result = await IntelligenceDataPopulator.populateIntelligenceData(
        brandId,
        (progress) => {
          setPopulationProgress(prev => {
            const newProgress = [...prev];
            const index = newProgress.findIndex(p => p.stage === progress.stage);
            if (index >= 0) {
              newProgress[index] = progress;
            } else {
              newProgress.push(progress);
            }
            const completed = newProgress.filter(p => p.status === 'complete').length;
            setProgressPercent(Math.floor((completed / 4) * 100));
            return newProgress;
          });
        }
      );
      
      if (result.success) {
        toast({
          title: "Intelligence Data Refreshed",
          description: `Successfully populated ${result.totalRecords} records.`,
        });
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const handleGenerateContent = (context) => {
    // If context has recommended evidence, use the new streamlined creator
    if (context.recommendedEvidence) {
      navigate('/intelligence-create', {
        state: {
          intelligenceContext: context,
        }
      });
      return;
    }
    
    // Fallback to existing intake-flow for contexts without evidence
    navigate('/intake-flow', {
      state: {
        opportunity: {
          title: context.title || `${context.channel || 'Content'} Generation`,
          opportunity_type: context.opportunity_type || context.opportunityType || 'content_creation',
          target_audiences: context.target_audiences || [context.audienceType || 'HCP'],
          suggested_channels: context.suggested_channels || [context.channel || 'Website'],
          recommended_actions: context.recommended_actions || [{ action: 'Create optimized content' }]
        },
        // Pass pre-calculated intake form values
        prefilledObjective: context.prefilledObjective,
        prefilledKeyMessage: context.prefilledKeyMessage,
        prefilledCTA: context.prefilledCTA,
        prefilledAudience: context.prefilledAudience,
        selectedAssetTypes: context.prefilledAssetTypes,
        prefilledFromOpportunity: true,
        // Skip to asset selection step since we have context
        startAtStep: context.prefilledAssetTypes?.length > 0 ? 1 : 0
      }
    });
  };

  if (!selectedBrand) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="p-6 text-center text-muted-foreground">
            No brand selected. Please select a brand to view insights.
          </div>
        </div>
      </div>
    );
  }

  // Render channel-specific panel based on filter
  const renderChannelPanel = () => {
    if (!filters.channel) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ErrorBoundary>
            <WebsiteIntelligencePanel brandId={brandId} filters={filters} onGenerateContent={handleGenerateContent} />
          </ErrorBoundary>
          <ErrorBoundary>
            <EmailIntelligencePanel brandId={brandId} filters={filters} onGenerateContent={handleGenerateContent} />
          </ErrorBoundary>
          <ErrorBoundary>
            <SocialIntelligencePanel brandId={brandId} filters={filters} onGenerateContent={handleGenerateContent} />
          </ErrorBoundary>
          <ErrorBoundary>
            <RepEnabledIntelligencePanel brandId={brandId} filters={filters} onGenerateContent={handleGenerateContent} />
          </ErrorBoundary>
        </div>
      );
    }

    switch (filters.channel) {
      case 'Website':
        return <WebsiteIntelligencePanel brandId={brandId} filters={filters} onGenerateContent={handleGenerateContent} />;
      case 'Email':
        return <EmailIntelligencePanel brandId={brandId} filters={filters} onGenerateContent={handleGenerateContent} />;
      case 'Social':
        return <SocialIntelligencePanel brandId={brandId} filters={filters} onGenerateContent={handleGenerateContent} />;
      case 'Rep-Enabled':
        return <RepEnabledIntelligencePanel brandId={brandId} filters={filters} onGenerateContent={handleGenerateContent} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => navigate("/")} className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Intelligence Hub</h1>
            <p className="text-muted-foreground mt-1">
              Channel-first intelligence for smarter content creation • Select a channel and audience to discover insights
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleRefreshIntelligence} 
              variant="outline" 
              size="lg" 
              disabled={isPopulating}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isPopulating ? 'animate-spin' : ''}`} />
              {isPopulating ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Button onClick={() => navigate("/intake-flow")} size="lg" variant="outline">
              <Sparkles className="h-5 w-5 mr-2" />
              Create from Scratch
            </Button>
          </div>
        </div>
        
        {isPopulating && (
          <Card>
            <CardHeader>
              <CardTitle>Refreshing Intelligence Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progressPercent} className="w-full" />
              <div className="space-y-2">
                {populationProgress.map((progress) => (
                  <div key={progress.stage} className="flex items-center justify-between text-sm">
                    <span>{progress.message}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      progress.status === 'complete' ? 'bg-green-100 text-green-800' :
                      progress.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      progress.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                    }`}>
                      {progress.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* TEST COMPONENT - Removed after evidence integration validation */}

        {/* Channel-First Filters */}
        <ChannelFirstFilters filters={filters} onFilterChange={setFilters} />

        {/* Content Opportunities - Channel Specific */}
        <ErrorBoundary>
          <ChannelContentOpportunities brandId={brandId} filters={filters} />
        </ErrorBoundary>

        {/* Channel Intelligence Panels */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Channel Intelligence</h2>
          <ErrorBoundary>
            {renderChannelPanel()}
          </ErrorBoundary>
        </section>

        {/* Cross-Channel Intelligence (always visible) */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Cross-Channel Insights</h2>
          <ErrorBoundary>
            <CrossChannelIntelligencePanel brandId={brandId} filters={filters} />
          </ErrorBoundary>
        </section>

        {/* Additional Insights */}
        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold">Additional Intelligence</h2>
          <Tabs defaultValue="audience" className="w-full">
            <TabsList>
              <TabsTrigger value="audience">Audience Insights</TabsTrigger>
              <TabsTrigger value="competitive">Competitive</TabsTrigger>
              <TabsTrigger value="patterns">Success Patterns</TabsTrigger>
            </TabsList>

            <TabsContent value="audience" className="mt-4">
              <ErrorBoundary>
                <AudienceContextPanel brandId={brandId} filters={filters} />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="competitive" className="mt-4">
              <ErrorBoundary>
                <CompetitiveIntelligencePanel brandId={brandId} filters={filters} />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="patterns" className="mt-4">
              <ErrorBoundary>
                <ContentSuccessPatternsWidget brandId={brandId} filters={filters} />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
};

export default IntelligenceHub;