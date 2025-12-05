/**
 * Xarelto (Rivaroxaban) Regulatory Templates
 * Bayer - Cardiovascular (Anticoagulation)
 * Brand ID: 6e3716b1-5930-4858-8346-b42501ea9f6b
 * * Pre-approved regulatory templates for US, Germany, France, China markets
 * Total: 30 templates (10 per market × 3 markets)
 */

const XARELTO_BRAND_ID = '6e3716b1-5930-4858-8346-b42501ea9f6b';

// ============= US MARKET TEMPLATES (5 templates) =============

export const xareltoUSTemplates = [
  {
    id: 'xar-us-temp-001',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    templateType: 'email_subject',
    templateName: 'Professional Medical Information Email Subject',
    templateContent: 'Important Information About XARELTO® (rivaroxaban) for {therapeutic_context}',
    placeholders: ['therapeutic_context'],
    mlrNumber: 'XAR-US-TEMP-001',
    approvalDate: '2024-01-15'
  },
  {
    id: 'xar-us-temp-002',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    templateType: 'email_greeting',
    templateName: 'Professional Greeting',
    templateContent: 'Dear Dr. {lastname},',
    placeholders: ['lastname'],
    mlrNumber: 'XAR-US-TEMP-002',
    approvalDate: '2024-01-15'
  },
  {
    id: 'xar-us-temp-003',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    templateType: 'email_closing',
    templateName: 'Professional Closing',
    templateContent: 'Sincerely,\n\nBayer Medical Information',
    placeholders: [],
    mlrNumber: 'XAR-US-TEMP-003',
    approvalDate: '2024-01-15'
  },
  {
    id: 'xar-us-temp-004',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    templateType: 'fair_balance',
    templateName: 'FDA-Compliant Fair Balance Block',
    templateContent: 'Important Safety Information: XARELTO can cause serious bleeding which can be fatal. Promptly evaluate signs or symptoms of blood loss. Do not use XARELTO in patients with active pathological hemorrhage. See full Prescribing Information for complete warnings, precautions, and adverse reactions. Report adverse events to FDA at 1-800-FDA-1088 or www.fda.gov/medwatch.',
    placeholders: [],
    mlrNumber: 'XAR-US-TEMP-004',
    approvalDate: '2024-01-15'
  },
  {
    id: 'xar-us-temp-005',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    templateType: 'contact_info',
    templateName: 'Medical Information Contact Block',
    templateContent: 'For medical information:\nPhone: 1-888-XXX-XXXX\nWebsite: www.xarelto-us.com\nEmail: medinfo.us@bayer.com\n\nTo report adverse events, contact Bayer at 1-888-XXX-XXXX or FDA at 1-800-FDA-1088.',
    placeholders: [],
    mlrNumber: 'XAR-US-TEMP-005',
    approvalDate: '2024-01-15'
  }
];

// ============= GERMANY MARKET TEMPLATES (5 templates) =============

export const xareltoGermanyTemplates = [
  {
    id: 'xar-de-temp-001',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    templateType: 'email_subject',
    templateName: 'Professioneller medizinischer Informations-E-Mail-Betreff',
    templateContent: 'Wichtige Informationen zu XARELTO® (Rivaroxaban) – {therapeutic_context}',
    placeholders: ['therapeutic_context'],
    mlrNumber: 'XAR-DE-TEMP-001',
    approvalDate: '2024-02-20'
  },
  {
    id: 'xar-de-temp-002',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    templateType: 'email_greeting',
    templateName: 'Professionelle Anrede',
    templateContent: 'Sehr geehrte Frau Dr. {lastname},\nSehr geehrter Herr Dr. {lastname},',
    placeholders: ['lastname'],
    mlrNumber: 'XAR-DE-TEMP-002',
    approvalDate: '2024-02-20'
  },
  {
    id: 'xar-de-temp-003',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    templateType: 'email_closing',
    templateName: 'Professioneller Abschluss',
    templateContent: 'Mit freundlichen Grüßen\n\nBayer Medizinische Information',
    placeholders: [],
    mlrNumber: 'XAR-DE-TEMP-003',
    approvalDate: '2024-02-20'
  },
  {
    id: 'xar-de-temp-004',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    templateType: 'fair_balance',
    templateName: 'EMA-konformer Fair-Balance-Block',
    templateContent: 'Wichtige Sicherheitsinformationen: XARELTO kann schwere, potenziell tödliche Blutungen verursachen. Anzeichen oder Symptome von Blutverlust müssen umgehend abgeklärt werden. XARELTO darf nicht bei aktiver pathologischer Blutung angewendet werden. Vollständige Fachinformation beachten. Nebenwirkungen melden an BfArM oder medinfo.germany@bayer.com.',
    placeholders: [],
    mlrNumber: 'XAR-DE-TEMP-004',
    approvalDate: '2024-02-20'
  },
  {
    id: 'xar-de-temp-005',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    templateType: 'contact_info',
    templateName: 'Medizinische Informationskontaktblock',
    templateContent: 'Für medizinische Informationen:\nTelefon: +49-XXX-XXX-XXXX\nWebsite: www.xarelto.de\nE-Mail: medinfo.germany@bayer.com\n\nNebenwirkungen melden: BfArM oder medinfo.germany@bayer.com',
    placeholders: [],
    mlrNumber: 'XAR-DE-TEMP-005',
    approvalDate: '2024-02-20'
  }
];

// ============= FRANCE MARKET TEMPLATES (5 templates) =============

