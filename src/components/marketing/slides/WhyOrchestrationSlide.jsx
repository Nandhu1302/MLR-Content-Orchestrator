
import { X, Check, ArrowRight, Sparkles } from 'lucide-react';
import SlideFooter from '@/components/marketing/SlideFooter';

export const WhyOrchestrationSlide = () => {
  const oldWay = [
    'Siloed systems',
    'Manual handoffs',
    'Disconnected data',
    'Reactive compliance',
    'Sequential workflow',
  ];

  const orchestratedWay = [
    'Unified platform',
    'Automated routing',
    'Single source of truth',
    'Proactive intelligence',
    'Parallel processing',
  ];

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-6xl font-bold text-foreground">
              Why Orchestration Changes Everything
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground font-medium">
            From Fragmented Chaos to Intelligent Flow
          </p>
        </div>

        {/* Two Column Comparison */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-12 max-w-6xl w-full mb-12">
          {/* Old Way */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-center text-destructive mb-8">Old Way</h3>
            {oldWay.map((item, index) => (
              <div
                key={index}
                className="bg-card border-2 border-destructive/30 rounded-xl p-6 flex items-center gap-4 hover:border-destructive/50 transition-all"
              >
                <X className="h-8 w-8 text-destructive flex-shrink-0" />
                <span className="text-xl font-medium text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>

          {/* Center Arrow */}
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-b from-primary/20 to-primary/40 rounded-full p-8">
              <ArrowRight className="h-16 w-16 text-primary" />
            </div>
          </div>

          {/* Orchestrated Way */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-center text-primary mb-8">Orchestrated Way</h3>
            {orchestratedWay.map((item, index) => (
              <div
                key={index}
                className="bg-card border-2 border-primary/30 rounded-xl p-6 flex items-center gap-4 hover:border-primary transition-all hover:shadow-xl"
              >
                <Check className="h-8 w-8 text-primary flex-shrink-0" />
                <span className="text-xl font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-2 border-primary/40 rounded-xl p-8 max-w-4xl w-full">
          <p className="text-2xl font-bold text-center text-foreground">
            Intelligence layer learns and optimizes with every asset created
          </p>
        </div>
      </div>

      <SlideFooter />
    </div>
  );
};

export default WhyOrchestrationSlide;
