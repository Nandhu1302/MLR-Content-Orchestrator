import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// EmailTemplateRenderer interfaces and class (inlined for edge function)

// JSDoc representations of original TypeScript interfaces:
/**
 * @typedef {Object} EmailTemplateSections
 * @property {Object} hero
 * @property {boolean} hero.required
 * @property {boolean} hero.supportsImage
 * @property {string} hero.maxHeight
 * @property {Object} dataSection
 * @property {boolean} dataSection.required
 * @property {boolean} dataSection.supportsCharts
 * @property {boolean} dataSection.supportsTables
 * @property {number} dataSection.maxVisualizations
 * @property {Object} bodyContent
 * @property {boolean} bodyContent.required
 * @property {number} bodyContent.columns
 * @property {number} bodyContent.maxLength
 * @property {Object} disclaimer
 * @property {boolean} disclaimer.required
 * @property {('inline'|'footer')} disclaimer.position
 */

/**
 * @typedef {Object} EmailTemplate
 * @property {string} templateId
 * @property {string} templateName
 * @property {('HCP'|'Patient'|'Caregiver')} audienceType
 * @property {('professional'|'clinical'|'patient-friendly')} layoutType
 * @property {EmailTemplateSections} sections
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
 * @property {Array<Object>} visualizations
 * @property {string} visualizations.id
 * @property {string} visualizations.type
 * @property {string} visualizations.title
 * @property {string} visualizations.imageUrl
 * @property {string} visualizations.altText
 * @property {string} visualizations.captionHTML
 * @property {Array<Object>} tables
 * @property {string} tables.id
 * @property {string} tables.title
 * @property {string} tables.tableHTML
 * @property {string} tables.caption
 * @property {string[]} tables.footnotes
 * @property {string} [tables.placementHint]
 * @property {Array<Object>} images
 * @property {string} images.id
 * @property {string} images.imageUrl
 * @property {string} images.altText
 * @property {('hero'|'inline'|'footer')} images.placement
 * @property {string} [images.caption]
 * @property {string} [referencesSection]
 */

/**
 * @typedef {Object} CitationDataItem
 * @property {string} id
 * @property {string} [claim_id_display]
 * @property {string} claim_text
 * @property {string} [claim_type]
 * @property {string} [source_section]
 */

/**
 * @typedef {Object} ReferenceDataItem
 * @property {string} id
 * @property {string} [reference_id_display]
 * @property {string} reference_text
 * @property {string} [formatted_citation]
 * @property {string} [study_name]
 * @property {string} [journal]
 * @property {number} [publication_year]
 */

/**
 * @typedef {Object} VisualDataItem
 * @property {string} id
 * @property {string} title
 * @property {string} visual_type
 * @property {any} [visual_data]
 * @property {string} [storage_path]
 */

/**
 * @typedef {Object} CitationData
 * @property {CitationDataItem[]} [claimsUsed]
 * @property {ReferenceDataItem[]} [referencesUsed]
 * @property {VisualDataItem[]} [visualsUsed]
 */


class EmailTemplateRenderer {
  /** @type {Map<string, EmailTemplate>} */
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
   * @param {string} templateId
   * @returns {EmailTemplate | undefined}
   */
  static getTemplate(templateId) {
    return this.templates.get(templateId);
  }

  /**
   * @param {string} templateId
   * @param {EmailComponents} components
   * @param {Record<string, any>} [brandStyles]
   * @returns {string}
   */
  static render(
    templateId,
    components,
    brandStyles
  ) {
    const template = this.getTemplate(templateId) || this.getTemplate('professional');

    return this.renderTemplate(template, components, brandStyles || {});
  }

  /**
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
    const { text, visualizations, tables, images, referencesSection } = components;

    const primaryColor = brandStyles.primaryColor || '#0066cc';
    const secondaryColor = brandStyles.secondaryColor || '#333333';
    const fontFamily = brandStyles.fontFamily || 'Arial, sans-serif';

    const heroImage = images.find(img => img.placement === 'hero');
    const hasHero = !!heroImage && template.sections.hero.supportsImage;
    const hasVisualizations = visualizations.length > 0 && template.sections.dataSection.supportsCharts;

    // Get body paragraphs with inline tables integrated
    const bodyWithInlineTables = this.integrateTablesIntoParagraphs(text.body, tables, template);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${text.subject}</title>
  <style>
    body { margin: 0; padding: 0; font-family: ${fontFamily}; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .preheader { display: none; max-height: 0; overflow: hidden; }
    .hero { padding: 0; }
    .hero img { display: block; width: 100%; max-height: ${template.sections.hero.maxHeight}; object-fit: cover; }
    .header { padding: 35px 40px 20px; background: linear-gradient(135deg, ${primaryColor}08, ${primaryColor}03); border-bottom: 3px solid ${primaryColor}; }
    .headline { font-size: 26px; line-height: 1.35; color: ${secondaryColor}; margin: 0; font-weight: 700; letter-spacing: -0.3px; }
    .body-text { padding: 25px 40px 30px; font-size: 15px; line-height: 1.7; color: #444444; }
    .body-text p { margin: 0 0 18px; }
    .body-text p:last-child { margin-bottom: 0; }
    .body-text sup { font-size: 10px; color: ${primaryColor}; font-weight: 700; cursor: pointer; vertical-align: super; padding: 0 1px; }
    .body-text sup:hover { text-decoration: underline; }
    .visual-section { padding: 0 40px 25px; }
    .visual-item { margin-bottom: 25px; }
    .visual-title { font-size: 16px; color: ${secondaryColor}; margin: 0 0 10px; font-weight: 600; }
    .visual-image { display: block; width: 100%; border: 1px solid #e0e0e0; padding: 10px; background-color: #fafafa; border-radius: 6px; }
    .visual-caption { margin: 10px 0 0; font-size: 12px; color: #666666; font-style: italic; }

    /* Inline table styling - integrated within body */
    .inline-table-wrapper { margin: 25px 0; }

    .cta-section { padding: 10px 40px 35px; text-align: center; }
    .cta-button { display: inline-block; padding: 16px 45px; background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 12px ${primaryColor}40; transition: all 0.2s ease; }
    .cta-button:hover { transform: translateY(-1px); box-shadow: 0 6px 16px ${primaryColor}50; }

