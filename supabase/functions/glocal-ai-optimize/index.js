
// optimization-service.js (Node.js / ESM)
// Env: LOVABLE_API_KEY
// Deps: npm i express node-fetch
// Run: node optimization-service.js

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
    const { text, targetMarket, goals } = req.body || {};

    console.log('Optimization request:', {
      targetMarket,
      goals,
      textLength: typeof text === 'string' ? text.length : 0,
    });

    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build the same system prompt
    const systemPrompt = `You are a content optimization expert for pharmaceutical marketing in ${targetMarket}.
Analyze the content and provide optimization suggestions to achieve these goals: ${Array.isArray(goals) ? goals.join(', ') : goals}.
Provide suggestions in JSON array format:
[
  "suggestion1",
  "suggestion2",
  "suggestion3"
]
Each suggestion should be specific, actionable, and directly address the goals.`;

    // Lovable AI call (same model & message scheme)
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
          { role: 'user', content: text },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let suggestions = data.choices?.[0]?.message?.content;

    // Try to parse as JSON; fallback to splitting by lines
    try {
      suggestions = JSON.parse(suggestions);
    } catch {
      suggestions = (suggestions || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5);
    }

    console.log('Optimization completed successfully');
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(200)
      .json({ suggestions });
  } catch (error) {
    console.error('Optimization error:', error);
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

