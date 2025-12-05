// EnhancedProfessionalDocumentService.js

import jsPDF from 'jspdf';
// Assuming these imports contain runtime code necessary for data structures and services.
import { PDFMetadata, DocumentPreview, PreviewSection } from './ProfessionalDocumentService';
import { EnhancedBrandConsistencyResult, ContentAnalysisIssue } from './enhancedBrandConsistencyService';

export class EnhancedProfessionalDocumentService {
  /**
   * Generates a structural preview object for the enhanced document.
   * @param {any} data - The raw data used for the document content.
   * @param {'enhanced-brand-analysis' | 'translation-brief' | 'market-intelligence' | 'regulatory-matrix'} documentType - The type of document to generate.
   * @param {any} metadata - Metadata for the document (e.g., title, assetName).
   * @returns {any} A DocumentPreview object.
   */
  static generateEnhancedDocumentPreview(
    data,
    documentType,
    metadata
  ) {
    switch (documentType) {
      case 'enhanced-brand-analysis':
        return this.generateEnhancedBrandAnalysisPreview(data, metadata);
      case 'translation-brief':
        return this.generateTranslationPartnerBriefPreview(data, metadata);
      case 'market-intelligence':
        return this.generateMarketIntelligencePreview(data, metadata);
      case 'regulatory-matrix':
        return this.generateRegulatoryMatrixPreview(data, metadata);
      default:
        throw new Error(`Unsupported enhanced document type: ${documentType}`);
    }
  }

  /**
   * Generates the complete enhanced professional PDF document as a Blob.
   * @param {any} data - The raw data used for the document content.
   * @param {'enhanced-brand-analysis' | 'translation-brief' | 'market-intelligence' | 'regulatory-matrix'} documentType - The type of document to generate.
   * @param {any} metadata - Metadata for the document (e.g., title, assetName).
   * @returns {Blob} The generated PDF Blob.
   */
  static generateEnhancedProfessionalPDF(
    data,
    documentType,
    metadata
  ) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20;

    // Enhanced header with branding
    this.addEnhancedHeader(doc, metadata, pageWidth);
    currentY = 50;

    // Executive summary section
    currentY = this.addExecutiveSummary(doc, data, currentY, pageWidth);
    currentY += 10;

    // Content based on document type
    switch (documentType) {
      case 'enhanced-brand-analysis':
        currentY = this.addEnhancedBrandAnalysisContent(doc, data, currentY, pageWidth, pageHeight);
        break;
      case 'translation-brief':
        currentY = this.addTranslationPartnerBriefContent(doc, data, currentY, pageWidth, pageHeight);
        break;
      case 'market-intelligence':
        currentY = this.addMarketIntelligenceContent(doc, data, currentY, pageWidth, pageHeight);
        break;
      case 'regulatory-matrix':
        currentY = this.addRegulatoryMatrixContent(doc, data, currentY, pageWidth, pageHeight);
        break;
    }

    // Enhanced footer
    this.addEnhancedFooter(doc, metadata, pageWidth, pageHeight);

