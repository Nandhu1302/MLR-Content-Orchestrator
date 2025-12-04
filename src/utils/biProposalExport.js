
import pptxgen from 'pptxgenjs';
import * as XLSX from 'xlsx';
import {
  phaseCompletions,
  timelineComparison,
  roiMetrics,
  riskAssessments,
  demoProofPoints,
  prototypeStats,
  clientDependencies,
  implementationRoadmap
} from './biProposalData';

export const exportToPowerPoint = async () => {
  const pptx = new pptxgen();
  // Set presentation properties
  pptx.author = 'Content Orchestrator Platform';
  pptx.company = 'Your Company';
  pptx.subject = 'Glocalization Module Proposal for Boehringer Ingelheim';
  pptx.title = 'BI Glocalization Module Proposal';

  // Define colors
  const colors = {
    primary: '1e40af',
    emerald: '10b981',
    destructive: 'ef4444',
    amber: 'f59e0b',
    background: 'ffffff',
    text: '0f172a',
    muted: '64748b'
  };

  // ==================== SLIDE 1: TITLE SLIDE ====================
  const slide1 = pptx.addSlide();
  slide1.background = { color: colors.primary };
  slide1.addText('From 60% Prototype to 100% Solution', {
    x: 1,
    y: 1.5,
    w: 8,
    h: 0.6,
    fontSize: 20,
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });
  slide1.addText('Glocalization Module', {
    x: 1,
    y: 2.3,
    w: 8,
    h: 1,
    fontSize: 54,
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });
  slide1.addText('For Boehringer Ingelheim', {
    x: 1,
    y: 3.5,
    w: 8,
    h: 0.6,
    fontSize: 32,
    color: 'E0E0E0',
    align: 'center'
  });
  slide1.addText(`16 Weeks to Value vs 12-18 Months Traditional Build`, {
    x: 1,
    y: 4.5,
    w: 8,
    h: 0.5,
    fontSize: 18,
    color: 'FFFFFF',
    align: 'center'
  });
  slide1.addText(`${prototypeStats.functionalityComplete}% Already Built`, {
    x: 2,
    y: 5.3,
    w: 3,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: colors.emerald,
    align: 'center'
  });
  slide1.addText('PROVEN In Live Demo', {
    x: 5,
    y: 5.3,
    w: 3,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: colors.emerald,
    align: 'center'
  });

  // ==================== SLIDE 2: PROTOTYPE COMPLETION DASHBOARD ====================
  const slide2 = pptx.addSlide();
  slide2.addText('What\'s Already Built', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 36,
    bold: true,
    color: colors.text
  });
  slide2.addText('A working prototype with 7 operational phases', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.muted
  });
  // Phase completion table
  const phaseRows = [
    [
      { text: 'Phase', options: { bold: true, color: colors.text, fontSize: 14 } },
      { text: 'Name', options: { bold: true, color: colors.text, fontSize: 14 } },
      { text: 'Completion', options: { bold: true, color: colors.text, fontSize: 14 } },
      { text: 'Status', options: { bold: true, color: colors.text, fontSize: 14 } }
    ],
    ...phaseCompletions.map(phase => [
      { text: `Phase ${phase.phase}`, options: { fontSize: 12 } },
      { text: phase.name, options: { fontSize: 12 } },
      { text: `${phase.completion}%`, options: { bold: true, color: colors.primary, fontSize: 12 } },
      { text: phase.status.toUpperCase(), options: { fontSize: 11 } }
    ])
  ];
  slide2.addTable(phaseRows, {
    x: 0.5,
    y: 1.3,
    w: 9,
    h: 4,
    fontSize: 12,
    align: 'left',
    valign: 'middle',
    border: { pt: 1, color: colors.muted },
    fill: { color: colors.background }
  });

  // ==================== SLIDE 3: TIMELINE COMPARISON ====================
  const slide3 = pptx.addSlide();
  slide3.addText('Timeline Comparison', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 36,
    bold: true,
    color: colors.text
  });
  slide3.addText('Prototype-Based vs Traditional Ground-Up Build', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.muted
  });
  // Traditional Build
  slide3.addText('Traditional Ground-Up Build: 12-18 Months', {
    x: 0.5,
    y: 1.3,
    w: 4.5,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: colors.destructive
  });
  let yPos = 1.8;
  timelineComparison.traditional.forEach(phase => {
    slide3.addText(`${phase.name} (${phase.duration})`, {
      x: 0.7,
      y: yPos,
      w: 4,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: colors.text
    });
    yPos += 0.35;
    phase.deliverables.forEach(deliverable => {
      slide3.addText(`• ${deliverable}`, {
        x: 1,
        y: yPos,
        w: 3.7,
        h: 0.25,
        fontSize: 9,
        color: colors.muted
      });
      yPos += 0.25;
    });
    yPos += 0.15;
  });
  // Prototype-Based
  slide3.addText('Prototype-Based Approach: 16-20 Weeks', {
    x: 5.5,
    y: 1.3,
    w: 4.5,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: colors.emerald
  });
  yPos = 1.8;
  timelineComparison.prototype.forEach(phase => {
    slide3.addText(`${phase.name} (${phase.duration})`, {
      x: 5.7,
      y: yPos,
      w: 4,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: colors.text
    });
    yPos += 0.35;
    phase.deliverables.forEach(deliverable => {
      slide3.addText(`• ${deliverable}`, {
        x: 6,
        y: yPos,
        w: 3.7,
        h: 0.25,
        fontSize: 9,
        color: colors.muted
      });
      yPos += 0.25;
    });
    yPos += 0.15;
  });

  // ==================== SLIDE 4: PLATFORM OVERVIEW ====================
  const slide4 = pptx.addSlide();
  slide4.addText('Brand Excellence Platform', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 36,
    bold: true,
    color: colors.text
  });
  slide4.addText('End-to-end pharmaceutical marketing orchestration', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.muted
  });
  slide4.addText('6 Integrated Modules', {
    x: 1,
    y: 2,
    w: 2.5,
    h: 0.8,
    fontSize: 32,
    bold: true,
    color: colors.primary,
    align: 'center',
    valign: 'middle'
  });
  slide4.addText('15+ Markets Supported', {
    x: 3.7,
    y: 2,
    w: 2.5,
    h: 0.8,
    fontSize: 32,
    bold: true,
    color: colors.primary,
    align: 'center',
    valign: 'middle'
  });
  slide4.addText('100% Compliance-First', {
    x: 6.5,
    y: 2,
    w: 2.5,
    h: 0.8,
    fontSize: 32,
    bold: true,
    color: colors.primary,
    align: 'center',
    valign: 'middle'
  });

  // ==================== SLIDE 5: TRANSFORMATION ====================
  const slide5 = pptx.addSlide();
  slide5.addText('Why Glocalization Matters for BI', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 36,
    bold: true,
    color: colors.text
  });
  slide5.addText('Transforming your global content operations', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.muted
  });
  // Current State
  slide5.addText('Current State', {
    x: 0.5,
    y: 1.5,
    w: 4,
    h: 0.4,
    fontSize: 20,
    bold: true,
    color: colors.destructive
  });
  const currentStatePoints = [
    'Manual translation workflows',
    'Fragmented tools and processes',
    '6-12 month timelines per market',
    'High cultural adaptation risk',
    'Reactive regulatory compliance',
    'Limited TM leverage'
  ];
  yPos = 2;
  currentStatePoints.forEach(point => {
    slide5.addText(`✗ ${point}`, {
      x: 0.7,
      y: yPos,
      w: 3.5,
      h: 0.3,
      fontSize: 13,
      color: colors.text
    });
    yPos += 0.4;
  });
  // Future State
  slide5.addText('With Glocalization Module', {
    x: 5.5,
    y: 1.5,
    w: 4,
    h: 0.4,
    fontSize: 20,
    bold: true,
    color: colors.emerald
  });
  const futureStatePoints = [
    'AI-powered translation with 90%+ TM leverage',
    'Unified end-to-end platform',
    '4-8 week timelines per market',
    'Proactive cultural intelligence',
    'Built-in regulatory validation',
    'Complete audit trail and tracking'
  ];
  yPos = 2;
  futureStatePoints.forEach(point => {
    slide5.addText(`✓ ${point}`, {
      x: 5.7,
      y: yPos,
      w: 3.5,
      h: 0.3,
      fontSize: 13,
      color: colors.text
    });
    yPos += 0.4;
  });

  // ==================== SLIDES 6-11: PHASE CAPABILITY DEEP DIVES ====================
  phaseCompletions.slice(0, 6).forEach((phase, index) => {
    const slide = pptx.addSlide();
    slide.addText(`Phase ${phase.phase}: ${phase.name}`, {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.5,
      fontSize: 32,
      bold: true,
      color: colors.text
    });
    slide.addText(`${phase.completion}% Complete - ${phase.status.toUpperCase()}`, {
      x: 0.5,
      y: 0.8,
      w: 9,
      h: 0.3,
      fontSize: 16,
      color: colors.primary,
      bold: true
    });
    // Built Features
    slide.addText('✓ What\'s Already Built', {
      x: 0.5,
      y: 1.3,
      w: 4.5,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: colors.emerald
    });
    yPos = 1.8;
    phase.builtFeatures.forEach(feature => {
      slide.addText(`• ${feature}`, {
        x: 0.7,
        y: yPos,
        w: 4,
        h: 0.3,
        fontSize: 11,
        color: colors.text
      });
      yPos += 0.35;
    });
    // Needed Features
    slide.addText('→ What We\'ll Add for BI', {
      x: 5.5,
      y: 1.3,
      w: 4.5,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: colors.primary
    });
    yPos = 1.8;
    phase.neededFeatures.forEach(feature => {
      slide.addText(`• ${feature}`, {
        x: 5.7,
        y: yPos,
        w: 4,
        h: 0.3,
        fontSize: 11,
        color: colors.text
      });
      yPos += 0.35;
    });
    // Demo Evidence
    if (phase.demoEvidence) {
      slide.addText('Demo Proof Point', {
        x: 0.5,
        y: 5.2,
        w: 9,
        h: 0.3,
        fontSize: 14,
        bold: true,
        color: colors.text
      });
      slide.addText(`"${phase.demoEvidence}"`, {
        x: 0.5,
        y: 5.5,
        w: 9,
        h: 0.4,
        fontSize: 13,
        italic: true,
        color: colors.primary
      });
    }
  });

  // ==================== SLIDE 12: DEMO PROOF POINTS ====================
  const slide12 = pptx.addSlide();
  slide12.addText('Demo Proof Points', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 36,
    bold: true,
    color: colors.text
  });
  slide12.addText('What you already saw working', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.muted
  });
  yPos = 1.5;
  demoProofPoints.forEach(point => {
    slide12.addText(`✓ ${point.phase}`, {
      x: 0.7,
      y: yPos,
      w: 8.5,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: colors.primary
    });
    yPos += 0.35;
    slide12.addText(point.achievement, {
      x: 1,
      y: yPos,
      w: 8.2,
      h: 0.3,
      fontSize: 12,
      color: colors.text
    });
    yPos += 0.5;
  });

  // ==================== SLIDE 13: ROI CALCULATOR ====================
  const slide13 = pptx.addSlide();
  slide13.addText('Interactive ROI Calculator', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 36,
    bold: true,
    color: colors.text
  });
  slide13.addText('Prototype-Based vs Traditional Build', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.muted
  });
  // ROI Comparison Table
  const roiRows = [
    [
      { text: 'Metric', options: { bold: true, fontSize: 13 } },
      { text: 'Traditional Build', options: { bold: true, fontSize: 13 } },
      { text: 'Prototype-Based', options: { bold: true, fontSize: 13 } }
    ],
    [
      { text: 'Timeline', options: { fontSize: 12 } },
      { text: roiMetrics.traditional.timeline, options: { fontSize: 12 } },
      { text: roiMetrics.prototype.timeline, options: { fontSize: 12, color: colors.emerald, bold: true } }
    ],
    [
      { text: 'Implementation Cost', options: { fontSize: 12 } },
      { text: roiMetrics.traditional.cost, options: { fontSize: 12 } },
      { text: roiMetrics.prototype.cost, options: { fontSize: 12, color: colors.emerald, bold: true } }
    ],
    [
      { text: 'Team Size', options: { fontSize: 12 } },
      { text: roiMetrics.traditional.team, options: { fontSize: 12 } },
      { text: roiMetrics.prototype.team, options: { fontSize: 12, color: colors.emerald, bold: true } }
    ],
    [
      { text: 'Technical Risk', options: { fontSize: 12 } },
      { text: roiMetrics.traditional.risk, options: { fontSize: 12 } },
      { text: roiMetrics.prototype.risk, options: { fontSize: 12, color: colors.emerald, bold: true } }
    ],
    [
      { text: 'First Value', options: { fontSize: 12 } },
      { text: roiMetrics.traditional.firstValue, options: { fontSize: 12 } },
      { text: roiMetrics.prototype.firstValue, options: { fontSize: 12, color: colors.emerald, bold: true } }
    ],
    [
      { text: 'Year 1 Total Cost', options: { bold: true, fontSize: 12 } },
      { text: roiMetrics.traditional.year1Total, options: { bold: true, fontSize: 12 } },
      { text: roiMetrics.prototype.year1Total, options: { bold: true, fontSize: 12, color: colors.emerald } }
    ]
  ];
  slide13.addTable(roiRows, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 3,
    fontSize: 12,
    align: 'left',
    valign: 'middle',
    border: { pt: 1, color: colors.muted }
  });
  // Savings Summary
  slide13.addText(`Year 1 Savings: ${roiMetrics.savings.year1}`, {
    x: 1,
    y: 4.8,
    w: 8,
    h: 0.5,
    fontSize: 24,
    bold: true,
    color: colors.emerald,
    align: 'center'
  });
  slide13.addText(`Payback Period: ${roiMetrics.savings.payback}`, {
    x: 1,
    y: 5.4,
    w: 8,
    h: 0.4,
    fontSize: 18,
    color: colors.text,
    align: 'center'
  });

  // ==================== SLIDE 14: RISK MITIGATION ====================
  const slide14 = pptx.addSlide();
  slide14.addText('Risk Mitigation', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 36,
    bold: true,
    color: colors.text
  });
  slide14.addText('Why prototype = lower risk', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.muted
  });
  // Risk comparison table
  const riskRows = [
    [
      { text: 'Risk Category', options: { bold: true, fontSize: 13 } },
      { text: 'Traditional', options: { bold: true, fontSize: 13 } },
      { text: 'Prototype', options: { bold: true, fontSize: 13 } },
      { text: 'Mitigation', options: { bold: true, fontSize: 13 } }
    ],
    ...riskAssessments.map(risk => [
      { text: risk.category, options: { fontSize: 11 } },
      { text: risk.traditional.toUpperCase(), options: { fontSize: 11, color: colors.destructive, bold: true } },
      { text: risk.prototype.toUpperCase(), options: { fontSize: 11, color: colors.emerald, bold: true } },
      { text: risk.mitigation, options: { fontSize: 10 } }
    ])
  ];
  slide14.addTable(riskRows, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 4,
    fontSize: 11,
    align: 'left',
    valign: 'middle',
    border: { pt: 1, color: colors.muted }
  });

  // ==================== SLIDE 15: IMPLEMENTATION ROADMAP ====================
  const slide15 = pptx.addSlide();
  slide15.addText('16-Week Prototype-to-Production Roadmap', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: colors.text
  });
  slide15.addText('Clear path from contract to go-live', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.muted
  });
  yPos = 1.5;
  [
    { name: 'Foundation & Configuration', duration: 'Weeks 1-4', deliverables: ['BI system integration setup', 'TM database migration', 'Market and regulatory rule configuration', 'User provisioning'] },
    { name: 'BI-Specific Feature Build', duration: 'Weeks 5-8', deliverables: ['Veeva Vault integration', 'Respiratory terminology model training', 'Custom workflow implementations', '2 pilot projects completed'] },
    { name: 'Integration & Testing', duration: 'Weeks 9-12', deliverables: ['Full system integration testing', 'UAT with BI teams', 'Performance optimization', 'Production-ready platform'] },
    { name: 'Training & Go-Live', duration: 'Weeks 13-16', deliverables: ['User training (50 users)', 'Production deployment', 'Support handover', 'Live platform + documentation'] }
  ].forEach((phase, index) => {
    slide15.addText(`${phase.name} (${phase.duration})`, {
      x: 0.7,
      y: yPos,
      w: 8.5,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: colors.primary
    });
    yPos += 0.4;
    phase.deliverables.forEach(deliverable => {
      slide15.addText(`• ${deliverable}`, {
        x: 1,
        y: yPos,
        w: 8.2,
        h: 0.25,
        fontSize: 11,
        color: colors.text
      });
      yPos += 0.3;
    });
    yPos += 0.3;
  });

  // ==================== SLIDE 16: NEXT STEPS ====================
  const slide16 = pptx.addSlide();
  slide16.addText('Next Steps - Let\'s Get Started', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 36,
    bold: true,
    color: colors.text
  });
  slide16.addText('Your path to success', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.muted
  });
  slide16.addText('Target: 16 Weeks from Today → Full Production Go-Live 🚀', {
    x: 1,
    y: 1.5,
    w: 8,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: colors.emerald,
    align: 'center'
  });
  // Action Timeline
  yPos = 2.3;
  [
    { title: 'This Week', items: ['Proposal review', 'Q&A session', 'Internal BI stakeholder alignment'] },
    { title: 'Week 1-2: Contract & Kickoff', items: ['Contract finalization', 'Purchase order', '2-day kickoff workshop'] },
    { title: 'Week 3: Project Launch', items: ['Technical discovery', 'System access provisioning', 'First pilot project selection'] }
  ].forEach(section => {
    slide16.addText(section.title, {
      x: 1,
      y: yPos,
      w: 8,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: colors.primary
    });
    yPos += 0.35;
    section.items.forEach(item => {
      slide16.addText(`✓ ${item}`, {
        x: 1.3,
        y: yPos,
        w: 7.5,
        h: 0.25,
        fontSize: 11,
        color: colors.text
      });
      yPos += 0.3;
    });
    yPos += 0.2;
  });
  // Client Dependencies
  slide16.addText('What We Need from BI', {
    x: 0.5,
    y: 4.8,
    w: 9,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: colors.text
  });
  yPos = 5.2;
  clientDependencies.forEach(dep => {
    slide16.addText(`${dep.category}:`, {
      x: 0.7,
      y: yPos,
      w: 3,
      h: 0.2,
      fontSize: 10,
      bold: true,
      color: colors.primary
    });
    yPos += 0.25;
    dep.items.slice(0, 2).forEach(item => {
      slide16.addText(`• ${item}`, {
        x: 0.9,
        y: yPos,
        w: 2.8,
        h: 0.2,
        fontSize: 8,
        color: colors.text
      });
      yPos += 0.22;
    });
    yPos = 5.2;
  });

  // Generate filename with current date
  const date = new Date().toISOString().split('T')[0];
  const filename = `BI_Glocalization_Proposal_${date}.pptx`;

  // Save the presentation
  await pptx.writeFile({ fileName: filename });
  return filename;
};

