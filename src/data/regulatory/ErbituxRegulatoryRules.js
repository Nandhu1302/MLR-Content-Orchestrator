// Erbitux (Merck KGaA - Oncology) Regulatory Rules for Glocalization
// Source Market: US | Target Markets: Germany, France, China
// Indication: Metastatic Colorectal Cancer (mCRC), Squamous Cell Carcinoma of Head & Neck (SCCHN)

/**
 * @typedef {object} ErbituxRegulatoryRule
 * @property {string} id
 * @property {string} ruleId
 * @property {'MUST_CHANGE' | 'CANNOT_CHANGE' | 'SHOULD_CHANGE'} ruleType
 * @property {string} sourceMarket
 * @property {string} targetMarket
 * @property {string} category
 * @property {string} description
 * @property {string} rationale
 * @property {string} [exampleBefore]
 * @property {string} [exampleAfter]
 * @property {string} [regulatoryReference]
 * @property {string} therapeuticArea
 * @property {string} [indication]
 */

export const ErbituxRegulatoryRules = [
  // ============================================================
  // US → GERMANY (DE) - 30 Rules (10 MUST + 10 CANNOT + 10 SHOULD)
  // ============================================================

  // MUST_CHANGE Rules (10)
  {
    id: 'erb-us-de-must-001',
    ruleId: 'REG_BODY_REPLACEMENT',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Regulatory Authority',
    description: 'Replace FDA with EMA and BfArM',
    rationale: 'German market operates under EMA and BfArM (Bundesinstitut für Arzneimittel) jurisdiction',
    exampleBefore: 'FDA-approved for RAS wild-type mCRC',
    exampleAfter: 'EMA/BfArM-zugelassen für RAS-Wildtyp mCRC',
    regulatoryReference: 'EMA/H/C/000558',
    therapeuticArea: 'Oncology',
    indication: 'Colorectal Cancer'
  },
  {
    id: 'erb-us-de-must-002',
    ruleId: 'MEDICAL_TERMINOLOGY_TRANSLATION',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Language & Terminology',
    description: 'Translate all oncology terminology to German',
    rationale: 'German oncologists require precise medical terminology in German',
    exampleBefore: 'Metastatic colorectal cancer',
    exampleAfter: 'Metastasiertes kolorektales Karzinom',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-must-003',
    ruleId: 'CONTACT_INFO_LOCALIZATION',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Contact Information',
    description: 'Replace US contact information with German medical information',
    rationale: 'German healthcare professionals need local German-language support',
    exampleBefore: 'Medical Information: 1-800-ERBITUX',
    exampleAfter: 'Medizinische Information: +49 (0) 6151 72 5200',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-must-004',
    ruleId: 'CLINICAL_TRIAL_REFERENCES',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Clinical Evidence',
    description: 'Update clinical trial references to include European studies',
    rationale: 'German regulatory requirements emphasize European clinical data (CRYSTAL, OPUS, FLEX studies)',
    exampleBefore: 'Based on US pivotal trials',
    exampleAfter: 'Basierend auf europäischen zulassungsrelevanten Studien (CRYSTAL, OPUS)',
    regulatoryReference: 'EudraCT database',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-must-005',
    ruleId: 'DATE_FORMAT_CHANGE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Formatting Standards',
    description: 'Change date format from MM/DD/YYYY to DD.MM.YYYY',
    rationale: 'German standard date format',
    exampleBefore: '03/15/2024',
    exampleAfter: '15.03.2024',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-must-006',
    ruleId: 'PRESCRIBING_INFO_REPLACEMENT',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Regulatory Documentation',
    description: 'Replace US Prescribing Information with German Fachinformation',
    rationale: 'German market requires Fachinformation (SmPC)',
    exampleBefore: 'See Full Prescribing Information',
    exampleAfter: 'Siehe vollständige Fachinformation',
    regulatoryReference: 'BfArM Fachinformation',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-must-007',
    ruleId: 'PHARMACOVIGILANCE_UPDATE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Safety Reporting',
    description: 'Update adverse event reporting for German pharmacovigilance',
    rationale: 'Germany follows EMA pharmacovigilance and BfArM reporting',
    exampleBefore: 'Report adverse events to FDA MedWatch',
    exampleAfter: 'Meldung von Nebenwirkungen an BfArM oder EMA',
    regulatoryReference: 'BfArM UAW-Meldung',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-must-008',
    ruleId: 'PROFESSIONAL_SOCIETIES',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Professional References',
    description: 'Reference German oncology societies (DKG, DGHO)',
    rationale: 'German oncology community values DKG (Deutsche Krebsgesellschaft) guidelines',
    exampleBefore: 'Per ASCO guidelines',
    exampleAfter: 'Gemäß DKG S3-Leitlinien für kolorektales Karzinom',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-must-009',
    ruleId: 'WEBSITE_DOMAIN_UPDATE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Digital Presence',
    description: 'Replace US website URLs with German .de domain',
    rationale: 'German HCPs expect localized German website',
    exampleBefore: 'Visit www.erbitux.com',
    exampleAfter: 'Besuchen Sie www.erbitux.de',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-must-010',
    ruleId: 'REIMBURSEMENT_LANGUAGE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Healthcare System',
    description: 'Update reimbursement language for German health insurance (GKV)',
    rationale: 'German healthcare operates on GKV statutory insurance model',
    exampleBefore: 'Covered by Medicare Part B',
    exampleAfter: 'Erstattungsfähig im Rahmen der GKV für zugelassene Indikationen',
    therapeuticArea: 'Oncology'
  },

  // CANNOT_CHANGE Rules (10)
  {
    id: 'erb-us-de-cannot-001',
    ruleId: 'MECHANISM_OF_ACTION',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Mechanism of Action',
    description: 'EGFR targeting mechanism',
    rationale: 'Core EGFR inhibition mechanism is scientifically established',
    exampleBefore: 'Cetuximab binds to EGFR',
    exampleAfter: 'Cetuximab bindet an EGFR (translation only)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-cannot-002',
    ruleId: 'PRIMARY_INDICATION',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Approved Indication',
    description: 'RAS wild-type mCRC indication',
    rationale: 'EMA-approved indication identical to FDA for RAS wild-type',
    exampleBefore: 'For RAS wild-type mCRC',
    exampleAfter: 'Für RAS-Wildtyp mCRC (same indication)',
    regulatoryReference: 'EMA/H/C/000558',
    therapeuticArea: 'Oncology',
    indication: 'Colorectal Cancer'
  },
  {
    id: 'erb-us-de-cannot-003',
    ruleId: 'STANDARD_DOSING',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Dosing',
    description: 'Standard dosing regimen (400mg/m² initial, 250mg/m² weekly)',
    rationale: 'Approved dosing identical across FDA and EMA',
    exampleBefore: '400mg/m² loading, then 250mg/m² weekly',
    exampleAfter: '400mg/m² Initialdosis, dann 250mg/m² wöchentlich (same dosing)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-cannot-004',
    ruleId: 'CLINICAL_EFFICACY_DATA',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Clinical Evidence',
    description: 'Survival benefit data from CRYSTAL/OPUS trials',
    rationale: 'Clinical trial outcomes scientifically validated',
    exampleBefore: 'PFS benefit in CRYSTAL trial',
    exampleAfter: 'PFS-Vorteil in CRYSTAL-Studie (same data)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-cannot-005',
    ruleId: 'ADVERSE_EVENT_PROFILE',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Safety Profile',
    description: 'Infusion reactions, skin toxicity (acneiform rash)',
    rationale: 'Safety data from clinical trials is universal',
    exampleBefore: 'Grade 3+ skin reactions in 16%',
    exampleAfter: 'Grad 3+ Hautreaktionen bei 16% (same data)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-cannot-006',
    ruleId: 'CONTRAINDICATIONS',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Contraindications',
    description: 'Hypersensitivity to cetuximab',
    rationale: 'Contraindications medically absolute',
    exampleBefore: 'Contraindicated in severe hypersensitivity',
    exampleAfter: 'Kontraindiziert bei schwerer Überempfindlichkeit (same contraindication)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-cannot-007',
    ruleId: 'BIOMARKER_REQUIREMENT',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Biomarker Testing',
    description: 'RAS mutation testing requirement',
    rationale: 'RAS wild-type requirement is absolute for indication',
    exampleBefore: 'RAS mutation status must be determined',
    exampleAfter: 'RAS-Mutationsstatus muss bestimmt werden (same requirement)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-cannot-008',
    ruleId: 'DRUG_INTERACTIONS',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Drug Interactions',
    description: 'Interaction with irinotecan (FOLFIRI regimen)',
    rationale: 'Pharmacokinetic interactions scientifically established',
    exampleBefore: 'Used with irinotecan-based chemotherapy',
    exampleAfter: 'Anwendung mit Irinotecan-basierter Chemotherapie (same interaction)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-cannot-009',
    ruleId: 'PREGNANCY_WARNING',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Special Populations',
    description: 'Pregnancy warning (fetal harm)',
    rationale: 'Pregnancy safety data requires consistent global messaging',
    exampleBefore: 'Can cause fetal harm',
    exampleAfter: 'Kann fetale Schäden verursachen (same warning)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-cannot-010',
    ruleId: 'MOLECULAR_STRUCTURE',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Pharmacology',
    description: 'Chimeric monoclonal antibody (IgG1) structure',
    rationale: 'Molecular structure is universal scientific fact',
    exampleBefore: 'Chimeric IgG1 monoclonal antibody',
    exampleAfter: 'Chimärer IgG1-monoklonaler Antikörper (same structure)',
    therapeuticArea: 'Oncology'
  },

  // SHOULD_CHANGE Rules (10)
  {
    id: 'erb-us-de-should-001',
    ruleId: 'FORMAL_COMMUNICATION',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Communication Tone',
    description: 'Use formal German "Sie" form',
    rationale: 'German medical communication requires formal address',
    exampleBefore: 'Talk to your doctor',
    exampleAfter: 'Sprechen Sie mit Ihrem Arzt',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-should-002',
    ruleId: 'EVIDENCE_BASED_EMPHASIS',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Medical Culture',
    description: 'Emphasize evidence-based oncology and S3-Leitlinien',
    rationale: 'German oncology values guideline-based treatment',
    exampleBefore: 'Effective treatment option',
    exampleAfter: 'Evidenzbasierte Therapieoption gemäß S3-Leitlinien',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-should-003',
    ruleId: 'MDT_DISCUSSION',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Care Delivery',
    description: 'Reference multidisciplinary tumor board (MTB) discussions',
    rationale: 'German oncology emphasizes MTB decision-making',
    exampleBefore: 'Consult with your oncologist',
    exampleAfter: 'Entscheidung im interdisziplinären Tumorboard empfohlen',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-should-004',
    ruleId: 'QUALITY_OF_LIFE',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Patient Outcomes',
    description: 'Include quality of life and symptom control data',
    rationale: 'German oncology values holistic patient outcomes',
    exampleBefore: 'Survival benefit demonstrated',
    exampleAfter: 'Überlebensvorteil und Verbesserung der Lebensqualität nachgewiesen',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-should-005',
    ruleId: 'REGISTRY_DATA',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Real-World Evidence',
    description: 'Reference German cancer registry data',
    rationale: 'German oncologists value real-world German data',
    exampleBefore: 'Clinical trial outcomes',
    exampleAfter: 'Klinische Studiendaten und deutsche Registerdaten',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-should-006',
    ruleId: 'SKIN_TOXICITY_MANAGEMENT',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Adverse Event Management',
    description: 'Emphasize proactive skin toxicity management',
    rationale: 'German dermatology-oncology collaboration for EGFR skin toxicity',
    exampleBefore: 'Skin reactions may occur',
    exampleAfter: 'Hautreaktionen erfordern proaktives Management durch Dermatologen',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-should-007',
    ruleId: 'COST_EFFECTIVENESS',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Health Economics',
    description: 'Include cost-effectiveness and IQWiG data',
    rationale: 'German healthcare system values health economic assessments',
    exampleBefore: 'Effective treatment',
    exampleAfter: 'Kosteneffektive Therapie mit positiver IQWiG-Bewertung',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-should-008',
    ruleId: 'INFUSION_REACTION_PROTOCOL',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Administration',
    description: 'Detail German-standard infusion reaction protocols',
    rationale: 'German infusion centers follow specific protocols',
    exampleBefore: 'Premedication recommended',
    exampleAfter: 'Prämedikation gemäß Klinikprotokoll erforderlich',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-should-009',
    ruleId: 'BIOMARKER_TESTING_ACCESS',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Diagnostic Testing',
    description: 'Reference German pathology laboratory network',
    rationale: 'German molecular pathology infrastructure for RAS testing',
    exampleBefore: 'RAS testing available',
    exampleAfter: 'RAS-Testung über qualifizierte molekularpathologische Labore',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-de-should-010',
    ruleId: 'LONG_TERM_OUTCOMES',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'Germany',
    category: 'Treatment Duration',
    description: 'Emphasize long-term survival and follow-up data',
    rationale: 'German oncology values long-term outcome data',
    exampleBefore: 'Survival benefit shown',
    exampleAfter: 'Langzeit-Überlebensdaten über 5 Jahre verfügbar',
    therapeuticArea: 'Oncology'
  },

  // ============================================================
  // US → FRANCE (FR) - 30 Rules (10 MUST + 10 CANNOT + 10 SHOULD)
  // ============================================================

  // MUST_CHANGE Rules (10)
  {
    id: 'erb-us-fr-must-001',
    ruleId: 'REG_BODY_REPLACEMENT',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Regulatory Authority',
    description: 'Replace FDA with EMA and ANSM',
    rationale: 'French market operates under EMA and ANSM (Agence nationale de sécurité du médicament) jurisdiction',
    exampleBefore: 'FDA-approved for RAS wild-type mCRC',
    exampleAfter: 'EMA/ANSM-approuvé pour mCRC RAS sauvage',
    regulatoryReference: 'EMA/H/C/000558',
    therapeuticArea: 'Oncology',
    indication: 'Colorectal Cancer'
  },
  {
    id: 'erb-us-fr-must-002',
    ruleId: 'MEDICAL_TERMINOLOGY_TRANSLATION',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Language & Terminology',
    description: 'Translate all oncology terminology to French',
    rationale: 'French oncologists require precise medical terminology in French',
    exampleBefore: 'Metastatic colorectal cancer',
    exampleAfter: 'Cancer colorectal métastatique',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-must-003',
    ruleId: 'CONTACT_INFO_LOCALIZATION',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Contact Information',
    description: 'Replace US contact information with French medical information',
    rationale: 'French healthcare professionals need local French-language support',
    exampleBefore: 'Medical Information: 1-800-ERBITUX',
    exampleAfter: 'Information Médicale: +33 (0) 1 47 48 21 00',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-must-004',
    ruleId: 'CLINICAL_TRIAL_REFERENCES',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Clinical Evidence',
    description: 'Update clinical trial references to include European/French studies',
    rationale: 'French regulatory requirements emphasize European clinical data',
    exampleBefore: 'Based on US pivotal trials',
    exampleAfter: 'Basé sur les études européennes pivots (CRYSTAL, OPUS)',
    regulatoryReference: 'EudraCT database',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-must-005',
    ruleId: 'DATE_FORMAT_CHANGE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Formatting Standards',
    description: 'Change date format from MM/DD/YYYY to DD/MM/YYYY',
    rationale: 'French standard date format',
    exampleBefore: '03/15/2024',
    exampleAfter: '15/03/2024',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-must-006',
    ruleId: 'PRESCRIBING_INFO_REPLACEMENT',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Regulatory Documentation',
    description: 'Replace US Prescribing Information with French RCP',
    rationale: 'French market requires RCP (Résumé des Caractéristiques du Produit)',
    exampleBefore: 'See Full Prescribing Information',
    exampleAfter: 'Voir le RCP complet',
    regulatoryReference: 'ANSM RCP',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-must-007',
    ruleId: 'PHARMACOVIGILANCE_UPDATE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Safety Reporting',
    description: 'Update adverse event reporting for French pharmacovigilance',
    rationale: 'France follows EMA pharmacovigilance and ANSM reporting',
    exampleBefore: 'Report adverse events to FDA MedWatch',
    exampleAfter: 'Déclaration des effets indésirables à l\'ANSM ou l\'EMA',
    regulatoryReference: 'ANSM pharmacovigilance',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-must-008',
    ruleId: 'PROFESSIONAL_SOCIETIES',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Professional References',
    description: 'Reference French oncology societies (FFCD, GERCOR)',
    rationale: 'French oncology community values FFCD guidelines',
    exampleBefore: 'Per ASCO guidelines',
    exampleAfter: 'Selon les recommandations FFCD/GERCOR',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-must-009',
    ruleId: 'WEBSITE_DOMAIN_UPDATE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Digital Presence',
    description: 'Replace US website URLs with French .fr domain',
    rationale: 'French HCPs expect localized French website',
    exampleBefore: 'Visit www.erbitux.com',
    exampleAfter: 'Visitez www.erbitux.fr',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-must-010',
    ruleId: 'REIMBURSEMENT_LANGUAGE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Healthcare System',
    description: 'Update reimbursement language for French health insurance (Sécurité Sociale)',
    rationale: 'French healthcare operates on universal coverage model',
    exampleBefore: 'Covered by Medicare Part B',
    exampleAfter: 'Pris en charge par la Sécurité Sociale pour les indications approuvées',
    therapeuticArea: 'Oncology'
  },

  // CANNOT_CHANGE Rules (10)
  {
    id: 'erb-us-fr-cannot-001',
    ruleId: 'MECHANISM_OF_ACTION',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Mechanism of Action',
    description: 'EGFR targeting mechanism',
    rationale: 'Core EGFR inhibition mechanism is scientifically established',
    exampleBefore: 'Cetuximab binds to EGFR',
    exampleAfter: 'Le cétuximab se lie à l\'EGFR (translation only)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-cannot-002',
    ruleId: 'PRIMARY_INDICATION',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Approved Indication',
    description: 'RAS wild-type mCRC indication',
    rationale: 'EMA-approved indication identical to FDA for RAS wild-type',
    exampleBefore: 'For RAS wild-type mCRC',
    exampleAfter: 'Pour le mCRC RAS sauvage (same indication)',
    regulatoryReference: 'EMA/H/C/000558',
    therapeuticArea: 'Oncology',
    indication: 'Colorectal Cancer'
  },
  {
    id: 'erb-us-fr-cannot-003',
    ruleId: 'STANDARD_DOSING',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Dosing',
    description: 'Standard dosing regimen (400mg/m² initial, 250mg/m² weekly)',
    rationale: 'Approved dosing identical across FDA and EMA',
    exampleBefore: '400mg/m² loading, then 250mg/m² weekly',
    exampleAfter: '400mg/m² dose initiale, puis 250mg/m² hebdomadaire (same dosing)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-cannot-004',
    ruleId: 'CLINICAL_EFFICACY_DATA',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Clinical Evidence',
    description: 'Survival benefit data from CRYSTAL/OPUS trials',
    rationale: 'Clinical trial outcomes scientifically validated',
    exampleBefore: 'PFS benefit in CRYSTAL trial',
    exampleAfter: 'Bénéfice de SSP dans l\'étude CRYSTAL (same data)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-cannot-005',
    ruleId: 'ADVERSE_EVENT_PROFILE',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Safety Profile',
    description: 'Infusion reactions, skin toxicity (acneiform rash)',
    rationale: 'Safety data from clinical trials is universal',
    exampleBefore: 'Grade 3+ skin reactions in 16%',
    exampleAfter: 'Réactions cutanées grade 3+ chez 16% (same data)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-cannot-006',
    ruleId: 'CONTRAINDICATIONS',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Contraindications',
    description: 'Hypersensitivity to cetuximab',
    rationale: 'Contraindications medically absolute',
    exampleBefore: 'Contraindicated in severe hypersensitivity',
    exampleAfter: 'Contre-indiqué en cas d\'hypersensibilité sévère (same contraindication)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-cannot-007',
    ruleId: 'BIOMARKER_REQUIREMENT',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Biomarker Testing',
    description: 'RAS mutation testing requirement',
    rationale: 'RAS wild-type requirement is absolute for indication',
    exampleBefore: 'RAS mutation status must be determined',
    exampleAfter: 'Le statut mutationnel RAS doit être déterminé (same requirement)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-cannot-008',
    ruleId: 'DRUG_INTERACTIONS',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Drug Interactions',
    description: 'Interaction with irinotecan (FOLFIRI regimen)',
    rationale: 'Pharmacokinetic interactions scientifically established',
    exampleBefore: 'Used with irinotecan-based chemotherapy',
    exampleAfter: 'Utilisé avec chimiothérapie à base d\'irinotécan (same interaction)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-cannot-009',
    ruleId: 'PREGNANCY_WARNING',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Special Populations',
    description: 'Pregnancy warning (fetal harm)',
    rationale: 'Pregnancy safety data requires consistent global messaging',
    exampleBefore: 'Can cause fetal harm',
    exampleAfter: 'Peut causer des dommages fœtaux (same warning)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-cannot-010',
    ruleId: 'MOLECULAR_STRUCTURE',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Pharmacology',
    description: 'Chimeric monoclonal antibody (IgG1) structure',
    rationale: 'Molecular structure is universal scientific fact',
    exampleBefore: 'Chimeric IgG1 monoclonal antibody',
    exampleAfter: 'Anticorps monoclonal chimérique IgG1 (same structure)',
    therapeuticArea: 'Oncology'
  },

  // SHOULD_CHANGE Rules (10)
  {
    id: 'erb-us-fr-should-001',
    ruleId: 'FORMAL_COMMUNICATION',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Communication Tone',
    description: 'Use formal French "Vous" form',
    rationale: 'French medical communication requires formal address',
    exampleBefore: 'Talk to your doctor',
    exampleAfter: 'Parlez à votre médecin',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-should-002',
    ruleId: 'EVIDENCE_BASED_EMPHASIS',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Medical Culture',
    description: 'Emphasize evidence-based oncology and French guidelines',
    rationale: 'French oncology values guideline-based treatment',
    exampleBefore: 'Effective treatment option',
    exampleAfter: 'Option thérapeutique fondée sur les données probantes selon les recommandations françaises',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-should-003',
    ruleId: 'RCP_DISCUSSION',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Care Delivery',
    description: 'Reference multidisciplinary RCP discussions',
    rationale: 'French oncology emphasizes RCP (Réunion de Concertation Pluridisciplinaire) decision-making',
    exampleBefore: 'Consult with your oncologist',
    exampleAfter: 'Décision recommandée en RCP',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-should-004',
    ruleId: 'QUALITY_OF_LIFE',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Patient Outcomes',
    description: 'Include quality of life data',
    rationale: 'French oncology values holistic patient outcomes',
    exampleBefore: 'Survival benefit demonstrated',
    exampleAfter: 'Bénéfice de survie et amélioration de la qualité de vie démontrés',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-should-005',
    ruleId: 'HAS_REFERENCE',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Health Economics',
    description: 'Reference HAS (Haute Autorité de Santé) evaluation',
    rationale: 'French oncologists value HAS assessments',
    exampleBefore: 'Clinical trial outcomes',
    exampleAfter: 'Données cliniques et évaluation positive de la HAS',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-should-006',
    ruleId: 'SKIN_TOXICITY_MANAGEMENT',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Adverse Event Management',
    description: 'Emphasize proactive skin toxicity management',
    rationale: 'French dermatology-oncology collaboration for EGFR skin toxicity',
    exampleBefore: 'Skin reactions may occur',
    exampleAfter: 'Les réactions cutanées nécessitent une prise en charge proactive dermatologique',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-should-007',
    ruleId: 'TRANSPARENCY_COMMISSION',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Health Economics',
    description: 'Include SMR/ASMR ratings from Commission de la Transparence',
    rationale: 'French healthcare system relies on these official ratings',
    exampleBefore: 'Effective treatment',
    exampleAfter: 'Traitement avec SMR important et ASMR reconnu',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-should-008',
    ruleId: 'INFUSION_REACTION_PROTOCOL',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Administration',
    description: 'Detail French-standard infusion reaction protocols',
    rationale: 'French infusion centers follow specific protocols',
    exampleBefore: 'Premedication recommended',
    exampleAfter: 'Prémédication obligatoire selon protocole français',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-should-009',
    ruleId: 'BIOMARKER_TESTING_ACCESS',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Diagnostic Testing',
    description: 'Reference French molecular pathology network (INCa)',
    rationale: 'French molecular pathology infrastructure for RAS testing',
    exampleBefore: 'RAS testing available',
    exampleAfter: 'Test RAS disponible via réseau INCa de biologie moléculaire',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-fr-should-010',
    ruleId: 'LONG_TERM_OUTCOMES',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'France',
    category: 'Treatment Duration',
    description: 'Emphasize long-term survival and follow-up data',
    rationale: 'French oncology values long-term outcome data',
    exampleBefore: 'Survival benefit shown',
    exampleAfter: 'Données de survie à long terme sur 5 ans disponibles',
    therapeuticArea: 'Oncology'
  },

  // ============================================================
  // US → CHINA (CN) - 30 Rules (10 MUST + 10 CANNOT + 10 SHOULD)
  // ============================================================

  // MUST_CHANGE Rules (10)
  {
    id: 'erb-us-cn-must-001',
    ruleId: 'REG_BODY_REPLACEMENT',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Regulatory Authority',
    description: 'Replace FDA with NMPA',
    rationale: 'Chinese market operates under NMPA (National Medical Products Administration) jurisdiction',
    exampleBefore: 'FDA-approved for RAS wild-type mCRC',
    exampleAfter: 'NMPA批准用于RAS野生型转移性结直肠癌',
    regulatoryReference: 'NMPA approval',
    therapeuticArea: 'Oncology',
    indication: 'Colorectal Cancer'
  },
  {
    id: 'erb-us-cn-must-002',
    ruleId: 'MEDICAL_TERMINOLOGY_TRANSLATION',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Language & Terminology',
    description: 'Translate all oncology terminology to Simplified Chinese',
    rationale: 'Chinese oncologists require precise medical terminology in Simplified Chinese',
    exampleBefore: 'Metastatic colorectal cancer',
    exampleAfter: '转移性结直肠癌',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-must-003',
    ruleId: 'CONTACT_INFO_LOCALIZATION',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Contact Information',
    description: 'Replace US contact information with Chinese medical information hotline',
    rationale: 'Chinese healthcare professionals need local Chinese-language support',
    exampleBefore: 'Medical Information: 1-800-ERBITUX',
    exampleAfter: '医学信息热线：400-XXX-XXXX',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-must-004',
    ruleId: 'CLINICAL_TRIAL_REFERENCES',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Clinical Evidence',
    description: 'Include Chinese bridging studies alongside global trials',
    rationale: 'Chinese regulatory requirements emphasize Chinese clinical data',
    exampleBefore: 'Based on US pivotal trials',
    exampleAfter: '基于全球关键研究及中国桥接试验',
    regulatoryReference: 'NMPA bridging studies',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-must-005',
    ruleId: 'DATE_FORMAT_CHANGE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Formatting Standards',
    description: 'Change date format from MM/DD/YYYY to YYYY-MM-DD',
    rationale: 'Chinese standard date format (ISO 8601)',
    exampleBefore: '03/15/2024',
    exampleAfter: '2024-03-15',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-must-006',
    ruleId: 'PRESCRIBING_INFO_REPLACEMENT',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Regulatory Documentation',
    description: 'Replace US Prescribing Information with Chinese package insert',
    rationale: 'Chinese market requires NMPA-approved package insert (说明书)',
    exampleBefore: 'See Full Prescribing Information',
    exampleAfter: '详见完整说明书',
    regulatoryReference: 'NMPA package insert',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-must-007',
    ruleId: 'PHARMACOVIGILANCE_UPDATE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Safety Reporting',
    description: 'Update adverse event reporting for Chinese pharmacovigilance system',
    rationale: 'China follows NMPA pharmacovigilance reporting',
    exampleBefore: 'Report adverse events to FDA MedWatch',
    exampleAfter: '向国家药品不良反应监测中心报告不良反应',
    regulatoryReference: 'NMPA ADR reporting',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-must-008',
    ruleId: 'PROFESSIONAL_SOCIETIES',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Professional References',
    description: 'Reference Chinese oncology societies (CSCO guidelines)',
    rationale: 'Chinese oncology community values CSCO (Chinese Society of Clinical Oncology) guidelines',
    exampleBefore: 'Per ASCO guidelines',
    exampleAfter: '根据CSCO结直肠癌诊疗指南',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-must-009',
    ruleId: 'WEBSITE_DOMAIN_UPDATE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Digital Presence',
    description: 'Replace US website URLs with Chinese .com.cn domain or WeChat',
    rationale: 'Chinese HCPs expect localized Chinese website or WeChat mini-program',
    exampleBefore: 'Visit www.erbitux.com',
    exampleAfter: '访问www.erbitux.com.cn或关注微信公众号',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-must-010',
    ruleId: 'REIMBURSEMENT_LANGUAGE',
    ruleType: 'MUST_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Healthcare System',
    description: 'Update reimbursement language for Chinese health insurance (NRDL)',
    rationale: 'Chinese healthcare operates on National Reimbursement Drug List (NRDL) system',
    exampleBefore: 'Covered by Medicare Part B',
    exampleAfter: '已纳入国家医保目录，按照当地医保政策报销',
    therapeuticArea: 'Oncology'
  },

  // CANNOT_CHANGE Rules (10)
  {
    id: 'erb-us-cn-cannot-001',
    ruleId: 'MECHANISM_OF_ACTION',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Mechanism of Action',
    description: 'EGFR targeting mechanism',
    rationale: 'Core EGFR inhibition mechanism is scientifically established',
    exampleBefore: 'Cetuximab binds to EGFR',
    exampleAfter: '西妥昔单抗与EGFR结合 (translation only)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-cannot-002',
    ruleId: 'PRIMARY_INDICATION',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Approved Indication',
    description: 'RAS wild-type mCRC indication',
    rationale: 'NMPA-approved indication for RAS wild-type',
    exampleBefore: 'For RAS wild-type mCRC',
    exampleAfter: '用于RAS野生型转移性结直肠癌 (same indication)',
    regulatoryReference: 'NMPA approval',
    therapeuticArea: 'Oncology',
    indication: 'Colorectal Cancer'
  },
  {
    id: 'erb-us-cn-cannot-003',
    ruleId: 'STANDARD_DOSING',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Dosing',
    description: 'Standard dosing regimen (400mg/m² initial, 250mg/m² weekly)',
    rationale: 'Approved dosing identical across global markets',
    exampleBefore: '400mg/m² loading, then 250mg/m² weekly',
    exampleAfter: '初始剂量400mg/m²，然后每周250mg/m² (same dosing)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-cannot-004',
    ruleId: 'CLINICAL_EFFICACY_DATA',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Clinical Evidence',
    description: 'Survival benefit data from CRYSTAL/OPUS trials',
    rationale: 'Clinical trial outcomes scientifically validated',
    exampleBefore: 'PFS benefit in CRYSTAL trial',
    exampleAfter: 'CRYSTAL研究显示PFS获益 (same data)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-cannot-005',
    ruleId: 'ADVERSE_EVENT_PROFILE',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Safety Profile',
    description: 'Infusion reactions, skin toxicity (acneiform rash)',
    rationale: 'Safety data from clinical trials is universal',
    exampleBefore: 'Grade 3+ skin reactions in 16%',
    exampleAfter: '16%患者出现3级以上皮肤反应 (same data)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-cannot-006',
    ruleId: 'CONTRAINDICATIONS',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Contraindications',
    description: 'Hypersensitivity to cetuximab',
    rationale: 'Contraindications medically absolute',
    exampleBefore: 'Contraindicated in severe hypersensitivity',
    exampleAfter: '对西妥昔单抗严重过敏者禁用 (same contraindication)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-cannot-007',
    ruleId: 'BIOMARKER_REQUIREMENT',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Biomarker Testing',
    description: 'RAS mutation testing requirement',
    rationale: 'RAS wild-type requirement is absolute for indication',
    exampleBefore: 'RAS mutation status must be determined',
    exampleAfter: '必须检测RAS突变状态 (same requirement)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-cannot-008',
    ruleId: 'DRUG_INTERACTIONS',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Drug Interactions',
    description: 'Interaction with irinotecan (FOLFIRI regimen)',
    rationale: 'Pharmacokinetic interactions scientifically established',
    exampleBefore: 'Used with irinotecan-based chemotherapy',
    exampleAfter: '与伊立替康化疗联合使用 (same interaction)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-cannot-009',
    ruleId: 'PREGNANCY_WARNING',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Special Populations',
    description: 'Pregnancy warning (fetal harm)',
    rationale: 'Pregnancy safety data requires consistent global messaging',
    exampleBefore: 'Can cause fetal harm',
    exampleAfter: '可能导致胎儿损害 (same warning)',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-cannot-010',
    ruleId: 'MOLECULAR_STRUCTURE',
    ruleType: 'CANNOT_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Pharmacology',
    description: 'Chimeric monoclonal antibody (IgG1) structure',
    rationale: 'Molecular structure is universal scientific fact',
    exampleBefore: 'Chimeric IgG1 monoclonal antibody',
    exampleAfter: '嵌合型IgG1单克隆抗体 (same structure)',
    therapeuticArea: 'Oncology'
  },

  // SHOULD_CHANGE Rules (10)
  {
    id: 'erb-us-cn-should-001',
    ruleId: 'FORMAL_COMMUNICATION',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Communication Tone',
    description: 'Use formal Chinese communication style',
    rationale: 'Chinese medical communication requires respectful professional tone',
    exampleBefore: 'Talk to your doctor',
    exampleAfter: '请咨询您的医生',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-should-002',
    ruleId: 'EVIDENCE_BASED_EMPHASIS',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Medical Culture',
    description: 'Emphasize evidence-based oncology and CSCO guidelines',
    rationale: 'Chinese oncology values CSCO guideline-based treatment',
    exampleBefore: 'Effective treatment option',
    exampleAfter: '符合CSCO指南推荐的循证治疗方案',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-should-003',
    ruleId: 'MDT_DISCUSSION',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Care Delivery',
    description: 'Reference multidisciplinary team (MDT) discussions',
    rationale: 'Chinese oncology emphasizes MDT decision-making in major hospitals',
    exampleBefore: 'Consult with your oncologist',
    exampleAfter: '建议经多学科团队(MDT)讨论决定',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-should-004',
    ruleId: 'QUALITY_OF_LIFE',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Patient Outcomes',
    description: 'Include quality of life and symptom control data',
    rationale: 'Chinese oncology increasingly values holistic patient outcomes',
    exampleBefore: 'Survival benefit demonstrated',
    exampleAfter: '证实生存获益并改善生活质量',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-should-005',
    ruleId: 'CHINESE_SUBGROUP_DATA',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Real-World Evidence',
    description: 'Include Chinese subgroup or real-world data when available',
    rationale: 'Chinese oncologists value data from Chinese patient populations',
    exampleBefore: 'Clinical trial outcomes',
    exampleAfter: '全球临床研究及中国人群亚组数据',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-should-006',
    ruleId: 'SKIN_TOXICITY_MANAGEMENT',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Adverse Event Management',
    description: 'Emphasize proactive skin toxicity management with Chinese guidelines',
    rationale: 'Chinese dermatology-oncology collaboration protocols for EGFR skin toxicity',
    exampleBefore: 'Skin reactions may occur',
    exampleAfter: '皮肤反应需按照中国皮肤毒性管理指南进行积极处理',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-should-007',
    ruleId: 'AFFORDABILITY_PROGRAMS',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Patient Access',
    description: 'Include patient assistance program and NRDL coverage information',
    rationale: 'Chinese healthcare system has unique patient access considerations',
    exampleBefore: 'Effective treatment',
    exampleAfter: '已纳入医保的有效治疗，并有患者援助项目',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-should-008',
    ruleId: 'INFUSION_REACTION_PROTOCOL',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Administration',
    description: 'Detail Chinese-standard infusion reaction protocols',
    rationale: 'Chinese hospitals follow specific infusion protocols',
    exampleBefore: 'Premedication recommended',
    exampleAfter: '需按照医院输注方案进行必要的预处理',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-should-009',
    ruleId: 'BIOMARKER_TESTING_ACCESS',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Diagnostic Testing',
    description: 'Reference Chinese molecular pathology infrastructure',
    rationale: 'Chinese molecular pathology networks for RAS testing',
    exampleBefore: 'RAS testing available',
    exampleAfter: 'RAS检测可通过国内认证的分子病理实验室进行',
    therapeuticArea: 'Oncology'
  },
  {
    id: 'erb-us-cn-should-010',
    ruleId: 'LONG_TERM_OUTCOMES',
    ruleType: 'SHOULD_CHANGE',
    sourceMarket: 'US',
    targetMarket: 'China',
    category: 'Treatment Duration',
    description: 'Emphasize long-term survival and Chinese follow-up data',
    rationale: 'Chinese oncology values long-term outcome data from local populations',
    exampleBefore: 'Survival benefit shown',
    exampleAfter: '长期生存数据可达5年，包括中国患者随访数据',
    therapeuticArea: 'Oncology'
  }
];

