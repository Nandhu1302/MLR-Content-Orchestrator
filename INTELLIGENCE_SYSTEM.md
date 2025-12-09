# Public Domain Intelligence System

## Overview
The Public Domain Intelligence System automatically collects, analyzes, and integrates real-world pharmaceutical market intelligence into brand guardrails. It uses AI-powered web search to gather competitive insights, regulatory updates, and market trends, then auto-enriches guardrails with this data.

## Implementation Status
- ✅ **Phase 1**: Intelligence Collection System (Complete)
- ✅ **Phase 2**: Auto-Enrichment & UI Integration (Complete)
- 🔄 **Phase 3**: Scheduled Refresh System (Planned)

## Architecture

### Database Tables

**1. `public_domain_insights`**
Stores insights discovered from authoritative sources like FDA.gov, ClinicalTrials.gov, PubMed, etc.
- Tracks source type (regulatory, competitive, clinical, market, industry)
- Stores title, summary, full content, and key findings
- Includes relevance scoring and status tracking
- Supports categorization by therapeutic area and market

**2. `competitive_intelligence_enriched`**
Stores competitive intelligence from public sources.
- Tracks competitor activities (clinical trials, press releases, positioning, etc.)
- Includes impact assessment and threat level
- Provides recommended actions
- Status tracking (active, addressed, archived)

**3. `intelligence_refresh_log`**
Logs all intelligence refresh operations.
- Tracks refresh type (manual, scheduled, on_demand)
- Records results (sources checked, insights found)
- Monitors performance (duration, errors)

### Edge Function

**`public-domain-intelligence-refresh`**
Performs intelligent web searches using Lovable AI to gather public domain insights.

**Key Features:**
- Uses Google Gemini 2.5 Flash for efficient AI-powered search
- Generates targeted search queries based on brand and therapeutic area
- Processes and structures results into actionable insights
- Stores findings in database for future use
- Comprehensive logging and error handling

**Search Sources Targeted:**
- FDA.gov (regulatory guidance, label updates)
- ClinicalTrials.gov (competitor pipeline, trial results)
- PubMed (clinical evidence, research)
- Industry publications (market trends, best practices)
- Healthcare publications (patient communication strategies)

### Service Layer

**`PublicDomainIntelligenceService`**
Provides convenient methods for triggering and accessing intelligence.

**Methods:**
- `refreshBrandIntelligence(brandId, searchScope)` - Trigger intelligence refresh
- `getBrandInsights(brandId, sourceType, limit)` - Retrieve stored insights
- `validateCompliance(...)` - Check content compliance
- `getContentRecommendations(...)` - Get AI-driven content suggestions

## Usage

### Trigger Intelligence Refresh

```typescript
import { PublicDomainIntelligenceService } from '@/services/publicDomainIntelligenceService';

// Refresh all intelligence for a brand
const result = await PublicDomainIntelligenceService.refreshBrandIntelligence(
  brandId,
  'all' // or 'regulatory', 'competitive', 'clinical', 'market'
);

console.log(`Found ${result.insightsFound} insights from ${result.sourcesChecked} sources`);
```

### Retrieve Brand Insights

```typescript
// Get recent insights
const insights = await PublicDomainIntelligenceService.getBrandInsights(
  brandId,
  'regulatory', // optional filter by source type
  10 // limit
);

insights.forEach(insight => {
  console.log(`${insight.title} - Relevance: ${insight.relevance_score}`);
  console.log(`Key Findings:`, insight.key_findings);
});
```

### Direct Database Access

```typescript
import { supabase } from '@/integrations/supabase/client';

// Query insights with custom filters
const { data } = await supabase
  .from('public_domain_insights')
  .select('*')
  .eq('brand_id', brandId)
  .eq('status', 'new')
  .gte('relevance_score', 0.7)
  .order('discovered_at', { ascending: false })
  .limit(20);
```

## Example: Dupixent Intelligence Refresh

The system has already populated comprehensive guardrails for Dupixent including:

**Brand Guidelines:**
- Tone of voice: Empowering and Supportive, Scientific yet Accessible
- Key messaging pillars focused on IL-4/IL-13 pathway
- Visual standards and imagery guidelines

**Competitive Landscape:**
- Rinvoq (high threat): JAK inhibitor competitive positioning
- Adbry (medium threat): IL-13 only competitor
- Cibinqo (medium threat): Another JAK inhibitor with black box warnings

**Regulatory Framework:**
- FDA compliance requirements and templates
- Fair balance requirements with detailed metrics
- Claim substantiation guidelines
- MLR review requirements

**Market Positioning:**
- Leadership claims (400,000+ patients treated)
- Differentiation points (dual IL-4/IL-13 inhibition)
- Clinical evidence from pivotal trials
- Real-world evidence and patient outcomes

