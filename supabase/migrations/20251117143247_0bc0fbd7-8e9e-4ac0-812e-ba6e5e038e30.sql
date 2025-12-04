-- Add unique constraint to prevent duplicate references
ALTER TABLE clinical_references 
ADD CONSTRAINT clinical_references_unique_text 
UNIQUE (brand_id, source_document_id, reference_text);