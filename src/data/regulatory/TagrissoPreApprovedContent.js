/**
 * Tagrisso (Osimertinib) Pre-Approved Content
 * AstraZeneca - Oncology (NSCLC)
 * Brand ID: 5eabc763-b6c3-4214-b875-3d7cdea8f005
 * * Pre-approved regulatory content for US, Germany, France, China markets
 * Total: 45 content items (15 per market × 3 markets)
 */

const TAGRISSO_BRAND_ID = '5eabc763-b6c3-4214-b875-3d7cdea8f005';

// ============= US MARKET CONTENT (8 entries - base) =============

export const tagrissoUSContent = [
  {
    id: 'tag-us-content-001',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    category: 'efficacy_claim',
    contentType: 'Primary Endpoint - First-Line Metastatic NSCLC',
    approvedContent: 'TAGRISSO® (osimertinib) is indicated for the first-line treatment of patients with metastatic non-small cell lung cancer (NSCLC) whose tumors have epidermal growth factor receptor (EGFR) exon 19 deletions or exon 21 L858R mutations.',
    mlrNumber: 'TAG-US-2024-001',
    approvalDate: '2024-01-20',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-content-002',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    category: 'efficacy_claim',
    contentType: 'Primary Endpoint - Adjuvant NSCLC',
    approvedContent: 'TAGRISSO is indicated for adjuvant treatment after tumor resection in adult patients with stage IB-IIIA non-small cell lung cancer whose tumors have EGFR exon 19 deletions or exon 21 L858R mutations.',
    mlrNumber: 'TAG-US-2024-002',
    approvalDate: '2024-01-20',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-content-003',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    category: 'safety_info',
    contentType: 'Most Common Adverse Reactions',
    approvedContent: 'In clinical trials, the most common adverse reactions (≥20%) were diarrhea, rash, dry skin, nail toxicity, stomatitis, and fatigue. The most serious adverse reaction was interstitial lung disease (ILD)/pneumonitis.',
    mlrNumber: 'TAG-US-2024-003',
    approvalDate: '2024-01-20',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-content-004',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    category: 'safety_info',
    contentType: 'ILD/Pneumonitis Warning',
    approvedContent: 'Interstitial lung disease (ILD)/pneumonitis occurred in 3-4% of patients treated with TAGRISSO. Monitor for pulmonary symptoms indicative of ILD/pneumonitis. Withhold TAGRISSO and promptly investigate if ILD/pneumonitis is suspected.',
    mlrNumber: 'TAG-US-2024-004',
    approvalDate: '2024-01-20',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-content-005',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    category: 'dosing',
    contentType: 'Standard Dosing',
    approvedContent: 'The recommended dose of TAGRISSO is 80 mg orally once daily with or without food until disease progression or unacceptable toxicity.',
    mlrNumber: 'TAG-US-2024-005',
    approvalDate: '2024-01-20',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-content-006',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    category: 'mechanism',
    contentType: 'Mechanism of Action',
    approvedContent: 'TAGRISSO is a kinase inhibitor that is an irreversible inhibitor of EGFR-TKI sensitizing (EGFRm) and EGFR T790M resistance mutations with activity against CNS metastases.',
    mlrNumber: 'TAG-US-2024-006',
    approvalDate: '2024-01-20',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-content-007',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    category: 'indication',
    contentType: 'Biomarker Testing Requirement',
    approvedContent: 'EGFR mutation-positive status must be confirmed by an FDA-approved test before initiating treatment with TAGRISSO. Information on FDA-approved tests for the detection of EGFR mutations is available at: http://www.fda.gov/CompanionDiagnostics.',
    mlrNumber: 'TAG-US-2024-007',
    approvalDate: '2024-01-20',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-us-content-008',
    brandId: TAGRISSO_BRAND_ID,
    market: 'US',
    category: 'disclaimer',
    contentType: 'Fair Balance Statement',
    approvedContent: 'Important Safety Information: TAGRISSO can cause ILD/pneumonitis, QTc interval prolongation, cardiomyopathy, and embryo-fetal toxicity. Confirm EGFR mutation status prior to treatment. See full Prescribing Information for complete safety profile and dosage modifications.',
    mlrNumber: 'TAG-US-2024-008',
    approvalDate: '2024-01-20',
    therapeuticArea: 'Oncology'
  }
];

