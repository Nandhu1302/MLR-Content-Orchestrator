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

>;
}

const HighlightedContentEditor = ({ 
  asset, 
  onContentChange, 
  validationHighlights 
}) => {
  const [content, setContent] = useState(asset?.content || '');
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const textareaRef = useRef(null);
  const overlayRef = useRef(null);

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
    const handleTemplateInsert = (event) => {
      const { type } = event.detail;
      const templates = {
        disclaimer: "\n\nIMPORTANT SAFETY INFORMATION see full Prescribing Information, including BOXED WARNING.",
        fairBalance: "\n\nThe most common adverse reactions (≥3%) are diarrhea, nausea, abdominal pain, vomiting, liver enzyme elevation, decreased appetite, headache, weight decreased, and hypertension.",
        prescribingInfo: "\n\nPlease see full Prescribing Information for complete safety and efficacy information.",
        references: "\n\nReferences:\n1. [Reference citation will be added here]\n2. [Reference citation will be added here]"
      };
      
      const template = templates[type as keyof typeof templates];
      if (template) {
        const newContent = content + template;
        setContent(newContent);
        setHasUnsavedChanges(true);
      }
    };

    // Listen for smart content insertion events
    const handleSmartInsert = (event) => {
      const { insertionType, insertionText } = event.detail;
      
      console.log('Smart insert event received:', { insertionType, insertionText });
      
      if (!insertionText || insertionText.trim() === '') {
        console.error('Smart insertion failed is empty or undefined');
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
          insertionPoint.insertionPoint,
          originalLength.length,
          newLength.newContent.length
        });
        
        setContent(result.newContent);
        setHasUnsavedChanges(true);
        
        // Emit event with insertion details for UI feedback
        document.dispatchEvent(new CustomEvent('smartInsertionComplete', {
          detail: { 
            insertionPoint.insertionPoint,
            newContent.newContent
          }
        }));
      });
    };

    document.addEventListener('insertTemplate', handleTemplateInsert as EventListener);
    document.addEventListener('smartInsertTemplate', handleSmartInsert as EventListener);
    
    return () => {
      document.removeEventListener('insertTemplate', handleTemplateInsert as EventListener);
      document.removeEventListener('smartInsertTemplate', handleSmartInsert as EventListener);
    };
  }, [content]);

  useEffect(() => {
    // Listen for highlight selection events from validation panels
    const handleHighlightSelect = (event) => {
      const { id, start, end } = event.detail;
      setSelectedHighlight(id);
      
      // Scroll to highlight position in textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, end);
      }
    };

    document.addEventListener('selectHighlight', handleHighlightSelect as EventListener);
    return () => {
      document.removeEventListener('selectHighlight', handleHighlightSelect as EventListener);
    };
  }, []);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
    
    // Emit content change event for real-time validation
    document.dispatchEvent(new CustomEvent('contentChanged', {
      detail: { content }
    }));
  };

  const handleSave = () => {
    const updatedAsset = {
      ...asset,
      content,
      updated_at Date().toISOString()
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
      const after = highlightedContent.substring(highlight.end);
      
      const highlightClass = {
        claim: 'bg-red-100 border-b-2 border-red-400',
        reference: 'bg-blue-100 border-b-2 border-blue-400',
        regulatory: 'bg-yellow-100 border-b-2 border-yellow-400',
        warning: 'bg-orange-100 border-b-2 border-orange-400'
      }[highlight.type];

      highlightedContent = `${before}${highlighted}${after}`;
    });

    return highlightedContent;
  };

  const getHighlightStats = () => {
    const stats = {
      claims.filter(h => h.type === 'claim').length,
      references.filter(h => h.type === 'reference').length,
      regulatory.filter(h => h.type === 'regulatory').length,
      warnings.filter(h => h.severity === 'warning' || h.severity === 'error').length
    };
    return stats;
  };

  const stats = getHighlightStats();

  return (
    
      {/* Editor Header */}
      
        
          
            
              
              {asset?.title || 'Content Editor'}
            
            
              {isEditing ? 'Editing mode - Make changes to your content' : 'Preview mode - Content validation active'}
            
          
          
          
            {stats.warnings > 0 && (
              
                
                {stats.warnings} Issues
              
            )}
            {stats.claims > 0 && (
              
                {stats.claims} Claims
              
            )}
            {stats.references > 0 && (
              
                {stats.references} References
              
            )}
            
            {hasUnsavedChanges && (
              
                Unsaved Changes
              
            )}
          
        
      

      {/* Editor Content */}
      
        
          
            
              Content
              
                {isEditing ? (
                  <>
                    
                      
                      Discard
                    
                    
                      
                      Save
                    
                  
                ) : (
                   setIsEditing(true)}>
                    
                    Edit
                  
                )}
              
            
          
          
            {isEditing ? (
               handleContentChange(e.target.value)}
                className="h-full resize-none border-0 focus-visible-0 text-sm leading-relaxed"
                placeholder="Enter your content here..."
              />
            ) : (
              
                
                   {
                      const target = e.target as HTMLElement;
                      const highlightId = target.getAttribute('data-highlight-id');
                      if (highlightId) {
                        setSelectedHighlight(highlightId);
                        // Emit event to highlight corresponding issue in validation panels
                        document.dispatchEvent(new CustomEvent('highlightSelected', {
                          detail: { id }
                        }));
                      }
                    }}
                  />
                
              
            )}
          
        
      

      {/* Validation Summary */}
      {!isEditing && validationHighlights.length > 0 && (
        
          
            
              
              Claims ({stats.claims})
            
            
              
              References ({stats.references})
            
            
              
              Regulatory ({stats.regulatory})
            
            {stats.warnings > 0 && (
              
                
                
                  {stats.warnings} issue{stats.warnings !== 1 ? 's' : ''} need attention
                
              
            )}
          
        
      )}
    
  );
};

export default HighlightedContentEditor;
