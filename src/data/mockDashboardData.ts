// =============================================================================
// Mind Foundry Parent Dashboard - Mock Data
// =============================================================================
// Realistic sample data for development and testing.
// Replace with actual API calls in production.
// =============================================================================

import type {
  Parent,
  Child,
  Enrollment,
  Course,
  Session,
  SessionFeedback,
  Instructor,
  Center,
  DevelopmentProfile,
  CapacityGrowth,
  Badge,
  Milestone,
  MessageThread,
  Message,
  FamilyOverviewData,
  ChildOverview,
  SessionWithChild,
  FeedbackWithContext,
  Capacity,
} from '../types/dashboard';

// -----------------------------------------------------------------------------
// Instructors
// -----------------------------------------------------------------------------

export const mockInstructors: Instructor[] = [
  {
    id: 'inst-001',
    firstName: 'Marcus',
    lastName: 'Chen',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    title: 'Lead Coding Instructor',
    bio: '10+ years teaching programming to young learners',
  },
  {
    id: 'inst-002',
    firstName: 'Priya',
    lastName: 'Patel',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    title: 'Creative Arts Instructor',
    bio: 'MFA in Digital Arts, passionate about nurturing young artists',
  },
  {
    id: 'inst-003',
    firstName: 'David',
    lastName: 'Williams',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    title: 'Math & Logic Instructor',
    bio: 'Former software engineer who loves making math fun',
  },
];

// -----------------------------------------------------------------------------
// Centers
// -----------------------------------------------------------------------------

export const mockCenters: Center[] = [
  {
    id: 'center-001',
    name: 'Springfield Center',
    address: '123 Main Street, Springfield, OH 45501',
    phoneNumber: '(555) 123-4567',
    directorId: 'dir-001',
    directorName: 'Sarah Johnson',
  },
];

// -----------------------------------------------------------------------------
// Courses
// -----------------------------------------------------------------------------

export const mockCourses: Course[] = [
  {
    id: 'course-001',
    title: 'Python Basics for Kids',
    description: 'Introduction to programming concepts using Python. Perfect for beginners.',
    format: 'group',
    delivery: 'in-person',
    ageRange: { min: 8, max: 12 },
    capacitiesDeveloped: ['reasoning', 'focus', 'curiosity'],
    instructor: mockInstructors[0],
    center: mockCenters[0],
    heroImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop',
  },
  {
    id: 'course-002',
    title: 'Digital Art Fundamentals',
    description: 'Learn digital drawing and design principles using industry tools.',
    format: 'group',
    delivery: 'online',
    ageRange: { min: 10, max: 16 },
    capacitiesDeveloped: ['expression', 'curiosity', 'adaptability'],
    instructor: mockInstructors[1],
    heroImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
  },
  {
    id: 'course-003',
    title: 'Math Problem Solving',
    description: 'Build confidence in math through hands-on problem solving and games.',
    format: 'one-on-one',
    delivery: 'online',
    ageRange: { min: 7, max: 11 },
    capacitiesDeveloped: ['reasoning', 'adaptability', 'focus'],
    instructor: mockInstructors[2],
    heroImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop',
  },
];

// -----------------------------------------------------------------------------
// Session Feedback Generators
// -----------------------------------------------------------------------------

const createFeedback = (
  sessionId: string,
  instructorId: string,
  instructorName: string,
  daysAgo: number
): SessionFeedback => ({
  id: `feedback-${sessionId}`,
  sessionId,
  instructorId,
  instructorName,
  createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
  capacityObservations: [
    { capacity: 'curiosity', level: 'high', note: 'Asked excellent questions about the topic' },
    { capacity: 'focus', level: 'high', note: 'Stayed engaged throughout the session' },
    { capacity: 'reasoning', level: 'moderate', note: 'Working on breaking problems into steps' },
  ],
  summary: 'Great session today! Showed real enthusiasm and asked thoughtful questions. We hit a challenging problem and I was impressed by the persistence shown in working through it.',
  growthFocus: 'Continue building problem decomposition skills',
  highlights: ['Asked insightful question about loops', 'Helped a peer debug their code'],
});

