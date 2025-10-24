# Quick Integration Guide

This guide shows how to integrate the chat service with your existing App.tsx.

## Option 1: Quick Test (Recommended First Step)

Add the ChatTester component to your existing app to test the API connection:

```typescript
// App.tsx
import { ChatTester } from './components/ChatTester';
import { useState } from 'react';

export default function App() {
  const [showTester, setShowTester] = useState(false);
  // ... your existing code

  return (
    <div className="h-screen flex flex-col">
      <header>
        {/* Add a button to toggle the tester */}
        <button onClick={() => setShowTester(!showTester)}>
          {showTester ? 'Hide' : 'Show'} API Tester
        </button>
      </header>
      
      {/* Show tester when enabled */}
      {showTester && <ChatTester />}
      
      {/* Your existing app content */}
    </div>
  );
}
```

## Option 2: Add Real-time Message Sending

Enhance your existing app to send messages via the API:

```typescript
// App.tsx
import { useChat } from './hooks/useChat';
import { API_CONFIG } from './config/api';
import { createConversationFromChat, addMessageToConversation } from './utils/conversationUtils';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  // Add the chat hook
  const chat = useChat({
    userId: API_CONFIG.DEFAULT_USER_ID,
    cicHash: API_CONFIG.DEFAULT_CIC_HASH,
  });

  // Add message sending function
  const handleSendMessage = async (message: string, conversationId?: string) => {
    try {
      const response = await chat.sendMessage(message, conversationId);
      
      setConversations(prev => {
        const existing = prev.find(c => c.id === conversationId);
        
        if (existing) {
          // Update existing conversation
          const updated = addMessageToConversation(existing, message, response);
          return prev.map(c => c.id === conversationId ? updated : c);
        } else {
          // Create new conversation
          const newConv = createConversationFromChat(response, message, API_CONFIG.DEFAULT_USER_ID);
          return [newConv, ...prev];
        }
      });
      
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Pass handleSendMessage to components that need it
  return (
    // ... your existing JSX
  );
}
```

## Option 3: Load Conversations from API

Fetch real conversations on component mount:

```typescript
import { useEffect } from 'react';
import { mergeConversations } from './utils/conversationUtils';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const chat = useChat({
    userId: API_CONFIG.DEFAULT_USER_ID,
    cicHash: API_CONFIG.DEFAULT_CIC_HASH,
  });

  // Load conversations from API
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const apiConversations = await chat.fetchConversations();
      setConversations(apiConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  // ... rest of your component
}
```

## Option 4: Full Integration

Use the complete example from `/examples/AppWithChatAPI.tsx`:

1. Back up your current `App.tsx`
2. Copy `/examples/AppWithChatAPI.tsx` to `/App.tsx`
3. Update `/config/api.ts` with your server details
4. Test the connection using the built-in tester

## Configuration Steps

Before using any of the above options:

### 1. Update API Configuration

Edit `/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',  // Change to your NestJS server port
  DEFAULT_USER_ID: 'your-test-user',  // Change as needed
  DEFAULT_CIC_HASH: 'your-cic-hash',  // Change as needed
};
```

### 2. Verify NestJS Server is Running

```bash
# In your NestJS project
npm run start:dev
```

### 3. Enable CORS (if needed)

In your NestJS `main.ts`:

```typescript
app.enableCors({
  origin: 'http://localhost:5173', // Your React dev server
  credentials: true,
});
```

## Testing the Integration

### Step 1: Test Connection

```typescript
import { chatService } from './services/chatService';

const isConnected = await chatService.testConnection();
console.log('Connected:', isConnected);
```

### Step 2: Send a Test Message

```typescript
const response = await chatService.sendMessage(
  'Hello, world!',
  'test-user-123',
  undefined,  // no conversation ID (new conversation)
  'test-cic-hash'
);
console.log('Response:', response);
```

### Step 3: Verify Response Format

Check your browser console to see the actual response structure, then update the interfaces in `/services/chatService.ts` if needed.

## Common Issues

### Issue: CORS Error

**Solution:** Enable CORS in your NestJS app (see step 3 above)

### Issue: Connection Refused

**Solution:** Verify the NestJS server is running and the port matches your config

### Issue: Type Errors

**Solution:** Update the `ChatResponse` interface in `/services/chatService.ts` to match your actual API response

### Issue: Conversations Not Loading

**Solution:** You need to implement a GET `/conversations/:userId` endpoint in your NestJS API, or remove the `fetchConversations` calls

## Next Steps

1. Start with Option 1 to test the connection
2. Verify your API is responding correctly
3. Gradually integrate more features (Options 2-4)
4. Customize the service to match your exact API structure

## Files Reference

- `/config/api.ts` - Configuration
- `/services/chatService.ts` - Main service
- `/hooks/useChat.ts` - React hook
- `/components/ChatTester.tsx` - Testing component
- `/utils/conversationUtils.ts` - Helper functions
- `/examples/AppWithChatAPI.tsx` - Full example
- `/services/README.md` - Detailed documentation
