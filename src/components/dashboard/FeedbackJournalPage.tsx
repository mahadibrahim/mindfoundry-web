import React, { useState, useMemo } from 'react';
import type { Child, Session, Enrollment, Course, SessionFeedback, Capacity } from '../../types/dashboard';
import FeedbackFiltersBar, { type FeedbackFilters } from './FeedbackFiltersBar';
import FeedbackEntryCard from './FeedbackEntryCard';

interface FeedbackWithContext {
  feedback: SessionFeedback;
  session: Session;
  enrollment: Enrollment;
  child: Child;
}

// Extended enrollment type that includes allSessions
interface EnrollmentWithSessions extends Enrollment {
  allSessions?: Session[];
}

interface FeedbackJournalPageProps {
  childrenData: Child[];
  onSaveReflection?: (feedbackId: string, reflection: string) => void;
}

const FeedbackJournalPage: React.FC<FeedbackJournalPageProps> = ({
  childrenData,
  onSaveReflection,
}) => {
  // State
  const [filters, setFilters] = useState<FeedbackFilters>({
    childId: '',
    courseId: '',
    capacity: '',
    dateRange: 'all',
    hasReflection: 'all',
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Aggregate all feedback from all children's sessions
  const allFeedback = useMemo((): FeedbackWithContext[] => {
    const feedbackList: FeedbackWithContext[] = [];
    
    childrenData.forEach((child) => {
      child.activeEnrollments.forEach((enrollment) => {
        const enrollmentWithSessions = enrollment as EnrollmentWithSessions;
        const sessions = enrollmentWithSessions.allSessions || 
          (enrollment.nextSession ? [enrollment.nextSession] : []);
        
        sessions.forEach((session) => {
          if (session.feedback) {
            feedbackList.push({
              feedback: session.feedback,
              session,
              enrollment,
              child,
            });
          }
        });
      });
    });

    // Sort by date (most recent first)
    return feedbackList.sort((a, b) => {
      const dateA = new Date(a.session.scheduledAt);
      const dateB = new Date(b.session.scheduledAt);
      return dateB.getTime() - dateA.getTime();
    });
  }, [childrenData]);

  // Get unique courses for filter
  const allCourses = useMemo((): Course[] => {
    const courseMap = new Map<string, Course>();
    childrenData.forEach((child) => {
      child.activeEnrollments.forEach((enrollment) => {
        courseMap.set(enrollment.course.id, enrollment.course);
      });
    });
    return Array.from(courseMap.values());
  }, [childrenData]);

  // Filter feedback based on current filters
  const filteredFeedback = useMemo((): FeedbackWithContext[] => {
    return allFeedback.filter((item) => {
      const { feedback, session, enrollment, child } = item;
      const sessionDate = new Date(session.scheduledAt);
      const now = new Date();

      // Child filter
      if (filters.childId && child.id !== filters.childId) return false;

      // Course filter
      if (filters.courseId && enrollment.course.id !== filters.courseId) return false;

      // Capacity filter
      if (filters.capacity) {
        const hasCapacity = feedback.capacityObservations.some(
          obs => obs.capacity === filters.capacity && obs.level !== 'not-observed'
        );
        if (!hasCapacity) return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const msInDay = 24 * 60 * 60 * 1000;
        const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / msInDay);
        
        switch (filters.dateRange) {
          case 'week':
            if (daysDiff > 7) return false;
            break;
          case 'month':
            if (daysDiff > 30) return false;
            break;
          case 'quarter':
            if (daysDiff > 90) return false;
            break;
          case 'year':
            if (daysDiff > 365) return false;
            break;
        }
      }

      // Reflection filter
      if (filters.hasReflection !== 'all') {
        const hasReflection = !!feedback.parentReflection;
        if (filters.hasReflection === 'with' && !hasReflection) return false;
        if (filters.hasReflection === 'without' && hasReflection) return false;
      }

      return true;
    });
  }, [allFeedback, filters]);

  // Group feedback by month
  const groupedFeedback = useMemo(() => {
    const groups: { [key: string]: FeedbackWithContext[] } = {};
    
    filteredFeedback.forEach((item) => {
      const date = new Date(item.session.scheduledAt);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(item);
    });

    return Object.entries(groups).map(([month, items]) => ({
      month,
      items,
    }));
  }, [filteredFeedback]);

  // Stats
  const totalFeedback = allFeedback.length;
  const unreadCount = allFeedback.filter(f => !f.feedback.parentReflection).length; // Using reflection as proxy for "read"
  const needsReflectionCount = allFeedback.filter(f => !f.feedback.parentReflection).length;

  // Capacity summary
  const capacitySummary = useMemo(() => {
    const summary: Record<Capacity, { high: number; moderate: number; developing: number }> = {
      curiosity: { high: 0, moderate: 0, developing: 0 },
      reasoning: { high: 0, moderate: 0, developing: 0 },
      expression: { high: 0, moderate: 0, developing: 0 },
      focus: { high: 0, moderate: 0, developing: 0 },
      collaboration: { high: 0, moderate: 0, developing: 0 },
      adaptability: { high: 0, moderate: 0, developing: 0 },
    };

    allFeedback.forEach(({ feedback }) => {
      feedback.capacityObservations.forEach((obs) => {
        if (obs.level !== 'not-observed') {
          summary[obs.capacity][obs.level]++;
        }
      });
    });

    return summary;
  }, [allFeedback]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feedback Journal</h1>
          <p className="text-gray-600">
            Review instructor observations and add your reflections
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-white rounded-xl px-4 py-2 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
            <p className="text-xl font-bold text-gray-900">{totalFeedback}</p>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Needs Reflection</p>
            <p className="text-xl font-bold text-amber-600">{needsReflectionCount}</p>
          </div>
        </div>
      </div>

      {/* Capacity Overview Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
        <h2 className="text-sm font-semibold text-amber-900 mb-3">Capacity Growth Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {(Object.entries(capacitySummary) as [Capacity, typeof capacitySummary.curiosity][]).map(([capacity, counts]) => {
            const config = CAPACITY_CONFIG[capacity];
            const total = counts.high + counts.moderate + counts.developing;
            const strongPercent = total > 0 ? Math.round((counts.high / total) * 100) : 0;
            
            return (
              <button
                key={capacity}
                onClick={() => setFilters(f => ({ ...f, capacity: f.capacity === capacity ? '' : capacity }))}
                className={`p-3 rounded-xl border transition-all text-left ${
                  filters.capacity === capacity
                    ? 'bg-white border-amber-400 shadow-md'
                    : 'bg-white/60 border-transparent hover:bg-white hover:border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{config.emoji}</span>
                  <span className="text-xs font-medium text-gray-700">{config.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-gray-900">{total}</span>
                  <span className="text-xs text-gray-500">obs.</span>
                </div>
                {total > 0 && (
                  <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${strongPercent}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <FeedbackFiltersBar
        filters={filters}
        onFiltersChange={setFilters}
        childrenData={childrenData}
        courses={allCourses}
        unreadCount={unreadCount}
      />

      {/* Feedback List */}
      <div className="space-y-8">
        {filteredFeedback.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <EmptyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-500 mb-6">
              {filters.childId || filters.courseId || filters.capacity || filters.dateRange !== 'all' || filters.hasReflection !== 'all'
                ? 'Try adjusting your filters to see more feedback.'
                : 'Feedback will appear here after sessions are completed.'}
            </p>
            {(filters.childId || filters.courseId || filters.capacity || filters.dateRange !== 'all' || filters.hasReflection !== 'all') && (
              <button
                onClick={() => setFilters({
                  childId: '',
                  courseId: '',
                  capacity: '',
                  dateRange: 'all',
                  hasReflection: 'all',
                })}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          groupedFeedback.map((group) => (
            <div key={group.month}>
              {/* Month Header */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-gray-900">{group.month}</h2>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-500">
                  {group.items.length} {group.items.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              {/* Feedback Cards */}
              <div className="space-y-4">
                {group.items.map((item) => (
                  <FeedbackEntryCard
                    key={item.feedback.id}
                    feedback={item.feedback}
                    session={item.session}
                    enrollment={item.enrollment}
                    child={item.child}
                    isNew={!item.feedback.parentReflection && isWithinDays(item.session.scheduledAt, 3)}
                    onSaveReflection={onSaveReflection}
                    defaultExpanded={expandedId === item.feedback.id}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Helper function
const isWithinDays = (dateStr: string, days: number): boolean => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= days && diffDays >= 0;
};

// Capacity config for the overview
const CAPACITY_CONFIG: Record<Capacity, { label: string; emoji: string }> = {
  curiosity: { label: 'Curiosity', emoji: '🔍' },
  reasoning: { label: 'Reasoning', emoji: '🧩' },
  expression: { label: 'Expression', emoji: '💬' },
  focus: { label: 'Focus', emoji: '🎯' },
  collaboration: { label: 'Collaboration', emoji: '🤝' },
  adaptability: { label: 'Adaptability', emoji: '🌱' },
};

// Icons
const EmptyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export default FeedbackJournalPage;