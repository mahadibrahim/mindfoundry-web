// =============================================================================
// Mind Foundry Instructor Dashboard - Mock Data
// =============================================================================
// Realistic sample data for development and testing.
// Replace with actual API calls in production.
// =============================================================================

import type {
  Instructor,
  InstructorSession,
  StudentContext,
  CourseMaterial,
  Artifact,
  PayPeriod,
  EarningsEntry,
  InstructorDashboardData,
  ActivityRate,
} from '../types/instructor';

// -----------------------------------------------------------------------------
// Date Helpers
// -----------------------------------------------------------------------------

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const addHours = (date: Date, hours: number) => new Date(date.getTime() + hours * 60 * 60 * 1000);
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60 * 1000);

// -----------------------------------------------------------------------------
// Current Instructor
// -----------------------------------------------------------------------------

export const mockInstructor: Instructor = {
  id: 'inst-001',
  firstName: 'Marcus',
  lastName: 'Chen',
  email: 'marcus.chen@mindfoundry.com',
  phoneNumber: '(555) 234-5678',
  photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  title: 'Lead Coding Instructor',
  bio: '10+ years teaching programming to young learners. Specializing in Python, Scratch, and web development.',
  qualifications: [{
    subjects: ['python', 'scratch', 'web-development', 'game-design'],
    ageRanges: [{ min: 8, max: 16 }],
    deliveryTypes: ['online', 'in-person'],
    formats: ['group', 'one-on-one'],
  }],
  centers: ['center-001'],
  createdAt: '2023-06-15T00:00:00Z',
};

// -----------------------------------------------------------------------------
// Students (Context for Sessions)
// -----------------------------------------------------------------------------

const studentJamie: StudentContext = {
  childId: 'child-001',
  firstName: 'Jamie',
  lastName: 'Thompson',
  age: 10,
  photoUrl: 'https://images.unsplash.com/photo-1595454223600-91fbea0f0090?w=100&h=100&fit=crop&crop=face',
  enrollmentId: 'enroll-001',
  recentCapacities: [
    { capacity: 'reasoning', level: 'strong', trend: 'improving' },
    { capacity: 'focus', level: 'developing', trend: 'stable' },
    { capacity: 'curiosity', level: 'strong', trend: 'stable' },
  ],
  previousSessionSummary: 'Made great progress with loops. Showed strong debugging instincts.',
  parentNotes: 'Jamie has been excited about the spiral project all week!',
};

const studentRiley: StudentContext = {
  childId: 'child-002',
  firstName: 'Riley',
  lastName: 'Thompson',
  age: 7,
  photoUrl: 'https://images.unsplash.com/photo-1595454223600-91fbea0f0090?w=100&h=100&fit=crop&crop=face',
  enrollmentId: 'enroll-003',
  recentCapacities: [
    { capacity: 'expression', level: 'strong', trend: 'stable' },
    { capacity: 'collaboration', level: 'developing', trend: 'improving' },
  ],
  previousSessionSummary: 'Loved the animation project. Needs help with sequence logic.',
};

const studentAlex: StudentContext = {
  childId: 'child-003',
  firstName: 'Alex',
  lastName: 'Martinez',
  age: 12,
  photoUrl: 'https://images.unsplash.com/photo-1595454223600-91fbea0f0090?w=100&h=100&fit=crop&crop=face',
  enrollmentId: 'enroll-004',
  recentCapacities: [
    { capacity: 'reasoning', level: 'strong', trend: 'stable' },
    { capacity: 'adaptability', level: 'strong', trend: 'improving' },
    { capacity: 'focus', level: 'strong', trend: 'stable' },
  ],
  previousSessionSummary: 'Finished the API project ahead of schedule. Ready for more advanced challenges.',
};

const studentMia: StudentContext = {
  childId: 'child-004',
  firstName: 'Mia',
  lastName: 'Johnson',
  age: 9,
  photoUrl: 'https://images.unsplash.com/photo-1595454223600-91fbea0f0090?w=100&h=100&fit=crop&crop=face',
  enrollmentId: 'enroll-005',
  recentCapacities: [
    { capacity: 'curiosity', level: 'strong', trend: 'stable' },
    { capacity: 'expression', level: 'developing', trend: 'improving' },
  ],
  previousSessionSummary: 'Asked great questions about variables. Still building confidence sharing work.',
};

