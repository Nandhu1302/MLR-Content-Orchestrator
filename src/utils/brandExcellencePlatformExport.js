
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, convertInchesToTwip } from 'docx';

export const generateBrandExcellencePlatformDocument = async () => {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
        },
      },
      children: [
        // Title Page
        new Paragraph({
          text: "BRAND EXCELLENCE PLATFORM",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "AI-Powered Pharmaceutical Marketing Intelligence Framework",
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "UCB RFI Response - Service Offering",
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Document Version: 1.0\nDate: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\nStatus: For Client Review`,
              break: 1,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
        // Table of Contents
        new Paragraph({
          text: "TABLE OF CONTENTS",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({ text: "1. Executive Summary", spacing: { after: 100 } }),
        new Paragraph({ text: "2. Platform Foundation: Pillar Definitions", spacing: { after: 100 } }),
        new Paragraph({ text: "3. End-to-End Workflow", spacing: { after: 100 } }),
        new Paragraph({ text: "4. Competitive Differentiation", spacing: { after: 100 } }),
        new Paragraph({ text: "5. ROI and Business Case", spacing: { after: 100 } }),
        new Paragraph({ text: "6. Implementation Roadmap", spacing: { after: 100 } }),
        new Paragraph({ text: "7. Platform Architecture Details", spacing: { after: 100 } }),

        // 1. Executive Summary
        new Paragraph({
          text: "1. EXECUTIVE SUMMARY",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),

        // The Challenge
        new Paragraph({
          text: "The Challenge: Content Operations Trilemma",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Pharmaceutical marketing teams face an impossible trade-off: Speed vs. Compliance vs. Quality. Current manual processes create significant operational challenges:",
          spacing: { after: 150 },
        }),
        new Paragraph({ text: "• Extended Timelines: 12+ weeks for complex assets, impacting launch readiness", spacing: { after: 50 } }),
        new Paragraph({ text: "• High Rejection Rates: 60% MLR rejection baseline causing costly rework cycles", spacing: { after: 50 } }),
        new Paragraph({ text: "• Fragmented Operations: Disconnected tools across 6-8 platforms creating workflow inefficiencies", spacing: { after: 50 } }),
        new Paragraph({ text: "• Market Pressures: Accelerating launch timelines, expanding global footprint, increasing regulatory complexity", spacing: { after: 50 } }),
        new Paragraph({ text: "• Opportunity Cost: Delayed time-to-market equals $3.2M+ lost annually per brand", spacing: { after: 200 } }),

        // The Solution
        new Paragraph({
          text: "The Solution: Brand Excellence Platform",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "A three-pillar integrated ecosystem that addresses the entire content lifecycle from strategic planning through compliance to global deployment:",
          spacing: { after: 150 },
        }),
        new Paragraph({ text: "1. Strategic Content Intelligence Hub: AI analyzes competitive landscape, market dynamics, and brand guidelines to generate strategic themes with real-time guardrails", spacing: { after: 50 } }),
        new Paragraph({ text: "2. PreMLR Compliance Companion: Predictive system learns from historical MLR decisions to provide compliance scoring and pre-approved alternatives before formal review", spacing: { after: 50 } }),
        new Paragraph({ text: "3. Global-Local Orchestration Engine: Culturally-intelligent translation leveraging TM, medical terminology, and regulatory frameworks for true \"glocalization\"", spacing: { after: 200 } }),

        // The Value Proposition
        new Paragraph({
          text: "The Value Proposition: Quantified Business Outcomes",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),
        createMetricsTable(),
        new Paragraph({ text: "", spacing: { after: 100 } }),
        new Paragraph({
          children: [new TextRun({ text: "Additional Benefits:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• 50+ market regulatory framework coverage with real-time validation", spacing: { after: 50 } }),
        new Paragraph({ text: "• 30% translation cost reduction through TM leverage and AI optimization", spacing: { after: 50 } }),
        new Paragraph({ text: "• 40% labor efficiency improvement increasing capacity without headcount growth", spacing: { after: 200 } }),

        // UCB Impact Analysis Section
        new Paragraph({
          text: "UCB IMPACT ANALYSIS: QUANTITATIVE & QUALITATIVE VALUE",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Comprehensive assessment of platform impact across operational, financial, compliance, strategic, and organizational dimensions.",
          spacing: { after: 300 },
        }),
        ...createImpactAnalysisTables(),

        // 2. Platform Foundation: Pillar Definitions
        new Paragraph({
          text: "2. PLATFORM FOUNDATION: PILLAR DEFINITIONS",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),

        // Pillar 1
        new Paragraph({
          text: "Pillar 1: Strategic Content Intelligence Hub",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Definition: ", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "An AI-powered intelligence engine that transforms disparate data sources (competitive intelligence, market dynamics, social sentiment, brand guidelines) into actionable strategic themes and real-time brand compliance guardrails.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Core Concept: ", bold: true }), new TextRun({ text: "Proactive intelligence-driven content creation vs. reactive production", italics: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Measurable Impact:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• 60% reduction in strategic planning cycles", spacing: { after: 50 } }),
        new Paragraph({ text: "• 85% brand consistency scores", spacing: { after: 50 } }),
        new Paragraph({ text: "• Real-time competitive intelligence integration", spacing: { after: 200 } }),

        // Pillar 2
        new Paragraph({
          text: "Pillar 2: PreMLR Compliance Companion",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Definition: ", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "A predictive compliance system that analyzes historical MLR decisions, regulatory frameworks across 50+ markets, and medical accuracy standards to provide real-time compliance scoring and pre-approved language alternatives before content enters formal review.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Core Concept: ", bold: true }), new TextRun({ text: "Converting compliance bottleneck into content accelerator", italics: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Measurable Impact:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• 90% first-pass MLR approval rate (up from 40%)", spacing: { after: 50 } }),
        new Paragraph({ text: "• 75% reduction in review cycles", spacing: { after: 50 } }),
        new Paragraph({ text: "• 50+ market regulatory framework coverage", spacing: { after: 200 } }),

        // Pillar 3
        new Paragraph({
          text: "Pillar 3: Global-Local Orchestration Engine",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Definition: ", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "A culturally-intelligent translation and localization system that leverages Translation Memory, medical terminology databases, cultural intelligence frameworks, and market regulatory requirements to deliver medically accurate, culturally resonant content at scale.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Core Concept: ", bold: true }), new TextRun({ text: "Global brand consistency + local cultural relevance = \"Glocalization\"", italics: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Measurable Impact:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• 50+ market readiness", spacing: { after: 50 } }),
        new Paragraph({ text: "• 30% translation cost reduction", spacing: { after: 50 } }),
        new Paragraph({ text: "• 40% labor efficiency gains", spacing: { after: 200 } }),

        // 3. End-to-End Workflow
        new Paragraph({
          text: "3. END-TO-END WORKFLOW",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Integrated workflow across all three pillars from strategic planning to global deployment:",
          spacing: { after: 150 },
        }),
        ...createWorkflowSteps(),

        // 4. Competitive Differentiation
        new Paragraph({
          text: "4. COMPETITIVE DIFFERENTIATION",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "What sets Brand Excellence Platform apart from generic content management and translation tools:",
          spacing: { after: 150 },
        }),
        ...createDifferentiators(),

        // 5. ROI and Business Case
        new Paragraph({
          text: "5. ROI AND BUSINESS CASE",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Annual Value Per Brand: $3.2M+",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "12-18 month payback period \n Platform subscription: ~$180K/year",
          spacing: { after: 200 },
        }),
        createROITable(),

        // 6. Implementation Roadmap
        new Paragraph({
          text: "6. IMPLEMENTATION ROADMAP",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Phased deployment approach ensuring smooth transition and rapid time-to-value:",
          spacing: { after: 150 },
        }),
        ...createRoadmapPhases(),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Brand_Excellence_Platform_RFP_${new Date().toISOString().split('T')[0]}.docx`;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Helper Functions
function createMetricsTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Metric", bold: true })] })], width: { size: 40, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Value", bold: true })] })], width: { size: 30, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Detail", bold: true })] })], width: { size: 30, type: WidthType.PERCENTAGE } }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Time-to-Market Reduction")] }),
          new TableCell({ children: [new Paragraph("75%")] }),
          new TableCell({ children: [new Paragraph("12 weeks → 3 weeks")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("First-Pass MLR Approval")] }),
          new TableCell({ children: [new Paragraph("90%")] }),
          new TableCell({ children: [new Paragraph("vs. 40% baseline")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Annual Value Per Brand")] }),
          new TableCell({ children: [new Paragraph("$3.2M+")] }),
          new TableCell({ children: [new Paragraph("12-18 mo. payback")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Global Market Coverage")] }),
          new TableCell({ children: [new Paragraph("50+")] }),
          new TableCell({ children: [new Paragraph("Markets ready")] }),
        ],
      }),
    ],
  });
}

