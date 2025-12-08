import React, { useState, useMemo } from 'react';
import type { Child, Session, Enrollment, Course } from '../../types/dashboard';
import SessionFiltersBar, { type SessionFilters } from './SessionFiltersBar';
import SessionListItem from './SessionListItem';
import SessionDetailPanel from './SessionDetailPanel';

interface SessionWithContext {
  session: Session;
  enrollment: Enrollment;
  child: Child;
}

// Extended enrollment type that includes allSessions
interface EnrollmentWithSessions extends Enrollment {
  allSessions?: Session[];
}

interface SessionsPageProps {
  childrenData: Child[];
  onJoinSession?: (session: Session) => void;
  onSaveReflection?: (sessionId: string, reflection: string) => void;
}

const SessionsPage: React.FC<SessionsPageProps> = ({
  childrenData,
  onJoinSession,
  onSaveReflection,
}) => {
  // State
  const [filters, setFilters] = useState<SessionFilters>({
    childId: '',
    courseId: '',
    status: 'all',
    delivery: 'all',
    dateRange: 'all',
  });
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedSession, setSelectedSession] = useState<SessionWithContext | null>(null);

  // Aggregate all sessions from all children's enrollments
  const allSessions = useMemo((): SessionWithContext[] => {
    const sessions: SessionWithContext[] = [];
    
    childrenData.forEach((child) => {
      child.activeEnrollments.forEach((enrollment) => {
        const enrollmentWithSessions = enrollment as EnrollmentWithSessions;
        
        // Use allSessions if available, otherwise fall back to nextSession
        const sessionsToAdd = enrollmentWithSessions.allSessions || 
          (enrollment.nextSession ? [enrollment.nextSession] : []);
        
        sessionsToAdd.forEach((session) => {
          sessions.push({
            session,
            enrollment,
            child,
          });
        });
      });
    });

    // Sort by date (upcoming first, then past)
    return sessions.sort((a, b) => {
      const dateA = new Date(a.session.scheduledAt);
      const dateB = new Date(b.session.scheduledAt);
      return dateA.getTime() - dateB.getTime();
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

  // Filter sessions based on current filters
  const filteredSessions = useMemo((): SessionWithContext[] => {
    return allSessions.filter((item) => {
      const { session, enrollment, child } = item;
      const sessionDate = new Date(session.scheduledAt);
      const now = new Date();

      // Child filter
      if (filters.childId && child.id !== filters.childId) return false;

      // Course filter
      if (filters.courseId && enrollment.course.id !== filters.courseId) return false;

      // Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'upcoming' && sessionDate < now) return false;
        if (filters.status === 'completed' && session.status !== 'completed') return false;
      }

      // Delivery filter
      if (filters.delivery !== 'all' && session.delivery !== filters.delivery) return false;

      // Date range filter
      if (filters.dateRange !== 'all') {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        switch (filters.dateRange) {
          case 'today':
            if (sessionDate < startOfToday || sessionDate >= endOfToday) return false;
            break;
          case 'week':
            if (sessionDate < startOfWeek || sessionDate >= endOfWeek) return false;
            break;
          case 'month':
            if (sessionDate < startOfMonth || sessionDate > endOfMonth) return false;
            break;
          case 'past':
            if (sessionDate >= now) return false;
            break;
        }
      }

      return true;
    });
  }, [allSessions, filters]);

  // Group sessions by date for display
  const groupedSessions = useMemo(() => {
    const groups: { [key: string]: SessionWithContext[] } = {};
    
    filteredSessions.forEach((item) => {
      const date = new Date(item.session.scheduledAt);
      const dateKey = date.toDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });

    return Object.entries(groups).map(([dateKey, sessions]) => ({
      date: new Date(dateKey),
      sessions,
    }));
  }, [filteredSessions]);

  // Format group header date
  const formatGroupDate = (date: Date): string => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle session join
  const handleJoinSession = (session: Session) => {
    if (session.online?.wherebyRoomUrl) {
      window.open(session.online.wherebyRoomUrl, '_blank');
    }
    onJoinSession?.(session);
  };

  // Stats
  const upcomingCount = allSessions.filter(s => new Date(s.session.scheduledAt) >= new Date()).length;
  const completedCount = allSessions.filter(s => s.session.status === 'completed').length;
  const totalCount = allSessions.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-600">
            Manage upcoming classes and review past sessions
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-white rounded-xl px-4 py-2 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Upcoming</p>
            <p className="text-xl font-bold text-amber-600">{upcomingCount}</p>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
            <p className="text-xl font-bold text-green-600">{completedCount}</p>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
            <p className="text-xl font-bold text-gray-600">{totalCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <SessionFiltersBar
        filters={filters}
        onFiltersChange={setFilters}
        childrenData={childrenData}
        courses={allCourses}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Session List */}
        <div className={`flex-1 space-y-6 ${selectedSession ? 'hidden lg:block lg:max-w-xl' : ''}`}>
          {filteredSessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <CalendarEmptyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-500 mb-6">
                {filters.status === 'all' && filters.childId === '' && filters.courseId === ''
                  ? "You don't have any sessions scheduled yet."
                  : 'Try adjusting your filters to see more sessions.'}
              </p>
              {(filters.childId || filters.courseId || filters.status !== 'all') && (
                <button
                  onClick={() => setFilters({
                    childId: '',
                    courseId: '',
                    status: 'all',
                    delivery: 'all',
                    dateRange: 'all',
                  })}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : viewMode === 'list' ? (
            // List View
            groupedSessions.map((group) => (
              <div key={group.date.toISOString()}>
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-lg font-bold text-gray-900">
                    {formatGroupDate(group.date)}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500">
                    {group.sessions.length} {group.sessions.length === 1 ? 'session' : 'sessions'}
                  </span>
                </div>

                {/* Session Cards */}
                <div className="space-y-3">
                  {group.sessions.map((item) => (
                    <SessionListItem
                      key={item.session.id}
                      session={item.session}
                      enrollment={item.enrollment}
                      child={item.child}
                      onSelect={() => setSelectedSession(item)}
                      onJoinSession={() => handleJoinSession(item.session)}
                      isSelected={selectedSession?.session.id === item.session.id}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Calendar View (simplified - would use a proper calendar library in production)
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Calendar view coming soon</p>
                <p className="text-sm text-gray-400 mt-1">
                  Switch to list view to see your sessions
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedSession && (
          <div className="flex-1 lg:max-w-xl">
            <SessionDetailPanel
              session={selectedSession.session}
              enrollment={selectedSession.enrollment}
              child={selectedSession.child}
              onClose={() => setSelectedSession(null)}
              onJoinSession={handleJoinSession}
              onSaveReflection={onSaveReflection}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
const CalendarEmptyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default SessionsPage;