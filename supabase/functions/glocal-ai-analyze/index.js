
// analysis-service.js (Node.js / ESM)
// Env: LOVABLE_API_KEY
// Deps: npm i express node-fetch
// Run: node analysis-service.js

import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// ---- CORS (same as original) ----
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Preflight (OPTIONS) – mirrors the Deno handler
app.options('/', (req, res) => {
  res.set(corsHeaders).status(204).end();
});

// ---- Main route (POST) ----
app.post('/', async (req, res) => {
  try {
    const { text, analysisType, targetMarket, context } = req.body || {};
    if (typeof text !== 'string' || !text.length) {
      return res
        .set({ ...corsHeaders, 'Content-Type': 'application/json' })
        .status(400)
        .json({ error: 'Missing or invalid "text" in request body' });
    }

    console.log('Analysis request:', {
      analysisType,
      targetMarket,
      textLength: text.length,
    });

    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // ---- Build analysis-specific system prompt (kept identical in intent) ----
    let systemPrompt = '';

    if (analysisType === 'cultural') {
      const audienceContext = context?.targetAudience ?? 'healthcare professionals';
      const channelContext = context?.channel ?? 'print';
      const assetType = context?.assetType ?? 'marketing material';

      systemPrompt = `You are an expert pharmaceutical cultural adaptation specialist for ${targetMarket}.
Analyze this translated pharmaceutical content for cultural appropriateness and provide actionable recommendations.
CONTEXT:
- Target Audience: ${audienceContext}
- Channel: ${channelContext}
- Asset Type: ${assetType}
- Therapeutic Area: ${context?.therapeuticArea ?? 'general'}
Provide analysis in JSON format:
{
  "appropriatenessScore": 0-100,
  "actions": [
    {
      "action": "REVIEW\nREPLACE\nREMOVE\nAPPROVE",
      "priority": "critical\nhigh\nmedium\nlow",
      "originalText": "specific text element",
      "suggestedAlternatives": [
        {
          "text": "culturally adapted alternative",
          "rationale": "why this is more appropriate",
          "culturalFit": 0-100
        }
      ],
      "culturalProverb": {
        "original": "native script",
        "romanji": "romanized version",
        "translation": "English meaning",
        "context": "how it applies to this content"
      }
    }
  ],
  "toneAnalysis": {
    "currentTone": "direct\nindirect\nconsultative\nauthoritative",
    "targetTone": "recommended tone for market",
    "audienceType": "HCP\npatient\ncaregiver",
    "channelType": "web\nprint\nemail\nsocial",
    "formalityLevel": "formal\ninformal\nsemi-formal",
    "respectLevel": "standard\nhigh\nvery-high",
    "communicationStyle": "market-appropriate style"
  },
  "contextualGuidance": {
    "dosAndDonts": [
      {"type": "do", "text": "specific guidance"},
      {"type": "dont", "text": "what to avoid"}
    ],
    "communicationStyle": "description of preferred style",
    "decisionMaking": "cultural decision-making context",
    "familyDynamics": "role of family in healthcare decisions"
  },
  "culturalRisks": ["risk1", "risk2"],
  "suggestions": ["high-level suggestion1", "suggestion2"]
}
IMPORTANT ANALYSIS FACTORS:
1. Tone appropriateness for ${audienceContext} in ${targetMarket}
2. Use of cultural proverbs/idioms where applicable
3. Channel-specific formatting (${channelContext})
4. Formality level and respect markers (honorifics, keigo for Japanese, etc.)
5. Direct vs indirect communication style
6. Family consultation expectations
7. Decision-making cultural patterns
8. Color, number, or symbol sensitivities
9. Medical terminology cultural appropriateness
10. Regulatory tone requirements per market`;
    } else if (analysisType === 'regulatory') {
      systemPrompt = `You are a regulatory compliance expert for pharmaceutical marketing.
Analyze the following content for regulatory compliance in ${targetMarket}.
CRITICAL: Avoid duplicate findings. Consolidate similar compliance concerns into a single, comprehensive issue rather than listing the same problem multiple times. Focus on distinct, non-overlapping regulatory concerns.
Provide analysis in JSON format with:
{
  "complianceScore": 0-100,
  "issues": [{"severity": "high\nmedium\nlow", "issue": "description"}],
  "recommendations": ["recommendation1", "recommendation2"],
  "requiredChanges": ["change1", "change2"]
}
Each issue should be unique and distinct. If multiple parts of the content have the same regulatory concern, consolidate them into one issue with comprehensive details.`;
    } else if (analysisType === 'quality') {
      systemPrompt = `You are a quality assurance expert for medical translations.
Analyze the following content for translation quality and medical accuracy.
Provide analysis in JSON format with:
{
  "qualityScore": 0-100,
  "accuracyIssues": ["issue1", "issue2"],
  "terminologyProblems": ["problem1", "problem2"],
  "improvements": ["improvement1", "improvement2"]
}`;
    } else if (analysisType === 'tm_breakdown') {
      systemPrompt = `You are a Translation Memory expert for pharmaceutical content.
Analyze the source text and translation for TM intelligence and quality scoring.
Provide analysis in JSON format with:
{
  "wordBreakdown": [
    {
      "word": "source word",
      "type": "exact\nfuzzy\nnew",
      "matchScore": 0-100,
      "tmSourceText": "original TM match or empty string"
    }
  ],
  "qualityScore": 0-100,
  "accuracyScore": 0-100,
  "culturalScore": 0-100,
  "accuracyIssues": ["issue1", "issue2"],
  "improvements": ["suggestion1", "suggestion2"],
  "tmLeverage": {
    "exactMatches": 0,
    "fuzzyMatches": 0,
    "newWords": 0,
    "leveragePercentage": 0
  }
}`;
    } else {
      // Default: treat as general analysis (keeps behavior deterministic)
      systemPrompt = `You are a pharmaceutical content analysis expert. Return analysis as valid JSON.`;
    }

    // ---- Lovable AI call (same model & message scheme) ----
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context: ${JSON.stringify(context)}\n\nContent to analyze:\n${text}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let analysis = data.choices?.[0]?.message?.content;

    // Try to parse as JSON, fallback to text
    try {
      analysis = JSON.parse(analysis);
    } catch {
      console.log('Response not JSON, using as-is');
    }

    console.log('Analysis completed successfully');
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(200)
      .json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(500)
      .json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
  }
});

