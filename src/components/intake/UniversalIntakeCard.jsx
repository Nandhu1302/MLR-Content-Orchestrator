import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarIcon, Save, ArrowLeft, ArrowRight, CheckCircle, Info, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
// Type imports removed
// import { IntakeData, AssetType, InitiativeType, Indication, AudienceType, Market } from '@/types/intake';
import { assetConfigurations } from '@/data/assetConfigurations';
import { userProfiles } from '@/data/simulation';
import { useBrand } from '@/contexts/BrandContext';
import { BrandConfigValidator } from '@/utils/brandConfigValidator';
import { SmartKeyMessageSelector } from './SmartKeyMessageSelector';
import { SmartCTASelector } from './SmartCTASelector';
import BrandContextDisplay from './BrandContextDisplay';
import { filterAssetsByAudience, getFilteredAssetsExplanation, getComplianceLevel } from '@/utils/assetAudienceFilter';
import { generateAudienceSpecificContent } from '@/services/audienceSpecificContentGenerator';
import { getAudienceObjectives } from '@/services/audienceAssetMappingService';
import { useBrandDocuments } from '@/hooks/useBrandDocuments';
import { supabase } from '@/integrations/supabase/client';
import { getSpecialistFromIndication } from '@/config/indicationSpecialistMapping';
import { getSuggestedObjective } from '@/services/audienceAssetMappingService';
import { useIntakeForm } from '@/hooks/useIntakeForm';
import { SpecialistMapper } from '@/utils/specialistMapping';
import { brandIndicationMap, defaultIndications, brandAudienceMap } from '@/config/brandMappings';
import { getObjectiveLabel } from '@/utils/opportunityToIntakeMapper';// In UniversalIntakeCard.jsx:
import CompactIntelligenceBadge from '/src/components/Intelligence/CompactIntelligenceBadge.jsx';
// NOTE: No curly braces
import { IntelligenceDetailModal } from '@/components/intelligence/IntelligenceDetailModal';
import { IntelligenceGuidedRecommendations } from './IntelligenceGuidedRecommendations';
import { useIntelligence } from '@/contexts/IntelligenceContext';

// Interface removed

// Type assertion removed
const assetTypeLabels = {
  'mass-email': 'Mass Email',
  'rep-triggered-email': 'Rep Triggered Email',
  'patient-email': 'Patient Education Email',
  'caregiver-email': 'Caregiver Support Email',
  'social-media-post': 'Social Media Post',
  'website-landing-page': 'Website Landing Page',
  'digital-sales-aid': 'Digital Sales Aid'
};


