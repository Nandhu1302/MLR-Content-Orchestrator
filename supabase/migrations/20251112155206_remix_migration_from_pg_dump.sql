--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: get_brand_appropriate_themes(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_brand_appropriate_themes(p_brand_id uuid, p_therapeutic_area text DEFAULT NULL::text) RETURNS TABLE(theme_id uuid, theme_name text, therapeutic_match_score integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tl.id as theme_id,
        tl.name as theme_name,
        CASE 
            WHEN LOWER(COALESCE(tl.messaging_framework->>'therapeutic_focus', '')) = LOWER(COALESCE(p_therapeutic_area, bp.therapeutic_area)) THEN 100
            WHEN LOWER(tl.description) LIKE '%' || LOWER(COALESCE(p_therapeutic_area, bp.therapeutic_area)) || '%' THEN 80
            WHEN array_length(tl.audience_segments, 1) > 0 
                 AND LOWER(tl.audience_segments[1]) LIKE '%' || LOWER(COALESCE(p_therapeutic_area, bp.therapeutic_area)) || '%' THEN 60
            ELSE 20
        END as therapeutic_match_score
    FROM theme_library tl
    JOIN brand_profiles bp ON bp.id = p_brand_id
    WHERE tl.brand_id = p_brand_id 
      AND tl.status = 'active'
    ORDER BY therapeutic_match_score DESC, tl.usage_count DESC, tl.created_at DESC;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$;


--
-- Name: update_theme_enrichment_status(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_theme_enrichment_status() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Update theme_library when intelligence is incorporated
  UPDATE theme_library
  SET 
    enrichment_status = 'ready-for-use',
    intelligence_progress = 100,
    updated_at = now()
  WHERE id = NEW.theme_id
  AND NEW.incorporated = true;
  
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$;


--
-- Name: user_has_brand_access(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.user_has_brand_access(user_id_param uuid, brand_id_param uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_brand_access 
    WHERE user_id = user_id_param AND brand_id = brand_id_param
  ) OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_id_param AND is_demo_user = true
  );
$$;


--
-- Name: validate_cross_module_theme_compatibility(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_cross_module_theme_compatibility() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    brand_therapeutic_area TEXT;
    theme_therapeutic_focus TEXT;
BEGIN
    -- Get the brand's therapeutic area
    SELECT therapeutic_area INTO brand_therapeutic_area
    FROM brand_profiles 
    WHERE id = NEW.brand_id;
    
    -- Extract therapeutic focus from theme data if it exists
    IF NEW.context_data ? 'theme' THEN
        theme_therapeutic_focus := COALESCE(
            NEW.context_data->'theme'->>'therapeuticFocus',
            NEW.context_data->'theme'->>'therapeutic_focus',
            ''
        );
        
        -- Set the therapeutic_area for tracking
        NEW.therapeutic_area := brand_therapeutic_area;
        
        -- Log compatibility check
        RAISE NOTICE 'Validating theme compatibility: Brand=% Theme=%', brand_therapeutic_area, theme_therapeutic_focus;
        
        -- If therapeutic areas don't match, log but allow (app will handle validation)
        IF brand_therapeutic_area IS NOT NULL 
           AND theme_therapeutic_focus != '' 
           AND LOWER(theme_therapeutic_focus) != LOWER(brand_therapeutic_area) 
           AND NOT (
               -- Allow some cross-compatibility
               (LOWER(brand_therapeutic_area) = 'oncology' AND LOWER(theme_therapeutic_focus) LIKE '%cancer%') OR
               (LOWER(brand_therapeutic_area) = 'cardiovascular' AND LOWER(theme_therapeutic_focus) LIKE '%cardio%') OR
               (LOWER(brand_therapeutic_area) = 'respiratory' AND LOWER(theme_therapeutic_focus) LIKE '%respiratory%')
           ) THEN
            RAISE NOTICE 'Therapeutic area mismatch detected: Brand=% Theme=%', brand_therapeutic_area, theme_therapeutic_focus;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: agency_collaboration_workflows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agency_collaboration_workflows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    localization_project_id uuid NOT NULL,
    ai_translation_batch_id uuid,
    agency_name text,
    workflow_status text DEFAULT 'pending'::text NOT NULL,
    ai_pre_translation_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    agency_review_data jsonb DEFAULT '{}'::jsonb,
    quality_metrics jsonb DEFAULT '{}'::jsonb,
    time_savings_hours numeric,
    cost_savings_percentage numeric,
    handoff_format text DEFAULT 'xliff'::text NOT NULL,
    assigned_reviewer uuid,
    ai_completion_date timestamp with time zone,
    agency_completion_date timestamp with time zone,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ai_translation_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_translation_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    asset_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    source_text text NOT NULL,
    translated_text text NOT NULL,
    source_language text NOT NULL,
    target_language text NOT NULL,
    translation_engine text NOT NULL,
    confidence_score numeric DEFAULT 0 NOT NULL,
    medical_accuracy_score numeric DEFAULT 0 NOT NULL,
    brand_consistency_score numeric DEFAULT 0 NOT NULL,
    cultural_adaptation_score numeric DEFAULT 0 NOT NULL,
    regulatory_compliance_score numeric DEFAULT 0 NOT NULL,
    overall_quality_score numeric DEFAULT 0 NOT NULL,
    human_reviewed boolean DEFAULT false NOT NULL,
    human_corrections jsonb DEFAULT '{}'::jsonb,
    segment_type text DEFAULT 'general'::text NOT NULL,
    processing_time_ms integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: asset_guardrails; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asset_guardrails (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid NOT NULL,
    campaign_id uuid,
    brand_id uuid NOT NULL,
    asset_type text NOT NULL,
    message_customizations text[],
    tone_adjustments jsonb,
    channel_requirements jsonb,
    format_constraints jsonb,
    character_limits jsonb,
    visual_requirements jsonb,
    regulatory_placement_rules jsonb,
    disclaimer_requirements jsonb,
    review_workflow_overrides jsonb,
    approval_requirements jsonb,
    ab_testing_guidelines jsonb,
    engagement_targets jsonb,
    inherits_from_campaign boolean DEFAULT true,
    inherits_from_brand boolean DEFAULT true,
    override_level text DEFAULT 'asset'::text,
    customization_rationale text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid,
    CONSTRAINT asset_guardrails_override_level_check CHECK ((override_level = ANY (ARRAY['asset'::text, 'campaign_override'::text, 'brand_override'::text, 'full_override'::text])))
);


--
-- Name: asset_themes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asset_themes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid NOT NULL,
    theme_id uuid NOT NULL,
    campaign_theme_id uuid,
    brand_id uuid NOT NULL,
    asset_type text NOT NULL,
    theme_adaptations jsonb DEFAULT '{}'::jsonb,
    content_variations jsonb DEFAULT '{}'::jsonb,
    performance_metrics jsonb DEFAULT '{}'::jsonb,
    engagement_data jsonb DEFAULT '{}'::jsonb,
    conversion_data jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'planned'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    CONSTRAINT asset_themes_status_check CHECK ((status = ANY (ARRAY['planned'::text, 'in-production'::text, 'review'::text, 'approved'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: audience_segments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audience_segments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    segment_name text NOT NULL,
    segment_type text,
    therapeutic_area text NOT NULL,
    demographics jsonb DEFAULT '{}'::jsonb NOT NULL,
    psychographics jsonb DEFAULT '{}'::jsonb NOT NULL,
    professional_characteristics jsonb,
    disease_characteristics jsonb,
    communication_preferences jsonb DEFAULT '{}'::jsonb NOT NULL,
    messaging_preferences jsonb DEFAULT '{}'::jsonb NOT NULL,
    channel_preferences jsonb DEFAULT '[]'::jsonb NOT NULL,
    content_preferences jsonb DEFAULT '{}'::jsonb NOT NULL,
    engagement_patterns jsonb DEFAULT '{}'::jsonb NOT NULL,
    barriers_to_engagement jsonb DEFAULT '[]'::jsonb NOT NULL,
    motivations jsonb DEFAULT '[]'::jsonb NOT NULL,
    decision_factors jsonb DEFAULT '[]'::jsonb NOT NULL,
    information_sources jsonb DEFAULT '[]'::jsonb NOT NULL,
    trust_factors jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    CONSTRAINT audience_segments_segment_type_check CHECK ((segment_type = ANY (ARRAY['hcp'::text, 'patient'::text, 'caregiver'::text, 'payer'::text, 'kol'::text, 'media'::text])))
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action_type text NOT NULL,
    table_name text,
    record_id uuid,
    old_data jsonb,
    new_data jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    brand_id uuid
);


--
-- Name: brand_guidelines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_guidelines (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    tone_of_voice jsonb,
    messaging_framework jsonb,
    visual_guidelines jsonb,
    logo_usage_rules text,
    typography jsonb,
    imagery_style text,
    last_updated timestamp with time zone DEFAULT now() NOT NULL,
    updated_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_reviewed timestamp with time zone DEFAULT now()
);


--
-- Name: brand_market_configurations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_market_configurations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    market_code text NOT NULL,
    market_name text NOT NULL,
    language_code text NOT NULL,
    language_name text NOT NULL,
    is_primary_market boolean DEFAULT false,
    therapeutic_area_relevance integer DEFAULT 50,
    regulatory_complexity text DEFAULT 'medium'::text,
    estimated_timeline_weeks text DEFAULT '4-6 weeks'::text,
    complexity_factors jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: brand_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_name text NOT NULL,
    company text NOT NULL,
    therapeutic_area text NOT NULL,
    logo_url text,
    primary_color text NOT NULL,
    secondary_color text NOT NULL,
    accent_color text NOT NULL,
    font_family text DEFAULT 'Inter'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: brand_vision; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_vision (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    mission_statement text,
    brand_purpose text,
    core_values jsonb,
    brand_personality jsonb,
    brand_promise text,
    unique_value_proposition text,
    brand_story text,
    emotional_connection jsonb,
    positioning_statement text,
    differentiation_matrix jsonb,
    target_perception text,
    brand_architecture jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid
);


--
-- Name: campaign_guardrails; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_guardrails (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    custom_key_messages text[],
    message_priority_overrides jsonb,
    tone_overrides jsonb,
    audience_specific_tone jsonb,
    competitive_focus text[],
    competitive_messaging_emphasis text[],
    market_specific_rules jsonb,
    regulatory_additions jsonb,
    mlr_deadline_requirements jsonb,
    approval_process_overrides jsonb,
    inherits_from_brand boolean DEFAULT true,
    override_level text DEFAULT 'campaign'::text,
    customization_rationale text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid,
    CONSTRAINT campaign_guardrails_override_level_check CHECK ((override_level = ANY (ARRAY['campaign'::text, 'full_override'::text])))
);


--
-- Name: campaign_themes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_themes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    theme_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    selection_reason text,
    customizations jsonb DEFAULT '{}'::jsonb,
    performance_target jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'active'::text NOT NULL,
    selected_at timestamp with time zone DEFAULT now() NOT NULL,
    activated_at timestamp with time zone,
    completed_at timestamp with time zone,
    actual_performance jsonb DEFAULT '{}'::jsonb,
    roi_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    CONSTRAINT campaign_themes_status_check CHECK ((status = ANY (ARRAY['selected'::text, 'active'::text, 'completed'::text, 'paused'::text])))
);


--
-- Name: clinical_claims; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clinical_claims (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pi_document_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    claim_text text NOT NULL,
    claim_type text NOT NULL,
    therapeutic_context text,
    source_section text NOT NULL,
    source_page integer,
    statistical_data jsonb DEFAULT '{}'::jsonb,
    target_audience text[] DEFAULT '{}'::text[],
    requires_fair_balance boolean DEFAULT false,
    requires_isi boolean DEFAULT false,
    confidence_score numeric(3,2) DEFAULT 0.00,
    regulatory_status text DEFAULT 'approved'::text,
    review_status text DEFAULT 'pending'::text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    usage_count integer DEFAULT 0,
    last_used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT clinical_claims_claim_type_check CHECK ((claim_type = ANY (ARRAY['efficacy'::text, 'safety'::text, 'dosing'::text, 'indication'::text, 'comparative'::text, 'mechanism'::text]))),
    CONSTRAINT clinical_claims_confidence_score_check CHECK (((confidence_score >= (0)::numeric) AND (confidence_score <= (1)::numeric))),
    CONSTRAINT clinical_claims_regulatory_status_check CHECK ((regulatory_status = ANY (ARRAY['approved'::text, 'pending'::text, 'rejected'::text]))),
    CONSTRAINT clinical_claims_review_status_check CHECK ((review_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);


--
-- Name: clinical_references; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clinical_references (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    claim_id uuid,
    pi_document_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    reference_text text NOT NULL,
    study_name text,
    authors text,
    journal text,
    publication_year integer,
    doi text,
    pubmed_id text,
    citation_format text DEFAULT 'ama'::text,
    formatted_citation text,
    reference_type text DEFAULT 'clinical_trial'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT clinical_references_reference_type_check CHECK ((reference_type = ANY (ARRAY['clinical_trial'::text, 'real_world_evidence'::text, 'meta_analysis'::text, 'regulatory'::text, 'other'::text])))
);


--
-- Name: competitive_intelligence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.competitive_intelligence (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    competitor_name text NOT NULL,
    competitor_brand text,
    therapeutic_area text NOT NULL,
    threat_level text,
    market_share_percent numeric(5,2),
    key_differentiators jsonb DEFAULT '[]'::jsonb NOT NULL,
    competitive_advantages jsonb DEFAULT '[]'::jsonb NOT NULL,
    competitive_weaknesses jsonb DEFAULT '[]'::jsonb NOT NULL,
    messaging_strategy jsonb,
    pricing_strategy jsonb,
    market_positioning text,
    recent_developments jsonb,
    threat_assessment jsonb,
    response_strategy jsonb,
    monitoring_alerts jsonb,
    intelligence_sources jsonb,
    last_updated timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    CONSTRAINT competitive_intelligence_threat_level_check CHECK ((threat_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])))
);


--
-- Name: competitive_intelligence_enriched; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.competitive_intelligence_enriched (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    competitor_name text NOT NULL,
    intelligence_type text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    source_url text,
    source_date timestamp with time zone,
    impact_assessment text,
    recommended_actions jsonb DEFAULT '[]'::jsonb,
    threat_level text,
    discovered_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT competitive_intelligence_enriched_intelligence_type_check CHECK ((intelligence_type = ANY (ARRAY['clinical_trial'::text, 'press_release'::text, 'positioning'::text, 'warning_letter'::text, 'patent'::text, 'regulatory_filing'::text, 'market_data'::text]))),
    CONSTRAINT competitive_intelligence_enriched_status_check CHECK ((status = ANY (ARRAY['active'::text, 'addressed'::text, 'archived'::text]))),
    CONSTRAINT competitive_intelligence_enriched_threat_level_check CHECK ((threat_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])))
);


--
-- Name: competitive_landscape; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.competitive_landscape (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    competitor_name text NOT NULL,
    competitive_advantages jsonb,
    key_differentiators text[],
    messaging_opportunities text[],
    market_share_data jsonb,
    threat_level text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT competitive_landscape_threat_level_check CHECK ((threat_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text])))
);


--
-- Name: compliance_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compliance_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    content_type text NOT NULL,
    brand_compliance_score integer,
    campaign_compliance_score integer,
    asset_compliance_score integer,
    overall_compliance_score integer,
    compliance_details jsonb,
    suggestions jsonb,
    warnings jsonb,
    critical_issues jsonb,
    has_overrides boolean DEFAULT false,
    override_details jsonb,
    approved_by uuid,
    approval_timestamp timestamp with time zone,
    checked_at timestamp with time zone DEFAULT now() NOT NULL,
    checked_by uuid,
    guardrails_version text,
    CONSTRAINT compliance_history_asset_compliance_score_check CHECK (((asset_compliance_score >= 0) AND (asset_compliance_score <= 100))),
    CONSTRAINT compliance_history_brand_compliance_score_check CHECK (((brand_compliance_score >= 0) AND (brand_compliance_score <= 100))),
    CONSTRAINT compliance_history_campaign_compliance_score_check CHECK (((campaign_compliance_score >= 0) AND (campaign_compliance_score <= 100))),
    CONSTRAINT compliance_history_overall_compliance_score_check CHECK (((overall_compliance_score >= 0) AND (overall_compliance_score <= 100)))
);


--
-- Name: composed_emails; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.composed_emails (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid,
    brand_id uuid,
    email_html text NOT NULL,
    email_structure jsonb NOT NULL,
    components_used jsonb NOT NULL,
    intelligence_decisions jsonb,
    quality_scores jsonb,
    composition_version integer DEFAULT 1,
    composed_at timestamp with time zone DEFAULT now(),
    composed_by uuid,
    approval_status text DEFAULT 'draft'::text,
    review_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: content_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    content_type text NOT NULL,
    brand_id uuid NOT NULL,
    metrics jsonb NOT NULL,
    performance_score numeric(5,2),
    benchmark_comparison jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: content_assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_assets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    asset_name text NOT NULL,
    asset_type text NOT NULL,
    content_category text,
    status text DEFAULT 'draft'::text NOT NULL,
    primary_content jsonb DEFAULT '{}'::jsonb NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    target_audience text,
    channel_specifications jsonb DEFAULT '{}'::jsonb,
    compliance_notes text,
    performance_prediction jsonb DEFAULT '{}'::jsonb,
    ai_analysis jsonb DEFAULT '{}'::jsonb,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    theme_id uuid,
    intake_context jsonb DEFAULT '{}'::jsonb,
    linked_pi_ids jsonb DEFAULT '[]'::jsonb
);


--
-- Name: content_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    project_name text NOT NULL,
    project_type text DEFAULT 'campaign'::text NOT NULL,
    description text,
    status text DEFAULT 'draft'::text NOT NULL,
    campaign_id uuid,
    theme_id uuid,
    target_audience jsonb DEFAULT '{}'::jsonb,
    therapeutic_area text,
    indication text,
    market jsonb DEFAULT '[]'::jsonb,
    channels jsonb DEFAULT '[]'::jsonb,
    compliance_level text DEFAULT 'standard'::text,
    project_metadata jsonb DEFAULT '{}'::jsonb,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: content_segments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_segments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pi_document_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    segment_text text NOT NULL,
    segment_type text NOT NULL,
    applicable_asset_types text[] DEFAULT '{}'::text[],
    tone text DEFAULT 'professional'::text,
    reading_level text DEFAULT 'college'::text,
    word_count integer,
    linked_claims uuid[] DEFAULT '{}'::uuid[],
    linked_references uuid[] DEFAULT '{}'::uuid[],
    mlr_approved boolean DEFAULT false,
    mlr_approved_by uuid,
    mlr_approved_at timestamp with time zone,
    usage_count integer DEFAULT 0,
    last_used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT content_segments_reading_level_check CHECK ((reading_level = ANY (ARRAY['expert'::text, 'college'::text, 'high_school'::text, 'patient'::text]))),
    CONSTRAINT content_segments_segment_type_check CHECK ((segment_type = ANY (ARRAY['moa'::text, 'efficacy_summary'::text, 'safety_summary'::text, 'dosing_instructions'::text, 'patient_counseling'::text, 'indication_statement'::text]))),
    CONSTRAINT content_segments_tone_check CHECK ((tone = ANY (ARRAY['professional'::text, 'conversational'::text, 'technical'::text, 'patient_friendly'::text])))
);


