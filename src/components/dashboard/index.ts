// Dashboard Components - Public Exports
// =====================================
// Import components from this file for cleaner imports:
// import { FamilyOverview, ChildStatusCard } from '@components/dashboard';

export { default as DashboardNav } from './DashboardNav';
export { default as FamilyOverview } from './FamilyOverview';
export { default as ChildStatusCard } from './ChildStatusCard';
export { default as UpcomingSessionCard } from './UpcomingSessionCard';
export { default as RecentFeedbackCard } from './RecentFeedbackCard';
export { default as CapacityRadar } from './CapacityRadar';

// Session components
export { default as SessionsPage } from './SessionsPage';
export { default as SessionFiltersBar } from './SessionFiltersBar';
export { default as SessionListItem } from './SessionListItem';
export { default as SessionDetailPanel } from './SessionDetailPanel';

// Feedback Journal components
export { default as FeedbackJournalPage } from './FeedbackJournalPage';
export { default as FeedbackFiltersBar } from './FeedbackFiltersBar';
export { default as FeedbackEntryCard } from './FeedbackEntryCard';

// Child Detail Page components
export { default as ChildDetailPage } from './ChildDetailPage';
export { default as CapacityDetailCard } from './CapacityDetailCard';
export { default as BadgeShowcase } from './BadgeShowcase';
export { default as EnrollmentProgressCard } from './EnrollmentProgressCard';

// Messaging components
export { default as MessagesPage } from './MessagesPage';
export { default as MessageInbox } from './MessageInbox';
export { default as MessageThread } from './MessageThread';
export { default as ComposeMessage } from './ComposeMessage';

// Re-export types for convenience
export type {
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
  GrowthLevel,
} from '../../types/dashboard';