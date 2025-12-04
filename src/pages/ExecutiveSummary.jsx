import { ROICalculatorService } from '@/services/roiCalculator';
import { GanttChartDownload } from '@/components/GanttChartDownload';
import { ProjectPlanDownload } from '@/components/ProjectPlanDownload';

const ExecutiveSummary = ({ embedded = false }) => {
  const roiData = ROICalculatorService.calculateROI();

  return (
    <div className={embedded ? "bg-background" : "min-h-screen bg-background"}>
      <div className={embedded ? "max-w-full p-6" : "max-w-[8.5in] mx-auto p-12 print:p-8"}>
        {/* Header */}
        <div className="mb-8 pb-6 border-b-2 border-primary">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Platform ROI Analysis: Executive Summary
              </h1>
              <p className="text-muted-foreground text-sm">
                Intelligence-Driven Content Operations & Global Amplification
              </p>
            </div>
            <div className="print:hidden flex gap-2">
              <ProjectPlanDownload />
              <GanttChartDownload />
            </div>
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>Prepared: {new Date().toLocaleDateString()}</span>
            <span>Analysis Date: {roiData.calculatedAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* The Big Number */}
        <div className="text-center mb-10 py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border-2 border-primary">
          <div className="text-7xl font-bold text-primary mb-2">
            {ROICalculatorService.formatCurrency(roiData.totalValue)}
          </div>
          <div className="text-2xl font-semibold text-foreground">
            Annual Value Per Brand
          </div>
          <div className="flex justify-center gap-12 mt-6">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {ROICalculatorService.formatCurrency(roiData.domestic.total)}
              </div>
              <div className="text-sm text-muted-foreground">Domestic Operations</div>
            </div>
            <div className="h-16 w-px bg-border" />
            <div>
              <div className="text-3xl font-bold text-foreground">
                {ROICalculatorService.formatCurrency(roiData.global.total)}
              </div>
              <div className="text-sm text-muted-foreground">Global Amplification</div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-success mb-1">75%</div>
            <div className="text-sm text-muted-foreground">Faster Time-to-Market</div>
            <div className="text-xs text-muted-foreground mt-1">
              12 weeks → 3 weeks for complex assets
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-success mb-1">90%</div>
            <div className="text-sm text-muted-foreground">MLR First-Pass Approval</div>
            <div className="text-xs text-muted-foreground mt-1">vs 40% baseline</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-1">102</div>
            <div className="text-sm text-muted-foreground">Localized Assets/Year</div>
            <div className="text-xs text-muted-foreground mt-1">34 assets × 3 markets</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-1">30%</div>
            <div className="text-sm text-muted-foreground">TM Leverage</div>
            <div className="text-xs text-muted-foreground mt-1">Translation cost reduction</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-success mb-1">40%</div>
            <div className="text-sm text-muted-foreground">Labor Efficiency Gain</div>
            <div className="text-xs text-muted-foreground mt-1">Asset production capacity increase</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-success mb-1">12-18mo*</div>
            <div className="text-sm text-muted-foreground">Payback Period</div>
            <div className="text-xs text-muted-foreground mt-1">Investment return timeline</div>
          </div>
        </div>

        {/* Value Breakdown Tables */}
        <div className="mb-10 space-y-6">
          <div className="border-2 border-primary rounded-lg overflow-hidden">
            <div className="bg-primary text-primary-foreground px-4 py-3 font-semibold text-lg flex justify-between items-center">
              <span>DOMESTIC OPERATIONS VALUE</span>
              <span>{ROICalculatorService.formatCurrency(roiData.domestic.total)} (72%)</span>
            </div>
            <div className="bg-card">
              {[
                { label: 'Labor Efficiency Gains', value: roiData.domestic.components.laborEfficiency },
                { label: 'MLR Cycle Reduction', value: roiData.domestic.components.mlrCycleReduction },
                { label: 'Administrative Reduction', value: roiData.domestic.components.administrative },
                { label: 'Baseline Cost Savings', value: roiData.domestic.components.baselineSavings },
                { label: 'Rework Elimination', value: roiData.domestic.components.reworkElimination },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between px-4 py-3 border-b border-border last:border-b-0"
                >
                  <span className="text-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">
                    {ROICalculatorService.formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 border-accent rounded-lg overflow-hidden">
            <div className="bg-accent text-accent-foreground px-4 py-3 font-semibold text-lg flex justify-between items-center">
              <span>GLOBAL AMPLIFICATION VALUE</span>
              <span>{ROICalculatorService.formatCurrency(roiData.global.total)} (28%)</span>
            </div>
            <div className="bg-card">
              {[
                { label: 'Translation Cost Savings', value: roiData.global.components.translationSavings },
                { label: 'Regulatory Review Efficiency', value: roiData.global.components.regulatoryEfficiency },
                { label: 'Quality & Consistency', value: roiData.global.components.qualityImprovements },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between px-4 py-3 border-b border-border last:border-b-0"
                >
                  <span className="text-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">
                    {ROICalculatorService.formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Asset Economics Snapshot */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-foreground mb-4">Asset Economics Snapshot</h3>
          <table className="w-full border border-border rounded-lg overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-foreground font-semibold">Asset Type</th>
                <th className="px-4 py-3 text-right text-foreground font-semibold">Volume</th>
                <th className="px-4 py-3 text-right text-foreground font-semibold">Domestic/Asset</th>
                <th className="px-4 py-3 text-right text-foreground font-semibold">Global/Asset</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Total Value</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {[
                { type: 'Email', count: roiData.assumptions.emailCount, data: roiData.byAssetType.email },
                { type: 'DSA', count: roiData.assumptions.dsaCount, data: roiData.byAssetType.dsa },
                { type: 'Website', count: roiData.assumptions.websiteCount, data: roiData.byAssetType.website },
              ].map((item, idx) => (
                <tr key={idx} className="border-t border-border">
                  <td className="px-4 py-3 text-foreground font-medium">{item.type}</td>
                  <td className="px-4 py-3 text-right text-foreground">{item.count}</td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {ROICalculatorService.formatCurrency(item.data.domestic)}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {ROICalculatorService.formatCurrency(item.data.global)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    {ROICalculatorService.formatCurrency(item.data.total * item.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer - Key Assumptions */}
        <div className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground mb-2">Key Assumptions:</p>
          <p>• Based on {roiData.assumptions.annualAssets} annual assets ({roiData.assumptions.emailCount} emails, {roiData.assumptions.dsaCount} DSAs, {roiData.assumptions.websiteCount} websites)</p>
          <p>• 34 assets localized (24 emails @ 40%, 5 DSAs @ 50%, 5 websites @ 50%) across 3 international markets = 102 total market adaptations</p>
          <p>• {ROICalculatorService.formatPercentage(roiData.assumptions.tmLeverageRate * 100)} Translation Memory leverage, baseline translation costs vary by asset type</p>
          <p>• Calculations assume mid-size pharma brand baseline operations with industry-standard metrics</p>
          <p className="mt-3 pt-3 border-t border-border italic">
            * Payback period is a rough estimation based on typical platform implementation costs 
            (licensing, setup, training, integration) ranging from $2.2M-$3.3M against the 
            {ROICalculatorService.formatCurrency(roiData.totalValue)} annual value. Actual payback 
            may vary based on specific deployment scope and existing infrastructure.
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: letter;
            margin: 0.5in;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:p-8 {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ExecutiveSummary;