
import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Lightbulb,
  Target,
  FileText,
  Mail,
  Share2,
  Globe,
  Presentation,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useBrand } from '@/contexts/BrandContext';
import { EvidenceRecommendationService } from '@/services/evidenceRecommendationService';
import {
  mapAudienceToIntakeType,
  generateObjective,
  generateCTA
} from '@/utils/channelIntelligenceToOpportunity';
import { cn } from '@/lib/utils';

// Asset type configuration with icons and details
const assetTypeConfig = {
  'mass-email': { label: 'Mass Email', icon: Mail, description: 'Broad HCP email campaigns' },
  'hcp-email': { label: 'HCP Email', icon: Mail, description: 'Healthcare provider emails' },
  'patient-email': { label: 'Patient Email', icon: Mail, description: 'Patient education emails' },
  'rep-triggered-email': { label: 'Rep Triggered Email', icon: Mail, description: 'Sales rep initiated emails' },
  'social-media-post': { label: 'Social Media Post', icon: Share2, description: 'Social platform content' },
  'paid-social-ad': { label: 'Paid Social Ad', icon: Share2, description: 'Paid social campaigns' },
  'website-landing-page': { label: 'Landing Page', icon: Globe, description: 'Web pages & blogs' },
  'web-content': { label: 'Web Content', icon: Globe, description: 'Website content pages' },
  'blog': { label: 'Blog Post', icon: FileText, description: 'Blog articles' },
  'digital-sales-aid': { label: 'Digital Sales Aid', icon: Presentation, description: 'Sales enablement tools' }
};

// Objective label mapping for display
const objectiveLabels = {
  'product-awareness': 'Product Awareness',
  'clinical-education': 'Clinical Education',
  'practice-support': 'Practice Support',
  'disease-awareness': 'Disease Awareness',
  'treatment-education': 'Treatment Education',
  'adherence-support': 'Adherence Support',
  'thought-leadership': 'Thought Leadership',
  'caregiver-education': 'Caregiver Education',
  'support-resources': 'Support Resources'
};

