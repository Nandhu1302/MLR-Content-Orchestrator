
import { earlyAdopterResults } from '@/utils/marketingDeckData';
import { TrendingUp } from 'lucide-react';

const CaseStudySlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-foreground mb-4">Early Adopter Results</h2>
        <p className="text-2xl text-muted-foreground">Top 10 Global Pharma | 5 Brands, 25 Markets</p>
      </div>

      <div className="mb-8 bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Challenge</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Cycle Time</p>
            <p className="text-lg font-semibold text-destructive">10 weeks average</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">MLR Rejection</p>
            <p className="text-lg font-semibold text-destructive">68% first submission</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Localization Cost</p>
            <p className="text-lg font-semibold text-destructive">$3.2M annually</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {earlyAdopterResults.map((result, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <p className="text-base font-semibold text-foreground">{result.metric}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Before:</span>
                <span className="text-base font-medium text-muted-foreground line-through">
                  {result.before}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">After:</span>
                <span className="text-xl font-bold text-primary">{result.after}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm font-semibold text-primary text-center">{result.improvement}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/10 border-2 border-primary rounded-xl p-6">
        <p className="text-2xl font-bold text-foreground text-center mb-2">
          "Transformed How We Work Globally"
        </p>
        <p className="text-lg text-muted-foreground text-center">
          — VP Global Marketing Operations, Top 10 Pharma
        </p>
      </div>
    </div>
  );
};

export default CaseStudySlide;
