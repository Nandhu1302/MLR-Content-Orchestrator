import jsPDF from 'jspdf';

/**
 * @typedef {Object} PDFMetadata
 * @property {string} title
 * @property {string} author
 * @property {string} timestamp
 * @property {string} assetName
 * @property {string[]} markets
 */

/**
 * @typedef {Object} DocumentPreview
 * @property {string} title
 * @property {PreviewSection[]} sections
 * @property {PDFMetadata} metadata
 */

/**
 * @typedef {'text' | 'list' | 'table' | 'score'} PreviewSectionType
 *
 * @typedef {Object} PreviewSection
 * @property {string} title
 * @property {string} content
 * @property {PreviewSectionType} type
 */

/**
 * @typedef {'brand-compliance' | 'localization-brief' | 'cultural-checklist' | 'translation-instructions' | 'regulatory-matrix'} DocumentType
 */

export class ProfessionalDocumentService {
    /**
     * @param {any} data
     * @param {DocumentType} documentType
     * @param {PDFMetadata} metadata
     * @returns {DocumentPreview}
     */
    static generateDocumentPreview(
        data,
        documentType,
        metadata
    ) {
        switch (documentType) {
            case 'brand-compliance':
                return this.generateBrandCompliancePreview(data, metadata);
            case 'localization-brief':
                return this.generateLocalizationBriefPreview(data, metadata);
            case 'cultural-checklist':
                return this.generateCulturalChecklistPreview(data, metadata);
            case 'translation-instructions':
                return this.generateTranslationInstructionsPreview(data, metadata);
            case 'regulatory-matrix':
                return this.generateRegulatoryMatrixPreview(data, metadata);
            default:
                throw new Error(`Unsupported document type: ${documentType}`);
        }
    }

    /**
     * @param {any} data
     * @param {DocumentType} documentType
     * @param {PDFMetadata} metadata
     * @returns {Blob}
     */
    static generateProfessionalPDF(
        data,
        documentType,
        metadata
    ) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let currentY = 20;

        // Add header with logo placeholder and title
        this.addHeader(doc, metadata, pageWidth);
        currentY = 40;

        // Add title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(metadata.title, 20, currentY);
        currentY += 15;

