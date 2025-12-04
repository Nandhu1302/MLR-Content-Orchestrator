import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, BarChart3, Table2, Image as ImageIcon, Shield, Maximize2, Printer, X } from 'lucide-react';
import { PIValidationResults } from '@/components/pi/PIValidationResults';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { IntelligenceSummaryBadge } from '@/components/intelligence/IntelligenceSummaryBadge';
import { UnifiedIntelligenceCard } from '@/components/intelligence/UnifiedIntelligenceCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const MultiModalEmailComposer = ({ asset, currentContent, citationData: citationDataProp, onComposed }) => {
  const { toast } = useToast();
  const [composing, setComposing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [intelligenceUsed, setIntelligenceUsed] = useState([]);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && preview?.emailHTML) {
      printWindow.document.write(preview.emailHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const extractTextContent = (asset, liveContent) => {
    // PRIORITY 1: Use live editor content if provided (prevents stale content issues)
    if (liveContent) {
      return {
        subject: liveContent.subject || asset.asset_name,
        preheader: liveContent.preheader || '',
        headline: liveContent.headline || liveContent.keyMessage || '',
        body: liveContent.body || '',
        cta: liveContent.cta || 'Learn More',
        disclaimer: liveContent.disclaimer || ''
      };
    }
    
    // FALLBACK: Extract from asset.primary_content (legacy behavior)
    const content = asset.primary_content || {};
    const intakeProjectName = asset.intake_context?.projectName || asset.intake_context?.original_key_message;
    return {
      subject: content.subject || intakeProjectName || content.subject_line || `${asset.asset_name}`,
      preheader: content.preheader || content.pre_header || '',
      headline: content.headline || content.keyMessage || content.key_message || '',
      body: content.body || content.content || content.bodyText || '',
      cta: content.cta || content.callToAction || 'Learn More',
      disclaimer: content.disclaimer || content.legal_text || ''
    };
  };

  const generateBasicPreview = () => {
    const content = extractTextContent(asset, currentContent);
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
            .email-container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .subject { font-size: 14px; color: #666; margin-bottom: 5px; }
            .preheader { font-size: 12px; color: #999; margin-bottom: 20px; }
            .headline { font-size: 24px; font-weight: bold; color: #1a1a1a; margin-bottom: 20px; }
            .body { font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 25px; white-space: pre-wrap; }
            .cta { display: inline-block; padding: 12px 30px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
            .disclaimer { font-size: 11px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
            .note { background: #f0f7ff; border-left: 4px solid #0066cc; padding: 12px; margin-bottom: 20px; font-size: 13px; color: #0066cc; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="note">
              透 This is a basic preview of your current content. Click "Compose Multi-Modal Email" below to generate an enhanced version with AI-powered components.
            </div>
            <div class="subject">Subject: ${content.subject}</div>
            ${content.preheader ? `<div class="preheader">Preheader: ${content.preheader}</div>` : ''}
            <div class="headline">${content.headline}</div>
            <div class="body">${content.body}</div>
            <a href="#" class="cta">${content.cta}</a>
            ${content.disclaimer ? `<div class="disclaimer">${content.disclaimer}</div>` : ''}
          </div>
        </body>
      </html>
    `;
  };

  const extractStructuredData = (asset) => {
    // Get clinical data from intake_context (imported from PI)
    const intakeData = asset.intake_context || {};
    
    // First check for piFilteringResult (from PIEvidenceSelector)
    const piFilteringResult = intakeData.piFilteringResult;
    let structuredData = {};
    
    if (piFilteringResult?.selectedSections) {
      // Map selected PI sections to expected structure
      const sections = piFilteringResult.selectedSections;
      
      structuredData = {
        clinicalTrialResults: sections.filter((s) => 
          s.section?.toLowerCase().includes('clinical') || 
          s.section?.toLowerCase().includes('study') ||
          s.section?.toLowerCase().includes('trial')
        ).map((s) => ({
          studyName: s.section,
          data: s.content,
          source: `${s.documentName}, p.${s.page}`
        })),
        
        efficacyData: sections.filter((s) => 
          s.section?.toLowerCase().includes('efficacy') ||
          s.section?.toLowerCase().includes('effectiveness') ||
          s.section?.toLowerCase().includes('response')
        ).map((s) => ({
          metric: s.section,
          value: s.content,
          source: `${s.documentName}, p.${s.page}`
        })),
        
        safetyData: sections.filter((s) => 
          s.section?.toLowerCase().includes('safety') ||
          s.section?.toLowerCase().includes('adverse') ||
          s.section?.toLowerCase().includes('tolerability')
        ).map((s) => ({
          category: s.section,
          data: s.content,
          source: `${s.documentName}, p.${s.page}`
        })),
        
        competitorComparison: sections.filter((s) =>
          s.section?.toLowerCase().includes('comparison') ||
          s.section?.toLowerCase().includes('versus')
        ).map((s) => ({
          competitor: s.section,
          data: s.content,
          source: `${s.documentName}, p.${s.page}`
        })),
      };
      
      // Filter out empty arrays
      Object.keys(structuredData).forEach(key => {
        if (Array.isArray(structuredData[key]) && structuredData[key].length === 0) {
          structuredData[key] = undefined;
        }
      });
    }
    
    // Fallback to direct properties if piFilteringResult not available
    return {
      clinicalTrialResults: structuredData.clinicalTrialResults || intakeData.clinical_trial_results || undefined,
      efficacyData: structuredData.efficacyData || intakeData.efficacy_data || undefined,
      safetyData: structuredData.safetyData || intakeData.safety_data || undefined,
      competitorComparison: structuredData.competitorComparison || intakeData.competitor_comparison || undefined,
      marketInsights: intakeData.market_insights || undefined,
    };
  };

  const getClinicalDataCount = () => {
    const data = extractStructuredData(asset);
    const trialCount = data.clinicalTrialResults?.length || 0;
    const efficacyCount = data.efficacyData?.length || 0;
    const safetyCount = data.safetyData?.length || 0;
    return trialCount + efficacyCount + safetyCount;
  };

  const hasStructuredData = () => {
    const data = extractStructuredData(asset);
    return Object.values(data).some(v => v !== undefined && v !== null);
  };

  const handleValidateContent = async () => {
    setValidating(true);
    setValidationResult(null);

    try {
      // Get content to validate
      const contentToValidate = preview?.emailHTML || generateBasicPreview();
      
      // Extract text from HTML for validation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentToValidate;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      // Get linked PI IDs from asset
      const linkedPIIds = asset.linked_pi_ids || [];

      if (linkedPIIds.length === 0) {
        toast({
          title: "No PI Documents Linked",
          description: "Link PI documents to enable validation",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('validate-content-against-pi', {
        body: {
          content: textContent,
          linkedPIIds,
          assetId: asset.id,
          brandId: asset.brand_id
        }
      });

      if (error) throw error;

      if (data?.success) {
        setValidationResult(data.result);
        toast({
          title: "Validation Complete",
          description: `Compliance Score: ${data.result.complianceScore}/100`,
        });
      } else {
        throw new Error(data?.error || 'Validation failed');
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Validation Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setValidating(false);
    }
  };

  const handleCompose = async () => {
    setComposing(true);
    setValidationResult(null);
    setIntelligenceUsed([]); // Reset intelligence tracking
    
    try {
      const piData = hasStructuredData() ? extractStructuredData(asset) : null;
      const evidenceUsage = asset.metadata?.evidenceUsage || {};
      const evidenceContext = {
        claims: evidenceUsage.clinicalClaims || [],
        references: evidenceUsage.clinicalReferences || [],
        segments: evidenceUsage.contentSegments || []
      };

      // PRIORITY: Use transformed citationData from prop if provided (has full visual objects)
      // FALLBACK: Extract from asset metadata (may have string IDs only)
      const citationData = citationDataProp || {
        claimsUsed: asset.claims_used || asset.metadata?.citation_data?.claimsUsed || [],
        referencesUsed: asset.references_used || asset.metadata?.citation_data?.referencesUsed || [],
        visualsUsed: asset.metadata?.citation_data?.visualsUsed || 
                     asset.metadata?.visualsUsed || 
                     []
      };

      console.log('透 Citation data source:', citationDataProp ? 'PROP (transformed)' : 'ASSET.METADATA (raw)');
      console.log('透 Visuals data sample:', citationData.visualsUsed?.[0] || 'none');

      console.log('透 Composing email with citation data:', {
        claimsCount: citationData.claimsUsed?.length || 0,
        referencesCount: citationData.referencesUsed?.length || 0,
        visualsCount: citationData.visualsUsed?.length || 0
      });

      const textContent = extractTextContent(asset, currentContent);
      
      console.log('透 Composing email with content:', {
        fromEditor: !!currentContent,
        subject: textContent.subject,
        bodyLength: textContent.body?.length || 0,
        claimsCount: citationData.claimsUsed?.length || 0,
        visualsCount: citationData.visualsUsed?.length || 0
      });

      const { data, error } = await supabase.functions.invoke('compose-smart-email', {
        body: {
          textContent,
          piData,
          evidenceContext,
          citationData, // Pass citation data for references section
          brandId: asset.brand_id, // Pass brandId to fetch visual assets
          context: {
            targetAudience: asset.target_audience || 'physician-specialist',
            assetType: asset.asset_type,
            hasClinicalData: !!extractStructuredData(asset).clinicalTrialResults?.length,
            therapeuticArea: asset.intake_context?.therapeuticArea || 'General',
            indication: asset.intake_context?.indication || 'General',
            market: asset.metadata?.market?.[0] || 'US',
            regulatoryLevel: asset.compliance_level || 'standard',
            specialistType: asset.intake_context?.specialistType,
            specialistDisplayName: asset.intake_context?.specialistDisplayName,
            brandId: asset.brand_id
          }
        }
      });

      if (error) throw error;

      if (data?.success) {
        setPreview(data);
        
        // Set intelligence usage data if available
        if (data.intelligenceReport?.intelligenceUsed) {
          setIntelligenceUsed(data.intelligenceReport.intelligenceUsed);
        }
        
        onComposed(data);
        
        const citationsIncluded = data.intelligenceReport?.citationsIncluded || 0;
        const visualAssetsIncluded = data.intelligenceReport?.visualAssetsIncluded || 0;
        
        toast({
          title: "Email Composed Successfully",
          description: `Quality Score: ${data.intelligenceReport.qualityScore}/100 窶｢ ${citationsIncluded} citations 窶｢ ${visualAssetsIncluded} visual assets`,
        });
      } else {
        throw new Error(data?.error || 'Composition failed');
      }
    } catch (error) {
      console.error('Composition error:', error);
      toast({
        title: "Composition Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setComposing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Enhanced Email Composer
          </CardTitle>
          {intelligenceUsed.length > 0 && (
            <IntelligenceSummaryBadge 
              totalReferences={intelligenceUsed.length}
              activeLayersCount={new Set(intelligenceUsed.map(i => i.type)).size}
              qualityScore={preview?.intelligenceReport?.qualityScore}
              categoryBreakdown={{
                evidence: intelligenceUsed.filter(i => i.type === 'evidence').length,
                audience: intelligenceUsed.filter(i => i.type === 'audience').length,
                brand: intelligenceUsed.filter(i => i.type === 'brand').length,
                performance: intelligenceUsed.filter(i => i.type === 'performance').length,
                competitive: intelligenceUsed.filter(i => i.type === 'competitive').length,
              }}
            />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Generate rich emails with AI-enhanced content, charts, and tables powered by unified intelligence
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Button
            onClick={handleCompose}
            disabled={composing || !extractTextContent(asset, currentContent).subject}
            className="flex-1"
            size="lg"
          >
            {composing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Visualizations...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Add Visualizations & Charts
              </>
            )}
          </Button>

          {(asset.linked_pi_ids || []).length > 0 && (
            <Button
              onClick={handleValidateContent}
              disabled={validating || !preview}
              variant="outline"
              size="lg"
            >
              {validating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Validate Against PI
                </>
              )}
            </Button>
          )}
        </div>

        {/* Intelligence Usage Tracking - Single Unified Card */}
        {(intelligenceUsed.length > 0 || composing) && (
          <UnifiedIntelligenceCard 
            intelligenceUsed={intelligenceUsed}
            qualityScore={preview?.intelligenceReport?.qualityScore}
            isGenerating={composing}
          />
        )}

        {/* Validation Results */}
        {validationResult && (
          <PIValidationResults 
            result={validationResult}
            piDocuments={asset.linked_pi_ids?.map((id) => ({
              drug_name: 'PI Document',
              version: 'Current'
            }))}
          />
        )}

        {/* Preview */}
        <div className="space-y-4 mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">
              {preview ? 'Multi-Modal Email Preview' : 'Current Content Preview'}
            </h4>
            <div className="flex items-center gap-2">
              {preview && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFullPreview(true)}
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Full Preview
                </Button>
              )}
              {preview?.metadata && (
                <div className="flex items-center gap-2 text-xs">
                  {preview.metadata.databaseVisualsCount > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <Table2 className="w-3 h-3" />
                      {preview.metadata.databaseVisualsCount} tables
                    </Badge>
                  )}
                  {preview.metadata.visualizationCount > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <BarChart3 className="w-3 h-3" />
                      {preview.metadata.visualizationCount} charts
                    </Badge>
                  )}
                  {preview.metadata.hasCitations && (
                    <Badge variant="outline" className="gap-1">
                      <Shield className="w-3 h-3" />
                      Citations
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden bg-background">
            <iframe 
              srcDoc={preview ? preview.emailHTML : generateBasicPreview()}
              className="w-full h-[700px]"
              title="Email Preview"
              style={{ background: '#f4f4f4' }}
            />
          </div>

          {!preview && (
            <p className="text-sm text-muted-foreground text-center">
              This is your current content. Click "Add Visualizations & Charts" to generate an enhanced version with rendered tables, charts, and citations.
            </p>
          )}
        </div>
      </CardContent>

      {/* Full Screen Preview Dialog */}
      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0 flex flex-col">
          <DialogHeader className="p-4 border-b flex-row items-center justify-between shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Email Preview - Full Screen
            </DialogTitle>
            <div className="flex items-center gap-3">
              {preview?.metadata && (
                <div className="flex items-center gap-2 text-xs">
                  {preview.metadata.databaseVisualsCount > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <Table2 className="w-3 h-3" />
                      {preview.metadata.databaseVisualsCount} tables
                    </Badge>
                  )}
                  {preview.metadata.visualizationCount > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <BarChart3 className="w-3 h-3" />
                      {preview.metadata.visualizationCount} charts
                    </Badge>
                  )}
                  {preview?.intelligenceReport?.qualityScore && (
                    <Badge variant="secondary" className="gap-1">
                      Score: {preview.intelligenceReport.qualityScore}/100
                    </Badge>
                  )}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-muted/50 p-4">
            <iframe 
              srcDoc={preview?.emailHTML}
              className="w-full h-full bg-background rounded-lg shadow-lg border"
              title="Full Email Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};