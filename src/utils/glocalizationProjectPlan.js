
import pptxgen from "pptxgenjs";

export const generateGlocalizationProjectPlan = () => {
  const pptx = new pptxgen();
  const colors = {
    primary: "1E40AF",
    secondary: "3B82F6",
    accent: "60A5FA",
    dark: "1E293B",
    light: "F8FAFC",
    white: "FFFFFF",
    success: "10B981",
    warning: "F59E0B",
    info: "06B6D4",
    danger: "EF4444",
  };

  // Slide 1: Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: colors.primary };
  slide1.addText("Glocalization Module\nImplementation Project Plan", {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 2,
    fontSize: 44,
    bold: true,
    color: colors.white,
    align: "center",
  });
  slide1.addText("Build from Existing Prototype Framework", {
    x: 0.5,
    y: 3.8,
    w: 9,
    h: 0.5,
    fontSize: 24,
    color: colors.accent,
    align: "center",
  });
  slide1.addText("High-Level Approach, Scope & Requirements", {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 0.4,
    fontSize: 18,
    color: colors.light,
    align: "center",
  });

  // Slide 2: Executive Summary
  const slide2 = pptx.addSlide();
  slide2.addText("Executive Summary", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: colors.primary,
  });
  slide2.addText("Project Overview", {
    x: 0.7,
    y: 1.0,
    w: 8.6,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: colors.dark,
  });
  const overview = [
    "Objective: Build production-ready Glocalization Module as standalone solution",
    "Foundation: Leverage existing Content Orchestrator prototype framework",
    "Timeline: 16-20 weeks from kickoff to production deployment",
    "Team Size: 6-8 dedicated resources (2 AI/ML, 2 backend, 2 frontend, 1 PM, 1 QA)",
    "Budget Range: $400K-$650K (depending on scope & integrations)",
    "Deployment: Independent module with API integrations to client systems",
  ];
  let yPos = 1.4;
  overview.forEach((point) => {
    slide2.addText("•", { x: 0.9, y: yPos, w: 0.2, h: 0.25, fontSize: 14, color: colors.primary });
    slide2.addText(point, { x: 1.2, y: yPos, w: 8.1, h: 0.25, fontSize: 12, color: colors.dark });
    yPos += 0.35;
  });
  slide2.addText("Key Success Factors", {
    x: 0.7,
    y: 3.7,
    w: 8.6,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: colors.dark,
  });
  const successFactors = [
    "Reuse of existing AI translation & cultural adaptation engines (60% code reuse)",
    "Client commitment to provide SMEs for regulatory/cultural validation",
    "Access to translation memory & glossary databases from day one",
    "Integration specifications for Veeva Vault/DAM systems finalized early",
    "Defined list of initial target markets (recommend starting with 5-8 markets)",
  ];
  yPos = 4.1;
  successFactors.forEach((point) => {
    slide2.addText("✓", { x: 0.9, y: yPos, w: 0.2, h: 0.25, fontSize: 14, color: colors.success, bold: true });
    slide2.addText(point, { x: 1.2, y: yPos, w: 8.1, h: 0.25, fontSize: 12, color: colors.dark });
    yPos += 0.35;
  });

  // Slide 3: Module Scope & Core Capabilities
  const slide3 = pptx.addSlide();
  slide3.addText("In-Scope: Core Glocalization Capabilities", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  const scopeCategories = [
    {
      title: "1. AI Translation Engine",
      items: [
        "Medical/pharma terminology translation with context awareness",
        "Support for 15+ languages (expandable architecture)",
        "Integration with client glossaries & translation memories",
        "Quality scoring & confidence metrics per translation",
      ],
    },
    {
      title: "2. Cultural Adaptation Layer",
      items: [
        "Market-specific regulatory requirement mapping",
        "Cultural sensitivity analysis (colors, imagery, messaging)",
        "Local compliance recommendations (claims, disclaimers)",
        "Region-specific formatting (dates, numbers, addresses)",
      ],
    },
    {
      title: "3. Workflow Orchestration",
      items: [
        "Multi-market batch processing",
        "Human-in-the-loop review workflows",
        "Approval routing & notifications",
        "Version control & audit trails",
      ],
    },
    {
      title: "4. Integration & Output",
      items: [
        "API integrations: Veeva Vault, SharePoint, DAMs",
        "Export formats: PDF, HTML, InDesign packages",
        "Metadata preservation & tagging",
        "Analytics dashboard (time saved, quality metrics)",
      ],
    },
  ];
  yPos = 1.0;
  scopeCategories.forEach((category) => {
    slide3.addText(category.title, {
      x: 0.7,
      y: yPos,
      w: 8.6,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: colors.white,
      fill: { color: colors.secondary },
    });
    yPos += 0.35;
    category.items.forEach((item) => {
      slide3.addText("▸", { x: 1.0, y: yPos, w: 0.2, h: 0.2, fontSize: 12, color: colors.primary });
      slide3.addText(item, { x: 1.3, y: yPos, w: 8.0, h: 0.2, fontSize: 11, color: colors.dark });
      yPos += 0.25;
    });
    yPos += 0.2;
  });

  // Slide 4: Out of Scope (Phase 2 Opportunities)
  const slide4 = pptx.addSlide();
  slide4.addText("Out-of-Scope (Phase 2 Opportunities)", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide4.addText("The following capabilities are not included in the initial build but can be added in Phase 2:", {
    x: 0.7,
    y: 1.0,
    w: 8.6,
    h: 0.4,
    fontSize: 12,
    color: colors.dark,
    italic: true,
  });
  const outOfScope = [
    {
      category: "Advanced Features",
      items: [
        "Real-time collaborative editing across markets",
        "Video/multimedia content localization",
        "Voice-over & subtitle generation",
        "Interactive content adaptation (calculators, tools)",
      ],
    },
    {
      category: "Extended Integrations",
      items: [
        "Direct MLR workflow integration (Pre-MLR validation stays separate)",
        "CRM integration for personalized market content",
        "Social media channel publishing",
        "Email service provider (ESP) integrations",
      ],
    },
    {
      category: "Advanced Analytics",
      items: [
        "A/B testing across markets",
        "Sentiment analysis of localized content",
        "Predictive market readiness scoring",
        "ROI attribution by market",
      ],
    },
  ];
  yPos = 1.6;
  outOfScope.forEach((section) => {
    slide4.addText(section.category, {
      x: 0.9,
      y: yPos,
      w: 8.4,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: colors.dark,
    });
    yPos += 0.35;
    section.items.forEach((item) => {
      slide4.addText("○", { x: 1.2, y: yPos, w: 0.2, h: 0.2, fontSize: 12, color: colors.warning });
      slide4.addText(item, { x: 1.5, y: yPos, w: 7.8, h: 0.2, fontSize: 11, color: colors.dark });
      yPos += 0.25;
    });
    yPos += 0.3;
  });
  slide4.addText("💡 These features can be prioritized for Phase 2 based on client feedback & business value", {
    x: 0.7,
    y: 5.8,
    w: 8.6,
    h: 0.4,
    fontSize: 12,
    color: colors.dark,
    align: "center",
    fill: { color: colors.light },
  });

  // Slide 5: Technical Architecture
  const slide5 = pptx.addSlide();
  slide5.addText("Technical Architecture Overview", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  const architecture = [
    {
      layer: "Frontend Layer",
      tech: "React + TypeScript (from existing prototype)",
      components: [
        "Content upload & project management UI",
        "Market selection & configuration dashboard",
        "Review & approval workflows",
        "Analytics & reporting interface",
      ],
    },
    {
      layer: "API Layer",
      tech: "Supabase Edge Functions + REST APIs",
      components: [
        "Translation orchestration endpoints",
        "Cultural adaptation rules engine",
        "External system integration proxies",
        "Webhook handlers for notifications",
      ],
    },
    {
      layer: "AI/ML Services",
      tech: "Google Gemini + Custom Models",
      components: [
        "Neural machine translation (NMT) engine",
        "Cultural sensitivity classifier",
        "Regulatory compliance analyzer",
        "Quality assurance scoring model",
      ],
    },
    {
      layer: "Data Layer",
      tech: "Supabase PostgreSQL + Storage",
      components: [
        "Translation memory database",
        "Glossary & terminology management",
        "Market regulatory rules repository",
        "Audit logs & version history",
      ],
    },
  ];
  yPos = 1.0;
  architecture.forEach((layer) => {
    slide5.addText(layer.layer, {
      x: 0.7,
      y: yPos,
      w: 2.5,
      h: 0.3,
      fontSize: 13,
      bold: true,
      color: colors.white,
      fill: { color: colors.primary },
    });
    slide5.addText(layer.tech, {
      x: 3.3,
      y: yPos,
      w: 6.0,
      h: 0.3,
      fontSize: 11,
      color: colors.dark,
      italic: true,
    });
    yPos += 0.35;
    layer.components.forEach((comp) => {
      slide5.addText("▸", { x: 0.9, y: yPos, w: 0.2, h: 0.2, fontSize: 11, color: colors.secondary });
      slide5.addText(comp, { x: 1.2, y: yPos, w: 8.1, h: 0.2, fontSize: 10, color: colors.dark });
      yPos += 0.23;
    });
    yPos += 0.25;
  });
  slide5.addText("Leveraging Existing Prototype: ~60% code reuse from Content Orchestrator framework", {
    x: 0.7,
    y: 5.8,
    w: 8.6,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: colors.white,
    align: "center",
    fill: { color: colors.success },
  });

  // Slide 6: Implementation Phases & Timeline
  const slide6 = pptx.addSlide();
  slide6.addText("Implementation Phases (16-20 Weeks)", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  const phases = [
    {
      phase: "Phase 1: Foundation (Weeks 1-4)",
      deliverables: [
        "Requirements finalization & design workshops",
        "Prototype adaptation & architecture setup",
        "Translation memory & glossary integration",
        "Development environment & CI/CD pipeline",
      ],
      milestone: "✓ Development environment ready",
    },
    {
      phase: "Phase 2: Core Build (Weeks 5-10)",
      deliverables: [
        "AI translation engine implementation",
        "Cultural adaptation rules engine",
        "Workflow orchestration backend",
        "Frontend UI for content upload & review",
      ],
      milestone: "✓ MVP demo ready for internal testing",
    },
    {
      phase: "Phase 3: Integrations (Weeks 11-14)",
      deliverables: [
        "Veeva Vault / DAM API integrations",
        "Export format implementations (PDF, HTML)",
        "Notification & approval workflows",
        "Analytics dashboard & reporting",
      ],
      milestone: "✓ Integration testing complete",
    },
    {
      phase: "Phase 4: Testing & Launch (Weeks 15-20)",
      deliverables: [
        "UAT with client SMEs & actual content",
        "Performance optimization & security audit",
        "Training materials & documentation",
        "Production deployment & handover",
      ],
      milestone: "✓ Production go-live",
    },
  ];
  yPos = 1.0;
  phases.forEach((p, idx) => {
    slide6.addText(p.phase, {
      x: 0.7,
      y: yPos,
      w: 8.6,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: colors.white,
      fill: { color: idx % 2 === 0 ? colors.primary : colors.secondary },
    });
    yPos += 0.35;
    p.deliverables.forEach((d) => {
      slide6.addText("→", { x: 1.0, y: yPos, w: 0.2, h: 0.2, fontSize: 11, color: colors.dark });
      slide6.addText(d, { x: 1.3, y: yPos, w: 7.9, h: 0.2, fontSize: 10, color: colors.dark });
      yPos += 0.23;
    });
    slide6.addText(p.milestone, {
      x: 1.0,
      y: yPos,
      w: 8.3,
      h: 0.25,
      fontSize: 11,
      bold: true,
      color: colors.success,
    });
    yPos += 0.45;
  });

  // Slide 7: Resource Requirements
  const slide7 = pptx.addSlide();
  slide7.addText("Resource Requirements & Team Structure", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  const teamData = [
    [
      { text: "Role", options: { bold: true, color: colors.white, fill: { color: colors.dark } } },
      { text: "Count", options: { bold: true, color: colors.white, fill: { color: colors.dark } } },
      { text: "Commitment", options: { bold: true, color: colors.white, fill: { color: colors.dark } } },
      { text: "Key Responsibilities", options: { bold: true, color: colors.white, fill: { color: colors.dark } } },
    ],
    [
      { text: "AI/ML Engineers", options: { bold: true } },
      { text: "2" },
      { text: "Full-time" },
      { text: "Translation engine, cultural adaptation models" },
    ],
    [
      { text: "Backend Developers", options: { bold: true } },
      { text: "2" },
      { text: "Full-time" },
      { text: "APIs, integrations, workflow engine" },
    ],
    [
      { text: "Frontend Developers", options: { bold: true } },
      { text: "2" },
      { text: "Full-time" },
      { text: "UI/UX, dashboards, review workflows" },
    ],
    [
      { text: "Project Manager", options: { bold: true } },
      { text: "1" },
      { text: "Full-time" },
      { text: "Timeline, stakeholder mgmt, delivery" },
    ],
    [
      { text: "QA Engineer", options: { bold: true } },
      { text: "1" },
      { text: "80% time" },
      { text: "Testing, UAT coordination, quality gates" },
    ],
    [
      { text: "DevOps Engineer", options: { bold: true } },
      { text: "0.5" },
      { text: "Part-time" },
      { text: "Infrastructure, CI/CD, deployments" },
    ],
    [
      { text: "Client SMEs (regulatory)", options: { bold: true, color: colors.info } },
      { text: "2-3" },
      { text: "20-30%" },
      { text: "Requirements, validation, UAT" },
    ],
  ];
  slide7.addTable(teamData, {
    x: 0.5,
    y: 1.0,
    w: 9,
    h: 3.5,
    fontSize: 10,
    border: { pt: 1, color: colors.light },
    colW: [2.5, 1.0, 1.8, 3.7],
  });
  slide7.addText("Additional Requirements from Client", {
    x: 0.7,
    y: 4.7,
    w: 8.6,
    h: 0.3,
    fontSize: 14,
    bold: true,
    color: colors.dark,
  });
  const clientReqs = [
    "Access to existing translation memories & glossaries (day 1)",
    "API credentials for Veeva Vault / DAM systems (week 2)",
    "Sample content across target markets for testing (ongoing)",
    "Regulatory SME availability for validation (20-30% time commitment)",
  ];
  yPos = 5.1;
  clientReqs.forEach((req) => {
    slide7.addText("▸", { x: 0.9, y: yPos, w: 0.2, h: 0.25, fontSize: 12, color: colors.warning });
    slide7.addText(req, { x: 1.2, y: yPos, w: 8.1, h: 0.25, fontSize: 11, color: colors.dark });
    yPos += 0.3;
  });

  // Slide 8: Budget Breakdown
  const slide8 = pptx.addSlide();
  slide8.addText("Budget Breakdown & Investment", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  const budgetData = [
    [
      { text: "Category", options: { bold: true, color: colors.white, fill: { color: colors.dark } } },
      { text: "Baseline", options: { bold: true, color: colors.white, fill: { color: colors.success } } },
      { text: "Enhanced", options: { bold: true, color: colors.white, fill: { color: colors.info } } },
      { text: "Notes", options: { bold: true, color: colors.white, fill: { color: colors.dark } } },
    ],
    [
      { text: "Development Team", options: { bold: true } },
      { text: "$280K" },
      { text: "$350K" },
      { text: "16-20 weeks, 6-8 FTEs" },
    ],
    [
      { text: "AI/ML Infrastructure", options: { bold: true } },
      { text: "$40K" },
      { text: "$60K" },
      { text: "API costs, model training" },
    ],
    [
      { text: "Cloud & Hosting", options: { bold: true } },
      { text: "$15K" },
      { text: "$25K" },
      { text: "Supabase, storage, compute" },
    ],
    [
      { text: "Third-Party Licenses", options: { bold: true } },
      { text: "$20K" },
      { text: "$40K" },
      { text: "Translation APIs, integrations" },
    ],
    [
      { text: "Testing & QA", options: { bold: true } },
      { text: "$25K" },
      { text: "$35K" },
      { text: "UAT, security audit" },
    ],
    [
      { text: "Training & Documentation", options: { bold: true } },
      { text: "$15K" },
      { text: "$25K" },
      { text: "Materials, workshops" },
    ],
    [
      { text: "Project Management", options: { bold: true } },
      { text: "$30K" },
      { text: "$40K" },
      { text: "PM + risk buffer (10%)" },
    ],
    [
      { text: "Total Investment", options: { bold: true, fontSize: 12 } },
      { text: "$425K", options: { bold: true, color: colors.success, fontSize: 12 } },
      { text: "$575K", options: { bold: true, color: colors.info, fontSize: 12 } },
      { text: "One-time build cost" },
    ],
  ];
  slide8.addTable(budgetData, {
    x: 0.5,
    y: 1.0,
    w: 9,
    h: 3.8,
    fontSize: 11,
    border: { pt: 1, color: colors.light },
    colW: [2.5, 1.5, 1.5, 3.5],
  });
  slide8.addText("Post-Launch Operating Costs (Monthly)", {
    x: 0.7,
    y: 5.0,
    w: 8.6,
    h: 0.3,
    fontSize: 14,
    bold: true,
    color: colors.dark,
  });
  const opsCosts = [
    "Cloud infrastructure & AI API costs: $3K-$8K/month",
    "Ongoing support & maintenance (1 FTE): $12K-$18K/month",
    "Total monthly operating cost: $15K-$26K",
  ];
  yPos = 5.4;
  opsCosts.forEach((cost) => {
    slide8.addText("•", { x: 0.9, y: yPos, w: 0.2, h: 0.25, fontSize: 12, color: colors.secondary });
    slide8.addText(cost, { x: 1.2, y: yPos, w: 8.1, h: 0.25, fontSize: 11, color: colors.dark });
    yPos += 0.3;
  });

  // Slide 9: Risk Mitigation
  const slide9 = pptx.addSlide();
  slide9.addText("Risk Assessment & Mitigation", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  const risks = [
    {
      risk: "Translation quality doesn't meet client standards",
      mitigation: "Implement human-in-the-loop review, leverage client glossaries, conduct early quality benchmarking",
      impact: "High",
    },
    {
      risk: "Integration complexity with legacy systems",
      mitigation: "Conduct technical discovery in Phase 1, build API adapters, allow 2-week buffer for integration testing",
      impact: "Medium",
    },
    {
      risk: "Regulatory compliance requirements change",
      mitigation: "Design flexible rules engine, maintain regulatory SME involvement, build audit trail from day 1",
      impact: "Medium",
    },
    {
      risk: "Prototype code requires more refactoring than expected",
      mitigation: "Technical assessment in week 1, allocate 20% buffer for refactoring, prioritize clean architecture",
      impact: "Low",
    },
    {
      risk: "Client SME availability issues delay validation",
      mitigation: "Front-load SME requirements, schedule dedicated review sessions, provide async review tools",
      impact: "Medium",
    },
  ];
  const riskTable = [
    [
      { text: "Risk", options: { bold: true, color: colors.white, fill: { color: colors.dark } } },
      { text: "Mitigation Strategy", options: { bold: true, color: colors.white, fill: { color: colors.dark } } },
      { text: "Impact", options: { bold: true, color: colors.white, fill: { color: colors.dark } } },
    ],
  ];
  risks.forEach((r) => {
    const impactColor = r.impact === "High" ? colors.danger : r.impact === "Medium" ? colors.warning : colors.success;
    riskTable.push([
      { text: r.risk, options: { bold: false, color: colors.dark, fill: { color: colors.white } } },
      { text: r.mitigation, options: { bold: false, color: colors.dark, fill: { color: colors.white } } },
      { text: r.impact, options: { bold: true, color: impactColor, fill: { color: colors.white } } },
    ]);
  });
  slide9.addTable(riskTable, {
    x: 0.5,
    y: 1.0,
    w: 9,
    h: 4.5,
    fontSize: 10,
    border: { pt: 1, color: colors.light },
    colW: [3.0, 4.8, 1.2],
  });
  slide9.addText("✓ Overall Risk Level: Low-Medium (leveraging proven prototype reduces technical risk)", {
    x: 0.7,
    y: 5.8,
    w: 8.6,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: colors.white,
    align: "center",
    fill: { color: colors.success },
  });

  // Slide 10: Success Metrics & KPIs
  const slide10 = pptx.addSlide();
  slide10.addText("Success Metrics & KPIs", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide10.addText("Technical Performance Metrics", {
    x: 0.7,
    y: 1.0,
    w: 4,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: colors.dark,
  });
  const techMetrics = [
    "Translation accuracy: >95% for medical terminology",
    "Processing speed: <5 minutes per document (avg 10 pages)",
    "System uptime: >99.5% availability",
    "API response time: <2 seconds for translation requests",
  ];
  yPos = 1.4;
  techMetrics.forEach((m) => {
    slide10.addText("▸", { x: 0.9, y: yPos, w: 0.2, h: 0.25, fontSize: 12, color: colors.success });
    slide10.addText(m, { x: 1.2, y: yPos, w: 3.5, h: 0.25, fontSize: 11, color: colors.dark });
    yPos += 0.3;
  });
  slide10.addText("Business Value Metrics", {
    x: 5.2,
    y: 1.0,
    w: 4,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: colors.dark,
  });
  const businessMetrics = [
    "Time reduction: 85-95% vs traditional localization",
    "Cost savings: 60-75% reduction in translation costs",
    "Market reach: 5-8 markets in Phase 1, expandable",
    "User adoption: >80% of content teams using within 3 months",
  ];
  yPos = 1.4;
  businessMetrics.forEach((m) => {
    slide10.addText("▸", { x: 5.4, y: yPos, w: 0.2, h: 0.25, fontSize: 12, color: colors.info });
    slide10.addText(m, { x: 5.7, y: yPos, w: 3.6, h: 0.25, fontSize: 11, color: colors.dark });
    yPos += 0.3;
  });
  slide10.addText("Quality Gates & Acceptance Criteria", {
    x: 0.7,
    y: 3.2,
    w: 8.6,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: colors.dark,
  });
  const qualityGates = [
    {
      gate: "Phase 1 Gate",
      criteria: "Technical architecture approved, integrations spec finalized, translation memory loaded",
    },
    {
      gate: "Phase 2 Gate",
      criteria: "MVP demo passed by stakeholders, translation quality benchmarked at >90%, workflow tested",
    },
    {
      gate: "Phase 3 Gate",
      criteria: "Veeva/DAM integrations working, export formats validated, analytics dashboard functional",
    },
    {
      gate: "Go-Live Gate",
      criteria: "UAT passed with real content, security audit complete, training delivered, performance SLAs met",
    },
  ];
  yPos = 3.6;
  qualityGates.forEach((qg) => {
    slide10.addText(qg.gate, {
      x: 0.9,
      y: yPos,
      w: 1.8,
      h: 0.25,
      fontSize: 11,
      bold: true,
      color: colors.primary,
    });
    slide10.addText(qg.criteria, {
      x: 2.8,
      y: yPos,
      w: 6.5,
      h: 0.25,
      fontSize: 10,
      color: colors.dark,
    });
    yPos += 0.35;
  });
  slide10.addText("🎯 Success = On-time delivery, within budget, meeting all quality gates & KPIs", {
    x: 0.7,
    y: 5.8,
    w: 8.6,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: colors.dark,
    align: "center",
    fill: { color: colors.light },
  });

  // Slide 11: Next Steps
  const slide11 = pptx.addSlide();
  slide11.addText("Next Steps & Project Kickoff", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide11.addText("To initiate this project, we need the following from your team:", {
    x: 0.7,
    y: 1.0,
    w: 8.6,
    h: 0.3,
    fontSize: 13,
    color: colors.dark,
  });
  const nextSteps = [
    {
      step: "1. Stakeholder Alignment Workshop (Week 0)",
      tasks: [
        "Confirm project scope & priorities",
        "Identify client SMEs & their availability",
        "Review technical architecture & integration points",
        "Finalize timeline & budget approval",
      ],
    },
    {
      step: "2. Technical Discovery (Week 1)",
      tasks: [
        "Access to translation memories & glossaries",
        "API documentation for Veeva/DAM systems",
        "Sample content across all target markets",
        "Regulatory compliance requirements by market",
      ],
    },
    {
      step: "3. Project Kickoff (Week 1-2)",
      tasks: [
        "Team introductions & role assignments",
        "Development environment setup",
        "Sprint planning & communication cadence",
        "Risk register & escalation paths",
      ],
    },
  ];
  yPos = 1.5;
  nextSteps.forEach((ns) => {
    slide11.addText(ns.step, {
      x: 0.7,
      y: yPos,
      w: 8.6,
      h: 0.3,
      fontSize: 13,
      bold: true,
      color: colors.white,
      fill: { color: colors.secondary },
    });
    yPos += 0.35;
    ns.tasks.forEach((task) => {
      slide11.addText("✓", { x: 1.0, y: yPos, w: 0.2, h: 0.22, fontSize: 11, color: colors.success, bold: true });
      slide11.addText(task, { x: 1.3, y: yPos, w: 8.0, h: 0.22, fontSize: 11, color: colors.dark });
      yPos += 0.27;
    });
    yPos += 0.25;
  });
  slide11.addText("Questions? Contact project lead to schedule stakeholder workshop", {
    x: 0.7,
    y: 5.8,
    w: 8.6,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: colors.white,
    align: "center",
    fill: { color: colors.primary },
  });

  pptx.writeFile({ fileName: "Glocalization_Module_Project_Plan.pptx" });
};