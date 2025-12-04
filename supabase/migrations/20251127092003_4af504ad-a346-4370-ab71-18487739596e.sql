-- Add new asset types to content_assets table
-- This migration adds support for hcp-email, paid-social-ad, web-content, and blog asset types

DO $$ 
BEGIN
  -- Check if the asset_type column exists and has a type constraint
  -- Add new asset types to the check constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'content_assets' AND column_name = 'asset_type'
  ) THEN
    -- Drop existing constraint if it exists
    ALTER TABLE content_assets DROP CONSTRAINT IF EXISTS content_assets_asset_type_check;
  END IF;

  -- Add check constraint with all asset types including new ones
  ALTER TABLE content_assets ADD CONSTRAINT content_assets_asset_type_check 
  CHECK (asset_type IN (
    'email', 'web', 'social', 'print', 'dsa', 'video', 'infographic',
    'mass-email', 'hcp-email', 'rep-triggered-email', 'patient-email', 'caregiver-email',
    'social-media-post', 'paid-social-ad',
    'website-landing-page', 'web-content', 'blog',
    'digital-sales-aid'
  ));
END $$;