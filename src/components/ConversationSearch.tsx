import React, { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { USER_PROFILES } from '../config/users';

interface ConversationSearchProps {
  onSearch: (forUserId: string, conversationId: string) => void;
  isLoading?: boolean;
  compact?: boolean;
}

export function ConversationSearch({ onSearch, isLoading, compact = false }: ConversationSearchProps) {
  const [forUserId, setForUserId] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [selectedUserKey, setSelectedUserKey] = useState<string>('');

  const handleSearch = () => {
    onSearch(forUserId.trim(), conversationId.trim());
  };

  const handleClear = () => {
    setForUserId('');
    setConversationId('');
    setSelectedUserKey('');
    onSearch('', '');
  };

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userKey = e.target.value;
    setSelectedUserKey(userKey);
    if (userKey) {
      const userId = USER_PROFILES[userKey as keyof typeof USER_PROFILES]?.userId || '';
      setForUserId(userId);
    } else {
      setForUserId('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const hasActiveFilters = forUserId.trim() !== '' || conversationId.trim() !== '';

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* User Dropdown */}
        <div className="w-36 flex-shrink-0">
          <div className="relative">
            <select
              value={selectedUserKey}
              onChange={handleUserSelect}
              disabled={isLoading}
              className="w-full appearance-none"
              style={{
                padding: '0.375rem 1.5rem 0.375rem 0.625rem',
                backgroundColor: '#f7f4ed',
                border: '1px solid #d5d2cb',
                borderRadius: '8px',
                color: selectedUserKey ? '#171717' : '#8e8b85',
                outline: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontFamily: "'General Sans', sans-serif",
                fontWeight: '400',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#565449';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d5d2cb';
              }}
            >
              <option value="">Select User</option>
              {Object.entries(USER_PROFILES).map(([key, profile]) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <ChevronDown 
              size={14} 
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#8e8b85' }}
            />
          </div>
        </div>

        {/* User ID Input */}
        <input
          type="text"
          value={forUserId}
          onChange={(e) => {
            setForUserId(e.target.value);
            setSelectedUserKey('');
          }}
          onKeyPress={handleKeyPress}
          placeholder="User ID"
          disabled={isLoading}
          className="flex-1 min-w-0"
          style={{
            padding: '0.375rem 0.625rem',
            backgroundColor: '#f7f4ed',
            border: '1px solid #d5d2cb',
            borderRadius: '8px',
            color: '#171717',
            outline: 'none',
            fontSize: '13px',
            fontFamily: "'General Sans', sans-serif",
            fontWeight: '400',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#565449';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d5d2cb';
          }}
        />

        {/* Conversation ID Input */}
        <input
          type="text"
          value={conversationId}
          onChange={(e) => setConversationId(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Conversation ID"
          disabled={isLoading}
          className="flex-1 min-w-0"
          style={{
            padding: '0.375rem 0.625rem',
            backgroundColor: '#f7f4ed',
            border: '1px solid #d5d2cb',
            borderRadius: '8px',
            color: '#171717',
            outline: 'none',
            fontSize: '13px',
            fontFamily: "'General Sans', sans-serif",
            fontWeight: '400',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#565449';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d5d2cb';
          }}
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="flex-shrink-0"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.75rem',
            backgroundColor: '#e9e6df',
            border: '1px solid #d5d2cb',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            color: '#171717',
            opacity: isLoading ? 0.6 : 1,
            fontSize: '13px',
            fontFamily: "'General Sans', sans-serif",
            fontWeight: '500',
          }}
        >
          <Search size={16} />
          Search
        </button>

        {/* Clear Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="flex-shrink-0"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              backgroundColor: '#e9e6df',
              border: '1px solid #d5d2cb',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              color: '#171717',
              opacity: isLoading ? 0.6 : 1,
              fontSize: '13px',
              fontFamily: "'General Sans', sans-serif",
              fontWeight: '500',
            }}
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      className="px-6 py-3 flex items-center gap-3"
      style={{ 
        backgroundColor: '#f7f4ed',
        borderBottom: '1px solid #d5d2cb',
      }}
    >
      <div className="flex-1 flex items-center gap-3">
        {/* User Dropdown */}
        <div className="w-48">
          <div className="relative">
            <select
              value={selectedUserKey}
              onChange={handleUserSelect}
              disabled={isLoading}
              className="w-full appearance-none"
              style={{
                padding: '0.5rem 2rem 0.5rem 0.75rem',
                backgroundColor: '#f7f4ed',
                border: '1px solid #d5d2cb',
                borderRadius: '12px',
                color: selectedUserKey ? '#171717' : '#8e8b85',
                outline: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontFamily: "'General Sans', sans-serif",
                fontWeight: '400',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#565449';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d5d2cb';
              }}
            >
              <option value="">Select User</option>
              {Object.entries(USER_PROFILES).map(([key, profile]) => (
                <option key={key} value={key}>
                  {key} ({profile.userId})
                </option>
              ))}
            </select>
            <ChevronDown 
              size={16} 
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#8e8b85' }}
            />
          </div>
        </div>

        {/* User ID Input */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={forUserId}
              onChange={(e) => {
                setForUserId(e.target.value);
                setSelectedUserKey(''); // Clear dropdown when typing manually
              }}
              onKeyPress={handleKeyPress}
              placeholder="Or enter User ID"
              disabled={isLoading}
              className="w-full"
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: '#f7f4ed',
                border: '1px solid #d5d2cb',
                borderRadius: '12px',
                color: '#171717',
                outline: 'none',
                fontSize: '14px',
                fontFamily: "'General Sans', sans-serif",
                fontWeight: '400',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#565449';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d5d2cb';
              }}
            />
          </div>
        </div>

        {/* Conversation ID Input */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={conversationId}
              onChange={(e) => setConversationId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Filter by Conversation ID"
              disabled={isLoading}
              className="w-full"
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: '#f7f4ed',
                border: '1px solid #d5d2cb',
                borderRadius: '12px',
                color: '#171717',
                outline: 'none',
                fontSize: '14px',
                fontFamily: "'General Sans', sans-serif",
                fontWeight: '400',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#565449';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d5d2cb';
              }}
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#e9e6df',
            border: '1px solid #d5d2cb',
            borderRadius: '12px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            color: '#171717',
            opacity: isLoading ? 0.6 : 1,
            fontSize: '14px',
            fontFamily: "'General Sans', sans-serif",
            fontWeight: '500',
          }}
        >
          <Search size={18} />
          Search
        </button>

        {/* Clear Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#e9e6df',
              border: '1px solid #d5d2cb',
              borderRadius: '12px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              color: '#171717',
              opacity: isLoading ? 0.6 : 1,
              fontSize: '14px',
              fontFamily: "'General Sans', sans-serif",
              fontWeight: '500',
            }}
          >
            <X size={18} />
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span 
            className="font-['GT_Flexa_Mono:Medium',_monospace] text-[11px] uppercase tracking-[0.5px]"
            style={{ color: '#8e8b85' }}
          >
            Filters Active:
          </span>
          {forUserId && (
            <span 
              className="font-['GT_Flexa_Mono:Regular',_monospace] text-[12px] px-2 py-1"
              style={{ 
                backgroundColor: '#e9e6df',
                borderRadius: '6px',
                color: '#171717',
              }}
            >
              User: {forUserId}
            </span>
          )}
          {conversationId && (
            <span 
              className="font-['GT_Flexa_Mono:Regular',_monospace] text-[12px] px-2 py-1"
              style={{ 
                backgroundColor: '#e9e6df',
                borderRadius: '6px',
                color: '#171717',
              }}
            >
              Conv: {conversationId.substring(0, 8)}...
            </span>
          )}
        </div>
      )}
    </div>
  );
}
