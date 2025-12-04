import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Plus, Download, RefreshCw, TrendingUp, AlertTriangle, Shield } from "lucide-react";

export const CompetitiveIntelligenceDrawer = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[80%] overflow-y-auto px-8">
        <SheetHeader className="sticky top-0 bg-background z-10 pb-6 pt-2">
          <SheetTitle className="flex items-center gap-3 text-3xl">
            <Target className="h-7 w-7" />
            Competitive Intelligence Administration
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
            <TabsTrigger value="profiles" className="text-base">Competitor Profiles</TabsTrigger>
            <TabsTrigger value="gaps" className="text-base">Messaging Gaps</TabsTrigger>
            <TabsTrigger value="intelligence" className="text-base">Market Intelligence</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="default">
                  <Download className="h-4 w-4 mr-2" />
                  Export Matrix
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Competitors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">8</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Critical Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-2xl font-bold">3</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold">12</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Competitive Landscape</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-8">
                  Competitive landscape visualization will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitor Profiles Tab */}
          <TabsContent value="profiles" className="space-y-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <Button size="default">
                <Plus className="h-4 w-4 mr-2" />
                Add Competitor
              </Button>
            </div>

            <div className="text-center py-16 text-muted-foreground">
              <Target className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Competitor profiles will be managed here</p>
              <p className="text-base mt-3">Add, edit, and track competitor information</p>
            </div>
          </TabsContent>

          {/* Messaging Gaps Tab */}
          <TabsContent value="gaps" className="space-y-6 mt-6">
            <div className="text-center py-16 text-muted-foreground">
              <TrendingUp className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Messaging opportunities and gaps</p>
              <p className="text-base mt-3">Identify areas where your messaging can stand out</p>
            </div>
          </TabsContent>

          {/* Market Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6 mt-6">
            <div className="text-center py-16 text-muted-foreground">
              <Shield className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Market intelligence and trends</p>
              <p className="text-base mt-3">Latest market data and competitive insights</p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};