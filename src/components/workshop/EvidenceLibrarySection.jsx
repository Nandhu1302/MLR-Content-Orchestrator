
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, FileText } from 'lucide-react';
// import type { MatchedClaim, MatchedModule } from '@/services/intelligence'; // (Type-only import removed)

/*
interface EvidenceLibrarySectionProps {
  claims: MatchedClaim[];
  modules: MatchedModule[];
  selectedClaims: string[];
  selectedModules: string[];
  onClaimToggle: (claimId: string) => void;
  onModuleToggle: (moduleId: string) => void;
}
*/

export const EvidenceLibrarySection = ({
  claims,
  modules,
  selectedClaims,
  selectedModules,
  onClaimToggle,
  onModuleToggle
}) => {
  return (
    <div className="space-y-6 pt-4">
      {/* Clinical Claims */}
      {claims.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Clinical Claims
          </h4>
          <div className="space-y-2">
            {claims.map(claim => (
              <div
                key={claim.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={selectedClaims.includes(claim.id)}
                  onCheckedChange={() => onClaimToggle(claim.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <p className="text-sm flex-1">{claim.claim_text}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      {claim.mlr_approved && (
                        <Badge variant="secondary" className="text-xs">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          MLR
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{
                          backgroundColor: `hsl(var(--primary) / ${claim.relevance_score * 0.2})`,
                        }}
                      >
                        {Math.round(claim.relevance_score * 100)}% match
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {claim.claim_type}
                    </Badge>
                    {claim.target_audiences.length > 0 && (
                      <span>• {claim.target_audiences.join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Modules */}
      {modules.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            MLR-Approved Modules
          </h4>
          <div className="space-y-2">
            {modules.map(module => (
              <div
                key={module.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={selectedModules.includes(module.id)}
                  onCheckedChange={() => onModuleToggle(module.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <p className="text-sm flex-1 line-clamp-2">{module.module_text}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        MLR
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{
                          backgroundColor: `hsl(var(--primary) / ${module.relevance_score * 0.2})`,
                        }}
                      >
                        {Math.round(module.relevance_score * 100)}% match
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {module.module_type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {claims.length === 0 && modules.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No evidence items matched yet</p>
        </div>
      )}
    </div>
  );
};
