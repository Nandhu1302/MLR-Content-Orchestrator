-- Fix search path security warnings for the new functions
DROP FUNCTION IF EXISTS generate_claim_display_id() CASCADE;
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
$$ LANGUAGE plpgsql
SET search_path = public;

DROP FUNCTION IF EXISTS generate_reference_display_id() CASCADE;
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
$$ LANGUAGE plpgsql
SET search_path = public;

-- Recreate triggers
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