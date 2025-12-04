import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Languages, 
  MessageSquare, 
  GitBranch, 
  AlertTriangle,
  Globe,
  ArrowLeft,
  Settings,
  Save,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRealTimeCollaboration } from '@/hooks/useRealTimeCollaboration';
import { useSmartTMMatching } from '@/hooks/useSmartTMMatching';
import { CollaborativeTranslationEditor } from './CollaborativeTranslationEditor';
import { QualityAssurancePanel } from './QualityAssurancePanel';
import { CulturalAdaptationGuide } from './CulturalAdaptationGuide';
import { TranslationCommentSystem } from './TranslationCommentSystem';
import { SmartTMSuggestions } from './SmartTMSuggestions';
import { UserPresenceIndicators } from '@/components/collaboration/UserPresenceIndicators';

export const TranslationWorkspace = ({
  project,
  targetLanguage,
  sourceLanguage = 'en',
  onBack
}) => {
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [showQualityPanel, setShowQualityPanel] = useState(true);
  const [showCulturalGuide, setShowCulturalGuide] = useState(true);
  
  // Real-time collaboration
  const {
    activeUsers,
    isConnected,
    hasConflicts,
    broadcastContentUpdate,
    broadcastCursorUpdate,
    resolveConflict
  } = useRealTimeCollaboration({
    contentId: `${project.id}-${targetLanguage}`,
    contentType: 'content_project',
    onContentChange: (content) => {
      if (content.segments) {
        setSegments(content.segments);
      }
    }
  });

  // Translation Memory matching
  const {
    searchTM,
    searchResults,
    isLoading: tmLoading
  } = useSmartTMMatching(
    project.brand_id || '',
    sourceLanguage,
    targetLanguage
  );

  // Initialize segments from project content
  useEffect(() => {
    if (project.project_name) {
      const mockSegments = [
        {
          id: '1',
          sourceText: 'Product Benefits Overview',
          targetText: '',
          status: 'pending',
          quality: 0,
          comments: [],
          lastModified: new Date().toISOString()
        },
        {
          id: '2',
          sourceText: 'Clinical efficacy data shows significant improvement in patient outcomes.',
          targetText: '',
          status: 'pending',
          quality: 0,
          comments: [],
          lastModified: new Date().toISOString()
        },
        {
          id: '3',
          sourceText: 'Contraindications and safety warnings must be reviewed carefully.',
          targetText: '',
          status: 'pending',
          quality: 0,
          comments: [],
          lastModified: new Date().toISOString()
        }
      ];
      setSegments(mockSegments);
      setSelectedSegment(mockSegments[0]);
    }
  }, [project.project_name]);

  const handleSegmentUpdate = useCallback((segmentId, updates) => {
    setSegments(prev => {
      const updated = prev.map(seg => 
        seg.id === segmentId ? { ...seg, ...updates, lastModified: new Date().toISOString() } : seg
      );
      
      // Broadcast updates to collaborators
      broadcastContentUpdate({ segments: updated });
      
      return updated;
    });
  }, [broadcastContentUpdate]);

  const handleSegmentSelect = (segment) => {
    setSelectedSegment(segment);
    // Search TM for this segment
    if (segment.sourceText) {
      searchTM(segment.sourceText);
    }
  };

  const getProgressStats = () => {
    const total = segments.length;
    const translated = segments.filter(s => s.status === 'translated' || s.status === 'reviewed' || s.status === 'approved').length;
    const reviewed = segments.filter(s => s.status === 'reviewed' || s.status === 'approved').length;
    const approved = segments.filter(s => s.status === 'approved').length;
    
    return {
      total,
      translated,
      reviewed,
      approved,
      translatedPercent: total > 0 ? Math.round((translated / total) * 100) : 0,
      reviewedPercent: total > 0 ? Math.round((reviewed / total) * 100) : 0,
      approvedPercent: total > 0 ? Math.round((approved / total) * 100) : 0
    };
  };

  const stats = getProgressStats();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{project.project_name}</h1>
              <p className="text-sm text-muted-foreground">
                {sourceLanguage.toUpperCase()} → {targetLanguage.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            
            {/* Progress Stats */}
            <div className="flex items-center gap-2 text-sm">
              <span>{stats.translatedPercent}% Translated</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{stats.reviewedPercent}% Reviewed</span>
            </div>
            
            {/* User Presence */}
            <UserPresenceIndicators activeUsers={activeUsers} showCursors={false} />
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-4 mb-2">
            <Progress value={stats.translatedPercent} className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {stats.translated} of {stats.total} segments
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Segment List */}
        <div className="w-80 border-r bg-card/50">
          <div className="p-4 border-b">
            <h3 className="font-medium mb-2">Translation Segments</h3>
            <div className="text-xs text-muted-foreground">
              {segments.length} segments • {stats.approved} approved
            </div>
          </div>
          
          <div className="overflow-y-auto">
            {segments.map((segment) => (
              <div
                key={segment.id}
                className={cn(
                  "p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors",
                  selectedSegment?.id === segment.id && "bg-accent"
                )}
                onClick={() => handleSegmentSelect(segment)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant={
                      segment.status === 'approved' ? 'default' :
                      segment.status === 'reviewed' ? 'secondary' :
                      segment.status === 'translated' ? 'outline' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {segment.status.replace('_', ' ')}
                  </Badge>
                  
                  {segment.quality > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {Math.round(segment.quality)}% quality
                    </div>
                  )}
                </div>
                
                <p className="text-sm line-clamp-2 mb-1">
                  {segment.sourceText}
                </p>
                
                {segment.targetText && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {segment.targetText}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Segment {segment.id}</span>
                  {segment.comments.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {segment.comments.length}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Translation Editor */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b bg-transparent h-auto p-1">
              <TabsTrigger value="editor" className="data-[state=active]:bg-accent">
                <Languages className="h-4 w-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-accent">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-accent">
                <GitBranch className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger value="tm" className="data-[state=active]:bg-accent">
                <Globe className="h-4 w-4 mr-2" />
                TM
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 flex mt-0">
              {selectedSegment && (
                <CollaborativeTranslationEditor
                  segment={selectedSegment}
                  onSegmentUpdate={handleSegmentUpdate}
                  activeUsers={activeUsers}
                  onCursorUpdate={broadcastCursorUpdate}
                />
              )}
            </TabsContent>

            <TabsContent value="comments" className="flex-1 mt-0">
              {selectedSegment && (
                <TranslationCommentSystem
                  segmentId={selectedSegment.id}
                  comments={selectedSegment.comments}
                  onAddComment={(comment) => 
                    handleSegmentUpdate(selectedSegment.id, {
                      comments: [...selectedSegment.comments, comment]
                    })
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="history" className="flex-1 mt-0">
              <div className="p-4">
                <h3 className="text-lg font-medium mb-4">Version History</h3>
                <p className="text-muted-foreground">Translation history will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="tm" className="flex-1 mt-0">
              {selectedSegment && (
                <SmartTMSuggestions
                  segment={selectedSegment}
                  searchResults={searchResults}
                  isLoading={tmLoading}
                  onApplySuggestion={(suggestion) => 
                    handleSegmentUpdate(selectedSegment.id, {
                      targetText: suggestion.targetText,
                      status: 'translated'
                    })
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Panels */}
        <div className="w-80 border-l bg-card/50 flex flex-col">
          {showQualityPanel && (
            <div className="border-b">
              <QualityAssurancePanel
                segment={selectedSegment}
                onQualityUpdate={(quality) => 
                  selectedSegment && handleSegmentUpdate(selectedSegment.id, { quality })
                }
              />
            </div>
          )}
          
          {showCulturalGuide && (
            <div className="flex-1">
              <CulturalAdaptationGuide
                sourceLanguage={sourceLanguage}
                targetLanguage={targetLanguage}
                segment={selectedSegment}
                project={project}
              />
            </div>
          )}
        </div>
      </div>

      {/* Conflict Resolution */}
      {hasConflicts && (
        <div className="border-t bg-destructive/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="font-medium">Content Conflict Detected</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => resolveConflict(false)}>
                Keep Local
              </Button>
              <Button size="sm" onClick={() => resolveConflict(true)}>
                Accept Remote
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};