function createWorkflowSteps() {
  const steps = [
    {
      num: 1,
      title: "Strategic Intelligence (Pillar 1)",
      input: "Campaign objectives, target audience, indication, competitive landscape",
      process: "AI analyzes market data (IQVIA), social sentiment, brand guidelines, competitive positioning",
      output: "Strategic theme library with confidence scores, messaging frameworks"
    },
    {
      num: 2,
      title: "Content Creation with Live Guardrails (Pillar 1 + 2)",
      input: "Strategic theme + content brief",
      process: "AI-assisted content creation with real-time brand consistency and compliance checking",
      output: "Brand-aligned content with compliance score (0-100) and issue flagging"
    },
    {
      num: 3,
      title: "PreMLR Compliance Optimization (Pillar 2)",
      input: "Draft content",
      process: "Regulatory framework validation (FDA, EMA, PMDA), MLR memory prediction, medical accuracy checks",
      output: "Optimized content with pre-approved alternatives, approval probability score"
    },
    {
      num: 4,
      title: "MLR Submission (Pillar 2)",
      input: "Pre-validated content",
      process: "Content submitted to MLR with compliance insights and risk assessment",
      output: "Accelerated approval cycle (avg. 90% first-pass approval)"
    },
    {
      num: 5,
      title: "Global-Local Orchestration (Pillar 3)",
      input: "Approved master content + target markets",
      process: "TM-leveraged medical translation, cultural intelligence analysis, market regulatory mapping",
      output: "Culturally-adapted, medically accurate, market-compliant local assets"
    },
    {
      num: 6,
      title: "Multi-Market Deployment",
      input: "Localized assets",
      process: "Final review, publishing workflow",
      output: "Campaign-ready assets across 50+ markets"
    }
  ];
  const paragraphs = [];
  steps.forEach((step, idx) => {
    paragraphs.push(
      new Paragraph({
        text: `Step ${step.num}: ${step.title}`,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: idx === 0 ? 0 : 150, after: 100 },
      }),
      new Paragraph({ text: `Input: ${step.input}`, spacing: { after: 50 } }),
      new Paragraph({ text: `Process: ${step.process}`, spacing: { after: 50 } }),
      new Paragraph({ text: `Output: ${step.output}`, spacing: { after: 100 } })
    );
  });
  return paragraphs;
}

