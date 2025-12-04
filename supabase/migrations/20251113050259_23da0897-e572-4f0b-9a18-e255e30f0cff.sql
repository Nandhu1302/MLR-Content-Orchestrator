-- Create function to increment module usage tracking
CREATE OR REPLACE FUNCTION increment_module_usage(module_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE content_modules
  SET 
    usage_score = LEAST(1.0, usage_score + 0.01),
    updated_at = now()
  WHERE id = module_id;
END;
$$;