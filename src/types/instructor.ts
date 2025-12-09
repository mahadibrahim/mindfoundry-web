// =============================================================================
// Mind Foundry Instructor Dashboard - Type Definitions
// =============================================================================
// These types extend the existing dashboard types for instructor-specific needs.
// Import shared types from '../types/dashboard' in your actual project.
// =============================================================================

// -----------------------------------------------------------------------------
// Re-export shared types (in actual project, import from dashboard.ts)
// -----------------------------------------------------------------------------

export type Capacity =
  | 'curiosity'
  | 'reasoning'
  | 'expression'
  | 'focus'
  | 'collaboration'
  | 'adaptability';

export type GrowthLevel = 1 | 2 | 3 | 4 | 5;

export type SessionStatus =
  | 'scheduled'
  | 'joinable'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show';

// -----------------------------------------------------------------------------
// Instructor Core Types
// -----------------------------------------------------------------------------

export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string;
  title: string;
  bio?: string;
  qualifications: InstructorQualification[];
  centers: string[]; // center IDs where they can teach
  createdAt: string;
}

export interface InstructorQualification {
  subjects: string[]; // e.g., ['python', 'scratch', 'web-development']
  ageRanges: { min: number; max: number }[];
  deliveryTypes: ('online' | 'in-person')[];
  formats: ('group' | 'one-on-one')[];
}

// -----------------------------------------------------------------------------
// Session Types (Instructor View)
// -----------------------------------------------------------------------------

export type InstructorSessionStatus =
  | 'assigned'        // Admin assigned, instructor confirmed
  | 'pending'         // Assigned but not yet confirmed
  | 'coverage-needed' // Original instructor can't make it
  | 'available'       // Open for pickup
  | 'completed'       // Done with wrap-up
  | 'wrap-up-pending'; // Session done, wrap-up not complete

export interface InstructorSession {
  id: string;
  courseId: string;
  courseName: string;
  courseHeroImage?: string;
  
  // Schedule
  scheduledAt: string;
  durationMinutes: number;
  wrapUpMinutes: number;
  instructionEndTime: string; // calculated: scheduledAt + (duration - wrapUp)
  
  // Format
  format: 'group' | 'one-on-one';
  delivery: 'online' | 'in-person';
  sessionNumber: number;
  totalSessions: number;
  
  // Status
  status: InstructorSessionStatus;
  assignedAt?: string;
  confirmedAt?: string;
  
  // Location (for in-person)
  location?: {
    centerId: string;
    centerName: string;
    address: string;
    room?: string;
  };
  
  // Online (for virtual)
  online?: {
    hostRoomUrl: string; // instructor's host link with roomKey
    participantRoomUrl: string;
    joinableFrom: string;
  };
  
  // Students
  students: StudentContext[];
  
  // Materials
  materials?: CourseMaterial[];
  
  // After completion
  wrapUp?: SessionWrapUp;
}

export interface StudentContext {
  childId: string;
  firstName: string;
  lastName: string;
  age: number;
  photoUrl?: string;
  enrollmentId: string;
  
  // Recent context for preparation
  recentCapacities?: {
    capacity: Capacity;
    level: 'strong' | 'developing' | 'not-observed';
    trend: 'improving' | 'stable' | 'needs-attention';
  }[];
  previousSessionSummary?: string;
  parentNotes?: string;
  
  // Attendance for this session (filled during wrap-up)
  attendance?: StudentAttendance;
}

// -----------------------------------------------------------------------------
// Course Materials
// -----------------------------------------------------------------------------

export type MaterialType =
  | 'lesson-plan'
  | 'worksheet'
  | 'slides'
  | 'activity-guide'
  | 'badge-criteria'
  | 'video'
  | 'reference';

export interface CourseMaterial {
  id: string;
  courseId: string;
  sessionNumber?: number; // null = applies to whole course
  title: string;
  description?: string;
  type: MaterialType;
  url: string;
  fileType?: string; // pdf, docx, etc.
  instructorOnly: boolean;
}

// -----------------------------------------------------------------------------
// Artifacts
// -----------------------------------------------------------------------------

export type ArtifactType =
  | 'code'
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'quiz-result'
  | 'project';

export type ArtifactStatus =
  | 'submitted'
  | 'under-review'
  | 'approved'
  | 'needs-revision'
  | 'skipped'; // instructor skipped in wrap-up, will review later

export interface Artifact {
  id: string;
  childId: string;
  childFirstName: string;
  courseId: string;
  courseName: string;
  sessionId?: string;
  sessionNumber?: number;
  
