// =============================================================================
// Mock Messaging Data
// =============================================================================
// Sample data for development. Replace with API calls in production.
// =============================================================================

import type { 
  MessageThread, 
  Message, 
  ThreadParticipant,
} from '../types/messaging';

// -----------------------------------------------------------------------------
// Participants (reusable across threads)
// -----------------------------------------------------------------------------

const parentMichelle: ThreadParticipant = {
  id: 'parent-001',
  name: 'Michelle Thompson',
  role: 'parent',
  photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
};

const instructorMarcus: ThreadParticipant = {
  id: 'inst-001',
  name: 'Marcus Chen',
  role: 'instructor',
  photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
};

const instructorPriya: ThreadParticipant = {
  id: 'inst-002',
  name: 'Priya Patel',
  role: 'instructor',
  photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
};

const directorSarah: ThreadParticipant = {
  id: 'dir-001',
  name: 'Sarah Johnson',
  role: 'director',
  photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
};

const supportTeam: ThreadParticipant = {
  id: 'support-001',
  name: 'Mind Foundry Support',
  role: 'support',
};

// -----------------------------------------------------------------------------
// Helper for dates
// -----------------------------------------------------------------------------

const now = new Date();
const minutesAgo = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString();
const hoursAgo = (hrs: number) => new Date(now.getTime() - hrs * 3600000).toISOString();
const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();

// -----------------------------------------------------------------------------
// Mock Threads
// -----------------------------------------------------------------------------

export const mockThreads: MessageThread[] = [
  {
    id: 'thread-001',
    type: 'course',
    context: {
      courseId: 'course-001',
      courseName: 'Python Basics for Kids',
      childId: 'child-001',
      childName: 'Jamie',
      instructorId: 'inst-001',
      instructorName: 'Marcus Chen',
    },
    participants: [parentMichelle, instructorMarcus],
    createdAt: daysAgo(5),
    updatedAt: hoursAgo(2),
    lastMessage: {
      id: 'msg-004',
      senderId: 'inst-001',
      senderName: 'Marcus Chen',
      content: 'Great question! I\'ll cover that in more detail during our next session. Jamie has been doing really well with loops.',
      sentAt: hoursAgo(2),
    },
    unreadCount: 1,
    status: 'active',
  },
  {
    id: 'thread-002',
    type: 'course',
    context: {
      courseId: 'course-002',
      courseName: 'Creative Art Fundamentals',
      childId: 'child-001',
      childName: 'Jamie',
      instructorId: 'inst-002',
      instructorName: 'Priya Patel',
    },
    participants: [parentMichelle, instructorPriya],
    createdAt: daysAgo(12),
    updatedAt: daysAgo(3),
    lastMessage: {
      id: 'msg-008',
      senderId: 'parent-001',
      senderName: 'Michelle Thompson',
      content: 'Thank you for the supply list! We\'ll have everything ready for next week.',
      sentAt: daysAgo(3),
    },
    unreadCount: 0,
    status: 'active',
  },
  {
    id: 'thread-003',
    type: 'schedule',
    context: {
      centerId: 'center-001',
      centerName: 'Springfield Center',
      directorId: 'dir-001',
      directorName: 'Sarah Johnson',
    },
    participants: [parentMichelle, directorSarah],
    subject: 'Vacation Schedule Request',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    lastMessage: {
      id: 'msg-012',
      senderId: 'dir-001',
      senderName: 'Sarah Johnson',
      content: 'No problem at all! I\'ve noted the dates and we\'ll make sure Jamie and Riley have makeup sessions available when you return.',
      sentAt: daysAgo(1),
    },
    unreadCount: 0,
    status: 'active',
  },
  {
    id: 'thread-004',
    type: 'billing',
    context: {
      centerId: 'center-001',
      centerName: 'Springfield Center',
    },
    participants: [parentMichelle, supportTeam],
    subject: 'Invoice Question',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(6),
    lastMessage: {
      id: 'msg-016',
      senderId: 'support-001',
      senderName: 'Mind Foundry Support',
      content: 'Your updated invoice has been sent to your email. The sibling discount has been applied. Let us know if you have any other questions!',
      sentAt: daysAgo(6),
    },
    unreadCount: 0,
    status: 'closed',
  },
  {
    id: 'thread-005',
    type: 'course',
    context: {
      courseId: 'course-003',
      courseName: 'Math Explorers',
      childId: 'child-002',
      childName: 'Riley',
      instructorId: 'inst-003',
      instructorName: 'David Williams',
    },
    participants: [parentMichelle, {
      id: 'inst-003',
      name: 'David Williams',
      role: 'instructor',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    }],
    createdAt: daysAgo(1),
    updatedAt: minutesAgo(30),
    lastMessage: {
      id: 'msg-020',
      senderId: 'inst-003',
      senderName: 'David Williams',
      content: 'Riley did wonderfully today! She\'s really starting to grasp number patterns. I\'ve attached a few optional practice sheets if she wants extra challenges.',
      sentAt: minutesAgo(30),
    },
    unreadCount: 2,
    status: 'active',
  },
];

