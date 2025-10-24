import { Conversation, Message } from '../types/conversation';
import { API_CONFIG } from '../config/api';

/**
 * Configuration for the chat service
 */
const CHAT_API_BASE_URL = API_CONFIG.BASE_URL;

interface ChatRequest {
  user_id: string;
  message: string;
  cic_hash: string; // Stringified JSON object
  username_hash: Record<string, any>;
  refresh_conversation: boolean;
  grpc_port: number;
  user_location: {
    latitude: number;
    longitude: number;
  };
  conversation_id?: string;
}

interface ChatResponse {
  conversationId?: string;
  message?: string;
  quickResponses?: string[];
  timestamp?: string;
  // Add other fields based on your actual API response
  [key: string]: any;
}

interface GetRecentConversationsRequest {
  user_id?: string;
  for_user_id?: string;
  conversation_id?: string;
  limit?: number;
  offset?: number;
  grpc_port?: number;
}

interface LatestConversation {
  conversation_id: string;
  conversation_title: string;
  user_id: string;
  created_at?: string;
  message_count?: number;
}

interface RecentConversationsResponse {
  conversations: LatestConversation[];
}

/**
 * Service for interacting with the chat API
 */
export class ChatService {
  private baseUrl: string;

  constructor(baseUrl: string = CHAT_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch conversation from the API
   * Note: message is always sent as empty string as per API specification
   */
  async fetchConversation(
    userId: string,
    conversationId?: string,
    cicHash: Record<string, number> = API_CONFIG.DEFAULT_CIC_HASH,
    usernameHash: Record<string, any> = API_CONFIG.DEFAULT_USERNAME_HASH,
    refreshConversation: boolean = true,
    grpcPort: number = API_CONFIG.GRPC_PORT,
    userLocation: { latitude: number; longitude: number } = API_CONFIG.USER_LOCATION
  ): Promise<ChatResponse> {
    const request: ChatRequest = {
      user_id: userId,
      message: '', // Always empty as per API specification
      cic_hash: JSON.stringify(cicHash), // Stringify the CIC hash object
      username_hash: usernameHash,
      refresh_conversation: refreshConversation,
      grpc_port: grpcPort,
      user_location: userLocation,
      ...(conversationId && { conversation_id: conversationId }),
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  /**
   * Fetch recent conversations for a user using the /conversations/recent endpoint
   */
  async fetchRecentConversations(
    userId?: string,
    forUserId?: string,
    conversationId?: string,
    limit: number = 50,
    offset: number = 0,
    grpcPort: number = API_CONFIG.GRPC_PORT
  ): Promise<LatestConversation[]> {
    try {
      const request: GetRecentConversationsRequest = {
        user_id: userId,
        for_user_id: forUserId,
        conversation_id: conversationId,
        limit,
        offset,
        grpc_port: grpcPort,
      };

      const response = await fetch(`${this.baseUrl}/conversations/recent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recent conversations: ${response.status} ${response.statusText}`);
      }

      const data: RecentConversationsResponse = await response.json();
      return data.conversations || [];
    } catch (error) {
      console.error('Error fetching recent conversations:', error);
      throw error;
    }
  }

  /**
   * Fetch full conversation details including trace and evaluation data
   * Uses the GET /conversation/:conversationId endpoint
   */
  async fetchFullConversation(
    conversationId: string,
    userId: string,
    cicHash: Record<string, number> = API_CONFIG.DEFAULT_CIC_HASH,
    usernameHash: Record<string, any> = API_CONFIG.DEFAULT_USERNAME_HASH,
    grpcPort: number = API_CONFIG.GRPC_PORT,
    userLocation: { latitude: number; longitude: number } = API_CONFIG.USER_LOCATION
  ): Promise<Conversation> {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        user_id: userId,
        cic_hash: JSON.stringify(cicHash),
      });

      const url = `${this.baseUrl}/conversation/${conversationId}?${params.toString()}`;
      console.log('Fetching conversation from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversation: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received conversation data:', data);
      return this.transformFullConversationResponse(data);
    } catch (error) {
      console.error('Error fetching full conversation:', error);
      throw error;
    }
  }

  /**
   * Run evaluation on a conversation
   */
  async runEvaluation(conversationId: string): Promise<{
    conversationId: string;
    evalResult: any;
    cached: boolean;
    cacheAge?: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/eval/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to run evaluation: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error running evaluation:', error);
      throw error;
    }
  }

  /**
   * Extract text content and structured data from a message's ui_components
   */
  private extractContentFromUIComponents(uiComponents: any[]): { 
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
   * Transform the full conversation API response to Conversation format
   */
  private transformFullConversationResponse(data: any): Conversation {
    console.log('=== TRANSFORMING FULL CONVERSATION ===');
    console.log('Raw API data:', data);
    console.log('Has trace?', !!data.trace);
    console.log('Has evalResult?', !!data.evalResult);
    console.log('Has metadata?', !!data.metadata);
    
    // Extract messages from ui_components using the same logic as conversationUtils
    const messages: Message[] = [];
    
    if (data.messages && Array.isArray(data.messages)) {
      data.messages.forEach((msg: any, index: number) => {
        // Extract content from ui_components structure
        let content = '';
        let placeList: any = undefined;
        let quickResponses: any = undefined;
        
        if (msg.ui_components && Array.isArray(msg.ui_components)) {
          const extracted = this.extractContentFromUIComponents(msg.ui_components);
          content = extracted.content;
          placeList = extracted.placeList;
          quickResponses = extracted.quickResponses;
        }
        
        // Only add messages that have actual content (skip loading-only messages)
        if (content && !content.startsWith('[Loading:')) {
          const message: any = {
            id: msg.message_id || `msg-${index}`,
            role: msg.role === 'USER' ? 'user' : 'assistant',
            content: content,
            timestamp: new Date(),
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
    }

    // Transform trace and evaluation data if available
    let evaluationData = undefined;
    if (data.trace || data.evalResult || data.metadata) {
      const traceMessages = data.trace?.messages || [];
      const evalResult = data.evalResult || {};
      const metadata = data.metadata || {};
      
      console.log('Building evaluation data...');
      console.log('Trace messages count:', traceMessages.length);
      console.log('EvalResult:', evalResult);
      console.log('Metadata:', metadata);
      
      evaluationData = {
        pass: evalResult.pass ?? true,
        latencyMs: metadata.latencyMs || evalResult.latencyMs || evalResult.meta?.latencyMs || 0,
        validationResults: evalResult.validationResults || [],
        judgeResults: evalResult.judgeResults || [],
        toolTrace: this.extractToolTrace(traceMessages),
        fullMessages: this.transformTraceMessages(traceMessages),
        meta: {
          tokensIn: metadata.tokensIn || evalResult.meta?.tokensIn || 0,
          tokensOut: metadata.tokensOut || evalResult.meta?.tokensOut || 0,
          latencyMs: metadata.latencyMs || evalResult.latencyMs || evalResult.meta?.latencyMs || 0,
          model: metadata.model || evalResult.meta?.model || 'unknown',
        },
      };
      
      console.log('Created evaluation data:', evaluationData);
    } else {
      console.log('No trace/eval/metadata found in response');
    }

    return {
      id: data.conversation_id,
      title: data.conversation_title || 'Untitled Conversation',
      date: new Date(),
      messages,
      note: '',
      tags: [],
      evaluation: evaluationData,
    };
  }

  /**
   * Extract tool trace from trace messages
   */
  private extractToolTrace(traceMessages: any[]): any[] {
    const toolTrace: any[] = [];
    
    traceMessages.forEach((msg: any) => {
      if (Array.isArray(msg.content)) {
        msg.content.forEach((contentItem: any) => {
          if (contentItem.type === 'tool_use') {
            toolTrace.push({
              toolName: contentItem.name,
              arguments: contentItem.input,
              result: {}, // Will be filled from tool_result messages
              executionTimeMs: 0, // Not available in this format
            });
          }
        });
      }
      
      // Handle tool results
      if (msg.role === 'user' && Array.isArray(msg.content)) {
        msg.content.forEach((contentItem: any) => {
          if (contentItem.type === 'tool_result') {
            // Find matching tool call and update result
            const matchingTool = toolTrace.find(t => t.result && Object.keys(t.result).length === 0);
            if (matchingTool) {
              try {
                matchingTool.result = typeof contentItem.content === 'string' 
                  ? JSON.parse(contentItem.content) 
                  : contentItem.content;
              } catch {
                matchingTool.result = contentItem.content;
              }
            }
          }
        });
      }
    });
    
    return toolTrace;
  }

  /**
   * Transform trace messages to ConversationMessageTrace format
   */
  private transformTraceMessages(traceMessages: any[]): any[] {
    return traceMessages.map((msg: any) => {
      const transformed: any = {
        role: msg.role,
      };

      // Handle different content formats
      if (typeof msg.content === 'string') {
        transformed.content = msg.content;
      } else if (Array.isArray(msg.content)) {
        // Extract text content or keep structured content
        const textContent = msg.content.find((c: any) => c.type === 'text');
        if (textContent) {
          transformed.content = textContent.text;
        } else {
          transformed.content = msg.content;
        }

        // Extract tool calls
        const toolUses = msg.content.filter((c: any) => c.type === 'tool_use');
        if (toolUses.length > 0) {
          transformed.tool_calls = toolUses.map((tu: any) => ({
            id: tu.id,
            name: tu.name,
            arguments: tu.input,
          }));
        }
      } else if (typeof msg.content === 'object') {
        transformed.content = msg.content;
      }

      if (msg.name) {
        transformed.name = msg.name;
      }

      return transformed;
    });
  }

  /**
   * Fetch all conversations for a user (legacy method - kept for compatibility)
   * @deprecated Use fetchRecentConversations instead
   */
  async fetchConversations(userId: string): Promise<Conversation[]> {
    try {
      const recentConversations = await this.fetchRecentConversations(userId);
      
      // Transform LatestConversation[] to Conversation[] format
      return recentConversations.map((conv) => ({
        id: conv.conversation_id,
        title: conv.conversation_title || 'Untitled Conversation',
        date: new Date(), // We don't have timestamp from this endpoint
        messages: [], // Messages will be loaded when conversation is selected
        note: '',
        tags: [],
      }));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  /**
   * Transform API response to Conversation format
   * Adjust this based on your actual API response structure
   */
  private transformToConversations(apiData: any[]): Conversation[] {
    return apiData.map((conv) => ({
      id: conv.conversationId || conv.id,
      title: conv.title || this.generateTitle(conv.messages),
      date: new Date(conv.timestamp || conv.date),
      messages: this.transformMessages(conv.messages || []),
      note: conv.note || '',
      score: conv.score,
      tags: conv.tags || [],
    }));
  }

  /**
   * Transform API messages to Message format
   */
  private transformMessages(apiMessages: any[]): Message[] {
    return apiMessages.map((msg, index) => ({
      id: msg.id || `msg-${index}`,
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content || msg.message || '',
      timestamp: new Date(msg.timestamp),
    }));
  }

  /**
   * Generate a title from the first user message
   */
  private generateTitle(messages: any[]): string {
    const firstUserMessage = messages?.find((m: any) => m.role === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content || firstUserMessage.message || '';
      return content.length > 50 ? content.substring(0, 50) + '...' : content;
    }
    return 'Untitled Conversation';
  }

  /**
   * Test the connection to the API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: API_CONFIG.DEFAULT_USER_ID,
          message: '', // Always empty as per API specification
          cic_hash: JSON.stringify(API_CONFIG.DEFAULT_CIC_HASH),
          username_hash: API_CONFIG.DEFAULT_USERNAME_HASH,
          refresh_conversation: true,
          grpc_port: API_CONFIG.GRPC_PORT,
          user_location: API_CONFIG.USER_LOCATION,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const chatService = new ChatService();
