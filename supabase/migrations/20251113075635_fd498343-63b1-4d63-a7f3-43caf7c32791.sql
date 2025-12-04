-- Update the detect_stuck_parsing_jobs function to handle brand_documents table
CREATE OR REPLACE FUNCTION public.detect_stuck_parsing_jobs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Mark stuck prescribing_information documents as failed
  UPDATE prescribing_information
  SET parsing_status = 'failed',
      error_message = 'Parsing timeout - document took longer than 10 minutes. Please retry.',
      updated_at = now()
  WHERE parsing_status = 'processing'
    AND updated_at < now() - interval '10 minutes';
  
  -- Mark stuck brand_documents as failed
  UPDATE brand_documents
  SET parsing_status = 'failed',
      error_message = 'Parsing timeout - document took longer than 10 minutes. Click retry to parse again.',
      updated_at = now()
  WHERE parsing_status IN ('processing', 'pending')
    AND updated_at < now() - interval '10 minutes';
END;
$function$;