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
      content, 
      contentAssetId,
      brandId, 
      therapeuticArea, 
      assetType, 
      region,
      brandProfile,
      preApprovedContent,
      brandReferences 
    } = await req.json();

    console.log('[analyze-mlr-readiness] Starting comprehensive analysis', { 
      contentLength: content?.length,
      contentAssetId,
      brandId 
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables not configured.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate content hash for caching
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Check for cached results
    const { data: cachedResult } = await supabase
      .from('mlr_analysis_results')
      .select('*')
      .eq('content_hash', contentHash)
      .eq('analysis_type', 'readiness')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (cachedResult && cachedResult.created_at) {
      const cacheAge = Date.now() - new Date(cachedResult.created_at).getTime();
      if (cacheAge < 5 * 60 * 1000) { // 5 minutes cache
        console.log('[analyze-mlr-readiness] Returning cached result');
        return new Response(JSON.stringify(cachedResult.results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Trigger all analyses in parallel
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    
    if (!SUPABASE_URL) {
        throw new Error("SUPABASE_URL is required for internal function calls.");
    }

    const analysesPromises = [
      fetch(`${SUPABASE_URL}/functions/v1/analyze-claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, brandId, therapeuticArea, assetType, region, preApprovedContent })
      }),
      fetch(`${SUPABASE_URL}/functions/v1/analyze-references`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, brandId, therapeuticArea, brandReferences })
      }),
      fetch(`${SUPABASE_URL}/functions/v1/analyze-regulatory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, brandId, therapeuticArea, assetType, region, brandProfile })
      })
    ];

    const [claimsRes, referencesRes, regulatoryRes] = await Promise.all(analysesPromises);
    
    const claimsAnalysis = await claimsRes.json();
    const referencesAnalysis = await referencesRes.json();
    const regulatoryAnalysis = await regulatoryRes.json();

    console.log('[analyze-mlr-readiness] All analyses complete');

    // Calculate overall MLR readiness score
    let totalIssues = 0;
    let criticalIssues = 0;
    let highIssues = 0;
    let mediumIssues = 0;
    let lowIssues = 0;

    // Count claim issues
    if (claimsAnalysis.claims) {
      claimsAnalysis.claims.forEach((claim) => { // Type annotation removed
        totalIssues++;
        if (claim.severity === 'critical') criticalIssues++;
        else if (claim.severity === 'high') highIssues++;
        else if (claim.severity === 'medium') mediumIssues++;
        else lowIssues++;
      });
    }

    // Count reference issues
    if (referencesAnalysis.summary) {
      totalIssues += referencesAnalysis.summary.missingCitations || 0;
      criticalIssues += referencesAnalysis.summary.criticalGaps || 0;
    }

    // Count regulatory issues
    if (regulatoryAnalysis.summary) {
      totalIssues += (regulatoryAnalysis.summary.failed || 0) + (regulatoryAnalysis.summary.warnings || 0);
      criticalIssues += regulatoryAnalysis.summary.criticalIssues || 0;
    }

    // Calculate weighted MLR readiness score (0-100)
    let mlrScore = 100;
    mlrScore -= criticalIssues * 25; // Critical issues: -25 points each
    mlrScore -= highIssues * 10;     // High issues: -10 points each
    mlrScore -= mediumIssues * 5;    // Medium issues: -5 points each
    mlrScore -= lowIssues * 2;       // Low issues: -2 points each
    mlrScore = Math.max(0, Math.min(100, mlrScore));

    // Determine submission readiness
    let submissionStatus; // Type annotation removed
    if (criticalIssues > 0) {
      submissionStatus = 'not_ready';
    } else if (highIssues > 3 || mlrScore < 60) {
      submissionStatus = 'needs_major_revisions';
    } else if (highIssues > 0 || mediumIssues > 5 || mlrScore < 80) {
      submissionStatus = 'needs_minor_revisions';
    } else {
      submissionStatus = 'ready';
    }

    // Compile comprehensive results
    const comprehensiveResult = {
      mlrReadinessScore: mlrScore,
      submissionStatus,
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues,
        criticalIssues,
        highIssues,
        mediumIssues,
        lowIssues,
        blockers: criticalIssues + highIssues,
      },
      claimsAnalysis,
      referencesAnalysis,
      regulatoryAnalysis,
      topPriorities: [
        ...claimsAnalysis.claims?.filter((c) => c.severity === 'critical' || c.severity === 'high') // Type annotation removed
          .slice(0, 3)
          .map((c) => ({ // Type annotation removed
            type: 'claim',
            severity: c.severity,
            issue: c.text,
            recommendation: c.suggestion
          })) || [],
        ...(regulatoryAnalysis.checks?.filter((c) => c.status === 'failed') // Type annotation removed
          .slice(0, 2)
          .map((c) => ({ // Type annotation removed
            type: 'regulatory',
            severity: c.severity,
            issue: c.requirement,
            recommendation: c.recommendation
          })) || []),
      ].slice(0, 5),
    };

    // Store results in database
    if (contentAssetId) {
      await supabase.from('mlr_analysis_results').insert({
        content_asset_id: contentAssetId,
        content_hash: contentHash,
        analysis_type: 'readiness',
        results: comprehensiveResult,
        mlr_readiness_score: mlrScore,
        critical_issues_count: criticalIssues,
        warnings_count: highIssues + mediumIssues,
      });

      console.log('[analyze-mlr-readiness] Results stored in database');
    }

    return new Response(JSON.stringify(comprehensiveResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[analyze-mlr-readiness] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      mlrReadinessScore: 0,
      submissionStatus: 'error',
      summary: { totalIssues: 0, criticalIssues: 0, highIssues: 0, mediumIssues: 0, lowIssues: 0, blockers: 0 }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});