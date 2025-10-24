# Bug Fix Summary: API 500 Errors

## Problem
The application was making API calls to endpoints that don't exist in the NestJS backend, causing 500 Internal Server Errors:
- `GET /conversation/:conversationId` - This endpoint doesn't exist

## Root Cause
The `fetchFullConversation` method in `/services/chatService.ts` was trying to use a `GET` request to `/conversation/:conversationId`, but according to the API specification, the only way to fetch a conversation is through the `POST /chat` endpoint with the `conversation_id` parameter.

## Changes Made

### 1. Updated `/services/chatService.ts`
**Method:** `fetchFullConversation()`

**Before:**
```typescript
async fetchFullConversation(
  conversationId: string,
  userId: string,
  cicHash: Record<string, number> = API_CONFIG.DEFAULT_CIC_HASH
): Promise<Conversation> {
  const cicHashEncoded = encodeURIComponent(JSON.stringify(cicHash));
  const url = `${this.baseUrl}/conversation/${conversationId}?user_id=${userId}&cic_hash=${cicHashEncoded}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // ...
}
```

**After:**
```typescript
async fetchFullConversation(
  conversationId: string,
  userId: string,
  cicHash: Record<string, number> = API_CONFIG.DEFAULT_CIC_HASH,
  usernameHash: Record<string, any> = API_CONFIG.DEFAULT_USERNAME_HASH,
  grpcPort: number = API_CONFIG.GRPC_PORT,
  userLocation: { latitude: number; longitude: number } = API_CONFIG.USER_LOCATION
): Promise<Conversation> {
  // Use the /chat endpoint to fetch the conversation
  const request: ChatRequest = {
    user_id: userId,
    message: '', // Always empty as per API specification
    cic_hash: JSON.stringify(cicHash),
    username_hash: usernameHash,
    refresh_conversation: true,
    grpc_port: grpcPort,
    user_location: userLocation,
    conversation_id: conversationId,
  };

  const response = await fetch(`${this.baseUrl}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  // ...
}
```

### 2. Updated `/hooks/useChat.ts`
**Method:** `fetchFullConversation()`

Updated the method signature to accept all required parameters:
```typescript
fetchFullConversation: (
  conversationId: string, 
  userId: string, 
  cicHash: Record<string, number>,
  usernameHash?: Record<string, any>,
  grpcPort?: number,
  userLocation?: { latitude: number; longitude: number }
) => Promise<Conversation>
```

And updated the implementation to pass all parameters to the service.

### 3. Updated `/App.tsx`
Updated the call to `fetchFullConversation` to pass all required parameters:
```typescript
const fullConversation = await chat.fetchFullConversation(
  conversationId,
  API_CONFIG.DEFAULT_USER_ID,
  API_CONFIG.DEFAULT_CIC_HASH,
  API_CONFIG.DEFAULT_USERNAME_HASH,
  API_CONFIG.GRPC_PORT,
  API_CONFIG.USER_LOCATION
);
```

## API Endpoints Used (After Fix)

The application now correctly uses only the endpoints specified in the API:

1. **POST /chat** - For fetching conversations and conversation details
   - Used with `conversation_id` parameter to fetch existing conversations
   - Used without `conversation_id` to create new conversations

2. **POST /conversations/recent** - For getting the list of recent conversations
   - Returns conversation IDs and titles
   - Used to populate the conversation list in the sidebar

3. **POST /eval/:conversationId** - For running evaluations on conversations

## Expected Result
- All API calls should now succeed (assuming the backend is running and accessible)
- The Individual Trace View should be able to:
  - Load the list of recent conversations
  - Load full conversation details when a conversation is selected
  - Display messages, trace data, and evaluation results
- No more 500 Internal Server Error messages

## Testing
To verify the fix:
1. Ensure your NestJS backend is running on `http://localhost:3002`
2. Refresh the application
3. The conversation list should load without errors
4. Click on a conversation in the list
5. The conversation details should load without errors
6. Check the browser console - there should be no 500 errors

## Related Files
- `/services/chatService.ts` - Core API service
- `/hooks/useChat.ts` - React hook wrapper
- `/App.tsx` - Main application component
- `/config/api.ts` - API configuration
- `/API_SPECIFICATION.md` - API documentation
