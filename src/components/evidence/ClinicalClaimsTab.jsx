
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ClinicalClaimsTab = ({ claims }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [claimTypeFilter, setClaimTypeFilter] = useState('all');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('all');

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch = claim.claim_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = claimTypeFilter === 'all' || claim.claim_type === claimTypeFilter;
    const matchesStatus = reviewStatusFilter === 'all' || claim.review_status === reviewStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const claimTypes = [...new Set(claims.map((c) => c.claim_type))];
  const reviewStatuses = [...new Set(claims.map((c) => c.review_status))];

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'bg-green-500/10 text-green-700 border-green-500/20';
    if (score >= 0.6) return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
    return 'bg-red-500/10 text-red-700 border-red-500/20';
  };

  const getReviewStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={claimTypeFilter} onValueChange={(value) => setClaimTypeFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {claimTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={reviewStatusFilter} onValueChange={(value) => setReviewStatusFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {reviewStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredClaims.length} of {claims.length} claims
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {filteredClaims.map((claim) => (
          <Card key={claim.id} className="border rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getReviewStatusIcon(claim.review_status)}
                {claim.claim_type}
              </CardTitle>
              <CardDescription>{claim.regulatory_status}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{claim.claim_text}</p>
              <Badge className={getConfidenceColor(claim.confidence_score)}>
                {(claim.confidence_score * 100).toFixed(0)}% confidence
              </Badge>
              <div className="text-xs text-muted-foreground mt-2">
                Source Section: {claim.source_section}
                {claim.source_page && <div>Source Page: Page {claim.source_page}</div>}
                <div>Review Status: {claim.review_status}</div>
                <div>Extracted: {new Date(claim.created_at).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredClaims.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            No claims found matching your filters
          </div>
        )}
      </div>
    </div>
  );
};