// -----------------------------------------------------------------------------
// Course Materials
// -----------------------------------------------------------------------------

const pythonMaterials: CourseMaterial[] = [
  {
    id: 'mat-001',
    courseId: 'course-001',
    sessionNumber: 4,
    title: 'Session 4: Loops and Patterns - Lesson Plan',
    description: 'Instructor guide for teaching for loops through visual patterns',
    type: 'lesson-plan',
    url: '/materials/python-basics/session-4-lesson-plan.pdf',
    fileType: 'pdf',
    instructorOnly: true,
  },
  {
    id: 'mat-002',
    courseId: 'course-001',
    sessionNumber: 4,
    title: 'Loop Pattern Worksheet',
    description: 'Student worksheet with loop exercises',
    type: 'worksheet',
    url: '/materials/python-basics/session-4-worksheet.pdf',
    fileType: 'pdf',
    instructorOnly: false,
  },
  {
    id: 'mat-003',
    courseId: 'course-001',
    title: 'Python Basics Badge Criteria',
    description: 'Requirements for earning badges in this course',
    type: 'badge-criteria',
    url: '/materials/python-basics/badge-criteria.pdf',
    fileType: 'pdf',
    instructorOnly: true,
  },
];

// -----------------------------------------------------------------------------
// Sessions
// -----------------------------------------------------------------------------

// Today's sessions
const sessionToday1: InstructorSession = {
  id: 'session-today-1',
  courseId: 'course-001',
  courseName: 'Python Basics for Kids',
  courseHeroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop',
  scheduledAt: addHours(today, 15).toISOString(), // 3 PM today
  durationMinutes: 60,
  wrapUpMinutes: 10,
  instructionEndTime: addHours(today, 15.833).toISOString(), // 3:50 PM
  format: 'one-on-one',
  delivery: 'online',
  sessionNumber: 4,
  totalSessions: 8,
  status: 'assigned',
  assignedAt: addDays(today, -7).toISOString(),
  confirmedAt: addDays(today, -6).toISOString(),
  online: {
    hostRoomUrl: 'https://mind-foundry-learning.whereby.com/python-jamie-001?roomKey=abc123',
    participantRoomUrl: 'https://mind-foundry-learning.whereby.com/python-jamie-001',
    joinableFrom: addMinutes(addHours(today, 15), -10).toISOString(),
  },
  students: [studentJamie],
  materials: pythonMaterials,
};

const sessionToday2: InstructorSession = {
  id: 'session-today-2',
  courseId: 'course-002',
  courseName: 'Scratch Animation Workshop',
  courseHeroImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=200&fit=crop',
  scheduledAt: addHours(today, 17).toISOString(), // 5 PM today
  durationMinutes: 45,
  wrapUpMinutes: 10,
  instructionEndTime: addHours(today, 17.583).toISOString(), // 5:35 PM
  format: 'group',
  delivery: 'in-person',
  sessionNumber: 2,
  totalSessions: 6,
  status: 'assigned',
  location: {
    centerId: 'center-001',
    centerName: 'Springfield Center',
    address: '123 Main Street, Springfield, OH 45501',
    room: 'Room 2A',
  },
  students: [studentRiley, studentMia],
};

// Session needing wrap-up (from earlier today or yesterday)
const sessionNeedsWrapUp: InstructorSession = {
  id: 'session-wrapup-1',
  courseId: 'course-003',
  courseName: 'Web Development Fundamentals',
  courseHeroImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop',
  scheduledAt: addHours(today, -3).toISOString(), // 3 hours ago
  durationMinutes: 60,
  wrapUpMinutes: 10,
  instructionEndTime: addHours(today, -2.167).toISOString(),
  format: 'one-on-one',
  delivery: 'online',
  sessionNumber: 6,
  totalSessions: 10,
  status: 'wrap-up-pending',
  online: {
    hostRoomUrl: 'https://mind-foundry-learning.whereby.com/webdev-alex-001?roomKey=xyz789',
    participantRoomUrl: 'https://mind-foundry-learning.whereby.com/webdev-alex-001',
    joinableFrom: addHours(today, -3.167).toISOString(),
  },
  students: [studentAlex],
};

