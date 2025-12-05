/**
 * Tagrisso (Osimertinib) Regulatory Templates
 * AstraZeneca - Oncology (NSCLC)
 * Brand ID: 5eabc763-b6c3-4214-b875-3d7cdea8f005
 * * Pre-approved regulatory templates for US, Germany, France, China markets
 * Total: 30 templates (10 per market × 3 markets)
 */

const TAGRISSO_BRAND_ID = '5eabc763-b6c3-4214-b875-3d7cdea8f005';

// ============= US MARKET TEMPLATES (5 templates) =============

export const tagrissoUSTemplates = [
  {
    id: 'tag-us-temp-001',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    templateType: 'email_subject',
    templateName: 'Professional Medical Information Email Subject',
    templateContent: 'Important Information About TAGRISSO® (osimertinib) for EGFR+ NSCLC',
    placeholders: [],
    mlrNumber: 'TAG-US-TEMP-001',
    approvalDate: '2024-01-20'
  },
  {
    id: 'tag-us-temp-002',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    templateType: 'email_greeting',
    templateName: 'Professional Greeting',
    templateContent: 'Dear Dr. {lastname},',
    placeholders: ['lastname'],
    mlrNumber: 'TAG-US-TEMP-002',
    approvalDate: '2024-01-20'
  },
  {
    id: 'tag-us-temp-003',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    templateType: 'email_closing',
    templateName: 'Professional Closing',
    templateContent: 'Sincerely,\n\nAstraZeneca Medical Information',
    placeholders: [],
    mlrNumber: 'TAG-US-TEMP-003',
    approvalDate: '2024-01-20'
  },
  {
    id: 'tag-us-temp-004',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    templateType: 'fair_balance',
    templateName: 'FDA-Compliant Fair Balance Block',
    templateContent: 'Important Safety Information: TAGRISSO can cause ILD/pneumonitis (fatal in <1%), QTc prolongation, cardiomyopathy, and embryo-fetal toxicity. Confirm EGFR mutation-positive status by FDA-approved test before initiating treatment. See full Prescribing Information for complete warnings, precautions, and adverse reactions. Report adverse events to FDA at 1-800-FDA-1088 or www.fda.gov/medwatch.',
    placeholders: [],
    mlrNumber: 'TAG-US-TEMP-004',
    approvalDate: '2024-01-20'
  },
  {
    id: 'tag-us-temp-005',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    templateType: 'contact_info',
    templateName: 'Medical Information Contact Block',
    templateContent: 'For medical information:\nPhone: 1-800-XXX-XXXX\nWebsite: www.tagrisso-us.com\nEmail: medinfo.us@astrazeneca.com\n\nTo report adverse events, contact AstraZeneca at 1-800-XXX-XXXX or FDA at 1-800-FDA-1088.',
    placeholders: [],
    mlrNumber: 'TAG-US-TEMP-005',
    approvalDate: '2024-01-20'
  }
];

// ============= GERMANY MARKET TEMPLATES (5 templates) =============

export const tagrissoGermanyTemplates = [
  {
    id: 'tag-de-temp-001',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    templateType: 'email_subject',
    templateName: 'Professioneller medizinischer Informations-E-Mail-Betreff',
    templateContent: 'Wichtige Informationen zu TAGRISSO® (Osimertinib) bei EGFR+ NSCLC',
    placeholders: [],
    mlrNumber: 'TAG-DE-TEMP-001',
    approvalDate: '2024-02-25'
  },
  {
    id: 'tag-de-temp-002',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    templateType: 'email_greeting',
    templateName: 'Professionelle Anrede',
    templateContent: 'Sehr geehrte Frau Dr. {lastname},\nSehr geehrter Herr Dr. {lastname},',
    placeholders: ['lastname'],
    mlrNumber: 'TAG-DE-TEMP-002',
    approvalDate: '2024-02-25'
  },
  {
    id: 'tag-de-temp-003',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    templateType: 'email_closing',
    templateName: 'Professioneller Abschluss',
    templateContent: 'Mit freundlichen Grüßen\n\nAstraZeneca Medizinische Information',
    placeholders: [],
    mlrNumber: 'TAG-DE-TEMP-003',
    approvalDate: '2024-02-25'
  },
  {
    id: 'tag-de-temp-004',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    templateType: 'fair_balance',
    templateName: 'EMA-konformer Fair-Balance-Block',
    templateContent: 'Wichtige Sicherheitsinformationen: TAGRISSO kann ILD/Pneumonitis (in <1% tödlich), QTc-Verlängerung, Kardiomyopathie und Embryo-Fetal-Toxizität verursachen. EGFR-Mutationsstatus vor Behandlungsbeginn bestätigen. Vollständige Fachinformation für vollständige Warnhinweise und Vorsichtsmaßnahmen beachten. Nebenwirkungen melden an BfArM oder medinfo.germany@astrazeneca.com.',
    placeholders: [],
    mlrNumber: 'TAG-DE-TEMP-004',
    approvalDate: '2024-02-25'
  },
  {
    id: 'tag-de-temp-005',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    templateType: 'contact_info',
    templateName: 'Medizinische Informationskontaktblock',
    templateContent: 'Für medizinische Informationen:\nTelefon: +49-XXX-XXX-XXXX\nWebsite: www.tagrisso.de\nE-Mail: medinfo.germany@astrazeneca.com\n\nNebenwirkungen melden: BfArM oder medinfo.germany@astrazeneca.com',
    placeholders: [],
    mlrNumber: 'TAG-DE-TEMP-005',
    approvalDate: '2024-02-25'
  }
];

// ============= FRANCE MARKET TEMPLATES (5 templates) =============

