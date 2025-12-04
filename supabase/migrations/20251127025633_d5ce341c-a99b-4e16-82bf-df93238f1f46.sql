-- ============================================
-- PHASE 1: Deduplicate claim_variants table
-- ============================================

-- Delete exact duplicate variants, keeping only the oldest one
DELETE FROM public.claim_variants a
USING public.claim_variants b
WHERE a.id > b.id 
  AND a.parent_claim_id = b.parent_claim_id 
  AND a.variant_type = b.variant_type 
  AND a.variant_text = b.variant_text;

-- Add unique constraint to prevent future duplicates
ALTER TABLE public.claim_variants
DROP CONSTRAINT IF EXISTS claim_variants_unique_variant;

ALTER TABLE public.claim_variants
ADD CONSTRAINT claim_variants_unique_variant 
UNIQUE (parent_claim_id, variant_type, variant_text);

-- ============================================
-- PHASE 2: Deduplicate clinical_claims table
-- ============================================

-- Create temp table to identify duplicates (same first 100 chars = duplicate)
-- Keep the one with longest claim_text
WITH ranked_claims AS (
  SELECT 
    id,
    LEFT(claim_text, 100) as claim_prefix,
    LENGTH(claim_text) as text_length,
    ROW_NUMBER() OVER (
      PARTITION BY brand_id, LEFT(claim_text, 100) 
      ORDER BY LENGTH(claim_text) DESC, created_at ASC
    ) as rn
  FROM public.clinical_claims
),
claims_to_delete AS (
  SELECT id FROM ranked_claims WHERE rn > 1
)
DELETE FROM public.clinical_claims 
WHERE id IN (SELECT id FROM claims_to_delete);

-- Add unique constraint on brand_id + first 100 chars of claim_text
-- Using a functional index approach
CREATE UNIQUE INDEX IF NOT EXISTS clinical_claims_unique_claim_text_idx 
ON public.clinical_claims (brand_id, LEFT(claim_text, 100));

-- ============================================
-- PHASE 3: Deduplicate clinical_references
-- ============================================

-- Delete duplicate references (same reference_text for same brand)
DELETE FROM public.clinical_references a
USING public.clinical_references b
WHERE a.id > b.id 
  AND a.brand_id = b.brand_id 
  AND a.reference_text = b.reference_text;

-- Add unique constraint for references
ALTER TABLE public.clinical_references
DROP CONSTRAINT IF EXISTS clinical_references_unique_text;

ALTER TABLE public.clinical_references
ADD CONSTRAINT clinical_references_unique_text 
UNIQUE (brand_id, reference_text);

-- ============================================
-- PHASE 4: Deduplicate content_segments
-- ============================================

DELETE FROM public.content_segments a
USING public.content_segments b
WHERE a.id > b.id 
  AND a.brand_id = b.brand_id 
  AND a.segment_text = b.segment_text;

-- Add unique constraint for segments
ALTER TABLE public.content_segments
DROP CONSTRAINT IF EXISTS content_segments_unique_text;

ALTER TABLE public.content_segments
ADD CONSTRAINT content_segments_unique_text 
UNIQUE (brand_id, segment_text);

-- ============================================
-- PHASE 5: Deduplicate content_modules
-- ============================================

DELETE FROM public.content_modules a
USING public.content_modules b
WHERE a.id > b.id 
  AND a.brand_id = b.brand_id 
  AND a.module_text = b.module_text;

-- Add unique constraint for modules
ALTER TABLE public.content_modules
DROP CONSTRAINT IF EXISTS content_modules_unique_text;

ALTER TABLE public.content_modules
ADD CONSTRAINT content_modules_unique_text 
UNIQUE (brand_id, module_text);

-- ============================================
-- PHASE 6: Deduplicate safety_statements
-- ============================================

DELETE FROM public.safety_statements a
USING public.safety_statements b
WHERE a.id > b.id 
  AND a.brand_id = b.brand_id 
  AND a.statement_text = b.statement_text;

-- Add unique constraint for safety statements
ALTER TABLE public.safety_statements
DROP CONSTRAINT IF EXISTS safety_statements_unique_text;

ALTER TABLE public.safety_statements
ADD CONSTRAINT safety_statements_unique_text 
UNIQUE (brand_id, statement_text);