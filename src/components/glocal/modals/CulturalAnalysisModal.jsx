import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { AlertCircle, CheckCircle, Info, Palette, BookOpen, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CulturalAnalysisModal = ({
  isOpen,
  onClose,
  segmentName,
  analysisData,
  onApplySuggestion,
  onFlagSuggestion,
  onRejectSuggestion,
  onMarkAsReviewed,
  onReAnalyze,
  isAnalyzing = false,
  isReviewed = false,
  actedRecommendations,
}) => {
  const { toast } = useToast();
  const [selectedAlternatives, setSelectedAlternatives] = useState({});

  // Helper function to generate consistent recommendation IDs
  const generateRecommendationId = (category, originalText) => {
    const textHash = originalText.toLowerCase().replace(/\s+/g, '-').substring(0, 50);
    return `${category}-${textHash}`;
  };

  // Helper to check if a recommendation has been acted upon
  const getRecommendationStatus = (recommendationId, originalText) => {
    const acted = actedRecommendations.find(
      ar => ar.recommendationId === recommendationId || ar.originalText === originalText
    );
    return acted ? acted.action : null;
  };

  // Helper to render action badge
  const getActionBadge = (status) => {
    if (!status) return null;
    if (status === 'accepted') return <Badge className="bg-green-100 text-green-800">✓ Applied</Badge>;
    if (status === 'flagged') return <Badge className="bg-yellow-100 text-yellow-800">🚩 Flagged</Badge>;
    if (status === 'rejected') return <Badge className="bg-gray-100 text-gray-800">✕ Dismissed</Badge>;
    return null;
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 85) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Needs Improvement</Badge>;
    return <Badge className="bg-red-100 text-red-800">Critical Issues</Badge>;
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  if (!analysisData && !isAnalyzing) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-full sm:max-w-2xl lg:max-w-3xl flex flex-col p-0"
      >
        <SheetHeader className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            🧠 AI Cultural Analysis - {segmentName}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Analyzing cultural appropriateness...</p>
            </div>
          ) : analysisData ? (
            <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                    <p className={`text-4xl font-bold ${getScoreColor(analysisData.overallScore)}`}>
                      {analysisData.overallScore}/100
                    </p>
                  </div>
                  {getScoreBadge(analysisData.overallScore)}
                </div>
              </CardContent>
            </Card>

            {/* Cultural Tone & Messaging */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Cultural Tone & Messaging
                  </h3>
                  <span className={`text-xl font-bold ${getScoreColor(analysisData.analysis.culturalTone.score)}`}>
                    {analysisData.analysis.culturalTone.score}/100
                  </span>
                </div>

                {analysisData.analysis.culturalTone.issues.map((issue, idx) => {
                  const rec = analysisData.actionableRecommendations.find(r => r.originalText === issue.text);
                  const status = rec ? getRecommendationStatus(rec.id, rec.originalText) : null;
                  
                  return (
                  <Card key={idx} className="border-l-4 border-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        {getPriorityIcon(issue.priority)}
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm uppercase text-muted-foreground">
                                {issue.priority} Priority Issue
                              </p>
                              {getActionBadge(status)}
                            </div>
                            <div className="space-y-2">
                              <p>
                                <span className="font-medium">Translation:</span> "{issue.text}"
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Problem:</span> {issue.problem}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-green-600">Suggestion:</span> {issue.suggestion}
                              </p>
                            </div>
                          </div>
                          
                          {!status && (
                            <>
                              <Separator />
                              
                              <div className="flex gap-2 bg-muted/30 p-3 rounded-md">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    // Create recommendation object from issue if it doesn't exist
                                    const recommendation = rec || {
                                      id: generateRecommendationId('tone', issue.text),
                                      category: 'tone',
                                      originalText: issue.text,
                                      suggestedText: issue.suggestion,
                                      rationale: issue.problem,
                                      priority: issue.priority
                                    };
                                    onApplySuggestion(recommendation);
                                    toast({ title: "Suggestion Applied", description: "Text updated with AI suggestion" });
                                  }}
                                >
                                  Accept Suggestion
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    // Create recommendation object from issue if it doesn't exist
                                    const recommendation = rec || {
                                      id: generateRecommendationId('tone', issue.text),
                                      category: 'tone',
                                      originalText: issue.text,
                                      suggestedText: issue.suggestion,
                                      rationale: issue.problem,
                                      priority: issue.priority
                                    };
                                    onFlagSuggestion(recommendation);
                                    toast({ title: "Suggestion Flagged", description: "Marked for manual review" });
                                  }}
                                >
                                  Flag for Review
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    // Create recommendation object from issue if it doesn't exist
                                    const recommendation = rec || {
                                      id: generateRecommendationId('tone', issue.text),
                                      category: 'tone',
                                      originalText: issue.text,
                                      suggestedText: issue.suggestion,
                                      rationale: issue.problem,
                                      priority: issue.priority
                                    };
                                    onRejectSuggestion(recommendation);
                                    toast({ title: "Suggestion Dismissed" });
                                  }}
                                >
                                  Dismiss
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}

                {analysisData.analysis.culturalTone.strengths.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="font-medium text-green-800 mb-2">✅ Strengths:</p>
                    <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                      {analysisData.analysis.culturalTone.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terminology Validation */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Terminology Validation
                  </h3>
                  <span className={`text-xl font-bold ${getScoreColor(analysisData.analysis.terminology.score)}`}>
                    {analysisData.analysis.terminology.score}/100
                  </span>
                </div>

                {analysisData.analysis.terminology.approvedTerms.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="font-medium text-green-800 mb-2">✅ Approved Terms:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.analysis.terminology.approvedTerms.map((term, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysisData.analysis.terminology.issues.map((issue, idx) => {
                  // Check if any alternative has been acted upon
                  const anyActedRec = analysisData.actionableRecommendations.find(
                    r => r.originalText === issue.term
                  );
                  const status = anyActedRec ? getRecommendationStatus(anyActedRec.id, anyActedRec.originalText) : null;
                  
                  return (
                  <Card key={idx} className="border-l-4 border-yellow-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        {getPriorityIcon(issue.priority)}
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm uppercase text-muted-foreground">
                                Needs Review
                              </p>
                              {getActionBadge(status)}
                            </div>
                            <div className="space-y-2">
                              <p>
                                <span className="font-medium">Term:</span> "{issue.term}"
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Issue:</span> {issue.problem}
                              </p>
                            </div>
                          </div>

                          {!status && issue.approvedAlternatives.length > 0 && (
                            <>
                              <div>
                                <p className="text-sm font-medium mb-2">Approved Alternatives:</p>
                                <div className="flex flex-wrap gap-2">
                                  {issue.approvedAlternatives.map((alt, altIdx) => (
                                    <Badge 
                                      key={altIdx}
                                      variant={selectedAlternatives[idx] === alt ? "default" : "outline"}
                                      className="cursor-pointer hover:bg-primary/10"
                                      onClick={() => {
                                        setSelectedAlternatives(prev => ({
                                          ...prev,
                                          [idx]: alt
                                        }));
                                      }}
                                    >
                                      {alt}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <Separator />

                              <div className="flex gap-2 bg-muted/30 p-3 rounded-md">
                                <Button
                                  size="sm"
                                  disabled={!selectedAlternatives[idx]}
                                  onClick={() => {
                                    const selectedAlt = selectedAlternatives[idx];
                                    if (selectedAlt) {
                                      // Create a recommendation object with the selected alternative
                                      const newRec = {
                                        id: generateRecommendationId('terminology', issue.term),
                                        category: 'terminology',
                                        originalText: issue.term,
                                        suggestedText: selectedAlt,
                                        rationale: `Alternative approved term selected: "${selectedAlt}"`,
                                        priority: issue.priority
                                      };
                                      onApplySuggestion(newRec);
                                      toast({ title: "Alternative Applied", description: `Replaced with "${selectedAlt}"` });
                                    }
                                  }}
                                >
                                  Apply Selected Alternative
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    if (anyActedRec) {
                                      onFlagSuggestion(anyActedRec);
                                      toast({ title: "Term Flagged", description: "Marked for manual review" });
                                    }
                                  }}
                                >
                                  Flag for Review
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    if (anyActedRec) {
                                      onRejectSuggestion(anyActedRec);
                                      toast({ title: "Term Dismissed" });
                                    }
                                  }}
                                >
                                  Dismiss All
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </CardContent>
            </Card>

            {/* Visual & Color Guidance */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Visual & Color Guidance
                  </h3>
                  <span className={`text-xl font-bold ${getScoreColor(analysisData.analysis.visualGuidance.score)}`}>
                    {analysisData.analysis.visualGuidance.score}/100
                  </span>
                </div>

                {analysisData.analysis.visualGuidance.colorIssues.map((issue, idx) => (
                  <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="font-medium text-blue-800">Color: {issue.color}</p>
                    <p className="text-sm text-blue-700 mt-1">
                      <span className="font-medium">Issue:</span> {issue.issue}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      <span className="font-medium">Suggestion:</span> {issue.suggestion}
                    </p>
                  </div>
                ))}

                {analysisData.analysis.visualGuidance.imageGuidance.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium">💡 Image Guidance:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysisData.analysis.visualGuidance.imageGuidance.map((guidance, idx) => (
                        <li key={idx}>{guidance}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisData.analysis.visualGuidance.designNotes.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium">📐 Design Recommendations:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysisData.analysis.visualGuidance.designNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-0 z-10 bg-background border-t px-6 py-4">
          <div className="flex gap-2 justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onReAnalyze} disabled={isAnalyzing}>
                Re-analyze
              </Button>
              {isReviewed ? (
                <Badge className="px-4 py-2 bg-green-100 text-green-800 border-green-200">
                  ✓ Reviewed
                </Badge>
              ) : (
                <Button onClick={() => {
                  onMarkAsReviewed();
                  onClose();
                }}>
                  Mark as Reviewed & Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};