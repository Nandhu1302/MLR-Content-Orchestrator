
// visualize.js (Node.js / ESM)
// Requires: npm i express node-fetch  (remove node-fetch if using Node 18+ global fetch)
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// ---- CORS (same as original) ----
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Preflight (OPTIONS) – same behavior
app.options('/', (req, res) => {
  res.set(corsHeaders).status(204).end();
});

// ---- POST handler (same logic/context) ----
app.post('/', async (req, res) => {
  try {
    const requestData = req.body || {};
    const { visualizationType, data, context, stylePreferences } = requestData;

    console.log('Generating data visualization:', visualizationType);

    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build prompt exactly as in the TS/Deno code
    const prompt = `You are a medical/pharmaceutical data visualization expert. Generate a professional, regulatory-compliant SVG chart.
**Visualization Type:** ${visualizationType}
**Data Points:** ${JSON.stringify(data, null, 2)}
**Context:** ${JSON.stringify(context ?? {}, null, 2)}
**Style Preferences:** ${JSON.stringify(stylePreferences ?? {}, null, 2)}
Generate a complete, standalone SVG chart that:
1. Is self-contained with all styles inline
2. Works in email clients (no external dependencies)
3. Uses professional pharma colors (HSL format like hsl(220, 70%, 50%))
4. Includes proper axis labels, legends, and data labels
5. Is accessible (WCAG compliant colors, proper contrast)
6. Has regulatory-appropriate styling
7. Dimensions: 600px width, 400px height
8. Clean, professional appearance suitable for pharmaceutical communications
**Important:**
- Return VALID, COMPLETE SVG markup as a string
- Use inline styles only (no CSS classes or external stylesheets)
- Include proper viewBox for responsiveness: viewBox="0 0 600 400"
- Use professional colors suitable for healthcare
- Add proper labels, axes, and legends
- Ensure all text is readable (minimum 12px font size)
- Include gridlines and proper spacing
Respond with a JSON object following this structure:
{
  "svgMarkup": "<svg width='600' height='400' viewBox='0 0 600 400' xmlns='http://www.w3.org/2000/svg'>...complete SVG markup with all chart elements...</svg>",
  "insights": {
    "summary": "Brief 2-3 sentence analysis of what the data shows",
    "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "disclaimers": ["Suggested disclaimer text for regulatory compliance"]
  },
  "accessibility": {
    "altText": "Detailed alt text describing the chart",
    "colorBlindSafe": true,
    "contrastRatio": "4.5:1"
  }
}`;

    // Lovable AI call (same endpoint/payload)
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);

      if (response.status === 429) {
        return res
          .set({ ...corsHeaders, 'Content-Type': 'application/json' })
          .status(429)
          .json({ error: 'Rate limit exceeded. Please try again later.' });
      }
      if (response.status === 402) {
        return res
          .set({ ...corsHeaders, 'Content-Type': 'application/json' })
          .status(402)
          .json({ error: 'Payment required. Please add credits to your workspace.' });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Parse the AI JSON content
    let chartData;
    try {
      chartData = JSON.parse(content);
      if (!chartData.svgMarkup) {
        console.error('No SVG markup in AI response:', content);
        throw new Error('AI did not generate SVG markup');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse chart data from AI');
    }

    console.log('SVG chart generated successfully');

    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(200)
      .json({
        success: true,
        svgMarkup: chartData.svgMarkup,
        insights: chartData.insights,
        accessibility: chartData.accessibility,
        metadata: {
          generatedAt: new Date().toISOString(),
          visualizationType,
          dataPointCount: Array.isArray(data) ? data.length : 0,
        },
      });
  } catch (error) {
    console.error('Error generating data visualization:', error);
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(500)
      .json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
  }
});

// Start server (or export app)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Visualization server listening on :${PORT}`));

export default app;
