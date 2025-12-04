
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Settings,
  Globe,
  Clock,
  DollarSign,
  Users,
  Zap,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

export const InteractiveProjectConfigurator = ({
  onConfigurationChange,
  initialConfig = {},
}) => {
  const [config, setConfig] = useState({
    targetMarkets: initialConfig.targetMarkets ?? [],
    timeline: initialConfig.timeline ?? [3],
    budget: initialConfig.budget ?? [15000],
    qualityLevel: initialConfig.qualityLevel ?? [85],
    teamSize: initialConfig.teamSize ?? [4],
    automationLevel: initialConfig.automationLevel ?? [70],
    riskTolerance: initialConfig.riskTolerance ?? [50],
    ...initialConfig,
  });

  const marketOptions = [
    { id: 'us', name: 'United States', flag: '🇺🇸', complexity: 'Low', cost: 1.0 },
    { id: 'de', name: 'Germany', flag: '🇩🇪', complexity: 'Medium', cost: 1.2 },
    { id: 'jp', name: 'Japan', flag: '🇯🇵', complexity: 'High', cost: 1.8 },
    { id: 'cn', name: 'China', flag: '🇨🇳', complexity: 'Very High', cost: 2.1 },
    { id: 'fr', name: 'France', flag: '🇫🇷', complexity: 'Medium', cost: 1.3 },
    { id: 'br', name: 'Brazil', flag: '🇧🇷', complexity: 'High', cost: 1.6 },
  ];

  const updateConfig = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigurationChange?.(newConfig);
  };

  const toggleMarket = (marketId) => {
    const newMarkets = config.targetMarkets.includes(marketId)
      ? config.targetMarkets.filter((id) => id !== marketId)
      : [...config.targetMarkets, marketId];

    updateConfig('targetMarkets', newMarkets);
    toast.success(`Market ${newMarkets.includes(marketId) ? 'added' : 'removed'}`);
  };

  const calculateEstimates = () => {
    const selectedMarkets = marketOptions.filter((m) => config.targetMarkets.includes(m.id));
    const complexityMultiplier =
      (selectedMarkets.reduce((acc, market) => acc + market.cost, 0) /
        (selectedMarkets.length || 1)) || 1;

    const timelineWeeks = config.timeline[0];
    const qualityLevel = config.qualityLevel[0];
    const automationLevel = config.automationLevel[0];

    const estimatedCost = Math.round((config.budget[0] || 0) * complexityMultiplier);
    const estimatedDuration = Math.round(
      timelineWeeks * complexityMultiplier * (1 - automationLevel / 200)
    );
    const riskScore = Math.max(
      0,
      100 - qualityLevel - automationLevel / 2 + complexityMultiplier * 10
    );

    return { estimatedCost, estimatedDuration, riskScore, complexityMultiplier };
  };

  const estimates = calculateEstimates();

  const optimizeConfiguration = () => {
    // Smart optimization based on current settings
    const optimized = { ...config };

    // Optimize timeline for selected markets
    if (config.targetMarkets.length > 3) {
      optimized.timeline = [Math.max(4, config.timeline[0] + 1)];
    }

    // Optimize automation for quality level
    if (config.qualityLevel[0] > 80) {
      optimized.automationLevel = [Math.min(90, config.automationLevel[0] + 10)];
    }

    setConfig(optimized);
    onConfigurationChange?.(optimized);
    toast.success('Configuration optimized');
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Interactive Project Configuration
          </h3>
          <Button variant="outline" onClick={optimizeConfiguration}>
            <Zap className="h-4 w-4 mr-2" />
            Auto-Optimize
          </Button>
        </div>

        {/* Market Selection */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Target Markets ({config.targetMarkets.length} selected)
          </h4>

          <div className="grid grid-cols-2 gap-3">
            {marketOptions.map((market) => {
              const isSelected = config.targetMarkets.includes(market.id);
              return (
                <div
                  key={market.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => toggleMarket(market.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleMarket(market.id)}
                    />
                    <span className="text-lg">{market.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{market.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {market.complexity} complexity • {market.cost}x cost
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline: {config.timeline[0]} weeks
            </h4>
            <Badge variant="outline">Est. {estimates.estimatedDuration} weeks</Badge>
          </div>

          <Slider
            value={config.timeline}
            onValueChange={(value) => updateConfig('timeline', value)}
            max={12}
            min={2}
            step={0.5}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2 weeks (Rush)</span>
            <span>6 weeks (Standard)</span>
            <span>12 weeks (Extended)</span>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget: ${Number(config.budget[0]).toLocaleString()}
            </h4>
            <Badge variant="outline">Est. ${estimates.estimatedCost.toLocaleString()}</Badge>
          </div>

          <Slider
            value={config.budget}
            onValueChange={(value) => updateConfig('budget', value)}
            max={50000}
            min={5000}
            step={1000}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$5K (Basic)</span>
            <span>$25K (Standard)</span>
            <span>$50K (Premium)</span>
          </div>
        </div>

        {/* Quality Level */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Quality Level: {config.qualityLevel[0]}%
          </h4>

          <Slider
            value={config.qualityLevel}
            onValueChange={(value) => updateConfig('qualityLevel', value)}
            max={100}
            min={60}
            step={5}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>60% (Fast)</span>
            <span>85% (Standard)</span>
            <span>100% (Perfect)</span>
          </div>
        </div>

        {/* Team Size */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Size: {config.teamSize[0]} people
          </h4>

          <Slider
            value={config.teamSize}
            onValueChange={(value) => updateConfig('teamSize', value)}
            max={12}
            min={2}
            step={1}
            className="w-full"
          />
        </div>

        {/* Automation Level */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automation Level: {config.automationLevel[0]}%
          </h4>

          <Slider
            value={config.automationLevel}
            onValueChange={(value) => updateConfig('automationLevel', value)}
            max={95}
            min={30}
            step={5}
            className="w-full"
          />
        </div>

        {/* Risk Assessment */}
        <Card className="p-4 bg-muted/50">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Project Risk Assessment
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Overall Risk Score:</span>
              <Badge
                variant={
                  estimates.riskScore > 70
                    ? 'destructive'
                    : estimates.riskScore > 40
                    ? 'secondary'
                    : 'default'
                }
              >
                {Math.round(estimates.riskScore)}%
              </Badge>
            </div>

            <Progress value={estimates.riskScore} className="w-full" />

            <div className="text-xs text-muted-foreground">
              {estimates.riskScore > 70 &&
                'High risk - Consider extending timeline or reducing scope'}
              {estimates.riskScore <= 70 &&
                estimates.riskScore > 40 &&
                'Medium risk - Monitor closely'}
              {estimates.riskScore <= 40 && 'Low risk - Good configuration'}
            </div>
          </div>
        </Card>

        {/* Configuration Summary */}
        <Card className="p-4 bg-primary/5">
          <h4 className="font-medium mb-3">Configuration Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Markets:</span>
              <span className="ml-2 font-medium">{config.targetMarkets.length} selected</span>
            </div>
            <div>
              <span className="text-muted-foreground">Timeline:</span>
              <span className="ml-2 font-medium">{estimates.estimatedDuration} weeks</span>
            </div>
            <div>
              <span className="text-muted-foreground">Budget:</span>
              <span className="ml-2 font-medium">
                ${estimates.estimatedCost.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Team:</span>
              <span className="ml-2 font-medium">{config.teamSize[0]} people</span>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};

InteractiveProjectConfigurator.propTypes = {
  onConfigurationChange: PropTypes.func.isRequired,
  initialConfig: PropTypes.object,
};
