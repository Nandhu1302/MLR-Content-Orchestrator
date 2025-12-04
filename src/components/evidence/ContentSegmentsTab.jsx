
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileType } from 'lucide-react';

export const ContentSegmentsTab = ({ segments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentTypeFilter, setSegmentTypeFilter] = useState('all');
  const [assetTypeFilter, setAssetTypeFilter] = useState('all');

  const filteredSegments = segments.filter((segment) => {
    const matchesSearch = segment.segment_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegmentType = segmentTypeFilter === 'all' || segment.segment_type === segmentTypeFilter;
    const matchesAssetType =
      assetTypeFilter === 'all' || (segment.applicable_asset_types || []).includes(assetTypeFilter);
    return matchesSearch && matchesSegmentType && matchesAssetType;
  });

  const segmentTypes = [...new Set(segments.map((s) => s.segment_type))];
  const allAssetTypes = [...new Set(segments.flatMap((s) => s.applicable_asset_types || []))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={segmentTypeFilter} onValueChange={(value) => setSegmentTypeFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {segmentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={assetTypeFilter} onValueChange={(value) => setAssetTypeFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Assets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assets</SelectItem>
            {allAssetTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSegments.length} of {segments.length} segments
      </div>

      {/* Segments List */}
      <div className="space-y-4">
        {filteredSegments.map((segment) => (
          <Card key={segment.id} className="border rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {segment.segment_type}
                {segment.use_case && <Badge>{segment.use_case}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{segment.segment_text}</p>
              <div className="text-xs text-muted-foreground">
                <strong>Applicable Asset Types:</strong>{' '}
                {(segment.applicable_asset_types || []).map((type, idx) => (
                  <span key={idx} className="mr-1">
                    {type}
                  </span>
                ))}
              </div>
              {segment.source_section && (
                <p>
                  <strong>Source Section:</strong> {segment.source_section}
                </p>
              )}
              {segment.source_page && (
                <p>
                  <strong>Source Page:</strong> Page {segment.source_page}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        {filteredSegments.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            No segments found matching your filters
          </div>
        )}
      </div>
    </div>
  );
};