--
-- Name: content_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    project_id uuid,
    asset_id uuid,
    session_type text NOT NULL,
    session_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    auto_save_data jsonb DEFAULT '{}'::jsonb,
    last_activity timestamp with time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: content_validation_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_validation_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid NOT NULL,
    validation_type text NOT NULL,
    validation_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    overall_status text,
    compliance_score integer,
    issues_count integer DEFAULT 0,
    validated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: content_variations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_variations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid NOT NULL,
    variation_name text NOT NULL,
    variation_type text NOT NULL,
    target_context jsonb DEFAULT '{}'::jsonb NOT NULL,
    content_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    personalization_factors jsonb DEFAULT '{}'::jsonb,
    performance_metrics jsonb DEFAULT '{}'::jsonb,
    is_primary boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: content_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid NOT NULL,
    version_number integer NOT NULL,
    version_name text,
    content_snapshot jsonb NOT NULL,
    change_description text,
    change_type text,
    diff_data jsonb,
    is_current boolean DEFAULT false,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: cross_module_context; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cross_module_context (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    session_id text NOT NULL,
    brand_id uuid NOT NULL,
    context_type text DEFAULT 'initiative'::text NOT NULL,
    context_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    selections jsonb DEFAULT '{}'::jsonb NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    therapeutic_area text
);


--
-- Name: design_handoffs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.design_handoffs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid NOT NULL,
    project_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    handoff_status text DEFAULT 'pending'::text NOT NULL,
    content_context jsonb DEFAULT '{}'::jsonb NOT NULL,
    design_requirements jsonb DEFAULT '{}'::jsonb,
    brand_context jsonb DEFAULT '{}'::jsonb,
    compliance_requirements jsonb DEFAULT '{}'::jsonb,
    design_assets jsonb DEFAULT '{}'::jsonb,
    feedback jsonb DEFAULT '{}'::jsonb,
    timeline jsonb DEFAULT '{}'::jsonb,
    handed_off_by uuid,
    assigned_to uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone
);


--
-- Name: global_taxonomy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.global_taxonomy (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category text NOT NULL,
    taxonomy_level integer DEFAULT 1 NOT NULL,
    taxonomy_path text NOT NULL,
    taxonomy_name text NOT NULL,
    description text,
    parent_id uuid,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: glocal_adaptation_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.glocal_adaptation_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    project_name text NOT NULL,
    project_description text,
    source_content_type text DEFAULT 'email'::text NOT NULL,
    source_content jsonb DEFAULT '{}'::jsonb NOT NULL,
    target_markets jsonb DEFAULT '[]'::jsonb NOT NULL,
    target_languages jsonb DEFAULT '[]'::jsonb NOT NULL,
    therapeutic_area text,
    indication text,
    project_status text DEFAULT 'draft'::text NOT NULL,
    cultural_intelligence_score numeric DEFAULT 0,
    regulatory_compliance_score numeric DEFAULT 0,
    tm_leverage_score numeric DEFAULT 0,
    overall_quality_score numeric DEFAULT 0,
    market_readiness_score numeric DEFAULT 0,
    project_metadata jsonb DEFAULT '{}'::jsonb,
    workflow_state jsonb DEFAULT '{}'::jsonb,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone
);


--
-- Name: glocal_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.glocal_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    metric_type text NOT NULL,
    metric_value numeric NOT NULL,
    metric_context jsonb DEFAULT '{}'::jsonb,
    measurement_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: glocal_content_segments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.glocal_content_segments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    segment_index integer NOT NULL,
    segment_type text NOT NULL,
    segment_name text NOT NULL,
    source_text text NOT NULL,
    adapted_text text,
    complexity_level text DEFAULT 'medium'::text,
    cultural_sensitivity_level text DEFAULT 'medium'::text,
    regulatory_risk_level text DEFAULT 'low'::text,
    tm_match_status text DEFAULT 'pending'::text,
    cultural_review_status text DEFAULT 'pending'::text,
    regulatory_review_status text DEFAULT 'pending'::text,
    tm_confidence_score numeric DEFAULT 0,
    cultural_appropriateness_score numeric DEFAULT 0,
    regulatory_compliance_score numeric DEFAULT 0,
    segment_metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: glocal_cultural_intelligence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.glocal_cultural_intelligence (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    segment_id uuid NOT NULL,
    project_id uuid NOT NULL,
    target_market text NOT NULL,
    target_language text NOT NULL,
    cultural_tone_analysis jsonb DEFAULT '{}'::jsonb,
    formality_recommendations jsonb DEFAULT '{}'::jsonb,
    visual_cultural_guidance jsonb DEFAULT '{}'::jsonb,
    communication_style_insights jsonb DEFAULT '{}'::jsonb,
    cultural_appropriateness_score numeric DEFAULT 0,
    adaptation_quality_score numeric DEFAULT 0,
    market_relevance_score numeric DEFAULT 0,
    adaptation_suggestions jsonb DEFAULT '[]'::jsonb,
    risk_factors jsonb DEFAULT '[]'::jsonb,
    analysis_metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: glocal_regulatory_compliance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.glocal_regulatory_compliance (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    segment_id uuid NOT NULL,
    project_id uuid NOT NULL,
    target_market text NOT NULL,
    regulatory_body text NOT NULL,
    compliance_requirements jsonb DEFAULT '[]'::jsonb,
    fair_balance_assessment jsonb DEFAULT '{}'::jsonb,
    claims_validation jsonb DEFAULT '[]'::jsonb,
    required_disclaimers jsonb DEFAULT '[]'::jsonb,
    compliance_score numeric DEFAULT 0,
    risk_level text DEFAULT 'low'::text,
    compliance_issues jsonb DEFAULT '[]'::jsonb,
    recommendations jsonb DEFAULT '[]'::jsonb,
    compliance_metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: glocal_tm_intelligence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.glocal_tm_intelligence (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    segment_id uuid NOT NULL,
    project_id uuid NOT NULL,
    tm_source_text text NOT NULL,
    tm_target_text text NOT NULL,
    match_score numeric DEFAULT 0 NOT NULL,
    match_type text NOT NULL,
    source_language text NOT NULL,
    target_language text NOT NULL,
    therapeutic_area text,
    domain_context text,
    quality_score numeric DEFAULT 0,
    confidence_level numeric DEFAULT 0,
    human_approval_rating numeric,
    tm_metadata jsonb DEFAULT '{}'::jsonb,
    usage_count integer DEFAULT 0,
    last_used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    exact_match_words integer DEFAULT 0,
    fuzzy_match_words integer DEFAULT 0,
    new_words integer DEFAULT 0,
    leverage_percentage numeric DEFAULT 0,
    ai_medical_accuracy_score numeric DEFAULT 0,
    ai_brand_consistency_score numeric DEFAULT 0,
    ai_cultural_fit_score numeric DEFAULT 0,
    ai_regulatory_risk text,
    ai_reasoning jsonb DEFAULT '[]'::jsonb,
    human_feedback text,
    human_approval_status text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    CONSTRAINT glocal_tm_intelligence_human_approval_status_check CHECK ((human_approval_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'needs_review'::text])))
);


--
-- Name: glocal_workflows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.glocal_workflows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    workflow_name text NOT NULL,
    workflow_type text DEFAULT 'adaptation'::text NOT NULL,
    phase_1_global_context jsonb DEFAULT '{}'::jsonb,
    phase_2_tm_intelligence jsonb DEFAULT '{}'::jsonb,
    phase_3_cultural_intelligence jsonb DEFAULT '{}'::jsonb,
    phase_4_regulatory_compliance jsonb DEFAULT '{}'::jsonb,
    phase_5_quality_assurance jsonb DEFAULT '{}'::jsonb,
    phase_6_dam_handoff jsonb DEFAULT '{}'::jsonb,
    phase_7_integration jsonb DEFAULT '{}'::jsonb,
    current_phase text DEFAULT 'phase_1_global_context'::text,
    workflow_status text DEFAULT 'in_progress'::text NOT NULL,
    workflow_metadata jsonb DEFAULT '{}'::jsonb,
    last_auto_save timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone
);


--
-- Name: guardrail_inheritance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guardrail_inheritance (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    context_type text NOT NULL,
    context_id uuid NOT NULL,
    source_type text NOT NULL,
    source_id uuid NOT NULL,
    rule_category text NOT NULL,
    rule_key text NOT NULL,
    is_inherited boolean DEFAULT true,
    is_overridden boolean DEFAULT false,
    override_reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT guardrail_inheritance_context_type_check CHECK ((context_type = ANY (ARRAY['brand'::text, 'campaign'::text, 'asset'::text]))),
    CONSTRAINT guardrail_inheritance_source_type_check CHECK ((source_type = ANY (ARRAY['brand'::text, 'campaign'::text])))
);


--
-- Name: intelligence_refresh_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intelligence_refresh_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid,
    refresh_type text NOT NULL,
    refresh_scope text NOT NULL,
    sources_checked integer DEFAULT 0 NOT NULL,
    insights_found integer DEFAULT 0 NOT NULL,
    guardrails_updated integer DEFAULT 0 NOT NULL,
    status text NOT NULL,
    error_message text,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    duration_seconds integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT intelligence_refresh_log_refresh_scope_check CHECK ((refresh_scope = ANY (ARRAY['all'::text, 'regulatory'::text, 'competitive'::text, 'clinical'::text, 'market'::text]))),
    CONSTRAINT intelligence_refresh_log_refresh_type_check CHECK ((refresh_type = ANY (ARRAY['manual'::text, 'scheduled'::text, 'on_demand'::text]))),
    CONSTRAINT intelligence_refresh_log_status_check CHECK ((status = ANY (ARRAY['running'::text, 'completed'::text, 'failed'::text])))
);


--
-- Name: localization_agencies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.localization_agencies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    agency_name text NOT NULL,
    agency_type text NOT NULL,
    tier_level text DEFAULT 'standard'::text,
    specializations jsonb DEFAULT '[]'::jsonb NOT NULL,
    language_pairs jsonb DEFAULT '[]'::jsonb NOT NULL,
    regulatory_expertise jsonb DEFAULT '[]'::jsonb,
    capacity_rating integer DEFAULT 50,
    performance_score numeric DEFAULT 0,
    quality_rating numeric DEFAULT 0,
    on_time_delivery_rate numeric DEFAULT 0,
    cost_efficiency_rating numeric DEFAULT 0,
    cultural_expertise jsonb DEFAULT '{}'::jsonb,
    contact_information jsonb DEFAULT '{}'::jsonb,
    contract_terms jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: localization_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.localization_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    localization_project_id uuid NOT NULL,
    market text NOT NULL,
    language text,
    metric_type text NOT NULL,
    metric_value numeric NOT NULL,
    baseline_value numeric,
    measurement_date date DEFAULT CURRENT_DATE NOT NULL,
    context_data jsonb DEFAULT '{}'::jsonb,
    prediction_accuracy numeric,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: localization_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.localization_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    project_name text NOT NULL,
    description text,
    source_content_type text NOT NULL,
    source_content_id uuid,
    target_markets jsonb DEFAULT '[]'::jsonb NOT NULL,
    target_languages jsonb DEFAULT '[]'::jsonb NOT NULL,
    project_type text DEFAULT 'localization'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    priority_level text DEFAULT 'medium'::text,
    business_impact_score integer,
    content_readiness_score integer,
    total_budget numeric,
    estimated_timeline integer,
    actual_timeline integer,
    regulatory_complexity text DEFAULT 'standard'::text,
    cultural_sensitivity_level text DEFAULT 'medium'::text,
    mlr_inheritance jsonb DEFAULT '{}'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    workflow_state jsonb DEFAULT '{}'::jsonb,
    original_project_id uuid,
    copy_number integer DEFAULT 1,
    usage_count integer DEFAULT 0,
    is_template boolean DEFAULT false,
    last_auto_save timestamp with time zone DEFAULT now()
);


--
-- Name: localization_workflows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.localization_workflows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    localization_project_id uuid NOT NULL,
    workflow_name text NOT NULL,
    market text NOT NULL,
    language text NOT NULL,
    assigned_agency_id uuid,
    workflow_type text NOT NULL,
    workflow_status text DEFAULT 'pending'::text NOT NULL,
    priority integer DEFAULT 5,
    estimated_hours integer,
    actual_hours integer,
    estimated_cost numeric,
    actual_cost numeric,
    quality_gates jsonb DEFAULT '[]'::jsonb,
    dependencies jsonb DEFAULT '[]'::jsonb,
    deliverables jsonb DEFAULT '[]'::jsonb,
    feedback jsonb DEFAULT '[]'::jsonb,
    compliance_checkpoints jsonb DEFAULT '[]'::jsonb,
    cultural_adaptations jsonb DEFAULT '{}'::jsonb,
    translation_memory_leverage numeric DEFAULT 0,
    risk_assessment jsonb DEFAULT '{}'::jsonb,
    assigned_to uuid,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    segment_translations jsonb DEFAULT '[]'::jsonb,
    intelligence_data jsonb DEFAULT '{}'::jsonb,
    workflow_progress jsonb DEFAULT '{"translation": {"completed": false, "lastUpdated": null}, "intelligence": {"completed": false, "lastUpdated": null}, "optimization": {"completed": false, "lastUpdated": null}, "marketSelection": {"completed": false, "lastUpdated": null}}'::jsonb,
    last_auto_save timestamp with time zone DEFAULT now()
);


