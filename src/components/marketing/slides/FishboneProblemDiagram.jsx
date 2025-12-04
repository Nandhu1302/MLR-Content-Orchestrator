
import { MermaidDiagram } from '@/components/diagrams/MermaidDiagram';

const fishboneDiagram = `
graph LR
    %% Top bones (causes) - pointing down toward spine
    SS[Strategy Silos<br/>40% Time Wasted<br/>Disconnected Planning]
    CCG[Content Creation Gaps<br/>No Campaign Reuse<br/>Duplicate Entry]
    DBCB[Brand Compliance<br/>Breakdown<br/>Visual Inconsistencies]
    CRF[Regulatory<br/>Fragmentation<br/>Multiple MLR Cycles]
    
    %% Bottom bones (causes) - pointing up toward spine
    LB[Localization<br/>Barriers<br/>Slow Adaptation]
    PFG[Performance<br/>Feedback Gaps<br/>Delayed Analytics]
    TIF[Technical<br/>Integration Failure<br/>Manual Handoffs]
    
    %% Spine segments
    S1[ ]
    S2[ ]
    S3[ ]
    S4[ ]
    
    %% Head (the core problem)
    HEAD[💥 Inefficient Pharma<br/>Content Operations<br/>$2B Annual Waste<br/>Fragmented Systems]
    
    %% Top bones to spine
    SS -->|causes| S1
    CCG -->|causes| S2
    DBCB -->|causes| S3
    CRF -->|causes| S4
    
    %% Bottom bones to spine
    LB -->|causes| S2
    PFG -->|causes| S3
    TIF -->|causes| S4
    
    %% Spine connections
    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 ==>|results in| HEAD
    
    %% Styling
    classDef causeTop fill:#fca5a5,stroke:#dc2626,stroke-width:3px,color:#1e293b,font-weight:bold
    classDef causeBottom fill:#fed7aa,stroke:#ea580c,stroke-width:3px,color:#1e293b,font-weight:bold
    classDef spine fill:#e2e8f0,stroke:#64748b,stroke-width:2px,color:#64748b
    classDef problem fill:#dc2626,stroke:#991b1b,stroke-width:4px,color:#fff,font-weight:bold,font-size:16px
    
    class SS,CCG,DBCB,CRF causeTop
    class LB,PFG,TIF causeBottom
    class S1,S2,S3,S4 spine
    class HEAD problem
`;

const FishboneProblemDiagram = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-8">
      <div className="w-full max-w-7xl space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Root Cause Analysis</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            7 Critical Failure Points in Current Pharma Marketing Operations
          </p>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <span>📊 $2B Annual Industry Waste</span>
            <span>⏱️ 40% Time Lost to Fragmentation</span>
            <span>🔄 85% Manual Handoffs</span>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <MermaidDiagram
            id="fishbone-problem-diagram"
            definition={fishboneDiagram}
            name="Problem Analysis Fishbone"
            enableExport={true}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mt-8">
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
              Top Causes
            </h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li>• Strategy Silos</li>
              <li>• Content Creation Gaps</li>
              <li>• Design/Brand Compliance Breakdown</li>
              <li>• Compliance & Regulatory Fragmentation</li>
            </ul>
          </div>

          <div
            className="p-6 rounded-lg border-2"
            style={{
              backgroundColor: 'hsl(var(--theme-color-4) / 0.1)',
              borderColor: 'hsl(var(--theme-color-4) / 0.3)',
            }}
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: 'hsl(var(--theme-color-4))' }}
            >
              Bottom Causes
            </h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li>• Localization Barriers</li>
              <li>• Performance & Feedback Gaps</li>
              <li>• Technical Integration Failure</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FishboneProblemDiagram;
