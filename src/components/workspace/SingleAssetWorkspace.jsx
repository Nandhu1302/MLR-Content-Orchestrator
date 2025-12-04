
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Save,
  Send,
  Edit3,
  Clock,
  User,
  FileText,
  CheckCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { assetConfigurations } from '@/data/assetConfigurations';
import { MultiLevelGuardrailsPanel } from '@/components/guardrails/MultiLevelGuardrailsPanel';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-500', progress: 10 },
  'in-progress': { label: 'In Progress', color: 'bg-blue-500', progress: 30 },
  'content-review': { label: 'Content Review', color: 'bg-yellow-500', progress: 50 },
  'design-review': { label: 'Design Review', color: 'bg-orange-500', progress: 70 },
  'mlr-review': { label: 'MLR Review', color: 'bg-purple-500', progress: 85 },
  approved: { label: 'Approved', color: 'bg-green-500', progress: 95 },
  published: { label: 'Published', color: 'bg-emerald-600', progress: 100 }
};

const SingleAssetWorkspace = ({ assetData, onBack, onSave, onSubmit, onReturnToIntake }) => {
  const [content, setContent] = useState({
    subject: assetData.content?.subject || '',
    body: assetData.content?.body || '',
    ...assetData.content
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const assetConfig = assetConfigurations.find(config => config.type === assetData.assetType);
  const status = statusConfig[assetData.status];

  const updateContent = (field, value) => {
    setContent(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const updatedAsset = {
      ...assetData,
      content,
      updatedAt: new Date(),
      status: assetData.status === 'draft' ? 'in-progress' : assetData.status
    };
    onSave(updatedAsset);
    setHasUnsavedChanges(false);
  };

  const handleSubmit = () => {
    const updatedAsset = {
      ...assetData,
      content,
      updatedAt: new Date(),
      status: 'content-review'
    };
    onSubmit(updatedAsset);
    setHasUnsavedChanges(false);
  };

  const renderContentEditor = () => {
    switch (assetData.assetType) {
      case 'mass-email':
      case 'rep-triggered-email':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject Line</Label>
              <Input
                id="subject"
                value={content.subject}
                onChange={e => updateContent('subject', e.target.value)}
                placeholder="Enter compelling subject line..."
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Keep under 50 characters for optimal mobile display
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Email Body Content</Label>
              <Textarea
                id="body"
                value={content.body}
                onChange={e => updateContent('body', e.target.value)}
                placeholder="Write your email content here..."
                rows={12}
                className="font-mono text-sm"
              />
            </div>
          </div>
        );
      case 'social-media-post':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="body">Post Content</Label>
              <Textarea
                id="body"
                value={content.body}
                onChange={e => updateContent('body', e.target.value)}
                placeholder="Write your social media post..."
                rows={6}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Characters: {content.body.length}/280</span>
                <span>LinkedIn: {content.body.length}/3000</span>
              </div>
            </div>
          </div>
        );
      case 'website-landing-page':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Page Title</Label>
              <Input
                id="subject"
                value={content.subject}
                onChange={e => updateContent('subject', e.target.value)}
                placeholder="SEO-optimized page title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Page Content</Label>
              <Textarea
                id="body"
                value={content.body}
                onChange={e => updateContent('body', e.target.value)}
                placeholder="Write your landing page content..."
                rows={15}
              />
            </div>
          </div>
        );
      case 'digital-sales-aid':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Sales Aid Title</Label>
              <Input
                id="subject"
                value={content.subject}
                onChange={e => updateContent('subject', e.target.value)}
                placeholder="Professional sales aid title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Slide Content & Talking Points</Label>
              <Textarea
                id="body"
                value={content.body}
                onChange={e => updateContent('body', e.target.value)}
                placeholder="Outline your slides and key talking points..."
                rows={12}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="body">Content</Label>
            <Textarea
              id="body"
              value={content.body}
              onChange={e => updateContent('body', e.target.value)}
              placeholder="Write your content here..."
              rows={10}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{assetData.projectName}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{assetConfig?.name}</Badge>
                  <Badge variant="secondary" className={status.color}>
                    {status.label}
                  </Badge>
                  {hasUnsavedChanges && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Unsaved Changes
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onReturnToIntake}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Intake
              </Button>
              {assetData.parentCampaignId && (
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Campaign
                </Button>
              )}
              <Button variant="outline" onClick={handleSave} disabled={!hasUnsavedChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Submit for Review
              </Button>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Asset Progress</span>
              <span>{status.progress}% Complete</span>
            </div>
            <Progress value={status.progress} className="h-2" />
          </div>
        </div>
      </div>
      <div className="container px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Context Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Asset Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Brand Information</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Brand:</span> {assetData.brand}</p>
                  <p><span className="font-medium">Indication:</span> {assetData.indication}</p>
                  <p><span className="font-medium">Audience:</span> {assetData.primaryAudience}</p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Strategy</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Objective:</span> {assetData.primaryObjective}</p>
                  <p><span className="font-medium">Message:</span> {assetData.keyMessage}</p>
                  {assetData.callToAction && (
                    <p><span className="font-medium">CTA:</span> {assetData.callToAction}</p>
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Timeline</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Launch: {new Date(assetData.plannedLaunch).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Created by: {assetData.createdBy}</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Regulatory</h4>
                <div className="space-y-1">
                  {assetData.fairBalanceRequired && (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Fair Balance Required
                    </Badge>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Markets: {assetData.targetMarkets.join(', ')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Content Editor */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Content Editor
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  Estimated: {assetConfig?.estimatedHours}h
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {renderContentEditor()}
              {/* Guardrails & Quick Actions */}
              <div className="mt-8 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5" />
                      Asset Guardrails
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <MultiLevelGuardrailsPanel
                      campaignId={assetData.parentCampaignId}
                      assetId={assetData.assetId}
                      assetType={assetData.assetType}
                      content={content.body}
                      showComplianceCheck={true}
                      showCustomization={true}
                    />
                  </CardContent>
                </Card>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      AI Assist
                    </Button>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      Add Reference
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SingleAssetWorkspace;
