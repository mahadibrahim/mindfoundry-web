import React from 'react';
import type { InstructorSession } from '../../../types/instructor';

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

const VideoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

interface SessionCardProps {
  session: InstructorSession;
  onSelect: (session: InstructorSession) => void;
  onStartSession?: (session: InstructorSession) => void;
  onCompleteWrapUp?: (session: InstructorSession) => void;
  compact?: boolean;
}

// -----------------------------------------------------------------------------
// Status Badge Component
// -----------------------------------------------------------------------------

const StatusBadge: React.FC<{ status: InstructorSession['status'] }> = ({ status }) => {
  const config: Record<InstructorSession['status'], { label: string; bg: string; text: string; dot: string }> = {
    assigned: { label: 'Scheduled', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    pending: { label: 'Pending', bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
    'coverage-needed': { label: 'Coverage Needed', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    available: { label: 'Available', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    completed: { label: 'Completed', bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
    'wrap-up-pending': { label: 'Needs Wrap-Up', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  };

  const c = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// -----------------------------------------------------------------------------
// Session Card Component
// -----------------------------------------------------------------------------

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onSelect,
  onStartSession,
  onCompleteWrapUp,
  compact = false,
}) => {
  const sessionDate = new Date(session.scheduledAt);
  const now = new Date();
  const isToday = sessionDate.toDateString() === now.toDateString();
  const isPast = sessionDate < now;
  const isOnline = session.delivery === 'online';
  const isGroup = session.format === 'group';

  // Check if session is joinable (within 10 minutes of start)
  const joinableTime = session.online ? new Date(session.online.joinableFrom) : null;
  const isJoinable = joinableTime && now >= joinableTime && !isPast;
  const needsWrapUp = session.status === 'wrap-up-pending';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    if (isToday) return 'Today';
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Determine card styling based on state
  const getCardClasses = () => {
    let base = 'bg-white rounded-xl border transition-all cursor-pointer';
    
    if (needsWrapUp) {
      return `${base} border-amber-300 ring-2 ring-amber-100 shadow-md hover:shadow-lg`;
    }
    if (isJoinable) {
      return `${base} border-green-300 ring-2 ring-green-100 shadow-md hover:shadow-lg`;
    }
    if (session.status === 'available') {
      return `${base} border-green-200 hover:border-green-300 hover:shadow-md`;
    }
    return `${base} border-gray-100 hover:border-gray-200 hover:shadow-md`;
  };

  if (compact) {
    return (
      <button
        onClick={() => onSelect(session)}
        className={`${getCardClasses()} p-3 w-full text-left`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-14 text-center">
            <p className="text-sm font-semibold text-gray-900">{formatTime(sessionDate)}</p>
            <p className="text-xs text-gray-500">{session.durationMinutes}m</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{session.courseName}</p>
            <p className="text-sm text-gray-500">
              {session.students.length > 0 
                ? session.students.map(s => s.firstName).join(', ')
                : 'No students assigned'}
            </p>
          </div>
          <StatusBadge status={session.status} />
          <ChevronRightIcon />
        </div>
      </button>
    );
  }

  return (
    <div 
      onClick={() => onSelect(session)}
      className={getCardClasses()}
    >
      {/* Header with course image */}
      <div className="relative h-24 rounded-t-xl overflow-hidden">
        <img
          src={session.courseHeroImage || 'https://placehold.co/400x200/011F4B/FFFFFF?text=Course'}
          alt={session.courseName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-3 right-3">
          <StatusBadge status={session.status} />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-white text-lg truncate">{session.courseName}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Date/Time Row */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2 text-gray-900">
            <ClockIcon />
            <span className="font-semibold">{formatDate(sessionDate)}</span>
            <span className="text-gray-400">•</span>
            <span>{formatTime(sessionDate)}</span>
          </div>
          <span className="text-sm text-gray-500">
            {session.durationMinutes} min
          </span>
        </div>

        {/* Session Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1.5">
            {isOnline ? <VideoIcon /> : <MapPinIcon />}
            {isOnline ? 'Online' : session.location?.centerName}
          </span>
          <span className="flex items-center gap-1.5">
            {isGroup ? <UsersIcon /> : <UserIcon />}
            {isGroup ? 'Group' : '1:1'}
          </span>
          <span className="text-gray-400">
            Session {session.sessionNumber}/{session.totalSessions}
          </span>
        </div>

        {/* Students */}
        {session.students.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {session.students.slice(0, 4).map((student, idx) => (
                <img
                  key={student.childId}
                  src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.firstName}&background=FFC72C&color=1E1E1E&size=32`}
                  alt={student.firstName}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{ zIndex: 4 - idx }}
                />
              ))}
              {session.students.length > 4 && (
                <span className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                  +{session.students.length - 4}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {session.students.map(s => s.firstName).join(', ')}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {needsWrapUp && onCompleteWrapUp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompleteWrapUp(session);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
            >
              <AlertIcon />
              Complete Wrap-Up
            </button>
          )}

          {isJoinable && isOnline && onStartSession && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartSession(session);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              <VideoIcon />
              Start Session
            </button>
          )}

          {session.status === 'available' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle claim
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-corp-primary hover:bg-corp-primary/90 text-white font-semibold rounded-lg transition-colors"
            >
              Claim Session
            </button>
          )}

          {!needsWrapUp && !isJoinable && session.status !== 'available' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(session);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              View Details
              <ChevronRightIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;