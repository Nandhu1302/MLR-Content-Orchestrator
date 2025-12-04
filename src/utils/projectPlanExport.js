
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, convertInchesToTwip } from 'docx';

export const generateProjectPlanDocument = async () => {
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
          text: "GLOCALIZATION MODULE",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Commercial-Grade Platform Development",
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Project Plan & Requirements Document",
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
        new Paragraph({ text: "2. Project Overview", spacing: { after: 100 } }),
        new Paragraph({ text: "3. Business Objectives", spacing: { after: 100 } }),
        new Paragraph({ text: "4. Scope of Work", spacing: { after: 100 } }),
        new Paragraph({ text: "5. Technical Approach & Methodology", spacing: { after: 100 } }),
        new Paragraph({ text: "6. Project Timeline & Phases", spacing: { after: 100 } }),
        new Paragraph({ text: "7. Key Assumptions", spacing: { after: 100 } }),
        new Paragraph({ text: "8. Prerequisites & Dependencies", spacing: { after: 100 } }),
        new Paragraph({ text: "9. Client Requirements & Responsibilities", spacing: { after: 100 } }),
        new Paragraph({ text: "10. Deliverables & Milestones", spacing: { after: 100 } }),
        new Paragraph({ text: "11. Resource Requirements", spacing: { after: 100 } }),
        new Paragraph({ text: "12. Budget & Investment", spacing: { after: 100 } }),
        new Paragraph({ text: "13. Risk Assessment & Mitigation", spacing: { after: 100 } }),
        new Paragraph({ text: "14. Success Criteria", spacing: { after: 100 } }),
        new Paragraph({ text: "15. Next Steps & Approval", spacing: { after: 100 } }),
        // 1. Executive Summary
        new Paragraph({
          text: "1. EXECUTIVE SUMMARY",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "This document outlines the comprehensive plan for developing and deploying a commercial-grade Glocalization Module designed to transform pharmaceutical marketing content operations across domestic and global markets.",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Key Highlights:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Project Duration: 18-20 weeks from kickoff to General Availability", spacing: { after: 50 } }),
        new Paragraph({ text: "• Total Investment: $580,000 (includes development, infrastructure, security, and compliance)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Expected ROI: $3.2M+ annual value per brand with 12-18 month payback period", spacing: { after: 50 } }),
        new Paragraph({ text: "• Team Size: 6-7 dedicated professionals at peak (PM, Architects, Developers, QA, DevOps)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Technology Stack: AWS Cloud Infrastructure, React/Next.js Frontend, PostgreSQL Database, AI Translation Services", spacing: { after: 50 } }),
        new Paragraph({ text: "• Compliance: SOC 2 readiness built-in from Day 1, with full security audit and penetration testing", spacing: { after: 200 } }),
        // 2. Project Overview
        new Paragraph({
          text: "2. PROJECT OVERVIEW",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "2.1 Background",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Pharmaceutical marketing teams face significant challenges in creating, reviewing, and localizing promotional content across multiple markets. Current manual processes result in extended timelines (12+ weeks for complex assets), high rework rates (60%+ MLR rejections), and substantial translation costs.",
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "2.2 Solution Overview",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "The Glocalization Module is an enterprise-grade platform that combines:",
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• AI-Powered Translation: Leveraging OpenAI GPT-5 with multi-provider fallback and Translation Memory optimization", spacing: { after: 50 } }),
        new Paragraph({ text: "• Intelligent Content Segmentation: Automated breakdown of source assets with word-level translation tracking", spacing: { after: 50 } }),
        new Paragraph({ text: "• 5-Phase Workflow: Structured process from Translation through Cultural Intelligence, Regulatory Review, MLR, and Publishing", spacing: { after: 50 } }),
        new Paragraph({ text: "• Cultural Intelligence Engine: Market-specific adaptation recommendations for messaging, imagery, and compliance", spacing: { after: 50 } }),
        new Paragraph({ text: "• Regulatory Compliance Checks: Automated validation against market-specific pharmaceutical advertising regulations", spacing: { after: 50 } }),
        new Paragraph({ text: "• Real-Time Collaboration: Multi-user workspace with live updates, commenting, and version control", spacing: { after: 50 } }),
        new Paragraph({ text: "• Enterprise Security: Multi-tenant architecture, role-based access control, comprehensive audit logging, SOC 2 compliance", spacing: { after: 200 } }),
        // Additional sections continue similarly...
        createTechnologyTable(),
        createTimelineTable(),
        createPrerequisitesTable(),
        createClientResponsibilitiesTable(),
        createDeliverablesTable(),
        createResourceTable(),
        createBudgetTable(),
        createRiskTable(),
        new Paragraph({
          text: "END OF DOCUMENT",
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
        new Paragraph({
          text: "For questions or clarifications, please contact:",
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 50 },
        }),
        new Paragraph({
          text: "Project Management Office",
          alignment: AlignmentType.CENTER,
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Email: glocalization-pmo@company.com",
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Glocalization_Project_Plan_Requirements.docx';
  link.click();
  window.URL.revokeObjectURL(url);
};

// Helper functions for tables
function createTechnologyTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Layer", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Technology", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Justification", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Frontend")] }),
          new TableCell({ children: [new Paragraph("React + Next.js + TypeScript")] }),
          new TableCell({ children: [new Paragraph("Modern, performant, type-safe UI framework with SSR support")] }),
        ],
      }),
      // Additional rows...
    ],
  });
}

function createTimelineTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Phase", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Duration", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Key Activities", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Milestone", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Phase 1: Discovery")] }),
          new TableCell({ children: [new Paragraph("Week 1")] }),
          new TableCell({ children: [new Paragraph("Requirements workshops, system audit, documentation")] }),
          new TableCell({ children: [new Paragraph("Requirements Sign-off")] }),
        ],
      }),
      // Additional rows...
    ],
  });
}

