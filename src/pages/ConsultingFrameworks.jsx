import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/diagrams/MermaidDiagram";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConsultingFrameworks = () => {
  const navigate = useNavigate();

  const diagrams = [
    {
      id: "five-horizons-timeline",
      name: "Five Horizons of Engagement Evolution (2024-2035)",
      description: "Timeline showing the progressive evolution of pharmaceutical engagement across five distinct horizons",
      mermaidSyntax: `timeline
    title Five Horizons of Pharmaceutical Engagement Evolution
    2024-2026 : Horizon 1 - Intelligent Orchestration
              : AI-powered personalization
              : Omnichannel coordination
              : Predictive analytics
    2026-2028 : Horizon 2 - Seamless Experience
              : Real-time engagement
              : Integrated ecosystems
              : Proactive outreach
    2028-2030 : Horizon 3 - Co-Creation Era
              : Collaborative content
              : Community platforms
              : Value-based partnerships
    2030-2033 : Horizon 4 - Predictive Health
              : Preventive interventions
              : IoT integration
              : Continuous monitoring
    2033-2035 : Horizon 5 - Autonomous Networks
              : AI agents
              : Self-optimizing systems
              : Blockchain trust`
    },
    {
      id: "fundamental-shift-model",
      name: "Fundamental Shift in Engagement Model",
      description: "Transformation from traditional product-focused approach to future health partnership model",
      mermaidSyntax: `flowchart LR
    subgraph traditional["TRADITIONAL MODEL (Today)"]
        A1[Product Focus] --> B1[Push Marketing]
        B1 --> C1[Rep-Led Sales]
        C1 --> D1[Transaction]
        D1 --> E1[Limited Data]
    end
    
    subgraph future["FUTURE MODEL (2030)"]
        A2[Health Partnership] --> B2[Value Co-Creation]
        B2 --> C2[AI-Augmented Teams]
        C2 --> D2[Continuous Relationship]
        D2 --> E2[Intelligence Loop]
    end
    
    E1 -.Transform.-> A2
    
    classDef traditional fill:#fecaca,stroke:#dc2626,color:#1e293b,stroke-width:2px
    classDef future fill:#bbf7d0,stroke:#16a34a,color:#1e293b,stroke-width:2px
    
    class A1,B1,C1,D1,E1 traditional
    class A2,B2,C2,D2,E2 future`
    },
    {
      id: "five-macro-forces-mindmap",
      name: "Five Macro Forces Driving Transformation",
      description: "Comprehensive mind map of the key forces reshaping pharmaceutical engagement",
      mermaidSyntax: `mindmap
  root((Future of<br/>Pharma<br/>Engagement))
    Regulatory Evolution
      Digital channels approved
      Real-world evidence
      Patient outcomes focus
      Data privacy mandates
    Technology Disruption
      Generative AI
      IoT & wearables
      Blockchain
      Quantum computing
    Stakeholder Power Shift
      HCP digital natives
      Patient self-advocacy
      Caregiver influence
      Social media impact
    Competitive Dynamics
      Tech giants entering
      Biotech innovation
      Generic pressure
      DTC disruption
    Societal Expectations
      Transparency demands
      Health equity
      Sustainability
      Purpose-driven`
    },
    {
      id: "consulting-methodology-phases",
      name: "Consulting Methodology for Building Future Engagement",
      description: "Four-phase strategic consulting approach from foundation to transformation",
      mermaidSyntax: `flowchart LR
    START[Strategic Consulting<br/>Engagement] --> P1
    
    P1[Phase 1: Foundation<br/>Months 1-6<br/>• Current State Assessment<br/>• Future Vision Design<br/>• Gap Analysis] --> P2
    
    P2[Phase 2: Blueprint<br/>Months 4-9<br/>• Capability Architecture<br/>• Technology Roadmap<br/>• Business Case] --> P3
    
    P3[Phase 3: Pilot<br/>Months 8-15<br/>• Quick Wins<br/>• Proof of Value<br/>• Learning Loop] --> P4
    
    P4[Phase 4: Scale<br/>Months 12-36<br/>• Enterprise Rollout<br/>• Change Management<br/>• Continuous Optimization] --> END
    
    END[Transformed<br/>Engagement Model]
    
    classDef phase1 fill:#dbeafe,stroke:#2563eb,color:#1e293b,stroke-width:3px
    classDef phase2 fill:#bbf7d0,stroke:#16a34a,color:#1e293b,stroke-width:3px
    classDef phase3 fill:#fef3c7,stroke:#f59e0b,color:#1e293b,stroke-width:3px
    classDef phase4 fill:#fecaca,stroke:#dc2626,color:#1e293b,stroke-width:3px
    classDef endpoint fill:#e9d5ff,stroke:#9333ea,color:#1e293b,stroke-width:3px
    
    class P1 phase1
    class P2 phase2
    class P3 phase3
    class P4 phase4
    class START,END endpoint`
    },
    {
      id: "critical-success-factors-ecosystem",
      name: "Critical Success Factors Ecosystem",
      description: "Interconnected ecosystem of six critical success factors for transformation",
      mermaidSyntax: `flowchart LR
    LEAD[Leadership<br/>Commitment]
    ORG[Organizational<br/>Agility]
    DATA[Data as<br/>Foundation]
    CENTER[Future Engagement<br/>Success]
    ECO[Ecosystem<br/>Partnerships]
    TALENT[Talent &<br/>Culture]
    REG[Regulatory<br/>Navigation]
    
    LEAD --> CENTER
    ORG --> CENTER
    DATA --> CENTER
    CENTER --> ECO
    CENTER --> TALENT
    CENTER --> REG
    
    LEAD -.enables.-> ORG
    ORG -.leverages.-> DATA
    ECO -.requires.-> TALENT
    TALENT -.ensures.-> REG
    
    classDef center fill:#e9d5ff,stroke:#9333ea,color:#1e293b,stroke-width:3px
    classDef factor1 fill:#dbeafe,stroke:#2563eb,color:#1e293b,stroke-width:2px
    classDef factor2 fill:#bbf7d0,stroke:#16a34a,color:#1e293b,stroke-width:2px
    classDef factor3 fill:#fecaca,stroke:#dc2626,color:#1e293b,stroke-width:2px
    classDef factor4 fill:#fef3c7,stroke:#f59e0b,color:#1e293b,stroke-width:2px
    classDef factor5 fill:#fed7aa,stroke:#ea580c,color:#1e293b,stroke-width:2px
    classDef factor6 fill:#bae6fd,stroke:#0284c7,color:#1e293b,stroke-width:2px
    
    class CENTER center
    class LEAD factor1
    class ORG factor2
    class DATA factor3
    class ECO factor4
    class TALENT factor5
    class REG factor6`
    },
    {
      id: "capability-building-architecture",
      name: "Capability Building Architecture",
      description: "Four-layer technical architecture showing experience, orchestration, intelligence, and foundation layers",
      mermaidSyntax: `flowchart LR
    subgraph experience["Experience Layer"]
        direction TB
        HCP[HCP Channels]
        PATIENT[Patient Portals]
        FIELD[Field Force Tools]
    end
    
    subgraph orchestration["Orchestration Layer"]
        direction TB
        JOURNEY[Journey Engine]
        CONTENT[Content Hub]
        PERSON[Personalization AI]
    end
    
    subgraph intelligence["Intelligence Layer"]
        direction TB
        CDP[Customer Data Platform]
        ANALYTICS[Advanced Analytics]
        ML[ML Models]
    end
    
    subgraph foundation["Foundation Layer"]
        direction TB
        MASTER[Master Data]
        INTEGRATION[Integration Fabric]
        SECURITY[Security & Governance]
    end
    
    %% Experience Layer flows to Orchestration Layer
    experience --> orchestration
    HCP --> JOURNEY
    PATIENT --> JOURNEY
    FIELD --> CONTENT
    
    %% Orchestration Layer flows to Intelligence Layer
    orchestration --> intelligence
    JOURNEY --> PERSON
    CONTENT --> PERSON
    PERSON --> CDP
    
    %% Intelligence Layer flows to Foundation Layer
    intelligence --> foundation
    CDP --> ANALYTICS
    ANALYTICS --> ML
    ML --> INTEGRATION
    
    %% Foundation Layer internal connections
    MASTER --> INTEGRATION
    INTEGRATION --> SECURITY
    
    classDef experience fill:#dbeafe,stroke:#2563eb,color:#1e293b,stroke-width:2px
    classDef orchestration fill:#fef3c7,stroke:#f59e0b,color:#1e293b,stroke-width:2px
    classDef intelligence fill:#bbf7d0,stroke:#16a34a,color:#1e293b,stroke-width:2px
    classDef foundation fill:#fecaca,stroke:#dc2626,color:#1e293b,stroke-width:2px
    
    class HCP,PATIENT,FIELD experience
    class JOURNEY,CONTENT,PERSON orchestration
    class CDP,ANALYTICS,ML intelligence
    class MASTER,INTEGRATION,SECURITY foundation`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Consulting Framework Diagrams</h1>
            <p className="text-muted-foreground mt-2">
              Strategic frameworks for pharmaceutical engagement transformation - Export as high-quality PNG images
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {diagrams.map((diagram) => (
            <Card key={diagram.id} className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">{diagram.name}</CardTitle>
                <CardDescription className="text-base">{diagram.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  id={diagram.id}
                  definition={diagram.mermaidSyntax}
                  name={diagram.name}
                  enableExport={true}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground pb-8">
          Click the export buttons above each diagram to download as SVG, PNG, or PDF
        </div>
      </div>
    </div>
  );
};

export default ConsultingFrameworks;