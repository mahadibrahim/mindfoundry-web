import React, { useState, useRef, useEffect } from 'react';
import type { MessageThread as ThreadType, Message, ThreadType as ThreadCategory } from '../../types/messaging';

interface MessageThreadProps {
  thread: ThreadType;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBack: () => void;
  currentUserId: string;
}

const THREAD_TYPE_LABELS: Record<ThreadCategory, string> = {
  course: 'Course Question',
  schedule: 'Scheduling',
  billing: 'Billing',
  general: 'General',
  support: 'Support',
};

const MessageThread: React.FC<MessageThreadProps> = ({
  thread,
  messages,
  onSendMessage,
  onBack,
  currentUserId,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    onSendMessage(newMessage.trim());
    setNewMessage('');
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatMessageDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Group messages by date
  const safeMessages = messages || [];
  const groupedMessages = safeMessages.reduce((groups, message) => {
    const date = formatMessageDate(message.sentAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  const getRecipient = () => {
    return thread.participants.find(p => p.id !== currentUserId);
  };

  const recipient = getRecipient();

  const getContextLine = (): string => {
    if (thread.context.courseName && thread.context.childName) {
      return `${thread.context.courseName} • ${thread.context.childName}`;
    }
    if (thread.subject) return thread.subject;
    return THREAD_TYPE_LABELS[thread.type];
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          {/* Back Button (mobile) */}
          <button
            onClick={onBack}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>

          {/* Recipient Info */}
          {recipient?.photoUrl ? (
            <img
              src={recipient.photoUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white font-semibold">
                {recipient?.name.charAt(0) || 'M'}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {recipient?.name || 'Mind Foundry'}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {getContextLine()}
            </p>
          </div>

          {/* Status Badge */}
          {thread.status === 'closed' && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              Resolved
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Divider */}
            <div className="flex items-center justify-center mb-4">
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-500 shadow-sm">
                {date}
              </span>
            </div>

            {/* Messages for this date */}
            <div className="space-y-3">
              {dateMessages.map((message, idx) => {
                const isOwn = message.senderId === currentUserId;
                const showAvatar = !isOwn && (
                  idx === 0 || 
                  dateMessages[idx - 1]?.senderId !== message.senderId
                );
                const isLastInGroup = (
                  idx === dateMessages.length - 1 ||
                  dateMessages[idx + 1]?.senderId !== message.senderId
                );

                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Avatar (other person) */}
                    {!isOwn && (
                      <div className="w-8 flex-shrink-0">
                        {showAvatar && message.senderPhotoUrl ? (
                          <img
                            src={message.senderPhotoUrl}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : showAvatar ? (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {message.senderName.charAt(0)}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`max-w-[75%] ${isOwn ? 'order-1' : ''}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          isOwn
                            ? 'bg-amber-500 text-white rounded-br-md'
                            : 'bg-white text-gray-900 shadow-sm rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>

                      {/* Timestamp & Status (show on last in group) */}
                      {isLastInGroup && (
                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start pl-1'}`}>
                          <span className="text-xs text-gray-400">
                            {formatMessageTime(message.sentAt)}
                          </span>
                          {isOwn && (
                            <span className="text-xs text-gray-400">
                              {message.status === 'read' && '✓✓'}
                              {message.status === 'delivered' && '✓'}
                              {message.status === 'sending' && '○'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {thread.status !== 'closed' ? (
        <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors text-sm"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending}
              className={`flex-shrink-0 p-3 rounded-xl transition-all ${
                newMessage.trim()
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      ) : (
        <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-sm text-gray-500">
            This conversation has been resolved.
          </p>
          <button className="text-sm text-amber-600 font-medium hover:text-amber-700 mt-1">
            Start a new conversation →
          </button>
        </div>
      )}
    </div>
  );
};

// Icons
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export default MessageThread;