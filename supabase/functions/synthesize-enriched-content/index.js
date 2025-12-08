import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { field, theme, intelligence, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build intelligence summary sections
    const brandSection = intelligence?.brand ? `
BRAND INTELLIGENCE:
- Voice Alignment Score: ${intelligence.brand.voiceAlignment?.score || 'N/A'}/100
- Brand Strengths: ${intelligence.brand.messagingOptimization?.strengths?.join(', ') || 'N/A'}
- Areas for Improvement: ${intelligence.brand.messagingOptimization?.improvements?.join(', ') || 'N/A'}
- Tone Guidelines: ${intelligence.brand.voiceAlignment?.recommendations?.join(', ') || 'N/A'}
` : '';

    const competitiveSection = intelligence?.competitive ? `
COMPETITIVE INTELLIGENCE:
- Key Differentiators: ${intelligence.competitive.differentiationOpportunities?.map((o) => o.opportunity).join(', ') || 'N/A'}
- Market Gaps to Exploit: ${intelligence.competitive.marketGaps?.map((g) => g.gap).join(', ') || 'N/A'}
- Competitive Advantages: ${intelligence.competitive.competitiveAdvantages?.map((a) => a.advantage).join(', ') || 'N/A'}
` : '';

    const marketSection = intelligence?.market ? `
MARKET INTELLIGENCE:
- Primary Audience Drivers: ${intelligence.market.audienceResonance?.primaryDrivers?.join(', ') || 'N/A'}
- Positioning Recommendations: ${intelligence.market.positioningRecommendations?.map((r) => r.recommendation).join(', ') || 'N/A'}
- Market Opportunities: ${intelligence.market.opportunityAreas?.map((o) => o.opportunity).join(', ') || 'N/A'}
` : '';

    const regulatorySection = intelligence?.regulatory ? `
REGULATORY INTELLIGENCE:
- Risk Level: ${intelligence.regulatory.complianceAssessment?.riskLevel || 'N/A'}
- Compliance Score: ${intelligence.regulatory.complianceAssessment?.score || 'N/A'}/100
- Required Disclaimers: ${intelligence.regulatory.requiredDisclaimers?.length || 0} identified
- Fair Balance Analysis: ${intelligence.regulatory.fairBalanceConsiderations?.analysis || 'N/A'}
- Key Requirements: ${intelligence.regulatory.complianceAssessment?.requirements?.join(', ') || 'N/A'}
` : '';

    const publicSection = intelligence?.public ? `
PUBLIC DOMAIN INTELLIGENCE:
- Current Trends: ${intelligence.public.relevantTrends?.map((t) => t.trend).join(', ') || 'N/A'}
- Patient Sentiment: ${intelligence.public.patientSentiment?.overallTone || 'N/A'}
- Market Context: ${intelligence.public.marketContext?.summary || 'N/A'}
` : '';

    const clinicalSection = intelligence?.clinical ? `
CLINICAL EVIDENCE (From Prescribing Information):
${intelligence.clinical.trials?.length ? `
CLINICAL TRIAL RESULTS:
${intelligence.clinical.trials.map((trial) => `
  • ${trial.studyName || trial.study_name || 'Study'}: ${trial.endpoint}
    - Treatment: ${trial.treatment} vs Control: ${trial.control}
    - P-Value: ${trial.pValue || trial.p_value}
    - Significance: ${trial.significance}
    - Relevance Score: ${trial.relevanceScore || trial.relevance_score || 0}/100
    - Why It Matters: ${trial.narrativeFit || trial.narrative_fit || 'Supports key messaging'}
    - Suggested Usage: ${trial.suggestedUsage || trial.suggested_usage || 'Reference when discussing efficacy'}
`).join('\n')}` : ''}
${intelligence.clinical.efficacy?.length ? `
EFFICACY DATA:
${intelligence.clinical.efficacy.map((eff) => `
  • ${eff.metric}: ${eff.value}${eff.unit || ''}
    - Baseline: ${eff.baseline || 'N/A'}
    - Relevance Score: ${eff.relevanceScore || eff.relevance_score || 0}/100
    - Context: ${eff.narrativeFit || eff.narrative_fit || 'Key efficacy measure'}
    - Suggested Usage: ${eff.suggestedUsage || eff.suggested_usage || 'Reference in efficacy claims'}
`).join('\n')}` : ''}
${intelligence.clinical.safety?.length ? `
SAFETY DATA:
${intelligence.clinical.safety.map((safety) => `
  • ${safety.adverseEvent || safety.adverse_event}: ${safety.incidence}
    - Severity: ${safety.severity}
    - Relevance Score: ${safety.relevanceScore || safety.relevance_score || 0}/100
    - Context: ${safety.narrativeFit || safety.narrative_fit || 'Safety consideration'}
    - Suggested Usage: ${safety.suggestedUsage || safety.suggested_usage || 'Reference when discussing tolerability'}
`).join('\n')}` : ''}
${intelligence.clinical.competitors?.length ? `
COMPETITOR COMPARISON DATA:
${intelligence.clinical.competitors.map((comp) => `
  • ${comp.competitorName || comp.competitor_name || 'Competitor'}:
    - Key Metric: ${comp.metric}: ${comp.theirValue || comp.their_value} vs Our Value: ${comp.ourValue || comp.our_value}
    - Advantage: ${comp.advantage || comp.competitive_advantage || 'N/A'}
    - Context: ${comp.context || 'Competitive positioning'}
    - Strategic Usage: ${comp.strategicUsage || comp.strategic_usage || 'Highlight our superiority'}
    - Relevance Score: ${comp.relevanceScore || comp.relevance_score || 0}/100
`).join('\n')}` : ''}
${intelligence.clinical.marketInsights ? `
MARKET INSIGHTS:
- Market Size: ${intelligence.clinical.marketInsights.marketSize || intelligence.clinical.marketInsights.market_size || 'N/A'}
- Growth Rate: ${intelligence.clinical.marketInsights.growthRate || intelligence.clinical.marketInsights.growth_rate || 'N/A'}
- Key Trends: ${(intelligence.clinical.marketInsights.keyTrends || intelligence.clinical.marketInsights.key_trends || []).join(', ') || 'N/A'}
- Unmet Needs: ${(intelligence.clinical.marketInsights.unmetNeeds || intelligence.clinical.marketInsights.unmet_needs || []).join(', ') || 'N/A'}
- Target Segments: ${(intelligence.clinical.marketInsights.targetSegments || intelligence.clinical.marketInsights.target_segments || []).join(', ') || 'N/A'}
- Strategic Opportunities: ${(intelligence.clinical.marketInsights.opportunities || []).join(', ') || 'N/A'}
` : ''}
` : '';

    // Build comprehensive prompt
    const prompt = `You are an expert pharmaceutical content strategist. Generate compelling ${field} content using this strategic intelligence:
 
THEME CONTEXT:
- Theme Name: ${theme.name}
- Key Message: ${theme.key_message || theme.keyMessage}
- Description: ${theme.description}
 
ASSET CONTEXT:
- Asset Type: ${context.assetType}
- Target Audience: ${context.targetAudience}
- Indication: ${context.indication}
- Objective: ${context.objective || 'Inform and engage healthcare professionals'}
 
${brandSection}
${competitiveSection}
${marketSection}
${regulatorySection}
${publicSection}
${clinicalSection}
 
GENERATION REQUIREMENTS:
1. Align with brand voice (target score: ${intelligence?.brand?.voiceAlignment?.score || 85}+/100)
2. Emphasize competitive differentiation opportunities
3. Resonate with identified audience drivers
4. Maintain regulatory compliance (risk level: ${intelligence?.regulatory?.complianceAssessment?.riskLevel || 'moderate'})
5. Leverage current market trends and insights
6. Use professional medical terminology appropriate for ${context.targetAudience}
7. Make content specific and actionable, not generic
${context.targetAudience.toLowerCase().includes('caregiver') ? `
**CAREGIVER AUDIENCE ADAPTATION:**
- Transform clinical evidence into practical caregiving guidance
- Focus on how clinical data translates to daily care and patient outcomes
- Address caregiver concerns: "What does this mean for my loved one?"
- Provide actionable takeaways caregivers can use when speaking with healthcare providers
- Balance hope with realistic expectations
- Include caregiver self-care reminders where appropriate
- Use supportive, empowering language that respects caregiver dedication
${context.targetAudience.toLowerCase().includes('family')
  ? '- Keep language accessible: explain medical terms in everyday words'
  : '- Use professional caregiving terminology with patient-friendly context'}
` : ''}
8. **Integrate clinical evidence contextually within the narrative**:
    - Identify where clinical data supports your claims
    - Reference specific trial data (use high-relevance scores >80 as primary evidence)
    - Place chart/table markers where visualizations strengthen the message
    - Format: [INSERT_CHART: clinical-trials-comparison] or [INSERT_TABLE: safety-profile] or [INSERT_CHART: efficacy-timeline] or [INSERT_CHART: competitor-comparison] or [INSERT_TABLE: market-insights]
    - Every quantitative claim should reference PI data
    - Weave evidence into the story flow, don't append it
9. **Leverage competitive intelligence strategically**:
    - Highlight competitive advantages where relevant (use high-relevance scores)
    - Position against competitor weaknesses without naming competitors directly (unless appropriate for audience)
    - Use market insights to demonstrate market need and opportunity
    - Frame differentiators as patient/HCP benefits, not just features
 
For ${field} field specifically:
${field === 'subject' ? '- Create compelling, attention-grabbing subject line (60 chars max)\n- Include key differentiator or benefit' : ''}
${field === 'headline' ? '- Create clear, impactful headline that captures theme essence\n- Emphasize unique value proposition' : ''}
${field === 'body' ? '- Provide detailed, evidence-based content\n- Include 2-3 key differentiation points\n- Address audience drivers directly\n- Maintain professional yet engaging tone' : ''}
${field === 'cta' ? '- Create clear, action-oriented call-to-action\n- Align with strategic objectives\n- Make next steps obvious and valuable' : ''}
 
Return ONLY the ${field} content text. Do NOT include explanations, labels, or meta-commentary. Just the content itself.`;

    console.log('Synthesizing enriched content with intelligence layers:', {
      field,
      themeName: theme.name,
      hasIntelligence: {
        brand: !!intelligence?.brand,
        competitive: !!intelligence?.competitive,
        market: !!intelligence?.market,
        regulatory: !!intelligence?.regulatory,
        public: !!intelligence?.public
      }
    });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert pharmaceutical content strategist specializing in evidence-based healthcare communications.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('Successfully synthesized enriched content:', {
      field,
      contentLength: content.length,
      themeName: theme.name
    });

    // Extract intelligence items used in generation
    const intelligenceItemsUsed = {
      theme: theme.id || null,
      claims: intelligence?.clinical?.trials?.filter((t) => (t.relevanceScore || t.relevance_score || 0) >= 80).map((t) => t.id).slice(0, 5) || [],
      segments: context.targetAudience ? [context.targetAudience] : [],
      competitiveInsights: intelligence?.competitive?.differentiationOpportunities?.slice(0, 3).map((o) => o.id) || [],
      marketInsights: intelligence?.market?.audienceResonance?.primaryDrivers || []
    };

    return new Response(JSON.stringify({
      content,
      intelligenceUsed: intelligenceItemsUsed,
      layersUsed: Object.keys(intelligence || {}).filter(k => intelligence[k])
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in synthesize-enriched-content:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      intelligenceUsed: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});