--
-- Name: market_positioning; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.market_positioning (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    therapeutic_area text NOT NULL,
    market text NOT NULL,
    positioning_statement text NOT NULL,
    leadership_claims jsonb DEFAULT '[]'::jsonb NOT NULL,
    differentiation_points jsonb DEFAULT '[]'::jsonb NOT NULL,
    competitive_advantages jsonb DEFAULT '[]'::jsonb NOT NULL,
    market_share_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    growth_trajectory jsonb DEFAULT '{}'::jsonb NOT NULL,
    market_dynamics jsonb DEFAULT '{}'::jsonb NOT NULL,
    unmet_needs jsonb DEFAULT '[]'::jsonb NOT NULL,
    opportunity_areas jsonb DEFAULT '[]'::jsonb NOT NULL,
    positioning_matrix jsonb DEFAULT '{}'::jsonb NOT NULL,
    messaging_hierarchy jsonb DEFAULT '[]'::jsonb NOT NULL,
    proof_points jsonb DEFAULT '[]'::jsonb NOT NULL,
    clinical_evidence jsonb DEFAULT '[]'::jsonb NOT NULL,
    real_world_evidence jsonb DEFAULT '[]'::jsonb NOT NULL,
    economic_value jsonb DEFAULT '{}'::jsonb NOT NULL,
    access_strategy jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid
);


--
-- Name: mlr_analysis_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mlr_analysis_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_asset_id uuid,
    content_hash text NOT NULL,
    analysis_type text NOT NULL,
    results jsonb NOT NULL,
    mlr_readiness_score integer,
    critical_issues_count integer DEFAULT 0,
    warnings_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT mlr_analysis_results_analysis_type_check CHECK ((analysis_type = ANY (ARRAY['claims'::text, 'references'::text, 'regulatory'::text, 'readiness'::text])))
);


--
-- Name: mlr_learning_feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mlr_learning_feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid,
    content_type text NOT NULL,
    pattern_description text NOT NULL,
    issue_category text NOT NULL,
    occurrence_count integer DEFAULT 1,
    last_seen_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewer_name text,
    feedback_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT mlr_learning_feedback_issue_category_check CHECK ((issue_category = ANY (ARRAY['claim'::text, 'reference'::text, 'regulatory'::text, 'style'::text])))
);


--
-- Name: performance_predictions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.performance_predictions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    content_type text NOT NULL,
    prediction_type text NOT NULL,
    predicted_score numeric(5,2),
    confidence_level numeric(5,2),
    prediction_factors jsonb,
    actual_outcome numeric(5,2),
    model_version text DEFAULT 'v1.0'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pharmaceutical_glossary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pharmaceutical_glossary (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    term_source text NOT NULL,
    term_target text NOT NULL,
    source_language text NOT NULL,
    target_language text NOT NULL,
    therapeutic_area text NOT NULL,
    confidence_score integer DEFAULT 100 NOT NULL,
    usage_frequency integer DEFAULT 0 NOT NULL,
    medical_category text DEFAULT 'general'::text NOT NULL,
    regulatory_status text DEFAULT 'approved'::text NOT NULL,
    validation_status text DEFAULT 'validated'::text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: prescribing_information; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prescribing_information (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    drug_name text NOT NULL,
    document_url text NOT NULL,
    parsed_data jsonb DEFAULT '{}'::jsonb,
    parsing_status text DEFAULT 'pending'::text NOT NULL,
    version text,
    error_message text,
    uploaded_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    document_type text DEFAULT 'pi'::text,
    file_path text,
    CONSTRAINT prescribing_information_document_type_check CHECK ((document_type = ANY (ARRAY['pi'::text, 'isi'::text]))),
    CONSTRAINT prescribing_information_parsing_status_check CHECK ((parsing_status = ANY (ARRAY['pending'::text, 'processing'::text, 'completed'::text, 'failed'::text])))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    display_name text,
    email text,
    is_demo_user boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: public_domain_insights; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.public_domain_insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    source_type text NOT NULL,
    source_url text,
    source_name text NOT NULL,
    title text NOT NULL,
    summary text NOT NULL,
    full_content text,
    key_findings jsonb DEFAULT '[]'::jsonb,
    relevance_score numeric(3,2),
    publish_date timestamp with time zone,
    discovered_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    therapeutic_area text,
    market text,
    tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT public_domain_insights_relevance_score_check CHECK (((relevance_score >= (0)::numeric) AND (relevance_score <= (1)::numeric))),
    CONSTRAINT public_domain_insights_source_type_check CHECK ((source_type = ANY (ARRAY['regulatory'::text, 'competitive'::text, 'clinical'::text, 'market'::text, 'industry'::text]))),
    CONSTRAINT public_domain_insights_status_check CHECK ((status = ANY (ARRAY['new'::text, 'reviewed'::text, 'applied'::text, 'archived'::text])))
);


--
-- Name: regional_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regional_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    market text NOT NULL,
    compliance_requirements jsonb,
    review_processes jsonb,
    local_guidelines text,
    language_preferences text[],
    regulatory_contact text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: regulatory_compliance_matrix; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regulatory_compliance_matrix (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    market text NOT NULL,
    therapeutic_area text NOT NULL,
    regulation_category text NOT NULL,
    regulation_rule text NOT NULL,
    rule_description text,
    compliance_pattern text,
    risk_level text DEFAULT 'medium'::text NOT NULL,
    enforcement_authority text,
    penalty_severity text,
    validation_method text DEFAULT 'manual'::text,
    automated_check_logic jsonb DEFAULT '{}'::jsonb,
    exemption_criteria jsonb DEFAULT '[]'::jsonb,
    related_regulations jsonb DEFAULT '[]'::jsonb,
    last_updated_regulation date,
    implementation_notes text,
    audit_trail jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: regulatory_framework; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regulatory_framework (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    market text NOT NULL,
    regulatory_body text NOT NULL,
    therapeutic_area text NOT NULL,
    indication text,
    approval_status text,
    approval_date date,
    regulatory_requirements jsonb DEFAULT '{}'::jsonb NOT NULL,
    compliance_templates jsonb DEFAULT '[]'::jsonb NOT NULL,
    required_disclaimers jsonb DEFAULT '[]'::jsonb NOT NULL,
    fair_balance_requirements jsonb DEFAULT '{}'::jsonb NOT NULL,
    claim_substantiation jsonb DEFAULT '{}'::jsonb NOT NULL,
    rems_requirements jsonb,
    labeling_requirements jsonb DEFAULT '{}'::jsonb NOT NULL,
    promotional_restrictions jsonb DEFAULT '[]'::jsonb NOT NULL,
    mlr_requirements jsonb DEFAULT '{}'::jsonb NOT NULL,
    approval_workflows jsonb DEFAULT '[]'::jsonb NOT NULL,
    submission_deadlines jsonb DEFAULT '{}'::jsonb NOT NULL,
    regulatory_contacts jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid
);


--
-- Name: regulatory_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regulatory_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    indication text NOT NULL,
    market text NOT NULL,
    regulatory_flags jsonb,
    fair_balance_text text,
    boxed_warnings text,
    contraindications text,
    approval_processes jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: rule_conflicts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rule_conflicts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    content_type text NOT NULL,
    conflicting_rules uuid[] NOT NULL,
    conflict_type text NOT NULL,
    resolution_strategy text,
    resolved_by uuid,
    resolution_details jsonb,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: rule_execution_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rule_execution_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    content_type text NOT NULL,
    rule_id uuid NOT NULL,
    rule_name text NOT NULL,
    execution_result text NOT NULL,
    execution_details jsonb,
    execution_time_ms integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: safety_statements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.safety_statements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    isi_document_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    statement_text text NOT NULL,
    statement_type text NOT NULL,
    severity text DEFAULT 'moderate'::text,
    fda_required boolean DEFAULT true,
    placement_rule text,
    applicable_channels text[] DEFAULT '{}'::text[],
    linked_claims uuid[] DEFAULT '{}'::uuid[],
    usage_count integer DEFAULT 0,
    last_used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT safety_statements_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'moderate'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT safety_statements_statement_type_check CHECK ((statement_type = ANY (ARRAY['contraindication'::text, 'warning'::text, 'precaution'::text, 'adverse_reaction'::text, 'boxed_warning'::text])))
);


--
-- Name: smart_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.smart_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    rule_name text NOT NULL,
    rule_type text NOT NULL,
    rule_category text NOT NULL,
    context_filters jsonb,
    conditions jsonb NOT NULL,
    actions jsonb NOT NULL,
    priority integer DEFAULT 100,
    is_active boolean DEFAULT true,
    applies_to text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


--
-- Name: theme_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.theme_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    theme_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    implementation_type text NOT NULL,
    implementation_id uuid NOT NULL,
    asset_type text,
    audience_segment text,
    market text,
    predicted_performance jsonb DEFAULT '{}'::jsonb NOT NULL,
    actual_performance jsonb DEFAULT '{}'::jsonb,
    engagement_metrics jsonb DEFAULT '{}'::jsonb,
    conversion_metrics jsonb DEFAULT '{}'::jsonb,
    mlr_performance jsonb DEFAULT '{}'::jsonb,
    benchmark_performance jsonb DEFAULT '{}'::jsonb,
    competitor_comparison jsonb DEFAULT '{}'::jsonb,
    variant_testing_results jsonb DEFAULT '{}'::jsonb,
    performance_by_period jsonb DEFAULT '{}'::jsonb,
    seasonal_trends jsonb DEFAULT '{}'::jsonb,
    user_feedback jsonb DEFAULT '{}'::jsonb,
    ai_learning_points jsonb DEFAULT '{}'::jsonb,
    improvement_suggestions jsonb DEFAULT '[]'::jsonb,
    measurement_period_start timestamp with time zone,
    measurement_period_end timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    measured_by uuid,
    CONSTRAINT theme_analytics_implementation_type_check CHECK ((implementation_type = ANY (ARRAY['campaign'::text, 'asset'::text, 'test'::text])))
);


--
-- Name: theme_comparisons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.theme_comparisons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    comparison_name text,
    project_context text,
    comparison_criteria jsonb DEFAULT '[]'::jsonb,
    theme_a_id uuid NOT NULL,
    theme_b_id uuid NOT NULL,
    side_by_side_analysis jsonb DEFAULT '{}'::jsonb,
    performance_delta jsonb DEFAULT '{}'::jsonb,
    pros_cons_analysis jsonb DEFAULT '{}'::jsonb,
    risk_assessment jsonb DEFAULT '{}'::jsonb,
    selected_theme_id uuid,
    selection_rationale text,
    decision_factors jsonb DEFAULT '[]'::jsonb,
    confidence_level integer,
    post_decision_notes text,
    outcome_validation jsonb DEFAULT '{}'::jsonb,
    lessons_learned jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    decided_at timestamp with time zone,
    CONSTRAINT theme_comparisons_check CHECK ((theme_a_id <> theme_b_id)),
    CONSTRAINT theme_comparisons_confidence_level_check CHECK (((confidence_level >= 1) AND (confidence_level <= 10)))
);


--
-- Name: theme_intelligence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.theme_intelligence (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    theme_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    intelligence_type text NOT NULL,
    intelligence_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    user_notes text,
    incorporated boolean DEFAULT false,
    incorporated_by uuid,
    incorporated_at timestamp with time zone,
    last_refreshed timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT theme_intelligence_intelligence_type_check CHECK ((intelligence_type = ANY (ARRAY['brand'::text, 'competitive'::text, 'market'::text, 'regulatory'::text, 'public'::text])))
);


--
-- Name: theme_library; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.theme_library (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    key_message text NOT NULL,
    call_to_action text,
    rationale jsonb DEFAULT '{}'::jsonb NOT NULL,
    performance_prediction jsonb DEFAULT '{}'::jsonb NOT NULL,
    data_sources jsonb DEFAULT '[]'::jsonb NOT NULL,
    confidence_score integer DEFAULT 0 NOT NULL,
    target_audience text,
    audience_segments jsonb DEFAULT '[]'::jsonb,
    target_markets jsonb DEFAULT '[]'::jsonb,
    indication text,
    content_suggestions jsonb DEFAULT '{}'::jsonb,
    messaging_framework jsonb DEFAULT '{}'::jsonb,
    regulatory_considerations jsonb DEFAULT '[]'::jsonb,
    status text DEFAULT 'active'::text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    parent_theme_id uuid,
    usage_count integer DEFAULT 0 NOT NULL,
    success_rate numeric(5,2) DEFAULT 0.00,
    avg_engagement_rate numeric(5,2) DEFAULT 0.00,
    last_used_at timestamp with time zone,
    source_intake_id uuid,
    source_campaign_id uuid,
    original_project_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid,
    enrichment_status text DEFAULT 'generated'::text,
    intelligence_layers jsonb DEFAULT '{}'::jsonb,
    workshop_notes jsonb DEFAULT '[]'::jsonb,
    approved_at timestamp with time zone,
    approved_by uuid,
    intelligence_progress integer DEFAULT 0,
    CONSTRAINT theme_library_category_check CHECK ((category = ANY (ARRAY['educational-awareness'::text, 'clinical-evidence'::text, 'patient-centric'::text, 'competitive-positioning'::text, 'engagement-focused'::text, 'professional-clinical'::text]))),
    CONSTRAINT theme_library_confidence_score_check CHECK (((confidence_score >= 0) AND (confidence_score <= 100))),
    CONSTRAINT theme_library_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'archived'::text, 'deprecated'::text])))
);


--
-- Name: theme_usage_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.theme_usage_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    theme_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    usage_type text NOT NULL,
    project_id uuid NOT NULL,
    project_name text NOT NULL,
    project_type text,
    customizations_made jsonb DEFAULT '{}'::jsonb,
    adaptation_reason text,
    success_metrics jsonb DEFAULT '{}'::jsonb,
    failure_points jsonb DEFAULT '[]'::jsonb,
    overall_success boolean,
    success_score integer,
    key_learnings jsonb DEFAULT '[]'::jsonb,
    used_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    created_by uuid,
    CONSTRAINT theme_usage_history_success_score_check CHECK (((success_score >= 1) AND (success_score <= 10))),
    CONSTRAINT theme_usage_history_usage_type_check CHECK ((usage_type = ANY (ARRAY['campaign'::text, 'single-asset'::text, 'test'::text, 'comparison'::text])))
);


