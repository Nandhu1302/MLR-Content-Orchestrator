import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import { ROICalculatorService } from '@/services/roiCalculator';
import { ValueBreakdownChart } from '@/components/roi/ValueBreakdownChart';
import { AssetSavingsChart } from '@/components/roi/AssetSavingsChart';
import { ValueDistributionChart } from '@/components/roi/ValueDistributionChart';
import { TimelineComparisonChart } from '@/components/roi/TimelineComparisonChart';
import { GlobalScalingChart } from '@/components/roi/GlobalScalingChart';

export const ExecutiveDashboard = () => {
  const [scenario, setScenario] = useState('moderate');
  const [showAssumptions, setShowAssumptions] = useState(false);
  const roiData = ROICalculatorService.calculateROI(ROICalculatorService.getScenarioAssumptions(scenario));

  const handleExportROI = () => {
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
    `;

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roi-analysis-${scenario}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">ROI Analysis Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Intelligence-Driven Content Operations & Global Amplification
          </p>
        </div>
        <Button variant="outline" onClick={handleExportROI}>
          <Download className="h-4 w-4 mr-2" />
          Export ROI Report
        </Button>
      </div>

      {/* Scenario Selector */}
      <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
        <span className="text-sm font-medium text-foreground">Analysis Scenario:</span>
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
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Total Annual Value</p>
          <p className="text-4xl font-bold text-primary">
            {ROICalculatorService.formatCurrency(roiData.totalValue)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Domestic Operations</p>
          <p className="text-3xl font-bold text-foreground">
            {ROICalculatorService.formatCurrency(roiData.domestic.total)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {((roiData.domestic.total / roiData.totalValue) * 100).toFixed(0)}% of total
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
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

      {/* Assumptions Panel */}
      <div className="bg-muted/50 rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/70 transition-colors"
        >
          <h3 className="text-lg font-semibold text-foreground">Key Assumptions</h3>
          {showAssumptions ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        
        {showAssumptions && (
          <div className="p-4 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
        )}
      </div>
    </div>
  );
};