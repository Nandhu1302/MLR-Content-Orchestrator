/**
 * @typedef {Object} EmailTemplate
 * @property {string} templateId
 * @property {string} templateName
 * @property {'HCP' | 'Patient' | 'Caregiver'} audienceType
 * @property {'professional' | 'clinical' | 'patient-friendly'} layoutType
 * @property {Object} sections
 * @property {Object} sections.hero
 * @property {boolean} sections.hero.required
 * @property {boolean} sections.hero.supportsImage
 * @property {string} sections.hero.maxHeight
 * @property {Object} sections.dataSection
 * @property {boolean} sections.dataSection.required
 * @property {boolean} sections.dataSection.supportsCharts
 * @property {boolean} sections.dataSection.supportsTables
 * @property {number} sections.dataSection.maxVisualizations
 * @property {Object} sections.bodyContent
 * @property {boolean} sections.bodyContent.required
 * @property {1 | 2} sections.bodyContent.columns
 * @property {number} sections.bodyContent.maxLength
 * @property {Object} sections.disclaimer
 * @property {boolean} sections.disclaimer.required
 * @property {'inline' | 'footer'} sections.disclaimer.position
 */

/**
 * @typedef {Object} VisualizationComponent
 * @property {string} id
 * @property {string} type
 * @property {string} title
 * @property {string} imageUrl
 * @property {string} altText
 * @property {string} captionHTML
 */

/**
 * @typedef {Object} TableComponent
 * @property {string} id
 * @property {string} title
 * @property {string} tableHTML
 * @property {string} caption
 * @property {string[]} footnotes
 */

/**
 * @typedef {Object} ImageComponent
 * @property {string} id
 * @property {string} imageUrl
 * @property {string} altText
 * @property {'hero' | 'inline' | 'footer'} placement
 * @property {string} [caption]
 */

/**
 * @typedef {Object} EmailComponents
 * @property {Object} text
 * @property {string} text.subject
 * @property {string} [text.preheader]
 * @property {string} text.headline
 * @property {string} text.body
 * @property {string} text.cta
 * @property {string} text.disclaimer
 * @property {VisualizationComponent[]} visualizations
 * @property {TableComponent[]} tables
 * @property {ImageComponent[]} images
 */

export class EmailTemplateRenderer {
  /**
   * @private
   * @type {Map<string, EmailTemplate>}
   */
  static templates = new Map([
    ['professional', {
      templateId: 'professional',
      templateName: 'Professional HCP',
      audienceType: 'HCP',
      layoutType: 'professional',
      sections: {
        hero: { required: false, supportsImage: true, maxHeight: '300px' },
        dataSection: { required: false, supportsCharts: true, supportsTables: true, maxVisualizations: 5 },
        bodyContent: { required: true, columns: 1, maxLength: 2000 },
        disclaimer: { required: true, position: 'footer' }
      }
    }],
    ['clinical', {
      templateId: 'clinical',
      templateName: 'Clinical Data-Heavy',
      audienceType: 'HCP',
      layoutType: 'clinical',
      sections: {
        hero: { required: false, supportsImage: false, maxHeight: '0px' },
        dataSection: { required: true, supportsCharts: true, supportsTables: true, maxVisualizations: 10 },
        bodyContent: { required: true, columns: 1, maxLength: 3000 },
        disclaimer: { required: true, position: 'footer' }
      }
    }],
    ['patient-friendly', {
      templateId: 'patient-friendly',
      templateName: 'Patient Education',
      audienceType: 'Patient',
      layoutType: 'patient-friendly',
      sections: {
        hero: { required: false, supportsImage: true, maxHeight: '400px' },
        dataSection: { required: false, supportsCharts: true, supportsTables: false, maxVisualizations: 3 },
        bodyContent: { required: true, columns: 1, maxLength: 1500 },
        disclaimer: { required: true, position: 'inline' }
      }
    }]
  ]);

  /**
   * Retrieves a template definition by its ID.
   * @param {string} templateId - The ID of the template.
   * @returns {EmailTemplate | undefined}
   */
  static getTemplate(templateId) {
    return this.templates.get(templateId);
  }

  /**
   * Renders a complete HTML email using the specified template and components.
   * Defaults to 'professional' if the templateId is not found.
   * @param {string} templateId - The ID of the template to use.
   * @param {EmailComponents} components - The content components (text, visuals, tables).
   * @param {Record<string, any>} [brandStyles] - Optional branding styles (e.g., primaryColor).
   * @returns {string} The fully rendered HTML email string.
   */
  static render(
    templateId,
    components,
    brandStyles
  ) {
    const template = this.getTemplate(templateId) || this.getTemplate('professional');

    if (!template) {
      // Should not happen as 'professional' is defined, but good practice.
      throw new Error("Default template 'professional' not found.");
    }

    return this.renderTemplate(template, components, brandStyles || {});
  }

