import { Conversation, Message } from '../types/conversation';

/**
 * Utility functions for working with conversations and API data
 */

/**
 * Extract text content and structured data from a message's ui_components
 */
function extractContentFromUIComponents(uiComponents: any[]): { 
  content: string; 
  placeList?: any;
  quickResponses?: any[];
} {
  if (!uiComponents || !Array.isArray(uiComponents)) {
    return { content: '' };
  }

  const contents: string[] = [];
  let placeList: any = null;
  let quickResponses: any[] = [];
  
  for (const component of uiComponents) {
    // Extract from body component
    if (component.body?.component?.mutableContent) {
      contents.push(component.body.component.mutableContent);
    }
    
    // Extract from loading component (status messages)
    if (component.loading?.component?.mutableStatusTextsList) {
      const statusTexts = component.loading.component.mutableStatusTextsList;
      if (Array.isArray(statusTexts) && statusTexts.length > 0) {
        contents.push(`[Loading: ${statusTexts.join(', ')}]`);
      }
    }
    
    // Extract place list
    if (component.placeList?.component) {
      const placeComponent = component.placeList.component;
      placeList = {
        heading: placeComponent.mutableHeading1,
        body: placeComponent.mutableBody,
        places: placeComponent.mutablePlacesList || []
      };
    }
    
    // Extract quick responses
    if (component.quickResponses?.component?.quickResponsesList) {
      quickResponses = component.quickResponses.component.quickResponsesList;
    }
  }
  
  return { 
    content: contents.join('\n\n').trim(),
    placeList,
    quickResponses: quickResponses.length > 0 ? quickResponses : undefined
  };
}

/**
 * Create a new conversation from an API chat response
 */
export function createConversationFromChat(
  chatResponse: any,
  userMessage: string,
  userId: string
): Conversation {
  const conversationId = chatResponse.conversation_id || chatResponse.conversationId || generateConversationId();
  const timestamp = new Date(chatResponse.timestamp || Date.now());

  const messages: Message[] = [];
  
  // Check if the response has a messages array (full conversation history)
  if (chatResponse.messages && Array.isArray(chatResponse.messages)) {
    chatResponse.messages.forEach((msg: any, index: number) => {
      // Extract content from ui_components structure
      let content = '';
      let placeList: any = undefined;
      let quickResponses: any = undefined;
      
      if (msg.ui_components) {
        const extracted = extractContentFromUIComponents(msg.ui_components);
        content = extracted.content;
        placeList = extracted.placeList;
        quickResponses = extracted.quickResponses;
      } else {
        // Fallback to direct content fields
        content = msg.content || msg.message || msg.text || '';
      }
      
      // Only add messages that have actual content (skip loading-only messages)
      if (content && !content.startsWith('[Loading:')) {
        const message: any = {
          id: msg.id || msg.message_id || `${conversationId}-msg-${index}`,
          role: msg.role === 'USER' || msg.role === 'user' || msg.sender === 'user' ? 'user' : 'assistant',
          content: content,
          timestamp: new Date(msg.timestamp || msg.created_at || Date.now()),
        };
        
        // Add place list if present
        if (placeList) {
          message.placeList = placeList;
        }
        
        // Add quick responses if present
        if (quickResponses) {
          message.quickResponses = quickResponses;
        }
        
        messages.push(message);
      }
    });
  } else {
    // Fallback to single message format
    // Add user message if provided
    if (userMessage) {
      messages.push({
        id: `${conversationId}-user-${Date.now()}`,
        role: 'user',
        content: userMessage,
        timestamp: timestamp,
      });
    }

    // Add assistant response if available
    // Check for various possible response fields
    const assistantMessage = chatResponse.message || chatResponse.response || chatResponse.reply;
    if (assistantMessage) {
      messages.push({
        id: `${conversationId}-assistant-${Date.now()}`,
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(Date.now() + 1000), // Slightly after user message
      });
    }
  }

  // Generate title from first user message if available
  let title = 'Untitled Conversation';
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    title = generateTitleFromMessage(firstUserMessage.content);
  } else if (chatResponse.title || chatResponse.conversation_title) {
    title = chatResponse.title || chatResponse.conversation_title;
  } else if (userMessage) {
    title = generateTitleFromMessage(userMessage);
  } else {
    const assistantMessage = chatResponse.message || chatResponse.response;
    if (assistantMessage) {
      title = generateTitleFromMessage(assistantMessage);
    }
  }

  return {
    id: conversationId,
    title,
    date: timestamp,
    messages,
    note: '',
    tags: extractTagsFromResponse(chatResponse),
  };
}

