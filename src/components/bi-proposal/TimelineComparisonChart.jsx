import { timelineComparison } from '@/utils/biProposalData';

export const TimelineComparisonChart = () => {
  return (
    <div className="space-y-12">
      {/* Traditional Build */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-foreground">Traditional Ground-Up Build</h3>
          <div className="text-right">
            <div className="text-4xl font-bold text-destructive">12-18 Months</div>
            <p className="text-lg text-muted-foreground">Time to Production</p>
          </div>
        </div>
        <div className="space-y-3">
          {timelineComparison.traditional.map((phase, index) => (
            <div key={index} className="relative">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-foreground">{phase.name}</span>
                  <span className="text-lg font-bold text-destructive">{phase.duration}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {phase.deliverables.map((deliverable, i) => (
                    <span key={i} className="text-sm px-3 py-1 bg-card rounded-full text-muted-foreground">
                      {deliverable}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-destructive/5 border border-destructive/20 rounded-lg p-6">
          <p className="text-xl font-semibold text-destructive">First Value: Month 6-8</p>
          <p className="text-base text-muted-foreground mt-2">Estimated Cost: $1.2M - $1.8M</p>
        </div>
      </div>

      {/* Prototype-Based */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-foreground">Prototype-Based Approach</h3>
          <div className="text-right">
            <div className="text-4xl font-bold text-emerald-500">16-20 Weeks</div>
            <p className="text-lg text-muted-foreground">Time to Production</p>
          </div>
        </div>
        <div className="space-y-3">
          {timelineComparison.prototype.map((phase, index) => (
            <div key={index} className="relative">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-foreground">{phase.name}</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-500">{phase.duration}</span>
                    {phase.startWeek && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (Week {phase.startWeek})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {phase.deliverables.map((deliverable, i) => (
                    <span key={i} className="text-sm px-3 py-1 bg-card rounded-full text-muted-foreground">
                      {deliverable}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-6">
          <p className="text-xl font-semibold text-emerald-600">First Value: Week 8 (2 months)</p>
          <p className="text-base text-muted-foreground mt-2">Estimated Cost: $425K - $575K</p>
        </div>
      </div>

      {/* Comparison Summary */}
      <div className="bg-primary/5 border-2 border-primary rounded-xl p-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-primary mb-2">75%</div>
            <p className="text-lg text-muted-foreground">Faster Time to Market</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-primary mb-2">65%</div>
            <p className="text-lg text-muted-foreground">Lower Implementation Cost</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-primary mb-2">10x</div>
            <p className="text-lg text-muted-foreground">Lower Technical Risk</p>
          </div>
        </div>
      </div>
    </div>
  );
};