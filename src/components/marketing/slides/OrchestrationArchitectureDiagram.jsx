
import { MermaidDiagram } from '@/components/diagrams/MermaidDiagram';

const orchestrationDiagram = `
graph TB
    %% External Systems (Top)
    SSO[SSO/Identity Provider]
    DAM[Digital Asset Management]
    CMS[Content Management]
    MLR[MLR/Regulatory Systems]
    
    %% Left Side - Content & Strategy
    STRAT[Strategy Planning Tools]
    BRAND[Brand Guidelines Systems]
    CONTENT[Content Creation Platforms]
    
    %% Right Side - Operations & Analytics
    LOC[Localization Services]
    PERF[Performance Analytics]
    WF[Workflow Management]
    
    %% Center - Orchestration Layer
    ORCH[AI-Powered Orchestration Layer<br/>━━━━━━━━━━━━━━━━<br/>Unified Data Model<br/>Intelligent Routing<br/>Context Preservation<br/>Automated Workflows]
    
    %% Bottom - Integrated Modules
    INTAKE[Intake & Hub]
    THEME[Theme Intelligence]
    STUDIO[Content & Design Studio]
    GLOC[Glocalization Engine]
    PREMLR[Pre-MLR Companion]
    
    %% End Users
    USERS[Marketing Teams<br/>MLR Reviewers<br/>Regional Managers<br/>Content Creators]
    
    %% Connections to Orchestration Layer
    SSO -.-|Authentication| ORCH
    DAM -.-|Assets| ORCH
    CMS -.-|Content| ORCH
    MLR -.-|Compliance| ORCH
    
    STRAT -.-|Strategy Data| ORCH
    BRAND -.-|Brand Rules| ORCH
    CONTENT -.-|Content| ORCH
    
    LOC -.-|Translations| ORCH
    PERF -.-|Analytics| ORCH
    WF -.-|Workflows| ORCH
    
    %% Orchestration to Modules
    ORCH ==>|Orchestrated Flow| INTAKE
    ORCH ==>|Orchestrated Flow| THEME
    ORCH ==>|Orchestrated Flow| STUDIO
    ORCH ==>|Orchestrated Flow| GLOC
    ORCH ==>|Orchestrated Flow| PREMLR
    
    %% Modules to Users
    INTAKE -->|Unified Experience| USERS
    THEME -->|Unified Experience| USERS
    STUDIO -->|Unified Experience| USERS
    GLOC -->|Unified Experience| USERS
    PREMLR -->|Unified Experience| USERS
    
    %% Feedback Loop
    USERS -.-|Feedback & Learning| ORCH
    
    %% Styling
    classDef external fill:#fca5a5,stroke:#dc2626,stroke-width:2px,color:#1e293b
    classDef orchestration fill:#60a5fa,stroke:#2563eb,stroke-width:4px,color:#fff,font-weight:bold
    classDef modules fill:#86efac,stroke:#16a34a,stroke-width:2px,color:#1e293b
    classDef users fill:#c084fc,stroke:#9333ea,stroke-width:2px,color:#1e293b
    
    class SSO,DAM,CMS,MLR,STRAT,BRAND,CONTENT,LOC,PERF,WF external
    class ORCH orchestration
    class INTAKE,THEME,STUDIO,GLOC,PREMLR modules
    class USERS users
`;

export const OrchestrationArchitectureDiagram = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-8">
      <div className="w-full max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            The Solution: AI-Powered Orchestration
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforming fragmented silos into a unified, intelligent ecosystem
          </p>
        </div>

        {/* Diagram */}
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <MermaidDiagram
            id="orchestration-architecture-diagram"
            definition={orchestrationDiagram}
            name="Orchestration Architecture"
            enableExport={true}
          />
        </div>

        {/* Key Sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div
            className="p-6 rounded-lg border-2"
            style={{
              backgroundColor: 'hsl(var(--destructive) / 0.1)',
              borderColor: 'hsl(var(--destructive) / 0.3)',
            }}
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: 'hsl(var(--destructive))' }}
            >
              Fragmented Systems
            </h3>
            <p className="text-sm text-foreground">
              Existing siloed tools that previously operated in isolation
            </p>
          </div>

          <div
            className="p-6 rounded-lg border-2"
            style={{
              backgroundColor: 'hsl(var(--theme-color-1) / 0.1)',
              borderColor: 'hsl(var(--theme-color-1) / 0.3)',
            }}
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: 'hsl(var(--theme-color-1))' }}
            >
              Orchestration Layer
            </h3>
            <p className="text-sm text-foreground">
              AI-powered hub that unifies data, preserves context, and automates workflows
            </p>
          </div>

          <div
            className="p-6 rounded-lg border-2"
            style={{
              backgroundColor: 'hsl(var(--theme-color-2) / 0.1)',
              borderColor: 'hsl(var(--theme-color-2) / 0.3)',
            }}
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: 'hsl(var(--theme-color-2))' }}
            >
              Integrated Modules
            </h3>
            <p className="text-sm text-foreground">
              Purpose-built capabilities that work seamlessly together
            </p>
          </div>

          <div
            className="p-6 rounded-lg border-2"
            style={{
              backgroundColor: 'hsl(var(--theme-color-3) / 0.1)',
              borderColor: 'hsl(var(--theme-color-3) / 0.3)',
            }}
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: 'hsl(var(--theme-color-3))' }}
            >
              Unified Experience
            </h3>
            <p className="text-sm text-foreground">
              Single interface for all users with continuous feedback loop
            </p>
          </div>
        </div>

        {/* Capabilities */}
        <div
          className="p-8 rounded-xl border-2 mt-8"
          style={{
            background: `linear-gradient(to right, hsl(var(--theme-color-1) / 0.1), hsl(var(--theme-color-2) / 0.1))`,
            borderColor: 'hsl(var(--primary) / 0.3)',
          }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Key Orchestration Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">🔄 Unified Data Model</h4>
              <p className="text-sm text-muted-foreground">
                Single source of truth across all systems, eliminating data silos and inconsistencies
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">🎯 Intelligent Routing</h4>
              <p className="text-sm text-muted-foreground">
                AI-driven workflow automation that routes content through the right systems at the right time
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">🧠 Context Preservation</h4>
              <p className="text-sm text-muted-foreground">
                Strategic intent, compliance requirements, and brand guidelines flow seamlessly across modules
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">⚡ Automated Workflows</h4>
              <p className="text-sm text-muted-foreground">
                Eliminate manual handoffs and data entry with intelligent automation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrchestrationArchitectureDiagram;
