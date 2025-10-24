import React from 'react';
import { Conversation } from '../types/conversation';
import { CheckCircle2, XCircle, Clock, MessageSquare } from 'lucide-react';

interface LogTableViewProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  isLoading: boolean;
}

export function LogTableView({ conversations, onSelectConversation, isLoading }: LogTableViewProps) {
  const formatTimestamp = (date: Date) => {
    // JavaScript Date automatically converts to local time
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const getTimezoneAbbr = () => {
    const date = new Date();
    const timezoneName = date.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop();
    return timezoneName || '';
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (isLoading) {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ 
          backgroundColor: '#f7f4ed',
        }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4"
          style={{ 
            borderBottom: '1px solid #d5d2cb',
          }}
        >
          <h2 
            className="font-['Rhymes_Display:Medium',_sans-serif] not-italic text-[20px] tracking-[-0.5px]"
            style={{ margin: 0, color: '#171717' }}
          >
            Conversation Logs
          </h2>
        </div>

        {/* Loading skeleton */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="mb-2 p-4 animate-pulse"
              style={{
                backgroundColor: '#e9e6df',
                borderRadius: '8px',
                height: '60px',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ 
          backgroundColor: '#f7f4ed',
        }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4"
          style={{ 
            borderBottom: '1px solid #d5d2cb',
          }}
        >
          <h2 
            className="font-['Rhymes_Display:Medium',_sans-serif] not-italic text-[20px] tracking-[-0.5px]"
            style={{ margin: 0, color: '#171717' }}
          >
            Conversation Logs
          </h2>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare 
              size={48} 
              style={{ 
                color: '#8e8b85',
                margin: '0 auto 1rem',
              }}
            />
            <p 
              className="font-['General_Sans:Medium',_sans-serif]"
              style={{ 
                color: '#8e8b85',
                margin: 0,
              }}
            >
              No conversations found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-full flex flex-col"
      style={{ 
        backgroundColor: '#f7f4ed',
      }}
    >
      {/* Header */}
      <div 
        className="px-6 py-4"
        style={{ 
          borderBottom: '1px solid #d5d2cb',
        }}
      >
        <h2 
          className="font-['Rhymes_Display:Medium',_sans-serif] not-italic text-[20px] tracking-[-0.5px]"
          style={{ margin: 0, color: '#171717' }}
        >
          Conversation Logs
        </h2>
        <p 
          className="font-['General_Sans:Regular',_sans-serif] text-[13px] mt-1"
          style={{ margin: '0.25rem 0 0 0', color: '#8e8b85' }}
        >
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Table Header */}
      <div 
        className="px-6 py-3 grid grid-cols-12 gap-4"
        style={{ 
          borderBottom: '1px solid #d5d2cb',
          backgroundColor: '#f7f4ed',
        }}
      >
        <div className="col-span-1">
          <span 
            className="font-['GT_Flexa_Mono:Medium',_monospace] text-[11px] uppercase tracking-[0.5px]"
            style={{ color: '#8e8b85' }}
          >
            Status
          </span>
        </div>
        <div className="col-span-2">
          <span 
            className="font-['GT_Flexa_Mono:Medium',_monospace] text-[11px] uppercase tracking-[0.5px]"
            style={{ color: '#8e8b85' }}
            title={`Local time (${getTimezoneAbbr()})`}
          >
            Time (Local)
          </span>
        </div>
        <div className="col-span-2">
          <span 
            className="font-['GT_Flexa_Mono:Medium',_monospace] text-[11px] uppercase tracking-[0.5px]"
            style={{ color: '#8e8b85' }}
          >
            User ID
          </span>
        </div>
        <div className="col-span-3">
          <span 
            className="font-['GT_Flexa_Mono:Medium',_monospace] text-[11px] uppercase tracking-[0.5px]"
            style={{ color: '#8e8b85' }}
          >
            Conversation
          </span>
        </div>
        <div className="col-span-2">
          <span 
            className="font-['GT_Flexa_Mono:Medium',_monospace] text-[11px] uppercase tracking-[0.5px]"
            style={{ color: '#8e8b85' }}
          >
            Latency
          </span>
        </div>
        <div className="col-span-2">
          <span 
            className="font-['GT_Flexa_Mono:Medium',_monospace] text-[11px] uppercase tracking-[0.5px]"
            style={{ color: '#8e8b85' }}
          >
            Messages
          </span>
        </div>
      </div>

      {/* Table Rows */}
      <div className="flex-1 overflow-auto">
        {conversations.map((conversation) => {
          const hasEvaluation = !!conversation.evaluation;
          const passed = conversation.evaluation?.pass;
          
          return (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className="px-6 py-3 grid grid-cols-12 gap-4 cursor-pointer transition-all hover:bg-opacity-50"
              style={{
                borderBottom: '1px solid #d5d2cb',
                backgroundColor: '#f7f4ed',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e9e6df';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f7f4ed';
              }}
            >
              {/* Status */}
              <div className="col-span-1 flex items-center">
                {hasEvaluation ? (
                  passed ? (
                    <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
                  ) : (
                    <XCircle size={16} style={{ color: '#dc2626' }} />
                  )
                ) : (
                  <Clock size={16} style={{ color: '#8e8b85' }} />
                )}
              </div>

              {/* Time */}
              <div className="col-span-2 flex flex-col justify-center">
                <span 
                  className="font-['GT_Flexa_Mono:Regular',_monospace] text-[12px]"
                  style={{ color: '#565449' }}
                >
                  {formatTimestamp(conversation.createdAt || conversation.date)}
                </span>
                <span 
                  className="font-['GT_Flexa_Mono:Regular',_monospace] text-[10px]"
                  style={{ color: '#8e8b85' }}
                >
                  {formatDate(conversation.createdAt || conversation.date)}
                </span>
              </div>

              {/* User ID */}
              <div className="col-span-2 flex items-center">
                <span 
                  className="font-['GT_Flexa_Mono:Regular',_monospace] text-[12px] truncate"
                  style={{ color: '#565449' }}
                  title={conversation.userId}
                >
                  {conversation.userId || '-'}
                </span>
              </div>

              {/* Conversation Title */}
              <div className="col-span-3 flex items-center">
                <span 
                  className="font-['General_Sans:Medium',_sans-serif] text-[14px] truncate"
                  style={{ color: '#171717' }}
                >
                  {conversation.title}
                </span>
              </div>

              {/* Latency */}
              <div className="col-span-2 flex items-center">
                <span 
                  className="font-['GT_Flexa_Mono:Regular',_monospace] text-[12px]"
                  style={{ color: '#565449' }}
                >
                  {formatDuration(conversation.evaluation?.latencyMs)}
                </span>
              </div>

              {/* Message Count */}
              <div className="col-span-2 flex items-center">
                <span 
                  className="font-['GT_Flexa_Mono:Regular',_monospace] text-[12px]"
                  style={{ color: '#565449' }}
                >
                  {conversation.messageCount || conversation.messages.length || '-'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
