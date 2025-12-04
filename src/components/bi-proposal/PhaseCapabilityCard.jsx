import { CheckCircle2, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const PhaseCapabilityCard = ({ phase }) => {
  return (
    <div className="space-y-8">
      {/* Header with Completion */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-4xl font-bold text-foreground mb-2">
            Phase {phase.phase}: {phase.name}
          </h3>
          <div className="flex items-center gap-4 mt-4">
            <Progress value={phase.completion} className="w-64" />
            <span className="text-3xl font-bold text-primary">{phase.completion}% Complete</span>
          </div>
        </div>
      </div>

      {/* What's Built */}
      <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          <h4 className="text-2xl font-bold text-emerald-600">What's Built & Working</h4>
        </div>
        <ul className="space-y-3">
          {phase.builtFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-emerald-600 text-xl mt-1">✓</span>
              <span className="text-lg text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What's Needed */}
      <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-amber-600" />
          <h4 className="text-2xl font-bold text-amber-600">What's Needed for BI</h4>
        </div>
        <ul className="space-y-3">
          {phase.neededFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-amber-600 text-xl mt-1">⚡</span>
              <span className="text-lg text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Demo Evidence */}
      {phase.demoEvidence && (
        <div className="bg-primary/5 border-2 border-primary rounded-xl p-8">
          <h4 className="text-2xl font-bold text-primary mb-4">Demo Proof Point</h4>
          <p className="text-xl text-foreground italic">"{phase.demoEvidence}"</p>
        </div>
      )}
    </div>
  );
};