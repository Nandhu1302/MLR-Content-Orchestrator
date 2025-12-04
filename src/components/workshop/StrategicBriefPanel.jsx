
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Sparkles, Target, Users, TrendingUp, CheckCircle2 } from 'lucide-react';
// import type { ThemeOption } from '@/types/workshop'; // Removed type-only import

/*
interface StrategicBriefPanelProps {
  initiativeType: 'single' | 'campaign';
  assetTypes: string[];
  theme: ThemeOption;
  audience: string;
  occasion: string;
  selectedEvidence: {
    claims: number;
    visuals: number;
    modules: number;
  };
  successPatterns?: string[];
  audienceInsights?: string[];
  onDownload?: () => void;
}
*/

export const StrategicBriefPanel = ({
  initiativeType,
  assetTypes,
  theme,
  audience,
  occasion,
  selectedEvidence,
  successPatterns = [],
  audienceInsights = [],
  onDownload,
}) => {
  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Strategic Brief</h3>
        </div>
        {onDownload && (
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
      </div>

      {/* Initiative Overview */}
      <div className="space-y-3">
        <div>
          <span className="text-xs font-medium text-muted-foreground">Initiative Type</span>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">
              {initiativeType === 'single' ? 'Single Asset' : 'Multi-Asset Campaign'}
            </Badge>
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-muted-foreground">Asset Types</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {assetTypes.map((type) => (
              <Badge key={type} variant="secondary">
                {type.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-muted-foreground">Context</span>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{audience}</span>
            <span>•</span>
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>{occasion}</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 space-y-3">
        {/* Selected Theme */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Strategic Theme</span>
          </div>
          <div className="pl-6 space-y-2">
            <p className="font-semibold">{theme.name}</p>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Key Message:</span>
                <p className="mt-0.5">{theme.keyMessage}</p>
              </div>
              <div>
                <span className="text-muted-foreground">CTA:</span>
                <p className="mt-0.5 font-medium">{theme.cta}</p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  <span className="font-semibold text-green-600">
                    {Math.round(theme.performancePrediction.engagementRate)}%
                  </span>
                  <span className="text-muted-foreground"> predicted engagement</span>
                </span>
                <Badge variant="secondary" className="text-xs">
                  {Math.round(theme.performancePrediction.confidence)}% confidence
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Backing */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Evidence Backing</span>
          </div>
          <div className="pl-6 grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold text-primary">{selectedEvidence.claims}</div>
              <div className="text-xs text-muted-foreground">Claims</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold text-primary">{selectedEvidence.visuals}</div>
              <div className="text-xs text-muted-foreground">Visuals</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold text-primary">{selectedEvidence.modules}</div>
              <div className="text-xs text-muted-foreground">Modules</div>
            </div>
          </div>
        </div>

        {/* Success Patterns */}
        {successPatterns.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Success Patterns</span>
            </div>
            <div className="pl-6 space-y-1">
              {successPatterns.slice(0, 3).map((pattern, idx) => (
                <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>{pattern}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audience Insights */}
        {audienceInsights.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Audience Insights</span>
            </div>
            <div className="pl-6 space-y-1">
              {audienceInsights.slice(0, 3).map((insight, idx) => (
                <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-blue-600">→</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Performance Prediction Summary */}
      <div className="border-t pt-4">
        <div className="bg-primary/5 rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Performance Prediction</p>
          <p className="text-xs text-muted-foreground">
            Based on {theme.performancePrediction.basis}, this strategic approach is predicted to achieve{' '}
            <span className="font-semibold text-foreground">
              {Math.round(theme.performancePrediction.engagementRate)}% engagement
            </span>
            {' '}with {Math.round(theme.performancePrediction.confidence)}% confidence.
          </p>
        </div>
      </div>
    </Card>
  );
};
