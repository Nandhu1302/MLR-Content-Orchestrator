import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBrand } from '@/contexts/BrandContext';
import { EvidenceRecommendationService } from '@/services/evidenceRecommendationService';
// import type { AudienceType } from '@/types/intake'; // Type import removed
import { Loader2, CheckCircle2, XCircle, Target, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AUDIENCE_OPTIONS = [ // Type removed from array literal
  'Physician-Specialist',
  'Physician-PrimaryCare',
  'Pharmacist',
  'Nurse-RN',
  'Nurse-NP-PA',
  'Patient',
  'Caregiver-Family',
  'Caregiver-Professional'
];

const ASSET_TYPE_OPTIONS = [
  { value: 'website-landing-page', label: 'Website Landing Page' },
  { value: 'mass-email', label: 'Mass Email' },
  { value: 'patient-email', label: 'Patient Email' },
  { value: 'rep-triggered-email', label: 'Rep-Triggered Email' },
  { value: 'digital-sales-aid', label: 'Digital Sales Aid' },
  { value: 'social-media-post', label: 'Social Media Post' }
];

export const EvidenceRecommendationTest = () => {
  const { selectedBrand } = useBrand();
  // Type annotations removed from useState
  const [selectedAudience, setSelectedAudience] = useState('Physician-Specialist'); 
  const [selectedAssetType, setSelectedAssetType] = useState('website-landing-page');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null); // Type annotation removed
  const [error, setError] = useState(null); // Type annotation removed
  const [showOnlyMLR, setShowOnlyMLR] = useState(false);

  // Type annotations removed from handleTestQuery and error handling
  const handleTestQuery = async () => {
    if (!selectedBrand?.id) {
      setError('No brand selected');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const evidence = await EvidenceRecommendationService.getRecommendedEvidence(
        selectedBrand.id,
        [selectedAssetType],
        selectedAudience,
        {
          claimLimit: 5,
          visualLimit: 5,
          moduleLimit: 5,
          includeNonMLRApproved: !showOnlyMLR
        }
      );
      setResults(evidence);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('[EvidenceRecommendationTest] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Evidence Recommendation Test Component
        </CardTitle>
        <CardDescription>
          Test the evidence matching logic before building the full Intelligence-Driven Asset Creator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Audience</label>
            <Select value={selectedAudience} onValueChange={(value) => setSelectedAudience(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUDIENCE_OPTIONS.map(audience => (
                  <SelectItem key={audience} value={audience}>
                    {audience}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Asset Type</label>
            <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASSET_TYPE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              onClick={handleTestQuery} 
              disabled={isLoading || !selectedBrand}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Query'
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-4 border-t">
          <input
            type="checkbox"
            id="mlr-only"
            checked={showOnlyMLR}
            onChange={(e) => setShowOnlyMLR(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="mlr-only" className="text-sm text-muted-foreground cursor-pointer">
            Show only MLR approved assets
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Query Failed</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="space-y-6">
            {/* Matching Criteria Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Query Successful</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Audience Used:</span>
                  <p className="font-medium">{results.matchingCriteria.audienceUsed}</p>
                  <p className="text-xs text-muted-foreground">
                    Mapped to: {results.matchingCriteria.audienceMappedTo.join(', ')}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Asset Type Used:</span>
                  <p className="font-medium">{results.matchingCriteria.assetTypeUsed}</p>
                  <p className="text-xs text-muted-foreground">
                    Mapped to: {results.matchingCriteria.assetTypeMappedTo.join(', ')}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Total Evidence Matched:</span>
                  <p className="text-2xl font-bold text-green-600">{results.matchingCriteria.totalMatched}</p>
                </div>
              </div>
            </div>

            {/* Clinical Claims */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                📋 Clinical Claims ({results.claims.length})
              </h3>
              {results.claims.length === 0 ? (
                <p className="text-sm text-muted-foreground">No claims matched the criteria</p>
              ) : (
                <div className="space-y-3">
                  {results.claims.map((claim, idx) => (
                    <div key={claim.id} className="border rounded-lg p-3 bg-white">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {claim.claim_id_display}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {claim.claim_type}
                            </Badge>
                          </div>
                          <p className="text-sm">{claim.claim_text.substring(0, 150)}...</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold text-blue-600">{claim.relevanceScore}</div>
                          <div className="text-xs text-muted-foreground">relevance</div>
                          <Progress value={claim.relevanceScore} className="w-20 h-2 mt-1" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {claim.matchingCriteria.audienceMatch && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Audience Match
                          </Badge>
                        )}
                        {claim.matchingCriteria.claimTypeRelevance && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Type Relevant
                          </Badge>
                        )}
                        {claim.matchingCriteria.hasStatisticalData && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Has Data
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Visual Assets */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                📊 Visual Assets ({results.visualAssets.length})
              </h3>
              {results.visualAssets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No visual assets matched the criteria</p>
              ) : (
                <div className="space-y-3">
                  {results.visualAssets.map((asset, idx) => (
                    <div key={asset.id} className="border rounded-lg p-3 bg-white">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {asset.visual_type}
                            </Badge>
                            {asset.mlrApproved ? (
                              <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                                <Shield className="h-3 w-3 mr-1" />
                                MLR Approved
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                                Pending Review
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium text-sm">{asset.title}</p>
                          {asset.linkedClaims.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Linked to {asset.linkedClaims.length} claim(s)
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold text-purple-600">{asset.relevanceScore}</div>
                          <div className="text-xs text-muted-foreground">relevance</div>
                          <Progress value={asset.relevanceScore} className="w-20 h-2 mt-1" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {asset.matchingCriteria.audienceMatch && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Audience Match
                          </Badge>
                        )}
                        {asset.matchingCriteria.assetTypeMatch && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Asset Type Match
                          </Badge>
                        )}
                        {asset.matchingCriteria.hasLinkedClaims && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Has Claims
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content Modules */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                📝 Content Modules ({results.contentModules.length})
              </h3>
              {results.contentModules.length === 0 ? (
                <p className="text-sm text-muted-foreground">No content modules matched the criteria</p>
              ) : (
                <div className="space-y-3">
                  {results.contentModules.map((module, idx) => (
                    <div key={module.id} className="border rounded-lg p-3 bg-white">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {module.module_type}
                            </Badge>
                            {module.mlr_approved && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                MLR Approved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{module.module_text.substring(0, 150)}...</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold text-orange-600">{module.relevanceScore}</div>
                          <div className="text-xs text-muted-foreground">relevance</div>
                          <Progress value={module.relevanceScore} className="w-20 h-2 mt-1" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {module.matchingCriteria.audienceMatch && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Audience Match
                          </Badge>
                        )}
                        {module.matchingCriteria.mlrApproved && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            MLR Approved
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};