// Dupixent (Sanofi - Immunology) Regulatory Templates for Glocalization
// Markets: US, Germany, France, China

const DUPIXENT_BRAND_ID = '84e0da48-116d-4810-aaaf-c13acb9bb4d8';

export const DupixentRegulatoryTemplates = [
  // ============================================================
  // US MARKET - 5 Regulatory Templates
  // ============================================================
  
  {
    id: 'dupixent-us-email-subj-001',
    brandId: DUPIXENT_BRAND_ID,
    market: 'US',
    templateType: 'email_subject',
    templateName: 'Professional Medical Information Email Subject',
    templateContent: 'Important Information About DUPIXENT® (dupilumab) – {therapeutic_context}',
    placeholders: ['therapeutic_context'],
    mlrNumber: 'DUP-US-TEMP-001',
    approvalDate: '2024-03-01',
    therapeuticArea: 'Immunology'
  },
  {
    id: 'dupixent-us-email-greet-001',
    brandId: DUPIXENT_BRAND_ID,
    market: 'US',
    templateType: 'email_greeting',
    templateName: 'Professional Healthcare Provider Greeting',
    templateContent: 'Dear Dr. {last_name},\n\nWe are writing to provide you with important medical information regarding DUPIXENT (dupilumab) for the treatment of moderate-to-severe atopic dermatitis.',
    placeholders: ['last_name'],
    mlrNumber: 'DUP-US-TEMP-002',
    approvalDate: '2024-03-01',
    therapeuticArea: 'Immunology'
  },
  {
    id: 'dupixent-us-email-close-001',
    brandId: DUPIXENT_BRAND_ID,
    market: 'US',
    templateType: 'email_closing',
    templateName: 'Professional Medical Information Closing',
    templateContent: 'If you have questions or would like additional information, please contact our Medical Information team at 1-844-DUPIXENT (1-844-387-4936) or visit www.dupixenthcp.com.\n\nSincerely,\nSanofi Medical Information',
    mlrNumber: 'DUP-US-TEMP-003',
    approvalDate: '2024-03-01',
    therapeuticArea: 'Immunology'
  },
  {
    id: 'dupixent-us-fair-bal-001',
    brandId: DUPIXENT_BRAND_ID,
    market: 'US',
    templateType: 'fair_balance',
    templateName: 'FDA-Compliant Fair Balance Block',
    templateContent: 'INDICATION: DUPIXENT is indicated for the treatment of patients aged 6 months and older with moderate-to-severe atopic dermatitis whose disease is not adequately controlled with topical prescription therapies or when those therapies are not advisable.\n\nIMPORTANT SAFETY INFORMATION: Do not use if you are allergic to dupilumab or any ingredients in DUPIXENT. The most common side effects include injection site reactions, conjunctivitis, blepharitis, oral herpes, keratitis, eye pruritus, and dry eye. Tell your healthcare provider if you experience eye problems or symptoms of allergic reaction.\n\nPlease see full Prescribing Information at www.dupixenthcp.com.',
    mlrNumber: 'DUP-US-TEMP-004',
    approvalDate: '2024-03-05',
    therapeuticArea: 'Immunology'
  },
  {
    id: 'dupixent-us-contact-001',
    brandId: DUPIXENT_BRAND_ID,
    market: 'US',
    templateType: 'contact_info',
    templateName: 'US Medical Information Contact Block',
    templateContent: 'FOR MEDICAL INFORMATION:\nPhone: 1-844-DUPIXENT (1-844-387-4936)\nEmail: medinfo@sanofi.com\nWebsite: www.dupixenthcp.com\n\nTO REPORT ADVERSE EVENTS:\nPhone: 1-800-633-1610\nFDA MedWatch: 1-800-FDA-1088 or www.fda.gov/medwatch',
    mlrNumber: 'DUP-US-TEMP-005',
    approvalDate: '2024-03-05',
    therapeuticArea: 'Immunology'
  },

  // ============================================================
  // GERMANY MARKET - 5 Regulatory Templates
  // ============================================================
  
  {
    id: 'dupixent-de-email-subj-001',
    brandId: DUPIXENT_BRAND_ID,
    market: 'Germany',
    templateType: 'email_subject',
    templateName: 'Professionelle Medizinische Information E-Mail-Betreff',
    templateContent: 'Wichtige Informationen zu DUPIXENT® (Dupilumab) – {therapeutic_context}',
    placeholders: ['therapeutic_context'],
    mlrNumber: 'DUP-DE-TEMP-001',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Immunologie'
  },
  {
    id: 'dupixent-de-email-greet-001',
    brandId: DUPIXENT_BRAND_ID,
    market: 'Germany',
    templateType: 'email_greeting',
    templateName: 'Professionelle Anrede für Ärzte',
    templateContent: 'Sehr geehrte Frau Dr. {last_name} / Sehr geehrter Herr Dr. {last_name},\n\nwir möchten Ihnen wichtige medizinische Informationen zu DUPIXENT (Dupilumab) zur Behandlung der mittelschweren bis schweren atopischen Dermatitis zur Verfügung stellen.',
    placeholders: ['last_name'],
    mlrNumber: 'DUP-DE-TEMP-002',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Immunologie'
  },
  {
    id: 'dupixent-de-email-close-001',
    brandId: DUPIXENT_BRAND_ID,
    market: 'Germany',
    templateType: 'email_closing',
    templateName: 'Professioneller Abschluss Medizinische Information',
    templateContent: 'Für weitere Informationen oder bei Rückfragen steht Ihnen unser Medizinischer Informationsdienst gerne zur Verfügung:\nTelefon: +49 (0) 69 305 7087\nE-Mail: medinfo.de@sanofi.com\nWebsite: www.dupixent.de\n\nMit freundlichen Grüßen\nSanofi Medical Information Deutschland',
    mlrNumber: 'DUP-DE-TEMP-003',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Immunologie'
  },
  {
    id: 'dupixent-de-fair-bal-001',
    brandId: DUPIXENT_BRAND_ID,
    market: 'Germany',
    templateType: 'fair_balance',
    templateName: 'EMA/BfArM-konformer Pflichttext',
    templateContent: 'INDIKATION: DUPIXENT ist indiziert zur Behandlung von Patienten ab 6 Monaten mit mittelschwerer bis schwerer atopischer Dermatitis, die für eine systemische Therapie in Frage kommen.\n\nWICHTIGE SICHERHEITSINFORMATIONEN: DUPIXENT darf nicht angewendet werden bei Überempfindlichkeit gegen Dupilumab oder einen der sonstigen Bestandteile. Die häufigsten Nebenwirkungen sind Reaktionen an der Injektionsstelle, Konjunktivitis, Blepharitis, Herpes labialis, Keratitis, Augenpruritus und trockene Augen. Informieren Sie Ihren Arzt bei Augenproblemen oder Anzeichen einer allergischen Reaktion.\n\nBitte beachten Sie die vollständige Fachinformation unter www.dupixent.de.',
    mlrNumber: 'DUP-DE-TEMP-004',
    approvalDate: '2024-03-12',
    therapeuticArea: 'Immunologie'
  },
  {
    id: 'dupixent-de-contact-001',
    brandId: DUPIXENT_BRAND_ID,
    market: 'Germany',
    templateType: 'contact_info',
    templateName: 'Deutsche Kontaktinformationen Medizinische Information',
    templateContent: 'MEDIZINISCHE INFORMATION:\nTelefon: +49 (0) 69 305 7087\nE-Mail: medinfo.de@sanofi.com\nWebsite: www.dupixent.de\n\nMELDUNG VON NEBENWIRKUNGEN:\nBfArM (Bundesinstitut für Arzneimittel und Medizinprodukte)\nKurt-Georg-Kiesinger-Allee 3, 53175 Bonn\nWebsite: www.bfarm.de\nE-Mail: pharmakovigilanz@bfarm.de',
    mlrNumber: 'DUP-DE-TEMP-005',
    approvalDate: '2024-03-12',
    therapeuticArea: 'Immunologie'
  }
];

/**
 * Helper function to get Dupixent templates by market
 */
export function getDupixentTemplatesByMarket(market) {
  return DupixentRegulatoryTemplates.filter(template => template.market === market);
}

export function getDupixentTemplatesByType(
  market, 
  templateType
) {
  return DupixentRegulatoryTemplates.filter(
    template => template.market === market && template.templateType === templateType
  );
}

export function applyDupixentTemplate(
  templateId, 
  placeholderValues
) {
  const template = DupixentRegulatoryTemplates.find(t => t.id === templateId);
  if (!template) return '';

  let content = template.templateContent;
  if (template.placeholders) {
    template.placeholders.forEach(placeholder => {
      const value = placeholderValues[placeholder] || `{${placeholder}}`;
      content = content.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value);
    });
  }
  return content;
}