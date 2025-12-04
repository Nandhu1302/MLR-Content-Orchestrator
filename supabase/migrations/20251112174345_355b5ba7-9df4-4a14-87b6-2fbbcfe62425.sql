-- Create RLS policies for prescribing-information storage bucket

-- Policy 1: Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload PI documents to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'prescribing-information' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Allow authenticated users to read files they uploaded
CREATE POLICY "Users can read own PI documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'prescribing-information' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Allow authenticated users to update their own files
CREATE POLICY "Users can update own PI documents"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'prescribing-information' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own PI documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'prescribing-information' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);