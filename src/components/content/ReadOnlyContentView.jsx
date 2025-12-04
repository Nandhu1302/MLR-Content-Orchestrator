import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, TrendingUp, CheckCircle } from 'lucide-react';

export const ReadOnlyContentView = ({
  content,
  assetType,
  realTimeAnalysis,
  onUnlock
}) => {
  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Finalized Content
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Content is locked and ready for personalization
            </p>
          </div>
          <Button variant="outline" onClick={onUnlock}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Content
          </Button>
        </CardHeader>
      </Card>

      {/* AI Analysis Scores */}
      {realTimeAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Content Analysis
            </CardTitle>
          </CardHeader>
      <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Brand Voice</p>
                <Badge variant={getScoreBadgeVariant(realTimeAnalysis.brandVoiceScore || 0)}>
                  {realTimeAnalysis.brandVoiceScore || 0}%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Engagement</p>
                <Badge variant={getScoreBadgeVariant(realTimeAnalysis.engagementPrediction || 0)}>
                  {realTimeAnalysis.engagementPrediction || 0}%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">MLR Approval</p>
                <Badge variant={getScoreBadgeVariant(realTimeAnalysis.mlrApprovalPrediction || 0)}>
                  {realTimeAnalysis.mlrApprovalPrediction || 0}%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Readability</p>
                <Badge variant={getScoreBadgeVariant(realTimeAnalysis.readabilityScore || 0)}>
                  {realTimeAnalysis.readabilityScore || 0}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Display */}
      <Card>
        <CardHeader>
          <CardTitle>Content Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {assetType.includes('email') && (
            <div className="space-y-4">
              {content.subject && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Subject Line</p>
                  <p className="text-base font-medium">{content.subject}</p>
                </div>
              )}
              {content.preheader && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Preheader</p>
                  <p className="text-sm text-muted-foreground">{content.preheader}</p>
                </div>
              )}
              {content.headline && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Headline</p>
                  <p className="text-lg font-semibold">{content.headline}</p>
                </div>
              )}
              {content.body && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Body Content</p>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {content.body}
                  </div>
                </div>
              )}
              {content.cta && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Call to Action</p>
                  <Button className="pointer-events-none">{content.cta}</Button>
                </div>
              )}
              {content.disclaimer && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">{content.disclaimer}</p>
                </div>
              )}
            </div>
          )}

          {(assetType.includes('web') || assetType.includes('landing')) && (
            <div className="space-y-4">
              {content.headline && (
                <h1 className="text-3xl font-bold">{content.headline}</h1>
              )}
              {content.keyMessage && (
                <p className="text-xl text-muted-foreground">{content.keyMessage}</p>
              )}
              {content.body && (
                <div className="prose max-w-none whitespace-pre-wrap">
                  {content.body}
                </div>
              )}
              {content.cta && (
                <Button size="lg" className="pointer-events-none">{content.cta}</Button>
              )}
            </div>
          )}

          {assetType.includes('social') && (
            <div className="space-y-4">
              {content.body && (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {content.body}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};