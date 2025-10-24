import { useState, useEffect } from 'react';
import { ConversationList } from '../components/ConversationList';
import { ConversationView } from '../components/ConversationView';
import { NotesPanel } from '../components/NotesPanel';
import { ChatTester } from '../components/ChatTester';
import { Conversation } from '../types/conversation';
import { MessageSquare, Settings } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { API_CONFIG } from '../config/api';
import { Button } from '../components/ui/button';
import { 
  createConversationFromChat, 
  addMessageToConversation,
  mergeConversations 
} from '../utils/conversationUtils';

/**
 * Example App component integrated with the Chat API
 * 
 * This demonstrates how to:
 * 1. Fetch real conversations from the API
 * 2. Send messages and update conversations in real-time
 */
export default function AppWithChatAPI() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showTester, setShowTester] = useState(false);

  const chat = useChat({
    userId: API_CONFIG.DEFAULT_USER_ID,
    cicHash: API_CONFIG.DEFAULT_CIC_HASH,
    usernameHash: API_CONFIG.DEFAULT_USERNAME_HASH,
    refreshConversation: true,
    grpcPort: API_CONFIG.GRPC_PORT,
    userLocation: API_CONFIG.USER_LOCATION,
  });

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

  // Load conversations from API on mount
  useEffect(() => {
    loadConversationsFromAPI();
  }, []);

  const loadConversationsFromAPI = async () => {
    try {
      const apiConversations = await chat.fetchConversations();
      setConversations(apiConversations);
    } catch (error) {
      console.error('Failed to load conversations from API:', error);
    }
  };

  const handleSaveNote = (conversationId: string, note: string) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversationId ? { ...conv, note } : conv
      )
    );
  };

  const handleFetchConversation = async (conversationId?: string) => {
    try {
      const response = await chat.fetchConversation(conversationId);
      
      setConversations(prevConversations => {
        const existingConv = prevConversations.find(c => c.id === conversationId);
        
        if (existingConv) {
          // Update existing conversation with fresh data
          const updatedConv = createConversationFromChat(
            response,
            '', // No user message when fetching
            API_CONFIG.DEFAULT_USER_ID
          );
          return prevConversations.map(c => c.id === conversationId ? updatedConv : c);
        } else {
          // Add new conversation
          const newConv = createConversationFromChat(
            response, 
            '', 
            API_CONFIG.DEFAULT_USER_ID
          );
          return [newConv, ...prevConversations];
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
      throw error;
    }
  };

  const handleConversationsLoaded = (loadedConversations: Conversation[]) => {
    setConversations(prevConversations => 
      mergeConversations(prevConversations, loadedConversations)
    );
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header 
        className="flex items-center gap-3 px-6 py-4"
        style={{ 
          backgroundColor: 'var(--card)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div 
          className="flex items-center justify-center"
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 'var(--radius)',
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-foreground)',
          }}
        >
          <MessageSquare size={24} />
        </div>
        <h1 style={{ margin: 0, flex: 1 }}>Conversation Evaluator</h1>
        
        <div className="flex items-center gap-3">
          <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={apiMode}
              onChange={(e) => setApiMode(e.target.checked)}
            />
            API Mode
          </label>
          
          <Button 
            variant="outline" 
            onClick={() => setShowTester(!showTester)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Settings size={18} />
            {showTester ? 'Hide Tester' : 'Show Tester'}
          </Button>
        </div>
      </header>

      {/* API Tester Panel (Collapsible) */}
      {showTester && (
        <div 
          className="p-4"
          style={{ 
            backgroundColor: 'var(--card)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <ChatTester onConversationsLoaded={handleConversationsLoaded} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List - Left Sidebar */}
        <div className="w-80 flex-shrink-0">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>

        {/* Conversation View - Center */}
        <div className="flex-1 min-w-0">
          <ConversationView conversation={selectedConversation} />
        </div>

        {/* Notes Panel - Right Sidebar */}
        <div className="w-96 flex-shrink-0">
          <NotesPanel 
            conversation={selectedConversation}
            onSaveNote={handleSaveNote}
          />
        </div>
      </div>

      {/* Status Bar */}
      <footer 
        className="px-6 py-2 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--card)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>
          {conversations.length} conversations
        </p>
        <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>
          {apiMode ? `API: ${API_CONFIG.BASE_URL}` : 'Using mock data'}
        </p>
      </footer>
    </div>
  );
}
