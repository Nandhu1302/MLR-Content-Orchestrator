import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, BarChart, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ThemeCard = ({ theme, usageCount = 0, onEnrich, onUseTheme }) => {
  const navigate = useNavigate();

  const getStatusConfig = () => {
    switch (theme.enrichment_status) {
      case 'ready-for-use':
        return {
          icon: CheckCircle,
          label: 'Enriched & Ready',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          badge: 'default'
        };
      default:
        return {
          icon: AlertCircle,
          label: 'Needs Enrichment',
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
          badge: 'outline'
        };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;
  const intelligenceScore = theme.intelligence_progress || 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{theme.name}</CardTitle>
              <Badge variant={status.badge} className="flex items-center gap-1">
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>
            <CardDescription>{theme.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category and Metrics */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span className="capitalize">{theme.category}</span>
          </div>
          {usageCount > 0 && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Used in {usageCount} {usageCount === 1 ? 'asset' : 'assets'}</span>
            </div>
          )}
        </div>

        {/* Intelligence Score */}
        {theme.enrichment_status !== 'generated' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Intelligence Score</span>
              <span className="font-semibold">{intelligenceScore}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${intelligenceScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Key Message Preview */}
        {theme.key_message && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm italic">"{theme.key_message}"</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {theme.enrichment_status === 'generated' && (
            <>
              <Button 
                onClick={() => onUseTheme?.(theme.id)}
                className="flex-1"
                variant="default"
              >
                Generate Content Now
              </Button>
              <Button 
                onClick={() => onEnrich?.(theme.id)}
                className="flex-1"
                variant="outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Enrich First
              </Button>
            </>
          )}
          
          {theme.enrichment_status === 'ready-for-use' && onUseTheme && (
            <Button 
              onClick={() => onUseTheme(theme.id)}
              className="flex-1"
              variant="default"
            >
              Use Theme
            </Button>
          )}

          <Button 
            onClick={() => navigate(`/theme-versions/${theme.id}`)}
            variant="outline"
          >
            View Details
          </Button>
        </div>

        {/* Creation Info */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Created {new Date(theme.created_at).toLocaleDateString()}
          {theme.last_used_at && (
            <> • Last used {new Date(theme.last_used_at).toLocaleDateString()}</>
          )}
        </div>
      </CardContent>
    </Card>
  );
};