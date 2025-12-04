
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, convertInchesToTwip, PageBreak, UnderlineType } from 'docx';

export const generateGlocalizationArchitectureDocument = async () => {
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
          text: "Technical Architecture Documentation",
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Deep Dive: System Design, Data Models, APIs & Infrastructure",
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Version: 2.0\nDate: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\nClassification: Internal - Technical Team`,
              break: 1,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
        // Executive Summary
        new Paragraph({
          text: "EXECUTIVE SUMMARY",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "This comprehensive technical architecture document provides detailed specifications for the Glocalization Module - an enterprise-grade, AI-powered content localization platform designed specifically for pharmaceutical marketing operations.",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Architecture Highlights:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Microservices-based architecture with 12+ core services", spacing: { after: 50 } }),
        new Paragraph({ text: "• Multi-tenant SaaS platform supporting unlimited brands and users", spacing: { after: 50 } }),
        new Paragraph({ text: "• Event-driven workflow engine with 5-phase content lifecycle", spacing: { after: 50 } }),
        new Paragraph({ text: "• AI Translation Engine with multi-provider fallback (OpenAI GPT-5, Gemini Pro)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Real-time collaboration via WebSocket infrastructure", spacing: { after: 50 } }),
        new Paragraph({ text: "• SOC 2 compliant security architecture with comprehensive audit logging", spacing: { after: 50 } }),
        new Paragraph({ text: "• AWS cloud-native infrastructure designed for global scale", spacing: { after: 200 }, }),
        // C4 Model - Context Diagram
        new Paragraph({
          text: "1. SYSTEM ARCHITECTURE - C4 MODEL",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "1.1 Context Diagram (Level 1)",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "The Glocalization Module operates within a complex ecosystem of internal users, external systems, and AI services:",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "External Actors:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Brand Marketing Teams: Primary users who create and manage content localization projects", spacing: { after: 50 } }),
        new Paragraph({ text: "• Medical-Legal-Regulatory (MLR) Reviewers: Compliance reviewers who approve pharmaceutical content", spacing: { after: 50 } }),
        new Paragraph({ text: "• Global Market Teams: Regional teams who review culturally adapted content", spacing: { after: 50 } }),
        new Paragraph({ text: "• System Administrators: IT staff managing user accounts, permissions, and system configuration", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "External Systems:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Enterprise SSO (Auth0): Centralized authentication and authorization service", spacing: { after: 50 } }),
        new Paragraph({ text: "• OpenAI API: Primary AI translation service (GPT-5)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Google AI API: Fallback AI translation service (Gemini Pro)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Email Service (SendGrid): Notification and alert delivery", spacing: { after: 50 } }),
        new Paragraph({ text: "• Analytics Platform (Mixpanel): User behavior and system performance tracking", spacing: { after: 200 } }),
        // Container Diagram
        new Paragraph({
          text: "1.2 Container Diagram (Level 2)",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "The system comprises three main container groups:",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Frontend Container:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Technology: Next.js 14 (React), TypeScript, TailwindCSS", spacing: { after: 50 } }),
        new Paragraph({ text: "• Deployment: AWS CloudFront (CDN) + S3 static hosting", spacing: { after: 50 } }),
        new Paragraph({ text: "• Key Features: Server-side rendering (SSR), real-time WebSocket client, responsive design", spacing: { after: 50 } }),
        new Paragraph({ text: "• Security: JWT token-based authentication, XSS protection, CSP headers", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Backend API Container:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Technology: Node.js 20 LTS, Express.js, TypeScript", spacing: { after: 50 } }),
        new Paragraph({ text: "• Deployment: AWS ECS Fargate (container orchestration)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Architecture: RESTful API with OpenAPI 3.0 specification", spacing: { after: 50 } }),
        new Paragraph({ text: "• Scalability: Auto-scaling groups (2-10 instances based on CPU/memory)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Load Balancing: Application Load Balancer (ALB) with health checks", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Data Stores:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• PostgreSQL 15 (RDS Multi-AZ): Primary relational database for transactional data", spacing: { after: 50 } }),
        new Paragraph({ text: "• Redis 7 (ElastiCache): Session store, caching layer, real-time features", spacing: { after: 50 } }),
        new Paragraph({ text: "• Elasticsearch 8: Translation Memory search and matching engine", spacing: { after: 50 } }),
        new Paragraph({ text: "• S3: Document storage for exports, templates, and uploaded content", spacing: { after: 200 } }),
        // Component Diagram
        new Paragraph({
          text: "1.3 Component Diagram (Level 3)",
          heading: HeadingLevel.HEADING_2,
          pageBreakBefore: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Backend API is decomposed into the following microservices:",
          spacing: { after: 200 },
        }),
        createComponentTable(),
        // Deployment Architecture
        new Paragraph({
          text: "2. DEPLOYMENT ARCHITECTURE",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "2.1 Cloud Infrastructure (AWS)",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Network Architecture:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• VPC Configuration: Multi-AZ deployment across 3 availability zones (us-east-1a, 1b, 1c)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Subnets: Public subnets (ALB, NAT Gateway), Private subnets (ECS, RDS), Isolated subnets (Database)", spacing: { after: 50 } }),
        new Paragraph({ text: "• CIDR Blocks: VPC (10.0.0.0/16), Public (10.0.1.0/24, 10.0.2.0/24), Private (10.0.11.0/24, 10.0.12.0/24)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Security Groups: Strict ingress/egress rules, principle of least privilege", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Compute Layer:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• ECS Fargate Cluster: Serverless container orchestration", spacing: { after: 50 } }),
        new Paragraph({ text: "• Task Definitions: CPU (2 vCPU), Memory (4 GB), Health checks (HTTP 200 on /health)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Service Configuration: Desired count (2), Max (10), Min (2), Rolling deployment strategy", spacing: { after: 50 } }),
        new Paragraph({ text: "• Auto-scaling Triggers: CPU > 70% (scale out), CPU < 30% (scale in), Memory > 80%", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Database Layer:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• RDS PostgreSQL 15 Multi-AZ: Primary (us-east-1a), Standby (us-east-1b)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Instance Type: db.r6g.xlarge (4 vCPU, 32 GB RAM)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Storage: GP3 SSD, 500 GB provisioned, auto-scaling up to 1 TB", spacing: { after: 50 } }),
        new Paragraph({ text: "• Backup: Automated daily backups (35-day retention), point-in-time recovery enabled", spacing: { after: 50 } }),
        new Paragraph({ text: "• Read Replicas: 2 replicas for read-heavy operations (analytics, reporting)", spacing: { after: 200 } }),
        new Paragraph({
          text: "2.2 CI/CD Pipeline",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "GitHub Actions Workflow:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Trigger: Push to main branch, pull request to main", spacing: { after: 50 } }),
        new Paragraph({ text: "• Build: TypeScript compilation, ESLint checks, Unit tests (Jest), Integration tests", spacing: { after: 50 } }),
        new Paragraph({ text: "• Docker Build: Multi-stage builds, vulnerability scanning (Trivy), image tagging", spacing: { after: 50 } }),
        new Paragraph({ text: "• Deployment: ECR push, ECS service update, health check validation", spacing: { after: 50 } }),
        new Paragraph({ text: "• Rollback: Automatic rollback on failed health checks", spacing: { after: 200 } }),
        // Entity-Relationship Diagram
        new Paragraph({
          text: "3. DATA MODEL & SCHEMA DESIGN",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "3.1 Entity-Relationship Diagram",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "The database schema follows a multi-tenant architecture with strict data isolation using Row-Level Security (RLS).",
          spacing: { after: 200 },
        }),
        createERDTable(),
        new Paragraph({
          text: "3.2 Key Database Features",
          heading: HeadingLevel.HEADING_2,
          pageBreakBefore: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Row-Level Security (RLS):", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• All tables have RLS policies enforcing tenant_id isolation", spacing: { after: 50 } }),
        new Paragraph({ text: "• Users can only access data belonging to their tenant", spacing: { after: 50 } }),
        new Paragraph({ text: "• Superadmin role can bypass RLS for system administration", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Indexes for Performance:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• B-tree indexes: Primary keys, foreign keys, frequently queried columns", spacing: { after: 50 } }),
        new Paragraph({ text: "• Composite indexes: (tenant_id, project_id), (tenant_id, user_id)", spacing: { after: 50 } }),
        new Paragraph({ text: "• GIN indexes: Full-text search on content fields, JSONB columns", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Triggers & Functions:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• updated_at timestamp: Automatically updated on record modification", spacing: { after: 50 } }),
        new Paragraph({ text: "• Audit logging trigger: Captures all INSERT/UPDATE/DELETE operations", spacing: { after: 50 } }),
        new Paragraph({ text: "• Translation Memory matching: Fuzzy match scoring function", spacing: { after: 200 } }),
        // API Specifications
        new Paragraph({
          text: "4. API SPECIFICATIONS",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "4.1 RESTful API Overview",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "All APIs follow OpenAPI 3.0 specification with consistent patterns:",
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Base URL: https://api.glocalization.example.com/v1", spacing: { after: 50 } }),
        new Paragraph({ text: "• Authentication: Bearer token (JWT) in Authorization header", spacing: { after: 50 } }),
        new Paragraph({ text: "• Content-Type: application/json", spacing: { after: 50 } }),
        new Paragraph({ text: "• Rate Limiting: 100 requests/minute per user, 1000 requests/minute per tenant", spacing: { after: 50 } }),
        new Paragraph({ text: "• Error Format: RFC 7807 (Problem Details for HTTP APIs)", spacing: { after: 200 } }),
        new Paragraph({
          text: "4.2 Core API Endpoints",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        createAPIEndpointsTable(),
        new Paragraph({
          text: "4.3 API Security",
          heading: HeadingLevel.HEADING_2,
          pageBreakBefore: true,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• JWT Authentication: RS256 algorithm, 1-hour token expiry, refresh token flow", spacing: { after: 50 } }),
        new Paragraph({ text: "• API Key Authentication: For service-to-service communication", spacing: { after: 50 } }),
        new Paragraph({ text: "• CORS Configuration: Whitelist of allowed origins, credentials support", spacing: { after: 50 } }),
        new Paragraph({ text: "• Input Validation: JSON Schema validation, SQL injection prevention", spacing: { after: 50 } }),
        new Paragraph({ text: "• Output Sanitization: XSS prevention, sensitive data masking", spacing: { after: 200 } }),
        // Sequence Diagrams
        new Paragraph({
          text: "5. KEY USER FLOWS - SEQUENCE DIAGRAMS",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "5.1 Translation Workflow",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        ...createTranslationSequenceDiagram(),
        new Paragraph({
          text: "5.2 Cultural Adaptation Workflow",
          heading: HeadingLevel.HEADING_2,
          pageBreakBefore: true,
          spacing: { after: 100 },
        }),
        ...createCulturalSequenceDiagram(),
        // Non-Functional Requirements
        new Paragraph({
          text: "6. NON-FUNCTIONAL REQUIREMENTS",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "6.1 Performance Requirements",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• API Response Time: P95 < 200ms for read operations, P95 < 500ms for write operations", spacing: { after: 50 } }),
        new Paragraph({ text: "• Translation Processing: < 2 seconds per 100 words (with TM cache)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Page Load Time: < 2 seconds for initial load, < 1 second for subsequent navigation", spacing: { after: 50 } }),
        new Paragraph({ text: "• Concurrent Users: Support 500 concurrent users per tenant", spacing: { after: 50 } }),
        new Paragraph({ text: "• Database Queries: P95 < 50ms for indexed queries", spacing: { after: 200 } }),
        new Paragraph({
          text: "6.2 Scalability Requirements",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Horizontal Scaling: Auto-scale from 2 to 10 application instances", spacing: { after: 50 } }),
        new Paragraph({ text: "• Database Scaling: Read replicas for read-heavy operations", spacing: { after: 50 } }),
        new Paragraph({ text: "• Storage Scaling: Auto-scale database storage from 500 GB to 1 TB", spacing: { after: 50 } }),
        new Paragraph({ text: "• Tenant Scaling: Support 100+ tenants on shared infrastructure", spacing: { after: 200 } }),
        new Paragraph({
          text: "6.3 Security Requirements",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Data Encryption: TLS 1.3 in transit, AES-256 at rest", spacing: { after: 50 } }),
        new Paragraph({ text: "• Authentication: Multi-factor authentication (MFA) support, SSO via SAML 2.0", spacing: { after: 50 } }),
        new Paragraph({ text: "• Authorization: Role-based access control (RBAC), attribute-based access control (ABAC)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Audit Logging: All user actions logged with timestamp, user ID, IP address", spacing: { after: 50 } }),
        new Paragraph({ text: "• Vulnerability Management: Quarterly penetration testing, continuous vulnerability scanning", spacing: { after: 50 } }),
        new Paragraph({ text: "• Compliance: SOC 2 Type I readiness, GDPR compliance, HIPAA considerations", spacing: { after: 200 } }),
        new Paragraph({
          text: "6.4 Reliability Requirements",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Uptime SLA: 99.9% (43.8 minutes downtime per month)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Disaster Recovery: RPO (Recovery Point Objective) = 1 hour, RTO (Recovery Time Objective) = 4 hours", spacing: { after: 50 } }),
        new Paragraph({ text: "• Backup Strategy: Daily automated backups with 35-day retention", spacing: { after: 50 } }),
        new Paragraph({ text: "• Failover: Automatic Multi-AZ failover for database (< 60 seconds)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Monitoring: 24/7 monitoring with PagerDuty alerts for critical incidents", spacing: { after: 200 } }),
        new Paragraph({
          text: "6.5 Maintainability Requirements",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Code Coverage: Minimum 80% unit test coverage", spacing: { after: 50 } }),
        new Paragraph({ text: "• Documentation: OpenAPI specs, architecture diagrams, runbooks", spacing: { after: 50 } }),
        new Paragraph({ text: "• Code Quality: ESLint rules enforced, SonarQube code analysis", spacing: { after: 50 } }),
        new Paragraph({ text: "• Logging: Structured JSON logging with correlation IDs", spacing: { after: 50 } }),
        new Paragraph({ text: "• Observability: Datadog dashboards for key metrics, distributed tracing", spacing: { after: 200 } }),
        // AI Architecture
        new Paragraph({
          text: "7. AI TRANSLATION ENGINE",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "7.1 AI Provider Strategy",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Primary Provider: OpenAI GPT-5", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Model: gpt-5", spacing: { after: 50 } }),
        new Paragraph({ text: "• Context Window: 128,000 tokens", spacing: { after: 50 } }),
        new Paragraph({ text: "• Specialization: High-quality pharmaceutical translation with terminology consistency", spacing: { after: 50 } }),
        new Paragraph({ text: "• Rate Limits: 10,000 requests/minute (enterprise tier)", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Fallback Provider: Google Gemini Pro", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Model: gemini-pro", spacing: { after: 50 } }),
        new Paragraph({ text: "• Context Window: 32,000 tokens", spacing: { after: 50 } }),
        new Paragraph({ text: "• Activation: Automatic failover when OpenAI unavailable or rate-limited", spacing: { after: 50 } }),
        new Paragraph({ text: "• Rate Limits: 60 requests/minute", spacing: { after: 200 } }),
        new Paragraph({
          text: "7.2 Translation Memory (TM) Architecture",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Storage: Elasticsearch 8 with custom scoring algorithm", spacing: { after: 50 } }),
        new Paragraph({ text: "• Matching: Fuzzy matching with 70% threshold, exact phrase matching", spacing: { after: 50 } }),
        new Paragraph({ text: "• Scoring: Levenshtein distance + context similarity + metadata matching", spacing: { after: 50 } }),
        new Paragraph({ text: "• Indexing: Real-time indexing on translation approval", spacing: { after: 50 } }),
        new Paragraph({ text: "• Benefits: 30% cost reduction via TM reuse, faster translation times", spacing: { after: 200 } }),
        new Paragraph({
          text: "7.3 Prompt Engineering",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Pharmaceutical-specific prompt templates with:",
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Context: Therapeutic area, target audience, regulatory market", spacing: { after: 50 } }),
        new Paragraph({ text: "• Constraints: Character limits, brand names (preserve), regulatory terminology", spacing: { after: 50 } }),
        new Paragraph({ text: "• Examples: Few-shot learning with approved translations", spacing: { after: 50 } }),
        new Paragraph({ text: "• Validation: Post-processing checks for terminology consistency", spacing: { after: 200 } }),
        // Real-time Collaboration
        new Paragraph({
          text: "8. REAL-TIME COLLABORATION INFRASTRUCTURE",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "8.1 WebSocket Architecture",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Technology: Socket.io (WebSocket with fallback to long-polling)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Scaling: Redis pub/sub for message broadcasting across instances", spacing: { after: 50 } }),
        new Paragraph({ text: "• Rooms: Isolated channels per project workspace", spacing: { after: 50 } }),
        new Paragraph({ text: "• Events: User presence, cursor position, content changes, comments", spacing: { after: 50 } }),
        new Paragraph({ text: "• Conflict Resolution: Operational Transformation (OT) for concurrent edits", spacing: { after: 200 } }),
        new Paragraph({
          text: "8.2 Features Enabled",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Live Cursors: See other users' cursor positions in real-time", spacing: { after: 50 } }),
        new Paragraph({ text: "• Presence Indicators: Online/offline status, active users list", spacing: { after: 50 } }),
        new Paragraph({ text: "• Instant Comments: Real-time comment threads on content segments", spacing: { after: 50 } }),
        new Paragraph({ text: "• Lock Mechanism: Prevent simultaneous edits on same content segment", spacing: { after: 50 } }),
        new Paragraph({ text: "• Notifications: In-app alerts for mentions, approvals, status changes", spacing: { after: 200 } }),
        // Monitoring & Observability
        new Paragraph({
          text: "9. MONITORING & OBSERVABILITY",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "9.1 Key Metrics Tracked",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Application Metrics:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Request Rate: Requests per second by endpoint", spacing: { after: 50 } }),
        new Paragraph({ text: "• Response Time: P50, P95, P99 latencies", spacing: { after: 50 } }),
        new Paragraph({ text: "• Error Rate: 4xx and 5xx errors by endpoint", spacing: { after: 50 } }),
        new Paragraph({ text: "• Throughput: Translation words per minute, projects created per hour", spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "Infrastructure Metrics:", bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• CPU Utilization: Per ECS task, cluster average", spacing: { after: 50 } }),
        new Paragraph({ text: "• Memory Usage: Per task, Redis cache hit rate", spacing: { after: 50 } }),
        new Paragraph({ text: "• Network I/O: Ingress/egress bandwidth", spacing: { after: 50 } }),
        new Paragraph({ text: "• Database Metrics: Connection pool usage, query duration, deadlocks", spacing: { after: 200 } }),
        new Paragraph({
          text: "9.2 Alerting Strategy",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• Critical Alerts: P1 incidents (API down, database failure) → PagerDuty → 5min response SLA", spacing: { after: 50 } }),
        new Paragraph({ text: "• High Priority: P2 incidents (elevated error rate, performance degradation) → Slack → 30min response", spacing: { after: 50 } }),
        new Paragraph({ text: "• Medium Priority: P3 incidents (single service degradation) → Slack → 2hr response", spacing: { after: 50 } }),
        new Paragraph({ text: "• Low Priority: P4 incidents (warnings, capacity planning) → Email → Next business day", spacing: { after: 200 } }),
        // Security Controls
        new Paragraph({
          text: "10. SECURITY CONTROLS (SOC 2)",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        createSecurityControlsTable(),
        // Appendix
        new Paragraph({
          text: "11. APPENDIX",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "11.1 Glossary",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• RLS: Row-Level Security - PostgreSQL feature for data isolation", spacing: { after: 50 } }),
        new Paragraph({ text: "• TM: Translation Memory - Database of previously translated content", spacing: { after: 50 } }),
        new Paragraph({ text: "• MLR: Medical-Legal-Regulatory review process", spacing: { after: 50 } }),
        new Paragraph({ text: "• ECS: Elastic Container Service - AWS container orchestration", spacing: { after: 50 } }),
        new Paragraph({ text: "• ALB: Application Load Balancer - AWS Layer 7 load balancer", spacing: { after: 50 } }),
        new Paragraph({ text: "• JWT: JSON Web Token - Authentication token format", spacing: { after: 200 } }),
        new Paragraph({
          text: "11.2 References",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        new Paragraph({ text: "• AWS Well-Architected Framework: https://aws.amazon.com/architecture/well-architected/", spacing: { after: 50 } }),
        new Paragraph({ text: "• OpenAPI 3.0 Specification: https://swagger.io/specification/", spacing: { after: 50 } }),
        new Paragraph({ text: "• C4 Model for Architecture Diagrams: https://c4model.com/", spacing: { after: 50 } }),
        new Paragraph({ text: "• SOC 2 Trust Service Criteria: https://www.aicpa.org/", spacing: { after: 50 } }),
        new Paragraph({ text: "• OWASP Top 10 Security Risks: https://owasp.org/Top10/", spacing: { after: 200 } }),
      ],
    }],
  });
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Glocalization_Technical_Architecture_${new Date().toISOString().split('T')[0]}.docx`;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Helper function to create component table
function createComponentTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Service Name", bold: true })] })],
            shading: { fill: "E0E0E0" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Purpose", bold: true })] })],
            shading: { fill: "E0E0E0" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Technology", bold: true })] })],
            shading: { fill: "E0E0E0" },
          }),
        ],
      }),
      createComponentRow("Auth Service", "User authentication, JWT token management, session handling", "Express.js, Auth0 SDK"),
      createComponentRow("Project Service", "Project CRUD, status tracking, user assignments", "Express.js, TypeORM"),
      createComponentRow("Translation Service", "AI translation orchestration, TM matching, fallback logic", "Express.js, OpenAI SDK, Gemini SDK"),
      createComponentRow("Segmentation Service", "Content parsing, word-level breakdown, metadata extraction", "Node.js, Natural NLP"),
      createComponentRow("Workflow Engine", "5-phase state machine, transition rules, notifications", "Express.js, State machine library"),
      createComponentRow("Cultural Intelligence", "Market-specific recommendations, cultural adaptation suggestions", "Express.js, Custom AI prompts"),
      createComponentRow("Regulatory Service", "Compliance checking, regulatory rule engine", "Express.js, Rule engine"),
      createComponentRow("Collaboration Service", "WebSocket server, real-time events, presence management", "Socket.io, Redis pub/sub"),
      createComponentRow("Export Service", "DOCX/PDF generation, formatting preservation", "Express.js, docx library"),
      createComponentRow("Analytics Service", "Usage tracking, ROI calculations, reporting", "Express.js, Mixpanel SDK"),
      createComponentRow("Admin Service", "Tenant management, user provisioning, RBAC", "Express.js, TypeORM"),
      createComponentRow("Notification Service", "Email alerts, in-app notifications, webhook triggers", "Express.js, SendGrid API"),
    ],
  });
}

