import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  FileInput, FileText, CheckCircle, Send, Download, AlertTriangle, AlertCircle,
  Repeat, Globe, TrendingUp, Activity, Clock, Shield, Info, Languages,
  DollarSign, PiggyBank
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip as ChartTooltip } from "recharts";

// ============= DATA FOR ALL TABS =============

// Lifecycle Data
const phaseData = [
  { phase: "Intake", duration: 2.3, assets: 156, bottleneck: "Low", progress: 85, icon: FileInput },
  { phase: "Content Studio", duration: 8.1, assets: 42, bottleneck: "Medium", progress: 65, icon: FileText },
  { phase: "MLR Review", duration: 15.2, assets: 28, bottleneck: "High", progress: 45, icon: CheckCircle },
  { phase: "Design Handoff", duration: 7.4, assets: 19, bottleneck: "Medium", progress: 70, icon: Send },
  { phase: "Final Review", duration: 3.8, assets: 15, bottleneck: "Low", progress: 80, icon: CheckCircle },
  { phase: "Completion", duration: 3.1, assets: 23, bottleneck: "Low", progress: 90, icon: Download },
];

const timelineData = [
  { date: "Week 1", days: 45 },
  { date: "Week 2", days: 43 },
  { date: "Week 3", days: 48 },
  { date: "Week 4", days: 42 },
];

// Reusability Data
const marketDistribution = [
  { market: "US", assets: 45, color: "hsl(var(--chart-1))" },
  { market: "UK", assets: 38, color: "hsl(var(--chart-2))" },
  { market: "Germany", assets: 32, color: "hsl(var(--chart-3))" },
  { market: "France", assets: 28, color: "hsl(var(--chart-4))" },
  { market: "Japan", assets: 25, color: "hsl(var(--chart-5))" },
];

const assetTypeBreakdown = [
  { name: "Email", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Social", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Web", value: 22, color: "hsl(var(--chart-3))" },
  { name: "Video", value: 15, color: "hsl(var(--chart-4))" },
];

// Throughput Data
const monthlyTrend = [
  { month: "Jan", completed: 18 },
  { month: "Feb", completed: 21 },
  { month: "Mar", completed: 19 },
  { month: "Apr", completed: 23 },
];

const wipByPhase = [
  { phase: "Intake", count: 15 },
  { phase: "Studio", count: 42 },
  { phase: "MLR", count: 28 },
  { phase: "Design", count: 19 },
  { phase: "Review", count: 23 },
];

const capacityData = [
  { week: "W1", capacity: 85, utilization: 72 },
  { week: "W2", capacity: 85, utilization: 78 },
  { week: "W3", capacity: 85, utilization: 82 },
  { week: "W4", capacity: 85, utilization: 75 },
];

// Quality Data
const qualityTrend = [
  { week: "W1", score: 85 },
  { week: "W2", score: 87 },
  { week: "W3", score: 84 },
  { week: "W4", score: 88 },
];

const complianceMetrics = [
  { category: "Brand Guidelines", score: 94, status: "excellent" },
  { category: "Regulatory Rules", score: 92, status: "excellent" },
  { category: "Legal Claims", score: 88, status: "good" },
  { category: "Medical Accuracy", score: 85, status: "good" },
];

// Localization Data
const tmLeverageTrend = [
  { month: "Jan", leverage: 68 },
  { month: "Feb", leverage: 70 },
  { month: "Mar", leverage: 71 },
  { month: "Apr", leverage: 72 },
];

const languageVolume = [
  { language: "Spanish", projects: 12 },
  { language: "German", projects: 10 },
  { language: "French", projects: 9 },
  { language: "Japanese", projects: 8 },
  { language: "Chinese", projects: 7 },
];

const projectsByStatus = [
  { status: "Active", count: 28, color: "hsl(var(--chart-1))" },
  { status: "Pending", count: 15, color: "hsl(var(--chart-2))" },
  { status: "Completed", count: 42, color: "hsl(var(--chart-3))" },
];

