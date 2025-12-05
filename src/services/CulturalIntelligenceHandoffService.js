import jsPDF from 'jspdf';

/**
 * @typedef {Object} CulturalAnalysisSegment
 * @property {string} segmentId
 * @property {string} originalTranslation
 * @property {string} adaptedText
 * @property {number} culturalScore
 * @property {any[]} culturalIssues
 * @property {string[]} appliedAdaptations
 * @property {string} [action]
 * @property {string} [priority]
 * @property {any} [culturalProverb]
 * @property {any} [toneAnalysis]
 * @property {any} [contextualGuidance]
 */

/**
 * @typedef {Object} ProjectData
 * @property {string} name
 * @property {string[]} target_markets
 * @property {string[]} target_languages
 * @property {string} [therapeutic_area]
 * @property {string} [brand_id]
 */

export class CulturalIntelligenceHandoffService {
  /**
   * Generates a comprehensive PDF Cultural Intelligence Playbook for agency handoff.
   * NOTE: This requires the jspdf library to be available.
   *
   * @param {ProjectData} projectData - General data about the project.
   * @param {CulturalAnalysisSegment[]} segmentAdaptations - Segment-by-segment analysis results.
   * @param {number} overallCulturalScore - The aggregated cultural appropriateness score.
   * @returns {jsPDF} The generated jsPDF instance.
   */
  static generateAgencyPDF(
    projectData,
    segmentAdaptations,
    overallCulturalScore
  ) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    const targetMarket = projectData.target_markets?.[0] || 'Target Market';
    const targetLanguage = projectData.target_languages?.[0] || 'Target Language';

