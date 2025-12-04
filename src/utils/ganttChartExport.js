
import * as XLSX from 'xlsx';

// Sheet 1: Task List
export const generateGanttChartExcel = () => {
  const workbook = XLSX.utils.book_new();
  // Define phase colors for visual Gantt chart
  const phaseColors = {
    'Discovery': '4472C4',
    'Architecture': '70AD47',
    'Infrastructure': 'FFC000',
    'Development': '5B9BD5',
    'Security': 'C55A11',
    'Testing': 'A5A5A5',
    'Migration': 'F4B084',
    'Launch Prep': '9E480E',
    'Launch': '264478',
  };
  // Sheet 1: Task List
  const taskData = [
    { id: '1', taskName: 'PHASE 1: DISCOVERY & REQUIREMENTS', duration: 9, startDate: '2025-11-03', endDate: '2025-11-11', predecessor: '-', resource: 'PM, Architect', phase: 'Discovery', status: 'Not Started' },
    { id: '1.1', taskName: 'Client Requirements Workshop', duration: 3, startDate: '2025-11-03', endDate: '2025-11-05', predecessor: '-', resource: 'PM, Client Team', phase: 'Discovery', status: 'Not Started' },
    { id: '1.2', taskName: 'Security & Compliance Requirements', duration: 2, startDate: '2025-11-06', endDate: '2025-11-07', predecessor: '1.1', resource: 'Security Architect', phase: 'Discovery', status: 'Not Started' },
    { id: '1.3', taskName: 'Current System Audit', duration: 5, startDate: '2025-11-03', endDate: '2025-11-07', predecessor: '-', resource: 'Solutions Architect', phase: 'Discovery', status: 'Not Started' },
    { id: '1.4', taskName: 'Functional Requirements Documentation', duration: 3, startDate: '2025-11-08', endDate: '2025-11-10', predecessor: '1.2', resource: 'PM, BA', phase: 'Discovery', status: 'Not Started' },
    { id: '1.5', taskName: '✅ Requirements Sign-off (MILESTONE)', duration: 1, startDate: '2025-11-11', endDate: '2025-11-11', predecessor: '1.4', resource: 'Client, PM', phase: 'Discovery', status: 'Not Started' },
    { id: '2', taskName: 'PHASE 2: ARCHITECTURE DESIGN', duration: 12, startDate: '2025-11-12', endDate: '2025-11-23', predecessor: '1.5', resource: 'Architects', phase: 'Architecture', status: 'Not Started' },
    { id: '2.1', taskName: 'Technology Stack Selection', duration: 2, startDate: '2025-11-12', endDate: '2025-11-13', predecessor: '1.5', resource: 'Solutions Architect', phase: 'Architecture', status: 'Not Started' },
    { id: '2.2', taskName: 'Security Architecture Design', duration: 3, startDate: '2025-11-14', endDate: '2025-11-16', predecessor: '2.1', resource: 'Security Architect', phase: 'Architecture', status: 'Not Started' },
    { id: '2.3', taskName: 'Database Schema Design', duration: 4, startDate: '2025-11-14', endDate: '2025-11-17', predecessor: '2.1', resource: 'DB Architect', phase: 'Architecture', status: 'Not Started' },
    { id: '2.4', taskName: 'AI Architecture Design', duration: 3, startDate: '2025-11-14', endDate: '2025-11-16', predecessor: '2.1', resource: 'Solutions Architect', phase: 'Architecture', status: 'Not Started' },
    { id: '2.5', taskName: 'Multi-Tenant Architecture Design', duration: 2, startDate: '2025-11-18', endDate: '2025-11-19', predecessor: '2.3', resource: 'Solutions Architect', phase: 'Architecture', status: 'Not Started' },
    { id: '2.6', taskName: 'API Design & Documentation', duration: 3, startDate: '2025-11-20', endDate: '2025-11-22', predecessor: '2.5', resource: 'Backend Lead', phase: 'Architecture', status: 'Not Started' },
    { id: '2.7', taskName: 'Infrastructure Design (AWS)', duration: 3, startDate: '2025-11-17', endDate: '2025-11-19', predecessor: '2.2', resource: 'DevOps Lead', phase: 'Architecture', status: 'Not Started' },
    { id: '2.8', taskName: '✅ Architecture Approval (MILESTONE)', duration: 1, startDate: '2025-11-23', endDate: '2025-11-23', predecessor: '2.6,2.7', resource: 'CTO, Client', phase: 'Architecture', status: 'Not Started' },
    { id: '3', taskName: 'PHASE 3: INFRASTRUCTURE SETUP', duration: 14, startDate: '2025-11-24', endDate: '2025-12-07', predecessor: '2.8', resource: 'DevOps', phase: 'Infrastructure', status: 'Not Started' },
    { id: '3.1', taskName: 'AWS Account & VPC Setup', duration: 2, startDate: '2025-11-24', endDate: '2025-11-25', predecessor: '2.8', resource: 'DevOps Engineer', phase: 'Infrastructure', status: 'Not Started' },
    { id: '3.2', taskName: 'RDS PostgreSQL Setup (Multi-AZ)', duration: 2, startDate: '2025-11-26', endDate: '2025-11-27', predecessor: '3.1', resource: 'DevOps Engineer', phase: 'Infrastructure', status: 'Not Started' },
    { id: '3.3', taskName: 'S3 & CloudFront Setup', duration: 2, startDate: '2025-11-26', endDate: '2025-11-27', predecessor: '3.1', resource: 'DevOps Engineer', phase: 'Infrastructure', status: 'Not Started' },
    { id: '3.4', taskName: 'ECS/Fargate Cluster Setup', duration: 3, startDate: '2025-11-26', endDate: '2025-11-28', predecessor: '3.1', resource: 'DevOps Engineer', phase: 'Infrastructure', status: 'Not Started' },
    { id: '3.5', taskName: 'Auth0 Integration Setup', duration: 3, startDate: '2025-11-26', endDate: '2025-11-28', predecessor: '3.1', resource: 'Backend Dev', phase: 'Infrastructure', status: 'Not Started' },
    { id: '3.6', taskName: 'Redis Cache Setup', duration: 1, startDate: '2025-11-28', endDate: '2025-11-28', predecessor: '3.2', resource: 'DevOps Engineer', phase: 'Infrastructure', status: 'Not Started' },
    { id: '3.7', taskName: 'Elasticsearch Setup', duration: 2, startDate: '2025-11-28', endDate: '2025-11-29', predecessor: '3.2', resource: 'DevOps Engineer', phase: 'Infrastructure', status: 'Not Started' },
    { id: '3.8', taskName: 'CI/CD Pipeline (GitHub Actions)', duration: 3, startDate: '2025-11-29', endDate: '2025-12-01', predecessor: '3.4', resource: 'DevOps Lead', phase: 'Infrastructure', status: 'Not Started' },
    { id: '3.9', taskName: 'Monitoring Setup (Datadog)', duration: 2, startDate: '2025-11-29', endDate: '2025-12-01', predecessor: '3.4', resource: 'DevOps Engineer', phase: 'Infrastructure', status: 'Not Started' },
    { id: '3.10', taskName: '✅ Infrastructure Ready (MILESTONE)', duration: 1, startDate: '2025-12-07', endDate: '2025-12-07', predecessor: '3.8,3.9', resource: 'DevOps Lead', phase: 'Infrastructure', status: 'Not Started' },
    { id: '4', taskName: 'PHASE 4: SPRINT 1-2 (CORE BACKEND)', duration: 14, startDate: '2025-12-08', endDate: '2025-12-21', predecessor: '3.10', resource: 'Backend Team', phase: 'Development', status: 'Not Started' },
    { id: '4.1', taskName: 'Database Schema Migration', duration: 3, startDate: '2025-12-08', endDate: '2025-12-10', predecessor: '3.10', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '4.2', taskName: 'RLS Policies Implementation', duration: 3, startDate: '2025-12-11', endDate: '2025-12-13', predecessor: '4.1', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '4.3', taskName: 'Authentication Service', duration: 4, startDate: '2025-12-11', endDate: '2025-12-14', predecessor: '3.5', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '4.4', taskName: 'RBAC Implementation', duration: 3, startDate: '2025-12-15', endDate: '2025-12-17', predecessor: '4.3', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '4.5', taskName: 'Audit Logging Service', duration: 3, startDate: '2025-12-14', endDate: '2025-12-16', predecessor: '4.2', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '4.6', taskName: 'Project Management API', duration: 4, startDate: '2025-12-18', endDate: '2025-12-21', predecessor: '4.4', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '4.7', taskName: 'Content Segmentation Engine', duration: 4, startDate: '2025-12-18', endDate: '2025-12-21', predecessor: '4.6', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '4.8', taskName: '✅ Sprint 1-2 Demo (MILESTONE)', duration: 1, startDate: '2025-12-21', endDate: '2025-12-21', predecessor: '4.7,4.5', resource: 'Team, Client', phase: 'Development', status: 'Not Started' },
    { id: '5', taskName: 'PHASE 5: SPRINT 3-4 (CORE FEATURES)', duration: 21, startDate: '2025-12-22', endDate: '2026-01-11', predecessor: '4.8', resource: 'Full Stack Team', phase: 'Development', status: 'Not Started' },
    { id: '5.1', taskName: 'TM Matching Service (Elasticsearch)', duration: 5, startDate: '2025-12-22', endDate: '2025-12-26', predecessor: '4.8', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '5.2', taskName: 'AI Translation Service (OpenAI)', duration: 5, startDate: '2025-12-22', endDate: '2025-12-26', predecessor: '4.8', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '5.3', taskName: 'AI Fallback Logic (Multi-Provider)', duration: 3, startDate: '2025-12-27', endDate: '2025-12-29', predecessor: '5.2', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '5.4', taskName: 'Cultural Intelligence Service', duration: 4, startDate: '2025-12-27', endDate: '2025-12-30', predecessor: '5.1', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '5.5', taskName: 'Regulatory Compliance Service', duration: 4, startDate: '2025-12-27', endDate: '2025-12-30', predecessor: '5.1', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '5.6', taskName: '5-Phase Workflow Engine', duration: 5, startDate: '2025-12-31', endDate: '2026-01-04', predecessor: '5.4,5.5', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '5.7', taskName: 'Word-Level Translation Breakdown', duration: 3, startDate: '2025-12-27', endDate: '2025-12-29', predecessor: '5.2', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '5.8', taskName: '✅ Sprint 3-4 Demo (MILESTONE)', duration: 1, startDate: '2026-01-11', endDate: '2026-01-11', predecessor: '5.6,5.7', resource: 'Team, Client', phase: 'Development', status: 'Not Started' },
    { id: '6', taskName: 'PHASE 6: SPRINT 5 (FRONTEND & ADVANCED)', duration: 28, startDate: '2025-12-08', endDate: '2026-02-01', predecessor: '-', resource: 'Frontend Team', phase: 'Development', status: 'Not Started' },
    { id: '6.1', taskName: 'Next.js Frontend Setup', duration: 3, startDate: '2025-12-08', endDate: '2025-12-10', predecessor: '3.10', resource: 'Frontend Dev', phase: 'Development', status: 'Not Started' },
    { id: '6.2', taskName: 'Project Dashboard UI', duration: 4, startDate: '2025-12-22', endDate: '2025-12-25', predecessor: '6.1,4.6', resource: 'Frontend Dev', phase: 'Development', status: 'Not Started' },
    { id: '6.3', taskName: 'Workspace UI (5 Phases)', duration: 5, startDate: '2026-01-12', endDate: '2026-01-16', predecessor: '6.2,5.8', resource: 'Frontend Dev', phase: 'Development', status: 'Not Started' },
    { id: '6.4', taskName: 'Real-Time Collaboration (WebSockets)', duration: 4, startDate: '2026-01-17', endDate: '2026-01-20', predecessor: '6.3', resource: 'Full Stack Dev', phase: 'Development', status: 'Not Started' },
    { id: '6.5', taskName: 'Export Functionality (DOCX/PDF)', duration: 3, startDate: '2026-01-17', endDate: '2026-01-19', predecessor: '6.3', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '6.6', taskName: 'Analytics Dashboard', duration: 4, startDate: '2025-12-22', endDate: '2025-12-25', predecessor: '6.2', resource: 'Frontend Dev', phase: 'Development', status: 'Not Started' },
    { id: '6.7', taskName: 'Admin Panel (User/Tenant Management)', duration: 4, startDate: '2025-12-15', endDate: '2025-12-18', predecessor: '4.4', resource: 'Full Stack Dev', phase: 'Development', status: 'Not Started' },
    { id: '6.8', taskName: 'API Documentation (Swagger)', duration: 2, startDate: '2026-01-12', endDate: '2026-01-13', predecessor: '5.8', resource: 'Backend Dev', phase: 'Development', status: 'Not Started' },
    { id: '6.9', taskName: '✅ Sprint 5 Complete (MILESTONE)', duration: 1, startDate: '2026-02-01', endDate: '2026-02-01', predecessor: '6.4,6.5,6.7', resource: 'Team Lead', phase: 'Development', status: 'Not Started' },
    { id: '7', taskName: 'PHASE 7: SECURITY & COMPLIANCE', duration: 35, startDate: '2025-11-24', endDate: '2026-02-15', predecessor: '-', resource: 'Security Team', phase: 'Security', status: 'Not Started' },
    { id: '7.1', taskName: 'SOC 2 Policies Documentation', duration: 14, startDate: '2025-11-24', endDate: '2025-12-07', predecessor: '2.8', resource: 'Security Consultant', phase: 'Security', status: 'Not Started' },
    { id: '7.2', taskName: 'Security Controls Implementation', duration: 21, startDate: '2025-12-08', endDate: '2025-12-28', predecessor: '3.10', resource: 'Security Engineer', phase: 'Security', status: 'Not Started' },
    { id: '7.3', taskName: 'Vulnerability Scanning Setup', duration: 2, startDate: '2025-12-02', endDate: '2025-12-03', predecessor: '3.9', resource: 'DevOps Engineer', phase: 'Security', status: 'Not Started' },
    { id: '7.4', taskName: 'Penetration Testing (External Firm)', duration: 5, startDate: '2026-02-02', endDate: '2026-02-06', predecessor: '6.9', resource: 'External Vendor', phase: 'Security', status: 'Not Started' },
    { id: '7.5', taskName: 'Security Remediation', duration: 3, startDate: '2026-02-07', endDate: '2026-02-09', predecessor: '7.4', resource: 'Development Team', phase: 'Security', status: 'Not Started' },
    { id: '7.6', taskName: '✅ SOC 2 Readiness (MILESTONE)', duration: 1, startDate: '2026-02-15', endDate: '2026-02-15', predecessor: '7.5', resource: 'Security Lead', phase: 'Security', status: 'Not Started' },
    { id: '8', taskName: 'PHASE 8: TESTING & QA', duration: 40, startDate: '2025-12-08', endDate: '2026-03-08', predecessor: '-', resource: 'QA Team', phase: 'Testing', status: 'Not Started' },
    { id: '8.1', taskName: 'Unit Test Development (Parallel)', duration: 35, startDate: '2025-12-08', endDate: '2026-01-12', predecessor: '3.10', resource: 'QA Engineer', phase: 'Testing', status: 'Not Started' },
    { id: '8.2', taskName: 'Integration Testing', duration: 5, startDate: '2026-02-02', endDate: '2026-02-06', predecessor: '6.9', resource: 'QA Engineer', phase: 'Testing', status: 'Not Started' },
    { id: '8.3', taskName: 'End-to-End Testing (Playwright)', duration: 4, startDate: '2026-02-07', endDate: '2026-02-10', predecessor: '8.2', resource: 'QA Engineer', phase: 'Testing', status: 'Not Started' },
    { id: '8.4', taskName: 'Load Testing (k6)', duration: 2, startDate: '2026-02-11', endDate: '2026-02-12', predecessor: '8.3', resource: 'QA Engineer', phase: 'Testing', status: 'Not Started' },
    { id: '8.5', taskName: 'Bug Fixing Sprint', duration: 5, startDate: '2026-02-13', endDate: '2026-02-17', predecessor: '8.4', resource: 'Development Team', phase: 'Testing', status: 'Not Started' },
    { id: '8.6', taskName: 'UAT Preparation', duration: 2, startDate: '2026-02-18', endDate: '2026-02-19', predecessor: '8.5', resource: 'PM, QA', phase: 'Testing', status: 'Not Started' },
    { id: '8.7', taskName: 'Client UAT (2 weeks)', duration: 10, startDate: '2026-02-20', endDate: '2026-03-01', predecessor: '8.6', resource: 'Client Team, QA', phase: 'Testing', status: 'Not Started' },
    { id: '8.8', taskName: 'UAT Feedback Implementation', duration: 3, startDate: '2026-03-02', endDate: '2026-03-04', predecessor: '8.7', resource: 'Development Team', phase: 'Testing', status: 'Not Started' },
    { id: '8.9', taskName: '✅ QA Sign-off (MILESTONE)', duration: 1, startDate: '2026-03-08', endDate: '2026-03-08', predecessor: '8.8', resource: 'QA Lead, PM', phase: 'Testing', status: 'Not Started' },
    { id: '9', taskName: 'PHASE 9: MIGRATION & DEPLOYMENT', duration: 7, startDate: '2025-12-14', endDate: '2026-03-15', predecessor: '-', resource: 'DevOps Team', phase: 'Migration', status: 'Not Started' },
    { id: '9.1', taskName: 'Data Migration Script Development', duration: 5, startDate: '2025-12-14', endDate: '2025-12-18', predecessor: '4.2', resource: 'Backend Dev', phase: 'Migration', status: 'Not Started' },
    { id: '9.2', taskName: 'Data Migration Testing (Staging)', duration: 3, startDate: '2026-02-02', endDate: '2026-02-04', predecessor: '9.1,6.9', resource: 'DevOps, QA', phase: 'Migration', status: 'Not Started' },
    { id: '9.3', taskName: 'Edge Functions Rewrite (Node.js)', duration: 5, startDate: '2026-01-12', endDate: '2026-01-16', predecessor: '5.8', resource: 'Backend Dev', phase: 'Migration', status: 'Not Started' },
    { id: '9.4', taskName: 'Migration Dry Run', duration: 2, startDate: '2026-02-05', endDate: '2026-02-06', predecessor: '9.2,9.3', resource: 'DevOps Lead', phase: 'Migration', status: 'Not Started' },
    { id: '9.5', taskName: 'Production Data Migration', duration: 2, startDate: '2026-03-09', endDate: '2026-03-10', predecessor: '8.9', resource: 'DevOps Team', phase: 'Migration', status: 'Not Started' },
    { id: '9.6', taskName: '✅ DNS Cutover (MILESTONE)', duration: 1, startDate: '2026-03-15', endDate: '2026-03-15', predecessor: '9.5', resource: 'DevOps Lead', phase: 'Migration', status: 'Not Started' },
    { id: '9.7', taskName: 'Post-Migration Monitoring (48h)', duration: 2, startDate: '2026-03-16', endDate: '2026-03-17', predecessor: '9.6', resource: 'Full Team', phase: 'Migration', status: 'Not Started' },
    { id: '10', taskName: 'PHASE 10: GO-LIVE PREPARATION', duration: 35, startDate: '2026-02-02', endDate: '2026-03-17', predecessor: '-', resource: 'Operations Team', phase: 'Launch Prep', status: 'Not Started' },
    { id: '10.1', taskName: 'Support System Setup (Zendesk)', duration: 3, startDate: '2026-02-02', endDate: '2026-02-04', predecessor: '6.9', resource: 'Support Lead', phase: 'Launch Prep', status: 'Not Started' },
    { id: '10.2', taskName: 'Knowledge Base Creation', duration: 5, startDate: '2026-02-02', endDate: '2026-02-06', predecessor: '6.9', resource: 'Tech Writer', phase: 'Launch Prep', status: 'Not Started' },
    { id: '10.3', taskName: 'Video Tutorial Production', duration: 7, startDate: '2026-01-13', endDate: '2026-01-19', predecessor: '6.3', resource: 'Marketing', phase: 'Launch Prep', status: 'Not Started' },
    { id: '10.4', taskName: 'Client Training Sessions', duration: 3, startDate: '2026-02-21', endDate: '2026-02-23', predecessor: '8.7', resource: 'Training Lead', phase: 'Launch Prep', status: 'Not Started' },
    { id: '10.5', taskName: 'Runbook Documentation', duration: 3, startDate: '2026-02-06', endDate: '2026-02-08', predecessor: '9.4', resource: 'DevOps Lead', phase: 'Launch Prep', status: 'Not Started' },
    { id: '10.6', taskName: 'On-Call Rotation Setup', duration: 2, startDate: '2026-02-09', endDate: '2026-02-10', predecessor: '10.5', resource: 'Operations Lead', phase: 'Launch Prep', status: 'Not Started' },
    { id: '10.7', taskName: 'Legal Documents Finalized', duration: 10, startDate: '2025-11-12', endDate: '2025-11-21', predecessor: '1.5', resource: 'Legal Team', phase: 'Launch Prep', status: 'Not Started' },
    { id: '10.8', taskName: '✅ Production Readiness Review (MILESTONE)', duration: 1, startDate: '2026-03-17', endDate: '2026-03-17', predecessor: '9.7,10.6,7.6', resource: 'CTO, PM', phase: 'Launch Prep', status: 'Not Started' },
    { id: '11', taskName: 'PHASE 11: LAUNCH', duration: 14, startDate: '2026-03-16', endDate: '2026-03-29', predecessor: '10.8', resource: 'Full Team', phase: 'Launch', status: 'Not Started' },
    { id: '11.1', taskName: 'Soft Launch (Pilot Clients)', duration: 7, startDate: '2026-03-16', endDate: '2026-03-22', predecessor: '10.8', resource: 'Support Team', phase: 'Launch', status: 'Not Started' },
    { id: '11.2', taskName: 'Monitoring & Stabilization', duration: 7, startDate: '2026-03-23', endDate: '2026-03-29', predecessor: '11.1', resource: 'Full Team', phase: 'Launch', status: 'Not Started' },
    { id: '11.3', taskName: '✅ GENERAL AVAILABILITY (FINAL MILESTONE)', duration: 1, startDate: '2026-03-29', endDate: '2026-03-29', predecessor: '11.2', resource: 'Executive Team', phase: 'Launch', status: 'Complete' }
  ];
  const taskSheet = XLSX.utils.json_to_sheet(taskData);
  taskSheet['!cols'] = [
    { wch: 6 }, { wch: 45 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
    { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 12 }
  ];
  XLSX.utils.book_append_sheet(workbook, taskSheet, 'Task List');
  // Sheet 2: Visual Timeline (Gantt Chart)
  const timelineData = generateVisualTimeline(taskData, phaseColors);
  const timelineSheet = XLSX.utils.aoa_to_sheet(timelineData);
  // Set column widths for timeline
  timelineSheet['!cols'] = [
    { wch: 40 }, // Task name
    ...Array(20).fill({ wch: 4 }), // Week columns
  ];
  XLSX.utils.book_append_sheet(workbook, timelineSheet, 'Visual Timeline');
  // Sheet 3: Resource Assignment
  const resourceData = [
    { role: 'Resource Role', week1_5: 'Weeks 1-5', week6_10: 'Weeks 6-10', week11_15: 'Weeks 11-15', week16_20: 'Weeks 16-20', totalCost: 'Total Cost' },
    { role: 'Project Manager', week1_5: '100%', week6_10: '100%', week11_15: '100%', week16_20: '100%', totalCost: '$60K' },
    { role: 'Solutions Architect', week1_5: '100%', week6_10: '50%', week11_15: '25%', week16_20: '10%', totalCost: '$70K' },
    { role: 'Security Architect', week1_5: '50%', week6_10: '25%', week11_15: '100%', week16_20: '25%', totalCost: '$50K' },
    { role: 'DevOps Lead', week1_5: '25%', week6_10: '100%', week11_15: '50%', week16_20: '75%', totalCost: '$55K' },
    { role: 'Senior Backend Dev #1', week1_5: '0%', week6_10: '100%', week11_15: '100%', week16_20: '50%', totalCost: '$80K' },
    { role: 'Senior Backend Dev #2', week1_5: '0%', week6_10: '100%', week11_15: '100%', week16_20: '50%', totalCost: '$80K' },
    { role: 'Senior Frontend Dev', week1_5: '0%', week6_10: '50%', week11_15: '100%', week16_20: '25%', totalCost: '$70K' },
    { role: 'QA Engineer', week1_5: '0%', week6_10: '50%', week11_15: '100%', week16_20: '100%', totalCost: '$45K' },
    { role: 'TOTAL TEAM COST', week1_5: '', week6_10: '', week11_15: '', week16_20: '', totalCost: '$510K' }
  ];
  const resourceSheet = XLSX.utils.json_to_sheet(resourceData);
  resourceSheet['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(workbook, resourceSheet, 'Resource Assignment');
  // Sheet 4: Budget Tracking
  const budgetData = [
    { category: 'Development Team', plannedBudget: '$400K', actualSpend: '$0', variance: '$0', percentComplete: '0%' },
    { category: 'Infrastructure (AWS)', plannedBudget: '$50K', actualSpend: '$0', variance: '$0', percentComplete: '0%' },
    { category: 'AI Services (OpenAI)', plannedBudget: '$20K', actualSpend: '$0', variance: '$0', percentComplete: '0%' },
    { category: 'Security & Compliance', plannedBudget: '$100K', actualSpend: '$0', variance: '$0', percentComplete: '0%' },
    { category: 'Tools & Software', plannedBudget: '$10K', actualSpend: '$0', variance: '$0', percentComplete: '0%' },
    { category: 'TOTAL', plannedBudget: '$580K', actualSpend: '$0', variance: '$0', percentComplete: '0%' }
  ];
  const budgetSheet = XLSX.utils.json_to_sheet(budgetData);
  budgetSheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, budgetSheet, 'Budget Tracking');
  // Sheet 5: Key Milestones
  const milestoneData = [
    { milestone: 'Requirements Sign-off', week: 2, targetDate: '2025-11-11', decision: 'Client sign-off on scope', criteria: 'All must-have features agreed, security requirements clear' },
    { milestone: 'Architecture Approval', week: 3, targetDate: '2025-11-23', decision: 'Technical review board approval', criteria: 'Database design reviewed, security architecture validated' },
    { milestone: 'Infrastructure Ready', week: 5, targetDate: '2025-12-07', decision: 'DevOps sign-off', criteria: 'All AWS resources provisioned, CI/CD working' },
    { milestone: 'Sprint 1-2 Demo', week: 7, targetDate: '2025-12-21', decision: 'Client demo feedback', criteria: 'Authentication working, basic project CRUD functional' },
    { milestone: 'Sprint 3-4 Demo', week: 10, targetDate: '2026-01-11', decision: 'Client demo feedback', criteria: 'TM matching working, AI translation functional' },
    { milestone: 'Sprint 5 Complete', week: 13, targetDate: '2026-02-01', decision: 'Feature freeze decision', criteria: 'All core features complete, UI matches designs' },
    { milestone: 'SOC 2 Readiness', week: 15, targetDate: '2026-02-15', decision: 'Security audit pre-check', criteria: 'All controls implemented, evidence collected' },
    { milestone: 'QA Sign-off', week: 18, targetDate: '2026-03-08', decision: 'Production deployment approval', criteria: '<5 medium bugs, zero critical bugs, UAT passed' },
    { milestone: 'DNS Cutover', week: 19, targetDate: '2026-03-15', decision: 'Migration go-live decision', criteria: 'Data migration validated, rollback plan tested' },
    { milestone: 'General Availability', week: 20, targetDate: '2026-03-29', decision: 'Commercial launch approval', criteria: '7 days stable operation, client satisfaction >85%' }
  ];
  const milestoneSheet = XLSX.utils.json_to_sheet(milestoneData);
  milestoneSheet['!cols'] = [{ wch: 25 }, { wch: 8 }, { wch: 12 }, { wch: 30 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(workbook, milestoneSheet, 'Key Milestones');
  // Generate and download the file
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Glocalization_Gantt_Chart_2025.xlsx';
  link.click();
  window.URL.revokeObjectURL(url);
};

// Helper function to generate visual timeline
function generateVisualTimeline(tasks, phaseColors) {
  const timeline = [];
  // Header row with weeks
  const headerRow = ['Task Name'];
  const startDate = new Date('2025-11-03');
  const endDate = new Date('2026-03-29');
  // Calculate weeks between start and end
  const weeks = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const weekLabel = `W${Math.ceil((currentDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}`;
    weeks.push(weekLabel);
    currentDate.setDate(currentDate.getDate() + 7);
  }
  headerRow.push(...weeks);
  timeline.push(headerRow);
  // Add tasks with visual bars
  tasks.forEach(task => {
    const row = [task.taskName];
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    weeks.forEach((week, index) => {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (index * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      // Check if task overlaps with this week
      if (taskStart <= weekEnd && taskEnd >= weekStart) {
        // Task is active during this week - use colored cell
        row.push('█');
      } else {
        row.push('');
      }
    });
    timeline.push(row);
  });
  return timeline;
}
