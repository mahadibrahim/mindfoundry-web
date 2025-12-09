// =============================================================================
// Instructor Dashboard - Component Exports
// =============================================================================
// Import from this file for cleaner imports in your project:
// import { InstructorDashboardPage, SessionCard, WrapUpFlow } from './components/dashboard/instructor';
// =============================================================================

// Main page component
export { default as InstructorDashboardPage } from './InstructorDashboardPage';

// Layout
export { default as InstructorDashboardLayout } from './InstructorDashboardLayout';

// Views
export { default as ScheduleView } from './ScheduleView';
export { default as WrapUpFlow } from './WrapUpFlow';

// Cards
export { default as SessionCard } from './SessionCard';

// Re-export types
export type {
  Instructor,
  InstructorSession,
  StudentContext,
  CourseMaterial,
  Artifact,
  ArtifactFile,
  SessionWrapUp,
  StudentAttendance,
  StudentObservations,
  CapacityObservation,
  ArtifactReviewAction,
  PayPeriod,
  EarningsEntry,
  InstructorDashboardData,
  Capacity,
  ObservationLevel,
  AttendanceStatus,
} from '../../../types/instructor';

// Re-export constants
export { CAPACITY_CONFIG, OBSERVATION_LEVELS } from '../../../types/instructor';
