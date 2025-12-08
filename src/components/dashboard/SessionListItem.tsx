import React from 'react';
import type { Session, Enrollment, Child } from '../../types/dashboard';

interface SessionListItemProps {
  session: Session;
  enrollment: Enrollment;
  child: Child;
  onSelect: (session: Session) => void;
  onJoinSession?: (session: Session) => void;
  isSelected?: boolean;
}

const SessionListItem: React.FC<SessionListItemProps> = ({
  session,
  enrollment,
  child,
  onSelect,
  onJoinSession,
  isSelected = false,
}) => {
  const isOnline = session.delivery === 'online';
  const isPast = new Date(session.scheduledAt) < new Date();
  const hasFeedback = !!session.feedback;

  // Check if session is joinable (within 10 min window)
  const isJoinable = (): boolean => {
    if (!isOnline || !session.online) return false;
    const now = new Date();
    const joinableFrom = new Date(session.online.joinableFrom);
    const sessionEnd = new Date(new Date(session.scheduledAt).getTime() + session.durationMinutes * 60 * 1000);
    return now >= joinableFrom && now <= sessionEnd && session.status !== 'completed';
  };

  const canJoin = isJoinable();

  // Format date/time
  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    let dateStr: string;
    if (isToday) {
      dateStr = 'Today';
    } else if (isTomorrow) {
      dateStr = 'Tomorrow';
    } else {
      dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }

    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });

    return { dateStr, timeStr, isToday, isTomorrow };
  };

  const { dateStr, timeStr, isToday, isTomorrow } = formatDateTime(session.scheduledAt);

  // Get status badge styling
  const getStatusBadge = () => {
    if (canJoin) {
      return { bg: 'bg-green-100', text: 'text-green-700', label: 'Join Now', dot: 'bg-green-500' };
    }
    switch (session.status) {
      case 'scheduled':
        if (isToday) return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Today', dot: 'bg-amber-500' };
        if (isTomorrow) return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Tomorrow', dot: 'bg-blue-500' };
        return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Scheduled', dot: 'bg-gray-400' };
      case 'completed':
        return { bg: 'bg-green-50', text: 'text-green-600', label: 'Completed', dot: 'bg-green-400' };
      case 'cancelled':
        return { bg: 'bg-red-50', text: 'text-red-600', label: 'Cancelled', dot: 'bg-red-400' };
      case 'no-show':
        return { bg: 'bg-orange-50', text: 'text-orange-600', label: 'No Show', dot: 'bg-orange-400' };
      case 'in-progress':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'In Progress', dot: 'bg-green-500 animate-pulse' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', label: session.status, dot: 'bg-gray-400' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      onClick={() => onSelect(session)}
      className={`
        bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-amber-400 shadow-md ring-2 ring-amber-100' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
        }
        ${isPast && session.status === 'completed' ? 'opacity-90' : ''}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Date/Time Column */}
          <div className="flex-shrink-0 w-20 text-center">
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
              {statusBadge.label}
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900">{dateStr}</p>
            <p className="text-sm text-gray-500">{timeStr}</p>
            <p className="text-xs text-gray-400 mt-1">{session.durationMinutes} min</p>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Child & Session Number */}
            <div className="flex items-center gap-2 mb-2">
              <img
                src={child.photoUrl || `https://ui-avatars.com/api/?name=${child.firstName}&background=FFC72C&color=1E1E1E&size=24`}
                alt={child.firstName}
                className="w-6 h-6 rounded-full border border-amber-200"
              />
              <span className="text-sm font-medium text-gray-900">{child.firstName}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500">
                Session {session.sessionNumber} of {enrollment.sessionsTotal}
              </span>
            </div>

            {/* Course Title */}
            <h3 className="font-semibold text-gray-900 mb-1 truncate">
              {enrollment.course.title}
            </h3>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              {/* Instructor */}
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-4 h-4" />
                {enrollment.course.instructor.firstName} {enrollment.course.instructor.lastName}
              </span>

              {/* Delivery Type */}
              <span className="flex items-center gap-1.5">
                {isOnline ? (
                  <>
                    <VideoIcon className="w-4 h-4" />
                    Online
                  </>
                ) : (
                  <>
                    <MapPinIcon className="w-4 h-4" />
                    {session.location?.room || session.location?.centerName || 'In-Person'}
                  </>
                )}
              </span>

              {/* Feedback Indicator */}
              {hasFeedback && (
                <span className="flex items-center gap-1.5 text-green-600">
                  <CheckCircleIcon className="w-4 h-4" />
                  Feedback available
                </span>
              )}

              {/* Format Badge */}
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                enrollment.course.format === 'one-on-one' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {enrollment.course.format === 'one-on-one' ? '1:1' : 'Group'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {canJoin ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoinSession?.(session);
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <VideoIcon className="w-4 h-4" />
                Join
              </button>
            ) : !isPast && isOnline ? (
              <div className="text-right">
                <span className="text-xs text-gray-400 block">Join available</span>
                <span className="text-xs text-gray-500 font-medium">
                  {new Date(session.online!.joinableFrom).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ) : !isPast && !isOnline ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Open directions
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(session.location?.address || '')}`,
                    '_blank'
                  );
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <MapPinIcon className="w-4 h-4" />
                Directions
              </button>
            ) : hasFeedback ? (
              <span className="px-3 py-2 bg-amber-100 text-amber-700 font-medium rounded-lg flex items-center gap-2">
                <BookOpenIcon className="w-4 h-4" />
                View Feedback
              </span>
            ) : null}

            {/* Expand Arrow */}
            <ChevronRightIcon className={`w-5 h-5 text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </div>

      {/* Progress Bar (for enrollment progress) */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all"
              style={{ width: `${(enrollment.sessionsCompleted / enrollment.sessionsTotal) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {enrollment.sessionsCompleted}/{enrollment.sessionsTotal}
          </span>
        </div>
      </div>
    </div>
  );
};

// Icons
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const VideoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BookOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default SessionListItem;
