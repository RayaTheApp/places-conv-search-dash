# Chat API Specification

## Endpoints

### 1. Fetch Conversation

```
POST http://localhost:3002/chat
```

## Request Format

### Headers
```
Content-Type: application/json
```

### Request Body

```typescript
{
  user_id: string;              // e.g., "1000001805422"
  message: string;              // ALWAYS EMPTY STRING - ""
  cic_hash: string;             // Stringified JSON object of CIC IDs and values
  username_hash: object;        // Username hash object (can be empty {})
  refresh_conversation: boolean; // Whether to refresh the conversation (typically true)
  grpc_port: number;            // gRPC port (e.g., 50051)
  user_location: {              // User's location coordinates
    latitude: number;
    longitude: number;
  };
  conversation_id?: string;     // Optional - existing conversation ID
}
```

**Important:** The `message` field is **always sent as an empty string (`""`)** per the API specification. This endpoint is used to fetch conversations, not to send new messages.

### Example Request

```json
{
  "user_id": "1000001805422",
  "message": "",
  "cic_hash": "{\"1804860\":0,\"9296571\":0,\"11298302\":0,\"27867814\":0,\"330516745\":2,\"1017908760\":0,\"1412961043\":0,\"2927642976\":0,\"1000000017777\":0,\"1000000122459\":0,\"1000000283372\":0,\"1000000429887\":0,\"1000001166105\":0,\"1000001267242\":0,\"1000001292440\":0,\"1000001296046\":0,\"1000001422272\":0,\"1000001558383\":0,\"1000002929181\":0,\"10264309808\":0,\"4000000007480\":0,\"4000000008460\":0,\"4000000008542\":0,\"4000000008567\":0,\"4000000008569\":0,\"4000000008573\":0,\"4000000008655\":0,\"4000000009039\":0,\"4000000010497\":0,\"4000000010521\":0,\"4000000010543\":0,\"4000000010545\":0,\"4000000010923\":0,\"4000000011501\":0,\"4000000013733\":0}",
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

## Response Format

```
Status: 201 Created
Content-Type: application/json; charset=utf-8
```

### Response Headers
```
access-control-allow-origin: *
connection: keep-alive
content-type: application/json; charset=utf-8
```

### Expected Response Body

The response structure will vary based on your NestJS implementation. Common fields might include:

```typescript
{
  conversation_id?: string;     // Conversation ID
  message?: string;             // Assistant's response message
  response?: string;            // Alternative response field
  quickResponses?: string[];    // Quick response suggestions
  timestamp?: string;           // Response timestamp
  // ... other fields based on your implementation
}
```

---

### 2. Get Recent Conversations

```
POST http://localhost:3002/conversations/recent
```

#### Request Format

##### Headers
```
Content-Type: application/json
```

##### Request Body

```typescript
{
  user_id?: string;         // Optional - User ID to fetch conversations for
  for_user_id?: string;     // Optional - Alternative user ID parameter
  limit?: number;           // Optional - Number of conversations to return (default: 50)
  offset?: number;          // Optional - Pagination offset (default: 0)
  grpc_port?: number;       // Optional - gRPC port (default: 50051)
}
```

##### Example Request

```json
{
  "user_id": "1000001805422",
  "limit": 50,
  "offset": 0,
  "grpc_port": 50051
}
```

#### Response Format

```typescript
{
  conversations: [
    {
      conversation_id: string;
      conversation_title: string;
      user_id: string;
    }
  ]
}
```

##### Example Response

```json
{
  "conversations": [
    {
      "conversation_id": "92185ebf-3641-452b-8263-d42a74441c66",
      "conversation_title": "Restaurant recommendations",
      "user_id": "1000001805422"
    },
    {
      "conversation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "conversation_title": "Weather inquiry",
      "user_id": "1000001805422"
    }
  ]
}
```

---

## Service Configuration

Update `/config/api.ts` to match your setup:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3002',  // Your NestJS server
  DEFAULT_USER_ID: '1000001805422',   // Your test user ID
  DEFAULT_CIC_HASH: {                 // Your CIC hash object
    "1804860": 0,
    "9296571": 0,
    // ... other CIC IDs
  },
  DEFAULT_USERNAME_HASH: {},          // Username hash
  GRPC_PORT: 50051,                   // gRPC port
  USER_LOCATION: {                    // Default location (NYC)
    latitude: 40.7128,
    longitude: -74.006,
  },
};
```

