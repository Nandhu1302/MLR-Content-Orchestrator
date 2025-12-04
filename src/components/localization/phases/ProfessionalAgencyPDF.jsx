
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Globe } from 'lucide-react';
import { jsPDF } from 'jspdf';

export const ProfessionalAgencyPDF = ({ projectData, onDownload }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20;

    const checkNewPage = (requiredHeight) => {
      if (currentY + requiredHeight > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
        return true;
      }
      return false;
    };

    const addText = (text, x, y, options = {}) => {
      const maxWidth = options.maxWidth ?? pageWidth - 40;
      const lines = doc.splitTextToSize(text, maxWidth);
      if (Array.isArray(lines)) {
        lines.forEach((line, index) => {
          doc.text(line, x, y + index * (options.lineHeight ?? 6));
        });
        return y + lines.length * (options.lineHeight ?? 6);
      } else {
        doc.text(lines, x, y);
        return y + (options.lineHeight ?? 6);
      }
    };

    // Title Page
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Translation Project Brief', pageWidth / 2, 40, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text(projectData.projectName, pageWidth / 2, 55, { align: 'center' });
    doc.setFontSize(12);
    doc.text(
      `${projectData.brandName} | ${projectData.sourceLanguage.toUpperCase()} → ${projectData.targetLanguage.toUpperCase()}`,
      pageWidth / 2,
      70,
      { align: 'center' }
    );
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 85, { align: 'center' });

    // Logo placeholder
    doc.setDrawColor(200, 200, 200);
    doc.rect(pageWidth / 2 - 30, 100, 60, 20);
    doc.text('Company Logo', pageWidth / 2, 112, { align: 'center' });
    currentY = 140;

    // Project Overview
    checkNewPage(60);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    currentY = addText('Project Overview', 20, currentY) + 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const overviewData = [
      ['Project Name:', projectData.projectName],
      ['Brand:', projectData.brandName],
      ['Source Language:', projectData.sourceLanguage.toUpperCase()],
      ['Target Language:', projectData.targetLanguage.toUpperCase()],
      ['Target Market:', projectData.targetMarket],
      ['Total Word Count:', projectData.totalWords.toLocaleString()],
      ['TM Leverage:', `${Math.round(projectData.leveragePercentage)}%`],
      ['Estimated Savings:', `${projectData.estimatedSavings.time}h / $${projectData.estimatedSavings.cost}`],
    ];

    overviewData.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 25, currentY);
      doc.setFont(undefined, 'normal');
      doc.text(value, 100, currentY);
      currentY += 8;
    });

    currentY += 15;

    // Translation Memory Analysis
    checkNewPage(80);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    currentY = addText('Translation Memory Analysis', 20, currentY) + 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const tmData = [
      ['Total Source Words:', projectData.totalWords.toLocaleString()],
      ['Memory Matched Words:', projectData.matchedWords.toLocaleString()],
      ['New Translation Required:', projectData.newWords.toLocaleString()],
      ['Memory Leverage Rate:', `${Math.round(projectData.leveragePercentage)}%`],
    ];

    tmData.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 25, currentY);
      doc.setFont(undefined, 'normal');
      doc.text(value, 120, currentY);
      currentY += 8;
    });

    // Visual representation of TM leverage
    currentY += 10;
    doc.setDrawColor(100, 100, 100);
    doc.setFillColor(76, 175, 80); // Green for matched
    doc.rect(25, currentY, (projectData.leveragePercentage / 100) * 120, 8, 'F');
    doc.setFillColor(255, 193, 7); // Yellow for new
    doc.rect(
      25 + (projectData.leveragePercentage / 100) * 120,
      currentY,
      ((100 - projectData.leveragePercentage) / 100) * 120,
      8,
      'F'
    );
    doc.rect(25, currentY, 120, 8); // Border
    doc.text('TM Matched', 25, currentY + 15);
    doc.text('New Translation', 100, currentY + 15);
    currentY += 25;

    // Segment-wise Breakdown
    checkNewPage(100);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    currentY = addText('Content Segments', 20, currentY) + 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    projectData.segments.forEach((segment, index) => {
      checkNewPage(40);
      doc.setFont(undefined, 'bold');
      currentY = addText(`${index + 1}. ${segment.title}`, 25, currentY) + 5;
      doc.setFont(undefined, 'normal');
      currentY = addText(`Source: ${segment.content.substring(0, 100)}...`, 30, currentY, { maxWidth: pageWidth - 60 }) + 5;
      if (segment.translatedText) {
        currentY = addText(`Translation: ${segment.translatedText.substring(0, 100)}...`, 30, currentY, { maxWidth: pageWidth - 60 }) + 5;
      }
      currentY = addText(`Words: ${segment.wordCount} | Status: ${segment.translationStatus}`, 30, currentY) + 10;
    });

    // Quality Assurance Guidelines
    checkNewPage(60);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    currentY = addText('Quality Assurance Guidelines', 20, currentY) + 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const qaGuidelines = [
      '• Maintain brand voice and terminology consistency',
      '• Ensure cultural adaptation for target market',
      '• Verify medical/technical accuracy for pharmaceutical content',
      '• Follow regulatory compliance requirements',
      '• Review translation memory suggestions for accuracy',
      '• Conduct linguistic quality assurance checks',
    ];

    qaGuidelines.forEach(guideline => {
      currentY = addText(guideline, 25, currentY, { maxWidth: pageWidth - 50 }) + 6;
    });

    currentY += 15;

    // Project Timeline
    checkNewPage(40);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    currentY = addText('Recommended Timeline', 20, currentY) + 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const timeline = [
      ['Phase 1: TM Analysis & Preparation', '1 day'],
      ['Phase 2: Translation', `${Math.ceil(projectData.totalWords / 2500)} days`],
      ['Phase 3: Review & QA', '2 days'],
      ['Phase 4: Final Delivery', '1 day'],
    ];

    timeline.forEach(([phase, duration]) => {
      doc.setFont(undefined, 'bold');
      doc.text(phase, 25, currentY);
      doc.setFont(undefined, 'normal');
      doc.text(duration, pageWidth - 60, currentY);
      currentY += 8;
    });

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    doc.text(
      'This document was generated automatically by the Translation Management System',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Save PDF
    doc.save(`${projectData.projectName.replace(/\s+/g, '_')}_Translation_Brief.pdf`);
    if (onDownload) onDownload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Professional Agency Handoff
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Project Overview</h4>
            <div className="space-y-1 text-muted-foreground">
              <div>Project: {projectData.projectName}</div>
              <div>Brand: {projectData.brandName}</div>
              <div>
                Languages: {projectData.sourceLanguage.toUpperCase()} → {projectData.targetLanguage.toUpperCase()}
              </div>
              <div>Market: {projectData.targetMarket}</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Analytics Summary</h4>
            <div className="space-y-1 text-muted-foreground">
              <div>Total Words: {projectData.totalWords.toLocaleString()}</div>
              <div>TM Leverage: {Math.round(projectData.leveragePercentage)}%</div>
              <div>Estimated Savings: {projectData.estimatedSavings.time}h</div>
              <div>Segments: {projectData.segments.length}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <Globe className="h-4 w-4 text-primary" />
          <div className="text-sm">
            <div className="font-medium">Comprehensive Agency Brief</div>
            <div className="text-muted-foreground">
              Includes TM analysis, segment breakdown, quality guidelines, and timeline
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={generatePDF} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download PDF Brief
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <FileText className="h-4 w-4 mr-2" />
            Print Preview
          </Button>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded">
          <strong>PDF Contents:</strong> Project overview, translation memory analytics,
          segment-wise breakdown, quality guidelines, timeline recommendations,
          and professional formatting for client presentation.
        </div>
      </CardContent>
    </Card>
  );
};
