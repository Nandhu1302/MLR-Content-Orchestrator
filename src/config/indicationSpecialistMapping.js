
// (Removed) import type { Indication } from '@/types/intake';

// (Removed) export interface SpecialistMapping { ... }

export const INDICATION_SPECIALIST_MAP = {
  'IPF': {
    specialistType: 'pulmonologist',
    specialistDisplayName: 'Pulmonologist',
    therapeuticArea: 'Respiratory Medicine',
    subspecialties: ['Interstitial Lung Disease Specialist', 'Critical Care Pulmonologist'],
    indicationFocus: 'Idiopathic Pulmonary Fibrosis'
  },
  'SSc-ILD': {
    specialistType: 'pulmonologist',
    specialistDisplayName: 'Pulmonologist / Rheumatologist',
    therapeuticArea: 'Respiratory Medicine / Rheumatology',
    subspecialties: ['Interstitial Lung Disease Specialist', 'Scleroderma Specialist'],
    indicationFocus: 'Systemic Sclerosis-Associated Interstitial Lung Disease'
  },
  'Progressive-Fibrosing-ILD': {
    specialistType: 'pulmonologist',
    specialistDisplayName: 'Pulmonologist',
    therapeuticArea: 'Respiratory Medicine',
    subspecialties: ['Interstitial Lung Disease Specialist', 'Progressive Fibrosing ILD Specialist'],
    indicationFocus: 'Progressive Fibrosing Interstitial Lung Disease'
  },
  'A-Fib': {
    specialistType: 'cardiologist',
    specialistDisplayName: 'Cardiologist',
    therapeuticArea: 'Cardiology',
    subspecialties: ['Electrophysiologist', 'Heart Rhythm Specialist', 'General Cardiologist'],
    indicationFocus: 'Atrial Fibrillation'
  },
  'VTE-Prevention': {
    specialistType: 'cardiologist',
    specialistDisplayName: 'Cardiologist / Hematologist',
    therapeuticArea: 'Cardiology / Hematology',
    subspecialties: ['Thrombosis Specialist', 'Vascular Medicine Specialist'],
    indicationFocus: 'Venous Thromboembolism Prevention'
  },
  'Stroke-Prevention': {
    specialistType: 'neurologist',
    specialistDisplayName: 'Neurologist / Cardiologist',
    therapeuticArea: 'Neurology / Cardiology',
    subspecialties: ['Stroke Specialist', 'Vascular Neurologist', 'Electrophysiologist'],
    indicationFocus: 'Stroke Prevention'
  },
  'Type-2-Diabetes': {
    specialistType: 'endocrinologist',
    specialistDisplayName: 'Endocrinologist',
    therapeuticArea: 'Endocrinology',
    subspecialties: ['Diabetes Specialist', 'Diabetologist'],
    indicationFocus: 'Type 2 Diabetes Mellitus'
  },
  'Cardiovascular-Death-Reduction': {
    specialistType: 'cardiologist',
    specialistDisplayName: 'Cardiologist',
    therapeuticArea: 'Cardiology',
    subspecialties: ['Preventive Cardiologist', 'Heart Failure Specialist'],
    indicationFocus: 'Cardiovascular Death Reduction'
  },
  'Heart-Failure': {
    specialistType: 'cardiologist',
    specialistDisplayName: 'Cardiologist',
    therapeuticArea: 'Cardiology',
    subspecialties: ['Heart Failure Specialist', 'Advanced Heart Failure Cardiologist'],
    indicationFocus: 'Heart Failure'
  },
  'NSCLC': {
    specialistType: 'oncologist',
    specialistDisplayName: 'Oncologist',
    therapeuticArea: 'Oncology',
    subspecialties: ['Medical Oncologist', 'Thoracic Oncologist', 'Lung Cancer Specialist'],
    indicationFocus: 'Non-Small Cell Lung Cancer'
  },
  'EGFR-Mutated-NSCLC': {
    specialistType: 'oncologist',
    specialistDisplayName: 'Oncologist',
    therapeuticArea: 'Oncology',
    subspecialties: ['Medical Oncologist', 'Thoracic Oncologist', 'Molecular Oncologist'],
    indicationFocus: 'EGFR-Mutated Non-Small Cell Lung Cancer'
  },
  'Colorectal-Cancer': {
    specialistType: 'oncologist',
    specialistDisplayName: 'Oncologist',
    therapeuticArea: 'Oncology',
    subspecialties: ['Medical Oncologist', 'GI Oncologist', 'Colorectal Cancer Specialist'],
    indicationFocus: 'Colorectal Cancer'
  },
  'Head-Neck-Cancer': {
    specialistType: 'oncologist',
    specialistDisplayName: 'Oncologist',
    therapeuticArea: 'Oncology',
    subspecialties: ['Medical Oncologist', 'Head & Neck Oncologist', 'ENT Oncologist'],
    indicationFocus: 'Head and Neck Cancer'
  },
  'Atopic-Dermatitis': {
    specialistType: 'dermatologist',
    specialistDisplayName: 'Dermatologist',
    therapeuticArea: 'Dermatology',
    subspecialties: ['Dermatologist', 'Immunodermatologist', 'Pediatric Dermatologist'],
    indicationFocus: 'Atopic Dermatitis'
  },
  'Asthma': {
    specialistType: 'pulmonologist',
    specialistDisplayName: 'Pulmonologist / Allergist',
    therapeuticArea: 'Respiratory Medicine / Allergy & Immunology',
    subspecialties: ['Asthma Specialist', 'Allergist-Immunologist'],
    indicationFocus: 'Asthma'
  },
  'Chronic-Rhinosinusitis': {
    specialistType: 'ent-specialist',
    specialistDisplayName: 'ENT Specialist / Allergist',
    therapeuticArea: 'Otolaryngology / Allergy & Immunology',
    subspecialties: ['Rhinologist', 'Allergist-Immunologist', 'Sinus Specialist'],
    indicationFocus: 'Chronic Rhinosinusitis'
  },
  'HIV-Treatment': {
    specialistType: 'infectious-disease-specialist',
    specialistDisplayName: 'Infectious Disease Specialist',
    therapeuticArea: 'Infectious Disease',
    subspecialties: ['HIV Specialist', 'Infectious Disease Specialist', 'Internal Medicine'],
    indicationFocus: 'HIV-1 Treatment'
  },
  'HIV-Prevention': {
    specialistType: 'infectious-disease-specialist',
    specialistDisplayName: 'Infectious Disease Specialist',
    therapeuticArea: 'Infectious Disease',
    subspecialties: ['HIV Specialist', 'PrEP Specialist', 'Preventive Medicine'],
    indicationFocus: 'HIV Prevention (PrEP)'
  },
  'HIV-PrEP': {
    specialistType: 'infectious-disease-specialist',
    specialistDisplayName: 'Infectious Disease Specialist',
    therapeuticArea: 'Infectious Disease',
    subspecialties: ['HIV Specialist', 'PrEP Specialist', 'Primary Care'],
    indicationFocus: 'Pre-Exposure Prophylaxis (PrEP)'
  }
};

/**
 * Get specialist information from indication
 */
export const getSpecialistFromIndication = (indication) => {
  return INDICATION_SPECIALIST_MAP[indication] || null;
};

/**
 * Get specialist display name
 */
export const getSpecialistDisplayName = (indication) => {
  const mapping = INDICATION_SPECIALIST_MAP[indication];
  return mapping ? mapping.specialistDisplayName : 'Specialist';
};

/**
 * Get therapeutic area
 */
export const getTherapeuticArea = (indication) => {
  const mapping = INDICATION_SPECIALIST_MAP[indication];
  return mapping ? mapping.therapeuticArea : 'General Medicine';
};
