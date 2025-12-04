// ============================================
// Asset Orchestrator Agent
// Packages theme into asset structures
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// The TypeScript interface ComposeEmailRequest has been removed.

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Type annotation removed
    const startTime = Date.now();
    const request = await req.json();
    
    // Non-null assertion operator (!) removed, check added
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables not configured.");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Get intelligence decisions
    const intelligenceDecisions = await getIntelligenceDecisions(request, lovableApiKey);
    
    // Step 2: Generate components in parallel
    const [visualizations, tables] = await Promise.all([
      intelligenceDecisions.includeVisualizations && request.structuredData
        ? generateVisualizations(request, supabase)
        : Promise.resolve([]),
      intelligenceDecisions.includeTables && request.structuredData
        ? generateTables(request, supabase)
        : Promise.resolve([])
    ]);

    // Step 3: Render email template
    const emailHTML = await renderEmailTemplate({
      textContent: request.textContent,
      visualizations,
      tables,
      context: request.context,
      templateStyle: request.preferences?.templateStyle || 'professional'
    });

    // Step 4: Save composed email
    const { data: composedEmail } = await supabase
      .from('composed_emails')
      .insert({
        asset_id: request.assetId,
        brand_id: request.brandId,
        email_html: emailHTML,
        email_structure: {
          components: { visualizations, tables },
          layout: { templateStyle: request.preferences?.templateStyle || 'professional' }
        },
        components_used: {
          text: true,
          visualizations: visualizations.length > 0,
          tables: tables.length > 0
        },
        intelligence_decisions: intelligenceDecisions,
        quality_scores: {
          overall: intelligenceDecisions.confidence
        }
      })
      .select()
      .single();

    const processingTimeMs = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        success: true,
        emailHTML,
        emailStructure: {
          components: {
            text: request.textContent,
            visualizations,
            tables,
            images: []
          },
          layout: {
            templateUsed: request.preferences?.templateStyle || 'professional',
            sectionsIncluded: ['text', ...(visualizations.length > 0 ? ['visualizations'] : []), ...(tables.length > 0 ? ['tables'] : [])],
            totalComponents: 1 + visualizations.length + tables.length
          }
        },
        intelligenceReport: {
          decisionsHade: intelligenceDecisions.decisions,
          componentsIncluded: [
            'text',
            ...(visualizations.length > 0 ? ['visualizations'] : []),
            ...(tables.length > 0 ? ['tables'] : [])
          ],
          componentsExcluded: [
            ...(visualizations.length === 0 && request.structuredData ? ['visualizations'] : []),
            ...(tables.length === 0 && request.structuredData ? ['tables'] : [])
          ],
          qualityScore: intelligenceDecisions.confidence
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          processingTimeMs,
          aiModelUsed: 'google/gemini-2.5-flash'
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error composing email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Type annotations removed
async function getIntelligenceDecisions(request, apiKey) {
  const prompt = `You are an expert pharmaceutical content strategist. 

Analyze this email context and decide which visual components to include:

**Email Purpose**: ${request.contentIntent}
**Target Audience**: ${request.context.targetAudience}
**Therapeutic Area**: ${request.context.therapeuticArea}
**Available Data**: ${request.structuredData ? 'Yes (clinical/efficacy/safety data)' : 'No'}
**Regulatory Level**: ${request.context.regulatoryLevel}

Based on pharmaceutical best practices, decide:

1. **Should include data visualizations?** (YES/NO with rationale)
   - Clinical trial data = charts/graphs
   - Efficacy comparisons = comparison tables
   - Safety data = structured tables

2. **Should include data tables?** (YES/NO with rationale)
   - Detailed statistical data = YES
   - Patient audience = NO (simplified visuals instead)

3. **Confidence score** (0-100) in these decisions

Return ONLY valid JSON:
{
  "includeVisualizations": true/false,
  "includeTables": true/false,
  "confidence": 85,
  "decisions": [
    {"decision": "Include visualizations", "rationale": "Clinical data benefits from visual representation", "confidence": 90},
    {"decision": "Include tables", "rationale": "HCP audience expects detailed data", "confidence": 85}
  ]
}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a pharmaceutical content intelligence system. Return only valid JSON." },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`AI gateway error: ${response.status}`);
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content || "{}";
  
  try {
    return JSON.parse(content);
  } catch {
    // Fallback to defaults if parsing fails
    return {
      includeVisualizations: !!request.structuredData && request.context.targetAudience === 'HCP',
      includeTables: !!request.structuredData && request.context.targetAudience === 'HCP',
      confidence: 60,
      decisions: [
        { decision: "Default fallback", rationale: "AI parsing failed", confidence: 60 }
      ]
    };
  }
}

// Type annotations removed
async function generateVisualizations(request, supabase) {
  const visualizations = [];
  const structured = request.structuredData;
  
  // Generate Clinical Trials Comparison Chart
  if (structured?.clinicalTrialResults && Array.isArray(structured.clinicalTrialResults) && structured.clinicalTrialResults.length > 0) {
    try {
      console.log('Generating clinical trials comparison chart from PI data...');
      // Type assertion removed
      const chartData = structured.clinicalTrialResults.map((trial) => ({
        name: trial.studyName || 'Study',
        treatment: parseFloat(trial.treatment) || 0,
        control: parseFloat(trial.control) || 0,
        endpoint: trial.endpoint
      }));

      const { data, error } = await supabase.functions.invoke('generate-data-visualization', {
        body: {
          visualizationType: 'bar',
          data: chartData,
          context: {
            title: 'Clinical Trial Results Comparison',
            description: 'Treatment vs Control Outcomes',
            therapeuticArea: request.context.therapeuticArea,
            purpose: 'Show efficacy comparison from clinical trials'
          },
          stylePreferences: {
            colorScheme: 'clinical',
            showLegend: true,
            showGrid: true
          }
        }
      });

      if (error) {
        console.error('Error generating clinical trials visualization:', error);
      } else if (data?.success && data.svgMarkup) {
        const svgBase64 = btoa(data.svgMarkup);
        visualizations.push({
          id: `viz-trials-${Date.now()}`,
          type: 'clinical-trials-chart',
          title: 'Clinical Trial Results',
          svgMarkup: data.svgMarkup,
          imageUrl: `data:image/svg+xml;base64,${svgBase64}`,
          // Type assertion removed
          altText: data.configuration?.accessibility?.altText || 'Clinical trial results comparing treatment vs control outcomes',
          captionHTML: data.configuration?.insights?.summary || 'Clinical trial data showing treatment efficacy',
          dataSource: 'Prescribing Information'
        });
        console.log('Clinical trials visualization generated successfully');
      }
    } catch (error) {
      console.error('Exception generating clinical trials visualization:', error);
    }
  }

  // Generate Competitor Comparison Chart
  if (structured?.competitorComparison && Array.isArray(structured.competitorComparison) && structured.competitorComparison.length > 0) {
    try {
      console.log('Generating competitor comparison chart...');
      // Type assertion removed
      const compChartData = structured.competitorComparison.map((comp) => ({
        name: comp.competitorName || comp.competitor_name || 'Competitor',
        ourValue: parseFloat(comp.ourValue || comp.our_value) || 0,
        theirValue: parseFloat(comp.theirValue || comp.their_value) || 0,
        metric: comp.metric
      }));

      const { data, error } = await supabase.functions.invoke('generate-data-visualization', {
        body: {
          visualizationType: 'bar',
          data: compChartData,
          context: {
            title: 'Competitive Advantage',
            description: 'Our Treatment vs Competitor Comparisons',
            therapeuticArea: request.context.therapeuticArea,
            purpose: 'Demonstrate competitive superiority'
          },
          stylePreferences: {
            colorScheme: 'competitive',
            showLegend: true,
            showGrid: true
          }
        }
      });

      if (error) {
        console.error('Error generating competitor comparison visualization:', error);
      } else if (data?.success && data.svgMarkup) {
        const svgBase64 = btoa(data.svgMarkup);
        visualizations.push({
          id: `viz-competitor-${Date.now()}`,
          type: 'competitor-comparison',
          title: 'Competitive Comparison',
          svgMarkup: data.svgMarkup,
          imageUrl: `data:image/svg+xml;base64,${svgBase64}`,
          altText: data.configuration?.accessibility?.altText || 'Competitor comparison showing our competitive advantages',
          captionHTML: data.configuration?.insights?.summary || 'Competitive positioning data',
          dataSource: 'Market Intelligence'
        });
        console.log('Competitor comparison visualization generated successfully');
      }
    } catch (error) {
      console.error('Exception generating competitor comparison visualization:', error);
    }
  }

  // Generate Efficacy Data Chart
  if (structured?.efficacyData && Array.isArray(structured.efficacyData) && structured.efficacyData.length > 0) {
    try {
      console.log('Generating efficacy chart from PI data...');
      // Type assertion removed
      const efficacyChartData = structured.efficacyData.map((eff) => ({
        metric: eff.metric || 'Efficacy',
        value: parseFloat(eff.value) || 0,
        timepoint: eff.timepoint
      }));

      const { data, error } = await supabase.functions.invoke('generate-data-visualization', {
        body: {
          visualizationType: 'line',
          data: efficacyChartData,
          context: {
            title: 'Efficacy Over Time',
            description: 'Key efficacy metrics and outcomes',
            therapeuticArea: request.context.therapeuticArea,
            purpose: 'Demonstrate efficacy progression'
          },
          stylePreferences: {
            colorScheme: 'clinical',
            showLegend: true,
            showGrid: true
          }
        }
      });

      if (error) {
        console.error('Error generating efficacy visualization:', error);
      } else if (data?.success && data.svgMarkup) {
        const svgBase64 = btoa(data.svgMarkup);
        visualizations.push({
          id: `viz-efficacy-${Date.now()}`,
          type: 'efficacy-chart',
          title: 'Efficacy Results',
          svgMarkup: data.svgMarkup,
          imageUrl: `data:image/svg+xml;base64,${svgBase64}`,
          altText: data.configuration?.accessibility?.altText || 'Efficacy data over time showing key metrics',
          captionHTML: data.configuration?.insights?.summary || 'Efficacy data from clinical studies',
          dataSource: 'Prescribing Information'
        });
        console.log('Efficacy visualization generated successfully');
      }
    } catch (error) {
      console.error('Exception generating efficacy visualization:', error);
    }
  }
  
  return visualizations;
}

// Type annotations removed
async function generateTables(request, supabase) {
  const tables = [];
  const structured = request.structuredData;
  
  // Generate Clinical Trials Table
  if (structured?.clinicalTrialResults && Array.isArray(structured.clinicalTrialResults) && structured.clinicalTrialResults.length > 0) {
    try {
      console.log('Generating clinical trials table from PI data...');
      const { data, error } = await supabase.functions.invoke('generate-structured-table', {
        body: {
          tableType: 'clinical-trials',
          data: structured.clinicalTrialResults,
          context: {
            therapeuticArea: request.context.therapeuticArea,
            targetAudience: request.context.targetAudience,
            title: 'Clinical Trial Results Summary'
          },
          formatting: {
            highlightSignificant: true,
            includeStatistics: true
          }
        }
      });

      if (error) {
        console.error('Error generating clinical trials table:', error);
      } else if (data?.success && data.tableData?.htmlTable) {
        tables.push({
          id: `table-trials-${Date.now()}`,
          type: 'clinical-trials-table',
          title: 'Clinical Trial Results',
          tableHTML: data.tableData.htmlTable,
          caption: data.tableData.caption,
          footnotes: data.tableData.footnotes || []
        });
        console.log('Clinical trials table generated successfully');
      }
    } catch (error) {
      console.error('Exception generating clinical trials table:', error);
    }
  }

  // Generate Efficacy Data Table
  if (structured?.efficacyData && Array.isArray(structured.efficacyData) && structured.efficacyData.length > 0) {
    try {
      console.log('Generating efficacy table from PI data...');
      const { data, error } = await supabase.functions.invoke('generate-structured-table', {
        body: {
          tableType: 'efficacy',
          data: structured.efficacyData,
          context: {
            therapeuticArea: request.context.therapeuticArea,
            targetAudience: request.context.targetAudience,
            title: 'Efficacy Outcomes'
          },
          formatting: {
            highlightSignificant: true,
            includeStatistics: true
          }
        }
      });

      if (error) {
        console.error('Error generating efficacy table:', error);
      } else if (data?.success && data.tableData?.htmlTable) {
        tables.push({
          id: `table-efficacy-${Date.now()}`,
          type: 'efficacy-table',
          title: 'Efficacy Data',
          tableHTML: data.tableData.htmlTable,
          caption: data.tableData.caption,
          footnotes: data.tableData.footnotes || []
        });
        console.log('Efficacy table generated successfully');
      }
    } catch (error) {
      console.error('Exception generating efficacy table:', error);
    }
  }

  // Generate Market Insights Table
  if (structured?.marketInsights && Object.keys(structured.marketInsights).length > 0) {
    try {
      console.log('Generating market insights table...');
      
      // Transform market insights into table-friendly format
      const marketData = [
        { aspect: 'Market Size', value: structured.marketInsights.marketSize || structured.marketInsights.market_size || 'N/A' },
        { aspect: 'Growth Rate', value: structured.marketInsights.growthRate || structured.marketInsights.growth_rate || 'N/A' },
        // Type assertion removed
        { aspect: 'Key Trends', value: (structured.marketInsights.keyTrends || structured.marketInsights.key_trends || []).join(', ') },
        { aspect: 'Unmet Needs', value: (structured.marketInsights.unmetNeeds || structured.marketInsights.unmet_needs || []).join(', ') },
        { aspect: 'Target Segments', value: (structured.marketInsights.targetSegments || structured.marketInsights.target_segments || []).join(', ') }
      ].filter(item => item.value && item.value !== 'N/A');

      if (marketData.length > 0) {
        const { data, error } = await supabase.functions.invoke('generate-structured-table', {
          body: {
            tableType: 'market-insights',
            data: marketData,
            context: {
              therapeuticArea: request.context.therapeuticArea,
              targetAudience: request.context.targetAudience,
              title: 'Market Landscape & Opportunities'
            },
            formatting: {
              highlightSignificant: true,
              includeStatistics: false
            }
          }
        });

        if (error) {
          console.error('Error generating market insights table:', error);
        } else if (data?.success && data.tableData?.htmlTable) {
          tables.push({
            id: `table-market-${Date.now()}`,
            type: 'market-insights',
            title: 'Market Intelligence',
            tableHTML: data.tableData.htmlTable,
            caption: data.tableData.caption,
            footnotes: data.tableData.footnotes || []
          });
          console.log('Market insights table generated successfully');
        }
      }
    } catch (error) {
      console.error('Exception generating market insights table:', error);
    }
  }

  // Generate Safety Profile Table
  if (structured?.safetyData && Array.isArray(structured.safetyData) && structured.safetyData.length > 0) {
    try {
      console.log('Generating safety profile table from PI data...');
      const { data, error } = await supabase.functions.invoke('generate-structured-table', {
        body: {
          tableType: 'safety',
          data: structured.safetyData,
          context: {
            therapeuticArea: request.context.therapeuticArea,
            targetAudience: request.context.targetAudience,
            title: 'Safety Profile'
          },
          formatting: {
            highlightSignificant: true,
            includeSeverity: true
          }
        }
      });

      if (error) {
        console.error('Error generating safety table:', error);
      } else if (data?.success && data.tableData?.htmlTable) {
        tables.push({
          id: `table-safety-${Date.now()}`,
          type: 'safety-table',
          title: 'Safety Data',
          tableHTML: data.tableData.htmlTable,
          caption: data.tableData.caption,
          footnotes: data.tableData.footnotes || []
        });
        console.log('Safety table generated successfully');
      }
    } catch (error) {
      console.error('Exception generating safety table:', error);
    }
  }
  
  return tables;
}

// Type annotations removed
async function renderEmailTemplate(data) {
  const { textContent, visualizations, tables, context } = data;
  
  // Parse body content for placement markers and insert visualizations inline
  let bodyHTML = textContent.body || '';
  
  // Find and replace [INSERT_CHART: type] markers
  const chartMarkerRegex = /\[INSERT_CHART:\s*([\w-]+)\]/g;
  let chartMatch;
  while ((chartMatch = chartMarkerRegex.exec(bodyHTML)) !== null) {
    const chartType = chartMatch[1];
    // Type assertion removed
    const chart = visualizations?.find((v) => 
      v.type === chartType || 
      v.title?.toLowerCase().includes(chartType.replace(/-/g, ' '))
    );
    
    if (chart) {
      const chartHTML = `
        <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="color: #1e40af; font-size: 18px; margin-top: 0;">${chart.title}</h3>
          ${chart.imageUrl ? `<img src="${chart.imageUrl}" alt="${chart.altText}" style="width: 100%; height: auto; margin: 15px 0;" />` : chart.svgMarkup || ''}
          ${chart.captionHTML ? `<p style="font-size: 12px; color: #64748b; margin-top: 8px; font-style: italic;">${chart.captionHTML}</p>` : ''}
        </div>
      `;
      bodyHTML = bodyHTML.replace(chartMatch[0], chartHTML);
    } else {
      // Remove marker if no matching chart found
      bodyHTML = bodyHTML.replace(chartMatch[0], '');
    }
  }
  
  // Find and replace [INSERT_TABLE: type] markers
  const tableMarkerRegex = /\[INSERT_TABLE:\s*([\w-]+)\]/g;
  let tableMatch;
  while ((tableMatch = tableMarkerRegex.exec(bodyHTML)) !== null) {
    const tableType = tableMatch[1];
    // Type assertion removed
    const table = tables?.find((t) => 
      t.type === tableType || 
      t.caption?.toLowerCase().includes(tableType.replace(/-/g, ' '))
    );
    
    if (table) {
      const tableHTML = `
        <div style="margin: 30px 0;">
          <h3 style="color: #1e40af; font-size: 18px; margin-bottom: 15px;">${table.caption}</h3>
          ${table.tableHTML}
          ${table.footnotes && table.footnotes.length > 0 ? `
            <div style="font-size: 12px; color: #64748b; margin-top: 8px; font-style: italic;">
              ${table.footnotes.join(' ')}
            </div>
          ` : ''}
        </div>
      `;
      bodyHTML = bodyHTML.replace(tableMatch[0], tableHTML);
    } else {
      // Remove marker if no matching table found
      bodyHTML = bodyHTML.replace(tableMatch[0], '');
    }
  }
  
  // Collect remaining visualizations/tables that weren't inserted inline
  const insertedChartTypes = new Set();
  const insertedTableTypes = new Set();
  
  // Type assertion removed
  visualizations?.forEach((v) => {
    if (bodyHTML.includes(v.title)) insertedChartTypes.add(v.type);
  });
  
  // Type assertion removed
  tables?.forEach((t) => {
    if (bodyHTML.includes(t.caption)) insertedTableTypes.add(t.type);
  });
  
  // Type assertion removed
  const remainingVisualizations = visualizations?.filter((v) => !insertedChartTypes.has(v.type));
  const remainingTables = tables?.filter((t) => !insertedTableTypes.has(t.type));
  
  const hasVisualizations = visualizations.length > 0;
  const hasTables = tables.length > 0;
  
  // Template rendering logic simplified for JS compatibility (removed the duplicate logic and focused on the last version)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${textContent.subject}</title>
  <style>
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { padding: 30px 40px 20px; }
    .headline { font-size: 28px; line-height: 1.3; color: #1a1a1a; margin: 0; }
    .body-text { padding: 0 40px 30px; font-size: 16px; line-height: 1.6; color: #333333; }
    .visual-section { padding: 0 40px 30px; }
    .table-section { padding: 0 40px 30px; }
    .cta-section { padding: 0 40px 30px; text-align: center; }
    .cta-button { display: inline-block; padding: 15px 40px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; }
    .cta-button:hover { background-color: #0056b3; }
    .disclaimer { padding: 30px 40px; background-color: #f9f9f9; border-top: 1px solid #e0e0e0; font-size: 11px; line-height: 1.5; color: #666666; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }
    th { background-color: #f0f0f0; font-weight: bold; }
  </style>
</head>
<body style="background-color: #f4f4f4; margin: 0; padding: 20px 0;">
  <div class="container">
    ${textContent.preheader ? `<div style="display:none;">${textContent.preheader}</div>` : ''}
    
    <div class="header">
      <h1 class="headline">${textContent.headline}</h1>
    </div>
    
    <div class="body-text">
      ${bodyHTML}
    </div>
    
    ${hasVisualizations ? `
    <div style="margin: 40px 40px 30px; padding: 30px; background: #f8f9fa; border-radius: 8px;">
      <h2 style="font-size: 20px; font-weight: bold; color: #1a1a1a; margin: 0 0 25px; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">📊 Clinical Evidence</h2>
      ${remainingVisualizations.map((viz) => `
        <div style="margin: 30px 0;">
          <h3 style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #333;">${viz.title || 'Clinical Data'}</h3>
          <div style="text-align: center; background: white; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${viz.svgMarkup || `<img src="${viz.imageUrl}" alt="${viz.altText}" style="max-width: 100%; height: auto;" />`}
          </div>
          ${viz.captionHTML ? `<p style="font-size: 14px; color: #666; margin: 15px 0 0; font-style: italic;">${viz.captionHTML}</p>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${hasTables ? `
    <div style="margin: 0 40px 30px;">
      <h2 style="font-size: 20px; font-weight: bold; color: #1a1a1a; margin: 0 0 25px; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">📋 Clinical Data Summary</h2>
      ${remainingTables.map((tbl) => `
        <div style="margin: 30px 0; background: white; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="font-size: 16px; font-weight: 600; color: #333; margin: 0 0 15px;">${tbl.title || 'Clinical Data'}</h3>
          ${tbl.caption ? `<p style="font-size: 14px; color: #666; margin-bottom: 15px;">${tbl.caption}</p>` : ''}
          <div style="overflow-x: auto;">
            ${tbl.tableHTML}
          </div>
          ${tbl.footnotes && tbl.footnotes.length > 0 ? `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 8px;">Notes:</p>
              ${tbl.footnotes.map((fn) => `<p style="font-size: 11px; color: #666; margin: 4px 0;">• ${fn}</p>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    <div class="cta-section">
      <a href="#" class="cta-button">${textContent.cta}</a>
    </div>
    
    <div class="disclaimer">
      <strong>Important Safety Information:</strong><br>
      ${textContent.disclaimer}
    </div>
  </div>
</body>
</html>`;
}