// Upcoming sessions
const sessionTomorrow: InstructorSession = {
  id: 'session-tomorrow-1',
  courseId: 'course-001',
  courseName: 'Python Basics for Kids',
  courseHeroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop',
  scheduledAt: addHours(addDays(today, 1), 16).toISOString(), // 4 PM tomorrow
  durationMinutes: 60,
  wrapUpMinutes: 10,
  instructionEndTime: addHours(addDays(today, 1), 16.833).toISOString(),
  format: 'one-on-one',
  delivery: 'online',
  sessionNumber: 5,
  totalSessions: 8,
  status: 'assigned',
  online: {
    hostRoomUrl: 'https://mind-foundry-learning.whereby.com/python-jamie-001?roomKey=abc123',
    participantRoomUrl: 'https://mind-foundry-learning.whereby.com/python-jamie-001',
    joinableFrom: addMinutes(addHours(addDays(today, 1), 16), -10).toISOString(),
  },
  students: [studentJamie],
  materials: pythonMaterials,
};

// Available session for pickup
const sessionAvailable: InstructorSession = {
  id: 'session-available-1',
  courseId: 'course-004',
  courseName: 'Game Design with Scratch',
  courseHeroImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop',
  scheduledAt: addHours(addDays(today, 2), 14).toISOString(), // 2 PM in 2 days
  durationMinutes: 60,
  wrapUpMinutes: 10,
  instructionEndTime: addHours(addDays(today, 2), 14.833).toISOString(),
  format: 'group',
  delivery: 'in-person',
  sessionNumber: 3,
  totalSessions: 8,
  status: 'available',
  location: {
    centerId: 'center-001',
    centerName: 'Springfield Center',
    address: '123 Main Street, Springfield, OH 45501',
    room: 'Room 1B',
  },
  students: [], // Not shown until claimed
};

// -----------------------------------------------------------------------------
// Pending Artifacts
// -----------------------------------------------------------------------------

export const mockPendingArtifacts: Artifact[] = [
  {
    id: 'artifact-001',
    childId: 'child-001',
    childFirstName: 'Jamie',
    courseId: 'course-001',
    courseName: 'Python Basics for Kids',
    sessionId: 'session-wrapup-1',
    sessionNumber: 4,
    type: 'code',
    title: 'loop_pattern.py',
    description: 'I made a program that draws a spiral using a for loop!',
    files: [{
      id: 'file-001',
      filename: 'loop_pattern.py',
      url: '/uploads/artifacts/loop_pattern.py',
      mimeType: 'text/x-python',
      sizeBytes: 1234,
    }],
    submittedAt: addHours(today, -2).toISOString(),
    submittedBy: 'student',
    status: 'submitted',
    contributesToBadges: ['badge-debug-detective', 'badge-loop-master'],
  },
  {
    id: 'artifact-002',
    childId: 'child-001',
    childFirstName: 'Jamie',
    courseId: 'course-001',
    courseName: 'Python Basics for Kids',
    sessionId: 'session-wrapup-1',
    sessionNumber: 4,
    type: 'image',
    title: 'spiral_screenshot.png',
    description: 'Screenshot of my spiral output',
    files: [{
      id: 'file-002',
      filename: 'spiral_screenshot.png',
      url: 'https://placehold.co/800x600/011F4B/FFFFFF?text=Spiral+Pattern+Output',
      mimeType: 'image/png',
      sizeBytes: 45678,
      thumbnailUrl: 'https://placehold.co/200x150/011F4B/FFFFFF?text=Spiral',
    }],
    submittedAt: addHours(today, -1.5).toISOString(),
    submittedBy: 'student',
    status: 'submitted',
    contributesToBadges: ['badge-debug-detective'],
  },
  {
    id: 'artifact-003',
    childId: 'child-003',
    childFirstName: 'Alex',
    courseId: 'course-003',
    courseName: 'Web Development Fundamentals',
    sessionId: 'session-wrapup-1',
    sessionNumber: 6,
    type: 'project',
    title: 'My Portfolio Website',
    description: 'First version of my portfolio with HTML and CSS',
    files: [{
      id: 'file-003',
      filename: 'portfolio.zip',
      url: '/uploads/artifacts/portfolio.zip',
      mimeType: 'application/zip',
      sizeBytes: 234567,
    }],
    submittedAt: addHours(today, -1).toISOString(),
    submittedBy: 'student',
    status: 'submitted',
    contributesToBadges: ['badge-web-builder'],
  },
];