function createComponentRow(service, purpose, tech) {
  return new TableRow({
    children: [
      new TableCell({ children: [new Paragraph(service)] }),
      new TableCell({ children: [new Paragraph(purpose)] }),
      new TableCell({ children: [new Paragraph(tech)] }),
    ],
  });
}

// Helper function to create ERD table
function createERDTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Entity", bold: true })] })],
            shading: { fill: "E0E0E0" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Key Attributes", bold: true })] })],
            shading: { fill: "E0E0E0" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Relationships", bold: true })] })],
            shading: { fill: "E0E0E0" },
          }),
        ],
      }),
      createERDRow("tenants", "id (PK), name, domain, settings (JSONB), subscription_tier", "-"),
      createERDRow("users", "id (PK), tenant_id (FK), email, role (enum), mfa_enabled", "belongs_to: tenants"),
      createERDRow("projects", "id (PK), tenant_id (FK), name, source_language, target_languages (array), status", "belongs_to: tenants, has_many: assets, content_segments"),
      createERDRow("content_assets", "id (PK), project_id (FK), asset_type, source_content (text), metadata (JSONB)", "belongs_to: projects, has_many: content_segments"),
      createERDRow("content_segments", "id (PK), asset_id (FK), segment_text, word_count, workflow_phase", "belongs_to: content_assets, has_many: translations"),
      createERDRow("translations", "id (PK), segment_id (FK), target_language, translated_text, tm_match_score, ai_provider", "belongs_to: content_segments"),
      createERDRow("translation_memory", "id (PK), tenant_id (FK), source_text, target_text, language_pair, context (JSONB)", "belongs_to: tenants"),
      createERDRow("cultural_recommendations", "id (PK), project_id (FK), recommendation_type, description, market, priority", "belongs_to: projects"),
      createERDRow("regulatory_checks", "id (PK), project_id (FK), check_type, status, findings (JSONB), market", "belongs_to: projects"),
      createERDRow("audit_logs", "id (PK), tenant_id (FK), user_id (FK), action, resource_type, resource_id, ip_address", "belongs_to: tenants, users"),
    ],
  });
}

