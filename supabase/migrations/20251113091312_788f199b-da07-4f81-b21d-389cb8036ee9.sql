-- Add parsing_progress column to track document parsing progress
ALTER TABLE brand_documents 
ADD COLUMN IF NOT EXISTS parsing_progress INTEGER DEFAULT 0;

-- Add comment
COMMENT ON COLUMN brand_documents.parsing_progress IS 'Progress percentage of document parsing (0-100)';