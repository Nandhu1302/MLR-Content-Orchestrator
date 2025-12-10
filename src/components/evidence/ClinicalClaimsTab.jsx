import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, FileText, AlertCircle, CheckCircle2, Eye } from 'lucide-react';
import { ClaimDetailsModal } from '@/components/mlr/ClaimDetailsModal';

export const ClinicalClaimsTab = ({ claims }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [claimTypeFilter, setClaimTypeFilter] = useState('all');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setIsModalOpen(true);
  };

  const convertToDetectedClaim = (claim) => ({
    id: claim.id,
    text: claim.claim_text,
    type: claim.claim_type,
    severity: 'info',
    reason: `${claim.claim_type} claim from ${claim.source_section}`,
    suggestion: `Review claim details and supporting evidence`,
    start: 0,
    end: claim.claim_text.length,
    context: claim.source_section,
    requiredEvidence: [],
    isOverridden: claim.review_status === 'approved',
    confidence: claim.confidence_score || 0,
    brandCompliance: claim.review_status === 'approved' ? 'compliant' : 'warning',
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={claimTypeFilter} onValueChange={setClaimTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Claim Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {claimTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={reviewStatusFilter} onValueChange={setReviewStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Review Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {reviewStatuses.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredClaims.length} of {claims.length} claims
      </div>

      {/* Claims List */}
      <div className="grid gap-4">
        {filteredClaims.map((claim) => (
          <Card
            key={claim.id}
            className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => handleViewDetails(claim)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getReviewStatusIcon(claim.review_status)}
                    <Badge variant="outline">{claim.claim_type}</Badge>
                    <Badge variant="secondary">{claim.regulatory_status}</Badge>
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {claim.claim_text}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={getConfidenceColor(claim.confidence_score)} variant="outline">
                    {(claim.confidence_score * 100).toFixed(0)}% confidence
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleViewDetails(claim); }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Claim ID:</span>
                  <p className="font-medium font-mono">{claim.claim_id_display || 'Pending'}</p>
                </div>
                {claim.indication_product && (
                  <div>
                    <span className="text-muted-foreground">Indication/Product:</span>
                    <p className="font-medium">{claim.indication_product}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Source Section:</span>
                  <p className="font-medium">{claim.source_section}</p>
                </div>
                {claim.source_page && (
                  <div>
                    <span className="text-muted-foreground">Source Page:</span>
                    <p className="font-medium">Page {claim.source_page}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Effective Date:</span>
                  <p className="font-medium">
                    {claim.effective_date ? new Date(claim.effective_date).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                {claim.expiration_date && (
                  <div>
                    <span className="text-muted-foreground">Expiration Date:</span>
                    <p className="font-medium text-destructive">
                      {new Date(claim.expiration_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Review Status:</span>
                  <p className="font-medium capitalize">{claim.review_status}</p>
                </div>
                {claim.approval_scope && claim.approval_scope.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Approval Scope:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {claim.approval_scope.map((scope, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Extracted:</span>
                  <p className="font-medium">{new Date(claim.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClaims.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No claims found matching your filters</p>
        </div>
      )}

      {/* Claim Details Modal */}
      {selectedClaim && (
        <ClaimDetailsModal
          claim={convertToDetectedClaim(selectedClaim)}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedClaim(null); }}
          onOverride={() => {}}
        />
      )}
    </div>
  );
};
