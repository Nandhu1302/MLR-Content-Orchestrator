-- Add pharma-standard fields to clinical_claims
ALTER TABLE clinical_claims
ADD COLUMN IF NOT EXISTS claim_id_display TEXT,
ADD COLUMN IF NOT EXISTS indication_product TEXT,
ADD COLUMN IF NOT EXISTS effective_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS expiration_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approval_scope TEXT[];

-- Add pharma-standard fields to clinical_references
ALTER TABLE clinical_references
ADD COLUMN IF NOT EXISTS reference_id_display TEXT,
ADD COLUMN IF NOT EXISTS data_on_file_id TEXT,
ADD COLUMN IF NOT EXISTS relevant_location TEXT;

-- Add citation tracking to content_assets
ALTER TABLE content_assets
ADD COLUMN IF NOT EXISTS claims_used JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS references_used JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS citation_validation JSONB DEFAULT '{}'::jsonb;

-- Create index for faster claim lookups by display ID
CREATE INDEX IF NOT EXISTS idx_claims_display_id ON clinical_claims(claim_id_display);
CREATE INDEX IF NOT EXISTS idx_references_display_id ON clinical_references(reference_id_display);

-- Create function to auto-generate claim display IDs
CREATE OR REPLACE FUNCTION generate_claim_display_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.claim_id_display IS NULL THEN
    NEW.claim_id_display := 'CML-' || LPAD(
      (SELECT COUNT(*) + 1 FROM clinical_claims WHERE brand_id = NEW.brand_id)::TEXT,
      4,
      '0'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-generate reference display IDs
CREATE OR REPLACE FUNCTION generate_reference_display_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_id_display IS NULL THEN
    NEW.reference_id_display := 'REF-' || LPAD(
      (SELECT COUNT(*) + 1 FROM clinical_references WHERE brand_id = NEW.brand_id)::TEXT,
      4,
      '0'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-generating IDs
DROP TRIGGER IF EXISTS set_claim_display_id ON clinical_claims;
CREATE TRIGGER set_claim_display_id
  BEFORE INSERT ON clinical_claims
  FOR EACH ROW
  EXECUTE FUNCTION generate_claim_display_id();

DROP TRIGGER IF EXISTS set_reference_display_id ON clinical_references;
CREATE TRIGGER set_reference_display_id
  BEFORE INSERT ON clinical_references
  FOR EACH ROW
  EXECUTE FUNCTION generate_reference_display_id();

-- Add comment explaining citation_validation structure
COMMENT ON COLUMN content_assets.citation_validation IS 'JSON structure: { "expired_claims": [], "scope_mismatches": [], "missing_references": [], "validation_date": "ISO-8601" }';