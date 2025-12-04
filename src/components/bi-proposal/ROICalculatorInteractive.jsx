import { useState } from 'react';
import { roiMetrics } from '@/utils/biProposalData';
import { Slider } from '@/components/ui/slider';

export const ROICalculatorInteractive = () => {
  const [projectsPerYear, setProjectsPerYear] = useState(50);
  const [avgCostPerProject, setAvgCostPerProject] = useState(30000);

  const traditionalCost = projectsPerYear * avgCostPerProject;
  const withPlatformCost = 641000 + (projectsPerYear * avgCostPerProject * 0.4);
  const year1Savings = traditionalCost - withPlatformCost;
  const year2PlusSavings = traditionalCost - (216000 + projectsPerYear * avgCostPerProject * 0.4);

  return (
    <div className="space-y-8">
      {/* Interactive Controls */}
      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <h3 className="text-2xl font-bold text-foreground mb-6">Adjust Your Assumptions</h3>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-medium text-foreground">Localization Projects per Year</label>
            <span className="text-2xl font-bold text-primary">{projectsPerYear}</span>
          </div>
          <Slider
            value={[projectsPerYear]}
            onValueChange={(value) => setProjectsPerYear(value[0])}
            min={10}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-medium text-foreground">Avg Cost per Project (Traditional)</label>
            <span className="text-2xl font-bold text-primary">${(avgCostPerProject / 1000).toFixed(0)}K</span>
          </div>
          <Slider
            value={[avgCostPerProject]}
            onValueChange={(value) => setAvgCostPerProject(value[0])}
            min={10000}
            max={100000}
            step={5000}
            className="w-full"
          />
        </div>
      </div>

      {/* Comparison Table */}
      <div className="grid grid-cols-2 gap-6">
        {/* Traditional Build */}
        <div className="bg-destructive/5 border-2 border-destructive/30 rounded-xl p-8 space-y-4">
          <h3 className="text-3xl font-bold text-destructive mb-6">Traditional Ground-Up Build</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-base text-muted-foreground">Timeline</span>
              <span className="text-lg font-semibold text-foreground">{roiMetrics.traditional.timeline}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-base text-muted-foreground">Implementation Cost</span>
              <span className="text-lg font-semibold text-foreground">{roiMetrics.traditional.cost}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-base text-muted-foreground">Team Size</span>
              <span className="text-lg font-semibold text-foreground">{roiMetrics.traditional.team}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-base text-muted-foreground">Risk Level</span>
              <span className="text-lg font-semibold text-destructive">{roiMetrics.traditional.risk}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-base text-muted-foreground">First Value</span>
              <span className="text-lg font-semibold text-foreground">{roiMetrics.traditional.firstValue}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-destructive/10 rounded-lg px-4 mt-4">
              <span className="text-lg font-bold text-foreground">Year 1 Total Cost</span>
              <span className="text-2xl font-bold text-destructive">
                ${((traditionalCost + 1500000) / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>
        </div>

        {/* Prototype-Based */}
        <div className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-xl p-8 space-y-4">
          <h3 className="text-3xl font-bold text-emerald-600 mb-6">Prototype-Based Approach</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-base text-muted-foreground">Timeline</span>
              <span className="text-lg font-semibold text-foreground">{roiMetrics.prototype.timeline}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-base text-muted-foreground">Implementation Cost</span>
              <span className="text-lg font-semibold text-foreground">{roiMetrics.prototype.cost}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-base text-muted-foreground">Team Size</span>
              <span className="text-lg font-semibold text-foreground">{roiMetrics.prototype.team}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-base text-muted-foreground">Risk Level</span>
              <span className="text-lg font-semibold text-emerald-600">{roiMetrics.prototype.risk}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-base text-muted-foreground">First Value</span>
              <span className="text-lg font-semibold text-foreground">{roiMetrics.prototype.firstValue}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-emerald-500/10 rounded-lg px-4 mt-4">
              <span className="text-lg font-bold text-foreground">Year 1 Total Cost</span>
              <span className="text-2xl font-bold text-emerald-600">
                ${((withPlatformCost / 1000000).toFixed(2))}M
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Summary */}
      <div className="bg-primary/5 border-2 border-primary rounded-xl p-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-emerald-600 mb-2">
              ${(year1Savings / 1000000).toFixed(2)}M
            </div>
            <p className="text-lg text-muted-foreground">Year 1 Savings</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-emerald-600 mb-2">
              ${(year2PlusSavings / 1000000).toFixed(2)}M
            </div>
            <p className="text-lg text-muted-foreground">Year 2+ Annual Savings</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-primary mb-2">
              {Math.round((641000 / year1Savings) * 12)} mo
            </div>
            <p className="text-lg text-muted-foreground">Payback Period</p>
          </div>
        </div>
      </div>
    </div>
  );
};