    return doc.output('blob');
  }

  /**
   * Adds a branded header to the PDF.
   * @param {jsPDF} doc - The jsPDF instance.
   * @param {any} metadata - The document metadata.
   * @param {number} pageWidth - The width of the PDF page.
   */
  static addEnhancedHeader(doc, metadata, pageWidth) {
    // Gradient header background (using two slightly different blues)
    doc.setFillColor(59, 130, 246); // Blue-500
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // White overlay for gradient effect
    doc.setFillColor(79, 150, 266); // Slightly lighter blue
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    // Header content
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Enhanced Localization Intelligence Report', 20, 18);
    
    // Subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-Powered Content Analysis & Translation Guidance', 20, 28);
    
    // Asset name in top right
    doc.setFontSize(8);
    const assetText = `Asset: ${metadata.assetName}`;
    // Calculate position for right alignment
    doc.text(assetText, pageWidth - 20 - doc.getTextWidth(assetText), 18);
    
    // Date
    const dateText = new Date(metadata.timestamp).toLocaleDateString();
    doc.text(dateText, pageWidth - 20 - doc.getTextWidth(dateText), 28);
  }

  /**
   * Adds the Executive Summary section to the PDF.
   * @param {jsPDF} doc - The jsPDF instance.
   * @param {any} data - The document data.
   * @param {number} startY - The starting Y position.
   * @param {number} pageWidth - The width of the PDF page.
   * @returns {number} The new Y position.
   */
  static addExecutiveSummary(doc, data, startY, pageWidth) {
    let currentY = startY;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Executive Summary', 20, currentY);
    currentY += 10;

    // Key metrics in a visual layout
    if (data.analysis) {
      const analysis = data.analysis;
      
      // Overall score with color coding
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Overall Brand Compliance:', 20, currentY);
      
      const score = analysis.overallScore;
      // Define colors: Green (>=80), Yellow (>=60), Red (<60)
      const scoreColor = score >= 80 ? [34, 197, 94] : score >= 60 ? [251, 191, 36] : [239, 68, 68];
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(`${score}%`, 80, currentY);
      
      // Issues summary
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      currentY += 8;
      const criticalIssues = analysis.contentIssues?.filter(i => i.severity === 'critical').length || 0;
      const highIssues = analysis.contentIssues?.filter(i => i.severity === 'high').length || 0;
      
      doc.text(`Critical Issues: ${criticalIssues} | High Priority: ${highIssues}`, 20, currentY);
      currentY += 8;
      
      // Strategic context
      if (analysis.strategicContext?.themeAlignment) {
        doc.text(`Theme Alignment: ${analysis.strategicContext.themeAlignment.alignmentScore}%`, 20, currentY);
        currentY += 8;
      }
    }

    return currentY;
  }

  /**
   * Adds the main content for an Enhanced Brand Analysis to the PDF.
   * @param {jsPDF} doc - The jsPDF instance.
   * @param {any} data - The document data.
   * @param {number} startY - The starting Y position.
   * @param {number} pageWidth - The width of the PDF page.
   * @param {number} pageHeight - The height of the PDF page.
   * @returns {number} The new Y position.
   */
  static addEnhancedBrandAnalysisContent(doc, data, startY, pageWidth, pageHeight) {
    let currentY = startY;
    const analysis = data.analysis;
    
    // Content Issues Section
    if (analysis.contentIssues && analysis.contentIssues.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Content-Specific Issues Analysis', 20, currentY);
      currentY += 12;

      // Group issues by severity
      const criticalIssues = analysis.contentIssues.filter(i => i.severity === 'critical');
      const highIssues = analysis.contentIssues.filter(i => i.severity === 'high');

      // Critical issues first
      if (criticalIssues.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(239, 68, 68); // Red
        doc.text(`Critical Issues (${criticalIssues.length})`, 20, currentY);
        doc.setTextColor(0, 0, 0); // Black
        currentY += 8;

        criticalIssues.slice(0, 5).forEach((issue) => {
          currentY = this.addIssueDetails(doc, issue, currentY, pageWidth);
          currentY += 8;
        });
      }

      // High priority issues
      if (highIssues.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(251, 191, 36); // Yellow
        doc.text(`High Priority Issues (${highIssues.length})`, 20, currentY);
        doc.setTextColor(0, 0, 0); // Black
        currentY += 8;

        highIssues.slice(0, 3).forEach((issue) => {
          currentY = this.addIssueDetails(doc, issue, currentY, pageWidth);
          currentY += 8;
        });
      }
    }

    // Actionable Recommendations
    if (analysis.actionableRecommendations && analysis.actionableRecommendations.length > 0) {
      currentY += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Actionable Recommendations', 20, currentY);
      currentY += 12;

      analysis.actionableRecommendations.slice(0, 5).forEach((rec, index) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${rec.description}`, 25, currentY);
        currentY += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const actionText = doc.splitTextToSize(rec.action, pageWidth - 50);
        doc.text(actionText, 30, currentY);
        currentY += actionText.length * 4 + 5;

        // Before/After examples
        if (rec.beforeExample && rec.afterExample) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'italic');
          doc.text('Before:', 30, currentY);
          currentY += 4;
          doc.setFont('helvetica', 'normal');
          const beforeText = doc.splitTextToSize(`"${rec.beforeExample}"`, pageWidth - 60);
          doc.text(beforeText, 35, currentY);
          currentY += beforeText.length * 3 + 3;

          doc.setFont('helvetica', 'italic');
          doc.text('After:', 30, currentY);
          currentY += 4;
          doc.setFont('helvetica', 'normal');
          const afterText = doc.splitTextToSize(`"${rec.afterExample}"`, pageWidth - 60);
          doc.text(afterText, 35, currentY);
          currentY += afterText.length * 3 + 8;
        }
      });
    }

    return currentY;
  }

  /**
   * Helper function to add details for a single content issue.
   * @param {jsPDF} doc - The jsPDF instance.
   * @param {any} issue - The ContentAnalysisIssue object.
   * @param {number} startY - The starting Y position.
   * @param {number} pageWidth - The width of the PDF page.
   * @returns {number} The new Y position.
   */
  static addIssueDetails(doc, issue, startY, pageWidth) {
    let currentY = startY;
    
    // Issue header
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${issue.category.toUpperCase()} | ${issue.contentSection.type.toUpperCase()}`, 25, currentY);
    currentY += 5;

    // Issue description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const descText = doc.splitTextToSize(issue.description, pageWidth - 50);
    doc.text(descText, 25, currentY);
    currentY += descText.length * 4 + 3;

    // Problematic text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Problematic text:', 25, currentY);
    currentY += 4;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`"${issue.specificText}"`, 30, currentY);
    currentY += 5;

    // Suggested replacement
    doc.setFont('helvetica', 'italic');
    doc.text('Suggested replacement:', 25, currentY);
    currentY += 4;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`"${issue.suggestedReplacement}"`, 30, currentY);
    currentY += 5;

    return currentY;
  }

  /**
   * Adds the main content for a Translation Partner Brief to the PDF.
   * @param {jsPDF} doc - The jsPDF instance.
   * @param {any} data - The document data.
   * @param {number} startY - The starting Y position.
   * @param {number} pageWidth - The width of the PDF page.
   * @param {number} pageHeight - The height of the PDF page.
   * @returns {number} The new Y position.
   */
  static addTranslationPartnerBriefContent(doc, data, startY, pageWidth, pageHeight) {
    let currentY = startY;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Translation Partner Brief', 20, currentY);
    currentY += 15;

    // Key instructions for translators
    const instructions = [
      'Maintain brand voice and tone consistency across all markets',
      'Follow market-specific regulatory requirements',
      'Adapt cultural references while preserving core messaging',
      'Use approved terminology database for medical terms',
      'Flag any content that may require legal review'
    ];

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Translation Instructions:', 20, currentY);
    currentY += 10;

    instructions.forEach((instruction, index) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${index + 1}. ${instruction}`, 25, currentY);
      currentY += 6;
    });

    return currentY;
  }

  /**
   * Adds the main content for a Market Intelligence Report to the PDF.
   * @param {jsPDF} doc - The jsPDF instance.
   * @param {any} data - The document data.
   * @param {number} startY - The starting Y position.
   * @param {number} pageWidth - The width of the PDF page.
   * @param {number} pageHeight - The height of the PDF page.
   * @returns {number} The new Y position.
   */
  static addMarketIntelligenceContent(doc, data, startY, pageWidth, pageHeight) {
    let currentY = startY;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Market Intelligence Report', 20, currentY);
    currentY += 15;

    if (data.marketAnalyses && data.marketAnalyses.length > 0) {
      data.marketAnalyses.forEach((market) => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Market: ${market.marketCode}`, 20, currentY);
        currentY += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Risk Level: ${market.riskLevel}`, 25, currentY);
        currentY += 5;
        doc.text(`Cultural Adaptation Score: ${market.culturalAdaptationScore}%`, 25, currentY);
        currentY += 5;
        doc.text(`Complexity: ${market.complexity}`, 25, currentY);
        currentY += 10;
      });
    }

    return currentY;
  }

  /**
   * Adds the main content for a Regulatory Compliance Matrix to the PDF.
   * @param {jsPDF} doc - The jsPDF instance.
   * @param {any} data - The document data.
   * @param {number} startY - The starting Y position.
   * @param {number} pageWidth - The width of the PDF page.
   * @param {number} pageHeight - The height of the PDF page.
   * @returns {number} The new Y position.
   */
  static addRegulatoryMatrixContent(doc, data, startY, pageWidth, pageHeight) {
    let currentY = startY;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Regulatory Compliance Matrix', 20, currentY);
    currentY += 15;

    // Add regulatory requirements per market
    if (data.analysis?.marketSpecificFlags) {
      data.analysis.marketSpecificFlags.forEach((marketFlag) => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${marketFlag.market} Requirements:`, 20, currentY);
        currentY += 8;

        if (marketFlag.regulatoryFlags.length > 0) {
          marketFlag.regulatoryFlags.forEach((flag) => {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            const flagText = doc.splitTextToSize(`• ${flag}`, pageWidth - 40);
            doc.text(flagText, 25, currentY);
            currentY += flagText.length * 4 + 3;
          });
        } else {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.text('• No specific regulatory flags identified', 25, currentY);
          currentY += 6;
        }
        currentY += 5;
      });
    }

    return currentY;
  }

  /**
   * Adds a branded footer to the PDF.
   * @param {jsPDF} doc - The jsPDF instance.
   * @param {any} metadata - The document metadata.
   * @param {number} pageWidth - The width of the PDF page.
   * @param {number} pageHeight - The height of the PDF page.
   */
  static addEnhancedFooter(doc, metadata, pageWidth, pageHeight) {
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.setFont('helvetica', 'normal');
    
    // Enhanced confidentiality notice
    const confidentialText = 'CONFIDENTIAL - Enhanced AI Analysis for Translation Partners Only';
    doc.text(confidentialText, 20, pageHeight - 15);
    
    // Generated by info
    const generatedText = 'Generated by Enhanced Localization Intelligence System';
    doc.text(generatedText, 20, pageHeight - 10);
    
    // Page number and timestamp
    const pageText = `Page 1 - ${new Date(metadata.timestamp).toLocaleDateString()}`;
    // Calculate position for right alignment
    doc.text(pageText, pageWidth - 20 - doc.getTextWidth(pageText), pageHeight - 10);
  }

  // --- Preview generation methods ---

  /**
   * Generates a structural preview object for the Enhanced Brand Analysis.
   * @param {any} data - The document data.
   * @param {any} metadata - The document metadata.
   * @returns {any} A DocumentPreview object.
   */
  static generateEnhancedBrandAnalysisPreview(data, metadata) {
    const analysis = data.analysis;
    const sections = [];

    // Executive Summary
    sections.push({
      title: 'Executive Summary',
      content: `Overall Compliance Score: ${analysis.overallScore}%\nCritical Issues: ${analysis.contentIssues?.filter(i => i.severity === 'critical').length || 0}\nTheme Alignment: ${analysis.strategicContext?.themeAlignment?.alignmentScore || 'N/A'}%`,
      type: 'text'
    });

    // Content Issues
    if (analysis.contentIssues && analysis.contentIssues.length > 0) {
      const criticalIssues = analysis.contentIssues.filter(i => i.severity === 'critical');
      if (criticalIssues.length > 0) {
        sections.push({
          title: `Critical Issues (${criticalIssues.length})`,
          content: criticalIssues.slice(0, 3).map(issue => 
            `• ${issue.description}\n  Location: ${issue.contentSection.type}\n  Text: "${issue.specificText}"\n  Suggested: "${issue.suggestedReplacement}"`
          ).join('\n\n'),
          type: 'list'
        });
      }
    }

    // Actionable Recommendations
    if (analysis.actionableRecommendations && analysis.actionableRecommendations.length > 0) {
      sections.push({
        title: 'Actionable Recommendations',
        content: analysis.actionableRecommendations.slice(0, 3).map((rec, index) => 
          `${index + 1}. ${rec.description}\n  Action: ${rec.action}\n  Before: "${rec.beforeExample}"\n  After: "${rec.afterExample}"`
        ).join('\n\n'),
        type: 'list'
      });
    }

    return {
      title: metadata.title,
      sections,
      metadata
    };
  }

  /**
   * Generates a structural preview object for the Translation Partner Brief.
   * @param {any} data - The document data.
   * @param {any} metadata - The document metadata.
   * @returns {any} A DocumentPreview object.
   */
  static generateTranslationPartnerBriefPreview(data, metadata) {
    const sections = [
      {
        title: 'Translation Guidelines',
        content: 'Maintain brand consistency\nFollow regulatory requirements\nAdapt cultural references\nUse approved terminology',
        type: 'list'
      }
    ];

    return {
      title: metadata.title,
      sections,
      metadata
    };
  }

  /**
   * Generates a structural preview object for the Market Intelligence Report.
   * @param {any} data - The document data.
   * @param {any} metadata - The document metadata.
   * @returns {any} A DocumentPreview object.
   */
  static generateMarketIntelligencePreview(data, metadata) {
    const sections = [];

    if (data.marketAnalyses && data.marketAnalyses.length > 0) {
      sections.push({
        title: 'Market Analysis Summary',
        content: data.marketAnalyses.map((market) => 
          `${market.marketCode}: ${market.riskLevel} risk, ${market.culturalAdaptationScore}% adaptation score`
        ).join('\n'),
        type: 'list'
      });
    }

    return {
      title: metadata.title,
      sections,
      metadata
    };
  }

  /**
   * Generates a structural preview object for the Regulatory Compliance Matrix.
   * @param {any} data - The document data.
   * @param {any} metadata - The document metadata.
   * @returns {any} A DocumentPreview object.
   */
  static generateRegulatoryMatrixPreview(data, metadata) {
    const sections = [];

    if (data.analysis?.marketSpecificFlags) {
      sections.push({
        title: 'Regulatory Requirements by Market',
        content: data.analysis.marketSpecificFlags.map((flag) => 
          `${flag.market}: ${flag.regulatoryFlags.length} requirements`
        ).join('\n'),
        type: 'list'
      });
    }

    return {
      title: metadata.title,
      sections,
      metadata
    };
  }
}