--
-- Name: translation_engine_performance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.translation_engine_performance (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    engine_name text NOT NULL,
    source_language text NOT NULL,
    target_language text NOT NULL,
    therapeutic_area text NOT NULL,
    content_type text NOT NULL,
    average_confidence numeric DEFAULT 0 NOT NULL,
    average_accuracy numeric DEFAULT 0 NOT NULL,
    total_translations integer DEFAULT 0 NOT NULL,
    successful_translations integer DEFAULT 0 NOT NULL,
    human_approval_rate numeric DEFAULT 0 NOT NULL,
    cost_per_word numeric,
    avg_processing_time_ms integer,
    last_updated timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: translation_memory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.translation_memory (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    source_text text NOT NULL,
    target_text text NOT NULL,
    source_language text NOT NULL,
    target_language text NOT NULL,
    domain_context text,
    match_type text NOT NULL,
    quality_score integer DEFAULT 0 NOT NULL,
    confidence_level numeric DEFAULT 0,
    usage_count integer DEFAULT 0,
    last_used timestamp with time zone,
    cultural_adaptations jsonb DEFAULT '{}'::jsonb,
    regulatory_notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    asset_id uuid,
    project_id uuid,
    market text
);


--
-- Name: user_brand_access; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_brand_access (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    granted_by uuid
);


--
-- Name: visual_content_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visual_content_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    composed_email_id uuid,
    visual_type text NOT NULL,
    visual_identifier text NOT NULL,
    cultural_review_results jsonb,
    mlr_review_results jsonb,
    overall_compliance_score integer,
    issues jsonb,
    required_changes text[],
    review_status text DEFAULT 'pending'::text,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: agency_collaboration_workflows agency_collaboration_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agency_collaboration_workflows
    ADD CONSTRAINT agency_collaboration_workflows_pkey PRIMARY KEY (id);


--
-- Name: ai_translation_results ai_translation_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_translation_results
    ADD CONSTRAINT ai_translation_results_pkey PRIMARY KEY (id);


--
-- Name: asset_guardrails asset_guardrails_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_guardrails
    ADD CONSTRAINT asset_guardrails_pkey PRIMARY KEY (id);


--
-- Name: asset_themes asset_themes_asset_id_theme_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_themes
    ADD CONSTRAINT asset_themes_asset_id_theme_id_key UNIQUE (asset_id, theme_id);


--
-- Name: asset_themes asset_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_themes
    ADD CONSTRAINT asset_themes_pkey PRIMARY KEY (id);


--
-- Name: audience_segments audience_segments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audience_segments
    ADD CONSTRAINT audience_segments_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: brand_guidelines brand_guidelines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_guidelines
    ADD CONSTRAINT brand_guidelines_pkey PRIMARY KEY (id);


--
-- Name: brand_market_configurations brand_market_configurations_brand_id_market_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_market_configurations
    ADD CONSTRAINT brand_market_configurations_brand_id_market_code_key UNIQUE (brand_id, market_code);


--
-- Name: brand_market_configurations brand_market_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_market_configurations
    ADD CONSTRAINT brand_market_configurations_pkey PRIMARY KEY (id);


--
-- Name: brand_profiles brand_profiles_brand_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_profiles
    ADD CONSTRAINT brand_profiles_brand_name_key UNIQUE (brand_name);


--
-- Name: brand_profiles brand_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_profiles
    ADD CONSTRAINT brand_profiles_pkey PRIMARY KEY (id);


--
-- Name: brand_vision brand_vision_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_vision
    ADD CONSTRAINT brand_vision_pkey PRIMARY KEY (id);


--
-- Name: campaign_guardrails campaign_guardrails_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_guardrails
    ADD CONSTRAINT campaign_guardrails_pkey PRIMARY KEY (id);


--
-- Name: campaign_themes campaign_themes_campaign_id_theme_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_themes
    ADD CONSTRAINT campaign_themes_campaign_id_theme_id_key UNIQUE (campaign_id, theme_id);


--
-- Name: campaign_themes campaign_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_themes
    ADD CONSTRAINT campaign_themes_pkey PRIMARY KEY (id);


--
-- Name: clinical_claims clinical_claims_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinical_claims
    ADD CONSTRAINT clinical_claims_pkey PRIMARY KEY (id);


--
-- Name: clinical_references clinical_references_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinical_references
    ADD CONSTRAINT clinical_references_pkey PRIMARY KEY (id);


--
-- Name: competitive_intelligence_enriched competitive_intelligence_enriched_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competitive_intelligence_enriched
    ADD CONSTRAINT competitive_intelligence_enriched_pkey PRIMARY KEY (id);


--
-- Name: competitive_intelligence competitive_intelligence_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competitive_intelligence
    ADD CONSTRAINT competitive_intelligence_pkey PRIMARY KEY (id);


--
-- Name: competitive_landscape competitive_landscape_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competitive_landscape
    ADD CONSTRAINT competitive_landscape_pkey PRIMARY KEY (id);


--
-- Name: compliance_history compliance_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_history
    ADD CONSTRAINT compliance_history_pkey PRIMARY KEY (id);


--
-- Name: composed_emails composed_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.composed_emails
    ADD CONSTRAINT composed_emails_pkey PRIMARY KEY (id);


--
-- Name: content_analytics content_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_analytics
    ADD CONSTRAINT content_analytics_pkey PRIMARY KEY (id);


--
-- Name: content_assets content_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_assets
    ADD CONSTRAINT content_assets_pkey PRIMARY KEY (id);


--
-- Name: content_projects content_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_projects
    ADD CONSTRAINT content_projects_pkey PRIMARY KEY (id);


--
-- Name: content_segments content_segments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_segments
    ADD CONSTRAINT content_segments_pkey PRIMARY KEY (id);


--
-- Name: content_sessions content_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_sessions
    ADD CONSTRAINT content_sessions_pkey PRIMARY KEY (id);


--
-- Name: content_sessions content_sessions_unique_user_project_asset; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_sessions
    ADD CONSTRAINT content_sessions_unique_user_project_asset UNIQUE (user_id, project_id, asset_id);


--
-- Name: content_validation_results content_validation_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_validation_results
    ADD CONSTRAINT content_validation_results_pkey PRIMARY KEY (id);


--
-- Name: content_variations content_variations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_variations
    ADD CONSTRAINT content_variations_pkey PRIMARY KEY (id);


--
-- Name: content_versions content_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_versions
    ADD CONSTRAINT content_versions_pkey PRIMARY KEY (id);


--
-- Name: cross_module_context cross_module_context_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cross_module_context
    ADD CONSTRAINT cross_module_context_pkey PRIMARY KEY (id);


--
-- Name: cross_module_context cross_module_context_unique_user_session_type; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cross_module_context
    ADD CONSTRAINT cross_module_context_unique_user_session_type UNIQUE (user_id, session_id, context_type);


--
-- Name: cross_module_context cross_module_context_user_id_session_id_context_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cross_module_context
    ADD CONSTRAINT cross_module_context_user_id_session_id_context_type_key UNIQUE (user_id, session_id, context_type);


--
-- Name: design_handoffs design_handoffs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.design_handoffs
    ADD CONSTRAINT design_handoffs_pkey PRIMARY KEY (id);


--
-- Name: global_taxonomy global_taxonomy_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.global_taxonomy
    ADD CONSTRAINT global_taxonomy_pkey PRIMARY KEY (id);


--
-- Name: glocal_adaptation_projects glocal_adaptation_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_adaptation_projects
    ADD CONSTRAINT glocal_adaptation_projects_pkey PRIMARY KEY (id);


--
-- Name: glocal_analytics glocal_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_analytics
    ADD CONSTRAINT glocal_analytics_pkey PRIMARY KEY (id);


--
-- Name: glocal_content_segments glocal_content_segments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_content_segments
    ADD CONSTRAINT glocal_content_segments_pkey PRIMARY KEY (id);


--
-- Name: glocal_cultural_intelligence glocal_cultural_intelligence_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_cultural_intelligence
    ADD CONSTRAINT glocal_cultural_intelligence_pkey PRIMARY KEY (id);


--
-- Name: glocal_regulatory_compliance glocal_regulatory_compliance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_regulatory_compliance
    ADD CONSTRAINT glocal_regulatory_compliance_pkey PRIMARY KEY (id);


--
-- Name: glocal_tm_intelligence glocal_tm_intelligence_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_tm_intelligence
    ADD CONSTRAINT glocal_tm_intelligence_pkey PRIMARY KEY (id);


--
-- Name: glocal_workflows glocal_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_workflows
    ADD CONSTRAINT glocal_workflows_pkey PRIMARY KEY (id);


--
-- Name: glocal_workflows glocal_workflows_project_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_workflows
    ADD CONSTRAINT glocal_workflows_project_id_unique UNIQUE (project_id);


--
-- Name: guardrail_inheritance guardrail_inheritance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guardrail_inheritance
    ADD CONSTRAINT guardrail_inheritance_pkey PRIMARY KEY (id);


--
-- Name: intelligence_refresh_log intelligence_refresh_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intelligence_refresh_log
    ADD CONSTRAINT intelligence_refresh_log_pkey PRIMARY KEY (id);


--
-- Name: localization_agencies localization_agencies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.localization_agencies
    ADD CONSTRAINT localization_agencies_pkey PRIMARY KEY (id);


--
-- Name: localization_analytics localization_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.localization_analytics
    ADD CONSTRAINT localization_analytics_pkey PRIMARY KEY (id);


--
-- Name: localization_projects localization_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.localization_projects
    ADD CONSTRAINT localization_projects_pkey PRIMARY KEY (id);


--
-- Name: localization_workflows localization_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.localization_workflows
    ADD CONSTRAINT localization_workflows_pkey PRIMARY KEY (id);


--
-- Name: market_positioning market_positioning_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_positioning
    ADD CONSTRAINT market_positioning_pkey PRIMARY KEY (id);


--
-- Name: mlr_analysis_results mlr_analysis_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlr_analysis_results
    ADD CONSTRAINT mlr_analysis_results_pkey PRIMARY KEY (id);


--
-- Name: mlr_learning_feedback mlr_learning_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlr_learning_feedback
    ADD CONSTRAINT mlr_learning_feedback_pkey PRIMARY KEY (id);


--
-- Name: performance_predictions performance_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_predictions
    ADD CONSTRAINT performance_predictions_pkey PRIMARY KEY (id);


--
-- Name: pharmaceutical_glossary pharmaceutical_glossary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pharmaceutical_glossary
    ADD CONSTRAINT pharmaceutical_glossary_pkey PRIMARY KEY (id);


--
-- Name: prescribing_information prescribing_information_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescribing_information
    ADD CONSTRAINT prescribing_information_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: public_domain_insights public_domain_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.public_domain_insights
    ADD CONSTRAINT public_domain_insights_pkey PRIMARY KEY (id);


--
-- Name: regional_settings regional_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regional_settings
    ADD CONSTRAINT regional_settings_pkey PRIMARY KEY (id);


--
-- Name: regulatory_compliance_matrix regulatory_compliance_matrix_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulatory_compliance_matrix
    ADD CONSTRAINT regulatory_compliance_matrix_pkey PRIMARY KEY (id);


--
-- Name: regulatory_framework regulatory_framework_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulatory_framework
    ADD CONSTRAINT regulatory_framework_pkey PRIMARY KEY (id);


--
-- Name: regulatory_profiles regulatory_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulatory_profiles
    ADD CONSTRAINT regulatory_profiles_pkey PRIMARY KEY (id);


--
-- Name: rule_conflicts rule_conflicts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rule_conflicts
    ADD CONSTRAINT rule_conflicts_pkey PRIMARY KEY (id);


--
-- Name: rule_execution_log rule_execution_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rule_execution_log
    ADD CONSTRAINT rule_execution_log_pkey PRIMARY KEY (id);


--
-- Name: safety_statements safety_statements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safety_statements
    ADD CONSTRAINT safety_statements_pkey PRIMARY KEY (id);


--
-- Name: smart_rules smart_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smart_rules
    ADD CONSTRAINT smart_rules_pkey PRIMARY KEY (id);


--
-- Name: theme_analytics theme_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_analytics
    ADD CONSTRAINT theme_analytics_pkey PRIMARY KEY (id);


--
-- Name: theme_comparisons theme_comparisons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_comparisons
    ADD CONSTRAINT theme_comparisons_pkey PRIMARY KEY (id);


--
-- Name: theme_intelligence theme_intelligence_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_intelligence
    ADD CONSTRAINT theme_intelligence_pkey PRIMARY KEY (id);


--
-- Name: theme_library theme_library_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_library
    ADD CONSTRAINT theme_library_pkey PRIMARY KEY (id);


--
-- Name: theme_usage_history theme_usage_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_usage_history
    ADD CONSTRAINT theme_usage_history_pkey PRIMARY KEY (id);


--
-- Name: translation_engine_performance translation_engine_performance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translation_engine_performance
    ADD CONSTRAINT translation_engine_performance_pkey PRIMARY KEY (id);


--
-- Name: translation_memory translation_memory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translation_memory
    ADD CONSTRAINT translation_memory_pkey PRIMARY KEY (id);


--
-- Name: content_sessions unique_user_asset_session_type; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_sessions
    ADD CONSTRAINT unique_user_asset_session_type UNIQUE (user_id, asset_id, session_type);


--
-- Name: user_brand_access user_brand_access_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_brand_access
    ADD CONSTRAINT user_brand_access_pkey PRIMARY KEY (id);


--
-- Name: user_brand_access user_brand_access_user_id_brand_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_brand_access
    ADD CONSTRAINT user_brand_access_user_id_brand_id_key UNIQUE (user_id, brand_id);


--
-- Name: visual_content_reviews visual_content_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visual_content_reviews
    ADD CONSTRAINT visual_content_reviews_pkey PRIMARY KEY (id);


--
-- Name: idx_agency_workflows_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_agency_workflows_project ON public.agency_collaboration_workflows USING btree (localization_project_id);


--
-- Name: idx_ai_translation_results_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_translation_results_project ON public.ai_translation_results USING btree (project_id, asset_id);


--
-- Name: idx_ai_translation_results_quality; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_translation_results_quality ON public.ai_translation_results USING btree (overall_quality_score DESC);


--
-- Name: idx_asset_guardrails_asset_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_asset_guardrails_asset_id ON public.asset_guardrails USING btree (asset_id);


--
-- Name: idx_asset_guardrails_asset_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_asset_guardrails_asset_type ON public.asset_guardrails USING btree (asset_type);


--
-- Name: idx_asset_guardrails_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_asset_guardrails_brand_id ON public.asset_guardrails USING btree (brand_id);


--
-- Name: idx_asset_guardrails_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_asset_guardrails_campaign_id ON public.asset_guardrails USING btree (campaign_id);


--
-- Name: idx_asset_themes_asset; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_asset_themes_asset ON public.asset_themes USING btree (asset_id);


--
-- Name: idx_asset_themes_theme; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_asset_themes_theme ON public.asset_themes USING btree (theme_id);


--
-- Name: idx_brand_market_configs_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_brand_market_configs_active ON public.brand_market_configurations USING btree (brand_id, is_active);


--
-- Name: idx_brand_market_configs_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_brand_market_configs_brand_id ON public.brand_market_configurations USING btree (brand_id);


--
-- Name: idx_campaign_guardrails_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_guardrails_brand_id ON public.campaign_guardrails USING btree (brand_id);


--
-- Name: idx_campaign_guardrails_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_guardrails_campaign_id ON public.campaign_guardrails USING btree (campaign_id);


--
-- Name: idx_campaign_themes_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_themes_campaign ON public.campaign_themes USING btree (campaign_id);


--
-- Name: idx_campaign_themes_theme; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_themes_theme ON public.campaign_themes USING btree (theme_id);


--
-- Name: idx_clinical_claims_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinical_claims_brand ON public.clinical_claims USING btree (brand_id, claim_type, review_status);


--
-- Name: idx_clinical_claims_pi_doc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinical_claims_pi_doc ON public.clinical_claims USING btree (pi_document_id);


--
-- Name: idx_clinical_references_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinical_references_brand ON public.clinical_references USING btree (brand_id);


--
-- Name: idx_clinical_references_claim; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinical_references_claim ON public.clinical_references USING btree (claim_id);


--
-- Name: idx_competitive_intelligence_enriched_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_competitive_intelligence_enriched_brand ON public.competitive_intelligence_enriched USING btree (brand_id);


--
-- Name: idx_competitive_intelligence_enriched_threat; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_competitive_intelligence_enriched_threat ON public.competitive_intelligence_enriched USING btree (threat_level);


--
-- Name: idx_competitive_intelligence_enriched_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_competitive_intelligence_enriched_type ON public.competitive_intelligence_enriched USING btree (intelligence_type);


--
-- Name: idx_compliance_history_checked_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_compliance_history_checked_at ON public.compliance_history USING btree (checked_at);


--
-- Name: idx_compliance_history_content; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_compliance_history_content ON public.compliance_history USING btree (content_type, content_id);


--
-- Name: idx_composed_emails_asset; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_composed_emails_asset ON public.composed_emails USING btree (asset_id);


--
-- Name: idx_composed_emails_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_composed_emails_brand ON public.composed_emails USING btree (brand_id);


--
-- Name: idx_composed_emails_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_composed_emails_status ON public.composed_emails USING btree (approval_status);


--
-- Name: idx_content_analytics_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_analytics_brand ON public.content_analytics USING btree (brand_id);


--
-- Name: idx_content_assets_asset_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_assets_asset_type ON public.content_assets USING btree (asset_type);


--
-- Name: idx_content_assets_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_assets_brand_id ON public.content_assets USING btree (brand_id);


--
-- Name: idx_content_assets_intake_context; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_assets_intake_context ON public.content_assets USING gin (intake_context) WHERE (intake_context IS NOT NULL);


--
-- Name: idx_content_assets_linked_pi; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_assets_linked_pi ON public.content_assets USING gin (linked_pi_ids);


--
-- Name: idx_content_assets_project_asset_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_assets_project_asset_type ON public.content_assets USING btree (project_id, asset_type);


--
-- Name: idx_content_assets_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_assets_project_id ON public.content_assets USING btree (project_id);


--
-- Name: idx_content_assets_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_assets_status ON public.content_assets USING btree (status);


--
-- Name: idx_content_assets_theme_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_assets_theme_id ON public.content_assets USING btree (theme_id) WHERE (theme_id IS NOT NULL);


--
-- Name: idx_content_projects_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_projects_brand_id ON public.content_projects USING btree (brand_id);


--
-- Name: idx_content_projects_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_projects_created_by ON public.content_projects USING btree (created_by);


--
-- Name: idx_content_projects_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_projects_status ON public.content_projects USING btree (status);


--
-- Name: idx_content_segments_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_segments_brand ON public.content_segments USING btree (brand_id, segment_type);


--
-- Name: idx_content_segments_pi_doc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_segments_pi_doc ON public.content_segments USING btree (pi_document_id);


--
-- Name: idx_content_sessions_asset_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_sessions_asset_id ON public.content_sessions USING btree (asset_id);


--
-- Name: idx_content_sessions_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_sessions_is_active ON public.content_sessions USING btree (is_active);


--
-- Name: idx_content_sessions_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_sessions_lookup ON public.content_sessions USING btree (user_id, is_active, last_activity DESC);


--
-- Name: idx_content_sessions_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_sessions_project_id ON public.content_sessions USING btree (project_id);


--
-- Name: idx_content_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_sessions_user_id ON public.content_sessions USING btree (user_id);


--
-- Name: idx_content_variations_asset_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_variations_asset_id ON public.content_variations USING btree (asset_id);


--
-- Name: idx_content_variations_variation_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_variations_variation_type ON public.content_variations USING btree (variation_type);


--
-- Name: idx_content_versions_asset_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_versions_asset_id ON public.content_versions USING btree (asset_id);


--
-- Name: idx_content_versions_is_current; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_versions_is_current ON public.content_versions USING btree (is_current);


--
-- Name: idx_cross_module_context_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cross_module_context_active ON public.cross_module_context USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_cross_module_context_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cross_module_context_lookup ON public.cross_module_context USING btree (user_id, brand_id, is_active, updated_at DESC);


--
-- Name: idx_cross_module_context_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cross_module_context_session ON public.cross_module_context USING btree (session_id);


--
-- Name: idx_cross_module_context_therapeutic_area; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cross_module_context_therapeutic_area ON public.cross_module_context USING btree (brand_id, therapeutic_area);


--
-- Name: idx_cross_module_context_user_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cross_module_context_user_brand ON public.cross_module_context USING btree (user_id, brand_id);


--
-- Name: idx_design_handoffs_asset_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_design_handoffs_asset_id ON public.design_handoffs USING btree (asset_id);


--
-- Name: idx_design_handoffs_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_design_handoffs_project_id ON public.design_handoffs USING btree (project_id);


--
-- Name: idx_design_handoffs_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_design_handoffs_status ON public.design_handoffs USING btree (handoff_status);


--
-- Name: idx_engine_performance_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_engine_performance_lookup ON public.translation_engine_performance USING btree (engine_name, source_language, target_language);


--
-- Name: idx_global_taxonomy_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_global_taxonomy_active ON public.global_taxonomy USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_global_taxonomy_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_global_taxonomy_category ON public.global_taxonomy USING btree (category);


--
-- Name: idx_global_taxonomy_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_global_taxonomy_parent ON public.global_taxonomy USING btree (parent_id);


--
-- Name: idx_glocal_analytics_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_glocal_analytics_project ON public.glocal_analytics USING btree (project_id);


--
-- Name: idx_glocal_cultural_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_glocal_cultural_project ON public.glocal_cultural_intelligence USING btree (project_id);


--
-- Name: idx_glocal_cultural_segment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_glocal_cultural_segment ON public.glocal_cultural_intelligence USING btree (segment_id);


--
-- Name: idx_glocal_regulatory_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_glocal_regulatory_project ON public.glocal_regulatory_compliance USING btree (project_id);


--
-- Name: idx_glocal_regulatory_segment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_glocal_regulatory_segment ON public.glocal_regulatory_compliance USING btree (segment_id);


--
-- Name: idx_glocal_segments_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_glocal_segments_project ON public.glocal_content_segments USING btree (project_id);


--
-- Name: idx_glocal_tm_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_glocal_tm_project ON public.glocal_tm_intelligence USING btree (project_id);


--
-- Name: idx_glocal_tm_segment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_glocal_tm_segment ON public.glocal_tm_intelligence USING btree (segment_id);


--
-- Name: idx_glocal_workflows_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_glocal_workflows_project ON public.glocal_workflows USING btree (project_id);


--
-- Name: idx_guardrail_inheritance_context; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_guardrail_inheritance_context ON public.guardrail_inheritance USING btree (context_type, context_id);


--
-- Name: idx_guardrail_inheritance_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_guardrail_inheritance_source ON public.guardrail_inheritance USING btree (source_type, source_id);


--
-- Name: idx_intelligence_refresh_log_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_intelligence_refresh_log_brand ON public.intelligence_refresh_log USING btree (brand_id);


--
-- Name: idx_intelligence_refresh_log_started; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_intelligence_refresh_log_started ON public.intelligence_refresh_log USING btree (started_at DESC);


--
-- Name: idx_localization_agencies_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_agencies_active ON public.localization_agencies USING btree (is_active);


--
-- Name: idx_localization_agencies_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_agencies_brand_id ON public.localization_agencies USING btree (brand_id);


--
-- Name: idx_localization_analytics_metric; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_analytics_metric ON public.localization_analytics USING btree (metric_type, measurement_date);


--
-- Name: idx_localization_analytics_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_analytics_project ON public.localization_analytics USING btree (localization_project_id);


--
-- Name: idx_localization_projects_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_projects_brand_id ON public.localization_projects USING btree (brand_id);


--
-- Name: idx_localization_projects_last_auto_save; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_projects_last_auto_save ON public.localization_projects USING btree (last_auto_save DESC);


--
-- Name: idx_localization_projects_original_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_projects_original_id ON public.localization_projects USING btree (original_project_id);


--
-- Name: idx_localization_projects_source_content; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_projects_source_content ON public.localization_projects USING btree (source_content_type, source_content_id);


--
-- Name: idx_localization_projects_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_projects_status ON public.localization_projects USING btree (status);


--
-- Name: idx_localization_projects_usage_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_projects_usage_count ON public.localization_projects USING btree (usage_count DESC);


--
-- Name: idx_localization_projects_workflow_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_projects_workflow_state ON public.localization_projects USING gin (workflow_state);


--
-- Name: idx_localization_workflows_agency; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_workflows_agency ON public.localization_workflows USING btree (assigned_agency_id);


--
-- Name: idx_localization_workflows_intelligence_data; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_workflows_intelligence_data ON public.localization_workflows USING gin (intelligence_data);


--
-- Name: idx_localization_workflows_last_auto_save; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_workflows_last_auto_save ON public.localization_workflows USING btree (last_auto_save DESC);


--
-- Name: idx_localization_workflows_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_workflows_project_id ON public.localization_workflows USING btree (localization_project_id);


--
-- Name: idx_localization_workflows_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_localization_workflows_status ON public.localization_workflows USING btree (workflow_status);


--
-- Name: idx_mlr_analysis_content_asset; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mlr_analysis_content_asset ON public.mlr_analysis_results USING btree (content_asset_id);


--
-- Name: idx_mlr_analysis_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mlr_analysis_hash ON public.mlr_analysis_results USING btree (content_hash);


--
-- Name: idx_mlr_analysis_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mlr_analysis_type ON public.mlr_analysis_results USING btree (analysis_type);


--
-- Name: idx_mlr_learning_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mlr_learning_brand ON public.mlr_learning_feedback USING btree (brand_id);


--
-- Name: idx_mlr_learning_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mlr_learning_category ON public.mlr_learning_feedback USING btree (issue_category);


--
-- Name: idx_performance_predictions_content; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_performance_predictions_content ON public.performance_predictions USING btree (content_id, content_type);


--
-- Name: idx_pharmaceutical_glossary_brand_lang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pharmaceutical_glossary_brand_lang ON public.pharmaceutical_glossary USING btree (brand_id, source_language, target_language);


--
-- Name: idx_pharmaceutical_glossary_therapeutic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pharmaceutical_glossary_therapeutic ON public.pharmaceutical_glossary USING btree (therapeutic_area);


--
-- Name: idx_prescribing_info_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prescribing_info_brand ON public.prescribing_information USING btree (brand_id);


--
-- Name: idx_prescribing_info_brand_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prescribing_info_brand_type ON public.prescribing_information USING btree (brand_id, document_type, parsing_status);


--
-- Name: idx_prescribing_info_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prescribing_info_status ON public.prescribing_information USING btree (parsing_status);


--
-- Name: idx_prescribing_information_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prescribing_information_brand_id ON public.prescribing_information USING btree (brand_id);


--
-- Name: idx_prescribing_information_parsing_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prescribing_information_parsing_status ON public.prescribing_information USING btree (parsing_status);


--
-- Name: idx_public_domain_insights_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_public_domain_insights_brand ON public.public_domain_insights USING btree (brand_id);


--
-- Name: idx_public_domain_insights_discovered; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_public_domain_insights_discovered ON public.public_domain_insights USING btree (discovered_at DESC);


--
-- Name: idx_public_domain_insights_source_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_public_domain_insights_source_type ON public.public_domain_insights USING btree (source_type);


--
-- Name: idx_public_domain_insights_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_public_domain_insights_status ON public.public_domain_insights USING btree (status);


--
-- Name: idx_regulatory_compliance_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_regulatory_compliance_brand ON public.regulatory_compliance_matrix USING btree (brand_id);


--
-- Name: idx_regulatory_compliance_market; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_regulatory_compliance_market ON public.regulatory_compliance_matrix USING btree (market, therapeutic_area);


--
-- Name: idx_rule_conflicts_content; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rule_conflicts_content ON public.rule_conflicts USING btree (content_id, content_type);


--
-- Name: idx_rule_execution_content; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rule_execution_content ON public.rule_execution_log USING btree (content_id, content_type);


--
-- Name: idx_safety_statements_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safety_statements_brand ON public.safety_statements USING btree (brand_id, statement_type);


--
-- Name: idx_safety_statements_isi_doc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_safety_statements_isi_doc ON public.safety_statements USING btree (isi_document_id);


--
-- Name: idx_smart_rules_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_smart_rules_brand_id ON public.smart_rules USING btree (brand_id);


--
-- Name: idx_smart_rules_type_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_smart_rules_type_category ON public.smart_rules USING btree (rule_type, rule_category);


--
-- Name: idx_theme_analytics_theme; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_theme_analytics_theme ON public.theme_analytics USING btree (theme_id);


--
-- Name: idx_theme_comparisons_themes; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_theme_comparisons_themes ON public.theme_comparisons USING btree (theme_a_id, theme_b_id);


--
-- Name: idx_theme_intelligence_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_theme_intelligence_brand ON public.theme_intelligence USING btree (brand_id);


--
-- Name: idx_theme_intelligence_theme; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_theme_intelligence_theme ON public.theme_intelligence USING btree (theme_id);


--
-- Name: idx_theme_intelligence_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_theme_intelligence_type ON public.theme_intelligence USING btree (intelligence_type);


--
-- Name: idx_theme_library_brand_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_theme_library_brand_status ON public.theme_library USING btree (brand_id, status);


--
-- Name: idx_theme_library_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_theme_library_category ON public.theme_library USING btree (category);


--
-- Name: idx_theme_library_success_rate; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_theme_library_success_rate ON public.theme_library USING btree (success_rate DESC);


--
-- Name: idx_theme_library_usage_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_theme_library_usage_count ON public.theme_library USING btree (usage_count DESC);


--
-- Name: idx_theme_usage_history_theme; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_theme_usage_history_theme ON public.theme_usage_history USING btree (theme_id);


--
-- Name: idx_tm_intelligence_approval_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tm_intelligence_approval_status ON public.glocal_tm_intelligence USING btree (human_approval_status);


--
-- Name: idx_tm_intelligence_segment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tm_intelligence_segment_id ON public.glocal_tm_intelligence USING btree (segment_id);


--
-- Name: idx_translation_memory_asset; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_translation_memory_asset ON public.translation_memory USING btree (asset_id, market) WHERE (asset_id IS NOT NULL);


--
-- Name: idx_translation_memory_brand_domain; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_translation_memory_brand_domain ON public.translation_memory USING btree (brand_id, domain_context);


--
-- Name: idx_translation_memory_brand_languages; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_translation_memory_brand_languages ON public.translation_memory USING btree (brand_id, source_language, target_language);


--
-- Name: idx_translation_memory_languages; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_translation_memory_languages ON public.translation_memory USING btree (source_language, target_language);


--
-- Name: idx_translation_memory_source_text; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_translation_memory_source_text ON public.translation_memory USING gin (to_tsvector('english'::regconfig, source_text));


--
-- Name: idx_translation_memory_text_search; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_translation_memory_text_search ON public.translation_memory USING gin (to_tsvector('english'::regconfig, source_text));


--
-- Name: idx_validation_results_asset_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_validation_results_asset_id ON public.content_validation_results USING btree (asset_id);


--
-- Name: idx_validation_results_overall_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_validation_results_overall_status ON public.content_validation_results USING btree (overall_status);


--
-- Name: idx_validation_results_validation_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_validation_results_validation_type ON public.content_validation_results USING btree (validation_type);


--
-- Name: idx_visual_reviews_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visual_reviews_email ON public.visual_content_reviews USING btree (composed_email_id);


--
-- Name: idx_visual_reviews_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visual_reviews_status ON public.visual_content_reviews USING btree (review_status);


--
-- Name: theme_intelligence theme_intelligence_incorporated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER theme_intelligence_incorporated AFTER INSERT OR UPDATE ON public.theme_intelligence FOR EACH ROW EXECUTE FUNCTION public.update_theme_enrichment_status();


--
-- Name: agency_collaboration_workflows update_agency_workflows_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_agency_workflows_updated_at BEFORE UPDATE ON public.agency_collaboration_workflows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ai_translation_results update_ai_translation_results_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_ai_translation_results_updated_at BEFORE UPDATE ON public.ai_translation_results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: asset_guardrails update_asset_guardrails_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_asset_guardrails_updated_at BEFORE UPDATE ON public.asset_guardrails FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: asset_themes update_asset_themes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_asset_themes_updated_at BEFORE UPDATE ON public.asset_themes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: audience_segments update_audience_segments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_audience_segments_updated_at BEFORE UPDATE ON public.audience_segments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: brand_guidelines update_brand_guidelines_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_brand_guidelines_updated_at BEFORE UPDATE ON public.brand_guidelines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: brand_profiles update_brand_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON public.brand_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: brand_vision update_brand_vision_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_brand_vision_updated_at BEFORE UPDATE ON public.brand_vision FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: campaign_guardrails update_campaign_guardrails_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_campaign_guardrails_updated_at BEFORE UPDATE ON public.campaign_guardrails FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: campaign_themes update_campaign_themes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_campaign_themes_updated_at BEFORE UPDATE ON public.campaign_themes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: clinical_claims update_clinical_claims_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_clinical_claims_updated_at BEFORE UPDATE ON public.clinical_claims FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: clinical_references update_clinical_references_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_clinical_references_updated_at BEFORE UPDATE ON public.clinical_references FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: competitive_intelligence_enriched update_competitive_intelligence_enriched_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_competitive_intelligence_enriched_updated_at BEFORE UPDATE ON public.competitive_intelligence_enriched FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: competitive_intelligence update_competitive_intelligence_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_competitive_intelligence_updated_at BEFORE UPDATE ON public.competitive_intelligence FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: competitive_landscape update_competitive_landscape_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_competitive_landscape_updated_at BEFORE UPDATE ON public.competitive_landscape FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_analytics update_content_analytics_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_content_analytics_updated_at BEFORE UPDATE ON public.content_analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_assets update_content_assets_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_content_assets_updated_at BEFORE UPDATE ON public.content_assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_projects update_content_projects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_content_projects_updated_at BEFORE UPDATE ON public.content_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_segments update_content_segments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_content_segments_updated_at BEFORE UPDATE ON public.content_segments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_variations update_content_variations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_content_variations_updated_at BEFORE UPDATE ON public.content_variations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: cross_module_context update_cross_module_context_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_cross_module_context_updated_at BEFORE UPDATE ON public.cross_module_context FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: design_handoffs update_design_handoffs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_design_handoffs_updated_at BEFORE UPDATE ON public.design_handoffs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: glocal_cultural_intelligence update_glocal_cultural_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_glocal_cultural_updated_at BEFORE UPDATE ON public.glocal_cultural_intelligence FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: glocal_adaptation_projects update_glocal_projects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_glocal_projects_updated_at BEFORE UPDATE ON public.glocal_adaptation_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: glocal_regulatory_compliance update_glocal_regulatory_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_glocal_regulatory_updated_at BEFORE UPDATE ON public.glocal_regulatory_compliance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: glocal_content_segments update_glocal_segments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_glocal_segments_updated_at BEFORE UPDATE ON public.glocal_content_segments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: glocal_workflows update_glocal_workflows_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_glocal_workflows_updated_at BEFORE UPDATE ON public.glocal_workflows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: guardrail_inheritance update_guardrail_inheritance_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_guardrail_inheritance_updated_at BEFORE UPDATE ON public.guardrail_inheritance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: localization_agencies update_localization_agencies_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_localization_agencies_updated_at BEFORE UPDATE ON public.localization_agencies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: localization_projects update_localization_projects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_localization_projects_updated_at BEFORE UPDATE ON public.localization_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: localization_workflows update_localization_workflows_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_localization_workflows_updated_at BEFORE UPDATE ON public.localization_workflows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: market_positioning update_market_positioning_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_market_positioning_updated_at BEFORE UPDATE ON public.market_positioning FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: mlr_analysis_results update_mlr_analysis_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_mlr_analysis_updated_at BEFORE UPDATE ON public.mlr_analysis_results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: mlr_learning_feedback update_mlr_learning_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_mlr_learning_updated_at BEFORE UPDATE ON public.mlr_learning_feedback FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: performance_predictions update_performance_predictions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_performance_predictions_updated_at BEFORE UPDATE ON public.performance_predictions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: pharmaceutical_glossary update_pharmaceutical_glossary_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_pharmaceutical_glossary_updated_at BEFORE UPDATE ON public.pharmaceutical_glossary FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: prescribing_information update_prescribing_information_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_prescribing_information_updated_at BEFORE UPDATE ON public.prescribing_information FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: public_domain_insights update_public_domain_insights_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_public_domain_insights_updated_at BEFORE UPDATE ON public.public_domain_insights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: regional_settings update_regional_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_regional_settings_updated_at BEFORE UPDATE ON public.regional_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: regulatory_compliance_matrix update_regulatory_compliance_matrix_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_regulatory_compliance_matrix_updated_at BEFORE UPDATE ON public.regulatory_compliance_matrix FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: regulatory_framework update_regulatory_framework_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_regulatory_framework_updated_at BEFORE UPDATE ON public.regulatory_framework FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: regulatory_profiles update_regulatory_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_regulatory_profiles_updated_at BEFORE UPDATE ON public.regulatory_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: safety_statements update_safety_statements_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_safety_statements_updated_at BEFORE UPDATE ON public.safety_statements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: smart_rules update_smart_rules_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_smart_rules_updated_at BEFORE UPDATE ON public.smart_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: theme_analytics update_theme_analytics_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_theme_analytics_updated_at BEFORE UPDATE ON public.theme_analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: theme_comparisons update_theme_comparisons_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_theme_comparisons_updated_at BEFORE UPDATE ON public.theme_comparisons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: theme_intelligence update_theme_intelligence_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_theme_intelligence_updated_at BEFORE UPDATE ON public.theme_intelligence FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: theme_library update_theme_library_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_theme_library_updated_at BEFORE UPDATE ON public.theme_library FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: translation_memory update_translation_memory_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_translation_memory_updated_at BEFORE UPDATE ON public.translation_memory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: cross_module_context validate_theme_compatibility_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_theme_compatibility_trigger BEFORE INSERT OR UPDATE ON public.cross_module_context FOR EACH ROW EXECUTE FUNCTION public.validate_cross_module_theme_compatibility();


--
-- Name: asset_themes asset_themes_campaign_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_themes
    ADD CONSTRAINT asset_themes_campaign_theme_id_fkey FOREIGN KEY (campaign_theme_id) REFERENCES public.campaign_themes(id);


--
-- Name: asset_themes asset_themes_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_themes
    ADD CONSTRAINT asset_themes_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES public.theme_library(id) ON DELETE CASCADE;


--
-- Name: brand_guidelines brand_guidelines_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_guidelines
    ADD CONSTRAINT brand_guidelines_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: brand_market_configurations brand_market_configurations_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_market_configurations
    ADD CONSTRAINT brand_market_configurations_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: campaign_themes campaign_themes_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_themes
    ADD CONSTRAINT campaign_themes_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES public.theme_library(id) ON DELETE CASCADE;


--
-- Name: clinical_claims clinical_claims_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinical_claims
    ADD CONSTRAINT clinical_claims_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: clinical_claims clinical_claims_pi_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinical_claims
    ADD CONSTRAINT clinical_claims_pi_document_id_fkey FOREIGN KEY (pi_document_id) REFERENCES public.prescribing_information(id) ON DELETE CASCADE;


--
-- Name: clinical_claims clinical_claims_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinical_claims
    ADD CONSTRAINT clinical_claims_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);


