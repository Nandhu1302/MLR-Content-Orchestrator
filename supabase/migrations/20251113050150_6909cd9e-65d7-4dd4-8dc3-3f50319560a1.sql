-- Phase 1: Content Modules Table
CREATE TABLE content_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
  pi_document_id UUID REFERENCES prescribing_information(id) ON DELETE CASCADE,
  
  -- Core content
  module_text TEXT NOT NULL,
  module_type TEXT NOT NULL,
  
  -- Variants
  length_variant TEXT, -- 'brief' (50 chars), 'short' (100), 'medium' (250), 'long' (500+)
  tone_variant TEXT, -- 'clinical', 'conversational', 'patient_friendly'
  parent_module_id UUID REFERENCES content_modules(id) ON DELETE SET NULL,
  
  -- Relationships
  linked_claims UUID[] DEFAULT '{}',
  linked_references UUID[] DEFAULT '{}',
  required_safety_statements UUID[] DEFAULT '{}',
  
  -- Channel rules
  channel_adaptations JSONB DEFAULT '{}',
  character_limit_max INTEGER,
  
  -- Reuse tracking
  approved_combinations UUID[] DEFAULT '{}',
  contraindicated_modules UUID[] DEFAULT '{}',
  usage_score FLOAT DEFAULT 0.0,
  
  -- Compliance
  mlr_approved BOOLEAN DEFAULT FALSE,
  mlr_approved_by UUID,
  mlr_approved_at TIMESTAMP WITH TIME ZONE,
  approval_date TIMESTAMP WITH TIME ZONE,
  expiration_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT valid_module_type CHECK (module_type IN (
    'headline_short', 'headline_long',
    'mechanism_brief', 'mechanism_detailed',
    'efficacy_summary', 'efficacy_statistical',
    'safety_summary', 'safety_detailed',
    'dosing_brief', 'dosing_detailed',
    'cta_trial', 'cta_info', 'cta_sample',
    'indication_brief', 'indication_full',
    'patient_benefit', 'hcp_technical'
  )),
  CONSTRAINT valid_length_variant CHECK (length_variant IS NULL OR length_variant IN ('brief', 'short', 'medium', 'long')),
  CONSTRAINT valid_tone_variant CHECK (tone_variant IS NULL OR tone_variant IN ('clinical', 'conversational', 'patient_friendly'))
);

-- Indexes for content_modules
CREATE INDEX idx_content_modules_brand ON content_modules(brand_id);
CREATE INDEX idx_content_modules_pi ON content_modules(pi_document_id);
CREATE INDEX idx_content_modules_type ON content_modules(module_type);
CREATE INDEX idx_content_modules_parent ON content_modules(parent_module_id);
CREATE INDEX idx_content_modules_linked_claims ON content_modules USING GIN(linked_claims);
CREATE INDEX idx_content_modules_usage_score ON content_modules(usage_score DESC);

-- RLS for content_modules
ALTER TABLE content_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view modules for accessible brands"
  ON content_modules FOR SELECT
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can create modules for accessible brands"
  ON content_modules FOR INSERT
  WITH CHECK (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can update modules for accessible brands"
  ON content_modules FOR UPDATE
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Demo users can manage all content modules"
  ON content_modules FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_demo_user = true
  ));

-- Phase 2: Claim Variants Table
CREATE TABLE claim_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_claim_id UUID NOT NULL REFERENCES clinical_claims(id) ON DELETE CASCADE,
  variant_text TEXT NOT NULL,
  variant_type TEXT NOT NULL,
  
  -- Asset-specific constraints
  max_character_length INTEGER,
  suitable_for_channels TEXT[] DEFAULT '{}',
  
  -- Compliance
  requires_footnote BOOLEAN DEFAULT FALSE,
  footnote_text TEXT,
  mlr_approved BOOLEAN DEFAULT FALSE,
  mlr_approved_by UUID,
  mlr_approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Performance tracking
  conversion_rate FLOAT DEFAULT 0.0,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT valid_variant_type CHECK (variant_type IN (
    'statistical', 'conversational', 'clinical', 'patient_friendly', 
    'headline', 'regulatory', 'comparative', 'mechanism_focused'
  ))
);

-- Indexes for claim_variants
CREATE INDEX idx_claim_variants_parent ON claim_variants(parent_claim_id);
CREATE INDEX idx_claim_variants_type ON claim_variants(variant_type);
CREATE INDEX idx_claim_variants_channels ON claim_variants USING GIN(suitable_for_channels);
CREATE INDEX idx_claim_variants_conversion ON claim_variants(conversion_rate DESC);

-- RLS for claim_variants
ALTER TABLE claim_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view claim variants for accessible brands"
  ON claim_variants FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM clinical_claims
    WHERE clinical_claims.id = claim_variants.parent_claim_id
    AND user_has_brand_access(auth.uid(), clinical_claims.brand_id)
  ));

CREATE POLICY "Users can create claim variants for accessible brands"
  ON claim_variants FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM clinical_claims
    WHERE clinical_claims.id = claim_variants.parent_claim_id
    AND user_has_brand_access(auth.uid(), clinical_claims.brand_id)
  ));

CREATE POLICY "Users can update claim variants for accessible brands"
  ON claim_variants FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM clinical_claims
    WHERE clinical_claims.id = claim_variants.parent_claim_id
    AND user_has_brand_access(auth.uid(), clinical_claims.brand_id)
  ));

