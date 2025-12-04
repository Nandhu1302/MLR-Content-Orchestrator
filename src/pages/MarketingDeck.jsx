import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Video, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExportMenu from "@/components/marketing/ExportMenu";
import { useSlideExport } from "@/hooks/useSlideExport";
import { MarketingDeckProvider } from "@/contexts/MarketingDeckContext";
import { SlideThemeProvider } from "@/contexts/SlideThemeContext";
import SlideEditor from "@/components/marketing/SlideEditor";
import BrandThemeSelector from "@/components/marketing/BrandThemeSelector";
import SlideFooter from "@/components/marketing/SlideFooter";
import { useSlideTheme } from "@/contexts/SlideThemeContext";
import TitleSlide from "@/components/marketing/slides/TitleSlide";
import ContentCrisisSlide from "@/components/marketing/slides/ContentCrisisSlide";
import OrchestrationSolutionSlide from "@/components/marketing/slides/OrchestrationSolutionSlide";
import WhyOrchestrationSlide from "@/components/marketing/slides/WhyOrchestrationSlide";
import IndustryProblemSlide from "@/components/marketing/slides/IndustryProblemSlide";
import ClientRealitySlide from "@/components/marketing/slides/ClientRealitySlide";
import HiddenCostsSlide from "@/components/marketing/slides/HiddenCostsSlide";
import SolutionSlide from "@/components/marketing/slides/SolutionSlide";
import IntelligenceSlide from "@/components/marketing/slides/IntelligenceSlide";
import WorkflowDetailSlide from "@/components/marketing/slides/WorkflowDetailSlide";
import IntegrationSlide from "@/components/marketing/slides/IntegrationSlide";
import EcosystemPositioningSlide from "@/components/marketing/slides/EcosystemPositioningSlide";
import CaseStudySlide from "@/components/marketing/slides/CaseStudySlide";
import DemoProofSlide from "@/components/marketing/slides/DemoProofSlide";
import CompetitiveDetailSlide from "@/components/marketing/slides/CompetitiveDetailSlide";
import ROICalculatorDetailSlide from "@/components/marketing/slides/ROICalculatorDetailSlide";
import MetricsDashboardSlide from "@/components/marketing/slides/MetricsDashboardSlide";
import ImplementationRoadmapSlide from "@/components/marketing/slides/ImplementationRoadmapSlide";
import RiskMitigationSlide from "@/components/marketing/slides/RiskMitigationSlide";
import SecurityComplianceSlide from "@/components/marketing/slides/SecurityComplianceSlide";
import WhyActNowSlide from "@/components/marketing/slides/WhyActNowSlide";
import CTASlide from "@/components/marketing/slides/CTASlide";

const slides = [
  TitleSlide,
  ContentCrisisSlide,
  OrchestrationSolutionSlide,
  WhyOrchestrationSlide,
  IndustryProblemSlide,
  ClientRealitySlide,
  HiddenCostsSlide,
  SolutionSlide,
  IntelligenceSlide,
  WorkflowDetailSlide,
  IntegrationSlide,
  EcosystemPositioningSlide,
  CaseStudySlide,
  DemoProofSlide,
  CompetitiveDetailSlide,
  ROICalculatorDetailSlide,
  MetricsDashboardSlide,
  ImplementationRoadmapSlide,
  RiskMitigationSlide,
  SecurityComplianceSlide,
  WhyActNowSlide,
  CTASlide,
];

