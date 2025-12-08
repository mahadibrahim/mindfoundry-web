// =============================================================================
// Mind Foundry Messaging System - Type Definitions
// =============================================================================
// These types define the messaging data model for both parent and instructor
// portals. The Django backend should implement models matching these interfaces.
// =============================================================================

/**
 * Message thread types determine routing and context
 */
export type ThreadType = 
  | 'course'      // Question about a specific course → routes to instructor
  | 'schedule'    // Scheduling/attendance issues → routes to center admin
  | 'billing'     // Payment/billing questions → routes to support
  | 'general'     // General inquiries → routes to center director
  | 'support';    // Technical/platform issues → routes to support team

/**
 * Participant roles in a conversation
 */
export type ParticipantRole = 'parent' | 'instructor' | 'director' | 'support';

/**
 * Thread participant
 */
export interface ThreadParticipant {
  id: string;
  name: string;
  role: ParticipantRole;
  photoUrl?: string;
}

/**
 * Context for course-related threads
 */
export interface CourseContext {
  courseId: string;
  courseName: string;
  childId: string;
  childName: string;
  instructorId: string;
  instructorName: string;
}

/**
 * Context for center-related threads
 */
export interface CenterContext {
  centerId: string;
  centerName: string;
  directorId?: string;
  directorName?: string;
}

/**
 * Thread context varies by thread type
 */
export interface ThreadContext {
  // Course-specific context (for course threads)
  courseId?: string;
  courseName?: string;
  childId?: string;
  childName?: string;
  instructorId?: string;
  instructorName?: string;
  
  // Center-specific context
  centerId?: string;
  centerName?: string;
  directorId?: string;
  directorName?: string;
}

/**
 * Message attachment (images, files)
 */
export interface MessageAttachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  fileName: string;
  fileSize?: number; // bytes
  mimeType?: string;
}

/**
 * Individual message within a thread
 */
export interface Message {
  id: string;
  threadId: string;
  
  // Sender info
  senderId: string;
  senderName: string;
  senderRole: ParticipantRole;
  senderPhotoUrl?: string;
  
  // Content
  content: string;
  attachments?: MessageAttachment[];
  
  // Timestamps
  sentAt: string;      // ISO datetime
  readAt?: string;     // ISO datetime, null if unread
  editedAt?: string;   // ISO datetime if edited
  
  // Status
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

/**
 * Message thread (conversation)
 */
export interface MessageThread {
  id: string;
  type: ThreadType;
  
  // Context based on thread type
  context: ThreadContext;
  
  // Participants in this conversation
  participants: ThreadParticipant[];
  
  // Thread metadata
  subject?: string;           // Optional subject line
  createdAt: string;          // ISO datetime
  updatedAt: string;          // ISO datetime (last activity)
  
  // Last message preview
  lastMessage?: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    sentAt: string;
  };
  
  // Unread tracking (for current user)
  unreadCount: number;
  
  // Status
  status: 'active' | 'archived' | 'closed';
}

/**
 * Compose message input - what parent submits
 */
export interface ComposeMessageInput {
  threadType: ThreadType;
  subject?: string;
  content: string;
  
  // Context selection
  courseId?: string;  // Required for course threads
  childId?: string;   // Required for course threads
  centerId?: string;  // Required for center/schedule threads
}

/**
 * Notification preferences for a user
 */
export interface NotificationPreferences {
  email: boolean;
  emailAddress?: string;
  
  // Future: Telegram integration
  telegram: boolean;
  telegramChatId?: string;
  
  // Notification triggers
  notifyOnNewMessage: boolean;
  notifyOnReply: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;  // "22:00"
  quietHoursEnd?: string;    // "08:00"
}

/**
 * API response for thread list
 */
export interface ThreadListResponse {
  threads: MessageThread[];
  totalCount: number;
  unreadCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

/**
 * API response for messages in a thread
 */
export interface ThreadMessagesResponse {
  thread: MessageThread;
  messages: Message[];
  hasMore: boolean;
  nextCursor?: string;
}

// =============================================================================
// Routing Configuration
// =============================================================================
// This defines how messages are routed based on thread type.
// Backend should implement this logic.
// =============================================================================

export const THREAD_ROUTING: Record<ThreadType, {
  label: string;
  description: string;
  recipientRole: ParticipantRole;
  requiresCourse: boolean;
  requiresChild: boolean;
  icon: string;
}> = {
  course: {
    label: 'Course Question',
    description: 'Ask about curriculum, homework, or your child\'s progress',
    recipientRole: 'instructor',
    requiresCourse: true,
    requiresChild: true,
    icon: '📚',
  },
  schedule: {
    label: 'Scheduling',
    description: 'Reschedule, cancel, or ask about session times',
    recipientRole: 'director',
    requiresCourse: false,
    requiresChild: false,
    icon: '📅',
  },
  billing: {
    label: 'Billing & Payments',
    description: 'Questions about invoices, payments, or refunds',
    recipientRole: 'support',
    requiresCourse: false,
    requiresChild: false,
    icon: '💳',
  },
  general: {
    label: 'General Inquiry',
    description: 'Other questions about our programs or center',
    recipientRole: 'director',
    requiresCourse: false,
    requiresChild: false,
    icon: '💬',
  },
  support: {
    label: 'Technical Support',
    description: 'Issues with the app, login, or online classes',
    recipientRole: 'support',
    requiresCourse: false,
    requiresChild: false,
    icon: '🔧',
  },
};