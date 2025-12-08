// =============================================================================
// Mind Foundry Parent Dashboard - Type Definitions
// =============================================================================
// These types define the contract between frontend and backend.
// Backend API responses should conform to these interfaces.
// =============================================================================

// -----------------------------------------------------------------------------
// Development Framework
// -----------------------------------------------------------------------------

/**
 * The six core capacities that Mind Foundry develops in children.
 * These are observable, universal, and developmental.
 */
export type Capacity =
  | 'curiosity'      // Asking questions, exploring, experimenting
  | 'reasoning'      // Logic, problem-solving, analytical thinking
  | 'expression'     // Communicating ideas, creativity
  | 'focus'          // Attention, persistence, following through
  | 'collaboration'  // Working with others, empathy
  | 'adaptability';  // Handling setbacks, trying new approaches

/**
 * Growth levels for each capacity (1-5 scale)
 */
export type GrowthLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Human-readable names for growth levels
 */
export const GrowthLevelNames: Record<GrowthLevel, string> = {
  1: 'Exploring',
  2: 'Developing',
  3: 'Practicing',
  4: 'Confident',
  5: 'Leading',
};

/**
 * Human-readable descriptions for each capacity
 */
export const CapacityDescriptions: Record<Capacity, { name: string; description: string }> = {
  curiosity: {
    name: 'Curiosity',
    description: 'Loves to discover how things work',
  },
  reasoning: {
    name: 'Reasoning',
    description: 'Thinks through challenges step by step',
  },
  expression: {
    name: 'Expression',
    description: 'Shares ideas with confidence and creativity',
  },
  focus: {
    name: 'Focus',
    description: 'Sticks with tasks and sees them through',
  },
  collaboration: {
    name: 'Collaboration',
    description: 'Works well with others and considers their perspectives',
  },
  adaptability: {
    name: 'Adaptability',
    description: 'Bounces back and tries different solutions',
  },
};

// -----------------------------------------------------------------------------
// Core Entities
// -----------------------------------------------------------------------------

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string;
  children: Child[];
  createdAt: string;
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  photoUrl?: string;
  enrolledSince: string;
  developmentProfile: DevelopmentProfile;
  activeEnrollments: Enrollment[];
}

export interface DevelopmentProfile {
  childId: string;
  capacities: CapacityGrowth[];
  recentBadges: Badge[];
  recentMilestones: Milestone[];
  updatedAt: string;
}

export interface CapacityGrowth {
  capacity: Capacity;
  currentLevel: GrowthLevel;
  previousLevel?: GrowthLevel;
  lastUpdated: string;
  trend: 'improving' | 'stable' | 'needs-attention';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  capacity: Capacity;
  level: GrowthLevel;
  earnedAt: string;
  courseId: string;
  courseName: string;
}

export interface Milestone {
  id: string;
  childId: string;
  achievedAt: string;
  type: 'badge' | 'level-up' | 'attendance' | 'custom';
  title: string;
  description: string;
  capacity?: Capacity;
  badgeId?: string;
}

// -----------------------------------------------------------------------------
// Courses & Enrollment
// -----------------------------------------------------------------------------

export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  title: string;
  bio?: string;
}

export interface Center {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  directorId: string;
  directorName: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  format: 'group' | 'one-on-one';
  delivery: 'in-person' | 'online';
  ageRange: { min: number; max: number };
  capacitiesDeveloped: Capacity[];
  instructor: Instructor;
  center?: Center; // null for online-only
  heroImage?: string;
}

export interface Enrollment {
  id: string;
  childId: string;
  courseId: string;
  course: Course;
  status: 'active' | 'completed' | 'upcoming' | 'paused' | 'cancelled';
  sessionsTotal: number;
  sessionsCompleted: number;
  enrolledAt: string;
  nextSession?: Session;
}

// -----------------------------------------------------------------------------
// Sessions
// -----------------------------------------------------------------------------

export type SessionStatus = 
  | 'scheduled' 
  | 'joinable'      // Within join window for online
  | 'in-progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no-show';

export interface Session {
  id: string;
  enrollmentId: string;
  enrollment?: Enrollment;
  scheduledAt: string;
  durationMinutes: number;
  status: SessionStatus;
  sessionNumber: number; // e.g., "Session 4 of 10"
  
  // Delivery details
  delivery: 'in-person' | 'online';
  location?: {
    centerId: string;
    centerName: string;
    address: string;
    room?: string;
  };
  online?: {
    wherebyRoomUrl: string;
    joinableFrom: string; // ISO timestamp, e.g., 10 minutes before start
    hostRoomUrl?: string; // instructor's host link (not shown to parents)
  };
  
  // Feedback (added after session)
  feedback?: SessionFeedback;
}

// -----------------------------------------------------------------------------
// Feedback (Developmental Record)
// -----------------------------------------------------------------------------

export type ObservationLevel = 'high' | 'moderate' | 'developing';

export interface CapacityObservation {
  capacity: Capacity;
  level: ObservationLevel;
  note?: string;
}

export interface SessionFeedback {
  id: string;
  sessionId: string;
  instructorId: string;
  instructorName: string;
  createdAt: string;
  
  // Structured observations
  capacityObservations: CapacityObservation[];
  
  // Narrative feedback
  summary: string;
  growthFocus?: string;
  highlights?: string[];
  
  // Parent reflection (optional, one-way)
  parentReflection?: {
    content: string;
    createdAt: string;
  };
}

// -----------------------------------------------------------------------------
// Messages (Administrative Communication)
// -----------------------------------------------------------------------------

export type MessageThreadType = 'course' | 'center' | 'support';
export type SenderRole = 'parent' | 'instructor' | 'center-director' | 'support';

export interface MessageThread {
  id: string;
  type: MessageThreadType;
  
  // Context determines recipient routing
  context: {
    courseId?: string;
    courseName?: string;
    instructorId?: string;
    instructorName?: string;
    centerId?: string;
    centerName?: string;
    childId?: string;
    childName?: string;
  };
  
  participants: {
    id: string;
    name: string;
    role: SenderRole;
    photoUrl?: string;
  }[];
  
  lastMessage?: Message;
  lastActivity: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: SenderRole;
  senderPhotoUrl?: string;
  content: string;
  sentAt: string;
  readAt?: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'document';
  url: string;
  name: string;
  sizeBytes?: number;
}

// -----------------------------------------------------------------------------
// Dashboard View Models
// -----------------------------------------------------------------------------

/**
 * Data needed for the Family Overview page
 */
export interface FamilyOverviewData {
  parent: Parent;
  children: ChildOverview[];
  upcomingSessions: SessionWithChild[];
  recentFeedback: FeedbackWithContext[];
  unreadMessageCount: number;
}

export interface ChildOverview {
  child: Child;
  nextSession?: Session;
  recentFeedbackCount: number;
  hasUnreadFeedback: boolean;
  topCapacity: {
    capacity: Capacity;
    level: GrowthLevel;
  };
}

export interface SessionWithChild extends Session {
  childId: string;
  childFirstName: string;
  courseName: string;
  instructorName: string;
}

export interface FeedbackWithContext extends SessionFeedback {
  childId: string;
  childFirstName: string;
  courseName: string;
  sessionDate: string;
}

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