  /**
   * @private
   * Renders the email HTML based on the template and components.
   * @param {EmailTemplate} template
   * @param {EmailComponents} components
   * @param {Record<string, any>} brandStyles
   * @returns {string}
   */
  static renderTemplate(
    template,
    components,
    brandStyles
  ) {
    const { text, visualizations, tables, images } = components;

    const primaryColor = brandStyles.primaryColor || '#0066cc';
    const secondaryColor = brandStyles.secondaryColor || '#333333';
    const fontFamily = brandStyles.fontFamily || 'Arial, sans-serif';

    const heroImage = images.find(img => img.placement === 'hero');
    const hasHero = !!heroImage && template.sections.hero.supportsImage;
    const hasVisualizations = visualizations.length > 0 && template.sections.dataSection.supportsCharts;
    const hasTables = tables.length > 0 && template.sections.dataSection.supportsTables;

    // Helper function to handle multiline string indentation in the HTML template literal
    const cleanIndent = (str) => {
      // Remove leading/trailing whitespace and then strip indentation from lines
      if (!str) return '';
      const lines = str.split('\n');
      const minIndent = lines
        .filter(line => line.trim().length > 0)
        .map(line => line.search(/\S/))
        .filter(indent => indent !== -1)
        .reduce((min, current) => Math.min(min, current), Infinity);

      if (minIndent === Infinity) return str;

      return lines
        .map(line => (line.length >= minIndent ? line.substring(minIndent) : line))
        .join('\n');
    };

    const heroBlock = hasHero ? cleanIndent(`
      <div class="hero">
        <img src="${heroImage.imageUrl}" alt="${heroImage.altText}" />
      </div>
    `) : '';

    const visualizationsBlock = hasVisualizations ? cleanIndent(`
      <div class="visual-section">
        ${visualizations.slice(0, template.sections.dataSection.maxVisualizations).map(viz => cleanIndent(`
          <div class="visual-item">
            <h3 class="visual-title">${viz.title}</h3>
            <div class="visual-image">
              [Chart: ${viz.altText}]
            </div>
            ${viz.captionHTML ? `<p class="visual-caption">${viz.captionHTML}</p>` : ''}
          </div>
        `)).join('')}
      </div>
    `) : '';

    const tablesBlock = hasTables ? cleanIndent(`
      <div class="table-section">
        ${tables.map(tbl => cleanIndent(`
          <div class="table-item">
            <h3 class="table-title">${tbl.title}</h3>
            ${tbl.tableHTML}
            ${tbl.footnotes && tbl.footnotes.length > 0 ? cleanIndent(`
              <div class="table-footnotes">
                ${tbl.footnotes.map(fn => `<p>${fn}</p>`).join('')}
              </div>
            `) : ''}
          </div>
        `)).join('')}
      </div>
    `) : '';

    const disclaimerBlock = cleanIndent(`
      <div class="disclaimer">
        <strong>Important Safety Information</strong>
        ${this.formatDisclaimer(text.disclaimer)}
      </div>
    `);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${text.subject}</title>
  <style>
    body { margin: 0; padding: 0; font-family: ${fontFamily}; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .preheader { display: none; max-height: 0; overflow: hidden; }
    .hero { padding: 0; }
    .hero img { display: block; width: 100%; max-height: ${template.sections.hero.maxHeight}; object-fit: cover; }
    .header { padding: 30px 40px 20px; }
    .headline { font-size: 28px; line-height: 1.3; color: ${secondaryColor}; margin: 0; font-weight: bold; }
    .body-text { padding: 0 40px 30px; font-size: 16px; line-height: 1.6; color: #333333; }
    .body-text p { margin: 0 0 15px; }
    .visual-section { padding: 0 40px 30px; }
    .visual-item { margin-bottom: 30px; }
    .visual-title { font-size: 18px; color: ${secondaryColor}; margin: 0 0 10px; font-weight: bold; }
    /* Placeholder styling for charts */
    .visual-image { 
        display: flex; 
        align-items: center; 
        justify-content: center;
        width: 100%; 
        min-height: 200px; 
        border: 1px solid #e0e0e0; 
        padding: 10px; 
        background-color: #fafafa; 
        font-style: italic; 
        color: #999;
    }
    .visual-caption { margin: 10px 0 0; font-size: 13px; color: #666666; font-style: italic; }
    .table-section { padding: 0 40px 30px; }
    .table-item { margin-bottom: 30px; }
    .table-title { font-size: 18px; color: ${secondaryColor}; margin: 0 0 10px; font-weight: bold; }
    .table-footnotes { margin-top: 10px; font-size: 12px; color: #666666; }
    .table-footnotes p { margin: 5px 0; }
    .cta-section { padding: 0 40px 30px; text-align: center; }
    .cta-button { display: inline-block; padding: 15px 40px; background-color: ${primaryColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; }
    .disclaimer { padding: 30px 40px; background-color: #f9f9f9; border-top: 1px solid #e0e0e0; font-size: 11px; line-height: 1.5; color: #666666; }
    .disclaimer strong { display: block; margin-bottom: 5px; }
    
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .header, .body-text, .visual-section, .table-section, .cta-section, .disclaimer { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="background-color: #f4f4f4; margin: 0; padding: 20px 0;">
  <div class="container">
    ${text.preheader ? `<div class="preheader">${text.preheader}</div>` : ''}
    
    ${heroBlock}
    
    <div class="header">
      <h1 class="headline">${text.headline}</h1>
    </div>
    
    <div class="body-text">
      ${this.formatBodyText(text.body)}
    </div>
    
    ${visualizationsBlock}
    
    ${tablesBlock}
    
    <div class="cta-section">
      <a href="#" class="cta-button">${text.cta}</a>
    </div>
    
    ${disclaimerBlock}
  </div>
</body>
</html>`;
  }

  /**
   * @private
   * Converts plain text body content into HTML paragraphs.
   * @param {string} body - The raw body text.
   * @returns {string} HTML formatted paragraphs.
   */
  static formatBodyText(body) {
    return body
      .split('\n\n')
      .filter(para => para.trim())
      .map(para => `<p>${para.trim()}</p>`)
      .join('');
  }

  /**
   * @private
   * Converts plain text disclaimer content into HTML paragraphs.
   * @param {string} disclaimer - The raw disclaimer text.
   * @returns {string} HTML formatted paragraphs for the disclaimer.
   */
  static formatDisclaimer(disclaimer) {
    return disclaimer
      .split('\n')
      .filter(line => line.trim())
      .map(line => `<p style="margin: 5px 0;">${line.trim()}</p>`)
      .join('');
  }
}