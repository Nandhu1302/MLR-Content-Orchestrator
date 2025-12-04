import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown, 
  ChevronRight, 
  AlertCircle,
  Mail,
  Globe,
  FileText,
  MessageSquare,
  Eye
} from 'lucide-react';
import { EnhancedContentEditor } from './EnhancedContentEditor';
import { UnifiedAIAssistant } from './UnifiedAIAssistant';
import { PreviewModal } from './PreviewModal';
import { AssetTypeLayoutManager } from '@/services/assetTypeLayoutManager';

export const AssetTypeContentEditor = ({
  assetType,
  content,
  onContentChange,
  onGenerateContent,
  onUseOriginalIntake,
  isGenerating = false,
  themeData,
  intakeContext,
  targetAudience = 'HCP',
  validationResults,
  onResetToTheme,
  isResetting = false,
  realTimeAnalysis,
  isDirty,
  onSaveVersion,
  onRefreshAnalysis,
  saving,
  onRefreshThemeData,
  assetMetadata,
  themePerformanceData,
  isRefreshingPatterns = false,
  onGetSuggestions
}) => {
  const [openSections, setOpenSections] = useState({
    heroes: true,
    content: true,
    footer: false,
    metadata: false
  });
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const layout = AssetTypeLayoutManager.getLayout(assetType);
  
  if (!layout) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>Unsupported asset type: {assetType}</p>
      </div>
    );
  }

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getProgressPercentage = () => {
    // Helper to check if a field has content with alternate field names
    const hasFieldContent = (fieldId) => {
      // Define field name variations (camelCase, snake_case, etc.)
      const fieldVariations = {
        'subject': ['subject', 'subject_line', 'subjectLine'],
        'headline': ['headline', 'title', 'page_title', 'primaryMessage', 'primary_message'],
        'body': ['body', 'content', 'primary_content'],
        'keyMessage': ['keyMessage', 'key_message', 'primaryMessage', 'primary_message'],
        'cta': ['cta', 'callToAction', 'call_to_action'],
        'disclaimer': ['disclaimer', 'legal_text', 'legalText'],
        'preheader': ['preheader', 'pre_header', 'preview_text'],
        'unsubscribe': ['unsubscribe', 'unsubscribe_text', 'unsubscribe_link']
      };

      // Get variations for this field, or just use the field ID if no variations defined
      const variations = fieldVariations[fieldId] || [fieldId];
      
      // Check if any variation has content
      return variations.some(variation => {
        const value = content[variation];
        return value && value.toString().trim().length > 0;
      });
    };

    const requiredFields = layout.sections.flatMap(s => s.fields).filter(f => f.required);
    const filledRequired = requiredFields.filter(f => hasFieldContent(f.id)).length;

    const optionalFields = layout.sections.flatMap(s => s.fields).filter(f => !f.required);
    const filledOptional = optionalFields.filter(f => hasFieldContent(f.id)).length;

    const requiredWeight = 0.7;
    const optionalWeight = 0.3;

    const requiredScore = requiredFields.length > 0 ? (filledRequired / requiredFields.length) * requiredWeight : requiredWeight;
    const optionalScore = optionalFields.length > 0 ? (filledOptional / optionalFields.length) * optionalWeight : optionalWeight;

    return Math.round((requiredScore + optionalScore) * 100);
  };

  const getPreviewContent = (content, assetType) => {
    const getIcon = (type) => {
      switch (type) {
        case 'mass-email': return <Mail className="h-4 w-4" />;
        case 'website-landing-page': return <Globe className="h-4 w-4" />;
        case 'social-media-post': return <MessageSquare className="h-4 w-4" />;
        case 'digital-sales-aid': return <FileText className="h-4 w-4" />;
        default: return <FileText className="h-4 w-4" />;
      }
    };

    switch (assetType) {
      case 'mass-email':
        return (
          <div className="space-y-2 p-3 bg-card border rounded text-xs">
            <div className="flex items-center gap-2 font-medium">
              {getIcon(assetType)}
              Email Preview
            </div>
            <div><strong>Subject:</strong> {content.subject || 'No subject'}</div>
            <div><strong>Headline:</strong> {content.headline || 'No headline'}</div>
            <div><strong>Body:</strong> {content.body ? content.body.substring(0, 100) + '...' : 'No body content'}</div>
            <div><strong>CTA:</strong> {content.cta || 'No CTA'}</div>
          </div>
        );

      case 'website-landing-page':
        return (
          <div className="space-y-2 p-3 bg-card border rounded text-xs">
            <div className="flex items-center gap-2 font-medium">
              {getIcon(assetType)}
              Web Page Preview
            </div>
            <div><strong>Headline:</strong> {content.headline || 'No headline'}</div>
            <div><strong>Content:</strong> {content.body ? content.body.substring(0, 100) + '...' : 'No content'}</div>
            <div><strong>CTA:</strong> {content.cta || 'No CTA'}</div>
          </div>
        );

      case 'social-media-post':
        return (
          <div className="space-y-2 p-3 bg-card border rounded text-xs">
            <div className="flex items-center gap-2 font-medium">
              {getIcon(assetType)}
              Social Post Preview
            </div>
            <div><strong>Post:</strong> {content.body ? content.body.substring(0, 200) + '...' : 'No post content'}</div>
            <div><strong>CTA:</strong> {content.cta || 'No CTA'}</div>
          </div>
        );

      case 'digital-sales-aid':
        return (
          <div className="space-y-2 p-3 bg-card border rounded text-xs">
            <div className="flex items-center gap-2 font-medium">
              {getIcon(assetType)}
              Sales Aid Preview
            </div>
            <div><strong>Title:</strong> {content.headline || 'No title'}</div>
            <div><strong>Key Message:</strong> {content.keyMessage || 'No key message'}</div>
            <div><strong>Content:</strong> {content.body ? content.body.substring(0, 100) + '...' : 'No content'}</div>
          </div>
        );

      default:
        return (
          <div className="space-y-2 p-3 bg-card border rounded text-xs">
            <div className="flex items-center gap-2 font-medium">
              {getIcon(assetType)}
              Content Preview
            </div>
            <div><strong>Content:</strong> {content.body ? content.body.substring(0, 150) + '...' : 'No content available'}</div>
          </div>
        );
    }
  };

  const renderField = (field) => {
    const fieldValue = content[field.id];
    const fieldValueStr = typeof fieldValue === 'number' ? String(fieldValue) : (fieldValue || '');
    const hasContent = fieldValue && fieldValue.toString().trim().length > 0;

    return (
      <div key={field.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              {field.label || field.id}
              {field.required && <span className="text-red-500">*</span>}
              {hasContent && <Badge variant="secondary" className="text-xs">✓</Badge>}
            </label>
            {field.description && (
              <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
            )}
          </div>
        </div>

        <EnhancedContentEditor
          field={field.id}
          label={field.label || field.name}
          value={fieldValueStr}
          onChange={(value) => onContentChange(field.id, value)}
          placeholder={field.placeholder || `Enter ${field.label || field.id}...`}
          rows={field.rows || 3}
          context={{}}
        />

        {/* Character count for specific fields */}
        {(field.id === 'subject' || field.id === 'headline') && typeof fieldValueStr === 'string' && (
          <div className="text-xs text-muted-foreground text-right">
            {fieldValueStr.length}/150 characters
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4 max-w-full">
      {/* Main Content Area - 75% width */}
      <div className="col-span-9 space-y-4">
        {/* Progress Bar */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Content Completion</CardTitle>
              <Badge variant="outline">{getProgressPercentage()}% Complete</Badge>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </CardHeader>
        </Card>

        {/* Content Sections */}
        {layout.sections.map((section, index) => {
          const sectionId = section.name.toLowerCase().replace(/\s+/g, '-');
          const isOpen = openSections[sectionId] ?? true;
          const hasRequiredField = section.fields.some(field => field.required);
          const completedFields = section.fields.filter(field => {
            const value = content[field.id];
            return value && value.toString().trim().length > 0;
          }).length;

          return (
            <Card key={section.name} className="overflow-hidden">
              <Collapsible open={isOpen} onOpenChange={() => toggleSection(sectionId)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                            {index + 1}
                          </span>
                          {section.name}
                        </CardTitle>
                        {section.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {section.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Section completion indicator */}
                        <div className="flex items-center gap-1">
                          {section.fields.map(field => {
                            const hasContent = content[field.id] && 
                              content[field.id].toString().trim().length > 0;
                            return (
                              <div
                                key={field.id}
                                className={`w-2 h-2 rounded-full ${
                                  hasContent ? 'bg-green-500' : field.required ? 'bg-red-200' : 'bg-gray-200'
                                }`}
                                title={`${field.label || field.id}: ${hasContent ? 'Complete' : 'Incomplete'}`}
                              />
                            );
                          })}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {completedFields}/{section.fields.length}
                        </Badge>
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    {section.fields.map(renderField)}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Sidebar - 25% width */}
      <div className="col-span-3">
        {/* Content Intelligence Sidebar */}
        <div className="sticky top-4 space-y-3">
          {/* AI Assistant with Preview */}
          <Card>
            <CardContent className="pt-4 space-y-4">
              <UnifiedAIAssistant
                content={content}
                assetType={assetType}
                targetAudience={targetAudience}
                themeData={themeData}
                intakeContext={intakeContext}
                brandId="current-brand"
                realTimeAnalysis={realTimeAnalysis}
                onApplyContent={(field, value) => {
                  onContentChange(field, value);
                }}
              />
              <Separator />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(true)}
                className="w-full justify-start"
              >
                <Eye className="h-3 w-3 mr-2" />
                Preview Content
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        content={content}
        assetType={assetType}
        themeData={themeData}
      />
    </div>
  );
};