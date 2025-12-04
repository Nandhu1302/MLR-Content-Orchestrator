-- Add source_section and source_page columns to clinical_references table
ALTER TABLE clinical_references
ADD COLUMN IF NOT EXISTS source_section TEXT,
ADD COLUMN IF NOT EXISTS source_page INTEGER;

COMMENT ON COLUMN clinical_references.source_section IS 'Which section of the source document the reference came from';
COMMENT ON COLUMN clinical_references.source_page IS 'Page number in the source document where the reference appears';