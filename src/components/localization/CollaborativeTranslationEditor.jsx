import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Languages, 
  Check, 
  X, 
  RotateCcw, 
  Copy,
  Eye,
  Edit3,
  MessageSquare,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const CollaborativeTranslationEditor = ({
  segment,
  onSegmentUpdate,
  activeUsers,
  onCursorUpdate
}) => {
  const [localTargetText, setLocalTargetText] = useState(segment.targetText);
  const [isEditing, setIsEditing] = useState(false);
  const [selectionRange, setSelectionRange] = useState(null);
  const textareaRef = useRef(null);

  // Update local state when segment changes
  useEffect(() => {
    setLocalTargetText(segment.targetText);
  }, [segment.targetText]);

  const handleTextChange = (value) => {
    setLocalTargetText(value);
    if (!isEditing) {
      setIsEditing(true);
      onSegmentUpdate(segment.id, { status: 'in_progress' });
    }
  };

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newSelection = { start, end };
      setSelectionRange(newSelection);
      if (onCursorUpdate) {
        onCursorUpdate(undefined, newSelection);
      }
    }
  };

  const handleSave = () => {
    onSegmentUpdate(segment.id, { 
      targetText: localTargetText,
      status: localTargetText ? 'translated' : 'pending'
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalTargetText(segment.targetText);
    setIsEditing(false);
  };

  const handleApprove = () => {
    onSegmentUpdate(segment.id, { status: 'approved' });
  };

  const handleReject = () => {
    onSegmentUpdate(segment.id, { status: 'pending' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'reviewed': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'translated': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'in_progress': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Segment Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Badge className={cn("text-xs", getStatusColor(segment.status))}>
              {segment.status.replace('_', ' ')}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Segment {segment.id}
            </span>
            {segment.quality > 0 && (
              <span className="text-sm text-muted-foreground">
                Quality: {Math.round(segment.quality)}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeUsers.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                {activeUsers.length} viewing
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(segment.sourceText)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User Presence Indicators */}
        {activeUsers.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">Active collaborators:</span>
            {activeUsers.slice(0, 3).map(user => (
              <div
                key={user.userId}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: `${user.color}20`, color: user.color }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                {user.displayName}
              </div>
            ))}
            {activeUsers.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{activeUsers.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Source Text */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Source Text</span>
        </div>
        <div className="bg-background rounded-lg p-3 border">
          <p className="text-sm leading-relaxed">{segment.sourceText}</p>
        </div>
      </div>

      {/* Translation Editor */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Translation</span>
          </div>
          
          {isEditing && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={localTargetText}
            onChange={(e) => handleTextChange(e.target.value)}
            onSelect={handleSelectionChange}
            placeholder="Enter your translation here..."
            className="min-h-32 text-sm leading-relaxed resize-none"
            style={{ 
              fontFamily: 'inherit',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          />
          
          {/* Selection indicators for other users */}
          {activeUsers.map(user => (
            user.selection && (
              <div
                key={user.userId}
                className="absolute pointer-events-none"
                style={{
                  backgroundColor: `${user.color}20`,
                  borderLeft: `2px solid ${user.color}`,
                  // Note: In a real implementation, you'd calculate proper positioning
                  top: '10px',
                  left: '10px',
                  right: '10px',
                  height: '20px'
                }}
              />
            )
          ))}
        </div>

        {/* Translation Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Last modified: {new Date(segment.lastModified).toLocaleString()}
          </div>

          <div className="flex items-center gap-2">
            {segment.status === 'translated' && (
              <>
                <Button size="sm" variant="outline" onClick={handleReject}>
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm" onClick={handleApprove}>
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </>
            )}
            
            {segment.status === 'approved' && (
              <Button size="sm" variant="outline" onClick={() => onSegmentUpdate(segment.id, { status: 'translated' })}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reopen
              </Button>
            )}

            <Button size="sm" variant="outline">
              <MessageSquare className="h-4 w-4 mr-1" />
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Translation Metrics */}
      <div className="p-4 border-t bg-muted/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm font-medium">{localTargetText.length}</div>
            <div className="text-xs text-muted-foreground">Characters</div>
          </div>
          <div>
            <div className="text-sm font-medium">{localTargetText.split(/\s+/).filter(w => w.length > 0).length}</div>
            <div className="text-xs text-muted-foreground">Words</div>
          </div>
          <div>
            <div className="text-sm font-medium">
              {segment.quality > 0 ? `${Math.round(segment.quality)}%` : '-'}
            </div>
            <div className="text-xs text-muted-foreground">Quality</div>
          </div>
        </div>
      </div>
    </div>
  );
};