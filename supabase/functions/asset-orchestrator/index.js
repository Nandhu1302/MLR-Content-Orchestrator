// ============================================
// Asset Orchestrator Agent
// Packages theme into asset structures
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// NOTE: TypeScript interface AssetPackage has been removed.

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Type annotations removed
    const { selectedTheme, assetTypes, analysis, intelligence } = await req.json();

    console.log('Orchestrating assets for theme:', selectedTheme.name);
    console.log('Asset types:', assetTypes);

    // Type annotation removed
    const packages = [];

    for (const assetType of assetTypes) {
      const pkg = buildAssetPackage(
        assetType,
        selectedTheme,
        analysis,
        intelligence
      );
      
      if (pkg) {
        packages.push(pkg);
      }
    }

    console.log('Created asset packages:', packages.length);

    return new Response(
      JSON.stringify({ packages }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Asset orchestration error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getEvidenceForAssetType(assetType, intelligence) {
  // Asset-type-specific evidence allocation strategy
  const allClaims = intelligence.claims || [];
  const allVisuals = intelligence.visuals || [];
  const allModules = intelligence.modules || [];

  if (['email', 'follow-up-email', 'rep-triggered-email'].includes(assetType)) {
    // Email: Communication-focused, concise
    return {
      // Type assertions (c: any) removed
      claims: allClaims.filter((c) => c.claim_type === 'messaging' || c.claim_type === 'value').slice(0, 3),
      visuals: allVisuals.filter((v) => v.asset_type === 'chart').slice(0, 1),
      modules: allModules.slice(0, 1)
    };
  }

  if (['presentation', 'digital-sales-aid', 'detail-aid'].includes(assetType)) {
    // Presentation: Evidence-dense, comprehensive
    return {
      claims: allClaims.filter((c) => c.claim_type === 'efficacy' || c.claim_type === 'safety').slice(0, 6),
      visuals: allVisuals.slice(0, 4),
      modules: allModules.slice(0, 3)
    };
  }

  if (['leave-behind', 'brochure', 'one-pager'].includes(assetType)) {
    // Leave-behind: Balanced, key highlights
    return {
      claims: allClaims.slice(0, 4),
      visuals: allVisuals.filter((v) => v.asset_type === 'table' || v.asset_type === 'chart').slice(0, 2),
      modules: allModules.slice(1, 3) // Different slice from presentation
    };
  }

  if (['clinical-briefing', 'pre-read'].includes(assetType)) {
    // Clinical materials: Deep evidence
    return {
      claims: allClaims.filter((c) => c.claim_type === 'clinical' || c.claim_type === 'efficacy').slice(0, 5),
      visuals: allVisuals.filter((v) => v.asset_type === 'table').slice(0, 3),
      modules: allModules.slice(2, 4) // Different modules
    };
  }

  // Default: balanced selection
  return {
    claims: allClaims.slice(0, 4),
    visuals: allVisuals.slice(0, 2),
    modules: allModules.slice(0, 2)
  };
}

// Type annotations removed
function buildAssetPackage(
  assetType,
  theme,
  analysis,
  intelligence
) {
  const audienceType = analysis.audience?.primaryType || 'HCP';
  const occasionName = analysis.occasion?.name || 'event';
  
  // Type annotation removed
  const structure = {};
  
  // Get asset-type-specific evidence
  const evidence = getEvidenceForAssetType(assetType, intelligence);
  
  switch (assetType) {
    case 'email':
    case 'follow-up-email':
    case 'rep-triggered-email':
      structure.subject = `${theme.keyMessage.substring(0, 50)}...`;
      structure.preheader = `Learn how Biktarvy delivers ${theme.name}`;
      structure.headline = theme.keyMessage;
      structure.body = `Dear Healthcare Provider,\n\n${theme.keyMessage}\n\nKey highlights:\n- Evidence-backed efficacy\n- Proven safety profile\n- Clinical data you can trust\n\n${theme.cta}`;
      structure.cta = theme.cta;
      break;
      
    case 'digital-sales-aid':
    case 'detail-aid':
    case 'presentation':
      structure.title = theme.name;
      structure.subtitle = theme.keyMessage;
      structure.slides = [
        { title: 'Overview', content: theme.keyMessage },
        { title: 'Clinical Evidence', content: 'Key data points supporting this message' },
        { title: 'Safety Profile', content: 'Safety and tolerability data' },
        { title: 'Summary', content: theme.cta }
      ];
      break;
      
    case 'leave-behind':
    case 'brochure':
    case 'one-pager':
      structure.headline = theme.name;
      structure.subheadline = theme.keyMessage;
      structure.sections = [
        { heading: 'Key Message', content: theme.keyMessage },
        { heading: 'Clinical Evidence', content: 'Supporting data and studies' },
        { heading: 'Next Steps', content: theme.cta }
      ];
      break;
      
    case 'clinical-briefing':
    case 'pre-read':
      structure.title = `Clinical Briefing: ${theme.name}`;
      structure.executive_summary = theme.keyMessage;
      structure.sections = [
        { heading: 'Background', content: 'Clinical context and rationale' },
        { heading: 'Key Data', content: 'Primary evidence and findings' },
        { heading: 'Clinical Implications', content: 'Practical applications' }
      ];
      break;
      
    case 'webinar-presentation':
      structure.title = theme.name;
      structure.duration = '45 minutes';
      structure.agenda = [
        'Introduction and objectives',
        'Clinical evidence review',
        'Q&A session',
        'Key takeaways'
      ];
      break;
      
    default:
      structure.title = theme.name;
      structure.content = theme.keyMessage;
  }

  return {
    assetType,
    assetName: `${occasionName} - ${theme.name} - ${assetType}`,
    structure,
    // Type assertions (c: any) removed
    attachedClaims: evidence.claims.map((c) => c.id),
    attachedVisuals: evidence.visuals.map((v) => v.id),
    attachedModules: evidence.modules.map((m) => m.id),
    estimatedCompletionTime: estimateTime(assetType),
  };
}

// Type annotations removed
function estimateTime(assetType) {
  // Type annotation removed
  const timeMap = {
    'email': '2 minutes',
    'follow-up-email': '2 minutes',
    'digital-sales-aid': '5 minutes',
    'presentation': '8 minutes',
    'leave-behind': '3 minutes',
    'brochure': '4 minutes',
    'clinical-briefing': '6 minutes',
    'webinar-presentation': '10 minutes',
  };
  
  return timeMap[assetType] || '5 minutes';
}