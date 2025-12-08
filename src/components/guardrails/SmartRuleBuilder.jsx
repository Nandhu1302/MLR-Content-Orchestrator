import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Save, AlertTriangle } from "lucide-react";
// Type imports removed
import { SmartRuleEngine } from "@/services/smartRuleEngine";
import { useBrand } from "@/contexts/BrandContext";
import { toast } from "sonner";

// Interface and type annotations removed
export const SmartRuleBuilder = ({
  rule,
  onSave,
  onCancel
}) => {
  const { selectedBrand } = useBrand();
  const [isLoading, setIsLoading] = useState(false);
  
  // Rule basic properties
  // Type assertions removed
  const [ruleName, setRuleName] = useState(rule?.rule_name || '');
  const [ruleType, setRuleType] = useState(rule?.rule_type || 'conditional');
  const [ruleCategory, setRuleCategory] = useState(rule?.rule_category || 'messaging');
  const [priority, setPriority] = useState(rule?.priority || 100);
  const [appliesTo, setAppliesTo] = useState(rule?.applies_to || ['brand']);

  // Context filters
  // Type assertions removed
  const [audienceFilters, setAudienceFilters] = useState(
    rule?.context_filters?.audience || []
  );
  const [marketFilters, setMarketFilters] = useState(
    rule?.context_filters?.market || []
  );
  const [channelFilters, setChannelFilters] = useState(
    rule?.context_filters?.channel || []
  );

  // Rule conditions and actions
  const [conditions, setConditions] = useState(
    rule?.conditions.if || { operator: 'AND', conditions: [] }
  );
  const [thenActions, setThenActions] = useState(
    rule?.conditions.then || []
  );
  const [elseActions, setElseActions] = useState(
    rule?.conditions.else || []
  );

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
      // Type assertions removed
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
    // Type annotation removed
    const newCondition = {
      field: 'content',
      operator: 'contains',
      value: ''
    };
    setConditions({
      ...conditions,
      conditions: [...conditions.conditions, newCondition]
    });
  };

  // Type annotations removed
  const updateCondition = (index, updates) => {
    const newConditions = [...conditions.conditions];
    // Type assertion removed
    newConditions[index] = { ...newConditions[index], ...updates };
    setConditions({
      ...conditions,
      conditions: newConditions
    });
  };

  // Type annotation removed
  const removeCondition = (index) => {
    setConditions({
      ...conditions,
      conditions: conditions.conditions.filter((_, i) => i !== index)
    });
  };

  // Type annotation removed
  const addAction = (type) => {
    // Type annotation removed
    const newAction = {
      type: 'warn',
      message: '',
      severity: 'medium'
    };

    if (type === 'then') {
      setThenActions([...thenActions, newAction]);
    } else {
      setElseActions([...elseActions, newAction]);
    }
  };

  // Type annotations removed
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

  // Type annotations removed
  const removeAction = (type, index) => {
    if (type === 'then') {
      setThenActions(thenActions.filter((_, i) => i !== index));
    } else {
      setElseActions(elseActions.filter((_, i) => i !== index));
    }
  };

  // Type annotations removed
  const addFilter = (type, value) => {
    if (!value.trim()) return;

    switch (type) {
      case 'audience':
        if (!audienceFilters.includes(value)) {
          setAudienceFilters([...audienceFilters, value]);
        }
        break;
      case 'market':
        if (!marketFilters.includes(value)) {
          setMarketFilters([...marketFilters, value]);
        }
        break;
      case 'channel':
        if (!channelFilters.includes(value)) {
          setChannelFilters([...channelFilters, value]);
        }
        break;
    }
  };

  // Type annotations removed
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g., HCP Content Medical Claims Validation"
              />
            </div>
            <div className="space-y-2">
              <Label>Rule Type</Label>
              {/* Type assertion removed */}
              <Select value={ruleType} onValueChange={(value) => setRuleType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ruleTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rule Category</Label>
              {/* Type assertion removed */}
              <Select value={ruleCategory} onValueChange={(value) => setRuleCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ruleCategoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority (Higher = More Important)</Label>
              <Input
                id="priority"
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                min="1"
                max="1000"
              />
            </div>
          </div>

          {/* Context Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Context Filters</h3>
            <div className="grid grid-cols-3 gap-4">
              <FilterSection
                title="Audience"
                filters={audienceFilters}
                onAdd={(value) => addFilter('audience', value)}
                onRemove={(value) => removeFilter('audience', value)}
                placeholder="e.g., HCP, Patient, Caregiver"
              />
              <FilterSection
                title="Market"
                filters={marketFilters}
                onAdd={(value) => addFilter('market', value)}
                onRemove={(value) => removeFilter('market', value)}
                placeholder="e.g., US, EU, APAC"
              />
              <FilterSection
                title="Channel"
                filters={channelFilters}
                onAdd={(value) => addFilter('channel', value)}
                onRemove={(value) => removeFilter('channel', value)}
                placeholder="e.g., Email, Print, Digital"
              />
            </div>
          </div>

          <Separator />

          {/* Rule Conditions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Conditions (IF)</h3>
              <div className="flex items-center gap-2">
                <Label>Logic:</Label>
                {/* Type assertion removed */}
                <Select 
                  value={conditions.operator} 
                  onValueChange={(value) => setConditions({...conditions, operator: value})}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              {conditions.conditions.map((condition, index) => (
                <ConditionBuilder
                  key={index}
                  condition={condition}
                  fields={conditionFields}
                  operators={conditionOperators}
                  onChange={(updates) => updateCondition(index, updates)}
                  onRemove={() => removeCondition(index)}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCondition}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Condition
              </Button>
            </div>
          </div>

          <Separator />

          {/* THEN Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Actions (THEN)</h3>
            <div className="space-y-3">
              {thenActions.map((action, index) => (
                <ActionBuilder
                  key={index}
                  action={action}
                  actionTypes={actionTypes}
                  severities={actionSeverities}
                  onChange={(updates) => updateAction('then', index, updates)}
                  onRemove={() => removeAction('then', index)}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addAction('then')}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add THEN Action
              </Button>
            </div>
          </div>

          {/* ELSE Actions (Optional) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Actions (ELSE) - Optional</h3>
            <div className="space-y-3">
              {elseActions.map((action, index) => (
                <ActionBuilder
                  key={index}
                  action={action}
                  actionTypes={actionTypes}
                  severities={actionSeverities}
                  onChange={(updates) => updateAction('else', index, updates)}
                  onRemove={() => removeAction('else', index)}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addAction('else')}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add ELSE Action
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Rule'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper Components
// Interface and type annotations removed
const FilterSection = ({
  title,
  filters,
  onAdd,
  onRemove,
  placeholder
}) => {
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

// Interface and type annotations removed
const ConditionBuilder = ({
  condition,
  fields,
  operators,
  onChange,
  onRemove
}) => {
  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg">
      <Select value={condition.field} onValueChange={(value) => onChange({ field: value })}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fields.map(field => (
            <SelectItem key={field.value} value={field.value}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type assertion removed */}
      <Select value={condition.operator} onValueChange={(value) => onChange({ operator: value })}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {operators.map(op => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        value={condition.value}
        onChange={(e) => onChange({ value: e.target.value })}
        placeholder="Value"
        className="flex-1"
      />

      <Button type="button" size="sm" variant="outline" onClick={onRemove}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

// Interface and type annotations removed
const ActionBuilder = ({
  action,
  actionTypes,
  severities,
  onChange,
  onRemove
}) => {
  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg">
      {/* Type assertion removed */}
      <Select value={action.type} onValueChange={(value) => onChange({ type: value })}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {actionTypes.map(type => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type assertion removed */}
      <Select value={action.severity} onValueChange={(value) => onChange({ severity: value })}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {severities.map(severity => (
            <SelectItem key={severity.value} value={severity.value}>
              {severity.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        value={action.message}
        onChange={(e) => onChange({ message: e.target.value })}
        placeholder="Message"
        className="flex-1"
      />

      <Input
        value={action.suggested_fix || ''}
        onChange={(e) => onChange({ suggested_fix: e.target.value })}
        placeholder="Suggested fix (optional)"
        className="flex-1"
      />

      <Button type="button" size="sm" variant="outline" onClick={onRemove}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};