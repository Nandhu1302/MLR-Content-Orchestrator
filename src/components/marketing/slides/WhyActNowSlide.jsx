
import { TrendingUp, AlertTriangle } from 'lucide-react';

const WhyActNowSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-bold text-foreground mb-4">Why Act Now?</h2>
        <p className="text-2xl text-muted-foreground">
          The Cost of Waiting vs The Opportunity of Acting
        </p>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Act Now Section */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-12 h-12 text-primary" />
            <h3 className="text-3xl font-bold text-foreground">If You Act Now</h3>
          </div>
          <ul className="space-y-4">
            {[
              {
                title: '$4.3M annual value per brand',
                subtitle: 'Realized within 6 months',
              },
              {
                title: '62% faster time to market',
                subtitle: 'Launch campaigns ahead of competition',
              },
              {
                title: '88% MLR first-pass approval',
                subtitle: 'Eliminate costly revision cycles',
              },
              {
                title: '+12 markets expansion capability',
                subtitle: 'Same team, exponential reach',
              },
              {
                title: 'Proven in production',
                subtitle: 'Low implementation risk',
              },
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-2xl text-primary">✓</span>
                <div>
                  <p className="text-lg font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Wait Section */}
        <div className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-2 border-destructive/30 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-12 h-12 text-destructive" />
            <h3 className="text-3xl font-bold text-foreground">If You Wait</h3>
          </div>
          <ul className="space-y-4">
            {[
              {
                title: '$1M+ per quarter in continued waste',
                subtitle: 'Inefficient processes compound',
              },
              {
                title: 'Competitors move first',
                subtitle: 'Market share erosion',
              },
              {
                title: 'Team burnout accelerates',
                subtitle: '35% turnover = institutional knowledge loss',
              },
              {
                title: 'Compliance risk exposure',
                subtitle: 'Potential $10M+ violations',
              },
              {
                title: 'Technology debt grows',
                subtitle: 'Harder to transform later',
              },
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-2xl text-destructive">✗</span>
                <div>
                  <p className="text-lg font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 bg-primary/10 border-2 border-primary rounded-xl p-6 text-center">
        <p className="text-2xl font-bold text-foreground">
          Every quarter of delay ={' '}
          <span className="text-destructive">$1M+ in lost value</span> and growing competitive disadvantage
        </p>
      </div>
    </div>
  );
};

export default WhyActNowSlide;
