import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { API_CONFIG } from '../config/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert } from './ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ChatTesterProps {
  onConversationsLoaded?: (conversations: any[]) => void;
}

/**
 * Component for testing the chat API connection and fetching conversations
 */
export function ChatTester({ onConversationsLoaded }: ChatTesterProps) {
  const [conversationId, setConversationId] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');

  const chat = useChat({
    userId: API_CONFIG.DEFAULT_USER_ID,
    cicHash: API_CONFIG.DEFAULT_CIC_HASH,
    usernameHash: API_CONFIG.DEFAULT_USERNAME_HASH,
    refreshConversation: true,
    grpcPort: API_CONFIG.GRPC_PORT,
    userLocation: API_CONFIG.USER_LOCATION,
  });

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    const isConnected = await chat.testConnection();
    setConnectionStatus(isConnected ? 'connected' : 'error');
  };

  const handleFetchConversation = async () => {
    try {
      const result = await chat.fetchConversation(conversationId || undefined);
      setResponse(result);
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    }
  };

  const handleFetchConversations = async () => {
    try {
      const conversations = await chat.fetchConversations();
      if (onConversationsLoaded) {
        onConversationsLoaded(conversations);
      }
      setResponse({ conversations });
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  const handleFetchRecentConversations = async () => {
    try {
      const recentConvs = await chat.fetchRecentConversations(10, 0);
      setResponse({ recent_conversations: recentConvs });
    } catch (err) {
      console.error('Failed to fetch recent conversations:', err);
    }
  };

  return (
    <div 
      className="p-6 space-y-6"
      style={{
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)',
      }}
    >
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Chat API Tester</h3>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
          Test the connection to your local NestJS chat API at {API_CONFIG.BASE_URL}
        </p>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-3">
        <Button 
          onClick={handleTestConnection} 
          disabled={chat.isLoading}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          {connectionStatus === 'testing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Test Connection
        </Button>
        
        {connectionStatus === 'connected' && (
          <div className="flex items-center gap-2" style={{ color: 'var(--success)' }}>
            <CheckCircle size={20} />
            <span>Connected</span>
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="flex items-center gap-2" style={{ color: 'var(--destructive)' }}>
            <XCircle size={20} />
            <span>Connection Failed</span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {chat.error && (
        <Alert variant="destructive">
          <p style={{ margin: 0 }}>{chat.error}</p>
        </Alert>
      )}

      {/* Fetch Conversation Form */}
      <div className="space-y-3">
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Conversation ID (optional)
          </label>
          <Input
            type="text"
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            placeholder="Leave empty to fetch new conversation"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleFetchConversation();
              }
            }}
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button 
            onClick={handleFetchConversation} 
            disabled={chat.isLoading}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            {chat.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Fetch Conversation
          </Button>

          <Button 
            onClick={handleFetchRecentConversations} 
            disabled={chat.isLoading}
            variant="outline"
          >
            Fetch Recent (10)
          </Button>

          <Button 
            onClick={handleFetchConversations} 
            disabled={chat.isLoading}
            variant="outline"
          >
            Fetch All Conversations
          </Button>
        </div>
      </div>

      {/* Response Display */}
      {response && (
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            API Response
          </label>
          <pre 
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1rem',
              overflow: 'auto',
              maxHeight: '300px',
            }}
          >
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {/* Configuration Info */}
      <div 
        className="p-4"
        style={{
          backgroundColor: 'var(--background)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
        }}
      >
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Current Configuration
        </label>
        <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>
          Base URL: {API_CONFIG.BASE_URL}
          <br />
          User ID: {API_CONFIG.DEFAULT_USER_ID}
          <br />
          CIC Hash: {API_CONFIG.DEFAULT_CIC_HASH}
        </p>
      </div>
    </div>
  );
}
