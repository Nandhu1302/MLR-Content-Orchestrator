import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Presentation, Video } from 'lucide-react';
import MarketingDeck from '@/pages/MarketingDeck';
import VideoFrameGenerator from '@/pages/VideoFrameGenerator';

export const MarketingMaterialsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Marketing Materials</h2>
        <p className="text-muted-foreground">
          Professional presentations and AI-powered video content for stakeholder engagement
        </p>
      </div>

      <Tabs defaultValue="deck" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deck" className="gap-2">
            <Presentation className="h-4 w-4" />
            Marketing Deck
          </TabsTrigger>
          <TabsTrigger value="video" className="gap-2">
            <Video className="h-4 w-4" />
            Video Generator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deck" className="mt-6">
          <MarketingDeck embedded />
        </TabsContent>

        <TabsContent value="video" className="mt-6">
          <VideoFrameGenerator embedded />
        </TabsContent>
      </Tabs>
    </div>
  );
};