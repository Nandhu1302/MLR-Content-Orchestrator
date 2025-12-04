
export class BrandDemoContentGenerator {
  static DEMO_CONTENT_TEMPLATES = {
    'jardiance': {
      therapeuticArea: 'Diabetes & Cardiovascular',
      indication: 'Type 2 diabetes with proven cardiovascular benefits',
      targetAudience: 'Endocrinologists, Cardiologists, Primary Care Physicians',
      title: 'Jardiance HCP Email - Cardiovascular Outcomes in T2D',
      content: `Dear Healthcare Professional,
Type 2 diabetes affects over 37 million Americans and significantly increases cardiovascular risk. Clinical evidence demonstrates that JARDIANCE (empagliflozin) provides superior cardiovascular protection beyond glycemic control.
The landmark EMPA-REG OUTCOME study showed that JARDIANCE reduced the risk of cardiovascular death by 38% in adults with type 2 diabetes and established cardiovascular disease. Additionally, JARDIANCE demonstrated a 35% reduction in hospitalization for heart failure.
JARDIANCE offers dual benefits for your type 2 diabetes patients: effective glucose management with proven cardiovascular protection. The safety profile has been well-established across multiple clinical trials with over 15,000 patient-years of exposure.
For complete prescribing information and clinical data on JARDIANCE's cardiovascular benefits, please review the attached materials.
Best regards,
Medical Affairs Team`,
      keyMessages: [
        'JARDIANCE reduces cardiovascular death by 38% in T2D patients',
        'Proven dual benefits: glucose control + CV protection',
        'Well-established safety profile across clinical trials'
      ],
      campaignName: 'T2D Cardiovascular Protection 2024',
      warnings: ['Diabetic ketoacidosis risk', 'Genital mycotic infections', 'Urinary tract infections'],
      contraindications: ['Severe renal impairment', 'End-stage renal disease', 'Dialysis'],
      keyStudies: ['EMPA-REG OUTCOME', 'EMPEROR-Reduced', 'EMPEROR-Preserved'],
      regulatoryRequirements: [
        {
          id: 'diabetes_indication',
          title: 'Diabetes Indication Statement',
          suggestion: 'JARDIANCE® (empagliflozin) is indicated as an adjunct to diet and exercise to improve glycemic control in adults with type 2 diabetes mellitus.',
          category: 'indication'
        },
        {
          id: 'cv_indication',
          title: 'Cardiovascular Indication',
          suggestion: 'JARDIANCE is indicated to reduce the risk of cardiovascular death in adults with type 2 diabetes mellitus and established cardiovascular disease.',
          category: 'indication'
        },
        {
          id: 'diabetes_safety',
          title: 'Diabetes Safety Information',
          suggestion: 'The most common adverse reactions associated with JARDIANCE (5% or greater incidence) were urinary tract infection and female genital mycotic infection.',
          category: 'safety'
        },
        {
          id: 'ketoacidosis_warning',
          title: 'Ketoacidosis Warning',
          suggestion: 'JARDIANCE may increase the risk of diabetic ketoacidosis. Consider factors that may predispose to ketoacidosis.',
          category: 'safety'
        }
      ],
      mlrFeedback: [
        {
          reviewerId: 'med_jardiance_001',
          reviewerName: 'Dr. Maria Rodriguez',
          reviewerType: 'medical',
          feedback: 'The cardiovascular death reduction claim needs the specific population qualifier. Should state "38% reduction in adults with type 2 diabetes AND established cardiovascular disease" to match the EMPA-REG OUTCOME trial population.',
          category: 'claim',
          severity: 'high',
          date: '2024-01-15',
          suggestedText: '38% reduction in cardiovascular death in adults with type 2 diabetes and established cardiovascular disease',
          historicalContext: 'Previous similar claims were rejected for lacking specific population qualifiers'
        },
        {
          reviewerId: 'reg_jardiance_001',
          reviewerName: 'James Wilson',
          reviewerType: 'regulatory',
          feedback: 'Fair balance is missing. All efficacy claims for diabetes medications must include the most common adverse reactions. Add: "The most common adverse reactions were urinary tract infection and female genital mycotic infection."',
          category: 'safety',
          severity: 'high',
          date: '2024-01-14',
          suggestedText: 'The most common adverse reactions associated with JARDIANCE were urinary tract infection and female genital mycotic infection.',
          historicalContext: 'Fair balance is required for all diabetes medication promotional materials per FDA guidance'
        },
        {
          reviewerId: 'med_jardiance_002',
          reviewerName: 'Dr. Susan Chen',
          reviewerType: 'medical',
          feedback: 'The "well-established safety profile" claim is too broad. Specify the actual safety data from the clinical trials, particularly the cardiovascular safety profile from EMPA-REG OUTCOME.',
          category: 'claim',
          severity: 'medium',
          date: '2024-01-12',
          suggestedText: 'Safety profile established in clinical trials including EMPA-REG OUTCOME with over 15,000 patient-years of exposure',
          historicalContext: 'Vague safety claims require specific data support per MLR guidelines'
        }
      ]
    },
    'ofev': {
      therapeuticArea: 'Respiratory',
      indication: 'Idiopathic pulmonary fibrosis (IPF)',
      targetAudience: 'Pulmonologists, Primary Care Physicians',
      title: 'Ofev HCP Email - IPF Disease Management',
      content: `Dear Healthcare Professional,
Idiopathic pulmonary fibrosis (IPF) is a progressive, life-threatening lung disease affecting approximately 100,000 people in the United States. Clinical studies have shown that OFEV significantly reduces the annual rate of decline in forced vital capacity (FVC) by 68% compared to placebo in IPF patients.
OFEV has been proven superior to standard of care in multiple clinical trials, including the landmark INPULSIS studies. Patients treated with OFEV demonstrated well-tolerated safety profile with minimal side effects reported in clinical practice.
For more information about OFEV's proven efficacy in IPF management, please review the attached clinical data summary and prescribing information.
Best regards,
Medical Affairs Team`,
      keyMessages: ['OFEV significantly slows IPF progression', 'Proven efficacy in clinical trials'],
      campaignName: 'IPF Disease Awareness 2024',
      warnings: ['Gastrointestinal side effects', 'Hepatic impairment', 'Reproductive toxicity'],
      contraindications: ['Pregnancy', 'Severe hepatic impairment'],
      keyStudies: ['INPULSIS-1', 'INPULSIS-2', 'SENSCIS'],
      regulatoryRequirements: [
        {
          id: 'ipf_indication',
          title: 'IPF Indication Statement',
          suggestion: 'OFEV® (nintedanib) is indicated for the treatment of idiopathic pulmonary fibrosis (IPF).',
          category: 'indication'
        },
        {
          id: 'ipf_safety',
          title: 'IPF Safety Information',
          suggestion: 'The most common adverse reactions (≥3%) are diarrhea, nausea, abdominal pain, vomiting, liver enzyme elevation, decreased appetite, headache, weight decreased, and hypertension.',
          category: 'safety'
        },
        {
          id: 'hepatic_warning',
          title: 'Hepatic Monitoring Warning',
          suggestion: 'OFEV can cause elevations of liver enzymes. Monitor ALT, AST, and bilirubin prior to treatment, at months 1 and 3, and every 3 months thereafter.',
          category: 'safety'
        },
        {
          id: 'gi_warning',
          title: 'Gastrointestinal Warning',
          suggestion: 'Diarrhea was the most frequent gastrointestinal adverse reaction. Treat diarrhea promptly with adequate fluid replacement and antidiarrheal medication.',
          category: 'safety'
        }
      ],
      mlrFeedback: [
        {
          reviewerId: 'med_ofev_001',
          reviewerName: 'Dr. Sarah Johnson',
          reviewerType: 'medical',
          feedback: 'The efficacy claim "significantly reduces" needs specific percentage and confidence interval from the INPULSIS studies. Suggest: "reduces annual rate of FVC decline by 68% (95% CI: 51%, 80%)"',
          category: 'claim',
          severity: 'high',
          date: '2024-01-15',
          suggestedText: 'reduces annual rate of FVC decline by 68% (95% CI: 51%, 80%)',
          historicalContext: 'All efficacy claims require specific data with confidence intervals per FDA guidance'
        },
        {
          reviewerId: 'reg_ofev_001',
          reviewerName: 'Jennifer Martinez',
          reviewerType: 'regulatory',
          feedback: 'Missing fair balance. All efficacy claims must be accompanied by the most common adverse reactions. Include: "The most common adverse reactions (≥3%) are diarrhea, nausea, abdominal pain..."',
          category: 'safety',
          severity: 'high',
          date: '2024-01-14',
          suggestedText: 'The most common adverse reactions (≥3%) are diarrhea, nausea, abdominal pain, vomiting, liver enzyme elevation, decreased appetite, headache, weight decreased, and hypertension.',
          historicalContext: 'Fair balance is mandatory for all IPF medication promotional materials'
        },
        {
          reviewerId: 'legal_ofev_001',
          reviewerName: 'Michael Chen',
          reviewerType: 'legal',
          feedback: 'The statement "minimal side effects" is misleading. OFEV has significant GI and hepatic side effects that require monitoring. Remove or qualify this statement.',
          category: 'claim',
          severity: 'high',
          date: '2024-01-12',
          suggestedText: 'OFEV has a well-characterized safety profile in clinical trials',
          historicalContext: 'Statements minimizing side effects are prohibited in pharmaceutical promotional materials'
        }
      ]
    },
    'pradaxa': {
      therapeuticArea: 'Cardiovascular',
      indication: 'Stroke prevention in atrial fibrillation',
      targetAudience: 'Cardiologists, Neurologists, Primary Care Physicians',
      title: 'Pradaxa HCP Email - Stroke Prevention in AFib',
      content: `Dear Healthcare Professional,
Atrial fibrillation (AFib) affects over 6 million Americans and increases stroke risk by 5-fold. PRADAXA (dabigatran) provides superior stroke prevention compared to warfarin with the convenience of fixed dosing and no routine monitoring requirements.
The pivotal RE-LY trial demonstrated that PRADAXA 150mg twice daily reduced stroke and systemic embolism by 35% compared to warfarin in patients with AFib. Additionally, PRADAXA showed a significant 74% reduction in hemorrhagic stroke risk.
PRADAXA offers your AFib patients effective stroke prevention without the dietary restrictions and frequent monitoring associated with warfarin therapy. The established safety profile provides confidence in long-term anticoagulation management.
For complete prescribing information and clinical evidence supporting PRADAXA in AFib, please review the enclosed materials.
Best regards,
Medical Affairs Team`,
      keyMessages: [
        'PRADAXA reduces stroke risk by 35% vs warfarin in AFib',
        'No routine monitoring or dietary restrictions required',
        '74% reduction in hemorrhagic stroke risk'
      ],
      campaignName: 'AFib Stroke Prevention 2024',
      warnings: ['Bleeding risk', 'Renal impairment considerations', 'Drug interactions'],
      contraindications: ['Active bleeding', 'Severe renal impairment', 'Mechanical heart valves'],
      keyStudies: ['RE-LY', 'RE-COVER', 'RE-MEDY'],
      regulatoryRequirements: [
        {
          id: 'afib_indication',
          title: 'AFib Indication Statement',
          suggestion: 'PRADAXA® (dabigatran etexilate) is indicated to reduce the risk of stroke and systemic embolism in patients with non-valvular atrial fibrillation.',
          category: 'indication'
        },
        {
          id: 'bleeding_warning',
          title: 'Bleeding Risk Warning',
          suggestion: 'PRADAXA increases the risk of bleeding and can cause serious and sometimes fatal bleeding. Promptly evaluate any signs or symptoms of blood loss.',
          category: 'safety'
        },
        {
          id: 'renal_dosing',
          title: 'Renal Impairment Dosing',
          suggestion: 'Dosage adjustment is required for patients with moderate renal impairment (CrCl 30-50 mL/min). PRADAXA is contraindicated in patients with severe renal impairment.',
          category: 'safety'
        },
        {
          id: 'mechanical_valves',
          title: 'Mechanical Heart Valves Contraindication',
          suggestion: 'PRADAXA is contraindicated in patients with mechanical prosthetic heart valves. The safety and efficacy of PRADAXA in patients with prosthetic heart valves has not been studied.',
          category: 'safety'
        }
      ],
      mlrFeedback: [
        {
          reviewerId: 'med_pradaxa_001',
          reviewerName: 'Dr. Patricia Adams',
          reviewerType: 'medical',
          feedback: 'The stroke reduction claim must specify the patient population. Should read "35% reduction in stroke and systemic embolism in patients with non-valvular atrial fibrillation" to match the RE-LY trial.',
          category: 'claim',
          severity: 'high',
          date: '2024-01-15',
          suggestedText: '35% reduction in stroke and systemic embolism in patients with non-valvular atrial fibrillation',
          historicalContext: 'Population-specific claims are required to match clinical trial enrollment criteria'
        },
        {
          reviewerId: 'reg_pradaxa_001',
          reviewerName: 'Robert Kim',
          reviewerType: 'regulatory',
          feedback: 'Missing bleeding risk information. All PRADAXA promotional materials must include the boxed warning about bleeding risk. Add prominent bleeding risk statement.',
          category: 'safety',
          severity: 'high',
          date: '2024-01-14',
          suggestedText: 'PRADAXA increases the risk of bleeding and can cause serious and sometimes fatal bleeding. Promptly evaluate any signs or symptoms of blood loss.',
          historicalContext: 'FDA boxed warning must be prominently featured in all promotional materials for anticoagulants'
        },
        {
          reviewerId: 'med_pradaxa_002',
          reviewerName: 'Dr. Lisa Thompson',
          reviewerType: 'medical',
          feedback: 'The "established safety profile" needs qualification. Specify that this refers to the bleeding risk profile compared to warfarin, not absence of bleeding risk.',
          category: 'claim',
          severity: 'medium',
          date: '2024-01-12',
          suggestedText: 'safety profile established in clinical trials with predictable bleeding risk compared to warfarin',
          historicalContext: 'Safety claims for anticoagulants must acknowledge bleeding risks per regulatory guidance'
        }
      ]
    },
    'erbitux': {
      therapeuticArea: 'Oncology',
      indication: 'Metastatic colorectal cancer and head and neck squamous cell carcinoma',
      targetAudience: 'Oncologists, Hematologists, Primary Care Physicians',
      title: 'Erbitux HCP Email - EGFR-Targeted Therapy in mCRC',
      content: `Dear Healthcare Professional,
Metastatic colorectal cancer (mCRC) affects over 150,000 patients annually in the United States. ERBITUX (cetuximab) is an EGFR-targeted monoclonal antibody proven to extend overall survival when combined with chemotherapy in RAS wild-type mCRC patients.
The landmark CRYSTAL study demonstrated that ERBITUX plus FOLFIRI significantly improved overall survival by 23.5 months vs 20.0 months with FOLFIRI alone in first-line RAS wild-type mCRC (HR=0.796; 95% CI: 0.670-0.946).
ERBITUX offers your oncology patients a targeted treatment approach with established efficacy in both first-line and later-line settings. The well-characterized safety profile includes manageable skin toxicities that are often predictive of clinical benefit.
For complete prescribing information and clinical data on ERBITUX in mCRC and HNSCC, please review the attached materials.
Best regards,
Medical Affairs Team`,
      keyMessages: [
        'ERBITUX extends OS in RAS wild-type mCRC patients',
        'EGFR-targeted therapy with proven clinical benefits',
        'Established efficacy in first-line and later-line settings'
      ],
      campaignName: 'mCRC Targeted Therapy 2024',
      warnings: ['Infusion reactions', 'Skin toxicity', 'Hypomagnesemia'],
      contraindications: ['Known severe hypersensitivity to cetuximab'],
      keyStudies: ['CRYSTAL', 'OPUS', 'EVEREST'],
      regulatoryRequirements: [
        {
          id: 'mcrc_indication',
          title: 'mCRC Indication Statement',
          suggestion: 'ERBITUX® (cetuximab) is indicated for the treatment of RAS wild-type, EGFR-expressing, metastatic colorectal cancer as determined by FDA-approved tests.',
          category: 'indication'
        },
        {
          id: 'hnscc_indication',
          title: 'HNSCC Indication Statement',
          suggestion: 'ERBITUX is indicated for the treatment of squamous cell carcinoma of the head and neck in combination with radiation therapy.',
          category: 'indication'
        },
        {
          id: 'skin_toxicity',
          title: 'Skin Toxicity Warning',
          suggestion: 'Skin toxicity occurred in 90% of patients. Monitor for skin toxicity and withhold ERBITUX for severe reactions.',
          category: 'safety'
        },
        {
          id: 'infusion_reactions',
          title: 'Infusion Reaction Warning',
          suggestion: 'Serious infusion reactions occurred in 3% of patients. Interrupt infusion and permanently discontinue for severe reactions.',
          category: 'safety'
        }
      ],
      mlrFeedback: [
        {
          reviewerId: 'med_erbitux_001',
          reviewerName: 'Dr. Jennifer Liu',
          reviewerType: 'medical',
          feedback: 'The OS benefit claim must specify the specific population and include the hazard ratio. Should state "23.5 vs 20.0 months OS in RAS wild-type mCRC with FOLFIRI (HR=0.796)" to match CRYSTAL trial data.',
          category: 'claim',
          severity: 'high',
          date: '2024-01-15',
          suggestedText: '23.5 vs 20.0 months OS in first-line RAS wild-type mCRC with FOLFIRI (HR=0.796; 95% CI: 0.670-0.946)',
          historicalContext: 'OS claims in oncology require specific population and statistical significance data'
        },
        {
          reviewerId: 'reg_erbitux_001',
          reviewerName: 'David Park',
          reviewerType: 'regulatory',
          feedback: 'Missing RAS testing requirement. All mCRC indication claims must specify that RAS wild-type status must be determined by FDA-approved test before treatment.',
          category: 'indication',
          severity: 'high',
          date: '2024-01-14',
          suggestedText: 'ERBITUX is indicated for RAS wild-type mCRC as determined by FDA-approved tests.',
          historicalContext: 'FDA requires RAS testing confirmation for all EGFR inhibitor indications in mCRC'
        }
      ]
    },
    'tagrisso': {
      therapeuticArea: 'Oncology',
      indication: 'EGFR T790M mutation-positive NSCLC',
      targetAudience: 'Oncologists, Pulmonologists, Primary Care Physicians',
      title: 'Tagrisso HCP Email - Third-Generation EGFR Inhibitor in NSCLC',
      content: `Dear Healthcare Professional,
Non-small cell lung cancer (NSCLC) with EGFR mutations affects approximately 15-20% of NSCLC patients in the United States. TAGRISSO (osimertinib) is a third-generation EGFR tyrosine kinase inhibitor specifically designed to overcome T790M resistance mutations.
The pivotal AURA3 trial demonstrated that TAGRISSO significantly improved progression-free survival compared to platinum-based chemotherapy in T790M-positive NSCLC patients (10.1 vs 4.2 months; HR=0.30; 95% CI: 0.23-0.41).
TAGRISSO offers your lung cancer patients a targeted oral therapy with proven efficacy against both sensitizing EGFR mutations and the T790M resistance mutation. The favorable tolerability profile allows for sustained treatment duration.
For complete prescribing information and clinical evidence supporting TAGRISSO in EGFR+ NSCLC, please review the enclosed materials.
Best regards,
Medical Affairs Team`,
      keyMessages: [
        'TAGRISSO overcomes T790M resistance in EGFR+ NSCLC',
        'Significant PFS improvement vs chemotherapy',
        'Favorable tolerability profile for sustained treatment'
      ],
      campaignName: 'NSCLC Targeted Therapy 2024',
      warnings: ['Interstitial lung disease', 'QTc prolongation', 'Cardiomyopathy'],
      contraindications: ['None specific'],
      keyStudies: ['AURA3', 'FLAURA', 'ADAURA'],
      regulatoryRequirements: [
        {
          id: 'nsclc_t790m_indication',
          title: 'T790M+ NSCLC Indication',
          suggestion: 'TAGRISSO® (osimertinib) is indicated for the treatment of patients with metastatic EGFR T790M mutation-positive non-small cell lung cancer.',
          category: 'indication'
        },
        {
          id: 'ild_warning',
          title: 'Interstitial Lung Disease Warning',
          suggestion: 'Interstitial lung disease (ILD) occurred in 3% of patients. Monitor for pulmonary symptoms and discontinue permanently if ILD is confirmed.',
          category: 'safety'
        }
      ],
      mlrFeedback: [
        {
          reviewerId: 'med_tagrisso_001',
          reviewerName: 'Dr. Michael Chang',
          reviewerType: 'medical',
          feedback: 'The PFS claim needs the specific hazard ratio and confidence interval from AURA3. Should include "HR=0.30; 95% CI: 0.23-0.41" for regulatory compliance.',
          category: 'claim',
          severity: 'high',
          date: '2024-01-15',
          suggestedText: 'PFS 10.1 vs 4.2 months vs chemotherapy (HR=0.30; 95% CI: 0.23-0.41) in T790M+ NSCLC',
          historicalContext: 'Oncology efficacy claims require specific statistical data per FDA guidance'
        }
      ]
    },
    'xarelto': {
      therapeuticArea: 'Cardiovascular',
      indication: 'Stroke prevention in atrial fibrillation and venous thromboembolism',
      targetAudience: 'Cardiologists, Emergency Medicine, Primary Care Physicians',
      title: 'Xarelto HCP Email - Stroke Prevention in AFib',
      content: `Dear Healthcare Professional,
Atrial fibrillation affects over 6 million Americans and significantly increases stroke risk. XARELTO (rivaroxaban) is a factor Xa inhibitor proven to reduce stroke and systemic embolism in patients with non-valvular atrial fibrillation.
The landmark ROCKET AF trial demonstrated that XARELTO was non-inferior to warfarin in preventing stroke and systemic embolism while showing a significant reduction in intracranial hemorrhage and fatal bleeding.
XARELTO offers your AFib patients effective anticoagulation with once-daily dosing and no routine monitoring requirements. The established safety and efficacy profile provides confidence in long-term stroke prevention.
For complete prescribing information and clinical data on XARELTO in AFib, please review the attached materials.
Best regards,
Medical Affairs Team`,
      keyMessages: [
        'XARELTO non-inferior to warfarin for stroke prevention',
        'Once-daily dosing with no routine monitoring',
        'Reduced intracranial hemorrhage vs warfarin'
      ],
      campaignName: 'AFib Anticoagulation 2024',
      warnings: ['Bleeding risk', 'Renal impairment', 'Drug interactions'],
      contraindications: ['Active bleeding', 'Severe renal impairment'],
      keyStudies: ['ROCKET AF', 'EINSTEIN-DVT', 'EINSTEIN-PE'],
      regulatoryRequirements: [
        {
          id: 'afib_indication',
          title: 'AFib Indication Statement',
          suggestion: 'XARELTO® (rivaroxaban) is indicated to reduce the risk of stroke and systemic embolism in patients with non-valvular atrial fibrillation.',
          category: 'indication'
        },
        {
          id: 'bleeding_boxed_warning',
          title: 'Bleeding Boxed Warning',
          suggestion: 'XARELTO increases the risk of bleeding and can cause serious or fatal bleeding. Promptly evaluate signs or symptoms of blood loss.',
          category: 'safety'
        }
      ],
      mlrFeedback: [
        {
          reviewerId: 'reg_xarelto_001',
          reviewerName: 'Lisa Martinez',
          reviewerType: 'regulatory',
          feedback: 'Missing boxed warning for bleeding risk. All XARELTO promotional materials must prominently display the FDA boxed warning about bleeding risk.',
          category: 'safety',
          severity: 'high',
          date: '2024-01-14',
          suggestedText: 'XARELTO increases the risk of bleeding and can cause serious or fatal bleeding.',
          historicalContext: 'FDA boxed warning is mandatory for all anticoagulant promotional materials'
        }
      ]
    },
    'entresto': {
      therapeuticArea: 'Cardiovascular',
      indication: 'Heart failure with reduced ejection fraction',
      targetAudience: 'Cardiologists, Heart Failure Specialists, Primary Care Physicians',
      title: 'Entresto HCP Email - Heart Failure Management',
      content: `Dear Healthcare Professional,
Heart failure affects over 6 million Americans and remains a leading cause of hospitalizations. ENTRESTO (sacubitril/valsartan) is an angiotensin receptor-neprilysin inhibitor (ARNI) that provides superior outcomes compared to ACE inhibitors in heart failure with reduced ejection fraction (HFrEF).
The landmark PARADIGM-HF trial demonstrated that ENTRESTO reduced cardiovascular death and heart failure hospitalization by 20% compared to enalapril in HFrEF patients (HR=0.80; 95% CI: 0.73-0.87).
ENTRESTO offers your heart failure patients a proven therapy that addresses both the renin-angiotensin and natriuretic peptide systems. The established clinical benefits support improved outcomes and quality of life.
For complete prescribing information and clinical evidence supporting ENTRESTO in HFrEF, please review the enclosed materials.
Best regards,
Medical Affairs Team`,
      keyMessages: [
        'ENTRESTO reduces CV death and HF hospitalization by 20%',
        'Superior to ACE inhibitors in HFrEF',
        'Dual mechanism ARNI therapy'
      ],
      campaignName: 'Heart Failure Management 2024',
      warnings: ['Angioedema', 'Hypotension', 'Hyperkalemia'],
      contraindications: ['ACE inhibitor-induced angioedema', 'Concurrent ACE inhibitor use'],
      keyStudies: ['PARADIGM-HF', 'PIONEER-HF', 'PARAGON-HF'],
      regulatoryRequirements: [
        {
          id: 'hfref_indication',
          title: 'HFrEF Indication Statement',
          suggestion: 'ENTRESTO® (sacubitril/valsartan) is indicated to reduce the risk of cardiovascular death and hospitalization for heart failure in patients with chronic heart failure (NYHA Class II-IV) and reduced ejection fraction.',
          category: 'indication'
        },
        {
          id: 'angioedema_warning',
          title: 'Angioedema Warning',
          suggestion: 'ENTRESTO can cause angioedema. Do not administer to patients with a history of ACE inhibitor-associated angioedema.',
          category: 'safety'
        }
      ],
      mlrFeedback: [
        {
          reviewerId: 'med_entresto_001',
          reviewerName: 'Dr. Sarah Thompson',
          reviewerType: 'medical',
          feedback: 'The cardiovascular outcome claim must include the composite endpoint specification and hazard ratio from PARADIGM-HF for accuracy.',
          category: 'claim',
          severity: 'high',
          date: '2024-01-15',
          suggestedText: '20% reduction in cardiovascular death and heart failure hospitalization vs enalapril (HR=0.80; 95% CI: 0.73-0.87)',
          historicalContext: 'Heart failure outcome claims require specific composite endpoint and statistical data'
        }
      ]
    },
    'dupixent': {
      therapeuticArea: 'Immunology - Atopic Dermatitis',
      indication: 'Moderate-to-severe atopic dermatitis in patients inadequately controlled with topical therapies',
      targetAudience: 'Dermatologists, Allergists, Immunologists, Primary Care Physicians',
      title: 'Dupixent HCP Email - Atopic Dermatitis Management',
      content: `Dear Healthcare Professional,
Atopic dermatitis affects approximately 16.5 million adults in the United States, with many experiencing inadequate disease control despite topical therapies. DUPIXENT (dupilumab) is a human monoclonal antibody that inhibits IL-4 and IL-13 signaling, addressing key drivers of type 2 inflammation in atopic dermatitis.
Clinical trials demonstrated that DUPIXENT significantly improved disease severity, with 51% of patients achieving EASI-75 at Week 16 in the SOLO 1 trial compared to 15% with placebo (P<0.0001). Additionally, 38% of DUPIXENT-treated patients achieved clear or almost clear skin (IGA 0/1) compared to 10% with placebo.
DUPIXENT offers your moderate-to-severe atopic dermatitis patients a targeted biologic therapy with proven efficacy and a well-characterized safety profile. The subcutaneous administration every other week provides convenient long-term management.
For complete prescribing information and clinical data on DUPIXENT in atopic dermatitis, please review the attached materials.
Best regards,
Medical Affairs Team`,
      keyMessages: [
        'DUPIXENT targets IL-4 and IL-13, key drivers of type 2 inflammation in atopic dermatitis',
        '51% of patients achieved EASI-75 at Week 16 in SOLO 1 trial vs 15% with placebo',
        '38% achieved clear or almost clear skin (IGA 0/1) vs 10% with placebo'
      ],
      campaignName: 'Atopic Dermatitis Management Excellence 2024',
      warnings: ['Conjunctivitis and other eye problems', 'Joint aches and pain', 'Parasitic infections'],
      contraindications: ['Hypersensitivity to dupilumab or excipients'],
      keyStudies: ['SOLO 1', 'SOLO 2', 'CHRONOS', 'CAFE', 'LIBERTY AD'],
      regulatoryRequirements: [
        {
          id: 'dupixent_ad_indication',
          title: 'Atopic Dermatitis Indication Statement',
          suggestion: 'DUPIXENT® (dupilumab) is indicated for the treatment of adult and pediatric patients aged 6 months and older with moderate-to-severe atopic dermatitis whose disease is not adequately controlled with topical prescription therapies or when those therapies are not advisable.',
          category: 'indication'
        },
        {
          id: 'dupixent_eye_safety',
          title: 'Eye-Related Adverse Reactions',
          suggestion: 'Conjunctivitis and keratitis occurred more frequently in atopic dermatitis subjects treated with DUPIXENT. Advise patients to report new or worsening eye symptoms to their healthcare provider.',
          category: 'safety'
        },
        {
          id: 'dupixent_common_ae',
          title: 'Common Adverse Reactions',
          suggestion: 'The most common adverse reactions (incidence ≥1%) are injection site reactions, conjunctivitis, blepharitis, oral herpes, keratitis, eye pruritus, other herpes simplex virus infection, and dry eye.',
          category: 'safety'
        },
        {
          id: 'dupixent_fair_balance',
          title: 'Fair Balance Requirement',
          suggestion: 'All promotional materials must present efficacy and safety information in fair balance. Include ISI placement per regulatory guidance.',
          category: 'fair_balance'
        }
      ],
      mlrFeedback: [
        {
          reviewerId: 'med_dupixent_001',
          reviewerName: 'Dr. Emily Watson',
          reviewerType: 'medical',
          feedback: 'The EASI-75 efficacy claim must specify the trial name and timepoint. Update to "51% of patients achieved EASI-75 at Week 16 in SOLO 1 trial" for regulatory compliance.',
          category: 'claim',
          severity: 'high',
          date: '2024-01-18',
          suggestedText: '51% of patients achieved EASI-75 at Week 16 in the SOLO 1 trial (vs 15% with placebo; P<0.0001)',
          historicalContext: 'All efficacy claims in atopic dermatitis must reference specific trial names, timepoints, and comparator data per FDA promotional guidance'
        },
        {
          reviewerId: 'reg_dupixent_001',
          reviewerName: 'Catherine Miller',
          reviewerType: 'regulatory',
          feedback: 'Missing critical eye safety information. All DUPIXENT promotional materials must prominently include information about conjunctivitis and other eye-related adverse reactions due to signal identified in clinical trials.',
          category: 'safety',
          severity: 'high',
          date: '2024-01-17',
          suggestedText: 'Important Safety Information: Conjunctivitis and keratitis occurred more frequently with DUPIXENT. The most common adverse reactions include injection site reactions, conjunctivitis, blepharitis, and eye-related symptoms. Patients should be advised to report new or worsening eye problems.',
          historicalContext: 'Eye safety information is a regulatory requirement for all DUPIXENT promotional materials per FDA guidance letter dated 2018'
        },
        {
          reviewerId: 'med_dupixent_002',
          reviewerName: 'Dr. Robert Chang',
          reviewerType: 'medical',
          feedback: 'The IGA 0/1 claim requires the specific placebo comparison from trial data. Include "38% achieved IGA 0/1 with DUPIXENT vs 10% with placebo" to provide proper context and fair balance.',
          category: 'claim',
          severity: 'medium',
          date: '2024-01-15',
          suggestedText: '38% of DUPIXENT-treated patients achieved clear or almost clear skin (IGA 0/1) compared to 10% with placebo in SOLO 1 (P<0.0001)',
          historicalContext: 'All comparative efficacy data must include placebo rates to ensure fair balance and prevent misleading claims'
        },
        {
          reviewerId: 'legal_dupixent_001',
          reviewerName: 'James Peterson',
          reviewerType: 'legal',
          feedback: 'Add trademark symbol (®) after first mention of DUPIXENT in all materials. Ensure consistent brand name capitalization throughout.',
          category: 'general',
          severity: 'low',
          date: '2024-01-14',
          suggestedText: 'DUPIXENT®',
          historicalContext: 'Trademark protection requires proper designation in all promotional materials'
        }
      ]
    }
  };

