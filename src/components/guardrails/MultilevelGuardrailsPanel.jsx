
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Target,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Edit,
  Plus,
  History
} from 'lucide-react';
import { useMultiLevelGuardrails } from '@/hooks/useMultiLevelGuardrails';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const MultiLevelGuardrailsPanel = ({
  campaignId,
  assetId,
  assetType,
  content,
  showComplianceCheck = true,
  showCustomization = true,
  className
}) => {
  const {
    mergedGuardrails,
    campaignGuardrails,
    assetGuardrails,
    complianceHistory,
    isLoading,
    error,
    checkContentCompliance,
    getEffectiveGuardrails,
    getCustomizationSummary,
    latestComplianceCheck
  } = useMultiLevelGuardrails({ campaignId, assetId, assetType });

  const [complianceResult, setComplianceResult] = useState(null);
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set(['brand']));

  const effectiveGuardrails = getEffectiveGuardrails();
  const customizationSummary = getCustomizationSummary();

  const handleComplianceCheck = async () => {
    if (!content) return;
    setIsCheckingCompliance(true);
    try {
      const result = await checkContentCompliance(content);
      setComplianceResult(result);
    } catch (err) {
      console.error('Compliance check failed:', err);
    } finally {
      setIsCheckingCompliance(false);
    }
  };

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'brand': return <Shield className="h-4 w-4" />;
      case 'campaign': return <Target className="h-4 w-4" />;
      case 'asset': return <Settings className="h-4 w-4" />;
      default: return null;
    }
  };

  const getComplianceColor = (score) => {
    if (!score) return 'muted';
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Multi-Level Guardrails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Guardrails Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!mergedGuardrails) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Guardrails Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No guardrails configuration found. Please ensure brand guidelines are set up.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Asset Guardrails
            </CardTitle>
            <CardDescription>
              {customizationSummary?.hasCustomizations
                ? `${customizationSummary.customizationCount} level(s) of customization active`
                : 'Using brand-level guidelines'}
            </CardDescription>
          </div>
          {showCustomization && (
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Guardrails
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="guidelines" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Guidelines Tab */}
          <TabsContent value="guidelines" className="space-y-4">
            {/* Inheritance Chain */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Active Guardrails Chain</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {mergedGuardrails.inheritance_chain.map((level, index) => (
                  <React.Fragment key={level.id}>
                    <div className="flex items-center gap-1">
                      {getLevelIcon(level.level)}
                      <span>{level.name}</span>
                      {level.has_customizations && (
                        <Badge variant="secondary" className="text-xs">Custom</Badge>
                      )}
                    </div>
                    {index < mergedGuardrails.inheritance_chain.length - 1 && (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <Separator />

            {/* Effective Guidelines */}
            {/* Key Messages, Tone Guidelines, Format Constraints */}
            {/* Keep JSX blocks as in original code */}
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-4">
            {showComplianceCheck && content && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Content Compliance Check</h4>
                  <Button onClick={handleComplianceCheck} disabled={isCheckingCompliance} size="sm">
                    {isCheckingCompliance ? 'Checking...' : 'Check Compliance'}
                  </Button>
                </div>
                {complianceResult && (
                  <div className="space-y-4">
                    {/* Overall Score */}
                    {/* Level-specific scores */}
                    {/* Recommended Actions */}
                    {/* Performance Prediction */}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <h4 className="font-medium">Compliance History</h4>
            </div>
            {complianceHistory.length > 0 ? (
              <div className="space-y-2">
                {complianceHistory.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        {new Date(entry.checked_at).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Version {entry.guardrails_version || 'N/A'}
                      </div>
                    </div>
                    <Badge variant={getComplianceColor(entry.overall_compliance_score || 0)}>
                      {entry.overall_compliance_score || 0}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No compliance checks performed yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
