-- Phase 2: Add Audience Sophistication System
-- Add complexity levels to clinical_claims
ALTER TABLE clinical_claims 
ADD COLUMN IF NOT EXISTS complexity_level TEXT CHECK (complexity_level IN ('expert', 'standard', 'simplified', 'patient-friendly'));

ALTER TABLE clinical_claims
ADD COLUMN IF NOT EXISTS target_audiences TEXT[] DEFAULT '{}';

-- Add reading levels to content_segments
ALTER TABLE content_segments
ADD COLUMN IF NOT EXISTS reading_level TEXT CHECK (reading_level IN ('expert', 'professional', 'accessible', 'patient'));

ALTER TABLE content_segments
ADD COLUMN IF NOT EXISTS audience_appropriateness TEXT[] DEFAULT '{}';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_claims_complexity ON clinical_claims(complexity_level);
CREATE INDEX IF NOT EXISTS idx_segments_reading ON content_segments(reading_level);

-- Backfill existing clinical_claims with intelligent complexity tagging
UPDATE clinical_claims SET complexity_level = 
  CASE
    -- Expert level: Contains statistical analysis, methodology, complex endpoints
    WHEN claim_text ILIKE '%p-value%' OR 
         claim_text ILIKE '%CI:%' OR 
         claim_text ILIKE '%confidence interval%' OR
         claim_text ILIKE '%hazard ratio%' OR 
         claim_text ILIKE '%HR=%' OR
         claim_text ILIKE '%biomarker%' OR
         claim_text ILIKE '%subgroup analysis%' OR
         claim_text ILIKE '%methodology%' THEN 'expert'
    
    -- Simplified level: Practical application, dosing, administration
    WHEN claim_text ILIKE '%dosing%' OR 
         claim_text ILIKE '%administration%' OR
         claim_text ILIKE '%once daily%' OR
         claim_text ILIKE '%how to take%' OR
         claim_text ILIKE '%patient selection%' THEN 'simplified'
    
    -- Patient-friendly: Basic benefit statements (very rare in clinical_claims)
    WHEN claim_text ILIKE '%quality of life%' OR 
         claim_text ILIKE '%improve symptoms%' THEN 'patient-friendly'
    
    -- Standard level: Everything else (trial outcomes, efficacy, safety)
    ELSE 'standard'
  END
WHERE complexity_level IS NULL;

-- Backfill existing content_segments with reading level
UPDATE content_segments SET reading_level = 
  CASE
    -- Expert level: MOA, trial methodology, detailed analysis
    WHEN segment_type IN ('moa', 'trial_methodology', 'pharmacokinetics', 'pharmacodynamics') THEN 'expert'
    
    -- Accessible level: Practical guidance, instructions
    WHEN segment_type IN ('dosing_instructions', 'patient_counseling', 'administration_guide', 'monitoring') THEN 'accessible'
    
    -- Patient level: Patient-facing content
    WHEN segment_type IN ('patient_benefits', 'lifestyle_guidance', 'support_resources', 'patient_education') THEN 'patient'
    
    -- Professional level: Standard clinical content
    ELSE 'professional'
  END
WHERE reading_level IS NULL;

-- Backfill audience appropriateness based on segment type
UPDATE content_segments SET audience_appropriateness = 
  CASE
    WHEN segment_type IN ('moa', 'trial_methodology', 'biomarker_data') 
      THEN ARRAY['Physician-Specialist']
    
    WHEN segment_type IN ('efficacy_summary', 'safety_profile') 
      THEN ARRAY['Physician-Specialist', 'Physician-PrimaryCare', 'Nurse-NP-PA']
    
    WHEN segment_type IN ('dosing_instructions', 'administration_guide', 'patient_counseling') 
      THEN ARRAY['Physician-PrimaryCare', 'Nurse-NP-PA', 'Nurse-RN', 'Pharmacist']
    
    WHEN segment_type IN ('patient_benefits', 'lifestyle_guidance', 'support_resources') 
      THEN ARRAY['Patient', 'Caregiver-Family', 'Caregiver-Professional']
    
    ELSE ARRAY['Physician-Specialist', 'Physician-PrimaryCare']
  END
WHERE audience_appropriateness = '{}';