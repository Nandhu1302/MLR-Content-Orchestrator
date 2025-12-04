-- Step 1: Add brand_id to claim_variants table
ALTER TABLE claim_variants 
ADD COLUMN brand_id uuid REFERENCES brand_profiles(id);

-- Update brand_id for existing claim_variants by looking up from parent claim
UPDATE claim_variants cv
SET brand_id = cc.brand_id
FROM clinical_claims cc
WHERE cv.parent_claim_id = cc.id;

-- Step 2: Deduplicate clinical_claims - keep oldest record for each (brand_id, claim_text) combination
-- First, create a mapping table of old IDs to new IDs
CREATE TEMP TABLE claim_id_mapping AS
WITH duplicate_claims AS (
  SELECT 
    id,
    brand_id,
    claim_text,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY brand_id, claim_text ORDER BY created_at ASC) as rn
  FROM clinical_claims
)
SELECT 
  old.id as old_claim_id,
  keeper.id as new_claim_id
FROM duplicate_claims old
JOIN duplicate_claims keeper 
  ON old.brand_id = keeper.brand_id 
  AND old.claim_text = keeper.claim_text
  AND keeper.rn = 1
WHERE old.rn > 1;

-- Update claim_variants to point to kept claims
UPDATE claim_variants cv
SET parent_claim_id = cim.new_claim_id
FROM claim_id_mapping cim
WHERE cv.parent_claim_id = cim.old_claim_id;

-- Update clinical_references to point to kept claims (if claim_id is set)
UPDATE clinical_references cr
SET claim_id = cim.new_claim_id
FROM claim_id_mapping cim
WHERE cr.claim_id = cim.old_claim_id;

-- Delete duplicate claims
DELETE FROM clinical_claims
WHERE id IN (SELECT old_claim_id FROM claim_id_mapping);

-- Drop temp table
DROP TABLE claim_id_mapping;

-- Step 3: Add unique constraint to prevent future duplicates
ALTER TABLE clinical_claims
ADD CONSTRAINT clinical_claims_brand_claim_unique UNIQUE (brand_id, claim_text);

-- Step 4: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_claim_variants_brand_id ON claim_variants(brand_id);
CREATE INDEX IF NOT EXISTS idx_clinical_claims_brand_text ON clinical_claims(brand_id, claim_text);