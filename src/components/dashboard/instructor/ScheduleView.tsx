import React, { useState, useMemo } from 'react';
import type { InstructorSession, InstructorDashboardData } from '../../../types/instructor';
import SessionCard from './SessionCard';

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type ViewMode = 'day' | 'week' | 'list';

interface ScheduleViewProps {
  dashboardData: InstructorDashboardData;
  allSessions: InstructorSession[];
  onSelectSession: (session: InstructorSession) => void;
  onStartSession: (session: InstructorSession) => void;
  onCompleteWrapUp: (session: InstructorSession) => void;
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

const formatDateHeader = (date: Date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
};

const getWeekDates = (baseDate: Date): Date[] => {
  const dates: Date[] = [];
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay()); // Start from Sunday

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// -----------------------------------------------------------------------------
// Wrap-Up Alert Banner
// -----------------------------------------------------------------------------

interface WrapUpAlertProps {
  sessions: InstructorSession[];
  onCompleteWrapUp: (session: InstructorSession) => void;
}

const WrapUpAlert: React.FC<WrapUpAlertProps> = ({ sessions, onCompleteWrapUp }) => {
  if (sessions.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <AlertIcon />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-1">
            {sessions.length} session{sessions.length > 1 ? 's' : ''} need wrap-up
          </h3>
          <p className="text-sm text-amber-700 mb-3">
            Complete wrap-up to record observations and earn your session rate.
          </p>
          <div className="space-y-2">
            {sessions.map(session => (
              <div 
                key={session.id}
                className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100"
              >
                <div>
                  <p className="font-medium text-gray-900">{session.courseName}</p>
                  <p className="text-sm text-gray-500">
                    {session.students.map(s => s.firstName).join(', ')} • 
                    Session {session.sessionNumber}
                  </p>
                </div>
                <button
                  onClick={() => onCompleteWrapUp(session)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Quick Stats
// -----------------------------------------------------------------------------

interface QuickStatsProps {
  todayCount: number;
  weekCount: number;
  pendingWrapUp: number;
  availablePickups: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  todayCount,
  weekCount,
  pendingWrapUp,
  availablePickups,
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-sm font-medium text-gray-500 mb-1">Today</p>
      <p className="text-2xl font-bold text-gray-900">{todayCount}</p>
      <p className="text-xs text-gray-500">sessions</p>
    </div>
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-sm font-medium text-gray-500 mb-1">This Week</p>
      <p className="text-2xl font-bold text-gray-900">{weekCount}</p>
      <p className="text-xs text-gray-500">sessions</p>
    </div>
    <div className={`rounded-xl border p-4 ${pendingWrapUp > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
      <p className={`text-sm font-medium mb-1 ${pendingWrapUp > 0 ? 'text-amber-700' : 'text-gray-500'}`}>
        Wrap-Up Pending
      </p>
      <p className={`text-2xl font-bold ${pendingWrapUp > 0 ? 'text-amber-900' : 'text-gray-900'}`}>
        {pendingWrapUp}
      </p>
      <p className={`text-xs ${pendingWrapUp > 0 ? 'text-amber-600' : 'text-gray-500'}`}>
        {pendingWrapUp > 0 ? 'action needed' : 'all done'}
      </p>
    </div>
    <div className={`rounded-xl border p-4 ${availablePickups > 0 ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
      <p className={`text-sm font-medium mb-1 ${availablePickups > 0 ? 'text-green-700' : 'text-gray-500'}`}>
        Available Pickups
      </p>
      <p className={`text-2xl font-bold ${availablePickups > 0 ? 'text-green-900' : 'text-gray-900'}`}>
        {availablePickups}
      </p>
      <p className={`text-xs ${availablePickups > 0 ? 'text-green-600' : 'text-gray-500'}`}>
        {availablePickups > 0 ? 'claim now' : 'none available'}
      </p>
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// Week View
// -----------------------------------------------------------------------------

interface WeekViewProps {
  weekDates: Date[];
  sessions: InstructorSession[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  weekDates,
  sessions,
  selectedDate,
  onSelectDate,
}) => {
  const today = new Date();

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(s => {
      const sessionDate = new Date(s.scheduledAt);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, idx) => {
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const daySessions = getSessionsForDate(date);
          const hasWrapUp = daySessions.some(s => s.status === 'wrap-up-pending');

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(date)}
              className={`
                relative flex flex-col items-center p-2 rounded-xl transition-all
                ${isSelected 
                  ? 'bg-corp-primary text-white' 
                  : isToday 
                    ? 'bg-blue-50 text-corp-primary'
                    : 'hover:bg-gray-50'
                }
              `}
            >
              <span className={`text-xs font-medium ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {date.getDate()}
              </span>
              
              {/* Session indicators */}
              {daySessions.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {daySessions.slice(0, 3).map((_, i) => (
                    <span 
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white/70' : hasWrapUp ? 'bg-amber-400' : 'bg-corp-primary'
                      }`}
                    />
                  ))}
                  {daySessions.length > 3 && (
                    <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                      +{daySessions.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Wrap-up indicator */}
              {hasWrapUp && !isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main Schedule View
// -----------------------------------------------------------------------------

const ScheduleView: React.FC<ScheduleViewProps> = ({
  dashboardData,
  allSessions,
  onSelectSession,
  onStartSession,
  onCompleteWrapUp,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate week dates based on offset
  const weekDates = useMemo(() => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + weekOffset * 7);
    return getWeekDates(baseDate);
  }, [weekOffset]);

  // Filter sessions for selected date
  const filteredSessions = useMemo(() => {
    if (viewMode === 'list') {
      return allSessions
        .filter(s => new Date(s.scheduledAt) >= new Date())
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    }

    return allSessions.filter(s => {
      const sessionDate = new Date(s.scheduledAt);
      return sessionDate.toDateString() === selectedDate.toDateString();
    }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }, [allSessions, selectedDate, viewMode]);

  // Group sessions by date for list view
  const groupedSessions = useMemo(() => {
    if (viewMode !== 'list') return {};

    return filteredSessions.reduce((acc, session) => {
      const dateKey = new Date(session.scheduledAt).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(session);
      return acc;
    }, {} as Record<string, InstructorSession[]>);
  }, [filteredSessions, viewMode]);

  // Calculate stats
  const todayCount = allSessions.filter(s => 
    new Date(s.scheduledAt).toDateString() === new Date().toDateString()
  ).length;

  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];
  const weekCount = allSessions.filter(s => {
    const d = new Date(s.scheduledAt);
    return d >= weekStart && d <= weekEnd;
  }).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-500">Manage your upcoming sessions</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarIcon />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {/* Wrap-Up Alert */}
      <WrapUpAlert 
        sessions={dashboardData.wrapUpPending} 
        onCompleteWrapUp={onCompleteWrapUp}
      />

      {/* Quick Stats */}
      <QuickStats
        todayCount={todayCount}
        weekCount={weekCount}
        pendingWrapUp={dashboardData.wrapUpPending.length}
        availablePickups={dashboardData.availableSessions.length}
      />

      {/* Week Navigation (for week view) */}
      {viewMode === 'week' && (
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset(prev => prev - 1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon />
          </button>
          <div className="text-center">
            <p className="font-semibold text-gray-900">
              {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <button
              onClick={() => {
                setWeekOffset(0);
                setSelectedDate(new Date());
              }}
              className="text-sm text-corp-primary hover:underline"
            >
              Go to today
            </button>
          </div>
          <button
            onClick={() => setWeekOffset(prev => prev + 1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <WeekView
          weekDates={weekDates}
          sessions={allSessions}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      )}

      {/* Sessions */}
      {viewMode === 'week' ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {formatDateHeader(selectedDate)}
          </h2>

          {filteredSessions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <CalendarIcon />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No sessions scheduled</h3>
              <p className="text-gray-500 text-sm">
                You don't have any sessions on this day.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onSelect={onSelectSession}
                  onStartSession={onStartSession}
                  onCompleteWrapUp={onCompleteWrapUp}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="space-y-6">
          {Object.entries(groupedSessions).map(([dateKey, sessions]) => (
            <div key={dateKey}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {formatDateHeader(new Date(dateKey))}
              </h3>
              <div className="space-y-2">
                {sessions.map(session => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onSelect={onSelectSession}
                    onStartSession={onStartSession}
                    onCompleteWrapUp={onCompleteWrapUp}
                    compact
                  />
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedSessions).length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <CalendarIcon />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No upcoming sessions</h3>
              <p className="text-gray-500 text-sm">
                Check back later or pick up available sessions.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Available Pickups Section */}
      {dashboardData.availableSessions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Available for Pickup
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.availableSessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onSelect={onSelectSession}
                onStartSession={onStartSession}
                onCompleteWrapUp={onCompleteWrapUp}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;