
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, ExternalLink } from 'lucide-react';

export const ClinicalReferencesTab = ({ references }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [studyTypeFilter, setStudyTypeFilter] = useState('all');

  const filteredReferences = references.filter((ref) => {
    const matchesSearch =
      ref.study_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.reference_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ref.journal && ref.journal.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = studyTypeFilter === 'all' || (ref.study_type && ref.study_type === studyTypeFilter);
    return matchesSearch && matchesType;
  });

  const studyTypes = [...new Set(references.map((r) => r.study_type).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search references..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={studyTypeFilter} onValueChange={(value) => setStudyTypeFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {studyTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredReferences.length} of {references.length} references
      </div>

      {/* References List */}
      <div className="space-y-4">
        {filteredReferences.map((reference) => (
          <Card key={reference.id} className="border rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {reference.study_type && <Badge>{reference.study_type}</Badge>}
                {reference.publication_year && <span>{reference.publication_year}</span>}
              </CardTitle>
              <CardDescription>
                {reference.study_name} {reference.journal && `Published in ${reference.journal}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                <strong>Reference Text:</strong> {reference.reference_text}
              </p>
              <p className="mb-2">
                <strong>Citation:</strong> {reference.formatted_citation}
              </p>
              {reference.source_section && (
                <p>
                  <strong>Source Section:</strong> {reference.source_section}
                </p>
              )}
              {reference.source_page && (
                <p>
                  <strong>Source Page:</strong> Page {reference.source_page}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        {filteredReferences.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            No references found matching your filters
          </div>
        )}
      </div>
    </div>
  );
};
