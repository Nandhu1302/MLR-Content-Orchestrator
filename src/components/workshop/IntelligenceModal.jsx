
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EvidenceTab } from './intelligence-tabs/EvidenceTab';
import { PerformanceTab } from './intelligence-tabs/PerformanceTab';
import { AudienceTab } from './intelligence-tabs/AudienceTab';
import { MarketTab } from './intelligence-tabs/MarketTab';
// import type { MatchedIntelligence } from '@/types/workshop'; // (Type-only import removed)

/*
interface IntelligenceModalProps {
  open: boolean;
  onClose: () => void;
  intelligence: MatchedIntelligence | null;
  selectedClaims: string[];
  selectedVisuals: string[];
  selectedModules: string[];
  onClaimToggle: (claimId: string) => void;
  onVisualToggle: (visualId: string) => void;
  onModuleToggle: (moduleId: string) => void;
  hcpTargeting?: any;
  marketContext?: any;
  audienceInsights?: any;
  campaignCoordination?: any;
  crossChannelInsights?: any;
  performancePrediction?: any;
}
*/

export const IntelligenceModal = ({
  open,
  onClose,
  intelligence,
  selectedClaims,
  selectedVisuals,
  selectedModules,
  onClaimToggle,
  onVisualToggle,
  onModuleToggle,
  hcpTargeting,
  marketContext,
  audienceInsights,
  campaignCoordination,
  crossChannelInsights,
  performancePrediction,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] sm:h-[70vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            Intelligence Arsenal
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="evidence" className="flex-1 flex flex-col">
          <TabsList className="px-6 py-2 justify-start border-b rounded-none bg-transparent">
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-6 py-4">
            <TabsContent value="evidence" className="mt-0">
              <EvidenceTab
                intelligence={intelligence}
                selectedClaims={selectedClaims}
                selectedVisuals={selectedVisuals}
                selectedModules={selectedModules}
                onClaimToggle={onClaimToggle}
                onVisualToggle={onVisualToggle}
                onModuleToggle={onModuleToggle}
              />
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
              <PerformanceTab
                intelligence={intelligence}
                crossChannelInsights={crossChannelInsights}
                performancePrediction={performancePrediction}
              />
            </TabsContent>

            <TabsContent value="audience" className="mt-0">
              <AudienceTab
                audienceInsights={audienceInsights}
                hcpTargeting={hcpTargeting}
                campaignCoordination={campaignCoordination}
              />
            </TabsContent>

            <TabsContent value="market" className="mt-0">
              <MarketTab
                marketContext={marketContext}
                intelligence={intelligence}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