function createDifferentiators() {
  const items = [
    {
      title: "Integrated vs. Fragmented",
      desc: "Single platform replacing 6-8 disconnected tools (content creation, DAM, translation, compliance checking, project management)"
    },
    {
      title: "Predictive vs. Reactive",
      desc: "MLR Memory Predictor learns from historical decisions to prevent issues before they occur (vs. generic compliance checklists)"
    },
    {
      title: "Intelligence-Driven vs. Template-Based",
      desc: "AI analyzes real-time market data, competitive landscape, social sentiment (vs. static brand guidelines)"
    },
    {
      title: "Cultural Intelligence vs. Direct Translation",
      desc: "Adapts messaging, imagery, cultural context beyond word-for-word translation (Hofstede framework analysis)"
    },
    {
      title: "Pharmaceutical-Specific AI Training",
      desc: "Models trained on pharma marketing corpus, medical terminology (MedDRA, SNOMED), regulatory frameworks (vs. generic AI tools)"
    },
    {
      title: "Multi-Tier AI Architecture",
      desc: "Right AI engine for right task (Standard for high-volume, Advanced for complex reasoning, Premium for critical accuracy)"
    }
  ];
  return items.map((item, idx) => [
    new Paragraph({
      text: item.title,
      heading: HeadingLevel.HEADING_3,
      spacing: { before: idx === 0 ? 0 : 150, after: 100 },
    }),
    new Paragraph({
      text: item.desc,
      spacing: { after: 100 },
    })
  ]).flat();
}

