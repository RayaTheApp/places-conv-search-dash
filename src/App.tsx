import { useState, useEffect } from 'react';
import { ConversationList } from './components/ConversationList';
import { ConversationView } from './components/ConversationView';
import { NotesPanel } from './components/NotesPanel';
import { ChatView } from './components/ChatView';
import { LogTableView } from './components/LogTableView';
import { ConversationSearch } from './components/ConversationSearch';
import { Conversation, Message } from './types/conversation';
import { MessageSquare, RefreshCw, X } from 'lucide-react';
import { useChat } from './hooks/useChat';
import { API_CONFIG } from './config/api';
import { createConversationFromChat } from './utils/conversationUtils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';

const TRACE_VIEW_STORAGE_KEY = 'conversation-evaluator-trace-view-state';

export default function App() {
  // Load saved trace view state from localStorage
  const loadTraceViewState = () => {
    try {
      const saved = localStorage.getItem(TRACE_VIEW_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Failed to load trace view state:', error);
      return {};
    }
  };

  const savedTraceState = loadTraceViewState();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    savedTraceState.selectedConversationId || null
  );
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isRunningEval, setIsRunningEval] = useState(false);
  const [activeView, setActiveView] = useState<'individual' | 'chat'>(
    savedTraceState.activeView || 'individual'
  );
  const [expandedConversationId, setExpandedConversationId] = useState<string | null>(null);
  const [searchForUserId, setSearchForUserId] = useState<string>('');
  const [searchConversationId, setSearchConversationId] = useState<string>('');

  const chat = useChat({
    userId: API_CONFIG.DEFAULT_USER_ID,
    cicHash: API_CONFIG.DEFAULT_CIC_HASH,
    usernameHash: API_CONFIG.DEFAULT_USERNAME_HASH,
    refreshConversation: true,
    grpcPort: API_CONFIG.GRPC_PORT,
    userLocation: API_CONFIG.USER_LOCATION,
  });

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

  // Debug: Log selected conversation
  if (selectedConversation) {
    console.log('=== SELECTED CONVERSATION ===');
    console.log('ID:', selectedConversation.id);
    console.log('Title:', selectedConversation.title);
    console.log('Messages Count:', selectedConversation.messages.length);
    console.log('Messages:', selectedConversation.messages);
  }

  // Load recent conversations on mount and restore selected conversation if needed
  useEffect(() => {
    const initializeApp = async () => {
      await loadRecentConversations();
      
      // If there was a saved selected conversation, load its details
      if (savedTraceState.selectedConversationId) {
        handleSelectConversation(savedTraceState.selectedConversationId);
      }
    };
    
    initializeApp();
  }, []);

  // Save trace view state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(TRACE_VIEW_STORAGE_KEY, JSON.stringify({
        selectedConversationId,
        activeView,
      }));
    } catch (error) {
      console.error('Failed to save trace view state:', error);
    }
  }, [selectedConversationId, activeView]);

  const loadRecentConversations = async (forUserId?: string, conversationId?: string) => {
    setIsLoadingConversations(true);
    setSelectedConversationId(null); // Clear selection when refreshing
    setExpandedConversationId(null); // Close any expanded view
    try {
      const recentConvs = await chat.fetchRecentConversations(
        50, 
        0,
        forUserId || undefined,
        conversationId || undefined
      );
      
      // Transform to Conversation format
      const transformedConvs: Conversation[] = recentConvs.map(conv => ({
        id: conv.conversation_id,
        title: conv.conversation_title || 'Untitled Conversation',
        date: conv.created_at ? new Date(conv.created_at) : new Date(),
        messages: [], // Will be loaded when selected
        note: '',
        tags: [],
        userId: conv.user_id,
        createdAt: conv.created_at ? new Date(conv.created_at) : undefined,
        messageCount: conv.message_count,
      }));

      setConversations(transformedConvs);
    } catch (error) {
      console.error('Failed to load recent conversations:', error);
      setConversations([]);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    setSelectedConversationId(conversationId);
    
    // Check if this conversation already has messages loaded
    const existingConv = conversations.find(c => c.id === conversationId);
    if (existingConv && existingConv.messages.length > 0) {
      return; // Already loaded
    }

    // Fetch the full conversation with trace and evaluation data
    setIsLoadingDetails(true);
    try {
      const fullConversation = await chat.fetchFullConversation(
        conversationId,
        API_CONFIG.DEFAULT_USER_ID,
        API_CONFIG.DEFAULT_CIC_HASH,
        API_CONFIG.DEFAULT_USERNAME_HASH,
        API_CONFIG.GRPC_PORT,
        API_CONFIG.USER_LOCATION
      );
      
      console.log('=== DEBUG: Fetched Full Conversation ===');
      console.log('Conversation ID:', conversationId);
      console.log('Full Conversation:', fullConversation);
      console.log('Messages count:', fullConversation.messages.length);
      console.log('Has evaluation:', !!fullConversation.evaluation);

      // Update the conversation with full data, preserving the title from the list
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId
            ? { 
                ...conv, 
                ...fullConversation,
                // Preserve title from list if the fetched one is generic
                title: fullConversation.title !== 'Untitled Conversation' 
                  ? fullConversation.title 
                  : conv.title
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to fetch conversation details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSaveNote = (conversationId: string, note: string) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversationId ? { ...conv, note } : conv
      )
    );
  };

  const handleRefreshConversation = async (conversationId: string) => {
    setIsLoadingDetails(true);
    try {
      const fullConversation = await chat.fetchFullConversation(
        conversationId,
        API_CONFIG.DEFAULT_USER_ID,
        API_CONFIG.DEFAULT_CIC_HASH
      );
      
      // Update the conversation with fresh data
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId
            ? { 
                ...conv, 
                ...fullConversation,
                title: fullConversation.title !== 'Untitled Conversation' 
                  ? fullConversation.title 
                  : conv.title
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to refresh conversation:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleRunEval = async (conversationId: string) => {
    setIsRunningEval(true);
    try {
      const result = await chat.runEvaluation(conversationId);
      
      console.log('=== DEBUG: Eval Result ===');
      console.log('Conversation ID:', result.conversationId);
      console.log('Eval Result:', result.evalResult);
      console.log('Cached:', result.cached);
      
      // Update the conversation with the new evaluation data
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                evaluation: {
                  pass: result.evalResult.pass,
                  latencyMs: result.evalResult.latencyMs,
                  validationResults: result.evalResult.validationResults || [],
                  judgeResults: result.evalResult.judgeResults || [],
                  toolTrace: result.evalResult.toolTrace || conv.evaluation?.toolTrace || [],
                  fullMessages: conv.evaluation?.fullMessages || [],
                  meta: result.evalResult.meta || conv.evaluation?.meta || {
                    tokensIn: 0,
                    tokensOut: 0,
                    latencyMs: result.evalResult.latencyMs,
                    model: result.evalResult.meta?.model || 'unknown',
                  },
                },
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to run evaluation:', error);
    } finally {
      setIsRunningEval(false);
    }
  };

  const handleConversationCreated = (conversationId: string) => {
    console.log('New conversation created:', conversationId);
    // Optionally refresh the conversation list
    // loadRecentConversations();
  };

  const handleSearch = (forUserId: string, conversationId: string) => {
    setSearchForUserId(forUserId);
    setSearchConversationId(conversationId);
    loadRecentConversations(forUserId, conversationId);
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#e9e6df' }}>
      {/* Header */}
      <header 
        className="flex items-center gap-3 px-6 py-5"
        style={{ 
          backgroundColor: '#f7f4ed',
          borderBottom: '1px solid #d5d2cb',
        }}
      >
        <div 
          className="flex items-center justify-center"
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '12px',
            backgroundColor: '#171717',
            color: '#f7f4ed',
          }}
        >
          <MessageSquare size={24} />
        </div>
        <h1 
          className="font-['Rhymes_Display:Medium',_sans-serif] leading-[38px] not-italic text-[28px] text-neutral-900 tracking-[-0.7px]" 
          style={{ margin: 0, flex: 1 }}
        >
          Places Conversational Search
        </h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'individual' | 'chat')} className="flex-1 flex flex-col">
          <div 
            className="px-6 py-4 flex items-center gap-4"
            style={{ 
              backgroundColor: '#f7f4ed',
              borderBottom: '1px solid #d5d2cb',
            }}
          >
            <TabsList className="grid w-[240px] grid-cols-2 h-11 flex-shrink-0">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="individual">Annotate</TabsTrigger>
            </TabsList>
            
            {/* Search Bar - Inline */}
            <div className="flex-1 min-w-0">
              <ConversationSearch 
                onSearch={handleSearch}
                isLoading={isLoadingConversations}
                compact={true}
              />
            </div>
            
            <button
              onClick={() => loadRecentConversations(searchForUserId, searchConversationId)}
              disabled={isLoadingConversations}
              className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic text-[15px] transition-all flex-shrink-0"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: isLoadingConversations ? 'rgba(213,210,203,0.5)' : '#e9e6df',
                border: '1px solid #d5d2cb',
                borderRadius: '12px',
                cursor: isLoadingConversations ? 'not-allowed' : 'pointer',
                color: '#171717',
                opacity: isLoadingConversations ? 0.6 : 1,
              }}
              title="Refresh conversations"
            >
              <RefreshCw 
                size={18} 
                className={isLoadingConversations ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>

          <TabsContent 
            value="individual" 
            className="flex-1 flex overflow-hidden m-0"
            forceMount
            style={{ display: activeView === 'individual' ? 'flex' : 'none' }}
          >
            {!expandedConversationId ? (
              // Table View - Show all conversations in a log-style table
              <div className="flex-1">
                <LogTableView 
                  conversations={conversations}
                  onSelectConversation={(id) => {
                    setExpandedConversationId(id);
                    handleSelectConversation(id);
                  }}
                  isLoading={isLoadingConversations}
                />
              </div>
            ) : (
              // Detailed View - Show the expanded conversation with sidebar
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Three Column Layout */}
                <div className="flex-1 min-w-0 flex overflow-hidden">
                  {/* Conversation List - Left Sidebar */}
                  <div className="w-80 flex-shrink-0">
                    <ConversationList
                      conversations={conversations}
                      selectedId={selectedConversationId}
                      onSelectConversation={(id) => {
                        setExpandedConversationId(id);
                        handleSelectConversation(id);
                      }}
                      isLoading={isLoadingConversations}
                      onBack={() => setExpandedConversationId(null)}
                      showBackButton={true}
                    />
                  </div>

                  {/* Conversation View - Center */}
                  <div className="flex-1 min-w-0">
                    <ConversationView 
                      conversation={selectedConversation} 
                      isLoadingDetails={isLoadingDetails}
                      onRefresh={handleRefreshConversation}
                      onRunEval={handleRunEval}
                      isRunningEval={isRunningEval}
                    />
                  </div>

                  {/* Notes Panel - Right Sidebar */}
                  <div className="w-96 flex-shrink-0">
                    <NotesPanel 
                      conversation={selectedConversation}
                      onSaveNote={handleSaveNote}
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent 
            value="chat" 
            className="flex-1 overflow-hidden m-0"
            forceMount
            style={{ display: activeView === 'chat' ? 'flex' : 'none' }}
          >
            <ChatView 
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              onConversationCreated={handleConversationCreated} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
