import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Target, 
  Database,
  AlertCircle,
  CheckCircle2,
  Zap,
  Info,
  AlertTriangle
} from "lucide-react";

export const DataBackedThemeCard = ({ theme, onSelect, rank, metrics }) => {
  const getConfidenceColor = (score) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getConfidenceBadge = (score) => {
    if (score === null || !metrics || metrics.attribution.confidenceLevel === 'insufficient') {
      return { label: "Limited Data", variant: "outline" };
    }
    if (score >= 80) return { label: "High Confidence", variant: "default" };
    if (score >= 60) return { label: "Medium Confidence", variant: "secondary" };
    return { label: "Lower Confidence", variant: "outline" };
  };

  // Use real metrics if available, otherwise fall back to theme data
  const dataConfidence = metrics?.dataConfidence ?? theme.confidence;
  const evidenceStrength = metrics?.evidenceStrength ?? Math.round((theme.rationale.supportingData.length / 6) * 100);
  const successProbability = metrics?.successProbability ?? theme.performancePrediction.successProbability;
  const competitiveEdge = metrics?.competitiveEdge ?? theme.performancePrediction.competitiveAdvantage;
  const engagementRate = metrics?.engagementRate ?? theme.performancePrediction.engagementRate;
  const mlrApprovalRate = metrics?.mlrApprovalRate ?? theme.performancePrediction.mlrApprovalRate;
  const expectedReach = metrics?.expectedReach ?? theme.performancePrediction.expectedReach;

  const confidenceBadge = getConfidenceBadge(dataConfidence);
  const hasRealData = metrics && metrics.attribution.totalRecords > 0;
  const isDataInsufficient = metrics?.attribution.confidenceLevel === 'insufficient';

  const renderMetricValue = (value, suffix = '%', fallbackLabel = 'N/A') => {
    if (value === null) {
      return <span className="text-muted-foreground text-sm">{fallbackLabel}</span>;
    }
    return <span className={`font-bold ${getConfidenceColor(value)}`}>{Math.round(value)}{suffix}</span>;
  };

  const renderMetricWithTooltip = (
    label,
    value,
    icon,
    tooltip,
    source
  ) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="space-y-1.5 cursor-help">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                {icon}
                {label}
                {value === null && <AlertTriangle className="h-2.5 w-2.5 text-orange-500" />}
              </span>
              {renderMetricValue(value)}
            </div>
            {value !== null && <Progress value={value} className="h-1.5" />}
            {value === null && (
              <div className="h-1.5 bg-muted rounded-full" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="text-xs">{tooltip}</p>
            {source && (
              <p className="text-xs text-muted-foreground">
                Source: {source.name} ({source.recordCount} records)
              </p>
            )}
            {value === null && (
              <p className="text-xs text-orange-500">
                Insufficient data to calculate this metric
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const getSourceForMetric = (metricType) => {
    if (!metrics) return null;
    const sourceMap = {
      'confidence': 'campaign_performance_analytics',
      'evidence': 'clinical_claims',
      'success': 'campaign_performance_analytics',
      'competitive': 'competitive_intelligence',
      'engagement': 'campaign_performance_analytics',
      'mlr': 'compliance_history'
    };
    return metrics.attribution.sources.find(s => s.table === sourceMap[metricType]) || null;
  };

  return (
    <Card className="hover:shadow-lg transition-all hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {rank && (
                <Badge variant="secondary" className="text-lg font-bold">
                  #{rank}
                </Badge>
              )}
              <CardTitle className="text-xl">{theme.name}</CardTitle>
            </div>
            <CardDescription className="text-sm">{theme.description}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={confidenceBadge.variant} className="flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="h-3 w-3" />
              {confidenceBadge.label}
            </Badge>
            {hasRealData && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Database className="h-2.5 w-2.5" />
                Data-Backed
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Data Attribution Banner */}
        {hasRealData && (
          <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg border border-primary/20 text-xs">
            <Database className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">
              Based on <span className="font-medium text-foreground">{metrics.attribution.totalRecords} records</span> from{' '}
              <span className="font-medium text-foreground">{metrics.attribution.sources.length} sources</span>
              {' '} · Updated {metrics.attribution.dataRecency}
            </span>
          </div>
        )}

        {isDataInsufficient && (
          <div className="flex items-center gap-2 p-2 bg-orange-500/10 rounded-lg border border-orange-500/20 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-orange-700">
              Limited data available. Add more campaign data and clinical evidence to improve predictions.
            </span>
          </div>
        )}

        {/* Key Message */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-foreground">
            "{theme.keyMessage}"
          </p>
        </div>

        {/* Intelligence-Driven Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {renderMetricWithTooltip(
            'Data Confidence',
            dataConfidence,
            <Database className="h-3 w-3" />,
            'Overall confidence based on available performance data, clinical evidence, and competitive intelligence.',
            getSourceForMetric('confidence')
          )}

          {renderMetricWithTooltip(
            'Evidence Strength',
            evidenceStrength,
            <Shield className="h-3 w-3" />,
            'Strength of clinical claims and references supporting this theme.',
            getSourceForMetric('evidence')
          )}

          {renderMetricWithTooltip(
            'Success Probability',
            successProbability,
            <Target className="h-3 w-3" />,
            'Likelihood of campaign success based on historical performance data.',
            getSourceForMetric('success')
          )}

          {renderMetricWithTooltip(
            'Competitive Edge',
            competitiveEdge,
            <Zap className="h-3 w-3" />,
            'Competitive advantage based on market positioning and competitor analysis.',
            getSourceForMetric('competitive')
          )}
        </div>

        {/* Performance Predictions */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-muted/30 rounded-lg border">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center cursor-help">
                  <div className="text-lg font-bold text-primary">
                    {engagementRate !== null ? `${Math.round(engagementRate)}%` : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    Est. Engagement
                    {engagementRate === null && <Info className="h-2.5 w-2.5" />}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {engagementRate !== null 
                    ? `Based on ${getSourceForMetric('engagement')?.recordCount || 0} historical campaigns`
                    : 'Insufficient campaign data'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center border-x cursor-help">
                  <div className="text-lg font-bold text-primary">
                    {mlrApprovalRate !== null ? `${Math.round(mlrApprovalRate)}%` : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    MLR Approval
                    {mlrApprovalRate === null && <Info className="h-2.5 w-2.5" />}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {mlrApprovalRate !== null 
                    ? 'Based on historical compliance review data'
                    : 'No compliance history available'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center cursor-help">
                  <div className="text-lg font-bold text-primary">
                    {expectedReach !== null ? `${(expectedReach / 1000).toFixed(1)}k` : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    Est. Reach
                    {expectedReach === null && <Info className="h-2.5 w-2.5" />}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {expectedReach !== null 
                    ? 'Estimated based on engagement data and historical reach'
                    : 'Insufficient data for reach estimate'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Why This Theme? */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" />
            Why This Theme?
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {theme.rationale.primaryInsight}
          </p>
        </div>

        {/* Key Supporting Data Points */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground">Key Evidence:</div>
          <div className="space-y-1">
            {theme.rationale.supportingData.slice(0, 2).map((data, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{data}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Indicators - Only show meaningful risk factors (> 15 chars) */}
        {(() => {
          const validRisks = theme.rationale.riskFactors.filter(
            rf => typeof rf === 'string' && rf.length > 15
          );
          return validRisks.length > 0 ? (
            <div className="flex items-start gap-2 p-2 bg-orange-500/10 rounded border border-orange-500/20">
              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-orange-600">Consider: </span>
                <span className="text-orange-700">{validRisks[0]}</span>
              </div>
            </div>
          ) : null;
        })()}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onSelect(theme)}
            className="flex-1"
            size="lg"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Select This Theme
          </Button>
        </div>

        {/* Data Sources Footer */}
        {hasRealData && (
          <div className="pt-2 border-t">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              <span>Data sources:</span>
              {metrics.attribution.sources.slice(0, 3).map((source, idx) => (
                <Badge key={idx} variant="outline" className="text-xs py-0">
                  {source.name} ({source.recordCount})
                </Badge>
              ))}
              {metrics.attribution.sources.length > 3 && (
                <span>+{metrics.attribution.sources.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {!hasRealData && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              <span>Based on: {theme.dataSources.slice(0, 3).join(", ")}</span>
              {theme.dataSources.length > 3 && <span>+{theme.dataSources.length - 3} more</span>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};