
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, TrendingUp, Search, Filter } from 'lucide-react';
import { useBrandTemplates } from '@/hooks/useBrandTemplates';
import TemplatePreviewModal from './TemplatePreviewModal';

const TemplateGallery = ({ onTemplateSelect, onClose, primaryAudience }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { allTemplates, campaignTemplates, singleAssetTemplates } = useBrandTemplates();

  const getFilteredTemplates = () => {
    let templates = allTemplates;
    if (activeTab === 'campaign') {
      templates = campaignTemplates;
    } else if (activeTab === 'single-asset') {
      templates = singleAssetTemplates;
    }
    if (searchQuery) {
      templates = templates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return templates;
  };

  const getCustomizationColor = (level) => {
    switch (level) {
      case 'minimal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePreviewClose = () => {
    setSelectedTemplate(null);
  };

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
              <h1 className="text-2xl font-semibold text-foreground">Campaign & Asset Templates</h1>
              <p className="text-muted-foreground">Choose a pre-built template to get started quickly</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="h-full flex flex-col">
            <div className="border-b px-6 py-2">
              <TabsList>
                <TabsTrigger value="all">All Templates ({allTemplates.length})</TabsTrigger>
                <TabsTrigger value="campaign">Campaigns ({campaignTemplates.length})</TabsTrigger>
                <TabsTrigger value="single-asset">Single Assets ({singleAssetTemplates.length})</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={activeTab} className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredTemplates().map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3" onClick={() => setSelectedTemplate(template)}>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {template.name}
                        </CardTitle>
                        <Badge className={getCustomizationColor(template.customizationLevel)}>
                          {template.customizationLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Metrics */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {template.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          {template.successRate}% Success
                        </div>
                      </div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      {/* Asset Count */}
                      {template.assetBreakdown && (
                        <div className="text-sm text-muted-foreground">
                          {template.assetBreakdown.length} asset{template.assetBreakdown.length !== 1 ? 's' : ''} included
                        </div>
                      )}
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTemplateSelect(template, 'minimal');
                          }}
                        >
                          Use As-Is
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
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
    </div>
  );
};

export default TemplateGallery;