/**
 * Add a message exchange to an existing conversation
 */
export function addMessageToConversation(
  conversation: Conversation,
  userMessage: string,
  assistantResponse: any
): Conversation {
  const timestamp = new Date(assistantResponse.timestamp || Date.now());

  const newMessages: Message[] = [
    {
      id: `${conversation.id}-user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: timestamp,
    },
  ];

  if (assistantResponse.message) {
    newMessages.push({
      id: `${conversation.id}-assistant-${Date.now()}`,
      role: 'assistant',
      content: assistantResponse.message,
      timestamp: new Date(Date.now() + 1000),
    });
  }

  return {
    ...conversation,
    messages: [...conversation.messages, ...newMessages],
  };
}

/**
 * Generate a unique conversation ID
 */
export function generateConversationId(): string {
  return `conv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a title from the first message
 */
export function generateTitleFromMessage(message: string): string {
  const maxLength = 60;
  const cleaned = message.trim();
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  return cleaned.substring(0, maxLength) + '...';
}

/**
 * Extract tags from API response
 * Customize this based on your API response structure
 */
export function extractTagsFromResponse(response: any): string[] {
  const tags: string[] = [];
  
  // Add tags based on response properties
  if (response.tags && Array.isArray(response.tags)) {
    tags.push(...response.tags);
  }
  
  if (response.quickResponses && response.quickResponses.length > 0) {
    tags.push('has-suggestions');
  }
  
  return tags;
}

/**
 * Calculate a score for a conversation based on various metrics
 * This is a placeholder - customize based on your needs
 */
export function calculateConversationScore(conversation: Conversation): number {
  let score = 3; // Base score
  
  // Longer conversations might indicate engagement
  if (conversation.messages.length > 4) {
    score += 1;
  }
  
  // Conversations with notes might indicate importance
  if (conversation.note && conversation.note.length > 0) {
    score += 1;
  }
  
  return Math.min(score, 5);
}

/**
 * Merge API data into existing conversations
 * Useful when fetching updated conversation data
 */
export function mergeConversations(
  existing: Conversation[],
  incoming: Conversation[]
): Conversation[] {
  const conversationMap = new Map<string, Conversation>();
  
  // Add existing conversations
  existing.forEach(conv => {
    conversationMap.set(conv.id, conv);
  });
  
  // Merge or add incoming conversations
  incoming.forEach(conv => {
    const existingConv = conversationMap.get(conv.id);
    if (existingConv) {
      // Merge - prefer newer messages and preserve notes
      conversationMap.set(conv.id, {
        ...conv,
        note: existingConv.note || conv.note,
        messages: mergeMessages(existingConv.messages, conv.messages),
      });
    } else {
      conversationMap.set(conv.id, conv);
    }
  });
  
  return Array.from(conversationMap.values()).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}

/**
 * Merge message arrays, removing duplicates
 */
function mergeMessages(existing: Message[], incoming: Message[]): Message[] {
  const messageMap = new Map<string, Message>();
  
  existing.forEach(msg => messageMap.set(msg.id, msg));
  incoming.forEach(msg => messageMap.set(msg.id, msg));
  
  return Array.from(messageMap.values()).sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
}

/**
 * Format API error for display
 */
export function formatApiError(error: any): string {
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}
