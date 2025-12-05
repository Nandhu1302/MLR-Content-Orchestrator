/**
 * Entresto (Novartis - Heart Failure) - Pre-Approved Content Library
 * Markets: US, Germany, France, China (45 entries total)
 */

export const EntrestoPreApprovedContent = [
  // ============================================================
  // US MARKET - 8 Pre-Approved Content Items
  // ============================================================
  
  {
    id: 'ent-us-eff-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    category: 'efficacy_claim',
    contentType: 'claim',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO reduced the risk of cardiovascular death by 20% compared to enalapril in the PARADIGM-HF trial.',
    usageGuidelines: 'Use for HCP communications only. Must be accompanied by fair balance and safety information.',
    restrictions: [
      'Cannot be used in direct-to-consumer advertising',
      'Must cite PARADIGM-HF trial',
      'Requires ISI on same page or screen'
    ],
    mlrNumber: 'MLR-ENT-2024-US-0045',
    approvalDate: '2024-01-15',
    expiryDate: '2025-01-15'
  },
  {
    id: 'ent-us-eff-002',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    category: 'efficacy_claim',
    contentType: 'claim',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO reduced the risk of hospitalization for heart failure by 21% compared to enalapril.',
    usageGuidelines: 'Use for HCP email communications and medical education materials.',
    restrictions: [
      'Must include clinical trial context',
      'Requires full ISI inclusion',
      'Cannot stand alone without supporting data'
    ],
    mlrNumber: 'MLR-ENT-2024-US-0067',
    approvalDate: '2024-02-10',
    expiryDate: '2025-02-10'
  },
  {
    id: 'ent-us-mech-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    category: 'mechanism',
    contentType: 'mechanism_of_action',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO (sacubitril/valsartan) is the first-in-class ARNI (Angiotensin Receptor-Neprilysin Inhibitor) that works by simultaneously inhibiting neprilysin and blocking the angiotensin II receptor.',
    usageGuidelines: 'Use in scientific communications, medical education, and HCP materials.',
    restrictions: [
      'Cannot oversimplify mechanism',
      'Must maintain scientific accuracy',
      'Suitable for all HCP audiences'
    ],
    mlrNumber: 'MLR-ENT-2024-US-0023',
    approvalDate: '2023-11-20',
    expiryDate: '2025-11-20'
  },
  {
    id: 'ent-us-safe-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    category: 'safety_info',
    contentType: 'safety_info',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'Most common adverse reactions (≥5% and more frequent than placebo): hypotension (18%), hyperkalemia (12%), renal impairment (14%), cough, and dizziness.',
    usageGuidelines: 'Must appear in all promotional materials.',
    restrictions: [
      'Cannot minimize adverse events',
      'Percentages must be exact as listed',
      'Must include frequency qualifier'
    ],
    mlrNumber: 'MLR-ENT-2024-US-0089',
    approvalDate: '2024-01-05',
    expiryDate: '2025-01-05'
  },
  {
    id: 'ent-us-safe-002',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    category: 'safety_info',
    contentType: 'safety_info',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO is contraindicated in patients with a history of angioedema related to previous ACE inhibitor or ARB therapy. Do not administer ENTRESTO within 36 hours of switching to or from an ACE inhibitor.',
    usageGuidelines: 'Critical safety information. Must be prominently displayed.',
    restrictions: [
      'Cannot be minimized or placed in small print',
      'Must be clearly visible',
      'Required in all formats'
    ],
    mlrNumber: 'MLR-ENT-2024-US-0091',
    approvalDate: '2024-01-05',
    expiryDate: '2025-01-05'
  },
  {
    id: 'ent-us-disc-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    category: 'disclaimer',
    contentType: 'disclaimer',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'Please see full Prescribing Information. For Medical Information inquiries, call 1-888-NOW-NOVA (1-888-669-6682) or visit www.entresto.com.',
    usageGuidelines: 'Include at bottom of all promotional materials, emails, and digital content.',
    restrictions: [
      'Must be clearly visible',
      'Cannot be smaller than 8pt font',
      'Required on every page/screen'
    ],
    mlrNumber: 'MLR-ENT-2024-US-0001',
    approvalDate: '2023-12-01',
    expiryDate: '2025-12-01'
  },
  {
    id: 'ent-us-dose-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    category: 'dosing_info',
    contentType: 'dosing_info',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'The recommended starting dose is 49/51 mg twice daily. Double the dose after 2-4 weeks to the target maintenance dose of 97/103 mg twice daily, as tolerated. For patients not currently taking an ACE inhibitor or ARB, or taking low doses, the starting dose is 24/26 mg twice daily.',
    usageGuidelines: 'Use exact wording from PI for dosing information. Cannot be modified.',
    restrictions: [
      'Cannot alter dosing instructions',
      'Must match package insert verbatim',
      'Include all starting dose options'
    ],
    mlrNumber: 'MLR-ENT-2024-US-0008',
    approvalDate: '2023-12-15',
    expiryDate: '2025-12-15'
  },
  {
    id: 'ent-us-ind-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'US',
    category: 'indication',
    contentType: 'indication',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO is indicated to reduce the risk of cardiovascular death and hospitalization for heart failure in patients with chronic heart failure (NYHA Class II-IV) and reduced ejection fraction.',
    usageGuidelines: 'Exact FDA-approved indication. Use verbatim.',
    restrictions: [
      'Cannot modify indication wording',
      'Must include full indication',
      'Required in all materials'
    ],
    mlrNumber: 'MLR-ENT-2024-US-0002',
    approvalDate: '2023-12-01',
    expiryDate: '2025-12-01'
  },

  // ============================================================
  // GERMANY MARKET - 7 Pre-Approved Content Items
  // ============================================================
  
  {
    id: 'ent-de-eff-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    category: 'efficacy_claim',
    contentType: 'claim',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO reduzierte das Risiko für kardiovaskulären Tod um 20% im Vergleich zu Enalapril in der PARADIGM-HF-Studie.',
    usageGuidelines: 'Nur für Fachinformationen an medizinisches Fachpersonal.',
    restrictions: [
      'Nicht für Patientenmaterialien',
      'Muss PARADIGM-HF-Studie zitieren',
      'Fachinformation-Referenz erforderlich'
    ],
    mlrNumber: 'MLR-ENT-2024-DE-0034',
    approvalDate: '2024-01-22',
    expiryDate: '2025-01-22'
  },
  {
    id: 'ent-de-eff-002',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    category: 'efficacy_claim',
    contentType: 'claim',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO reduzierte das Risiko für Krankenhauseinweisungen wegen Herzinsuffizienz um 21% im Vergleich zu Enalapril.',
    usageGuidelines: 'Für medizinische Fachkreise.',
    restrictions: [
      'Klinischer Kontext erforderlich',
      'Fachinformation-Referenz notwendig'
    ],
    mlrNumber: 'MLR-ENT-2024-DE-0035',
    approvalDate: '2024-01-22',
    expiryDate: '2025-01-22'
  },
  {
    id: 'ent-de-mech-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    category: 'mechanism',
    contentType: 'mechanism_of_action',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO (Sacubitril/Valsartan) ist der erste ARNI (Angiotensin-Rezeptor-Neprilysin-Inhibitor), der gleichzeitig Neprilysin hemmt und den Angiotensin-II-Rezeptor blockiert.',
    usageGuidelines: 'Für wissenschaftliche Kommunikation und medizinische Fortbildung.',
    restrictions: [
      'Wissenschaftliche Genauigkeit erforderlich',
      'Geeignet für alle medizinischen Fachkreise'
    ],
    mlrNumber: 'MLR-ENT-2024-DE-0025',
    approvalDate: '2023-11-28',
    expiryDate: '2025-11-28'
  },
  {
    id: 'ent-de-safe-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    category: 'safety_info',
    contentType: 'safety_info',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'Häufigste Nebenwirkungen (≥5% und häufiger als unter Placebo): Hypotonie (18%), Hyperkaliämie (12%), Nierenfunktionsstörung (14%), Husten und Schwindel.',
    usageGuidelines: 'Pflichtangabe in allen Werbematerialien.',
    restrictions: [
      'Nebenwirkungen dürfen nicht minimiert werden',
      'Prozentangaben müssen exakt sein'
    ],
    mlrNumber: 'MLR-ENT-2024-DE-0078',
    approvalDate: '2024-01-18',
    expiryDate: '2025-01-18'
  },
  {
    id: 'ent-de-disc-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    category: 'disclaimer',
    contentType: 'disclaimer',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'Bitte beachten Sie die vollständige Fachinformation. Für medizinische Anfragen: +49 (0) 911 273-0 oder medinfo.novartis@novartis.com',
    usageGuidelines: 'Pflichtangabe am Ende aller Materialien.',
    restrictions: [
      'Muss gut sichtbar sein',
      'Mindestens 8pt Schriftgröße'
    ],
    mlrNumber: 'MLR-ENT-2024-DE-0002',
    approvalDate: '2023-12-12',
    expiryDate: '2025-12-12'
  },
  {
    id: 'ent-de-dose-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    category: 'dosing_info',
    contentType: 'dosing_info',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'Die empfohlene Anfangsdosis beträgt 49/51 mg zweimal täglich. Nach 2-4 Wochen Verdopplung auf die Zieldosis von 97/103 mg zweimal täglich, soweit verträglich.',
    usageGuidelines: 'Exakter Wortlaut gemäß Fachinformation.',
    restrictions: [
      'Dosierungsanweisungen dürfen nicht geändert werden',
      'Muss mit Packungsbeilage übereinstimmen'
    ],
    mlrNumber: 'MLR-ENT-2024-DE-0009',
    approvalDate: '2023-12-20',
    expiryDate: '2025-12-20'
  },
  {
    id: 'ent-de-ind-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'Germany',
    category: 'indication',
    contentType: 'indication',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO ist indiziert zur Behandlung der chronischen symptomatischen Herzinsuffizienz mit reduzierter Ejektionsfraktion (NYHA-Klasse II-IV).',
    usageGuidelines: 'Exakte Indikation gemäß Fachinformation.',
    restrictions: [
      'Wortlaut darf nicht verändert werden',
      'Pflichtangabe in allen Materialien'
    ],
    mlrNumber: 'MLR-ENT-2024-DE-0001',
    approvalDate: '2023-12-10',
    expiryDate: '2025-12-10'
  },

  // ============================================================
  // FRANCE MARKET - 15 Pre-Approved Content Items (7 new + 8 reuse)
  // ============================================================
  
  {
    id: 'ent-fr-eff-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    category: 'efficacy_claim',
    contentType: 'claim',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO a réduit le risque de mortalité cardiovasculaire de 20% par rapport à l\'énalapril dans l\'étude PARADIGM-HF.',
    usageGuidelines: 'Pour communications professionnelles de santé uniquement.',
    restrictions: [
      'Doit citer l\'étude PARADIGM-HF',
      'Référence au RCP requise'
    ],
    mlrNumber: 'MLR-ENT-2024-FR-0034',
    approvalDate: '2024-02-05',
    expiryDate: '2025-02-05'
  },
  {
    id: 'ent-fr-eff-002',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    category: 'efficacy_claim',
    contentType: 'claim',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO a réduit le risque d\'hospitalisation pour insuffisance cardiaque de 21% par rapport à l\'énalapril.',
    usageGuidelines: 'Pour professionnels de santé.',
    restrictions: [
      'Contexte clinique requis',
      'Référence au RCP nécessaire'
    ],
    mlrNumber: 'MLR-ENT-2024-FR-0035',
    approvalDate: '2024-02-05',
    expiryDate: '2025-02-05'
  },
  {
    id: 'ent-fr-mech-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    category: 'mechanism',
    contentType: 'mechanism_of_action',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO (sacubitril/valsartan) est le premier ARNI (inhibiteur du récepteur de l\'angiotensine et de la néprilysine) qui inhibe simultanément la néprilysine et bloque le récepteur de l\'angiotensine II.',
    usageGuidelines: 'Pour communication scientifique et formation médicale.',
    restrictions: [
      'Exactitude scientifique requise',
      'Adapté à tous les professionnels de santé'
    ],
    mlrNumber: 'MLR-ENT-2024-FR-0025',
    approvalDate: '2024-01-15',
    expiryDate: '2025-01-15'
  },
  {
    id: 'ent-fr-safe-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    category: 'safety_info',
    contentType: 'safety_info',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'Effets indésirables les plus fréquents (≥5% et plus fréquents que sous placebo): hypotension (18%), hyperkaliémie (12%), insuffisance rénale (14%), toux et vertiges.',
    usageGuidelines: 'Mention obligatoire dans tous les supports promotionnels.',
    restrictions: [
      'Les effets indésirables ne doivent pas être minimisés',
      'Les pourcentages doivent être exacts'
    ],
    mlrNumber: 'MLR-ENT-2024-FR-0078',
    approvalDate: '2024-02-01',
    expiryDate: '2025-02-01'
  },
  {
    id: 'ent-fr-disc-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    category: 'disclaimer',
    contentType: 'disclaimer',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'Veuillez consulter le Résumé des Caractéristiques du Produit (RCP) complet. Pour toute information médicale: +33 (0) 1 55 47 66 00 ou medinfo.france@novartis.com',
    usageGuidelines: 'Mention obligatoire à la fin de tous les supports.',
    restrictions: [
      'Doit être bien visible',
      'Taille de police minimale 8pt'
    ],
    mlrNumber: 'MLR-ENT-2024-FR-0002',
    approvalDate: '2024-01-12',
    expiryDate: '2025-01-12'
  },
  {
    id: 'ent-fr-dose-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    category: 'dosing_info',
    contentType: 'dosing_info',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'La dose initiale recommandée est de 49/51 mg deux fois par jour. Doublement de la dose après 2-4 semaines jusqu\'à la dose cible de 97/103 mg deux fois par jour, selon la tolérance.',
    usageGuidelines: 'Formulation exacte selon le RCP.',
    restrictions: [
      'Les instructions posologiques ne peuvent être modifiées',
      'Doit correspondre au RCP'
    ],
    mlrNumber: 'MLR-ENT-2024-FR-0009',
    approvalDate: '2024-01-20',
    expiryDate: '2025-01-20'
  },
  {
    id: 'ent-fr-ind-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'France',
    category: 'indication',
    contentType: 'indication',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO est indiqué dans le traitement de l\'insuffisance cardiaque chronique symptomatique à fraction d\'éjection réduite (classe NYHA II-IV).',
    usageGuidelines: 'Indication exacte selon le RCP.',
    restrictions: [
      'Le libellé ne peut être modifié',
      'Mention obligatoire dans tous les supports'
    ],
    mlrNumber: 'MLR-ENT-2024-FR-0001',
    approvalDate: '2024-01-10',
    expiryDate: '2025-01-10'
  },

  // ============================================================
  // CHINA MARKET - 15 Pre-Approved Content Items (7 new + 8 reuse)
  // ============================================================
  
  {
    id: 'ent-cn-eff-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    category: 'efficacy_claim',
    contentType: 'claim',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO在PARADIGM-HF研究中与依那普利相比，心血管死亡风险降低20%。',
    usageGuidelines: '仅用于医疗专业人士沟通。',
    restrictions: [
      '必须引用PARADIGM-HF研究',
      '需包含药品说明书参考'
    ],
    mlrNumber: 'MLR-ENT-2024-CN-0034',
    approvalDate: '2024-03-01',
    expiryDate: '2025-03-01'
  },
  {
    id: 'ent-cn-eff-002',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    category: 'efficacy_claim',
    contentType: 'claim',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO与依那普利相比，因心力衰竭住院风险降低21%。',
    usageGuidelines: '用于医疗专业人士。',
    restrictions: [
      '需要临床背景',
      '需引用药品说明书'
    ],
    mlrNumber: 'MLR-ENT-2024-CN-0035',
    approvalDate: '2024-03-01',
    expiryDate: '2025-03-01'
  },
  {
    id: 'ent-cn-mech-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    category: 'mechanism',
    contentType: 'mechanism_of_action',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO（沙库巴曲缬沙坦）是首个ARNI（血管紧张素受体-脑啡肽酶抑制剂），同时抑制脑啡肽酶和阻断血管紧张素II受体。',
    usageGuidelines: '用于科学传播和医学教育。',
    restrictions: [
      '需保持科学准确性',
      '适用于所有医疗专业人士'
    ],
    mlrNumber: 'MLR-ENT-2024-CN-0025',
    approvalDate: '2024-02-15',
    expiryDate: '2025-02-15'
  },
  {
    id: 'ent-cn-safe-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    category: 'safety_info',
    contentType: 'safety_info',
    therapeuticArea: 'Cardiovascular',
    approvedContent: '最常见的不良反应（≥5%且较安慰剂更频繁）：低血压（18%）、高钾血症（12%）、肾功能损害（14%）、咳嗽和头晕。',
    usageGuidelines: '所有推广材料中必须提及。',
    restrictions: [
      '不得淡化不良反应',
      '百分比必须准确'
    ],
    mlrNumber: 'MLR-ENT-2024-CN-0078',
    approvalDate: '2024-03-05',
    expiryDate: '2025-03-05'
  },
  {
    id: 'ent-cn-disc-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    category: 'disclaimer',
    contentType: 'disclaimer',
    therapeuticArea: 'Cardiovascular',
    approvedContent: '请查阅完整药品说明书。医学信息咨询：400-XXX-XXXX或medinfo.china@novartis.com',
    usageGuidelines: '所有材料末尾必须包含。',
    restrictions: [
      '必须清晰可见',
      '最小字体8磅'
    ],
    mlrNumber: 'MLR-ENT-2024-CN-0002',
    approvalDate: '2024-02-12',
    expiryDate: '2025-02-12'
  },
  {
    id: 'ent-cn-dose-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    category: 'dosing_info',
    contentType: 'dosing_info',
    therapeuticArea: 'Cardiovascular',
    approvedContent: '推荐起始剂量为49/51毫克，每日两次。2-4周后加倍至目标维持剂量97/103毫克，每日两次（根据耐受性）。',
    usageGuidelines: '按照药品说明书的确切措辞。',
    restrictions: [
      '不得更改给药说明',
      '必须与药品说明书一致'
    ],
    mlrNumber: 'MLR-ENT-2024-CN-0009',
    approvalDate: '2024-02-20',
    expiryDate: '2025-02-20'
  },
  {
    id: 'ent-cn-ind-001',
    brandId: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
    market: 'China',
    category: 'indication',
    contentType: 'indication',
    therapeuticArea: 'Cardiovascular',
    approvedContent: 'ENTRESTO适用于治疗射血分数降低的慢性症状性心力衰竭（NYHA II-IV级）。',
    usageGuidelines: '按照药品说明书的确切适应症。',
    restrictions: [
      '不得更改适应症措辞',
      '所有材料中必须包含'
    ],
    mlrNumber: 'MLR-ENT-2024-CN-0001',
    approvalDate: '2024-02-10',
    expiryDate: '2025-02-10'
  }
];

/**
 * Helper function to get pre-approved content by market
 */
export const getEntrestoContentByMarket = (market) => {
  return EntrestoPreApprovedContent.filter(content => content.market === market);
};

/**
 * Helper function to get pre-approved content by category
 */
export const getEntrestoContentByCategory = (
  market,
  category
) => {
  return EntrestoPreApprovedContent.filter(
    content => content.market === market && content.category === category
  );
};

/**
 * Helper function to search content by keyword
 */
export const searchEntrestoContent = (market, keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  return EntrestoPreApprovedContent.filter(
    content =>
      content.market === market &&
      (content.approvedContent.toLowerCase().includes(lowerKeyword) ||
        content.contentType.toLowerCase().includes(lowerKeyword))
  );
};