--
-- Name: clinical_references clinical_references_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinical_references
    ADD CONSTRAINT clinical_references_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: clinical_references clinical_references_claim_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinical_references
    ADD CONSTRAINT clinical_references_claim_id_fkey FOREIGN KEY (claim_id) REFERENCES public.clinical_claims(id) ON DELETE CASCADE;


--
-- Name: clinical_references clinical_references_pi_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinical_references
    ADD CONSTRAINT clinical_references_pi_document_id_fkey FOREIGN KEY (pi_document_id) REFERENCES public.prescribing_information(id) ON DELETE CASCADE;


--
-- Name: competitive_intelligence_enriched competitive_intelligence_enriched_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competitive_intelligence_enriched
    ADD CONSTRAINT competitive_intelligence_enriched_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: competitive_landscape competitive_landscape_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.competitive_landscape
    ADD CONSTRAINT competitive_landscape_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: composed_emails composed_emails_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.composed_emails
    ADD CONSTRAINT composed_emails_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.content_assets(id) ON DELETE CASCADE;


--
-- Name: composed_emails composed_emails_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.composed_emails
    ADD CONSTRAINT composed_emails_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id);


--
-- Name: content_assets content_assets_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_assets
    ADD CONSTRAINT content_assets_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.content_projects(id) ON DELETE CASCADE;


