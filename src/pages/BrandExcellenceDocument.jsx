import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Home, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MermaidDiagram } from "@/components/diagrams/MermaidDiagram";
import { DiagramLegend } from "@/components/DiagramLegend";
import { ExecutiveOverview } from "@/components/brand-excellence/ExecutiveOverview";
import { UCBImpactAnalysis } from "@/components/brand-excellence/UCBImpactAnalysis";
import { PillarDefinitions } from "@/components/brand-excellence/PillarDefinitions";
import { ExecutiveDashboard } from "@/components/brand-excellence/ExecutiveDashboard";
import { EndToEndWorkflow } from "@/components/brand-excellence/EndToEndWorkflow";
import { CompetitiveDifferentiation } from "@/components/brand-excellence/CompetitiveDifferentiation";
import { ROIBusinessCase } from "@/components/brand-excellence/ROIBusinessCase";
import { ImplementationRoadmap } from "@/components/brand-excellence/ImplementationRoadmap";
import { PillarComparisonTable } from "@/components/brand-excellence/PillarComparisonTable";
import { generateBrandExcellencePlatformDocument } from "@/utils/brandExcellencePlatformExport";
import { toast } from "sonner";

const BrandExcellenceDocument = () => {
  const navigate = useNavigate();
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleExport = () => {
    window.print();
  };

  const handleDownloadWord = async () => {
    setIsGenerating(true);
    try {
      await generateBrandExcellencePlatformDocument();
      toast.success("Brand Excellence Platform document downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download document");
      console.error("Download error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const TechnicalSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    if (!showTechnicalDetails) {
      return null;
    }
    
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="bg-muted/30 p-4 rounded-lg space-y-3">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-semibold text-foreground">{title}</h4>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb and Navigation */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/business-hub')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Business Hub
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="w-4 h-4" />
              <span>/</span>
              <button
                onClick={() => navigate('/business-hub')}
                className="hover:text-foreground transition-colors"
              >
                Business Hub
              </button>
              <span>/</span>
              <span className="text-foreground font-medium">Brand Excellence Platform</span>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg border">
              <div className="flex items-center gap-2">
                {showTechnicalDetails ? (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
                <Label htmlFor="technical-toggle" className="text-sm font-medium cursor-pointer">
                  {showTechnicalDetails ? "Technical View" : "Business View"}
                </Label>
              </div>
              <Switch
                id="technical-toggle"
                checked={showTechnicalDetails}
                onCheckedChange={setShowTechnicalDetails}
              />
            </div>
          </div>
        </div>
        
        {/* Info Banner */}
        {!showTechnicalDetails && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">Business View Active:</span> Technical details, JSON examples, and code snippets are hidden. 
              Toggle to "Technical View" to see AI model specifications and implementation details.
            </p>
          </div>
        )}

        {showTechnicalDetails && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <span className="font-semibold">Technical View Active:</span> Click section headers to expand/collapse detailed AI prompts and JSON output examples. 
              Switch to "Business View" for client-ready presentation.
            </p>
          </div>
        )}
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Brand Excellence Platform
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-Powered Pharmaceutical Marketing Intelligence Framework
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              UCB RFI Response - Service Offering
            </p>
          </div>
          <Button onClick={handleDownloadWord} disabled={isGenerating} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            {isGenerating ? "Generating..." : "Download Word"}
          </Button>
        </div>

        <Separator />

        {/* Executive Dashboard */}
        <ExecutiveDashboard />
        
        {/* Executive Overview with Problem-Solution-Value */}
        <ExecutiveOverview />
        
        {/* UCB Impact Analysis */}
        <UCBImpactAnalysis />
        
        {/* Pillar Definitions */}
        <PillarDefinitions />
        
        {/* Pillar Comparison Table */}
        <PillarComparisonTable />
        
        {/* End-to-End Workflow */}
        <EndToEndWorkflow />
        
        {/* Competitive Differentiation */}
        <CompetitiveDifferentiation />
        
        {/* ROI and Business Case */}
        <ROIBusinessCase />
        
        {/* Implementation Roadmap */}
        <ImplementationRoadmap />

        {/* Three Pillars Detailed Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Platform Architecture: Three Pillars (Detailed)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Pillar 1: Strategic Content Intelligence Hub */}
            <div className="space-y-4 border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold text-foreground">
                Pillar 1: Strategic Content Intelligence Hub
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Core Functions Breakdown:</h4>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li><span className="font-semibold">• Theme Intelligence Analyzer:</span> Multi-source data ingestion from Content Management Platform (Veeva Vault), Market Intelligence Platform (IQVIA), and Social Listening Tools (Brandwatch, Talkwalker). Identifies white space opportunities and generates strategic themes with confidence scores.</li>
                    <li><span className="font-semibold">• Brand Guardrails Enforcer:</span> Living brand guardrail system that learns from approved content, enforces tone/voice/messaging consistency, and provides real-time brand compliance scoring.</li>
                    <li><span className="font-semibold">• Competitive Intelligence Processor:</span> Competitor tracking, messaging gap analysis, and positioning opportunity identification.</li>
                    <li><span className="font-semibold">• Market Dynamics Monitor:</span> Real-time market shift detection, patient journey insights, and HCP sentiment analysis.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Input Sources:</h4>
                  <p className="text-sm text-muted-foreground">
                    Content Management Platform (Veeva Vault) content library, Market Intelligence Platform (IQVIA) analytics, Social Listening Platforms (Brandwatch, Talkwalker), competitive asset tracking systems, brand guidelines repository.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Output Deliverables:</h4>
                  <p className="text-sm text-muted-foreground">
                    Strategic theme library with confidence scores, brand guardrail compliance dashboards, competitive positioning maps, market opportunity briefs.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Value Proposition:</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Transforms reactive content creation into proactive, intelligence-driven brand stewardship.
                  </p>
                </div>
              </div>
              
              {showTechnicalDetails && (
                <div className="mt-4 p-4 bg-muted/20 rounded-lg border border-primary/20">
                  <p className="text-sm font-semibold text-primary mb-2">AI Engine Configuration:</p>
                  <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
                    <li><span className="font-mono text-xs">theme-intelligence-analyzer</span> - Enterprise AI Engine (Google Gemini 2.5 Flash)</li>
                    <li><span className="font-mono text-xs">brand-guardrails-analyzer</span> - Enterprise AI Engine (Google Gemini 2.5 Flash)</li>
                    <li><span className="font-mono text-xs">competitive-intelligence-processor</span> - Enterprise AI Engine (Google Gemini 2.5 Pro)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Pillar 2: PreMLR Compliance Companion */}
            <div className="space-y-4 border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-foreground">
                Pillar 2: PreMLR Compliance Companion
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Core Functions Breakdown:</h4>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li><span className="font-semibold">• Regulatory Compliance Analyzer:</span> 50+ market regulatory framework validation, claim substantiation checking, fair balance analysis across FDA, EMA, PMDA, and other regulatory bodies.</li>
                    <li><span className="font-semibold">• MLR Memory Predictor:</span> Historical MLR decision pattern analysis, reviewer preference learning, and approval probability scoring.</li>
                    <li><span className="font-semibold">• Medical Accuracy Validator:</span> Medical Terminology Database (MedDRA/ICD-10) validation, clinical study data verification, and reference citation checking.</li>
                    <li><span className="font-semibold">• Pre-Approved Language Recommender:</span> Alternative language suggestions from approved content library with compliance-optimized phrasing.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Input Sources:</h4>
                  <p className="text-sm text-muted-foreground">
                    Historical MLR review data, regulatory frameworks (FDA, EMA, PMDA, Health Canada, TGA), approved content repository, clinical study databases, Medical Terminology Databases (MedDRA, SNOMED CT).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Output Deliverables:</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time compliance scoring (0-100), issue prioritization with remediation suggestions, approval probability predictions, pre-approved language alternatives.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Value Proposition:</h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Converts MLR bottleneck into content accelerator through predictive compliance intelligence.
                  </p>
                </div>
              </div>
              
              {showTechnicalDetails && (
                <div className="mt-4 p-4 bg-muted/20 rounded-lg border border-primary/20">
                  <p className="text-sm font-semibold text-primary mb-2">AI Engine Configuration:</p>
                  <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
                    <li><span className="font-mono text-xs">analyze-regulatory</span> - Enterprise AI Engine (Google Gemini 2.5 Flash)</li>
                    <li><span className="font-mono text-xs">mlr-memory-predictor</span> - Enterprise AI Engine (Google Gemini 2.5 Pro)</li>
                    <li><span className="font-mono text-xs">medical-accuracy-validator</span> - Enterprise AI Engine (Google Gemini 2.5 Flash)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Pillar 3: Global-Local Orchestration Engine */}
            <div className="space-y-4 border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold text-foreground">
                Pillar 3: Global-Local Orchestration Engine
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Core Functions Breakdown:</h4>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li><span className="font-semibold">• TM-Leveraged Medical Translator:</span> Translation Memory Integration (SDL Trados, MemoQ) with 100% match prioritization, Medical Terminology Database (MedDRA, SNOMED) enforcement, and context-aware translation.</li>
                    <li><span className="font-semibold">• Cultural Intelligence Analyzer:</span> Cultural Framework Analysis (Hofstede dimensions), market-specific visual symbolism assessment, and healthcare system context adaptation.</li>
                    <li><span className="font-semibold">• Market Regulatory Mapper:</span> Local regulatory requirement validation across 50+ markets, market-specific claim adaptation, and visual standards compliance.</li>
                    <li><span className="font-semibold">• Master Asset Contextualizer:</span> Global master asset interrogation, local context injection, and cultural adaptation recommendations.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Input Sources:</h4>
                  <p className="text-sm text-muted-foreground">
                    Translation Memory Systems (SDL Trados, MemoQ), Medical Terminology Databases (MedDRA, SNOMED CT, ICD-10), Cultural Intelligence Frameworks (Hofstede, GLOBE), market regulatory databases, global content library.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Output Deliverables:</h4>
                  <p className="text-sm text-muted-foreground">
                    Culturally-adapted translated content with medical accuracy, market-specific compliance reports, visual adaptation recommendations, localization quality scores.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Value Proposition:</h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    Delivers culturally-resonant content that maintains brand consistency and regulatory compliance across 50+ markets.
                  </p>
                </div>
              </div>
              
              {showTechnicalDetails && (
                <div className="mt-4 p-4 bg-muted/20 rounded-lg border border-primary/20">
                  <p className="text-sm font-semibold text-primary mb-2">AI Engine Configuration:</p>
                  <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
                    <li><span className="font-mono text-xs">glocal-ai-translate</span> - Enterprise AI Engine (Google Gemini 2.5 Flash)</li>
                    <li><span className="font-mono text-xs">cultural-intelligence-analyzer</span> - Enterprise AI Engine (Google Gemini 2.5 Pro)</li>
                    <li><span className="font-mono text-xs">market-regulatory-mapper</span> - Enterprise AI Engine (Google Gemini 2.5 Flash)</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Architecture Diagrams Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Platform Architecture Diagrams</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Multi-audience visual representations of the Brand Excellence Platform architecture, from high-level system context to detailed deployment infrastructure.
            </p>
          </CardHeader>
          <CardContent className="space-y-10">
            
            {/* Diagram 1: System Context (C4 Level 1) */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">1. System Context Diagram</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold">Audience:</span> Everyone (especially non-technical stakeholders, executives, business analysts)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Purpose:</span> Shows what the Brand Excellence Platform is and which external actors and systems it interacts with.
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/20 p-6 rounded-lg border overflow-auto">
                <MermaidDiagram
                  id="system-context-diagram"
                  name="System Context Diagram"
                  enableExport={true}
                  definition={`graph TB
    subgraph External_Actors["External Users"]
        MarketingTeams["Marketing Teams"]
        MLRReviewers["MLR Reviewers"]
        ComplianceOfficers["Compliance Officers"]
        TranslationAgencies["Translation Partners"]
    end
    
    subgraph Brand_Platform["Brand Excellence Platform"]
        Core["Unified AI-Powered<br/>Marketing Intelligence System"]
    end
    
    subgraph External_Systems["External Systems"]
        VeevaVault["Content Management Platform<br/>(Veeva Vault)"]
        IQVIA["Market Intelligence Platform<br/>(IQVIA)"]
        SocialListening["Social Listening Tools<br/>(Brandwatch, Talkwalker)"]
        RegulatoryDBs["Regulatory Databases<br/>(FDA, EMA, PMDA)"]
        TranslationMemory["Translation Memory Systems<br/>(SDL Trados, MemoQ)"]
    end
    
    MarketingTeams -->|"Submit Content<br/>Request Themes"| Core
    MLRReviewers -->|"Review Content<br/>Provide Feedback"| Core
    ComplianceOfficers -->|"Monitor Compliance<br/>Set Policies"| Core
    TranslationAgencies -->|"Access TM<br/>Submit Translations"| Core
    
    Core -->|"Retrieve Assets<br/>Store Content"| VeevaVault
    Core -->|"Fetch Market Data<br/>Analytics"| IQVIA
    Core -->|"Monitor Sentiment<br/>Competitive Intel"| SocialListening
    Core -->|"Validate Compliance<br/>Check Regulations"| RegulatoryDBs
    Core -->|"Leverage TM<br/>Medical Terminology"| TranslationMemory
    
    Core -->|"Compliance Reports<br/>Optimized Content"| MarketingTeams
    Core -->|"Pre-Validated Content<br/>Risk Assessment"| MLRReviewers
    
    classDef userStyle fill:#E3F2FD,stroke:#1976D2,stroke-width:2px,color:#000
    classDef platformStyle fill:#1976D2,stroke:#0D47A1,stroke-width:3px,color:#fff
    classDef systemStyle fill:#B2DFDB,stroke:#00796B,stroke-width:2px,color:#000
    
    class MarketingTeams,MLRReviewers,ComplianceOfficers,TranslationAgencies userStyle
    class Core platformStyle
    class VeevaVault,IQVIA,SocialListening,RegulatoryDBs,TranslationMemory systemStyle`}
                />
                <DiagramLegend type="c4-context" />
              </div>
              
              <p className="text-sm text-muted-foreground italic">
                <span className="font-semibold">Key Insight:</span> The platform acts as a central intelligence hub, connecting marketing teams with enterprise systems and regulatory data sources to enable intelligent, compliant content creation.
              </p>
            </div>

            <Separator />

            {/* Diagram 2: Component Diagram (C4 Level 2) */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">2. Component Diagram</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold">Audience:</span> Developers, Solution Architects, Technical Product Managers
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Purpose:</span> Shows the main internal building blocks and how they connect within the platform.
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/20 p-6 rounded-lg border overflow-auto">
                <MermaidDiagram
                  id="component-diagram"
                  name="Component Architecture Diagram"
                  enableExport={true}
                  definition={`graph TB
    subgraph Pillar1["Strategic Intelligence Hub"]
        ThemeAnalyzer["Theme Intelligence<br/>Analyzer"]
        BrandGuardrails["Brand Guardrails<br/>Enforcer"]
        CompetitiveIntel["Competitive Intelligence<br/>Processor"]
    end
    
    subgraph Pillar2["PreMLR Compliance Companion"]
        RegulatoryValidator["Regulatory Compliance<br/>Analyzer"]
        MLRMemory["MLR Memory<br/>Predictor"]
        MedicalAccuracy["Medical Accuracy<br/>Validator"]
    end
    
    subgraph Pillar3["Global-Local Orchestration"]
        TMTranslation["TM-Leveraged<br/>Translation Engine"]
        CulturalIntel["Cultural Intelligence<br/>Analyzer"]
        MarketMapper["Market Regulatory<br/>Mapper"]
    end
    
    subgraph DataLayer["Data Layer"]
        RelationalDB["Relational Database<br/>(PostgreSQL)"]
        VectorDB["Vector Database<br/>(pgvector extension)"]
        CacheLayer["Distributed Cache<br/>(Redis)"]
    end
    
    subgraph AILayer["AI Processing Layer"]
        AIGateway["Multi-Model AI Gateway"]
        StandardTier["Standard Tier<br/>(Gemini 2.5 Flash)"]
        AdvancedTier["Advanced Tier<br/>(Gemini 2.5 Pro)"]
    end
    
    ThemeAnalyzer --> AIGateway
    BrandGuardrails --> AIGateway
    CompetitiveIntel --> AIGateway
    RegulatoryValidator --> AIGateway
    MLRMemory --> AIGateway
    MedicalAccuracy --> AIGateway
    TMTranslation --> AIGateway
    CulturalIntel --> AIGateway
    MarketMapper --> AIGateway
    
    AIGateway --> StandardTier
    AIGateway --> AdvancedTier
    
    ThemeAnalyzer --> VectorDB
    BrandGuardrails --> RelationalDB
    RegulatoryValidator --> RelationalDB
    MLRMemory --> VectorDB
    TMTranslation --> CacheLayer
    
    classDef pillar1Style fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#000
    classDef pillar2Style fill:#E1F5FE,stroke:#0277BD,stroke-width:2px,color:#000
    classDef pillar3Style fill:#F3E5F5,stroke:#6A1B9A,stroke-width:2px,color:#000
    classDef dataStyle fill:#ECEFF1,stroke:#455A64,stroke-width:2px,color:#000
    classDef aiStyle fill:#FFF3E0,stroke:#E65100,stroke-width:2px,color:#000
    
    class ThemeAnalyzer,BrandGuardrails,CompetitiveIntel pillar1Style
    class RegulatoryValidator,MLRMemory,MedicalAccuracy pillar2Style
    class TMTranslation,CulturalIntel,MarketMapper pillar3Style
    class RelationalDB,VectorDB,CacheLayer dataStyle
    class AIGateway,StandardTier,AdvancedTier aiStyle`}
                />
                <DiagramLegend type="c4-component" />
              </div>
              
              <p className="text-sm text-muted-foreground italic">
                <span className="font-semibold">Key Insight:</span> Three specialized pillars share a common AI processing layer and data infrastructure, enabling cross-pillar intelligence and continuous learning.
              </p>
            </div>

            <Separator />

            {/* Diagram 3: Sequence Diagram */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">3. Sequence Diagram: Content Submission with MLR Pre-Validation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold">Audience:</span> Developers, QA Testers, Business Analysts
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Purpose:</span> Shows the step-by-step interaction flow for submitting content with automated compliance pre-validation.
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/20 p-6 rounded-lg border overflow-auto">
                <MermaidDiagram
                  id="sequence-diagram"
                  name="Content Validation Sequence Diagram"
                  enableExport={true}
                  definition={`sequenceDiagram
    actor MM as Marketing Manager
    participant Platform as Brand Excellence Platform
    participant IntelHub as Strategic Intelligence Hub
    participant ComplianceEngine as PreMLR Compliance Companion
    participant AIEngine as Enterprise AI Engine
    participant MLR as MLR Reviewer

    MM->>Platform: Upload promotional content
    activate Platform
    
    Platform->>IntelHub: Trigger theme consistency check
    activate IntelHub
    IntelHub->>AIEngine: Analyze brand alignment
    activate AIEngine
    AIEngine-->>IntelHub: Brand consistency score: 92%
    deactivate AIEngine
    IntelHub-->>Platform: Theme validated
    deactivate IntelHub
    
    Platform->>ComplianceEngine: Trigger regulatory pre-validation
    activate ComplianceEngine
    ComplianceEngine->>AIEngine: Validate compliance
    activate AIEngine
    AIEngine-->>ComplianceEngine: Compliance score: 85%, 3 issues
    deactivate AIEngine
    
    ComplianceEngine->>AIEngine: Generate pre-approved alternatives
    activate AIEngine
    AIEngine-->>ComplianceEngine: 5 alternative phrasings suggested
    deactivate AIEngine
    
    ComplianceEngine-->>Platform: Compliance report and recommendations
    deactivate ComplianceEngine
    
    Platform-->>MM: Display compliance insights
    deactivate Platform
    
    MM->>Platform: Accept AI recommendations
    activate Platform
    Platform->>Platform: Optimize content
    Platform->>MLR: Submit pre-validated content
    deactivate Platform
    
    MLR-->>MM: Expedited review (40% faster)
    
    Note over MM,MLR: Pre-validation reduces MLR cycles by 40%`}
                />
                <DiagramLegend type="sequence-translation" />
              </div>
              
              <p className="text-sm text-muted-foreground italic">
                <span className="font-semibold">Key Insight:</span> Automated pre-validation identifies and resolves compliance issues before MLR submission, significantly reducing review cycles and rework.
              </p>
            </div>

            <Separator />

            {/* Diagram 4: Activity Diagram */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">4. Activity Diagram: End-to-End Content Production Workflow</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold">Audience:</span> Business Analysts, Process Owners, Marketing Operations
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Purpose:</span> Shows the complete business process flow with decision points and parallel workflows.
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/20 p-6 rounded-lg border overflow-auto">
                <MermaidDiagram
                  id="activity-diagram"
                  name="Business Process Activity Diagram"
                  enableExport={true}
                  definition={`flowchart TD
    Start([Campaign Initiation]) --> CheckTheme{Strategic Theme Available?}
    
    CheckTheme -->|Yes| UseTheme[Use Existing Strategic Theme]
    CheckTheme -->|No| GenTheme[AI Generate New Theme: Pillar 1]
    
    UseTheme --> CreateContent[Content Creation]
    GenTheme --> CreateContent
    
    CreateContent --> CheckBrand{Brand Guardrails Pass?}
    
    CheckBrand -->|Yes| ProceedCompliance[Proceed to Compliance]
    CheckBrand -->|No| BrandReco[AI Recommendations]
    
    BrandReco --> ReviseContent[Revise Content]
    ReviseContent --> CheckBrand
    
    ProceedCompliance --> ComplianceCheck[AI Compliance Pre-Check: Pillar 2]
    
    ComplianceCheck --> CheckScore{Compliance Score > 80%?}
    
    CheckScore -->|Yes| SubmitMLR[Submit to MLR]
    CheckScore -->|No| RefineCompliance[AI Refinement Engine]
    
    RefineCompliance --> ReviseCompliance[Revise for Compliance]
    ReviseCompliance --> ComplianceCheck
    
    SubmitMLR --> MLRApproval[MLR Review and Approval]
    
    MLRApproval --> CheckLocalization{Multi-Market Localization?}
    
    CheckLocalization -->|Yes| ParallelLoc[Route to Pillar 3]
    CheckLocalization -->|No| SingleDeploy[Single Market Approval]
    
    ParallelLoc --> TranslateMarket1[Market 1: Translation]
    ParallelLoc --> TranslateMarket2[Market 2: Translation]
    ParallelLoc --> TranslateMarketN[Market N: Translation]
    
    TranslateMarket1 --> LocalCompliance1[Local Regulatory Validation]
    TranslateMarket2 --> LocalCompliance2[Local Regulatory Validation]
    TranslateMarketN --> LocalComplianceN[Local Regulatory Validation]
    
    LocalCompliance1 --> MultiDeploy[Multi-Market Deployment]
    LocalCompliance2 --> MultiDeploy
    LocalComplianceN --> MultiDeploy
    
    SingleDeploy --> End([Campaign Live])
    MultiDeploy --> End
    
    classDef startEndStyle fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef decisionStyle fill:#FFA726,stroke:#E65100,stroke-width:2px,color:#fff
    classDef aiProcessStyle fill:#AB47BC,stroke:#6A1B9A,stroke-width:2px,color:#fff
    classDef processStyle fill:#42A5F5,stroke:#1565C0,stroke-width:2px,color:#fff
    
    class Start,End startEndStyle
    class CheckTheme,CheckBrand,CheckScore,CheckLocalization decisionStyle
    class GenTheme,BrandReco,ComplianceCheck,RefineCompliance,ParallelLoc,TranslateMarket1,TranslateMarket2,TranslateMarketN,LocalCompliance1,LocalCompliance2,LocalComplianceN aiProcessStyle
    class CreateContent,UseTheme,ProceedCompliance,ReviseContent,SubmitMLR,MLRApproval,ReviseCompliance,SingleDeploy,MultiDeploy processStyle`}
                />
                <DiagramLegend type="data-flow" />
              </div>
              
              <p className="text-sm text-muted-foreground italic">
                <span className="font-semibold">Key Insight:</span> Automated decision points and parallel processing for multi-market localization enable 50% faster global campaign rollout while maintaining quality and compliance.
              </p>
            </div>

            <Separator />

            {/* Diagram 5: Deployment Diagram */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">5. Deployment Architecture Diagram</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold">Audience:</span> DevOps Engineers, Cloud Architects, IT Operations, Security Teams
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Purpose:</span> Shows physical infrastructure organization, hosting, and deployment topology.
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/20 p-6 rounded-lg border overflow-auto">
                <MermaidDiagram
                  id="deployment-diagram"
                  name="Deployment Architecture Diagram"
                  enableExport={true}
                  definition={`graph TB
    subgraph ClientTier["Client Tier"]
        WebBrowser["Web Browsers: Marketing Teams, MLR Reviewers"]
    end
    
    subgraph EdgeTier["Edge and CDN Layer"]
        CDN["Content Delivery Network"]
        LoadBalancer["Load Balancer"]
    end
    
    subgraph AppTier["Application Tier"]
        Frontend["Frontend Application: SPA Framework (React)"]
        APIGateway["API Gateway Layer"]
        ServerlessCompute["Serverless Compute Layer (Deno Edge Functions)"]
    end
    
    subgraph AITier["AI Processing Tier"]
        AIGatewayService["Multi-Model AI Gateway"]
        StandardModel["Standard Tier (Google Gemini 2.5 Flash)"]
        AdvancedModel["Advanced Tier (Google Gemini 2.5 Pro)"]
        PremiumModel["Premium Tier (OpenAI GPT-5)"]
    end
    
    subgraph DataTier["Data Tier"]
        PrimaryDB["Primary Database Cluster (PostgreSQL + Supabase)"]
        VectorDB["Vector Database (pgvector extension)"]
        DistributedCache["Distributed Cache (Redis)"]
    end
    
    subgraph IntegrationTier["Integration Tier"]
        VeevaAPI["Content Management API (Veeva Vault)"]
        IQVIAAPI["Market Intelligence API (IQVIA)"]
        TMAPI["Translation Memory Connectors (SDL Trados, MemoQ)"]
        RegulatoryAPI["Regulatory Framework APIs (FDA, EMA, PMDA)"]
    end
    
    subgraph InfraLayer["Cloud Infrastructure"]
        CloudPlatform["Cloud Platform: Multi-Region Deployment"]
        SecurityLayer["Security Layer: Authentication, Encryption, WAF"]
    end
    
    WebBrowser --> CDN
    CDN --> LoadBalancer
    LoadBalancer --> Frontend
    Frontend --> APIGateway
    APIGateway --> ServerlessCompute
    
    ServerlessCompute --> AIGatewayService
    AIGatewayService --> StandardModel
    AIGatewayService --> AdvancedModel
    AIGatewayService --> PremiumModel
    
    ServerlessCompute --> PrimaryDB
    ServerlessCompute --> VectorDB
    ServerlessCompute --> DistributedCache
    
    ServerlessCompute --> VeevaAPI
    ServerlessCompute --> IQVIAAPI
    ServerlessCompute --> TMAPI
    ServerlessCompute --> RegulatoryAPI
    
    CloudPlatform --> SecurityLayer
    
    classDef clientStyle fill:#E3F2FD,stroke:#1976D2,stroke-width:2px,color:#000
    classDef edgeStyle fill:#B2DFDB,stroke:#00796B,stroke-width:2px,color:#000
    classDef appStyle fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px,color:#000
    classDef aiStyle fill:#F8BBD0,stroke:#C2185B,stroke-width:2px,color:#000
    classDef dataStyle fill:#FFE0B2,stroke:#E65100,stroke-width:2px,color:#000
    classDef integrationStyle fill:#D1C4E9,stroke:#512DA8,stroke-width:2px,color:#000
    classDef infraStyle fill:#CFD8DC,stroke:#455A64,stroke-width:2px,color:#000
    
    class WebBrowser clientStyle
    class CDN,LoadBalancer edgeStyle
    class Frontend,APIGateway,ServerlessCompute appStyle
    class AIGatewayService,StandardModel,AdvancedModel,PremiumModel aiStyle
    class PrimaryDB,VectorDB,DistributedCache dataStyle
    class VeevaAPI,IQVIAAPI,TMAPI,RegulatoryAPI integrationStyle
    class CloudPlatform,SecurityLayer infraStyle`}
                />
                <DiagramLegend type="deployment" />
              </div>
              
              <p className="text-sm text-muted-foreground italic">
                <span className="font-semibold">Key Insight:</span> Multi-tier cloud-native architecture with edge computing, serverless scaling, and multi-region deployment ensures high availability, performance, and data residency compliance.
              </p>
              
              {showTechnicalDetails && (
                <div className="mt-4 p-4 bg-muted/20 rounded-lg border border-primary/20">
                  <p className="text-sm font-semibold text-primary mb-2">Internal Technical Reference:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Cloud Platform: Multi-cloud deployment capability (AWS, Azure, GCP)</li>
                    <li>• Serverless Compute: Deno-based edge functions with auto-scaling</li>
                    <li>• Primary Database: PostgreSQL 15+ managed by Supabase</li>
                    <li>• Vector Database: pgvector extension for semantic search</li>
                    <li>• AI Gateway: Custom routing layer for model optimization</li>
                    <li>• Security: SOC 2 Type II compliant infrastructure</li>
                  </ul>
                </div>
              )}
            </div>

          </CardContent>
        </Card>

        {/* AI Models Summary - Business Friendly */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">AI-Powered Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground leading-relaxed">
              The Brand Excellence Platform leverages advanced AI models (Google Gemini and OpenAI GPT-5 series) 
              to deliver intelligent automation across the three pillars. Each AI function is optimized for 
              specific pharmaceutical marketing use cases:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-sm">Strategic Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">Theme Generation</p>
                    <p className="text-muted-foreground">Analyzes market data to generate strategic messaging themes</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Brand Guardrails</p>
                    <p className="text-muted-foreground">Enforces brand consistency across all content</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Competitive Analysis</p>
                    <p className="text-muted-foreground">Identifies messaging gaps and opportunities</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-sm">Compliance & MLR</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">Regulatory Validation</p>
                    <p className="text-muted-foreground">Pre-validates content against 50+ market regulations</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">MLR Prediction</p>
                    <p className="text-muted-foreground">Predicts approval likelihood and review cycles</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Medical Accuracy</p>
                    <p className="text-muted-foreground">Validates terminology and clinical precision</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-sm">Glocalization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">Smart Translation</p>
                    <p className="text-muted-foreground">TM-leveraged medical translation with 99%+ accuracy</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Cultural Adaptation</p>
                    <p className="text-muted-foreground">Market-specific messaging optimization</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Market Compliance</p>
                    <p className="text-muted-foreground">Local regulatory requirement validation</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {showTechnicalDetails && (
              <div className="mt-6">
                <Separator className="mb-6" />
                <h3 className="text-lg font-semibold text-foreground mb-4">Technical Implementation Details</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Expand sections below to view detailed AI model specifications, prompt architectures, and JSON output structures.
                </p>
                <div className="space-y-4">
                  <TechnicalSection title="Pillar 1: Theme Intelligence AI Models">
                    <div className="space-y-4 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-semibold">Primary Model:</span> google/gemini-2.5-flash
                      </p>
                      <p className="text-muted-foreground">
                        Optimized for analyzing large volumes of market intelligence data with balanced performance 
                        and cost efficiency for continuous theme generation.
                      </p>
                      <div className="bg-background p-4 rounded border space-y-2">
                        <p className="font-semibold text-foreground">Key Capabilities:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Multi-source data integration (Veeva, IQVIA, Social Listening)</li>
                          <li>Competitive white space identification</li>
                          <li>Brand vision alignment scoring</li>
                          <li>Strategic theme prioritization</li>
                        </ul>
                      </div>
                    </div>
                  </TechnicalSection>

                  <TechnicalSection title="Pillar 2: Regulatory Compliance AI Models">
                    <div className="space-y-4 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-semibold">Primary Model:</span> google/gemini-2.5-flash
                      </p>
                      <p className="text-muted-foreground">
                        Handles complex rule-based regulatory framework analysis across multiple markets with 
                        structured compliance checking.
                      </p>
                      <div className="bg-background p-4 rounded border space-y-2">
                        <p className="font-semibold text-foreground">Key Capabilities:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>50+ market regulatory framework validation</li>
                          <li>MLR historical pattern analysis</li>
                          <li>Approval probability prediction</li>
                          <li>Pre-approved language recommendation</li>
                        </ul>
                      </div>
                    </div>
                  </TechnicalSection>

                  <TechnicalSection title="Pillar 3: Glocalization AI Models">
                    <div className="space-y-4 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-semibold">Translation Model:</span> google/gemini-2.5-flash
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-semibold">Cultural Intelligence Model:</span> google/gemini-2.5-pro
                      </p>
                      <div className="bg-background p-4 rounded border space-y-2">
                        <p className="font-semibold text-foreground">Key Capabilities:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Medical terminology database integration (MedDRA, ICD-10)</li>
                          <li>Translation Memory leverage (100% match prioritization)</li>
                          <li>Cultural adaptation (Hofstede dimensions analysis)</li>
                          <li>Market-specific regulatory compliance mapping</li>
                        </ul>
                      </div>
                    </div>
                  </TechnicalSection>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quantitative Impact Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Quantitative Impact Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-sm text-green-900 dark:text-green-100">Speed Improvements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-800 dark:text-green-200">Theme Development:</span>
                    <span className="font-semibold text-green-900 dark:text-green-100">80% faster</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800 dark:text-green-200">MLR Review Cycles:</span>
                    <span className="font-semibold text-green-900 dark:text-green-100">40% reduction</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800 dark:text-green-200">Translation Time:</span>
                    <span className="font-semibold text-green-900 dark:text-green-100">70% faster</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800 dark:text-green-200">Global Rollout:</span>
                    <span className="font-semibold text-green-900 dark:text-green-100">50% faster</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-sm text-blue-900 dark:text-blue-100">Quality Enhancements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-800 dark:text-blue-200">Brand Consistency:</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">95%+ score</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800 dark:text-blue-200">First-Cycle MLR Approval:</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">+25% improvement</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800 dark:text-blue-200">Medical Terminology Accuracy:</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">99%+ consistency</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800 dark:text-blue-200">Cultural Relevance:</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">AI-optimized</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="text-sm text-purple-900 dark:text-purple-100">Cost Reductions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-800 dark:text-purple-200">Translation Costs:</span>
                    <span className="font-semibold text-purple-900 dark:text-purple-100">40-50% reduction</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-800 dark:text-purple-200">MLR Rework:</span>
                    <span className="font-semibold text-purple-900 dark:text-purple-100">60% reduction</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-800 dark:text-purple-200">Agency Dependencies:</span>
                    <span className="font-semibold text-purple-900 dark:text-purple-100">30% reduction</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-800 dark:text-purple-200">Time-to-Market Value:</span>
                    <span className="font-semibold text-purple-900 dark:text-purple-100">3-5 months saved</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="text-sm text-orange-900 dark:text-orange-100">Risk Mitigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-orange-800 dark:text-orange-200">Regulatory Violations:</span>
                    <span className="font-semibold text-orange-900 dark:text-orange-100">Pre-identified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-800 dark:text-orange-200">Brand Inconsistencies:</span>
                    <span className="font-semibold text-orange-900 dark:text-orange-100">Auto-detected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-800 dark:text-orange-200">Cultural Missteps:</span>
                    <span className="font-semibold text-orange-900 dark:text-orange-100">Proactively flagged</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-800 dark:text-orange-200">Knowledge Loss:</span>
                    <span className="font-semibold text-orange-900 dark:text-orange-100">Eliminated via AI memory</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Key Differentiators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Key Differentiators for UCB RFI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground">1. Intelligence-Driven Content Strategy</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Unlike traditional content management platforms that focus on storage and workflow, the Brand 
                  Excellence Platform begins with AI-powered strategic intelligence—consuming real-time market data, 
                  competitive activity, and brand performance to generate actionable themes and maintain living brand 
                  guardrails that evolve with market dynamics.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-foreground">2. PreMLR Optimization Engine</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Transforms MLR from a bottleneck into an accelerator. By leveraging historical MLR decisions, 
                  reviewer patterns, and regulatory frameworks, the platform predicts approval likelihood and 
                  proactively identifies compliance issues before submission—reducing review cycles by an estimated 
                  40% and accelerating time-to-market.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-foreground">3. Culturally-Intelligent Glocalization</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Goes beyond translation to deliver culturally-adapted content that resonates across 50+ markets. 
                  AI cultural intelligence analyzes communication norms, healthcare system contexts, and visual 
                  symbolism to ensure messaging effectiveness while maintaining brand consistency and regulatory 
                  compliance in each local market.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-foreground">4. Continuous Learning & Institutional Memory</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The platform learns and improves over time. MLR decisions, campaign performance, translation memory, 
                  and competitive intelligence feed back into the system—creating institutional knowledge that 
                  persists beyond individual team members and continuously optimizes future content production.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-foreground">5. End-to-End Integration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Seamlessly integrates with existing pharmaceutical marketing technology ecosystem—Veeva Vault 
                  for asset management, IQVIA for market intelligence, social listening platforms for sentiment 
                  analysis, and regulatory databases—creating a unified command center for pharmaceutical marketing 
                  operations rather than another siloed point solution.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">Conclusion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              The Brand Excellence Platform represents a fundamental reimagining of pharmaceutical marketing 
              operations—moving from reactive content production to proactive, intelligence-driven brand stewardship. 
              By integrating strategic intelligence, regulatory compliance, and global-local orchestration into a 
              single AI-powered ecosystem, pharmaceutical marketers can achieve unprecedented speed, consistency, 
              and market effectiveness.
            </p>
            <p className="text-foreground leading-relaxed">
              For UCB, this framework offers a competitive advantage in rapidly bringing compliant, culturally-resonant 
              content to market across therapeutic areas and geographies—accelerating patient access to life-changing 
              treatments while maintaining the highest standards of brand integrity and regulatory compliance.
            </p>
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mt-6">
              <p className="text-sm font-semibold text-foreground">
                This comprehensive framework delivers measurable impact:
              </p>
              <ul className="text-sm text-foreground mt-2 space-y-1 list-disc list-inside">
                <li>80% faster theme development and strategic planning</li>
                <li>40% reduction in MLR review cycles</li>
                <li>70% faster translation and localization</li>
                <li>50% faster global campaign rollout</li>
                <li>95%+ brand consistency across markets</li>
                <li>Continuous intelligence-driven optimization</li>
              </ul>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default BrandExcellenceDocument;