import { riskAssessments } from '@/utils/biProposalData';

export const RiskMitigationMatrix = () => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-700 border-amber-500/30';
      case 'low':
        return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getRiskLabel = (level) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="space-y-8">
      {/* Risk Comparison Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left p-6 text-xl font-bold text-foreground">Risk Category</th>
              <th className="text-center p-6 text-xl font-bold text-destructive">Traditional Build</th>
              <th className="text-center p-6 text-xl font-bold text-emerald-600">Prototype-Based</th>
            </tr>
          </thead>
          <tbody>
            {riskAssessments.map((risk, index) => (
              <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="p-6">
                  <div className="text-lg font-semibold text-foreground">{risk.category}</div>
                </td>
                <td className="p-6">
                  <div className="flex justify-center">
                    <span className={`px-6 py-3 rounded-lg font-bold text-lg border ${getRiskColor(risk.traditional)}`}>
                      {getRiskLabel(risk.traditional)}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex justify-center">
                    <span className={`px-6 py-3 rounded-lg font-bold text-lg border ${getRiskColor(risk.prototype)}`}>
                      {getRiskLabel(risk.prototype)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mitigation Strategies */}
      <div className="space-y-4">
        <h3 className="text-3xl font-bold text-foreground mb-6">How We Mitigate Risks</h3>
        {riskAssessments.map((risk, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600">✓</span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-foreground mb-2">{risk.category}</h4>
                <p className="text-base text-muted-foreground">{risk.mitigation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-xl p-8">
        <h3 className="text-3xl font-bold text-emerald-600 mb-4">The Prototype Advantage</h3>
        <p className="text-xl text-foreground">
          By leveraging a working prototype that's already been proven in your demo, 
          you significantly reduce technical, timeline, and cost risks compared to a traditional ground-up build.
        </p>
      </div>
    </div>
  );
};