function createROITable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true })] })], width: { size: 33, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Amount", bold: true })] })], width: { size: 33, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Detail", bold: true })] })], width: { size: 34, type: WidthType.PERCENTAGE } }),
        ],
      }),
      // Cost Savings
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "COST SAVINGS", bold: true })] })] }),
          new TableCell({ children: [new Paragraph("")] }),
          new TableCell({ children: [new Paragraph("")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Translation costs")] }),
          new TableCell({ children: [new Paragraph("$320K")] }),
          new TableCell({ children: [new Paragraph("30% reduction via TM leverage")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("MLR rework costs")] }),
          new TableCell({ children: [new Paragraph("$480K")] }),
          new TableCell({ children: [new Paragraph("Reduced rejection: 60% → 10%")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Agency costs")] }),
          new TableCell({ children: [new Paragraph("$240K")] }),
          new TableCell({ children: [new Paragraph("40% efficiency = less outsourcing")] }),
        ],
      }),
      // Revenue Protection
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "REVENUE PROTECTION", bold: true })] })] }),
          new TableCell({ children: [new Paragraph("")] }),
          new TableCell({ children: [new Paragraph("")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Time-to-market acceleration")] }),
          new TableCell({ children: [new Paragraph("$1.8M")] }),
          new TableCell({ children: [new Paragraph("3 months earlier @ $600K/month")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Opportunity cost reduction")] }),
          new TableCell({ children: [new Paragraph("$380K")] }),
          new TableCell({ children: [new Paragraph("Freed capacity for new campaigns")] }),
        ],
      }),
      // Efficiency Gains
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "EFFICIENCY GAINS", bold: true })] })] }),
          new TableCell({ children: [new Paragraph("")] }),
          new TableCell({ children: [new Paragraph("")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Labor efficiency")] }),
          new TableCell({ children: [new Paragraph("$480K")] }),
          new TableCell({ children: [new Paragraph("40% improvement = 6 FTE capacity")] }),
        ],
      }),
    ],
  });
}

function createRoadmapPhases() {
  const phases = [
    {
      phase: "Phase 1: Foundation",
      timeline: "Weeks 1-4",
      activities: [
        "Platform setup and configuration",
        "Brand guideline ingestion",
        "Translation memory integration",
        "User onboarding and training"
      ]
    },
    {
      phase: "Phase 2: Pillar 1 Activation",
      timeline: "Weeks 5-8",
      activities: [
        "Strategic Content Intelligence Hub deployment",
        "Historical content analysis",
        "Competitive intelligence setup",
        "Market data integrations (IQVIA, social listening)"
      ]
    },
    {
      phase: "Phase 3: Pillar 2 Activation",
      timeline: "Weeks 9-12",
      activities: [
        "PreMLR Compliance Companion deployment",
        "Historical MLR decision analysis",
        "Regulatory framework mapping",
        "Medical terminology database integration"
      ]
    },
    {
      phase: "Phase 4: Pillar 3 Activation",
      timeline: "Weeks 13-16",
      activities: [
        "Global-Local Orchestration Engine deployment",
        "Translation memory optimization",
        "Cultural intelligence framework setup",
        "Market regulatory database integration"
      ]
    },
    {
      phase: "Phase 5: Scale and Optimization",
      timeline: "Weeks 17-20",
      activities: [
        "Multi-brand expansion",
        "Workflow refinement based on usage data",
        "Advanced AI model fine-tuning",
        "Full-scale production launch"
      ]
    }
  ];
  const paragraphs = [];
  phases.forEach((phase, idx) => {
    paragraphs.push(
      new Paragraph({
        text: `${phase.phase} (${phase.timeline})`,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: idx === 0 ? 0 : 150, after: 100 },
      })
    );
    phase.activities.forEach(activity => {
      paragraphs.push(
        new Paragraph({
          text: `• ${activity}`,
          spacing: { after: 50 },
        })
      );
    });
  });
  return paragraphs;
}

