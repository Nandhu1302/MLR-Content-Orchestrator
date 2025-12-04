
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, RotateCcw, Loader2 } from 'lucide-react';
import { ConversationMessage } from './ConversationMessage';
import { QuickReplyButtons } from './QuickReplyButtons';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
// import type { ConversationContext, AIEnhancedBrief } from '@/types/workshop'; // (Removed in JS)

// interface Message {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   quickReplies?: { label: string; value: string }[];
// } // (Removed in JS)

// interface AIStoryConsultantProps {
//   context: ConversationContext;
//   onContextUpdate: (updates: Partial<ConversationContext>) => void;
//   onConfirmReady?: () => void; // NEW: Callback when user confirms understanding
//   onReset: () => void;
// } // (Removed in JS)

export const AIStoryConsultant = ({ context, onContextUpdate, onConfirmReady, onReset }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const messagesEndRef = useRef(null);
  const { toast } = useToast();
  // Calculate conversation-quality based progress
  const conversationTurns = messages.filter(m => m.role === 'user').length;
  const hasUserConfirmed = context.userConfirmedStrategy === true;
  const hasAISummarized = messages.some(m =>
    m.role === 'assistant' && (
      m.content.includes('Here\'s my recommended strategy')
      ||
      m.content.includes('Ready to generate')
      ||
      m.content.includes('Shall I prepare')
    )
  );
  const canShowGenerateButton =
    conversationTurns >= 2 && // At least 2 user responses for meaningful conversation
    hasAISummarized && // AI has provided strategy summary
    hasUserConfirmed; // User explicitly confirmed
  // Legacy progress for display purposes
  const progress = {
    total: 4,
    completed: [
      context.detectedIntent?.occasion ? 1 : 0,
      context.detectedIntent?.audience ? 1 : 0,
      context.detectedIntent?.goals?.length ? 1 : 0,
      context.selectedAssets?.length ? 1 : 0
    ].filter(Boolean).length
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    // Start conversation with initial message
    if (context.userStory && messages.length === 0) {
      // Use AI-generated greeting if available (from pre-analysis)
      if (context.initialGreeting) {
        const initialMessage = {
          id: 'greeting',
          role: 'assistant',
          content: context.initialGreeting,
          // Use server-side quick replies if available, otherwise generate client-side
          quickReplies: context.initialQuickReplies
            ||
            generateContextAwareReplies(context.detectedIntent)
        };
        setMessages([initialMessage]);
      }
      // Template-aware greeting if a scenario was pre-selected
      else if (context.matchedTemplateId) {
        const initialMessage = {
          id: 'greeting',
          role: 'assistant',
          content: `👋 Great choice! I see you've selected a proven template. This type of campaign has shown strong success rates. Let me help you customize it for your specific audience - who will you be targeting?`,
          quickReplies: [
            { label: '👨‍⚕️ HCP Specialists', value: 'hcp-specialist' },
            { label: '🏥 Primary Care', value: 'primary-care' },
            { label: '🤝 Patients', value: 'patient' },
            { label: '❤️ Caregivers', value: 'caregiver' }
          ]
        };
        setMessages([initialMessage]);
      } else {
        // Fallback generic greeting
        const initialMessage = {
          id: 'greeting',
          role: 'assistant',
          content: `👋 Hi! I've read your story. Let me help you create the perfect content strategy. First, let me understand the occasion better - what's the main trigger for this content?`,
          quickReplies: [
            { label: '🏪 Upcoming Event', value: 'event' },
            { label: '🚀 Product Launch', value: 'launch' },
            { label: '⚔️ Competitive Response', value: 'competitive' },
            { label: '📚 Educational Campaign', value: 'education' }
          ]
        };
        setMessages([initialMessage]);
      }
    }
  }, [context.userStory, messages.length, context.matchedTemplateId, context.initialGreeting]);
  const sendMessage = async (content) => {
    if (!content.trim()
      ||
      isLoading) return;
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    // Show typing indicator with brand-aware message
    const typingMessages = [
      'Analyzing your brand intelligence...',
      'Reviewing clinical evidence...',
      'Checking success patterns...',
      'Preparing recommendations...'
    ];
    let typingIndex = 0;
    const typingInterval = setInterval(() => {
      setTypingText(typingMessages[typingIndex % typingMessages.length]);
      typingIndex++;
    }, 1500);
    try {
      // Call edge function with full context including detectedIntent
      const { data, error } = await supabase.functions.invoke('story-consultant', {
        body: {
          userMessage: content,
          conversationHistory: messages,
          context: {
            ...context,
            // Ensure detectedIntent is always included
            detectedIntent: context.detectedIntent
          }
        }
      });
      if (error) throw error;
      clearInterval(typingInterval);
      setTypingText('');
      // Add AI response
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        quickReplies: data.quickReplies
      };
      setMessages(prev => [...prev, aiMessage]);
      // Update context with any extracted information
      if (data.contextUpdates) {
        // Merge detectedIntent updates to preserve previous extractions
        const updatedContext = {
          ...data.contextUpdates
        };
        // Explicitly merge detectedIntent to preserve existing values
        if (data.contextUpdates.detectedIntent) {
          updatedContext.detectedIntent = {
            ...context.detectedIntent,
            ...data.contextUpdates.detectedIntent
          };
        }
        onContextUpdate(updatedContext);
      }
    } catch (error) {
      console.error('Error in AI consultation:', error);
      clearInterval(typingInterval);
      setTypingText('');
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleQuickReply = (value, label) => {
    // Check if this is strategy confirmation
    if (value === 'confirm-strategy'
      ||
      value === 'generate'
      ||
      value === 'confirm'
      ||
      label.includes('generate')
      ||
      label.includes('Generate Themes')
      ||
      label === "Let's proceed") {
      // Update context to mark strategy as confirmed
      onContextUpdate({ userConfirmedStrategy: true, conversationStage: 'confirmed' });
      // If confirmed and Generate button should appear, trigger it
      if (onConfirmReady && hasAISummarized && conversationTurns >= 2) {
        onConfirmReady();
      }
      return;
    }
    sendMessage(label);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };
  // Generate context-aware quick replies based on detected intent
  const generateContextAwareReplies = (intent) => {
    if (!intent) {
      // Fallback: Basic occasion selection
      return [
        { label: '🏪 Upcoming Event', value: 'event' },
        { label: '🚀 Product Launch', value: 'launch' },
        { label: '⚔️ Competitive Response', value: 'competitive' },
        { label: '📚 Educational Campaign', value: 'education' }
      ];
    }
    // Helper to get audience string (handle both string and object types)
    const getAudienceString = () => {
      if (!intent.audience) return undefined;
      if (typeof intent.audience === 'string') return intent.audience;
      return intent.audience;
    };
    const audienceStr = getAudienceString();
    // Priority 1: If no audience specified yet, ask about audience first
    if (!intent.audience && !intent.audienceSeniority) {
      return [
        { label: '👨‍⚕️ HIV Specialists', value: 'hiv-specialists' },
        { label: '🏥 ID Physicians', value: 'id-physicians' },
        { label: '👨‍⚕️ Primary Care', value: 'primary-care' },
        { label: '👥 All HCP Types', value: 'all-hcp' }
      ];
    }
    // Priority 2: If audience known but not confirmed, offer audience options
    if (intent.audienceSeniority === 'kol'
      ||
      (audienceStr && typeof audienceStr === 'string' && audienceStr.toLowerCase().includes('specialist'))) {
      return [
        { label: '✅ HIV Specialists', value: 'confirm-specialists' },
        { label: '➕ Include ID Physicians', value: 'expand-id' },
        { label: '🤝 Include Patients', value: 'add-patients' },
        { label: '🎯 Multiple Audiences', value: 'multi-audience' }
      ];
    }
    // Priority 3: If event activities detected, suggest matching assets
    if (intent.activities && intent.activities.length > 0) {
      const activities = intent.activities;
      if (activities.includes('booth')
        ||
        activities.includes('podium')) {
        return [
          { label: '📊 Sales Aid (Booth)', value: 'sales-aid' },
          { label: '🎤 Presentation Slides', value: 'presentation' },
          { label: '📧 Follow-up Email', value: 'email' },
          { label: '✅ All Asset Types', value: 'generate' }
        ];
      }
    }
    // Priority 4: If goals not specified, ask about goals
    if (!intent.goals
      ||
      intent.goals.length === 0) {
      return [
        { label: '📢 Drive Awareness', value: 'awareness' },
        { label: '💊 Support Prescribing', value: 'prescribing' },
        { label: '🎓 Educate on Data', value: 'education' },
        { label: '🔄 Behavior Change', value: 'behavior' }
      ];
    }
    // Priority 5: If everything is specified, offer confirmation
    if (intent.occasion && intent.audience && intent.goals) {
      return [
        { label: '✅ Generate Themes', value: 'generate' },
        { label: '📝 Refine Strategy', value: 'refine' },
        { label: '📈 Show Me Data First', value: 'show-data' }
      ];
    }
    // Final fallback: Generic options
    return [
      { label: '✅ Looks Good', value: 'confirm' },
      { label: '📝 Tell Me More', value: 'more-info' },
      { label: '🔄 Adjust Strategy', value: 'adjust' }
    ];
  };
  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="border-b shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>AI Story Consultant</CardTitle>
              {progress.completed > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {context.detectedIntent?.occasion && <span className="text-primary">✓ Occasion</span>}
                    {context.detectedIntent?.audience && <span className="text-primary ml-1">✓ Audience</span>}
                    {context.detectedIntent?.goals?.length && <span className="text-primary ml-1">✓ Goals</span>}
                    {context.selectedAssets?.length && <span className="text-primary ml-1">✓ Assets</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {progress.completed}/{progress.total} complete
                  </span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {context.detectedIntent?.needsClarification && messages.length === 1 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 text-xl">🤔</span>
              <div>
                <p className="text-sm font-medium text-amber-900">I need more context</p>
                <p className="text-xs text-amber-700 mt-1">Help me understand what you're trying to create so I can provide the best recommendations.</p>
              </div>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id}>
            <ConversationMessage message={message} />
            {message.quickReplies && message.role === 'assistant' && (
              <div className="mt-2">
                <QuickReplyButtons
                  options={message.quickReplies}
                  onSelect={handleQuickReply}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm font-medium">{typingText}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="border-t p-4 shrink-0 space-y-2">
        {/* Only show Generate Themes when:
        1. At least 2 conversation turns completed
        2. AI has provided strategy summary
        3. User has explicitly confirmed
        */}
        {canShowGenerateButton && onConfirmReady && (
          <Button
            onClick={onConfirmReady}
            className="w-full mb-2"
            size="lg"
          >
            ✅ Generate Themes →
          </Button>
        )}
        {/* Show progress indicator when still in conversation */}
        {!canShowGenerateButton && conversationTurns > 0 && (
          <div className="text-center text-sm text-muted-foreground mb-2">
            💬 {conversationTurns < 2
              ? 'Continue the conversation to refine your strategy...'
              : !hasAISummarized
              ? 'Ask AI to summarize the strategy when ready'
              : 'Select "✅ Yes" above to generate themes'}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={!input.trim()
            ||
            isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};
