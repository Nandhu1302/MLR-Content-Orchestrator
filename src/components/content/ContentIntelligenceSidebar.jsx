import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Image, 
  Shield,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export function ContentIntelligenceSidebar({
  citationData,
  visualsInserted = 0,
  modulesUsed = 0,
  completeness,
  assetType,
  themeData
}) {
  const claimsCount = citationData?.claimsUsed?.length || 0;
  const referencesCount = citationData?.referencesUsed?.length || 0;
  
  // Calculate evidence quality score based on real data
  const evidenceScore = Math.min(100, (claimsCount * 15) + (referencesCount * 10) + (modulesUsed * 20));
  
  // Calculate compliance prediction based on MLR-approved elements
  const complianceScore = modulesUsed > 0 ? 85 : claimsCount > 0 ? 70 : 50;

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Content Intelligence
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Evidence Quality */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Evidence Quality
            </span>
            <Badge 
              variant={evidenceScore >= 60 ? 'default' : 'secondary'}
              className="text-xs"
            >
              {evidenceScore}%
            </Badge>
          </div>
          <Progress value={evidenceScore} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{claimsCount} claims</span>
            <span>{referencesCount} refs</span>
          </div>
        </div>

        {/* Content Completeness */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Completeness
            </span>
            <Badge 
              variant={completeness >= 70 ? 'default' : 'secondary'}
              className="text-xs"
            >
              {completeness}%
            </Badge>
          </div>
          <Progress value={completeness} className="h-2" />
        </div>

        {/* Visual Assets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Image className="h-3 w-3" />
              Visual Assets
            </span>
            <span className="text-xs font-medium">
              {visualsInserted} inserted
            </span>
          </div>
        </div>

        {/* Compliance Prediction */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" />
              MLR Readiness
            </span>
            <Badge 
              variant={complianceScore >= 80 ? 'default' : complianceScore >= 60 ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {complianceScore >= 80 ? 'High' : complianceScore >= 60 ? 'Medium' : 'Low'}
            </Badge>
          </div>
          <Progress value={complianceScore} className="h-2" />
        </div>

        {/* Quick Stats */}
        <div className="pt-2 border-t space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-muted/50 rounded">
              <p className="text-lg font-semibold">{claimsCount}</p>
              <p className="text-xs text-muted-foreground">Claims</p>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <p className="text-lg font-semibold">{modulesUsed}</p>
              <p className="text-xs text-muted-foreground">Modules</p>
            </div>
          </div>
        </div>

        {/* Theme Info */}
        {themeData && (
          <div className="pt-2 border-t">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Theme</h4>
            <p className="text-sm font-medium truncate">{themeData.name}</p>
            {themeData.enrichment_status && (
              <Badge variant="outline" className="text-xs mt-1">
                {themeData.enrichment_status}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}