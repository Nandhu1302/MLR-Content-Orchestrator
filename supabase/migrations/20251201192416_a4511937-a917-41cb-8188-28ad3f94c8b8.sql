-- Phase 1: MLR Memory Database Foundation

-- Pre-approved content library with golden approved text
CREATE TABLE public.pre_approved_content_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brand_profiles(id),
  mlr_code TEXT NOT NULL,
  content_text TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'module',
  module_type TEXT,
  target_audiences TEXT[] DEFAULT '{}',
  linked_claim_ids UUID[] DEFAULT '{}',
  linked_reference_ids UUID[] DEFAULT '{}',
  linked_safety_ids UUID[] DEFAULT '{}',
  approval_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  approved_by TEXT,
  approval_scope TEXT[] DEFAULT '{US}',
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- MLR review decisions - capture actual reviewer feedback
CREATE TABLE public.mlr_review_decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brand_profiles(id),
  asset_id UUID,
  asset_name TEXT,
  asset_type TEXT,
  reviewer_type TEXT NOT NULL DEFAULT 'medical',
  reviewer_name TEXT,
  decision TEXT NOT NULL,
  decision_category TEXT,
  original_text TEXT,
  suggested_text TEXT,
  rationale TEXT,
  severity TEXT DEFAULT 'medium',
  claim_id UUID,
  reference_id UUID,
  pattern_tags TEXT[] DEFAULT '{}',
  review_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- MLR decision patterns - learn from historical reviews
CREATE TABLE public.mlr_decision_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID,
  pattern_name TEXT NOT NULL,
  pattern_type TEXT NOT NULL,
  pattern_description TEXT,
  detection_regex TEXT,
  detection_keywords TEXT[] DEFAULT '{}',
  typical_decision TEXT NOT NULL,
  approval_rate NUMERIC(5,2) DEFAULT 0,
  rejection_count INTEGER DEFAULT 0,
  approval_count INTEGER DEFAULT 0,
  common_feedback TEXT,
  suggested_alternative TEXT,
  severity TEXT DEFAULT 'medium',
  applicable_asset_types TEXT[] DEFAULT '{}',
  example_violations TEXT[] DEFAULT '{}',
  example_approvals TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pre_approved_content_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mlr_review_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mlr_decision_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pre_approved_content_library
CREATE POLICY "Users can view pre-approved content for accessible brands"
ON public.pre_approved_content_library FOR SELECT
USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can create pre-approved content for accessible brands"
ON public.pre_approved_content_library FOR INSERT
WITH CHECK (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can update pre-approved content for accessible brands"
ON public.pre_approved_content_library FOR UPDATE
USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Demo users can manage all pre-approved content"
ON public.pre_approved_content_library FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_demo_user = true));

-- RLS Policies for mlr_review_decisions
CREATE POLICY "Users can view MLR decisions for accessible brands"
ON public.mlr_review_decisions FOR SELECT
USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can create MLR decisions for accessible brands"
ON public.mlr_review_decisions FOR INSERT
WITH CHECK (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can update MLR decisions for accessible brands"
ON public.mlr_review_decisions FOR UPDATE
USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Demo users can manage all MLR decisions"
ON public.mlr_review_decisions FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_demo_user = true));

-- RLS Policies for mlr_decision_patterns
CREATE POLICY "All users can view MLR patterns"
ON public.mlr_decision_patterns FOR SELECT
USING (true);

CREATE POLICY "Demo users can manage MLR patterns"
ON public.mlr_decision_patterns FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_demo_user = true));

-- Create indexes for performance
CREATE INDEX idx_pre_approved_library_brand ON public.pre_approved_content_library(brand_id);
CREATE INDEX idx_pre_approved_library_mlr_code ON public.pre_approved_content_library(mlr_code);
CREATE INDEX idx_mlr_review_decisions_brand ON public.mlr_review_decisions(brand_id);
CREATE INDEX idx_mlr_review_decisions_asset ON public.mlr_review_decisions(asset_id);
CREATE INDEX idx_mlr_decision_patterns_type ON public.mlr_decision_patterns(pattern_type);