// Helper functions
/**
 * @param {string} sourceMarket
 * @param {string} targetMarket
 * @returns {Array<ErbituxRegulatoryRule>}
 */
export function getErbituxRules(sourceMarket, targetMarket) {
  return ErbituxRegulatoryRules.filter(
    rule => rule.sourceMarket === sourceMarket && rule.targetMarket === targetMarket
  );
}

/**
 * @param {string} sourceMarket
 * @param {string} targetMarket
 * @param {'MUST_CHANGE' | 'CANNOT_CHANGE' | 'SHOULD_CHANGE'} ruleType
 * @returns {Array<ErbituxRegulatoryRule>}
 */
export function getErbituxRulesByType(
  sourceMarket,
  targetMarket,
  ruleType
) {
  return ErbituxRegulatoryRules.filter(
    rule =>
      rule.sourceMarket === sourceMarket &&
      rule.targetMarket === targetMarket &&
      rule.ruleType === ruleType
  );
}

/**
 * @param {Array<ErbituxRegulatoryRule>} rules
 * @returns {Array<object>}
 */
export function convertErbituxRulesToMatrixEntries(rules) {
  return rules.map(rule => ({
    market: rule.targetMarket,
    therapeuticArea: rule.therapeuticArea,
    ruleCategory: rule.category,
    ruleId: rule.ruleId,
    ruleName: rule.description,
    changeRequirement: rule.ruleType,
    description: rule.description,
    rationale: rule.rationale,
    riskLevel: (rule.ruleType === 'MUST_CHANGE' ? 'high' :
               rule.ruleType === 'CANNOT_CHANGE' ? 'critical' : 'medium'),
    validationMethod: (rule.ruleType === 'MUST_CHANGE' ? 'automated' : 'expert_review'),
    exampleTransformation: rule.exampleBefore && rule.exampleAfter ? {
      before: rule.exampleBefore,
      after: rule.exampleAfter,
      rationale: rule.rationale
    } : undefined
  }));
}