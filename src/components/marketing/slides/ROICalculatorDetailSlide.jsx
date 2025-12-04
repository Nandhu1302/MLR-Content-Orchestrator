
import { useState } from 'react';
import { Calculator } from 'lucide-react';

const ROICalculatorDetailSlide = () => {
  const [assumptions] = useState({
    brands: 3,
    markets: 15,
    assetsPerBrand: 120,
    currentCostPerAsset: 12000,
    currentCycleWeeks: 8,
  });

  const domesticValue =
    assumptions.brands *
    assumptions.assetsPerBrand *
    (assumptions.currentCostPerAsset * 0.57);

  const globalValue =
    assumptions.brands *
    assumptions.assetsPerBrand *
    assumptions.markets *
    0.4 *
    1800;

  const totalAnnualValue = domesticValue + globalValue;
  const perBrandValue = totalAnnualValue / assumptions.brands;

  return (
    <div className="w-full h-full bg-background p-16">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-foreground mb-4">
          ROI Calculator - Your Brand
        </h2>
        <p className="text-2xl text-muted-foreground">Customized Value Projection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Assumptions */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">Input Assumptions</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Brands in Scope</p>
              <p className="text-3xl font-bold text-primary">{assumptions.brands}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Global Markets</p>
              <p className="text-3xl font-bold text-primary">{assumptions.markets}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Assets per Brand/Year</p>
              <p className="text-3xl font-bold text-primary">{assumptions.assetsPerBrand}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Current Cost per Asset</p>
              <p className="text-3xl font-bold text-primary">
                ${assumptions.currentCostPerAsset.toLocaleString()}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Current Cycle Time</p>
              <p className="text-3xl font-bold text-primary">
                {assumptions.currentCycleWeeks} weeks
              </p>
            </div>
          </div>
        </div>

        {/* Projected Annual Value */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Projected Annual Value
          </h3>

          {/* Domestic Value */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-6 mb-6">
            <p className="text-lg text-muted-foreground mb-2">Domestic Operations Value</p>
            <p className="text-4xl font-bold text-primary mb-4">
              ${(domesticValue / 1000000).toFixed(2)}M
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Content velocity improvements</li>
              <li>• Quality & compliance gains</li>
              <li>• Team productivity boost</li>
            </ul>
          </div>

          {/* Global Value */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-6 mb-6">
            <p className="text-lg text-muted-foreground mb-2">Global Amplification Value</p>
            <p className="text-4xl font-bold text-primary mb-4">
              ${(globalValue / 1000000).toFixed(2)}M
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Localization efficiency (56% cost reduction)</li>
              <li>• Market expansion capability</li>
              <li>• Consistency improvements</li>
            </ul>
          </div>

          {/* Total Annual Value */}
          <div className="bg-primary/10 border-2 border-primary rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xl font-bold text-foreground">Total Annual Value</p>
              <p className="text-5xl font-bold text-primary">
                ${(totalAnnualValue / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">Per Brand</p>
                <p className="text-2xl font-bold text-primary">
                  ${(perBrandValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payback Period</p>
                <p className="text-2xl font-bold text-primary">4.2 months</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculatorDetailSlide;
