-- Create the prescribing-information storage bucket (private for security)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'prescribing-information',
  'prescribing-information',
  false, -- Private bucket for pharmaceutical documents
  20971520, -- 20MB in bytes
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;