--
-- Name: content_segments content_segments_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_segments
    ADD CONSTRAINT content_segments_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: content_segments content_segments_mlr_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_segments
    ADD CONSTRAINT content_segments_mlr_approved_by_fkey FOREIGN KEY (mlr_approved_by) REFERENCES auth.users(id);


--
-- Name: content_segments content_segments_pi_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_segments
    ADD CONSTRAINT content_segments_pi_document_id_fkey FOREIGN KEY (pi_document_id) REFERENCES public.prescribing_information(id) ON DELETE CASCADE;


--
-- Name: content_sessions content_sessions_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_sessions
    ADD CONSTRAINT content_sessions_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.content_assets(id) ON DELETE CASCADE;


--
-- Name: content_sessions content_sessions_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_sessions
    ADD CONSTRAINT content_sessions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.content_projects(id) ON DELETE CASCADE;


--
-- Name: content_validation_results content_validation_results_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_validation_results
    ADD CONSTRAINT content_validation_results_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.content_assets(id) ON DELETE CASCADE;


--
-- Name: content_variations content_variations_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_variations
    ADD CONSTRAINT content_variations_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.content_assets(id) ON DELETE CASCADE;


--
-- Name: content_versions content_versions_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_versions
    ADD CONSTRAINT content_versions_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.content_assets(id) ON DELETE CASCADE;


--
-- Name: design_handoffs design_handoffs_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.design_handoffs
    ADD CONSTRAINT design_handoffs_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.content_assets(id) ON DELETE CASCADE;


--
-- Name: design_handoffs design_handoffs_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.design_handoffs
    ADD CONSTRAINT design_handoffs_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.content_projects(id) ON DELETE CASCADE;


--
-- Name: global_taxonomy global_taxonomy_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.global_taxonomy
    ADD CONSTRAINT global_taxonomy_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.global_taxonomy(id);


--
-- Name: glocal_analytics glocal_analytics_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_analytics
    ADD CONSTRAINT glocal_analytics_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.glocal_adaptation_projects(id) ON DELETE CASCADE;


--
-- Name: glocal_content_segments glocal_content_segments_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_content_segments
    ADD CONSTRAINT glocal_content_segments_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.glocal_adaptation_projects(id) ON DELETE CASCADE;


--
-- Name: glocal_cultural_intelligence glocal_cultural_intelligence_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_cultural_intelligence
    ADD CONSTRAINT glocal_cultural_intelligence_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.glocal_adaptation_projects(id) ON DELETE CASCADE;


--
-- Name: glocal_cultural_intelligence glocal_cultural_intelligence_segment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_cultural_intelligence
    ADD CONSTRAINT glocal_cultural_intelligence_segment_id_fkey FOREIGN KEY (segment_id) REFERENCES public.glocal_content_segments(id) ON DELETE CASCADE;


--
-- Name: glocal_regulatory_compliance glocal_regulatory_compliance_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_regulatory_compliance
    ADD CONSTRAINT glocal_regulatory_compliance_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.glocal_adaptation_projects(id) ON DELETE CASCADE;


--
-- Name: glocal_regulatory_compliance glocal_regulatory_compliance_segment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_regulatory_compliance
    ADD CONSTRAINT glocal_regulatory_compliance_segment_id_fkey FOREIGN KEY (segment_id) REFERENCES public.glocal_content_segments(id) ON DELETE CASCADE;


--
-- Name: glocal_tm_intelligence glocal_tm_intelligence_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_tm_intelligence
    ADD CONSTRAINT glocal_tm_intelligence_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.glocal_adaptation_projects(id) ON DELETE CASCADE;


--
-- Name: glocal_tm_intelligence glocal_tm_intelligence_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_tm_intelligence
    ADD CONSTRAINT glocal_tm_intelligence_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(user_id);


--
-- Name: glocal_tm_intelligence glocal_tm_intelligence_segment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_tm_intelligence
    ADD CONSTRAINT glocal_tm_intelligence_segment_id_fkey FOREIGN KEY (segment_id) REFERENCES public.glocal_content_segments(id) ON DELETE CASCADE;


--
-- Name: glocal_workflows glocal_workflows_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glocal_workflows
    ADD CONSTRAINT glocal_workflows_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.glocal_adaptation_projects(id) ON DELETE CASCADE;


--
-- Name: intelligence_refresh_log intelligence_refresh_log_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intelligence_refresh_log
    ADD CONSTRAINT intelligence_refresh_log_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: localization_analytics localization_analytics_localization_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.localization_analytics
    ADD CONSTRAINT localization_analytics_localization_project_id_fkey FOREIGN KEY (localization_project_id) REFERENCES public.localization_projects(id) ON DELETE CASCADE;


--
-- Name: localization_projects localization_projects_original_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.localization_projects
    ADD CONSTRAINT localization_projects_original_project_id_fkey FOREIGN KEY (original_project_id) REFERENCES public.localization_projects(id);


--
-- Name: localization_workflows localization_workflows_assigned_agency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.localization_workflows
    ADD CONSTRAINT localization_workflows_assigned_agency_id_fkey FOREIGN KEY (assigned_agency_id) REFERENCES public.localization_agencies(id);


--
-- Name: localization_workflows localization_workflows_localization_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.localization_workflows
    ADD CONSTRAINT localization_workflows_localization_project_id_fkey FOREIGN KEY (localization_project_id) REFERENCES public.localization_projects(id) ON DELETE CASCADE;


--
-- Name: mlr_analysis_results mlr_analysis_results_content_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlr_analysis_results
    ADD CONSTRAINT mlr_analysis_results_content_asset_id_fkey FOREIGN KEY (content_asset_id) REFERENCES public.content_assets(id) ON DELETE CASCADE;


--
-- Name: mlr_learning_feedback mlr_learning_feedback_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlr_learning_feedback
    ADD CONSTRAINT mlr_learning_feedback_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: prescribing_information prescribing_information_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescribing_information
    ADD CONSTRAINT prescribing_information_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: prescribing_information prescribing_information_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescribing_information
    ADD CONSTRAINT prescribing_information_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profiles(user_id);


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: public_domain_insights public_domain_insights_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.public_domain_insights
    ADD CONSTRAINT public_domain_insights_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: public_domain_insights public_domain_insights_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.public_domain_insights
    ADD CONSTRAINT public_domain_insights_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(user_id);


--
-- Name: regional_settings regional_settings_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regional_settings
    ADD CONSTRAINT regional_settings_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: regulatory_profiles regulatory_profiles_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulatory_profiles
    ADD CONSTRAINT regulatory_profiles_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: safety_statements safety_statements_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safety_statements
    ADD CONSTRAINT safety_statements_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: safety_statements safety_statements_isi_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.safety_statements
    ADD CONSTRAINT safety_statements_isi_document_id_fkey FOREIGN KEY (isi_document_id) REFERENCES public.prescribing_information(id) ON DELETE CASCADE;


--
-- Name: theme_analytics theme_analytics_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_analytics
    ADD CONSTRAINT theme_analytics_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES public.theme_library(id) ON DELETE CASCADE;


--
-- Name: theme_comparisons theme_comparisons_selected_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_comparisons
    ADD CONSTRAINT theme_comparisons_selected_theme_id_fkey FOREIGN KEY (selected_theme_id) REFERENCES public.theme_library(id);


--
-- Name: theme_comparisons theme_comparisons_theme_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_comparisons
    ADD CONSTRAINT theme_comparisons_theme_a_id_fkey FOREIGN KEY (theme_a_id) REFERENCES public.theme_library(id);


--
-- Name: theme_comparisons theme_comparisons_theme_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_comparisons
    ADD CONSTRAINT theme_comparisons_theme_b_id_fkey FOREIGN KEY (theme_b_id) REFERENCES public.theme_library(id);


--
-- Name: theme_intelligence theme_intelligence_incorporated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_intelligence
    ADD CONSTRAINT theme_intelligence_incorporated_by_fkey FOREIGN KEY (incorporated_by) REFERENCES public.profiles(user_id);


--
-- Name: theme_intelligence theme_intelligence_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_intelligence
    ADD CONSTRAINT theme_intelligence_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES public.theme_library(id) ON DELETE CASCADE;


--
-- Name: theme_library theme_library_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_library
    ADD CONSTRAINT theme_library_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.profiles(user_id);


--
-- Name: theme_library theme_library_parent_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_library
    ADD CONSTRAINT theme_library_parent_theme_id_fkey FOREIGN KEY (parent_theme_id) REFERENCES public.theme_library(id);


--
-- Name: theme_usage_history theme_usage_history_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme_usage_history
    ADD CONSTRAINT theme_usage_history_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES public.theme_library(id) ON DELETE CASCADE;


--
-- Name: user_brand_access user_brand_access_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_brand_access
    ADD CONSTRAINT user_brand_access_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand_profiles(id) ON DELETE CASCADE;


--
-- Name: user_brand_access user_brand_access_granted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_brand_access
    ADD CONSTRAINT user_brand_access_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES auth.users(id);


--
-- Name: user_brand_access user_brand_access_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_brand_access
    ADD CONSTRAINT user_brand_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: visual_content_reviews visual_content_reviews_composed_email_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visual_content_reviews
    ADD CONSTRAINT visual_content_reviews_composed_email_id_fkey FOREIGN KEY (composed_email_id) REFERENCES public.composed_emails(id) ON DELETE CASCADE;


--
-- Name: asset_guardrails Demo access asset_guardrails; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access asset_guardrails" ON public.asset_guardrails USING (true);


--
-- Name: brand_guidelines Demo access brand_guidelines; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access brand_guidelines" ON public.brand_guidelines USING (true);


--
-- Name: brand_profiles Demo access brand_profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access brand_profiles" ON public.brand_profiles USING (true);


--
-- Name: campaign_guardrails Demo access campaign_guardrails; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access campaign_guardrails" ON public.campaign_guardrails USING (true);