## Testing the System

### Phase 1: Intelligence Collection

1. **Select Dupixent as your brand** in the application
2. **Open the Dashboard** and click on the Guardrails Health Card
3. **Navigate to the Intelligence tab** in the Guardrails Admin Drawer
4. **Click "Collect Intelligence"** to trigger a fresh intelligence refresh

### Phase 2: Auto-Enrichment & UI Integration

1. **Check Intelligence Status** on the Dashboard Guardrails Health Card:
   - Intelligence freshness badge (Fresh/Stale/None)
   - Fresh insights count
   - Last enrichment timestamp (hover for tooltip)

2. **View Intelligence Feed**:
   - Open Guardrails Admin Drawer → Intelligence tab
   - See all collected insights with:
     - Source attribution
     - Relevance scores
     - Key findings
     - External links to original sources

3. **Trigger Manual Refresh**:
   - Click "Refresh Intelligence" button
   - System will:
     - Collect latest public domain data
     - Auto-enrich guardrails with new insights
     - Update intelligence metadata
     - Show toast notification when complete

4. **Monitor Intelligence Metadata**:
   - Total insights collected
   - Fresh insights (last 7 days)
   - Last refresh timestamp
   - Intelligence status indicator

## Next Steps: Phase 3 - Scheduled Refresh

Phase 3 will implement automated intelligence refresh:

1. **Scheduled Refresh System**
   - Weekly/monthly automatic refreshes using pg_cron
   - Background processing without user intervention
   - Configurable schedules per brand

2. **Guardrail Enrichment**
   - ✅ Merge fresh public domain data with existing guardrails (COMPLETE)
   - ✅ Update brand guidelines with latest industry practices (COMPLETE)
   - ✅ Enhance competitive intelligence with recent developments (COMPLETE)
   - Change detection and comparison views

3. **Intelligence Notifications**
   - ✅ Display freshness indicators in UI (COMPLETE)
   - ✅ Show "last updated" timestamps (COMPLETE)
   - Email alerts for significant intelligence updates
   - Highlight important changes requiring review

## Security & Compliance

- **Row Level Security (RLS)**: All tables have proper RLS policies
- **User-based access**: Users can only view insights for brands they have access to
- **Demo user access**: Demo users can manage all intelligence data
- **Data validation**: Check constraints on source types, statuses, threat levels
- **Audit trail**: Comprehensive logging in `intelligence_refresh_log`

## Performance Considerations

- **Indexed queries**: Optimized indexes on brand_id, source_type, status, dates
- **Batch processing**: Edge function processes multiple queries efficiently
- **Rate limiting**: AI API calls are managed to avoid rate limits
- **Caching**: Results stored in database to minimize redundant searches
- **Relevance scoring**: Only stores high-relevance insights (threshold-based)

## Monitoring & Debugging

Check refresh logs:
```sql
SELECT * FROM intelligence_refresh_log 
ORDER BY started_at DESC 
LIMIT 10;
```

Check recent insights:
```sql
SELECT 
  source_type, 
  COUNT(*) as count,
  AVG(relevance_score) as avg_relevance
FROM public_domain_insights
WHERE discovered_at > NOW() - INTERVAL '7 days'
GROUP BY source_type;
```

## Current Features

### Phase 1: Intelligence Collection ✅
- AI-powered web search using Lovable AI (Gemini 2.5 Flash)
- Multi-source intelligence gathering
- Automatic relevance scoring and categorization
- Structured data extraction from web sources
- Comprehensive logging and error handling

### Phase 2: Auto-Enrichment & UI Integration ✅
- **Auto-enrichment**: Automatically merges fresh intelligence into guardrails
- **Intelligence metadata tracking**: Freshness status, insight counts, refresh dates
- **Manual refresh capability**: One-click intelligence refresh from UI
- **Intelligence feed UI**: Visual display of collected insights with sources
- **Dashboard indicators**: Intelligence status badges and fresh insight counters
- **Freshness tooltips**: Last enrichment timestamps on hover
- **Service methods**: `enrichGuardrailsWithIntelligence()`, `getIntelligenceMetadata()`
- **Hook enhancements**: `useGuardrails` includes intelligence data and refresh actions

### Phase 3: Scheduled Refresh (Planned)
- Automated weekly/monthly intelligence refreshes
- Configurable schedules per brand
- Email notifications for updates
- Change detection and comparison views

## Configuration

Edge function configuration in `supabase/config.toml`:
```toml
[functions.public-domain-intelligence-refresh]
verify_jwt = false
```

Required secrets (automatically configured):
- `LOVABLE_API_KEY` - For AI-powered searches
- `SUPABASE_URL` - Database connection
- `SUPABASE_SERVICE_ROLE_KEY` - Database write access