// -----------------------------------------------------------------------------
// Mock Messages by Thread
// -----------------------------------------------------------------------------

export const mockMessages: Record<string, Message[]> = {
  'thread-001': [
    {
      id: 'msg-001',
      threadId: 'thread-001',
      senderId: 'parent-001',
      senderName: 'Michelle Thompson',
      senderRole: 'parent',
      senderPhotoUrl: parentMichelle.photoUrl,
      content: 'Hi Marcus! Jamie mentioned something about "functions" in Python but seemed a bit confused. Is there anything we can do at home to help reinforce the concept?',
      sentAt: daysAgo(5),
      readAt: daysAgo(5),
      status: 'read',
    },
    {
      id: 'msg-002',
      threadId: 'thread-001',
      senderId: 'inst-001',
      senderName: 'Marcus Chen',
      senderRole: 'instructor',
      senderPhotoUrl: instructorMarcus.photoUrl,
      content: 'Hi Michelle! Great question. Functions can be tricky at first. I like to explain them as "recipes" - you write the recipe once, then you can use it whenever you need it. Jamie actually picked up the basic idea quickly, we\'re just working on the syntax now.',
      sentAt: daysAgo(5),
      readAt: daysAgo(4),
      status: 'read',
    },
    {
      id: 'msg-003',
      threadId: 'thread-001',
      senderId: 'parent-001',
      senderName: 'Michelle Thompson',
      senderRole: 'parent',
      senderPhotoUrl: parentMichelle.photoUrl,
      content: 'That\'s a great analogy! Jamie loves cooking with me so that might really click. Also, will you be covering loops soon? Jamie keeps asking about making things repeat.',
      sentAt: hoursAgo(4),
      readAt: hoursAgo(3),
      status: 'read',
    },
    {
      id: 'msg-004',
      threadId: 'thread-001',
      senderId: 'inst-001',
      senderName: 'Marcus Chen',
      senderRole: 'instructor',
      senderPhotoUrl: instructorMarcus.photoUrl,
      content: 'Great question! I\'ll cover that in more detail during our next session. Jamie has been doing really well with loops.',
      sentAt: hoursAgo(2),
      status: 'delivered',
    },
  ],
  
  'thread-002': [
    {
      id: 'msg-005',
      threadId: 'thread-002',
      senderId: 'parent-001',
      senderName: 'Michelle Thompson',
      senderRole: 'parent',
      senderPhotoUrl: parentMichelle.photoUrl,
      content: 'Hi Priya! Jamie is really excited about the watercolor project. Do we need any special supplies for next week?',
      sentAt: daysAgo(12),
      readAt: daysAgo(12),
      status: 'read',
    },
    {
      id: 'msg-006',
      threadId: 'thread-002',
      senderId: 'inst-002',
      senderName: 'Priya Patel',
      senderRole: 'instructor',
      senderPhotoUrl: instructorPriya.photoUrl,
      content: 'Hi Michelle! So happy to hear Jamie is excited! For the watercolor unit, you\'ll just need:\n\n• A set of watercolor paints (student grade is fine)\n• Watercolor paper pad (9x12 is perfect)\n• Round brushes in sizes 6 and 10\n\nWe have some extras at the center if you need them!',
      sentAt: daysAgo(11),
      readAt: daysAgo(11),
      status: 'read',
    },
    {
      id: 'msg-007',
      threadId: 'thread-002',
      senderId: 'parent-001',
      senderName: 'Michelle Thompson',
      senderRole: 'parent',
      senderPhotoUrl: parentMichelle.photoUrl,
      content: 'Perfect! I found a nice beginner set at the craft store. Quick question - Jamie wants to practice at home. Any tips for keeping things tidy?',
      sentAt: daysAgo(5),
      readAt: daysAgo(5),
      status: 'read',
    },
    {
      id: 'msg-008',
      threadId: 'thread-002',
      senderId: 'inst-002',
      senderName: 'Priya Patel',
      senderRole: 'instructor',
      senderPhotoUrl: instructorPriya.photoUrl,
      content: 'Great find! For home practice, I recommend:\n\n1. Use a plastic tablecloth or old newspapers\n2. Keep a roll of paper towels handy\n3. Two water cups - one for rinsing, one for clean water\n4. Wear an old t-shirt as a smock\n\nMess is part of the creative process, but these help! 🎨',
      sentAt: daysAgo(4),
      readAt: daysAgo(4),
      status: 'read',
    },
    {
      id: 'msg-009',
      threadId: 'thread-002',
      senderId: 'parent-001',
      senderName: 'Michelle Thompson',
      senderRole: 'parent',
      senderPhotoUrl: parentMichelle.photoUrl,
      content: 'Thank you for the supply list! We\'ll have everything ready for next week.',
      sentAt: daysAgo(3),
      readAt: daysAgo(3),
      status: 'read',
    },
  ],
  
  'thread-003': [
    {
      id: 'msg-010',
      threadId: 'thread-003',
      senderId: 'parent-001',
      senderName: 'Michelle Thompson',
      senderRole: 'parent',
      senderPhotoUrl: parentMichelle.photoUrl,
      content: 'Hi Sarah! We\'re planning a family trip December 20-27. Both Jamie and Riley will miss their sessions that week. What\'s the best way to handle makeup classes?',
      sentAt: daysAgo(2),
      readAt: daysAgo(2),
      status: 'read',
    },
    {
      id: 'msg-011',
      threadId: 'thread-003',
      senderId: 'dir-001',
      senderName: 'Sarah Johnson',
      senderRole: 'director',
      senderPhotoUrl: directorSarah.photoUrl,
      content: 'Hi Michelle! Thanks for letting us know in advance - that really helps with planning. Have a wonderful trip! For the makeup sessions:\n\n• Jamie\'s Python class can be made up in the first week of January (we run catch-up sessions)\n• Riley\'s Math Explorers makeup will be scheduled individually with David\n\nI\'ll send you the available times when we get closer to the date.',
      sentAt: daysAgo(2),
      readAt: daysAgo(2),
      status: 'read',
    },
    {
      id: 'msg-012',
      threadId: 'thread-003',
      senderId: 'parent-001',
      senderName: 'Michelle Thompson',
      senderRole: 'parent',
      senderPhotoUrl: parentMichelle.photoUrl,
      content: 'That\'s perfect, thank you! The kids are excited but also don\'t want to fall behind.',
      sentAt: daysAgo(1),
      readAt: daysAgo(1),
      status: 'read',
    },
    {
      id: 'msg-013',
      threadId: 'thread-003',
      senderId: 'dir-001',
      senderName: 'Sarah Johnson',
      senderRole: 'director',
      senderPhotoUrl: directorSarah.photoUrl,
      content: 'No problem at all! I\'ve noted the dates and we\'ll make sure Jamie and Riley have makeup sessions available when you return.',
      sentAt: daysAgo(1),
      status: 'delivered',
    },
  ],
  
  'thread-004': [
    {
      id: 'msg-014',
      threadId: 'thread-004',
      senderId: 'parent-001',
      senderName: 'Michelle Thompson',
      senderRole: 'parent',
      senderPhotoUrl: parentMichelle.photoUrl,
      content: 'Hi! I noticed the December invoice doesn\'t seem to reflect the sibling discount we discussed during enrollment. Could you please check on this?',
      sentAt: daysAgo(7),
      readAt: daysAgo(7),
      status: 'read',
    },
    {
      id: 'msg-015',
      threadId: 'thread-004',
      senderId: 'support-001',
      senderName: 'Mind Foundry Support',
      senderRole: 'support',
      content: 'Hi Michelle! Thank you for catching that. You\'re absolutely right - the 15% sibling discount should be applied since both Jamie and Riley are enrolled. Let me correct that right away and send you an updated invoice.',
      sentAt: daysAgo(7),
      readAt: daysAgo(6),
      status: 'read',
    },
    {
      id: 'msg-016',
      threadId: 'thread-004',
      senderId: 'support-001',
      senderName: 'Mind Foundry Support',
      senderRole: 'support',
      content: 'Your updated invoice has been sent to your email. The sibling discount has been applied. Let us know if you have any other questions!',
      sentAt: daysAgo(6),
      readAt: daysAgo(6),
      status: 'read',
    },
  ],
  
  'thread-005': [
    {
      id: 'msg-017',
      threadId: 'thread-005',
      senderId: 'parent-001',
      senderName: 'Michelle Thompson',
      senderRole: 'parent',
      senderPhotoUrl: parentMichelle.photoUrl,
      content: 'Hi David! Riley seemed a little frustrated during practice at home last night. Is there anything specific we should focus on, or is she doing okay in class?',
      sentAt: daysAgo(1),
      readAt: daysAgo(1),
      status: 'read',
    },
    {
      id: 'msg-018',
      threadId: 'thread-005',
      senderId: 'inst-003',
      senderName: 'David Williams',
      senderRole: 'instructor',
      senderPhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      content: 'Hi Michelle! Riley is actually doing great in class - she participates actively and isn\'t afraid to ask questions, which is wonderful.\n\nThe frustration might be from the subtraction with borrowing we introduced. It\'s a tricky concept! I\'d suggest using physical objects (coins, blocks) to make it more concrete. Sometimes the abstract numbers are harder to visualize at this age.',
      sentAt: hoursAgo(20),
      readAt: hoursAgo(18),
      status: 'read',
    },
    {
      id: 'msg-019',
      threadId: 'thread-005',
      senderId: 'parent-001',
      senderName: 'Michelle Thompson',
      senderRole: 'parent',
      senderPhotoUrl: parentMichelle.photoUrl,
      content: 'That\'s such a relief to hear! We\'ll try the physical objects approach tonight. She does love her block collection. How did today\'s session go?',
      sentAt: hoursAgo(3),
      readAt: hoursAgo(1),
      status: 'read',
    },
    {
      id: 'msg-020',
      threadId: 'thread-005',
      senderId: 'inst-003',
      senderName: 'David Williams',
      senderRole: 'instructor',
      senderPhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      content: 'Riley did wonderfully today! She\'s really starting to grasp number patterns. I\'ve attached a few optional practice sheets if she wants extra challenges.',
      sentAt: minutesAgo(30),
      status: 'delivered',
    },
  ],
};

// -----------------------------------------------------------------------------
// Helper function to get all data for a user
// -----------------------------------------------------------------------------

export function getMessagingDataForParent(parentId: string) {
  // In production, this would be an API call
  const threads = mockThreads
    .filter(t => t.participants.some(p => p.id === parentId))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
  const totalUnread = threads.reduce((sum, t) => sum + t.unreadCount, 0);
  
  return {
    threads,
    totalUnread,
  };
}

export function getMessagesForThread(threadId: string): Message[] {
  return mockMessages[threadId] || [];
}