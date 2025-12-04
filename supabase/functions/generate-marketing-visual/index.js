
// marketing-visual.js (Node.js / ESM)
// Env: LOVABLE_API_KEY
// Run: node marketing-visual.js
// Deps: npm i express node-fetch   (remove node-fetch if using Node 18+ with global fetch)

import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// ---- CORS (same as original) ----
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Preflight (OPTIONS) – mirrors Deno.serve's CORS handling
app.options('/', (req, res) => {
  res.set(corsHeaders).status(204).end();
});

// ---- POST handler (same logic & context) ----
app.post('/', async (req, res) => {
  try {
    const { prompt, frameNumber } = req.body || {};
    console.log(`Generating marketing visual frame ${frameNumber}...`);

    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Call Lovable AI (same model, same payload)
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          { role: 'user', content: prompt }
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('No image generated from AI');
    }

    console.log(`Frame ${frameNumber} generated successfully`);

    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(200)
      .json({ imageUrl, frameNumber });

  } catch (error) {
    console.error('Error generating marketing visual:', error);
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

