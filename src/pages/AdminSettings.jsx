import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyLogoUploader from '@/components/admin/CompanyLogoUploader';
import { Settings } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
            <p className="text-muted-foreground">Manage system configuration and assets</p>
          </div>
        </div>

        <Tabs defaultValue="logos" className="w-full">
          <TabsList>
            <TabsTrigger value="logos">Company Logos</TabsTrigger>
          </TabsList>

          <TabsContent value="logos" className="mt-6">
            <CompanyLogoUploader />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;