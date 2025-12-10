
import { Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function CompactIntelligenceBadge({ intelligence, onOpenDetails, placement = 'floating' }) {
  if (!intelligence) return null;

  const { dataReadiness, brand, evidence, performance, competitive, audience } = intelligence;

  // Calculate overall score
  const overallScore = Math.round(
    (dataReadiness.brand +
      dataReadiness.evidence +
      dataReadiness.performance +
      dataReadiness.competitive +
      dataReadiness.audience) / 5
  );

  // Calculate total intelligence items
  const brandCount = [brand.profile, brand.guidelines, brand.vision].filter(Boolean).length;
  const evidenceCount = (evidence.claims?.length || 0) + (evidence.references?.length || 0);
  const performanceCount =
    (performance.successPatterns?.length || 0) + (performance.campaignAnalytics?.length || 0);
  const competitiveCount =
    (competitive.competitors?.length || 0) + (competitive.landscape?.length || 0);
  const audienceCount = audience.segments?.length || 0;

  const totalItems = brandCount + evidenceCount + performanceCount + competitiveCount + audienceCount;

  const getScoreColor = () => {
    if (overallScore >= 80)
      return 'bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20';
    if (overallScore >= 50)
      return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 hover:bg-yellow-500/20';
    return 'bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/20';
  };

  const getScoreLabel = () => {
    if (overallScore >= 80) return 'Ready';
    if (overallScore >= 50) return 'Good';
    return 'Limited';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onOpenDetails}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all cursor-pointer shadow-sm ${getScoreColor()}`}
          >
            <Brain className="w-4 h-4" />
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">
                  {getScoreLabel()}: {overallScore}%
                </span>
              </div>
              <span className="text-[10px] opacity-80">{totalItems} intelligence items</span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="space-y-2 text-xs">
            <p className="font-semibold">Intelligence Breakdown:</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Brand:</span>
                <Badge variant="outline" className="text-[10px]">
                  {dataReadiness.brand}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Evidence:</span>
                <Badge variant="outline" className="text-[10px]">
                  {dataReadiness.evidence}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Performance:</span>
                <Badge variant="outline" className="text-[10px]">
                  {dataReadiness.performance}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Competitive:</span>
                <Badge variant="outline" className="text-[10px]">
                  {dataReadiness.competitive}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Audience:</span>
                <Badge variant="outline" className="text-[10px]">
                  {dataReadiness.audience}%
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground pt-2 border-t">
              Click to explore full intelligence library →
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              (All available intelligence, not just contextual recommendations)
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ✅ Explicit export
export default CompactIntelligenceBadge;
