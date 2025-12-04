
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Eye, FileText, Calendar, User, Globe } from 'lucide-react';

export const DocumentPreviewModal = ({ isOpen, onClose, preview, onDownload, isGenerating = false }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  if (!preview) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Document Preview</DialogTitle>
          <DialogDescription>Review the document before downloading</DialogDescription>
        </DialogHeader>

        {/* Document Header */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{preview.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Asset:</span> {preview.metadata.assetName}
            </div>
            <div>
              <span className="font-semibold">Author:</span> {preview.metadata.author}
            </div>
            <div>
              <span className="font-semibold">Markets:</span>{' '}
              {preview.metadata.markets.map((market, idx) => (
                <Badge key={idx} variant="secondary" className="mr-1">
                  {market}
                </Badge>
              ))}
            </div>
            <div>
              <span className="font-semibold">Generated:</span>{' '}
              {new Date(preview.metadata.timestamp).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Document Content Preview */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Content Preview</h4>
          {preview.sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h5 className="text-md font-bold">{section.title}</h5>
              <p className="text-xs text-muted-foreground">{section.type}</p>
              <div className="text-sm">
                {section.type === 'score' ? (
                  <span className="font-semibold">{section.content}</span>
                ) : (
                  <p>{section.content}</p>
                )}
              </div>
              {index < preview.sections.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            This document will be generated as a professional PDF report
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading || isGenerating}>
              {isDownloading ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
