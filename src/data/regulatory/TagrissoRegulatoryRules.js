/**
 * Tagrisso (Osimertinib) Regulatory Rules
 * AstraZeneca - Oncology (NSCLC)
 * Brand ID: 5eabc763-b6c3-4214-b875-3d7cdea8f005
 *
 * Indications:
 * - EGFR-mutated metastatic non-small cell lung cancer (NSCLC)
 * - Adjuvant treatment post-surgery for EGFR-mutated NSCLC
 * - Unresectable Stage III EGFR-mutated NSCLC (NEW 2024)
 *
 * Markets: US → Germany, France, China
 */

const TAGRISSO_BRAND_ID = '5eabc763-b6c3-4214-b875-3d7cdea8f005';

// ============= US → GERMANY RULES (30 total) =============

const usToGermanyRules = [
  // MUST_CHANGE Rules (10) - Critical regulatory transformations
  {
    id: 'tag-us-de-must-001',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Regulatory Body Reference',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Replace FDA with EMA/BfArM',
    description: 'All references to FDA must be replaced with European Medicines Agency (EMA) and German Federal Institute for Drugs and Medical Devices (BfArM).',
    rationale: 'Germany operates under EMA approval with BfArM oversight. FDA references are not valid for German regulatory compliance.',
    preApprovedReplacement: 'EMA/BfArM',
    requiresMLRApproval: true,
    regex: '\\bFDA\\b',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-de-must-002',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Medical Terminology Translation',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Translate all NSCLC terminology to German',
    description: 'All medical terms must be professionally translated: NSCLC (nicht-kleinzelliges Lungenkarzinom), EGFR (epidermaler Wachstumsfaktor-Rezeptor), mutation (Mutation), TKI (Tyrosinkinase-Inhibitor).',
    rationale: 'German healthcare professionals require content in their native language for proper understanding and regulatory compliance.',
    suggestedReplacement: 'Professional medical translation required for oncology terminology',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-de-must-003',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Contact Information',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Replace US contact information with German',
    description: 'Update all contact details: phone numbers (+49 format), email addresses (.de domain), physical addresses (German locations).',
    rationale: 'German healthcare providers need to contact AstraZeneca Germany medical information team, not US offices.',
    suggestedReplacement: 'Medical Information: +49-XXX-XXX-XXXX | www.tagrisso.de | medinfo.germany@astrazeneca.com',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-de-must-004',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Date Format',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Convert date format from MM/DD/YYYY to DD.MM.YYYY',
    description: 'All dates must use German standard format (DD.MM.YYYY) instead of US format (MM/DD/YYYY).',
    rationale: 'German date format standard prevents confusion and ensures regulatory compliance.',
    preApprovedReplacement: 'DD.MM.YYYY',
    requiresMLRApproval: false,
    regex: '\\d{1,2}/\\d{1,2}/\\d{4}',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-de-must-005',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Prescribing Information',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Replace US Prescribing Information with German Fachinformation',
    description: 'References to US PI must be replaced with German Fachinformation (summary of product characteristics).',
    rationale: 'German prescribers rely on EMA-approved Fachinformation, not FDA-approved US PI.',
    preApprovedReplacement: 'Fachinformation',
    requiresMLRApproval: true,
    regex: 'Prescribing Information|\\bPI\\b',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-de-must-006',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Pharmacovigilance',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Update adverse event reporting to German pharmacovigilance',
    description: 'Replace US adverse event reporting procedures with German BfArM and EMA reporting requirements, including interstitial lung disease (ILD) monitoring.',
    rationale: 'Germany has specific pharmacovigilance requirements under EU regulations that differ from US FDA reporting.',
    suggestedReplacement: 'Adverse events, especially ILD/pneumonitis, must be reported to BfArM and EMA according to EU pharmacovigilance guidelines. Contact: medinfo.germany@astrazeneca.com',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-de-must-007',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Website URLs',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Replace .com URLs with .de domain',
    description: 'All website references must use German domain (.de) instead of US (.com).',
    rationale: 'German HCPs should access German-language, EMA-compliant product information.',
    preApprovedReplacement: 'www.tagrisso.de',
    requiresMLRApproval: false,
    regex: 'www\\.tagrisso\\.com',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-de-must-008',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Patient Support Programs',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Update patient support program information for Germany',
    description: 'Replace US patient assistance programs with German-specific support services and resources for lung cancer patients.',
    rationale: 'German healthcare system and patient support infrastructure differs significantly from US model.',
    suggestedReplacement: 'Information about German patient support programs available through AstraZeneca Germany',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-de-must-009',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Reimbursement Information',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Replace US insurance references with GKV oncology context',
    description: 'Update all insurance/reimbursement language to reflect German statutory health insurance (GKV) oncology coverage.',
    rationale: 'Germany has universal healthcare through GKV with specific oncology reimbursement pathways, fundamentally different from US insurance model.',
    suggestedReplacement: 'Coverage under German statutory health insurance (GKV) for EMA-approved oncology indications',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-de-must-010',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Biomarker Testing',
    ruleType: 'MUST_CHANGE',
    severity: 'medium',
    title: 'Reference German EGFR testing infrastructure',
    description: 'Update biomarker testing references to acknowledge German molecular pathology infrastructure and testing algorithms.',
    rationale: 'German EGFR testing follows EMA/German guidelines and infrastructure differs from US.',
    suggestedReplacement: 'EGFR-Mutationstestung gemäß deutschen molekularpathologischen Richtlinien erforderlich',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
];

// ============= US → FRANCE RULES (30 total) =============

const usToFranceRules = [
  // MUST_CHANGE Rules (10)
  {
    id: 'tag-us-fr-must-001',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Regulatory Body Reference',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Replace FDA with EMA/ANSM',
    description: 'All FDA references must be replaced with European Medicines Agency (EMA) and French National Agency for Medicines Safety (ANSM).',
    rationale: 'France operates under EMA approval with ANSM national oversight. FDA references are not valid.',
    preApprovedReplacement: 'EMA/ANSM',
    requiresMLRApproval: true,
    regex: '\\bFDA\\b',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-fr-must-002',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Medical Terminology Translation',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Translate NSCLC terminology to French',
    description: 'All medical terms must be professionally translated: NSCLC (cancer du poumon non à petites cellules), EGFR (récepteur du facteur de croissance épidermique), mutation (mutation), TKI (inhibiteur de la tyrosine kinase).',
    rationale: 'French healthcare professionals require content in their native language for regulatory compliance.',
    suggestedReplacement: 'Professional French medical translation required',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-fr-must-003',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Contact Information',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Replace US contact with French information',
    description: 'Update phone numbers (+33 format), email (.fr domain), physical addresses (French locations).',
    rationale: 'French HCPs need to contact AstraZeneca France medical information, not US offices.',
    suggestedReplacement: 'Information Médicale: 01-XX-XX-XX-XX | www.tagrisso.fr | medinfo.france@astrazeneca.com',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-fr-must-004',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Date Format',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Convert to DD/MM/YYYY format',
    description: 'All dates must use French standard format (DD/MM/YYYY) instead of US format (MM/DD/YYYY).',
    rationale: 'French date format standard prevents confusion.',
    preApprovedReplacement: 'DD/MM/YYYY',
    requiresMLRApproval: false,
    regex: '\\d{1,2}/\\d{1,2}/\\d{4}',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-fr-must-005',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Prescribing Information',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Replace US PI with French RCP',
    description: 'References to US Prescribing Information must be replaced with French Résumé des Caractéristiques du Produit (RCP).',
    rationale: 'French prescribers rely on EMA-approved RCP, not FDA PI.',
    preApprovedReplacement: 'RCP (Résumé des Caractéristiques du Produit)',
    requiresMLRApproval: true,
    regex: 'Prescribing Information|\\bPI\\b',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-fr-must-006',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Pharmacovigilance',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Update to French pharmacovigilance system',
    description: 'Replace US adverse event reporting with French ANSM reporting requirements.',
    rationale: 'France has specific pharmacovigilance requirements under EU regulations.',
    suggestedReplacement: 'Déclarer les effets indésirables à l\'ANSM et l\'EMA selon la réglementation française',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-fr-must-007',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Website URLs',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Replace .com with .fr domain',
    description: 'All website references must use French domain (.fr) instead of US (.com).',
    rationale: 'French HCPs should access French-language, EMA-compliant information.',
    preApprovedReplacement: 'www.tagrisso.fr',
    requiresMLRApproval: false,
    regex: 'www\\.tagrisso\\.com',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-fr-must-008',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Patient Support Programs',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Update French patient support information',
    description: 'Replace US patient assistance with French-specific programs and resources.',
    rationale: 'French healthcare and patient support infrastructure differs from US.',
    suggestedReplacement: 'Programmes de soutien aux patients disponibles via AstraZeneca France',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-fr-must-009',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Reimbursement Information',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Replace US insurance with Sécurité Sociale/ALD context',
    description: 'Update reimbursement language to reflect French social security (Sécurité Sociale) and ALD (Affection Longue Durée) system.',
    rationale: 'France has universal healthcare through Sécurité Sociale, fundamentally different from US.',
    suggestedReplacement: 'Prise en charge par la Sécurité Sociale pour les indications approuvées',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-fr-must-010',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Clinical Trial References',
    ruleType: 'MUST_CHANGE',
    severity: 'medium',
    title: 'Include French/European trial data',
    description: 'Prioritize European and French study data when available alongside global trials.',
    rationale: 'French physicians value local evidence reflecting their patient populations.',
    suggestedReplacement: 'Référencer les données françaises/européennes des études ROCKET AF, EINSTEIN',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
];

// ============= US → CHINA RULES (30 total) =============

const usToChinaRules = [
  // MUST_CHANGE Rules (10)
  {
    id: 'tag-us-cn-must-001',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Regulatory Body Reference',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Replace FDA with NMPA',
    description: 'All FDA references must be replaced with National Medical Products Administration (NMPA, formerly CFDA).',
    rationale: 'China operates under NMPA regulatory authority. FDA references are not valid.',
    preApprovedReplacement: 'NMPA (国家药品监督管理局)',
    requiresMLRApproval: true,
    regex: '\\bFDA\\b',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-cn-must-002',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Medical Terminology Translation',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Translate to Simplified Chinese',
    description: 'All medical terminology must be professionally translated to Simplified Chinese: atrial fibrillation (心房颤动), DVT (深静脉血栓), PE (肺栓塞).',
    rationale: 'Chinese healthcare professionals require Simplified Chinese for regulatory compliance.',
    suggestedReplacement: 'Professional Simplified Chinese medical translation required',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-cn-must-003',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Contact Information',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Replace US contact with Chinese information',
    description: 'Update phone numbers (400-XXX-XXXX format), email (.cn domain), addresses (Chinese locations).',
    rationale: 'Chinese HCPs need to contact AstraZeneca China medical information.',
    suggestedReplacement: '医学信息热线：400-XXX-XXXX | www.tagrisso.com.cn | medinfo.china@astrazeneca.com',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-cn-must-004',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Date Format',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Convert to YYYY-MM-DD format',
    description: 'All dates must use Chinese standard format (YYYY-MM-DD) instead of US format (MM/DD/YYYY).',
    rationale: 'Chinese date format standard (ISO 8601 adopted in China).',
    preApprovedReplacement: 'YYYY-MM-DD',
    requiresMLRApproval: false,
    regex: '\\d{1,2}/\\d{1,2}/\\d{4}',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-cn-must-005',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Prescribing Information',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Replace US PI with Chinese package insert',
    description: 'References to US Prescribing Information must be replaced with NMPA-approved Chinese package insert (说明书).',
    rationale: 'Chinese prescribers rely on NMPA-approved package insert.',
    preApprovedReplacement: '说明书 (Chinese package insert)',
    requiresMLRApproval: true,
    regex: 'Prescribing Information|\\bPI\\b',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-cn-must-006',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Pharmacovigilance',
    ruleType: 'MUST_CHANGE',
    severity: 'critical',
    title: 'Update to NMPA pharmacovigilance system',
    description: 'Replace US adverse event reporting with NMPA reporting requirements.',
    rationale: 'China has specific pharmacovigilance requirements under NMPA regulations.',
    suggestedReplacement: '不良反应报告：按照NMPA药物警戒要求向国家药品不良反应监测中心报告',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-cn-must-007',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Website URLs',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Replace .com with .com.cn domain',
    description: 'All website references must use Chinese domain (.com.cn) instead of US (.com).',
    rationale: 'Chinese HCPs should access Chinese-language, NMPA-compliant information.',
    preApprovedReplacement: 'www.tagrisso.com.cn',
    requiresMLRApproval: false,
    regex: 'www\\.tagrisso\\.com',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-cn-must-008',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Patient Support Programs',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Update Chinese patient support information',
    description: 'Replace US patient assistance with Chinese-specific programs and WeChat integration.',
    rationale: 'Chinese healthcare and patient support infrastructure differs significantly from US, with WeChat as primary communication platform.',
    suggestedReplacement: '患者支持项目详情请通过微信或拜耳中国医学信息部获取',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-cn-must-009',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Reimbursement Information',
    ruleType: 'MUST_CHANGE',
    severity: 'high',
    title: 'Replace US insurance with Chinese health insurance context',
    description: 'Update reimbursement language to reflect Chinese basic medical insurance system and NRDL (National Reimbursement Drug List) status.',
    rationale: 'China has different health insurance system with NRDL determining coverage.',
    suggestedReplacement: '国家医保目录内药品，按照当地医保政策报销',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-cn-must-010',
    brandId: TAGRISSO_BRAND_ID,
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Clinical Trial References',
    ruleType: 'MUST_CHANGE',
    severity: 'medium',
    title: 'Include Chinese clinical trial data',
    description: 'Include Chinese bridging studies and post-marketing surveillance data alongside global trials.',
    rationale: 'Chinese physicians value local evidence from Chinese patient populations.',
    suggestedReplacement: '参考中国桥接研究和上市后监测数据以及ROCKET AF、EINSTEIN全球研究',
    requiresMLRApproval: true,
    therapeuticArea: 'Oncology'
  },
];

/**
 * Main function to retrieve Tagrisso rules by market pair
 */
export const getTagrissoRules = (sourceMarket, targetMarket) => {
  const marketKey = `${sourceMarket.toUpperCase()}_${targetMarket.toUpperCase()}`;
  
  console.log(`[Tagrisso] Fetching regulatory rules for ${sourceMarket}→${targetMarket}`);
  
  switch (marketKey) {
    case 'US_GERMANY':
    case 'US_DE':
      return usToGermanyRules;
    case 'US_FRANCE':
    case 'US_FR':
      return usToFranceRules;
    case 'US_CHINA':
    case 'US_CN':
      return usToChinaRules;
    default:
      console.warn(`[Tagrisso] No rules found for market pair: ${marketKey}`);
      return [];
  }
};

/**
 * Get rules by rule type
 */
export const getTagrissoRulesByType = (sourceMarket, targetMarket, ruleType) => {
  const allRules = getTagrissoRules(sourceMarket, targetMarket);
  return allRules.filter(rule => rule.ruleType === ruleType);
};

/**
 * Convert Tagrisso-specific rules to generic RegulatoryMatrixEntry format
 */
export const convertTagrissoRulesToMatrixEntries = (rules) => {
  return rules.map(rule => ({
    market: rule.targetMarket,
    therapeuticArea: 'Oncology',
    ruleCategory: rule.category,
    ruleId: rule.id,
    ruleName: rule.title,
    changeRequirement: rule.ruleType,
    riskLevel: rule.severity,
    description: rule.description,
    rationale: rule.rationale,
    suggestedAction: rule.preApprovedReplacement || rule.suggestedReplacement || rule.description,
    requiresMLRApproval: rule.requiresMLRApproval,
    brandId: rule.brandId,
    validationMethod: rule.regex ? 'automated' : 'manual'
  }));
};