
import pptxgen from "pptxgenjs";

export const generateUCBRFPResponsePresentation = () => {
  const pptx = new pptxgen();

  // Define color scheme - Professional blues for pharma
  const colors = {
    primary: "0F4C81", // Deep blue
    secondary: "2E86AB", // Medium blue
    accent: "A23B72", // Purple accent
    light: "F18F01", // Orange accent
    gray: "6C757D",
    lightGray: "E9ECEF",
    white: "FFFFFF",
    black: "2C3E50"
  };

  // Configure master slide
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Content Intelligence Platform";
  pptx.title = "UCB RFP Response - Content Operations Platform";
  pptx.subject = "Strategic Response to Content Operations RFI";

  // ============================================================================
  // SECTION 1: EXECUTIVE POSITIONING (Slides 1-5)
  // ============================================================================
  // Slide 1: Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: colors.primary };
  slide1.addText("Content Operations Platform", {
    x: 0.5,
    y: 2.0,
    w: "90%",
    h: 1.5,
    fontSize: 48,
    bold: true,
    color: colors.white,
    align: "center"
  });
  slide1.addText("Strategic Response to UCB Content Operations RFI", {
    x: 0.5,
    y: 3.5,
    w: "90%",
    fontSize: 24,
    color: colors.white,
    align: "center"
  });
  slide1.addText("Innovation + Operations Partnership for Pharmaceutical Content Excellence", {
    x: 0.5,
    y: 4.5,
    w: "90%",
    fontSize: 18,
    color: colors.lightGray,
    align: "center",
    italic: true
  });
  slide1.addText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), {
    x: 0.5,
    y: 6.5,
    w: "90%",
    fontSize: 14,
    color: colors.lightGray,
    align: "center"
  });

  // Slide 2: Executive Summary - "Content at the Center"
  const slide2 = pptx.addSlide();
  slide2.addText("Executive Summary: Content at the Center", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide2.addText("Our Strategic Position", {
    x: 0.5,
    y: 1.2,
    fontSize: 20,
    bold: true,
    color: colors.secondary
  });
  slide2.addText([
    { text: "• ", options: { bullet: false } },
    { text: "Content Intelligence Platform", options: { bold: true, color: colors.primary } },
    { text: " that places content operations at the heart of pharmaceutical marketing" }
  ], {
    x: 0.7,
    y: 1.7,
    w: "85%",
    fontSize: 16,
    bullet: false
  });
  slide2.addText([
    { text: "• We ", options: { bullet: false } },
    { text: "enable", options: { bold: true, color: colors.accent } },
    { text: " your existing omnichannel, field force, and market access systems—we don't replace them" }
  ], {
    x: 0.7,
    y: 2.2,
    w: "85%",
    fontSize: 16,
    bullet: false
  });
  slide2.addText([
    { text: "• Both your ", options: { bullet: false } },
    { text: "innovation partner", options: { bold: true, color: colors.primary } },
    { text: " (AI-accelerated MLR) and ", options: {} },
    { text: "operations partner", options: { bold: true, color: colors.primary } },
    { text: " (end-to-end workflow)" }
  ], {
    x: 0.7,
    y: 2.7,
    w: "85%",
    fontSize: 16,
    bullet: false
  });
  slide2.addText([
    { text: "• Built with ", options: { bullet: false } },
    { text: "open APIs", options: { bold: true } },
    { text: "—ready to connect to systems you already use or will adopt" }
  ], {
    x: 0.7,
    y: 3.2,
    w: "85%",
    fontSize: 16,
    bullet: false
  });
  // Add key differentiators box
  slide2.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 4.0,
    w: 12.0,
    h: 2.3,
    fill: { color: colors.lightGray }
  });
  slide2.addText("Key Differentiators", {
    x: 0.7,
    y: 4.2,
    fontSize: 18,
    bold: true,
    color: colors.primary
  });
  const differentiators = [
    "AI-Powered MLR Acceleration (30-40% cycle time reduction)",
    "Modular Content Architecture (centralized governance, local adaptation)",
    "Glocalization Factory (15+ languages, cultural intelligence)",
    "Content Performance Analytics (operational + predictive insights)"
  ];
  differentiators.forEach((diff, idx) => {
    slide2.addText(`${idx + 1}. ${diff}`, {
      x: 1.0,
      y: 4.7 + (idx * 0.35),
      w: "85%",
      fontSize: 14,
      color: colors.black
    });
  });

  // Slide 3: Your Position - Innovation + Operations Partner
  const slide3 = pptx.addSlide();
  slide3.addText("Innovation + Operations Partner", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  // Create two columns
  slide3.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 1.3,
    w: 5.8,
    h: 4.8,
    fill: { color: colors.secondary },
    line: { color: colors.primary, width: 2 }
  });
  slide3.addText("INNOVATION PARTNER", {
    x: 0.7,
    y: 1.5,
    w: 5.4,
    fontSize: 20,
    bold: true,
    color: colors.white
  });
  const innovations = [
    "AI-accelerated MLR validation",
    "Real-time content analysis",
    "Performance prediction models",
    "Cultural adaptation intelligence",
    "Claims validation framework",
    "MLR Memory (learns from reviews)",
    "First-pass approval optimization"
  ];
  innovations.forEach((item, idx) => {
    slide3.addText(`✓ ${item}`, {
      x: 1.0,
      y: 2.1 + (idx * 0.45),
      w: 5.0,
      fontSize: 14,
      color: colors.white
    });
  });
  slide3.addShape(pptx.ShapeType.rect, {
    x: 6.7,
    y: 1.3,
    w: 5.8,
    h: 4.8,
    fill: { color: colors.accent },
    line: { color: colors.primary, width: 2 }
  });
  slide3.addText("OPERATIONS PARTNER", {
    x: 6.9,
    y: 1.5,
    w: 5.4,
    fontSize: 20,
    bold: true,
    color: colors.white
  });
  const operations = [
    "End-to-end content workflow",
    "Intake → Strategy → Creation",
    "Pre-MLR validation → Glocalization",
    "Workflow orchestration",
    "Status tracking & governance",
    "Audit trails & compliance",
    "Team training & enablement"
  ];
  operations.forEach((item, idx) => {
    slide3.addText(`✓ ${item}`, {
      x: 7.2,
      y: 2.1 + (idx * 0.45),
      w: 5.0,
      fontSize: 14,
      color: colors.white
    });
  });

  // Slide 4: Strategic Alignment with UCB's Vision
  const slide4 = pptx.addSlide();
  slide4.addText("Strategic Alignment with UCB's Vision", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  // UCB's Current State
  slide4.addText("UCB's Current State (Based on Your Responses)", {
    x: 0.5,
    y: 1.3,
    fontSize: 18,
    bold: true,
    color: colors.secondary
  });
  const ucbState = [
    { label: "Modular Content Journey", value: "1 year in, evolving process" },
    { label: "Organizational Model", value: "Decentralized → Centralization roadmap" },
    { label: "DAM Strategy", value: "Moving toward centralization" },
    { label: "Workflow Tools", value: "Fragmented, planning CRM integration" },
    { label: "Key Priorities", value: "Compliance first, need speed & adaptability" }
  ];
  ucbState.forEach((item, idx) => {
    slide4.addText(item.label + ":", {
      x: 1.0,
      y: 2.0 + (idx * 0.5),
      w: 4.0,
      fontSize: 14,
      bold: true,
      color: colors.black
    });
    slide4.addText(item.value, {
      x: 5.2,
      y: 2.0 + (idx * 0.5),
      w: 6.5,
      fontSize: 14,
      color: colors.gray
    });
  });
  // How We Align
  slide4.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 4.8,
    w: 12.0,
    h: 1.8,
    fill: { color: colors.lightGray }
  });
  slide4.addText("How Our Platform Supports Your Journey", {
    x: 0.7,
    y: 5.0,
    fontSize: 16,
    bold: true,
    color: colors.primary
  });
  slide4.addText("✓ Purpose-built for centralization transition ✓ Compliance-first with AI acceleration ✓ Unified workflow to eliminate fragmentation ✓ API-ready for CRM/DAM integration", {
    x: 0.7,
    y: 5.5,
    w: 11.5,
    fontSize: 13,
    color: colors.black
  });

  // Slide 5: What Makes This Different
  const slide5 = pptx.addSlide();
  slide5.addText("What Makes This Different", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  const comparisonData = [
    [
      { text: "Capability" },
      { text: "Traditional DAM/CMS" },
      { text: "Translation Services" },
      { text: "Our Platform" }
    ],
    [
      { text: "Content Intelligence" },
      { text: "Storage only" },
      { text: "N/A" },
      { text: "AI-powered analysis & optimization" }
    ],
    [
      { text: "MLR Acceleration" },
      { text: "Post-creation only" },
      { text: "N/A" },
      { text: "Pre-validation + AI assistance" }
    ],
    [
      { text: "Modular Content" },
      { text: "Basic tagging" },
      { text: "N/A" },
      { text: "Full taxonomy + reusability tracking" }
    ],
    [
      { text: "Glocalization" },
      { text: "N/A" },
      { text: "Translation only" },
      { text: "Translation + cultural adaptation" }
    ],
    [
      { text: "Workflow Orchestration" },
      { text: "Limited" },
      { text: "N/A" },
      { text: "End-to-end intake → deployment" }
    ],
    [
      { text: "System Integration" },
      { text: "Siloed" },
      { text: "Siloed" },
      { text: "Open API + connector framework" }
    ],
    [
      { text: "Performance Analytics" },
      { text: "Storage metrics" },
      { text: "N/A" },
      { text: "Operational + predictive insights" }
    ]
  ];
  slide5.addTable(comparisonData, {
    x: 0.5,
    y: 1.3,
    w: 12.0,
    h: 5.0,
    colW: [2.5, 2.8, 2.8, 3.9],
    rowH: 0.625,
    fill: { color: colors.white },
    border: { pt: 1, color: colors.gray },
    fontSize: 11,
    align: "left",
    valign: "middle",
    color: colors.black
  });
  // Style header row
  slide5.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 1.3,
    w: 12.0,
    h: 0.625,
    fill: { color: colors.primary }
  });

  // ============================================================================
  // SECTION 2: UCB'S CHALLENGES & OUR SOLUTION (Slides 6-10)
  // ============================================================================
  // Slide 6: UCB's Critical Pain Points
  const slide6 = pptx.addSlide();
  slide6.addText("UCB's Critical Pain Points", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide6.addText("Based on Your RFI Responses", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  const painPoints = [
    {
      title: "MLR Bottleneck",
      problem: "Long approval cycles, multiple rework iterations",
      impact: "Delayed time-to-market, missed opportunities"
    },
    {
      title: "Fragmented Workflows",
      problem: "No unified system for content management",
      impact: "Inefficiency, inconsistency, duplicate work"
    },
    {
      title: "Speed vs Compliance Trade-off",
      problem: "Compliance prioritized, but speed & adaptability lacking",
      impact: "Competitive disadvantage in fast-moving markets"
    },
    {
      title: "Limited Performance Measurement",
      problem: "Just beginning to measure content effectiveness",
      impact: "Can't optimize what you don't measure"
    }
  ];
  painPoints.forEach((point, idx) => {
    const yPos = 1.7 + (idx * 1.2);
    slide6.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: yPos,
      w: 12.0,
      h: 1.0,
      fill: { color: idx % 2 === 0 ? colors.lightGray : colors.white },
      line: { color: colors.gray, width: 1 }
    });
    slide6.addText(point.title, {
      x: 0.7,
      y: yPos + 0.1,
      w: 11.5,
      fontSize: 16,
      bold: true,
      color: colors.accent
    });
    slide6.addText(`Problem: ${point.problem}`, {
      x: 0.7,
      y: yPos + 0.4,
      w: 11.5,
      fontSize: 12,
      color: colors.black
    });
    slide6.addText(`Impact: ${point.impact}`, {
      x: 0.7,
      y: yPos + 0.65,
      w: 11.5,
      fontSize: 11,
      italic: true,
      color: colors.gray
    });
  });

  // Slide 7: Our Solution Framework
  const slide7 = pptx.addSlide();
  slide7.addText("Our Solution Framework", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  // Central platform circle
  slide7.addShape(pptx.ShapeType.ellipse, {
    x: 4.5,
    y: 2.5,
    w: 4.0,
    h: 2.0,
    fill: { color: colors.primary }
  });
  slide7.addText("Content Intelligence\nPlatform", {
    x: 4.5,
    y: 2.8,
    w: 4.0,
    h: 1.4,
    fontSize: 18,
    bold: true,
    color: colors.white,
    align: "center",
    valign: "middle"
  });
  // Four surrounding solution pillars
  const pillars = [
    { x: 1.0, y: 1.3, title: "AI-Powered\nMLR Acceleration", color: colors.secondary },
    { x: 9.5, y: 1.3, title: "Modular Content\nArchitecture", color: colors.accent },
    { x: 1.0, y: 4.7, title: "Glocalization\nFactory", color: colors.light },
    { x: 9.5, y: 4.7, title: "Workflow\nIntelligence", color: colors.secondary }
  ];
  pillars.forEach((pillar, idx) => {
    slide7.addShape(pptx.ShapeType.roundRect, {
      x: pillar.x,
      y: pillar.y,
      w: 2.5,
      h: 1.3,
      fill: { color: pillar.color }
    });
    slide7.addText(pillar.title, {
      x: pillar.x,
      y: pillar.y + 0.2,
      w: 2.5,
      h: 0.9,
      fontSize: 13,
      bold: true,
      color: colors.white,
      align: "center",
      valign: "middle"
    });
    // Connector lines to center
    slide7.addShape(pptx.ShapeType.line, {
      x: pillar.x + 1.25,
      y: pillar.y + (idx < 2 ? 1.3 : 0),
      w: idx % 2 === 0 ? 3.25 : -3.25,
      h: idx < 2 ? 1.2 : -1.2,
      line: { color: colors.gray, width: 2, dashType: "dash" }
    });
  });

  // Slide 8: Expected Outcomes & KPIs
  const slide8 = pptx.addSlide();
  slide8.addText("Expected Outcomes & KPIs", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  const outcomesData = [
    [
      { text: "Metric" },
      { text: "Baseline (Current)" },
      { text: "Target (Platform)" },
      { text: "Improvement" }
    ],
    [
      { text: "MLR Cycle Time" },
      { text: "6-8 weeks" },
      { text: "4-5 weeks" },
      { text: "30-40% reduction" }
    ],
    [
      { text: "First-Pass Approval Rate" },
      { text: "40-50%" },
      { text: "75-85%" },
      { text: "50%+ improvement" }
    ],
    [
      { text: "Rework Cycles" },
      { text: "3-4 iterations" },
      { text: "1-2 iterations" },
      { text: "50% reduction" }
    ],
    [
      { text: "Time-to-Market" },
      { text: "12-16 weeks" },
      { text: "8-10 weeks" },
      { text: "35% faster" }
    ],
    [
      { text: "Translation Memory Leverage" },
      { text: "20-30%" },
      { text: "60-70%" },
      { text: "3x efficiency" }
    ],
    [
      { text: "Content Reusability" },
      { text: "Limited tracking" },
      { text: "80%+ tagged/reusable" },
      { text: "Measurable ROI" }
    ],
    [
      { text: "Localization Cost per Asset" },
      { text: "$8K-12K" },
      { text: "$4K-6K" },
      { text: "50% savings" }
    ]
  ];
  slide8.addTable(outcomesData, {
    x: 0.5,
    y: 1.3,
    w: 12.0,
    h: 5.2,
    colW: [3.5, 2.5, 2.5, 3.5],
    rowH: 0.65,
    fill: { color: colors.white },
    border: { pt: 1, color: colors.gray },
    fontSize: 12,
    align: "center",
    valign: "middle",
    color: colors.black
  });

  // Slide 9: Pilot Success Metrics
  const slide9 = pptx.addSlide();
  slide9.addText("Pilot Success Metrics", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide9.addText("12-Week Pilot Measurement Framework", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  const metrics = [
    {
      category: "Efficiency Metrics",
      items: [
        "MLR cycle time (baseline vs. platform)",
        "Number of review cycles per asset",
        "Time spent on rework",
        "Total time-to-market reduction"
      ]
    },
    {
      category: "Quality Metrics",
      items: [
        "First-pass approval rate",
        "Compliance issue detection rate",
        "Content reusability score",
        "Translation memory leverage"
      ]
    },
    {
      category: "Adoption Metrics",
      items: [
        "User satisfaction scores",
        "Feature utilization rates",
        "Training completion rates",
        "System stability/uptime"
      ]
    }
  ];
  metrics.forEach((metric, idx) => {
    const xPos = 0.5 + (idx * 4.2);
    slide9.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 1.8,
      w: 3.8,
      h: 4.5,
      fill: { color: colors.lightGray },
      line: { color: colors.primary, width: 2 }
    });
    slide9.addText(metric.category, {
      x: xPos + 0.2,
      y: 2.0,
      w: 3.4,
      fontSize: 16,
      bold: true,
      color: colors.primary
    });
    metric.items.forEach((item, itemIdx) => {
      slide9.addText(`✓ ${item}`, {
        x: xPos + 0.3,
        y: 2.6 + (itemIdx * 0.6),
        w: 3.2,
        fontSize: 12,
        color: colors.black
      });
    });
  });

  // Slide 10: ROI Projection
  const slide10 = pptx.addSlide();
  slide10.addText("ROI Projection (Year 1)", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  // Create bar chart for ROI
  const chartData = [
    {
      name: "Cost Savings",
      labels: ["MLR Efficiency", "Translation Memory", "Rework Reduction", "Time-to-Market"],
      values: [450, 380, 220, 350]
    }
  ];
  slide10.addChart(pptx.ChartType.bar, chartData, {
    x: 0.5,
    y: 1.5,
    w: 7.5,
    h: 4.5,
    barDir: "col",
    chartColors: [colors.secondary],
    showValue: true,
    valAxisMaxVal: 500,
    catAxisLabelFontSize: 12,
    valAxisLabelFontSize: 12,
    showLegend: false,
    title: "Estimated Annual Savings by Category ($K)"
  });
  // Summary box
  slide10.addShape(pptx.ShapeType.rect, {
    x: 8.5,
    y: 1.5,
    w: 4.0,
    h: 4.5,
    fill: { color: colors.primary }
  });
  slide10.addText("Year 1 Summary", {
    x: 8.7,
    y: 1.8,
    w: 3.6,
    fontSize: 18,
    bold: true,
    color: colors.white
  });
  const roiSummary = [
    { label: "Total Savings", value: "$1.4M" },
    { label: "Platform Investment", value: "$350K" },
    { label: "Net Benefit", value: "$1.05M" },
    { label: "ROI", value: "300%" },
    { label: "Payback Period", value: "3-4 months" }
  ];
  roiSummary.forEach((item, idx) => {
    slide10.addText(item.label + ":", {
      x: 8.8,
      y: 2.5 + (idx * 0.6),
      w: 1.8,
      fontSize: 13,
      color: colors.white
    });
    slide10.addText(item.value, {
      x: 10.6,
      y: 2.5 + (idx * 0.6),
      w: 1.7,
      fontSize: 13,
      bold: true,
      color: colors.light,
      align: "right"
    });
  });

  // ============================================================================
  // SECTION 3: CORE CAPABILITIES (Slides 11-18)
  // ============================================================================
  // Slide 11: Platform Overview - MOCK Architecture
  const slide11 = pptx.addSlide();
  slide11.addText("Platform Overview - High-Level Architecture", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide11.addText("Conceptual Design (Implementation details proprietary)", {
    x: 0.5,
    y: 1.0,
    fontSize: 12,
    italic: true,
    color: colors.gray
  });
  // Top layer - User Interface
  slide11.addShape(pptx.ShapeType.rect, {
    x: 1.0,
    y: 1.5,
    w: 11.0,
    h: 0.8,
    fill: { color: colors.secondary }
  });
  slide11.addText("User Interface Layer - Role-Based Access", {
    x: 1.0,
    y: 1.65,
    w: 11.0,
    fontSize: 14,
    bold: true,
    color: colors.white,
    align: "center"
  });
  // Middle layer - Core Modules (5 boxes)
  const modules = [
    "Initiative\nHub",
    "Content\nStudio",
    "Pre-MLR\nEngine",
    "Glocalization\nFactory",
    "Analytics\nHub"
  ];
  modules.forEach((module, idx) => {
    slide11.addShape(pptx.ShapeType.rect, {
      x: 1.0 + (idx * 2.2),
      y: 2.7,
      w: 2.0,
      h: 1.2,
      fill: { color: colors.accent },
      line: { color: colors.primary, width: 2 }
    });
    slide11.addText(module, {
      x: 1.0 + (idx * 2.2),
      y: 2.95,
      w: 2.0,
      h: 0.7,
      fontSize: 11,
      bold: true,
      color: colors.white,
      align: "center",
      valign: "middle"
    });
  });
  // AI Intelligence Layer
  slide11.addShape(pptx.ShapeType.rect, {
    x: 1.0,
    y: 4.3,
    w: 11.0,
    h: 0.8,
    fill: { color: colors.light }
  });
  slide11.addText("AI Intelligence Layer - Analysis \n Prediction \n Optimization", {
    x: 1.0,
    y: 4.45,
    w: 11.0,
    fontSize: 13,
    bold: true,
    color: colors.white,
    align: "center"
  });
  // Data & Workflow Engine
  slide11.addShape(pptx.ShapeType.rect, {
    x: 1.0,
    y: 5.4,
    w: 5.3,
    h: 0.8,
    fill: { color: colors.gray }
  });
  slide11.addText("Workflow Orchestration Engine", {
    x: 1.0,
    y: 5.55,
    w: 5.3,
    fontSize: 12,
    bold: true,
    color: colors.white,
    align: "center"
  });
  slide11.addShape(pptx.ShapeType.rect, {
    x: 6.7,
    y: 5.4,
    w: 5.3,
    h: 0.8,
    fill: { color: colors.gray }
  });
  slide11.addText("Content Database & Analytics", {
    x: 6.7,
    y: 5.55,
    w: 5.3,
    fontSize: 12,
    bold: true,
    color: colors.white,
    align: "center"
  });
  // Integration Layer
  slide11.addShape(pptx.ShapeType.rect, {
    x: 1.0,
    y: 6.5,
    w: 11.0,
    h: 0.5,
    fill: { color: colors.primary },
    line: { color: colors.black, width: 1, dashType: "dash" }
  });
  slide11.addText("API Gateway & Integration Connectors", {
    x: 1.0,
    y: 6.6,
    w: 11.0,
    fontSize: 11,
    bold: true,
    color: colors.white,
    align: "center"
  });

  // Slide 12: Module 1 - Content Operations Hub
  const slide12 = pptx.addSlide();
  slide12.addText("Module 1: Content Operations Hub", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide12.addText("End-to-End Workflow: Intake → Strategy → Creation", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  const hubCapabilities = [
    {
      title: "Initiative Hub",
      features: [
        "Campaign/project intake management",
        "Strategic alignment tracking",
        "Resource allocation",
        "Timeline planning",
        "Stakeholder collaboration"
      ]
    },
    {
      title: "Strategy & Insights",
      features: [
        "Theme library with AI intelligence",
        "Competitive analysis integration",
        "Market intelligence synthesis",
        "Regulatory landscape monitoring",
        "Brand voice consistency"
      ]
    },
    {
      title: "Content Studio",
      features: [
        "Modular content creation",
        "Real-time AI analysis",
        "Template-based authoring",
        "Taxonomy auto-tagging",
        "Version control & collaboration"
      ]
    }
  ];
  hubCapabilities.forEach((cap, idx) => {
    const xPos = 0.5 + (idx * 4.2);
    slide12.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 1.8,
      w: 3.8,
      h: 4.5,
      fill: { color: idx === 1 ? colors.secondary : colors.accent },
      line: { color: colors.primary, width: 2 }
    });
    slide12.addText(cap.title, {
      x: xPos + 0.2,
      y: 2.0,
      w: 3.4,
      fontSize: 16,
      bold: true,
      color: colors.white
    });
    cap.features.forEach((feature, fIdx) => {
      slide12.addText(`• ${feature}`, {
        x: xPos + 0.3,
        y: 2.6 + (fIdx * 0.5),
        w: 3.2,
        fontSize: 11,
        color: colors.white
      });
    });
  });

  // Slide 13: Module 2 - Pre-MLR Intelligence Engine
  const slide13 = pptx.addSlide();
  slide13.addText("Module 2: Pre-MLR Intelligence Engine", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide13.addText("AI-Accelerated Compliance Validation", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  // Flow diagram
  const mlrSteps = [
    { label: "Content\nCreation", y: 2.0 },
    { label: "AI Pre-MLR\nAnalysis", y: 3.2 },
    { label: "Issue\nDetection", y: 4.4 },
    { label: "Human MLR\nReview", y: 5.6 }
  ];
  mlrSteps.forEach((step, idx) => {
    slide13.addShape(pptx.ShapeType.roundRect, {
      x: 1.5,
      y: step.y,
      w: 2.5,
      h: 0.8,
      fill: { color: idx === 1 ? colors.light : colors.secondary }
    });
    slide13.addText(step.label, {
      x: 1.5,
      y: step.y + 0.15,
      w: 2.5,
      h: 0.5,
      fontSize: 12,
      bold: true,
      color: colors.white,
      align: "center",
      valign: "middle"
    });
    if (idx < mlrSteps.length - 1) {
      slide13.addShape(pptx.ShapeType.line, {
        x: 2.75,
        y: step.y + 0.8,
        w: 0,
        h: 0.4,
        line: { color: colors.primary, width: 3, endArrowType: "arrow" }
      });
    }
  });
  // AI Capabilities box
  slide13.addShape(pptx.ShapeType.rect, {
    x: 5.0,
    y: 1.8,
    w: 7.0,
    h: 4.8,
    fill: { color: colors.lightGray },
    line: { color: colors.primary, width: 2 }
  });
  slide13.addText("AI-Powered Validation Capabilities", {
    x: 5.2,
    y: 2.0,
    fontSize: 16,
    bold: true,
    color: colors.primary
  });
  const aiCapabilities = [
    "Claims Validation - Verify against approved database",
    "Reference Checking - Ensure all claims cited properly",
    "Regulatory Compliance - Market-specific rule validation",
    "Label Alignment - Check consistency with product labeling",
    "Brand Voice Analysis - Tone, sentiment, terminology",
    "Medical Language Accuracy - Terminology verification",
    "Risk Scoring - Predict approval likelihood",
    "MLR Memory - Learn from past review feedback"
  ];
  aiCapabilities.forEach((cap, idx) => {
    slide13.addText(`✓ ${cap}`, {
      x: 5.3,
      y: 2.6 + (idx * 0.42),
      w: 6.5,
      fontSize: 11,
      color: colors.black
    });
  });

  // Slide 14: Module 3 - Glocalization Factory
  const slide14 = pptx.addSlide();
  slide14.addText("Module 3: Glocalization Factory", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide14.addText("Cultural Adaptation + Translation with Intelligence", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  // Left side - Process
  slide14.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 1.8,
    w: 5.5,
    h: 4.8,
    fill: { color: colors.secondary },
    line: { color: colors.primary, width: 2 }
  });
  slide14.addText("Glocalization Process", {
    x: 0.7,
    y: 2.0,
    w: 5.1,
    fontSize: 16,
    bold: true,
    color: colors.white
  });
  const glocProcess = [
    "1. Market Selection & Analysis",
    "2. Cultural Adaptation Rules",
    "3. Translation Memory Leverage",
    "4. AI-Powered Translation",
    "5. Regulatory Compliance Check",
    "6. Local Medical Review",
    "7. Quality Validation",
    "8. Deployment Package"
  ];
  glocProcess.forEach((step, idx) => {
    slide14.addText(step, {
      x: 0.8,
      y: 2.6 + (idx * 0.45),
      w: 4.9,
      fontSize: 12,
      color: colors.white
    });
  });
  // Right side - Capabilities
  slide14.addShape(pptx.ShapeType.rect, {
    x: 6.5,
    y: 1.8,
    w: 6.0,
    h: 4.8,
    fill: { color: colors.lightGray },
    line: { color: colors.primary, width: 2 }
  });
  slide14.addText("Key Capabilities", {
    x: 6.7,
    y: 2.0,
    fontSize: 16,
    bold: true,
    color: colors.primary
  });
  const glocCapabilities = [
    "15+ Language Support with medical terminology",
    "Cultural Intelligence - Imagery, colors, messaging",
    "Translation Memory - 60-70% leverage rate",
    "Market-Specific Regulations - Auto-compliance",
    "Medical Terminology Databases",
    "Context Preservation - Module relationships",
    "Cost Optimization - Reuse tracking",
    "Quality Scoring - Translation accuracy metrics"
  ];
  glocCapabilities.forEach((cap, idx) => {
    slide14.addText(`✓ ${cap}`, {
      x: 6.8,
      y: 2.6 + (idx * 0.47),
      w: 5.6,
      fontSize: 11,
      color: colors.black
    });
  });

  // Slide 15: Module 4 - Workflow Intelligence
  const slide15 = pptx.addSlide();
  slide15.addText("Module 4: Workflow Intelligence", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide15.addText("Orchestration, Tracking & Optimization", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  const workflowFeatures = [
    {
      category: "Status Tracking",
      items: ["Real-time project status", "Phase-level visibility", "Bottleneck identification", "Resource utilization"]
    },
    {
      category: "Approval Routing",
      items: ["Role-based workflows", "Parallel review paths", "Escalation rules", "Notification system"]
    },
    {
      category: "Version Control",
      items: ["Complete audit trail", "Change tracking", "Rollback capability", "Comparison views"]
    },
    {
      category: "Collaboration",
      items: ["Comments & feedback", "Task assignment", "Team workspaces", "Document sharing"]
    }
  ];
  workflowFeatures.forEach((feature, idx) => {
    const xPos = 0.5 + (idx % 2) * 6.2;
    const yPos = 1.8 + Math.floor(idx / 2) * 2.5;
    slide15.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: yPos,
      w: 5.8,
      h: 2.2,
      fill: { color: colors.lightGray },
      line: { color: colors.accent, width: 2 }
    });
    slide15.addText(feature.category, {
      x: xPos + 0.2,
      y: yPos + 0.2,
      w: 5.4,
      fontSize: 15,
      bold: true,
      color: colors.primary
    });
    feature.items.forEach((item, iIdx) => {
      slide15.addText(`• ${item}`, {
        x: xPos + 0.3,
        y: yPos + 0.7 + (iIdx * 0.35),
        w: 5.2,
        fontSize: 11,
        color: colors.black
      });
    });
  });

  // Slide 16: Module 5 - Analytics & Insights
  const slide16 = pptx.addSlide();
  slide16.addText("Module 5: Analytics & Insights", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide16.addText("Operational Metrics + Predictive Intelligence", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  // Dashboard mockup
  slide16.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 1.7,
    w: 12.0,
    h: 5.0,
    fill: { color: colors.white },
    line: { color: colors.gray, width: 2 }
  });
  // KPI cards
  const kpis = [
    { label: "Avg MLR Cycle", value: "4.2 weeks", trend: "↓ 35%" },
    { label: "First-Pass Rate", value: "78%", trend: "↑ 52%" },
    { label: "Assets in Flight", value: "127", trend: "→ 0%" },
    { label: "Translation Savings", value: "$42K", trend: "↑ 68%" }
  ];
  kpis.forEach((kpi, idx) => {
    const xPos = 1.0 + (idx * 2.8);
    slide16.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 2.0,
      w: 2.5,
      h: 1.2,
      fill: { color: colors.secondary }
    });
    slide16.addText(kpi.label, {
      x: xPos + 0.1,
      y: 2.1,
      w: 2.3,
      fontSize: 11,
      color: colors.white
    });
    slide16.addText(kpi.value, {
      x: xPos + 0.1,
      y: 2.5,
      w: 2.3,
      fontSize: 18,
      bold: true,
      color: colors.white
    });
    slide16.addText(kpi.trend, {
      x: xPos + 0.1,
      y: 2.9,
      w: 2.3,
      fontSize: 12,
      color: colors.light
    });
  });
  // Analytics categories
  const analyticsTypes = [
    "Creation Metrics: Time-to-market, bottlenecks, resource efficiency",
    "Quality Metrics: Compliance scores, rework rates, risk assessment",
    "Performance Metrics: Engagement prediction, reusability, ROI",
    "Predictive Analytics: MLR approval likelihood, market performance"
  ];
  analyticsTypes.forEach((type, idx) => {
    slide16.addText(`• ${type}`, {
      x: 1.0,
      y: 3.8 + (idx * 0.5),
      w: 10.5,
      fontSize: 12,
      color: colors.black
    });
  });

  // Slide 17: AI Capabilities Throughout
  const slide17 = pptx.addSlide();
  slide17.addText("AI Capabilities Throughout the Platform", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  // Central AI core
  slide17.addShape(pptx.ShapeType.ellipse, {
    x: 4.5,
    y: 2.5,
    w: 4.0,
    h: 2.5,
    fill: { color: colors.light }
  });
  slide17.addText("AI Intelligence\nEngine", {
    x: 4.5,
    y: 3.0,
    w: 4.0,
    h: 1.5,
    fontSize: 20,
    bold: true,
    color: colors.white,
    align: "center",
    valign: "middle"
  });
  // AI applications around the core
  const aiApps = [
    { x: 1.0, y: 1.5, text: "Content Analysis\n(Sentiment, Tone, Quality)" },
    { x: 9.5, y: 1.5, text: "Claims Validation\n(Reference Checking)" },
    { x: 1.0, y: 3.3, text: "Translation\n(Context-Aware)" },
    { x: 9.5, y: 3.3, text: "Cultural Adaptation\n(Market Intelligence)" },
    { x: 1.0, y: 5.1, text: "Performance Prediction\n(Engagement Scoring)" },
    { x: 9.5, y: 5.1, text: "MLR Memory\n(Learning System)" }
  ];
  aiApps.forEach((app) => {
    slide17.addShape(pptx.ShapeType.roundRect, {
      x: app.x,
      y: app.y,
      w: 2.8,
      h: 1.0,
      fill: { color: colors.secondary },
      line: { color: colors.primary, width: 1 }
    });
    slide17.addText(app.text, {
      x: app.x + 0.1,
      y: app.y + 0.2,
      w: 2.6,
      h: 0.6,
      fontSize: 10,
      bold: true,
      color: colors.white,
      align: "center",
      valign: "middle"
    });
  });

  // Slide 18: Modular Content Architecture
  const slide18 = pptx.addSlide();
  slide18.addText("Modular Content Architecture", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide18.addText("Centralized Governance + Decentralized Adaptation", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  // Architecture diagram
  slide18.addShape(pptx.ShapeType.rect, {
    x: 3.0,
    y: 1.8,
    w: 7.0,
    h: 1.0,
    fill: { color: colors.primary }
  });
  slide18.addText("Global Brand-Approved Themes", {
    x: 3.0,
    y: 2.05,
    w: 7.0,
    fontSize: 16,
    bold: true,
    color: colors.white,
    align: "center"
  });
  // Arrow down
  slide18.addShape(pptx.ShapeType.line, {
    x: 6.5,
    y: 2.8,
    w: 0,
    h: 0.5,
    line: { color: colors.primary, width: 4, endArrowType: "arrow" }
  });
  // Modular content blocks
  const blocks = ["Efficacy", "Safety", "Dosing", "MOA", "Patient Support"];
  blocks.forEach((block, idx) => {
    slide18.addShape(pptx.ShapeType.rect, {
      x: 1.5 + (idx * 2.0),
      y: 3.5,
      w: 1.8,
      h: 0.8,
      fill: { color: colors.accent }
    });
    slide18.addText(block, {
      x: 1.5 + (idx * 2.0),
      y: 3.7,
      w: 1.8,
      fontSize: 12,
      bold: true,
      color: colors.white,
      align: "center"
    });
  });
  // Arrows to localized versions
  slide18.addShape(pptx.ShapeType.line, {
    x: 6.5,
    y: 4.3,
    w: 0,
    h: 0.5,
    line: { color: colors.primary, width: 4, endArrowType: "arrow" }
  });
  // Localized adaptations
  slide18.addShape(pptx.ShapeType.rect, {
    x: 1.5,
    y: 5.0,
    w: 10.0,
    h: 1.5,
    fill: { color: colors.lightGray },
    line: { color: colors.secondary, width: 2 }
  });
  slide18.addText("Localized Market Adaptations", {
    x: 1.7,
    y: 5.2,
    fontSize: 14,
    bold: true,
    color: colors.primary
  });
  const markets = ["US English", "EU (DE, FR, ES)", "APAC (JP, CN)", "LATAM (BR, MX)", "MEA"];
  markets.forEach((market, idx) => {
    slide18.addText(`• ${market}`, {
      x: 1.9 + (idx * 2.0),
      y: 5.7,
      w: 1.8,
      fontSize: 11,
      color: colors.black
    });
  });
  // Metadata & tagging
  slide18.addText("Automated: Taxonomy Tagging \n Metadata Generation \n Reusability Tracking", {
    x: 0.5,
    y: 6.7,
    w: 12.0,
    fontSize: 11,
    italic: true,
    color: colors.gray,
    align: "center"
  });

  // ============================================================================
  // SECTION 4: INTEGRATION STRATEGY (Slides 19-23)
  // ============================================================================
  // Slide 19: Integration Philosophy
  const slide19 = pptx.addSlide();
  slide19.addText("Integration Philosophy: Connect, Don't Replace", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide19.addText("Your Platform Ecosystem", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  // Central platform
  slide19.addShape(pptx.ShapeType.ellipse, {
    x: 4.5,
    y: 2.8,
    w: 4.0,
    h: 2.2,
    fill: { color: colors.primary }
  });
  slide19.addText("Content\nIntelligence\nPlatform", {
    x: 4.5,
    y: 3.2,
    w: 4.0,
    h: 1.4,
    fontSize: 16,
    bold: true,
    color: colors.white,
    align: "center",
    valign: "middle"
  });
  // External systems
  const externalSystems = [
    { x: 1.0, y: 1.5, name: "Veeva Vault\n(DAM)", status: "ready" },
    { x: 10.2, y: 1.5, name: "Salesforce\n(CRM)", status: "ready" },
    { x: 1.0, y: 3.5, name: "Translation\nMemory", status: "ready" },
    { x: 10.2, y: 3.5, name: "Field Force\nTools", status: "ready" },
    { x: 1.0, y: 5.5, name: "Market Access\nSystems", status: "future" },
    { x: 10.2, y: 5.5, name: "BI/Analytics\nTools", status: "ready" }
  ];
  externalSystems.forEach((sys) => {
    const fillColor = sys.status === "ready" ? colors.secondary : colors.gray;
    slide19.addShape(pptx.ShapeType.roundRect, {
      x: sys.x,
      y: sys.y,
      w: 2.0,
      h: 1.0,
      fill: { color: fillColor },
      line: { color: colors.primary, width: 2 }
    });
    slide19.addText(sys.name, {
      x: sys.x + 0.1,
      y: sys.y + 0.25,
      w: 1.8,
      h: 0.5,
      fontSize: 11,
      bold: true,
      color: colors.white,
      align: "center",
      valign: "middle"
    });
    // Connector line to center
    const isLeft = sys.x < 6;
    slide19.addShape(pptx.ShapeType.line, {
      x: sys.x + (isLeft ? 2.0 : 0),
      y: sys.y + 0.5,
      w: isLeft ? 2.5 : -2.5,
      h: 2.9 - sys.y,
      line: {
        color: sys.status === "ready" ? colors.secondary : colors.gray,
        width: 2,
        dashType: sys.status === "ready" ? "solid" : "dash"
      }
    });
  });
  // Legend
  slide19.addText("● Ready to Connect ● Future Roadmap", {
    x: 4.0,
    y: 6.5,
    fontSize: 11,
    color: colors.gray
  });

  // Slide 20: MOCK Connector Architecture
  const slide20 = pptx.addSlide();
  slide20.addText("Connector Architecture (Conceptual)", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide20.addText("Generic Integration Framework - Implementation Details Proprietary", {
    x: 0.5,
    y: 1.0,
    fontSize: 12,
    italic: true,
    color: colors.gray
  });
  // API Gateway layer
  slide20.addShape(pptx.ShapeType.rect, {
    x: 1.0,
    y: 1.8,
    w: 11.0,
    h: 1.0,
    fill: { color: colors.primary }
  });
  slide20.addText("Secure API Gateway Layer", {
    x: 1.0,
    y: 2.05,
    w: 11.0,
    fontSize: 16,
    bold: true,
    color: colors.white,
    align: "center"
  });
  // Connector types
  const connectors = [
    { name: "DAM\nConnector", type: "Bidirectional", example: "Veeva Vault" },
    { name: "CRM\nConnector", type: "Push", example: "Salesforce" },
    { name: "TMS\nConnector", type: "Bidirectional", example: "Translation Memory" },
    { name: "Data Export\nConnector", type: "Pull", example: "BI Tools" }
  ];
  connectors.forEach((conn, idx) => {
    const xPos = 1.5 + (idx * 2.7);
    slide20.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 3.2,
      w: 2.3,
      h: 1.0,
      fill: { color: colors.secondary },
      line: { color: colors.primary, width: 2 }
    });
    slide20.addText(conn.name, {
      x: xPos + 0.1,
      y: 3.35,
      w: 2.1,
      fontSize: 12,
      bold: true,
      color: colors.white,
      align: "center"
    });
    // Connector details
    slide20.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 4.5,
      w: 2.3,
      h: 1.8,
      fill: { color: colors.lightGray },
      line: { color: colors.gray, width: 1 }
    });
    slide20.addText(`Type: ${conn.type}`, {
      x: xPos + 0.2,
      y: 4.7,
      w: 1.9,
      fontSize: 10,
      color: colors.black
    });
    slide20.addText(`Example:\n${conn.example}`, {
      x: xPos + 0.2,
      y: 5.1,
      w: 1.9,
      fontSize: 9,
      color: colors.gray
    });
    // Arrow from gateway
    slide20.addShape(pptx.ShapeType.line, {
      x: xPos + 1.15,
      y: 2.8,
      w: 0,
      h: 0.4,
      line: { color: colors.primary, width: 3, endArrowType: "arrow" }
    });
  });
  // Security features
  slide20.addText("Security: OAuth 2.0 \n API Keys \n Rate Limiting \n Audit Logging \n Data Encryption", {
    x: 0.5,
    y: 6.6,
    w: 12.0,
    fontSize: 11,
    bold: true,
    color: colors.primary,
    align: "center"
  });

  // Slide 21: Data Flow Examples (CONCEPTUAL)
  const slide21 = pptx.addSlide();
  slide21.addText("Data Flow Examples (Conceptual)", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  // Flow 1: Content Creation → MLR → DAM
  slide21.addText("Flow 1: Content Creation → MLR → DAM → Deployment", {
    x: 0.5,
    y: 1.3,
    fontSize: 14,
    bold: true,
    color: colors.secondary
  });
  const flow1Steps = ["Content Studio", "Pre-MLR AI", "Human MLR", "Veeva Vault", "CRM Deployment"];
  flow1Steps.forEach((step, idx) => {
    slide21.addShape(pptx.ShapeType.roundRect, {
      x: 0.8 + (idx * 2.3),
      y: 1.8,
      w: 2.0,
      h: 0.7,
      fill: { color: colors.accent }
    });
    slide21.addText(step, {
      x: 0.8 + (idx * 2.3),
      y: 1.95,
      w: 2.0,
      fontSize: 10,
      bold: true,
      color: colors.white,
      align: "center"
    });
    if (idx < flow1Steps.length - 1) {
      slide21.addShape(pptx.ShapeType.line, {
        x: 2.8 + (idx * 2.3),
        y: 2.15,
        w: 0.3,
        h: 0,
        line: { color: colors.primary, width: 3, endArrowType: "arrow" }
      });
    }
  });
  // Flow 2: Global → Glocalization → Market Deployment
  slide21.addText("Flow 2: Global Asset → Glocalization → Market Deployment", {
    x: 0.5,
    y: 3.2,
    fontSize: 14,
    bold: true,
    color: colors.secondary
  });
  const flow2Steps = ["Global Content", "Market Selection", "Translation + Culture", "Local MLR", "Market CRM"];
  flow2Steps.forEach((step, idx) => {
    slide21.addShape(pptx.ShapeType.roundRect, {
      x: 0.8 + (idx * 2.3),
      y: 3.7,
      w: 2.0,
      h: 0.7,
      fill: { color: colors.secondary }
    });
    slide21.addText(step, {
      x: 0.8 + (idx * 2.3),
      y: 3.85,
      w: 2.0,
      fontSize: 10,
      bold: true,
      color: colors.white,
      align: "center"
    });
    if (idx < flow2Steps.length - 1) {
      slide21.addShape(pptx.ShapeType.line, {
        x: 2.8 + (idx * 2.3),
        y: 4.05,
        w: 0.3,
        h: 0,
        line: { color: colors.primary, width: 3, endArrowType: "arrow" }
      });
    }
  });
  // Flow 3: Analytics → BI Tools
  slide21.addText("Flow 3: Platform Analytics → Your BI Tools", {
    x: 0.5,
    y: 5.1,
    fontSize: 14,
    bold: true,
    color: colors.secondary
  });
  const flow3Steps = ["Operational Data", "Performance Metrics", "API Export", "BI Integration", "Executive Dashboards"];
  flow3Steps.forEach((step, idx) => {
    slide21.addShape(pptx.ShapeType.roundRect, {
      x: 0.8 + (idx * 2.3),
      y: 5.6,
      w: 2.0,
      h: 0.7,
      fill: { color: colors.light }
    });
    slide21.addText(step, {
      x: 0.8 + (idx * 2.3),
      y: 5.75,
      w: 2.0,
      fontSize: 10,
      bold: true,
      color: colors.white,
      align: "center"
    });
    if (idx < flow3Steps.length - 1) {
      slide21.addShape(pptx.ShapeType.line, {
        x: 2.8 + (idx * 2.3),
        y: 5.95,
        w: 0.3,
        h: 0,
        line: { color: colors.primary, width: 3, endArrowType: "arrow" }
      });
    }
  });

  // Slide 22: API Strategy & Standards
  const slide22 = pptx.addSlide();
  slide22.addText("API Strategy & Standards", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  const apiStandards = [
    {
      category: "Protocol Standards",
      items: ["REST API (JSON)", "Webhooks for real-time events", "GraphQL for complex queries", "Batch operations support"]
    },
    {
      category: "Security",
      items: ["OAuth 2.0 authentication", "API key management", "Role-based access control", "Encrypted data transmission"]
    },
    {
      category: "Performance",
      items: ["Rate limiting & throttling", "Response caching", "Pagination support", "Async processing for large ops"]
    },
    {
      category: "Documentation",
      items: ["OpenAPI/Swagger specs", "Interactive API explorer", "Code samples (multiple languages)", "Versioning strategy"]
    }
  ];
  apiStandards.forEach((standard, idx) => {
    const xPos = 0.5 + (idx % 2) * 6.2;
    const yPos = 1.5 + Math.floor(idx / 2) * 2.7;
    slide22.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: yPos,
      w: 5.8,
      h: 2.3,
      fill: { color: colors.lightGray },
      line: { color: colors.secondary, width: 2 }
    });
    slide22.addText(standard.category, {
      x: xPos + 0.2,
      y: yPos + 0.2,
      w: 5.4,
      fontSize: 16,
      bold: true,
      color: colors.primary
    });
    standard.items.forEach((item, iIdx) => {
      slide22.addText(`✓ ${item}`, {
        x: xPos + 0.3,
        y: yPos + 0.8 + (iIdx * 0.35),
        w: 5.2,
        fontSize: 11,
        color: colors.black
      });
    });
  });

  // Slide 23: Integration Timeline & Approach
  const slide23 = pptx.addSlide();
  slide23.addText("Integration Timeline & Approach", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide23.addText("Phased Connection Strategy", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  const phases = [
    {
      phase: "Phase 1: Discovery",
      duration: "Week 1-2",
      activities: ["API documentation review", "Credential provisioning", "Field mapping workshop", "Security requirements"]
    },
    {
      phase: "Phase 2: Development",
      duration: "Week 3-6",
      activities: ["Connector development", "Data transformation logic", "Error handling", "Testing environment setup"]
    },
    {
      phase: "Phase 3: Testing",
      duration: "Week 7-8",
      activities: ["Unit testing", "Integration testing", "User acceptance testing", "Performance validation"]
    },
    {
      phase: "Phase 4: Deployment",
      duration: "Week 9-10",
      activities: ["Production deployment", "Monitoring setup", "Team training", "Documentation handoff"]
    }
  ];
  phases.forEach((phase, idx) => {
    const yPos = 1.7 + (idx * 1.3);
    slide23.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: yPos,
      w: 12.0,
      h: 1.1,
      fill: { color: idx % 2 === 0 ? colors.lightGray : colors.white },
      line: { color: colors.gray, width: 1 }
    });
    slide23.addText(phase.phase, {
      x: 0.7,
      y: yPos + 0.1,
      w: 3.0,
      fontSize: 13,
      bold: true,
      color: colors.primary
    });
    slide23.addText(phase.duration, {
      x: 4.0,
      y: yPos + 0.1,
      w: 1.5,
      fontSize: 11,
      italic: true,
      color: colors.gray
    });
    slide23.addText(phase.activities.join(" • "), {
      x: 5.8,
      y: yPos + 0.4,
      w: 6.5,
      fontSize: 10,
      color: colors.black
    });
  });

  // ============================================================================
  // SECTION 5: WHAT WE HAVE vs WHAT WE CONNECT TO (Slides 24-26)
  // ============================================================================
  // Slide 24: Capability Matrix
  const slide24 = pptx.addSlide();
  slide24.addText("Capability Matrix", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide24.addText("What We Build ✓ \n What We Connect To 🔌 \n Future Roadmap 📍", {
    x: 0.5,
    y: 1.0,
    fontSize: 14,
    italic: true,
    color: colors.gray
  });
  const capabilityMatrix = [
    [
      { text: "Capability Area" },
      { text: "Status" },
      { text: "Our Role" },
      { text: "Your Role / Systems" }
    ],
    [
      { text: "Content Operations Hub" },
      { text: "✓ Built" },
      { text: "Intake, planning, governance" },
      { text: "N/A - We provide this" }
    ],
    [
      { text: "AI-Powered MLR" },
      { text: "✓ Built" },
      { text: "Pre-validation, analysis, prediction" },
      { text: "Human MLR team reviews" }
    ],
    [
      { text: "Modular Content Creation" },
      { text: "✓ Built" },
      { text: "Authoring, taxonomy, metadata" },
      { text: "N/A - We provide this" }
    ],
    [
      { text: "Glocalization" },
      { text: "✓ Built" },
      { text: "Translation, cultural adaptation" },
      { text: "Local MLR approval" }
    ],
    [
      { text: "Workflow Orchestration" },
      { text: "✓ Built" },
      { text: "Status tracking, routing, audit" },
      { text: "N/A - We provide this" }
    ],
    [
      { text: "DAM Integration" },
      { text: "🔌 Ready" },
      { text: "Content handoff, metadata sync" },
      { text: "Veeva Vault (your DAM)" }
    ],
    [
      { text: "CRM/Omnichannel" },
      { text: "🔌 Ready" },
      { text: "Content deployment triggers" },
      { text: "Salesforce/your CRM platform" }
    ],
    [
      { text: "Translation Memory" },
      { text: "🔌 Ready" },
      { text: "Leverage TM, update TM" },
      { text: "Your TMS database" }
    ],
    [
      { text: "Field Force Tools" },
      { text: "🔌 Ready" },
      { text: "Content distribution packages" },
      { text: "Veeva CRM, etc." }
    ],
    [
      { text: "BI/Analytics Export" },
      { text: "🔌 Ready" },
      { text: "Operational metrics export" },
      { text: "Your BI tools (Tableau, etc.)" }
    ],
    [
      { text: "Market Access" },
      { text: "📍 Future" },
      { text: "Content packages" },
      { text: "Your market access systems" }
    ],
    [
      { text: "Deep Data Analytics" },
      { text: "📍 Future" },
      { text: "Raw data export" },
      { text: "Your data warehouse" }
    ]
  ];
  slide24.addTable(capabilityMatrix, {
    x: 0.5,
    y: 1.6,
    w: 12.0,
    h: 5.1,
    colW: [3.0, 1.5, 3.5, 4.0],
    rowH: 0.39,
    fill: { color: colors.white },
    border: { pt: 1, color: colors.gray },
    fontSize: 9,
    align: "left",
    valign: "middle",
    color: colors.black
  });

  // Slide 25: What We Build
  const slide25 = pptx.addSlide();
  slide25.addText("What We Build (Core Platform)", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide25.addText("Production-Ready Capabilities", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  const builtCapabilities = [
    {
      module: "Content Operations",
      capabilities: [
        "Initiative intake and planning",
        "Strategic theme library with AI intelligence",
        "Content Studio for modular authoring",
        "Design asset production",
        "Template management",
        "Version control and collaboration"
      ]
    },
    {
      module: "MLR Acceleration",
      capabilities: [
        "AI-powered pre-MLR validation",
        "Claims checking against approved database",
        "Reference validation",
        "Regulatory compliance screening",
        "Risk scoring and approval prediction",
        "MLR Memory (learning system)"
      ]
    },
    {
      module: "Glocalization",
      capabilities: [
        "15+ language translation (medical terminology)",
        "Cultural adaptation intelligence",
        "Translation memory management",
        "Market-specific regulatory validation",
        "Context preservation across modules",
        "Cost optimization tracking"
      ]
    },
    {
      module: "Analytics & Insights",
      capabilities: [
        "Operational dashboards (cycle time, bottlenecks)",
        "Quality metrics (first-pass rate, compliance)",
        "Performance prediction (engagement, risk)",
        "Reusability tracking",
        "ROI measurement",
        "Export APIs for BI integration"
      ]
    }
  ];
  builtCapabilities.forEach((cap, idx) => {
    const xPos = 0.5 + (idx % 2) * 6.2;
    const yPos = 1.7 + Math.floor(idx / 2) * 2.5;
    slide25.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: yPos,
      w: 5.8,
      h: 2.2,
      fill: { color: colors.secondary },
      line: { color: colors.primary, width: 2 }
    });
    slide25.addText(cap.module, {
      x: xPos + 0.2,
      y: yPos + 0.15,
      w: 5.4,
      fontSize: 14,
      bold: true,
      color: colors.white
    });
    cap.capabilities.forEach((item, iIdx) => {
      slide25.addText(`• ${item}`, {
        x: xPos + 0.3,
        y: yPos + 0.6 + (iIdx * 0.25),
        w: 5.2,
        fontSize: 9,
        color: colors.white
      });
    });
  });

  // Slide 26: What We Connect To
  const slide26 = pptx.addSlide();
  slide26.addText("What We Connect To (Your Ecosystem)", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide26.addText("Integration-Ready, Not Replacement", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  const connectionPoints = [
    {
      system: "Digital Asset Management",
      example: "Veeva Vault, MediaValet",
      connection: "Bidirectional - We hand off approved content with metadata; pull assets as needed",
      timeline: "2-3 weeks post-pilot"
    },
    {
      system: "CRM / Omnichannel Platform",
      example: "Salesforce Marketing Cloud, Adobe Campaign",
      connection: "Push - We trigger content deployment to channels with targeting rules",
      timeline: "3-4 weeks post-pilot"
    },
    {
      system: "Translation Memory System",
      example: "SDL Trados, MemoQ, Phrase",
      connection: "Bidirectional - Leverage existing TM; update with new translations",
      timeline: "2 weeks post-pilot"
    },
    {
      system: "Field Force Tools",
      example: "Veeva CRM, IQVIA OCE",
      connection: "Push - Distribute approved content packages for rep access",
      timeline: "4 weeks post-pilot"
    },
    {
      system: "Business Intelligence",
      example: "Tableau, Power BI, Looker",
      connection: "Export - Operational metrics via API for strategic dashboards",
      timeline: "1-2 weeks post-pilot"
    }
  ];
  connectionPoints.forEach((conn, idx) => {
    const yPos = 1.7 + (idx * 1.0);
    slide26.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: yPos,
      w: 12.0,
      h: 0.9,
      fill: { color: idx % 2 === 0 ? colors.lightGray : colors.white },
      line: { color: colors.gray, width: 1 }
    });
    slide26.addText(conn.system, {
      x: 0.7,
      y: yPos + 0.1,
      w: 2.5,
      fontSize: 12,
      bold: true,
      color: colors.primary
    });
    slide26.addText(`Ex: ${conn.example}`, {
      x: 3.3,
      y: yPos + 0.1,
      w: 3.0,
      fontSize: 9,
      italic: true,
      color: colors.gray
    });
    slide26.addText(conn.connection, {
      x: 6.5,
      y: yPos + 0.3,
      w: 4.5,
      fontSize: 9,
      color: colors.black
    });
    slide26.addText(conn.timeline, {
      x: 11.2,
      y: yPos + 0.3,
      w: 1.0,
      fontSize: 8,
      color: colors.accent,
      align: "right"
    });
  });

  // ============================================================================
  // SECTION 6: ADDRESSING RFP SPECIFICS (Slides 27-31)
  // ============================================================================
  // Slide 27: MLR Cycle Reduction Strategy
  const slide27 = pptx.addSlide();
  slide27.addText("MLR Cycle Reduction Strategy", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide27.addText("Addressing Your #1 Bottleneck", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  // Before/After Timeline
  slide27.addText("Current State (Baseline)", {
    x: 0.7,
    y: 1.7,
    fontSize: 14,
    bold: true,
    color: colors.accent
  });
  // Current timeline bars
  const currentSteps = [
    { label: "Creation", weeks: 2, color: colors.gray },
    { label: "MLR Prep", weeks: 1, color: colors.gray },
    { label: "MLR Review 1", weeks: 2, color: colors.accent },
    { label: "Rework", weeks: 1.5, color: colors.accent },
    { label: "MLR Review 2", weeks: 1.5, color: colors.accent },
    { label: "Approval", weeks: 1, color: colors.gray }
  ];
  let cumWeeks = 0;
  currentSteps.forEach((step) => {
    slide27.addShape(pptx.ShapeType.rect, {
      x: 0.7 + cumWeeks * 1.2,
      y: 2.1,
      w: step.weeks * 1.2,
      h: 0.6,
      fill: { color: step.color }
    });
    slide27.addText(step.label, {
      x: 0.7 + cumWeeks * 1.2,
      y: 2.25,
      w: step.weeks * 1.2,
      fontSize: 9,
      bold: true,
      color: colors.white,
      align: "center"
    });
    cumWeeks += step.weeks;
  });
  slide27.addText(`Total: ${cumWeeks} weeks`, {
    x: 10.5,
    y: 2.25,
    fontSize: 11,
    bold: true,
    color: colors.accent
  });
  // Platform-enabled timeline
  slide27.addText("With Platform (Target)", {
    x: 0.7,
    y: 3.3,
    fontSize: 14,
    bold: true,
    color: colors.secondary
  });
  const platformSteps = [
    { label: "Creation + AI Pre-MLR", weeks: 1.5, color: colors.secondary },
    { label: "MLR Review", weeks: 1.5, color: colors.secondary },
    { label: "Minor Edits", weeks: 0.5, color: colors.secondary },
    { label: "Approval", weeks: 0.5, color: colors.secondary }
  ];
  cumWeeks = 0;
  platformSteps.forEach((step) => {
    slide27.addShape(pptx.ShapeType.rect, {
      x: 0.7 + cumWeeks * 1.2,
      y: 3.7,
      w: step.weeks * 1.2,
      h: 0.6,
      fill: { color: step.color }
    });
    slide27.addText(step.label, {
      x: 0.7 + cumWeeks * 1.2,
      y: 3.85,
      w: step.weeks * 1.2,
      fontSize: 9,
      bold: true,
      color: colors.white,
      align: "center"
    });
    cumWeeks += step.weeks;
  });
  slide27.addText(`Total: ${cumWeeks} weeks`, {
    x: 10.5,
    y: 3.85,
    fontSize: 11,
    bold: true,
    color: colors.secondary
  });
  // Improvement summary
  slide27.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 4.8,
    w: 12.0,
    h: 1.8,
    fill: { color: colors.lightGray }
  });
  slide27.addText("How We Achieve This:", {
    x: 0.7,
    y: 5.0,
    fontSize: 14,
    bold: true,
    color: colors.primary
  });
  const improvements = [
    "AI catches 70-80% of common issues before human review",
    "Real-time compliance checking during authoring reduces rework",
    "MLR Memory prevents repeated mistakes across assets",
    "Parallel review workflows for multi-stakeholder approval"
  ];
  improvements.forEach((imp, idx) => {
    slide27.addText(`✓ ${imp}`, {
      x: 1.0,
      y: 5.5 + (idx * 0.25),
      w: 10.5,
      fontSize: 11,
      color: colors.black
    });
  });

  // Slide 28: Modular Content Governance
  const slide28 = pptx.addSlide();
  slide28.addText("Modular Content Governance", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide28.addText("Centralized Control + Local Adaptation", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  // Governance model diagram
  slide28.addShape(pptx.ShapeType.rect, {
    x: 3.5,
    y: 1.7,
    w: 6.0,
    h: 1.0,
    fill: { color: colors.primary }
  });
  slide28.addText("Global Marketing Team", {
    x: 3.5,
    y: 1.95,
    w: 6.0,
    fontSize: 14,
    bold: true,
    color: colors.white,
    align: "center"
  });
  slide28.addText("Defines Strategy, Themes, Messaging", {
    x: 3.5,
    y: 2.85,
    w: 6.0,
    fontSize: 11,
    italic: true,
    color: colors.gray,
    align: "center"
  });
  // Arrow down
  slide28.addShape(pptx.ShapeType.line, {
    x: 6.5,
    y: 2.7,
    w: 0,
    h: 0.5,
    line: { color: colors.primary, width: 4, endArrowType: "arrow" }
  });
  // Modular content team
  slide28.addShape(pptx.ShapeType.rect, {
    x: 3.5,
    y: 3.4,
    w: 6.0,
    h: 1.0,
    fill: { color: colors.secondary }
  });
  slide28.addText("Modular Content Team", {
    x: 3.5,
    y: 3.65,
    w: 6.0,
    fontSize: 14,
    bold: true,
    color: colors.white,
    align: "center"
  });
  slide28.addText("Creates Reusable Assets in Platform", {
    x: 3.5,
    y: 4.55,
    w: 6.0,
    fontSize: 11,
    italic: true,
    color: colors.gray,
    align: "center"
  });
  // Arrow down
  slide28.addShape(pptx.ShapeType.line, {
    x: 6.5,
    y: 4.4,
    w: 0,
    h: 0.5,
    line: { color: colors.primary, width: 4, endArrowType: "arrow" }
  });
  // Regional/local teams
  const regions = [
    { x: 0.8, label: "US Team" },
    { x: 3.5, label: "EU Team" },
    { x: 6.2, label: "APAC Team" },
    { x: 8.9, label: "LATAM Team" }
  ];
  regions.forEach((region) => {
    slide28.addShape(pptx.ShapeType.rect, {
      x: region.x,
      y: 5.1,
      w: 2.5,
      h: 0.8,
      fill: { color: colors.accent }
    });
    slide28.addText(region.label, {
      x: region.x,
      y: 5.35,
      w: 2.5,
      fontSize: 12,
      bold: true,
      color: colors.white,
      align: "center"
    });
  });
  slide28.addText("Adapt for Local Markets via Glocalization Module", {
    x: 0.5,
    y: 6.1,
    w: 12.0,
    fontSize: 11,
    italic: true,
    color: colors.gray,
    align: "center"
  });
  // Governance features
  slide28.addText("Governance Features: Brand-approved templates • Taxonomy enforcement • Approval workflows • Version control • Audit trails", {
    x: 0.5,
    y: 6.7,
    w: 12.0,
    fontSize: 10,
    color: colors.black,
    align: "center"
  });

  // Slide 29: Compliance & Audit Trail
  const slide29 = pptx.addSlide();
  slide29.addText("Compliance & Audit Trail (GxP)", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  const complianceAreas = [
    {
      area: "Pre-Flight Compliance Checks",
      checks: [
        "Claims Validity - Verified against approved database",
        "Target-Market Fit - Regulatory rule validation",
        "Media Rights & Consent - Asset usage permissions",
        "Label Alignment - Product labeling consistency",
        "Residency Requirements - Data sovereignty checks"
      ]
    },
    {
      area: "Audit Trail (Who, What, When, Why, Where)",
      checks: [
        "User Actions - All edits, approvals, rejections logged",
        "Decision Logs - Rationale for MLR feedback captured",
        "Content Lineage - Full version history with diffs",
        "System Events - Automated checks, notifications",
        "Export Packages - Audit-ready reporting for inspectors"
      ]
    },
    {
      area: "Regulatory Matrix",
      checks: [
        "Market-Specific Rules - Country/region compliance database",
        "Therapeutic Area Guidelines - Indication-specific requirements",
        "Channel Restrictions - What can go where",
        "Hard-Block Publishing - Non-compliant content cannot advance",
        "Continuous Updates - Regulatory landscape monitoring"
      ]
    }
  ];
  complianceAreas.forEach((area, idx) => {
    const yPos = 1.5 + (idx * 1.8);
    slide29.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: yPos,
      w: 12.0,
      h: 1.6,
      fill: { color: colors.lightGray },
      line: { color: colors.secondary, width: 2 }
    });
    slide29.addText(area.area, {
      x: 0.7,
      y: yPos + 0.15,
      w: 11.5,
      fontSize: 14,
      bold: true,
      color: colors.primary
    });
    area.checks.forEach((check, cIdx) => {
      slide29.addText(`• ${check}`, {
        x: 0.8,
        y: yPos + 0.55 + (cIdx * 0.2),
        w: 11.3,
        fontSize: 9,
        color: colors.black
      });
    });
  });

  // Slide 30: Content Performance Measurement
  const slide30 = pptx.addSlide();
  slide30.addText("Content Performance Measurement", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide30.addText("KPIs We Track (Operational + Predictive)", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  const kpiCategories = [
    {
      category: "Efficiency Metrics",
      kpis: [
        "Approval Cycle Time (baseline vs. target)",
        "Time to Publish (end-to-end)",
        "Phase Duration (where are bottlenecks?)",
        "Rework Cycles (iterations per asset)",
        "Resource Utilization (team capacity)"
      ]
    },
    {
      category: "Quality Metrics",
      kpis: [
        "First-Time-Right Rate (first-pass approval %)",
        "Compliance Score (risk level by asset)",
        "Readability & Clarity (AI-scored)",
        "Brand Voice Consistency",
        "Medical Terminology Accuracy"
      ]
    },
    {
      category: "Reusability Metrics",
      kpis: [
        "Asset Reuse Rate (% of content modularized)",
        "Translation Memory Leverage (% savings)",
        "Market Adaptation Count (how many locales?)",
        "Template Usage (adoption tracking)",
        "Cross-Campaign Utilization"
      ]
    },
    {
      category: "Predictive Metrics",
      kpis: [
        "MLR Approval Likelihood (AI prediction)",
        "Engagement Prediction (audience resonance)",
        "Risk Scoring (regulatory/compliance risk)",
        "Performance Forecast (market effectiveness)",
        "Cost Optimization (projected ROI)"
      ]
    }
  ];
  kpiCategories.forEach((cat, idx) => {
    const xPos = 0.5 + (idx % 2) * 6.2;
    const yPos = 1.7 + Math.floor(idx / 2) * 2.5;
    slide30.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: yPos,
      w: 5.8,
      h: 2.2,
      fill: { color: idx < 2 ? colors.secondary : colors.accent },
      line: { color: colors.primary, width: 2 }
    });
    slide30.addText(cat.category, {
      x: xPos + 0.2,
      y: yPos + 0.15,
      w: 5.4,
      fontSize: 13,
      bold: true,
      color: colors.white
    });
    cat.kpis.forEach((kpi, kIdx) => {
      slide30.addText(`✓ ${kpi}`, {
        x: xPos + 0.3,
        y: yPos + 0.6 + (kIdx * 0.3),
        w: 5.2,
        fontSize: 9,
        color: colors.white
      });
    });
  });
  // Export note
  slide30.addText("All metrics exportable via API to your BI tools (Tableau, Power BI, Looker, etc.)", {
    x: 0.5,
    y: 6.5,
    w: 12.0,
    fontSize: 11,
    italic: true,
    color: colors.gray,
    align: "center"
  });

  // Slide 31: Team Enablement & Change Management
  const slide31 = pptx.addSlide();
  slide31.addText("Team Enablement & Change Management", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide31.addText("Supporting Your Transition to Modular Content", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  const enablementPhases = [
    {
      phase: "Discovery & Assessment",
      activities: [
        "Current workflow documentation",
        "Skill gap analysis",
        "Role definition workshops",
        "Success criteria alignment"
      ]
    },
    {
      phase: "Training Program",
      activities: [
        "Role-based training modules",
        "Hands-on platform workshops",
        "Best practices documentation",
        "Video tutorials & guides"
      ]
    },
    {
      phase: "Pilot Support",
      activities: [
        "Embedded team support",
        "Real-time troubleshooting",
        "Weekly office hours",
        "Performance feedback loops"
      ]
    },
    {
      phase: "Ongoing Enablement",
      activities: [
        "Advanced feature training",
        "Quarterly process optimization",
        "Community of practice",
        "Continuous improvement initiatives"
      ]
    }
  ];
  enablementPhases.forEach((phase, idx) => {
    const xPos = 0.5 + (idx * 3.05);
    slide31.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 1.8,
      w: 2.8,
      h: 4.5,
      fill: { color: colors.lightGray },
      line: { color: colors.secondary, width: 2 }
    });
    slide31.addText(phase.phase, {
      x: xPos + 0.2,
      y: 2.0,
      w: 2.4,
      fontSize: 13,
      bold: true,
      color: colors.primary
    });
    phase.activities.forEach((activity, aIdx) => {
      slide31.addText(`${aIdx + 1}. ${activity}`, {
        x: xPos + 0.25,
        y: 2.6 + (aIdx * 0.7),
        w: 2.3,
        fontSize: 10,
        color: colors.black
      });
    });
  });

  // ============================================================================
  // SECTION 7: IMPLEMENTATION & PARTNERSHIP (Slides 32-35)
  // ============================================================================
  // Slide 32: Pilot Proposal - 3 Options
  const slide32 = pptx.addSlide();
  slide32.addText("Pilot Proposal - 3 Options", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide32.addText("12-Week Pilots with Clear Success Criteria", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  const pilotOptions = [
    {
      title: "Option A: MLR Acceleration",
      scope: "Focus on your #1 pain point",
      deliverables: [
        "20-30 assets through Pre-MLR AI",
        "Compare cycle time & first-pass rate",
        "MLR team workflow integration",
        "ROI measurement dashboard"
      ],
      investment: "$75K",
      outcome: "30-40% cycle time reduction"
    },
    {
      title: "Option B: Glocalization Factory",
      scope: "Prove translation efficiency",
      deliverables: [
        "1 global campaign → 5 markets",
        "Translation memory leverage demo",
        "Cultural adaptation quality check",
        "Cost savings calculation"
      ],
      investment: "$85K",
      outcome: "50% localization cost savings"
    },
    {
      title: "Option C: End-to-End",
      scope: "Full content lifecycle",
      deliverables: [
        "2-3 initiatives: Intake → Deployment",
        "Complete workflow demonstration",
        "Team adoption metrics",
        "Time-to-market improvement"
      ],
      investment: "$125K",
      outcome: "35% faster time-to-market"
    }
  ];
  pilotOptions.forEach((option, idx) => {
    const xPos = 0.5 + (idx * 4.1);
    slide32.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 1.7,
      w: 3.8,
      h: 5.0,
      fill: { color: idx === 2 ? colors.accent : colors.secondary },
      line: { color: colors.primary, width: 2 }
    });
    slide32.addText(option.title, {
      x: xPos + 0.2,
      y: 1.9,
      w: 3.4,
      fontSize: 14,
      bold: true,
      color: colors.white
    });
    slide32.addText(option.scope, {
      x: xPos + 0.2,
      y: 2.3,
      w: 3.4,
      fontSize: 10,
      italic: true,
      color: colors.white
    });
    slide32.addText("Deliverables:", {
      x: xPos + 0.2,
      y: 2.8,
      w: 3.4,
      fontSize: 11,
      bold: true,
      color: colors.white
    });
    option.deliverables.forEach((del, dIdx) => {
      slide32.addText(`• ${del}`, {
        x: xPos + 0.3,
        y: 3.1 + (dIdx * 0.4),
        w: 3.2,
        fontSize: 9,
        color: colors.white
      });
    });
    slide32.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 5.3,
      w: 3.8,
      h: 0.7,
      fill: { color: colors.light }
    });
    slide32.addText(`Investment: ${option.investment}`, {
      x: xPos + 0.2,
      y: 5.45,
      w: 3.4,
      fontSize: 12,
      bold: true,
      color: colors.white
    });
    slide32.addText(`Expected: ${option.outcome}`, {
      x: xPos + 0.2,
      y: 6.15,
      w: 3.4,
      fontSize: 10,
      italic: true,
      color: colors.black
    });
  });

  // Slide 33: Implementation Roadmap
  const slide33 = pptx.addSlide();
  slide33.addText("Implementation Roadmap", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide33.addText("12-Week Pilot → 16-20 Week Production Deployment", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  // Gantt-style timeline
  const roadmapPhases = [
    { phase: "Pilot Kickoff & Setup", start: 0, duration: 2, color: colors.secondary },
    { phase: "Team Training", start: 1, duration: 3, color: colors.accent },
    { phase: "Pilot Execution", start: 2, duration: 8, color: colors.primary },
    { phase: "Results Analysis", start: 10, duration: 2, color: colors.light },
    { phase: "Production Planning", start: 12, duration: 2, color: colors.secondary },
    { phase: "System Integration (APIs)", start: 14, duration: 4, color: colors.accent },
    { phase: "Production Deployment", start: 16, duration: 4, color: colors.primary },
    { phase: "Ongoing Optimization", start: 20, duration: 4, color: colors.light }
  ];
  roadmapPhases.forEach((rp, idx) => {
    slide33.addText(rp.phase, {
      x: 0.7,
      y: 1.8 + (idx * 0.6),
      w: 3.0,
      fontSize: 11,
      color: colors.black
    });
    slide33.addShape(pptx.ShapeType.rect, {
      x: 4.0 + (rp.start * 0.35),
      y: 1.75 + (idx * 0.6),
      w: rp.duration * 0.35,
      h: 0.4,
      fill: { color: rp.color }
    });
    slide33.addText(`Wk ${rp.start + 1}-${rp.start + rp.duration}`, {
      x: 4.0 + (rp.start * 0.35),
      y: 1.82 + (idx * 0.6),
      w: rp.duration * 0.35,
      fontSize: 8,
      color: colors.white,
      align: "center"
    });
  });
  // Week numbers
  for (let week = 0; week < 24; week += 2) {
    slide33.addText(`${week}`, {
      x: 4.0 + (week * 0.35),
      y: 6.8,
      w: 0.7,
      fontSize: 9,
      color: colors.gray,
      align: "center"
    });
  }

  // Slide 34: Success Framework
  const slide34 = pptx.addSlide();
  slide34.addText("Success Framework", {
    x: 0.5,
    y: 0.4,
    w: "90%",
    fontSize: 32,
    bold: true,
    color: colors.primary
  });
  slide34.addText("How We Measure, Report & Iterate", {
    x: 0.5,
    y: 1.0,
    fontSize: 16,
    italic: true,
    color: colors.gray
  });
  const successFramework = [
    {
      stage: "Baseline Measurement",
      activities: [
        "Document current-state metrics",
        "Capture MLR cycle times, rework rates",
        "Identify top 3 pain points",
        "Set quantifiable targets"
      ],
      timeline: "Week 1-2"
    },
    {
      stage: "Weekly Check-ins",
      activities: [
        "Progress against pilot goals",
        "Issue escalation & resolution",
        "User feedback collection",
        "Quick-win identification"
      ],
      timeline: "Ongoing"
    },
    {
      stage: "Mid-Pilot Review",
      activities: [
        "Performance vs. targets",
        "Adjust approach if needed",
        "Expand/contract pilot scope",
        "Stakeholder alignment"
      ],
      timeline: "Week 6"
    },
    {
      stage: "Final Results Report",
      activities: [
        "Before/after comparison",
        "ROI calculation (time, cost, quality)",
        "User satisfaction scores",
        "Production readiness assessment"
      ],
      timeline: "Week 12"
    }
  ];
  successFramework.forEach((sf, idx) => {
    const yPos = 1.7 + (idx * 1.3);
    slide34.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: yPos,
      w: 12.0,
      h: 1.1,
      fill: { color: idx % 2 === 0 ? colors.lightGray : colors.white },
      line: { color: colors.gray, width: 1 }
    });
    slide34.addText(sf.stage, {
      x: 0.7,
      y: yPos + 0.1,
      w: 2.5,
      fontSize: 13,
      bold: true,
      color: colors.primary
    });
    slide34.addText(sf.activities.join(" • "), {
      x: 3.3,
      y: yPos + 0.4,
      w: 7.0,
      fontSize: 10,
      color: colors.black
    });
    slide34.addText(sf.timeline, {
      x: 10.5,
      y: yPos + 0.4,
      w: 1.8,
      fontSize: 10,
      italic: true,
      color: colors.accent,
      align: "right"
    });
  });

  // Slide 35: Next Steps & Call to Action
  const slide35 = pptx.addSlide();
  slide35.background = { color: colors.primary };
  slide35.addText("Next Steps", {
    x: 0.5,
    y: 1.5,
    w: "90%",
    fontSize: 36,
    bold: true,
    color: colors.white,
    align: "center"
  });
  const nextSteps = [
    "1. Review this proposal with your stakeholders",
    "2. Select pilot option (A, B, or C) aligned with your priorities",
    "3. Schedule kickoff workshop (Week 1)",
    "4. Provide API credentials for system connections (if applicable)",
    "5. Designate pilot team members and subject matter experts",
    "6. Begin 12-week pilot and measure results"
  ];
  nextSteps.forEach((step, idx) => {
    slide35.addText(step, {
      x: 1.5,
      y: 2.8 + (idx * 0.5),
      w: 10.0,
      fontSize: 16,
      color: colors.white
    });
  });
  slide35.addShape(pptx.ShapeType.rect, {
    x: 2.0,
    y: 5.8,
    w: 9.0,
    h: 1.2,
    fill: { color: colors.light }
  });
  slide35.addText("We're ready to prove the value.\nLet's accelerate your content operations together.", {
    x: 2.0,
    y: 6.0,
    w: 9.0,
    fontSize: 18,
    bold: true,
    color: colors.white,
    align: "center",
    valign: "middle"
  });

  // Save presentation
  const fileName = "UCB_RFP_Response_Content_Operations_Platform.pptx";
  pptx.writeFile({ fileName });
};