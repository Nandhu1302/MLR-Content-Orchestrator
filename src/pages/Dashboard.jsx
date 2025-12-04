import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBrand } from "@/contexts/BrandContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import ModuleCard from "@/components/ModuleCard";
import IntakeFlow from "@/components/intake/IntakeFlow";
import TemplateGallery from "@/components/intake/TemplateGallery";
import { CompetitiveIntelligenceWidget } from "@/components/dashboard/CompetitiveIntelligenceWidget";

// Lazy load drawer components (only load when opened)
const GuardrailsAdminDrawer = lazy(() => import("@/components/dashboard/drawers/GuardrailsAdminDrawer").then(m => ({ default: m.GuardrailsAdminDrawer })));
const CompetitiveIntelligenceDrawer = lazy(() => import("@/components/dashboard/drawers/CompetitiveIntelligenceDrawer").then(m => ({ default: m.CompetitiveIntelligenceDrawer })));
const RegulatoryAdminDrawer = lazy(() => import("@/components/dashboard/drawers/RegulatoryAdminDrawer").then(m => ({ default: m.RegulatoryAdminDrawer })));
const GlocalizationAdminDrawer = lazy(() => import("@/components/dashboard/drawers/GlocalizationAdminDrawer").then(m => ({ default: m.GlocalizationAdminDrawer })));
const FactoryOperationsDrawer = lazy(() => import("@/components/dashboard/drawers/FactoryOperationsDrawer").then(m => ({ default: m.FactoryOperationsDrawer })));
import { GuardrailsHealthCard } from "@/components/dashboard/GuardrailsHealthCard";
import { RegulatoryComplianceCard } from "@/components/dashboard/RegulatoryComplianceCard";
import { GlocalizationIntelligenceCard } from "@/components/dashboard/GlocalizationIntelligenceCard";
import { FactoryOperationsCard } from "@/components/dashboard/FactoryOperationsCard";
import { BrandDocumentsCard } from "@/components/dashboard/BrandDocumentsCard";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useModuleMetrics } from "@/hooks/useModuleMetrics";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PIUploadModal } from "@/components/pi/PIUploadModal";
import { useToast } from "@/hooks/use-toast";

import { 
  LayoutGrid, 
  TrendingUp, 
  FileText,    // Content Studio  
  Palette,     // Design Studio
  Shield,      // Pre-MLR Companion
  Globe,       // Localization
  Plus,
  Calendar,
  Users,
  Activity,
  Clock
} from "lucide-react";
import { historicalCampaigns } from "@/data/simulation";
import { DraftStorageManager } from "@/utils/draftStorage";
import { formatDistance } from "date-fns";

const moduleIcons = {
  0: LayoutGrid,  // Initiative Hub
  1: TrendingUp,  // Strategy & Insights
  2: FileText,    // Content Studio  
  3: Palette,     // Design Studio
  4: Shield,      // Pre-MLR Companion
  5: Globe        // Localization
};

