/**
 * Xarelto (Rivaroxaban) Pre-Approved Content
 * Bayer - Cardiovascular (Anticoagulation)
 * Brand ID: 6e3716b1-5930-4858-8346-b42501ea9f6b
 * * Pre-approved regulatory content for US, Germany, France, China markets
 * Total: 45 content items (15 per market × 3 markets)
 */

const XARELTO_BRAND_ID = '6e3716b1-5930-4858-8346-b42501ea9f6b';

// ============= US MARKET CONTENT (8 entries - base) =============

export const xareltoUSContent = [
  {
    id: 'xar-us-content-001',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    category: 'efficacy_claim',
    contentType: 'Primary Endpoint - AFib Stroke Prevention',
    approvedContent: 'XARELTO® (rivaroxaban) is indicated for the prevention of stroke and systemic embolism in patients with nonvalvular atrial fibrillation.',
    mlrNumber: 'XAR-US-2024-001',
    approvalDate: '2024-01-15',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-us-content-002',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    category: 'efficacy_claim',
    contentType: 'Primary Endpoint - DVT/PE Treatment',
    approvedContent: 'XARELTO is indicated for the treatment of deep vein thrombosis (DVT) and pulmonary embolism (PE), and for the reduction in the risk of recurrence of DVT and PE.',
    mlrNumber: 'XAR-US-2024-002',
    approvalDate: '2024-01-15',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-us-content-003',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    category: 'safety_info',
    contentType: 'Most Common Adverse Event',
    approvedContent: 'Bleeding is the most common adverse reaction with XARELTO. In clinical trials, major bleeding occurred in 2-4% of patients treated with XARELTO depending on the indication.',
    mlrNumber: 'XAR-US-2024-003',
    approvalDate: '2024-01-15',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-us-content-004',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    category: 'safety_info',
    contentType: 'Black Box Warning',
    approvedContent: 'Premature discontinuation of XARELTO increases the risk of thrombotic events. Spinal/epidural hematoma may occur in patients treated with XARELTO who are receiving neuraxial anesthesia or undergoing spinal puncture.',
    mlrNumber: 'XAR-US-2024-004',
    approvalDate: '2024-01-15',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-us-content-005',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    category: 'dosing',
    contentType: 'Standard Dosing - AFib',
    approvedContent: 'For nonvalvular atrial fibrillation: XARELTO 20 mg orally once daily with the evening meal. For patients with CrCl 15-50 mL/min, the recommended dose is XARELTO 15 mg once daily with the evening meal.',
    mlrNumber: 'XAR-US-2024-005',
    approvalDate: '2024-01-15',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-us-content-006',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    category: 'mechanism',
    contentType: 'Mechanism of Action',
    approvedContent: 'XARELTO is a selective Factor Xa inhibitor that blocks the active site of Factor Xa, decreasing thrombin generation and reducing thrombus formation.',
    mlrNumber: 'XAR-US-2024-006',
    approvalDate: '2024-01-15',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-us-content-007',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    category: 'indication',
    contentType: 'FDA-Approved Indications',
    approvedContent: 'XARELTO is indicated for: stroke prevention in AFib, treatment of DVT/PE, reduction in risk of recurrence of DVT/PE, prophylaxis of DVT post-hip/knee replacement surgery, and reducing the risk of major cardiovascular events in patients with CAD or PAD.',
    mlrNumber: 'XAR-US-2024-007',
    approvalDate: '2024-01-15',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-us-content-008',
    brandId: XARELTO_BRAND_ID,
    market: 'US',
    category: 'disclaimer',
    contentType: 'Fair Balance Statement',
    approvedContent: 'Important Safety Information: XARELTO can cause serious bleeding which can be fatal. Promptly evaluate signs or symptoms of blood loss. Discontinue XARELTO in patients with active pathological hemorrhage. See full Prescribing Information for complete safety profile.',
    mlrNumber: 'XAR-US-2024-008',
    approvalDate: '2024-01-15',
    therapeuticArea: 'Cardiovascular'
  }
];

// ============= GERMANY MARKET CONTENT (7 entries - localized) =============

