
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  AlertCircle,
  Palette,
  Type,
  Layout,
  Download,
  Save,
  Undo,
  Redo,
  Image as ImageIcon
} from 'lucide-react';

export const DesignCanvas = ({ template, asset, variation, brand, onSave }) => {
  const [compliance, setCompliance] = useState({
    colorCompliance: true,
    typographyCompliance: true,
    spacingCompliance: true,
    regulatoryCompliance: true,
    issues: []
  });

  const content = variation?.content_data || asset.primary_content;

  const canvasData = {
    template_id: template.id,
    content_mapping: content,
    timestamp: new Date().toISOString()
  };

  const handleSave = () => {
    onSave(canvasData, compliance);
  };

  return (
    <div className="space-y-4">
      {/* Canvas Area */}
      <h4 className="text-lg font-semibold">{template.template_name}</h4>
      <p className="text-sm text-muted-foreground">
        {template.base_layout.dimensions.width} × {template.base_layout.dimensions.height}px
      </p>
      <Badge>{template.template_category}</Badge>

      {/* Canvas Preview */}
      <div className="border rounded-lg p-4 bg-muted">
        {template.base_layout.zones.map((zone) => (
          <div key={zone.name} className="mb-2">
            <strong>{zone.name}</strong>
            <div className="mt-1">
              {zone.type === 'image' ? (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              ) : (
                <span>{content[zone.type] || `[${zone.type}]`}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm">
          <Undo className="h-4 w-4 mr-1" /> Undo
        </Button>
        <Button variant="outline" size="sm">
          <Redo className="h-4 w-4 mr-1" /> Redo
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>
        <Button onClick={handleSave} size="sm">
          <Save className="h-4 w-4 mr-1" /> Save Design
        </Button>
      </div>

      {/* Side Panel */}
      <Tabs defaultValue="compliance" className="mt-6">
        <TabsList>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="brand">Brand</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-4 mt-4">
          <h5 className="font-semibold">Compliance Check</h5>
          {compliance.issues.length > 0 && (
            <div>
              <p className="text-sm font-medium">Issues:</p>
              <ul className="list-disc pl-4 text-sm">
                {compliance.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        <TabsContent value="brand" className="space-y-4 mt-4">
          <h5 className="font-semibold">Brand Colors</h5>
          <h5 className="font-semibold">Typography</h5>
          <p className="text-sm">Font: {brand.font_family || 'Arial'}</p>
        </TabsContent>
      </Tabs>

      {/* Content Mapping Info */}
      <div className="mt-6">
        <h5 className="font-semibold">Content Zones</h5>
        <ul className="list-disc pl-4 text-sm">
          {template.base_layout.zones.map((zone) => (
            <li key={zone.name}>
              {zone.name}: {zone.constraints.required ? 'Required' : 'Optional'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ComplianceItem = ({ label, passed }) => (
  <div className="flex items-center gap-2 text-sm">
    {label} {passed ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
  </div>
);

const ColorSwatch = ({ label, color }) => (
  <div className="flex items-center gap-2 text-sm">
    <span>{label}</span>
    <div className="w-6 h-6 rounded" style={{ backgroundColor: color }}></div>
  </div>
);
