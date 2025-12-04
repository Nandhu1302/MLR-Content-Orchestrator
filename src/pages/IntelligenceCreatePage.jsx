
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Sparkles, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import { useBrand } from '@/contexts/BrandContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ContentProjectService } from '@/services/contentProjectService';

export const IntelligenceCreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedBrand } = useBrand();
  const { toast } = useToast();
  const state = location.state;
  const context = state?.intelligenceContext;

  if (!context || !context.recommendedEvidence) {
    navigate('/intelligence');
    return null;
  }

  const { recommendedEvidence } = context;

  // Helper functions for display formatting
  const formatObjective = (objective) => {
    const labels = {
      'clinical-education': 'Clinical Education',
      'product-awareness': 'Product Awareness',
      'disease-awareness': 'Disease Awareness',
      'practice-support': 'Practice Support',
      'thought-leadership': 'Thought Leadership',
      'treatment-education': 'Treatment Education',
      'adherence-support': 'Adherence Support',
      'caregiver-education': 'Caregiver Education'
    };
    return labels[objective] ?? objective.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const formatAudience = (audience) => {
    const labels = {
      'Physician-Specialist': 'HIV Specialist',
      'Physician-PCP': 'Primary Care Physician',
      'Pharmacist': 'Pharmacist',
      'Nurse-RN': 'Registered Nurse',
      'Nurse-NP-PA': 'Nurse Practitioner',
      'Patient': 'Patient',
      'Caregiver-Family': 'Family Caregiver',
      'Caregiver-Professional': 'Professional Caregiver'
    };
    return labels[audience] ?? audience.replace(/-/g, ' ');
  };

  const getDefaultKeyMessage = () => {
    const aud = context.prefilledAudience ?? '';
    if (aud.includes('Patient') || aud.includes('Caregiver')) {
      return 'Discover how treatment can help you manage your condition effectively.';
    }
    return 'Evidence-based insights to support your clinical practice and improve patient outcomes.';
  };

  // Content brief state
  const [objective, setObjective] = useState(context.prefilledObjective ?? '');
  const [audience, setAudience] = useState(context.prefilledAudience ?? '');
  const [keyMessage, setKeyMessage] = useState(context.prefilledKeyMessage ?? getDefaultKeyMessage());
  const [cta, setCta] = useState(context.prefilledCTA ?? '');
  const assetType = context.prefilledAssetTypes?.[0] ?? 'website-landing-page';

  // Evidence selection state - pre-select top 3 by relevance
  const [selectedClaims, setSelectedClaims] = useState(
    recommendedEvidence.claims.slice(0, 3).map(c => c.id)
  );
  const [selectedVisuals, setSelectedVisuals] = useState(
    recommendedEvidence.visualAssets.slice(0, 2).map(v => v.id)
  );
  const [selectedModules, setSelectedModules] = useState(
    recommendedEvidence.contentModules.slice(0, 1).map(m => m.id)
  );

  const toggleClaim = (claimId) => {
    setSelectedClaims(prev =>
      prev.includes(claimId) ? prev.filter(id => id !== claimId) : [...prev, claimId]
    );
  };
  const toggleVisual = (visualId) => {
    setSelectedVisuals(prev =>
      prev.includes(visualId) ? prev.filter(id => id !== visualId) : [...prev, visualId]
    );
  };
  const toggleModule = (moduleId) => {
    setSelectedModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const [isGenerating, setIsGenerating] = useState(false);

  // Normalize audience values from UI-friendly to database-compatible format
  const normalizeAudienceForDatabase = (audience) => {
    const mapping = {
      'HIV Specialist': 'Physician-Specialist',
      'Primary Care Physician': 'Physician-PrimaryCare',
      'Primary Care': 'Physician-PrimaryCare',
      'Specialist': 'Physician-Specialist',
      'Patient': 'Patient',
      'Newly Diagnosed Patient': 'Patient',
      'Treatment-Experienced Patient': 'Patient',
      'Family Caregiver': 'Caregiver-Family',
      'Professional Caregiver': 'Caregiver-Professional',
      'Caregiver': 'Caregiver-Family',
      'Pharmacist': 'Pharmacist',
      'Nurse': 'Nurse-RN',
      'Nurse Practitioner': 'Nurse-NP-PA',
      'Physician Assistant': 'Nurse-NP-PA'
    };
    return mapping[audience] ?? audience;
  };

  const handleGenerateContent = async () => {
    if (!selectedBrand?.id) {
      toast({
        title: 'No Brand Selected',
        description: 'Please select a brand before generating content.',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('🚀 Starting content generation with:', {
        brandId: selectedBrand.id,
        assetType,
        audience,
        objective,
        selectedClaims: selectedClaims.length,
        selectedVisuals: selectedVisuals.length,
        selectedModules: selectedModules.length
      });

      // 1. Call edge function to generate content
      // Normalize audience value for database compatibility
      const normalizedAudience = normalizeAudienceForDatabase(audience);
      console.log('🔄 Audience normalization:', {
        original: audience,
        normalized: normalizedAudience
      });

      const { data, error } = await supabase.functions.invoke('generate-initial-content', {
        body: {
          brandId: selectedBrand.id,
          assetType,
          intakeContext: {
            intake_audience: normalizedAudience,
            intake_objective: objective,
            original_key_message: keyMessage,
            original_cta: cta,
            channel: context.channel
          },
          preselectedEvidence: {
            claimIds: selectedClaims,
            visualAssetIds: selectedVisuals,
            moduleIds: selectedModules
          }
        }
      });

      if (error || !data) {
        console.error('❌ Edge function error:', error);
        throw new Error(error?.message ?? 'Failed to generate content');
      }

      console.log('✅ Edge function response:', data);

      // 2. Create project and asset
      console.log('📁 Creating project and asset...');
      const { projectId, assetId } = await ContentProjectService.createProjectWithAsset({
        brandId: selectedBrand.id,
        projectName: context.title,
        objective,
        audience,
        assetType,
        generatedContent: data.content,
        evidenceUsed: {
          claimIds: selectedClaims,
          visualAssetIds: selectedVisuals,
          moduleIds: selectedModules
        },
        intelligenceAttribution: {
          channel: context.channel,
          source: context.title,
          dataPoints: context.recommended_actions?.length ?? 0
        }
      });

      console.log('✅ Created project:', projectId, 'asset:', assetId);

      toast({
        title: 'Content Generated',
        description: 'Your content has been created and is ready for editing.',
      });

      // 3. Navigate to content editor
      navigate(`/content-editor/${assetId}`);
    } catch (error) {
      console.error('❌ Content generation error:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate content',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel.toLowerCase()) {
      case 'website': return '🌐';
      case 'email': return '✉️';
      case 'social': return '📱';
      case 'rep-enabled': return '👤';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => navigate('/intelligence')} className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Intelligence Hub
            </Button>
            <h1 className="text-3xl font-bold">Intelligence-Driven Content Creator</h1>
            <p className="text-muted-foreground mt-1">
              Review and select evidence to generate content
            </p>
          </div>
        </div>

        {/* Intelligence Attribution Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{getChannelIcon(context.channel)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-lg">{context.title}</span>
                  <Badge variant="secondary">
                    {getChannelIcon(context.channel)} From {context.channel} Intelligence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Based on {context.recommended_actions?.length ?? 0} data-backed insights
                </p>
                {context.recommended_actions && context.recommended_actions.length > 0 && (
                  <ul className="text-sm space-y-1">
                    {context.recommended_actions.slice(0, 3).map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{action.action}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Content Brief */}
          <Card>
            <CardHeader>
              <CardTitle>Content Brief</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Objective</Label>
                <div className="p-3 bg-muted/30 rounded-md flex items-center gap-2">
                  <Badge variant="secondary">{formatObjective(objective)}</Badge>
                  {context._aiEnhanced && <Sparkles className="h-3 w-3 text-primary" />}
                </div>
              </div>
              <div>
                <Label>Target Audience</Label>
                <div className="p-3 bg-muted/30 rounded-md">
                  <Badge variant="outline">{formatAudience(audience)}</Badge>
                </div>
              </div>
              <div>
                <Label htmlFor="keyMessage">Key Message</Label>
                <Textarea
                  id="keyMessage"
                  value={keyMessage}
                  onChange={(e) => setKeyMessage(e.target.value)}
                  placeholder="Enter your key marketing message..."
                  rows={3}
                  className={context._aiEnhanced ? 'border-primary/50' : ''}
                />
                {context._aiEnhanced ? (
                  <p className="text-xs text-primary mt-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI-Enhanced based on {context.channel} performance data
                  </p>
                ) : keyMessage ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    Edit to customize your marketing message
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="cta">Call to Action</Label>
                <Input
                  id="cta"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="e.g., Learn More"
                />
              </div>
              <div>
                <Label>Asset Type</Label>
                <div className="p-3 bg-muted/30 rounded-md">
                  <span className="font-medium capitalize">
                    {assetType.replace(/-/g, ' ')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Recommended Evidence */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Evidence</CardTitle>
              <p className="text-sm text-muted-foreground">
                Pre-selected based on relevance. Check or uncheck items to customize your selection.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 max-h-[600px] overflow-y-auto">
              {/* Clinical Claims */}
              {recommendedEvidence.claims.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">📋 Clinical Claims ({selectedClaims.length}/{recommendedEvidence.claims.length})</h3>
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClaims(recommendedEvidence.claims.map(c => c.id))}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClaims([])}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {recommendedEvidence.claims.slice(0, 5).map(claim => (
                      <div
                        key={claim.id}
                        className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => toggleClaim(claim.id)}
                      >
                        <Checkbox
                          checked={selectedClaims.includes(claim.id)}
                          onCheckedChange={() => toggleClaim(claim.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{claim.claim_id_display}</span>
                            <Badge variant="outline" className="text-xs">
                              {claim.claim_type}
                            </Badge>
                            {claim.review_status === 'approved' ? (
                              <Badge className="bg-green-600 hover:bg-green-700">
                                <Shield className="h-3 w-3 mr-1" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                Not Approved
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {Math.round(claim.relevanceScore)}% match
                            </span>
                          </div>
                          <p className="text-sm line-clamp-2">{claim.claim_text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Assets */}
              {recommendedEvidence.visualAssets.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">📊 Visual Assets ({selectedVisuals.length}/{recommendedEvidence.visualAssets.length})</h3>
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedVisuals(recommendedEvidence.visualAssets.map(v => v.id))}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedVisuals([])}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {recommendedEvidence.visualAssets.slice(0, 5).map(visual => (
                      <div
                        key={visual.id}
                        className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => toggleVisual(visual.id)}
                      >
                        <Checkbox
                          checked={selectedVisuals.includes(visual.id)}
                          onCheckedChange={() => toggleVisual(visual.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm line-clamp-1">{visual.title}</span>
                            {visual.mlrApproved ? (
                              <Badge className="bg-green-600 hover:bg-green-700">
                                <Shield className="h-3 w-3 mr-1" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                Not Approved
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {visual.visual_type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(visual.relevanceScore)}% match
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Modules */}
              {recommendedEvidence.contentModules.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">📦 Content Modules ({selectedModules.length}/{recommendedEvidence.contentModules.length})</h3>
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedModules(recommendedEvidence.contentModules.map(m => m.id))}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedModules([])}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {recommendedEvidence.contentModules.map(module => (
                      <div
                        key={module.id}
                        className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => toggleModule(module.id)}
                      >
                        <Checkbox
                          checked={selectedModules.includes(module.id)}
                          onCheckedChange={() => toggleModule(module.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{module.module_type}</span>
                            {module.mlr_approved ? (
                              <Badge className="bg-green-600 hover:bg-green-700">
                                <Shield className="h-3 w-3 mr-1" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                Not Approved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm line-clamp-2">{module.module_text}</p>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(module.relevanceScore)}% match
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selection Summary & Generate Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Selection Summary:</span>{' '}
                {selectedClaims.length} claims · {selectedVisuals.length} visual assets · {selectedModules.length} modules selected
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate('/intelligence')}>
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateContent}
                  disabled={
                    isGenerating ||
                    (selectedClaims.length === 0 && selectedVisuals.length === 0 && selectedModules.length === 0)
                  }
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntelligenceCreatePage;
