import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileType, Eye } from 'lucide-react';
import { ContentSegmentDetailsModal } from './ContentSegmentDetailsModal';

export const ContentSegmentsTab = ({ segments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentTypeFilter, setSegmentTypeFilter] = useState('all');
  const [assetTypeFilter, setAssetTypeFilter] = useState('all');
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSegments = segments.filter(segment => {
    const matchesSearch = segment.segment_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegmentType = segmentTypeFilter === 'all' || segment.segment_type === segmentTypeFilter;
    const matchesAssetType = assetTypeFilter === 'all' || (segment.applicable_asset_types || []).includes(assetTypeFilter);
    return matchesSearch && matchesSegmentType && matchesAssetType;
  });

  const segmentTypes = [...new Set(segments.map(s => s.segment_type))];
  const allAssetTypes = [...new Set(segments.flatMap(s => s.applicable_asset_types || []))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={segmentTypeFilter} onValueChange={setSegmentTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Segment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {segmentTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Asset Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assets</SelectItem>
            {allAssetTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSegments.length} of {segments.length} segments
      </div>

      {/* Segments List */}
      <div className="grid gap-4">
        {filteredSegments.map((segment) => (
          <Card 
            key={segment.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedSegment(segment);
              setIsModalOpen(true);
            }}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileType className="h-4 w-4 text-primary" />
                    <Badge variant="outline">{segment.segment_type}</Badge>
                    {segment.use_case && (
                      <Badge variant="secondary">{segment.use_case}</Badge>
                    )}
                  </div>
                  <CardTitle className="text-base leading-relaxed">
                    {segment.segment_text}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Applicable Asset Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {(segment.applicable_asset_types || []).map((type, idx) => (
                      <Badge key={idx} variant="outline" className="bg-primary/5">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t">
                  {segment.source_section && (
                    <div>
                      <span className="text-muted-foreground">Source Section:</span>
                      <p className="font-medium">{segment.source_section}</p>
                    </div>
                  )}
                  {segment.source_page && (
                    <div>
                      <span className="text-muted-foreground">Source Page:</span>
                      <p className="font-medium">Page {segment.source_page}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSegments.length === 0 && (
        <div className="text-center py-12">
          <FileType className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No segments found matching your filters</p>
        </div>
      )}

      {/* Segment Details Modal */}
      <ContentSegmentDetailsModal
        segment={selectedSegment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSegment(null);
        }}
      />
    </div>
  );
};