    /* References section styling */
    .references-section { padding: 25px 40px; background: linear-gradient(180deg, #f8f9fb, #f5f6f8); border-top: 1px solid #e8eaed; }
    .references-title { font-size: 13px; font-weight: 700; color: ${secondaryColor}; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .references-list { margin: 0; padding-left: 0; font-size: 11px; line-height: 1.6; color: #555555; list-style: none; }
    .references-list li { margin-bottom: 8px; padding-left: 0; position: relative; }
    .references-list li strong { color: ${primaryColor}; }

    /* Disclaimer styling */
    .disclaimer { padding: 25px 40px 30px; background-color: #fafafa; border-top: 1px solid #eee; font-size: 11px; line-height: 1.6; color: #777777; }
    .disclaimer strong { display: block; margin-bottom: 8px; color: #555; font-size: 12px; }
    .disclaimer p { margin: 4px 0; }

    /* Data table styling - responsive with scroll */
    .data-table { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .data-table-title { background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}ee); color: white; padding: 14px 18px; font-size: 14px; font-weight: 600; margin: 0; letter-spacing: 0.2px; }
    .data-table .table-scroll-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .data-table table { width: 100%; border-collapse: collapse; min-width: 400px; table-layout: auto; }
    .data-table th { background: #f8f9fb; padding: 10px 12px; text-align: left; font-size: 11px; color: #555; border-bottom: 2px solid #e5e7eb; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; }
    .data-table td { padding: 10px 12px; font-size: 12px; color: #333; border-bottom: 1px solid #f0f0f0; word-break: break-word; max-width: 200px; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:nth-child(even) { background: #fafbfc; }
    .data-table tr:hover { background: #f5f7fa; }
    .data-table-footnotes { padding: 12px 18px; background: #f9fafb; font-size: 11px; color: #666; border-top: 1px solid #e5e7eb; }
    .data-table-footnotes p { margin: 4px 0; }

    /* Visual asset image styling */
    .visual-asset-container { margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .visual-asset-image { width: 100%; display: block; }
    .visual-asset-caption { padding: 12px 18px; background: #f8f9fb; font-size: 12px; color: #555; border-top: 1px solid #e5e7eb; }

    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .header, .body-text, .visual-section, .cta-section, .disclaimer, .references-section { padding-left: 20px !important; padding-right: 20px !important; }
      .headline { font-size: 22px !important; }
      .cta-button { padding: 14px 35px !important; }
      .data-table { margin-left: -10px; margin-right: -10px; border-radius: 0; }
      .data-table table { min-width: 350px; }
      .data-table th, .data-table td { padding: 8px 6px; font-size: 11px; }
    }
  </style>
</head>
<body style="background-color: #f4f4f4; margin: 0; padding: 25px 0;">
  <div class="container">
    ${text.preheader ? `<div class="preheader">${text.preheader}</div>` : ''}

    ${hasHero ? `
    <div class="hero">
      <img src="${heroImage.imageUrl}" alt="${heroImage.altText}" />
    </div>
    ` : ''}

    <div class="header">
      <h1 class="headline">${text.headline}</h1>
    </div>

    <div class="body-text">
      ${bodyWithInlineTables}
    </div>

    ${hasVisualizations ? `
    <div class="visual-section">
      ${visualizations.slice(0, template.sections.dataSection.maxVisualizations).map(viz => `
        <div class="visual-item">
          <h3 class="visual-title">${viz.title}</h3>
          ${viz.captionHTML || ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="cta-section">
      <a href="#" class="cta-button">${text.cta}</a>
    </div>

    ${referencesSection ? `
    <div class="references-section">
      <h4 class="references-title">References</h4>
      ${referencesSection}
    </div>
    ` : ''}

    <div class="disclaimer">
      <strong>Important Safety Information</strong>
      ${this.formatDisclaimer(text.disclaimer)}
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * @param {string} body
   * @param {any[]} tables
   * @param {EmailTemplate} template
   * @returns {string}
   */
  static integrateTablesIntoParagraphs(body, tables, template) {
    if (!tables.length || !template.sections.dataSection.supportsTables) {
      return this.formatBodyText(body);
    }

    const paragraphs = body.split('\n\n').filter(para => para.trim());

    if (paragraphs.length === 0) {
      return this.formatBodyText(body);
    }

    // Keywords that indicate good table placement points
    const tableRelevanceKeywords = [
      'efficacy', 'trial', 'study', 'results', 'data', 'outcomes', 'demonstrated',
      'showed', 'achieved', 'rates', 'patients', 'clinical', 'response', 'reduction',
      'improvement', 'evidence', 'analysis', 'compared', 'versus', 'vs'
    ];

    // Find best placement for each table
    /** @type {Map<number, any[]>} */
    const tablePlacements = new Map();

    tables.forEach((table) => {
      // Check if table has placement hint
      if (table.placementHint && table.placementHint.startsWith('after_paragraph_')) {
        const paraIndex = parseInt(table.placementHint.replace('after_paragraph_', ''), 10);
        if (!isNaN(paraIndex) && paraIndex >= 0 && paraIndex < paragraphs.length) {
          const existing = tablePlacements.get(paraIndex) || [];
          existing.push(table);
          tablePlacements.set(paraIndex, existing);
          return;
        }
      }

      // Find paragraph with most relevance keywords
      let bestParagraphIndex = Math.min(1, paragraphs.length - 1); // Default: after 2nd paragraph
      let bestScore = 0;

      paragraphs.forEach((para, paraIndex) => {
        const paraLower = para.toLowerCase();
        let score = 0;

        tableRelevanceKeywords.forEach(keyword => {
          if (paraLower.includes(keyword)) {
            score += 1;
          }
        });

        // Prefer middle paragraphs slightly
        if (paraIndex > 0 && paraIndex < paragraphs.length - 1) {
          score += 0.5;
        }

        if (score > bestScore) {
          bestScore = score;
          bestParagraphIndex = paraIndex;
        }
      });

      const existing = tablePlacements.get(bestParagraphIndex) || [];
      existing.push(table);
      tablePlacements.set(bestParagraphIndex, existing);
    });

    // Build HTML with tables inserted after relevant paragraphs
    let html = '';
    paragraphs.forEach((para, index) => {
      html += `<p>${para.trim()}</p>`;

      // Insert tables after this paragraph if assigned
      const tablesForThisParagraph = tablePlacements.get(index) || [];
      tablesForThisParagraph.forEach(table => {
        html += `<div class="inline-table-wrapper">${table.tableHTML}</div>`;
      });
    });

    return html;
  }

  /**
   * @param {string} body
   * @returns {string}
   */
  static formatBodyText(body) {
    return body
      .split('\n\n')
      .filter(para => para.trim())
      .map(para => `<p>${para.trim()}</p>`)
      .join('');
  }

  /**
   * @param {string} disclaimer
   * @returns {string}
   */
  static formatDisclaimer(disclaimer) {
    return disclaimer
      .split('\n')
      .filter(line => line.trim())
      .map(line => `<p style="margin: 4px 0;">${line.trim()}</p>`)
      .join('');
  }
}

// Audience Profile System (inlined for edge function)

/**
 * @typedef {Object} AudienceProfile
 * @property {string[]} leadWith
 * @property {string[]} emphasize
 * @property {string[]} avoid
 * @property {string[]} structure
 * @property {string} tone
 * @property {string} depth
 * @property {string} terminology
 */

/** @type {Record<string, Partial<AudienceProfile>>} */
const SPECIALIST_PROFILES = {
  'oncologist': {
    leadWith: ['Clinical trial data and efficacy outcomes', 'Survival benefits and response rates'],
    emphasize: ['Evidence from pivotal trials', 'MOA in cancer treatment', 'Safety profile in oncology patients'],
    avoid: ['Overgeneralized benefits', 'Non-specific quality of life claims'],
    structure: ['Start with trial data', 'Present efficacy clearly', 'Address safety transparently']
  },
  'cardiologist': {
    leadWith: ['Cardiovascular outcomes data', 'Risk reduction statistics'],
    emphasize: ['MACE reduction', 'Long-term safety in CV populations', 'Real-world evidence'],
    avoid: ['Vague heart health claims', 'Non-cardiac benefits as primary message'],
    structure: ['Lead with CV outcomes', 'Show risk stratification data', 'Include guideline alignment']
  },
  'pulmonologist': {
    leadWith: ['Lung function improvements', 'Respiratory outcomes data'],
    emphasize: ['FVC/FEV1 improvements', 'Exacerbation reduction', 'Disease progression data'],
    avoid: ['Generic respiratory benefits', 'Oversimplified lung health claims'],
    structure: ['Present pulmonary function data', 'Show disease progression curves', 'Address long-term management']
  },
  'endocrinologist': {
    leadWith: ['HbA1c reduction', 'Glycemic control data'],
    emphasize: ['Metabolic outcomes', 'Weight management data', 'CV safety profile'],
    avoid: ['Generic diabetes management claims', 'Oversimplified metabolic benefits'],
    structure: ['Lead with glycemic efficacy', 'Show metabolic benefits', 'Address CV safety']
  },
  'dermatologist': {
    leadWith: ['Skin clearance data', 'EASI/IGA scores'],
    emphasize: ['Visible improvements timeline', 'Itch reduction', 'QoL improvements'],
    avoid: ['Vague skin health claims', 'Non-specific cosmetic benefits'],
    structure: ['Show clearance data with timelines', 'Present validated dermatology scales', 'Include patient-reported outcomes']
  },
  'neurologist': {
    leadWith: ['Neurological outcomes', 'Stroke prevention data'],
    emphasize: ['Risk reduction statistics', 'Cognitive/functional outcomes', 'Safety in neurological populations'],
    avoid: ['Generic brain health claims', 'Oversimplified neurological benefits'],
    structure: ['Present neurological endpoints', 'Show risk stratification', 'Address neuroprotection data']
  },
  'ent-specialist': {
    leadWith: ['Symptom scores', 'Polyp reduction data'],
    emphasize: ['Objective nasal measures', 'Symptom improvement timelines', 'Reduced need for surgery'],
    avoid: ['Vague sinus health claims', 'Non-specific ENT benefits'],
    structure: ['Show validated ENT outcome measures', 'Present visual evidence if available', 'Include patient symptom improvements']
  }
};

/** @type {Record<string, AudienceProfile>} */
const BASE_AUDIENCE_PROFILES = {
  'physician-specialist': {
    leadWith: ['Clinical evidence', 'Mechanism of action', 'Differentiation vs competitors'],
    emphasize: ['Efficacy data', 'Safety profile', 'Patient selection criteria'],
    avoid: ['Overly promotional language', 'Unsubstantiated claims', 'Emotional appeals'],
    structure: ['Problem', 'Solution', 'Evidence', 'Clinical application'],
    tone: 'Professional, evidence-based, peer-to-peer',
    depth: 'High clinical depth with specific data points',
    terminology: 'Medical terminology appropriate for specialists'
  },
  'physician-primary-care': {
    leadWith: ['Practical clinical utility', 'Clear patient selection', 'Simple dosing'],
    emphasize: ['Real-world applicability', 'Safety and tolerability', 'Guideline alignment'],
    avoid: ['Overly complex mechanisms', 'Subspecialty-only information', 'Impractical protocols'],
    structure: ['Clinical scenario', 'Treatment approach', 'Key points', 'Action'],
    tone: 'Professional but accessible',
    depth: 'Moderate depth with practical focus',
    terminology: 'Clear medical terms with context'
  },
  'patient': {
    leadWith: ['Patient benefits', 'How treatment works', 'What to expect'],
    emphasize: ['Quality of life improvements', 'Safety and side effects', 'Support resources'],
    avoid: ['Medical jargon', 'Complex mechanisms', 'Scary statistics without context'],
    structure: ['What it is', 'How it helps', 'What to expect', 'How to take it'],
    tone: 'Empathetic, supportive, educational',
    depth: 'Simple explanations with analogies',
    terminology: 'Plain language with key terms explained'
  }
};

/**
 * @param {string} audienceType
 * @param {string} [specialistType]
 * @returns {AudienceProfile}
 */
function getAudienceProfile(audienceType, specialistType) {
  const baseProfile = BASE_AUDIENCE_PROFILES[audienceType] || BASE_AUDIENCE_PROFILES['physician-specialist'];

  if (specialistType && SPECIALIST_PROFILES[specialistType]) {
    return {
      ...baseProfile,
      ...SPECIALIST_PROFILES[specialistType]
    };
  }

  return baseProfile;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * @param {string} targetAudience
 * @param {string} assetType
 * @param {boolean} hasClinicalData
 * @returns {string}
 */
function determineTemplate(targetAudience, assetType, hasClinicalData) {
  const audience = targetAudience?.toLowerCase() || 'hcp';

  if (audience === 'patient' || audience === 'caregiver' || assetType === 'patient-email') {
    return 'patient-friendly';
  } else if (audience === 'hcp' || audience === 'healthcare professional') {
    if (hasClinicalData) {
      return 'clinical';
    }
    return 'professional';
  }

  return 'professional';
}

/**
 * @param {any} visualAsset
 * @returns {string}
 */
function renderVisualAssetTable(visualAsset) {
  const visualData = visualAsset.visual_data || {};
  const title = visualAsset.title || 'Data Table';
  const headers = visualData.headers || visualData.columns || [];
  const rows = visualData.rows || visualData.data || [];
  const footnotes = visualData.footnotes || [];

  if (!headers.length && !rows.length) {
    return `<div class="data-table"><p style="padding: 15px; color: #666;">No table data available</p></div>`;
  }

  // Calculate column count for responsive sizing
  const columnCount = headers.length || (rows[0]?.length || 0);
  const isWideTable = columnCount > 4;
  const cellStyle = isWideTable ? 'font-size: 11px; padding: 8px 6px;' : '';
  const headerStyle = isWideTable ? 'font-size: 10px; padding: 8px 6px;' : '';
  const tableMinWidth = isWideTable ? 'min-width: 500px;' : '';

  return `
    <div class="data-table">
      <h4 class="data-table-title">${title}</h4>
      <div class="table-scroll-wrapper">
        <table style="${tableMinWidth}">
          ${headers.length > 0 ? `
            <thead>
              <tr>${headers.map(h => `<th style="${headerStyle}">${h}</th>`).join('')}</tr>
            </thead>
          ` : ''}
          <tbody>
            ${rows.map(row => `
              <tr>${row.map(cell => `<td style="${cellStyle}">${cell}</td>`).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${footnotes.length > 0 ? `
        <div class="data-table-footnotes">
          ${footnotes.map(fn => `<p>* ${fn}</p>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * @param {any} visualAsset
 * @param {string} [signedUrl]
 * @returns {string}
 */
function renderVisualAssetImage(visualAsset, signedUrl) {
  const title = visualAsset.title || 'Visual Asset';
  const caption = visualAsset.caption || '';
  const imageUrl = signedUrl || visualAsset.imageUrl || '';

  if (!imageUrl) {
    return `<div class="visual-asset-container"><p style="padding: 15px; color: #666;">Image not available</p></div>`;
  }

  return `
    <div class="visual-asset-container">
      <img src="${imageUrl}" alt="${title}" class="visual-asset-image" />
      ${caption ? `<div class="visual-asset-caption">${caption}</div>` : ''}
    </div>
  `;
}

/**
 * @param {CitationData} citations
 * @returns {string}
 */
function formatReferencesSection(citations) {
  if (!citations) return '';

  /** @type {string[]} */
  const references = [];
  let refNumber = 1;

  // Add claims as references
  if (citations.claimsUsed?.length) {
    citations.claimsUsed.forEach(claim => {
      if (!claim) return;
      const claimId = claim.id || '';
      const displayId = claim.claim_id_display || (claimId ? `CML-${claimId.substring(0, 4)}` : `CML-${refNumber}`);
      const claimText = claim.claim_text || 'Clinical claim';
      references.push(`<li><strong>[${refNumber}]</strong> ${claimText} <em style="color: #888;">(${displayId})</em></li>`);
      refNumber++;
    });
  }

  // Add formal references
  if (citations.referencesUsed?.length) {
    citations.referencesUsed.forEach(ref => {
      if (!ref) return;
      const citation = ref.formatted_citation || ref.reference_text || 'Reference';
      const refId = ref.id || '';
      const displayId = ref.reference_id_display || (refId ? `REF-${refId.substring(0, 4)}` : '');
      const journalInfo = ref.journal && ref.publication_year
        ? ` ${ref.journal}, ${ref.publication_year}`
        : '';
      references.push(`<li><strong>[${refNumber}]</strong> ${citation}${journalInfo}${displayId ? ` <em style="color: #888;">(${displayId})</em>` : ''}</li>`);
      refNumber++;
    });
  }

  if (references.length === 0) return '';

  return `<ol class="references-list">${references.join('')}</ol>`;
}

/**
 * @param {string} bodyText
 * @param {CitationData} citations
 * @returns {string}
 */
function addCitationSuperscripts(bodyText, citations) {
  if (!citations.claimsUsed?.length && !citations.referencesUsed?.length) {
    return bodyText;
  }

  /** @type {Map<string, number>} */
  const citationMap = new Map();
  let refNumber = 1;

  citations.claimsUsed?.forEach(claim => {
    if (!claim) return;
    const claimId = claim.id || '';
    const displayId = claim.claim_id_display || (claimId ? `CML-${claimId.substring(0, 4)}` : `CML-${refNumber}`);
    citationMap.set(displayId, refNumber);
    citationMap.set(displayId.toUpperCase(), refNumber);
    citationMap.set(displayId.toLowerCase(), refNumber);
    if (claimId) {
      citationMap.set(claimId, refNumber);
      citationMap.set(claimId.toUpperCase(), refNumber);
    }
    refNumber++;
  });

  citations.referencesUsed?.forEach(ref => {
    if (!ref) return;
    const refId = ref.id || '';
    const displayId = ref.reference_id_display || (refId ? `REF-${refId.substring(0, 4)}` : `REF-${refNumber}`);
    citationMap.set(displayId, refNumber);
    citationMap.set(displayId.toUpperCase(), refNumber);
    citationMap.set(displayId.toLowerCase(), refNumber);
    if (refId) {
      citationMap.set(refId, refNumber);
      citationMap.set(refId.toUpperCase(), refNumber);
    }
    refNumber++;
  });

  // Replace [CLAIM:XXX] and [REF:XXX] markers with superscripts
  let processedText = bodyText;

  // Replace claim markers (case insensitive)
  processedText = processedText.replace(/\[CLAIM:([^\]]+)\]/gi, (match, claimId) => {
    const trimmedId = claimId.trim();
    const num = citationMap.get(trimmedId) || citationMap.get(trimmedId.toUpperCase()) || citationMap.get(trimmedId.toLowerCase());
    return num ? `<sup>[${num}]</sup>` : '';
  });

  // Replace reference markers (case insensitive)
  processedText = processedText.replace(/\[REF:([^\]]+)\]/gi, (match, refId) => {
    const trimmedId = refId.trim();
    const num = citationMap.get(trimmedId) || citationMap.get(trimmedId.toUpperCase()) || citationMap.get(trimmedId.toLowerCase());
    return num ? `<sup>[${num}]</sup>` : '';
  });

  return processedText;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    const { textContent, piData, evidenceContext, context, citationData, brandId } = await req.json();

    console.log(`[${requestId}] 📧 Smart Email Composition Started`, {
      hasTextContent: !!textContent,
      hasPIData: !!piData,
      hasEvidence: !!evidenceContext,
      hasCitationData: !!citationData,
      brandId,
      context
    });

    // Initialize Supabase client for fetching visual assets
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    /** @type {any[]} */
    const intelligenceUsed = [];

    // Fetch real visual assets from database if brandId provided
    /** @type {any[]} */
    let dbVisualAssets = [];
    if (brandId) {
      console.log(`[${requestId}] 📊 Fetching visual assets for brand: ${brandId}`);
      const { data: visualAssets, error: visualError } = await supabase
        .from('visual_assets')
        .select('*')
        .eq('brand_id', brandId)
        .limit(10);

      if (visualError) {
        console.error(`[${requestId}] Error fetching visual assets:`, visualError);
      } else {
        dbVisualAssets = visualAssets || [];
        console.log(`[${requestId}] ✅ Fetched ${dbVisualAssets.length} visual assets from database`);
      }
    }

    // Fetch complete visual data for citation visuals (they may have incomplete data)
    /** @type {any[]} */
    let completeCitationVisuals = [];
    const visualsFromCitation = citationData?.visualsUsed || [];
    console.log(`[${requestId}] 📊 Visuals from citation data: ${visualsFromCitation.length}`,
      visualsFromCitation.length > 0 ? JSON.stringify(visualsFromCitation[0]) : 'empty');

    if (visualsFromCitation.length > 0) {
      // Handle both 'id' and 'visualId' property names (different sources use different naming)
      const citationVisualIds = visualsFromCitation
        .map((v) => v.id || v.visualId || v.visual_id)
        .filter(Boolean);
      console.log(`[${requestId}] 📊 Fetching complete data for ${citationVisualIds.length} citation visuals:`, citationVisualIds);

      if (citationVisualIds.length > 0) {
        const { data: completeVisuals, error: completeError } = await supabase
          .from('visual_assets')
          .select('*')
          .in('id', citationVisualIds);

        if (completeError) {
          console.error(`[${requestId}] Error fetching complete citation visuals:`, completeError);
        } else {
          completeCitationVisuals = completeVisuals || [];
          console.log(`[${requestId}] ✅ Fetched complete data for ${completeCitationVisuals.length} citation visuals`);
        }
      }
    }

    // Determine appropriate template based on context
    const selectedTemplate = context.targetAudience?.toLowerCase().includes('patient') ? 'patient-friendly' : 'professional';

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error(`[${requestId}] ❌ LOVABLE_API_KEY not configured`);
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured', requestId }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get specialist-aware audience profile
    const audienceProfile = getAudienceProfile(
      context.targetAudience || 'physician-specialist',
      context.specialistType
    );

    // Track evidence usage from PI data
    if (piData) {
      if (piData.clinicalTrialResults?.length > 0) {
        piData.clinicalTrialResults.forEach((trial) => {
          intelligenceUsed.push({
            type: 'evidence',
            source: trial.source || 'Clinical Trial',
            id: trial.studyName || 'trial-' + Math.random(),
            content: trial.data || trial.studyName || 'Clinical trial data',
            confidence: 0.95
          });
        });
      }

      if (piData.efficacyData?.length > 0) {
        piData.efficacyData.forEach((eff) => {
          intelligenceUsed.push({
            type: 'evidence',
            source: eff.source || 'Efficacy Data',
            id: 'efficacy-' + Math.random(),
            content: `${eff.metric}: ${eff.value}`,
            confidence: 0.92
          });
        });
      }

      if (piData.safetyData?.length > 0) {
        intelligenceUsed.push({
          type: 'evidence',
          source: 'Safety Profile',
          id: 'safety-data',
          content: `${piData.safetyData.length} safety data points included`,
          confidence: 0.90
        });
      }
    }

    // Track citation data usage
    if (citationData) {
      if (citationData.claimsUsed?.length > 0) {
        citationData.claimsUsed.forEach((claim) => {
          intelligenceUsed.push({
            type: 'evidence',
            source: 'Clinical Claim',
            id: claim.claim_id_display || claim.id,
            content: claim.claim_text,
            confidence: 0.95
          });
        });
      }

      if (citationData.referencesUsed?.length > 0) {
        citationData.referencesUsed.forEach((ref) => {
          intelligenceUsed.push({
            type: 'evidence',
            source: 'Clinical Reference',
            id: ref.reference_id_display || ref.id,
            content: ref.reference_text || ref.formatted_citation,
            confidence: 0.93
          });
        });
      }

      if (citationData.visualsUsed?.length > 0) {
        citationData.visualsUsed.forEach((visual) => {
          intelligenceUsed.push({
            type: 'evidence',
            source: 'Visual Asset',
            id: visual.id,
            content: visual.title,
            confidence: 0.90
          });
        });
      }
    }

    // Track evidence context usage
    if (evidenceContext) {
      if (evidenceContext.claims?.length > 0) {
        evidenceContext.claims.forEach((claim) => {
          intelligenceUsed.push({
            type: 'evidence',
            source: 'Clinical Claim Library',
            id: claim.id || 'claim-' + Math.random(),
            content: claim.claim_text || claim.text || 'Clinical claim',
            confidence: claim.confidence_score || 0.88
          });
        });
      }

      if (evidenceContext.references?.length > 0) {
        intelligenceUsed.push({
          type: 'evidence',
          source: 'Reference Library',
          id: 'references',
          content: `${evidenceContext.references.length} clinical references available`,
          confidence: 0.85
        });
      }
    }

    // Track audience intelligence
    if (context.specialistType) {
      intelligenceUsed.push({
        type: 'audience',
        source: 'Specialist Profile',
        id: 'specialist-profile',
        content: `Content tailored for ${context.specialistDisplayName || context.specialistType}`,
        confidence: 0.93
      });
    }

    // Track brand intelligence
    intelligenceUsed.push({
      type: 'brand',
      source: 'Therapeutic Area',
      id: 'therapeutic-area',
      content: `${context.therapeuticArea} guidelines applied`,
      confidence: 0.90
    });

    // Track performance intelligence from asset metadata
    if (context.performanceData) {
      context.performanceData.forEach((p) => {
        intelligenceUsed.push({
          type: 'performance',
          source: 'Campaign Performance',
          id: p.id || 'perf-' + Math.random(),
          content: `${p.campaign_name}: ${p.engagement_score || 0}% engagement`,
          confidence: 0.87
        });
      });
    }

    // Track competitive intelligence from asset metadata
    if (context.competitiveData) {
      context.competitiveData.forEach((c) => {
        intelligenceUsed.push({
          type: 'competitive',
          source: 'Competitive Intelligence',
          id: c.id || 'comp-' + Math.random(),
          content: `${c.competitor_name}: ${c.title}`,
          confidence: 0.82
        });
      });
    }

    // Build AI prompt with all available data INCLUDING CITATION DATA for embedding markers
    const prompt = buildEnhancementPrompt(textContent, piData, context, evidenceContext, citationData);

    // Build specialist-aware system prompt
    const systemPrompt = buildSystemPrompt(context, audienceProfile);

    // Single AI call to enhance content with structured output
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'enhance_email_content',
              description: 'Return enhanced email content with improved copy and embedded citation markers',
              parameters: {
                type: 'object',
                properties: {
                  subject: {
                    type: 'string',
                    description: 'Enhanced subject line (max 60 chars)'
                  },
                  preheader: {
                    type: 'string',
                    description: 'Enhanced preheader (max 100 chars)'
                  },
                  headline: {
                    type: 'string',
                    description: 'Compelling headline with key benefit'
                  },
                  body_paragraphs: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of body paragraphs (2-4 paragraphs) with [CLAIM:CML-XXXX] markers embedded where clinical claims support the text'
                  },
                  cta: {
                    type: 'string',
                    description: 'Clear call to action'
                  },
                  disclaimer: {
                    type: 'string',
                    description: 'Required disclaimer text'
                  },
                  table_placements: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        after_paragraph: { type: 'number', description: '0-indexed paragraph number to place table after' },
                        table_keyword: { type: 'string', description: 'Keyword to match table title (e.g., "efficacy", "trial")' }
                      }
                    },
                    description: 'Suggested placements for data tables within the body content'
                  },
                  evidenceReferences: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of evidence references cited in content'
                  }
                },
                required: ['subject', 'headline', 'body_paragraphs', 'cta'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'enhance_email_content' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error(`[${requestId}] AI API error:`, errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: `AI service error: ${aiResponse.status}`,
          requestId
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();

    // Extract structured output from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'enhance_email_content') {
      console.error('No valid tool call in AI response:', aiData);
      throw new Error('AI did not return expected structured output');
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(toolCall.function.arguments);
      console.log(`[${requestId}] ✅ Successfully parsed AI response via tool calling`);
      console.log(`[${requestId}] 📝 Body paragraphs count: ${parsedContent.body_paragraphs?.length || 0}`);

      // Log if citations were embedded
      const allBodyText = (parsedContent.body_paragraphs || []).join(' ');
      const claimMarkerCount = (allBodyText.match(/\[CLAIM:/gi) || []).length;
      console.log(`[${requestId}] 🔖 Citation markers found in AI output: ${claimMarkerCount}`);
    } catch (e) {
      console.error(`[${requestId}] Failed to parse tool call arguments:`, toolCall.function.arguments);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to parse AI response: ${e instanceof Error ? e.message : 'Unknown error'}`,
          requestId
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate visualizations - combine PI data with real visual assets from DB
    const piVisualizations = await generateVisualizations(piData);
    console.log(`[${requestId}] 📊 Generated ${piVisualizations.length} PI-based visualizations`);

    // Generate real visual asset renderings from database
    /** @type {any[]} */
    const realVisualAssets = [];

    // Prioritize complete citation visuals (already selected by user), then fall back to dbVisualAssets
    // Use completeCitationVisuals which has full data, not visualsFromCitation which may be incomplete
    const visualsToRender = completeCitationVisuals.length > 0
      ? completeCitationVisuals
      : (visualsFromCitation.length > 0 ? visualsFromCitation : dbVisualAssets);

    console.log(`[${requestId}] 📊 Processing ${visualsToRender.length} visuals for rendering`);

    for (const asset of visualsToRender.slice(0, 5)) {
      // Check for both visual_type (from DB) and type/visualType (from citation data) - handle property name mismatch
      const assetType = asset.visual_type || asset.visualType || asset.type || '';
      const assetId = asset.id || asset.visualId || asset.visual_id || 'unknown';
      const hasTableData = asset.visual_data && (asset.visual_data.headers || asset.visual_data.rows || asset.visual_data.columns);

      console.log(`[${requestId}] Processing visual: id=${assetId.substring?.(0, 8) || 'unknown'}, type=${assetType}, hasTableData=${hasTableData}, hasStoragePath=${!!asset.storage_path}, storagePath=${!!asset.storagePath}`);

      if (assetType === 'table' || hasTableData) {
        realVisualAssets.push({
          type: 'database-table',
          position: 'mid-body',
          html: renderVisualAssetTable(asset),
          title: asset.title || 'Data Table'
        });
        console.log(`[${requestId}] ✅ Rendered table: ${asset.title || 'Untitled'}`);
      } else if (asset.storage_path || asset.storagePath) {
        // Generate signed URL for image
        const storagePath = asset.storage_path || asset.storagePath;
        try {
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('visual-assets')
            .createSignedUrl(storagePath, 3600);

          if (signedUrlError) {
            console.error(`[${requestId}] Error generating signed URL for ${assetId}:`, signedUrlError);
          } else if (signedUrlData?.signedUrl) {
            realVisualAssets.push({
              type: 'database-image',
              position: 'mid-body',
              html: renderVisualAssetImage(asset, signedUrlData.signedUrl),
              title: asset.title || 'Visual Asset'
            });
            console.log(`[${requestId}] ✅ Rendered image: ${asset.title || 'Untitled'}`);
          }
        } catch (urlError) {
          console.error(`[${requestId}] Exception generating signed URL:`, urlError);
        }
      } else {
        console.log(`[${requestId}] ⚠️ Skipping visual ${assetId.substring?.(0, 8) || 'unknown'}: no table data or storage path`);
      }
    }

    console.log(`[${requestId}] 📊 Generated ${realVisualAssets.length} database visual asset renderings`);

    // Combine all visualizations
    const allVisualizations = [...piVisualizations, ...realVisualAssets];

    // Process citations if provided
    /** @type {CitationData} */
    const citations = citationData || {};
    const referencesSection = formatReferencesSection(citations);

    // Add citation superscripts to body text
    const bodyWithCitations = addCitationSuperscripts(
      (parsedContent.body_paragraphs || [textContent.body]).join('\n\n'),
      citations
    );

    // Log citation processing result
    const supCount = (bodyWithCitations.match(/<sup>/gi) || []).length;
    console.log(`[${requestId}] 🔖 Superscripts added to body: ${supCount}`);

    parsedContent.body_paragraphs = bodyWithCitations.split('\n\n');

    // Assemble complete email with smart placement using EmailTemplateRenderer
    // Pass table placements from AI if available
    const emailHTML = assembleEmail(parsedContent, allVisualizations, textContent, selectedTemplate, referencesSection);

    // Calculate quality metrics with intelligence tracking
    const intelligenceReport = calculateQualityMetrics(parsedContent, piData, allVisualizations, citations);
    intelligenceReport.intelligenceUsed = intelligenceUsed;

    return new Response(
      JSON.stringify({
        success: true,
        emailHTML,
        intelligenceReport,
        metadata: {
          visualizationCount: allVisualizations.length,
          databaseVisualsCount: realVisualAssets.length,
          hasPI: !!piData,
          hasCitations: (citations.claimsUsed?.length || 0) + (citations.referencesUsed?.length || 0) > 0,
          citationMarkersInBody: supCount,
          contentLength: emailHTML.length,
          intelligenceLayersUsed: intelligenceUsed.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Smart email composition error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

/**
 * @param {any} context
 * @param {AudienceProfile} profile
 * @returns {string}
 */
function buildSystemPrompt(context, profile) {
  let systemPrompt = `You are an expert pharmaceutical content writer creating content for ${context.targetAudience || 'physician-specialist'} audiences.`;

  if (context.specialistType) {
    systemPrompt += ` SPECIALIST CONTEXT: You are writing for ${context.specialistDisplayName || context.specialistType} in ${context.therapeuticArea || 'medicine'}.`;
  }

  if (context.indication) {
    systemPrompt += ` INDICATION: ${context.indication}`;
  }

  systemPrompt += `\n\nCONTENT APPROACH:`;
  systemPrompt += `\n- LEAD WITH: ${profile.leadWith.join(', ')}`;
  systemPrompt += `\n- EMPHASIZE: ${profile.emphasize.join(', ')}`;
  systemPrompt += `\n- AVOID: ${profile.avoid.join(', ')}`;
  systemPrompt += `\n- STRUCTURE: ${profile.structure.join(' → ')}`;
  systemPrompt += `\n- TONE: ${profile.tone}`;
  systemPrompt += `\n- CLINICAL DEPTH: ${profile.depth}`;
  systemPrompt += `\n- TERMINOLOGY: ${profile.terminology}`;

  systemPrompt += `\n\nCITATION EMBEDDING RULES:
- When you mention clinical data, efficacy outcomes, or study results, embed the appropriate citation marker immediately after the relevant statement.
- Use the exact format [CLAIM:CML-XXXX] where CML-XXXX is the claim ID provided in the AVAILABLE CITATIONS section.
- Place markers at the END of sentences that make clinical claims, before the period.
- Only cite claims that are provided - do not invent citation IDs.
- Each body paragraph should have 1-2 citation markers if clinical claims are being made.`;

  systemPrompt += `\n\nREGULATORY COMPLIANCE: Maintain accurate, evidence-based claims. All clinical statements must be supportable with data. Include appropriate fair balance and safety information.`;

  return systemPrompt;
}

/**
 * @param {any} evidenceContext
 * @returns {string}
 */
function buildEvidenceContext(evidenceContext) {
  if (!evidenceContext) return '';
  let context = '\n\n### AVAILABLE EVIDENCE FROM LIBRARY\n';
  if (evidenceContext.claims?.length) {
    context += `\nClinical Claims: ${evidenceContext.claims.length} available`;
  }
  if (evidenceContext.references?.length) {
    context += `\nReferences: ${evidenceContext.references.length} available`;
  }
  if (evidenceContext.segments?.length) {
    context += `\nContent Segments: ${evidenceContext.segments.length} available`;
  }
  return context;
}

/**
 * @param {any} textContent
 * @param {any} piData
 * @param {any} context
 * @param {any} [evidenceContext]
 * @param {CitationData} [citationData]
 * @returns {string}
 */
function buildEnhancementPrompt(textContent, piData, context, evidenceContext, citationData) {
  let prompt = `Enhance this pharmaceutical email content for ${context.targetAudience || 'HCP'} audience.

CURRENT CONTENT:
Subject: ${textContent.subject}
Preheader: ${textContent.preheader || 'N/A'}
Headline: ${textContent.headline}
Body: ${textContent.body}
CTA: ${textContent.cta}
Disclaimer: ${textContent.disclaimer || 'N/A'}

CONTEXT:
- Therapeutic Area: ${context.therapeuticArea || 'General'}
- Indication: ${context.indication || 'General'}
- Market: ${context.market || 'US'}
- Regulatory Level: ${context.regulatoryLevel || 'standard'}
`;

  // Add AVAILABLE CITATIONS section for the AI to embed
  if (citationData?.claimsUsed?.length) {
    prompt += `\n\n### AVAILABLE CITATIONS (embed these in body text using [CLAIM:ID] format):\n`;
    citationData.claimsUsed.forEach((claim, i) => {
      const claimId = claim.claim_id_display || (claim.id ? `CML-${claim.id.substring(0, 4)}` : `CML-${i + 1}`);
      prompt += `\n${i + 1}. ${claimId}: "${claim.claim_text}"`;
      if (claim.claim_type) prompt += ` [Type: ${claim.claim_type}]`;
    });
    prompt += `\n\nIMPORTANT: When writing body paragraphs, embed [CLAIM:${citationData.claimsUsed[0]?.claim_id_display || 'CML-XXXX'}] markers at the end of sentences that are supported by these claims.`;
  }

  if (citationData?.referencesUsed?.length) {
    prompt += `\n\n### AVAILABLE REFERENCES:\n`;
    citationData.referencesUsed.forEach((ref, i) => {
      const refId = ref.reference_id_display || (ref.id ? `REF-${ref.id.substring(0, 4)}` : `REF-${i + 1}`);
      const citation = ref.formatted_citation || ref.reference_text || 'Reference';
      prompt += `\n${i + 1}. ${refId}: ${citation}`;
    });
  }

  if (piData) {
    prompt += `\n\nAVAILABLE CLINICAL DATA FROM PI:`;

    if (piData.clinicalTrialResults?.length > 0) {
      prompt += `\n\nClinical Trial Results:`;
      piData.clinicalTrialResults.forEach((trial, i) => {
        prompt += `\n${i + 1}. ${trial.study_name || 'Trial ' + (i+1)}: ${trial.description || ''}`;
        if (trial.primary_endpoint) prompt += `\n   Primary Endpoint: ${trial.primary_endpoint}`;
        if (trial.results) prompt += `\n   Results: ${trial.results}`;
      });
    }

    if (piData.efficacyData?.length > 0) {
      prompt += `\n\nEfficacy Data:`;
      piData.efficacyData.forEach((eff, i) => {
        prompt += `\n${i + 1}. ${eff.metric || 'Metric'}: ${eff.value || ''} ${eff.unit || ''}`;
        if (eff.confidence_interval) prompt += ` (CI: ${eff.confidence_interval})`;
        if (eff.p_value) prompt += ` (p=${eff.p_value})`;
      });
    }

    if (piData.safetyData?.length > 0) {
      prompt += `\n\nSafety Data:`;
      piData.safetyData.forEach((safety, i) => {
        prompt += `\n${i + 1}. ${safety.adverse_event || 'AE'}: ${safety.incidence || ''}`;
      });
    }

    if (piData.competitorComparison?.length > 0) {
      prompt += `\n\nCompetitor Comparison:`;
      piData.competitorComparison.forEach((comp, i) => {
        prompt += `\n${i + 1}. ${comp.competitor_name || 'Competitor'}: ${comp.comparison_metric || ''}`;
      });
    }

    if (piData.marketInsights) {
      prompt += `\n\nMarket Insights: ${JSON.stringify(piData.marketInsights, null, 2)}`;
    }
  }

  prompt += `\n\nTASK:
Enhance this content to be more compelling, evidence-based, and engaging.
Integrate the clinical data naturally into the narrative where it adds value.
Make the content professional, clear, and persuasive for the target audience.

CRITICAL: Embed [CLAIM:CML-XXXX] markers in body paragraphs where clinical claims support statements. Place markers at the END of sentences making clinical claims.

Also suggest table_placements if data tables would enhance understanding (specify after which paragraph index to place tables).`;

  // Add evidence context if provided
  if (evidenceContext) {
    prompt += buildEvidenceContext(evidenceContext);
  }

  return prompt;
}

/**
 * @param {any} piData
 * @returns {Promise<any[]>}
 */
async function generateVisualizations(piData) {
  /** @type {any[]} */
  const visualizations = [];

  if (!piData) return visualizations;

  // Generate clinical trial chart if data available
  if (piData.clinicalTrialResults?.length > 0) {
    visualizations.push({
      type: 'clinical-trial-chart',
      position: 'after-headline',
      html: generateTrialChart(piData.clinicalTrialResults),
      title: 'Clinical Trial Results'
    });
  }

  // Generate efficacy chart if data available
  if (piData.efficacyData?.length > 0) {
    visualizations.push({
      type: 'efficacy-chart',
      position: 'mid-body',
      html: generateEfficacyChart(piData.efficacyData),
      title: 'Efficacy Outcomes'
    });
  }

  // Generate safety table if data available
  if (piData.safetyData?.length > 0) {
    visualizations.push({
      type: 'safety-table',
      position: 'before-cta',
      html: generateSafetyTable(piData.safetyData),
      title: 'Safety Profile'
    });
  }

  // Generate competitor comparison chart if data available
  if (piData.competitorComparison?.length > 0) {
    visualizations.push({
      type: 'competitor-chart',
      position: 'mid-body',
      html: generateCompetitorChart(piData.competitorComparison),
      title: 'Competitive Landscape'
    });
  }

  // Generate market insights table if data available
  if (piData.marketInsights && Object.keys(piData.marketInsights).length > 0) {
    visualizations.push({
      type: 'market-insights-table',
      position: 'before-cta',
      html: generateMarketInsightsTable(piData.marketInsights),
      title: 'Market Insights'
    });
  }

  return visualizations;
}

/**
 * @param {any[]} trials
 * @returns {string}
 */
function generateTrialChart(trials) {
  const chartData = trials.slice(0, 3).map(trial => ({
    name: trial.study_name || trial.trial_id || 'Study',
    value: trial.response_rate || trial.efficacy_rate || 0
  }));

  return `
    <div style="background: linear-gradient(135deg, #f8f9fa, #f0f4f8); padding: 24px; margin: 20px 0; border-radius: 10px; border: 1px solid #e5e7eb;">
      <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 18px 0; font-weight: 600;">Clinical Trial Results</h3>
      <div style="display: flex; gap: 18px; align-items: flex-end; height: 180px;">
        ${chartData.map(item => `
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
            <div style="background: linear-gradient(135deg, #0066cc, #004499); width: 100%; height: ${Math.max(item.value, 10)}%; border-radius: 6px 6px 0 0; min-height: 25px; box-shadow: 0 2px 8px rgba(0,102,204,0.3);"></div>
            <div style="margin-top: 10px; font-size: 11px; color: #666; text-align: center; line-height: 1.3;">${item.name}</div>
            <div style="margin-top: 4px; font-size: 16px; font-weight: 700; color: #0066cc;">${item.value}%</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * @param {any[]} efficacyData
 * @returns {string}
 */
function generateEfficacyChart(efficacyData) {
  return `
    <div style="background: linear-gradient(135deg, #f0f7ff, #e8f4ff); padding: 24px; margin: 20px 0; border-radius: 10px; border-left: 4px solid #0066cc;">
      <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 18px 0; font-weight: 600;">Efficacy Outcomes</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px;">
        ${efficacyData.slice(0, 4).map(eff => `
          <div style="background: white; padding: 18px; border-radius: 8px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
            <div style="font-size: 28px; font-weight: 700; color: #0066cc;">${eff.value || 'N/A'}</div>
            <div style="font-size: 12px; color: #666; margin-top: 6px; line-height: 1.3;">${eff.metric || 'Metric'}</div>
            ${eff.p_value ? `<div style="font-size: 11px; color: #999; margin-top: 4px;">p=${eff.p_value}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * @param {any[]} safetyData
 * @returns {string}
 */
function generateSafetyTable(safetyData) {
  return `
    <div style="background: linear-gradient(135deg, #fff9f0, #fff5e6); padding: 24px; margin: 20px 0; border-radius: 10px; border-left: 4px solid #ff9900;">
      <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 18px 0; font-weight: 600;">Safety Profile</h3>
      <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 12px 15px; text-align: left; font-size: 12px; color: #666; border-bottom: 2px solid #eee; font-weight: 600;">Adverse Event</th>
            <th style="padding: 12px 15px; text-align: right; font-size: 12px; color: #666; border-bottom: 2px solid #eee; font-weight: 600;">Incidence</th>
          </tr>
        </thead>
        <tbody>
          ${safetyData.slice(0, 5).map((safety, i) => `
            <tr style="background: ${i % 2 === 0 ? 'white' : '#fafafa'};">
              <td style="padding: 12px 15px; font-size: 13px; color: #333; border-bottom: 1px solid #f0f0f0;">${safety.adverse_event || 'N/A'}</td>
              <td style="padding: 12px 15px; font-size: 13px; font-weight: 600; color: #333; text-align: right; border-bottom: 1px solid #f0f0f0;">${safety.incidence || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * @param {any[]} competitors
 * @returns {string}
 */
function generateCompetitorChart(competitors) {
  return `
    <div style="background: linear-gradient(135deg, #f5f0ff, #ede6ff); padding: 24px; margin: 20px 0; border-radius: 10px; border-left: 4px solid #6600cc;">
      <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 18px 0; font-weight: 600;">Competitive Landscape</h3>
      <div style="display: flex; gap: 18px; align-items: flex-end; height: 160px;">
        ${competitors.slice(0, 4).map(comp => {
          const value = comp.efficacy_value || comp.comparison_value || 50;
          return `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
              <div style="background: ${comp.is_our_product ? 'linear-gradient(135deg, #6600cc, #4400aa)' : '#d1d5db'}; width: 100%; height: ${value}%; border-radius: 6px 6px 0 0; min-height: 25px; box-shadow: ${comp.is_our_product ? '0 2px 8px rgba(102,0,204,0.3)' : 'none'};"></div>
              <div style="margin-top: 10px; font-size: 11px; color: #666; text-align: center;">${comp.competitor_name || 'Product'}</div>
              <div style="margin-top: 4px; font-size: 14px; font-weight: 700; color: ${comp.is_our_product ? '#6600cc' : '#666'};">${value}%</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/**
 * @param {any} insights
 * @returns {string}
 */
function generateMarketInsightsTable(insights) {
  const insightEntries = Object.entries(insights).slice(0, 5);

  return `
    <div style="background: linear-gradient(135deg, #f0fff4, #e6ffed); padding: 24px; margin: 20px 0; border-radius: 10px; border-left: 4px solid #00cc66;">
      <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 18px 0; font-weight: 600;">Market Insights</h3>
      <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
        <tbody>
          ${insightEntries.map(([key, value], i) => `
            <tr style="background: ${i % 2 === 0 ? 'white' : '#fafafa'};">
              <td style="padding: 12px 15px; font-size: 12px; color: #666; border-bottom: 1px solid #f0f0f0; width: 40%; text-transform: uppercase; font-weight: 500;">${key.replace(/_/g, ' ')}</td>
              <td style="padding: 12px 15px; font-size: 13px; font-weight: 500; color: #333; border-bottom: 1px solid #f0f0f0;">${value}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * @param {any} content
 * @param {any[]} visualizations
 * @param {any} originalContent
 * @param {string} templateId
 * @param {string} [referencesSection]
 * @returns {string}
 */
function assembleEmail(content, visualizations, originalContent, templateId, referencesSection) {
  /** @type {any[]} */
  const images = [];
  const visualizationComponents = visualizations
    .filter(v => v.type !== 'safety-table' && v.type !== 'market-insights-table' && v.type !== 'database-table')
    .map(viz => ({
      id: viz.type,
      type: viz.type,
      title: viz.title || viz.type.replace(/-/g, ' ').replace(/database/i, '').trim(),
      imageUrl: '',
      altText: `${viz.type} visualization`,
      captionHTML: viz.html
    }));

  // Extract table visualizations for the tables array with placement hints
  const tableVisualizations = visualizations.filter(v =>
    v.type === 'safety-table' || v.type === 'market-insights-table' || v.type === 'database-table'
  );

  // Use AI-suggested placements if available, otherwise use contextual placement
  const tablePlacements = content.table_placements || [];

  const tables = tableVisualizations.map((viz) => {
    // Try to find AI placement suggestion for this table
    const placement = tablePlacements.find((p) =>
      viz.title?.toLowerCase().includes(p.table_keyword?.toLowerCase()) ||
      viz.type?.toLowerCase().includes(p.table_keyword?.toLowerCase())
    );

    return {
      id: viz.type,
      title: viz.title || viz.type.replace(/-/g, ' ').replace(/table/i, '').replace(/database/i, '').trim(),
      tableHTML: viz.html,
      caption: '',
      footnotes: [],
      placementHint: placement ? `after_paragraph_${placement.after_paragraph}` : undefined
    };
  });

  /** @type {EmailComponents} */
  const emailComponents = {
    text: {
      subject: content.subject || originalContent.subject,
      preheader: content.preheader || originalContent.preheader || '',
      headline: content.headline || originalContent.headline,
      body: (content.body_paragraphs || [originalContent.body]).join('\n\n'),
      cta: content.cta || originalContent.cta,
      disclaimer: content.disclaimer || originalContent.disclaimer || 'Please see full Prescribing Information.'
    },
    visualizations: visualizationComponents,
    tables: tables,
    images: images,
    referencesSection: referencesSection || undefined
  };

  // Use the professional EmailTemplateRenderer with brand styling
  return EmailTemplateRenderer.render(templateId, emailComponents, {
    primaryColor: '#0066cc',
    secondaryColor: '#1a1a1a',
    fontFamily: "'Segoe UI', Arial, sans-serif"
  });
}

/**
 * @param {any} content
 * @param {any} piData
 * @param {any[]} visualizations
 * @param {CitationData} [citations]
 * @returns {any}
 */
function calculateQualityMetrics(content, piData, visualizations, citations) {
  const metrics = {
    contentScore: 0,
    evidenceScore: 0,
    complianceScore: 0,
    visualScore: 0,
    overallScore: 0,
    citationCount: 0
  };

  // Content quality score
  const bodyLength = (content.body_paragraphs || []).join(' ').length;
  metrics.contentScore = Math.min(100, Math.round((bodyLength / 800) * 100));

  // Evidence score based on PI data and citations
  let evidenceFactors = 0;
  if (piData?.clinicalTrialResults?.length > 0) evidenceFactors += 25;
  if (piData?.efficacyData?.length > 0) evidenceFactors += 25;
  if (piData?.safetyData?.length > 0) evidenceFactors += 20;
  if (citations?.claimsUsed?.length) {
    evidenceFactors += 15;
    metrics.citationCount += citations.claimsUsed.length;
  }
  if (citations?.referencesUsed?.length) {
    evidenceFactors += 15;
    metrics.citationCount += citations.referencesUsed.length;
  }
  metrics.evidenceScore = Math.min(100, evidenceFactors);

  // Compliance score (presence of required elements)
  let complianceFactors = 0;
  if (content.disclaimer) complianceFactors += 40;
  if (content.subject?.length <= 60) complianceFactors += 20;
  if (content.headline) complianceFactors += 20;
  if (content.cta) complianceFactors += 20;
  metrics.complianceScore = complianceFactors;

  // Visual score
  metrics.visualScore = Math.min(100, visualizations.length * 25);

  // Overall score
  metrics.overallScore = Math.round(
    (metrics.contentScore * 0.25) +
    (metrics.evidenceScore * 0.35) +
    (metrics.complianceScore * 0.25) +
    (metrics.visualScore * 0.15)
  );

  return metrics;
}