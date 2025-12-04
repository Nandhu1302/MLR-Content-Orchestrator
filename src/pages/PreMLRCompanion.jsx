import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBrand } from "@/contexts/BrandContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { BrandDemoContentGenerator } from "@/utils/brandDemoContent";
import Header from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { 
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Lightbulb,
  History,
  BookOpen
} from "lucide-react";
import { AssetMetadataPanel } from "@/components/mlr/AssetMetadataPanel";
import { HighlightedContentEditor } from "@/components/mlr/HighlightedContentEditor";
import { ClaimsValidationPanel } from "@/components/mlr/ClaimsValidationPanel";
import { ReferenceValidationPanel } from "@/components/mlr/ReferenceValidationPanel";
import { RegulatoryCompliancePanel } from "@/components/mlr/RegulatoryCompliancePanel";
import { MLRMemoryPanel } from "@/components/mlr/MLRMemoryPanel";
import { moduleBridge } from "@/services/moduleBridge";

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
    mlrMemory: { suggestions: 0, acknowledged: 0 }
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
      // Get context from previous modules via moduleBridge
      const contentStudioContext = moduleBridge.getModuleContext('content-studio');
      const strategyContext = moduleBridge.getModuleContext('strategy-insights');
      const initiativeContext = moduleBridge.getModuleContext('initiative-hub');
      
      // Check for specific asset ID from URL params
      const assetId = searchParams.get('assetId');
      
      if (assetId && contentStudioContext?.selectedAsset?.id === assetId) {
        setContentAsset(contentStudioContext.selectedAsset);
        const contextData = {
          ...contentStudioContext,
          strategyThemes: strategyContext?.themes || [],
          campaignObjectives: initiativeContext?.objectives || [],
          brandId: selectedBrand?.id || null
        };
        setAssetContext(contextData);
        
        // Make context available globally for validation panels
        globalThis.mlrDemoContext = contextData;
      } else {
        // Initialize with demo content for development
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
    
    // Make context available globally for validation panels
    globalThis.mlrDemoContext = demoContext;
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleValidationUpdate = (panelType, summary) => {
    setValidationSummary(prev => ({
      ...prev,
      [panelType]: summary
    }));
  };

  const handleResultsCache = (panelType, results) => {
    setCachedResults(prev => ({
      ...prev,
      [panelType]: results,
      lastAnalyzed: {
        ...prev.lastAnalyzed,
        [panelType]: Date.now()
      }
    }));
  };

  const getTimeSinceAnalysis = (panelType) => {
    const timestamp = cachedResults.lastAnalyzed[panelType];
    if (!timestamp) return null;
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  const getTotalIssues = () => {
    return validationSummary.claims.warnings + 
           validationSummary.claims.failures + 
           validationSummary.references.missing + 
           validationSummary.regulatory.failed;
  };

  const getMLRReadinessScore = () => {
    const total = validationSummary.claims.valid + 
                  validationSummary.references.valid + 
                  validationSummary.regulatory.passed;
    const issues = getTotalIssues();
    return Math.max(0, Math.round((total / (total + issues)) * 100)) || 0;
  };

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
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full border-r">
              <AssetMetadataPanel 
                asset={contentAsset}
                context={assetContext}
                brandId={selectedBrand?.id}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Central Panel - Content Editor with Highlighting */}
          <ResizablePanel defaultSize={50} minSize={35}>
            <div className="h-full flex flex-col">
              <HighlightedContentEditor
                asset={contentAsset}
                onContentChange={setContentAsset}
                validationHighlights={[]} // Will be populated by validation panels
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Right Panel - Validation Sections */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full border-l flex flex-col">
              {/* Validation Panel Tabs */}
              <div className="border-b p-2">
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    size="sm"
                    variant={activeValidationPanel === 'claims' ? 'default' : 'ghost'}
                    onClick={() => setActiveValidationPanel('claims')}
                    className="justify-start"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Claims
                  </Button>
                  <Button
                    size="sm"
                    variant={activeValidationPanel === 'references' ? 'default' : 'ghost'}
                    onClick={() => setActiveValidationPanel('references')}
                    className="justify-start"
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    References
                  </Button>
                  <Button
                    size="sm"
                    variant={activeValidationPanel === 'regulatory' ? 'default' : 'ghost'}
                    onClick={() => setActiveValidationPanel('regulatory')}
                    className="justify-start"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Regulatory
                  </Button>
                  <Button
                    size="sm"
                    variant={activeValidationPanel === 'mlr-memory' ? 'default' : 'ghost'}
                    onClick={() => setActiveValidationPanel('mlr-memory')}
                    className="justify-start"
                  >
                    <History className="h-3 w-3 mr-1" />
                    MLR Memory
                  </Button>
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
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default PreMLRCompanion;