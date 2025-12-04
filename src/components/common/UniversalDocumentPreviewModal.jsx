
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  Eye,
  FileText,
  Calendar,
  User,
  Globe,
  Printer,
  FileSpreadsheet,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { UniversalDocumentService } from '@/services/UniversalDocumentService';
import { toast } from '@/hooks/use-toast';

export const UniversalDocumentPreviewModal = ({
  isOpen,
  onClose,
  preview,
  documentType,
  originalData,
  isGenerating = false
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (format) => {
    if (!preview || !originalData) return;
    setIsDownloading(true);
    try {
      let blob;
      let filename;
      if (format === 'pdf') {
        blob = await UniversalDocumentService.generateProfessionalPDF(originalData, documentType, preview.metadata);
        filename = `${documentType}_${Date.now()}.pdf`;
      } else if (format === 'word') {
        blob = await UniversalDocumentService.generateWordDocument(originalData, documentType, preview.metadata);
        filename = `${documentType}_${Date.now()}.docx`;
      } else {
        blob = await UniversalDocumentService.generateEmailReadyFormat(originalData, documentType, preview.metadata);
        filename = `${documentType}_email_${Date.now()}.html`;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: 'Download Complete',
        description: `Downloaded ${filename} successfully`
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'There was an error generating the document',
        variant: 'destructive'
      });
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('document-preview-content');
    if (printContent) {
      window.print();
    }
  };

  const getDocumentTypeIcon = (type) => {
    const icons = {
      'brand-compliance': <CheckCircle2 className="h-5 w-5 text-green-600" />,
      'localization-brief': <Globe className="h-5 w-5 text-blue-600" />,
      'cultural-checklist': <AlertTriangle className="h-5 w-5 text-orange-600" />,
      'translation-instructions': <FileText className="h-5 w-5 text-purple-600" />,
      'regulatory-matrix': <Info className="h-5 w-5 text-red-600" />
    };
    return icons[type] || <FileText className="h-5 w-5 text-primary" />;
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      'brand-compliance': 'Brand Compliance Report',
      'localization-brief': 'Localization Brief',
      'cultural-checklist': 'Cultural Adaptation Checklist',
      'translation-instructions': 'Translation Instructions',
      'regulatory-matrix': 'Regulatory Compliance Matrix'
    };
    return labels[type] || type.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getSectionIcon = (type) => {
    switch (type) {
      case 'score':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'list':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'table':
        return <FileSpreadsheet className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (!preview) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getDocumentTypeIcon(documentType)}
            <span className="text-xl">Document Preview</span>
            <Badge variant="secondary" className="ml-2">
              {getDocumentTypeLabel(documentType)}
            </Badge>
          </DialogTitle>
          <DialogDescription>Review the document content and choose your preferred format</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" /> Content Preview
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> PDF Format
              </TabsTrigger>
              <TabsTrigger value="word" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" /> Word Format
              </TabsTrigger>
            </TabsList>

            {/* Preview Tab */}
            <TabsContent value="preview" className="flex-1 overflow-y-auto mt-4">
              <div className="space-y-4">
                {/* Document Header */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getDocumentTypeIcon(documentType)} {preview.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Asset:</span>
                        <span>{preview.metadata.assetName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Author:</span>
                        <span>{preview.metadata.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Markets:</span>
                        <div className="flex gap-1 flex-wrap">
                          {preview.metadata.markets.map((market) => (
                            <Badge key={market} variant="secondary" className="text-xs">
                              {market}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Generated:</span>
                        <span>{new Date(preview.metadata.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Sections */}
                <div id="document-preview-content" className="space-y-6">
                  {preview.sections.map((section, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          {getSectionIcon(section.type)} {section.title}
                          <Badge variant="outline" className="text-xs ml-2">
                            {section.type}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/30 p-4 rounded-lg">
                          {section.type === 'score' ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-4">
                                <div className="text-3xl font-bold text-primary">{section.content}</div>
                                <div className="flex-1 bg-muted rounded-full h-3">
                                  <div
                                    className="bg-gradient-to-r from-primary to-primary-glow h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(parseInt(section.content) || 0, 100)}%` }}
                                  />
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Based on comprehensive analysis of brand guidelines, market requirements, and regulatory compliance.
                              </div>
                            </div>
                          ) : section.type === 'table' ? (
                            <div className="overflow-x-auto">
                              <div className="text-sm text-muted-foreground whitespace-pre-line font-mono">
                                {section.content}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                              {section.content}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* PDF Tab */}
            <TabsContent value="pdf" className="flex-1 overflow-y-auto mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" /> PDF Format Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    This document will be generated as a professional PDF with:
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" /> Professional branding and headers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" /> Formatted tables and charts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" /> Print-ready layout
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" /> Confidentiality watermarks
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Word Tab */}
            <TabsContent value="word" className="flex-1 overflow-y-auto mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" /> Word Format Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    This document will be generated as a Microsoft Word (.docx) file with:
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" /> Editable text and comments sections
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" /> Professional document styling
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" /> Table of contents and navigation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" /> Review and collaboration features
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t bg-muted/10 -mx-6 px-6 -mb-6 pb-6">
          <div className="text-sm text-muted-foreground">Choose your preferred format for download</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading || isGenerating}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> {isDownloading ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleDownload('word')}
              disabled={isDownloading || isGenerating}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" /> {isDownloading ? 'Generating...' : 'Download Word'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
