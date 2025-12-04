
import { implementationPhases } from '@/utils/marketingDeckData';
import { Calendar, CheckCircle2 } from 'lucide-react';

const ImplementationRoadmapSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-foreground mb-4">
          16-Week Implementation Roadmap
        </h2>
        <p className="text-2xl text-muted-foreground">
          Phased, Low-Risk Rollout Plan
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {implementationPhases.map((phase, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-6">
              <div className="w-32 flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <p className="text-sm font-bold text-primary">{phase.weeks}</p>
                </div>
                <p className="text-xl font-bold text-foreground">{phase.phase}</p>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Deliverables
                  </p>
                  <ul className="space-y-1">
                    {phase.deliverables.map((deliverable, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Key Milestones
                  </p>
                  <ul className="space-y-1">
                    {phase.milestones.map((milestone, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span className="text-sm text-foreground">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary mb-1">2 FTE</p>
          <p className="text-xs text-muted-foreground">Client resources required</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary mb-1">8 FTE</p>
          <p className="text-xs text-muted-foreground">Vendor implementation team</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary mb-1">Week 8</p>
          <p className="text-xs text-muted-foreground">First production assets</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary mb-1">Week 16</p>
          <p className="text-xs text-muted-foreground">Full production ready</p>
        </div>
      </div>
    </div>
  );
};

export default ImplementationRoadmapSlide;
