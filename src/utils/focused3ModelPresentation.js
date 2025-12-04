
import pptxgen from "pptxgenjs";

export const generateFocused3ModelPresentation = () => {
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
  };

  // Slide 1: Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: colors.primary };
  slide1.addText("Top 3 Business Models\nfor Content Orchestrator Platform", {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 2,
    fontSize: 44,
    bold: true,
    color: colors.white,
    align: "center",
  });
  slide1.addText("Strategic Decision Framework for Client Engagement", {
    x: 0.5,
    y: 3.8,
    w: 9,
    h: 0.5,
    fontSize: 24,
    color: colors.accent,
    align: "center",
  });

  // Slide 2: Executive Summary
  const slide2 = pptx.addSlide();
  slide2.addText("Executive Summary: Top 3 Recommended Models", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: colors.primary,
  });
  const summary = [
    {
      model: "Model 1: SaaS + Professional Services",
      why: "Balanced risk, predictable revenue, fastest time-to-value",
      fit: "Ideal for pharma companies seeking immediate deployment with minimal internal resources",
    },
    {
      model: "Model 2: Co-Development Partnership",
      why: "Deep customization, shared IP ownership, strategic alignment",
      fit: "Best for large pharma with specific workflows and long-term integration needs",
    },
    {
      model: "Model 3: Private Cloud Deployment",
      why: "Maximum control, IP protection, regulatory compliance",
      fit: "Perfect for highly regulated environments requiring on-premise or dedicated cloud",
    },
  ];
  let yPos = 1.2;
  summary.forEach((item, idx) => {
    slide2.addText(`${idx + 1}`, {
      x: 0.7,
      y: yPos,
      w: 0.5,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: colors.white,
      align: "center",
      fill: { color: colors.primary },
    });
    slide2.addText(item.model, {
      x: 1.4,
      y: yPos,
      w: 8,
      h: 0.3,
      fontSize: 18,
      bold: true,
      color: colors.dark,
    });
    slide2.addText(`Why: ${item.why}`, {
      x: 1.4,
      y: yPos + 0.35,
      w: 8,
      h: 0.3,
      fontSize: 14,
      color: colors.secondary,
    });
    slide2.addText(`Best Fit: ${item.fit}`, {
      x: 1.4,
      y: yPos + 0.65,
      w: 8,
      h: 0.3,
      fontSize: 12,
      color: colors.dark,
      italic: true,
    });
    yPos += 1.5;
  });

  // Slide 3: Model 1 - SaaS + Professional Services (Detailed)
  const slide3 = pptx.addSlide();
  slide3.addText("Model 1: SaaS + Professional Services", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide3.addText("How It Works", {
    x: 0.7,
    y: 1.0,
    w: 4,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colors.dark,
  });
  const saasHow = [
    "Cloud-hosted platform with multi-tenant architecture",
    "Monthly/annual subscription based on users & content volume",
    "Professional services for onboarding, training & customization",
    "Ongoing support packages (Bronze/Silver/Gold tiers)",
    "Regular platform updates & feature releases included",
  ];
  yPos = 1.4;
  saasHow.forEach((point) => {
    slide3.addText("•", { x: 0.9, y: yPos, w: 0.2, h: 0.25, fontSize: 14, color: colors.primary });
    slide3.addText(point, { x: 1.2, y: yPos, w: 3.5, h: 0.25, fontSize: 12, color: colors.dark });
    yPos += 0.3;
  });
  slide3.addText("Revenue Structure", {
    x: 5.2,
    y: 1.0,
    w: 4,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colors.dark,
  });
  const saasRevenue = [
    "Base SaaS: $15K-$50K/month (tier-based)",
    "Per-user licensing: $200-$500/user/month",
    "Implementation: $50K-$150K (one-time)",
    "Training & onboarding: $10K-$30K",
    "Premium support: $5K-$15K/month",
    "Professional services: $200-$350/hour",
  ];
  yPos = 1.4;
  saasRevenue.forEach((point) => {
    slide3.addText("•", { x: 5.4, y: yPos, w: 0.2, h: 0.25, fontSize: 14, color: colors.success });
    slide3.addText(point, { x: 5.7, y: yPos, w: 3.8, h: 0.25, fontSize: 12, color: colors.dark });
    yPos += 0.3;
  });
  slide3.addText("Key Decision Factors", {
    x: 0.7,
    y: 3.5,
    w: 4,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colors.dark,
  });
  const prosConsTable = [
    [
      { text: "Advantages", options: { bold: true, color: colors.white, fill: { color: colors.success } } },
      { text: "Considerations", options: { bold: true, color: colors.white, fill: { color: colors.warning } } },
    ],
    [{ text: "✓ Fastest deployment (2-4 weeks)" }, { text: "⚠ Shared infrastructure (data isolation via RLS)" }],
    [{ text: "✓ Predictable monthly costs" }, { text: "⚠ Less customization than co-dev model" }],
    [{ text: "✓ No internal IT infrastructure needed" }, { text: "⚠ Requires trust in vendor's security practices" }],
    [{ text: "✓ Continuous updates & improvements" }, { text: "⚠ Feature roadmap influenced by all clients" }],
    [{ text: "✓ Lower initial investment ($50K-$200K)" }, { text: "⚠ Ongoing subscription creates long-term costs" }],
  ];
  slide3.addTable(prosConsTable, {
    x: 0.7,
    y: 3.9,
    w: 8.6,
    h: 1.8,
    fontSize: 11,
    border: { pt: 1, color: colors.light },
    colW: [4.3, 4.3],
  });
  slide3.addText("Best For: Mid-sized pharma, fast-growing biotech, teams needing quick deployment without IT overhead", {
    x: 0.7,
    y: 6.0,
    w: 8.6,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: colors.white,
    align: "center",
    fill: { color: colors.primary },
  });

  // Slide 4: Model 2 - Co-Development Partnership (Detailed)
  const slide4 = pptx.addSlide();
  slide4.addText("Model 2: Co-Development Partnership", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide4.addText("How It Works", {
    x: 0.7,
    y: 1.0,
    w: 4,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colors.dark,
  });
  const codevHow = [
    "Joint development of customized features & workflows",
    "Shared IP ownership based on contribution percentage",
    "Dedicated development team assigned to client project",
    "Client SMEs work alongside our engineering team",
    "Phased deployment with milestone-based payments",
    "Option to license back improvements to other clients",
  ];
  yPos = 1.4;
  codevHow.forEach((point) => {
    slide4.addText("•", { x: 0.9, y: yPos, w: 0.2, h: 0.25, fontSize: 14, color: colors.primary });
    slide4.addText(point, { x: 1.2, y: yPos, w: 3.5, h: 0.25, fontSize: 12, color: colors.dark });
    yPos += 0.3;
  });
  slide4.addText("Revenue Structure", {
    x: 5.2,
    y: 1.0,
    w: 4,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colors.dark,
  });
  const codevRevenue = [
    "Development investment: $300K-$1M (milestone-based)",
    "Base platform license: $25K-$75K/month",
    "Revenue share on client-funded features: 10-30%",
    "Ongoing maintenance: $15K-$40K/month",
    "Training & change management: $50K-$100K",
    "Priority support & SLA: Included in monthly fee",
  ];
  yPos = 1.4;
  codevRevenue.forEach((point) => {
    slide4.addText("•", { x: 5.4, y: yPos, w: 0.2, h: 0.25, fontSize: 14, color: colors.success });
    slide4.addText(point, { x: 5.7, y: yPos, w: 3.8, h: 0.25, fontSize: 12, color: colors.dark });
    yPos += 0.3;
  });
  slide4.addText("Key Decision Factors", {
    x: 0.7,
    y: 3.5,
    w: 4,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colors.dark,
  });
  const codevTable = [
    [
      { text: "Advantages", options: { bold: true, color: colors.white, fill: { color: colors.success } } },
      { text: "Considerations", options: { bold: true, color: colors.white, fill: { color: colors.warning } } },
    ],
    [{ text: "✓ Deep customization to exact workflows" }, { text: "⚠ Higher upfront investment ($300K-$1M+)" }],
    [{ text: "✓ Shared IP ownership (30-70% typical split)" }, { text: "⚠ Longer implementation (4-9 months)" }],
    [{ text: "✓ Strategic partnership with aligned roadmap" }, { text: "⚠ Requires dedicated client SME time (20-40%)" }],
    [{ text: "✓ Potential revenue from licensing back features" }, { text: "⚠ Complex IP agreements & revenue sharing" }],
    [{ text: "✓ Priority influence on product direction" }, { text: "⚠ Success depends on partnership quality" }],
  ];
  slide4.addTable(codevTable, {
    x: 0.7,
    y: 3.9,
    w: 8.6,
    h: 1.8,
    fontSize: 11,
    border: { pt: 1, color: colors.light },
    colW: [4.3, 4.3],
  });
  slide4.addText(
    "Best For: Large pharma with complex workflows, organizations seeking strategic platform partnerships, clients with internal dev resources to contribute",
    {
      x: 0.7,
      y: 6.0,
      w: 8.6,
      h: 0.4,
      fontSize: 12,
      bold: true,
      color: colors.white,
      align: "center",
      fill: { color: colors.primary },
    }
  );

  // Slide 5: Model 3 - Private Cloud Deployment (Detailed)
  const slide5 = pptx.addSlide();
  slide5.addText("Model 3: Private Cloud Deployment", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide5.addText("How It Works", {
    x: 0.7,
    y: 1.0,
    w: 4,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colors.dark,
  });
  const privateHow = [
    "Dedicated cloud instance (AWS/Azure/GCP) or on-premise",
    "Full source code license with deployment rights",
    "Client-controlled infrastructure & data sovereignty",
    "White-label option for client branding",
    "Managed services for infrastructure & updates (optional)",
    "Direct database access & custom integrations",
  ];
  yPos = 1.4;
  privateHow.forEach((point) => {
    slide5.addText("•", { x: 0.9, y: yPos, w: 0.2, h: 0.25, fontSize: 14, color: colors.primary });
    slide5.addText(point, { x: 1.2, y: yPos, w: 3.5, h: 0.25, fontSize: 12, color: colors.dark });
    yPos += 0.3;
  });
  slide5.addText("Revenue Structure", {
    x: 5.2,
    y: 1.0,
    w: 4,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colors.dark,
  });
  const privateRevenue = [
    "Perpetual license: $500K-$2M (one-time)",
    "Annual maintenance & updates: 18-22% of license",
    "Implementation & deployment: $100K-$300K",
    "Managed services (optional): $20K-$60K/month",
    "Training & documentation: $30K-$80K",
    "Custom development: $250-$400/hour",
  ];
  yPos = 1.4;
  privateRevenue.forEach((point) => {
    slide5.addText("•", { x: 5.4, y: yPos, w: 0.2, h: 0.25, fontSize: 14, color: colors.success });
    slide5.addText(point, { x: 5.7, y: yPos, w: 3.8, h: 0.25, fontSize: 12, color: colors.dark });
    yPos += 0.3;
  });
  slide5.addText("Key Decision Factors", {
    x: 0.7,
    y: 3.5,
    w: 4,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colors.dark,
  });
  const privateTable = [
    [
      { text: "Advantages", options: { bold: true, color: colors.white, fill: { color: colors.success } } },
      { text: "Considerations", options: { bold: true, color: colors.white, fill: { color: colors.warning } } },
    ],
    [{ text: "✓ Complete data sovereignty & control" }, { text: "⚠ Highest upfront investment ($600K-$2.5M)" }],
    [{ text: "✓ Maximum IP protection (no shared infra)" }, { text: "⚠ Requires internal IT/DevOps resources" }],
    [{ text: "✓ Custom compliance configurations" }, { text: "⚠ Client responsible for infrastructure costs" }],
    [{ text: "✓ Unlimited customization & integrations" }, { text: "⚠ Update deployment controlled by client" }],
    [{ text: "✓ No vendor lock-in (source code access)" }, { text: "⚠ Longer setup time (3-6 months minimum)" }],
  ];
  slide5.addTable(privateTable, {
    x: 0.7,
    y: 3.9,
    w: 8.6,
    h: 1.8,
    fontSize: 11,
    border: { pt: 1, color: colors.light },
    colW: [4.3, 4.3],
  });
  slide5.addText(
    "Best For: Large enterprise pharma, highly regulated markets (China, Russia), organizations with strict data sovereignty requirements, companies requiring custom integrations with legacy systems",
    {
      x: 0.7,
      y: 6.0,
      w: 8.6,
      h: 0.4,
      fontSize: 11,
      bold: true,
      color: colors.white,
      align: "center",
      fill: { color: colors.primary },
    }
  );

  // Slide 6: Comparison Matrix
  const slide6 = pptx.addSlide();
  slide6.addText("Side-by-Side Comparison", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  const comparisonData = [
    [
      { text: "Factor", options: { bold: true, color: colors.white, fill: { color: colors.dark } } },
      { text: "SaaS + Services", options: { bold: true, color: colors.white, fill: { color: colors.secondary } } },
      { text: "Co-Development", options: { bold: true, color: colors.white, fill: { color: colors.secondary } } },
      { text: "Private Cloud", options: { bold: true, color: colors.white, fill: { color: colors.secondary } } },
    ],
    [{ text: "Initial Investment", options: { bold: true } }, { text: "$50K-$200K" }, { text: "$300K-$1M" }, { text: "$600K-$2.5M" }],
    [{ text: "Monthly Cost", options: { bold: true } }, { text: "$15K-$50K + users" }, { text: "$25K-$75K" }, { text: "$20K-$60K (if managed)" }],
    [{ text: "Time to Deploy", options: { bold: true } }, { text: "2-4 weeks" }, { text: "4-9 months" }, { text: "3-6 months" }],
    [{ text: "Customization", options: { bold: true } }, { text: "Moderate" }, { text: "High" }, { text: "Unlimited" }],
    [{ text: "IP Protection", options: { bold: true } }, { text: "Standard (RLS)" }, { text: "Shared ownership" }, { text: "Maximum (dedicated)" }],
    [{ text: "IT Resources Needed", options: { bold: true } }, { text: "Minimal" }, { text: "Moderate (SMEs)" }, { text: "High (DevOps)" }],
    [{ text: "Scalability", options: { bold: true } }, { text: "Automatic" }, { text: "Automatic" }, { text: "Client-managed" }],
    [{ text: "Best Use Case", options: { bold: true } }, { text: "Quick deployment" }, { text: "Strategic partner" }, { text: "Data sovereignty" }],
  ];
  slide6.addTable(comparisonData, {
    x: 0.5,
    y: 1.0,
    w: 9,
    h: 4.5,
    fontSize: 11,
    border: { pt: 1, color: colors.light },
    colW: [2.5, 2.17, 2.17, 2.16],
  });
  slide6.addText("💡 Decision Tip: Most clients start with SaaS for speed, then migrate to Co-Dev or Private Cloud as needs grow", {
    x: 0.7,
    y: 5.8,
    w: 8.6,
    h: 0.4,
    fontSize: 13,
    color: colors.dark,
    align: "center",
    fill: { color: colors.light },
  });

  // Slide 7: Implementation Roadmap
  const slide7 = pptx.addSlide();
  slide7.addText("Typical Implementation Timeline", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  const roadmapData = [
    {
      model: "SaaS + Professional Services",
      phases: [
        "Week 1-2: Discovery & configuration",
        "Week 2-3: Data migration & integration",
        "Week 3-4: UAT & training",
        "Week 4: Go-live & support",
      ],
    },
    {
      model: "Co-Development Partnership",
      phases: [
        "Month 1-2: Requirements & design workshops",
        "Month 3-6: Iterative development sprints",
        "Month 7-8: Integration & testing",
        "Month 8-9: Training & rollout",
      ],
    },
    {
      model: "Private Cloud Deployment",
      phases: [
        "Month 1-2: Infrastructure setup & security review",
        "Month 3-4: Platform deployment & customization",
        "Month 4-5: Integration with client systems",
        "Month 5-6: Training, validation & go-live",
      ],
    },
  ];
  yPos = 1.2;
  roadmapData.forEach((item, idx) => {
    slide7.addText(item.model, {
      x: 0.7,
      y: yPos,
      w: 8.6,
      h: 0.3,
      fontSize: 16,
      bold: true,
      color: colors.white,
      align: "left",
      fill: { color: colors.primary },
    });
    yPos += 0.4;
    item.phases.forEach((phase) => {
      slide7.addText("→", { x: 1.0, y: yPos, w: 0.3, h: 0.25, fontSize: 14, color: colors.secondary });
      slide7.addText(phase, { x: 1.4, y: yPos, w: 7.9, h: 0.25, fontSize: 12, color: colors.dark });
      yPos += 0.3;
    });
    yPos += 0.4;
  });

  // Slide 8: Next Steps & Decision Framework
  const slide8 = pptx.addSlide();
  slide8.addText("Next Steps: Decision Framework", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide8.addText("Key Questions to Answer", {
    x: 0.7,
    y: 1.0,
    w: 4,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colors.dark,
  });
  const questions = [
    "What is your timeline for deployment? (urgent vs. strategic)",
    "What level of customization do you require? (standard vs. custom)",
    "What are your data sovereignty requirements? (shared OK vs. dedicated)",
    "What internal IT/DevOps resources are available?",
    "What is your budget range? (OpEx vs. CapEx preference)",
    "Do you want ongoing vendor partnership or maximum independence?",
  ];
  yPos = 1.4;
  questions.forEach((q, idx) => {
    slide8.addText(`${idx + 1}.`, { x: 0.9, y: yPos, w: 0.3, h: 0.3, fontSize: 14, bold: true, color: colors.primary });
    slide8.addText(q, { x: 1.3, y: yPos, w: 8, h: 0.3, fontSize: 12, color: colors.dark });
    yPos += 0.4;
  });
  slide8.addText("Recommended Next Steps", {
    x: 0.7,
    y: 4.0,
    w: 8.6,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: colors.white,
    align: "center",
    fill: { color: colors.primary },
  });
  const nextSteps = [
    "Schedule discovery workshop to assess your specific requirements",
    "Review existing technical infrastructure & integration points",
    "Conduct proof-of-concept with your actual content & workflows",
    "Develop detailed ROI model based on your current process costs",
    "Negotiate terms & finalize contract (SLA, IP, support levels)",
  ];
  yPos = 4.5;
  nextSteps.forEach((step, idx) => {
    slide8.addText(`${idx + 1}`, {
      x: 1.0,
      y: yPos,
      w: 0.4,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: colors.white,
      align: "center",
      fill: { color: colors.secondary },
    });
    slide8.addText(step, { x: 1.6, y: yPos + 0.05, w: 7.7, h: 0.3, fontSize: 12, color: colors.dark });
    yPos += 0.5;
  });

  pptx.writeFile({ fileName: "Top_3_Business_Models_Content_Orchestrator.pptx" });
};