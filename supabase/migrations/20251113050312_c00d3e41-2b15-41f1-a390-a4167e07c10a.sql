-- Fix search_path security warnings for all functions
ALTER FUNCTION increment_module_usage(UUID) SET search_path = public;
ALTER FUNCTION update_updated_at_column() SET search_path = public;
ALTER FUNCTION update_content_repurposing_updated_at() SET search_path = public;