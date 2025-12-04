-- Create intelligence_usage_logs table to track which intelligence is used in content generation
CREATE TABLE IF NOT EXISTS public.intelligence_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.content_assets(id) ON DELETE CASCADE,
  project_id UUID,
  intelligence_type TEXT NOT NULL CHECK (intelligence_type IN ('brand', 'evidence', 'performance', 'competitive', 'audience')),
  intelligence_source TEXT NOT NULL,
  intelligence_id UUID,
  usage_context TEXT NOT NULL,
  ai_model TEXT,
  confidence_score NUMERIC(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_intelligence_usage_logs_brand_id ON public.intelligence_usage_logs(brand_id);
CREATE INDEX IF NOT EXISTS idx_intelligence_usage_logs_asset_id ON public.intelligence_usage_logs(asset_id);
CREATE INDEX IF NOT EXISTS idx_intelligence_usage_logs_project_id ON public.intelligence_usage_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_intelligence_usage_logs_created_at ON public.intelligence_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_intelligence_usage_logs_intelligence_type ON public.intelligence_usage_logs(intelligence_type);

-- Enable RLS
ALTER TABLE public.intelligence_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view intelligence logs for accessible brands"
  ON public.intelligence_usage_logs
  FOR SELECT
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can create intelligence logs for accessible brands"
  ON public.intelligence_usage_logs
  FOR INSERT
  WITH CHECK (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Demo users can manage all intelligence logs"
  ON public.intelligence_usage_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_demo_user = true
    )
  );

-- Add comment
COMMENT ON TABLE public.intelligence_usage_logs IS 'Tracks which intelligence sources are used during AI content generation to verify data flow and measure intelligence utilization';
