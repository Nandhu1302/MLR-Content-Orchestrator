-- Phase 1: Transform prescribing_information into brand_documents

-- Step 1: Rename main table
ALTER TABLE prescribing_information RENAME TO brand_documents;

-- Step 2: Add new flexible columns for generic documents
ALTER TABLE brand_documents 
  ADD COLUMN document_category text DEFAULT 'clinical',
  ADD COLUMN document_tags text[] DEFAULT '{}',
  ADD COLUMN document_title text,
  ADD COLUMN file_size_bytes bigint,
  ADD COLUMN page_count integer,
  ADD COLUMN extraction_metadata jsonb DEFAULT '{}';

-- Step 3: Update foreign key columns to be more generic
ALTER TABLE clinical_claims 
  RENAME COLUMN pi_document_id TO source_document_id;

ALTER TABLE clinical_references 
  RENAME COLUMN pi_document_id TO source_document_id;

ALTER TABLE content_segments 
  RENAME COLUMN pi_document_id TO source_document_id;

ALTER TABLE safety_statements 
  RENAME COLUMN isi_document_id TO source_document_id;

-- Step 4: Drop old indexes
DROP INDEX IF EXISTS idx_prescribing_info_brand;
DROP INDEX IF EXISTS idx_prescribing_info_status;
DROP INDEX IF EXISTS idx_prescribing_info_brand_type;

-- Step 5: Create new optimized indexes
CREATE INDEX idx_brand_docs_brand ON brand_documents(brand_id);
CREATE INDEX idx_brand_docs_status ON brand_documents(parsing_status);
CREATE INDEX idx_brand_docs_category ON brand_documents(brand_id, document_category, parsing_status);
CREATE INDEX idx_brand_docs_tags ON brand_documents USING gin(document_tags);

-- Step 6: Create document categories taxonomy table
CREATE TABLE document_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  color text,
  extraction_template text,
  created_at timestamptz DEFAULT now()
);

-- Step 7: Insert predefined document categories
INSERT INTO document_categories (name, description, icon, color, extraction_template) VALUES
  ('clinical', 'Clinical trial data, PI, study reports', 'FileText', 'hsl(var(--primary))', 'clinical_evidence'),
  ('marketing', 'Marketing materials, campaigns, messaging', 'Megaphone', 'hsl(var(--chart-5))', 'marketing_claims'),
  ('regulatory', 'FDA submissions, compliance documents', 'Shield', 'hsl(var(--chart-2))', 'regulatory_statements'),
  ('competitive-intelligence', 'Competitor analysis, market research', 'TrendingUp', 'hsl(var(--chart-3))', 'competitive_insights'),
  ('brand-guidelines', 'Brand voice, visual identity, positioning', 'Palette', 'hsl(var(--chart-4))', 'brand_attributes'),
  ('safety-information', 'ISI, safety data, adverse events', 'AlertTriangle', 'hsl(var(--destructive))', 'safety_statements'),
  ('other', 'Miscellaneous brand documents', 'File', 'hsl(var(--muted-foreground))', 'general_content');

-- Step 8: Migrate existing document_type values to document_category
UPDATE brand_documents 
SET document_category = CASE 
  WHEN document_type = 'pi' THEN 'clinical'
  WHEN document_type = 'isi' THEN 'safety-information'
  ELSE 'other'
END;

-- Step 9: Update document_title from drug_name for existing records
UPDATE brand_documents 
SET document_title = CASE 
  WHEN document_type = 'pi' THEN drug_name || ' - Prescribing Information'
  WHEN document_type = 'isi' THEN drug_name || ' - Important Safety Information'
  ELSE drug_name
END
WHERE document_title IS NULL;

-- Step 10: Enable RLS on document_categories
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;

-- Step 11: Create RLS policies for document_categories (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view document categories"
ON document_categories FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Demo users can manage document categories"
ON document_categories FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_demo_user = true
  )
);

-- Step 12: Update RLS policies for brand_documents (rename from prescribing_information references)
-- The existing policies should still work since we just renamed the table