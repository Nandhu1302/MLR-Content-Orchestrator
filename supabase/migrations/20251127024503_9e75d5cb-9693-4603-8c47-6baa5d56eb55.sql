-- ========================================
-- PHASE 1: TAG CLINICAL CLAIMS WITH TARGET AUDIENCES
-- Based on claim_type mapping to appropriate audiences
-- ========================================

-- Efficacy claims with detailed stats → HCP, Pharmacist
UPDATE clinical_claims 
SET target_audiences = ARRAY['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist', 'Nurse-NP-PA']
WHERE claim_type = 'efficacy' AND (target_audiences IS NULL OR target_audiences = '{}');

-- Safety claims → Universal (HCP, Patient, Caregiver)
UPDATE clinical_claims 
SET target_audiences = ARRAY['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist', 'Nurse-RN', 'Nurse-NP-PA', 'Patient', 'Caregiver-Family', 'Caregiver-Professional']
WHERE claim_type = 'safety' AND (target_audiences IS NULL OR target_audiences = '{}');

-- Dosing claims → HCP, Pharmacist
UPDATE clinical_claims 
SET target_audiences = ARRAY['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist', 'Nurse-RN', 'Nurse-NP-PA']
WHERE claim_type = 'dosing' AND (target_audiences IS NULL OR target_audiences = '{}');

-- Mechanism claims → HCP only (technical)
UPDATE clinical_claims 
SET target_audiences = ARRAY['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist']
WHERE claim_type = 'mechanism' AND (target_audiences IS NULL OR target_audiences = '{}');

-- Indication claims → HCP, Patient
UPDATE clinical_claims 
SET target_audiences = ARRAY['Physician-Specialist', 'Physician-PrimaryCare', 'Nurse-NP-PA', 'Patient']
WHERE claim_type = 'indication' AND (target_audiences IS NULL OR target_audiences = '{}');

-- Comparative claims → HCP only
UPDATE clinical_claims 
SET target_audiences = ARRAY['Physician-Specialist', 'Physician-PrimaryCare']
WHERE claim_type = 'comparative' AND (target_audiences IS NULL OR target_audiences = '{}');

-- ========================================
-- PHASE 2: ADD APPLICABLE_AUDIENCES TO CONTENT_MODULES
-- ========================================

ALTER TABLE content_modules 
ADD COLUMN IF NOT EXISTS applicable_audiences TEXT[] DEFAULT '{}';

-- Tag modules based on module_type
-- efficacy_summary, efficacy_statistical → HCP
UPDATE content_modules 
SET applicable_audiences = ARRAY['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist', 'Nurse-NP-PA']
WHERE module_type IN ('efficacy_summary', 'efficacy_statistical', 'hcp_technical', 'mechanism_detailed')
AND (applicable_audiences IS NULL OR applicable_audiences = '{}');

-- headline modules → Universal
UPDATE content_modules 
SET applicable_audiences = ARRAY['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist', 'Nurse-RN', 'Nurse-NP-PA', 'Patient', 'Caregiver-Family']
WHERE module_type IN ('headline_long', 'headline_short')
AND (applicable_audiences IS NULL OR applicable_audiences = '{}');

-- safety_summary → Universal
UPDATE content_modules 
SET applicable_audiences = ARRAY['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist', 'Nurse-RN', 'Nurse-NP-PA', 'Patient', 'Caregiver-Family', 'Caregiver-Professional']
WHERE module_type = 'safety_summary'
AND (applicable_audiences IS NULL OR applicable_audiences = '{}');

-- mechanism_brief → HCP
UPDATE content_modules 
SET applicable_audiences = ARRAY['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist']
WHERE module_type = 'mechanism_brief'
AND (applicable_audiences IS NULL OR applicable_audiences = '{}');

-- indication_brief → HCP, Patient
UPDATE content_modules 
SET applicable_audiences = ARRAY['Physician-Specialist', 'Physician-PrimaryCare', 'Nurse-NP-PA', 'Patient']
WHERE module_type = 'indication_brief'
AND (applicable_audiences IS NULL OR applicable_audiences = '{}');

-- ========================================
-- PHASE 3: ADD UNIQUE CONSTRAINT FOR SUCCESS PATTERNS UPSERT
-- ========================================

-- Add unique constraint for pattern upsert if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'content_success_patterns_brand_pattern_unique'
    ) THEN
        ALTER TABLE content_success_patterns 
        ADD CONSTRAINT content_success_patterns_brand_pattern_unique 
        UNIQUE (brand_id, pattern_name);
    END IF;
END $$;