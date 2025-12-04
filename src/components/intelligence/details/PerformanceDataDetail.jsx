
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const PerformanceDataDetail = ({
  intelligence,
  onApplyIntelligence
}) => {
  const { performance } = intelligence;

  const getConfidenceStars = (confidence) => {
    if (confidence >= 90) return '⭐⭐⭐';
    if (confidence >= 70) return '⭐⭐';
    return '⭐';
  };

  return (
    <Tabs defaultValue="patterns" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="patterns">
          Success Patterns ({performance.successPatterns?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="analytics">
          Campaign Analytics ({performance.campaignAnalytics?.length || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="patterns" className="space-y-4">
        {!performance.successPatterns || performance.successPatterns.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No success patterns identified yet</p>
          </div>
        ) : (
          <div className="border rounded-lg max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Pattern Name</TableHead>
                  <TableHead className="w-[100px]">Lift</TableHead>
                  <TableHead className="w-[120px]">Confidence</TableHead>
                  <TableHead>Context</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performance.successPatterns.map((pattern) => (
                  <TableRow key={pattern.id} className="hover:bg-muted/30">
                    <TableCell className="py-4 px-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{pattern.pattern_name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {pattern.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                          +{pattern.avg_performance_lift}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{getConfidenceStars(pattern.confidence_score || 0)}</span>
                          <span className="text-xs text-muted-foreground">
                            {pattern.confidence_score}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {pattern.sample_size} samples
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="space-y-1">
                        {pattern.applicable_audiences && (
                          <Badge variant="outline" className="text-xs">
                            {pattern.applicable_audiences}
                          </Badge>
                        )}
                        {pattern.applicable_channels && (
                          <Badge variant="outline" className="text-xs">
                            {pattern.applicable_channels}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onApplyIntelligence?.('successPattern', pattern)}
                      >
                        <Target className="w-3 h-3" />
                        Apply
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        {!performance.campaignAnalytics || performance.campaignAnalytics.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No campaign analytics available</p>
          </div>
        ) : (
          <div className="border rounded-lg max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[100px]">Engagement</TableHead>
                  <TableHead className="w-[100px]">Conversion</TableHead>
                  <TableHead className="w-[100px]">Click Rate</TableHead>
                  <TableHead className="w-[150px]">Top Segment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performance.campaignAnalytics.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-muted/30">
                    <TableCell className="py-3 px-4">
                      <span className="text-sm font-medium">{campaign.campaign_name}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Badge variant="secondary" className="text-xs">
                        {campaign.campaign_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-sm font-medium">
                        {campaign.engagement_score ? `${campaign.engagement_score}%` : '-'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-sm font-medium">
                        {campaign.conversion_rate ? `${campaign.conversion_rate}%` : '-'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-sm font-medium">
                        {campaign.click_rate ? `${campaign.click_rate}%` : '-'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">
                        {campaign.top_performing_segment || '-'}
                      </span>
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