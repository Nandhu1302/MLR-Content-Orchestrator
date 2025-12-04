-- ============================================================
-- PHASE 1: EXTERNAL DATA INFRASTRUCTURE
-- ============================================================

-- SFMC Campaign Performance (from Data Extensions)
CREATE TABLE IF NOT EXISTS sfmc_campaign_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_campaign_id TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Send Metrics
  send_date TIMESTAMPTZ NOT NULL,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  
  -- Engagement Metrics
  total_opens INTEGER DEFAULT 0,
  unique_opens INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  unsubscribes INTEGER DEFAULT 0,
  
  -- Segmentation
  audience_segment TEXT,
  device_category TEXT,
  geography TEXT,
  
  -- Content Link (will be populated later)
  content_registry_id UUID,
  
  -- Metadata
  data_source TEXT DEFAULT 'sfmc',
  ingestion_timestamp TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  raw_payload JSONB,
  
  UNIQUE(external_campaign_id, send_date)
);

-- SFMC Journey Analytics
CREATE TABLE IF NOT EXISTS sfmc_journey_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_journey_id TEXT NOT NULL,
  journey_name TEXT NOT NULL,
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Journey Metrics
  measurement_date DATE NOT NULL,
  total_entries INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  total_exits INTEGER DEFAULT 0,
  avg_completion_time_hours NUMERIC,
  
  -- Step Analysis
  step_data JSONB,
  conversion_funnel JSONB,
  
  -- Content Link
  content_registry_id UUID,
  
  -- Metadata
  ingestion_timestamp TIMESTAMPTZ DEFAULT NOW(),
  raw_payload JSONB,
  
  UNIQUE(external_journey_id, measurement_date)
);

-- IQVIA Prescription Data
CREATE TABLE IF NOT EXISTS iqvia_rx_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_batch_id TEXT NOT NULL,
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Temporal
  data_month DATE NOT NULL,
  reporting_period TEXT,
  
  -- Prescription Metrics
  total_rx INTEGER DEFAULT 0,
  new_rx INTEGER DEFAULT 0,
  refill_rx INTEGER DEFAULT 0,
  trx_trend NUMERIC,
  nrx_trend NUMERIC,
  
  -- Market Share
  market_share_percent NUMERIC(5,2),
  rank_in_category INTEGER,
  
  -- Geographic Breakdown
  region TEXT,
  state_code TEXT,
  
  -- Competitive Context
  competitor_data JSONB,
  
  -- Metadata
  ingestion_timestamp TIMESTAMPTZ DEFAULT NOW(),
  file_source TEXT,
  raw_payload JSONB,
  
  UNIQUE(brand_id, data_month, region)
);

-- IQVIA HCP Decile Data
CREATE TABLE IF NOT EXISTS iqvia_hcp_decile_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_batch_id TEXT NOT NULL,
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  data_month DATE NOT NULL,
  
  -- HCP Identification (anonymized)
  hcp_id TEXT NOT NULL,
  specialty TEXT NOT NULL,
  decile INTEGER NOT NULL,
  
  -- Prescribing Metrics
  total_rx_count INTEGER DEFAULT 0,
  brand_rx_count INTEGER DEFAULT 0,
  competitor_rx_count INTEGER DEFAULT 0,
  
  -- Trends
  rx_trend TEXT,
  new_to_brand BOOLEAN DEFAULT false,
  
  -- Geographic
  region TEXT,
  practice_setting TEXT,
  
  -- Metadata
  ingestion_timestamp TIMESTAMPTZ DEFAULT NOW(),
  raw_payload JSONB,
  
  UNIQUE(brand_id, hcp_id, data_month)
);

-- Veeva CRM Activity Data
CREATE TABLE IF NOT EXISTS veeva_crm_activity_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_activity_id TEXT NOT NULL UNIQUE,
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Activity Details
  activity_date DATE NOT NULL,
  activity_type TEXT NOT NULL,
  
  -- HCP Details (anonymized)
  hcp_id TEXT NOT NULL,
  hcp_specialty TEXT,
  hcp_tier TEXT,
  
  -- Engagement Metrics
  content_presented JSONB,
  call_duration_minutes INTEGER,
  engagement_score INTEGER,
  next_best_action TEXT,
  
  -- Rep Information
  rep_territory TEXT,
  rep_id TEXT,
  
  -- Content Link
  content_registry_id UUID,
  
  -- Metadata
  ingestion_timestamp TIMESTAMPTZ DEFAULT NOW(),
  raw_payload JSONB
);

