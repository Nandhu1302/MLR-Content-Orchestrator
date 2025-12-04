import { TrendingUp, Shield, DollarSign, Target } from "lucide-react";

const BusinessImpactSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      <h2 className="text-5xl font-bold text-foreground mb-4">Business Impact</h2>
      <p className="text-2xl text-muted-foreground mb-12">Quantified ROI Across 4 Key Metrics</p>

      <div className="grid grid-cols-2 gap-8">
        <div className="border-2 rounded-lg p-8" style={{ background: `linear-gradient(to bottom right, hsl(var(--theme-color-1) / 0.1), hsl(var(--theme-color-1) / 0.05))`, borderColor: 'hsl(var(--theme-color-1) / 0.2)' }}>
          <TrendingUp className="w-12 h-12 mb-4" style={{ color: 'hsl(var(--theme-color-1))' }} />
          <h3 className="text-2xl font-semibold text-foreground mb-3">Speed</h3>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-5xl font-bold" style={{ color: 'hsl(var(--theme-color-1))' }}>60%</span>
            <span className="text-xl text-muted-foreground">faster</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Content creation time reduced from <span className="font-semibold">8 weeks to 3 weeks</span>
          </p>
        </div>

        <div className="border-2 rounded-lg p-8" style={{ background: `linear-gradient(to bottom right, hsl(var(--theme-color-2) / 0.1), hsl(var(--theme-color-2) / 0.05))`, borderColor: 'hsl(var(--theme-color-2) / 0.2)' }}>
          <Shield className="w-12 h-12 mb-4" style={{ color: 'hsl(var(--theme-color-2))' }} />
          <h3 className="text-2xl font-semibold text-foreground mb-3">Quality</h3>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-5xl font-bold" style={{ color: 'hsl(var(--theme-color-2))' }}>90%</span>
            <span className="text-xl text-muted-foreground">accuracy</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Compliance accuracy improved from <span className="font-semibold">70% to 90%</span> before MLR
          </p>
        </div>

        <div className="border-2 rounded-lg p-8" style={{ background: `linear-gradient(to bottom right, hsl(var(--theme-color-3) / 0.1), hsl(var(--theme-color-3) / 0.05))`, borderColor: 'hsl(var(--theme-color-3) / 0.2)' }}>
          <DollarSign className="w-12 h-12 mb-4" style={{ color: 'hsl(var(--theme-color-3))' }} />
          <h3 className="text-2xl font-semibold text-foreground mb-3">Cost</h3>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-5xl font-bold" style={{ color: 'hsl(var(--theme-color-3))' }}>50%</span>
            <span className="text-xl text-muted-foreground">reduction</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Localization expenses cut in half through <span className="font-semibold">AI automation</span>
          </p>
        </div>

        <div className="border-2 rounded-lg p-8" style={{ background: `linear-gradient(to bottom right, hsl(var(--theme-color-4) / 0.1), hsl(var(--theme-color-4) / 0.05))`, borderColor: 'hsl(var(--theme-color-4) / 0.2)' }}>
          <Target className="w-12 h-12 mb-4" style={{ color: 'hsl(var(--theme-color-4))' }} />
          <h3 className="text-2xl font-semibold text-foreground mb-3">Consistency</h3>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-5xl font-bold" style={{ color: 'hsl(var(--theme-color-4))' }}>100%</span>
            <span className="text-xl text-muted-foreground">alignment</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Brand consistency maintained across <span className="font-semibold">50+ global markets</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessImpactSlide;
