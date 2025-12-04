-- Phase 6: Performance Predictions and Learning Insights Tables

-- Table to store AI performance predictions for content
CREATE TABLE IF NOT EXISTS public.performance_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content_assets(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  
  -- Predicted metrics
  predicted_engagement_rate DECIMAL(5,4),
  predicted_conversion_rate DECIMAL(5,4),
  predicted_click_rate DECIMAL(5,4),
  confidence_score DECIMAL(3,2),
  confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high')),
  
  -- Actual metrics (populated after launch)
  actual_engagement_rate DECIMAL(5,4),
  actual_conversion_rate DECIMAL(5,4),
  actual_click_rate DECIMAL(5,4),
  actual_outcome DECIMAL(10,2),
  
  -- Intelligence factors used in prediction
  factors_considered JSONB DEFAULT '{}',
  intelligence_layers_used TEXT[],
  prediction_model_version TEXT,
  
  -- Metadata
  context JSONB DEFAULT '{}',
  predicted_at TIMESTAMPTZ DEFAULT now(),
  outcome_recorded_at TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table to store learning insights from comparing predictions vs actuals
CREATE TABLE IF NOT EXISTS public.learning_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('accuracy_improvement', 'pattern_discovery', 'factor_correlation', 'model_adjustment')),
  
  -- Insight details
  insight_title TEXT NOT NULL,
  insight_description TEXT,
  confidence_score DECIMAL(3,2),
  
  -- Data backing the insight
  supporting_data JSONB DEFAULT '{}',
  sample_size INTEGER,
  statistical_significance DECIMAL(3,2),
  
  -- Actionable recommendations
  recommended_actions JSONB DEFAULT '[]',
  applied_to_model BOOLEAN DEFAULT false,
  
  -- Metadata
  discovered_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'applied', 'superseded', 'invalid')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_performance_predictions_content ON public.performance_predictions(content_id);
CREATE INDEX IF NOT EXISTS idx_performance_predictions_brand ON public.performance_predictions(brand_id);
CREATE INDEX IF NOT EXISTS idx_performance_predictions_predicted_at ON public.performance_predictions(predicted_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_insights_brand ON public.learning_insights(brand_id);
CREATE INDEX IF NOT EXISTS idx_learning_insights_type ON public.learning_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_learning_insights_discovered ON public.learning_insights(discovered_at DESC);

-- Enable RLS
ALTER TABLE public.performance_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for performance_predictions
CREATE POLICY "Users can view predictions for their brand assets"
  ON public.performance_predictions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.content_assets ca
      WHERE ca.id = performance_predictions.content_id
      AND user_has_brand_access(auth.uid(), ca.brand_id)
    )
  );

CREATE POLICY "Users can insert predictions for their brand assets"
  ON public.performance_predictions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content_assets ca
      WHERE ca.id = content_id
      AND user_has_brand_access(auth.uid(), ca.brand_id)
    )
  );

CREATE POLICY "Users can update predictions for their brand assets"
  ON public.performance_predictions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.content_assets ca
      WHERE ca.id = performance_predictions.content_id
      AND user_has_brand_access(auth.uid(), ca.brand_id)
    )
  );

-- RLS Policies for learning_insights
CREATE POLICY "Users can view learning insights for their brands"
  ON public.learning_insights FOR SELECT
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can insert learning insights for their brands"
  ON public.learning_insights FOR INSERT
  WITH CHECK (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can update learning insights for their brands"
  ON public.learning_insights FOR UPDATE
  USING (user_has_brand_access(auth.uid(), brand_id));