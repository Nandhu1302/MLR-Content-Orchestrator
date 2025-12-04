import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, FileText, TrendingUp, AlertCircle } from 'lucide-react';

export const ContentQualityCard = ({ intakeContext, completeness }) => {
  const piFilteringResult = intakeContext?.piFilteringResult;
  const strategicContext = intakeContext?.strategicContext;
  const hasPIEvidence = !!piFilteringResult && Object.keys(piFilteringResult.selectedSections || {}).length > 0;
  
  if (!hasPIEvidence && !strategicContext) {
    return null; // Don't show card for basic theme-only content
  }

  const relevanceScore = piFilteringResult?.relevanceScore || 0;
  const selectedSectionsCount = piFilteringResult ? Object.keys(piFilteringResult.selectedSections).length : 0;

  // Determine quality level
  const getQualityLevel = () => {
    if (hasPIEvidence && relevanceScore >= 80) return {
      label: 'High Quality',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: Sparkles
    };
    if (hasPIEvidence && relevanceScore >= 60) return {
      label: 'Good Quality',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: TrendingUp
    };
    if (hasPIEvidence) return {
      label: 'Moderate Quality',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      icon: AlertCircle
    };
    return {
      label: 'Strategic',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      icon: FileText
    };
  };

  const quality = getQualityLevel();
  const QualityIcon = quality.icon;

  return (
    <Card className={`border-l-4 ${quality.bg} ${
      hasPIEvidence && relevanceScore >= 80 ? 'border-l-emerald-500' :
      hasPIEvidence && relevanceScore >= 60 ? 'border-l-blue-500' :
      hasPIEvidence ? 'border-l-amber-500' : 'border-l-purple-500'
    }`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${quality.bg}`}>
              <QualityIcon className={`h-5 w-5 ${quality.color}`} />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className={`font-semibold ${quality.color}`}>{quality.label} Content</h4>
                {hasPIEvidence && (
                  <Badge variant="outline" className="text-xs">
                    {relevanceScore}% PI Relevance
                  </Badge>
                )}
              </div>
              
              {hasPIEvidence ? (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Generated with <strong>{selectedSectionsCount} clinical evidence sections</strong> specifically 
                    selected for <strong>{strategicContext?.indication}</strong> and aligned with 
                    your <strong>{strategicContext?.campaignObjective}</strong> objective.
                  </p>
                  
                  {piFilteringResult.reasoning.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {piFilteringResult.reasoning.slice(0, 2).map((reason, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-xs font-normal bg-white/60"
                        >
                          {reason.length > 60 ? reason.substring(0, 60) + '...' : reason}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ) : strategicContext ? (
                <p className="text-sm text-muted-foreground">
                  Strategically aligned with <strong>{strategicContext.campaignObjective}</strong> objective 
                  for <strong>{strategicContext.targetAudience}</strong>. 
                  <span className="text-amber-600 font-medium ml-1">
                    Add documents in Document Library to enhance with clinical evidence.
                  </span>
                </p>
              ) : null}
            </div>
          </div>

          {completeness !== undefined && (
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-foreground">{completeness}%</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};