-- Veeva Vault Content Performance
CREATE TABLE IF NOT EXISTS veeva_vault_content_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_document_id TEXT NOT NULL,
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Content Details
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  content_category TEXT,
  
  -- Performance Metrics
  measurement_week DATE NOT NULL,
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  average_view_duration_seconds INTEGER,
  
  -- Audience Breakdown
  specialty_breakdown JSONB,
  region_breakdown JSONB,
  
  -- Content Link
  content_registry_id UUID,
  
  -- Metadata
  ingestion_timestamp TIMESTAMPTZ DEFAULT NOW(),
  raw_payload JSONB,
  
  UNIQUE(external_document_id, measurement_week)
);

-- Web Analytics Data
CREATE TABLE IF NOT EXISTS web_analytics_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Session Details
  visit_date DATE NOT NULL,
  visit_timestamp TIMESTAMPTZ NOT NULL,
  visitor_type TEXT,
  
  -- HCP Details
  hcp_id TEXT,
  hcp_specialty TEXT,
  
  -- Engagement Metrics
  page_views INTEGER DEFAULT 1,
  session_duration_seconds INTEGER,
  bounce BOOLEAN DEFAULT false,
  
  -- Content Interaction
  pages_visited JSONB,
  resources_downloaded JSONB,
  videos_watched JSONB,
  
  -- Technical Details
  device_type TEXT,
  browser TEXT,
  referrer_source TEXT,
  geography TEXT,
  
  -- Content Link
  content_registry_id UUID,
  
  -- Metadata
  ingestion_timestamp TIMESTAMPTZ DEFAULT NOW(),
  raw_payload JSONB
);

-- Social Listening Data
CREATE TABLE IF NOT EXISTS social_listening_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_post_id TEXT NOT NULL UNIQUE,
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Post Details
  post_date TIMESTAMPTZ NOT NULL,
  platform TEXT NOT NULL,
  post_text TEXT,
  post_url TEXT,
  
  -- Author Details
  author_id TEXT,
  author_type TEXT,
  author_followers INTEGER,
  author_specialty TEXT,
  
  -- Sentiment Analysis
  sentiment_score NUMERIC(4,2),
  sentiment_category TEXT,
  emotion_tags TEXT[],
  
  -- Engagement Metrics
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  engagement_rate NUMERIC(5,2),
  
  -- Content Analysis
  topics TEXT[],
  mentioned_brands TEXT[],
  key_themes JSONB,
  
  -- Crisis Detection
  is_potential_crisis BOOLEAN DEFAULT false,
  urgency_level TEXT,
  
  -- Content Link
  content_registry_id UUID,
  
  -- Metadata
  ingestion_timestamp TIMESTAMPTZ DEFAULT NOW(),
  raw_payload JSONB
);

-- ============================================================
-- PHASE 2: CONTENT ATTRIBUTION SYSTEM
-- ============================================================

-- Central Content Registry
CREATE TABLE IF NOT EXISTS content_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Content Identification
  content_type TEXT NOT NULL,
  content_name TEXT NOT NULL,
  content_version TEXT DEFAULT '1.0',
  
  -- Source System
  source_system TEXT NOT NULL,
  external_content_id TEXT,
  
  -- Content Metadata
  theme_id UUID REFERENCES theme_library(id),
  asset_id UUID REFERENCES content_assets(id),
  
  -- Content Fingerprint (extracted features)
  content_fingerprint JSONB NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ,
  
  UNIQUE(source_system, external_content_id)
);

