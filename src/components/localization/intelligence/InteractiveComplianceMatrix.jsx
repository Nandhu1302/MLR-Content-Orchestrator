
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import {
  Shield,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  FileText,
  Zap,
  Eye,
  Settings,
} from 'lucide-react';

export const InteractiveComplianceMatrix = ({
  marketRules,
  onRuleSelect,
  onAutomatedCheck,
  onTemplateGenerate,
}) => {
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [matrixView, setMatrixView] = useState('table'); // 'table' | 'heatmap'
  const [selectedRules, setSelectedRules] = useState([]);

  const markets = [...new Set((marketRules || []).map((rule) => rule.market))];
  const categories = [...new Set((marketRules || []).map((rule) => rule.ruleCategory))];

  const filteredRules = (marketRules || []).filter((rule) => {
    return (!selectedMarket || rule.market === selectedMarket) &&
           (!selectedCategory || rule.ruleCategory === selectedCategory);
  });

  const getRiskColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getChangeRequirementIcon = (requirement) => {
    switch (requirement) {
      case 'MUST_CHANGE':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'CANNOT_CHANGE':
        return <Shield className="h-4 w-4 text-red-800" />;
      case 'SHOULD_CHANGE':
        return <ExternalLink className="h-4 w-4 text-yellow-600" />;
      case 'FLEXIBLE':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleRuleToggle = (ruleId) => {
    setSelectedRules((prev) =>
      prev.includes(ruleId) ? prev.filter((id) => id !== ruleId) : [...prev, ruleId]
    );
  };

  const MatrixHeatmapView = () => {
    const heatmapData = markets.map((market) => {
      const marketRulesCount = (marketRules || []).filter((r) => r.market === market);
      const criticalCount = marketRulesCount.filter((r) => r.riskLevel === 'critical').length;
      const highCount = marketRulesCount.filter((r) => r.riskLevel === 'high').length;
      return {
        market,
        total: marketRulesCount.length,
        critical: criticalCount,
        high: highCount,
        score: Math.max(0, 100 - (criticalCount * 25 + highCount * 15)),
      };
    });

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {heatmapData.map((data) => (
            <Card
              key={data.market}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedMarket === data.market ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() =>
                setSelectedMarket(selectedMarket === data.market ? '' : data.market)
              }
            >
              <div className="text-center">
                <h4 className="font-medium mb-2">{data.market}</h4>
                <div
                  className="text-2xl font-bold mb-2"
                  style={{
                    color:
                      data.score >= 80 ? '#16a34a' :
                      data.score >= 60 ? '#eab308' : '#dc2626',
                  }}
                >
                  {data.score}%
                </div>
                <Progress value={data.score} className="mb-2" />
                <div className="text-xs text-muted-foreground">
                  {data.total} rules • {data.critical} critical
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const MatrixTableView = () => (
    <div className="space-y-4">
      {filteredRules.map((rule, index) => {
        const ruleId = `${rule.market}-${rule.ruleCategory}-${index}`;
        const isSelected = selectedRules.includes(ruleId);

        return (
          <Card
            key={ruleId}
            className={`p-4 transition-all hover:shadow-md cursor-pointer ${
              isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => handleRuleToggle(ruleId)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getChangeRequirementIcon(rule.changeRequirement)}
                  <span className="font-medium">{rule.ruleName}</span>
                  <Badge variant="outline">{rule.market}</Badge>
                  <Badge className={`text-xs ${getRiskColor(rule.riskLevel)}`}>{rule.riskLevel}</Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>

                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {rule.ruleCategory}
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    {String(rule.changeRequirement).replace('_', ' ').toLowerCase()}
                  </span>
                  {rule.automatedCheckPossible && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Zap className="h-3 w-3" />
                      Auto-checkable
                    </span>
                  )}
                </div>

                {rule.compliancePattern && (
                  <div className="mt-3 p-2 bg-muted rounded text-xs font-mono">
                    Pattern: {rule.compliancePattern}
                  </div>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{rule.ruleName}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Rule Description</h4>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>

                      {rule.compliancePattern && (
                        <div>
                          <h4 className="font-medium mb-2">Compliance Pattern</h4>
                          <code className="text-xs bg-muted p-2 rounded block">
                            {rule.compliancePattern}
                          </code>
                        </div>
                      )}

                      {rule.templateContent && (
                        <div>
                          <h4 className="font-medium mb-2">Template Content</h4>
                          <div className="text-sm bg-muted p-3 rounded">
                            {rule.templateContent}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button onClick={() => onRuleSelect?.(rule)}>Apply Rule</Button>
                        {rule.templateContent && (
                          <Button variant="outline" onClick={() => onTemplateGenerate?.(rule)}>
                            Generate Template
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {rule.automatedCheckPossible && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAutomatedCheck?.([rule]);
                    }}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Auto-Check
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Interactive Compliance Matrix</h3>

          <div className="flex items-center gap-2">
            <Button
              variant={matrixView === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMatrixView('table')}
            >
              Table View
            </Button>
            <Button
              variant={matrixView === 'heatmap' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMatrixView('heatmap')}
            >
              Heatmap View
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            className="px-3 py-2 border rounded text-sm"
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
          >
            <option value="">All Markets</option>
            {markets.map((market) => (
              <option key={market} value={market}>
                {market}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 border rounded text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {selectedRules.length > 0 && (
            <Button
              onClick={() =>
                onAutomatedCheck?.(
                  selectedRules
                    .map((id) =>
                      filteredRules.find((_, idx) => `${_.market}-${_.ruleCategory}-${idx}` === id)
                    )
                    .filter(Boolean)
                )
              }
            >
              Bulk Auto-Check ({selectedRules.length})
            </Button>
          )}
        </div>

        {/* Matrix Content */}
        {matrixView === 'heatmap' ? <MatrixHeatmapView /> : <MatrixTableView />}

        {/* Summary Stats */}
        <Card className="p-4 bg-muted/50">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {filteredRules.filter((r) => r.riskLevel === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Critical Rules</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-orange-600">
                {filteredRules.filter((r) => r.changeRequirement === 'MUST_CHANGE').length}
              </div>
              <div className="text-sm text-muted-foreground">Must Change</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-blue-600">
                {filteredRules.filter((r) => r.automatedCheckPossible).length}
              </div>
              <div className="text-sm text-muted-foreground">Auto-Checkable</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-green-600">
                {filteredRules.filter((r) => r.templateContent).length}
              </div>
              <div className="text-sm text-muted-foreground">With Templates</div>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};

InteractiveComplianceMatrix.propTypes = {
  marketRules: PropTypes.arrayOf(
    PropTypes.shape({
      market: PropTypes.string.isRequired,
      ruleCategory: PropTypes.string.isRequired,
      ruleName: PropTypes.string.isRequired,
      changeRequirement: PropTypes.string.isRequired, // 'MUST_CHANGE' | 'CANNOT_CHANGE' | 'SHOULD_CHANGE' | 'FLEXIBLE'
      riskLevel: PropTypes.string.isRequired,         // 'low' | 'medium' | 'high' | 'critical'
      description: PropTypes.string.isRequired,
      compliancePattern: PropTypes.string,
      automatedCheckPossible: PropTypes.bool.isRequired,
      templateContent: PropTypes.string,
    })
  ).isRequired,
  onRuleSelect: PropTypes.func,
  onAutomatedCheck: PropTypes.func,
  onTemplateGenerate: PropTypes.func,
};
