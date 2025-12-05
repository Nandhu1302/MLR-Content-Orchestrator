// NOTE: This file assumes that the following libraries and types are imported and available
// in the scope where this class is used (e.g., via a bundler or specific module imports):
// - jsPDF (from 'jspdf')
// - docx components (Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, UnderlineType, Header, Footer, PageNumber)
// - PDFMetadata structure

export class UniversalDocumentService {
  static async generateProfessionalPDF(
    data,
    documentType,
    metadata
  ) {
    // Note: 'jsPDF' must be available in the scope (e.g., imported or global)
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20;

    // Enhanced header with gradient effect
    UniversalDocumentService.addEnhancedHeader(doc, metadata, pageWidth);
    currentY = 50;

    // Executive summary box
    UniversalDocumentService.addExecutiveSummary(doc, data, currentY, pageWidth);
    currentY += 40;

    // Content based on document type
    currentY = UniversalDocumentService.addEnhancedContent(doc, data, documentType, currentY, pageWidth, pageHeight);

    // Enhanced footer
    UniversalDocumentService.addEnhancedFooter(doc, metadata, pageWidth, pageHeight);

    return doc.output('blob');
  }

  static async generateWordDocument(
    data,
    documentType,
    metadata
  ) {
    // Note: 'docx' components must be available in the scope
    const children = [];

    // Title page
    children.push(
      new Paragraph({
        text: metadata.title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: UniversalDocumentService.getDocumentTypeLabel(documentType),
            size: 32,
            color: "2563EB"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 }
      })
    );

    // Metadata table
    const metadataTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Asset:")] }),
            new TableCell({ children: [new Paragraph(metadata.assetName)] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Author:")] }),
            new TableCell({ children: [new Paragraph(metadata.author)] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Markets:")] }),
            new TableCell({ children: [new Paragraph(metadata.markets.join(', '))] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Generated:")] }),
            new TableCell({ children: [new Paragraph(new Date(metadata.timestamp).toLocaleString())] })
          ]
        })
      ]
    });

    children.push(metadataTable);
    children.push(new Paragraph({ text: "", spacing: { after: 400 } }));

