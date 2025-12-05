// Erbitux (Merck KGaA - Oncology) Regulatory Templates
// Markets: US, Germany (France, China follow similar pattern)

const ERBITUX_BRAND_ID = '1f0c5da1-f567-4c20-8830-e0d3565be0d7';

export const ErbituxRegulatoryTemplates = [
  // US MARKET (5 templates)
  {
    id: 'erb-us-email-subj-001',
    brandId: ERBITUX_BRAND_ID,
    market: 'US',
    templateType: 'email_subject',
    templateName: 'Professional Medical Information Email Subject',
    templateContent: 'Important Information About ERBITUX® (cetuximab) – {therapeutic_context}',
    placeholders: ['therapeutic_context'],
    mlrNumber: 'ERB-US-TEMP-001',
    approvalDate: '2024-03-01',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-email-greet-001',
    brandId: ERBITUX_BRAND_ID,
    market: 'US',
    templateType: 'email_greeting',
    templateName: 'Professional Oncologist Greeting',
    templateContent: 'Dear Dr. {last_name},\n\nWe are writing to provide you with important medical information regarding ERBITUX (cetuximab) for the treatment of RAS wild-type metastatic colorectal cancer.',
    placeholders: ['last_name'],
    mlrNumber: 'ERB-US-TEMP-002',
    approvalDate: '2024-03-01',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-email-close-001',
    brandId: ERBITUX_BRAND_ID,
    market: 'US',
    templateType: 'email_closing',
    templateName: 'Professional Medical Information Closing',
    templateContent: 'If you have questions or would like additional information, please contact our Medical Affairs team at 1-800-395-3376 or visit www.erbitux.com.\n\nSincerely,\nMerck KGaA Medical Information',
    mlrNumber: 'ERB-US-TEMP-003',
    approvalDate: '2024-03-01',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fair-bal-001',
    brandId: ERBITUX_BRAND_ID,
    market: 'US',
    templateType: 'fair_balance',
    templateName: 'FDA-Compliant Fair Balance Block',
    templateContent: 'INDICATION: ERBITUX is indicated for treating RAS wild-type, EGFR-expressing metastatic colorectal cancer.\n\nIMPORTANT SAFETY INFORMATION: Do not use in patients with RAS mutations. Serious infusion reactions (3%) and skin reactions may occur. Interrupt for severe infusion reactions. Monitor for hypomagnesemia, electrolyte abnormalities, and cardiopulmonary arrest.\n\nPlease see full Prescribing Information at www.erbitux.com.',
    mlrNumber: 'ERB-US-TEMP-004',
    approvalDate: '2024-03-05',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-contact-001',
    brandId: ERBITUX_BRAND_ID,
    market: 'US',
    templateType: 'contact_info',
    templateName: 'US Medical Information Contact Block',
    templateContent: 'FOR MEDICAL INFORMATION:\nPhone: 1-800-395-3376\nEmail: service@emdserono.com\nWebsite: www.erbitux.com\n\nTO REPORT ADVERSE EVENTS:\nPhone: 1-800-395-3376\nFDA MedWatch: 1-800-FDA-1088',
    mlrNumber: 'ERB-US-TEMP-005',
    approvalDate: '2024-03-05',
    therapeuticArea: 'Oncology'
  },

  // GERMANY MARKET (5 templates)
  {
    id: 'erb-de-email-subj-001',
    brandId: ERBITUX_BRAND_ID,
    market: 'Germany',
    templateType: 'email_subject',
    templateName: 'Professionelle Medizinische Information E-Mail-Betreff',
    templateContent: 'Wichtige Informationen zu ERBITUX® (Cetuximab) – {therapeutic_context}',
    placeholders: ['therapeutic_context'],
    mlrNumber: 'ERB-DE-TEMP-001',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Onkologie'
  },
  {
    id: 'erb-de-email-greet-001',
    brandId: ERBITUX_BRAND_ID,
    market: 'Germany',
    templateType: 'email_greeting',
    templateName: 'Professionelle Anrede für Onkologen',
    templateContent: 'Sehr geehrte Frau Dr. {last_name} / Sehr geehrter Herr Dr. {last_name},\n\nwir möchten Ihnen wichtige medizinische Informationen zu ERBITUX (Cetuximab) zur Behandlung des RAS-Wildtyp metastasierten kolorektalen Karzinoms zur Verfügung stellen.',
    placeholders: ['last_name'],
    mlrNumber: 'ERB-DE-TEMP-002',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Onkologie'
  },
  {
    id: 'erb-de-email-close-001',
    brandId: ERBITUX_BRAND_ID,
    market: 'Germany',
    templateType: 'email_closing',
    templateName: 'Professioneller Abschluss Medizinische Information',
    templateContent: 'Für weitere Informationen steht Ihnen unser Medizinischer Informationsdienst zur Verfügung:\nTelefon: +49 (0) 6151 72 5200\nE-Mail: service@merckgroup.com\nWebsite: www.erbitux.de\n\nMit freundlichen Grüßen\nMerck Medical Information Deutschland',
    mlrNumber: 'ERB-DE-TEMP-003',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Onkologie'
  },
  {
    id: 'erb-de-fair-bal-001',
    brandId: ERBITUX_BRAND_ID,
    market: 'Germany',
    templateType: 'fair_balance',
    templateName: 'EMA/BfArM-konformer Pflichttext',
    templateContent: 'INDIKATION: ERBITUX ist indiziert zur Behandlung von RAS-Wildtyp, EGFR-exprimierendem metastasiertem kolorektalem Karzinom.\n\nWICHTIGE SICHERHEITSINFORMATIONEN: Nicht anwenden bei RAS-Mutationen. Schwere Infusionsreaktionen (3%) und Hautreaktionen können auftreten. Bei schweren Reaktionen Behandlung unterbrechen. Überwachung auf Hypomagnesiämie und Elektrolytstörungen erforderlich.\n\nBitte beachten Sie die vollständige Fachinformation unter www.erbitux.de.',
    mlrNumber: 'ERB-DE-TEMP-004',
    approvalDate: '2024-03-12',
    therapeuticArea: 'Onkologie'
  },
  {
    id: 'erb-de-contact-001',
    brandId: ERBITUX_BRAND_ID,
    market: 'Germany',
    templateType: 'contact_info',
    templateName: 'Deutsche Kontaktinformationen Medizinische Information',
    templateContent: 'MEDIZINISCHE INFORMATION:\nTelefon: +49 (0) 6151 72 5200\nE-Mail: service@merckgroup.com\nWebsite: www.erbitux.de\n\nMELDUNG VON NEBENWIRKUNGEN:\nBfArM\nKurt-Georg-Kiesinger-Allee 3, 53175 Bonn\nWebsite: www.bfarm.de',
    mlrNumber: 'ERB-DE-TEMP-005',
    approvalDate: '2024-03-12',
    therapeuticArea: 'Onkologie'
  }
];

/**
 * Helper function to get Erbitux templates by market
 */
export function getErbituxTemplatesByMarket(market) {
  return ErbituxRegulatoryTemplates.filter(template => template.market === market);
}

export function getErbituxTemplatesByType(
  market,
  templateType
) {
  return ErbituxRegulatoryTemplates.filter(
    template => template.market === market && template.templateType === templateType
  );
}

export function applyErbituxTemplate(
  templateId,
  placeholderValues
) {
  const template = ErbituxRegulatoryTemplates.find(t => t.id === templateId);
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