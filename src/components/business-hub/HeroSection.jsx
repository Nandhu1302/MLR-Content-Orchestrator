import React from 'react';
import { DollarSign, Clock, Globe } from 'lucide-react';
import { ROICalculatorService } from '@/services/roiCalculator';

export const HeroSection = () => {
  const roiData = ROICalculatorService.calculateROI();

  const quickStats = [
    {
      icon: DollarSign,
      label: 'Annual Value',
      value: ROICalculatorService.formatCurrency(roiData.totalValue),
    },
    {
      icon: Clock,
      label: 'Time Savings',
      value: '40%',
    },
    {
      icon: Globe,
      label: 'Markets Supported',
      value: '12+',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border">
      <div className="px-8 py-12">
        <div className="max-w-4xl">
          <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-xs font-medium text-primary">Business Intelligence</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Business & Marketing Hub
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive ROI analysis, marketing materials, and technical documentation for stakeholders
          </p>
          
          <div className="grid grid-cols-3 gap-6">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};