// ============= GERMANY MARKET CONTENT (7 entries - localized) =============

export const tagrissoGermanyContent = [
  {
    id: 'tag-de-content-001',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    category: 'efficacy_claim',
    contentType: 'Erstlinientherapie metastasiertes NSCLC',
    approvedContent: 'TAGRISSO® (Osimertinib) ist zugelassen zur Erstlinientherapie bei erwachsenen Patienten mit lokal fortgeschrittenem oder metastasiertem nicht-kleinzelligem Lungenkarzinom (NSCLC) mit aktivierenden EGFR-Mutationen (Exon-19-Deletionen oder Exon-21-L858R-Substitutionsmutation).',
    mlrNumber: 'TAG-DE-2024-001',
    approvalDate: '2024-02-25',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-de-content-002',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    category: 'efficacy_claim',
    contentType: 'Adjuvante Therapie NSCLC',
    approvedContent: 'TAGRISSO ist zugelassen zur adjuvanten Behandlung nach Tumorresektion bei erwachsenen Patienten mit NSCLC im Stadium IB-IIIA mit EGFR-Exon-19-Deletionen oder Exon-21-L858R-Substitutionsmutationen.',
    mlrNumber: 'TAG-DE-2024-002',
    approvalDate: '2024-02-25',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-de-content-003',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    category: 'safety_info',
    contentType: 'Häufigste Nebenwirkungen',
    approvedContent: 'In klinischen Studien waren die häufigsten Nebenwirkungen (≥20%) Diarrhoe, Hautausschlag, trockene Haut, Nageltoxizität, Stomatitis und Müdigkeit. Die schwerwiegendste Nebenwirkung war interstitielle Lungenerkrankung (ILD)/Pneumonitis.',
    mlrNumber: 'TAG-DE-2024-003',
    approvalDate: '2024-02-25',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-de-content-004',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    category: 'safety_info',
    contentType: 'ILD/Pneumonitis-Warnung',
    approvedContent: 'Interstitielle Lungenerkrankung (ILD)/Pneumonitis trat bei 3-4% der mit TAGRISSO behandelten Patienten auf. Auf pulmonale Symptome, die auf ILD/Pneumonitis hinweisen, überwachen. TAGRISSO absetzen und umgehend untersuchen, wenn ILD/Pneumonitis vermutet wird.',
    mlrNumber: 'TAG-DE-2024-004',
    approvalDate: '2024-02-25',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-de-content-005',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    category: 'dosing',
    contentType: 'Standarddosierung',
    approvedContent: 'Die empfohlene Dosis von TAGRISSO beträgt 80 mg oral einmal täglich mit oder ohne Nahrung bis zur Krankheitsprogression oder inakzeptabler Toxizität.',
    mlrNumber: 'TAG-DE-2024-005',
    approvalDate: '2024-02-25',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-de-content-006',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    category: 'mechanism',
    contentType: 'Wirkmechanismus',
    approvedContent: 'TAGRISSO ist ein Kinaseinhibitor, der ein irreversibler Inhibitor von EGFR-TKI-sensibilisierenden (EGFRm) und EGFR-T790M-Resistenzmutationen mit Aktivität gegen ZNS-Metastasen ist.',
    mlrNumber: 'TAG-DE-2024-006',
    approvalDate: '2024-02-25',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-de-content-007',
    brandId: TAGRISSO_BRAND_ID,
    market: 'Germany',
    category: 'disclaimer',
    contentType: 'Wichtige Sicherheitsinformationen',
    approvedContent: 'Wichtige Sicherheitsinformationen: TAGRISSO kann ILD/Pneumonitis, QTc-Intervallverlängerung, Kardiomyopathie und Embryo-Fetal-Toxizität verursachen. EGFR-Mutationsstatus vor Behandlung bestätigen. Vollständige Fachinformation für vollständiges Sicherheitsprofil beachten.',
    mlrNumber: 'TAG-DE-2024-007',
    approvalDate: '2024-02-25',
    therapeuticArea: 'Oncology'
  }
];

