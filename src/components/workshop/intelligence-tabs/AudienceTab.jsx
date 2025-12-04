import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Stethoscope, Target } from 'lucide-react';

export const AudienceTab = ({
  audienceInsights,
  hcpTargeting,
  campaignCoordination,
}) => {
  return (
    <div className="space-y-6">
      {/* Audience Insights */}
      {audienceInsights && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Audience Insights
          </h3>
          <Card className="p-4">
            <div className="space-y-3">
              {audienceInsights.primaryType && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Primary Audience</p>
                  <Badge variant="secondary">{audienceInsights.primaryType}</Badge>
                </div>
              )}
              {audienceInsights.decisionFactors && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Key Decision Factors</p>
                  <div className="flex flex-wrap gap-2">
                    {audienceInsights.decisionFactors.map((factor, idx) => (
                      <Badge key={idx} variant="outline">{factor}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {audienceInsights.preferredChannels && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Preferred Channels</p>
                  <div className="flex flex-wrap gap-2">
                    {audienceInsights.preferredChannels.map((channel, idx) => (
                      <Badge key={idx} variant="secondary">{channel}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* HCP Targeting */}
      {hcpTargeting && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            HCP Targeting
          </h3>
          <div className="space-y-3">
            {hcpTargeting.regionalBreakdown && (
              <Card className="p-4">
                <p className="text-sm font-medium mb-3">Regional Distribution</p>
                <div className="space-y-2">
                  {Object.entries(hcpTargeting.regionalBreakdown).map(([region, count]) => (
                    <div key={region} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{region}</span>
                      <Badge variant="secondary">{String(count)} HCPs</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {hcpTargeting.specialtyBreakdown && (
              <Card className="p-4">
                <p className="text-sm font-medium mb-3">Specialty Distribution</p>
                <div className="space-y-2">
                  {Object.entries(hcpTargeting.specialtyBreakdown).map(([specialty, count]) => (
                    <div key={specialty} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{specialty}</span>
                      <Badge variant="secondary">{String(count)}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Campaign Coordination */}
      {campaignCoordination && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Marketing Mix
          </h3>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-3">
              {campaignCoordination.summary || 'Recommended channel mix for this audience'}
            </p>
            {campaignCoordination.channelRecommendations && (
              <div className="space-y-2">
                {campaignCoordination.channelRecommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-2 bg-accent/50 rounded">
                    <span>{rec.channel}</span>
                    <Badge variant="secondary">{rec.weight || '25%'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};