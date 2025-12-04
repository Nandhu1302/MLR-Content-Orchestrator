import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Filter } from 'lucide-react';

export const DataFiltersComponent = ({ filters, onFilterChange }) => {
  const indications = ['All', 'Treatment-Naive', 'Treatment-Experienced', 'Virologically Suppressed'];
  const regions = ['All', 'US', 'EU', 'APAC', 'LATAM'];
  const audienceTypes = ['All', 'HCP', 'Patient', 'Caregiver'];
  const timeRanges = ['All Time', 'Last 3 Months', 'Last 6 Months', 'Last 12 Months'];

  const getAudienceSegmentOptions = (audienceType) => {
    if (!audienceType || audienceType === 'All') {
      return ['All'];
    }
    
    if (audienceType === 'HCP') {
      return ['All', 'Infectious Disease', 'HIV Specialist', 'Primary Care', 'Internal Medicine', 'Public Health'];
    }
    
    if (audienceType === 'Patient') {
      return ['All', 'Newly Diagnosed', 'Living with HIV', 'Treatment-Experienced'];
    }
    
    if (audienceType === 'Caregiver') {
      return ['All', 'Family Caregiver', 'Professional Caregiver'];
    }
    
    return ['All'];
  };

  const getSegmentLabel = (audienceType) => {
    if (audienceType === 'HCP') {
      return 'HCP Specialty';
    }
    if (audienceType === 'Patient') {
      return 'Patient Journey';
    }
    if (audienceType === 'Caregiver') {
      return 'Caregiver Type';
    }
    return 'Segment';
  };

  const segmentOptions = getAudienceSegmentOptions(filters.audienceType);

  const handleChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value === 'All' || value === 'All Time' ? undefined : value
    };
    
    // Reset audience segment when audience type changes
    if (key === 'audienceType') {
      newFilters.audienceSegment = undefined;
    }
    
    onFilterChange(newFilters);
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Filter Data Intelligence</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label>Indication</Label>
          <Select value={filters.indication || 'All'} onValueChange={(value) => handleChange('indication', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select indication" />
            </SelectTrigger>
            <SelectContent>
              {indications.map(indication => (
                <SelectItem key={indication} value={indication}>{indication}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Region</Label>
          <Select value={filters.region || 'All'} onValueChange={(value) => handleChange('region', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Audience Type</Label>
          <Select value={filters.audienceType || 'All'} onValueChange={(value) => handleChange('audienceType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              {audienceTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{getSegmentLabel(filters.audienceType)}</Label>
          <Select 
            value={filters.audienceSegment || 'All'} 
            onValueChange={(value) => handleChange('audienceSegment', value)}
            disabled={!filters.audienceType || filters.audienceType === 'All'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select segment" />
            </SelectTrigger>
            <SelectContent>
              {segmentOptions.map(segment => (
                <SelectItem key={segment} value={segment}>{segment}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Time Range</Label>
          <Select value={filters.timeRange || 'All Time'} onValueChange={(value) => handleChange('timeRange', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(range => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};