  // What was submitted
  type: ArtifactType;
  title: string;
  description?: string;
  files: ArtifactFile[];
  
  // Submission
  submittedAt: string;
  submittedBy: 'student' | 'parent' | 'instructor';
  
  // Review
  status: ArtifactStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  instructorFeedback?: string;
  
  // Badge connection
  contributesToBadges?: string[]; // badge IDs this can count toward
}

export interface ArtifactFile {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  thumbnailUrl?: string;
}

// -----------------------------------------------------------------------------
// Wrap-Up Flow
// -----------------------------------------------------------------------------

export type AttendanceStatus = 'attended' | 'no-show' | 'left-early';
export type ObservationLevel = 'strong' | 'developing' | 'not-observed';

export interface StudentAttendance {
  childId: string;
  status: AttendanceStatus;
  leftEarlyAt?: string;
  notes?: string;
}

export interface CapacityObservation {
  capacity: Capacity;
  level: ObservationLevel;
}

export interface StudentObservations {
  childId: string;
  capacityObservations: CapacityObservation[];
  additionalNotes?: string;
}

export interface ArtifactReviewAction {
  artifactId: string;
  decision: 'approved' | 'needs-revision' | 'skipped';
  feedback?: string;
  reviewedAt: string;
}

export interface SessionWrapUp {
  sessionId: string;
  instructorId: string;
  
  // Step 1: Attendance
  attendance: StudentAttendance[];
  
  // Step 2: Artifacts
  artifactReviews: ArtifactReviewAction[];
  
  // Step 3: Observations
  observations: StudentObservations[];
  
  // Step 4: Summary
  summary: string;
  
  // Meta
  startedAt: string;
  completedAt?: string;
  status: 'in-progress' | 'completed';
}

// -----------------------------------------------------------------------------
// Payment / Earnings
// -----------------------------------------------------------------------------

export type PayableActivity =
  | 'group-session-online'
  | 'group-session-inperson'
  | 'one-on-one-online'
  | 'one-on-one-inperson'
  | 'coverage-bonus'
  | 'training-session';

export interface ActivityRate {
  activity: PayableActivity;
  baseRate: number; // cents
  currency: 'USD';
  durationMinutes: number;
  includesWrapUp: boolean;
}

export interface EarningsEntry {
  id: string;
  sessionId: string;
  activity: PayableActivity;
  amount: number; // cents
  currency: 'USD';
  earnedAt: string;
  status: 'pending' | 'approved' | 'paid';
  payPeriodId?: string;
}

export interface PayPeriod {
  id: string;
  startDate: string;
  endDate: string;
  status: 'open' | 'processing' | 'paid';
  totalEarned: number;
  sessionCount: number;
  paidAt?: string;
}

// -----------------------------------------------------------------------------
// Dashboard Aggregates
// -----------------------------------------------------------------------------

export interface InstructorDashboardData {
  instructor: Instructor;
  todaySessions: InstructorSession[];
  upcomingSessions: InstructorSession[];
  wrapUpPending: InstructorSession[];
  pendingArtifacts: Artifact[];
  availableSessions: InstructorSession[]; // for pickup
  currentPayPeriod: PayPeriod;
  unreadMessageCount: number;
}

export interface ScheduleViewData {
  sessions: InstructorSession[];
  dateRange: { start: string; end: string };
}

// -----------------------------------------------------------------------------
// Capacity Display Helpers
// -----------------------------------------------------------------------------

export const CAPACITY_CONFIG: Record<Capacity, {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  curiosity: {
    label: 'Curiosity',
    emoji: '🔍',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    description: 'Asked questions, explored beyond the lesson',
  },
  reasoning: {
    label: 'Reasoning',
    emoji: '🧩',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    description: 'Solved problems methodically, debugged independently',
  },
  expression: {
    label: 'Expression',
    emoji: '💬',
    color: 'text-pink-700',
    bgColor: 'bg-pink-100',
    description: 'Shared ideas clearly, explained their thinking',
  },
  focus: {
    label: 'Focus',
    emoji: '🎯',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    description: 'Stayed on task, worked through challenges',
  },
  collaboration: {
    label: 'Collaboration',
    emoji: '🤝',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: 'Worked well with others, offered help',
  },
  adaptability: {
    label: 'Adaptability',
    emoji: '🌱',
    color: 'text-teal-700',
    bgColor: 'bg-teal-100',
    description: 'Tried different approaches, handled setbacks',
  },
};

export const OBSERVATION_LEVELS: Record<ObservationLevel, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  strong: {
    label: 'Strong',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  developing: {
    label: 'Developing',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  'not-observed': {
    label: 'Not Observed',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
  },
};