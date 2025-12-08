import React from 'react';
import type { SessionWithChild } from '../../types/dashboard';
import { isSessionJoinable } from '../../data/mockDashboardData';

interface UpcomingSessionCardProps {
  session: SessionWithChild;
  onJoinSession?: (session: SessionWithChild) => void;
}

const UpcomingSessionCard: React.FC<UpcomingSessionCardProps> = ({ session, onJoinSession }) => {
  const isOnline = session.delivery === 'online';
  const canJoin = isOnline && isSessionJoinable(session);

  // Format date/time
  const formatDateTime = (isoDate: string): { date: string; time: string; isToday: boolean; isTomorrow: boolean } => {
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
      dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return { date: dateStr, time: timeStr, isToday, isTomorrow };
  };

  const { date, time, isToday, isTomorrow } = formatDateTime(session.scheduledAt);

  // Get urgency styling
  const getUrgencyStyles = () => {
    if (canJoin) {
      return {
        card: 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50',
        badge: 'bg-green-500 text-white',
        badgeText: 'Join Now',
      };
    }
    if (isToday) {
      return {
        card: 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50',
        badge: 'bg-amber-500 text-white',
        badgeText: 'Today',
      };
    }
    if (isTomorrow) {
      return {
        card: 'border-blue-100 bg-white',
        badge: 'bg-blue-100 text-blue-700',
        badgeText: 'Tomorrow',
      };
    }
    return {
      card: 'border-gray-100 bg-white',
      badge: 'bg-gray-100 text-gray-600',
      badgeText: date,
    };
  };

  const styles = getUrgencyStyles();

  return (
    <div className={`rounded-xl border-2 ${styles.card} p-4 transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start gap-4">
        {/* Time Column */}
        <div className="flex-shrink-0 text-center min-w-[60px]">
          <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${styles.badge}`}>
            {styles.badgeText}
          </span>
          <p className="mt-2 text-lg font-bold text-gray-900">{time}</p>
          <p className="text-xs text-gray-500">{session.durationMinutes} min</p>
        </div>

        {/* Divider */}
        <div className="w-px h-20 bg-gray-200 flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Child Name */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              {session.childFirstName}
            </span>
            <span className="text-xs text-gray-500">
              Session {session.sessionNumber}
            </span>
          </div>

          {/* Course Title */}
          <h4 className="font-semibold text-gray-900 mb-1 truncate">
            {session.courseName}
          </h4>

          {/* Instructor & Location */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <UserIcon className="w-4 h-4" />
              {session.instructorName}
            </span>
            <span className="flex items-center gap-1">
              {isOnline ? (
                <>
                  <VideoIcon className="w-4 h-4" />
                  Online
                </>
              ) : (
                <>
                  <MapPinIcon className="w-4 h-4" />
                  {session.location?.room || session.location?.centerName || 'In Person'}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          {canJoin ? (
            <button
              onClick={() => onJoinSession?.(session)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <VideoIcon className="w-4 h-4" />
              Join
            </button>
          ) : isOnline ? (
            <button
              disabled
              className="px-4 py-2 bg-gray-100 text-gray-400 font-medium rounded-lg cursor-not-allowed flex items-center gap-2"
            >
              <ClockIcon className="w-4 h-4" />
              Waiting
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <MapPinIcon className="w-4 h-4" />
              Directions
            </button>
          )}
        </div>
      </div>

      {/* Online session join info */}
      {isOnline && !canJoin && session.online && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <span className="font-medium">Join link available:</span>{' '}
            {new Date(session.online.joinableFrom).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })} (10 min before class)
          </p>
        </div>
      )}
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

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default UpcomingSessionCard;
