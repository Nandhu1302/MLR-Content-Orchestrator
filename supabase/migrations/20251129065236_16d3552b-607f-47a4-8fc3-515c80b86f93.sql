-- Populate market_intelligence_analytics with baseline data
INSERT INTO market_intelligence_analytics (
  brand_id, 
  reporting_month,
  total_rx,
  new_rx,
  refill_rx,
  rx_growth_rate, 
  market_share_percent, 
  market_rank,
  share_change,
  primary_competitor,
  competitor_share_percent,
  share_gap,
  top_decile_hcp_count, 
  region_growth_rate, 
  total_hcp_prescribers,
  new_hcp_prescribers,
  hcp_retention_rate,
  trend_direction,
  top_performing_region
)
SELECT 
  '225d6bbc-c663-462f-86a8-21886bc40047'::uuid,
  DATE_TRUNC('month', NOW())::date,
  125000,
  43750,
  81250,
  15.3,
  42.5,
  1,
  3.2,
  'Dovato',
  28.3,
  14.2,
  (SELECT COUNT(DISTINCT hcp_id) FROM iqvia_hcp_decile_raw WHERE decile IN ('1', '2', '3')),
  '{"Northeast": 18.2, "Southeast": 14.5, "Midwest": 12.1, "Southwest": 16.8, "West": 15.0}'::jsonb,
  (SELECT COUNT(DISTINCT hcp_id) FROM iqvia_hcp_decile_raw),
  42,
  0.89,
  'growing',
  'Southwest'
WHERE NOT EXISTS (SELECT 1 FROM market_intelligence_analytics WHERE brand_id = '225d6bbc-c663-462f-86a8-21886bc40047');

-- Populate hcp_engagement_analytics with sample aggregated data
INSERT INTO hcp_engagement_analytics (
  brand_id,
  reporting_week,
  hcp_id,
  hcp_specialty,
  hcp_decile,
  rep_calls,
  email_opens,
  website_visits,
  prescriptions_written,
  total_touchpoints,
  churn_risk_score,
  growth_opportunity_score,
  preferred_channel,
  preferred_content_type,
  prescription_trend
)
SELECT 
  '225d6bbc-c663-462f-86a8-21886bc40047'::uuid,
  DATE_TRUNC('week', NOW())::date,
  hcp_id,
  specialty,
  decile::integer,
  (RANDOM() * 5 + 1)::integer,
  (RANDOM() * 8 + 2)::integer,
  (RANDOM() * 15 + 5)::integer,
  brand_rx_count,
  (RANDOM() * 20 + 10)::integer,
  (RANDOM() * 30)::integer,
  (RANDOM() * 50 + 50)::integer,
  CASE WHEN RANDOM() < 0.4 THEN 'Email' WHEN RANDOM() < 0.7 THEN 'Web' ELSE 'Rep' END,
  'Clinical Data',
  rx_trend
FROM iqvia_hcp_decile_raw
WHERE hcp_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM hcp_engagement_analytics 
    WHERE brand_id = '225d6bbc-c663-462f-86a8-21886bc40047' 
    AND hcp_id = iqvia_hcp_decile_raw.hcp_id
  )
LIMIT 100;