function createERDRow(entity, attributes, relationships) {
  return new TableRow({
    children: [
      new TableCell({ children: [new Paragraph(entity)] }),
      new TableCell({ children: [new Paragraph(attributes)] }),
      new TableCell({ children: [new Paragraph(relationships)] }),
    ],
  });
}

// Helper function to create API endpoints table
function createAPIEndpointsTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Endpoint", bold: true })] })],
            shading: { fill: "E0E0E0" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Method", bold: true })] })],
            shading: { fill: "E0E0E0" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })],
            shading: { fill: "E0E0E0" },
          }),
        ],
      }),
      createAPIRow("/auth/login", "POST", "Authenticate user, return JWT token"),
      createAPIRow("/auth/refresh", "POST", "Refresh expired JWT token"),
      createAPIRow("/projects", "GET", "List all projects for tenant (with pagination)"),
      createAPIRow("/projects", "POST", "Create new project"),
      createAPIRow("/projects/{id}", "GET", "Get project details"),
      createAPIRow("/projects/{id}", "PUT", "Update project"),
      createAPIRow("/projects/{id}/assets", "POST", "Upload content asset to project"),
      createAPIRow("/translations/translate", "POST", "Request AI translation for segment"),
      createAPIRow("/translations/tm-match", "GET", "Find Translation Memory matches"),
      createAPIRow("/workflow/{projectId}/advance", "POST", "Advance project to next workflow phase"),
      createAPIRow("/cultural/recommendations", "GET", "Get cultural adaptation suggestions"),
      createAPIRow("/regulatory/check", "POST", "Run regulatory compliance checks"),
      createAPIRow("/exports/docx", "POST", "Generate DOCX export"),
      createAPIRow("/analytics/roi", "GET", "Calculate ROI metrics"),
      createAPIRow("/admin/users", "GET", "List all users (admin only)"),
    ],
  });
}

