
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBrand } from '@/contexts/BrandContext';
import { EvidenceRecommendationService, RecommendedEvidence } from '@/services/evidenceRecommendationService';
import type { AudienceType } from '@/types/intake';
import { Loader2, CheckCircle2, XCircle, Target, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AUDIENCE_OPTIONS: AudienceType[] = [
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
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('Physician-Specialist');
  const [selectedAssetType, setSelectedAssetType] = useState('website-landing-page');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RecommendedEvidence | null>(null);
  const [error, setError] = useState<string | null>(null);
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
        {/* Controls */}
        {/* ... (rest of your JSX remains unchanged) */}
      </CardContent>
    </Card>
  );
};

export default EvidenceRecommendationTest;