  static generateBrandDemoContent(selectedBrand) {
    const brandKey = selectedBrand?.brand_name?.toLowerCase();
    if (!brandKey) {
      console.warn('⚠️ No brand selected. Using generic pharmaceutical demo content.');
      return this.generateGenericDemoContent(null);
    }
    const template = this.DEMO_CONTENT_TEMPLATES[brandKey];
    if (!template) {
      console.warn(`⚠️ No demo content template found for brand: ${selectedBrand?.brand_name}. Using generic content. Please add template to DEMO_CONTENT_TEMPLATES in src/utils/brandDemoContent.ts`);
      return this.generateGenericDemoContent(selectedBrand);
    }
    const demoAsset = {
      id: `demo_asset_${brandKey}_001`,
      title: template.title,
      content: template.content,
      type: 'Email',
      status: 'pre_mlr_review',
      brand_id: selectedBrand?.id ?? brandKey,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const demoContext = {
      selectedAsset: demoAsset,
      campaignName: template.campaignName,
      targetAudience: template.targetAudience,
      therapeuticArea: template.therapeuticArea,
      marketRegion: 'US',
      brandGuidelines: {
        keyMessages: template.keyMessages,
        toneGuidelines: 'Professional, evidence-based, supportive',
        complianceRequirements: [
          'All claims must include appropriate fair balance',
          'ISI required for branded communications',
          'Medical review required before publication'
        ]
      },
      regulatoryContext: {
        indication: template.indication,
        warnings: template.warnings,
        contraindications: template.contraindications,
        keyStudies: template.keyStudies,
        regulatoryRequirements: template.regulatoryRequirements,
        mlrFeedback: template.mlrFeedback
      },
      regulatoryRequirements: template.regulatoryRequirements,
      mlrFeedback: template.mlrFeedback
    };
    return demoContext;
  }

  static generateMLRFeedback(selectedBrand) {
    const brandKey = selectedBrand?.brand_name?.toLowerCase();
    if (!brandKey) {
      console.warn('⚠️ No brand selected for MLR feedback. Returning empty feedback.');
      return [];
    }
    const template = this.DEMO_CONTENT_TEMPLATES[brandKey];
    if (!template) {
      console.warn(`⚠️ No MLR feedback template found for brand: ${selectedBrand?.brand_name}.`);
      return [];
    }
    return template.mlrFeedback;
  }

  static generateBrandReferences(selectedBrand) {
    const brandKey = selectedBrand?.brand_name?.toLowerCase();
    const referenceDatabase = {
      'jardiance': [
        {
          id: 'ref_jardiance_001',
          citation: 'Zinman B, et al. Empagliflozin, cardiovascular outcomes, and mortality in type 2 diabetes. N Engl J Med. 2015;373(22):2117-2128.',
          pmid: '26378978',
          doi: '10.1056/NEJMoa1504720',
          title: 'Empagliflozin, cardiovascular outcomes, and mortality in type 2 diabetes (EMPA-REG OUTCOME)',
          authors: 'Zinman B, Wanner C, Lachin JM, et al.',
          journal: 'N Engl J Med',
          year: '2015',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_jardiance_002',
          citation: 'Packer M, et al. Cardiovascular and renal outcomes with empagliflozin in heart failure. N Engl J Med. 2020;383(15):1413-1424.',
          pmid: '32865377',
          doi: '10.1056/NEJMoa2022190',
          title: 'Cardiovascular and renal outcomes with empagliflozin in heart failure (EMPEROR-Reduced)',
          authors: 'Packer M, Anker SD, Butler J, et al.',
          journal: 'N Engl J Med',
          year: '2020',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_jardiance_003',
          citation: 'Anker SD, et al. Empagliflozin in heart failure with a preserved ejection fraction. N Engl J Med. 2021;385(16):1451-1461.',
          pmid: '34449189',
          doi: '10.1056/NEJMoa2107038',
          title: 'Empagliflozin in heart failure with a preserved ejection fraction (EMPEROR-Preserved)',
          authors: 'Anker SD, Butler J, Filippatos G, et al.',
          journal: 'N Engl J Med',
          year: '2021',
          isComplete: true,
          isVerified: true
        }
      ],
      'pradaxa': [
        {
          id: 'ref_pradaxa_001',
          citation: 'Connolly SJ, et al. Dabigatran versus warfarin in patients with atrial fibrillation. N Engl J Med. 2009;361(12):1139-1151.',
          pmid: '19717844',
          doi: '10.1056/NEJMoa0905561',
          title: 'Dabigatran versus warfarin in patients with atrial fibrillation (RE-LY)',
          authors: 'Connolly SJ, Ezekowitz MD, Yusuf S, et al.',
          journal: 'N Engl J Med',
          year: '2009',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_pradaxa_002',
          citation: 'Schulman S, et al. Dabigatran versus warfarin for venous thromboembolism. N Engl J Med. 2009;361(24):2342-2352.',
          pmid: '19966341',
          doi: '10.1056/NEJMoa0906598',
          title: 'Dabigatran versus warfarin for venous thromboembolism (RE-COVER)',
          authors: 'Schulman S, Kearon C, Kakkar AK, et al.',
          journal: 'N Engl J Med',
          year: '2009',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_pradaxa_003',
          citation: 'Schulman S, et al. Extended use of dabigatran for secondary prevention of venous thromboembolism. N Engl J Med. 2013;368(8):709-718.',
          pmid: '23425163',
          doi: '10.1056/NEJMoa1207541',
          title: 'Extended use of dabigatran for secondary prevention of venous thromboembolism (RE-MEDY)',
          authors: 'Schulman S, Kearon C, Kakkar AK, et al.',
          journal: 'N Engl J Med',
          year: '2013',
          isComplete: true,
          isVerified: true
        }
      ],
      'ofev': [
        {
          id: 'ref_ofev_001',
          citation: 'Richeldi L, et al. Efficacy and safety of nintedanib in idiopathic pulmonary fibrosis. N Engl J Med. 2014;370(22):2071-2082.',
          pmid: '24836310',
          doi: '10.1056/NEJMoa1402584',
          title: 'Efficacy and safety of nintedanib in idiopathic pulmonary fibrosis (INPULSIS-1)',
          authors: 'Richeldi L, du Bois RM, Raghu G, et al.',
          journal: 'N Engl J Med',
          year: '2014',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_ofev_002',
          citation: 'Distler O, et al. Nintedanib for systemic sclerosis-associated interstitial lung disease. N Engl J Med. 2019;380(26):2518-2528.',
          pmid: '31112384',
          doi: '10.1056/NEJMoa1903076',
          title: 'Nintedanib for systemic sclerosis-associated interstitial lung disease (SENSCIS)',
          authors: 'Distler O, Highland KB, Gahlemann M, et al.',
          journal: 'N Engl J Med',
          year: '2019',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_ofev_003',
          citation: 'Flaherty KR, et al. Nintedanib in progressive fibrosing interstitial lung diseases. N Engl J Med. 2019;381(18):1718-1727.',
          pmid: '31566307',
          doi: '10.1056/NEJMoa1908681',
          title: 'Nintedanib in progressive fibrosing interstitial lung diseases (INBUILD)',
          authors: 'Flaherty KR, Wells AU, Cottin V, et al.',
          journal: 'N Engl J Med',
          year: '2019',
          isComplete: true,
          isVerified: true
        }
      ],
      'dupixent': [
        {
          id: 'ref_dupixent_001',
          citation: 'Simpson EL, Bieber T, Guttman-Yassky E, et al. Two Phase 3 Trials of Dupilumab versus Placebo in Atopic Dermatitis. N Engl J Med. 2016;375(24):2335-2348.',
          pmid: '27690741',
          doi: '10.1056/NEJMoa1610020',
          title: 'Two Phase 3 Trials of Dupilumab versus Placebo in Atopic Dermatitis (SOLO 1 and SOLO 2)',
          authors: 'Simpson EL, Bieber T, Guttman-Yassky E, et al.',
          journal: 'N Engl J Med',
          year: '2016',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_dupixent_002',
          citation: 'Blauvelt A, de Bruin-Weller M, Gooderham M, et al. Long-term management of moderate-to-severe atopic dermatitis with dupilumab and concomitant topical corticosteroids (CHRONOS): a randomised, placebo-controlled, phase 3 trial. Lancet. 2017;389(10086):2287-2303.',
          pmid: '28478972',
          doi: '10.1016/S0140-6736(17)31191-1',
          title: 'Long-term management of moderate-to-severe atopic dermatitis with dupilumab (CHRONOS)',
          authors: 'Blauvelt A, de Bruin-Weller M, Gooderham M, et al.',
          journal: 'Lancet',
          year: '2017',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_dupixent_003',
          citation: 'Deleuran M, Thaçi D, Beck LA, et al. Dupilumab shows long-term safety and efficacy in patients with moderate to severe atopic dermatitis enrolled in a phase 3 open-label extension study. J Am Acad Dermatol. 2020;82(2):377-388.',
          pmid: '31634530',
          doi: '10.1016/j.jaad.2019.07.074',
          title: 'Dupilumab shows long-term safety and efficacy in moderate to severe atopic dermatitis',
          authors: 'Deleuran M, Thaçi D, Beck LA, et al.',
          journal: 'J Am Acad Dermatol',
          year: '2020',
          isComplete: true,
          isVerified: true
        }
      ],
      'erbitux': [
        {
          id: 'ref_erbitux_001',
          citation: 'Van Cutsem E, Köhne CH, Láng I, et al. Cetuximab plus irinotecan, fluorouracil, and leucovorin as first-line treatment for metastatic colorectal cancer: updated analysis of overall survival according to tumor KRAS and BRAF mutation status. J Clin Oncol. 2011;29(15):2011-2019.',
          pmid: '21502544',
          doi: '10.1200/JCO.2010.33.5091',
          title: 'Cetuximab plus FOLFIRI in first-line metastatic colorectal cancer (CRYSTAL)',
          authors: 'Van Cutsem E, Köhne CH, Láng I, et al.',
          journal: 'J Clin Oncol',
          year: '2011',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_erbitux_002',
          citation: 'Bokemeyer C, Bondarenko I, Makhson A, et al. Fluorouracil, leucovorin, and oxaliplatin with and without cetuximab in the first-line treatment of metastatic colorectal cancer. J Clin Oncol. 2009;27(5):663-671.',
          pmid: '19114683',
          doi: '10.1200/JCO.2008.20.8397',
          title: 'Cetuximab plus FOLFOX4 in first-line metastatic colorectal cancer (OPUS)',
          authors: 'Bokemeyer C, Bondarenko I, Makhson A, et al.',
          journal: 'J Clin Oncol',
          year: '2009',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_erbitux_003',
          citation: 'Bonner JA, Harari PM, Giralt J, et al. Radiotherapy plus cetuximab for squamous-cell carcinoma of the head and neck. N Engl J Med. 2006;354(6):567-578.',
          pmid: '16467544',
          doi: '10.1056/NEJMoa053422',
          title: 'Radiotherapy plus cetuximab for squamous-cell carcinoma of the head and neck',
          authors: 'Bonner JA, Harari PM, Giralt J, et al.',
          journal: 'N Engl J Med',
          year: '2006',
          isComplete: true,
          isVerified: true
        }
      ],
      'tagrisso': [
        {
          id: 'ref_tagrisso_001',
          citation: 'Mok TS, Wu YL, Ahn MJ, et al. Osimertinib or Platinum-Pemetrexed in EGFR T790M-Positive Lung Cancer. N Engl J Med. 2017;376(7):629-640.',
          pmid: '27959700',
          doi: '10.1056/NEJMoa1612674',
          title: 'Osimertinib or Platinum-Pemetrexed in EGFR T790M-Positive Lung Cancer (AURA3)',
          authors: 'Mok TS, Wu YL, Ahn MJ, et al.',
          journal: 'N Engl J Med',
          year: '2017',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_tagrisso_002',
          citation: 'Soria JC, Ohe Y, Vansteenkiste J, et al. Osimertinib in Untreated EGFR-Mutated Advanced Non-Small-Cell Lung Cancer. N Engl J Med. 2018;378(2):113-125.',
          pmid: '29151359',
          doi: '10.1056/NEJMoa1713137',
          title: 'Osimertinib in Untreated EGFR-Mutated Advanced Non-Small-Cell Lung Cancer (FLAURA)',
          authors: 'Soria JC, Ohe Y, Vansteenkiste J, et al.',
          journal: 'N Engl J Med',
          year: '2018',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_tagrisso_003',
          citation: 'Wu YL, Tsuboi M, He J, et al. Osimertinib in Resected EGFR-Mutated Non-Small-Cell Lung Cancer. N Engl J Med. 2020;383(18):1711-1723.',
          pmid: '32955177',
          doi: '10.1056/NEJMoa2027071',
          title: 'Osimertinib in Resected EGFR-Mutated Non-Small-Cell Lung Cancer (ADAURA)',
          authors: 'Wu YL, Tsuboi M, He J, et al.',
          journal: 'N Engl J Med',
          year: '2020',
          isComplete: true,
          isVerified: true
        }
      ],
      'xarelto': [
        {
          id: 'ref_xarelto_001',
          citation: 'Patel MR, Mahaffey KW, Garg J, et al. Rivaroxaban versus warfarin in nonvalvular atrial fibrillation. N Engl J Med. 2011;365(10):883-891.',
          pmid: '21830957',
          doi: '10.1056/NEJMoa1009638',
          title: 'Rivaroxaban versus warfarin in nonvalvular atrial fibrillation (ROCKET AF)',
          authors: 'Patel MR, Mahaffey KW, Garg J, et al.',
          journal: 'N Engl J Med',
          year: '2011',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_xarelto_002',
          citation: 'Bauersachs R, Berkowitz SD, Brenner B, et al. Oral rivaroxaban for symptomatic venous thromboembolism. N Engl J Med. 2010;363(26):2499-2510.',
          pmid: '21128814',
          doi: '10.1056/NEJMoa1007903',
          title: 'Oral rivaroxaban for symptomatic venous thromboembolism (EINSTEIN-DVT)',
          authors: 'Bauersachs R, Berkowitz SD, Brenner B, et al.',
          journal: 'N Engl J Med',
          year: '2010',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_xarelto_003',
          citation: 'Büller HR, Prins MH, Lensin AW, et al. Oral rivaroxaban for the treatment of symptomatic pulmonary embolism. N Engl J Med. 2012;366(14):1287-1297.',
          pmid: '22449293',
          doi: '10.1056/NEJMoa1113572',
          title: 'Oral rivaroxaban for the treatment of symptomatic pulmonary embolism (EINSTEIN-PE)',
          authors: 'Büller HR, Prins MH, Lensin AW, et al.',
          journal: 'N Engl J Med',
          year: '2012',
          isComplete: true,
          isVerified: true
        }
      ],
      'entresto': [
        {
          id: 'ref_entresto_001',
          citation: 'McMurray JJ, Packer M, Desai AS, et al. Angiotensin-neprilysin inhibition versus enalapril in heart failure. N Engl J Med. 2014;371(11):993-1004.',
          pmid: '25176015',
          doi: '10.1056/NEJMoa1409077',
          title: 'Angiotensin-neprilysin inhibition versus enalapril in heart failure (PARADIGM-HF)',
          authors: 'McMurray JJ, Packer M, Desai AS, et al.',
          journal: 'N Engl J Med',
          year: '2014',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_entresto_002',
          citation: 'Velazquez EJ, Morrow DA, DeVore AD, et al. Angiotensin-Neprilysin Inhibition in Acute Decompensated Heart Failure. N Engl J Med. 2019;380(6):539-548.',
          pmid: '30415601',
          doi: '10.1056/NEJMoa1812851',
          title: 'Angiotensin-Neprilysin Inhibition in Acute Decompensated Heart Failure (PIONEER-HF)',
          authors: 'Velazquez EJ, Morrow DA, DeVore AD, et al.',
          journal: 'N Engl J Med',
          year: '2019',
          isComplete: true,
          isVerified: true
        },
        {
          id: 'ref_entresto_003',
          citation: 'Solomon SD, McMurray JJV, Anand IS, et al. Angiotensin-Neprilysin Inhibition in Heart Failure with Preserved Ejection Fraction. N Engl J Med. 2019;381(17):1609-1620.',
          pmid: '31475794',
          doi: '10.1056/NEJMoa1908655',
          title: 'Angiotensin-Neprilysin Inhibition in Heart Failure with Preserved Ejection Fraction (PARAGON-HF)',
          authors: 'Solomon SD, McMurray JJV, Anand IS, et al.',
          journal: 'N Engl J Med',
          year: '2019',
          isComplete: true,
          isVerified: true
        }
      ]
    };
    if (!brandKey) {
      console.warn('⚠️ No brand selected for references. Returning empty reference list.');
      return [];
    }
    const references = referenceDatabase[brandKey];
    if (!references) {
      console.warn(`⚠️ No reference database found for brand: ${selectedBrand?.brand_name}. Returning empty reference list.`);
      return [];
    }
    return references;
  }

  static generateGenericDemoContent(brand) {
    const brandName = brand?.brand_name ?? 'Pharmaceutical Product';
    const therapeuticArea = brand?.therapeutic_area ?? 'General';
    const demoAsset = {
      id: `demo_asset_generic_001`,
      title: `${brandName} HCP Communication`,
      content: `Dear Healthcare Professional,
This is demonstration content for ${brandName}.
[Note: Specific clinical data and regulatory content is being prepared for this brand. This generic template ensures the MLR validation tools are functional while brand-specific content is configured.]
For complete prescribing information, please review the product materials.
Best regards,
Medical Affairs Team`,
      type: 'Email',
      status: 'pre_mlr_review',
      brand_id: brand?.id ?? 'generic',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return {
      selectedAsset: demoAsset,
      campaignName: `${brandName} Campaign 2024`,
      targetAudience: 'Healthcare Professionals',
      therapeuticArea: therapeuticArea,
      marketRegion: 'US',
      brandGuidelines: {
        keyMessages: [`${brandName} key clinical messages`],
        toneGuidelines: 'Professional, evidence-based, supportive',
        complianceRequirements: [
          'All claims must include appropriate fair balance',
          'ISI required for branded communications',
          'Medical review required before publication'
        ]
      },
      regulatoryContext: {
        indication: `${brandName} indication information`,
        warnings: ['Refer to prescribing information'],
        contraindications: ['Refer to prescribing information'],
        keyStudies: [],
        regulatoryRequirements: [],
        mlrFeedback: []
      },
      regulatoryRequirements: [],
      mlrFeedback: []
    };
  }
}