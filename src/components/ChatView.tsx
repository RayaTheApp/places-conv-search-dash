import { useState, useRef, useEffect } from 'react';
import { Loader2, MapPin, Plus } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { useChat } from '../hooks/useChat';
import { useChatPolling } from '../hooks/useChatPolling';
import { API_CONFIG } from '../config/api';
import { PlaceCard } from './PlaceCard';
import { QuickResponses } from './QuickResponses';
import { ChatConfigPanel } from './ChatConfigPanel';
import { TraceView } from './TraceView';
import { EvaluationView } from './EvaluationView';
import { Conversation } from '../types/conversation';
import svgPaths from '../imports/svg-amklyrdiy9';
import { loadChatState, saveChatState } from '../utils/chatStorage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStatusMessage?: boolean; // For loading/status messages
  placeList?: {
    heading: string;
    body: string;
    places: any[];
  };
  quickResponses?: any[];
}

interface ChatViewProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onConversationCreated?: (conversationId: string) => void;
}

function IconArrowUp() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g>
          <path d={svgPaths.p3bf2d700} fill="#F7F4ED" />
        </g>
      </svg>
    </div>
  );
}

export function ChatView({ 
  conversations,
  selectedConversationId,
  onSelectConversation,
  onConversationCreated 
}: ChatViewProps) {
  // Load saved state from localStorage (only on mount, not on every render)
  const [savedState] = useState(() => loadChatState());
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    savedState?.currentConversationId ?? null
  );
  const [activeTab, setActiveTab] = useState<'conversation' | 'trace' | 'evaluation'>(
    savedState?.activeTab ?? 'conversation'
  );

  // Configuration state - load from saved state if available
  const [grpcPort, setGrpcPort] = useState(savedState?.config?.grpcPort ?? API_CONFIG.GRPC_PORT);
  const [userId, setUserId] = useState(savedState?.config?.userId ?? API_CONFIG.DEFAULT_USER_ID);
  const [userLocation, setUserLocation] = useState(savedState?.config?.userLocation ?? API_CONFIG.USER_LOCATION);
  const [cicHash, setCicHash] = useState(savedState?.config?.cicHash ?? API_CONFIG.DEFAULT_CIC_HASH);
  const [usernameHash, setUsernameHash] = useState(savedState?.config?.usernameHash ?? API_CONFIG.DEFAULT_USERNAME_HASH);
  const [selectedUser, setSelectedUser] = useState(savedState?.config?.selectedUser ?? 'stephen');
  const [selectedLocation, setSelectedLocation] = useState(savedState?.config?.selectedLocation ?? 'nyc');
  const [debugOutput, setDebugOutput] = useState('Ready');
  
  // Loaded conversation data (includes evaluation)
  const [loadedConversation, setLoadedConversation] = useState<Conversation | null>(null);
  
  // Polling state
  const [isPollingEnabled, setIsPollingEnabled] = useState(false);
  const [pollingConversationId, setPollingConversationId] = useState<string | null>(null);

  const chat = useChat({
    userId,
    cicHash,
    usernameHash,
    refreshConversation: true,
    grpcPort,
    userLocation,
  });

  // Set up polling for live updates after sending a message
  const { isPolling, isComplete } = useChatPolling({
    conversationId: pollingConversationId,
    userId,
    cicHash,
    enabled: isPollingEnabled,
    onUpdate: (data) => {
      console.log('Polling update received:', data);
      // Update messages from polled data
      if (data.messages && Array.isArray(data.messages)) {
        const assistantMessages = data.messages.filter((msg: any) => msg.role === 'ASSISTANT');
        if (assistantMessages.length > 0) {
          const lastAssistantMsg = assistantMessages[assistantMessages.length - 1];
          const extracted = extractContentFromUIComponents(lastAssistantMsg.ui_components || []);
          
          if (extracted.content) {
            setMessages(prev => {
              const assistantMessage: Message = {
                id: lastAssistantMsg.message_id || `assistant-${Date.now()}`,
                role: 'assistant',
                content: extracted.content,
                timestamp: new Date(),
                isStatusMessage: extracted.isStatusMessage,
                placeList: extracted.placeList,
                quickResponses: extracted.quickResponses,
              };

              // If this is a status message, remove any previous status messages
              if (extracted.isStatusMessage) {
                const withoutStatusMessages = prev.filter(m => !m.isStatusMessage || m.id === assistantMessage.id);
                const existingIndex = withoutStatusMessages.findIndex(m => m.id === assistantMessage.id);
                
                if (existingIndex >= 0) {
                  const newMessages = [...withoutStatusMessages];
                  newMessages[existingIndex] = assistantMessage;
                  return newMessages;
                } else {
                  return [...withoutStatusMessages, assistantMessage];
                }
              } else {
                // This is a real message (not just status), remove all status messages and add/update this one
                const withoutStatusMessages = prev.filter(m => !m.isStatusMessage);
                const existingIndex = withoutStatusMessages.findIndex(m => m.id === assistantMessage.id);
                
                if (existingIndex >= 0) {
                  const newMessages = [...withoutStatusMessages];
                  newMessages[existingIndex] = assistantMessage;
                  return newMessages;
                } else {
                  return [...withoutStatusMessages, assistantMessage];
                }
              }
            });
          }
        }
      }
      
      // Update loaded conversation for trace/evaluation tabs
      if (data.metadata || data.trace || data.evalResult) {
        setLoadedConversation(prev => {
          if (!prev) return null;
          return {
            ...prev,
            trace: data.trace || prev.trace,
            evaluation: data.evalResult ? {
              pass: data.evalResult.pass,
              latencyMs: data.evalResult.latencyMs,
              validationResults: data.evalResult.validationResults || [],
              judgeResults: data.evalResult.judgeResults || [],
              toolTrace: data.evalResult.toolTrace || prev.evaluation?.toolTrace || [],
              fullMessages: prev.evaluation?.fullMessages || [],
              meta: data.evalResult.meta || prev.evaluation?.meta,
            } : prev.evaluation,
          };
        });
      }
    },
    onComplete: async (data) => {
      console.log('Conversation completed:', data);
      setIsPollingEnabled(false);
      setIsLoading(false);
      setDebugOutput(`Conversation completed: ${data.conversation_id}`);
      
      // Fetch full conversation data (trace and evaluation) when polling completes
      if (data.conversation_id) {
        try {
          const fullConversation = await chat.fetchFullConversation(
            data.conversation_id,
            userId,
            cicHash,
            usernameHash,
            grpcPort,
            userLocation
          );
          setLoadedConversation(fullConversation);
          console.log('Full conversation data loaded:', fullConversation);
        } catch (error) {
          console.error('Error loading full conversation after polling:', error);
        }
      }
    },
    pollInterval: 1000,
    maxAttempts: 60,
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveChatState({
      currentConversationId,
      activeTab,
      config: {
        grpcPort,
        userId,
        userLocation,
        cicHash,
        usernameHash,
        selectedUser,
        selectedLocation,
      },
    });
  }, [currentConversationId, activeTab, grpcPort, userId, userLocation, cicHash, usernameHash, selectedUser, selectedLocation]);

  // Update debug output when polling status changes
  useEffect(() => {
    if (isPolling) {
      setDebugOutput(`Polling for updates... (conversation: ${pollingConversationId})`);
    } else if (isComplete) {
      setDebugOutput(`Conversation complete (${pollingConversationId})`);
    }
  }, [isPolling, isComplete, pollingConversationId]);

  const extractContentFromUIComponents = (uiComponents: any[]): { 
    content: string; 
    placeList?: any;
    quickResponses?: any[];
    isStatusMessage?: boolean;
  } => {
    if (!uiComponents || !Array.isArray(uiComponents)) {
      return { content: '' };
    }

    const contents: string[] = [];
    let placeList: any = null;
    let quickResponses: any[] = [];
    let hasLoadingComponent = false;
    let latestStatusText = '';
    
    for (const component of uiComponents) {
      // Extract from body component
      if (component.body?.component?.mutableContent) {
        contents.push(component.body.component.mutableContent);
      }
      
      // Extract from loading component (status messages)
      if (component.loading?.component?.mutableStatusTextsList) {
        const statusTexts = component.loading.component.mutableStatusTextsList;
        if (Array.isArray(statusTexts) && statusTexts.length > 0) {
          hasLoadingComponent = true;
          // Only keep the most recent status text (last one in the array)
          latestStatusText = statusTexts[statusTexts.length - 1].replace(/^Loading:\s*/i, '').trim();
        }
      }
      
      // Extract place list
      if (component.placeList?.component) {
        const placeComponent = component.placeList.component;
        placeList = {
          heading: placeComponent.mutableHeading1,
          body: placeComponent.mutableBody,
          places: placeComponent.mutablePlacesList || []
        };
      }
      
      // Extract quick responses
      if (component.quickResponses?.component?.quickResponsesList) {
        quickResponses = component.quickResponses.component.quickResponsesList;
      }
    }
    
    // Add the latest status text if we have one and no other content
    if (hasLoadingComponent && latestStatusText && contents.length === 0) {
      contents.push(latestStatusText);
    }
    
    return { 
      content: contents.join('\n\n').trim(),
      placeList,
      quickResponses: quickResponses.length > 0 ? quickResponses : undefined,
      isStatusMessage: hasLoadingComponent && !placeList && contents.length <= 1 // It's a status message if it only has loading, no actual content
    };
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setDebugOutput(`Sending message: "${messageText.substring(0, 50)}..."`);

    try {
      const requestBody = {
        user_id: userId,
        message: messageText,
        cic_hash: JSON.stringify(cicHash),
        username_hash: usernameHash,
        refresh_conversation: true,
        grpc_port: grpcPort,
        user_location: userLocation,
        ...(currentConversationId && { conversation_id: currentConversationId }),
      };

      // Call the /chat endpoint with the actual message
      const response = await fetch(`${API_CONFIG.BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Chat response:', data);
      setDebugOutput(`Received response for conversation: ${data.conversation_id || 'N/A'}`);

      // Store conversation ID for subsequent messages
      const conversationId = data.conversation_id || currentConversationId;
      if (conversationId && !currentConversationId) {
        setCurrentConversationId(conversationId);
        onConversationCreated?.(conversationId);
      }

      // Start polling for live updates
      if (conversationId) {
        console.log('Starting polling for conversation:', conversationId);
        setPollingConversationId(conversationId);
        setIsPollingEnabled(true);
      }

      // Extract initial assistant message from response (if available)
      if (data.messages && Array.isArray(data.messages)) {
        // Get the last assistant message
        const assistantMessages = data.messages.filter((msg: any) => msg.role === 'ASSISTANT');
        if (assistantMessages.length > 0) {
          const lastAssistantMsg = assistantMessages[assistantMessages.length - 1];
          
          // Extract content from ui_components
          const extracted = extractContentFromUIComponents(lastAssistantMsg.ui_components || []);
          
          if (extracted.content) {
            const assistantMessage: Message = {
              id: lastAssistantMsg.message_id || `assistant-${Date.now()}`,
              role: 'assistant',
              content: extracted.content,
              timestamp: new Date(),
              isStatusMessage: extracted.isStatusMessage,
              placeList: extracted.placeList,
              quickResponses: extracted.quickResponses,
            };

            setMessages(prev => [...prev, assistantMessage]);
          }
        }
      }

      // Note: isLoading will be set to false when polling completes
    } catch (error) {
      console.error('Error sending message:', error);
      setDebugOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      setIsPollingEnabled(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickResponse = (response: string) => {
    sendMessage(response);
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setInputValue('');
    setLoadedConversation(null);
    setDebugOutput('Ready for new conversation');
    setActiveTab('conversation'); // Switch to conversation tab
    // Stop any active polling
    setIsPollingEnabled(false);
    setPollingConversationId(null);
  };

  const loadConversationById = async (conversationId: string) => {
    // Stop any active polling when loading a different conversation
    setIsPollingEnabled(false);
    setPollingConversationId(null);
    
    setIsLoadingConversation(true);
    setDebugOutput(`Loading conversation: ${conversationId}`);
    try {
      const fullConversation = await chat.fetchFullConversation(
        conversationId,
        userId,
        cicHash
      );
      
      // Store the full conversation data
      setLoadedConversation(fullConversation);
      
      // Convert conversation messages to chat messages
      const chatMessages: Message[] = fullConversation.messages.map((msg, index) => ({
        id: msg.id || `msg-${index}`,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp || new Date(),
        placeList: (msg as any).placeList,
        quickResponses: (msg as any).quickResponses,
      }));
      
      setMessages(chatMessages);
      setCurrentConversationId(conversationId);
      setDebugOutput(`Loaded ${chatMessages.length} messages from conversation ${conversationId}`);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setDebugOutput(`Error loading: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingConversation(false);
    }
  };

  const handleLoadConversation = () => {
    if (!currentConversationId) return;
    loadConversationById(currentConversationId);
  };

  // Load conversation from savedState on mount (only once)
  useEffect(() => {
    if (savedState?.currentConversationId && !loadedConversation && messages.length === 0) {
      loadConversationById(savedState.currentConversationId);
    }
  }, []); // Only run once on mount

  return (
    <div className="flex-1 min-w-0 flex overflow-hidden">
      {/* Conversation List - Left Sidebar */}
      <div 
        className="w-80 flex-shrink-0 flex flex-col h-full"
        style={{ 
          backgroundColor: '#f7f4ed',
          borderRight: '1px solid #d5d2cb',
        }}
      >
        <div 
          className="py-6 pl-6 pr-4" 
          style={{ borderBottom: '1px solid #d5d2cb' }}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="font-['Rhymes_Display:Medium',_sans-serif] leading-[38px] not-italic text-[28px] text-neutral-900 tracking-[-0.7px]" style={{ margin: 0 }}>
              Conversations
            </h2>
            <button
              onClick={startNewConversation}
              className="flex items-center gap-1.5 flex-shrink-0"
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: '#171717',
                border: '1px solid #171717',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#f7f4ed',
                fontSize: '13px',
                fontFamily: "'General Sans', sans-serif",
                fontWeight: '500',
              }}
              title="Start a new conversation"
            >
              <Plus size={14} />
              New
            </button>
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
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    // Only load in chat view, don't update trace view selection
                    loadConversationById(conv.id);
                  }}
                  className="w-full text-left p-4 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: currentConversationId === conv.id ? '#e9e6df' : 'transparent',
                    borderBottom: '1px solid #d5d2cb',
                  }}
                >
                  <div className="flex flex-col gap-1">
                    {conv.title && (
                      <p 
                        className="font-['General_Sans',_sans-serif] text-[13px] leading-[18px]"
                        style={{ color: '#171717', fontWeight: '500', marginBottom: '2px' }}
                      >
                        {conv.title}
                      </p>
                    )}
                    
                    <p 
                      className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px]"
                      style={{ color: 'rgba(23,23,23,0.5)' }}
                    >
                      Conversation: {conv.id}
                    </p>
                    
                    {conv.userId && (
                      <p 
                        className="font-['GT_Flexa_Mono',_monospace] text-[11px] leading-[14px]"
                        style={{ color: 'rgba(23,23,23,0.5)' }}
                      >
                        User: {conv.userId}
                      </p>
                    )}
                    
                    <p 
                      className="font-['Inter',_sans-serif] text-[13px] leading-[18px]"
                      style={{ color: 'rgba(23,23,23,0.5)' }}
                    >
                      {conv.date.toLocaleString('en-US', {
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
                      className="font-['Inter',_sans-serif] text-[13px] leading-[18px]"
                      style={{ color: '#171717', fontWeight: '500' }}
                    >
                      {conv.messageCount ?? conv.messages.length} messages
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Messages - Center with Tabs */}
      <div 
        className="flex-1 min-w-0 flex flex-col overflow-hidden" 
        style={{ 
          backgroundColor: '#e9e6df',
        }}
      >
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'conversation' | 'trace' | 'evaluation')} className="flex-1 flex flex-col overflow-hidden">
          <div 
            className="px-6 py-4 flex-shrink-0"
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
                {loadedConversation?.evaluation && (
                  <span className={`ml-2 w-2 h-2 rounded-full ${loadedConversation.evaluation.pass ? 'bg-green-500' : 'bg-red-500'}`} />
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="conversation" className="flex-1 overflow-hidden m-0 flex flex-col">
            {/* Messages Area */}
            {isLoadingConversation ? (
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="px-6 py-6 space-y-4">
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
                </ScrollArea>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="flex flex-col px-6 pb-24 pt-8">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div 
                          className="p-8 rounded-xl text-center"
                          style={{ 
                            backgroundColor: '#e9e6df',
                            border: '1px solid #d5d2cb',
                            maxWidth: '500px',
                          }}
                        >
                          <MapPin size={48} className="mx-auto mb-4" style={{ color: 'rgba(23,23,23,0.4)' }} />
                          <h3 className="font-['Rhymes_Display',_sans-serif] text-[20px] leading-[24px] tracking-[-0.5px] text-neutral-900 mb-2">
                            Start a new conversation
                          </h3>
                          <p className="font-['Inter',_sans-serif] text-[14px] leading-[20px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                            Type a message below to begin chatting. Try asking about places, restaurants, or local recommendations.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {messages.map((message) => (
                          <div key={message.id} className="mb-4">
                            {message.role === 'user' ? (
                              <div className="flex flex-col items-end w-full">
                                <div 
                                  className="max-w-[70%] px-4 py-2.5 rounded-2xl relative"
                                  style={{ backgroundColor: 'rgba(213,210,203,0.75)' }}
                                >
                                  <div 
                                    aria-hidden="true" 
                                    className="absolute border border-[#d5d2cb] border-solid inset-0 pointer-events-none rounded-2xl" 
                                  />
                                  <p className="font-['Inter',_sans-serif] text-[16px] leading-[22px] text-neutral-900 relative whitespace-pre-wrap">
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-start w-full">
                                {message.isStatusMessage ? (
                                  <div className="max-w-[85%] flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin flex-shrink-0" style={{ color: 'rgba(23,23,23,0.5)' }} />
                                    <p className="font-['Inter',_sans-serif] text-[16px] leading-[22px] whitespace-pre-wrap" style={{ color: 'rgba(23,23,23,0.7)' }}>
                                      {message.content}
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    <div className="max-w-[85%]">
                                      <p className="font-['Inter',_sans-serif] text-[16px] leading-[22px] text-neutral-900 whitespace-pre-wrap mb-3">
                                        {message.content}
                                      </p>
                                    </div>
                                    {message.placeList && (
                                      <div className="max-w-[85%] mt-4">
                                        {message.placeList.heading && (
                                          <h3 className="font-['Rhymes_Display',_sans-serif] text-[18px] leading-[24px] tracking-[-0.5px] text-neutral-900 mb-2">
                                            {message.placeList.heading}
                                          </h3>
                                        )}
                                        {message.placeList.body && (
                                          <p className="font-['Inter',_sans-serif] text-[14px] leading-[20px] text-neutral-900 mb-3">
                                            {message.placeList.body}
                                          </p>
                                        )}
                                        <div className="flex flex-col gap-4">
                                          {message.placeList.places.map((place, index) => (
                                            <PlaceCard 
                                              key={place.placeId || index} 
                                              place={place}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {message.quickResponses && (
                                      <div className="max-w-[85%] mt-2">
                                        <QuickResponses 
                                          responses={message.quickResponses}
                                          onResponseClick={handleQuickResponse}
                                        />
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Input Area - Always visible */}
            <div 
              className="p-4 flex-shrink-0"
              style={{ 
                backgroundColor: '#e9e6df',
                borderTop: '1px solid #d5d2cb',
              }}
            >
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl outline-none transition-all"
                  style={{
                    backgroundColor: '#f7f4ed',
                    border: '1px solid #d5d2cb',
                    color: '#171717',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex items-center justify-center rounded-xl transition-all flex-shrink-0"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: isLoading || !inputValue.trim() ? 'rgba(23,23,23,0.3)' : '#171717',
                    border: '1px solid transparent',
                    cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" style={{ color: '#f7f4ed' }} />
                  ) : (
                    <IconArrowUp />
                  )}
                </button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="trace" className="flex-1 overflow-hidden m-0">
            {loadedConversation ? (
              <TraceView conversation={loadedConversation} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="font-['Inter',_sans-serif] text-[16px] leading-[22px]" style={{ color: 'rgba(23,23,23,0.4)' }}>
                  No trace data available
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="evaluation" className="flex-1 overflow-hidden m-0">
            {loadedConversation?.evaluation ? (
              <EvaluationView evaluation={loadedConversation.evaluation} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="font-['Inter',_sans-serif] text-[16px] leading-[22px]" style={{ color: 'rgba(23,23,23,0.4)' }}>
                  No evaluation data available
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Configuration Panel - Right Sidebar */}
      <ChatConfigPanel
        grpcPort={grpcPort}
        setGrpcPort={setGrpcPort}
        userId={userId}
        setUserId={setUserId}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        cicHash={cicHash}
        setCicHash={setCicHash}
        usernameHash={usernameHash}
        setUsernameHash={setUsernameHash}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        debugOutput={debugOutput}
        currentConversationId={currentConversationId}
        onLoadConversation={handleLoadConversation}
        isPolling={isPolling}
      />
    </div>
  );
}
