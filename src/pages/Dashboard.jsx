import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useBrand } from "@/contexts/BrandContext";
import Header from "@/components/Header";
import ModuleCard from "@/components/ModuleCard";
import IntakeFlow from "@/components/intake/IntakeFlow";
import TemplateGallery from "@/components/intake/TemplateGallery";
import { CompetitiveIntelligenceWidget } from "@/components/dashboard/CompetitiveIntelligenceWidget";
 
// Lazy load drawer components
const GuardrailsAdminDrawer = lazy(() => import("@/components/dashboard/drawers/GuardrailsAdminDrawer").then(m => ({ default: m.GuardrailsAdminDrawer })));
const CompetitiveIntelligenceDrawer = lazy(() => import("@/components/dashboard/drawers/CompetitiveIntelligenceDrawer").then(m => ({ default: m.CompetitiveIntelligenceDrawer })));
const RegulatoryAdminDrawer = lazy(() => import("@/components/dashboard/drawers/RegulatoryAdminDrawer").then(m => ({ default: m.RegulatoryAdminDrawer })));
const GlocalizationAdminDrawer = lazy(() => import("@/components/dashboard/drawers/GlocalizationAdminDrawer").then(m => ({ default: m.GlocalizationAdminDrawer })));
const FactoryOperationsDrawer = lazy(() => import("@/components/dashboard/drawers/FactoryOperationsDrawer").then(m => ({ default: m.FactoryOperationsDrawer })));
 
import { GuardrailsHealthCard } from "@/components/dashboard/GuardrailsHealthCard";
import { RegulatoryComplianceCard } from "@/components/dashboard/RegulatoryComplianceCard";
import { GlocalizationIntelligenceCard } from "@/components/dashboard/GlocalizationIntelligenceCard";
import { FactoryOperationsCard } from "@/components/dashboard/FactoryOperationsCard";
import { IntelligenceHubCard } from "@/components/dashboard/IntelligenceHubCard";
import { ContentDevelopmentCard } from "@/components/dashboard/ContentDevelopmentCard";
import { BrandDocumentsCard } from "@/components/dashboard/BrandDocumentsCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useModuleMetrics } from "@/hooks/useModuleMetrics";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useDashboardNavigation } from "@/hooks/useDashboardNavigation";
import { useDraftRecovery } from "@/hooks/useDraftRecovery";
import { useContentPipeline } from "@/hooks/useContentPipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
 
import {
  FileText,
  Palette,
  Shield,
  Globe,
  Clock,
  Settings,
  Plus
} from "lucide-react";
import { formatDistance } from "date-fns";
 
const moduleIcons = {
  'content-workflow': FileText,
  'intelligence-hub': IntelligenceHubCard,
  'content-studio': FileText,
  'design-studio': Palette,
  'pre-mlr': Shield,
  'glocalization': Globe
};
 
const moduleColors = [
  "blue", "green", "purple", "orange", "red", "cyan"
];
 
