
import { AlertTriangle, TrendingDown, Clock, Users } from 'lucide-react';
import SlideFooter from '@/components/marketing/SlideFooter';

export const ContentCrisisSlide = () => {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-background via-background to-destructive/5 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h1 className="text-6xl font-bold text-foreground">
              The $2B Pharma Content Crisis
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground font-medium">
            Fragmented Operations, Massive Waste
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-8 mb-16 max-w-6xl w-full">
          {/* Rework Rate */}
          <div className="bg-card border-2 border-destructive/30 rounded-2xl p-8 text-center hover:border-destructive transition-all hover:shadow-xl hover:scale-105">
            <TrendingDown className="h-16 w-16 text-destructive mx-auto mb-4" />
            <div className="text-6xl font-bold text-destructive mb-3">60%</div>
            <div className="text-xl font-semibold text-foreground mb-2">Rework Rate</div>
            <div className="text-lg text-muted-foreground">$800M annual waste</div>
          </div>

          {/* Cycle Time */}
          <div className="bg-card border-2 border-destructive/30 rounded-2xl p-8 text-center hover:border-destructive transition-all hover:shadow-xl hover:scale-105">
            <Clock className="h-16 w-16 text-destructive mx-auto mb-4" />
            <div className="text-6xl font-bold text-destructive mb-3">8 wks</div>
            <div className="text-xl font-semibold text-foreground mb-2">Cycle Time</div>
            <div className="text-lg text-muted-foreground">12 delays per year</div>
          </div>

          {/* Manual Work */}
          <div className="bg-card border-2 border-destructive/30 rounded-2xl p-8 text-center hover:border-destructive transition-all hover:shadow-xl hover:scale-105">
            <Users className="h-16 w-16 text-destructive mx-auto mb-4" />
            <div className="text-6xl font-bold text-destructive mb-3">80%</div>
            <div className="text-xl font-semibold text-foreground mb-2">Manual Work</div>
            <div className="text-lg text-muted-foreground">$600M wasted effort</div>
          </div>
        </div>

        {/* Root Causes */}
        <div className="bg-card/50 border border-border rounded-xl p-8 max-w-4xl w-full">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Root Causes</h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground mb-2">Siloed Tools</div>
              <div className="text-base text-muted-foreground">5+ disconnected systems</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground mb-2">MLR Bottleneck</div>
              <div className="text-base text-muted-foreground">68% rejection rate</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground mb-2">Manual Localization</div>
              <div className="text-base text-muted-foreground">8 weeks per market</div>
            </div>
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <p className="text-xl font-bold text-destructive">
            $2B+ wasted annually across top 20 pharma companies
          </p>
        </div>
      </div>

      <SlideFooter />
    </div>
  );
};

export default ContentCrisisSlide;