// ============= FRANCE MARKET CONTENT (7 entries - localized) =============

export const tagrissoFranceContent = [
  {
    id: 'tag-fr-content-001',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    category: 'efficacy_claim',
    contentType: 'Traitement de première ligne CBNPC métastatique',
    approvedContent: 'TAGRISSO® (osimertinib) est indiqué en traitement de première intention chez les patients adultes atteints d\'un cancer bronchique non à petites cellules (CBNPC) localement avancé ou métastatique avec mutations activatrices de l\'EGFR (délétions de l\'exon 19 ou mutation de substitution L858R de l\'exon 21).',
    mlrNumber: 'TAG-FR-2024-001',
    approvalDate: '2024-03-15',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-fr-content-002',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    category: 'efficacy_claim',
    contentType: 'Traitement adjuvant CBNPC',
    approvedContent: 'TAGRISSO est indiqué en traitement adjuvant après résection tumorale chez les patients adultes atteints d\'un CBNPC de stade IB-IIIA avec mutations de l\'EGFR (délétions de l\'exon 19 ou mutation L858R de l\'exon 21).',
    mlrNumber: 'TAG-FR-2024-002',
    approvalDate: '2024-03-15',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-fr-content-003',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    category: 'safety_info',
    contentType: 'Effets indésirables les plus fréquents',
    approvedContent: 'Dans les essais cliniques, les effets indésirables les plus fréquents (≥20%) étaient la diarrhée, l\'éruption cutanée, la peau sèche, la toxicité unguéale, la stomatite et la fatigue. L\'effet indésirable le plus grave était la pneumopathie interstitielle diffuse (PID)/pneumopathie.',
    mlrNumber: 'TAG-FR-2024-003',
    approvalDate: '2024-03-15',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-fr-content-004',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    category: 'safety_info',
    contentType: 'Avertissement PID/pneumopathie',
    approvedContent: 'Une pneumopathie interstitielle diffuse (PID)/pneumopathie est survenue chez 3 à 4% des patients traités par TAGRISSO. Surveiller les symptômes pulmonaires évocateurs de PID/pneumopathie. Interrompre TAGRISSO et effectuer rapidement des investigations si une PID/pneumopathie est suspectée.',
    mlrNumber: 'TAG-FR-2024-004',
    approvalDate: '2024-03-15',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-fr-content-005',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    category: 'dosing',
    contentType: 'Posologie standard',
    approvedContent: 'La dose recommandée de TAGRISSO est de 80 mg par voie orale une fois par jour avec ou sans nourriture jusqu\'à progression de la maladie ou toxicité inacceptable.',
    mlrNumber: 'TAG-FR-2024-005',
    approvalDate: '2024-03-15',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-fr-content-006',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    category: 'mechanism',
    contentType: 'Mécanisme d\'action',
    approvedContent: 'TAGRISSO est un inhibiteur de kinase qui est un inhibiteur irréversible des mutations sensibilisantes à l\'EGFR-ITK (EGFRm) et des mutations de résistance T790M de l\'EGFR avec activité contre les métastases du SNC.',
    mlrNumber: 'TAG-FR-2024-006',
    approvalDate: '2024-03-15',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-fr-content-007',
    brandId: TAGRISSO_BRAND_ID,
    market: 'France',
    category: 'disclaimer',
    contentType: 'Informations de sécurité importantes',
    approvedContent: 'Informations de sécurité importantes : TAGRISSO peut provoquer une PID/pneumopathie, un allongement de l\'intervalle QTc, une cardiomyopathie et une toxicité embryo-fœtale. Confirmer le statut mutationnel de l\'EGFR avant le traitement. Consulter le RCP complet pour le profil de sécurité complet.',
    mlrNumber: 'TAG-FR-2024-007',
    approvalDate: '2024-03-15',
    therapeuticArea: 'Oncology'
  }
];

// ============= CHINA MARKET CONTENT (7 entries - localized) =============

