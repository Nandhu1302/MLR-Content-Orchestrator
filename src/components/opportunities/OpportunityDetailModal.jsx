import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Lightbulb, Target, TrendingUp, Users, X, FileText, Mail, Share2, Globe, Presentation, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContentOpportunityService } from '@/services/contentOpportunityService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { mapOpportunityTypeToObjective, generateIntelligentCTA, getOpportunityTypeLabel, getObjectiveLabel } from '@/utils/opportunityToIntakeMapper';
import { cn } from '@/lib/utils';

// Asset type configuration with icons and details
const assetTypeConfig = {
  'mass-email': { label: 'Mass Email', icon: Mail, description: 'Broad HCP email campaigns' },
  'rep-triggered-email': { label: 'Rep Triggered Email', icon: Mail, description: 'Sales rep initiated emails' },
  'patient-email': { label: 'Patient Email', icon: Mail, description: 'Patient education emails' },
  'caregiver-email': { label: 'Caregiver Email', icon: Mail, description: 'Caregiver support emails' },
  'social-media-post': { label: 'Social Media Post', icon: Share2, description: 'Social platform content' },
  'website-landing-page': { label: 'Website Landing Page', icon: Globe, description: 'Web pages & blogs' },
  'digital-sales-aid': { label: 'Digital Sales Aid', icon: Presentation, description: 'Sales enablement tools' }
};

// Map channels to specific asset types
const mapChannelsToAssetTypes = (channels) => {
  const channelMap = {
    'email': { assetType: 'mass-email', label: 'Mass Email' },
    'hcp email': { assetType: 'mass-email', label: 'HCP Mass Email' },
    'patient email': { assetType: 'patient-email', label: 'Patient Email' },
    'caregiver email': { assetType: 'caregiver-email', label: 'Caregiver Email' },
    'social': { assetType: 'social-media-post', label: 'Social Media Post' },
    'social media': { assetType: 'social-media-post', label: 'Social Media Post' },
    // Specific social platforms
    'twitter': { assetType: 'social-media-post', label: 'Social Media Post (Twitter/X)' },
    'twitter/x': { assetType: 'social-media-post', label: 'Social Media Post (Twitter/X)' },
    'x': { assetType: 'social-media-post', label: 'Social Media Post (X)' },
    'instagram': { assetType: 'social-media-post', label: 'Social Media Post (Instagram)' },
    'facebook': { assetType: 'social-media-post', label: 'Social Media Post (Facebook)' },
    'linkedin': { assetType: 'social-media-post', label: 'Social Media Post (LinkedIn)' },
    'reddit': { assetType: 'social-media-post', label: 'Social Media Post (Reddit)' },
    // Web channels
    'webinar': { assetType: 'website-landing-page', label: 'Website Landing Page' },
    'landing page': { assetType: 'website-landing-page', label: 'Website Landing Page' },
    'web': { assetType: 'website-landing-page', label: 'Website Landing Page' },
    'website': { assetType: 'website-landing-page', label: 'Website Landing Page' },
    'blog': { assetType: 'website-landing-page', label: 'Blog/Landing Page' },
    // Sales channels
    'sales aid': { assetType: 'digital-sales-aid', label: 'Digital Sales Aid' },
    'digital sales aid': { assetType: 'digital-sales-aid', label: 'Digital Sales Aid' },
    'rep email': { assetType: 'rep-triggered-email', label: 'Rep Triggered Email' },
    'rep-enabled': { assetType: 'rep-triggered-email', label: 'Rep Triggered Email' },
    'rep triggered': { assetType: 'rep-triggered-email', label: 'Rep Triggered Email' },
    // Patient/Community channels
    'patient forums': { assetType: 'patient-email', label: 'Patient Community Content' },
    'patient forum': { assetType: 'patient-email', label: 'Patient Community Content' },
    'forums': { assetType: 'website-landing-page', label: 'Community Forum Content' },
    'forum': { assetType: 'website-landing-page', label: 'Community Forum Content' }
  };
  
  // Normalize channel name and find mapping
  const normalizeChannel = (ch) => {
    return ch.toLowerCase().trim().replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
  };
  
  return channels
    .map(ch => {
      const normalized = normalizeChannel(ch);
      // Try exact match first
      let mapping = channelMap[normalized];
      // Try with hyphen/underscore variations
      if (!mapping) {
        mapping = channelMap[ch.toLowerCase().trim()];
      }
      // Try partial match for common patterns
      if (!mapping) {
        // Social platforms
        if (['twitter', 'x'].some(p => normalized.includes(p))) {
          mapping = channelMap['twitter/x'];
        } else if (normalized.includes('instagram')) {
          mapping = channelMap['instagram'];
        } else if (normalized.includes('facebook')) {
          mapping = channelMap['facebook'];
        } else if (normalized.includes('linkedin')) {
          mapping = channelMap['linkedin'];
        } else if (normalized.includes('reddit')) {
          mapping = channelMap['reddit'];
        } else if (normalized.includes('social')) {
          mapping = channelMap['social'];
        }
        // Patient/forum content
        else if (normalized.includes('patient') && normalized.includes('forum')) {
          mapping = channelMap['patient forums'];
        } else if (normalized.includes('forum')) {
          mapping = channelMap['forums'];
        }
        // Email channels
        else if (normalized.includes('email') && normalized.includes('rep')) {
          mapping = channelMap['rep-enabled'];
        } else if (normalized.includes('email')) {
          mapping = channelMap['email'];
        }
        // Web channels
        else if (normalized.includes('web') || normalized.includes('landing')) {
          mapping = channelMap['web'];
        } else if (normalized.includes('sales') || normalized.includes('aid')) {
          mapping = channelMap['sales aid'];
        }
      }
      return mapping ? { channel: ch, ...mapping } : null;
    })
    .filter(Boolean);
};

