import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBrand } from "@/contexts/BrandContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { BrandDemoContentGenerator } from "@/utils/brandDemoContent";
import Header from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { 
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  History,
  BookOpen,
  Library,
  ShieldAlert,
  TrendingDown
} from "lucide-react";
import { AssetMetadataPanel } from "@/components/mlr/AssetMetadataPanel";
import { HighlightedContentEditor } from "@/components/mlr/HighlightedContentEditor";
import { ClaimsValidationPanel } from "@/components/mlr/ClaimsValidationPanel";
import { ReferenceValidationPanel } from "@/components/mlr/ReferenceValidationPanel";
import { RegulatoryCompliancePanel } from "@/components/mlr/RegulatoryCompliancePanel";
import { MLRMemoryPanel } from "@/components/mlr/MLRMemoryPanel";
import { SafetyRequirementsPanel } from "@/components/mlr/SafetyRequirementsPanel";
import { ApprovedContentLibraryPanel } from "@/components/mlr/ApprovedContentLibraryPanel";
import { MLRPatternsPanel } from "@/components/mlr/MLRPatternsPanel";
import { moduleBridge } from "@/services/moduleBridge";
import { supabase } from "@/integrations/supabase/client";

// Extract content string from primary_content JSONB structure
const extractContentString = (primaryContent) => {
  if (!primaryContent) return '';
  if (typeof primaryContent === 'string') return primaryContent;
  
  const parts = [];
  if (primaryContent.subject) parts.push(`Subject: ${primaryContent.subject}`);
  if (primaryContent.preheader) parts.push(`Preheader: ${primaryContent.preheader}`);
  if (primaryContent.headline) parts.push(`Headline: ${primaryContent.headline}`);
  if (primaryContent.heroHeadline) parts.push(`Hero Headline: ${primaryContent.heroHeadline}`);
  if (primaryContent.heroSubheadline) parts.push(`Hero Subheadline: ${primaryContent.heroSubheadline}`);
  if (primaryContent.keyMessage) parts.push(`Key Message: ${primaryContent.keyMessage}`);
  if (primaryContent.body) parts.push(primaryContent.body);
  if (primaryContent.bodyText) parts.push(primaryContent.bodyText);
  if (primaryContent.clinicalEvidence) parts.push(`Clinical Evidence: ${primaryContent.clinicalEvidence}`);
  if (primaryContent.safetyInformation) parts.push(`Safety Information: ${primaryContent.safetyInformation}`);
  if (primaryContent.cta) parts.push(`CTA: ${primaryContent.cta}`);
  if (primaryContent.heroCta) parts.push(`Hero CTA: ${primaryContent.heroCta}`);
  if (primaryContent.disclaimer) parts.push(`Disclaimer: ${primaryContent.disclaimer}`);
  
  return parts.join('\n\n');
};

