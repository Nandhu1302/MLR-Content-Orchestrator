
// table-generator.js (Node.js / ESM)
// Converted from Deno/TS to plain JavaScript without changing context/logic.
// Env: LOVABLE_API_KEY
// Deps: npm i express node-fetch
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
    // Request shape kept identical in spirit
    const request = req.body || {};
    const lovableApiKey = process.env.LOVABLE_API_KEY;
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build the same prompt
    const prompt = `Generate a regulatory-compliant HTML table for pharmaceutical content.
**Table Type**: ${request.tableType}
**Target Audience**: ${request?.context?.targetAudience}
**Therapeutic Area**: ${request?.context?.therapeuticArea}
**Data**: ${JSON.stringify(request.data)}
Requirements:
1. Professional medical/scientific formatting
2. Include appropriate headers and subheaders
3. Apply statistical significance indicators (*, †, ‡) where relevant
4. Generate footnotes for abbreviations and clarifications
5. Ensure accessibility (proper th/td usage, scope attributes)
6. Use responsive table structure (max-width: 100%)
7. Apply zebra striping for readability
8. Include p-values, confidence intervals as appropriate

Return ONLY valid JSON:
{
  "tableHTML": "<table>\\n...\\n</table>",
  "caption": "descriptive table caption",
  "footnotes": ["footnote 1", "footnote 2"],
  "abbreviations": [{"abbr": "CI", "full": "Confidence Interval"}]
}`;

    // Lovable AI call (same model & message scheme)
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a pharmaceutical table generation system. Return only valid JSON.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content ?? '{}';

    // Try to parse JSON; if it fails, fall back
    let tableData;
    try {
      tableData = JSON.parse(content);
    } catch {
      tableData = {
        tableHTML: generateFallbackTable(request),
        caption: `${String(request.tableType || 'Data').charAt(0).toUpperCase()}${String(request.tableType || 'data').slice(1)} Data Table`,
        footnotes: ['Data generated from provided inputs'],
        abbreviations: [],
      };
    }

    // Return success payload consistent with original handler
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(200)
      .json({
        success: true,
        ...tableData,
        regulatoryNotes: generateRegulatoryNotes(request),
      });
  } catch (error) {
    console.error('Error generating table:', error);
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(500)
      .json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
  }
});

// ---- Fallback table generator (same logic) ----
function generateFallbackTable(request) {
  const data = Array.isArray(request.data) ? request.data : [request.data].filter(Boolean);
  if (!data || data.length === 0) {
    return `
<table style="width:100%;max-width:100%;border-collapse:collapse;">
  <tr><td>No data available</td></tr>
</table>
`;
  }

  const headers = Object.keys(data[0] || {});
  const headerRow = headers
    .map((h) => `<th scope="col" style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">${h}</th>`)
    .join('');

  const bodyRows = data
    .map((row, idx) => {
      const cells = headers
        .map((h) => `<td style="padding:8px;border-bottom:1px solid #eee;background:${idx % 2 ? '#fafafa' : '#fff'};">${row[h] ?? '-'}</td>`)
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  return `
<table style="width:100%;max-width:100%;border-collapse:collapse;">
  <thead><tr>${headerRow}</tr></thead>
  <tbody>${bodyRows}</tbody>
</table>
`;
}

// ---- Regulatory notes (same logic) ----
function generateRegulatoryNotes(request) {
  const notes = [];

  if (request?.context?.targetAudience === 'HCP') {
    notes.push('This table is intended for healthcare professional use only');
  }
  if (request?.tableType === 'efficacy' || request?.tableType === 'safety') {
    notes.push('All data should be reviewed in context of full prescribing information');
  }
  if (request?.formatting?.highlightSignificant) {
    notes.push('Statistical significance denoted by * (p<0.05), † (p<0.01), ‡ (p<0.001)');
  }

  return notes;
}