CREATE POLICY "Demo users can manage all claim variants"
  ON claim_variants FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_demo_user = true
  ));

-- Phase 3: Asset Type Configurations Table
CREATE TABLE asset_type_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  
  -- Content rules
  required_sections TEXT[] DEFAULT '{}',
  character_limits JSONB DEFAULT '{}',
  
  -- Claim rules
  max_claims_allowed INTEGER,
  allowed_claim_types TEXT[] DEFAULT '{}',
  requires_fair_balance BOOLEAN DEFAULT TRUE,
  requires_references_inline BOOLEAN DEFAULT FALSE,
  
  -- Safety requirements
  isi_placement TEXT,
  required_disclaimers TEXT[] DEFAULT '{}',
  
  -- Channel metadata
  typical_audience TEXT,
  compliance_level TEXT DEFAULT 'high',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT valid_isi_placement CHECK (isi_placement IS NULL OR isi_placement IN ('footer', 'sidebar', 'modal', 'inline', 'last_page')),
  CONSTRAINT valid_compliance_level CHECK (compliance_level IN ('standard', 'high', 'maximum'))
);

-- Indexes for asset_type_configurations
CREATE INDEX idx_asset_type_configs_type ON asset_type_configurations(asset_type);

-- RLS for asset_type_configurations (read-only for all authenticated users)
ALTER TABLE asset_type_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view asset type configurations"
  ON asset_type_configurations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Demo users can manage asset type configurations"
  ON asset_type_configurations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_demo_user = true
  ));

-- Insert default configurations
INSERT INTO asset_type_configurations (asset_type, display_name, character_limits, max_claims_allowed, requires_references_inline, isi_placement, typical_audience) VALUES
('email', 'Email', '{"subject": 60, "preheader": 90, "body": 2000}'::jsonb, 2, false, 'footer', 'HCPs'),
('detail_aid', 'Detail Aid', '{"headline": 100, "body": 5000}'::jsonb, 5, true, 'last_page', 'HCPs'),
('website', 'Website', '{"hero_headline": 120, "hero_body": 500}'::jsonb, 8, true, 'sidebar', 'Mixed'),
('social_post', 'Social Media Post', '{"post": 280, "caption": 150}'::jsonb, 1, false, 'inline', 'Patients'),
('banner_ad', 'Banner Ad', '{"headline": 50, "body": 100}'::jsonb, 1, false, 'modal', 'Mixed'),
('patient_brochure', 'Patient Brochure', '{"headline": 80, "section": 1000}'::jsonb, 3, false, 'last_page', 'Patients');

-- Phase 4: Content Relationships Table
CREATE TABLE content_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_module_id UUID NOT NULL REFERENCES content_modules(id) ON DELETE CASCADE,
  target_module_id UUID NOT NULL REFERENCES content_modules(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  
  -- Relationship metadata
  confidence_score FLOAT DEFAULT 0.5,
  created_from_usage_pattern BOOLEAN DEFAULT FALSE,
  usage_frequency INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT valid_relationship_type CHECK (relationship_type IN (
    'is_summary_of', 'is_detailed_version_of', 
    'frequently_paired_with', 'must_follow',
    'contraindicated_with', 'requires_context_from',
    'alternative_to', 'complements'
  )),
  CONSTRAINT no_self_reference CHECK (source_module_id != target_module_id),
  UNIQUE(source_module_id, target_module_id, relationship_type)
);

-- Indexes for content_relationships
CREATE INDEX idx_content_relationships_source ON content_relationships(source_module_id);
CREATE INDEX idx_content_relationships_target ON content_relationships(target_module_id);
CREATE INDEX idx_content_relationships_type ON content_relationships(relationship_type);
CREATE INDEX idx_content_relationships_confidence ON content_relationships(confidence_score DESC);

-- RLS for content_relationships
ALTER TABLE content_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view relationships for accessible content"
  ON content_relationships FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM content_modules
    WHERE content_modules.id = content_relationships.source_module_id
    AND user_has_brand_access(auth.uid(), content_modules.brand_id)
  ));

CREATE POLICY "Users can create relationships for accessible content"
  ON content_relationships FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM content_modules
    WHERE content_modules.id = content_relationships.source_module_id
    AND user_has_brand_access(auth.uid(), content_modules.brand_id)
  ));

CREATE POLICY "Users can update relationships for accessible content"
  ON content_relationships FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM content_modules
    WHERE content_modules.id = content_relationships.source_module_id
    AND user_has_brand_access(auth.uid(), content_modules.brand_id)
  ));

CREATE POLICY "Demo users can manage all content relationships"
  ON content_relationships FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_demo_user = true
  ));

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_content_repurposing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_modules_updated_at
  BEFORE UPDATE ON content_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_content_repurposing_updated_at();

CREATE TRIGGER update_claim_variants_updated_at
  BEFORE UPDATE ON claim_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_content_repurposing_updated_at();

CREATE TRIGGER update_asset_type_configs_updated_at
  BEFORE UPDATE ON asset_type_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_content_repurposing_updated_at();

CREATE TRIGGER update_content_relationships_updated_at
  BEFORE UPDATE ON content_relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_content_repurposing_updated_at();