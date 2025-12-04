import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Image, FileText } from 'lucide-react';

export const EvidenceTab = ({
  intelligence,
  selectedClaims,
  selectedVisuals,
  selectedModules,
  onClaimToggle,
  onVisualToggle,
  onModuleToggle,
}) => {
  const claims = intelligence?.claims || [];
  const visuals = intelligence?.visuals || [];
  const modules = intelligence?.modules || [];

  return (
    <div className="space-y-6">
      {/* Clinical Claims */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Clinical Claims</h3>
          <Badge variant="secondary">{claims.length} available</Badge>
        </div>
        <div className="space-y-2">
          {claims.length === 0 ? (
            <p className="text-sm text-muted-foreground">No claims available</p>
          ) : (
            claims.map((claim) => (
              <Card key={claim.id} className="p-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedClaims.includes(claim.id)}
                    onCheckedChange={() => onClaimToggle(claim.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {claim.id.substring(0, 8)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {claim.claim_type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(claim.relevance_score * 100)}% match
                      </Badge>
                    </div>
                    <p className="text-sm">{claim.claim_text}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Visual Assets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Visual Assets</h3>
          <Badge variant="secondary">{visuals.length} available</Badge>
        </div>
        <div className="space-y-2">
          {visuals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No visual assets available</p>
          ) : (
            visuals.map((visual) => (
              <Card key={visual.id} className="p-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedVisuals.includes(visual.id)}
                    onCheckedChange={() => onVisualToggle(visual.id)}
                    className="mt-1"
                  />
                  <Image className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{visual.asset_name}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(visual.relevance_score * 100)}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{visual.asset_type}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Content Modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Content Modules</h3>
          <Badge variant="secondary">{modules.length} available</Badge>
        </div>
        <div className="space-y-2">
          {modules.length === 0 ? (
            <p className="text-sm text-muted-foreground">No modules available</p>
          ) : (
            modules.map((module) => (
              <Card key={module.id} className="p-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedModules.includes(module.id)}
                    onCheckedChange={() => onModuleToggle(module.id)}
                    className="mt-1"
                  />
                  <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {module.module_type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(module.relevance_score * 100)}% match
                      </Badge>
                    </div>
                    <p className="text-sm line-clamp-2">{module.module_text}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};