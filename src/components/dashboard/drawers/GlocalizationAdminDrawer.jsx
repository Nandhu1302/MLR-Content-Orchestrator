import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe2, Plus, Download, RefreshCw, Languages, TrendingUp, Zap } from "lucide-react";

export const GlocalizationAdminDrawer = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[80%] overflow-y-auto px-8">
        <SheetHeader className="sticky top-0 bg-background z-10 pb-6 pt-2">
          <SheetTitle className="flex items-center gap-3 text-3xl">
            <Globe2 className="h-7 w-7" />
            Glocalization Intelligence Administration
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="overview" className="text-base">Project Dashboard</TabsTrigger>
            <TabsTrigger value="languages" className="text-base">Language Config</TabsTrigger>
            <TabsTrigger value="cultural" className="text-base">Cultural Rules</TabsTrigger>
            <TabsTrigger value="tm" className="text-base">TM Analytics</TabsTrigger>
          </TabsList>

          {/* Project Dashboard Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="default">
                  <Download className="h-4 w-4 mr-2" />
                  Export Analytics
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">12</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">34</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    TM Leverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold">78%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-8">
                  Active glocalization projects will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language Configuration Tab */}
          <TabsContent value="languages" className="space-y-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <Button size="default">
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </div>

            <div className="text-center py-16 text-muted-foreground">
              <Languages className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Language configuration management</p>
              <p className="text-base mt-3">Configure supported languages and regional variants</p>
            </div>
          </TabsContent>

          {/* Cultural Intelligence Rules Tab */}
          <TabsContent value="cultural" className="space-y-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <Button size="default">
                <Plus className="h-4 w-4 mr-2" />
                Add Cultural Rule
              </Button>
            </div>

            <div className="text-center py-16 text-muted-foreground">
              <TrendingUp className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Cultural adaptation guidelines</p>
              <p className="text-base mt-3">Manage cultural intelligence rules for each market</p>
            </div>
          </TabsContent>

          {/* Translation Memory Analytics Tab */}
          <TabsContent value="tm" className="space-y-6 mt-6">
            <div className="text-center py-16 text-muted-foreground">
              <Zap className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Translation Memory analytics</p>
              <p className="text-base mt-3">View TM statistics, leverage rates, and ROI</p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};