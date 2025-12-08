import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BrandProvider } from "@/contexts/BrandContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalContextProvider } from "@/contexts/GlobalContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ConnectionDiagnostics } from "@/components/diagnostics/ConnectionDiagnostics";
import Index from "./pages/Index";
import IntakeFlowPage from "./pages/IntakeFlowPage";
import InitiativeHub from "./pages/InitiativeHub";
import StrategyAndInsights from "./pages/StrategyAndInsights";
// ContentDevelopmentHub removed - consolidated into Dashboard + Content Workshop
import ThemeIntelligenceWorkshop from "./pages/ThemeIntelligenceWorkshop";
import ThemeVersionsPage from "./pages/ThemeVersionsPage";
// ContentStudio removed - consolidated into ContentDevelopmentHub
import ContentEditorPage from "./pages/ContentEditorPage";
import LocalizationHub from "./pages/LocalizationHub";
import TranslationWorkspace from "./pages/TranslationWorkspace";
import PreMLRCompanion from "./pages/PreMLRCompanion";
import DesignStudio from "./pages/DesignStudio";
import GlocalizationHub from "./pages/GlocalizationHub";
import GlocalAdaptationWorkspace from "./pages/GlocalAdaptationWorkspace";
import GlocalProjectCreation from "./pages/GlocalProjectCreation";
import { ImportContentInterface } from '@/pages/ImportContentInterface';
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { SimplifiedLocalizationDashboard } from "@/components/localization/SimplifiedLocalizationDashboard";
import MarketingDeck from "./pages/MarketingDeck";
import AdminSettings from "./pages/AdminSettings";
import VideoFrameGenerator from "./pages/VideoFrameGenerator";
import ROICalculator from "./pages/ROICalculator";
import ExecutiveSummary from "./pages/ExecutiveSummary";
import UnifiedBusinessHub from "./pages/UnifiedBusinessHub";
import BrandExcellenceDocument from "./pages/BrandExcellenceDocument";
import ConsultingFrameworks from "./pages/ConsultingFrameworks";
import BrandDocumentLibrary from "./pages/BrandDocumentLibrary";
import { IntelligenceHub } from "./pages/IntelligenceHub";
import IntelligenceCreatePage from "./pages/IntelligenceCreatePage";
import { DataHealthDashboard } from "./pages/DataHealthDashboard";
import { DataIntelligenceDashboard } from "./pages/DataIntelligenceDashboard";
import { ContentIntelligenceDashboard } from "./pages/ContentIntelligenceDashboard";
import ContentWorkshopSimplePage from "./pages/ContentWorkshopSimplePage";
import WorkshopTestLab from "./pages/WorkshopTestLab";
import CampaignEditorPage from "./pages/CampaignEditorPage";

const queryClient = new QueryClient();

// The function signature remains as is, as types were not explicitly used here
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrandProvider>
        <GlobalContextProvider>
          <TooltipProvider>
          <Sonner />
          <ConnectionDiagnostics />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/content-workshop" element={<ProtectedRoute><ContentWorkshopSimplePage /></ProtectedRoute>} />
              <Route path="/workshop-test-lab" element={<ProtectedRoute><WorkshopTestLab /></ProtectedRoute>} />
              <Route path="/intake-flow" element={<ProtectedRoute><IntakeFlowPage /></ProtectedRoute>} />
              <Route path="/intake" element={<Navigate to="/intake-flow" replace />} />
              <Route path="/create-content" element={<Navigate to="/intake-flow" replace />} />
              <Route path="/content-workflow" element={<Navigate to="/content-workshop" replace />} />
              <Route path="/hub" element={<Navigate to="/content-workshop" replace />} />
              <Route path="/initiative-hub" element={<Navigate to="/content-workshop" replace />} />
              <Route path="/strategy-insights" element={<Navigate to="/intelligence" replace />} />
              <Route path="/theme-intelligence/:themeId" element={<ProtectedRoute><ThemeIntelligenceWorkshop /></ProtectedRoute>} />
              <Route path="/theme-versions/:themeId" element={<ProtectedRoute><ThemeVersionsPage /></ProtectedRoute>} />
              <Route path="/content-studio" element={<Navigate to="/content-workshop" replace />} />
              <Route path="/content-editor" element={<ProtectedRoute><ContentEditorPage /></ProtectedRoute>} />
              <Route path="/content-editor/:assetId" element={<ProtectedRoute><ContentEditorPage /></ProtectedRoute>} />
              <Route path="/campaign-editor" element={<ProtectedRoute><CampaignEditorPage /></ProtectedRoute>} />
              <Route path="/campaign-editor/:projectId" element={<ProtectedRoute><CampaignEditorPage /></ProtectedRoute>} />
              <Route path="/design-studio" element={<ProtectedRoute><DesignStudio /></ProtectedRoute>} />
              <Route path="/localization" element={<ProtectedRoute><SimplifiedLocalizationDashboard /></ProtectedRoute>} />
              <Route path="/localization/workspace/:projectId" element={<ProtectedRoute><TranslationWorkspace /></ProtectedRoute>} />
              <Route path="/localization/workflow/new" element={<ProtectedRoute><LocalizationHub /></ProtectedRoute>} />
              <Route path="/localization/workflow/:projectId" element={<ProtectedRoute><LocalizationHub /></ProtectedRoute>} />
              <Route path="/glocalization" element={<ProtectedRoute><GlocalizationHub /></ProtectedRoute>} />
              <Route path="/glocalization/create" element={<ProtectedRoute><GlocalProjectCreation /></ProtectedRoute>} />
              <Route path="/import-content" element={<ProtectedRoute><ImportContentInterface /></ProtectedRoute>} />
              <Route path="/glocalization/workspace/:projectId" element={<ProtectedRoute><GlocalAdaptationWorkspace /></ProtectedRoute>} />
              <Route path="/pre-mlr" element={<ProtectedRoute><PreMLRCompanion /></ProtectedRoute>} />
              <Route path="/pi-library" element={<Navigate to="/document-library" replace />} />
              <Route path="/document-library" element={<ProtectedRoute><BrandDocumentLibrary /></ProtectedRoute>} />
              <Route path="/intelligence" element={<ProtectedRoute><IntelligenceHub /></ProtectedRoute>} />
              <Route path="/intelligence-create" element={<ProtectedRoute><IntelligenceCreatePage /></ProtectedRoute>} />
              <Route path="/data-intelligence" element={<Navigate to="/intelligence" replace />} />
              <Route path="/content-intelligence" element={<Navigate to="/intelligence" replace />} />
              <Route path="/admin/data-health" element={<ProtectedRoute><DataHealthDashboard /></ProtectedRoute>} />
              <Route path="/data-health" element={<Navigate to="/admin/data-health" replace />} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              <Route path="/business-hub" element={<ProtectedRoute><UnifiedBusinessHub /></ProtectedRoute>} />
              <Route path="/brand-excellence-document" element={<BrandExcellenceDocument />} />
              <Route path="/consulting-frameworks" element={<ProtectedRoute><ConsultingFrameworks /></ProtectedRoute>} />
              
              {/* Redirects for old routes */}
              <Route path="/marketing-deck" element={<Navigate to="/business-hub#marketing" replace />} />
              <Route path="/marketing-deck/video" element={<Navigate to="/business-hub#marketing" replace />} />
              <Route path="/roi-calculator" element={<Navigate to="/business-hub#roi" replace />} />
              <Route path="/executive-summary" element={<Navigate to="/business-hub#summary" replace />} />
              <Route path="/bi-proposal" element={<Navigate to="/business-hub#clients" replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </GlobalContextProvider>
      </BrandProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;