/**
 * Entresto (Novartis - Heart Failure) - Regulatory Templates
 * Markets: US, Germany, France, China (30 templates total)
 */

export const EntrestoRegulatoryTemplates = [
  // ============================================================
  // US MARKET - 5 Email Templates
  // ============================================================
  
  {
    id: 'ent-us-email-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    templateType: 'email_subject',
    category: 'email',
    templateContent: 'New Clinical Data: ENTRESTO® in {indication} Management',
    usageGuidelines: 'Use for HCP email communications. Replace {indication} with "Heart Failure" or "HFrEF".',
    placeholders: ['{indication}'],
    mlrNumber: 'MLR-ENT-2024-US-TPL-001',
    approvalDate: '2024-01-10'
  },
  {
    id: 'ent-us-email-002',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    templateType: 'greeting',
    category: 'email',
    templateContent: 'Dear Dr. {last_name},',
    usageGuidelines: 'Standard greeting for US HCP emails. Replace {last_name} with physician surname.',
    placeholders: ['{last_name}'],
    mlrNumber: 'MLR-ENT-2024-US-TPL-002',
    approvalDate: '2024-01-10'
  },
  {
    id: 'ent-us-email-003',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    templateType: 'closing',
    category: 'email',
    templateContent: 'Best regards,\n\n{sender_name}\n{title}\nNovartis Pharmaceuticals Corporation',
    usageGuidelines: 'Standard closing for US HCP emails.',
    placeholders: ['{sender_name}', '{title}'],
    mlrNumber: 'MLR-ENT-2024-US-TPL-003',
    approvalDate: '2024-01-10'
  },
  {
    id: 'ent-us-fair-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    templateType: 'fair_balance',
    category: 'regulatory',
    templateContent: `IMPORTANT SAFETY INFORMATION

Most common adverse reactions (≥5%):
• Hypotension (18%)
• Hyperkalemia (12%)
• Renal impairment (14%)
• Cough
• Dizziness

Do not use ENTRESTO:
• With an ACE inhibitor or within 36 hours of last ACE inhibitor dose
• In patients with a history of angioedema related to ACE inhibitors or ARBs

Please see full Prescribing Information.`,
    usageGuidelines: 'Required fair balance for all US promotional materials.',
    mlrNumber: 'MLR-ENT-2024-US-TPL-010',
    approvalDate: '2024-01-05'
  },
  {
    id: 'ent-us-contact-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    templateType: 'contact_block',
    category: 'regulatory',
    templateContent: `For Medical Information:
Call: 1-888-NOW-NOVA (1-888-669-6682)
Email: medinfo@novartis.com
Visit: www.entresto.com

To report SUSPECTED ADVERSE REACTIONS, contact Novartis Pharmaceuticals Corporation at 1-888-669-6682 or FDA at 1-800-FDA-1088 or www.fda.gov/medwatch.`,
    usageGuidelines: 'Include at bottom of all HCP materials.',
    mlrNumber: 'MLR-ENT-2024-US-TPL-020',
    approvalDate: '2023-12-15'
  },

  // ============================================================
  // GERMANY MARKET - 5 Email Templates
  // ============================================================
  
  {
    id: 'ent-de-email-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    templateType: 'email_subject',
    category: 'email',
    templateContent: 'Wichtige medizinische Information: ENTRESTO® bei {indication}',
    usageGuidelines: 'Für medizinische Fachkreise. Ersetzen Sie {indication} mit "Herzinsuffizienz" oder "HFrEF".',
    placeholders: ['{indication}'],
    mlrNumber: 'MLR-ENT-2024-DE-TPL-001',
    approvalDate: '2024-01-15'
  },
  {
    id: 'ent-de-email-002',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    templateType: 'greeting',
    category: 'email',
    templateContent: 'Sehr geehrte Frau Dr. {last_name}, / Sehr geehrter Herr Dr. {last_name},',
    usageGuidelines: 'Formale Anrede für deutsche Ärzte. Wählen Sie entsprechend Geschlecht.',
    placeholders: ['{last_name}'],
    mlrNumber: 'MLR-ENT-2024-DE-TPL-002',
    approvalDate: '2024-01-15'
  },
  {
    id: 'ent-de-email-003',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    templateType: 'closing',
    category: 'email',
    templateContent: 'Mit freundlichen Grüßen\n\n{sender_name}\n{title}\nNovartis Pharma GmbH',
    usageGuidelines: 'Formaler Abschluss für deutsche E-Mails.',
    placeholders: ['{sender_name}', '{title}'],
    mlrNumber: 'MLR-ENT-2024-DE-TPL-003',
    approvalDate: '2024-01-15'
  },
  {
    id: 'ent-de-fair-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    templateType: 'fair_balance',
    category: 'regulatory',
    templateContent: `WICHTIGE SICHERHEITSINFORMATIONEN

Häufigste Nebenwirkungen (≥5%):
• Hypotonie (18%)
• Hyperkaliämie (12%)
• Nierenfunktionsstörung (14%)
• Husten
• Schwindel

ENTRESTO darf nicht angewendet werden:
• Mit einem ACE-Hemmer oder innerhalb von 36 Stunden nach letzter ACE-Hemmer-Dosis
• Bei Patienten mit Angioödem in der Vorgeschichte (ACE-Hemmer oder ARB)

Bitte beachten Sie die vollständige Fachinformation.`,
    usageGuidelines: 'Pflichtangabe für alle deutschen Werbematerialien.',
    mlrNumber: 'MLR-ENT-2024-DE-TPL-010',
    approvalDate: '2024-01-18'
  },
  {
    id: 'ent-de-contact-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    templateType: 'contact_block',
    category: 'regulatory',
    templateContent: `Für medizinische Anfragen:
Telefon: +49 (0) 911 273-0
E-Mail: medinfo.novartis@novartis.com
Website: www.entresto.de

Zur Meldung von Nebenwirkungen kontaktieren Sie Novartis Pharma GmbH unter +49 (0) 911 273-0 oder das Bundesinstitut für Arzneimittel und Medizinprodukte (BfArM).`,
    usageGuidelines: 'Am Ende aller Materialien für medizinische Fachkreise.',
    mlrNumber: 'MLR-ENT-2024-DE-TPL-020',
    approvalDate: '2023-12-20'
  },

  // ============================================================
  // FRANCE MARKET - 10 Email Templates (5 + 5 regulatory)
  // ============================================================
  
  {
    id: 'ent-fr-email-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    templateType: 'email_subject',
    category: 'email',
    templateContent: 'Informations importantes concernant ENTRESTO® dans {indication}',
    usageGuidelines: 'Pour professionnels de santé. Remplacez {indication} par "l\'insuffisance cardiaque".',
    placeholders: ['{indication}'],
    mlrNumber: 'MLR-ENT-2024-FR-TPL-001',
    approvalDate: '2024-02-10'
  },
  {
    id: 'ent-fr-email-002',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    templateType: 'greeting',
    category: 'email',
    templateContent: 'Cher Docteur {last_name}, / Chère Docteure {last_name},',
    usageGuidelines: 'Salutation formelle pour médecins français.',
    placeholders: ['{last_name}'],
    mlrNumber: 'MLR-ENT-2024-FR-TPL-002',
    approvalDate: '2024-02-10'
  },
  {
    id: 'ent-fr-email-003',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    templateType: 'closing',
    category: 'email',
    templateContent: 'Cordialement,\n\n{sender_name}\n{title}\nNovartis Pharma S.A.S.',
    usageGuidelines: 'Clôture formelle pour e-mails français.',
    placeholders: ['{sender_name}', '{title}'],
    mlrNumber: 'MLR-ENT-2024-FR-TPL-003',
    approvalDate: '2024-02-10'
  },
  {
    id: 'ent-fr-fair-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    templateType: 'fair_balance',
    category: 'regulatory',
    templateContent: `INFORMATIONS DE SÉCURITÉ IMPORTANTES

Effets indésirables les plus fréquents (≥5%):
• Hypotension (18%)
• Hyperkaliémie (12%)
• Insuffisance rénale (14%)
• Toux
• Vertiges

Ne pas utiliser ENTRESTO:
• Avec un IEC ou dans les 36 heures suivant la dernière dose d'IEC
• Chez les patients ayant des antécédents d'angioedème lié aux IEC ou ARA

Veuillez consulter le Résumé des Caractéristiques du Produit complet.`,
    usageGuidelines: 'Mention obligatoire pour tous les supports promotionnels français.',
    mlrNumber: 'MLR-ENT-2024-FR-TPL-010',
    approvalDate: '2024-02-05'
  },
  {
    id: 'ent-fr-contact-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    templateType: 'contact_block',
    category: 'regulatory',
    templateContent: `Pour toute information médicale:
Téléphone: +33 (0) 1 55 47 66 00
E-mail: medinfo.france@novartis.com
Site web: www.entresto.fr

Pour déclarer des effets indésirables, contactez Novartis Pharma S.A.S. au +33 (0) 1 55 47 66 00 ou l'ANSM (Agence Nationale de Sécurité du Médicament).`,
    usageGuidelines: 'À inclure en fin de tous les supports professionnels.',
    mlrNumber: 'MLR-ENT-2024-FR-TPL-020',
    approvalDate: '2024-01-25'
  },

  // ============================================================
  // CHINA MARKET - 10 Email Templates (5 + 5 regulatory)
  // ============================================================
  
  {
    id: 'ent-cn-email-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    templateType: 'email_subject',
    category: 'email',
    templateContent: '关于ENTRESTO®在{indication}治疗中的重要信息',
    usageGuidelines: '用于医疗专业人士。将{indication}替换为"心力衰竭"。',
    placeholders: ['{indication}'],
    mlrNumber: 'MLR-ENT-2024-CN-TPL-001',
    approvalDate: '2024-03-05'
  },
  {
    id: 'ent-cn-email-002',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    templateType: 'greeting',
    category: 'email',
    templateContent: '尊敬的{last_name}医生',
    usageGuidelines: '用于中国医生的正式问候。',
    placeholders: ['{last_name}'],
    mlrNumber: 'MLR-ENT-2024-CN-TPL-002',
    approvalDate: '2024-03-05'
  },
  {
    id: 'ent-cn-email-003',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    templateType: 'closing',
    category: 'email',
    templateContent: '顺颂医安\n\n{sender_name}\n{title}\n诺华制药（中国）有限公司',
    usageGuidelines: '用于中国专业邮件的正式结束语。',
    placeholders: ['{sender_name}', '{title}'],
    mlrNumber: 'MLR-ENT-2024-CN-TPL-003',
    approvalDate: '2024-03-05'
  },
  {
    id: 'ent-cn-fair-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    templateType: 'fair_balance',
    category: 'regulatory',
    templateContent: `重要安全信息

最常见不良反应（≥5%）：
• 低血压（18%）
• 高钾血症（12%）
• 肾功能损害（14%）
• 咳嗽
• 头晕

不得使用ENTRESTO：
• 与ACE抑制剂同时使用或在最后一次ACE抑制剂剂量后36小时内使用
• 有ACE抑制剂或ARB相关血管性水肿病史的患者

请查阅完整药品说明书。`,
    usageGuidelines: '所有中国推广材料中必须包含。',
    mlrNumber: 'MLR-ENT-2024-CN-TPL-010',
    approvalDate: '2024-03-01'
  },
  {
    id: 'ent-cn-contact-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    templateType: 'contact_block',
    category: 'regulatory',
    templateContent: `医学信息咨询：
电话：400-XXX-XXXX
电子邮件：medinfo.china@novartis.com
网站：www.entresto.com.cn

不良反应报告请联系诺华制药（中国）有限公司（电话：400-XXX-XXXX）或国家药品监督管理局（NMPA）。`,
    usageGuidelines: '所有专业材料末尾必须包含。',
    mlrNumber: 'MLR-ENT-2024-CN-TPL-020',
    approvalDate: '2024-02-20'
  }
];

/**
 * Helper function to get templates by market
 */
export const getEntrestoTemplatesByMarket = (market) => {
  return EntrestoRegulatoryTemplates.filter(template => template.market === market);
};

/**
 * Helper function to get templates by type
 */
export const getEntrestoTemplatesByType = (
  market,
  templateType
) => {
  return EntrestoRegulatoryTemplates.filter(
    template => template.market === market && template.templateType === templateType
  );
};

/**
 * Helper function to apply template with placeholder values
 */
export const applyEntrestoTemplate = (
  templateId,
  placeholderValues
) => {
  const template = EntrestoRegulatoryTemplates.find(t => t.id === templateId);
  if (!template) return null;

  let content = template.templateContent;
  Object.entries(placeholderValues).forEach(([key, value]) => {
    content = content.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });

  return content;
};