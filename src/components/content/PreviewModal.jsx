import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Printer, 
  X,
  Mail,
  Globe,
  MessageSquare,
  Image
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { EmailTemplateRenderer } from '@/services/emailTemplateRenderer';

export const PreviewModal = ({
  isOpen,
  onClose,
  content,
  assetType,
  themeData
}) => {
  const getAssetTypeDisplay = (type) => {
    const types = {
      // Email types (normalized and full names)
      'email': { label: 'Email', icon: <Mail className="h-4 w-4" /> },
      'mass-email': { label: 'Mass Email', icon: <Mail className="h-4 w-4" /> },
      'rep-triggered-email': { label: 'Rep-Triggered Email', icon: <Mail className="h-4 w-4" /> },
      'rte': { label: 'Rep-Triggered Email', icon: <Mail className="h-4 w-4" /> },
      
      // Web/Landing Page types
      'web': { label: 'Landing Page', icon: <Globe className="h-4 w-4" /> },
      'website-landing-page': { label: 'Landing Page', icon: <Globe className="h-4 w-4" /> },
      'landing-page': { label: 'Landing Page', icon: <Globe className="h-4 w-4" /> },
      
      // Social Media types
      'social': { label: 'Social Media Post', icon: <MessageSquare className="h-4 w-4" /> },
      'social-media-post': { label: 'Social Media Post', icon: <MessageSquare className="h-4 w-4" /> },
      
      // Presentation/Sales Aid types
      'slide': { label: 'Sales Presentation', icon: <FileText className="h-4 w-4" /> },
      'sales-presentation': { label: 'Sales Presentation', icon: <FileText className="h-4 w-4" /> },
      'digital-sales-aid': { label: 'Digital Sales Aid', icon: <FileText className="h-4 w-4" /> },
      'dsa': { label: 'Digital Sales Aid', icon: <FileText className="h-4 w-4" /> },
      
      // Print Materials
      'print-material': { label: 'Print Material', icon: <Image className="h-4 w-4" /> },
      'print-ad': { label: 'Print Advertisement', icon: <Image className="h-4 w-4" /> },
      'brochure': { label: 'Brochure', icon: <FileText className="h-4 w-4" /> },
      'fact-sheet': { label: 'Fact Sheet', icon: <FileText className="h-4 w-4" /> }
    };
    return types[type] || { label: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), icon: <FileText className="h-4 w-4" /> };
  };

  const handleExportPDF = () => {
    const printContent = document.getElementById('preview-content');
    if (printContent) {
      window.print();
      toast({
        title: "PDF Export",
        description: "Use your browser's print dialog to save as PDF."
      });
    }
  };

  const handleExportWord = () => {
    // Create a simple HTML document for Word export
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${getAssetTypeDisplay(assetType).label} - ${content.headline || content.subject || 'Content Preview'}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            .header { border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .label { font-weight: bold; color: #333; margin-bottom: 8px; }
            .content { margin-bottom: 15px; }
            .disclaimer { font-size: 12px; color: #666; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${getAssetTypeDisplay(assetType).label}</h1>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          ${renderWordContent()}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `${assetType}_${Date.now()}.doc`;
    
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Word Export Complete",
      description: `Downloaded ${fileName}`
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const renderWordContent = () => {
    let html = '';
    
    if (content.subject) {
      html += `<div class="section"><div class="label">Subject:</div><div class="content">${content.subject}</div></div>`;
    }
    if (content.headline) {
      html += `<div class="section"><div class="label">Headline:</div><div class="content">${content.headline}</div></div>`;
    }
    if (content.keyMessage) {
      html += `<div class="section"><div class="label">Key Message:</div><div class="content">${content.keyMessage}</div></div>`;
    }
    if (content.body) {
      html += `<div class="section"><div class="label">Body:</div><div class="content">${content.body.replace(/\n/g, '<br>')}</div></div>`;
    }
    if (content.cta) {
      html += `<div class="section"><div class="label">Call to Action:</div><div class="content">${content.cta}</div></div>`;
    }
    if (content.disclaimer) {
      html += `<div class="section"><div class="label">Disclaimer:</div><div class="content disclaimer">${content.disclaimer}</div></div>`;
    }
    
    return html;
  };

  const renderPreviewContent = () => {
    const assetInfo = getAssetTypeDisplay(assetType);

    switch (assetType) {
      // Email asset types
      case 'email':
      case 'mass-email':
      case 'rep-triggered-email':
      case 'rte':
        // Determine template based on audience
        const targetAudience = content.targetAudience || themeData?.target_audience || 'HCP';
        const isPatientFacing = typeof targetAudience === 'string' && ['Patient', 'Caregiver-Family', 'Caregiver-Professional'].includes(targetAudience);
        const isClinical = (typeof content.objective === 'string' && content.objective.includes('clinical')) || 
                          (typeof content.keyMessage === 'string' && content.keyMessage.toLowerCase().includes('clinical'));
        
        let templateId = 'professional'; // Default HCP template
        if (isPatientFacing) {
          templateId = 'patient-friendly';
        } else if (isClinical) {
          templateId = 'clinical';
        }
        
        console.log('📧 Email Preview Template Selection:', {
          targetAudience,
          isPatientFacing,
          isClinical,
          selectedTemplate: templateId
        });
        
        // Render proper HTML email using EmailTemplateRenderer
        const emailComponents = {
          text: {
            subject: content.subject || 'Email Subject',
            preheader: content.preheader || '',
            headline: content.headline || content.heroHeadline || content.keyMessage || '',
            body: content.body || content.bodyText || '',
            cta: content.cta || content.heroCta || 'Learn More',
            disclaimer: content.disclaimer || ''
          },
          visualizations: [],
          tables: [],
          images: []
        };
        
        const brandStyles = themeData ? {
          primaryColor: themeData.primary_color || '#0066cc',
          secondaryColor: themeData.secondary_color || '#333333',
          accentColor: themeData.accent_color || '#ff6b35',
          fontFamily: themeData.font_family || 'Arial, sans-serif'
        } : undefined;
        
        const emailHtml = EmailTemplateRenderer.render(templateId, emailComponents, brandStyles);
        
        return (
          <div className="space-y-4">
            <div className="border-b pb-4 bg-muted/30 p-4 rounded-md">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Template: <span className="text-primary font-semibold">{templateId}</span> • 
                Audience: <span className="text-primary font-semibold">{targetAudience}</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Subject:</div>
              <div className="text-lg font-semibold">{content.subject || 'No subject'}</div>
              {content.preheader && (
                <div className="mt-2">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Preheader:</div>
                  <div className="text-sm text-muted-foreground">{content.preheader}</div>
                </div>
              )}
            </div>
            <div className="border rounded-md overflow-hidden bg-white">
              <iframe
                srcDoc={emailHtml}
                className="w-full h-[600px] border-0"
                title="Email Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        );

      // Web/Landing Page asset types
      case 'web':
      case 'website-landing-page':
      case 'landing-page':
        return (
          <div className="bg-white text-black shadow-lg rounded-lg overflow-hidden border">
            {/* Mock Browser Chrome */}
            <div className="bg-gray-100 border-b px-4 py-2 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600 border">
                https://yourwebsite.com/{assetType}
              </div>
              {/* SEO Meta in Chrome */}
              {content.pageTitle && (
                <div className="text-xs text-muted-foreground max-w-[200px] truncate" title={content.pageTitle}>
                  {content.pageTitle}
                </div>
              )}
            </div>
            
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary via-primary-glow to-accent text-white p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
              <div className="relative max-w-4xl mx-auto">
                <div className="flex items-center gap-2 text-sm text-white/80 mb-6">
                  <Globe className="h-4 w-4" />
                  Landing Page Preview
                </div>
                {content.heroHeadline && (
                  <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-sm">{content.heroHeadline}</h1>
                )}
                {content.heroSubheadline && (
                  <p className="text-xl text-white/90 font-medium mb-8">{content.heroSubheadline}</p>
                )}
                {content.heroCta && (
                  <button className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold bg-white text-primary rounded-lg shadow-lg hover:shadow-xl transition-all">
                    {content.heroCta}
                  </button>
                )}
              </div>
            </div>

            {/* Page Content Sections */}
            <div className="max-w-4xl mx-auto px-12 py-16 space-y-16">
              {/* Disease Overview Section */}
              {content.diseaseOverview && (
                <section className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground border-b pb-3">Disease Overview</h2>
                  <div className="prose prose-lg text-foreground/90 max-w-none leading-relaxed whitespace-pre-wrap">
                    {content.diseaseOverview}
                  </div>
                </section>
              )}

              {/* Treatment Approach Section */}
              {content.treatmentApproach && (
                <section className="space-y-4 bg-muted/20 rounded-lg p-8">
                  <h2 className="text-3xl font-bold text-foreground">Treatment Approach</h2>
                  <div className="prose prose-lg text-foreground/90 max-w-none leading-relaxed whitespace-pre-wrap">
                    {content.treatmentApproach}
                  </div>
                </section>
              )}

              {/* Clinical Evidence Section */}
              {content.clinicalEvidence && (
                <section className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground border-b pb-3">Clinical Evidence</h2>
                  <div className="prose prose-lg text-foreground/90 max-w-none leading-relaxed whitespace-pre-wrap">
                    {content.clinicalEvidence}
                  </div>
                </section>
              )}

              {/* Safety Information Section */}
              {content.safetyInformation && (
                <section className="space-y-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/10 p-8 rounded-r-lg">
                  <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                    <span className="text-amber-600 dark:text-amber-400">⚠</span>
                    Safety Information
                  </h2>
                  <div className="prose prose-lg text-foreground/90 max-w-none leading-relaxed whitespace-pre-wrap">
                    {content.safetyInformation}
                  </div>
                </section>
              )}

              {/* CTA Section */}
              {content.cta && (
                <div className="text-center py-12">
                  <button className="group relative inline-flex items-center justify-center px-16 py-5 text-xl font-semibold text-white bg-gradient-to-r from-primary to-primary-glow rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-95">
                    <span className="relative z-10">{content.cta}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  </button>
                </div>
              )}

              {/* Disclaimer/Legal */}
              {content.disclaimer && (
                <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-6 border-l-4 border-muted-foreground/20">
                  <div className="font-medium mb-2">Important Information:</div>
                  <div className="leading-relaxed whitespace-pre-wrap">{content.disclaimer}</div>
                </div>
              )}

              {/* SEO Metadata Display */}
              {(content.pageTitle || content.metaDescription) && (
                <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-4 border space-y-2">
                  <div className="font-semibold">SEO Metadata:</div>
                  {content.pageTitle && (
                    <div>
                      <span className="font-medium">Title:</span> {content.pageTitle}
                    </div>
                  )}
                  {content.metaDescription && (
                    <div>
                      <span className="font-medium">Meta Description:</span> {content.metaDescription}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      // Social Media asset types
      case 'social':
      case 'social-media-post':
        return (
          <div className="bg-white text-black p-8 max-w-2xl mx-auto">
            <div className="border rounded-lg overflow-hidden shadow-sm">
              {/* Social Header */}
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4" />
                  Social Media Post Preview
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6 space-y-4">
                {content.body && (
                  <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {content.body}
                  </div>
                )}

                {content.cta && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-blue-800 font-medium">{content.cta}</div>
                  </div>
                )}

                {content.disclaimer && (
                  <div className="text-xs text-gray-500 pt-4 border-t">
                    {content.disclaimer}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      // Sales Aid/Presentation asset types
      case 'digital-sales-aid':
      case 'dsa':
      case 'slide':
      case 'sales-presentation':
        return (
          <div className="bg-white text-black p-8 max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Document Header */}
              <div className="border-b pb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <FileText className="h-4 w-4" />
                  {assetInfo.label} Preview
                </div>
                {content.headline && (
                  <h1 className="text-3xl font-bold text-gray-900">{content.headline}</h1>
                )}
              </div>

              {/* Key Message */}
              {content.keyMessage && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                  <h2 className="text-lg font-semibold text-blue-900 mb-2">Key Message</h2>
                  <div className="text-blue-800">{content.keyMessage}</div>
                </div>
              )}

              {/* Main Content */}
              {content.body && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Content</h2>
                  <div className="prose text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {content.body}
                  </div>
                </div>
              )}

              {content.disclaimer && (
                <div className="text-sm text-gray-500 border-t pt-6">
                  <strong>Important Information:</strong><br />
                  {content.disclaimer}
                </div>
              )}
            </div>
          </div>
        );

      // Generic fallback for other asset types
      default:
        return (
          <div className="bg-white text-black p-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                {assetInfo.icon}
                {assetInfo.label} Preview
              </div>
              
              {Object.entries(content).map(([key, value]) => (
                value && (
                  <div key={key} className="space-y-2">
                    <div className="font-semibold text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap">{value}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        );
    }
  };

  const assetInfo = getAssetTypeDisplay(assetType);
  const title = content.headline || content.subject || 'Content Preview';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 gap-0 bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-8 py-6 pb-5 border-b bg-gradient-to-r from-background to-muted/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg border">
                {assetInfo.icon}
              </div>
              <div>
                <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{title}</DialogTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary" className="font-medium px-3 py-1">{assetInfo.label}</Badge>
                  <span className="text-sm text-muted-foreground font-medium">
                    Generated {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Export Actions */}
            <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportPDF}
                className="flex items-center gap-2 hover:bg-background hover:shadow-sm transition-all duration-200"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportWord}
                className="flex items-center gap-2 hover:bg-background hover:shadow-sm transition-all duration-200"
              >
                <FileText className="h-4 w-4" />
                Word
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2 hover:bg-background hover:shadow-sm transition-all duration-200"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto">
          <div id="preview-content" className="bg-gradient-to-br from-muted/20 via-background to-muted/30 p-8">
            <div className="max-w-6xl mx-auto">
              {renderPreviewContent()}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #preview-content,
          #preview-content * {
            visibility: visible;
          }
          #preview-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          .bg-gray-50 {
            background: white !important;
          }
        }
      `}</style>
    </Dialog>
  );
};