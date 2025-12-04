import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Sparkles, FileText, AlertCircle } from 'lucide-react';

export const PIEvidenceBadge = ({ intakeContext, metadata, themeEnrichmentStatus }) => {
  const piFilteringResult = intakeContext?.piFilteringResult;
  const strategicContext = intakeContext?.strategicContext;
  const hasPIEvidence = !!piFilteringResult && Object.keys(piFilteringResult.selectedSections || {}).length > 0;
  
  // Check if content was AI generated with PI data
  const generatedWithPI = metadata?.generation_sources && 
    Object.values(metadata.generation_sources).some(source => source === 'ai_with_pi_data');

  // Check if intelligence layers were used in generation
  const intelligenceLayersUsed = metadata?.intelligence_layers_used || [];
  const wasGeneratedWithIntelligence = intelligenceLayersUsed.length > 0;
  
  // Theme is enriched if status is 'ready-for-use' OR if intelligence layers were used in generation
  const isThemeEnriched = themeEnrichmentStatus === 'ready-for-use' || wasGeneratedWithIntelligence;

  if (!hasPIEvidence && !strategicContext) {
    // No strategic context or PI data - basic content
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1.5 ${
                isThemeEnriched 
                  ? 'border-blue-500/50 text-blue-700 bg-blue-50/50' 
                  : 'border-amber-500/50 text-amber-700 bg-amber-50/50'
              }`}
            >
              <FileText className="h-3 w-3" />
              <span className="text-xs">
                {isThemeEnriched ? 'Theme (Enriched)' : 'Theme (Basic)'}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">
                {isThemeEnriched ? 'Enriched Theme Content' : 'Basic Theme Content'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isThemeEnriched 
                  ? wasGeneratedWithIntelligence 
                    ? `Generated with ${intelligenceLayersUsed.length} intelligence layer${intelligenceLayersUsed.length !== 1 ? 's' : ''}: ${intelligenceLayersUsed.join(', ')}. Add documents in Document Library for clinical evidence integration.`
                    : 'Generated from theme with strategic intelligence. Add documents in Document Library for clinical evidence integration.'
                  : 'Generated from basic theme data. Enrich theme with intelligence and add documents in Document Library for enhanced content.'
                }
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!hasPIEvidence && strategicContext) {
    // Strategic context exists but no PI evidence
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className="flex items-center gap-1.5 border-amber-500/50 text-amber-700 bg-amber-50/50"
            >
              <AlertCircle className="h-3 w-3" />
              <span className="text-xs">Strategic Only</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-medium">Strategic Context Applied</p>
              <p className="text-sm text-muted-foreground">
                Content aligned with campaign objective: <strong>{strategicContext.campaignObjective}</strong>
              </p>
              <p className="text-sm text-amber-600">
                <strong>No PI evidence integrated.</strong> Add documents in Document Library to enhance with clinical data.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Has PI evidence - show relevance score
  const relevanceScore = piFilteringResult.relevanceScore;
  const selectedSectionsCount = Object.keys(piFilteringResult.selectedSections).length;
  
  // Determine badge color based on relevance score
  const getScoreColor = (score) => {
    if (score >= 80) return {
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-500/50',
      text: 'text-emerald-700'
    };
    if (score >= 60) return {
      bg: 'bg-blue-50/50',
      border: 'border-blue-500/50',
      text: 'text-blue-700'
    };
    return {
      bg: 'bg-amber-50/50',
      border: 'border-amber-500/50',
      text: 'text-amber-700'
    };
  };

  const colors = getScoreColor(relevanceScore);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1.5 ${colors.border} ${colors.text} ${colors.bg}`}
          >
            <Sparkles className="h-3 w-3" />
            <span className="text-xs font-semibold">PI Evidence</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/60 font-bold">
              {relevanceScore}%
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-md">
          <div className="space-y-3">
            <div>
              <p className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Evidence-Based Content
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Generated with clinical evidence tailored to campaign objectives
              </p>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Relevance Score:</span>
                <span className={`font-bold ${colors.text}`}>{relevanceScore}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">PI Sections Used:</span>
                <span className="font-medium">{selectedSectionsCount}</span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs font-medium mb-1.5">Strategic Alignment:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Objective:</span> {strategicContext?.campaignObjective}
                </div>
                <div>
                  <span className="font-medium">Indication:</span> {strategicContext?.indication}
                </div>
                <div>
                  <span className="font-medium">Audience:</span> {strategicContext?.targetAudience}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs font-medium mb-1.5">Evidence Selection Rationale:</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {piFilteringResult.reasoning.slice(0, 3).map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {piFilteringResult.usageGuidance && (
              <div className="pt-2 border-t">
                <p className="text-xs font-medium mb-1">Usage Guidance:</p>
                <p className="text-xs text-muted-foreground italic">
                  {piFilteringResult.usageGuidance}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};