        // Add metadata
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Asset: ${metadata.assetName}`, 20, currentY);
        currentY += 5;
        doc.text(`Markets: ${metadata.markets.join(', ')}`, 20, currentY);
        currentY += 5;
        doc.text(`Generated: ${metadata.timestamp}`, 20, currentY);
        currentY += 5;
        doc.text(`Author: ${metadata.author}`, 20, currentY);
        currentY += 15;

        // Add content based on document type
        switch (documentType) {
            case 'brand-compliance':
                currentY = this.addBrandComplianceContent(doc, data, currentY, pageWidth, pageHeight);
                break;
            case 'localization-brief':
                currentY = this.addLocalizationBriefContent(doc, data, currentY, pageWidth, pageHeight);
                break;
            case 'cultural-checklist':
                currentY = this.addCulturalChecklistContent(doc, data, currentY, pageWidth, pageHeight);
                break;
            case 'translation-instructions':
                currentY = this.addTranslationInstructionsContent(doc, data, currentY, pageWidth, pageHeight);
                break;
            case 'regulatory-matrix':
                currentY = this.addRegulatoryMatrixContent(doc, data, currentY, pageWidth, pageHeight);
                break;
        }

        // Add footer
        this.addFooter(doc, metadata, pageWidth, pageHeight);

        return doc.output('blob');
    }

    /**
     * @private
     * @param {jsPDF} doc
     * @param {PDFMetadata} metadata
     * @param {number} pageWidth
     */
    static addHeader(doc, metadata, pageWidth) {
        // Add header bar
        doc.setFillColor(59, 130, 246); // Blue header
        doc.rect(0, 0, pageWidth, 25, 'F');

        // Add company logo placeholder
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('Localization Intelligence Report', 20, 15);

        // Add date in top right
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        const dateText = new Date(metadata.timestamp).toLocaleDateString();
        doc.text(dateText, pageWidth - 20 - doc.getTextWidth(dateText), 15);
    }

    /**
     * @private
     * @param {jsPDF} doc
     * @param {PDFMetadata} metadata
     * @param {number} pageWidth
     * @param {number} pageHeight
     */
    static addFooter(doc, metadata, pageWidth, pageHeight) {
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica', 'normal');

        // Add confidentiality notice
        const confidentialText = 'CONFIDENTIAL - For Internal Use Only';
        doc.text(confidentialText, 20, pageHeight - 10);

        // Add page number (Hardcoded to 1 as multi-page logic isn't fully implemented in base code)
        const pageText = `Page 1`;
        doc.text(pageText, pageWidth - 20 - doc.getTextWidth(pageText), pageHeight - 10);
    }

    /**
     * @private
     * @param {jsPDF} doc
     * @param {any} data
     * @param {number} startY
     * @param {number} pageWidth
     * @param {number} pageHeight
     * @returns {number}
     */
    static addBrandComplianceContent(doc, data, startY, pageWidth, pageHeight) {
        let currentY = startY;

        // Executive Summary
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Executive Summary', 20, currentY);
        currentY += 10;

        // Overall Score with visual indicator
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const score = data.brandCompliance?.score || 0;
        doc.text(`Overall Brand Compliance Score: ${score}%`, 20, currentY);

        // Add score bar
        const barWidth = 100;
        doc.setFillColor(220, 220, 220);
        doc.rect(20, currentY + 5, barWidth, 8, 'F');

        const fillColor = score >= 80 ? [34, 197, 94] : score >= 60 ? [251, 191, 36] : [239, 68, 68];
        doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        doc.rect(20, currentY + 5, (score / 100) * barWidth, 8, 'F');
        currentY += 20;

        // Category Scores
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Category Analysis', 20, currentY);
        currentY += 10;

        const categories = [
            { name: 'Messaging', score: data.brandCompliance?.messagingScore || 0 },
            { name: 'Tone', score: data.brandCompliance?.toneScore || 0 },
            { name: 'Visual', score: data.brandCompliance?.visualScore || 0 },
            { name: 'Regulatory', score: data.brandCompliance?.regulatoryScore || 0 }
        ];

        categories.forEach(category => {
            doc.setFont('helvetica', 'normal');
            doc.text(`${category.name}: ${category.score}%`, 30, currentY);
            currentY += 8;
        });
        currentY += 10;

        // Issues Summary
        if (data.brandCompliance?.issues?.length > 0) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Critical Issues', 20, currentY);
            currentY += 10;

            data.brandCompliance.issues.slice(0, 5).forEach(issue => {
                doc.setFont('helvetica', 'normal');
                const issueText = `• ${issue.description}`;
                const splitText = doc.splitTextToSize(issueText, pageWidth - 40);
                doc.text(splitText, 30, currentY);
                currentY += splitText.length * 5 + 3;
            });
        }

        return currentY;
    }

    /**
     * @private
     * @param {jsPDF} doc
     * @param {any} data
     * @param {number} startY
     * @param {number} pageWidth
     * @param {number} pageHeight
     * @returns {number}
     */
    static addLocalizationBriefContent(doc, data, startY, pageWidth, pageHeight) {
        let currentY = startY;

        // Executive Summary
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Localization Brief Overview', 20, currentY);
        currentY += 15;

        // Key Metrics
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Target Markets: ${data.targetMarkets?.join(', ') || 'Not specified'}`, 20, currentY);
        currentY += 8;
        doc.text(`Overall Complexity: ${data.executiveSummary?.overallComplexity || 'Medium'}`, 20, currentY);
        currentY += 8;
        doc.text(`Estimated Duration: ${data.executiveSummary?.estimatedDuration || '2-3 weeks'}`, 20, currentY);
        currentY += 15;

        // Key Risks
        if (data.executiveSummary?.keyRisks?.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text('Key Risks', 20, currentY);
            currentY += 10;

            data.executiveSummary.keyRisks.forEach(risk => {
                doc.setFont('helvetica', 'normal');
                const riskText = `• ${risk}`;
                const splitText = doc.splitTextToSize(riskText, pageWidth - 40);
                doc.text(splitText, 30, currentY);
                currentY += splitText.length * 5 + 3;
            });
        }

        return currentY;
    }

    /**
     * @private
     * @param {jsPDF} doc
     * @param {any} data
     * @param {number} startY
     * @param {number} pageWidth
     * @param {number} pageHeight
     * @returns {number}
     */
    static addCulturalChecklistContent(doc, data, startY, pageWidth, pageHeight) {
        let currentY = startY;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Cultural Adaptation Checklist - ${data.market}`, 20, currentY);
        currentY += 15;

        if (data.checklistItems?.length > 0) {
            data.checklistItems.forEach((item, index) => {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(`${index + 1}. ${item.item}`, 20, currentY);
                currentY += 6;

                doc.setFont('helvetica', 'normal');
                const description = doc.splitTextToSize(item.description, pageWidth - 40);
                doc.text(description, 30, currentY);
                currentY += description.length * 4 + 8;

                // Add checkbox
                doc.rect(20, currentY - 12, 4, 4);
                if (item.completed) {
                    doc.text('✓', 21, currentY - 8);
                }
            });
        }

        return currentY;
    }

    /**
     * @private
     * @param {jsPDF} doc
     * @param {any} data
     * @param {number} startY
     * @param {number} pageWidth
     * @param {number} pageHeight
     * @returns {number}
     */
    static addTranslationInstructionsContent(doc, data, startY, pageWidth, pageHeight) {
        let currentY = startY;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Translation Instructions - ${data.market}`, 20, currentY);
        currentY += 15;

        // General Instructions
        if (data.generalInstructions?.length > 0) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('General Instructions', 20, currentY);
            currentY += 10;

            data.generalInstructions.forEach(instruction => {
                doc.setFont('helvetica', 'normal');
                const instructionText = `• ${instruction}`;
                const splitText = doc.splitTextToSize(instructionText, pageWidth - 40);
                doc.text(splitText, 30, currentY);
                currentY += splitText.length * 5 + 3;
            });
            currentY += 10;
        }

        // Terminology
        if (data.terminology?.length > 0) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Key Terminology', 20, currentY);
            currentY += 10;

            data.terminology.forEach(term => {
                doc.setFont('helvetica', 'bold');
                doc.text(`${term.term}:`, 30, currentY);
                doc.setFont('helvetica', 'normal');
                doc.text(`${term.preferredTranslation}`, 80, currentY);
                currentY += 6;

                if (term.context) {
                    doc.setFontSize(9);
                    doc.text(`Context: ${term.context}`, 30, currentY);
                    currentY += 5;
                }
                currentY += 3;
            });
        }

        return currentY;
    }

    /**
     * @private
     * @param {jsPDF} doc
     * @param {any} data
     * @param {number} startY
     * @param {number} pageWidth
     * @param {number} pageHeight
     * @returns {number}
     */
    static addRegulatoryMatrixContent(doc, data, startY, pageWidth, pageHeight) {
        let currentY = startY;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Regulatory Compliance Matrix`, 20, currentY);
        currentY += 15;

        // Add regulatory requirements if available
        if (data.requirements?.length > 0) {
            data.requirements.forEach(requirement => {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(`${requirement.category}`, 20, currentY);
                currentY += 8;

                doc.setFont('helvetica', 'normal');
                const reqText = doc.splitTextToSize(requirement.requirement, pageWidth - 40);
                doc.text(reqText, 30, currentY);
                currentY += reqText.length * 5 + 5;

                doc.setFontSize(9);
                doc.text(`Compliance Level: ${requirement.compliance || 'Required'}`, 30, currentY);
                currentY += 10;
            });
        }

        return currentY;
    }

    /**
     * @private
     * @param {any} data
     * @param {PDFMetadata} metadata
     * @returns {DocumentPreview}
     */
    static generateBrandCompliancePreview(data, metadata) {
        const sections = [
            {
                title: 'Overall Brand Compliance Score',
                content: `${data.brandCompliance?.score || 0}%`,
                type: 'score'
            },
            {
                title: 'Category Scores',
                content: `Messaging: ${data.brandCompliance?.messagingScore || 0}%\nTone: ${data.brandCompliance?.toneScore || 0}%\nVisual: ${data.brandCompliance?.visualScore || 0}%\nRegulatory: ${data.brandCompliance?.regulatoryScore || 0}%`,
                type: 'list'
            }
        ];

        if (data.brandCompliance?.issues?.length > 0) {
            sections.push({
                title: 'Critical Issues',
                content: data.brandCompliance.issues.slice(0, 5).map(issue => `• ${issue.description}`).join('\n'),
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
     * @private
     * @param {any} data
     * @param {PDFMetadata} metadata
     * @returns {DocumentPreview}
     */
    static generateLocalizationBriefPreview(data, metadata) {
        const sections = [
            {
                title: 'Overview',
                content: `Target Markets: ${data.targetMarkets?.join(', ') || 'Not specified'}\nComplexity: ${data.executiveSummary?.overallComplexity || 'Medium'}\nEstimated Duration: ${data.executiveSummary?.estimatedDuration || '2-3 weeks'}`,
                type: 'text'
            }
        ];

        if (data.executiveSummary?.keyRisks?.length > 0) {
            sections.push({
                title: 'Key Risks',
                content: data.executiveSummary.keyRisks.map(risk => `• ${risk}`).join('\n'),
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
     * @private
     * @param {any} data
     * @param {PDFMetadata} metadata
     * @returns {DocumentPreview}
     */
    static generateCulturalChecklistPreview(data, metadata) {
        const sections = [];

        if (data.checklistItems?.length > 0) {
            sections.push({
                title: `Cultural Checklist Items (${data.checklistItems.length})`,
                content: data.checklistItems.slice(0, 10).map((item, index) =>
                    `${index + 1}. ${item.item}\n   ${item.description}`
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
     * @private
     * @param {any} data
     * @param {PDFMetadata} metadata
     * @returns {DocumentPreview}
     */
    static generateTranslationInstructionsPreview(data, metadata) {
        const sections = [];

        if (data.generalInstructions?.length > 0) {
            sections.push({
                title: 'General Instructions',
                content: data.generalInstructions.map(instruction => `• ${instruction}`).join('\n'),
                type: 'list'
            });
        }

        if (data.terminology?.length > 0) {
            sections.push({
                title: 'Key Terminology',
                content: data.terminology.map(term => `${term.term}: ${term.preferredTranslation}`).join('\n'),
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
     * @private
     * @param {any} data
     * @param {PDFMetadata} metadata
     * @returns {DocumentPreview}
     */
    static generateRegulatoryMatrixPreview(data, metadata) {
        const sections = [];

        if (data.requirements?.length > 0) {
            sections.push({
                title: 'Regulatory Requirements',
                content: data.requirements.map(req =>
                    `${req.category}: ${req.requirement}`
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
}