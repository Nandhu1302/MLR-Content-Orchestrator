-- Phase 1: Data Foundation Tables

-- SFMC Campaign Performance Data
CREATE TABLE IF NOT EXISTS public.sfmc_campaign_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  campaign_id TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  conversion_rate DECIMAL(5,2),
  subject_line TEXT,
  message_themes JSONB DEFAULT '[]'::jsonb,
  audience_segment TEXT,
  send_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_sfmc_brand_id ON public.sfmc_campaign_data(brand_id);
CREATE INDEX idx_sfmc_campaign_id ON public.sfmc_campaign_data(campaign_id);
CREATE INDEX idx_sfmc_send_date ON public.sfmc_campaign_data(send_date DESC);

-- Veeva CRM Field Insights
CREATE TABLE IF NOT EXISTS public.veeva_field_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  hcp_feedback_theme TEXT NOT NULL,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  frequency_score INTEGER DEFAULT 1,
  regional_data JSONB DEFAULT '{}'::jsonb,
  objections JSONB DEFAULT '[]'::jsonb,
  competitive_mentions JSONB DEFAULT '[]'::jsonb,
  recorded_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_veeva_brand_id ON public.veeva_field_insights(brand_id);
CREATE INDEX idx_veeva_sentiment ON public.veeva_field_insights(sentiment);
CREATE INDEX idx_veeva_recorded_date ON public.veeva_field_insights(recorded_date DESC);

-- IQVIA Market Data
CREATE TABLE IF NOT EXISTS public.iqvia_market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  value DECIMAL(12,2),
  comparison_period TEXT,
  therapeutic_area TEXT,
  geographic_region TEXT,
  data_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_iqvia_brand_id ON public.iqvia_market_data(brand_id);
CREATE INDEX idx_iqvia_metric_type ON public.iqvia_market_data(metric_type);
CREATE INDEX idx_iqvia_data_date ON public.iqvia_market_data(data_date DESC);

-- Social Listening Insights
CREATE TABLE IF NOT EXISTS public.social_listening_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  topic TEXT,
  mention_volume INTEGER DEFAULT 1,
  key_phrases JSONB DEFAULT '[]'::jsonb,
  influencer_mentions JSONB DEFAULT '[]'::jsonb,
  date_captured TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_social_brand_id ON public.social_listening_data(brand_id);
CREATE INDEX idx_social_platform ON public.social_listening_data(platform);
CREATE INDEX idx_social_sentiment ON public.social_listening_data(sentiment);
CREATE INDEX idx_social_date_captured ON public.social_listening_data(date_captured DESC);

-- Competitive Intelligence Aggregator
CREATE TABLE IF NOT EXISTS public.competitive_intelligence_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  competitor_brand TEXT NOT NULL,
  intelligence_type TEXT NOT NULL,
  insight_summary TEXT,
  data_source TEXT,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  date_captured TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_competitive_brand_id ON public.competitive_intelligence_data(brand_id);
CREATE INDEX idx_competitive_competitor ON public.competitive_intelligence_data(competitor_brand);
CREATE INDEX idx_competitive_type ON public.competitive_intelligence_data(intelligence_type);
CREATE INDEX idx_competitive_date_captured ON public.competitive_intelligence_data(date_captured DESC);

-- Phase 4: Performance Tracking Table
CREATE TABLE IF NOT EXISTS public.content_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id TEXT,
  theme_id UUID REFERENCES public.theme_library(id) ON DELETE CASCADE,
  intelligence_layers_used JSONB DEFAULT '[]'::jsonb,
  campaign_metrics JSONB DEFAULT '{}'::jsonb,
  audience_segment TEXT,
  market TEXT,
  performance_score DECIMAL(5,2),
  collected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_performance_asset_id ON public.content_performance_metrics(asset_id);
CREATE INDEX idx_performance_theme_id ON public.content_performance_metrics(theme_id);
CREATE INDEX idx_performance_collected_at ON public.content_performance_metrics(collected_at DESC);

-- Add data provenance to theme_intelligence table
ALTER TABLE public.theme_intelligence 
ADD COLUMN IF NOT EXISTS data_sources JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS last_data_refresh TIMESTAMP WITH TIME ZONE;

-- Enable RLS on new tables
ALTER TABLE public.sfmc_campaign_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veeva_field_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iqvia_market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_listening_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitive_intelligence_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for SFMC data
CREATE POLICY "Users can view SFMC data for their brands" ON public.sfmc_campaign_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_brand_access 
      WHERE user_id = auth.uid() AND brand_id = sfmc_campaign_data.brand_id
    )
  );

CREATE POLICY "Users can insert SFMC data for their brands" ON public.sfmc_campaign_data
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_brand_access 
      WHERE user_id = auth.uid() AND brand_id = sfmc_campaign_data.brand_id
    )
  );

-- RLS Policies for Veeva data
CREATE POLICY "Users can view Veeva data for their brands" ON public.veeva_field_insights
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_brand_access 
      WHERE user_id = auth.uid() AND brand_id = veeva_field_insights.brand_id
    )
  );

CREATE POLICY "Users can insert Veeva data for their brands" ON public.veeva_field_insights
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_brand_access 
      WHERE user_id = auth.uid() AND brand_id = veeva_field_insights.brand_id
    )
  );

-- RLS Policies for IQVIA data
CREATE POLICY "Users can view IQVIA data for their brands" ON public.iqvia_market_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_brand_access 
      WHERE user_id = auth.uid() AND brand_id = iqvia_market_data.brand_id
    )
  );

CREATE POLICY "Users can insert IQVIA data for their brands" ON public.iqvia_market_data
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_brand_access 
      WHERE user_id = auth.uid() AND brand_id = iqvia_market_data.brand_id
    )
  );

-- RLS Policies for Social data
CREATE POLICY "Users can view social data for their brands" ON public.social_listening_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_brand_access 
      WHERE user_id = auth.uid() AND brand_id = social_listening_data.brand_id
    )
  );

CREATE POLICY "Users can insert social data for their brands" ON public.social_listening_data
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_brand_access 
      WHERE user_id = auth.uid() AND brand_id = social_listening_data.brand_id
    )
  );

-- RLS Policies for Competitive data
CREATE POLICY "Users can view competitive data for their brands" ON public.competitive_intelligence_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_brand_access 
      WHERE user_id = auth.uid() AND brand_id = competitive_intelligence_data.brand_id
    )
  );

CREATE POLICY "Users can insert competitive data for their brands" ON public.competitive_intelligence_data
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_brand_access 
      WHERE user_id = auth.uid() AND brand_id = competitive_intelligence_data.brand_id
    )
  );

-- RLS Policies for Performance Metrics
CREATE POLICY "Users can view performance metrics for their themes" ON public.content_performance_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.theme_library tl
      JOIN public.user_brand_access uba ON tl.brand_id = uba.brand_id
      WHERE tl.id = content_performance_metrics.theme_id AND uba.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert performance metrics for their themes" ON public.content_performance_metrics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.theme_library tl
      JOIN public.user_brand_access uba ON tl.brand_id = uba.brand_id
      WHERE tl.id = content_performance_metrics.theme_id AND uba.user_id = auth.uid()
    )
  );