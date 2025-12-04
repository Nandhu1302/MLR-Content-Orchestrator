import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar,
  TrendingUp,
  Users,
  GitBranch,
  BarChart3
} from 'lucide-react';
import { ThemeService } from '@/services/themeService';
import { formatDistance } from 'date-fns';

export default function ThemeVersionsPage() {
  const { themeId } = useParams();
  const navigate = useNavigate();

  const { data: versions = [], isLoading } = useQuery({
    queryKey: ['theme-versions', themeId],
    queryFn: async () => {
      if (!themeId) return [];
      return ThemeService.getThemeVersions(themeId);
    },
    enabled: !!themeId
  });

  const currentTheme = versions.find(v => v.id === themeId);

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      
      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2560px]">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/strategy-insights')} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Strategy & Insights
            </Button>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Theme Versions
                </h1>
                {currentTheme && (
                  <p className="text-muted-foreground mt-2">
                    Version history for "{currentTheme.name}"
                  </p>
                )}
              </div>
              
              <Badge variant="outline" className="gap-2">
                <GitBranch className="h-3 w-3" />
                {versions.length} Version{versions.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>

          {/* Version Timeline */}
          <div className="space-y-4">
            {versions.map((version, index) => {
              const isCurrentVersion = version.id === themeId;
              const isLatest = index === versions.length - 1;
              
              return (
                <Card 
                  key={version.id} 
                  className={`relative ${isCurrentVersion ? 'ring-2 ring-primary' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold">
                          v{version.version}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{version.name}</CardTitle>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {version.category.replace('-', ' ')}
                            </Badge>
                            {isCurrentVersion && (
                              <Badge variant="default" className="text-xs">
                                Current Version
                              </Badge>
                            )}
                            {isLatest && (
                              <Badge variant="outline" className="text-xs">
                                Latest
                              </Badge>
                            )}
                            {version.enrichment_status === 'ready-for-use' && (
                              <Badge variant="default" className="text-xs">
                                🟢 Enriched
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {!isCurrentVersion && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/strategy/theme/${version.id}/enrich`)}
                          >
                            View Details
                          </Button>
                        )}
                        <Button 
                          variant={isCurrentVersion ? 'default' : 'ghost'} 
                          size="sm"
                          onClick={() => navigate('/intake', { state: { preselectedTheme: version } })}
                        >
                          Use This Version
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {version.description}
                    </p>

                    <Separator />

                    {/* Version Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                          <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Confidence</p>
                          <p className="text-sm font-semibold">{version.confidence_score}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Success Rate</p>
                          <p className="text-sm font-semibold">{version.success_rate.toFixed(0)}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                          <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Usage Count</p>
                          <p className="text-sm font-semibold">{version.usage_count}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                          <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Created</p>
                          <p className="text-sm font-semibold">
                            {formatDistance(version.created_at, new Date(), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Key Message Preview */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Key Message</p>
                      <p className="text-sm font-medium line-clamp-2">{version.key_message}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {versions.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GitBranch className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground text-center">
                  No version history found for this theme.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </ScrollArea>
    </div>
  );
}