-- Content Performance Attribution
CREATE TABLE IF NOT EXISTS content_performance_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_registry_id UUID REFERENCES content_registry(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Time Period
  measurement_date DATE NOT NULL,
  measurement_period TEXT,
  
  -- Performance Metrics
  impressions INTEGER DEFAULT 0,
  engagements INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  
  -- Calculated Rates
  engagement_rate NUMERIC(5,2),
  conversion_rate NUMERIC(5,2),
  performance_score INTEGER,
  
  -- Context
  source_system TEXT NOT NULL,
  audience_segment TEXT,
  channel TEXT,
  device_type TEXT,
  geography TEXT,
  
  -- Benchmarks
  benchmark_engagement_rate NUMERIC(5,2),
  performance_vs_benchmark NUMERIC(5,2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(content_registry_id, measurement_date, source_system, audience_segment)
);

-- Content Element Performance
CREATE TABLE IF NOT EXISTS content_element_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Element Details
  element_type TEXT NOT NULL,
  element_value TEXT NOT NULL,
  element_context JSONB,
  
  -- Aggregated Performance
  usage_count INTEGER DEFAULT 0,
  total_impressions BIGINT DEFAULT 0,
  total_engagements BIGINT DEFAULT 0,
  total_conversions BIGINT DEFAULT 0,
  
  -- Calculated Metrics
  avg_engagement_rate NUMERIC(5,2),
  avg_conversion_rate NUMERIC(5,2),
  avg_performance_score INTEGER,
  
  -- Statistical Confidence
  confidence_level TEXT,
  sample_size INTEGER,
  
  -- Segmentation
  top_performing_audience TEXT,
  top_performing_channel TEXT,
  
  -- Metadata
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  last_calculated TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(brand_id, element_type, element_value)
);

-- Content Success Patterns
CREATE TABLE IF NOT EXISTS content_success_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Pattern Details
  pattern_name TEXT NOT NULL,
  pattern_type TEXT NOT NULL,
  pattern_description TEXT,
  
  -- Pattern Definition
  pattern_rules JSONB NOT NULL,
  
  -- Performance
  sample_size INTEGER NOT NULL,
  avg_performance_lift NUMERIC(5,2),
  confidence_score INTEGER,
  
  -- Context
  applicable_audiences TEXT[],
  applicable_channels TEXT[],
  therapeutic_context TEXT,
  
  -- Validation
  validation_status TEXT DEFAULT 'discovered',
  validation_date TIMESTAMPTZ,
  a_b_test_results JSONB,
  
  -- Lifecycle
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  last_validated TIMESTAMPTZ,
  retired_at TIMESTAMPTZ,
  retirement_reason TEXT,
  
  -- Metadata
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PHASE 3: ANALYTICS TABLES
-- ============================================================

-- Campaign Performance Analytics
CREATE TABLE IF NOT EXISTS campaign_performance_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Campaign Identification
  campaign_id TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  campaign_type TEXT,
  source_system TEXT,
  
  -- Time Period
  reporting_period DATE NOT NULL,
  period_type TEXT,
  
  -- Aggregated Metrics
  total_audience_size INTEGER,
  total_delivered INTEGER,
  total_engaged INTEGER,
  total_converted INTEGER,
  
  -- Calculated Rates
  delivery_rate NUMERIC(5,2),
  open_rate NUMERIC(5,2),
  click_rate NUMERIC(5,2),
  conversion_rate NUMERIC(5,2),
  engagement_score INTEGER,
  
  -- Benchmarks
  industry_benchmark_open_rate NUMERIC(5,2),
  industry_benchmark_click_rate NUMERIC(5,2),
  performance_vs_benchmark NUMERIC(5,2),
  
  -- Segmentation Performance
  top_performing_segment TEXT,
  top_performing_device TEXT,
  top_performing_geography TEXT,
  
  -- Content Link
  content_registry_id UUID REFERENCES content_registry(id),
  
  -- Metadata
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  data_quality_score INTEGER,
  
  UNIQUE(campaign_id, reporting_period)
);

