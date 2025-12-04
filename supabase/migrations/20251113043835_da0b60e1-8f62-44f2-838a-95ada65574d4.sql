-- Step 1: Reset stuck documents that have been processing for too long
-- Update documents stuck in 'processing' state for more than 10 minutes to 'failed'
-- This allows users to retry parsing

UPDATE prescribing_information
SET 
  parsing_status = 'failed',
  error_message = COALESCE(
    error_message,
    'Processing timeout - document was stuck in processing state. Please retry.'
  ),
  updated_at = now()
WHERE 
  parsing_status = 'processing' 
  AND updated_at < (now() - interval '10 minutes');

-- Create function to automatically detect and fix stuck documents
CREATE OR REPLACE FUNCTION detect_stuck_parsing_jobs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reset documents stuck in processing for more than 10 minutes
  UPDATE prescribing_information
  SET 
    parsing_status = 'failed',
    error_message = 'Processing timeout - document was stuck in processing state. Please retry.',
    updated_at = now()
  WHERE 
    parsing_status = 'processing' 
    AND updated_at < (now() - interval '10 minutes');
END;
$$;