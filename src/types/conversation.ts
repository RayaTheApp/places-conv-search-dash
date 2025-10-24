export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/** Tool trace entry from execution */
export interface ToolTraceEntry {
  toolName: string;
  arguments: string; // JSON string of tool arguments
  result: string; // JSON string of tool result
  executionTimeMs: number;
}

/**
 * Conversation message trace for debugging
 */
export interface ConversationMessageTrace {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | Record<string, unknown>;
  name?: string; // For tool messages
  tool_calls?: Array<{
    id?: string;
    type?: string;
    function?: {
      name: string;
      arguments: string | Record<string, unknown>;
    };
    name?: string;
    arguments?: string | Record<string, unknown>;
  }>;
  tool_call_id?: string; // For tool result messages
}

/** Judge result */
export interface JudgeResult {
  judgeId: string;
  score: number; // 0-1
  rationale: string;
  pass: boolean;
  cached: boolean;
}

/** Chat evaluation validation result */
export interface ChatEvalValidationResult {
  name: string;
  pass: boolean;
  errors: string[];
}

/** Evaluation data for a conversation */
export interface EvaluationData {
  pass: boolean;
  latencyMs: number;
  validationResults: ChatEvalValidationResult[];
  judgeResults: JudgeResult[];
  toolTrace: ToolTraceEntry[];
  fullMessages: ConversationMessageTrace[];
  meta: {
    tokensIn?: number;
    tokensOut?: number;
    latencyMs: number;
    model: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  date: Date;
  messages: Message[];
  note: string;
  score?: number;
  tags?: string[];
  evaluation?: EvaluationData;
  trace?: ConversationMessageTrace[];
  metadata?: {
    isTerminal?: boolean;
    is_terminal?: boolean;
    [key: string]: any;
  };
  userId?: string;
  createdAt?: Date;
  messageCount?: number;
}
