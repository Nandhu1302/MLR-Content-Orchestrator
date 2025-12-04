
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Star } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const EvidenceLibraryDetail = ({
  intelligence,
  currentAssetType,
  onApplyIntelligence
}) => {
  const { evidence } = intelligence;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClaims =
    evidence.claims?.filter(
      (claim) =>
        claim.claim_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claim_type.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredReferences =
    evidence.references?.filter((ref) =>
      ref.reference_text.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getConfidenceColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Tabs defaultValue="claims" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="claims">
          Clinical Claims ({evidence.claims?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="references">
          References ({evidence.references?.length || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="claims" className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredClaims.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No clinical claims found</p>
          </div>
        ) : (
          <div className="border rounded-lg max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Claim Text</TableHead>
                  <TableHead className="w-[100px]">Indication</TableHead>
                  <TableHead className="w-[80px]">Confidence</TableHead>
                  <TableHead className="w-[80px]">Used</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.map((claim) => (
                  <TableRow key={claim.id} className="hover:bg-muted/30">
                    <TableCell className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {claim.claim_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md py-3 px-4">
                      <div className="flex items-start gap-2">
                        {claim.confidence_score && claim.confidence_score >= 90 && (
                          <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-sm line-clamp-2">{claim.claim_text}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-xs">{claim.indication_product || '-'}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span
                        className={`text-sm font-medium ${getConfidenceColor(
                          claim.confidence_score || 0
                        )}`}
                      >
                        {claim.confidence_score || 0}%
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">
                        {claim.usage_count || 0}×
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          onApplyIntelligence?.('keyMessages', claim.claim_text)
                        }
                      >
                        <Plus className="w-3 h-3" />
                        Add to Brief
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="references" className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search references..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredReferences.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No references found</p>
          </div>
        ) : (
          <div className="border rounded-lg max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Citation</TableHead>
                  <TableHead className="w-[150px]">Publication</TableHead>
                  <TableHead className="w-[80px]">Year</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferences.map((ref) => (
                  <TableRow key={ref.id} className="hover:bg-muted/30">
                    <TableCell className="max-w-md py-3 px-4">
                      <span className="text-sm line-clamp-2">{ref.reference_text}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-xs">{ref.journal || '-'}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-xs">{ref.publication_year || '-'}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          onApplyIntelligence?.('supportingReferences', ref.reference_text)
                        }
                      >
                        <Plus className="w-3 h-3" />
                        Add Reference
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};