// Interface and type annotations removed
const UniversalIntakeCard = ({ onComplete, onCancel, onSaveDraft, initialData, onStepChange, sessionId, startAtStep }) => {
  const currentUser = userProfiles.user1; // Sheikh's profile
  const { selectedBrand, brandConfiguration, isLoading: brandLoading } = useBrand();
  const { data: documentsStatus } = useBrandDocuments(selectedBrand?.id);
  const { intelligence, isLoading: intelligenceLoading } = useIntelligence();
  
  // Extract opportunity context from initialData if available
  // Type assertion removed
  const opportunityContext = {
    opportunityType: initialData?.opportunityType,
    suggestedChannels: initialData?.suggestedChannels,
  };
  
  // Intelligence modal state
  const [intelligenceModalOpen, setIntelligenceModalOpen] = useState(false);
  
  // Fetch PI data for Clinical Strength Indicator
  const [piData, setPiData] = useState(null);
  
  useEffect(() => {
    const fetchPIData = async () => {
      if (!selectedBrand?.id || !documentsStatus?.pi.exists || documentsStatus?.pi.status !== 'completed') {
        setPiData(null);
        return;
      }
      
      const { data: piRecords } = await supabase
        .from('brand_documents')
        .select('parsed_data')
        .eq('brand_id', selectedBrand.id)
        .eq('parsing_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (piRecords && piRecords[0]) {
        setPiData(piRecords[0].parsed_data);
      }
    };
    
    fetchPIData();
  }, [selectedBrand?.id, documentsStatus]);

  // Debug brand loading
  useEffect(() => {
    console.log('UniversalIntakeCard - Brand state:', { 
      selectedBrand: selectedBrand?.brand_name, 
      brandLoading,
      hasIndicationMap: selectedBrand ? !!brandIndicationMap[selectedBrand.brand_name] : false
    });
  }, [selectedBrand, brandLoading]);

  // Get brand-specific default indication
  // Type annotation removed
  const getDefaultIndication = () => {
    if (selectedBrand && brandIndicationMap[selectedBrand.brand_name]) {
      // Type assertion removed
      return brandIndicationMap[selectedBrand.brand_name][0].value;
    }
    // Type assertion removed
    return selectedBrand?.therapeutic_area || null;
  };

  // Get available indications based on brand state
  const getAvailableIndications = () => {
    if (brandLoading) {
      // Type assertion removed
      return [{ value: 'loading', label: 'Loading indications...' }];
    }
    
    if (selectedBrand && brandIndicationMap[selectedBrand.brand_name]) {
      console.log('✅ Using brand-specific indications for:', selectedBrand.brand_name);
      console.log('📋 Available indications:', brandIndicationMap[selectedBrand.brand_name].map(i => i.label).join(', '));
      
      // Validate brand configuration
      const indications = brandIndicationMap[selectedBrand.brand_name].map(i => i.value);
      const validation = BrandConfigValidator.validateBrandIndications(selectedBrand, indications);
      if (!validation.isValid) {
        console.error('⚠️ Brand configuration validation failed:', validation.warnings);
      }
      
      return brandIndicationMap[selectedBrand.brand_name];
    }
    
    console.log('❌ No brand selected or no indication mapping found');
    // When no brand is selected, show message instead of fallback
    // Type assertion removed
    return [{ value: 'IPF', label: 'Please select a brand first' }];
  };
  
  // Use custom hook for form management
  const { 
    formData, 
    updateWithSpecialistContext, 
    ensureSpecialistContext,
    autoSuggestObjective 
  } = useIntakeForm({
    initialData: {
      brand: selectedBrand?.brand_name || 'Ofev',
      indication: getDefaultIndication(),
      primaryAudience: 'Physician-Specialist',
      targetMarkets: ['US'],
      selectedAssetTypes: [],
      initiativeType: 'single-asset',
      audienceSegment: [],
      regulatoryFlags: [],
      fairBalanceRequired: true,
      plannedLaunch: new Date(),
      milestones: [],
      createdBy: currentUser.id,
      ...initialData  // Ensure pre-filled data overrides defaults
    }
  });

  // Initialize step from startAtStep prop (for opportunity flow) or default to 0
  const [currentStep, setCurrentStep] = useState(startAtStep ?? 0);
  const [validationErrors, setValidationErrors] = useState([]);

  // Filter assets based on selected audience
  const filteredAssets = filterAssetsByAudience(
    assetConfigurations.map(config => config.type),
    formData.primaryAudience || null
  );

  // Get explanations for filtered assets
  const filteredExplanations = getFilteredAssetsExplanation(
    filteredAssets.filteredAssets,
    formData.primaryAudience || 'Physician-Specialist'
  );

  // Update form data when selected brand changes
  useEffect(() => {
    if (selectedBrand && formData.brand !== selectedBrand.brand_name) {
      const newIndication = getDefaultIndication();
      console.log('Updating brand and indication:', selectedBrand.brand_name, newIndication);
      updateFormData({
        brand: selectedBrand.brand_name,
        indication: newIndication
      });
    }
  }, [selectedBrand]);

  // Notify parent about step changes for auto-save
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const steps = [
    { id: 'basic', title: 'Basic Information', required: true },
    { id: 'assets', title: 'Asset Selection', required: true },
    { id: 'content', title: 'Content Strategy', required: true },
    { id: 'regulatory', title: 'Regulatory & Timeline', required: true }
  ];

  const validateCurrentStep = () => {
    // Type assertion removed
    const errors = [];
    
    switch(currentStep) {
      case 0: // Basic Information
        if (!formData.projectName) errors.push('Project name is required');
        if (!formData.initiativeType) errors.push('Initiative type is required');
        if (!formData.indication) errors.push('Indication is required');
        break;
      case 1: // Asset Selection
        if (!formData.selectedAssetTypes?.length) errors.push('At least one asset type must be selected');
        break;
      case 2: // Content Strategy
        if (!formData.primaryObjective) errors.push('Primary objective is required');
        if (!formData.keyMessage) errors.push('Key message is required');
        
        // Validate asset name matches selected asset type
        if (formData.selectedAssetTypes?.length === 1 && formData.projectName) {
          const assetType = formData.selectedAssetTypes[0];
          const name = formData.projectName.toLowerCase();
          const mismatchWarning = validateAssetNameType(name, assetType);
          if (mismatchWarning) {
            // This is a warning, not an error - don't block progression
            console.warn('Asset name/type mismatch:', mismatchWarning);
          }
        }
        break;
      case 3: // Regulatory & Timeline
        if (!formData.plannedLaunch) errors.push('Planned launch date is required');
        break;
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (validateCurrentStep()) {
      // Ensure specialist context using utility
      const specialistContext = ensureSpecialistContext();
      
      // Type assertion removed
      const completeData = {
        projectId: `proj_${Date.now()}`,
        projectName: formData.projectName || '',
        initiativeType: formData.initiativeType || 'single-asset',
        brand: selectedBrand?.brand_name || formData.brand || 'Ofev',
        indication: formData.indication || getDefaultIndication(),
        primaryAudience: formData.primaryAudience || 'Physician-Specialist',
        audienceSegment: formData.audienceSegment || [],
        targetMarkets: formData.targetMarkets || ['US'],
        selectedAssetTypes: formData.selectedAssetTypes || [],
        primaryObjective: formData.primaryObjective || '',
        keyMessage: formData.keyMessage || '',
        callToAction: formData.callToAction || '',
        regulatoryFlags: formData.regulatoryFlags || [],
        fairBalanceRequired: formData.fairBalanceRequired || true,
        plannedLaunch: formData.plannedLaunch || new Date(),
        milestones: formData.milestones || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser.id,
        status: 'draft',
        ...specialistContext
      };
      
      onComplete(completeData);
    }
  };

  // Type annotation removed
  const updateFormData = (updates) => {
    updateWithSpecialistContext(updates);
    
    // Auto-suggest objective when audience or asset types change
    if ((updates.primaryAudience || updates.selectedAssetTypes) && !formData.primaryObjective) {
      autoSuggestObjective();
    }
  };

  // Type annotation removed
  const getAssetNameSuggestion = (assetType) => {
    const type = assetType || formData.selectedAssetTypes?.[0];
    const brand = selectedBrand?.brand_name || 'Brand';
    const indication = formData.indication || 'Indication';
    
    // Type assertion removed
    const typeNames = {
      'mass-email': 'Mass Email',
      'rep-triggered-email': 'Rep Email',
      'social-media-post': 'Social Post',
      'website-landing-page': 'Landing Page',
      'digital-sales-aid': 'Sales Aid'
    };
    
    // Type assertion removed
    return `${brand} ${indication} ${typeNames[type] || 'Asset'} 01`;
  };

  // Type annotation removed
  const shouldAutoUpdateName = (currentName, newAssetType) => {
    // Check if the current name seems to be from a different asset type
    // Type assertion removed
    const typeKeywords = {
      'mass-email': ['email', 'mail'],
      'rep-triggered-email': ['email', 'rep', 'mail'], 
      'social-media-post': ['social', 'post'],
      'website-landing-page': ['landing', 'page', 'web'],
      'digital-sales-aid': ['sales', 'aid', 'dsa']
    };
    
    const currentKeywords = typeKeywords[newAssetType] || [];
    const nameWords = currentName.toLowerCase().split(' ');
    
    // If the name contains keywords from the new asset type, don't auto-update
    if (currentKeywords.some(keyword => nameWords.includes(keyword))) {
      return false;
    }
    
    // If the name seems generic or contains keywords from other asset types, suggest update
    const allOtherKeywords = Object.entries(typeKeywords)
      .filter(([type]) => type !== newAssetType)
      .flatMap(([_, keywords]) => keywords);
      
    return allOtherKeywords.some(keyword => nameWords.includes(keyword));
  };

  // Type annotation removed
  const validateAssetNameType = (name, assetType) => {
    // Type assertion removed
    const typeKeywords = {
      'mass-email': ['email', 'mail'],
      'rep-triggered-email': ['email', 'rep', 'mail'], 
      'social-media-post': ['social', 'post'],
      'website-landing-page': ['landing', 'page', 'web', 'site'],
      'digital-sales-aid': ['sales', 'aid', 'dsa']
    };
    
    const nameWords = name.toLowerCase().split(' ');
    const correctKeywords = typeKeywords[assetType] || [];
    const wrongKeywords = Object.entries(typeKeywords)
      .filter(([type]) => type !== assetType)
      .flatMap(([_, keywords]) => keywords);
    
    // Check if name contains keywords from other asset types
    const conflictingKeywords = wrongKeywords.filter(keyword => 
      nameWords.some(word => word.includes(keyword))
    );
    
    if (conflictingKeywords.length > 0) {
      const assetTypeName = assetTypeLabels[assetType];
      return `Asset name suggests "${conflictingKeywords.join(', ')}" but type is "${assetTypeName}"`;
    }
    
    return null;
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData, currentStep);
      toast({
        title: "Draft saved",
        description: "Your progress has been saved successfully.",
      });
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project/Asset Name *</Label>
                <Input
                  id="projectName"
                  value={formData.projectName || ''}
                  onChange={(e) => updateFormData({ projectName: e.target.value })}
                  placeholder={getAssetNameSuggestion()}
                />
                {formData.selectedAssetTypes?.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    💡 Suggested: {getAssetNameSuggestion()}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="initiativeType">Initiative Type *</Label>
                {/* Type assertion removed */}
                <Select 
                  value={formData.initiativeType} 
                  onValueChange={(value) => updateFormData({ initiativeType: value })}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-lg z-50">
                    <SelectItem value="single-asset" className="hover:bg-muted focus:bg-muted">Single Asset</SelectItem>
                    <SelectItem value="campaign" className="hover:bg-muted focus:bg-muted">Campaign (Multi-Asset)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Brand & Indication *</Label>
                {/* Enhanced Brand Context Display */}
                <div className="p-3 border rounded-md bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="px-3 py-1 font-semibold">
                        {brandLoading ? 'Loading...' : selectedBrand?.brand_name || 'No Brand Selected'}
                      </Badge>
                      {selectedBrand && (
                        <Badge variant="outline" className="px-2 py-1 text-xs">
                          {selectedBrand.company} • {selectedBrand.therapeutic_area}
                        </Badge>
                      )}
                    </div>
                    {selectedBrand && brandIndicationMap[selectedBrand.brand_name] && (
                      <Badge variant="secondary" className="text-xs">
                        {brandIndicationMap[selectedBrand.brand_name].length} indications available
                      </Badge>
                    )}
                  </div>
                   {/* Type assertion removed */}
                   <Select 
                     value={formData.indication} 
                     onValueChange={(value) => {
                       // Auto-populate specialist info if primaryAudience is already set to Physician-Specialist
                       if (formData.primaryAudience === 'Physician-Specialist') {
                         const specialistInfo = getSpecialistFromIndication(value);
                         if (specialistInfo) {
                           console.log('🎯 Auto-populating specialist context on indication change:', {
                             indication: value,
                             specialistType: specialistInfo.specialistType,
                             specialistDisplayName: specialistInfo.specialistDisplayName,
                             therapeuticArea: specialistInfo.therapeuticArea
                           });
                           updateFormData({ 
                             indication: value,
                             specialistType: specialistInfo.specialistType,
                             specialistDisplayName: specialistInfo.specialistDisplayName,
                             therapeuticArea: specialistInfo.therapeuticArea
                           });
                         } else {
                           updateFormData({ indication: value });
                         }
                       } else {
                         updateFormData({ indication: value });
                       }
                     }}
                     disabled={brandLoading || !selectedBrand}
                   >
                     <SelectTrigger className="w-full bg-background border-border">
                       <SelectValue placeholder={
                         brandLoading ? 'Loading indications...' : 
                         !selectedBrand ? 'Select a brand first' : 
                         'Select indication'
                       } />
                     </SelectTrigger>
                     <SelectContent className="bg-background border-border shadow-lg z-50">
                       {getAvailableIndications().map(indication => (
                         <SelectItem 
                           key={indication.value} 
                           value={indication.value}
                           disabled={brandLoading || !selectedBrand || indication.label.includes('Please select')}
                           className="hover:bg-muted focus:bg-muted"
                         >
                           {indication.label}
                         </SelectItem>
                       ))}
                       {selectedBrand && brandIndicationMap[selectedBrand.brand_name] && (
                         <div className="px-2 py-1 text-xs text-muted-foreground">
                           Brand-specific indications for {selectedBrand.brand_name}
                         </div>
                       )}
                     </SelectContent>
                   </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Primary Audience *</Label>
                {/* Type assertion removed */}
                <Select 
                  value={formData.primaryAudience} 
                  onValueChange={(value) => {
                    // Auto-populate specialist info when Physician-Specialist is selected
                    if (value === 'Physician-Specialist' && formData.indication) {
                      const specialistInfo = getSpecialistFromIndication(formData.indication);
                      if (specialistInfo) {
                        updateFormData({ 
                          primaryAudience: value,
                          specialistType: specialistInfo.specialistType,
                          specialistDisplayName: specialistInfo.specialistDisplayName,
                          therapeuticArea: specialistInfo.therapeuticArea
                        });
                      } else {
                        updateFormData({ primaryAudience: value });
                      }
                    } else {
                      updateFormData({ primaryAudience: value });
                    }
                  }}
                  disabled={!formData.indication}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder={!formData.indication ? "Select indication first" : "Select primary audience"} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-lg z-50">
                    <SelectGroup>
                      <SelectLabel>Healthcare Professionals</SelectLabel>
                      <SelectItem value="Physician-Specialist" className="hover:bg-muted focus:bg-muted">Physician - Specialist</SelectItem>
                      <SelectItem value="Physician-PrimaryCare" className="hover:bg-muted focus:bg-muted">Physician - Primary Care</SelectItem>
                      <SelectItem value="Pharmacist" className="hover:bg-muted focus:bg-muted">Pharmacist</SelectItem>
                      <SelectItem value="Nurse-RN" className="hover:bg-muted focus:bg-muted">Registered Nurse (RN)</SelectItem>
                      <SelectItem value="Nurse-NP-PA" className="hover:bg-muted focus:bg-muted">Nurse Practitioner / PA</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Patients & Caregivers</SelectLabel>
                      <SelectItem value="Patient" className="hover:bg-muted focus:bg-muted">Patient</SelectItem>
                      <SelectItem value="Caregiver-Family" className="hover:bg-muted focus:bg-muted">Family Caregiver</SelectItem>
                      <SelectItem value="Caregiver-Professional" className="hover:bg-muted focus:bg-muted">Professional Caregiver</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Other</SelectLabel>
                      <SelectItem value="Other" className="hover:bg-muted focus:bg-muted">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Markets *</Label>
              <div className="flex flex-wrap gap-2">
                {/* Type assertion removed */}
                {(['US', 'EU', 'UK', 'Canada']).map((market) => (
                  <label key={market} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.targetMarkets?.includes(market)}
                      onCheckedChange={(checked) => {
                        const markets = formData.targetMarkets || [];
                        if (checked) {
                          updateFormData({ targetMarkets: [...markets, market] });
                        } else {
                          updateFormData({ targetMarkets: markets.filter(m => m !== market) });
                        }
                      }}
                    />
                    <span className="text-sm">{market}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 1: // Asset Selection
        return (
          <div className="space-y-6">
            {/* Opportunity Context Banner */}
            {/* Type assertion removed */}
            {initialData?._fromOpportunity && (
              <Alert className="border-primary/50 bg-primary/5">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Intelligence-Driven Content</AlertTitle>
                <AlertDescription>
                  <p className="text-sm">
                    {/* Type assertion removed */}
                    Based on: <strong>{initialData?._opportunityTitle}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Assets below are pre-selected based on opportunity analysis. You can modify selections as needed.
                  </p>
                </AlertDescription>
              </Alert>
            )}
            
            {/* Intelligence-Guided Recommendations - hidden when fields are pre-filled from opportunity */}
            <IntelligenceGuidedRecommendations
              context={{
                indication: formData.indication,
                audience: formData.primaryAudience,
                assetTypes: formData.selectedAssetTypes,
                objective: formData.primaryObjective,
                opportunityType: opportunityContext.opportunityType,
                suggestedChannels: opportunityContext.suggestedChannels,
                preFilledFields: {
                  hasAssetTypes: (formData.selectedAssetTypes?.length || 0) > 0,
                  hasObjective: !!formData.primaryObjective,
                  hasKeyMessage: !!formData.keyMessage,
                  hasCTA: !!formData.callToAction,
                  // Type assertion removed
                  fromOpportunity: !!initialData?._fromOpportunity,
                },
              }}
              // Type annotation removed
              onRecommendationSelect={(type, value) => {
                if (type === 'assetType') {
                  const types = formData.selectedAssetTypes || [];
                  if (formData.initiativeType === 'single-asset') {
                    // Type assertion removed
                    updateFormData({ selectedAssetTypes: [value] });
                  } else {
                    // Type assertion removed
                    updateFormData({ selectedAssetTypes: [...types, value] });
                  }
                }
              }}
            />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Select Asset Types</Label>
                {formData.primaryAudience && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Info className="h-4 w-4 mr-1" />
                          Filtered for {formData.primaryAudience}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{filteredAssets.audienceGuidance}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              {/* Show audience guidance */}
              {formData.primaryAudience && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {filteredAssets.audienceGuidance}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAssets.allowedAssets.map((assetType) => {
                  const config = assetConfigurations.find(c => c.type === assetType);
                  const audienceDesc = filteredAssets.assetDescriptions[assetType];
                  const complianceLevel = getComplianceLevel(assetType, formData.primaryAudience || 'Physician-Specialist');
                  const isSelected = formData.selectedAssetTypes?.includes(assetType);
                  const canSelect = formData.initiativeType === 'campaign' || 
                                   formData.selectedAssetTypes?.length === 0 || isSelected;
                  
                  if (!config) return null;
                  
                  return (
                    <div
                      key={assetType}
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all",
                        isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                        !canSelect && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => {
                        if (!canSelect) return;
                        
                        const types = formData.selectedAssetTypes || [];
                        if (isSelected) {
                          updateFormData({ 
                            selectedAssetTypes: types.filter(t => t !== assetType) 
                          });
                        } else if (formData.initiativeType === 'single-asset') {
                          // Type assertion removed
                          updateFormData({ selectedAssetTypes: [assetType] });
                        } else {
                          // Type assertion removed
                          updateFormData({ 
                            selectedAssetTypes: [...types, assetType] 
                          });
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-1">
                            <Checkbox
                              checked={isSelected}
                              disabled={!canSelect}
                              onChange={() => {}}
                            />
                            <h4 className="font-medium">
                              {audienceDesc?.name || config.name}
                            </h4>
                            {complianceLevel && (
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs",
                                complianceLevel === 'high' ? "bg-red-100 text-red-800" :
                                complianceLevel === 'medium' ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              )}>
                                {complianceLevel} compliance
                              </span>
                            )}
                            {/* Show intelligence badge for pre-selected assets from opportunity */}
                            {isSelected && initialData?._fromOpportunity && initialData?.selectedAssetTypes?.includes(assetType) && (
                              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                <Sparkles className="h-3 w-3 mr-1" />
                                From Intelligence
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {audienceDesc?.description || config.description}
                          </p>
                          
                          {audienceDesc?.examples && audienceDesc.examples.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-muted-foreground">Examples:</p>
                              <ul className="text-xs font-medium text-muted-foreground list-disc list-inside">
                                {audienceDesc.examples.slice(0, 2).map((example, idx) => (
                                  <li key={idx}>{example}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {audienceDesc?.complianceNotes && audienceDesc.complianceNotes.length > 0 && (
                            <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                              <p className="font-medium">Compliance Notes:</p>
                              <ul className="list-disc list-inside">
                                {audienceDesc.complianceNotes.slice(0, 2).map((note, idx) => (
                                  <li key={idx}>{note}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground ml-4">
                          <div>{config.estimatedHours}h</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Show filtered assets explanation */}
              {filteredAssets.filteredAssets.length > 0 && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">
                    Why some assets aren't shown:
                  </h4>
                  {filteredAssets.filteredAssets.map(assetType => {
                    const config = assetConfigurations.find(c => c.type === assetType);
                    const explanation = filteredExplanations[assetType];
                    return (
                      <div key={assetType} className="text-sm text-muted-foreground mb-1">
                        <strong>{config?.name}:</strong> {explanation}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 2: // Content Strategy
        return (
            <div className="space-y-6">
            {/* Intelligence-Guided Objective Recommendations */}
            <IntelligenceGuidedRecommendations
              context={{
                indication: formData.indication,
                audience: formData.primaryAudience,
                assetTypes: formData.selectedAssetTypes,
                objective: formData.primaryObjective,
                opportunityType: opportunityContext.opportunityType,
                suggestedChannels: opportunityContext.suggestedChannels,
                preFilledFields: {
                  hasObjective: !!formData.primaryObjective,
                  hasKeyMessage: !!formData.keyMessage,
                  hasAssetTypes: (formData.selectedAssetTypes?.length || 0) > 0,
                },
              }}
              // Type annotation removed
              onRecommendationSelect={(type, value) => {
                if (type === 'objective') {
                  updateFormData({ primaryObjective: value });
                } else if (type === 'audience') {
                  // Type assertion removed
                  updateFormData({ primaryAudience: value });
                }
              }}
            />
            
            {/* Primary Objective - Now audience-aware */}
            <div className="space-y-2">
              <Label htmlFor="primaryObjective">Primary Objective *</Label>
              {formData.primaryAudience ? (
                <Select 
                  value={formData.primaryObjective} 
                  onValueChange={(value) => updateFormData({ primaryObjective: value })}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder={`Select objective for ${formData.primaryAudience} audience`} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-lg z-50">
                    {(() => {
                      // Get filtered objectives based on audience and asset types
                      const filteredObjectives = getAudienceObjectives(formData.primaryAudience, formData.selectedAssetTypes);
                      
                      // Ensure current objective is always in the list (if pre-filled from opportunity)
                      if (formData.primaryObjective && !filteredObjectives.find(o => o.value === formData.primaryObjective)) {
                        filteredObjectives.unshift({
                          value: formData.primaryObjective,
                          label: getObjectiveLabel(formData.primaryObjective),
                          description: 'Pre-selected from opportunity intelligence',
                          applicableAssets: formData.selectedAssetTypes || []
                        });
                      }
                      
                      return filteredObjectives.map(objective => (
                        <SelectItem key={objective.value} value={objective.value} className="hover:bg-muted focus:bg-muted">
                          <div className="flex flex-col">
                            <span className="font-medium">{objective.label}</span>
                            <span className="text-xs text-muted-foreground">{objective.description}</span>
                          </div>
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 border border-muted-foreground/20 rounded-md bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    Please select a primary audience first to see relevant objectives
                  </p>
                </div>
              )}
              
              {/* Show smart suggestion */}
              {formData.primaryAudience && formData.selectedAssetTypes && formData.selectedAssetTypes.length > 0 && !formData.primaryObjective && (
                <div className="text-xs text-muted-foreground">
                  💡 Suggested: {getSuggestedObjective(formData.primaryAudience, formData.selectedAssetTypes, formData.indication)?.label}
                </div>
              )}
            </div>

            <SmartKeyMessageSelector
              value={formData.keyMessage || ''}
              onChange={(value) => updateFormData({ keyMessage: value })}
              context={selectedBrand && formData.indication && formData.primaryAudience && formData.primaryObjective ? {
                brand: selectedBrand,
                guidelines: brandConfiguration?.guidelines,
                indication: formData.indication,
                audience: formData.primaryAudience,
                objective: formData.primaryObjective
              } : null}
              placeholder={`e.g., ${selectedBrand?.brand_name || 'Brand'} delivers proven therapeutic benefits for ${formData.indication || 'indication'} patients`}
            />

            <SmartCTASelector
              value={formData.callToAction || ''}
              onChange={(value) => updateFormData({ callToAction: value })}
              context={selectedBrand && formData.indication && formData.primaryAudience && formData.primaryObjective ? {
                brand: selectedBrand,
                guidelines: brandConfiguration?.guidelines,
                indication: formData.indication,
                audience: formData.primaryAudience,
                objective: formData.primaryObjective
              } : null}
              placeholder={`e.g., Learn more about ${selectedBrand?.brand_name || 'our treatment'}, Request patient resources`}
            />

          </div>
        );

      case 3: // Regulatory & Timeline
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Planned Launch Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.plannedLaunch && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.plannedLaunch ? format(formData.plannedLaunch, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.plannedLaunch}
                      onSelect={(date) => updateFormData({ plannedLaunch: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Compact Intelligence Badge - Floating top-right */}
      {!intelligenceLoading && intelligence && (
        <div className="fixed top-24 right-8 z-50">
          <CompactIntelligenceBadge
            intelligence={intelligence}
            onOpenDetails={() => setIntelligenceModalOpen(true)}
            placement="floating"
          />
        </div>
      )}

      {/* Intelligence Detail Modal */}
      <IntelligenceDetailModal
        open={intelligenceModalOpen}
        onClose={() => setIntelligenceModalOpen(false)}
        intelligence={intelligence}
        currentFormData={formData}
        // Type annotation removed
        onApplyIntelligence={(field, value) => {
          // Apply intelligence to form
          updateFormData({ [field]: value });
          toast({
            title: "Intelligence Applied",
            description: `${field} updated from intelligence library`,
          });
          setIntelligenceModalOpen(false);
        }}
      />

      <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">
              {formData.initiativeType === 'campaign' ? 'New Campaign' : 'New Asset'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex space-x-2 mt-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex-1 h-2 rounded-full",
                index <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {validationErrors.length > 0 && (
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Please fix the following errors:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {renderStepContent()}

        <Separator />

        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create {formData.initiativeType === 'campaign' ? 'Campaign' : 'Asset'}
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default UniversalIntakeCard;