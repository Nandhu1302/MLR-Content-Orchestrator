import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Plus, Download, RefreshCw, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export const RegulatoryAdminDrawer = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[80%] overflow-y-auto px-8">
        <SheetHeader className="sticky top-0 bg-background z-10 pb-6 pt-2">
          <SheetTitle className="flex items-center gap-3 text-3xl">
            <Globe className="h-7 w-7" />
            Regulatory Coverage Administration
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="overview" className="text-base">Market Overview</TabsTrigger>
            <TabsTrigger value="rules" className="text-base">Regulatory Rules</TabsTrigger>
            <TabsTrigger value="disclaimers" className="text-base">Disclaimers</TabsTrigger>
            <TabsTrigger value="reports" className="text-base">Compliance Reports</TabsTrigger>
          </TabsList>

          {/* Market Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="default">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Markets Supported
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">25</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Compliance Ready
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold">22</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Disclaimers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">18</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Market Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-8">
                  Market-by-market compliance status will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regulatory Rules Tab */}
          <TabsContent value="rules" className="space-y-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <Button size="default">
                <Plus className="h-4 w-4 mr-2" />
                Add Regulatory Rule
              </Button>
            </div>

            <div className="text-center py-16 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Regulatory rules management</p>
              <p className="text-base mt-3">Add, edit, and organize regulatory requirements by market</p>
            </div>
          </TabsContent>

          {/* Disclaimers Tab */}
          <TabsContent value="disclaimers" className="space-y-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <Button size="default">
                <Plus className="h-4 w-4 mr-2" />
                Add Disclaimer
              </Button>
            </div>

            <div className="text-center py-16 text-muted-foreground">
              <AlertTriangle className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Disclaimers library</p>
              <p className="text-base mt-3">Manage required disclaimers for each market</p>
            </div>
          </TabsContent>

          {/* Compliance Reports Tab */}
          <TabsContent value="reports" className="space-y-6 mt-6">
            <div className="text-center py-16 text-muted-foreground">
              <CheckCircle className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Compliance reports and analytics</p>
              <p className="text-base mt-3">View trends, violations, and compliance metrics</p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};