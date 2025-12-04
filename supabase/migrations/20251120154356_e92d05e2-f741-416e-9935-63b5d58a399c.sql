-- Add clustering and learning capabilities to content opportunities

-- Create opportunity_clusters table FIRST
CREATE TABLE opportunity_clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
  cluster_theme text NOT NULL,
  opportunity_ids uuid[] NOT NULL DEFAULT '{}',
  combined_priority text NOT NULL DEFAULT 'medium',
  combined_urgency_score numeric NOT NULL DEFAULT 0,
  combined_impact_score numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Now add cluster_id to content_opportunities
ALTER TABLE content_opportunities
ADD COLUMN cluster_id uuid REFERENCES opportunity_clusters(id) ON DELETE SET NULL;

-- Create learning_signals table
CREATE TABLE learning_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES content_opportunities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  action_taken text NOT NULL CHECK (action_taken IN ('generated_content', 'dismissed', 'deferred', 'viewed')),
  content_performance jsonb DEFAULT '{}',
  user_feedback text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create trend_forecasts table
CREATE TABLE trend_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
  trend_type text NOT NULL CHECK (trend_type IN ('sentiment', 'market', 'competitive', 'topic')),
  forecast_topic text NOT NULL,
  predicted_peak_date timestamptz NOT NULL,
  confidence_level numeric NOT NULL DEFAULT 0 CHECK (confidence_level >= 0 AND confidence_level <= 1),
  recommended_prep_actions jsonb NOT NULL DEFAULT '[]',
  current_velocity numeric,
  forecast_data jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'realized', 'expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE opportunity_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_forecasts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for opportunity_clusters
CREATE POLICY "Users can view clusters for accessible brands"
  ON opportunity_clusters FOR SELECT
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can create clusters for accessible brands"
  ON opportunity_clusters FOR INSERT
  WITH CHECK (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can update clusters for accessible brands"
  ON opportunity_clusters FOR UPDATE
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Demo users can manage all clusters"
  ON opportunity_clusters FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_demo_user = true));

-- RLS Policies for learning_signals
CREATE POLICY "Users can view their own learning signals"
  ON learning_signals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own learning signals"
  ON learning_signals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Demo users can manage all learning signals"
  ON learning_signals FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_demo_user = true));

-- RLS Policies for trend_forecasts
CREATE POLICY "Users can view forecasts for accessible brands"
  ON trend_forecasts FOR SELECT
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can create forecasts for accessible brands"
  ON trend_forecasts FOR INSERT
  WITH CHECK (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can update forecasts for accessible brands"
  ON trend_forecasts FOR UPDATE
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Demo users can manage all forecasts"
  ON trend_forecasts FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_demo_user = true));

-- Create indexes for performance
CREATE INDEX idx_opportunity_clusters_brand_id ON opportunity_clusters(brand_id);
CREATE INDEX idx_learning_signals_opportunity_id ON learning_signals(opportunity_id);
CREATE INDEX idx_learning_signals_user_id ON learning_signals(user_id);
CREATE INDEX idx_trend_forecasts_brand_id ON trend_forecasts(brand_id);
CREATE INDEX idx_trend_forecasts_status ON trend_forecasts(status);
CREATE INDEX idx_content_opportunities_cluster_id ON content_opportunities(cluster_id);