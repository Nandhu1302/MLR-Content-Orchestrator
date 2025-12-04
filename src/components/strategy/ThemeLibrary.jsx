// Theme Library - Main interface for browsing and managing themes
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { EnrichmentPromptDialog } from './EnrichmentPromptDialog';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  CheckCircle,
  Lightbulb,
  Eye,
  Copy,
  Archive,
  GitBranch,
  Star,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ThemeService } from '@/services/themeService';
import { useBrand } from '@/contexts/BrandContext';
import { formatDistance } from 'date-fns';

const ThemeLibrary = ({ 
  onThemeSelect, 
  onThemeCompare, 
  onThemeDetails,
  selectionMode = false,
  maxSelection = 2
}) => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showEnrichmentPrompt, setShowEnrichmentPrompt] = useState(false);
  const [pendingTheme, setPendingTheme] = useState(null);
  const [filters, setFilters] = useState({
    search_text: '',
    category: [],
    status: ['active'],
    min_confidence: 0,
    min_success_rate: 0
  });

  useEffect(() => {
    if (selectedBrand) {
      loadThemes();
    }
  }, [selectedBrand, filters]);

  const loadThemes = async () => {
    if (!selectedBrand) return;
    
    setLoading(true);
    try {
      const result = await ThemeService.getThemeLibrary(selectedBrand.id, filters);
      setSearchResult(result);
    } catch (error) {
      console.error('Failed to load themes:', error);
      toast.error('Failed to load theme library');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search_text: value }));
  };

  const handleCategoryFilter = (category, checked) => {
    setFilters(prev => ({
      ...prev,
      category: checked 
        ? [...(prev.category || []), category]
        : (prev.category || []).filter(c => c !== category)
    }));
  };

  const handleStatusFilter = (status, checked) => {
    setFilters(prev => ({
      ...prev,
      status: checked
        ? [...(prev.status || []), status]
        : (prev.status || []).filter(s => s !== status)
    }));
  };

  const handleThemeSelection = (theme) => {
    if (selectionMode) {
      if (selectedThemes.find(t => t.id === theme.id)) {
        setSelectedThemes(prev => prev.filter(t => t.id !== theme.id));
      } else if (selectedThemes.length < maxSelection) {
        setSelectedThemes(prev => [...prev, theme]);
      } else {
        toast.warning(`Maximum ${maxSelection} themes can be selected for comparison`);
      }
    } else {
      // Check enrichment status before using theme
      if (theme.enrichment_status === 'generated') {
        setPendingTheme(theme);
        setShowEnrichmentPrompt(true);
      } else {
        onThemeSelect?.(theme);
      }
    }
  };

  const handleEnrichTheme = () => {
    if (pendingTheme) {
      navigate(`/strategy/theme/${pendingTheme.id}/enrich`);
      setShowEnrichmentPrompt(false);
      setPendingTheme(null);
    }
  };

  const handleUseThemeNow = () => {
    if (pendingTheme) {
      onThemeSelect?.(pendingTheme);
      setShowEnrichmentPrompt(false);
      setPendingTheme(null);
    }
  };

  const handleCancelEnrichment = () => {
    setShowEnrichmentPrompt(false);
    setPendingTheme(null);
  };

  const handleDuplicateTheme = async (theme) => {
    try {
      await ThemeService.duplicateTheme(theme.id, `${theme.name} (Copy)`);
      toast.success('Theme duplicated successfully');
      loadThemes();
    } catch (error) {
      toast.error('Failed to duplicate theme');
    }
  };

  const handleArchiveTheme = async (theme) => {
    try {
      await ThemeService.archiveTheme(theme.id);
      toast.success('Theme archived successfully');
      loadThemes();
    } catch (error) {
      toast.error('Failed to archive theme');
    }
  };

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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getSuccessRateColor = (rate) => {
    if (rate >= 90) return 'text-green-700';
    if (rate >= 80) return 'text-blue-700';
    if (rate >= 70) return 'text-yellow-700';
    return 'text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enrichment Prompt Dialog */}
      {pendingTheme && (
        <EnrichmentPromptDialog
          open={showEnrichmentPrompt}
          themeName={pendingTheme.name}
          onEnrich={handleEnrichTheme}
          onUseNow={handleUseThemeNow}
          onCancel={handleCancelEnrichment}
        />
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search themes by name, description, or key message..."
              value={filters.search_text || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(filters.category?.length || 0) + (filters.status?.length || 0) > 0 && (
              <Badge variant="secondary" className="ml-1">
                {(filters.category?.length || 0) + (filters.status?.length || 0)}
              </Badge>
            )}
          </Button>
          {selectionMode && selectedThemes.length === maxSelection && (
            <Button onClick={() => onThemeCompare?.(selectedThemes)}>
              Compare Themes ({selectedThemes.length})
            </Button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filters */}
                <div>
                  <h4 className="font-medium mb-3">Category</h4>
                  <div className="space-y-2">
                    {['clinical-evidence', 'patient-journey', 'market-access', 'competitive-positioning', 'safety-focused'].map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={filters.category?.includes(category)}
                          onCheckedChange={(checked) => 
                            handleCategoryFilter(category, checked)
                          }
                        />
                        <label htmlFor={category} className="text-sm">
                          {category.replace('-', ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Filters */}
                <div>
                  <h4 className="font-medium mb-3">Status</h4>
                  <div className="space-y-2">
                    {['active', 'draft', 'archived'].map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={status}
                          checked={filters.status?.includes(status)}
                          onCheckedChange={(checked) => 
                            handleStatusFilter(status, checked)
                          }
                        />
                        <label htmlFor={status} className="text-sm capitalize">
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Filters */}
                <div>
                  <h4 className="font-medium mb-3">Performance</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm">Min Confidence (%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={filters.min_confidence || 0}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          min_confidence: parseInt(e.target.value) || 0 
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm">Min Success Rate (%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={filters.min_success_rate || 0}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          min_success_rate: parseInt(e.target.value) || 0 
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters({
                        search_text: '',
                        category: [],
                        status: ['active'],
                        min_confidence: 0,
                        min_success_rate: 0
                      })}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, min_success_rate: 80 }))}
                      className="w-full"
                    >
                      High Performers
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Found {searchResult?.total_count || 0} themes
          {filters.search_text && ` for "${filters.search_text}"`}
        </div>
        {selectionMode && (
          <div className="text-sm text-muted-foreground">
            {selectedThemes.length} of {maxSelection} themes selected
          </div>
        )}
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {searchResult?.themes.map((theme) => {
          const IconComponent = getThemeIcon(theme.category);
          const isSelected = selectedThemes.find(t => t.id === theme.id);
          
          return (
            <Card 
              key={theme.id} 
              className={`relative hover:shadow-lg transition-all cursor-pointer ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => handleThemeSelection(theme)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{theme.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {theme.category.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {theme.status}
                        </Badge>
                        {theme.enrichment_status === 'ready-for-use' && (
                          <Badge variant="default" className="text-xs gap-1">
                            🟢 Enriched
                          </Badge>
                        )}
                        {theme.enrichment_status === 'generated' && (
                          <Badge variant="outline" className="text-xs gap-1">
                            ⚪ Not Enriched
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onThemeDetails?.(theme);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {theme.enrichment_status === 'generated' && (
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/strategy/theme/${theme.id}/enrich`);
                        }}>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Enrich Intelligence
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateTheme(theme);
                      }}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      {theme.usage_count > 0 && (
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/strategy/theme/${theme.id}/versions`);
                        }}>
                          <GitBranch className="h-4 w-4 mr-2" />
                          View Versions ({theme.version})
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveTheme(theme);
                        }}
                        className="text-destructive"
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {theme.description}
                </p>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-2 rounded border ${getConfidenceColor(theme.confidence_score)}`}>
                    <div className="text-xs font-medium">Confidence</div>
                    <div className="text-lg font-bold">{theme.confidence_score}%</div>
                  </div>
                  <div className="p-2 rounded border bg-muted/20">
                    <div className="text-xs font-medium text-muted-foreground">Success Rate</div>
                    <div className={`text-lg font-bold ${getSuccessRateColor(theme.success_rate)}`}>
                      {theme.success_rate}%
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Used {theme.usage_count} times
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistance(new Date(theme.created_at), new Date(), { addSuffix: true })}
                  </div>
                </div>

                {/* Key Message Preview */}
                <div className="bg-muted/30 p-2 rounded text-xs italic">
                  <div className="font-medium mb-1">Key Message:</div>
                  <div className="line-clamp-2">"{theme.key_message}"</div>
                </div>

                {selectionMode && isSelected && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary text-primary-foreground">
                      Selected
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {searchResult?.themes.length === 0 && (
        <Card className="p-12 text-center">
          <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Themes Found</h3>
          <p className="text-muted-foreground mb-4">
            {filters.search_text 
              ? `No themes match your search criteria. Try adjusting your filters.`
              : 'Start creating themes by completing intake forms and generating AI themes.'
            }
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create New Theme
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ThemeLibrary;