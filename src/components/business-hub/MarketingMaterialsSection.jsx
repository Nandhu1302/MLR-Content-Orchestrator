import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Video, Download, Eye } from 'lucide-react';
import { MarketingDeckModal } from './MarketingDeckModal';
import { ExecutiveSummaryModal } from './ExecutiveSummaryModal';
import { useNavigate } from 'react-router-dom';

export const MarketingMaterialsSection = () => {
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const navigate = useNavigate();

  const materials = [
    {
      id: 'deck',
      title: 'Marketing Presentation Deck',
      description: '10 professional slides showcasing platform capabilities',
      badge: '10 Slides | Interactive',
      icon: FileText,
      onView: () => setShowDeckModal(true),
      onDownload: () => window.print(),
    },
    {
      id: 'video',
      title: 'Video Content Generator',
      description: 'AI-powered video frame generation for marketing assets',
      badge: 'AI-Powered',
      icon: Video,
      onView: () => navigate('/marketing-deck/video'),
      onDownload: null,
    },
    {
      id: 'summary',
      title: 'Executive Summary',
      description: '2-page ROI analysis document for stakeholders',
      badge: '2-Page PDF | Print-Ready',
      icon: FileText,
      onView: () => setShowSummaryModal(true),
      onDownload: () => window.print(),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Marketing Materials</h2>
          <p className="text-muted-foreground mt-1">
            Professional presentations and content for stakeholder engagement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {materials.map((material) => {
            const Icon = material.icon;
            return (
              <div
                key={material.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {material.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {material.description}
                  </p>
                  <div className="inline-block px-2 py-1 bg-accent/50 rounded text-xs font-medium text-accent-foreground">
                    {material.badge}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={material.onView}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {material.id === 'video' ? 'Generate' : 'View'}
                  </Button>
                  {material.onDownload && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={material.onDownload}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MarketingDeckModal open={showDeckModal} onOpenChange={setShowDeckModal} />
      <ExecutiveSummaryModal open={showSummaryModal} onOpenChange={setShowSummaryModal} />
    </>
  );
};