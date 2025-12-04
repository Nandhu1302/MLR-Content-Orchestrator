import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Printer, FileSpreadsheet } from 'lucide-react';
import { exportToPowerPoint, exportToExcel } from '@/utils/biProposalExport';
import { useToast } from '@/hooks/use-toast';
import { BISlideLayout } from '@/components/bi-proposal/BISlideLayout';
import { PrototypeCompletionDashboard } from '@/components/bi-proposal/PrototypeCompletionDashboard';
import { TimelineComparisonChart } from '@/components/bi-proposal/TimelineComparisonChart';
import { ROICalculatorInteractive } from '@/components/bi-proposal/ROICalculatorInteractive';
import { RiskMitigationMatrix } from '@/components/bi-proposal/RiskMitigationMatrix';
import { PhaseCapabilityCard } from '@/components/bi-proposal/PhaseCapabilityCard';
import { TransformationArrowVisual } from '@/components/bi-proposal/TransformationArrowVisual';
import { ImplementationRoadmapVisual } from '@/components/bi-proposal/ImplementationRoadmapVisual';
import { DemoProofPointsCard } from '@/components/bi-proposal/DemoProofPointsCard';
import { phaseCompletions, prototypeStats, clientDependencies } from '@/utils/biProposalData';
import { OrchestrationArchitectureDiagram } from '@/components/marketing/slides/OrchestrationArchitectureDiagram';
import { Progress } from '@/components/ui/progress';

