
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
// interface Message {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
// }
//
// interface ConversationMessageProps {
//   message: Message;
// }
*/

export const ConversationMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'flex-1 max-w-[80%] rounded-lg p-3 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground ml-auto'
            : 'bg-muted text-foreground'
        )}
      >
        <div className="whitespace-pre-wrap space-y-2">
          {message.content.split('\n').map((line, idx) => {
            // Parse inline intelligence badges like [CML-001: claim text]
            const badgeMatch = line.match(/\[([A-Z]+-\d+):\s*([^\]]+)\]/);
            if (badgeMatch) {
              const [full, code, text] = badgeMatch;
              return (
                <div key={idx} className="flex items-start gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/20">
                    {code}
                  </span>
                  <span className="flex-1">{text}</span>
                </div>
              );
            }
            
            // Parse performance metrics like "32% higher engagement"
            const metricMatch = line.match(/(\d+%|\d+\.\d+x)/);
            if (metricMatch && !isUser) {
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-primary font-semibold">{metricMatch[0]}</span>
                  <span>{line.replace(metricMatch[0], '')}</span>
                </div>
              );
            }
            
            // Parse bullet points
            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
              return (
                <div key={idx} className="flex items-start gap-2 pl-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="flex-1">{line.replace(/^[•\-]\s*/, '')}</span>
                </div>
              );
            }
            
            // Parse section headers (lines ending with :)
            if (line.trim().endsWith(':') && line.length < 50) {
              return (
                <div key={idx} className="font-semibold text-foreground mt-2">
                  {line}
                </div>
              );
            }
            
            return <div key={idx}>{line}</div>;
          })}
        </div>
      </div>
    </div>
  );
};
