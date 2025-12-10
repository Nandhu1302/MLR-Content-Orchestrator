
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,            // (kept import as-is even if unused)
  convertInchesToTwip,
} from 'docx';

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

        // 3. Business Objectives
        new Paragraph({
          text: "3. BUSINESS OBJECTIVES",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Primary Objectives:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "1. Reduce Time-to-Market by 75%: From 12 weeks to 3 weeks for complex assets", spacing: { after: 50 } }),
        new Paragraph({ text: "2. Increase MLR First-Pass Approval to 90%: Up from 40% baseline through AI-assisted compliance checking", spacing: { after: 50 } }),
        new Paragraph({ text: "3. Generate $3.2M+ Annual Value Per Brand: Through labor efficiency, cost savings, and reduced opportunity costs", spacing: { after: 50 } }),
        new Paragraph({ text: "4. Scale Global Operations: Enable 102 localized assets per year (34 assets × 3 markets) with existing resources", spacing: { after: 50 } }),
        new Paragraph({ text: "5. Reduce Translation Costs by 30%: Via Translation Memory leverage and AI optimization", spacing: { after: 50 } }),
        new Paragraph({ text: "6. Improve Labor Efficiency by 40%: Increasing asset production capacity without additional headcount", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Secondary Objectives:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Establish centralized content operations hub accessible across all brands", spacing: { after: 50 } }),
        new Paragraph({ text: "• Create reusable translation memory assets to compound savings over time", spacing: { after: 50 } }),
        new Paragraph({ text: "• Enable data-driven insights into content production bottlenecks and costs", spacing: { after: 50 } }),
        new Paragraph({ text: "• Build foundation for future AI-powered content creation capabilities", spacing: { after: 200 } }),

        // 4. Scope of Work
        new Paragraph({
          text: "4. SCOPE OF WORK",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "4.1 In-Scope Deliverables",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Core Platform Features:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "✓ Multi-tenant SaaS architecture supporting unlimited brands and users", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Project management dashboard with asset tracking and status monitoring", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ AI translation service with OpenAI GPT-5, Gemini Pro fallback, and TM integration", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Content segmentation engine with word-level translation breakdown", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ 5-phase workflow engine (Translation → Cultural Intelligence → Regulatory → MLR → Publishing)", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Cultural intelligence service with market-specific recommendations", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Regulatory compliance checking against pharmaceutical advertising rules", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Real-time collaboration workspace with WebSocket support", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Export functionality (DOCX, PDF with formatting preservation)", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Analytics dashboard with ROI tracking and production metrics", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Admin panel for user, tenant, and permission management", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ API documentation (OpenAPI/Swagger) for future integrations", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Infrastructure & Security:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "✓ AWS cloud infrastructure (VPC, ECS/Fargate, RDS PostgreSQL Multi-AZ)", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Auth0 enterprise authentication with SSO support", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Row-level security (RLS) policies for data isolation", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Comprehensive audit logging for compliance", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Redis caching layer for performance optimization", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Elasticsearch for Translation Memory matching", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ CI/CD pipeline with automated testing and deployment", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Monitoring and alerting (Datadog)", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ SOC 2 compliance readiness with security controls", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Penetration testing and vulnerability remediation", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Training & Documentation:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "✓ User training sessions (2 sessions for client team)", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Administrator training for tenant and user management", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Video tutorials for all major workflows", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Knowledge base with FAQs and troubleshooting guides", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Technical runbooks for operations team", spacing: { after: 200 } }),
        new Paragraph({
          text: "4.2 Out-of-Scope Items",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "✗ Integration with existing CMS or DAM systems (can be added as Phase 2)", spacing: { after: 50 } }),
        new Paragraph({ text: "✗ Veeva Vault integration (can be added as Phase 2)", spacing: { after: 50 } }),
        new Paragraph({ text: "✗ Salesforce integration (can be added as Phase 2)", spacing: { after: 50 } }),
        new Paragraph({ text: "✗ Custom AI model training or fine-tuning", spacing: { after: 50 } }),
        new Paragraph({ text: "✗ Mobile native applications (iOS/Android)", spacing: { after: 50 } }),
        new Paragraph({ text: "✗ SOC 2 Type II certification (only readiness and Type I)", spacing: { after: 50 } }),
        new Paragraph({ text: "✗ Content creation from scratch (platform adapts existing content)", spacing: { after: 50 } }),
        new Paragraph({ text: "✗ Medical/legal copy review services (platform facilitates, doesn't replace)", spacing: { after: 200 } }),

        // 5. Technical Approach
        new Paragraph({
          text: "5. TECHNICAL APPROACH & METHODOLOGY",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "5.1 Development Methodology",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "We will use an Agile development approach with 2-week sprints, featuring:",
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Sprint Planning: At the beginning of each sprint to prioritize user stories", spacing: { after: 50 } }),
        new Paragraph({ text: "• Daily Standups: 15-minute sync meetings to track progress and blockers", spacing: { after: 50 } }),
        new Paragraph({ text: "• Sprint Demos: End-of-sprint demonstrations to client stakeholders", spacing: { after: 50 } }),
        new Paragraph({ text: "• Sprint Retrospectives: Continuous improvement discussions", spacing: { after: 50 } }),
        new Paragraph({ text: "• Bi-weekly Client Check-ins: Status updates and requirement clarifications", spacing: { after: 200 } }),
        new Paragraph({
          text: "5.2 Technology Stack",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        createTechnologyTable(),
        new Paragraph({
          text: "5.3 Architecture Principles",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Microservices Architecture: Loosely coupled services for scalability and maintainability", spacing: { after: 50 } }),
        new Paragraph({ text: "• API-First Design: RESTful APIs documented with OpenAPI for future integrations", spacing: { after: 50 } }),
        new Paragraph({ text: "• Multi-Tenant SaaS: Shared infrastructure with data isolation via RLS", spacing: { after: 50 } }),
        new Paragraph({ text: "• Cloud-Native: Leveraging AWS managed services for reliability and scalability", spacing: { after: 50 } }),
        new Paragraph({ text: "• Security-First: Authentication, authorization, encryption, and audit logging built-in", spacing: { after: 50 } }),
        new Paragraph({ text: "• Performance Optimization: Caching strategies, CDN delivery, database indexing", spacing: { after: 200 } }),

        // 6. Project Timeline
        new Paragraph({
          text: "6. PROJECT TIMELINE & PHASES",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Total Duration: 18-20 weeks (November 2025 - March 2026)", bold: true })],
          spacing: { after: 200 },
        }),
        createTimelineTable(),

        // 7. Key Assumptions
        new Paragraph({
          text: "7. KEY ASSUMPTIONS",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "7.1 Business Assumptions",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Client has decision-making authority to approve requirements and design decisions within 48 hours", spacing: { after: 50 } }),
        new Paragraph({ text: "• Client will provide dedicated stakeholders for workshops, demos, and UAT (minimum 10 hours/week)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Client has existing content assets in digital format (Word, PowerPoint, PDF) for initial migration", spacing: { after: 50 } }),
        new Paragraph({ text: "• English will be the primary source language with localization to 3 initial markets", spacing: { after: 50 } }),
        new Paragraph({ text: "• Project scope will remain stable after requirements sign-off (Change requests may impact timeline)", spacing: { after: 200 } }),
        new Paragraph({
          text: "7.2 Technical Assumptions",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• AWS account will be provided or can be created with client approval within Week 1", spacing: { after: 50 } }),
        new Paragraph({ text: "• OpenAI Enterprise contract can be executed within 2 weeks of kickoff", spacing: { after: 50 } }),
        new Paragraph({ text: "• Auth0 corporate account or SSO integration details available by Week 3", spacing: { after: 50 } }),
        new Paragraph({ text: "• Client IT team can support DNS configuration and firewall rules within 48 hours of request", spacing: { after: 50 } }),
        new Paragraph({ text: "• Internet connectivity and modern browsers (Chrome, Edge, Safari) available to all users", spacing: { after: 50 } }),
        new Paragraph({ text: "• No existing legacy system integration required in Phase 1 (deferred to Phase 2)", spacing: { after: 200 } }),
        new Paragraph({
          text: "7.3 Resource Assumptions",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Development team fully allocated starting from Week 1 (no resource conflicts)", spacing: { after: 50 } }),
        new Paragraph({ text: "• External security audit firm can be scheduled with 2-week lead time", spacing: { after: 50 } }),
        new Paragraph({ text: "• No major holidays or team vacations during critical path phases (Weeks 14-20)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Client UAT team (3-5 people) available for 2 full weeks of testing", spacing: { after: 200 } }),

        // 8. Prerequisites
        new Paragraph({
          text: "8. PREREQUISITES & DEPENDENCIES",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "8.1 Client Prerequisites (Required Before Kickoff)",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        createPrerequisitesTable(),
        new Paragraph({
          text: "8.2 External Dependencies",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• OpenAI API Access: Enterprise contract procurement (2-week lead time)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Auth0 Setup: Corporate account activation (1-week lead time)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Security Audit: Third-party penetration testing firm scheduling (2-week lead time)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Legal Review: Master Services Agreement, Data Processing Agreement, SLA review (2-week lead time)", spacing: { after: 200 } }),

        // 9. Client Requirements
        new Paragraph({
          text: "9. CLIENT REQUIREMENTS & RESPONSIBILITIES",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "9.1 Client Team Commitment",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        createClientResponsibilitiesTable(),
        new Paragraph({
          text: "9.2 Decision-Making Authority",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "Client must provide stakeholders with authority to:", spacing: { after: 100 } }),
        new Paragraph({ text: "• Approve requirements documents and design specifications within 48 hours", spacing: { after: 50 } }),
        new Paragraph({ text: "• Make go/no-go decisions at each milestone gate", spacing: { after: 50 } }),
        new Paragraph({ text: "• Authorize change requests and scope adjustments", spacing: { after: 50 } }),
        new Paragraph({ text: "• Sign off on UAT results and production deployment", spacing: { after: 200 } }),

        // 10. Deliverables
        new Paragraph({
          text: "10. DELIVERABLES & MILESTONES",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        createDeliverablesTable(),

        // 11. Resource Requirements
        new Paragraph({
          text: "11. RESOURCE REQUIREMENTS",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "11.1 Development Team Composition",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        createResourceTable(),

        // 12. Budget
        new Paragraph({
          text: "12. BUDGET & INVESTMENT",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        createBudgetTable(),
        new Paragraph({
          children: [new TextRun({ text: "Payment Terms:", bold: true })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({ text: "• 30% upon contract signing and project kickoff", spacing: { after: 50 } }),
        new Paragraph({ text: "• 40% upon completion of Sprint 5 and Infrastructure Ready milestone", spacing: { after: 50 } }),
        new Paragraph({ text: "• 30% upon successful UAT sign-off and production deployment", spacing: { after: 200 } }),

        // 13. Risk Assessment
        new Paragraph({
          text: "13. RISK ASSESSMENT & MITIGATION",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        createRiskTable(),

        // 14. Success Criteria
        new Paragraph({
          text: "14. SUCCESS CRITERIA",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "The project will be considered successful when the following criteria are met:",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Technical Success Criteria:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "✓ System uptime of 99.5% or higher during soft launch period", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Page load times under 2 seconds for 95% of requests", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Zero critical security vulnerabilities in penetration test", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Translation Memory matching accuracy of 85%+ for repeated content", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ AI translation quality score of 4.0/5.0 or higher (based on sample review)", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Real-time collaboration with <500ms latency for WebSocket updates", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Export functionality preserves 100% of formatting for DOCX and PDF", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Business Success Criteria:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "✓ Completion of full 5-phase workflow for at least 5 pilot assets during UAT", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Time-to-market reduction of at least 60% compared to current baseline", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ MLR first-pass approval rate improvement to 75%+ (from 40% baseline)", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ User adoption rate of 80%+ among trained client team members", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Client satisfaction score of 8/10 or higher in post-launch survey", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Zero data breaches or security incidents during production operation", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Operational Success Criteria:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "✓ All key milestones delivered within ±5 days of planned dates", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Budget variance within ±10% of approved budget", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Zero critical bugs in production after 30 days of General Availability", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Support ticket resolution time averaging under 4 hours for critical issues", spacing: { after: 50 } }),
        new Paragraph({ text: "✓ Complete documentation and training materials delivered", spacing: { after: 200 } }),

        // 15. Next Steps
        new Paragraph({
          text: "15. NEXT STEPS & APPROVAL",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "15.1 Immediate Next Steps",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "1. Client Review: Review this document and provide feedback/questions within 5 business days", spacing: { after: 50 } }),
        new Paragraph({ text: "2. Requirements Workshop: Schedule initial workshop (Week 1) with key stakeholders", spacing: { after: 50 } }),
        new Paragraph({ text: "3. Contract Execution: Finalize Master Services Agreement and Statement of Work", spacing: { after: 50 } }),
        new Paragraph({ text: "4. Kickoff Meeting: Formal project kickoff with full team introductions", spacing: { after: 50 } }),
        new Paragraph({ text: "5. Infrastructure Setup: Begin AWS account setup and initial provisioning", spacing: { after: 200 } }),
        new Paragraph({
          text: "15.2 Approval & Sign-Off",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "By signing below, the client acknowledges review and approval of this project plan, approach, assumptions, prerequisites, and requirements. Client commits to providing the resources, access, and decision-making support outlined in this document.",
          spacing: { after: 300 },
        }),
        new Paragraph({ text: "_______________________________________________", spacing: { after: 50 } }),
        new Paragraph({ text: "Client Signature", spacing: { after: 100 } }),
        new Paragraph({ text: "_______________________________________________", spacing: { after: 50 } }),
        new Paragraph({ text: "Name & Title", spacing: { after: 100 } }),
        new Paragraph({ text: "_______________________________________________", spacing: { after: 50 } }),
        new Paragraph({ text: "Date", spacing: { after: 300 } }),
        new Paragraph({ text: "_______________________________________________", spacing: { after: 50 } }),
        new Paragraph({ text: "Project Sponsor Signature", spacing: { after: 100 } }),
        new Paragraph({ text: "_______________________________________________", spacing: { after: 50 } }),
        new Paragraph({ text: "Name & Title", spacing: { after: 100 } }),
        new Paragraph({ text: "_______________________________________________", spacing: { after: 50 } }),
        new Paragraph({ text: "Date", spacing: { after: 200 } }),

        // Footer
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

// Helper function to create technology stack table
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
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Backend")] }),
          new TableCell({ children: [new Paragraph("Node.js + Express + PostgreSQL")] }),
          new TableCell({ children: [new Paragraph("Scalable API layer with relational data management")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Database")] }),
          new TableCell({ children: [new Paragraph("AWS RDS PostgreSQL (Multi-AZ)")] }),
          new TableCell({ children: [new Paragraph("Enterprise-grade reliability, automated backups, RLS support")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Search")] }),
          new TableCell({ children: [new Paragraph("Elasticsearch")] }),
          new TableCell({ children: [new Paragraph("Fast Translation Memory matching with fuzzy search")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Caching")] }),
          new TableCell({ children: [new Paragraph("Redis")] }),
          new TableCell({ children: [new Paragraph("Performance optimization for frequent queries")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("AI Services")] }),
          new TableCell({ children: [new Paragraph("OpenAI GPT-5 + Google Gemini Pro")] }),
          new TableCell({ children: [new Paragraph("Best-in-class translation with multi-provider resilience")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Authentication")] }),
          new TableCell({ children: [new Paragraph("Auth0")] }),
          new TableCell({ children: [new Paragraph("Enterprise SSO, MFA, secure session management")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Hosting")] }),
          new TableCell({ children: [new Paragraph("AWS ECS/Fargate + CloudFront")] }),
          new TableCell({ children: [new Paragraph("Auto-scaling containers with global CDN delivery")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Monitoring")] }),
          new TableCell({ children: [new Paragraph("Datadog")] }),
          new TableCell({ children: [new Paragraph("Comprehensive observability, alerting, and APM")] }),
        ],
      }),
    ],
  });
}

// Helper function to create timeline table
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
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Phase 2: Architecture")] }),
          new TableCell({ children: [new Paragraph("Weeks 2-3")] }),
          new TableCell({ children: [new Paragraph("Tech stack selection, database design, API design, security architecture")] }),
          new TableCell({ children: [new Paragraph("Architecture Approval")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Phase 3: Infrastructure")] }),
          new TableCell({ children: [new Paragraph("Weeks 3-5")] }),
          new TableCell({ children: [new Paragraph("AWS setup, database provisioning, CI/CD pipeline, monitoring")] }),
          new TableCell({ children: [new Paragraph("Infrastructure Ready")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Phase 4: Sprint 1-2")] }),
          new TableCell({ children: [new Paragraph("Weeks 5-7")] }),
          new TableCell({ children: [new Paragraph("Auth, RBAC, database migration, project management APIs")] }),
          new TableCell({ children: [new Paragraph("Sprint 1-2 Demo")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Phase 5: Sprint 3-4")] }),
          new TableCell({ children: [new Paragraph("Weeks 8-10")] }),
          new TableCell({ children: [new Paragraph("AI translation, TM matching, cultural intelligence, workflow engine")] }),
          new TableCell({ children: [new Paragraph("Sprint 3-4 Demo")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Phase 6: Sprint 5")] }),
          new TableCell({ children: [new Paragraph("Weeks 11-13")] }),
          new TableCell({ children: [new Paragraph("Frontend UI, workspace, real-time collaboration, exports, analytics")] }),
          new TableCell({ children: [new Paragraph("Sprint 5 Complete")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Phase 7: Security")] }),
          new TableCell({ children: [new Paragraph("Weeks 14-15")] }),
          new TableCell({ children: [new Paragraph("Penetration testing, vulnerability remediation, SOC 2 preparation")] }),
          new TableCell({ children: [new Paragraph("SOC 2 Readiness")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Phase 8: QA & UAT")] }),
          new TableCell({ children: [new Paragraph("Weeks 14-18")] }),
          new TableCell({ children: [new Paragraph("Integration testing, E2E testing, load testing, client UAT")] }),
          new TableCell({ children: [new Paragraph("QA Sign-off")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Phase 9: Migration")] }),
          new TableCell({ children: [new Paragraph("Week 18-19")] }),
          new TableCell({ children: [new Paragraph("Data migration, DNS cutover, post-migration monitoring")] }),
          new TableCell({ children: [new Paragraph("Production Live")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Phase 10: Launch")] }),
          new TableCell({ children: [new Paragraph("Weeks 19-20")] }),
          new TableCell({ children: [new Paragraph("Soft launch with pilots, monitoring, stabilization")] }),
          new TableCell({ children: [new Paragraph("General Availability")] }),
        ],
      }),
    ],
  });
}

// Helper function to create prerequisites table
function createPrerequisitesTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Prerequisite", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Required By", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Owner", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Executive sponsor identified and committed")] }),
          new TableCell({ children: [new Paragraph("Day 1")] }),
          new TableCell({ children: [new Paragraph("Client")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Key stakeholders identified (Marketing, MLR, IT, Legal)")] }),
          new TableCell({ children: [new Paragraph("Day 1")] }),
          new TableCell({ children: [new Paragraph("Client")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Budget approval and purchase order")] }),
          new TableCell({ children: [new Paragraph("Week 1")] }),
          new TableCell({ children: [new Paragraph("Client")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("AWS account or approval to create one")] }),
          new TableCell({ children: [new Paragraph("Week 1")] }),
          new TableCell({ children: [new Paragraph("Client IT")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("OpenAI Enterprise contract initiation")] }),
          new TableCell({ children: [new Paragraph("Week 2")] }),
          new TableCell({ children: [new Paragraph("Client Procurement")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Sample content assets for pilot testing")] }),
          new TableCell({ children: [new Paragraph("Week 3")] }),
          new TableCell({ children: [new Paragraph("Client Marketing")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("SSO/Auth0 integration details")] }),
          new TableCell({ children: [new Paragraph("Week 3")] }),
          new TableCell({ children: [new Paragraph("Client IT")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("UAT team members identified (3-5 people)")] }),
          new TableCell({ children: [new Paragraph("Week 14")] }),
          new TableCell({ children: [new Paragraph("Client")] }),
        ],
      }),
    ],
  });
}

// Helper function to create client responsibilities table
function createClientResponsibilitiesTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Role", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Time Commitment", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Key Responsibilities", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Executive Sponsor")] }),
          new TableCell({ children: [new Paragraph("2 hours/week")] }),
          new TableCell({ children: [new Paragraph("Strategic decisions, budget approvals, escalation resolution")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Product Owner")] }),
          new TableCell({ children: [new Paragraph("15 hours/week")] }),
          new TableCell({ children: [new Paragraph("Requirements clarification, sprint demos, UAT coordination")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Subject Matter Experts")] }),
          new TableCell({ children: [new Paragraph("5 hours/week")] }),
          new TableCell({ children: [new Paragraph("Provide domain expertise on MLR, compliance, workflows")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("IT Liaison")] }),
          new TableCell({ children: [new Paragraph("5 hours/week")] }),
          new TableCell({ children: [new Paragraph("Infrastructure setup, SSO integration, DNS configuration")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("UAT Team (3-5 users)")] }),
          new TableCell({ children: [new Paragraph("20 hours/week (Weeks 16-18)")] }),
          new TableCell({ children: [new Paragraph("Full testing of platform, bug reporting, feedback")] }),
        ],
      }),
    ],
  });
}

// Helper function to create deliverables table
function createDeliverablesTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Milestone", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Week", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Key Deliverables", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Requirements Sign-off")] }),
          new TableCell({ children: [new Paragraph("2")] }),
          new TableCell({ children: [new Paragraph("Requirements document, security requirements, system audit report")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Architecture Approval")] }),
          new TableCell({ children: [new Paragraph("3")] }),
          new TableCell({ children: [new Paragraph("System architecture diagrams, database schema, API specification")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Infrastructure Ready")] }),
          new TableCell({ children: [new Paragraph("5")] }),
          new TableCell({ children: [new Paragraph("AWS environment, CI/CD pipeline, monitoring setup")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Sprint 1-2 Demo")] }),
          new TableCell({ children: [new Paragraph("7")] }),
          new TableCell({ children: [new Paragraph("Authentication, RBAC, project management APIs, demo video")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Sprint 3-4 Demo")] }),
          new TableCell({ children: [new Paragraph("10")] }),
          new TableCell({ children: [new Paragraph("AI translation, TM matching, workflow engine, demo video")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Sprint 5 Complete")] }),
          new TableCell({ children: [new Paragraph("13")] }),
          new TableCell({ children: [new Paragraph("Full UI, real-time collaboration, exports, analytics dashboard")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("SOC 2 Readiness")] }),
          new TableCell({ children: [new Paragraph("15")] }),
          new TableCell({ children: [new Paragraph("Penetration test report, security controls evidence package")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("QA Sign-off")] }),
          new TableCell({ children: [new Paragraph("18")] }),
          new TableCell({ children: [new Paragraph("Test results, UAT sign-off, performance benchmarks")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Production Live")] }),
          new TableCell({ children: [new Paragraph("19")] }),
          new TableCell({ children: [new Paragraph("Migrated data, live production system, runbooks")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("General Availability")] }),
          new TableCell({ children: [new Paragraph("20")] }),
          new TableCell({ children: [new Paragraph("Training materials, video tutorials, knowledge base, support system")] }),
        ],
      }),
    ],
  });
}

// Helper function to create resource table
function createResourceTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Role", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Allocation", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Key Responsibilities", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Project Manager")] }),
          new TableCell({ children: [new Paragraph("100% (Weeks 1-20)")] }),
          new TableCell({ children: [new Paragraph("Overall coordination, client communication, risk management")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Solutions Architect")] }),
          new TableCell({ children: [new Paragraph("100% (Weeks 1-3), 50% (Weeks 4-10)")] }),
          new TableCell({ children: [new Paragraph("System design, technology decisions, architecture reviews")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Security Architect")] }),
          new TableCell({ children: [new Paragraph("50% (Weeks 1-5), 100% (Weeks 14-15)")] }),
          new TableCell({ children: [new Paragraph("Security design, SOC 2 compliance, penetration test coordination")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("DevOps Lead")] }),
          new TableCell({ children: [new Paragraph("100% (Weeks 3-5), 50% (Weeks 6-20)")] }),
          new TableCell({ children: [new Paragraph("AWS infrastructure, CI/CD, monitoring, deployment automation")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Senior Backend Dev #1")] }),
          new TableCell({ children: [new Paragraph("100% (Weeks 6-15)")] }),
          new TableCell({ children: [new Paragraph("APIs, database logic, AI integration, workflow engine")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Senior Backend Dev #2")] }),
          new TableCell({ children: [new Paragraph("100% (Weeks 6-15)")] }),
          new TableCell({ children: [new Paragraph("TM matching, content segmentation, regulatory compliance")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Senior Frontend Dev")] }),
          new TableCell({ children: [new Paragraph("50% (Weeks 6-10), 100% (Weeks 11-15)")] }),
          new TableCell({ children: [new Paragraph("React UI, workspace interface, real-time collaboration")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("QA Engineer")] }),
          new TableCell({ children: [new Paragraph("50% (Weeks 6-13), 100% (Weeks 14-18)")] }),
          new TableCell({ children: [new Paragraph("Test automation, integration testing, UAT coordination")] }),
        ],
      }),
    ],
  });
}

// Helper function to create budget table
function createBudgetTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Budget", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Details", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Development Team")] }),
          new TableCell({ children: [new Paragraph("$400,000")] }),
          new TableCell({ children: [new Paragraph("8 team members across 20 weeks (blended rate)")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Cloud Infrastructure (AWS)")] }),
          new TableCell({ children: [new Paragraph("$50,000")] }),
          new TableCell({ children: [new Paragraph("RDS, ECS, S3, CloudFront, Elasticsearch, Redis (6 months)")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("AI Services (OpenAI)")] }),
          new TableCell({ children: [new Paragraph("$20,000")] }),
          new TableCell({ children: [new Paragraph("Translation API costs for development and UAT testing")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Security & Compliance")] }),
          new TableCell({ children: [new Paragraph("$100,000")] }),
          new TableCell({ children: [new Paragraph("Penetration testing, SOC 2 preparation, security consultant")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Tools & Software")] }),
          new TableCell({ children: [new Paragraph("$10,000")] }),
          new TableCell({ children: [new Paragraph("Auth0, Datadog, development tools, licenses")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TOTAL INVESTMENT", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "$580,000", bold: true })] })] }),
          new TableCell({ children: [new Paragraph("One-time implementation cost")] }),
        ],
      }),
    ],
  });
}

// Helper function to create risk table
function createRiskTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Risk", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Impact", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Mitigation Strategy", bold: true })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Scope creep or changing requirements")] }),
          new TableCell({ children: [new Paragraph("High")] }),
          new TableCell({ children: [new Paragraph("Formal change request process, weekly scope reviews, client sign-offs")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("OpenAI API rate limits or service disruptions")] }),
          new TableCell({ children: [new Paragraph("Medium")] }),
          new TableCell({ children: [new Paragraph("Multi-provider fallback (Gemini Pro), TM-first strategy, caching layer")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Data migration complexity or data loss")] }),
          new TableCell({ children: [new Paragraph("High")] }),
          new TableCell({ children: [new Paragraph("Multiple dry runs, automated validation, rollback plan, 48h monitoring")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Client UAT delays or critical issues found late")] }),
          new TableCell({ children: [new Paragraph("Medium")] }),
          new TableCell({ children: [new Paragraph("3-week buffer, weekly demos to catch issues early, dedicated UAT support")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Key team member unavailability")] }),
          new TableCell({ children: [new Paragraph("Medium")] }),
          new TableCell({ children: [new Paragraph("Cross-training, documentation, backup resources identified")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Security vulnerabilities discovered late")] }),
          new TableCell({ children: [new Paragraph("High")] }),
          new TableCell({ children: [new Paragraph("Security architect reviews weekly, early penetration testing, automated scanning")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("External dependency delays (OpenAI, Auth0)")] }),
          new TableCell({ children: [new Paragraph("Medium")] }),
          new TableCell({ children: [new Paragraph("Early procurement, parallel workstreams, backup vendor options")] }),
        ],
      }),
    ],
  });
}
