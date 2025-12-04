import { Button } from '@/components/ui/button';
import { DollarSign, Clock, Globe, Users, Calculator, FileText, Download, Presentation } from 'lucide-react';
import { ROICalculatorService } from '@/services/roiCalculator';
import { useNavigate } from 'react-router-dom';

export const OverviewTab = () => {
  const roiData = ROICalculatorService.calculateROI();
  const navigate = useNavigate();

  const quickStats = [
    {
      icon: DollarSign,
      label: 'Annual Value per Brand',
      value: ROICalculatorService.formatCurrency(roiData.totalValue),
      subtext: 'Total ROI potential',
    },
    {
      icon: Clock,
      label: 'Time Savings',
      value: '75%',
      subtext: 'Faster time-to-market',
    },
    {
      icon: Globe,
      label: 'Markets Supported',
      value: '15+',
      subtext: 'Languages configured',
    },
    {
      icon: Users,
      label: 'MLR Approval Rate',
      value: '90%',
      subtext: 'First-pass approval',
    },
  ];

  const quickActions = [
    {
      label: 'View Client Proposals',
      description: 'BI Glocalization & UCB RFP responses',
      icon: Users,
      onClick: () => window.location.hash = 'clients',
      variant: 'default',
    },
    {
      label: 'Calculate ROI',
      description: 'Interactive analysis with scenarios',
      icon: Calculator,
      onClick: () => window.location.hash = 'roi',
      variant: 'default',
    },
    {
      label: 'Executive Summary',
      description: '2-page printable PDF report',
      icon: FileText,
      onClick: () => window.location.hash = 'summary',
      variant: 'outline',
    },
    {
      label: 'Marketing Materials',
      description: 'Deck & video generator',
      icon: Presentation,
      onClick: () => window.location.hash = 'marketing',
      variant: 'outline',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl border border-border p-12">
        <div className="relative z-10">
          <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-xs font-medium text-primary">One-Stop Business Hub</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Brand Excellence Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Comprehensive ROI analysis, client proposals, marketing materials, and technical documentation 
            — all in one unified hub for stakeholder engagement
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Key Metrics</h2>
        <div className="grid grid-cols-4 gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {action.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <Button 
                  variant={action.variant} 
                  className="w-full"
                  onClick={action.onClick}
                >
                  Go to {action.label}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Value Proposition */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary-hover text-primary-foreground rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-4">Platform Value Proposition</h2>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold mb-2">$4.3M</div>
            <p className="text-base opacity-90">Annual value per brand in operational savings and efficiency gains</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">16 Weeks</div>
            <p className="text-base opacity-90">From prototype to production vs 12-18 months traditional build</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">60% Complete</div>
            <p className="text-base opacity-90">Working prototype with 7 operational phases already built</p>
          </div>
        </div>
      </div>

      {/* Recent Highlights */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Recent Updates</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg">✓</span>
            <span className="text-muted-foreground">Boehringer Ingelheim Glocalization Proposal: 16-slide presentation with $1.2M Year 1 savings projection</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg">✓</span>
            <span className="text-muted-foreground">UCB RFP Response: 70+ slide strategic response with prototype-based timeline</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg">✓</span>
            <span className="text-muted-foreground">Demo Proof Points: 92% TM leverage, 91/100 quality score, 15 languages supported</span>
          </li>
        </ul>
      </div>
    </div>
  );
};