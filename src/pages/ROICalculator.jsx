import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { ROICalculatorService } from '@/services/roiCalculator';
import { BusinessModelPPTDownload } from '@/components/BusinessModelPPTDownload';
import { ArchitectureDownload } from '@/components/ArchitectureDownload';
import { ArchitectureDiagramDownload } from '@/components/ArchitectureDiagramDownload';
import { GanttChartDownload } from '@/components/GanttChartDownload';
import { ProjectPlanDownload } from '@/components/ProjectPlanDownload';
import { GlocalizationArchitectureWordDownload } from '@/components/GlocalizationArchitectureWordDownload';
import { ValueBreakdownChart } from '@/components/roi/ValueBreakdownChart';
import { AssetSavingsChart } from '@/components/roi/AssetSavingsChart';
import { ValueDistributionChart } from '@/components/roi/ValueDistributionChart';
import { TimelineComparisonChart } from '@/components/roi/TimelineComparisonChart';
import { GlobalScalingChart } from '@/components/roi/GlobalScalingChart';

const ROICalculator = ({ embedded = false }) => {
  const [scenario, setScenario] = useState('moderate');
  const roiData = ROICalculatorService.calculateROI(ROICalculatorService.getScenarioAssumptions(scenario));

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Create a simple text export
    const exportText = `
ROI Calculator Results
Generated: ${roiData.calculatedAt.toLocaleDateString()}
Scenario: ${scenario.toUpperCase()}

TOTAL ANNUAL VALUE: ${ROICalculatorService.formatCurrency(roiData.totalValue)}

DOMESTIC OPERATIONS: ${ROICalculatorService.formatCurrency(roiData.domestic.total)}
- Labor Efficiency: ${ROICalculatorService.formatCurrency(roiData.domestic.components.laborEfficiency)}
- MLR Cycle Reduction: ${ROICalculatorService.formatCurrency(roiData.domestic.components.mlrCycleReduction)}
- Administrative: ${ROICalculatorService.formatCurrency(roiData.domestic.components.administrative)}
- Baseline Savings: ${ROICalculatorService.formatCurrency(roiData.domestic.components.baselineSavings)}
- Rework Elimination: ${ROICalculatorService.formatCurrency(roiData.domestic.components.reworkElimination)}

GLOBAL AMPLIFICATION: ${ROICalculatorService.formatCurrency(roiData.global.total)}
- Translation Savings: ${ROICalculatorService.formatCurrency(roiData.global.components.translationSavings)}
- Regulatory Efficiency: ${ROICalculatorService.formatCurrency(roiData.global.components.regulatoryEfficiency)}
- Quality Improvements: ${ROICalculatorService.formatCurrency(roiData.global.components.qualityImprovements)}

ASSET-SPECIFIC SAVINGS:
Email: ${ROICalculatorService.formatCurrency(roiData.byAssetType.email.total)} (Domestic: ${ROICalculatorService.formatCurrency(roiData.byAssetType.email.domestic)}, Global: ${ROICalculatorService.formatCurrency(roiData.byAssetType.email.global)})
DSA: ${ROICalculatorService.formatCurrency(roiData.byAssetType.dsa.total)} (Domestic: ${ROICalculatorService.formatCurrency(roiData.byAssetType.dsa.domestic)}, Global: ${ROICalculatorService.formatCurrency(roiData.byAssetType.dsa.global)})
Website: ${ROICalculatorService.formatCurrency(roiData.byAssetType.website.total)} (Domestic: ${ROICalculatorService.formatCurrency(roiData.byAssetType.website.domestic)}, Global: ${ROICalculatorService.formatCurrency(roiData.byAssetType.website.global)})
    `;

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roi-calculator-${scenario}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={embedded ? "space-y-6" : "min-h-screen bg-background p-8"}>
      <div className={embedded ? "space-y-6" : "max-w-7xl mx-auto space-y-8"}>
        {/* Header */}
        {!embedded && (
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-foreground">ROI Calculator</h1>
              <p className="text-muted-foreground mt-2">
                Intelligence-Driven Content Operations & Global Amplification
              </p>
            </div>
          <div className="flex gap-2">
            <GanttChartDownload />
            <ProjectPlanDownload />
            <BusinessModelPPTDownload />
            <GlocalizationArchitectureWordDownload />
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
            </div>
          </div>
        )}

        {/* Scenario Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">Scenario:</span>
          <div className="flex gap-2">
            {(['conservative', 'moderate', 'aggressive']).map((s) => (
              <Button
                key={s}
                variant={scenario === s ? 'default' : 'outline'}
                onClick={() => setScenario(s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Big Numbers */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <p className="text-sm text-muted-foreground mb-2">Total Annual Value</p>
            <p className="text-4xl font-bold text-primary">
              {ROICalculatorService.formatCurrency(roiData.totalValue)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <p className="text-sm text-muted-foreground mb-2">Domestic Operations</p>
            <p className="text-3xl font-bold text-foreground">
              {ROICalculatorService.formatCurrency(roiData.domestic.total)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {((roiData.domestic.total / roiData.totalValue) * 100).toFixed(0)}% of total
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <p className="text-sm text-muted-foreground mb-2">Global Amplification</p>
            <p className="text-3xl font-bold text-foreground">
              {ROICalculatorService.formatCurrency(roiData.global.total)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {((roiData.global.total / roiData.totalValue) * 100).toFixed(0)}% of total
            </p>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="breakdown" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="breakdown">Value Breakdown</TabsTrigger>
            <TabsTrigger value="assets">Asset Savings</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="scaling">Global Scaling</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            <ValueBreakdownChart data={roiData} />
          </TabsContent>

          <TabsContent value="assets">
            <AssetSavingsChart data={roiData} />
          </TabsContent>

          <TabsContent value="distribution">
            <ValueDistributionChart data={roiData} />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineComparisonChart data={roiData} />
          </TabsContent>

          <TabsContent value="scaling">
            <GlobalScalingChart data={roiData} />
          </TabsContent>
        </Tabs>

        {/* Architecture Downloads */}
      <ArchitectureDownload />

      <ArchitectureDiagramDownload />

        {/* Key Assumptions */}
        <div className="bg-muted/50 rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Assumptions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Annual Assets</p>
              <p className="font-medium text-foreground">{roiData.assumptions.annualAssets}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Localization Rate</p>
              <p className="font-medium text-foreground">
                {ROICalculatorService.formatPercentage(roiData.assumptions.localizationRate * 100)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Markets/Asset</p>
              <p className="font-medium text-foreground">{roiData.assumptions.avgMarketsPerAsset.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">TM Leverage</p>
              <p className="font-medium text-foreground">
                {ROICalculatorService.formatPercentage(roiData.assumptions.tmLeverageRate * 100)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;