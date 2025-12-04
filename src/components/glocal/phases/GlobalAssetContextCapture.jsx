import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Upload, FileText, CheckCircle, Users, Stethoscope, Edit2, Plus, X, Pill, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { BasePhaseLayout } from '../layout/BasePhaseLayout';

export const GlobalAssetContextCapture = ({
  onPhaseComplete,
  onNext,
  project,
  isPhaseCompleted = false,
  allPhaseData
}) => {
  const { toast } = useToast();
  const [sourceContent, setSourceContent] = useState('');
  const [assetType, setAssetType] = useState('email');
  const [therapeuticContext, setTherapeuticContext] = useState('');
  const [indication, setIndication] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [additionalAudiences, setAdditionalAudiences] = useState([]);
  const [isPrePopulated, setIsPrePopulated] = useState(false);
  const [isEditingContext, setIsEditingContext] = useState(false);
  
  const isPhaseCompletedState = allPhaseData?.phase1?.completed === true;

  // Pre-populate fields from imported asset data
  useEffect(() => {
    if (project) {
      console.log('Phase 1 - Pre-populating from project:', project);
      
      // Extract strategic context from project metadata
      const strategicContext = project.project_metadata?.strategic_context;
      const sourceContentData = project.source_content;
      
      // PRIORITY 1: Check for master template structured content (richest format)
      if (sourceContentData?.structured_content && sourceContentData.structured_content.length > 0) {
        // Extract all sections from primary_content of first asset
        const primaryAsset = sourceContentData.structured_content[0];
        const content = primaryAsset.content;
        
        let contentPreview = `Asset: ${primaryAsset.name}\n\n`;
        
        // Build content from structured sections
        if (content.subject_line) contentPreview += `Subject: ${content.subject_line}\n\n`;
        if (content.greeting) contentPreview += `${content.greeting}\n\n`;
        if (content.executive_summary) contentPreview += `${content.executive_summary}\n\n`;
        if (content.mechanism_of_action?.headline) contentPreview += `${content.mechanism_of_action.headline}\n${content.mechanism_of_action.content || ''}\n\n`;
        if (content.clinical_evidence?.headline) contentPreview += `${content.clinical_evidence.headline}\n${content.clinical_evidence.content || ''}\n\n`;
        if (content.safety_profile?.headline) contentPreview += `${content.safety_profile.headline}\n${content.safety_profile.content || ''}\n\n`;
        if (content.prescribing_considerations?.headline) contentPreview += `${content.prescribing_considerations.headline}\n${content.prescribing_considerations.content || ''}\n\n`;
        if (content.call_to_action?.primary) contentPreview += `Call to Action: ${content.call_to_action.primary}\n\n`;
        if (content.regulatory_footer?.indication) contentPreview += `Indication: ${content.regulatory_footer.indication}\n`;
        if (content.regulatory_footer?.important_safety) contentPreview += `${content.regulatory_footer.important_safety}\n`;
        
        setSourceContent(contentPreview);
      } 
      // PRIORITY 2: Check for simple email format (content.subject + content.body)
      else if (sourceContentData?.content) {
        let contentPreview = `Asset: ${sourceContentData.asset_name || 'Email'}\n\n`;
        
        if (sourceContentData.content.subject) {
          contentPreview += `Subject: ${sourceContentData.content.subject}\n\n`;
        }
        
        if (sourceContentData.content.body) {
          contentPreview += `${sourceContentData.content.body}\n\n`;
        }
        
        if (sourceContentData.content.keyMessage) {
          contentPreview += `Key Message: ${sourceContentData.content.keyMessage}\n\n`;
        }
        
        if (sourceContentData.content.callToAction) {
          contentPreview += `Call to Action: ${sourceContentData.content.callToAction}\n`;
        }
        
        setSourceContent(contentPreview);
      } 
      // PRIORITY 3: Check for project description
      else if (strategicContext?.projectDescription) {
        setSourceContent(strategicContext.projectDescription);
      } 
      // PRIORITY 4: Fallback to asset name
      else if (sourceContentData?.asset_name) {
        setSourceContent(`Source Asset: ${sourceContentData.asset_name}\n\nThis content will be adapted for the selected target markets.`);
      }
      
      // Pre-populate asset type - map content_project to email
      if (sourceContentData?.asset_type) {
        const assetTypeMap = {
          'content_project': 'email',
          'email': 'email',
          'brochure': 'brochure',
          'presentation': 'presentation',
          'web_page': 'web_page'
        };
        setAssetType(assetTypeMap[sourceContentData.asset_type] || 'email');
      }
      
      // Pre-populate therapeutic context
      if (project.therapeutic_area) {
        setTherapeuticContext(project.therapeutic_area);
      } else if (strategicContext?.intakeContext?.therapeuticArea) {
        setTherapeuticContext(strategicContext.intakeContext.therapeuticArea);
      }
      
      // Pre-populate indication
      if (strategicContext?.assetContext?.indication) {
        setIndication(strategicContext.assetContext.indication);
      } else if (strategicContext?.indication) {
        setIndication(strategicContext.indication);
      }
      
      // Pre-populate target audience
      if (sourceContentData?.metadata?.target_audience?.primary) {
        setTargetAudience(sourceContentData.metadata.target_audience.primary);
      } else if (strategicContext?.assetContext?.targetAudience) {
        setTargetAudience(strategicContext.assetContext.targetAudience);
      } else if (strategicContext?.intakeContext?.primaryAudience) {
        setTargetAudience(strategicContext.intakeContext.primaryAudience);
      }
      
      setIsPrePopulated(true);
    }
  }, [project]);

  const handleCompletePhase = () => {
    if (!sourceContent.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please provide source content to adapt',
        variant: 'destructive'
      });
      return;
    }

    const phaseData = {
      sourceContent,
      assetType,
      therapeuticContext,
      indication,
      targetAudience,
      additionalAudiences,
      capturedAt: new Date().toISOString(),
      completed: true
    };

    onPhaseComplete(phaseData);
    toast({
      title: 'Phase Completed',
      description: 'Phase 1 marked as complete'
    });
  };

  const handleReopenPhase = () => {
    const phaseData = {
      sourceContent,
      assetType,
      therapeuticContext,
      indication,
      targetAudience,
      additionalAudiences,
      completed: false
    };

    onPhaseComplete(phaseData);
    toast({
      title: 'Phase Reopened',
      description: 'You can now edit the content again'
    });
  };

  const availableAdditionalAudiences = [
    'Secondary care physicians',
    'Primary care physicians',
    'Nurses/Healthcare staff',
    'Patients/Caregivers',
    'Specialists',
    'Pharmacists',
    'Healthcare administrators',
    'Payers/Insurance providers'
  ];

  const toggleAdditionalAudience = (audience) => {
    setAdditionalAudiences(prev =>
      prev.includes(audience)
        ? prev.filter(a => a !== audience)
        : [...prev, audience]
    );
  };

  return (
    <BasePhaseLayout
      phaseNumber={1}
      phaseTitle="Global Asset Context Capture"
      phaseDescription="Configure source content and context for global adaptation"
    >
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-4">
            {/* Source Asset Summary - Compact Read-Only View */}
            <Card className={isPrePopulated ? "border-primary/50 bg-primary/5" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isPrePopulated && <CheckCircle className="h-5 w-5 text-primary" />}
                    <CardTitle className="text-base">Source Asset Summary</CardTitle>
                  </div>
                  {isPrePopulated && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingContext(!isEditingContext)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      {isEditingContext ? 'Lock' : 'Edit'}
                    </Button>
                  )}
                </div>
                {isPrePopulated && (
                  <CardDescription className="text-xs">
                    Imported from "{project?.project_name}"
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {/* Asset Type */}
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Asset Type</Label>
                      {!isEditingContext ? (
                        <Badge variant="secondary" className="mt-1">
                          {assetType === 'email' && 'Marketing Email'}
                          {assetType === 'webpage' && 'Web Page'}
                          {assetType === 'brochure' && 'Brochure'}
                          {assetType === 'presentation' && 'Presentation'}
                          {assetType === 'social' && 'Social Media'}
                        </Badge>
                      ) : (
                        <Select value={assetType} onValueChange={setAssetType}>
                          <SelectTrigger className="h-8 mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Marketing Email</SelectItem>
                            <SelectItem value="webpage">Web Page</SelectItem>
                            <SelectItem value="brochure">Brochure</SelectItem>
                            <SelectItem value="presentation">Presentation</SelectItem>
                            <SelectItem value="social">Social Media</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  {/* Therapy Area */}
                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Therapy Area</Label>
                      {!isEditingContext ? (
                        <Badge variant="secondary" className="mt-1">
                          {therapeuticContext || 'Not specified'}
                        </Badge>
                      ) : (
                        <Input
                          className="h-8 mt-1"
                          placeholder="e.g., Cardiovascular"
                          value={therapeuticContext}
                          onChange={(e) => setTherapeuticContext(e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Indication */}
                  <div className="flex items-center gap-3">
                    <Pill className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Indication</Label>
                      {!isEditingContext ? (
                        <Badge variant="secondary" className="mt-1">
                          {indication || 'Not specified'}
                        </Badge>
                      ) : (
                        <Input
                          className="h-8 mt-1"
                          placeholder="e.g., Hypertension"
                          value={indication}
                          onChange={(e) => setIndication(e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Primary Target Audience */}
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Primary Target Audience</Label>
                      {!isEditingContext ? (
                        <Badge variant="secondary" className="mt-1">
                          {targetAudience || 'Not specified'}
                        </Badge>
                      ) : (
                        <Input
                          className="h-8 mt-1"
                          placeholder="e.g., Healthcare professionals"
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Audiences */}
                <div className="pt-2 border-t">
                  <Label className="text-xs text-muted-foreground mb-2 block">Additional Audiences</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {additionalAudiences.map(audience => (
                      <Badge key={audience} variant="outline" className="gap-1">
                        {audience}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => toggleAdditionalAudience(audience)}
                        />
                      </Badge>
                    ))}
                    {additionalAudiences.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">No additional audiences selected</span>
                    )}
                  </div>
                  <Select onValueChange={toggleAdditionalAudience}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="+ Add audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAdditionalAudiences
                        .filter(a => !additionalAudiences.includes(a))
                        .map(audience => (
                          <SelectItem key={audience} value={audience}>
                            {audience}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Content Upload and Editor */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Source Content</CardTitle>
                <CardDescription className="text-xs">
                  {isPrePopulated ? 'Imported content can be edited or replaced' : 'Paste or upload content for adaptation'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="editor" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="editor">Content Editor</TabsTrigger>
                    <TabsTrigger value="preview">Segmentation Preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="editor" className="space-y-3 mt-3">
                    <Textarea
                      placeholder="Paste your source content here..."
                      className="min-h-[300px] font-mono text-sm"
                      value={sourceContent}
                      onChange={(e) => setSourceContent(e.target.value)}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{sourceContent.length} characters</span>
                      <span>{sourceContent.split('\n\n').filter(s => s.trim()).length} segments detected</span>
                    </div>

                    {/* File Upload */}
                    <div className="flex items-center gap-3 p-3 border border-dashed rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Upload file instead</p>
                        <p className="text-xs text-muted-foreground">
                          Support for .docx, .pdf, .html coming soon
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-3">
                    <ScrollArea className="h-[400px]">
                      {sourceContent && project?.source_content?.structured_content ? (
                        <div className="space-y-2 pr-4">
                          {(() => {
                            const structuredAsset = project.source_content.structured_content[0];
                            const content = structuredAsset?.content || {};
                            const segments = [];

                            if (content.subject_line) segments.push({ label: 'Subject Line', text: content.subject_line });
                            if (content.greeting) segments.push({ label: 'Greeting', text: content.greeting });
                            if (content.executive_summary) segments.push({ label: 'Executive Summary', text: content.executive_summary });
                            if (content.mechanism_of_action) segments.push({ label: 'Mechanism of Action', text: `${content.mechanism_of_action.headline || ''}\n${content.mechanism_of_action.content || ''}` });
                            if (content.clinical_evidence) segments.push({ label: 'Clinical Evidence', text: `${content.clinical_evidence.headline || ''}\n${content.clinical_evidence.content || ''}` });
                            if (content.patient_case) segments.push({ label: 'Patient Case', text: `${content.patient_case.headline || ''}\n${content.patient_case.content || ''}` });
                            if (content.safety_profile) segments.push({ label: 'Safety Profile', text: `${content.safety_profile.headline || ''}\n${content.safety_profile.content || ''}` });
                            if (content.prescribing_considerations) segments.push({ label: 'Prescribing Considerations', text: `${content.prescribing_considerations.headline || ''}\n${content.prescribing_considerations.content || ''}` });
                            if (content.call_to_action) segments.push({ label: 'Call to Action', text: content.call_to_action.primary || '' });
                            if (content.regulatory_footer) segments.push({ label: 'Regulatory Footer', text: `${content.regulatory_footer.indication || ''}\n${content.regulatory_footer.important_safety || ''}` });

                            return segments.map((segment, idx) => (
                              <div key={idx} className="p-3 bg-accent/50 rounded-lg border border-border">
                                <div className="flex items-start gap-3">
                                  <FileText className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-primary mb-1">{segment.label}</p>
                                    <p className="text-sm whitespace-pre-wrap break-words">{segment.text}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Segment {idx + 1} • {segment.text.length} characters
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      ) : sourceContent ? (
                        <div className="space-y-2 pr-4">
                          {sourceContent.split('\n\n').filter(line => line.trim()).map((segment, idx) => (
                            <div key={idx} className="p-3 bg-accent/50 rounded-lg border border-border">
                              <div className="flex items-start gap-3">
                                <FileText className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm whitespace-pre-wrap break-words">{segment}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Segment {idx + 1} • {segment.length} characters
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[400px]">
                          <div className="text-center">
                            <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-muted-foreground">Enter content to see segmentation preview</p>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Complete Phase Button - Sticky at bottom */}
            <div className="sticky bottom-0 pt-2 pb-4 bg-background">
              {isPhaseCompletedState ? (
                <Button onClick={handleReopenPhase} size="lg" className="w-full" variant="outline">
                  <Unlock className="mr-2 h-4 w-4" />
                  Reopen Phase 1
                </Button>
              ) : (
                <Button onClick={handleCompletePhase} size="lg" className="w-full">
                  Complete Phase 1 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </BasePhaseLayout>
  );
};