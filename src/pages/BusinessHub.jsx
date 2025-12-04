import { HeroSection } from '@/components/business-hub/HeroSection';
import { ExecutiveDashboard } from '@/components/business-hub/ExecutiveDashboard';
import { MarketingMaterialsSection } from '@/components/business-hub/MarketingMaterialsSection';
import { TechnicalDocumentationSection } from '@/components/business-hub/TechnicalDocumentationSection';
import { BulkOperationsPanel } from '@/components/business-hub/BulkOperationsPanel';
import { FishboneProblemDiagramRFP } from '@/components/marketing/slides/FishboneProblemDiagramRFP';
import { BeforeAfterSlider } from '@/components/marketing/slides/BeforeAfterSlider';
import { OrchestrationArchitectureDiagram } from '@/components/marketing/slides/OrchestrationArchitectureDiagram';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BusinessHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <HeroSection />
        <div className="px-8 py-6">
          <Button 
            onClick={() => navigate('/bi-proposal')} 
            size="lg" 
            className="gap-2"
          >
            <FileText className="w-5 h-5" />
            View Boehringer Ingelheim Glocalization Proposal
          </Button>
        </div>
        <div className="space-y-0">
          <FishboneProblemDiagramRFP />
          <BeforeAfterSlider />
          <OrchestrationArchitectureDiagram />
          <div className="px-8 pb-8 space-y-12">
            <ExecutiveDashboard />
            <MarketingMaterialsSection />
            <TechnicalDocumentationSection />
          </div>
        </div>
      </div>
      <BulkOperationsPanel />
    </div>
  );
};

export default BusinessHub;