// Varied feedback generator for more diverse data
const createVariedFeedback = (
  sessionId: string,
  instructorId: string,
  instructorName: string,
  daysAgo: number,
  variant: number
): SessionFeedback => {
  const variants: Array<{
    capacityObservations: Array<{ capacity: Capacity; level: 'high' | 'moderate' | 'developing' | 'not-observed'; note: string }>;
    summary: string;
    growthFocus: string;
    highlights: string[];
  }> = [
    {
      capacityObservations: [
        { capacity: 'curiosity', level: 'high', note: 'Asked excellent questions about the topic' },
        { capacity: 'focus', level: 'high', note: 'Stayed engaged throughout the session' },
        { capacity: 'reasoning', level: 'moderate', note: 'Working on breaking problems into steps' },
      ],
      summary: 'Great session today! Showed real enthusiasm and asked thoughtful questions.',
      growthFocus: 'Continue building problem decomposition skills',
      highlights: ['Asked insightful question about loops', 'Helped a peer debug their code'],
    },
    {
      capacityObservations: [
        { capacity: 'expression', level: 'high', note: 'Explained concepts clearly to the group' },
        { capacity: 'collaboration', level: 'high', note: 'Great teamwork during pair programming' },
        { capacity: 'adaptability', level: 'moderate', note: 'Handled unexpected challenges well' },
      ],
      summary: 'Wonderful session with strong peer collaboration. Demonstrated confidence in sharing ideas.',
      growthFocus: 'Continue developing leadership in group activities',
      highlights: ['Led group discussion', 'Offered help to struggling classmate'],
    },
    {
      capacityObservations: [
        { capacity: 'focus', level: 'moderate', note: 'Good focus for first half, needed breaks' },
        { capacity: 'reasoning', level: 'high', note: 'Excellent logical thinking on the puzzle' },
        { capacity: 'curiosity', level: 'high', note: 'Wanted to explore beyond the lesson' },
      ],
      summary: 'Strong analytical skills showing through. Working on sustained attention.',
      growthFocus: 'Practice extended focus with engaging tasks',
      highlights: ['Solved the challenge problem first', 'Asked to try advanced version'],
    },
    {
      capacityObservations: [
        { capacity: 'adaptability', level: 'high', note: 'Rolled with schedule changes gracefully' },
        { capacity: 'expression', level: 'moderate', note: 'Getting more comfortable sharing work' },
        { capacity: 'collaboration', level: 'moderate', note: 'Participated well in group activity' },
      ],
      summary: 'Growing confidence in sharing work with others. Very flexible learner.',
      growthFocus: 'Encourage more verbal participation in discussions',
      highlights: ['Volunteered to present project', 'Gave helpful feedback to partner'],
    },
    {
      capacityObservations: [
        { capacity: 'reasoning', level: 'developing', note: 'Working through logical steps with support' },
        { capacity: 'focus', level: 'high', note: 'Excellent concentration today' },
        { capacity: 'curiosity', level: 'moderate', note: 'Showing interest in new topics' },
      ],
      summary: 'Making steady progress on reasoning skills. Focus was outstanding today.',
      growthFocus: 'Continue scaffolded problem-solving practice',
      highlights: ['Completed all exercises', 'Asked clarifying questions'],
    },
  ];

  const v = variants[variant % variants.length];
  
  return {
    id: `feedback-${sessionId}`,
    sessionId,
    instructorId,
    instructorName,
    createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    ...v,
  };
};

// -----------------------------------------------------------------------------
// Sessions
// -----------------------------------------------------------------------------

const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
const sixWeeksAgo = new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000);

// Set sessions to reasonable class times
tomorrow.setHours(16, 0, 0, 0); // 4:00 PM
nextWeek.setHours(10, 0, 0, 0); // 10:00 AM Saturday
yesterday.setHours(16, 0, 0, 0);
lastWeek.setHours(16, 0, 0, 0);
twoWeeksAgo.setHours(16, 0, 0, 0);
threeWeeksAgo.setHours(16, 0, 0, 0);
oneMonthAgo.setHours(16, 0, 0, 0);
sixWeeksAgo.setHours(16, 0, 0, 0);