-- Market Intelligence Analytics
CREATE TABLE IF NOT EXISTS market_intelligence_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Time Period
  reporting_month DATE NOT NULL,
  
  -- Prescription Trends
  total_rx INTEGER,
  new_rx INTEGER,
  refill_rx INTEGER,
  rx_growth_rate NUMERIC(5,2),
  
  -- Market Position
  market_share_percent NUMERIC(5,2),
  market_rank INTEGER,
  share_change NUMERIC(5,2),
  
  -- Competitive Landscape
  primary_competitor TEXT,
  competitor_share_percent NUMERIC(5,2),
  share_gap NUMERIC(5,2),
  
  -- HCP Engagement
  total_hcp_prescribers INTEGER,
  new_hcp_prescribers INTEGER,
  top_decile_hcp_count INTEGER,
  hcp_retention_rate NUMERIC(5,2),
  
  -- Geographic Insights
  top_performing_region TEXT,
  region_growth_rate JSONB,
  
  -- Trend Indicators
  trend_direction TEXT,
  seasonality_factor NUMERIC(5,2),
  
  -- Metadata
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  data_sources TEXT[],
  
  UNIQUE(brand_id, reporting_month)
);

-- HCP Engagement Analytics
CREATE TABLE IF NOT EXISTS hcp_engagement_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Time Period
  reporting_week DATE NOT NULL,
  
  -- HCP Identification
  hcp_id TEXT NOT NULL,
  hcp_specialty TEXT,
  hcp_tier TEXT,
  hcp_decile INTEGER,
  
  -- Multi-Channel Engagement
  total_touchpoints INTEGER,
  email_opens INTEGER,
  website_visits INTEGER,
  rep_calls INTEGER,
  content_views INTEGER,
  
  -- Engagement Quality
  avg_session_duration_minutes NUMERIC(5,2),
  content_depth_score INTEGER,
  response_rate NUMERIC(5,2),
  
  -- Prescription Behavior
  prescriptions_written INTEGER,
  prescription_trend TEXT,
  
  -- Content Preferences
  preferred_content_type TEXT,
  preferred_channel TEXT,
  optimal_engagement_time TEXT,
  
  -- Predictive Scores
  churn_risk_score INTEGER,
  growth_opportunity_score INTEGER,
  
  -- Metadata
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(brand_id, hcp_id, reporting_week)
);

-- Social Intelligence Analytics
CREATE TABLE IF NOT EXISTS social_intelligence_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Time Period
  reporting_date DATE NOT NULL,
  
  -- Volume Metrics
  total_mentions INTEGER,
  unique_authors INTEGER,
  reach_count BIGINT,
  
  -- Sentiment Analysis
  overall_sentiment_score NUMERIC(4,2),
  positive_mention_percent NUMERIC(5,2),
  neutral_mention_percent NUMERIC(5,2),
  negative_mention_percent NUMERIC(5,2),
  sentiment_trend TEXT,
  
  -- Share of Voice
  brand_mentions INTEGER,
  category_mentions INTEGER,
  share_of_voice_percent NUMERIC(5,2),
  
  -- Competitive Context
  competitor_mentions JSONB,
  competitive_sentiment JSONB,
  
  -- Trending Topics
  top_topics JSONB,
  emerging_concerns TEXT[],
  positive_themes TEXT[],
  
  -- Influencer Activity
  top_influencers JSONB,
  
  -- Crisis Detection
  crisis_alerts INTEGER,
  negative_spike_detected BOOLEAN,
  
  -- Metadata
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  platforms_analyzed TEXT[],
  
  UNIQUE(brand_id, reporting_date)
);

-- ============================================================
-- PHASE 4: INTEGRATION MANAGEMENT
-- ============================================================

-- Data Source Registry
CREATE TABLE IF NOT EXISTS data_source_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_system TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL,
  
  -- Connection Details
  api_endpoint TEXT,
  authentication_type TEXT,
  is_active BOOLEAN DEFAULT true,
  
  -- Sync Configuration
  sync_frequency TEXT,
  sync_schedule JSONB,
  
  -- Data Quality
  expected_schema JSONB,
  validation_rules JSONB,
  
  -- Monitoring
  last_successful_sync TIMESTAMPTZ,
  last_failed_sync TIMESTAMPTZ,
  consecutive_failures INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Ingestion Log