    // Executive Summary
    children.push(
      new Paragraph({
        text: "Executive Summary",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    // Add content based on document type
    UniversalDocumentService.addWordContent(children, data, documentType);

    // Create document
    const doc = new Document({
      sections: [{
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Localization Intelligence Report",
                    bold: true,
                    color: "2563EB"
                  })
                ],
                alignment: AlignmentType.CENTER
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun("CONFIDENTIAL - For Internal Use Only"),
                  new TextRun(" - Page "),
                  new TextRun({
                    children: [PageNumber.CURRENT]
                  })
                ],
                alignment: AlignmentType.CENTER
              })
            ]
          })
        },
        children
      }]
    });

    // Note: 'Packer' must be available in the scope
    return await Packer.toBlob(doc);
  }

  static async generateEmailReadyFormat(
    data,
    documentType,
    metadata
  ) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${metadata.title}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              margin: 0; 
              padding: 20px; 
              background: #f8fafc;
            }
            .container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 12px; 
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #2563eb, #3b82f6); 
              color: white; 
              padding: 32px; 
              text-align: center;
            }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .header p { margin: 8px 0 0; opacity: 0.9; }
            .content { padding: 32px; }
            .section { margin-bottom: 32px; }
            .section-title { 
              font-size: 20px; 
              font-weight: 600; 
              color: #1e293b; 
              margin-bottom: 16px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 8px;
            }
            .metadata-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 16px; 
              margin-bottom: 24px;
            }
            .metadata-item { 
              background: #f1f5f9; 
              padding: 16px; 
              border-radius: 8px; 
            }
            .metadata-label { font-weight: 600; color: #475569; }
            .metadata-value { color: #1e293b; margin-top: 4px; }
            .score-display {
              display: flex;
              align-items: center;
              gap: 16px;
              background: #f0f9ff;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
            }
            .score-number {
              font-size: 32px;
              font-weight: 700;
              color: #2563eb;
            }
            .score-bar {
              flex: 1;
              height: 8px;
              background: #e2e8f0;
              border-radius: 4px;
              overflow: hidden;
            }
            .score-fill {
              height: 100%;
              background: linear-gradient(90deg, #2563eb, #3b82f6);
              transition: width 0.3s ease;
            }
            .list-content {
              background: #fafafa;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #10b981;
            }
            .footer {
              background: #f8fafc;
              padding: 24px;
              text-align: center;
              font-size: 14px;
              color: #64748b;
              border-top: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${metadata.title}</h1>
              <p>${UniversalDocumentService.getDocumentTypeLabel(documentType)}</p>
            </div>
            
            <div class="content">
              <div class="section">
                <div class="section-title">Document Information</div>
                <div class="metadata-grid">
                  <div class="metadata-item">
                    <div class="metadata-label">Asset</div>
                    <div class="metadata-value">${metadata.assetName}</div>
                  </div>
                  <div class="metadata-item">
                    <div class="metadata-label">Author</div>
                    <div class="metadata-value">${metadata.author}</div>
                  </div>
                  <div class="metadata-item">
                    <div class="metadata-label">Markets</div>
                    <div class="metadata-value">${metadata.markets.join(', ')}</div>
                  </div>
                  <div class="metadata-item">
                    <div class="metadata-label">Generated</div>
                    <div class="metadata-value">${new Date(metadata.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              ${UniversalDocumentService.generateEmailContent(data, documentType)}
            </div>
            
            <div class="footer">
              <p><strong>CONFIDENTIAL</strong> - This document contains proprietary information for internal use only.</p>
              <p>Generated by Localization Intelligence Platform</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return new Blob([htmlContent], { type: 'text/html' });
  }

  static addEnhancedHeader(doc, metadata, pageWidth) {
    // Gradient header background
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Header content
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Localization Intelligence Report', 20, 20);
    
    // Company branding
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const brandText = 'Professional Document Suite';
    doc.text(brandText, pageWidth - 20 - doc.getTextWidth(brandText), 20);
    
    // Date
    doc.setFontSize(8);
    const dateText = new Date(metadata.timestamp).toLocaleDateString();
    doc.text(dateText, pageWidth - 20 - doc.getTextWidth(dateText), 30);
  }

  static addExecutiveSummary(doc, data, startY, pageWidth) {
    doc.setFillColor(240, 249, 255);
    doc.rect(20, startY, pageWidth - 40, 30, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 25, startY + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const summaryText = UniversalDocumentService.generateExecutiveSummaryText(data);
    const splitText = doc.splitTextToSize(summaryText, pageWidth - 50);
    doc.text(splitText, 25, startY + 20);
  }

  static addEnhancedContent(
    doc, 
    data, 
    documentType, 
    startY, 
    pageWidth, 
    pageHeight
  ) {
    let currentY = startY;
    
    switch (documentType) {
      case 'brand-compliance':
        currentY = UniversalDocumentService.addBrandComplianceContent(doc, data, currentY, pageWidth);
        break;
      case 'localization-brief':
        currentY = UniversalDocumentService.addLocalizationBriefContent(doc, data, currentY, pageWidth);
        break;
      case 'cultural-checklist':
        currentY = UniversalDocumentService.addCulturalChecklistContent(doc, data, currentY, pageWidth);
        break;
      case 'translation-instructions':
        currentY = UniversalDocumentService.addTranslationInstructionsContent(doc, data, currentY, pageWidth);
        break;
      case 'regulatory-matrix':
        currentY = UniversalDocumentService.addRegulatoryMatrixContent(doc, data, currentY, pageWidth);
        break;
    }
    
    return currentY;
  }

  static addEnhancedFooter(doc, metadata, pageWidth, pageHeight) {
    // Footer background
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    
    // Confidentiality notice
    const confidentialText = 'CONFIDENTIAL - For Internal Use Only • Generated by Localization Intelligence Platform';
    doc.text(confidentialText, 20, pageHeight - 10);
    
    // Page number
    // NOTE: jsPDF doesn't automatically track pages in this structure, so hardcoding for example
    const pageText = `Page 1 of 1`; 
    doc.text(pageText, pageWidth - 20 - doc.getTextWidth(pageText), pageHeight - 10);
  }

  static addWordContent(children, data, documentType) {
    switch (documentType) {
      case 'brand-compliance':
        UniversalDocumentService.addBrandComplianceWordContent(children, data);
        break;
      case 'localization-brief':
        UniversalDocumentService.addLocalizationBriefWordContent(children, data);
        break;
      case 'cultural-checklist':
        UniversalDocumentService.addCulturalChecklistWordContent(children, data);
        break;
      case 'translation-instructions':
        UniversalDocumentService.addTranslationInstructionsWordContent(children, data);
        break;
      case 'regulatory-matrix':
        UniversalDocumentService.addRegulatoryMatrixWordContent(children, data);
        break;
    }
  }

  static generateEmailContent(data, documentType) {
    switch (documentType) {
      case 'brand-compliance':
        return UniversalDocumentService.generateBrandComplianceEmailContent(data);
      case 'localization-brief':
        return UniversalDocumentService.generateLocalizationBriefEmailContent(data);
      case 'cultural-checklist':
        return UniversalDocumentService.generateCulturalChecklistEmailContent(data);
      case 'translation-instructions':
        return UniversalDocumentService.generateTranslationInstructionsEmailContent(data);
      case 'regulatory-matrix':
        return UniversalDocumentService.generateRegulatoryMatrixEmailContent(data);
      default:
        return '<div class="section"><p>Document content not available</p></div>';
    }
  }

  // Helper methods for different document types
  static addBrandComplianceContent(doc, data, startY, pageWidth) {
    let currentY = startY;
    
    // Overall Score
    if (data.brandCompliance?.score) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Brand Compliance Analysis', 20, currentY);
      currentY += 15;
      
      const score = data.brandCompliance.score;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Overall Compliance Score: ${score}%`, 20, currentY);
      
      // Enhanced score visualization
      const barWidth = 120;
      doc.setFillColor(226, 232, 240);
      doc.rect(20, currentY + 5, barWidth, 10, 'F');
      
      const fillColor = score >= 80 ? [34, 197, 94] : score >= 60 ? [251, 191, 36] : [239, 68, 68];
      doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      doc.rect(20, currentY + 5, (score / 100) * barWidth, 10, 'F');
      
      // Score interpretation
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const interpretation = score >= 80 ? 'Excellent compliance' : score >= 60 ? 'Good compliance with minor issues' : 'Requires attention';
      doc.text(interpretation, 20, currentY + 22);
      currentY += 35;
    }
    
    return currentY;
  }

  static addLocalizationBriefContent(doc, data, startY, pageWidth) {
    let currentY = startY;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Localization Brief Overview', 20, currentY);
    currentY += 15;
    
    // Key metrics in a structured format
    const metrics = [
      { label: 'Target Markets', value: data.targetMarkets?.join(', ') || 'Not specified' },
      { label: 'Complexity Level', value: data.executiveSummary?.overallComplexity || 'Medium' },
      { label: 'Estimated Duration', value: data.executiveSummary?.estimatedDuration || '2-3 weeks' },
      { label: 'Priority Level', value: data.priority || 'Standard' }
    ];
    
    metrics.forEach((metric) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${metric.label}:`, 25, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(metric.value, 80, currentY);
      currentY += 8;
    });
    
    return currentY + 10;
  }

  static addCulturalChecklistContent(doc, data, startY, pageWidth) {
    let currentY = startY;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Cultural Adaptation Checklist - ${data.market || 'Multiple Markets'}`, 20, currentY);
    currentY += 15;
    
    if (data.checklistItems?.length > 0) {
      data.checklistItems.slice(0, 10).forEach((item, index) => {
        // Checkbox
        doc.rect(20, currentY - 3, 5, 5);
        if (item.completed) {
          doc.setFont('helvetica', 'bold');
          doc.text('✓', 21.5, currentY + 1);
        }
        
        // Item text
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${item.item}`, 30, currentY);
        currentY += 6;
        
        // Description
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const description = doc.splitTextToSize(item.description || '', pageWidth - 60);
        doc.text(description, 35, currentY);
        currentY += description.length * 4 + 8;
      });
    }
    
    return currentY;
  }

  static addTranslationInstructionsContent(doc, data, startY, pageWidth) {
    let currentY = startY;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Translation Instructions - ${data.market || 'Multiple Markets'}`, 20, currentY);
    currentY += 15;
    
    // Style guide
    if (data.styleGuide) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Style Guidelines', 20, currentY);
      currentY += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const guidelines = doc.splitTextToSize(data.styleGuide, pageWidth - 40);
      doc.text(guidelines, 25, currentY);
      currentY += guidelines.length * 5 + 10;
    }
    
    // Terminology
    if (data.terminology?.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Key Terminology', 20, currentY);
      currentY += 10;
      
      data.terminology.slice(0, 15).forEach((term) => {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`${term.term}:`, 25, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(`${term.preferredTranslation}`, 80, currentY);
        currentY += 6;
      });
    }
    
    return currentY;
  }

  static addRegulatoryMatrixContent(doc, data, startY, pageWidth) {
    let currentY = startY;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Regulatory Compliance Matrix', 20, currentY);
    currentY += 15;
    
    if (data.requirements?.length > 0) {
      data.requirements.slice(0, 10).forEach((requirement) => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${requirement.category || 'General Requirement'}`, 20, currentY);
        currentY += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const reqText = doc.splitTextToSize(requirement.requirement || '', pageWidth - 40);
        doc.text(reqText, 25, currentY);
        currentY += reqText.length * 5 + 5;
        
        // Compliance status
        const status = requirement.compliance || 'Required';
        const statusColor = status === 'Compliant' ? [34, 197, 94] : [239, 68, 68];
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.setFontSize(9);
        doc.text(`Status: ${status}`, 25, currentY);
        doc.setTextColor(0, 0, 0); // Reset color
        currentY += 10;
      });
    }
    
    return currentY;
  }

  // Word document content methods
  static addBrandComplianceWordContent(children, data) {
    if (data.brandCompliance?.score) {
      children.push(
        new Paragraph({
          text: "Brand Compliance Analysis",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Overall Compliance Score: ${data.brandCompliance.score}%`,
              bold: true,
              size: 24
            })
          ],
          spacing: { after: 200 }
        })
      );
      
      // Add category breakdown
      const categories = ['messagingScore', 'toneScore', 'visualScore', 'regulatoryScore'];
      categories.forEach(category => {
        if (data.brandCompliance[category]) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${category.replace('Score', '').replace(/([A-Z])/g, ' $1').trim()}: `,
                  bold: true
                }),
                new TextRun(`${data.brandCompliance[category]}%`)
              ]
            })
          );
        }
      });
    }
  }

  static addLocalizationBriefWordContent(children, data) {
    children.push(
      new Paragraph({
        text: "Project Overview",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    if (data.targetMarkets) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Target Markets: ", bold: true }),
            new TextRun(data.targetMarkets.join(', '))
          ]
        })
      );
    }
    
    if (data.executiveSummary?.overallComplexity) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Complexity Level: ", bold: true }),
            new TextRun(data.executiveSummary.overallComplexity)
          ]
        })
      );
    }
  }

  static addCulturalChecklistWordContent(children, data) {
    children.push(
      new Paragraph({
        text: "Cultural Adaptation Checklist",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    if (data.checklistItems?.length > 0) {
      data.checklistItems.forEach((item, index) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${item.item}`,
                bold: true
              })
            ],
            spacing: { before: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun(item.description || '')
            ],
            spacing: { after: 200 }
          })
        );
      });
    }
  }

  static addTranslationInstructionsWordContent(children, data) {
    children.push(
      new Paragraph({
        text: "Translation Instructions",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    if (data.generalInstructions?.length > 0) {
      children.push(
        new Paragraph({
          text: "General Guidelines",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 }
        })
      );
      
      data.generalInstructions.forEach((instruction) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun(`• ${instruction}`)
            ]
          })
        );
      });
    }
  }

  static addRegulatoryMatrixWordContent(children, data) {
    children.push(
      new Paragraph({
        text: "Regulatory Compliance Matrix",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    if (data.requirements?.length > 0) {
      data.requirements.forEach((requirement) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: requirement.category || 'General Requirement',
                bold: true,
                underline: { type: UnderlineType.SINGLE }
              })
            ],
            spacing: { before: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun(requirement.requirement || '')
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Compliance Status: ", bold: true }),
              new TextRun(requirement.compliance || 'Required')
            ],
            spacing: { after: 200 }
          })
        );
      });
    }
  }

  // Email content generators
  static generateBrandComplianceEmailContent(data) {
    let content = '<div class="section"><div class="section-title">Brand Compliance Analysis</div>';
    
    if (data.brandCompliance?.score) {
      content += `
        <div class="score-display">
          <div class="score-number">${data.brandCompliance.score}%</div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${data.brandCompliance.score}%"></div>
          </div>
        </div>
      `;
    }
    
    content += '</div>';
    return content;
  }

  static generateLocalizationBriefEmailContent(data) {
    let content = '<div class="section"><div class="section-title">Localization Brief</div>';
    content += '<div class="list-content">';
    
    if (data.targetMarkets) {
      content += `<p><strong>Target Markets:</strong> ${data.targetMarkets.join(', ')}</p>`;
    }
    
    if (data.executiveSummary?.overallComplexity) {
      content += `<p><strong>Complexity:</strong> ${data.executiveSummary.overallComplexity}</p>`;
    }
    
    content += '</div></div>';
    return content;
  }

  static generateCulturalChecklistEmailContent(data) {
    let content = '<div class="section"><div class="section-title">Cultural Adaptation Checklist</div>';
    
    if (data.checklistItems?.length > 0) {
      content += '<div class="list-content"><ul>';
      data.checklistItems.slice(0, 10).forEach((item) => {
        content += `<li><strong>${item.item}</strong><br>${item.description || ''}</li>`;
      });
      content += '</ul></div>';
    }
    
    content += '</div>';
    return content;
  }

  static generateTranslationInstructionsEmailContent(data) {
    let content = '<div class="section"><div class="section-title">Translation Instructions</div>';
    content += '<div class="list-content">';
    
    if (data.generalInstructions?.length > 0) {
      content += '<h4>Guidelines:</h4><ul>';
      data.generalInstructions.forEach((instruction) => {
        content += `<li>${instruction}</li>`;
      });
      content += '</ul>';
    }
    
    content += '</div></div>';
    return content;
  }

  static generateRegulatoryMatrixEmailContent(data) {
    let content = '<div class="section"><div class="section-title">Regulatory Compliance</div>';
    
    if (data.requirements?.length > 0) {
      content += '<div class="list-content">';
      data.requirements.forEach((req) => {
        content += `<div style="margin-bottom: 16px;">`;
        content += `<h4>${req.category || 'General Requirement'}</h4>`;
        content += `<p>${req.requirement || ''}</p>`;
        content += `<p><strong>Status:</strong> ${req.compliance || 'Required'}</p>`;
        content += `</div>`;
      });
      content += '</div>';
    }
    
    content += '</div>';
    return content;
  }

  static generateExecutiveSummaryText(data) {
    return `This comprehensive analysis provides actionable insights for localization planning, including market readiness assessment, brand compliance evaluation, and regulatory requirements analysis. Key recommendations and priority actions are highlighted for immediate implementation.`;
  }

  static getDocumentTypeLabel(type) {
    const labels = {
      'brand-compliance': 'Brand Compliance Report',
      'localization-brief': 'Localization Brief',
      'cultural-checklist': 'Cultural Adaptation Checklist',
      'translation-instructions': 'Translation Instructions',
      'regulatory-matrix': 'Regulatory Compliance Matrix'
    };
    return labels[type] || type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}