const Dashboard = () => {
  const { selectedBrand } = useBrand();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { stats } = useContentPipeline();
 
  // Use new custom hooks
  const {
    showTemplateGallery,
    openTemplateGallery,
    closeTemplateGallery
  } = useDashboardState();
 
  const { navigateToModule } = useDashboardNavigation();
  const { recentDraft, handleResumeDraft, dismissDraft } = useDraftRecovery();
 
  // Fetch metrics
  const { moduleMetrics, isLoading: metricsLoading } = useModuleMetrics(selectedBrand?.id);
 
  // Admin drawer states
  const [guardrailsDrawerOpen, setGuardrailsDrawerOpen] = useState(false);
  const [competitiveDrawerOpen, setCompetitiveDrawerOpen] = useState(false);
  const [regulatoryDrawerOpen, setRegulatoryDrawerOpen] = useState(false);
  const [glocalizationDrawerOpen, setGlocalizationDrawerOpen] = useState(false);
  const [isFactoryDrawerOpen, setIsFactoryDrawerOpen] = useState(false);
 
  useEffect(() => {
    const resumeId = searchParams.get('resume');
    if (resumeId) {
      openTemplateGallery();
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, openTemplateGallery]);
 
 
  const handleTemplateSelect = (template, customizationLevel) => {
    closeTemplateGallery();
    navigate('/intake-flow', { state: { template, customizationLevel } });
  };
 
  const handleStartBlank = () => {
    closeTemplateGallery();
    navigate('/intake-flow');
  };
 
  const metrics = useDashboardMetrics();
 
  // Content Operations section (Memoized from your code)
  const ContentOperationsSection = useMemo(() => (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Content Operations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metricsLoading ? (
          <>
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </>
        ) : (
          <>
            <IntelligenceHubCard />
            <ContentDevelopmentCard
              activeProjects={stats.active}
              inReview={stats.inReview}
              completed={stats.completed}
              onOpenTemplates={openTemplateGallery}
            />
          </>
        )}
      </div>
    </section>
  ), [metricsLoading, stats, openTemplateGallery]);
 
  if (showTemplateGallery) {
    return (
      <TemplateGallery
        onTemplateSelect={handleTemplateSelect}
        onStartBlank={handleStartBlank}
        onClose={closeTemplateGallery}
      />
    );
  }
 
  // NOTE: We don't need a separate check for intake flow as it navigates away.
 
  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
     
      <div className="flex-1 overflow-y-auto">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2560px]">
        {/* 1. Welcome Section (Image 4) */}
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Welcome back, 
              </h1>
              <p className="text-muted-foreground mt-2">
                Your {selectedBrand?.brand_name || 'Content Operations'} dashboard for pharmaceutical marketing excellence
              </p>
            </div>
            {/* Add the 'New Campaign' button here if you want it next to the title */}
             {/* <div className="flex gap-2">
              <Button className="bg-primary hover:bg-primary/90" onClick={openTemplateGallery}>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div> */}
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
                  <Button size="sm" onClick={() => handleResumeDraft()}>
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
       
        {/* 2. Content Operations Section (Image 4 - Intelligence Hub & Content Workshop) */}
        {ContentOperationsSection}
 
        {/* 3. Specialized Tools Section (Image 1) */}
        <section className="mb-8">
          <h2 className="text-xl font-medium text-muted-foreground mb-4">Specialized Tools</h2>
         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {metricsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
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
              moduleMetrics
                .filter(m => ['design-studio', 'pre-mlr', 'glocalization'].includes(m.id))
                .map((module, index) => {
                  const iconMap = {
                    'design-studio': Palette,
                    'pre-mlr': Shield,
                    'glocalization': Globe
                  };
                 
                  return (
                    <ModuleCard
                      key={module.id}
                      title={module.title}
                      description={module.description}
                      icon={iconMap[module.id]}
                      status={module.status}
                      metrics={module.metrics}
                      color={moduleColors[index + 3]}
                      onClick={() => navigateToModule(module.id)}
                    />
                  );
                })
            )}
          </div>
        </section>
 
        {/* 4. Factory Operations Section (Image 3 - The Card above System Administration) */}
        <section className="mb-8">
          <h2 className="text-xl font-medium text-muted-foreground mb-4">Factory Operations</h2>
          <div className="max-w-md">
            <FactoryOperationsCard onClick={() => setIsFactoryDrawerOpen(true)} />
          </div>
        </section>
 
        {/* 5. System Administration Section (Image 3 - The Accordion/Collapsible Section) */}
        <section className="mb-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="system-admin" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Settings className="h-5 w-5" />
                  <span className="text-base font-medium">System Administration</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
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
                 
                  {/* The Brand Documents Card is the 5th card in this grid */}
                  <BrandDocumentsCard brandId={selectedBrand?.id} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        </main>
      </div>
 
      {/* Admin Drawers - remain at the bottom */}
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
    </div>
  );
};
 
export default Dashboard;
 