    /**
     * Helper function to add new page if needed
     * @param {number} requiredSpace
     * @returns {boolean}
     */
    const checkAddPage = (requiredSpace) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    /**
     * Helper function for wrapped text
     * @param {string} text
     * @param {number} maxWidth
     */
    const addWrappedText = (text, maxWidth) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        checkAddPage(10);
        doc.text(line, margin, yPos);
        yPos += 6;
      });
    };

    // ==================== TITLE PAGE ====================
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 60, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('CULTURAL INTELLIGENCE', pageWidth / 2, 30, { align: 'center' });
    doc.text('PLAYBOOK', pageWidth / 2, 45, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    yPos = 80;
    doc.text(`Project: ${projectData.name || 'Localization Project'}`, margin, yPos);
    yPos += 10;
    doc.text(`Target Market: ${targetMarket}`, margin, yPos);
    yPos += 10;
    doc.text(`Target Language: ${targetLanguage}`, margin, yPos);
    yPos += 10;
    if (projectData.therapeutic_area) {
      doc.text(`Therapeutic Area: ${projectData.therapeutic_area}`, margin, yPos);
      yPos += 10;
    }
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, margin, yPos);

    // ==================== EXECUTIVE SUMMARY ====================
    doc.addPage();
    yPos = margin;

    doc.setFillColor(52, 152, 219);
    doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('EXECUTIVE SUMMARY', margin, yPos + 5);

    yPos += 20;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const changesNeeded = segmentAdaptations.filter(s =>
      s.action && s.action !== 'APPROVE'
    ).length;
    const highPriority = segmentAdaptations.filter(s =>
      s.priority === 'high' || s.priority === 'critical'
    ).length;

    doc.text(`Total Segments Analyzed: ${segmentAdaptations.length}`, margin, yPos);
    yPos += 8;
    doc.text(`Segments Requiring Cultural Adaptation: ${changesNeeded}`, margin, yPos);
    yPos += 8;
    doc.text(`High/Critical Priority Changes: ${highPriority}`, margin, yPos);
    yPos += 8;
    doc.text(`Overall Cultural Appropriateness Score: ${overallCulturalScore}/100`, margin, yPos);

    yPos += 15;
    doc.setFillColor(241, 196, 15);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 40, 'F');
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('KEY RECOMMENDATIONS:', margin + 5, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 8;
    addWrappedText(
      `This playbook provides segment-by-segment cultural intelligence analysis for ${targetMarket}. ` +
      `Each segment includes specific action recommendations (REVIEW, REPLACE, REMOVE, or APPROVE), ` +
      `cultural proverbs where applicable, tone analysis, and market-specific guidance.`,
      pageWidth - 2 * margin - 10
    );

    // ==================== SEGMENT-BY-SEGMENT ANALYSIS ====================
    segmentAdaptations.forEach((segment, idx) => {
      doc.addPage();
      yPos = margin;

      // Segment Header
      doc.setFillColor(41, 128, 185);
      doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`SEGMENT ${idx + 1}`, margin, yPos + 5);

      yPos += 20;
      doc.setTextColor(0, 0, 0);

      // Action Badge
      if (segment.action) {
        const actionColor = segment.action === 'REPLACE' ? [231, 76, 60] :
          segment.action === 'REVIEW' ? [243, 156, 18] :
          segment.action === 'REMOVE' ? [192, 57, 43] :
          [46, 204, 113];
        doc.setFillColor(actionColor[0], actionColor[1], actionColor[2]);
        doc.rect(margin, yPos, 30, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(segment.action, margin + 2, yPos + 5);

        if (segment.priority) {
          doc.setFillColor(0, 0, 0);
          doc.rect(margin + 35, yPos, 35, 8, 'F');
          doc.text(`Priority: ${segment.priority.toUpperCase()}`, margin + 37, yPos + 5);
        }

        yPos += 15;
      }

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');

      // Original Translation
      doc.text('Original Translation:', margin, yPos);
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      addWrappedText(segment.originalTranslation, pageWidth - 2 * margin);
      yPos += 5;

      // Cultural Score
      checkAddPage(15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Cultural Appropriateness Score: ${segment.culturalScore}/100`, margin, yPos);
      yPos += 10;

      // Culturally Adapted Text
      if (segment.adaptedText !== segment.originalTranslation) {
        checkAddPage(20);
        doc.setFillColor(232, 245, 233);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 3, 'F');
        yPos += 8;
        doc.setFont('helvetica', 'bold');
        doc.text('Culturally Adapted Text:', margin, yPos);
        yPos += 7;
        doc.setFont('helvetica', 'normal');
        addWrappedText(segment.adaptedText, pageWidth - 2 * margin);
        yPos += 5;
      }

      // Cultural Proverb
      if (segment.culturalProverb) {
        checkAddPage(35);
        doc.setFillColor(243, 229, 245);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 30, 'F');
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Cultural Proverb:', margin + 5, yPos);
        yPos += 7;
        doc.setFontSize(12);
        doc.text(segment.culturalProverb.original || '', margin + 5, yPos);
        yPos += 7;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text(segment.culturalProverb.romanji || '', margin + 5, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text(`"${segment.culturalProverb.translation || ''}"`, margin + 5, yPos);
        yPos += 6;
        doc.setFontSize(8);
        addWrappedText(segment.culturalProverb.context || '', pageWidth - 2 * margin - 10);
        yPos += 5;
      }

      // Tone Analysis
      if (segment.toneAnalysis) {
        checkAddPage(30);
        doc.setFillColor(232, 245, 252);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Tone Analysis:', margin + 5, yPos);
        yPos += 7;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Current Tone: ${segment.toneAnalysis.currentTone || 'N/A'}`, margin + 5, yPos);
        yPos += 6;
        doc.text(`Target Tone: ${segment.toneAnalysis.targetTone || 'N/A'}`, margin + 5, yPos);
        yPos += 6;
        doc.text(`Formality Level: ${segment.toneAnalysis.formalityLevel || 'N/A'}`, margin + 5, yPos);
        yPos += 10;
      }

      // Cultural Considerations
      if (segment.culturalIssues && segment.culturalIssues.length > 0) {
        checkAddPage(20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Cultural Considerations:', margin, yPos);
        yPos += 7;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        segment.culturalIssues.slice(0, 3).forEach((issue) => {
          checkAddPage(10);
          const issueText = typeof issue === 'string' ? issue : issue.description || issue.text;
          addWrappedText(`• ${issueText}`, pageWidth - 2 * margin - 5);
        });
        yPos += 5;
      }
    });

    // ==================== IMPLEMENTATION CHECKLIST ====================
    doc.addPage();
    yPos = margin;

    doc.setFillColor(52, 152, 219);
    doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPLEMENTATION CHECKLIST', margin, yPos + 5);

    yPos += 20;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const checklist = [
      'Review all REPLACE recommendations with native speakers',
      'Implement high/critical priority changes first',
      'Validate tone appropriateness with local stakeholders',
      'Apply cultural proverbs where suggested',
      'Verify formality levels match target audience expectations',
      'Submit culturally adapted content for regulatory review',
      'Conduct final quality assurance with in-market experts',
      'Document all changes for audit trail'
    ];

    checklist.forEach(item => {
      checkAddPage(10);
      doc.rect(margin, yPos - 3, 4, 4);
      doc.text(item, margin + 8, yPos);
      yPos += 8;
    });

    return doc;
  }
}