const BoehringerIngelheimProposal = ({ embedded = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const { toast } = useToast();
  const totalSlides = 16;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPowerPoint = async () => {
    setIsExporting(true);
    try {
      const filename = await exportToPowerPoint();
      toast({
        title: "PowerPoint Downloaded!",
        description: `${filename} is ready to edit in PowerPoint`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting to PowerPoint",
        variant: "destructive"
      });
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    setIsExportingExcel(true);
    try {
      const filename = exportToExcel();
      toast({
        title: "Excel Downloaded!",
        description: `${filename} with 8 sheets of editable data`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting to Excel",
        variant: "destructive"
      });
      console.error('Export error:', error);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const slides = [
    // Slide 1: Title
    <BISlideLayout key={0} slideNumber={1} section="Introduction">
      <div className="flex flex-col items-center justify-center h-[600px] text-center">
        <div className="space-y-8">
          <div>
            <div className="inline-block bg-primary/10 px-8 py-3 rounded-full mb-6">
              <p className="text-2xl font-bold text-primary">From 60% Prototype to 100% Solution</p>
            </div>
            <h1 className="text-7xl font-bold text-foreground mb-6">
              Glocalization Module
            </h1>
            <h2 className="text-4xl font-light text-muted-foreground mb-8">
              For Boehringer Ingelheim
            </h2>
          </div>
          
          <div className="bg-card border-2 border-primary rounded-xl p-8 inline-block">
            <p className="text-3xl font-bold text-primary mb-2">16 Weeks to Value</p>
            <p className="text-xl text-muted-foreground">vs 12-18 Months Traditional Build</p>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">{prototypeStats.functionalityComplete}%</div>
              <p className="text-lg text-muted-foreground">Already Built</p>
            </div>
            <div className="w-1 h-16 bg-border" />
            <div className="text-center">
              <div className="text-5xl font-bold text-emerald-600 mb-2">PROVEN</div>
              <p className="text-lg text-muted-foreground">In Live Demo</p>
            </div>
          </div>
        </div>
      </div>
    </BISlideLayout>,

    // Slide 2: Prototype Completion Dashboard
    <BISlideLayout 
      key={1} 
      slideNumber={2} 
      section="The Prototype Advantage"
      title="What's Already Built"
      subtitle="A working prototype with 7 operational phases"
    >
      <PrototypeCompletionDashboard />
    </BISlideLayout>,

    // Slide 3: Timeline Comparison
    <BISlideLayout 
      key={2} 
      slideNumber={3} 
      section="The Prototype Advantage"
      title="Timeline Comparison"
      subtitle="Prototype-Based vs Traditional Ground-Up Build"
    >
      <TimelineComparisonChart />
    </BISlideLayout>,

    // Slide 4: Platform Overview
    <BISlideLayout 
      key={3} 
      slideNumber={4} 
      section="Platform Context"
      title="Brand Excellence Platform"
      subtitle="End-to-end pharmaceutical marketing orchestration"
    >
      <div className="space-y-8">
        <div className="bg-card border border-border rounded-xl p-8">
          <OrchestrationArchitectureDiagram />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-primary/5 border border-primary/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">6</div>
            <p className="text-lg text-muted-foreground">Integrated Modules</p>
          </div>
          <div className="bg-primary/5 border border-primary/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <p className="text-lg text-muted-foreground">Markets Supported</p>
          </div>
          <div className="bg-primary/5 border border-primary/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <p className="text-lg text-muted-foreground">Compliance-First</p>
          </div>
        </div>
      </div>
    </BISlideLayout>,

    // Slide 5: Current State vs Solution
    <BISlideLayout 
      key={4} 
      slideNumber={5} 
      section="Platform Context"
      title="Why Glocalization Matters for BI"
      subtitle="Transforming your global content operations"
    >
      <TransformationArrowVisual />
    </BISlideLayout>,

    // Slide 6-11: Phase Capability Deep Dives
    ...phaseCompletions.slice(0, 6).map((phase, index) => (
      <BISlideLayout 
        key={5 + index} 
        slideNumber={6 + index} 
        section="What's Working Today"
      >
        <PhaseCapabilityCard phase={phase} />
      </BISlideLayout>
    )),

    // Slide 12: Demo Proof Points
    <BISlideLayout 
      key={11} 
      slideNumber={12} 
      section="What's Working Today"
      title="Demo Proof Points"
      subtitle="What you already saw working"
    >
      <DemoProofPointsCard />
    </BISlideLayout>,

    // Slide 13: ROI Calculator
    <BISlideLayout 
      key={12} 
      slideNumber={13} 
      section="Business Case"
      title="Interactive ROI Calculator"
      subtitle="Prototype-Based vs Traditional Build"
    >
      <ROICalculatorInteractive />
    </BISlideLayout>,

    // Slide 14: Risk Mitigation
    <BISlideLayout 
      key={13} 
      slideNumber={14} 
      section="Business Case"
      title="Risk Mitigation"
      subtitle="Why prototype = lower risk"
    >
      <RiskMitigationMatrix />
    </BISlideLayout>,

    // Slide 15: Implementation Roadmap
    <BISlideLayout 
      key={14} 
      slideNumber={15} 
      section="Implementation & Next Steps"
      title="16-Week Prototype-to-Production Roadmap"
      subtitle="Clear path from contract to go-live"
    >
      <ImplementationRoadmapVisual />
    </BISlideLayout>,

    // Slide 16: Next Steps
    <BISlideLayout 
      key={15} 
      slideNumber={16} 
      section="Implementation & Next Steps"
      title="Next Steps - Let's Get Started"
      subtitle="Your path to success"
    >
      <div className="space-y-12">
        {/* Action Timeline */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-card border-2 border-primary rounded-xl p-8">
            <div className="text-primary text-xl font-bold mb-4">This Week</div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span className="text-lg text-foreground">Proposal review</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span className="text-lg text-foreground">Q&A session</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span className="text-lg text-foreground">Internal BI stakeholder alignment</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border-2 border-primary rounded-xl p-8">
            <div className="text-primary text-xl font-bold mb-4">Week 1-2: Contract & Kickoff</div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span className="text-lg text-foreground">Contract finalization</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span className="text-lg text-foreground">Purchase order</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span className="text-lg text-foreground">2-day kickoff workshop</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border-2 border-primary rounded-xl p-8">
            <div className="text-primary text-xl font-bold mb-4">Week 3: Project Launch</div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span className="text-lg text-foreground">Technical discovery</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span className="text-lg text-foreground">System access provisioning</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span className="text-lg text-foreground">First pilot project selection</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-500/10 border-2 border-emerald-500 rounded-xl p-8">
            <div className="text-emerald-600 text-xl font-bold mb-4">Target: 16 Weeks from Today</div>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-emerald-600 mb-2">🚀</div>
              <p className="text-2xl font-bold text-foreground">Full Production Go-Live</p>
            </div>
          </div>
        </div>

        {/* Client Dependencies */}
        <div className="bg-card border border-border rounded-xl p-8">
          <h3 className="text-3xl font-bold text-foreground mb-6">What We Need from BI</h3>
          <div className="grid grid-cols-3 gap-6">
            {clientDependencies.map((dep, index) => (
              <div key={index} className="space-y-3">
                <h4 className="text-xl font-bold text-primary">{dep.category}</h4>
                <ul className="space-y-2">
                  {dep.items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary-hover text-primary-foreground rounded-2xl p-12 text-center">
          <h3 className="text-5xl font-bold mb-6">Let's Build This Together</h3>
          <p className="text-2xl mb-8">
            We have a working prototype. BI has the opportunity. Let's build the future of global content operations.
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-left">
              <p className="text-lg font-semibold">Contact Information</p>
              <p className="text-base opacity-90">Your Team | your.email@company.com</p>
            </div>
          </div>
        </div>
      </div>
    </BISlideLayout>
  ];

  if (embedded) {
    return (
      <div className="space-y-6">
        {/* Embedded Navigation */}
        <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Slide {currentSlide + 1} of {totalSlides}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleExportPowerPoint} variant="outline" size="sm" disabled={isExporting}>
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'PPT'}
            </Button>
            <Button onClick={handleExportExcel} variant="outline" size="sm" disabled={isExportingExcel}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              {isExportingExcel ? 'Exporting...' : 'Excel'}
            </Button>
            <Button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              variant="outline"
              size="sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Slide Content */}
        <div className="bg-card border border-border rounded-lg">
          {slides[currentSlide]}
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-primary w-8'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar - Print Hidden */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 print:hidden">
        <div className="bg-card border-2 border-primary shadow-2xl rounded-full px-6 py-4 flex items-center gap-6">
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-3">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          <div className="w-px h-8 bg-border mx-2" />

          <Button 
            onClick={handleExportPowerPoint} 
            variant="default" 
            size="sm" 
            className="gap-2"
            disabled={isExporting}
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'PPT'}
          </Button>

          <Button 
            onClick={handleExportExcel} 
            variant="default" 
            size="sm" 
            className="gap-2"
            disabled={isExportingExcel}
          >
            <FileSpreadsheet className="w-4 h-4" />
            {isExportingExcel ? 'Exporting...' : 'Excel'}
          </Button>

          <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>

          <div className="text-sm font-medium text-muted-foreground">
            {currentSlide + 1} / {totalSlides}
          </div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="print:space-y-0">
        <div className="hidden print:block">
          {slides.map((slide) => slide)}
        </div>
        <div className="block print:hidden">
          {slides[currentSlide]}
        </div>
      </div>
    </div>
  );
};

export default BoehringerIngelheimProposal;