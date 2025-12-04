
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Save, AlertTriangle } from "lucide-react";
import { SmartRuleEngine } from "@/services/smartRuleEngine";
import { useBrand } from "@/contexts/BrandContext";
import { toast } from "sonner";

export const SmartRuleBuilder = ({ rule, onSave, onCancel }) => {
  const { selectedBrand } = useBrand();
  const [isLoading, setIsLoading] = useState(false);

  // Rule basic properties
  const [ruleName, setRuleName] = useState(rule?.rule_name || '');
  const [ruleType, setRuleType] = useState(rule?.rule_type || 'conditional');
  const [ruleCategory, setRuleCategory] = useState(rule?.rule_category || 'messaging');
  const [priority, setPriority] = useState(rule?.priority || 100);
  const [appliesTo, setAppliesTo] = useState(rule?.applies_to || ['brand']);

  // Context filters
  const [audienceFilters, setAudienceFilters] = useState(rule?.context_filters?.audience || []);
  const [marketFilters, setMarketFilters] = useState(rule?.context_filters?.market || []);
  const [channelFilters, setChannelFilters] = useState(rule?.context_filters?.channel || []);

  // Rule conditions and actions
  const [conditions, setConditions] = useState(rule?.conditions.if || { operator: 'AND', conditions: [] });
  const [thenActions, setThenActions] = useState(rule?.conditions.then || []);
  const [elseActions, setElseActions] = useState(rule?.conditions.else || []);

  const ruleTypeOptions = [
    { value: 'conditional', label: 'Conditional Logic' },
    { value: 'validation', label: 'Content Validation' },
    { value: 'formatting', label: 'Format Requirements' },
    { value: 'regulatory', label: 'Regulatory Compliance' }
  ];

  const ruleCategoryOptions = [
    { value: 'messaging', label: 'Messaging' },
    { value: 'tone', label: 'Tone & Voice' },
    { value: 'regulatory', label: 'Regulatory' },
    { value: 'visual', label: 'Visual Guidelines' },
    { value: 'competitive', label: 'Competitive' }
  ];

  const conditionFields = [
    { value: 'content', label: 'Content Text' },
    { value: 'content_length', label: 'Content Length' },
    { value: 'word_count', label: 'Word Count' },
    { value: 'sentence_count', label: 'Sentence Count' },
    { value: 'audience', label: 'Target Audience' },
    { value: 'channel', label: 'Channel' },
    { value: 'market', label: 'Market' }
  ];

  const conditionOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'in', label: 'In List' },
    { value: 'regex', label: 'Regex Match' }
  ];

  const actionTypes = [
    { value: 'block', label: 'Block Content' },
    { value: 'warn', label: 'Show Warning' },
    { value: 'suggest', label: 'Make Suggestion' },
    { value: 'modify', label: 'Auto Modify' },
    { value: 'flag', label: 'Flag for Review' }
  ];

  const actionSeverities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const handleSave = async () => {
    if (!selectedBrand || !ruleName.trim()) {
      toast.error('Please provide a rule name');
      return;
    }
    if (conditions.conditions.length === 0) {
      toast.error('Please add at least one condition');
      return;
    }
    if (thenActions.length === 0) {
      toast.error('Please add at least one action for the "then" clause');
      return;
    }

    setIsLoading(true);
    try {
      const ruleData = {
        brand_id: selectedBrand.id,
        rule_name: ruleName,
        rule_type: ruleType,
        rule_category: ruleCategory,
        context_filters: {
          audience: audienceFilters.length > 0 ? audienceFilters : undefined,
          market: marketFilters.length > 0 ? marketFilters : undefined,
          channel: channelFilters.length > 0 ? channelFilters : undefined
        },
        conditions: {
          if: conditions,
          then: thenActions,
          else: elseActions.length > 0 ? elseActions : undefined
        },
        actions: [...thenActions, ...elseActions],
        priority,
        is_active: true,
        applies_to: appliesTo
      };

      let savedRule;
      if (rule?.id) {
        savedRule = await SmartRuleEngine.updateRule(rule.id, ruleData);
        toast.success('Rule updated successfully');
      } else {
        savedRule = await SmartRuleEngine.createRule(ruleData);
        toast.success('Rule created successfully');
      }
      onSave?.(savedRule);
    } catch (error) {
      console.error('Failed to save rule:', error);
      toast.error('Failed to save rule');
    } finally {
      setIsLoading(false);
    }
  };

  const addCondition = () => {
    const newCondition = { field: 'content', operator: 'contains', value: '' };
    setConditions({ ...conditions, conditions: [...conditions.conditions, newCondition] });
  };

  const updateCondition = (index, updates) => {
    const newConditions = [...conditions.conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setConditions({ ...conditions, conditions: newConditions });
  };

  const removeCondition = (index) => {
    setConditions({ ...conditions, conditions: conditions.conditions.filter((_, i) => i !== index) });
  };

  const addAction = (type) => {
    const newAction = { type: 'warn', message: '', severity: 'medium' };
    if (type === 'then') {
      setThenActions([...thenActions, newAction]);
    } else {
      setElseActions([...elseActions, newAction]);
    }
  };

  const updateAction = (type, index, updates) => {
    if (type === 'then') {
      const newActions = [...thenActions];
      newActions[index] = { ...newActions[index], ...updates };
      setThenActions(newActions);
    } else {
      const newActions = [...elseActions];
      newActions[index] = { ...newActions[index], ...updates };
      setElseActions(newActions);
    }
  };

  const removeAction = (type, index) => {
    if (type === 'then') {
      setThenActions(thenActions.filter((_, i) => i !== index));
    } else {
      setElseActions(elseActions.filter((_, i) => i !== index));
    }
  };

  const addFilter = (type, value) => {
    if (!value.trim()) return;
    switch (type) {
      case 'audience':
        if (!audienceFilters.includes(value)) setAudienceFilters([...audienceFilters, value]);
        break;
      case 'market':
        if (!marketFilters.includes(value)) setMarketFilters([...marketFilters, value]);
        break;
      case 'channel':
        if (!channelFilters.includes(value)) setChannelFilters([...channelFilters, value]);
        break;
    }
  };

  const removeFilter = (type, value) => {
    switch (type) {
      case 'audience':
        setAudienceFilters(audienceFilters.filter(f => f !== value));
        break;
      case 'market':
        setMarketFilters(marketFilters.filter(f => f !== value));
        break;
      case 'channel':
        setChannelFilters(channelFilters.filter(f => f !== value));
        break;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Rule Builder</CardTitle>
          <CardDescription>
            Create intelligent rules with conditional logic for dynamic content validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Rule Properties */}
          {/* Context Filters */}
          {/* Conditions */}
          {/* Actions */}
          {/* Save and Cancel Buttons */}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper Components
const FilterSection = ({ title, filters, onAdd, onRemove, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const handleAdd = () => {
    onAdd(inputValue);
    setInputValue('');
  };
  return (
    <div className="space-y-2">
      <Label>{title}</Label>
      <div className="flex gap-1">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button type="button" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {filters.map((filter) => (
          <Badge key={filter} variant="secondary" className="text-xs">
            {filter}
            <button
              type="button"
              className="ml-1 hover:text-destructive"
              onClick={() => onRemove(filter)}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

const ConditionBuilder = ({ condition, fields, operators, onChange, onRemove }) => (
  <div className="flex items-center gap-2 p-3 border rounded-lg">
    {/* Field Select */}
    {/* Operator Select */}
    {/* Value Input */}
    {/* Remove Button */}
  </div>
);

const ActionBuilder = ({ action, actionTypes, severities, onChange, onRemove }) => (
  <div className="flex items-center gap-2 p-3 border rounded-lg">
    {/* Action Type Select */}
    {/* Severity Select */}
    {/* Message Input */}
    {/* Suggested Fix Input */}
    {/* Remove Button */}
  </div>
);
