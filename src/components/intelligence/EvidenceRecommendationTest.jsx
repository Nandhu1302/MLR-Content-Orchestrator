import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBrand } from '@/contexts/BrandContext';
// Assuming these imports correctly point to JavaScript files now
import { EvidenceRecommendationService } from '@/services/evidenceRecommendationService'; 
import { Loader2, CheckCircle2, XCircle, Target, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AUDIENCE_OPTIONS = [
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

const EvidenceRecommendationTest = () => {
  const { selectedBrand } = useBrand();
  // Removed type annotation
  const [selectedAudience, setSelectedAudience] = useState('Physician-Specialist');
  const [selectedAssetType, setSelectedAssetType] = useState('website-landing-page');
  const [isLoading, setIsLoading] = useState(false);
  // Removed type annotation for results
  const [results, setResults] = useState(null); 
  // Removed type annotation for error
  const [error, setError] = useState(null); 
  const [showOnlyMLR, setShowOnlyMLR] = useState(false);

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
      // Adjusted error handling for JS:
      // In JS, 'err' might not be an instance of Error, so simplified.
      setError(err?.message || 'Unknown error occurred');
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
        {/* Controls */}
        <div className="flex items-end gap-4 p-4 border rounded-lg bg-white">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Select Audience</label>
            <Select value={selectedAudience} onValueChange={setSelectedAudience}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Audience" />
              </SelectTrigger>
              <SelectContent>
                {AUDIENCE_OPTIONS.map((audience) => (
                  <SelectItem key={audience} value={audience}>
                    {audience}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Select Asset Type</label>
            <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Asset Type" />
              </SelectTrigger>
              <SelectContent>
                {ASSET_TYPE_OPTIONS.map((asset) => (
                  <SelectItem key={asset.value} value={asset.value}>
                    {asset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleTestQuery} 
            disabled={!selectedBrand || isLoading}
            className="w-48"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Querying...
              </>
            ) : (
              'Run Test Query'
            )}
          </Button>
        </div>

        {/* MLR Filter */}
        <div className="flex items-center space-x-2">
          <Shield className={`h-4 w-4 ${showOnlyMLR ? 'text-green-600' : 'text-gray-400'}`} />
          <input 
            type="checkbox" 
            id="mlr-filter" 
            checked={showOnlyMLR} 
            onChange={(e) => setShowOnlyMLR(e.target.checked)} 
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="mlr-filter" className="text-sm font-medium cursor-pointer">
            Show only MLR Approved Evidence
          </label>
        </div>

        {/* Results / Error */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
            <XCircle className="h-5 w-5 mt-0.5" />
            <div className="font-medium">Error: {error}</div>
          </div>
        )}

        {results && (
          <div className="space-y-6 pt-4">
            <h4 className="text-lg font-bold">Query Results:</h4>

            {/* Claims */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h5 className="font-semibold text-base">Recommended Claims ({results.claims.length})</h5>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">Matching: {results.claims.filter(c => c.isMatch).length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.claims.map((claim, index) => (
                  <div key={index} className="p-3 border rounded-lg shadow-sm space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">{claim.claimTitle}</p>
                      {claim.isMatch ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" title="Audience/Asset Match" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" title="No Match" />
                      )}
                    </div>
                    <Progress value={claim.relevanceScore * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">Score: {(claim.relevanceScore * 100).toFixed(0)}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visuals */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h5 className="font-semibold text-base">Recommended Visuals ({results.visuals.length})</h5>
                <Badge variant="outline" className="bg-purple-100 text-purple-800">MLR Approved: {results.visuals.filter(v => v.isMLRApproved).length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.visuals.map((visual, index) => (
                  <div key={index} className="p-3 border rounded-lg shadow-sm space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium truncate">{visual.visualTitle}</p>
                      {visual.isMLRApproved ? (
                        <Shield className="h-4 w-4 text-indigo-500 flex-shrink-0" title="MLR Approved" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" title="Not MLR Approved" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{visual.relatedClaimId}</p>
                    <p className="text-xs text-muted-foreground">Type: {visual.visualType}</p>
                  </div>
                ))}
              </div>
            </div>
            
             {/* Modules */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h5 className="font-semibold text-base">Recommended Modules ({results.modules.length})</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.modules.map((moduleItem, index) => (
                  <div key={index} className="p-3 border rounded-lg shadow-sm space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">{moduleItem.moduleName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Primary Claim: {moduleItem.primaryClaimId}</p>
                    <p className="text-xs text-muted-foreground">Last Updated: {new Date(moduleItem.lastUpdated).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </CardContent>
    </Card>
  );
};

// 🎯 FIX: Named export as requested
export { EvidenceRecommendationTest };