export const tagrissochinaContent = [
  {
    id: 'tag-cn-content-001',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    category: 'efficacy_claim',
    contentType: '一线治疗转移性非小细胞肺癌',
    approvedContent: 'TAGRISSO®（奥希替尼）适用于具有表皮生长因子受体（EGFR）外显子19缺失或外显子21 L858R突变的局部晚期或转移性非小细胞肺癌（NSCLC）成人患者的一线治疗。',
    mlrNumber: 'TAG-CN-2024-001',
    approvalDate: '2024-04-10',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-cn-content-002',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    category: 'efficacy_claim',
    contentType: '辅助治疗非小细胞肺癌',
    approvedContent: 'TAGRISSO适用于肿瘤切除后IB-IIIA期具有EGFR外显子19缺失或外显子21 L858R突变的非小细胞肺癌成人患者的辅助治疗。',
    mlrNumber: 'TAG-CN-2024-002',
    approvalDate: '2024-04-10',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-cn-content-003',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    category: 'safety_info',
    contentType: '最常见不良反应',
    approvedContent: '在临床试验中，最常见的不良反应（≥20%）包括腹泻、皮疹、皮肤干燥、甲毒性、口腔炎和疲劳。最严重的不良反应是间质性肺病（ILD）/肺炎。',
    mlrNumber: 'TAG-CN-2024-003',
    approvalDate: '2024-04-10',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-cn-content-004',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    category: 'safety_info',
    contentType: 'ILD/肺炎警告',
    approvedContent: '接受TAGRISSO治疗的患者中有3-4%发生间质性肺病（ILD）/肺炎。监测提示ILD/肺炎的肺部症状。如怀疑ILD/肺炎，应暂停TAGRISSO并立即进行检查。',
    mlrNumber: 'TAG-CN-2024-004',
    approvalDate: '2024-04-10',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-cn-content-005',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    category: 'dosing',
    contentType: '标准给药方案',
    approvedContent: 'TAGRISSO的推荐剂量为80毫克，每日一次口服，空腹或随餐服用，直至疾病进展或出现不可接受的毒性。',
    mlrNumber: 'TAG-CN-2024-005',
    approvalDate: '2024-04-10',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-cn-content-006',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    category: 'mechanism',
    contentType: '作用机制',
    approvedContent: 'TAGRISSO是一种激酶抑制剂，是EGFR-TKI敏感性突变（EGFRm）和EGFR T790M耐药突变的不可逆抑制剂，对中枢神经系统转移具有活性。',
    mlrNumber: 'TAG-CN-2024-006',
    approvalDate: '2024-04-10',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'tag-cn-content-007',
    brandId: TAGRISSO_BRAND_ID,
    market: 'China',
    category: 'disclaimer',
    contentType: '重要安全信息',
    approvedContent: '重要安全信息：TAGRISSO可引起ILD/肺炎、QTc间期延长、心肌病和胚胎-胎儿毒性。治疗前确认EGFR突变状态。请查阅完整说明书了解完整安全性特征。',
    mlrNumber: 'TAG-CN-2024-007',
    approvalDate: '2024-04-10',
    therapeuticArea: 'Oncology'
  }
];

/**
 * Helper function to get content by market
 */
export const getTagrissoContentByMarket = (market) => {
  const normalizedMarket = market.toUpperCase();
  
  switch (normalizedMarket) {
    case 'US':
      return tagrissoUSContent;
    case 'GERMANY':
    case 'DE':
      return [...tagrissoUSContent, ...tagrissoGermanyContent];
    case 'FRANCE':
    case 'FR':
      return [...tagrissoUSContent, ...tagrissoFranceContent];
    case 'CHINA':
    case 'CN':
      return [...tagrissoUSContent, ...tagrissochinaContent];
    default:
      console.warn(`[Tagrisso] No content found for market: ${market}`);
      return tagrissoUSContent;
  }
};

/**
 * Get all content across all markets
 */
export const getAllTagrissoContent = () => {
  return [
    ...tagrissoUSContent,
    ...tagrissoGermanyContent,
    ...tagrissoFranceContent,
    ...tagrissochinaContent
  ];
};