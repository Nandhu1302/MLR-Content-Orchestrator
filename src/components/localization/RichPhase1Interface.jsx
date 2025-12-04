
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Target,
  Users,
  BarChart3,
  Globe,
  Shield,
  Tag,
  Save,
  AlertCircle,
  CheckCircle2,
  Search,
  Brain
} from 'lucide-react';

export function RichPhase1Interface({
  selectedAsset,
  assetMetadata,
  onEnhancementUpdate,
  onComplete
}) {
  const [activeSection, setActiveSection] = useState('strategic');
  const [formData, setFormData] = useState({
    strategic: {
      campaignObjectives: '',
      performanceGoals: '',
      successMetrics: '',
      businessContext: ''
    },
    audience: {
      primaryAudience: '',
      secondaryAudiences: '',
      audienceSegments: '',
      behaviorInsights: ''
    }
  });

  // Auto-populate form fields from global asset data
  useEffect(() => {
    if (selectedAsset && assetMetadata) {
      const therapeuticArea =
        assetMetadata?.globalContext?.therapeuticArea || selectedAsset.therapeuticArea || 'General';
      const brandName =
        assetMetadata?.brandContext?.brandName || selectedAsset.brandName || 'Brand';
      const assetType =
        assetMetadata?.globalContext?.assetType || selectedAsset.assetType || 'Asset';
      const primaryObjective =
        selectedAsset.primaryObjective || assetMetadata?.globalContext?.primaryObjective;
      const keyMessage =
        selectedAsset.keyMessage || assetMetadata?.brandContext?.messagingFramework?.keyMessage;
      const primaryAudience =
        selectedAsset.primaryAudience || assetMetadata?.brandContext?.messagingFramework?.primaryAudience;

      const enhancedFormData = {
        strategic: {
          campaignObjectives:
            primaryObjective && keyMessage
              ? `Building on the core objective: "${primaryObjective}" and key message: "${keyMessage}", this ${assetType.toLowerCase()} campaign will drive strategic engagement in ${therapeuticArea} by delivering targeted messaging that resonates with healthcare professionals and supports evidence-based decision making.`
              : `This ${assetType.toLowerCase()} campaign will drive strategic engagement in ${therapeuticArea} through targeted messaging and evidence-based communications.`,
          performanceGoals: `For this ${therapeuticArea} ${assetType.toLowerCase()}, target performance goals include:
• Achieve 15-20% engagement rate improvement over baseline
• Generate 25% increase in ${therapeuticArea}-focused HCP interactions
• Drive 30% improvement in brand recall within target therapeutic area
• Establish thought leadership positioning in ${therapeuticArea} space`,
          successMetrics:
            assetType === 'Email'
              ? `Key Performance Indicators:
• Open Rate: >25% (industry benchmark: 20%)
• Click-through Rate: >8% (industry benchmark: 5%)
• Engagement Rate: >15%
• Brand Awareness Lift: >20%
• Lead Generation: Target 500+ qualified leads
• Conversion to Action: >12%`
              : `Key Performance Indicators:
• Engagement Rate: >20%
• Content Consumption: >60% completion rate
• Brand Recall: >35% improvement
• Professional Credibility Score: >8/10
• Share Rate: >5% (viral coefficient)
• Lead Quality Score: >75%`,
          businessContext: `${brandName} strategic context in ${therapeuticArea}:
• Competitive positioning as innovative leader in therapeutic solutions
• Market expansion opportunity in underserved ${therapeuticArea} segments
• Regulatory compliance aligned with current guidelines
• Integration with broader ${brandName} portfolio messaging
• Support for HCP education and patient outcomes improvement`
        },
        audience: {
          primaryAudience: primaryAudience
            ? `Enhanced ${primaryAudience} Profile:
• Therapeutic Focus: ${therapeuticArea} specialists and general practitioners
• Professional Level: Mid to senior-level healthcare professionals
• Practice Setting: Hospital systems, specialty clinics, academic medical centers
• Experience: 5-20+ years in ${therapeuticArea} patient management
• Decision Authority: Treatment protocol influence and formulary input
• Technology Adoption: Moderate to high digital engagement`
            : `Primary healthcare professional audience in ${therapeuticArea}:
• Treatment specialists and consulting physicians
• Clinical decision-makers with prescribing authority
• Medical affairs and key opinion leaders
• Healthcare system administrators`,
          secondaryAudiences: `Secondary Audience Segments:
• Residents and Fellows training in ${therapeuticArea}
• Pharmacists with ${therapeuticArea} specialization focus
• Nursing professionals in ${therapeuticArea} care settings
• Healthcare administrators and decision-makers
• Patient advocacy groups and caregivers
• Medical students with ${therapeuticArea} interest`,
          audienceSegments: `Professional Segmentation:
• Academic Medical Centers: Research-focused physicians
• Community Practice: High-volume patient care providers
• Specialty Clinics: ${therapeuticArea}-focused treatment centers
• Health Systems: Integrated care team members
• Digital-First Adopters: Technology-forward practitioners
• Traditional Practitioners: Relationship-based engagement preference`,
          behaviorInsights: `Behavioral Intelligence for ${therapeuticArea} Professionals:
• Content Consumption: Prefer clinical evidence and case studies
• Channel Preferences: Medical journals, conferences, peer networks
• Decision Factors: Patient outcomes, safety profiles, efficacy data
• Engagement Timing: Peak activity during work hours and CME periods
• Information Seeking: Evidence-based resources and peer validation
• Communication Style: Professional, data-driven, outcome-focused`
        }
      };

      setFormData(enhancedFormData);
      onEnhancementUpdate('enhancedIntelligence', enhancedFormData);
    }
  }, [selectedAsset, assetMetadata]); // Removed onEnhancementUpdate from dependencies

  const handleFieldUpdate = (section, field, value) => {
    const newFormData = {
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    };
    setFormData(newFormData);
    onEnhancementUpdate('enhancedIntelligence', newFormData);
  };

  const getSectionCompletionStatus = (section) => {
    const sectionData = formData[section];
    const completedFields = Object.values(sectionData).filter((value) => value.trim().length > 0).length;
    const totalFields = Object.keys(sectionData).length;
    return { completed: completedFields, total: totalFields, percentage: Math.round((completedFields / totalFields) * 100) };
  };

  const getOverallCompletion = () => {
    const sections = Object.keys(formData);
    const totalCompleted = sections.reduce((sum, section) => sum + getSectionCompletionStatus(section).completed, 0);
    const totalFields = sections.reduce((sum, section) => sum + getSectionCompletionStatus(section).total, 0);
    return Math.round((totalCompleted / totalFields) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Asset Context Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {selectedAsset.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {assetMetadata?.globalContext?.assetType || 'Asset'}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                {assetMetadata?.globalContext?.therapeuticArea || 'General'}
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Reusability: {selectedAsset.reusabilityScore || 75}%
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{getOverallCompletion()}%</div>
            <div className="text-xs text-muted-foreground">Intelligence Complete</div>
          </div>
        </div>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="strategic" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Strategic Context
            {getSectionCompletionStatus('strategic').percentage === 100 && (
              <CheckCircle2 className="h-3 w-3 text-success" />
            )}
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Audience Intelligence
            {getSectionCompletionStatus('audience').percentage === 100 && (
              <CheckCircle2 className="h-3 w-3 text-success" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strategic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Strategic Context & Campaign Objectives
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Enhance and refine strategic objectives building on global asset context for {assetMetadata?.globalContext?.therapeuticArea || 'this asset'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignObjectives">Campaign Objectives Enhancement</Label>
                  <Textarea
                    id="campaignObjectives"
                    placeholder={`Enhance and refine the auto-populated campaign objectives based on ${assetMetadata?.brandContext?.messagingFramework?.keyMessage || 'global asset data'}...`}
                    value={formData.strategic.campaignObjectives}
                    onChange={(e) => handleFieldUpdate('strategic', 'campaignObjectives', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="performanceGoals">Performance Goals Enhancement</Label>
                  <Textarea
                    id="performanceGoals"
                    placeholder={`Refine the suggested performance goals for ${assetMetadata?.globalContext?.therapeuticArea || 'this campaign'} based on your specific objectives...`}
                    value={formData.strategic.performanceGoals}
                    onChange={(e) => handleFieldUpdate('strategic', 'performanceGoals', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="successMetrics">Success Metrics Enhancement</Label>
                  <Textarea
                    id="successMetrics"
                    placeholder="Review and enhance the suggested KPIs and success measurements based on your specific campaign goals..."
                    value={formData.strategic.successMetrics}
                    onChange={(e) => handleFieldUpdate('strategic', 'successMetrics', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessContext">Business Context Enhancement</Label>
                  <Textarea
                    id="businessContext"
                    placeholder="Enhance the business context with additional strategic considerations specific to your localization objectives..."
                    value={formData.strategic.businessContext}
                    onChange={(e) => handleFieldUpdate('strategic', 'businessContext', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Audience Intelligence & Segmentation
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Refine and enhance audience intelligence building on {assetMetadata?.brandContext?.messagingFramework?.primaryAudience || 'global asset audience data'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryAudience">Primary Audience Enhancement</Label>
                  <Textarea
                    id="primaryAudience"
                    placeholder={`Enhance the auto-populated primary audience profile with additional demographics and psychographics relevant to your localization goals...`}
                    value={formData.audience.primaryAudience}
                    onChange={(e) => handleFieldUpdate('audience', 'primaryAudience', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryAudiences">Secondary Audiences</Label>
                  <Textarea
                    id="secondaryAudiences"
                    placeholder="Review and enhance the suggested secondary audience segments with market-specific characteristics..."
                    value={formData.audience.secondaryAudiences}
                    onChange={(e) => handleFieldUpdate('audience', 'secondaryAudiences', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audienceSegments">Audience Segments</Label>
                  <Textarea
                    id="audienceSegments"
                    placeholder="Refine the suggested professional segments with additional detail for your specific markets..."
                    value={formData.audience.audienceSegments}
                    onChange={(e) => handleFieldUpdate('audience', 'audienceSegments', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="behaviorInsights">Behavioral Insights</Label>
                  <Textarea
                    id="behaviorInsights"
                    placeholder="Enhance the suggested behavioral insights with market-specific consumption patterns and preferences..."
                    value={formData.audience.behaviorInsights}
                    onChange={(e) => handleFieldUpdate('audience', 'behaviorInsights', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Completion Actions */}
      <div className="flex items-center justify-between bg-muted/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          {getOverallCompletion() === 100 ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <AlertCircle className="h-5 w-5 text-warning" />
          )}
          <div>
            <div className="font-medium">
              Intelligence Capture: {getOverallCompletion()}% Complete
            </div>
            <div className="text-sm text-muted-foreground">
              {getOverallCompletion() === 100
                ? 'All intelligence sections completed - ready to proceed'
                : `${8 - Object.values(formData).reduce(
                    (sum, section) => sum + Object.values(section).filter((v) => v.trim().length > 0).length,
                    0
                  )} fields remaining`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save Progress
          </Button>
          <Button
            onClick={onComplete}
            disabled={getOverallCompletion() < 50}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            Complete Phase 1
          </Button>
        </div>
      </div>
    </div>
  );
}
