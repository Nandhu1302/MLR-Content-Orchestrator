
import pptxgen from "pptxgenjs";
export const generateBusinessModelPresentation = () => {
  const pptx = new pptxgen();
  // Define color scheme
  const colors = {
    primary: "1E40AF",
    secondary: "3B82F6",
    accent: "60A5FA",
    dark: "1E293B",
    light: "F8FAFC",
    white: "FFFFFF",
    success: "10B981",
    warning: "F59E0B",
    danger: "EF4444",
  };
  // Slide 1: Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: colors.primary };
  slide1.addText("Commercial Models for\nContent Orchestrator Platform", {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 2,
    fontSize: 44,
    bold: true,
    color: colors.white,
    align: "center",
  });
  slide1.addText("Intelligence-Driven Pharmaceutical Marketing Solution", {
    x: 0.5,
    y: 3.8,
    w: 9,
    h: 0.5,
    fontSize: 24,
    color: colors.accent,
    align: "center",
  });
  slide1.addText("Business Model Strategy & IP Protection Framework", {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 0.4,
    fontSize: 18,
    color: colors.light,
    align: "center",
  });
  // Slide 2: Platform Overview
  const slide2 = pptx.addSlide();
  slide2.addText("Content Orchestrator Platform Overview", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: colors.primary,
  });
  const modules = [
    { num: "1", name: "Approved Content Library", desc: "Centralized MLR-approved asset repository" },
    { num: "2", name: "Glocalization Engine", desc: "AI-powered content adaptation for markets" },
    { num: "3", name: "Pre-MLR Validation", desc: "Automated compliance checking before submission" },
    { num: "4", name: "TM-Integrated MLR", desc: "Streamlined approval workflows with Veeva" },
    { num: "5", name: "Distribution Orchestrator", desc: "Multi-channel content deployment" },
    { num: "6", name: "ROI & Impact Analytics", desc: "Real-time performance tracking" },
  ];
  let yPos = 1.2;
  modules.forEach((mod) => {
    slide2.addText(mod.num, {
      x: 0.7,
      y: yPos,
      w: 0.4,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: colors.white,
      align: "center",
      fill: { color: colors.primary },
    });
    slide2.addText(mod.name, {
      x: 1.3,
      y: yPos,
      w: 3.5,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: colors.dark,
    });
    slide2.addText(mod.desc, {
      x: 5,
      y: yPos,
      w: 4.5,
      h: 0.4,
      fontSize: 14,
      color: colors.dark,
    });
    yPos += 0.7;
  });
  slide2.addText("Target Market: Pharmaceutical Marketing & Medical Affairs Teams", {
    x: 0.7,
    y: 5.8,
    w: 8.6,
    h: 0.4,
    fontSize: 14,
    italic: true,
    color: colors.primary,
    fill: { color: colors.light },
  });
  // Slide 3: Comparison Matrix
  const slide3 = pptx.addSlide();
  slide3.addText("Business Model Comparison Matrix", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: colors.primary,
  });
  const comparisonData = [
    [
      { text: "Model" },
      { text: "IP Protection" },
      { text: "Revenue Potential" },
      { text: "Client Investment" },
      { text: "Time to Revenue" },
      { text: "Risk" }
    ],
    [
      { text: "SaaS Licensing" },
      { text: "Highest" },
      { text: "High (Recurring)" },
      { text: "Low" },
      { text: "Fast" },
      { text: "Low" }
    ],
    [
      { text: "Private Cloud + Managed" },
      { text: "High" },
      { text: "Very High" },
      { text: "High" },
      { text: "Medium" },
      { text: "Low" }
    ],
    [
      { text: "Co-Development (Retained IP)" },
      { text: "High" },
      { text: "Medium-High" },
      { text: "Medium" },
      { text: "Medium" },
      { text: "Medium" }
    ],
    [
      { text: "Modular Co-Development" },
      { text: "High" },
      { text: "Medium" },
      { text: "Medium" },
      { text: "Fast" },
      { text: "Low" }
    ],
    [
      { text: "Industry Consortium" },
      { text: "Highest" },
      { text: "Medium" },
      { text: "Low (Per Client)" },
      { text: "Slow" },
      { text: "Low" }
    ],
    [
      { text: "Revenue-Share Co-Dev" },
      { text: "High" },
      { text: "Medium-Long" },
      { text: "Medium" },
      { text: "Medium" },
      { text: "Medium" }
    ],
    [
      { text: "Vertical-Specific Co-Dev" },
      { text: "Medium-High" },
      { text: "Medium" },
      { text: "Medium" },
      { text: "Medium" },
      { text: "Medium" }
    ],
    [
      { text: "Pilot-to-Production" },
      { text: "High" },
      { text: "Medium-High" },
      { text: "Low→High" },
      { text: "Fast" },
      { text: "Low" }
    ],
    [
      { text: "Build-Operate-Transfer" },
      { text: "Low" },
      { text: "High (Short)" },
      { text: "Very High" },
      { text: "Medium" },
      { text: "High" }
    ],
    [
      { text: "Open-Source + Commercial" },
      { text: "Low" },
      { text: "Low-Medium" },
      { text: "Low" },
      { text: "Slow" },
      { text: "High" }
    ]
  ];
  slide3.addTable(comparisonData, {
    x: 0.3,
    y: 1.0,
    w: 9.4,
    h: 4.8,
    fontSize: 10,
    border: { pt: 1, color: colors.dark },
    fill: { color: colors.light },
    color: colors.dark,
    align: "center",
    valign: "middle",
    rowH: [0.5, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45],
    colW: [2.2, 1.3, 1.5, 1.5, 1.4, 1.5],
  });
  // Model 1: SaaS Licensing
  const slide4 = pptx.addSlide();
  slide4.addText("Model 1: SaaS Licensing (Multi-Tenant)", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide4.addText("Highest IP Protection • Recurring Revenue", {
    x: 0.5,
    y: 0.85,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.secondary,
    italic: true,
  });
  slide4.addText("How It Works:", { x: 0.7, y: 1.4, fontSize: 18, bold: true, color: colors.dark });
  slide4.addText([
    { text: "• Client subscribes to platform hosted on your infrastructure\n", options: { bullet: false } },
    { text: "• Annual licensing fee per user or per module\n", options: { bullet: false } },
    { text: "• You maintain 100% IP ownership\n", options: { bullet: false } },
    { text: "• Regular updates and feature releases included\n", options: { bullet: false } },
    { text: "• Multi-tenant architecture with data isolation", options: { bullet: false } },
  ], { x: 0.9, y: 1.8, w: 8.1, fontSize: 14, color: colors.dark, lineSpacing: 28 });
  slide4.addText("Revenue Structure:", { x: 0.7, y: 3.3, fontSize: 18, bold: true, color: colors.dark });
  slide4.addText("$150K-500K annual per client (depends on users/modules)", {
    x: 0.9, y: 3.7, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide4.addText("Best Suited For:", { x: 0.7, y: 4.2, fontSize: 18, bold: true, color: colors.dark });
  slide4.addText("Mid-to-large pharma companies comfortable with cloud solutions", {
    x: 0.9, y: 4.6, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide4.addText("Pros:", { x: 0.7, y: 5.1, fontSize: 16, bold: true, color: colors.success });
  slide4.addText("Predictable revenue • Scalable • Full IP control", {
    x: 0.9, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  slide4.addText("Cons:", { x: 5.2, y: 5.1, fontSize: 16, bold: true, color: colors.danger });
  slide4.addText("Requires trust in cloud security", {
    x: 5.4, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  // Model 2: Private Cloud Deployment
  const slide5 = pptx.addSlide();
  slide5.addText("Model 2: Private Cloud Deployment + Managed Service", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 26,
    bold: true,
    color: colors.primary,
  });
  slide5.addText("High IP Protection • Enterprise Compliance", {
    x: 0.5,
    y: 0.85,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.secondary,
    italic: true,
  });
  slide5.addText("How It Works:", { x: 0.7, y: 1.4, fontSize: 18, bold: true, color: colors.dark });
  slide5.addText([
    { text: "• Platform deployed in client's AWS/Azure environment\n", options: { bullet: false } },
    { text: "• Your team manages deployment, updates, and support\n", options: { bullet: false } },
    { text: "• Client pays licensing fee + managed service fee\n", options: { bullet: false } },
    { text: "• Code remains obfuscated/containerized\n", options: { bullet: false } },
    { text: "• Meets strict compliance requirements (21 CFR Part 11)", options: { bullet: false } },
  ], { x: 0.9, y: 1.8, w: 8.1, fontSize: 14, color: colors.dark, lineSpacing: 28 });
  slide5.addText("Revenue Structure:", { x: 0.7, y: 3.3, fontSize: 18, bold: true, color: colors.dark });
  slide5.addText("$300K-800K implementation + $150K-300K annual managed service", {
    x: 0.9, y: 3.7, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide5.addText("Best Suited For:", { x: 0.7, y: 4.2, fontSize: 18, bold: true, color: colors.dark });
  slide5.addText("Large pharma with data residency/compliance requirements", {
    x: 0.9, y: 4.6, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide5.addText("Pros:", { x: 0.7, y: 5.1, fontSize: 16, bold: true, color: colors.success });
  slide5.addText("High upfront revenue • IP protected • Enterprise-grade", {
    x: 0.9, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  slide5.addText("Cons:", { x: 5.2, y: 5.1, fontSize: 16, bold: true, color: colors.danger });
  slide5.addText("Complex deployment • Ongoing support burden", {
    x: 5.4, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  // Model 3: Co-Development with Retained IP
  const slide6 = pptx.addSlide();
  slide6.addText("Model 3: Co-Development with Retained IP Rights", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 26,
    bold: true,
    color: colors.primary,
  });
  slide6.addText("Hybrid Model • Shared Investment", {
    x: 0.5,
    y: 0.85,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.secondary,
    italic: true,
  });
  slide6.addText("How It Works:", { x: 0.7, y: 1.4, fontSize: 18, bold: true, color: colors.dark });
  slide6.addText([
    { text: "• Client co-funds platform development (30-50% of costs)\n", options: { bullet: false } },
    { text: "• Your company retains 100% IP ownership\n", options: { bullet: false } },
    { text: "• Client gets priority feature development\n", options: { bullet: false } },
    { text: "• Client receives discounted licensing for 3-5 years\n", options: { bullet: false } },
    { text: "• You can resell enhanced platform to other clients", options: { bullet: false } },
  ], { x: 0.9, y: 1.8, w: 8.1, fontSize: 14, color: colors.dark, lineSpacing: 28 });
  slide6.addText("Revenue Structure:", { x: 0.7, y: 3.3, fontSize: 18, bold: true, color: colors.dark });
  slide6.addText("$400K-1M co-development + $75K-150K annual (discounted)", {
    x: 0.9, y: 3.7, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide6.addText("Best Suited For:", { x: 0.7, y: 4.2, fontSize: 18, bold: true, color: colors.dark });
  slide6.addText("Forward-thinking clients willing to invest in innovation", {
    x: 0.9, y: 4.6, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide6.addText("Pros:", { x: 0.7, y: 5.1, fontSize: 16, bold: true, color: colors.success });
  slide6.addText("De-risks development • Faster MVP • Keep IP", {
    x: 0.9, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  slide6.addText("Cons:", { x: 5.2, y: 5.1, fontSize: 16, bold: true, color: colors.danger });
  slide6.addText("Lower margins initially • Complex contracts", {
    x: 5.4, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  // Model 4: Modular Co-Development
  const slide7 = pptx.addSlide();
  slide7.addText("Model 4: Modular Co-Development with Feature Licensing", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 24,
    bold: true,
    color: colors.primary,
  });
  slide7.addText("Module-Specific Investment • Flexible Engagement", {
    x: 0.5,
    y: 0.85,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.secondary,
    italic: true,
  });
  slide7.addText("How It Works:", { x: 0.7, y: 1.4, fontSize: 18, bold: true, color: colors.dark });
  slide7.addText([
    { text: "• Client selects specific modules to co-develop (e.g., Glocalization + Pre-MLR)\n", options: { bullet: false } },
    { text: "• Client pays 50-70% of module development costs\n", options: { bullet: false } },
    { text: "• Your company retains IP on all co-developed modules\n", options: { bullet: false } },
    { text: "• Client gets perpetual license for modules they funded\n", options: { bullet: false } },
    { text: "• You can sell same modules to other clients immediately", options: { bullet: false } },
  ], { x: 0.9, y: 1.8, w: 8.1, fontSize: 14, color: colors.dark, lineSpacing: 28 });
  slide7.addText("Revenue Structure:", { x: 0.7, y: 3.3, fontSize: 18, bold: true, color: colors.dark });
  slide7.addText("$150K-300K per module + $20K-30K annual maintenance per module", {
    x: 0.9, y: 3.7, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide7.addText("Best Suited For:", { x: 0.7, y: 4.2, fontSize: 18, bold: true, color: colors.dark });
  slide7.addText("Clients with specific pain points wanting targeted solutions", {
    x: 0.9, y: 4.6, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide7.addText("Pros:", { x: 0.7, y: 5.1, fontSize: 16, bold: true, color: colors.success });
  slide7.addText("Lower commitment • Quick wins • High IP protection", {
    x: 0.9, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  slide7.addText("Cons:", { x: 5.2, y: 5.1, fontSize: 16, bold: true, color: colors.danger });
  slide7.addText("Smaller revenue per deal initially", {
    x: 5.4, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  // Model 5: Industry Consortium
  const slide8 = pptx.addSlide();
  slide8.addText("Model 5: Industry Consortium Model", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide8.addText("Shared Investment • De-Risked Development", {
    x: 0.5,
    y: 0.85,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.secondary,
    italic: true,
  });
  slide8.addText("How It Works:", { x: 0.7, y: 1.4, fontSize: 18, bold: true, color: colors.dark });
  slide8.addText([
    { text: "• 3-5 pharma companies co-fund platform development\n", options: { bullet: false } },
    { text: "• Each pays 20-30% of total development costs\n", options: { bullet: false } },
    { text: "• Your company retains 100% IP ownership\n", options: { bullet: false } },
    { text: "• Consortium members get preferential licensing rates (30-40% discount)\n", options: { bullet: false } },
    { text: "• Members get early access and influence roadmap", options: { bullet: false } },
  ], { x: 0.9, y: 1.8, w: 8.1, fontSize: 14, color: colors.dark, lineSpacing: 28 });
  slide8.addText("Revenue Structure:", { x: 0.7, y: 3.3, fontSize: 18, bold: true, color: colors.dark });
  slide8.addText("$200K-400K per consortium member + $100K-150K annual each", {
    x: 0.9, y: 3.7, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide8.addText("Best Suited For:", { x: 0.7, y: 4.2, fontSize: 18, bold: true, color: colors.dark });
  slide8.addText("Industry-wide challenges where collaboration is valued", {
    x: 0.9, y: 4.6, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide8.addText("Pros:", { x: 0.7, y: 5.1, fontSize: 16, bold: true, color: colors.success });
  slide8.addText("Highest IP protection • Multiple revenue streams • Lower risk", {
    x: 0.9, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  slide8.addText("Cons:", { x: 5.2, y: 5.1, fontSize: 16, bold: true, color: colors.danger });
  slide8.addText("Complex coordination • Slower decision-making", {
    x: 5.4, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  // Model 6: Revenue-Share Co-Development
  const slide9 = pptx.addSlide();
  slide9.addText("Model 6: Revenue-Share Co-Development", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide9.addText("Cautious Approach • Time-Limited Revenue Share", {
    x: 0.5,
    y: 0.85,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.secondary,
    italic: true,
  });
  slide9.addText("How It Works:", { x: 0.7, y: 1.4, fontSize: 18, bold: true, color: colors.dark });
  slide9.addText([
    { text: "• Client co-funds development (40-60% of costs)\n", options: { bullet: false } },
    { text: "• In exchange, they get 10-15% revenue share on future sales\n", options: { bullet: false } },
    { text: "• You retain 100% IP ownership (explicit in contract)\n", options: { bullet: false } },
    { text: "• Revenue share limited to 3-5 years or until client recoups 2x investment\n", options: { bullet: false } },
    { text: "• After sunset period, standard licensing applies", options: { bullet: false } },
  ], { x: 0.9, y: 1.8, w: 8.1, fontSize: 14, color: colors.dark, lineSpacing: 28 });
  slide9.addText("Revenue Structure:", { x: 0.7, y: 3.3, fontSize: 18, bold: true, color: colors.dark });
  slide9.addText("$300K-600K upfront + 10-15% revenue share (time-limited)", {
    x: 0.9, y: 3.7, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide9.addText("Best Suited For:", { x: 0.7, y: 4.2, fontSize: 18, bold: true, color: colors.dark });
  slide9.addText("Strategic partners wanting aligned success without equity claims", {
    x: 0.9, y: 4.6, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide9.addText("Pros:", { x: 0.7, y: 5.1, fontSize: 16, bold: true, color: colors.success });
  slide9.addText("Maintains IP control • Attracts serious partners", {
    x: 0.9, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  slide9.addText("Cons:", { x: 5.2, y: 5.1, fontSize: 16, bold: true, color: colors.danger });
  slide9.addText("Lower margins initially • Complex accounting", {
    x: 5.4, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  // Model 7: Vertical-Specific Co-Development
  const slide10 = pptx.addSlide();
  slide10.addText("Model 7: Vertical-Specific Co-Development", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide10.addText("Therapeutic Area Customization • Category Exclusivity", {
    x: 0.5,
    y: 0.85,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.secondary,
    italic: true,
  });
  slide10.addText("How It Works:", { x: 0.7, y: 1.4, fontSize: 18, bold: true, color: colors.dark });
  slide10.addText([
    { text: "• Client funds customization for their therapeutic area (oncology, rare disease, etc.)\n", options: { bullet: false } },
    { text: "• Core platform remains your IP; therapeutic features jointly owned\n", options: { bullet: false } },
    { text: "• Client gets 2-year exclusive use in their category\n", options: { bullet: false } },
    { text: "• After exclusivity, you can sell to other companies in same category\n", options: { bullet: false } },
    { text: "• Learnings applied to build other therapeutic modules", options: { bullet: false } },
  ], { x: 0.9, y: 1.8, w: 8.1, fontSize: 14, color: colors.dark, lineSpacing: 28 });
  slide10.addText("Revenue Structure:", { x: 0.7, y: 3.3, fontSize: 18, bold: true, color: colors.dark });
  slide10.addText("$250K-500K customization + $50K exclusivity premium + $100K-200K annual", {
    x: 0.9, y: 3.7, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide10.addText("Best Suited For:", { x: 0.7, y: 4.2, fontSize: 18, bold: true, color: colors.dark });
  slide10.addText("Category leaders wanting competitive advantage in specific therapeutic areas", {
    x: 0.9, y: 4.6, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide10.addText("Pros:", { x: 0.7, y: 5.1, fontSize: 16, bold: true, color: colors.success });
  slide10.addText("Clear IP boundaries • Premium for exclusivity", {
    x: 0.9, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  slide10.addText("Cons:", { x: 5.2, y: 5.1, fontSize: 16, bold: true, color: colors.danger });
  slide10.addText("Medium IP protection • Potential disputes", {
    x: 5.4, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  // Model 8: Pilot-to-Production
  const slide11 = pptx.addSlide();
  slide11.addText("Model 8: Pilot-to-Production Co-Development", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide11.addText("Staged Investment • Risk Mitigation", {
    x: 0.5,
    y: 0.85,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.secondary,
    italic: true,
  });
  slide11.addText("How It Works:", { x: 0.7, y: 1.4, fontSize: 18, bold: true, color: colors.dark });
  slide11.addText([
    { text: "• Phase 1: Client pays for pilot (3-4 months, $150K-250K)\n", options: { bullet: false } },
    { text: "• Phase 2: If successful, client co-funds production version (40% of costs)\n", options: { bullet: false } },
    { text: "• You retain IP from pilot phase onwards (established early)\n", options: { bullet: false } },
    { text: "• Client gets preferred pricing and unlimited user licenses\n", options: { bullet: false } },
    { text: "• Proof of concept reduces risk for both parties", options: { bullet: false } },
  ], { x: 0.9, y: 1.8, w: 8.1, fontSize: 14, color: colors.dark, lineSpacing: 28 });
  slide11.addText("Revenue Structure:", { x: 0.7, y: 3.3, fontSize: 18, bold: true, color: colors.dark });
  slide11.addText("Phase 1: $150K-250K \n Phase 2: $300K-600K + $100K-200K annual", {
    x: 0.9, y: 3.7, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide11.addText("Best Suited For:", { x: 0.7, y: 4.2, fontSize: 18, bold: true, color: colors.dark });
  slide11.addText("Risk-averse clients wanting proof before full commitment", {
    x: 0.9, y: 4.6, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide11.addText("Pros:", { x: 0.7, y: 5.1, fontSize: 16, bold: true, color: colors.success });
  slide11.addText("De-risked approach • Early revenue • High IP protection", {
    x: 0.9, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  slide11.addText("Cons:", { x: 5.2, y: 5.1, fontSize: 16, bold: true, color: colors.danger });
  slide11.addText("Longer sales cycle • Pilot may not convert", {
    x: 5.4, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  // Model 9: Build-Operate-Transfer
  const slide12 = pptx.addSlide();
  slide12.addText("Model 9: Build-Operate-Transfer (BOT)", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.primary,
  });
  slide12.addText("⚠️ Use With Caution • Low IP Protection", {
    x: 0.5,
    y: 0.85,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.warning,
    italic: true,
  });
  slide12.addText("How It Works:", { x: 0.7, y: 1.4, fontSize: 18, bold: true, color: colors.dark });
  slide12.addText([
    { text: "• Build custom solution for client (6-12 months)\n", options: { bullet: false } },
    { text: "• Operate and support for 2-3 years\n", options: { bullet: false } },
    { text: "• Transfer full ownership to client at end of period\n", options: { bullet: false } },
    { text: "• High upfront fees but lose IP after transfer\n", options: { bullet: false } },
    { text: "• Only viable for client-specific versions, NOT core product", options: { bullet: false } },
  ], { x: 0.9, y: 1.8, w: 8.1, fontSize: 14, color: colors.dark, lineSpacing: 28 });
  slide12.addText("Revenue Structure:", { x: 0.7, y: 3.3, fontSize: 18, bold: true, color: colors.dark });
  slide12.addText("$800K-1.5M build + $200K-400K annual operations (2-3 years)", {
    x: 0.9, y: 3.7, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide12.addText("Best Suited For:", { x: 0.7, y: 4.2, fontSize: 18, bold: true, color: colors.dark });
  slide12.addText("One-off highly customized implementations (NOT recommended for core platform)", {
    x: 0.9, y: 4.6, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide12.addText("Pros:", { x: 0.7, y: 5.1, fontSize: 16, bold: true, color: colors.success });
  slide12.addText("Very high upfront revenue • Clients love it", {
    x: 0.9, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  slide12.addText("Cons:", { x: 5.2, y: 5.1, fontSize: 16, bold: true, color: colors.danger });
  slide12.addText("Lose IP permanently • No recurring revenue post-transfer", {
    x: 5.4, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  // Model 10: Open-Source + Commercial
  const slide13 = pptx.addSlide();
  slide13.addText("Model 10: Open-Source Core + Commercial Extensions", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 24,
    bold: true,
    color: colors.primary,
  });
  slide13.addText("❌ Not Recommended for Pharma • Low Monetization", {
    x: 0.5,
    y: 0.85,
    w: 9,
    h: 0.3,
    fontSize: 16,
    color: colors.danger,
    italic: true,
  });
  slide13.addText("How It Works:", { x: 0.7, y: 1.4, fontSize: 18, bold: true, color: colors.dark });
  slide13.addText([
    { text: "• Release basic platform as open-source\n", options: { bullet: false } },
    { text: "• Charge for enterprise features, support, and compliance modules\n", options: { bullet: false } },
    { text: "• Build community and market awareness\n", options: { bullet: false } },
    { text: "• Core IP becomes public; only extensions are protected\n", options: { bullet: false } },
    { text: "• Pharma companies unlikely to adopt due to compliance concerns", options: { bullet: false } },
  ], { x: 0.9, y: 1.8, w: 8.1, fontSize: 14, color: colors.dark, lineSpacing: 28 });
  slide13.addText("Revenue Structure:", { x: 0.7, y: 3.3, fontSize: 18, bold: true, color: colors.dark });
  slide13.addText("$50K-150K annual per enterprise client (low monetization potential)", {
    x: 0.9, y: 3.7, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide13.addText("Best Suited For:", { x: 0.7, y: 4.2, fontSize: 18, bold: true, color: colors.dark });
  slide13.addText("Developer tools and infrastructure (NOT pharma/regulated industries)", {
    x: 0.9, y: 4.6, w: 8.1, fontSize: 14, color: colors.dark,
  });
  slide13.addText("Pros:", { x: 0.7, y: 5.1, fontSize: 16, bold: true, color: colors.success });
  slide13.addText("Community building • Market awareness", {
    x: 0.9, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  slide13.addText("Cons:", { x: 5.2, y: 5.1, fontSize: 16, bold: true, color: colors.danger });
  slide13.addText("Low IP protection • Weak monetization • Compliance concerns", {
    x: 5.4, y: 5.4, w: 3.8, fontSize: 12, color: colors.dark,
  });
  // Slide 14: Recommended Approach
  const slide14 = pptx.addSlide();
  slide14.addText("Recommended Approach for First Client", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: colors.primary,
  });
  slide14.addText("Top 3 Models for Initial Sales:", { x: 0.7, y: 1.2, fontSize: 20, bold: true, color: colors.dark });
  slide14.addText("1", {
    x: 0.9,
    y: 1.8,
    w: 0.4,
    h: 0.4,
    fontSize: 20,
    bold: true,
    color: colors.white,
    align: "center",
    fill: { color: colors.success },
  });
  slide14.addText("Private Cloud Deployment + Managed Service", {
    x: 1.5, y: 1.85, w: 7.5, fontSize: 16, bold: true, color: colors.dark,
  });
  slide14.addText("High revenue, meets compliance needs, protects IP", {
    x: 1.5, y: 2.15, w: 7.5, fontSize: 12, color: colors.dark, italic: true,
  });
  slide14.addText("2", {
    x: 0.9,
    y: 2.6,
    w: 0.4,
    h: 0.4,
    fontSize: 20,
    bold: true,
    color: colors.white,
    align: "center",
    fill: { color: colors.secondary },
  });
  slide14.addText("Pilot-to-Production Co-Development", {
    x: 1.5, y: 2.65, w: 7.5, fontSize: 16, bold: true, color: colors.dark,
  });
  slide14.addText("De-risks for client, staged revenue, maintains IP control", {
    x: 1.5, y: 2.95, w: 7.5, fontSize: 12, color: colors.dark, italic: true,
  });
  slide14.addText("3", {
    x: 0.9,
    y: 3.4,
    w: 0.4,
    h: 0.4,
    fontSize: 20,
    bold: true,
    color: colors.white,
    align: "center",
    fill: { color: colors.accent },
  });
  slide14.addText("Modular Co-Development with Feature Licensing", {
    x: 1.5, y: 3.45, w: 7.5, fontSize: 16, bold: true, color: colors.dark,
  });
  slide14.addText("Lower commitment, quick wins, full IP protection", {
    x: 1.5, y: 3.75, w: 7.5, fontSize: 12, color: colors.dark, italic: true,
  });
  slide14.addText("Risk Mitigation Strategies:", { x: 0.7, y: 4.4, fontSize: 18, bold: true, color: colors.dark });
  slide14.addText([
    { text: "• Always establish IP ownership in writing before starting work\n", options: { bullet: false } },
    { text: "• Use phased payments tied to milestones\n", options: { bullet: false } },
    { text: "• Include termination clauses that protect your IP\n", options: { bullet: false } },
    { text: "• Start with smaller scope to prove value before full platform sale", options: { bullet: false } },
  ], { x: 0.9, y: 4.8, w: 8.1, fontSize: 13, color: colors.dark, lineSpacing: 26 });
  // Slide 15: Legal & IP Protection
  const slide15 = pptx.addSlide();
  slide15.addText("Legal & IP Protection Essentials", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: colors.primary,
  });
  slide15.addText("Critical Contract Clauses:", { x: 0.7, y: 1.1, fontSize: 18, bold: true, color: colors.dark });
  slide15.addText([
    { text: "✓ Explicit IP Ownership: 'All intellectual property, including source code, algorithms, and documentation, remains the sole property of [Your Company]'\n", options: { bullet: false } },
    { text: "✓ License Grant: 'Client receives a non-exclusive, non-transferable license to use the Software'\n", options: { bullet: false } },
    { text: "✓ No Reverse Engineering: 'Client shall not decompile, reverse engineer, or attempt to derive source code'\n", options: { bullet: false } },
    { text: "✓ Confidentiality: 'All proprietary algorithms, architectures, and methodologies are confidential'", options: { bullet: false } },
  ], { x: 0.7, y: 1.5, w: 8.5, fontSize: 11, color: colors.dark, lineSpacing: 32 });
  slide15.addText("Red Flags to Avoid in Client Discussions:", { x: 0.7, y: 3.4, fontSize: 18, bold: true, color: colors.danger });
  slide15.addText([
    { text: "✗ 'We need to own the code' → Counteroffer: Licensed usage rights\n", options: { bullet: false } },
    { text: "✗ 'Can we white-label this?' → Only if they pay 3-5x market rate\n", options: { bullet: false } },
    { text: "✗ 'Revenue-share instead of fees' → Only if time-limited with IP retained\n", options: { bullet: false } },
    { text: "✗ 'We'll give you equity for the code' → Never trade IP for equity", options: { bullet: false } },
  ], { x: 0.7, y: 3.8, w: 8.5, fontSize: 11, color: colors.dark, lineSpacing: 30 });
  slide15.addText("Recommended Legal Structure:", { x: 0.7, y: 5.0, fontSize: 18, bold: true, color: colors.dark });
  slide15.addText("Master Service Agreement (MSA) + Statement of Work (SOW) for each engagement", {
    x: 0.7, y: 5.4, w: 8.5, fontSize: 13, color: colors.dark,
  });
  // Slide 16: Pricing Framework
  const slide16 = pptx.addSlide();
  slide16.addText("Pricing Framework & ROI Justification", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: colors.primary,
  });
  slide16.addText("Sample Pricing Ranges by Model:", { x: 0.7, y: 1.1, fontSize: 18, bold: true, color: colors.dark });
  const pricingData = [
    [
      { text: "Model" },
      { text: "Upfront" },
      { text: "Annual Recurring" },
      { text: "3-Year Total" }
    ],
    [
      { text: "SaaS Licensing" },
      { text: "$0" },
      { text: "$150K-500K" },
      { text: "$450K-1.5M" }
    ],
    [
      { text: "Private Cloud + Managed" },
      { text: "$300K-800K" },
      { text: "$150K-300K" },
      { text: "$750K-1.7M" }
    ],
    [
      { text: "Co-Development (Retained IP)" },
      { text: "$400K-1M" },
      { text: "$75K-150K" },
      { text: "$625K-1.3M" }
    ],
    [
      { text: "Modular Co-Development" },
      { text: "$150K-300K" },
      { text: "$20K-30K/mod" },
      { text: "$210K-390K" }
    ],
    [
      { text: "Pilot-to-Production" },
      { text: "$150K-250K" },
      { text: "$100K-200K" },
      { text: "$450K-850K" }
    ]
  ];
  slide16.addTable(pricingData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 2.2,
    fontSize: 11,
    border: { pt: 1, color: colors.dark },
    fill: { color: colors.light },
    color: colors.dark,
    align: "center",
    valign: "middle",
    colW: [3.0, 1.5, 2.0, 2.5],
  });
  slide16.addText("Client ROI Justification:", { x: 0.7, y: 4.0, fontSize: 18, bold: true, color: colors.dark });
  slide16.addText([
    { text: "• Platform delivers $3.1M annual value for typical large pharma client\n", options: { bullet: false } },
    { text: "• ROI: 310-620% in Year 1 (depending on model)\n", options: { bullet: false } },
    { text: "• Payback period: 3-6 months\n", options: { bullet: false } },
    { text: "• 35% faster time-to-market for promotional content\n", options: { bullet: false } },
    { text: "• 50% reduction in MLR approval cycles", options: { bullet: false } },
  ], { x: 0.9, y: 4.4, w: 8.1, fontSize: 13, color: colors.dark, lineSpacing: 28 });
  // Slide 17: Next Steps
  const slide17 = pptx.addSlide();
  slide17.addText("Next Steps & Decision Framework", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: colors.primary,
  });
  slide17.addText("Decision Framework for Selecting Model:", { x: 0.7, y: 1.2, fontSize: 18, bold: true, color: colors.dark });
  slide17.addText("If Client Says...", { x: 1.0, y: 1.7, w: 4.0, fontSize: 14, bold: true, color: colors.secondary });
  slide17.addText("Recommend Model...", { x: 5.2, y: 1.7, w: 4.0, fontSize: 14, bold: true, color: colors.secondary });
  const decisionMap = [
    ["'We need strict data control'", "→ Private Cloud Deployment"],
    ["'We want to prove value first'", "→ Pilot-to-Production"],
    ["'We only need specific modules'", "→ Modular Co-Development"],
    ["'We want to co-invest'", "→ Co-Development (Retained IP)"],
    ["'We prefer cloud solutions'", "→ SaaS Licensing"],
  ];
  let yPos2 = 2.1;
  decisionMap.forEach((row) => {
    slide17.addText(row[0], { x: 1.0, y: yPos2, w: 3.8, fontSize: 12, color: colors.dark });
    slide17.addText(row[1], { x: 5.2, y: yPos2, w: 3.8, fontSize: 12, bold: true, color: colors.primary });
    yPos2 += 0.4;
  });
  slide17.addText("Due Diligence Checklist Before Engagement:", { x: 0.7, y: 3.9, fontSize: 18, bold: true, color: colors.dark });
  slide17.addText([
    { text: "□ Verify client's budget authority and timeline\n", options: { bullet: false } },
    { text: "□ Confirm decision-making process and stakeholders\n", options: { bullet: false } },
    { text: "□ Review their current MarTech stack and integration needs\n", options: { bullet: false } },
    { text: "□ Assess their IT security and compliance requirements\n", options: { bullet: false } },
    { text: "□ Draft and review MSA with IP protection clauses", options: { bullet: false } },
  ], { x: 0.9, y: 4.3, w: 8.1, fontSize: 13, color: colors.dark, lineSpacing: 28 });
  slide17.addText("Ready to discuss your specific client scenario?", {
    x: 0.5,
    y: 5.8,
    w: 9,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: colors.primary,
    align: "center",
  });
  // Generate and save
  pptx.writeFile({ fileName: "Content_Orchestrator_Business_Models.pptx" });
}