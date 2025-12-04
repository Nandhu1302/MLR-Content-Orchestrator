
import { useMarketingDeck } from '@/contexts/MarketingDeckContext';
import { AlertTriangle } from 'lucide-react';

const IndustryProblemSlide = () => {
  const { slideData } = useMarketingDeck();

  return (
    <div className="w-full h-full bg-background p-16">
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-5xl font-bold mb-4"
          style={{ color: 'hsl(var(--primary))' }}
        >
          The $2B Pharma Content Crisis
        </h2>
        <p className="text-2xl text-muted-foreground">
          You're Not Alone - This is Industry-Wide
        </p>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {slideData.industryProblems.map((problem, index) => (
          <div
            key={index}
            className="bg-card border-2 border-destructive/30 rounded-xl p-8 hover:border-destructive transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <AlertTriangle className="w-10 h-10 text-destructive flex-shrink-0" />
              <div>
                <p className="text-5xl font-bold text-destructive mb-2">
                  {problem.percentage}
                </p>
                <p className="text-xl font-semibold text-foreground mb-1">
                  {problem.label}
                </p>
                <p className="text-base text-muted-foreground">
                  {problem.description}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-destructive">
                {problem.impact}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Highlight */}
      <div
        className="border-2 rounded-xl p-6"
        style={{
          backgroundColor: 'hsl(var(--primary) / 0.05)',
          borderColor: 'hsl(var(--primary) / 0.3)',
        }}
      >
        <p className="text-xl font-semibold text-foreground text-center">
          <span
            className="font-bold"
            style={{ color: 'hsl(var(--primary))' }}
          >
            $2B+ wasted annually
          </span>{' '}
          across top 20 pharma companies on inefficient content operations
        </p>
      </div>
    </div>
  );
};

export default IndustryProblemSlide;
