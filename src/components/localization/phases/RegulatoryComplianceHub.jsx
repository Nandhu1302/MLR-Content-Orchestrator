
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { SegmentedIntelligenceWorkspace } from './SegmentedIntelligenceWorkspace';
import { Shield, CheckCircle, AlertTriangle, RefreshCw, FileWarning, XCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const RegulatoryComplianceHub = ({
  selectedAsset,
  culturalTranslations,
  onPhaseComplete,
  onBack,
}) => {
  const { toast } = useToast();
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);

  // Better data extraction from Phase 3
  const extractTranslations = () => {
    if (!culturalTranslations) return [];
    // If it's already the culturallyAdaptedTranslations array
    if (Array.isArray(culturalTranslations)) {
      return culturalTranslations;
    }
    // If it has a culturallyAdaptedTranslations property
    if (typeof culturalTranslations === 'object' && 'culturallyAdaptedTranslations' in culturalTranslations) {
      return culturalTranslations.culturallyAdaptedTranslations;
    }
    return [];
  };

  const [editedTranslations, setEditedTranslations] = useState(() => extractTranslations());
  const [complianceChecks, setComplianceChecks] = useState([]);

  useEffect(() => {
    if (editedTranslations.length > 0) {
      performComplianceCheck();
    }
  }, [selectedSegmentIndex, editedTranslations]);

  const performComplianceCheck = async () => {
    const segment = editedTranslations[selectedSegmentIndex];
    if (!segment) {
      console.warn('⚠️ No segment found at index:', selectedSegmentIndex, 'Total segments:', editedTranslations.length);
      return;
    }

    const market = segment.targetMarket ?? 'Unknown Market';
    console.log('[RegulatoryCompliance] Analyzing segment:', {
      segmentIndex: selectedSegmentIndex,
      targetMarket: market,
      translationLength: segment.translation?.length,
    });

    try {
      // Call the real AI edge function for compliance analysis
      const { data, error } = await supabase.functions.invoke('analyze-regulatory', {
        body: {
          content: segment.translation ?? '',
          brandId: selectedAsset?.brand_name ?? 'Unknown Brand',
          therapeuticArea: selectedAsset?.therapeutic_area ?? 'Oncology',
          assetType: segment.type ?? 'Marketing Material',
          region: market,
          brandProfile: selectedAsset,
        },
      });

      if (error) {
        console.error('[RegulatoryCompliance] Edge function error:', error);
        throw error;
      }

      console.log('[RegulatoryCompliance] AI analysis complete:', {
        checksPerformed: data?.checks?.length,
        complianceScore: data?.summary?.complianceScore,
      });

      // Transform AI response into UI format (defaults first)
      const checks = {
        requiredDisclaimers: {
          status: 'pass',
          details: 'All required disclaimers present',
          market,
        },
        fairBalance: {
          status: 'pass',
          details: 'Risk/benefit balance appropriate',
          market,
        },
        claimValidation: {
          status: 'pass',
          details: 'All claims substantiated',
          market,
        },
        marketRegulations: {
          status: 'pass',
          market,
          details: `${market} guidelines compliance check passed`,
        },
      };

      // Map AI checks to UI categories
      (data?.checks || []).forEach((check) => {
        if (check.category === 'disclaimers' || check.category === 'isi') {
          checks.requiredDisclaimers.status =
            check.status === 'failed' ? 'fail' : check.status === 'warning' ? 'warning' : 'pass';
          checks.requiredDisclaimers.details = check.finding ?? check.recommendation;
        }
        if (check.category === 'fair_balance') {
          checks.fairBalance.status =
            check.status === 'failed' ? 'fail' : check.status === 'warning' ? 'warning' : 'pass';
          checks.fairBalance.details = check.finding ?? check.recommendation;
        }
        if (check.category === 'indication' || check.category === 'off_label') {
          checks.claimValidation.status =
            check.status === 'failed' ? 'fail' : check.status === 'warning' ? 'warning' : 'pass';
          checks.claimValidation.details = check.finding ?? check.recommendation;
        }
        if (check.category === 'fda_guidelines' || check.category === 'required_elements') {
          checks.marketRegulations.status =
            check.status === 'failed' ? 'fail' : check.status === 'warning' ? 'warning' : 'pass';
          checks.marketRegulations.details = check.finding ?? check.recommendation;
        }
      });

      const complianceScore = data?.summary?.complianceScore ?? 0;
      const failCount = Object.values(checks).filter((c) => c.status === 'fail').length;
      const warningCount = Object.values(checks).filter((c) => c.status === 'warning').length;
      const riskLevel = failCount > 0 ? 'high' : warningCount > 1 ? 'medium' : 'low';

      const newChecks = [...complianceChecks];
      newChecks[selectedSegmentIndex] = {
        checks,
        riskLevel,
        score: complianceScore,
        aiData: data, // Store full AI response for detailed view
      };
      setComplianceChecks(newChecks);
    } catch (err) {
      console.error('[RegulatoryCompliance] Analysis failed:', err);
      toast({
        title: 'Analysis Failed',
        description: 'Unable to perform regulatory compliance check. Using fallback analysis.',
        variant: 'destructive',
      });

      // Fallback to basic checks if AI fails
      const newChecks = [...complianceChecks];
      newChecks[selectedSegmentIndex] = {
        checks: {
          requiredDisclaimers: {
            status: 'warning',
            details: 'Unable to verify disclaimers - manual review required',
            market,
          },
          fairBalance: {
            status: 'warning',
            details: 'Unable to verify fair balance - manual review required',
            market,
          },
          claimValidation: {
            status: 'warning',
            details: 'Unable to verify claims - manual review required',
            market,
          },
          marketRegulations: {
            status: 'warning',
            market,
            details: 'Unable to verify market regulations - manual review required',
          },
        },
        riskLevel: 'medium',
        score: 50,
      };
      setComplianceChecks(newChecks);
    }
  };

  const handleTranslationEdit = (newTranslation) => {
    const updated = [...editedTranslations];
    updated[selectedSegmentIndex] = {
      ...updated[selectedSegmentIndex],
      translation: newTranslation,
      status: 'in-progress',
    };
    setEditedTranslations(updated);
  };

  const handleMarkAsCompliant = () => {
    const check = complianceChecks[selectedSegmentIndex];
    if (check?.riskLevel === 'high') {
      toast({
        title: 'Cannot Mark as Compliant',
        description: 'Please resolve critical compliance issues first',
        variant: 'destructive',
      });
      return;
    }

    const updated = [...editedTranslations];
    updated[selectedSegmentIndex] = {
      ...updated[selectedSegmentIndex],
      status: 'complete',
      complianceApproved: true,
      complianceScore: check?.score ?? 70,
      complianceChecks: check,
    };
    setEditedTranslations(updated);

    toast({
      title: 'Compliance Approved',
      description: `Segment ${selectedSegmentIndex + 1} marked as compliant`,
    });

    if (selectedSegmentIndex < editedTranslations.length - 1) {
      setSelectedSegmentIndex(selectedSegmentIndex + 1);
    }
  };

  const handleReValidate = async () => {
    toast({
      title: 'Re-validating',
      description: 'Running AI regulatory compliance analysis...',
    });
    await performComplianceCheck();
    toast({
      title: 'Re-validation Complete',
      description: 'Regulatory compliance check finished',
    });
  };

  const allCompliant = Array.isArray(editedTranslations) && editedTranslations.every((t) => t.status === 'complete');

  const getCheckIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileWarning className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const renderTopPanel = (segment) => {
    if (!segment) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Culturally-Adapted Translation (from Phase 3)
          </Label>
          {segment.culturalScore !== undefined && (
            <Badge variant="outline">Cultural Score: {segment.culturalScore}%</Badge>
          )}
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">{segment.translation ?? 'No translation available'}</p>
        </div>

        {segment.culturalContext?.adaptationRules?.[0]?.guidance && (
          <div className="text-xs text-muted-foreground italic">
            Cultural adaptation: {segment.culturalContext.adaptationRules[0].guidance}
          </div>
        )}
      </div>
    );
  };

  const renderMiddlePanel = (segment, index) => {
    const check = complianceChecks[index];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Regulatory Intelligence
          </Label>
          <Badge variant={check?.riskLevel === 'low' ? 'default' : check?.riskLevel === 'medium' ? 'secondary' : 'destructive'}>
            Risk: {check?.riskLevel ?? 'Unknown'}
          </Badge>
        </div>

        {check ? (
          <div className="space-y-4">
            <Card className="p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Compliance Score</span>
                <Badge variant={check.score >= 80 ? 'default' : check.score >= 60 ? 'secondary' : 'destructive'}>
                  {check.score}%
                </Badge>
              </div>
              <Progress value={check.score} />
            </Card>

            <div className="space-y-2">
              <h4 className="font-medium">Regulatory Checks</h4>

              {/* Required Disclaimers */}
              <div
                className={`p-3 rounded-lg border ${
                  check.checks.requiredDisclaimers.status === 'pass'
                    ? 'bg-green-50 border-green-200'
                    : check.checks.requiredDisclaimers.status === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {getCheckIcon(check.checks.requiredDisclaimers.status)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">Required Disclaimers</div>
                    <div className="text-xs text-muted-foreground">{check.checks.requiredDisclaimers.details}</div>
                  </div>
                </div>
              </div>

              {/* Fair Balance */}
              <div
                className={`p-3 rounded-lg border ${
                  check.checks.fairBalance.status === 'pass'
                    ? 'bg-green-50 border-green-200'
                    : check.checks.fairBalance.status === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {getCheckIcon(check.checks.fairBalance.status)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">Fair Balance Analysis</div>
                    <div className="text-xs text-muted-foreground">{check.checks.fairBalance.details}</div>
                  </div>
                </div>
              </div>

              {/* Claim Validation */}
              <div
                className={`p-3 rounded-lg border ${
                  check.checks.claimValidation.status === 'pass'
                    ? 'bg-green-50 border-green-200'
                    : check.checks.claimValidation.status === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {getCheckIcon(check.checks.claimValidation.status)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">Claim Validation</div>
                    <div className="text-xs text-muted-foreground">{check.checks.claimValidation.details}</div>
                  </div>
                </div>
              </div>

              {/* Market Regulations */}
              <div
                className={`p-3 rounded-lg border ${
                  check.checks.marketRegulations.status === 'pass'
                    ? 'bg-green-50 border-green-200'
                    : check.checks.marketRegulations.status === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {getCheckIcon(check.checks.marketRegulations.status)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      Market-Specific Regulations ({check.checks.marketRegulations.market})
                    </div>
                    <div className="text-xs text-muted-foreground">{check.checks.marketRegulations.details}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Suggestions */}
            {check.riskLevel !== 'low' && (
              <Card className="p-3 bg-purple-50">
                <h4 className="font-medium text-sm mb-2">Auto-Suggestions</h4>
                <ul className="text-xs space-y-1">
                  {check.checks.requiredDisclaimers.status !== 'pass' && (
                    <li>• Add required safety disclaimer at end of content</li>
                  )}
                  {check.checks.fairBalance.status !== 'pass' && (
                    <li>• Balance efficacy claims with safety information</li>
                  )}
                  {check.checks.claimValidation.status !== 'pass' && (
                    <li>• Revise claims to match approved product labeling</li>
                  )}
                </ul>
              </Card>
            )}
          </div>
        ) : editedTranslations.length === 0 ? (
          <Card className="p-6 bg-amber-50 dark:bg-amber-950/20">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
              <div>
                <p className="font-medium">No Translation Data</p>
                <p className="text-sm text-muted-foreground">Please complete Phase 3 first</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
              <div>
                <p className="font-medium">Initializing compliance checks...</p>
                <p className="text-sm text-muted-foreground">
                  Analyzing segment {index + 1} of {editedTranslations.length}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderBottomPanel = (segment) => {
    if (!segment) return null;
    return (
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Compliance Editor</Label>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="compliance-edit">Edit for Regulatory Compliance</Label>
            {segment.status === 'complete' && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Compliance Approved
              </Badge>
            )}
          </div>

          <Textarea
            id="compliance-edit"
            value={segment.translation ?? ''}
            onChange={(e) => handleTranslationEdit(e.target.value)}
            placeholder="Edit translation to meet regulatory requirements..."
            className="min-h-[120px]"
          />
          <div className="text-xs text-muted-foreground">
            Real-time compliance validation: Changes will be reflected in checks above
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleReValidate} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-validate
          </Button>
          <Button onClick={handleMarkAsCompliant} disabled={segment.status === 'complete'}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Compliant
          </Button>
        </div>
      </div>
    );
  };

  const renderRightSidebar = () => (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Regulatory Intelligence Dashboard</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Overall Project Compliance</h4>
          <Progress value={65} className="mb-1" />
          <div className="text-xs text-muted-foreground">
            {editedTranslations.filter((t) => t.status === 'complete').length} of {editedTranslations.length} segments
            compliant
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Market Requirements</h4>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-muted rounded">
              <strong>China (NMPA):</strong> Requires local clinical data references
            </div>
            <div className="p-2 bg-muted rounded">
              <strong>EU (EMA):</strong> Fair balance mandatory for all promotional content
            </div>
            <div className="p-2 bg-muted rounded">
              <strong>US (FDA):</strong> ISI must be prominently displayed
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Common Issues</h4>
          <ul className="text-xs space-y-1">
            <li>• Missing safety disclaimers</li>
            <li>• Unsubstantiated efficacy claims</li>
            <li>• Inadequate risk/benefit balance</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Required Terms Glossary</h4>
          <div className="text-xs space-y-1">
            <div className="p-2 bg-blue-50 rounded">
              <strong>ISI:</strong> Important Safety Information
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <strong>Fair Balance:</strong> Equal presentation of risks and benefits
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const segments = editedTranslations.map((t, idx) => {
    const check = complianceChecks[idx];
    return {
      id: `segment-${idx}`,
      title: t.title ?? t.type ?? `Segment ${idx + 1}`,
      translation: t.translation,
      status: t.status ?? 'pending',
      score: check?.score ?? undefined,
      issues: check?.riskLevel === 'high' ? 3 : check?.riskLevel === 'medium' ? 1 : 0,
      culturalScore: t.culturalScore,
      culturalContext: t.culturalContext,
      targetMarket: t.targetMarket,
    };
  });

  // Show error message if no translations available
  if (editedTranslations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Card className="max-w-md">
          <div className="p-8 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold mb-2">No Translation Data Available</h3>
              <p className="text-muted-foreground mb-4">
                Phase 3 (Cultural Intelligence) must be completed first to generate culturally-adapted translations.
              </p>
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back to Phase 3
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full">
      <SegmentedIntelligenceWorkspace
        phaseTitle="Regulatory Compliance Hub"
        phaseDescription="Market-specific regulatory validation and compliance checks"
        segments={segments}
        selectedSegmentIndex={selectedSegmentIndex}
        onSegmentSelect={setSelectedSegmentIndex}
        renderTopPanel={renderTopPanel}
        renderMiddlePanel={renderMiddlePanel}
        renderBottomPanel={renderBottomPanel}
        renderRightSidebar={renderRightSidebar}
        onPrevious={() => setSelectedSegmentIndex(Math.max(0, selectedSegmentIndex - 1))}
        onNext={() => setSelectedSegmentIndex(Math.min(segments.length - 1, selectedSegmentIndex + 1))}
        canContinue={allCompliant}
        onContinue={() => onPhaseComplete(editedTranslations)}
        continueLabel="Continue to Quality Intelligence"
      />
    </div>
  );
};