function createAPIRow(endpoint, method, description) {
  return new TableRow({
    children: [
      new TableCell({ children: [new Paragraph(endpoint)] }),
      new TableCell({ children: [new Paragraph(method)] }),
      new TableCell({ children: [new Paragraph(description)] }),
    ],
  });
}

// Helper function to create translation sequence diagram (text representation)
function createTranslationSequenceDiagram() {
  return [
    new Paragraph({
      text: "Step-by-step flow:",
      spacing: { after: 100 },
    }),
    new Paragraph({ text: "1. User uploads content asset (DOCX/PDF) via Frontend", spacing: { after: 50 } }),
    new Paragraph({ text: "2. Frontend sends POST request to /projects/{id}/assets", spacing: { after: 50 } }),
    new Paragraph({ text: "3. Project Service validates file, stores in S3", spacing: { after: 50 } }),
    new Paragraph({ text: "4. Segmentation Service parses content, extracts segments", spacing: { after: 50 } }),
    new Paragraph({ text: "5. For each segment:", spacing: { after: 50 } }),
    new Paragraph({ text: " a. Translation Service queries TM Service for matches (Elasticsearch)", spacing: { after: 50 } }),
    new Paragraph({ text: " b. If match score > 90%: Use TM translation", spacing: { after: 50 } }),
    new Paragraph({ text: " c. If match score < 90%: Call AI Translation Service", spacing: { after: 50 } }),
    new Paragraph({ text: " d. AI Service tries OpenAI GPT-5 first", spacing: { after: 50 } }),
    new Paragraph({ text: " e. On failure: Fallback to Google Gemini Pro", spacing: { after: 50 } }),
    new Paragraph({ text: "6. Translation stored in database with metadata (provider, score, timestamp)", spacing: { after: 50 } }),
    new Paragraph({ text: "7. WebSocket broadcasts update to all users in project room", spacing: { after: 50 } }),
    new Paragraph({ text: "8. Frontend updates UI in real-time", spacing: { after: 200 } }),
  ];
}

