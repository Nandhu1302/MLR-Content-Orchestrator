import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, TrendingUp, Search, Filter, Sparkles, CheckCircle2, Zap, FileText, AlertCircle } from 'lucide-react';
// Type imports removed
// import { IntakeTemplate, AudienceType } from '@/types/intake';
import { useBrandTemplates } from '@/hooks/useBrandTemplates';
import { useTemplateRecommendations } from '@/hooks/useTemplateRecommendations';
import TemplatePreviewModal from './TemplatePreviewModal';
import { BlankStartConfirmDialog } from './BlankStartConfirmDialog';

// Interface and type annotations removed
const TemplateGallery = ({ onTemplateSelect, onStartBlank, onClose, primaryAudience }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('quick-start');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showBlankConfirm, setShowBlankConfirm] = useState(false);
  const { allTemplates, campaignTemplates, singleAssetTemplates } = useBrandTemplates();
  const recommendations = useTemplateRecommendations(allTemplates);

  const getFilteredTemplates = () => {
    let templates = allTemplates;
    
    if (categoryFilter === 'campaign') {
      templates = campaignTemplates;
    } else if (categoryFilter === 'single-asset') {
      templates = singleAssetTemplates;
    }

    if (searchQuery) {
      templates = templates.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return templates;
  };

  // Type annotation removed
  const getPrefilledFieldsCount = (template) => {
    let count = 0;
    if (template.preFilledData.primaryAudience) count++;
    if (template.preFilledData.primaryObjective) count++;
    if (template.preFilledData.targetMarkets?.length) count++;
    if (template.preFilledData.keyMessage) count++;
    if (template.assetBreakdown?.length) count += template.assetBreakdown.length;
    return count;
  };

  const handleBlankStart = () => {
    setShowBlankConfirm(true);
  };

  const handleConfirmBlankStart = () => {
    setShowBlankConfirm(false);
    onStartBlank();
  };

  // Type annotation removed
  const getCustomizationColor = (level) => {
    switch (level) {
      case 'minimal': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePreviewClose = () => {
    setSelectedTemplate(null);
  };

  // Type annotation removed
  const handleTemplateSelect = (template, customizationLevel) => {
    setSelectedTemplate(null);
    onTemplateSelect(template, customizationLevel);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-4 bg-background border rounded-lg shadow-lg flex flex-col">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Start New Project
              </h1>
              <p className="text-muted-foreground">Choose from intelligence-backed templates or start blank</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          {/* Type assertion removed */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="h-full flex flex-col">
            <div className="border-b px-6 py-2">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="quick-start" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Start (Recommended)
                </TabsTrigger>
                <TabsTrigger value="blank" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Start From Scratch
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Quick Start Tab */}
            <TabsContent value="quick-start" className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Benefits Banner */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Templates help you create better content, faster</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>85% faster completion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Pre-filled with brand data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Intelligence-backed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Templates */}
              {recommendations.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Recommended for You
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map(({ template, reasons }) => (
                      <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer group border-primary/20">
                        <CardHeader className="pb-3" onClick={() => setSelectedTemplate(template)}>
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="text-base group-hover:text-primary transition-colors">
                              {template.name}
                            </CardTitle>
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              Recommended
                            </Badge>
                          </div>
                          {reasons.length > 0 && (
                            <div className="space-y-1">
                              {reasons.slice(0, 2).map((reason, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <CheckCircle2 className="h-3 w-3 text-primary" />
                                  <span>{reason}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                          
                          {/* Pre-filled Benefits */}
                          <div className="bg-muted/30 rounded-md p-2 space-y-1">
                            <p className="text-xs font-medium">Pre-filled Fields:</p>
                            <div className="text-xs text-muted-foreground">
                              ✓ {getPrefilledFieldsCount(template)} fields ready to use
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {template.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="h-4 w-4" />
                              {template.successRate}%
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTemplateSelect(template, 'minimal');
                              }}
                            >
                              Use Template
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTemplate(template);
                              }}
                            >
                              Preview
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Search and Filter for All Templates */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      All Templates
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9"
                        size={1}
                      />
                    </div>
                    {/* Type assertion removed */}
                    <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v)}>
                      <TabsList className="h-9">
                        <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                        <TabsTrigger value="campaign" className="text-xs">Campaigns</TabsTrigger>
                        <TabsTrigger value="single-asset" className="text-xs">Assets</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredTemplates().map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                      <CardHeader className="pb-3" onClick={() => setSelectedTemplate(template)}>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base group-hover:text-primary transition-colors">
                            {template.name}
                          </CardTitle>
                          <Badge className={getCustomizationColor(template.customizationLevel)}>
                            {template.customizationLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {template.estimatedTime}
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-4 w-4" />
                            {template.successRate}%
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTemplateSelect(template, 'minimal');
                            }}
                          >
                            Use Template
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTemplate(template);
                            }}
                          >
                            Preview
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Start From Scratch Tab */}
            <TabsContent value="blank" className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Start with a blank project</h3>
                    <p className="text-muted-foreground">
                      Create your project from scratch without using a template
                    </p>
                  </div>
                </div>

                {/* Warning Card */}
                <Card className="border-orange-200 bg-orange-50/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-orange-900">
                      <AlertCircle className="h-5 w-5" />
                      Consider using a template instead
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-orange-800">
                      Starting from scratch requires more time and manual input. Templates provide:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Pre-filled brand data</p>
                          <p className="text-muted-foreground text-xs">Audience, messaging, and market information already configured</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Intelligence-backed recommendations</p>
                          <p className="text-muted-foreground text-xs">Leverage proven content structures and messaging</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">60% faster completion</p>
                          <p className="text-muted-foreground text-xs">Templates complete in 5-10 minutes vs 20-30 minutes blank</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setActiveTab('quick-start')}
                      >
                        Browse Templates
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={handleBlankStart}
                      >
                        Continue Blank
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          template={selectedTemplate}
          onClose={handlePreviewClose}
          onSelect={handleTemplateSelect}
        />
      )}

      {/* Blank Start Confirmation Dialog */}
      <BlankStartConfirmDialog
        open={showBlankConfirm}
        onOpenChange={setShowBlankConfirm}
        onConfirm={handleConfirmBlankStart}
      />
    </div>
  );
};

export default TemplateGallery;