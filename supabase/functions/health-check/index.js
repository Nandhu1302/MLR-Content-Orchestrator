
// translation-service.js (Node.js / ESM)
// Converted from a Deno edge function to plain JavaScript with the same logic and context.
// Env: LOVABLE_API_KEY
// Deps: npm i express node-fetch
// Run: node translation-service.js

import express from 'express';
import fetch from 'node-fetch'; // If you're on Node 18+ and prefer global fetch, you can remove this import.

const app = express();
app.use(express.json());

// ---- CORS (same headers/behavior as the original Deno function) ----
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Preflight (OPTIONS) – mirrors the original handler
app.options('/', (req, res) => {
  res.set(corsHeaders).status(204).end();
});

// ---- Main route (POST) ----
app.post('/', async (req, res) => {
  try {
    const { sourceText, sourceLanguage, targetLanguage, context } = req.body || {};
    console.log('Translation request:', {
      sourceLanguage,
      targetLanguage,
      textLength: typeof sourceText === 'string' ? sourceText.length : 0,
    });

    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build the same context-aware system prompt
    const systemPrompt = `You are a professional medical translator specializing in pharmaceutical marketing content.
Translate from ${sourceLanguage} to ${targetLanguage}.
Context:
- Therapeutic Area: ${context?.therapeuticArea ?? 'General'}
- Segment Type: ${context?.segmentType ?? 'General'}
- Tone: ${context?.tone ?? 'Professional'}
Guidelines:
- Maintain medical accuracy and terminology
- Preserve brand voice and messaging intent
- Adapt cultural nuances appropriately
- Keep regulatory compliance in mind
- Return ONLY the translated text, no explanations`;

    // Call Lovable AI (same model & message pattern)
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
          { role: 'user', content: sourceText },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content ?? '';

    console.log('Translation completed successfully');

    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(200)
      .json({
        translation,
        // Simulated confidence score (kept from original)
        confidence: 0.85 + Math.random() * 0.1,
      });
  } catch (error) {
    console.error('Translation error:', error);
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(500)
      .json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
  }
});

