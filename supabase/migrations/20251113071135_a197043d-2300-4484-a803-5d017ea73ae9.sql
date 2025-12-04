-- Make drug_name nullable since not all brand documents are drug-specific
ALTER TABLE brand_documents 
ALTER COLUMN drug_name DROP NOT NULL;

-- Make document_url nullable since we can generate it from file_path
ALTER TABLE brand_documents 
ALTER COLUMN document_url DROP NOT NULL;

-- Add a function to generate document URLs from file_path
CREATE OR REPLACE FUNCTION generate_document_url(bucket_name text, file_path text)
RETURNS text AS $$
BEGIN
  RETURN format('https://aggvubbylgrdbqtkyuxi.supabase.co/storage/v1/object/public/%s/%s', bucket_name, file_path);
END;
$$ LANGUAGE plpgsql IMMUTABLE;