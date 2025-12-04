import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Presentation, Download, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const DocumentPreviewModal = ({ isOpen, onClose, title, description, type, sections, onDownload }) => {
  const Icon = type === 'ppt' ? Presentation : FileText;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <h3 className="text-sm font-semibold text-foreground px-3">
                    {section.title}
                  </h3>
                  <div className="h-px flex-1 bg-border" />
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  {section.type === 'slide' && (
                    <div className="text-xs font-medium text-primary mb-2">
                      Slide {idx + 1}
                    </div>
                  )}
                  {section.content.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-2">
                      {section.type === 'bullet' && (
                        <span className="text-primary mt-1">•</span>
                      )}
                      <p className="text-sm text-foreground leading-relaxed flex-1">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          <Button onClick={() => { onDownload(); onClose(); }}>
            <Download className="h-4 w-4 mr-2" />
            Download {type.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};