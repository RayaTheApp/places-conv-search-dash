import { useEffect, useRef, useState, useCallback } from 'react';
import { API_CONFIG } from '../config/api';

interface PollingOptions {
  conversationId: string | null;
  userId: string;
  cicHash: Record<string, number>;
  enabled: boolean;
  onUpdate?: (data: any) => void;
  onComplete?: (data: any) => void;
  pollInterval?: number;
  maxAttempts?: number;
}

interface PollingState {
  isPolling: boolean;
  isComplete: boolean;
  error: string | null;
  attempts: number;
}

/**
 * Hook for polling the conversation endpoint to get live updates
 * Polls every second until conversation reaches terminal state
 */
export function useChatPolling({
  conversationId,
  userId,
  cicHash,
  enabled,
  onUpdate,
  onComplete,
  pollInterval = 1000, // Poll every 1 second
  maxAttempts = 60, // Stop after 60 seconds
}: PollingOptions) {
  const [state, setState] = useState<PollingState>({
    isPolling: false,
    isComplete: false,
    error: null,
    attempts: 0,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const attemptsRef = useRef(0);
  const onUpdateRef = useRef(onUpdate);
  const onCompleteRef = useRef(onComplete);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stopPolling = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState(prev => ({ ...prev, isPolling: false }));
  }, []);

  // Start polling when enabled and conversation ID is set
  useEffect(() => {
    if (!enabled || !conversationId) {
      stopPolling();
      return;
    }

    // Reset state for new conversation
    attemptsRef.current = 0;
    isMountedRef.current = true;
    setState({
      isPolling: true,
      isComplete: false,
      error: null,
      attempts: 0,
    });

    console.log('Starting to poll conversation:', conversationId);

    const poll = async () => {
      if (!conversationId || !isMountedRef.current || attemptsRef.current >= maxAttempts) {
        stopPolling();
        return;
      }

      try {
        attemptsRef.current++;
        console.log(`Polling attempt ${attemptsRef.current} for conversation ${conversationId}`);
        setState(prev => ({ ...prev, attempts: attemptsRef.current }));

        // Poll the /chat endpoint with conversation_id but NO message field
        const requestBody = {
          user_id: userId,
          conversation_id: conversationId,
          cic_hash: JSON.stringify(cicHash),
          // NO message field = refresh/poll request
        };

        const url = `${API_CONFIG.BASE_URL}/chat`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`Failed to poll conversation: ${response.status}`);
        }

        const data = await response.json();

        if (!isMountedRef.current) return;

        // Call update callback with latest data
        onUpdateRef.current?.(data);

        // Check if conversation is complete (terminal state)
        // Check both is_terminal_response and state fields
        const isTerminal = data.is_terminal_response || data.state === 'COMPLETE' || data.state === 'ERROR';

        if (isTerminal) {
          console.log('Conversation reached terminal state:', data.state);
          setState(prev => ({ ...prev, isPolling: false, isComplete: true }));
          onCompleteRef.current?.(data);
          stopPolling();
          return;
        }

        // Continue polling if not complete
        if (isMountedRef.current && attemptsRef.current < maxAttempts) {
          timeoutRef.current = setTimeout(poll, pollInterval);
        } else {
          stopPolling();
        }

      } catch (error) {
        console.error('Polling error:', error);
        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            error: error instanceof Error ? error.message : 'Polling failed',
            isPolling: false,
          }));
        }
        stopPolling();
      }
    };

    // Start the first poll
    poll();

    // Cleanup on unmount or when dependencies change
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [enabled, conversationId, userId, cicHash, maxAttempts, pollInterval, stopPolling]);

  // Update mounted ref
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    stopPolling,
  };
}
