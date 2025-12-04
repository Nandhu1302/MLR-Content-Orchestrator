import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      assetType, 
      targetAudience, 
      primaryMessage, 
      maxLength, 
      brandId,
      preferences = {}
    } = await req.json();

    // Removed the non-null assertion operator (!)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables not configured.");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Assembling content package:', { assetType, targetAudience, primaryMessage, brandId });

    // Get asset type configuration
    const { data: assetConfig } = await supabase
      .from('asset_type_configurations')
      .select('*')
      .eq('asset_type', assetType)
      .single();

    if (!assetConfig) {
      throw new Error(`Unknown asset type: ${assetType}`);
    }

    // Get relevant content modules based on criteria
    const { data: modules } = await supabase
      .from('content_modules')
      .select(`
        *,
        parent_module:parent_module_id(module_text, module_type)
      `)
      .eq('brand_id', brandId)
      .or(`module_type.ilike.%${primaryMessage}%,module_text.ilike.%${primaryMessage}%`)
      .order('usage_score', { ascending: false })
      .limit(20);

    // Get claim variants suitable for this channel
    const { data: claimVariants } = await supabase
      .from('claim_variants')
      .select(`
        *,
        parent_claim:parent_claim_id(
          claim_text,
          claim_type,
          brand_id
        )
      `)
      .contains('suitable_for_channels', [assetType])
      .order('conversion_rate', { ascending: false })
      .limit(15);

    // Filter claim variants by brand
    const brandClaimVariants = claimVariants?.filter(
      cv => cv.parent_claim?.brand_id === brandId
    ) || [];

    // Get content relationships for smart pairing
    const moduleIds = modules?.map(m => m.id) || [];
    const { data: relationships } = await supabase
      .from('content_relationships')
      .select('*')
      .in('source_module_id', moduleIds)
      .in('relationship_type', ['frequently_paired_with', 'must_follow', 'requires_context_from'])
      .order('confidence_score', { ascending: false });

    // Smart assembly logic
    const suggestions = [];

    // Find best headline options
    const headlines = modules?.filter(m => 
      m.module_type.includes('headline') &&
      (!m.character_limit_max || m.character_limit_max <= (assetConfig.character_limits?.headline || 200))
    ).slice(0, 3) || [];

    for (const headline of headlines) {
      // Type removed
      const linkedClaims = headline.linked_claims || [];
      const linkedRefs = headline.linked_references || [];
      const requiredSafety = headline.required_safety_statements || [];

      // Find frequently paired modules
      const pairedRelationships = relationships?.filter(
        r => r.source_module_id === headline.id && r.relationship_type === 'frequently_paired_with'
      ) || [];

      const pairedModules = modules?.filter(m => 
        pairedRelationships.some(r => r.target_module_id === m.id)
      ) || [];

      // Calculate compliance score
      const complianceFactors = [
        headline.mlr_approved ? 1 : 0.5,
        linkedClaims.length > 0 ? 1 : 0.7,
        linkedRefs.length > 0 ? 1 : 0.8,
        assetConfig.requires_fair_balance && requiredSafety.length > 0 ? 1 : 0.6
      ];
      const complianceScore = complianceFactors.reduce((a, b) => a + b, 0) / complianceFactors.length;

      suggestions.push({
        module: {
          id: headline.id,
          text: headline.module_text,
          type: headline.module_type,
          lengthVariant: headline.length_variant,
          toneVariant: headline.tone_variant,
          characterCount: headline.module_text.length
        },
        linkedClaims,
        requiredReferences: linkedRefs,
        requiredSafety,
        usageScore: headline.usage_score || 0,
        complianceScore,
        pairedModules: pairedModules.map(pm => ({
          id: pm.id,
          text: pm.module_text.substring(0, 100) + '...',
          type: pm.module_type
        })),
        reasoning: generateReasoning(headline, assetConfig, preferences)
      });
    }

    // Find best body content
    const bodyModules = modules?.filter(m => 
      (m.module_type.includes('efficacy') || m.module_type.includes('mechanism') || m.module_type.includes('benefit')) &&
      m.length_variant === preferences.preferredLength &&
      (!maxLength || m.module_text.length <= maxLength * 0.7)
    ).slice(0, 3) || [];

    for (const body of bodyModules) {
      // Type removed
      const linkedClaims = body.linked_claims || [];
      const linkedRefs = body.linked_references || [];
      const requiredSafety = body.required_safety_statements || [];

      const complianceFactors = [
        body.mlr_approved ? 1 : 0.5,
        linkedClaims.length > 0 ? 1 : 0.7,
        linkedRefs.length > 0 ? 1 : 0.8,
        assetConfig.requires_fair_balance && requiredSafety.length > 0 ? 1 : 0.6
      ];
      const complianceScore = complianceFactors.reduce((a, b) => a + b, 0) / complianceFactors.length;

      suggestions.push({
        module: {
          id: body.id,
          text: body.module_text,
          type: body.module_type,
          lengthVariant: body.length_variant,
          toneVariant: body.tone_variant,
          characterCount: body.module_text.length
        },
        linkedClaims,
        requiredReferences: linkedRefs,
        requiredSafety,
        usageScore: body.usage_score || 0,
        complianceScore,
        reasoning: generateReasoning(body, assetConfig, preferences)
      });
    }

    // Add claim variant suggestions
    const topClaimVariants = brandClaimVariants.slice(0, 5).map(cv => ({
      variant: {
        id: cv.id,
        text: cv.variant_text,
        type: cv.variant_type,
        characterCount: cv.variant_text.length,
        parentClaimText: cv.parent_claim?.claim_text
      },
      suitableForChannels: cv.suitable_for_channels || [],
      conversionRate: cv.conversion_rate || 0,
      usageCount: cv.usage_count || 0,
      requiresFootnote: cv.requires_footnote,
      footnoteText: cv.footnote_text,
      reasoning: `${cv.variant_type} variant with ${(cv.conversion_rate * 100).toFixed(1)}% conversion rate`
    }));

    // Compile required disclosures
    const allRequiredSafety = suggestions.flatMap(s => s.requiredSafety || []);
    const uniqueSafetyIds = [...new Set(allRequiredSafety)];

    const { data: safetyStatements } = await supabase
      .from('safety_statements')
      .select('*')
      .in('id', uniqueSafetyIds);

    // Calculate overall package compliance
    const avgComplianceScore = suggestions.length > 0
      ? suggestions.reduce((sum, s) => sum + (s.complianceScore || 0), 0) / suggestions.length
      : 0;

    const response = {
      assetType,
      assetConfig: {
        displayName: assetConfig.display_name,
        characterLimits: assetConfig.character_limits,
        maxClaims: assetConfig.max_claims_allowed,
        requiresFairBalance: assetConfig.requires_fair_balance,
        isiPlacement: assetConfig.isi_placement
      },
      suggestions: suggestions.sort((a, b) => 
        (b.complianceScore * 0.6 + b.usageScore * 0.4) - (a.complianceScore * 0.6 + a.usageScore * 0.4)
      ),
      claimVariants: topClaimVariants,
      requiredDisclosures: safetyStatements?.map(ss => ({
        id: ss.id,
        text: ss.statement_text,
        type: ss.statement_type
      })) || [],
      estimatedComplianceScore: avgComplianceScore,
      totalModulesAvailable: modules?.length || 0,
      totalClaimVariantsAvailable: brandClaimVariants.length
    };

    console.log('Content package assembled:', {
      suggestionsCount: suggestions.length,
      complianceScore: avgComplianceScore
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error assembling content:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateReasoning(module, assetConfig, preferences) { // Type annotations removed
  const reasons = [];
  
  if (module.usage_score > 0.7) {
    reasons.push(`High performer (${(module.usage_score * 100).toFixed(0)}% usage score)`);
  }
  
  if (module.mlr_approved) {
    reasons.push('MLR approved');
  }
  
  if (module.tone_variant === preferences.tone) {
    reasons.push(`Matches requested ${preferences.tone} tone`);
  }
  
  if (module.linked_claims?.length > 0) {
    reasons.push(`Backed by ${module.linked_claims.length} clinical claim(s)`);
  }
  
  if (reasons.length === 0) {
    reasons.push('Relevant to primary message');
  }
  
  return reasons.join(' • ');
}