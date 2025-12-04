import { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, FileText, Image, Layers } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const CampaignIntelligenceCard = ({ keyMessage, evidence }) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalEvidence = evidence.claims.length + evidence.visuals.length + evidence.modules.length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-primary/5 border border-primary/10 rounded-lg overflow-hidden">
        {/* Key Message - Always Visible */}
        <div className="px-3 py-2.5 space-y-2">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-foreground leading-snug">
              {keyMessage}
            </p>
          </div>

          {/* Evidence Badges Row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {evidence.claims.length > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 gap-1">
                <FileText className="h-3 w-3" />
                {evidence.claims.length} Claims
              </Badge>
            )}
            {evidence.visuals.length > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 gap-1">
                <Image className="h-3 w-3" />
                {evidence.visuals.length} Visuals
              </Badge>
            )}
            {evidence.modules.length > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 gap-1">
                <Layers className="h-3 w-3" />
                {evidence.modules.length} Modules
              </Badge>
            )}
          </div>
        </div>

        {/* Expandable Trigger */}
        {totalEvidence > 0 && (
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-center gap-1 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors border-t border-primary/10">
              {isOpen ? (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronRight className="h-3 w-3" />
                  View Evidence ({totalEvidence})
                </>
              )}
            </button>
          </CollapsibleTrigger>
        )}

        {/* Expandable Content */}
        <CollapsibleContent>
          <div className="px-3 py-2 space-y-3 bg-background/50 border-t border-primary/10">
            {/* Claims Section */}
            {evidence.claims.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wide flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Clinical Claims
                </h4>
                <ul className="space-y-1">
                  {evidence.claims.map((claim, i) => (
                    <li key={i} className="text-[11px] text-foreground/80 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-primary">
                      {claim}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Visuals Section */}
            {evidence.visuals.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wide flex items-center gap-1">
                  <Image className="h-3 w-3" />
                  Visual Assets
                </h4>
                <ul className="space-y-1">
                  {evidence.visuals.map((visual, i) => (
                    <li key={i} className="text-[11px] text-foreground/80 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-primary">
                      {visual}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modules Section */}
            {evidence.modules.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wide flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  Content Modules
                </h4>
                <ul className="space-y-1">
                  {evidence.modules.map((mod, i) => (
                    <li key={i} className="text-[11px] text-foreground/80 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-primary">
                      {mod}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};