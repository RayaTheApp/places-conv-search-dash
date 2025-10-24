import { useState } from 'react';
import { chatService } from '../services/chatService';
import { API_CONFIG } from '../config/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

/**
 * Simple component to quickly test your chat API
 * Add this to your App.tsx to test the connection
 */
export function QuickAPITest() {
  const [conversationId, setConversationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<any>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setStatus('idle');
    setResponse(null);

    try {
      const result = await chatService.fetchConversation(
        API_CONFIG.DEFAULT_USER_ID,
        conversationId || undefined,
        API_CONFIG.DEFAULT_CIC_HASH,
        API_CONFIG.DEFAULT_USERNAME_HASH,
        true,
        API_CONFIG.GRPC_PORT,
        API_CONFIG.USER_LOCATION
      );
      
      setResponse(result);
      setStatus('success');
      console.log('API Response:', result);
    } catch (error) {
      setStatus('error');
      console.error('API Error:', error);
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestRecent = async () => {
    setIsLoading(true);
    setStatus('idle');
    setResponse(null);

    try {
      const result = await chatService.fetchRecentConversations(
        API_CONFIG.DEFAULT_USER_ID,
        undefined,
        10,
        0,
        API_CONFIG.GRPC_PORT
      );
      
      setResponse({ conversations: result });
      setStatus('success');
      console.log('Recent Conversations:', result);
    } catch (error) {
      setStatus('error');
      console.error('API Error:', error);
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="p-4 space-y-4"
      style={{
        backgroundColor: '#f7f4ed',
        border: '1px solid #d5d2cb',
        borderRadius: '20px',
      }}
    >
      <div>
        <h3 
          className="font-['Rhymes_Display:Medium',_sans-serif] leading-[28px] not-italic text-[22px] text-neutral-900 tracking-[-0.5px]" 
          style={{ margin: 0, marginBottom: '0.5rem' }}
        >
          Quick API Test
        </h3>
        <p 
          className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic text-[15px]"
          style={{ color: 'rgba(23,23,23,0.7)', margin: 0 }}
        >
          Testing: {API_CONFIG.BASE_URL}/chat
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label 
            className="font-['General_Sans:Medium',_sans-serif] leading-[16px] not-italic text-[12px]"
            style={{ display: 'block', marginBottom: '0.5rem', color: '#4c4b4b' }}
          >
            Conversation ID (optional)
          </label>
          <Input
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            placeholder="Leave empty to fetch new conversation"
            className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic text-[15px]"
            style={{
              backgroundColor: '#fff',
              border: '1px solid #d5d2cb',
              borderRadius: '12px',
              padding: '12px',
              color: '#171717',
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleTest} 
            disabled={isLoading}
            className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic text-[15px]"
            style={{
              backgroundColor: '#171717',
              color: '#f7f4ed',
              flex: 1,
              borderRadius: '12px',
              padding: '12px 16px',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Fetch Conversation
              </>
            )}
          </Button>

          <Button 
            onClick={handleTestRecent} 
            disabled={isLoading}
            variant="outline"
            className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic text-[15px]"
            style={{ 
              flex: 1,
              backgroundColor: '#e9e6df',
              border: '1px solid #d5d2cb',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#171717',
            }}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Recent (10)'
            )}
          </Button>
        </div>
      </div>

      {status === 'success' && (
        <div 
          className="flex items-center gap-2 p-3 font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic text-[15px]"
          style={{
            backgroundColor: '#e9e6df',
            border: '1px solid #d5d2cb',
            borderRadius: '12px',
            color: '#22c55e',
          }}
        >
          <CheckCircle size={20} />
          <span>Success! Check console for response</span>
        </div>
      )}

      {status === 'error' && (
        <div 
          className="flex items-center gap-2 p-3 font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic text-[15px]"
          style={{
            backgroundColor: '#e9e6df',
            border: '1px solid #d5d2cb',
            borderRadius: '12px',
            color: '#ef4444',
          }}
        >
          <XCircle size={20} />
          <span>Error! Check console for details</span>
        </div>
      )}

      {response && (
        <div>
          <label 
            className="font-['General_Sans:Medium',_sans-serif] leading-[16px] not-italic text-[12px]"
            style={{ display: 'block', marginBottom: '0.5rem', color: '#4c4b4b' }}
          >
            Response
          </label>
          <pre 
            className="font-['GT_Flexa_Mono:Regular',_monospace] leading-[18px] not-italic text-[13px]"
            style={{
              backgroundColor: '#e9e6df',
              border: '1px solid #d5d2cb',
              borderRadius: '12px',
              padding: '0.75rem',
              overflow: 'auto',
              maxHeight: '200px',
              margin: 0,
              color: '#171717',
            }}
          >
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <div 
        className="p-3 font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic text-[15px]"
        style={{
          backgroundColor: '#e9e6df',
          borderRadius: '12px',
          border: '1px solid #d5d2cb',
        }}
      >
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Request Preview
        </label>
        <pre 
          style={{
            margin: 0,
            overflow: 'auto',
            maxHeight: '150px',
          }}
        >
          {JSON.stringify({
            user_id: API_CONFIG.DEFAULT_USER_ID,
            message: '',
            cic_hash: '{"1804860":0,"9296571":0,...}',
            username_hash: {},
            refresh_conversation: true,
            grpc_port: API_CONFIG.GRPC_PORT,
            user_location: API_CONFIG.USER_LOCATION,
            ...(conversationId && { conversation_id: conversationId }),
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
