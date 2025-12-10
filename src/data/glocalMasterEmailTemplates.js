
// GLOCAL Master Email Templates for 7 Brands
// Content-rich simulation data for testing all GLOCAL functions (segmentation, TM, cultural, regulatory, export)

export const glocalMasterEmailTemplates = [
  // 1) JARDIANCE (Type 2 Diabetes, CV risk)
  {
    templateId: 'jardiance-hcp-clinical-excellence',
    brandName: 'Jardiance',
    brandId: 'jardiance-brand-id',
    therapeuticArea: 'Cardiovascular & Metabolic',
    indication: 'Type 2 Diabetes with CV Risk Reduction',
    emailType: 'HCP Clinical Excellence Email',
    contentSegments: [
      {
        segmentIndex: 1,
        segmentType: 'subject_line',
        segmentName: 'Subject Line Segment',
        sourceText: 'New EMPA-REG OUTCOME Data: CV Risk Reduction in Adults with Type 2 Diabetes',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 2,
        segmentType: 'preheader',
        segmentName: 'Preheader Text',
        sourceText: 'Evidence you can rely on—see the latest CV outcomes with Jardiance.',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 3,
        segmentType: 'greeting',
        segmentName: 'Professional Greeting',
        sourceText: 'Dear Dr. [Last Name],',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'high',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 4,
        segmentType: 'key_message',
        segmentName: 'Key Message',
        sourceText: 'Jardiance demonstrated a significant reduction in CV death in adults with T2D at increased CV risk.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 5,
        segmentType: 'supporting_copy',
        segmentName: 'Clinical Evidence Summary',
        sourceText: 'In a landmark outcomes study, Jardiance reduced the risk of CV death vs placebo when added to standard of care.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 6,
        segmentType: 'cta',
        segmentName: 'Call to Action',
        sourceText: 'Review the EMPA-REG publication and CV outcomes details.',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 7,
        segmentType: 'fair_balance',
        segmentName: 'Important Safety Information (ISI)',
        sourceText: 'Contraindications include hypersensitivity. Monitor for ketoacidosis. See full Prescribing Information.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 8,
        segmentType: 'footer',
        segmentName: 'Footer / Contact',
        sourceText: 'For medical information, contact your Jardiance representative or visit the medical portal.',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 9,
        segmentType: 'unsubscribe',
        segmentName: 'Unsubscribe',
        sourceText: 'To opt out of future communications, click here.',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'low'
      }
    ],
    culturalIntelligenceTestPoints: [
      {
        category: 'Formal vs. Informal Address',
        testPoints: [
          'Dear Dr. [Last Name] vs. Hello [First Name]',
          'Professional vs. casual greeting styles',
          'Title usage and hierarchy recognition'
        ]
      },
      {
        category: 'Terminology Sensitivity',
        testPoints: [
          '“CV death” phrasing appropriateness',
          'Local outcome terminology alignment',
          'Use of abbreviations (T2D, CV) per market norms'
        ]
      },
      {
        category: 'Evidence Emphasis',
        testPoints: [
          'Degree of benefit framing',
          'Regulatory tone: avoid promotional overreach',
          'Balance with risk information'
        ]
      }
    ],
    smartTMMemoryBanks: [
      {
        category: 'Medical Terminology',
        entries: [
          'cardiovascular death → muerte cardiovascular (ES)',
          'type 2 diabetes → diabète de type 2 (FR)',
          'heart failure hospitalization → hospitalisation pour insuffisance cardiaque (FR)',
          'CV risk → risco cardiovascular (PT-BR)'
        ]
      },
      {
        category: 'Regulatory Phrases',
        entries: [
          'See Prescribing Information → Consulte la Información de Prescripción (ES)',
          'Important Safety Information → Informations de Sécurité Importantes (FR)'
        ]
      }
    ],
    regulatoryAdaptationPoints: [
      {
        requirement: 'Indication Statement Localization',
        markets: ['US', 'EU', 'Japan', 'China', 'Brazil']
      },
      {
        requirement: 'Outcome Claim Substantiation',
        markets: ['US', 'EU', 'Canada', 'Australia']
      },
      {
        requirement: 'Fair Balance Placement',
        markets: ['US', 'EU', 'UK']
      }
    ]
  },

  // 2) OFEV (Idiopathic Pulmonary Fibrosis)
  {
    templateId: 'ofev-hcp-clinical-excellence',
    brandName: 'Ofev',
    brandId: 'ofev-brand-id',
    therapeuticArea: 'Respiratory',
    indication: 'Idiopathic Pulmonary Fibrosis (IPF)',
    emailType: 'HCP Clinical Excellence Email',
    contentSegments: [
      { segmentIndex: 1, segmentType: 'subject_line', segmentName: 'Subject', sourceText: 'IPF Management: Data-driven insights with Ofev', complexityLevel: 'medium', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 2, segmentType: 'preheader', segmentName: 'Preheader', sourceText: 'Explore lung function decline data and safety information.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' },
      { segmentIndex: 3, segmentType: 'greeting', segmentName: 'Greeting', sourceText: 'Dear Dr. [Last Name],', complexityLevel: 'low', culturalSensitivityLevel: 'high', regulatoryRiskLevel: 'low' },
      { segmentIndex: 4, segmentType: 'key_message', segmentName: 'Key Message', sourceText: 'Ofev helped slow the rate of FVC decline vs placebo in patients with IPF.', complexityLevel: 'medium', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 5, segmentType: 'supporting_copy', segmentName: 'Supporting Copy', sourceText: 'Across pivotal trials, Ofev demonstrated consistent efficacy on lung function endpoints.', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 6, segmentType: 'cta', segmentName: 'CTA', sourceText: 'Review clinical trial data and dosing guidance.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 7, segmentType: 'fair_balance', segmentName: 'ISI', sourceText: 'Common adverse reactions include diarrhea, nausea, and abdominal pain. See PI and Medication Guide.', complexityLevel: 'high', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'high' },
      { segmentIndex: 8, segmentType: 'footer', segmentName: 'Footer', sourceText: 'Medical Information: Visit the Ofev HCP site for details.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' },
      { segmentIndex: 9, segmentType: 'unsubscribe', segmentName: 'Unsubscribe', sourceText: 'Manage preferences or unsubscribe.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' }
    ],
    culturalIntelligenceTestPoints: [
      { category: 'Clinical Tone & Empathy', testPoints: ['Avoid fear-based language', 'Highlight evidence without overstating', 'Respectful tone regarding disease burden'] },
      { category: 'Terminology Localization', testPoints: ['IPF translation standards', 'FVC unit consistency', 'Prevent misinterpretation of endpoints'] }
    ],
    smartTMMemoryBanks: [
      { category: 'Respiratory Terms', entries: ['forced vital capacity → capacité vitale forcée (FR)', 'idiopathic pulmonary fibrosis → fibrose pulmonaire idiopathique (FR)'] },
      { category: 'Safety Phrases', entries: ['Medication Guide → Guia do Medicamento (PT-BR)', 'adverse reactions → reações adversas (PT-BR)'] }
    ],
    regulatoryAdaptationPoints: [
      { requirement: 'Endpoint Claim Localization', markets: ['US', 'EU', 'Japan'] },
      { requirement: 'Safety Statement Prominence', markets: ['US', 'EU', 'UK'] }
    ]
  },

  // 3) PRADAXA (Anticoagulant)
  {
    templateId: 'pradaxa-hcp-clinical-excellence',
    brandName: 'Pradaxa',
    brandId: 'pradaxa-brand-id',
    therapeuticArea: 'Cardiology',
    indication: 'Non-valvular Atrial Fibrillation (NVAF) – stroke prevention',
    emailType: 'HCP Clinical Excellence Email',
    contentSegments: [
      { segmentIndex: 1, segmentType: 'subject_line', segmentName: 'Subject', sourceText: 'Pradaxa: Stroke Prevention in NVAF—Key Evidence', complexityLevel: 'medium', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 2, segmentType: 'preheader', segmentName: 'Preheader', sourceText: 'Explore efficacy data, dosing, and safety considerations.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' },
      { segmentIndex: 3, segmentType: 'greeting', segmentName: 'Greeting', sourceText: 'Dear Dr. [Last Name],', complexityLevel: 'low', culturalSensitivityLevel: 'high', regulatoryRiskLevel: 'low' },
      { segmentIndex: 4, segmentType: 'key_message', segmentName: 'Key Message', sourceText: 'Pradaxa reduced stroke risk vs warfarin in adults with NVAF in pivotal trials.', complexityLevel: 'medium', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 5, segmentType: 'supporting_copy', segmentName: 'Supporting Copy', sourceText: 'Consistent efficacy profile observed across subgroups; dosing options available for renal function considerations.', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 6, segmentType: 'cta', segmentName: 'CTA', sourceText: 'Access dosing guide and patient eligibility criteria.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 7, segmentType: 'fair_balance', segmentName: 'ISI', sourceText: 'Bleeding risk: counsel patients on signs/symptoms. Contraindicated in mechanical heart valves. See PI.', complexityLevel: 'high', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'high' },
      { segmentIndex: 8, segmentType: 'footer', segmentName: 'Footer', sourceText: 'For more information, visit the Pradaxa HCP portal.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' },
      { segmentIndex: 9, segmentType: 'unsubscribe', segmentName: 'Unsubscribe', sourceText: 'Click here to unsubscribe.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' }
    ],
    culturalIntelligenceTestPoints: [
      { category: 'Risk Communication', testPoints: ['Clarity in bleeding risks', 'Non-alarming yet precise language', 'Local emergency guidance references'] },
      { category: 'Therapeutic Equivalence Phrasing', testPoints: ['Avoid absolute superiority claims', 'Maintain balanced comparison tone', 'Adhere to national guidelines on anticoagulants'] }
    ],
    smartTMMemoryBanks: [
      { category: 'Cardio Terms', entries: ['non-valvular atrial fibrillation → fibrilación auricular no valvular (ES)', 'stroke prevention → prévention des AVC (FR)'] },
      { category: 'Risk Phrases', entries: ['bleeding risk → risque hémorragique (FR)', 'contraindicated → contraindicado (PT-BR)'] }
    ],
    regulatoryAdaptationPoints: [
      { requirement: 'Bleeding Risk Prominence', markets: ['US', 'EU', 'Canada'] },
      { requirement: 'Comparative Claims Control', markets: ['US', 'EU', 'Australia'] }
    ]
  },

  // 4) ERBITUX (Oncology – EGFR inhibitor)
  {
    templateId: 'erbitux-hcp-clinical-excellence',
    brandName: 'Erbitux',
    brandId: 'erbitux-brand-id',
    therapeuticArea: 'Oncology',
    indication: 'EGFR-expressing metastatic colorectal cancer / head and neck cancer (market-dependent)',
    emailType: 'HCP Clinical Excellence Email',
    contentSegments: [
      { segmentIndex: 1, segmentType: 'subject_line', segmentName: 'Subject', sourceText: 'Erbitux: EGFR-Targeted Therapy—Clinical Insights', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 2, segmentType: 'preheader', segmentName: 'Preheader', sourceText: 'Review biomarker considerations and evidence summaries.', complexityLevel: 'medium', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 3, segmentType: 'greeting', segmentName: 'Greeting', sourceText: 'Dear Dr. [Last Name],', complexityLevel: 'low', culturalSensitivityLevel: 'high', regulatoryRiskLevel: 'low' },
      { segmentIndex: 4, segmentType: 'key_message', segmentName: 'Key Message', sourceText: 'Erbitux provides EGFR-targeted treatment options; biomarker selection is critical.', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 5, segmentType: 'supporting_copy', segmentName: 'Supporting Copy', sourceText: 'Clinical outcomes may vary with RAS mutation status; consult guidelines for biomarker-based selection.', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 6, segmentType: 'cta', segmentName: 'CTA', sourceText: 'Explore biomarker testing recommendations.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 7, segmentType: 'fair_balance', segmentName: 'ISI', sourceText: 'Infusion reactions and dermatologic toxicity may occur. Monitor per label guidance.', complexityLevel: 'high', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'high' },
      { segmentIndex: 8, segmentType: 'footer', segmentName: 'Footer', sourceText: 'Visit the oncology resource center for Erbitux details.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' },
      { segmentIndex: 9, segmentType: 'unsubscribe', segmentName: 'Unsubscribe', sourceText: 'Update email preferences here.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' }
    ],
    culturalIntelligenceTestPoints: [
      { category: 'Biomarker Language', testPoints: ['Local acceptance of RAS/KRAS terminology', 'Clarity on testing prerequisites', 'Avoiding misinterpretation of predictive vs prognostic'] },
      { category: 'Oncology Etiquette', testPoints: ['Sensitivity to patient journey', 'Avoid outcome overpromises', 'Contextualize evidence with guidelines'] }
    ],
    smartTMMemoryBanks: [
      { category: 'Oncology Terms', entries: ['epidermal growth factor receptor → récepteur du facteur de croissance épidermique (FR)', 'biomarker testing → pruebas de biomarcadores (ES)'] },
      { category: 'Safety Phrases', entries: ['infusion reaction → réaction à la perfusion (FR)', 'dermatologic toxicity → toxicidad dermatológica (ES)'] }
    ],
    regulatoryAdaptationPoints: [
      { requirement: 'Biomarker Claim Controls', markets: ['US', 'EU', 'Japan'] },
      { requirement: 'Oncology Safety Detail Emphasis', markets: ['US', 'EU', 'UK'] }
    ]
  },

  // 5) ENTRESTO (Cardiology – HFrEF)  [Note: brand outside BI; used for cross-testing]
  {
    templateId: 'entresto-hcp-clinical-excellence',
    brandName: 'Entresto',
    brandId: 'entresto-brand-id',
    therapeuticArea: 'Cardiology',
    indication: 'Heart Failure with reduced ejection fraction (HFrEF)',
    emailType: 'HCP Clinical Excellence Email',
    contentSegments: [
      { segmentIndex: 1, segmentType: 'subject_line', segmentName: 'Subject', sourceText: 'Entresto in HFrEF: Clinical Outcomes and Dosing', complexityLevel: 'medium', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 2, segmentType: 'preheader', segmentName: 'Preheader', sourceText: 'Review data on hospitalization risk and dosing titration.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' },
      { segmentIndex: 3, segmentType: 'greeting', segmentName: 'Greeting', sourceText: 'Dear Dr. [Last Name],', complexityLevel: 'low', culturalSensitivityLevel: 'high', regulatoryRiskLevel: 'low' },
      { segmentIndex: 4, segmentType: 'key_message', segmentName: 'Key Message', sourceText: 'Entresto reduced the risk of CV death and HF hospitalization vs ACE inhibitor in pivotal trials.', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 5, segmentType: 'supporting_copy', segmentName: 'Supporting Copy', sourceText: 'Guideline recommendations support Entresto for eligible HFrEF patients; monitor BP and renal function.', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 6, segmentType: 'cta', segmentName: 'CTA', sourceText: 'Access dosing initiation and titration guidance.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 7, segmentType: 'fair_balance', segmentName: 'ISI', sourceText: 'Risk of hypotension; contraindicated with ACE inhibitors. See PI and Medication Guide.', complexityLevel: 'high', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'high' },
      { segmentIndex: 8, segmentType: 'footer', segmentName: 'Footer', sourceText: 'Visit the HFrEF resource hub for Entresto materials.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' },
      { segmentIndex: 9, segmentType: 'unsubscribe', segmentName: 'Unsubscribe', sourceText: 'Unsubscribe or manage preferences.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' }
    ],
    culturalIntelligenceTestPoints: [
      { category: 'Guideline Referencing', testPoints: ['Local HF guidelines alignment', 'Avoid guideline overreliance language', 'Use neutral framing when guideline variance exists'] },
      { category: 'Risk Communication', testPoints: ['BP monitoring phrasing', 'Clear instruction for ACE inhibitor washout', 'Localization of dosing schedules'] }
    ],
    smartTMMemoryBanks: [
      { category: 'Cardiac Terms', entries: ['heart failure → insuficiencia cardíaca (ES)', 'reduced ejection fraction → fraction d’éjection réduite (FR)'] },
      { category: 'Dosing Phrases', entries: ['titration → titration (FR)', 'contraindicated → contraindicada (ES)'] }
    ],
    regulatoryAdaptationPoints: [
      { requirement: 'Comparative Claims Scrutiny', markets: ['US', 'EU', 'Canada'] },
      { requirement: 'Dosing Safety Instructions', markets: ['US', 'EU', 'UK'] }
    ]
  },

  // 6) TAGRISSO (Oncology – EGFR-mutated NSCLC) [cross-testing]
  {
    templateId: 'tagrisso-hcp-clinical-excellence',
    brandName: 'Tagrisso',
    brandId: 'tagrisso-brand-id',
    therapeuticArea: 'Oncology',
    indication: 'EGFR-mutated non–small cell lung cancer',
    emailType: 'HCP Clinical Excellence Email',
    contentSegments: [
      { segmentIndex: 1, segmentType: 'subject_line', segmentName: 'Subject', sourceText: 'EGFR-mutated NSCLC: Tagrisso Evidence Overview', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 2, segmentType: 'preheader', segmentName: 'Preheader', sourceText: 'Review survival outcomes and safety profile.', complexityLevel: 'medium', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 3, segmentType: 'greeting', segmentName: 'Greeting', sourceText: 'Dear Dr. [Last Name],', complexityLevel: 'low', culturalSensitivityLevel: 'high', regulatoryRiskLevel: 'low' },
      { segmentIndex: 4, segmentType: 'key_message', segmentName: 'Key Message', sourceText: 'Tagrisso demonstrated improved outcomes versus comparator in EGFR-mutated NSCLC settings.', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 5, segmentType: 'supporting_copy', segmentName: 'Supporting Copy', sourceText: 'Consider biomarker testing pathways and local diagnostic access; review adverse event management.', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 6, segmentType: 'cta', segmentName: 'CTA', sourceText: 'Explore biomarker workflow and AE management guide.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 7, segmentType: 'fair_balance', segmentName: 'ISI', sourceText: 'Interstitial lung disease/pneumonitis has been reported. Monitor patients closely per label.', complexityLevel: 'high', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'high' },
      { segmentIndex: 8, segmentType: 'footer', segmentName: 'Footer', sourceText: 'Access oncology portal for Tagrisso resources.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' },
      { segmentIndex: 9, segmentType: 'unsubscribe', segmentName: 'Unsubscribe', sourceText: 'Update subscription preferences.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' }
    ],
    culturalIntelligenceTestPoints: [
      { category: 'Biomarker Access', testPoints: ['Local diagnostic pathway constraints', 'Terminology clarity for EGFR testing', 'Cost sensitivity messaging'] },
      { category: 'Safety Framing', testPoints: ['AE language sensitivity', 'Avoid alarmist tone', 'Balance with monitoring recommendations'] }
    ],
    smartTMMemoryBanks: [
      { category: 'Oncology Terms', entries: ['non–small cell lung cancer → cáncer de pulmón no microcítico (ES)', 'biomarker → biomarqueur (FR)'] },
      { category: 'Safety Phrases', entries: ['interstitial lung disease → maladie pulmonaire interstitielle (FR)', 'pneumonitis → neumonitis (ES)'] }
    ],
    regulatoryAdaptationPoints: [
      { requirement: 'Outcome Claim Localization', markets: ['US', 'EU', 'Japan'] },
      { requirement: 'AE Disclosure Prominence', markets: ['US', 'EU', 'UK'] }
    ]
  },

  // 7) XARELTO (Anticoagulant – VTE / AF) [cross-testing]
  {
    templateId: 'xarelto-hcp-clinical-excellence',
    brandName: 'Xarelto',
    brandId: 'xarelto-brand-id',
    therapeuticArea: 'Cardiology / Hematology',
    indication: 'VTE treatment/prophylaxis; NVAF stroke prevention (market-dependent)',
    emailType: 'HCP Clinical Excellence Email',
    contentSegments: [
      { segmentIndex: 1, segmentType: 'subject_line', segmentName: 'Subject', sourceText: 'Xarelto: Evidence Summary for NVAF/VTE—Dosing & Safety', complexityLevel: 'medium', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 2, segmentType: 'preheader', segmentName: 'Preheader', sourceText: 'Explore dosing options, renal considerations, and safety messaging.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' },
      { segmentIndex: 3, segmentType: 'greeting', segmentName: 'Greeting', sourceText: 'Dear Dr. [Last Name],', complexityLevel: 'low', culturalSensitivityLevel: 'high', regulatoryRiskLevel: 'low' },
      { segmentIndex: 4, segmentType: 'key_message', segmentName: 'Key Message', sourceText: 'Xarelto demonstrated risk reduction across approved indications; review label specifics by market.', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 5, segmentType: 'supporting_copy', segmentName: 'Supporting Copy', sourceText: 'Consider renal dosing adjustments and patient risk factors; balanced decision-making supported by label.', complexityLevel: 'high', culturalSensitivityLevel: 'medium', regulatoryRiskLevel: 'high' },
      { segmentIndex: 6, segmentType: 'cta', segmentName: 'CTA', sourceText: 'Access dosing charts and label references.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'medium' },
      { segmentIndex: 7, segmentType: 'fair_balance', segmentName: 'ISI', sourceText: 'Bleeding risks exist; assess renal function and concomitant medications. See PI/SmPC.', complexityLevel: 'high', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'high' },
      { segmentIndex: 8, segmentType: 'footer', segmentName: 'Footer', sourceText: 'Visit HCP portal for Xarelto guidance and materials.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' },
      { segmentIndex: 9, segmentType: 'unsubscribe', segmentName: 'Unsubscribe', sourceText: 'Unsubscribe or update your preferences.', complexityLevel: 'low', culturalSensitivityLevel: 'low', regulatoryRiskLevel: 'low' }
    ],
    culturalIntelligenceTestPoints: [
      { category: 'Risk Tone', testPoints: ['Non-alarmin’ phrasing', 'Local emergency instruction norms', 'Medication interaction sensitivity'] },
      { category: 'Dosing Localization', testPoints: ['Unit formats & renal function ranges', 'Charts vs narrative preference', 'Local SmPC/PI citation rules'] }
    ],
    smartTMMemoryBanks: [
      { category: 'Heme/Cardio Terms', entries: ['venous thromboembolism → thromboembolie veineuse (FR)', 'renal function → función renal (ES)'] },
      { category: 'Label Phrases', entries: ['Summary of Product Characteristics → Résumé des Caractéristiques du Produit (FR)', 'Prescribing Information → Información de Prescripción (ES)'] }
    ],
    regulatoryAdaptationPoints: [
      { requirement: 'Bleeding Risk Prominence', markets: ['US', 'EU', 'Canada', 'Brazil'] },
      { requirement: 'Label-Specific Indication Alignment', markets: ['US', 'EU', 'Japan'] }
    ]
  }
];

// Optional helper: build a quick index for retrieval by templateId or brandName
export const glocalEmailTemplateIndex = glocalMasterEmailTemplates.reduce((acc, t) => {
  acc.byId[t.templateId] = t;
  acc.byBrand[t.brandName.toLowerCase()] = t;
  return acc;
}, { byId: {}, byBrand: {} });