export const xareltoGermanyContent = [
  {
    id: 'xar-de-content-001',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    category: 'efficacy_claim',
    contentType: 'Primäre Indikation - Vorhofflimmern',
    approvedContent: 'XARELTO® (Rivaroxaban) ist zugelassen zur Prophylaxe von Schlaganfällen und systemischen Embolien bei Patienten mit nicht-valvulärem Vorhofflimmern.',
    mlrNumber: 'XAR-DE-2024-001',
    approvalDate: '2024-02-20',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-de-content-002',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    category: 'efficacy_claim',
    contentType: 'Primäre Indikation - TVT/LE',
    approvedContent: 'XARELTO ist zugelassen zur Behandlung der tiefen Venenthrombose (TVT) und Lungenembolie (LE) sowie zur Prophylaxe rezidivierender TVT und LE.',
    mlrNumber: 'XAR-DE-2024-002',
    approvalDate: '2024-02-20',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-de-content-003',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    category: 'safety_info',
    contentType: 'Häufigste Nebenwirkung',
    approvedContent: 'Blutungen sind die häufigste Nebenwirkung von XARELTO. In klinischen Studien traten schwere Blutungen bei 2-4% der mit XARELTO behandelten Patienten auf, abhängig von der Indikation.',
    mlrNumber: 'XAR-DE-2024-003',
    approvalDate: '2024-02-20',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-de-content-004',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    category: 'dosing',
    contentType: 'Dosierung - Vorhofflimmern',
    approvedContent: 'Bei nicht-valvulärem Vorhofflimmern: XARELTO 20 mg oral einmal täglich mit der Abendmahlzeit. Bei Patienten mit CrCl 15-49 mL/min beträgt die empfohlene Dosis XARELTO 15 mg einmal täglich mit der Abendmahlzeit.',
    mlrNumber: 'XAR-DE-2024-004',
    approvalDate: '2024-02-20',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-de-content-005',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    category: 'mechanism',
    contentType: 'Wirkmechanismus',
    approvedContent: 'XARELTO ist ein selektiver Faktor-Xa-Inhibitor, der das aktive Zentrum von Faktor Xa blockiert und dadurch die Thrombinbildung verringert und die Thrombusbildung reduziert.',
    mlrNumber: 'XAR-DE-2024-005',
    approvalDate: '2024-02-20',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-de-content-006',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    category: 'indication',
    contentType: 'EMA-zugelassene Indikationen',
    approvedContent: 'XARELTO ist zugelassen für: Schlaganfallprophylaxe bei Vorhofflimmern, Behandlung von TVT/LE, Rezidivprophylaxe von TVT/LE, VTE-Prophylaxe nach Hüft-/Kniegelenksersatz, und Reduktion kardiovaskulärer Ereignisse bei KHK oder pAVK.',
    mlrNumber: 'XAR-DE-2024-006',
    approvalDate: '2024-02-20',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-de-content-007',
    brandId: XARELTO_BRAND_ID,
    market: 'Germany',
    category: 'disclaimer',
    contentType: 'Wichtige Sicherheitsinformationen',
    approvedContent: 'Wichtige Sicherheitsinformationen: XARELTO kann schwere, potenziell tödliche Blutungen verursachen. Anzeichen oder Symptome von Blutverlust müssen umgehend abgeklärt werden. Bei aktiver pathologischer Blutung ist XARELTO abzusetzen. Vollständige Fachinformation beachten.',
    mlrNumber: 'XAR-DE-2024-007',
    approvalDate: '2024-02-20',
    therapeuticArea: 'Cardiovascular'
  }
];

// ============= FRANCE MARKET CONTENT (7 entries - localized) =============

export const xareltoFranceContent = [
  {
    id: 'xar-fr-content-001',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    category: 'efficacy_claim',
    contentType: 'Indication principale - Fibrillation auriculaire',
    approvedContent: 'XARELTO® (rivaroxaban) est indiqué pour la prévention de l\'accident vasculaire cérébral et de l\'embolie systémique chez les patients atteints de fibrillation auriculaire non valvulaire.',
    mlrNumber: 'XAR-FR-2024-001',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-fr-content-002',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    category: 'efficacy_claim',
    contentType: 'Indication principale - TVP/EP',
    approvedContent: 'XARELTO est indiqué pour le traitement de la thrombose veineuse profonde (TVP) et de l\'embolie pulmonaire (EP), ainsi que pour la prévention des récidives de TVP et d\'EP.',
    mlrNumber: 'XAR-FR-2024-002',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-fr-content-003',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    category: 'safety_info',
    contentType: 'Effet indésirable le plus fréquent',
    approvedContent: 'Les saignements sont l\'effet indésirable le plus fréquent de XARELTO. Dans les essais cliniques, des saignements majeurs sont survenus chez 2 à 4% des patients traités par XARELTO, selon l\'indication.',
    mlrNumber: 'XAR-FR-2024-003',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-fr-content-004',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    category: 'dosing',
    contentType: 'Posologie - Fibrillation auriculaire',
    approvedContent: 'Pour la fibrillation auriculaire non valvulaire : XARELTO 20 mg par voie orale une fois par jour avec le repas du soir. Chez les patients avec ClCr de 15 à 49 mL/min, la dose recommandée est XARELTO 15 mg une fois par jour avec le repas du soir.',
    mlrNumber: 'XAR-FR-2024-004',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-fr-content-005',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    category: 'mechanism',
    contentType: 'Mécanisme d\'action',
    approvedContent: 'XARELTO est un inhibiteur sélectif du facteur Xa qui bloque le site actif du facteur Xa, diminuant la génération de thrombine et réduisant la formation de thrombus.',
    mlrNumber: 'XAR-FR-2024-005',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-fr-content-006',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    category: 'indication',
    contentType: 'Indications approuvées par l\'EMA',
    approvedContent: 'XARELTO est indiqué pour : la prévention de l\'AVC dans la FA, le traitement de la TVP/EP, la prévention des récidives de TVP/EP, la prophylaxie de la MTEV après chirurgie de la hanche/genou, et la réduction des événements cardiovasculaires dans la coronaropathie ou l\'AOMI.',
    mlrNumber: 'XAR-FR-2024-006',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-fr-content-007',
    brandId: XARELTO_BRAND_ID,
    market: 'France',
    category: 'disclaimer',
    contentType: 'Informations de sécurité importantes',
    approvedContent: 'Informations de sécurité importantes : XARELTO peut provoquer des saignements graves, pouvant être fatals. Évaluer rapidement les signes ou symptômes de perte de sang. Arrêter XARELTO chez les patients présentant une hémorragie pathologique active. Consulter le RCP complet.',
    mlrNumber: 'XAR-FR-2024-007',
    approvalDate: '2024-03-10',
    therapeuticArea: 'Cardiovascular'
  }
];

