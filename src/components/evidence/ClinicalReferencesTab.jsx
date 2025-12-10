import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, ExternalLink } from 'lucide-react';
import { BatchReExtractButton } from './BatchReExtractButton';
import { ReferenceDetailsModal } from '@/components/mlr/ReferenceDetailsModal';

export const ClinicalReferencesTab = ({ references, brandId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [studyTypeFilter, setStudyTypeFilter] = useState('all');
  const [selectedReference, setSelectedReference] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredReferences = references.filter((ref) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (ref.study_name && ref.study_name.toLowerCase().includes(query)) ||
      (ref.reference_text && ref.reference_text.toLowerCase().includes(query)) ||
      (ref.journal && ref.journal.toLowerCase().includes(query));
    const matchesType = studyTypeFilter === 'all' || (ref.reference_type && ref.reference_type === studyTypeFilter);
    return matchesSearch && matchesType;
  });

  const studyTypes = [...new Set(references.map((r) => r.reference_type).filter(Boolean))];

  const getReferenceTypeLabel = (type) => {
    if (!type) return null;
    const labels = {
      clinical_trial: 'Clinical Trial',
      real_world_evidence: 'Real World Evidence',
      meta_analysis: 'Meta-Analysis',
      regulatory: 'Regulatory',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const handleViewDetails = (reference) => {
    setSelectedReference(reference);
    setIsModalOpen(true);
  };

  const convertToModalReference = (ref) => ({
    id: ref.id,
    citation: ref.reference_text,
    pmid: ref.pubmed_id || undefined,
    doi: ref.doi || undefined,
    title: ref.study_name || undefined,
    authors: ref.authors || undefined,
    journal: ref.journal || undefined,
    year: (ref.publication_year && ref.publication_year.toString()) || undefined,
    isComplete: !!ref.formatted_citation,
    isVerified: true,
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search references by study name, authors, or journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={studyTypeFilter} onValueChange={setStudyTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Reference Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {studyTypes.map((type) => (
              <SelectItem key={type} value={type}>{getReferenceTypeLabel(type)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {brandId && (
          <BatchReExtractButton brandId={brandId} documentCount={references.length} />
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredReferences.length} of {references.length} references
      </div>

      {/* References List */}
      <div className="grid gap-4">
        {filteredReferences.map((reference) => (
          <Card
            key={reference.id}
            className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => handleViewDetails(reference)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {reference.reference_type && (
                      <Badge variant="outline">{getReferenceTypeLabel(reference.reference_type)}</Badge>
                    )}
                    {reference.publication_year && (
                      <Badge variant="secondary">{reference.publication_year}</Badge>
                    )}
                  </div>
                  <CardTitle className="text-base">{reference.study_name || 'Untitled Study'}</CardTitle>
                  {reference.journal && (
                    <CardDescription className="mt-1">
                      Published in {reference.journal}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formatted Citation */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Citation:</p>
                <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md">
                  {reference.formatted_citation}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="space-y-2 pt-2 border-t">
                {reference.reference_id_display && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground font-medium min-w-[100px]">Reference ID:</span>
                    <p className="flex-1 font-mono font-semibold">{reference.reference_id_display}</p>
                  </div>
                )}
                {reference.data_on_file_id && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground font-medium min-w-[100px]">Data on File:</span>
                    <p className="flex-1 font-mono">{reference.data_on_file_id}</p>
                  </div>
                )}
                {reference.relevant_location && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground font-medium min-w-[100px]">Location:</span>
                    <p className="flex-1">{reference.relevant_location}</p>
                  </div>
                )}
                {reference.authors && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground font-medium min-w-[100px]">Authors:</span>
                    <p className="flex-1">{reference.authors}</p>
                  </div>
                )}
                {/* DOI Link */}
                {reference.doi && (
                  <div className="flex gap-2 text-sm items-center">
                    <span className="text-muted-foreground font-medium min-w-[100px]">DOI:</span>
                    <Button variant="link" size="sm" className="h-auto p-0 text-primary" asChild>
                      <a
                        href={`https://doi.org/${reference.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        {reference.doi}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                )}
                {/* PubMed Link */}
                {reference.pubmed_id && (
                  <div className="flex gap-2 text-sm items-center">
                    <span className="text-muted-foreground font-medium min-w-[100px]">PubMed:</span>
                    <Button variant="link" size="sm" className="h-auto p-0 text-primary" asChild>
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${reference.pubmed_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        PMID: {reference.pubmed_id}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                )}
                {/* Source Info */}
                <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
                  {reference.source_section && (
                    <div>
                      <span className="text-muted-foreground">Source Section:</span>
                      <p className="font-medium">{reference.source_section}</p>
                    </div>
                  )}
                  {reference.source_page && (
                    <div>
                      <span className="text-muted-foreground">Source Page:</span>
                      <p className="font-medium">Page {reference.source_page}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReferences.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No references found matching your filters</p>
        </div>
      )}

      {/* Reference Details Modal */}
      {selectedReference && (
        <ReferenceDetailsModal
          reference={convertToModalReference(selectedReference)}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedReference(null); }}
          onApply={() => {}}
          currentContent=""
        />
      )}
    </div>
  );
};
