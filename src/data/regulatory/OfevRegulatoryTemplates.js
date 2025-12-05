/**
 * Ofev (Boehringer Ingelheim) - Regulatory Templates
 * Starter Pack: US and Germany Markets (10 templates)
 */

export const OfevRegulatoryTemplates = [
  // US Market - Email Templates (3 templates)
  {
    id: 'ofev-us-email-001',
    brandId: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
    market: 'US',
    templateType: 'email_subject',
    category: 'email',
    templateContent: 'New Clinical Data: OFEV® in {indication} Management',
    usageGuidelines: 'Use for HCP email communications about clinical updates. Replace {indication} with specific indication (e.g., "IPF" or "SSc-ILD").',
    placeholders: ['{indication}'],
    mlrNumber: 'MLR-OFEV-2024-US-TPL-001',
    approvalDate: '2024-01-10'
  },
  {
    id: 'ofev-us-email-002',
    brandId: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
    market: 'US',
    templateType: 'greeting',
    category: 'email',
    templateContent: 'Dear Dr. {last_name},',
    usageGuidelines: 'Standard greeting for US HCP emails. Replace {last_name} with physician surname.',
    placeholders: ['{last_name}'],
    mlrNumber: 'MLR-OFEV-2024-US-TPL-002',
    approvalDate: '2024-01-10'
  },
  {
    id: 'ofev-us-email-003',
    brandId: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
    market: 'US',
    templateType: 'closing',
    category: 'email',
    templateContent: 'Best regards,\n\n{sender_name}\n{title}\nBoehringer Ingelheim',
    usageGuidelines: 'Standard closing for US HCP emails. Replace {sender_name} and {title} with appropriate values.',
    placeholders: ['{sender_name}', '{title}'],
    mlrNumber: 'MLR-OFEV-2024-US-TPL-003',
    approvalDate: '2024-01-10'
  },

  // US Market - Regulatory Blocks (2 templates)
  {
    id: 'ofev-us-fair-001',
    brandId: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
    market: 'US',
    templateType: 'fair_balance',
    category: 'regulatory',
    templateContent: `IMPORTANT SAFETY INFORMATION

Most common adverse reactions (≥3% and more frequent than placebo):
• Diarrhea (62%)
• Nausea (24%)
• Abdominal pain (15%)
• Vomiting (12%)
• Liver enzyme elevation
• Decreased appetite
• Headache
• Weight decreased
• Hypertension

OFEV can cause fetal harm. Advise females of reproductive potential to avoid becoming pregnant while receiving OFEV.

Please see full Prescribing Information, including Patient Information.`,
    usageGuidelines: 'Required fair balance section for all US promotional materials. Must appear on same page/screen as efficacy claims.',
    mlrNumber: 'MLR-OFEV-2024-US-TPL-010',
    approvalDate: '2024-01-05'
  },
  {
    id: 'ofev-us-contact-001',
    brandId: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
    market: 'US',
    templateType: 'contact_block',
    category: 'regulatory',
    templateContent: `For Medical Information:
Call: 1-800-542-6257
Email: medinfo@boehringer-ingelheim.com
Visit: www.ofev.com

To report SUSPECTED ADVERSE REACTIONS, contact Boehringer Ingelheim Pharmaceuticals, Inc. at 1-800-542-6257 or FDA at 1-800-FDA-1088 or www.fda.gov/medwatch.`,
    usageGuidelines: 'Include at bottom of all HCP materials. Required for adverse event reporting compliance.',
    mlrNumber: 'MLR-OFEV-2024-US-TPL-020',
    approvalDate: '2023-12-15'
  },

  // Germany Market - Email Templates (3 templates)
  {
    id: 'ofev-de-email-001',
    brandId: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
    market: 'Germany',
    templateType: 'email_subject',
    category: 'email',
    templateContent: 'Wichtige medizinische Information: OFEV® bei {indication}',
    usageGuidelines: 'Für medizinische Fachkreise. Ersetzen Sie {indication} mit spezifischer Indikation (z.B. "IPF" oder "SSc-ILD").',
    placeholders: ['{indication}'],
    mlrNumber: 'MLR-OFEV-2024-DE-TPL-001',
    approvalDate: '2024-01-15'
  },
  {
    id: 'ofev-de-email-002',
    brandId: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
    market: 'Germany',
    templateType: 'greeting',
    category: 'email',
    templateContent: 'Sehr geehrte Frau Dr. {last_name}, / Sehr geehrter Herr Dr. {last_name},',
    usageGuidelines: 'Formale Anrede für deutsche medizinische Fachkreise. Wählen Sie "Frau Dr." oder "Herr Dr." entsprechend. Ersetzen Sie {last_name} mit Nachnamen.',
    placeholders: ['{last_name}'],
    mlrNumber: 'MLR-OFEV-2024-DE-TPL-002',
    approvalDate: '2024-01-15'
  },
  {
    id: 'ofev-de-email-003',
    brandId: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
    market: 'Germany',
    templateType: 'closing',
    category: 'email',
    templateContent: 'Mit freundlichen Grüßen\n\n{sender_name}\n{title}\nBoehringer Ingelheim Pharma GmbH & Co. KG',
    usageGuidelines: 'Formaler Abschluss für deutsche medizinische E-Mails. Ersetzen Sie {sender_name} und {title}.',
    placeholders: ['{sender_name}', '{title}'],
    mlrNumber: 'MLR-OFEV-2024-DE-TPL-003',
    approvalDate: '2024-01-15'
  },

  // Germany Market - Regulatory Blocks (2 templates)
  {
    id: 'ofev-de-fair-001',
    brandId: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
    market: 'Germany',
    templateType: 'fair_balance',
    category: 'regulatory',
    templateContent: `WICHTIGE SICHERHEITSINFORMATIONEN

Häufigste Nebenwirkungen (≥3% und häufiger als unter Placebo):
• Durchfall (62%)
• Übelkeit (24%)
• Bauchschmerzen (15%)
• Erbrechen (12%)
• Erhöhung der Leberenzyme
• Verminderter Appetit
• Kopfschmerzen
• Gewichtsabnahme
• Hypertonie

OFEV kann den Fötus schädigen. Frauen im gebärfähigen Alter sollten während der Behandlung mit OFEV eine Schwangerschaft vermeiden.

Bitte beachten Sie die vollständige Fachinformation (SmPC).`,
    usageGuidelines: 'Pflichtangabe für alle deutschen Werbematerialien. Muss auf derselben Seite wie Wirksamkeitsaussagen erscheinen.',
    mlrNumber: 'MLR-OFEV-2024-DE-TPL-010',
    approvalDate: '2024-01-18'
  },
  {
    id: 'ofev-de-contact-001',
    brandId: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
    market: 'Germany',
    templateType: 'contact_block',
    category: 'regulatory',
    templateContent: `Für medizinische Anfragen:
Telefon: +49 (0) 6132 77-0
E-Mail: medinfo.de@boehringer-ingelheim.com
Website: www.ofev.de

Zur Meldung von Nebenwirkungen kontaktieren Sie Boehringer Ingelheim Pharma GmbH & Co. KG unter +49 (0) 6132 77-0 oder das Bundesinstitut für Arzneimittel und Medizinprodukte (BfArM).`,
    usageGuidelines: 'Am Ende aller Materialien für medizinische Fachkreise. Erforderlich für Meldepflicht von Nebenwirkungen.',
    mlrNumber: 'MLR-OFEV-2024-DE-TPL-020',
    approvalDate: '2023-12-20'
  }
];

/**
 * Helper function to get templates by market
 */
export const getOfevTemplatesByMarket = (market) => {
  return OfevRegulatoryTemplates.filter(template => template.market === market);
};

/**
 * Helper function to get templates by type
 */
export const getOfevTemplatesByType = (market, templateType) => {
  return OfevRegulatoryTemplates.filter(
    template => template.market === market && template.templateType === templateType
  );
};

/**
 * Helper function to apply template with placeholder values
 */
export const applyOfevTemplate = (templateId, placeholderValues) => {
  const template = OfevRegulatoryTemplates.find(t => t.id === templateId);
  if (!template) return null;

  let content = template.templateContent;
  Object.entries(placeholderValues).forEach(([key, value]) => {
    content = content.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });

  return content;
};