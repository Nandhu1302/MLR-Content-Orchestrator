
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, CheckCircle2, Users, Download, Upload, Zap, AlertTriangle } from 'lucide-react';

import { SmartTMIntelligenceService } from '@/services/SmartTMIntelligenceService';

export const EnhancedTerminologyControls = ({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFiltersChange,
  selectedTerms,
  onTermsSelect,
  onBulkOperation,
  onTermApprove,
  brandId,
  assetContext,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false); // kept for parity with original; toggle if you render it
  const [validationStatus, setValidationStatus] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const availableFilters = [
    { id: 'regulatory_status', label: 'Regulatory Status', options: ['approved', 'pending', 'restricted', 'forbidden'] },
    { id: 'cultural_risk', label: 'Cultural Risk', options: ['low', 'medium', 'high'] },
    { id: 'category', label: 'Category', options: ['medical', 'branded', 'general'] },
    { id: 'market', label: 'Market', options: ['US', 'EU', 'Japan', 'China', 'Global'] },
  ];

  const bulkOperations = [
    { id: 'approve', label: 'Approve Terms', icon: CheckCircle2, color: 'text-green-600' },
    { id: 'submit_review', label: 'Submit for Review', icon: Users, color: 'text-blue-600' },
    { id: 'export', label: 'Export Selected', icon: Download, color: 'text-purple-600' },
    { id: 'auto_translate', label: 'Auto-Translate', icon: Zap, color: 'text-orange-600' },
  ];

  const handleFilterToggle = useCallback(
    (filterId, option) => {
      const filterKey = `${filterId}:${option}`;
      const newFilters = selectedFilters.includes(filterKey)
        ? selectedFilters.filter((f) => f !== filterKey)
        : [...selectedFilters, filterKey];
      onFiltersChange(newFilters);
    },
    [selectedFilters, onFiltersChange]
  );

  const handleSmartValidation = async (text) => {
    if (!text.trim() || !brandId) return;
    setIsValidating(true);
    try {
      const validation = await SmartTMIntelligenceService.validateTerminologyRealTime(
        text,
        brandId,
        'English',
        assetContext ?? {
          assetType: 'web',
          targetAudience: 'healthcare professionals',
          therapeuticArea: 'General',
          brandGuidelines: {},
          regulatoryRequirements: [],
        }
      );
      setValidationStatus(validation);
    } catch (error) {
      console.error('Smart validation failed:', error);
      setValidationStatus(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleBulkSmartOperations = async (operation) => {
    switch (operation) {
      case 'approve':
        await Promise.all(
          selectedTerms.map(async (term) => {
            // Hook into your approval workflow/store as needed
            console.log('Approving term:', term);
          })
        );
        onTermApprove?.(selectedTerms);
        break;

      case 'auto_translate':
        setIsValidating(true);
        for (const term of selectedTerms) {
          try {
            const tmMatches = await SmartTMIntelligenceService.getAssetSpecificMatches(
              term,
              'English',
              'Spanish', // example target language
              brandId,
              assetContext ?? {}
            );
            console.log(`TM matches for ${term}:`, tmMatches);
          } catch (error) {
            console.error(`Auto-translation failed for ${term}:`, error);
          }
        }
        setIsValidating(false);
        break;

      default:
        onBulkOperation?.(operation, selectedTerms);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terminology by term, definition, or market..."
            value={searchTerm}
            onChange={(e) => {
              onSearchChange?.(e.target.value);
              handleSmartValidation(e.target.value);
            }}
            className="pl-10"
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filters
              {selectedFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedFilters.length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Advanced Terminology Filters</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-6 mt-4">
              {availableFilters.map((filter) => (
                <div key={filter.id} className="space-y-3">
                  <h4 className="font-medium">{filter.label}</h4>
                  <div className="space-y-2">
                    {filter.options.map((option) => {
                      const filterKey = `${filter.id}:${option}`;
                      return (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={filterKey}
                            checked={selectedFilters.includes(filterKey)}
                            onCheckedChange={() => handleFilterToggle(filter.id, option)}
                          />
                          <label htmlFor={filterKey} className="text-sm capitalize">
                            {option}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => onFiltersChange?.([])}>
                Clear All Filters
              </Button>
              <Button onClick={() => setShowAdvancedFilters(false)}>Apply Filters</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Smart Validation Results */}
      {validationStatus && searchTerm.trim() && (
        <Card
          className={`p-3 border-l-4 ${
            validationStatus.isValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {validationStatus.isValid ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">
                Brand Consistency: {validationStatus.brandConsistencyScore}%
              </span>
            </div>

            {validationStatus.suggestions?.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSearchChange?.(validationStatus.suggestions[0])}
              >
                Use Suggestion
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Active Filters Display */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedFilters.map((filter) => {
            const [category, value] = filter.split(':');
            return (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {category}: {value}
                <button
                  onClick={() => onFiltersChange?.(selectedFilters.filter((f) => f !== filter))}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Bulk Actions */}
      {selectedTerms.length > 0 && (
        <Card className="p-3 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="default">{selectedTerms.length} terms selected</Badge>
              <Button variant="ghost" size="sm" onClick={() => onTermsSelect?.([])}>
                Clear Selection
              </Button>
            </div>

            <div className="flex gap-2">
              {bulkOperations.map((operation) => {
                const Icon = operation.icon;
                return (
                  <Button
                    key={operation.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkSmartOperations(operation.id)}
                    className="flex items-center gap-2"
                    disabled={isValidating}
                  >
                    <Icon className={`h-3 w-3 ${operation.color}`} />
                    {operation.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Select onValueChange={(value) => onBulkOperation?.('quick_filter', [value])}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Quick filter..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Only Approved</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="high_risk">High Cultural Risk</SelectItem>
              <SelectItem value="medical">Medical Terms</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => onBulkOperation?.('refresh', [])}>
            Refresh Data
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onBulkOperation?.('import', [])}>
            <Upload className="h-3 w-3 mr-1" />
            Import Terms
          </Button>
          <Button variant="outline" size="sm" onClick={() => onBulkOperation?.('export_all', [])}>
            <Download className="h-3 w-3 mr-1" />
            Export All
          </Button>
        </div>
      </div>
    </Card>
  );
};

EnhancedTerminologyControls.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  selectedTerms: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTermsSelect: PropTypes.func.isRequired,
  onBulkOperation: PropTypes.func.isRequired,
  onTermApprove: PropTypes.func,
  brandId: PropTypes.string.isRequired,
  assetContext: PropTypes.any,
};
