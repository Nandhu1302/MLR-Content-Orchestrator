// GLOCAL Master Email Templates for All 7 Brands
// Content-rich simulation data for testing all GLOCAL functions

import { GlocalMasterEmailTemplate } from '@/types/glocal';

export const glocalMasterEmailTemplates: GlocalMasterEmailTemplate[] = [
  // 1. JARDIANCE (Type 2 Diabetes)
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
        sourceText: 'New EMPA-REG OUTCOME Data: CV Risk Reduction in Type 2 Diabetes Patients with Jardiance',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 2,
        segmentType: 'greeting',
        segmentName: 'Professional Greeting',
        sourceText: 'Dear Dr. [Last Name],',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'high',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 3,
        segmentType: 'primary_efficacy',
        segmentName: 'Primary Efficacy Claims Segment',
        sourceText: 'Jardiance (empagliflozin) demonstrated a 38% relative risk reduction in cardiovascular death in adults with type 2 diabetes and established cardiovascular disease in the landmark EMPA-REG OUTCOME trial (HR 0.62, 95% CI 0.49-0.77, p<0.001).',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 4,
        segmentType: 'secondary_outcomes',
        segmentName: 'Secondary Outcomes & Data',
        sourceText: 'Additionally, Jardiance showed significant reductions in hospitalization for heart failure (35% RRR, HR 0.65, 95% CI 0.50-0.85, p=0.002) and all-cause mortality (32% RRR, HR 0.68, 95% CI 0.57-0.82, p<0.001) versus placebo.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 5,
        segmentType: 'mechanism_of_action',
        segmentName: 'Mechanism of Action',
        sourceText: 'Jardiance is a sodium-glucose co-transporter 2 (SGLT2) inhibitor that reduces renal glucose reabsorption, promoting urinary glucose excretion and providing glycemic control independent of insulin secretion or action.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 6,
        segmentType: 'safety_profile',
        segmentName: 'Safety & Tolerability Information',
        sourceText: 'The most common adverse reactions (≥5% incidence) include urinary tract infections and female genital mycotic infections. Jardiance is contraindicated in patients with severe renal impairment (eGFR <30 mL/min/1.73m²), end-stage renal disease, or on dialysis.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 7,
        segmentType: 'patient_population',
        segmentName: 'Target Patient Population',
        sourceText: 'Consider Jardiance for your adult patients with type 2 diabetes, particularly those with established cardiovascular disease who may benefit from the proven CV risk reduction.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 8,
        segmentType: 'dosing_administration',
        segmentName: 'Dosing & Administration',
        sourceText: 'Jardiance is available in 10 mg and 25 mg tablets, taken orally once daily in the morning, with or without food. The recommended starting dose is 10 mg, which may be increased to 25 mg for additional glycemic control.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 9,
        segmentType: 'resources_support',
        segmentName: 'Resources & Support',
        sourceText: 'Access comprehensive prescribing information, patient education materials, and reimbursement support tools at our healthcare professional portal.',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 10,
        segmentType: 'call_to_action',
        segmentName: 'Call-to-Action Segment',
        sourceText: 'Learn more about the EMPA-REG OUTCOME data and request a personalized consultation with our medical science liaison.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 11,
        segmentType: 'closing_signature',
        segmentName: 'Professional Closing',
        sourceText: 'Best regards,\nThe Jardiance Medical Affairs Team',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'medium',
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
        category: 'Clinical Evidence Presentation',
        testPoints: [
          'Statistical data emphasis (Western markets prefer hard numbers)',
          'Patient story integration (Asian markets value narratives)',
          'Authority citation styles'
        ]
      },
      {
        category: 'Risk Communication',
        testPoints: [
          'Direct vs. indirect adverse event disclosure',
          'Probability framing (percentage vs. descriptive)',
          'Balanced messaging requirements'
        ]
      }
    ],
    
    smartTMMemoryBanks: [
      {
        category: 'Medical Terminology',
        entries: [
          'cardiovascular death → muerte cardiovascular (ES)',
          'type 2 diabetes → diabète de type 2 (FR)',
          'heart failure hospitalization → hospitalisation pour insuffisance cardiaque (FR)'
        ]
      },
      {
        category: 'Regulatory Language',
        entries: [
          'contraindicated → contraindicado (ES)',
          'adverse reactions → réactions indésirables (FR)',
          'established cardiovascular disease → maladie cardiovasculaire établie (FR)'
        ]
      },
      {
        category: 'Clinical Trial Data',
        entries: [
          'EMPA-REG OUTCOME → EMPA-REG OUTCOME (universal)',
          'hazard ratio → rapport de risque (FR)',
          'confidence interval → intervalle de confiance (FR)'
        ]
      }
    ],
    
    regulatoryAdaptationPoints: [
      {
        requirement: 'Indication Statement Localization',
        markets: ['US', 'EU', 'Japan', 'China', 'Brazil']
      },
      {
        requirement: 'Safety Information Disclosure Level',
        markets: ['US', 'EU', 'Canada']
      },
      {
        requirement: 'Fair Balance Requirements',
        markets: ['US', 'Canada']
      }
    ]
  },

  // 2. OFEV (Idiopathic Pulmonary Fibrosis)
  {
    templateId: 'ofev-hcp-clinical-excellence',
    brandName: 'Ofev',
    brandId: 'ofev-brand-id',
    therapeuticArea: 'Respiratory',
    indication: 'Idiopathic Pulmonary Fibrosis (IPF)',
    emailType: 'HCP Clinical Excellence Email',
    
    contentSegments: [
      {
        segmentIndex: 1,
        segmentType: 'subject_line',
        segmentName: 'Subject Line Segment',
        sourceText: 'INPULSIS Trial Data: Slowing IPF Progression with Ofev (nintedanib)',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 2,
        segmentType: 'greeting',
        segmentName: 'Professional Greeting',
        sourceText: 'Dear Dr. [Last Name],',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'high',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 3,
        segmentType: 'primary_efficacy',
        segmentName: 'Primary Efficacy Claims Segment',
        sourceText: 'Ofev (nintedanib) reduced the annual rate of decline in forced vital capacity (FVC) by approximately 50% compared to placebo in patients with idiopathic pulmonary fibrosis (IPF) in the pivotal INPULSIS trials (Treatment difference: 109.9 mL/year, p<0.001; 125.3 mL/year, p<0.001).',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 4,
        segmentType: 'secondary_outcomes',
        segmentName: 'Secondary Outcomes & Data',
        sourceText: 'Secondary endpoints showed a reduction in time to first acute exacerbation and preserved quality of life as measured by SGRQ total score.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 5,
        segmentType: 'mechanism_of_action',
        segmentName: 'Mechanism of Action',
        sourceText: 'Ofev is a tyrosine kinase inhibitor that targets multiple pathways involved in the pathogenesis of IPF, including VEGFR, FGFR, and PDGFR, thereby inhibiting fibroblast proliferation, migration, and transformation.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 6,
        segmentType: 'safety_profile',
        segmentName: 'Safety & Tolerability Information',
        sourceText: 'The most common adverse reaction is diarrhea (62% vs. 18% placebo), which is typically manageable with dose modification and supportive care. Other common adverse reactions include nausea, abdominal pain, and elevated liver enzymes.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 7,
        segmentType: 'patient_population',
        segmentName: 'Target Patient Population',
        sourceText: 'Ofev is indicated for the treatment of idiopathic pulmonary fibrosis (IPF) in adults, helping to slow disease progression and preserve lung function.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 8,
        segmentType: 'dosing_administration',
        segmentName: 'Dosing & Administration',
        sourceText: 'The recommended dosage of Ofev is 150 mg twice daily, approximately 12 hours apart, taken with food. Dose reduction to 100 mg twice daily may be considered for management of adverse reactions.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 9,
        segmentType: 'resources_support',
        segmentName: 'Resources & Support',
        sourceText: 'Access IPF management resources, patient support programs, and reimbursement assistance through our comprehensive support services.',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 10,
        segmentType: 'call_to_action',
        segmentName: 'Call-to-Action Segment',
        sourceText: 'Request a personalized IPF management guide or connect with our pulmonary disease specialists for clinical consultation.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 11,
        segmentType: 'closing_signature',
        segmentName: 'Professional Closing',
        sourceText: 'Sincerely,\nThe Ofev Medical Affairs Team',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'low'
      }
    ],
    
    culturalIntelligenceTestPoints: [
      {
        category: 'Formal vs. Informal Address',
        testPoints: [
          'Professional medical communication standards',
          'Specialist vs. generalist physician address',
          'Academic title recognition'
        ]
      },
      {
        category: 'Clinical Evidence Presentation',
        testPoints: [
          'Pulmonary function data interpretation',
          'Quality of life metrics emphasis',
          'Exacerbation terminology'
        ]
      },
      {
        category: 'Risk Communication',
        testPoints: [
          'GI adverse event disclosure',
          'Hepatotoxicity warning emphasis',
          'Dose modification guidance'
        ]
      }
    ],
    
    smartTMMemoryBanks: [
      {
        category: 'Medical Terminology',
        entries: [
          'forced vital capacity → capacité vitale forcée (FR)',
          'idiopathic pulmonary fibrosis → fibrose pulmonaire idiopathique (FR)',
          'acute exacerbation → exacerbation aiguë (FR)'
        ]
      },
      {
        category: 'Regulatory Language',
        entries: [
          'indicated for → indiqué pour (FR)',
          'adverse reaction → réaction indésirable (FR)',
          'dose modification → modification de la dose (FR)'
        ]
      }
    ],
    
    regulatoryAdaptationPoints: [
      {
        requirement: 'IPF Indication Wording',
        markets: ['US', 'EU', 'Japan', 'Canada']
      },
      {
        requirement: 'Hepatotoxicity Warning',
        markets: ['US', 'EU', 'Canada', 'Australia']
      }
    ]
  },

  // 3. PRADAXA (Atrial Fibrillation)
  {
    templateId: 'pradaxa-hcp-clinical-excellence',
    brandName: 'Pradaxa',
    brandId: 'pradaxa-brand-id',
    therapeuticArea: 'Cardiovascular',
    indication: 'Stroke Prevention in Atrial Fibrillation',
    emailType: 'HCP Clinical Excellence Email',
    
    contentSegments: [
      {
        segmentIndex: 1,
        segmentType: 'subject_line',
        segmentName: 'Subject Line Segment',
        sourceText: 'RE-LY Trial Results: Pradaxa for Stroke Prevention in Non-Valvular Atrial Fibrillation',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 2,
        segmentType: 'greeting',
        segmentName: 'Professional Greeting',
        sourceText: 'Dear Dr. [Last Name],',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'high',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 3,
        segmentType: 'primary_efficacy',
        segmentName: 'Primary Efficacy Claims Segment',
        sourceText: 'Pradaxa (dabigatran etexilate) 150 mg twice daily demonstrated superior efficacy compared to warfarin in reducing the risk of stroke and systemic embolism in patients with non-valvular atrial fibrillation (HR 0.66, 95% CI 0.53-0.82, p<0.001 for superiority) in the landmark RE-LY trial.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 4,
        segmentType: 'secondary_outcomes',
        segmentName: 'Secondary Outcomes & Data',
        sourceText: 'Pradaxa 150 mg also showed significantly lower rates of hemorrhagic stroke (HR 0.26, 95% CI 0.14-0.49, p<0.001) and intracranial bleeding (HR 0.40, 95% CI 0.27-0.60, p<0.001) compared to warfarin.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 5,
        segmentType: 'mechanism_of_action',
        segmentName: 'Mechanism of Action',
        sourceText: 'Pradaxa is a direct thrombin inhibitor that prevents the conversion of fibrinogen to fibrin, providing predictable anticoagulation without the need for routine monitoring.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 6,
        segmentType: 'safety_profile',
        segmentName: 'Safety & Tolerability Information',
        sourceText: 'The most serious adverse reaction is bleeding. Pradaxa 150 mg showed similar rates of major bleeding compared to warfarin but increased GI bleeding. A specific reversal agent (idarucizumab) is available.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 7,
        segmentType: 'patient_population',
        segmentName: 'Target Patient Population',
        sourceText: 'Consider Pradaxa for adult patients with non-valvular atrial fibrillation to reduce the risk of stroke and systemic embolism.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 8,
        segmentType: 'dosing_administration',
        segmentName: 'Dosing & Administration',
        sourceText: 'The recommended dose is 150 mg taken orally twice daily. For patients with moderate renal impairment (CrCl 30-50 mL/min), consider dose reduction to 110 mg twice daily (where approved).',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 9,
        segmentType: 'resources_support',
        segmentName: 'Resources & Support',
        sourceText: 'Access atrial fibrillation management tools, patient education materials, and anticoagulation support resources.',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 10,
        segmentType: 'call_to_action',
        segmentName: 'Call-to-Action Segment',
        sourceText: 'Download the RE-LY trial summary or schedule a consultation with our cardiology medical science liaison.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 11,
        segmentType: 'closing_signature',
        segmentName: 'Professional Closing',
        sourceText: 'Best regards,\nThe Pradaxa Medical Affairs Team',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'low'
      }
    ],
    
    culturalIntelligenceTestPoints: [
      {
        category: 'Formal vs. Informal Address',
        testPoints: [
          'Cardiologist professional address',
          'Academic vs. community practice tone',
          'International cardiology society norms'
        ]
      },
      {
        category: 'Clinical Evidence Presentation',
        testPoints: [
          'Non-inferiority vs. superiority messaging',
          'Bleeding risk communication',
          'Warfarin comparison context'
        ]
      }
    ],
    
    smartTMMemoryBanks: [
      {
        category: 'Medical Terminology',
        entries: [
          'atrial fibrillation → fibrillation auriculaire (FR)',
          'systemic embolism → embolie systémique (FR)',
          'hemorrhagic stroke → accident vasculaire cérébral hémorragique (FR)'
        ]
      }
    ],
    
    regulatoryAdaptationPoints: [
      {
        requirement: 'Bleeding Risk Boxed Warning',
        markets: ['US']
      },
      {
        requirement: 'Reversal Agent Availability',
        markets: ['US', 'EU', 'Canada', 'Australia']
      }
    ]
  },

  // 4. ERBITUX (Colorectal Cancer)
  {
    templateId: 'erbitux-hcp-clinical-excellence',
    brandName: 'Erbitux',
    brandId: 'erbitux-brand-id',
    therapeuticArea: 'Oncology',
    indication: 'Metastatic Colorectal Cancer',
    emailType: 'HCP Clinical Excellence Email',
    
    contentSegments: [
      {
        segmentIndex: 1,
        segmentType: 'subject_line',
        segmentName: 'Subject Line Segment',
        sourceText: 'CRYSTAL Trial Data: Erbitux + FOLFIRI in RAS Wild-Type mCRC',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 2,
        segmentType: 'greeting',
        segmentName: 'Professional Greeting',
        sourceText: 'Dear Dr. [Last Name],',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'high',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 3,
        segmentType: 'primary_efficacy',
        segmentName: 'Primary Efficacy Claims Segment',
        sourceText: 'Erbitux (cetuximab) plus FOLFIRI significantly improved progression-free survival (PFS) and overall survival (OS) in patients with RAS wild-type metastatic colorectal cancer. In the CRYSTAL trial RAS analysis, median PFS was 11.4 months vs. 8.4 months (HR 0.56, p<0.0001) and median OS was 28.4 months vs. 20.2 months (HR 0.69, p=0.0024).',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 4,
        segmentType: 'biomarker_testing',
        segmentName: 'Biomarker Testing Requirements',
        sourceText: 'RAS (KRAS and NRAS) mutation testing is required prior to initiating Erbitux therapy. Erbitux is only indicated in patients with RAS wild-type (no mutations detected) colorectal cancer.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 5,
        segmentType: 'mechanism_of_action',
        segmentName: 'Mechanism of Action',
        sourceText: 'Erbitux is a monoclonal antibody that specifically binds to the extracellular domain of EGFR, blocking ligand-induced receptor phosphorylation and activation of downstream signaling pathways involved in cell proliferation and survival.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 6,
        segmentType: 'safety_profile',
        segmentName: 'Safety & Tolerability Information',
        sourceText: 'The most common adverse reactions (≥25%) include cutaneous adverse reactions (acneiform rash, pruritus, nail changes), diarrhea, infection, asthenia, and nausea. Serious reactions include infusion reactions, cardiopulmonary arrest, and dermatologic toxicity.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 7,
        segmentType: 'patient_population',
        segmentName: 'Target Patient Population',
        sourceText: 'Erbitux is indicated for the treatment of RAS wild-type, EGFR-expressing, metastatic colorectal cancer in combination with FOLFIRI for first-line treatment.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 8,
        segmentType: 'dosing_administration',
        segmentName: 'Dosing & Administration',
        sourceText: 'The recommended initial dose is 400 mg/m² infused over 120 minutes, followed by 250 mg/m² infused over 60 minutes weekly. Premedication with an H1 antagonist is recommended.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 9,
        segmentType: 'resources_support',
        segmentName: 'Resources & Support',
        sourceText: 'Access RAS testing resources, patient support programs, and reimbursement assistance for Erbitux therapy.',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 10,
        segmentType: 'call_to_action',
        segmentName: 'Call-to-Action Segment',
        sourceText: 'Request the complete CRYSTAL trial RAS analysis or connect with our oncology medical science liaison.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 11,
        segmentType: 'closing_signature',
        segmentName: 'Professional Closing',
        sourceText: 'Sincerely,\nThe Erbitux Medical Affairs Team',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'low'
      }
    ],
    
    culturalIntelligenceTestPoints: [
      {
        category: 'Oncology Communication',
        testPoints: [
          'Survival data presentation preferences',
          'Biomarker testing emphasis',
          'Toxicity vs. efficacy balance'
        ]
      }
    ],
    
    smartTMMemoryBanks: [
      {
        category: 'Oncology Terminology',
        entries: [
          'metastatic colorectal cancer → cancer colorectal métastatique (FR)',
          'progression-free survival → survie sans progression (FR)',
          'overall survival → survie globale (FR)'
        ]
      }
    ],
    
    regulatoryAdaptationPoints: [
      {
        requirement: 'RAS Testing Requirement',
        markets: ['US', 'EU', 'Canada', 'Australia', 'Japan']
      }
    ]
  },

  // 5. ENTRESTO (Heart Failure)
  {
    templateId: 'entresto-hcp-clinical-excellence',
    brandName: 'Entresto',
    brandId: 'entresto-brand-id',
    therapeuticArea: 'Cardiovascular',
    indication: 'Heart Failure with Reduced Ejection Fraction',
    emailType: 'HCP Clinical Excellence Email',
    
    contentSegments: [
      {
        segmentIndex: 1,
        segmentType: 'subject_line',
        segmentName: 'Subject Line Segment',
        sourceText: 'PARADIGM-HF Study: Groundbreaking Results with Entresto in HFrEF',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 2,
        segmentType: 'greeting',
        segmentName: 'Professional Greeting',
        sourceText: 'Dear Dr. [Last Name],',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'high',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 3,
        segmentType: 'primary_efficacy',
        segmentName: 'Primary Efficacy Claims Segment',
        sourceText: 'Entresto (sacubitril/valsartan) reduced the risk of cardiovascular death by 20% (HR 0.80, 95% CI 0.71-0.89, p<0.001) and heart failure hospitalization by 21% (HR 0.79, 95% CI 0.71-0.89, p<0.001) compared to enalapril in the landmark PARADIGM-HF trial.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 4,
        segmentType: 'secondary_outcomes',
        segmentName: 'Secondary Outcomes & Data',
        sourceText: 'Additionally, Entresto demonstrated a 16% reduction in all-cause mortality (HR 0.84, 95% CI 0.76-0.93, p<0.001) and improved symptoms and physical limitations in patients with HFrEF.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 5,
        segmentType: 'mechanism_of_action',
        segmentName: 'Mechanism of Action',
        sourceText: 'Entresto combines neprilysin inhibition (sacubitril) and angiotensin II receptor blockade (valsartan) to enhance the effects of natriuretic peptides while suppressing the renin-angiotensin-aldosterone system.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 6,
        segmentType: 'safety_profile',
        segmentName: 'Safety & Tolerability Information',
        sourceText: 'The most common adverse reactions include hypotension, hyperkalemia, cough, dizziness, and renal dysfunction. Entresto is contraindicated with concomitant ACE inhibitor use (36-hour washout required) and in patients with angioedema history.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 7,
        segmentType: 'patient_population',
        segmentName: 'Target Patient Population',
        sourceText: 'Entresto is indicated to reduce the risk of cardiovascular death and hospitalization in patients with chronic heart failure (NYHA Class II-IV) and reduced ejection fraction.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 8,
        segmentType: 'dosing_administration',
        segmentName: 'Dosing & Administration',
        sourceText: 'The recommended starting dose is 49/51 mg twice daily, doubled every 2-4 weeks to the target maintenance dose of 97/103 mg twice daily, as tolerated.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 9,
        segmentType: 'resources_support',
        segmentName: 'Resources & Support',
        sourceText: 'Access heart failure management tools, patient education resources, and transition support programs.',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 10,
        segmentType: 'call_to_action',
        segmentName: 'Call-to-Action Segment',
        sourceText: 'Review the PARADIGM-HF data in detail or request a consultation with our heart failure specialist.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 11,
        segmentType: 'closing_signature',
        segmentName: 'Professional Closing',
        sourceText: 'Best regards,\nThe Entresto Medical Affairs Team',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'low'
      }
    ],
    
    culturalIntelligenceTestPoints: [
      {
        category: 'Heart Failure Communication',
        testPoints: [
          'NYHA classification usage',
          'Mortality vs. hospitalization emphasis',
          'Transition from ACE inhibitor messaging'
        ]
      }
    ],
    
    smartTMMemoryBanks: [
      {
        category: 'Cardiology Terminology',
        entries: [
          'heart failure → insuffisance cardiaque (FR)',
          'reduced ejection fraction → fraction d\'éjection réduite (FR)',
          'cardiovascular death → décès cardiovasculaire (FR)'
        ]
      }
    ],
    
    regulatoryAdaptationPoints: [
      {
        requirement: 'ACE Inhibitor Contraindication',
        markets: ['US', 'EU', 'Canada', 'Australia', 'Japan']
      }
    ]
  },

  // 6. TAGRISSO (NSCLC)
  {
    templateId: 'tagrisso-hcp-clinical-excellence',
    brandName: 'Tagrisso',
    brandId: 'tagrisso-brand-id',
    therapeuticArea: 'Oncology',
    indication: 'EGFR-Mutated Non-Small Cell Lung Cancer',
    emailType: 'HCP Clinical Excellence Email',
    
    contentSegments: [
      {
        segmentIndex: 1,
        segmentType: 'subject_line',
        segmentName: 'Subject Line Segment',
        sourceText: 'FLAURA Trial Results: First-Line Tagrisso in EGFR-Mutated NSCLC',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 2,
        segmentType: 'greeting',
        segmentName: 'Professional Greeting',
        sourceText: 'Dear Dr. [Last Name],',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'high',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 3,
        segmentType: 'primary_efficacy',
        segmentName: 'Primary Efficacy Claims Segment',
        sourceText: 'Tagrisso (osimertinib) demonstrated superior progression-free survival compared to first-generation EGFR TKIs in treatment-naive patients with EGFR mutation-positive (exon 19 deletion or L858R) metastatic NSCLC in the FLAURA trial (median PFS 18.9 months vs. 10.2 months, HR 0.46, 95% CI 0.37-0.57, p<0.001).',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 4,
        segmentType: 'cns_efficacy',
        segmentName: 'CNS Efficacy Data',
        sourceText: 'Tagrisso showed significant CNS activity with a CNS objective response rate of 91% in patients with CNS metastases at baseline, compared to 68% with comparator EGFR TKIs.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 5,
        segmentType: 'mechanism_of_action',
        segmentName: 'Mechanism of Action',
        sourceText: 'Tagrisso is a third-generation, irreversible EGFR tyrosine kinase inhibitor that selectively targets both EGFR-TKI sensitizing and T790M resistance mutations with nanomolar potency, while sparing wild-type EGFR.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 6,
        segmentType: 'safety_profile',
        segmentName: 'Safety & Tolerability Information',
        sourceText: 'The most common adverse reactions (≥20%) include diarrhea, rash, dry skin, nail toxicity, fatigue, and decreased appetite. Serious adverse reactions include interstitial lung disease (ILD)/pneumonitis, QTc interval prolongation, and cardiomyopathy.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 7,
        segmentType: 'patient_population',
        segmentName: 'Target Patient Population',
        sourceText: 'Tagrisso is indicated for first-line treatment of patients with metastatic NSCLC whose tumors have EGFR exon 19 deletions or exon 21 L858R mutations, as detected by an FDA-approved test.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 8,
        segmentType: 'dosing_administration',
        segmentName: 'Dosing & Administration',
        sourceText: 'The recommended dose of Tagrisso is 80 mg orally once daily, with or without food, until disease progression or unacceptable toxicity.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 9,
        segmentType: 'resources_support',
        segmentName: 'Resources & Support',
        sourceText: 'Access EGFR testing resources, patient support programs, and comprehensive reimbursement assistance.',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 10,
        segmentType: 'call_to_action',
        segmentName: 'Call-to-Action Segment',
        sourceText: 'Request the FLAURA trial data package or connect with our thoracic oncology medical science liaison.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 11,
        segmentType: 'closing_signature',
        segmentName: 'Professional Closing',
        sourceText: 'Sincerely,\nThe Tagrisso Medical Affairs Team',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'low'
      }
    ],
    
    culturalIntelligenceTestPoints: [
      {
        category: 'Oncology Biomarker Communication',
        testPoints: [
          'EGFR mutation testing emphasis',
          'CNS metastases discussion',
          'Resistance mutation education'
        ]
      }
    ],
    
    smartTMMemoryBanks: [
      {
        category: 'Oncology Terminology',
        entries: [
          'non-small cell lung cancer → cancer du poumon non à petites cellules (FR)',
          'EGFR mutation → mutation EGFR (FR)',
          'progression-free survival → survie sans progression (FR)'
        ]
      }
    ],
    
    regulatoryAdaptationPoints: [
      {
        requirement: 'EGFR Testing Requirement',
        markets: ['US', 'EU', 'Canada', 'Australia', 'Japan', 'China']
      }
    ]
  },

  // 7. XARELTO (Venous Thromboembolism)
  {
    templateId: 'xarelto-hcp-clinical-excellence',
    brandName: 'Xarelto',
    brandId: 'xarelto-brand-id',
    therapeuticArea: 'Cardiovascular',
    indication: 'Venous Thromboembolism Treatment & Prevention',
    emailType: 'HCP Clinical Excellence Email',
    
    contentSegments: [
      {
        segmentIndex: 1,
        segmentType: 'subject_line',
        segmentName: 'Subject Line Segment',
        sourceText: 'EINSTEIN Trial Program: Xarelto for VTE Treatment Without Routine Monitoring',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 2,
        segmentType: 'greeting',
        segmentName: 'Professional Greeting',
        sourceText: 'Dear Dr. [Last Name],',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'high',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 3,
        segmentType: 'primary_efficacy',
        segmentName: 'Primary Efficacy Claims Segment',
        sourceText: 'Xarelto (rivaroxaban) demonstrated non-inferiority to standard therapy (enoxaparin/VKA) for the treatment of acute DVT and PE in the EINSTEIN trials. The primary efficacy outcome (recurrent VTE) occurred in 2.1% of Xarelto patients vs. 3.0% of standard therapy (HR 0.68, 95% CI 0.44-1.04, p<0.001 for non-inferiority).',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 4,
        segmentType: 'safety_profile',
        segmentName: 'Safety & Bleeding Data',
        sourceText: 'Major bleeding occurred in 0.8% of Xarelto-treated patients compared to 1.2% with standard therapy (HR 0.65, 95% CI 0.33-1.30). The composite of major plus clinically relevant non-major bleeding was 8.1% vs. 8.1% (HR 0.97, 95% CI 0.76-1.22).',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 5,
        segmentType: 'mechanism_of_action',
        segmentName: 'Mechanism of Action',
        sourceText: 'Xarelto is a direct Factor Xa inhibitor that selectively blocks the active site of Factor Xa, providing predictable anticoagulation without the need for routine monitoring.',
        complexityLevel: 'high',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 6,
        segmentType: 'patient_convenience',
        segmentName: 'Treatment Convenience',
        sourceText: 'Xarelto offers the convenience of a single-drug approach with no bridging required and no routine monitoring needed, simplifying VTE management for both patients and clinicians.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 7,
        segmentType: 'patient_population',
        segmentName: 'Target Patient Population',
        sourceText: 'Xarelto is indicated for the treatment of deep vein thrombosis (DVT) and pulmonary embolism (PE), and to reduce the risk of recurrent DVT and PE.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 8,
        segmentType: 'dosing_administration',
        segmentName: 'Dosing & Administration',
        sourceText: 'For VTE treatment, the recommended dose is 15 mg twice daily with food for the first 21 days, followed by 20 mg once daily with food for continued treatment and prevention.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'high'
      },
      {
        segmentIndex: 9,
        segmentType: 'resources_support',
        segmentName: 'Resources & Support',
        sourceText: 'Access VTE management guidelines, patient education materials, and reimbursement support resources.',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'low',
        regulatoryRiskLevel: 'low'
      },
      {
        segmentIndex: 10,
        segmentType: 'call_to_action',
        segmentName: 'Call-to-Action Segment',
        sourceText: 'Download the EINSTEIN trial summary or request a consultation with our thrombosis specialist.',
        complexityLevel: 'medium',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'medium'
      },
      {
        segmentIndex: 11,
        segmentType: 'closing_signature',
        segmentName: 'Professional Closing',
        sourceText: 'Best regards,\nThe Xarelto Medical Affairs Team',
        complexityLevel: 'low',
        culturalSensitivityLevel: 'medium',
        regulatoryRiskLevel: 'low'
      }
    ],
    
    culturalIntelligenceTestPoints: [
      {
        category: 'Anticoagulation Communication',
        testPoints: [
          'No monitoring convenience emphasis',
          'Bleeding risk communication',
          'Bridge therapy elimination'
        ]
      }
    ],
    
    smartTMMemoryBanks: [
      {
        category: 'Thrombosis Terminology',
        entries: [
          'deep vein thrombosis → thrombose veineuse profonde (FR)',
          'pulmonary embolism → embolie pulmonaire (FR)',
          'venous thromboembolism → thromboembolie veineuse (FR)'
        ]
      }
    ],
    
    regulatoryAdaptationPoints: [
      {
        requirement: 'Bleeding Risk Warning',
        markets: ['US', 'EU', 'Canada', 'Australia']
      }
    ]
  }
];