// Cost Data
const savingsTrend = [
  { month: "Jan", savings: 198000 },
  { month: "Feb", savings: 215000 },
  { month: "Mar", savings: 228000 },
  { month: "Apr", savings: 245000 },
];

const costByPhase = [
  { phase: "Translation", cost: 125000 },
  { phase: "Review", cost: 45000 },
  { phase: "Design", cost: 38000 },
  { phase: "QA", cost: 22000 },
];

const formatCurrency = (amount) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

export const FactoryOperationsDrawer = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[80%] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Factory Operations Analytics</SheetTitle>
          <SheetDescription>Comprehensive operational metrics and performance insights</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="lifecycle" className="mt-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
            <TabsTrigger value="reusability">Reusability</TabsTrigger>
            <TabsTrigger value="throughput">Throughput</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="localization">Localization</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
          </TabsList>

          {/* ============= LIFECYCLE TAB ============= */}
          <TabsContent value="lifecycle" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              {phaseData.map((phase) => {
                const Icon = phase.icon;
                const bottleneckVariant = phase.bottleneck === "High" ? "destructive" : phase.bottleneck === "Medium" ? "default" : "secondary";
                
                return (
                  <Card key={phase.phase}>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {phase.phase}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg Duration</span>
                          <span className="text-sm font-semibold">{phase.duration} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Assets In Phase</span>
                          <span className="text-sm font-semibold">{phase.assets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Bottleneck Risk</span>
                          <Badge variant={bottleneckVariant}>{phase.bottleneck}</Badge>
                        </div>
                        <Progress value={phase.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Time-to-Market Trend (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip />
                    <Line type="monotone" dataKey="days" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Bottleneck Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>MLR Review Phase</strong> exceeding target by 3 days. 
                      15 assets currently waiting for approval.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Design Handoff</strong> capacity at 85%. 
                      Consider prioritizing critical campaigns.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Lifecycle Report (CSV)
            </Button>
          </TabsContent>

          {/* ============= REUSABILITY TAB ============= */}
          <TabsContent value="reusability" className="space-y-6 mt-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Assets Created</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">156</div>
                  <Badge className="mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs last month
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Assets Localized</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">100</div>
                  <div className="text-sm text-muted-foreground mt-2">64% conversion rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Avg Markets per Asset
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4.2</div>
                  <div className="text-sm text-success mt-2">Excellent reuse</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Localized Assets by Market</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketDistribution}>
                    <XAxis dataKey="market" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="assets" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Localization by Asset Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={assetTypeBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {assetTypeBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="h-5 w-5" />
                  Most Reused Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Q4 Campaign Email Template", markets: 8 },
                    { name: "Product Launch Social Banner", markets: 7 },
                    { name: "Disease Awareness Web Hero", markets: 6 },
                  ].map((asset, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">{asset.name}</span>
                      <Badge>{asset.markets} markets</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Reusability Report (CSV)
            </Button>
          </TabsContent>

          {/* ============= THROUGHPUT TAB ============= */}
          <TabsContent value="throughput" className="space-y-6 mt-6">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Monthly Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">23</div>
                  <Badge className="mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12%
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">WIP Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">127</div>
                  <div className="text-sm text-muted-foreground mt-2">Across 5 phases</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Daily Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3.2</div>
                  <div className="text-sm text-muted-foreground mt-2">Assets/day</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Avg Cycle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">38d</div>
                  <div className="text-sm text-success mt-2">Within target</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Completion Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip />
                    <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Work-in-Progress by Phase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wipByPhase.map((item) => (
                    <div key={item.phase} className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">{item.phase}</span>
                      <Badge variant="outline">{item.count} assets</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacity Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={capacityData}>
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip />
                    <Area type="monotone" dataKey="capacity" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" />
                    <Area type="monotone" dataKey="utilization" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Throughput Report (CSV)
            </Button>
          </TabsContent>

          {/* ============= QUALITY TAB ============= */}
          <TabsContent value="quality" className="space-y-6 mt-6">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    MLR First-Pass
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Demo data - will show real metrics once MLR tracking is enabled
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">78%</div>
                  <Progress value={78} className="h-2 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Guardrails
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">94%</div>
                  <Badge className="mt-2">Excellent</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Avg Rework</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1.3x</div>
                  <div className="text-sm text-muted-foreground mt-2">Per asset</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quality Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">87</div>
                  <div className="text-sm text-success mt-2">Above target</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quality Score Trend (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={qualityTrend}>
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Compliance by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceMetrics.map((metric) => (
                    <div key={metric.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{metric.category}</span>
                        <Badge variant={metric.status === "excellent" ? "default" : "secondary"}>
                          {metric.score}%
                        </Badge>
                      </div>
                      <Progress value={metric.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Common Review Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { issue: "Missing claim references", count: 12 },
                    { issue: "Inconsistent brand terminology", count: 8 },
                    { issue: "Regulatory disclaimer formatting", count: 5 },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">{item.issue}</span>
                      <Badge variant="outline">{item.count} instances</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Quality Report (CSV)
            </Button>
          </TabsContent>

          {/* ============= LOCALIZATION TAB ============= */}
          <TabsContent value="localization" className="space-y-6 mt-6">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">TM Leverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">72%</div>
                  <Badge className="mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Excellent
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">28</div>
                  <div className="text-sm text-muted-foreground mt-2">In progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">15</div>
                  <div className="text-sm text-muted-foreground mt-2">Supported</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Avg Lead Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">18d</div>
                  <div className="text-sm text-success mt-2">Within SLA</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Translation Memory Leverage Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tmLeverageTrend}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip />
                    <Line type="monotone" dataKey="leverage" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projects by Language</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={languageVolume}>
                    <XAxis dataKey="language" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="projects" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectsByStatus.map((item) => (
                    <div key={item.status} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.status}</span>
                        <Badge variant="outline">{item.count} projects</Badge>
                      </div>
                      <Progress value={(item.count / 85) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Active Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { market: "EMEA", projects: 18, languages: 8 },
                    { market: "APAC", projects: 12, languages: 6 },
                    { market: "LATAM", projects: 10, languages: 4 },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.market}</div>
                        <div className="text-sm text-muted-foreground">{item.languages} languages</div>
                      </div>
                      <Badge>{item.projects} projects</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Localization Report (CSV)
            </Button>
          </TabsContent>

          {/* ============= COST TAB ============= */}
          <TabsContent value="cost" className="space-y-6 mt-6">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <PiggyBank className="h-4 w-4" />
                    TM Savings (Q4)
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Calculated from TM leverage × word count × cost differential
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$245K</div>
                  <Badge className="mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18%
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Cost per Asset</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$8.2K</div>
                  <div className="text-sm text-muted-foreground mt-2">Avg across all types</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Cost per Market</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$3.1K</div>
                  <div className="text-sm text-muted-foreground mt-2">Localization avg</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">340%</div>
                  <Badge className="mt-2">Excellent</Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>TM Cost Savings Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={savingsTrend}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <ChartTooltip formatter={(value) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="savings" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution by Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costByPhase}>
                    <XAxis dataKey="phase" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <ChartTooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="cost" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Efficiency Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Words Translated (Q4)</div>
                      <div className="text-sm text-muted-foreground">via TM leverage</div>
                    </div>
                    <span className="text-2xl font-bold">1.2M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Avg Cost per Word</div>
                      <div className="text-sm text-muted-foreground">After TM savings</div>
                    </div>
                    <span className="text-2xl font-bold">$0.08</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Time Savings</div>
                      <div className="text-sm text-muted-foreground">Due to reuse</div>
                    </div>
                    <span className="text-2xl font-bold">340hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Comparison: With vs Without TM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="font-medium">Traditional Translation Cost</span>
                    <span className="text-xl font-bold">$475K</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-success/10 border-2 border-success rounded-lg">
                    <span className="font-medium">With TM Leverage</span>
                    <span className="text-xl font-bold text-success">$230K</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <span className="font-medium text-lg">Total Savings</span>
                    <span className="text-2xl font-bold text-primary">$245K</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Cost Report (CSV)
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};