export const tagrissoFranceTemplates = [
  {
    id: 'tag-fr-temp-001',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    templateType: 'email_subject',
    templateName: 'Objet d\'e-mail d\'information médicale professionnelle',
    templateContent: 'Informations importantes concernant TAGRISSO® (osimertinib) pour CBNPC EGFR+',
    placeholders: [],
    mlrNumber: 'TAG-FR-TEMP-001',
    approvalDate: '2024-03-15'
  },
  {
    id: 'tag-fr-temp-002',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    templateType: 'email_greeting',
    templateName: 'Salutation professionnelle',
    templateContent: 'Cher Docteur {lastname},\nChère Docteure {lastname},',
    placeholders: ['lastname'],
    mlrNumber: 'TAG-FR-TEMP-002',
    approvalDate: '2024-03-15'
  },
  {
    id: 'tag-fr-temp-003',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    templateType: 'email_closing',
    templateName: 'Formule de politesse professionnelle',
    templateContent: 'Cordialement,\n\nInformation Médicale AstraZeneca',
    placeholders: [],
    mlrNumber: 'TAG-FR-TEMP-003',
    approvalDate: '2024-03-15'
  },
  {
    id: 'tag-fr-temp-004',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    templateType: 'fair_balance',
    templateName: 'Bloc d\'équilibre conforme EMA',
    templateContent: 'Informations de sécurité importantes : TAGRISSO peut provoquer une PID/pneumopathie (fatale dans <1% des cas), un allongement du QTc, une cardiomyopathie et une toxicité embryo-fœtale. Confirmer le statut mutationnel EGFR+ avant d\'initier le traitement. Consulter le RCP complet. Déclarer les effets indésirables à l\'ANSM ou medinfo.france@astrazeneca.com.',
    placeholders: [],
    mlrNumber: 'TAG-FR-TEMP-004',
    approvalDate: '2024-03-15'
  },
  {
    id: 'tag-fr-temp-005',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    templateType: 'contact_info',
    templateName: 'Bloc de contact d\'information médicale',
    templateContent: 'Pour toute information médicale :\nTéléphone : 01-XX-XX-XX-XX\nSite web : www.tagrisso.fr\nE-mail : medinfo.france@astrazeneca.com\n\nDéclaration des effets indésirables : ANSM ou medinfo.france@astrazeneca.com',
    placeholders: [],
    mlrNumber: 'TAG-FR-TEMP-005',
    approvalDate: '2024-03-15'
  }
];

// ============= CHINA MARKET TEMPLATES (5 templates) =============

export const tagrissochinaTemplates = [
  {
    id: 'tag-cn-temp-001',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    templateType: 'email_subject',
    templateName: '专业医学信息电子邮件主题',
    templateContent: '关于TAGRISSO®（奥希替尼）用于EGFR+非小细胞肺癌的重要信息',
    placeholders: [],
    mlrNumber: 'TAG-CN-TEMP-001',
    approvalDate: '2024-04-10'
  },
  {
    id: 'tag-cn-temp-002',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    templateType: 'email_greeting',
    templateName: '专业问候语',
    templateContent: '尊敬的{lastname}医生',
    placeholders: ['lastname'],
    mlrNumber: 'TAG-CN-TEMP-002',
    approvalDate: '2024-04-10'
  },
  {
    id: 'tag-cn-temp-003',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    templateType: 'email_closing',
    templateName: '专业结束语',
    templateContent: '顺颂医安\n\n阿斯利康医学信息部',
    placeholders: [],
    mlrNumber: 'TAG-CN-TEMP-003',
    approvalDate: '2024-04-10'
  },
  {
    id: 'tag-cn-temp-004',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    templateType: 'fair_balance',
    templateName: 'NMPA合规的公平平衡块',
    templateContent: '重要安全信息：TAGRISSO可引起ILD/肺炎（<1%致命）、QTc间期延长、心肌病和胚胎-胎儿毒性。治疗前确认EGFR突变阳性状态。请查阅完整说明书了解完整的警告和注意事项。不良反应报告：NMPA或medinfo.china@astrazeneca.com。',
    placeholders: [],
    mlrNumber: 'TAG-CN-TEMP-004',
    approvalDate: '2024-04-10'
  },
  {
    id: 'tag-cn-temp-005',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    templateType: 'contact_info',
    templateName: '医学信息联系方式块',
    templateContent: '医学信息咨询：\n电话：400-XXX-XXXX\n网站：www.tagrisso.com.cn\n电子邮箱：medinfo.china@astrazeneca.com\n\n不良反应报告：NMPA或medinfo.china@astrazeneca.com',
    placeholders: [],
    mlrNumber: 'TAG-CN-TEMP-005',
    approvalDate: '2024-04-10'
  }
];

/**
 * Helper function to get templates by market
 */
export const getTagrissoTemplatesByMarket = (market) => {
  const normalizedMarket = market.toUpperCase();
  
  switch (normalizedMarket) {
    case 'US':
      return tagrissoUSTemplates;
    case 'GERMANY':
    case 'DE':
      return [...tagrissoUSTemplates, ...tagrissoGermanyTemplates];
    case 'FRANCE':
    case 'FR':
      return [...tagrissoUSTemplates, ...tagrissoFranceTemplates];
    case 'CHINA':
    case 'CN':
      return [...tagrissoUSTemplates, ...tagrissochinaTemplates];
    default:
      console.warn(`[Tagrisso] No templates found for market: ${market}`);
      return tagrissoUSTemplates;
  }
};

/**
 * Get all templates across all markets
 */
export const getAllTagrissoTemplates = () => {
  return [
    ...tagrissoUSTemplates,
    ...tagrissoGermanyTemplates,
    ...tagrissoFranceTemplates,
    ...tagrissochinaTemplates
  ];
};