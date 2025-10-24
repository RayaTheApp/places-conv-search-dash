# Conversation Evaluator - API Integration Summary

## Overview

The Conversation Evaluator dashboard now integrates with your NestJS backend to:
1. Load recent conversations on app startup
2. Fetch full conversation details when clicking on a conversation
3. Display conversation messages and metadata

## How It Works

### 1. Application Startup

When the app loads (`App.tsx`):
```typescript
useEffect(() => {
  loadRecentConversations();
}, []);
```

This calls `POST /conversations/recent` with:
```json
{
  "user_id": "1000001805422",
  "limit": 50,
  "offset": 0,
  "grpc_port": 50051
}
```

Response:
```json
{
  "conversations": [
    {
      "conversation_id": "92185ebf-3641-452b-8263-d42a74441c66",
      "conversation_title": "Restaurant recommendations",
      "user_id": "1000001805422"
    }
  ]
}
```

### 2. Clicking a Conversation

When a user clicks on a conversation in the list:
```typescript
handleSelectConversation(conversationId)
```

This calls `POST /chat` with:
```json
{
  "user_id": "1000001805422",
  "message": "",
  "cic_hash": "{\"1804860\":0,...}",
  "username_hash": {},
  "refresh_conversation": true,
  "grpc_port": 50051,
  "user_location": {
    "latitude": 40.7128,
    "longitude": -74.006
  },
  "conversation_id": "92185ebf-3641-452b-8263-d42a74441c66"
}
```

The response should contain the full conversation with messages, which is then parsed and displayed.

### 3. Message Parsing

The `createConversationFromChat()` utility function handles parsing the API response. It supports multiple response formats:

**Format 1: Messages Array**
```json
{
  "conversation_id": "...",
  "messages": [
    {
      "role": "user",
      "content": "What restaurants are nearby?",
      "timestamp": "2025-10-23T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Here are some restaurants near you...",
      "timestamp": "2025-10-23T10:00:05Z"
    }
  ]
}
```

**Format 2: Single Message**
```json
{
  "conversation_id": "...",
  "message": "Here are some restaurants near you...",
  "timestamp": "2025-10-23T10:00:05Z"
}
```

## Key Files

### Service Layer
- `/services/chatService.ts` - API communication
  - `fetchRecentConversations()` - Get conversation list
  - `fetchConversation()` - Get full conversation details

### React Hooks
- `/hooks/useChat.ts` - React hook wrapping the service
  - Provides loading states, error handling
  - Exposes both fetch methods

### Components
- `/App.tsx` - Main application
  - Loads conversations on mount
  - Handles conversation selection
  - Manages application state

- `/components/ConversationList.tsx` - Left sidebar
  - Displays conversation titles
  - Handles selection

- `/components/ConversationView.tsx` - Center panel
  - Displays messages
  - Shows conversation metadata

- `/components/NotesPanel.tsx` - Right sidebar
  - Allows adding notes to conversations
  - Notes are stored locally (not sent to API)

### Utilities
- `/utils/conversationUtils.ts`
  - `createConversationFromChat()` - Transforms API response to Conversation type
  - Handles multiple response formats
  - Generates titles from messages

## Configuration

Edit `/config/api.ts` to match your setup:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3002',
  DEFAULT_USER_ID: '1000001805422',
  DEFAULT_CIC_HASH: { /* your CIC hash */ },
  DEFAULT_USERNAME_HASH: {},
  GRPC_PORT: 50051,
  USER_LOCATION: {
    latitude: 40.7128,
    longitude: -74.006,
  },
};
```

## Testing

### Quick Test Panel
Click "Test API" in the header to open the test panel:
- **Fetch Conversation** - Test fetching a specific conversation by ID
- **Recent (10)** - Test fetching recent conversations

### Full Test Component
The `ChatTester` component (available in examples) provides:
- Connection testing
- Manual conversation fetching
- Recent conversations testing
- Response display

## Error Handling

The application gracefully handles API errors:
- Falls back to mock data if initial load fails
- Logs errors to console
- Shows error states in UI
- Allows retry via "Refresh" button

## Next Steps

To fully integrate with your backend:

1. Ensure your `/chat` endpoint returns conversation history in the messages array
2. Verify the `/conversations/recent` endpoint is accessible
3. Check that conversation_id matches between both endpoints
4. Test with real data from your NestJS backend

## Data Flow Diagram

```
App Startup
    ↓
fetchRecentConversations()
    ↓
POST /conversations/recent
    ↓
Display conversation list
    ↓
User clicks conversation
    ↓
fetchConversation(id)
    ↓
POST /chat (with conversation_id)
    ↓
Parse response with createConversationFromChat()
    ↓
Display messages in ConversationView
```
