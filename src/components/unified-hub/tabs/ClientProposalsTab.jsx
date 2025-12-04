import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2 } from 'lucide-react';
import BoehringerIngelheimProposal from '@/pages/BoehringerIngelheimProposal';
import UCBProposal from '@/pages/UCBProposal';

export const ClientProposalsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Client Proposals</h2>
        <p className="text-muted-foreground">
          Comprehensive proposals for Boehringer Ingelheim and UCB with detailed timelines, ROI, and implementation plans
        </p>
      </div>

      <Tabs defaultValue="bi" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bi" className="gap-2">
            <Building2 className="h-4 w-4" />
            Boehringer Ingelheim
          </TabsTrigger>
          <TabsTrigger value="ucb" className="gap-2">
            <Building2 className="h-4 w-4" />
            UCB
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bi" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Glocalization Module Proposal</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">60%</div>
                <div className="text-sm text-muted-foreground">Functionality Complete</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">16 Weeks</div>
                <div className="text-sm text-muted-foreground">Implementation Timeline</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">$1.2M</div>
                <div className="text-sm text-muted-foreground">Year 1 Savings</div>
              </div>
            </div>
          </div>
          <BoehringerIngelheimProposal embedded />
        </TabsContent>

        <TabsContent value="ucb" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Content Operations Platform RFP Response</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">80%</div>
                <div className="text-sm text-muted-foreground">Prototype Complete</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">12 Months</div>
                <div className="text-sm text-muted-foreground">Co-Development Timeline</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">70+</div>
                <div className="text-sm text-muted-foreground">Slides</div>
              </div>
            </div>
          </div>
          <UCBProposal embedded />
        </TabsContent>
      </Tabs>
    </div>
  );
};