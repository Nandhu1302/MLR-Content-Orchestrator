import { ArrowRight, Clock, DollarSign, AlertCircle, Search, Globe } from 'lucide-react';

export const TransformationArrowVisual = () => {
  const beforePoints = [
    { icon: Clock, label: '6-8 weeks per market', color: 'text-destructive' },
    { icon: DollarSign, label: 'Manual processes', color: 'text-destructive' },
    { icon: AlertCircle, label: 'Post-translation compliance checks (rework)', color: 'text-destructive' },
    { icon: Search, label: 'No TM visibility', color: 'text-destructive' },
    { icon: Globe, label: 'Cultural nuances lost', color: 'text-destructive' }
  ];

  const afterPoints = [
    { icon: Clock, label: '3-5 days per market (85-95% faster)', color: 'text-emerald-600' },
    { icon: DollarSign, label: 'AI-powered automation', color: 'text-emerald-600' },
    { icon: AlertCircle, label: 'Proactive compliance validation', color: 'text-emerald-600' },
    { icon: Search, label: 'Real-time TM leverage (60-90%)', color: 'text-emerald-600' },
    { icon: Globe, label: 'Built-in cultural intelligence', color: 'text-emerald-600' }
  ];

  return (
    <div className="grid grid-cols-[1fr,auto,1fr] gap-8 items-center">
      {/* Before State */}
      <div className="bg-destructive/5 border-2 border-destructive/30 rounded-xl p-8">
        <h3 className="text-3xl font-bold text-destructive mb-8">Current State</h3>
        <div className="space-y-6">
          {beforePoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <Icon className={`w-8 h-8 flex-shrink-0 ${point.color}`} />
                <p className="text-lg text-foreground">{point.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex flex-col items-center gap-4">
        <ArrowRight className="w-24 h-24 text-primary animate-pulse" strokeWidth={3} />
        <div className="bg-primary/10 px-6 py-3 rounded-full">
          <p className="text-xl font-bold text-primary whitespace-nowrap">Glocalization Module</p>
        </div>
      </div>

      {/* After State */}
      <div className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-xl p-8">
        <h3 className="text-3xl font-bold text-emerald-600 mb-8">With Glocalization</h3>
        <div className="space-y-6">
          {afterPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <Icon className={`w-8 h-8 flex-shrink-0 ${point.color}`} />
                <p className="text-lg text-foreground">{point.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};