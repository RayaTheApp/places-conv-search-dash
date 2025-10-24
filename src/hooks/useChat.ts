import { useState, useCallback } from 'react';
import { chatService } from '../services/chatService';
import { Conversation } from '../types/conversation';
import { API_CONFIG } from '../config/api';

interface UseChatOptions {
  userId?: string;
  cicHash?: Record<string, number>;
  usernameHash?: Record<string, any>;
  refreshConversation?: boolean;
  grpcPort?: number;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface LatestConversation {
  conversation_id: string;
  conversation_title: string;
  user_id: string;
}

interface UseChatReturn {
  fetchConversation: (conversationId?: string) => Promise<any>;
  fetchFullConversation: (
    conversationId: string, 
    userId: string, 
    cicHash: Record<string, number>,
    usernameHash?: Record<string, any>,
    grpcPort?: number,
    userLocation?: { latitude: number; longitude: number }
  ) => Promise<Conversation>;
  fetchConversations: () => Promise<Conversation[]>;
  fetchRecentConversations: (limit?: number, offset?: number, forUserId?: string, conversationId?: string) => Promise<LatestConversation[]>;
  runEvaluation: (conversationId: string) => Promise<{
    conversationId: string;
    evalResult: any;
    cached: boolean;
    cacheAge?: number;
  }>;
  testConnection: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * React hook for interacting with the chat API
 */
export function useChat(options: UseChatOptions): UseChatReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    userId = API_CONFIG.DEFAULT_USER_ID,
    cicHash = API_CONFIG.DEFAULT_CIC_HASH,
    usernameHash = API_CONFIG.DEFAULT_USERNAME_HASH,
    refreshConversation = true,
    grpcPort = API_CONFIG.GRPC_PORT,
    userLocation = API_CONFIG.USER_LOCATION,
  } = options;

  const fetchConversation = useCallback(
    async (conversationId?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await chatService.fetchConversation(
          userId,
          conversationId,
          cicHash,
          usernameHash,
          refreshConversation,
          grpcPort,
          userLocation
        );
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversation';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, cicHash, usernameHash, refreshConversation, grpcPort, userLocation]
  );

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const conversations = await chatService.fetchConversations(userId);
      return conversations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversations';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchRecentConversations = useCallback(async (
    limit?: number, 
    offset?: number,
    forUserId?: string,
    conversationId?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const conversations = await chatService.fetchRecentConversations(
        userId,
        forUserId,
        conversationId,
        limit,
        offset,
        grpcPort
      );
      return conversations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recent conversations';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, grpcPort]);

  const testConnection = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isConnected = await chatService.testConnection();
      if (!isConnected) {
        setError('Unable to connect to chat API');
      }
      return isConnected;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFullConversation = useCallback(
    async (
      conversationId: string, 
      userId: string, 
      cicHash: Record<string, number>,
      usernameHash?: Record<string, any>,
      grpcPort?: number,
      userLocation?: { latitude: number; longitude: number }
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const conversation = await chatService.fetchFullConversation(
          conversationId,
          userId,
          cicHash,
          usernameHash,
          grpcPort,
          userLocation
        );
        return conversation;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch full conversation';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const runEvaluation = useCallback(
    async (conversationId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await chatService.runEvaluation(conversationId);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to run evaluation';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    fetchConversation,
    fetchFullConversation,
    fetchConversations,
    fetchRecentConversations,
    runEvaluation,
    testConnection,
    isLoading,
    error,
    clearError,
  };
}