function createImpactAnalysisTables() {
  const paragraphs = [];

  // Operational Excellence
  paragraphs.push(
    new Paragraph({
      text: "1. Operational Excellence",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    })
  );
  const operationalTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Impact Area", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Quantitative Metric", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Qualitative Impact", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Time-to-Market")] }),
          new TableCell({ children: [new Paragraph("75% reduction (12 weeks → 3 weeks)")] }),
          new TableCell({ children: [new Paragraph("Competitive advantage through faster campaign launches")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Content Throughput")] }),
          new TableCell({ children: [new Paragraph("102 localized assets/year (vs. 34 baseline)")] }),
          new TableCell({ children: [new Paragraph("3x capacity increase without headcount growth")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Process Efficiency")] }),
          new TableCell({ children: [new Paragraph("40% labor efficiency improvement")] }),
          new TableCell({ children: [new Paragraph("Elimination of manual tasks; strategic focus shift")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Asset Reusability")] }),
          new TableCell({ children: [new Paragraph("60% modular content reuse rate")] }),
          new TableCell({ children: [new Paragraph("Consistent brand messaging; accelerated development")] }),
        ],
      }),
    ],
  });
  paragraphs.push(operationalTable);

  // Financial Performance
  paragraphs.push(
    new Paragraph({
      text: "2. Financial Performance",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    })
  );
  const financialTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Impact Area", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Quantitative Metric", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Qualitative Impact", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Total Annual Value")] }),
          new TableCell({ children: [new Paragraph("$3.2M+ per brand")] }),
          new TableCell({ children: [new Paragraph("Direct bottom-line impact; measurable ROI")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Translation Cost Savings")] }),
          new TableCell({ children: [new Paragraph("$320K (30% reduction)")] }),
          new TableCell({ children: [new Paragraph("Optimized TM leverage; AI efficiency")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("MLR Rework Elimination")] }),
          new TableCell({ children: [new Paragraph("$480K saved (60% → 10% rejection)")] }),
          new TableCell({ children: [new Paragraph("Predictable budgets; better forecasting")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Revenue Protection")] }),
          new TableCell({ children: [new Paragraph("$1.8M (3-month launch acceleration)")] }),
          new TableCell({ children: [new Paragraph("Preserved market opportunity; competitive edge")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("ROI Timeline")] }),
          new TableCell({ children: [new Paragraph("12-18 month payback")] }),
          new TableCell({ children: [new Paragraph("Fast value realization; low financial risk")] }),
        ],
      }),
    ],
  });
  paragraphs.push(financialTable);

  // Compliance & Risk Mitigation
  paragraphs.push(
    new Paragraph({
      text: "3. Compliance & Risk Mitigation",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    })
  );
  const complianceTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Impact Area", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Quantitative Metric", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Qualitative Impact", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("First-Pass MLR Approval")] }),
          new TableCell({ children: [new Paragraph("90% (vs. 40% baseline)")] }),
          new TableCell({ children: [new Paragraph("Reduced regulatory risk; brand protection")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Regulatory Coverage")] }),
          new TableCell({ children: [new Paragraph("50+ markets validated")] }),
          new TableCell({ children: [new Paragraph("Global compliance confidence; scalable entry")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Pre-Submission Validation")] }),
          new TableCell({ children: [new Paragraph("100% content screened")] }),
          new TableCell({ children: [new Paragraph("Proactive risk identification")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Brand Consistency")] }),
          new TableCell({ children: [new Paragraph("85% adherence rate")] }),
          new TableCell({ children: [new Paragraph("Protected brand equity; consistent experience")] }),
        ],
      }),
    ],
  });
  paragraphs.push(complianceTable);

  // Strategic Capability
  paragraphs.push(
    new Paragraph({
      text: "4. Strategic Capability",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    })
  );
  const strategicTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Impact Area", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Quantitative Metric", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Qualitative Impact", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Competitive Intelligence")] }),
          new TableCell({ children: [new Paragraph("Real-time market analysis")] }),
          new TableCell({ children: [new Paragraph("Informed positioning; proactive response")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Cultural Intelligence")] }),
          new TableCell({ children: [new Paragraph("50+ market frameworks")] }),
          new TableCell({ children: [new Paragraph("Authentic resonance; enhanced brand perception")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("AI-Powered Insights")] }),
          new TableCell({ children: [new Paragraph("Multi-tier AI (GPT-5, Gemini 2.5)")] }),
          new TableCell({ children: [new Paragraph("Advanced reasoning; future-proof foundation")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Global-Local Balance")] }),
          new TableCell({ children: [new Paragraph('"Glocalization" optimization')] }),
          new TableCell({ children: [new Paragraph("Brand consistency + cultural relevance")] }),
        ],
      }),
    ],
  });
  paragraphs.push(strategicTable);

  // Organizational Capacity
  paragraphs.push(
    new Paragraph({
      text: "5. Organizational Capacity",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    })
  );
  const organizationalTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Impact Area", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Quantitative Metric", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Qualitative Impact", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Team Capacity Gain")] }),
          new TableCell({ children: [new Paragraph("6 FTE equivalent ($480K value)")] }),
          new TableCell({ children: [new Paragraph("Resource redeployment; innovation bandwidth")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Skills Evolution")] }),
          new TableCell({ children: [new Paragraph("Tactical → Strategic upskilling")] }),
          new TableCell({ children: [new Paragraph("Enhanced employee value; talent retention")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Cross-Functional Collaboration")] }),
          new TableCell({ children: [new Paragraph("Unified platform (replacing 6-8 tools)")] }),
          new TableCell({ children: [new Paragraph("Reduced fragmentation; improved visibility")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Implementation Timeline")] }),
          new TableCell({ children: [new Paragraph("16-20 weeks to full deployment")] }),
          new TableCell({ children: [new Paragraph("Manageable change; minimized disruption")] }),
        ],
      }),
    ],
  });
  paragraphs.push(organizationalTable);

  return paragraphs;
}