import React, { useState, useEffect } from 'react';
import type { MessageThread, Message, ComposeMessageInput } from '../../types/messaging';
import type { Child } from '../../types/dashboard';
import MessageInbox from './MessageInbox';
import MessageThreadView from './MessageThread';
import ComposeMessage from './ComposeMessage';

interface MessagesPageProps {
  threads: MessageThread[];
  messagesMap: Record<string, Message[]>;
  children: Child[];
  currentUserId: string;
}

type ViewState = 
  | { mode: 'inbox' }
  | { mode: 'thread'; threadId: string }
  | { mode: 'compose' };

const MessagesPage: React.FC<MessagesPageProps> = ({
  threads,
  messagesMap,
  children,
  currentUserId,
}) => {
  const [view, setView] = useState<ViewState>({ mode: 'inbox' });
  const [localThreads, setLocalThreads] = useState(threads || []);
  const [localMessages, setLocalMessages] = useState(messagesMap || {});

  // Handle responsive layout
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const selectedThread = view.mode === 'thread' 
    ? localThreads.find(t => t.id === view.threadId) 
    : null;

  const selectedMessages = view.mode === 'thread' && selectedThread
    ? localMessages[selectedThread.id] || []
    : [];

  const handleSelectThread = (threadId: string) => {
    setView({ mode: 'thread', threadId });
    
    // Mark thread as read (mock implementation)
    setLocalThreads(prev => 
      prev.map(t => t.id === threadId ? { ...t, unreadCount: 0 } : t)
    );
  };

  const handleSendMessage = (content: string) => {
    if (!selectedThread) return;

    // Create new message (mock implementation)
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId: selectedThread.id,
      senderId: currentUserId,
      senderName: 'Michelle Thompson', // Would come from auth context
      senderRole: 'parent',
      content,
      sentAt: new Date().toISOString(),
      status: 'sending',
    };

    // Add to messages
    setLocalMessages(prev => ({
      ...prev,
      [selectedThread.id]: [...(prev[selectedThread.id] || []), newMessage],
    }));

    // Update thread
    setLocalThreads(prev =>
      prev.map(t =>
        t.id === selectedThread.id
          ? {
              ...t,
              updatedAt: new Date().toISOString(),
              lastMessage: {
                id: newMessage.id,
                senderId: newMessage.senderId,
                senderName: newMessage.senderName,
                content: newMessage.content,
                sentAt: newMessage.sentAt,
              },
            }
          : t
      )
    );

    // Simulate message being sent
    setTimeout(() => {
      setLocalMessages(prev => ({
        ...prev,
        [selectedThread.id]: prev[selectedThread.id].map(m =>
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        ),
      }));
    }, 1000);
  };

  const handleComposeNew = () => {
    setView({ mode: 'compose' });
  };

  const handleComposeSend = (input: ComposeMessageInput) => {
    // Create new thread (mock implementation)
    const newThreadId = `thread-${Date.now()}`;
    
    // Find recipient based on type and context
    let recipientName = 'Mind Foundry Support';
    let recipientId = 'support-001';
    let context: MessageThread['context'] = {};

    if (input.threadType === 'course' && input.courseId && input.childId) {
      const child = children.find(c => c.id === input.childId);
      const enrollment = child?.activeEnrollments?.find(e => e.course.id === input.courseId);
      if (enrollment) {
        recipientName = `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`;
        recipientId = enrollment.course.instructor.id;
        context = {
          courseId: enrollment.course.id,
          courseName: enrollment.course.title,
          childId: child!.id,
          childName: child!.firstName,
          instructorId: enrollment.course.instructor.id,
          instructorName: recipientName,
        };
      }
    }

    const newThread: MessageThread = {
      id: newThreadId,
      type: input.threadType,
      context,
      participants: [
        {
          id: currentUserId,
          name: 'Michelle Thompson',
          role: 'parent',
        },
        {
          id: recipientId,
          name: recipientName,
          role: input.threadType === 'course' ? 'instructor' : input.threadType === 'schedule' || input.threadType === 'general' ? 'director' : 'support',
        },
      ],
      subject: input.subject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: {
        id: `msg-${Date.now()}`,
        senderId: currentUserId,
        senderName: 'Michelle Thompson',
        content: input.content,
        sentAt: new Date().toISOString(),
      },
      unreadCount: 0,
      status: 'active',
    };

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId: newThreadId,
      senderId: currentUserId,
      senderName: 'Michelle Thompson',
      senderRole: 'parent',
      content: input.content,
      sentAt: new Date().toISOString(),
      status: 'delivered',
    };

    // Add new thread and message
    setLocalThreads(prev => [newThread, ...prev]);
    setLocalMessages(prev => ({
      ...prev,
      [newThreadId]: [newMessage],
    }));

    // Navigate to new thread
    setView({ mode: 'thread', threadId: newThreadId });
  };

  const handleBack = () => {
    setView({ mode: 'inbox' });
  };

  const handleCancelCompose = () => {
    setView({ mode: 'inbox' });
  };

  // Desktop Layout: Side-by-side
  if (!isMobile) {
    return (
      <div className="h-[calc(100vh-180px)] min-h-[600px]">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Inbox (left panel) */}
          <div className="col-span-4 h-full">
            <MessageInbox
              threads={localThreads}
              selectedThreadId={view.mode === 'thread' ? view.threadId : undefined}
              onSelectThread={handleSelectThread}
              onComposeNew={handleComposeNew}
            />
          </div>

          {/* Thread/Compose (right panel) */}
          <div className="col-span-8 h-full">
            {view.mode === 'compose' ? (
              <ComposeMessage
                children={children}
                onSend={handleComposeSend}
                onCancel={handleCancelCompose}
              />
            ) : selectedThread ? (
              <MessageThreadView
                thread={selectedThread}
                messages={selectedMessages}
                onSendMessage={handleSendMessage}
                onBack={handleBack}
                currentUserId={currentUserId}
              />
            ) : (
              <div className="h-full bg-white rounded-2xl border border-gray-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <MessageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 mb-4 max-w-sm">
                    Choose a thread from the left or start a new conversation
                  </p>
                  <button
                    onClick={handleComposeNew}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    New Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout: Stack views
  return (
    <div className="h-[calc(100vh-140px)] min-h-[500px]">
      {view.mode === 'inbox' && (
        <MessageInbox
          threads={localThreads}
          onSelectThread={handleSelectThread}
          onComposeNew={handleComposeNew}
        />
      )}

      {view.mode === 'thread' && selectedThread && (
        <MessageThreadView
          thread={selectedThread}
          messages={selectedMessages}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
          currentUserId={currentUserId}
        />
      )}

      {view.mode === 'compose' && (
        <ComposeMessage
          children={children}
          onSend={handleComposeSend}
          onCancel={handleCancelCompose}
        />
      )}
    </div>
  );
};

// Icon
const MessageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export default MessagesPage;