const MarketingDeckContent = ({ embedded = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const navigate = useNavigate();
  const { primaryBrandId, secondaryBrandId } = useSlideTheme();
  const {
    isExporting,
    handleExportPDF,
    handleExportPNG,
    handleExportAllPNG,
    handleExportPPT,
    handleExportDOCX,
    handleCopySlideLink,
  } = useSlideExport();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else if (e.key === "ArrowLeft" && currentSlide > 0) {
        setCurrentSlide(prev => prev - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const CurrentSlideComponent = slides[currentSlide];

  if (embedded) {
    return (
      <div className="space-y-3">
        {/* Brand Theme Selector */}
        <BrandThemeSelector compact />

        {/* Embedded Navigation */}
        <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
          <Button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <span className="text-sm font-medium text-muted-foreground">
            Slide {currentSlide + 1} / {slides.length}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditor(!showEditor)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {showEditor ? 'Hide' : 'Edit'}
            </Button>
            <ExportMenu
              currentSlide={currentSlide}
              onExportPDF={() => handleExportPDF(currentSlide, slides.length, setCurrentSlide)}
              onExportPNG={() => handleExportPNG(currentSlide)}
              onExportAllPNG={() => handleExportAllPNG(currentSlide, slides.length, setCurrentSlide)}
              onExportPPT={handleExportPPT}
              onExportDOCX={() => handleExportDOCX(currentSlide, slides.length, setCurrentSlide)}
              onCopyLink={() => handleCopySlideLink(currentSlide)}
              isExporting={isExporting}
            />
            <Button
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
              variant="outline"
              size="sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Slide Content with Optional Editor */}
        <div className="flex gap-4">
          <div className={`bg-card border border-border rounded-lg overflow-auto ${showEditor ? 'flex-1' : 'w-full'} min-h-[600px]`}>
            <div data-slide-content className="w-full h-full bg-white relative">
              <CurrentSlideComponent />
              <SlideFooter primaryBrandId={primaryBrandId || undefined} secondaryBrandId={secondaryBrandId || undefined} />
            </div>
          </div>
          
          {showEditor && (
            <div className="w-[400px] rounded-lg shadow-lg overflow-hidden">
              <SlideEditor currentSlide={currentSlide} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        {/* Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border px-6 py-3 print:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-foreground">Content Orchestrator Marketing Deck</h1>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-md">
                Slide {currentSlide + 1} / {slides.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditor(!showEditor)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {showEditor ? 'Hide' : 'Edit'} Content
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/marketing-deck/video")}
              >
                <Video className="w-4 h-4 mr-2" />
                Video Generator
              </Button>
              <ExportMenu
                currentSlide={currentSlide}
                onExportPDF={() => handleExportPDF(currentSlide, slides.length, setCurrentSlide)}
                onExportPNG={() => handleExportPNG(currentSlide)}
                onExportAllPNG={() => handleExportAllPNG(currentSlide, slides.length, setCurrentSlide)}
                onExportPPT={handleExportPPT}
                onExportDOCX={() => handleExportDOCX(currentSlide, slides.length, setCurrentSlide)}
                onCopyLink={() => handleCopySlideLink(currentSlide)}
                isExporting={isExporting}
              />
            </div>
          </div>
          <BrandThemeSelector />
        </div>

        {/* Slide Container */}
        <div className="pt-32 flex items-center justify-center min-h-screen p-8">
          <div className={`flex gap-4 w-full ${showEditor ? 'max-w-[1800px]' : 'max-w-7xl'}`}>
            <div className={`aspect-video bg-card rounded-lg shadow-2xl overflow-hidden ${showEditor ? 'flex-1' : 'w-full'}`}>
              <div data-slide-content className="w-full h-full bg-white relative">
                <CurrentSlideComponent />
                <SlideFooter primaryBrandId={primaryBrandId || undefined} secondaryBrandId={secondaryBrandId || undefined} />
              </div>
            </div>
            
            {showEditor && (
              <div className="w-[400px] rounded-lg shadow-2xl overflow-hidden">
                <SlideEditor currentSlide={currentSlide} />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 print:hidden bg-card/80 backdrop-blur-lg border border-border rounded-full px-6 py-3 shadow-lg">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <span className="text-sm font-medium text-foreground min-w-[60px] text-center">
            {currentSlide + 1} / {slides.length}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
  );
};

const MarketingDeck = (props) => {
  return (
    <SlideThemeProvider>
      <MarketingDeckProvider>
        <MarketingDeckContent {...props} />
      </MarketingDeckProvider>
    </SlideThemeProvider>
  );
};

export default MarketingDeck;