export const xareltoFranceTemplates = [
  {
    id: 'xar-fr-temp-001',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    templateType: 'email_subject',
    templateName: 'Objet d\'e-mail d\'information médicale professionnelle',
    templateContent: 'Informations importantes concernant XARELTO® (rivaroxaban) – {therapeutic_context}',
    placeholders: ['therapeutic_context'],
    mlrNumber: 'XAR-FR-TEMP-001',
    approvalDate: '2024-03-10'
  },
  {
    id: 'xar-fr-temp-002',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    templateType: 'email_greeting',
    templateName: 'Salutation professionnelle',
    templateContent: 'Cher Docteur {lastname},\nChère Docteure {lastname},',
    placeholders: ['lastname'],
    mlrNumber: 'XAR-FR-TEMP-002',
    approvalDate: '2024-03-10'
  },
  {
    id: 'xar-fr-temp-003',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    templateType: 'email_closing',
    templateName: 'Formule de politesse professionnelle',
    templateContent: 'Cordialement,\n\nInformation Médicale Bayer',
    placeholders: [],
    mlrNumber: 'XAR-FR-TEMP-003',
    approvalDate: '2024-03-10'
  },
  {
    id: 'xar-fr-temp-004',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    templateType: 'fair_balance',
    templateName: 'Bloc d\'équilibre conforme EMA',
    templateContent: 'Informations de sécurité importantes : XARELTO peut provoquer des saignements graves, pouvant être fatals. Évaluer rapidement les signes ou symptômes de perte de sang. Ne pas utiliser XARELTO en cas d\'hémorragie pathologique active. Consulter le RCP complet. Déclarer les effets indésirables à l\'ANSM ou medinfo.france@bayer.com.',
    placeholders: [],
    mlrNumber: 'XAR-FR-TEMP-004',
    approvalDate: '2024-03-10'
  },
  {
    id: 'xar-fr-temp-005',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    templateType: 'contact_info',
    templateName: 'Bloc de contact d\'information médicale',
    templateContent: 'Pour toute information médicale :\nTéléphone : 01-XX-XX-XX-XX\nSite web : www.xarelto.fr\nE-mail : medinfo.france@bayer.com\n\nDéclaration des effets indésirables : ANSM ou medinfo.france@bayer.com',
    placeholders: [],
    mlrNumber: 'XAR-FR-TEMP-005',
    approvalDate: '2024-03-10'
  }
];

// ============= CHINA MARKET TEMPLATES (5 templates) =============

export const xareltochinaTemplates = [
  {
    id: 'xar-cn-temp-001',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    templateType: 'email_subject',
    templateName: '专业医学信息电子邮件主题',
    templateContent: '关于XARELTO®（利伐沙班）的重要信息 – {therapeutic_context}',
    placeholders: ['therapeutic_context'],
    mlrNumber: 'XAR-CN-TEMP-001',
    approvalDate: '2024-04-05'
  },
  {
    id: 'xar-cn-temp-002',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    templateType: 'email_greeting',
    templateName: '专业问候语',
    templateContent: '尊敬的{lastname}医生',
    placeholders: ['lastname'],
    mlrNumber: 'XAR-CN-TEMP-002',
    approvalDate: '2024-04-05'
  },
  {
    id: 'xar-cn-temp-003',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    templateType: 'email_closing',
    templateName: '专业结束语',
    templateContent: '顺颂医安\n\n拜耳医学信息部',
    placeholders: [],
    mlrNumber: 'XAR-CN-TEMP-003',
    approvalDate: '2024-04-05'
  },
  {
    id: 'xar-cn-temp-004',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    templateType: 'fair_balance',
    templateName: 'NMPA合规的公平平衡块',
    templateContent: '重要安全信息：XARELTO可能导致严重出血，可能致命。应立即评估出血迹象或症状。活动性病理性出血患者禁用XARELTO。请查阅完整说明书。不良反应报告：NMPA或medinfo.china@bayer.com。',
    placeholders: [],
    mlrNumber: 'XAR-CN-TEMP-004',
    approvalDate: '2024-04-05'
  },
  {
    id: 'xar-cn-temp-005',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    templateType: 'contact_info',
    templateName: '医学信息联系方式块',
    templateContent: '医学信息咨询：\n电话：400-XXX-XXXX\n网站：www.xarelto.com.cn\n电子邮箱：medinfo.china@bayer.com\n\n不良反应报告：NMPA或medinfo.china@bayer.com',
    placeholders: [],
    mlrNumber: 'XAR-CN-TEMP-005',
    approvalDate: '2024-04-05'
  }
];

/**
 * Helper function to get templates by market
 */
export const getXareltoTemplatesByMarket = (market) => {
  const normalizedMarket = market.toUpperCase();
  
  switch (normalizedMarket) {
    case 'US':
      return xareltoUSTemplates;
    case 'GERMANY':
    case 'DE':
      return [...xareltoUSTemplates, ...xareltoGermanyTemplates];
    case 'FRANCE':
    case 'FR':
      return [...xareltoUSTemplates, ...xareltoFranceTemplates];
    case 'CHINA':
    case 'CN':
      return [...xareltoUSTemplates, ...xareltochinaTemplates];
    default:
      console.warn(`[Xarelto] No templates found for market: ${market}`);
      return xareltoUSTemplates;
  }
};

/**
 * Get all templates across all markets
 */
export const getAllXareltoTemplates = () => {
  return [
    ...xareltoUSTemplates,
    ...xareltoGermanyTemplates,
    ...xareltoFranceTemplates,
    ...xareltochinaTemplates
  ];
};