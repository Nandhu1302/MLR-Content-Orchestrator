
// ============================================
// Brand-Indication and Audience Mappings Configuration
// ============================================

// Removed TypeScript-specific types and annotations

export const brandIndicationMap = {
  // Respiratory/Fibrotic Diseases
  'Ofev': [
    { value: 'IPF', label: 'IPF (Idiopathic Pulmonary Fibrosis)' },
    { value: 'SSc-ILD', label: 'SSc-ILD (Systemic Sclerosis-Associated ILD)' },
    { value: 'Progressive-Fibrosing-ILD', label: 'Progressive Fibrosing ILD' }
  ],

  // Cardiovascular
  'Pradaxa': [
    { value: 'A-Fib', label: 'Atrial Fibrillation' },
    { value: 'VTE-Prevention', label: 'VTE Prevention' },
    { value: 'Stroke-Prevention', label: 'Stroke Prevention' }
  ],
  'Xarelto': [
    { value: 'A-Fib', label: 'Atrial Fibrillation' },
    { value: 'VTE-Prevention', label: 'VTE Prevention' },
    { value: 'Stroke-Prevention', label: 'Stroke Prevention' }
  ],
  'Entresto': [
    { value: 'Heart-Failure', label: 'Heart Failure with Reduced Ejection Fraction' },
    { value: 'Cardiovascular-Death-Reduction', label: 'Cardiovascular Death Reduction' }
  ],

  // Diabetes/Metabolic
  'Jardiance': [
    { value: 'Type-2-Diabetes', label: 'Type 2 Diabetes' },
    { value: 'Cardiovascular-Death-Reduction', label: 'Cardiovascular Death Reduction' },
    { value: 'Heart-Failure', label: 'Heart Failure' }
  ],

  // Oncology
  'Tagrisso': [
    { value: 'NSCLC', label: 'Non-Small Cell Lung Cancer (EGFR+)' },
    { value: 'EGFR-Mutated-NSCLC', label: 'EGFR-Mutated NSCLC' }
  ],
  'Erbitux': [
    { value: 'Colorectal-Cancer', label: 'Colorectal Cancer (RAS Wild-Type)' },
    { value: 'Head-Neck-Cancer', label: 'Head and Neck Squamous Cell Carcinoma' }
  ],

  // Immunology
  'Dupixent': [
    { value: 'Atopic-Dermatitis', label: 'Atopic Dermatitis' },
    { value: 'Asthma', label: 'Moderate-to-Severe Asthma' },
    { value: 'Chronic-Rhinosinusitis', label: 'Chronic Rhinosinusitis with Nasal Polyps' }
  ],

  // HIV/AIDS
  'Biktarvy': [
    { value: 'HIV-Treatment', label: 'HIV-1 Treatment (Adults and Pediatric ≥14kg)' }
  ]
};

export const defaultIndications = [
  { value: 'IPF', label: 'IPF (Idiopathic Pulmonary Fibrosis)' },
  { value: 'SSc-ILD', label: 'SSc-ILD (Systemic Sclerosis-Associated ILD)' },
  { value: 'Progressive-Fibrosing-ILD', label: 'Progressive Fibrosing ILD' },
  { value: 'A-Fib', label: 'Atrial Fibrillation' },
  { value: 'VTE-Prevention', label: 'VTE Prevention' },
  { value: 'Stroke-Prevention', label: 'Stroke Prevention' },
  { value: 'Type-2-Diabetes', label: 'Type 2 Diabetes' },
  { value: 'Cardiovascular-Death-Reduction', label: 'Cardiovascular Death Reduction' },
  { value: 'Heart-Failure', label: 'Heart Failure' },
  { value: 'Atopic-Dermatitis', label: 'Atopic Dermatitis' },
  { value: 'Asthma', label: 'Moderate-to-Severe Asthma' },
  { value: 'Chronic-Rhinosinusitis', label: 'Chronic Rhinosinusitis with Nasal Polyps' },
  { value: 'HIV-Treatment', label: 'HIV-1 Treatment' },
  { value: 'HIV-Prevention', label: 'HIV Prevention (PrEP)' },
  { value: 'HIV-PrEP', label: 'Pre-Exposure Prophylaxis (PrEP)' }
];

export const brandAudienceMap = {
  // Respiratory/Fibrotic Diseases
  'Ofev': ['Pulmonologists', 'Rheumatologists', 'Primary Care', 'Nurse Practitioners', 'Specialists'],

  // Cardiovascular
  'Pradaxa': ['Cardiologists', 'Electrophysiologists', 'Interventional Cardiologists', 'Primary Care', 'Nurse Practitioners'],
  'Xarelto': ['Cardiologists', 'Electrophysiologists', 'Vascular Surgeons', 'Primary Care', 'Emergency Medicine'],
  'Entresto': ['Cardiologists', 'Heart Failure Specialists', 'Primary Care', 'Nurse Practitioners', 'Internists'],

  // Diabetes/Metabolic
  'Jardiance': ['Endocrinologists', 'Primary Care', 'Diabetes Specialists', 'Nurse Practitioners', 'Family Medicine'],

  // Oncology
  'Tagrisso': ['Medical Oncologists', 'Pulmonologists', 'Thoracic Oncologists', 'Hematology-Oncology', 'Advanced Practice Providers'],
  'Erbitux': ['Medical Oncologists', 'Colorectal Specialists', 'Head/Neck Oncologists', 'Hematology-Oncology', 'Advanced Practice Providers'],

  // HIV/AIDS
  'Biktarvy': ['Infectious Disease Specialists', 'HIV Specialists', 'Primary Care', 'Internal Medicine', 'Advanced Practice Providers']
};
