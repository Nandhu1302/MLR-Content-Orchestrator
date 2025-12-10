
import pptxgen from 'pptxgenjs';
import {
  industryProblems,
  clientPainPoints,
  hiddenCosts,
  earlyAdopterResults,
  demoProofPoints,
  competitiveFeatures,
  riskMatrix,
  implementationPhases,
  successMetrics,
  securityCompliance,
  integrationSystems,
} from './marketingDeckData';

const COGNIZANT_COLORS = {
  blue: '0033A0',
  lightBlue: '00A3E0',
  orange: 'FF6900',
  darkGray: '53565A',
  lightGray: 'A7A8AA',
  green: '00B140',
  white: 'FFFFFF',
};

export const exportMarketingDeckToPPT = async (progressCallback) => {
  const pptx = new pptxgen();

  // Presentation settings
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Content Orchestrator';
  pptx.company = 'Cognizant';
  pptx.title = 'Content Orchestrator Marketing Deck';
  pptx.subject = 'Pharmaceutical Content Operations Platform';

  const updateProgress = (current, total) => {
    if (typeof progressCallback === 'function') {
      progressCallback(Math.round((current / total) * 100));
    }
  };

  // Slide 1: Title
  let slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Content Orchestrator', {
    x: 1, y: 2.5, w: 11.33, h: 1.2,
    fontSize: 60, bold: true, color: COGNIZANT_COLORS.blue, align: 'center',
  });
  slide.addText('Intelligence-Driven Pharmaceutical Content Operations', {
    x: 1, y: 3.8, w: 11.33, h: 0.6,
    fontSize: 28, color: COGNIZANT_COLORS.darkGray, align: 'center',
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 3.5, y: 5, w: 6.33, h: 1.2,
    fill: { color: COGNIZANT_COLORS.blue, transparency: 10 },
    line: { color: COGNIZANT_COLORS.blue, width: 2 },
  });
  slide.addText('$4.3M Annual Value', {
    x: 3.5, y: 5.15, w: 6.33, h: 0.5,
    fontSize: 36, bold: true, color: COGNIZANT_COLORS.blue, align: 'center',
  });
  slide.addText('Per Brand \n Validated by 3 Pharma Clients', {
    x: 3.5, y: 5.7, w: 6.33, h: 0.3,
    fontSize: 18, color: COGNIZANT_COLORS.darkGray, align: 'center',
  });
  slide.addNotes('Opening slide: Establish the platform value proposition immediately. Emphasize the $4.3M validated ROI.');
  updateProgress(1, 18);

  // Slide 2: Industry Problem
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('The Industry Challenge', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  slide.addText('Pharmaceutical content operations are broken', {
    x: 0.5, y: 1, w: 12.33, h: 0.4,
    fontSize: 24, color: COGNIZANT_COLORS.darkGray,
  });
  const problems = industryProblems.slice(0, 4);
  problems.forEach((problem, i) => {
    const x = 0.5 + (i % 2) * 6.5;
    const y = 1.8 + Math.floor(i / 2) * 2.2;
    slide.addShape(pptx.ShapeType.rect, {
      x, y, w: 6, h: 2,
      fill: { color: COGNIZANT_COLORS.orange, transparency: 90 },
      line: { color: COGNIZANT_COLORS.orange, width: 2 },
    });
    slide.addText(problem.percentage, {
      x, y: y + 0.2, w: 6, h: 0.6,
      fontSize: 40, bold: true, color: COGNIZANT_COLORS.orange, align: 'center',
    });
    slide.addText(problem.label, {
      x, y: y + 0.85, w: 6, h: 0.4,
      fontSize: 18, bold: true, color: COGNIZANT_COLORS.darkGray, align: 'center',
    });
    slide.addText(problem.impact, {
      x, y: y + 1.3, w: 6, h: 0.5,
      fontSize: 14, color: COGNIZANT_COLORS.darkGray, align: 'center',
    });
  });
  slide.addNotes('Present the harsh reality: 60% rework, 8-week cycles, 80% manual work, $10M+ violations. Let the numbers speak.');
  updateProgress(2, 18);

  // Slide 3: Client Reality
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Your Current Reality', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  clientPainPoints.slice(0, 4).forEach((pain, i) => {
    const y = 1.4 + i * 1.4;
    slide.addText(`${pain.area}: ${pain.cost}`, {
      x: 0.5, y, w: 12.33, h: 0.4,
      fontSize: 18, bold: true, color: COGNIZANT_COLORS.orange,
    });
    pain.symptoms.slice(0, 2).forEach((symptom, j) => {
      slide.addText(`• ${symptom}`, {
        x: 1, y: y + 0.45 + j * 0.3, w: 11.33, h: 0.25,
        fontSize: 14, color: COGNIZANT_COLORS.darkGray,
      });
    });
  });
  slide.addNotes('Connect with their daily pain: MLR bottlenecks, localization nightmares, fragmented tools, strategic disconnect.');
  updateProgress(3, 18);

  // Slide 4: Hidden Costs
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('The Hidden Costs', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  hiddenCosts.forEach((cost, i) => {
    const x = 0.5 + (i % 2) * 6.5;
    const y = 1.5 + Math.floor(i / 2) * 2.5;
    slide.addShape(pptx.ShapeType.rect, {
      x, y, w: 6, h: 2.2,
      fill: { color: COGNIZANT_COLORS.white },
      line: { color: COGNIZANT_COLORS.orange, width: 2 },
    });
    slide.addText(cost.category, {
      x, y: y + 0.2, w: 6, h: 0.4,
      fontSize: 20, bold: true, color: COGNIZANT_COLORS.orange, align: 'center',
    });
    cost.items.slice(0, 3).forEach((item, j) => {
      slide.addText(`• ${item}`, {
        x: x + 0.3, y: y + 0.7 + j * 0.35, w: 5.4, h: 0.3,
        fontSize: 12, color: COGNIZANT_COLORS.darkGray,
      });
    });
  });
  slide.addNotes('Expose the true cost: opportunity loss, team burnout, brand inconsistency, compliance risk.');
  updateProgress(4, 18);

  // Slide 5: Solution
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Our Solution', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  slide.addText('Single Platform, End-to-End Workflow', {
    x: 0.5, y: 1, w: 12.33, h: 0.4,
    fontSize: 24, color: COGNIZANT_COLORS.darkGray,
  });
  const modules = ['Initiative Hub', 'Strategy & Insights', 'Content Studio', 'Design Studio', 'Pre-MLR', 'Glocalization'];
  modules.forEach((module, i) => {
    const x = 0.8 + i * 2;
    slide.addShape(pptx.ShapeType.rect, {
      x, y: 2.5, w: 1.6, h: 1.6,
      fill: { color: COGNIZANT_COLORS.lightBlue, transparency: 20 },
      line: { color: COGNIZANT_COLORS.blue, width: 2 },
    });
    slide.addText(module, {
      x, y: 4.3, w: 1.6, h: 0.4,
      fontSize: 11, bold: true, color: COGNIZANT_COLORS.darkGray, align: 'center',
    });
    if (i < modules.length - 1) {
      slide.addText('→', {
        x: x + 1.7, y: 3.1, w: 0.2, h: 0.4,
        fontSize: 20, color: COGNIZANT_COLORS.lightBlue, align: 'center',
      });
    }
  });
  slide.addNotes('Present the solution: 6 integrated modules working together from strategy to execution.');
  updateProgress(5, 18);

  // Slide 6: Intelligence
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('The Differentiator', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  slide.addText('5-Layer Intelligence Engine', {
    x: 0.5, y: 1, w: 12.33, h: 0.4,
    fontSize: 28, bold: true, color: COGNIZANT_COLORS.lightBlue,
  });
  const layers = ['Brand Intelligence', 'Competitive Intelligence', 'Market Intelligence', 'Regulatory Intelligence', 'Public Sentiment'];
  layers.forEach((layer, i) => {
    const x = 1.2 + i * 2.2;
    slide.addShape(pptx.ShapeType.ellipse, {
      x, y: 2.5, w: 1.8, h: 1.8,
      fill: { color: COGNIZANT_COLORS.blue },
    });
    slide.addText(layer, {
      x, y: 4.5, w: 1.8, h: 0.6,
      fontSize: 12, bold: true, color: COGNIZANT_COLORS.darkGray, align: 'center', valign: 'top',
    });
  });
  slide.addNotes('Emphasize what makes us unique: 5 intelligence layers informing every content decision in real-time.');
  updateProgress(6, 18);

  // Slide 7: Workflow Detail
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Before vs After', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });

  // Before column
  slide.addText('Before: Fragmented & Manual', {
    x: 0.5, y: 1.3, w: 6, h: 0.4,
    fontSize: 20, bold: true, color: COGNIZANT_COLORS.orange,
  });
  ['Email briefs', 'Multiple tools', '8-week cycles', '60% rework rate'].forEach((item, i) => {
    slide.addText(`✗ ${item}`, {
      x: 0.8, y: 1.9 + i * 0.5, w: 5.5, h: 0.4,
      fontSize: 16, color: COGNIZANT_COLORS.darkGray,
    });
  });

  // After column
  slide.addText('After: Unified & Intelligent', {
    x: 6.8, y: 1.3, w: 6, h: 0.4,
    fontSize: 20, bold: true, color: COGNIZANT_COLORS.green,
  });
  ['Single platform', 'Automated workflows', '3-week cycles', '88% first-pass approval'].forEach((item, i) => {
    slide.addText(`✓ ${item}`, {
      x: 7.1, y: 1.9 + i * 0.5, w: 5.5, h: 0.4,
      fontSize: 16, color: COGNIZANT_COLORS.darkGray,
    });
  });
  slide.addNotes('Show the transformation: from fragmented chaos to unified intelligence.');
  updateProgress(7, 18);

  // Slide 8: Integration
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Seamless Integration', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  slide.addText('Works with your existing ecosystem', {
    x: 0.5, y: 1, w: 12.33, h: 0.4,
    fontSize: 24, color: COGNIZANT_COLORS.darkGray,
  });
  slide.addText('Upstream Systems', {
    x: 0.5, y: 1.8, w: 6, h: 0.4,
    fontSize: 18, bold: true, color: COGNIZANT_COLORS.blue,
  });
  integrationSystems.upstream.slice(0, 4).forEach((sys, i) => {
    slide.addText(`• ${sys.system}: ${sys.purpose}`, {
      x: 0.8, y: 2.3 + i * 0.4, w: 5.5, h: 0.35,
      fontSize: 14, color: COGNIZANT_COLORS.darkGray,
    });
  });
  slide.addText('Downstream Systems', {
    x: 6.8, y: 1.8, w: 6, h: 0.4,
    fontSize: 18, bold: true, color: COGNIZANT_COLORS.blue,
  });
  integrationSystems.downstream.slice(0, 4).forEach((sys, i) => {
    slide.addText(`• ${sys.system}: ${sys.purpose}`, {
      x: 7.1, y: 2.3 + i * 0.4, w: 5.5, h: 0.35,
      fontSize: 14, color: COGNIZANT_COLORS.darkGray,
    });
  });
  slide.addNotes('Reassure them: we integrate with Veeva, DAM, TMS, and all their existing systems.');
  updateProgress(8, 18);

  // Slide 9: Case Study
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Early Adopter Results', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  slide.addText('Real results from pharmaceutical clients', {
    x: 0.5, y: 1, w: 12.33, h: 0.4,
    fontSize: 24, color: COGNIZANT_COLORS.darkGray,
  });
  const results = earlyAdopterResults.slice(0, 6);
  results.forEach((result, i) => {
    const x = 0.5 + (i % 3) * 4.2;
    const y = 2 + Math.floor(i / 3) * 2.2;
    slide.addShape(pptx.ShapeType.rect, {
      x, y, w: 4, h: 2,
      fill: { color: COGNIZANT_COLORS.green, transparency: 90 },
      line: { color: COGNIZANT_COLORS.green, width: 2 },
    });
    slide.addText(result.metric, {
      x, y: y + 0.2, w: 4, h: 0.3,
      fontSize: 14, bold: true, color: COGNIZANT_COLORS.darkGray, align: 'center',
    });
    slide.addText(`${result.before} → ${result.after}`, {
      x, y: y + 0.6, w: 4, h: 0.4,
      fontSize: 16, color: COGNIZANT_COLORS.darkGray, align: 'center',
    });
    slide.addText(result.improvement, {
      x, y: y + 1.1, w: 4, h: 0.4,
      fontSize: 20, bold: true, color: COGNIZANT_COLORS.green, align: 'center',
    });
  });
  slide.addNotes('Proof: 70% faster cycles, 88% MLR approval, 44% cost savings, 94% consistency.');
  updateProgress(9, 18);

  // Slide 10: Demo Proof
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Live Demo Proof Points', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  demoProofPoints.forEach((proof, i) => {
    const x = 0.5 + (i % 2) * 6.5;
    const y = 1.8 + Math.floor(i / 2) * 2.2;
    slide.addShape(pptx.ShapeType.rect, {
      x, y, w: 6, h: 2,
      fill: { color: COGNIZANT_COLORS.lightBlue, transparency: 85 },
      line: { color: COGNIZANT_COLORS.blue, width: 2 },
    });
    slide.addText(proof.value, {
      x, y: y + 0.3, w: 6, h: 0.6,
      fontSize: 40, bold: true, color: COGNIZANT_COLORS.blue, align: 'center',
    });
    slide.addText(proof.title, {
      x, y: y + 1, w: 6, h: 0.4,
      fontSize: 16, bold: true, color: COGNIZANT_COLORS.darkGray, align: 'center',
    });
    slide.addText(proof.description, {
      x, y: y + 1.45, w: 6, h: 0.4,
      fontSize: 12, color: COGNIZANT_COLORS.darkGray, align: 'center',
    });
  });
  slide.addNotes('Show them real numbers: 92% TM leverage, 91/100 quality, 3 days turnaround, 87% compliance accuracy.');
  updateProgress(10, 18);

  // Slide 11: Competitive Detail
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Competitive Comparison', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  const tableRows = [
    ['Feature', 'Content Orchestrator', 'Veeva', 'Translation Platforms'],
    ...competitiveFeatures.slice(0, 8).map((f) => [f.feature, f.us, f.veeva, f.translation]),
  ];
  slide.addTable(tableRows, {
    x: 0.5, y: 1.5, w: 12.33, h: 5,
    fontSize: 11,
    color: COGNIZANT_COLORS.darkGray,
    border: { pt: 1, color: COGNIZANT_COLORS.lightGray },
  });
  slide.addNotes('Clear differentiation: we have intelligence layers, native AI, pre-MLR, and pharma-specific focus.');
  updateProgress(11, 18);

  // Slide 12: ROI Calculator
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('ROI Calculator', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  slide.addText('Your Brand Value Projection', {
    x: 0.5, y: 1, w: 12.33, h: 0.4,
    fontSize: 24, color: COGNIZANT_COLORS.darkGray,
  });
  const roiRows = [
    ['Value Driver', 'Annual Savings'],
    ['Faster Time to Market', '$1,200,000'],
    ['MLR Efficiency Gains', '$850,000'],
    ['Localization Cost Reduction', '$900,000'],
    ['Reduced Rework', '$620,000'],
    ['Productivity Gains', '$730,000'],
    ['Total Annual Value', '$4,300,000'],
  ];
  slide.addTable(roiRows, {
    x: 2, y: 2, w: 9.33, h: 3.5,
    fontSize: 16,
    color: COGNIZANT_COLORS.darkGray,
    border: { pt: 2, color: COGNIZANT_COLORS.blue },
  });
  slide.addNotes('Walk through ROI: $4.3M annual value per brand from 5 key drivers.');
  updateProgress(12, 18);

  // Slide 13: Metrics Dashboard
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Success Metrics Dashboard', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  const metricsCategories = [
    { title: 'Speed', data: successMetrics.speed.slice(0, 3) },
    { title: 'Quality', data: successMetrics.quality.slice(0, 3) },
  ];
  metricsCategories.forEach((cat, i) => {
    const x = 0.5 + i * 6.5;
    slide.addText(cat.title, {
      x, y: 1.5, w: 6, h: 0.4,
      fontSize: 20, bold: true, color: COGNIZANT_COLORS.blue,
    });
    cat.data.forEach((m, j) => {
      const y = 2 + j * 1.2;
      slide.addText(m.metric, {
        x, y, w: 6, h: 0.3,
        fontSize: 14, bold: true, color: COGNIZANT_COLORS.darkGray,
      });
      slide.addText(`${m.baseline} → ${m.current}`, {
        x, y: y + 0.35, w: 6, h: 0.3,
        fontSize: 14, color: COGNIZANT_COLORS.darkGray,
      });
      slide.addText(`${m.improvement} improvement`, {
        x, y: y + 0.7, w: 6, h: 0.3,
        fontSize: 16, bold: true, color: COGNIZANT_COLORS.green,
      });
    });
  });
  slide.addNotes('Show the complete picture: speed improvements, quality gains, cost savings.');
  updateProgress(13, 18);

  // Slide 14: Implementation Roadmap
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Implementation Roadmap', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  slide.addText('16-Week Phased Rollout', {
    x: 0.5, y: 1, w: 12.33, h: 0.4,
    fontSize: 24, color: COGNIZANT_COLORS.darkGray,
  });
  implementationPhases.forEach((phase, i) => {
    const y = 1.8 + i * 1.3;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 12.33, h: 1.1,
      fill: { color: COGNIZANT_COLORS.lightBlue, transparency: 85 },
      line: { color: COGNIZANT_COLORS.blue, width: 2 },
    });
    slide.addText(`${phase.phase} (${phase.weeks})`, {
      x: 0.7, y: y + 0.15, w: 11.93, h: 0.3,
      fontSize: 16, bold: true, color: COGNIZANT_COLORS.blue,
    });
    slide.addText(phase.deliverables.slice(0, 3).map((d) => `• ${d}`).join(' '), {
      x: 0.7, y: y + 0.5, w: 11.93, h: 0.5,
      fontSize: 11, color: COGNIZANT_COLORS.darkGray,
    });
  });
  slide.addNotes('Clear path: 4 phases over 16 weeks from foundation to full production.');
  updateProgress(14, 18);

  // Slide 15: Risk Mitigation
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Risk Mitigation Strategy', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  riskMatrix.slice(0, 6).forEach((risk, i) => {
    const y = 1.5 + i * 0.9;
    slide.addText(risk.risk, {
      x: 0.5, y, w: 6, h: 0.3,
      fontSize: 14, bold: true, color: COGNIZANT_COLORS.orange,
    });
    slide.addText(risk.mitigation, {
      x: 0.7, y: y + 0.35, w: 11.83, h: 0.4,
      fontSize: 11, color: COGNIZANT_COLORS.darkGray,
    });
  });
  slide.addNotes('Address concerns proactively: MLR disruption, user adoption, data migration, integration.');
  updateProgress(15, 18);

  // Slide 16: Security & Compliance
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Security & Compliance', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  securityCompliance.forEach((cert, i) => {
    const x = 0.5 + (i % 3) * 4.2;
    const y = 2 + Math.floor(i / 3) * 2.2;
    slide.addShape(pptx.ShapeType.rect, {
      x, y, w: 4, h: 1.8,
      fill: { color: COGNIZANT_COLORS.green, transparency: 90 },
      line: { color: COGNIZANT_COLORS.green, width: 2 },
    });
    slide.addText(cert.standard, {
      x, y: y + 0.3, w: 4, h: 0.4,
      fontSize: 20, bold: true, color: COGNIZANT_COLORS.green, align: 'center',
    });
    slide.addText(cert.status, {
      x, y: y + 0.75, w: 4, h: 0.3,
      fontSize: 16, bold: true, color: COGNIZANT_COLORS.darkGray, align: 'center',
    });
    slide.addText(cert.description, {
      x, y: y + 1.1, w: 4, h: 0.5,
      fontSize: 12, color: COGNIZANT_COLORS.darkGray, align: 'center',
    });
  });
  slide.addNotes('Enterprise-grade security: SOC 2, HIPAA, GDPR, 21 CFR Part 11, ISO 27001.');
  updateProgress(16, 18);

  // Slide 17: Why Act Now
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.white };
  slide.addText('Why Act Now?', {
    x: 0.5, y: 0.4, w: 12.33, h: 0.6,
    fontSize: 44, bold: true, color: COGNIZANT_COLORS.blue,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 1.5, w: 6, h: 4.5,
    fill: { color: COGNIZANT_COLORS.green, transparency: 90 },
    line: { color: COGNIZANT_COLORS.green, width: 2 },
  });
  slide.addText('Act Now', {
    x: 0.5, y: 1.8, w: 6, h: 0.5,
    fontSize: 28, bold: true, color: COGNIZANT_COLORS.green, align: 'center',
  });
  ['16-week ROI realization', '$4.3M annual value per brand', 'Competitive advantage', 'Early adopter benefits'].forEach((item, i) => {
    slide.addText(`✓ ${item}`, {
      x: 1, y: 2.5 + i * 0.6, w: 5, h: 0.5,
      fontSize: 16, color: COGNIZANT_COLORS.darkGray,
    });
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.8, y: 1.5, w: 6, h: 4.5,
    fill: { color: COGNIZANT_COLORS.orange, transparency: 90 },
    line: { color: COGNIZANT_COLORS.orange, width: 2 },
  });
  slide.addText('Wait 12 Months', {
    x: 6.8, y: 1.8, w: 6, h: 0.5,
    fontSize: 28, bold: true, color: COGNIZANT_COLORS.orange, align: 'center',
  });
  ['$5.2M cumulative opportunity cost', 'Competitors pull ahead', 'Team burnout continues', 'Same problems compound'].forEach((item, i) => {
    slide.addText(`✗ ${item}`, {
      x: 7.3, y: 2.5 + i * 0.6, w: 5, h: 0.5,
      fontSize: 16, color: COGNIZANT_COLORS.darkGray,
    });
  });
  slide.addNotes('Create urgency: $4.3M/year value vs. $5.2M opportunity cost if they wait.');
  updateProgress(17, 18);

  // Slide 18: CTA
  slide = pptx.addSlide();
  slide.background = { fill: COGNIZANT_COLORS.blue };
  slide.addText('Transform Your Pharmaceutical Marketing Operations', {
    x: 1, y: 2, w: 11.33, h: 1,
    fontSize: 48, bold: true, color: COGNIZANT_COLORS.white, align: 'center',
  });
  slide.addText('Next Steps:', {
    x: 1, y: 3.5, w: 11.33, h: 0.5,
    fontSize: 28, bold: true, color: COGNIZANT_COLORS.white, align: 'center',
  });
  ['1. Schedule 30-minute demo with your use case', '2. Launch pilot campaign to prove ROI', '3. Full deployment in 16 weeks'].forEach((step, i) => {
    slide.addText(step, {
      x: 2, y: 4.2 + i * 0.5, w: 9.33, h: 0.4,
      fontSize: 20, color: COGNIZANT_COLORS.white, align: 'center',
    });
  });
  slide.addText('demo@contententorchestrator.com', {
    x: 1, y: 6, w: 11.33, h: 0.5,
    fontSize: 24, bold: true, color: COGNIZANT_COLORS.white, align: 'center',
  });
  slide.addNotes('Clear next steps: Demo, Pilot, Deploy. Make it easy to say yes.');
  updateProgress(18, 18);

  // Save the presentation
  const fileName = `Content-Orchestrator-Marketing-Deck-${new Date().toISOString().split('T')[0]}.pptx`;
  await pptx.writeFile({ fileName });
};
