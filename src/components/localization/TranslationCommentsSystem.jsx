import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Reply, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export const TranslationCommentSystem = ({
  segmentId,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState('general');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const textareaRef = useRef(null);
  
  const { user } = useAuth();

  const handleSubmitComment = () => {
    if (!newComment.trim() || !user) return;

    const comment = {
      author: {
        id: user.id,
        name: user.email?.split('@')[0] || 'Anonymous',
        role: 'Translator'
      },
      content: newComment.trim(),
      type: commentType,
      updatedAt: new Date().toISOString()
    };

    onAddComment(comment);
    setNewComment('');
    setCommentType('general');
  };

  const handleSubmitReply = (parentId) => {
    if (!replyContent.trim() || !user) return;

    const reply = {
      author: {
        id: user.id,
        name: user.email?.split('@')[0] || 'Anonymous',
        role: 'Translator'
      },
      content: replyContent.trim(),
      type: 'general',
      parentId,
      updatedAt: new Date().toISOString()
    };

    onAddComment(reply);
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleResolveComment = (commentId) => {
    if (onUpdateComment) {
      onUpdateComment(commentId, { resolved: true });
    }
  };

  const getCommentIcon = (type) => {
    switch (type) {
      case 'suggestion': return <Info className="h-4 w-4 text-blue-600" />;
      case 'question': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'approval': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'concern': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCommentTypeColor = (type) => {
    switch (type) {
      case 'suggestion': return 'border-blue-200 bg-blue-50';
      case 'question': return 'border-purple-200 bg-purple-50';
      case 'approval': return 'border-green-200 bg-green-50';
      case 'concern': return 'border-red-200 bg-red-50';
      default: return 'border-border bg-background';
    }
  };

  // Organize comments into threads
  const threadedComments = comments.reduce((acc, comment) => {
    if (!comment.parentId) {
      acc[comment.id] = { comment, replies: [] };
    } else {
      const parent = acc[comment.parentId];
      if (parent) {
        parent.replies.push(comment);
      }
    }
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments & Reviews
          </h3>
          <Badge variant="outline" className="text-xs">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </Badge>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.values(threadedComments).length > 0 ? (
          Object.values(threadedComments).map(({ comment, replies }) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className={cn(
                "border rounded-lg p-3 transition-colors",
                getCommentTypeColor(comment.type),
                comment.resolved && "opacity-60"
              )}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback className="text-xs">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.author.name}</span>
                      {comment.author.role && (
                        <Badge variant="outline" className="text-xs">
                          {comment.author.role}
                        </Badge>
                      )}
                      {getCommentIcon(comment.type)}
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt || Date.now()).toLocaleString()}
                      </span>
                      {comment.resolved && (
                        <Badge variant="default" className="text-xs">
                          Resolved
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-foreground leading-relaxed mb-2">
                      {comment.content}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => setReplyingTo(comment.id)}
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                      
                      {!comment.resolved && onUpdateComment && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={() => handleResolveComment(comment.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolve
                        </Button>
                      )}
                      
                      {comment.author.id === user?.id && onDeleteComment && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2 text-destructive"
                          onClick={() => onDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {replies.length > 0 && (
                <div className="ml-8 space-y-2">
                  {replies.map((reply) => (
                    <div key={reply.id} className="border rounded-lg p-3 bg-muted/50">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {reply.author.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">{reply.author.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.createdAt || Date.now()).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-foreground leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="ml-8">
                  <div className="flex gap-2">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="text-sm resize-none"
                      rows={2}
                    />
                    <div className="flex flex-col gap-1">
                      <Button 
                        size="sm" 
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim()}
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No comments yet</p>
            <p className="text-xs">Start a discussion about this translation</p>
          </div>
        )}
      </div>

      {/* New Comment Form */}
      <div className="border-t p-4">
        <div className="space-y-3">
          {/* Comment Type Selector */}
          <div className="flex gap-1 overflow-x-auto">
            {['general', 'suggestion', 'question', 'concern'].map((type) => (
              <Button
                key={type}
                variant={commentType === type ? "default" : "outline"}
                size="sm"
                className="text-xs capitalize whitespace-nowrap"
                onClick={() => setCommentType(type)}
              >
                {getCommentIcon(type)}
                <span className="ml-1">{type}</span>
              </Button>
            ))}
          </div>

          {/* Comment Input */}
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Write a ${commentType}...`}
              className="text-sm resize-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Press Cmd/Ctrl + Enter to submit
          </p>
        </div>
      </div>
    </div>
  );
};