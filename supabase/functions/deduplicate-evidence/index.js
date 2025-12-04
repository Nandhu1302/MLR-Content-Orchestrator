import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Removed TypeScript interface DeduplicationStats

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Removed non-null assertion operator (!)
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
      // Added check for runtime stability
      return new Response(
          JSON.stringify({ 
              success: false, 
              error: "Supabase environment variables not configured."
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Removed the explicit type annotation : DeduplicationStats
  const stats = {
    contentModules: { duplicates: 0, deleted: 0 },
    contentSegments: { duplicates: 0, deleted: 0 },
    safetyStatements: { duplicates: 0, deleted: 0 },
    visualAssets: { duplicates: 0, deleted: 0 },
    totalDeleted: 0,
    errors: []
  };

  console.log('Starting deduplication process...');

  try {
    // 1. Deduplicate Content Modules (479 duplicates)
    console.log('Processing content_modules...');
    // Removed explicit type annotation in select
    const { data: modules } = await supabase
      .from('content_modules')
      .select('id, module_text, brand_id, created_at')
      .order('created_at', { ascending: false });

    if (modules) {
      // Removed explicit type annotation in Map and forEach
      const moduleGroups = new Map();
      modules.forEach(m => {
        const key = `${m.module_text}__${m.brand_id}`;
        if (!moduleGroups.has(key)) {
          // Removed non-null assertion operator (!)
          moduleGroups.set(key, []);
        }
        moduleGroups.get(key).push(m);
      });

      for (const [_, group] of moduleGroups) {
        if (group.length > 1) {
          stats.contentModules.duplicates += group.length - 1;
          const keepId = group[0].id;
          const deleteIds = group.slice(1).map(m => m.id);

          // Update references before deleting
          for (const deleteId of deleteIds) {
            // Update parent_module_id references
            await supabase
              .from('content_modules')
              .update({ parent_module_id: keepId })
              .eq('parent_module_id', deleteId);
          }

          // Delete duplicates
          const { error } = await supabase
            .from('content_modules')
            .delete()
            .in('id', deleteIds);

          if (error) {
            stats.errors.push(`Module deletion error: ${error.message}`);
          } else {
            stats.contentModules.deleted += deleteIds.length;
          }
        }
      }
    }

    // 2. Deduplicate Content Segments (90 duplicates)
    console.log('Processing content_segments...');
    const { data: segments } = await supabase
      .from('content_segments')
      .select('id, segment_text, brand_id, created_at')
      .order('created_at', { ascending: false });

    if (segments) {
      const segmentGroups = new Map();
      segments.forEach(s => {
        const key = `${s.segment_text}__${s.brand_id}`;
        if (!segmentGroups.has(key)) {
          segmentGroups.set(key, []);
        }
        segmentGroups.get(key).push(s);
      });

      for (const [_, group] of segmentGroups) {
        if (group.length > 1) {
          stats.contentSegments.duplicates += group.length - 1;
          const deleteIds = group.slice(1).map(s => s.id);

          const { error } = await supabase
            .from('content_segments')
            .delete()
            .in('id', deleteIds);

          if (error) {
            stats.errors.push(`Segment deletion error: ${error.message}`);
          } else {
            stats.contentSegments.deleted += deleteIds.length;
          }
        }
      }
    }

    // 3. Deduplicate Safety Statements (72 duplicates)
    console.log('Processing safety_statements...');
    const { data: statements } = await supabase
      .from('safety_statements')
      .select('id, statement_text, brand_id, created_at')
      .order('created_at', { ascending: false });

    if (statements) {
      const statementGroups = new Map();
      statements.forEach(s => {
        const key = `${s.statement_text}__${s.brand_id}`;
        if (!statementGroups.has(key)) {
          statementGroups.set(key, []);
        }
        statementGroups.get(key).push(s);
      });

      for (const [_, group] of statementGroups) {
        if (group.length > 1) {
          stats.safetyStatements.duplicates += group.length - 1;
          const keepId = group[0].id;
          const deleteIds = group.slice(1).map(s => s.id);

          // Update references in content_modules.required_safety_statements
          const { data: modulesWithRefs } = await supabase
            .from('content_modules')
            .select('id, required_safety_statements')
            .not('required_safety_statements', 'is', null);

          if (modulesWithRefs) {
            for (const module of modulesWithRefs) {
              let updated = false;
              // Removed explicit type annotation
              const refs = module.required_safety_statements || [];
              const newRefs = refs.map(refId => {
                if (deleteIds.includes(refId)) {
                  updated = true;
                  return keepId;
                }
                return refId;
              });

              if (updated) {
                await supabase
                  .from('content_modules')
                  .update({ required_safety_statements: Array.from(new Set(newRefs)) })
                  .eq('id', module.id);
              }
            }
          }

          // Delete duplicates
          const { error } = await supabase
            .from('safety_statements')
            .delete()
            .in('id', deleteIds);

          if (error) {
            stats.errors.push(`Statement deletion error: ${error.message}`);
          } else {
            stats.safetyStatements.deleted += deleteIds.length;
          }
        }
      }
    }

    // 4. Deduplicate Visual Assets (15 duplicates)
    console.log('Processing visual_assets...');
    const { data: visuals } = await supabase
      .from('visual_assets')
      .select('id, title, visual_type, source_page, brand_id, created_at')
      .order('created_at', { ascending: false });

    if (visuals) {
      const visualGroups = new Map();
      visuals.forEach(v => {
        const key = `${v.title}__${v.visual_type}__${v.source_page}__${v.brand_id}`;
        if (!visualGroups.has(key)) {
          visualGroups.set(key, []);
        }
        visualGroups.get(key).push(v);
      });

      for (const [_, group] of visualGroups) {
        if (group.length > 1) {
          stats.visualAssets.duplicates += group.length - 1;
          const deleteIds = group.slice(1).map(v => v.id);

          const { error } = await supabase
            .from('visual_assets')
            .delete()
            .in('id', deleteIds);

          if (error) {
            stats.errors.push(`Visual deletion error: ${error.message}`);
          } else {
            stats.visualAssets.deleted += deleteIds.length;
          }
        }
      }
    }

    stats.totalDeleted = 
      stats.contentModules.deleted +
      stats.contentSegments.deleted +
      stats.safetyStatements.deleted +
      stats.visualAssets.deleted;

    console.log('Deduplication complete:', stats);

    return new Response(
      JSON.stringify({ 
        success: true, 
        stats,
        message: `Successfully removed ${stats.totalDeleted} duplicate records` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) { // Removed type annotation ': any'
    console.error('Deduplication error:', error);
    // error.message is still available in JS
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stats 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});