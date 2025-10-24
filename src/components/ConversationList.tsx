import { Conversation } from '../types/conversation';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { X } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  isLoading?: boolean;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function ConversationList({ conversations, selectedId, onSelectConversation, isLoading = false, onBack, showBackButton = false }: ConversationListProps) {
  return (
    <div 
      className="flex flex-col h-full" 
      style={{ 
        backgroundColor: '#f7f4ed',
        borderRight: '1px solid #d5d2cb',
      }}
    >
      <div 
        className="p-6" 
        style={{ borderBottom: '1px solid #d5d2cb' }}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-['Rhymes_Display:Medium',_sans-serif] leading-[38px] not-italic text-[28px] text-neutral-900 tracking-[-0.7px]" style={{ margin: 0 }}>
            Conversations
          </h2>
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 flex-shrink-0"
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: '#e9e6df',
                border: '1px solid #d5d2cb',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#171717',
                fontSize: '13px',
                fontFamily: "'General Sans', sans-serif",
                fontWeight: '500',
              }}
            >
              <X size={14} />
              Back
            </button>
          )}
        </div>
        <p 
          className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic text-[15px]" 
          style={{ color: 'rgba(23,23,23,0.7)', margin: 0 }}
        >
          {conversations.length} total
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="p-4"
                style={{ borderBottom: '1px solid #d5d2cb' }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Skeleton className="h-5 w-3/4" style={{ backgroundColor: 'rgba(23,23,23,0.08)' }} />
                  <Skeleton className="h-6 w-12 rounded-[6px]" style={{ backgroundColor: 'rgba(23,23,23,0.08)' }} />
                </div>
                <Skeleton className="h-4 w-1/2 mb-1" style={{ backgroundColor: 'rgba(23,23,23,0.08)' }} />
                <Skeleton className="h-4 w-1/3" style={{ backgroundColor: 'rgba(23,23,23,0.08)' }} />
              </div>
            ))
          ) : (
            conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className="w-full text-left p-4 transition-colors cursor-pointer"
              style={{
                backgroundColor: selectedId === conversation.id ? '#e9e6df' : 'transparent',
                borderBottom: '1px solid #d5d2cb',
              }}
            >
              <div className="flex flex-col gap-1">
                {conversation.title && (
                  <p 
                    style={{ 
                      margin: 0,
                      fontSize: '13px',
                      fontFamily: "'General Sans', sans-serif",
                      fontWeight: '500',
                      color: '#171717',
                      lineHeight: '1.5',
                      marginBottom: '2px',
                    }}
                  >
                    {conversation.title}
                  </p>
                )}
                
                <p 
                  style={{ 
                    margin: 0,
                    fontSize: '11px',
                    fontFamily: "'GT Flexa Mono', monospace",
                    fontWeight: '400',
                    color: '#8e8b85',
                    lineHeight: '1.5',
                  }}
                >
                  Conversation: {conversation.id}
                </p>
                
                {conversation.userId && (
                  <p 
                    style={{ 
                      margin: 0,
                      fontSize: '11px',
                      fontFamily: "'GT Flexa Mono', monospace",
                      fontWeight: '400',
                      color: '#8e8b85',
                      lineHeight: '1.5',
                    }}
                  >
                    User: {conversation.userId}
                  </p>
                )}
                
                <p 
                  style={{ 
                    margin: 0,
                    fontSize: '13px',
                    fontFamily: "'General Sans', sans-serif",
                    fontWeight: '400',
                    color: '#8e8b85',
                    lineHeight: '1.5',
                  }}
                >
                  {conversation.date.toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })}
                </p>
                
                <p 
                  style={{ 
                    margin: 0,
                    fontSize: '13px',
                    fontFamily: "'General Sans', sans-serif",
                    fontWeight: '500',
                    color: '#171717',
                    lineHeight: '1.5',
                  }}
                >
                  {conversation.messageCount ?? conversation.messages.length} messages
                </p>
              </div>
            </button>
          )))}
        </div>
      </ScrollArea>
    </div>
  );
}
