/**
 * Utilities for persisting chat state to localStorage
 */

export interface ChatConfig {
  grpcPort: number;
  userId: string;
  userLocation: { latitude: number; longitude: number };
  cicHash: Record<string, number>;
  usernameHash: Record<string, any>;
  // UI state for the config panel
  selectedUser?: string;
  selectedLocation?: string;
}

export interface ChatState {
  currentConversationId: string | null;
  config: ChatConfig;
  activeTab: 'conversation' | 'trace' | 'evaluation';
}

const STORAGE_KEY = 'conversation-evaluator-chat-state';

export const saveChatState = (state: ChatState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save chat state to localStorage:', error);
  }
};

export const loadChatState = (): ChatState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load chat state from localStorage:', error);
    return null;
  }
};

export const clearChatState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear chat state from localStorage:', error);
  }
};

// Helper to save just the conversation ID
export const saveCurrentConversation = (conversationId: string | null): void => {
  const state = loadChatState();
  if (state) {
    saveChatState({ ...state, currentConversationId: conversationId });
  }
};

// Helper to save just the config
export const saveChatConfig = (config: ChatConfig): void => {
  const state = loadChatState();
  if (state) {
    saveChatState({ ...state, config });
  }
};

// Helper to save just the active tab
export const saveActiveTab = (activeTab: 'conversation' | 'trace' | 'evaluation'): void => {
  const state = loadChatState();
  if (state) {
    saveChatState({ ...state, activeTab });
  }
};
