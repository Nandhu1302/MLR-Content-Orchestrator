
import { Lightbulb, FileText, FileEdit, Palette, Shield, Globe, ArrowRight, Sparkles } from 'lucide-react';
import SlideFooter from '@/components/marketing/SlideFooter';

export const OrchestrationSolutionSlide = () => {
  const modules = [
    { icon: Lightbulb, label: 'Initiative Hub', color: 'text-primary' },
    { icon: FileText, label: 'Strategy & Insights', color: 'text-primary' },
    { icon: FileEdit, label: 'Content Studio', color: 'text-primary' },
    { icon: Palette, label: 'Design Studio', color: 'text-primary' },
    { icon: Shield, label: 'Pre-MLR Companion', color: 'text-primary' },
    { icon: Globe, label: 'Glocalization', color: 'text-primary' },
  ];

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-6xl font-bold text-foreground">
              One Platform, Complete Transformation
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground font-medium">
            AI-Powered Content Orchestration
          </p>
        </div>

        {/* Module Flow */}
        <div className="mb-12 max-w-7xl w-full">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {modules.map((module, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-card border-2 border-primary/30 rounded-xl p-6 text-center hover:border-primary transition-all hover:shadow-xl hover:scale-105 min-w-[140px]">
                  <module.icon className={`h-12 w-12 ${module.color} mx-auto mb-3`} />
                  <div className="text-sm font-semibold text-foreground leading-tight">
                    {module.label}
                  </div>
                </div>
                {index < modules.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-primary mx-2 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Orchestration Layer */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-2 border-primary/40 rounded-xl p-6 mb-12 max-w-5xl w-full">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">AI-Powered Orchestration Layer</h3>
            <div className="flex items-center justify-center gap-8 text-base text-muted-foreground flex-wrap">
              <span className="font-medium">Unified Data Model</span>
              <span className="text-primary">•</span>
              <span className="font-medium">Intelligent Routing</span>
              <span className="text-primary">•</span>
              <span className="font-medium">Real-Time Synchronization</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-6xl w-full">
          <h3 className="text-3xl font-bold text-center text-foreground mb-8">Proven Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cycle Time */}
            <div className="bg-card border-2 border-primary/30 rounded-xl p-6 text-center hover:border-primary transition-all hover:shadow-xl">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-3xl font-bold text-muted-foreground line-through">8 weeks</span>
                <ArrowRight className="h-6 w-6 text-primary" />
                <span className="text-4xl font-bold text-primary">3 weeks</span>
              </div>
              <div className="text-lg font-semibold text-foreground">Cycle Time</div>
              <div className="text-sm text-muted-foreground mt-2">62.5% faster</div>
            </div>

            {/* MLR Pass Rate */}
            <div className="bg-card border-2 border-primary/30 rounded-xl p-6 text-center hover:border-primary transition-all hover:shadow-xl">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-3xl font-bold text-muted-foreground line-through">32%</span>
                <ArrowRight className="h-6 w-6 text-primary" />
                <span className="text-4xl font-bold text-primary">88%</span>
              </div>
              <div className="text-lg font-semibold text-foreground">MLR First-Pass Rate</div>
              <div className="text-sm text-muted-foreground mt-2">2.75x improvement</div>
            </div>

            {/* Localization */}
            <div className="bg-card border-2 border-primary/30 rounded-xl p-6 text-center hover:border-primary transition-all hover:shadow-xl">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-3xl font-bold text-muted-foreground line-through">6 weeks</span>
                <ArrowRight className="h-6 w-6 text-primary" />
                <span className="text-4xl font-bold text-primary">4 days</span>
              </div>
              <div className="text-lg font-semibold text-foreground">Localization Time</div>
              <div className="text-sm text-muted-foreground mt-2">90% reduction</div>
            </div>
          </div>
        </div>
      </div>

      <SlideFooter />
    </div>
  );
};

export default OrchestrationSolutionSlide;
