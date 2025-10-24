import { useState } from 'react';
import { Code, MessageSquare, Clock, ChevronDown, Wrench, User, Bot, Settings, Copy, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { EvaluationData, ToolTraceEntry, ConversationMessageTrace } from '../types/conversation';

interface TraceViewProps {
  evaluation: EvaluationData;
  conversationId?: string;
  userId?: string;
}

function JSONViewer({ data, title }: { data: string | Record<string, unknown>; title?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  let jsonObject: Record<string, unknown>;
  try {
    jsonObject = typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    jsonObject = { raw: data };
  }

  const jsonString = JSON.stringify(jsonObject, null, 2);
  const preview = jsonString.length > 100 ? jsonString.substring(0, 100) + '...' : jsonString;

  const handleCopy = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(jsonString);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        // Fallback for environments where clipboard API is blocked
        const textarea = document.createElement('textarea');
        textarea.value = jsonString;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          }
        } finally {
          document.body.removeChild(textarea);
        }
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="font-['GT_Flexa_Mono',_monospace]">
      <div className="flex items-center justify-between mb-2">
        {title && (
          <div 
            className="text-[11px] uppercase tracking-[0.5px]"
            style={{ color: 'rgba(23,23,23,0.6)' }}
          >
            {title}
          </div>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded transition-colors hover:bg-neutral-200"
          style={{ color: isCopied ? '#22c55e' : 'rgba(23,23,23,0.6)' }}
          title="Copy to clipboard"
        >
          {isCopied ? (
            <>
              <Check size={14} />
              <span className="text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <div
        className="rounded-lg p-3 overflow-auto relative group"
        style={{
          backgroundColor: '#f7f4ed',
          border: '1px solid #d5d2cb',
        }}
      >
        <pre className="whitespace-pre-wrap break-words text-[12px] leading-[18px]" style={{ color: 'rgba(23,23,23,0.8)' }}>
          {isExpanded ? jsonString : preview}
        </pre>
        {jsonString.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-[12px] underline font-['Inter',_sans-serif]"
            style={{ color: '#171717' }}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
}

function ToolCallSection({ toolTrace }: { toolTrace: ToolTraceEntry[] }) {
  if (toolTrace.length === 0) {
    return (
      <div 
        className="p-8 rounded-xl text-center"
        style={{ 
          backgroundColor: '#f7f4ed',
          border: '1px solid #d5d2cb',
        }}
      >
        <Code size={32} className="mx-auto mb-3" style={{ color: 'rgba(23,23,23,0.4)' }} />
        <p className="font-['Inter',_sans-serif] text-[14px] leading-[20px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
          No tool calls in this conversation
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {toolTrace.map((tool, index) => (
        <div
          key={index}
          className="rounded-xl p-4"
          style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #fbbf24',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wrench size={16} style={{ color: '#f59e0b' }} />
              <span className="font-['GT_Flexa_Mono',_monospace] text-[14px] text-neutral-900">
                {tool.toolName}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} style={{ color: 'rgba(23,23,23,0.6)' }} />
              <span className="font-['GT_Flexa_Mono',_monospace] text-[12px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                {tool.executionTimeMs}ms
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <JSONViewer data={tool.arguments} title="Arguments" />
            <JSONViewer data={tool.result} title="Result" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MessageTraceSection({ fullMessages }: { fullMessages: ConversationMessageTrace[] }) {
  const [expandedSystemPrompts, setExpandedSystemPrompts] = useState<Set<number>>(new Set());

  const toggleSystemPrompt = (index: number) => {
    setExpandedSystemPrompts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getRoleIcon = (role: string) => {
    const lowerRole = role.toLowerCase();
    switch (lowerRole) {
      case 'system':
        return <Settings size={18} style={{ color: '#374151' }} />;
      case 'user':
        return <User size={18} style={{ color: '#1e40af' }} />;
      case 'assistant':
        return <Bot size={18} style={{ color: '#6d28d9' }} />;
      case 'tool':
        return <Wrench size={18} style={{ color: '#92400e' }} />;
      default:
        return <MessageSquare size={18} style={{ color: '#171717' }} />;
    }
  };

  const getRoleStyles = (role: string) => {
    const lowerRole = role.toLowerCase();
    switch (lowerRole) {
      case 'system':
        return {
          backgroundColor: '#e5e7eb',
          textColor: '#1f2937',
        };
      case 'user':
        return {
          backgroundColor: '#bfdbfe',
          textColor: '#1e3a8a',
        };
      case 'assistant':
        return {
          backgroundColor: '#ddd6fe',
          textColor: '#5b21b6',
        };
      case 'tool':
        return {
          backgroundColor: '#fde68a',
          textColor: '#78350f',
        };
      default:
        return {
          backgroundColor: '#f7f4ed',
          textColor: '#171717',
        };
    }
  };

  return (
    <div className="space-y-4">
      {fullMessages.map((msg, index) => {
        const isSystemPrompt = msg.role.toLowerCase() === 'system';
        const isExpanded = expandedSystemPrompts.has(index);
        const roleStyles = getRoleStyles(msg.role);

        return (
          <div
            key={index}
            className="rounded-xl p-4"
            style={{
              backgroundColor: '#f7f4ed',
              border: '1px solid #d5d2cb',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span 
                className="font-['GT_Flexa_Mono',_monospace] text-[11px] uppercase tracking-[0.5px] font-medium px-2 py-1 rounded inline-flex items-center gap-1.5"
                style={{ 
                  backgroundColor: roleStyles.backgroundColor,
                  color: roleStyles.textColor 
                }}
              >
                {getRoleIcon(msg.role)}
                {msg.role}
              </span>
              {msg.name && (
                <span className="font-['GT_Flexa_Mono',_monospace] text-[12px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                  {msg.name}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {msg.content && isSystemPrompt ? (
                <Collapsible open={isExpanded} onOpenChange={() => toggleSystemPrompt(index)}>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full">
                    <div 
                      className="text-[11px] uppercase tracking-[0.5px]"
                      style={{ color: 'rgba(23,23,23,0.6)' }}
                    >
                      System Prompt
                    </div>
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      style={{ color: 'rgba(23,23,23,0.6)' }}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <JSONViewer data={msg.content} />
                  </CollapsibleContent>
                </Collapsible>
              ) : msg.content ? (
                <JSONViewer 
                  data={msg.content} 
                  title="Content" 
                />
              ) : null}
              
              {msg.tool_calls && msg.tool_calls.length > 0 && (
                <div
                  className="rounded-lg p-3"
                  style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fbbf24',
                  }}
                >
                  <div 
                    className="text-[11px] uppercase tracking-[0.5px] mb-2 flex items-center gap-2"
                    style={{ color: '#92400e' }}
                  >
                    <Wrench size={14} style={{ color: '#f59e0b' }} />
                    Tool Calls
                  </div>
                  {msg.tool_calls.map((tc, tcIndex) => (
                    <div key={tcIndex} className="ml-3 mb-2 last:mb-0">
                      <div className="font-['GT_Flexa_Mono',_monospace] text-[12px] mb-1 flex items-center gap-2">
                        <span style={{ color: '#92400e' }}>{tc.function?.name || tc.name}</span>
                      </div>
                      <JSONViewer data={tc.function?.arguments || tc.arguments || {}} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CopyableField({ label, value }: { label: string; value: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          }
        } finally {
          document.body.removeChild(textarea);
        }
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      className="flex items-center justify-between p-3 rounded-lg"
      style={{
        backgroundColor: '#f7f4ed',
        border: '1px solid #d5d2cb',
      }}
    >
      <div className="flex-1 min-w-0 mr-3">
        <div 
          className="font-['GT_Flexa_Mono',_monospace] text-[11px] uppercase tracking-[0.5px] mb-1"
          style={{ color: 'rgba(23,23,23,0.6)' }}
        >
          {label}
        </div>
        <div 
          className="font-['GT_Flexa_Mono',_monospace] text-[13px] truncate"
          style={{ color: '#171717' }}
        >
          {value}
        </div>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors flex-shrink-0"
        style={{
          backgroundColor: isCopied ? '#22c55e' : '#e9e6df',
          border: '1px solid',
          borderColor: isCopied ? '#22c55e' : '#d5d2cb',
          color: isCopied ? '#fff' : '#171717',
        }}
        title={`Copy ${label}`}
      >
        {isCopied ? (
          <>
            <Check size={14} />
            <span className="font-['Inter',_sans-serif] text-[12px] font-medium">Copied</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span className="font-['Inter',_sans-serif] text-[12px] font-medium">Copy</span>
          </>
        )}
      </button>
    </div>
  );
}

export function TraceView({ evaluation, conversationId, userId }: TraceViewProps) {
  const formatMs = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-8">
        <h3 className="font-['Rhymes_Display',_sans-serif] text-[24px] leading-[28px] tracking-[-0.6px] text-neutral-900 mb-6">
          Conversation Trace
        </h3>

        {/* ID Fields */}
        {(conversationId || userId) && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {conversationId && (
              <CopyableField label="Conversation ID" value={conversationId} />
            )}
            {userId && (
              <CopyableField label="User ID" value={userId} />
            )}
          </div>
        )}

        {/* Metadata Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div 
            className="p-4 rounded-xl"
            style={{ 
              backgroundColor: '#f7f4ed',
              border: '1px solid #d5d2cb',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} style={{ color: 'rgba(23,23,23,0.6)' }} />
              <span className="font-['GT_Flexa_Mono',_monospace] text-[11px] uppercase tracking-[0.5px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                Latency
              </span>
            </div>
            <div className="font-['Inter',_sans-serif] text-[20px] leading-[24px] font-medium text-neutral-900">
              {evaluation.latencyMs !== undefined ? formatMs(evaluation.latencyMs) : 'N/A'}
            </div>
          </div>

          {evaluation.meta && (
            <>
              <div 
                className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: '#f7f4ed',
                  border: '1px solid #d5d2cb',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={16} style={{ color: 'rgba(23,23,23,0.6)' }} />
                  <span className="font-['GT_Flexa_Mono',_monospace] text-[11px] uppercase tracking-[0.5px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                    Tokens
                  </span>
                </div>
                <div className="font-['Inter',_sans-serif] text-[20px] leading-[24px] font-medium text-neutral-900">
                  {(evaluation.meta.tokensIn || 0) + (evaluation.meta.tokensOut || 0)}
                </div>
                <div className="font-['Inter',_sans-serif] text-[12px] leading-[16px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                  {evaluation.meta.tokensIn || 0} in · {evaluation.meta.tokensOut || 0} out
                </div>
              </div>

              <div 
                className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: '#f7f4ed',
                  border: '1px solid #d5d2cb',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-['GT_Flexa_Mono',_monospace] text-[11px] uppercase tracking-[0.5px]" style={{ color: 'rgba(23,23,23,0.6)' }}>
                    Model
                  </span>
                </div>
                <div className="font-['Inter',_sans-serif] text-[16px] leading-[20px] font-medium text-neutral-900">
                  {evaluation.meta.model || 'N/A'}
                </div>
              </div>
            </>
          )}
        </div>

        <Accordion type="multiple" defaultValue={['messages']} className="space-y-3">
          <AccordionItem 
            value="messages"
            className="rounded-xl"
            style={{
              backgroundColor: '#e9e6df',
              border: '1px solid #d5d2cb',
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} style={{ color: '#171717' }} />
                <span className="font-['Inter',_sans-serif] text-[15px] leading-[20px] font-medium text-neutral-900">
                  Full Message Trace
                </span>
                <Badge variant="outline" className="font-['GT_Flexa_Mono',_monospace] text-[11px]">
                  {evaluation.fullMessages?.length || 0}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <MessageTraceSection fullMessages={evaluation.fullMessages || []} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem 
            value="tools"
            className="rounded-xl"
            style={{
              backgroundColor: '#e9e6df',
              border: '1px solid #d5d2cb',
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <Wrench size={18} style={{ color: '#f59e0b' }} />
                <span className="font-['Inter',_sans-serif] text-[15px] leading-[20px] font-medium text-neutral-900">
                  Tool Calls
                </span>
                <Badge variant="outline" className="font-['GT_Flexa_Mono',_monospace] text-[11px]">
                  {evaluation.toolTrace?.length || 0}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ToolCallSection toolTrace={evaluation.toolTrace || []} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  );
}