CREATE TABLE IF NOT EXISTS data_ingestion_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_system TEXT NOT NULL,
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Ingestion Details
  batch_id TEXT NOT NULL,
  ingestion_start TIMESTAMPTZ NOT NULL,
  ingestion_end TIMESTAMPTZ,
  status TEXT NOT NULL,
  
  -- Data Volume
  records_received INTEGER,
  records_processed INTEGER,
  records_failed INTEGER,
  file_size_bytes BIGINT,
  
  -- Quality Metrics
  data_quality_score INTEGER,
  validation_errors JSONB,
  
  -- Processing Details
  processing_duration_seconds INTEGER,
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE sfmc_campaign_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE sfmc_journey_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE iqvia_rx_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE iqvia_hcp_decile_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE veeva_crm_activity_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE veeva_vault_content_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_analytics_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_listening_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_element_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_success_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcp_engagement_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_intelligence_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_source_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_ingestion_log ENABLE ROW LEVEL SECURITY;

-- Create policies for brand-level access
CREATE POLICY "Users can view external data for accessible brands" ON sfmc_campaign_raw FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage external data for accessible brands" ON sfmc_campaign_raw FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view journey data for accessible brands" ON sfmc_journey_raw FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage journey data for accessible brands" ON sfmc_journey_raw FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view rx data for accessible brands" ON iqvia_rx_raw FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage rx data for accessible brands" ON iqvia_rx_raw FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view hcp data for accessible brands" ON iqvia_hcp_decile_raw FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage hcp data for accessible brands" ON iqvia_hcp_decile_raw FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view crm data for accessible brands" ON veeva_crm_activity_raw FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage crm data for accessible brands" ON veeva_crm_activity_raw FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view vault data for accessible brands" ON veeva_vault_content_raw FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage vault data for accessible brands" ON veeva_vault_content_raw FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view web data for accessible brands" ON web_analytics_raw FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage web data for accessible brands" ON web_analytics_raw FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view social data for accessible brands" ON social_listening_raw FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage social data for accessible brands" ON social_listening_raw FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view content registry for accessible brands" ON content_registry FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage content registry for accessible brands" ON content_registry FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view performance attribution for accessible brands" ON content_performance_attribution FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage performance attribution for accessible brands" ON content_performance_attribution FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view element performance for accessible brands" ON content_element_performance FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage element performance for accessible brands" ON content_element_performance FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view success patterns for accessible brands" ON content_success_patterns FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage success patterns for accessible brands" ON content_success_patterns FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view campaign analytics for accessible brands" ON campaign_performance_analytics FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage campaign analytics for accessible brands" ON campaign_performance_analytics FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view market analytics for accessible brands" ON market_intelligence_analytics FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage market analytics for accessible brands" ON market_intelligence_analytics FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view hcp analytics for accessible brands" ON hcp_engagement_analytics FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage hcp analytics for accessible brands" ON hcp_engagement_analytics FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view social analytics for accessible brands" ON social_intelligence_analytics FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "Users can manage social analytics for accessible brands" ON social_intelligence_analytics FOR ALL USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can view data source registry" ON data_source_registry FOR SELECT USING (true);
CREATE POLICY "Admins can manage data source registry" ON data_source_registry FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_demo_user = true));

CREATE POLICY "Users can view ingestion logs for accessible brands" ON data_ingestion_log FOR SELECT USING (user_has_brand_access(auth.uid(), brand_id));
CREATE POLICY "System can manage ingestion logs" ON data_ingestion_log FOR ALL USING (true);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_sfmc_campaign_brand_date ON sfmc_campaign_raw(brand_id, send_date DESC);
CREATE INDEX idx_sfmc_campaign_content ON sfmc_campaign_raw(content_registry_id);
CREATE INDEX idx_content_registry_brand ON content_registry(brand_id, status);
CREATE INDEX idx_content_registry_theme ON content_registry(theme_id);
CREATE INDEX idx_content_performance_date ON content_performance_attribution(measurement_date DESC);
CREATE INDEX idx_content_element_brand ON content_element_performance(brand_id, element_type);
CREATE INDEX idx_success_patterns_brand ON content_success_patterns(brand_id, validation_status);
CREATE INDEX idx_campaign_analytics_period ON campaign_performance_analytics(reporting_period DESC);
CREATE INDEX idx_market_analytics_month ON market_intelligence_analytics(reporting_month DESC);