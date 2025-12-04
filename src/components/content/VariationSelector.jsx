import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Stethoscope, Heart, Target, MessageSquare, AlertCircle } from 'lucide-react';

export const VariationSelector = ({
  assetType,
  primaryAudience,
  selectedFactors,
  onFactorsChange
}) => {
  const [selectedSubSegments, setSelectedSubSegments] = useState({
    hcp_experience_level: [],
    hcp_practice_setting: [],
    patient_disease_stage: [],
    patient_age_group: [],
    patient_health_literacy: [],
    pharmacist_setting: [],
    pharmacist_focus: [],
    nurse_specialty: [],
    nurse_experience: [],
    caregiver_experience: [],
    caregiver_burden_level: []
  });

  const [selectedOptimizations, setSelectedOptimizations] = useState([]);
  const [selectedMessagingEmphasis, setSelectedMessagingEmphasis] = useState([]);

  // Update parent when selections change
  React.useEffect(() => {
    const factors = buildPersonalizationFactors();
    onFactorsChange(factors);
  }, [selectedSubSegments, selectedOptimizations, selectedMessagingEmphasis]);

  const buildPersonalizationFactors = () => {
    const factors = [];

    // Physician sub-segmentation (Specialist or Primary Care)
    if (primaryAudience.startsWith('Physician')) {
      const audienceType = primaryAudience === 'Physician-Specialist' ? 'physician-specialist' : 'physician-primary-care';
      
      selectedSubSegments.hcp_experience_level.forEach(exp => {
        selectedSubSegments.hcp_practice_setting.forEach(setting => {
          factors.push({
            audience_type: audienceType,
            hcp_experience_level: exp,
            hcp_practice_setting: setting,
            variation_purpose: 'sub_segmentation'
          });
        });
      });

      if (selectedSubSegments.hcp_experience_level.length > 0 && selectedSubSegments.hcp_practice_setting.length === 0) {
        selectedSubSegments.hcp_experience_level.forEach(exp => {
          factors.push({
            audience_type: audienceType,
            hcp_experience_level: exp,
            variation_purpose: 'sub_segmentation'
          });
        });
      }

      if (selectedSubSegments.hcp_practice_setting.length > 0 && selectedSubSegments.hcp_experience_level.length === 0) {
        selectedSubSegments.hcp_practice_setting.forEach(setting => {
          factors.push({
            audience_type: audienceType,
            hcp_practice_setting: setting,
            variation_purpose: 'sub_segmentation'
          });
        });
      }
    }

    // Pharmacist sub-segmentation
    if (primaryAudience === 'Pharmacist') {
      selectedSubSegments.pharmacist_setting.forEach(setting => {
        selectedSubSegments.pharmacist_focus.forEach(focus => {
          factors.push({
            audience_type: 'pharmacist',
            pharmacist_setting: setting,
            pharmacist_focus: focus,
            variation_purpose: 'sub_segmentation'
          });
        });
      });

      if (selectedSubSegments.pharmacist_setting.length > 0 && selectedSubSegments.pharmacist_focus.length === 0) {
        selectedSubSegments.pharmacist_setting.forEach(setting => {
          factors.push({
            audience_type: 'pharmacist',
            pharmacist_setting: setting,
            variation_purpose: 'sub_segmentation'
          });
        });
      }
    }

    // Nurse sub-segmentation
    if (primaryAudience.startsWith('Nurse')) {
      const audienceType = primaryAudience === 'Nurse-NP-PA' ? 'nurse-np-pa' : 'nurse-rn';
      
      selectedSubSegments.nurse_specialty.forEach(specialty => {
        selectedSubSegments.nurse_experience.forEach(exp => {
          factors.push({
            audience_type: audienceType,
            nurse_specialty: specialty,
            nurse_experience: exp,
            variation_purpose: 'sub_segmentation'
          });
        });
      });

      if (selectedSubSegments.nurse_specialty.length > 0 && selectedSubSegments.nurse_experience.length === 0) {
        selectedSubSegments.nurse_specialty.forEach(specialty => {
          factors.push({
            audience_type: audienceType,
            nurse_specialty: specialty,
            variation_purpose: 'sub_segmentation'
          });
        });
      }
    }

    // Caregiver sub-segmentation
    if (primaryAudience.startsWith('Caregiver')) {
      const audienceType = primaryAudience === 'Caregiver-Family' ? 'caregiver-family' : 'caregiver-professional';
      
      selectedSubSegments.caregiver_experience.forEach(exp => {
        selectedSubSegments.caregiver_burden_level.forEach(burden => {
          factors.push({
            audience_type: audienceType,
            caregiver_experience: exp,
            caregiver_burden_level: burden,
            variation_purpose: 'sub_segmentation'
          });
        });
      });

      if (selectedSubSegments.caregiver_experience.length > 0 && selectedSubSegments.caregiver_burden_level.length === 0) {
        selectedSubSegments.caregiver_experience.forEach(exp => {
          factors.push({
            audience_type: audienceType,
            caregiver_experience: exp,
            variation_purpose: 'sub_segmentation'
          });
        });
      }
    }

    // Patient sub-segmentation
    if (primaryAudience === 'Patient') {
      // Combine disease stage with age group and literacy
      selectedSubSegments.patient_disease_stage.forEach(stage => {
        selectedSubSegments.patient_age_group.forEach(age => {
          selectedSubSegments.patient_health_literacy.forEach(literacy => {
            factors.push({
              audience_type: 'patient',
              patient_disease_stage: stage,
              patient_age_group: age,
              patient_health_literacy: literacy,
              variation_purpose: 'sub_segmentation'
            });
          });
        });
      });

      // Single dimension combinations
      if (selectedSubSegments.patient_disease_stage.length > 0) {
        selectedSubSegments.patient_disease_stage.forEach(stage => {
          if (!factors.some(f => f.patient_disease_stage === stage)) {
            factors.push({
              audience_type: 'patient',
              patient_disease_stage: stage,
              variation_purpose: 'sub_segmentation'
            });
          }
        });
      }
    }

    // Content optimization (A/B test) variations
    selectedOptimizations.forEach(opt => {
      factors.push({
        audience_type: primaryAudience,
        content_optimization_type: opt,
        variation_purpose: 'ab_test'
      });
    });

    // Messaging emphasis variations
    selectedMessagingEmphasis.forEach(emphasis => {
      factors.push({
        audience_type: primaryAudience,
        messaging_emphasis: emphasis,
        variation_purpose: 'optimization'
      });
    });

    return factors;
  };

  const toggleSubSegment = (category, value) => {
    setSelectedSubSegments(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const toggleOptimization = (value) => {
    setSelectedOptimizations(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleMessagingEmphasis = (value) => {
    setSelectedMessagingEmphasis(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  // Determine what sections to show based on asset type
  const isEmailAsset = ['email', 'mass-email', 'rep-triggered-email', 'patient-email', 'caregiver-email', 'hcp-email'].includes(assetType);
  const isDSAAsset = ['digital-sales-aid', 'dsa'].includes(assetType);
  const isWebBlogAsset = ['website-landing-page', 'web-content', 'web', 'blog'].includes(assetType);

  // Email: Full personalization (sub-segments + A/B + messaging)
  // DSA: Module ordering focus + HCP sub-segments only
  // Web/Blog: Audience variants only (sub-segments, no A/B)
  const showABTesting = isEmailAsset;
  const showMessagingEmphasis = isEmailAsset || isDSAAsset;

  // Get contextual labels based on asset type
  const getHeaderTitle = () => {
    if (isDSAAsset) return 'Select Module Variant Factors';
    if (isWebBlogAsset) return 'Select Audience Variant Factors';
    return 'Select Personalization Factors';
  };

  const getHeaderDescription = () => {
    if (isDSAAsset) return 'Choose the audience sub-segments and module arrangements you want to generate';
    if (isWebBlogAsset) return 'Choose the audience sub-segments to generate content variants for';
    return 'Choose the audience sub-segments and content variations you want to generate';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4" />
          {getHeaderTitle()}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {getHeaderDescription()}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Physician Sub-Segmentation */}
        {primaryAudience.startsWith('Physician') && (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                <Label className="font-semibold">HCP Experience Level</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['entry', 'mid_career', 'expert'].map(level => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSubSegments.hcp_experience_level.includes(level)}
                      onCheckedChange={() => toggleSubSegment('hcp_experience_level', level)}
                    />
                    <label className="text-sm cursor-pointer">
                      {level === 'entry' && 'Entry Level (0-3 years)'}
                      {level === 'mid_career' && 'Mid-Career (4-10 years)'}
                      {level === 'expert' && 'Expert (10+ years)'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <Label className="font-semibold">Practice Setting</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['hospital', 'clinic', 'academic', 'community'].map(setting => (
                  <div key={setting} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSubSegments.hcp_practice_setting.includes(setting)}
                      onCheckedChange={() => toggleSubSegment('hcp_practice_setting', setting)}
                    />
                    <label className="text-sm capitalize cursor-pointer">{setting}</label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pharmacist Sub-Segmentation */}
        {primaryAudience === 'Pharmacist' && (
          <>
            <div className="space-y-3">
              <Label className="font-semibold">Pharmacist Setting</Label>
              <div className="grid grid-cols-2 gap-3">
                {['retail', 'hospital', 'specialty', 'long-term-care'].map(setting => (
                  <div key={setting} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSubSegments.pharmacist_setting.includes(setting)}
                      onCheckedChange={() => toggleSubSegment('pharmacist_setting', setting)}
                    />
                    <label className="text-sm capitalize cursor-pointer">
                      {setting.replace(/-/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Practice Focus</Label>
              <div className="grid grid-cols-2 gap-3">
                {['dispensing', 'clinical', 'oncology', 'ambulatory-care'].map(focus => (
                  <div key={focus} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSubSegments.pharmacist_focus.includes(focus)}
                      onCheckedChange={() => toggleSubSegment('pharmacist_focus', focus)}
                    />
                    <label className="text-sm capitalize cursor-pointer">
                      {focus.replace(/-/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Nurse Sub-Segmentation */}
        {primaryAudience.startsWith('Nurse') && (
          <>
            <div className="space-y-3">
              <Label className="font-semibold">Nursing Specialty</Label>
              <div className="grid grid-cols-2 gap-3">
                {['oncology', 'cardiology', 'critical-care', 'ambulatory', 'home-health'].map(specialty => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSubSegments.nurse_specialty.includes(specialty)}
                      onCheckedChange={() => toggleSubSegment('nurse_specialty', specialty)}
                    />
                    <label className="text-sm capitalize cursor-pointer">
                      {specialty.replace(/-/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Experience Level</Label>
              <div className="grid grid-cols-2 gap-3">
                {['new-grad', 'experienced', 'clinical-leader'].map(exp => (
                  <div key={exp} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSubSegments.nurse_experience.includes(exp)}
                      onCheckedChange={() => toggleSubSegment('nurse_experience', exp)}
                    />
                    <label className="text-sm capitalize cursor-pointer">
                      {exp.replace(/-/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Caregiver Sub-Segmentation */}
        {primaryAudience.startsWith('Caregiver') && (
          <>
            <div className="space-y-3">
              <Label className="font-semibold">Caregiving Experience</Label>
              <div className="grid grid-cols-2 gap-3">
                {['newly-caring', 'experienced', 'long-term'].map(exp => (
                  <div key={exp} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSubSegments.caregiver_experience.includes(exp)}
                      onCheckedChange={() => toggleSubSegment('caregiver_experience', exp)}
                    />
                    <label className="text-sm capitalize cursor-pointer">
                      {exp.replace(/-/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Caregiver Burden Level</Label>
              <div className="grid grid-cols-2 gap-3">
                {['low', 'moderate', 'high'].map(burden => (
                  <div key={burden} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSubSegments.caregiver_burden_level.includes(burden)}
                      onCheckedChange={() => toggleSubSegment('caregiver_burden_level', burden)}
                    />
                    <label className="text-sm capitalize cursor-pointer">{burden}</label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Patient Sub-Segmentation */}
        {primaryAudience === 'Patient' && (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <Label className="font-semibold">Disease Stage</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['newly_diagnosed', 'active_management', 'long_term'].map(stage => (
                  <div key={stage} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSubSegments.patient_disease_stage.includes(stage)}
                      onCheckedChange={() => toggleSubSegment('patient_disease_stage', stage)}
                    />
                    <label className="text-sm cursor-pointer">
                      {stage.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <Label className="font-semibold">Age Group</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['18-35', '36-55', '56-75', '75+'].map(age => (
                  <div key={age} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSubSegments.patient_age_group.includes(age)}
                      onCheckedChange={() => toggleSubSegment('patient_age_group', age)}
                    />
                    <label className="text-sm cursor-pointer">{age} years</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                <Label className="font-semibold">Health Literacy</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['low', 'medium', 'high'].map(literacy => (
                  <div key={literacy} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSubSegments.patient_health_literacy.includes(literacy)}
                      onCheckedChange={() => toggleSubSegment('patient_health_literacy', literacy)}
                    />
                    <label className="text-sm capitalize cursor-pointer">{literacy}</label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Content Optimization (A/B Testing) - Email only */}
        {showABTesting && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <Label className="font-semibold">Content Optimization (A/B Testing)</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {getOptimizationOptions(assetType).map(opt => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedOptimizations.includes(opt.value)}
                      onCheckedChange={() => toggleOptimization(opt.value)}
                    />
                    <label className="text-sm cursor-pointer">{opt.label}</label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Messaging Emphasis - Email and DSA only */}
        {showMessagingEmphasis && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <Label className="font-semibold">
                  {isDSAAsset ? 'Module Emphasis' : 'Messaging Emphasis'}
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(isDSAAsset 
                  ? ['clinical_evidence', 'efficacy_data', 'safety_profile', 'dosing_convenience']
                  : ['clinical_evidence', 'emotional_tone', 'urgency', 'benefit_framing']
                ).map(emphasis => (
                  <div key={emphasis} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedMessagingEmphasis.includes(emphasis)}
                      onCheckedChange={() => toggleMessagingEmphasis(emphasis)}
                    />
                    <label className="text-sm cursor-pointer">
                      {emphasis.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Selection Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Variations to Generate:</span>
            <Badge variant="default" className="text-base px-3 py-1">
              {selectedFactors.length}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function getOptimizationOptions(assetType) {
  const baseOptions = [
    { value: 'subject_line', label: 'Subject Line' },
    { value: 'opening_hook', label: 'Opening Hook' },
    { value: 'cta_wording', label: 'CTA Wording' },
    { value: 'content_length', label: 'Content Length' }
  ];

  if (assetType.includes('email')) {
    return baseOptions;
  } else if (assetType === 'web' || assetType.includes('landing')) {
    return [
      { value: 'headline_style', label: 'Headline Style' },
      { value: 'layout_priority', label: 'Layout Priority' },
      { value: 'cta_placement', label: 'CTA Placement' }
    ];
  } else if (assetType === 'dsa' || assetType.includes('sales')) {
    return [
      { value: 'fair_balance_placement', label: 'Fair Balance Placement' },
      { value: 'slide_flow', label: 'Slide Flow' }
    ];
  }

  return baseOptions;
}