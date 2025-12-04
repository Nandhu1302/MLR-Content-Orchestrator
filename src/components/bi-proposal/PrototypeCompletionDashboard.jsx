import { phaseCompletions } from '@/utils/biProposalData';
import { CheckCircle2, Circle, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const PrototypeCompletionDashboard = () => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
      case 'in-progress':
        return <Zap className="w-6 h-6 text-amber-500" />;
      default:
        return <Circle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const averageCompletion = Math.round(
    phaseCompletions.reduce((sum, phase) => sum + phase.completion, 0) / phaseCompletions.length
  );

  return (
    <div className="space-y-8">
      {/* Overall Stats */}
      <div className="bg-card border border-border rounded-xl p-8">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <div className="text-6xl font-bold text-primary mb-2">{averageCompletion}%</div>
            <p className="text-lg text-muted-foreground">Functionality Complete</p>
          </div>
          <div>
            <div className="text-6xl font-bold text-primary mb-2">7</div>
            <p className="text-lg text-muted-foreground">Operational Phases</p>
          </div>
          <div>
            <div className="text-6xl font-bold text-primary mb-2">7</div>
            <p className="text-lg text-muted-foreground">Database Tables</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-500 mb-2">PROVEN</div>
            <p className="text-lg text-muted-foreground">In Live Demo</p>
          </div>
        </div>
      </div>

      {/* Phase Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        {phaseCompletions.map((phase) => (
          <div
            key={phase.phase}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(phase.status)}
                  <h3 className="text-xl font-bold text-foreground">Phase {phase.phase}</h3>
                </div>
                <p className="text-base text-muted-foreground">{phase.name}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{phase.completion}%</div>
              </div>
            </div>
            <Progress value={phase.completion} className="mb-4" />
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-emerald-600 mb-1">
                  ✓ {phase.builtFeatures.length} Features Built
                </p>
                <p className="text-sm font-medium text-amber-600">
                  ⚡ {phase.neededFeatures.length} BI-Specific Configs Needed
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};