// -----------------------------------------------------------------------------
// Pay Periods & Earnings
// -----------------------------------------------------------------------------

const currentPayPeriodStart = new Date(today.getFullYear(), today.getMonth(), 1);
const currentPayPeriodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

export const mockCurrentPayPeriod: PayPeriod = {
  id: 'pay-2024-12-1',
  startDate: currentPayPeriodStart.toISOString(),
  endDate: currentPayPeriodEnd.toISOString(),
  status: 'open',
  totalEarned: 42500, // $425.00
  sessionCount: 12,
};

export const mockEarningsEntries: EarningsEntry[] = [
  {
    id: 'earn-001',
    sessionId: 'session-past-1',
    activity: 'one-on-one-online',
    amount: 2500,
    currency: 'USD',
    earnedAt: addDays(today, -5).toISOString(),
    status: 'approved',
    payPeriodId: 'pay-2024-12-1',
  },
  {
    id: 'earn-002',
    sessionId: 'session-past-2',
    activity: 'group-session-inperson',
    amount: 4000,
    currency: 'USD',
    earnedAt: addDays(today, -3).toISOString(),
    status: 'approved',
    payPeriodId: 'pay-2024-12-1',
  },
  // ... more entries
];

// -----------------------------------------------------------------------------
// Rate Table
// -----------------------------------------------------------------------------

export const RATE_TABLE: ActivityRate[] = [
  { activity: 'group-session-online', baseRate: 3500, currency: 'USD', durationMinutes: 60, includesWrapUp: true },
  { activity: 'group-session-inperson', baseRate: 4000, currency: 'USD', durationMinutes: 60, includesWrapUp: true },
  { activity: 'one-on-one-online', baseRate: 2500, currency: 'USD', durationMinutes: 45, includesWrapUp: true },
  { activity: 'one-on-one-inperson', baseRate: 3000, currency: 'USD', durationMinutes: 45, includesWrapUp: true },
  { activity: 'coverage-bonus', baseRate: 500, currency: 'USD', durationMinutes: 0, includesWrapUp: false },
  { activity: 'training-session', baseRate: 2000, currency: 'USD', durationMinutes: 60, includesWrapUp: false },
];

// -----------------------------------------------------------------------------
// Dashboard Aggregate
// -----------------------------------------------------------------------------

export const mockInstructorDashboard: InstructorDashboardData = {
  instructor: mockInstructor,
  todaySessions: [sessionToday1, sessionToday2],
  upcomingSessions: [sessionTomorrow],
  wrapUpPending: [sessionNeedsWrapUp],
  pendingArtifacts: mockPendingArtifacts,
  availableSessions: [sessionAvailable],
  currentPayPeriod: mockCurrentPayPeriod,
  unreadMessageCount: 2,
};

// -----------------------------------------------------------------------------
// Export all sessions for schedule view
// -----------------------------------------------------------------------------

export const mockAllSessions: InstructorSession[] = [
  sessionNeedsWrapUp,
  sessionToday1,
  sessionToday2,
  sessionTomorrow,
  sessionAvailable,
];

// Helper to get sessions for a specific date range
export function getSessionsForDateRange(start: Date, end: Date): InstructorSession[] {
  return mockAllSessions.filter(session => {
    const sessionDate = new Date(session.scheduledAt);
    return sessionDate >= start && sessionDate <= end;
  });
}

// Helper to get session by ID
export function getSessionById(id: string): InstructorSession | undefined {
  return mockAllSessions.find(s => s.id === id);
}