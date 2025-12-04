import { useState } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, AlertTriangle } from 'lucide-react';

export const CitationRenderer = ({
  content,
  claimsUsed,
  referencesUsed,
  validationErrors
}) => {
  const [expandedClaim, setExpandedClaim] = useState(null);

  // Parse content to extract text and citation markers
  const renderContentWithCitations = () => {
    const parts = content.split(/(<sup[^>]*>.*?<\/sup>)/g);
    
    return parts.map((part, index) => {
      // Check if this is a citation marker
      const match = part.match(/<sup[^>]*data-claim-id="([^"]*)"[^>]*data-citation-num="([^"]*)"[^>]*>(\d+)<\/sup>/);
      
      if (match) {
        const [, claimId, citationNum, displayNum] = match;
        const claim = claimsUsed.find(c => c.claimId === claimId);
        
        if (!claim) {
          return <sup key={index} className="text-muted-foreground">{displayNum}</sup>;
        }

        const hasError = 
          validationErrors?.expiredClaims?.includes(claim.claimDisplayId) ||
          validationErrors?.scopeMismatches?.includes(claim.claimDisplayId) ||
          validationErrors?.missingReferences?.includes(claim.claimDisplayId);

        return (
          <HoverCard key={index} openDelay={100}>
            <HoverCardTrigger asChild>
              <sup 
                className={`cursor-help inline-flex items-center ${
                  hasError 
                    ? 'text-destructive font-semibold' 
                    : 'text-primary hover:text-primary/80'
                }`}
              >
                {displayNum}
                {hasError && <AlertTriangle className="h-2 w-2 ml-0.5 inline" />}
              </sup>
            </HoverCardTrigger>
            <HoverCardContent className="w-96 p-4" side="top">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {claim.claimDisplayId}
                  </Badge>
                  {hasError && (
                    <Badge variant="destructive" className="text-xs">
                      Validation Issue
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm">
                  <p className="font-medium mb-2">Claim Statement:</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {claim.claimText}
                  </p>
                </div>

                {claim.linkedReferences.length > 0 && (
                  <>
                    <Separator />
                    <div className="text-xs">
                      <p className="font-medium mb-1.5 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Supporting References:
                      </p>
                      <ul className="space-y-1 text-muted-foreground">
                        {claim.linkedReferences.map((refId, i) => {
                          const ref = referencesUsed.find(r => r.referenceDisplayId === refId);
                          return (
                            <li key={i} className="pl-2">
                              • {ref?.referenceDisplayId || refId}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}

                {hasError && (
                  <>
                    <Separator />
                    <div className="text-xs text-destructive space-y-1">
                      {validationErrors?.expiredClaims?.includes(claim.claimDisplayId) && (
                        <p>⚠️ Claim has expired</p>
                      )}
                      {validationErrors?.scopeMismatches?.includes(claim.claimDisplayId) && (
                        <p>⚠️ Not approved for this asset type</p>
                      )}
                      {validationErrors?.missingReferences?.includes(claim.claimDisplayId) && (
                        <p>⚠️ Missing supporting references</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      }
      
      // Regular text
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Content with Interactive Citations */}
      <div className="prose prose-sm max-w-none leading-relaxed">
        {renderContentWithCitations()}
      </div>

      {/* References Section */}
      {referencesUsed.length > 0 && (
        <div className="border-t pt-6 mt-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            References
          </h3>
          <ol className="space-y-3 text-xs text-muted-foreground">
            {referencesUsed
              .sort((a, b) => a.citationNumber - b.citationNumber)
              .map((ref) => (
                <li key={ref.referenceId} className="pl-2">
                  <span className="font-mono text-primary mr-2">
                    [{ref.citationNumber}]
                  </span>
                  <span className="font-medium mr-2">
                    {ref.referenceDisplayId}
                  </span>
                  {ref.formattedCitation}
                </li>
              ))}
          </ol>
        </div>
      )}

      {/* Validation Warnings */}
      {validationErrors && (
        (validationErrors.expiredClaims?.length || 
         validationErrors.scopeMismatches?.length || 
         validationErrors.missingReferences?.length) && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
              <AlertTriangle className="h-4 w-4" />
              Citation Validation Issues
            </div>
            {validationErrors.expiredClaims && validationErrors.expiredClaims.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Expired claims: {validationErrors.expiredClaims.join(', ')}
              </p>
            )}
            {validationErrors.scopeMismatches && validationErrors.scopeMismatches.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Scope mismatches: {validationErrors.scopeMismatches.join(', ')}
              </p>
            )}
            {validationErrors.missingReferences && validationErrors.missingReferences.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Missing references: {validationErrors.missingReferences.join(', ')}
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
};