import React from 'react';
import type { Enrollment, Session, Capacity } from '../../types/dashboard';

interface EnrollmentProgressCardProps {
  enrollment: Enrollment;
  nextSession?: Session;
  onViewCourse?: () => void;
  onViewSessions?: () => void;
}

const CAPACITY_EMOJI: Record<Capacity, string> = {
  curiosity: '🔍',
  reasoning: '🧩',
  expression: '💬',
  focus: '🎯',
  collaboration: '🤝',
  adaptability: '🌱',
};

const EnrollmentProgressCard: React.FC<EnrollmentProgressCardProps> = ({
  enrollment,
  nextSession,
  onViewCourse,
  onViewSessions,
}) => {
  const progressPercent = (enrollment.sessionsCompleted / enrollment.sessionsTotal) * 100;
  const remainingSessions = enrollment.sessionsTotal - enrollment.sessionsCompleted;
  
  const statusConfig = {
    'active': { label: 'Active', color: 'bg-green-100 text-green-700' },
    'completed': { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
    'upcoming': { label: 'Starting Soon', color: 'bg-amber-100 text-amber-700' },
    'paused': { label: 'Paused', color: 'bg-gray-100 text-gray-700' },
    'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  };

  const status = statusConfig[enrollment.status];

  // Format next session
  const formatNextSession = (session: Session): string => {
    const date = new Date(session.scheduledAt);
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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Course Image Header */}
      <div className="relative h-32 bg-gradient-to-br from-amber-400 to-orange-500">
        {enrollment.course.heroImage && (
          <img
            src={enrollment.course.heroImage}
            alt={enrollment.course.title}
            className="w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
          {status.label}
        </div>

        {/* Course Title */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-bold text-white line-clamp-1">{enrollment.course.title}</h3>
          <p className="text-sm text-white/80">
            with {enrollment.course.instructor.firstName} {enrollment.course.instructor.lastName}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {enrollment.sessionsCompleted} / {enrollment.sessionsTotal} sessions
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {remainingSessions} {remainingSessions === 1 ? 'session' : 'sessions'} remaining
          </p>
        </div>

        {/* Next Session */}
        {nextSession && enrollment.status === 'active' && (
          <div className="bg-amber-50 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Next Session</p>
                <p className="text-sm font-semibold text-gray-900">{formatNextSession(nextSession)}</p>
              </div>
              {nextSession.delivery === 'online' && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg">
                  Online
                </span>
              )}
              {nextSession.delivery === 'in-person' && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg">
                  In-Person
                </span>
              )}
            </div>
          </div>
        )}

        {/* Capacities Being Developed */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Developing</p>
          <div className="flex flex-wrap gap-2">
            {enrollment.course.capacitiesDeveloped.map((capacity) => (
              <span
                key={capacity}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700"
              >
                <span>{CAPACITY_EMOJI[capacity]}</span>
                <span className="capitalize">{capacity}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Course Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {enrollment.course.format === 'group' ? 'Group' : '1:1'}
          </span>
          <span className="flex items-center gap-1">
            <UsersIcon className="w-3.5 h-3.5" />
            Ages {enrollment.course.ageRange.min}-{enrollment.course.ageRange.max}
          </span>
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            Since {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onViewSessions}
            className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            View Sessions
          </button>
          <button
            onClick={onViewCourse}
            className="py-2 px-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-xl transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Icons
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default EnrollmentProgressCard;