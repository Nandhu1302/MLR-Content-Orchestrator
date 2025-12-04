
import { ArrowRight } from 'lucide-react';

const workflowSteps = [
  {
    persona: 'Strategic Analyst',
    steps: ['Theme Workshop', 'Intelligence Enrichment', 'Approval'],
    themeIndex: 1,
  },
  {
    persona: 'Content Creator',
    steps: ['Content Studio', 'AI Generation', 'Refinement', 'Pre-MLR Check'],
    themeIndex: 2,
  },
  {
    persona: 'MLR Reviewer',
    steps: ['Review Queue', 'Feedback', 'Approval (90% pass)'],
    themeIndex: 3,
  },
  {
    persona: 'Global Team',
    steps: ['Glocalization', 'Localization', 'Distribution'],
    themeIndex: 4,
  },
];

const WorkflowDetailSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-foreground mb-4">
          How It Works: End-to-End Workflow
        </h2>
        <p className="text-2xl text-muted-foreground">
          From Strategy to Global Execution in 3 Weeks
        </p>
      </div>

      {/* Workflow Steps */}
      <div className="space-y-4 mb-8">
        {workflowSteps.map((workflow, index) => (
          <div
            key={index}
            className="border border-border rounded-xl p-6"
            style={{
              backgroundColor: `hsl(var(--theme-color-${workflow.themeIndex}) / 0.1)`,
            }}
          >
            <div className="flex items-center gap-4">
              {/* Persona */}
              <div className="w-48 flex-shrink-0">
                <p
                  className="text-xl font-bold"
                  style={{
                    color: `hsl(var(--theme-color-${workflow.themeIndex}))`,
                  }}
                >
                  {workflow.persona}
                </p>
              </div>

              {/* Steps */}
              <div className="flex items-center gap-3 flex-1 overflow-x-auto">
                {workflow.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-card border border-border rounded-lg">
                      <p className="text-base font-medium text-foreground whitespace-nowrap">
                        {step}
                      </p>
                    </div>
                    {idx < workflow.steps.length - 1 && (
                      <ArrowRight
                        className="w-5 h-5 flex-shrink-0"
                        style={{
                          color: `hsl(var(--theme-color-${workflow.themeIndex}))`,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-primary mb-1">3 weeks</p>
          <p className="text-sm text-muted-foreground">vs 8 weeks traditional</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-primary mb-1">60%</p>
          <p className="text-sm text-muted-foreground">tasks automated</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-primary mb-1">4 personas</p>
          <p className="text-sm text-muted-foreground">working in parallel</p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetailSlide;
