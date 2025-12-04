-- Create the brand-documents storage bucket for all document types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-documents',
  'brand-documents',
  false, -- Private bucket for brand documents
  20971520, -- 20MB in bytes
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Simple RLS Policies for brand-documents bucket
-- Allow all authenticated users to manage documents (simplified for now)

-- Allow authenticated users to upload documents
CREATE POLICY "Authenticated users can upload brand documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'brand-documents');

-- Allow authenticated users to view documents
CREATE POLICY "Authenticated users can view brand documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'brand-documents');

-- Allow authenticated users to update documents
CREATE POLICY "Authenticated users can update brand documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'brand-documents');

-- Allow authenticated users to delete documents
CREATE POLICY "Authenticated users can delete brand documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'brand-documents');