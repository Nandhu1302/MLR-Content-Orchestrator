-- Add brand_id to performance_predictions
ALTER TABLE performance_predictions
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brand_profiles(id);

-- Add brand_id to content_performance_metrics
ALTER TABLE content_performance_metrics
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brand_profiles(id);

-- Add additional columns to content_performance_metrics for the new schema
ALTER TABLE content_performance_metrics
ADD COLUMN IF NOT EXISTS content_registry_id UUID REFERENCES content_registry(id),
ADD COLUMN IF NOT EXISTS measurement_period_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS measurement_period_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS total_impressions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_engagements INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_conversions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_engagement_rate NUMERIC,
ADD COLUMN IF NOT EXISTS avg_conversion_rate NUMERIC,
ADD COLUMN IF NOT EXISTS audience_breakdown JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS channel_breakdown JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS trend_direction TEXT,
ADD COLUMN IF NOT EXISTS calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add brand_id to content_relationships
ALTER TABLE content_relationships
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brand_profiles(id);

-- Add content_id columns to content_relationships (for new usage pattern)
ALTER TABLE content_relationships
ADD COLUMN IF NOT EXISTS content_id_1 UUID,
ADD COLUMN IF NOT EXISTS content_id_2 UUID,
ADD COLUMN IF NOT EXISTS shared_elements TEXT[],
ADD COLUMN IF NOT EXISTS performance_correlation NUMERIC,
ADD COLUMN IF NOT EXISTS discovered_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add missing columns to performance_predictions for new schema
ALTER TABLE performance_predictions
ADD COLUMN IF NOT EXISTS predicted_metric TEXT,
ADD COLUMN IF NOT EXISTS predicted_value NUMERIC,
ADD COLUMN IF NOT EXISTS confidence_score NUMERIC,
ADD COLUMN IF NOT EXISTS context JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS factors_considered JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS predicted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS valid_until TIMESTAMP WITH TIME ZONE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_performance_predictions_brand_id ON performance_predictions(brand_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_metrics_brand_id ON content_performance_metrics(brand_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_metrics_registry_id ON content_performance_metrics(content_registry_id);
CREATE INDEX IF NOT EXISTS idx_content_relationships_brand_id ON content_relationships(brand_id);
CREATE INDEX IF NOT EXISTS idx_content_relationships_content_ids ON content_relationships(content_id_1, content_id_2);

-- Enable RLS
ALTER TABLE performance_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_relationships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Demo users can manage all performance predictions" ON performance_predictions;
DROP POLICY IF EXISTS "Demo users can manage all content performance metrics" ON content_performance_metrics;
DROP POLICY IF EXISTS "Demo users can manage all content relationships" ON content_relationships;

-- Create new policies
CREATE POLICY "Demo users can manage all performance predictions"
ON performance_predictions FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_demo_user = true
));

CREATE POLICY "Demo users can manage all content performance metrics"
ON content_performance_metrics FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_demo_user = true
));

CREATE POLICY "Demo users can manage all content relationships"
ON content_relationships FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_demo_user = true
));