// Helper function to create cultural sequence diagram
function createCulturalSequenceDiagram() {
  return [
    new Paragraph({
      text: "Step-by-step flow:",
      spacing: { after: 100 },
    }),
    new Paragraph({ text: "1. User advances project to 'Cultural Intelligence' phase", spacing: { after: 50 } }),
    new Paragraph({ text: "2. Frontend calls POST /workflow/{projectId}/advance", spacing: { after: 50 } }),
    new Paragraph({ text: "3. Workflow Engine validates phase transition rules", spacing: { after: 50 } }),
    new Paragraph({ text: "4. Cultural Intelligence Service triggered automatically", spacing: { after: 50 } }),
    new Paragraph({ text: "5. Service analyzes:", spacing: { after: 50 } }),
    new Paragraph({ text: " a. Target market cultural norms (from market_profiles table)", spacing: { after: 50 } }),
    new Paragraph({ text: " b. Content sentiment and messaging approach", spacing: { after: 50 } }),
    new Paragraph({ text: " c. Visual elements and color symbolism", spacing: { after: 50 } }),
    new Paragraph({ text: " d. Regulatory considerations for market", spacing: { after: 50 } }),
    new Paragraph({ text: "6. AI generates recommendations using GPT-5 with market-specific prompts", spacing: { after: 50 } }),
    new Paragraph({ text: "7. Recommendations stored with priority (High/Medium/Low)", spacing: { after: 50 } }),
    new Paragraph({ text: "8. Notification sent to Global Market Team users", spacing: { after: 50 } }),
    new Paragraph({ text: "9. Frontend displays recommendations in side panel", spacing: { after: 200 } }),
  ];
}