export const exportToPDF = () => {
  window.print();
};

export const exportToExcel = () => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // ==================== SHEET 1: EXECUTIVE SUMMARY ====================
  const summaryData = [
    ['BOEHRINGER INGELHEIM GLOCALIZATION MODULE PROPOSAL'],
    ['Generated:', new Date().toLocaleDateString()],
    [],
    ['EXECUTIVE SUMMARY'],
    [],
    ['Metric', 'Value'],
    ['Total Functionality Complete', `${prototypeStats.functionalityComplete}%`],
    ['Operational Phases', prototypeStats.phasesOperational],
    ['Languages Supported', prototypeStats.languagesSupported],
    ['Markets Configured', prototypeStats.marketsConfigured],
    ['AI Engine', prototypeStats.aiIntegrated],
    ['Production Readiness', prototypeStats.productionReady],
    [],
    ['KEY TIMELINE COMPARISON'],
    ['Approach', 'Timeline', 'First Value'],
    ['Traditional Build', '12-18 months', 'Month 6-8'],
    ['Prototype-Based', '16-20 weeks', 'Week 8'],
    [],
    ['KEY SAVINGS'],
    ['Year 1 Savings', roiMetrics.savings.year1],
    ['Year 2+ Annual Savings', roiMetrics.savings.year2Plus],
    ['Payback Period', roiMetrics.savings.payback]
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  // Set column widths
  summarySheet['!cols'] = [
    { wch: 40 },
    { wch: 30 }
  ];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');

  // ==================== SHEET 2: PHASE COMPLETIONS ====================
  const phaseData = [
    ['PHASE COMPLETION DASHBOARD'],
    [],
    ['Phase', 'Name', 'Completion %', 'Status', 'Demo Evidence'],
    ...phaseCompletions.map(phase => [
      `Phase ${phase.phase}`,
      phase.name,
      phase.completion,
      phase.status.toUpperCase(),
      phase.demoEvidence || 'N/A'
    ]),
    [],
    ['BUILT FEATURES BY PHASE'],
    []
  ];
  // Add built features for each phase
  phaseCompletions.forEach(phase => {
    phaseData.push([`Phase ${phase.phase}: ${phase.name}`, 'BUILT FEATURES']);
    phase.builtFeatures.forEach(feature => {
      phaseData.push(['', feature]);
    });
    phaseData.push(['', 'NEEDED FOR BI']);
    phase.neededFeatures.forEach(feature => {
      phaseData.push(['', feature]);
    });
    phaseData.push([]);
  });
  const phaseSheet = XLSX.utils.aoa_to_sheet(phaseData);
  phaseSheet['!cols'] = [
    { wch: 15 },
    { wch: 50 },
    { wch: 15 },
    { wch: 20 },
    { wch: 50 }
  ];
  XLSX.utils.book_append_sheet(workbook, phaseSheet, 'Phase Completions');

  // ==================== SHEET 3: TIMELINE COMPARISON ====================
  const timelineData = [
    ['TIMELINE COMPARISON'],
    [],
    ['TRADITIONAL GROUND-UP BUILD (12-18 MONTHS)'],
    ['Phase', 'Duration', 'Deliverables'],
    ...timelineComparison.traditional.map(phase => [
      phase.name,
      phase.duration,
      phase.deliverables.join('; ')
    ]),
    [],
    ['Total Timeline:', '12-18 months', 'First Value: Month 6-8'],
    ['Estimated Cost:', roiMetrics.traditional.cost, 'Year 1 Total: ' + roiMetrics.traditional.year1Total],
    [],
    [],
    ['PROTOTYPE-BASED APPROACH (16-20 WEEKS)'],
    ['Phase', 'Duration', 'Start Week', 'Deliverables'],
    ...timelineComparison.prototype.map(phase => [
      phase.name,
      phase.duration,
      phase.startWeek || 'N/A',
      phase.deliverables.join('; ')
    ]),
    [],
    ['Total Timeline:', '16-20 weeks', 'First Value: Week 8'],
    ['Estimated Cost:', roiMetrics.prototype.cost, 'Year 1 Total: ' + roiMetrics.prototype.year1Total],
    [],
    [],
    ['COMPARISON SUMMARY'],
    ['Metric', 'Traditional', 'Prototype', 'Advantage'],
    ['Time to Market', '12-18 months', '16-20 weeks', '70% faster'],
    ['Implementation Cost', roiMetrics.traditional.cost, roiMetrics.prototype.cost, roiMetrics.savings.year1 + ' saved'],
    ['Technical Risk', roiMetrics.traditional.risk, roiMetrics.prototype.risk, 'Already proven in demo'],
    ['Team Size', roiMetrics.traditional.team, roiMetrics.prototype.team, 'Smaller, focused team']
  ];
  const timelineSheet = XLSX.utils.aoa_to_sheet(timelineData);
  timelineSheet['!cols'] = [
    { wch: 30 },
    { wch: 20 },
    { wch: 15 },
    { wch: 60 }
  ];
  XLSX.utils.book_append_sheet(workbook, timelineSheet, 'Timeline Comparison');

  // ==================== SHEET 4: ROI ANALYSIS ====================
  const roiData = [
    ['ROI ANALYSIS & FINANCIAL COMPARISON'],
    [],
    ['DETAILED COST COMPARISON'],
    ['Metric', 'Traditional Ground-Up Build', 'Prototype-Based Approach', 'Difference'],
    ['Timeline', roiMetrics.traditional.timeline, roiMetrics.prototype.timeline, '70% faster'],
    ['Implementation Cost', roiMetrics.traditional.cost, roiMetrics.prototype.cost, roiMetrics.savings.year1],
    ['Team Size Required', roiMetrics.traditional.team, roiMetrics.prototype.team, '40-50% smaller team'],
    ['Technical Risk Level', roiMetrics.traditional.risk, roiMetrics.prototype.risk, 'Already proven'],
    ['Time to First Value', roiMetrics.traditional.firstValue, roiMetrics.prototype.firstValue, '85% faster'],
    ['Year 1 Total Cost', roiMetrics.traditional.year1Total, roiMetrics.prototype.year1Total, roiMetrics.savings.year1],
    [],
    ['SAVINGS SUMMARY'],
    ['Category', 'Amount', 'Notes'],
    ['Year 1 Savings', roiMetrics.savings.year1, 'Implementation + operational savings'],
    ['Year 2+ Annual Savings', roiMetrics.savings.year2Plus, 'Ongoing operational efficiency'],
    ['Payback Period', roiMetrics.savings.payback, 'Based on implementation cost'],
    [],
    ['COST CALCULATION ASSUMPTIONS'],
    ['Category', 'Traditional', 'Prototype'],
    ['Development Team', '12-15 FTE × 12-18 months', '6-8 FTE × 4 months'],
    ['Infrastructure', 'Ground-up build + hosting', 'Pre-built platform + hosting'],
    ['Testing & QA', '2 months dedicated QA', 'Continuous testing built-in'],
    ['Training', 'Extensive new system training', 'Faster adoption (saw demo)'],
    ['Maintenance Year 1', 'Bug fixes + stabilization', 'Enhancements + features'],
    [],
    ['3-YEAR ROI PROJECTION'],
    ['Year', 'Traditional Cost', 'Prototype Cost', 'Savings'],
    ['Year 1', roiMetrics.traditional.year1Total, roiMetrics.prototype.year1Total, roiMetrics.savings.year1],
    ['Year 2', '$900K', '$450K', roiMetrics.savings.year2Plus],
    ['Year 3', '$900K', '$450K', roiMetrics.savings.year2Plus],
    ['Total 3-Year', '$3.3M - $4.0M', '$1.94M', '$1.36M - $2.06M']
  ];
  const roiSheet = XLSX.utils.aoa_to_sheet(roiData);
  roiSheet['!cols'] = [
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 }
  ];
  XLSX.utils.book_append_sheet(workbook, roiSheet, 'ROI Analysis');

  // ==================== SHEET 5: RISK ASSESSMENT ====================
  const riskData = [
    ['RISK MITIGATION MATRIX'],
    [],
    ['Risk Category', 'Traditional Build Risk', 'Prototype-Based Risk', 'Mitigation Strategy'],
    ...riskAssessments.map(risk => [
      risk.category,
      risk.traditional.toUpperCase(),
      risk.prototype.toUpperCase(),
      risk.mitigation
    ]),
    [],
    ['RISK SCORING'],
    ['HIGH = Significant concern requiring mitigation'],
    ['MEDIUM = Manageable with standard processes'],
    ['LOW = Minimal concern, already mitigated'],
    [],
    ['WHY PROTOTYPE = LOWER RISK'],
    ['Factor', 'Explanation'],
    ['Proven Technology', 'Already demonstrated in live demo with real BI content'],
    ['Clear Scope', '60% complete = predictable remaining work'],
    ['Stakeholder Buy-In', 'BI team saw it working = reduced adoption risk'],
    ['Known Architecture', 'Technical decisions already made and validated'],
    ['Tested Integrations', 'API patterns proven with similar systems'],
    ['Production-Grade', 'Not a proof-of-concept, real production infrastructure']
  ];
  const riskSheet = XLSX.utils.aoa_to_sheet(riskData);
  riskSheet['!cols'] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 60 }
  ];
  XLSX.utils.book_append_sheet(workbook, riskSheet, 'Risk Assessment');

  // ==================== SHEET 6: DEMO PROOF POINTS ====================
  const demoData = [
    ['DEMO PROOF POINTS'],
    ['What Boehringer Ingelheim Already Saw Working'],
    [],
    ['Phase', 'Achievement', 'Status', 'Significance'],
    ...demoProofPoints.map(point => [
      point.phase,
      point.achievement,
      point.status.toUpperCase(),
      'Validated in live demonstration'
    ]),
    [],
    ['DEMO SCENARIO DETAILS'],
    [],
    ['Content Used', 'IPF patient brochure (real BI therapeutic area)'],
    ['Target Market', 'German market (major BI market)'],
    ['Language Pair', 'English → German'],
    ['TM Leverage Achieved', '92% (industry standard: 60-70%)'],
    ['Cultural Score', '87/100 for German market'],
    ['Regulatory Warnings', '3 FDA issues flagged proactively'],
    ['Final Quality Score', '91/100'],
    ['Export Format', 'Veeva Vault-ready package'],
    [],
    ['STAKEHOLDER FEEDBACK'],
    ['Category', 'Response'],
    ['Translation Quality', 'Impressed with AI translation accuracy'],
    ['Cultural Intelligence', 'Novel capability not seen elsewhere'],
    ['Regulatory Validation', 'Critical for pharmaceutical content'],
    ['User Interface', 'Intuitive workflow, easy to understand'],
    ['Overall Reaction', 'Strong interest in full implementation']
  ];
  const demoSheet = XLSX.utils.aoa_to_sheet(demoData);
  demoSheet['!cols'] = [
    { wch: 20 },
    { wch: 50 },
    { wch: 15 },
    { wch: 35 }
  ];
  XLSX.utils.book_append_sheet(workbook, demoSheet, 'Demo Proof Points');

  // ==================== SHEET 7: IMPLEMENTATION ROADMAP ====================
  const roadmapData = [
    ['16-WEEK IMPLEMENTATION ROADMAP'],
    [],
    ['Phase', 'Duration', 'Key Deliverables'],
    ...implementationRoadmap.map(phase => [
      phase.name,
      phase.duration,
      phase.deliverables.join('; ')
    ]),
    [],
    ['WEEK-BY-WEEK MILESTONES'],
    [],
    ['Week 1', 'Kickoff workshop, requirements finalization, technical discovery'],
    ['Week 2', 'System access provisioning, TM database migration begins'],
    ['Week 3', 'Market configuration, regulatory rules setup'],
    ['Week 4', 'User provisioning, first pilot project selection'],
    ['Week 5', 'Veeva Vault integration development begins'],
    ['Week 6', 'Terminology model training with respiratory content'],
    ['Week 7', 'Custom workflow implementations'],
    ['Week 8', 'First pilot project completed, initial UAT'],
    ['Week 9', 'Second pilot project, integration testing'],
    ['Week 10', 'Full system integration testing'],
    ['Week 11', 'Performance optimization, bug fixes'],
    ['Week 12', 'UAT sign-off, production readiness review'],
    ['Week 13', 'User training begins (cohort 1)'],
    ['Week 14', 'User training continues (cohort 2)'],
    ['Week 15', 'Production deployment, final testing'],
    ['Week 16', 'Go-live, support handover, success metrics baseline'],
    [],
    ['CRITICAL SUCCESS FACTORS'],
    ['Factor', 'Owner', 'Required Action'],
    ['Executive Sponsorship', 'BI Leadership', 'Phase gate approvals, resource commitment'],
    ['SME Availability', 'BI Teams', '20-50% time commitment from key stakeholders'],
    ['Data Access', 'BI IT', 'TM exports, glossaries, system credentials'],
    ['System Integration', 'BI IT + Vendor', 'API access, technical collaboration'],
    ['Change Management', 'BI + Vendor', 'Training, communication, adoption support']
  ];
  const roadmapSheet = XLSX.utils.aoa_to_sheet(roadmapData);
  roadmapSheet['!cols'] = [
    { wch: 30 },
    { wch: 20 },
    { wch: 70 }
  ];
  XLSX.utils.book_append_sheet(workbook, roadmapSheet, 'Implementation Roadmap');

  // ==================== SHEET 8: CLIENT DEPENDENCIES ====================
  const dependenciesData = [
    ['CLIENT DEPENDENCIES - WHAT WE NEED FROM BOEHRINGER INGELHEIM'],
    [],
    ['Category', 'Item', 'Required By', 'Critical?'],
    ...clientDependencies.flatMap(dep =>
      dep.items.map((item, index) => [
        index === 0 ? dep.category : '',
        item,
        'Week 1-4',
        'YES'
      ])
    ),
    [],
    ['DETAILED REQUIREMENTS'],
    [],
    ['STAKEHOLDER AVAILABILITY'],
    ['Role', 'Time Commitment', 'Duration', 'Activities'],
    ['Regulatory SMEs', '20-30%', 'Weeks 1-8', 'Rule validation, compliance review, market-specific guidance'],
    ['Translation Team Lead', '50% then 20%', 'Weeks 1-4 intensive, ongoing', 'TM review, workflow design, quality criteria'],
    ['IT Integration Team', 'On-demand', 'Weeks 1-12', 'API access, credentials, technical support'],
    ['Executive Sponsor', 'Phase gates', 'Throughout', 'Approvals, resource decisions, escalation'],
    ['Content Owners', '10-20%', 'Weeks 1-16', 'Pilot project selection, UAT participation'],
    [],
    ['DATA & ASSETS REQUIRED'],
    ['Item', 'Format', 'Deadline', 'Notes'],
    ['Translation Memory', 'TMX, XLIFF, or CSV', 'Week 2', 'All language pairs, last 3 years preferred'],
    ['Glossaries', 'Excel or TMX', 'Week 2', 'Medical, brand, regulatory terms'],
    ['Sample Assets', 'Native formats', 'Week 1', '5-10 per content type for testing'],
    ['Regulatory Docs', 'PDF or Word', 'Week 3', 'By market (FDA, EMA, PMDA, NMPA)'],
    ['Brand Guidelines', 'PDF', 'Week 2', 'Respiratory/ILD specific if available'],
    [],
    ['SYSTEM ACCESS REQUIRED'],
    ['System', 'Access Type', 'Deadline', 'Purpose'],
    ['Veeva Vault', 'API credentials (read/write)', 'Week 3', 'Content handoff integration'],
    ['DAM System', 'API or FTP access', 'Week 4', 'Asset retrieval and storage'],
    ['SharePoint', 'Service account credentials', 'Week 4', 'Document collaboration'],
    ['SSO/Identity Provider', 'Configuration details', 'Week 2', 'User authentication'],
    ['Network/Firewall', 'IP whitelisting', 'Week 1', 'Secure communication']
  ];
  const dependenciesSheet = XLSX.utils.aoa_to_sheet(dependenciesData);
  dependenciesSheet['!cols'] = [
    { wch: 30 },
    { wch: 40 },
    { wch: 20 },
    { wch: 50 }
  ];
  XLSX.utils.book_append_sheet(workbook, dependenciesSheet, 'Client Dependencies');

  // Generate filename with current date
  const dateXlsx = new Date().toISOString().split('T')[0];
  const filenameXlsx = `BI_Glocalization_Proposal_${dateXlsx}.xlsx`;

  // Write the workbook to a file
  XLSX.writeFile(workbook, filenameXlsx);
  return filenameXlsx;
};
