
import { successMetrics } from '@/utils/marketingDeckData';
import { TrendingUp, Clock, Award, DollarSign } from 'lucide-react';

const MetricsDashboardSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-5xl font-bold text-foreground mb-4">
          Success Metrics Dashboard
        </h2>
        <p className="text-2xl text-muted-foreground">
          Real Deployment KPIs - Aggregated from 3 Active Clients
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Speed Metrics */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8" style={{ color: 'hsl(var(--theme-color-1))' }} />
            <h3 className="text-xl font-bold text-foreground">Speed Metrics</h3>
          </div>
          <div className="space-y-3">
            {successMetrics.speed.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{metric.metric}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground line-through">{metric.baseline}</span>
                    <span className="text-xs text-primary">→</span>
                    <span className="text-base font-bold text-primary">{metric.current}</span>
                  </div>
                </div>
                <span className="text-xl font-bold text-primary">{metric.improvement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8" style={{ color: 'hsl(var(--theme-color-2))' }} />
            <h3 className="text-xl font-bold text-foreground">Quality Metrics</h3>
          </div>
          <div className="space-y-3">
            {successMetrics.quality.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{metric.metric}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground line-through">{metric.baseline}</span>
                    <span className="text-xs text-primary">→</span>
                    <span className="text-base font-bold text-primary">{metric.current}</span>
                  </div>
                </div>
                <span className="text-xl font-bold text-primary">{metric.improvement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Metrics */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8" style={{ color: 'hsl(var(--theme-color-3))' }} />
            <h3 className="text-xl font-bold text-foreground">Cost Metrics</h3>
          </div>
          <div className="space-y-3">
            {successMetrics.cost.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{metric.metric}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground line-through">{metric.baseline}</span>
                    <span className="text-xs text-primary">→</span>
                    <span className="text-base font-bold text-primary">{metric.current}</span>
                  </div>
                </div>
                <span className="text-xl font-bold text-primary">{metric.improvement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Business Impact */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8" style={{ color: 'hsl(var(--theme-color-4))' }} />
            <h3 className="text-xl font-bold text-foreground">Business Impact</h3>
          </div>
          <div className="space-y-3">
            {successMetrics.impact.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <p className="text-sm font-medium text-foreground">{metric.metric}</p>
                <span className="text-2xl font-bold text-primary">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboardSlide;