## Usage in Code

### Using the Service Directly

```typescript
import { chatService } from './services/chatService';
import { API_CONFIG } from './config/api';

// Fetch a specific conversation or create a new one
const response = await chatService.fetchConversation(
  API_CONFIG.DEFAULT_USER_ID,
  'conversation-id-here',  // or undefined for new conversation
  API_CONFIG.DEFAULT_CIC_HASH,
  API_CONFIG.DEFAULT_USERNAME_HASH,
  true,  // refresh_conversation
  API_CONFIG.GRPC_PORT,
  API_CONFIG.USER_LOCATION
);
```

### Using the React Hook

```typescript
import { useChat } from './hooks/useChat';
import { API_CONFIG } from './config/api';

function MyComponent() {
  const chat = useChat({
    userId: API_CONFIG.DEFAULT_USER_ID,
    cicHash: API_CONFIG.DEFAULT_CIC_HASH,
    usernameHash: API_CONFIG.DEFAULT_USERNAME_HASH,
    refreshConversation: true,
    grpcPort: API_CONFIG.GRPC_PORT,
    userLocation: API_CONFIG.USER_LOCATION,
  });

  const loadConversations = async () => {
    // Fetch recent conversations list
    const recentConvs = await chat.fetchRecentConversations(50, 0);
    // Returns: Array<{ conversation_id, conversation_title, user_id }>
  };

  const loadConversationDetails = async (conversationId: string) => {
    // Fetch full conversation with messages
    const response = await chat.fetchConversation(conversationId);
  };
}
```

### Typical Workflow

```typescript
// 1. Load list of recent conversations
const recentConversations = await chat.fetchRecentConversations(50, 0);

// 2. When user clicks on a conversation, fetch its details
const conversationId = recentConversations[0].conversation_id;
const fullConversation = await chat.fetchConversation(conversationId);
```

## CIC Hash Format

The `cic_hash` field must be a **stringified JSON object** mapping CIC IDs to values:

```typescript
// In your config
DEFAULT_CIC_HASH: {
  "1804860": 0,
  "9296571": 0,
  // ... more IDs
}

// In the request (automatically stringified by the service)
"cic_hash": "{\"1804860\":0,\"9296571\":0,...}"
```

## Testing

### Quick Test (In Browser)

1. Click "Test API" button in the header
2. Enter a message
3. Click "Send Test Message"
4. Check the console for the response

### Console Test

```javascript
// In browser console
const response = await fetch('http://localhost:3002/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: '1000001805422',
    message: '',  // Always empty string
    cic_hash: '{"1804860":0}',
    username_hash: {},
    refresh_conversation: true,
    grpc_port: 50051,
    user_location: { latitude: 40.7128, longitude: -74.006 },
    conversation_id: '92185ebf-3641-452b-8263-d42a74441c66'  // optional
  })
});
const data = await response.json();
console.log(data);
```

## CORS Configuration

If you encounter CORS issues, ensure your NestJS app has CORS enabled:

```typescript
// main.ts in your NestJS app
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
});
```

## Troubleshooting

### Issue: Port mismatch
**Solution:** Update `BASE_URL` in `/config/api.ts` to match your NestJS port

### Issue: Invalid CIC hash
**Solution:** Ensure the CIC hash object in `/config/api.ts` matches your expected format

### Issue: Missing fields
**Solution:** Check that all required fields are present in the request

### Issue: Connection refused
**Solution:** Verify your NestJS server is running with `npm run start:dev`

## File Locations

- Configuration: `/config/api.ts`
- Service: `/services/chatService.ts`
- Hook: `/hooks/useChat.ts`
- Test Component: `/components/QuickAPITest.tsx`
- Full Tester: `/components/ChatTester.tsx`
