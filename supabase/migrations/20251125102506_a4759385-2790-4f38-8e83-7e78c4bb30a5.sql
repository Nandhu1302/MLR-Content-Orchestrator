-- Create intelligence_usage_logs table for tracking intelligence usage
CREATE TABLE IF NOT EXISTS public.intelligence_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
  intelligence_type TEXT NOT NULL, -- 'evidence', 'performance', 'competitive', 'audience', 'brand'
  intelligence_source TEXT NOT NULL, -- 'clinical_claims', 'theme_library', 'audience_segments', etc.
  source_id TEXT, -- ID of the specific intelligence item used
  asset_id TEXT, -- Reference to content asset
  project_id TEXT, -- Reference to project
  context JSONB, -- Additional context about usage
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES brand_profiles(id) ON DELETE CASCADE
);

-- Create content_performance_attribution table for tracking performance
CREATE TABLE IF NOT EXISTS public.content_performance_attribution (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_registry_id UUID REFERENCES content_registry(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
  engagement_rate NUMERIC,
  conversion_rate NUMERIC,
  channel TEXT,
  audience_segment TEXT,
  source_system TEXT NOT NULL,
  data_quality_score INT,
  theme_id UUID,
  claims_used TEXT[], -- Array of claim IDs
  segments_used TEXT[], -- Array of segment IDs
  patterns_used TEXT[], -- Array of pattern IDs
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES brand_profiles(id) ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_intelligence_usage_logs_brand_id ON intelligence_usage_logs(brand_id);
CREATE INDEX IF NOT EXISTS idx_intelligence_usage_logs_source ON intelligence_usage_logs(intelligence_type, intelligence_source);
CREATE INDEX IF NOT EXISTS idx_content_performance_brand_id ON content_performance_attribution(brand_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_content_id ON content_performance_attribution(content_registry_id);

-- RLS policies for intelligence_usage_logs
ALTER TABLE intelligence_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Demo users can insert intelligence usage logs"
ON intelligence_usage_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND is_demo_user = true
  )
);

CREATE POLICY "Demo users can view their intelligence usage logs"
ON intelligence_usage_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND is_demo_user = true
  )
);

-- RLS policies for content_performance_attribution  
ALTER TABLE content_performance_attribution ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Demo users can insert performance attribution"
ON content_performance_attribution FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND is_demo_user = true
  )
);

CREATE POLICY "Demo users can view performance attribution"
ON content_performance_attribution FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND is_demo_user = true
  )
);