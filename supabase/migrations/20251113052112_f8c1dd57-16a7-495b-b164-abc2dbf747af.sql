-- Phase 1: Reset stuck documents and add timeout detection
UPDATE prescribing_information 
SET parsing_status = 'failed', 
    error_message = 'PDF too large for previous parsing method. Retry with new optimized parser.',
    updated_at = now()
WHERE parsing_status = 'processing' 
  AND updated_at < now() - interval '10 minutes';

-- Create function to auto-detect and reset stuck parsing jobs
CREATE OR REPLACE FUNCTION detect_stuck_parsing_jobs()
RETURNS void AS $$
BEGIN
  UPDATE prescribing_information
  SET parsing_status = 'failed',
      error_message = 'Parsing timeout - document took longer than 10 minutes. Please retry.',
      updated_at = now()
  WHERE parsing_status = 'processing'
    AND updated_at < now() - interval '10 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;