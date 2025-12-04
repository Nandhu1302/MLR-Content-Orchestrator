import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Sparkles,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Lightbulb,
  Calendar,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { formatDistance } from 'date-fns';

const ThemeEnrichmentQueue = ({ themes, onStartEnrichment }) => {
  const navigate = useNavigate();
  const [sortedThemes, setSortedThemes] = useState([]);

  useEffect(() => {
    // Sort themes by priority: created_at (newest first)
    const sorted = [...themes].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setSortedThemes(sorted);
  }, [themes]);

  const getThemeIcon = (category) => {
    switch (category) {
      case 'clinical-evidence': return BarChart3;
      case 'patient-journey': return Users;
      case 'competitive-positioning': return Target;
      case 'market-access': return TrendingUp;
      case 'safety-focused': return CheckCircle;
      default: return Lightbulb;
    }
  };

  if (sortedThemes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
        <p className="text-muted-foreground">
          All your themes have been enriched with intelligence data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Queue Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Enrichment Queue
          </h2>
          <p className="text-muted-foreground mt-1">
            {sortedThemes.length} theme{sortedThemes.length !== 1 ? 's' : ''} ready to be enriched with intelligence
          </p>
        </div>
      </div>

      {/* Theme Queue List */}
      <div className="space-y-4">
        {sortedThemes.map((theme, index) => {
          const IconComponent = getThemeIcon(theme.category);
          
          return (
            <Card 
              key={theme.id}
              className="hover:shadow-lg transition-all border-l-4 border-l-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Theme Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold truncate">{theme.name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {theme.category.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created {formatDistance(new Date(theme.created_at), new Date(), { addSuffix: true })}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Theme Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {theme.description || 'No description available'}
                    </p>

                    {/* Key Message Preview */}
                    {theme.key_message && (
                      <div className="bg-muted/50 rounded-lg p-3 mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Key Message
                        </p>
                        <p className="text-sm line-clamp-2">{theme.key_message}</p>
                      </div>
                    )}

                    {/* Enrichment Status */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <span>Not Enriched</span>
                      </div>
                      <span>•</span>
                      <span>Intelligence layers pending</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Button
                      onClick={() => onStartEnrichment(theme)}
                      className="gap-2"
                    >
                      Start Enriching
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        Recommended Next
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Queue Stats Footer */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">Enrichment enhances themes with:</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>• Competitive insights</span>
              <span>• Market analysis</span>
              <span>• Regulatory data</span>
              <span>• Public domain intelligence</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeEnrichmentQueue;