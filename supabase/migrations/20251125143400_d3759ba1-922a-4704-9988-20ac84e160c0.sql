-- Drop the existing check constraint
ALTER TABLE content_opportunities 
DROP CONSTRAINT IF EXISTS content_opportunities_opportunity_type_check;

-- Add new check constraint with additional valid types
ALTER TABLE content_opportunities 
ADD CONSTRAINT content_opportunities_opportunity_type_check 
CHECK (opportunity_type = ANY (ARRAY[
  'sentiment_shift'::text, 
  'market_movement'::text, 
  'competitive_trigger'::text, 
  'emerging_topic'::text, 
  'regulatory_update'::text, 
  'performance_gap'::text,
  'sentiment_concern'::text,
  'amplification_opportunity'::text,
  'quick_win'::text
]));