// Helper function to create security controls table
function createSecurityControlsTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Control Category", bold: true })] })],
            shading: { fill: "E0E0E0" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Implementation", bold: true })] })],
            shading: { fill: "E0E0E0" },
          }),
        ],
      }),
      createSecurityRow("Access Control", "RBAC with 5 roles (Superadmin, Admin, Manager, Contributor, Viewer), MFA enforcement for admin roles"),
      createSecurityRow("Data Encryption", "TLS 1.3 for data in transit, AES-256 for data at rest (RDS, S3), encrypted database backups"),
      createSecurityRow("Network Security", "VPC with private subnets, Security groups with least privilege, NACLs, AWS WAF for DDoS protection"),
      createSecurityRow("Audit Logging", "All API calls logged with user, timestamp, IP, action, Logs retained for 7 years, Immutable audit trail"),
      createSecurityRow("Vulnerability Management", "Automated SAST/DAST in CI/CD, Dependency scanning (Snyk), Quarterly pentests by external firm"),
      createSecurityRow("Incident Response", "24/7 monitoring, Incident response runbooks, 15-minute P1 response time, Post-incident reviews"),
      createSecurityRow("Data Privacy", "GDPR-compliant data handling, Right to erasure (RTBF), Data processing agreements (DPAs)"),
      createSecurityRow("Backup & Recovery", "Daily automated backups, 35-day retention, Point-in-time recovery, Quarterly DR drills"),
    ],
  });
}

function createSecurityRow(category, implementation) {
  return new TableRow({
    children: [
      new TableCell({ children: [new Paragraph(category)] }),
      new TableCell({ children: [new Paragraph(implementation)] }),
    ],
  });
}