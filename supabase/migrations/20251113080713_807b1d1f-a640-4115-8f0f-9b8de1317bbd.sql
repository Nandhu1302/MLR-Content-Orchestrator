-- Drop the old restrictive check constraint that only allows 'pi' and 'isi'
ALTER TABLE brand_documents 
DROP CONSTRAINT IF EXISTS prescribing_information_document_type_check;

-- Add a new flexible constraint that allows any document type
ALTER TABLE brand_documents 
ADD CONSTRAINT brand_documents_document_type_check 
CHECK (document_type IN ('pi', 'isi', 'clinical', 'marketing', 'regulatory', 'competitive-intelligence', 'brand-guidelines', 'safety-information', 'other'));