import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldIntelligenceRecommendations } from '@/components/intelligence/FieldIntelligenceRecommendations';
import { FieldIntelligenceService } from '@/services/fieldIntelligenceService';

// Utility function to strip HTML tags and convert to plain text for editing
const stripHtmlTags = (html) => {
  if (!html) return '';
  
  // Create a temporary div to parse HTML and extract text content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Get text content and clean up extra whitespace
  return tempDiv.textContent || tempDiv.innerText || '';
};

export const EnhancedContentEditor = ({
  field,
  label,
  value,
  onChange,
  placeholder = '',
  context,
  isGenerating = false,
  onGeneratingChange,
  component = 'input',
  rows = 4
}) => {
  const [intelligenceRecommendations, setIntelligenceRecommendations] = useState([]);
  const [loadingIntelligence, setLoadingIntelligence] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  // Auto-expand textarea based on content
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate new height based on content
    const minHeight = rows * 24; // ~24px per row
    const maxHeight = isExpanded ? 600 : 300;
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    
    textarea.style.height = `${newHeight}px`;
  }, [rows, isExpanded]);

  // Adjust height when value changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  // Load intelligence recommendations when field or context changes
  useEffect(() => {
    const loadIntelligence = async () => {
      if (!context?.brandId) return;
      
      setLoadingIntelligence(true);
      try {
        const recommendations = await FieldIntelligenceService.getFieldRecommendations(
          context.brandId,
          field,
          value,
          {
            assetType: context.assetType,
            targetAudience: context.targetAudience,
            therapeuticArea: context.therapeuticArea,
            indication: context.indication
          }
        );
        setIntelligenceRecommendations(recommendations);
      } catch (error) {
        console.error('Error loading intelligence:', error);
      } finally {
        setLoadingIntelligence(false);
      }
    };

    loadIntelligence();
  }, [field, context?.brandId, context?.assetType, context?.targetAudience]);
  
  const getMinHeight = () => {
    if (component === 'textarea') {
      if (rows >= 6) return 'min-h-[180px]';
      if (rows >= 4) return 'min-h-[120px]';
      return 'min-h-[80px]';
    }
    return 'min-h-[44px]';
  };

  return (
    <div className="space-y-2">
      {/* Clean Content Input Area */}
      <div className="relative space-y-2">
        {component === 'textarea' ? (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={stripHtmlTags(value)}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full p-4 pr-10 text-base leading-relaxed ${getMinHeight()} resize-none border-2 focus:border-primary/50 transition-all rounded-md overflow-y-auto ${isExpanded ? 'max-h-[600px]' : 'max-h-[300px]'}`}
              rows={rows}
            />
            {/* Expand/Collapse button for long content */}
            {stripHtmlTags(value).length > 100 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-60 hover:opacity-100"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>
            )}
          </div>
        ) : (
          <div className="relative">
            {isExpanded ? (
              <textarea
                value={stripHtmlTags(value)}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 pr-10 text-base leading-relaxed min-h-[120px] max-h-[300px] resize-none border-2 focus:border-primary/50 transition-all rounded-md"
                rows={4}
              />
            ) : (
              <input
                value={stripHtmlTags(value)}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full p-4 pr-10 text-base leading-relaxed ${getMinHeight()} border-2 focus:border-primary/50 transition-colors rounded-md`}
              />
            )}
            {/* Expand/Collapse button for inputs with content */}
            {stripHtmlTags(value).length > 30 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-60 hover:opacity-100"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse to single line' : 'Expand to see full content'}
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>
            )}
          </div>
        )}
        
        {/* Simplified Character Count */}
        {value && value.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{stripHtmlTags(value).length} characters</span>
            {component === 'textarea' && stripHtmlTags(value).length > 20 && (
              <span>{stripHtmlTags(value).split(' ').filter(w => w.length > 0).length} words</span>
            )}
          </div>
        )}
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <div className="flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-700 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
          <span>AI is analyzing context and generating content...</span>
        </div>
      )}

      {/* Phase 5: Field-Level Intelligence Recommendations */}
      {!loadingIntelligence && intelligenceRecommendations.length > 0 && (
        <div className="mt-3">
          <FieldIntelligenceRecommendations
            field={label}
            currentValue={value}
            recommendations={intelligenceRecommendations}
            onApplyRecommendation={onChange}
          />
        </div>
      )}
    </div>
  );
};