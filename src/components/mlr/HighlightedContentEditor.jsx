import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Edit3, 
  Save, 
  RotateCcw,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

// Removed interface HighlightedContentEditorProps

export const HighlightedContentEditor = ({ 
  asset, 
  onContentChange, 
  validationHighlights 
}) => { // Removed : HighlightedContentEditorProps
  const [content, setContent] = useState(asset?.content || '');
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // Removed <string | null> type annotation
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const textareaRef = useRef(null); // Removed <HTMLTextAreaElement> type annotation
  const overlayRef = useRef(null); // Removed <HTMLDivElement> type annotation

  useEffect(() => {
    // Extract content from asset - handle different structures
    let extractedContent = '';
    
    if (asset?.content && typeof asset.content === 'string') {
      extractedContent = asset.content;
    } else if (asset?.primary_content) {
      // Handle JSONB primary_content structure
      const pc = asset.primary_content;
      const parts = [];
      if (pc.subject) parts.push(`Subject: ${pc.subject}`);
      if (pc.preheader) parts.push(`Preheader: ${pc.preheader}`);
      if (pc.headline) parts.push(`Headline: ${pc.headline}`);
      if (pc.heroHeadline) parts.push(`Hero Headline: ${pc.heroHeadline}`);
      if (pc.keyMessage) parts.push(`Key Message: ${pc.keyMessage}`);
      if (pc.body) parts.push(pc.body);
      if (pc.bodyText) parts.push(pc.bodyText);
      if (pc.clinicalEvidence) parts.push(`Clinical Evidence: ${pc.clinicalEvidence}`);
      if (pc.safetyInformation) parts.push(`Safety Information: ${pc.safetyInformation}`);
      if (pc.cta) parts.push(`CTA: ${pc.cta}`);
      if (pc.disclaimer) parts.push(`Disclaimer: ${pc.disclaimer}`);
      extractedContent = parts.join('\n\n');
    }
    
    setContent(extractedContent || '');
    setHasUnsavedChanges(false);
  }, [asset]);

  useEffect(() => {
    // Listen for template insertion events
    // Removed (event: CustomEvent) type annotation
    const handleTemplateInsert = (event) => {
      const { type } = event.detail;
      const templates = {
        disclaimer: "\n\nIMPORTANT SAFETY INFORMATION: Please see full Prescribing Information, including BOXED WARNING.",
        fairBalance: "\n\nThe most common adverse reactions (≥3%) are diarrhea, nausea, abdominal pain, vomiting, liver enzyme elevation, decreased appetite, headache, weight decreased, and hypertension.",
        prescribingInfo: "\n\nPlease see full Prescribing Information for complete safety and efficacy information.",
        references: "\n\nReferences:\n1. [Reference citation will be added here]\n2. [Reference citation will be added here]"
      };
      
      // Removed as keyof typeof templates type assertion
      const template = templates[type];
      if (template) {
        const newContent = content + template;
        setContent(newContent);
        setHasUnsavedChanges(true);
      }
    };

    // Listen for smart content insertion events
    // Removed (event: CustomEvent) type annotation
    const handleSmartInsert = (event) => {
      const { insertionType, insertionText } = event.detail;
      
      console.log('Smart insert event received:', { insertionType, insertionText });
      
      if (!insertionText || insertionText.trim() === '') {
        console.error('Smart insertion failed: insertionText is empty or undefined');
        return;
      }
      
      // Import SmartContentInsertion dynamically to avoid circular imports
      import('@/utils/smartContentInsertion').then(({ SmartContentInsertion }) => {
        const result = SmartContentInsertion.insertTextAtOptimalPosition(
          content,
          insertionType,
          insertionText
        );
        
        console.log('Smart insertion result:', { 
          insertionPoint: result.insertionPoint,
          originalLength: content.length,
          newLength: result.newContent.length
        });
        
        setContent(result.newContent);
        setHasUnsavedChanges(true);
        
        // Emit event with insertion details for UI feedback
        document.dispatchEvent(new CustomEvent('smartInsertionComplete', {
          detail: { 
            insertionPoint: result.insertionPoint,
            newContent: result.newContent
          }
        }));
      });
    };

    // Removed as EventListener type assertion
    document.addEventListener('insertTemplate', handleTemplateInsert);
    document.addEventListener('smartInsertTemplate', handleSmartInsert);
    
    return () => {
      document.removeEventListener('insertTemplate', handleTemplateInsert);
      document.removeEventListener('smartInsertTemplate', handleSmartInsert);
    };
  }, [content]);

  useEffect(() => {
    // Listen for highlight selection events from validation panels
    // Removed (event: CustomEvent) type annotation
    const handleHighlightSelect = (event) => {
      const { id, start, end } = event.detail;
      setSelectedHighlight(id);
      
      // Scroll to highlight position in textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, end);
      }
    };

    // Removed as EventListener type assertion
    document.addEventListener('selectHighlight', handleHighlightSelect);
    return () => {
      document.removeEventListener('selectHighlight', handleHighlightSelect);
    };
  }, []);

  // Removed (newContent: string) type annotation
  const handleContentChange = (newContent) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
    
    // Emit content change event for real-time validation
    document.dispatchEvent(new CustomEvent('contentChanged', {
      detail: { content: newContent }
    }));
  };

  const handleSave = () => {
    const updatedAsset = {
      ...asset,
      content,
      updated_at: new Date().toISOString()
    };
    onContentChange(updatedAsset);
    setHasUnsavedChanges(false);
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setContent(asset?.content || '');
    setHasUnsavedChanges(false);
    setIsEditing(false);
  };

  const renderHighlightedContent = () => {
    if (!validationHighlights.length) {
      return content;
    }

    let highlightedContent = content;
    const sortedHighlights = [...validationHighlights].sort((a, b) => b.start - a.start);

    sortedHighlights.forEach(highlight => {
      const before = highlightedContent.substring(0, highlight.start);
      const highlighted = highlightedContent.substring(highlight.start, highlight.end);
      const after = highlightedContent.substring(highlightedContent.length, highlight.end); // Fixed: should be substring(highlight.end)
      const afterFixed = highlightedContent.substring(highlight.end);

      
      const highlightClass = {
        claim: 'bg-red-100 border-b-2 border-red-400',
        reference: 'bg-blue-100 border-b-2 border-blue-400',
        regulatory: 'bg-yellow-100 border-b-2 border-yellow-400',
        warning: 'bg-orange-100 border-b-2 border-orange-400'
      }[highlight.type];

      highlightedContent = `${before}<span class="${highlightClass} cursor-pointer" data-highlight-id="${highlight.id}">${highlighted}</span>${afterFixed}`;
    });

    return highlightedContent;
  };

  const getHighlightStats = () => {
    const stats = {
      claims: validationHighlights.filter(h => h.type === 'claim').length,
      references: validationHighlights.filter(h => h.type === 'reference').length,
      regulatory: validationHighlights.filter(h => h.type === 'regulatory').length,
      warnings: validationHighlights.filter(h => h.severity === 'warning' || h.severity === 'error').length
    };
    return stats;
  };

  const stats = getHighlightStats();

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {asset?.title || 'Content Editor'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Editing mode - Make changes to your content' : 'Preview mode - Content validation active'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {stats.warnings > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {stats.warnings} Issues
              </Badge>
            )}
            {stats.claims > 0 && (
              <Badge variant="secondary" className="text-xs">
                {stats.claims} Claims
              </Badge>
            )}
            {stats.references > 0 && (
              <Badge variant="secondary" className="text-xs">
                {stats.references} References
              </Badge>
            )}
            
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-xs">
                Unsaved Changes
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-4 overflow-hidden">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Content</CardTitle>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button size="sm" variant="outline" onClick={handleDiscard}>
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Discard
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-60px)]">
            {isEditing ? (
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="h-full resize-none border-0 focus-visible:ring-0 text-sm leading-relaxed"
                placeholder="Enter your content here..."
              />
            ) : (
              <ScrollArea className="h-full">
                <div className="p-4 relative">
                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: renderHighlightedContent() }}
                    onClick={(e) => {
                      const target = e.target; // Removed : as HTMLElement
                      const highlightId = target.getAttribute('data-highlight-id');
                      if (highlightId) {
                        setSelectedHighlight(highlightId);
                        // Emit event to highlight corresponding issue in validation panels
                        document.dispatchEvent(new CustomEvent('highlightSelected', {
                          detail: { id: highlightId }
                        }));
                      }
                    }}
                  />
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Validation Summary */}
      {!isEditing && validationHighlights.length > 0 && (
        <div className="border-t p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-xs">Claims ({stats.claims})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span className="text-xs">References ({stats.references})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span className="text-xs">Regulatory ({stats.regulatory})</span>
            </div>
            {stats.warnings > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600">
                  {stats.warnings} issue{stats.warnings !== 1 ? 's' : ''} need attention
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};