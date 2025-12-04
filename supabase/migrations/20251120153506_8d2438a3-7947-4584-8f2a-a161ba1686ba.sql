-- Create content_opportunities table to store AI-detected opportunities
CREATE TABLE IF NOT EXISTS public.content_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('sentiment_shift', 'market_movement', 'competitive_trigger', 'emerging_topic', 'regulatory_update', 'performance_gap')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  urgency_score INTEGER NOT NULL DEFAULT 50 CHECK (urgency_score >= 0 AND urgency_score <= 100),
  impact_score INTEGER NOT NULL DEFAULT 50 CHECK (impact_score >= 0 AND impact_score <= 100),
  confidence_score NUMERIC NOT NULL DEFAULT 0.7 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  trend_data JSONB NOT NULL DEFAULT '{}',
  intelligence_sources JSONB NOT NULL DEFAULT '[]',
  recommended_actions JSONB NOT NULL DEFAULT '[]',
  matched_success_patterns JSONB DEFAULT '[]',
  target_audiences TEXT[] DEFAULT '{}',
  suggested_channels TEXT[] DEFAULT '{}',
  estimated_reach INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'in_progress', 'completed', 'dismissed')),
  expires_at TIMESTAMPTZ,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create opportunity_tracking table to track user interactions
CREATE TABLE IF NOT EXISTS public.opportunity_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.content_opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('viewed', 'dismissed', 'started', 'completed', 'content_generated')),
  action_metadata JSONB DEFAULT '{}',
  content_asset_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_opportunities_brand_id ON public.content_opportunities(brand_id);
CREATE INDEX IF NOT EXISTS idx_content_opportunities_status ON public.content_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_content_opportunities_priority ON public.content_opportunities(priority);
CREATE INDEX IF NOT EXISTS idx_content_opportunities_type ON public.content_opportunities(opportunity_type);
CREATE INDEX IF NOT EXISTS idx_content_opportunities_detected_at ON public.content_opportunities(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunity_tracking_opportunity_id ON public.opportunity_tracking(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_tracking_user_id ON public.opportunity_tracking(user_id);

-- Enable RLS
ALTER TABLE public.content_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_opportunities
CREATE POLICY "Users can view opportunities for accessible brands"
  ON public.content_opportunities FOR SELECT
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can update opportunities for accessible brands"
  ON public.content_opportunities FOR UPDATE
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "System can insert opportunities"
  ON public.content_opportunities FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Demo users can manage all opportunities"
  ON public.content_opportunities FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid() AND profiles.is_demo_user = true
  ));

-- RLS Policies for opportunity_tracking
CREATE POLICY "Users can view their own tracking"
  ON public.opportunity_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracking"
  ON public.opportunity_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Demo users can manage all tracking"
  ON public.opportunity_tracking FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid() AND profiles.is_demo_user = true
  ));

-- Trigger to update updated_at
CREATE TRIGGER update_content_opportunities_updated_at
  BEFORE UPDATE ON public.content_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();