const moduleColors = [
  "blue", "green", "purple", "orange", "red", "cyan"
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showIntakeFlow, setShowIntakeFlow] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [recentDraft, setRecentDraft] = useState(null);
  const [extractingDocuments, setExtractingDocuments] = useState(new Set());
  const { toast } = useToast();
  
  // Fetch real-time module metrics
  const { moduleMetrics, isLoading: metricsLoading } = useModuleMetrics(selectedBrand?.id);
  
  // Admin drawer states
  const [guardrailsDrawerOpen, setGuardrailsDrawerOpen] = useState(false);
  const [competitiveDrawerOpen, setCompetitiveDrawerOpen] = useState(false);
  const [regulatoryDrawerOpen, setRegulatoryDrawerOpen] = useState(false);
  const [glocalizationDrawerOpen, setGlocalizationDrawerOpen] = useState(false);
  const [isFactoryDrawerOpen, setIsFactoryDrawerOpen] = useState(false);

  // PI/ISI upload states
  const [piUploadOpen, setPiUploadOpen] = useState(false);
  const [isiUploadOpen, setIsiUploadOpen] = useState(false);

  useEffect(() => {
    // Check for resume parameter first
    const resumeId = searchParams.get('resume');
    if (resumeId) {
      setShowIntakeFlow(true);
      // Clean the URL after detecting resume
      setSearchParams({});
      return;
    }

    // Check for recent drafts on mount
    const mostRecent = DraftStorageManager.getMostRecentDraft();
    if (mostRecent) {
      setRecentDraft(mostRecent);
    }
  }, [searchParams, setSearchParams]);

  const handleNewCampaign = () => {
    setShowTemplateGallery(true);
  };

  const handleModuleClick = (moduleId) => {
    switch (moduleId) {
      case 'initiative-hub':
        navigate('/hub');
        break;
      case 'strategy-insights':
        navigate('/strategy-insights');
        break;
      case 'content-studio':
        navigate('/content-studio');
        break;
      case 'design-studio':
        navigate('/design-studio');
        break;
      case 'pre-mlr':
        navigate('/pre-mlr');
        break;
      case 'glocalization':
        navigate('/glocalization');
        break;
      default:
        setSelectedModule(moduleId);
    }
  };

  const handleResumeDraft = () => {
    if (recentDraft) {
      navigate(`/?resume=${recentDraft.id}`);
    }
  };

  const dismissDraft = () => {
    setRecentDraft(null);
  };

  const handleTemplateSelect = (template, customizationLevel) => {
    setShowTemplateGallery(false);
    setShowIntakeFlow(true);
  };

  const metrics = useDashboardMetrics();

  // Memoize metrics section to prevent unnecessary re-renders
  const MetricsSection = useMemo(() => (
    <section className="mb-8 lg:mb-10 pb-8 border-b-2 border-border">
      <h2 className="text-xl font-medium text-muted-foreground mb-4">Strategic Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 opacity-90">
        {metrics.isLoading ? (
          <>
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </>
        ) : (
          <>
            {metrics.guardrails && (
              <GuardrailsHealthCard
                status={metrics.guardrails.status}
                daysSinceReview={metrics.guardrails.daysSinceReview}
                complianceScore={metrics.guardrails.complianceScore}
                needsAttention={metrics.guardrails.needsAttention}
                intelligenceStatus={metrics.guardrails.intelligenceStatus}
                freshInsightsCount={metrics.guardrails.freshInsightsCount}
                lastIntelligenceRefresh={metrics.guardrails.lastIntelligenceRefresh}
                onOpenDrawer={() => setGuardrailsDrawerOpen(true)}
              />
            )}
            
            {metrics.competitive && (
              <CompetitiveIntelligenceWidget 
                onOpenDrawer={() => setCompetitiveDrawerOpen(true)}
              />
            )}
            
            {metrics.regulatory && (
              <RegulatoryComplianceCard
                marketsSupported={metrics.regulatory.marketsSupported}
                complianceReady={metrics.regulatory.complianceReady}
                activeDisclaimers={metrics.regulatory.activeDisclaimers}
                approvalRate={metrics.regulatory.approvalRate}
                onOpenDrawer={() => setRegulatoryDrawerOpen(true)}
              />
            )}
            
            {metrics.glocalization && (
              <GlocalizationIntelligenceCard
                activeProjects={metrics.glocalization.activeProjects}
                languagesSupported={metrics.glocalization.languagesSupported}
                culturalScore={metrics.glocalization.culturalScore}
                tmLeverageRate={metrics.glocalization.tmLeverageRate}
                onOpenDrawer={() => setGlocalizationDrawerOpen(true)}
              />
            )}

            <FactoryOperationsCard 
              onClick={() => setIsFactoryDrawerOpen(true)}
            />
          </>
        )}
      </div>
    </section>
  ), [metrics]);

  const handleTemplateGalleryClose = () => {
    setShowTemplateGallery(false);
  };

  const handleExtractEvidence = async (documentId, documentType) => {
    // Add to extracting set
    setExtractingDocuments(prev => new Set(prev).add(documentId));

    toast({
      title: "🔄 Re-processing Started",
      description: `Re-parsing and extracting evidence from ${documentType.toUpperCase()} document...`,
      duration: 5000,
    });

    try {
      // First, delete old evidence to ensure fresh extraction
      await supabase.from('clinical_claims').delete().eq('pi_document_id', documentId);
      await supabase.from('clinical_references').delete().eq('pi_document_id', documentId);
      await supabase.from('content_segments').delete().eq('pi_document_id', documentId);
      await supabase.from('safety_statements').delete().eq('isi_document_id', documentId);

      // Re-parse the document to extract full content from PDF
      toast({
        title: "📄 Step 1/2: Parsing PDF",
        description: "Extracting text and sections from the document...",
        duration: 8000,
      });

      const { error: parseError } = await supabase.functions.invoke('parse-prescribing-information', {
        body: { piId: documentId }
      });

      if (parseError) {
        console.error('Parse error:', parseError);
        throw new Error(`Failed to parse document: ${parseError.message}`);
      }

      // Wait a moment for parsing to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Extract evidence from the newly parsed content
      toast({
        title: "✨ Step 2/2: Extracting Evidence",
        description: "Extracting clinical claims, references, and content segments...",
        duration: 8000,
      });

      const { error: extractError } = await supabase.functions.invoke('extract-clinical-evidence', {
        body: { piDocumentId: documentId }
      });

      if (extractError) throw extractError;

      toast({
        title: "✅ Complete!",
        description: "Document re-processed successfully with comprehensive evidence extraction",
        duration: 6000,
      });

      // Trigger refetch to update UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Re-processing error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to re-process document";
      
      toast({
        title: "❌ Re-processing Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      // Remove from extracting set
      setExtractingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  if (showTemplateGallery) {
    return (
      <TemplateGallery
        onTemplateSelect={handleTemplateSelect}
        onClose={handleTemplateGalleryClose}
      />
    );
  }

  if (showIntakeFlow) {
    return (
      <IntakeFlow onClose={() => setShowIntakeFlow(false)} />
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 overflow-y-auto">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2560px]">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Welcome back, Sheikh
              </h1>
              <p className="text-muted-foreground mt-2">
                Your {selectedBrand?.brand_name || 'Content Operations'} dashboard for pharmaceutical marketing excellence
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-primary hover:bg-primary/90" onClick={handleNewCampaign}>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </div>

          {/* Draft Recovery Alert */}
          {recentDraft && (
            <Alert className="mt-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <Clock className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Continue where you left off:</span> "{recentDraft.projectName}" 
                  <span className="text-muted-foreground ml-2">
                    (last saved {formatDistance(recentDraft.lastModified, new Date(), { addSuffix: true })})
                  </span>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" onClick={handleResumeDraft}>
                    Resume
                  </Button>
                  <Button size="sm" variant="ghost" onClick={dismissDraft}>
                    Dismiss
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </section>

        {/* Brand Documents Section - Critical Setup */}
        <section className="mb-8">
          <BrandDocumentsCard 
            brandId={selectedBrand?.id}
            onUploadPI={() => setPiUploadOpen(true)}
            onUploadISI={() => setIsiUploadOpen(true)}
            onExtractEvidence={handleExtractEvidence}
            extractingDocuments={extractingDocuments}
          />
        </section>

        {/* Strategic Metrics - memoized to prevent re-renders */}
        {MetricsSection}

        {/* Modules Grid */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Content Operations Modules</h2>
            <Badge variant="outline">
              {metricsLoading ? 'Loading...' : `${moduleMetrics.length} Active Modules`}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {metricsLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              moduleMetrics.map((module, index) => (
                <ModuleCard
                  key={module.id}
                  title={module.title}
                  description={module.description}
                  icon={moduleIcons[index]}
                  status={module.status}
                  metrics={module.metrics}
                  color={moduleColors[index]}
                  onClick={() => handleModuleClick(module.id)}
                />
              ))
            )}
          </div>
        </section>
        </main>
      </div>

      {/* Admin Drawers - lazy loaded with Suspense */}
      <Suspense fallback={null}>
        {guardrailsDrawerOpen && (
          <GuardrailsAdminDrawer 
            open={guardrailsDrawerOpen} 
            onOpenChange={setGuardrailsDrawerOpen}
          />
        )}
        {competitiveDrawerOpen && (
          <CompetitiveIntelligenceDrawer 
            open={competitiveDrawerOpen} 
            onOpenChange={setCompetitiveDrawerOpen}
          />
        )}
        {regulatoryDrawerOpen && (
          <RegulatoryAdminDrawer 
            open={regulatoryDrawerOpen} 
            onOpenChange={setRegulatoryDrawerOpen}
          />
        )}
        {glocalizationDrawerOpen && (
          <GlocalizationAdminDrawer 
            open={glocalizationDrawerOpen} 
            onOpenChange={setGlocalizationDrawerOpen}
          />
        )}
        {isFactoryDrawerOpen && (
          <FactoryOperationsDrawer
            open={isFactoryDrawerOpen}
            onOpenChange={setIsFactoryDrawerOpen}
          />
        )}
      </Suspense>

      {/* PI/ISI Upload Modals */}
      <Dialog open={piUploadOpen} onOpenChange={setPiUploadOpen}>
        <DialogContent>
          <PIUploadModal 
            brandId={selectedBrand?.id}
            documentType="pi"
            onUploadComplete={() => {
              setPiUploadOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isiUploadOpen} onOpenChange={setIsiUploadOpen}>
        <DialogContent>
          <PIUploadModal 
            brandId={selectedBrand?.id}
            documentType="isi"
            onUploadComplete={() => {
              setIsiUploadOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;