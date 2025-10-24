# Chat Service Integration

This directory contains the service layer for integrating with your local NestJS Chat API.

## Overview

The chat service provides a clean interface for:
- Sending messages to the `/chat` endpoint
- Fetching conversations (requires additional API endpoint)
- Managing API configuration
- Error handling and request/response transformation

## File Structure

```
/services/
  └── chatService.ts       # Main service for API communication

/hooks/
  └── useChat.ts          # React hook for using the chat service

/config/
  └── api.ts              # API configuration

/utils/
  └── conversationUtils.ts # Utilities for working with conversations

/components/
  └── ChatTester.tsx      # UI component for testing the API

/examples/
  └── AppWithChatAPI.tsx  # Example integration
```

## Configuration

Update the API configuration in `/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',  // Your NestJS server URL
  DEFAULT_USER_ID: 'test-user-123',   // Default user for testing
  DEFAULT_CIC_HASH: 'default-cic-hash', // Default CIC hash
  GRPC_PORT: undefined,               // Optional gRPC port
  USER_LOCATION: undefined,           // Optional user location
};
```

## Usage

### Basic Usage with the Hook

```typescript
import { useChat } from './hooks/useChat';
import { API_CONFIG } from './config/api';

function MyComponent() {
  const chat = useChat({
    userId: API_CONFIG.DEFAULT_USER_ID,
    cicHash: API_CONFIG.DEFAULT_CIC_HASH,
  });

  const handleSend = async () => {
    try {
      const response = await chat.sendMessage(
        'Hello, world!',
        'conversation-id-123'  // optional
      );
      console.log('Response:', response);
    } catch (error) {
      console.error('Error:', chat.error);
    }
  };

  return (
    <button onClick={handleSend} disabled={chat.isLoading}>
      Send Message
    </button>
  );
}
```

### Direct Service Usage

```typescript
import { chatService } from './services/chatService';

// Send a message
const response = await chatService.sendMessage(
  'What restaurants are nearby?',
  'user-123',
  'conv-456',           // optional conversation ID
  'cic-hash',          // CIC hash
  8080,                // optional gRPC port
  {                    // optional user location
    latitude: 37.7749,
    longitude: -122.4194
  }
);

// Test connection
const isConnected = await chatService.testConnection();
```

### Integration with Existing App

The easiest way to integrate is to use the example in `/examples/AppWithChatAPI.tsx`:

1. Copy the example to your main App.tsx
2. Update the configuration in `/config/api.ts`
3. Toggle "API Mode" on to use real API data
4. Use "Show Tester" to test the connection

## API Request Format

The service sends POST requests to `/chat` with this format:

```typescript
{
  user_id: string;
  conversation_id?: string;
  message: string;
  cic_hash: string;
  grpc_port?: number;
  user_location?: {
    latitude: number;
    longitude: number;
  };
}
```

## API Response Handling

The service expects responses in this general format:

```typescript
{
  conversationId?: string;
  message?: string;
  quickResponses?: string[];
  timestamp?: string;
  // Additional fields as needed
}
```

You can customize the response transformation in `chatService.ts` to match your actual API response structure.

## Fetching Conversations

To fetch all conversations, you'll need to implement a GET endpoint in your NestJS API:

```typescript
@Get('/conversations/:userId')
async getConversations(@Param('userId') userId: string) {
  // Return all conversations for the user
  return this.chatBotDemoService.getConversations(userId);
}
```

Then use the hook:

```typescript
const conversations = await chat.fetchConversations();
```

## Error Handling

The service includes comprehensive error handling:

```typescript
const chat = useChat({ userId: 'user-123' });

try {
  await chat.sendMessage('Hello');
} catch (error) {
  console.error('Error:', chat.error);
}

// Clear errors
chat.clearError();
```

## Utilities

### Creating Conversations from API Responses

```typescript
import { createConversationFromChat } from './utils/conversationUtils';

const response = await chat.sendMessage('Hello');
const conversation = createConversationFromChat(
  response,
  'Hello',
  'user-123'
);
```

### Adding Messages to Existing Conversations

```typescript
import { addMessageToConversation } from './utils/conversationUtils';

const response = await chat.sendMessage('Follow-up', 'conv-id');
const updatedConversation = addMessageToConversation(
  existingConversation,
  'Follow-up',
  response
);
```

### Merging Conversations

```typescript
import { mergeConversations } from './utils/conversationUtils';

const apiConversations = await chat.fetchConversations();
const merged = mergeConversations(localConversations, apiConversations);
```

## Testing the Connection

Use the ChatTester component to verify your API connection:

```typescript
import { ChatTester } from './components/ChatTester';

function App() {
  return (
    <div>
      <ChatTester onConversationsLoaded={(convs) => console.log(convs)} />
    </div>
  );
}
```

## Development vs Production

The application loads conversations directly from the API. Ensure your API is running and accessible:

```typescript
// Conversations are loaded from API on mount
useEffect(() => {
  loadConversations();
}, []);
```

## Troubleshooting

### CORS Issues

If you encounter CORS errors, enable CORS in your NestJS app:

```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:5173', // Your React app URL
  credentials: true,
});
```

### Connection Refused

Ensure your NestJS server is running:

```bash
npm run start:dev
```

And verify the port matches `API_CONFIG.BASE_URL`.

### TypeScript Errors

If you get type errors, update the interfaces in `chatService.ts` to match your actual API response structure.

## Next Steps

1. Update `/config/api.ts` with your server URL
2. Test the connection using the ChatTester component
3. Implement a `/conversations/:userId` endpoint in your NestJS API
4. Customize the response transformation in `chatService.ts`
5. Integrate into your main App.tsx using the example

## Support

For issues or questions about the chat service integration, refer to:
- `/services/chatService.ts` - Main service implementation
- `/hooks/useChat.ts` - React hook
- `/examples/AppWithChatAPI.tsx` - Integration example
