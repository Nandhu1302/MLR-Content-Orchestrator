
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { SegmentedIntelligenceWorkspace } from './SegmentedIntelligenceWorkspace';
import { CheckCircle, Star, RefreshCw, FileCheck, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const QualityIntelligenceHub = ({
  selectedAsset,
  complianceTranslations,
  onPhaseComplete,
  onBack,
}) => {
  const { toast } = useToast();

  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);
  const [editedTranslations, setEditedTranslations] = useState(complianceTranslations);
  const [qualityChecks, setQualityChecks] = useState([]);
  const [finalTranslation, setFinalTranslation] = useState('');
  const [isFinalGenerated, setIsFinalGenerated] = useState(false);

  useEffect(() => {
    performQualityCheck();
  }, [selectedSegmentIndex]);

  const performQualityCheck = () => {
    const segment = editedTranslations[selectedSegmentIndex];

    const checks = {
      terminologyConsistency: {
        score: Math.floor(Math.random() * 20) + 80,
        issues: Math.random() > 0.7 ? ['Brand name inconsistency in segment 3'] : [],
      },
      toneConsistency: {
        score: Math.floor(Math.random() * 25) + 75,
        issues: Math.random() > 0.6 ? ['Tone shift detected'] : [],
      },
      brandVoiceAlignment: {
        score: Math.floor(Math.random() * 15) + 85,
        issues: Math.random() > 0.8 ? ['Voice alignment could be improved'] : [],
      },
      readability: {
        score: Math.floor(Math.random() * 20) + 80,
        grade: 'B+',
        issues: [],
      },
      completeness: {
        score: Math.random() > 0.9 ? 95 : 100,
        issues: Math.random() > 0.9 ? ['Missing closing statement'] : [],
      },
    };

    const avgScore = Math.floor(
      (checks.terminologyConsistency.score +
        checks.toneConsistency.score +
        checks.brandVoiceAlignment.score +
        checks.readability.score +
        checks.completeness.score) / 5
    );

    const newChecks = [...qualityChecks];
    newChecks[selectedSegmentIndex] = {
      checks,
      overallScore: avgScore,
    };
    setQualityChecks(newChecks);
  };

  const handleTranslationEdit = (newTranslation) => {
    const updated = [...editedTranslations];
    updated[selectedSegmentIndex] = {
      ...updated[selectedSegmentIndex],
      translation: newTranslation,
      status: 'in-progress',
    };
    setEditedTranslations(updated);
    setIsFinalGenerated(false);
  };

  const handleMarkAsQAPassed = () => {
    const updated = [...editedTranslations];
    updated[selectedSegmentIndex] = {
      ...updated[selectedSegmentIndex],
      status: 'complete',
      qaPassed: true,
      qualityScore: qualityChecks[selectedSegmentIndex]?.overallScore ?? 85,
      qualityChecks: qualityChecks[selectedSegmentIndex],
    };
    setEditedTranslations(updated);

    toast({
      title: 'QA Passed',
      description: `Segment ${selectedSegmentIndex + 1} approved for final translation`,
    });

    if (selectedSegmentIndex < editedTranslations.length - 1) {
      setSelectedSegmentIndex(selectedSegmentIndex + 1);
    }
  };

  const handleGenerateFinal = () => {
    const approvedSegments = editedTranslations.filter((t) => t.status === 'complete');
    const consolidated = approvedSegments.map((t) => t.translation).join('\n\n');

    setFinalTranslation(consolidated);
    setIsFinalGenerated(true);

    toast({
      title: 'Final Translation Generated',
      description: `Consolidated ${approvedSegments.length} QA-approved segments`,
    });
  };

  const handleReCheck = () => {
    performQualityCheck();
    toast({
      title: 'Re-checking',
      description: 'Running quality intelligence analysis...',
    });
  };

  const allQAPassed = editedTranslations.every((t) => t.status === 'complete');

  const renderTopPanel = (segment) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <FileCheck className="h-4 w-4" />
          Compliance-Approved Translation (from Phase 4)
        </Label>
        <div className="flex gap-2">
          <Badge variant="outline">Cultural: {segment.culturalScore ?? 70}%</Badge>
          <Badge variant="outline">Compliance: {segment.complianceScore ?? 80}%</Badge>
        </div>
      </div>
      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm">{segment.translation}</p>
      </div>

      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          View Translation Lineage
        </summary>
        <div className="mt-2 space-y-2">
          <div className="p-2 bg-blue-50 rounded">
            <strong>Draft (Phase 2):</strong> Initial TM/AI translation
          </div>
          <div className="p-2 bg-green-50 rounded">
            <strong>Cultural (Phase 3):</strong> Culturally adapted for target market
          </div>
          <div className="p-2 bg-purple-50 rounded">
            <strong>Regulatory (Phase 4):</strong> Compliance-approved version
          </div>
        </div>
      </details>
    </div>
  );

  const renderMiddlePanel = (segment, index) => {
    const check = qualityChecks[index];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5" />
            Quality Intelligence
          </Label>
        </div>

        {check ? (
          <div className="space-y-4">
            <Card className="p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Overall Quality Score</span>
                <Badge
                  variant={check.overallScore >= 85 ? 'default' : check.overallScore >= 70 ? 'secondary' : 'destructive'}
                >
                  {check.overallScore}%
                </Badge>
              </div>
              <Progress value={check.overallScore} />
            </Card>

            <div className="space-y-2">
              <h4 className="font-medium">Quality Metrics</h4>

              <div className="grid grid-cols-2 gap-2">
                <Card className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Terminology</span>
                    <Badge variant="outline">{check.checks.terminologyConsistency.score}%</Badge>
                  </div>
                  <Progress value={check.checks.terminologyConsistency.score} className="mb-1" />
                  {check.checks.terminologyConsistency.issues.length > 0 && (
                    <div className="text-xs text-red-600">{check.checks.terminologyConsistency.issues[0]}</div>
                  )}
                </Card>

                <Card className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Tone</span>
                    <Badge variant="outline">{check.checks.toneConsistency.score}%</Badge>
                  </div>
                  <Progress value={check.checks.toneConsistency.score} className="mb-1" />
                  {check.checks.toneConsistency.issues.length > 0 && (
                    <div className="text-xs text-yellow-600">{check.checks.toneConsistency.issues[0]}</div>
                  )}
                </Card>

                <Card className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Brand Voice</span>
                    <Badge variant="outline">{check.checks.brandVoiceAlignment.score}%</Badge>
                  </div>
                  <Progress value={check.checks.brandVoiceAlignment.score} className="mb-1" />
                </Card>

                <Card className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Readability</span>
                    <Badge variant="outline">{check.checks.readability.grade}</Badge>
                  </div>
                  <Progress value={check.checks.readability.score} className="mb-1" />
                </Card>
              </div>
            </div>

            <Card className="p-3 bg-green-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Translation Completeness</span>
                <Badge variant={check.checks.completeness.score === 100 ? 'default' : 'secondary'}>
                  {check.checks.completeness.score}%
                </Badge>
              </div>
              {check.checks.completeness.issues.length > 0 && (
                <div className="text-xs text-red-600 mt-1">{check.checks.completeness.issues[0]}</div>
              )}
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Running quality checks...</span>
          </div>
        )}
      </div>
    );
  };

  const renderBottomPanel = (segment) => (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Final Review Editor</Label>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="qa-edit">Final Quality Review</Label>
          {segment.status === 'complete' && (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              QA Passed
            </Badge>
          )}
        </div>

        <Textarea
          id="qa-edit"
          value={segment.translation}
          onChange={(e) => handleTranslationEdit(e.target.value)}
          placeholder="Final review and minor edits..."
          className="min-h-[120px]"
        />
        <div className="text-xs text-muted-foreground">
          This is your last chance to make adjustments before generating the final translation
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleReCheck} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Re-check Quality
        </Button>
        <Button onClick={handleMarkAsQAPassed} disabled={segment.status === 'complete'}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark as QA Passed
        </Button>
      </div>
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Quality Dashboard</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Project Quality Metrics</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Avg Quality Score</span>
                <Badge>85%</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Terminology Consistency</span>
                <Badge variant="outline">92%</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Brand Voice Alignment</span>
                <Badge variant="outline">88%</Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Consistency Report</h4>
            <div className="text-xs space-y-1">
              <div className="p-2 bg-green-50 rounded">✓ Brand terminology consistent across segments</div>
              <div className="p-2 bg-green-50 rounded">✓ Tone maintained throughout translation</div>
              <div className="p-2 bg-yellow-50 rounded">⚠ Minor style variation in segment 4</div>
            </div>
          </div>
        </div>
      </Card>

      {allQAPassed && (
        <Card className="p-4 bg-primary/10">
          <h3 className="font-semibold mb-2">Generate Final Translation</h3>
          <p className="text-sm text-muted-foreground mb-4">
            All segments have passed QA. Ready to generate consolidated translation.
          </p>
          <Button onClick={handleGenerateFinal} className="w-full" disabled={isFinalGenerated}>
            <FileCheck className="h-4 w-4 mr-2" />
            {isFinalGenerated ? 'Final Translation Generated' : 'Generate Final Translation'}
          </Button>
        </Card>
      )}

      {isFinalGenerated && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Final Translation</h3>
            <Button variant="outline" size="sm">
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
          </div>
          <div className="text-xs text-muted-foreground max-h-32 overflow-auto p-2 bg-muted rounded">
            {finalTranslation}
          </div>
        </Card>
      )}
    </div>
  );

  const segments = editedTranslations.map((t, idx) => {
    const check = qualityChecks[idx];
    return {
      id: `segment-${idx}`,
      title: t.title ?? `Segment ${idx + 1}`,
      translation: t.translation,
      status: t.status ?? 'pending',
      score: check?.overallScore ?? undefined,
    };
  });

  return (
    <div className="h-full">
      <SegmentedIntelligenceWorkspace
        phaseTitle="Quality Intelligence Hub"
        phaseDescription="Final quality assurance and translation consolidation"
        segments={segments}
        selectedSegmentIndex={selectedSegmentIndex}
        onSegmentSelect={setSelectedSegmentIndex}
        renderTopPanel={renderTopPanel}
        renderMiddlePanel={renderMiddlePanel}
        renderBottomPanel={renderBottomPanel}
        renderRightSidebar={renderRightSidebar}
        onPrevious={() => setSelectedSegmentIndex(Math.max(0, selectedSegmentIndex - 1))}
        onNext={() => setSelectedSegmentIndex(Math.min(segments.length - 1, selectedSegmentIndex + 1))}
        canContinue={allQAPassed && isFinalGenerated}
        onContinue={() => onPhaseComplete(finalTranslation, editedTranslations)}
        continueLabel="Continue to DAM Handoff"
      />
    </div>
  );
};