const PreMLRCompanion = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectedBrand } = useBrand();
  const { state: globalState, actions: globalActions } = useGlobalContext();
  
  const [contentAsset, setContentAsset] = useState(null);
  const [assetContext, setAssetContext] = useState(null);
  const [validationSummary, setValidationSummary] = useState({
    claims: { valid: 0, warnings: 0, failures: 0 },
    references: { valid: 0, missing: 0 },
    regulatory: { passed: 0, failed: 0 },
    mlrMemory: { suggestions: 0, acknowledged: 0 },
    safety: { required: 0, present: 0, missing: 0 }
  });
  const [cachedResults, setCachedResults] = useState({
    claims: null,
    references: null,
    regulatory: null,
    mlrMemory: null,
    lastAnalyzed: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeValidationPanel, setActiveValidationPanel] = useState('claims');

  useEffect(() => {
    initializeMLRSession();
  }, [searchParams, selectedBrand]);

  const initializeMLRSession = async () => {
    setIsLoading(true);
    
    try {
      const contentStudioContext = moduleBridge.getModuleContext('content-studio');
      const strategyContext = moduleBridge.getModuleContext('strategy-insights');
      const initiativeContext = moduleBridge.getModuleContext('initiative-hub');
      
      const assetId = searchParams.get('assetId');
      
      // Priority 1: Use moduleBridge context if asset matches
      if (assetId && contentStudioContext?.selectedAsset?.id === assetId) {
        console.log('📚 Loading asset from moduleBridge context:', assetId);
        setContentAsset(contentStudioContext.selectedAsset);
        const contextData = {
          ...contentStudioContext,
          strategyThemes: strategyContext?.themes || [],
          campaignObjectives: initiativeContext?.objectives || [],
          brandId: contentStudioContext.selectedAsset?.brand_id || selectedBrand?.id || null,
          therapeuticArea: contentStudioContext.selectedAsset?.metadata?.therapeutic_area
        };
        setAssetContext(contextData);
        globalThis.mlrDemoContext = contextData;
      } 
      // Priority 2: Fetch from database if assetId provided
      else if (assetId) {
        console.log('📚 Fetching asset from database:', assetId);
        const { data: asset, error } = await supabase
          .from('content_assets')
          .select('*')
          .eq('id', assetId)
          .single();
        
        if (asset && !error) {
          // Transform database asset to expected MLR format
          const contentAsset = {
            id: asset.id,
            title: asset.asset_name,
            type: asset.asset_type,
            content: extractContentString(asset.primary_content),
            status: asset.status,
            metadata: asset.metadata,
            claims_used: asset.claims_used,
            references_used: asset.references_used,
            target_audience: asset.target_audience,
            primary_content: asset.primary_content,
            brand_id: asset.brand_id
          };
          
          setContentAsset(contentAsset);
          setAssetContext({
            brandId: asset.brand_id,
            therapeuticArea: asset.metadata?.therapeutic_area,
            assetType: asset.asset_type,
            targetAudience: asset.target_audience
          });
          
          console.log('✅ Asset loaded from database successfully');
        } else {
          console.error('❌ Failed to load asset from database:', error);
          initializeDemoContent();
        }
      }
      // Priority 3: Demo content fallback
      else {
        initializeDemoContent();
      }
      
    } catch (error) {
      console.error('Failed to initialize MLR session:', error);
      initializeDemoContent();
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDemoContent = () => {
    const demoContext = BrandDemoContentGenerator.generateBrandDemoContent(selectedBrand);
    setContentAsset(demoContext.selectedAsset);
    setAssetContext(demoContext);
    globalThis.mlrDemoContext = demoContext;
  };

  const handleValidationUpdate = (panelType, summary) => {
    setValidationSummary(prev => ({
      ...prev,
      [panelType]: summary
    }));
  };

  const getTotalIssues = () => {
    return validationSummary.claims.warnings + 
           validationSummary.claims.failures + 
           validationSummary.references.missing + 
           validationSummary.regulatory.failed +
           validationSummary.safety.missing;
  };

  const getMLRReadinessScore = () => {
    const total = validationSummary.claims.valid + 
                  validationSummary.references.valid + 
                  validationSummary.regulatory.passed +
                  validationSummary.safety.present;
    const issues = getTotalIssues();
    return Math.max(0, Math.round((total / (total + issues + 1)) * 100)) || 0;
  };

  const panelConfig = [
    { id: 'claims', label: 'Claims', icon: FileText, badge: validationSummary.claims.failures },
    { id: 'references', label: 'References', icon: BookOpen, badge: validationSummary.references.missing },
    { id: 'safety', label: 'Safety', icon: ShieldAlert, badge: validationSummary.safety.missing },
    { id: 'patterns', label: 'Patterns', icon: TrendingDown, badge: null },
    { id: 'regulatory', label: 'Regulatory', icon: Shield, badge: validationSummary.regulatory.failed },
    { id: 'mlr-memory', label: 'Memory', icon: History, badge: validationSummary.mlrMemory.suggestions },
    { id: 'library', label: 'Library', icon: Library, badge: null },
  ];

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-lg font-medium">Initializing MLR Companion...</p>
            <p className="text-muted-foreground">Loading content analysis tools</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      
      {/* Action Bar */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {contentAsset?.title || 'Content Analysis & Validation'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pre-regulatory review and compliance validation
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={getTotalIssues() > 0 ? "destructive" : "secondary"}>
                {getTotalIssues()} Issues Found
              </Badge>
              <Badge variant={getMLRReadinessScore() >= 80 ? "default" : "secondary"}>
                {getMLRReadinessScore()}% MLR Ready
              </Badge>
            </div>
            <Button>
              Submit for Review
            </Button>
          </div>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Asset Context */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full border-r">
              <AssetMetadataPanel 
                asset={contentAsset}
                context={assetContext}
                brandId={selectedBrand?.id}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Central Panel - Content Editor */}
          <ResizablePanel defaultSize={45} minSize={35}>
            <div className="h-full flex flex-col">
              <HighlightedContentEditor
                asset={contentAsset}
                onContentChange={setContentAsset}
                validationHighlights={[]}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Right Panel - Validation Sections */}
          <ResizablePanel defaultSize={35} minSize={25} maxSize={45}>
            <div className="h-full border-l flex flex-col">
              {/* Enhanced Panel Tabs */}
              <div className="border-b p-2">
                <div className="flex flex-wrap gap-1">
                  {panelConfig.map((panel) => (
                    <Button
                      key={panel.id}
                      size="sm"
                      variant={activeValidationPanel === panel.id ? 'default' : 'ghost'}
                      onClick={() => setActiveValidationPanel(panel.id)}
                      className="justify-start text-xs relative"
                    >
                      <panel.icon className="h-3 w-3 mr-1" />
                      {panel.label}
                      {panel.badge !== null && panel.badge > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                          {panel.badge}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Active Validation Panel */}
              <div className="flex-1 overflow-hidden">
                {activeValidationPanel === 'claims' && (
                  <ClaimsValidationPanel 
                    content={contentAsset?.content || ''}
                    brandGuidelines={assetContext?.brandGuidelines}
                    context={assetContext}
                    selectedBrand={selectedBrand}
                    onValidationUpdate={(summary) => handleValidationUpdate('claims', summary)}
                  />
                )}
                
                {activeValidationPanel === 'references' && (
                  <ReferenceValidationPanel 
                    content={contentAsset?.content || ''}
                    onValidationUpdate={(summary) => handleValidationUpdate('references', summary)}
                  />
                )}

                {activeValidationPanel === 'safety' && (
                  <SafetyRequirementsPanel 
                    content={contentAsset?.content || ''}
                    assetType={contentAsset?.type}
                    onValidationUpdate={(summary) => handleValidationUpdate('safety', summary)}
                  />
                )}

                {activeValidationPanel === 'patterns' && (
                  <MLRPatternsPanel 
                    content={contentAsset?.content || ''}
                  />
                )}
                
                {activeValidationPanel === 'regulatory' && (
                  <RegulatoryCompliancePanel 
                    content={contentAsset?.content || ''}
                    assetType={contentAsset?.type}
                    region={assetContext?.marketRegion}
                    brandProfile={selectedBrand}
                    therapeuticArea={assetContext?.therapeuticArea}
                    onValidationUpdate={(summary) => handleValidationUpdate('regulatory', summary)}
                  />
                )}
                
                {activeValidationPanel === 'mlr-memory' && (
                  <MLRMemoryPanel 
                    assetId={contentAsset?.id}
                    brandId={selectedBrand?.id}
                    brandProfile={selectedBrand}
                    assetContext={assetContext}
                    onValidationUpdate={(summary) => handleValidationUpdate('mlrMemory', summary)}
                  />
                )}

                {activeValidationPanel === 'library' && (
                  <ApprovedContentLibraryPanel />
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default PreMLRCompanion;