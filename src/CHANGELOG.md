# Changelog

## 2025-10-23 - Figma Design System Integration

### Updated

- **Complete UI Redesign** - Implemented Figma design system across all components
  - New color palette: warm beige/cream tones (#f7f4ed, #e9e6df, #d5d2cb)
  - Typography: Rhymes Display for headings, Inter for body, GT Flexa Mono for labels
  - Rounded corners and consistent spacing
  - Chat bubble design for user messages
  - Clean, modern aesthetic matching braintrust.dev inspiration

#### Components Updated
- `/components/ConversationView.tsx` - Rich chat-style message display
- `/components/ConversationList.tsx` - Styled conversation list with tags
- `/components/NotesPanel.tsx` - Clean notes interface
- `/components/QuickAPITest.tsx` - Styled API testing panel
- `/App.tsx` - Updated header and overall layout

### Visual Improvements
- User messages displayed in chat bubbles (beige background, right-aligned)
- Assistant messages in clean text format
- Conversation titles prominently displayed with Rhymes Display font
- Tags shown with proper dividers and styling
- Smooth, cohesive design system throughout

---

## 2025-10-23 - Recent Conversations Integration

### Added

- **Recent Conversations Endpoint** - Integrated `/conversations/recent` endpoint
  - New `fetchRecentConversations()` method in `chatService`
  - Automatically loads recent conversations on app mount
  - Displays conversation list with titles and IDs
  - Clicking a conversation fetches full details via `/chat` endpoint

### Updated Files

#### Services
- `/services/chatService.ts`
  - Added `fetchRecentConversations()` method for `/conversations/recent` endpoint
  - Added interfaces: `GetRecentConversationsRequest`, `LatestConversation`, `RecentConversationsResponse`
  - Updated `fetchConversations()` to use new endpoint

#### Hooks
- `/hooks/useChat.ts`
  - Added `fetchRecentConversations()` to hook return
  - Exposed method for fetching recent conversations list

#### Components
- `/App.tsx`
  - Auto-loads recent conversations on mount
  - Added "Refresh" button to reload conversation list
  - Clicking conversation now fetches full details from API
  - Shows loading state during fetch operations

- `/components/QuickAPITest.tsx`
  - Added "Recent (10)" button to test recent conversations endpoint
  - Shows both endpoints in test panel

- `/components/ChatTester.tsx`
  - Added "Fetch Recent (10)" button
  - Tests recent conversations endpoint

#### Documentation
- `/API_SPECIFICATION.md`
  - Added documentation for `/conversations/recent` endpoint
  - Included request/response examples
  - Added typical workflow example

### Workflow

1. App loads → fetches recent conversations via `/conversations/recent`
2. User clicks conversation → fetches full conversation via `/chat` with conversation_id
3. Conversation messages are displayed
4. User can refresh to reload the list

---

## 2025-10-23 - API Integration Update

### Changed

- **API Request Format**: Updated to match exact specification from NestJS backend
  - `message` field is now **always an empty string** (`""`)
  - Endpoint is used to **fetch conversations**, not send messages
  - All required fields properly included: `cic_hash`, `username_hash`, `refresh_conversation`, `grpc_port`, `user_location`

### Updated Files

#### Services
- `/services/chatService.ts`
  - Renamed `sendMessage()` to `fetchConversation()` for clarity
  - Always sends `message: ""` as per API spec
  - Properly stringifies `cic_hash` object to JSON string

#### Hooks
- `/hooks/useChat.ts`
  - Renamed `sendMessage` to `fetchConversation` 
  - Updated return type interface
  - All configuration defaults pulled from `API_CONFIG`

#### Components
- `/components/QuickAPITest.tsx`
  - Removed message input field (not needed)
  - Updated to call `fetchConversation()`
  - Shows proper request format in preview

- `/components/ChatTester.tsx`
  - Removed message input field
  - Updated to call `fetchConversation()`
  - Renamed button from "Send Message" to "Fetch Conversation"

#### Configuration
- `/config/api.ts`
  - Updated `BASE_URL` to `http://localhost:3002`
  - Updated `DEFAULT_USER_ID` to `"1000001805422"`
  - Added complete `DEFAULT_CIC_HASH` object from sample request
  - Added `DEFAULT_USERNAME_HASH` (empty object)
  - Set `GRPC_PORT` to `50051`
  - Set default location to New York coordinates

#### Documentation
- `/API_SPECIFICATION.md`
  - Updated to reflect `message: ""` requirement
  - Updated all examples to show empty message string
  - Clarified that endpoint fetches conversations, doesn't send messages
  - Updated code examples to use `fetchConversation()`

#### Examples
- `/examples/AppWithChatAPI.tsx`
  - Renamed `handleSendMessage` to `handleFetchConversation`
  - Updated to use new API format

### Request Format

```typescript
{
  user_id: "1000001805422",
  message: "",  // Always empty
  cic_hash: "{\"1804860\":0,...}",  // Stringified JSON
  username_hash: {},
  refresh_conversation: true,
  grpc_port: 50051,
  user_location: {
    latitude: 40.7128,
    longitude: -74.006
  },
  conversation_id: "optional-id-here"
}
```

### Testing

To test the integration:

1. Click "Test API" button in the header
2. Optionally enter a conversation ID
3. Click "Fetch Conversation"
4. View response in the panel and browser console

### Notes

- The API does not support sending new messages through this endpoint
- The `message` field must always be an empty string
- Use the `conversation_id` parameter to fetch specific conversations
- Leave `conversation_id` empty to fetch a new/default conversation
