
import { hiddenCosts } from '@/utils/marketingDeckData';
import { DollarSign } from 'lucide-react';

const HiddenCostsSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      <div className="mb-8">
        <h2
          className="text-5xl font-bold mb-4"
          style={{ color: 'hsl(var(--primary))' }}
        >
          The Hidden Costs
        </h2>
        <p className="text-2xl text-muted-foreground">
          Beyond Direct Waste - What You Can't Easily Quantify
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {hiddenCosts.map((cost, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-card to-muted/20 border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                }}
              >
                <DollarSign
                  className="w-7 h-7"
                  style={{ color: 'hsl(var(--primary))' }}
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {cost.category}
              </h3>
            </div>

            <ul className="space-y-2">
              {cost.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span
                    className="mt-1 flex-shrink-0 font-bold"
                    style={{ color: 'hsl(var(--primary))' }}
                  >
                    →
                  </span>
                  <span className="text-base text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-destructive/10 border-2 border-destructive rounded-xl p-6">
        <p className="text-2xl font-bold text-foreground text-center mb-2">
          The True Cost of Inaction
        </p>
        <p className="text-xl text-muted-foreground text-center">
          These hidden costs accumulate to{' '}
          <span className="text-destructive font-semibold">
            $5-10M+ per year
          </span>{' '}
          for a mid-sized pharma brand portfolio - and that's conservative.
        </p>
      </div>
    </div>
  );
};

export default HiddenCostsSlide;