export const mockSessions: Record<string, Session[]> = {
  'enroll-001': [
    // Upcoming session
    {
      id: 'session-001',
      enrollmentId: 'enroll-001',
      scheduledAt: tomorrow.toISOString(),
      durationMinutes: 60,
      status: 'scheduled',
      sessionNumber: 5,
      delivery: 'in-person',
      location: {
        centerId: 'center-001',
        centerName: 'Springfield Center',
        address: '123 Main Street, Springfield, OH 45501',
        room: 'Room 2A',
      },
    },
    // Yesterday - completed with feedback (no reflection yet)
    {
      id: 'session-002',
      enrollmentId: 'enroll-001',
      scheduledAt: yesterday.toISOString(),
      durationMinutes: 60,
      status: 'completed',
      sessionNumber: 4,
      delivery: 'in-person',
      location: {
        centerId: 'center-001',
        centerName: 'Springfield Center',
        address: '123 Main Street, Springfield, OH 45501',
        room: 'Room 2A',
      },
      feedback: createVariedFeedback('session-002', 'inst-001', 'Marcus Chen', 1, 0),
    },
    // Last week - with parent reflection
    {
      id: 'session-003',
      enrollmentId: 'enroll-001',
      scheduledAt: lastWeek.toISOString(),
      durationMinutes: 60,
      status: 'completed',
      sessionNumber: 3,
      delivery: 'in-person',
      location: {
        centerId: 'center-001',
        centerName: 'Springfield Center',
        address: '123 Main Street, Springfield, OH 45501',
        room: 'Room 2A',
      },
      feedback: {
        ...createVariedFeedback('session-003', 'inst-001', 'Marcus Chen', 7, 1),
        parentReflection: {
          content: 'We noticed Jamie practicing coding at home after this session. Really excited to see that enthusiasm!',
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    },
    // Two weeks ago - with parent reflection
    {
      id: 'session-006',
      enrollmentId: 'enroll-001',
      scheduledAt: twoWeeksAgo.toISOString(),
      durationMinutes: 60,
      status: 'completed',
      sessionNumber: 2,
      delivery: 'in-person',
      location: {
        centerId: 'center-001',
        centerName: 'Springfield Center',
        address: '123 Main Street, Springfield, OH 45501',
        room: 'Room 2A',
      },
      feedback: {
        ...createVariedFeedback('session-006', 'inst-001', 'Marcus Chen', 14, 2),
        parentReflection: {
          content: 'Jamie talked about the puzzle challenge all through dinner. Love seeing this engagement!',
          createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    },
    // Three weeks ago - no reflection
    {
      id: 'session-007',
      enrollmentId: 'enroll-001',
      scheduledAt: threeWeeksAgo.toISOString(),
      durationMinutes: 60,
      status: 'completed',
      sessionNumber: 1,
      delivery: 'in-person',
      location: {
        centerId: 'center-001',
        centerName: 'Springfield Center',
        address: '123 Main Street, Springfield, OH 45501',
        room: 'Room 2A',
      },
      feedback: createVariedFeedback('session-007', 'inst-001', 'Marcus Chen', 21, 3),
    },
  ],
  'enroll-002': [
    // Upcoming - Digital Art
    {
      id: 'session-004',
      enrollmentId: 'enroll-002',
      scheduledAt: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 45,
      status: 'scheduled',
      sessionNumber: 5,
      delivery: 'online',
      online: {
        wherebyRoomUrl: 'https://whereby.com/mindfoundry-art-204',
        joinableFrom: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000 - 10 * 60 * 1000).toISOString(),
      },
    },
    // Last week - Digital Art with feedback (no reflection)
    {
      id: 'session-008',
      enrollmentId: 'enroll-002',
      scheduledAt: lastWeek.toISOString(),
      durationMinutes: 45,
      status: 'completed',
      sessionNumber: 4,
      delivery: 'online',
      online: {
        wherebyRoomUrl: 'https://whereby.com/mindfoundry-art-204',
      },
      feedback: createVariedFeedback('session-008', 'inst-002', 'Priya Patel', 7, 4),
    },
    // Two weeks ago - with reflection
    {
      id: 'session-009',
      enrollmentId: 'enroll-002',
      scheduledAt: twoWeeksAgo.toISOString(),
      durationMinutes: 45,
      status: 'completed',
      sessionNumber: 3,
      delivery: 'online',
      online: {
        wherebyRoomUrl: 'https://whereby.com/mindfoundry-art-204',
      },
      feedback: {
        ...createVariedFeedback('session-009', 'inst-002', 'Priya Patel', 14, 0),
        parentReflection: {
          content: 'The digital art project was beautiful. Jamie showed it to the whole family.',
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    },
    // One month ago
    {
      id: 'session-010',
      enrollmentId: 'enroll-002',
      scheduledAt: oneMonthAgo.toISOString(),
      durationMinutes: 45,
      status: 'completed',
      sessionNumber: 2,
      delivery: 'online',
      online: {
        wherebyRoomUrl: 'https://whereby.com/mindfoundry-art-204',
      },
      feedback: createVariedFeedback('session-010', 'inst-002', 'Priya Patel', 30, 1),
    },
    // Six weeks ago
    {
      id: 'session-012',
      enrollmentId: 'enroll-002',
      scheduledAt: sixWeeksAgo.toISOString(),
      durationMinutes: 45,
      status: 'completed',
      sessionNumber: 1,
      delivery: 'online',
      online: {
        wherebyRoomUrl: 'https://whereby.com/mindfoundry-art-204',
      },
      feedback: {
        ...createVariedFeedback('session-012', 'inst-002', 'Priya Patel', 42, 2),
        parentReflection: {
          content: 'First art class went great! Jamie is excited to learn digital drawing.',
          createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    },
  ],
  'enroll-003': [
    // Upcoming - Alex's Math session
    {
      id: 'session-005',
      enrollmentId: 'enroll-003',
      scheduledAt: nextWeek.toISOString(),
      durationMinutes: 45,
      status: 'scheduled',
      sessionNumber: 3,
      delivery: 'online',
      online: {
        wherebyRoomUrl: 'https://whereby.com/mindfoundry-math-101',
        joinableFrom: new Date(nextWeek.getTime() - 10 * 60 * 1000).toISOString(),
      },
    },
    // Last week - Alex's second math session with feedback
    {
      id: 'session-011',
      enrollmentId: 'enroll-003',
      scheduledAt: lastWeek.toISOString(),
      durationMinutes: 45,
      status: 'completed',
      sessionNumber: 2,
      delivery: 'online',
      online: {
        wherebyRoomUrl: 'https://whereby.com/mindfoundry-math-101',
      },
      feedback: createVariedFeedback('session-011', 'inst-003', 'David Williams', 7, 2),
    },
    // Two weeks ago - Alex's first session
    {
      id: 'session-013',
      enrollmentId: 'enroll-003',
      scheduledAt: twoWeeksAgo.toISOString(),
      durationMinutes: 45,
      status: 'completed',
      sessionNumber: 1,
      delivery: 'online',
      online: {
        wherebyRoomUrl: 'https://whereby.com/mindfoundry-math-101',
      },
      feedback: {
        ...createVariedFeedback('session-013', 'inst-003', 'David Williams', 14, 4),
        parentReflection: {
          content: 'Riley was nervous but David made the first session really comfortable. Looking forward to more!',
          createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    },
  ],
};

// -----------------------------------------------------------------------------
// Enrollments
// -----------------------------------------------------------------------------

export const mockEnrollments: Record<string, Enrollment[]> = {
  'child-001': [
    {
      id: 'enroll-001',
      childId: 'child-001',
      courseId: 'course-001',
      course: mockCourses[0],
      status: 'active',
      sessionsTotal: 10,
      sessionsCompleted: 4,
      enrolledAt: '2024-09-15T00:00:00Z',
      nextSession: mockSessions['enroll-001'][0],
    },
    {
      id: 'enroll-002',
      childId: 'child-001',
      courseId: 'course-002',
      course: mockCourses[1],
      status: 'active',
      sessionsTotal: 8,
      sessionsCompleted: 4,
      enrolledAt: '2024-10-01T00:00:00Z',
      nextSession: mockSessions['enroll-002'][0],
    },
  ],
  'child-002': [
    {
      id: 'enroll-003',
      childId: 'child-002',
      courseId: 'course-003',
      course: mockCourses[2],
      status: 'active',
      sessionsTotal: 12,
      sessionsCompleted: 2,
      enrolledAt: '2024-11-20T00:00:00Z',
      nextSession: mockSessions['enroll-003'][0],
    },
  ],
};

// -----------------------------------------------------------------------------
// Development Profiles
// -----------------------------------------------------------------------------

export const mockDevelopmentProfiles: Record<string, DevelopmentProfile> = {
  'child-001': {
    childId: 'child-001',
    capacities: [
      { capacity: 'curiosity', currentLevel: 4, previousLevel: 3, lastUpdated: '2024-11-28', trend: 'improving' },
      { capacity: 'reasoning', currentLevel: 3, lastUpdated: '2024-11-28', trend: 'stable' },
      { capacity: 'expression', currentLevel: 3, lastUpdated: '2024-11-15', trend: 'stable' },
      { capacity: 'focus', currentLevel: 4, previousLevel: 3, lastUpdated: '2024-11-20', trend: 'improving' },
      { capacity: 'collaboration', currentLevel: 4, lastUpdated: '2024-11-10', trend: 'stable' },
      { capacity: 'adaptability', currentLevel: 3, lastUpdated: '2024-11-25', trend: 'stable' },
    ],
    recentBadges: [
      {
        id: 'badge-001',
        name: 'Persistence Champion',
        description: 'Completed a challenging debugging session without giving up',
        capacity: 'focus',
        level: 4,
        earnedAt: '2024-11-20T00:00:00Z',
        courseId: 'course-001',
        courseName: 'Python Basics for Kids',
      },
      {
        id: 'badge-002',
        name: 'Curious Explorer',
        description: 'Asked 10 thoughtful questions across sessions',
        capacity: 'curiosity',
        level: 4,
        earnedAt: '2024-11-15T00:00:00Z',
        courseId: 'course-001',
        courseName: 'Python Basics for Kids',
      },
    ],
    recentMilestones: [
      {
        id: 'milestone-001',
        childId: 'child-001',
        achievedAt: '2024-11-20T00:00:00Z',
        type: 'level-up',
        title: 'Focus Level Up!',
        description: 'Advanced from Practicing to Confident in Focus',
        capacity: 'focus',
      },
      {
        id: 'milestone-002',
        childId: 'child-001',
        achievedAt: '2024-11-28T00:00:00Z',
        type: 'badge',
        title: 'Earned Persistence Champion Badge',
        description: 'Recognized for outstanding focus and determination',
        capacity: 'focus',
        badgeId: 'badge-001',
      },
    ],
    updatedAt: '2024-11-28T00:00:00Z',
  },
  'child-002': {
    childId: 'child-002',
    capacities: [
      { capacity: 'curiosity', currentLevel: 3, lastUpdated: '2024-11-30', trend: 'stable' },
      { capacity: 'reasoning', currentLevel: 2, previousLevel: 1, lastUpdated: '2024-11-30', trend: 'improving' },
      { capacity: 'expression', currentLevel: 4, lastUpdated: '2024-11-25', trend: 'stable' },
      { capacity: 'focus', currentLevel: 2, lastUpdated: '2024-11-30', trend: 'needs-attention' },
      { capacity: 'collaboration', currentLevel: 3, lastUpdated: '2024-11-20', trend: 'stable' },
      { capacity: 'adaptability', currentLevel: 3, lastUpdated: '2024-11-25', trend: 'stable' },
    ],
    recentBadges: [],
    recentMilestones: [
      {
        id: 'milestone-003',
        childId: 'child-002',
        achievedAt: '2024-11-30T00:00:00Z',
        type: 'level-up',
        title: 'Reasoning Level Up!',
        description: 'Advanced from Exploring to Developing in Reasoning',
        capacity: 'reasoning',
      },
    ],
    updatedAt: '2024-11-30T00:00:00Z',
  },
};

// -----------------------------------------------------------------------------
// Children
// -----------------------------------------------------------------------------

export const mockChildren: Child[] = [
  {
    id: 'child-001',
    firstName: 'Jamie',
    lastName: 'Thompson',
    dateOfBirth: '2015-03-22',
    photoUrl: 'https://images.unsplash.com/photo-1595454223600-91fbf4339e09?w=150&h=150&fit=crop&crop=face',
    enrolledSince: '2024-09-15',
    developmentProfile: mockDevelopmentProfiles['child-001'],
    activeEnrollments: mockEnrollments['child-001'],
  },
  {
    id: 'child-002',
    firstName: 'Riley',
    lastName: 'Thompson',
    dateOfBirth: '2018-08-10',
    photoUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&h=150&fit=crop&crop=face',
    enrolledSince: '2024-11-20',
    developmentProfile: mockDevelopmentProfiles['child-002'],
    activeEnrollments: mockEnrollments['child-002'],
  },
];

// -----------------------------------------------------------------------------
// Parent
// -----------------------------------------------------------------------------

export const mockParent: Parent = {
  id: 'parent-001',
  firstName: 'Michelle',
  lastName: 'Thompson',
  email: 'michelle.thompson@email.com',
  phoneNumber: '(555) 987-6543',
  photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  children: mockChildren,
  createdAt: '2024-09-10T00:00:00Z',
};

// -----------------------------------------------------------------------------
// Message Threads
// -----------------------------------------------------------------------------

export const mockMessageThreads: MessageThread[] = [
  {
    id: 'thread-001',
    type: 'course',
    context: {
      courseId: 'course-001',
      courseName: 'Python Basics for Kids',
      instructorId: 'inst-001',
      instructorName: 'Marcus Chen',
      childId: 'child-001',
      childName: 'Jamie',
    },
    participants: [
      { id: 'parent-001', name: 'Michelle Thompson', role: 'parent', photoUrl: mockParent.photoUrl },
      { id: 'inst-001', name: 'Marcus Chen', role: 'instructor', photoUrl: mockInstructors[0].photoUrl },
    ],
    lastMessage: {
      id: 'msg-001',
      threadId: 'thread-001',
      senderId: 'inst-001',
      senderName: 'Marcus Chen',
      senderRole: 'instructor',
      content: "No problem at all! We'll see Jamie next week. Let me know if you have any questions about the homework.",
      sentAt: '2024-12-01T14:30:00Z',
      readAt: '2024-12-01T15:00:00Z',
    },
    lastActivity: '2024-12-01T14:30:00Z',
    unreadCount: 0,
  },
  {
    id: 'thread-002',
    type: 'center',
    context: {
      centerId: 'center-001',
      centerName: 'Springfield Center',
    },
    participants: [
      { id: 'parent-001', name: 'Michelle Thompson', role: 'parent', photoUrl: mockParent.photoUrl },
      { id: 'dir-001', name: 'Sarah Johnson', role: 'center-director' },
    ],
    lastMessage: {
      id: 'msg-002',
      threadId: 'thread-002',
      senderId: 'dir-001',
      senderName: 'Sarah Johnson',
      senderRole: 'center-director',
      content: "Your invoice for December has been processed. Thank you!",
      sentAt: '2024-12-02T09:00:00Z',
    },
    lastActivity: '2024-12-02T09:00:00Z',
    unreadCount: 1,
  },
];

// -----------------------------------------------------------------------------
// Aggregated View Data
// -----------------------------------------------------------------------------

export const mockFamilyOverview: FamilyOverviewData = {
  parent: mockParent,
  children: mockChildren.map((child): ChildOverview => {
    const topCapacity = child.developmentProfile.capacities.reduce((top, current) =>
      current.currentLevel > top.currentLevel ? current : top
    );
    
    return {
      child,
      nextSession: child.activeEnrollments[0]?.nextSession,
      recentFeedbackCount: 2,
      hasUnreadFeedback: child.id === 'child-001',
      topCapacity: {
        capacity: topCapacity.capacity,
        level: topCapacity.currentLevel,
      },
    };
  }),
  upcomingSessions: [
    {
      ...mockSessions['enroll-001'][0],
      childId: 'child-001',
      childFirstName: 'Jamie',
      courseName: 'Python Basics for Kids',
      instructorName: 'Marcus Chen',
    },
    {
      ...mockSessions['enroll-002'][0],
      childId: 'child-001',
      childFirstName: 'Jamie',
      courseName: 'Digital Art Fundamentals',
      instructorName: 'Priya Patel',
    },
    {
      ...mockSessions['enroll-003'][0],
      childId: 'child-002',
      childFirstName: 'Riley',
      courseName: 'Math Problem Solving',
      instructorName: 'David Williams',
    },
  ],
  recentFeedback: [
    {
      ...mockSessions['enroll-001'][1].feedback!,
      childId: 'child-001',
      childFirstName: 'Jamie',
      courseName: 'Python Basics for Kids',
      sessionDate: mockSessions['enroll-001'][1].scheduledAt,
    },
  ],
  unreadMessageCount: 1,
};

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Simulates API fetch with delay
 */
export const simulateApiCall = <T>(data: T, delayMs = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
};

/**
 * Get all sessions for a child across enrollments
 */
export const getChildSessions = (childId: string): Session[] => {
  const enrollments = mockEnrollments[childId] || [];
  return enrollments.flatMap((enrollment) => mockSessions[enrollment.id] || []);
};

/**
 * Get all sessions with their full context (enrollment and child)
 * Used by the Sessions page to show all sessions across all children
 */
export interface SessionWithFullContext {
  session: Session;
  enrollment: Enrollment;
  child: Child;
}

export const getAllSessionsWithContext = (): SessionWithFullContext[] => {
  const result: SessionWithFullContext[] = [];
  
  mockChildren.forEach((child) => {
    const enrollments = mockEnrollments[child.id] || [];
    enrollments.forEach((enrollment) => {
      const sessions = mockSessions[enrollment.id] || [];
      sessions.forEach((session) => {
        result.push({
          session,
          enrollment,
          child,
        });
      });
    });
  });

  // Sort by date (upcoming first)
  return result.sort((a, b) => {
    return new Date(a.session.scheduledAt).getTime() - new Date(b.session.scheduledAt).getTime();
  });
};

/**
 * Get children with their enrollments hydrated with all sessions
 */
export const getChildrenWithAllSessions = (): Child[] => {
  return mockChildren.map(child => {
    const enrollments = mockEnrollments[child.id] || [];
    
    const hydratedEnrollments = enrollments.map(enrollment => {
      const sessions = mockSessions[enrollment.id] || [];
      const now = new Date();
      const upcomingSessions = sessions
        .filter(s => new Date(s.scheduledAt) >= now && s.status !== 'cancelled')
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
      
      return {
        ...enrollment,
        nextSession: upcomingSessions[0] || sessions[0],
        // @ts-ignore - Adding allSessions for sessions page
        allSessions: sessions,
      };
    });

    return {
      ...child,
      activeEnrollments: hydratedEnrollments,
    };
  });
};

/**
 * Format date for display
 */
export const formatSessionDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Check if an online session is joinable
 */
export const isSessionJoinable = (session: Session): boolean => {
  if (session.delivery !== 'online' || !session.online) return false;
  const now = new Date();
  const joinableFrom = new Date(session.online.joinableFrom);
  const sessionEnd = new Date(new Date(session.scheduledAt).getTime() + session.durationMinutes * 60 * 1000);
  return now >= joinableFrom && now <= sessionEnd;
};