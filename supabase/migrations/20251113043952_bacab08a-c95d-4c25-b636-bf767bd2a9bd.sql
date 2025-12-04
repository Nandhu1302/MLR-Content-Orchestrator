-- Fix search_path security warning for detect_stuck_parsing_jobs function
-- The function already had SET search_path = public, but we need to ensure it's correct

-- Recreate the function with explicit search_path setting
CREATE OR REPLACE FUNCTION public.detect_stuck_parsing_jobs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reset documents stuck in processing for more than 10 minutes
  UPDATE public.prescribing_information
  SET 
    parsing_status = 'failed',
    error_message = 'Processing timeout - document was stuck in processing state. Please retry.',
    updated_at = now()
  WHERE 
    parsing_status = 'processing' 
    AND updated_at < (now() - interval '10 minutes');
END;
$$;