--
-- Name: competitive_landscape Demo access competitive_landscape; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access competitive_landscape" ON public.competitive_landscape USING (true);


--
-- Name: compliance_history Demo access compliance_history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access compliance_history" ON public.compliance_history USING (true);


--
-- Name: content_analytics Demo access content_analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access content_analytics" ON public.content_analytics USING (true);


--
-- Name: guardrail_inheritance Demo access guardrail_inheritance; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access guardrail_inheritance" ON public.guardrail_inheritance USING (true);


--
-- Name: performance_predictions Demo access performance_predictions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access performance_predictions" ON public.performance_predictions USING (true);


--
-- Name: regional_settings Demo access regional_settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access regional_settings" ON public.regional_settings USING (true);


--
-- Name: regulatory_profiles Demo access regulatory_profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access regulatory_profiles" ON public.regulatory_profiles USING (true);


--
-- Name: rule_conflicts Demo access rule_conflicts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access rule_conflicts" ON public.rule_conflicts USING (true);


--
-- Name: rule_execution_log Demo access rule_execution_log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access rule_execution_log" ON public.rule_execution_log USING (true);


--
-- Name: smart_rules Demo access smart_rules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo access smart_rules" ON public.smart_rules USING (true);


--
-- Name: content_assets Demo users can delete all content assets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can delete all content assets" ON public.content_assets FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: content_projects Demo users can delete all content projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can delete all content projects" ON public.content_projects FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: content_variations Demo users can delete all content variations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can delete all content variations" ON public.content_variations FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: content_versions Demo users can delete all content versions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can delete all content versions" ON public.content_versions FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: design_handoffs Demo users can delete all design handoffs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can delete all design handoffs" ON public.design_handoffs FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: ai_translation_results Demo users can manage all AI translation results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all AI translation results" ON public.ai_translation_results USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: prescribing_information Demo users can manage all PI; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all PI" ON public.prescribing_information USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: agency_collaboration_workflows Demo users can manage all agency workflows; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all agency workflows" ON public.agency_collaboration_workflows USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: asset_themes Demo users can manage all asset themes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all asset themes" ON public.asset_themes USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: audience_segments Demo users can manage all audience segments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all audience segments" ON public.audience_segments USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: brand_guidelines Demo users can manage all brand guidelines; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all brand guidelines" ON public.brand_guidelines USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: brand_market_configurations Demo users can manage all brand market configs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all brand market configs" ON public.brand_market_configurations USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: brand_vision Demo users can manage all brand vision; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all brand vision" ON public.brand_vision USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: campaign_themes Demo users can manage all campaign themes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all campaign themes" ON public.campaign_themes USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: clinical_claims Demo users can manage all clinical claims; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all clinical claims" ON public.clinical_claims USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: clinical_references Demo users can manage all clinical references; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all clinical references" ON public.clinical_references USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: competitive_intelligence Demo users can manage all competitive intelligence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all competitive intelligence" ON public.competitive_intelligence USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: competitive_intelligence_enriched Demo users can manage all competitive intelligence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all competitive intelligence" ON public.competitive_intelligence_enriched USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: regulatory_compliance_matrix Demo users can manage all compliance matrix; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all compliance matrix" ON public.regulatory_compliance_matrix USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: content_assets Demo users can manage all content assets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all content assets" ON public.content_assets USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: content_projects Demo users can manage all content projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all content projects" ON public.content_projects USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: content_segments Demo users can manage all content segments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all content segments" ON public.content_segments USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: content_variations Demo users can manage all content variations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all content variations" ON public.content_variations USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: content_versions Demo users can manage all content versions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all content versions" ON public.content_versions USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: cross_module_context Demo users can manage all cross_module_context; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all cross_module_context" ON public.cross_module_context USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: design_handoffs Demo users can manage all design handoffs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all design handoffs" ON public.design_handoffs USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: translation_engine_performance Demo users can manage all engine performance data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all engine performance data" ON public.translation_engine_performance USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: glocal_analytics Demo users can manage all glocal analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all glocal analytics" ON public.glocal_analytics USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: glocal_cultural_intelligence Demo users can manage all glocal cultural intelligence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all glocal cultural intelligence" ON public.glocal_cultural_intelligence USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: glocal_adaptation_projects Demo users can manage all glocal projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all glocal projects" ON public.glocal_adaptation_projects USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: glocal_regulatory_compliance Demo users can manage all glocal regulatory compliance; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all glocal regulatory compliance" ON public.glocal_regulatory_compliance USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: glocal_content_segments Demo users can manage all glocal segments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all glocal segments" ON public.glocal_content_segments USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: glocal_tm_intelligence Demo users can manage all glocal tm intelligence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all glocal tm intelligence" ON public.glocal_tm_intelligence USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: glocal_workflows Demo users can manage all glocal workflows; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all glocal workflows" ON public.glocal_workflows USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: localization_agencies Demo users can manage all localization agencies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all localization agencies" ON public.localization_agencies USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: localization_analytics Demo users can manage all localization analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all localization analytics" ON public.localization_analytics USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: localization_projects Demo users can manage all localization projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all localization projects" ON public.localization_projects USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: localization_workflows Demo users can manage all localization workflows; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all localization workflows" ON public.localization_workflows USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: market_positioning Demo users can manage all market positioning; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all market positioning" ON public.market_positioning USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: pharmaceutical_glossary Demo users can manage all pharmaceutical glossary; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all pharmaceutical glossary" ON public.pharmaceutical_glossary USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: public_domain_insights Demo users can manage all public domain insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all public domain insights" ON public.public_domain_insights USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: regulatory_framework Demo users can manage all regulatory framework; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all regulatory framework" ON public.regulatory_framework USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: safety_statements Demo users can manage all safety statements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all safety statements" ON public.safety_statements USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: global_taxonomy Demo users can manage all taxonomy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all taxonomy" ON public.global_taxonomy USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: theme_analytics Demo users can manage all theme analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all theme analytics" ON public.theme_analytics USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: theme_comparisons Demo users can manage all theme comparisons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all theme comparisons" ON public.theme_comparisons USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: theme_intelligence Demo users can manage all theme intelligence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all theme intelligence" ON public.theme_intelligence USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: theme_usage_history Demo users can manage all theme usage history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all theme usage history" ON public.theme_usage_history USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: theme_library Demo users can manage all themes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all themes" ON public.theme_library USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: translation_memory Demo users can manage all translation memory; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can manage all translation memory" ON public.translation_memory USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: audit_logs Demo users can view all audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can view all audit logs" ON public.audit_logs FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: intelligence_refresh_log Demo users can view all intelligence refresh logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Demo users can view all intelligence refresh logs" ON public.intelligence_refresh_log FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.is_demo_user = true)))));


--
-- Name: global_taxonomy Everyone can view active taxonomy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view active taxonomy" ON public.global_taxonomy FOR SELECT USING ((is_active = true));


--
-- Name: content_validation_results System can insert validation results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert validation results" ON public.content_validation_results FOR INSERT WITH CHECK (true);


--
-- Name: localization_analytics Users can create analytics for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create analytics for accessible projects" ON public.localization_analytics FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.localization_projects
  WHERE ((localization_projects.id = localization_analytics.localization_project_id) AND public.user_has_brand_access(auth.uid(), localization_projects.brand_id)))));


--
-- Name: asset_themes Users can create asset themes for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create asset themes for accessible brands" ON public.asset_themes FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: audience_segments Users can create audience segments for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create audience segments for accessible brands" ON public.audience_segments FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: campaign_themes Users can create campaign themes for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create campaign themes for accessible brands" ON public.campaign_themes FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: clinical_claims Users can create claims for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create claims for accessible brands" ON public.clinical_claims FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: competitive_intelligence Users can create competitive intelligence for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create competitive intelligence for accessible brands" ON public.competitive_intelligence FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: competitive_intelligence_enriched Users can create competitive intelligence for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create competitive intelligence for accessible brands" ON public.competitive_intelligence_enriched FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: regulatory_compliance_matrix Users can create compliance matrix for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create compliance matrix for accessible brands" ON public.regulatory_compliance_matrix FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: composed_emails Users can create composed emails; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create composed emails" ON public.composed_emails FOR INSERT WITH CHECK (true);


--
-- Name: content_assets Users can create content assets for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create content assets for accessible brands" ON public.content_assets FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_projects Users can create content projects for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create content projects for accessible brands" ON public.content_projects FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_variations Users can create content variations for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create content variations for accessible brands" ON public.content_variations FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.content_assets
  WHERE ((content_assets.id = content_variations.asset_id) AND public.user_has_brand_access(auth.uid(), content_assets.brand_id)))));


--
-- Name: content_versions Users can create content versions for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create content versions for accessible brands" ON public.content_versions FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.content_assets
  WHERE ((content_assets.id = content_versions.asset_id) AND public.user_has_brand_access(auth.uid(), content_assets.brand_id)))));


--
-- Name: design_handoffs Users can create design handoffs for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create design handoffs for accessible brands" ON public.design_handoffs FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: glocal_adaptation_projects Users can create glocal projects for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create glocal projects for accessible brands" ON public.glocal_adaptation_projects FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: pharmaceutical_glossary Users can create glossary for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create glossary for accessible brands" ON public.pharmaceutical_glossary FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: public_domain_insights Users can create insights for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create insights for accessible brands" ON public.public_domain_insights FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: localization_agencies Users can create localization agencies for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create localization agencies for accessible brands" ON public.localization_agencies FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: localization_projects Users can create localization projects for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create localization projects for accessible brands" ON public.localization_projects FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: market_positioning Users can create market positioning for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create market positioning for accessible brands" ON public.market_positioning FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: clinical_references Users can create references for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create references for accessible brands" ON public.clinical_references FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: intelligence_refresh_log Users can create refresh logs for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create refresh logs for accessible brands" ON public.intelligence_refresh_log FOR INSERT WITH CHECK (((brand_id IS NULL) OR public.user_has_brand_access(auth.uid(), brand_id)));


--
-- Name: regulatory_framework Users can create regulatory framework for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create regulatory framework for accessible brands" ON public.regulatory_framework FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: safety_statements Users can create safety statements for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create safety statements for accessible brands" ON public.safety_statements FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_segments Users can create segments for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create segments for accessible brands" ON public.content_segments FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: cross_module_context Users can create their own context; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own context" ON public.cross_module_context FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: theme_analytics Users can create theme analytics for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create theme analytics for accessible brands" ON public.theme_analytics FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: theme_comparisons Users can create theme comparisons for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create theme comparisons for accessible brands" ON public.theme_comparisons FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: theme_intelligence Users can create theme intelligence for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create theme intelligence for accessible brands" ON public.theme_intelligence FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: theme_usage_history Users can create theme usage history for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create theme usage history for accessible brands" ON public.theme_usage_history FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: theme_library Users can create themes for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create themes for accessible brands" ON public.theme_library FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: translation_memory Users can create translation memory for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create translation memory for accessible brands" ON public.translation_memory FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: ai_translation_results Users can create translation results for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create translation results for accessible brands" ON public.ai_translation_results FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: visual_content_reviews Users can create visual reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create visual reviews" ON public.visual_content_reviews FOR INSERT WITH CHECK (true);


--
-- Name: agency_collaboration_workflows Users can create workflows for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create workflows for accessible projects" ON public.agency_collaboration_workflows FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.localization_projects
  WHERE ((localization_projects.id = agency_collaboration_workflows.localization_project_id) AND public.user_has_brand_access(auth.uid(), localization_projects.brand_id)))));


--
-- Name: localization_workflows Users can create workflows for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create workflows for accessible projects" ON public.localization_workflows FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.localization_projects
  WHERE ((localization_projects.id = localization_workflows.localization_project_id) AND public.user_has_brand_access(auth.uid(), localization_projects.brand_id)))));


--
-- Name: content_assets Users can delete content assets for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete content assets for accessible brands" ON public.content_assets FOR DELETE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_projects Users can delete content projects for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete content projects for accessible brands" ON public.content_projects FOR DELETE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_variations Users can delete content variations for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete content variations for accessible brands" ON public.content_variations FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.content_assets
  WHERE ((content_assets.id = content_variations.asset_id) AND public.user_has_brand_access(auth.uid(), content_assets.brand_id)))));


--
-- Name: content_versions Users can delete content versions for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete content versions for accessible brands" ON public.content_versions FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.content_assets
  WHERE ((content_assets.id = content_versions.asset_id) AND public.user_has_brand_access(auth.uid(), content_assets.brand_id)))));


--
-- Name: design_handoffs Users can delete design handoffs for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete design handoffs for accessible brands" ON public.design_handoffs FOR DELETE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: prescribing_information Users can delete their own PI uploads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own PI uploads" ON public.prescribing_information FOR DELETE USING ((auth.uid() = uploaded_by));


--
-- Name: cross_module_context Users can delete their own context; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own context" ON public.cross_module_context FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: prescribing_information Users can insert PI for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert PI for accessible brands" ON public.prescribing_information FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: mlr_analysis_results Users can insert analysis results for their brand content; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert analysis results for their brand content" ON public.mlr_analysis_results FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.content_assets ca
  WHERE ((ca.id = mlr_analysis_results.content_asset_id) AND public.user_has_brand_access(auth.uid(), ca.brand_id)))));


--
-- Name: mlr_learning_feedback Users can insert learning feedback for their brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert learning feedback for their brands" ON public.mlr_learning_feedback FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: glocal_content_segments Users can manage glocal segments for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage glocal segments for accessible projects" ON public.glocal_content_segments USING ((EXISTS ( SELECT 1
   FROM public.glocal_adaptation_projects
  WHERE ((glocal_adaptation_projects.id = glocal_content_segments.project_id) AND public.user_has_brand_access(auth.uid(), glocal_adaptation_projects.brand_id)))));


--
-- Name: content_sessions Users can manage their own content sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own content sessions" ON public.content_sessions USING ((auth.uid() = user_id));


--
-- Name: brand_vision Users can modify brand vision for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can modify brand vision for accessible brands" ON public.brand_vision FOR INSERT WITH CHECK (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: prescribing_information Users can update PI for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update PI for accessible brands" ON public.prescribing_information FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: asset_themes Users can update asset themes for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update asset themes for accessible brands" ON public.asset_themes FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: audience_segments Users can update audience segments for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update audience segments for accessible brands" ON public.audience_segments FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: brand_vision Users can update brand vision for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update brand vision for accessible brands" ON public.brand_vision FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: campaign_themes Users can update campaign themes for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update campaign themes for accessible brands" ON public.campaign_themes FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: clinical_claims Users can update claims for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update claims for accessible brands" ON public.clinical_claims FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: competitive_intelligence Users can update competitive intelligence for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update competitive intelligence for accessible brands" ON public.competitive_intelligence FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: competitive_intelligence_enriched Users can update competitive intelligence for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update competitive intelligence for accessible brands" ON public.competitive_intelligence_enriched FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: regulatory_compliance_matrix Users can update compliance matrix for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update compliance matrix for accessible brands" ON public.regulatory_compliance_matrix FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_assets Users can update content assets for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update content assets for accessible brands" ON public.content_assets FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_projects Users can update content projects for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update content projects for accessible brands" ON public.content_projects FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_variations Users can update content variations for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update content variations for accessible brands" ON public.content_variations FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.content_assets
  WHERE ((content_assets.id = content_variations.asset_id) AND public.user_has_brand_access(auth.uid(), content_assets.brand_id)))));


--
-- Name: design_handoffs Users can update design handoffs for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update design handoffs for accessible brands" ON public.design_handoffs FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: glocal_adaptation_projects Users can update glocal projects for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update glocal projects for accessible brands" ON public.glocal_adaptation_projects FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: pharmaceutical_glossary Users can update glossary for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update glossary for accessible brands" ON public.pharmaceutical_glossary FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: public_domain_insights Users can update insights for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update insights for accessible brands" ON public.public_domain_insights FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: mlr_learning_feedback Users can update learning feedback for their brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update learning feedback for their brands" ON public.mlr_learning_feedback FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: localization_agencies Users can update localization agencies for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update localization agencies for accessible brands" ON public.localization_agencies FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: localization_projects Users can update localization projects for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update localization projects for accessible brands" ON public.localization_projects FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: market_positioning Users can update market positioning for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update market positioning for accessible brands" ON public.market_positioning FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: regulatory_framework Users can update regulatory framework for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update regulatory framework for accessible brands" ON public.regulatory_framework FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_segments Users can update segments for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update segments for accessible brands" ON public.content_segments FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: composed_emails Users can update their composed emails; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their composed emails" ON public.composed_emails FOR UPDATE USING (true);


