-- Phase 1: Add multi-dimensional columns to all data tables

-- Enhance sfmc_campaign_data
ALTER TABLE sfmc_campaign_data 
ADD COLUMN IF NOT EXISTS indication TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS audience_type TEXT,
ADD COLUMN IF NOT EXISTS sophistication_level TEXT,
ADD COLUMN IF NOT EXISTS asset_type TEXT;

-- Enhance veeva_field_insights
ALTER TABLE veeva_field_insights 
ADD COLUMN IF NOT EXISTS indication TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS audience_type TEXT,
ADD COLUMN IF NOT EXISTS hcp_specialty TEXT,
ADD COLUMN IF NOT EXISTS competitive_mention TEXT;

-- Enhance iqvia_market_data
ALTER TABLE iqvia_market_data 
ADD COLUMN IF NOT EXISTS indication TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS market_segment TEXT;

-- Enhance social_listening_data
ALTER TABLE social_listening_data 
ADD COLUMN IF NOT EXISTS indication TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS audience_type TEXT,
ADD COLUMN IF NOT EXISTS platform_type TEXT,
ADD COLUMN IF NOT EXISTS engagement_score INTEGER;

-- Enhance competitive_intelligence_data
ALTER TABLE competitive_intelligence_data 
ADD COLUMN IF NOT EXISTS indication TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS threat_level TEXT;

-- Create composite indexes for filtering performance
CREATE INDEX IF NOT EXISTS idx_sfmc_filtering ON sfmc_campaign_data(brand_id, indication, region, audience_type, send_date);
CREATE INDEX IF NOT EXISTS idx_veeva_filtering ON veeva_field_insights(brand_id, indication, region, audience_type, recorded_date);
CREATE INDEX IF NOT EXISTS idx_iqvia_filtering ON iqvia_market_data(brand_id, indication, region, data_date);
CREATE INDEX IF NOT EXISTS idx_social_filtering ON social_listening_data(brand_id, indication, region, date_captured);
CREATE INDEX IF NOT EXISTS idx_competitive_filtering ON competitive_intelligence_data(brand_id, indication, region, date_captured);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_sfmc_performance ON sfmc_campaign_data(open_rate, click_rate, conversion_rate);
CREATE INDEX IF NOT EXISTS idx_veeva_sentiment ON veeva_field_insights(sentiment, frequency_score);
CREATE INDEX IF NOT EXISTS idx_social_engagement ON social_listening_data(engagement_score, sentiment);