export const ChannelOpportunityDetailModal = ({
  opportunity,
  open,
  onClose,
  filters
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedBrand } = useBrand();

  // State management
  const [initiativeType, setInitiativeType] = useState('single-asset');
  const [selectedAssetTypes, setSelectedAssetTypes] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isFetchingEvidence, setIsFetchingEvidence] = useState(false);

  // Initialize state when opportunity changes
  useEffect(() => {
    if (opportunity) {
      const recommended = opportunity.recommendedAssetTypes;
      setInitiativeType(recommended.length > 1 ? 'campaign' : 'single-asset');
      setSelectedAssetTypes(recommended.length === 1 ? recommended : [recommended[0]]);
    }
  }, [opportunity?.id]);

  // Calculate pre-filled values
  const previewFields = useMemo(() => {
    if (!opportunity) return null;
    const mappedAudience = mapAudienceToIntakeType(opportunity.audienceType, filters.audienceSegment);
    const objective = generateObjective(opportunity.channel, opportunity.audienceType);
    return {
      objective: {
        label: 'Objective',
        value: objective,
        displayValue: objectiveLabels[objective] || objective
      },
      keyMessage: {
        label: 'Key Message',
        value: opportunity.description
      },
      audience: {
        label: 'Target Audience',
        value: mappedAudience
      },
      cta: {
        label: 'CTA',
        value: generateCTA(opportunity.type, opportunity.channel)
      }
    };
  }, [opportunity, filters]);

  // Handle asset type toggle
  const handleAssetToggle = (assetType) => {
    if (initiativeType === 'single-asset') {
      setSelectedAssetTypes([assetType]); // Radio behavior
    } else {
      setSelectedAssetTypes(prev =>
        prev.includes(assetType)
          ? prev.filter(t => t !== assetType)
          : [...prev, assetType]
      ); // Checkbox behavior
    }
  };

  // Navigate to intelligence-create with evidence
  const handleProceed = async () => {
    if (selectedAssetTypes.length === 0) {
      toast({
        title: 'Select Asset Type',
        description: 'Please select at least one asset type to proceed.',
        variant: 'destructive'
      });
      return;
    }
    if (!opportunity || !previewFields || !selectedBrand?.id) return;

    setIsFetchingEvidence(true);
    try {
      const evidence = await EvidenceRecommendationService.getRecommendedEvidence(
        selectedBrand.id,
        selectedAssetTypes,
        previewFields.audience.value,
        {
          claimLimit: 5,
          visualLimit: 5,
          moduleLimit: 3,
          includeNonMLRApproved: true
        }
      );

      navigate('/intelligence-create', {
        state: {
          intelligenceContext: {
            title: opportunity.title,
            channel: opportunity.channel,
            prefilledObjective: previewFields.objective.value,
            prefilledKeyMessage: previewFields.keyMessage.value,
            prefilledCTA: previewFields.cta.value,
            prefilledAudience: previewFields.audience.value,
            prefilledAssetTypes: selectedAssetTypes,
            recommended_actions: [{ action: opportunity.description }],
            recommendedEvidence: evidence
          }
        }
      });
      onClose();
    } catch (error) {
      console.error('Error fetching evidence:', error);
      toast({
        title: 'Error',
        description: 'Failed to load evidence recommendations. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsFetchingEvidence(false);
    }
  };

  if (!opportunity || !previewFields) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {opportunity.title}
            <Badge className={cn(getPriorityColor(opportunity.priority), "uppercase text-xs")}>
              {opportunity.priority}
            </Badge>
            <Badge variant="outline" className="gap-1">
              {opportunity.channel}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {opportunity.type === 'gap' && 'Address content gap'}
            {opportunity.type === 'trending' && 'Amplify trending topic'}
            {opportunity.type === 'optimization' && 'Optimize existing content'}
            {opportunity.type === 'response' && 'Respond to audience need'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Overview */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Overview
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{opportunity.description}</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                Source: {opportunity.dataSource}
              </Badge>
            </div>
          </div>

          {/* Metrics */}
          {opportunity.metrics && Object.keys(opportunity.metrics).length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3 text-base">Key Metrics</h4>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(opportunity.metrics).map(([key, value]) => (
                    <div key={key} className="p-3 bg-accent/50 rounded-lg">
                      <p className="text-xs text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xl font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Initiative Type Selection */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-base">
              <Target className="h-4 w-4" />
              Initiative Type
            </h4>
            <RadioGroup
              value={initiativeType}
              onValueChange={(value) => {
                setInitiativeType(value);
                if (value === 'single-asset' && selectedAssetTypes.length > 1) {
                  setSelectedAssetTypes([selectedAssetTypes[0]]);
                }
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single-asset" id="single-asset" />
                <Label htmlFor="single-asset" className="cursor-pointer font-normal">Single Asset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="campaign" id="campaign" />
                <Label htmlFor="campaign" className="cursor-pointer font-normal">Campaign (Multi-Asset)</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Interactive Asset Type Selection */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Select Asset Types
              <Badge variant="outline" className="ml-auto">
                {selectedAssetTypes.length} selected
              </Badge>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {opportunity.recommendedAssetTypes.map((assetType) => {
                const config = assetTypeConfig[assetType];
                if (!config) return null;
                const isSelected = selectedAssetTypes.includes(assetType);
                const Icon = config.icon;
                const isRecommended = opportunity.recommendedAssetTypes.includes(assetType);
                return (
                  <button
                    key={assetType}
                    onClick={() => handleAssetToggle(assetType)}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "mt-0.5 flex-shrink-0",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}>
                        {isSelected ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{config.label}</span>
                          {isRecommended && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              📊 Suggested
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Pre-filled Fields Preview */}
          <div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
            >
              <h4 className="font-semibold text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Pre-filled Fields Preview
              </h4>
              {showPreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showPreview && (
              <div className="mt-3 space-y-3 pl-6">
                <div className="flex items-start gap-3">
                  <div className="text-xs font-medium text-muted-foreground w-24 pt-1">
                    {previewFields.objective.label}:
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="font-normal">
                      {previewFields.objective.displayValue}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xs font-medium text-muted-foreground w-24 pt-1">
                    {previewFields.keyMessage.label}:
                  </div>
                  <div className="flex-1 text-sm">{previewFields.keyMessage.value}</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xs font-medium text-muted-foreground w-24 pt-1">
                    {previewFields.audience.label}:
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="font-normal">
                      {previewFields.audience.value}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xs font-medium text-muted-foreground w-24 pt-1">
                    {previewFields.cta.label}:
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="font-normal">
                      {previewFields.cta.value}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  These fields will be pre-filled in the intake form
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleProceed}
            className="flex-1"
            disabled={selectedAssetTypes.length === 0 || isFetchingEvidence}
          >
            {isFetchingEvidence ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading Evidence...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
