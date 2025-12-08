import React from 'react';
import type { MessageThread, ThreadType } from '../../types/messaging';

interface MessageInboxProps {
  threads: MessageThread[];
  selectedThreadId?: string;
  onSelectThread: (threadId: string) => void;
  onComposeNew: () => void;
}

const THREAD_TYPE_CONFIG: Record<ThreadType, { icon: string; color: string }> = {
  course: { icon: '📚', color: 'bg-blue-100 text-blue-700' },
  schedule: { icon: '📅', color: 'bg-purple-100 text-purple-700' },
  billing: { icon: '💳', color: 'bg-green-100 text-green-700' },
  general: { icon: '💬', color: 'bg-gray-100 text-gray-700' },
  support: { icon: '🔧', color: 'bg-orange-100 text-orange-700' },
};

const MessageInbox: React.FC<MessageInboxProps> = ({
  threads: threadsProp,
  selectedThreadId,
  onSelectThread,
  onComposeNew,
}) => {
  // Defensive: ensure threads is always an array
  const threads = threadsProp || [];
  
  const formatTimestamp = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getThreadTitle = (thread: MessageThread): string => {
    if (thread.context.courseName && thread.context.childName) {
      return `${thread.context.courseName} - ${thread.context.childName}`;
    }
    if (thread.subject) return thread.subject;
    if (thread.context.centerName) return thread.context.centerName;
    return 'Conversation';
  };

  const getRecipientName = (thread: MessageThread): string => {
    const other = thread.participants.find(p => p.role !== 'parent');
    return other?.name || 'Mind Foundry';
  };

  const getRecipientPhoto = (thread: MessageThread): string | undefined => {
    const other = thread.participants.find(p => p.role !== 'parent');
    return other?.photoUrl;
  };

  const totalUnread = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            {totalUnread > 0 && (
              <p className="text-sm text-gray-500">{totalUnread} unread</p>
            )}
          </div>
          <button
            onClick={onComposeNew}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">New Message</span>
          </button>
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <InboxIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No messages yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Start a conversation with an instructor or our team
            </p>
            <button
              onClick={onComposeNew}
              className="text-amber-600 font-medium hover:text-amber-700"
            >
              Send your first message →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {threads.map((thread) => {
              const typeConfig = THREAD_TYPE_CONFIG[thread.type];
              const isSelected = thread.id === selectedThreadId;
              const hasUnread = thread.unreadCount > 0;
              const recipientPhoto = getRecipientPhoto(thread);

              return (
                <button
                  key={thread.id}
                  onClick={() => onSelectThread(thread.id)}
                  className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                    isSelected ? 'bg-amber-50 hover:bg-amber-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0 relative">
                      {recipientPhoto ? (
                        <img
                          src={recipientPhoto}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {getRecipientName(thread).charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Unread indicator */}
                      {hasUnread && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {thread.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`font-semibold truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                            {getRecipientName(thread)}
                          </span>
                          <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                            {typeConfig.icon}
                          </span>
                        </div>
                        <span className="flex-shrink-0 text-xs text-gray-500">
                          {formatTimestamp(thread.updatedAt)}
                        </span>
                      </div>

                      <p className={`text-sm truncate mb-1 ${hasUnread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        {getThreadTitle(thread)}
                      </p>

                      {thread.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {thread.lastMessage.senderId === 'parent-001' && (
                            <span className="text-gray-400">You: </span>
                          )}
                          {thread.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Closed indicator */}
                  {thread.status === 'closed' && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      <span>Resolved</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const InboxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default MessageInbox;