--
-- Name: cross_module_context Users can update their own context; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own context" ON public.cross_module_context FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: theme_analytics Users can update theme analytics for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update theme analytics for accessible brands" ON public.theme_analytics FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: theme_comparisons Users can update theme comparisons for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update theme comparisons for accessible brands" ON public.theme_comparisons FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: theme_intelligence Users can update theme intelligence for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update theme intelligence for accessible brands" ON public.theme_intelligence FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: theme_library Users can update themes for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update themes for accessible brands" ON public.theme_library FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: translation_memory Users can update translation memory for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update translation memory for accessible brands" ON public.translation_memory FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: ai_translation_results Users can update translation results for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update translation results for accessible brands" ON public.ai_translation_results FOR UPDATE USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: visual_content_reviews Users can update visual reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update visual reviews" ON public.visual_content_reviews FOR UPDATE USING (true);


--
-- Name: agency_collaboration_workflows Users can update workflows for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update workflows for accessible projects" ON public.agency_collaboration_workflows FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.localization_projects
  WHERE ((localization_projects.id = agency_collaboration_workflows.localization_project_id) AND public.user_has_brand_access(auth.uid(), localization_projects.brand_id)))));


--
-- Name: localization_workflows Users can update workflows for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update workflows for accessible projects" ON public.localization_workflows FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.localization_projects
  WHERE ((localization_projects.id = localization_workflows.localization_project_id) AND public.user_has_brand_access(auth.uid(), localization_projects.brand_id)))));


--
-- Name: prescribing_information Users can view PI for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view PI for accessible brands" ON public.prescribing_information FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: mlr_analysis_results Users can view analysis results for their brand content; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view analysis results for their brand content" ON public.mlr_analysis_results FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.content_assets ca
  WHERE ((ca.id = mlr_analysis_results.content_asset_id) AND public.user_has_brand_access(auth.uid(), ca.brand_id)))));


--
-- Name: localization_analytics Users can view analytics for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view analytics for accessible projects" ON public.localization_analytics FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.localization_projects
  WHERE ((localization_projects.id = localization_analytics.localization_project_id) AND public.user_has_brand_access(auth.uid(), localization_projects.brand_id)))));


--
-- Name: asset_themes Users can view asset themes for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view asset themes for accessible brands" ON public.asset_themes FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: audience_segments Users can view audience segments for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view audience segments for accessible brands" ON public.audience_segments FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: brand_market_configurations Users can view brand market configs for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view brand market configs for accessible brands" ON public.brand_market_configurations FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: brand_vision Users can view brand vision for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view brand vision for accessible brands" ON public.brand_vision FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: campaign_themes Users can view campaign themes for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view campaign themes for accessible brands" ON public.campaign_themes FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: clinical_claims Users can view claims for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view claims for accessible brands" ON public.clinical_claims FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: competitive_intelligence Users can view competitive intelligence for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view competitive intelligence for accessible brands" ON public.competitive_intelligence FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: competitive_intelligence_enriched Users can view competitive intelligence for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view competitive intelligence for accessible brands" ON public.competitive_intelligence_enriched FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: regulatory_compliance_matrix Users can view compliance matrix for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view compliance matrix for accessible brands" ON public.regulatory_compliance_matrix FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: composed_emails Users can view composed emails for their brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view composed emails for their brands" ON public.composed_emails FOR SELECT USING ((brand_id IN ( SELECT composed_emails.brand_id
   FROM public.brand_profiles
  WHERE (brand_profiles.id = composed_emails.brand_id))));


--
-- Name: content_assets Users can view content assets for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view content assets for accessible brands" ON public.content_assets FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_projects Users can view content projects for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view content projects for accessible brands" ON public.content_projects FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_variations Users can view content variations for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view content variations for accessible brands" ON public.content_variations FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.content_assets
  WHERE ((content_assets.id = content_variations.asset_id) AND public.user_has_brand_access(auth.uid(), content_assets.brand_id)))));


--
-- Name: content_versions Users can view content versions for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view content versions for accessible brands" ON public.content_versions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.content_assets
  WHERE ((content_assets.id = content_versions.asset_id) AND public.user_has_brand_access(auth.uid(), content_assets.brand_id)))));


--
-- Name: design_handoffs Users can view design handoffs for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view design handoffs for accessible brands" ON public.design_handoffs FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: translation_engine_performance Users can view engine performance data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view engine performance data" ON public.translation_engine_performance FOR SELECT USING (true);


--
-- Name: glocal_analytics Users can view glocal analytics for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view glocal analytics for accessible projects" ON public.glocal_analytics FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.glocal_adaptation_projects
  WHERE ((glocal_adaptation_projects.id = glocal_analytics.project_id) AND public.user_has_brand_access(auth.uid(), glocal_adaptation_projects.brand_id)))));


--
-- Name: glocal_cultural_intelligence Users can view glocal cultural intelligence for accessible proj; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view glocal cultural intelligence for accessible proj" ON public.glocal_cultural_intelligence FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.glocal_adaptation_projects
  WHERE ((glocal_adaptation_projects.id = glocal_cultural_intelligence.project_id) AND public.user_has_brand_access(auth.uid(), glocal_adaptation_projects.brand_id)))));


--
-- Name: glocal_adaptation_projects Users can view glocal projects for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view glocal projects for accessible brands" ON public.glocal_adaptation_projects FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: glocal_regulatory_compliance Users can view glocal regulatory compliance for accessible proj; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view glocal regulatory compliance for accessible proj" ON public.glocal_regulatory_compliance FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.glocal_adaptation_projects
  WHERE ((glocal_adaptation_projects.id = glocal_regulatory_compliance.project_id) AND public.user_has_brand_access(auth.uid(), glocal_adaptation_projects.brand_id)))));


--
-- Name: glocal_content_segments Users can view glocal segments for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view glocal segments for accessible projects" ON public.glocal_content_segments FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.glocal_adaptation_projects
  WHERE ((glocal_adaptation_projects.id = glocal_content_segments.project_id) AND public.user_has_brand_access(auth.uid(), glocal_adaptation_projects.brand_id)))));


--
-- Name: glocal_tm_intelligence Users can view glocal tm intelligence for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view glocal tm intelligence for accessible projects" ON public.glocal_tm_intelligence FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.glocal_adaptation_projects
  WHERE ((glocal_adaptation_projects.id = glocal_tm_intelligence.project_id) AND public.user_has_brand_access(auth.uid(), glocal_adaptation_projects.brand_id)))));


--
-- Name: glocal_workflows Users can view glocal workflows for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view glocal workflows for accessible projects" ON public.glocal_workflows FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.glocal_adaptation_projects
  WHERE ((glocal_adaptation_projects.id = glocal_workflows.project_id) AND public.user_has_brand_access(auth.uid(), glocal_adaptation_projects.brand_id)))));


--
-- Name: pharmaceutical_glossary Users can view glossary for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view glossary for accessible brands" ON public.pharmaceutical_glossary FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: public_domain_insights Users can view insights for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view insights for accessible brands" ON public.public_domain_insights FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: mlr_learning_feedback Users can view learning feedback for their brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view learning feedback for their brands" ON public.mlr_learning_feedback FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: localization_agencies Users can view localization agencies for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view localization agencies for accessible brands" ON public.localization_agencies FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: localization_projects Users can view localization projects for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view localization projects for accessible brands" ON public.localization_projects FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: market_positioning Users can view market positioning for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view market positioning for accessible brands" ON public.market_positioning FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: clinical_references Users can view references for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view references for accessible brands" ON public.clinical_references FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: intelligence_refresh_log Users can view refresh logs for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view refresh logs for accessible brands" ON public.intelligence_refresh_log FOR SELECT USING (((brand_id IS NULL) OR public.user_has_brand_access(auth.uid(), brand_id)));


--
-- Name: regulatory_framework Users can view regulatory framework for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view regulatory framework for accessible brands" ON public.regulatory_framework FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: safety_statements Users can view safety statements for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view safety statements for accessible brands" ON public.safety_statements FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_segments Users can view segments for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view segments for accessible brands" ON public.content_segments FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: audit_logs Users can view their own audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own audit logs" ON public.audit_logs FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_brand_access Users can view their own brand access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own brand access" ON public.user_brand_access FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: cross_module_context Users can view their own context; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own context" ON public.cross_module_context FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: theme_analytics Users can view theme analytics for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view theme analytics for accessible brands" ON public.theme_analytics FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: theme_comparisons Users can view theme comparisons for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view theme comparisons for accessible brands" ON public.theme_comparisons FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: theme_intelligence Users can view theme intelligence for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view theme intelligence for accessible brands" ON public.theme_intelligence FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: theme_usage_history Users can view theme usage history for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view theme usage history for accessible brands" ON public.theme_usage_history FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: theme_library Users can view themes for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view themes for accessible brands" ON public.theme_library FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: translation_memory Users can view translation memory for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view translation memory for accessible brands" ON public.translation_memory FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: ai_translation_results Users can view translation results for accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view translation results for accessible brands" ON public.ai_translation_results FOR SELECT USING (public.user_has_brand_access(auth.uid(), brand_id));


--
-- Name: content_validation_results Users can view validation results for their accessible brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view validation results for their accessible brands" ON public.content_validation_results FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.content_assets ca
  WHERE ((ca.id = content_validation_results.asset_id) AND public.user_has_brand_access(auth.uid(), ca.brand_id)))));


--
-- Name: visual_content_reviews Users can view visual reviews for their composed emails; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view visual reviews for their composed emails" ON public.visual_content_reviews FOR SELECT USING ((composed_email_id IN ( SELECT composed_emails.id
   FROM public.composed_emails)));


--
-- Name: agency_collaboration_workflows Users can view workflows for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view workflows for accessible projects" ON public.agency_collaboration_workflows FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.localization_projects
  WHERE ((localization_projects.id = agency_collaboration_workflows.localization_project_id) AND public.user_has_brand_access(auth.uid(), localization_projects.brand_id)))));


--
-- Name: localization_workflows Users can view workflows for accessible projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view workflows for accessible projects" ON public.localization_workflows FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.localization_projects
  WHERE ((localization_projects.id = localization_workflows.localization_project_id) AND public.user_has_brand_access(auth.uid(), localization_projects.brand_id)))));


--
-- Name: agency_collaboration_workflows; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.agency_collaboration_workflows ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_translation_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_translation_results ENABLE ROW LEVEL SECURITY;

--
-- Name: asset_guardrails; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.asset_guardrails ENABLE ROW LEVEL SECURITY;

--
-- Name: asset_themes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.asset_themes ENABLE ROW LEVEL SECURITY;

--
-- Name: audience_segments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audience_segments ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: brand_guidelines; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.brand_guidelines ENABLE ROW LEVEL SECURITY;

--
-- Name: brand_market_configurations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.brand_market_configurations ENABLE ROW LEVEL SECURITY;

--
-- Name: brand_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: brand_vision; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.brand_vision ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_guardrails; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_guardrails ENABLE ROW LEVEL SECURITY;

--
-- Name: campaign_themes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.campaign_themes ENABLE ROW LEVEL SECURITY;

--
-- Name: clinical_claims; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.clinical_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: clinical_references; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.clinical_references ENABLE ROW LEVEL SECURITY;

--
-- Name: competitive_intelligence; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.competitive_intelligence ENABLE ROW LEVEL SECURITY;

--
-- Name: competitive_intelligence_enriched; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.competitive_intelligence_enriched ENABLE ROW LEVEL SECURITY;

--
-- Name: competitive_landscape; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.competitive_landscape ENABLE ROW LEVEL SECURITY;

--
-- Name: compliance_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.compliance_history ENABLE ROW LEVEL SECURITY;

--
-- Name: composed_emails; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.composed_emails ENABLE ROW LEVEL SECURITY;

--
-- Name: content_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: content_assets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;

--
-- Name: content_projects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_projects ENABLE ROW LEVEL SECURITY;

--
-- Name: content_segments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_segments ENABLE ROW LEVEL SECURITY;

--
-- Name: content_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: content_validation_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_validation_results ENABLE ROW LEVEL SECURITY;

--
-- Name: content_variations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_variations ENABLE ROW LEVEL SECURITY;

--
-- Name: content_versions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

--
-- Name: cross_module_context; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cross_module_context ENABLE ROW LEVEL SECURITY;

--
-- Name: design_handoffs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.design_handoffs ENABLE ROW LEVEL SECURITY;

--
-- Name: global_taxonomy; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.global_taxonomy ENABLE ROW LEVEL SECURITY;

--
-- Name: glocal_adaptation_projects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.glocal_adaptation_projects ENABLE ROW LEVEL SECURITY;

--
-- Name: glocal_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.glocal_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: glocal_content_segments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.glocal_content_segments ENABLE ROW LEVEL SECURITY;

--
-- Name: glocal_cultural_intelligence; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.glocal_cultural_intelligence ENABLE ROW LEVEL SECURITY;

--
-- Name: glocal_regulatory_compliance; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.glocal_regulatory_compliance ENABLE ROW LEVEL SECURITY;

--
-- Name: glocal_tm_intelligence; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.glocal_tm_intelligence ENABLE ROW LEVEL SECURITY;

--
-- Name: glocal_workflows; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.glocal_workflows ENABLE ROW LEVEL SECURITY;

--
-- Name: guardrail_inheritance; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.guardrail_inheritance ENABLE ROW LEVEL SECURITY;

--
-- Name: intelligence_refresh_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.intelligence_refresh_log ENABLE ROW LEVEL SECURITY;

--
-- Name: localization_agencies; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.localization_agencies ENABLE ROW LEVEL SECURITY;

--
-- Name: localization_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.localization_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: localization_projects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.localization_projects ENABLE ROW LEVEL SECURITY;

--
-- Name: localization_workflows; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.localization_workflows ENABLE ROW LEVEL SECURITY;

--
-- Name: market_positioning; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.market_positioning ENABLE ROW LEVEL SECURITY;

--
-- Name: mlr_analysis_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.mlr_analysis_results ENABLE ROW LEVEL SECURITY;

--
-- Name: mlr_learning_feedback; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.mlr_learning_feedback ENABLE ROW LEVEL SECURITY;

--
-- Name: performance_predictions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.performance_predictions ENABLE ROW LEVEL SECURITY;

--
-- Name: pharmaceutical_glossary; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pharmaceutical_glossary ENABLE ROW LEVEL SECURITY;

--
-- Name: prescribing_information; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.prescribing_information ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: public_domain_insights; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.public_domain_insights ENABLE ROW LEVEL SECURITY;

--
-- Name: regional_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.regional_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: regulatory_compliance_matrix; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.regulatory_compliance_matrix ENABLE ROW LEVEL SECURITY;

--
-- Name: regulatory_framework; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.regulatory_framework ENABLE ROW LEVEL SECURITY;

--
-- Name: regulatory_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.regulatory_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: rule_conflicts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.rule_conflicts ENABLE ROW LEVEL SECURITY;

--
-- Name: rule_execution_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.rule_execution_log ENABLE ROW LEVEL SECURITY;

--
-- Name: safety_statements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.safety_statements ENABLE ROW LEVEL SECURITY;

--
-- Name: smart_rules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.smart_rules ENABLE ROW LEVEL SECURITY;

--
-- Name: theme_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.theme_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: theme_comparisons; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.theme_comparisons ENABLE ROW LEVEL SECURITY;

--
-- Name: theme_intelligence; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.theme_intelligence ENABLE ROW LEVEL SECURITY;

--
-- Name: theme_library; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.theme_library ENABLE ROW LEVEL SECURITY;

--
-- Name: theme_usage_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.theme_usage_history ENABLE ROW LEVEL SECURITY;

--
-- Name: translation_engine_performance; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.translation_engine_performance ENABLE ROW LEVEL SECURITY;

--
-- Name: translation_memory; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.translation_memory ENABLE ROW LEVEL SECURITY;

--
-- Name: user_brand_access; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_brand_access ENABLE ROW LEVEL SECURITY;

--
-- Name: visual_content_reviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.visual_content_reviews ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