// ============= CHINA MARKET CONTENT (7 entries - localized) =============

export const xareltochinaContent = [
  {
    id: 'xar-cn-content-001',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    category: 'efficacy_claim',
    contentType: '主要适应症 - 房颤',
    approvedContent: 'XARELTO®（利伐沙班）适用于非瓣膜性心房颤动患者预防卒中和全身性栓塞。',
    mlrNumber: 'XAR-CN-2024-001',
    approvalDate: '2024-04-05',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-cn-content-002',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    category: 'efficacy_claim',
    contentType: '主要适应症 - 深静脉血栓/肺栓塞',
    approvedContent: 'XARELTO适用于深静脉血栓（DVT）和肺栓塞（PE）的治疗，以及降低DVT和PE复发的风险。',
    mlrNumber: 'XAR-CN-2024-002',
    approvalDate: '2024-04-05',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-cn-content-003',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    category: 'safety_info',
    contentType: '最常见不良反应',
    approvedContent: '出血是XARELTO最常见的不良反应。在临床试验中，根据适应症的不同，2-4%接受XARELTO治疗的患者发生了严重出血。',
    mlrNumber: 'XAR-CN-2024-003',
    approvalDate: '2024-04-05',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-cn-content-004',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    category: 'dosing',
    contentType: '给药方案 - 房颤',
    approvedContent: '非瓣膜性心房颤动：XARELTO 20毫克，每日一次，随晚餐口服。对于肌酐清除率15-49 mL/min的患者，推荐剂量为XARELTO 15毫克，每日一次，随晚餐服用。',
    mlrNumber: 'XAR-CN-2024-004',
    approvalDate: '2024-04-05',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-cn-content-005',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    category: 'mechanism',
    contentType: '作用机制',
    approvedContent: 'XARELTO是一种选择性Xa因子抑制剂，通过阻断Xa因子的活性位点，减少凝血酶生成，降低血栓形成。',
    mlrNumber: 'XAR-CN-2024-005',
    approvalDate: '2024-04-05',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-cn-content-006',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    category: 'indication',
    contentType: 'NMPA批准的适应症',
    approvedContent: 'XARELTO适用于：房颤患者卒中预防、DVT/PE治疗、DVT/PE复发预防、髋关节/膝关节置换术后VTE预防、以及降低冠心病或外周动脉疾病患者的心血管事件风险。',
    mlrNumber: 'XAR-CN-2024-006',
    approvalDate: '2024-04-05',
    therapeuticArea: 'Cardiovascular'
  },
  {
    id: 'xar-cn-content-007',
    brandId: XARELTO_BRAND_ID,
    market: 'China',
    category: 'disclaimer',
    contentType: '重要安全信息',
    approvedContent: '重要安全信息：XARELTO可能导致严重出血，可能致命。应立即评估出血迹象或症状。活动性病理性出血患者应停用XARELTO。请查阅完整说明书。',
    mlrNumber: 'XAR-CN-2024-007',
    approvalDate: '2024-04-05',
    therapeuticArea: 'Cardiovascular'
  }
];

/**
 * Helper function to get content by market
 */
export const getXareltoContentByMarket = (market) => {
  const normalizedMarket = market.toUpperCase();
  
  switch (normalizedMarket) {
    case 'US':
      return xareltoUSContent;
    case 'GERMANY':
    case 'DE':
      return [...xareltoUSContent, ...xareltoGermanyContent];
    case 'FRANCE':
    case 'FR':
      return [...xareltoUSContent, ...xareltoFranceContent];
    case 'CHINA':
    case 'CN':
      return [...xareltoUSContent, ...xareltochinaContent];
    default:
      console.warn(`[Xarelto] No content found for market: ${market}`);
      return xareltoUSContent;
  }
};

/**
 * Get all content across all markets
 */
export const getAllXareltoContent = () => {
  return [
    ...xareltoUSContent,
    ...xareltoGermanyContent,
    ...xareltoFranceContent,
    ...xareltochinaContent
  ];
};