
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Check, AlertTriangle, Shield, Globe, Zap } from 'lucide-react';

import { GlobalTerminologyIntelligenceService } from '@/services/GlobalTerminologyIntelligenceService';
import { SmartTMIntelligenceService } from '@/services/SmartTMIntelligenceService';

export const IntelligentTerminologyDashboard = ({
  assetId,
  brandId,
  targetMarkets,
  therapeuticArea,
  onTermSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [terminologyData, setTerminologyData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [realTimeValidation, setRealTimeValidation] = useState(null);
  const [tmMatches, setTmMatches] = useState([]);
  const [validationLoading, setValidationLoading] = useState(false);

  useEffect(() => {
    loadTerminologyIntelligence();
  }, [assetId, brandId, targetMarkets]);

  const loadTerminologyIntelligence = async () => {
    setLoading(true);
    try {
      const data = await GlobalTerminologyIntelligenceService.generateTerminologyIntelligence(
        assetId,
        brandId,
        targetMarkets,
        therapeuticArea
      );
      setTerminologyData(data);
    } catch (error) {
      console.error('Failed to load terminology intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRealTimeValidation = async (text) => {
    if (!text.trim()) {
      setRealTimeValidation(null);
      setTmMatches([]);
      return;
    }
    setValidationLoading(true);
    try {
      // Real-time terminology validation
      const validationResult = await SmartTMIntelligenceService.validateTerminologyRealTime(
        text,
        brandId,
        (targetMarkets && targetMarkets[0]) || 'English',
        {
          assetType: 'web',
          targetAudience: 'healthcare professionals',
          therapeuticArea,
          brandGuidelines: {},
          regulatoryRequirements: [],
        }
      );
      setRealTimeValidation(validationResult);

      // Get asset-specific TM matches
      if (text.length > 3) {
        const tmResults = await SmartTMIntelligenceService.getAssetSpecificMatches(
          text,
          'English',
          (targetMarkets && targetMarkets[0]) || 'English',
          brandId,
          {
            assetType: 'web',
            targetAudience: 'healthcare professionals',
            therapeuticArea,
            brandGuidelines: {},
            regulatoryRequirements: [],
          }
        );
        setTmMatches(tmResults);
      }
    } catch (error) {
      console.error('Real-time validation failed:', error);
    } finally {
      setValidationLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getComplianceIcon = (status) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'blocked':
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <Globe className="h-4 w-4 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Intelligent Terminology Dashboard</h3>
          <Badge variant="outline" className="flex items-center gap-2">
            <Globe className="h-3 w-3" />
            {(targetMarkets || []).length} Markets
          </Badge>
        </div>

        {/* Search + Validation */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search terminology or type for real-time validation..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleRealTimeValidation(e.target.value);
                  }}
                  className="pl-10"
                />
                {validationLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time validation results */}
        {realTimeValidation && searchTerm.trim() && (
          <Card
            className={`p-4 border-l-4 ${
              realTimeValidation.isValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {realTimeValidation.isValid ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <span className="font-medium">
                {realTimeValidation.isValid ? 'Valid Terminology' : 'Validation Issues Found'}
              </span>
              <Badge variant="outline">Brand Score: {realTimeValidation.brandConsistencyScore}%</Badge>
            </div>

            {Array.isArray(realTimeValidation.suggestions) && realTimeValidation.suggestions.length > 0 && (
              <div className="mb-2">
                <span className="text-sm font-medium">Suggestions: </span>
                <span className="text-sm text-muted-foreground">
                  {realTimeValidation.suggestions.join(', ')}
                </span>
              </div>
            )}

            {Array.isArray(realTimeValidation.regulatoryIssues) &&
              realTimeValidation.regulatoryIssues.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-red-600">Regulatory Issues: </span>
                  <span className="text-sm text-muted-foreground">
                    {realTimeValidation.regulatoryIssues.map((issue) => issue.reason).join(', ')}
                  </span>
                </div>
              )}

            {Array.isArray(realTimeValidation.culturalConcerns) &&
              realTimeValidation.culturalConcerns.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-yellow-600">Cultural Concerns: </span>
                  <span className="text-sm text-muted-foreground">
                    {realTimeValidation.culturalConcerns
                      .map((concern) => concern.concerns.join(', '))
                      .join(', ')}
                  </span>
                </div>
              )}
          </Card>
        )}

        {/* TM Matches */}
        {Array.isArray(tmMatches) && tmMatches.length > 0 && (
          <Card className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Asset-Specific Translation Memory Matches
            </h4>
            <div className="space-y-2">
              {tmMatches.slice(0, 3).map((match, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{match.targetText}</div>
                    <div className="text-xs text-muted-foreground">
                      Match: {Math.round(match.matchPercentage)}% &nbsp;|&nbsp; Brand:{' '}
                      {Math.round(match.brandConsistencyScore)}% &nbsp;|&nbsp; Confidence:{' '}
                      {Math.round(match.confidence)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={match.regulatoryStatus === 'approved' ? 'default' : 'destructive'}>
                      {match.regulatoryStatus}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => onTermSelect?.(match)}>
                      Use
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Categorized Terminology */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Terms</TabsTrigger>
            <TabsTrigger value="approved">Pre-Approved</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="branded">Branded</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {terminologyData?.recommendedTerms?.length > 0 ? (
              terminologyData.recommendedTerms.map((term, index) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onTermSelect?.(term)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getComplianceIcon(term.regulatoryStatus)}
                        <span className="font-medium">{term.term}</span>
                        <Badge variant="secondary">{term.category}</Badge>
                        <div className={`w-2 h-2 rounded-full ${getRiskColor(term.culturalRisk)}`}></div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{term.definition}</p>

                      <div className="space-y-2">
                        {Array.isArray(term.marketSpecificTerms) &&
                          term.marketSpecificTerms.map((marketTerm, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                              <span className="text-sm font-medium">{marketTerm.market}</span>
                              <span className="text-sm">{marketTerm.localizedTerm}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={marketTerm.confidenceScore} className="w-16 h-2" />
                                <span className="text-xs">{marketTerm.confidenceScore}%</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <Button size="sm" variant="outline">Use Term</Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No terminology data available</div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {terminologyData?.preApprovedLibrary &&
              Object.entries(terminologyData.preApprovedLibrary).map(([category, terms]) => (
                <Card key={category} className="p-4">
                  <h4 className="font-medium mb-3 capitalize">{category}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.isArray(terms) &&
                      terms.map((term, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-green-50 rounded hover:bg-green-100 cursor-pointer"
                          onClick={() => onTermSelect?.({ term, category, status: 'approved' })}
                        >
                          <span className="text-sm">{term}</span>
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      ))}
                  </div>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            {terminologyData?.medicalTerminology?.length > 0 ? (
              terminologyData.medicalTerminology.map((term, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{term.term}</span>
                    <Badge variant={term.requiresValidation ? 'destructive' : 'default'}>
                      {term.requiresValidation ? 'Validation Required' : 'Validated'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{term.definition}</p>
                  {term.regulatoryNotes && (
                    <div className="bg-yellow-50 p-2 rounded text-xs">
                      <strong>Regulatory Note:</strong> {term.regulatoryNotes}
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No medical terminology available</div>
            )}
          </TabsContent>

          <TabsContent value="branded" className="space-y-4">
            {terminologyData?.brandedTerminology?.length > 0 ? (
              terminologyData.brandedTerminology.map((term, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{term.brandedTerm}</span>
                    <Badge variant="outline">{term.brandContext}</Badge>
                  </div>

                  <div className="space-y-2">
                    {term.usageGuidelines && (
                      <p className="text-sm text-muted-foreground">{term.usageGuidelines}</p>
                    )}
                    {term.restrictions && (
                      <div className="bg-red-50 p-2 rounded text-xs">
                        <strong>Restrictions:</strong> {term.restrictions}
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No branded terminology available</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

IntelligentTerminologyDashboard.propTypes = {
  assetId: PropTypes.string.isRequired,
  brandId: PropTypes.string.isRequired,
  targetMarkets: PropTypes.arrayOf(PropTypes.string).isRequired,
  therapeuticArea: PropTypes.string.isRequired,
  onTermSelect: PropTypes.func,
};
