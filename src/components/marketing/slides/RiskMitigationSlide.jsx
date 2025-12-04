
import { riskMatrix } from '@/utils/marketingDeckData';
import { Shield, AlertCircle } from 'lucide-react';

const RiskMitigationSlide = () => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-red-500 bg-red-500/10';
      case 'medium':
        return 'text-orange-500 bg-orange-500/10';
      case 'low':
        return 'text-green-500 bg-green-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const highImpactRisks = riskMatrix.filter((r) => r.impact === 'high');
  const mediumRisks = riskMatrix.filter((r) => r.impact === 'medium' || r.impact === 'low');

  return (
    <div className="w-full h-full bg-background p-16">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-foreground mb-4">Risk Mitigation Matrix</h2>
        <p className="text-2xl text-muted-foreground">
          Proactive Risk Management & Contingency Plans
        </p>
      </div>

      {/* Risk Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* High Impact Risks */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6" style={{ color: 'hsl(var(--destructive))' }} />
            <h3 className="text-xl font-bold text-foreground">High Impact Risks</h3>
          </div>
          <div className="space-y-3">
            {highImpactRisks.map((risk, index) => (
              <div
                key={index}
                className="bg-card border-2 rounded-xl p-4"
                style={{ borderColor: 'hsl(var(--destructive) / 0.3)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-base font-bold text-foreground flex-1">{risk.risk}</p>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(
                        risk.probability
                      )}`}
                    >
                      {risk.probability}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(
                        risk.impact
                      )}`}
                    >
                      {risk.impact}
                    </span>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    Mitigation Strategy:
                  </p>
                  <p className="text-sm text-foreground">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medium/Low Impact Risks */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Medium/Low Impact Risks</h3>
          </div>
          <div className="space-y-3">
            {mediumRisks.map((risk, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-base font-bold text-foreground flex-1">{risk.risk}</p>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(
                        risk.probability
                      )}`}
                    >
                      {risk.probability}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(
                        risk.impact
                      )}`}
                    >
                      {risk.impact}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-primary/10 border-2 border-primary rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-primary mb-1">✓</p>
            <p className="text-sm text-foreground font-semibold">Executive Sponsorship</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-1">✓</p>
            <p className="text-sm text-foreground font-semibold">Dedicated Project Team</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-1">✓</p>
            <p className="text-sm text-foreground font-semibold">Clear Success Metrics</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-1">✓</p>
            <p className="text-sm text-foreground font-semibold">Phased Rollout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMitigationSlide;
