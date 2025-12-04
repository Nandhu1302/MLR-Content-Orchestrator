import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UCBProposal = ({ embedded = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toast } = useToast();
  const totalSlides = 5; // Placeholder - will be expanded

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

  const handleDownload = () => {
    toast({
      title: "Download Available",
      description: "UCB RFP Response can be downloaded from Technical Documentation section",
    });
  };

  const slides = [
    // Slide 1: Title
    <div key={0} className="bg-card border border-border rounded-lg p-12">
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center">
        <div className="space-y-8">
          <div>
            <div className="inline-block bg-primary/10 px-8 py-3 rounded-full mb-6">
              <p className="text-2xl font-bold text-primary">Strategic RFP Response</p>
            </div>
            <h1 className="text-7xl font-bold text-foreground mb-6">
              Content Operations Platform
            </h1>
            <h2 className="text-4xl font-light text-muted-foreground mb-8">
              For UCB Pharma
            </h2>
          </div>
          
          <div className="bg-card border-2 border-primary rounded-xl p-8 inline-block">
            <p className="text-3xl font-bold text-primary mb-2">80% Prototype Complete</p>
            <p className="text-xl text-muted-foreground">12-Month Co-Development Timeline</p>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">6</div>
              <p className="text-lg text-muted-foreground">Integrated Modules</p>
            </div>
            <div className="w-1 h-16 bg-border" />
            <div className="text-center">
              <div className="text-5xl font-bold text-emerald-600 mb-2">PROVEN</div>
              <p className="text-lg text-muted-foreground">Working Prototype</p>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 2: Platform Overview
    <div key={1} className="bg-card border border-border rounded-lg p-12">
      <div className="mb-8">
        <span className="text-sm font-medium text-primary">Platform Overview</span>
        <h2 className="text-4xl font-bold text-foreground mt-2">Brand Excellence Platform</h2>
        <p className="text-xl text-muted-foreground mt-2">End-to-end pharmaceutical marketing orchestration</p>
      </div>
      
      <div className="space-y-6">
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
            <div className="text-4xl font-bold text-primary mb-2">90%</div>
            <p className="text-lg text-muted-foreground">MLR Approval Rate</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Six Core Modules</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">1.</span>
              <div>
                <h4 className="font-semibold text-foreground">Campaign Planning</h4>
                <p className="text-sm text-muted-foreground">Strategic campaign development</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">2.</span>
              <div>
                <h4 className="font-semibold text-foreground">Content Intake</h4>
                <p className="text-sm text-muted-foreground">Asset request orchestration</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">3.</span>
              <div>
                <h4 className="font-semibold text-foreground">Content Studio</h4>
                <p className="text-sm text-muted-foreground">AI-powered generation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">4.</span>
              <div>
                <h4 className="font-semibold text-foreground">MLR Pre-Check</h4>
                <p className="text-sm text-muted-foreground">Compliance automation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">5.</span>
              <div>
                <h4 className="font-semibold text-foreground">Glocalization Factory</h4>
                <p className="text-sm text-muted-foreground">Translation & localization</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">6.</span>
              <div>
                <h4 className="font-semibold text-foreground">Design Handoff</h4>
                <p className="text-sm text-muted-foreground">Production-ready delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 3: Prototype Advantage
    <div key={2} className="bg-card border border-border rounded-lg p-12">
      <div className="mb-8">
        <span className="text-sm font-medium text-primary">The Prototype Advantage</span>
        <h2 className="text-4xl font-bold text-foreground mt-2">What's Already Built</h2>
        <p className="text-xl text-muted-foreground mt-2">80% functionality complete with working demonstrations</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-emerald-600 mb-4">Operational Today</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">✓</span>
                <span className="text-muted-foreground">Intelligence engine with 5 layers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">✓</span>
                <span className="text-muted-foreground">AI content generation (15 models)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">✓</span>
                <span className="text-muted-foreground">Translation Memory (92% leverage)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">✓</span>
                <span className="text-muted-foreground">Cultural adaptation engine</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">✓</span>
                <span className="text-muted-foreground">Compliance pre-check (91/100 score)</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-600 mb-4">12-Month Roadmap</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">→</span>
                <span className="text-muted-foreground">UCB-specific workflow customization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">→</span>
                <span className="text-muted-foreground">Brand guardrails integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">→</span>
                <span className="text-muted-foreground">Advanced analytics dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">→</span>
                <span className="text-muted-foreground">Enterprise integrations (Veeva, Salesforce)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">→</span>
                <span className="text-muted-foreground">Scale to 25+ markets</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary via-primary to-primary-hover text-primary-foreground rounded-xl p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Co-Development Partnership</h3>
          <p className="text-lg opacity-90">
            Work with us to customize the platform for UCB's unique content journey and therapeutic areas
          </p>
        </div>
      </div>
    </div>,

    // Slide 4: ROI & Business Case
    <div key={3} className="bg-card border border-border rounded-lg p-12">
      <div className="mb-8">
        <span className="text-sm font-medium text-primary">Business Case</span>
        <h2 className="text-4xl font-bold text-foreground mt-2">Value Proposition for UCB</h2>
        <p className="text-xl text-muted-foreground mt-2">Annual value per brand with operational excellence</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-card border-2 border-primary rounded-xl p-6 text-center">
            <div className="text-5xl font-bold text-primary mb-2">$4.3M</div>
            <div className="text-lg text-muted-foreground">Annual Value</div>
          </div>
          <div className="bg-card border-2 border-border rounded-xl p-6 text-center">
            <div className="text-5xl font-bold text-foreground mb-2">75%</div>
            <div className="text-lg text-muted-foreground">Time Savings</div>
          </div>
          <div className="bg-card border-2 border-border rounded-xl p-6 text-center">
            <div className="text-5xl font-bold text-foreground mb-2">90%</div>
            <div className="text-lg text-muted-foreground">First-Pass MLR</div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Key Benefits</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">Operational Excellence</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">40% labor efficiency gains</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">Eliminate rework cycles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">Reduce administrative burden</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-foreground mb-3">Global Scale</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">30% translation cost reduction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">Cultural adaptation at scale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">Regulatory efficiency gains</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 5: Next Steps
    <div key={4} className="bg-card border border-border rounded-lg p-12">
      <div className="mb-8">
        <span className="text-sm font-medium text-primary">Next Steps</span>
        <h2 className="text-4xl font-bold text-foreground mt-2">Let's Partner on This</h2>
        <p className="text-xl text-muted-foreground mt-2">12-month co-development journey</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card border-2 border-primary rounded-xl p-6">
            <div className="text-primary text-xl font-bold mb-4">Weeks 1-4: Discovery</div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span className="text-muted-foreground">Kickoff workshop</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span className="text-muted-foreground">UCB workflow mapping</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span className="text-muted-foreground">Integration requirements</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border-2 border-primary rounded-xl p-6">
            <div className="text-primary text-xl font-bold mb-4">Months 2-6: Build & Test</div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">→</span>
                <span className="text-muted-foreground">UCB customizations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">→</span>
                <span className="text-muted-foreground">Pilot with 2-3 brands</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">→</span>
                <span className="text-muted-foreground">Iterative refinement</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border-2 border-primary rounded-xl p-6">
            <div className="text-primary text-xl font-bold mb-4">Months 7-9: Scale</div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">→</span>
                <span className="text-muted-foreground">Expand to all brands</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">→</span>
                <span className="text-muted-foreground">User training program</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">→</span>
                <span className="text-muted-foreground">Change management</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-500/10 border-2 border-emerald-500 rounded-xl p-6">
            <div className="text-emerald-600 text-xl font-bold mb-4">Months 10-12: Optimize</div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">→</span>
                <span className="text-muted-foreground">Performance tuning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">→</span>
                <span className="text-muted-foreground">ROI validation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">→</span>
                <span className="text-muted-foreground">Full production launch</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary via-primary to-primary-hover text-primary-foreground rounded-2xl p-12 text-center">
          <h3 className="text-5xl font-bold mb-6">Let's Build Together</h3>
          <p className="text-2xl mb-8">
            UCB's vision + Our proven prototype = Market-leading content operations platform
          </p>
          <div className="text-lg opacity-90">
            Contact: Your Team | your.email@company.com
          </div>
        </div>
      </div>
    </div>,
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
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
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
        {slides[currentSlide]}

        {/* Slide Indicators */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
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

          <Button onClick={handleDownload} variant="default" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Download
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
      <div className="print:space-y-0 max-w-7xl mx-auto px-8 py-8">
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

export default UCBProposal;