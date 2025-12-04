
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Clock, TrendingUp, Calendar, FileText } from 'lucide-react';

const TemplatePreviewModal = ({ template, onClose, onSelect }) => {
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

  const formatAssetType = (assetType) => {
    return assetType
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const totalHours = template.assetBreakdown?.reduce((sum, asset) => sum + asset.estimatedHours, 0) || 0;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="max-w-3xl w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{template.name}</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getCustomizationColor(template.customizationLevel)}>
              {template.customizationLevel} customization
            </Badge>
            <span className="text-sm text-muted-foreground">{template.category}</span>
          </div>
          <p className="text-muted-foreground mt-2">{template.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {template.estimatedTime}
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              {template.successRate}% Success Rate
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {template.timelineWeeks} week timeline
            </div>
            {totalHours > 0 && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {totalHours} total hours
              </div>
            )}
          </div>

          <Separator />

          {/* Asset Breakdown */}
          <div>
            <h4 className="text-lg font-medium mb-2">Asset Breakdown</h4>
            {template.assetBreakdown?.length > 0 ? (
              <div className="space-y-2">
                {template.assetBreakdown.map((asset, index) => (
                  <div key={index} className="flex justify-between text-sm border rounded p-2">
                    <span className="font-medium">{asset.name}</span>
                    <span>{formatAssetType(asset.assetType)}</span>
                    <span>{asset.estimatedHours}h estimated</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Asset details will be configured during setup</p>
            )}
          </div>

          <Separator />

          {/* Timeline Visualization */}
          <div>
            <h4 className="text-lg font-medium mb-2">Timeline Visualization</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Content Creation: Weeks 1-2</li>
              <li>Design & Review: Weeks 2-3</li>
              <li>MLR & Approval: Weeks 3-4</li>
              <li>Launch & Deploy: Week {template.timelineWeeks}</li>
            </ul>
            <p className="text-xs mt-2">Total Weeks: {template.timelineWeeks}</p>
          </div>

          <Separator />

          {/* Template Features */}
          <div>
            <h4 className="text-lg font-medium mb-2">Template Features</h4>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              onClick={() => onSelect(template, 'advanced')}
            >
              Advanced Settings
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => onSelect(template, 'moderate')}
            >
              Quick Customize
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onSelect(template, 'minimal')}
            >
              Start with this template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplatePreviewModal;
