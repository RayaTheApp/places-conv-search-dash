import { Conversation } from '../types/conversation';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { PlaceCard } from './PlaceCard';
import { QuickResponses } from './QuickResponses';
import { TraceView } from './TraceView';
import { EvaluationView } from './EvaluationView';
import { buildUserMap } from '../utils/userMapping';
import { useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { RefreshCw, Play, AlertCircle } from 'lucide-react';

interface ConversationViewProps {
  conversation: Conversation | null;
  isLoadingDetails?: boolean;
  onRefresh?: (conversationId: string) => void;
  onRunEval?: (conversationId: string) => void;
  isRunningEval?: boolean;
}

interface PlaceListData {
  heading?: string;
  body?: string;
  places: any[];
}

interface QuickResponse {
  displayText: string;
  messageText: string;
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex flex-col items-end w-full mb-4">
      <div 
        className="max-w-[70%] px-4 py-2.5 rounded-2xl relative"
        style={{ backgroundColor: 'rgba(213,210,203,0.75)' }}
      >
        <div 
          aria-hidden="true" 
          className="absolute border border-[#d5d2cb] border-solid inset-0 pointer-events-none rounded-2xl" 
        />
        <p className="font-['Inter',_sans-serif] text-[16px] leading-[22px] text-neutral-900 relative whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
}

function AssistantMessage({ 
  content, 
  placeList, 
  quickResponses,
  userMap
}: { 
  content: string; 
  placeList?: PlaceListData;
  quickResponses?: QuickResponse[];
  userMap?: Map<string, string>;
}) {
  return (
    <div className="flex flex-col items-start w-full mb-4">
      <div className="max-w-[85%]">
        <p className="font-['Inter',_sans-serif] text-[16px] leading-[22px] text-neutral-900 whitespace-pre-wrap">
          {content}
        </p>
      </div>
      
      {/* Render place list if present */}
      {placeList && placeList.places && placeList.places.length > 0 && (
        <div className="mt-6 w-full">
          {placeList.heading && (
            <h3 className="font-['Rhymes_Display',_sans-serif] text-[24px] leading-[30px] tracking-[-0.6px] text-neutral-900 mb-2">
              {placeList.heading}
            </h3>
          )}
          {placeList.body && (
            <p className="font-['Inter',_sans-serif] text-[15px] leading-[20px] text-[rgba(23,23,23,0.7)] mb-4">
              {placeList.body}
            </p>
          )}
          <div className="flex flex-col gap-4">
            {placeList.places.map((place, index) => (
              <PlaceCard 
                key={place.placeId || index} 
                place={place}
                userMap={userMap}
              />
            ))}
          </div>
        </div>
      )}

      {/* Render quick responses if present */}
      {quickResponses && quickResponses.length > 0 && (
        <QuickResponses 
          responses={quickResponses}
          onResponseClick={(messageText) => {
            console.log('Quick response clicked:', messageText);
            // TODO: Implement sending the response
          }}
        />
      )}
    </div>
  );
}

export function ConversationView({ conversation, isLoadingDetails = false, onRefresh, onRunEval, isRunningEval = false }: ConversationViewProps) {
  const [activeTab, setActiveTab] = useState<'conversation' | 'trace' | 'evaluation'>('conversation');

  // Build user map from conversation data (must be called before early return)
  const userMap = useMemo(() => {
    return conversation ? buildUserMap(conversation) : new Map<string, string>();
  }, [conversation]);

  if (!conversation) {
    return (
      <div 
        className="flex items-center justify-center h-full overflow-clip relative" 
        style={{ backgroundColor: '#e9e6df' }}
      >
        <div className="text-center p-8">
          <p 
            className="font-['Inter',_sans-serif] text-[16px] leading-[22px]"
            style={{ color: 'rgba(23,23,23,0.4)' }}
          >
            Select a conversation to view details
          </p>
        </div>
      </div>
    );
  }

  // Show loading skeleton when loading details
  if (isLoadingDetails) {
    return (
      <div 
        className="h-full overflow-clip relative flex flex-col" 
        style={{ backgroundColor: '#e9e6df' }}
      >
        <div className="px-6 pt-8 pb-6">
          <Skeleton className="h-10 w-3/4 mb-3" style={{ backgroundColor: 'rgba(23,23,23,0.08)' }} />
          <Skeleton className="h-5 w-1/2 mb-4" style={{ backgroundColor: 'rgba(23,23,23,0.08)' }} />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-20 rounded-lg" style={{ backgroundColor: 'rgba(23,23,23,0.08)' }} />
            <Skeleton className="h-7 w-24 rounded-lg" style={{ backgroundColor: 'rgba(23,23,23,0.08)' }} />
          </div>
        </div>
        
        <div className="flex-1 px-6 space-y-4">
          {/* User message skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-16 w-1/2 rounded-2xl" style={{ backgroundColor: 'rgba(213,210,203,0.5)' }} />
          </div>
          
          {/* Assistant message skeleton */}
          <div className="flex justify-start">
            <Skeleton className="h-24 w-2/3 rounded-2xl" style={{ backgroundColor: 'rgba(23,23,23,0.08)' }} />
          </div>
          
          {/* User message skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-12 w-1/3 rounded-2xl" style={{ backgroundColor: 'rgba(213,210,203,0.5)' }} />
          </div>
          
          {/* Assistant message skeleton */}
          <div className="flex justify-start">
            <Skeleton className="h-32 w-3/4 rounded-2xl" style={{ backgroundColor: 'rgba(23,23,23,0.08)' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-full overflow-clip relative flex flex-col" 
      style={{ backgroundColor: '#e9e6df' }}
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'conversation' | 'trace' | 'evaluation')} className="flex-1 flex flex-col h-full">
        <div 
          className="px-6 py-4 flex-shrink-0 flex items-center justify-between gap-4"
          style={{ 
            backgroundColor: '#e9e6df',
            borderBottom: '1px solid #d5d2cb',
          }}
        >
          <TabsList className="grid w-[520px] grid-cols-3 h-11">
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="trace">Trace</TabsTrigger>
            <TabsTrigger value="evaluation">
              Evaluation
              {conversation.evaluation && (
                <span className={`ml-2 w-2 h-2 rounded-full ${conversation.evaluation.pass ? 'bg-green-500' : 'bg-red-500'}`} />
              )}
            </TabsTrigger>
          </TabsList>
          
          {onRefresh && conversation && (
            <button
              onClick={() => onRefresh(conversation.id)}
              disabled={isLoadingDetails}
              className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic text-[15px] transition-all"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: isLoadingDetails ? 'rgba(213,210,203,0.5)' : '#f7f4ed',
                border: '1px solid #d5d2cb',
                borderRadius: '12px',
                cursor: isLoadingDetails ? 'not-allowed' : 'pointer',
                color: '#171717',
                opacity: isLoadingDetails ? 0.6 : 1,
              }}
              title="Refresh conversation"
            >
              <RefreshCw 
                size={18} 
                className={isLoadingDetails ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          )}
        </div>

        <TabsContent value="conversation" className="flex-1 overflow-hidden m-0 flex flex-col">
          <ScrollArea className="h-full">
            <div className="flex flex-col px-6 pb-24 pt-8">
              {/* Conversation Header */}
              <div className="mb-6">
                <h2 className="font-['Rhymes_Display',_sans-serif] text-[34px] leading-[38px] tracking-[-0.9px] text-neutral-900 mb-3">
                  {conversation.title}
                </h2>
                
                {/* Metadata */}
                <div className="flex flex-col gap-1">
                  <p 
                    className="font-['GT_Flexa_Mono',_monospace] text-[13px] leading-[18px]"
                    style={{ color: 'rgba(23,23,23,0.7)' }}
                  >
                    Conversation ID: {conversation.id}
                  </p>
                  {conversation.userId && (
                    <p 
                      className="font-['GT_Flexa_Mono',_monospace] text-[13px] leading-[18px]"
                      style={{ color: 'rgba(23,23,23,0.7)' }}
                    >
                      User ID: {conversation.userId}
                    </p>
                  )}
                  <p 
                    className="font-['Inter',_sans-serif] text-[15px] leading-[20px]"
                    style={{ color: 'rgba(23,23,23,0.7)' }}
                  >
                    {conversation.date.toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })}.{conversation.date.getMilliseconds().toString().padStart(3, '0')} · {conversation.messageCount ?? conversation.messages.length} messages
                    {conversation.score && ` · Score: ${conversation.score}/5`}
                  </p>
                </div>

                {/* Tags */}
                {conversation.tags && conversation.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {conversation.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="font-['Inter',_sans-serif] text-[15px] leading-[20px] px-3 py-1 rounded-lg"
                        style={{ 
                          backgroundColor: 'rgba(213,210,203,0.5)',
                          color: 'rgba(23,23,23,0.7)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-full h-px mb-6" style={{ backgroundColor: '#d5d2cb' }} />

              {/* Messages */}
              <div className="flex flex-col">
                {conversation.messages.length === 0 ? (
                  <p 
                    className="font-['Inter',_sans-serif] text-[16px] leading-[22px] text-center py-8"
                    style={{ color: 'rgba(23,23,23,0.4)' }}
                  >
                    No messages in this conversation
                  </p>
                ) : (
                  conversation.messages.map((message) => {
                    // Extract place list data and quick responses if present
                    let placeListData: PlaceListData | undefined;
                    let quickResponsesData: QuickResponse[] | undefined;
                    
                    if (message.role === 'assistant') {
                      if ((message as any).placeList) {
                        placeListData = (message as any).placeList;
                      }
                      if ((message as any).quickResponses) {
                        quickResponsesData = (message as any).quickResponses;
                      }
                    }

                    return (
                      <div key={message.id}>
                        {message.role === 'user' ? (
                          <UserBubble content={message.content} />
                        ) : (
                          <AssistantMessage 
                            content={message.content} 
                            placeList={placeListData}
                            quickResponses={quickResponsesData}
                            userMap={userMap}
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="trace" className="flex-1 overflow-hidden m-0 flex flex-col">
          {conversation.evaluation ? (
            <TraceView 
              evaluation={conversation.evaluation} 
              conversationId={conversation.id}
              userId={conversation.userId}
            />
          ) : (
            <div 
              className="flex items-center justify-center h-full"
              style={{ backgroundColor: '#e9e6df' }}
            >
              <p 
                className="font-['Inter',_sans-serif] text-[16px] leading-[22px]"
                style={{ color: 'rgba(23,23,23,0.4)' }}
              >
                No trace data available for this conversation
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="evaluation" className="flex-1 overflow-hidden m-0 flex flex-col">
          {conversation.evaluation ? (
            <EvaluationView 
              evaluation={conversation.evaluation}
              onRunEval={onRunEval ? () => onRunEval(conversation.id) : undefined}
              isRunningEval={isRunningEval}
              conversationId={conversation.id}
            />
          ) : (
            <ScrollArea className="h-full">
              <div className="px-6 py-8">
                {/* Run Eval Button */}
                {onRunEval && (
                  <div className="mb-6">
                    <button
                      onClick={() => onRunEval(conversation.id)}
                      disabled={isRunningEval}
                      className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic text-[15px] transition-all"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        backgroundColor: isRunningEval ? 'rgba(213,210,203,0.5)' : '#171717',
                        border: '1px solid #171717',
                        borderRadius: '12px',
                        cursor: isRunningEval ? 'not-allowed' : 'pointer',
                        color: isRunningEval ? 'rgba(23,23,23,0.5)' : '#f7f4ed',
                        opacity: isRunningEval ? 0.6 : 1,
                      }}
                      title="Run evaluation on this conversation"
                    >
                      <Play 
                        size={18} 
                        className={isRunningEval ? 'animate-pulse' : ''}
                      />
                      {isRunningEval ? 'Running Evaluation...' : 'Run Evaluation'}
                    </button>
                  </div>
                )}
                
                <div 
                  className="flex flex-col items-center justify-center p-12 rounded-xl"
                  style={{ backgroundColor: '#f7f4ed', border: '1px solid #d5d2cb' }}
                >
                  <AlertCircle size={48} className="mb-4" style={{ color: 'rgba(23,23,23,0.3)' }} />
                  <p 
                    className="font-['Inter',_sans-serif] text-[16px] leading-[22px] text-center"
                    style={{ color: 'rgba(23,23,23,0.6)' }}
                  >
                    No evaluation data available for this conversation
                  </p>
                  {onRunEval && (
                    <p 
                      className="font-['Inter',_sans-serif] text-[14px] leading-[20px] text-center mt-2"
                      style={{ color: 'rgba(23,23,23,0.4)' }}
                    >
                      Click "Run Evaluation" to generate evaluation data
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
