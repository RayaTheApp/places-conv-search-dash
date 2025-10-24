import { useState } from 'react';
import { Conversation } from '../types/conversation';
import { Textarea } from './ui/textarea';

interface NotesPanelProps {
  conversation: Conversation | null;
  onSaveNote: (conversationId: string, note: string) => void;
}

export function NotesPanel({ conversation, onSaveNote }: NotesPanelProps) {
  const [noteText, setNoteText] = useState(conversation?.note || '');

  // Update note text when conversation changes
  useState(() => {
    setNoteText(conversation?.note || '');
  });

  const handleBlur = () => {
    if (conversation && noteText !== conversation.note) {
      onSaveNote(conversation.id, noteText);
    }
  };

  if (!conversation) {
    return (
      <div 
        className="flex flex-col h-full" 
        style={{ 
          backgroundColor: '#f7f4ed',
          borderLeft: '1px solid #d5d2cb',
        }}
      >
        <div className="flex items-center justify-center h-full p-8">
          <p 
            className="font-['Inter:Regular',_sans-serif] font-normal leading-[22px] not-italic text-[16px] text-center"
            style={{ color: 'rgba(23,23,23,0.4)' }}
          >
            Select a conversation to add notes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-full" 
      style={{ 
        backgroundColor: '#f7f4ed',
        borderLeft: '1px solid #d5d2cb',
      }}
    >
      <div 
        className="p-6" 
        style={{ borderBottom: '1px solid #d5d2cb' }}
      >
        <h2 
          className="font-['Rhymes_Display:Medium',_sans-serif] leading-[38px] not-italic text-[28px] text-neutral-900 tracking-[-0.7px]" 
          style={{ margin: 0 }}
        >
          Notes
        </h2>
        <p 
          className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic text-[15px]" 
          style={{ color: 'rgba(23,23,23,0.7)', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}
        >
          Add your evaluation notes
        </p>
      </div>
      
      <div className="flex-1 p-6">
        <Textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onBlur={handleBlur}
          placeholder="Add notes about this conversation..."
          className="min-h-[200px] resize-none font-['Inter:Regular',_sans-serif] font-normal leading-[22px] not-italic text-[16px]"
          style={{
            backgroundColor: '#fff',
            border: '1px solid #d5d2cb',
            borderRadius: '12px',
            padding: '16px',
            color: '#171717',
          }}
        />
        
        {conversation.note && (
          <div className="mt-4">
            <p 
              className="font-['Inter:Regular',_sans-serif] font-normal leading-[20px] not-italic text-[15px]" 
              style={{ color: 'rgba(23,23,23,0.7)', margin: 0 }}
            >
              Last saved: {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
