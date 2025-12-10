import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Mail, 
  Share2, 
  Users, 
  Video,
  Filter
} from 'lucide-react';

const channelConfig = {
  'Website': { 
    icon: <Globe className="h-4 w-4" />, 
    label: 'Website', 
    color: 'bg-blue-500',
    hint: 'Page engagement, downloads, CTAs, search terms'
  },
  'Email': { 
    icon: <Mail className="h-4 w-4" />, 
    label: 'Email', 
    color: 'bg-green-500',
    hint: 'Open rates, click rates, subject lines, send timing'
  },
  'Social': { 
    icon: <Share2 className="h-4 w-4" />, 
    label: 'Social', 
    color: 'bg-purple-500',
    hint: 'Sentiment, trending topics, platform engagement'
  },
  'Rep-Enabled': { 
    icon: <Users className="h-4 w-4" />, 
    label: 'Rep-Enabled', 
    color: 'bg-orange-500',
    hint: 'Field activity, content effectiveness, NBA tracking'
  },
  'Video': { 
    icon: <Video className="h-4 w-4" />, 
    label: 'Video/Webinar', 
    color: 'bg-red-500',
    hint: 'Watch time, completion rates, engagement'
  },
};

export const ChannelFirstFilters = ({ filters, onFilterChange }) => {
  const channels = ['Website', 'Email', 'Social', 'Rep-Enabled', 'Video'];
  const audienceTypes = ['All', 'HCP', 'Patient', 'Caregiver'];
  const regions = ['All', 'Northeast', 'Southeast', 'Midwest', 'West', 'Southwest'];
  const timeRanges = ['All Time', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 12 Months'];

  const getAudienceSegmentOptions = (audienceType) => {
    if (!audienceType || audienceType === 'All') {
      return ['All'];
    }
    
    if (audienceType === 'HCP') {
      return ['All', 'HIV Specialist', 'Infectious Disease', 'Primary Care', 'Pharmacist', 'Nurse-NP-PA', 'Internal Medicine'];
    }
    
    if (audienceType === 'Patient') {
      return ['All', 'Newly Diagnosed', 'Treatment Experienced', 'Switching Treatment', 'Long-term Managed'];
    }
    
    if (audienceType === 'Caregiver') {
      return ['All', 'Family Caregiver', 'Professional Caregiver'];
    }
    
    return ['All'];
  };

  const segmentOptions = getAudienceSegmentOptions(filters.audienceType);

  const handleChannelSelect = (channel) => {
    onFilterChange({
      ...filters,
      channel: filters.channel === channel ? undefined : channel
    });
  };

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
    <Card className="p-5">
      {/* Channel Selection - Primary Filter */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Select Channel</h3>
          {filters.channel && (
            <Badge variant="secondary" className="ml-2">
              {channelConfig[filters.channel].label}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {channels.map((channel) => {
            const config = channelConfig[channel];
            const isSelected = filters.channel === channel;
            return (
              <button
                key={channel}
                onClick={() => handleChannelSelect(channel)}
                className={`
                  flex flex-col items-start gap-2 px-4 py-3 rounded-xl border-2 transition-all min-w-[180px] max-w-[200px]
                  ${isSelected 
                    ? 'border-primary bg-primary/10 text-primary shadow-lg scale-[1.02]' 
                    : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {config.icon}
                  </span>
                  <span className="font-semibold">{config.label}</span>
                </div>
                <span className={`text-xs leading-relaxed ${isSelected ? 'text-primary/80' : 'text-muted-foreground'}`}>
                  {config.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Audience Type</Label>
          <Select 
            value={filters.audienceType || 'All'} 
            onValueChange={(value) => handleChange('audienceType', value)}
          >
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
          <Label className="text-sm font-medium">
            {filters.audienceType === 'HCP' ? 'Specialty' : 
             filters.audienceType === 'Patient' ? 'Journey Stage' : 
             'Segment'}
          </Label>
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
          <Label className="text-sm font-medium">Region</Label>
          <Select 
            value={filters.region || 'All'} 
            onValueChange={(value) => handleChange('region', value)}
          >
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
          <Label className="text-sm font-medium">Time Range</Label>
          <Select 
            value={filters.timeRange || 'All Time'} 
            onValueChange={(value) => handleChange('timeRange', value)}
          >
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

      {/* Active Filter Summary */}
      {(filters.channel || filters.audienceType || filters.region) && (
        <div className="mt-4 pt-4 border-t flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.channel && (
            <Badge variant="outline" className="gap-1">
              {channelConfig[filters.channel].icon}
              {filters.channel}
            </Badge>
          )}
          {filters.audienceType && (
            <Badge variant="outline">{filters.audienceType}</Badge>
          )}
          {filters.audienceSegment && (
            <Badge variant="outline">{filters.audienceSegment}</Badge>
          )}
          {filters.region && (
            <Badge variant="outline">{filters.region}</Badge>
          )}
          {filters.timeRange && (
            <Badge variant="outline">{filters.timeRange}</Badge>
          )}
          <button 
            onClick={() => onFilterChange({})}
            className="text-sm text-muted-foreground hover:text-foreground underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </Card>
  );
};