// Map opportunity audience strings to valid AudienceType values
const mapAudienceToFormType = (audience) => {
  const lower = audience.toLowerCase().trim();
  
  // Exact matches first
  if (lower === 'hcp') return 'Physician-Specialist';
  if (lower === 'patient' || lower === 'patients') return 'Patient';
  if (lower === 'caregiver' || lower === 'caregivers') return 'Caregiver-Family';
  
  // HCP variations
  if (lower.includes('hcp') || lower.includes('physician') || lower.includes('specialist') || 
      lower.includes('doctor') || lower.includes('prescriber') || lower.includes('healthcare')) {
    return 'Physician-Specialist';
  }
  
  // Patient variations
  if (lower.includes('patient') || lower.includes('consumer')) {
    return 'Patient';
  }
  
  // Caregiver variations
  if (lower.includes('caregiver') || lower.includes('family')) {
    return 'Caregiver-Family';
  }
  
  // Nurse variations
  if (lower.includes('nurse') || lower.includes('np') || lower.includes('pa')) {
    return 'Nurse-RN';
  }
  
  // Pharmacist variations
  if (lower.includes('pharmacist') || lower.includes('payer')) {
    return 'Pharmacist';
  }
  
  return 'Physician-Specialist'; // Default fallback
};

export const OpportunityDetailModal = ({
  opportunity,
  open,
  onClose,
  brandId
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // ALL useState hooks MUST come before any conditional returns
  const [initiativeType, setInitiativeType] = useState('single-asset');
  const [selectedAssetTypes, setSelectedAssetTypes] = useState([]);
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [showPreview, setShowPreview] = useState(true);

  // Asset-to-audience compatibility mapping
  const audienceCompatibility = {
    'digital-sales-aid': ['hcp', 'physician', 'healthcare', 'specialist', 'prescriber'],
    'rep-triggered-email': ['hcp', 'physician', 'healthcare', 'specialist', 'prescriber'],
    'mass-email': ['hcp', 'physician', 'healthcare', 'specialist', 'prescriber'],
    'patient-email': ['patient', 'consumer', 'caregiver', 'family'],
    'caregiver-email': ['caregiver', 'family', 'patient'],
    'social-media-post': ['*'], // All audiences
    'website-landing-page': ['*'] // All audiences
  };

  // Check if an audience is compatible with selected asset types
  const isAudienceCompatible = (audience) => {
    if (selectedAssetTypes.length === 0) return true;
    
    const audienceLower = audience.toLowerCase();
    
    return selectedAssetTypes.some(assetType => {
      const compatible = audienceCompatibility[assetType] || ['*'];
      if (compatible.includes('*')) return true;
      return compatible.some(keyword => audienceLower.includes(keyword));
    });
  };

  // Sync state when opportunity changes
  useEffect(() => {
    if (opportunity) {
      const mappings = mapChannelsToAssetTypes(opportunity.suggested_channels || []);
      const assetTypes = mappings.map(m => m.assetType);
      setInitiativeType(assetTypes.length > 1 ? 'campaign' : 'single-asset');
      setSelectedAssetTypes(assetTypes);
      // Initialize audiences from opportunity
      setSelectedAudiences(opportunity.target_audiences || []);
    }
  }, [opportunity?.id]);

  // Filter out incompatible audiences when asset types change
  useEffect(() => {
    if (selectedAssetTypes.length > 0) {
      setSelectedAudiences(prev => 
        prev.filter(audience => isAudienceCompatible(audience))
      );
    }
  }, [selectedAssetTypes]);

  // Get suggested asset types from opportunity (safe with optional chaining)
  const suggestedMappings = mapChannelsToAssetTypes(opportunity?.suggested_channels || []);
  const suggestedAssetTypes = suggestedMappings.map(m => m.assetType);

  // Calculate pre-filled values (safe with optional chaining)
  const prefilledAudience = opportunity?.target_audiences?.[0] || 'HCP';
  const prefilledObjective = mapOpportunityTypeToObjective(opportunity?.opportunity_type || '', prefilledAudience);
  const prefilledCTA = generateIntelligentCTA(opportunity);
  const prefilledKeyMessage = opportunity?.recommended_actions?.map((a) => a.action).join('. ') || '';

  // Handle asset type selection
  const handleAssetToggle = (assetType) => {
    if (initiativeType === 'single-asset') {
      // Radio behavior - only one selection
      setSelectedAssetTypes([assetType]);
    } else {
      // Checkbox behavior - multiple selections
      setSelectedAssetTypes(prev => 
        prev.includes(assetType) 
          ? prev.filter(t => t !== assetType)
          : [...prev, assetType]
      );
    }
  };

  const startMutation = useMutation({
    mutationFn: async () => {
      await ContentOpportunityService.trackAction(opportunity.id, 'started', {
        fieldsUsed: ['objective', 'key_message', 'target_audience', 'asset_types', 'cta'],
        assetTypesSelected: selectedAssetTypes,
        initiativeType,
        objectiveMapped: prefilledObjective
      });
      const { error } = await supabase
        .from('content_opportunities')
        .update({ status: 'in_progress' })
        .eq('id', opportunity.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-opportunities'] });
      toast({
        title: 'Opportunity Started',
        description: 'Navigating to content creation with pre-filled intelligence...'
      });
      onClose();
      navigate('/intake-flow', { 
        state: { 
          opportunity,
          selectedAssetTypes,
          initiativeType,
          startAtStep: 1, // Skip to Asset Selection step
          prefilledFromOpportunity: true,
          // Pass calculated pre-filled values directly
          prefilledObjective,
          prefilledCTA,
          prefilledKeyMessage,
          // Map audiences to valid AudienceType values before passing
          prefilledAudience: mapAudienceToFormType(selectedAudiences[0] || prefilledAudience),
          selectedAudiences: selectedAudiences.map(a => mapAudienceToFormType(a))
        }
      });
    },
    onError: (error) => {
      console.error('Failed to start opportunity:', error);
      toast({
        title: 'Error',
        description: 'Failed to start content generation. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const dismissMutation = useMutation({
    mutationFn: async () => {
      await ContentOpportunityService.trackAction(opportunity.id, 'dismissed');
      const { error } = await supabase
        .from('content_opportunities')
        .update({ status: 'dismissed' })
        .eq('id', opportunity.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-opportunities'] });
      toast({ title: 'Opportunity dismissed' });
      onClose();
    }
  });

  // Early return AFTER all hooks have been called
  if (!opportunity) {
    return null;
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {opportunity.title}
            <Badge variant={getPriorityColor(opportunity.priority)}>
              {opportunity.priority}
            </Badge>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Content opportunity details and actions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Overview */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Overview
            </h4>
            <p className="text-sm text-muted-foreground">{opportunity.description}</p>
          </div>

          <Separator />

          {/* Metrics */}
          <div>
            <h4 className="font-medium mb-3">Performance Indicators</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Impact Score</p>
                <p className="text-2xl font-bold">{opportunity.impact_score}%</p>
              </div>
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Urgency Score</p>
                <p className="text-2xl font-bold">{opportunity.urgency_score}%</p>
              </div>
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="text-2xl font-bold">
                  {(opportunity.confidence_score * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Initiative Type Selection */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Initiative Type
            </h4>
            <RadioGroup 
              value={initiativeType} 
              onValueChange={(value) => {
                setInitiativeType(value);
                // Reset selections when switching to single-asset
                if (value === 'single-asset' && selectedAssetTypes.length > 1) {
                  setSelectedAssetTypes([selectedAssetTypes[0]]);
                }
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single-asset" id="single-asset" />
                <Label htmlFor="single-asset" className="cursor-pointer">Single Asset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="campaign" id="campaign" />
                <Label htmlFor="campaign" className="cursor-pointer">Campaign (Multi-Asset)</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Interactive Asset Type Selection */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Select Asset Types
              <Badge variant="outline" className="ml-2">
                {selectedAssetTypes.length} selected
              </Badge>
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              {initiativeType === 'single-asset' 
                ? 'Select one asset type to create' 
                : 'Select multiple asset types for your campaign'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedMappings.map((mapping, idx) => {
                const config = assetTypeConfig[mapping.assetType];
                const isSelected = selectedAssetTypes.includes(mapping.assetType);
                const IconComponent = config?.icon || FileText;
                
                return (
                  <div
                    key={idx}
                    onClick={() => handleAssetToggle(mapping.assetType)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      isSelected 
                        ? "border-primary bg-primary/10 ring-1 ring-primary" 
                        : "border-border hover:border-primary/50 hover:bg-accent/30"
                    )}
                  >
                    {initiativeType === 'campaign' ? (
                      <Checkbox 
                        checked={isSelected}
                        className="pointer-events-none"
                      />
                    ) : (
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                      </div>
                    )}
                    <IconComponent className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium", isSelected && "text-primary")}>
                        {mapping.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {config?.description || `From "${mapping.channel}" channel`}
                      </p>
                    </div>
                    {suggestedAssetTypes.includes(mapping.assetType) && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Suggested
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Pre-fill Preview (Collapsible) */}
          <div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 w-full text-left font-medium mb-3"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              What Will Be Pre-filled
              {showPreview ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
            </button>
            {showPreview && (
              <div className="space-y-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Primary Objective</p>
                    <Badge variant="outline">{getObjectiveLabel(prefilledObjective)}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Target Audience</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedAudiences.length > 0 
                        ? selectedAudiences.map((aud, i) => (
                            <Badge key={i} variant="outline">{aud}</Badge>
                          ))
                        : <Badge variant="outline">{prefilledAudience}</Badge>
                      }
                    </div>
                  </div>
                </div>
                {prefilledKeyMessage && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Key Message</p>
                    <p className="text-sm text-foreground line-clamp-2">{prefilledKeyMessage}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Call to Action</p>
                  <p className="text-sm text-foreground">{prefilledCTA}</p>
                </div>
                <div className="pt-2 border-t border-primary/10">
                  <p className="text-xs text-muted-foreground">
                    📊 Based on: {getOpportunityTypeLabel(opportunity.opportunity_type)} opportunity
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Target Audiences - Interactive Selection */}
          {opportunity.target_audiences && opportunity.target_audiences.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Target Audiences
                  <Badge variant="outline" className="ml-2">
                    {selectedAudiences.length} selected
                  </Badge>
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Select target audiences (grayed options not recommended for selected asset types)
                </p>
                <div className="flex flex-wrap gap-2">
                  {opportunity.target_audiences.map((audience, idx) => {
                    const isCompatible = isAudienceCompatible(audience);
                    const isSelected = selectedAudiences.includes(audience);
                    
                    return (
                      <Badge
                        key={idx}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all",
                          !isCompatible && "opacity-40 cursor-not-allowed line-through",
                          isSelected && "ring-1 ring-primary"
                        )}
                        onClick={() => {
                          if (!isCompatible) return;
                          setSelectedAudiences(prev => 
                            prev.includes(audience)
                              ? prev.filter(a => a !== audience)
                              : [...prev, audience]
                          );
                        }}
                      >
                        {audience}
                        {!isCompatible && " ⚠️"}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Success Patterns */}
          {opportunity.matched_success_patterns && opportunity.matched_success_patterns.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Matched Success Patterns
                </h4>
                <div className="space-y-2">
                  {opportunity.matched_success_patterns.map((pattern, idx) => (
                    <div key={idx} className="p-3 bg-accent/30 rounded-lg">
                      <p className="font-medium text-sm">{pattern.pattern_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pattern.pattern_description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          +{pattern.avg_performance_lift}% lift
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {(pattern.confidence_score * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Intelligence Sources */}
          {opportunity.intelligence_sources && opportunity.intelligence_sources.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2 text-xs text-muted-foreground">
                  Intelligence Sources
                </h4>
                <div className="flex flex-wrap gap-1">
                  {opportunity.intelligence_sources.map((source, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {source.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending || selectedAssetTypes.length === 0}
            className="flex-1"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Content ({selectedAssetTypes.length} {selectedAssetTypes.length === 1 ? 'asset' : 'assets'})
          </Button>
          <Button
            variant="outline"
            onClick={() => dismissMutation.mutate()}
            disabled={dismissMutation.isPending}
          >
            <X className="h-4 w-4 mr-2" />
            Dismiss
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};